// ════════════════════════════════════════════════════════════════

// APPS SCRIPT TOÀN DIỆN — Vật Lý Xuân Trường  (v22: + Settings / currentTeachingLesson)
// Dán toàn bộ đoạn này vào Google Apps Script, rồi Deploy lại.
// ════════════════════════════════════════════════════════════════
// CẤU TRÚC GOOGLE SHEETS CẦN CÓ:
//   Tab "BaiHoc"     : KhoaHoc | Chuong | TenBai | Video | VideoGiai | MoTaBai | NgayDang | BaiTap
//   Tab "NganHangDe" : id | type | question | optA | optB | optC | optD | correct | examId
//   Tab "NganHang"   : id | mon | chuong | mucDo | loai | nhomId | deBaiChung | question | optA | optB | optC | optD | correct | hinhAnh | giaiThich | ngayThem | baiHoc
//   Tab "DanhSachDe" : examId | tenDe | moTa | thoiGian | trangThai | lop | soLuotLam
//   Tab "BangVang"   : name | studentClass | phone | score | timestamp
//   Tab "TienDo"     : sdt | lesson | khoa | ten | lop | ngay
//   Tab "TaiKhoan"   : sdt | hoten | lop | matkhau | ngayDK | lpTotal | diemGame | loaiTK | trialExpiry
//   Tab "KhoaConfig" : khoaHoc | loaiTK   (free,vip,premium hoặc vip,premium hoặc premium)
//   Tab "NhiemVu"   : sdt | nhipHoc | conTro | lastMissionDate | startDate | chuoiDung | tongDiemDuaTop
//   Tab "Settings"  : key | value   (cấu hình toàn trang, vd: currentTeachingLesson)
//   Tab "TeachingScope" : courseId | stageId | openChapterIds | activeLessonIds | validFrom | validTo | isActive | updatedAt | updatedBy | revision
//   Tab "ThietBiHocThu" : deviceId | sdt | hoten | trialStart | trialExpiry | soLanChan  ← chống học thử nhiều lần
// ════════════════════════════════════════════════════════════════
const DEVICE_LOCK_ENABLED = false; // 18/7 TAM THOI TAT de thay lam video (theo yeu cau) -- doi lai thanh true + Trien khai > Phien ban moi de BAT LAI chan hoc thu nhieu lan

function doGet(e) {
  const type   = (e.parameter.type || '').toLowerCase();
  const hs     = e.parameter.hs || '';
  const examId = e.parameter.examId || '';
  try {
    if (type === 'videocauhoi')     return getVideoCauHoi(e.parameter.bai || '');
    if (type === 'baitaptracnghiem') return getBaiTapTracNghiem(e.parameter.bai || '');
    if (type === 'transcript')       return getVideoTranscript(e.parameter.v || '', e.parameter.lang || '');
    if (type === 'baihoc')           return getBaiHoc();
    if (type === 'diemthi')          return getDiemThi();
    if (type === 'tiendo')           return getTienDo(hs);
    if (type === 'profile')          return getProfile(hs);
    if (type === 'leaderboard')      return getLeaderboard();
    if (type === 'sourcevideolinks') return getSourceVideoLinks();
    if (type === 'danhsachde')       return getDanhSachDe();
    if (type === 'nganhang')         return getNganHang();
    if (type === 'khoaconfig')       return getKhoaConfig();
    if (type === 'danhsachtaikhoan')  return getDanhSachTaiKhoan(e);
    if (type === 'hoatdong')         return getHoatDong(e);
    if (type === 'examquestions')    return getExamQuestions(examId || 'de01');
    if (type === 'examsolutions')    return getExamSolutions(examId || 'de01');
    if (type === 'nhiemvu')          return getNhiemVu(hs);
    if (type === 'settings')         return getSettings();
    if (type === 'teachingscope')    return getTeachingScope(e);
    if (type === 'danhsachthietbi')  return getDanhSachThietBi(e);
        if (type === 'searchprofiles')   return searchPublicProfiles(e);
    if (type === 'lichlive')          return getLiveSessions();
    if (type === 'huongdan')       return getHuongDan();
    return getExamQuestions('de01'); // backward compat — không có type param
  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = (data.action || '').toLowerCase();
    if (action === 'register')           return registerUser(data);
    if (action === 'login')              return loginUser(data);
    if (action === 'logingoogle')        return loginGoogle(data);
    if (action === 'savevideocauhoi') return saveVideoCauHoi(data);
    if (action === 'savebaitaptracnghiem') return saveBaiTapTracNghiem(data);
    if (action === 'logvideoquiz')    return logVideoQuiz(data);
    if (action === 'savebaihoc')         return saveBaiHoc(data);
    if (action === 'deletebaihoc')       return deleteBaiHoc(data);
    if (action === 'savequestions')      return saveQuestions(data);
    if (action === 'savenganhang')       return saveNganHang(data);
    if (action === 'savehuongdan')     return saveHuongDan(data);
    if (action === 'deletenganhang')     return deleteNganHang(data);
    if (action === 'updatenganhang')     return updateNganHang(data);
    if (action === 'importnganhang')     return importNganHang(data);
    if (action === 'bulksetbainganhang') return typeof bulkSetBaiHocNganHang === 'function' ? bulkSetBaiHocNganHang(data) : bulkSetBaiNganHang(data);
    if (action === 'bulksetchatluongnganhang') return bulkSetChatLuongNganHang(data);
    if (action === 'saveprogress')       return saveProgress(data);
    if (action === 'savescore')          return saveScore(data);
    if (action === 'updatebaihocvideo')  return updateBaiHocVideo(data);
    if (action === 'saveexam')           return saveExam(data);
    if (action === 'deleteexam')         return deleteExam(data);
    if (action === 'incrementlam')       return incrementLam(data);
    if (action === 'pingadmin')          return pingAdmin(data);
    if (action === 'setvipstatus')       return setVipStatus(data);
    if (action === 'deleteaccount')      return deleteAccount(data);
    if (action === 'loghoatdong')        return logHoatDong(data);
    if (action === 'updateaccount')      return updateAccount(data);
    if (action === 'savenhiemvu')        return saveNhiemVu(data);
    if (action === 'saveduatop')         return saveDuaTop(data);
    if (action === 'savesoloresult')     return saveSoloResult(data);
    if (action === 'savesetting')        return saveSetting(data);
    if (action === 'saveteachingscope')  return saveTeachingScope(data);
    if (action === 'savekhoaconfig')     return saveKhoaConfig(data);
    if (action === 'resetdevice')        return resetDevice(data);
    if (action === 'savelivesession')    return saveLiveSession(data);
    if (action === 'deletelivesession')  return deleteLiveSession(data.id);
    return jsonOut({ ok: false, msg: 'Unknown action' });
  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

// ── Tiện ích ──────────────────────────────────────────────────


// ── Quản lý Khóa Quản trị Bảo mật ───────────────────────────
function getAdminKey() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || '';
}

function requireAdmin(key) {
  const expected = String(getAdminKey() || '').trim();
  const provided = String(key || '').trim();
  return Boolean(expected && provided && expected === provided);
}

function getOrCreate(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers && headers.length) sheet.appendRow(headers);
  } else if (headers && headers.length) {
    // Thêm cột mới nếu sheet đã tồn tại nhưng thiếu cột
    const lastCol = sheet.getLastColumn();
    const existing = lastCol > 0
      ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String)
      : [];
    headers.forEach(h => {
      if (h && !existing.includes(String(h))) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue(h);
        existing.push(String(h));
      }
    });
  }
  return sheet;
}

// Ghi 1 hàng vào sheet theo tên cột (an toàn khi cột bị đổi thứ tự)
function writeRowNamed(sheet, rowIdx, dataObj) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const row = headers.map(h => (h && dataObj.hasOwnProperty(h)) ? dataObj[h] : '');
  sheet.getRange(rowIdx, 1, 1, row.length).setValues([row]);
}

// Append hàng mới theo tên cột
function appendRowNamed(sheet, dataObj) {
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const row = headers.map(h => (h && dataObj.hasOwnProperty(h)) ? dataObj[h] : '');
  sheet.appendRow(row);
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map((row, idx) => {
    const obj = { _rowIndex: idx + 2 };
    headers.forEach((h, i) => { if (h) obj[h] = row[i] !== undefined ? row[i] : ''; });
    return obj;
  });
}

// Tìm rowIndex từ originalKey "KhoaHoc|||Chuong|||TenBai"
function findRowByKey(sheet, key) {
  if (!key) return null;
  const parts = key.split('|||');
  if (parts.length < 3) return null;
  const [khoa, chuong, tenbai] = parts;
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(khoa) &&
        String(data[i][1]) === String(chuong) &&
        String(data[i][2]) === String(tenbai)) {
      return i + 1;
    }
  }
  return null;
}

function findRowByMaBai(sheet, maBai) {
  if (!maBai) return null;
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const col = headers.indexOf('MaBai');
  if (col < 0) return null;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const data = sheet.getRange(2, col+1, lastRow-1, 1).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] && String(data[i][0]) === String(maBai)) return i + 2;
  }
  return null;
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── AUTH: Đăng ký ─────────────────────────────────────────────

// Helper: chuẩn hoá SĐT để so sánh (bỏ ký tự không phải số + bỏ số 0 đầu)
function normSdt(s) { return String(s || '').replace(/\D/g,'').replace(/^0+/,''); }

function registerUser(data) {
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  // Chuẩn hoá SĐT: chỉ giữ số
  const sdtClean = String(data.sdt || '').replace(/\D/g,'').trim();
  if (!sdtClean) return jsonOut({ ok: false, msg: 'Số điện thoại không hợp lệ!' });
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const existSdt = normSdt(rows[i][0]);
    if (existSdt && existSdt === normSdt(sdtClean)) {
      return jsonOut({ ok: false, msg: 'Số điện thoại này đã được đăng ký rồi! Nếu quên mật khẩu, hãy nhắn thầy qua Zalo.' });
    }
  }

  // ── Chống học thử nhiều lần: nhận diện thiết bị (best-effort) ──
  const deviceId = String(data.deviceId || '').trim();
  if (DEVICE_LOCK_ENABLED && deviceId) {
    const devSheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
    const devRows  = devSheet.getDataRange().getValues();
    for (let i = 1; i < devRows.length; i++) {
      if (String(devRows[i][0]).trim() === deviceId) {
        devSheet.getRange(i + 1, 6).setValue((Number(devRows[i][5]) || 0) + 1);
        return jsonOut({ ok: false, code: 'device_used',
          msg: 'Thiết bị này đã dùng hết 7 ngày học thử trước đó (tài khoản ' + dispSdt(devRows[i][1]) + '). Vui lòng liên hệ thầy qua Zalo/TikTok để được gia hạn thêm thời gian học thử. Cảm ơn em đã trải nghiệm!' });
      }
    }
  }

  const now          = new Date();
  const trialExpiry  = now.getTime() + 7 * 24 * 60 * 60 * 1000; // 7 ngày
  const loaiTK       = 'vip'; // trial VIP 1 tuần
  sheet.appendRow([
    data.sdt, data.hoten, data.lop, data.matkhau,
    now.toISOString(), 0, 0, loaiTK, trialExpiry
  ]);
  if (DEVICE_LOCK_ENABLED && deviceId) {
    const devSheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
    devSheet.getRange(devSheet.getLastRow() + 1, 2, 1, 1).setNumberFormat('@'); // giữ số 0 đầu SĐT
    devSheet.appendRow([deviceId, String(data.sdt), data.hoten, now.getTime(), trialExpiry, 0]);
  }
  return jsonOut({ ok: true, msg: 'Đăng ký thành công! Bạn có 7 ngày dùng thử VIP miễn phí.', user: {
    sdt: data.sdt, hoten: data.hoten, lop: data.lop,
    lpTotal: 0, diemGame: 0, loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: false, tracNghiemVideo: false
  }});
}

// ── AUTH: Đăng nhập ──────────────────────────────────────────

function loginUser(data) {
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (normSdt(row[0]) === normSdt(data.sdt) &&
        String(row[3]).trim() === String(data.matkhau).trim()) {
      let loaiTK      = row[7] || 'vip';  // mặc định vip cho TK cũ chưa có cột
      let trialExpiry = row[8] ? Number(row[8]) : 0;
      if (!trialExpiry && row[4]) {
        try { trialExpiry = new Date(row[4]).getTime() + 7*24*60*60*1000; } catch(e) {}
      }
      // Tự hạ cấp nếu trial hết hạn
      if (loaiTK === 'vip' && trialExpiry && Date.now() > trialExpiry) {
        loaiTK = 'free';
        sheet.getRange(i + 1, 8).setValue('free'); // cột loaiTK (1-based = 8)
      }
      return jsonOut({ ok: true, user: {
        sdt: row[0], hoten: row[1], lop: row[2],
        lpTotal: typeof row[5] === 'number' ? (row[5] || 0) : 0, diemGame: typeof row[6] === 'number' ? (row[6] || 0) : 0,
        loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: !!(row[9]), tracNghiemVideo: (row[10] === false ? false : true), mienLuyenTap: !!(row[11])
      }});
    }
  }
  return jsonOut({ ok: false, msg: 'Số điện thoại hoặc mật khẩu không đúng!' });
}

// ── Đăng nhập bằng Google ────────────────────────────────────

