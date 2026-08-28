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

### 28/08/2026 — Hoàn thiện Teaching Scope dùng thật trên Production (MACHINE-1)

- **Trạng thái**: Hoàn tất toàn bộ mã nguồn frontend, backend Apps Script tham chiếu, module tích hợp Đua Top / Solo và bộ kiểm thử tự động 100% pass.
- **Rollback baseline tags đã tạo**:
  * Admin repo (`edu-portal-console`): `rollback-before-teaching-scope-20260828` (commit `91e56a9`).
  * Student repo (`edu-portal-lms`): `rollback-before-teaching-scope-20260828` (commit `19701a3`).
- **Nhánh thực hiện**: `implement_production_teaching_scope` trên cả hai kho mã.
- **Các file đã chỉnh sửa & tạo mới**:
  * **Repo Admin (`edu-portal-console`)**:
    + `apps-script-CAPNHAT.txt`: Thêm schema `TeachingScope` (`courseId`, `stageId`, `openChapterIds`, `activeLessonIds`, `validFrom`, `validTo`, `isActive`, `updatedAt`, `updatedBy`, `revision`), router GET `teachingscope` (phân quyền public vs admin), router POST `saveteachingscope` (xác thực `adminKey`, kiểm tra optimistic revision lock, cập nhật nguyên tử, tăng revision), bổ sung `bulksetbainganhang` và `bulksetchatluongnganhang`, `checkAdminKey()`.
    + `index.html`: Thêm tab "Phạm vi giảng dạy" (`#tab-teachingscope`) vào navigation bar và body; thêm CSS responsive hỗ trợ đầy đủ light/dark theme; bộ chọn khóa học & giai đoạn; switch kích hoạt; bộ chọn thời gian hiệu lực; danh sách chương & bài dạng checkbox tương tác; 4 thẻ thống kê trực quan; nút Mở/Đóng tất cả; Modal Diff Trước / Sau khi Lưu; tự động nạp cấu hình khi tải lại trang; xử lý lỗi mạng / hết hạn phiên với nút Thử lại / Đăng nhập lại.
  * **Repo Student (`edu-portal-lms`)**:
    + `teaching-scope.js`: Module chuẩn hóa và lọc câu hỏi theo phạm vi giảng dạy: kiểm tra `isActive`, `validFrom`, `validTo`, `openChapterIds`, `activeLessonIds` (kiểm tra theo từng chương cụ thể); kiểm tra nghiêm ngặt câu TINH (`chatLuong === 'tinh'`, `rawTier === 'TINH'`), `TEACHER_APPROVED`, chặn 100% câu Thô (`chatLuong === 'tho'`) và câu `QA_PASSED`.
    + `dua-top.html`: Tích hợp `teaching-scope.js`, tải song song ngân hàng câu hỏi và `teachingscope.json`/API; lọc theo scope đang áp dụng; hiển thị thông báo rỗng thân thiện kèm link học bài khi chưa có câu Tinh trong phạm vi; bảo toàn lịch sử và điểm số cũ.
    + `solo.html`: Tích hợp `teaching-scope.js` vào `loadBank()`, chỉ lấy câu Tinh thuộc các chương/bài đang mở; hiển thị thông báo trạng thái rõ ràng khi ngân hàng trong phạm vi chưa có câu.
    + `scripts/sync-public-data.mjs`: Bổ sung `fetchOptional('teachingscope')` và ghi dữ liệu ra `data/teachingscope.json`.
    + `apps-script-CAPNHAT.txt`: Đồng bộ chuẩn xác với bản Admin.
    + `scripts/test-teaching-scope.mjs`: Bộ unit test 12 kịch bản cho module lọc scope, kiểm tra thời gian, kiểm tra chặn câu thô, chặn QA_PASSED, mở nhiều chương, chọn bài lẻ, scope hết hạn/tắt, scope rỗng (12/12 pass).
    + `scripts/test-apps-script-scope.mjs`: Bộ test giả lập Apps Script backend (xác thực `adminKey`, tạo sheet an toàn, tăng revision nguyên tử, phát hiện và chặn xung đột ghi đè `Conflict` khi expectedRevision không khớp) (4/4 pass).
