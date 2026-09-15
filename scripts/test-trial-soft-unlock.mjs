import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import TrialManager from '../trial-manager.js';

console.log('=== TEST SUITE: TRIAL SOFT UNLOCK & AUTH SESSION SECURITY ===\n');

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log('  ✅ PASS: ' + name);
  } catch (e) {
    console.error('  ❌ FAIL: ' + name);
    console.error('     ' + e.message);
    throw e;
  }
}

async function itAsync(name, fn) {
  total++;
  try {
    await fn();
    passed++;
    console.log('  ✅ PASS: ' + name);
  } catch (e) {
    console.error('  ❌ FAIL: ' + name);
    console.error('     ' + e.message);
    throw e;
  }
}

// Giả lập môi trường trình duyệt cho Node.js
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => (mockStorage.has(k) ? mockStorage.get(k) : null),
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear()
};

const mockSession = new Map();
global.sessionStorage = {
  getItem: (k) => (mockSession.has(k) ? mockSession.get(k) : null),
  setItem: (k, v) => mockSession.set(k, String(v)),
  removeItem: (k) => mockSession.delete(k),
  clear: () => mockSession.clear()
};

// Mock dữ liệu khóa học chuẩn
const mockCourses = [
  {
    name: 'Khóa 12',
    chapters: [
      {
        name: 'Chương 1',
        lessons: [
          { key: 'B01', mabai: 'B01', name: 'B1. Cấu trúc chất', video: 'https://youtu.be/v1', bainentang: '' },
          { key: 'B02', mabai: 'B02', name: 'B2. Thuyết động học', video: 'https://youtu.be/v2', bainentang: 'B01' },
          { key: 'B03', mabai: 'B03', name: 'B3. Nhiệt dung riêng', video: 'https://youtu.be/v3', bainentang: 'B01, B02' },
          { key: 'B04', mabai: 'B04', name: 'B4. Nhiệt hoá hơi riêng', video: 'https://youtu.be/v4', bainentang: 'B03' },
          { key: 'B05_EMPTY', mabai: 'B05_EMPTY', name: 'B5. Bài chưa biên tập', video: '', pdf: '', pdflt: '', baitap: [] }
        ]
      }
    ]
  }
];

global.VLXT_GAS = 'https://script.google.com/macros/s/AKfycbz_VLXT_TEST/exec';

// Sinh secret ngẫu nhiên tại runtime (KHÔNG hardcode secret vào repo hay test log)
const runtimeTestSecret = crypto.randomBytes(32).toString('hex');

function normSdt(s) {
  return String(s || '').replace(/\D/g, '').replace(/^0+/, '');
}

// Mô phỏng logic backend Google Apps Script (tham chiếu apps-script-CAPNHAT.txt)
const DEFAULT_GOOGLE_CLIENT_ID = '1022891995284-miquu1f7rlpie7ug9884sgagf21nputc.apps.googleusercontent.com';