function loginGoogle(data) {
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  const email = String(data.email || '').trim().toLowerCase();
  if (!email) return jsonOut({ ok: false, msg: 'Không có email Google.' });

  // Tài khoản Google đã tồn tại → đăng nhập bình thường, KHÔNG check thiết bị
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === email) {
      if (data.hoten) sheet.getRange(i+1, 2).setValue(data.hoten);
      if (data.lop && data.lop !== 'Google') sheet.getRange(i + 1, 3).setValue(String(data.lop));
      let loaiTK      = rows[i][7] || 'vip';
      let trialExpiry = rows[i][8] ? Number(rows[i][8]) : 0;
      if (!trialExpiry && rows[i][4]) {
        try { trialExpiry = new Date(rows[i][4]).getTime() + 7*24*60*60*1000; } catch(e) {}
      }
      if (loaiTK === 'vip' && trialExpiry && Date.now() > trialExpiry) {
        loaiTK = 'free';
        sheet.getRange(i + 1, 8).setValue('free');
      }
      return jsonOut({ ok: true, user: {
        sdt: rows[i][0], hoten: data.hoten || rows[i][1],
        lop: rows[i][2] || 'Google', email: email,
        avatar: data.avatar || '', lpTotal: rows[i][5] || 0,
        loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: !!(rows[i][9]), tracNghiemVideo: (rows[i][10] === false ? false : true)
      }});
    }
  }

  // ── Chống học thử nhiều lần: áp dụng CẢ cho luồng đăng nhập Google ──
  // (trước đây chỉ chặn ở registerUser bằng SĐT — học sinh lách bằng cách
  //  đổi sang tài khoản Google khác trên cùng máy, không hề bị chặn)
  const deviceId = String(data.deviceId || '').trim();
  if (DEVICE_LOCK_ENABLED && deviceId) {
    const devSheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
    const devRows  = devSheet.getDataRange().getValues();
    for (let i = 1; i < devRows.length; i++) {
      if (String(devRows[i][0]).trim() === deviceId) {
        devSheet.getRange(i + 1, 6).setValue((Number(devRows[i][5]) || 0) + 1);
        return jsonOut({ ok: false, code: 'device_used',
          msg: 'Thiết bị này đã dùng hết 7 ngày học thử trước đó (tài khoản ' + dispSdt(devRows[i][1]) + '). Vui lòng liên hệ thầy qua Zalo/TikTok để được gia hạn thêm thời gian học thử. Cảm ơn em đã trải nghiệm!' });
      }
    }
  }

  const now         = new Date();
  const trialExpiry = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  const loaiTK      = 'vip';
  sheet.appendRow([email, data.hoten || email, 'Google', 'GOOGLE_AUTH', now.toISOString(), 0, 0, loaiTK, trialExpiry]);
  if (DEVICE_LOCK_ENABLED && deviceId) {
    const devSheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
    devSheet.getRange(devSheet.getLastRow() + 1, 2, 1, 1).setNumberFormat('@');
    devSheet.appendRow([deviceId, email, data.hoten || email, now.getTime(), trialExpiry, 0]);
  }
  return jsonOut({ ok: true, user: {
    sdt: email, hoten: data.hoten || email,
    lop: 'Google', email: email,
    avatar: data.avatar || '', lpTotal: 0,
    loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: false, tracNghiemVideo: false
  }});
}

// ── GET: Hồ sơ học sinh ──────────────────────────────────────

function getProfile(sdt) {
  const acc   = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame']);
  const rows  = acc.getDataRange().getValues();
  let user    = null;
  for (let i = 1; i < rows.length; i++) {
    if (normSdt(rows[i][0]) === normSdt(sdt)) {
      let _loaiTK      = rows[i][7] || 'vip';
      let _trialExpiry = rows[i][8] ? Number(rows[i][8]) : 0;
      if (!_trialExpiry && rows[i][4]) {
        try { _trialExpiry = new Date(rows[i][4]).getTime() + 7*24*60*60*1000; } catch(e) {}
      }
      if (_loaiTK === 'vip' && _trialExpiry && Date.now() > _trialExpiry) {
        _loaiTK = 'free';
        acc.getRange(i + 1, 8).setValue('free');
      }
      user = { sdt: rows[i][0], hoten: rows[i][1], lop: rows[i][2], lpTotal: typeof rows[i][5]==='number'?(rows[i][5]||0):0, diemGame: typeof rows[i][6]==='number'?(rows[i][6]||0):0, loaiTK: _loaiTK, trialExpiry: _trialExpiry, mienVideo: !!(rows[i][9]), tracNghiemVideo: (rows[i][10] === false ? false : true), mienLuyenTap: !!(rows[i][11]) };
      break;
    }
  }
  if (!user) return jsonOut({ ok: false, msg: 'Không tìm thấy tài khoản' });

  const bg    = getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']);
  const bgRows = bg.getDataRange().getValues();
  const scores = [];
  for (let i = 1; i < bgRows.length; i++) {
    if (normSdt(bgRows[i][2]) === normSdt(sdt)) {
      scores.push({ ten: bgRows[i][0], diem: bgRows[i][3], ngay: bgRows[i][4] });
    }
  }

  const td    = getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  // 11/8: doc THEO TEN cot (giong sheetToJson) thay vi vi tri cung 0/1/2 - sheet nay co ca
  // header CU (HocSinh,Ten,Lop,Khoa,Lesson,Ngay) lan header MOI (sdt,lesson,khoa,ten,lop,ngay)
  // noi duoi nhau nen doc vi tri se luon lech voi du lieu ghi tu 21/7 tro di. CHI sua CACH DOC,
  // khong dung/sua du lieu nao.
  const tdJson = sheetToJson(td);
  const tiendo = [];
  for (let i = 0; i < tdJson.length; i++) {
    const r = tdJson[i];
    const rSdt = r.sdt || r.HocSinh || '';
    if (normSdt(rSdt) === normSdt(sdt)) {
      tiendo.push({ lesson: r.lesson || r.Lesson || '', khoa: r.khoa || r.Khoa || '' });
    }
  }

  return jsonOut({ ok: true, user, scores, tiendo });
}

// ── GET: Bảng xếp hạng ───────────────────────────────────────

function getLeaderboard() {
  const acc  = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame']);
  const rows = acc.getDataRange().getValues();
  const list = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0]) {
      list.push({
        hoten:    rows[i][1] || '---',
        lop:      rows[i][2] || '---',
        lpTotal:  Number(rows[i][5]) || 0,
        diemGame: Number(rows[i][6]) || 0
      });
    }
  }
  list.sort((a, b) => b.lpTotal - a.lpTotal);
  return jsonOut({ ok: true, data: list.slice(0, 50) });
}

// ── GET: Bài học ──────────────────────────────────────────────

function getBaiHoc() {
  const sheet = getOrCreate('BaiHoc', ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai']);
  return jsonOut(sheetToJson(sheet));
}

// ── GET: Danh sách đề thi ────────────────────────────────────
// Schema DanhSachDe: examId(0) | tenDe(1) | moTa(2) | thoiGian(3) | trangThai(4) | lop(5) | soLuotLam(6)

function getDanhSachDe() {
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam']);
  const rows  = sheetToJson(sheet);

  // Đếm số câu từ NganHangDe cho mỗi đề
  const ngh    = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId']);
  const nghData = ngh.getDataRange().getValues();
  const count  = {};
  for (let i = 1; i < nghData.length; i++) {
    const eid = String(nghData[i][8] || 'de01').trim();
    if (nghData[i][2]) count[eid] = (count[eid] || 0) + 1;
  }

  return jsonOut({ ok: true, data: rows.map(r => ({ ...r, soCau: count[r.examId] || 0 })) });
}

// ── GET: Câu hỏi theo examId ─────────────────────────────────
// NganHangDe schema: id(0) | type(1) | question(2) | optA(3) | optB(4) | optC(5) | optD(6) | correct(7) | examId(8)

function getExamQuestions(examId) {
  const sheet = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId','giaiThich']);
  const data  = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOut([]);
  let rows = data.slice(1).map(r => ({
    id:      r[0],
    type:    r[1] || 'mc',
    question: r[2],
    options: { A: r[3], B: r[4], C: r[5], D: r[6] },
    correct: r[7],
    examId:  String(r[8] || 'de01').trim()
  })).filter(r => r.question);

  if (examId) {
    rows = rows.filter(r => r.examId === examId);
  }
  return jsonOut(rows);
}

// ── GET: Lời giải chi tiết theo đề (chỉ gọi SAU khi học sinh nộp bài, KHÔNG kèm trong examquestions) ──
function getExamSolutions(examId) {
  const sheet = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId','giaiThich']);
  const data  = sheet.getDataRange().getValues();
  const out = {};
  if (data.length < 2) return jsonOut(out);
  const ex = String(examId || 'de01').trim();
  data.slice(1).forEach(r => {
    if (String(r[8] || 'de01').trim() === ex && r[2]) out[r[0]] = r[9] || '';
  });
  return jsonOut(out);
}

// ── GET: Điểm thi ─────────────────────────────────────────────

function getDiemThi() {
  const sheet = getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']);
  return jsonOut(sheetToJson(sheet));
}

// ── GET: Tiến độ ──────────────────────────────────────────────

function getTienDo(sdt) {
  const sheet = getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  const rows  = sheetToJson(sheet);
  if (!sdt) return jsonOut(rows);
  return jsonOut(rows.filter(r => String(r.sdt) === String(sdt)));
}

// ── POST: Lưu điểm thi ────────────────────────────────────────

function saveScore(data) {
  const sheet = getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']);
  sheet.appendRow([
    data.name || data.ten || '',
    data.studentClass || data.lop || '',
    data.phone || data.sdt || '',
    data.score || data.diem || 0,
    new Date().toISOString()
  ]);
  if (data.phone || data.sdt) {
    const sdt = data.phone || data.sdt;
    const acc = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame']);
    const rows = acc.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (normSdt(rows[i][0]) === normSdt(sdt)) {
        const cur = Number(rows[i][5]) || 0;
        const newScore = Number(data.score || data.diem || 0);
        acc.getRange(i+1, 6).setValue(Math.max(cur, newScore));
        break;
      }
    }
  }
  return jsonOut({ ok: true });
}


// ── POST: Lưu tiến độ ────────────────────────────────────────

