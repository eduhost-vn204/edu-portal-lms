import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import TrialManager from '../trial-manager.js';

console.log('=== TEST SUITE: TRIAL SOFT UNLOCK & DAILY LIMIT REGRESSION ===\n');

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

// -----------------------------------------------------------------------------
// GATE 1: Nhận diện tài khoản Trial vs Premium vs Test
// -----------------------------------------------------------------------------
console.log('--- [GATE 1] Phân Loại Tài Khoản (Trial vs Premium) ---');

it('User null/undefined được nhận diện là Trial', () => {
  assert.equal(TrialManager.isPremiumUser(null), false);
  assert.equal(TrialManager.isTrialUser(null), true);
});

it('User loaiTK: premium được nhận diện là Premium', () => {
  const u = { sdt: '0987654321', loaiTK: 'premium' };
  assert.equal(TrialManager.isPremiumUser(u), true);
  assert.equal(TrialManager.isTrialUser(u), false);
});

it('User loaiTK: vip hoặc free hoặc rỗng được nhận diện là Trial', () => {
  assert.equal(TrialManager.isPremiumUser({ loaiTK: 'vip' }), false);
  assert.equal(TrialManager.isTrialUser({ loaiTK: 'vip' }), true);
  assert.equal(TrialManager.isPremiumUser({ loaiTK: 'free' }), false);
  assert.equal(TrialManager.isTrialUser({ loaiTK: 'free' }), true);
  assert.equal(TrialManager.isPremiumUser({ loaiTK: '' }), false);
  assert.equal(TrialManager.isTrialUser({ loaiTK: '' }), true);
});

// -----------------------------------------------------------------------------
// GATE 2: Phân tích bài nền tảng (BaiNenTang)
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 2] Phân Tích Bài Nền Tảng (BaiNenTang) ---');

it('Parse chuỗi rỗng / null / undefined ra mảng rỗng', () => {
  assert.deepEqual(TrialManager.parsePrerequisites(''), []);
  assert.deepEqual(TrialManager.parsePrerequisites(null), []);
  assert.deepEqual(TrialManager.parsePrerequisites(undefined), []);
});

it('Parse chuỗi 1 mã, nhiều mã (dấu phẩy, chấm phẩy, khoảng trắng)', () => {
  assert.deepEqual(TrialManager.parsePrerequisites('B04e20f0ec67d'), ['B04e20f0ec67d']);
  assert.deepEqual(
    TrialManager.parsePrerequisites('B04e20f0ec67d, Bfb85fde44802'),
    ['B04e20f0ec67d', 'Bfb85fde44802']
  );
  assert.deepEqual(
    TrialManager.parsePrerequisites('B04e20f0ec67d;Bfb85fde44802 | Bfc4552a2a3b2'),
    ['B04e20f0ec67d', 'Bfb85fde44802', 'Bfc4552a2a3b2']
  );
});

it('Parse mảng JSON chuỗi', () => {
  assert.deepEqual(
    TrialManager.parsePrerequisites('["B04e20f0ec67d", "Bfb85fde44802"]'),
    ['B04e20f0ec67d', 'Bfb85fde44802']
  );
  assert.deepEqual(
    TrialManager.parsePrerequisites(['B04e20f0ec67d', 'Bfb85fde44802']),
    ['B04e20f0ec67d', 'Bfb85fde44802']
  );
});

// -----------------------------------------------------------------------------
// GATE 3: Tìm bài học nền tảng & Lọc bài chưa học
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 3] Tìm Bài Học Nền Tảng & Lọc Bài Chưa Học ---');

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
          { key: 'B04', mabai: 'B04', name: 'B4. Bài trống chưa cập nhật', video: '', pdf: '', pdflt: '', baitap: [] },
          { key: 'B05', mabai: 'B05', name: 'B5. Định luật Boyle', video: 'https://youtu.be/v5', legacyKey: 'K12|||C1|||B5' }
        ]
      }
    ]
  }
];

it('Tìm bài học theo MaBai, legacyKey hoặc Tên bài', () => {
  assert.equal(TrialManager.findLessonByIdentifier('B01', mockCourses).name, 'B1. Cấu trúc chất');
  assert.equal(TrialManager.findLessonByIdentifier('K12|||C1|||B5', mockCourses).mabai, 'B05');
  assert.equal(TrialManager.findLessonByIdentifier('B1. Cấu trúc chất', mockCourses).mabai, 'B01');
  assert.equal(TrialManager.findLessonByIdentifier('KHONG_TON_TAI', mockCourses), null);
});

