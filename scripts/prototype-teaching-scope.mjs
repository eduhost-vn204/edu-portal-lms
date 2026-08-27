// -*- coding: utf-8 -*-
/**
 * Prototype Engine: Teaching Scope & Production Publishing Filter v2.1
 * Pure algorithmic prototype (no live sheets mutation, no production side effects).
 */

export function validateTeachingScope(scope, now = new Date()) {
  if (!scope || !scope.scopeId) throw new Error('Scope invalid: thiếu scopeId');
  if (!scope.courseId) throw new Error('Scope invalid: thiếu courseId');
  if (!scope.stage) throw new Error('Scope invalid: thiếu stage');
  if (!Array.isArray(scope.activeChapters) || !scope.activeChapters.length) {
    throw new Error('Scope invalid: cần ít nhất 1 chương cấu hình');
  }

  // Kiểm tra cửa sổ thời gian
  if (scope.validFrom && new Date(scope.validFrom) > now) {
    return { isValid: false, reason: 'SCOPE_NOT_STARTED' };
  }
  if (scope.validTo && new Date(scope.validTo) < now) {
    return { isValid: false, reason: 'SCOPE_EXPIRED' };
  }
  if (!scope.isActive) {
    return { isValid: false, reason: 'SCOPE_INACTIVE' };
  }

  return { isValid: true, activeOpenChapterNumbers: scope.activeChapters.filter(c => c.isOpen).map(c => c.chapterNumber) };
}

export function filterPublishableQuestions(bank, scope, targetUsageScope = null) {
  const scopeValidation = validateTeachingScope(scope);
  if (!scopeValidation.isValid) {
    return { success: false, reason: scopeValidation.reason, questions: [] };
  }

  const openChapters = new Set(scopeValidation.activeOpenChapterNumbers);
  const activeLessons = new Set(scope.activeLessons || []);

  const approved = [];
  const rejectedReasons = { rawTierTho: 0, unapprovedStatus: 0, chapterClosed: 0, lessonInactive: 0, scopeMismatch: 0 };

  for (const q of bank) {
    // 1. RÀO CHẮN CHẤT LƯỢNG TUYỆT ĐỐI
    if (q.rawTier === 'THO') {
      rejectedReasons.rawTierTho++;
      continue;
    }
    if (q.status !== 'TEACHER_APPROVED' && q.status !== 'PUBLISHED') {
      rejectedReasons.unapprovedStatus++;
      continue;
    }

    // 2. LỌC THEO TIẾN ĐỘ DẠY (TEACHING SCOPE)
    const qChapter = q.taxonomy?.chapterNumber;
    if (!openChapters.has(qChapter)) {
      rejectedReasons.chapterClosed++;
      continue;
    }

    const qLesson = q.taxonomy?.lessonCode;
    if (activeLessons.size > 0 && qLesson && !activeLessons.has(qLesson)) {
      rejectedReasons.lessonInactive++;
      continue;
    }

    // 3. LỌC THEO PHẠM VI SỬ DỤNG (USAGE SCOPE NẾU CÓ)
    if (targetUsageScope && Array.isArray(q.usageScopes) && !q.usageScopes.includes(targetUsageScope)) {
      rejectedReasons.scopeMismatch++;
      continue;
    }

    approved.push(q);
  }

  return {
    success: true,
    totalBank: bank.length,
    publishableCount: approved.length,
    rejectedReasons,
    questions: approved
  };
}

export function selectSoloMatchQuestions(publishableBank, soloConfig = {}) {
  const quota = soloConfig.quota || { NB: 3, TH: 3, VD: 1, VDC: 1 };
  const targetCount = soloConfig.matchQuestionsCount || 8;

  // Phân loại theo độ khó
  const byDifficulty = { NB: [], TH: [], VD: [], VDC: [] };
  for (const q of publishableBank) {
    const diff = q.difficultyLevel === 1 ? 'NB' : q.difficultyLevel === 2 ? 'TH' : q.difficultyLevel === 3 ? 'VD' : 'VDC';
    byDifficulty[diff].push(q);
  }

  const selected = [];
  const pickedIds = new Set();

  // Nhặt theo quota
  for (const [tier, count] of Object.entries(quota)) {
    const pool = byDifficulty[tier] || [];
    for (let i = 0; i < count && i < pool.length; i++) {
      selected.push(pool[i]);
      pickedIds.add(pool[i].id);
    }
  }

  // Fallback an toàn nếu thiếu câu ở một bậc độ khó: bù từ các câu hợp lệ còn lại
  if (selected.length < targetCount) {
    const fallbackPool = publishableBank.filter(q => !pickedIds.has(q.id));
    for (const q of fallbackPool) {
      if (selected.length >= targetCount) break;
      selected.push(q);
      pickedIds.add(q.id);
    }
  }

  return {
    isComplete: selected.length === targetCount,
    count: selected.length,
    targetCount,
    questions: selected
  };
}

