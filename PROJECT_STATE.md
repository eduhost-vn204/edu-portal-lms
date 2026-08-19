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
- Website Admin nằm ở kho riêng `eduhost-vn204/edu-portal-console`; không dùng tên kho admin cũ. Mốc Admin gần nhất: `0fb8441` (nhánh `perf/cache-integrity-audit-20260819`, CHƯA merge/push vào `main`).

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
- `987b27c` (student, nhánh `perf/cache-integrity-audit-20260819`) — poll Bảng Vàng 5s→90s (chỉ khi tab hiện); tách logic gộp quiz stable/legacy sang `scripts/quiz-merge.mjs` (có test offline `scripts/test-quiz-merge.mjs`); sync script không còn xoá sạch `data/quizzes/*.json` khi nguồn trả về rỗng-nhưng-không-lỗi.
- Admin `0fb8441` (nhánh `perf/cache-integrity-audit-20260819`) — bỏ toàn bộ `mode:'no-cors'` còn sót (Lịch Live, Hướng Dẫn, Ngân hàng câu hỏi: sửa/xoá/gán bài/nạp Excel-docx-PDF/tạo đề từ ngân hàng); thêm timeout mặc định cho mọi fetch (GET 15s/POST 55s); badge số câu bài tập đọc `data/quiz-index.json` thay vì tải nguyên sheet BaiTapTracNghiem.

## Điều phải giữ nguyên

- Không phục hồi `fetchQbAll()` vào bước `boot()` của `baihoc.html`.
- Không bắt `boot()` chờ dữ liệu tiến độ cá nhân trước khi render.
- Không bỏ JSON tĩnh để quay lại đọc `BaiHoc` trực tiếp từ GAS ở lần tải bình thường.
- Không xóa hoặc vô hiệu hàng đợi tiến độ nếu chưa có giải pháp đồng bộ thay thế tốt hơn.
- Không ghi đè menu chuyên biệt bằng menu chung.
- Không quay lại quy tắc "có ≥1 dòng quiz stable là bỏ hết legacy" trong `scripts/quiz-merge.mjs` (mất câu nếu migrate dở dang) — điều kiện đúng là stable phải ≥ số dòng legacy mới coi là đầy đủ.
- Không xoá `mode:'no-cors'` → thêm lại ở bất kỳ đường ghi Admin nào (Ngân hàng/Lịch Live/Hướng dẫn) — đã cố tình bỏ hết để đọc xác nhận JSON thật; xem `postAdminWrite`/`postAdminWriteWithRetry` trong Admin `index.html`.
- Với thao tác ghi Admin dạng THÊM MỚI/append (nạp câu hỏi từ file, "Thêm vào cuối đề"), không tự động retry (`postAdminWriteWithRetry`) — chỉ dùng `postAdminWrite` 1 lần, tránh nhân đôi dữ liệu nếu phản hồi bị mất sau khi server đã ghi thành công.

## Việc có thể làm tiếp

- Merge/push nhánh `perf/cache-integrity-audit-20260819` (cả 2 repo) vào `main` sau khi thầy xem lại — hiện mới commit cục bộ, CHƯA push.
- Đo lại thời gian thực tế sau mỗi lần Apps Script hoặc dung lượng dữ liệu thay đổi lớn.
- Theo dõi độ ổn định của workflow đồng bộ và dung lượng các file quiz.
- Cập nhật `apps-script-CAPNHAT.txt` khi mã GAS thật thay đổi.
- Admin: `ADMIN_WRITE_ACTIONS` (whitelist tự gắn `adminKey`) đang THIẾU `bulksetbainganhang` và `bulksetchatluongnganhang` — 2 action này vẫn hoạt động (đã verify live cho chatLuong 18/8) nên có thể GAS không bắt buộc `adminKey` cho action bulk, nhưng nên rà lại phía Apps Script thật để xác nhận có đúng ý muốn không trước khi thêm hai action này vào whitelist (chưa tự sửa vì không chắc hành vi GAS đã deploy).
- Admin: `loadHuongDan(force=true)` khi lỗi mạng/timeout vẫn thay `hd-list` bằng thông báo lỗi thay vì giữ nội dung cũ (khác với `loadLiveSessions` đã sửa) — rủi ro thấp (trang ít dùng, không phải dữ liệu bài học/ngân hàng) nhưng nên sửa cùng kiểu nếu có dịp.
- Ngân hàng câu hỏi Admin (tab "Ngân hàng câu hỏi"): tải cả sheet 1 lần khi mở tab (không phân trang) — đã tốt hơn nhiều nhờ cache/CDN/IndexedDB nhưng phân trang/lọc phía server thật sự cần sửa Apps Script (không tự triển khai phiên này vì `apps-script-CAPNHAT.txt` trong repo chỉ là bản tham khảo, có thể khác bản đã deploy thật).

