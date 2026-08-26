# Hướng dẫn dành cho Codex — Vật Lý Xuân Trường

## Bắt buộc trước khi làm

1. Chạy `git fetch origin main` và đối chiếu `HEAD` với `origin/main`.
2. Đọc toàn bộ `PROJECT_STATE.md` và `CLAUDE.md` trước khi sửa mã.
3. Kiểm tra `git log -10 --oneline` và `git status --short --branch`.
4. GitHub `main` là nguồn mã chuẩn. Nếu thư mục hiện tại bẩn hoặc cũ, bảo toàn thay đổi của người dùng và dùng clone/worktree sạch cho sửa đổi lớn.

## Phối hợp nhiều trợ lý

- Claude và Codex dùng chung `PROJECT_STATE.md` làm sổ bàn giao duy nhất.
- Sau mỗi thay đổi đáng kể, cập nhật mục **Bàn giao gần nhất** trong `PROJECT_STATE.md`.
- Bàn giao phải ghi commit, file đã sửa, hành vi mới, kiểm tra, điều phải giữ nguyên và việc còn lại.
- Trước khi push phải fetch lại; không force-push và không ghi đè thay đổi mới trên GitHub.
- Không suy đoán rằng mã cục bộ cũ hơn là phiên bản đúng.

## Các ràng buộc quan trọng

- Không để dữ liệu công khai của trang khóa học phụ thuộc trực tiếp vào tốc độ Google Apps Script.
- Không tải toàn bộ kho câu hỏi khi mở danh sách khóa học.
- Không làm mất hàng đợi đồng bộ tiến độ ngoại tuyến.
- Giữ menu điện thoại chuyên biệt của `index.html`, `hoso.html`, `danhsach-ly12.html`.
- Không đưa bí mật vào kho mã.
- Kiểm tra cú pháp JavaScript và thẻ `</html>` theo phạm vi thay đổi.

Chi tiết kiến trúc, triển khai và trạng thái mới nhất nằm trong `PROJECT_STATE.md`.

## Quy trình tự chủ cho mọi AI

- Đọc `AI_RUNBOOK.md` trước khi bắt đầu bất kỳ nhiệm vụ nào.
- Không dựa vào lịch sử chat để xác định trạng thái dự án; thứ tự nguồn sự thật là `AGENTS.md` → `PROJECT_STATE.md` → Git/GitHub → mã nguồn hiện tại.
- Mọi thay đổi phải đi qua nhánh riêng, kiểm thử, commit có mô tả và cập nhật bàn giao. Không push thẳng hoặc force-push `main`.
- Nếu làm trong project có cả Student và Admin, phải xác nhận đúng remote của từng repo trước khi sửa.
- Agent được tự sửa, kiểm thử, commit và push nhánh khi thông tin xác thực hợp lệ. Agent phải dừng trước thao tác dữ liệu production, deploy Google Apps Script, thay đổi credential/quyền truy cập hoặc merge `main` nếu chưa có chỉ thị rõ ràng của thầy.

