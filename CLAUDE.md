# 🔬 Vật Lý Xuân Trường — Project Brief

## Tổng quan
Website học vật lý online tại **xuantruongmyself-png.github.io/vatly-xuantruong** (GitHub Pages, auto-deploy qua GitHub Actions), do thầy Trường (không biết lập trình) xây dựng cùng Claude. Stack **100% miễn phí, serverless**: HTML/CSS/JS thuần + Google Sheets làm database + Netlify hosting.

## Kiến trúc hệ thống
```
[Học sinh / Thầy]
       ↕ fetch/POST
[Google Apps Script] ← cầu nối API duy nhất
       ↕
[Google Sheets] — 4 tab: BaiHoc | NganHangDe | BangVang | TienDo
       ↕
[Netlify] — host các file .html tĩnh
```

## Các file trong dự án

| File | Vai trò | Trạng thái |
|------|---------|------------|
| `index.html` | Trang chủ | ✅ Xong |
| `baihoc.html` | Học sinh xem bài học + video YouTube, theo dõi tiến độ | ✅ Xong (có cache localStorage 5 phút) |
| `danhsach-ly12.html` | Danh sách đề thi | ✅ Xong |
| `thithu.html` | Giao diện làm bài thi — đếm giờ, chấm điểm, ghi Sheets | ✅ Xong |
| `admin.html` | Bảng điều khiển: quản lý bài học, soạn đề từ .docx, xem điểm | ✅ Gần hoàn chỉnh |
| `apps-script-CAPNHAT.txt` | Code Google Apps Script — dán vào script.google.com và Deploy | ✅ Có sẵn |
| `DE_THI_MAU.docx` | File Word mẫu để test tính năng soạn đề | ✅ Có sẵn |

## Cách dữ liệu hoạt động

**Đọc (GET):** `?type=baihoc` / `?type=diemthi` / `?type=tiendo`
**Ghi (POST):** `action: saveBaiHoc / deleteBaiHoc / saveQuestions / saveDiemThi`

**Apps Script URL:** `https://script.google.com/macros/s/AKfycbzxn5Zue4GdGMTnZuts_sNRc2X-BWulWCwKe8fdwJd6PyBbn7pOqxDBG4alOuk96is5/exec`

**Netlify Site ID:** `412fbb45-580b-410c-bfbb-6590331f4407`

## Đặc điểm kỹ thuật quan trọng

- **Cache localStorage** (`vlxt_lessons_cache`, TTL 5 phút): `baihoc.html` tải tức thì từ cache, fetch ngầm update. Admin xóa cache sau khi lưu/xóa bài → học sinh thấy dữ liệu mới ngay lần tiếp theo.
- **POST dùng `mode:'no-cors'`** → không đọc được response, nhưng dữ liệu vẫn lưu đúng vào Sheets.
- **Parser .docx** trong admin.html: dùng `mammoth.js` + `JSZip` để đọc file Word ngay trên trình duyệt, tách câu hỏi A/B/C/D, nhận dạng đáp án đúng bằng dấu `*` (ví dụ `*C.`).
- **KaTeX**: render công thức vật lý dạng `$...$` và `$$...$$`.
- **Deploy**: Push lên GitHub → GitHub Actions tự build và deploy lên GitHub Pages (~1 phút). Không cần Netlify.

## Admin panel (admin.html) — 3 tab

1. **Bài Học**: Thêm/sửa/xóa bài giảng (KhoaHoc, Chuong, TenBai, Video YouTube, VideoGiai, MoTaBai)
2. **Soạn Đề**: Upload file .docx → parser tự động tách câu hỏi → xem preview → Xuất Bản lên Sheets NganHangDe
3. **Kết Quả**: Xem bảng điểm học sinh từ Sheets BangVang

## Cấu trúc Google Sheets cần có

- `BaiHoc`: KhoaHoc | Chuong | TenBai | Video | VideoGiai | MoTaBai | NgayDang | BaiTap
- `NganHangDe`: id | type | question | optA | optB | optC | optD | correct
- `BangVang`: name | studentClass | phone | score | timestamp
- `TienDo`: sdt | lesson | khoa | ten | lop | ngay

## Việc còn cần làm (theo thứ tự ưu tiên)

1. Deploy file mới lên Netlify (kéo thả thư mục)
2. Xác nhận Apps Script đang chạy đúng URL
3. Test upload DE_THI_MAU.docx → soạn đề → xuất bản
4. Test chu trình thi: học sinh vào thi → điểm ghi vào Sheets
5. Kiểm tra responsive trên điện thoại

## Nguyên tắc làm việc

- Thầy Trường không biết lập trình — giải thích bằng ngôn ngữ đơn giản, không dùng thuật ngữ kỹ thuật khi không cần
- Luôn viết code hoàn chỉnh, copy-paste được
- Giữ theme tối giản, sạch (không dark space nữa — đã chuyển sang light theme trắng chuyên nghiệp)
- Ưu tiên sửa trực tiếp file, không tạo file mới thừa
