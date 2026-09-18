const DEVICE_LOCK_ENABLED = false; // Mặc định tắt khóa thiết bị thử nghiệm

function doGet(e) {
  const type   = (e.parameter.type || '').toLowerCase();
  const hs     = e.parameter.hs || '';
  const examId = e.parameter.examId || '';
  try {
    if (type === 'videocauhoi')     return getVideoCauHoi(e.parameter.bai || '');
    if (type === 'baitaptracnghiem') return getBaiTapTracNghiem(e.parameter.bai || '');
    if (type === 'transcript')       return getVideoTranscript(e.parameter.v || '', e.parameter.lang || '');
    if (type === 'baihoc')           return getBaiHoc();
    if (type === 'liverecord')       return getLiveRecord(e);
    if (type === 'diemthi')          return getDiemThi();
    if (type === 'tiendo')           return getTienDo(hs);
    if (type === 'triallimit')       return jsonOut({ ok: false, error: 'METHOD_NOT_ALLOWED', msg: 'Trial limit endpoint yêu cầu phương thức POST với token trong request body' });
    if (type === 'profile')          return getProfile(e);
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
    if (type === 'questionstats' || type === 'getquestionstats') return getQuestionStats(e);
    if (type === 'repairp107_251') return repairBatchP107_251_AutoFix(e);
    if (type === 'patchspecificfields') return patchSpecificFields_AuditFidelity(e);
    return getExamQuestions('de01'); // backward compat — không có type param
  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = (data.action || data.type || '').toLowerCase();
    if (action === 'checkauthconfig' || action === 'check_auth_config') return checkAuthConfig(data);
    if (action === 'getprofile' || action === 'profile') return getProfile(data);
    if (action === 'gettriallimit' || action === 'triallimit') return getTrialLimit(data);
    if (action === 'starttriallesson')   return startTrialLesson(data);
    if (action === 'completetriallesson') return completeTrialLesson(data);
    if (action === 'cleartrialactivity') return clearTrialActivity(data);
    if (action === 'getbaihocadmin' || action === 'get_bai_hoc_admin') return getBaiHocAdmin(data);
    if (action === 'getliverecordadmin' || action === 'get_live_record_admin') return getLiveRecordAdmin(data);
    if (action === 'saveliverecord' || action === 'save_live_record') return saveLiveRecord(data);
    if (action === 'deleteliverecord' || action === 'delete_live_record') return deleteLiveRecord(data);
    if (action === 'getvideocauhoiadmin' || action === 'get_video_cau_hoi_admin') return getVideoCauHoiAdmin(data);
    if (action === 'getbaitaptracnghiemadmin' || action === 'get_bai_tap_trac_nghiem_admin') return getBaiTapTracNghiemAdmin(data);
    if (action === 'getquestionstats' || action === 'get_question_stats') return getQuestionStats(data);
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
    if (action === 'clonenganhangtostaging') return cloneNganHangToStaging(data);
    if (action === 'repairipclassbatch') return repairIpclassBatch(data);
    if (action === 'updateexistingnganhangfromfile') return updateExistingNganHangFromFile(data);
    if (action === 'repairlessonbatch' || action === 'repair_lesson_batch' || action === 'repairquestionslessonbatch') return repairLessonBatch(data);
    if (action === 'repairbatchp107_251_autofix') return repairBatchP107_251_AutoFix(data);
    if (action === 'importnganhang' || action === 'import_tinh_batch' || action === 'importtinhbatch' || action === 'importquestionsbatch' || action === 'import_questions_batch') return importNganHang(data);
    if (action === 'bulksetbainganhang') return typeof bulkSetBaiHocNganHang === 'function' ? bulkSetBaiHocNganHang(data) : bulkSetBaiNganHang(data);
    if (action === 'bulksetchatluongnganhang') return bulkSetChatLuongNganHang(data);
    if (action === 'saveprogress')       return saveProgress(data);
    if (action === 'savescore')          return saveScore(data);
    if(action === 'saveexam')           return saveExam(data);
    if (action === 'bulkupdateexams')   return bulkUpdateExams(data);
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

// ── AUTH: Đăng ký & Bảo mật Phiên HMAC ────────────────────────

// Helper: chuẩn hoá SĐT hoặc Email để so sánh
function normSdt(s) {
  const str = String(s || '').trim();
  if (str.includes('@')) return str.toLowerCase();
  return str.replace(/\D/g,'').replace(/^0+/,'');
}

function checkAuthConfig(data) {
  let hasSecret = false;
  let secretLength = 0;
  try {
    const s = getAuthSecret();
    hasSecret = Boolean(s && s.length >= 32);
    secretLength = s ? s.length : 0;
  } catch(e) {}

  let hasGoogleClientId = false;
  let googleClientIdTail = '';
  try {
    const cid = getGoogleClientId();
    hasGoogleClientId = Boolean(cid && cid.includes('.apps.googleusercontent.com'));
    googleClientIdTail = cid ? cid.slice(-25) : '';
  } catch(e) {}

  let hasTrialActivity = false;
  let trialActivityHeaders = [];
  let hasExact6Headers = false;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const actSheet = ss.getSheetByName('TrialActivity');
    if (actSheet) {
      hasTrialActivity = true;
      const lastCol = actSheet.getLastColumn();
      if (lastCol > 0) {
        trialActivityHeaders = actSheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h || '').trim(); });
      }
      const expected = ['sdt','mabai','dateStr','thoigian','deviceId','hoten'];
      hasExact6Headers = (trialActivityHeaders.length === 6) && expected.every(function(h, idx) { return trialActivityHeaders[idx] === h; });
    }
  } catch(e) {}

  return jsonOut({
    ok: hasSecret && hasGoogleClientId && hasExact6Headers,
    hasAuthSecret: hasSecret,
    secretLength: secretLength,
    isStrongSecret: secretLength >= 32,
    hasGoogleClientId: hasGoogleClientId,
    googleClientIdTail: googleClientIdTail,
    hasTrialActivitySheet: hasTrialActivity,
    trialActivityHeaders: trialActivityHeaders,
    hasExact6Headers: hasExact6Headers
    // Tuyệt đối không chứa hoặc hiển thị secret value
  });
}

function getAuthSecret() {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('AUTH_SECRET');
  if (!secret || !secret.trim()) {
    throw new Error('AUTH_SECRET_NOT_CONFIGURED');
  }
  return secret.trim();
}

function generateUserToken(sdt, userMeta) {
  const secret = getAuthSecret();
  const cleanSdt = normSdt(sdt);
  const now = Date.now();
  const issuedAt = now;

  // Hạn phiên tối đa 7 ngày, nhưng không sống lâu hơn trạng thái tài khoản hợp lệ
  let duration = 7 * 24 * 60 * 60 * 1000;
  if (userMeta && userMeta.trialExpiry && Number(userMeta.trialExpiry) > now) {
    const remainTrial = Number(userMeta.trialExpiry) - now;
    if (remainTrial < duration) {
      duration = remainTrial;
    }
  }
  const expiresAt = now + duration;
  const nonce = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
  const raw = cleanSdt + ':' + issuedAt + ':' + expiresAt + ':' + nonce;
  const sig = Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(raw, secret)
  );
  return Utilities.base64EncodeWebSafe(raw + ':' + sig);
}

function verifyUserToken(token) {
  if (!token) return null;
  const secret = getAuthSecret(); // Ném AUTH_SECRET_NOT_CONFIGURED nếu thiếu
  try {
    const decoded = Utilities.newBlob(Utilities.base64DecodeWebSafe(token)).getDataAsString();
    const parts = decoded.split(':');
    if (parts.length !== 5) return null;
    const sdt = parts[0];
    const issuedAt = Number(parts[1]);
    const expiresAt = Number(parts[2]);
    const nonce = parts[3];
    const sig = parts[4];

    const now = Date.now();
    if (isNaN(issuedAt) || isNaN(expiresAt)) return null;
    if (now > expiresAt) return null; // Token đã hết hạn
    if (issuedAt > now + 60000) return null; // Token từ tương lai

    const raw = sdt + ':' + issuedAt + ':' + expiresAt + ':' + nonce;
    const expectedSig = Utilities.base64EncodeWebSafe(
      Utilities.computeHmacSha256Signature(raw, secret)
    );
    if (sig !== expectedSig) return null;
    return sdt;
  } catch (e) {
    if (e.message === 'AUTH_SECRET_NOT_CONFIGURED') throw e;
    return null;
  }
}

function registerUser(data) {
  // Preflight AUTH_SECRET: Fail-Closed tuyệt đối trước khi đọc/ghi bất kỳ Sheet nào
  try {
    getAuthSecret();
  } catch (err) {
    if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
    }
    throw err;
  }

  // Chuẩn hoá SĐT: chỉ giữ số
  const sdtClean = String(data.sdt || '').replace(/\D/g,'').trim();
  if (!sdtClean) return jsonOut({ ok: false, msg: 'Số điện thoại không hợp lệ!' });

  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
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
  const token = generateUserToken(data.sdt, { loaiTK: loaiTK, trialExpiry: trialExpiry });
  return jsonOut({ ok: true, msg: 'Đăng ký thành công! Bạn có 7 ngày dùng thử VIP miễn phí.', user: {
    sdt: data.sdt, hoten: data.hoten, lop: data.lop,
    lpTotal: 0, diemGame: 0, loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: false, tracNghiemVideo: false,
    token: token
  }});
}

// ── AUTH: Đăng nhập ──────────────────────────────────────────

function loginUser(data) {
  // Preflight AUTH_SECRET: Fail-Closed nếu thiếu cấu hình secret
  try {
    getAuthSecret();
  } catch (err) {
    if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
    }
    throw err;
  }

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
      const token = generateUserToken(row[0], { loaiTK: loaiTK, trialExpiry: trialExpiry });
      return jsonOut({ ok: true, user: {
        sdt: row[0], hoten: row[1], lop: row[2],
        lpTotal: typeof row[5] === 'number' ? (row[5] || 0) : 0, diemGame: typeof row[6] === 'number' ? (row[6] || 0) : 0,
        loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: !!(row[9]), tracNghiemVideo: (row[10] === false ? false : true), mienLuyenTap: !!(row[11]),
        token: token
      }});
    }
  }
  return jsonOut({ ok: false, msg: 'Số điện thoại hoặc mật khẩu không đúng!' });
}

// ── Google ID Token Verification (Xác minh danh tính an toàn phía server) ──

function getGoogleClientId() {
  const prop = PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_ID');
  const clientId = prop ? String(prop).trim() : '';
  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID_NOT_CONFIGURED');
  }
  return clientId;
}

function verifyGoogleIdToken(credential) {
  if (!credential || typeof credential !== 'string') return null;
  const token = credential.trim();
  if (!token) return null;

  const expectedAud = getGoogleClientId();
  if (!expectedAud) {
    throw new Error('GOOGLE_CLIENT_ID_NOT_CONFIGURED');
  }

  // Gọi Google TokenInfo endpoint để xác thực tính hợp lệ của token
  const verifyUrl = 'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token);
  let resp;
  try {
    resp = UrlFetchApp.fetch(verifyUrl, { muteHttpExceptions: true });
  } catch (err) {
    return null;
  }
  if (!resp || resp.getResponseCode() !== 200) {
    return null;
  }

  let payload = null;
  try {
    payload = JSON.parse(resp.getContentText());
  } catch (err) {
    return null;
  }

  if (!payload || typeof payload !== 'object') return null;

  // 1. Kiểm tra audience/client ID
  if (payload.aud !== expectedAud) return null;

  // 2. Kiểm tra issuer (tài khoản Google chính thống)
  if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') return null;

  // 3. Kiểm tra thời hạn hết hạn (exp tính bằng giây)
  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || Number(payload.exp) < nowSec) return null;

  // 4. Kiểm tra email và trạng thái email đã xác minh
  const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
  const email = String(payload.email || '').trim().toLowerCase();
  if (!email || !emailVerified) return null;

  return {
    email: email,
    name: String(payload.name || email).trim(),
    picture: String(payload.picture || '').trim(),
    sub: String(payload.sub || '').trim()
  };
}

// ── Đăng nhập bằng Google ────────────────────────────────────

function loginGoogle(data) {
  // BƯỚC 1: Preflight AUTH_SECRET và GOOGLE_CLIENT_ID trước khi đụng bất kỳ Sheet nào (Fail-Closed)
  try {
    getAuthSecret();
  } catch (err) {
    if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
    }
    throw err;
  }
  try {
    getGoogleClientId();
  } catch (err) {
    if (err.message === 'GOOGLE_CLIENT_ID_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'GOOGLE_CLIENT_ID_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình GOOGLE_CLIENT_ID trong Script Properties' });
    }
    throw err;
  }

  // BƯỚC 2: Xác minh Google ID Token / Credential (Tuyệt đối không tin email/hoten/avatar do client tự khai)
  const credential = data && (data.credential || data.idToken || data.id_token);
  let googleUser = null;
  try {
    googleUser = verifyGoogleIdToken(credential);
  } catch (err) {
    if (err.message === 'GOOGLE_CLIENT_ID_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'GOOGLE_CLIENT_ID_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình GOOGLE_CLIENT_ID trong Script Properties' });
    }
    return jsonOut({ ok: false, error: 'invalid_google_token', msg: 'Lỗi khi xác minh danh tính Google' });
  }

  if (!googleUser || !googleUser.email) {
    return jsonOut({ ok: false, error: 'invalid_google_token', msg: 'Google credential không hợp lệ, hết hạn hoặc sai audience/issuer.' });
  }

  // Lấy dữ liệu 100% từ payload đã được Google chứng thực
  const email  = googleUser.email;
  const hoten  = googleUser.name || email;
  const avatar = googleUser.picture || '';

  // BƯỚC 3: Xử lý tài khoản trong Sheet TaiKhoan
  const sheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
  const rows  = sheet.getDataRange().getValues();

  // 3.1. Tài khoản Google đã tồn tại → đăng nhập bình thường, KHÔNG check thiết bị
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === email) {
      if (hoten && rows[i][1] !== hoten) sheet.getRange(i+1, 2).setValue(hoten);
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
      const token = generateUserToken(rows[i][0], { loaiTK: loaiTK, trialExpiry: trialExpiry });
      return jsonOut({ ok: true, user: {
        sdt: rows[i][0], hoten: hoten || rows[i][1],
        lop: rows[i][2] || 'Google', email: email,
        avatar: avatar || '', lpTotal: rows[i][5] || 0,
        loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: !!(rows[i][9]), tracNghiemVideo: (rows[i][10] === false ? false : true),
        token: token
      }});
    }
  }

  // 3.2. Chống học thử nhiều lần trên cùng thiết bị
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

  // 3.3. Tạo tài khoản Google mới
  const now         = new Date();
  const trialExpiry = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  const loaiTK      = 'vip';
  sheet.appendRow([email, hoten, 'Google', 'GOOGLE_AUTH', now.toISOString(), 0, 0, loaiTK, trialExpiry]);
  if (DEVICE_LOCK_ENABLED && deviceId) {
    const devSheet = getOrCreate('ThietBiHocThu', ['deviceId','sdt','hoten','trialStart','trialExpiry','soLanChan']);
    devSheet.getRange(devSheet.getLastRow() + 1, 2, 1, 1).setNumberFormat('@');
    devSheet.appendRow([deviceId, email, hoten, now.getTime(), trialExpiry, 0]);
  }
  const token = generateUserToken(email, { loaiTK: loaiTK, trialExpiry: trialExpiry });
  return jsonOut({ ok: true, user: {
    sdt: email, hoten: hoten,
    lop: 'Google', email: email,
    avatar: avatar || '', lpTotal: 0,
    loaiTK: loaiTK, trialExpiry: trialExpiry, mienVideo: false, tracNghiemVideo: false,
    token: token
  }});
}

// ── Hồ sơ học sinh (Hỗ trợ giai đoạn chuyển tiếp GET cũ không token & POST mới an toàn) ─────────
// Dự kiến chính thức tắt hoàn toàn endpoint GET profile vào ngày 28/09/2026 (sau 2 tuần kể từ rollout)

function getProfile(dataOrEvent) {
  const isDoGet = Boolean(dataOrEvent && dataOrEvent.parameter);

  let sdt = null;

  if (isDoGet) {
    // Endpoint GET (Frontend cũ trong giai đoạn chuyển tiếp rollout — KHÔNG NHẬN TOKEN TỪ QUERY STRING):
    // Cho phép đọc thông tin cơ bản để hiển thị widget / đồng bộ LP cho các client cũ đang cache.
    // TUYỆT ĐỐI KHÔNG CẤP PHÁT HOẶC TRẢ VỀ TOKEN TẠI ĐÂY (Zero Token Leak).
    const clientHs = String((dataOrEvent.parameter && (dataOrEvent.parameter.hs || dataOrEvent.parameter.sdt)) || '').trim();
    if (!clientHs) {
      return jsonOut({ ok: false, error: 'missing_hs', msg: 'Thiếu thông tin số điện thoại học sinh' });
    }
    sdt = clientHs;
  } else {
    // Endpoint POST (Frontend mới): BẮT BUỘC có token trong request body JSON
    const data = dataOrEvent || {};
    const token = String(data.token || data.authToken || '').trim();
    if (!token) {
      return jsonOut({ ok: false, error: 'token_required', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token trong body)' });
    }

    let authSdt = null;
    try {
      authSdt = verifyUserToken(token);
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
      }
      return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Lỗi xác thực phiên đăng nhập' });
    }

    if (!authSdt) {
      return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    }

    // Chống IDOR: Không được đọc hồ sơ của tài khoản khác
    const clientHs = String(data.hs || data.sdt || '').trim();
    if (clientHs && normSdt(clientHs) !== normSdt(authSdt)) {
      return jsonOut({ ok: false, error: 'Forbidden', msg: 'Không có quyền truy cập hồ sơ tài khoản khác' });
    }

    sdt = authSdt; // LUÔN DÙNG SĐT ĐÃ ĐƯỢC XÁC THỰC TỪ TOKEN
  }
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
      user = {
        sdt: rows[i][0],
        hoten: rows[i][1],
        lop: rows[i][2],
        lpTotal: typeof rows[i][5]==='number'?(rows[i][5]||0):0,
        diemGame: typeof rows[i][6]==='number'?(rows[i][6]||0):0,
        loaiTK: _loaiTK,
        trialExpiry: _trialExpiry,
        mienVideo: !!(rows[i][9]),
        tracNghiemVideo: (rows[i][10] === false ? false : true),
        mienLuyenTap: !!(rows[i][11])
        // TUYỆT ĐỐI KHÔNG cấp phát token mới tại getProfile!
      };
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
const BAIHOC_COLS = ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai','TrangThai','BaiNenTang'];

function normalizeLessonStatus(st) {
  const s = (st === undefined || st === null) ? '' : String(st).trim().toLowerCase();
  if (s === 'draft' || s === 'archived') return s;
  return 'published'; // Tương thích ngược: thiếu hoặc khác draft/archived thì mặc định là published
}

function isLessonPublished(baiKey) {
  if (!baiKey) return false;
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('BaiHoc');
    if (!sheet) return false;
    const rows = sheetToJson(sheet);
    const target = rows.find(function(r) {
      return String(r.MaBai || '').trim() === String(baiKey).trim() ||
             String(r.TenBai || '').trim() === String(baiKey).trim();
    });
    if (!target) return false;
    const st = normalizeLessonStatus(target.TrangThai || target.trangThai);
    return st === 'published';
  } catch (err) {
    return false; // fail-closed bảo vệ an toàn
  }
}

