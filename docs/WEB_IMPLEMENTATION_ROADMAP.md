# LỘ TRÌNH TRIỂN KHAI & THIẾT KẾ NỀN TẢNG CÂU HỎI MỚI
**Dự án**: Nền tảng Website Vật Lý Xuân Trường (`edu-portal-console` & `edu-portal-lms`)  
**Tác giả thiết kế**: Machine-1 (Production Owner)  
**Phiên bản**: v1.1 — Chuẩn hóa theo Quyết định Thiết kế AAC  
**Ngày ban hành**: 27/08/2026  

---

## 1. Tổng quan Kiến trúc Mục tiêu & Quyết định AAC

Hệ thống mới giải quyết triệt để sự phân tán dữ liệu và lỗi câu hỏi lộn xộn thông qua 4 trụ cột kiến trúc cốt lõi:
1. **Unified Schema & Immutable ID**: Chuẩn hóa toàn bộ câu hỏi về 15 trường dữ liệu; mã định danh `id` câu hỏi bất biến.
2. **Admin Teaching Scope Controller**: Trung tâm điều khiển giảng dạy tập trung tại Admin giúp thầy chọn khóa, giai đoạn, tất cả chương đang mở, bài đang mở.
3. **Đua Top & Solo Tự Động Theo Scope**: Đua Top và Solo tự động dùng chung tập câu hỏi thuộc **tất cả các chương đang mở**, áp dụng cấu hình phân bổ độ khó độc lập.
4. **Bộ Lọc Chất Lượng & Snapshot Đề Thi Bất Biến**:
   - Câu mới nhập luôn ở trạng thái `Thô` (`tho`) $\to$ **Câu Thô tuyệt đối không xuất hiện cho học sinh**. Chỉ câu `Tinh` (`da_duyet_tinh`) mới được xuất bản.
   - Đề thi lưu tham chiếu `questionId` kèm snapshot toàn văn tại thời điểm xuất bản $\to$ sửa câu gốc trong ngân hàng không làm thay đổi đề thi đã hoàn thành.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ADMIN CONSOLE (THẦY ĐIỀU KHIỂN)                        │
│                                                                                        │
│  [Khóa: VL12 Lí Thuyết] ──► [GĐ1] ──► [Chương 1, Chương 2 đang mở] ──► [Bài 1..Bài 12] │
│  Phạm vi kích hoạt: ☑ Đua Top (C1+C2)  ☑ Solo (C1+C2)  ☑ Thi Thử (Đề 1..Đề 5)          │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Lưu cấu hình vào Sheet 'Settings'
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND GOOGLE SHEETS / APPS SCRIPT                             │
│                                                                                        │
│  • Sheet 'NganHang' (Unified Schema 15 fields, chỉ xuất câu 'da_duyet_tinh')          │
│  • Sheet 'Settings' (teachingScope: {courseId, stage, activeChapters, gameScope})      │
│  • Sheet 'DanhSachDe' & 'ExamSnapshots' (Lưu snapshot bất biến của từng đề thi)       │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            │ GitHub Actions (refresh-data.yml mỗi 15p)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           GITHUB PAGES / CDN (DỮ LIỆU TĨNH SIÊU TỐC)                   │
│                                                                                        │
│  • data/game-banks/duatop-active.json  (Chỉ chứa câu Tinh của tất cả Chương đang mở)  │
│  • data/game-banks/solo-active.json    (Chứa câu Tinh C1+C2 đã cân bằng 3NB-3TH-1VD-1VDC)│
│  • data/quizzes/quiz-[hash].json       (Luyện tập từng bài học 100% chính xác)         │
│  • data/danhsachde.json                (Danh sách đề thi snapshot bất biến)            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Thiết kế Giao diện Admin Scope Controller

### 2.1. Thanh điều khiển tiến độ giảng dạy (Teaching Scope Bar)
Thanh widget điều khiển tập trung ở đầu Admin Console:

