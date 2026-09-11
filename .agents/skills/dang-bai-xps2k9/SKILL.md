---
name: dang-bai-xps2k9
description: >-
  Quy trình tự động hóa phát hành bài học chuẩn XPS 2k9 lên website Vật Lý Xuân Trường:
  tự nhận diện thư mục học liệu từ lệnh ngắn ("Đăng bài N đi"), thực hiện đầy đủ 10 bước
  chuẩn hóa (2 video MP4 YouTube unlisted, 3 PDF Drive, 20 câu dừng video kèm timestamp thật,
  20 câu trắc nghiệm luyện tập hash content-addressed web hiện 20), kiểm thử tự động 7 cổng
  và bàn giao an toàn ở trạng thái Draft cho Thầy nghiệm thu.
---

# Quy Trình Phát Hành Bài Học XPS 2K9 (dang-bai-xps2k9)

Skill này đóng gói toàn bộ quy trình công nghệ và quy chuẩn nghiệm thu thực tế đã được kiểm định từ Bài 10 và Bài 11, áp dụng cho việc phát hành các bài học tiếp theo (Bài 12, Bài 13...) thuộc lộ trình **GĐ1 - Chuyên đề Lý thuyết** môn Vật Lý 12.

---

## 1. Cơ Chế Nhận Lệnh & Tự Động Suy Đoán Thư Mục Nguồn

### Câu lệnh kích hoạt (Triggers):
- `"Đăng bài 12 đi"`
- `"Đăng bài 13 đi"`
- `"Đăng bài N đi"` (với N là số bài học: 1, 2, 3...)
- `"dry-run bài N"` hoặc `"chạy thử bài N"`

### Quy tắc suy luận đường dẫn nguồn:
Khi nhận lệnh, skill tự động chạy script:
```powershell
node .agents/skills/dang-bai-xps2k9/scripts/resolve-lesson-source.mjs <N>
```
Script sẽ quét cây thư mục gốc:
`D:\Work\Dạy học\Xây Dựng Lộ Trình XPS 2k9\Triển khai\GĐ1 - Chuyên đề Lý thuyết\`
qua tất cả các thư mục `Chương X\` để tìm thư mục bài học có tên dạng:
`Bài N - [Tên bài học]` hoặc `Bai N - [Tên bài học]`.

---

## 2. Quy Trình 10 Bước Phát Hành Chuẩn Hóa

### Bước 1: Khảo sát học liệu nguồn & Kiểm tra đủ 7 file
Mỗi bài học chuẩn phải có đủ 7 file học liệu trong thư mục nguồn:
1. `Bài N. Lý thuyết.mp4`: Video bài giảng lý thuyết và hướng dẫn bài tập áp dụng.
2. `Bài N. Luyện tập .mp4`: Video giáo viên chữa chi tiết bài tập luyện tập.
3. `Bai N - ... - Ban Lí thuyết.docx`: File Word bài giảng lý thuyết.
4. `Bai N - ... - Bài tập áp dụng.docx`: File Word bài tập áp dụng (có đáp án/lời giải).
5. `Bai N - ... - Bài tập áp dụng - wed.docx`: File Word trắc nghiệm áp dụng chuẩn web.
6. `Bai N - ... - Bài tập luyện tập.docx`: File Word bài tập luyện tập (kèm lời giải chi tiết).
7. `Bai N - ... - Bài tập luyện tập - wed.docx`: File Word 20 câu trắc nghiệm luyện tập chuẩn web (có dấu sao `*` đáp án).

> [!CAUTION]
> Nếu thiếu bất kỳ file nào trong 7 file trên, pipeline **DỪNG NGAY LẬP TỨC** ở trạng thái `MANUAL_RECOVERY_REQUIRED`. Tuyệt đối không đoán, không lấy học liệu bài khác đắp vào.

### Bước 2: Kiểm tra tiền trạm (Preflight Checks)
1. `git fetch origin main` và so sánh `HEAD` với `origin/main`.
2. Đọc `PROJECT_STATE.md` và `AI_RUNBOOK.md`.
3. Tạo nhánh riêng: `codex/publish-lesson-{N}` bắt đầu từ `origin/main`.
4. Xác định vị trí bài trước (Buổi N-1) và bài sau (Buổi N+1) trong `data/baihoc.json` để đảm bảo thứ tự chương và số buổi ổn định.

### Bước 3: Xác minh trực quan 2 Video MP4 & Upload YouTube
1. **Kiểm tra trực quan chống nhầm bài**:
   - Trích xuất khung hình đầu (giây thứ 10), giữa (phút thứ 10, 20) và cuối video.
   - Dùng OCR hoặc đọc slide để đảm bảo tiêu đề ghi rõ `Bài N: [Tên bài]`.
   - So khớp thời lượng video với nội dung bài học.
2. **Upload YouTube (Unlisted)**:
   - Upload Video Lý thuyết $\rightarrow$ Lấy URL dạng `https://www.youtube.com/watch?v={ID1}`.
   - Upload Video Chữa bài $\rightarrow$ Lấy URL dạng `https://www.youtube.com/watch?v={ID2}`.
   - Kiểm tra cả 2 URL trả HTTP 200 qua oEmbed API, trạng thái Unlisted, không bị cờ Private.

### Bước 4: Xuất 3 bản PDF từ Word & Upload Google Drive
1. Tự động xuất 3 file PDF từ Word bằng Word Interop:
   - `PDFLyThuyet`: Xuất từ `*Ban Lí thuyết.docx`.
   - `PDF`: Xuất từ `*Bài tập áp dụng.docx`.
   - `PDFLuyenTap`: Xuất từ `*Bài tập luyện tập.docx`.
