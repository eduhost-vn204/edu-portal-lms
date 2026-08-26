# Vận hành dự án bằng AI — Vật Lý Xuân Trường

Tài liệu này giúp bất kỳ AI coding agent nào tiếp tục dự án mà không phụ thuộc vào lịch sử trò chuyện hay một trợ lý cụ thể.

## 1. Nhận diện nguồn chuẩn

- Student: `https://github.com/eduhost-vn204/edu-portal-lms.git`.
- Admin: `https://github.com/eduhost-vn204/edu-portal-console.git`.
- Production dùng GitHub Pages và GitHub Actions. Không dùng Netlify, không dùng repository legacy.
- `PROJECT_STATE.md` trong repo Student là sổ kiến trúc và bàn giao chung cho cả hai repo.

Nếu remote không khớp, dừng ngay. Không tự sửa trên repository khác.

## 2. Trình tự bắt đầu mỗi nhiệm vụ

1. Đọc toàn bộ `AGENTS.md`, `AI_RUNBOOK.md`, `PROJECT_STATE.md` và tài liệu repo liên quan.
2. Chạy `git status --short --branch`, `git remote -v`, `git log -10 --oneline`.
3. Fetch `origin/main` nếu có xác thực mạng. Nếu fetch thất bại, báo rõ và không khẳng định local là mới nhất.
4. Bảo toàn mọi thay đổi không phải của mình; không reset, stash, xóa hoặc ghi đè.
5. Làm trong New Worktree trên nhánh `antigravity/YYYYMMDD-mo-ta-ngan`, bắt đầu từ `origin/main` hoặc baseline đã được chỉ định.

## 3. Chu trình thực hiện tự chủ

1. Tóm tắt yêu cầu, phạm vi file và tiêu chí hoàn thành.
2. Khảo sát mã và tái hiện lỗi trước khi sửa.
3. Thực hiện thay đổi nhỏ nhất đáp ứng yêu cầu.
4. Kiểm thử theo phạm vi; sửa đến khi test qua.
5. Xem lại `git diff`, quét secret và kiểm tra không có file ngoài phạm vi.
6. Cập nhật mục **Bàn giao gần nhất** trong `PROJECT_STATE.md` khi thay đổi đáng kể.
7. Commit với thông điệp rõ ràng. Push nhánh nếu GitHub credentials hợp lệ.
8. Báo cáo: nhánh, commit, file sửa, test, rủi ro, việc production còn cần thầy làm.

## 4. Kiểm tra bắt buộc

- JavaScript/MJS đã sửa: `node --check <file>`.
- HTML đã sửa lớn: xác nhận còn `</html>` và kiểm tra cú pháp các khối script.
- JSON đã sửa/sinh: parse toàn bộ JSON liên quan.
- Quiz Student: chạy `node scripts/test-quiz-merge.mjs` và `node scripts/test-quiz-publish.mjs` khi chạm luồng quiz/sync.
- Chạy `git diff --check` trước commit.
- Không tuyên bố production hoạt động nếu chưa kiểm tra website thật hoặc workflow thật.

## 5. Quyền tự động và điểm phải dừng

Agent được tự động: đọc/sửa file trong worktree, chạy test, tạo commit và push nhánh tính năng.

Agent phải dừng và xin thầy xác nhận trước khi:

- merge/push trực tiếp `main` hoặc deploy production;
- deploy Google Apps Script, đổi Firebase/GitHub settings hoặc credential;
- ghi/xóa dữ liệu thật, tài khoản, câu hỏi, điểm, tiến độ;
- xóa file chưa rõ chủ sở hữu hoặc thay đổi làm mất dữ liệu;
- thử nghiệm bằng mật khẩu/adminKey/token thật.

Không bao giờ đưa secret vào prompt, artifact, log, commit hoặc ảnh chụp.

## 6. Mẫu bàn giao cuối

```text
Kết quả:
- Repo / branch / commit:
- File đã sửa:
- Hành vi mới:
- Kiểm tra đã chạy và kết quả:
- Diff/secret scan:
- Việc chưa làm hoặc cần thầy xác nhận:
- Cách hoàn tác:
```