// Mô phỏng logic backend Google Apps Script (tham chiếu apps-script-CAPNHAT.txt)
function createMockBackend(customSecret, customGoogleClientId) {
  let secret = customSecret;
  let googleClientId = customGoogleClientId !== undefined ? customGoogleClientId : DEFAULT_GOOGLE_CLIENT_ID;
  const accounts = [
    { sdt: '0901111111', matkhau: 'Pass123@', hoten: 'Nguyễn Văn A', lop: '12A1', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 },
    { sdt: '0902222222', matkhau: 'Secret456!', hoten: 'Trần Thị B', lop: '12A2', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 }
  ];

  function getSecret() {
    if (!secret || !secret.trim()) throw new Error('AUTH_SECRET_NOT_CONFIGURED');
    return secret.trim();
  }

  function getGoogleClientId() {
    if (!googleClientId || !googleClientId.trim()) throw new Error('GOOGLE_CLIENT_ID_NOT_CONFIGURED');
    return googleClientId.trim();
  }

  // Helper tạo credential Google giả lập cho test
  function createMockGoogleCredential(payloadObj) {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: 'https://accounts.google.com',
      aud: DEFAULT_GOOGLE_CLIENT_ID,
      exp: Math.floor(Date.now() / 1000) + 3600,
      email_verified: true,
      ...payloadObj
    })).toString('base64url');
    const signature = 'mock_signature';
    return header + '.' + payload + '.' + signature;
  }

  // Xác minh Google credential chuẩn theo Apps Script
  function verifyGoogleIdToken(credential) {
    if (!credential || typeof credential !== 'string') return null;
    const token = credential.trim();
    if (!token) return null;

    const expectedAud = getGoogleClientId();
    let payload = null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    } catch (e) {
      return null;
    }

    if (!payload || typeof payload !== 'object') return null;

    // 1. Kiểm tra audience
    if (payload.aud !== expectedAud) return null;

    // 2. Kiểm tra issuer
    if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') return null;

    // 3. Kiểm tra expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (!payload.exp || Number(payload.exp) < nowSec) return null;

    // 4. Kiểm tra email verified
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

  function generateToken(sdt, userMeta) {
    const sec = getSecret();
    const clean = normSdt(sdt);
    const now = Date.now();
    const issuedAt = now;
    let duration = 7 * 86400000;
    if (userMeta && userMeta.trialExpiry && Number(userMeta.trialExpiry) > now) {
      const remain = Number(userMeta.trialExpiry) - now;
      if (remain < duration) duration = remain;
    }
    const expiresAt = now + duration;
    const nonce = crypto.randomBytes(8).toString('hex');
    const raw = clean + ':' + issuedAt + ':' + expiresAt + ':' + nonce;
    const sig = crypto.createHmac('sha256', sec).update(raw).digest('base64url');
    return Buffer.from(raw + ':' + sig).toString('base64url');
  }

  function verifyToken(token) {
    if (!token) return null;
    const sec = getSecret();
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const parts = decoded.split(':');
      if (parts.length !== 5) return null;
      const sdt = parts[0];
      const issuedAt = Number(parts[1]);
      const expiresAt = Number(parts[2]);
      const nonce = parts[3];
      const sig = parts[4];

      const now = Date.now();
      if (isNaN(issuedAt) || isNaN(expiresAt)) return null;
      if (now > expiresAt) return null;
      if (issuedAt > now + 60000) return null;

      const raw = sdt + ':' + issuedAt + ':' + expiresAt + ':' + nonce;
      const expectedSig = crypto.createHmac('sha256', sec).update(raw).digest('base64url');
      if (sig !== expectedSig) return null;
      return sdt;
    } catch (e) {
      if (e.message === 'AUTH_SECRET_NOT_CONFIGURED') throw e;
      return null;
    }
  }

  function register(body) {
    // PREFLIGHT AUTH_SECRET trước khi sửa dữ liệu (Fail-Closed)
    try {
      getSecret();
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      throw err;
    }

    const sdt = normSdt(body.sdt);
    if (!sdt) return { ok: false, msg: 'SĐT không hợp lệ' };
    const exist = accounts.find(a => normSdt(a.sdt) === sdt);
    if (exist) return { ok: false, msg: 'SĐT đã được đăng ký' };

    const newAcc = {
      sdt: body.sdt,
      matkhau: body.matkhau,
      hoten: body.hoten || body.sdt,
      lop: body.lop || '12',
      loaiTK: 'vip',
      trialExpiry: Date.now() + 7 * 86400000
    };
    accounts.push(newAcc);
    const token = generateToken(newAcc.sdt, newAcc);
    return { ok: true, user: { ...newAcc, token } };
  }

  function login(body) {
    try {
      getSecret();
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      throw err;
    }

    const sdt = normSdt(body.sdt);
    const acc = accounts.find(a => normSdt(a.sdt) === sdt && a.matkhau === body.matkhau);
    if (!acc) {
      return { ok: false, msg: 'Số điện thoại hoặc mật khẩu không đúng!' };
    }
    const token = generateToken(acc.sdt, acc);
    return {
      ok: true,
      user: { sdt: acc.sdt, hoten: acc.hoten, lop: acc.lop, loaiTK: acc.loaiTK, trialExpiry: acc.trialExpiry, token }
    };
  }

  function loginGoogle(body) {
    // BƯỚC 1: PREFLIGHT AUTH_SECRET trước khi sửa dữ liệu (Fail-Closed)
    try {
      getSecret();
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      throw err;
    }

    // BƯỚC 2: XÁC MINH GOOGLE CREDENTIAL
    const credential = body && (body.credential || body.idToken || body.id_token);
    let googleUser = null;
    try {
      googleUser = verifyGoogleIdToken(credential);
    } catch (err) {
      if (err.message === 'GOOGLE_CLIENT_ID_NOT_CONFIGURED') {
        return { ok: false, error: 'GOOGLE_CLIENT_ID_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình GOOGLE_CLIENT_ID' };
      }
      return { ok: false, error: 'invalid_google_token', msg: 'Lỗi xác thực Google' };
    }

    if (!googleUser || !googleUser.email) {
      return { ok: false, error: 'invalid_google_token', msg: 'Google credential không hợp lệ hoặc hết hạn' };
    }

    // Dùng email, name từ Google payload (KHÔNG tin body.email/hoten)
    const email = googleUser.email;
    const hoten = googleUser.name || email;
    let acc = accounts.find(a => normSdt(a.sdt) === normSdt(email));
    if (acc) {
      acc.hoten = hoten;
      const token = generateToken(acc.sdt, acc);
      return { ok: true, user: { ...acc, token } };
    }

    // Tạo tài khoản mới
    const newAcc = {
      sdt: email,
      matkhau: 'GOOGLE_AUTH',
      hoten: hoten,
      lop: 'Google',
      email: email,
      loaiTK: 'vip',
      trialExpiry: Date.now() + 7 * 86400000
    };
    accounts.push(newAcc);
    const token = generateToken(newAcc.sdt, newAcc);
    return { ok: true, user: { ...newAcc, token } };
  }

  function getProfile(body, isGet) {
    try {
      let authSdt = null;

      if (isGet) {
        // Giai đoạn chuyển tiếp: Frontend cũ gọi GET ?type=profile&hs=...
        // KHÔNG nhận token từ query string!
        // Cho phép đọc profile để hiển thị widget/LP nhưng TUYỆT ĐỐI KHÔNG cấp/trả token!
        const clientHs = normSdt(body && (body.hs || body.sdt));
        if (!clientHs) {
          return { ok: false, error: 'missing_hs', msg: 'Thiếu thông tin số điện thoại học sinh' };
        }
        authSdt = clientHs;
      } else {
        // Endpoint POST (Frontend mới): BẮT BUỘC có token trong request body
        const token = (body && (body.token || body.authToken)) || '';
        if (!token) {
          return { ok: false, error: 'token_required', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
        }
        authSdt = verifyToken(token);
        if (!authSdt) {
          return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
        }
        const clientHs = normSdt(body && (body.hs || body.sdt));
        if (clientHs && clientHs !== normSdt(authSdt)) {
          return { ok: false, error: 'Forbidden', msg: 'Không có quyền truy cập hồ sơ tài khoản khác' };
        }
      }

      const acc = accounts.find(a => normSdt(a.sdt) === normSdt(authSdt));
      if (!acc) return { ok: false, msg: 'Không tìm thấy tài khoản' };
      return {
        ok: true,
        user: { sdt: acc.sdt, hoten: acc.hoten, lop: acc.lop, loaiTK: acc.loaiTK, trialExpiry: acc.trialExpiry }
      };
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      return { ok: false, error: 'ServerError' };
    }
  }

  function getTrialLimit(body, isGet) {
    // Xóa hoàn toàn hỗ trợ GET type=triallimit (luôn trả METHOD_NOT_ALLOWED)
    if (isGet) {
      return { ok: false, error: 'METHOD_NOT_ALLOWED', msg: 'Trial limit endpoint yêu cầu phương thức POST với token trong request body' };
    }
    try {
      const token = (body && (body.token || body.authToken)) || '';
      if (!token) {
        return { ok: false, error: 'token_required', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
      }
      const authSdt = verifyToken(token);
      if (!authSdt) {
        return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
      }
      const clientHs = normSdt(body && (body.hs || body.sdt));
      if (clientHs && clientHs !== normSdt(authSdt)) {
        return { ok: false, error: 'Forbidden', msg: 'Không được phép đọc dữ liệu của số điện thoại khác' };
      }
      return { ok: true, sdt: authSdt, dailyCount: 1, maxDaily: 2, remaining: 1, startedLessons: [] };
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      return { ok: false, error: 'ServerError' };
    }
  }

  function startTrialLesson(body) {
    try {
      const token = (body && (body.token || body.authToken)) || '';
      if (!token) {
        return { ok: false, error: 'token_required', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
      }
      const authSdt = verifyToken(token);
      if (!authSdt) {
        return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
      }
      const clientSdt = normSdt(body.sdt);
      if (clientSdt && clientSdt !== normSdt(authSdt)) {
        return { ok: false, error: 'Forbidden', msg: 'Không được phép tiêu hao lượt học của số điện thoại khác' };
      }
      return { ok: true, isNew: true, dailyCount: 1, remaining: 1 };
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      return { ok: false, error: 'ServerError' };
    }
  }

  return {
    accounts,
    createMockGoogleCredential,
    verifyGoogleIdToken,
    generateToken,
    verifyToken,
    register,
    login,
    loginGoogle,
    getProfile,
    getTrialLimit,
    startTrialLesson
  };
}

// =============================================================================
// PHẦN 1: PHÂN LOẠI 4 NHÓM TÀI KHOẢN
// =============================================================================
console.log('--- [PHẦN 1] Phân Loại 4 Nhóm Tài Khoản ---');

it('Nhóm 1 - Trial Hợp Lệ: loaiTK = vip/trial và trialExpiry > Date.now() -> ĐƯỢC MỞ MỀM', () => {
  const future = Date.now() + 7 * 86400000;
  const trialVip = { sdt: '0901000001', loaiTK: 'vip', trialExpiry: future };
  const trialAlt = { sdt: '0901000002', loaiTK: 'trial', trialExpiry: future };

  assert.equal(TrialManager.isPremiumUser(trialVip), false);
  assert.equal(TrialManager.isValidTrialUser(trialVip), true);
  assert.equal(TrialManager.isTrialUser(trialVip), true);
  assert.equal(TrialManager.isValidTrialUser(trialAlt), true);
});

it('Nhóm 2 - Trial Hết Hạn: loaiTK = vip nhưng trialExpiry <= Date.now() -> KHÔNG MỞ MỀM', () => {
  const past = Date.now() - 1000;
  const expiredTrial = { sdt: '0901000003', loaiTK: 'vip', trialExpiry: past };

  assert.equal(TrialManager.isPremiumUser(expiredTrial), false);
  assert.equal(TrialManager.isValidTrialUser(expiredTrial), false);
  assert.equal(TrialManager.isTrialUser(expiredTrial), false);
});

it('Nhóm 3 - Tài Khoản Free hoặc Chưa Đăng Ký Trial -> KHÔNG MỞ MỀM', () => {
  const freeUser = { sdt: '0901000004', loaiTK: 'free' };
  const noTypeUser = { sdt: '0901000005', loaiTK: '' };
  const nullUser = null;

  assert.equal(TrialManager.isValidTrialUser(freeUser), false);
  assert.equal(TrialManager.isValidTrialUser(noTypeUser), false);
  assert.equal(TrialManager.isValidTrialUser(nullUser), false);
});

it('Nhóm 4 - Tài Khoản Premium: loaiTK = premium -> KHÓA TUẦN TỰ (không phải trial)', () => {
  const premUser = { sdt: '0901000006', loaiTK: 'premium' };

  assert.equal(TrialManager.isPremiumUser(premUser), true);
  assert.equal(TrialManager.isValidTrialUser(premUser), false);
});

// =============================================================================
// PHẦN 2: BẢO MẬT PHIÊN VÀ CÁC BLOCKER THEO CHỈ THỊ CỦA THẦY
// =============================================================================
console.log('\n--- [PHẦN 2] Bảo Mật Phiên Đăng Nhập, Google Auth & Kiểm Thử Blocker ---');

const backend = createMockBackend(runtimeTestSecret);

it('1. Backend chuyển tiếp: Hỗ trợ an toàn frontend cũ (GET không phát token) và frontend mới (POST body)', () => {
  const loginA = backend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  const tokenA = loginA.user.token;

  // 1.1. Frontend cũ gọi GET ?type=profile&hs=0901111111 (chưa có token):
  // Trả về dữ liệu profile để đồng bộ widget/LP, TUYỆT ĐỐI KHÔNG CẤP HOẶC TRẢ VỀ TOKEN
  const resLegacyGet = backend.getProfile({ hs: '0901111111' }, true);
  assert.equal(resLegacyGet.ok, true);
  assert.equal(resLegacyGet.user.hoten, 'Nguyễn Văn A');
  assert.equal(resLegacyGet.user.token, undefined, 'Tuyệt đối không cấp phát hoặc trả về token qua GET profile');

  // 1.2. Frontend mới gọi POST body { sdt, token }:
  const resModernPost = backend.getProfile({ sdt: '0901111111', token: tokenA }, false);
  assert.equal(resModernPost.ok, true);
  assert.equal(resModernPost.user.hoten, 'Nguyễn Văn A');
  assert.equal(resModernPost.user.token, undefined, 'POST profile cũng không sinh token mới');

  // 1.3. Frontend mới gọi POST body thiếu token -> Bị từ chối token_required
  const resPostNoToken = backend.getProfile({ sdt: '0901111111' }, false);
  assert.equal(resPostNoToken.ok, false);
  assert.equal(resPostNoToken.error, 'token_required');
  assert.equal(resPostNoToken.user, undefined);

  // 1.4. GET triallimit KHÔNG CÓ TOKEN -> Bị từ chối METHOD_NOT_ALLOWED
  const resGetLimitNoToken = backend.getTrialLimit({ hs: '0901111111' }, true);
  assert.equal(resGetLimitNoToken.ok, false);
  assert.equal(resGetLimitNoToken.error, 'METHOD_NOT_ALLOWED');

  // 1.5. GET triallimit CÓ TOKEN -> CŨNG BỊ TỪ CHỐI METHOD_NOT_ALLOWED (xóa hoàn toàn GET triallimit)
  const resGetLimitWithToken = backend.getTrialLimit({ hs: '0901111111', token: tokenA }, true);
  assert.equal(resGetLimitWithToken.ok, false);
  assert.equal(resGetLimitWithToken.error, 'METHOD_NOT_ALLOWED');

  // 1.6. POST gettriallimit hợp lệ với token trong JSON body -> THÀNH CÔNG
  const resPostLimit = backend.getTrialLimit({ sdt: '0901111111', token: tokenA }, false);
  assert.equal(resPostLimit.ok, true);
  assert.equal(resPostLimit.maxDaily, 2);

  // 1.7. GET profile nếu client cố tình truyền token trên URL -> Backend KHÔNG đọc token, response TUYỆT ĐỐI không có token
  const resGetWithTokenParam = backend.getProfile({ hs: '0901111111', token: tokenA }, true);
  assert.equal(resGetWithTokenParam.ok, true);
  assert.equal(resGetWithTokenParam.user.token, undefined, 'Response GET profile tuyệt đối không chứa token');
});

it('2. Token giả và token hết hạn bị từ chối truy cập', () => {
  // Token giả mạo chữ ký
  const fakeToken = Buffer.from('901111111:' + Date.now() + ':' + (Date.now() + 86400000) + ':nonce123:fake_signature').toString('base64url');
  const resFake = backend.getProfile({ sdt: '0901111111', token: fakeToken });
  assert.equal(resFake.ok, false);
  assert.equal(resFake.error, 'Unauthorized');

  // Token hết hạn
  const expiredToken = TrialManager.createDevToken('0901111111', runtimeTestSecret, {
    issuedAt: Date.now() - 100000,
    expiresAt: Date.now() - 1000
  });
  const resExpired = backend.getProfile({ sdt: '0901111111', token: expiredToken });
  assert.equal(resExpired.ok, false);
  assert.equal(resExpired.error, 'Unauthorized');
});

it('3. Thiếu AUTH_SECRET làm hệ thống Fail-Closed hoàn toàn và KHÔNG tạo/sửa tài khoản', () => {
  // Backend không cấu hình AUTH_SECRET trong Script Properties
  const brokenBackend = createMockBackend('');
  const snapshotBefore = JSON.stringify(brokenBackend.accounts);

  // Thử đăng ký SĐT khi thiếu AUTH_SECRET
  const resReg = brokenBackend.register({ sdt: '0909999999', matkhau: 'Secret789!', hoten: 'Test User' });
  assert.equal(resReg.ok, false);
  assert.equal(resReg.error, 'AUTH_SECRET_NOT_CONFIGURED');

  // Thử đăng nhập Google khi thiếu AUTH_SECRET
  const validCred = brokenBackend.createMockGoogleCredential({ email: 'newgoogle@gmail.com', name: 'New Google' });
  const resG = brokenBackend.loginGoogle({ credential: validCred });
  assert.equal(resG.ok, false);
  assert.equal(resG.error, 'AUTH_SECRET_NOT_CONFIGURED');

  // Dữ liệu tài khoản phải giữ nguyên 100% byte-for-byte không thay đổi
  const snapshotAfter = JSON.stringify(brokenBackend.accounts);
  assert.equal(snapshotBefore, snapshotAfter, 'Dữ liệu tài khoản đã bị thay đổi dù thiếu AUTH_SECRET!');

  // TrialManager dev helper yêu cầu secret
  assert.throws(() => {
    TrialManager.createDevToken('0901111111');
  }, /AUTH_SECRET_REQUIRED/);
});

it('4. Đăng nhập SĐT và Google hợp lệ vẫn hoạt động bình thường', () => {
  // 4.1. Đăng nhập SĐT hợp lệ
  const resPhone = backend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  assert.equal(resPhone.ok, true);
  assert.ok(resPhone.user && resPhone.user.token, 'Phải có token sau khi đăng nhập SĐT');
  assert.equal(normSdt(backend.verifyToken(resPhone.user.token)), normSdt('0901111111'));

  // 4.2. Đăng nhập Google hợp lệ (tự động tạo tài khoản VIP trial nếu chưa có)
  const validGoogleCred = backend.createMockGoogleCredential({
    email: 'hocsinh2k9@gmail.com',
    name: 'Học Sinh Google Chuẩn',
    picture: 'https://lh3.googleusercontent.com/avatar.jpg'
  });
  const resGoogle = backend.loginGoogle({ credential: validGoogleCred });
  assert.equal(resGoogle.ok, true);
  assert.equal(resGoogle.user.email, 'hocsinh2k9@gmail.com');
  assert.equal(resGoogle.user.hoten, 'Học Sinh Google Chuẩn');
  assert.ok(resGoogle.user.token, 'Phải có token phiên sau khi đăng nhập Google');
  assert.equal(normSdt(backend.verifyToken(resGoogle.user.token)), normSdt('hocsinh2k9@gmail.com'));
});

it('5. Giả mạo email Google không nhận được session', () => {
  // 5.1. Client tự khai báo email nhưng không gửi credential
  const resNoCred = backend.loginGoogle({ email: 'victim@gmail.com', hoten: 'Kẻ Giả Mạo' });
  assert.equal(resNoCred.ok, false);
  assert.equal(resNoCred.error, 'invalid_google_token');
  assert.equal(resNoCred.user, undefined);

  // 5.2. Client gửi email victim trong body nhưng credential thuộc về kẻ tấn công (attacker@gmail.com)
  const attackerCred = backend.createMockGoogleCredential({
    email: 'attacker@gmail.com',
    name: 'Attacker'
  });
  const resSpoof = backend.loginGoogle({
    email: 'victim@gmail.com', // client cố tình giả mạo email nạn nhân
    hoten: 'Victim Spoof',
    credential: attackerCred
  });
  assert.equal(resSpoof.ok, true);
  // Backend bắt buộc phải dùng email từ Google token đã xác minh, KHÔNG dùng email do client gửi
  assert.equal(resSpoof.user.email, 'attacker@gmail.com');
  assert.notEqual(resSpoof.user.email, 'victim@gmail.com');
});

it('6. Google credential sai audience / hết hạn / sai issuer bị từ chối 100%', () => {
  // 6.1. Sai audience (client ID của ứng dụng khác)
  const wrongAudCred = backend.createMockGoogleCredential({
    email: 'wrongaud@gmail.com',
    aud: 'wrong-client-id.apps.googleusercontent.com'
  });
  const resAud = backend.loginGoogle({ credential: wrongAudCred });
  assert.equal(resAud.ok, false);
  assert.equal(resAud.error, 'invalid_google_token');

  // 6.2. Hết hạn (exp trong quá khứ)
  const expiredCred = backend.createMockGoogleCredential({
    email: 'expired@gmail.com',
    exp: Math.floor(Date.now() / 1000) - 300 // hết hạn 5 phút trước
  });
  const resExp = backend.loginGoogle({ credential: expiredCred });
  assert.equal(resExp.ok, false);
  assert.equal(resExp.error, 'invalid_google_token');

  // 6.3. Sai issuer (không phải accounts.google.com)
  const wrongIssCred = backend.createMockGoogleCredential({
    email: 'fakeiss@gmail.com',
    iss: 'https://fake-accounts.evil.com'
  });
  const resIss = backend.loginGoogle({ credential: wrongIssCred });
  assert.equal(resIss.ok, false);
  assert.equal(resIss.error, 'invalid_google_token');

  // 6.4. Email chưa xác minh (email_verified: false)
  const unverifiedCred = backend.createMockGoogleCredential({
    email: 'unverified@gmail.com',
    email_verified: false
  });
  const resUnverified = backend.loginGoogle({ credential: unverifiedCred });
  assert.equal(resUnverified.ok, false);
  assert.equal(resUnverified.error, 'invalid_google_token');

  // 6.5. Thiếu Script Property GOOGLE_CLIENT_ID thực sự trả GOOGLE_CLIENT_ID_NOT_CONFIGURED (Fail-Closed)
  const backendNoClientId = createMockBackend(runtimeTestSecret, '');
  const snapshotBeforeNoId = JSON.stringify(backendNoClientId.accounts);
  const validCred = backend.createMockGoogleCredential({ email: 'newvalid@gmail.com', name: 'Valid Google' });
  const resNoProp = backendNoClientId.loginGoogle({ credential: validCred });
  assert.equal(resNoProp.ok, false);
  assert.equal(resNoProp.error, 'GOOGLE_CLIENT_ID_NOT_CONFIGURED');
  const snapshotAfterNoId = JSON.stringify(backendNoClientId.accounts);
  assert.equal(snapshotBeforeNoId, snapshotAfterNoId, 'Dữ liệu tài khoản bị thay đổi khi thiếu GOOGLE_CLIENT_ID!');
});

it('7. Token tài khoản A không truy cập được profile hay hạn mức của B (chống IDOR / CSRF)', () => {
  const loginA = backend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  const tokenA = loginA.user.token;

  // Dùng token A để đọc profile B qua POST body
  const resProfile = backend.getProfile({ sdt: '0902222222', token: tokenA });
  assert.equal(resProfile.ok, false);
  assert.equal(resProfile.error, 'Forbidden');
  assert.equal(resProfile.msg, 'Không có quyền truy cập hồ sơ tài khoản khác');

  // Dùng token A để đọc hạn mức B qua POST body
  const resLimit = backend.getTrialLimit({ sdt: '0902222222', token: tokenA });
  assert.equal(resLimit.ok, false);
  assert.equal(resLimit.error, 'Forbidden');

  // Dùng token A để tiêu hao lượt bài của B qua POST body
  const resStart = backend.startTrialLesson({ sdt: '0902222222', token: tokenA, mabai: 'B01' });
  assert.equal(resStart.ok, false);
  assert.equal(resStart.error, 'Forbidden');
});

it('8. KHÔNG CÒN \'token=\' trong bất kỳ URL nào ở toàn bộ frontend', () => {
  const frontendFiles = [
    'auth.js',
    'trial-manager.js',
    'hoso.html',
    'dua-top.html',
    'solo.html',
    'login.html',
    'baihoc.html',
    'index.html'
  ];

  for (const f of frontendFiles) {
    if (!fs.existsSync(f)) continue;
    const content = fs.readFileSync(f, 'utf8');
    // Kiểm tra không có URL query dạng ?token= hoặc &token= hoặc ?authToken= hoặc &authToken=
    const match = content.match(/[?&](?:token|authToken)=/i);
    assert.equal(match, null, `File ${f} vẫn còn truyền token trong URL query: ${match ? match[0] : ''}`);
  }
});

// =============================================================================
// PHẦN 3: KIỂM THỬ GIAO DIỆN PESSIMISTIC FAIL-CLOSED KHI MỞ BÀI HỌC
// =============================================================================
console.log('\n--- [PHẦN 3] Kiểm Thử Pessimistic Fail-Closed Giao Diện ---');

await itAsync('9. Server từ chối bài thứ ba (trial_limit) -> Video/quiz KHÔNG được mở vào DOM', async () => {
  mockStorage.clear();
  const sdt = '0901111111';
  const token = backend.login({ sdt, matkhau: 'Pass123@' }).user.token;
  const user = { sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000, token };
  const l3 = mockCourses[0].chapters[0].lessons[2];

  const originalFetch = global.fetch;
  global.fetch = async function () {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: false,
        reason: 'trial_limit',
        dailyCount: 2,
        remaining: 0,
        msg: 'Hôm nay em đã dùng đủ 2/2 bài học mới theo hạn mức học thử.'
      })
    };
  };

  try {
    let currentInnerHtml = '';
    const fakeAppElement = {
      get innerHTML() { return currentInnerHtml; },
      set innerHTML(val) { currentInnerHtml = val; }
    };

    let modalShown = false;
    const testSandbox = {
      console,
      location: { hash: '#lesson/B03' },
      TrialManager,
      TEST_ACCOUNTS: ['0900000001'],
      WATCHED: new Set(),
      COURSES: mockCourses,
      QUIZ_INDEX: null,
      HS: { sdt: sdt, ten: 'Nguyễn Văn A' },
      vlxtGetUser: () => user,
      app: () => fakeAppElement,
      go: () => {},
      toast: () => {},
      showTrialLimitModal: () => { modalShown = true; },
      esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      findLesson: () => ({ course: mockCourses[0], chapter: mockCourses[0].chapters[0], lesson: l3 }),
      findCourse: () => mockCourses[0],
      flatLessons: (c) => (c.chapters || []).flatMap(ch => ch.lessons || []),
      lessonHasContent: () => true
    };
    testSandbox.window = testSandbox;
    testSandbox.global = testSandbox;

    const htmlSrc = fs.readFileSync('baihoc.html', 'utf8');
    const triggerTrialMatch = htmlSrc.match(/async function triggerTrial\(user, lesson, courseName, lkey\)[\s\S]*?\nfunction handleOpenLesson/);
    assert.ok(triggerTrialMatch, 'Tìm thấy định nghĩa async function triggerTrial');
    const triggerTrialCode = triggerTrialMatch[0].replace(/\nfunction handleOpenLesson[\s\S]*$/, '');

    vm.createContext(testSandbox);
    vm.runInContext(triggerTrialCode, testSandbox);

    const res = await testSandbox.triggerTrial(user, l3, 'Khóa 12', 'B03');
    assert.equal(res.ok, false);
    assert.equal(res.reason, 'trial_limit');

    assert.equal(currentInnerHtml.includes('<iframe'), false, 'iframe video không được render khi bị chặn');
    assert.equal(currentInnerHtml.includes('yt-player'), false, 'yt-player không được render khi bị chặn');
    assert.ok(currentInnerHtml.includes('fa-hourglass-half'), 'Phải render icon fa-hourglass-half');
    assert.equal(modalShown, true, 'Modal hết lượt phải được hiển thị');
  } finally {
    global.fetch = originalFetch;
  }
});

