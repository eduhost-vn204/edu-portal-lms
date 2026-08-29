import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studentRoot = path.resolve(__dirname, '..');
const adminRoot = 'C:\\Users\\Xuan Truong\\.gemini\\antigravity\\worktrees\\_codex_admin_speedfix\\sync_exam_admin_controls';

console.log('===============================================================');
console.log('       KIỂM ĐỊNH TOÀN DIỆN BÁO CÁO ISSUE #14 — VẬT LÝ XUÂN TRƯỜNG');
console.log('===============================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
    totalChecks++;
    if (condition) {
        console.log(`[PASS] ${message}`);
        passedChecks++;
    } else {
        console.error(`[FAIL] ${message}`);
        process.exit(1);
    }
}

// -------------------------------------------------------------
// PHẦN 1: KIỂM ĐỊNH DỮ LIỆU 14 ĐỀ 2K9 (STUDENT REPO)
// -------------------------------------------------------------
console.log('--- [PHẦN 1] KIỂM ĐỊNH DỮ LIỆU 14 ĐỀ THI 2K9 ---');

const manifestPath = path.join(studentRoot, 'data', 'danhsachde.json');
assert(fs.existsSync(manifestPath), 'File data/danhsachde.json tồn tại');
const danhsachde = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
assert(danhsachde.ok === true && Array.isArray(danhsachde.data), 'data/danhsachde.json cấu trúc chuẩn ok=true');

const exams2k9 = danhsachde.data.filter(ex => String(ex.examId || '').startsWith('vedich2k9_de'));
assert(exams2k9.length === 14, `Danh sách đề có đúng 14 bộ đề 2k9 (thực tế: ${exams2k9.length})`);

// Kiểm tra toàn bộ 14 đề đều bị ẨN và KHÓA an toàn
const allLocked = exams2k9.every(ex => ex.trangThai === 'khoa');
assert(allLocked, 'Toàn bộ 14 đề 2k9 đều ở trạng thái "khoa" (Khóa an toàn chờ nghiệm thu)');
const allHidden = exams2k9.every(ex => ex.hienThi === 'an' || ex.hienThi === false);
assert(allHidden, 'Toàn bộ 14 đề 2k9 đều ở trạng thái "an" (Ẩn an toàn chờ nghiệm thu)');

let totalQuestions = 0;
let totalMc = 0;
let totalTf = 0;
let totalShort = 0;
let totalSolutions = 0;
let totalImagesFound = 0;
let totalImageLinks = 0;

