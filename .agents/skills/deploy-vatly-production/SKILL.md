---
name: deploy-vatly-production
description: >-
  Quy trình tự động hóa triển khai an toàn cho hệ thống Vật Lý Xuân Trường:
  deploy Google Apps Script qua clasp, phân cấp kiểm thử nghiệm thu chặt chẽ,
  self-test server-side cô lập không rò rỉ secret, và đồng bộ GitHub Pages.
---

# Quy trình Triển khai An toàn — Vật Lý Xuân Trường

Skill này quy định chuẩn mực triển khai mã nguồn và nghiệm thu toàn diện cho hệ thống website và backend Google Apps Script.

---

## 1. Nguyên tắc An toàn Tuyệt đối & Bảo mật Khóa Quản trị
- **Không bao giờ yêu cầu, đọc, ghi log hoặc hiển thị `ADMIN_KEY`**: Tuyệt đối không đưa chuỗi khóa thật vào code, commit, shell command hay báo cáo chat.
- **Phân tách trách nhiệm**: Agent tự động hóa qua Clasp / Git; Thầy tự quản lý `ADMIN_KEY` trong **Script Properties** (`Project Settings > Script Properties`).
- **Rollback tag bắt buộc**: Luôn tạo tag rollback trỏ vào `origin/main` trước khi tiến hành merge.
- **Bảo toàn manifest & source**: Không push file `.txt` trực tiếp. Cấu trúc source phải qua thư mục `src/` với `src/Mã.js` và `src/appsscript.json`.

---

## 2. Các Cấp độ Kiểm thử Nghiệm thu (Không đánh đồng Smoke Test với Nghiệm thu Toàn bộ)

Quy trình nghiệm thu gồm 3 cấp độ độc lập:

### Cấp độ 1: Smoke Test Công khai (Public Smoke Test)
- **Mục tiêu**: Xác nhận Web App endpoint đã nạp phiên bản mới và định tuyến an toàn mà không cần khóa quản trị.
- **Thao tác**:
  1. Gửi request POST action không tồn tại (`action: 'non_existent_smoke_test'`). Phải nhận về `{ ok: false, msg: 'Unknown action' }` (chứng minh không bị lọt vào fallback `saveScore` làm ghi rác vào bảng điểm).
  2. Gửi request `action: 'pingadmin'` với khóa sai hoặc không truyền khóa. Phải nhận về `{ ok: false, msg: 'Unauthorized' }`.
- **Lưu ý**: Cấp độ này CHỈ chứng minh endpoint online và router hoạt động, **KHÔNG ĐƯỢC tuyên bố đã nghiệm thu toàn bộ hệ thống**.

### Cấp độ 2: Kiểm thử Xác thực Phân quyền & Self-Test Phía Máy chủ (Server-Side Self-Test)
- **Mục tiêu**: Kiểm thử các luồng quản trị có gắn khóa đúng một cách bảo mật tuyệt đối mà không cần truyền khóa qua mạng công khai hay in ra console.
- **Thực thi**:
  - Chạy hàm máy chủ `runAdminSelfTest()` (qua OAuth / `clasp run` hoặc gọi nội bộ Apps Script).
  - Hàm tự đọc `ADMIN_KEY` từ `Script Properties`, khởi tạo tài khoản test cô lập (`0999999999_selftest_<timestamp>`).
  - Kiểm tra chuỗi: `pingAdmin` -> `setVipStatus` (Premium: `trialExpiry=0`) -> `setVipStatus` (VIP 30 ngày: `trialExpiry>0`) -> `setVipStatus` (Free: `trialExpiry=0`) -> ghi dữ liệu giả lập ở 4 sheet -> `deleteAccount` dọn sạch 5 sheet.
  - Tự động xóa sạch tài khoản test và **chỉ trả về kết quả boolean** `{ ok: true, passed: true }`.

### Cấp độ 3: Nghiệm thu Trực tiếp qua Giao diện Quản trị (Admin UI Verification)
- **Nếu chưa thiết lập `clasp run` OAuth**:
  - Hướng dẫn Thầy đăng nhập giao diện Admin và bấm nút **"Kiểm tra CORS" (PingAdmin)** trên thanh công cụ tab **Tài khoản HS**.
  - Admin UI sẽ tự động hash mật khẩu và gửi `pingadmin` để xác thực kết nối thật.
  - Thực hiện nâng VIP/Premium và xóa tài khoản test trực tiếp trên modal quản trị của trình duyệt.

---

## 3. Quy trình Triển khai Chuẩn từng bước

1. **Chuẩn bị Source of Truth**:
   - Chạy `scripts/integrate-apps-script.mjs` tích hợp bản patch đã kiểm định vào `src/Mã.js` và `apps-script-CAPNHAT.txt`.
   - Chạy toàn bộ test suites nội bộ:
     - `node scripts/test-apps-script-logic.mjs` (chạy trực tiếp VM trên `src/Mã.js`).
     - `node scripts/test-postAdminWrite.mjs` (kiểm tra helper ghi Admin).
     - `node scripts/audit-actions.mjs` (đối soát 100% action ghi có trong whitelist).
     - Kiểm tra cú pháp tĩnh toàn bộ file JS/HTML.
2. **Triển khai qua Clasp**:
   - `npx.cmd @google/clasp status` -> xác nhận `src/appsscript.json` và `src/Mã.js`.
   - `npx.cmd @google/clasp push` -> đẩy source lên Apps Script.
   - `npx.cmd @google/clasp version "<mô tả phiên bản>"` -> tạo version mới.
   - `npx.cmd @google/clasp deploy --deploymentId <ID> --versionNumber <version>` -> cập nhật deployment live.
3. **Thực thi Chuỗi Nghiệm thu (Cấp độ 1 -> Cấp độ 2 / Cấp độ 3)**.
4. **Merge và Publish**:
   - Chỉ khi toàn bộ các cấp độ kiểm thử ĐẠT mới merge nhánh tính năng vào `main` cho cả `edu-portal-console` và `edu-portal-lms`.
   - Push lên remote và báo cáo chi tiết: commit hash, version Apps Script, masked deployment ID và URL Web App.
