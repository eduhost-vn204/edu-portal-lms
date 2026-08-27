# HỒ SƠ QUYẾT ĐỊNH KIẾN TRÚC: SCHEMA V2.1 (SDR-V2.1)
**Dự án**: Nền tảng Website Vật Lý Xuân Trường & Content Studio  
**Mã hồ sơ**: `SDR-2026-08-27-SCHEMA-V2.1`  
**Các bên tham gia**: MACHINE-1 (Production Owner - Web Platform), MACHINE-2 (Content Studio)  
**Trạng thái**: **APPROVED WITH CONDITIONS (ĐÃ DUYỆT CÓ ĐIỀU KIỆN)**  
**Ngày ban hành**: 27/08/2026  

---

## 1. Bối Cảnh & Vấn Đề (Context & Problem Statement)

Trước vòng Gate Check v2.1, hệ thống câu hỏi của Vật Lý Xuân Trường gặp phải các vấn đề:
1. **Phân mảnh dữ liệu**: Câu hỏi bị phân tán trên 4 Sheet (`NganHang`, `BaiTapTracNghiem`, `VideoCauHoi`, `NganHangDe`) với cấu trúc khác nhau.
2. **Câu hỏi lộn xộn ở Đua Top & Solo**: Không có bộ lọc theo tiến độ học, học sinh Chương 1 bị bốc ngẫu nhiên câu hỏi của Chương 2, 3, 4 hoặc câu lớp khác.
3. **Nguy cơ lọt câu chưa kiểm duyệt**: Chưa có cơ chế phân tầng Thô/Tinh nghiêm ngặt, câu vừa bóc tách từ tài liệu nguồn có nguy cơ lọt thẳng ra web học sinh.
4. **Sửa câu gốc làm biến dạng đề thi cũ**: Chưa có cơ chế Snapshot đề thi bất biến tại thời điểm xuất bản.

---

## 2. Các Quyết Định Kiến Trúc Được Ký Duyệt (Architecture Decisions)

### Quyết định 1: Cơ Chế Phân Tầng Thô / Tinh 2 Cấp (Two-Tier Raw/Refined Workflow)
- **Quyết định**: Mọi câu hỏi mới bóc tách từ Word/Excel/Studio mặc định có `rawTier = "THO"` (`status = "DRAFT"` hoặc `"QA_PASSED"`).
- **Ràng buộc tuyệt đối**: **Câu Thô tuyệt đối không bao giờ được xuất hiện cho học sinh** ở bất kỳ phân hệ nào (`MOCK_EXAM_THPTQG`, `DUA_TOP_FAST_QUIZ`, `SOLO_PVP`, `EXERCISE_BANK`).
- **Quyền hạn**: Chỉ Thầy Xuân Trường sau khi xem xét và bấm *"Duyệt Tinh"* trên Admin Console thì câu hỏi mới chuyển sang `rawTier = "TINH"` (`status = "TEACHER_APPROVED"` hoặc `"PUBLISHED"`) và được đưa vào phạm vi xuất bản.

### Quyết định 2: Quản Lý Teaching Scope Tập Trung & Gộp Tất Cả Chương Mở Cho Game
- **Quyết định**: Thầy điều khiển toàn bộ tiến độ giảng dạy qua thanh `Teaching Scope Bar` trên Admin Console (Khóa học, Giai đoạn, các Chương đang mở, Bài đang mở).
- **Quy tắc Game**: Đua Top và Solo tự động dùng chung tập câu hỏi thuộc **tất cả các chương đang mở**.
- **Cấu hình độ khó độc lập**:
  - Đua Top: Tăng tiến độ khó theo chuỗi đúng (Streak Multiplier) + Thưởng tốc độ ($\le 30\text{s}$).
  - Solo 1-1: Phân bổ cố định 8 câu/trận theo tỷ lệ 3 Nhận biết + 3 Thông hiểu + 1 Vận dụng + 1 Vận dụng cao.

### Quyết định 3: Hợp Nhất Pipeline Word & Excel Về Một Unified Schema
- **Quyết định**: Không duy trì 2 pipeline dữ liệu riêng biệt. Cả hai kênh nhập Word (`.docx` qua `DocxEngine`) và Excel (`.xlsx` qua `Mau_NganHang_v2.xlsx`) đều được chuẩn hóa về cùng một **Canonical Question Schema v2.1** (29 trường ánh xạ).

