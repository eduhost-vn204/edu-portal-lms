/* ═══════════════════════════════════════════════════════════════════════
   VLXT WRONG QUESTION BANK — SỔ TAY CÂU LÀM SAI & PHỤC THÙ THEO TÀI KHOẢN
   Vật Lý Xuân Trường (eduhost-vn204/edu-portal-lms)
   - Lưu trữ cô lập tuyệt đối theo từng tài khoản (vlxt_wrong_bank_v1_<key>).
   - Hỗ trợ đồng bộ nền đa thiết bị qua Firebase RTDB (profiles/<key>/wrongBank),
     ưu tiên lưu cục bộ 0ms trước (offline-first, không bao giờ chặn UI).
   - Chuẩn hóa đầy đủ 3 định dạng Bộ GD&ĐT 2026:
     Phần I (Trắc nghiệm 4 lựa chọn), Phần II (Đúng/Sai 4 ý), Phần III (Trả lời ngắn).
   - Tự động chuyển trạng thái "Đã khắc phục" khi học sinh làm đúng lại câu từng sai.
   ═══════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var STORAGE_PREFIX = 'vlxt_wrong_bank_v1_';
  var USER_STORAGE_KEY = 'vlxt_user_v2';
  var RTDB_BASE = 'https://edu-portal-live-default-rtdb.firebaseio.com';
  var MAX_ITEMS = 250;
  var MAX_HISTORY = 5;

  var CHAPTER_META = {
    C1: { code: 'C1', short: 'C1: Nhiệt', name: 'Chương 1: Vật Lí Nhiệt', color: '#10b981', icon: 'fa-temperature-high' },
    C2: { code: 'C2', short: 'C2: Khí', name: 'Chương 2: Khí Lí Tưởng', color: '#06b6d4', icon: 'fa-wind' },
    C3: { code: 'C3', short: 'C3: Từ Trường', name: 'Chương 3: Từ Trường', color: '#8b5cf6', icon: 'fa-magnet' },
    C4: { code: 'C4', short: 'C4: Hạt Nhân', name: 'Chương 4: Vật Lí Hạt Nhân', color: '#ec4899', icon: 'fa-atom' },
    OTHER: { code: 'OTHER', short: 'Tổng hợp', name: 'Chuyên Đề Tổng Hợp', color: '#94a3b8', icon: 'fa-book-open' }
  };

  var SOURCE_META = {
    dgnl: { code: 'dgnl', label: 'Đánh Giá Năng Lực (50 Đề)', short: '50 Đề THPTQG', icon: 'fa-bullseye', color: '#38bdf8' },
    baihoc: { code: 'baihoc', label: 'Bài Tập Khóa Học', short: 'Bài tập bài học', icon: 'fa-graduation-cap', color: '#10b981' },
    video_quiz: { code: 'video_quiz', label: 'Câu Hỏi Trong Video', short: 'Video Quiz', icon: 'fa-circle-play', color: '#f59e0b' },
    thithu: { code: 'thithu', label: 'Phòng Thi Thử CBT', short: 'Thi Thử CBT', icon: 'fa-clipboard-check', color: '#a855f7' }
  };

  var _pushTimers = {};

  function getLS() {
    try {
      if (typeof root !== 'undefined' && root.localStorage) return root.localStorage;
      if (typeof localStorage !== 'undefined') return localStorage;
    } catch (e) {}
    return null;
  }

  function normalizeAccountKey(raw) {
    if (raw && typeof raw === 'object') {
      raw = raw.sdt || raw.email || raw.key || '';
    }
    var s = String(raw || '').trim();
    if (!s) return 'guest';
    var up = s.toUpperCase();
    if (up === 'FREE' || up === 'GUEST' || up.indexOf('HS-THITHU') === 0) return 'guest';
    if (s.indexOf('@') > -1) {
      return s.toLowerCase().replace(/[.#$\[\]\/]/g, '_');
    }
    var digits = s.replace(/\D/g, '');
    if (digits.length >= 6) return digits;
    var safe = s.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_');
    return safe || 'guest';
  }

  function getCurrentUser() {
    var ls = getLS();
    if (!ls) return null;
    try {
      return JSON.parse(ls.getItem(USER_STORAGE_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function getCurrentAccountKey() {
    var u = getCurrentUser();
    return normalizeAccountKey(u ? (u.sdt || u.email || '') : '');
  }

  function storageKeyFor(accountKey) {
    var k = normalizeAccountKey(accountKey || getCurrentAccountKey());
    return STORAGE_PREFIX + k;
  }

  function sanitizeFirebaseKey(raw) {
    return String(raw || '')
      .trim()
      .replace(/[.#$\[\]\/\s]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 96);
  }

  function stripHtml(html) {
    return String(html || '')
      .replace(/<div[^>]*class=["'][^"']*vlxt-model-slot[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function fnv1aHash(str) {
    var h1 = 0x811c9dc5;
    var h2 = 0x9e3779b9;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      h1 ^= c;
      h1 = Math.imul(h1, 0x01000193);
      h2 ^= (c + i);
      h2 = Math.imul(h2, 0x85ebca6b);
    }
    return ((h1 >>> 0).toString(16).padStart(8, '0')) + ((h2 >>> 0).toString(16).padStart(8, '0'));
  }

  function extractModelIdFromHtml(html) {
    var s = String(html || '');
    var m = s.match(/data-model-id=["']([^"']+)["']/i);
    return m ? String(m[1]).trim() : '';
  }

  function detectChapter(raw) {
    var explicit = String(
      (raw && (raw.chapterCode || raw.chapter || raw.chuong)) || ''
    ).trim().toUpperCase();
    if (/^C?1\b|CHƯƠNG\s*1|CHUONG\s*1/.test(explicit)) return CHAPTER_META.C1;
    if (/^C?2\b|CHƯƠNG\s*2|CHUONG\s*2/.test(explicit)) return CHAPTER_META.C2;
    if (/^C?3\b|CHƯƠNG\s*3|CHUONG\s*3/.test(explicit)) return CHAPTER_META.C3;
    if (/^C?4\b|CHƯƠNG\s*4|CHUONG\s*4/.test(explicit)) return CHAPTER_META.C4;

    var sub = String((raw && (raw.subTopic || raw.subtopic || raw.chude)) || '').toUpperCase();
    var cdMatch = sub.match(/\bCD0?(\d{1,2})\b/);
    if (cdMatch) {
      var cdNum = Number(cdMatch[1]);
      if (cdNum >= 1 && cdNum <= 5) return CHAPTER_META.C1;
      if (cdNum >= 6 && cdNum <= 9) return CHAPTER_META.C2;
      if (cdNum >= 10 && cdNum <= 13) return CHAPTER_META.C3;
      if (cdNum >= 14 && cdNum <= 16) return CHAPTER_META.C4;
    }
    var dsMatch = sub.match(/\bDS-C([1-4])\b/);
    if (dsMatch && CHAPTER_META['C' + dsMatch[1]]) return CHAPTER_META['C' + dsMatch[1]];

    var metaText = [
      raw && raw.topic,
      raw && raw.baiHoc,
      raw && raw.khoa,
      raw && raw.chapterHint,
      raw && raw.sourceLabel,
      raw && raw.id,
      raw && raw.qId
    ].filter(Boolean).join(' ').toLowerCase();

    if (/chương\s*1|chuong\s*1|\bc1\b|vật\s*l[iíý]\s*nhiệt|nhiệt\s*động|nhiệt\s*dung|nóng\s*chảy|hóa\s*hơi|hoá\s*hơi|nội\s*năng|nhiệt\s*kế|chuyển\s*thể|băng\s*phiến/.test(metaText)) return CHAPTER_META.C1;
    if (/chương\s*2|chuong\s*2|\bc2\b|khí\s*l[iíý]\s*tưởng|boyle|charles|gay[\s-]*lussac|đẳng\s*nhiệt|đẳng\s*áp|đẳng\s*tích|clapeyron|trạng\s*thái\s*khí/.test(metaText)) return CHAPTER_META.C2;
    if (/chương\s*3|chuong\s*3|\bc3\b|từ\s*trường|cảm\s*ứng\s*từ|lực\s*từ|từ\s*thông|faraday|lenz|xoay\s*chiều|sóng\s*điện\s*từ|máy\s*biến\s*áp|lorentz/.test(metaText)) return CHAPTER_META.C3;
    if (/chương\s*4|chuong\s*4|\bc4\b|hạt\s*nhân|phóng\s*xạ|bán\s*rã|độ\s*hụt\s*khối|năng\s*lượng\s*liên\s*kết|nucleon|đồng\s*vị|rutherford/.test(metaText)) return CHAPTER_META.C4;

    var bodyText = stripHtml((raw && raw.deBaiChung || '') + ' ' + (raw && (raw.question || raw.q || '') || '')).toLowerCase();
    if (/hạt nhân|phóng xạ|chu kì bán rã|chu kỳ bán rã|độ hụt khối|nucleon|proton|neutron|uranium|cobalt|iodine|carbon-14|tia\s*\\?alpha|tia\s*\\?beta|tia\s*\\?gamma|\bmev\b|\bamu\b/.test(bodyText)) return CHAPTER_META.C4;
    if (/từ trường|cảm ứng từ|từ thông|suất điện động cảm ứng|định luật lenz|định luật faraday|dòng điện xoay chiều|sóng điện từ|nam châm|thanh ray|lực từ|lực lorentz|\btesla\b|\bweber\b/.test(bodyText)) return CHAPTER_META.C3;
    if (/khí lí tưởng|khí lý tưởng|định luật boyle|định luật charles|gay-lussac|đẳng nhiệt|đẳng áp|đẳng tích|xi lanh|pit-tông|piston|áp suất khí|phương trình trạng thái|clapeyron|bình chứa khí|quả bóng bay/.test(bodyText)) return CHAPTER_META.C2;
    if (/nhiệt độ|nhiệt lượng|nhiệt dung riêng|nhiệt nóng chảy|nhiệt hóa hơi|nhiệt hoá hơi|nội năng|nhiệt lượng kế|định luật i nhiệt động|chuyển thể|nóng chảy|đông đặc|hóa hơi|ngưng tụ|nhiệt kế|thang nhiệt độ|kelvin/.test(bodyText)) return CHAPTER_META.C1;

    return CHAPTER_META.OTHER;
  }

  function normalizeType(q) {
    var t = String((q && (q.type || q.loai)) || '').trim().toLowerCase();
    if (t === 'tf' || t === 'ds' || t === 'đs' || t === 'dung_sai' || t === 'true_false') return 'tf';
    if (t === 'short' || t === 'tln' || t === 'tra_loi_ngan' || t === 'tl') return 'short';
    if (q && Array.isArray(q.boolAnswers) && q.boolAnswers.length) return 'tf';
    if (q && typeof q.answer === 'string' && /^[ĐSđs]{4}$/.test(q.answer.trim())) return 'tf';
    if (q && typeof q.correct === 'string' && /^[ĐSđs]{4}$/.test(q.correct.trim())) return 'tf';
    return 'mc';
  }

  function normalizeOptions(q, qType) {
    if (qType === 'short') return [];
    if (Array.isArray(q && q.options) && q.options.length > 0) {
      return q.options.slice(0, 4).map(function (o) { return String(o == null ? '' : o); });
    }
    var optsObj = (q && q.options && typeof q.options === 'object' && !Array.isArray(q.options)) ? q.options : q;
    var letters = ['A', 'B', 'C', 'D'];
    var out = [];
    for (var i = 0; i < letters.length; i++) {
      var L = letters[i];
      var val = optsObj
        ? (optsObj[L] !== undefined ? optsObj[L]
          : (optsObj[L.toLowerCase()] !== undefined ? optsObj[L.toLowerCase()]
            : (optsObj['opt' + L] !== undefined ? optsObj['opt' + L] : '')))
        : '';
      out.push(String(val == null ? '' : val));
    }
    return out.some(function (x) { return x.trim() !== ''; }) ? out : [];
  }

  function normalizeCorrectAnswer(q, qType) {
    var letters = ['A', 'B', 'C', 'D'];
    if (qType === 'tf') {
      var bools = [];
      if (Array.isArray(q && q.boolAnswers) && q.boolAnswers.length) {
        bools = q.boolAnswers.slice(0, 4).map(function (v) { return Boolean(v); });
      } else {
        var rawStr = String((q && (q.correct || q.answer || q.dapan || q.correctAnswer)) || '').trim().toUpperCase();
        for (var i = 0; i < 4; i++) {
          var ch = rawStr[i] || 'S';
          bools.push(ch === 'Đ' || ch === 'D' || ch === 'T' || ch === '1');
        }
      }
      var tfStr = bools.map(function (b) { return b ? 'Đ' : 'S'; }).join('');
      return { correctAnswer: tfStr, boolAnswers: bools };
    }
    if (qType === 'short') {
      var ans = (q && (q.correctAnswer !== undefined ? q.correctAnswer : (q.answer !== undefined ? q.answer : (q.correct !== undefined ? q.correct : (q.dapan !== undefined ? q.dapan : '')))));
      return { correctAnswer: String(ans == null ? '' : ans).trim(), boolAnswers: [] };
    }
    // mc
    var rawMc = (q && (q.correctLetter || q.correctAnswer || q.ans || q.correct || q.dapan));
    if (rawMc === undefined || rawMc === null || rawMc === '') {
      if (typeof (q && q.answer) === 'number' && q.answer >= 0 && q.answer < 4) {
        rawMc = letters[q.answer];
      } else if (typeof (q && q.answer) === 'string') {
        rawMc = q.answer;
      }
    }
    var mcStr = String(rawMc == null ? '' : rawMc).trim().toUpperCase();
    if (/^[0-3]$/.test(mcStr)) mcStr = letters[Number(mcStr)];
    if (mcStr.length > 1 && /^[ABCD]\b/.test(mcStr)) mcStr = mcStr[0];
    return { correctAnswer: mcStr, boolAnswers: [] };
  }

  function normalizeUserAnswer(userAnswer, qType) {
    var letters = ['A', 'B', 'C', 'D'];
    if (qType === 'tf') {
      if (Array.isArray(userAnswer)) {
        return [0, 1, 2, 3].map(function (i) {
          var v = userAnswer[i];
          if (v === true || v === 'Đ' || v === 'D' || v === 'true') return true;
          if (v === false || v === 'S' || v === 'false') return false;
          return null;
        });
      }
      if (typeof userAnswer === 'string' && userAnswer.trim()) {
        var s = userAnswer.trim().toUpperCase();
        return [0, 1, 2, 3].map(function (i) {
          var ch = s[i];
          if (ch === 'Đ' || ch === 'D') return true;
          if (ch === 'S') return false;
          return null;
        });
      }
      return [null, null, null, null];
    }
    if (qType === 'short') {
      return userAnswer == null ? '' : String(userAnswer).trim();
    }
    // mc
    if (typeof userAnswer === 'number' && userAnswer >= 0 && userAnswer < 4) {
      return letters[userAnswer];
    }
    var str = String(userAnswer == null ? '' : userAnswer).trim().toUpperCase();
    if (/^[0-3]$/.test(str)) return letters[Number(str)];
    return str.slice(0, 1);
  }

  function makeQuestionKey(rawQ, qType) {
    var cand = String((rawQ && (rawQ.key || rawQ.nhId || rawQ.qId || rawQ.id)) || '').trim();
    // Only trust ID if it is meaningful (not purely sequential "1".."28" per exam)
    if (cand && cand.length >= 5 && !/^\d+$/.test(cand)) {
      return sanitizeFirebaseKey(cand);
    }
    var t = qType || normalizeType(rawQ);
    var stem = stripHtml((rawQ && rawQ.deBaiChung || '') + ' ' + (rawQ && (rawQ.question || rawQ.q || '') || ''))
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
    return 'Q_' + t + '_' + fnv1aHash(t + '|' + stem);
  }

  function parseNumericAnswer(raw) {
    if (raw === undefined || raw === null) return NaN;
    var s = String(raw).trim().replace(/\s+/g, '').replace(',', '.');
    if (!s) return NaN;
    return Number(s);
  }

  function checkAnswer(item, userAnswer) {
    if (!item) return { ok: false, matchedCount: 0, totalCount: 1 };
    var qType = item.type || 'mc';
    if (qType === 'tf') {
      var picked = normalizeUserAnswer(userAnswer, 'tf');
      var truth = Array.isArray(item.boolAnswers) && item.boolAnswers.length === 4
        ? item.boolAnswers
        : normalizeCorrectAnswer({ correct: item.correctAnswer }, 'tf').boolAnswers;
      var matched = 0;
      for (var i = 0; i < 4; i++) {
        if ((picked[i] === true || picked[i] === false) && picked[i] === Boolean(truth[i])) {
          matched++;
        }
      }
      return { ok: matched === 4, matchedCount: matched, totalCount: 4, normalizedUserAnswer: picked };
    }
    if (qType === 'short') {
      var uStr = normalizeUserAnswer(userAnswer, 'short');
      var cStr = String(item.correctAnswer || '').trim();
      var uNum = parseNumericAnswer(uStr);
      var cNum = parseNumericAnswer(cStr);
      var ok = false;
      if (Number.isFinite(uNum) && Number.isFinite(cNum)) {
        ok = Math.abs(uNum - cNum) <= 1e-3;
      } else if (uStr && cStr) {
        ok = uStr.toLowerCase().replace(/\s+/g, '') === cStr.toLowerCase().replace(/\s+/g, '');
      }
      return { ok: ok, matchedCount: ok ? 1 : 0, totalCount: 1, normalizedUserAnswer: uStr };
    }
    // mc
    var uLet = normalizeUserAnswer(userAnswer, 'mc');
    var cLet = String(item.correctAnswer || '').trim().toUpperCase().slice(0, 1);
    var mcOk = Boolean(uLet && cLet && uLet === cLet);
    return { ok: mcOk, matchedCount: mcOk ? 1 : 0, totalCount: 1, normalizedUserAnswer: uLet };
  }

  function readStore(accountKey) {
    var ls = getLS();
    var key = storageKeyFor(accountKey);
    if (!ls) return {};
    try {
      var raw = ls.getItem(key);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        if (parsed.items && typeof parsed.items === 'object') return parsed.items;
        return parsed;
      }
    } catch (e) {}
    return {};
  }

  function trimStoreToCap(map, cap) {
    var keys = Object.keys(map);
    if (keys.length <= cap) return map;
    keys.sort(function (a, b) {
      var ia = map[a] || {};
      var ib = map[b] || {};
      // Keep need_review over mastered, and newer/higher wrongCount first
      var pa = ia.status === 'mastered' ? 0 : 1;
      var pb = ib.status === 'mastered' ? 0 : 1;
      if (pa !== pb) return pb - pa;
      return (Number(ib.lastWrongAt || ib.updatedAt || 0)) - (Number(ia.lastWrongAt || ia.updatedAt || 0));
    });
    var next = {};
    for (var i = 0; i < cap; i++) {
      next[keys[i]] = map[keys[i]];
    }
    return next;
  }

  function writeStore(map, accountKey, skipCloud) {
    var ls = getLS();
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var key = STORAGE_PREFIX + acc;
    var trimmed = trimStoreToCap(map || {}, MAX_ITEMS);
    if (ls) {
      try {
        ls.setItem(key, JSON.stringify({ version: 1, accountKey: acc, updatedAt: Date.now(), items: trimmed }));
      } catch (e) {
        // QuotaExceededError fallback: shrink aggressively and strip history
        try {
          var smaller = trimStoreToCap(trimmed, 80);
          Object.keys(smaller).forEach(function (k) {
            if (smaller[k] && Array.isArray(smaller[k].history)) smaller[k].history = smaller[k].history.slice(-2);
          });
          ls.setItem(key, JSON.stringify({ version: 1, accountKey: acc, updatedAt: Date.now(), items: smaller }));
          trimmed = smaller;
        } catch (e2) {}
      }
    }
    emitUpdated(acc, Object.keys(trimmed).length);
    if (!skipCloud && acc !== 'guest') {
      scheduleCloudPush(acc, trimmed);
    }
    return trimmed;
  }

  function emitUpdated(accountKey, count) {
    try {
      if (typeof root !== 'undefined' && typeof root.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
        root.dispatchEvent(new CustomEvent('vlxt:wrong-bank-updated', {
          detail: { accountKey: accountKey, count: count }
        }));
      }
    } catch (e) {}
  }

  function buildNormalizedItem(rawQ, opts) {
    opts = opts || {};
    var qType = normalizeType(rawQ);
    var key = makeQuestionKey(rawQ, qType);
    var chap = detectChapter(Object.assign({}, rawQ, {
      chapterHint: opts.chapterHint || '',
      sourceLabel: opts.sourceLabel || ''
    }));
    var ansNorm = normalizeCorrectAnswer(rawQ, qType);
    var optsArr = normalizeOptions(rawQ, qType);
    var qHtml = String((rawQ && (rawQ.question || rawQ.q)) || '').trim();
    var ctxHtml = String((rawQ && rawQ.deBaiChung) || '').trim();
    var modelId = String((rawQ && rawQ.modelId) || '').trim()
      || extractModelIdFromHtml(qHtml)
      || extractModelIdFromHtml(ctxHtml);
    var hinhAnh = String((rawQ && (rawQ.hinhAnh || rawQ.img || rawQ.image)) || '').trim();
    var explain = String((rawQ && (rawQ.explain || rawQ.giaiThich || rawQ.explanation)) || '').trim();
    var source = SOURCE_META[opts.source] ? opts.source : (SOURCE_META[rawQ && rawQ.source] ? rawQ.source : 'dgnl');
    var sourceLabel = String(opts.sourceLabel || (rawQ && rawQ.sourceLabel) || SOURCE_META[source].label).trim();
    var sourceUrl = String(opts.sourceUrl || (rawQ && rawQ.sourceUrl) || '').trim();
    var qId = String((rawQ && (rawQ.nhId || rawQ.qId || rawQ.id)) || '').trim();

    return {
      key: key,
      qId: qId,
      type: qType,
      chapter: chap.code,
      chapterName: chap.name,
      subTopic: String((rawQ && (rawQ.subTopic || rawQ.subtopic || rawQ.topic)) || '').trim(),
      baiHoc: String((rawQ && (rawQ.baiHoc || rawQ.lessonName)) || opts.lessonName || '').trim(),
      level: String((rawQ && rawQ.level) || '').trim(),
      source: source,
      sourceLabel: sourceLabel,
      sourceUrl: sourceUrl,
      deBaiChung: ctxHtml,
      question: qHtml,
      options: optsArr,
      correctAnswer: ansNorm.correctAnswer,
      boolAnswers: ansNorm.boolAnswers,
      lastUserAnswer: normalizeUserAnswer(opts.userAnswer, qType),
      explain: explain,
      modelId: modelId,
      hinhAnh: hinhAnh
    };
  }

  function applyResultToMap(map, rawQ, isCorrect, opts) {
    if (!rawQ) return false;
    var built = buildNormalizedItem(rawQ, opts);
    if (!built.question && !built.deBaiChung) return false;

    var now = Number(opts && opts.timestamp) || Date.now();
    var existing = map[built.key];

    if (isCorrect) {
      if (!existing) return false; // Never wrong before -> do not pollute wrong bank
      existing.status = 'mastered';
      existing.retryCorrectCount = (Number(existing.retryCorrectCount) || 0) + 1;
      existing.masteredAt = now;
      existing.updatedAt = now;
      // Enrich missing metadata if newly available
      if (!existing.explain && built.explain) existing.explain = built.explain;
      if (!existing.modelId && built.modelId) existing.modelId = built.modelId;
      if (!existing.hinhAnh && built.hinhAnh) existing.hinhAnh = built.hinhAnh;
      var histOk = Array.isArray(existing.history) ? existing.history.slice() : [];
      histOk.push({ ts: now, ok: true, userAnswer: built.lastUserAnswer, sourceLabel: built.sourceLabel });
      existing.history = histOk.slice(-MAX_HISTORY);
      map[built.key] = existing;
      return true;
    }

    // Wrong answer -> insert or increment wrongCount & reopen as need_review
    if (existing) {
      existing.wrongCount = (Number(existing.wrongCount) || 1) + 1;
      existing.status = 'need_review';
      existing.lastWrongAt = now;
      existing.updatedAt = now;
      existing.lastUserAnswer = built.lastUserAnswer;
      existing.source = built.source;
      existing.sourceLabel = built.sourceLabel;
      if (built.sourceUrl) existing.sourceUrl = built.sourceUrl;
      if (built.explain && (!existing.explain || built.explain.length > existing.explain.length)) existing.explain = built.explain;
      if (built.modelId) existing.modelId = built.modelId;
      if (built.hinhAnh) existing.hinhAnh = built.hinhAnh;
      if (built.options && built.options.length) existing.options = built.options;
      if (built.correctAnswer) existing.correctAnswer = built.correctAnswer;
      if (built.boolAnswers && built.boolAnswers.length) existing.boolAnswers = built.boolAnswers;
      if (existing.chapter === 'OTHER' && built.chapter !== 'OTHER') {
        existing.chapter = built.chapter;
        existing.chapterName = built.chapterName;
      }
      if (!existing.subTopic && built.subTopic) existing.subTopic = built.subTopic;
      if (!existing.baiHoc && built.baiHoc) existing.baiHoc = built.baiHoc;
      var histW = Array.isArray(existing.history) ? existing.history.slice() : [];
      histW.push({ ts: now, ok: false, userAnswer: built.lastUserAnswer, sourceLabel: built.sourceLabel });
      existing.history = histW.slice(-MAX_HISTORY);
      map[built.key] = existing;
    } else {
      map[built.key] = Object.assign({}, built, {
        wrongCount: 1,
        retryCorrectCount: 0,
        status: 'need_review',
        firstWrongAt: now,
        lastWrongAt: now,
        masteredAt: 0,
        updatedAt: now,
        history: [{ ts: now, ok: false, userAnswer: built.lastUserAnswer, sourceLabel: built.sourceLabel }]
      });
    }
    return true;
  }

  function recordWrong(rawQ, opts) {
    opts = opts || {};
    var acc = normalizeAccountKey(opts.accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    var changed = applyResultToMap(map, rawQ, false, opts);
    if (changed) writeStore(map, acc, opts.skipCloud);
    return changed;
  }

  function recordBatch(entries, opts) {
    opts = opts || {};
    if (!Array.isArray(entries) || entries.length === 0) return { recordedWrong: 0, autoMastered: 0 };
    var acc = normalizeAccountKey(opts.accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    var recordedWrong = 0;
    var autoMastered = 0;
    var changed = false;

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (!entry || !entry.question) continue;
      var itemOpts = Object.assign({}, opts, entry);
      var didChange = applyResultToMap(map, entry.question, Boolean(entry.isCorrect), itemOpts);
      if (didChange) {
        changed = true;
        if (entry.isCorrect) autoMastered++;
        else recordedWrong++;
      }
    }

    if (changed) writeStore(map, acc, opts.skipCloud);
    return { recordedWrong: recordedWrong, autoMastered: autoMastered };
  }

  function mergeItems(localItem, remoteItem) {
    if (!localItem) return remoteItem;
    if (!remoteItem) return localItem;
    var locUpd = Number(localItem.updatedAt || localItem.lastWrongAt || 0);
    var remUpd = Number(remoteItem.updatedAt || remoteItem.lastWrongAt || 0);
    var newer = remUpd > locUpd ? remoteItem : localItem;
    var older = remUpd > locUpd ? localItem : remoteItem;

    return Object.assign({}, older, newer, {
      wrongCount: Math.max(Number(localItem.wrongCount) || 1, Number(remoteItem.wrongCount) || 1),
      retryCorrectCount: Math.max(Number(localItem.retryCorrectCount) || 0, Number(remoteItem.retryCorrectCount) || 0),
      firstWrongAt: Math.min(Number(localItem.firstWrongAt) || Infinity, Number(remoteItem.firstWrongAt) || Infinity) || newer.lastWrongAt || Date.now(),
      lastWrongAt: Math.max(Number(localItem.lastWrongAt) || 0, Number(remoteItem.lastWrongAt) || 0),
      explain: (newer.explain && newer.explain.length >= (older.explain || '').length) ? newer.explain : (older.explain || ''),
      modelId: newer.modelId || older.modelId || '',
      hinhAnh: newer.hinhAnh || older.hinhAnh || '',
      options: (newer.options && newer.options.length) ? newer.options : (older.options || []),
      updatedAt: Math.max(locUpd, remUpd)
    });
  }

  function mergeStores(localMap, remoteMap) {
    var out = {};
    var k;
    for (k in localMap) {
      if (Object.prototype.hasOwnProperty.call(localMap, k) && localMap[k]) {
        out[k] = localMap[k];
      }
    }
    for (k in remoteMap) {
      if (Object.prototype.hasOwnProperty.call(remoteMap, k) && remoteMap[k] && remoteMap[k].question) {
        out[k] = mergeItems(out[k], remoteMap[k]);
      }
    }
    return trimStoreToCap(out, MAX_ITEMS);
  }

  function migrateGuestToAccount(accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    if (acc === 'guest') return 0;
    var guestMap = readStore('guest');
    var guestKeys = Object.keys(guestMap);
    if (!guestKeys.length) return 0;

    var accMap = readStore(acc);
    var merged = mergeStores(accMap, guestMap);
    writeStore(merged, acc);

    var ls = getLS();
    if (ls) {
      try { ls.removeItem(STORAGE_PREFIX + 'guest'); } catch (e) {}
    }
    return guestKeys.length;
  }

  function getAll(accountKey) {
    var map = readStore(accountKey);
    return Object.keys(map)
      .map(function (k) { return map[k]; })
      .filter(function (it) { return it && (it.question || it.deBaiChung); })
      .sort(function (a, b) {
        return (Number(b.lastWrongAt || b.updatedAt || 0)) - (Number(a.lastWrongAt || a.updatedAt || 0));
      });
  }

  function getItem(itemKey, accountKey) {
    var map = readStore(accountKey);
    return map[itemKey] || null;
  }

  function getStats(accountKey) {
    var items = getAll(accountKey);
    var total = items.length;
    var needReview = 0;
    var mastered = 0;
    var repeated = 0;
    var totalWrongHits = 0;

    var byChapter = {
      C1: { code: 'C1', short: CHAPTER_META.C1.short, name: CHAPTER_META.C1.name, color: CHAPTER_META.C1.color, icon: CHAPTER_META.C1.icon, total: 0, needReview: 0, mastered: 0 },
      C2: { code: 'C2', short: CHAPTER_META.C2.short, name: CHAPTER_META.C2.name, color: CHAPTER_META.C2.color, icon: CHAPTER_META.C2.icon, total: 0, needReview: 0, mastered: 0 },
      C3: { code: 'C3', short: CHAPTER_META.C3.short, name: CHAPTER_META.C3.name, color: CHAPTER_META.C3.color, icon: CHAPTER_META.C3.icon, total: 0, needReview: 0, mastered: 0 },
      C4: { code: 'C4', short: CHAPTER_META.C4.short, name: CHAPTER_META.C4.name, color: CHAPTER_META.C4.color, icon: CHAPTER_META.C4.icon, total: 0, needReview: 0, mastered: 0 },
      OTHER: { code: 'OTHER', short: CHAPTER_META.OTHER.short, name: CHAPTER_META.OTHER.name, color: CHAPTER_META.OTHER.color, icon: CHAPTER_META.OTHER.icon, total: 0, needReview: 0, mastered: 0 }
    };
    var bySource = { dgnl: 0, baihoc: 0, video_quiz: 0, thithu: 0 };
    var byType = { mc: 0, tf: 0, short: 0 };

    items.forEach(function (it) {
      var isM = it.status === 'mastered';
      if (isM) mastered++;
      else needReview++;
      var wc = Number(it.wrongCount) || 1;
      totalWrongHits += wc;
      if (wc >= 2) repeated++;

      var chCode = byChapter[it.chapter] ? it.chapter : 'OTHER';
      byChapter[chCode].total++;
      if (isM) byChapter[chCode].mastered++;
      else byChapter[chCode].needReview++;

      if (bySource[it.source] !== undefined) bySource[it.source]++;
      if (byType[it.type] !== undefined) byType[it.type]++;
    });

    var masteryPct = total > 0 ? Math.round((mastered / total) * 100) : 0;
    var weakestChapter = null;
    ['C1', 'C2', 'C3', 'C4'].forEach(function (c) {
      var b = byChapter[c];
      if (b.needReview > 0 && (!weakestChapter || b.needReview > weakestChapter.needReview)) {
        weakestChapter = b;
      }
    });

    return {
      total: total,
      needReview: needReview,
      mastered: mastered,
      repeated: repeated,
      totalWrongHits: totalWrongHits,
      masteryPct: masteryPct,
      byChapter: byChapter,
      bySource: bySource,
      byType: byType,
      weakestChapter: weakestChapter
    };
  }

  function recordRetryResult(itemKey, userAnswer, accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    var item = map[itemKey];
    if (!item) return null;

    var res = checkAnswer(item, userAnswer);
    var now = Date.now();
    var hist = Array.isArray(item.history) ? item.history.slice() : [];
    hist.push({ ts: now, ok: res.ok, userAnswer: res.normalizedUserAnswer, sourceLabel: 'Ôn tập tại Hồ sơ' });
    item.history = hist.slice(-MAX_HISTORY);
    item.updatedAt = now;

    if (res.ok) {
      item.status = 'mastered';
      item.retryCorrectCount = (Number(item.retryCorrectCount) || 0) + 1;
      item.masteredAt = now;
    } else {
      item.status = 'need_review';
      item.wrongCount = (Number(item.wrongCount) || 1) + 1;
      item.lastWrongAt = now;
      item.lastUserAnswer = res.normalizedUserAnswer;
    }

    map[itemKey] = item;
    writeStore(map, acc);
    return Object.assign({}, res, { item: item });
  }

  function markMastered(itemKey, accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    if (!map[itemKey]) return false;
    var now = Date.now();
    map[itemKey].status = 'mastered';
    map[itemKey].masteredAt = now;
    map[itemKey].updatedAt = now;
    writeStore(map, acc);
    return true;
  }

  function markNeedReview(itemKey, accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    if (!map[itemKey]) return false;
    map[itemKey].status = 'need_review';
    map[itemKey].updatedAt = Date.now();
    writeStore(map, acc);
    return true;
  }

  function removeItem(itemKey, accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    if (!map[itemKey]) return false;
    delete map[itemKey];
    writeStore(map, acc);
    return true;
  }

  function clearMastered(accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    var map = readStore(acc);
    var removed = 0;
    Object.keys(map).forEach(function (k) {
      if (map[k] && map[k].status === 'mastered') {
        delete map[k];
        removed++;
      }
    });
    if (removed > 0) writeStore(map, acc);
    return removed;
  }

  // ── CLOUD SYNC (OFFLINE-FIRST, FAIL-SILENT, PER-ACCOUNT) ──
  function isCloudSyncAllowed(accountKey) {
    if (!accountKey || accountKey === 'guest') return false;
    if (typeof root !== 'undefined' && root.__VLXT_DISABLE_CLOUD_SYNC__) return false;
    if (typeof fetch !== 'function' && !(typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length)) return false;
    return true;
  }

  function scheduleCloudPush(accountKey, map) {
    if (!isCloudSyncAllowed(accountKey)) return;
    if (_pushTimers[accountKey]) clearTimeout(_pushTimers[accountKey]);
    _pushTimers[accountKey] = setTimeout(function () {
      pushToCloud(accountKey, map);
    }, 600);
  }

  function pushToCloud(accountKey, mapOverride) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    if (!isCloudSyncAllowed(acc)) return Promise.resolve(false);
    var payload = {
      updatedAt: Date.now(),
      items: mapOverride || readStore(acc)
    };
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
        return firebase.database().ref('profiles/' + acc + '/wrongBank').set(payload)
          .then(function () { return true; })
          .catch(function () { return false; });
      }
    } catch (e) {}
    try {
      return fetch(RTDB_BASE + '/profiles/' + encodeURIComponent(acc) + '/wrongBank.json', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (r) { return Boolean(r && r.ok); }).catch(function () { return false; });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  function syncFromCloud(accountKey) {
    var acc = normalizeAccountKey(accountKey || getCurrentAccountKey());
    if (!isCloudSyncAllowed(acc)) return Promise.resolve({ synced: false, changed: false, items: getAll(acc) });

    var fetchPromise;
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
        fetchPromise = firebase.database().ref('profiles/' + acc + '/wrongBank').once('value')
          .then(function (snap) { return snap ? snap.val() : null; });
      }
    } catch (e) {}

    if (!fetchPromise) {
      try {
        fetchPromise = fetch(RTDB_BASE + '/profiles/' + encodeURIComponent(acc) + '/wrongBank.json')
          .then(function (r) { return (r && r.ok) ? r.json() : null; });
      } catch (e) {
        return Promise.resolve({ synced: false, changed: false, items: getAll(acc) });
      }
    }

    return fetchPromise.then(function (remoteData) {
      var remoteItems = (remoteData && remoteData.items && typeof remoteData.items === 'object')
        ? remoteData.items
        : {};
      var localMap = readStore(acc);
      var beforeStr = JSON.stringify(localMap);
      var merged = mergeStores(localMap, remoteItems);
      var afterStr = JSON.stringify(merged);
      var changed = beforeStr !== afterStr;

      if (changed) {
        // Save merged locally; if local had items missing in remote, push back cleanly
        var remoteStr = JSON.stringify(remoteItems);
        var needPushBack = afterStr !== remoteStr;
        writeStore(merged, acc, !needPushBack);
      } else if (Object.keys(localMap).length > 0 && Object.keys(remoteItems).length === 0) {
        // First time syncing local history up to cloud
        pushToCloud(acc, localMap);
      }

      return { synced: true, changed: changed, items: getAll(acc) };
    }).catch(function () {
      return { synced: false, changed: false, items: getAll(acc) };
    });
  }

  var VlxtWrongBank = {
    VERSION: '1.0.0',
    STORAGE_PREFIX: STORAGE_PREFIX,
    CHAPTER_META: CHAPTER_META,
    SOURCE_META: SOURCE_META,
    normalizeAccountKey: normalizeAccountKey,
    getCurrentAccountKey: getCurrentAccountKey,
    detectChapter: detectChapter,
    makeQuestionKey: makeQuestionKey,
    checkAnswer: checkAnswer,
    recordWrong: recordWrong,
    recordBatch: recordBatch,
    migrateGuestToAccount: migrateGuestToAccount,
    getAll: getAll,
    getItem: getItem,
    getStats: getStats,
    recordRetryResult: recordRetryResult,
    markMastered: markMastered,
    markNeedReview: markNeedReview,
    removeItem: removeItem,
    clearMastered: clearMastered,
    syncFromCloud: syncFromCloud,
    pushToCloud: pushToCloud,
    mergeStores: mergeStores
  };

  if (typeof root !== 'undefined') root.VlxtWrongBank = VlxtWrongBank;
  if (typeof module !== 'undefined' && module.exports) module.exports = VlxtWrongBank;
})(typeof window !== 'undefined' ? window : globalThis);
