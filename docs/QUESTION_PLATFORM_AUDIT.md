# BÁO CÁO KHẢO SÁT TOÀN DIỆN NỀN TẢNG CÂU HỎI & HỆ THỐNG THI / LUYỆN TẬP
**Dự án**: Nền tảng Website Vật Lý Xuân Trường (`edu-portal-lms` & `edu-portal-console`)  
**Phiên bản**: Khảo sát & Thiết kế kiến trúc (Machine-1) — Đã cập nhật Quyết định Thiết kế AAC  
**Ngày thực hiện**: 27/08/2026  

---

## 1. Mục tiêu khảo sát
Đánh giá toàn diện hiện trạng ngân hàng câu hỏi, luồng nhập/sửa/xóa của Admin, các tính năng sử dụng câu hỏi của học sinh (Đua Top, Solo, Luyện tập từng bài, Phòng kiểm tra, Phòng thi thử), cấu trúc phân cấp Khóa - Giai đoạn - Chương - Bài, và cơ chế backend Google Apps Script / Google Sheets.

---

## 2. Bản đồ hiện trạng lưu trữ & Luồng dữ liệu câu hỏi

Hiện tại, hệ thống câu hỏi đang bị phân tán trên **4 bảng/luồng dữ liệu riêng biệt**, không có cơ chế liên kết và đồng bộ nhất quán:

```
                          ┌─────────────────────────────────────────────────────────┐
                          │                GOOGLE APPS SCRIPT / SHEETS              │
                          └────────────────────────────┬────────────────────────────┘
                                                       │
         ┌─────────────────────────┬───────────────────┴───────────────┬─────────────────────────┐
         │                         │                                   │                         │
         ▼                         ▼                                   ▼                         ▼
┌──────────────────┐      ┌──────────────────┐                ┌──────────────────┐      ┌──────────────────┐
│ Sheet 'NganHang' │      │ Sheet            │                │ Sheet            │      │ Sheet            │
│                  │      │'BaiTapTracNghiem'│                │ 'VideoCauHoi'    │      │ 'NganHangDe'     │
└────────┬─────────┘      └────────┬─────────┘                └────────┬─────────┘      └────────┬─────────┘
         │                         │                                   │                         │
         │ (type=nganhang)         │ (sync-public-data.mjs)            │ (type=videocauhoi)      │ (type=examquestions)
         ▼                         ▼                                   ▼                         ▼
┌──────────────────┐      ┌─────────────────────────┐         ┌──────────────────┐      ┌──────────────────┐
│ ĐUA TOP / SOLO   │      │ data/quizzes/quiz-*.json│         │ POPUP VIDEO QUIZ │      │ THI THỬ          │
│ (dua-top.html,   │      │ (baihoc.html)           │         │ (baihoc.html)    │      │ (thithu.html,    │
│  solo.html)      │      │                         │         │                  │      │  danhsach-ly12)  │
└──────────────────┘      └─────────────────────────┘         └──────────────────┘      └──────────────────┘
```

### Chi tiết từng kho lưu trữ:

| Tên kho / Bảng | Schema hiện tại | Điểm mạnh | Hạn chế / Vấn đề nghiêm trọng |
| :--- | :--- | :--- | :--- |
| **Sheet `NganHang`** | `id, mon, chuong, mucDo, loai, nhomId, deBaiChung, question, optA, optB, optC, optD, correct, hinhAnh, giaiThich, ngayThem, baiHoc, chatLuong` | Có phân loại sơ bộ theo loại câu (TN, DS, TLN) và mức độ. Hỗ trợ câu chùm qua `nhomId`. | `mon`, `chuong`, `baiHoc` chỉ là text tự do; không có `khoaHoc`, `giaiDoan`, `dangCauHoi` chuẩn. Không có liên kết khóa ngoại với các bài học thực tế. |
| **Sheet `BaiTapTracNghiem`** | `baiKey, thuTu, type, question, optA, optB, optC, optD, correct` | Tách theo từng bài `baiKey`, xuất ra JSON tĩnh `data/quizzes/quiz-*.json` giúp web tải cực nhanh (10-30ms). | Tách rời hoàn toàn với `NganHang`. Nhập câu ở đây không vào `NganHang` và ngược lại. Thiếu trường giải thích chi tiết, nguồn, hình ảnh tách rời. |
| **Sheet `VideoCauHoi`** | `baiKey, thuTu, thoiGian, nhId, type, question, optA, optB, optC, optD, correct` | Gắn câu hỏi xuất hiện tại mốc giây `thoiGian` khi học sinh xem video bài giảng. | Dữ liệu độc lập, nhập thủ công, `nhId` hầu hết bỏ trống, khó tái sử dụng câu hỏi có sẵn. |
| **Sheet `NganHangDe`** | `id, type, question, optA, optB, optC, optD, correct, examId, giaiThich` | Phục vụ các đề thi cố định trong `DanhSachDe` (`thithu.html`). | Khi tạo đề từ Ngân hàng, Admin copy đứt đoạn dữ liệu vào `NganHangDe`. Nếu câu gốc được sửa đáp án/lời giải, câu trong đề không tự cập nhật hoặc ngược lại không có snapshot bất biến. |

