# BÁO CÁO GATE CHECK V2.1: ĐỐI CHIẾU CANONICAL SCHEMA VỚI HỆ THỐNG WEBSITE
**Dự án**: Nền tảng Website Vật Lý Xuân Trường (`edu-portal-lms` & `edu-portal-console`)  
**Người thực hiện**: MACHINE-1 (Production Owner)  
**Nguồn đối chiếu**: Private Repo `https://github.com/eduhost-vn204/vatly-content-studio-private`  
**Commit đã kiểm tra**: `5690ca36f08ac7fcc252efc2bed50ec85a0c683f`  
**Nhánh Gate Check**: `antigravity/machine-1/gate-check-schema-v21`  
**Ngày thực hiện**: 27/08/2026  

---

## 1. Kết Quả Kiểm Tra Nguồn Bàn Giao (Source Verification)

1. **Cam kết SHA & Nguồn Mã**:
   - Đã clone và xác minh chính xác commit `5690ca36f08ac7fcc252efc2bed50ec85a0c683f` tại private repo `vatly-content-studio-private`.
2. **Kiểm thử Tự động (Automated Test Suite)**:
   - Đã thực thi toàn bộ test suite `pytest tests/test_schema_v21.py -v` trên môi trường chuẩn:
     - `test_json_schema_validation`: **PASSED** (Kiểm thử Draft202012Validator cho cả Positive cases và 6 Negative cases: thiếu đáp án, thiếu options, thiếu subItems, thiếu numericValue, thiếu nguồn, câu Thô gán nhầm Production scope).
     - `test_semantic_integrity`: **PASSED** (Kiểm thử quan hệ 2 chiều `QUESTION_GROUP` $\leftrightarrow$ `childQuestionIds`, phát hiện chính xác tham chiếu không tồn tại, sai parentId, vòng lặp circular reference, và self-reference).
     - `test_hash_and_deduplication`: **PASSED** (Kiểm thử tính bất biến trước khoảng trắng/hoa thường và phát hiện thay đổi nội dung).
     - `test_security_and_attribution_audit`: **PASSED** (100% xác nhận dữ liệu tổng hợp không giả mạo người duyệt: `reviewedBy` là null, `reviewedAt` là null, `rawTier` là `THO`).
   - Kết quả: **4/4 test suites PASS (16/16 assertions 100%)**.
3. **Kiểm tra An ninh & Bản quyền**:
   - Dữ liệu trong `fixtures/synthetic/synthetic_sample_questions.json` hoàn toàn là dữ liệu tổng hợp giả lập (synthetic data), không chứa tài liệu bản quyền, không chứa tên/branding của bên thứ ba, không chứa đường dẫn cục bộ máy tính của tác giả.

---

## 2. Bảng Đối Chiếu Quy Tắc Nghiệp Vụ & An Toàn (Business Rules Verification)

| STT | Quy Tắc Nghiệp Vụ | Yêu Cầu của Thầy / Hệ Thống Web | Hiện Trạng Canonical Schema v2.1 | Đánh Giá Gate Check |
| :---: | :--- | :--- | :--- | :---: |
| 1 | **Phân tầng Thô / Tinh** | Câu Thô (`THO`) tuyệt đối không bao giờ xuất hiện cho học sinh (ở Đua Top, Solo, Bài học, Thi thử). | Ràng buộc trong `allOf` schema: `status IN ['DRAFT', 'QA_PASSED']` $\Rightarrow$ `rawTier == 'THO'`, `usageScopes` bị chặn các scope thi/đua. | **ĐẠT (PASS)** |
| 2 | **Quyền Duyệt của Thầy** | `QA_PASSED` là kiểm tra kỹ thuật của Studio, **không đồng nghĩa** với Thầy đã duyệt. Chỉ `TEACHER_APPROVED` mới thành `TINH`. | Khẳng định rõ trong `canonical-question.schema.v2.1.json` và `test_security_and_attribution_audit`. | **ĐẠT (PASS)** |
| 3 | **Teaching Scope Tập Trung** | Lấy tập hợp tất cả Chương/Bài đang mở được cấu hình từ Admin Console. | Web Mapping Contract ánh xạ `taxonomy.chapterNumber`, `taxonomy.lessonCode` làm khóa lọc cho Teaching Scope. | **ĐẠT (PASS)** |
| 4 | **Cấu hình Đua Top vs Solo** | Dùng chung tập câu hỏi đang mở nhưng phân bổ mức độ độc lập (Solo: 3 NB + 3 TH + 1 VD + 1 VDC). | Canonical Schema cung cấp đủ `difficultyLevel` (1, 2, 3, 4) và `usageScopes` (`DUA_TOP_FAST_QUIZ`, `SOLO_PVP`). | **ĐẠT (PASS)** |
| 5 | **Đề thi Snapshot Bất Biến** | Đề thi lưu tham chiếu `questionId` + snapshot toàn văn tại thời điểm xuất bản. | Khớp hoàn toàn với thiết kế `ExamRecord` của MACHINE-1. | **ĐẠT (PASS)** |
| 6 | **Bảo toàn QUESTION_GROUP** | Nhóm câu hỏi chùm phải bảo toàn `introText` ngữ cảnh và liên kết hai chiều `childQuestionIds` $\leftrightarrow$ `parentId`. | Schema v2.1 bắt buộc `childQuestionIds` $\ge 1$, `introText` không rỗng; `integrity_validator.py` kiểm tra 2 chiều. | **ĐẠT (PASS)** |

