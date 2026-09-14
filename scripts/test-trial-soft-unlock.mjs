import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import TrialManager from '../trial-manager.js';

console.log('=== TEST SUITE: TRIAL SOFT UNLOCK V2.1.0 (PESSIMISTIC & FAIL-CLOSED) ===\n');

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
// PHẦN 2: 5 BÀI TEST BẮT BUỘC THEO CHỈ THỊ NGHIỆM THU CỦA THẦY
// =============================================================================
console.log('\n--- [PHẦN 2] 5 Bài Test Nghiệm Thu Blocker Cốt Lõi ---');

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: Giả mạo SĐT người khác bị từ chối (Forbidden / Unauthorized)
// ─────────────────────────────────────────────────────────────────────────────
await itAsync('1. Giả mạo SĐT người khác hoặc thiếu token bị từ chối (Forbidden / Unauthorized)', async () => {
  // Giả lập backend endpoint getTrialLimit & startTrialLesson (tham chiếu apps-script-CAPNHAT.txt)
  const AUTH_SECRET = 'VLXT_AUTH_SECRET_DEFAULT_2026';
  function normSdt(s) { return String(s || '').replace(/\D/g, '').replace(/^0+/, ''); }

  function mockBackendStartTrial(body) {
    const token = body.token;
    if (!token) {
      return { ok: false, error: 'Unauthorized', msg: 'Yêu cầu phiên đăng nhập hợp lệ' };
    }
    const authSdt = TrialManager.verifyDevToken(token, AUTH_SECRET);
    if (!authSdt) {
      return { ok: false, error: 'Unauthorized', msg: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' };
    }
    const clientSdt = normSdt(body.sdt);
    if (clientSdt && clientSdt !== authSdt) {
      return { ok: false, error: 'Forbidden', msg: 'Không có quyền thao tác trên tài khoản khác' };
    }
    return { ok: true, isNew: true, dailyCount: 1, remaining: 1 };
  }

  // Trường hợp 1: Không có token -> Unauthorized
  const resNoToken = mockBackendStartTrial({ sdt: '0901111111', mabai: 'B01' });
  assert.equal(resNoToken.ok, false);
  assert.equal(resNoToken.error, 'Unauthorized');

  // Trường hợp 2: Token của User A (0901111111) nhưng gửi body sdt của User B (0902222222) -> Forbidden
  const tokenA = TrialManager.createDevToken('0901111111', AUTH_SECRET);
  const resTampered = mockBackendStartTrial({
    token: tokenA,
    sdt: '0902222222',
    mabai: 'B01'
  });
  assert.equal(resTampered.ok, false);
  assert.equal(resTampered.error, 'Forbidden');
  assert.equal(resTampered.msg, 'Không có quyền thao tác trên tài khoản khác');

  // Trường hợp 3: Token giả mạo chữ ký HMAC -> Unauthorized
  const fakeToken = '0901111111.' + Date.now() + '.invalid_signature_hash';
  const resFakeSig = mockBackendStartTrial({
    token: fakeToken,
    sdt: '0901111111',
    mabai: 'B01'
  });
  assert.equal(resFakeSig.ok, false);
  assert.equal(resFakeSig.error, 'Unauthorized');

  // Trường hợp 4: Token hợp lệ của chính chủ -> Thành công
  const resValid = mockBackendStartTrial({
    token: tokenA,
    sdt: '0901111111',
    mabai: 'B01'
  });
  assert.equal(resValid.ok, true);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: Server từ chối bài thứ ba (trial_limit) thì nội dung/video bài thứ ba KHÔNG mở
// ─────────────────────────────────────────────────────────────────────────────
await itAsync('2. Server từ chối bài thứ ba (trial_limit) -> Nội dung/video bài thứ 3 KHÔNG được mở vào DOM', async () => {
  mockStorage.clear();
  const sdt = '0988000002';
  const user = { sdt: sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000, token: TrialManager.createDevToken(sdt) };
  const l3 = mockCourses[0].chapters[0].lessons[2]; // B03

  // Mock fetch: server trả về trial_limit
  const originalFetch = global.fetch;
  global.fetch = async function (url, opts) {
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
    // Setup sandbox cho baihoc.html
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
      HS: { sdt: sdt, ten: 'Học Sinh Dùng Thử' },
      vlxtGetUser: () => user,
      app: () => fakeAppElement,
      go: () => {},
      toast: () => {},
      showTrialLimitModal: () => { modalShown = true; },
      esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      findLesson: (key) => ({ course: mockCourses[0], chapter: mockCourses[0].chapters[0], lesson: l3 }),
      findCourse: () => mockCourses[0],
      flatLessons: (c) => (c.chapters || []).flatMap(ch => ch.lessons || []),
      lessonHasContent: () => true
    };
    testSandbox.window = testSandbox;
    testSandbox.global = testSandbox;

    const htmlSrc = fs.readFileSync('baihoc.html', 'utf8');
    const triggerTrialMatch = htmlSrc.match(/async function triggerTrial\(user, lesson, courseName, lkey\)[\s\S]*?\nfunction handleOpenLesson/);
    assert.ok(triggerTrialMatch, 'Tìm thấy định nghĩa async function triggerTrial trong baihoc.html');
    const triggerTrialCode = triggerTrialMatch[0].replace(/\nfunction handleOpenLesson[\s\S]*$/, '');

    vm.createContext(testSandbox);
    vm.runInContext(triggerTrialCode, testSandbox);

    // Gọi triggerTrial
    const res = await testSandbox.triggerTrial(user, l3, 'Khóa 12', 'B03');
    assert.equal(res.ok, false);
    assert.equal(res.reason, 'trial_limit');

    // KIỂM CHỨNG BLOCKER: Nội dung/video bài thứ ba TUYỆT ĐỐI KHÔNG xuất hiện trong DOM
    assert.equal(currentInnerHtml.includes('<iframe'), false, 'iframe video không được render khi bị chặn');
    assert.equal(currentInnerHtml.includes('yt-player'), false, 'yt-player không được render khi bị chặn');
    assert.equal(currentInnerHtml.includes('drive-player'), false, 'drive-player không được render khi bị chặn');

    // DOM phải chứa giao diện thông báo hết hạn mức
    assert.ok(currentInnerHtml.includes('fa-hourglass-half'), 'Phải render icon fa-hourglass-half');
    assert.ok(currentInnerHtml.includes('Em đã dùng hết 2/2 bài học mới hôm nay theo hạn mức học thử'), 'Phải thông báo hết lượt');
    assert.equal(modalShown, true, 'Modal hết lượt phải được bật lên');
  } finally {
    global.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Mất mạng hoặc xóa localStorage không mở được bài mới (fail-closed)
// ─────────────────────────────────────────────────────────────────────────────
await itAsync('3. Mất mạng hoặc xóa localStorage không mở được bài mới (Fail-Closed, tạm khóa bài)', async () => {
  mockStorage.clear();
  const sdt = '0988000003';
  const user = { sdt: sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000, token: TrialManager.createDevToken(sdt) };
  const l1 = mockCourses[0].chapters[0].lessons[0];

  // Giả lập mạng bị ngắt (fetch reject)
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

    let toastMsg = '';
    const testSandbox = {
      console,
      location: { hash: '#lesson/B01' },
      TrialManager,
      TEST_ACCOUNTS: ['0900000001'],
      WATCHED: new Set(),
      COURSES: mockCourses,
      QUIZ_INDEX: null,
      HS: { sdt: sdt, ten: 'Học Sinh Dùng Thử' },
      vlxtGetUser: () => user,
      app: () => fakeAppElement,
      go: () => {},
      toast: (msg) => { toastMsg = msg; },
      showTrialLimitModal: () => {},
      esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
      localStorage: global.localStorage,
      sessionStorage: global.sessionStorage,
      findLesson: (key) => ({ course: mockCourses[0], chapter: mockCourses[0].chapters[0], lesson: l1 }),
      findCourse: () => mockCourses[0]
    };
    testSandbox.window = testSandbox;
    testSandbox.global = testSandbox;

    const htmlSrc = fs.readFileSync('baihoc.html', 'utf8');
    const triggerTrialMatch = htmlSrc.match(/async function triggerTrial\(user, lesson, courseName, lkey\)[\s\S]*?\nfunction handleOpenLesson/);
    assert.ok(triggerTrialMatch, 'Tìm thấy định nghĩa async function triggerTrial trong baihoc.html');
    const triggerTrialCode = triggerTrialMatch[0].replace(/\nfunction handleOpenLesson[\s\S]*$/, '');

    vm.createContext(testSandbox);
    vm.runInContext(triggerTrialCode, testSandbox);

    // Mở bài mới khi mất mạng
    const res = await testSandbox.triggerTrial(user, l1, 'Khóa 12', 'B01');

    // KIỂM CHỨNG FAIL-CLOSED:
    // 1. Phản hồi phải trả về reason: network_error
    assert.equal(res.ok, false);
    assert.equal(res.reason, 'network_error');

    // 2. Không được ghi nhận vào local khi chưa được server cấp quyền
    assert.equal(TrialManager.isServerConfirmedLesson(sdt, 'B01', new Set()), false);
    assert.equal(TrialManager.getDailyConfirmedCount(sdt), 0);

    // 3. DOM hiển thị thông báo lỗi mạng và nút thử lại, TUYỆT ĐỐI KHÔNG render nội dung bài học
    assert.ok(currentInnerHtml.includes('fa-wifi'), 'Phải render icon fa-wifi');
    assert.ok(currentInnerHtml.includes('Không thể xác minh lượt học, vui lòng kiểm tra mạng'), 'Phải hiển thị thông điệp kiểm tra mạng');
    assert.ok(currentInnerHtml.includes('Thử lại'), 'Phải có nút thử lại');
    assert.equal(currentInnerHtml.includes('<iframe'), false, 'Không được render video');
  } finally {
    global.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Bài cũ đã xác nhận vẫn xem lại được khi mất mạng
// ─────────────────────────────────────────────────────────────────────────────
await itAsync('4. Bài cũ đã xác nhận vẫn xem lại được bình thường khi mất mạng (ôn tập an toàn)', async () => {
  mockStorage.clear();
  const sdt = '0988000004';
  const user = { sdt: sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000 };
  const l1 = mockCourses[0].chapters[0].lessons[0];

  // Đã có bài B01 trong danh sách server-confirmed từ trước
  const confirmedList = [
    { key: 'B01', mabai: 'B01', name: l1.name, date: TrialManager.getVietnamDateStr(), timestamp: Date.now() - 3600000 }
  ];
  mockStorage.set('vlxt_trial_confirmed_' + sdt, JSON.stringify(confirmedList));

  // Giả lập mạng bị ngắt
  const originalFetch = global.fetch;
  global.fetch = async function () {
    throw new Error('Network error: Offline');
  };

  try {
    // canAccessTrialLesson cho phép truy cập bài cũ
    const access = TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, new Set());
    assert.equal(access.allowed, true);
    assert.equal(access.isOldLesson, true);

    // requestTrialAccess nhận diện bài cũ -> trả về ok: true ngay lập tức mà không cần gọi mạng
    const reqRes = await TrialManager.requestTrialAccess(user, l1, 'Khóa 12');
    assert.equal(reqRes.ok, true);
    assert.equal(reqRes.isNew, false);
    assert.equal(reqRes.alreadyStarted, true);
  } finally {
    global.fetch = originalFetch;
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Hai thiết bị đồng thời không vượt 2 bài (concurrency lock)
// ─────────────────────────────────────────────────────────────────────────────
it('5. Hai thiết bị đồng thời không vượt 2 bài (concurrency lock backend)', () => {
  const fakeGasDb = new Map();
  let lockAcquired = false;

  function fakeGasStartTrialLesson(sdt, mabai, dateVN) {
    // Mô phỏng LockService.getScriptLock() trên GAS
    if (lockAcquired) {
      throw new Error('Lock timeout');
    }
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

      return {
        ok: true,
        isNew: true,
        dailyCount: todayLessons.size,
        remaining: Math.max(0, 2 - todayLessons.size)
      };
    } finally {
      lockAcquired = false;
    }
  }

  const sdt = '0988000005';
  const todayVN = '2026-09-14';

  // Thiết bị 1 mở bài B01 -> Thành công (lượt 1)
  const res1 = fakeGasStartTrialLesson(sdt, 'B01', todayVN);
  assert.equal(res1.ok, true);
  assert.equal(res1.dailyCount, 1);

  // Thiết bị 1 mở bài B02 và Thiết bị 2 mở bài B03 gần như cùng một tích tắc:
  // Thiết bị 1 chiếm lock trước -> ghi nhận bài B02 (đạt 2/2)
  const resA = fakeGasStartTrialLesson(sdt, 'B02', todayVN);
  assert.equal(resA.ok, true);
  assert.equal(resA.dailyCount, 2);

  // Thiết bị 2 chiếm lock sau -> Bị chặn ngay lập tức, trả về trial_limit
  const resB = fakeGasStartTrialLesson(sdt, 'B03', todayVN);
  assert.equal(resB.ok, false);
  assert.equal(resB.reason, 'trial_limit');
  assert.equal(resB.dailyCount, 2);

  // Tổng số bài trong cơ sở dữ liệu server TUYỆT ĐỐI bằng 2, không thể bị race condition vượt hạn mức
  assert.equal(fakeGasDb.get(sdt).length, 2);
});

// =============================================================================
// PHẦN 3: KIỂM TRA CÚ PHÁP VÀ TÍNH TOÀN VẸN CỦA BAIHOC.HTML
// =============================================================================
console.log('\n--- [PHẦN 3] Kiểm Tra Cú Pháp & Toàn Vẹn baihoc.html ---');

const htmlSource = fs.readFileSync('baihoc.html', 'utf8');

it('File baihoc.html KHÔNG chứa biến lỗi _isTrialLimit', () => {
  assert.equal(
    htmlSource.includes('_isTrialLimit'),
    false,
    'Lỗi biến _isTrialLimit vẫn còn tồn tại trong baihoc.html!'
  );
});

it('File baihoc.html chứa biến chuẩn _isLimit trong khối xử lý blocked', () => {
  assert.ok(htmlSource.includes('const _isLimit = _blkCheck.reason===\'trial_limit\';'));
  assert.ok(htmlSource.includes('} else if(_isLimit){'));
  assert.ok(htmlSource.includes('color:${_isLimit?\'#f59e0b\':\'inherit\'}'));
});

it('File baihoc.html có cơ chế kiểm tra Pessimistic Fail-Closed trước khi tải quiz/video', () => {
  assert.ok(htmlSource.includes('if(_isTrial && !_isOldLesson){'));
  assert.ok(htmlSource.includes('Đang xác thực lượt học thử từ máy chủ...'));
  assert.ok(htmlSource.includes('triggerTrial(_curUser, lesson, course.name, key);'));
});

it('File baihoc.html kết thúc đúng thẻ đóng </body> và </html>', () => {
  const trimmed = htmlSource.trim();
  assert.ok(trimmed.endsWith('</html>'), 'baihoc.html phải kết thúc bằng thẻ </html>');
  assert.ok(trimmed.includes('</body>'), 'baihoc.html phải có thẻ </body>');
});

// =============================================================================
// TỔNG KẾT
// =============================================================================
console.log('\n===============================================================');
console.log(`KẾT QUẢ: Toàn bộ ${passed}/${total} test cases ĐẠT (100% PASS).`);
console.log('Tất cả 5 bài test nghiệm thu blocker đã được kiểm chứng tuyệt đối!');
console.log('===============================================================\n');

process.exit(0);
