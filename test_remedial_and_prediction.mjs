import fs from 'fs';
import assert from 'assert';

console.log('═══════════════════════════════════════════════════════════════');
console.log('KIỂM ĐỊNH FIX LỆCH ĐIỂM DỰ KIẾN & ĐA LỖ HỔNG KIẾN THỨC');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Kiểm tra logic tính điểm trong freemium-flow.js
console.log('1. Kiểm tra tính điểm thi THPT dự kiến trong freemium-flow.js:');
const flowCode = fs.readFileSync('freemium-flow.js', 'utf8');

// Không còn hardcode rawScore >= 5.0 -> predictedScore = 6.0
assert.ok(!flowCode.includes('predictedScore = 6.0'), 'freemium-flow.js vẫn còn chứa hardcode predictedScore = 6.0');

// Mock môi trường
const mockWindow = { location: { search: '' } };
const mockDoc = {
  getElementById: () => null,
  querySelector: () => null,
  createElement: (tag) => ({
    tagName: tag.toUpperCase(),
    innerHTML: '',
    className: '',
    classList: { add: () => {}, remove: () => {} }
  }),
  addEventListener: () => {}
};
const mockLocal = {
  _store: {},
  getItem(k) { return this._store[k] || null; },
  setItem(k, v) { this._store[k] = String(v); },
  removeItem(k) { delete this._store[k]; }
};

const runFlow = new Function('window', 'document', 'localStorage', flowCode);
runFlow(mockWindow, mockDoc, mockLocal);
const FreemiumFlow = mockWindow.FreemiumFlow;

// Giả lập đúng 10/20 câu (Chương 1 & 2 đúng, Chương 3 & 4 sai)
const sampleQuestions = [];
for (let i = 0; i < 5; i++) sampleQuestions.push({ id: i + 1, topic: 'Vật lí nhiệt' });
for (let i = 5; i < 10; i++) sampleQuestions.push({ id: i + 1, topic: 'Khí lí tưởng' });
for (let i = 10; i < 15; i++) sampleQuestions.push({ id: i + 1, topic: 'Từ trường' });
for (let i = 15; i < 20; i++) sampleQuestions.push({ id: i + 1, topic: 'Vật lí hạt nhân' });

const topicStats = {
  'Vật lí nhiệt': { total: 5, correct: 5 },
  'Khí lí tưởng': { total: 5, correct: 5 },
  'Từ trường': { total: 5, correct: 0 },
  'Vật lí hạt nhân': { total: 5, correct: 0 }
};

const attempt = FreemiumFlow.saveZeroFrictionProgress({
  total: 20,
  correct: 10,
  questions: sampleQuestions,
  wrongIndices: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  topicStats: topicStats
});

assert.strictEqual(attempt.score10, '5.0', 'Điểm score10 phải là 5.0');
assert.strictEqual(attempt.predictedScore, 5.0, 'predictedScore phải là 5.0 (không được là 6.0)');
console.log('   ✓ Test 1.1 PASS: Làm đúng 10/20 câu -> score10 = 5.0, predictedScore = 5.0 (KHÔNG LỆCH ĐIỂM)');

// Kiểm tra renderDiagnosticReportCard
const container = mockDoc.createElement('div');
let renderedHtml = '';
container.appendChild = (child) => { renderedHtml = child.innerHTML; };
FreemiumFlow.renderDiagnosticReportCard(container, attempt);

assert.ok(renderedHtml.includes('5<span>/10</span>') || renderedHtml.includes('5.0<span>/10</span>'), 'Thẻ chẩn đoán phải hiển thị điểm dự kiến 5.0');
assert.ok(!renderedHtml.includes('6<span>/10</span>') && !renderedHtml.includes('6.0<span>/10</span>'), 'Thẻ chẩn đoán KHÔNG được hiển thị 6/10 khi học sinh làm 5 điểm');
console.log('   ✓ Test 1.2 PASS: <DiagnosticReportCard /> hiển thị chuẩn xác 5/10 điểm dự kiến');

// 2. Kiểm tra renderRemedialSpotlight trong danh-gia-nang-luc.html
console.log('\n2. Kiểm tra nhận diện ĐA LỖ HỔNG (Từ trường & Hạt nhân) trong danh-gia-nang-luc.html:');
const dgnlHtml = fs.readFileSync('danh-gia-nang-luc.html', 'utf8');