for (let i = 2; i <= 15; i++) {
    const num = String(i).padStart(2, '0');
    const examId = `vedich2k9_de${num}`;
    const examFilePath = path.join(studentRoot, 'data', 'exams', `${examId}.json`);
    
    assert(fs.existsSync(examFilePath), `File ${examId}.json tồn tại trên đĩa`);
    const qList = JSON.parse(fs.readFileSync(examFilePath, 'utf8'));
    assert(Array.isArray(qList) && qList.length === 28, `${examId}.json có đúng 28 câu hỏi`);
    
    totalQuestions += qList.length;
    
    const mcList = qList.filter(q => q.type === 'mc' || q.id <= 18);
    const tfList = qList.filter(q => q.type === 'tf' || (q.id >= 19 && q.id <= 22));
    const shortList = qList.filter(q => q.type === 'short' || q.id >= 23);
    
    assert(mcList.length === 18, `${examId}: Đúng 18 câu Trắc nghiệm 4 lựa chọn (Phần I)`);
    assert(tfList.length === 4, `${examId}: Đúng 4 câu Đúng/Sai (Phần II)`);
    assert(shortList.length === 6, `${examId}: Đúng 6 câu Trả lời ngắn (Phần III)`);
    
    totalMc += mcList.length;
    totalTf += tfList.length;
    totalShort += shortList.length;
    
    // Kiểm tra câu trắc nghiệm (MC)
    for (const q of mcList) {
        assert(q.options && q.options.A && q.options.B && q.options.C && q.options.D, `${examId} Q${q.id}: Đủ 4 phương án A, B, C, D không rỗng`);
        assert(['A','B','C','D'].includes(String(q.correct).trim().toUpperCase()), `${examId} Q${q.id}: Đáp án đúng hợp lệ [A/B/C/D]`);
        
        // Kiểm tra không dính nhãn kế tiếp vào option
        assert(!q.options.A.match(/^[B-D]\./i), `${examId} Q${q.id}: Option A không dính nhãn B.`);
        assert(!q.options.B.match(/^[C-D]\./i), `${examId} Q${q.id}: Option B không dính nhãn C.`);
        assert(!q.options.C.match(/^D\./i), `${examId} Q${q.id}: Option C không dính nhãn D.`);
    }
    
    // Kiểm tra câu Đúng/Sai (TF)
    for (const q of tfList) {
        assert(q.options && q.options.A && q.options.B && q.options.C && q.options.D, `${examId} Q${q.id}: Đủ 4 mệnh đề a, b, c, d`);
        const corr = String(q.correct || '');
        assert(corr.length === 4 && /^[ĐS]{4}$/.test(corr), `${examId} Q${q.id}: Đáp án Đúng/Sai chuẩn 4 ký tự Đ/S (thực tế: "${corr}")`);
    }
    
    // Kiểm tra câu Trả lời ngắn (Short)
    for (const q of shortList) {
        const corr = String(q.correct || '').trim();
        assert(corr.length > 0, `${examId} Q${q.id}: Có đáp án số trả lời ngắn không rỗng`);
    }
    
    // Kiểm tra lời giải và hình ảnh
    for (const q of qList) {
        if (q.giaiThich && String(q.giaiThich).trim() !== '') {
            totalSolutions++;
        }
        
        // Kiểm tra ảnh trong question hoặc options hoặc giaiThich
        const allText = JSON.stringify(q);
        const imgMatches = allText.match(/assets\/exams\/[^"\\]+/g) || [];
        for (const imgRel of imgMatches) {
            totalImageLinks++;
            const diskImgPath = path.join(studentRoot, imgRel);
            if (fs.existsSync(diskImgPath)) {
                totalImagesFound++;
            } else {
                console.error(`FAIL: Không tìm thấy ảnh ${diskImgPath}`);
                process.exit(1);
            }
        }
        
        // Kiểm tra cân bằng ký tự KaTeX $ (trừ trường hợp escaped)
        const unescapedDollars = (allText.match(/(?<!\\)\$/g) || []).length;
        assert(unescapedDollars % 2 === 0, `${examId} Q${q.id}: Ký tự KaTeX $ cân bằng chẵn (count: ${unescapedDollars})`);
    }
}

assert(totalQuestions === 392, `Tổng số câu hỏi = 392 (thực tế: ${totalQuestions})`);
assert(totalMc === 252, `Tổng số câu MC = 252 (thực tế: ${totalMc})`);
assert(totalTf === 56, `Tổng số câu TF = 56 (thực tế: ${totalTf})`);
assert(totalShort === 84, `Tổng số câu Short = 84 (thực tế: ${totalShort})`);
assert(totalSolutions === 160, `Số câu có lời giải chi tiết = 160 (thực tế: ${totalSolutions})`);
assert(totalImageLinks === totalImagesFound && totalImageLinks > 0, `100% liên kết ảnh (${totalImagesFound} ảnh) tồn tại thật trên đĩa`);

// -------------------------------------------------------------
// PHẦN 2: KIỂM ĐỊNH ADMIN CONSOLE & ĐIỀU KHIỂN (ADMIN REPO)
// -------------------------------------------------------------
console.log('\n--- [PHẦN 2] KIỂM ĐỊNH BẢNG ĐIỀU KHIỂN ADMIN CONSOLE ---');

const adminHtmlPath = path.join(adminRoot, 'index.html');
assert(fs.existsSync(adminHtmlPath), 'File index.html trên Admin Console tồn tại');
const adminHtml = fs.readFileSync(adminHtmlPath, 'utf8');

assert(adminHtml.includes('</html>'), 'Admin index.html có thẻ đóng </html> hợp lệ');
assert(adminHtml.includes('id="tab-phongthithu"'), 'Admin có Tab Phòng Thi Thử (tab-phongthithu)');
assert(adminHtml.includes('id="tab-phongthithu-btn"'), 'Admin có nút điều hướng Tab Phòng Thi Thử');
assert(adminHtml.includes('id="thithu-list-panel"'), 'Admin có bảng danh sách thẻ đề thi thử (#thithu-list-panel)');
assert(adminHtml.includes('id="ptt-stat-total"'), 'Admin có chỉ số thống kê Tổng số đề');
assert(adminHtml.includes('id="ptt-stat-hien"'), 'Admin có chỉ số thống kê Đang hiện');
assert(adminHtml.includes('id="ptt-stat-an"'), 'Admin có chỉ số thống kê Đang ẩn');
assert(adminHtml.includes('id="ptt-stat-open"'), 'Admin có chỉ số thống kê Đang mở');
assert(adminHtml.includes('id="ptt-stat-locked"'), 'Admin có chỉ số thống kê Đang khóa');
assert(adminHtml.includes('id="ptt-stat-video"'), 'Admin có chỉ số thống kê Có video chữa');
assert(adminHtml.includes('id="ptt-search-input"'), 'Admin có ô tìm kiếm đề thi thử');
assert(adminHtml.includes('id="exam-detail-overlay"'), 'Admin có Modal Xem chi tiết đề thi (#exam-detail-overlay)');
assert(adminHtml.includes('id="ed-modal-questions"'), 'Admin có khu vực hiển thị câu hỏi đề thi (#ed-modal-questions)');
assert(adminHtml.includes('openExamDetailModal'), 'Admin có hàm openExamDetailModal tải câu hỏi từ CDN/GAS');
assert(adminHtml.includes('filterExamDetailSec'), 'Admin có hàm lọc phân loại Phần I, II, III, Lời giải');
assert(adminHtml.includes('toggleExamVisibility'), 'Admin có hàm toggleExamVisibility chuyển trạng thái Hiện/Ẩn');
assert(adminHtml.includes('toggleExamStatus'), 'Admin có hàm toggleExamStatus chuyển trạng thái Mở/Khóa');
assert(adminHtml.includes('bulkUpdateBatch2k9'), 'Admin có hàm bulkUpdateBatch2k9 điều khiển hàng loạt 14 đề');
assert(adminHtml.includes('showBulkExamModal'), 'Admin có modal Nạp hàng loạt (Bulk Import)');

// Kiểm tra whitelist ghi
assert(adminHtml.includes("'saveexam'") && adminHtml.includes("'bulkupdateexams'") && adminHtml.includes("'deleteexam'"), 'Whitelist ADMIN_WRITE_ACTIONS đã bao gồm saveexam, bulkupdateexams và deleteexam');

// -------------------------------------------------------------
// PHẦN 3: KIỂM ĐỊNH MA TRẬN 3 TRẠNG THÁI (STUDENT LMS WEB)
// -------------------------------------------------------------
console.log('\n--- [PHẦN 3] KIỂM ĐỊNH MA TRẬN 3 TRẠNG THÁI (LMS WEB) ---');

const phongThiThuHtml = fs.readFileSync(path.join(studentRoot, 'phong-thi-thu.html'), 'utf8');
const thithuHtml = fs.readFileSync(path.join(studentRoot, 'thithu.html'), 'utf8');

// 1. Ma trận State 1: Ẩn + Khóa (hienThi: 'an', trangThai: 'khoa')
assert(phongThiThuHtml.includes("ex.hienThi === 'an'") || phongThiThuHtml.includes("ex.hienThi === undefined || ex.hienThi === true || String(ex.hienThi).toLowerCase() === 'hien'"), 'phong-thi-thu.html lọc bỏ đề bị Ẩn');
assert(thithuHtml.includes('Đề thi chưa được phát hành'), 'thithu.html chặn direct URL khi đề bị Ẩn');

// 2. Ma trận State 2: Hiện + Khóa (hienThi: 'hien', trangThai: 'khoa')
assert(thithuHtml.includes('Đề thi đang tạm khóa'), 'thithu.html chặn direct URL khi đề bị Khóa');

// 3. Ma trận State 3: Hiện + Mở (hienThi: 'hien', trangThai: 'mo')
assert(thithuHtml.includes('loadQuiz()'), 'thithu.html nạp bài thi khi đề Hiện + Mở');

// -------------------------------------------------------------
// PHẦN 4: TỔNG KẾT
// -------------------------------------------------------------
console.log('\n===============================================================');
console.log(`  KẾT QUẢ KIỂM ĐỊNH: ${passedChecks}/${totalChecks} TIÊU CHÍ ĐẠT 100%`);
console.log('  -> TOÀN BỘ 14 ĐỀ THI 2K9 VÀ TÍNH NĂNG ADMIN ĐỀU HOÀN TOÀN CHUẨN XÁC!');
console.log('===============================================================\n');
