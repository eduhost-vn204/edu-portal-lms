import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function createMockRtdb(initial = {}) {
  const db = JSON.parse(JSON.stringify(initial));
  const prefix = 'https://edu-portal-live-default-rtdb.firebaseio.com/support_chats/_vlxt_system/';

  function getPath(pathStr) {
    const parts = pathStr.replace(/\.json.*$/, '').split('/').filter(Boolean);
    let cur = db;
    for (const p of parts) {
      if (!cur || typeof cur !== 'object') return null;
      cur = cur[decodeURIComponent(p)];
    }
    return cur === undefined ? null : JSON.parse(JSON.stringify(cur));
  }

  function setPath(pathStr, val, merge) {
    const parts = pathStr.replace(/\.json.*$/, '').split('/').filter(Boolean);
    let cur = db;
    for (let i = 0; i < parts.length - 1; i++) {
      const k = decodeURIComponent(parts[i]);
      if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
      cur = cur[k];
    }
    const last = decodeURIComponent(parts[parts.length - 1]);
    if (merge && cur[last] && typeof cur[last] === 'object' && typeof val === 'object') {
      cur[last] = Object.assign({}, cur[last], JSON.parse(JSON.stringify(val)));
    } else {
      cur[last] = JSON.parse(JSON.stringify(val));
    }
  }

  async function mockFetch(url, opts = {}) {
    if (!String(url).startsWith(prefix)) {
      return { ok: true, status: 200, json: async () => ({}) };
    }
    const rel = String(url).slice(prefix.length);
    const method = String(opts.method || 'GET').toUpperCase();
    if (method === 'GET') {
      return { ok: true, status: 200, json: async () => getPath(rel) };
    }
    const body = opts.body ? JSON.parse(opts.body) : {};
    if (method === 'PUT') {
      setPath(rel, body, false);
    } else if (method === 'PATCH') {
      setPath(rel, body, true);
    }
    return { ok: true, status: 200, json: async () => body };
  }

  return { db, mockFetch };
}

function createBrowserSandbox(rtdb, opts = {}) {
  const ls = new Map();
  const ss = new Map();
  const makeStore = (m) => ({
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k)
  });
  if (opts.anonId) ls.set('vlxt_anon_id_v1', opts.anonId);

  const doc = {
    title: 'VLXT Test',
    readyState: 'complete',
    body: { appendChild: () => {}, classList: { contains: () => false, add: () => {}, remove: () => {} } },
    head: { appendChild: () => {} },
    documentElement: { scrollTop: 0, scrollHeight: 1000 },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, setAttribute: () => {}, addEventListener: () => {} }),
    addEventListener: () => {}
  };

  const sandbox = {
    location: {
      origin: 'https://vatlyxuantruong.io.vn',
      pathname: opts.pathname || '/index.html',
      search: opts.search || '',
      hash: '',
      href: 'https://vatlyxuantruong.io.vn' + (opts.pathname || '/index.html') + (opts.search || ''),
      replace: (u) => { sandbox._redirected = u; }
    },
    navigator: {
      userAgent: 'Mozilla/5.0 Chrome/130',
      clipboard: { writeText: async (t) => { sandbox._copied = t; } }
    },
    innerWidth: 1440,
    innerHeight: 900,
    document: doc,
    console,
    localStorage: makeStore(ls),
    sessionStorage: makeStore(ss),
    URLSearchParams: URLSearchParams,
    addEventListener: () => {},
    setTimeout: (fn) => { if (typeof fn === 'function' && opts.runImmediateTimeout) fn(); return 0; },
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    fetch: rtdb.mockFetch
  };
  sandbox.window = sandbox;
  const ctx = vm.createContext(sandbox);
  const code = fs.readFileSync('vlxt-telemetry.js', 'utf8');
  vm.runInContext(code, ctx, { filename: 'vlxt-telemetry.js' });
  return ctx;
}

