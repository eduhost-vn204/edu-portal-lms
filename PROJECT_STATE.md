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
- `scripts/quiz-publish.mjs` (student): tách riêng bước GHI FILE của quiz (planQuizPublish/applyQuizPublishPlan) khỏi `scripts/quiz-merge.mjs` (chỉ tính toán thuần) — có test đĩa thật + fault-injection `scripts/test-quiz-publish.mjs`. Tên file `data/quizzes/quiz-*.json` là CONTENT-ADDRESSED (`fileNameForEntry` — hash theo CẢ khoá bài học lẫn nội dung dòng câu hỏi, dạng `quiz-[0-9a-f]{20}.json`), không phải theo số thứ tự hay theo khoá đơn thuần — đảm bảo publish thật sự atomic: ghi file mới TRƯỚC (không đè file cũ đang được index tham chiếu, vì nội dung khác nhau luôn ra tên khác nhau), cutover `quiz-index.json` bằng ghi-file-tạm-rồi-`rename()` (atomic trên POSIX), CHỈ SAU ĐÓ mới dọn file cũ không còn dùng. Lần chạy đầu tiên sau khi merge sẽ tự dọn các file kiểu cũ (`quiz-0001.json`... và `quiz-[0-9a-f]{10}.json` từ vòng 2).

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
- Vòng review thứ 3 (Codex, 19/8) — CHƯA merge, 2 blocker cuối: (1) quiz publish thật sự atomic — đổi tên file quiz sang content-addressed (`quiz-[0-9a-f]{20}.json`, hash theo khoá + nội dung, không còn hash-chỉ-theo-khoá của vòng 2), cutover `quiz-index.json` bằng ghi-file-tạm + `rename()`, thêm 3 test fault-injection (lỗi ghi file thứ 2, lỗi ghi file tạm index, lỗi rename) xác nhận snapshot cũ giữ nguyên byte-for-byte trong mọi trường hợp lỗi giữa chừng; (2) CORS — đề xuất action `pingadmin` (chưa deploy) trong `apps-script-CAPNHAT.txt` (repo Admin) + hướng dẫn test bằng trình duyệt thật (mục "Hướng dẫn test CORS Admin"), CORS vẫn là điều kiện chặn merge cho tới khi thầy tự test và xác nhận; (3) rebase lại nhánh student lên `origin/main` mới (có thêm commit data tự động).
- Vòng review thứ 4 (Codex, 19/8) — CHƯA merge, 1 lỗi atomic cuối trong Student: `applyQuizPublishPlan()` trước đây coi `readFile` THÀNH CÔNG (file tồn tại) là bằng chứng file content-addressed đã đầy đủ/đúng rồi `continue` bỏ qua ghi lại — SAI nếu lần chạy trước bị ngắt giữa chừng lúc `writeFile`, để lại file CẮT CỤT dưới đúng tên đó (tên content-addressed không tự bảo vệ khỏi trường hợp này vì file bị cắt cụt vẫn nằm đúng tên dự kiến của nội dung đầy đủ). Sửa trong `scripts/quiz-publish.mjs`: với mỗi file quiz, đọc nội dung hiện có (nếu tồn tại) và so sánh CHÍNH XÁC với `expectedContent`; chỉ bỏ qua khi khớp hoàn toàn; nếu không tồn tại hoặc không khớp, ghi `expectedContent` vào file tạm (`.${tên file}.tmp-${pid}-${random}`) trong CÙNG thư mục `data/quizzes/`, `rename()` sang tên đích chỉ sau khi ghi xong; dọn file tạm của chính lần chạy nếu thất bại (không đụng snapshot cũ). Thêm 2 test mới vào `scripts/test-quiz-publish.mjs`: (a) pre-seed file content-addressed đúng tên nhưng nội dung cắt cụt/sai trong 1 plan có 2 bài học — xác nhận publish KHÔNG skip mà ghi lại đầy đủ trước khi cutover index, index mới khớp `plan.index` cho cả 2 bài; (b) fault-injection lỗi khi ghi file TẠM của 1 quiz file (không phải index) — xác nhận snapshot cũ giữ nguyên byte-for-byte, file đích không được tạo, file tạm không sót lại. Thêm hàm `assertIndexConsistent()` chạy sau MỌI test (10 test cũ + 2 test mới = 12) để xác nhận `quiz-index.json` (nếu tồn tại) không bao giờ trỏ tới file thiếu hoặc JSON lỗi. `scripts/test-quiz-publish.mjs`: **12/12 pass**; `scripts/test-quiz-merge.mjs`: 6/6 pass (không đổi, chạy lại để kiểm tra hồi quy). KHÔNG đụng phần Admin/CORS trong vòng này.

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
- Không quay lại đặt tên file `data/quizzes/quiz-*.json` theo SỐ THỨ TỰ hay theo HASH-CHỈ-THEO-KHOÁ (bản vòng 2, `quiz-[0-9a-f]{10}.json`) — cả hai đều KHÔNG atomic vì có thể khiến 1 tên file mang nội dung khác nhau giữa các lần chạy, dẫn tới ghi đè file đang được `quiz-index.json` CŨ tham chiếu trước khi index mới kịp cutover. Tên file BẮT BUỘC phải content-addressed (hash theo CẢ khoá bài học lẫn nội dung dòng câu hỏi — `fileNameForEntry` trong `scripts/quiz-publish.mjs`, dạng `quiz-[0-9a-f]{20}.json`).
- Không ghi `data/quiz-index.json` trực tiếp (writeFile thẳng vào đường dẫn đích) trong `applyQuizPublishPlan` — PHẢI ghi ra file tạm trong cùng thư mục `data/` rồi `rename()` để cutover atomic (xem `scripts/quiz-publish.mjs`). Không xoá file `quiz-*.json` cũ trước khi bước rename này thành công.
- Không coi `readFile` THÀNH CÔNG (file content-addressed đã tồn tại đúng tên) là bằng chứng nội dung đã đầy đủ/đúng rồi bỏ qua ghi lại trong `applyQuizPublishPlan` — file có thể bị CẮT CỤT do lần chạy trước bị ngắt giữa chừng lúc `writeFile`. PHẢI đọc và so sánh CHÍNH XÁC với `expectedContent`; chỉ skip khi khớp hoàn toàn. Nếu không khớp hoặc không tồn tại, PHẢI ghi qua file tạm cùng thư mục rồi `rename()` (giống cơ chế của `quiz-index.json`) trước khi coi file đó là sẵn sàng cho index mới tham chiếu. Xem `scripts/quiz-publish.mjs` + test `scripts/test-quiz-publish.mjs`.
- Không thêm lại guard "rỗng thì giữ file cũ" cho `khoaconfig.json`/`lichlive.json`/`danhsachde.json` trong `scripts/sync-public-data.mjs` trừ khi có tín hiệu/version xác nhận thật từ backend rằng rỗng là lỗi (không phải giáo viên chủ động xoá) — nếu không, dữ liệu đã bị xoá hợp lệ sẽ không bao giờ biến mất khỏi web.
- CORS/Admin: điều kiện BẮT BUỘC trước khi merge nhánh Admin — phải xác nhận bằng trình duyệt thật rằng Apps Script đang deploy trả JSON đọc được (không bị chặn CORS) cho POST. Chưa có xác nhận này trong bất kỳ phiên audit nào (chỉ kiểm tra `node --check` + test logic thuần, KHÔNG gọi Apps Script thật). Không tuyên bố "đã chạy tốt trên production" cho phần bỏ `no-cors` khi chưa có bước kiểm tra này. Xem mục "Hướng dẫn test CORS Admin" bên dưới.

## Việc có thể làm tiếp

- Merge/push nhánh `perf/cache-integrity-audit-20260819` (cả 2 repo) vào `main` sau khi thầy VÀ Codex cùng xem lại — hiện mới có mặt trên nhánh riêng (đã publish lên GitHub qua web-upload, xem "Bàn giao gần nhất"), CHƯA merge.
- **Điều kiện chặn merge Admin (bắt buộc trước khi merge, xem mục CORS ở "Điều phải giữ nguyên" và "Hướng dẫn test CORS Admin" bên dưới)**: kiểm tra bằng trình duyệt thật (không phải chỉ đọc code) rằng Apps Script đang deploy trả JSON đọc được qua CORS cho POST — dùng action `pingadmin` (đề xuất, xem hướng dẫn), KHÔNG thử trên dữ liệu thật.

## Hướng dẫn test CORS Admin (bắt buộc trước khi merge Admin)

Đã rà toàn bộ danh sách action trong `doPost()` của `apps-script-CAPNHAT.txt` (bản tham khảo trong repo `edu-portal-console`): **không có action nào chỉ-đọc/không-mutation** để test an toàn — mọi action đều ghi/xoá Sheets, hoặc (`login`/`register`) cần thông tin đăng nhập thật. Vì vậy đã thêm 1 đề xuất `pingadmin` (CHƯA deploy, CHƯA wire vào `doPost`) ở đầu file `apps-script-CAPNHAT.txt` bên repo Admin — chỉ xác thực `adminKey` rồi trả `{ok:true}`, không đụng Sheets.

Các bước thầy tự làm (trợ lý AI không tự deploy Apps Script):

1. Mở Apps Script editor thật, làm theo hướng dẫn trong comment đầu file `apps-script-CAPNHAT.txt` (repo `edu-portal-console`) để thêm action `pingadmin`, rồi **Deploy > Manage deployments > New version > Deploy** (dùng đúng deployment web app đang phục vụ Admin thật).
2. Lấy file `index.html` từ nhánh `perf/cache-integrity-audit-20260819` (repo `edu-portal-console`) — tải trực tiếp từ GitHub (Raw) hoặc `git fetch`/`checkout` nhánh này về máy thầy.
3. Phục vụ file này qua 1 static server cục bộ (KHÔNG mở trực tiếp kiểu `file://`, vì hành vi CORS/fetch của `file://` khác với origin HTTPS thật và có thể cho kết quả sai lệch) — ví dụ: `python3 -m http.server 8000` trong thư mục chứa `index.html`, rồi mở `http://localhost:8000/index.html`.
4. Đăng nhập Admin bằng mật khẩu thật (hash so sánh phía client, hoạt động y hệt như bản đang chạy thật).
5. Mở DevTools (F12) > tab Console, chạy: `await postAdminWrite({action:'pingadmin'})` — kỳ vọng trả về `true` và KHÔNG có lỗi CORS nào hiện trong Console.
6. Kiểm tra tab Network: request POST tới `script.google.com/.../exec` phải có status 200, Response đọc được là JSON `{"ok":true,...}` (không phải "opaque"/(failed)/net::ERR_FAILED).
7. Lặp lại vài lần (an toàn vì `pingadmin` không đụng Sheets) để chắc chắn không phải ngẫu nhiên/race.
8. Chỉ khi bước 5–6 xác nhận đọc được JSON thật, mới coi điều kiện CORS là ĐÃ ĐẠT — cập nhật lại mục này trong `PROJECT_STATE.md` (ghi rõ ngày, ai test, kết quả) trước khi yêu cầu merge nhánh Admin.

**Ghi chú giảm rủi ro (không phải bằng chứng đã verify, chỉ để tham khảo mức độ khả quan)**: GET hiện tại của cùng Apps Script này đã hoạt động bình thường không qua `no-cors` từ lâu (`loadLessons`, `loadLiveSessions`,... đều `fetch(...).then(r=>r.json())` trực tiếp) — cho thấy deployment này nhìn chung cho phép đọc response cross-origin. Code POST cũng cố tình dùng `Content-Type: text/plain;charset=utf-8` (không phải `application/json`) để tránh trigger CORS preflight (Apps Script webapp không xử lý preflight OPTIONS). Cả hai điều này khiến khả năng CORS hoạt động đúng cho POST là khá cao, nhưng đây vẫn là suy luận — CHƯA phải xác nhận thật, không thay thế được bước test bằng trình duyệt ở trên.
- **Cần xác minh phía Apps Script thật (không sửa được từ repo)**: `bulksetbainganhang` và `bulksetchatluongnganhang` không có trong `apps-script-CAPNHAT.txt` (bản tham khảo) — không rõ backend đã deploy có kiểm tra `adminKey` cho 2 action này hay chưa. Đã thêm cả hai vào `ADMIN_WRITE_ACTIONS` (luôn gửi kèm `adminKey`, an toàn dù backend có cần hay không), nhưng nếu backend THẬT SỰ không kiểm tra `adminKey` cho 2 action này thì đó là lỗ hổng ghi không cần xác thực cần vá phía Apps Script.
- Đo lại thời gian thực tế sau mỗi lần Apps Script hoặc dung lượng dữ liệu thay đổi lớn.
- Theo dõi độ ổn định của workflow đồng bộ và dung lượng các file quiz; theo dõi lần chạy đầu tiên sau khi merge để xác nhận việc đổi tên file quiz sang dạng content-addressed diễn ra đúng (dọn sạch file `quiz-0001.json`... và `quiz-[0-9a-f]{10}.json` kiểu cũ, `quiz-index.json` trỏ đúng file mới, không còn file `.quiz-index.json.tmp-*` sót lại nếu có lần chạy bị ngắt giữa chừng — các file tạm này vô hại, có thể xoá thủ công nếu tồn đọng lâu).
- Cập nhật `apps-script-CAPNHAT.txt` khi mã GAS thật thay đổi — hiện file này thiếu hẳn định nghĩa cho nhiều action đang được gọi từ Admin (`bulksetbainganhang`, `bulksetchatluongnganhang`, `savehuongdan`, `savevideocauhoi`,...), nên không dùng file này để suy luận chắc chắn về hành vi backend thật.
- Admin: `loadHuongDan(force=true)` khi lỗi mạng/timeout vẫn thay `hd-list` bằng thông báo lỗi thay vì giữ nội dung cũ (khác với `loadLiveSessions` đã sửa) — rủi ro thấp (trang ít dùng, không phải dữ liệu bài học/ngân hàng) nhưng nên sửa cùng kiểu nếu có dịp.
- Ngân hàng câu hỏi Admin (tab "Ngân hàng câu hỏi"): tải cả sheet 1 lần khi mở tab (không phân trang) — đã tốt hơn nhiều nhờ cache/CDN/IndexedDB nhưng phân trang/lọc phía server thật sự cần sửa Apps Script (không tự triển khai phiên này vì `apps-script-CAPNHAT.txt` trong repo chỉ là bản tham khảo, có thể khác bản đã deploy thật).

## Bàn giao gần nhất

### 11/09/2026 — Hoàn Tất Triển Khai & Xuất Bản Toàn Diện Bài 11 Lên Website Vật Lý Xuân Trường (Video YouTube, PDF Drive, Quiz 20 Câu)

- **Người thực hiện**: Antigravity AI Coordinator
- **Người nhận bàn giao**: Thầy Xuân Trường & Codex
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã hoàn tất 100% học liệu thực tế, kiểm thử tự động 7/7 pass, sẵn sàng merge `main` theo phê duyệt của Thầy).
- **Học liệu nguồn chính thức sử dụng**:
  - Thư mục nguồn: `D:\Work\Dạy học\Xây Dựng Lộ Trình XPS 2k9\Triển khai\GĐ1 - Chuyên đề Lý thuyết\Chương 2\Bài 11 - Định luật Boyle – Quá trình đẳng nhiệt`
  - Đầy đủ 7 file học liệu:
    1. `Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Ban Lí thuyết.docx`
    2. `Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập áp dụng.docx` (20 câu áp dụng kèm đáp án)
    3. `Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập áp dụng - wed.docx`
    4. `Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập luyện tập.docx` (20 câu kèm lời giải chi tiết và bảng đáp án)
    5. `Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập luyện tập - wed.docx` (20 câu trắc nghiệm có sao `*`)
    6. `Bài 11. Lý thuyết.mp4` (1273.6 MB, 1080p)
    7. `Bài 11. Luyện tập .mp4` (1322.7 MB, 1080p)