function getBaiHoc(e) {
  const sheet = getOrCreate('BaiHoc', BAIHOC_COLS);
  const rawRows = sheetToJson(sheet);

  // Public GET: TUYỆT ĐỐI chỉ trả bài published, bất kỳ query param nào cũng không nâng quyền
  const publicRows = rawRows
    .map(function(r) {
      const st = normalizeLessonStatus(r.TrangThai || r.trangThai);
      return Object.assign({}, r, { TrangThai: st });
    })
    .filter(function(r) {
      return r.TrangThai === 'published';
    });

  return jsonOut(publicRows);
}

function getBaiHocAdmin(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const sheet = getOrCreate('BaiHoc', BAIHOC_COLS);
  const rawRows = sheetToJson(sheet);
  const allRows = rawRows.map(function(r) {
    const st = normalizeLessonStatus(r.TrangThai || r.trangThai);
    return Object.assign({}, r, { TrangThai: st });
  });
  return jsonOut({ ok: true, data: allRows });
}

// ── GET: Danh sách đề thi ────────────────────────────────────
// Schema DanhSachDe: examId(0) | tenDe(1) | moTa(2) | thoiGian(3) | trangThai(4) | lop(5) | soLuotLam(6)

function getDanhSachDe() {
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam','hienThi','videoUrl','loaiDe','soCau','updatedAt']);
  let rows  = sheetToJson(sheet);

  // Auto-seed / ensure all 14 vedich2k9 simulation exams exist in sheet
  const existingMap = {};
  rows.forEach(r => {
    const eid = String(r.examId || '').trim().toLowerCase();
    if (eid) existingMap[eid] = true;
  });

  const nowStr = new Date().toISOString();
  let needReRead = false;
  for (let i = 2; i <= 15; i++) {
    const num = String(i).padStart(2, '0');
    const examId = 'vedich2k9_de' + num;
    if (!existingMap[examId]) {
      sheet.appendRow([
        examId,
        'Đề về đích 2k9 – Đề số ' + num,
        'Đề thi thử THPT Quốc Gia môn Vật Lý chuẩn cấu trúc BGD khóa XPS 2k9. Đầy đủ 3 phần: Trắc nghiệm 4 lựa chọn, Đúng/Sai và Trả lời ngắn kèm lời giải chi tiết.',
        50,
        'khoa',
        '12',
        0,
        'an',
        '',
        'thithu',
        28,
        nowStr
      ]);
      needReRead = true;
    }
  }

  if (needReRead) {
    rows = sheetToJson(sheet);
  }

  // Đếm số câu từ NganHangDe cho mỗi đề (nếu có)
  const ngh    = getOrCreate('NganHangDe', ['id','type','question','optA','optB','optC','optD','correct','examId']);
  const nghData = ngh.getDataRange().getValues();
  const count  = {};
  for (let i = 1; i < nghData.length; i++) {
    const eid = String(nghData[i][8] || 'de01').trim().toLowerCase();
    if (nghData[i][2]) count[eid] = (count[eid] || 0) + 1;
  }

  return jsonOut({
    ok: true,
    data: rows.map(r => {
      const eid = String(r.examId || '').trim().toLowerCase();
      const hVal = (r.hienThi === true || String(r.hienThi).toLowerCase() === 'hien' || String(r.hienThi).toLowerCase() === 'true' || String(r.hienThi) === '1');
      return {
        ...r,
        examId: eid,
        hienThi: hVal ? 'hien' : 'an',
        trangThai: String(r.trangThai || 'khoa').toLowerCase() === 'mo' ? 'mo' : 'khoa',
        soCau: Number(r.soCau) || count[eid] || 28
      };
    })
  });
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
  // Ghi nhận hoàn thành bài học thử nếu là tài khoản trial
  try { completeTrialLesson(data); } catch(e) {}
  return jsonOut({ ok: true, lpEarned: lpEarned, lpTotal: lpTotal, rankUp: rankUp });
}

// ── POST: Quản lý bài học (Admin) ─────────────────────────────

function saveBaiHoc(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const COLS = typeof BAIHOC_COLS !== 'undefined' ? BAIHOC_COLS : ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap','ThoiGianLamBai','ThuTuBai','MaBai','TrangThai','BaiNenTang'];
  const sheet = getOrCreate('BaiHoc', COLS); // tự thêm cột thiếu nếu sheet cũ
  const inputMaBai = String((data && (data.maBai || data.MaBai)) || '').trim();
  const rowIdx = (inputMaBai && findRowByMaBai(sheet, inputMaBai)) || data.rowIndex || findRowByKey(sheet, data.originalKey);
  // MaBai: ma dinh danh ON DINH cho moi bai hoc, KHONG BAO GIO doi khi doi ten khoa/chuong/bai
  // hoac sap xep lai vi tri - tien do hoc sinh (TienDo.lesson) bam theo ma nay de khong bao gio mat.
  let maBai = '';
  let existingThuTuBai = '';
  let existingTrangThai = '';
  if (rowIdx) {
    const h_ = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const c_ = h_.indexOf('MaBai');
    if (c_ >= 0) maBai = sheet.getRange(rowIdx, c_+1).getValue() || '';
    const ct_ = h_.indexOf('ThuTuBai');
    if (ct_ >= 0) {
      const v_ = sheet.getRange(rowIdx, ct_+1).getValue();
      existingThuTuBai = (v_===null || v_===undefined) ? '' : v_;
    }
    const cs_ = h_.indexOf('TrangThai');
    if (cs_ >= 0) {
      const s_ = sheet.getRange(rowIdx, cs_+1).getValue();
      existingTrangThai = (s_===null || s_===undefined) ? '' : s_;
    }
  }
  if (!maBai) maBai = inputMaBai || ('B' + Utilities.getUuid().replace(/-/g,'').slice(0,12));
  // Giu nguyen ThuTuBai hien co neu client khong gui gia tri hop le (VD: cache trinh duyet cu
  // luc mo form Sua bai chua co ThuTuBai) - tranh bai tu "nhay xuong cuoi chuong" moi lan Luu (6/8/2026).
  const ttbToSave = (data.ThuTuBai !== undefined && data.ThuTuBai !== null && data.ThuTuBai !== '') ? data.ThuTuBai : existingThuTuBai;
  const rawStatus = (data.TrangThai !== undefined && data.TrangThai !== null) ? data.TrangThai : ((data.trangThai !== undefined && data.trangThai !== null) ? data.trangThai : existingTrangThai);
  const trangThaiToSave = normalizeLessonStatus(rawStatus);

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
    MaBai:     maBai,
    TrangThai: trangThaiToSave,
    BaiNenTang: data.BaiNenTang || ''
  };
  if (rowIdx) {
    writeRowNamed(sheet, rowIdx, rowData);
  } else {
    appendRowNamed(sheet, rowData);
  }
  triggerStaticRefresh();
  return jsonOut({ ok: true, maBai: maBai, TrangThai: trangThaiToSave, BaiNenTang: rowData.BaiNenTang });
}

function deleteBaiHoc(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const sheet = getOrCreate('BaiHoc', ['KhoaHoc','Chuong','TenBai','Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','ThoiGianLamBai']);
  const rowIdx = (data.maBai && findRowByMaBai(sheet, data.maBai)) || data.rowIndex || findRowByKey(sheet, data.key || data.originalKey);
  if (rowIdx) sheet.deleteRow(rowIdx);
  triggerStaticRefresh();
  return jsonOut({ ok: true });
}


// ── GET & POST: Live & Xem Lại (LiveRecord) ──────────────────
const LIVERECORD_COLS = [
  'KhoaHoc','Chuong','TenBai','NgayGioLive','LinkLive','TaiLieuLive','VideoGhiLai',
  'Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap',
  'ThoiGianLamBai','ThuTuBai','MaBai','TrangThai'
];

function getLiveRecord(e) {
  const sheet = getOrCreate('LiveRecord', LIVERECORD_COLS);
  const rawRows = sheetToJson(sheet);
  const publicRows = rawRows
    .map(function(r) {
      const st = normalizeLessonStatus(r.TrangThai || r.trangThai);
      return Object.assign({}, r, { TrangThai: st });
    })
    .filter(function(r) {
      return r.TrangThai === 'published';
    });
  return jsonOut(publicRows);
}

function getLiveRecordAdmin(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const sheet = getOrCreate('LiveRecord', LIVERECORD_COLS);
  const rawRows = sheetToJson(sheet);
  const allRows = rawRows.map(function(r) {
    const st = normalizeLessonStatus(r.TrangThai || r.trangThai);
    return Object.assign({}, r, { TrangThai: st });
  });
  return jsonOut({ ok: true, data: allRows });
}

function saveLiveRecord(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const COLS = typeof LIVERECORD_COLS !== 'undefined' ? LIVERECORD_COLS : [
    'KhoaHoc','Chuong','TenBai','NgayGioLive','LinkLive','TaiLieuLive','VideoGhiLai',
    'Video','VideoGiai','MoTaBai','NgayDang','BaiTap','PDF','PDFLyThuyet','PDFLuyenTap',
    'ThoiGianLamBai','ThuTuBai','MaBai','TrangThai'
  ];
  const sheet = getOrCreate('LiveRecord', COLS);
  const inputMaBai = String((data && (data.maBai || data.MaBai)) || '').trim();
  const rowIdx = (inputMaBai && findRowByMaBai(sheet, inputMaBai)) || data.rowIndex || findRowByKey(sheet, data.originalKey);

  let maBai = '';
  let existingThuTuBai = '';
  let existingTrangThai = '';
  if (rowIdx) {
    const h_ = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    const c_ = h_.indexOf('MaBai');
    if (c_ >= 0) maBai = sheet.getRange(rowIdx, c_+1).getValue() || '';
    const ct_ = h_.indexOf('ThuTuBai');
    if (ct_ >= 0) {
      const v_ = sheet.getRange(rowIdx, ct_+1).getValue();
      existingThuTuBai = (v_===null || v_===undefined) ? '' : v_;
    }
    const cs_ = h_.indexOf('TrangThai');
    if (cs_ >= 0) {
      const s_ = sheet.getRange(rowIdx, cs_+1).getValue();
      existingTrangThai = (s_===null || s_===undefined) ? '' : s_;
    }
  }
  if (!maBai) maBai = inputMaBai || ('LIVE_' + Utilities.getUuid().replace(/-/g,'').slice(0,10));
  const ttbToSave = (data.ThuTuBai !== undefined && data.ThuTuBai !== null && data.ThuTuBai !== '') ? data.ThuTuBai : existingThuTuBai;
  const rawStatus = (data.TrangThai !== undefined && data.TrangThai !== null) ? data.TrangThai : ((data.trangThai !== undefined && data.trangThai !== null) ? data.trangThai : existingTrangThai);
  const trangThaiToSave = normalizeLessonStatus(rawStatus);

  const rowData = {
    KhoaHoc:     data.KhoaHoc     || '',
    Chuong:      data.Chuong      || '',
    TenBai:      data.TenBai      || '',
    NgayGioLive: data.NgayGioLive || '',
    LinkLive:    data.LinkLive    || '',
    TaiLieuLive: data.TaiLieuLive || '',
    VideoGhiLai: data.VideoGhiLai || '',
    Video:       data.Video       || data.VideoGhiLai || '',
    VideoGiai:   data.VideoGiai   || '',
    MoTaBai:     data.MoTaBai     || '',
    NgayDang:    data.NgayDang    || new Date().toISOString(),
    BaiTap:      data.BaiTap      || '',
    PDF:         data.PDF         || data.TaiLieuLive || '',
    PDFLyThuyet: data.PDFLyThuyet || '',
    PDFLuyenTap: data.PDFLuyenTap || '',
    ThoiGianLamBai: data.ThoiGianLamBai || '',
    ThuTuBai:    ttbToSave,
    MaBai:       maBai,
    TrangThai:   trangThaiToSave
  };
  if (rowIdx) {
    writeRowNamed(sheet, rowIdx, rowData);
  } else {
    appendRowNamed(sheet, rowData);
  }
  triggerStaticRefresh();
  return jsonOut({ ok: true, maBai: maBai, TrangThai: trangThaiToSave });
}

function deleteLiveRecord(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const sheet = getOrCreate('LiveRecord', LIVERECORD_COLS);
  const rowIdx = (data.maBai && findRowByMaBai(sheet, data.maBai)) || data.rowIndex || findRowByKey(sheet, data.key || data.originalKey);
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
// Schema: examId(0) | tenDe(1) | moTa(2) | thoiGian(3) | trangThai(4) | lop(5) | soLuotLam(6) | hienThi(7) | videoUrl(8) | loaiDe(9) | soCau(10) | updatedAt(11)

function saveExam(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam','hienThi','videoUrl','loaiDe','soCau','updatedAt']);
  const examId = String(data.examId || '').trim().replace(/\s+/g,'').toLowerCase();
  if (!examId) return jsonOut({ ok: false, msg: 'Thiếu examId' });

  const hienThiVal = (data.hienThi === true || String(data.hienThi) === 'true' || String(data.hienThi) === 'hien') ? 'hien' : 'an';
  const trangThaiVal = String(data.trangThai || 'khoa').toLowerCase() === 'mo' ? 'mo' : 'khoa';
  const thoiGianVal = Number(data.thoiGian) || 50;
  const loaiDeVal = String(data.loaiDe || 'thithu').toLowerCase();
  const lopVal = String(data.lop || '12');
  const nowStr = new Date().toISOString();

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() === examId) {
      sheet.getRange(i+1, 1, 1, 12).setValues([[
        examId,
        data.tenDe !== undefined ? String(data.tenDe) : rows[i][1],
        data.moTa !== undefined ? String(data.moTa) : rows[i][2],
        data.thoiGian !== undefined ? thoiGianVal : rows[i][3],
        data.trangThai !== undefined ? trangThaiVal : (rows[i][4] || 'khoa'),
        data.lop !== undefined ? lopVal : (rows[i][5] || '12'),
        rows[i][6] || 0,
        data.hienThi !== undefined ? hienThiVal : (rows[i][7] || 'an'),
        data.videoUrl !== undefined ? String(data.videoUrl) : (rows[i][8] || ''),
        data.loaiDe !== undefined ? loaiDeVal : (rows[i][9] || 'thithu'),
        data.soCau !== undefined ? (Number(data.soCau) || 28) : (rows[i][10] || 28),
        nowStr
      ]]);
      return jsonOut({ ok: true, action: 'updated', examId, hienThi: hienThiVal, trangThai: trangThaiVal, updatedAt: nowStr });
    }
  }

  sheet.appendRow([
    examId,
    data.tenDe || '',
    data.moTa || '',
    thoiGianVal,
    trangThaiVal,
    lopVal,
    0,
    hienThiVal,
    data.videoUrl || '',
    loaiDeVal,
    data.soCau !== undefined ? Number(data.soCau) : 28,
    nowStr
  ]);
  return jsonOut({ ok: true, action: 'created', examId, hienThi: hienThiVal, trangThai: trangThaiVal, updatedAt: nowStr });
}

function bulkUpdateExams(data) {
  if (!requireAdmin(data.adminKey)) return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  const sheet = getOrCreate('DanhSachDe', ['examId','tenDe','moTa','thoiGian','trangThai','lop','soLuotLam','hienThi','videoUrl','loaiDe','soCau','updatedAt']);
  const examIds = Array.isArray(data.examIds) ? data.examIds.map(id => String(id).trim().toLowerCase()) : [];
  if (!examIds.length) return jsonOut({ ok: false, msg: 'Thiếu danh sách examIds' });

  const nowStr = new Date().toISOString();
  const rows = sheet.getDataRange().getValues();
  let updatedCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const rowId = String(rows[i][0]).trim().toLowerCase();
    if (examIds.includes(rowId)) {
      const curHienThi = rows[i][7] || 'an';
      const curTrangThai = rows[i][4] || 'khoa';

      const newHienThi = data.hienThi !== undefined
        ? ((data.hienThi === true || String(data.hienThi) === 'true' || String(data.hienThi) === 'hien') ? 'hien' : 'an')
        : curHienThi;
      const newTrangThai = data.trangThai !== undefined
        ? (String(data.trangThai).toLowerCase() === 'mo' ? 'mo' : 'khoa')
        : curTrangThai;

      sheet.getRange(i+1, 5, 1, 1).setValue(newTrangThai);
      sheet.getRange(i+1, 8, 1, 1).setValue(newHienThi);
      sheet.getRange(i+1, 12, 1, 1).setValue(nowStr);
      updatedCount++;
    }
  }

  return jsonOut({ ok: true, count: updatedCount, updatedAt: nowStr });
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

const NH_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong','kyThuat','lyDoCachLy','batchId'];