```
╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗
║ 🎓 BỘ ĐIỀU KHIỂN TIẾN ĐỘ GIẢNG DẠY & PHẠM VI CÂU HỎI (TEACHING SCOPE)                                    ║
╠══════════════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                          ║
║ 1. KHÓA ĐANG DẠY:     [ Chuyên đề Lý thuyết GĐ1 - Vật Lý 12 ▾ ]                                          ║
║ 2. GIAI ĐOẠN HIỆN TẠI: (•) GĐ1 Lí thuyết    ( ) GĐ2 Tổng ôn    ( ) GĐ3 Luyện đề    ( ) Bổ trợ            ║
║                                                                                                          ║
║ 3. TẤT CẢ CHƯƠNG ĐANG MỞ (Đua Top & Solo tự động lấy câu thuộc các chương này):                          ║
║    ☑ Chương 1: Vật lý nhiệt (185 câu Tinh)   ☑ Chương 2: Khí lí tưởng (142 câu Tinh)                     ║
║    ☐ Chương 3: Từ trường (Chưa mở)           ☐ Chương 4: Vật lí hạt nhân (Chưa mở)                      ║
║                                                                                                          ║
║ 4. CẤU HÌNH ĐỘ KHÓ GAME:                                                                                 ║
║    • Đua Top:   Tăng tiến theo chuỗi đúng (Streak Multiplier) + Thưởng tốc độ (≤30s)                     ║
║    • Solo 1-1:  Tỉ lệ chuẩn mỗi trận (3 Nhận biết + 3 Thông hiểu + 1 Vận dụng + 1 Vận dụng cao)          ║
║    • Lọc chất lượng: [Bắt buộc] CHỈ DÙNG CÂU ĐÃ DUYỆT TINH (Câu thô bị loại trừ 100%)                   ║
║                                                                                                          ║
║    [ 💾 LƯU CẤU HÌNH & XUẤT BẢN NGAY ]        Trạng thái: ✅ Đang áp dụng Chương 1 + 2 (327 câu Tinh)    ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Thiết kế Cơ chế Nhập Hàng Loạt Hợp Nhất (Unified Bulk Import)

Cả hai kênh nhập Word (`.docx`) và Excel (`.xlsx`) đều chuẩn hóa về **một Unified Question Schema duy nhất**, câu mới nhập mặc định gắn nhãn `trangThaiDuyet = "tho"`:

```
┌─────────────────────────┐             ┌─────────────────────────┐
│     File Word (.docx)   │             │    File Excel (.xlsx)   │
│  (DocxEngine 3 phần Bộ) │             │ (Mau_NganHang_v2.xlsx)  │
└────────────┬────────────┘             └────────────┬────────────┘
             │                                       │
             └───────────────────┬───────────────────┘
                                 ▼
                 ┌───────────────────────────────┐
                 │    VALIDATOR & NORMALIZER     │
                 │  • Chuẩn hóa LaTeX KaTeX      │
                 │  • Kiểm tra đủ đáp án & ý D/S │
                 │  • Gán mặc định: trạng thái Thô│
                 └───────────────┬───────────────┘
                                 ▼
                 ┌───────────────────────────────┐
                 │    UNIFIED QUESTION SCHEMA    │
                 │  (Lưu vào Sheet 'NganHang')   │
                 └───────────────┬───────────────┘
                                 │
                     [Thầy bấm 'Duyệt Tinh']
                                 ▼
                 ┌───────────────────────────────┐
                 │       XUẤT BẢN CHO HỌC SINH   │
                 │   (Đua Top, Solo, Bài học)    │
                 └───────────────────────────────┘
```

---

## 4. Kế hoạch Triển khai theo từng Giai đoạn (Roadmap)

> [!IMPORTANT]
> **GATE CHECK**: Chưa triển khai code nghiệp vụ cho đến khi nhận schema của Machine-2 và hoàn thành đối chiếu hai phía.

### Giai đoạn 1: Chuẩn hóa Schema & Đối chiếu Hai Phía (Sprint 1)
- [x] Khảo sát toàn diện ngân hàng câu hỏi và các tính năng liên quan.
- [x] Đề xuất Unified Question Schema v1.1 và Teaching Scope Controller.
- [x] Chốt quyết định thiết kế AAC (Đua Top/Solo theo chương mở, Duyệt Tinh bắt buộc, Word+Excel hợp nhất, Snapshot đề bất biến).
- [ ] **Nhận schema từ Machine-2 $\to$ Tiến hành đối chiếu & ký duyệt thống nhất hai phía**.

### Giai đoạn 2: Backend Apps Script & Quản trị Admin (Sprint 2 - Sau khi Gate Check Pass)
- [ ] Nâng cấp cấu trúc bảng `NganHang` trên Google Sheets bổ sung 15 trường dữ liệu.
- [ ] Cập nhật cấu hình `teachingScope` trong sheet `Settings`.
- [ ] Xây dựng thanh `Teaching Scope Bar` trên Admin Console.
- [ ] Tích hợp tính năng Duyệt câu Thô $\to$ Tinh hàng loạt.
- [ ] Nâng cấp bộ nhập Word/Excel xuất về cùng schema.

### Giai đoạn 3: Snapshot Tĩnh & Trải nghiệm Học sinh (Sprint 3)
- [ ] Cập nhật `scripts/sync-public-data.mjs` build snapshot Đua Top / Solo theo chương đang mở.
- [ ] Cập nhật `dua-top.html` và `solo.html` đọc dữ liệu snapshot đã lọc theo chương mở.
- [ ] Triển khai cơ chế Snapshot bất biến cho đề thi trong `thithu.html` và `phong-thi-thu.html`.
- [ ] Xuất bản bài tập tự luyện cho toàn bộ 43 bài học.

---

## 5. Kế hoạch An toàn & Khôi phục (Safety & Rollback Plan)
- **Tương thích ngược 100%**: Mọi nâng cấp schema đều bảo toàn các cột cũ (`optA, optB, correct`), không làm gián đoạn website đang chạy.
- **Kiểm thử Offline độc lập**: Mọi module bóc tách và lọc dữ liệu đều có unit test Node.js mock trước khi tích hợp.
- **Rollback tức thì**: Bản sao lưu Google Sheets và snapshot Git cho phép quay lại phiên bản trước bất kỳ lúc nào.
