// -*- coding: utf-8 -*-
/**
 * Module: Game Question Selectors (Solo & Đua Top Production Modules)
 * Handles deterministic cognitive tier quotas, graceful fallback, and streak progressions.
 */

export class SoloMatchSelector {
  constructor(defaultConfig = {}) {
    this.config = {
      matchQuestionsCount: 8,
      quota: {
        NB: 3,
        TH: 3,
        VD: 1,
        VDC: 1
      },
      fallbackPriority: ['VD', 'TH', 'NB', 'VDC'],
      ...defaultConfig
    };
  }

  selectMatchQuestions(publishableBank, customConfig = {}) {
    const cfg = { ...this.config, ...customConfig };
    const targetCount = cfg.matchQuestionsCount;

    if (!Array.isArray(publishableBank) || publishableBank.length < targetCount) {
      return {
        success: false,
        error: `INSUFFICIENT_POOL: Cần tối thiểu ${targetCount} câu hỏi Tinh trong các chương đang mở, hiện chỉ có ${publishableBank?.length || 0} câu.`,
        questions: []
      };
    }

    // Nhóm theo bậc độ khó
    const pools = { NB: [], TH: [], VD: [], VDC: [] };
    for (const q of publishableBank) {
      const tier = q.difficultyLevel === 1 ? 'NB' : q.difficultyLevel === 2 ? 'TH' : q.difficultyLevel === 3 ? 'VD' : 'VDC';
      if (pools[tier]) pools[tier].push(q);
    }

    const selected = [];
    const pickedIds = new Set();
    const deficitTiers = [];

    // 1. Tuyển theo định mức chuẩn (Quota)
    for (const [tier, count] of Object.entries(cfg.quota)) {
      const pool = pools[tier] || [];
      let pickedCount = 0;
      for (const q of pool) {
        if (pickedCount >= count) break;
        if (!pickedIds.has(q.id)) {
          selected.push(q);
          pickedIds.add(q.id);
          pickedCount++;
        }
      }
      if (pickedCount < count) {
        deficitTiers.push({ tier, needed: count, got: pickedCount, deficit: count - pickedCount });
      }
    }

    // 2. Thuật toán Fallback: Bù đắp từ các bậc liền kề theo thứ tự ưu tiên
    if (selected.length < targetCount) {
      for (const tier of cfg.fallbackPriority) {
        const pool = pools[tier] || [];
        for (const q of pool) {
          if (selected.length >= targetCount) break;
          if (!pickedIds.has(q.id)) {
            selected.push(q);
            pickedIds.add(q.id);
          }
        }
        if (selected.length >= targetCount) break;
      }
    }

    // Fallback cuối cùng nếu vẫn thiếu (lấy bất kỳ câu hợp lệ còn lại)
    if (selected.length < targetCount) {
      for (const q of publishableBank) {
        if (selected.length >= targetCount) break;
        if (!pickedIds.has(q.id)) {
          selected.push(q);
          pickedIds.add(q.id);
        }
      }
    }

    return {
      success: selected.length === targetCount,
      targetCount,
      count: selected.length,
      deficitTiers,
      hasFallback: deficitTiers.length > 0,
      questions: selected
    };
  }
}

export class DuaTopQueueSelector {
  constructor(defaultConfig = {}) {
    this.config = {
      sessionQuestionsCount: 20,
      progressiveDifficulty: true,
      speedBonusThresholdSeconds: 30,
      streakMultiplierThresholds: [
        { minStreak: 5, multiplier: 1.2 },
        { minStreak: 10, multiplier: 1.5 }
      ],
      ...defaultConfig
    };
  }

  selectSessionQueue(publishableBank, customConfig = {}) {
    const cfg = { ...this.config, ...customConfig };
    if (!Array.isArray(publishableBank) || publishableBank.length === 0) {
      return { success: false, error: 'NO_QUESTIONS_AVAILABLE', queue: [] };
    }

    // Lấy câu hỏi hỗ trợ trả lời đơn (TN4 hoặc TLN)
    const validPool = publishableBank.filter(
      q => q.type === 'MULTIPLE_CHOICE_4' || q.type === 'SHORT_ANSWER'
    );

    // Sắp xếp lũy tiến theo độ khó (1 -> 2 -> 3 -> 4)
    const sortedQueue = [...validPool].sort(
      (a, b) => (a.difficultyLevel || 1) - (b.difficultyLevel || 1)
    );

    const queue = sortedQueue.slice(0, cfg.sessionQuestionsCount);
    return {
      success: true,
      sessionCount: queue.length,
      queue
    };
  }

  calculateQuestionScore({ basePoints = 100, isCorrect, timeSpentSeconds, currentStreak }) {
    if (!isCorrect) return { pointsEarned: 0, streakBroken: true, newStreak: 0 };

    const newStreak = currentStreak + 1;
    let multiplier = 1.0;

    for (const t of this.config.streakMultiplierThresholds) {
      if (newStreak >= t.minStreak) {
        multiplier = Math.max(multiplier, t.multiplier);
      }
    }

    let speedBonus = 0;
    if (timeSpentSeconds <= this.config.speedBonusThresholdSeconds) {
      // Thưởng tối đa 50 điểm nếu giải cực nhanh
      speedBonus = Math.round(((this.config.speedBonusThresholdSeconds - timeSpentSeconds) / this.config.speedBonusThresholdSeconds) * 50);
    }

    const pointsEarned = Math.round(basePoints * multiplier) + speedBonus;
    return {
      pointsEarned,
      multiplier,
      speedBonus,
      streakBroken: false,
      newStreak
    };
  }
}