function saveProgress(data) {
  // FIX 21/7: sheet TienDo có header cũ lệch cột (HocSinh,Ten,Lop,Khoa,Lesson,Ngay) so với
  // header hiện tại (sdt,lesson,khoa,ten,lop,ngay) do getOrCreate từng tự thêm cột mới.
  // Ghi/đọc theo TÊN cột (appendRowNamed/sheetToJson) thay vì theo VỊ TRÍ để luôn đúng cột dù thứ tự cột thế nào.
  const sheet = getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  const rows = sheetToJson(sheet);
  // 11/8: chong cong LP TRUNG khi 1 bai da hoan thanh duoi TEN/KEY CU (truoc migration MaBai
  // 6/8) nay duoc gui len duoi MA BAI moi - tra thu KhoaHoc|||Chuong|||TenBai HIEN TAI cua
  // MaBai nay (+ fallback vai ma da biet bi doi ten) de nhan dien la CUNG 1 bai. CHI mo rong
  // dieu kien nhan dien 'da lam roi', KHONG dung gi den logic ghi/tinh LP khac.
  let _oldKeyForThisLesson = '';
  try {
    const bhSheet = getOrCreate('BaiHoc', ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai']);
    const bhRows = sheetToJson(bhSheet);
    const bhRow = bhRows.find(function(b){ return String(b.MaBai||'').trim() === String(data.lesson||'').trim(); });
    if (bhRow) _oldKeyForThisLesson = [bhRow.KhoaHoc||'', bhRow.Chuong||'', bhRow.TenBai||''].join('|||');
  } catch(e) {}
  const _MIGRATION_OLDKEYS_SP = {
    'B1036d251af19':'Chuyên đề lí thuyết GĐ1 - Vật Lý 12|||Chương 1 – Vật lý Nhiệt|||B1. Khai giảng GĐ1 + Cấu trúc của chất & Mô hình động học phân tử',
    'B04e20f0ec67d':'Chuyên đề lí thuyết GĐ1 - Vật Lý 12|||Chương 1 – Vật lý Nhiệt|||B2. Lực liên kết và Sự chuyển thể của chất',
    'Bfb85fde44802':'Chuyên đề lí thuyết GĐ1 - Vật Lý 12|||Chương 1 – Vật lý Nhiệt|||B3. Nhiệt độ – Thang nhiệt độ – Nhiệt kế',
    'Bfc4552a2a3b2':'Chuyên đề lí thuyết GĐ1 - Vật Lý 12|||Chương 1 – Vật lý Nhiệt|||B4. Nhiệt dung riêng - Nóng chảy riêng - Hoá Hơi riêng',
    'Be5b72ccf1261':'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12|||Chương 1 – Vật lý Nhiệt|||B5. Nội Năng – Định Luật I Nhiệt Động Lực Học',
    'B04ff6fe289da':'5 NGÀY LẤY GỐC VẬT LÍ ( NÊN HỌC ⭐) - Vật Lý 12|||VẬT LÍ 10|||Ngày 1: Ý NGHĨA CỦA ĐƠN VỊ TRONG VẬT LÝ'
  };
  const _oldKeyFallback = _MIGRATION_OLDKEYS_SP[String(data.lesson||'').trim()] || '';
  const exists = rows.some(function(r){ return String(r.sdt) === String(data.sdt) && (
    String(r.lesson) === String(data.lesson) ||
    (_oldKeyForThisLesson && String(r.lesson) === _oldKeyForThisLesson) ||
    (_oldKeyFallback && String(r.lesson) === _oldKeyFallback)
  ); });
  if (exists) return jsonOut({ ok: true, msg: 'already', lpEarned: 0 });
  appendRowNamed(sheet, {
    sdt: data.sdt || '',
    lesson: data.lesson || '',
    khoa: data.khoa || '',
    ten: data.ten || '',
    lop: data.lop || '',
    ngay: new Date().toISOString()
  });

  // 6/8: cong LP xep hang khi hoan thanh bai hoc LAN DAU (truoc day hoan thanh bai khong
  // cong LP, chi Dua Top moi cong - theo yeu cau thay, gio hoc bai cung len hang duoc).
  const LP_PER_LESSON = 10;
  const RANK_MINS = [0, 50, 150, 300, 600, 1000]; // phai khop VLXT_RANKS phia frontend (xephang-fx.js)
  function rankIdx(lp) { let idx = 0; for (let i = 0; i < RANK_MINS.length; i++) { if (lp >= RANK_MINS[i]) idx = i; } return idx; }
  let lpEarned = 0, lpTotal = 0, rankUp = false;
  const acc = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const accRows = sheetToJson(acc);
  for (const r of accRows) {
    if (normSdt(r.sdt) === normSdt(data.sdt)) {
      const oldLp = Number(r.lpTotal) || 0;
      const newLp = oldLp + LP_PER_LESSON;
      writeRowNamed(acc, r._rowIndex, Object.assign({}, r, { lpTotal: newLp }));
      lpEarned = LP_PER_LESSON; lpTotal = newLp;
      rankUp = rankIdx(newLp) > rankIdx(oldLp);
      break;
    }
  }
  return jsonOut({ ok: true, lpEarned: lpEarned, lpTotal: lpTotal, rankUp: rankUp });
}

// ── POST: Quản lý bài học (Admin) ─────────────────────────────

function saveBaiHoc(data) {
  const COLS = ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai'];
  const sheet = getOrCreate('BaiHoc', COLS); // tự thêm cột thiếu nếu sheet cũ
  const rowIdx = (data.maBai && findRowByMaBai(sheet, data.maBai)) || data.rowIndex || findRowByKey(sheet, data.originalKey);
  // MaBai: ma dinh danh ON DINH cho moi bai hoc, KHONG BAO GIO doi khi doi ten khoa/chuong/bai
  // hoac sap xep lai vi tri - tien do hoc sinh (TienDo.lesson) bam theo ma nay de khong bao gio mat.
  let maBai = '';
  let existingThuTuBai = '';
  if (rowIdx) {
    const h_ = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const c_ = h_.indexOf('MaBai');
    if (c_ >= 0) maBai = sheet.getRange(rowIdx, c_+1).getValue() || '';
    const ct_ = h_.indexOf('ThuTuBai');
    if (ct_ >= 0) {
      const v_ = sheet.getRange(rowIdx, ct_+1).getValue();
      existingThuTuBai = (v_===null || v_===undefined) ? '' : v_;
    }
  }
  if (!maBai) maBai = data.maBai || ('B' + Utilities.getUuid().replace(/-/g,'').slice(0,12));
  // Giu nguyen ThuTuBai hien co neu client khong gui gia tri hop le (VD: cache trinh duyet cu
  // luc mo form Sua bai chua co ThuTuBai) - tranh bai tu "nhay xuong cuoi chuong" moi lan Luu (6/8/2026).
  const ttbToSave = (data.ThuTuBai !== undefined && data.ThuTuBai !== null && data.ThuTuBai !== '') ? data.ThuTuBai : existingThuTuBai;
  const rowData = {
    KhoaHoc:   data.KhoaHoc   || '',
    Chuong:    data.Chuong    || '',
    TenBai:    data.TenBai    || '',
    Video:     data.Video     || '',
    VideoGiai: data.VideoGiai || '',
    MoTaBai:   data.MoTaBai   || '',
    NgayDang:  data.NgayDang  || new Date().toISOString(),
    BaiTap:    data.BaiTap    || '',
    PDF:       data.PDF       || '',
        PDFLyThuyet: data.PDFLyThuyet || '',
        PDFLuyenTap: data.PDFLuyenTap || '',
    ThoiGianLamBai: data.ThoiGianLamBai || '',
    ThuTuBai: ttbToSave,
    MaBai:     maBai
  };
  if (rowIdx) {
    writeRowNamed(sheet, rowIdx, rowData);
  } else {
    appendRowNamed(sheet, rowData);
  }
  triggerStaticRefresh();
  return jsonOut({ ok: true });
}

function deleteBaiHoc(data) {
  const sheet = getOrCreate('BaiHoc', ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','ThoiGianLamBai']);
  const rowIdx = data.rowIndex || findRowByKey(sheet, data.key || data.originalKey);
  if (rowIdx) sheet.deleteRow(rowIdx);
  triggerStaticRefresh();
  return jsonOut({ ok: true });
}

// ── Lịch Live (Quản lý Lịch Live trong Admin) ──────────────────
const LIVE_COLS = ['id','title','date','time','loai','grade','desc','docUrl','ytUrl','thumb','done'];


function triggerStaticRefresh() {
  try {
    var token = PropertiesService.getScriptProperties().getProperty('GH_TOKEN');
    if (!token) return;
    UrlFetchApp.fetch('https://api.github.com/repos/eduhost-vn204/edu-portal-lms/actions/workflows/refresh-data.yml/dispatches', {
      method: 'post',
      contentType: 'application/json',
      headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github+json' },
      payload: JSON.stringify({ ref: 'main' }),
      muteHttpExceptions: true
    });
  } catch (e) {}
}

function getLiveSessions() {
  const sheet = getOrCreate('LichLive', LIVE_COLS);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOut([]);
  const headers = data[0];
  const tz = Session.getScriptTimeZone() || 'Asia/Ho_Chi_Minh';
  const rows = data.slice(1).map(function(r) {
    const obj = {};
    headers.forEach(function(h, i) {
      var v2 = r[i];
      if (v2 instanceof Date) {
        v2 = (String(h) === 'time') ? Utilities.formatDate(v2, tz, 'HH:mm') : Utilities.formatDate(v2, tz, 'dd/MM/yyyy');
      }
      obj[h] = (v2 !== undefined && v2 !== null) ? String(v2) : '';
    });
    obj.done = (obj.done === '1' || obj.done === 'TRUE' || obj.done === 'true' || obj.done === true);
    if (!obj.loai) obj.loai = 'live';
    return obj;
  });
  return jsonOut(rows);
}

function saveLiveSession(data) {
  const sheet = getOrCreate('LichLive', LIVE_COLS);
  if (!data.id) data.id = 'live_' + Date.now();
  const rowsRaw = sheet.getDataRange().getValues();
  let rowIdx = 0;
  for (let i = 1; i < rowsRaw.length; i++) {
    if (String(rowsRaw[i][0]) === String(data.id)) { rowIdx = i + 1; break; }
  }
  const rowData = {
    id: data.id, title: data.title || '', date: data.date || '', time: data.time || '', loai: data.loai || 'live',
    grade: data.grade || '', desc: data.desc || '', docUrl: data.docUrl || '',
    ytUrl: data.ytUrl || '', thumb: data.thumb || '', done: (data.done === true || data.done === '1' || data.done === 1) ? '1' : '0'
  };
  const targetRow = rowIdx || (sheet.getLastRow() + 1);
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  headers.forEach(function(h, i) {
    if (h === 'date' || h === 'time') sheet.getRange(targetRow, i + 1).setNumberFormat('@');
  });
  const row = headers.map(function(h) { return (h && rowData.hasOwnProperty(h)) ? rowData[h] : ''; });
  sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
  triggerStaticRefresh();
  return jsonOut({ ok: true, id: data.id });
}

function deleteLiveSession(id) {
  const sheet = getOrCreate('LichLive', LIVE_COLS);
  const rows = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(id)) { sheet.deleteRow(i + 1); break; }
  }
  triggerStaticRefresh();
  return jsonOut({ ok: true });
}

// ── POST: Lưu/cập nhật đề thi ────────────────────────────────
// Schema: examId(0) | tenDe(1) | moTa(2) | thoiGian(3) | trangThai(4) | lop(5) | soLuotLam(6)

function saveExam(data) {
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam']);
  if (!data.examId) return jsonOut({ ok: false, msg: 'Thiếu examId' });
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === String(data.examId).trim()) {
      // Update — giữ nguyên soLuotLam
      sheet.getRange(i+1, 1, 1, 7).setValues([[
        data.examId,
        data.tenDe  || rows[i][1],
        data.moTa   || rows[i][2],
        data.thoiGian !== undefined ? data.thoiGian : rows[i][3],
        data.trangThai || rows[i][4],
        data.lop    || rows[i][5],
        rows[i][6] || 0
      ]]);
      return jsonOut({ ok: true, action: 'updated' });
    }
  }
  // Thêm mới
  sheet.appendRow([
    data.examId,
    data.tenDe    || '',
    data.moTa     || '',
    data.thoiGian || 45,
    data.trangThai || 'khoa',
    data.lop      || '12',
    0
  ]);
  return jsonOut({ ok: true, action: 'created' });
}

// ── POST: Xóa đề thi + toàn bộ câu hỏi ───────────────────────

function deleteExam(data) {
  const examId = String(data.examId || '').trim();
  if (!examId) return jsonOut({ ok: false, msg: 'Thiếu examId' });

  // Xóa khỏi DanhSachDe
  const ds = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam']);
  const dsRows = ds.getDataRange().getValues();
  for (let i = dsRows.length - 1; i >= 1; i--) {
    if (String(dsRows[i][0]).trim() === examId) { ds.deleteRow(i+1); break; }
  }

  // Xóa câu hỏi của đề này (duyệt ngược để không bị lệch index)
  const ngh = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId']);
  const nghRows = ngh.getDataRange().getValues();
  for (let i = nghRows.length - 1; i >= 1; i--) {
    if (String(nghRows[i][8] || 'de01').trim() === examId) ngh.deleteRow(i+1);
  }

  return jsonOut({ ok: true });
}

// ── POST: Tăng lượt làm khi học sinh bắt đầu thi ─────────────

function incrementLam(data) {
  const examId = String(data.examId || '').trim();
  if (!examId) return jsonOut({ ok: false });
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam']);
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === examId) {
      sheet.getRange(i+1, 7).setValue((Number(rows[i][6]) || 0) + 1);
      return jsonOut({ ok: true });
    }
  }
  return jsonOut({ ok: false, msg: 'examId không tồn tại' });
}

// ── POST: Lưu câu hỏi vào đề ─────────────────────────────────
// NganHangDe: id | type | question | optA | optB | optC | optD | correct | examId

function saveQuestions(data) {
  const sheet  = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId','giaiThich']);
  const examId = String(data.examId || 'de01').trim();

  if (data.clearFirst) {
    // Chỉ xóa câu hỏi của đề này, giữ lại đề khác
    const rows = sheet.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 1; i--) {
      if (String(rows[i][8] || 'de01').trim() === examId) sheet.deleteRow(i + 1);
    }
  }

  (data.questions || []).forEach(q => {
    sheet.appendRow([
      q.id || '', q.type || 'mc', q.question || '',
      q.optA || q.options?.A || '',
      q.optB || q.options?.B || '',
      q.optC || q.options?.C || '',
      q.optD || q.options?.D || '',
      q.correct || '',
      examId,
      q.giaiThich || ''
    ]);
  });
  return jsonOut({ ok: true, count: (data.questions || []).length });
}

// ════════════════════════════════════════════════════════════════
// NGÂN HÀNG CÂU HỎI (v16) — kho câu hỏi độc lập, dùng để tổng hợp đề
// Schema: id(0) | mon(1) | chuong(2) | mucDo(3) | loai(4) | nhomId(5) |
//         deBaiChung(6) | question(7) | optA(8) | optB(9) | optC(10) |
//         optD(11) | correct(12) | hinhAnh(13) | giaiThich(14) | ngayThem(15) | baiHoc(16)
// ════════════════════════════════════════════════════════════════

const NH_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong'];

// ── GET: Toàn bộ ngân hàng câu hỏi ───────────────────────────
function getNganHang() {
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const data  = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOut({ ok: true, data: [] });
  const headers = data[0].map(h => String(h || '').trim().toLowerCase());
  const baiCol = headers.findIndex(h => h === 'baihoc' || h === 'tenbai');
  const clCol  = headers.findIndex(h => h === 'chatluong');
  const qCol   = headers.findIndex(h => h === 'question' || h === 'cauhoi' || h === 'debai');
  const actualQCol = qCol !== -1 ? qCol : 7;

  const rows = data.slice(1).map(r => ({
    id: r[0], mon: r[1], chuong: r[2], mucDo: r[3], loai: r[4] || 'TN',
    nhomId: r[5], deBaiChung: r[6], question: r[actualQCol] || r[7] || '',
    optA: r[8], optB: r[9], optC: r[10], optD: r[11],
    correct: r[12], hinhAnh: r[13], giaiThich: r[14], ngayThem: r[15],
    baiHoc: baiCol !== -1 ? r[baiCol] : (r[16] || ''),
    chatLuong: clCol !== -1 ? r[clCol] : (r[17] || '')
  })).filter(r => r.id && String(r.id).trim().length > 0);
  return jsonOut({ ok: true, data: rows });
}