export function selectDuaTopQueue(publishableBank, duaTopConfig = {}) {
  // Chỉ lấy câu trắc nghiệm đơn TN4 hoặc câu có đáp án rõ ràng
  const tnPool = publishableBank.filter(q => q.type === 'MULTIPLE_CHOICE_4' || q.type === 'SHORT_ANSWER');
  
  // Sắp xếp tăng dần theo độ khó để phục vụ cơ chế lũy tiến (Progressive Difficulty)
  const sorted = [...tnPool].sort((a, b) => (a.difficultyLevel || 1) - (b.difficultyLevel || 1));
  
  const sessionCount = duaTopConfig.sessionQuestionsCount || 20;
  return sorted.slice(0, sessionCount);
}

export function createImmutableExamSnapshot(examMeta, questionIds, fullBank) {
  const bankMap = new Map(fullBank.map(q => [q.id, q]));
  const snapshotItems = [];

  for (const qId of questionIds) {
    const q = bankMap.get(qId);
    if (!q) throw new Error(`Không tìm thấy câu hỏi ${qId} để tạo snapshot`);

    // Lưu bản chụp toàn văn bất biến
    snapshotItems.push({
      questionId: q.id,
      version: q.version || 1,
      contentHash: q.contentHash,
      type: q.type,
      stem: q.stem,
      options: q.options ? JSON.parse(JSON.stringify(q.options)) : [],
      subItems: q.subItems ? JSON.parse(JSON.stringify(q.subItems)) : [],
      correctAnswer: q.correctAnswer,
      numericValue: q.numericValue,
      tolerance: q.tolerance,
      unit: q.unit,
      acceptedAnswers: q.acceptedAnswers ? [...q.acceptedAnswers] : [],
      explanation: q.explanation,
      difficultyLevel: q.difficultyLevel,
      difficultyName: q.difficultyName,
      snapshotCreatedAt: new Date().toISOString()
    });
  }

  return {
    examId: examMeta.examId,
    tenDe: examMeta.tenDe,
    thoiGian: examMeta.thoiGian,
    lop: examMeta.lop || 12,
    publishedAt: new Date().toISOString(),
    questionCount: snapshotItems.length,
    questionRefs: snapshotItems.map(s => s.questionId),
    questionsSnapshot: snapshotItems
  };
}

export function regradeStudentSubmission(examSnapshot, studentAnswers) {
  let score = 0;
  const details = [];

  for (const q of examSnapshot.questionsSnapshot) {
    const sAns = studentAnswers[q.questionId];
    let isCorrect = false;

    if (q.type === 'MULTIPLE_CHOICE_4') {
      isCorrect = String(sAns || '').toUpperCase().trim() === String(q.correctAnswer || '').toUpperCase().trim();
    } else if (q.type === 'SHORT_ANSWER') {
      const numVal = parseFloat(sAns);
      if (!isNaN(numVal) && q.numericValue !== null) {
        const tol = q.tolerance !== null ? q.tolerance : 0;
        isCorrect = Math.abs(numVal - q.numericValue) <= tol;
      }
    } else if (q.type === 'TRUE_FALSE_4PART') {
      // sAns là object { a: true, b: false... }
      if (typeof sAns === 'object' && sAns !== null) {
        let correctSubCount = 0;
        for (const sub of q.subItems) {
          if (sAns[sub.key] === sub.isCorrect) correctSubCount++;
        }
        // Quy tắc điểm Bộ GD&ĐT: đúng 1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.5đ, 4 ý = 1đ
        const subScoreTable = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
        const earned = subScoreTable[correctSubCount] || 0;
        score += earned;
        details.push({ questionId: q.questionId, isCorrect: correctSubCount === 4, earnedScore: earned });
        continue;
      }
    }

    if (isCorrect) score += 1.0;
    details.push({ questionId: q.questionId, isCorrect, earnedScore: isCorrect ? 1.0 : 0 });
  }

  return {
    totalScore: score,
    maxScore: examSnapshot.questionCount,
    details
  };
}