---

## 3. Khảo sát chi tiết từng phân hệ học sinh

### 3.1. Chế độ Đua Top (`dua-top.html`)
- **Luồng hoạt động**:
  1. Kiểm tra điều kiện mở khóa: Học sinh cần đạt $\ge 50\text{ LP}$.
  2. Gọi `GET ?type=nganhang` để tải toàn bộ câu hỏi từ Sheet `NganHang`.
  3. Lọc câu trắc nghiệm: `(!q.loai || q.loai === 'TN') && q.optA && q.optB && q.correct`.
  4. Trộn ngẫu nhiên (Fisher-Yates) và sắp xếp ưu tiên câu khó (`VDC` $\to$ `VD` $\to$ `TH` $\to$ `NB`), lấy 20 câu cho mỗi phiên.
  5. Tính điểm theo mức độ nhận thức + chuỗi trả lời đúng (Streak multiplier) + thưởng tốc độ ($\le 30\text{s}$). Điểm cộng vào `saveduatop` lên Bảng Vàng.
- **Nguyên nhân câu hỏi bị lộn xộn & sai chương**:
  - **Không có bộ lọc chương**: Hàm `buildQueue(all)` lấy ngẫu nhiên trên toàn bộ Sheet `NganHang`.
  - Học sinh mới học Chương 1 (Vật lý nhiệt) nhưng hệ thống lấy cả câu của Chương 2 (Khí lý tưởng), Chương 3 (Từ trường), Chương 4 (Hạt nhân), hoặc câu chưa từng được dạy.

### 3.2. Chế độ Solo 1-1 (`solo.html`)
- **Luồng hoạt động**:
  1. Kết nối Firebase Realtime Database (`solo_queue`, `solo_matches`).
  2. Tải toàn bộ ngân hàng câu hỏi qua `GET ?type=nganhang`.
  3. Hàm `pickQuestionIds()` chọn cố định 8 câu cho trận đấu theo quota: `NB: 3, TH: 3, VD: 1, VDC: 1`.
  4. Hai đối thủ trả lời cùng bộ câu hỏi, tính điểm theo tốc độ và độ chính xác; kết thúc gửi kết quả về `savesoloresult`.
- **Nguyên nhân câu hỏi bị lộn xộn & sai chương**:
  - Tương tự Đua Top, việc chọn 8 câu hoàn toàn ngẫu nhiên trên toàn kho, không giới hạn phạm vi chương đang mở.

### 3.3. Luyện tập theo bài học (`baihoc.html`)
- **Luồng hoạt động**:
  1. Tải danh sách bài từ `data/baihoc.json`.
  2. Khi học sinh mở bài, đọc `data/quiz-index.json` để lấy file `data/quizzes/quiz-*.json` tương ứng.
  3. Kiểm tra tiến độ và lưu vào hàng đợi `vlxt_progress_queue_v1` đồng bộ nền về Google Sheets.
- **Hiện trạng dữ liệu**:
  - Trong 43 bài học của Khóa học hiện tại, mới chỉ có **6 bài** có file quiz được xuất bản (`B04e20f0ec67d`, `B0d8e14bf80dd`, `B1036d251af19`, `B3b3bebe2a801`, `Ba7a539a4d488`, `Be5b72ccf1261`). Hàng trăm câu hỏi trong `NganHang` chưa được liên kết tự động vào các bài học còn lại.

### 3.4. Phòng kiểm tra & Phòng thi thử (`danhsach-ly12.html`, `thithu.html`, `phong-thi-thu.html`)
- `danhsach-ly12.html`: Hiển thị danh sách đề kiểm tra định kỳ (đọc `data/danhsachde.json`). Hiện có 2 đề (1 đề 28 câu, 1 đề 0 câu).
- `thithu.html`: Giao diện làm bài thi trắc nghiệm bấm giờ, hỗ trợ cả 3 phần thi theo cấu trúc mới của Bộ GD&ĐT (Phần I: TN 4 lựa chọn, Phần II: Đúng/Sai 4 ý, Phần III: Trả lời ngắn).
- `phong-thi-thu.html`: Mới là trang khung (placeholder), chưa có backend phòng thi thử thời gian thực hay bảng xếp hạng theo đợt thi.

---

## 4. Khảo sát phân hệ Admin Console (`index.html`)