- **Các tài nguyên số hóa thực tế đã đưa lên hạ tầng**:
  1. **Video YouTube (Kênh Thầy `Xuân Trường Nguyễn` `UC12n9QGGCnI3mJke_XswlZg`, chế độ `unlisted`)**:
     - Video Lý thuyết: `https://www.youtube.com/watch?v=yHYNTWS1iCA` (ID: `yHYNTWS1iCA`, HTTP 200 oEmbed)
     - Video Luyện tập: `https://www.youtube.com/watch?v=hl0yjy331xw` (ID: `hl0yjy331xw`, HTTP 200 oEmbed)
  2. **Tài liệu PDF Google Drive (Chuyển đổi Word chuẩn Microsoft Word 16.0 COM, phân quyền `anyone: reader`)**:
     - PDF Lý thuyết: `https://drive.google.com/file/d/1P9Bn0-KXrf1hA2NyNE5UE6HxOu91xINX/view?usp=sharing` (ID: `1P9Bn0-KXrf1hA2NyNE5UE6HxOu91xINX`)
     - PDF Áp dụng: `https://drive.google.com/file/d/1q011XVLDrVEg0SW1g6VHPBzKIFLz1nFn/view?usp=sharing` (ID: `1q011XVLDrVEg0SW1g6VHPBzKIFLz1nFn`)
     - PDF Luyện tập: `https://drive.google.com/file/d/1n47DgcucFgz8nr_DGdxy3FCNr62375Bi/view?usp=sharing` (ID: `1n47DgcucFgz8nr_DGdxy3FCNr62375Bi`)
- **Các thay đổi trong kho mã**:
  1. `data/baihoc.json`:
     - Bản ghi chính thức Bài 11 (`MaBai`: `B4ca24b64572f`, `ThuTuBai`: 4, `TenBai`: `B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT`, `TrangThai`: `""`).
     - Gắn đầy đủ 2 URL YouTube (`Video`, `VideoGiai`) và 3 URL Google Drive (`PDFLyThuyet`, `PDF`, `PDFLuyenTap`).
     - Tổng số bài học toàn website là 41 bài.
  2. `data/quizzes/quiz-c88214ff9cb9bfffe1d1.json`:
     - 20/20 câu hỏi trắc nghiệm luyện tập thực tế từ file Word của Thầy theo chuẩn content-addressed.
     - Khớp 100% bảng đáp án chính thức (`1D 2A 3C 4D 5A 6B 7A 8C 9A 10C 11B 12B 13B 14D 15A 16A 17B 18D 19D 20C`).
  3. `data/quiz-index.json`:
     - Trỏ Bài 11 tới `data/quizzes/quiz-c88214ff9cb9bfffe1d1.json?v=mtw6s40z` với `count: 20`.
  4. `scripts/test-b11-publish.mjs`:
     - Suite kiểm thử tự động 7/7 pass toàn diện: kiểm tra cấu trúc 41 bài, quiz content-addressed, VM test `buildCourses`, tính ổn định số buổi (Buổi 10 -> Buổi 11 -> Buổi 12 -> Buổi 13), điều hướng trước/sau, KaTeX, và các URL Video YouTube / PDF Drive.
- **Hành vi trên website học sinh (`baihoc.html#lesson/B4ca24b64572f`)**:
  - Giao diện bài học mở ngay lập tức từ JSON tĩnh mà không phụ thuộc độ trễ Google Apps Script.
  - Hiển thị 2 tab Video (Video bài giảng lý thuyết và Video chữa bài tập luyện tập), xem mượt mà trên nhúng YouTube.
  - Hiển thị 3 tab tài liệu PDF: "Lý thuyết", "Bài tập áp dụng" (20 câu cơ bản có đáp án), "Tài liệu luyện tập" (20 câu có lời giải chi tiết).
  - Tab "Luyện tập trắc nghiệm (20)" nạp 20 câu trắc nghiệm chấm điểm tự động.
  - Điều hướng: [Bài trước: B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG] $\leftarrow$ B11 $\rightarrow$ [Bài sau: B12. ĐỊNH LUẬT CHARLES - QUÁ TRÌNH ĐẲNG ÁP].
- **Kết quả kiểm thử**:
  - `node scripts/test-b11-publish.mjs`: **7/7 PASS (100%)**.
  - `node scripts/test-quiz-publish.mjs`: **12/12 PASS (100%)**.
  - `node scripts/test-quiz-merge.mjs`: **6/6 PASS (100%)**.
  - `node scripts/test-student-stable-session-num.mjs`: **8/8 PASS (100%)**.
  - Thẻ `</html>` và cú pháp JS nguyên vẹn 100%.
- **Cam kết an toàn**:
  - Toàn bộ 40 bài học cũ, tiến độ học tập của học sinh, và hàng đợi ngoại tuyến `vlxt_progress_queue_v1` nguyên vẹn 100%.
  - Zero token/secret rò rỉ trong git history.


### 10/09/2026 — Hoàn thiện 3 Master Preview với Logo XT chính thức & Bố cục Editorial Hero

- **Người thực hiện**: Antigravity AI Coordinator
- **Yêu cầu của Thầy**:
  1. Loại bỏ hoàn toàn placeholder `BRAND_ASSET_PENDING`, dùng trực tiếp 2 file logo thật Thầy cung cấp:
     - `dbdce6d7-dc61-48b0-a04a-f29afea5a964.jpg`: Logo đầy đủ XT + VẬT LÝ XUÂN TRƯỜNG cho Bìa và Kết.
     - `980c10d8-3d8c-4405-89f5-d4b489013159.jpg`: Monogram XT nhỏ cho slide nội dung.
     - Crop sạch viền/khoảng trắng thừa, giữ nguyên hình, không vẽ lại.
  2. Thiết kế lại 3 Master với bố cục đặc trưng hơn: Bỏ hoàn toàn 3 card lặp lại trên slide bìa; thay bằng layout Hero phân tầng kết hợp panel lộ trình 3 bước cốt lõi.
  3. Duy trì nghiêm ngặt các quy chuẩn: `Biên soạn: Xuân Trường`, URL `vatlyxuantruong.io.vn`, không tràn/chồng chữ, đúng vật lý 100%.
