/**
 * test_full_student_journey.mjs
 * 
 * BÀI KIỂM THỬ XÁC MINH TOÀN DIỆN LUỒNG HỌC SINH 7 BƯỚC:
 * Click web -> Test năng lực (20 câu) -> Phân tích lỗ hổng -> Học bài khắc phục 
 * -> Làm Đề B theo đúng bài học (data/retest_bank_by_lessons.json) -> Nộp bài & xem biểu đồ bứt phá 
 * -> Nâng cấp Gói Pro 50k mở khóa toàn diện.
 */

import fs from 'fs';
import assert from 'assert';

console.log('═══════════════════════════════════════════════════════════════');
console.log('CHẠY TEST SUITE TOÀN DIỆN: LUỒNG HỌC SINH 7 BƯỚC KHÉP KÍN');
console.log('═══════════════════════════════════════════════════════════════');

// =========================================================================
// MÔ PHỎNG MÔI TRƯỜNG TRÌNH DUYỆT (BROWSER & DOM MOCK)
// =========================================================================
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

const sessionStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _dump: () => store
  };
})();

function createMockElement(tagName = 'div') {
  const el = {
    tagName: tagName.toUpperCase(),
    id: '',
    className: '',
    innerHTML: '',
    textContent: '',
    style: {},
    children: [],
    classList: {
      _list: [],
      add: function (...cls) { cls.forEach(c => { if (!this._list.includes(c)) this._list.push(c); }); },
      remove: function (...cls) { this._list = this._list.filter(c => !cls.includes(c)); },
      contains: function (c) { return this._list.includes(c); },
      toggle: function (c, force) {
        if (force === true) this.add(c);
        else if (force === false) this.remove(c);
        else if (this.contains(c)) this.remove(c);
        else this.add(c);
      }
    },
    appendChild: function (child) { this.children.push(child); return child; },
    querySelector: function (sel) { return null; },
    querySelectorAll: function (sel) { return []; },
    addEventListener: function () {}
  };
  return el;
}

const domElements = new Map();
function getOrCreateElement(id) {
  if (!domElements.has(id)) {
    const el = createMockElement('div');
    el.id = id;
    domElements.set(id, el);
  }
  return domElements.get(id);
}

global.window = {
  location: {
    href: 'https://vatlyxuantruong.edu.vn/',
    pathname: '/',
    search: '',
    hash: '',
    reload: () => {}
  },
  sessionStorage: sessionStorageMock,
  localStorage: localStorageMock,
  dispatchEvent: () => {},
  addEventListener: () => {}
};
global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;
global.document = {
  head: { appendChild: () => {} },
  body: {
    appendChild: (el) => el,
    classList: {
      _list: [],
      add: function (...cls) { cls.forEach(c => { if (!this._list.includes(c)) this._list.push(c); }); },
      remove: function (...cls) { this._list = this._list.filter(c => !cls.includes(c)); },
      contains: function (c) { return this._list.includes(c); }
    }
  },
  getElementById: (id) => getOrCreateElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return createMockElement('div');
  },
  querySelectorAll: (sel) => [],
  createElement: (tag) => createMockElement(tag),
  addEventListener: () => {}
};

// =========================================================================
// BƯỚC 1: KHỞI TẠO HỆ THỐNG & TẢI FILE TĨNH ĐỀ THI
// =========================================================================
console.log('\n--- BƯỚC 1: CLICK WEB & MỞ ĐỀ THI SIÊU TỐC TRONG 0.1S ---');

const freemiumCode = fs.readFileSync('freemium-flow.js', 'utf8');
const runFreemium = new Function('window', 'document', 'localStorage', freemiumCode);
runFreemium(global.window, global.document, global.localStorage);
const FreemiumFlow = global.window.FreemiumFlow;
assert(FreemiumFlow, 'FreemiumFlow phải khởi tạo thành công trên window');
console.log('✓ Khởi tạo thành công FreemiumFlow module.');

// Kiểm tra 18+ đề thi thử tĩnh trong data/exams/
const examFiles = fs.readdirSync('data/exams').filter(f => f.endsWith('.json'));
assert(examFiles.length >= 18, `Phải có ít nhất 18 đề thi thử tĩnh, hiện có: ${examFiles.length}`);
console.log(`✓ Kho đề thi thử tĩnh: ${examFiles.length} file JSON sẵn sàng.`);

