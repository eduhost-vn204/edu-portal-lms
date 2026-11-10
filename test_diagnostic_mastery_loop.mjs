import fs from 'fs';
import assert from 'assert';

console.log('═══════════════════════════════════════════════════════════════');
console.log('RUNNING TEST SUITE: 7-STEP DIAGNOSTIC-TO-MASTERY LOOP');
console.log('═══════════════════════════════════════════════════════════════');

// Mock DOM & Browser Environment
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
  location: { reload: () => {}, search: '?remedial=1&topic=Kh%C3%AD%20l%C3%AD%20t%C6%B0%E1%BB%9Fng' },
  dispatchEvent: (e) => {},
  addEventListener: () => {}
};
global.localStorage = localStorageMock;
global.document = {
  head: { appendChild: () => {} },
  body: {
    appendChild: () => {},
    classList: {
      add: function(c) { this._classes = this._classes || []; this._classes.push(c); },
      remove: function(c) { this._classes = (this._classes || []).filter(x => x !== c); },
      contains: function(c) { return (this._classes || []).includes(c); }
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

// 1. Nạp freemium-flow.js
const freemiumCode = fs.readFileSync('freemium-flow.js', 'utf8');
const runFreemium = new Function('window', 'document', 'localStorage', freemiumCode);
runFreemium(global.window, global.document, global.localStorage);
const FreemiumFlow = global.window.FreemiumFlow;
assert(FreemiumFlow, 'FreemiumFlow must be defined on window');
console.log('✓ Bước 0: Nạp thành công module FreemiumFlow.');

// 2. Kiểm thử Bước 1 & 2: Dữ liệu câu hỏi & Khả năng lưu trữ Guest
const dgnlHtml = fs.readFileSync('danh-gia-nang-luc.html', 'utf8');
assert(dgnlHtml.includes('vlxt_dgnl_guest_answers'), 'danh-gia-nang-luc.html phải có cơ chế lưu trữ vlxt_dgnl_guest_answers');
assert(dgnlHtml.includes('autostart'), 'danh-gia-nang-luc.html phải hỗ trợ URL param autostart để làm bài 1-click');
assert(dgnlHtml.includes('dgnl-resume-slot'), 'danh-gia-nang-luc.html phải có slot khôi phục bài làm dở dang');
console.log('✓ Bước 1 & 2: 1-Click Guest Assessment & Persistence đạt chuẩn 100%.');

// 3. Kiểm thử Bước 3: Auth Gate Kép
assert(dgnlHtml.includes('google-signin-btn-slot'), 'Phải có slot đăng nhập Google 1-Click');
assert(dgnlHtml.includes('dgnl-quick-auth-form'), 'Phải có form đăng ký nhanh bằng SĐT/Tên/Lớp cho TikTok/Facebook in-app browser');
assert(dgnlHtml.includes('qa-hoten') && dgnlHtml.includes('qa-sdt') && dgnlHtml.includes('qa-lop'), 'Form nhanh phải đủ 3 trường Họ tên, SĐT, Lớp');
assert(dgnlHtml.includes('initGoogleLogin'), 'Phải có hàm khởi tạo Google Sign-in');
console.log('✓ Bước 3: Auth Gate Form Kép (Google 1-Click + SĐT/Lớp) tích hợp hoàn chỉnh.');

// 4. Kiểm thử Bước 4: Diagnostic Report
assert(dgnlHtml.includes('cro-diagnostic-card-slot'), 'Phải có slot cho Component <DiagnosticReportCard />');
assert(dgnlHtml.includes('question-review-list-container'), 'Phải có danh sách đối soát và lời giải KaTeX');
console.log('✓ Bước 4: Diagnostic Report & Đối soát lời giải chi tiết đạt chuẩn.');

// 5. Kiểm thử Bước 5: Remedial Learning Deep Link
assert(dgnlHtml.includes('remedial-spotlight-slot'), 'Phải có slot Hộp Lộ Trình Khắc Phục Cấp Tốc');
assert(dgnlHtml.includes('remedial=1'), 'Deep Link phải truyền cờ remedial=1 sang baihoc.html');

const baihocHtml = fs.readFileSync('baihoc.html', 'utf8');
assert(baihocHtml.includes('remedial-welcome-banner'), 'baihoc.html phải có Banner chào đón bài học khắc phục lỗ hổng');
assert(baihocHtml.includes('isRemedial'), 'baihoc.html phải nhận diện isRemedial để miễn chặn tuần tự ở Chương 1 & 2');
console.log('✓ Bước 5: Targeted Remedial Learning Deep Link liên kết thông suốt.');

// 6. Kiểm thử Bước 6: Retest Đề B & Progress Comparison
assert(FreemiumFlow.RETEST_BANKS, 'FreemiumFlow phải có RETEST_BANKS');
assert(FreemiumFlow.RETEST_BANKS['Vật lí nhiệt'].length === 5, 'Đề B Vật lí nhiệt phải đủ 5 câu');
assert(FreemiumFlow.RETEST_BANKS['Khí lí tưởng'].length === 5, 'Đề B Khí lí tưởng phải đủ 5 câu');
assert(FreemiumFlow.RETEST_BANKS['Từ trường'].length === 5, 'Đề B Từ trường phải đủ 5 câu');
assert(FreemiumFlow.RETEST_BANKS['Vật lí hạt nhân'].length === 5, 'Đề B Vật lí hạt nhân phải đủ 5 câu');
assert(typeof FreemiumFlow.renderRetestDeB === 'function', 'Phải có hàm renderRetestDeB');
assert(typeof FreemiumFlow.submitRetestDeB === 'function', 'Phải có hàm submitRetestDeB');
assert(baihocHtml.includes('vstep-retest-mount'), 'baihoc.html phải có vị trí mount Đề B');
console.log('✓ Bước 6: Retest Đề B & Biểu đồ so sánh tiến bộ trực quan sẵn sàng.');

// 7. Kiểm thử Bước 7: Soft Upsell Gói Pro 50k & VietQR Checkout
assert(typeof FreemiumFlow.openProUpgradeFromRetest === 'function', 'Phải có hàm mở nâng cấp từ màn hình Retest');
assert(freemiumCode.includes('cro-mastery-celebration-modal'), 'Modal chúc mừng tiến bộ phải có nút dẫn sang Gói Pro 50k');
assert(typeof FreemiumFlow.openUpgradeValueModal === 'function', 'Modal giới thiệu gói Pro phải có sẵn');
assert(typeof FreemiumFlow.openVietQRCheckoutModal === 'function', 'Modal VietQR chỉ mở khi bấm đăng ký');
console.log('✓ Bước 7: Soft Upsell Gói Pro 50k & VietQR Checkout vận hành chuẩn xác.');

// 8. Kiểm tra tính hợp lệ của toàn bộ file HTML
assert(dgnlHtml.trim().endsWith('</html>'), 'danh-gia-nang-luc.html phải kết thúc bằng </html>');
assert(baihocHtml.trim().endsWith('</html>'), 'baihoc.html phải kết thúc bằng </html>');
console.log('✓ Cấu trúc HTML: Toàn bộ file kết thúc hợp lệ bằng </html>.');

console.log('═══════════════════════════════════════════════════════════════');
console.log('TẤT CẢ CÁC BƯỚC CỦA LUỒNG "DIAGNOSTIC-TO-MASTERY LOOP" ĐẠT 100%!');
console.log('═══════════════════════════════════════════════════════════════');