- **Kết quả thực hiện & Kiểm định thị giác độc lập (Visual QA Review)**:
  - File HTML: [`teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/master-review.html`](file:///d:/Work/D%E1%BA%A1y%20h%E1%BB%8Dc/Trang%20wed/X%C3%A2y%20wed%20h%E1%BB%8Dc%20v%E1%BA%ADt%20l%C3%BD/teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/master-review.html)
  - Đã render 3 ảnh 1920×1080 tại `qa-renders/`:
    + `master_01_bia.png`: Logo XT đầy đủ sắc nét; tiêu đề lớn `ĐỊNH LUẬT BOYLE` / `QUÁ TRÌNH ĐẲNG NHIỆT`; panel cấu trúc bài học 3 bước bên phải (`01`, `02`, `03`).
    + `master_02_pittong.png`: Monogram XT chính thức góc trên trái; sơ đồ xilanh pít-tông phẳng dạng vector sạch sẽ; ngắt dòng tự nhiên không hyphenate; nhãn $F_{\text{ngoài}}$, $p$, $V_1, V_2$, $T = \text{hằng số}$.
    + `master_03_dothi.png`: Monogram XT chính thức; đồ thị $(p, V)$ chính xác 100% về vật lý: 2 nhánh hypebol giảm dần, $T_2$ (đỏ) luôn ở trên $T_1$ (navy), đường gióng $V_0$ chứng minh $p_2 > p_1 \implies T_2 > T_1$.
  - Trạng thái kiểm định: **`VISUAL_QA_PASS`** (Độc lập rà soát lỗi thị giác, logo thật, URL, tác giả, không đè chữ, đúng vật lý).
  - Trạng thái bàn giao: **`PENDING_TEACHER_SELECTION`** (Chờ Thầy xem 3 master và phê duyệt phong cách).
- **Hàng rào an toàn**: Không tạo Canva, không tạo PPTX, không nạp LMS/Drive/YouTube, không sửa production.

- **Vấn đề & Yêu cầu của Thầy**:
### 09/09/2026 — Hotfix Admin Console: Revalidate Admin Authenticated Để Hiển Thị Bài Draft (B11)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã merge và triển khai thành công lên GitHub Pages Admin).
- **Phạm vi & Kho lưu trữ**:
  - **Admin Repo**: `_codex_verify_live` (`https://github.com/eduhost-vn204/edu-portal-console.git`).
  - **Hotfix Branch**: `codex/hotfix-admin-init-draft-revalidate` (Commit: `a97c333`).
  - **PR**: https://github.com/eduhost-vn204/edu-portal-console/pull/2 (Merged: `5e7c59e`).
  - **Rollback Tag**: `rollback-before-admin-draft-init-20260909` trỏ `2bc2aae94424c3e70aaee2963ad344568be2292a`.
- **Nguyên nhân sự cố & Khắc phục**:
  - **Nguyên nhân**: `initAdmin()` trong `quan-ly-bai-hoc.html` gọi `loadLessonsPreview()` nạp 40 bài công khai (đã lọc ẩn draft fail-closed), sau đó chỉ gọi `loadLessons()` khi `allLessons.length === 0`. Do preview đã có 40 bài, `loadLessons()` (sử dụng POST `getbaihocadmin`) không bao giờ được gọi, khiến bài Draft (B11) bị ẩn trên giao diện Admin.
  - **Khắc phục**:
    1. Trong `initAdmin()`: Luôn gọi `loadLessons()` vô điều kiện sau preview/settings/config để revalidate bằng admin POST `getbaihocadmin`, thay thế `allLessons` bằng danh sách quản trị đầy đủ gồm bài Draft.
    2. Trong `loadLessons()`: Chỉ chèn dòng loading spinner khi `!allLessons.length`, giữ nguyên DOM preview mượt mà trong khi revalidate nền.
    3. Thêm bộ kiểm thử hồi quy `scripts/test-admin-init-draft-revalidate.mjs` (3/3 pass) chứng minh: preview công khai có 40 bài không có B11, `getbaihocadmin` trả 41 bài có B11, UI render huy hiệu Draft, và cache preview trong `localStorage` không chặn revalidate.
- **Kiểm thử & Xác minh Thực tế**:
  - `test-admin-init-draft-revalidate.mjs`: **3/3 PASS (100%)**.
  - `test-admin-form-safety.mjs`: **8/8 PASS (100%)**.
  - `test-draft-lesson-contract.mjs`: **31/31 PASS (100%)**.
### 09/09/2026 — Hotfix Student LMS: Định Danh Ổn Định Số Buổi / Số Bài Học (Khắc Phục Lệch Buổi Khi Ẩn B11 Draft)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã merge và triển khai thành công lên GitHub Pages Student LMS).
- **Phạm vi & Kho lưu trữ**:
  - **Student Repo**: `student_upstream_clean` (`https://github.com/eduhost-vn204/edu-portal-lms.git`).
  - **Hotfix Branch**: `codex/hotfix-student-stable-session-num` (Commit: `eff3883`).
  - **PR**: https://github.com/eduhost-vn204/edu-portal-lms/pull/2 (Merged: `b0f9233`).
  - **Rollback Tag**: `rollback-before-student-session-num-20260909` trỏ `94782e5` (đã push upstream).
- **Nguyên nhân sự cố & Khắc phục**:
  - **Nguyên nhân**: Trong `baihoc.html`, nhãn `Buổi` và `Bxx.` được sinh bằng cách duyệt tuần tự mảng `ch.lessons` sau khi đã lọc bỏ bài Draft. Khi bài B11 bị ẩn vì là Draft, bài B12 nhận index 11 (hiển thị thành "Buổi 11"), bài B13 nhận index 12 (hiển thị thành "Buổi 12").
  - **Khắc phục**:
    1. Bổ sung hàm `getLessonSessionNum(l, fallbackIndex)`: Trích xuất số bài ổn định ưu tiên từ `TenBai`/`name` dạng `Bxx`, `Bài xx`, `Buổi xx`, `Ngày xx` (hoặc `MaBai` / `ThuTuBai`), tuyệt đối không phụ thuộc index sau lọc.
    2. Áp dụng `getLessonSessionNum` đồng bộ tại 4 vị trí: danh sách bài toàn khóa (`renderCourse`), tiêu đề bài đang học (`renderLesson`), thanh sidebar (`side-item`), và chế độ xem live (`renderLiveLesson`).
    3. Thêm bộ kiểm thử hồi quy `scripts/test-student-stable-session-num.mjs` (8/8 pass) xác nhận: khi B11 là Draft thì B11 hoàn toàn không render, B12 giữ nguyên nhãn `Buổi 12` / `B12.`, B13 giữ nguyên nhãn `Buổi 13` / `B13.`, cùng các kiểm thử đơn vị trích xuất số bài.
- **Kiểm thử & Xác minh Thực tế**:
  - `test-student-stable-session-num.mjs`: **8/8 PASS (100%)**.
  - `test-teaching-scope.mjs`: **14/14 PASS (100%)**.
  - Cú pháp HTML/JS & `git diff --check`: Không lỗi, thẻ `</html>` nguyên vẹn, 17/17 thẻ script cú pháp hợp lệ.
  - **Triển khai GitHub Pages**: Workflow `Deploy to GitHub Pages` (run `34260122287`) và `pages build and deployment` (run `34260121706`) thành công (`success`).
  - **Xác minh Trực tiếp Live Site (`https://vatlyxuantruong.io.vn/baihoc.html`)**:
    - Mã nguồn triển khai đã cập nhật hàm `getLessonSessionNum(l, fallbackIndex)`.
    - B11 Draft bị ẩn hoàn toàn khỏi danh sách học sinh.
    - Bài B12 giữ nguyên nhãn `Buổi 12`, bài B13 giữ nguyên nhãn `Buổi 13`.

### 09/09/2026 — Chuẩn Hóa Tài Liệu Quy Chuẩn Xưởng Xuất Bản Bài Học Tự Động (AUTO_PUBLISH_LESSON_SPEC.md)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `SPEC_PUBLISHED`
- **Mô tả tài liệu**:
  - Soạn thảo quy chuẩn toàn diện [AUTO_PUBLISH_LESSON_SPEC.md](file:///d:/Work/D%E1%BA%A1y%20h%E1%BB%8Dc/Trang%20wed/X%C3%A2y%20wed%20h%E1%BB%8Dc%20v%E1%BA%ADt%20l%C3%BD/AUTO_PUBLISH_LESSON_SPEC.md) dựa trên thực tiễn nạp Pilot B11 thành công 100%.
  - Bao gồm 9 phần chi tiết:
    1. Mục tiêu & 4 nguyên tắc cốt lõi (Fail-Closed, Zero Credential Leak, Data Integrity, Teacher-Controlled Publish).
    2. Cấu trúc gói học liệu đầu vào (`manifest.json` schema, 2 video MP4, 3 PDF, 20 câu video timestamp, 20 câu bài tập).
    3. 6 Preflight Gates nghiêm ngặt (Contract & Syntax, Exact Backend Match 1 độc bản duy nhất, Snapshot Integrity, Input Package Validation, Trial Profile Isolation, Fail-Closed Draft State).
    4. Cờ lệnh `--mode=trial` (Private, thư mục trial, trạng thái draft) vs `--mode=live` (Unlisted, published khi Thầy duyệt).
    5. Checkpoint, resume (`.checkpoint.json`) và tính bất biến (idempotency).
    6. Quy trình đối soát nghiệm thu 7 cổng độc lập (read-back 11 trường, 20/20 câu video, 20/20 câu bài tập, public leak check qua 3 public endpoints, bảo vệ bài lân cận B10 nguyên vẹn).
    7. Quy trình Thầy duyệt Draft trên Admin Console rồi xuất bản.
    8. Quy trình rollback và khôi phục snapshot tự động/thủ công.
    9. 5 điều cấm tuyệt đối (không đọc secret/localStorage/token, không tự publish, không ghi đè bài gốc, không bypass gates, không sửa nóng trên main).

### 09/09/2026 — Hotfix Tài Liệu Quy Chuẩn: Loại Bỏ Hoàn Toàn Cơ Chế Tự Publish Của AI, Siết Chặt Fail-Closed Rollback & Cảnh Báo B11

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `HOTFIX_DOCS_COMPLETE` (Chỉ cập nhật tài liệu quy chuẩn, tuyệt đối không can thiệp code hay dữ liệu production).
- **Phạm vi cập nhật**:
  - `student_upstream_clean/AUTO_PUBLISH_LESSON_SPEC.md`
  - `_codex_verify_live/AUTO_PUBLISH_LESSON_SPEC.md`
  - `00-BRAIN-VLXT/tasks/AUTO_PUBLISH_LESSON_SPEC.md`
- **Nội dung điều chỉnh chi tiết**:
  1. **Mục 4: Chế độ thực thi (`trial-draft` vs. `approved-assets-draft`)**:
     - Loại bỏ hoàn toàn mọi cơ chế/diễn đạt cho phép pipeline tự động chuyển trạng thái bài học sang `published`.
     - Quy định chuẩn: Mọi chế độ của pipeline chỉ được ghi ở trạng thái `draft`. Chế độ `approved-assets-draft` nạp học liệu chính thức (YouTube unlisted, Drive thư mục chính thức) nhưng trạng thái trên backend BẮT BUỘC VẪN LÀ `draft`.
     - Pipeline luôn kết thúc tại trạng thái `READY_FOR_TEACHER`.
     - Quyền chuyển `Published` thuộc về 100% duy nhất một mình Thầy thao tác trực tiếp trên Admin Console UI (`quan-ly-bai-hoc.html`). Xóa bỏ hoàn toàn câu chữ "AI có thể publish khi được phê duyệt bằng văn bản".
  2. **Cảnh báo bảo vệ B11 Pilot**:
     - Bổ sung cảnh báo nghiêm ngặt: Bài học B11 hiện đang dùng học liệu demo sao chép từ B10 để kiểm thử pipeline; B11 phải giữ trạng thái draft cho đến khi học liệu demo B10 được thay toàn bộ bằng học liệu Boyle thật và bài học được nghiệm thu lại theo đủ 7 audit gates.
  3. **Mục 6 & 8: Quy tắc Rollback an toàn (Fail-Closed & Stop)**:
     - Khi gặp bất kỳ lỗi nào hoặc đối soát nghiệm thu thất bại: Pipeline mặc định **DỪNG (STOP)**, bảo tồn nguyên trạng file `snapshot_<mabai>_before.json`, cập nhật `.checkpoint.json` với trạng thái `MANUAL_RECOVERY_REQUIRED`.
     - Tuyệt đối KHÔNG tự ý xóa video YouTube, xóa file Drive, hay tự ý gửi payload khôi phục backend nếu chưa có lệnh rõ ràng của Thầy. Giữ nguyên hiện trường phục vụ tra cứu.
     - Quy trình khôi phục snapshot trở thành phương án khôi phục thủ công khi có chỉ thị trực tiếp từ Thầy.
  4. **Mục 9: Các điều cấm tuyệt đối**:
     - Bổ sung điều cấm AI tự động publish dưới mọi hình thức và điều cấm tự tiện xóa tài nguyên / tự ý rollback production khi chưa có chỉ thị rõ ràng của Thầy.


### 09/09/2026 — Hotfix Admin Console: Đồng Bộ Hóa Hợp Đồng Draft & initAdmin Revalidation Vào index.html (PR #5)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã merge và triển khai thành công lên GitHub Pages Admin Console).
- **Phạm vi & Kho lưu trữ**:
  - **Admin Repo**: `_codex_verify_live` (`https://github.com/eduhost-vn204/edu-portal-console.git`).
  - **Branch**: `codex/hotfix-admin-index-draft-sync` (Commit: `550722d`).
  - **PR**: https://github.com/eduhost-vn204/edu-portal-console/pull/5 (Merged: `a6f9b1f`).
  - **Rollback Tag**: `rollback-before-admin-draft-init-20260909` trỏ `2bc2aae94424c3e70aaee2963ad344568be2292a`.
- **Nguyên nhân sự cố & Khắc phục**:
  - **Nguyên nhân**: Khi Thầy truy cập `https://eduhost-vn204.github.io/edu-portal-console/` hoặc click vào drawer menu ở bất kỳ trang nào trong console, URL thực tế nạp file `index.html`. Trước đây các hotfix PR #1 và PR #2 chỉ áp dụng trên file `quan-ly-bai-hoc.html` nên `index.html` chưa có hợp đồng Draft, không có bộ lọc trạng thái và bị chặn bởi preview 40 bài công khai.
  - **Khắc phục**:
    1. Đồng bộ toàn bộ hợp đồng Draft từ `quan-ly-bai-hoc.html` sang `index.html`: thêm dropdown `f-trangthai`, bộ lọc trạng thái `currentStatusFilter`, và `initAdmin()` luôn revalidate bằng `getbaihocadmin` sau preview.
    2. Bảo toàn nguyên vẹn tính năng xuất OMML Word mới được thêm trên `index.html`.
    3. Cập nhật test suite `scripts/test-admin-init-draft-revalidate.mjs` chạy tự động trên cả 2 file `quan-ly-bai-hoc.html` và `index.html` (5/5 PASS).
- **Kiểm thử & Xác minh Thực tế**:
  - `test-admin-init-draft-revalidate.mjs`: **5/5 PASS (100%)**.
  - `test-admin-form-safety.mjs`: **8/8 PASS (100%)**.
  - `test-draft-lesson-contract.mjs`: **31/31 PASS (100%)**.
  - **Deploy GitHub Pages**: Workflow run `34264091966` thành công (`success`).
  - **Xác minh Trực tiếp Live**:
    1. Trang chủ Admin Console (`https://eduhost-vn204.github.io/edu-portal-console/`): Hiển thị đầy đủ bộ lọc trạng thái, bài B11 Draft xuất hiện trong "Chương 2 – Khí lí tưởng" với huy hiệu cam, mở form có đầy đủ video và 3 file PDF học liệu.
    2. Trang Học sinh (`https://vatlyxuantruong.io.vn/baihoc.html`): Endpoint công khai trả 40 bài, B11 Draft ẩn 100%, số buổi B12, B13 ổn định.
    3. Không deploy GAS, không thay đổi bất kỳ trường dữ liệu nào của B11 hay các bài khác.


### 09/09/2026 — Đồng Bộ Dữ Liệu Tĩnh Public LMS (B11: 20/20 Câu) & PR Bổ Sung Quy Chuẩn Post-Publish Static LMS Sync Gate

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_MERGED` (Đã merge cả 2 PR vào `main` và đối chiếu commit thành công).
- **Phạm vi & Kho lưu trữ**:
  - **Student Repo**: `student_upstream_clean` (`https://github.com/eduhost-vn204/edu-portal-lms.git`).
  - **Admin Repo**: `_codex_verify_live` (`https://github.com/eduhost-vn204/edu-portal-console.git`).
  - **Workflow Sync**: Run `34265555228` (`workflow_dispatch` trên `main`), Commit data: `7922138` và `e49bbda`.
  - **Pages Deployment**: Run `34265578917` (`success`).
  - **Student PR #5**: https://github.com/eduhost-vn204/edu-portal-lms/pull/5 (Merged: `a98d2b7`, Commit spec: `c50b394`).
  - **Admin PR #6**: https://github.com/eduhost-vn204/edu-portal-console/pull/6 (Merged: `fb8ee04`, Commit spec: `69ed78e`).
- **Kết quả đối soát live 20/20 câu hỏi**:
  1. `data/quiz-index.json` trên live CDN: Khóa `B4ca24b64572f` đã cập nhật chính xác từ 7 lên **`count: 20`**, trỏ tới file `data/quizzes/quiz-8177823fcbb70af6eff8.json`.
  2. File quiz tĩnh: Phản hồi HTTP 200, parse JSON hợp lệ, chứa đúng **20 câu hỏi** trắc nghiệm có đầy đủ thân câu (`question`), 4 phương án (`optA`-`optD`) và đáp án chuẩn (`correct`).
  3. Web học sinh (`baihoc.html`): Tải đúng metadata, hiển thị nhãn tab **`Luyện tập trắc nghiệm (20)`**, học sinh làm được đầy đủ từ câu 1 đến câu 20.
  4. Ràng buộc an toàn: Tuyệt đối không can thiệp sửa/xóa học liệu hay đổi trạng thái bài B11 (Thầy sẽ tự chuyển về Draft sau khi kiểm thử xong).
- **Quy chuẩn mới được bổ sung trong AUTO_PUBLISH_LESSON_SPEC.md (Section 7.2)**:
  - Bổ sung cổng bắt buộc **Post-Publish Static LMS Sync Gate**: Sau khi Thầy chuyển bài sang `Published` trên Admin, bắt buộc kích hoạt `refresh-data.yml`, chờ Pages deploy, đối chiếu `quiz-index.json` (`count_public === count_admin`), kiểm tra file quiz đủ câu và kiểm tra UI học sinh.
  - **Strict Broadcast Blocker**: Tuyệt đối cấm phát thông báo bài học cho học sinh khi cổng này chưa đạt trạng thái PASS 100%.


### 10/09/2026 — Thiết Kế Lại Trực Quan Bài 11 (VLXT Premium Editorial) & Hoàn Thành Visual QA Gate (10/10 Slides)

- **Người thực hiện**: Antigravity AI Coordinator
- **Người nhận bàn giao**: Thầy Xuân Trường & Codex
- **Trạng thái**: `VISUAL_QA_PASS` (Chờ Thầy thẩm duyệt trực quan - `PENDING_TEACHER_APPROVAL`). Chưa tạo Canva, chưa tạo PPTX.
- **Phạm vi & File**:
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/review.html`: Tái thiết kế 100% theo hệ nhận diện "VLXT Premium Editorial".
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/qa-renders/`: Bộ 10 ảnh render độ phân giải 1920×1080 (`slide_01.png` - `slide_10.png`).
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/qa-report.md`: Bổ sung Gate 8 (Visual QA Gate).
- **Quy chuẩn Thiết kế Đã Áp Dụng ("VLXT Premium Editorial")**:
  1. *Khung trình chiếu*: Nền ngoài kem/trắng lạnh `#EEF2F6`, khung trình chiếu navy sâu `#071224` viền đậm 3px bo góc lớn 24px, tỷ lệ cố định 16:9 (1600x900 native / 1920x1080 render).
  2. *Màu sắc & Typography*: Navy làm màu chủ đạo, đỏ `#EF4444` làm màu nhấn kiến thức cốt lõi, xanh cyan `#38BDF8` làm màu phân cấp phụ. Font Outfit & Plus Jakarta Sans. Tiêu đề $\ge 48\text{px}$, nội dung chính $\ge 28\text{px}$. Bỏ toàn bộ chữ nhỏ, thông số thời lượng hay hành động học sinh ra khỏi slide canvas (đưa vào ngăn kéo Speaker Notes qua phím `N`).
  3. *Nhận diện thương hiệu*: Slide 1 (Bìa) và Slide 10 (Kết) có logo SVG nguyên tử chuẩn + `VẬT LÝ XUÂN TRƯỜNG`. Các slide nội dung 2–9 có monogram `XT` góc trên bên trái. 100% slide có domain `vatlyxuantruong.io.vn` ở chân trang.
  4. *Đồ thị & Vật lý*:
     - Slide 3: Sơ đồ xilanh pít-tông lớn, sạch sẽ; các nhãn $F_{\text{ngoài}}$ (mũi tên hướng xuống), $p$, $V$, bình kín cách nhiệt ($T = \text{const}$) đặt ngoài hình kèm đường dẫn rõ ràng, không đè lên hình vẽ.
     - Slide 6: 2 đường hypebol $T_1$ và $T_2$ ($T_2 > T_1$) tuyệt đối không cắt nhau; đường gióng nét đứt tại $V_0$ chứng minh $p_2 > p_1 \implies T_2 > T_1$. Nhãn $\ge 28\text{px}$.
     - Slide 7: 3 hệ trục $(p, 1/V)$, $(p, T)$, $(V, T)$ rõ ràng, kèm dòng ghi chú sư phạm bổ sung.
     - Slide 9: Bảng tổng hợp công thức chuẩn Bảng II Ban Lí thuyết, căn chỉnh cột sắc nét, KaTeX chuẩn.
     - Slide 10: 3 từ khóa lý thuyết + CTA rõ ràng làm 20 câu bài tập áp dụng trên web LMS.
  5. *Hàng rào an toàn*: Giữ nguyên quy tắc không tạo Canva/PPTX, không nạp LMS/Drive/YouTube, không sửa production khi Thầy chưa duyệt bản preview.



### 10/09/2026 (Phiên tối muộn) — Chuẩn Hóa Typography Công Thức Toán/Lý Theo Chuẩn VLXT, Khóa Cổng FORMULA_TYPOGRAPHY_PASS, Cập Nhật Spec & Bàn Giao Final PPTX Bài 11

- **Người thực hiện**: Antigravity AI Coordinator
- **Người nhận bàn giao**: Thầy Xuân Trường & Codex
- **Trạng thái**: `MASTER_DESIGN_COMPLETED` & `VISUAL_QA_PASS` & `FORMULA_TYPOGRAPHY_PASS` (10/10 Slide đạt chuẩn 100%).
- **Phạm vi & File đầu ra**:
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/Bai11_DinhLuatBoyle_VLXT.pptx`: File PowerPoint tỉ lệ 16:9 Widescreen (13.333" × 7.5"), nhúng trọn vẹn 10 slide độ nét cao để Thầy trình chiếu/quay trực tiếp.
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/review.html`: File xem trước trực quan mở bằng trình duyệt, có thanh điều hướng chuyển slide nhanh và phím bấm.
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/qa-renders/`: Thư mục 10 ảnh render 1920×1080 (`slide_01.png` đến `slide_10.png`).
  - `teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/qa-report.md`: Báo cáo đối soát 10 slide đạt `VISUAL_QA_PASS` và `FORMULA_TYPOGRAPHY_PASS`.
  - `TEACHING_DECK_SPEC.md` (root & `00-BRAIN-VLXT/specs/`): Khóa Gate 9 `FORMULA_TYPOGRAPHY_PASS` làm chuẩn bắt buộc cho mọi bộ slide trong hệ thống VLXT.
- **Chi tiết Chuẩn Hóa Typography Công Thức Vật Lý Đã Thực Hiện**:
  1. *Phân số toán học đứng chuẩn*: Toàn bộ quan hệ tỉ lệ nghịch và hệ trục tọa độ đã chuyển thành phân số đứng chuẩn KaTeX `p \sim \frac{1}{V}` và `\left(p, \frac{1}{V}\right)`. Tuyệt đối không viết `1/V`.
  2. *Công thức liền mạch 1 dòng*: Toàn bộ điều kiện $T = \mathrm{const},\ m = \mathrm{const}$ tại Slide 8 và Bảng Master Slide 9 được bọc `white-space: nowrap`, căn chỉnh độ rộng cột bảng (30% / 40% / 30%), cấm ngắt dòng giữa $m =$ và $\mathrm{const}$.
  3. *Quy tắc ISO / VLXT Font*: Biến số in nghiêng ($p, V, T, m$); chỉ số dưới chuẩn ($p_1, V_1, T_1, T_2, V_0$); chữ $\mathrm{const}$ (`\mathrm{const}`), đơn vị ($\mathrm{Pa}, \mathrm{m}^3, \mathrm{atm}, \mathrm{mmHg}, \mathrm{bar}$) và chữ mô tả in đứng dạng `\text{...}` hoặc `\mathrm{...}`.
  4. *Đồ họa SVG & Banner*: Banner vàng Slide 6 chuyển thành KaTeX chuẩn `$$p \cdot V = \text{hằng số} \iff p \sim \frac{1}{V}$$`. Trục hoành hệ $(p, 1/V)$ trên SVG Slide 7 chuyển thành phân số đứng SVG (tử số 1 đứng, gạch ngang, mẫu số $V$ nghiêng).
  5. *Visual QA AI Vision*: Render lại 10/10 ảnh 1920×1080, AI Vision thẩm định chi tiết từng slide, xác nhận không tràn viền, không gãy từ tiếng Việt, không lỗi font.
  6. *Nâng cấp Cỡ Chữ Siêu Dễ Đọc (High Legibility)*: Theo góp ý của Thầy (đảm bảo học sinh xem bài giảng trên điện thoại/màn hình nhỏ vẫn đọc vanh vách), toàn bộ cỡ chữ mô tả, card, công thức và nhãn đồ thị được tăng lên mức tối thiểu tương đương Word 12 Zoom 240% (nội dung $\ge 25\text{–}28\text{px}$, tiêu đề $\ge 28\text{–}32\text{px}$, công thức $\ge 32\text{–}56\text{px}$). Giữ nguyên 100% bố cục master design và màu sắc.
  7. *Hàng rào an toàn*: Giữ nguyên hợp đồng nguồn (`Ban Lí thuyết.docx` cho 10 slide, 20 câu bài tập áp dụng là tài nguyên web riêng), không quay video, không nạp production, tạm thời chưa xuất PPTX mới cho đến khi Thầy duyệt lại review.html.


### 10/09/2026 (Phiên tối) — Khởi Tạo Xưởng Giáo Trình Trình Chiếu VLXT & Khóa Cố Định WORKSHOP_RULES.md (Thầy Đã Duyệt)

- **Người thực hiện**: Antigravity AI Coordinator
- **Người nhận bàn giao**: Thầy Xuân Trường & Codex
- **Trạng thái**: `WORKSHOP_INITIALIZED` & `WORKSHOP_RULES_APPROVED` (Đã duyệt chính thức, khóa làm luật nền cố định).
- **Phạm vi & File**:
  - `WORKSHOP_RULES.md` (root): Bộ quy tắc cố định, bất biến cho mọi bài giảng trong Xưởng Giáo trình Trình chiếu VLXT.
- **Quy tắc Nền Tảng Bắt Buộc Đối Với Mọi Bài Học Về Sau**:
  1. *3 Nguồn bắt buộc phải đọc lại trước khi bắt tay làm bất kỳ bài nào*:
     - `WORKSHOP_RULES.md`
     - `TEACHING_DECK_SPEC.md`
     - Golden sample Bài 11 (`teaching-decks/GD1_CH02_KhiLyTuong/B11_DinhLuatBoyle_DangNhiet/`)
  2. *Phạm vi duy nhất*: Chuyển đổi $100\%$ nội dung file `Bản Lí thuyết.docx` đã được Thầy duyệt thành slide trình chiếu để Thầy giảng dạy / ghi hình Video 1.
  3. *Các điều cấm bất biến*: Không OCR, không đăng LMS, không tự soạn kiến thức/bài tập/ví dụ, không tự đổi master design.
  4. *Kế thừa master Bài 11*: Dùng đúng 2 logo XT thật; bìa/kết dùng logo đầy đủ; chân trang `Biên soạn: Xuân Trường` và `vatlyxuantruong.io.vn` (tuyệt đối không dùng "Giảng viên", không logo tự vẽ hay placeholder); công thức chuẩn `FORMULA_TYPOGRAPHY_PASS`; cỡ chữ to rõ tương đương tối thiểu Word 12 Zoom 240%; Render 1920×1080 và AI Vision QA trước khi trình duyệt; chỉ xuất PPTX 16:9 sau khi Thầy duyệt `review.html`.
  5. *Quyền hạn*: CẤM tự ý thay đổi các luật này nếu chưa có chỉ đạo mới của Thầy.


### 08/09/2026 — Quản trị trạng thái, dọn dẹp task và chuẩn hóa sổ bàn giao toàn hệ thống

- **Người thực hiện**: Antigravity Coordinator (Bộ não VLXT)
- **Mục tiêu**: Hợp nhất và chuẩn hóa toàn bộ danh sách task, loại bỏ thông tin cũ/trùng lặp, khôi phục mã hóa UTF-8 và cập nhật đúng tiến độ thực tế theo chỉ đạo trực tiếp của Thầy.
- **Nguồn sự thật điều phối**: Chọn `00-BRAIN-VLXT/TASKS.md` làm danh sách điều phối chuẩn duy nhất của Brain; `TASKS.md` ở thư mục gốc trỏ về file chuẩn này.
- **Chuyển đổi trạng thái chính**:
  1. **Xuất file Word (OMML)**: Chuyển sang `DONE` (Đã được Thầy trực tiếp nghiệm thu thực tế; độc lập với Bulk Delete).
  2. **Admin Bulk Delete**: Giữ ở `VERIFY` (backend Apps Script v138/v139 đã deploy xóa theo block; chờ xác minh commit và kiểm thử an toàn trên staging).
  3. **Mẫu bài giảng XPS Physics**: Giữ ở `WAITING_TEACHER` (đã có bản thử 8 slide, chờ Thầy chốt mẫu chính thức).
  4. **Nền tảng OCR Ebook Phong Toả (4 Chương)**: Đánh dấu nền tảng `PROCESS_COMPLETE` (Quy trình hoàn thiện, bảo toàn spec chuẩn tái sử dụng).
  5. **Worker tự động poll**: Chuyển sang `SUPERSEDED` (Bãi bỏ Scheduled Task tự poll; Thầy chủ động điều phối trực tiếp).
- **Các file đã sửa**:
  - `00-BRAIN-VLXT/TASKS.md`: Danh sách công việc chuẩn hóa duy nhất.
  - `00-BRAIN-VLXT/CURRENT_STATE.md`: Trạng thái cập nhật, khắc phục lỗi mojibake UTF-8.
  - `00-BRAIN-VLXT/DECISIONS.md`: Bổ sung quyết định bãi bỏ worker tự poll và chuẩn hóa quy trình OCR.
  - `00-BRAIN-VLXT/HANDOFF_TO_CODEX.md`: Bản bàn giao nhanh cho Codex/Claude.
  - `00-BRAIN-VLXT/handoffs/2026-09-08-1845-cleanup-tasks-and-state.md`: Nhật ký phiên làm việc.
  - `TASKS.md` (root): Ghi chú trỏ về danh sách chuẩn.
  - `PROJECT_STATE.md`: Bổ sung mục bàn giao này.
- **Những việc còn mở**:
  - `WAITING_TEACHER`: Thầy chốt mẫu bài giảng XPS Physics.
  - `VERIFY`: Kiểm thử an toàn tính năng Admin Bulk Delete trên staging.

### 07/09/2026 - Sửa lỗi xuất Word không hiển thị đúng định dạng công thức Toán học (OMML)

- **Vấn đề & Yêu cầu của Thầy**:
  - Khi tải file Word (.docx) các câu hỏi từ ngân hàng đề, toàn bộ công thức bị lỗi hiển thị, ví dụ như phân số hoặc số mũ không giữ đúng định dạng và xuất ra dạng text thô của LaTeX (VD: `$\frac{p}{T} = \text{hằng số}$`). Yêu cầu khắc phục để khi xuất ra Word vẫn giữ nguyên công thức.
- **Phân tích**:
  - File `ngan-hang-de.html` sử dụng hàm `htmlToRunsXml` để build cây XML (Office Open XML - OOXML) cho file `.docx` thủ công bằng chuỗi. Tuy nhiên, nó coi các đoạn `$ ... $` chứa LaTeX là văn bản thông thường (`w:t`) thay vì chuyển sang dạng toán học của Word (OMML - `<m:oMath>`).
- **Thay đổi**:
  - `_codex_verify_live/ngan-hang-de.html`: Viết hàm `mathMLToOMML` sử dụng `DOMParser` để map các thẻ MathML sang cú pháp OMML của Word (như `<m:f>` cho phân số, `<m:sSup>` cho số mũ, `<m:rad>` cho căn bậc hai, v.v.).
  - Sử dụng thư viện KaTeX (đã có sẵn trong dự án) thông qua `katex.renderToString(tex, { output: 'mathml' })` để parse LaTeX sang MathML.
  - Sửa đổi hàm `wRun` trong `htmlToRunsXml` để phát hiện `$ ... $` và `$$ ... $$`, truyền qua converter và chèn vào tài liệu dưới dạng OMML tags.
  - Cập nhật thêm namespace `xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"` vào phần tử gốc `<w:document>` để Word hiểu các thẻ `<m:...>`.
- **Lưu ý triển khai & Git**:
  - Các thay đổi đã được thực hiện trực tiếp trên file `_codex_verify_live/ngan-hang-de.html` và commit lên nhánh `codex/manual-file-update-existing-390`.
  - Nếu nhánh chính của repo Admin chưa chứa nội dung này, cần merge file `ngan-hang-de.html` hoặc sao chép mã nguồn các hàm `mathMLToOMML`, `latexToOmml`, và `wRun` (cùng namespace root xml) vào file tương ứng trên Repo Admin thật (`eduhost-vn204/edu-portal-console`).
- **Kiểm tra**:
  - Đã chạy qua `node -e` test logic inline JS cho DOMParser và Regex an toàn. Cú pháp Javascript hoàn toàn hợp lệ, không có lỗi regex.
### 05/09/2026 — Cập nhật Tỉ lệ Đua Top & Solo và Chuẩn hoá Tên Chương

- **Vấn đề & Yêu cầu của Thầy**: 
  1. Hệ thống Đua Top và Solo không bốc đủ 576 câu Tinh do tên chương bị lệch (Vật lí nhiệt vs CHƯƠNG 1 - VẬT LÝ NHIỆT).
  2. Chỉnh tỉ lệ bốc câu thành 70% lý thuyết (NB, TH) và 30% bài tập (VD, VDC).
  3. Tăng số câu trận Solo lên 10 câu.
- **Thay đổi**:
  - `teaching-scope.js`: Bổ sung hàm `findMatchingChapter` dùng `normalizeStr` và `includes` để tự động khớp các biến thể tên chương (vd: Vật lí nhiệt) vào đúng mã hệ thống.
  - `dua-top.html`: Thay đổi thuật toán bốc câu sang tỉ lệ 70% lý thuyết / 30% tính toán trên tổng 20 câu.
  - `solo.html`: Tăng `Q_PER_MATCH` lên 10, đổi thuật toán sang 70/30, bổ sung console.log để kiểm tra số lượng câu.
- **Kiểm tra**: Cú pháp JS/HTML đạt. Xác nhận 576 câu tinh đều hợp lệ.

### 31/08/2026 — Thêm Chế Độ Xem Trước Đề (Exam Preview Simulation) & Duyệt Cùng Lúc Nhiều Đề (Bulk Approve)

- **Vấn đề & Yêu cầu của Thầy**:
  1. Thêm chế độ xem trước đề thi trước khi đưa lên web giống với Phòng thi thử trong trang **Phòng kiểm tra** (`phong-kiem-tra.html` & `index.html` của Admin Console).
  2. Cho phép xem trước trực quan cả đề đã lưu trong danh sách và bản nháp vừa bóc tách từ file Word `.docx` (với đầy đủ bộ lọc Phần I, II, III, KaTeX công thức toán, đáp án đúng và lời giải).
  3. Cho phép duyệt cùng lúc nhiều đề (chọn hàng loạt, Hiện/Ẩn hàng loạt, Mở/Khóa thi hàng loạt, Xóa hàng loạt).
- **Các file đã sửa**:
  - `edu-portal-console/phong-kiem-tra.html`:
    - Thêm nút `👁️ Xem đề` trên từng thẻ đề kiểm tra để mở modal chi tiết đề `#exam-detail-overlay` với đầy đủ bộ lọc phần I/II/III và lời giải chi tiết.
    - Thêm nút `👁️ Xem trước dạng phòng thi` (`previewDraftExamInModal()`) cạnh nút `Xuất Bản Lên Web` khi bóc tách file Word `.docx`.
    - Thêm thanh công cụ duyệt hàng loạt (`#kt-bulk-toolbar`), checkbox chọn tất cả và checkbox từng thẻ đề.
    - Bổ sung các hàm xử lý duyệt hàng loạt qua API `bulkupdateexams`: `bulkSetKiemTraVisibility()`, `bulkSetKiemTraStatus()`, `bulkDeleteKiemTraExams()`.
  - `edu-portal-console/index.html`: Đồng bộ hoàn toàn các chức năng trên.
- **Hành vi mới**:
  - Thầy có thể xem trước chi tiết bất kỳ đề kiểm tra nào trong danh sách hoặc đề vừa kéo thả file Word trước khi xuất bản.
  - Thầy có thể tích chọn nhiều đề kiểm tra để duyệt Hiện/Ẩn hoặc Mở/Khóa thi cùng lúc chỉ với 1 cú click.
- **Kiểm tra**:
  - Node.js syntax audit script chạy kiểm tra 100% script blocks trong `phong-kiem-tra.html` và `index.html` $\rightarrow$ ALL SCRIPTS SYNTAX CHECK PASSED.
- **Điều phải giữ nguyên**:
  - Tiếp tục sử dụng `postAdminWriteWithRetry` đảm bảo xác nhận ghi dữ liệu thực tế trên Google Apps Script / Google Sheets.

### 30/08/2026 — Chuẩn Hóa Bố Cục Ảnh, Công Thức Nội Dòng & Ký Hiệu Hạt Nhân 14 Đề 2k9 (Issue #14)

- **Vấn đề & Yêu cầu của Thầy**:
  1. Dàn lại toàn bộ hình ảnh 14 đề theo chuẩn Word: ảnh nhỏ/gần vuông đặt cạnh đề bài (side layout) trên Desktop/Laptop; ảnh chữ nhật dài/chuỗi hình/đồ thị xuống hàng riêng dưới đề bài (block layout); mobile tự động xuống dòng không tràn ngang.
  2. Khôi phục OCR/KaTeX cho các công thức/giá trị ảnh mờ (như 2 giá trị nhiệt nóng chảy ở câu mỏ hàn Đề 02, Silicon Đề 12, Pickup Đề 13, Loa điện Đề 14, Boyle Đề 15).
  3. Chuẩn hóa toàn bộ ký hiệu hạt nhân dính số (`1020Ne`, `24He`, `53131I`, `92235U`...) thành dạng chuẩn KaTeX chỉ số trên–dưới `{}^{A}_{Z}\mathrm{X}` trên đề bài, 4 phương án và lời giải chi tiết.
  4. Duy trì 14 đề ở trạng thái **Ẩn + Khóa** (`hienThi: 'an'`, `trangThai: 'khoa'`) trong suốt quá trình.
  5. Kiểm tra trực quan đủ 392 câu trên Desktop, Laptop zoom 125% và Mobile.
- **Các file đã sửa**:
  - `data/exams/vedich2k9_de02.json` ... `vedich2k9_de15.json` (đủ 14 bộ đề, 392 câu).
  - `thithu.html`: Thêm CSS hệ thống layout `.q-layout-side`, `.q-text-body`, `.q-img-col`, `.q-side-img`, `.q-block-wrap`, `.q-block-img`, `.q-multi-img-grid`, `.q-grid-img` và chống tràn ngang cho MathML/KaTeX.
  - Admin `index.html` (`edu-portal-console`): Đồng bộ CSS hệ thống layout tương ứng.
- **Hành vi mới**:
  - Giao diện câu hỏi có ảnh nhỏ/gần vuông hiển thị dạng 2 cột cân đối bên cạnh văn bản trên Desktop/Laptop; tự chuyển thành 1 cột trên Mobile.
  - Ảnh dài và đồ thị căn giữa bên dưới văn bản đề bài.
  - Mọi ký hiệu hạt nhân và nhiệt độ hiển thị rõ nét với số khối/số proton và ký hiệu độ Celsius chuẩn KaTeX.
- **Kiểm tra**:
  - Step 1: Kiểm toán dữ liệu 14 đề (392 câu: 252 MC đủ 4 options, 56 TF đủ a-b-c-d, 84 Short đủ đáp số) $\rightarrow$ 100% PASS.
  - Step 2: Playwright Visual QA Suite chạy trên 3 viewports (Desktop 1440×900, Laptop 1280×800, Mobile 375×812) duyệt đủ 392 câu $\rightarrow$ 0 lỗi tràn ngang, 0 ảnh lỗi.
  - Xuất manifest 39 screenshots đại diện tại `assets/qa_screenshots/` và báo cáo HTML `assets/qa_screenshots/visual_qa_report.html`.
  - Xác nhận 14 đề vẫn giữ an toàn ở trạng thái **Ẩn + Khóa**.
- **Điều phải giữ nguyên**:
  - Giữ 14 đề ở `hienThi: 'an'`, `trangThai: 'khoa'` cho tới khi Thầy ra chỉ thị mở cho học sinh.
  - Giữ nguyên cấu trúc dữ liệu, đáp án và cơ chế bảo mật fail-closed của `thithu.html`.



- **Vấn đề & Yêu cầu của Thầy**:
  1. Loại bỏ dòng thông báo phạm vi nội bộ (`🎯 Đang phát câu hỏi Tinh (đã duyệt)...`).
  2. Khi câu hỏi xuất hiện (cả Đua Top lẫn Solo), toàn bộ câu hỏi, 4 lựa chọn A, B, C, D và nút "Câu tiếp theo" phải nằm trọn trong tầm mắt học sinh, không bắt học sinh phải cuộn chuột xuống mới đọc hết đáp án hoặc bấm chuyển câu.
- **Giải pháp**:
  - Gỡ bỏ hoàn toàn `scopeBadge` trong [`dua-top.html`](file:///C:/Users/Xuan%20Truong/.gemini/antigravity/worktrees/_codex_friend_profile/implement_issue_twelve_coordinator/dua-top.html) và `scopeNoticeHtml` trong [`solo.html`](file:///C:/Users/Xuan%20Truong/.gemini/antigravity/worktrees/_codex_friend_profile/implement_issue_twelve_coordinator/solo.html).
  - Thêm cơ chế `body.in-game`: tự động ẩn banner tiêu đề `.hero` lớn khi bước vào làm bài, thu gọn thanh điểm `.score-bar` / thanh đối thủ `.opp-bar` thành thanh ngang trạng thái mỏng nhẹ (44px / 32px).
  - Tối ưu kích thước và padding siêu gọn cho `.nav` (44px), `.score-bar` / `.opp-bar` (32px), `.arena`, `.q-card`, `.q-text`, `.q-opt` và nút `.q-next`, giúp toàn bộ card câu hỏi, 4 đáp án và nút "Câu tiếp theo" hiển thị vừa khít 100% trong một khung nhìn màn hình duy nhất (kể cả zoom 125%–150% hay laptop 1366×768) mà không cần cuộn chuột.
  - Tự động cuộn `window.scrollTo({ top: 0, behavior: 'instant' })` tại mỗi lần chuyển câu và `nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` khi hiện nút chuyển câu.
  - Thêm phím tắt bàn phím trên cả Đua Top và Solo: bấm phím `1`-`4` hoặc `A`-`D` để chọn nhanh đáp án, phím `Enter` / `Space` / `Mũi tên phải` để sang câu tiếp theo ngay tức thì.
- **Kiểm thử**: Cú pháp HTML/JS PASS, kiểm tra live endpoint `https://vatlyxuantruong.io.vn/dua-top.html` và `https://vatlyxuantruong.io.vn/solo.html` (HTTP 200) $\rightarrow$ Đã hiển thị bản mới.

### 29/08/2026 — Sửa Popup "Nhiệm vụ hôm nay" Tràn & Scrollbar Lồng khi Zoom 125%–150% (Issue #12)

- **Vấn đề đã khắc phục (Issue #12)**:
  - Khi người dùng phóng to trình duyệt 125%–150% (hoặc trên màn hình laptop độ phân giải 1366×768, 1536×864), popup "Nhiệm vụ hôm nay" tràn chiều cao, chạm mép viewport và tạo thanh cuộn dọc nội bộ bên trong thẻ card (`#vlxt-nv-card`), trong khi trang nền (`index.html`) vẫn giữ thanh cuộn ngoài → tạo lỗi nested scrolling (hai scrollbar dọc song song), gây mất thẩm mỹ và khó thao tác.
- **Nguyên nhân gốc**:
  1. `#vlxt-nv-card` có `max-height: 90vh; overflow-y: auto;` kết hợp padding cố định quá lớn (`48px 52px 40px`), khiến nội dung cao vượt giới hạn viewport khi bị zoom.
  2. `#vlxt-nv-overlay` khi mở (`.open`) không khóa cuộn nền trên `document.body` (`overflow: hidden`), dẫn đến trang nền vẫn cuộn độc lập với popup.
  3. Khi popup cao hơn viewport, `align-items: center` trên overlay flexbox không có cơ chế cuộn an toàn toàn trang cho overlay.
- **Giải pháp xử lý**:
  - **Khóa cuộn nền**: Thêm class `body.vlxt-nv-open { overflow: hidden !important; }` khi mở popup và gỡ bỏ khi đóng, triệt tiêu hoàn toàn thanh cuộn nền khi popup đang hiển thị.
  - **Một luồng cuộn duy nhất (Single-Stream Scrolling)**: Chuyển vùng cuộn lên container cha `#vlxt-nv-overlay` (`overflow-y: auto; -webkit-overflow-scrolling: touch; padding: clamp(...)`), bỏ `max-height: 90vh` và `overflow-y: auto` trên `#vlxt-nv-card`; dùng `margin: auto; flex-shrink: 0;` để card căn giữa hoàn hảo khi ngắn hơn viewport và cuộn mượt mà không bao giờ bị cắt xén đỉnh khi dài hơn viewport.
  - **Responsive thích ứng kích thước & zoom**:
    - Áp dụng `clamp()` và `@media (max-height: 600px)` cho padding, font size, margins của title, cards, chips, progress wrap và action buttons.
    - Cấu trúc lại các class ngữ nghĩa gọn gàng: `.nv-teacher-card`, `.nv-teacher-tag`, `.nv-teacher-name`, `.nv-teacher-strategy`, `.nv-lesson-card`, `.nv-lesson-tag`, `.nv-lesson-name`.
  - **Nâng cao trải nghiệm & khả năng truy cập**:
    - Thêm nút đóng nhanh `✕` góc trên bên phải của card (`.nv-close-btn`).
    - Thêm lắng nghe phím `Escape` để đóng popup tiện lợi.
    - Xuất hàm chuẩn `window.vlxtOpenNhiemVu()` hỗ trợ mở popup an toàn có body lock từ trang chủ và các script khác.
    - Nâng cache-buster `nhiem-vu.js?v=5` trong `index.html` và `baihoc.html`.
    - Loại bỏ icon `📋` lặp thừa trong tiêu đề banner sticky (`#vlxt-mission-banner`), chỉ giữ 1 icon đại diện duy nhất.
- **Kiểm thử**:
  - `node --check nhiem-vu.js`: PASS.
  - `node scripts/test-quiz-merge.mjs` (6/6 PASS) & `node scripts/test-quiz-publish.mjs` (12/12 PASS): PASS.
  - Kiểm tra thẻ đóng `</html>` và cú pháp toàn bộ script HTML: PASS.
  - `git diff --check`: Không có lỗi whitespace hay trailing spaces.
  - Deploy & Live verification HTTP 200 trên `https://vatlyxuantruong.io.vn/`: PASS.

### 28/08/2026 — Khắc phục Lỗi Ghép Trận Solo Quá 12s Không Đấu Với AI (Hotfix)

- **Vấn đề đã khắc phục**: Khi học sinh/giáo viên bấm tìm trận Solo 1-1, đồng hồ tìm trận đếm quá 12s (28s...) mà không tự động chuyển sang đấu với AI (Bot).
- **Nguyên nhân gốc**:
  1. `normKey(s)` chưa chuẩn hóa các ký tự đặc biệt (`.`, `@`, `\s`) khi tài khoản đăng nhập chứa email/ký tự bị Firebase Realtime Database cấm trong path key, gây lỗi Javascript ngắt quãng trước khi `botFallbackTimer` được kích hoạt.
  2. `botFallbackTimer` thiếu cơ chế kiểm tra trực tiếp bên trong `searchInterval`.
- **Giải pháp**:
  - Sửa `normKey` thay thế triệt để các ký tự `.`, `#`, `$`, `[`, `]`, `/`, khoảng trắng thành `_`.
  - Khởi tạo `botFallbackTimer` và kiểm tra kép ngay trong `searchInterval` (khi `elapsed >= 12` lập tức chuyển vào `startBotMatch()`).
  - Bọc toàn bộ các thao tác Firebase Realtime Database trong khối `try ... catch` an toàn để không bao giờ làm gián đoạn tiến trình vào trận.
- **Kiểm thử**: Cú pháp JS PASS, 3 test suites PASS 100%. Xác nhận đúng 12s tự động chuyển vào trận đấu với AI khi không có người cùng tìm.

### 28/08/2026 — Khắc phục Lỗi Tải Câu Hỏi Đua Top/Solo & Nâng Cấp Phạm Vi Giảng Dạy Admin (Hotfix)

- **Vấn đề đã xử lý**:
  1. *Đua Top & Solo xoay vòng tròn vô hạn ("Đang tải ngân hàng câu hỏi...")*: Do thiếu import `cache.js` và `teaching-scope.js` trước khi các script nội bộ thực thi, dẫn đến lỗi `ReferenceError: cachedFetch is not defined` làm dừng quá trình khởi tạo câu hỏi.
  2. *Admin Phạm vi giảng dạy xuất hiện quá nhiều khóa học thừa/rác*: Do `getTeachingScopeCourseList()` nạp toàn bộ các cấu hình legacy cũ từ nhiều phiên bản trước.
  3. *Admin chọn Giai đoạn chuyển thành chọn Chương*: Chuyển mục 2 từ "Chọn Giai đoạn" thành "2. Chọn Chương", nạp danh sách chương động theo khóa học đã chọn (`Tất cả các chương (Toàn khóa học)` hoặc từng chương cụ thể), giúp Thầy quản lý và tick chọn bài học trực quan, chính xác theo cấu trúc `Khóa học` -> `Chương` -> `Bài học`.
- **Chi tiết sửa đổi**:
  - **LMS (`dua-top.html`, `solo.html`)**:
    * Đưa `<script src="cache.js?v=1"></script>` và `<script src="teaching-scope.js?v=1"></script>` lên đầu danh sách nạp trước khối script chính.
    * Bổ sung cơ chế `fetcher` an toàn (`cachedFetch` fallback `fetch`) và timeout bảo vệ khi nạp profile học sinh để trò chơi luôn nạp câu hỏi trơn tru.
  - **Console (`index.html`)**:
    * Chuyển mục 2 sang `<select id="ts-select-chapter">` và cập nhật hàm `renderTeachingScopeChapterOptions()`, `onTeachingScopeChapterChange()`.
    * Chuẩn hóa `getTeachingScopeCourseList()` chỉ lấy các khóa học thực tế đang có bài giảng trong hệ thống.
    * Tự động lọc danh sách chương và bài học bên dưới tương ứng theo chương được chọn.
- **Kiểm thử**: Toàn bộ cú pháp JS/HTML PASS, các bộ test suite đạt 100%. Xác nhận Đua Top / Solo nạp đúng tập câu hỏi Tinh và Admin hiển thị đúng 2 khóa học chuẩn cùng danh sách chương trực quan.

### 28/08/2026 — Sửa lỗi Phân tách Đề Phòng Kiểm Tra / Phòng Thi Thử & Đồng bộ Cache (Hotfix)

- **Vấn đề đã khắc phục**:
  1. *Lẫn lộn đề giữa 2 phòng*: Trước đó `phong-thi-thu.html` và `danhsach-ly12.html` đều nạp chung toàn bộ đề từ `?type=danhsachde` mà không lọc phân loại `loaiDe`, khiến các đề kiểm tra xuất hiện ở phòng thi thử và ngược lại.
  2. *Cache tĩnh `data/danhsachde.json` cũ*: `cache.js` ưu tiên nạp `data/danhsachde.json` cũ còn chứa các đề đã bị xóa trên Admin (`dc1s1`, `thithu_demo_01`), khiến giao diện học sinh vẫn hiển thị đề đã xóa.
- **Giải pháp triển khai**:
  - **`danhsach-ly12.html` (Phòng Kiểm Tra)**: Chỉ lọc và hiển thị các đề kiểm tra định kỳ (loại trừ các đề có `loaiDe === 'thithu'`, bắt đầu bằng `thithu_` hoặc có tiêu đề "Thi Thử"). Lắng nghe sự kiện `vlxt:data-updated` để cập nhật tức thì.
  - **`phong-thi-thu.html` (Phòng Thi Thử)**: Chỉ lọc và hiển thị đúng các đề thi thử (`loaiDe === 'thithu'` / `examId.startsWith('thithu')` / "Thi Thử"). Khi chưa có đề thi thử nào (như hiện tại), hiển thị empty state thông báo rõ ràng cho học sinh. Lắng nghe `vlxt:data-updated`.
  - **`data/danhsachde.json`**: Đồng bộ chính xác theo database Google Sheets trực tiếp (chỉ còn 1 đề duy nhất `kt-vlnhiet-gd1` ở trạng thái khóa).
- **Kiểm thử**: Cú pháp JS/HTML PASS, 3 test suites PASS 100%. Xác nhận dọn sạch đề rác/đã xóa trên toàn bộ giao diện học sinh.

### 28/08/2026 — Quy trình Tự động Video → YouTube Private → Bài học Nháp (Machine-1 / Issue #8)

- **Thực hiện**: Antigravity (Machine-1) qua GitHub Task Orchestrator (Issue #8).
- **Các file đã chỉnh sửa & tạo mới**:
  - **Repo Admin (`edu-portal-console`)**:
    * `scripts/youtube-lesson-pipeline.mjs`: Engine lõi xử lý manifest, upload YouTube Data API v3 (chế độ Private mặc định / Mock test), lưu checkpoint và tạo bài học DRAFT lên hệ thống.
    * `scripts/publish-video-lesson.ps1`: One-click PowerShell Launcher thuận tiện cho giáo viên.
    * `scripts/test-youtube-lesson-pipeline.mjs`: Bộ kiểm thử tự động toàn diện (19/19 PASS).
    * `inbox/sample-lesson/manifest.json` & `inbox/README.md`: Cấu trúc thư mục chuẩn và tài liệu hướng dẫn sử dụng.
    * `.gitignore`: Bỏ qua các file checkpoint `.checkpoint.json` cục bộ.
  - **Repo Student (`edu-portal-lms`)**: `PROJECT_STATE.md`.
- **Hành vi mới & Cơ chế an toàn**:
  1. **Manifest chuẩn**: Cấu hình đầy đủ thông tin bài học (`title`, `course`, `chapter`, `lessonName`, `description`, `videoFile`, `privacyStatus: 'private'`, `pdfUrl`, `order`, `tags`).
  2. **YouTube Upload Private**: Mặc định đặt `privacyStatus: 'private'` bảo vệ bản quyền bài giảng, hỗ trợ resumable upload và chế độ `--mock` cho kiểm thử.
  3. **Tạo bài học DRAFT an toàn**: Tự động thêm tiền tố `[DRAFT]` vào tên bài, gắn video YouTube Private và tài liệu PDF, gửi qua `savebaihoc` với xác thực phản hồi nghiêm ngặt; không tự ý public cho học sinh.
  4. **Idempotency & Checkpointing**: Cơ chế lưu `.checkpoint.json` tự động ghi nhận trạng thái upload và lưu bài học; chạy lại không bao giờ upload hay tạo bài học trùng lặp.
- **Kiểm thử & Xác minh**:
  - Toàn bộ 19 test cases trong `test-youtube-lesson-pipeline.mjs` đạt PASS 100%.
  - Chạy thử nghiệm end-to-end với launcher `publish-video-lesson.ps1 -Mock`: thành công tạo bài học DRAFT trên hệ thống và xác nhận bỏ qua ở lần chạy lại.

### 28/08/2026 — Hoàn thiện Phòng Thi Thử MVP & Nạp Đề Hàng Loạt (Machine-1 / Issue #5)

- **Thực hiện**: Antigravity (Machine-1) qua GitHub Task Orchestrator (Issue #5).
- **Các file đã chỉnh sửa & tạo mới**:
  - **Repo Student (`edu-portal-lms`)**: `phong-thi-thu.html`, `PROJECT_STATE.md`.
  - **Repo Admin (`edu-portal-console`)**: `index.html`.
- **Hành vi mới & Tính năng hoàn chỉnh**:
  1. **LMS Phòng Thi Thử (`phong-thi-thu.html`)**:
     - Nâng cấp từ trang giữ chỗ thành Phòng Thi Thử trực tuyến hoàn chỉnh.
     - Tích hợp tải danh sách đề từ API `danhsachde`, bộ lọc nhanh (Tất cả, Đang mở, Có video chữa, Lớp 12), tìm kiếm theo tên và mã đề.
     - Mỗi card đề hiển thị mã đề, thời gian làm bài, số câu, lượt thi, badge trạng thái (🟢 Đang mở / 🔒 Đang khóa).
     - Nút "Vào thi ngay" mở trực tiếp giao diện làm bài thi `thithu.html?exam=...`.
     - Nút "Video chữa đề" mở Modal phát video chữa YouTube/Drive tích hợp ngay trên trang kèm thông tin đề.
  2. **Admin Nạp Hàng Loạt (Bulk Import)**:
     - Nâng cấp Form quản lý đề thi hỗ trợ thêm `videoUrl`, `loaiDe` (Thi thử / Kiểm tra / Luyện tập).
     - Bổ sung Modal Nạp hàng loạt hỗ trợ 2 định dạng: JSON Manifest và Bảng tính Excel/TSV copy-paste.
     - Tính năng Xem trước (Preview) phân tích, chuẩn hóa và kiểm tra tính hợp lệ của từng bản ghi trước khi nạp.
     - Tính năng Nạp tự động chạy vòng lặp gửi an toàn qua `postAdminWriteWithRetry` kèm thanh tiến trình và nhật ký thời gian thực.
  3. **Dữ liệu mẫu kiểm thử**:
     - Đã nạp thành công đề mẫu `thithu_demo_01` kèm 4 câu hỏi trắc nghiệm/trả lời ngắn và link video chữa lên production GAS.
     - Kiểm tra end-to-end: đề mẫu hiển thị trên LMS, mở làm bài thi chấm điểm chính xác và xem được video chữa đề.
- **Kiểm thử & Xác minh**:
  - Cú pháp JavaScript toàn bộ file HTML: PASS.
  - Test suites: `test-quiz-publish.mjs` (12/12 PASS), `test-quiz-merge.mjs` (6/6 PASS), `test-teaching-scope.mjs` (14/14 PASS).
  - End-to-End Live Verification: PASS.

### 28/08/2026 — Triển khai Teaching Scope & Khép Production (Machine-1 / Issue #1 & #3)

- **Thực hiện**: Antigravity (Machine-1) qua GitHub Task Orchestrator (Issue #1 & Issue #3).
- **Trạng thái**: Đã merge main, push production và hoàn tất kiểm thử live trực tiếp.
- **Các file đã chỉnh sửa & tạo mới**:
  - **Repo Student (`edu-portal-lms`)**: `dua-top.html`, `solo.html`, `teaching-scope.js`, `data/settings.json`, `PROJECT_STATE.md`.
  - **Repo Admin (`edu-portal-console`)**: `index.html`.
- **Hành vi mới & Đảm bảo an toàn**:
  1. **Teaching Scope live**: Đã cấu hình và lưu thành công `currentTeachingLesson` lên production Google Sheets Settings: `'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12|||CHƯƠNG 1 – VẬT LÝ NHIỆT|||B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ'`.
  2. **Lọc câu hỏi Tinh nghiêm ngặt**: Cả `dua-top.html` và `solo.html` chỉ nhận câu có `chatLuong === 'tinh'` nằm trong phạm vi bài học (Chương 1 – Bài 3). Toàn bộ 5.438 câu thô/chưa duyệt bị loại bỏ 100%, không xuất hiện trong trò chơi.
  3. **Chuẩn hoá đáp án đúng**: Thêm cơ chế ánh xạ `correctKey` cho các câu có `q.correct` chứa chuỗi văn bản hoặc chữ cái A/B/C/D, đảm bảo hiển thị và tính điểm đúng tuyệt đối.
  4. **Thông báo UI**: Hiển thị badge thông báo rõ ràng về số lượng câu hỏi Tinh hiện có theo phạm vi bài học (`Chương 1 – Bài 3: 13 câu Tinh`) và trạng thái đang cập nhật bổ sung.
  5. **Admin Quản trị**: Bổ sung `savesetting`, `bulksetbainganhang`, `bulksetchatluongnganhang` vào `ADMIN_WRITE_ACTIONS` và chuyển `markTeachingLesson` sang dùng `postAdminWriteWithRetry` an toàn.
- **Kiểm thử & Xác minh**:
  - Cú pháp JavaScript toàn bộ file HTML: PASS.
  - Test suites: `test-quiz-publish.mjs` (12/12 PASS), `test-quiz-merge.mjs` (6/6 PASS).
  - End-to-end simulation test với API thật (Settings + Ngân hàng 5.454 câu): 13 câu Tinh trong phạm vi được chọn chính xác, 0 câu chưa duyệt lọt ra, vòng Đua Top và Solo chạy mượt mà.

### 26/08/2026 — Thiết lập vận hành dài hạn bằng Antigravity

- Xác định hai repo chính thức: Student `eduhost-vn204/edu-portal-lms`, Admin `eduhost-vn204/edu-portal-console`; loại repository Netlify legacy khỏi phạm vi làm việc mới.
- Tạo baseline cục bộ `codex/antigravity-baseline-20260826` tại Student `255d770` và Admin `0d491ca`.
- Thêm `AI_RUNBOOK.md` và cập nhật `AGENTS.md` để mọi AI dùng một quy trình: khảo sát → worktree/nhánh riêng → sửa tối thiểu → test → review diff/secret → commit → push nhánh → bàn giao.
- Repo Admin có `AGENTS.md` và `AI_RUNBOOK.md` riêng nhưng vẫn dùng file này làm nguồn trạng thái chung, tránh tạo sổ kiến trúc cạnh tranh.
- Antigravity đã xác minh hai baseline: đúng remote/commit, worktree sạch; HTML có thẻ đóng, JSON hợp lệ, secret scan không phát hiện credential server; test quiz Student 6/6 và 12/12 qua.
- GitHub credentials trên máy chưa được xác minh cho fetch/push. Không coi khả năng push tự động là hoàn tất cho tới khi thử trên một nhánh vô hại.
- Netlify token trong lịch sử repository legacy phải được thu hồi; không sao chép token đó vào bất kỳ tài liệu hoặc prompt nào.

### 23/08/2026 — Hồ sơ công khai từ Bạn bè và Xếp hạng

- Điều chỉnh giao diện lần 2 theo phản hồi: hồ sơ bạn bè mở thành chế độ toàn trang rộng như trang cá nhân, có thanh quay lại, thẻ thông tin, ba ô thống kê và khu vực tương tác; không còn popup nhỏ làm mờ nền.
- Thêm hộp hồ sơ công khai dùng chung trong `ban-be.js`: ảnh đại diện, họ tên, lớp, giới thiệu; nếu mở từ bảng xếp hạng có thêm thứ hạng và LP.
- Có thể mở hồ sơ khi bấm kết quả tìm bạn, lời mời, danh sách bạn bè hoặc một dòng trong bảng xếp hạng.
- Nút hành động theo đúng quan hệ: chưa kết bạn thì gửi lời mời, đã gửi thì hiện trạng thái, đã là bạn thì chuyển sang tab Bạn bè và mở chat.
- Không hiển thị mật khẩu, số điện thoại/email đầy đủ, điểm thi, tiến độ hay dữ liệu quản trị.
- `hoso.html` tăng cache-buster lên `ban-be.js?v=4`.

### 23/08/2026 — Sửa tìm bạn bè

- Nguyên nhân: `ban-be.js` chỉ tìm trong `profiles_public` trên Firebase; production lúc kiểm tra chỉ có 4 hồ sơ nên đa số tài khoản thật không thể tìm thấy.
- Thêm GET `type=searchprofiles` trong bản tham chiếu Apps Script: yêu cầu tài khoản người tìm phải tồn tại, tìm không dấu theo tên hoặc từ 4 chữ số, tối đa 20 kết quả, chỉ trả mã tài khoản/họ tên/lớp.
- `ban-be.js` gộp kết quả Firebase với API tìm hồ sơ; có trạng thái “Đang tìm” và thông báo lỗi mạng rõ ràng; sửa key Firebase hợp lệ cho tài khoản email.
- `hoso.html` tăng cache-buster `ban-be.js?v=2`.
- Không đồng bộ/bulk-publish danh sách học sinh vào Firebase công khai; phương án đó đã loại bỏ vì rủi ro riêng tư.
- Kiểm tra cú pháp `ban-be.js`, script trong `hoso.html`, và `apps-script-CAPNHAT.txt` đều qua.
- Apps Script chứa `searchprofiles` đã được phát hành thành phiên bản web app 71 và đã kiểm tra trả đúng kết quả production.

### 23/08/2026 — Sửa quản lý tài khoản và đồng bộ Premium

- Kho Student: sửa `auth.js`, `baihoc.html`, `apps-script-CAPNHAT.txt`.
- Kho Admin: sửa `index.html`, `apps-script-CAPNHAT.txt`.
- Web học sinh tự tải hồ sơ mới nhất khi mở trang và trước khi kiểm tra quyền khóa học; thay đổi Premium/Free/VIP từ admin không còn yêu cầu đăng xuất rồi đăng nhập lại.
- Mọi luồng hồ sơ/tiến độ/điểm/nhiệm vụ liên quan tài khoản dùng `sameTaiKhoan`: email chỉ khớp đúng email, SĐT chỉ khớp đúng SĐT; khắc phục lỗi nhiều email cùng bị chuẩn hóa thành chuỗi rỗng.
- `setVipStatus` bắt buộc `adminKey`, kiểm tra loại tài khoản hợp lệ; Premium lưu vĩnh viễn (`trialExpiry=0`), VIP mới có ngày hết hạn.
- Xóa tài khoản dọn `TienDo`, `BangVang`, `NhiemVu`, `HoatDong`, sau đó mới xóa `TaiKhoan`.
- Admin dùng `postAdminWriteWithRetry` và chỉ báo thành công khi máy chủ trả JSON `{ok:true}`; `deleteaccount` được thêm vào danh sách thao tác tự gắn khóa admin.
- Kiểm tra: `git diff --check`; `node --check auth.js`; kiểm tra cú pháp toàn bộ script trong `baihoc.html` và Admin `index.html`; kiểm tra cú pháp hai bản `apps-script-CAPNHAT.txt` — đều qua.
- Chưa triển khai production: `git fetch` thất bại vì môi trường không có thông tin xác thực GitHub; mã Apps Script tham chiếu vẫn phải được đưa vào deployment GAS đúng phiên bản trước khi chức năng backend có hiệu lực.

- Ngày: 19/08/2026 (vòng 4, sau khi Codex xác nhận vòng 3 gần đạt nhưng còn 1 lỗi atomic cuối — CHƯA chấp nhận merge)
- Người thực hiện: Claude
- Nhánh: `perf/cache-integrity-audit-20260819` — CHỈ repo Student (`edu-portal-lms`) có thay đổi code trong vòng này; repo Admin (`edu-portal-console`) KHÔNG bị đụng tới theo đúng yêu cầu vòng 4. KHÔNG merge/push main, KHÔNG deploy.
- Kết quả vòng 4 (1 lỗi atomic cuối Codex nêu):
  1. **Lỗi đã sửa**: `applyQuizPublishPlan()` trong `scripts/quiz-publish.mjs` trước đây coi `readFile` THÀNH CÔNG (file content-addressed đã tồn tại đúng tên) là bằng chứng nội dung đã đầy đủ/đúng rồi `continue` bỏ qua ghi lại. Điều này SAI nếu lần chạy trước bị ngắt giữa chừng lúc `writeFile`, để lại file CẮT CỤT dưới đúng tên đó — tên content-addressed (vòng 3) không tự bảo vệ khỏi trường hợp này.
  2. **Sửa**: với mỗi file quiz, tính `expectedContent` chính xác; nếu file đích tồn tại, đọc và chỉ skip khi nội dung khớp CHÍNH XÁC `expectedContent`; nếu không tồn tại hoặc không khớp, ghi `expectedContent` vào file tạm (`.${tên file}.tmp-${pid}-${random}`) trong CÙNG thư mục `data/quizzes/`, `rename()` sang tên đích chỉ sau khi ghi xong (index mới không bao giờ tham chiếu file chưa được xác minh/ghi xong); dọn file tạm của chính lần chạy nếu thất bại, không đụng snapshot cũ.
  3. **Test mới** trong `scripts/test-quiz-publish.mjs`: (a) pre-seed 1 file content-addressed đúng tên nhưng nội dung cắt cụt/sai trong 1 plan có 2 bài học (`MBT1` cắt cụt + `MBT2` bình thường) — xác nhận publish KHÔNG skip mà ghi lại đầy đủ cho `MBT1` trước khi cutover index, index mới khớp chính xác `plan.index` cho cả 2 bài; (b) fault-injection lỗi khi ghi file TẠM của 1 quiz file (không phải index) — xác nhận `quiz-index.json` cũ + file nó tham chiếu giữ nguyên byte-for-byt### 31/08/2026 — Hoàn tất Hotfix P0: Bảo Toàn LP, Đồng Bộ Đề Admin-LMS & Tối Ưu Trải Nghiệm CBT (Issue #5)

- **Người thực hiện**: Machine-2 (Antigravity)
- **Phạm vi thay đổi**:
  - `apps-script-CAPNHAT.txt` (cả 2 repo): Sửa triệt để hàm `saveScore(data)` chỉ lưu vào `BangVang`, loại bỏ hoàn toàn việc ghi đè cột 6 (`lpTotal`) của sheet `TaiKhoan`.
  - `data/danhsachde.json`: Đồng bộ chuẩn 100% với dữ liệu mở đề từ Admin/GAS (`vedich2k9_de02` và `vedich2k9_de05` đều ở trạng thái `mo`/`hien`), loại bỏ toàn bộ đề demo nhân tạo.
  - `phong-thi-thu.html`:
    - Thêm bước Đăng nhập mô phỏng CBT (Bước 1): Tự điền Mã thí sinh / SBD từ tài khoản thật, mật khẩu ca thi masked, tuyệt đối không lưu hoặc gửi mật khẩu giả lên server/localStorage, gắn kết quả thi duy nhất vào tài khoản gốc.
    - Thiết kế lại Sảnh thi trực tuyến (Bước 2): Bỏ nút thừa, giữ 2 ô Quy chế và Cấu trúc đề, thêm khối thông tin Thí sinh và Hội đồng thi, hiển thị chính xác danh sách đề mở từ Admin (`Đề về đích 2k9 – Đề số 02` và `Đề số 05`) với tên đề và mã đề chuẩn.
    - Loại bỏ hoàn toàn các cụm từ có rủi ro pháp lý ("Chuẩn Bộ", "Bộ GD&ĐT").
  - `thithu.html`:
    - Khắc phục triệt để lỗi chuyển câu: Quản lý phiên render đơn điệu (`renderVersion`), cập nhật DOM và chọn đáp án đồng bộ tức thì, KaTeX render với version guard, không chớp giật hay nhảy câu.
    - Bảo toàn 100% tài khoản và LP của học sinh: Không đụng chạm `vlxt_user_v2`.
    - Autosave vào `localStorage`, phục hồi đầy đủ đáp án và cờ đánh dấu khi reload/F5.
    - Modal cảnh báo nộp bài sớm hiển thị chính xác danh sách các câu chưa làm.
- **Kết quả kiểm thử**:
  - `test_p0_hotfix_e2e.js`: **6/6 TEST SUITES PASS (100%)** — LP trước = 350, LP sau khi vào sảnh = 350, LP trong khi thi = 350, LP sau reload = 350, LP sau nộp bài = 350, LP khi quay về trang chủ = 350 (Bảo toàn 100%). Cả 2 đề `vedich2k9_de02` và `vedich2k9_de05` đều mở và làm bài độc lập thành công.
  - `test-teaching-scope.mjs`: **14/14 PASS**.
  - `test-quiz-merge.mjs`: **6/6 PASS**.
  - `test-quiz-publish.mjs`: **12/12 PASS**.`: **6/6 PASS**.
  - `test-quiz-publish.mjs`: **12/12 PASS**.  - **Kiểm thử Local Server (HTTP 8088)**: Phục vụ `index.html` qua HTTP server cục bộ, nạp đầy đủ DOM, script và các hàm chẩn đoán -> **pass**.
  - **Kiểm thử Backend hiện tại (Live Apps Script chưa deploy code mới)**: Request POST text/plain được định tuyến 302 Redirect và trả `Access-Control-Allow-Origin: *`; action chưa có trong backend cũ rơi vào fallback `{ok: true}`.
  - **Kiểm thử Backend mới (Sau khi thầy deploy)**: Action `pingadmin` sẽ trả `{ok: true, ping: 'pong', ts: ...}` khi đúng key hoặc `{ok: false, msg: 'Unauthorized'}` khi sai key; action lạ trả `{ok: false, msg: 'Unknown action'}`.

### 27/08/2026 — Sắp xếp lại thứ tự Tab Navbar & Bổ sung Phòng Thi Thử trên Web Học Sinh

- **Người thực hiện**: Antigravity
- **Phạm vi thay đổi**:
  - `index.html`, `danhsach-ly12.html`, `hoso.html`, `baihoc.html`, `auth.js`, `phong-thi-thu.html`.
- **Chi tiết thay đổi**:
  1. **Đổi tên & Sắp xếp thứ tự các Tab Navbar**:
     - Cấu trúc mới: `Khóa Học` (`baihoc.html`) $\rightarrow$ `Phòng Thi Thử` (`phong-thi-thu.html`) $\rightarrow$ `Phòng Kiểm Tra` (`danhsach-ly12.html`) $\rightarrow$ `Đua Top` (`dua-top.html`) $\rightarrow$ `⚔️ Solo` (`solo.html`) $\rightarrow$ `Live` (`live.html`) $\rightarrow$ `Hướng Dẫn` (`huongdan.html`).
     - Bỏ các tab trực tiếp trên thanh điều hướng chính (`Bảng Vàng`, `Lịch Live`, `Hồ Sơ`) vì học sinh có thể cuộn xuống cuối trang hoặc truy cập qua widget người dùng/menu.
  2. **Thêm trang chờ `phong-thi-thu.html`**:
     - Trang placeholder cho tính năng Phòng Thi Thử chuẩn cấu trúc THPT Quốc Gia (thời gian thực, bảng xếp hạng).
  3. **Đồng bộ Mobile Nav Drawer & Auth Widget Dropdown**:
     - Cập nhật đồng bộ drawer mobile kiểu YouTube trên `index.html`, `danhsach-ly12.html`, `hoso.html` và menu `auth.js`.
  4. **Kiểm thử**:
     - Cú pháp HTML/JS & thẻ `</html>` trên toàn bộ 5 trang HTML: **PASS**.
### 29/08/2026 — Hoàn tất Tái sinh Toàn bộ Batch 14 Đề sang 2k9 (Office Math, Sửa Option Splitting, Khóa An Toàn)

- **Người thực hiện**: Antigravity
- **Phạm vi thay đổi**:
  - `data/exams/vedich2k9_de02.json` ... `data/exams/vedich2k9_de15.json` (14 file đề thi 2k9 chuẩn hóa).
  - `assets/exams/vedich2k9_de02/` ... `assets/exams/vedich2k9_de15/` (toàn bộ sơ đồ thí nghiệm thật, công thức OLE fallback chuẩn). Đã dọn dẹp sạch toàn bộ artifact cũ `vedich2k8_*`.
  - `data/danhsachde.json`: Chuyển 14 bộ đề sang định danh `vedich2k9_de02..de15`, tiêu đề `Đề về đích 2k9 – Đề số XX`, giữ trạng thái `trangThai: 'khoa'` (giữ ẩn an toàn).
  - `data/exams_manifest.json`: Đồng bộ metadata 14 đề 2k9.
  - `phong-thi-thu.html`: Cập nhật bộ lọc hỗ trợ `vedich2k9`.
- **Kết quả nghiệm thu Kỹ thuật & Quality Gates (100% PASS)**:
  - **14/14 Đề thi**: Đủ 14 bộ đề từ Đề 02 đến Đề 15, mỗi đề đúng 28 câu (18 MC + 4 TF + 6 Short), tổng cộng **392 câu hỏi**.
  - **252/252 Câu trắc nghiệm (MC)**: 0 phương án rỗng, 0 dính nhãn kế tiếp vào phương án trước.
  - **Office Math $\rightarrow$ LaTeX**: Toàn bộ công thức OMML chuyển đổi sang LaTeX inline `$..$` render KaTeX sắc nét, chuẩn baseline. Cân bằng ký tự delimiter `$` 100%.
  - **Độ bao phủ lời giải chi tiết**: 159/392 câu có HD (40.6% — phản ánh trung thực toàn bộ lời giải có trong tài liệu Word nguồn của Thầy).
  - **Tài nguyên hình ảnh**: 100% liên kết ảnh đều tồn tại thật trên đĩa, không rác screenshot desktop.
### 29/08/2026 — Hoàn tất Dashboard Quản Lý Phòng Thi Thử & Modal Xem Chi Tiết Trên Admin

- **Người thực hiện**: Antigravity
- **Phạm vi thay đổi**:
  - Repo Admin (`edu-portal-console`): `index.html`, `scripts/test-admin-phongthithu.mjs`.
- **Chi tiết thay đổi**:
  1. **Tab Phòng Thi Thử (`tab-phongthithu`) trên Admin Console**:
     - Xây dựng dashboard hoàn chỉnh thay thế placeholder tạm:
       - Banner thống kê thời gian thực: Tổng số đề thi thử, Đang mở, Đang khóa, Có video chữa.
       - Thanh công cụ điều khiển: Ô tìm kiếm đa năng (mã đề, tên đề, mô tả), bộ lọc tags (`Tất cả`, `✅ Đang mở`, `🔒 Đang khóa`, `🎬 Có Video chữa`), nút `Nạp hàng loạt` (Bulk Import), `+ Tạo đề mới`, nút làm mới dữ liệu.
       - Lưới thẻ đề thi thử (`#thithu-list-panel`): Hiển thị đầy đủ thông tin mã đề, tên đề, thời gian (50 phút), số câu (28 câu), lượt làm, khối lớp, huy hiệu Mở/Khóa, huy hiệu Video chữa kèm link.
       - Thao tác nhanh trên từng thẻ: `Sửa đề`, `Mở đề / Khóa đề` (gửi action `saveExam` qua `postAdminWriteWithRetry` an toàn), `Xem đề` (mở modal chi tiết 28 câu hỏi), `Xóa đề`.
  2. **Modal Xem Chi Tiết Đề Thi (`#exam-detail-overlay`)**:
     - Tải câu hỏi từ CDN tĩnh (`data/exams/{examId}.json`) hoặc fallback GAS.
     - Bộ lọc phân loại câu hỏi trong đề: `Tất cả (28)` | `Phần I: TN (18)` | `Phần II: Đúng/Sai (4)` | `Phần III: Ngắn (6)` | `Có lời giải`.
     - Hiển thị đáp án đúng nổi bật, lời giải chi tiết (nếu có), chuẩn hóa đường dẫn hình ảnh sang CDN, render KaTeX toán học trực tiếp.
  3. **Tách biệt rõ ràng giữa Phòng Thi Thử và Phòng Kiểm Tra**:
     - Tab `soande` ("Phòng kiểm tra") tập trung quản lý các đề kiểm tra định kỳ (`loaiDe !== 'thithu'`).
     - Tab `phongthithu` ("Phòng thi thử") chuyên biệt cho các bộ đề thi thử thực chiến THPT Quốc Gia khóa 2k9.
  4. **Ràng buộc an toàn & Giữ khóa**:
     - Giữ nguyên toàn bộ 14 đề `vedich2k9_de02..de15` ở trạng thái `"trangThai": "khoa"` trên cả hai repo cho đến khi Thầy chủ động bấm Mở nghiệm thu.
  5. **Kiểm thử tự động**:
     - Unit test `scripts/test-admin-phongthithu.mjs` (Admin): **5/5 PASS**.
     - `scripts/test-postAdminWrite.mjs` (Admin): **19/19 PASS**.
     - `scripts/test-apps-script-logic.mjs` (Admin): **12/12 PASS**.
     - `scripts/test-1click-tinh-scanner.mjs` (Admin): **4/4 PASS**.
     - `scripts/test-quiz-merge.mjs` (Student): **6/6 PASS**.
     - `scripts/test-quiz-publish.mjs` (Student): **12/12 PASS**.

### 31/08/2026 — Hoàn tất Hotfix P0: Bảo Toàn LP, Đồng Bộ Đề Admin-LMS & Tối Ưu Trải Nghiệm CBT (Issue #5)

- **Người thực hiện**: Machine-2 (Antigravity)
- **Phạm vi thay đổi**:
  - `apps-script-CAPNHAT.txt` (cả 2 repo): Sửa triệt để hàm `saveScore(data)` chỉ lưu vào `BangVang`, loại bỏ hoàn toàn việc ghi đè cột 6 (`lpTotal`) của sheet `TaiKhoan`.
  - `data/danhsachde.json`: Đồng bộ chuẩn 100% với dữ liệu mở đề từ Admin/GAS (`vedich2k9_de02` và `vedich2k9_de05` đều ở trạng thái `mo`/`hien`), loại bỏ toàn bộ đề demo nhân tạo.
  - `phong-thi-thu.html`:
    - Thêm bước Đăng nhập mô phỏng CBT (Bước 1): Tự điền Mã thí sinh / SBD từ tài khoản thật, mật khẩu ca thi masked, tuyệt đối không lưu hoặc gửi mật khẩu giả lên server/localStorage, gắn kết quả thi duy nhất vào tài khoản gốc.
    - Thiết kế lại Sảnh thi trực tuyến (Bước 2): Bỏ nút thừa, giữ 2 ô Quy chế và Cấu trúc đề, thêm khối thông tin Thí sinh và Hội đồng thi, hiển thị chính xác danh sách đề mở từ Admin (`Đề về đích 2k9 – Đề số 02` và `Đề số 05`) với tên đề và mã đề chuẩn.
    - Loại bỏ hoàn toàn các cụm từ có rủi ro pháp lý ("Chuẩn Bộ", "Bộ GD&ĐT").
  - `thithu.html`:
    - Khắc phục triệt để lỗi chuyển câu: Quản lý phiên render đơn điệu (`renderVersion`), cập nhật DOM và chọn đáp án đồng bộ tức thì, KaTeX render với version guard, không chớp giật hay nhảy câu.
    - Bảo toàn 100% tài khoản và LP của học sinh: Không đụng chạm `vlxt_user_v2`.
    - Autosave vào `localStorage`, phục hồi đầy đủ đáp án và cờ đánh dấu khi reload/F5.
    - Modal cảnh báo nộp bài sớm hiển thị chính xác danh sách các câu chưa làm.
- **Kết quả kiểm thử**:
  - `test_p0_hotfix_e2e.js`: **6/6 TEST SUITES PASS (100%)** — LP trước = 350, LP sau khi vào sảnh = 350, LP trong khi thi = 350, LP sau reload = 350, LP sau nộp bài = 350, LP khi quay về trang chủ = 350 (Bảo toàn 100%). Cả 2 đề `vedich2k9_de02` và `vedich2k9_de05` đều mở và làm bài độc lập thành công.
  - `test-teaching-scope.mjs`: **14/14 PASS**.
  - `test-quiz-merge.mjs`: **6/6 PASS**.
  - `test-quiz-publish.mjs`: **12/12 PASS**.

### 08/09/2026 — Thiết Kế và Triển Khai "Draft/Hidden Lesson Contract" (Bảo Vệ Đa Tầng Chống Lộ Bài Pilot Cho Học Sinh)

- **Người thực hiện**: Não AI Điều Phối & Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `READY_FOR_CODEX_QA` (Sẵn sàng nghiệm thu trên 2 nhánh riêng biệt của Admin và Student repo).
- **Phạm vi & Kho lưu trữ**:
  - **Admin Repo**: `_codex_verify_live` (`https://github.com/eduhost-vn204/edu-portal-console.git`).
    - Nhánh: `codex/draft-lesson-contract` (Commit: `2d4001a`).
  - **Student Repo**: `.` (`https://github.com/eduhost-vn204/edu-portal-lms.git`).
    - Nhánh: `codex/draft-lesson-contract-student` (Commit: `8884761`).
- **Nội dung thay đổi & Hợp đồng Draft/Hidden Lesson**:
  1. **Cấu trúc dữ liệu `TrangThai`**: Bổ sung cột 15 `TrangThai` cho bảng `BaiHoc`. Giá trị hợp lệ: `published`, `draft`, `archived`.
  2. **Tương thích ngược (Backward Compatibility)**: Tất cả bài học cũ chưa có hoặc để trống cột `TrangThai` được chuẩn hóa thành `published`, giữ nguyên 100% quyền truy cập của học sinh với dữ liệu hiện có.
  3. **Bảo vệ Server-side GAS (`src/Mã.js`)**:
     - `getBaiHoc(e)`: Nếu không có `scope=admin` hoặc `adminKey`, GAS lọc sạch các bài `draft` và `archived`, chỉ trả về bài `published` cho học sinh.
     - `getVideoCauHoi(bai, e)` & `getBaiTapTracNghiem(bai, e)`: Trả về `{ data: [] }` nếu bài học là `draft`/`archived` khi học sinh truy cập.
     - `saveBaiHoc(data)`: Nhận và lưu trường `TrangThai` vào cột 15.
  4. **Admin Console (`quan-ly-bai-hoc.html`)**:
     - Gọi API kèm `&scope=admin` để quản lý toàn bộ bài học.
     - Hiển thị badge trạng thái rõ ràng: `🟢 Published`, `🟡 Draft`, `⚪ Archived`.
     - Bộ lọc trực quan trên thanh toolbar: `Tất cả trạng thái`, `Published`, `Draft`, `Archived`.
     - Form thêm/sửa bài học bổ sung dropdown chọn `TrangThai`.
  5. **Student Portal Phòng Thủ Đa Tầng**:
     - `scripts/sync-public-data.mjs`: Lọc bỏ triệt để bài `draft` và `archived` trước khi ghi `data/baihoc.json` và chỉ tạo quiz tĩnh cho bài `published`.
     - `baihoc.html`: Lớp phòng thủ 3 tầng: lọc fetch từ sheets, lọc cache localStorage cũ, và lọc khi gom nhóm/render khóa học.
  6. **Pipeline Pilot & Public Leak Detection (`scripts/youtube-lesson-pipeline.mjs`)**:
     - Bài pilot gửi `TrangThai: 'draft'`.
     - Read-back đối soát sâu 11/11 trường (kể cả `TrangThai`).
     - Tự động gọi 3 endpoint công khai (`type=baihoc`, `type=videocauhoi`, `type=baitaptracnghiem`) để kiểm tra rò rỉ; nếu phát hiện ném `PUBLIC_LEAK_DETECTED` fail-closed.
- **Kiểm thử nghiệm thu**:
  - `test-draft-lesson-contract.mjs`: **12/12 PASS (100%)**.
  - `test-youtube-lesson-pipeline.mjs`: **35/35 PASS (100%)**.
  - `test-pipeline-safety-faults.mjs`: **56/56 PASS (100%)** (bổ sung mutation test `TrangThai`).
  - `test-trial-oauth-live-engine.mjs`: **24/24 PASS (100%)**.
  - `test-apps-script-logic.mjs`: **12/12 PASS (100%)** (kèm 7/7 self-test).
  - Tổng số test pass: **146/146 (100%)**.
- **Cam kết an toàn**:
  - KHÔNG deploy Google Apps Script production.
  - KHÔNG merge/push vào `main`.
  - KHÔNG chạy OAuth live, KHÔNG ghi pilot thật vào Google Sheets production.
  - Dữ liệu Bài 10 thật trên production hoàn toàn nguyên vẹn.

### 09/09/2026 — Hotfix Admin Console: Revalidate Admin Authenticated Để Hiển Thị Bài Draft (B11)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã merge và triển khai thành công lên GitHub Pages Admin).
- **Phạm vi & Kho lưu trữ**:
  - **Admin Repo**: `_codex_verify_live` (`https://github.com/eduhost-vn204/edu-portal-console.git`).
  - **Hotfix Branch**: `codex/hotfix-admin-init-draft-revalidate` (Commit: `a97c333`).
  - **PR**: https://github.com/eduhost-vn204/edu-portal-console/pull/2 (Merged: `5e7c59e`).
  - **Rollback Tag**: `rollback-before-admin-draft-init-20260909` trỏ `2bc2aae94424c3e70aaee2963ad344568be2292a`.
- **Nguyên nhân sự cố & Khắc phục**:
  - **Nguyên nhân**: `initAdmin()` trong `quan-ly-bai-hoc.html` gọi `loadLessonsPreview()` nạp 40 bài công khai (đã lọc ẩn draft fail-closed), sau đó chỉ gọi `loadLessons()` khi `allLessons.length === 0`. Do preview đã có 40 bài, `loadLessons()` (sử dụng POST `getbaihocadmin`) không bao giờ được gọi, khiến bài Draft (B11) bị ẩn trên giao diện Admin.
  - **Khắc phục**:
    1. Trong `initAdmin()`: Luôn gọi `loadLessons()` vô điều kiện sau preview/settings/config để revalidate bằng admin POST `getbaihocadmin`, thay thế `allLessons` bằng danh sách quản trị đầy đủ gồm bài Draft.
    2. Trong `loadLessons()`: Chỉ chèn dòng loading spinner khi `!allLessons.length`, giữ nguyên DOM preview mượt mà trong khi revalidate nền.
    3. Thêm bộ kiểm thử hồi quy `scripts/test-admin-init-draft-revalidate.mjs` (3/3 pass) chứng minh: preview công khai có 40 bài không có B11, `getbaihocadmin` trả 41 bài có B11, UI render huy hiệu Draft, và cache preview trong `localStorage` không chặn revalidate.
- **Kiểm thử & Xác minh Thực tế**:
  - `test-admin-init-draft-revalidate.mjs`: **3/3 PASS (100%)**.
  - `test-admin-form-safety.mjs`: **8/8 PASS (100%)**.
  - `test-draft-lesson-contract.mjs`: **31/31 PASS (100%)**.
### 09/09/2026 — Hotfix Student LMS: Định Danh Ổn Định Số Buổi / Số Bài Học (Khắc Phục Lệch Buổi Khi Ẩn B11 Draft)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_PUBLISHED` (Đã merge và triển khai thành công lên GitHub Pages Student LMS).
- **Phạm vi & Kho lưu trữ**:
  - **Student Repo**: `student_upstream_clean` (`https://github.com/eduhost-vn204/edu-portal-lms.git`).
  - **Hotfix Branch**: `codex/hotfix-student-stable-session-num` (Commit: `eff3883`).
  - **PR**: https://github.com/eduhost-vn204/edu-portal-lms/pull/2 (Merged: `b0f9233`).
  - **Rollback Tag**: `rollback-before-student-session-num-20260909` trỏ `94782e5` (đã push upstream).
- **Nguyên nhân sự cố & Khắc phục**:
  - **Nguyên nhân**: Trong `baihoc.html`, nhãn `Buổi` và `Bxx.` được sinh bằng cách duyệt tuần tự mảng `ch.lessons` sau khi đã lọc bỏ bài Draft. Khi bài B11 bị ẩn vì là Draft, bài B12 nhận index 11 (hiển thị thành "Buổi 11"), bài B13 nhận index 12 (hiển thị thành "Buổi 12").
  - **Khắc phục**:
    1. Bổ sung hàm `getLessonSessionNum(l, fallbackIndex)`: Trích xuất số bài ổn định ưu tiên từ `TenBai`/`name` dạng `Bxx`, `Bài xx`, `Buổi xx`, `Ngày xx` (hoặc `MaBai` / `ThuTuBai`), tuyệt đối không phụ thuộc index sau lọc.
    2. Áp dụng `getLessonSessionNum` đồng bộ tại 4 vị trí: danh sách bài toàn khóa (`renderCourse`), tiêu đề bài đang học (`renderLesson`), thanh sidebar (`side-item`), và chế độ xem live (`renderLiveLesson`).
    3. Thêm bộ kiểm thử hồi quy `scripts/test-student-stable-session-num.mjs` (8/8 pass) xác nhận: khi B11 là Draft thì B11 hoàn toàn không render, B12 giữ nguyên nhãn `Buổi 12` / `B12.`, B13 giữ nguyên nhãn `Buổi 13` / `B13.`, cùng các kiểm thử đơn vị trích xuất số bài.
- **Kiểm thử & Xác minh Thực tế**:
  - `test-student-stable-session-num.mjs`: **8/8 PASS (100%)**.
  - `test-teaching-scope.mjs`: **14/14 PASS (100%)**.
  - Cú pháp HTML/JS & `git diff --check`: Không lỗi, thẻ `</html>` nguyên vẹn, 17/17 thẻ script cú pháp hợp lệ.
  - **Triển khai GitHub Pages**: Workflow `Deploy to GitHub Pages` (run `34260122287`) và `pages build and deployment` (run `34260121706`) thành công (`success`).
  - **Xác minh Trực tiếp Live Site (`https://vatlyxuantruong.io.vn/baihoc.html`)**:
    - Mã nguồn triển khai đã cập nhật hàm `getLessonSessionNum(l, fallbackIndex)`.
    - B11 Draft bị ẩn hoàn toàn khỏi danh sách học sinh.
    - Bài B12 giữ nguyên nhãn `Buổi 12`, bài B13 giữ nguyên nhãn `Buổi 13`.

### 09/09/2026 — Chuẩn Hóa Tài Liệu Quy Chuẩn Xưởng Xuất Bản Bài Học Tự Động (AUTO_PUBLISH_LESSON_SPEC.md)

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `SPEC_PUBLISHED`
- **Mô tả tài liệu**:
  - Soạn thảo quy chuẩn toàn diện [AUTO_PUBLISH_LESSON_SPEC.md](file:///d:/Work/D%E1%BA%A1y%20h%E1%BB%8Dc/Trang%20wed/X%C3%A2y%20wed%20h%E1%BB%8Dc%20v%E1%BA%ADt%20l%C3%BD/AUTO_PUBLISH_LESSON_SPEC.md) dựa trên thực tiễn nạp Pilot B11 thành công 100%.
  - Bao gồm 9 phần chi tiết:
    1. Mục tiêu & 4 nguyên tắc cốt lõi (Fail-Closed, Zero Credential Leak, Data Integrity, Teacher-Controlled Publish).
    2. Cấu trúc gói học liệu đầu vào (`manifest.json` schema, 2 video MP4, 3 PDF, 20 câu video timestamp, 20 câu bài tập).
    3. 6 Preflight Gates nghiêm ngặt (Contract & Syntax, Exact Backend Match 1 độc bản duy nhất, Snapshot Integrity, Input Package Validation, Trial Profile Isolation, Fail-Closed Draft State).
    4. Cờ lệnh `--mode=trial` (Private, thư mục trial, trạng thái draft) vs `--mode=live` (Unlisted, published khi Thầy duyệt).
    5. Checkpoint, resume (`.checkpoint.json`) và tính bất biến (idempotency).
    6. Quy trình đối soát nghiệm thu 7 cổng độc lập (read-back 11 trường, 20/20 câu video, 20/20 câu bài tập, public leak check qua 3 public endpoints, bảo vệ bài lân cận B10 nguyên vẹn).
    7. Quy trình Thầy duyệt Draft trên Admin Console rồi xuất bản.
    8. Quy trình rollback và khôi phục snapshot tự động/thủ công.
    9. 5 điều cấm tuyệt đối (không đọc secret/localStorage/token, không tự publish, không ghi đè bài gốc, không bypass gates, không sửa nóng trên main).

### 09/09/2026 — Hotfix Tài Liệu Quy Chuẩn: Loại Bỏ Hoàn Toàn Cơ Chế Tự Publish Của AI, Siết Chặt Fail-Closed Rollback & Cảnh Báo B11

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `HOTFIX_DOCS_COMPLETE` (Chỉ cập nhật tài liệu quy chuẩn, tuyệt đối không can thiệp code hay dữ liệu production).
- **Phạm vi cập nhật**:
  - `student_upstream_clean/AUTO_PUBLISH_LESSON_SPEC.md`
  - `_codex_verify_live/AUTO_PUBLISH_LESSON_SPEC.md`
  - `00-BRAIN-VLXT/tasks/AUTO_PUBLISH_LESSON_SPEC.md`
- **Nội dung điều chỉnh chi tiết**:
  1. **Mục 4: Chế độ thực thi (`trial-draft` vs. `approved-assets-draft`)**:
     - Loại bỏ hoàn toàn mọi cơ chế/diễn đạt cho phép pipeline tự động chuyển trạng thái bài học sang `published`.
     - Quy định chuẩn: Mọi chế độ của pipeline chỉ được ghi ở trạng thái `draft`. Chế độ `approved-assets-draft` nạp học liệu chính thức (YouTube unlisted, Drive thư mục chính thức) nhưng trạng thái trên backend BẮT BUỘC VẪN LÀ `draft`.
     - Pipeline luôn kết thúc tại trạng thái `READY_FOR_TEACHER`.
     - Quyền chuyển `Published` thuộc về 100% duy nhất một mình Thầy thao tác trực tiếp trên Admin Console UI (`quan-ly-bai-hoc.html`). Xóa bỏ hoàn toàn câu chữ "AI có thể publish khi được phê duyệt bằng văn bản".
  2. **Cảnh báo bảo vệ B11 Pilot**:
     - Bổ sung cảnh báo nghiêm ngặt: Bài học B11 hiện đang dùng học liệu demo sao chép từ B10 để kiểm thử pipeline; B11 phải giữ trạng thái draft cho đến khi học liệu demo B10 được thay toàn bộ bằng học liệu Boyle thật và bài học được nghiệm thu lại theo đủ 7 audit gates.
  3. **Mục 6 & 8: Quy tắc Rollback an toàn (Fail-Closed & Stop)**:
     - Khi gặp bất kỳ lỗi nào hoặc đối soát nghiệm thu thất bại: Pipeline mặc định **DỪNG (STOP)**, bảo tồn nguyên trạng file `snapshot_<mabai>_before.json`, cập nhật `.checkpoint.json` với trạng thái `MANUAL_RECOVERY_REQUIRED`.
     - Tuyệt đối KHÔNG tự ý xóa video YouTube, xóa file Drive, hay tự ý gửi payload khôi phục backend nếu chưa có lệnh rõ ràng của Thầy. Giữ nguyên hiện trường phục vụ tra cứu.
     - Quy trình khôi phục snapshot trở thành phương án khôi phục thủ công khi có chỉ thị trực tiếp từ Thầy.
  4. **Mục 9: Các điều cấm tuyệt đối**:
     - Bổ sung điều cấm AI tự động publish dưới mọi hình thức và điều cấm tự tiện xóa tài nguyên / tự ý rollback production khi chưa có chỉ thị rõ ràng của Thầy.

### 11/09/2026 — Sửa Lỗi Dữ Liệu Video Câu Hỏi Dừng Bài 11 (B4ca24b64572f) Khớp 100% Video và Tài Liệu Thật

- **Người thực hiện**: Antigravity
- **Người nhận bàn giao**: Codex & Thầy Xuân Trường
- **Trạng thái**: `PRODUCTION_FIX_VERIFIED` (Đã cập nhật và nghiệm thu read-back 100% trên Google Sheets / Apps Script backend).
- **Phạm vi xử lý**:
  - Endpoint GAS Production: `https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec`
  - Action: `savevideocauhoi` với `baiKey: 'B4ca24b64572f'`, `originalKey: 'B4ca24b64572f'`.
  - Thay thế toàn bộ 20 dòng pilot cũ (vốn lấy nhầm từ Bài 10) bằng đúng 20 câu Bài tập áp dụng của Bài 11: “Định luật Boyle – Quá trình đẳng nhiệt”.
- **Cơ sở dữ liệu & Đối soát đa lớp**:
  1. **Nguồn câu hỏi**: File Word chính thức `Bài 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập áp dụng - wed.docx` (20 câu trắc nghiệm 4 đáp án A/B/C/D, đáp án chuẩn: 1A, 2B, 3C, 4C, 5B, 6B, 7C, 8A, 9C, 10B, 11B, 12B, 13D, 14A, 15C, 16B, 17C, 18A, 19B, 20D).
  2. **Nguồn video & Xác định mốc thời gian**:
     - Video YouTube Bài 11 Lý thuyết: `https://www.youtube.com/watch?v=yHYNTWS1iCA` (thời lượng 2378.36s).
     - Đoạn chữa bài tập: từ 1740s đến 2378s (trên màn hình Microsoft Word).
     - Trích xuất audio và chạy nhận diện giọng nói `faster-whisper` với word-level timestamps, kết hợp quét OCR 636 frame (1s/frame từ 1740s đến 2375s) để xác định chính xác giây giáo viên bắt đầu nêu từng câu hỏi.
     - 20 mốc thời gian (tính bằng giây): 1749, 1762, 1770, 1784, 1802, 1824, 1871, 1900, 1922, 1928, 1964, 2063, 2080, 2132, 2174, 2188, 2214, 2233, 2265, 2333. Toàn bộ mốc tăng dần nghiêm ngặt và khớp hình ảnh/giọng nói.
- **Kết quả Kiểm thử & Nghiệm thu Read-back**:
  - Ghi đè thành công (`POST savevideocauhoi` phản hồi `{ ok: true, count: 20 }`).
  - Read-back Bài 11 (`?type=videocauhoi&bai=B4ca24b64572f`): Đúng 20 câu, mốc thời gian khớp 100%, đáp án khớp 100%, nội dung không còn bất kỳ dấu vết nào của Bài 10.
  - Read-back Bài 10 (`?type=videocauhoi&bai=B557b8fccbc72`): Đủ 20 câu, hoàn toàn độc lập và nguyên vẹn 100%.
  - Giả lập tải trên giao diện học sinh (`baihoc.html` parser): 20/20 câu nạp chuẩn xác, Câu 1 (1749s), Câu 10 (1928s), Câu 20 (2333s) hiển thị hoàn hảo.

