import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('=== TEST SUITE: STUDENT STABLE LESSON/SESSION NUMBER REGRESSION ===\n');

const htmlPath = path.resolve('baihoc.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Trích xuất script chính (chứa buildCourses và getLessonSessionNum)
const scripts = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
const targetScript = scripts.find(s => s[1].includes('function buildCourses') && s[1].includes('function getLessonSessionNum'));

if (!targetScript) {
  throw new Error('Could not find script containing buildCourses and getLessonSessionNum in baihoc.html');
}

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log('  ✅ PASS: ' + name);
  } catch (e) {
    console.error('  ❌ FAIL: ' + name);
    console.error('     ' + e.message);
    throw e;
  }
}

// -----------------------------------------------------------------------------
// SUITE 1: UNIT TEST CHO getLessonSessionNum(l, fallbackIndex)
// -----------------------------------------------------------------------------
console.log('--- [SUITE 1] Unit Test Trích Xuất Định Danh Ổn Định getLessonSessionNum ---');

function createSandbox() {
  function createMockElement(id = '') {
    return {
      id,
      style: {},
      value: '',
      textContent: '',
      innerHTML: '',
      classList: { add: () => {}, remove: () => {}, contains: () => false },
      appendChild: () => {},
      removeChild: () => {},
      insertAdjacentHTML: () => {},
      insertAdjacentElement: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      setAttribute: () => {},
      removeAttribute: () => {},
      getAttribute: () => null,
      querySelectorAll: () => [],
      querySelector: () => null
    };
  }

  const domElements = {
    app: createMockElement('app')
  };
  const sandbox = {
    console: { log: () => {}, warn: () => {}, error: () => {} },
    setTimeout, clearTimeout, setInterval, clearInterval,
    URL, URLSearchParams,
    location: { hash: '#home' },
    addEventListener: () => {},
    removeEventListener: () => {},
    document: {
      addEventListener: () => {},
      removeEventListener: () => {},
      createElement: (tag) => createMockElement(tag),
      head: createMockElement('head'),
      body: createMockElement('body'),
      getElementById: (id) => domElements[id] || (domElements[id] = createMockElement(id)),
      querySelector: (sel) => createMockElement(sel),
      querySelectorAll: () => []
    },
    app: () => domElements.app,
    renderMath: () => {},
    toast: () => {},
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  vm.runInContext(targetScript[1], ctx);
  return { ctx, domElements };
}

const { ctx, domElements } = createSandbox();
const getLessonSessionNum = vm.runInContext('getLessonSessionNum', ctx);

it('1.1. Trích xuất chuẩn xác số bài dạng Bxx từ TenBai', () => {
  assert.equal(getLessonSessionNum({ name: 'B9. MÔ HÌNH ĐỘNG HỌC PHÂN TỬ CHẤT KHÍ' }), 9);
  assert.equal(getLessonSessionNum({ name: 'B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG' }), 10);
  assert.equal(getLessonSessionNum({ name: 'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT' }), 11);
  assert.equal(getLessonSessionNum({ name: 'B12. ĐỊNH LUẬT CHARLES - QUÁ TRÌNH ĐẲNG ÁP' }), 12);
  assert.equal(getLessonSessionNum({ name: 'B13. ĐỊNH LUẬT GAY LUSSAC - QUÁ TRÌNH ĐẲNG TÍCH' }), 13);
  assert.equal(getLessonSessionNum({ name: 'B37. TỔNG ÔN CHƯƠNG IV' }), 37);
});

it('1.2. Trích xuất từ các biến thể tiêu đề (B 12, Bài 12, Buổi 12, Ngày 2)', () => {
  assert.equal(getLessonSessionNum({ name: 'B 12: ĐỊNH LUẬT CHARLES' }), 12);
  assert.equal(getLessonSessionNum({ name: 'B.12 - Định luật Charles' }), 12);
  assert.equal(getLessonSessionNum({ name: 'Bài 12: Định luật Charles' }), 12);
  assert.equal(getLessonSessionNum({ name: 'Buổi 12: Định luật Charles' }), 12);
  assert.equal(getLessonSessionNum({ name: 'Ngày 2: 3 ĐỊNH LUẬT NEWTON' }), 2);
});

it('1.3. Trích xuất từ MaBai khi TenBai không chứa Bxx', () => {
  assert.equal(getLessonSessionNum({ name: 'Định luật Charles', mabai: 'B12' }), 12);
  assert.equal(getLessonSessionNum({ name: 'Định luật Charles', mabai: 'B12_extra' }), 12);
});

it('1.4. Trích xuất từ ThuTuBai khi TenBai không chứa Bxx', () => {
  assert.equal(getLessonSessionNum({ name: 'Chuyên đề ôn thi nâng cao', mabai: 'Bfb85fde44802', ttb: 7 }), 7);
  assert.equal(getLessonSessionNum({ TenBai: 'Chuyên đề ôn thi nâng cao', ThuTuBai: 8 }), 8);
});

it('1.5. Fallback vị trí tuần tự khi hoàn toàn không có định danh số', () => {
  assert.equal(getLessonSessionNum({ name: 'Khảo sát đồ thị', mabai: 'Bfb85fde44802' }, 15), 15);
});

// -----------------------------------------------------------------------------
// SUITE 2: REGRESSION TEST VỚI B9 (PUB), B10 (PUB), B11 (DRAFT), B12 (PUB), B13 (PUB)
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 2] Regression: B11 Draft Ẩn Khỏi Web, B12 Giữ Nguyên Buổi 12 ---');

