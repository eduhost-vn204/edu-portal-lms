import fs from 'fs';
import assert from 'assert';

console.log('═══════════════════════════════════════════════════════════════');
console.log('RUNNING TEST SUITE: CRO FUNNEL 6 BƯỚC & ZERO-FRICTION STATE');
console.log('═══════════════════════════════════════════════════════════════');

// Mock Browser Environment
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
})();

global.window = {
  location: { reload: () => {} },
  dispatchEvent: (e) => {},
  addEventListener: () => {}
};
global.localStorage = localStorageMock;
global.document = {
  head: {
    appendChild: () => {}
  },
  body: {
    appendChild: () => {},
    classList: {
      add: () => {},
      remove: () => {}
    }
  },
  getElementById: (id) => null,
  querySelector: (sel) => null,
  createElement: (tag) => {
    return {
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      innerHTML: '',
      classList: {
        add: function(c) { this._classes = this._classes || []; this._classes.push(c); },
        remove: function(c) { this._classes = (this._classes || []).filter(x => x !== c); },
        contains: function(c) { return (this._classes || []).includes(c); }
      },
      appendChild: () => {},
      style: {}
    };
  },
  addEventListener: () => {}
};

// Load freemium-flow.js in mock environment
const code = fs.readFileSync('freemium-flow.js', 'utf8');
const runCode = new Function('window', 'document', 'localStorage', code);
runCode(global.window, global.document, global.localStorage);

const FreemiumFlow = global.window.FreemiumFlow;
assert(FreemiumFlow, 'FreemiumFlow must be defined on window');
console.log('✓ Test 0: FreemiumFlow module loaded successfully.');

// Test 1: Chapter & Quiz Access Control
assert.strictEqual(FreemiumFlow.isChapterFree('CHƯƠNG 1 – VẬT LÝ NHIỆT'), true);
assert.strictEqual(FreemiumFlow.isChapterFree('Chương 2 – Khí lí tưởng'), true);
assert.strictEqual(FreemiumFlow.isChapterFree('Chương 3 – Từ trường'), false);
assert.strictEqual(FreemiumFlow.isChapterFree('Chương 4 – Vật lí hạt nhân'), false);

// With free user:
localStorage.clear();
assert.strictEqual(FreemiumFlow.isPaidUser(), false);

// With Pro / Paid user:
localStorage.setItem('vlxt_user_v2', JSON.stringify({ loaiTK: 'pro', isPaid: true }));
assert.strictEqual(FreemiumFlow.isPaidUser(), true);
console.log('✓ Test 1: isChapterFree & isPaidUser access logic passed.');

// Test 2: Question Classifier
const qTheory = {
  question: 'Quá trình biến đổi trạng thái trong đó nhiệt độ tuyệt đối giữ không đổi gọi là quá trình gì?',
  optA: 'Đẳng áp', optB: 'Đẳng tích', optC: 'Đẳng nhiệt', optD: 'Đoạn nhiệt'
};
assert.strictEqual(FreemiumFlow.classifyQuestion(qTheory), 'ly_thuyet');

const qUnits = {
  question: 'Một khối khí lí tưởng thực hiện quá trình nén đẳng nhiệt từ 6 lít xuống 2 lít, áp suất ban đầu 1,5 atm.',
  optA: '0,5 atm', optB: '4,5 atm'
};
assert.strictEqual(FreemiumFlow.classifyQuestion(qUnits), 'bay_don_vi');

const qGraph = {
  question: 'Một mol khí lí tưởng thực hiện chu trình khép kín 1 -> 2 -> 3 -> 1 trên hệ tọa độ (p, T)...',
  optA: '2', optB: '4'
};
assert.strictEqual(FreemiumFlow.classifyQuestion(qGraph), 'do_thi_vdc');
console.log('✓ Test 2: classifyQuestion heuristic & regex classification passed.');

// Test 3: Zero-Friction Storage
localStorage.clear();
const sampleQuestions = [
  { id: 1, tag: 'ly_thuyet', question: 'Đơn vị nhiệt độ' },
  { id: 2, tag: 'ly_thuyet', question: 'Công thức Q' },
  { id: 3, tag: 'bay_don_vi', question: 'Đổi °C sang K' },
  { id: 4, tag: 'bay_don_vi', question: 'Tính nhiệt lượng kJ' },
  { id: 5, tag: 'do_thi_vdc', question: 'Đồ thị chu trình' }
];

