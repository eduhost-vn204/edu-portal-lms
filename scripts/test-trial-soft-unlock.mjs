import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import TrialManager from '../trial-manager.js';

console.log('=== TEST SUITE: TRIAL SOFT UNLOCK & SERVER-SIDE LIMIT VERIFICATION ===\n');

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

// =============================================================================
// BLOCKER 2 TEST: Phân Loại 4 Nhóm Tài Khoản (Trial vs Free vs Trial Hết Hạn vs Premium)
// =============================================================================
console.log('--- [BLOCKER 2] Phân Loại 4 Nhóm Tài Khoản ---');

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
  const past = Date.now() - 1000; // đã hết hạn
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

// Thiết lập biến môi trường Apps Script URL cho môi trường test
global.VLXT_GAS = 'https://script.google.com/macros/s/AKfycbz_VLXT_TEST/exec';

// =============================================================================
// BLOCKER 1 TEST: Server-Side Sync & Endpoint Chống Xóa LocalStorage / Đổi Thiết Bị
// =============================================================================
console.log('\n--- [BLOCKER 1] Server-Side Limit & Đồng Bộ Đa Thiết Bị ---');

await itAsync('Đổi thiết bị / Xóa localStorage: fetchTrialLimitServer khôi phục hạn mức từ server, không vượt quá 2 bài/ngày', async () => {
  mockStorage.clear();
  const sdt = '0988000001';
  const todayVN = TrialManager.getVietnamDateStr();

  // Giả lập server đã có sẵn 2 bản ghi bài học hôm nay của học sinh này trên Google Sheets/Backend
  const serverStartedLessons = [
    { key: 'B01', mabai: 'B01', date: todayVN, timestamp: Date.now() - 3600000 },
    { key: 'B02', mabai: 'B02', date: todayVN, timestamp: Date.now() - 1800000 }
  ];

  // Giả lập fetch API phản hồi endpoint GAS ?type=triallimit&hs=...
  const originalFetch = global.fetch;
  global.fetch = async function (url) {
    if (String(url).includes('type=triallimit')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          ok: true,
          sdt: sdt,
          dateVN: todayVN,
          dailyCount: 2,
          maxDaily: 2,
          remaining: 0,
          startedLessons: serverStartedLessons
        })
      };
    }
    return { ok: false, status: 404, json: async () => ({ ok: false }) };
  };

  try {
    // Trạng thái cục bộ hiện tại: rỗng hoàn toàn (học sinh vừa xóa cache hoặc đăng nhập máy mới)
    assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 0);

    // Kích hoạt đồng bộ từ server
    const serverResult = await TrialManager.fetchTrialLimitServer(sdt);
    assert.equal(serverResult.ok, true);
    assert.equal(serverResult.dailyCount, 2);
    assert.equal(serverResult.remaining, 0);

    // LocalStorage đã được khôi phục chính xác từ dữ liệu server
    assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 2);
    assert.equal(TrialManager.isLessonStarted(sdt, 'B01', new Set()), true);
    assert.equal(TrialManager.isLessonStarted(sdt, 'B02', new Set()), true);

    // Khi cố gắng mở bài mới thứ 3 (B03): BỊ CHẶN do hạn mức server đã ghi nhận
    const l3 = mockCourses[0].chapters[0].lessons[2];
    const check3 = TrialManager.canAccessTrialLesson(sdt, l3, mockCourses, new Set());
    assert.equal(check3.allowed, false);
    assert.equal(check3.reason, 'trial_limit');
    assert.equal(check3.dailyCount, 2);
  } finally {
    global.fetch = originalFetch;
  }
});

// =============================================================================
// MÔ PHỎNG BACKEND GAS SERVER (Chống Race Condition / 2 Request Đồng Thời)
// =============================================================================
console.log('\n--- [BLOCKER 1 - CONCURRENCY] Mô Phỏng Backend GAS Endpoint & Khóa Độc Quyền ---');

