# SỔ TAY CÁC BẪY THƯỜNG GẶP & XỬ LÝ SỰ CỐ (FAILURE MODES)

Tài liệu đúc kết từ thực tiễn khắc phục sự cố Bài 10, Bài 11 trên hệ thống Vật Lý Xuân Trường.

---

## 1. Bẫy Nhầm Video / Video Pilot Cũ
- **Hiện tượng**: Học sinh mở bài N nhưng video phát nội dung bài N-1 (ví dụ Bài 11 phát video Bài 10).
- **Nguyên nhân**: Dùng lại template hoặc script pilot gán cứng ID video cũ, hoặc upload nhầm file MP4.
- **Biện pháp phòng ngừa bắt buộc**:
  - Trích xuất khung hình đầu, giữa, cuối bằng `ffmpeg` hoặc kiểm tra OCR slide tiêu đề bài giảng trước khi upload.
  - So sánh thời lượng MP4 nguồn với thời lượng YouTube trả về sau upload (sai số < 2 giây).
  - Đối chiếu tên file MP4 gốc: `Bài {N}. Lý thuyết.mp4` và `Bài {N}. Luyện tập .mp4`.

---

## 2. Bẫy Lệch Số Lượng Câu Hỏi Quiz (Ví dụ web hiện 3 thay vì 20)
- **Hiện tượng**: Bảng `BaiTapTracNghiem` trên GAS có 20 câu, nhưng file tĩnh `quiz-index.json` chỉ ghi `count: 3` và web hiển thị `Luyện tập trắc nghiệm (3)`.
- **Nguyên nhân**:
  - Khi script đồng bộ định kỳ (`sync-public-data.mjs`) chạy trên GitHub Actions, lúc đó GAS đang trong quá trình ghi dở hoặc cache trả về tập dòng chưa đầy đủ.
  - Tự ý ghi đè file `quiz-index.json` mà không qua pipeline kiểm soát atomic.
- **Biện pháp khắc phục**:
  - Chạy pipeline chuẩn qua `scripts/quiz-publish.mjs` (`planQuizPublish` + `applyQuizPublishPlan`).
  - Pipeline tự động sinh file content-addressed hash theo cả khóa và nội dung (`quiz-<20-hex-chars>.json`).
  - Chỉ cutover index khi file quiz mới đã ghi đầy đủ và kiểm tra khớp byte-for-byte.

---

## 3. Bẫy Tự Ý Đổi Trạng Thái Sang Published
- **Hiện tượng**: AI tự động gửi payload `TrangThai: 'published'` hoặc đưa bài vào `data/baihoc.json` khi Thầy chưa nghiệm thu.
- **Nguyên nhân**: AI muốn "hoàn tất sớm" nhiệm vụ.
- **Ràng buộc kỷ luật**:
  - **TUYỆT ĐỐI KHÔNG TỰ PUBLISH**: Bài học mới đưa lên backend BẮT BUỘC để trạng thái `draft`.
  - Quyền đổi sang `Published` và bấm nút xuất bản thuộc về **duy nhất Thầy Xuân Trường** thao tác trực tiếp trên giao diện Admin Console (`https://eduhost-vn204.github.io/edu-portal-console/`).
  - Khi chưa có chỉ thị rõ ràng của Thầy, AI chỉ được dừng ở trạng thái `READY_FOR_TEACHER`.

---

## 4. Bẫy Lệch Thứ Tự Buổi Học Học Sinh
- **Hiện tượng**: Khi ẩn bài N (Draft), bài N+1 bị nhảy số buổi (ví dụ B12 bị đổi thành Buổi 11).
- **Nguyên nhân**: Giao diện tính số buổi bằng index tuần tự mảng sau khi lọc Draft.
- **Biện pháp**: Hệ thống đã chuẩn hóa hàm `getLessonSessionNum(l, fallbackIndex)` trích xuất trực tiếp số định danh từ `TenBai` (B12 $\rightarrow$ Buổi 12 bất kể có bài Draft phía trước). Bộ kiểm thử `test-student-stable-session-num.mjs` phải luôn đạt 8/8 PASS.