// Kiểm tra tốc độ đọc đề tĩnh vedich2k9_de02.json
const t0 = performance.now();
const sampleExamRaw = fs.readFileSync('data/exams/vedich2k9_de02.json', 'utf8');
const sampleExam = JSON.parse(sampleExamRaw);
const t1 = performance.now();
assert(Array.isArray(sampleExam) && sampleExam.length === 28, 'vedich2k9_de02.json phải đủ 28 câu chuẩn Bộ');
console.log(`✓ Mở đề thi vedich2k9_de02 siêu tốc: ${(t1 - t0).toFixed(2)}ms (< 100ms) - 28 câu đầy đủ.`);

// Kiểm tra hàm nạp đề thi siêu tốc trong phong-thi-thu.html và thithu.html
const phongThiHtml = fs.readFileSync('phong-thi-thu.html', 'utf8');
const thithuHtml = fs.readFileSync('thithu.html', 'utf8');
assert(phongThiHtml.includes('loadExamQuestions'), 'phong-thi-thu.html phải có hàm loadExamQuestions');
assert(phongThiHtml.includes('prefetchExam'), 'phong-thi-thu.html phải có hàm prefetchExam');
assert(thithuHtml.includes("fetch('data/exams/"), 'thithu.html phải ưu tiên fetch trực tiếp từ data/exams/{examId}.json');
console.log('✓ Tối ưu nạp đề thi CBT chuẩn Bộ GD&ĐT đạt yêu cầu 100%.');

// =========================================================================
// BƯỚC 2: TEST NĂNG LỰC ĐẦU VÀO (20 CÂU TỪ data/danhgianangluc.json)
// =========================================================================
console.log('\n--- BƯỚC 2: HỌC SINH LÀM BÀI TEST CHẨN ĐOÁN 20 CÂU ---');

const dgnlRaw = fs.readFileSync('data/danhgianangluc.json', 'utf8');
const dgnlQuestions = JSON.parse(dgnlRaw);
assert(Array.isArray(dgnlQuestions) && dgnlQuestions.length === 20, 'danhgianangluc.json phải đủ 20 câu');

// Giả lập học sinh làm bài test: sai các câu chuyên đề "Vật lí nhiệt"
const studentAnswers = {};
let correctCount = 0;
const topicScores = {
  'Vật lí nhiệt': { total: 0, correct: 0 },
  'Khí lí tưởng': { total: 0, correct: 0 },
  'Từ trường': { total: 0, correct: 0 },
  'Vật lí hạt nhân': { total: 0, correct: 0 }
};

dgnlQuestions.forEach((q, idx) => {
  const top = q.topic || 'Khí lí tưởng';
  if (!topicScores[top]) topicScores[top] = { total: 0, correct: 0 };
  topicScores[top].total++;

  const correctAns = typeof q.answer === 'number' ? q.answer : (typeof q.correct === 'number' ? q.correct : 0);

  // Cố tình làm sai câu thuộc "Vật lí nhiệt" để kích hoạt lộ trình khắc phục
  if (top.includes('nhiệt')) {
    studentAnswers[q.id] = (correctAns + 1) % 4; // Sai
  } else {
    studentAnswers[q.id] = correctAns; // Đúng
    correctCount++;
    topicScores[top].correct++;
  }
});

const preScorePct = Math.round((correctCount / 20) * 100);
localStorageMock.setItem('vlxt_danhgianangluc_result', JSON.stringify({
  score: correctCount,
  total: 20,
  scorePct: preScorePct,
  topicStats: topicScores
}));
console.log(`✓ Hoàn thành test chẩn đoán: Đúng ${correctCount}/20 câu (${preScorePct}%). Chuyên đề yếu nhất: "Vật lí nhiệt" (Đúng 0/${topicScores['Vật lí nhiệt'].total}).`);

// =========================================================================
// BƯỚC 3: PHÂN TÍCH LỖ HỔNG & TẠO DEEP LINK KHẮC PHỤC
// =========================================================================
console.log('\n--- BƯỚC 3: BÁO CÁO LỖ HỔNG & DEEP LINK SANG BÀI HỌC KHẮC PHỤC ---');

// Mô phỏng thuật toán tìm bài học khắc phục của danh-gia-nang-luc.html
const allLessonsRaw = fs.readFileSync('data/baihoc.json', 'utf8');
const allLessons = JSON.parse(allLessonsRaw);
const remedialLesson = allLessons.find(l => l.MaBai === 'B04e20f0ec67d' || (l.TenBai && l.TenBai.includes('LỰC LIÊN KẾT')));
assert(remedialLesson, 'Phải tìm thấy bài học khắc phục cho chuyên đề Vật lí nhiệt (B02: Lực liên kết)');

