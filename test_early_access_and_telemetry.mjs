import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function loadIntoSandbox(filePath, extraGlobals = {}) {
  const storage = new Map();
  const sessStorage = new Map();
  const makeStore = (m) => ({
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k)
  });
  const doc = {
    body: { appendChild: () => {}, classList: { contains: () => false, add: () => {}, remove: () => {} } },
    head: { appendChild: () => {} },
    documentElement: { setAttribute: () => {} },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, setAttribute: () => {}, addEventListener: () => {} }),
    addEventListener: () => {}
  };
  const base = Object.assign({
    location: { pathname: '/baihoc.html', search: '', hash: '', href: 'https://vatlyxuantruong.io.vn/baihoc.html', replace: (u) => { base._redirectedTo = u; } },
    navigator: { userAgent: 'Mozilla/5.0 Chrome/130' },
    innerWidth: 1440,
    innerHeight: 900,
    addEventListener: () => {},
    localStorage: makeStore(storage),
    sessionStorage: makeStore(sessStorage)
  }, extraGlobals, {
    document: doc,
    console,
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  });
  base.window = base;
  const ctx = vm.createContext(base);
  const code = fs.readFileSync(filePath, 'utf8');
  vm.runInContext(code, ctx, { filename: filePath });
  return { win: ctx, storage, sessStorage };
}