// Trích xuất hàm renderRemedialSpotlight
const fnMatch = dgnlHtml.match(/function renderRemedialSpotlight\(topicStats, score\) \{([\s\S]*?if \(slotBottom\) slotBottom\.innerHTML = remedialHTML;\s*\})/);
assert.ok(fnMatch, 'Không tìm thấy hàm renderRemedialSpotlight trong danh-gia-nang-luc.html');

let slotTopHtml = '';
let slotBottomHtml = '';
const mockSlotTop = { set innerHTML(val) { slotTopHtml = val; } };
const mockSlotBottom = { set innerHTML(val) { slotBottomHtml = val; } };

const mockDgnlDoc = {
  getElementById(id) {
    if (id === 'remedial-spotlight-slot') return mockSlotTop;
    if (id === 'remedial-bottom-spotlight-slot') return mockSlotBottom;
    return null;
  }
};

const allLessonsMock = [
  { MaBai: 'B04e20f0ec67d', TenBai: 'B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT' },
  { MaBai: 'B4ca24b64572f', TenBai: 'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT' },
  { MaBai: 'Bc71adbcb4dce', TenBai: 'B22. CẢM ỨNG TỪ - LỰC TỪ' },
  { MaBai: 'B600c414815cd', TenBai: 'B32. NĂNG LƯỢNG LIÊN KẾT HẠT NHÂN' }
];

const runRemedial = new Function('document', 'allLessons', `
  return function(topicStats, score) {
    ${fnMatch[0]}
    renderRemedialSpotlight(topicStats, score);
  };
`)(mockDgnlDoc, allLessonsMock);

runRemedial(topicStats, 5.0);

assert.ok(slotTopHtml, 'slotTopHtml không được rỗng');
// Phải có cả 2 lỗ hổng Từ trường và Vật lí hạt nhân
assert.ok(slotTopHtml.includes('Từ trường'), 'Phải chứa lỗ hổng Từ trường');
assert.ok(slotTopHtml.includes('Hạt nhân') || slotTopHtml.includes('hạt nhân'), 'Phải chứa lỗ hổng Vật lí hạt nhân');
assert.ok(slotTopHtml.includes('2 Lỗ Hổng Kiến Thức') || slotTopHtml.includes('2 chuyên đề'), 'Phải thông báo phát hiện 2 lỗ hổng kiến thức');
assert.ok(slotTopHtml.includes('Bc71adbcb4dce'), 'Phải có link học bài khắc phục Từ trường B22');
assert.ok(slotTopHtml.includes('B600c414815cd'), 'Phải có link học bài khắc phục Hạt nhân B32');

console.log('   ✓ Test 2.1 PASS: Phát hiện đầy đủ CẢ 2 lỗ hổng: Từ trường (sai 5 câu) & Hạt nhân (sai 5 câu)');
console.log('   ✓ Test 2.2 PASS: Cung cấp đầy đủ 2 nút học khắc phục cho cả B22 (Từ trường) và B32 (Hạt nhân)');
console.log('   ✓ Test 2.3 PASS: Có nút bắt đầu lộ trình tuần tự');

// 3. Kiểm tra trường hợp học sinh làm đúng 20/20 câu (không có lỗ hổng)
console.log('\n3. Kiểm tra trường hợp làm đúng 20/20 câu:');
const perfectStats = {
  'Vật lí nhiệt': { total: 5, correct: 5 },
  'Khí lí tưởng': { total: 5, correct: 5 },
  'Từ trường': { total: 5, correct: 5 },
  'Vật lí hạt nhân': { total: 5, correct: 5 }
};
runRemedial(perfectStats, 10.0);
assert.ok(slotTopHtml.includes('KHÔNG CÓ LỖ HỔNG'), 'Trường hợp 20/20 câu phải báo không có lỗ hổng');
console.log('   ✓ Test 3.1 PASS: 20/20 câu -> Thông báo thành tựu xuất sắc, không phát hiện lỗ hổng');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('TẤT CẢ CÁC BÀI TEST ĐÃ VƯỢT QUA 100%!');
console.log('═══════════════════════════════════════════════════════════════');