const mockCourseName = 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12';
const mockChapterName = 'Chương 2 – Khí lí tưởng';

const mockRows = [
  {
    KhoaHoc: mockCourseName,
    Chuong: mockChapterName,
    TenBai: 'B9. MÔ HÌNH ĐỘNG HỌC PHÂN TỬ CHẤT KHÍ - KHÍ LÝ TƯỞNG',
    ThuTuBai: 1,
    TrangThai: 'published',
    MaBai: 'B5d320f0a8875',
    Video: 'https://youtube.com/watch?v=b9'
  },
  {
    KhoaHoc: mockCourseName,
    Chuong: mockChapterName,
    TenBai: 'B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG',
    ThuTuBai: 3,
    TrangThai: 'published',
    MaBai: 'B557b8fccbc72',
    Video: 'https://youtube.com/watch?v=b10'
  },
  {
    KhoaHoc: mockCourseName,
    Chuong: mockChapterName,
    TenBai: 'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT',
    ThuTuBai: 4,
    TrangThai: 'draft', // DRAFT: Phải bị lọc sạch, KHÔNG được xuất hiện
    MaBai: 'B4ca24b64572f',
    Video: 'https://youtube.com/watch?v=b11'
  },
  {
    KhoaHoc: mockCourseName,
    Chuong: mockChapterName,
    TenBai: 'B12. ĐỊNH LUẬT CHARLES - QUÁ TRÌNH ĐẲNG ÁP',
    ThuTuBai: 5,
    TrangThai: 'published',
    MaBai: 'Bfbfa62b6cbf1',
    Video: 'https://youtube.com/watch?v=b12'
  },
  {
    KhoaHoc: mockCourseName,
    Chuong: mockChapterName,
    TenBai: 'B13. ĐỊNH LUẬT GAY LUSSAC - QUÁ TRÌNH ĐẲNG TÍCH',
    ThuTuBai: 6,
    TrangThai: 'published',
    MaBai: 'B24bbd84d8ea9',
    Video: 'https://youtube.com/watch?v=b13'
  }
];