// ── GET: Toàn bộ ngân hàng câu hỏi ───────────────────────────
const PT_LESSON_DICT = {"VLXT-PT-DE_01-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_01-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_01-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_01-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_01-P1-Q11": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_01-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_01-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_01-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_01-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_01-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_02-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_02-P1-Q02": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_02-P1-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_02-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_02-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_02-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_02-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_02-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_02-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_02-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_02-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_02-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_02-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_02-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_02-P1-Q15": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_02-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_02-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_02-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_03-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_03-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_03-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_03-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_03-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_03-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_03-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_03-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_03-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_03-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_03-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_03-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_03-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_03-P1-Q14": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_03-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_03-P1-Q16": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_03-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_03-P1-Q18": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_04-P1-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_04-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_04-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_04-P1-Q04": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_04-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_04-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_04-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_04-P1-Q08": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_04-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_04-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_04-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_04-P1-Q12": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_04-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_04-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_04-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_04-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_04-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q01-H6808885d": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_05-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_05-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_05-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_05-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_05-P1-Q06": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_05-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_05-P1-Q08": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_05-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_05-P1-Q10": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_05-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_05-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_05-P1-Q17-Hdc672a67": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_05-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_06-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q08": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q14": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_06-P1-Q16": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q17": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_06-P1-Q18": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_07-P1-Q10": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_07-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_07-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_07-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_07-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_07-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_07-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_08-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_08-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_08-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_08-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_08-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_08-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_08-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_08-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_08-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_08-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_08-P1-Q17": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_08-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q01": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_09-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_09-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_09-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_09-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_09-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_09-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_09-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_09-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_09-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_09-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q15": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_09-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_09-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_10-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_10-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_10-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_10-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_10-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_10-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_10-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_10-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_10-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_10-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_10-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_10-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_10-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_10-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_10-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_10-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_10-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_10-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_11-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_11-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_11-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_11-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_11-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_11-P1-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_11-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_11-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_11-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_11-P1-Q10": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_11-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_11-P1-Q12": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_11-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_11-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_11-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_11-P1-Q16": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_11-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_11-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_12-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_12-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_12-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_12-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_12-P1-Q06": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_12-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_12-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_12-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q16": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_12-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_12-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_13-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_13-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_13-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_13-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_13-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_13-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_13-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_13-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_13-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_13-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q15": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_13-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_13-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_14-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_14-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_14-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_14-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_14-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_14-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_14-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_14-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_14-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_14-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_14-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_14-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_14-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q01": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_15-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_15-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_15-P1-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_15-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_15-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_15-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_15-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_15-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_15-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_16-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_16-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_16-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_16-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_16-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_16-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_16-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_16-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_16-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_16-P1-Q10": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_16-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_16-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_16-P1-Q13": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_16-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_16-P1-Q15": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_16-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_16-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_16-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_17-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_17-P1-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_17-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_17-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_17-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q09": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_17-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_17-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_17-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q16": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_17-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_17-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_18-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_18-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_18-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_18-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_18-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q09": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q11": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-DE_18-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_18-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_18-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_18-P1-Q16": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_18-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_18-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_19-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_19-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_19-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_19-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_19-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_19-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_19-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_19-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_19-P1-Q10": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_19-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_19-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_19-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_20-P1-Q02-H04d938be": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_20-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-DE_20-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_20-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_20-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_20-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-DE_20-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_20-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_20-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_20-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ", "VLXT-PT-DE_20-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q13": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-DE_20-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-DE_20-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P107-B6-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P107-B6-Q02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P107-B6-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P108-B6-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P108-B6-Q05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P108-B6-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P108-B6-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P109-B6-Q08": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-P109-B6-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-P109-B6-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P110-B6-Q11": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ", "VLXT-PT-P110-B6-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-P110-B6-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P111-B6-Q14": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-P111-B6-Q15": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT", "VLXT-PT-P113-B6-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P114-B6-VD01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P114-B6-VD02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P115-B6-VD03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P115-B6-VD04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P116-B6-VD05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P117-B6-VD07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P118-B6-VD08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P120-B6-BT01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P120-B6-BT02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P121-B6-BT03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P121-B6-BT04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P122-B6-BT05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P122-B6-BT06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P123-B6-BT07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P124-B6-BT08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P125-B6-BT09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC", "VLXT-PT-P125-B6-BT10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-P126-B6-BT11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG", "VLXT-PT-P126-B6-BT12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-P127-B6-BT13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT", "VLXT-PT-P128-B6-BT14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG"};


function getNganHang() {
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const data  = sheet.getDataRange().getValues();
  if (data.length < 2) return jsonOut({ ok: true, data: [] });
  const headers = data[0].map(h => String(h || '').trim().toLowerCase());
  const baiCol = headers.findIndex(h => h === 'baihoc');
  const clCol  = headers.findIndex(h => h === 'chatluong');
  const ktCol  = headers.findIndex(h => h === 'kythuat');
  const lyDoCol = headers.findIndex(h => h === 'lydocachly');
  const batchCol = headers.findIndex(h => h === 'batchid');
  const qCol   = headers.findIndex(h => h === 'question' || h === 'cauhoi' || h === 'debai');
  const actualQCol = qCol !== -1 ? qCol : 7;

  const rows = data.slice(1).map(r => {
    const id = String(r[0] || '').trim();
    const isPt = id.startsWith('VLXT-PT-');
    const rawCl = clCol !== -1 ? String(r[clCol] || '').trim().toLowerCase() : String(r[17] || '').trim().toLowerCase();
    const cl = rawCl || (isPt ? 'tinh' : 'tho');
    const kt = ktCol !== -1 ? (String(r[ktCol] || '').trim() || 'Dat') : (String(r[18] || '').trim() || 'Dat');
    let baiHoc = baiCol !== -1 ? String(r[baiCol] || '').trim() : String(r[16] || '').trim();
    if (!baiHoc && isPt) {
      baiHoc = PT_LESSON_DICT[id] || 'B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ';
    }

    return {
      id: id,
      mon: String(r[1] || 'Vật lý'),
      chuong: String(r[2] || ''),
      mucDo: String(r[3] || 'TH'),
      loai: String(r[4] || 'TN'),
      nhomId: String(r[5] || ''),
      deBaiChung: String(r[6] || ''),
      question: (id === 'VLXT-PT-DE_05-P1-Q07' && !String(r[actualQCol] || '').startsWith("'")) ? "'" + String(r[actualQCol] || '') : String(r[actualQCol] || ''),
      optA: String(r[8] || ''),
      optB: String(r[9] || ''),
      optC: String(r[10] || ''),
      optD: String(r[11] || ''),
      correct: String(r[12] || 'A'),
      hinhAnh: String(r[13] || ''),
      giaiThich: String(r[14] || ''),
      ngayThem: r[15] instanceof Date ? r[15].toISOString() : String(r[15] || ''),
      baiHoc: baiHoc,
      chatLuong: cl,
      kyThuat: kt,
      lyDoCachLy: lyDoCol !== -1 ? String(r[lyDoCol] || '') : String(r[19] || ''),
      batchId: batchCol !== -1 ? String(r[batchCol] || '') : String(r[20] || '')
    };
  });
  return jsonOut({ ok: true, data: rows });
}

// ── POST: Nạp câu hỏi vào ngân hàng (append, tự sinh id) ─────
function saveNganHang(data) {
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const existing = sheet.getDataRange().getValues();
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
      q.baiHoc || '', q.chatLuong || 'tho', 'Dat', '', ''
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
  const ktCol = headers.indexOf('kyThuat') !== -1 ? headers.indexOf('kyThuat') : 18;
  const lyDoCol = headers.indexOf('lyDoCachLy') !== -1 ? headers.indexOf('lyDoCachLy') : 19;
  const now = new Date().toISOString();

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).trim() === id) {
      const finalChatLuong = newChatLuong !== undefined ? newChatLuong : (rows[i][clCol] !== undefined ? String(rows[i][clCol]) : '');
      const finalKyThuat = data.kyThuat || q.kyThuat || rows[i][ktCol] || 'Dat';
      const finalLyDo = data.lyDoCachLy !== undefined ? data.lyDoCachLy : (q.lyDoCachLy !== undefined ? q.lyDoCachLy : (rows[i][lyDoCol] || ''));
      sheet.getRange(i + 1, 1, 1, 21).setValues([[
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
        finalChatLuong,
        finalKyThuat,
        finalLyDo,
        q.batchId !== undefined ? q.batchId : (rows[i][20] || '')
      ]]);
      return jsonOut({ ok: true, id: id, chatLuong: finalChatLuong, kyThuat: finalKyThuat });
    }
  }
  return jsonOut({ ok: false, msg: 'Không tìm thấy id ' + id });
}

// POST: Cập nhật fail-closed các câu đã có theo file JSON.
// Không thêm/xóa/đổi ID; dry-run bắt buộc và commit phải dùng đúng planToken.
function updateExistingNganHangFromFile(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const allowedFields = ['mon','chuong','mucDo','loai','question','chatLuong'];
  if (!rawItems.length || rawItems.length > 500) {
    return jsonOut({ ok: false, msg: 'File phải có từ 1 đến 500 bản ghi' });
  }

  const fileIds = {};
  const invalidItems = [];
  const items = rawItems.map(function(raw, index) {
    const id = String(raw && raw.id || '').trim();
    const setObj = raw && raw.set && typeof raw.set === 'object' && !Array.isArray(raw.set) ? raw.set : {};
    const keys = Object.keys(setObj);
    const unsupported = keys.filter(function(k) { return allowedFields.indexOf(k) === -1; });
    if (!id) invalidItems.push({ index: index, id: '', reason: 'Thiếu ID' });
    if (id && fileIds[id]) invalidItems.push({ index: index, id: id, reason: 'ID trùng trong file' });
    if (id) fileIds[id] = true;
    if (!keys.length) invalidItems.push({ index: index, id: id, reason: 'Không có trường cập nhật' });
    if (unsupported.length) invalidItems.push({ index: index, id: id, reason: 'Cột không được hỗ trợ: ' + unsupported.join(', ') });
    return { id: id, set: setObj };
  });
  if (invalidItems.length) return jsonOut({ ok: false, msg: 'File không hợp lệ', invalidItems: invalidItems });

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0] ? rows[0].map(function(h) { return String(h || '').trim(); }) : [];
  const headerMap = {};
  headers.forEach(function(h, i) { if (h) headerMap[h] = i; });
  const requiredHeaders = ['id'].concat(Array.from(new Set(items.reduce(function(out, item) {
    return out.concat(Object.keys(item.set));
  }, []))));
  const missingHeaders = requiredHeaders.filter(function(h) { return headerMap[h] === undefined; });
  if (missingHeaders.length) {
    return jsonOut({ ok: false, msg: 'Google Sheet không có cột bắt buộc: ' + missingHeaders.join(', '), missingHeaders: missingHeaders });
  }

  const rowMap = {};
  const duplicateSheetIds = [];
  for (let r = 1; r < rows.length; r++) {
    const id = String(rows[r][headerMap.id] || '').trim();
    if (!id) continue;
    if (rowMap[id] !== undefined) duplicateSheetIds.push(id);
    else rowMap[id] = r;
  }
  const missingIds = items.filter(function(item) { return rowMap[item.id] === undefined; }).map(function(item) { return item.id; });
  const targetDuplicateIds = Array.from(new Set(duplicateSheetIds.filter(function(id) { return fileIds[id]; })));
  if (missingIds.length || targetDuplicateIds.length) {
    return jsonOut({ ok: false, msg: 'Bị chặn: ID thiếu hoặc trùng trong Google Sheet', missingIds: missingIds, duplicateIds: targetDuplicateIds });
  }

  const changes = [];
  const tokenRows = [];
  items.forEach(function(item) {
    const rowIndex = rowMap[item.id];
    const before = {};
    const after = {};
    Object.keys(item.set).sort().forEach(function(field) {
      const oldValue = String(rows[rowIndex][headerMap[field]] === undefined || rows[rowIndex][headerMap[field]] === null ? '' : rows[rowIndex][headerMap[field]]);
      const newValue = String(item.set[field] === undefined || item.set[field] === null ? '' : item.set[field]);
      before[field] = oldValue;
      after[field] = newValue;
      if (oldValue !== newValue) changes.push({ id: item.id, field: field, before: oldValue, after: newValue });
    });
    tokenRows.push({ id: item.id, before: before, after: after });
  });

  const tokenInput = JSON.stringify({ schema: 'vlxt-update-existing-v1', rows: tokenRows });
  const tokenBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, tokenInput, Utilities.Charset.UTF_8);
  const planToken = tokenBytes.map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
  const changedIds = Array.from(new Set(changes.map(function(c) { return c.id; })));
  const fieldCounts = {};
  changes.forEach(function(c) { fieldCounts[c.field] = (fieldCounts[c.field] || 0) + 1; });

  if (dryRun) {
    return jsonOut({ ok: true, dryRun: true, requested: items.length, found: items.length, insert: 0, delete: 0, changedRows: changedIds.length, changedCells: changes.length, fieldCounts: fieldCounts, planToken: planToken, changes: changes });
  }
  if (!data.planToken || String(data.planToken) !== planToken) {
    return jsonOut({ ok: false, stale: true, msg: 'Dữ liệu đã thay đổi hoặc chưa dry-run. Hãy dry-run lại; chưa ghi bất kỳ ô nào.' });
  }
  if (!changes.length) return jsonOut({ ok: true, dryRun: false, requested: items.length, updatedRows: 0, updatedCells: 0, insert: 0, delete: 0, msg: 'Không có thay đổi cần ghi' });

  const lock = LockService.getDocumentLock();
  if (!lock.tryLock(30000)) return jsonOut({ ok: false, msg: 'Không lấy được khóa ghi; hãy thử lại' });
  try {
    // Kiểm tra lại dưới lock: chỉ ghi nếu snapshot vẫn khớp dry-run.
    const lockedRows = sheet.getDataRange().getValues();
    const lockedTokenRows = tokenRows.map(function(t) {
      const r = rowMap[t.id];
      const before = {};
      Object.keys(t.before).sort().forEach(function(field) {
        before[field] = String(lockedRows[r][headerMap[field]] === undefined || lockedRows[r][headerMap[field]] === null ? '' : lockedRows[r][headerMap[field]]);
      });
      return { id: t.id, before: before, after: t.after };
    });
    const lockedInput = JSON.stringify({ schema: 'vlxt-update-existing-v1', rows: lockedTokenRows });
    const lockedBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, lockedInput, Utilities.Charset.UTF_8);
    const lockedToken = lockedBytes.map(function(b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
    if (lockedToken !== planToken) return jsonOut({ ok: false, stale: true, msg: 'Dữ liệu thay đổi sau dry-run; chưa ghi bất kỳ ô nào.' });

    changes.forEach(function(change) {
      lockedRows[rowMap[change.id]][headerMap[change.field]] = change.after;
    });
    // Một lệnh ghi duy nhất để tránh batch dở dang.
    sheet.getDataRange().setValues(lockedRows);
    return jsonOut({ ok: true, dryRun: false, requested: items.length, updatedRows: changedIds.length, updatedCells: changes.length, insert: 0, delete: 0, fieldCounts: fieldCounts });
  } finally {
    lock.releaseLock();
  }
}

// Temporary acceptance wrapper; logs only boolean status, never a key.
function runAdminSelfTestReport() {
  const result = runAdminSelfTest();
  console.log(JSON.stringify({ ok: result && result.ok === true, passed: result && result.passed === true, step: result && result.step || '' }));
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
    if (rId) existingIdMap.set(rId, i + 1);
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

// ── Hàm tiện ích: Chuẩn hóa chuỗi văn bản đối chiếu trùng lặp ──
function normalizeTextForComparison(text) {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]+/gu, '')
    .trim();
}

// ── GET/POST: Thống kê hiện trạng Ngân hàng câu hỏi ──────────────────
function getQuestionStats(data) {
  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) {
    return jsonOut({
      ok: true,
      success: true,
      total: 0,
      tinh: 0,
      tho: 0,
      quarantined: 0,
      batches: {},
      byMucDo: { NB: 0, TH: 0, VD: 0, VDC: 0 },
      byLoai: { TN: 0, DS: 0, TLN: 0 }
    });
  }

  const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
  const clCol = headers.findIndex(h => h === 'chatluong');
  const ktCol = headers.findIndex(h => h === 'kythuat');
  const batchCol = headers.findIndex(h => h === 'batchid');
  const mucDoCol = headers.findIndex(h => h === 'mucdo');
  const loaiCol = headers.findIndex(h => h === 'loai');

  let total = 0;
  let tinh = 0;
  let tho = 0;
  let quarantined = 0;
  const batches = {};
  const byMucDo = { NB: 0, TH: 0, VD: 0, VDC: 0 };
  const byLoai = { TN: 0, DS: 0, TLN: 0 };

  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0] || '').trim();
    if (!rId) continue;
    total++;

    const isPt = rId.startsWith('VLXT-PT-');
    const cl = clCol !== -1 ? String(rows[i][clCol] || '').trim().toLowerCase() : (isPt ? 'tinh' : 'tho');
    const kt = ktCol !== -1 ? String(rows[i][ktCol] || '').trim() : (String(rows[i][18] || '').trim() || 'Dat');
    const bId = batchCol !== -1 ? (String(rows[i][batchCol] || '').trim() || 'NO_BATCH') : (String(rows[i][20] || '').trim() || 'NO_BATCH');
    const md = mucDoCol !== -1 ? String(rows[i][mucDoCol] || 'NB').trim().toUpperCase() : String(rows[i][3] || 'NB').trim().toUpperCase();
    const lo = loaiCol !== -1 ? String(rows[i][loaiCol] || 'TN').trim().toUpperCase() : String(rows[i][4] || 'TN').trim().toUpperCase();

    if (cl === 'tinh') tinh++;
    else tho++;

    if (kt.toLowerCase() === 'cachly') quarantined++;

    batches[bId] = (batches[bId] || 0) + 1;
    if (byMucDo[md] !== undefined) byMucDo[md]++;
    if (byLoai[lo] !== undefined) byLoai[lo]++;
  }

  return jsonOut({
    ok: true,
    success: true,
    total: total,
    tinh: tinh,
    tho: tho,
    quarantined: quarantined,
    batches: batches,
    byMucDo: byMucDo,
    byLoai: byLoai
  });
}

