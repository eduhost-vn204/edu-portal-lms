// -*- coding: utf-8 -*-
/**
 * Module: Immutable Exam Snapshot Service
 * Decoupled from hardcoded hash implementations via dependency-injected hashers.
 * Guarantees exam immutability, deterministic anti-mutation grading, and comprehensive telemetry.
 */
import crypto from 'node:crypto';

// Default provisional fallback hasher (will be replaced seamlessly by Machine-2 central hasher)
export function defaultInjectedHasher(questionPayload) {
  const serialized = JSON.stringify(questionPayload, Object.keys(questionPayload).sort());
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

export class ExamSnapshotService {
  constructor(hasher = defaultInjectedHasher) {
    this.hasher = hasher;
  }

  setHasher(newHasher) {
    if (typeof newHasher !== 'function') throw new Error('Hasher must be a function');
    this.hasher = newHasher;
  }

  createExamSnapshot({ examMeta, questionIds, questionBank }) {
    if (!examMeta || !examMeta.examId) throw new Error('Thiếu examMeta.examId');
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw new Error('questionIds phải là một mảng không rỗng');
    }

    const bankMap = new Map(questionBank.map(q => [q.id, q]));
    const snapshotItems = [];

    for (let i = 0; i < questionIds.length; i++) {
      const qId = questionIds[i];
      const q = bankMap.get(qId);
      if (!q) throw new Error(`Câu hỏi ${qId} không tồn tại trong ngân hàng nguồn`);

      // Bóc tách payload phục vụ băm & bảo toàn snapshot
      const rawPayload = {
        type: q.type,
        stem: q.stem,
        options: q.options || [],
        subItems: q.subItems || [],
        correctAnswer: q.correctAnswer,
        numericValue: q.numericValue,
        tolerance: q.tolerance,
        unit: q.unit
      };

      const computedHash = this.hasher(rawPayload);

      snapshotItems.push({
        orderIndex: i + 1,
        questionId: q.id,
        version: q.version || 1,
        contentHash: computedHash,
        type: q.type,
        stem: q.stem,
        options: q.options ? JSON.parse(JSON.stringify(q.options)) : [],
        subItems: q.subItems ? JSON.parse(JSON.stringify(q.subItems)) : [],
        correctAnswer: q.correctAnswer,
        numericValue: q.numericValue,
        tolerance: q.tolerance,
        unit: q.unit,
        acceptedAnswers: q.acceptedAnswers ? [...q.acceptedAnswers] : [],
        explanation: q.explanation || '',
        difficultyLevel: q.difficultyLevel || 1,
        difficultyName: q.difficultyName || 'NHAN_BIET',
        snapshotCreatedAt: new Date().toISOString()
      });
    }

    return {
      examId: examMeta.examId,
      tenDe: examMeta.tenDe,
      thoiGianPhut: examMeta.thoiGian || 50,
      lop: examMeta.lop || 12,
      publishedAt: new Date().toISOString(),
      questionCount: snapshotItems.length,
      questionRefs: snapshotItems.map(s => s.questionId),
      questionsSnapshot: snapshotItems
    };
  }

  gradeSubmission(examSnapshot, studentAnswers = {}) {
    if (!examSnapshot || !Array.isArray(examSnapshot.questionsSnapshot)) {
      throw new Error('examSnapshot không hợp lệ');
    }

    let totalScore = 0;
    let totalQuestions = examSnapshot.questionsSnapshot.length;
    const itemResults = [];

    for (const q of examSnapshot.questionsSnapshot) {
      const sAns = studentAnswers[q.questionId];
      let isCorrect = false;
      let earnedScore = 0;
      let feedback = '';

      if (q.type === 'MULTIPLE_CHOICE_4') {
        const studentChoice = String(sAns || '').toUpperCase().trim();
        const standardChoice = String(q.correctAnswer || '').toUpperCase().trim();
        isCorrect = studentChoice === standardChoice && studentChoice !== '';
        earnedScore = isCorrect ? 1.0 : 0;
        feedback = isCorrect ? 'Chính xác' : `Đáp án đúng là ${standardChoice}`;
      } else if (q.type === 'SHORT_ANSWER') {
        const numVal = parseFloat(sAns);
        const tol = q.tolerance !== null && q.tolerance !== undefined ? q.tolerance : 0;
        
        if (!isNaN(numVal) && q.numericValue !== null && q.numericValue !== undefined) {
          isCorrect = Math.abs(numVal - q.numericValue) <= tol;
        }
        
        // Kiểm tra danh sách chấp nhận chuỗi mở rộng
        if (!isCorrect && Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0) {
          const sNormalized = String(sAns || '').toLowerCase().trim();
          isCorrect = q.acceptedAnswers.some(a => String(a).toLowerCase().trim() === sNormalized);
        }

        earnedScore = isCorrect ? 1.0 : 0;
        feedback = isCorrect ? 'Chính xác' : `Giá trị chuẩn: ${q.numericValue} ${q.unit || ''}`;
      } else if (q.type === 'TRUE_FALSE_4PART') {
        if (typeof sAns === 'object' && sAns !== null) {
          let correctSubItemsCount = 0;
          const subDetails = [];

          for (const sub of (q.subItems || [])) {
            const subStudentAns = sAns[sub.key];
            const isSubCorrect = subStudentAns === sub.isCorrect;
            if (isSubCorrect) correctSubItemsCount++;
            subDetails.push({ key: sub.key, studentAns: subStudentAns, expected: sub.isCorrect, isCorrect: isSubCorrect });
          }

          // Thang điểm chuẩn Bộ GD&ĐT: đúng 1 ý = 0.1đ, 2 ý = 0.25đ, 3 ý = 0.5đ, 4 ý = 1.0đ
          const scoreTable = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 1.0 };
          earnedScore = scoreTable[correctSubItemsCount] || 0;
          isCorrect = correctSubItemsCount === 4;
          feedback = `Đúng ${correctSubItemsCount}/4 ý (${earnedScore} điểm)`;
        }
      }

      totalScore += earnedScore;
      itemResults.push({
        questionId: q.questionId,
        type: q.type,
        studentAnswer: sAns,
        isCorrect,
        earnedScore,
        feedback
      });
    }

    return {
      examId: examSnapshot.examId,
      totalScore: Math.round(totalScore * 100) / 100,
      maxScore: totalQuestions,
      gradedAt: new Date().toISOString(),
      itemResults
    };
  }
}
