import fs from 'node:fs';
import path from 'node:path';
import { findLessonDirectory, inspectLessonPackage } from './resolve-lesson-source.mjs';

const ROOT_DIR = path.resolve(import.meta.dirname, '../../../..');
const BAIHOC_PATH = path.join(ROOT_DIR, 'data', 'baihoc.json');
const QUIZ_INDEX_PATH = path.join(ROOT_DIR, 'data', 'quiz-index.json');

export async function runDryRun(lessonInput) {
  console.log(`\n======================================================`);
  console.log(`🔍 KHỞI CHẠY DRY-RUN: LẬP KẾ HOẠCH PHÁT HÀNH BÀI ${lessonInput}`);
  console.log(`======================================================\n`);

  // 1. Tìm thư mục học liệu
  const loc = findLessonDirectory(lessonInput);
  if (!loc) {
    console.error(`❌ [THẤT BẠI] Không tìm thấy thư mục học liệu cho Bài ${lessonInput}`);
    return { success: false, reason: 'SOURCE_DIRECTORY_NOT_FOUND' };
  }

  console.log(`📁 1. THƯ MỤC NGUỒN ĐÃ NHẬN DIỆN:`);
  console.log(`   - Chương: ${loc.chapterName}`);
  console.log(`   - Tên thư mục: ${loc.lessonDirName}`);
  console.log(`   - Đường dẫn đầy đủ: ${loc.lessonDirPath}`);

  // 2. Khảo sát gói học liệu
  const inspection = inspectLessonPackage(loc.lessonDirPath);
  console.log(`\n📦 2. KHẢO SÁT HỌC LIỆU ĐẦU VÀO:`);
  console.log(`   - Video Lý thuyết: ${inspection.package.videoTheory ? '✅ ' + inspection.package.videoTheory.name : '❌ Chưa có'}`);
  console.log(`   - Video Luyện tập: ${inspection.package.videoPractice ? '✅ ' + inspection.package.videoPractice.name : '❌ Chưa có'}`);
  console.log(`   - Word Lý thuyết: ${inspection.package.docxTheory ? '✅ ' + inspection.package.docxTheory.name : '❌ Chưa có'}`);
  console.log(`   - Word Bài tập áp dụng: ${inspection.package.docxApplied ? '✅ ' + inspection.package.docxApplied.name : '❌ Chưa có'}`);
  console.log(`   - Word Bài tập áp dụng (wed): ${inspection.package.docxAppliedWeb ? '✅ ' + inspection.package.docxAppliedWeb.name : '❌ Chưa có'}`);
  console.log(`   - Word Bài tập luyện tập: ${inspection.package.docxPractice ? '✅ ' + inspection.package.docxPractice.name : '❌ Chưa có'}`);
  console.log(`   - Word Bài tập luyện tập (wed): ${inspection.package.docxPracticeWeb ? '✅ ' + inspection.package.docxPracticeWeb.name : '❌ Chưa có'}`);

  // 3. Đối chiếu Backend / Baseline hiện tại
  let allLessons = [];
  try {
    allLessons = JSON.parse(fs.readFileSync(BAIHOC_PATH, 'utf8'));
  } catch (e) {
    console.warn(`   ⚠️ Không đọc được ${BAIHOC_PATH}: ${e.message}`);
  }

  const num = loc.lessonNum;
  const currentLesson = allLessons.find(l => {
    const m = (l.TenBai || '').match(/B(\d+)\./i);
    return m && parseInt(m[1], 10) === num;
  });

  const prevLesson = allLessons.find(l => {
    const m = (l.TenBai || '').match(/B(\d+)\./i);
    return m && parseInt(m[1], 10) === num - 1;
  });

  const nextLesson = allLessons.find(l => {
    const m = (l.TenBai || '').match(/B(\d+)\./i);
    return m && parseInt(m[1], 10) === num + 1;
  });

  console.log(`\n🧭 3. VỊ TRÍ VÀ LIÊN KẾT BÀI HỌC:`);
  console.log(`   - Bài trước (Buổi ${num - 1}): ${prevLesson ? `${prevLesson.TenBai} (${prevLesson.MaBai})` : 'Không có'}`);
  console.log(`   - Bài này (Buổi ${num}): ${currentLesson ? `${currentLesson.TenBai} (Mã: ${currentLesson.MaBai || 'Chưa cấp'})` : `B${num}. ${loc.lessonDirName}`}`);
  console.log(`   - Bài sau (Buổi ${num + 1}): ${nextLesson ? `${nextLesson.TenBai} (${nextLesson.MaBai})` : 'Chưa khởi tạo'}`);

  // 4. Kế hoạch thực thi 10 bước chuẩn hóa
  console.log(`\n📋 4. KẾ HOẠCH THỰC THI 10 BƯỚC CHUẨN HÓA (EXECUTION PLAN):`);
  console.log(`   [BƯỚC 1] Khảo sát & Đóng gói Manifest: ${inspection.isComplete ? 'SẴN SÀNG' : 'CHƯA ĐỦ FILE'}`);
  console.log(`   [BƯỚC 2] Git & Runbook Preflight: Kiểm tra HEAD, branch riêng codex/publish-lesson-${num}`);
  console.log(`   [BƯỚC 3] Xác minh trực quan Video (OCR/Transcript) & Upload YouTube Unlisted`);
  console.log(`   [BƯỚC 4] Xuất 3 bản PDF từ Word & Upload Google Drive chế độ chia sẻ công khai`);
  console.log(`   [BƯỚC 5] Cập nhật bản ghi gốc Backend Google Sheets / GAS (trạng thái: Draft)`);
  console.log(`   [BƯỚC 6] Nạp 20 câu hỏi trắc nghiệm luyện tập từ file *- wed.docx (Atomic Hash Pipeline)`);
  console.log(`   [BƯỚC 7] Nạp 20 câu dừng video kèm timestamp đã xác thực theo video thật`);
  console.log(`   [BƯỚC 8] Đồng bộ JSON tĩnh, kiểm thử tự động toàn diện (7 Cổng kiểm tra)`);
  console.log(`   [BƯỚC 9] Chốt chặn an toàn Fail-Closed (Dừng ở READY_FOR_TEACHER, Thầy tự duyệt)`);
  console.log(`   [BƯỚC 10] Commit, tạo PR, triển khai GitHub Pages và kiểm tra read-back`);

  // 5. Kết luận Dry-run
  console.log(`\n🛡️ 5. KẾT LUẬN KIỂM ĐỊNH DRY-RUN:`);
  if (!inspection.isComplete) {
    console.log(`   ⚠️ TRẠNG THÁI: TẠM DỪNG Ở BƯỚC CHUẨN BỊ (MANUAL_RECOVERY_REQUIRED)`);
    console.log(`   ⚠️ Lý do: Thiếu ${inspection.missing.length} học liệu bắt buộc:`);
    for (const m of inspection.missing) {
      console.log(`      - ${m}`);
    }
    console.log(`   🔒 HÀNH ĐỘNG AN TOÀN:`);
    console.log(`      - KHÔNG upload YouTube`);
    console.log(`      - KHÔNG upload Google Drive`);
    console.log(`      - KHÔNG ghi backend Google Sheets`);
    console.log(`      - KHÔNG sửa JSON tĩnh hoặc publish website`);
    return {
      success: true,
      readyToPublish: false,
      status: 'MANUAL_RECOVERY_REQUIRED',
      missing: inspection.missing,
      location: loc
    };
  } else {
    console.log(`   ✅ TRẠNG THÁI: HỌC LIỆU NGUỒN HOÀN CHỈNH 100% — SẴN SÀNG TRIỂN KHAI THỰC TẾ.`);
    return {
      success: true,
      readyToPublish: true,
      status: 'READY_FOR_PIPELINE',
      location: loc
    };
  }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'dry-run.mjs') {
  const arg = process.argv[2] || '12';
  runDryRun(arg).catch(e => {
    console.error('Lỗi dry-run:', e);
    process.exit(1);
  });
}
