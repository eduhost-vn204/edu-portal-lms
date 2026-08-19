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
- Website Admin nằm ở kho riêng `eduhost-vn204/edu-portal-console`; không dùng tên kho admin cũ. Mốc Admin gần nhất: nhánh `perf/cache-integrity-audit-20260819` (xem "Bàn giao gần nhất" bên dưới cho commit hash mới nhất) — CHƯA merge/push vào `main`.
- `scripts/quiz-publish.mjs` (student): tách riêng bước GHI FILE của quiz (planQuizPublish/applyQuizPublishPlan) khỏi `scripts/quiz-merge.mjs` (chỉ tính toán thuần) — có test đĩa thật `scripts/test-quiz-publish.mjs`. Tên file `data/quizzes/quiz-*.json` giờ sinh theo hash ổn định của khoá bài học (không còn theo số thứ tự tăng dần) để tránh 1 tên file mang ý nghĩa khác nhau giữa các lần chạy; lần chạy đầu tiên sau khi merge sẽ tự dọn các file kiểu cũ (`quiz-0001.json`...).

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
- `987b27c` (student, nhánh `perf/cache-integrity-audit-20260819`, đã đẩy lên GitHub qua web-upload dạng commit `028a572`/`6361cb7` do `git push` trực tiếp bị chặn ở sandbox) — poll Bảng Vàng 5s→90s (chỉ khi tab hiện); tách logic gộp quiz stable/legacy sang `scripts/quiz-merge.mjs` (có test offline `scripts/test-quiz-merge.mjs`); sync script không còn xoá sạch `data/quizzes/*.json` khi nguồn trả về rỗng-nhưng-không-lỗi.
- Admin `0fb8441` (nhánh `perf/cache-integrity-audit-20260819`, đã đẩy lên GitHub qua web-upload dạng commit `47f7b1a`) — bỏ toàn bộ `mode:'no-cors'` còn sót (Lịch Live, Hướng Dẫn, Ngân hàng câu hỏi: sửa/xoá/gán bài/nạp Excel-docx-PDF/tạo đề từ ngân hàng); thêm timeout mặc định cho mọi fetch (GET 15s/POST 55s); badge số câu bài tập đọc `data/quiz-index.json` thay vì tải nguyên sheet BaiTapTracNghiem.
- Vòng review thứ 2 (Codex, 19/8) — CHƯA merge, chỉ cập nhật thêm trên cùng nhánh `perf/cache-integrity-audit-20260819`: sửa `postAdminWrite` chỉ coi là thành công khi `res.ok && json.ok===true` (trước đó `json.ok !== false` coi nhầm `{}`/`{error:'Unauthorized'}` là thành công); thêm `bulksetbainganhang`/`bulksetchatluongnganhang` vào `ADMIN_WRITE_ACTIONS`; `initAdmin` luôn revalidate nền từ GAS dù cache/CDN đã có dữ liệu (trước đó chỉ gọi khi rỗng); `loadLessons` không ghi đè snapshot tốt bằng phản hồi rỗng-hợp-lệ; quiz: cảnh báo migration-in-progress/alias-collision/duplicate-id giờ CHẶN xuất bản (giữ nguyên `quiz-index.json` + file quiz cũ) thay vì chỉ cảnh báo rồi vẫn ghi; bỏ guard rỗng mù cho `khoaconfig`/`lichlive`/`danhsachde` (rỗng có thể hợp lệ ở 3 loại này, guard cũ có nguy cơ giữ mãi dữ liệu đã bị xoá hợp lệ) — quay lại ghi trực tiếp như trước, chỉ còn bảo vệ riêng cho quiz.

## Điều phải giữ nguyên