// ─── Test 1: VLXT_CAMPAIGN & Early Access Windows + Account Tiers ───
{
  const { win } = loadIntoSandbox('vlxt-telemetry.js');
  const C = win.VLXT_CAMPAIGN;
  const T = win.VLXT_TELEMETRY;
  assert(C, 'VLXT_CAMPAIGN must be defined');
  assert(T, 'VLXT_TELEMETRY must be defined');

  // Early Access new free student
  const eaFreeUser = { sdt: '0911111111', hoten: 'Nguyen EA Free', loaiTK: 'free', lop: '12' };
  // Early Access student created with GAS 7-day registerUser trial
  const eaGasTrialUser = { sdt: '0922222222', hoten: 'Nguyen EA Trial', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 };
  // Legacy student registered BEFORE 2026-11-24T15:00:00+07:00
  const legacyTrialUser = { sdt: '0933333333', hoten: 'Nguyen Legacy', loaiTK: 'vip', trialExpiry: Date.parse('2026-11-20T10:00:00+07:00') + 7 * 86400000 };
  // Paid Pro/VIP student (>8d or isPaid:true or pro/premium)
  const paidProUser = { sdt: '0944444444', hoten: 'Nguyen Paid', loaiTK: 'pro', isPaid: true, proExpiry: Date.now() + 30 * 86400000 };
  const paidVipYear = { sdt: '0955555555', hoten: 'Nguyen Year', loaiTK: 'vip', trialExpiry: Date.now() + 365 * 86400000 };

  assert.strictEqual(C.hasFullAccess(eaFreeUser), false, 'EA Free must NOT have full access');
  assert.strictEqual(C.hasFullAccess(eaGasTrialUser), false, 'New GAS 7d user must follow Early Access cap (not full Pro)');
  assert.strictEqual(C.hasFullAccess(legacyTrialUser), true, 'Pre-campaign legacy account MUST keep existing full access');
  assert.strictEqual(C.hasFullAccess(paidProUser), true, 'Paid Pro MUST have full access');
  assert.strictEqual(C.hasFullAccess(paidVipYear), true, 'VIP > 8d MUST have full access');

  // Knowledge Gates for Early Access student
  const gd1Name = 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12';
  const gd2Name = 'GIAI ĐOẠN 2 - TỔNG ÔN CHUYÊN SÂU';
  const layGocName = '5 NGÀY LẤY GỐC VẬT LÍ ( NÊN HỌC ⭐) - Vật Lý 12';

  assert.strictEqual(C.canAccessCourseChapter(gd1Name, 'Chương 1: Vật lý nhiệt', eaFreeUser), true, 'GĐ1 Chương 1 unlocked');
  assert.strictEqual(C.canAccessCourseChapter(gd1Name, 'Chương 2: Khí lí tưởng', eaFreeUser), true, 'GĐ1 Chương 2 unlocked');
  assert.strictEqual(C.canAccessCourseChapter(gd1Name, 'Chương 3: Từ trường', eaFreeUser), false, 'GĐ1 Chương 3 locked for EA');
  assert.strictEqual(C.canAccessCourseChapter(gd1Name, 'Chương 4: Vật lý hạt nhân', eaFreeUser), false, 'GĐ1 Chương 4 locked for EA');
  assert.strictEqual(C.isAdvancedStageCourseName(gd2Name), true, 'GĐ2 detected as advanced locked stage');
  assert.strictEqual(C.canAccessCourseChapter(gd2Name, 'Chương 1: Dao động', eaFreeUser), false, 'GĐ2 locked for EA');
  assert.strictEqual(C.canAccessCourseChapter(gd2Name, 'Chương 1: Dao động', legacyTrialUser), true, 'GĐ2 unlocked for Legacy user');
  assert.strictEqual(C.canAccessCourseChapter(gd2Name, 'Chương 1: Dao động', paidProUser), true, 'GĐ2 unlocked for Paid Pro user');

  // Lấy Gốc Bài 1 only (idx === 0)
  assert.strictEqual(C.canAccessLayGocLesson(layGocName, 0, { TenBai: 'Ngày 1: Lý thuyết cơ bản', ThuTuBai: 1 }, eaFreeUser), true, 'Lấy Gốc Bài 1 unlocked');
  assert.strictEqual(C.canAccessLayGocLesson(layGocName, 1, { TenBai: 'Ngày 2: Bài tập vận dụng', ThuTuBai: 2 }, eaFreeUser), false, 'Lấy Gốc Bài 2 locked');
  assert.strictEqual(C.canAccessLayGocLesson(layGocName, 4, { TenBai: 'Ngày 5', ThuTuBai: null }, eaFreeUser), false, 'Lấy Gốc Bài 5 locked');
  assert.strictEqual(C.canAccessLayGocLesson(layGocName, 1, { TenBai: 'Ngày 2', ThuTuBai: 2 }, paidProUser), true, 'Paid Pro unlocks Bài 2 Lấy Gốc');

  // DGNL 5/50
  assert.strictEqual(C.canAccessDgnlExam(1, eaFreeUser), true, 'ĐGNL Đề 1 unlocked');
  assert.strictEqual(C.canAccessDgnlExam(5, eaFreeUser), true, 'ĐGNL Đề 5 unlocked');
  assert.strictEqual(C.canAccessDgnlExam(6, eaFreeUser), false, 'ĐGNL Đề 6 locked for EA');
  assert.strictEqual(C.canAccessDgnlExam(50, eaFreeUser), false, 'ĐGNL Đề 50 locked for EA');
  assert.strictEqual(C.canAccessDgnlExam(6, legacyTrialUser), true, 'Legacy user keeps full ĐGNL');
  assert.strictEqual(C.canAccessDgnlExam(6, paidProUser), true, 'Paid Pro keeps full ĐGNL');

  // Phong thi thu
  assert.strictEqual(C.canAccessPhongThiThu(null), false, 'Guest blocked from Phong Thi Thu');
  assert.strictEqual(C.canAccessPhongThiThu({ sdt: 'FREE' }), false, 'Dummy FREE blocked from Phong Thi Thu');
  assert.strictEqual(C.canAccessPhongThiThu(eaFreeUser), true, 'Logged-in EA user allowed in Phong Thi Thu');

  // Auth redirect enforcement (returns user if logged in, null & redirects if guest)
  assert.strictEqual(C.requireAuthOrRedirect('test_trigger'), null, 'Guest triggers requireAuthOrRedirect and returns null');
  assert(win._redirectedTo && win._redirectedTo.includes('login.html?from='), 'Redirects guest to login.html');

  // Telemetry config constants
  assert.strictEqual(C.DEFAULT_CONFIG.durationDays, 7);
  assert.strictEqual(C.DEFAULT_CONFIG.zaloGroupUrl, 'https://zalo.me/g/str1pllhp4uxa3rtvnou');
  assert.strictEqual(C.DEFAULT_CONFIG.zaloTeacherPhone, '0964.885.920');

  console.log('✓ Test 1: Early Access access matrix, legacy account preservation, & auth redirect passed.');
}

// ─── Test 2: FreemiumFlow isPaidUser & Zalo Phone Sync ───
{
  const { win } = loadIntoSandbox('freemium-flow.js');
  const F = win.FreemiumFlow;
  assert(F, 'FreemiumFlow loaded');
  win.localStorage.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0911222333', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 }));
  assert.strictEqual(F.isPaidUser(), false, '7-day GAS trial is not full Paid Pro');
  win.localStorage.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0911222333', loaiTK: 'pro', isPaid: true, proExpiry: Date.now() + 30 * 86400000 }));
  assert.strictEqual(F.isPaidUser(), true, 'Paid Pro user passes isPaidUser');
  assert.strictEqual(fs.readFileSync('freemium-flow.js', 'utf8').includes('0987.654.321'), false, 'No stale phone in freemium-flow.js');
  assert(fs.readFileSync('freemium-flow.js', 'utf8').includes('0964.885.920'), 'Thầy Zalo 0964.885.920 present');
  console.log('✓ Test 2: FreemiumFlow tier & Zalo 0964.885.920 check passed.');
}