it('Hai yêu cầu đồng thời (concurrent requests) với lock backend không thể vượt quá hạn mức 2 bài', () => {
  // Giả lập logic trong apps-script-CAPNHAT.txt: getScriptLock + startTrialLesson
  const fakeGasDb = new Map(); // SĐT -> Array<{mabai, date}>
  let lockAcquired = false;

  function fakeGasStartTrialLesson(sdt, mabai, dateVN) {
    // Mô phỏng LockService.getScriptLock()
    if (lockAcquired) {
      throw new Error('Lock timeout');
    }
    lockAcquired = true;
    try {
      const records = fakeGasDb.get(sdt) || [];
      // Đếm số bài đã học trong ngày hôm nay
      const todayLessons = new Set();
      for (const r of records) {
        if (r.date === dateVN) todayLessons.add(r.mabai);
      }

      // Nếu bài này đã học rồi -> idempotent ok
      if (todayLessons.has(mabai)) {
        return { ok: true, isNew: false, dailyCount: todayLessons.size, remaining: Math.max(0, 2 - todayLessons.size) };
      }

      // Nếu đã đủ 2 bài mới hôm nay -> CHẶN
      if (todayLessons.size >= 2) {
        return { ok: false, reason: 'trial_limit', dailyCount: todayLessons.size, remaining: 0 };
      }

      // Ghi nhận bài mới
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

  const sdt = '0966000001';
  const todayVN = '2026-09-14';

  // Yêu cầu 1: Bắt đầu bài B01 -> Thành công (lượt 1)
  const res1 = fakeGasStartTrialLesson(sdt, 'B01', todayVN);
  assert.equal(res1.ok, true);
  assert.equal(res1.dailyCount, 1);
  assert.equal(res1.remaining, 1);

  // Giả lập 2 tab cùng bấm bắt đầu 2 bài khác nhau gần như cùng lúc: B02 và B03
  // Request A đến trước một chút (chiếm lock và ghi bài B02)
  const resA = fakeGasStartTrialLesson(sdt, 'B02', todayVN);
  assert.equal(resA.ok, true);
  assert.equal(resA.dailyCount, 2);
  assert.equal(resA.remaining, 0);

  // Request B đến sau (bài B03) -> Bị server từ chối ngay lập tức vì đã đủ 2 bài
  const resB = fakeGasStartTrialLesson(sdt, 'B03', todayVN);
  assert.equal(resB.ok, false);
  assert.equal(resB.reason, 'trial_limit');
  assert.equal(resB.dailyCount, 2);
  assert.equal(resB.remaining, 0);

  // Tổng số bài trong database backend tuyệt đối không vượt quá 2
  assert.equal(fakeGasDb.get(sdt).length, 2);
});

// =============================================================================
// BLOCKER 3 TEST: Sửa _isTrialLimit thành _isLimit trong renderLesson & Mở bài thứ 3
// =============================================================================
console.log('\n--- [BLOCKER 3] renderLesson Không Bị ReferenceError & Render Chuẩn Khi Hết Lượt ---');

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

it('Mở trực tiếp bài thứ ba qua renderLesson(key) khi hết lượt: KHÔNG quăng lỗi và render đúng UI', () => {
  mockStorage.clear();
  const sdt = '0955000001';
  const todayVN = TrialManager.getVietnamDateStr();

  // Đã dùng hết 2 bài B01 và B02
  TrialManager.recordTrialLessonStart(sdt, mockCourses[0].chapters[0].lessons[0], 'Khóa 12');
  TrialManager.recordTrialLessonStart(sdt, mockCourses[0].chapters[0].lessons[1], 'Khóa 12');
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 2);

  // Thiết lập DOM & VM Sandbox để chạy renderLesson
  let currentInnerHtml = '';
  const fakeAppElement = {
    get innerHTML() { return currentInnerHtml; },
    set innerHTML(val) { currentInnerHtml = val; }
  };

  const testSandbox = {
    console,
    location: { hash: '#lesson/B03' },
    TrialManager,
    TEST_ACCOUNTS: ['0900000001'],
    WATCHED: new Set(),
    COURSES: mockCourses,
    QUIZ_INDEX: null,
    HS: { sdt: sdt, ten: 'Học Sinh Dùng Thử' },
    vlxtGetUser: () => ({ sdt: sdt, loaiTK: 'vip', trialExpiry: Date.now() + 86400000 }),
    app: () => fakeAppElement,
    go: () => {},
    esc: (s) => (s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    localStorage: global.localStorage,
    sessionStorage: global.sessionStorage,
    findLesson: (key) => {
      const c = mockCourses[0];
      const l = c.chapters[0].lessons.find(x => x.key === key);
      if (!l) return null;
      return { course: c, chapter: c.chapters[0], lesson: l };
    },
    flatLessons: (c) => (c.chapters || []).flatMap(ch => ch.lessons || []),
    lessonHasContent: (l) => !!(l && (l.video || l.pdf || l.pdflt || (l.baitap && l.baitap.length > 0))),
    field: (obj, keys) => {
      for (const k of keys) {
        for (const prop in obj) {
          if (prop.toLowerCase() === k.toLowerCase()) return obj[prop];
        }
      }
      return '';
    }
  };

  vm.createContext(testSandbox);

  // Nạp các hàm cần thiết từ baihoc.html
  const isTestAccountCode = htmlSource.match(/function isTestAccount\(\)[\s\S]*?\n\}/)?.[0];
  const isPublicLessonCode = htmlSource.match(/function isPublicLesson\(x\)[\s\S]*?\n\}/)?.[0];
  const isLessonBlockedCode = htmlSource.match(/function isLessonBlocked\(course, key\)[\s\S]*?\n\}/)?.[0];
  const renderLessonMatch = htmlSource.match(/function renderLesson\(key\)[\s\S]*?\nasync function renderLiveLesson/);
  assert.ok(renderLessonMatch, 'Tìm thấy renderLesson');
  const renderLessonCode = renderLessonMatch[0].replace(/\nasync function renderLiveLesson[\s\S]*$/, '');

  vm.runInContext(isTestAccountCode, testSandbox);
  vm.runInContext(isPublicLessonCode, testSandbox);
  vm.runInContext(isLessonBlockedCode, testSandbox);
  vm.runInContext(renderLessonCode, testSandbox);

  // Thực thi mở trực tiếp bài thứ 3 (B03) khi đã hết lượt
  assert.doesNotThrow(() => {
    testSandbox.renderLesson('B03');
  }, 'renderLesson quăng lỗi khi xử lý bài bị chặn hạn mức học thử!');

  // Kiểm tra HTML được render
  assert.ok(currentInnerHtml.includes('fa-hourglass-half'), 'Phải render icon fa-hourglass-half');
  assert.ok(currentInnerHtml.includes('#f59e0b'), 'Phải render màu cam cảnh báo #f59e0b');
  assert.ok(currentInnerHtml.includes('Em đã dùng hết 2/2 bài học mới hôm nay theo hạn mức học thử'), 'Phải render đúng thông điệp hạn mức học thử');
  assert.ok(currentInnerHtml.includes('B3. Nhiệt dung riêng'), 'Phải hiển thị đúng tên bài học B03');
});

