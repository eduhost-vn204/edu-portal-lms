/* ═══════════════════════════════════════════════════════════════════
   TRIAL MANAGER — Quản lý tài khoản học thử & Hạn mức LMS Vật Lý Xuân Trường
   Phiên bản: 2.0.0 (2026-09-14)
   - Xác thực server-side thực sự, chống vượt hạn mức khi đổi thiết bị / xóa localStorage.
   - Nhận diện chuẩn: chỉ VIP còn hạn (trialExpiry > Date.now()) mới là Trial hợp lệ.
   - Free và Trial hết hạn giữ nguyên cấu hình hiện hành (không mở mềm 2 bài/ngày).
   - Chống trùng lặp (idempotent) và đồng bộ an toàn khi mạng yếu.
═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var TRIAL_MAX_DAILY_NEW_LESSONS = 2;
  var TRIAL_STARTED_PREFIX = 'vlxt_trial_started_';
  var TRIAL_QUEUE_KEY = 'vlxt_trial_queue_v2';
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
        for (var lki = 0; lki < chp.lessons.length; lki++) {
          var lsn = chp.lessons[lki];
          if (lsn.legacyKey && normStr(lsn.legacyKey) === target) return lsn;
          if (lsn.name && normStr(lsn.name) === target) return lsn;
        }
      }
    }

    return null;
  }

  // Lấy danh sách các bài nền tảng chưa hoàn thành
  function vlxtGetUnfinishedPrerequisites(lesson, allCourses, watchedSet) {
    if (!lesson) return [];
    var prereqKeys = vlxtParsePrerequisites(lesson.bainentang);
    if (!prereqKeys.length) return [];

    var ws = watchedSet || new Set();
    var unfinished = [];

    prereqKeys.forEach(function (id) {
      var found = vlxtFindLessonByIdentifier(id, allCourses);
      if (found) {
        var isDone = ws.has(found.key) || (found.mabai && ws.has(found.mabai)) || (found.legacyKey && ws.has(found.legacyKey));
        if (!isDone) {
          unfinished.push(found);
        }
      } else {
        var isDoneStub = ws.has(id);
        if (!isDoneStub) {
          unfinished.push({
            key: id,
            mabai: id,
            name: id,
            isStub: true
          });
        }
      }
    });

    return unfinished;
  }

  // 4. Quản lý trạng thái bài đã bắt đầu (kết hợp Local Cache + Server)
  function vlxtGetTrialStartedLessons(sdt) {
    if (!sdt) return [];
    try {
      var raw = localStorage.getItem(TRIAL_STARTED_PREFIX + sdt);
      var arr = JSON.parse(raw || '[]');
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function vlxtSaveTrialStartedLessons(sdt, list) {
    if (!sdt) return;
    try {
      localStorage.setItem(TRIAL_STARTED_PREFIX + sdt, JSON.stringify(list || []));
    } catch (e) {}
  }

  function vlxtIsLessonStarted(sdt, lessonKey, watchedSet) {
    if (watchedSet && watchedSet.has(lessonKey)) return true;
    if (!sdt) return false;
    var list = vlxtGetTrialStartedLessons(sdt);
    return list.some(function (item) {
      return item.key === lessonKey || (item.mabai && item.mabai === lessonKey);
    });
  }

  function vlxtGetDailyNewLessonsCount(sdt, dateStr) {
    if (!sdt) return 0;
    var targetDate = dateStr || vlxtGetVietnamDateStr();
    var list = vlxtGetTrialStartedLessons(sdt);
    var filtered = list.filter(function (item) {
      return item.date === targetDate;
    });
    return filtered.length;
  }

  // 5. Xác thực Server-side: Tải trạng thái hạn mức thật từ Apps Script
  // Nếu học sinh đổi máy hoặc xóa localStorage, server sẽ khôi phục lại 100% dữ liệu
  function vlxtFetchTrialLimitServer(sdt) {
    if (!sdt) return Promise.resolve(null);
    var gasUrl = (typeof global.VLXT_GAS !== 'undefined') ? global.VLXT_GAS : ((typeof global.APPS_SCRIPT_URL !== 'undefined') ? global.APPS_SCRIPT_URL : '');
    if (!gasUrl) return Promise.resolve(null);

    return fetch(gasUrl + '?type=triallimit&hs=' + encodeURIComponent(sdt) + '&t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) return null;
        var serverStarted = res.startedLessons || [];
        var localStarted = vlxtGetTrialStartedLessons(sdt);

        // Hợp nhất (union) danh sách bài giữa server và local để không sót bài
        var map = new Map();
        localStarted.forEach(function (item) { if (item.key) map.set(item.key, item); });
        serverStarted.forEach(function (item) {
          var k = item.key || item.mabai;
          if (k && !map.has(k)) {
            map.set(k, {
              key: k,
              mabai: item.mabai || k,
              name: item.name || k,
              course: item.course || '',
              date: item.date || item.dateStr || vlxtGetVietnamDateStr(item.timestamp),
              timestamp: Number(item.timestamp || Date.now()),
              idempotencyKey: sdt + '_' + (item.mabai || k) + '_' + (item.date || item.dateStr || '')
            });
          }
        });

        var merged = Array.from(map.values());
        vlxtSaveTrialStartedLessons(sdt, merged);
        return res;
      })
      .catch(function (err) {
        console.warn('Không kết nối được server trial limit (sẽ dùng bộ nhớ đệm an toàn):', err);
        return null;
      });
  }

  // 6. Kiểm tra quyền mở bài Trial (Soft Unlock + Daily Limit)
  function vlxtCanAccessTrialLesson(sdt, lesson, allCourses, watchedSet) {
    if (!lesson) return { allowed: false, reason: 'not_found' };

    // Bài trống không có nội dung bị chặn tuyệt đối
    var hasContent = !!(lesson.video || lesson.pdf || lesson.pdflt || lesson.pdfluyentap || lesson.videogiai || (lesson.baitap && lesson.baitap.length > 0) || Number(lesson._quizCount) > 0);
    if (!hasContent) {
      return { allowed: false, reason: 'empty' };
    }

    var ws = watchedSet || new Set();
    var isStarted = vlxtIsLessonStarted(sdt, lesson.key, ws);

    // Ôn lại bài cũ (đã từng bắt đầu hoặc đã watched): MIỄN PHÍ KHÔNG GIỚI HẠN
    if (isStarted) {
      return {
        allowed: true,
        isOldLesson: true,
        remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - vlxtGetDailyNewLessonsCount(sdt)),
        unfinishedPrereqs: vlxtGetUnfinishedPrerequisites(lesson, allCourses, ws)
      };
    }

    // Bài mới: kiểm tra hạn mức 2 bài/ngày theo giờ VN
    var todayVN = vlxtGetVietnamDateStr();
    var dailyCount = vlxtGetDailyNewLessonsCount(sdt, todayVN);

    if (dailyCount >= TRIAL_MAX_DAILY_NEW_LESSONS) {
      return {
        allowed: false,
        reason: 'trial_limit',
        dailyCount: dailyCount,
        maxDaily: TRIAL_MAX_DAILY_NEW_LESSONS,
        nextResetDate: todayVN,
        nextResetMsg: '00:00 ngày mai (theo giờ Việt Nam)',
        startedLessons: vlxtGetTrialStartedLessons(sdt)
      };
    }

    return {
      allowed: true,
      isOldLesson: false,
      dailyCount: dailyCount,
      remaining: TRIAL_MAX_DAILY_NEW_LESSONS - dailyCount,
      unfinishedPrereqs: vlxtGetUnfinishedPrerequisites(lesson, allCourses, ws)
    };
  }

  // 7. Ghi nhận bài học đã bắt đầu (Idempotent - Chống tính trùng, chống bấm nhầm)
  // Gửi trực tiếp lên server để server xác thực và ghi nhận với script lock chống race condition
  var _trialRecordLock = false;

  function vlxtRecordTrialLessonStart(sdt, lesson, courseName) {
    if (!sdt || !lesson) return Promise.resolve({ ok: false, msg: 'Missing sdt or lesson' });

    var lkey = lesson.key || lesson;
    var mb = lesson.mabai || '';
    var todayVN = vlxtGetVietnamDateStr();
    var list = vlxtGetTrialStartedLessons(sdt);

    // Chống tính trùng cục bộ: nếu bài đã từng bắt đầu thì bỏ qua ngay
    var existing = list.find(function (it) {
      return it.key === lkey || (mb && it.mabai === mb);
    });

    if (existing) {
      var existDaily = vlxtGetDailyNewLessonsCount(sdt, todayVN);
      return Promise.resolve({
        ok: true,
        isNew: false,
        dailyCount: existDaily,
        remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - existDaily)
      });
    }

    var currentDaily = vlxtGetDailyNewLessonsCount(sdt, todayVN);
    if (currentDaily >= TRIAL_MAX_DAILY_NEW_LESSONS) {
      return Promise.resolve({
        ok: false,
        reason: 'trial_limit',
        msg: 'Đã đạt tối đa ' + TRIAL_MAX_DAILY_NEW_LESSONS + ' bài mới hôm nay'
      });
    }

    var record = {
      key: lkey,
      mabai: mb,
      name: lesson.name || '',
      course: courseName || (lesson.course ? lesson.course.name : ''),
      date: todayVN,
      timestamp: Date.now(),
      idempotencyKey: sdt + '_' + (mb || lkey) + '_' + todayVN
    };

    // Đưa ngay vào bộ đệm an toàn cục bộ
    list.push(record);
    vlxtSaveTrialStartedLessons(sdt, list);

    // Gửi request lên server thật
    var gasUrl = (typeof global.VLXT_GAS !== 'undefined') ? global.VLXT_GAS : ((typeof global.APPS_SCRIPT_URL !== 'undefined') ? global.APPS_SCRIPT_URL : '');
    if (!gasUrl) {
      vlxtQueueTrialSync(record, sdt);
      return Promise.resolve({
        ok: true,
        isNew: true,
        dailyCount: currentDaily + 1,
        remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - (currentDaily + 1))
      });
    }

    var payload = {
      action: 'starttriallesson',
      sdt: sdt,
      mabai: mb || lkey,
      key: lkey,
      dateStr: todayVN,
      idempotencyKey: record.idempotencyKey,
      hoten: (global.HS && global.HS.ten) || '',
      deviceId: (typeof global.vlxtGetDeviceId === 'function') ? global.vlxtGetDeviceId() : ''
    };

    return fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) {
          // Server xác nhận thành công
          return {
            ok: true,
            isNew: res.isNew !== false,
            dailyCount: res.dailyCount || (currentDaily + 1),
            remaining: typeof res.remaining === 'number' ? res.remaining : Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - (currentDaily + 1))
          };
        } else if (res && res.reason === 'trial_limit') {
          // Server từ chối vì đã hết hạn mức thật trên server (ví dụ học ở máy khác)
          // Xóa bài vừa thêm vào local và cập nhật dailyCount = 2
          var updated = vlxtGetTrialStartedLessons(sdt).filter(function (x) { return x.key !== lkey && x.mabai !== mb; });
          vlxtSaveTrialStartedLessons(sdt, updated);
          return {
            ok: false,
            reason: 'trial_limit',
            msg: res.msg || 'Đã hết hạn mức bài mới trên máy chủ'
          };
        }
        // Fallback an toàn nếu server lỗi nhẹ
        vlxtQueueTrialSync(record, sdt);
        return {
          ok: true,
          isNew: true,
          dailyCount: currentDaily + 1,
          remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - (currentDaily + 1))
        };
      })
      .catch(function (err) {
        // Mất mạng: giữ bộ đệm an toàn và đưa vào hàng đợi đồng bộ
        console.warn('Mất mạng khi lưu bài học thử (đã đưa vào hàng đợi ngoại tuyến):', err);
        vlxtQueueTrialSync(record, sdt);
        return {
          ok: true,
          isNew: true,
          dailyCount: currentDaily + 1,
          remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - (currentDaily + 1))
        };
      });
  }

  // 8. Hàng đợi đồng bộ ngoại tuyến & Chống rớt mạng
  function vlxtReadTrialQueue() {
    try {
      return JSON.parse(localStorage.getItem(TRIAL_QUEUE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function vlxtWriteTrialQueue(items) {
    try {
      localStorage.setItem(TRIAL_QUEUE_KEY, JSON.stringify(items || []));
    } catch (e) {}
  }

  function vlxtQueueTrialSync(record, sdt) {
    var queue = vlxtReadTrialQueue();
    var exists = queue.some(function (x) {
      return x.record && x.record.idempotencyKey === record.idempotencyKey;
    });
    if (!exists) {
      queue.push({
        sdt: sdt,
        record: record,
        attempts: 0
      });
      vlxtWriteTrialQueue(queue);
    }
    vlxtSyncTrialQueue();
  }

  var _trialSyncing = false;
  function vlxtSyncTrialQueue() {
    if (_trialSyncing || typeof navigator === 'undefined' || !navigator.onLine) return Promise.resolve();
    var queue = vlxtReadTrialQueue();
    if (!queue.length) return Promise.resolve();

    _trialSyncing = true;
    var gasUrl = (typeof global.VLXT_GAS !== 'undefined') ? global.VLXT_GAS : ((typeof global.APPS_SCRIPT_URL !== 'undefined') ? global.APPS_SCRIPT_URL : '');

    if (!gasUrl) {
      _trialSyncing = false;
      return Promise.resolve();
    }

    var item = queue[0];
    var payload = {
      action: 'starttriallesson',
      sdt: item.sdt,
      mabai: item.record.mabai || item.record.key,
      key: item.record.key,
      dateStr: item.record.date,
      idempotencyKey: item.record.idempotencyKey,
      hoten: (global.HS && global.HS.ten) || '',
      deviceId: (typeof global.vlxtGetDeviceId === 'function') ? global.vlxtGetDeviceId() : ''
    };

    return fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json();
    }).then(function (res) {
      if (res && (res.ok || res.reason === 'trial_limit' || res.msg === 'already')) {
        queue.shift(); // Xóa khỏi queue vì server đã xử lý
        vlxtWriteTrialQueue(queue);
      }
    }).catch(function (err) {
      console.warn('Lỗi đồng bộ trial queue (sẽ thử lại sau):', err);
    }).finally(function () {
      _trialSyncing = false;
      if (queue.length > 0 && navigator.onLine) {
        setTimeout(vlxtSyncTrialQueue, 1500);
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('online', function () {
      vlxtSyncTrialQueue();
    });
  }

  // 9. Bỏ qua cảnh báo bài nền tảng trong phiên (Session Storage)
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
    getTrialStartedLessons: vlxtGetTrialStartedLessons,
    isLessonStarted: vlxtIsLessonStarted,
    getDailyNewLessonsCount: vlxtGetDailyNewLessonsCount,
    fetchTrialLimitServer: vlxtFetchTrialLimitServer,
    canAccessTrialLesson: vlxtCanAccessTrialLesson,
    recordTrialLessonStart: vlxtRecordTrialLessonStart,
    readTrialQueue: vlxtReadTrialQueue,
    syncTrialQueue: vlxtSyncTrialQueue,
    isPrereqWarningDismissed: vlxtIsPrereqWarningDismissed,
    dismissPrereqWarning: vlxtDismissPrereqWarning
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrialManager;
  }
  global.TrialManager = TrialManager;

})(typeof window !== 'undefined' ? window : global);
