// -*- coding: utf-8 -*-
/**
 * Module: Teaching Scope Manager (Core Engine)
 * Manages courses, stages, multi-chapter/lesson toggles, time windows, and active state.
 * Uses storage adapter pattern (MemoryStorageAdapter, MockFileStorageAdapter).
 */

export class MemoryStorageAdapter {
  constructor(initialData = {}) {
    this.scopes = new Map(Object.entries(initialData));
  }

  async getScope(scopeId) {
    const s = this.scopes.get(scopeId);
    return s ? JSON.parse(JSON.stringify(s)) : null;
  }

  async saveScope(scope) {
    if (!scope.scopeId) throw new Error('Scope must have a scopeId');
    this.scopes.set(scope.scopeId, JSON.parse(JSON.stringify(scope)));
    return true;
  }

  async listScopes() {
    return Array.from(this.scopes.values()).map(s => JSON.parse(JSON.stringify(s)));
  }
}

export class TeachingScopeManager {
  constructor(storageAdapter = new MemoryStorageAdapter()) {
    this.storage = storageAdapter;
  }

  async createScope(config) {
    if (!config.scopeId || !config.courseId || !config.stage) {
      throw new Error('Thiếu thông tin bắt buộc: scopeId, courseId, stage');
    }

    const scope = {
      scopeId: config.scopeId,
      courseId: config.courseId,
      stage: config.stage,
      isActive: config.isActive ?? true,
      validFrom: config.validFrom || new Date().toISOString(),
      validTo: config.validTo || null,
      activeChapters: (config.activeChapters || []).map(c => ({
        chapterNumber: c.chapterNumber,
        chapterCode: c.chapterCode || `C${c.chapterNumber}`,
        chapterTitle: c.chapterTitle || '',
        isOpen: c.isOpen ?? true
      })),
      activeLessons: config.activeLessons || [],
      qualityPolicy: config.qualityPolicy || {
        requireApprovedOnly: true,
        allowedTiers: ['TINH'],
        allowedStatuses: ['TEACHER_APPROVED', 'PUBLISHED']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.storage.saveScope(scope);
    return scope;
  }

  async toggleChapter(scopeId, chapterNumber, isOpen) {
    const scope = await this.storage.getScope(scopeId);
    if (!scope) throw new Error(`Scope ${scopeId} không tồn tại`);

    let found = false;
    for (const c of scope.activeChapters) {
      if (c.chapterNumber === chapterNumber) {
        c.isOpen = Boolean(isOpen);
        found = true;
        break;
      }
    }

    if (!found) {
      scope.activeChapters.push({
        chapterNumber,
        chapterCode: `C${chapterNumber}`,
        chapterTitle: `Chương ${chapterNumber}`,
        isOpen: Boolean(isOpen)
      });
    }

    scope.updatedAt = new Date().toISOString();
    await this.storage.saveScope(scope);
    return scope;
  }

  async toggleLesson(scopeId, lessonCode, isActive) {
    const scope = await this.storage.getScope(scopeId);
    if (!scope) throw new Error(`Scope ${scopeId} không tồn tại`);

    const lessonsSet = new Set(scope.activeLessons || []);
    if (isActive) {
      lessonsSet.add(lessonCode);
    } else {
      lessonsSet.delete(lessonCode);
    }

    scope.activeLessons = Array.from(lessonsSet);
    scope.updatedAt = new Date().toISOString();
    await this.storage.saveScope(scope);
    return scope;
  }

  async setTimeWindow(scopeId, validFrom, validTo) {
    const scope = await this.storage.getScope(scopeId);
    if (!scope) throw new Error(`Scope ${scopeId} không tồn tại`);

    if (validFrom && validTo && new Date(validFrom) > new Date(validTo)) {
      throw new Error('validFrom không thể lớn hơn validTo');
    }

    scope.validFrom = validFrom;
    scope.validTo = validTo;
    scope.updatedAt = new Date().toISOString();
    await this.storage.saveScope(scope);
    return scope;
  }

  async setActiveState(scopeId, isActive) {
    const scope = await this.storage.getScope(scopeId);
    if (!scope) throw new Error(`Scope ${scopeId} không tồn tại`);

    scope.isActive = Boolean(isActive);
    scope.updatedAt = new Date().toISOString();
    await this.storage.saveScope(scope);
    return scope;
  }

  validateScope(scope, now = new Date()) {
    if (!scope) return { isValid: false, reason: 'SCOPE_NOT_FOUND' };
    if (!scope.isActive) return { isValid: false, reason: 'SCOPE_INACTIVE' };

    if (scope.validFrom && new Date(scope.validFrom) > now) {
      return { isValid: false, reason: 'SCOPE_NOT_STARTED' };
    }
    if (scope.validTo && new Date(scope.validTo) < now) {
      return { isValid: false, reason: 'SCOPE_EXPIRED' };
    }

    const openChapters = scope.activeChapters.filter(c => c.isOpen).map(c => c.chapterNumber);
    if (openChapters.length === 0) {
      return { isValid: false, reason: 'NO_OPEN_CHAPTERS' };
    }

    return {
      isValid: true,
      openChapterNumbers: openChapters,
      activeLessons: scope.activeLessons || []
    };
  }

  async getActiveScopeForStudent(courseId, stage, now = new Date()) {
    const allScopes = await this.storage.listScopes();
    for (const s of allScopes) {
      if (s.courseId === courseId && s.stage === stage) {
        const val = this.validateScope(s, now);
        if (val.isValid) {
          return { scope: s, validation: val };
        }
      }
    }
    return null;
  }
}