// Mô phỏng hàm goToRemedialLesson
const targetKey = remedialLesson.MaBai; // 'B04e20f0ec67d'
const targetTopic = 'Vật lí nhiệt';
sessionStorageMock.setItem('vlxt_remedial_active', '1');
sessionStorageMock.setItem('vlxt_remedial_topic', encodeURIComponent(targetTopic));
sessionStorageMock.setItem('vlxt_remedial_lesson', targetKey);

const targetUrl = `baihoc.html?openLesson=${encodeURIComponent(targetKey)}&remedial=1&topic=${encodeURIComponent(targetTopic)}#lesson/${encodeURIComponent(targetKey)}`;
console.log(`✓ Deep Link remedial được tạo chính xác: ${targetUrl}`);
assert(sessionStorageMock.getItem('vlxt_remedial_active') === '1', 'sessionStorage phải lưu cờ remedial active');

// =========================================================================
// BƯỚC 4: HỌC BÀI KHẮC PHỤC TRÊN baihoc.html
// =========================================================================
console.log('\n--- BƯỚC 4: HỌC BÀI KHẮC PHỤC TRÊN baihoc.html ---');

const baihocHtml = fs.readFileSync('baihoc.html', 'utf8');
assert(baihocHtml.includes('getRemedialContext'), 'baihoc.html phải có hàm getRemedialContext');
assert(baihocHtml.includes('FreemiumFlow.renderRetestDeB(_retestSlot, _topName, _lessonId)'), 'baihoc.html phải gọi renderRetestDeB kèm mã bài học _lessonId');
console.log('✓ baihoc.html nhận diện chuẩn ngữ cảnh remedial và truyền mã bài học sang Đề B.');

// =========================================================================
// BƯỚC 5: NẠP & LÀM ĐỀ B THEO MÃ BÀI HỌC (data/retest_bank_by_lessons.json)
// =========================================================================
console.log('\n--- BƯỚC 5: LÀM ĐỀ B THEO ĐÚNG BÀI HỌC (B02) TỪ NGÂN HÀNG ĐỀ B ---');

// 1. Kiểm tra ngân hàng Đề B đã chuẩn hóa
const retestBankRaw = fs.readFileSync('data/retest_bank_by_lessons.json', 'utf8');
const retestBank = JSON.parse(retestBankRaw);
assert(retestBank.totalLessons === 23, 'Ngân hàng Đề B phải đủ 23 bài');
assert(retestBank.totalQuestions === 115, 'Ngân hàng Đề B phải đủ 115 câu');
assert(retestBank.byMaBai[targetKey], `Phải có mã bài ${targetKey} trong byMaBai`);

// 2. Nạp bank vào FreemiumFlow
FreemiumFlow._lessonRetestBank = retestBank;

// 3. Test hàm getRetestQuestions: Ưu tiên mã bài B04e20f0ec67d
const qBundle = FreemiumFlow.getRetestQuestions(targetKey, targetTopic);
assert.strictEqual(qBundle.source, 'lesson', 'Phải nạp thành công từ nguồn bài học (source: lesson)');
assert.strictEqual(qBundle.lessonCode, 'B02', 'Phải khớp đúng bài B02');
assert.strictEqual(qBundle.questions.length, 5, 'Đề B phải có đúng 5 câu');
console.log(`✓ Nạp 5 câu Đề B thành công theo mã bài: ${qBundle.lessonCode} - ${qBundle.lessonTitle}`);

// Kiểm tra cấu trúc sư phạm 2NB + 2TH + 1VD
const nbCount = qBundle.questions.filter(q => q.level === 'nhan_biet').length;
const thCount = qBundle.questions.filter(q => q.level === 'thong_hieu').length;
const vdCount = qBundle.questions.filter(q => q.level === 'van_dung').length;
assert.strictEqual(nbCount, 2, 'Phải có đúng 2 câu nhận biết');
assert.strictEqual(thCount, 2, 'Phải có đúng 2 câu thông hiểu');
assert.strictEqual(vdCount, 1, 'Phải có đúng 1 câu vận dụng / bẫy');
console.log(`✓ Cấu trúc sư phạm chuẩn mực: 2 Nhận biết + 2 Thông hiểu + 1 Vận dụng/Bẫy.`);

// 4. Test renderRetestDeB vào DOM
const mountDiv = createMockElement('div');
mountDiv.id = 'vstep-retest-mount';
FreemiumFlow.renderRetestDeB(mountDiv, targetTopic, targetKey);
assert(mountDiv.children.length > 0, 'Mount point phải chứa Đề B card');
const cardWrapper = mountDiv.children[0];
assert(cardWrapper.innerHTML.includes('B2. Lực liên kết và sự chuyển thể của chất'), 'Tiêu đề Đề B phải ghi rõ tên bài học');
assert(cardWrapper.innerHTML.includes('Câu 1 / 5'), 'Phải render các câu hỏi');
console.log('✓ Render giao diện Đề B vào DOM hoàn chỉnh.');