2. Upload lên Google Drive chính thức, cấu hình quyền chia sẻ: `Anyone with the link can view`.
3. Lấy 3 URL Google Drive có định dạng chuẩn: `https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing`.

### Bước 5: Cập nhật dữ liệu gốc Backend (Google Apps Script / Sheets)
Cập nhật bảng ghi `BaiHoc` trên backend (Google Sheets thông qua Apps Script endpoint):
- `KhoaHoc`: Khóa học tương ứng (vd: `CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12`).
- `Chuong`: Tên chương (vd: `Chương 2 – Khí lí tưởng`).
- `TenBai`: `B{N}. [TÊN BÀI VIẾT HOA]`.
- `MoTaBai`: Tóm tắt nội dung trọng tâm (sạch sẽ, không chứa nhãn pilot).
- `Video`: Link YouTube Video Lý thuyết.
- `VideoGiai`: Link YouTube Video Chữa bài.
- `PDFLyThuyet`, `PDF`, `PDFLuyenTap`: 3 Link Google Drive tương ứng.
- `TrangThai`: **`draft`** *(BẮT BUỘC để draft, không tự publish)*.

### Bước 6: Nạp 20 câu trắc nghiệm luyện tập (Atomic Hash Pipeline)
1. Đọc đúng 20 câu hỏi từ file `*Bài tập luyện tập - wed.docx`.
2. Đối soát thứ tự 1–20, 4 phương án A, B, C, D và đáp án đúng.
3. Chạy pipeline `scripts/quiz-publish.mjs` (`planQuizPublish` + `applyQuizPublishPlan`):
   - Sinh file content-addressed hash: `data/quizzes/quiz-[0-9a-f]{20}.json` gồm đúng 20 câu.
   - Cập nhật `data/quiz-index.json` entry của bài trỏ tới file mới với `count: 20`.
   - Đảm bảo website hiển thị đúng `Luyện tập trắc nghiệm (20)`.

### Bước 7: Nạp 20 câu hỏi dừng video kèm Timestamp thật
1. Đọc đúng 20 câu bài tập áp dụng từ file `*Bài tập áp dụng - wed.docx`.
2. Đối chiếu trực tiếp trên video bài giảng để xác định chính xác giây xuất hiện của từng câu (từ câu 1 đến câu 20). Mốc thời gian phải tăng dần tuần tự.
3. Nạp vào bảng `VideoCauHoi` trên backend theo cấu trúc chuẩn: `MaBai`, `ThuTu`, `ThoiGian`, `CauHoi`, `OptA`, `OptB`, `OptC`, `OptD`, `DapAn`.

### Bước 8: Đồng bộ JSON tĩnh & Chạy kiểm thử 7 cổng nghiệm thu
1. Chạy đồng bộ:
   ```powershell
   node scripts/sync-public-data.mjs
   ```
2. Chạy bộ kiểm thử tự động 7 cổng:
   ```powershell
   node .agents/skills/dang-bai-xps2k9/scripts/test-lesson-checklist.mjs <N> --live
   ```
   - Cổng 1: Đúng bài & metadata.
   - Cổng 2: Đúng 2 video YouTube riêng biệt.
   - Cổng 3: Đúng 3 file PDF Google Drive mở được.
   - Cổng 4: Đúng 20 câu dừng video kèm timestamp.
   - Cổng 5: Đúng 20 câu trắc nghiệm luyện tập, count 20.
   - Cổng 6: Không ảnh hưởng bài khác (Bài 10, Bài 11... giữ nguyên 100%).
   - Cổng 7: Read-back production HTTP 200.

### Bước 9: Chốt chặn an toàn (Fail-Closed & Stop)
- Dừng quy trình ở trạng thái **`READY_FOR_TEACHER`**.
- Bài học được giữ ở trạng thái `draft` để học sinh công khai không thấy bài trước khi Thầy duyệt.
- Thầy tự mở Admin Console (`https://eduhost-vn204.github.io/edu-portal-console/`), kiểm tra 2 video, 3 PDF, 20 câu dừng video, 20 câu luyện tập.

### Bước 10: Commit, PR, Deploy & Báo cáo
1. Commit trên nhánh riêng với mô tả chuẩn Conventional Commits.
2. Tạo Pull Request vào `main`.
3. Khi Thầy duyệt và đổi trạng thái bài học sang `published`, workflow `refresh-data.yml` và `deploy.yml` sẽ tự động deploy lên GitHub Pages.
4. Báo cáo chi tiết: URL 2 video, URL 3 PDF, bảng 20 timestamp câu hỏi dừng video, read-back JSON index và ảnh chụp giao diện hoàn chỉnh.

---

## 3. Chế Độ Dry-Run (Chạy Thử An Toàn)

Khi Thầy hoặc người dùng yêu cầu:
`"Chạy thử bài 12"`, `"Dry-run bài 12"`, hoặc khi chỉ muốn lập kế hoạch mà không ghi dữ liệu:
Chạy lệnh:
```powershell
node .agents/skills/dang-bai-xps2k9/scripts/dry-run.mjs <N>
```
Script sẽ:
1. Dò tìm và định danh thư mục học liệu Bài N.
2. Kiểm kê danh sách file hiện có và danh sách file còn thiếu.
3. Đối chiếu bài trước, bài này, bài sau.
4. Lập bản kế hoạch 10 bước chi tiết.
5. **Tuyệt đối KHÔNG upload, KHÔNG ghi backend, KHÔNG publish.**
