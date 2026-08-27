# ĐẶC TẢ THIẾT KẾ TRIỂN KHAI: TEACHING SCOPE & IMMUTABLE EXAM SNAPSHOT (V2.1)
**Dự án**: Nền tảng Website Vật Lý Xuân Trường (`edu-portal-console` & `edu-portal-lms`)  
**Tác giả thiết kế**: MACHINE-1 (Production Owner)  
**Phiên bản**: v2.1.0  
**Ngày ban hành**: 27/08/2026  

---

## 1. Thiết Kế Trung Tâm Điều Khiển Giảng Dạy (Teaching Scope)

### 1.1. Cấu Trúc Dữ Liệu Teaching Scope
```json
{
  "teachingScope": {
    "scopeId": "SCOPE_2026_GD1_ACTIVE",
    "courseId": "XPS_2K9",
    "stage": "GD1_LY_THUYET",
    "isActive": true,
    "validFrom": "2026-08-01T00:00:00Z",
    "validTo": "2026-09-30T23:59:59Z",
    "activeChapters": [
      { "chapterNumber": 1, "chapterCode": "C1", "chapterTitle": "Vật lí nhiệt", "isOpen": true },
      { "chapterNumber": 2, "chapterCode": "C2", "chapterTitle": "Khí lí tưởng", "isOpen": true }
    ],
    "activeLessons": ["G12_C1_B01", "G12_C1_B02", "G12_C1_B03", "G12_C2_B01"],
    "qualityPolicy": {
      "requireApprovedOnly": true,
      "allowedTiers": ["TINH"],
      "allowedStatuses": ["TEACHER_APPROVED", "PUBLISHED"]
    }
  }
}
```

### 1.2. Quy Tắc Giảng Dạy & Phân Phối Dữ Liệu
1. **Kiểm tra Hiệu lực Scope**: Trước khi phân phối câu hỏi cho học sinh, hệ thống xác thực 3 điều kiện:
   - `isActive === true`.
   - `now >= validFrom` (Không mở sớm trước thời hạn).
   - `now <= validTo` (Tự động khóa khi hết kỳ học).
2. **Gộp Tất Cả Chương Đang Mở (Active Chapters Union)**:
   - Đua Top và Solo tự động lấy tập hợp câu hỏi thuộc **tất cả các chương có `isOpen === true`**.
   - Khi Thầy mở thêm Chương 2 trên Admin Console, Đua Top và Solo tự động kết nạp thêm câu hỏi Chương 2 mà không cần cấu hình lại từng màn chơi.
3. **Cách Ly Tuyệt Đối với Học Sinh**: Học sinh chỉ nhận nội dung thuộc Scope hiện hành; các câu hỏi thuộc chương đóng (`isOpen: false`) hoặc câu hỏi của khóa/lớp khác bị loại bỏ 100% ngay tại tầng build JSON tĩnh.

---

## 2. Rào Chắn Chống Lọt Câu Thô & Bộ Lọc Xuất Bản (Strict Raw Tier Blocker)

```
                       ┌─────────────────────────────────────┐
                       │   TỔNG KHO CÂU HỎI (SHEET / STORE)  │
                       └──────────────────┬──────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    RÀO CHẮN CHẤT LƯỢNG 2 TẦNG (V2.1)  │
                      └───────┬───────────────────────┬───────┘
                              │                       │
                [rawTier == "THO" hoặc]       [rawTier == "TINH" và]
                [status == "DRAFT" /  ]       [status == "TEACHER_APPROVED"]
                [          "QA_PASSED"]       [       hoặc "PUBLISHED"     ]
                              │                       │
                              ▼                       ▼
                   ┌─────────────────────┐ ┌─────────────────────────────────────┐
                   │    BỊ CHẶN 100%     │ │     KIỂM TRA TIẾP TEACHING SCOPE    │
                   │ (Chỉ hiển thị trong │ └──────────────────┬──────────────────┘
                   │  khu vực Duyệt của  │                    │
                   │  Thầy trên Admin)   │    [Chương & Bài nằm trong Scope mở?]
                   │                     │                    │
                   └─────────────────────┘                    ▼
                                           ┌─────────────────────────────────────┐
                                           │       XUẤT BẢN RA PUBLIC CDN        │
                                           │ (Đua Top, Solo, Bài Học, Thi Thử)   │
                                           └─────────────────────────────────────┘
```

- **Quy tắc 1**: `QA_PASSED` là cờ kiểm tra kỹ thuật cục bộ của máy bóc tách, **tuyệt đối không tương đương với Thầy đã duyệt**.
- **Quy tắc 2**: Chỉ câu có `status IN ['TEACHER_APPROVED', 'PUBLISHED']` và `rawTier == "TINH"` mới được cấp quyền xuất bản.

---

## 3. Thiết Kế Bộ Chọn Câu Hỏi Thông Minh Cho Game (Solo & Đua Top)

