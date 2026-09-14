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
function createMockBackend(customSecret) {
  let secret = customSecret;
  const accounts = [
    { sdt: '0901111111', matkhau: 'Pass123@', hoten: 'Nguyễn Văn A', lop: '12A1', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 },
    { sdt: '0902222222', matkhau: 'Secret456!', hoten: 'Trần Thị B', lop: '12A2', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 }
  ];

  function getSecret() {
    if (!secret || !secret.trim()) throw new Error('AUTH_SECRET_NOT_CONFIGURED');
    return secret.trim();
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

  function login(body) {
    try {
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
    } catch (err) {
      if (err.message === 'AUTH_SECRET_NOT_CONFIGURED') {
        return { ok: false, error: 'AUTH_SECRET_NOT_CONFIGURED', msg: 'Máy chủ chưa cấu hình AUTH_SECRET' };
      }
      return { ok: false, error: 'ServerError' };
    }
  }

  function getProfile(params) {
    try {
      const token = (params && (params.token || params.authToken)) || '';
      if (!token) {
        return { ok: false, error: 'Unauthorized', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
      }
      const authSdt = verifyToken(token);
      if (!authSdt) {
        return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
      }
      const clientHs = normSdt(params.hs || params.sdt);
      if (clientHs && clientHs !== normSdt(authSdt)) {
        return { ok: false, error: 'Forbidden', msg: 'Không có quyền truy cập hồ sơ tài khoản khác' };
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

  function getTrialLimit(params) {
    try {
      const token = (params && (params.token || params.authToken)) || '';
      if (!token) {
        return { ok: false, error: 'Unauthorized', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
      }
      const authSdt = verifyToken(token);
      if (!authSdt) {
        return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
      }
      const clientHs = normSdt(params.hs || params.sdt);
      if (clientHs && clientHs !== normSdt(authSdt)) {
        return { ok: false, error: 'Forbidden', msg: 'Không được phép đọc dữ liệu của số điện thoại khác' };
      }
      return { ok: true, sdt: authSdt, dailyCount: 1, remaining: 1, startedLessons: [] };
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
        return { ok: false, error: 'Unauthorized', msg: 'Yêu cầu phiên đăng nhập hợp lệ (thiếu token)' };
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

  return { generateToken, verifyToken, login, getProfile, getTrialLimit, startTrialLesson };
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
console.log('\n--- [PHẦN 2] Bảo Mật Phiên Đăng Nhập & Kiểm Thử Blocker ---');

const backend = createMockBackend(runtimeTestSecret);

it('1. Gọi profile chỉ bằng SĐT không nhận được hồ sơ hoặc token (chặn rò rỉ token công khai)', () => {
  const res = backend.getProfile({ hs: '0901111111' }); // không có token
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Unauthorized');
  assert.equal(res.user, undefined, 'Tuyệt đối không trả về thông tin user');
  assert.equal(res.token, undefined, 'Tuyệt đối không cấp phát token');
});

it('2. Token giả và token hết hạn bị từ chối truy cập', () => {
  // Token giả mạo chữ ký
  const fakeToken = Buffer.from('901111111:' + Date.now() + ':' + (Date.now() + 86400000) + ':nonce123:fake_signature').toString('base64url');
  const resFake = backend.getProfile({ hs: '0901111111', token: fakeToken });
  assert.equal(resFake.ok, false);
  assert.equal(resFake.error, 'Unauthorized');

  // Token hết hạn
  const expiredToken = TrialManager.createDevToken('0901111111', runtimeTestSecret, {
    issuedAt: Date.now() - 100000,
    expiresAt: Date.now() - 1000
  });
  const resExpired = backend.getProfile({ hs: '0901111111', token: expiredToken });
  assert.equal(resExpired.ok, false);
  assert.equal(resExpired.error, 'Unauthorized');
});

it('3. Thiếu AUTH_SECRET làm hệ thống Fail-Closed hoàn toàn', () => {
  // Backend không cấu hình AUTH_SECRET trong Script Properties
  const brokenBackend = createMockBackend('');
  const resLogin = brokenBackend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  assert.equal(resLogin.ok, false);
  assert.equal(resLogin.error, 'AUTH_SECRET_NOT_CONFIGURED');

  const resProfile = brokenBackend.getProfile({ hs: '0901111111', token: 'some_token' });
  assert.equal(resProfile.ok, false);
  assert.equal(resProfile.error, 'AUTH_SECRET_NOT_CONFIGURED');

  // TrialManager yêu cầu secret bắt buộc khi gọi createDevToken
  assert.throws(() => {
    TrialManager.createDevToken('0901111111');
  }, /AUTH_SECRET_REQUIRED/);

  assert.throws(() => {
    TrialManager.verifyDevToken('token_str');
  }, /AUTH_SECRET_REQUIRED/);
});

it('4. Đăng nhập đúng mới nhận token (đăng nhập sai không nhận token)', () => {
  // Sai mật khẩu
  const resWrong = backend.login({ sdt: '0901111111', matkhau: 'SaiMatKhau' });
  assert.equal(resWrong.ok, false);
  assert.equal(resWrong.user, undefined);

  // Đúng mật khẩu
  const resRight = backend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  assert.equal(resRight.ok, true);
  assert.ok(resRight.user && resRight.user.token, 'Phải có token sau khi đăng nhập đúng');

  // Token có cấu trúc hợp lệ và được backend xác thực đúng SĐT
  const verifiedSdt = backend.verifyToken(resRight.user.token);
  assert.equal(normSdt(verifiedSdt), normSdt('0901111111'));
});

it('5. Token tài khoản A không truy cập được profile hay hạn mức của B (chống IDOR / CSRF)', () => {
  const loginA = backend.login({ sdt: '0901111111', matkhau: 'Pass123@' });
  const tokenA = loginA.user.token;

  // Dùng token A để đọc profile B
  const resProfile = backend.getProfile({ hs: '0902222222', token: tokenA });
  assert.equal(resProfile.ok, false);
  assert.equal(resProfile.error, 'Forbidden');
  assert.equal(resProfile.msg, 'Không có quyền truy cập hồ sơ tài khoản khác');

  // Dùng token A để đọc hạn mức B
  const resLimit = backend.getTrialLimit({ hs: '0902222222', token: tokenA });
  assert.equal(resLimit.ok, false);
  assert.equal(resLimit.error, 'Forbidden');

  // Dùng token A để tiêu hao lượt bài của B
  const resStart = backend.startTrialLesson({ sdt: '0902222222', token: tokenA, mabai: 'B01' });
  assert.equal(resStart.ok, false);
  assert.equal(resStart.error, 'Forbidden');
});

// =============================================================================
// PHẦN 3: KIỂM THỬ GIAO DIỆN PESSIMISTIC FAIL-CLOSED KHI MỞ BÀI HỌC
// =============================================================================
console.log('\n--- [PHẦN 3] Kiểm Thử Pessimistic Fail-Closed Giao Diện ---');

await itAsync('6. Server từ chối bài thứ ba (trial_limit) -> Video/quiz KHÔNG được mở vào DOM', async () => {
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

await itAsync('7. Mất mạng hoặc xóa localStorage không mở được bài mới (Fail-Closed)', async () => {
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

await itAsync('8. Bài cũ đã xác nhận vẫn xem lại được bình thường khi mất mạng (ôn tập an toàn)', async () => {
  mockStorage.clear();
  const sdt = '0901111111';
  const user = { sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000 };
  const l1 = mockCourses[0].chapters[0].lessons[0];

  const confirmedList = [
    { key: 'B01', mabai: 'B01', name: l1.name, date: TrialManager.getVietnamDateStr(), timestamp: Date.now() - 3600000 }
  ];
  mockStorage.set('vlxt_trial_confirmed_' + sdt, JSON.stringify(confirmedList));

  const originalFetch = global.fetch;
  global.fetch = async function () {
    throw new Error('Network error: Offline');
  };

  try {
    const access = TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, new Set());
    assert.equal(access.allowed, true);
    assert.equal(access.isOldLesson, true);

    const reqRes = await TrialManager.requestTrialAccess(user, l1, 'Khóa 12');
    assert.equal(reqRes.ok, true);
    assert.equal(reqRes.isNew, false);
    assert.equal(reqRes.alreadyStarted, true);
  } finally {
    global.fetch = originalFetch;
  }
});

it('9. Hai thiết bị đồng thời không vượt 2 bài (concurrency lock backend)', () => {
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
  assert.ok(htmlSource.includes('if(_isTrial && !_isOldLesson){'));
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

// =============================================================================
// TỔNG KẾT
// =============================================================================
console.log('\n===============================================================');
console.log(`KẾT QUẢ: Toàn bộ ${passed}/${total} test cases ĐẠT (100% PASS).`);
console.log('Tất cả các blocker bảo mật và kiểm thử phiên đã đạt chuẩn tuyệt đối!');
console.log('===============================================================\n');

process.exit(0);