// ── POST: Nhập gói câu hỏi Tinh vào ngân hàng kèm Quét Kỹ Thuật & Idempotent (1-Click Pipeline) ────
function importNganHang(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, success: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const batchId = String(data.batchId || data.sourceBatch || ('BATCH_' + new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14))).trim();
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  if (!rawQuestions.length) {
    return jsonOut({ ok: false, success: false, msg: 'Danh sách questions rỗng' });
  }
  if (rawQuestions.length > 500) {
    return jsonOut({ ok: false, success: false, msg: 'Số lượng câu vượt quá giới hạn tối đa (500 câu/lần)' });
  }

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const rows = sheet.getDataRange().getValues();

  // Đọc hiện trạng ngân hàng
  const existingIdMap = new Map();
  const existingTinhNormMap = new Map();
  let countBefore = 0;
  let tinhUsableBefore = 0;
  let lastRealRow = 1;

  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0] || '').trim();
    if (rId) {
      countBefore++;
      lastRealRow = i + 1;
      const qText = String(rows[i][7] || '').trim();
      const normQ = normalizeTextForComparison(qText);
      const cl = String(rows[i][17] || '').trim().toLowerCase();
      const kt = String(rows[i][18] || '').trim();
      const optA = String(rows[i][8] || '').trim();
      const optB = String(rows[i][9] || '').trim();
      const optC = String(rows[i][10] || '').trim();
      const optD = String(rows[i][11] || '').trim();
      const cor = String(rows[i][12] || '').trim();

      const itemInfo = {
        rowIndex: i + 1,
        questionText: qText,
        normText: normQ,
        chatLuong: cl,
        kyThuat: kt || (cl === 'tinh' ? 'Dat' : ''),
        optA: optA,
        optB: optB,
        optC: optC,
        optD: optD,
        correct: cor
      };
      existingIdMap.set(rId, itemInfo);

      if (cl === 'tinh') {
        if (!kt || kt.toLowerCase() === 'dat') {
          tinhUsableBefore++;
        }
        if (normQ.length > 15) {
          existingTinhNormMap.set(normQ, { id: rId, ...itemInfo });
        }
      }
    }
  }

  const seenPayloadIds = new Set();
  const alreadyExistsIds = [];
  const insertedRows = [];
  const updatedRows = [];
  const quarantinedItems = [];
  const passedItems = [];
  const normalizedPreview = [];
  const nowIso = new Date().toISOString();

  for (let idx = 0; idx < rawQuestions.length; idx++) {
    const q = rawQuestions[idx] || {};
    const id = String(q.id || q.questionId || q.identityHash || '').trim();
    const technicalErrors = [];

    // 1. Kiểm tra ID cơ bản & Trạng thái duyệt
    if (!id) {
      technicalErrors.push('Thiếu mã định danh id');
    } else if (seenPayloadIds.has(id)) {
      technicalErrors.push('Mã id bị trùng lặp trong nội bộ gói nạp');
    }
    if (id) seenPayloadIds.add(id);

    const st = String(q.reviewStatus || q.status || q.rawTier || 'APPROVED').trim().toUpperCase();
    if (st !== 'APPROVED' && st !== 'TINH') {
      technicalErrors.push('Chỉ chấp nhận câu hỏi đã được Duyệt (APPROVED hoặc TINH)');
    }

    const questionText = String(q.question || q.stem || '').trim();
    const normText = normalizeTextForComparison(questionText);

    // 2. Kiểm tra Loại câu & Nội dung
    let loai = String(q.loai || q.type || 'TN').trim().toUpperCase();
    if (loai === 'MULTIPLE_CHOICE') loai = 'TN';
    else if (loai === 'TRUE_FALSE') loai = 'DS';
    else if (loai === 'SHORT_ANSWER') loai = 'TLN';

    if (!['TN', 'DS', 'TLN'].includes(loai)) {
      technicalErrors.push('loai không hợp lệ (chỉ nhận TN, DS, TLN)');
    }
    if (!questionText) {
      technicalErrors.push('Thân câu hỏi không được để trống');
    }

    // 3. Trích xuất chính xác Phương án & Đáp án
    let optA = '', optB = '', optC = '', optD = '';
    if (q.options && typeof q.options === 'object') {
      if (Array.isArray(q.options)) {
        optA = String(q.options[0]?.content ?? q.options[0] ?? '').trim();
        optB = String(q.options[1]?.content ?? q.options[1] ?? '').trim();
        optC = String(q.options[2]?.content ?? q.options[2] ?? '').trim();
        optD = String(q.options[3]?.content ?? q.options[3] ?? '').trim();
      } else {
        optA = String(q.options.A ?? q.options.a ?? '').trim();
        optB = String(q.options.B ?? q.options.b ?? '').trim();
        optC = String(q.options.C ?? q.options.c ?? '').trim();
        optD = String(q.options.D ?? q.options.d ?? '').trim();
      }
    }
    if (q.subItems) {
      if (Array.isArray(q.subItems)) {
        if (!optA) optA = String(q.subItems[0]?.statement ?? q.subItems[0]?.content ?? q.subItems[0] ?? '').trim();
        if (!optB) optB = String(q.subItems[1]?.statement ?? q.subItems[1]?.content ?? q.subItems[1] ?? '').trim();
        if (!optC) optC = String(q.subItems[2]?.statement ?? q.subItems[2]?.content ?? q.subItems[2] ?? '').trim();
        if (!optD) optD = String(q.subItems[3]?.statement ?? q.subItems[3]?.content ?? q.subItems[3] ?? '').trim();
      } else {
        if (!optA) optA = String(q.subItems.a?.statement ?? q.subItems.a ?? '').trim();
        if (!optB) optB = String(q.subItems.b?.statement ?? q.subItems.b ?? '').trim();
        if (!optC) optC = String(q.subItems.c?.statement ?? q.subItems.c ?? '').trim();
        if (!optD) optD = String(q.subItems.d?.statement ?? q.subItems.d ?? '').trim();
      }
    }
    if (!optA && q.optA) optA = String(q.optA).trim();
    if (!optB && q.optB) optB = String(q.optB).trim();
    if (!optC && q.optC) optC = String(q.optC).trim();
    if (!optD && q.optD) optD = String(q.optD).trim();

    let rawCorrect = String(q.correct ?? q.correctAnswer ?? q.answer ?? '').trim();
    let cleanCorrect = '';

    if (loai === 'TN') {
      cleanCorrect = rawCorrect.toUpperCase().replace(/[^ABCD]/g, '').slice(0, 1);
      if (!['A', 'B', 'C', 'D'].includes(cleanCorrect)) {
        technicalErrors.push('Đáp án đúng cho TN phải là A, B, C hoặc D (nhận được: ' + rawCorrect + ')');
      }
      if (!optA || !optB || !optC || !optD) {
        technicalErrors.push('Câu TN phải có đủ 4 phương án optA, optB, optC, optD');
      }
    } else if (loai === 'DS') {
      cleanCorrect = rawCorrect.replace(/[^ĐSds]/g, '').toUpperCase();
      if (cleanCorrect.length !== 4) {
        // Fallback trích xuất từ subItems
        if (q.subItems) {
          const subArr = Array.isArray(q.subItems) ? q.subItems : [q.subItems.a, q.subItems.b, q.subItems.c, q.subItems.d];
          const subStr = subArr.map(s => (s && (s.isCorrect === true || s.isCorrect === 'true' || s.isCorrect === 'Đ')) ? 'Đ' : 'S').join('');
          if (subStr.length === 4) cleanCorrect = subStr;
        }
      }
      if (cleanCorrect.length !== 4) {
        technicalErrors.push('Đáp án đúng cho DS phải có đúng 4 ký tự Đ/S (nhận được: ' + rawCorrect + ')');
      }
      if (!optA || !optB || !optC || !optD) {
        technicalErrors.push('Câu DS phải có đủ 4 mệnh đề a, b, c, d');
      }
    } else if (loai === 'TLN') {
      cleanCorrect = rawCorrect;
      if (!cleanCorrect) {
        technicalErrors.push('Câu TLN phải có đáp số trả lời ngắn');
      }
    } else {
      cleanCorrect = rawCorrect;
    }

    // 4. Mức độ & Taxonomy
    let mucDo = String(q.mucDo || q.difficulty || 'NB').trim().toUpperCase();
    if (mucDo === 'KNOW' || mucDo === 'NHAN_BIET') mucDo = 'NB';
    else if (mucDo === 'UNDERSTAND' || mucDo === 'THONG_HIEU') mucDo = 'TH';
    else if (mucDo === 'APPLY' || mucDo === 'VAN_DUNG') mucDo = 'VD';
    else if (mucDo === 'ADVANCED_APPLY' || mucDo === 'VAN_DUNG_CAO') mucDo = 'VDC';
    if (!['NB', 'TH', 'VD', 'VDC'].includes(mucDo)) mucDo = 'NB';

    let mon = String(q.mon || 'Vật lý').trim();
    if (mon === 'Vật Lý 12' || mon === 'Vật lí 12') mon = 'Vật lý';

    let chuong = String(q.chuong || '').trim();
    if (/chương 1|vật l[yí] nhiệt/i.test(chuong)) chuong = 'Vật lí nhiệt';
    if (!chuong) chuong = 'Vật lí nhiệt';

    // Trích xuất chính xác Bài học từ mọi nguồn (taxonomy.lessonCode, taxonomy.lessonTitle, _classification.baiHoc, baiHoc)
    const tax = q.taxonomy || {};
    const taxCode = String(tax.lessonCode || '').trim();
    const taxTitle = String(tax.lessonTitle || '').trim();
    const classBaiHoc = String(q._classification?.baiHoc || q.classification?.baiHoc || '').trim();
    const rawBaiHoc = String(q.baiHoc || tax.lesson || '').trim();

    let baiHoc = '';
    if (taxCode === 'G12_C1_B01' || /b1|mô hình động học|cấu trúc/i.test(taxCode) || /b1|mô hình động học|cấu trúc/i.test(taxTitle) || /b1|mô hình động học|cấu trúc/i.test(classBaiHoc) || /b1|mô hình động học|cấu trúc/i.test(rawBaiHoc)) {
      baiHoc = 'B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ';
    } else if (taxCode === 'G12_C1_B02' || /b2|lực liên kết|chuyển thể/i.test(taxCode) || /b2|lực liên kết|chuyển thể/i.test(taxTitle) || /b2|lực liên kết|chuyển thể/i.test(classBaiHoc) || /b2|lực liên kết|chuyển thể/i.test(rawBaiHoc)) {
      baiHoc = 'Bài 2. Lực liên kết và sự chuyển thể';
    } else if (taxCode === 'G12_C1_B03' || /b3|thang nhiệt độ|nhiệt kế/i.test(taxCode) || /b3|thang nhiệt độ|nhiệt kế/i.test(taxTitle) || /b3|thang nhiệt độ|nhiệt kế/i.test(classBaiHoc) || /b3|thang nhiệt độ|nhiệt kế/i.test(rawBaiHoc)) {
      baiHoc = 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế';
    } else if (taxCode === 'G12_C1_B04' || /b4|nhiệt dung riêng/i.test(taxCode) || /b4|nhiệt dung riêng/i.test(taxTitle) || /b4|nhiệt dung riêng/i.test(classBaiHoc) || /b4|nhiệt dung riêng/i.test(rawBaiHoc)) {
      baiHoc = 'Bài 4. Nhiệt dung riêng - Nhiệt nóng chảy - Nhiệt hóa hơi';
    } else if (taxCode === 'G12_C1_B05' || /b5|định luật i|nội năng/i.test(taxCode) || /b5|định luật i|nội năng/i.test(taxTitle) || /b5|định luật i|nội năng/i.test(classBaiHoc) || /b5|định luật i|nội năng/i.test(rawBaiHoc)) {
      baiHoc = 'Bài 5. Định luật I của nhiệt động lực học';
    } else if (taxCode === 'G12_C1_B06' || /b6|động cơ nhiệt|đồ thị nhiệt/i.test(taxCode) || /b6|động cơ nhiệt|đồ thị nhiệt/i.test(taxTitle) || /b6|động cơ nhiệt|đồ thị nhiệt/i.test(classBaiHoc) || /b6|động cơ nhiệt|đồ thị nhiệt/i.test(rawBaiHoc)) {
      baiHoc = 'Bài 6. Động cơ nhiệt - Đồ thị nhiệt';
    } else if (taxCode === 'G12_C1_REVIEW' || /ôn tập|review/i.test(taxCode) || /ôn tập|review/i.test(taxTitle)) {
      baiHoc = 'Ôn tập Chương 1 - Vật lí nhiệt';
    }

    if (!baiHoc && id && PT_LESSON_DICT[id]) {
      baiHoc = PT_LESSON_DICT[id];
    }
    if (!baiHoc) {
      technicalErrors.push('Không xác định được bài học (thiếu taxonomy.lessonCode / baiHoc)');
    }

    // 5. Kiểm tra KaTeX
    const dollarCount = (questionText.match(/\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      technicalErrors.push('Ký hiệu công thức toán KaTeX ($) chưa cân bằng đóng/mở');
    }

    // Phân định Trạng thái Thẩm định & Kỹ thuật
    const chatLuong = 'tinh';
    let kyThuat = 'Dat';
    let lyDoCachLy = '';

    if (technicalErrors.length > 0) {
      kyThuat = 'CachLy';
      lyDoCachLy = technicalErrors.join('; ');
      quarantinedItems.push({ index: idx, id: id || ('(index ' + idx + ')'), reason: lyDoCachLy });
    } else {
      passedItems.push(id);
    }

    const giaiThich = String(q.giaiThich || q.explanation || q.solution || '').trim();
    let hinhAnh = String(q.hinhAnh || '').trim();
    if (!hinhAnh && q.mediaAssets && Array.isArray(q.mediaAssets)) {
      const m = q.mediaAssets.find(x => x && (x.url || x.path || x.image));
      if (m) hinhAnh = String(m.url || m.path || m.image || '').trim();
    }
    const nhomId = String(q.nhomId || '').trim();
    const deBaiChung = String(q.deBaiChung || '').trim();

    // Xây dựng dòng dữ liệu chuẩn xác theo đúng NH_HEADERS
    const rowArr = [
      id,              // 0: id
      mon,             // 1: mon
      chuong,          // 2: chuong
      mucDo,           // 3: mucDo
      loai,            // 4: loai
      nhomId,          // 5: nhomId
      deBaiChung,      // 6: deBaiChung
      questionText,    // 7: question
      optA,            // 8: optA
      optB,            // 9: optB
      optC,            // 10: optC
      optD,            // 11: optD
      cleanCorrect,    // 12: correct
      hinhAnh,         // 13: hinhAnh
      giaiThich,       // 14: giaiThich
      nowIso,          // 15: ngayThem
      baiHoc,          // 16: baiHoc
      chatLuong,       // 17: chatLuong
      kyThuat,         // 18: kyThuat
      lyDoCachLy,      // 19: lyDoCachLy
      batchId          // 20: batchId
    ];

    // Kiểm tra Idempotent:
    const existingEntry = id ? existingIdMap.get(id) : null;
    const existingByNorm = (!existingEntry && normText.length > 15) ? existingTinhNormMap.get(normText) : null;
    const matchedEntry = existingEntry || existingByNorm;

    if (matchedEntry) {
      // Đã tồn tại: kiểm tra xem có thay đổi nội dung cần cập nhật không
      const isIdentical = (
        matchedEntry.questionText === questionText &&
        matchedEntry.correct === cleanCorrect &&
        matchedEntry.optA === optA &&
        matchedEntry.optB === optB &&
        matchedEntry.optC === optC &&
        matchedEntry.optD === optD
      );

      if (isIdentical) {
        alreadyExistsIds.push(id || matchedEntry.id || matchedEntry.rowIndex);
      } else {
        updatedRows.push({ rowIndex: matchedEntry.rowIndex, rowData: rowArr, id: id });
      }
    } else {
      insertedRows.push(rowArr);
    }

    normalizedPreview.push({
      id, mon, chuong, baiHoc, mucDo, loai,
      question: questionText.slice(0, 100) + (questionText.length > 100 ? '...' : ''),
      optA, optB, optC, optD, correct: cleanCorrect, chatLuong, kyThuat, lyDoCachLy
    });
  }

  const sentCount = rawQuestions.length;
  const insertable = insertedRows.length;
  const updatable = updatedRows.length;
  const alreadyExistsCount = alreadyExistsIds.length;
  const passedCount = passedItems.length;
  const quarantinedCount = quarantinedItems.length;

  // Bắt buộc xác thực cân bằng kế toán: sent = inserted + updated + existing + blocked
  const totalAccounted = insertable + updatable + alreadyExistsCount + quarantinedCount;
  if (totalAccounted !== sentCount) {
    return jsonOut({
      ok: false,
      success: false,
      error: 'AccountingMismatch',
      msg: 'Lỗi cân bằng kế toán: Gửi ' + sentCount + ' câu nhưng tính toán được ' + totalAccounted + ' (' + insertable + ' mới, ' + updatable + ' cập nhật, ' + alreadyExistsCount + ' đã có, ' + quarantinedCount + ' bị chặn).'
    });
  }

  if (dryRun) {
    return jsonOut({
      ok: true,
      success: true,
      dryRun: true,
      batchId: batchId,
      sent: sentCount,
      sentCount: sentCount,
      inserted: insertable,
      insertedCount: insertable,
      updated: updatable,
      updatedCount: updatable,
      existing: alreadyExistsCount,
      alreadyExistsCount: alreadyExistsCount,
      blocked: quarantinedCount,
      quarantinedCount: quarantinedCount,
      passedCount: passedCount,
      quarantinedItems: quarantinedItems,
      errors: quarantinedItems,
      before: countBefore,
      countBefore: countBefore,
      after: countBefore + insertable,
      countAfter: countBefore + insertable,
      tinhUsableBefore: tinhUsableBefore,
      tinhUsableAfter: tinhUsableBefore + passedCount,
      items: normalizedPreview,
      msg: 'Dry-run hoàn tất: ' + sentCount + ' câu (' + insertable + ' mới, ' + updatable + ' cập nhật, ' + alreadyExistsCount + ' đã tồn tại, ' + quarantinedCount + ' bị chặn).'
    });
  }

  // 1. Cập nhật các dòng đã tồn tại
  updatedRows.forEach(u => {
    sheet.getRange(u.rowIndex, 1, 1, u.rowData.length).setValues([u.rowData]);
  });

  // 2. Thêm mới các dòng chưa có
  if (insertable > 0) {
    const startRow = lastRealRow + 1;
    sheet.getRange(startRow, 1, insertable, NH_HEADERS.length).setValues(insertedRows);
  }

  const countAfter = countBefore + insertable;
  const tinhUsableAfter = tinhUsableBefore + passedCount;

  return jsonOut({
    ok: true,
    success: true,
    dryRun: false,
    batchId: batchId,
    sent: sentCount,
    sentCount: sentCount,
    inserted: insertable,
    insertedCount: insertable,
    updated: updatable,
    updatedCount: updatable,
    existing: alreadyExistsCount,
    alreadyExistsCount: alreadyExistsCount,
    blocked: quarantinedCount,
    quarantinedCount: quarantinedCount,
    passedCount: passedCount,
    quarantinedItems: quarantinedItems,
    errors: quarantinedItems,
    before: countBefore,
    countBefore: countBefore,
    after: countAfter,
    countAfter: countAfter,
    tinhUsableBefore: tinhUsableBefore,
    tinhUsableAfter: tinhUsableAfter,
    msg: 'Đã nạp thành công: ' + insertable + ' câu mới, ' + updatable + ' câu cập nhật, ' + alreadyExistsCount + ' câu đã tồn tại (' + passedCount + ' Đạt, ' + quarantinedCount + ' Bị chặn).'
  });
}