## Bàn giao gần nhất

- Ngày: 19/08/2026
- Người thực hiện: Claude (audit "lớp tải dữ liệu nhanh, ổn định" toàn site + Admin, không đánh đổi toàn vẹn dữ liệu)
- Nhánh: `perf/cache-integrity-audit-20260819` — CẢ HAI repo, chỉ commit cục bộ, CHƯA push lên `origin/main`.
- Commit: student `987b27c` (trên `ec0957d`), admin `0fb8441` (trên `dc714f1`).
- Kết quả:
  - Student: giảm poll Bảng Vàng 5s→90s + chỉ poll khi tab hiện (`index.html`, `hoso.html`, `cache.js`); tách + sửa logic gộp quiz stable/legacy sang `scripts/quiz-merge.mjs` (có test offline, 6/6 pass) — sửa lỗi "có ≥1 dòng stable là bỏ hết legacy" (từng làm mất câu nếu migrate dở dang) và lỗi nghiêm trọng hơn: sync script từng XOÁ SẠCH `data/quizzes/*.json` khi nguồn trả về rỗng-nhưng-không-null (không phải lỗi fetch) — giờ giữ nguyên file cũ trong tình huống đó, tương tự cho `khoaconfig.json`/`lichlive.json`/`danhsachde.json`.
  - Admin: bỏ toàn bộ 13 chỗ còn dùng `mode:'no-cors'` (Ngân hàng câu hỏi, Lịch Live, Hướng dẫn học tập) — chuyển sang đọc JSON xác nhận thật, có rollback khi thất bại, KHÔNG tự retry cho thao tác thêm-mới (append); thêm timeout mặc định 15s (GET)/55s (POST) cho mọi fetch qua 1 lớp bọc `window.fetch` duy nhất; badge số câu bài tập trong danh sách bài học đọc `data/quiz-index.json` (nhẹ) thay vì tải nguyên sheet BaiTapTracNghiem mỗi lần mở/tải lại trang, đồng thời sửa badge sai/cũ cho bài đã migrate sang MaBai.
  - Không đụng tới Apps Script/Google Sheets thật; không có thao tác ghi/xoá nào chạy trên dữ liệu production trong phiên này.
- Kiểm tra đã chạy: `node --check` cho toàn bộ `<script>` không-src trong `index.html`/`hoso.html` (student) và `index.html` (admin), cho `cache.js`, `scripts/quiz-merge.mjs`, `scripts/sync-public-data.mjs`; `node scripts/test-quiz-merge.mjs` (6/6 pass); xác nhận mọi file HTML đã sửa vẫn kết thúc bằng `</html>`; rà `grep` xác nhận không còn `mode:'no-cors'` nào trong Admin `index.html`. CHƯA test trên trình duyệt thật/dữ liệu thật (đúng quy tắc không ghi/xoá dữ liệu production để thử nghiệm).
- Bước tiếp theo: thầy xem lại diff trên nhánh `perf/cache-integrity-audit-20260819` (2 repo), yêu cầu push khi đồng ý; cập nhật mục này sau mỗi thay đổi đáng kể, không thêm một sổ bàn giao cạnh tranh.