### Quyết định 4: Tính Bất Biến của ID Câu Hỏi & Snapshot Đề Thi Bất Biến (Immutable Exam Snapshot)
- **Quyết định**:
  - Mã định danh `id` câu hỏi (dạng `VLXT-G12-C1-B01-Q0001`) là bất biến sau khi phát hành.
  - Khi xuất bản đề thi, đề thi lưu mảng tham chiếu `questionRefs` kèm **bản chụp toàn văn `questionsSnapshot`**. Việc chỉnh sửa câu gốc trong ngân hàng sau này hoàn toàn không ảnh hưởng đến lịch sử làm bài và đề thi đã hoàn thành của học sinh.

### Quyết định 5: Chiến Lược 2 Cấp Hash (contentIdentityHash vs revisionHash)
- **Quyết định**:
  - `contentIdentityHash`: Băm composite payload gồm `type` + `stem` + `options/subItems` + `parentIntroText` (nếu là câu con) + `dapAn` + `mediaAssetHashes`. Dùng để chống nạp trùng lặp chính xác giữa các tài liệu.
  - `revisionHash`: Băm toàn bộ JSON Canonical để phát hiện mọi thay đổi siêu dữ liệu và tự động tăng `version`.

### Quyết định 6: Toàn Vẹn Quan Hệ 2 Chiều Cho QUESTION_GROUP
- **Quyết định**: Nhóm câu hỏi chùm `QUESTION_GROUP` phải bảo toàn `introText` ngữ cảnh chung và liên kết 2 chiều chặt chẽ:
  - Nhóm cha lưu mảng `childQuestionIds`.
  - Các câu con lưu `parentId` trỏ ngược lại nhóm cha.
  - Bắt buộc kiểm thử không có tham chiếu rác, không có sai lệch parentId và không có vòng lặp circular reference.

---

## 3. Phân Công Trách Nhiệm Sprint Triển Khai (Work Breakdown)

```
┌──────────────────────────────────────────────┐    ┌──────────────────────────────────────────────┐
│        MACHINE-2 (CONTENT STUDIO)            │    │        MACHINE-1 (WEBSITE & LMS)             │
├──────────────────────────────────────────────┤    ├──────────────────────────────────────────────┤
│ 1. Cập nhật `compute_content_hash` sang      │    │ 1. Nâng cấp bảng Sheets `NganHang` 29 cột.   │
│    `contentIdentityHash` đa thành phần.      │    │ 2. Xây dựng `Teaching Scope Bar` trên Admin. │
│ 2. Hoàn thiện `DocxEngine` & `XlsxEngine`    │    │ 3. Triển khai Modal Duyệt Tinh hàng loạt.    │
│    xuất 100% ra Canonical Schema v2.1.      │    │ 4. Nâng cấp `scripts/sync-public-data.mjs`   │
│ 3. Đóng gói các chuyên đề GĐ1 thành Bundle   │    │    sinh snapshot tĩnh Đua Top / Solo.        │
│    JSON chuẩn kèm thư mục assets ảnh.        │    │ 5. Đấu nối Đua Top / Solo vào snapshot mới.  │
└──────────────────────────────────────────────┘    └──────────────────────────────────────────────┘
```

---

## 4. Ký Duyệt & Trạng Thái Gate Check

- **Trạng thái Gate Check**: **PASS WITH CONDITIONS**
- **Điều kiện mở khóa viết mã**:
  1. [x] Đối chiếu Schema 1-1 hoàn tất (Đạt 100% không mất mát dữ liệu).
  2. [x] Kiểm thử an ninh & quy tắc nghiệp vụ hoàn tất (16/16 test assertions pass).
  3. [ ] MACHINE-2 hoàn tất nâng cấp `contentIdentityHash` theo đặc tả SDR-v2.1 Mục 2.5.
  4. [ ] Khởi động Sprint 2 triển khai đồng bộ trên cả hai phân hệ.

**Đại diện MACHINE-1 (Production Owner)**: *Đã ký duyệt & sẵn sàng triển khai sau khi hoàn thành điều kiện.*