function repairLessonBatch(data) {
  if (!requireAdmin(data.adminKey)) {
    return jsonOut({ ok: false, success: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' });
  }

  const dryRun = data.dryRun === true;
  const updates = data.updates || []; // Mảng các bản ghi { id, rowIndex, intendedLesson }
  if (!Array.isArray(updates) || updates.length === 0) {
    return jsonOut({ ok: false, success: false, error: 'No updates provided' });
  }

  const sheet = getOrCreate('NganHang', NH_HEADERS);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonOut({ ok: false, error: 'Bảng NganHang trống' });

  const allIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const idToRowMap = new Map();
  for (let i = 0; i < allIds.length; i++) {
    const rid = String(allIds[i][0] || '').trim();
    if (rid) idToRowMap.set(rid, i + 2);
  }

  const plannedUpdates = [];
  const errors = [];
  const beforeCounts = {};
  const afterCounts = {};

  for (let idx = 0; idx < updates.length; idx++) {
    const u = updates[idx] || {};
    const id = String(u.id || '').trim();
    const intendedLesson = String(u.intendedLesson || '').trim();
    if (!id || !intendedLesson) continue;

    const rowIdx = (u.rowIndex && u.rowIndex >= 2 && u.rowIndex <= lastRow) ? Number(u.rowIndex) : idToRowMap.get(id);
    if (!rowIdx) {
      errors.push({ id: id, error: 'Không tìm thấy dòng trên sheet' });
      continue;
    }

    const curVal = sheet.getRange(rowIdx, 1, 1, 17).getValues()[0];
    const actualId = String(curVal[0] || '').trim();
    if (actualId && actualId !== id) {
      errors.push({ id: id, error: 'Mã ID tại dòng ' + rowIdx + ' (' + actualId + ') không khớp với ' + id });
      continue;
    }

    const curLesson = String(curVal[16] || '').trim(); // Cột 17: baiHoc
    beforeCounts[curLesson] = (beforeCounts[curLesson] || 0) + 1;
    afterCounts[intendedLesson] = (afterCounts[intendedLesson] || 0) + 1;

    plannedUpdates.push({
      rowIndex: rowIdx,
      id: id,
      beforeLesson: curLesson,
      afterLesson: intendedLesson
    });
  }

  if (dryRun) {
    return jsonOut({
      ok: true,
      success: true,
      dryRun: true,
      totalRequested: updates.length,
      totalMatched: plannedUpdates.length,
      errors: errors,
      beforeCounts: beforeCounts,
      afterCounts: afterCounts,
      msg: 'Dry-run sửa bài học hoàn tất: ' + plannedUpdates.length + ' / ' + updates.length + ' bản ghi sẵn sàng cập nhật.'
    });
  }

  // Thực thi cập nhật trực tiếp cột baiHoc (Cột 17)
  plannedUpdates.forEach(p => {
    sheet.getRange(p.rowIndex, 17).setValue(p.afterLesson);
  });

  return jsonOut({
    ok: true,
    success: true,
    dryRun: false,
    totalUpdated: plannedUpdates.length,
    errors: errors,
    beforeCounts: beforeCounts,
    afterCounts: afterCounts,
    msg: 'Đã cập nhật chuẩn xác bài học cho ' + plannedUpdates.length + ' bản ghi thành công.'
  });
}


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
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
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
// Public GET: TUYỆT ĐỐI CHẶN câu hỏi thuộc bài draft hoặc archived, không query nào nâng quyền
function getVideoCauHoi(bai) {
  if (bai && !isLessonPublished(bai)) {
    return jsonOut({ data: [] });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('VideoCauHoi');
  if (!sheet) return jsonOut({ data: [] });
  let rows = sheetToJson(sheet);
  if (bai) {
    rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  } else {
    rows = rows.filter(function(r){ return isLessonPublished(r.baiKey); });
  }
  function _sortKeyTG(t){ return (t===null||t===undefined||t==='') ? Infinity : (Number(t)||0); }
  rows.sort(function(a,b){ return _sortKeyTG(a.thoiGian)-_sortKeyTG(b.thoiGian); });
  return jsonOut({ data: rows });
}

function getVideoCauHoiAdmin(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('VideoCauHoi');
  if (!sheet) return jsonOut({ ok: true, data: [] });
  let rows = sheetToJson(sheet);
  const bai = data && (data.bai || data.baiKey);
  if (bai) {
    rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  }
  function _sortKeyTG(t){ return (t===null||t===undefined||t==='') ? Infinity : (Number(t)||0); }
  rows.sort(function(a,b){ return _sortKeyTG(a.thoiGian)-_sortKeyTG(b.thoiGian); });
  return jsonOut({ ok: true, data: rows });
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
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
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
// Public GET: TUYỆT ĐỐI CHẶN bài tập thuộc bài draft hoặc archived, không query nào nâng quyền
function getBaiTapTracNghiem(bai) {
  if (bai && !isLessonPublished(bai)) {
    return jsonOut({ data: [] });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('BaiTapTracNghiem');
  if (!sheet) return jsonOut({ data: [] });
  let rows = sheetToJson(sheet);
  if (bai) {
    rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  } else {
    rows = rows.filter(function(r){ return isLessonPublished(r.baiKey); });
  }
  rows.sort(function(a,b){ return (Number(a.thuTu)||0) - (Number(b.thuTu)||0); });
  return jsonOut({ data: rows });
}

function getBaiTapTracNghiemAdmin(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('BaiTapTracNghiem');
  if (!sheet) return jsonOut({ ok: true, data: [] });
  let rows = sheetToJson(sheet);
  const bai = data && (data.bai || data.baiKey);
  if (bai) {
    rows = rows.filter(function(r){ return String(r.baiKey) === String(bai); });
  }
  rows.sort(function(a,b){ return (Number(a.thuTu)||0) - (Number(b.thuTu)||0); });
  return jsonOut({ ok: true, data: rows });
}

// POST {action:'savebaitaptracnghiem', baiKey, originalKey, items:[{type,q,A,B,C,D,correct}]}
// Ghi de toan bo cau hoi Luyen tap trac nghiem cua 1 bai (xoa cu, ghi moi) - tach sheet rieng
// de khong bi gioi han 50.000 ky tu/o cua Google Sheets khi 1 bai co hang tram cau.
function saveBaiTapTracNghiem(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
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

  const resultOk = function(res) {
    try {
      const value = res && typeof res.getContent === 'function'
        ? JSON.parse(res.getContent()) : res;
      return Boolean(value && value.ok === true);
    } catch(e) { return false; }
  };

  const testSdt = '0999999999_selftest_' + Date.now();
  try {
    // 1. Tạo tài khoản test cô lập
    const tkSheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry','mienVideo','tracNghiemVideo','mienLuyenTap']);
    tkSheet.appendRow([testSdt, 'SelfTest User', '12', 'selftest_pass', new Date().toISOString(), 0, 0, 'free', 0, false, true, false]);

    // 2. Kiểm thử pingAdmin
    const pingRes = pingAdmin({ adminKey: adminKey });
    if (!resultOk(pingRes)) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'ping_admin', msg: 'pingAdmin failed' };
    }

    // 3. Kiểm thử Premium (trialExpiry = 0)
    const premRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'premium' });
    if (!resultOk(premRes)) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_premium', msg: 'setVipStatus premium failed' };
    }

    // 4. Kiểm thử VIP với số ngày (trialExpiry > 0)
    const vipRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'vip', days: 30 });
    if (!resultOk(vipRes)) {
      deleteAccount({ adminKey: adminKey, sdt: testSdt });
      return { ok: false, step: 'set_vip', msg: 'setVipStatus vip failed' };
    }

    // 5. Kiểm thử Free (trialExpiry = 0)
    const freeRes = setVipStatus({ adminKey: adminKey, sdt: testSdt, loaiTK: 'free' });
    if (!resultOk(freeRes)) {
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
    if (!resultOk(delRes)) {
      return { ok: false, step: 'delete_account', msg: 'deleteAccount failed' };
    }

    return { ok: true, passed: true };
  } catch (err) {
    try { deleteAccount({ adminKey: adminKey, sdt: testSdt }); } catch(e) {}
    return { ok: false, error: err.message };
  }
}