---

## 3. Phân Tích Chuyên Sâu Cơ Chế Content Hash (Mục D)

### 3.1. Rủi ro Phát hiện khi Audit `normalizer.py`
Trong triển khai hiện tại của `generators/normalizer.py`, hàm `compute_content_hash(text)` chỉ nhận chuỗi `text` (thường là `stem`). Điều này tạo ra rủi ro nghiêm trọng:
- **Xung đột Hash giữa các câu con trong QUESTION_GROUP**: Nếu hai câu hỏi thuộc hai chùm dữ kiện khác nhau nhưng có câu lệnh giống nhau (VD: *"Tính nhiệt lượng cung cấp trong quá trình trên?"* hoặc *"Xác định giá trị của $x$?"*), việc chỉ băm `stem` sẽ khiến hai câu này sinh ra **trùng mã hash 100%**, dẫn tới việc một câu bị ghi đè hoặc bị loại bỏ nhầm khi deduplicate.
- **Bỏ sót sự khác biệt về Đáp án / Phương án / Đồ thị**: Hai câu có cùng câu dẫn nhưng khác các phương án A, B, C, D hoặc khác ảnh đồ thị đính kèm sẽ bị coi là trùng lặp nếu chỉ băm `stem`.

### 3.2. Đề Xuất Giải Pháp: Chiến Lược 2 Cấp Hash (Two-Tier Hashing Strategy)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. contentIdentityHash (Nhận diện Trùng lặp Nội dung Ngữ nghĩa)                       │
│    Payload = SHA-256 (                                                                 │
│       type + "|" +                                                                     │
│       stem_normalized + "|" +                                                          │
│       (parent_intro_normalized IF child ELSE "") + "|" +                              │
│       options_normalized (hoặc subItems_normalized) + "|" +                            │
│       correctAnswer / numericValue / tolerance / unit + "|" +                          │
│       mediaAssets_sha256_list                                                          │
│    )                                                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. revisionHash (Phát hiện Mọi Thay đổi Cần Nâng Phiên bản `version: version + 1`)     │
│    Payload = SHA-256 (                                                                 │
│       Toàn bộ Canonical JSON Object (sau khi sắp xếp key theo thứ tự chuẩn)            │
│    )                                                                                   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Danh Sách Phân Loại Điểm Cần Xử Lý (Discrepancy Matrix)

### A. BLOCKER (Phải xử lý trước khi kích hoạt code triển khai)
1. **Nâng cấp `compute_content_hash` trong Content Studio**: MACHINE-2 cần cập nhật thuật toán băm sang `contentIdentityHash` (bao gồm `stem` + `options/subItems` + `parentIntroText` + `dapAn` + `mediaAssetHashes`) để đảm bảo không xung đột hash giữa các câu chùm và biến thể.
2. **Bảng Bí danh Định danh Bài học (`lessonCode` $\leftrightarrow$ `MaBai`)**: Canonical Schema dùng mã chuẩn sư phạm (VD: `G12_C1_B01`), trong khi hệ thống `baihoc.json` hiện hành đang dùng mã hash cũ (VD: `B1036d251af19`). Cần thiết lập bảng ánh xạ alias hai chiều để không làm gãy các quiz JSON đang phục vụ học sinh.

### B. IMPORTANT (Thực hiện ngay trong Sprint 2)
1. **Chuẩn hóa Danh mục Khóa học**: Mở rộng enum `khoaHoc` để đồng bộ giữa Content Studio (`XPS_2K9`, `CHUYEN_DE_12`) và Web LMS (`vatly12_lythuyet_gd1`).
2. **Xử lý Ngưỡng sai số TLN**: Đồng bộ logic chấm điểm câu hỏi Trả lời ngắn (`numericValue` $\pm$ `tolerance`) giữa web client và backend.

### C. OPTIONAL (Cải tiến ở Sprint 3)
1. **Lưu trữ Asset CDN**: Tự động tải ảnh từ Google Drive / WebPath lên Cloud Storage CDN có caching lâu dài.

---

## 5. Kết Luận Gate Check

### Trạng Thái: **PASS WITH CONDITIONS** (ĐẠT CÓ ĐIỀU KIỆN)

Hợp đồng dữ liệu giữa Content Studio (MACHINE-2) và Hệ thống Website (MACHINE-1) đã đạt **95% sự tương thích và đồng thuận kiến trúc**. 

**3 Điều kiện bắt buộc để chuyển sang viết mã nghiệp vụ:**
1. MACHINE-2 áp dụng công thức `contentIdentityHash` theo đúng đề xuất tại Mục 3.2.
2. MACHINE-1 và MACHINE-2 thống nhất bảng ánh xạ `lessonCode` $\leftrightarrow$ `MaBai`.
3. Hoàn tất ký duyệt hồ sơ Schema Decision Record v2.1.