// ── POST: Nạp câu hỏi vào ngân hàng (append, tự sinh id) ─────
function saveNganHang(data) {
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const existing = sheet.getDataRange().getValues();
  // Tìm số id lớn nhất hiện có (id dạng NH00001)
  let maxNum = 0;
  for (let i = 1; i < existing.length; i++) {
    const m = String(existing[i][0]).match(/^NH(\d+)$/);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }
  const now = new Date().toISOString();
  const added = [];
  (data.questions || []).forEach(q => {
    let id = String(q.id || '').trim();
    if (!id) { maxNum++; id = 'NH' + String(maxNum).padStart(5, '0'); }
    sheet.appendRow([
      id, q.mon || '', q.chuong || '', q.mucDo || '', q.loai || 'TN',
      q.nhomId || '', q.deBaiChung || '', q.question || '',
      q.optA || '', q.optB || '', q.optC || '', q.optD || '',
      q.correct || '', q.hinhAnh || '', q.giaiThich || '', now,
      q.baiHoc || '', q.chatLuong || 'tho'
    ]);
    added.push(id);
  });
  return jsonOut({ ok: true, count: added.length, ids: added });
}

// ── POST: Xóa câu hỏi khỏi ngân hàng theo danh sách id ───────
function deleteNganHang(data) {
  const ids = (data.ids || []).map(x => String(x).trim());
  if (!ids.length) return jsonOut({ ok: false, msg: 'Thiếu ids' });
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  let deleted = 0;
  for (let i = rows.length - 1; i >= 1; i--) {
    if (ids.indexOf(String(rows[i][0]).trim()) !== -1) { sheet.deleteRow(i + 1); deleted++; }
  }
  return jsonOut({ ok: true, deleted });
}

// ── POST: Sửa 1 câu trong ngân hàng theo id ──────────────────
function updateNganHang(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const id = String(data.id || '').trim();
  if (!id) return jsonOut({ ok: false, msg: 'Thiếu id' });

  const q = data.q || data;
  let newChatLuong = undefined;
  if (data.chatLuong !== undefined && data.chatLuong !== null) {
    newChatLuong = String(data.chatLuong).trim().toLowerCase();
  } else if (q.chatLuong !== undefined && q.chatLuong !== null) {
    newChatLuong = String(q.chatLuong).trim().toLowerCase();
  }

  if (newChatLuong !== undefined) {
    if (newChatLuong !== '' && newChatLuong !== 'tinh' && newChatLuong !== 'tho') {
      return jsonOut({ ok: false, msg: 'Chất lượng không hợp lệ (chỉ chấp nhận rỗng, tinh, tho)' });
    }
  }

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0] ? rows[0].map(String) : [];
  const baiCol = headers.indexOf('baiHoc') !== -1 ? headers.indexOf('baiHoc') : 16;
  const clCol = headers.indexOf('chatLuong') !== -1 ? headers.indexOf('chatLuong') : 17;
  const now = new Date().toISOString();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === id) {
      const finalChatLuong = newChatLuong !== undefined ? newChatLuong : (rows[i][clCol] !== undefined ? String(rows[i][clCol]) : '');
      sheet.getRange(i + 1, 1, 1, 18).setValues([[
        id,
        q.mon !== undefined ? q.mon : rows[i][1],
        q.chuong !== undefined ? q.chuong : rows[i][2],
        q.mucDo !== undefined ? q.mucDo : rows[i][3],
        q.loai !== undefined ? q.loai : (rows[i][4] || 'TN'),
        q.nhomId !== undefined ? q.nhomId : rows[i][5],
        q.deBaiChung !== undefined ? q.deBaiChung : rows[i][6],
        q.question !== undefined ? q.question : rows[i][7],
        q.optA !== undefined ? q.optA : rows[i][8],
        q.optB !== undefined ? q.optB : rows[i][9],
        q.optC !== undefined ? q.optC : rows[i][10],
        q.optD !== undefined ? q.optD : rows[i][11],
        q.correct !== undefined ? q.correct : rows[i][12],
        q.hinhAnh !== undefined ? q.hinhAnh : rows[i][13],
        q.giaiThich !== undefined ? q.giaiThich : (rows[i][14] || ''),
        rows[i][15] || now,
        q.baiHoc !== undefined ? q.baiHoc : (rows[i][baiCol] || ''),
        finalChatLuong
      ]]);
      return jsonOut({ ok: true, id: id, chatLuong: finalChatLuong });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy id ' + id });
}

// ── POST: Gán "Bài học" cho nhiều câu cùng lúc (phân loại hàng loạt) ──
function bulkSetBaiHocNganHang(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const ids = (data.ids || []).map(x => String(x).trim()).filter(Boolean);
  if (!ids.length) return jsonOut({ ok: false, msg: 'Thiếu ids' });
  const baiHoc = (data.baiHoc || '').toString();
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0] ? rows[0].map(String) : [];
  let baiCol = headers.indexOf('baiHoc');
  if (baiCol === -1) {
    baiCol = headers.length;
    sheet.getRange(1, baiCol + 1).setValue('baiHoc');
  }
  let updated = 0;
  for (let i = 1; i < rows.length; i++) {
    if (ids.indexOf(String(rows[i][0]).trim()) !== -1) {
      sheet.getRange(i + 1, baiCol + 1).setValue(baiHoc);
      updated++;
    }
  }
  return jsonOut({ ok: true, updated: updated });
}

function bulkSetBaiNganHang(data) {
  return bulkSetBaiHocNganHang(data);
}

// ── POST: Đánh dấu chất lượng câu hỏi ngân hàng hàng loạt ────
function bulkSetChatLuongNganHang(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  if (data.chatLuong === undefined || data.chatLuong === null) {
    return jsonOut({ ok: false, msg: 'Thiếu trường chatLuong' });
  }
  const chatLuong = String(data.chatLuong).trim().toLowerCase();
  if (chatLuong !== '' && chatLuong !== 'tinh' && chatLuong !== 'tho') {
    return jsonOut({ ok: false, msg: 'Chất lượng không hợp lệ (chỉ chấp nhận rỗng, tinh, tho)' });
  }

  const rawIds = Array.isArray(data.ids) ? data.ids : [];
  const uniqueIds = Array.from(new Set(rawIds.map(x => String(x).trim()).filter(Boolean)));
  if (!uniqueIds.length) {
    return jsonOut({ ok: false, msg: 'Thiếu danh sách ids hợp lệ' });
  }
  if (uniqueIds.length > 500) {
    return jsonOut({ ok: false, msg: 'Số lượng câu cập nhật vượt quá giới hạn (tối đa 500 câu/lần)' });
  }

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0] ? rows[0].map(String) : [];
  let clCol = headers.indexOf('chatLuong');
  if (clCol === -1) {
    clCol = headers.length;
    sheet.getRange(1, clCol + 1).setValue('chatLuong');
  }

  const existingIdMap = new Map();
  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0]).trim();
    if (rId) existingIdMap.set(rId, i + 1); // sheet rowIndex (1-based)
  }

  const updatedIds = [];
  const failedItems = [];

  uniqueIds.forEach(id => {
    const rowIdx = existingIdMap.get(id);
    if (rowIdx) {
      sheet.getRange(rowIdx, clCol + 1).setValue(chatLuong);
      updatedIds.push(id);
    } else {
      failedItems.push({ id: id, reason: 'ID không tồn tại trong ngân hàng' });
    }
  });

  if (updatedIds.length === 0) {
    return jsonOut({
      ok: false,
      requested: uniqueIds.length,
      updated: 0,
      failed: failedItems.length,
      updatedIds: [],
      failedItems: failedItems,
      chatLuong: chatLuong,
      msg: 'Không có câu hỏi nào được cập nhật'
    });
  }

  return jsonOut({
    ok: true,
    requested: uniqueIds.length,
    updated: updatedIds.length,
    failed: failedItems.length,
    updatedIds: updatedIds,
    failedItems: failedItems,
    chatLuong: chatLuong
  });
}

