/**
 * test_smart_marketing_popup.mjs
 * Bộ kiểm định tự động cho Smart Marketing Pop-up 2 tầng & Pop-up Luyện tập Đề 2
 * Chạy độc lập hoàn toàn bằng Node.js thuần (Zero dependencies)
 */
import fs from 'fs';
import assert from 'assert';
import { execSync } from 'child_process';

console.log('═══════════════════════════════════════════════════════════════');
console.log('KIỂM ĐỊNH SMART MARKETING POPUP SYSTEM (GEMINI FLASH)');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Kiểm tra cú pháp JS của smart-marketing-popup.js
console.log('1. Kiểm tra cú pháp JavaScript của smart-marketing-popup.js:');
execSync('node -c smart-marketing-popup.js', { stdio: 'inherit' });
console.log('   ✓ Cú pháp hợp lệ 100% (node -c PASS)\n');

// 2. Kiểm tra cấu trúc index.html
console.log('2. Kiểm tra cấu trúc index.html:');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert.ok(
  indexHtml.includes('<script src="smart-marketing-popup.js?v=20261111a"></script>'),
  'index.html phải nhúng thẻ <script src="smart-marketing-popup.js?v=20261111a"></script>'
);
console.log('   ✓ Đã nhúng thẻ script smart-marketing-popup.js?v=20261111a trước </body>');

assert.ok(indexHtml.trim().endsWith('</html>'), 'index.html phải có thẻ đóng </html>');
console.log('   ✓ index.html kết thúc chuẩn xác bằng </html>\n');

// 3. Kiểm tra tuân thủ quy định cấm AI Glow (AGENTS.md)
console.log('3. Kiểm tra tuân thủ quy định cấm AI Glow (AGENTS.md):');
const popupJs = fs.readFileSync('smart-marketing-popup.js', 'utf8');

const forbiddenGlowRegex = /text-shadow:\s*0\s*0\s*[1-9]/i;
assert.ok(!forbiddenGlowRegex.test(popupJs), 'Tuyệt đối cấm text-shadow phát sáng AI Glow trong smart-marketing-popup.js');
console.log('   ✓ 0 vi phạm text-shadow AI Glow');

const forbiddenNeonBoxRegex = /box-shadow:\s*0\s*0\s*(?:2[0-9]|[3-9][0-9])px/i;
assert.ok(!forbiddenNeonBoxRegex.test(popupJs), 'Tuyệt đối cấm box-shadow neon mờ ảo AI Glow trong smart-marketing-popup.js');
console.log('   ✓ 0 vi phạm box-shadow hào quang neon');

assert.ok(
  popupJs.includes("'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"),
  'Font-family phải sử dụng Plus Jakarta Sans chuẩn EdTech'
);
console.log('   ✓ Font-family Plus Jakarta Sans chuẩn EdTech quốc tế');

assert.ok(
  popupJs.includes('z-index: 2147483647 !important;'),
  'Cơ chế con trỏ chuột vũ trụ phải nâng lên z-index cao nhất'
);
console.log('   ✓ Quantum cursor z-index 2147483647 sẵn sàng\n');

// 4. Kiểm thử hành vi Pop-up trong môi trường Mock DOM thuần
console.log('4. Kiểm thử logic phân luồng Pop-up (Khách mới vs Học sinh đã test):');

function createMockEnvironment(initialLocalStorage = {}, initialSessionStorage = {}) {
  const elementsById = new Map();
  const listeners = new Map();

  class MockElement {
    constructor(id, tagName = 'div') {
      this.id = id;
      this.tagName = tagName.toUpperCase();
      const set = new Set();
      this.classList = {
        add: (...c) => c.forEach(x => set.add(x)),
        remove: (...c) => c.forEach(x => set.delete(x)),
        contains: (c) => set.has(c)
      };
      this.innerHTML = '';
      this.style = {};
      this.parentNode = null;
      this.eventHandlers = {};
      if (id) elementsById.set(id, this);
    }
    addEventListener(evt, fn) {
      if (!this.eventHandlers[evt]) this.eventHandlers[evt] = [];
      this.eventHandlers[evt].push(fn);
    }
    click() {
      if (this.eventHandlers['click']) {
        this.eventHandlers['click'].forEach(fn => fn({ target: this }));
      }
    }
    remove() {
      if (this.id) elementsById.delete(this.id);
      this.parentNode = null;
    }
  }

  // Pre-seed elements
  const preloader = new MockElement('vlxt-preloader');
  const cursorRing = new MockElement('quantum-cursor-ring');
  const body = new MockElement('body', 'body');
  const head = new MockElement('head', 'head');
  head.appendChild = (child) => { child.parentNode = head; return child; };

  body.appendChild = function(child) {
    child.parentNode = body;
    if (child.id) elementsById.set(child.id, child);
    // Parse innerHTML for IDs
    const idMatches = child.innerHTML.matchAll(/id="([^"]+)"/g);
    for (const m of idMatches) {
      if (!elementsById.has(m[1])) {
        const sub = new MockElement(m[1]);
        sub.parentNode = child;
      }
    }
    return child;
  };

  const doc = {
    readyState: 'complete',
    head: head,
    getElementById: (id) => elementsById.get(id) || null,
    createElement: (tag) => new MockElement(null, tag),
    body: body,
    addEventListener: (evt, fn) => {
      if (!listeners.has(evt)) listeners.set(evt, []);
      listeners.get(evt).push(fn);
    }
  };

  const storageMock = { ...initialLocalStorage };
  const sessionMock = { ...initialSessionStorage };

  const storage = {
    getItem: (k) => (k in storageMock ? storageMock[k] : null),
    setItem: (k, v) => { storageMock[k] = String(v); },
    removeItem: (k) => { delete storageMock[k]; }
  };

  const session = {
    getItem: (k) => (k in sessionMock ? sessionMock[k] : null),
    setItem: (k, v) => { sessionMock[k] = String(v); },
    removeItem: (k) => { delete sessionMock[k]; }
  };

  const timers = [];
  const fakeSetTimeout = (fn, delay) => {
    timers.push({ fn, delay });
    return timers.length;
  };

  return {
    doc,
    elementsById,
    storage,
    session,
    timers,
    fakeSetTimeout,
    preloader,
    runTimers: () => {
      while (timers.length > 0) {
        const t = timers.shift();
        t.fn();
      }
    }
  };
}