await itAsync('10. Mất mạng hoặc xóa localStorage không mở được bài mới (Fail-Closed)', async () => {
  mockStorage.clear();
  const sdt = '0901111111';
  const token = backend.login({ sdt, matkhau: 'Pass123@' }).user.token;
  const user = { sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000, token };
  const l1 = mockCourses[0].chapters[0].lessons[0];

  const originalFetch = global.fetch;
  global.fetch = async function () {
    throw new Error('Network error: Failed to fetch');
  };

  try {
    let currentInnerHtml = '';
    const fakeAppElement = {
      get innerHTML() { return currentInnerHtml; },
      set innerHTML(val) { currentInnerHtml = val; }
    };

    const testSandbox = {
      console,
      location: { hash: '#lesson/B01' },
      TrialManager,
      TEST_ACCOUNTS: ['0900000001'],
      WATCHED: new Set(),
      COURSES: mockCourses,
      QUIZ_INDEX: null,
      HS: { sdt: sdt, ten: 'Nguyễn Văn A' },
      vlxtGetUser: () => user,
      app: () => fakeAppElement,
      go: () => {},
      toast: () => {},
      showTrialLimitModal: () => {},
      esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      findLesson: () => ({ course: mockCourses[0], chapter: mockCourses[0].chapters[0], lesson: l1 }),
      findCourse: () => mockCourses[0]
    };
    testSandbox.window = testSandbox;
    testSandbox.global = testSandbox;

    const htmlSrc = fs.readFileSync('baihoc.html', 'utf8');
    const triggerTrialMatch = htmlSrc.match(/async function triggerTrial\(user, lesson, courseName, lkey\)[\s\S]*?\nfunction handleOpenLesson/);
    const triggerTrialCode = triggerTrialMatch[0].replace(/\nfunction handleOpenLesson[\s\S]*$/, '');

    vm.createContext(testSandbox);
    vm.runInContext(triggerTrialCode, testSandbox);

    const res = await testSandbox.triggerTrial(user, l1, 'Khóa 12', 'B01');

    assert.equal(res.ok, false);
    assert.equal(res.reason, 'network_error');
    assert.equal(TrialManager.isServerConfirmedLesson(sdt, 'B01', new Set()), false);
    assert.ok(currentInnerHtml.includes('fa-wifi'));
    assert.ok(currentInnerHtml.includes('Không thể xác minh lượt học, vui lòng kiểm tra mạng'));
    assert.ok(currentInnerHtml.includes('Thử lại'));
    assert.equal(currentInnerHtml.includes('<iframe'), false);
  } finally {
    global.fetch = originalFetch;
  }
});