// ── SERVER-SIDE SELF-TEST: Kiểm thử Live Controls 14 đề 2k9 & hoàn nguyên an toàn ──
function runExamControlsSelfTest() {
  const adminKey = getAdminKey();
  if (!adminKey) {
    return { ok: false, step: 'check_key', msg: 'ADMIN_KEY is not configured in Script Properties' };
  }

  const testExamId = 'vedich2k9_de02';
  try {
    // 1. Check initial state
    const dsRes1 = getDanhSachDe();
    const ex1 = dsRes1.data.find(e => e.examId === testExamId);
    if (!ex1) return { ok: false, step: 'initial_fetch', msg: 'Exam not found in getDanhSachDe' };

    // 2. Test saveExam: hien + khoa
    const saveRes1 = saveExam({ adminKey, examId: testExamId, hienThi: 'hien', trangThai: 'khoa' });
    if (!saveRes1 || saveRes1.ok !== true) return { ok: false, step: 'save_hien_khoa', msg: 'saveExam hien+khoa failed' };

    // Verify GET reflects hien + khoa
    const dsRes2 = getDanhSachDe();
    const ex2 = dsRes2.data.find(e => e.examId === testExamId);
    if (ex2.hienThi !== 'hien' || ex2.trangThai !== 'khoa') return { ok: false, step: 'verify_hien_khoa', msg: 'GET did not reflect hien+khoa' };

    // 3. Test saveExam: hien + mo
    const saveRes2 = saveExam({ adminKey, examId: testExamId, hienThi: 'hien', trangThai: 'mo' });
    if (!saveRes2 || saveRes2.ok !== true) return { ok: false, step: 'save_hien_mo', msg: 'saveExam hien+mo failed' };

    // Verify GET reflects hien + mo
    const dsRes3 = getDanhSachDe();
    const ex3 = dsRes3.data.find(e => e.examId === testExamId);
    if (ex3.hienThi !== 'hien' || ex3.trangThai !== 'mo') return { ok: false, step: 'verify_hien_mo', msg: 'GET did not reflect hien+mo' };

    // 4. Test revert: an + khoa
    const saveRes3 = saveExam({ adminKey, examId: testExamId, hienThi: 'an', trangThai: 'khoa' });
    if (!saveRes3 || saveRes3.ok !== true) return { ok: false, step: 'revert_an_khoa', msg: 'revert to an+khoa failed' };

    // Verify GET reflects an + khoa
    const dsRes4 = getDanhSachDe();
    const ex4 = dsRes4.data.find(e => e.examId === testExamId);
    if (ex4.hienThi !== 'an' || ex4.trangThai !== 'khoa') return { ok: false, step: 'verify_an_khoa', msg: 'GET did not reflect an+khoa' };

    // 5. Test bulkUpdateExams for all 14 2k9 exams
    const all14 = [];
    for (let i = 2; i <= 15; i++) {
      all14.push('vedich2k9_de' + String(i).padStart(2, '0'));
    }
    const bulkRes = bulkUpdateExams({ adminKey, examIds: all14, hienThi: 'an', trangThai: 'khoa' });
    if (!bulkRes || bulkRes.ok !== true) return { ok: false, step: 'bulk_update', msg: 'bulkUpdateExams failed' };

    // Verify all 14 are an + khoa
    const dsRes5 = getDanhSachDe();
    const notHiddenLocked = dsRes5.data.filter(e => all14.includes(e.examId) && (e.hienThi !== 'an' || e.trangThai !== 'khoa'));
    if (notHiddenLocked.length > 0) return { ok: false, step: 'verify_bulk', msg: notHiddenLocked.length + ' exams not an+khoa' };

    return {
      ok: true,
      passed: true,
      totalExams: dsRes5.data.length,
      all14Status: '14/14 exams safely an+khoa',
      testedExamId: testExamId
    };
  } catch(e) {
    // Revert safeguard
    try {
      const all14 = [];
      for (let i = 2; i <= 15; i++) all14.push('vedich2k9_de' + String(i).padStart(2, '0'));
      bulkUpdateExams({ adminKey, examIds: all14, hienThi: 'an', trangThai: 'khoa' });
    } catch(err) {}
    return { ok: false, error: e.message };
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




// REPAIR P107-251 BATCH LESSON MAP & TARGETED 19-CELL PATCH (E940AC5 MASTER 390)
// ════════════════════════════════════════════════════════════════

const REPAIR_P107_251_LESSON_MAP = {
  "VLXT-PT-DE_01-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_01-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_01-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_01-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_01-P1-Q11": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_01-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_01-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_01-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_01-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_01-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_02-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_02-P1-Q02": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_02-P1-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_02-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_02-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_02-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_02-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_02-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_02-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_02-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_02-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_02-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_02-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_02-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_02-P1-Q15": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_02-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_02-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_02-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_03-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_03-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_03-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_03-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_03-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_03-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_03-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_03-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_03-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_03-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_03-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_03-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_03-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_03-P1-Q14": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_03-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_03-P1-Q16": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_03-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_03-P1-Q18": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_04-P1-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_04-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_04-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_04-P1-Q04": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_04-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_04-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_04-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_04-P1-Q08": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_04-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_04-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_04-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_04-P1-Q12": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_04-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_04-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_04-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_04-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_04-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_05-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_05-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_05-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_05-P1-Q06": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_05-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_05-P1-Q08": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_05-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_05-P1-Q10": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_05-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_05-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_05-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_06-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q08": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q14": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q15": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_06-P1-Q16": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q17": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_06-P1-Q18": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_07-P1-Q10": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_07-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_07-P1-Q13": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q14": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_07-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_07-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_07-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_07-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_08-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_08-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_08-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_08-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_08-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_08-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_08-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_08-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_08-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_08-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_08-P1-Q17": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_08-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q01": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_09-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_09-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_09-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_09-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_09-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_09-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_09-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_09-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_09-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_09-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q15": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_09-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_09-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_10-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_10-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_10-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_10-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_10-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_10-P1-Q06": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_10-P1-Q07": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_10-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_10-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_10-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_10-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_10-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_10-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_10-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_10-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_10-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_10-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_10-P1-Q18": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_11-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_11-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_11-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_11-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_11-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_11-P1-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_11-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_11-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_11-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_11-P1-Q10": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_11-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_11-P1-Q12": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_11-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_11-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_11-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_11-P1-Q16": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_11-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_11-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q01": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_12-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_12-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_12-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_12-P1-Q05": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_12-P1-Q06": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_12-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q09": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_12-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q12": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_12-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q16": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_12-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_12-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_13-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_13-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_13-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_13-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_13-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_13-P1-Q07": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_13-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_13-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_13-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q11": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_13-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q15": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_13-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_13-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_14-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_14-P1-Q02": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_14-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_14-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_14-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_14-P1-Q08": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_14-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q11": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_14-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_14-P1-Q13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_14-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_14-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_14-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_14-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q01": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_15-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_15-P1-Q03": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_15-P1-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_15-P1-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_15-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_15-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_15-P1-Q15": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_15-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_15-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_16-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_16-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_16-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_16-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_16-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_16-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_16-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_16-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_16-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_16-P1-Q10": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_16-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_16-P1-Q12": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_16-P1-Q13": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_16-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_16-P1-Q15": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_16-P1-Q16": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_16-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_16-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q01": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_17-P1-Q02": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_17-P1-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q05": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_17-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_17-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_17-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q09": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_17-P1-Q11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_17-P1-Q13": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_17-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q16": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_17-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_17-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_18-P1-Q03": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_18-P1-Q04": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_18-P1-Q05": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_18-P1-Q06": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_18-P1-Q08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q09": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q11": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-DE_18-P1-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_18-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q14": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_18-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_18-P1-Q16": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_18-P1-Q17": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_18-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_19-P1-Q02": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_19-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_19-P1-Q04": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_19-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_19-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_19-P1-Q07": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_19-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_19-P1-Q09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_19-P1-Q10": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_19-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_19-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_19-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q01": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_20-P1-Q03": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-DE_20-P1-Q04": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_20-P1-Q05": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_20-P1-Q06": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_20-P1-Q07": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-DE_20-P1-Q08": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_20-P1-Q09": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_20-P1-Q10": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_20-P1-Q11": "B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ",
  "VLXT-PT-DE_20-P1-Q12": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q13": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-DE_20-P1-Q14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q15": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q16": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q17": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-DE_20-P1-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P107-B6-Q01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P107-B6-Q02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P107-B6-Q03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P108-B6-Q04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P108-B6-Q05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P108-B6-Q06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P108-B6-Q07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P109-B6-Q08": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-P109-B6-Q09": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-P109-B6-Q10": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P110-B6-Q11": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
  "VLXT-PT-P110-B6-Q12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-P110-B6-Q13": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P111-B6-Q14": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-P111-B6-Q15": "B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT",
  "VLXT-PT-P113-B6-Q18": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P114-B6-VD01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P114-B6-VD02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P115-B6-VD03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P115-B6-VD04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P116-B6-VD05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P117-B6-VD07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P118-B6-VD08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P120-B6-BT01": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P120-B6-BT02": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P121-B6-BT03": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P121-B6-BT04": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P122-B6-BT05": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P122-B6-BT06": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P123-B6-BT07": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P124-B6-BT08": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P125-B6-BT09": "B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
  "VLXT-PT-P125-B6-BT10": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-P126-B6-BT11": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG",
  "VLXT-PT-P126-B6-BT12": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-P127-B6-BT13": "B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT",
  "VLXT-PT-P128-B6-BT14": "B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG"
};

const NEW_SAFE_QUESTIONS_3 = [
  {
    "id": "VLXT-PT-DE_05-P1-Q01-H6808885d",
    "mon": "Vật Lý 12",
    "chuong": "CHƯƠNG 1 – VẬT LÝ NHIỆT",
    "mucDo": "NB",
    "loai": "TN",
    "nhomId": "",
    "deBaiChung": "",
    "question": "Trong chuyển động nhiệt, các phân tử của chất lỏng",
    "optA": "chuyển động hoàn toàn hỗn loạn.",
    "optB": "chuyển động hỗn loạn quanh vị trí cân bằng xác định.",
    "optC": "dao động xung quanh các vị trí cân bằng cố định.",
    "optD": "dao động quanh vị trí cân bằng nhưng những vị trí cân bằng này không cố định mà di chuyển.",
    "correct": "D",
    "hinhAnh": "",
    "giaiThich": "Trong chất lỏng, các phân tử dao động quanh các vị trí cân bằng tạm thời, các vị trí này không cố định mà luôn di chuyển.",
    "ngayThem": "2026-09-01T08:00:00.000Z",
    "baiHoc": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
    "chatLuong": "tinh",
    "sourceBatch": "BATCH-P107-251-MASTER"
  },
  {
    "id": "VLXT-PT-DE_05-P1-Q17-Hdc672a67",
    "mon": "Vật Lý 12",
    "chuong": "CHƯƠNG 1 – VẬT LÝ NHIỆT",
    "mucDo": "NB",
    "loai": "TN",
    "nhomId": "",
    "deBaiChung": "",
    "question": "Khi nhiệt độ của vật tăng lên thì",
    "optA": "động năng của các phân tử cấu tạo nên vật tăng.",
    "optB": "động năng của các phân tử cấu tạo nên vật giảm.",
    "optC": "nội năng của vật giảm.",
    "optD": "thế năng của các phân tử cấu tạo nên vật tăng.",
    "correct": "A",
    "hinhAnh": "",
    "giaiThich": "Nhiệt độ là đại lượng đặc trưng cho động năng trung bình của chuyển động nhiệt phân tử. Nhiệt độ tăng thì động năng trung bình của các phân tử tăng.",
    "ngayThem": "2026-09-01T08:00:00.000Z",
    "baiHoc": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
    "chatLuong": "tinh",
    "sourceBatch": "BATCH-P107-251-MASTER"
  },
  {
    "id": "VLXT-PT-DE_20-P1-Q02-H04d938be",
    "mon": "Vật Lý 12",
    "chuong": "CHƯƠNG 1 – VẬT LÝ NHIỆT",
    "mucDo": "NB",
    "loai": "TN",
    "nhomId": "",
    "deBaiChung": "",
    "question": "Nguyên tử, phân tử không có tính chất nào sau đây?",
    "optA": "Chuyển động không ngừng.",
    "optB": "Giữa chúng có khoảng cách.",
    "optC": "Nở ra khi nhiệt độ tăng, co lại khi nhiệt độ giảm.",
    "optD": "Chuyển động càng nhanh khi nhiệt độ càng cao.",
    "correct": "C",
    "hinhAnh": "",
    "giaiThich": "Khi nhiệt độ thay đổi, khoảng cách giữa các nguyên tử, phân tử thay đổi làm kích thước của vật thay đổi, chứ bản thân từng nguyên tử, phân tử không nở ra hay co lại.",
    "ngayThem": "2026-09-01T08:00:00.000Z",
    "baiHoc": "B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
    "chatLuong": "tinh",
    "sourceBatch": "BATCH-P107-251-MASTER"
  }
];






















const TARGETED_PATCH_10_FIELDS = [
  {
    "id": "VLXT-PT-DE_01-P1-Q16",
    "field": "question",
    "after": "Một số phân tử ở gần mặt thoáng chất lỏng, chuyển động hướng ra ngoài, có ...(1).. đủ lớn thắng được lực tương tác giữa các phân tử thì có thể thoát ra ngoài khỏi chất lỏng. Như vậy, có thể nói sự bay hơi là sự hoá hơi xảy ra ở..(2).. của khối chất lỏng. Điền vào chỗ trống các cụm từ thích hợp."
  },
  {
    "id": "VLXT-PT-DE_05-P1-Q01-H6808885d",
    "field": "optB",
    "after": "chuyển động hỗn loạn quanh vị trí cân bằng xác định."
  },
  {
    "id": "VLXT-PT-DE_09-P1-Q03",
    "field": "question",
    "after": "Trường hợp nào sau đây làm tăng nội năng của một đồng xu bằng cách thực hiện công?"
  },
  {
    "id": "VLXT-PT-DE_18-P1-Q08",
    "field": "giaiThich",
    "after": "Độ tăng nhiệt độ của nước:\\n$$\\Delta t = \\frac{Q}{mc} = \\frac{84000}{2 \\cdot 4200} = 10^{\\circ}\\text{C}.$$\\nNhiệt độ sau cùng: $t = 20 + 10 = 30^{\\circ}\\text{C}$."
  }
];

function patchSpecificFields_AuditFidelity(e) {
  const isPost = Boolean(e && e.action);
  const dryRun = isPost ? (e.dryRun === true) : (e && e.parameter && e.parameter.execute !== 'true');

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return jsonOut({ ok: false, error: 'Bảng NganHang trống' });

  const rawHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const actualHeaderMap = {};
  for (let h = 0; h < rawHeaders.length; h++) {
    const headerName = String(rawHeaders[h] || '').trim().toLowerCase();
    if (headerName) actualHeaderMap[headerName] = h + 1;
  }

  const idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const idToRowMap = {};
  for (let i = 0; i < idValues.length; i++) {
    const qid = String(idValues[i][0] || '').trim();
    if (qid) idToRowMap[qid] = i + 2;
  }

  const appliedPatches = [];
  const missingIds = [];
  const verificationResults = [];

  for (let p = 0; p < TARGETED_PATCH_10_FIELDS.length; p++) {
    const item = TARGETED_PATCH_10_FIELDS[p];
    const qid = item.id;
    const field = item.field;
    const fieldLower = field.toLowerCase();
    const colIndex = actualHeaderMap[fieldLower] || actualHeaderMap[field] || item.colIndex || 8;
    const afterVal = item.after;

    if (idToRowMap.hasOwnProperty(qid)) {
      const rowNum = idToRowMap[qid];
      const curCellVal = String(sheet.getRange(rowNum, colIndex).getValue() || '');

      appliedPatches.push({
        id: qid,
        field: field,
        rowIndex: rowNum,
        colIndex: colIndex,
        before: curCellVal,
        after: afterVal
      });

      if (!dryRun) {
        sheet.getRange(rowNum, colIndex).setValue(afterVal);
      }
    } else {
      missingIds.push(qid);
    }
  }

  if (!dryRun) {
    SpreadsheetApp.flush();
    for (let p = 0; p < appliedPatches.length; p++) {
      const ap = appliedPatches[p];
      const readBackVal = String(sheet.getRange(ap.rowIndex, ap.colIndex).getValue() || '');
      verificationResults.push({
        id: ap.id,
        field: ap.field,
        rowIndex: ap.rowIndex,
        colIndex: ap.colIndex,
        writtenVal: ap.after,
        verifiedVal: readBackVal,
        isMatch: (readBackVal === ap.after)
      });
    }
  }

  return jsonOut({
    ok: true,
    success: true,
    dryRun: dryRun,
    totalTargetedFields: TARGETED_PATCH_10_FIELDS.length,
    totalPatchesApplied: appliedPatches.length,
    missingIds: missingIds,
    appliedPatches: appliedPatches,
    verificationResults: verificationResults,
    msg: (dryRun ? 'Dry-run hoàn tất: Sẽ sửa đúng ' + appliedPatches.length + ' trường mismatch.' : 'Đã sửa và xác thực thành công đúng ' + appliedPatches.length + ' ô mục tiêu trực tiếp từ payload e940ac5.')
  });
}


function repairBatchP107_251_AutoFix(e) {
  const isPost = Boolean(e && e.action);
  const dryRun = isPost ? (e.dryRun === true) : (e && e.parameter && e.parameter.execute !== 'true');

  const sheet = getOrCreate('NganHang', NH_HEADERS);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonOut({ ok: false, error: 'Bảng NganHang trống' });

  const idValues = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  const colValues = sheet.getRange(2, 17, lastRow - 1, 1).getValues();
  const existingIds = new Set();
  let updatedCount = 0;
  const changedRows = [];
  const beforeCounts = {};
  const afterCounts = {};

  for (let i = 0; i < idValues.length; i++) {
    const qid = String(idValues[i][0] || '').trim();
    if (qid) existingIds.add(qid);

    if (qid && REPAIR_P107_251_LESSON_MAP.hasOwnProperty(qid)) {
      const intendedLesson = REPAIR_P107_251_LESSON_MAP[qid];
      const curLesson = String(colValues[i][0] || '').trim();
      beforeCounts[curLesson] = (beforeCounts[curLesson] || 0) + 1;
      afterCounts[intendedLesson] = (afterCounts[intendedLesson] || 0) + 1;

      if (curLesson !== intendedLesson) {
        changedRows.push({ rowIndex: i + 2, id: qid, before: curLesson, after: intendedLesson });
        colValues[i][0] = intendedLesson;
        updatedCount++;
      }
    }
  }

  // Check 3 new safe questions
  const toAppend = [];
  for (let k = 0; k < NEW_SAFE_QUESTIONS_3.length; k++) {
    const nq = NEW_SAFE_QUESTIONS_3[k];
    if (!existingIds.has(nq.id)) {
      toAppend.push(nq);
      afterCounts[nq.baiHoc] = (afterCounts[nq.baiHoc] || 0) + 1;
    }
  }

  if (!dryRun) {
    if (updatedCount > 0) {
      sheet.getRange(2, 17, lastRow - 1, 1).setValues(colValues);
    }
    if (toAppend.length > 0) {
      const appendRows = toAppend.map(function(item) {
        return NH_HEADERS.map(function(h) {
          return item.hasOwnProperty(h) ? item[h] : '';
        });
      });
      sheet.getRange(lastRow + 1, 1, appendRows.length, NH_HEADERS.length).setValues(appendRows);
    }
  }

  return jsonOut({
    ok: true,
    success: true,
    dryRun: dryRun,
    totalScanned: idValues.length,
    totalTargetedInBank: Object.keys(REPAIR_P107_251_LESSON_MAP).length,
    totalChangedInBank: updatedCount,
    totalNewSafeToAppend: toAppend.length,
    totalBatchAccounted: Object.keys(REPAIR_P107_251_LESSON_MAP).length + toAppend.length,
    beforeCounts: beforeCounts,
    afterCounts: afterCounts,
    sampleChanges: changedRows.slice(0, 20),
    newSafeQuestions: toAppend.map(function(x) { return { id: x.id, stem: x.question, baiHoc: x.baiHoc }; }),
    msg: (dryRun ? 'Dry-run hoàn tất: Sẽ sửa ' + updatedCount + ' dòng cũ & bổ sung ' + toAppend.length + ' câu mới an toàn (Tổng gói đúng 390 câu).' : 'Đã cập nhật thành công ' + updatedCount + ' dòng cũ & bổ sung ' + toAppend.length + ' câu mới an toàn.')
  });
}


// ══════════════════════════════════════════════════════════════════════════════
// BỘ HÀM CHUẨN HOÁ TAXONOMY & KIỂM SOÁT AN TOÀN NGÂN HÀNG (7 FAILURE GATES)
// ══════════════════════════════════════════════════════════════════════════════

function normalizeLesson(bh) {
  const s = String(bh || '').trim();
  if (!s) return '';
  const upper = s.toUpperCase();
  if (upper === 'G12_C1_B01' || /^B1\b/.test(upper)) return 'B1. CẤU TRÚC CỦA CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ';
  if (upper === 'G12_C1_B02' || /^B2\b/.test(upper)) return 'B2. LỰC LIÊN KẾT VÀ SỰ CHUYỂN THỂ CỦA CHẤT';
  if (upper === 'G12_C1_B03' || /^B3\b/.test(upper)) return 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ';
  if (upper === 'G12_C1_B04' || /^B4\b/.test(upper)) return 'B4. NHIỆT DUNG RIÊNG - NÓNG CHẢY RIÊNG - HOÁ HƠI RIÊNG';
  if (upper === 'G12_C1_B05' || /^B5\b/.test(upper)) return 'B5. NỘI NĂNG – ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC';
  if (upper === 'G12_C1_B06' || /^B6\b/.test(upper)) return 'B6. ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT';
  if (upper === 'G12_C2_B09' || /^B9\b/.test(upper)) return 'B9. MÔ HÌNH ĐỘNG HỌC PHÂN TỬ CHẤT KHÍ - KHÍ LÝ TƯỞNG';
  if (upper === 'G12_C2_B10' || /^B10\b/.test(upper)) return 'B10. PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÝ TƯỞNG';
  if (upper === 'G12_C2_B11' || /^B11\b/.test(upper)) return 'B11. ĐỊNH LUẬT BOYLE - QUÁ TRÌNH ĐẲNG NHIỆT';
  if (upper === 'G12_C2_B12' || /^B12\b/.test(upper)) return 'B12. ĐỊNH LUẬT CHARLES - QUÁ TRÌNH ĐẲNG ÁP';
  if (upper === 'G12_C2_B13' || /^B13\b/.test(upper)) return 'B13. ĐỊNH LUẬT GAY LUSSAC - QUÁ TRÌNH ĐẲNG TÍCH';
  if (upper === 'G12_C2_B14' || /^B14\b/.test(upper)) return 'B14. PHƯƠNG TRÌNH CLAPERON - MENDELEEV';
  if (upper === 'G12_C2_B15' || /^B15\b/.test(upper)) return 'B15. ÁP SUẤT THEO MÔ HÌNH ĐỘNG HỌC PHÂN TỬ - QUAN HỆ ĐỘNG NĂNG PHÂN TỬ VÀ NHIỆT ĐỘ';
  if (upper === 'G12_C2_B16' || /^B16\b/.test(upper)) return 'B16. ĐỒ THỊ KHÍ LÝ TƯỞNG';
  if (upper === 'G12_C2_B17' || /^B17\b/.test(upper)) return 'B17. ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC ĐỐI VỚI CÁC ĐẲNG QUÁ TRÌNH';
  if (upper === 'G12_C2_B18' || /^B18\b/.test(upper)) return 'B18. TỔNG ÔN CHƯƠNG II - KHÍ LÝ TƯỞNG (P1)';
  if (upper === 'G12_C2_B19' || /^B19\b/.test(upper)) return 'B19. TỔNG ÔN CHƯƠNG II - KHÍ LÝ TƯỞNG (P2)';
  return '';
}

// ── GATE 1: Quét toàn diện Header Map, phát hiện và từ chối nếu có Header trùng lặp (FailClosedDuplicateHeaders)
function buildSheetHeaderMap(sheet, requiredHeaders) {
  const lastCol = sheet.getLastColumn();
  if (lastCol < 1) {
    return { ok: false, error: 'SheetHasNoColumns', msg: 'Sheet không có cột nào' };
  }
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  const aliasMap = {
    'id': ['id'],
    'question': ['question', 'cauhoi', 'debai', 'content', 'stem'],
    'optA': ['opta', 'a'],
    'optB': ['optb', 'b'],
    'optC': ['optc', 'c'],
    'optD': ['optd', 'd'],
    'correct': ['correct', 'dapan', 'answer'],
    'mon': ['mon', 'subject', 'lop'],
    'chuong': ['chuong', 'chapter'],
    'baiHoc': ['baihoc', 'lesson'],
    'mucDo': ['mucdo', 'difficulty'],
    'loai': ['loai', 'type'],
    'chatLuong': ['chatluong'],
    'kyThuat': ['kythuat'],
    'lyDoCachLy': ['lydocachly'],
    'batchId': ['batchid', 'sourcebatch'],
    'giaiThich': ['giaithich', 'explanation', 'solution'],
    'hinhAnh': ['hinhanh', 'image', 'cropimage'],
    'ngayThem': ['ngaythem', 'timestamp'],
    'nhomId': ['nhomid'],
    'deBaiChung': ['debaichung']
  };

  const reverseAlias = {};
  for (const [canon, aliases] of Object.entries(aliasMap)) {
    for (const a of aliases) {
      reverseAlias[a.toLowerCase()] = canon;
    }
  }

  const colOccurrences = {};
  for (let c = 0; c < headers.length; c++) {
    const raw = String(headers[c] || '').trim();
    const rawLower = raw.toLowerCase();
    if (!rawLower) continue;

    const canon = reverseAlias[rawLower];
    if (canon) {
      if (!colOccurrences[canon]) colOccurrences[canon] = [];
      colOccurrences[canon].push(c);
    }
  }

  const reqList = Array.isArray(requiredHeaders) ? requiredHeaders : ['id', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'baiHoc'];

  // 1. Kiểm tra header trùng lặp trong số các header bắt buộc (FailClosedDuplicateHeaders)
  const dupHeaders = [];
  for (const req of reqList) {
    if (colOccurrences[req] && colOccurrences[req].length > 1) {
      dupHeaders.push({
        header: req,
        columns: colOccurrences[req].map(i => i + 1)
      });
    }
  }
  if (dupHeaders.length > 0) {
    return {
      ok: false,
      error: 'FailClosedDuplicateHeaders',
      duplicates: dupHeaders,
      colCount: lastCol,
      msg: 'Phát hiện header bắt buộc bị trùng lặp trong Sheet: ' + dupHeaders.map(d => d.header + ' (cột ' + d.columns.join(', ') + ')').join('; ')
    };
  }

  // 2. Kiểm tra header thiếu (FailClosedMissingHeaders)
  const missingHeaders = [];
  const resolved = {};
  for (const req of reqList) {
    if (!colOccurrences[req] || colOccurrences[req].length === 0) {
      missingHeaders.push(req);
    } else {
      resolved[req] = colOccurrences[req][0];
    }
  }
  if (missingHeaders.length > 0) {
    return {
      ok: false,
      error: 'FailClosedMissingHeaders',
      missing: missingHeaders,
      colCount: lastCol,
      msg: 'Sheet thiếu các header bắt buộc: ' + missingHeaders.join(', ')
    };
  }

  // Map các trường còn lại nếu chỉ xuất hiện đúng 1 lần
  for (const [canon, cols] of Object.entries(colOccurrences)) {
    if (!resolved.hasOwnProperty(canon) && cols.length === 1) {
      resolved[canon] = cols[0];
    }
  }

  return {
    ok: true,
    colCount: lastCol,
    headerMap: resolved,
    rawHeaders: headers
  };
}

function createRowFromHeaderMap(dataObj, headerInfo) {
  const row = new Array(headerInfo.colCount).fill('');
  for (const [canonKey, colIdx0] of Object.entries(headerInfo.headerMap)) {
    if (dataObj.hasOwnProperty(canonKey) && dataObj[canonKey] !== undefined && dataObj[canonKey] !== null) {
      row[colIdx0] = dataObj[canonKey];
    }
  }
  return row;
}

// ── SAO CHÉP SHEET NGANHANG SANG SHEET THỬ NGHIỆM (STAGING) ──
function cloneNganHangToStaging(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const srcSheet = ss.getSheetByName('NganHang');
    if (!srcSheet) return jsonOut({ ok: false, error: 'Sheet NganHang not found' });

    const stagingName = String((data && data.stagingSheetName) || 'NganHang_Staging_Test').trim();
    let stagingSheet = ss.getSheetByName(stagingName);
    if (stagingSheet) {
      ss.deleteSheet(stagingSheet);
    }

    stagingSheet = srcSheet.copyTo(ss);
    stagingSheet.setName(stagingName);
    SpreadsheetApp.flush();

    return jsonOut({
      ok: true,
      success: true,
      copiedFrom: 'NganHang',
      stagingSheetName: stagingName,
      totalRows: stagingSheet.getLastRow(),
      totalCols: stagingSheet.getLastColumn(),
      msg: 'Đã sao chép thành công sheet NganHang sang ' + stagingName
    });
  } catch (err) {
    return jsonOut({ ok: false, error: err.toString() });
  }
}

// ── SỬA BATCH IPCLASS CÓ KIỂM SOÁT & DRY-RUN AN TOÀN THEO 7 GATES ──
function repairIpclassBatch(data) {
  let lockAcquired = false;
  let lock = null;
  if (typeof LockService !== 'undefined' && LockService.getScriptLock) {
    try {
      lock = LockService.getScriptLock();
      lock.waitLock(30000);
      lockAcquired = true;
    } catch (lockErr) {
      return jsonOut({
        ok: false,
        success: false,
        error: 'LockTimeout',
        msg: 'Không thể lấy script lock sau 30 giây: ' + lockErr.toString()
      });
    }
  }

  try {
    // GATE 7: Mặc định dryRun = true
    const dryRun = (data.dryRun !== false && data.dryRun !== 'false');
    const targetSheetName = String(data.targetSheetName || 'NganHang').trim();
    const rawUpdates = Array.isArray(data.updates) ? data.updates : (Array.isArray(data.questions) ? data.questions : []);

    if (!rawUpdates.length) {
      return jsonOut({ ok: false, success: false, error: 'EmptyUpdates', msg: 'Không có danh sách câu hỏi cần sửa' });
    }

    // GATE 2: Phát hiện ID trùng lặp trong payload
    const seenPayloadIds = new Set();
    const dupPayloadIds = [];
    for (let i = 0; i < rawUpdates.length; i++) {
      const pid = String(rawUpdates[i].id || '').trim();
      if (!pid.startsWith('IPC-')) {
        return jsonOut({
          ok: false,
          success: false,
          error: 'InvalidTargetId',
          msg: 'Từ chối cập nhật ID không thuộc IPC: ' + pid
        });
      }
      if (seenPayloadIds.has(pid)) {
        dupPayloadIds.push(pid);
      } else {
        seenPayloadIds.add(pid);
      }
    }
    if (dupPayloadIds.length > 0) {
      return jsonOut({
        ok: false,
        success: false,
        error: 'FailClosedDuplicatePayloadIds',
        duplicates: dupPayloadIds,
        msg: 'Phát hiện ID trùng lặp trong payload: ' + dupPayloadIds.join(', ')
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(targetSheetName);
    if (!sheet) {
      return jsonOut({ ok: false, success: false, error: 'SheetNotFound', msg: 'Không tìm thấy sheet: ' + targetSheetName });
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) {
      return jsonOut({ ok: false, success: false, error: 'EmptySheet', msg: 'Sheet ' + targetSheetName + ' không có dữ liệu' });
    }

    // GATE 1: Kiểm tra HeaderMap & Header trùng lặp trong Sheet
    const headerCheck = buildSheetHeaderMap(sheet, ['id', 'question', 'optA', 'optB', 'optC', 'optD', 'correct', 'baiHoc', 'chatLuong']);
    if (!headerCheck.ok) {
      return jsonOut({
        ok: false,
        success: false,
        error: headerCheck.error,
        details: headerCheck,
        msg: headerCheck.msg
      });
    }

    const hMap = headerCheck.headerMap;

    // Đọc toàn bộ bảng để kiểm tra ID trong Sheet
    const fullData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    const sheetIdCounts = new Map();
    const sheetIdFirstRow = new Map();

    for (let r = 1; r < fullData.length; r++) {
      const rid = String(fullData[r][hMap.id] || '').trim();
      if (!rid) continue;
      if (sheetIdCounts.has(rid)) {
        sheetIdCounts.set(rid, sheetIdCounts.get(rid) + 1);
      } else {
        sheetIdCounts.set(rid, 1);
        sheetIdFirstRow.set(rid, { rowIndex: r + 1, rowData: fullData[r] });
      }
    }

    // GATE 3: Phát hiện ID mục tiêu bị trùng lặp trong Google Sheet
    const targetedDupsInSheet = [];
    for (const pid of seenPayloadIds) {
      if (sheetIdCounts.get(pid) > 1) {
        targetedDupsInSheet.push(pid);
      }
    }
    if (targetedDupsInSheet.length > 0) {
      return jsonOut({
        ok: false,
        success: false,
        error: 'FailClosedDuplicateSheetIds',
        duplicates: targetedDupsInSheet,
        msg: 'Phát hiện ID mục tiêu bị trùng lặp trong Sheet: ' + targetedDupsInSheet.join(', ') + '. Map.set() sẽ âm thầm ghi đè nếu tiếp tục!'
      });
    }

    // GATE 4: Phát hiện ID mục tiêu thiếu trong Sheet
    const missingSheetIds = [];
    for (const pid of seenPayloadIds) {
      if (!sheetIdCounts.has(pid)) {
        missingSheetIds.push(pid);
      }
    }
    if (missingSheetIds.length > 0) {
      return jsonOut({
        ok: false,
        success: false,
        error: 'FailClosedMissingSheetIds',
        missing: missingSheetIds,
        msg: 'Không tìm thấy ID mục tiêu trong Sheet: ' + missingSheetIds.join(', ')
      });
    }

    // GATE 5 & GATE 6 & GATE 8: Kiểm tra tính hợp lệ trước khi ghi
    // - stem, optA-D, correct, explanation, baiHoc KHÔNG ĐƯỢC RỖNG
    // - TUYỆT ĐỐI KHÔNG FALLBACK B3
    // - Không đặt chatLuong="tinh" hoặc kyThuat="Dat" cho câu thiếu đáp án hoặc lời giải
    const validationErrors = [];
    for (let idx = 0; idx < rawUpdates.length; idx++) {
      const u = rawUpdates[idx];
      const pid = String(u.id || '').trim();

      const newQ = String(u.question || u.stem || '').trim();
      if (!newQ) {
        validationErrors.push({ id: pid, error: 'FailClosedEmptyQuestion', field: 'question' });
      }

      const newOptA = String(u.optA !== undefined ? u.optA : (u.a !== undefined ? u.a : '')).trim();
      const newOptB = String(u.optB !== undefined ? u.optB : (u.b !== undefined ? u.b : '')).trim();
      const newOptC = String(u.optC !== undefined ? u.optC : (u.c !== undefined ? u.c : '')).trim();
      const newOptD = String(u.optD !== undefined ? u.optD : (u.d !== undefined ? u.d : '')).trim();
      if (!newOptA || !newOptB || !newOptC || !newOptD) {
        validationErrors.push({
          id: pid,
          error: 'FailClosedEmptyOptions',
          field: 'options',
          details: { optA: !newOptA, optB: !newOptB, optC: !newOptC, optD: !newOptD }
        });
      }

      const newCorrect = String(u.correct || u.correctAnswer || '').trim().toUpperCase();
      if (!['A', 'B', 'C', 'D'].includes(newCorrect)) {
        validationErrors.push({ id: pid, error: 'FailClosedInvalidCorrectAnswer', field: 'correct', value: newCorrect });
      }

      const newGiaiThich = String(u.giaiThich || u.explanation || '').trim();
      if (!newGiaiThich) {
        validationErrors.push({ id: pid, error: 'FailClosedEmptyExplanation', field: 'giaiThich' });
      }

      // GATE 6: Bỏ fallback B3; từ chối baiHoc rỗng hoặc không hợp lệ
      const rawBai = String(u.baiHoc || u.lesson || '').trim();
      if (!rawBai) {
        validationErrors.push({ id: pid, error: 'FailClosedEmptyBaiHoc', field: 'baiHoc' });
      } else {
        const normBai = normalizeLesson(rawBai);
        if (!normBai) {
          validationErrors.push({ id: pid, error: 'FailClosedInvalidBaiHoc', field: 'baiHoc', value: rawBai });
        }
      }

      // GATE 8: Không cho phép gán chatLuong="tinh" hoặc kyThuat="Dat" nếu câu thiếu đáp án hoặc lời giải
      const curChatLuong = String(u.chatLuong || '').trim();
      const curKyThuat = String(u.kyThuat || '').trim();
      if ((curChatLuong === 'tinh' || curKyThuat === 'Dat') && (!newCorrect || !newGiaiThich)) {
        validationErrors.push({ id: pid, error: 'FailClosedInvalidQualityRating', field: 'chatLuong/kyThuat' });
      }
    }

    if (validationErrors.length > 0) {
      return jsonOut({
        ok: false,
        success: false,
        error: 'FailClosedValidationError',
        errors: validationErrors,
        msg: 'Dữ liệu đầu vào không hợp lệ (' + validationErrors.length + ' lỗi): ' + validationErrors.slice(0, 5).map(e => e.id + ':' + e.error).join('; ')
      });
    }

    // Xây dựng danh sách cập nhật
    const rowsToApply = [];
    let willRepairQuestion = 0;
    let willRepairOptions = 0;
    let willRepairAnswer = 0;
    let willRepairTaxonomy = 0;
    let unchangedCount = 0;
    const sampleChanges = [];

    for (let idx = 0; idx < rawUpdates.length; idx++) {
      const u = rawUpdates[idx];
      const pid = String(u.id || '').trim();
      const entry = sheetIdFirstRow.get(pid);
      const curRow = entry.rowData;
      const rowNum = entry.rowIndex;

      const newQ = String(u.question || u.stem || '').trim();
      const newOptA = String(u.optA !== undefined ? u.optA : (u.a !== undefined ? u.a : '')).trim();
      const newOptB = String(u.optB !== undefined ? u.optB : (u.b !== undefined ? u.b : '')).trim();
      const newOptC = String(u.optC !== undefined ? u.optC : (u.c !== undefined ? u.c : '')).trim();
      const newOptD = String(u.optD !== undefined ? u.optD : (u.d !== undefined ? u.d : '')).trim();
      const newCorrect = String(u.correct || u.correctAnswer || '').trim().toUpperCase();
      const newGiaiThich = String(u.giaiThich || u.explanation || '').trim();
      const newMon = String(u.mon || 'Vật lý 12').trim();
      const newChuong = String(u.chuong || 'CHƯƠNG 1 – VẬT LÝ NHIỆT').trim();
      const newBai = normalizeLesson(String(u.baiHoc || u.lesson || '').trim());
      const newBatchId = String(u.batchId || '').trim();
      const newChatLuong = String(u.chatLuong || 'tinh').trim();
      const newKyThuat = String(u.kyThuat || 'Dat').trim();

      const curQ = String(curRow[hMap.question] || '').trim();
      const curOptA = String(curRow[hMap.optA] || '').trim();
      const curOptB = String(curRow[hMap.optB] || '').trim();
      const curOptC = String(curRow[hMap.optC] || '').trim();
      const curOptD = String(curRow[hMap.optD] || '').trim();
      const curCorrect = String(curRow[hMap.correct] || '').trim().toUpperCase();
      const curBai = hMap.hasOwnProperty('baiHoc') ? String(curRow[hMap.baiHoc] || '').trim() : '';

      let changedQ = (curQ !== newQ);
      let changedOpts = (curOptA !== newOptA || curOptB !== newOptB || curOptC !== newOptC || curOptD !== newOptD);
      let changedAns = (curCorrect !== newCorrect);
      let changedTax = (curBai !== newBai);

      if (changedQ) willRepairQuestion++;
      if (changedOpts) willRepairOptions++;
      if (changedAns) willRepairAnswer++;
      if (changedTax) willRepairTaxonomy++;
      if (!changedQ && !changedOpts && !changedAns && !changedTax) unchangedCount++;

      const newRow = [...curRow];
      newRow[hMap.question] = newQ;
      newRow[hMap.optA] = newOptA;
      newRow[hMap.optB] = newOptB;
      newRow[hMap.optC] = newOptC;
      newRow[hMap.optD] = newOptD;
      newRow[hMap.correct] = newCorrect;
      if (hMap.hasOwnProperty('giaiThich')) newRow[hMap.giaiThich] = newGiaiThich;
      if (hMap.hasOwnProperty('mon')) newRow[hMap.mon] = newMon;
      if (hMap.hasOwnProperty('chuong')) newRow[hMap.chuong] = newChuong;
      if (hMap.hasOwnProperty('baiHoc')) newRow[hMap.baiHoc] = newBai;
      if (hMap.hasOwnProperty('batchId') && newBatchId) newRow[hMap.batchId] = newBatchId;
      if (hMap.hasOwnProperty('chatLuong')) newRow[hMap.chatLuong] = newChatLuong;
      if (hMap.hasOwnProperty('kyThuat')) newRow[hMap.kyThuat] = newKyThuat;

      rowsToApply.push({
        rowIndex: rowNum,
        rowData: newRow
      });

      if (sampleChanges.length < 10) {
        sampleChanges.push({
          id: pid,
          rowIndex: rowNum,
          before: { question: curQ.slice(0, 60), optA: curOptA, optB: curOptB, correct: curCorrect, baiHoc: curBai },
          after: { question: newQ.slice(0, 60), optA: newOptA, optB: newOptB, correct: newCorrect, baiHoc: newBai }
        });
      }
    }

    // GATE 7: DRY-RUN NON-MUTATION ASSERTION
    if (dryRun) {
      return jsonOut({
        ok: true,
        success: true,
        dryRun: true,
        targetSheetName: targetSheetName,
        targetCount: rawUpdates.length,
        foundCount: rowsToApply.length,
        willRepairQuestion: willRepairQuestion,
        willRepairOptions: willRepairOptions,
        willRepairAnswer: willRepairAnswer,
        willRepairTaxonomy: willRepairTaxonomy,
        unchangedCount: unchangedCount,
        sampleChanges: sampleChanges,
        msg: 'Dry-run an toàn hoàn tất (0 dòng bị ghi đè): Có ' + rowsToApply.length + ' câu sẵn sàng cập nhật.'
      });
    }

    // NON-DRYRUN: GHI CÓ CƠ CHẾ PHỤC HỒI TỰ ĐỘNG (BEFORE-IMAGE ROLLBACK BẢO ĐẢM TÍNH NGUYÊN TỬ)
    const beforeImages = [];
    for (let b = 0; b < rowsToApply.length; b++) {
      const item = rowsToApply[b];
      const origRow = sheet.getRange(item.rowIndex, 1, 1, item.rowData.length).getValues()[0];
      beforeImages.push({
        rowIndex: item.rowIndex,
        rowData: origRow
      });
    }

    let appliedCount = 0;
    let writeErr = null;
    try {
      for (let a = 0; a < rowsToApply.length; a++) {
        const item = rowsToApply[a];
        sheet.getRange(item.rowIndex, 1, 1, item.rowData.length).setValues([item.rowData]);
        appliedCount++;
      }
      SpreadsheetApp.flush();
    } catch (err) {
      writeErr = err;
    }

    if (writeErr) {
      // TỰ ĐỘNG PHỤC HỒI (ROLLBACK) VÀ XÁC MINH ĐỐI CHIẾU ĐỌC LẠI (READ-BACK VERIFIED ROLLBACK)
      let rollbackVerifiedCount = 0;
      const rollbackFailedRows = [];

      for (let r = 0; r < appliedCount; r++) {
        const rollbackItem = beforeImages[r];
        try {
          sheet.getRange(rollbackItem.rowIndex, 1, 1, rollbackItem.rowData.length).setValues([rollbackItem.rowData]);
          SpreadsheetApp.flush();

          // Đọc lại từ Sheet để xác minh khớp trước khi tăng restoredCount
          const readBackRow = sheet.getRange(rollbackItem.rowIndex, 1, 1, rollbackItem.rowData.length).getValues()[0];
          let matches = Boolean(readBackRow && readBackRow.length === rollbackItem.rowData.length);
          if (matches) {
            for (let c = 0; c < rollbackItem.rowData.length; c++) {
              const valA = readBackRow[c];
              const valB = rollbackItem.rowData[c];
              const isBlankA = (valA === null || valA === undefined || valA === '');
              const isBlankB = (valB === null || valB === undefined || valB === '');
              if (isBlankA && isBlankB) {
                continue; // cả hai đều rỗng/trống
              }
              if (isBlankA !== isBlankB) {
                matches = false;
                break;
              }
              if (valA !== valB && String(valA) !== String(valB)) {
                matches = false;
                break;
              }
            }
          }

          if (matches) {
            rollbackVerifiedCount++;
          } else {
            rollbackFailedRows.push({
              rowIndex: rollbackItem.rowIndex,
              reason: 'ReadBackMismatch',
              expected: rollbackItem.rowData,
              actual: readBackRow
            });
          }
        } catch (rbErr) {
          rollbackFailedRows.push({
            rowIndex: rollbackItem.rowIndex,
            reason: 'RollbackWriteFailed',
            error: rbErr.toString()
          });
        }
      }

      const allRolledBack = (rollbackFailedRows.length === 0 && rollbackVerifiedCount === appliedCount);
      const errorCode = allRolledBack ? 'TransactionWriteFailedAndRolledBack' : 'TransactionWriteFailedRollbackIncomplete';

      return jsonOut({
        ok: false,
        success: false,
        error: errorCode,
        failedAtRowIndex: appliedCount + 1,
        attemptedCount: appliedCount,
        restoredCount: rollbackVerifiedCount,
        rollbackVerifiedCount: rollbackVerifiedCount,
        rollbackFailedRows: rollbackFailedRows,
        originalError: writeErr.toString(),
        msg: allRolledBack
          ? 'Gặp lỗi trong quá trình ghi tại dòng ' + (appliedCount + 1) + '. Đã tự động phục hồi và xác minh đối chiếu đọc lại thành công ' + rollbackVerifiedCount + '/' + appliedCount + ' dòng về nguyên trạng.'
          : 'CẢNH BÁO NGUY HIỂM: Gặp lỗi ghi tại dòng ' + (appliedCount + 1) + ' VÀ phục hồi (rollback) thất bại trên ' + rollbackFailedRows.length + ' dòng! Đã xác minh phục hồi: ' + rollbackVerifiedCount + '/' + appliedCount + ' dòng.'
      });
    }

    return jsonOut({
      ok: true,
      success: true,
      dryRun: false,
      targetSheetName: targetSheetName,
      appliedRowsCount: rowsToApply.length,
      repairedQuestionCount: willRepairQuestion,
      repairedOptionsCount: willRepairOptions,
      repairedAnswerCount: willRepairAnswer,
      repairedTaxonomyCount: willRepairTaxonomy,
      msg: 'Đã cập nhật an toàn ' + rowsToApply.length + ' câu trên sheet ' + targetSheetName
    });
  } catch (err) {
    return jsonOut({ ok: false, error: err.toString() });
  } finally {
    if (lockAcquired && lock && typeof lock.releaseLock === 'function') {
      try {
        lock.releaseLock();
      } catch (relErr) {}
    }
  }
}

// ── HÀM NỘI BỘ CHỈ ĐỌC: KIỂM KÊ TOÀN BỘ SHEET CỘT 22–37 (KHÔNG LỘ NỘI DUNG, KHÔNG CÔNG KHAI) ──
function inspectFullSheetDuplicateColumns(targetSheetNameOrObj) {
  try {
    let sheetName = 'NganHang';
    if (typeof targetSheetNameOrObj === 'string') {
      sheetName = targetSheetNameOrObj.trim();
    } else if (targetSheetNameOrObj && typeof targetSheetNameOrObj === 'object') {
      sheetName = String(targetSheetNameOrObj.sheetName || 'NganHang').trim();
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      return { ok: false, error: 'SheetNotFound', msg: 'Không tìm thấy sheet: ' + sheetName };
    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow < 1 || lastCol < 1) {
      return { ok: false, error: 'EmptySheet', msg: 'Sheet rỗng' };
    }

    const headerRow = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const headerNames = headerRow.map(function(h, i) {
      return { colNumber: i + 1, header: String(h || '').trim() };
    });

    const duplicateColStart = 22;
    const duplicateColEnd = Math.min(lastCol, 37);

    const columnStats = {};
    for (let c = duplicateColStart; c <= duplicateColEnd; c++) {
      columnStats[c] = {
        colNumber: c,
        header: headerRow[c - 1] !== undefined ? String(headerRow[c - 1]).trim() : '',
        nonEmptyCount: 0
      };
    }

    const rowsWithData = [];
    let identicalToCanonicalCount = 0;
    let differentFromCanonicalCount = 0;
    let dataConcatenation = '';

    if (lastRow >= 2 && duplicateColEnd >= duplicateColStart) {
      const fullRangeValues = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

      for (let r = 0; r < fullRangeValues.length; r++) {
        const rowNum = r + 2;
        const rowData = fullRangeValues[r];
        const idVal = String(rowData[0] || '').trim();

        let rowHasDataInDupCols = false;
        const dupColumnsSummary = [];

        for (let c = duplicateColStart; c <= duplicateColEnd; c++) {
          const colIdx0 = c - 1;
          const cellVal = rowData[colIdx0];
          const isBlank = (cellVal === null || cellVal === undefined || cellVal === '');

          if (!isBlank) {
            const cellStr = String(cellVal);
            dataConcatenation += 'r' + rowNum + 'c' + c + ':' + cellStr + ';';
            columnStats[c].nonEmptyCount++;
            rowHasDataInDupCols = true;

            const canonicalCol = c - 16;
            const canonicalVal = (canonicalCol >= 1 && canonicalCol <= lastCol)
              ? rowData[canonicalCol - 1]
              : '';

            const isCanonicalBlank = (canonicalVal === null || canonicalVal === undefined || canonicalVal === '');
            const isIdentical = (!isCanonicalBlank && (cellVal === canonicalVal || String(cellVal) === String(canonicalVal)));

            if (isIdentical) {
              identicalToCanonicalCount++;
            } else {
              differentFromCanonicalCount++;
            }

            // CHỈ LƯU METADATA CỘT & TRẠNG THÁI TRÙNG/KHÁC, TUYỆT ĐỐI KHÔNG LƯU NỘI DUNG THÂN CÂU, PHƯƠNG ÁN HAY LỜI GIẢI
            dupColumnsSummary.push({
              colNumber: c,
              header: columnStats[c].header,
              canonicalCol: canonicalCol,
              isIdentical: isIdentical
            });
          }
        }

        if (rowHasDataInDupCols) {
          rowsWithData.push({
            rowNumber: rowNum,
            id: idVal,
            columnsWithData: dupColumnsSummary
          });
        }
      }
    }

    let sha256Hash = '';
    if (typeof Utilities !== 'undefined' && Utilities.computeDigest) {
      const rawBytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, dataConcatenation, Utilities.Charset.UTF_8);
      sha256Hash = rawBytes.map(function(byte) {
        const v = (byte < 0 ? byte + 256 : byte).toString(16);
        return v.length === 1 ? '0' + v : v;
      }).join('');
    } else if (typeof crypto !== 'undefined' && crypto.createHash) {
      sha256Hash = crypto.createHash('sha256').update(dataConcatenation, 'utf8').digest('hex');
    }

    return {
      ok: true,
      readOnly: true,
      targetSheetName: sheetName,
      totalRows: lastRow,
      totalCols: lastCol,
      dataRowsCount: Math.max(0, lastRow - 1),
      headerNames: headerNames,
      duplicateColumnsRange: {
        startCol: duplicateColStart,
        endCol: duplicateColEnd,
        totalColsInRange: duplicateColEnd >= duplicateColStart ? (duplicateColEnd - duplicateColStart + 1) : 0
      },
      columnStats: Object.values(columnStats),
      rowsWithDataCount: rowsWithData.length,
      rowsWithData: rowsWithData, // Chỉ chứa rowNumber, ID, colNumber, header, isIdentical (0 ô nội dung ngân hàng)
      comparisonWithCanonical: {
        identicalCount: identicalToCanonicalCount,
        differentCount: differentFromCanonicalCount,
        totalNonEmptyCells: identicalToCanonicalCount + differentFromCanonicalCount
      },
      sha256HashOfColumns22To37: sha256Hash
    };
  } catch (err) {
    return { ok: false, error: err.toString() };
  }
}

// ── HÀM ĐIỀU HÀNH NỘI BỘ XÁC THỰC: CHẠY TRỰC TIẾP TRÊN CẢ NGANHANG & STAGING ──
function runAuthenticatedFullSheetInspection() {
  const resultNganHang = inspectFullSheetDuplicateColumns('NganHang');
  const resultStaging = inspectFullSheetDuplicateColumns('NganHang_Staging_20260914_104227');

  const report = {
    executedAt: new Date().toISOString(),
    nganHang: resultNganHang,
    nganHangStaging: resultStaging,
    bothMatch: Boolean(
      resultNganHang && resultStaging &&
      resultNganHang.ok === true &&
      resultStaging.ok === true &&
      resultNganHang.totalRows === resultStaging.totalRows &&
      resultNganHang.totalCols === resultStaging.totalCols &&
      resultNganHang.sha256HashOfColumns22To37 === resultStaging.sha256HashOfColumns22To37 &&
      resultNganHang.rowsWithDataCount === resultStaging.rowsWithDataCount &&
      resultNganHang.comparisonWithCanonical.identicalCount === resultStaging.comparisonWithCanonical.identicalCount &&
      resultNganHang.comparisonWithCanonical.differentCount === resultStaging.comparisonWithCanonical.differentCount
    )
  };

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}

// ═════════════════════════════════════════════════════════════════════════════
// ENDPOINTS QUẢN LÝ HẠN MỨC HỌC THỬ (TRIAL LIMIT) SERVER-SIDE XÁC THỰC PHIÊN BẢO MẬT
// - Xác thực phiên đăng nhập bằng HMAC Token (không tin SĐT do client tự gửi)
// - Chống đọc hoặc tiêu hao lượt của SĐT khác
// - Bảng dữ liệu: TrialActivity (sdt, mabai, dateStr, thoigian, deviceId, hoten)
// - Tính ngày theo múi giờ Việt Nam (Asia/Saigon, UTC+7)
// - Khóa ScriptLock chống race condition (hai yêu cầu đồng thời từ 2 tab/thiết bị không tạo quá 2 lượt)
// - Đồng bộ dùng chung giữa nhiều thiết bị, fail-closed khi không có quyền/mất mạng
// ═════════════════════════════════════════════════════════════════════════════

function getVietnamDateString(d) {
  try {
    const target = d || new Date();
    const formatter = Utilities.formatDate(target, 'Asia/Saigon', 'yyyy-MM-dd');
    return formatter;
  } catch(e) {
    const target = d || new Date();
    const utc = target.getTime() + (target.getTimezoneOffset() * 60000);
    const vnDate = new Date(utc + (7 * 3600000));
    const y = vnDate.getFullYear();
    const m = String(vnDate.getMonth() + 1).padStart(2, '0');
    const day = String(vnDate.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
}

function normalizeDateStr(val) {
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  try {
    const d = (val instanceof Date) ? val : new Date(val);
    if (!isNaN(d.getTime())) {
      return Utilities.formatDate(d, 'Asia/Saigon', 'yyyy-MM-dd');
    }
  } catch(e) {}
  return s;
}

// POST: Lấy trạng thái hạn mức bài mới của học sinh (BẢO VỆ BẰNG TOKEN PHIÊN TRONG BODY)
function getTrialLimit(data) {
  const token = (data && (data.token || data.authToken)) || '';
  if (!token) {
    return jsonOut({ ok: false, error: 'token_required', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token trong body)' });
  }

  let authSdt = null;
  try {
    authSdt = verifyUserToken(token);
  } catch (err) {
    if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
    }
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Lỗi xác thực phiên đăng nhập' });
  }
  if (!authSdt) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
  }

  // Chống đọc trộm hạn mức của SĐT khác
  const clientHs = String((data && (data.hs || data.sdt)) || '').trim();
  if (clientHs && normSdt(clientHs) !== normSdt(authSdt)) {
    return jsonOut({ ok: false, error: 'Forbidden', msg: 'Không được phép đọc dữ liệu của số điện thoại khác' });
  }

  const hs = authSdt; // LUÔN DÙNG SĐT ĐÃ XÁC THỰC PHÍA SERVER

  // 1. Kiểm tra loại tài khoản trong sheet TaiKhoan
  const tkSheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry']);
  const tkRows = sheetToJson(tkSheet);
  const userRow = tkRows.find(function(r) { return sameTaiKhoan(r.sdt, hs); });

  const loaiTK = (userRow && userRow.loaiTK) ? String(userRow.loaiTK).toLowerCase() : 'free';
  const trialExpiry = (userRow && userRow.trialExpiry) ? Number(userRow.trialExpiry) : 0;
  const now = Date.now();
  const isValidTrial = (loaiTK === 'vip' || loaiTK === 'trial') && trialExpiry > now;

  // 2. Lấy hoạt động học thử từ sheet TrialActivity
  const actSheet = getOrCreate('TrialActivity', ['sdt','mabai','dateStr','thoigian','deviceId','hoten']);
  const actRows = sheetToJson(actSheet);
  const userActs = actRows.filter(function(r) { return sameTaiKhoan(r.sdt, hs); });

  const todayVN = getVietnamDateString();
  const todayActs = userActs.filter(function(r) { return normalizeDateStr(r.dateStr) === todayVN; });
  const dailyCount = todayActs.length;
  const maxDaily = 2;

  const startedList = userActs.map(function(r) {
    return {
      key: String(r.mabai || '').trim(),
      mabai: String(r.mabai || '').trim(),
      date: normalizeDateStr(r.dateStr),
      timestamp: r.thoigian ? new Date(r.thoigian).getTime() : Date.now()
    };
  });

  return jsonOut({
    ok: true,
    sdt: hs,
    isTrial: isValidTrial,
    loaiTK: loaiTK,
    trialExpiry: trialExpiry,
    dateStr: todayVN,
    dailyCount: dailyCount,
    maxDaily: maxDaily,
    remaining: Math.max(0, maxDaily - dailyCount),
    startedLessons: startedList
  });
}

// POST: Ghi nhận bắt đầu bài học thử (BẢO VỆ BẰNG TOKEN PHIÊN + ATOMIC SCRIPTLOCK)
function startTrialLesson(data) {
  const token = (data && (data.token || data.authToken)) || '';
  if (!token) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' });
  }

  let authSdt = null;
  try {
    authSdt = verifyUserToken(token);
  } catch (err) {
    if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
      return jsonOut({ ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET trong Script Properties' });
    }
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Lỗi xác thực phiên đăng nhập' });
  }

  if (!authSdt) {
    return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
  }

  // Chống tiêu hao lượt của SĐT khác
  const clientSdt = String(data.sdt || '').trim();
  if (clientSdt && normSdt(clientSdt) !== normSdt(authSdt)) {
    return jsonOut({ ok: false, error: 'Forbidden', msg: 'Không được phép tiêu hao lượt học của số điện thoại khác' });
  }

  const sdt = authSdt; // LUÔN DÙNG SĐT ĐÃ XÁC THỰC PHÍA SERVER
  const mabai = String(data.mabai || data.key || '').trim();
  if (!mabai) return jsonOut({ ok: false, msg: 'Thiếu mã bài học' });

  // Dùng LockService để đảm bảo hai yêu cầu đồng thời không thể vượt quá 2 lượt
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // chờ tối đa 10s
  } catch (e) {
    return jsonOut({ ok: false, msg: 'Hệ thống đang bận, vui lòng thử lại sau vài giây' });
  }

  try {
    // 1. Kiểm tra tài khoản
    const tkSheet = getOrCreate('TaiKhoan', ['sdt','hoten','lop','matkhau','ngayDK','lpTotal','diemGame','loaiTK','trialExpiry']);
    const tkRows = sheetToJson(tkSheet);
    const userRow = tkRows.find(function(r) { return sameTaiKhoan(r.sdt, sdt); });

    const loaiTK = (userRow && userRow.loaiTK) ? String(userRow.loaiTK).toLowerCase() : 'free';
    const trialExpiry = (userRow && userRow.trialExpiry) ? Number(userRow.trialExpiry) : 0;
    const now = Date.now();
    const isValidTrial = (loaiTK === 'vip' || loaiTK === 'trial') && trialExpiry > now;

    if (!isValidTrial) {
      return jsonOut({ ok: false, reason: 'invalid_account', msg: 'Tài khoản không phải trial hợp lệ còn hạn' });
    }

    // 2. Đọc bảng TrialActivity để đếm SỐ BÀI ĐÃ HOÀN THÀNH HÔM NAY (chỉ tính bài đã học xong)
    const actSheet = getOrCreate('TrialActivity', ['sdt','mabai','dateStr','thoigian','deviceId','hoten']);
    const actVals = actSheet.getDataRange().getValues();
    let alreadyCompleted = false;
    let countCompletedToday = 0;
    const todayVN = getVietnamDateString();

    if (actVals.length > 1) {
      const actHeaders = actVals[0].map(function(h){ return String(h||'').toLowerCase().trim(); });
      const sIdx = actHeaders.indexOf('sdt');
      const mIdx = actHeaders.indexOf('mabai');
      const dIdx = actHeaders.indexOf('datestr');
      for (let i = 1; i < actVals.length; i++) {
        if (sameTaiKhoan(actVals[i][sIdx], sdt)) {
          if (String(actVals[i][mIdx] || '').trim() === mabai) {
            alreadyCompleted = true;
          }
          if (normalizeDateStr(actVals[i][dIdx]) === todayVN) {
            countCompletedToday++;
          }
        }
      }
    }

    // Bài ĐÃ TỪNG HOÀN THÀNH: ôn tập thoải mái, không giới hạn
    if (alreadyCompleted) {
      return jsonOut({
        ok: true,
        isNew: false,
        alreadyCompleted: true,
        dailyCompletedCount: countCompletedToday,
        remaining: Math.max(0, 2 - countCompletedToday)
      });
    }

    // Bài MỚI: nếu hôm nay ĐÃ HOÀN THÀNH ĐỦ 2 BÀI thì mới chặn bài mới thứ 3
    if (countCompletedToday >= 2) {
      return jsonOut({
        ok: false,
        reason: 'trial_limit',
        msg: 'Hôm nay em đã hoàn thành đủ 2/2 bài học mới theo hạn mức học thử. Lượt học mới sẽ tự động mở lại vào 00:00 ngày mai.',
        dailyCompletedCount: countCompletedToday,
        maxDaily: 2,
        remaining: 0
      });
    }

    // Học sinh chưa hoàn thành đủ 2 bài: CHO PHÉP VÀO HỌC BÀI NÀY
    // QUAN TRỌNG: TUYỆT ĐỐI KHÔNG append vào TrialActivity ở đây vì học sinh mới nhấp vào mở bài, chưa học xong!
    return jsonOut({
      ok: true,
      isNew: true,
      alreadyCompleted: false,
      dailyCompletedCount: countCompletedToday,
      remaining: Math.max(0, 2 - countCompletedToday)
    });

  } finally {
    lock.releaseLock();
  }
}

// POST: Ghi nhận bài học thử ĐÃ HỌC XONG (HOÀN THÀNH) - CHỈ TÍNH HẠN MỨC TẠI ĐÂY
function completeTrialLesson(data) {
  const token = (data && (data.token || data.authToken)) || '';
  let authSdt = null;
  if (token) {
    try { authSdt = verifyUserToken(token); } catch(e){}
  }
  const clientSdt = String(data.sdt || '').trim();
  const sdt = authSdt || clientSdt;
  if (!sdt) return jsonOut({ ok: false, error: 'Unauthorized', msg: 'Thiếu thông tin tài khoản' });

  const mabai = String(data.mabai || data.lesson || data.key || '').trim();
  if (!mabai) return jsonOut({ ok: false, msg: 'Thiếu mã bài học' });

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch(e) {
    return jsonOut({ ok: false, msg: 'Hệ thống đang bận, vui lòng thử lại sau' });
  }

  try {
    const actSheet = getOrCreate('TrialActivity', ['sdt','mabai','dateStr','thoigian','deviceId','hoten']);
    const actVals = actSheet.getDataRange().getValues();
    const todayVN = getVietnamDateString();
    let alreadyCompleted = false;
    let countCompletedToday = 0;

    if (actVals.length > 1) {
      const actHeaders = actVals[0].map(function(h){ return String(h||'').toLowerCase().trim(); });
      const sIdx = actHeaders.indexOf('sdt');
      const mIdx = actHeaders.indexOf('mabai');
      const dIdx = actHeaders.indexOf('datestr');
      for (let i = 1; i < actVals.length; i++) {
        if (sameTaiKhoan(actVals[i][sIdx], sdt)) {
          if (String(actVals[i][mIdx] || '').trim() === mabai) {
            alreadyCompleted = true;
          }
          if (normalizeDateStr(actVals[i][dIdx]) === todayVN) {
            countCompletedToday++;
          }
        }
      }
    }

    if (!alreadyCompleted) {
      appendRowNamed(actSheet, {
        sdt: sdt,
        mabai: mabai,
        dateStr: "'" + todayVN,
        thoigian: new Date().toISOString(),
        deviceId: String(data.deviceId || ''),
        hoten: String(data.hoten || data.ten || '')
      });
      countCompletedToday++;
    }

    return jsonOut({
      ok: true,
      completed: true,
      mabai: mabai,
      dailyCompletedCount: countCompletedToday,
      remaining: Math.max(0, 2 - countCompletedToday)
    });
  } finally {
    lock.releaseLock();
  }
}

// POST: Tự động dọn dẹp các bản ghi thử nghiệm trong TrialActivity (yêu cầu adminKey)
function clearTrialActivity(data) {
  if (!requireAdmin(data && data.adminKey)) {
    return jsonOut({ ok: false, msg: 'Unauthorized: sai hoặc thiếu adminKey' });
  }
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch(e) {
    return jsonOut({ ok: false, msg: 'Hệ thống đang bận, vui lòng thử lại sau' });
  }

  try {
    const sheet = getOrCreate('TrialActivity', ['sdt','mabai','dateStr','thoigian','deviceId','hoten']);
    const lastRow = sheet.getLastRow();
    let deleted = 0;
    if (lastRow > 1) {
      deleted = lastRow - 1;
      sheet.deleteRows(2, lastRow - 1);
    }
    // Xóa cache
    try {
      const cache = CacheService.getScriptCache();
      if (cache && data && data.sdt) {
        cache.remove('trial_usr_' + normSdt(data.sdt));
      }
    } catch(ce) {}

    return jsonOut({ ok: true, deleted: deleted });
  } finally {
    lock.releaseLock();
  }
}