// ── POST: Nhập gói câu hỏi Tinh vào ngân hàng (hỗ trợ dryRun, fail-closed và auto-rollback) ────
function importNganHang(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const batchId = String(data.batchId || 'BATCH_IMPORT').trim();
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  if (!rawQuestions.length) {
    return jsonOut({ ok: false, msg: 'Danh sách questions rỗng' });
  }
  if (rawQuestions.length > 200) {
    return jsonOut({ ok: false, msg: 'Số lượng câu vượt quá giới hạn tối đa (200 câu/lần)' });
  }

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();

  // Lấy tập ID đã tồn tại trong Sheet và đếm số câu thực tế
  const existingIdSet = new Set();
  let countBefore = 0;
  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0] || '').trim();
    if (rId) {
      existingIdSet.add(rId);
      countBefore++;
    }
  }

  const seenPayloadIds = new Set();
  const duplicates = [];
  const invalidItems = [];
  const normalizedRows = [];
  const normalizedPreview = [];
  const nowIso = new Date().toISOString();

  for (let idx = 0; idx < rawQuestions.length; idx++) {
    const q = rawQuestions[idx] || {};
    const id = String(q.id || '').trim();
    const itemErrors = [];

    if (!id) {
      itemErrors.push('Thiếu id');
    } else if (seenPayloadIds.has(id)) {
      itemErrors.push('ID bị trùng lặp trong payload');
    } else if (existingIdSet.has(id)) {
      duplicates.push(id);
      itemErrors.push('ID đã tồn tại trong ngân hàng production');
    }
    if (id) seenPayloadIds.add(id);

    const loai = String(q.loai || 'TN').trim().toUpperCase();
    if (!['TN', 'DS', 'TLN'].includes(loai)) {
      itemErrors.push('loai không hợp lệ (chỉ nhận TN, DS, TLN)');
    }

    const questionText = String(q.question || '').trim();
    if (!questionText) {
      itemErrors.push('Nội dung question không được để trống');
    }

    const correct = String(q.correct || '').trim().toUpperCase();
    if (loai === 'TN') {
      if (!['A', 'B', 'C', 'D'].includes(correct)) {
        itemErrors.push('Đáp án đúng correct cho TN phải là A, B, C hoặc D');
      }
      if (!String(q.optA || '').trim() || !String(q.optB || '').trim() || 
          !String(q.optC || '').trim() || !String(q.optD || '').trim()) {
        itemErrors.push('Câu TN phải có đầy đủ 4 phương án optA, optB, optC, optD');
      }
    } else if (loai === 'DS') {
      const corrClean = correct.replace(/[^ĐSds]/g, '').toUpperCase();
      if (corrClean.length !== 4) {
        itemErrors.push('Đáp án đúng correct cho DS phải chứa đúng 4 ký tự Đ/S (ví dụ: ĐĐSĐ)');
      }
      if (!String(q.optA || '').trim() || !String(q.optB || '').trim() || 
          !String(q.optC || '').trim() || !String(q.optD || '').trim()) {
        itemErrors.push('Câu DS phải có đầy đủ 4 mệnh đề optA, optB, optC, optD');
      }
    }

    const mucDo = String(q.mucDo || '').trim().toUpperCase();
    if (!['NB', 'TH', 'VD', 'VDC'].includes(mucDo)) {
      itemErrors.push('Mức độ mucDo phải là NB, TH, VD hoặc VDC');
    }

    const chatLuong = String(q.chatLuong || '').trim().toLowerCase();
    if (chatLuong !== 'tinh') {
      itemErrors.push('chatLuong phải là "tinh" đối với gói câu duyệt');
    }

    let mon = String(q.mon || 'Vật lý').trim();
    if (mon === 'Vật Lý 12' || mon === 'Vật lí 12') mon = 'Vật lý';

    let chuong = String(q.chuong || '').trim();
    if (/chương 1|vật l[yí] nhiệt/i.test(chuong)) chuong = 'Vật lí nhiệt';
    if (!chuong) itemErrors.push('Chương không được để trống');

    let baiHoc = String(q.baiHoc || '').trim();
    if (/b3|thang nhiệt độ|nhiệt kế/i.test(baiHoc)) baiHoc = 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế';
    else if (/b5|định luật i|nội năng/i.test(baiHoc)) baiHoc = 'Bài 5. Định luật I của nhiệt động lực học';
    if (!baiHoc) itemErrors.push('Bài học không được để trống');

    const optA = String(q.optA || '').trim();
    const optB = String(q.optB || '').trim();
    const optC = String(q.optC || '').trim();
    const optD = String(q.optD || '').trim();
    const giaiThich = String(q.giaiThich || q.explanation || '').trim();
    const hinhAnh = String(q.hinhAnh || '').trim();
    const nhomId = String(q.nhomId || '').trim();
    const deBaiChung = String(q.deBaiChung || '').trim();

    if (itemErrors.length > 0) {
      invalidItems.push({ index: idx, id: id || `(index ${idx})`, errors: itemErrors });
    } else {
      const headers = rows[0] ? rows[0].map(h => String(h || '').trim().toLowerCase()) : NH_HEADERS.map(h => h.toLowerCase());
      const numCols = Math.max(headers.length, NH_HEADERS.length);
      const rowArr = new Array(numCols).fill('');
      
      headers.forEach((normH, colIdx) => {
        if (normH === 'id' || normH === 'ma') rowArr[colIdx] = id;
        else if (normH === 'mon') rowArr[colIdx] = mon;
        else if (normH === 'chuong') rowArr[colIdx] = chuong;
        else if (normH === 'mucdo' || normH === 'muc_do') rowArr[colIdx] = mucDo;
        else if (normH === 'loai') rowArr[colIdx] = loai;
        else if (normH === 'nhomid' || normH === 'nhom_id') rowArr[colIdx] = nhomId;
        else if (normH === 'debaichung' || normH === 'de_bai_chung') rowArr[colIdx] = deBaiChung;
        else if (normH === 'question' || normH === 'cauhoi' || normH === 'cau_hoi' || normH === 'debai' || normH === 'de_bai') rowArr[colIdx] = questionText;
        else if (normH === 'opta' || normH === 'a') rowArr[colIdx] = optA;
        else if (normH === 'optb' || normH === 'b') rowArr[colIdx] = optB;
        else if (normH === 'optc' || normH === 'c') rowArr[colIdx] = optC;
        else if (normH === 'optd' || normH === 'd') rowArr[colIdx] = optD;
        else if (normH === 'correct' || normH === 'dapan' || normH === 'dap_an') rowArr[colIdx] = correct;
        else if (normH === 'hinhanh' || normH === 'hinh_anh') rowArr[colIdx] = hinhAnh;
        else if (normH === 'giaithich' || normH === 'giai_thich' || normH === 'explanation') rowArr[colIdx] = giaiThich;
        else if (normH === 'ngaythem' || normH === 'ngay_them') rowArr[colIdx] = nowIso;
        else if (normH === 'baihoc' || normH === 'bai_hoc' || normH === 'tenbai' || normH === 'ten_bai') rowArr[colIdx] = baiHoc;
        else if (normH === 'chatluong' || normH === 'chat_luong') rowArr[colIdx] = chatLuong;
      });

      // Fallback positional
      if (!rowArr[0]) rowArr[0] = id;
      if (!rowArr[1]) rowArr[1] = mon;
      if (!rowArr[2]) rowArr[2] = chuong;
      if (!rowArr[3]) rowArr[3] = mucDo;
      if (!rowArr[4]) rowArr[4] = loai;
      if (!rowArr[7]) rowArr[7] = questionText;
      if (!rowArr[8]) rowArr[8] = optA;
      if (!rowArr[9]) rowArr[9] = optB;
      if (!rowArr[10]) rowArr[10] = optC;
      if (!rowArr[11]) rowArr[11] = optD;
      if (!rowArr[12]) rowArr[12] = correct;
      if (!rowArr[14]) rowArr[14] = giaiThich;
      if (!rowArr[15]) rowArr[15] = nowIso;

      const baiCol = headers.findIndex(h => h === 'baihoc' || h === 'tenbai');
      if (baiCol !== -1) rowArr[baiCol] = baiHoc;
      const clCol = headers.findIndex(h => h === 'chatluong');
      if (clCol !== -1) rowArr[clCol] = chatLuong;

      normalizedRows.push(rowArr);
      normalizedPreview.push({
        id, mon, chuong, baiHoc, mucDo, loai,
        question: questionText.slice(0, 120) + (questionText.length > 120 ? '...' : ''),
        optA, optB, optC, optD, correct, chatLuong
      });
    }
  }

  const requested = rawQuestions.length;
  const insertable = normalizedRows.length;

  if (invalidItems.length > 0) {
    return jsonOut({
      ok: false,
      dryRun: dryRun,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      insertable: 0,
      duplicates: duplicates,
      invalidItems: invalidItems,
      expectedCountAfter: countBefore,
      msg: 'Có ' + invalidItems.length + ' câu không hợp lệ hoặc trùng ID. Toàn bộ batch bị từ chối (Fail-Closed).'
    });
  }

  if (dryRun) {
    return jsonOut({
      ok: true,
      dryRun: true,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      insertable: insertable,
      duplicates: [],
      invalidItems: [],
      normalizedPreview: normalizedPreview,
      expectedCountAfter: countBefore + insertable,
      msg: 'Dry-run thành công: Toàn bộ ' + insertable + ' câu hợp lệ và sẵn sàng nạp.'
    });
  }

  // Ghi thật
  const startRow = lastRealRow + 1;
  const numRows = normalizedRows.length;
  const numCols = normalizedRows[0] ? normalizedRows[0].length : NH_HEADERS.length;

  try {
    sheet.getRange(startRow, 1, numRows, numCols).setValues(normalizedRows);

    const verifyRows = sheet.getRange(startRow, 1, numRows, 1).getValues();
    const insertedIds = normalizedRows.map(r => r[0]);
    let verifyOk = true;
    for (let i = 0; i < numRows; i++) {
      if (String(verifyRows[i][0]).trim() !== insertedIds[i]) {
        verifyOk = false;
        break;
      }
    }

    if (!verifyOk) {
      sheet.deleteRows(startRow, numRows);
      return jsonOut({
        ok: false,
        dryRun: false,
        batchId: batchId,
        rollbackApplied: true,
        countBefore: countBefore,
        requested: requested,
        inserted: 0,
        msg: 'Kiểm tra sau ghi thất bại. Đã tự động rollback toàn bộ ' + numRows + ' dòng.'
      });
    }

    return jsonOut({
      ok: true,
      dryRun: false,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      inserted: insertable,
      insertedIds: insertedIds,
      expectedCountAfter: countBefore + insertable,
      msg: 'Đã nạp thành công ' + insertable + ' câu Tinh vào ngân hàng.'
    });
  } catch (err) {
    try {
      const currentRows = sheet.getLastRow();
      if (currentRows >= startRow) {
        sheet.deleteRows(startRow, currentRows - startRow + 1);
      }
    } catch (eRollback) {}
    return jsonOut({
      ok: false,
      dryRun: false,
      batchId: batchId,
      rollbackApplied: true,
      error: err.message,
      msg: 'Lỗi ghi Sheet: ' + err.message
    });
  }
}

// ── GET: Lấy link video từ Sheet nguồn (khoá luyện đề 2k8) ──

function getSourceVideoLinks() {
  try {
    const src   = SpreadsheetApp.openById('1D1nNyP8UAllr2SYoHDF9bBWz2dQx12h_8qsF-2jZwGg');
    const sheet = src.getSheets()[0];
    const range = sheet.getDataRange();
    const values    = range.getValues();
    const richTexts = range.getRichTextValues();

    const result = [];
    for (let i = 1; i < values.length; i++) {
      const tenBai = String(values[i][4] || '').trim();
      const chuong = String(values[i][3] || '').trim();
      if (!tenBai) continue;

      const urls = [];
      const rt = richTexts[i][7];
      if (rt) {
        const mainUrl = rt.getLinkUrl ? rt.getLinkUrl() : '';
        if (mainUrl) urls.push(mainUrl);
        if (rt.getRuns) {
          rt.getRuns().forEach(run => {
            const u = run.getLinkUrl ? run.getLinkUrl() : '';
            if (u && !urls.includes(u)) urls.push(u);
          });
        }
      }
      if (!urls.length) {
        const txt = String(values[i][7] || '').trim();
        if (txt.startsWith('http')) urls.push(txt);
      }

      result.push({
        stt:       values[i][0],
        chuong,
        tenBai,
        videoUrl:  urls[0] || '',
        videoUrl2: urls[1] || '',
        allUrls:   urls
      });
    }
    return jsonOut({ ok: true, data: result });
  } catch(err) {
    return jsonOut({ ok: false, error: err.message });
  }
}

// ── POST: Cập nhật link video hàng loạt ───────────────────────

function updateBaiHocVideo(data) {
  const sheet = getOrCreate('BaiHoc', ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap']);
  const rows  = sheet.getDataRange().getValues();
  let updated = 0;

  (data.links || []).forEach(link => {
    const name = String(link.tenBai || '').trim();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][2]).trim() === name) {
        sheet.getRange(i + 1, 4).setValue(link.videoUrl  || '');
        sheet.getRange(i + 1, 5).setValue(link.videoUrl2 || '');
        updated++;
        break;
      }
    }
  });
  return jsonOut({ ok: true, updated });
}


// ── GET: Cấu hình khóa học (free/vip/premium) ────────────────
function getKhoaConfig() {
  // Schema: khoaHoc(0) | loaiTK(1) | hienThi(2) | thuTu(3) | daKhaiGiang(4)
  const sheet = getOrCreate('KhoaConfig', ['khoaHoc','loaiTK','hienThi','thuTu','daKhaiGiang']);
  const rows  = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    result.push({
      khoaHoc:      String(rows[i][0]).replace(/[\x00-\x1F\x7F]/g,'').trim(),
      loaiTK:       rows[i][1] || 'free,vip,premium',
      hienThi:      rows[i][2] === false || String(rows[i][2]).toLowerCase() === 'false' ? 'false' : 'true',
      thuTu:        rows[i][3] !== '' && rows[i][3] !== undefined ? Number(rows[i][3]) : 999,
      daKhaiGiang:  rows[i][4] === true  || String(rows[i][4]).toLowerCase() === 'true'
    });
  }
  return jsonOut(result);
}

// ── POST admin: Lưu cấu hình khoá học (hienThi, thuTu, daKhaiGiang) ──────────
function saveKhoaConfig(data) {
  // { action:'savekhoaconfig', adminKey:..., khoaHoc:'...', field:'hienThi'|'thuTu'|'daKhaiGiang', value:... }
  const sheet = getOrCreate('KhoaConfig', ['khoaHoc','loaiTK','hienThi','thuTu','daKhaiGiang']);
  const rows  = sheet.getDataRange().getValues();
  const target = String(data.khoaHoc || '').trim();
  if (!target) return jsonOut({ ok: false, msg: 'Thiếu khoaHoc' });
  const FIELD_COL = { hienthi: 3, thutu: 4, dakhaigiang: 5, loaitk: 2 };
  const fieldKey = String(data.field || '').toLowerCase().replace(/\s/g,'').replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a').replace(/[èéẹẻẽêềếệểễ]/g,'e').replace(/[ìíịỉĩ]/g,'i').replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o').replace(/[ùúụủũưừứựửữ]/g,'u').replace(/[ỳýỵỷỹ]/g,'y').replace(/đ/g,'d');
  const col = FIELD_COL[fieldKey];
  if (!col) return jsonOut({ ok: false, msg: 'Field không hợp lệ: ' + data.field });
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).replace(/[\x00-\x1F\x7F]/g,'').trim() === target) {
      sheet.getRange(i + 1, col).setValue(data.value);
      return jsonOut({ ok: true, msg: 'Đã lưu ' + data.field + ' cho ' + target });
    }
  }
  const newRow = [target, data.loaiTK || 'free,vip,premium', 'true', 999, false];
  const colIdx = col - 1;
  newRow[colIdx] = data.value;
  sheet.appendRow(newRow);
  return jsonOut({ ok: true, msg: 'Đã tạo cấu hình mới cho ' + target });
}

// ── POST Admin: Ping kiểm tra kết nối, CORS và quyền Admin (không đụng Sheets) ──
function pingAdmin(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  return jsonOut({ ok: true, ping: 'pong', ts: Date.now() });
}

// ── POST admin: Đặt VIP cho học sinh ─────────────────────────
function setVipStatus(data) {
  // Dùng qua admin: { action:'setvipstatus', adminKey:..., sdt:..., loaiTK:'vip'|'free'|'premium', days:30 }
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  const target = String(data.sdt || '').trim();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], target)) {
      const loaiTK = ['free','vip','premium'].indexOf(String(data.loaiTK || '').toLowerCase()) !== -1
        ? String(data.loaiTK).toLowerCase() : 'vip';
      let days = 0;
      let expiry = 0;
      if (loaiTK === 'vip') {
        days = Number(data.days);
        if (!Number.isFinite(days) || days <= 0 || days > 3650) {
          return jsonOut({ ok: false, msg: 'Số ngày VIP không hợp lệ (phải từ 1 đến 3650).' });
        }
        expiry = Date.now() + days * 24 * 60 * 60 * 1000;
      }
      sheet.getRange(i + 1, 8).setValue(loaiTK);
      sheet.getRange(i + 1, 9).setValue(expiry);
      const han = loaiTK === 'premium' ? 'vĩnh viễn' : (loaiTK === 'free' ? 'miễn phí' : days + ' ngày');
      return jsonOut({ ok: true, msg: 'Đã cập nhật ' + target + ' → ' + loaiTK + ' (' + han + ')' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}

// ── GET Admin: Danh sách tài khoản học sinh ──────────────────
function getDanhSachTaiKhoan(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });

  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    result.push({
      sdt:          rows[i][0],
      hoten:        rows[i][1],
      lop:          rows[i][2],
      ngayDK:       rows[i][4],
      lpTotal:      rows[i][5] || 0,
      loaiTK:       rows[i][7] || 'vip',
      trialExpiry:  rows[i][8] || 0,
      mienVideo:    !!(rows[i][9]),
      tracNghiemVideo: (rows[i][10] === false ? false : true),
      mienLuyenTap: !!(rows[i][11]),
    });
  }
  return jsonOut({ ok: true, data: result });
}

// ── GET Admin: Danh sách thiết bị đã dùng học thử ────────────
function dispSdt(s) {
  s = String(s || '');
  if (/^\d+$/.test(s)) { return (s.length === 9) ? ('0' + s) : s; }
  return s; // không phải số thuần (vd email Google) → giữ nguyên
}