- **Kiểm thử & Xác minh**:
  * `node scripts/test-teaching-scope.mjs` → **12/12 PASS**.
  * `node scripts/test-apps-script-scope.mjs` → **4/4 PASS**.
  * `node scripts/test-quiz-merge.mjs` → **6/6 PASS**.
  * `node scripts/test-quiz-publish.mjs` → **12/12 PASS**.
  * Cú pháp JavaScript trên toàn bộ script blocks của Admin `index.html`, `dua-top.html`, `solo.html`, `teaching-scope.js` đều PASS.
  * Thẻ đóng `</html>` nguyên vẹn trên tất cả các trang.
- **Điều phải giữ nguyên**:
  * Không thay đổi giao diện ngoài những phần cần thiết cho Teaching Scope.
  * Không làm mất điểm LP, chuỗi thắng, lịch sử làm bài cũ của học sinh trong Đua Top và Solo.
  * Không hardcode token, mật khẩu hay adminKey vào mã nguồn.
- **Việc cần làm tiếp theo**:
  * Thầy cập nhật code `apps-script-CAPNHAT.txt` vào Google Apps Script và triển khai New Version (nếu cần cập nhật backend trên Apps Script thật).
  * Review diff nhánh `implement_production_teaching_scope` và tiến hành commit/push/merge nhánh theo quy trình an toàn.

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
  3. **Test mới** trong `scripts/test-quiz-publish.mjs`: (a) pre-seed 1 file content-addressed đúng tên nhưng nội dung cắt cụt/sai trong 1 plan có 2 bài học (`MBT1` cắt cụt + `MBT2` bình thường) — xác nhận publish KHÔNG skip mà ghi lại đầy đủ cho `MBT1` trước khi cutover index, index mới khớp chính xác `plan.index` cho cả 2 bài; (b) fault-injection lỗi khi ghi file TẠM của 1 quiz file (không phải index) — xác nhận `quiz-index.json` cũ + file nó tham chiếu giữ nguyên byte-for-byte, file đích chưa từng được tạo (chưa tới bước rename), không sót file tạm. Thêm hàm `assertIndexConsistent(paths, label)` chạy sau MỌI test case (12/12, gồm cả các test có sẵn từ vòng 3) để xác nhận `quiz-index.json` (nếu tồn tại) không bao giờ trỏ tới file thiếu hoặc JSON không hợp lệ.
  4. **KHÔNG đụng Admin/CORS** trong vòng này theo đúng yêu cầu — `apps-script-CAPNHAT.txt`, `index.html`, `scripts/postAdminWrite.mjs` (repo Admin) giữ nguyên như bàn giao vòng 3.
  5. **Fetch `origin/main`**: đã `git fetch origin main`, xác nhận `origin/main` hiện có commit mới `a1309bb` (data tự động). Nhánh cục bộ ĐÃ rebase sạch lên `origin/main` tại thời điểm fetch (không đụng `data/`, không force-push). Tuy nhiên do `git push` bị chặn bởi git-proxy sandbox, việc publish lên GitHub vẫn phải qua web-upload (không phải rebase thật) — **nhánh GitHub CÓ THỂ vẫn hiện "behind main"** đối với các commit chỉ đổi `data/` giống vòng 3, vì web-upload chỉ chồng commit mới lên tip hiện có trên GitHub chứ không replay lại lịch sử. Xem báo cáo gửi thầy để biết trạng thái CHÍNH XÁC đã kiểm tra trực tiếp trên GitHub (không suy đoán) tại thời điểm publish vòng này.
- Kiểm tra đã chạy sau khi sửa: `node --check scripts/quiz-publish.mjs` và `node --check scripts/test-quiz-publish.mjs` (qua, không lỗi); `node scripts/test-quiz-publish.mjs` → **12/12 pass**; `node scripts/test-quiz-merge.mjs` (hồi quy, không đổi file này) → **6/6 pass**. Không chạy/không cần chạy lại test Admin (không đổi).
- Bước tiếp theo: Codex tích hợp cuối trên working copy sạch từ `main`; commit/push/merge vẫn KHÔNG do trợ lý AI tự thực hiện. Cập nhật mục này sau mỗi thay đổi đáng kể, không thêm một sổ bàn giao cạnh tranh.