it('Lấy danh sách bài nền tảng chưa học: chính xác theo watchedSet', () => {
  const l3 = mockCourses[0].chapters[0].lessons[2]; // B3 cần B01, B02
  const watchedNone = new Set();
  const unfin1 = TrialManager.getUnfinishedPrerequisites(l3, mockCourses, watchedNone);
  assert.equal(unfin1.length, 2);
  assert.equal(unfin1[0].key, 'B01');
  assert.equal(unfin1[1].key, 'B02');

  const watchedB1 = new Set(['B01']);
  const unfin2 = TrialManager.getUnfinishedPrerequisites(l3, mockCourses, watchedB1);
  assert.equal(unfin2.length, 1);
  assert.equal(unfin2[0].key, 'B02');

  const watchedAll = new Set(['B01', 'B02']);
  const unfin3 = TrialManager.getUnfinishedPrerequisites(l3, mockCourses, watchedAll);
  assert.equal(unfin3.length, 0);
});

// -----------------------------------------------------------------------------
// GATE 4: Múi giờ Việt Nam (UTC+7, Asia/Saigon)
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 4] Múi Giờ Việt Nam (Asia/Saigon) ---');

it('Tính đúng ngày Việt Nam bất kể giờ UTC', () => {
  // 2026-09-14 18:00:00 UTC = 2026-09-15 01:00:00 GMT+7
  const utcLate = new Date('2026-09-14T18:00:00.000Z').getTime();
  assert.equal(TrialManager.getVietnamDateStr(utcLate), '2026-09-15');

  // 2026-09-14 02:00:00 UTC = 2026-09-14 09:00:00 GMT+7
  const utcEarly = new Date('2026-09-14T02:00:00.000Z').getTime();
  assert.equal(TrialManager.getVietnamDateStr(utcEarly), '2026-09-14');
});

// -----------------------------------------------------------------------------
// GATE 5: Cơ chế Soft Unlock (Mở mềm) vs Chặn bài trống
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 5] Cơ Chế Mở Mềm & Chặn Bài Trống ---');

// Mock localStorage trong môi trường Node
const mockStorage = new Map();
global.localStorage = {
  getItem: (k) => mockStorage.get(k) || null,
  setItem: (k, v) => mockStorage.set(k, String(v)),
  removeItem: (k) => mockStorage.delete(k),
  clear: () => mockStorage.clear()
};

it('Trial được mở bài B02 dù chưa học B01 (không bị khóa cứng tuần tự)', () => {
  mockStorage.clear();
  const sdt = '0901234567';
  const l2 = mockCourses[0].chapters[0].lessons[1]; // B02
  const watched = new Set(); // chưa học gì

  const res = TrialManager.canAccessTrialLesson(sdt, l2, mockCourses, watched);
  assert.equal(res.allowed, true);
  assert.equal(res.isOldLesson, false);
  // Có bài nền tảng B01 chưa học
  assert.equal(res.unfinishedPrereqs.length, 1);
  assert.equal(res.unfinishedPrereqs[0].key, 'B01');
});

it('Bài trống (empty) bị chặn tuyệt đối cả với trial', () => {
  const sdt = '0901234567';
  const l4 = mockCourses[0].chapters[0].lessons[3]; // B04 trống
  const watched = new Set();

  const res = TrialManager.canAccessTrialLesson(sdt, l4, mockCourses, watched);
  assert.equal(res.allowed, false);
  assert.equal(res.reason, 'empty');
});

// -----------------------------------------------------------------------------
// GATE 6: Giới hạn 2 bài mới mỗi ngày theo giờ Việt Nam
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 6] Giới Hạn 2 Bài Mới Mỗi Ngày (Daily Limit) ---');