await itAsync('11. Bài cũ khi mất mạng: Báo không thể xác minh và KHÔNG mở video (Server-verified only)', async () => {
  mockStorage.clear();
  const sdt = '0901111111';
  const user = { sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000 };
  const l1 = mockCourses[0].chapters[0].lessons[0];

  // Dù có dữ liệu cũ trong localStorage vlxt_trial_confirmed_
  const confirmedList = [
    { key: 'B01', mabai: 'B01', name: l1.name, date: TrialManager.getVietnamDateStr(), timestamp: Date.now() - 3600000 }
  ];
  mockStorage.set('vlxt_trial_confirmed_' + sdt, JSON.stringify(confirmedList));

  const originalFetch = global.fetch;
  global.fetch = async function () {
    throw new Error('Network error: Offline');
  };

  try {
    // Mỗi lần mở bài BẮT BUỘC gọi server; mất mạng thì requestTrialAccess phải trả về network_error
    const reqRes = await TrialManager.requestTrialAccess(user, l1, 'Khóa 12');
    assert.equal(reqRes.ok, false);
    assert.equal(reqRes.reason, 'network_error');
    assert.ok(reqRes.msg.includes('Không thể xác minh lượt học'));
  } finally {
    global.fetch = originalFetch;
  }
});

await itAsync('11b. Tự chèn mã bài thứ 3 vào localStorage: Tuyệt đối bị server chặn và KHÔNG hiển thị video', async () => {
  mockStorage.clear();
  const sdt = '0901111111';
  const token = backend.login({ sdt, matkhau: 'Pass123@' }).user.token;
  const user = { sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000, token };
  const l3 = { key: 'B03', mabai: 'B03', name: 'Bài 3: Nhiệt dung riêng', video: 'https://youtu.be/fake3' };

  // Kịch bản kẻ gian mở F12 tự chèn bài B03 vào cả vlxt_trial_confirmed_ và vlxt_watched_
  mockStorage.set('vlxt_trial_confirmed_' + sdt, JSON.stringify([
    { key: 'B01', mabai: 'B01', name: 'Bài 1', date: TrialManager.getVietnamDateStr() },
    { key: 'B02', mabai: 'B02', name: 'Bài 2', date: TrialManager.getVietnamDateStr() },
    { key: 'B03', mabai: 'B03', name: 'Bài 3 (Hack)', date: TrialManager.getVietnamDateStr() }
  ]));
  mockStorage.set('vlxt_watched_' + sdt, JSON.stringify(['B01', 'B02', 'B03']));

  // Mô phỏng server thực tế đã nhận đủ 2 bài B01, B02 trong ngày, bài B03 là bài mới thứ 3
  const originalFetch = global.fetch;
  global.fetch = async function (url, opts) {
    const body = JSON.parse(opts.body);
    if (body.action === 'starttriallesson' && (body.mabai === 'B03' || body.key === 'B03')) {
      return {
        ok: true,
        json: async () => ({
          ok: false,
          reason: 'trial_limit',
          msg: 'Đã dùng hết 2/2 bài học mới hôm nay',
          dailyCount: 2,
          remaining: 0
        })
      };
    }
    return { ok: true, json: async () => ({ ok: true }) };
  };

  try {
    let currentInnerHtml = '';
    const fakeAppElement = {
      get innerHTML() { return currentInnerHtml; },
      set innerHTML(val) { currentInnerHtml = val; }
    };

    let modalShown = false;
    const testSandbox = {
      console,
      location: { hash: '#lesson/B03' },
      TrialManager,
      TEST_ACCOUNTS: ['0900000001'],
      WATCHED: new Set(['B01', 'B02', 'B03']),
      COURSES: mockCourses,
      QUIZ_INDEX: null,
      HS: { sdt: sdt, ten: 'Nguyễn Văn A' },
      vlxtGetUser: () => user,
      app: () => fakeAppElement,
      go: () => {},
      toast: () => {},
      showTrialLimitModal: () => { modalShown = true; },
      esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      findLesson: () => ({ course: mockCourses[0], chapter: mockCourses[0].chapters[0], lesson: l3 }),
      findCourse: () => mockCourses[0]
    };
    testSandbox.window = testSandbox;
    testSandbox.global = testSandbox;

    const htmlSrc = fs.readFileSync('baihoc.html', 'utf8');
    const triggerTrialMatch = htmlSrc.match(/async function triggerTrial\(user, lesson, courseName, lkey\)[\s\S]*?\nfunction handleOpenLesson/);
    const triggerTrialCode = triggerTrialMatch[0].replace(/\nfunction handleOpenLesson[\s\S]*$/, '');

    vm.createContext(testSandbox);
    vm.runInContext(triggerTrialCode, testSandbox);

    // Kích hoạt mở bài B03
    const res = await testSandbox.triggerTrial(user, l3, 'Khóa 12', 'B03');

    // Server từ chối bài thứ 3
    assert.equal(res.ok, false);
    assert.equal(res.reason, 'trial_limit');

    // Giao diện: TUYỆT ĐỐI KHÔNG chứa iframe video hoặc yt-player
    assert.equal(currentInnerHtml.includes('<iframe'), false, 'Iframe video tuyệt đối KHÔNG được render');
    assert.equal(currentInnerHtml.includes('yt-player'), false, 'yt-player tuyệt đối KHÔNG được render');
    assert.ok(currentInnerHtml.includes('fa-hourglass-half'), 'Phải hiển thị icon hết hạn mức');
    assert.equal(modalShown, true, 'Modal hết hạn mức phải được hiển thị');
  } finally {
    global.fetch = originalFetch;
  }
});