it('2.1. buildCourses(rows) lọc sạch bài B11 Draft, chỉ giữ lại 4 bài published', () => {
  const courses = vm.runInContext('buildCourses(' + JSON.stringify(mockRows) + ')', ctx);
  assert.equal(courses.length, 1);
  const c = courses[0];
  const allLessons = c.chapters.flatMap(ch => ch.lessons);
  assert.equal(allLessons.length, 4, 'Khoá học chỉ có 4 bài published (đã loại bỏ B11 Draft)');

  const hasB11 = allLessons.some(l => l.name.includes('B11') || l.mabai === 'B4ca24b64572f');
  assert.equal(hasB11, false, 'B11 Draft tuyệt đối không được có trong cấu trúc khoá học');

  const b12 = allLessons.find(l => l.name.includes('B12'));
  const b13 = allLessons.find(l => l.name.includes('B13'));
  assert.ok(b12, 'B12 phải có mặt');
  assert.ok(b13, 'B13 phải có mặt');
});

it('2.2. renderCourse() hiển thị nhãn Buổi 12 cho B12 và Buổi 13 cho B13 (KHÔNG thành Buổi 11 / Buổi 12)', () => {
  const courses = vm.runInContext('buildCourses(' + JSON.stringify(mockRows) + ')', ctx);
  vm.runInContext('COURSES = ' + JSON.stringify(courses), ctx);

  // Kích hoạt renderCourse
  vm.runInContext('renderCourse("' + mockCourseName + '")', ctx);
  const renderedHtml = domElements.app.innerHTML;

  // 1. Kiểm tra B11 hoàn toàn không render
  assert.equal(renderedHtml.includes('ĐỊNH LUẬT BOYLE'), false, 'B11 không được xuất hiện trong DOM');
  assert.equal(renderedHtml.includes('B4ca24b64572f'), false, 'MaBai B11 không được có trong DOM');

  // 2. Kiểm tra B9 render đúng Buổi 9
  assert.equal(renderedHtml.includes('Buổi 9'), true, 'B9 phải có nhãn Buổi 9');

  // 3. Kiểm tra B10 render đúng Buổi 10
  assert.equal(renderedHtml.includes('Buổi 10'), true, 'B10 phải có nhãn Buổi 10');

  // 4. KIỂM THỬ TRỌNG TÂM: B12 phải là Buổi 12 (KHÔNG ĐƯỢC LÀ BUỔI 11)
  assert.equal(renderedHtml.includes('<span class="lesson-session-num">Buổi 12</span>'), true, 'B12 BẮT BUỘC mang nhãn Buổi 12');
  assert.equal(renderedHtml.includes('<span class="lesson-session-num">Buổi 11</span>'), false, 'KHÔNG ĐƯỢC có nhãn Buổi 11 trong DOM khi B11 là Draft');

  // 5. B13 phải là Buổi 13 (KHÔNG ĐƯỢC LÀ BUỔI 12)
  assert.equal(renderedHtml.includes('<span class="lesson-session-num">Buổi 13</span>'), true, 'B13 BẮT BUỘC mang nhãn Buổi 13');
});

it('2.3. renderLesson() hiển thị BUỔI 12/... và Sidebar hiển thị B12. khi học sinh vào bài B12', () => {
  const courses = vm.runInContext('buildCourses(' + JSON.stringify(mockRows) + ')', ctx);
  vm.runInContext('COURSES = ' + JSON.stringify(courses), ctx);
  vm.runInContext('HS = { sdt: "0900000001" };', ctx);

  // Kích hoạt renderLesson với bài B12
  vm.runInContext('renderLesson("Bfbfa62b6cbf1")', ctx);
  const renderedHtml = domElements.app.innerHTML;

  // Kiểm tra tiêu đề header Buổi: BUỔI 12/...
  assert.equal(renderedHtml.includes('BUỔI 12/4'), true, 'Tiêu đề bài học phải hiển thị BUỔI 12/4');

  // Kiểm tra sidebar: B12. và B13.
  assert.equal(renderedHtml.includes('B12.</span>'), true, 'Sidebar phải hiển thị B12.');
  assert.equal(renderedHtml.includes('B13.</span>'), true, 'Sidebar phải hiển thị B13.');
  assert.equal(renderedHtml.includes('B11.</span>'), false, 'Sidebar không được có B11.');
});

console.log('\n======================================================');
console.log('KẾT QUẢ KIỂM THỬ: ' + passed + '/' + total + ' PASS (100%)');
console.log('======================================================\n');