### 3.1. Đấu Trường Solo 1-1 (Deterministic Difficulty Quota)
- **Chuẩn định mức (8 câu/trận)**:
  - 3 câu **Nhận biết** (`NB` - Level 1)
  - 3 câu **Thông hiểu** (`TH` - Level 2)
  - 1 câu **Vận dụng** (`VD` - Level 3)
  - 1 câu **Vận dụng cao** (`VDC` - Level 4)
- **Cơ chế Fallback An toàn**: Nếu một bậc nhận thức tạm thời thiếu câu trong kho chương đang mở, bộ chọn tự động bù từ các bậc liền kề theo thứ tự ưu tiên ($VD \rightarrow TH \rightarrow NB \rightarrow VDC$) để đảm bảo 100% trận đấu có đủ 8 câu.

### 3.2. Đua Top Nhanh (Progressive Difficulty Queue)
- **Tăng tiến theo chuỗi đúng**: Hàng đợi câu hỏi sắp xếp tăng dần theo độ khó ($NB \rightarrow TH \rightarrow VD \rightarrow VDC$).
- **Hệ số Streak Multiplier**: Đúng 5 câu liên tiếp $\times 1.2$, đúng 10 câu liên tiếp $\times 1.5$.
- **Thưởng Tốc độ**: Trả lời đúng trong vòng $\le 30\text{s}$ được cộng điểm tốc độ phản xạ.

---

## 4. Thiết Kế Bản Chụp Đề Thi Bất Biến (Immutable Exam Snapshot)

### 4.1. Cấu Trúc Bản Chụp Đề Thi
```json
{
  "examId": "EXAM_VL12_THITHU_01",
  "tenDe": "Đề Thi Thử Số 1 - Vật Lí Nhiệt",
  "thoiGian": 50,
  "publishedAt": "2026-08-27T20:00:00Z",
  "questionCount": 40,
  "questionRefs": ["VLXT-G12-C1-B01-Q0001", "VLXT-G12-C1-B02-Q0001"],
  "questionsSnapshot": [
    {
      "questionId": "VLXT-G12-C1-B01-Q0001",
      "version": 1,
      "contentHash": "63ef8e39b173edae18cc978509d57da50286671d625756a16b153c8c6c9ebc9f",
      "type": "MULTIPLE_CHOICE_4",
      "stem": "Trong mô hình động học phân tử chất khí...",
      "options": [
        { "key": "A", "content": "tăng gấp đôi." },
        { "key": "B", "content": "tăng gấp bốn lần." }
      ],
      "correctAnswer": "A",
      "explanation": "Động năng tỉ lệ thuận...",
      "difficultyLevel": 1
    }
  ]
}
```

### 4.2. Khả Năng Chấm Lại Bất Biến (Anti-Mutation Guarantee)
- Đề thi lưu bản sao chụp toàn văn của tất cả câu hỏi tại thời điểm Thầy bấm *Xuất bản đề*.
- Thuật toán chấm điểm (`regradeStudentSubmission`) chỉ dựa vào `questionsSnapshot`.
- **Kiểm chứng thực tế**: Nếu sau này ai đó vào Ngân hàng sửa nội dung câu gốc (hoặc đổi đáp án đúng từ A sang B), bài làm và điểm số của học sinh trên đề thi đã xuất bản **hoàn toàn giữ nguyên 100% không bị sai lệch**.

---

## 5. Kết Quả Kiểm Thử Prototype & Đánh Giá Blocker

### 5.1. Kết Quả Thực Thi Test Suite
- Đã chạy test tự động `node scripts/test-prototype-web-pipeline.mjs` trên dữ liệu tổng hợp:
  - `TEST 1 (Teaching Scope Window & Active State)`: **PASS (100%)**
  - `TEST 2 (Strict Raw Tier Blocker)`: **PASS (100% - Chặn sạch câu Thô)**
  - `TEST 3 (Solo Selector Quota & Fallback)`: **PASS (100% - 3NB+3TH+1VD+1VDC)**
  - `TEST 4 (Đua Top Progressive Difficulty)`: **PASS (100%)**
  - `TEST 5 (Immutable Exam Snapshot & Anti-Mutation)`: **PASS (100% - Chấm lại điểm số bất biến)**

### 5.2. Phân Tách Blocker Thật Sự & Phần Sẵn Sàng Triển Khai
1. **Blocker Thật sự của Phía Content Studio**:
   - `compute_content_hash` trong `normalizer.py` cần nâng cấp sang `contentIdentityHash` (băm đa thành phần) trước khi Content Studio đóng gói dữ liệu thật.
2. **Phần Sẵn Sàng Triển Khai Ngay Phía Website (Không Bị Block)**:
   - ✅ Module `Teaching Scope Controller` trên Admin Console.
   - ✅ Module `Strict Raw Tier Filter` chống lọt câu Thô.
   - ✅ Module `Solo / Đua Top Selector` theo chương mở.
   - ✅ Module `Immutable Exam Snapshot` cho đề thi.