// ─── Test 3: Student HTML Integration Contracts ───
{
  const baihoc = fs.readFileSync('baihoc.html', 'utf8');
  assert(!baihoc.includes("sdt: 'FREE'"), 'baihoc.html must NOT auto-create dummy FREE user');
  assert(baihoc.includes('lay_goc_locked'), 'baihoc.html handles Lấy Gốc Bài 2-5 lock');
  assert(baihoc.includes('vlxt-feedback-hub.js'), 'baihoc.html loads global feedback hub');

  const dgnl = fs.readFileSync('danh-gia-nang-luc.html', 'utf8');
  assert(dgnl.includes('isExamUnlockedForUser'), 'danh-gia-nang-luc.html gates exams via helper');
  assert(dgnl.includes('dgnl-boot-grace'), 'danh-gia-nang-luc.html preserves 10s boot grace');
  assert(dgnl.includes('exam_question_view'), 'danh-gia-nang-luc.html tracks per-question telemetry');

  const ptt = fs.readFileSync('phong-thi-thu.html', 'utf8');
  assert(ptt.includes('data-theme="light"'), 'phong-thi-thu.html preserves Light CBT UI');
  assert(!ptt.includes("sdt: 'HS-THITHU2026'"), 'phong-thi-thu.html no longer auto-logs in fake candidate');

  const goihoc = fs.readFileSync('goi-hoc.html', 'utf8');
  assert(goihoc.includes('openReserveVipModal'), 'goi-hoc.html includes Reserve VIP slot modal');
  assert(goihoc.includes('https://zalo.me/g/str1pllhp4uxa3rtvnou'), 'goi-hoc.html includes Zalo group link');
  assert(goihoc.includes('0964.885.920'), 'goi-hoc.html includes Zalo 0964.885.920');

  const liveRec = fs.readFileSync('live-record.html', 'utf8');
  assert(!liveRec.includes('vlxtRequireAuth'), 'live-record.html preserves 100% Guest Access');

  console.log('✓ Test 3: Student HTML integration & preservation contracts passed.');
}

// ─── Test 4: Google OAuth Client ID Integrity & Gmail Account Telemetry ───
{
  const loginHtml = fs.readFileSync('login.html', 'utf8');
  const dgnlHtml = fs.readFileSync('danh-gia-nang-luc.html', 'utf8');
  const validClientId = '1022891995284-miquu1f7rlpie7ug9884sgagf21nputc.apps.googleusercontent.com';

  assert(!loginHtml.includes('912620759392'), 'login.html must never contain broken placeholder client ID');
  assert(!dgnlHtml.includes('912620759392'), 'danh-gia-nang-luc.html must never contain broken 401 invalid_client ID');
  assert(loginHtml.includes(validClientId), 'login.html must use real Google Client ID');
  assert(dgnlHtml.includes(validClientId), 'danh-gia-nang-luc.html must sync real Google Client ID');
  assert(dgnlHtml.includes("action: 'logingoogle'"), 'danh-gia-nang-luc.html must verify Google token with GAS');
  assert(loginHtml.includes('onGoogleLibraryLoad') && loginHtml.includes('login-inapp-google-note'), 'login.html handles slow GSI load & In-App WebViews');

  const gmailUser = {
    sdt: 'minhvu20999@gmail.com',
    hoten: 'Minh Vu',
    lop: '12',
    loaiTK: 'vip',
    trialExpiry: Date.now() + 7 * 86400000
  };
  const { win, storage } = loadIntoSandbox('vlxt-telemetry.js');
  win.localStorage.setItem('vlxt_user_v2', JSON.stringify(gmailUser));
  const C = win.VLXT_CAMPAIGN;
  const T = win.VLXT_TELEMETRY;
  const authed = C.requireAuthOrRedirect('gmail_test');
  assert(authed && authed.sdt === 'minhvu20999@gmail.com', 'Gmail user must pass auth guard without redirect');
  assert.strictEqual(T.getActorInfo().sdt, 'minhvu20999@gmail.com', 'Telemetry normSdt must preserve full email (not strip to digits)');
  assert.strictEqual(C.canAccessCourseChapter('CHUYÊN ĐỀ LÝ THUYẾT GĐ1 - Vật Lý 12', 'Chương 1: Vật lý nhiệt', gmailUser), true);
  assert.strictEqual(C.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 0, {}, gmailUser), true);
  assert.strictEqual(C.canAccessDgnlExam(5, gmailUser), true);
  assert.strictEqual(C.canAccessDgnlExam(6, gmailUser), false);
  assert.strictEqual(C.canAccessPhongThiThu(gmailUser), true);
  assert(storage.size >= 0);

  console.log('✓ Test 4: Google OAuth 401 invalid_client fix & Gmail Early Access flow passed.');
}
