/**
 * TEACHING SCOPE UTILITIES — Vật Lý Xuân Trường
 * Quản lý và lọc câu hỏi theo phạm vi giảng dạy cho Đua Top, Solo và Luyện tập.
 * Tuân thủ nghiêm ngặt tiêu chuẩn an toàn Production.
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VLXT_TeachingScope = factory();
  }
})(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * Chuẩn hóa danh sách usageScopes về mảng canonical chữ hoa (vd: ['DUA_TOP', 'SOLO'])
   */
  function normalizeUsageScopes(input) {
    if (!input) return [];
    var list = [];
    if (Array.isArray(input)) {
      list = input;
    } else if (typeof input === 'string') {
      var trimmed = input.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try { list = JSON.parse(trimmed); } catch (_) { list = [trimmed]; }
      } else {
        list = trimmed.split(/[,;\s]+/).filter(Boolean);
      }
    }
    return list.map(function(s) { return String(s || '').trim().toUpperCase(); }).filter(Boolean);
  }

  /**
   * Kiểm tra một Teaching Scope có đang hiệu lực hay không
   */
  function isScopeActive(scope, nowMs) {
    if (!scope) return false;
    if (scope.isActive !== true && scope.isActive !== 'true') return false;

    var now = nowMs !== undefined ? nowMs : Date.now();
    if (scope.validFrom) {
      var fromTime = Date.parse(scope.validFrom);
      if (!isNaN(fromTime) && now < fromTime) return false;
    }
    if (scope.validTo) {
      var toTime = Date.parse(scope.validTo);
      if (!isNaN(toTime) && now > toTime) return false;
    }
    return true;
  }

  /**
   * LEGACY_TINH_COMPATIBILITY_MODE:
   * Kiểm tra chất lượng và trạng thái duyệt an toàn cho Production:
   * - TUYỆT ĐỐI CHẶN 100%: câu Thô (chatLuong === 'tho', rawTier === 'THO')
   * - Nếu CÓ trường status: BẮT BUỘC status CHÍNH XÁC == 'TEACHER_APPROVED' (chặn QA_PASSED, DRAFT, APPROVED chung...)
   * - Nếu CÓ trường usageScopes: BẮT BUỘC chứa requiredScope (vd 'DUA_TOP', 'SOLO')
   * - Nếu là câu hỏi legacy (chưa có status và chatLuong != 'tho'): được coi là câu hợp lệ của ngân hàng
   * - Yêu cầu hợp lệ cơ bản: loai === 'TN', có đủ question, optA, optB, correct
   */
  function isApprovedTinhQuestion(q, requiredScope) {
    if (!q) return false;

    // 1. Kiểm tra rawTier / chatLuong: CHẶN 100% câu Thô
    var cl = String(q.rawTier || q.chatLuong || q.quality || '').trim().toLowerCase();
    if (cl === 'tho') return false;

    // 2. Kiểm tra status (nếu có trường status)
    if (q.status !== undefined && q.status !== null && String(q.status).trim() !== '') {
      var st = String(q.status).trim().toUpperCase();
      if (st !== 'TEACHER_APPROVED') {
        return false;
      }
    }

    // 3. Kiểm tra usageScopes theo requiredScope (nếu có trường usageScopes)
    var usField = q.usageScopes || q.usageScope || q.scope;
    if (usField !== undefined && usField !== null && String(usField).trim() !== '') {
      if (requiredScope) {
        var reqScopeUpper = String(requiredScope).trim().toUpperCase();
        var canonicalScopes = normalizeUsageScopes(usField);
        if (!canonicalScopes.includes(reqScopeUpper)) {
          return false;
        }
      }
    }

    // 4. Kiểm tra hợp lệ cơ bản cho câu trắc nghiệm
    if (q.loai && q.loai !== 'TN') return false;
    if (!q.question || !q.optA || !q.optB || !q.correct) return false;

    return true;
  }

  /**
   * Chuẩn hóa danh sách scopes từ API/JSON
   */
  function normalizeScopes(data) {
    if (!data) return [];
    var list = [];
    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data.data)) {
      list = data.data;
    } else if (Array.isArray(data.scopes)) {
      list = data.scopes;
    } else if (typeof data === 'object' && (data.courseId || data.openChapterIds || data.isActive !== undefined)) {
      list = [data];
    }
    return list.map(function(s) {
      return {
        courseId: String(s.courseId || ''),
        stageId: String(s.stageId || 'toan_khoa'),
        openChapterIds: Array.isArray(s.openChapterIds) ? s.openChapterIds : [],
        activeLessonIds: s.activeLessonIds && typeof s.activeLessonIds === 'object' ? s.activeLessonIds : {},
        openAllLessons: s.openAllLessons && typeof s.openAllLessons === 'object' ? s.openAllLessons : (s.openAllLessons === true),
        validFrom: s.validFrom || '',
        validTo: s.validTo || '',
        isActive: s.isActive === true || s.isActive === 'true',
        updatedAt: s.updatedAt || '',
        revision: Number(s.revision || 1)
      };
    });
  }

  /**
   * Lọc danh sách câu hỏi ngân hàng theo Teaching Scope
   * @param {Array} allQuestions - Danh sách câu hỏi từ ngân hàng
   * @param {Object|Array} scopesInput - Cấu hình Teaching Scope (1 scope hoặc danh sách scopes)
   * @param {Object} options - { courseId, stageId, requiredScope, nowMs }
   * @returns {Array} Danh sách câu hỏi thỏa mãn (fail closed)
   */
  function filterQuestionsByScope(allQuestions, scopesInput, options) {
    if (!Array.isArray(allQuestions) || allQuestions.length === 0) return [];
    
    var opts = options || {};
    var nowMs = opts.nowMs !== undefined ? opts.nowMs : Date.now();
    var scopes = normalizeScopes(scopesInput);

    // Lọc các scope đang active
    var activeScopes = scopes.filter(function(s) { return isScopeActive(s, nowMs); });
    if (activeScopes.length === 0) {
      return [];
    }

    // FAIL CLOSED on courseId & stageId:
    if (opts.courseId) {
      activeScopes = activeScopes.filter(function(s) { return s.courseId === opts.courseId; });
      if (activeScopes.length === 0) {
        return []; // Không có scope nào khớp courseId -> trả [] ngay, không giữ scope khác
      }
    }
    if (opts.stageId) {
      activeScopes = activeScopes.filter(function(s) { return s.stageId === opts.stageId; });
      if (activeScopes.length === 0) {
        return []; // Không có scope nào khớp stageId -> trả [] ngay
      }
    }

    // Tập hợp chương và bài học được phép từ activeScopes
    var allowedChapters = new Set();
    var chapterLessonsMap = {}; // chName -> Set of lessonIds
    var openChaptersAllLessons = new Set(); // các chương mở toàn bộ bài

    activeScopes.forEach(function(scope) {
      (scope.openChapterIds || []).forEach(function(ch) {
        var chNorm = ch.trim();
        allowedChapters.add(chNorm);

        // Phân biệt rõ: openAllLessons vs activeLessonIds = []
        var isChOpenAll = (scope.openAllLessons === true) ||
                          (typeof scope.openAllLessons === 'object' && scope.openAllLessons && scope.openAllLessons[ch] === true);

        if (isChOpenAll) {
          openChaptersAllLessons.add(chNorm);
        } else {
          var lessonsInCh = (scope.activeLessonIds && scope.activeLessonIds[ch]) || [];
          if (Array.isArray(lessonsInCh) && lessonsInCh.length > 0) {
            if (!chapterLessonsMap[chNorm]) chapterLessonsMap[chNorm] = new Set();
            lessonsInCh.forEach(function(l) {
              if (l) chapterLessonsMap[chNorm].add(String(l).trim());
            });
          }
          // Nếu activeLessonIds = [] và openAllLessons = false -> Không thêm vào openChaptersAllLessons, chapterLessonsMap[chNorm] rỗng -> 0 bài mở
        }
      });
    });

    if (allowedChapters.size === 0) {
      return [];
    }

    return allQuestions.filter(function(q) {
      // 1. Kiểm tra chất lượng Tinh, TEACHER_APPROVED và usageScopes
      if (!isApprovedTinhQuestion(q, opts.requiredScope)) return false;

      // 2. Kiểm tra Chương
      var qChuong = (q.chuong || '').trim();
      if (!qChuong || !allowedChapters.has(qChuong)) return false;

      // 3. Kiểm tra Bài học
      // Nếu chương này mở toàn bộ bài -> chấp nhận
      if (openChaptersAllLessons.has(qChuong)) return true;

      // Nếu chương chỉ định danh sách bài -> kiểm tra trong phạm vi chương đó
      var allowedLessonsInThisCh = chapterLessonsMap[qChuong];
      if (!allowedLessonsInThisCh || allowedLessonsInThisCh.size === 0) {
        // Chương mở nhưng không có bài nào được chọn -> 0 câu
        return false;
      }

      var qBai = (q.baiHoc || q.baiKey || q.maBai || q.tenBai || '').trim();
      if (!qBai) {
        return false;
      }

      var bàiList = qBai.split(/[,;\s]+/).map(function(s) { return s.trim(); }).filter(Boolean);
      return bàiList.some(function(b) { return allowedLessonsInThisCh.has(b); });
    });
  }

  return {
    normalizeUsageScopes: normalizeUsageScopes,
    isScopeActive: isScopeActive,
    isApprovedTinhQuestion: isApprovedTinhQuestion,
    normalizeScopes: normalizeScopes,
    filterQuestionsByScope: filterQuestionsByScope
  };
});