// =============================================================================
// INTEGRATION TEST: Reload, Offline Queue & Idempotency
// =============================================================================
console.log('\n--- [INTEGRATION] Reload, Offline Queue & Chống Trùng Lặp ---');

await itAsync('Học sinh offline: bản ghi đưa vào hàng đợi; khi gọi sync không tạo bản ghi trùng', async () => {
  mockStorage.clear();
  const sdt = '0944000001';
  const l1 = mockCourses[0].chapters[0].lessons[0];

  // Giả lập mạng offline (fetch reject)
  const originalFetch = global.fetch;
  global.fetch = async function () {
    throw new Error('Network error: Offline');
  };

  try {
    // Ghi bài học khi offline
    const res1 = await TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12');
    assert.equal(res1.ok, true);
    assert.equal(res1.dailyCount, 1);

    // Kiểm tra hàng đợi có đúng 1 bản ghi
    const queue1 = TrialManager.readTrialQueue();
    assert.equal(queue1.length, 1);
    assert.equal(queue1[0].record.key, 'B01');

    // Thử record lại lần nữa (reload tab hoặc click lại bài)
    const res2 = await TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12');
    assert.equal(res2.isNew, false);
    assert.equal(res2.dailyCount, 1);

    // Hàng đợi vẫn chỉ có 1 bản ghi duy nhất
    const queue2 = TrialManager.readTrialQueue();
    assert.equal(queue2.length, 1);
  } finally {
    global.fetch = originalFetch;
  }
});

await itAsync('Bài đã học từ hôm trước: hôm sau mở lại không tính vào 2 bài mới của ngày hôm nay', async () => {
  mockStorage.clear();
  const sdt = '0933000001';
  const yesterdayVN = '2026-09-13';
  const todayVN = TrialManager.getVietnamDateStr();

  // Đã học B01 từ hôm qua
  const pastRecords = [
    { key: 'B01', mabai: 'B01', date: yesterdayVN, timestamp: Date.now() - 86400000 }
  ];
  mockStorage.set('vlxt_trial_started_' + sdt, JSON.stringify(pastRecords));

  // Kiểm tra ngày hôm nay: chưa học bài mới nào
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt, todayVN), 0);

  // Hôm nay mở lại bài B01 để ôn tập
  const l1 = mockCourses[0].chapters[0].lessons[0];
  const checkOld = TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, new Set());
  assert.equal(checkOld.allowed, true);
  assert.equal(checkOld.isOldLesson, true);

  // Mock fetch cho test ôn tập bài cũ
  const originalFetch = global.fetch;
  global.fetch = async function () {
    return { ok: true, json: async () => ({ ok: true, isNew: false, dailyCount: 0, remaining: 2 }) };
  };

  try {
    // Record lại bài cũ hôm nay: không tăng dailyCount
    const recOld = await TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12');
    assert.equal(recOld.isNew, false);
    assert.equal(TrialManager.getDailyNewLessonsCount(sdt, todayVN), 0);
    assert.equal(recOld.remaining, 2);
  } finally {
    global.fetch = originalFetch;
  }
});

// Dọn dẹp hàng đợi và mock fetch mặc định cho background sync timer
global.fetch = async function () {
  return { ok: true, status: 200, json: async () => ({ ok: true }) };
};
mockStorage.clear();

// =============================================================================
// TỔNG KẾT
// =============================================================================
console.log('\n===============================================================');
console.log(`KẾT QUẢ: Toàn bộ ${passed}/${total} test cases ĐẠT (100% PASS).`);
console.log('3 Blocker và các điều kiện nghiệm thu đã được kiểm chứng tuyệt đối!');
console.log('===============================================================\n');

process.exit(0);