async function runTests() {
  const rtdb = createMockRtdb();

  // ─── 1. Default 3 days + Base unlock gates ───
  const winA = createBrowserSandbox(rtdb, { anonId: 'anon_A' });
  const userA = { sdt: '0911000001', hoten: 'Nguyen Van A', lop: '12A1', loaiTK: 'vip', trialExpiry: Date.now() + 7 * 86400000 };
  winA.localStorage.setItem('vlxt_user_v2', JSON.stringify(userA));

  const stateA0 = winA.VLXT_CAMPAIGN.getUserEarlyAccessState(userA);
  assert.strictEqual(stateA0.baseDays, 3, 'Base duration must be 3 days');
  assert.strictEqual(stateA0.totalDays, 3, 'Initial totalDays must be 3 days');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(5, userA), true, 'De 05 unlocked by default');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(6, userA), false, 'De 06 locked initially');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 0, {}, userA), true, 'Lay Goc Day 1 unlocked');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 1, {}, userA), false, 'Lay Goc Day 2 locked initially');

  // ─── 2. Mission 1 gates (must finish 1 qualified exam + >=15 char non-spam message) ───
  const fbBeforeExam = await winA.VLXT_GROWTH.completeFeedbackMission({ rating: 5, message: 'Web rất hay và hữu ích ạ!' });
  assert.strictEqual(fbBeforeExam.ok, false);
  assert.strictEqual(fbBeforeExam.reason, 'need_exam_first');

  const tooFastExam = await winA.VLXT_GROWTH.recordQualifiedActivity({ type: 'dgnl_exam', examNumber: 1, answeredCount: 5, spentSeconds: 15, score10: '5.0' });
  assert.strictEqual(tooFastExam.qualified, false);
  assert.strictEqual(tooFastExam.reason, 'too_fast');

  const tooFewExam = await winA.VLXT_GROWTH.recordQualifiedActivity({ type: 'dgnl_exam', examNumber: 1, answeredCount: 2, spentSeconds: 120, score10: '1.0' });
  assert.strictEqual(tooFewExam.qualified, false);
  assert.strictEqual(tooFewExam.reason, 'too_few_answers');

  const okExamA = await winA.VLXT_GROWTH.recordQualifiedActivity({ type: 'dgnl_exam', examNumber: 1, answeredCount: 18, spentSeconds: 420, score10: '8.25' });
  assert.strictEqual(okExamA.qualified, true);

  const fbSpam = await winA.VLXT_GROWTH.completeFeedbackMission({ rating: 5, message: 'aaaaaaaaaaaaaaaaaaaa' });
  assert.strictEqual(fbSpam.ok, false);
  assert.strictEqual(fbSpam.reason, 'message_too_short_or_spam');

  const fbValid = await winA.VLXT_GROWTH.completeFeedbackMission({
    rating: 5,
    favoriteFeature: 'Mô phỏng 60 FPS',
    targetScore: '9+',
    message: 'Mô phỏng thí nghiệm sóng và nhiệt rất trực quan dễ hiểu ạ.'
  });
  assert.strictEqual(fbValid.ok, true);
  assert.strictEqual(fbValid.bonusAdded, 2);
  assert.strictEqual(winA.VLXT_CAMPAIGN.getUserEarlyAccessState(userA).totalDays, 5, '3 + 2 = 5 days after Mission 1');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(6, userA), true, 'De 06 unlocked after Mission 1');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 1, {}, userA), true, 'Lay Goc Day 2 unlocked after Mission 1');

  const fbDup = await winA.VLXT_GROWTH.completeFeedbackMission({ rating: 5, message: 'Gửi lần hai để thử nhận thưởng trùng' });
  assert.strictEqual(fbDup.ok, false);
  assert.strictEqual(fbDup.reason, 'already_completed');

  // Publish A's referral code to mock RTDB
  await winA.VLXT_GROWTH.syncGrowthProfile(userA);
  const shareA = winA.VLXT_GROWTH.buildSharePayload({ ctype: 'dgnl', examNumber: 1, score10: '8.25' });
  assert(shareA.refCode.startsWith('VL') && shareA.refCode.length === 8);
  assert(shareA.url.includes('ref=' + shareA.refCode));

  // ─── 3. Anti-Cheat Checks (Same browser anonId, Same deviceId, Self-invite) ───
  const winSameDevice = createBrowserSandbox(rtdb, {
    anonId: 'anon_A',
    pathname: '/danh-gia-nang-luc.html',
    search: `?exam=01&ref=${shareA.refCode}&cscore=8.25&cname=Nguyen%20Van%20A`
  });
  winSameDevice.VLXT_GROWTH.captureIncomingReferralFromUrl();
  const fakeAlt = { sdt: '0911000099', hoten: 'Nick Ao', lop: '12A1', loaiTK: 'vip' };
  winSameDevice.localStorage.setItem('vlxt_user_v2', JSON.stringify(fakeAlt));
  const sameBrowserBind = await winSameDevice.VLXT_GROWTH.bindReferralOnRegister(fakeAlt, 'dev_alt');
  assert.strictEqual(sameBrowserBind.bound, false);
  assert.strictEqual(sameBrowserBind.reason, 'same_browser_device');

  // ─── 4. Genuine Friend B (New device + Qualified Exam -> Dual +2d + Cascade to C) ───
  const winB = createBrowserSandbox(rtdb, {
    anonId: 'anon_B',
    pathname: '/danh-gia-nang-luc.html',
    search: `?exam=01&ref=${shareA.refCode}&cscore=8.25&cname=Nguyen%20Van%20A&clop=12A1`
  });
  winB.VLXT_GROWTH.captureIncomingReferralFromUrl();
  const userB = { sdt: 'tranbinh2009@gmail.com', hoten: 'Tran Binh', lop: '12A2', loaiTK: 'vip' };
  winB.localStorage.setItem('vlxt_user_v2', JSON.stringify(userB));

  const bindB = await winB.VLXT_GROWTH.bindReferralOnRegister(userB, 'dev_B');
  assert.strictEqual(bindB.bound, true, 'Friend B must bind referral cleanly');
  assert.strictEqual(winB.VLXT_CAMPAIGN.getUserEarlyAccessState(userB).totalDays, 3, 'Friend B stays at 3 days before completing 1st exam');

  const qualB = await winB.VLXT_GROWTH.recordQualifiedActivity({ type: 'dgnl_exam', examNumber: 1, answeredCount: 20, spentSeconds: 300, score10: '8.50' });
  assert.strictEqual(qualB.qualified, true);
  assert.strictEqual(qualB.justQualifiedReferral, true);
  assert.strictEqual(qualB.bonusAdded, 2);
  assert.strictEqual(winB.VLXT_CAMPAIGN.getUserEarlyAccessState(userB).totalDays, 5, 'Friend B reaches 5 days after 1st exam');
  assert.strictEqual(winB.VLXT_GROWTH.makeRefCode(userB.sdt).length, 8, 'Gmail refCode valid');

  // Sync A -> A gets +2 days and unlocks De 07
  await winA.VLXT_GROWTH.syncGrowthProfile(userA);
  assert.strictEqual(winA.VLXT_CAMPAIGN.getUserEarlyAccessState(userA).totalDays, 7, 'Inviter A gets +2 days -> 7 days');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(7, userA), true, 'De 07 unlocked for A');

  // ─── 5. Exponential Cascade: B invites C ───
  const shareB = winB.VLXT_GROWTH.buildSharePayload({ ctype: 'dgnl', examNumber: 1, score10: '8.50' });
  assert.notStrictEqual(shareB.refCode, shareA.refCode);
  const winC = createBrowserSandbox(rtdb, {
    anonId: 'anon_C',
    pathname: '/danh-gia-nang-luc.html',
    search: `?exam=01&ref=${shareB.refCode}&cscore=8.50&cname=Tran%20Binh`
  });
  winC.VLXT_GROWTH.captureIncomingReferralFromUrl();
  const userC = { sdt: '0933000003', hoten: 'Le Chi', lop: '12A2', loaiTK: 'vip' };
  winC.localStorage.setItem('vlxt_user_v2', JSON.stringify(userC));
  const bindC = await winC.VLXT_GROWTH.bindReferralOnRegister(userC, 'dev_C');
  assert.strictEqual(bindC.bound, true);
  await winC.VLXT_GROWTH.recordQualifiedActivity({ type: 'solo_match', examId: 'solo_1v1', answeredCount: 8, spentSeconds: 45, score10: '60' });
  await winB.VLXT_GROWTH.syncGrowthProfile(userB);
  assert.strictEqual(winB.VLXT_CAMPAIGN.getUserEarlyAccessState(userB).totalDays, 7, 'B cascades to 7 days when C finishes solo match');

  // ─── 6. Class Leader (3 friends -> De 10 + Day 3) & Cap (+14d max bonus -> 17d total; De 11 locked) ───
  for (let i = 2; i <= 8; i++) {
    const wf = createBrowserSandbox(rtdb, {
      anonId: 'anon_F' + i,
      pathname: '/thithu.html',
      search: `?ref=${shareA.refCode}`
    });
    wf.VLXT_GROWTH.captureIncomingReferralFromUrl();
    const uf = { sdt: '094400000' + i, hoten: 'Ban Lop ' + i, lop: '12A1', loaiTK: 'vip' };
    wf.localStorage.setItem('vlxt_user_v2', JSON.stringify(uf));
    await wf.VLXT_GROWTH.bindReferralOnRegister(uf, 'dev_F' + i);
    await wf.VLXT_GROWTH.recordQualifiedActivity({ type: 'thithu_exam', examId: 'thithu_01', answeredCount: 15, spentSeconds: 180, score10: '7.5' });
  }
  await winA.VLXT_GROWTH.syncGrowthProfile(userA);
  const stMax = winA.VLXT_CAMPAIGN.getUserEarlyAccessState(userA);
  const gpMax = winA.VLXT_GROWTH.getGrowthProfile(userA);
  assert.strictEqual(gpMax.isClassLeader, true, 'Class Leader badge earned at >=3 qualified refs');
  assert.strictEqual(stMax.bonusDays, 14, 'Bonus capped at 14 days');
  assert.strictEqual(stMax.totalDays, 17, 'Total days capped at 3 + 14 = 17 days');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(10, userA), true, 'De 10 unlocked for Class Leader');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessDgnlExam(11, userA), false, 'De 11 strictly reserved for Paid Pro');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 2, {}, userA), true, 'Lay Goc Day 3 unlocked');
  assert.strictEqual(winA.VLXT_CAMPAIGN.canAccessLayGocLesson('5 NGÀY LẤY GỐC VẬT LÍ', 3, {}, userA), false, 'Lay Goc Day 4 strictly reserved for Paid Pro');

  console.log('✓ ALL 6 VIRAL GROWTH LOOP & ANTI-CHEAT TEST SUITES PASSED!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