function getDanhSachThietBi(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });
  const sheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
  const rows = sheet.getDataRange().getValues();
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    result.push({
      deviceId:    rows[i][0],
      sdt:         dispSdt(rows[i][1]),
      hoten:       rows[i][2],
      trialStart:  rows[i][3],
      trialExpiry: rows[i][4],
      soLanChan:   rows[i][5] || 0
    });
  }
  return jsonOut({ ok: true, data: result });
}

// ── POST Admin: Mở khoá thiết bị (cho học thử lại) ───────────
function resetDevice(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const deviceId = String(data.deviceId || '').trim();
  if (!deviceId) return jsonOut({ ok: false, msg: 'Thiếu deviceId' });
  const sheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === deviceId) {
      sheet.deleteRow(i + 1);
      return jsonOut({ ok: true, msg: 'Đã mở khoá thiết bị — học sinh có thể đăng ký học thử lại.' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy thiết bị.' });
}

// ── POST: Xóa tài khoản học sinh ─────────────────────────────
function deleteAccount(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sdt = String(data.sdt || '').trim();
  if (!sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], sdt)) {
      ['TienDo','BangVang','NhiemVu','HoatDong'].forEach(function(name){
        const related = ss.getSheetByName(name);
        if (!related || related.getLastRow() < 2) return;
        const values = related.getRange(2, 1, related.getLastRow() - 1, related.getLastColumn()).getValues();
        for (let row = values.length - 1; row >= 0; row--) {
          const accountCol = name === 'BangVang' ? 2 : 0;
          if (sameTaiKhoan(values[row][accountCol], sdt)) related.deleteRow(row + 2);
        }
      });
      sheet.deleteRow(i + 1);
      return jsonOut({ ok: true, msg: 'Đã xóa tài khoản và dữ liệu liên quan: ' + sdt });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}

// ══════════════════════════════════════════════════════════════
// NHIỆM VỤ HỌC MỖI NGÀY + ĐUA TOP  (v21)
// ══════════════════════════════════════════════════════════════

// ── GET: Lấy cấu hình nhiệm vụ của học sinh ─────────────────
function getNhiemVu(sdt) {
  if (!sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const sheet = getOrCreate('NhiemVu', ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop']);
  const rows = sheetToJson(sheet);
  for (const r of rows) {
    if (normSdt(r.sdt) === normSdt(sdt)) {
      return jsonOut({ ok: true, data: {
        nhipHoc:         Number(r.nhipHoc) || 0,
        conTro:          Number(r.conTro)  || 0,
        lastMissionDate: r.lastMissionDate || '',
        startDate:       r.startDate      || '',
        chuoiDung:       Number(r.chuoiDung) || 0,
        tongDiemDuaTop:  Number(r.tongDiemDuaTop) || 0
      }});
    }
  }
  return jsonOut({ ok: true, data: null });
}

// ── POST: Lưu / cập nhật nhiệm vụ ───────────────────────────
function saveNhiemVu(data) {
  if (!data.sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const COLS = ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop'];
  const sheet = getOrCreate('NhiemVu', COLS);
  const rows  = sheetToJson(sheet);
  for (const r of rows) {
    if (normSdt(r.sdt) === normSdt(data.sdt)) {
      const updated = {
        sdt:             r.sdt,
        nhipHoc:         data.nhipHoc        !== undefined ? Number(data.nhipHoc)  : (Number(r.nhipHoc)||0),
        conTro:          data.conTro         !== undefined ? Number(data.conTro)   : (Number(r.conTro)||0),
        lastMissionDate: data.lastMissionDate !== undefined ? data.lastMissionDate : (r.lastMissionDate||''),
        startDate:       data.startDate      || r.startDate || new Date().toISOString().slice(0,10),
        chuoiDung:       data.chuoiDung      !== undefined ? Number(data.chuoiDung): (Number(r.chuoiDung)||0),
        tongDiemDuaTop:  Number(r.tongDiemDuaTop) || 0
      };
      writeRowNamed(sheet, r._rowIndex, updated);
      return jsonOut({ ok: true });
    }
  }
  appendRowNamed(sheet, {
    sdt:             data.sdt,
    nhipHoc:         Number(data.nhipHoc) || 0,
    conTro:          Number(data.conTro)  || 0,
    lastMissionDate: data.lastMissionDate || '',
    startDate:       data.startDate || new Date().toISOString().slice(0,10),
    chuoiDung:       0,
    tongDiemDuaTop:  0
  });
  return jsonOut({ ok: true });
}

// ── POST: Lưu điểm Đua Top → cộng LP vào TaiKhoan ──────────
// data: { sdt, diemCong, chuoiDung }
function saveDuaTop(data) {
  if (!data.sdt || !data.diemCong) return jsonOut({ ok: false, msg: 'Thiếu dữ liệu' });
  const diem = Number(data.diemCong) || 0;

  const RANK_MINS = [0, 50, 150, 300, 600, 1000]; // phai khop VLXT_RANKS phia frontend (xephang-fx.js)
  function rankIdx(lp) { let idx = 0; for (let i = 0; i < RANK_MINS.length; i++) { if (lp >= RANK_MINS[i]) idx = i; } return idx; }
  let lpTotal = 0, rankUp = false;

  const acc     = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const accRows = sheetToJson(acc);
  for (const r of accRows) {
    if (normSdt(r.sdt) === normSdt(data.sdt)) {
      const oldLp = Number(r.lpTotal) || 0;
      const newLp = oldLp + diem;
      writeRowNamed(acc, r._rowIndex, Object.assign({}, r, { lpTotal: newLp }));
      lpTotal = newLp;
      rankUp = rankIdx(newLp) > rankIdx(oldLp);
      break;
    }
  }

  const nv     = getOrCreate('NhiemVu', ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop']);
  const nvRows = sheetToJson(nv);
  for (const r of nvRows) {
    if (normSdt(r.sdt) === normSdt(data.sdt)) {
      writeRowNamed(nv, r._rowIndex, Object.assign({}, r, {
        chuoiDung:      Number(data.chuoiDung) || 0,
        tongDiemDuaTop: (Number(r.tongDiemDuaTop)||0) + diem
      }));
      break;
    }
  }

  return jsonOut({ ok: true, lpCong: diem, lpTotal: lpTotal, rankUp: rankUp });
}

// 6/8 dem: Solo Vat Ly - dau 1-1 (hoac voi bot) theo hang, chi cong LP xep hang,
// KHONG dung toi NhiemVu/tongDiemDuaTop (de khong lan voi thong ke Dua Top).
function saveSoloResult(data) {
  if (!data.sdt) return jsonOut({ ok: false, msg: 'Thieu du lieu' });
  const diem = Number(data.diemCong) || 0;
  const RANK_MINS = [0, 50, 150, 300, 600, 1000];
  function rankIdx(lp) { let idx = 0; for (let i = 0; i < RANK_MINS.length; i++) { if (lp >= RANK_MINS[i]) idx = i; } return idx; }
  let lpTotal = 0, rankUp = false;
  let found = false;
  const acc = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const accRows = sheetToJson(acc);
  for (const r of accRows) {
    if (normSdt(r.sdt) === normSdt(data.sdt)) {
      found = true;
      const oldLp = Number(r.lpTotal) || 0;
      const newLp = oldLp + diem;
      writeRowNamed(acc, r._rowIndex, Object.assign({}, r, { lpTotal: newLp }));
      lpTotal = newLp;
      rankUp = rankIdx(newLp) > rankIdx(oldLp);
      break;
    }
  }
  if (!found) {
    lpTotal = diem;
    rankUp = rankIdx(lpTotal) > rankIdx(0);
    appendRowNamed(acc, { sdt: data.sdt, hoten: data.hoten || '', lop: data.lop || '', lpTotal: lpTotal });
  }
  return jsonOut({ ok: true, lpCong: diem, lpTotal: lpTotal, rankUp: rankUp, ketQua: data.ketQua || '' });
}


// ── GET: Đọc Settings toàn trang ─────────────────────────────
// Trả về { ok:true, data: { key: value, ... } }
function getSettings() {
  const sheet = getOrCreate('Settings', ['key', 'value']);
  const rows  = sheetToJson(sheet);
  const result = {};
  rows.forEach(r => { if (r.key) result[String(r.key)] = r.value !== undefined ? r.value : ''; });
  return jsonOut({ ok: true, data: result });
}

// ── POST: Lưu 1 Setting ───────────────────────────────────────
// data: { adminKey, key, value }
function saveSetting(data) {
  // Không cần check adminKey vì action này chỉ gọi từ admin panel
  if (!data.key) return jsonOut({ ok: false, msg: 'Thiếu key' });

  const sheet = getOrCreate('Settings', ['key', 'value']);
  const rows  = sheetToJson(sheet);
  const existing = rows.find(r => String(r.key) === String(data.key));
  if (existing) {
    sheet.getRange(existing._rowIndex, 1, 1, 2).setValues([[data.key, data.value !== undefined ? data.value : '']]);
  } else {
    sheet.appendRow([data.key, data.value !== undefined ? data.value : '']);
  }
  return jsonOut({ ok: true });
}


// ═══════════ CÂU HỎI TRONG VIDEO (video quiz checkpoint) ═══════════

// GET ?type=videocauhoi&bai=<baiKey>
function getVideoCauHoi(bai) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('VideoCauHoi');
  if (!sheet) return jsonOut({ data: [] });
  let rows = sheetToJson(sheet);
  if (bai) rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  function _sortKeyTG(t){ return (t===null||t===undefined||t==='') ? Infinity : (Number(t)||0); }
  rows.sort(function(a,b){ return _sortKeyTG(a.thoiGian)-_sortKeyTG(b.thoiGian); });
  return jsonOut({ data: rows });
}

// GET ?type=transcript&v=<youtubeVideoId>&lang=<vi|en|...>
// Lay phu de (transcript) video YouTube de admin panel tu do moc cau hoi
// theo noi dung (khop chu, khong can thay tu canh gio). Ky thuat: tai trang
// xem video (can User-Agent trinh duyet that, YouTube chan UA mac dinh cua
// UrlFetchApp) roi trich mang captionTracks nhung trong player response.
// Neu video khong co phu de thi tra ok:false, phia admin bao thay tu nhap tay.
function getVideoTranscript(videoId, preferLang) {
  try {
    if (!videoId) return jsonOut({ ok: false, error: 'missing_video_id' });
    var watchUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(videoId);
    var resp = UrlFetchApp.fetch(watchUrl, {
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    var html = resp.getContentText();
    var idx = html.indexOf('captionTracks');
    if (idx < 0) return jsonOut({ ok: false, error: 'no_captions', videoId: videoId });
    var arrStart = html.indexOf('[', idx);
    var depth = 0, i = arrStart, arrEnd = -1;
    for (; i < html.length; i++) {
      if (html[i] === '[') depth++;
      else if (html[i] === ']') { depth--; if (depth === 0) { arrEnd = i; break; } }
    }
    if (arrEnd < 0) return jsonOut({ ok: false, error: 'parse_failed', videoId: videoId });
    var tracks;
    try { tracks = JSON.parse(html.slice(arrStart, arrEnd + 1)); }
    catch (e) { return jsonOut({ ok: false, error: 'json_parse_failed', videoId: videoId }); }
    if (!tracks || !tracks.length) return jsonOut({ ok: false, error: 'no_captions', videoId: videoId });
    var norm = function (t) { return (t.languageCode || '').toLowerCase(); };
    var want = (preferLang || 'vi').toLowerCase();
    var chosen = tracks.filter(function (t) { return norm(t) === want; })[0];
    if (!chosen) chosen = tracks.filter(function (t) { return norm(t) === 'vi'; })[0];
    if (!chosen) chosen = tracks[0];
    var baseUrl = chosen.baseUrl || '';
    if (baseUrl.indexOf('http') !== 0) baseUrl = 'https://www.youtube.com' + baseUrl;
    var capResp = UrlFetchApp.fetch(baseUrl, { muteHttpExceptions: true, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' } });
    var capXml = capResp.getContentText();
    var segRe = /<text start="([\d.]+)"(?:\s+dur="([\d.]+)")?[^>]*>([\s\S]*?)<\/text>/g;
    var segs = [];
    var sm;
    while ((sm = segRe.exec(capXml))) {
      var txt = sm[3]
        .replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/<[^>]+>/g, '');
      segs.push({ start: parseFloat(sm[1]), dur: parseFloat(sm[2] || '0'), text: txt.trim() });
    }
    if (!segs.length) return jsonOut({ ok: false, error: 'empty_captions', videoId: videoId });
    return jsonOut({ ok: true, videoId: videoId, lang: norm(chosen), segments: segs });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}


// POST {action:'savevideocauhoi', baiKey, originalKey, items:[{t,nhId,q,A,B,C,D,ans}]}
// Ghi đè toàn bộ mốc câu hỏi của 1 bài (xoá cũ, ghi mới)
function saveVideoCauHoi(data) {
  const COLS = ['baiKey','thuTu','thoiGian','nhId','type','question','optA','optB','optC','optD','correct'];
  const sheet = getOrCreate('VideoCauHoi', COLS);
  const keys = [String(data.baiKey || '')];
  if (data.originalKey && String(data.originalKey) !== String(data.baiKey)) keys.push(String(data.originalKey));
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const kCol = headers.indexOf('baiKey');
  if (kCol >= 0 && sheet.getLastRow() > 1) {
    const vals = sheet.getRange(2, kCol + 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      if (keys.indexOf(String(vals[i][0])) >= 0) sheet.deleteRow(i + 2);
    }
  }
  // Ep kieu chuoi cho cac truong co the bi Google Sheets tu dong doi thanh
  // Ngay thang/So (vd dap so '4,6' -> 4.6, '700' -> 700) - cung bug da gap
  // o BaiTapTracNghiem/NganHang, xem memory project_nganhang-2k9-campaign.
  function asText(v) { const s = String(v == null ? '' : v); return s === '' ? '' : ("'" + s); }
    function _sortKeyT(t){ return (t===null||t===undefined||t==='') ? Infinity : (Number(t)||0); }
    const items = (data.items || []).slice().sort(function(a,b){ return _sortKeyT(a.t)-_sortKeyT(b.t); });
  items.forEach(function(it, ix) {
    appendRowNamed(sheet, {
      baiKey:   asText(data.baiKey || ''),
      thuTu:    ix + 1,
      thoiGian: (it.t===null||it.t===undefined||it.t==='') ? '' : (Number(it.t)||0),
      nhId:     it.nhId || '',
      type:     (it.type === 'tf' || it.type === 'short') ? it.type : 'mc',
      question: asText(it.q || ''),
      optA:     asText(it.A || ''),
      optB:     asText(it.B || ''),
      optC:     asText(it.C || ''),
      optD:     asText(it.D || ''),
      correct:  asText(String((it.correct !== undefined && it.correct !== null && it.correct !== '') ? it.correct : (it.ans || '')).toUpperCase().trim())
    });
  });
  if (typeof clearReadCache === 'function') { try { clearReadCache(); } catch(e) {} }
  return jsonOut({ ok: true, count: items.length });
}

// GET ?type=baitaptracnghiem&bai=<baiKey>
function getBaiTapTracNghiem(bai) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('BaiTapTracNghiem');
  if (!sheet) return jsonOut({ data: [] });
  let rows = sheetToJson(sheet);
  if (bai) rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  rows.sort(function(a,b){ return (Number(a.thuTu)||0) - (Number(b.thuTu)||0); });
  return jsonOut({ data: rows });
}

// POST {action:'savebaitaptracnghiem', baiKey, originalKey, items:[{type,q,A,B,C,D,correct}]}
// Ghi de toan bo cau hoi Luyen tap trac nghiem cua 1 bai (xoa cu, ghi moi) - tach sheet rieng
// de khong bi gioi han 50.000 ky tu/o cua Google Sheets khi 1 bai co hang tram cau.
function saveBaiTapTracNghiem(data) {
  const COLS = ['baiKey','thuTu','type','question','optA','optB','optC','optD','correct'];
  const sheet = getOrCreate('BaiTapTracNghiem', COLS);
  const keys = [String(data.baiKey || '')];
  if (data.originalKey && String(data.originalKey) !== String(data.baiKey)) keys.push(String(data.originalKey));
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
  const kCol = headers.indexOf('baiKey');
  if (kCol >= 0 && sheet.getLastRow() > 1) {
    const vals = sheet.getRange(2, kCol + 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = vals.length - 1; i >= 0; i--) {
      if (keys.indexOf(String(vals[i][0])) >= 0) sheet.deleteRow(i + 2);
    }
  }
  // Ep kieu chuoi (khong de Google Sheets tu dong doi thanh Ngay thang/So, vd
  // dap so "2.5" hoac dap an co dang "1/2" bi hieu nham thanh ngay - da tung
  // gap bug nay o nhieu sheet khac, xem memory project_nganhang-2k9-campaign).
  function asText(v) { const s = String(v == null ? '' : v); return s === '' ? '' : ("'" + s); }
  const items = (data.items || []).slice();
  items.forEach(function(it, ix) {
    appendRowNamed(sheet, {
      baiKey:   asText(data.baiKey || ''),
      thuTu:    ix + 1,
      type:     (it.type === 'tf' || it.type === 'short') ? it.type : 'mc',
      question: asText(it.q || it.question || ''),
      optA:     asText(it.A || it.optA || ''),
      optB:     asText(it.B || it.optB || ''),
      optC:     asText(it.C || it.optC || ''),
      optD:     asText(it.D || it.optD || ''),
      correct:  asText(String(it.correct != null ? it.correct : (it.ans || '')).trim())
    });
  });
  if (typeof clearReadCache === 'function') { try { clearReadCache(); } catch(e) {} }
  return jsonOut({ ok: true, count: items.length });
}

// POST {action:'logvideoquiz', sdt, ten, lop, baiKey, thuTu, nhId, soLanSai}
// Học sinh trả lời ĐÚNG 1 câu trong video → ghi 1 dòng log
function logVideoQuiz(data) {
  const sheet = getOrCreate('VideoQuizLog', ['ngay','sdt','ten','lop','baiKey','thuTu','nhId','soLanSai']);
  appendRowNamed(sheet, {
    ngay:     new Date(),
    sdt:      "'" + String(data.sdt || ''),
    ten:      data.ten || '',
    lop:      data.lop || '',
    baiKey:   String(data.baiKey || ''),
    thuTu:    Number(data.thuTu) || 0,
    nhId:     data.nhId || '',
    soLanSai: Number(data.soLanSai) || 0
  });
  return jsonOut({ ok: true });
}

// ══════════ v50: LỊCH SỬ HOẠT ĐỘNG + SỬA THÔNG TIN TÀI KHOẢN ══════════

// So khớp tài khoản an toàn: email so email, SĐT so SĐT
function sameTaiKhoan(a, b) {
  a = String(a || '').trim().toLowerCase();
  b = String(b || '').trim().toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;
  const da = a.replace(/\D/g,'').replace(/^0+/,'');
  const db = b.replace(/\D/g,'').replace(/^0+/,'');
  return da !== '' && da === db;
}

// ── POST (web học sinh tự gọi): ghi 1 dòng hoạt động ──
function logHoatDong(data) {
  const sdt = String(data.sdt || '').trim();
  if (!sdt) return jsonOut({ ok: false });
  const sheet = getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']);
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 1).setNumberFormat('@');
  sheet.appendRow([
    sdt,
    new Date().toISOString(),
    String(data.hanhdong || '').slice(0, 100),
    String(data.chitiet  || '').slice(0, 300)
  ]);
  const n = sheet.getLastRow();
  if (n > 20000) sheet.deleteRows(2, 2000);
  return jsonOut({ ok: true });
}

// ── GET Admin: lịch sử hoạt động của 1 học sinh (mới nhất trước) ──
function getHoatDong(e) {
  if (!requireAdmin(e.parameter.adminKey)) return jsonOut({ error: 'Unauthorized' });
  const hs = String(e.parameter.hs || '').trim();
  if (!hs) return jsonOut({ ok: false, msg: 'Thiếu hs' });
  const sheet = getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']);
  const rows  = sheet.getDataRange().getValues();
  const out = [];
  for (let i = rows.length - 1; i >= 1 && out.length < 200; i--) {
    if (sameTaiKhoan(rows[i][0], hs)) {
      out.push({ thoigian: rows[i][1], hanhdong: rows[i][2], chitiet: rows[i][3] });
    }
  }
  return jsonOut({ ok: true, data: out });
}

// ── POST Admin: sửa thông tin tài khoản (Lớp, Họ tên) ──
function updateAccount(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized' });
  const sdt = String(data.sdt || '').trim();
  if (!sdt) return jsonOut({ ok: false, msg: 'Thiếu sdt' });
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], sdt)) {
      if (data.lop)   sheet.getRange(i + 1, 3).setValue(String(data.lop));
      if (data.mienVideo !== undefined) sheet.getRange(i + 1, 10).setValue(!!data.mienVideo);
      if (data.tracNghiemVideo !== undefined) sheet.getRange(i + 1, 11).setValue(!!data.tracNghiemVideo);
      if (data.mienLuyenTap !== undefined) sheet.getRange(i + 1, 12).setValue(!!data.mienLuyenTap);
      if (data.hoten) sheet.getRange(i + 1, 2).setValue(String(data.hoten));
      return jsonOut({ ok: true, msg: 'Đã cập nhật thông tin.' });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy học sinh.' });
}

// ════════════════════════════════════════════════════════════════
// TEACHING SCOPE — Quản lý phạm vi giảng dạy (Đua Top & Solo)
// ════════════════════════════════════════════════════════════════

const TEACHING_SCOPE_HEADERS = ['courseId', 'stageId', 'openChapterIds', 'activeLessonIds', 'openAllLessons', 'validFrom', 'validTo', 'isActive', 'updatedAt', 'updatedBy', 'revision'];

function checkAdminKey(key) {
  const k = String(key || '').trim();
  const ADMIN_KEY = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || 'vlxt_admin_2025';
  return k === ADMIN_KEY;
}

// ── GET: Lấy cấu hình Teaching Scope ─────────────────────────
function getTeachingScope(e) {
  const adminKey = (e && e.parameter && e.parameter.adminKey) || '';
  const courseId = (e && e.parameter && e.parameter.courseId) || '';
  const stageId  = (e && e.parameter && e.parameter.stageId)  || '';
  const isAdmin  = checkAdminKey(adminKey);

  const sheet = getOrCreate('TeachingScope', TEACHING_SCOPE_HEADERS);
  const rows  = sheetToJson(sheet);

  const parsedRows = rows.map(r => {
    let openChapters = [];
    try { openChapters = JSON.parse(r.openChapterIds || '[]'); } catch (err) { openChapters = []; }
    let activeLessons = {};
    try { activeLessons = JSON.parse(r.activeLessonIds || '{}'); } catch (err) { activeLessons = {}; }
    let openAll = false;
    try {
      if (r.openAllLessons === 'true' || r.openAllLessons === true) openAll = true;
      else if (r.openAllLessons) openAll = JSON.parse(r.openAllLessons);
    } catch (_) { openAll = false; }

    return {
      courseId: String(r.courseId || ''),
      stageId: String(r.stageId || ''),
      openChapterIds: Array.isArray(openChapters) ? openChapters : [],
      activeLessonIds: activeLessons && typeof activeLessons === 'object' ? activeLessons : {},
      openAllLessons: openAll,
      validFrom: r.validFrom || '',
      validTo: r.validTo || '',
      isActive: r.isActive === true || r.isActive === 'true',
      updatedAt: r.updatedAt || '',
      updatedBy: isAdmin ? (r.updatedBy || '') : undefined,
      revision: Number(r.revision || 1)
    };
  });

  let filtered = parsedRows;
  if (courseId) filtered = filtered.filter(s => s.courseId === courseId);
  if (stageId)  filtered = filtered.filter(s => s.stageId === stageId);

  // Nếu là public request (học sinh/web), chỉ trả scope đang active VÀ trong hạn thời gian
  if (!isAdmin && !(e && e.parameter && (e.parameter.all === 'true' || e.parameter.all === true))) {
    const now = Date.now();
    filtered = filtered.filter(s => {
      if (!s.isActive) return false;
      if (s.validFrom) {
        const t = Date.parse(s.validFrom);
        if (!isNaN(t) && now < t) return false;
      }
      if (s.validTo) {
        const t = Date.parse(s.validTo);
        if (!isNaN(t) && now > t) return false;
      }
      return true;
    });
  }

  return jsonOut({ ok: true, data: filtered });
}

// ── POST: Lưu cấu hình Teaching Scope (bắt buộc adminKey, optimistic lock) ──
function saveTeachingScope(data) {
  if (!checkAdminKey(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const courseId = String(data.courseId || '').trim();
  const stageId  = String(data.stageId || '').trim() || 'toan_khoa';
  if (!courseId) {
    return jsonOut({ ok: false, msg: 'Thiếu courseId' });
  }

  const sheet = getOrCreate('TeachingScope', TEACHING_SCOPE_HEADERS);
  const rows  = sheetToJson(sheet);
  const existing = rows.find(r => String(r.courseId || '').trim() === courseId && String(r.stageId || '').trim() === stageId);

  // Optimistic Concurrency Check
  if (existing && data.expectedRevision !== undefined && data.expectedRevision !== null && data.expectedRevision !== '') {
    const currentRev = Number(existing.revision || 1);
    const expRev = Number(data.expectedRevision);
    if (currentRev !== expRev) {
      return jsonOut({
        ok: false,
        conflict: true,
        msg: 'Dữ liệu đã bị thay đổi bởi phiên làm việc khác (phiên bản máy chủ: ' + currentRev + ', phiên bản gửi lên: ' + expRev + '). Vui lòng tải lại trang.',
        serverRevision: currentRev
      });
    }
  }

  const nextRevision = existing ? (Number(existing.revision || 1) + 1) : 1;
  const now = new Date().toISOString();

  let openChapterIds = data.openChapterIds || [];
  if (typeof openChapterIds !== 'string') openChapterIds = JSON.stringify(openChapterIds);

  let activeLessonIds = data.activeLessonIds || {};
  if (typeof activeLessonIds !== 'string') activeLessonIds = JSON.stringify(activeLessonIds);

  let openAllLessons = data.openAllLessons !== undefined ? data.openAllLessons : false;
  if (typeof openAllLessons !== 'string') openAllLessons = JSON.stringify(openAllLessons);

  const payload = {
    courseId: courseId,
    stageId: stageId,
    openChapterIds: openChapterIds,
    activeLessonIds: activeLessonIds,
    openAllLessons: openAllLessons,
    validFrom: data.validFrom || '',
    validTo: data.validTo || '',
    isActive: data.isActive === true || data.isActive === 'true' ? 'true' : 'false',
    updatedAt: now,
    updatedBy: 'admin',
    revision: nextRevision
  };

  if (existing) {
    writeRowNamed(sheet, existing._rowIndex, payload);
  } else {
    appendRowNamed(sheet, payload);
  }

  // Đồng thời lưu bản ghi tóm tắt vào Settings để backward compat nếu cần
  try {
    const settingsSheet = getOrCreate('Settings', ['key', 'value']);
    const setRows = sheetToJson(settingsSheet);
    const setKey = 'teachingScope_' + courseId + '_' + stageId;
    const existingSetting = setRows.find(r => String(r.key) === setKey);
    const setVal = JSON.stringify(payload);
    if (existingSetting) {
      settingsSheet.getRange(existingSetting._rowIndex, 1, 1, 2).setValues([[setKey, setVal]]);
    } else {
      settingsSheet.appendRow([setKey, setVal]);
    }
  } catch(e) {}

  return jsonOut({
    ok: true,
    revision: nextRevision,
    scope: {
      courseId: courseId,
      stageId: stageId,
      openChapterIds: typeof data.openChapterIds === 'string' ? JSON.parse(data.openChapterIds) : (data.openChapterIds || []),
      activeLessonIds: typeof data.activeLessonIds === 'string' ? JSON.parse(data.activeLessonIds) : (data.activeLessonIds || {}),
      openAllLessons: typeof data.openAllLessons === 'string' ? JSON.parse(data.openAllLessons) : (data.openAllLessons || false),
      validFrom: data.validFrom || '',
      validTo: data.validTo || '',
      isActive: data.isActive === true || data.isActive === 'true',
      updatedAt: now,
      updatedBy: 'admin',
      revision: nextRevision
    }
  });
}

// ── SERVER-SIDE SELF-TEST: Chạy nội bộ qua OAuth/clasp run (không in/trả secret) ──
function runAdminSelfTest() {
  const adminKey = getAdminKey();
  if (!adminKey) {
    return { ok: false, step: 'check_key', msg: 'ADMIN_KEY is not configured in Script Properties' };
  }

  const testSdt = '0999999999_selftest_' + Date.now();
  try {
    // 1. Tạo tài khoản test cô lập
    const tkSheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
    tkSheet.appendRow([testSdt, 'SelfTest User', '12', 'selftest_pass', new Date().toISOString(), 0, 0, 'free', 0, false, true, false]);

    // 2. Kiểm thử pingAdmin
    const pingRes = pingAdmin({ adminKey: adminKey });
    if (!pingRes || pingRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'ping_admin', msg: 'pingAdmin failed' };
    }

    // 3. Kiểm thử Premium (trialExpiry = 0)
    const premRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'premium' });
    if (!premRes || premRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_premium', msg: 'setVipStatus premium failed' };
    }

    // 4. Kiểm thử VIP với số ngày (trialExpiry > 0)
    const vipRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'vip', days: 30 });
    if (!vipRes || vipRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_vip', msg: 'setVipStatus vip failed' };
    }

    // 5. Kiểm thử Free (trialExpiry = 0)
    const freeRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'free' });
    if (!freeRes || freeRes.ok !== true) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_free', msg: 'setVipStatus free failed' };
    }

    // 6. Ghi dữ liệu mẫu vào 4 sheet liên quan để test dọn dẹp
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']).appendRow([testSdt, 'L1', 'K12', 'Bai 1', '12', new Date().toISOString()]);
    getOrCreate('BangVang', ['name','studentClass','phone','score','timestamp']).appendRow(['SelfTest User', '12', testSdt, 10, new Date().toISOString()]);
    getOrCreate('NhiemVu', ['sdt','nhipHoc','conTro','lastMissionDate','startDate','chuoiDung','tongDiemDuaTop']).appendRow([testSdt, 1, 1, '2026-08-27', '2026-08-27', 1, 10]);
    getOrCreate('HoatDong', ['sdt','thoigian','hanhdong','chitiet']).appendRow([testSdt, new Date().toISOString(), 'selftest', 'running selftest']);

    // 7. Kiểm thử deleteAccount và dọn dẹp liên hoàn
    const delRes = deleteAccount({ adminKey: adminKey, sdt: testSdt });
    if (!delRes || delRes.ok !== true) {
      return { ok: false, step: 'delete_account', msg: 'deleteAccount failed' };
    }

    return { ok: true, passed: true };
  } catch (err) {
    try { deleteAccount({ adminKey: adminKey, sdt: testSdt }); } catch(e) {}
    return { ok: false, error: err.message };
  }
}

