# ĐỀ XUẤT SCHEMA CHUNG CHO NGÂN HÀNG CÂU HỎI
**Dự án**: Nền tảng Website Vật Lý Xuân Trường (`edu-portal-lms` & `edu-portal-console`)  
**Tác giả thiết kế**: Machine-1 (Production Owner)  
**Phiên bản**: v1.1 — Chuẩn hóa theo Quyết định Thiết kế AAC  
**Ngày ban hành**: 27/08/2026  

---

## 1. Mục tiêu chuẩn hóa & Nguyên tắc Cốt lõi (AAC Principles)

Hợp nhất toàn bộ các nguồn câu hỏi rời rạc (Luyện tập bài học, Đua Top, Solo, Video Quiz, Đề kiểm tra, Đề thi thử) về một **Schema chuẩn duy nhất** (`Unified Question Schema v1.1`). 

### 6 Nguyên tắc thiết kế bắt buộc:
1. **Teaching Scope tập trung**: Phạm vi giảng dạy (Khóa học, Giai đoạn, các Chương đang mở, Bài đang mở) do Admin quản lý tập trung 100%.
2. **Đua Top & Solo dùng chung Scope**: Tự động lấy câu hỏi thuộc **tất cả các chương đang mở**. Hai chế độ dùng chung tập câu hỏi nhưng có cấu hình phân bổ mức độ nhận thức độc lập.
3. **Bộ lọc Chất lượng Tuyệt đối**: Câu hỏi mới nhập luôn ở trạng thái `Thô` (`tho`). **Câu Thô tuyệt đối không xuất hiện cho học sinh**. Chỉ câu được duyệt `Tinh` (`da_duyet_tinh`) mới được xuất bản.
4. **Hợp nhất Pipeline Nhập liệu**: Cả hai kênh nhập Word (`.docx`) và Excel (`.xlsx`) phải cùng xuất về **một Unified Question Schema**, không tạo pipeline dữ liệu riêng biệt.
5. **Tính Bất Biến của ID & Đề thi (Immutable Exam Snapshot)**:
   - Giữ mã `id` câu hỏi ổn định (immutable question id) xuyên suốt hệ thống.
   - Đề thi khi xuất bản lưu danh sách tham chiếu `questionId` kèm **toàn bộ snapshot nội dung tại thời điểm xuất bản**. Việc chỉnh sửa/cập nhật câu gốc trong ngân hàng sau này không làm thay đổi đề thi học sinh đã thi.
6. **Điều kiện Tiên Quyết (Gate Check)**: Chưa triển khai code nghiệp vụ cho đến khi nhận schema của Machine-2 và hoàn thành đối chiếu hai phía.

---

## 2. Chi tiết 15 Trường Dữ Liệu Cốt Lõi

