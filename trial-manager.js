/* ═══════════════════════════════════════════════════════════════════
   TRIAL MANAGER — Quản lý tài khoản học thử & Hạn mức LMS Vật Lý Xuân Trường
   Phiên bản: 2.1.0 (2026-09-14)
   - Xác thực phiên bằng token server-side (không tin SĐT do client tự gửi).
   - Ngăn chặn triệt để việc đọc trộm hoặc tiêu hao lượt của SĐT khác.
   - PESSIMISTIC / FAIL-CLOSED: Luồng mở bài mới bắt buộc chờ server cấp quyền trước khi xem.
   - Không ghi trước vào local, không fail-open qua queue khi mất mạng.
   - Bài cũ đã xác nhận được xem lại tự do ngay cả khi mất mạng.
   - Chống trùng lặp (idempotent) và khóa độc quyền chống race condition.
═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var TRIAL_MAX_DAILY_NEW_LESSONS = 2;
  var TRIAL_CONFIRMED_PREFIX = 'vlxt_trial_confirmed_';
  var TRIAL_DISMISSED_PREREQ_PREFIX = 'vlxt_skip_prereq_';

  // 1. Phân loại tài khoản chặt chẽ
  function vlxtIsPremiumUser(user) {
    if (!user) return false;
    var loai = String(user.loaiTK || '').trim().toLowerCase();
    return loai === 'premium';
  }

  // Chỉ VIP còn hạn dùng thử mới được tính là Trial hợp lệ
  function vlxtIsValidTrialUser(user) {
    if (!user) return false;
    if (typeof global.isTestAccount === 'function' && global.isTestAccount()) {
      return false; // Tài khoản test của Thầy: mở tự do
    }
    var loai = String(user.loaiTK || '').trim().toLowerCase();
    if (loai !== 'vip' && loai !== 'trial') {
      return false; // Free hoặc loại khác không được hưởng trial soft unlock
    }
    var expiry = Number(user.trialExpiry || 0);
    // Phải có hạn dùng thử và hạn dùng thử phải lớn hơn thời điểm hiện tại
    if (!expiry || expiry <= Date.now()) {
      return false; // Trial hết hạn -> không được mở mềm
    }
    return true;
  }

  function vlxtIsTrialUser(user) {
    return vlxtIsValidTrialUser(user);
  }

  // 2. Múi giờ Việt Nam (UTC+7, Asia/Saigon)
  function vlxtGetVietnamDateStr(timestamp) {
    try {
      var d = timestamp ? new Date(timestamp) : new Date();
      var formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Saigon',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return formatter.format(d); // 'YYYY-MM-DD'
    } catch (e) {
      var target = timestamp ? new Date(timestamp) : new Date();
      var utc = target.getTime() + (target.getTimezoneOffset() * 60000);
      var vnDate = new Date(utc + (7 * 3600000));
      var y = vnDate.getFullYear();
      var m = String(vnDate.getMonth() + 1).padStart(2, '0');
      var day = String(vnDate.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }
  }

  // 3. Phân tích bài nền tảng (BaiNenTang)
  function vlxtParsePrerequisites(val) {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(function (x) { return String(x || '').trim(); }).filter(Boolean);
    }
    if (typeof val === 'string') {
      var trimmed = val.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          var arr = JSON.parse(trimmed);
          if (Array.isArray(arr)) {
            return arr.map(function (x) { return String(x || '').trim(); }).filter(Boolean);
          }
        } catch (e) {}
      }
      return trimmed.split(/[,;|]+/).map(function (s) { return s.trim(); }).filter(Boolean);
    }
    return [];
  }

  function normStr(s) {
    return (s === null || s === undefined) ? '' : String(s).trim().normalize('NFC').toLowerCase();
  }

  function normSdt(s) {
    return String(s || '').replace(/\D/g, '').replace(/^0+/, '');
  }

  // Tìm bài học trong toàn bộ khoá theo: MaBai -> key -> legacyKey -> TenBai
  function vlxtFindLessonByIdentifier(identifier, allCourses) {
    if (!identifier || !Array.isArray(allCourses)) return null;
    var target = normStr(identifier);
    if (!target) return null;

    // 1st pass: khớp MaBai hoặc key
    for (var i = 0; i < allCourses.length; i++) {
      var c = allCourses[i];
      if (!c || !c.chapters) continue;
      for (var j = 0; j < c.chapters.length; j++) {
        var ch = c.chapters[j];
        if (!ch || !ch.lessons) continue;
        for (var k = 0; k < ch.lessons.length; k++) {
          var l = ch.lessons[k];
          if (l.mabai && normStr(l.mabai) === target) return l;
          if (l.key && normStr(l.key) === target) return l;
        }
      }
    }

    // 2nd pass: khớp legacyKey hoặc TenBai
    for (var ci = 0; ci < allCourses.length; ci++) {
      var crs = allCourses[ci];
      if (!crs || !crs.chapters) continue;
      for (var cji = 0; cji < crs.chapters.length; cji++) {
        var chp = crs.chapters[cji];
        if (!chp || !chp.lessons) continue;
        for (var cki = 0; cki < chp.lessons.length; cki++) {
          var lsn = chp.lessons[cki];
          if (lsn.legacyKey && normStr(lsn.legacyKey) === target) return lsn;
          if (lsn.name && normStr(lsn.name) === target) return lsn;
        }
      }
    }
    return null;
  }

  // Lọc ra danh sách bài nền tảng chưa hoàn thành
  function vlxtGetUnfinishedPrerequisites(lesson, allCourses, watchedSet) {
    if (!lesson) return [];
    var prereqIdentifiers = vlxtParsePrerequisites(
      lesson.bainentang || lesson.BaiNenTang || lesson.prerequisites || ''
    );
    if (!prereqIdentifiers.length) return [];

    var ws = watchedSet || new Set();
    var unfinished = [];

    prereqIdentifiers.forEach(function (id) {
      var found = vlxtFindLessonByIdentifier(id, allCourses);
      if (found) {
        var isDone = ws.has(found.key) || (found.mabai && ws.has(found.mabai));
        if (!isDone) {
          unfinished.push(found);
        }
      } else {
        unfinished.push({ key: id, mabai: id, name: id, notFoundInCourses: true });
      }
    });

    return unfinished;
  }

  // 4. Quản lý danh sách bài ĐÃ ĐƯỢC SERVER XÁC NHẬN (Server-Confirmed)
  // Chỉ những bài server đã cấp quyền mới được lưu vào đây
  function vlxtGetServerConfirmedLessons(sdt) {
    if (!sdt) return [];
    try {
      var raw = localStorage.getItem(TRIAL_CONFIRMED_PREFIX + sdt);
      var arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function vlxtSaveServerConfirmedLessons(sdt, list) {
    if (!sdt) return;
    try {
      localStorage.setItem(TRIAL_CONFIRMED_PREFIX + sdt, JSON.stringify(list || []));
    } catch (e) {}
  }

  function vlxtIsServerConfirmedLesson(sdt, lessonKey, watchedSet) {
    if (watchedSet && watchedSet.has(lessonKey)) return true;
    if (!sdt) return false;
    var list = vlxtGetServerConfirmedLessons(sdt);
    return list.some(function (item) {
      return item.key === lessonKey || (item.mabai && item.mabai === lessonKey);
    });
  }

  function vlxtGetDailyConfirmedCount(sdt, dateStr) {
    if (!sdt) return 0;
    var targetDate = dateStr || vlxtGetVietnamDateStr();
    var list = vlxtGetServerConfirmedLessons(sdt);
    var filtered = list.filter(function (item) {
      return item.date === targetDate;
    });
    return filtered.length;
  }

  // 5. Xác thực Server-side: Kéo trạng thái hạn mức từ server về local
  // Sử dụng token phiên đăng nhập (bảo vệ chống đọc trộm dữ liệu người khác)
  function vlxtFetchTrialLimitServer(userOrSdt) {
    var user = (typeof userOrSdt === 'object' && userOrSdt !== null) ? userOrSdt : null;
    var sdt = user ? (user.sdt || '') : String(userOrSdt || '').trim();
    var token = user ? (user.token || user.authToken || '') : '';

    if (!sdt) return Promise.resolve(null);
    var gasUrl = (typeof global.VLXT_GAS !== 'undefined') ? global.VLXT_GAS : ((typeof global.APPS_SCRIPT_URL !== 'undefined') ? global.APPS_SCRIPT_URL : '');
    if (!gasUrl) return Promise.resolve(null);

    return fetch(gasUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'gettriallimit',
        sdt: sdt,
        token: token
      })
    })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) return res;
        var serverStarted = res.startedLessons || [];
        var localConfirmed = vlxtGetServerConfirmedLessons(sdt);

        // Hợp nhất danh sách server vào local
        var map = new Map();
        localConfirmed.forEach(function (item) { if (item.key) map.set(item.key, item); });
        serverStarted.forEach(function (item) {
          var k = item.key || item.mabai;
          if (k && !map.has(k)) {
            map.set(k, {
              key: k,
              mabai: item.mabai || k,
              name: item.name || k,
              course: item.course || '',
              date: item.date || item.dateStr || vlxtGetVietnamDateStr(item.timestamp),
              timestamp: Number(item.timestamp || Date.now())
            });
          }
        });

        var merged = Array.from(map.values());
        vlxtSaveServerConfirmedLessons(sdt, merged);
        return res;
      })
      .catch(function (err) {
        console.warn('Không kết nối được server trial limit:', err);
        return null;
      });
  }

  // 6. Kiểm tra quyền mở bài tại giao diện danh sách (Soft Unlock + Daily Limit)
  function vlxtCanAccessTrialLesson(userOrSdt, lesson, allCourses, watchedSet) {
    if (!lesson) return { allowed: false, reason: 'not_found' };

    // Bài trống không có nội dung bị chặn tuyệt đối
    var hasContent = !!(lesson.video || lesson.pdf || lesson.pdflt || lesson.pdfluyentap || lesson.videogiai || (lesson.baitap && lesson.baitap.length > 0) || Number(lesson._quizCount) > 0);
    if (!hasContent) {
      return { allowed: false, reason: 'empty' };
    }

    var sdt = (typeof userOrSdt === 'object' && userOrSdt !== null) ? (userOrSdt.sdt || '') : String(userOrSdt || '').trim();
    var ws = watchedSet || new Set();
    var isConfirmed = vlxtIsServerConfirmedLesson(sdt, lesson.key, ws);

    // Ôn lại bài cũ (đã từng được server xác nhận hoặc đã watched): MIỄN PHÍ KHÔNG GIỚI HẠN
    if (isConfirmed) {
      return {
        allowed: true,
        isOldLesson: true,
        remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - vlxtGetDailyConfirmedCount(sdt)),
        unfinishedPrereqs: vlxtGetUnfinishedPrerequisites(lesson, allCourses, ws)
      };
    }

    // Bài mới: kiểm tra hạn mức 2 bài/ngày theo giờ VN
    var todayVN = vlxtGetVietnamDateStr();
    var dailyCount = vlxtGetDailyConfirmedCount(sdt, todayVN);

    if (dailyCount >= TRIAL_MAX_DAILY_NEW_LESSONS) {
      return {
        allowed: false,
        reason: 'trial_limit',
        dailyCount: dailyCount,
        maxDaily: TRIAL_MAX_DAILY_NEW_LESSONS,
        nextResetDate: todayVN,
        nextResetMsg: '00:00 ngày mai (theo giờ Việt Nam)',
        startedLessons: vlxtGetServerConfirmedLessons(sdt)
      };
    }

    return {
      allowed: true,
      isOldLesson: false,
      isNewTrial: true,
      dailyCount: dailyCount,
      remaining: TRIAL_MAX_DAILY_NEW_LESSONS - dailyCount,
      unfinishedPrereqs: vlxtGetUnfinishedPrerequisites(lesson, allCourses, ws)
    };
  }

  // 7. YÊU CẦU CẤP QUYỀN MỞ BÀI TỪ MÁY CHỦ (PESSIMISTIC / FAIL-CLOSED)
  // Luồng mở bài mới BẮT BUỘC phải qua hàm này trước khi xem video/nội dung.
  // Tuyệt đối không ghi trước vào local, không fail-open qua queue khi mất mạng.
  function vlxtRequestTrialAccess(user, lesson, courseName) {
    if (!user || !user.sdt) {
      return Promise.resolve({ ok: false, reason: 'invalid_account', error: 'Unauthorized', msg: 'Yêu cầu đăng nhập' });
    }
    if (!lesson) {
      return Promise.resolve({ ok: false, reason: 'not_found', msg: 'Không tìm thấy bài học' });
    }

    var sdt = String(user.sdt).trim();
    var lkey = lesson.key || lesson;
    var mb = lesson.mabai || '';
    var token = user.token || user.authToken || '';

    // Nếu bài này đã được server xác nhận trước đó: mở tự do (xem lại bài cũ an toàn)
    if (vlxtIsServerConfirmedLesson(sdt, lkey)) {
      var existDaily = vlxtGetDailyConfirmedCount(sdt);
      return Promise.resolve({
        ok: true,
        isNew: false,
        alreadyStarted: true,
        dailyCount: existDaily,
        remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - existDaily)
      });
    }

    // BÀI MỚI: BẮT BUỘC GỌI SERVER XÁC THỰC
    var gasUrl = (typeof global.VLXT_GAS !== 'undefined') ? global.VLXT_GAS : ((typeof global.APPS_SCRIPT_URL !== 'undefined') ? global.APPS_SCRIPT_URL : '');
    if (!gasUrl) {
      // Mất kết nối server: FAIL-CLOSED
      return Promise.resolve({
        ok: false,
        reason: 'network_error',
        msg: 'Không thể xác minh lượt học, vui lòng kiểm tra mạng'
      });
    }

    var payload = {
      action: 'starttriallesson',
      token: token,
      sdt: sdt,
      mabai: mb || lkey,
      key: lkey,
      course: courseName || '',
      deviceId: (typeof global.vlxtGetDeviceId === 'function') ? global.vlxtGetDeviceId() : ''
    };

    return fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (res) {
        if (res && res.ok) {
          // SERVER ĐÃ CHẤP NHẬN VÀ CẤP QUYỀN!
          // Lúc này MỚI ghi nhận vào danh sách server-confirmed ở local
          var list = vlxtGetServerConfirmedLessons(sdt);
          list.push({
            key: lkey,
            mabai: mb || lkey,
            name: lesson.name || '',
            course: courseName || '',
            date: vlxtGetVietnamDateStr(),
            timestamp: Date.now()
          });
          vlxtSaveServerConfirmedLessons(sdt, list);

          var todayVN = vlxtGetVietnamDateStr();
          var newDaily = vlxtGetDailyConfirmedCount(sdt, todayVN);

          return {
            ok: true,
            isNew: res.isNew !== false,
            dailyCount: res.dailyCount || newDaily,
            remaining: typeof res.remaining === 'number' ? res.remaining : Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - newDaily)
          };
        }

        // Server từ chối: trả về mã lỗi cụ thể (trial_limit, invalid_account, Unauthorized, Forbidden)
        return {
          ok: false,
          reason: res.reason || (res.error ? res.error.toLowerCase() : 'server_rejected'),
          error: res.error || '',
          msg: res.msg || 'Không được phép mở bài học',
          dailyCount: res.dailyCount || 2,
          remaining: res.remaining || 0
        };
      })
      .catch(function (err) {
        // Lỗi mạng hoặc server không truy cập được: FAIL-CLOSED (tạm khóa bài mới)
        console.warn('Lỗi kết nối máy chủ khi xác thực bài học thử:', err);
        return {
          ok: false,
          reason: 'network_error',
          msg: 'Không thể xác minh lượt học, vui lòng kiểm tra mạng'
        };
      });
  }

  // 8. Bỏ qua cảnh báo bài nền tảng trong phiên (Session Storage)
  function vlxtIsPrereqWarningDismissed(sdt, lessonKey) {
    if (typeof sessionStorage === 'undefined') return false;
    try {
      return sessionStorage.getItem(TRIAL_DISMISSED_PREREQ_PREFIX + sdt + '_' + lessonKey) === '1';
    } catch (e) {
      return false;
    }
  }

  function vlxtDismissPrereqWarning(sdt, lessonKey) {
    if (typeof sessionStorage === 'undefined') return;
    try {
      sessionStorage.setItem(TRIAL_DISMISSED_PREREQ_PREFIX + sdt + '_' + lessonKey, '1');
    } catch (e) {}
  }

  // 9. Helper tạo và xác thực token trong môi trường Test / Dev (BẮT BUỘC secret rõ ràng, không fallback)
  function vlxtCreateDevToken(sdt, secret, options) {
    if (!secret || typeof secret !== 'string' || !secret.trim()) {
      throw new Error('AUTH_SECRET_REQUIRED: Môi trường dev/test bắt buộc truyền secret, không có fallback');
    }
    var cleanSdt = normSdt(sdt);
    var now = Date.now();
    var issuedAt = (options && options.issuedAt) || now;
    var duration = (options && typeof options.duration === 'number') ? options.duration : 7 * 86400000;
    var expiresAt = (options && options.expiresAt) || (issuedAt + duration);
    var nonce = (options && options.nonce) || ('nonce_' + Math.random().toString(36).slice(2, 10));
    var raw = cleanSdt + ':' + issuedAt + ':' + expiresAt + ':' + nonce;

    if (typeof Buffer !== 'undefined') {
      var crypto = (typeof require === 'function') ? require('node:crypto') : (global.crypto || null);
      if (crypto && crypto.createHmac) {
        var sig = crypto.createHmac('sha256', secret).update(raw).digest('base64url');
        return Buffer.from(raw + ':' + sig).toString('base64url');
      }
    }
    try {
      return btoa(raw + ':dev_sig_' + secret);
    } catch (e) {
      return raw + ':dev_sig';
    }
  }

  function vlxtVerifyDevToken(token, secret) {
    if (!secret || typeof secret !== 'string' || !secret.trim()) {
      throw new Error('AUTH_SECRET_REQUIRED: Môi trường dev/test bắt buộc truyền secret, không có fallback');
    }
    if (!token) return null;
    try {
      var decoded = '';
      if (typeof Buffer !== 'undefined') {
        decoded = Buffer.from(token, 'base64url').toString('utf8');
      } else {
        decoded = atob(token);
      }
      var parts = decoded.split(':');
      if (parts.length !== 5) return null;
      var sdt = parts[0];
      var issuedAt = Number(parts[1]);
      var expiresAt = Number(parts[2]);
      var nonce = parts[3];
      var sig = parts[4];

      var now = Date.now();
      if (isNaN(issuedAt) || isNaN(expiresAt)) return null;
      if (now > expiresAt) return null; // Hết hạn
      if (issuedAt > now + 60000) return null; // Từ tương lai

      var raw = sdt + ':' + issuedAt + ':' + expiresAt + ':' + nonce;
      if (typeof Buffer !== 'undefined') {
        var crypto = (typeof require === 'function') ? require('node:crypto') : (global.crypto || null);
        if (crypto && crypto.createHmac) {
          var expectedSig = crypto.createHmac('sha256', secret).update(raw).digest('base64url');
          if (sig !== expectedSig) return null;
          return sdt;
        }
      }
      if (sig === 'dev_sig_' + secret) return sdt;
      return null;
    } catch (e) {
      return null;
    }
  }

  // Backward compatibility alias
  function vlxtGetTrialStartedLessons(sdt) {
    return vlxtGetServerConfirmedLessons(sdt);
  }

  function vlxtIsLessonStarted(sdt, lessonKey, watchedSet) {
    return vlxtIsServerConfirmedLesson(sdt, lessonKey, watchedSet);
  }

  function vlxtGetDailyNewLessonsCount(sdt, dateStr) {
    return vlxtGetDailyConfirmedCount(sdt, dateStr);
  }

  function vlxtRecordTrialLessonStart(sdt, lesson, courseName) {
    var curUser = (typeof global.vlxtGetUser === 'function') ? global.vlxtGetUser() : null;
    var user = curUser || { sdt: sdt };
    return vlxtRequestTrialAccess(user, lesson, courseName);
  }

  // Xuất API toàn cục
  var TrialManager = {
    MAX_DAILY: TRIAL_MAX_DAILY_NEW_LESSONS,
    isPremiumUser: vlxtIsPremiumUser,
    isValidTrialUser: vlxtIsValidTrialUser,
    isTrialUser: vlxtIsTrialUser,
    getVietnamDateStr: vlxtGetVietnamDateStr,
    parsePrerequisites: vlxtParsePrerequisites,
    findLessonByIdentifier: vlxtFindLessonByIdentifier,
    getUnfinishedPrerequisites: vlxtGetUnfinishedPrerequisites,
    getServerConfirmedLessons: vlxtGetServerConfirmedLessons,
    isServerConfirmedLesson: vlxtIsServerConfirmedLesson,
    getDailyConfirmedCount: vlxtGetDailyConfirmedCount,
    fetchTrialLimitServer: vlxtFetchTrialLimitServer,
    canAccessTrialLesson: vlxtCanAccessTrialLesson,
    requestTrialAccess: vlxtRequestTrialAccess,
    isPrereqWarningDismissed: vlxtIsPrereqWarningDismissed,
    dismissPrereqWarning: vlxtDismissPrereqWarning,
    createDevToken: vlxtCreateDevToken,
    verifyDevToken: vlxtVerifyDevToken,
    // Aliases
    getTrialStartedLessons: vlxtGetTrialStartedLessons,
    isLessonStarted: vlxtIsLessonStarted,
    getDailyNewLessonsCount: vlxtGetDailyNewLessonsCount,
    recordTrialLessonStart: vlxtRecordTrialLessonStart
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrialManager;
  }
  global.TrialManager = TrialManager;

})(typeof window !== 'undefined' ? window : global);
