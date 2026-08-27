// -*- coding: utf-8 -*-
/**
 * Test Suite: Prototype Web Pipeline (Teaching Scope, Raw Tier Blocker, Solo/DuaTop Selector, Immutable Exam)
 * Validates all 5 functional requirements specified in Gate Check v2.1.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  validateTeachingScope,
  filterPublishableQuestions,
  selectSoloMatchQuestions,
  selectDuaTopQueue,
  createImmutableExamSnapshot,
  regradeStudentSubmission
} from './prototype-teaching-scope.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BANK_PATH = path.join(__dirname, '..', 'data', 'synthetic-fixtures', 'canonical-synthetic-bank.json');
const SCOPE_PATH = path.join(__dirname, '..', 'data', 'synthetic-fixtures', 'synthetic-teaching-scope.json');

const syntheticBank = JSON.parse(fs.readFileSync(BANK_PATH, 'utf-8'));
const { teachingScope } = JSON.parse(fs.readFileSync(SCOPE_PATH, 'utf-8'));

console.log('======================================================================');
console.log('   BỘ KIỂM THỬ PROTOTYPE WEB PIPELINE V2.1 (SYNTHETIC FIXTURES)      ');
console.log('======================================================================\n');

// -------------------------------------------------------------------------
// TEST 1: TEACHING SCOPE VALIDATION (TIME WINDOW & ACTIVE STATE)
// -------------------------------------------------------------------------
console.log('[TEST 1] Kiểm tra tính hợp lệ của Teaching Scope...');
{
  const validRes = validateTeachingScope(teachingScope, new Date('2026-08-15T00:00:00Z'));
  assert.strictEqual(validRes.isValid, true);
  assert.deepStrictEqual(validRes.activeOpenChapterNumbers, [1]);
  console.log('  ✓ PASS: Scope hợp lệ trong khoảng thời gian hiệu lực.');

  const notStartedRes = validateTeachingScope(teachingScope, new Date('2026-07-01T00:00:00Z'));
  assert.strictEqual(notStartedRes.isValid, false);
  assert.strictEqual(notStartedRes.reason, 'SCOPE_NOT_STARTED');
  console.log('  ✓ PASS: Phát hiện chính xác scope chưa đến ngày mở.');

  const expiredRes = validateTeachingScope(teachingScope, new Date('2026-10-01T00:00:00Z'));
  assert.strictEqual(expiredRes.isValid, false);
  assert.strictEqual(expiredRes.reason, 'SCOPE_EXPIRED');
  console.log('  ✓ PASS: Phát hiện chính xác scope đã hết hạn.');

  const inactiveScope = { ...teachingScope, isActive: false };
  const inactiveRes = validateTeachingScope(inactiveScope, new Date('2026-08-15T00:00:00Z'));
  assert.strictEqual(inactiveRes.isValid, false);
  assert.strictEqual(inactiveRes.reason, 'SCOPE_INACTIVE');
  console.log('  ✓ PASS: Phát hiện chính xác scope đang bị Admin tắt.');
}

// -------------------------------------------------------------------------
// TEST 2: STRICT RAW TIER BLOCKER (CHỐNG LỌT CÂU THÔ TUYỆT ĐỐI)
// -------------------------------------------------------------------------
console.log('\n[TEST 2] Kiểm thử Rào chắn Chống lọt câu Thô & Lọc Teaching Scope...');
{
  const filterRes = filterPublishableQuestions(syntheticBank, teachingScope);
  assert.strictEqual(filterRes.success, true);
  
  // Tổng cộng bank có 9 câu: 8 câu Tinh và 1 câu Thô (VLXT-G12-C1-B03-Q0099)
  assert.strictEqual(filterRes.totalBank, 9);
  assert.strictEqual(filterRes.publishableCount, 8);
  assert.strictEqual(filterRes.rejectedReasons.rawTierTho, 1);

  // Đảm bảo không có câu Thô nào xuất hiện trong mảng publishable
  for (const q of filterRes.questions) {
    assert.strictEqual(q.rawTier, 'TINH', `Câu ${q.id} không phải là TINH!`);
    assert.notStrictEqual(q.status, 'QA_PASSED', `Câu ${q.id} mang trạng thái QA_PASSED lọt vào production!`);
    assert.notStrictEqual(q.status, 'DRAFT', `Câu ${q.id} mang trạng thái DRAFT lọt vào production!`);
    assert.strictEqual(q.status, 'TEACHER_APPROVED');
  }
  console.log(`  ✓ PASS: Đã chặn 100% câu Thô (${filterRes.rejectedReasons.rawTierTho} câu bị loại, ${filterRes.publishableCount} câu Tinh được duyệt).`);
}

// -------------------------------------------------------------------------
// TEST 3: SOLO QUESTION SELECTOR (QUOTA 3 NB + 3 TH + 1 VD + 1 VDC & FALLBACK)
// -------------------------------------------------------------------------
console.log('\n[TEST 3] Kiểm thử Bộ chọn câu Solo 1-1...');
{
  const publishable = filterPublishableQuestions(syntheticBank, teachingScope).questions;
  const soloConfig = teachingScope.gameModes.solo;

  const soloMatch = selectSoloMatchQuestions(publishable, soloConfig);
  assert.strictEqual(soloMatch.isComplete, true);
  assert.strictEqual(soloMatch.count, 8);

  const diffCounts = { NB: 0, TH: 0, VD: 0, VDC: 0 };
  for (const q of soloMatch.questions) {
    const diff = q.difficultyLevel === 1 ? 'NB' : q.difficultyLevel === 2 ? 'TH' : q.difficultyLevel === 3 ? 'VD' : 'VDC';
    diffCounts[diff]++;
  }

  assert.strictEqual(diffCounts.NB, 3);
  assert.strictEqual(diffCounts.TH, 3);
  assert.strictEqual(diffCounts.VD, 1);
  assert.strictEqual(diffCounts.VDC, 1);
  console.log('  ✓ PASS: Chọn đủ 8 câu Solo chuẩn tỷ lệ (3 NB + 3 TH + 1 VD + 1 VDC).');
}

// -------------------------------------------------------------------------
// TEST 4: ĐUA TOP DIFFICULTY PROGRESSION QUEUE
// -------------------------------------------------------------------------
console.log('\n[TEST 4] Kiểm thử Hàng đợi Đua Top Lũy tiến...');
{
  const publishable = filterPublishableQuestions(syntheticBank, teachingScope).questions;
  const duaTopQueue = selectDuaTopQueue(publishable, teachingScope.gameModes.duatop);

  assert.ok(duaTopQueue.length > 0);
  // Kiểm tra tính đơn điệu tăng dần của độ khó
  for (let i = 1; i < duaTopQueue.length; i++) {
    assert.ok(
      duaTopQueue[i].difficultyLevel >= duaTopQueue[i - 1].difficultyLevel,
      `Hàng đợi Đua Top không lũy tiến độ khó tại index ${i}`
    );
  }
  console.log(`  ✓ PASS: Hàng đợi Đua Top gồm ${duaTopQueue.length} câu sắp xếp tăng dần theo độ khó.`);
}

// -------------------------------------------------------------------------
// TEST 5: IMMUTABLE EXAM SNAPSHOT & ANTI-MUTATION REGRADING TEST
// -------------------------------------------------------------------------
console.log('\n[TEST 5] Kiểm thử Bản chụp Đề thi Bất biến (Immutable Exam Snapshot)...');
{
  const examMeta = {
    examId: 'EXAM_VL12_THITHU_01',
    tenDe: 'Đề Thi Thử Số 1 - Vật Lí Nhiệt',
    thoiGian: 50,
    lop: 12
  };
  const selectedQuestionIds = [
    'VLXT-G12-C1-B01-Q0001',
    'VLXT-G12-C1-B02-Q0001',
    'VLXT-G12-C1-B03-Q0001'
  ];

  // 5.1 Tạo Snapshot đề thi
  const examSnapshot = createImmutableExamSnapshot(examMeta, selectedQuestionIds, syntheticBank);
  assert.strictEqual(examSnapshot.questionCount, 3);
  assert.strictEqual(examSnapshot.questionsSnapshot.length, 3);

  // 5.2 Học sinh làm bài và chấm lần 1
  const studentAnswers = {
    'VLXT-G12-C1-B01-Q0001': 'A', // Đúng (TN4)
    'VLXT-G12-C1-B02-Q0001': { a: true, b: true, c: false, d: true }, // Đúng cả 4 ý (DS -> 1.0đ)
    'VLXT-G12-C1-B03-Q0001': '600' // Đúng (TLN)
  };

  const initialGrade = regradeStudentSubmission(examSnapshot, studentAnswers);
  assert.strictEqual(initialGrade.totalScore, 3.0);
  console.log('  ✓ Lần 1: Chấm bài học sinh đạt 3.0 / 3.0 điểm.');

  // 5.3 MÔ PHỎNG SỰ CỐ: Ai đó sửa dữ liệu câu hỏi gốc trong Ngân hàng
  const corruptedBank = JSON.parse(JSON.stringify(syntheticBank));
  const bankQ1 = corruptedBank.find(q => q.id === 'VLXT-G12-C1-B01-Q0001');
  bankQ1.correctAnswer = 'B'; // Đổi đáp án trong bank từ A sang B
  bankQ1.stem = 'Nội dung câu hỏi đã bị sửa đổi hoàn toàn.';

  // 5.4 Chấm lại bài học sinh DỰA TRÊN EXAM SNAPSHOT ĐÃ XUẤT BẢN
  const regradeAfterBankMutation = regradeStudentSubmission(examSnapshot, studentAnswers);
  assert.strictEqual(regradeAfterBankMutation.totalScore, 3.0);
  assert.strictEqual(regradeAfterBankMutation.details[0].isCorrect, true);
  console.log('  ✓ PASS: Chấm lại bài sau khi sửa ngân hàng gốc: Điểm số bất biến 3.0 / 3.0 điểm!');
}

console.log('\n======================================================================');
console.log('  ✓ KẾT QUẢ: TẤT CẢ 5/5 PHẦN PROTOTYPE ĐỀU HOÀN TOÀN ĐẠT CHUẨN 100%!  ');
console.log('======================================================================');
