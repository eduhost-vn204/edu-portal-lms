# CHIẾN LƯỢC ĐỒNG BỘ MODULE DÙNG CHUNG: ADMIN CONSOLE $\longleftrightarrow$ STUDENT LMS
**Dự án**: Nền tảng Website Vật Lý Xuân Trường  
**Tác giả**: MACHINE-1 (Production Owner)  
**Ngày ban hành**: 27/08/2026  

---

## 1. Danh Mục Các Module Dùng Chung (Shared Modules Matrix)

| Module | Vị trí Module | Vai trò trên Admin Console (`edu-portal-console`) | Vai trò trên Student LMS (`edu-portal-lms`) | Tần suất Đồng bộ |
| :--- | :--- | :--- | :--- | :---: |
| `teaching-scope-manager.mjs` | `src/modules/` | Thầy cấu hình, bật/tắt Chương & Bài, thiết lập thời gian mở. | Kiểm tra hiệu lực Scope, lọc nội dung phục vụ học sinh. | Mỗi khi có bản cập nhật Core |
| `game-question-selectors.mjs` | `src/modules/` | Mô phỏng / Xem trước phân bổ câu hỏi Đua Top & Solo. | Bộ chọn câu Đua Top & Solo cho học sinh khi làm bài. | Đồng bộ tuyệt đối 1:1 |
| `immutable-exam-snapshot.mjs` | `src/modules/` | Tạo bản chụp toàn văn bất biến khi Thầy xuất bản đề. | Hiển thị đề thi và chấm điểm tự động cho học sinh. | Đồng bộ tuyệt đối 1:1 |
| `pedagogical-config.mjs` | `src/modules/` | Quản lý và điều chỉnh các tham số sư phạm (PROPOSED). | Áp dụng hệ số điểm Streak, thưởng tốc độ, fallback. | Đồng bộ tuyệt đối 1:1 |
| `canonical-hash-verifier.mjs` | `src/modules/` | Kiểm định tính toàn vẹn và chống trùng lặp khi import. | Đối soát mã hash phiên bản khi đồng bộ dữ liệu tĩnh. | Khi có cập nhật Hash Spec |

---

## 2. Chiến Lược Đồng Bộ Không Gây Lệch Mã (Synchronization Strategy)

Do dự án hiện đang triển khai trên 2 GitHub repositories độc lập (`edu-portal-console` và `edu-portal-lms`) triển khai qua GitHub Pages/Actions, giải pháp tối ưu theo từng giai đoạn như sau:

### Giai đoạn Hiện Tại (Sprint 1 & 2): Cơ Chế Mirror & Checksum Kiểm Thử Tự Động
- Thư mục `src/modules/` là **Single Source of Core Logic** được duy trì đồng nhất cấu trúc trên cả 2 repo.
- Trước mỗi lần commit/push, test suite `tests/run_all_web_pipeline_tests.mjs` được chạy độc lập trên cả hai repo để bảo đảm 100% logic đồng nhất từng byte.
- **Không sử dụng external npm package** để tránh phát sinh phụ thuộc runtime hoặc làm chậm quy trình build tĩnh của GitHub Actions.

### Giai đoạn Tiếp Theo (Sprint 3+): Monorepo Package / Submodule
- Khi hệ thống đi vào vận hành ổn định, xem xét đóng gói thư mục `src/modules/` thành Git Worktree / Git Submodule hoặc internal workspace package `@vlxt/question-engine` chia sẻ chung.

---

## 3. Ràng Buộc An Toàn Tuyệt Đối
- Mọi thay đổi logic tại `src/modules/` **bắt buộc phải được kiểm thử và commit song song trên cả 2 repo** trong cùng một phiên bàn giao.
- Không tự ý sửa đổi logic nghiệp vụ trên một repo mà không đồng bộ sang repo còn lại.
- Giữ nguyên toàn bộ các file giao diện và script production legacy của từng repo.
