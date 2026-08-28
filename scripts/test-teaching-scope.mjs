import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { isScopeActive, isApprovedTinhQuestion, normalizeScopes, normalizeUsageScopes, filterQuestionsByScope } = require('../teaching-scope.js');

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`OK   - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error('     ', e.message);
    process.exitCode = 1;
  }
}

console.log('=== TEST SUITE: TEACHING SCOPE PRODUCTION VERIFICATION ===\n');

// 1. Kiểm tra timezone và biên validFrom/validTo
check('1. isScopeActive: scope null hoặc isActive=false -> inactive', () => {
  assert.equal(isScopeActive(null), false);
  assert.equal(isScopeActive({ isActive: false }), false);
  assert.equal(isScopeActive({ isActive: 'false' }), false);
});

check('2. isScopeActive: không giới hạn thời gian + isActive=true -> active', () => {
  assert.equal(isScopeActive({ isActive: true }), true);
  assert.equal(isScopeActive({ isActive: 'true' }), true);
});

check('3. isScopeActive: kiểm tra timezone biên validFrom/validTo chính xác', () => {
  // 08:00:00 UTC (15:00:00 GMT+7)
  const nowUtc = Date.parse('2026-08-28T08:00:00.000Z');
  
  // Biên validFrom đúng thời điểm nowUtc
  assert.equal(isScopeActive({ isActive: true, validFrom: '2026-08-28T08:00:00.000Z' }, nowUtc), true);
  // Biên validFrom 1ms sau nowUtc -> inactive
  assert.equal(isScopeActive({ isActive: true, validFrom: '2026-08-28T08:00:00.001Z' }, nowUtc), false);
  
  // Biên validTo đúng thời điểm nowUtc
  assert.equal(isScopeActive({ isActive: true, validTo: '2026-08-28T08:00:00.000Z' }, nowUtc), true);
  // Biên validTo 1ms trước nowUtc -> inactive (hết hạn)
  assert.equal(isScopeActive({ isActive: true, validTo: '2026-08-28T07:59:59.999Z' }, nowUtc), false);

  // Timezone GMT+7 dạng chuỗi ISO
  const gmt7Scope = {
    isActive: true,
    validFrom: '2026-08-28T14:00:00+07:00', // 07:00 UTC
    validTo: '2026-08-28T16:00:00+07:00'   // 09:00 UTC
  };
  assert.equal(isScopeActive(gmt7Scope, nowUtc), true);
});

// 2. Kiểm tra chất lượng và trạng thái duyệt (isApprovedTinhQuestion)
check('4. isApprovedTinhQuestion: câu Thô bị CHẶN 100% (cả có status và không có status)', () => {
  const qTho1 = { id: '1', question: 'Q1', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tho', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP'] };
  const qTho2 = { id: '2', question: 'Q2', optA: 'A', optB: 'B', correct: 'A', rawTier: 'THO' };
  const qThoLegacy = { id: '3', question: 'Q3', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tho' };
  assert.equal(isApprovedTinhQuestion(qTho1), false);
  assert.equal(isApprovedTinhQuestion(qTho2), false);
  assert.equal(isApprovedTinhQuestion(qThoLegacy), false);
});

check('5. isApprovedTinhQuestion: câu TINH legacy (chưa có status và usageScopes) -> ĐƯỢC CHẤP NHẬN', () => {
  const qTinhLegacy = { id: '4', question: 'Q4', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tinh' };
  assert.equal(isApprovedTinhQuestion(qTinhLegacy), true);
  assert.equal(isApprovedTinhQuestion(qTinhLegacy, 'DUA_TOP'), true);
  assert.equal(isApprovedTinhQuestion(qTinhLegacy, 'SOLO'), true);
});

check('6. isApprovedTinhQuestion: câu TINH có status nhưng không phải TEACHER_APPROVED -> BỊ CHẶN', () => {
  const qApproved = { id: '5', question: 'Q5', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tinh', status: 'APPROVED', usageScopes: ['DUA_TOP'] };
  const qQaPassed = { id: '6', question: 'Q6', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tinh', status: 'QA_PASSED', usageScopes: ['DUA_TOP'] };
  assert.equal(isApprovedTinhQuestion(qApproved), false);
  assert.equal(isApprovedTinhQuestion(qQaPassed), false);
});

check('7. isApprovedTinhQuestion: câu TINH + TEACHER_APPROVED -> ĐẠT YÊU CẦU', () => {
  const qOk = { id: '7', question: 'Q7', optA: 'A', optB: 'B', correct: 'A', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP', 'SOLO'] };
  assert.equal(isApprovedTinhQuestion(qOk), true);
  assert.equal(isApprovedTinhQuestion(qOk, 'DUA_TOP'), true);
  assert.equal(isApprovedTinhQuestion(qOk, 'SOLO'), true);
  assert.equal(isApprovedTinhQuestion(qOk, 'THI_THU'), false); // không có scope THI_THU -> chặn
});

check('8. normalizeUsageScopes: hỗ trợ mảng canonical, chuỗi ngăn cách dấu phẩy / JSON', () => {
  assert.deepEqual(normalizeUsageScopes(['dua_top', 'solo']), ['DUA_TOP', 'SOLO']);
  assert.deepEqual(normalizeUsageScopes('DUA_TOP, SOLO, LUYEN_TAP'), ['DUA_TOP', 'SOLO', 'LUYEN_TAP']);
  assert.deepEqual(normalizeUsageScopes('["DUA_TOP", "SOLO"]'), ['DUA_TOP', 'SOLO']);
  assert.deepEqual(normalizeUsageScopes(null), []);
  assert.deepEqual(normalizeUsageScopes(''), []);
});

// 3. Ngân hàng mẫu cho kiểm thử lọc phạm vi
const sampleBank = [
  // Khóa K1 - Chương 1 - Bài B1 (TINH, TEACHER_APPROVED, DUA_TOP + SOLO)
  { id: 'Q1', chuong: 'CHƯƠNG 1', baiHoc: 'B1', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP', 'SOLO'], question: 'q1', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 1 - Bài B2 (TINH, TEACHER_APPROVED, chỉ DUA_TOP)
  { id: 'Q2', chuong: 'CHƯƠNG 1', baiHoc: 'B2', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP'], question: 'q2', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 1 - Bài B1 (TINH, TEACHER_APPROVED, chỉ SOLO)
  { id: 'Q3', chuong: 'CHƯƠNG 1', baiHoc: 'B1', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['SOLO'], question: 'q3', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 1 - Bài B1 (TINH nhưng status = APPROVED -> phải bị chặn)
  { id: 'Q4', chuong: 'CHƯƠNG 1', baiHoc: 'B1', chatLuong: 'tinh', status: 'APPROVED', usageScopes: ['DUA_TOP', 'SOLO'], question: 'q4', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 2 - Bài B3 (TINH, TEACHER_APPROVED, DUA_TOP + SOLO)
  { id: 'Q5', chuong: 'CHƯƠNG 2', baiHoc: 'B3', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP', 'SOLO'], question: 'q5', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 2 - Bài B4 (TINH, TEACHER_APPROVED, DUA_TOP + SOLO)
  { id: 'Q6', chuong: 'CHƯƠNG 2', baiHoc: 'B4', chatLuong: 'tinh', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP', 'SOLO'], question: 'q6', optA: '1', optB: '2', correct: 'A' },
  // Khóa K1 - Chương 1 - Bài B1 (THÔ -> phải bị chặn 100%)
  { id: 'Q7', chuong: 'CHƯƠNG 1', baiHoc: 'B1', chatLuong: 'tho', status: 'TEACHER_APPROVED', usageScopes: ['DUA_TOP', 'SOLO'], question: 'q7', optA: '1', optB: '2', correct: 'A' }
];

check('9. filterQuestionsByScope: CourseId / StageId fail closed (sai course/stage -> 0 câu, không giữ scope khác)', () => {
  const scope = {
    courseId: 'KHOA_12',
    stageId: 'GD1',
    openChapterIds: ['CHƯƠNG 1'],
    openAllLessons: true,
    isActive: true
  };
  // Đúng courseId KHOA_12 & stageId GD1 -> có câu
  assert.equal(filterQuestionsByScope(sampleBank, scope, { courseId: 'KHOA_12', stageId: 'GD1', requiredScope: 'DUA_TOP' }).length > 0, true);
  // Sai courseId -> 0 câu
  assert.equal(filterQuestionsByScope(sampleBank, scope, { courseId: 'KHOA_KHAC', requiredScope: 'DUA_TOP' }).length, 0);
  // Sai stageId -> 0 câu
  assert.equal(filterQuestionsByScope(sampleBank, scope, { stageId: 'GD_KHAC', requiredScope: 'DUA_TOP' }).length, 0);
});

check('10. filterQuestionsByScope: Phân biệt openAllLessons=true vs activeLessonIds=[] & openAllLessons=false', () => {
  // Case A: openAllLessons = true -> nhận tất cả bài trong Chương 1
  const scopeOpenAll = {
    courseId: 'K1',
    openChapterIds: ['CHƯƠNG 1'],
    openAllLessons: { 'CHƯƠNG 1': true },
    isActive: true
  };
  const resOpenAll = filterQuestionsByScope(sampleBank, scopeOpenAll, { requiredScope: 'DUA_TOP' });
  const idsOpenAll = resOpenAll.map(q => q.id);
  assert.deepEqual(idsOpenAll, ['Q1', 'Q2']); // Q1 (B1) & Q2 (B2)

  // Case B: activeLessonIds = [] và openAllLessons = false -> 0 câu
  const scopeEmptyLessons = {
    courseId: 'K1',
    openChapterIds: ['CHƯƠNG 1'],
    activeLessonIds: { 'CHƯƠNG 1': [] },
    openAllLessons: { 'CHƯƠNG 1': false },
    isActive: true
  };
  const resEmpty = filterQuestionsByScope(sampleBank, scopeEmptyLessons, { requiredScope: 'DUA_TOP' });
  assert.equal(resEmpty.length, 0);
});

check('11. filterQuestionsByScope: Đua Top chỉ lấy câu có scope DUA_TOP, Solo chỉ lấy câu có scope SOLO', () => {
  const scope = {
    courseId: 'K1',
    openChapterIds: ['CHƯƠNG 1'],
    openAllLessons: true,
    isActive: true
  };
  // Đua Top: nhận Q1 (DUA_TOP+SOLO) và Q2 (DUA_TOP), KHÔNG nhận Q3 (chỉ SOLO)
  const duaTopRes = filterQuestionsByScope(sampleBank, scope, { requiredScope: 'DUA_TOP' });
  assert.deepEqual(duaTopRes.map(q => q.id), ['Q1', 'Q2']);

  // Solo: nhận Q1 (DUA_TOP+SOLO) và Q3 (chỉ SOLO), KHÔNG nhận Q2 (chỉ DUA_TOP)
  const soloRes = filterQuestionsByScope(sampleBank, scope, { requiredScope: 'SOLO' });
  assert.deepEqual(soloRes.map(q => q.id), ['Q1', 'Q3']);
});

check('12. filterQuestionsByScope: Mở nhiều chương với bài lẻ (Chương 1 Bài B1 + Chương 2 Bài B4)', () => {
  const scope = {
    courseId: 'K1',
    openChapterIds: ['CHƯƠNG 1', 'CHƯƠNG 2'],
    activeLessonIds: {
      'CHƯƠNG 1': ['B1'],
      'CHƯƠNG 2': ['B4']
    },
    openAllLessons: {
      'CHƯƠNG 1': false,
      'CHƯƠNG 2': false
    },
    isActive: true
  };
  const res = filterQuestionsByScope(sampleBank, scope, { requiredScope: 'DUA_TOP' });
  // Q1 (Chương 1, B1) và Q6 (Chương 2, B4)
  assert.deepEqual(res.map(q => q.id), ['Q1', 'Q6']);
});

check('13. filterQuestionsByScope: Đóng tất cả -> 0 câu', () => {
  const closedScope = {
    courseId: 'K1',
    openChapterIds: [],
    activeLessonIds: {},
    openAllLessons: false,
    isActive: true
  };
  assert.equal(filterQuestionsByScope(sampleBank, closedScope, { requiredScope: 'DUA_TOP' }).length, 0);
  assert.equal(filterQuestionsByScope(sampleBank, closedScope, { requiredScope: 'SOLO' }).length, 0);
});

check('14. filterQuestionsByScope: ID bài/chương không khớp -> bị chặn', () => {
  const scope = {
    courseId: 'K1',
    openChapterIds: ['CHƯƠNG_KHONG_TON_TAI'],
    activeLessonIds: { 'CHƯƠNG_KHONG_TON_TAI': ['BAI_KHONG_TON_TAI'] },
    openAllLessons: false,
    isActive: true
  };
  assert.equal(filterQuestionsByScope(sampleBank, scope, { requiredScope: 'DUA_TOP' }).length, 0);
});

console.log(`\n=== KẾT QUẢ: ${passed} / 14 KIỂM THỬ ĐẠT YÊU CẦU ===\n`);