| STT | Trường dữ liệu (Field Name) | Kiểu dữ liệu | Mô tả chi tiết & Quy ước giá trị |
| :---: | :--- | :--- | :--- |
| **1** | `id` | `String` (Khóa chính) | Mã định danh duy nhất của câu hỏi (Bất biến khi đã phát hành).<br>• Quy ước chuẩn: `[Môn]_[GiaiĐoạn]_[Chương]_[Bài]_[Dạng]_[SốThứTự]` (VD: `VL12_GD1_C1_B01_TN_001` hoặc UUID/Hash content). |
| **2** | `loaiNganHang` | `Array<String>` | Mục đích sử dụng câu hỏi:<br>• `luyentap_baihoc`: Bài tập trắc nghiệm tự luyện sau bài giảng.<br>• `duatop_solo`: Kho câu hỏi dùng cho Đua Top và Solo 1-1.<br>• `dethi_danhgia`: Câu hỏi dùng cho đề kiểm tra định kỳ.<br>• `thithu_quocgia`: Câu hỏi dùng cho các đợt thi thử chuẩn cấu trúc Bộ.<br>• `videocauhoi`: Câu hỏi popup xuất hiện khi học sinh xem video.<br>• `tonghop`: Dùng cho mọi chế độ. |
| **3** | `khoaHoc` | `String` (Slug chuẩn) | Khóa học sở thuộc:<br>• `vatly12_lythuyet_gd1`: Chuyên đề lý thuyết GĐ1 - Vật Lý 12.<br>• `vatly12_tongon_gd2`: Tổng ôn toàn diện GĐ2.<br>• `vatly12_luyende_gd3`: Luyện đề thực chiến GĐ3.<br>• `laygoc_10_11`: Khóa lấy gốc lớp 10, 11. |
| **4** | `giaiDoan` | `String` (Enum) | Giai đoạn học tập:<br>• `GD1`: Giai đoạn 1 — Nền tảng lí thuyết chuyên đề.<br>• `GD2`: Giai đoạn 2 — Tổng ôn phân dạng nâng cao.<br>• `GD3`: Giai đoạn 3 — Luyện đề thực chiến về đích.<br>• `BOTRO`: Khóa bổ trợ / Ôn tập chuyên sâu. |
| **5** | `chuong` | `String` (Slug / ID) | Mã định danh chuẩn của Chương học:<br>• `C1_VatLyNhiet`: Chương 1 — Vật Lí Nhiệt.<br>• `C2_KhiLiTuong`: Chương 2 — Khí Lí Tưởng.<br>• `C3_TuTruong`: Chương 3 — Từ Trường.<br>• `C4_VatLyHatNhan`: Chương 4 — Vật Lí Hạt Nhân. |
| **6** | `baiHoc` | `String` (Slug / ID) | Mã định danh bài học cụ thể (Khóa ngoại khớp với `MaBai` trong `data/baihoc.json`):<br>• `B01_MoHinhDongHocPhanTu`, `B02_LucLienKet`, ... |
| **7** | `dangCauHoi` | `String` (Enum) | Định dạng câu hỏi theo chuẩn Bộ GD&ĐT 2025+:<br>• `TN4`: Trắc nghiệm 4 lựa chọn (A, B, C, D) — 1 đáp án đúng.<br>• `DS`: Trắc nghiệm Đúng / Sai (gồm 4 ý a, b, c, d).<br>• `TLN`: Trắc nghiệm Trả lời ngắn (điền số thập phân / phân số).<br>• `CHUM`: Cụm câu hỏi dùng chung một đoạn dữ kiện / đồ thị thực tế. |
| **8** | `mucDo` | `String` (Enum) | Mức độ tư duy nhận thức:<br>• `NB`: Nhận biết (+10đ Đua Top).<br>• `TH`: Thông hiểu (+20đ Đua Top).<br>• `VD`: Vận dụng (+35đ Đua Top).<br>• `VDC`: Vận dụng cao (+50đ Đua Top). |
| **9** | `noiDung` | `Object` | Nội dung câu hỏi hỗ trợ Markdown + LaTeX KaTeX (`$...$` và `$$...$$`). Với câu chùm, chứa `deBaiChung` và danh sách câu con. |
| **10** | `dapAn` | `Object` | Đáp án đúng chuẩn hóa:<br>• `TN4`: `"A"` \| `"B"` \| `"C"` \| `"D"`.<br>• `DS`: `{"a": true, "b": false, "c": false, "d": true}` (hoặc chuỗi `"Đ,S,S,Đ"`).<br>• `TLN`: `12.5` (hoặc `{"value": 12.5, "tolerance": 0.05}`). |
| **11** | `loiGiai` | `Object` | Lời giải chi tiết + Phương pháp giải nhanh + Link video giải ngắn (nếu có). |
| **12** | `nguon` | `String` | Nguồn gốc xuất xứ câu hỏi (VD: "Đề Chuyên ĐH Sư Phạm HN 2025", "Thầy Xuân Trường biên soạn độc quyền", "SGK Kết Nối Tri Thức"). |
| **13** | `trangThaiBanQuyen` | `String` (Enum) | Trạng thái bản quyền:<br>• `doc_quyen_vlxt`: Bản quyền thuộc Vật Lý Xuân Trường.<br>• `chuyen_nhuong`: Bản quyền tác giả đã chuyển nhượng.<br>• `cong_khai_tham_khao`: Đề thi thử công khai của các Sở/Trường. |
| **14** | `assets` | `Array<Object>` | Tài nguyên đa phương tiện đi kèm:<br>`[{"type": "image", "url": "images/nganhang/C1_B02_H01.png", "caption": "Đồ thị chuyển thể"}, {"type": "video_timestamp", "time": 145}]` |
| **15** | `trangThaiDuyet` | `String` (Enum) | Quy trình kiểm soát chất lượng nội dung:<br>• `tho`: Bản thô vừa nhập từ Word/Excel, **tuyệt đối không xuất hiện cho học sinh**.<br>• `da_duyet_tinh`: Đã kiểm duyệt đáp án, công thức KaTeX và hình ảnh chuẩn 100% $\to$ được phép xuất bản.<br>• `luu_tru`: Câu hỏi cũ đưa vào kho lưu trữ, không dùng cho game/thi chính. |

---