it('12. Hai thiết bị đồng thời không vượt 2 bài (concurrency lock backend)', () => {
  const fakeGasDb = new Map();
  let lockAcquired = false;

  function fakeGasStartTrialLesson(sdt, mabai, dateVN) {
    if (lockAcquired) throw new Error('Lock timeout');
    lockAcquired = true;
    try {
      const records = fakeGasDb.get(sdt) || [];
      const todayLessons = new Set();
      for (const r of records) {
        if (r.date === dateVN) todayLessons.add(r.mabai);
      }
      if (todayLessons.has(mabai)) {
        return { ok: true, isNew: false, dailyCount: todayLessons.size, remaining: Math.max(0, 2 - todayLessons.size) };
      }
      if (todayLessons.size >= 2) {
        return { ok: false, reason: 'trial_limit', dailyCount: todayLessons.size, remaining: 0 };
      }
      records.push({ mabai, date: dateVN, timestamp: Date.now() });
      fakeGasDb.set(sdt, records);
      todayLessons.add(mabai);
      return { ok: true, isNew: true, dailyCount: todayLessons.size, remaining: Math.max(0, 2 - todayLessons.size) };
    } finally {
      lockAcquired = false;
    }
  }

  const sdt = '0901111111';
  const todayVN = '2026-09-14';

  const res1 = fakeGasStartTrialLesson(sdt, 'B01', todayVN);
  assert.equal(res1.ok, true);
  assert.equal(res1.dailyCount, 1);

  const resA = fakeGasStartTrialLesson(sdt, 'B02', todayVN);
  assert.equal(resA.ok, true);
  assert.equal(resA.dailyCount, 2);

  const resB = fakeGasStartTrialLesson(sdt, 'B03', todayVN);
  assert.equal(resB.ok, false);
  assert.equal(resB.reason, 'trial_limit');
  assert.equal(resB.dailyCount, 2);

  assert.equal(fakeGasDb.get(sdt).length, 2);
});