### 4.1. Nhập / Sửa / Xóa câu hỏi trong Ngân hàng
- **Nhập từ file Excel (`.xlsx`)**: Đã có chức năng kéo thả đọc file `Mau_NganHangDe.xlsx`. Tự động chuẩn hóa cột qua `NH_COLMAP`, nhận diện loại câu, đoán chương bằng từ khóa (`guessChuong`), đoán mức độ (`guessMucDo`), và phân loại sư phạm (`classifyTaxonomy`).
- **Nhập từ file Word (`.docx`)**: Đã có `DocxEngine` bóc tách câu hỏi trắc nghiệm, đúng/sai, trả lời ngắn, câu chùm dữ kiện (`nhomId`), ảnh công thức MathType/Wmf.
- **Sửa / Xóa câu hỏi**: Hỗ trợ modal sửa từng câu (`updateNganHang`) và xóa nhiều câu (`deleteNganHang`).
- **Gán bài học hàng loạt (`bulkSetBaiHocNganHang`)**: Đã có popup chọn nhiều câu và gán chuỗi `baiHoc`.
- **Tạo đề thi từ ngân hàng (`bankCreateExam`)**: Cho phép tích chọn các câu trong ngân hàng để xuất bản thành một đề thi mới trong `DanhSachDe` + `NganHangDe`.

### 4.2. Nguyên nhân gốc rễ (Root Causes) khiến câu hỏi bị lộn xộn
1. **Thiếu chuẩn định danh Khóa - Giai đoạn - Chương - Bài thống nhất**:
   - Dữ liệu `KhoaConfig` và `BaiHoc` đang dùng chuỗi tự do có dấu, dễ bị lệch hoa/thường (VD: `CHUYÊN ĐỀ LÝ THUYẾT GĐ1` vs `Chuyên đề lí thuyết GĐ1`).
   - Cột `chuong` trong `NganHang` được gán bằng thuật toán đoán từ khóa (`guessChuong`), dẫn đến nhiều câu bị gán nhầm chương nếu câu hỏi có chứa từ khóa giao thoa giữa các chương.
2. **Không có thiết lập "Phạm vi học tập hiện tại" (Teaching Scope)**:
   - Hệ thống có trường `currentTeachingLesson` trong `Settings` nhưng chỉ dùng để đánh dấu bài đang học trên web, chưa có cấu hình tổng thể:
     - Khóa học đang kích hoạt cho Game (`activeCourseId`).
     - Giai đoạn đang học (`activeStage`: GĐ1, GĐ2, GĐ3).
     - Danh sách tất cả chương đang mở (`activeChapterIds`: ví dụ `['C1_VatLyNhiet']`).
3. **Các chế độ luyện tập (Đua Top, Solo) truy vấn trực tiếp kho thô**:
   - Web học sinh gọi trực tiếp toàn bộ `GET ?type=nganhang` thay vì gọi qua API có tham số lọc theo phạm vi chương đang mở hoặc đọc từ gói JSON snapshot đã qua kiểm duyệt Tinh.

---

## 5. Các Quyết Định Kiến Trúc Đã Được Chốt (Design Principles - AAC)

1. **Teaching Scope tập trung**: Toàn bộ phạm vi giảng dạy (Khóa, Giai đoạn, tất cả Chương đang mở, Bài đang mở) được quản lý tập trung 100% từ Admin Console.
2. **Đua Top & Solo tự động dùng chung Scope**: Tự động lấy câu hỏi thuộc **tất cả các chương đang mở**. Hai chế độ dùng chung pool câu hỏi nhưng có cấu hình phân bố mức độ độc lập (Đua Top tăng tiến theo chuỗi; Solo cố định tỉ lệ 3 NB - 3 TH - 1 VD - 1 VDC).
3. **Bộ lọc Chất lượng Tuyệt đối**: Câu nhập mới mặc định ở trạng thái `Thô` (`tho`). **Câu Thô tuyệt đối không bao giờ xuất hiện cho học sinh** (ở bất kỳ tính năng nào: Đua Top, Solo, Luyện tập, Thi thử). Chỉ câu được duyệt `Tinh` (`da_duyet_tinh`) mới được đóng gói xuất bản.
4. **Hợp nhất Pipeline Nhập liệu**: Cả hai kênh nhập Word (`.docx`) và Excel (`.xlsx`) phải cùng chuẩn hóa và xuất về **một Unified Question Schema duy nhất**, không tạo các luồng dữ liệu phân mảnh.
5. **Tính Bất Biến & Tham Chiếu Đề Thi (Immutable Exam Snapshot)**:
   - Giữ nguyên mã `id` câu hỏi ổn định (immutable question id) khi câu được đưa vào đề hoặc gán vào bài học.
   - Khi xuất bản đề thi, đề thi lưu danh sách tham chiếu `questionId` kèm theo **snapshot nội dung đầy đủ tại thời điểm xuất bản**. Việc chỉnh sửa câu gốc trong ngân hàng sau này sẽ không làm biến đổi đề thi đã làm / đã thi của học sinh.
6. **Điều kiện Tiên Quyết Triển Khai (Gate Check)**: Chưa triển khai code nghiệp vụ cho đến khi nhận schema hoàn chỉnh của Machine-2 và hoàn tất đối chiếu hai phía (Cross-alignment).
