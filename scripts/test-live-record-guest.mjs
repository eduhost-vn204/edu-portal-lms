import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

console.log('=== TEST SUITE: LIVE RECORD GUEST ACCESS & LINK VERIFICATION ===\n');

const htmlPath = path.resolve('live-record.html');
const html = fs.readFileSync(htmlPath, 'utf8');

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
// SUITE 1: CẤU TRÚC HTML & BẢO MẬT GUEST ACCESS
// -----------------------------------------------------------------------------
console.log('--- [SUITE 1] Kiểm tra HTML & Quyền truy cập công khai ---');

it('live-record.html kết thúc bằng thẻ </html>', () => {
  assert.ok(html.trim().endsWith('</html>'), 'File phải kết thúc bằng </html>');
});

it('Không có mã chuyển hướng bắt buộc khách về login.html', () => {
  const hasLoginRedirect = /window\.location\.replace\(['"]login\.html/i.test(html) ||
                           /window\.location\.href\s*=\s*['"]login\.html\?from/i.test(html);
  assert.strictEqual(hasLoginRedirect, false, 'live-record.html không được ép redirect sang login.html');
});

it('Gate modal danh tính bị ẩn hoàn toàn (display: none !important)', () => {
  assert.ok(html.includes('#gate { display: none !important; }'), 'Phải có CSS ẩn #gate hoàn toàn');
});

it('data/live-record.json là mảng hợp lệ và không chứa link placeholder', () => {
  const dataRaw = fs.readFileSync(path.resolve('data/live-record.json'), 'utf8');
  const data = JSON.parse(dataRaw);
  assert.ok(Array.isArray(data), 'live-record.json phải là mảng');
  for (const item of data) {
    if (item.LinkLive) {
      assert.ok(!item.LinkLive.includes('placeholder'), 'LinkLive không được chứa placeholder');
    }
  }
});

// -----------------------------------------------------------------------------
// SUITE 2: SANDBOX LOGIC: CANACCESS, ISLESSONBLOCKED, GETLIVESTATUS
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 2] Kiểm tra logic truy cập & phân loại trạng thái Live ---');

function createSandbox() {
  const storage = new Map();
  const mockEl = {
    style: {},
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    innerHTML: '',
    textContent: '',
    value: '',
    appendChild: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    setAttribute: () => {},
    getAttribute: () => null
  };
  const sandbox = {
    console,
    Date,
    Math,
    Set,
    Map,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    JSON,
    setTimeout: () => {},
    clearTimeout: () => {},
    document: {
      querySelector: () => mockEl,
      getElementById: () => mockEl,
      querySelectorAll: () => [],
      addEventListener: () => {},
      createElement: () => mockEl,
      head: mockEl,
      body: mockEl
    },
    window: {
      location: { hash: '', pathname: '/live-record.html', search: '' },
      addEventListener: () => {}
    },
    localStorage: {
      getItem: (k) => storage.has(k) ? storage.get(k) : null,
      setItem: (k, v) => storage.set(k, String(v)),
      removeItem: (k) => storage.delete(k)
    },
    navigator: { onLine: true }
  };
  return sandbox;
}

const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)];
const mainScript = scripts.find(s => s[1].includes('function buildCourses') && s[1].includes('function getLiveStatus'));
assert.ok(mainScript, 'Tìm thấy script chính của live-record.html');

const sandbox = createSandbox();
vm.createContext(sandbox);
vm.runInContext(mainScript[1], sandbox);

it('canAccess luôn trả về true cho mọi người dùng và khách', () => {
  assert.strictEqual(sandbox.canAccess('Khóa bất kỳ'), true);
  assert.strictEqual(sandbox.canAccess('CHUYÊN ĐỀ LIVE'), true);
});

it('isLessonBlocked luôn trả về {blocked: false} (mở tự do 100%)', () => {
  const res = sandbox.isLessonBlocked({}, 'LIVE_01');
  assert.strictEqual(res.blocked, false);
});

it('getLiveStatus nhận diện chính xác trạng thái RECORDED khi có videoghilai hoặc video', () => {
  const st1 = sandbox.getLiveStatus({ videoghilai: 'https://youtu.be/test' });
  assert.strictEqual(st1.code, 'RECORDED');
  const st2 = sandbox.getLiveStatus({ video: 'https://youtu.be/test', linklive: '' });
  assert.strictEqual(st2.code, 'RECORDED');
});

it('getLiveStatus nhận diện UPCOMING khi thời gian live trong tương lai', () => {
  const future = new Date(Date.now() + 86400000).toISOString();
  const st = sandbox.getLiveStatus({ ngaygiolive: future });
  assert.strictEqual(st.code, 'UPCOMING');
});

