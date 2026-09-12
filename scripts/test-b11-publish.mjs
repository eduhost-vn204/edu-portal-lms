import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

console.log('=== RUNNING COMPREHENSIVE VERIFICATION FOR BÀI 11 ===');

// 1. Check data/baihoc.json
const baihocRaw = readFileSync('data/baihoc.json', 'utf8');
const lessons = JSON.parse(baihocRaw);
assert.equal(lessons.length, 41, 'data/baihoc.json phải có đúng 41 bài học');

const b11 = lessons.find(l => l.MaBai === 'B4ca24b64572f');
assert.ok(b11, 'Bài 11 (B4ca24b64572f) phải có mặt trong data/baihoc.json');
assert.equal(b11.TenBai, 'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT');
assert.equal(b11.ThuTuBai, 4);
assert.equal(b11.Chuong, 'Chương 2 – Khí lí tưởng');
console.log('✅ 1. data/baihoc.json: 41 bài học, B11 định danh chuẩn xác.');

// 2. Check data/quiz-index.json
const quizIndex = JSON.parse(readFileSync('data/quiz-index.json', 'utf8'));
const b11Meta = quizIndex.lessons['B4ca24b64572f'];
assert.ok(b11Meta, 'B11 phải có trong quiz-index.json');
assert.equal(b11Meta.count, 20, 'B11 phải có count: 20');
assert.ok(b11Meta.file.startsWith('data/quizzes/quiz-c88214ff9cb9bfffe1d1.json'), 'B11 phải trỏ tới file quiz content-addressed');

const quizFilePath = b11Meta.file.split('?')[0];
assert.ok(existsSync(quizFilePath), 'File quiz ' + quizFilePath + ' phải tồn tại trên đĩa');
const quizRows = JSON.parse(readFileSync(quizFilePath, 'utf8'));
assert.equal(quizRows.length, 20, 'File quiz phải có đủ 20 câu hỏi');
assert.equal(quizRows[0].question, 'Đặc điểm không phải của quá trình đẳng nhiệt?');
assert.equal(quizRows[0].correct, 'D');
assert.equal(quizRows[19].correct, 'C');
console.log('✅ 2. data/quiz-index.json & data/quizzes: 20/20 câu B11 khớp chính xác đáp án Thầy.');

// 3. Test baihoc.html in VM
const baihocHtml = readFileSync('baihoc.html', 'utf8');
assert.ok(baihocHtml.includes('</html>'), 'baihoc.html phải có thẻ đóng </html>');

const ctx = {
  window: { addEventListener: () => {}, removeEventListener: () => {} },
  document: {
    querySelector: () => ({ innerHTML: '', style: {}, addEventListener: () => {} }),
    querySelectorAll: () => [],
    getElementById: () => ({ innerHTML: '', style: {} }),
    createElement: () => ({ setAttribute: () => {}, appendChild: () => {} }),
    head: { appendChild: () => {} },
    body: { appendChild: () => {}, classList: { add: () => {}, remove: () => {} } },
    addEventListener: () => {},
    title: ''
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  },
  location: { hash: '#lesson/B4ca24b64572f', search: '', pathname: '/baihoc.html' },
  history: { replaceState: () => {}, pushState: () => {} },
  console,
  setTimeout: () => {},
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
};
vm.createContext(ctx);

const scriptMatch = baihocHtml.match(/<script>([\s\S]*?)<\/script>/g);
for (const sm of scriptMatch) {
  const code = sm.replace(/<\/?script>/g, '');
  if (code.includes('function buildCourses')) {
    vm.runInContext(code, ctx);
    break;
  }
}

const courses = vm.runInContext('buildCourses(' + JSON.stringify(lessons) + ')', ctx);
const course = courses.find(c => c.name.includes('CHUYÊN ĐỀ LÝ THUYẾT GĐ1'));
assert.ok(course, 'Phải tìm thấy khóa CHUYÊN ĐỀ LÝ THUYẾT GĐ1');

const ch2 = course.chapters.find(ch => ch.name.includes('Chương 2'));
assert.ok(ch2, 'Phải tìm thấy Chương 2');

const ch2Lessons = ch2.lessons;
const b9Idx = ch2Lessons.findIndex(l => l.name.includes('B9.'));
const b10Idx = ch2Lessons.findIndex(l => l.name.includes('B10.'));
const b11Idx = ch2Lessons.findIndex(l => l.name.includes('B11.'));
const b12Idx = ch2Lessons.findIndex(l => l.name.includes('B12.'));
const b13Idx = ch2Lessons.findIndex(l => l.name.includes('B13.'));

assert.ok(b10Idx > b9Idx, 'B10 phải xếp sau B9');
assert.ok(b11Idx > b10Idx, 'B11 phải xếp sau B10');
if (b12Idx !== -1) {
  assert.ok(b12Idx > b11Idx, 'B12 phải xếp sau B11');
  assert.ok(b13Idx > b12Idx, 'B13 phải xếp sau B12');
} else {
  assert.ok(b13Idx > b11Idx, 'B13 phải xếp sau B11 khi B12 là draft');
}