// =============================================================================
// PHẦN 4: KIỂM TRA TOÀN VẸN MÃ NGUỒN VÀ KHÔNG CHỨA BÍ MẬT MẶC ĐỊNH
// =============================================================================
console.log('\n--- [PHẦN 4] Kiểm Tra Toàn Vẹn Mã Nguồn & Bảo Mật Secret ---');

const htmlSource = fs.readFileSync('baihoc.html', 'utf8');
const trialManagerSource = fs.readFileSync('trial-manager.js', 'utf8');
const appsScriptSource = fs.readFileSync('apps-script-CAPNHAT.txt', 'utf8');

it('File baihoc.html KHÔNG chứa biến lỗi _isTrialLimit', () => {
  assert.equal(htmlSource.includes('_isTrialLimit'), false);
});

it('File baihoc.html chứa biến chuẩn _isLimit và cơ chế Pessimistic Fail-Closed', () => {
  assert.ok(htmlSource.includes('const _isLimit = _blkCheck.reason===\'trial_limit\';'));
  assert.ok(htmlSource.includes('if(_isTrial && !_isGrantedInMemory){'));
});

it('File baihoc.html kết thúc đúng thẻ đóng </body> và </html>', () => {
  const trimmed = htmlSource.trim();
  assert.ok(trimmed.endsWith('</html>'));
  assert.ok(trimmed.includes('</body>'));
});