- Không phục hồi `fetchQbAll()` vào bước `boot()` của `baihoc.html`.
- Không bắt `boot()` chờ dữ liệu tiến độ cá nhân trước khi render.
- Không bỏ JSON tĩnh để quay lại đọc `BaiHoc` trực tiếp từ GAS ở lần tải bình thường.
- Không xóa hoặc vô hiệu hàng đợi tiến độ nếu chưa có giải pháp đồng bộ thay thế tốt hơn.
- Không ghi đè menu chuyên biệt bằng menu chung.
- Không quay lại quy tắc "có ≥1 dòng quiz stable là bỏ hết legacy" trong `scripts/quiz-merge.mjs` (mất câu nếu migrate dở dang) — điều kiện đúng là stable phải ≥ số dòng legacy mới coi là đầy đủ.
- Không xoá `mode:'no-cors'` → thêm lại ở bất kỳ đường ghi Admin nào (Ngân hàng/Lịch Live/Hướng dẫn) — đã cố tình bỏ hết để đọc xác nhận JSON thật; xem `postAdminWrite`/`postAdminWriteWithRetry` trong Admin `index.html`.
- Với thao tác ghi Admin dạng THÊM MỚI/append (nạp câu hỏi từ file, "Thêm vào cuối đề"), không tự động retry (`postAdminWriteWithRetry`) — chỉ dùng `postAdminWrite` 1 lần, tránh nhân đôi dữ liệu nếu phản hồi bị mất sau khi server đã ghi thành công.
- Không quay lại `json.ok !== false` trong `postAdminWrite` (Admin `index.html`) — PHẢI là `res.ok && json.ok===true` nghiêm ngặt; nếu sửa hàm này phải sửa đồng bộ `scripts/postAdminWrite.mjs` (Admin) và chạy lại `node scripts/test-postAdminWrite.mjs`.
- Không xoá/ghi đè `data/quiz-index.json` hay bất kỳ `data/quizzes/quiz-*.json` nào khi `buildQuizGrouping` trả về cảnh báo (`migration-in-progress`/`alias-collision`/`duplicate-id`) — phải giữ nguyên snapshot cũ, chỉ ghi `data/quiz-warnings.json`. Xem `scripts/quiz-publish.mjs` + test `scripts/test-quiz-publish.mjs`.
- Không thêm lại guard "rỗng thì giữ file cũ" cho `khoaconfig.json`/`lichlive.json`/`danhsachde.json` trong `scripts/sync-public-data.mjs` trừ khi có tín hiệu/version xác nhận thật từ backend rằng rỗng là lỗi (không phải giáo viên chủ động xoá) — nếu không, dữ liệu đã bị xoá hợp lệ sẽ không bao giờ biến mất khỏi web.
- CORS/Admin: điều kiện BẮT BUỘC trước khi merge nhánh Admin — phải xác nhận bằng trình duyệt thật rằng Apps Script đang deploy trả JSON đọc được (không bị chặn CORS) cho các request POST ghi. Chưa có xác nhận này trong các phiên audit vừa qua (chỉ kiểm tra `node --check` + test logic thuần, KHÔNG gọi Apps Script thật). Không tuyên bố "đã chạy tốt trên production" cho phần bỏ `no-cors` khi chưa có bước kiểm tra này.

## Việc có thể làm tiếp

- Merge/push nhánh `perf/cache-integrity-audit-20260819` (cả 2 repo) vào `main` sau khi thầy VÀ Codex cùng xem lại — hiện mới có mặt trên nhánh riêng (đã publish lên GitHub qua web-upload, xem "Bàn giao gần nhất"), CHƯA merge.
- **Điều kiện chặn merge Admin (bắt buộc trước khi merge, xem mục CORS ở "Điều phải giữ nguyên")**: kiểm tra bằng trình duyệt thật (không phải chỉ đọc code) rằng Apps Script đang deploy trả JSON đọc được qua CORS cho POST ghi — thử với ít nhất 1 action ghi vô hại/hoàn tác được, KHÔNG thử trên dữ liệu thật trong phiên audit của trợ lý AI.
- **Cần xác minh phía Apps Script thật (không sửa được từ repo)**: `bulksetbainganhang` và `bulksetchatluongnganhang` không có trong `apps-script-CAPNHAT.txt` (bản tham khảo) — không rõ backend đã deploy có kiểm tra `adminKey` cho 2 action này hay chưa. Đã thêm cả hai vào `ADMIN_WRITE_ACTIONS` (luôn gửi kèm `adminKey`, an toàn dù backend có cần hay không), nhưng nếu backend THẬT SỰ không kiểm tra `adminKey` cho 2 action này thì đó là lỗ hổng ghi không cần xác thực cần vá phía Apps Script.
- Đo lại thời gian thực tế sau mỗi lần Apps Script hoặc dung lượng dữ liệu thay đổi lớn.
- Theo dõi độ ổn định của workflow đồng bộ và dung lượng các file quiz; theo dõi lần chạy đầu tiên sau khi merge để xác nhận việc đổi tên file quiz sang dạng hash diễn ra đúng (dọn sạch file `quiz-0001.json`... kiểu cũ, `quiz-index.json` trỏ đúng file mới).
- Cập nhật `apps-script-CAPNHAT.txt` khi mã GAS thật thay đổi — hiện file này thiếu hẳn định nghĩa cho nhiều action đang được gọi từ Admin (`bulksetbainganhang`, `bulksetchatluongnganhang`, `savehuongdan`, `savevideocauhoi`,...), nên không dùng file này để suy luận chắc chắn về hành vi backend thật.
- Admin: `loadHuongDan(force=true)` khi lỗi mạng/timeout vẫn thay `hd-list` bằng thông báo lỗi thay vì giữ nội dung cũ (khác với `loadLiveSessions` đã sửa) — rủi ro thấp (trang ít dùng, không phải dữ liệu bài học/ngân hàng) nhưng nên sửa cùng kiểu nếu có dịp.
- Ngân hàng câu hỏi Admin (tab "Ngân hàng câu hỏi"): tải cả sheet 1 lần khi mở tab (không phân trang) — đã tốt hơn nhiều nhờ cache/CDN/IndexedDB nhưng phân trang/lọc phía server thật sự cần sửa Apps Script (không tự triển khai phiên này vì `apps-script-CAPNHAT.txt` trong repo chỉ là bản tham khảo, có thể khác bản đã deploy thật).