const saved = FreemiumFlow.saveZeroFrictionProgress({
  lessonKey: 'test_packet_1',
  title: 'Bài tập 5 câu thử nghiệm',
  packetOrder: 1,
  questions: sampleQuestions,
  wrongIndices: [2, 4], // Sai câu 3 (bẫy đơn vị) và câu 5 (đồ thị vdc)
  correct: 3,
  total: 5
});

assert.strictEqual(saved.correct, 3);
assert.strictEqual(saved.total, 5);
assert.strictEqual(saved.tagStats.ly_thuyet.correct, 2);
assert.strictEqual(saved.tagStats.ly_thuyet.total, 2);
assert.strictEqual(saved.tagStats.ly_thuyet.pct, 100);

assert.strictEqual(saved.tagStats.bay_don_vi.correct, 1);
assert.strictEqual(saved.tagStats.bay_don_vi.wrong, 1);
assert.strictEqual(saved.tagStats.bay_don_vi.total, 2);
assert.strictEqual(saved.tagStats.bay_don_vi.pct, 50);

assert.strictEqual(saved.tagStats.do_thi_vdc.wrong, 1);
assert.strictEqual(saved.tagStats.do_thi_vdc.pct, 0);

assert.deepStrictEqual(saved.wrongIds, [3, 5]);

const retrieved = FreemiumFlow.getZeroFrictionProgress();
assert(retrieved && retrieved.lastAttempt, 'Must retrieve stored zero-friction state');
assert.strictEqual(retrieved.lastAttempt.lessonKey, 'test_packet_1');
console.log('✓ Test 3: saveZeroFrictionProgress & getZeroFrictionProgress passed.');

// Test 4: DiagnosticReportCard Component (Step 4)
const mockContainer = {
  appendChild: function (el) {
    this.child = el;
  }
};
const card = FreemiumFlow.renderDiagnosticReportCard(mockContainer, saved);
assert(mockContainer.child, 'DiagnosticReportCard must be appended to container');
assert(mockContainer.child.innerHTML.toUpperCase().includes('BÁO CÁO PHÂN TÍCH LỖ HỔNG KIẾN THỨC VẬT LÝ 12'), 'Must include Step 4 Header');
assert(mockContainer.child.innerHTML.includes('ĐIỂM THI THPT DỰ KIẾN'), 'Must include Estimated Score');
assert(mockContainer.child.innerHTML.includes('ĐIỂM MỤC TIÊU TOP 1'), 'Must include Target Score 8.5+');
assert(mockContainer.child.innerHTML.includes('1. Lý Thuyết Nền Tảng'), 'Must include Tag 1 bar');
assert(mockContainer.child.innerHTML.includes('2. Phản Xạ Bẫy Đơn Vị'), 'Must include Tag 2 bar');
assert(mockContainer.child.innerHTML.includes('3. Tư Duy Đồ Thị Đa Trục'), 'Must include Tag 3 bar');
assert(mockContainer.child.innerHTML.includes('Chỉ Dẫn Chiến Lược Từ Thầy Xuân Trường'), 'Must include teacher advice');
assert(mockContainer.child.innerHTML.toLowerCase().includes('xem lộ trình') && mockContainer.child.innerHTML.toLowerCase().includes('bứt phá 8.5+'), 'Must include CTA leading to Step 5');
console.log('✓ Test 4: <DiagnosticReportCard /> (Bước 4) HTML structure and copywriting passed.');

