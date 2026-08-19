# Vật Lý Xuân Trường — Trạng thái và bàn giao chung

Tài liệu này là nguồn sự thật chung cho Claude, Codex và các cộng tác viên. Mỗi trợ lý phải đọc trước khi làm và cập nhật sau thay đổi đáng kể.

## Kho mã và triển khai

- Kho chính thức: `https://github.com/eduhost-vn204/edu-portal-lms.git`
- Nhánh triển khai: `main`
- Website: `https://vatlyxuantruong.io.vn/`
- Nền tảng: GitHub Pages qua `.github/workflows/deploy.yml`
- Thời gian cập nhật thường khoảng 1–2 phút sau khi push.
- Tài khoản sở hữu: `eduhost-vn204`
- Không dùng làm URL mới: `xuantruongmyself-png/vatly-xuantruong`, `eduhost-vn204/vatly-xuantruong`.
- Không dùng Netlify cho dự án hiện tại.

## Quy tắc Git

1. Luôn fetch/pull `main` mới nhất trước khi sửa và fetch lại trước khi push.
2. Không push thẳng khi mã cục bộ và `origin/main` đã rẽ nhánh.
3. Không ghi đè thay đổi mới trên GitHub để đẩy một bản cũ từ máy.
4. Với sửa đổi lớn hoặc khi thư mục hiện tại bẩn, dùng clone/worktree sạch từ GitHub rồi ghép thay đổi.
5. Không force-push và không xóa thay đổi chưa rõ chủ sở hữu.
6. Sau khi push, theo dõi GitHub Actions và kiểm tra website công khai.

## Kiến trúc hiện tại

- Frontend: HTML, CSS, JavaScript thuần.
- Dữ liệu quản trị gốc: Google Sheets.
- Google Apps Script: xử lý ghi, dữ liệu cá nhân và các thao tác động.
- GitHub Pages/CDN: phục vụ HTML, JS, hình ảnh và JSON công khai.
- `cache.js` v5: cache stale-while-revalidate và menu điện thoại dùng chung.
- Không lưu token, mật khẩu, API key hoặc khóa quản trị trong kho/tài liệu.
- Các GET cá nhân (`profile`, `tiendo`, `nhiemvu`) cache riêng theo URL trên đúng trình duyệt, hiện dữ liệu cũ ngay rồi cập nhật nền; không xuất thành JSON công khai.
- `lichlive`, `settings`, `huongdan`, `baihoc`, `khoaconfig`, `danhsachde` ưu tiên JSON công khai; khi thiếu file sẽ tự quay về GAS.
- Nội dung đề, đáp án, tài khoản, điểm và dữ liệu quản trị không được sinh thành JSON công khai.

### Luồng dữ liệu khóa học nhanh

```text
Google Sheets
    ↓ GitHub Actions mỗi 15 phút
scripts/sync-public-data.mjs
    ↓
data/baihoc.json
data/khoaconfig.json
data/settings.json
data/huongdan.json
data/quiz-index.json
data/quizzes/quiz-*.json
    ↓ GitHub Pages/CDN
baihoc.html
```

- `baihoc.html` đọc danh sách bài và cấu hình từ JSON tĩnh, không chờ GAS.
- Câu hỏi được tách theo bài; chỉ tải file quiz khi học sinh mở đúng bài.
- Workflow đồng bộ duy nhất: `.github/workflows/refresh-data.yml`, chạy mỗi 15 phút và có thể chạy thủ công.
- Workflow này vẫn đồng bộ `data/lichlive.json` và `data/danhsachde.json` như quy trình cũ.
- Không tạo workflow đồng bộ thứ hai chạy song song.

### Tiến độ học sinh

- Giao diện cập nhật và lưu vào `localStorage` ngay.
- Yêu cầu `saveProgress` được đưa vào `vlxt_progress_queue_v1` rồi gửi GAS trong nền.
- Mỗi lần gửi có timeout 30 giây; nếu lỗi sẽ giữ hàng đợi và thử lại sau 30 giây hoặc khi mạng trở lại.
- Không đổi thành luồng bắt học sinh chờ GAS mới được tiếp tục.

## Menu điện thoại

- `index.html`, `hoso.html`, `danhsach-ly12.html` có menu ba gạch chuyên biệt kiểu YouTube từ commit `dd70ec3`.
- `baihoc.html`, `huongdan.html`, `lichlive.html` dùng menu điện thoại chung trong `cache.js` v5 từ commit `bcf0df6`.
- Menu chung tự bỏ qua trang đã có `.nav-hamburger`.
- Menu đóng khi bấm ra ngoài, nút X, một mục hoặc phím Esc.
- Phải giữ nguyên giao diện máy tính và không tạo hai nút menu trên cùng trang.

## Kiểm tra bắt buộc

- JavaScript: kiểm tra cú pháp sau khi sửa.
- HTML sửa lớn: xác nhận còn `</html>`.
- JSON sinh tự động: parse toàn bộ file và đối chiếu mã bài/câu hỏi.
- Workflow: xác nhận chạy thành công.
- Website thật: kiểm tra mã mới đã được phục vụ và các file JSON trả HTTP 200.
- Không coi cảnh báo `dữ liệu mẫu` là bằng chứng thiếu sheet trước khi kiểm tra API và JSON.

