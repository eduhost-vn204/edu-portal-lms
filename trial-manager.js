/* ═══════════════════════════════════════════════════════════════════
   TRIAL MANAGER — Quản lý tài khoản học thử & Hạn mức LMS Vật Lý Xuân Trường
   Phiên bản: 1.0.0 (2026-09-14)
   Tuân thủ nghiêm ngặt quy tắc an toàn và kiến trúc JSON tĩnh hiện tại.
═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var TRIAL_MAX_DAILY_NEW_LESSONS = 2;
  var TRIAL_STARTED_PREFIX = 'vlxt_trial_started_';
  var TRIAL_QUEUE_KEY = 'vlxt_trial_queue_v1';
  var TRIAL_DISMISSED_PREREQ_PREFIX = 'vlxt_skip_prereq_';

  // 1. Phân loại tài khoản
  function vlxtIsPremiumUser(user) {
    if (!user) return false;
    var loai = String(user.loaiTK || '').trim().toLowerCase();
    return loai === 'premium';
  }

  function vlxtIsTrialUser(user) {
    if (typeof global.isTestAccount === 'function' && global.isTestAccount()) {
      return false; // Tài khoản test của Thầy: mở tự do
    }
    return !vlxtIsPremiumUser(user);
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
      return formatter.format(d); // Trả về 'YYYY-MM-DD'
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

  // 4. Lưu & Truy xuất bài đã bắt đầu (startedLessons)
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

  // Đếm số bài MỚI đã bắt đầu học trong ngày dateStr (giờ VN)
  function vlxtGetDailyNewLessonsCount(sdt, dateStr) {
    if (!sdt) return 0;
    var targetDate = dateStr || vlxtGetVietnamDateStr();
    var list = vlxtGetTrialStartedLessons(sdt);
    var filtered = list.filter(function (item) {
      return item.date === targetDate;
    });
    return filtered.length;
  }

  // 5. Kiểm tra quyền mở bài Trial (Soft Unlock + Daily Limit)
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

  // 6. Ghi nhận bài học đã bắt đầu (Idempotent - Chống tính trùng, chống bấm nhầm)
  function vlxtRecordTrialLessonStart(sdt, lesson, courseName) {
    if (!sdt || !lesson) return { ok: false, msg: 'Missing sdt or lesson' };

    var lkey = lesson.key || lesson;
    var mb = lesson.mabai || '';
    var todayVN = vlxtGetVietnamDateStr();
    var list = vlxtGetTrialStartedLessons(sdt);

    // Chống tính trùng: nếu bài đã từng bắt đầu thì không thêm mới
    var existing = list.find(function (it) {
      return it.key === lkey || (mb && it.mabai === mb);
    });

    if (existing) {
      return { ok: true, isNew: false, dailyCount: vlxtGetDailyNewLessonsCount(sdt, todayVN) };
    }

    // Kiểm tra lại hạn mức trước khi ghi nhận
    var currentDaily = vlxtGetDailyNewLessonsCount(sdt, todayVN);
    if (currentDaily >= TRIAL_MAX_DAILY_NEW_LESSONS) {
      return {
        ok: false,
        reason: 'trial_limit',
        msg: 'Đã đạt tối đa ' + TRIAL_MAX_DAILY_NEW_LESSONS + ' bài mới hôm nay'
      };
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

    list.push(record);
    vlxtSaveTrialStartedLessons(sdt, list);

    // Đưa vào hàng đợi đồng bộ server
    vlxtQueueTrialSync(record, sdt);

    return {
      ok: true,
      isNew: true,
      dailyCount: currentDaily + 1,
      remaining: Math.max(0, TRIAL_MAX_DAILY_NEW_LESSONS - (currentDaily + 1))
    };
  }

  // 7. Hàng đợi đồng bộ ngoại tuyến & Chống rớt mạng
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
      action: 'loghoatdong',
      sdt: item.sdt,
      hanhdong: 'Học thử bài mới (Trial)',
      chitiet: (item.record.name || item.record.key) + ' | ' + item.record.date + ' | ID: ' + item.record.idempotencyKey
    };

    return fetch(gasUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json();
    }).then(function (res) {
      if (res && res.ok) {
        queue.shift();
        vlxtWriteTrialQueue(queue);
      }
    }).catch(function (err) {
      console.warn('Lỗi đồng bộ trial log (sẽ thử lại sau):', err);
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

  // Xuất API toàn cục
  var TrialManager = {
    MAX_DAILY: TRIAL_MAX_DAILY_NEW_LESSONS,
    isPremiumUser: vlxtIsPremiumUser,
    isTrialUser: vlxtIsTrialUser,
    getVietnamDateStr: vlxtGetVietnamDateStr,
    parsePrerequisites: vlxtParsePrerequisites,
    findLessonByIdentifier: vlxtFindLessonByIdentifier,
    getUnfinishedPrerequisites: vlxtGetUnfinishedPrerequisites,
    getTrialStartedLessons: vlxtGetTrialStartedLessons,
    isLessonStarted: vlxtIsLessonStarted,
    getDailyNewLessonsCount: vlxtGetDailyNewLessonsCount,
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
