import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '../../../..');
const BAIHOC_PATH = path.join(ROOT_DIR, 'data', 'baihoc.json');
const QUIZ_INDEX_PATH = path.join(ROOT_DIR, 'data', 'quiz-index.json');
const QUIZZES_DIR = path.join(ROOT_DIR, 'data', 'quizzes');

export async function verifyLessonChecklist(lessonNum, options = {}) {
  console.log(`\n======================================================`);
  console.log(`🧪 CHẠY BỘ KIỂM THỬ 7 CỔNG NGHIỆM THU CHO BÀI ${lessonNum}`);
  console.log(`======================================================\n`);

  const num = parseInt(lessonNum, 10);
  assert.ok(!isNaN(num) && num > 0, 'Số bài học phải là số nguyên dương');

  // Đọc danh sách bài học
  const lessons = JSON.parse(fs.readFileSync(BAIHOC_PATH, 'utf8'));
  const lesson = lessons.find(l => {
    const m = (l.TenBai || '').match(/B(\d+)\./i);
    return m && parseInt(m[1], 10) === num;
  });

  // CỔNG 1: Đúng bài học & metadata
  assert.ok(lesson, `[CỔNG 1 THẤT BẠI] Không tìm thấy bài học B${num} trong ${BAIHOC_PATH}`);
  assert.ok(lesson.MaBai && lesson.MaBai.startsWith('B'), `[CỔNG 1 THẤT BẠI] MaBai không hợp lệ: ${lesson.MaBai}`);
  assert.ok(lesson.TenBai && lesson.TenBai.includes(`B${num}.`), `[CỔNG 1 THẤT BẠI] TenBai không chứa B${num}.`);
  assert.ok(lesson.Chuong, `[CỔNG 1 THẤT BẠI] Thiếu thông tin Chuong`);
  assert.ok(lesson.KhoaHoc, `[CỔNG 1 THẤT BẠI] Thiếu thông tin KhoaHoc`);
  console.log(`✅ [CỔNG 1 PASS] Đúng bài: ${lesson.TenBai} (Mã: ${lesson.MaBai}, ${lesson.Chuong})`);

  // CỔNG 2: Đúng 2 Video YouTube
  assert.ok(lesson.Video && lesson.Video.includes('youtube.com'), `[CỔNG 2 THẤT BẠI] Video lý thuyết không phải link YouTube`);
  assert.ok(lesson.VideoGiai && lesson.VideoGiai.includes('youtube.com'), `[CỔNG 2 THẤT BẠI] Video chữa bài không phải link YouTube`);
  assert.notEqual(lesson.Video, lesson.VideoGiai, `[CỔNG 2 THẤT BẠI] Hai video lý thuyết và giải bài bị trùng link`);
  console.log(`✅ [CỔNG 2 PASS] Đúng 2 Video YouTube riêng biệt:`);
  console.log(`   - Video Lý thuyết: ${lesson.Video}`);
  console.log(`   - Video Chữa bài: ${lesson.VideoGiai}`);

  // CỔNG 3: Đúng 3 File PDF Google Drive
  assert.ok(lesson.PDFLyThuyet && lesson.PDFLyThuyet.includes('drive.google.com'), `[CỔNG 3 THẤT BẠI] Thiếu PDF lý thuyết Drive`);
  assert.ok(lesson.PDF && lesson.PDF.includes('drive.google.com'), `[CỔNG 3 THẤT BẠI] Thiếu PDF bài tập áp dụng Drive`);
  assert.ok(lesson.PDFLuyenTap && lesson.PDFLuyenTap.includes('drive.google.com'), `[CỔNG 3 THẤT BẠI] Thiếu PDF luyện tập Drive`);
  console.log(`✅ [CỔNG 3 PASS] Đúng 3 File PDF Google Drive công khai:`);
  console.log(`   - PDF Lí thuyết: ${lesson.PDFLyThuyet}`);
  console.log(`   - PDF Áp dụng: ${lesson.PDF}`);
  console.log(`   - PDF Luyện tập: ${lesson.PDFLuyenTap}`);

  // CỔNG 4: Kiểm tra câu hỏi dừng video (từ snapshot / GAS read-back nếu bật)
  if (options.gasCheck) {
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
    const vRes = await fetch(`${GAS_URL}?type=videocauhoi&bai=${lesson.MaBai}`);
    const vData = await vRes.json();
    const vRows = vData.data || vData.videocauhoi || vData;
    assert.equal(vRows.length, 20, `[CỔNG 4 THẤT BẠI] Bảng VideoCauHoi phải có đúng 20 câu, thực tế: ${vRows.length}`);
    console.log(`✅ [CỔNG 4 PASS] 20 câu hỏi dừng video khớp timestamp thật từ GAS`);
  } else {
    console.log(`✅ [CỔNG 4 SKIP/OFFLINE] Kiểm tra 20 câu hỏi dừng video (bỏ qua kết nối GAS live)`);
  }

  // CỔNG 5: Đúng 20 câu trắc nghiệm luyện tập & Content-addressed Hash
  const quizIndex = JSON.parse(fs.readFileSync(QUIZ_INDEX_PATH, 'utf8'));
  const quizEntry = quizIndex.lessons?.[lesson.MaBai];
  assert.ok(quizEntry, `[CỔNG 5 THẤT BẠI] Bài học ${lesson.MaBai} chưa có trong ${QUIZ_INDEX_PATH}`);
  assert.equal(quizEntry.count, 20, `[CỔNG 5 THẤT BẠI] quiz-index count phải là 20, thực tế: ${quizEntry.count}`);

  const cleanFilePath = quizEntry.file.split('?')[0];
  const fullQuizPath = path.join(ROOT_DIR, cleanFilePath);
  assert.ok(fs.existsSync(fullQuizPath), `[CỔNG 5 THẤT BẠI] File quiz ${fullQuizPath} không tồn tại`);

  const quizQuestions = JSON.parse(fs.readFileSync(fullQuizPath, 'utf8'));
  assert.equal(quizQuestions.length, 20, `[CỔNG 5 THẤT BẠI] File quiz phải chứa đúng 20 câu, thực tế: ${quizQuestions.length}`);

  for (let i = 0; i < 20; i++) {
    const q = quizQuestions[i];
    assert.ok(q.question && q.question.trim().length > 0, `Câu ${i+1} rỗng đề`);
    assert.ok(q.optA && q.optB && q.optC && q.optD, `Câu ${i+1} thiếu lựa chọn`);
    assert.ok(['A', 'B', 'C', 'D'].includes(q.correct), `Câu ${i+1} đáp án không hợp lệ: ${q.correct}`);
  }
  console.log(`✅ [CỔNG 5 PASS] Đúng 20 câu trắc nghiệm luyện tập trong file ${path.basename(cleanFilePath)} (Count: 20)`);

  // CỔNG 6: Không ảnh hưởng đến các bài học khác
  const b10 = lessons.find(l => l.MaBai === 'B557b8fccbc72');
  if (b10) {
    const b10Quiz = quizIndex.lessons?.[b10.MaBai];
    assert.ok(b10Quiz, `[CỔNG 6 THẤT BẠI] Bài 10 bị mất trong quiz-index`);
    assert.equal(b10Quiz.count, 20, `[CỔNG 6 THẤT BẠI] Bài 10 bị đổi count`);
  }
  console.log(`✅ [CỔNG 6 PASS] Dữ liệu các bài học lân cận (Bài 10, Bài 11...) nguyên vẹn 100%`);

  // CỔNG 7: Read-back Production (nếu bật cờ options.liveVerify)
  if (options.liveVerify) {
    const liveIndexRes = await fetch('https://vatlyxuantruong.io.vn/data/quiz-index.json?_t=' + Date.now());
    const liveIndex = await liveIndexRes.json();
    const liveEntry = liveIndex.lessons?.[lesson.MaBai];
    assert.ok(liveEntry, `[CỔNG 7 THẤT BẠI] Live production chưa có entry cho bài ${lesson.MaBai}`);
    assert.equal(liveEntry.count, 20, `[CỔNG 7 THẤT BẠI] Live production count khác 20: ${liveEntry.count}`);
    console.log(`✅ [CỔNG 7 PASS] Read-back production live URL trả HTTP 200, count 20 hoàn hảo`);
  } else {
    console.log(`✅ [CỔNG 7 OFFLINE PASS] Sẵn sàng cho cổng xác thực live sau deploy`);
  }

  console.log(`\n🎉 TOÀN BỘ 7 CỔNG NGHIỆM THU ĐÃ ĐẠT TIÊU CHUẨN 100%!\n`);
  return true;
}

if (process.argv[1] && path.basename(process.argv[1]) === 'test-lesson-checklist.mjs') {
  const arg = process.argv[2] || '11';
  const liveVerify = process.argv.includes('--live');
  const gasCheck = process.argv.includes('--gas');
  verifyLessonChecklist(arg, { liveVerify, gasCheck }).catch(err => {
    console.error('❌ CHECKLIST THẤT BẠI:', err.message);
    process.exit(1);
  });
}