## 3. Schema Cấu trúc Đề Thi Tham Chiếu & Snapshot Bất Biến (Exam Schema)

Để đảm bảo việc sửa câu gốc trong ngân hàng **không làm biến đổi đề thi đã thi**, đề thi được thiết kế theo cấu trúc sau:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ExamRecord",
  "type": "object",
  "required": ["examId", "tenDe", "thoiGian", "publishedAt", "questionsSnapshot"],
  "properties": {
    "examId": { "type": "string" },
    "tenDe": { "type": "string" },
    "moTa": { "type": "string" },
    "thoiGian": { "type": "integer" },
    "trangThai": { "type": "string", "enum": ["mo", "khoa", "an"] },
    "publishedAt": { "type": "string", "format": "date-time" },
    "questionRefs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Danh sách questionId tham chiếu tới câu gốc trong ngân hàng"
    },
    "questionsSnapshot": {
      "type": "array",
      "items": { "$ref": "#/definitions/UnifiedQuestionItem" },
      "description": "Bản chụp nguyên vẹn nội dung câu hỏi tại thời điểm xuất bản đề thi"
    }
  }
}
```

---

## 4. Phân Bổ Mức Độ Đua Top vs Solo (Difficulty Config)

Mặc dù Đua Top và Solo cùng dùng chung **Tất cả các chương đang mở** trong Teaching Scope, cấu hình phân bổ mức độ nhận thức được phân định rõ:

```json
{
  "teachingScope": {
    "activeCourseId": "vatly12_lythuyet_gd1",
    "activeStage": "GD1",
    "activeChapterIds": ["C1_VatLyNhiet", "C2_KhiLiTuong"],
    "qualityFilter": "da_duyet_tinh",
    "modes": {
      "duatop": {
        "poolType": "all_active_chapters",
        "questionCountPerSession": 20,
        "difficultyProgression": "progressive_streak",
        "speedBonusCapSeconds": 30
      },
      "solo": {
        "poolType": "all_active_chapters",
        "questionCountPerMatch": 8,
        "difficultyQuota": {
          "NB": 3,
          "TH": 3,
          "VD": 1,
          "VDC": 1
        },
        "timePerQuestionSeconds": 40
      }
    }
  }
}
```

---

## 5. Ánh xạ sang Bảng Google Sheets (Google Sheets Column Mapping)

Bảng Sheet `NganHang` cập nhật trên Google Sheets:

| STT | Tên cột trong Sheet `NganHang` | Kiểu lưu trữ trong cell |
| :---: | :--- | :--- |
| 1 | `id` | Chuỗi ký tự (Text - Bất biến) |
| 2 | `loaiNganHang` | `luyentap_baihoc,duatop_solo` (danh sách phân tách dấu phẩy) |
| 3 | `khoaHoc` | Mã khóa học chuẩn (VD: `vatly12_lythuyet_gd1`) |
| 4 | `giaiDoan` | `GD1` \| `GD2` \| `GD3` \| `BOTRO` |
| 5 | `chuong` | `C1_VatLyNhiet` \| `C2_KhiLiTuong` \| `C3_TuTruong` \| `C4_VatLyHatNhan` |
| 6 | `baiHoc` | Mã bài học chuẩn (VD: `B01_MoHinhDongHocPhanTu` hoặc `B1036d251af19`) |
| 7 | `dangCauHoi` | `TN4` \| `DS` \| `TLN` \| `CHUM` |
| 8 | `mucDo` | `NB` \| `TH` \| `VD` \| `VDC` |
| 9 | `nhomId` | Mã nhóm câu chùm (để trống nếu là câu đơn lẻ) |
| 10 | `deBaiChung` | Đề bài chung của câu chùm (nếu có) |
| 11 | `question` | Nội dung câu hỏi (chứa LaTeX) |
| 12 | `optA` / `optB` / `optC` / `optD` | 4 phương án (với TN4) hoặc 4 mệnh đề a, b, c, d (với DS) |
| 13 | `correct` | Đáp án (`A`, `Đ,S,S,Đ`, `4.0`) |
| 14 | `giaiThich` | Lời giải chi tiết |
| 15 | `nguon` | Nguồn gốc câu hỏi |
| 16 | `trangThaiBanQuyen` | `doc_quyen_vlxt` \| `chuyen_nhuong` \| `cong_khai_tham_khao` |
| 17 | `hinhAnh` | URLs hình ảnh (phân tách dấu phẩy) |
| 18 | `trangThaiDuyet` | `tho` \| `da_duyet_tinh` \| `luu_tru` |
| 19 | `ngayCapNhat` | Timestamp ISO |