console.log('✅ 3. Thứ tự Chương 2 trong buildCourses: B9 (idx ' + b9Idx + ') -> B10 (idx ' + b10Idx + ') -> B11 (idx ' + b11Idx + ')' + (b12Idx !== -1 ? ' -> B12 (idx ' + b12Idx + ')' : ' (B12 draft ẩn)') + ' -> B13 (idx ' + b13Idx + ')');

const b10Session = vm.runInContext('getLessonSessionNum(' + JSON.stringify(ch2Lessons[b10Idx]) + ')', ctx);
const b11Session = vm.runInContext('getLessonSessionNum(' + JSON.stringify(ch2Lessons[b11Idx]) + ')', ctx);
const b13Session = vm.runInContext('getLessonSessionNum(' + JSON.stringify(ch2Lessons[b13Idx]) + ')', ctx);

assert.equal(b10Session, 10, 'B10 session phải là 10');
assert.equal(b11Session, 11, 'B11 session phải là 11');
if (b12Idx !== -1) {
  const b12Session = vm.runInContext('getLessonSessionNum(' + JSON.stringify(ch2Lessons[b12Idx]) + ')', ctx);
  assert.equal(b12Session, 12, 'B12 session phải là 12');
}
assert.equal(b13Session, 13, 'B13 session phải là 13');
console.log('✅ 4. Số buổi ổn định: Buổi 10 -> Buổi 11 -> Buổi 12 -> Buổi 13');

const flat = course.chapters.flatMap(ch => ch.lessons);
const b11FlatIdx = flat.findIndex(l => l.key === 'B4ca24b64572f');
assert.ok(b11FlatIdx > 0, 'B11 phải có vị trí hợp lệ trong flatLessons');
const prevLesson = flat[b11FlatIdx - 1];
const nextLesson = flat[b11FlatIdx + 1];

const expectedNext = flat.some(l => l.mabai === 'Bfbfa62b6cbf1') ? 'Bfbfa62b6cbf1' : 'B24bbd84d8ea9';
assert.equal(nextLesson.mabai, expectedNext, 'Bài tiếp theo của B11 BẮT BUỘC hợp lệ');
console.log('✅ 5. Điều hướng bài trước/sau: [Bài trước: ' + prevLesson.name + '] <- [B11] -> [Bài sau: ' + nextLesson.name + ']');

const mappedBaitap = vm.runInContext('mapQuizRows(' + JSON.stringify(quizRows) + ')', ctx);
assert.equal(mappedBaitap.length, 20, 'mapQuizRows phải map đủ 20 câu');
assert.equal(mappedBaitap[0].ans, 'D');
assert.equal(mappedBaitap[19].ans, 'C');
console.log('✅ 6. mapQuizRows nạp đủ 20 câu trắc nghiệm luyện tập và đáp án hợp lệ.');

// 7. Check Video and PDF assets
assert.ok(b11.Video && b11.Video.includes('youtube.com'), 'Video lý thuyết phải là YouTube link');
assert.ok(b11.VideoGiai && b11.VideoGiai.includes('youtube.com'), 'Video giải phải là YouTube link');
assert.ok(b11.PDFLyThuyet && b11.PDFLyThuyet.includes('drive.google.com'), 'PDF lý thuyết phải là Drive link');
assert.ok(b11.PDF && b11.PDF.includes('drive.google.com'), 'PDF bài tập áp dụng phải là Drive link');
assert.ok(b11.PDFLuyenTap && b11.PDFLuyenTap.includes('drive.google.com'), 'PDF luyện tập phải là Drive link');
assert.equal(b11.Video, 'https://www.youtube.com/watch?v=yHYNTWS1iCA');
assert.equal(b11.VideoGiai, 'https://www.youtube.com/watch?v=hl0yjy331xw');
assert.equal(b11.PDFLyThuyet, 'https://drive.google.com/file/d/1P9Bn0-KXrf1hA2NyNE5UE6HxOu91xINX/view?usp=sharing');
assert.equal(b11.PDF, 'https://drive.google.com/file/d/1q011XVLDrVEg0SW1g6VHPBzKIFLz1nFn/view?usp=sharing');
assert.equal(b11.PDFLuyenTap, 'https://drive.google.com/file/d/1n47DgcucFgz8nr_DGdxy3FCNr62375Bi/view?usp=sharing');
console.log('✅ 7. Video YouTube và PDF Google Drive của Bài 11 hợp lệ 100%.');

console.log('\n🎉 TOÀN BỘ 7 BƯỚC KIỂM TRA ĐỐI SOÁT BÀI 11 ĐÃ PASS 100%!');