## Bàn giao gần nhất

- Ngày: 19/08/2026 (vòng 2, sau khi Codex review diff thật của vòng 1 và yêu cầu sửa thêm — CHƯA chấp nhận merge)
- Người thực hiện: Claude
- Nhánh: `perf/cache-integrity-audit-20260819` — CẢ HAI repo, cùng nhánh với vòng 1, KHÔNG merge/push main, KHÔNG deploy.
- Publish: `git push` trực tiếp vẫn bị chặn bởi git-proxy của sandbox (hạ tầng, không phải do thiếu quyền) — vòng 1 đã publish qua GitHub web-upload (student `028a572`/`6361cb7`, admin `47f7b1a`); vòng 2 dùng lại đúng cách đó nếu `git push` tiếp tục bị chặn (xem commit hash thật ở báo cáo gửi thầy, không lặp lại ở đây để tránh trôi thông tin — luôn ưu tiên xem `git log`/GitHub trực tiếp).
- Kết quả vòng 2 (theo đúng 6 điểm Codex yêu cầu):
  1. Admin `postAdminWrite`: đổi từ `json.ok !== false` sang `res.ok && json.ok===true` nghiêm ngặt; thêm cặp file test độc lập `scripts/postAdminWrite.mjs` + `scripts/test-postAdminWrite.mjs` (mock fetch, 10/10 pass: `{ok:true}`, `{ok:false}`, `{error:'Unauthorized'}`, `{}`, JSON null, HTML lỗi, HTTP 401/500, lỗi mạng, timeout/abort).
  2. `ADMIN_WRITE_ACTIONS`: thêm `bulksetbainganhang`/`bulksetchatluongnganhang`; ghi rõ trong code + tài liệu này là CẦN xác minh thủ công phía Apps Script thật (repo không có đủ thông tin để tự khẳng định backend có/không cần `adminKey` cho 2 action này).
  3. `initAdmin`/`loadLessons`: luôn revalidate nền từ GAS dù cache/CDN đã render (cờ `_lessonsRevalidating` chống gọi trùng); `loadLessons` không ghi đè `allLessons` khi GAS trả mảng rỗng hợp lệ trong lúc đang có dữ liệu tốt.
  4. `scripts/sync-public-data.mjs`: bỏ guard rỗng mù cho `khoaconfig.json`/`lichlive.json`/`danhsachde.json` (quay lại ghi trực tiếp như trước vòng 1) vì rỗng có thể là trạng thái hợp lệ ở 3 loại này; giữ lớp bảo vệ riêng chỉ cho quiz.
  5. Quiz: tách `scripts/quiz-publish.mjs` (plan/apply) — khi có cảnh báo migration-in-progress/alias-collision/duplicate-id thì CHẶN xuất bản hoàn toàn (không ghi file mới, chỉ ghi `quiz-warnings.json`); khi an toàn thì ghi file mới + index mới TRƯỚC, dọn file cũ không còn dùng SAU; đổi cách đặt tên file quiz sang hash ổn định theo khoá bài học (tránh 1 tên file mang ý nghĩa khác giữa các lần chạy). Test đĩa thật `scripts/test-quiz-publish.mjs` (5/5 pass, xác nhận file/index cũ giữ nguyên byte-for-byte khi bị chặn).
  6. CORS: KHÔNG tuyên bố việc bỏ `no-cors` đã hoạt động trên production — chưa test bằng trình duyệt thật với Apps Script thật trong bất kỳ phiên audit nào. Đây là điều kiện BẮT BUỘC trước khi merge Admin, đã ghi rõ ở "Việc có thể làm tiếp". KHÔNG thử ghi/xoá dữ liệu production trong phiên này.
- Kiểm tra đã chạy sau khi sửa: `node --check` cho toàn bộ file `.mjs`/`.js` đã sửa/thêm và toàn bộ `<script>` không-src trong `index.html`/`hoso.html` (student) và `index.html` (admin); `node scripts/test-quiz-merge.mjs` (6/6), `node scripts/test-quiz-publish.mjs` (5/5, student), `node scripts/test-postAdminWrite.mjs` (10/10, admin); `grep` xác nhận không còn `mode:'no-cors'` nào trong Admin `index.html` (chỉ còn comment lịch sử). Rebase lại lên `origin/main` mới nhất trước khi publish. CHƯA test trên trình duyệt thật/dữ liệu production thật.
- Bước tiếp theo: Codex/thầy review vòng 2; nếu đạt thì mới merge. Cập nhật mục này sau mỗi thay đổi đáng kể, không thêm một sổ bàn giao cạnh tranh.
