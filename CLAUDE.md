# Hướng dẫn dành cho Claude — Vật Lý Xuân Trường

## Bắt buộc trước khi làm

1. Chạy `git fetch origin main` và đối chiếu `HEAD` với `origin/main`.
2. Đọc toàn bộ `PROJECT_STATE.md`. Đây là nguồn sự thật chung của dự án.
3. Đọc `git log -10 --oneline` và `git status --short --branch`.
4. Nếu thư mục đang có thay đổi không phải của mình, không xóa hoặc ghi đè. Với sửa đổi lớn, tạo clone/worktree sạch từ `origin/main`.

Không dựa vào nội dung cũ trong cuộc trò chuyện nếu nó mâu thuẫn với GitHub hoặc `PROJECT_STATE.md`.

## Quy tắc phối hợp với Codex

- Claude và Codex cùng làm trên kho chính thức; GitHub `main` là nguồn mã chuẩn.
- Kho học sinh: `eduhost-vn204/edu-portal-lms`. Kho Admin riêng: `eduhost-vn204/edu-portal-console`. Không dùng các tên kho cũ dù GitHub còn chuyển hướng.
- `PROJECT_STATE.md` là sổ bàn giao chung. Không tạo thêm một tài liệu trạng thái cạnh tranh.
- Sau mỗi thay đổi đáng kể, cập nhật mục **Bàn giao gần nhất** trong `PROJECT_STATE.md` cùng commit hoặc ngay sau commit mã.
- Ghi rõ: commit, file đã sửa, hành vi mới, kiểm tra đã chạy, điều phải giữ nguyên và việc còn lại.
- Trước khi push phải fetch lại. Nếu `origin/main` đã tiến lên, ghép thay đổi trên bản mới nhất rồi kiểm tra lại.
- Không force-push, không đẩy bản máy cũ đè lên thay đổi mới và không tự ý khôi phục một thiết kế đã được thay thế.

## Quy tắc kỹ thuật bắt buộc

- Website tĩnh: HTML, CSS và JavaScript thuần; triển khai bằng GitHub Pages.
- Không dùng Netlify và không dùng URL kho cũ cho công việc mới.
- Không đưa token, mật khẩu, API key hoặc khóa quản trị vào mã nguồn/tài liệu.
- Sau khi sửa JavaScript: chạy kiểm tra cú pháp.
- Sau khi sửa HTML lớn: kiểm tra còn thẻ đóng `</html>`.
- Giữ giao diện máy tính khi sửa responsive.
- Khi sửa menu điện thoại, ưu tiên menu chuyên biệt trên `index.html`, `hoso.html`, `danhsach-ly12.html`; menu chung trong `cache.js` không được tạo nút trùng.
- Không đưa việc tải toàn bộ `BaiTapTracNghiem` trở lại bước khởi động `baihoc.html`.
- Không để danh sách khóa học phải chờ Google Apps Script. Dữ liệu đọc công khai phải ưu tiên JSON tĩnh.
- Tiến độ học phải được lưu cục bộ trước rồi đồng bộ nền; lỗi GAS không được khóa giao diện học sinh.
- Dữ liệu cá nhân và quản trị chỉ được cache cục bộ theo người dùng; tuyệt đối không đưa hồ sơ, tiến độ, nhiệm vụ, điểm, tài khoản, nội dung đề hoặc đáp án vào `data/` công khai.
- Admin có thể đọc JSON công khai ở lần mở đầu, nhưng sau thao tác ghi/xóa/đổi tên phải buộc tải lại dữ liệu mới trực tiếp từ GAS.

## Cách nói chuyện với thầy Trường

- Giải thích bằng tiếng Việt, ngắn gọn và dễ hiểu.
- Chủ động làm và kiểm tra khi yêu cầu đã rõ.
- Khi hoàn thành, nêu kết quả, commit, kiểm tra và lưu ý vận hành; không bắt thầy xử lý các bước kỹ thuật không cần thiết.
