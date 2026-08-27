// -*- coding: utf-8 -*-
/**
 * Module: Pedagogical Configuration (PROPOSED_CONFIG)
 * Holds pedagogical rules and game parameters as configurable settings awaiting Teacher's final decision.
 * NONE of these values are hardcoded as final decisions.
 */

export const PROPOSED_CONFIG = {
  _status: 'PROPOSED_AWAITING_TEACHER_APPROVAL',
  _note: 'Toàn bộ tham số sư phạm dưới đây là bản ĐỀ XUẤT từ Machine-1, có thể tùy chỉnh linh hoạt và cần Thầy phê duyệt chính thức.',

  soloMode: {
    matchQuestionsCount: 8,
    quota: {
      NB: 3, // 3 câu Nhận biết (Level 1)
      TH: 3, // 3 câu Thông hiểu (Level 2)
      VD: 1, // 1 câu Vận dụng (Level 3)
      VDC: 1 // 1 câu Vận dụng cao (Level 4)
    },
    fallbackPolicy: {
      mode: 'ADJACENT_TIER_BORROWING', // Mượn từ bậc liền kề
      priorityOrder: ['VD', 'TH', 'NB', 'VDC'],
      description: 'Khi kho câu hỏi của các chương đang mở thiếu câu ở một bậc, tự động bù đắp theo thứ tự ưu tiên.'
    },
    timePerQuestionSeconds: 40,
    allowSkip: false
  },

  duaTopMode: {
    sessionQuestionsCount: 20,
    difficultyOrdering: 'PROGRESSIVE_ASCENDING', // Sắp xếp tăng dần theo độ khó
    speedBonus: {
      enabled: true,
      thresholdSeconds: 30, // Dưới 30s được tính điểm tốc độ
      maxBonusPoints: 50,
      formula: 'Math.round(((30 - timeSpent) / 30) * 50)'
    },
    streakMultipliers: [
      { minStreak: 5, multiplier: 1.2, label: 'Chuỗi 5 câu đúng (+20% điểm)' },
      { minStreak: 10, multiplier: 1.5, label: 'Chuỗi 10 câu đúng (+50% điểm)' },
      { minStreak: 15, multiplier: 2.0, label: 'Chuỗi 15 câu đúng (x2 điểm)' }
    ]
  },

  examSnapshotPolicy: {
    immutabilityEnforced: true,
    regradePreservesHistory: true,
    hashAlgorithm: 'PENDING_MACHINE_2_CANONICAL_HASH'
  }
};

export class PedagogicalConfigManager {
  constructor(initialConfig = PROPOSED_CONFIG) {
    this.config = JSON.parse(JSON.stringify(initialConfig));
  }

  getConfig() {
    return JSON.parse(JSON.stringify(this.config));
  }

  updateConfig(patch, teacherId) {
    if (!teacherId) {
      throw new Error('Chỉ Thầy hoặc Quản trị viên đã xác thực mới có quyền thay đổi cấu hình sư phạm.');
    }
    this.config = {
      ...this.config,
      ...patch,
      _lastModifiedBy: teacherId,
      _lastModifiedAt: new Date().toISOString()
    };
    return this.config;
  }
}