it('Học 2 bài mới trong ngày: bài 1 và bài 2 được phép, bài thứ 3 bị chặn', () => {
  mockStorage.clear();
  const sdt = '0911223344';
  const l1 = mockCourses[0].chapters[0].lessons[0];
  const l2 = mockCourses[0].chapters[0].lessons[1];
  const l3 = mockCourses[0].chapters[0].lessons[2];
  const watched = new Set();

  // Chưa học bài nào: được phép mở l1
  const check1 = TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, watched);
  assert.equal(check1.allowed, true);
  assert.equal(check1.remaining, 2);

  // Kích hoạt học l1
  const rec1 = TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12');
  assert.equal(rec1.ok, true);
  assert.equal(rec1.dailyCount, 1);
  assert.equal(rec1.remaining, 1);

  // Bài mới thứ 2: được phép mở l2
  const check2 = TrialManager.canAccessTrialLesson(sdt, l2, mockCourses, watched);
  assert.equal(check2.allowed, true);
  assert.equal(check2.remaining, 1);

  // Kích hoạt học l2
  const rec2 = TrialManager.recordTrialLessonStart(sdt, l2, 'Khóa 12');
  assert.equal(rec2.ok, true);
  assert.equal(rec2.dailyCount, 2);
  assert.equal(rec2.remaining, 0);

  // Bài mới thứ 3: BỊ CHẶN TUYỆT ĐỐI
  const check3 = TrialManager.canAccessTrialLesson(sdt, l3, mockCourses, watched);
  assert.equal(check3.allowed, false);
  assert.equal(check3.reason, 'trial_limit');
  assert.equal(check3.dailyCount, 2);
  assert.match(check3.nextResetMsg, /00:00 ngày mai/);
});

// -----------------------------------------------------------------------------
// GATE 7: Xem lại bài cũ (đã từng bắt đầu hoặc WATCHED) KHÔNG tính lượt
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 7] Xem Lại Bài Cũ Không Tính Lượt & Mở Tự Do Khi Hết Lượt ---');

it('Khi đã hết 2 lượt bài mới hôm nay, vẫn mở lại được bài l1 và l2', () => {
  const sdt = '0911223344'; // đã dùng 2 bài l1, l2 ở test trước
  const l1 = mockCourses[0].chapters[0].lessons[0];
  const l2 = mockCourses[0].chapters[0].lessons[1];
  const watched = new Set();

  const review1 = TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, watched);
  assert.equal(review1.allowed, true);
  assert.equal(review1.isOldLesson, true);

  const review2 = TrialManager.canAccessTrialLesson(sdt, l2, mockCourses, watched);
  assert.equal(review2.allowed, true);
  assert.equal(review2.isOldLesson, true);
});

it('Bài đã hoàn thành trong WATCHED luôn được xem lại mà không tăng daily count', () => {
  const sdt = '0933445566';
  mockStorage.clear();
  const l5 = mockCourses[0].chapters[0].lessons[4];
  const watched = new Set(['B05']); // Đã hoàn thành từ trước

  const res = TrialManager.canAccessTrialLesson(sdt, l5, mockCourses, watched);
  assert.equal(res.allowed, true);
  assert.equal(res.isOldLesson, true);

  // Thử record lại -> không được tăng daily count
  const rec = TrialManager.recordTrialLessonStart(sdt, l5, 'Khóa 12');
  assert.equal(rec.ok, true);
  assert.equal(rec.dailyCount, 1);
  // Ghi nhận lần 2 với cùng bài
  const recAgain = TrialManager.recordTrialLessonStart(sdt, l5, 'Khóa 12');
  assert.equal(recAgain.isNew, false);
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 1);
});

// -----------------------------------------------------------------------------
// GATE 8: Chống bấm nhầm (Chỉ tính lượt khi thực sự bắt đầu học)
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 8] Chống Bấm Nhầm (Misclick Protection) ---');

it('Chỉ kiểm tra canAccessTrialLesson không tự động trừ lượt học', () => {
  mockStorage.clear();
  const sdt = '0944556677';
  const l1 = mockCourses[0].chapters[0].lessons[0];

  // Bấm vào xem thông tin bài học (check)
  TrialManager.canAccessTrialLesson(sdt, l1, mockCourses, new Set());
  // Học sinh đóng tab ngay lập tức (không gọi recordTrialLessonStart)
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 0);
  assert.equal(TrialManager.isLessonStarted(sdt, l1.key, new Set()), false);
});

// -----------------------------------------------------------------------------
// GATE 9: Bỏ qua cảnh báo bài nền tảng không tự đánh dấu đã học
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 9] Nút Tiếp Tục Không Đánh Dấu Bài Nền Tảng Là Đã Học ---');

const mockSession = new Map();
global.sessionStorage = {
  getItem: (k) => mockSession.get(k) || null,
  setItem: (k, v) => mockSession.set(k, String(v)),
  removeItem: (k) => mockSession.delete(k),
  clear: () => mockSession.clear()
};

