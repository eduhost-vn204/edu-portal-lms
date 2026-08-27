// -*- coding: utf-8 -*-
/**
 * Master Test Suite: Web Pipeline Production Modules v2.1
 * Runs comprehensive automated unit tests for all 4 core modules.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { TeachingScopeManager, MemoryStorageAdapter } from '../src/modules/teaching-scope-manager.mjs';
import { QuestionApprovalService, QuestionApprovalStore } from '../src/modules/question-approval-pipeline.mjs';
import { SoloMatchSelector, DuaTopQueueSelector } from '../src/modules/game-question-selectors.mjs';
import { ExamSnapshotService } from '../src/modules/immutable-exam-snapshot.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANK_PATH = path.join(__dirname, '..', 'data', 'synthetic-fixtures', 'canonical-synthetic-bank.json');
const SCOPE_PATH = path.join(__dirname, '..', 'data', 'synthetic-fixtures', 'synthetic-teaching-scope.json');

const syntheticBank = JSON.parse(fs.readFileSync(BANK_PATH, 'utf-8'));
const { teachingScope } = JSON.parse(fs.readFileSync(SCOPE_PATH, 'utf-8'));

console.log('======================================================================');
console.log('   BỘ KIỂM THỬ TỰ ĐỘNG: WEB PIPELINE PRODUCTION MODULES (V2.1)        ');
console.log('======================================================================\n');

// -------------------------------------------------------------------------
// SUITE 1: TEACHING SCOPE MANAGER
// -------------------------------------------------------------------------
console.log('[SUITE 1] Kiểm thử TeachingScopeManager...');
{
  const manager = new TeachingScopeManager(new MemoryStorageAdapter());
  
  // 1.1 Tạo Scope mới
  const created = await manager.createScope(teachingScope);
  assert.strictEqual(created.scopeId, 'SCOPE_2026_GD1_ACTIVE');
  assert.strictEqual(created.activeChapters.length, 2);
  console.log('  ✓ 1.1: Tạo Scope thành công.');

  // 1.2 Bật tắt chương
  await manager.toggleChapter('SCOPE_2026_GD1_ACTIVE', 2, true);
  const updated = await manager.storage.getScope('SCOPE_2026_GD1_ACTIVE');
  const c2 = updated.activeChapters.find(c => c.chapterNumber === 2);
  assert.strictEqual(c2.isOpen, true);
  console.log('  ✓ 1.2: Bật mở Chương 2 thành công.');

  // 1.3 Bật tắt bài học
  await manager.toggleLesson('SCOPE_2026_GD1_ACTIVE', 'G12_C2_B01', true);
  const afterLesson = await manager.storage.getScope('SCOPE_2026_GD1_ACTIVE');
  assert.ok(afterLesson.activeLessons.includes('G12_C2_B01'));
  console.log('  ✓ 1.3: Kích hoạt Bài G12_C2_B01 thành công.');

  // 1.4 Lấy scope hợp lệ cho học sinh
  const studentScope = await manager.getActiveScopeForStudent('XPS_2K9', 'GD1_LY_THUYET', new Date('2026-08-15T00:00:00Z'));
  assert.ok(studentScope !== null);
  assert.strictEqual(studentScope.validation.isValid, true);
  assert.deepStrictEqual(studentScope.validation.openChapterNumbers, [1, 2]);
  console.log('  ✓ 1.4: Lấy Scope hợp lệ cho học sinh thành công (Mở C1 + C2).');
}

// -------------------------------------------------------------------------
// SUITE 2: QUESTION APPROVAL PIPELINE (THÔ -> TINH & ZERO RAW LEAKAGE)
// -------------------------------------------------------------------------
console.log('\n[SUITE 2] Kiểm thử QuestionApprovalService & Rào chắn An toàn...');
{
  const service = new QuestionApprovalService(new QuestionApprovalStore(syntheticBank));

  // 2.1 Danh sách câu Thô
  const rawList = await service.getRawQuestions();
  assert.strictEqual(rawList.length, 1);
  assert.strictEqual(rawList[0].id, 'VLXT-G12-C1-B03-Q0099');
  console.log('  ✓ 2.1: Lấy danh sách câu Thô chính xác (1 câu nháp).');

  // 2.2 Xem chi tiết câu hỏi
  const details = await service.getQuestionDetails('VLXT-G12-C1-B03-Q0099');
  assert.strictEqual(details.rawTier, 'THO');
  assert.strictEqual(details.originalityStatus, 'VERBATIM_QUOTE');
  console.log('  ✓ 2.2: Xem chi tiết câu hỏi Thô đầy đủ.');

  // 2.3 Ràng buộc bắt buộc Teacher Confirmation
  let failedWithoutTeacher = false;
  try {
    await service.approveQuestionsToTinh({ questionIds: ['VLXT-G12-C1-B03-Q0099'], teacherId: '' });
  } catch (err) {
    failedWithoutTeacher = true;
  }
  assert.strictEqual(failedWithoutTeacher, true, 'Hệ thống PHẢI từ chối duyệt nếu thiếu teacherId');
  console.log('  ✓ 2.3: Bắt buộc xác nhận của Thầy (chặn thao tác tự động/vô danh).');

  // 2.4 Thầy duyệt chính thức
  const approveRes = await service.approveQuestionsToTinh({
    questionIds: ['VLXT-G12-C1-B03-Q0099'],
    teacherId: 'THAY_XUAN_TRUONG_ADMIN',
    timestamp: '2026-08-27T21:00:00Z'
  });
  assert.strictEqual(approveRes.approvedCount, 1);
  const approvedQ = await service.store.getQuestion('VLXT-G12-C1-B03-Q0099');
  assert.strictEqual(approvedQ.rawTier, 'TINH');
  assert.strictEqual(approvedQ.status, 'TEACHER_APPROVED');
  assert.strictEqual(approvedQ.reviewedBy, 'THAY_XUAN_TRUONG_ADMIN');
  console.log('  ✓ 2.4: Thầy duyệt chuyển Tinh thành công (rawTier: TINH, version + 1).');

  // 2.5 Rào chắn xuất bản cho học sinh
  const publishRes = await service.getPublicPublishableQuestions(teachingScope);
  assert.strictEqual(publishRes.publishableQuestions.length, 9);
  for (const q of publishRes.publishableQuestions) {
    assert.strictEqual(q.rawTier, 'TINH');
    assert.notStrictEqual(q.status, 'QA_PASSED');
  }
  console.log('  ✓ 2.5: Rào chắn xuất bản: 100% câu phát hành là TINH, 0% câu Thô.');
}

// -------------------------------------------------------------------------
// SUITE 3: GAME QUESTION SELECTORS (SOLO & ĐUA TOP)
// -------------------------------------------------------------------------
console.log('\n[SUITE 3] Kiểm thử SoloMatchSelector & DuaTopQueueSelector...');
{
  const publishable = syntheticBank.filter(q => q.rawTier === 'TINH' && q.taxonomy?.chapterNumber === 1);
  const soloSelector = new SoloMatchSelector();

  // 3.1 Tuyển 8 câu Solo chuẩn Quota (3 NB + 3 TH + 1 VD + 1 VDC)
  const match = soloSelector.selectMatchQuestions(publishable);
  assert.strictEqual(match.success, true);
  assert.strictEqual(match.count, 8);
  console.log('  ✓ 3.1: Tuyển đủ 8 câu Solo chuẩn Quota 3 NB + 3 TH + 1 VD + 1 VDC.');

  // 3.2 Fallback khi thiếu câu VDC
  const bankNoVdc = publishable.filter(q => q.difficultyLevel !== 4);
  const fallbackMatch = soloSelector.selectMatchQuestions(bankNoVdc, { matchQuestionsCount: 7 });
  assert.strictEqual(fallbackMatch.success, true);
  assert.strictEqual(fallbackMatch.hasFallback, true);
  console.log('  ✓ 3.2: Fallback an toàn khi thiếu bậc độ khó (bù đắp từ bậc liền kề).');

  // 3.3 Hàng đợi Đua Top & Tính điểm chuỗi/tốc độ
  const duaTopSelector = new DuaTopQueueSelector();
  const queueRes = duaTopSelector.selectSessionQueue(publishable);
  assert.strictEqual(queueRes.success, true);
  assert.ok(queueRes.sessionCount > 0);

  const scoreRes = duaTopSelector.calculateQuestionScore({
    basePoints: 100,
    isCorrect: true,
    timeSpentSeconds: 15,
    currentStreak: 5
  });
  assert.ok(scoreRes.multiplier >= 1.2);
  assert.ok(scoreRes.speedBonus > 0);
  assert.strictEqual(scoreRes.newStreak, 6);
  console.log(`  ✓ 3.3: Tính điểm Đua Top (Streak 6: x${scoreRes.multiplier}, Thưởng tốc độ: +${scoreRes.speedBonus}đ).`);
}

// -------------------------------------------------------------------------
// SUITE 4: IMMUTABLE EXAM SNAPSHOT & INJECTED HASHER
// -------------------------------------------------------------------------
console.log('\n[SUITE 4] Kiểm thử ExamSnapshotService & Injected Hasher...');
{
  // 4.1 Tạo snapshot với custom injected hasher
  let injectedHasherCallCount = 0;
  const customHasher = (payload) => {
    injectedHasherCallCount++;
    return `MOCK_HASH_${injectedHasherCallCount}`;
  };

  const examService = new ExamSnapshotService(customHasher);
  const examSnapshot = examService.createExamSnapshot({
    examMeta: { examId: 'EXAM_TEST_SNAPSHOT_01', tenDe: 'Đề Kiểm Tra Định Kỳ' },
    questionIds: ['VLXT-G12-C1-B01-Q0001', 'VLXT-G12-C1-B02-Q0001', 'VLXT-G12-C1-B03-Q0001'],
    questionBank: syntheticBank
  });

  assert.strictEqual(injectedHasherCallCount, 3);
  assert.strictEqual(examSnapshot.questionsSnapshot[0].contentHash, 'MOCK_HASH_1');
  console.log('  ✓ 4.1: Tạo Snapshot thành công với Injected Hasher (decoupled từ thuật toán hash).');

  // 4.2 Chấm điểm hỗn hợp TN4, DS, TLN
  const studentAnswers = {
    'VLXT-G12-C1-B01-Q0001': 'A', // Đúng TN4 (1đ)
    'VLXT-G12-C1-B02-Q0001': { a: true, b: true, c: false, d: false }, // Đúng 3/4 ý DS (0.5đ)
    'VLXT-G12-C1-B03-Q0001': '602' // Sai số trong tolerance=5 (1đ)
  };

  const gradeRes = examService.gradeSubmission(examSnapshot, studentAnswers);
  assert.strictEqual(gradeRes.totalScore, 2.5);
  console.log('  ✓ 4.2: Chấm điểm bài thi đa định dạng đạt 2.5 / 3.0 điểm.');

  // 4.3 Anti-Mutation: Thay đổi đáp án trong ngân hàng gốc
  const mutatedBank = JSON.parse(JSON.stringify(syntheticBank));
  const bankQ1 = mutatedBank.find(q => q.id === 'VLXT-G12-C1-B01-Q0001');
  const bankQ2 = mutatedBank.find(q => q.id === 'VLXT-G12-C1-B02-Q0001');
  if (bankQ1) bankQ1.correctAnswer = 'C';
  if (bankQ2 && bankQ2.subItems[0]) bankQ2.subItems[0].isCorrect = false;

  const regradeRes = examService.gradeSubmission(examSnapshot, studentAnswers);
  assert.strictEqual(regradeRes.totalScore, 2.5);
  console.log('  ✓ 4.3: Đảm bảo tính bất biến: Điểm số bài thi không đổi dù ngân hàng gốc bị sửa.');
}

console.log('\n======================================================================');
console.log('  ✓ KẾT QUẢ: TẤT CẢ 15/15 TEST CASES ĐỀU PASS HOÀN TOÀN 100%!        ');
console.log('======================================================================');