// Case 4.1 & 4.2: Khách mới -> Pop-up 1 (Đề 1 chẩn đoán) -> Đóng -> Pop-up 2 (Học thử)
{
  const env = createMockEnvironment();
  env.preloader.classList.add('fade-out');

  // Đóng gói chạy smart-marketing-popup.js
  const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'setTimeout', 'clearTimeout', 'location', popupJs);
  const winMock = {
    location: { search: '?reset_popup=1' },
    addEventListener: () => {},
    getComputedStyle: () => ({ display: 'none' })
  };

  fn(winMock, env.doc, env.storage, env.session, env.fakeSetTimeout, () => {}, winMock.location);
  env.runTimers();

  const p1 = env.doc.getElementById('vlxt-smart-popup-overlay');
  assert.ok(p1, 'Pop-up 1 phải xuất hiện cho khách mới');
  console.log('   ✓ Case 4.1 PASS: Khách mới -> Hiện Pop-up 1 (Chẩn đoán Đề 1)');

  const closeP1 = env.doc.getElementById('vlxt-btn-close-p1');
  assert.ok(closeP1, 'Nút đóng Pop-up 1 phải tồn tại');
  closeP1.click();
  env.runTimers();

  const p2 = env.doc.getElementById('vlxt-smart-popup-overlay-trial');
  assert.ok(p2, 'Pop-up 2 phải xuất hiện sau khi đóng Pop-up 1');
  console.log('   ✓ Case 4.2 PASS: Đóng Pop-up 1 -> Sau 300ms hiện Pop-up 2 (Học thử)');

  const closeP2 = env.doc.getElementById('vlxt-btn-close-p2');
  assert.ok(closeP2, 'Nút đóng Pop-up 2 phải tồn tại');
  closeP2.click();
  env.runTimers();

  const sess = JSON.parse(env.session.getItem('vlxt_popup_session_guest') || '{}');
  assert.strictEqual(sess.p2Dismissed, true, 'session phải lưu p2Dismissed');
  console.log('   ✓ Case 4.3 PASS: Đóng Pop-up 2 -> Lưu sessionStorage p2Dismissed = true');
}

// Case 4.4: Học sinh đã làm test -> Hiện Pop-up Đề số 2 (Đề mới)
{
  const env = createMockEnvironment({
    vlxt_dgnl_latest_result: JSON.stringify({
      score10: '5.0',
      predictedScore: 5.0,
      total: 20,
      correct: 10
    })
  });
  env.preloader.classList.add('fade-out');

  const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'setTimeout', 'clearTimeout', 'location', popupJs);
  const winMock = {
    location: { search: '?reset_popup=1' },
    addEventListener: () => {},
    getComputedStyle: () => ({ display: 'none' })
  };

  fn(winMock, env.doc, env.storage, env.session, env.fakeSetTimeout, () => {}, winMock.location);
  env.runTimers();

  const p1 = env.doc.getElementById('vlxt-smart-popup-overlay');
  const pRetest = env.doc.getElementById('vlxt-smart-popup-overlay-retest');

  assert.strictEqual(p1, null, 'Học sinh đã test KHÔNG được hiện Pop-up 1');
  assert.ok(pRetest, 'Học sinh đã test phải hiện Pop-up Luyện tập Đề số 2 (Đề mới)');
  console.log('   ✓ Case 4.4 PASS: Đã làm test trước đó -> Hiện Pop-up Luyện tập Đề số 2');

  const closeRetest = env.doc.getElementById('vlxt-btn-close-pretest');
  assert.ok(closeRetest, 'Nút đóng Pop-up Đề 2 phải tồn tại');
  closeRetest.click();
  env.runTimers();

  const p2 = env.doc.getElementById('vlxt-smart-popup-overlay-trial');
  assert.ok(p2, 'Pop-up 2 phải xuất hiện sau khi đóng Pop-up Retest');
  console.log('   ✓ Case 4.5 PASS: Đóng Pop-up Đề 2 -> Sau 300ms hiện Pop-up 2 (Học thử)');
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('TẤT CẢ CÁC BƯỚC KIỂM ĐỊNH THÀNH CÔNG 100%!');
console.log('═══════════════════════════════════════════════════════════════\n');
