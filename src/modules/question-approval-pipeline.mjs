// -*- coding: utf-8 -*-
/**
 * Module: Question Approval Pipeline (Review & Approval Service)
 * Implements strict Raw/Refined separation, bulk review actions, and zero-raw-leakage guarantee.
 */

export class QuestionApprovalStore {
  constructor(initialQuestions = []) {
    this.questions = new Map(initialQuestions.map(q => [q.id, JSON.parse(JSON.stringify(q))]));
  }

  async getQuestion(id) {
    const q = this.questions.get(id);
    return q ? JSON.parse(JSON.stringify(q)) : null;
  }

  async saveQuestion(question) {
    if (!question.id) throw new Error('Question must have an id');
    this.questions.set(question.id, JSON.parse(JSON.stringify(question)));
    return true;
  }

  async listAllQuestions() {
    return Array.from(this.questions.values()).map(q => JSON.parse(JSON.stringify(q)));
  }
}

export class QuestionApprovalService {
  constructor(store = new QuestionApprovalStore()) {
    this.store = store;
  }

  async getRawQuestions(filters = {}) {
    const all = await this.store.listAllQuestions();
    return all.filter(q => {
      // Chỉ lấy câu ở Tầng Thô
      if (q.rawTier !== 'THO' && q.status !== 'DRAFT' && q.status !== 'QA_PASSED') {
        return false;
      }
      if (filters.courseId && q.khoaHoc !== filters.courseId) return false;
      if (filters.stage && q.giaiDoan !== filters.stage) return false;
      if (filters.chapterNumber && q.taxonomy?.chapterNumber !== filters.chapterNumber) return false;
      if (filters.qualityFlag && (!q.qualityFlags || !q.qualityFlags.includes(filters.qualityFlag))) return false;
      return true;
    });
  }

  async getQuestionDetails(questionId) {
    const q = await this.store.getQuestion(questionId);
    if (!q) throw new Error(`Câu hỏi ${questionId} không tồn tại`);

    return {
      id: q.id,
      version: q.version || 1,
      type: q.type,
      stem: q.stem,
      options: q.options || [],
      subItems: q.subItems || [],
      correctAnswer: q.correctAnswer,
      numericValue: q.numericValue,
      tolerance: q.tolerance,
      unit: q.unit,
      acceptedAnswers: q.acceptedAnswers || [],
      explanation: q.explanation,
      difficultyLevel: q.difficultyLevel,
      difficultyName: q.difficultyName,
      taxonomy: q.taxonomy || {},
      sourceProvenance: q.sourceProvenance || {},
      originalityStatus: q.originalityStatus || 'ORIGINAL',
      qualityFlags: q.qualityFlags || [],
      mediaAssets: q.mediaAssets || [],
      rawTier: q.rawTier,
      status: q.status,
      reviewedBy: q.reviewedBy,
      reviewedAt: q.reviewedAt,
      usageScopes: q.usageScopes || []
    };
  }

  async approveQuestionsToTinh({ questionIds, teacherId, timestamp = new Date().toISOString(), usageScopes }) {
    // 1. RÀNG BUỘC PHÊ DUYỆT BẮT BUỘC CỦA THẦY
    if (!teacherId || typeof teacherId !== 'string' || !teacherId.trim()) {
      throw new Error('THAO TÁC BỊ TỪ CHỐI: Bắt buộc phải có định danh người duyệt (teacherId). Không cho phép tự động chuyển trạng thái.');
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      throw new Error('Danh sách câu hỏi cần duyệt không được rỗng');
    }

    const defaultScopes = [
      'THEORY_BANK',
      'EXERCISE_BANK',
      'DUA_TOP_FAST_QUIZ',
      'SOLO_PVP',
      'MOCK_EXAM_THPTQG'
    ];
    const assignedScopes = usageScopes || defaultScopes;

    const approvedList = [];
    for (const qId of questionIds) {
      const q = await this.store.getQuestion(qId);
      if (!q) throw new Error(`Không tìm thấy câu hỏi ${qId}`);

      // Chuyển tầng sang TINH
      q.rawTier = 'TINH';
      q.status = 'TEACHER_APPROVED';
      q.reviewedBy = teacherId.trim();
      q.reviewedAt = timestamp;
      q.usageScopes = assignedScopes;
      q.version = (q.version || 1) + 1; // Tăng phiên bản khi phê duyệt

      await this.store.saveQuestion(q);
      approvedList.push(q);
    }

    return {
      success: true,
      approvedCount: approvedList.length,
      reviewedBy: teacherId,
      reviewedAt: timestamp,
      approvedQuestionIds: approvedList.map(q => q.id)
    };
  }

  async rejectQuestion({ questionId, teacherId, reason }) {
    if (!teacherId) throw new Error('Bắt buộc phải có teacherId khi từ chối');

    const q = await this.store.getQuestion(questionId);
    if (!q) throw new Error(`Không tìm thấy câu hỏi ${questionId}`);

    q.status = 'REJECTED';
    q.rawTier = 'THO';
    q.reviewedBy = teacherId;
    q.reviewedAt = new Date().toISOString();
    q.rejectionReason = reason || 'Không đạt tiêu chuẩn sư phạm';

    await this.store.saveQuestion(q);
    return { success: true, questionId, status: 'REJECTED' };
  }

  async getPublicPublishableQuestions(teachingScope, targetUsageScope = null) {
    const all = await this.store.listAllQuestions();
    
    // Xác thực Teaching Scope
    const openChapters = new Set(
      (teachingScope.activeChapters || []).filter(c => c.isOpen).map(c => c.chapterNumber)
    );
    const activeLessons = new Set(teachingScope.activeLessons || []);

    const publishable = [];
    const blockedCount = { rawTierTho: 0, qaPassedNotApproved: 0, chapterClosed: 0, lessonInactive: 0 };

    for (const q of all) {
      // 1. RÀO CHẮN THÔ TUYỆT ĐỐI
      if (q.rawTier === 'THO') {
        blockedCount.rawTierTho++;
        continue;
      }
      if (q.status !== 'TEACHER_APPROVED' && q.status !== 'PUBLISHED') {
        blockedCount.qaPassedNotApproved++;
        continue;
      }

      // 2. RÀO CHẮN TIẾN ĐỘ DẠY
      if (!openChapters.has(q.taxonomy?.chapterNumber)) {
        blockedCount.chapterClosed++;
        continue;
      }
      if (activeLessons.size > 0 && q.taxonomy?.lessonCode && !activeLessons.has(q.taxonomy?.lessonCode)) {
        blockedCount.lessonInactive++;
        continue;
      }

      // 3. RÀO CHẮN USAGE SCOPE
      if (targetUsageScope && Array.isArray(q.usageScopes) && !q.usageScopes.includes(targetUsageScope)) {
        continue;
      }

      publishable.push(q);
    }

    return {
      publishableQuestions: publishable,
      totalBlocked: blockedCount.rawTierTho + blockedCount.qaPassedNotApproved + blockedCount.chapterClosed + blockedCount.lessonInactive,
      blockedDetails: blockedCount
    };
  }
}