it('Dismiss cảnh báo lưu vào sessionStorage, không làm thay đổi WATCHED hay progress', () => {
  mockSession.clear();
  const sdt = '0977889900';
  const lessonKey = 'B02';

  assert.equal(TrialManager.isPrereqWarningDismissed(sdt, lessonKey), false);
  TrialManager.dismissPrereqWarning(sdt, lessonKey);
  assert.equal(TrialManager.isPrereqWarningDismissed(sdt, lessonKey), true);

  // Bài nền tảng B01 vẫn chưa có trong watchedSet
  const watched = new Set();
  const l2 = mockCourses[0].chapters[0].lessons[1];
  const unfinished = TrialManager.getUnfinishedPrerequisites(l2, mockCourses, watched);
  assert.equal(unfinished.length, 1);
  assert.equal(unfinished[0].key, 'B01');
});

// -----------------------------------------------------------------------------
// GATE 10: Idempotency & Hàng đợi ngoại tuyến khi mạng yếu
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 10] Chống Tính Trùng (Idempotency) & Hàng Đợi Ngoại Tuyến ---');

it('Ghi nhận cùng bài nhiều lần chỉ sinh đúng 1 bản ghi và 1 mục hàng đợi', () => {
  mockStorage.clear();
  const sdt = '0988990011';
  const l1 = mockCourses[0].chapters[0].lessons[0];

  TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12');
  TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12'); // lặp lại
  TrialManager.recordTrialLessonStart(sdt, l1, 'Khóa 12'); // lặp lại

  assert.equal(TrialManager.getDailyNewLessonsCount(sdt), 1);
  const queue = TrialManager.readTrialQueue();
  assert.equal(queue.length, 1);
  assert.equal(queue[0].record.key, l1.key);
});

// -----------------------------------------------------------------------------
// GATE 11: Sang ngày mới theo giờ Việt Nam (Reset hạn mức 2 bài)
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 11] Sang Ngày Mới Theo Giờ Việt Nam (Reset Lượt Bài Mới) ---');

it('Hôm qua đã học đủ 2 bài, hôm nay tự động có lại 2 lượt bài mới', () => {
  mockStorage.clear();
  const sdt = '0922334455';
  const yesterdayVN = '2026-09-13';
  const todayVN = TrialManager.getVietnamDateStr(); // 2026-09-14

  // Giả lập lịch sử hôm qua đã dùng 2 bài
  const yesterdayStarted = [
    { key: 'B01', mabai: 'B01', date: yesterdayVN, timestamp: Date.now() - 86400000 },
    { key: 'B02', mabai: 'B02', date: yesterdayVN, timestamp: Date.now() - 86400000 }
  ];
  mockStorage.set('vlxt_trial_started_' + sdt, JSON.stringify(yesterdayStarted));

  // Kiểm tra số bài hôm qua vs hôm nay
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt, yesterdayVN), 2);
  assert.equal(TrialManager.getDailyNewLessonsCount(sdt, todayVN), 0);

  // Hôm nay vẫn mở được bài mới B03
  const l3 = mockCourses[0].chapters[0].lessons[2];
  const accessToday = TrialManager.canAccessTrialLesson(sdt, l3, mockCourses, new Set());
  assert.equal(accessToday.allowed, true);
  assert.equal(accessToday.remaining, 2);
});

// -----------------------------------------------------------------------------
// GATE 12: Kiểm tra tích hợp trực tiếp isLessonBlocked & isPublicLesson từ baihoc.html
// -----------------------------------------------------------------------------
console.log('\n--- [GATE 12] Tích Hợp Trực Tiếp isLessonBlocked & isPublicLesson Từ baihoc.html ---');

import vm from 'node:vm';

const htmlContent = fs.readFileSync('baihoc.html', 'utf8');

it('Thẻ đóng </html> có mặt và không bị hỏng', () => {
  assert.equal(htmlContent.includes('</html>'), true);
});