// ─── MIGRATION MOT LAN (5/8-6/8/2026): gan MaBai on dinh cho moi bai hoc + noi lai
// tien do hoc sinh bi mo côi do doi ten khoa 'CHUYEN DE LY THUYET GD1' -> 'Chuyen De Li Thuyet GD1'.
// Chay thu cong 1 lan tu trinh chinh sua (chon ham nay o dropdown roi bam Chay), AN TOAN de chay
// lai nhieu lan (idempotent): bai da co MaBai thi giu nguyen, TienDo da khop MaBai thi bo qua.
function debugTienDoRunOnce() {
  const sheet = getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  const rows = sheetToJson(sheet);
  Logger.log('total=' + rows.length);
  const withLesson = rows.filter(function(r){ return r.lesson; });
  Logger.log('withLesson=' + withLesson.length);
  const withoutLesson = rows.filter(function(r){ return !r.lesson; });
  Logger.log('withoutLesson=' + withoutLesson.length);
  Logger.log('sample_withoutLesson=' + JSON.stringify(withoutLesson.slice(0,3)));
  const distinctKhoa = {};
  withLesson.forEach(function(r){ distinctKhoa[String(r.khoa||'')] = (distinctKhoa[String(r.khoa||'')]||0)+1; });
  Logger.log('khoaCounts=' + JSON.stringify(distinctKhoa));
  const sampleLessons = withLesson.slice(0,8).map(function(r){ return r.lesson; });
  Logger.log('sampleLessons=' + JSON.stringify(sampleLessons));
  const chuyDe = withLesson.filter(function(r){ return String(r.lesson||'').toUpperCase().indexOf('CHUY') >= 0 || String(r.khoa||'').toUpperCase().indexOf('CHUY') >= 0; });
  Logger.log('chuyDeCount=' + chuyDe.length);
  Logger.log('chuyDeSample=' + JSON.stringify(chuyDe.slice(0,10)));
  return 'done';
}
function _normKey_(s) {
  return String(s||'').trim().toLowerCase().replace(/\u2013|\u2014/g,'-').replace(/\s+/g,' ');
}

