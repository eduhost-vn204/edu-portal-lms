# BẢNG CHECKLIST ĐỐI SOÁT & NGHIỆM THU PHÁT HÀNH BÀI HỌC XPS 2K9

Áp dụng cho mọi bài học triển khai trên hệ thống Vật Lý Xuân Trường.

---

## 1. Bảng 7 Cổng Kiểm Tra Bắt Buộc (Automated Gates)

| Cổng | Tiêu chí nghiệm thu | Phương pháp kiểm tra | Điều kiện ĐẠT | Hành động khi lỗi |
| :---: | :--- | :--- | :--- | :--- |
| **Cổng 1** | **Đúng bài & Metadata** | Đối chiếu `TenBai`, `MaBai`, `Chuong`, `KhoaHoc`, `ThuTuBai` trong backend và `data/baihoc.json` | `TenBai` chứa `B{N}.`, `MaBai` định danh chuẩn, thứ tự buổi học ổn định | Dừng ngay, không tạo bài trùng lặp |
| **Cổng 2** | **Đúng 2 Video YouTube** | Trích xuất video ID, kiểm tra oEmbed HTTP 200, so khớp nội dung MP4 nguồn qua OCR slide/bóc băng | 2 video Unlisted riêng biệt (1 Lý thuyết, 1 Chữa bài), xem được, không Private | Dừng, không upload link rác |
| **Cổng 3** | **Đúng 3 File PDF Drive** | Kiểm tra quyền xem công khai (`Anyone with the link can view`), dung lượng > 50KB | Đủ 3 link Drive: Bản Lí thuyết, Bài tập áp dụng, Bài tập luyện tập | Xuất lại PDF từ Word và upload lại |
| **Cổng 4** | **20 câu Dừng video** | Đọc bảng `VideoCauHoi` từ backend, kiểm tra mốc thời gian tăng dần | Đủ 20 câu hỏi áp dụng, timestamp khớp chính xác khung hình slide bài giảng | Lập lại bảng timestamp từ video thật |
| **Cổng 5** | **20 câu Luyện tập** | Pipeline `quiz-publish.mjs` hash content-addressed | `data/quizzes/quiz-*.json` đủ 20 câu, `quiz-index.json` count = 20, web hiện `(20)` | Chạy lại pipeline gộp quiz atomic |
| **Cổng 6** | **Bảo vệ bài lân cận** | So sánh snapshot `data/quiz-index.json` và `data/baihoc.json` các bài khác | Bài 10 (`B557b8fccbc72`), Bài 11 (`B4ca24b64572f`)... giữ nguyên 100% | Rollback ngay từ snapshot |
| **Cổng 7** | **Read-back Production** | Fetch HTTP thực tế từ CDN/GitHub Pages sau khi deploy | `quiz-index.json` trả count 20, file quiz tải HTTP 200, giao diện học sinh hiển thị tab `(20)` | Kích hoạt deploy Pages lại |

---

## 2. Quy trình Thực hiện 10 Bước Chuẩn Hóa

```text
[BƯỚC 1] Nhận lệnh "Đăng bài N đi" -> Dò tìm thư mục nguồn theo quy chuẩn
   ↓
[BƯỚC 2] Git & Runbook Preflight: fetch origin/main, checkout nhánh riêng, kiểm tra bài trước/sau
   ↓
[BƯỚC 3] Kiểm tra trực quan 2 video MP4 nguồn -> Upload YouTube Unlisted (Lý thuyết + Luyện tập)
   ↓
[BƯỚC 4] Xuất 3 PDF từ 3 file Word -> Upload Google Drive (Share Public)
   ↓
[BƯỚC 5] Cập nhật bản ghi gốc Backend Google Sheets / GAS (trạng thái: Draft)
   ↓
[BƯỚC 6] Nạp 20 câu trắc nghiệm luyện tập từ file *- wed.docx -> Sinh quiz content-addressed hash
   ↓
[BƯỚC 7] Nạp 20 câu dừng video từ bài tập áp dụng -> Gắn timestamp khớp video thật
   ↓
[BƯỚC 8] Đồng bộ JSON tĩnh (sync-public-data.mjs) & Chạy kiểm thử 7 cổng nghiệm thu
   ↓
[BƯỚC 9] DỪNG TẠI READY_FOR_TEACHER (Giữ Draft, bảo toàn bài khác, Thầy tự kiểm tra trên Admin UI)
   ↓
[BƯỚC 10] Khi Thầy duyệt Publish: Commit, tạo PR, triển khai GitHub Pages & Read-back URL thật
```