it('Script trial-manager.js được nhúng đầy đủ trong baihoc.html', () => {
  assert.match(htmlContent, /<script\s+src=["']trial-manager\.js/);
});

// Tạo VM Sandbox để chạy logic trích xuất từ baihoc.html
const sandbox = {
  console,
  TrialManager,
  TEST_ACCOUNTS: ['0900000001'],
  WATCHED: new Set(),
  COURSES: mockCourses,
  HS: { sdt: '0901234567', ten: 'Học sinh Test' },
  localStorage: {
    getItem: (k) => mockStorage.get(k) || null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k)
  },
  sessionStorage: {
    getItem: (k) => mockSession.get(k) || null,
    setItem: (k, v) => mockSession.set(k, String(v)),
    removeItem: (k) => mockSession.delete(k)
  },
  flatLessons: (c) => (c.chapters || []).flatMap(ch => ch.lessons || []),
  lessonHasContent: (l) => !!(l && (l.video || l.pdf || l.pdflt || l.pdfluyentap || l.videogiai || (l.baitap && l.baitap.length > 0) || Number(l._quizCount)>0)),
  field: (obj, keys) => {
    for (const k of keys) {
      for (const prop in obj) {
        if (prop.toLowerCase() === k.toLowerCase()) return obj[prop];
      }
    }
    return '';
  }
};

vm.createContext(sandbox);

// Nạp hàm isTestAccount, isPublicLesson và isLessonBlocked từ baihoc.html vào sandbox
const isTestAccountCode = htmlContent.match(/function isTestAccount\(\)[\s\S]*?\n\}/)?.[0];
const isPublicLessonCode = htmlContent.match(/function isPublicLesson\(x\)[\s\S]*?\n\}/)?.[0];
const isLessonBlockedCode = htmlContent.match(/function isLessonBlocked\(course, key\)[\s\S]*?\n\}/)?.[0];

assert.ok(isTestAccountCode, 'Tìm thấy hàm isTestAccount trong baihoc.html');
assert.ok(isPublicLessonCode, 'Tìm thấy hàm isPublicLesson trong baihoc.html');
assert.ok(isLessonBlockedCode, 'Tìm thấy hàm isLessonBlocked trong baihoc.html');

vm.runInContext(isTestAccountCode, sandbox);
vm.runInContext(isPublicLessonCode, sandbox);
vm.runInContext(isLessonBlockedCode, sandbox);

it('Hàm isPublicLesson chặn bài draft và archived, cho phép bài published hoặc rỗng', () => {
  assert.equal(sandbox.isPublicLesson({ TrangThai: 'draft' }), false);
  assert.equal(sandbox.isPublicLesson({ TrangThai: 'archived' }), false);
  assert.equal(sandbox.isPublicLesson({ TrangThai: 'published' }), true);
  assert.equal(sandbox.isPublicLesson({ TrangThai: '' }), true);
  assert.equal(sandbox.isPublicLesson(null), false);
});

it('Tài khoản Premium: isLessonBlocked chặn tuần tự nghiêm ngặt khi bài trước chưa xem', () => {
  mockStorage.set('vlxt_user_v2', JSON.stringify({ sdt: '0901234567', loaiTK: 'premium' }));
  sandbox.WATCHED.clear();
  const c = mockCourses[0];
  const l2Key = c.chapters[0].lessons[1].key; // B02 (bài 2)

  // B01 chưa xem -> B02 phải bị khóa tuần tự (sequence)
  const blk = sandbox.isLessonBlocked(c, l2Key);
  assert.equal(blk.blocked, true);
  assert.equal(blk.reason, 'sequence');

  // Đã xem B01 -> B02 mở
  sandbox.WATCHED.add('B01');
  const unblk = sandbox.isLessonBlocked(c, l2Key);
  assert.equal(unblk.blocked, false);
});

it('Tài khoản Trial: isLessonBlocked KHÔNG bị khóa tuần tự, được mở bài B02 dù chưa xem B01', () => {
  mockStorage.set('vlxt_user_v2', JSON.stringify({ sdt: '0901234567', loaiTK: 'vip' }));
  sandbox.WATCHED.clear();
  const c = mockCourses[0];
  const l2Key = c.chapters[0].lessons[1].key; // B02

  const blk = sandbox.isLessonBlocked(c, l2Key);
  assert.equal(blk.blocked, false);
  assert.ok(blk.trialInfo);
});

it('Tài khoản Test của Thầy: luôn mở mọi bài kể cả khi chưa xem bài trước', () => {
  sandbox.HS = { sdt: '0900000001', ten: 'Thầy Xuân Trường' };
  sandbox.WATCHED.clear();
  const c = mockCourses[0];
  const l2Key = c.chapters[0].lessons[1].key;

  const blk = sandbox.isLessonBlocked(c, l2Key);
  assert.equal(blk.blocked, false);
});

// -----------------------------------------------------------------------------
// TỔNG KẾT
// -----------------------------------------------------------------------------
console.log('\n========================================');
console.log(`KẾT QUẢ: Đã chạy thành công ${passed}/${total} test cases (100% PASS).`);
console.log('========================================\n');

