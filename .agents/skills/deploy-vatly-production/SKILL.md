---
name: deploy-vatly-production
description: >-
  Quy trình tự động hóa triển khai an toàn cho hệ thống Vật Lý Xuân Trường:
  deploy Google Apps Script qua clasp, kiểm thử smoke test phân quyền, kiểm tra
  không rò rỉ secret, và đồng bộ GitHub Pages.
---

# Deploy Vật Lý Xuân Trường Production

Skill này hướng dẫn và thực thi quy trình triển khai an toàn theo đúng các nguyên tắc của dự án.

## 1. Nguyên tắc An toàn Tuyệt đối
- KHÔNG BAO GIỜ hardcode, in ra màn hình hoặc log các bí mật (`ADMIN_KEY`, `GH_TOKEN`, credential).
- Mọi thao tác deploy Apps Script phải qua `.clasp.json` (được cấu hình bằng `scriptId` hợp lệ).
- Luôn tạo điểm rollback tag (`pre-hotfix-main-...`) trước khi merge.
- Chạy toàn bộ test suites (`scripts/test-postAdminWrite.mjs`, `scripts/audit-actions.mjs`, static syntax check) trước khi merge.

## 2. Các bước triển khai
1. **Kiểm tra Clasp**:
   - Xác định `.clasp.json` chứa `scriptId`.
   - Chạy `npx.cmd @google/clasp push` để đẩy mã nguồn mới lên Apps Script.
   - Chạy `npx.cmd @google/clasp deploy --description "Production Release"` để tạo version mới.
2. **Smoke Test Backend**:
   - Gửi request `action: 'pingadmin'` kiểm tra kết nối và CORS.
   - Kiểm tra từ chối action lạ hoặc payload thiếu action (`{ok:false, msg:'Unknown action'}`).
3. **Kiểm thử Nghiệp vụ An toàn**:
   - Thao tác trên tài khoản test dùng một lần (xác minh không tồn tại trong danh sách học sinh thật).
   - Kiểm tra luồng Premium -> Free.
   - Kiểm tra `deleteAccount` và dọn dẹp liên hoàn các sheet (`TienDo`, `BangVang`, `NhiemVu`, `HoatDong`).
4. **Merge và Publish**:
   - Merge nhánh tính năng vào `main` cho cả hai repo (`edu-portal-console` và `edu-portal-lms`).
   - Push lên remote khi toàn bộ kiểm thử thành công.