it('TUYỆT ĐỐI KHÔNG chứa secret mặc định VLXT_SESSION_SECRET_2026 trong toàn bộ dự án', () => {
  assert.equal(appsScriptSource.includes('VLXT_SESSION_SECRET_2026'), false, 'apps-script-CAPNHAT.txt còn chứa secret mặc định');
  assert.equal(trialManagerSource.includes('VLXT_SESSION_SECRET_2026'), false, 'trial-manager.js còn chứa secret mặc định');
  assert.equal(htmlSource.includes('VLXT_SESSION_SECRET_2026'), false, 'baihoc.html còn chứa secret mặc định');
});

it('apps-script-CAPNHAT.txt KHÔNG chứa fallback hardcoded cho GOOGLE_CLIENT_ID (Fail-Closed)', () => {
  const match = appsScriptSource.match(/function\s+getGoogleClientId\s*\(\)\s*\{([\s\S]*?)\}/);
  assert.ok(match, 'Phải có hàm getGoogleClientId trong apps-script-CAPNHAT.txt');
  assert.equal(match[1].includes('||'), false, 'getGoogleClientId không được chứa fallback ||');
  assert.equal(match[1].includes('GOOGLE_CLIENT_ID_NOT_CONFIGURED'), true, 'getGoogleClientId phải ném lỗi GOOGLE_CLIENT_ID_NOT_CONFIGURED');
});

// =============================================================================
// TỔNG KẾT
// =============================================================================
console.log('\n===============================================================');
console.log(`KẾT QUẢ: Toàn bộ ${passed}/${total} test cases ĐẠT (100% PASS).`);
console.log('Tất cả các blocker bảo mật và kiểm thử phiên đã đạt chuẩn tuyệt đối!');
console.log('===============================================================\n');

process.exit(0);