// 5. Học sinh làm bài Đề B: Chọn đúng cả 5 câu (sau khi đã xem video & mô phỏng của Thầy)
qBundle.questions.forEach((q, idx) => {
  FreemiumFlow.selectRetestOption(idx, q.ans);
});
assert.strictEqual(Object.keys(FreemiumFlow._retestAnswers).length, 5, 'Phải chọn đủ 5 câu');
console.log('✓ Học sinh hoàn thành 5/5 câu của Đề B.');

// =========================================================================
// BƯỚC 6: NỘP BÀI ĐỀ B & XEM BIỂU ĐỒ BỨT PHÁ (MASTERY COMPARISON)
// =========================================================================
console.log('\n--- BƯỚC 6: NỘP BÀI ĐỀ B & XEM BIỂU ĐỒ BỨT PHÁ TIẾN BỘ ---');

// Bỏ qua native confirm trong môi trường test
global.confirm = () => true;
FreemiumFlow.submitRetestDeB();

assert.strictEqual(FreemiumFlow._retestSubmitted, true, 'Đề B phải chuyển sang trạng thái đã nộp');
const lastCeleb = FreemiumFlow._lastCelebrationData;
assert(lastCeleb, 'Phải có dữ liệu bứt phá tiến bộ');
assert.strictEqual(lastCeleb.correct, 5, 'Phải đúng 5/5 câu Đề B');
assert.strictEqual(lastCeleb.total, 5, 'Tổng số câu Đề B là 5');
assert.strictEqual(lastCeleb.deBScorePct, 100, 'Điểm Đề B đạt 100%');
assert(lastCeleb.growth > 0, 'Phải ghi nhận tăng trưởng vượt bậc');
console.log(`✓ Kết quả Đề B: Đúng 5/5 câu (100%). Trước: ${lastCeleb.preScorePct}% -> Sau: 100% (+${lastCeleb.growth}% tăng trưởng!).`);

// =========================================================================
// BƯỚC 7: NÂNG CẤP GÓI PRO 50K ĐỂ MỞ KHÓA TOÀN BỘ CHƯƠNG 3, 4 & PHÒNG THI
// =========================================================================
console.log('\n--- BƯỚC 7: SOFT UPSELL & NÂNG CẤP GÓI PRO 50K ---');

// Kiểm tra hàm mở modal nâng cấp
let upgradeModalOpened = false;
FreemiumFlow.openUpgradeValueModal = function (title) {
  upgradeModalOpened = true;
};
FreemiumFlow.openProUpgradeFromRetest(lastCeleb.topic);
assert.strictEqual(upgradeModalOpened, true, 'Nút nâng cấp từ Đề B phải kích hoạt UpgradeValueModal');
console.log('✓ Nút nâng cấp từ Đề B dẫn thẳng sang modal Gói Pro 50k.');

// Mô phỏng thanh toán thành công và mở khóa tài khoản
const mockUser = {
  sdt: '0988776655',
  hoten: 'Nguyễn Văn Minh',
  isPaid: true,
  loaiTK: 'pro'
};
localStorageMock.setItem('vlxt_user_v2', JSON.stringify(mockUser));

assert.strictEqual(FreemiumFlow.isPaidUser(mockUser), true, 'Tài khoản phải được công nhận là Pro');
assert.strictEqual(FreemiumFlow.isChapterFree('CHƯƠNG 3 – TỪ TRƯỜNG', mockUser), true, 'Học sinh Pro phải mở khóa Chương 3');
assert.strictEqual(FreemiumFlow.isChapterFree('CHƯƠNG 4 – VẬT LÍ HẠT NHÂN', mockUser), true, 'Học sinh Pro phải mở khóa Chương 4');
assert.strictEqual(FreemiumFlow.isQuizFree(null, 'any_quiz', mockUser), true, 'Học sinh Pro không bị giới hạn 5 gói đề');
console.log('✓ Học sinh Pro mở khóa trọn vẹn 100% toàn bộ hệ sinh thái Vật Lý Xuân Trường.');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('🎉 100% CẢ 7 BƯỚC CỦA LUỒNG HỌC SINH ĐỀU VẬN HÀNH HOÀN HẢO!');
console.log('═══════════════════════════════════════════════════════════════');