## Các file chính

- `baihoc.html`: khóa học, video, tài liệu, quiz và tiến độ.
- `cache.js`: cache dùng chung và menu điện thoại dùng chung.
- `auth.js`: phiên đăng nhập và thông tin tài khoản học sinh.
- `data/`: dữ liệu công khai được GitHub Pages phục vụ.
- `scripts/sync-public-data.mjs`: chuyển dữ liệu GAS/Sheets thành JSON tĩnh.
- `.github/workflows/refresh-data.yml`: lịch đồng bộ dữ liệu 15 phút.
- `.github/workflows/deploy.yml`: triển khai GitHub Pages.
- `apps-script-CAPNHAT.txt`: bản tham chiếu mã Google Apps Script; có thể không phản ánh mọi thay đổi trực tiếp trên GAS nếu chưa được đồng bộ về repo.
- Website Admin nằm ở kho riêng `eduhost-vn204/edu-portal-console`; không dùng tên kho admin cũ. Mốc Admin gần nhất: `dc714f1`.

## Mốc thay đổi quan trọng

- `dd70ec3` — menu điện thoại chuyên biệt cho các trang chính.
- `bcf0df6` — menu điện thoại chung cho các trang học sinh còn thiếu.
- `54a767d` — danh sách khóa học đọc JSON tĩnh; quiz tải theo từng bài; tiến độ có hàng đợi nền.
- `aada5d9` — hợp nhất thành một workflow đồng bộ dữ liệu duy nhất.
- `73e2295` — mở rộng tăng tốc toàn website học sinh, dữ liệu cá nhân cache cục bộ an toàn.
- Admin `6576136` — tải dữ liệu song song, ưu tiên CDN/cache và buộc đọc GAS mới sau thao tác sửa.
- Admin `e393438` — hotfix không chấp nhận cache bài học rỗng; xác nhận 42 bài trong JSON vẫn nguyên vẹn.
- Admin `f665fea` — thu hồi `6576136` và `e393438` vì làm trống giao diện Bài học/Ngân hàng; không áp dụng lại hướng tối ưu này nếu chưa thử nghiệm đầy đủ trên bản staging.
- Admin `dc714f1` — phương án thay thế đã kiểm thử: bài học xem nhanh từ cache/CDN, ngân hàng lưu IndexedDB và làm mới nền; cache rỗng không được chấp nhận.

## Điều phải giữ nguyên

- Không phục hồi `fetchQbAll()` vào bước `boot()` của `baihoc.html`.
- Không bắt `boot()` chờ dữ liệu tiến độ cá nhân trước khi render.
- Không bỏ JSON tĩnh để quay lại đọc `BaiHoc` trực tiếp từ GAS ở lần tải bình thường.
- Không xóa hoặc vô hiệu hàng đợi tiến độ nếu chưa có giải pháp đồng bộ thay thế tốt hơn.
- Không ghi đè menu chuyên biệt bằng menu chung.

## Việc có thể làm tiếp

- Đo lại thời gian thực tế sau mỗi lần Apps Script hoặc dung lượng dữ liệu thay đổi lớn.
- Với thao tác ghi Admin, chỉ dùng phản hồi lạc quan khi không làm giảm tính đúng đắn; thao tác hàng loạt luôn đọc dữ liệu GAS mới nhất.
- Theo dõi độ ổn định của workflow đồng bộ và dung lượng các file quiz.
- Cập nhật `apps-script-CAPNHAT.txt` khi mã GAS thật thay đổi.

## Bàn giao gần nhất

- Ngày: 19/08/2026
- Người thực hiện: Codex
- Commit mã gần nhất trước tài liệu này: `aada5d9`
- Kết quả:
  - Trang khóa học công khai đã dùng JSON tĩnh.
  - Đo trên website: `baihoc.json` khoảng 0,64 giây; `khoaconfig.json` và `quiz-index.json` khoảng 0,51 giây.
  - 42 bài học, 15 cấu hình, 268 câu hỏi; 7/7 mã bài có quiz đã khớp.
  - Hai workflow triển khai và đồng bộ đã chạy thành công.
  - Mở rộng cache sang hồ sơ, nhiệm vụ, tiến độ, thông báo, lịch live, hướng dẫn, thi thử và trò chơi.
  - Admin tải bài học/cấu hình/thiết lập song song; ưu tiên dữ liệu CDN và cache cục bộ, nhưng buộc đọc GAS mới sau thao tác sửa.
  - Ngân hàng câu hỏi Admin có cache riêng; đề, đáp án, tài khoản và điểm không bị công khai hóa.
- Kiểm tra đã chạy: cú pháp JavaScript, thẻ `</html>`, parse JSON, đối chiếu mã quiz, HTTP 200 trên website thật.
- Bước tiếp theo: cập nhật mục này sau mỗi thay đổi đáng kể, không thêm một sổ bàn giao cạnh tranh.