function migrateLessonIdsRunOnce() {
  const COLS = ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai'];
  const sheet = getOrCreate('BaiHoc', COLS);
  const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  const maBaiCol = headers.indexOf('MaBai') + 1;
  const khoaCol = headers.indexOf('KhoaHoc') + 1;
  const chuongCol = headers.indexOf('Chuong') + 1;
  const tenBaiCol = headers.indexOf('TenBai') + 1;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonOut({ ok:true, assigned:0, reconciled:0, note:'BaiHoc rong' });
  const data = sheet.getRange(2, 1, lastRow-1, sheet.getLastColumn()).getValues();
  let assigned = 0;
  const rowsInfo = [];
  for (let i = 0; i < data.length; i++) {
    const rowNum = i + 2;
    let mb = data[i][maBaiCol-1];
    if (!mb) {
      mb = 'B' + Utilities.getUuid().replace(/-/g,'').slice(0,12);
      sheet.getRange(rowNum, maBaiCol).setValue(mb);
      assigned++;
    }
    rowsInfo.push({ khoa: String(data[i][khoaCol-1]||''), chuong: String(data[i][chuongCol-1]||''), tenBai: String(data[i][tenBaiCol-1]||''), maBai: mb });
  }
  const tdSheet = getOrCreate('TienDo', ['sdt','lesson','khoa','ten','lop','ngay']);
  const tdHeaders = tdSheet.getRange(1,1,1,tdSheet.getLastColumn()).getValues()[0];
  const lessonCol = tdHeaders.indexOf('lesson') + 1;
  const tdLastRow = tdSheet.getLastRow();
  if (tdLastRow < 2) return jsonOut({ ok:true, assigned: assigned, reconciled: 0 });
  const tdData = tdSheet.getRange(2, 1, tdLastRow-1, tdSheet.getLastColumn()).getValues();
  const currentKeys = {};
  const currentMaBaiSet = {};
  rowsInfo.forEach(function(u){ currentKeys[_normKey_(u.khoa)+'|||'+_normKey_(u.chuong)+'|||'+_normKey_(u.tenBai)] = u.maBai; currentMaBaiSet[u.maBai] = true; });
  const byChuongTenBai = {};
  rowsInfo.forEach(function(u){
    const k = _normKey_(u.chuong)+'|||'+_normKey_(u.tenBai);
    if (!byChuongTenBai[k]) byChuongTenBai[k] = [];
    byChuongTenBai[k].push(u.maBai);
  });
  let reconciled = 0;
  const ambiguous = [];
  for (let i = 0; i < tdData.length; i++) {
    const rowNum = i + 2;
    const lessonVal = String(tdData[i][lessonCol-1]||'');
    if (!lessonVal || currentMaBaiSet[lessonVal]) continue;
    const normFull = _normKey_(lessonVal.split('|||')[0]||'') + '|||' + _normKey_(lessonVal.split('|||')[1]||'') + '|||' + _normKey_(lessonVal.split('|||')[2]||'');
    if (currentKeys[normFull]) {
      tdSheet.getRange(rowNum, lessonCol).setValue(currentKeys[normFull]);
      reconciled++;
      continue;
    }
    const parts = lessonVal.split('|||');
    if (parts.length === 3) {
      const ctKey = _normKey_(parts[1]) + '|||' + _normKey_(parts[2]);
      const candidates = byChuongTenBai[ctKey];
      if (candidates && candidates.length === 1) {
        tdSheet.getRange(rowNum, lessonCol).setValue(candidates[0]);
        reconciled++;
      } else if (candidates && candidates.length > 1) {
        ambiguous.push(lessonVal);
      }
    }
  }
  Logger.log(JSON.stringify({ ok:true, assigned: assigned, reconciled: reconciled, ambiguous: ambiguous }));
  return jsonOut({ ok:true, assigned: assigned, reconciled: reconciled, ambiguous: ambiguous });
}


// ════════════════════════════════════════════════════════════════
// HƯỚNG DẪN HỌC TẬP (popup video, thêm 17/8/2026) — Tab "HuongDan"
// Schema: key(0) | tieuDe(1) | videoUrl(2) | noiDung(3)
// key cố định: 'signup' + 'baihoc' | 'danhsach-ly12' | 'hoso' | 'live' | 'lichlive'
// ════════════════════════════════════════════════════════════════
function getHuongDan() {
  const sheet = getOrCreate('HuongDan', ['key','tieuDe','videoUrl','noiDung']);
  return jsonOut({ ok: true, data: sheetToJson(sheet) });
}

function saveHuongDan(data) {
  const sheet = getOrCreate('HuongDan', ['key','tieuDe','videoUrl','noiDung']);
  const key = String(data.key || '').trim();
  if (!key) return jsonOut({ ok: false, msg: 'Thieu key' });
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === key) {
      sheet.getRange(i+1, 1, 1, 4).setValues([[key, data.tieuDe||'', data.videoUrl||'', data.noiDung||'']]);
      return jsonOut({ ok: true, action: 'updated' });
    }
  }
  sheet.appendRow([key, data.tieuDe||'', data.videoUrl||'', data.noiDung||'']);
  return jsonOut({ ok: true, action: 'created' });
}


function searchPublicProfiles(e) {
  const requester = String(e.parameter.hs || '').trim();
  const rawQuery = String(e.parameter.q || '').trim();
  const query = normalizeSearchText(rawQuery);
  const digits = rawQuery.replace(/\D/g, '');
  if (!requester || (!query && digits.length < 4)) return jsonOut({ ok: true, data: [] });
  if (query.length < 3 && digits.length < 4) return jsonOut({ ok: true, data: [] });
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry']);
  const rows = sheet.getDataRange().getValues();
  let requesterExists = false;
  for (let i = 1; i < rows.length; i++) {
    if (sameTaiKhoan(rows[i][0], requester)) { requesterExists = true; break; }
  }
  if (!requesterExists) return jsonOut({ ok: false, msg: 'Tai khoan chua dang nhap hoac khong con ton tai.' });
  const result = [];
  for (let i = 1; i < rows.length && result.length < 20; i++) {
    const account = String(rows[i][0] || '').trim();
    if (!account || sameTaiKhoan(account, requester)) continue;
    const name = String(rows[i][1] || '').trim();
    const accountDigits = account.replace(/\D/g, '');
    const nameMatch = query.length >= 3 && normalizeSearchText(name).indexOf(query) !== -1;
    const accountMatch = digits.length >= 4 && accountDigits.indexOf(digits) !== -1;
    if (nameMatch || accountMatch) result.push({ key: account.toLowerCase(), hoten: name, lop: rows[i][2] || '' });
  }
  return jsonOut({ ok: true, data: result });
}

function normalizeSearchText(value) {
  return String(value || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/\s+/g, ' ').trim();
}