// Test 5: UpgradeValueModal (Step 5)
FreemiumFlow.ensureModalsInDOM();
assert(code.includes('Bứt Phá 8.5+ Kì Thi THPT Cùng Thầy Xuân Trường'), 'Step 5 must have hero title');
assert(code.includes('Mở Khóa Trọn Bộ 4 Chương'), 'Step 5 must include Privilege 1');
assert(code.includes('1.200+') && code.includes('Chữa Bản Chất'), 'Step 5 must include Privilege 2');
assert(code.includes('Thí Nghiệm Ảo 3D Độc Quyền'), 'Step 5 must include Privilege 3');
assert(code.includes('Trợ Lý AI Định Vị Lỗ Hổng'), 'Step 5 must include Privilege 4');
assert(code.includes('Lê Minh Quân'), 'Step 5 must include Minh Quan review');
assert(code.includes('Trần Khánh Linh'), 'Step 5 must include Khanh Linh review');
assert(code.includes('2.847 học sinh 2k7/2k8 đang trực tuyến luyện đề'), 'Step 5 must include live counter');
assert(code.includes('50.000đ'), 'Step 5 must include price');
assert(code.includes('1.600đ / ngày'), 'Step 5 must include 1600d/day comparison');
assert(code.includes('Tôi muốn đăng ký nâng cấp ngay (50.000đ/tháng)'), 'Step 5 must include primary CTA button');
console.log('✓ Test 5: <UpgradeValueModal /> (Bước 5) 4 sections and copywriting passed.');

// Test 6: VietQRCheckoutModal (Step 6)
assert(code.includes('https://img.vietqr.io/image/'), 'Step 6 must generate VietQR dynamic image URL');
assert(code.includes('VL12_'), 'Step 6 memo must use VL12_ prefix');
assert(code.includes('cro-phone-compact-box'), 'Step 6 must have compact phone/name input');
assert(code.includes('cro-listener-status-pill'), 'Step 6 must have payment listener status');
assert(code.includes('Tôi Đã Chuyển Khoản Xong (Kích Hoạt Ngay)'), 'Step 6 must have check payment button');

// Simulate payment confirmation
FreemiumFlow.confirmPaymentSuccess();
const updatedUser = JSON.parse(localStorage.getItem('vlxt_user_v2'));
assert.strictEqual(updatedUser.loaiTK, 'pro', 'User loaiTK must be upgraded to pro');
assert.strictEqual(updatedUser.isPaid, true, 'User isPaid must be true');
assert.strictEqual(FreemiumFlow.isPaidUser(), true, 'FreemiumFlow.isPaidUser() must now be true');
assert.strictEqual(FreemiumFlow.isChapterFree('Chương 3 – Từ trường'), true, 'Chapter 3 must now be accessible for paid user');
assert.strictEqual(FreemiumFlow.isChapterFree('Chương 4 – Vật lí hạt nhân'), true, 'Chapter 4 must now be accessible for paid user');
console.log('✓ Test 6: <VietQRCheckoutModal /> (Bước 6) payment confirmation & unlock passed.');

// Test 7: Verify data/danhgianangluc.json integrity
const dgnlData = JSON.parse(fs.readFileSync('data/danhgianangluc.json', 'utf8'));
assert.strictEqual(dgnlData.length, 20, 'danhgianangluc.json must have 20 questions');
const validTags = ['ly_thuyet', 'bay_don_vi', 'do_thi_vdc'];
dgnlData.forEach((q, idx) => {
  assert(validTags.includes(q.tag), `Question ${idx + 1} must have a valid tag in ${validTags}`);
});
console.log('✓ Test 7: data/danhgianangluc.json 20 questions with tags passed.');

// Test 8: Verify danh-gia-nang-luc.html zero-friction submit
const dgnlHtml = fs.readFileSync('danh-gia-nang-luc.html', 'utf8');
assert(!dgnlHtml.includes('showLoginModal();\r\n    } else {'), 'danh-gia-nang-luc.html must not block submit behind login modal');
assert(dgnlHtml.includes('FreemiumFlow.saveZeroFrictionProgress'), 'danh-gia-nang-luc.html must save zero friction progress');
assert(dgnlHtml.includes('FreemiumFlow.renderDiagnosticReportCard'), 'danh-gia-nang-luc.html must render DiagnosticReportCard');
assert(dgnlHtml.includes('freemium-flow.js'), 'danh-gia-nang-luc.html must include freemium-flow.js');
assert(dgnlHtml.includes('canvas-confetti'), 'danh-gia-nang-luc.html must include canvas-confetti');
console.log('✓ Test 8: danh-gia-nang-luc.html Zero-Friction submit & CRO integration passed.');

console.log('═══════════════════════════════════════════════════════════════');
console.log('ALL 8 TEST SUITES PASSED (100%)!');
console.log('═══════════════════════════════════════════════════════════════');