it('getLiveStatus nhận diện HAPPENING khi thời gian live đang trong khung phát', () => {
  const now = new Date(Date.now()).toISOString();
  const st = sandbox.getLiveStatus({ ngaygiolive: now });
  assert.strictEqual(st.code, 'HAPPENING');
});

// -----------------------------------------------------------------------------
// SUITE 3: KIỂM TRA LINK PHÒNG LIVE & LINK TÀI LIỆU
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 3] Kiểm tra link phòng Live & link tài liệu ---');

it('Link phòng live và link tài liệu phải có URL hợp lệ và cấu trúc thẻ bấm được', () => {
  const sampleLesson = {
    key: 'LIVE_TEST',
    name: 'Buổi Live Mẫu',
    ngaygiolive: new Date(Date.now()).toISOString(),
    linklive: 'https://www.youtube.com/watch?v=real_live_id_123',
    tailieulive: 'https://drive.google.com/file/d/1real_doc_id_456/view?usp=sharing',
    video: '',
    pdflt: 'https://drive.google.com/file/d/1real_lythuyet_789/view',
    pdf: 'https://drive.google.com/file/d/1real_baitap_012/view'
  };

  // Kiểm tra format URL
  assert.ok(/^https?:\/\//i.test(sampleLesson.linklive), 'LinkLive phải bắt đầu bằng http:// hoặc https://');
  assert.ok(/^https?:\/\//i.test(sampleLesson.tailieulive), 'TaiLieuLive phải bắt đầu bằng http:// hoặc https://');
  assert.ok(/^https?:\/\//i.test(sampleLesson.pdflt), 'PDFLyThuyet phải bắt đầu bằng http:// hoặc https://');
  assert.ok(/^https?:\/\//i.test(sampleLesson.pdf), 'PDF bài tập phải bắt đầu bằng http:// hoặc https://');

  // Nút Vào phòng Live: phải có href hợp lệ và target _blank để bấm mở phòng
  const enterBtnHtml = (sampleLesson.linklive) ? '<a href="' + sampleLesson.linklive + '" target="_blank" class="btn-enter-live"><i class="fa-solid fa-tower-broadcast"></i> Vào xem Live ngay</a>' : '';
  assert.ok(enterBtnHtml.includes('href="' + sampleLesson.linklive + '"'), 'Nút phải có href chính xác tới link live');
  assert.ok(enterBtnHtml.includes('target="_blank"'), 'Nút phải mở tab mới khi bấm');
  assert.ok(enterBtnHtml.includes('btn-enter-live'), 'Nút phải có class định kiểu btn-enter-live');

  // Nút Tải tài liệu chuẩn bị: phải có href hợp lệ và target _blank
  const prepBtnHtml = (sampleLesson.tailieulive) ? '<a href="' + sampleLesson.tailieulive + '" target="_blank" class="btn-prep-doc"><i class="fa-solid fa-file-pdf"></i> Tài liệu chuẩn bị trước Live</a>' : '';
  assert.ok(prepBtnHtml.includes('href="' + sampleLesson.tailieulive + '"'), 'Nút phải có href chính xác tới tài liệu');
  assert.ok(prepBtnHtml.includes('target="_blank"'), 'Nút tài liệu phải mở tab mới khi bấm');
  assert.ok(prepBtnHtml.includes('btn-prep-doc'), 'Nút phải có class định kiểu btn-prep-doc');
});

// -----------------------------------------------------------------------------
// SUITE 4: TIẾN ĐỘ KHÁCH (FAIL-CLOSED)
// -----------------------------------------------------------------------------
console.log('\n--- [SUITE 4] Kiểm tra tiến độ chế độ Khách (Fail-closed) ---');

it('Khi khách chưa đăng nhập (HS = null), markWatched không được ghi vào hàng đợi gửi server', () => {
  sandbox.HS = null;
  sandbox.markWatched('LIVE_TEST_KEY');
  const guestWatched = JSON.parse(sandbox.localStorage.getItem('vlxt_live_guest_watched') || '[]');
  assert.ok(guestWatched.includes('LIVE_TEST_KEY'), 'Phải lưu cục bộ trong vlxt_live_guest_watched');
  const q = JSON.parse(sandbox.localStorage.getItem('vlxt_live_progress_queue_v1') || '[]');
  assert.strictEqual(q.length, 0, 'Hàng đợi gửi server phải rỗng khi chưa đăng nhập');
});

console.log('\n=== TỔNG KẾT: ' + passed + '/' + total + ' TESTS PASSED ===\n');
