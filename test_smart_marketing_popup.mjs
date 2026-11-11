import fs from 'fs';
import assert from 'assert';
import { execSync } from 'child_process';

console.log('═══════════════════════════════════════════════════════════════');
console.log('KIỂM ĐỊNH SMART MARKETING POPUP SYSTEM 2 TẦNG (GEMINI FLASH)');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Kiểm tra cú pháp JavaScript
console.log('1. Kiểm tra cú pháp JavaScript của smart-marketing-popup.js:');
try {
  execSync('node -c smart-marketing-popup.js', { stdio: 'pipe' });
  console.log('   ✓ Cú pháp hợp lệ 100% (node -c PASS)');
} catch (err) {
  console.error('   ✗ Lỗi cú pháp trong smart-marketing-popup.js:', err.message);
  process.exit(1);
}

// 2. Kiểm tra index.html
console.log('\n2. Kiểm tra cấu trúc index.html:');
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert.ok(indexHtml.includes('<script src="smart-marketing-popup.js?v=20261111a"></script>'), 'Thiếu thẻ nhúng smart-marketing-popup.js?v=20261111a');
assert.ok(indexHtml.trim().endsWith('</html>'), 'index.html không kết thúc bằng thẻ </html>');
const bodyIdx = indexHtml.lastIndexOf('</body>');
const scriptIdx = indexHtml.lastIndexOf('smart-marketing-popup.js?v=20261111a');
assert.ok(scriptIdx > 0 && scriptIdx < bodyIdx, 'Thẻ script marketing popup phải nằm ngay trước thẻ đóng </body>');
console.log('   ✓ Đã nhúng thẻ script smart-marketing-popup.js?v=20261111a trước </body>');
console.log('   ✓ index.html kết thúc chuẩn xác bằng </html>');

// 3. Kiểm tra tuân thủ quy tắc CẤM AI GLOW
console.log('\n3. Kiểm tra tuân thủ quy định cấm AI Glow (AGENTS.md):');
const popupCode = fs.readFileSync('smart-marketing-popup.js', 'utf8');

// Không được có text-shadow dạng hào quang mờ nhòe (0 0 ...)
const textShadowMatch = popupCode.match(/text-shadow:\s*0\s+0\s+/gi);
assert.ok(!textShadowMatch, 'Phát hiện text-shadow dạng AI glow mờ nhòe: ' + JSON.stringify(textShadowMatch));

// Không được có box-shadow dạng hào quang neon mờ nhòe (0 0 [number]px)
const neonBoxShadowMatch = popupCode.match(/box-shadow:\s*(inset\s+)?0\s+0\s+\d+px/gi);
assert.ok(!neonBoxShadowMatch, 'Phát hiện box-shadow dạng AI glow quầng sáng neon: ' + JSON.stringify(neonBoxShadowMatch));

// Đảm bảo font chữ là Plus Jakarta Sans
assert.ok(popupCode.includes("'Plus Jakarta Sans'"), 'Chưa cấu hình font-family Plus Jakarta Sans');

// Đảm bảo con trỏ tàu vũ trụ có z-index tối thượng
assert.ok(popupCode.includes('2147483647'), 'Thiếu z-index 2147483647 cho quantum-cursor-ring');

console.log('   ✓ 0 vi phạm text-shadow AI Glow');
console.log('   ✓ 0 vi phạm box-shadow hào quang neon');
console.log('   ✓ Font-family Plus Jakarta Sans chuẩn EdTech quốc tế');
console.log('   ✓ Quantum cursor z-index 2147483647 sẵn sàng');

// 4. Test logic hành vi Pop-up 2 tầng trong môi trường mô phỏng DOM
console.log('\n4. Kiểm thử hành vi Pop-up 2 tầng cho Khách trải nghiệm (guest):');

function createMockEnv(initialLocalStorage = {}, initialSessionStorage = {}) {
  let lStore = { ...initialLocalStorage };
  let sStore = { ...initialSessionStorage };

  const elements = new Map();

  function makeElement(tag, id = '') {
    const el = {
      tagName: tag.toUpperCase(),
      id: id,
      className: '',
      innerHTML: '',
      style: {},
      parentNode: null,
      children: [],
      classList: {
        _classes: new Set(),
        add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(' '); },
        remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(' '); },
        contains(c) { return this._classes.has(c); }
      },
      _listeners: {},
      addEventListener(evt, fn) {
        this._listeners[evt] = this._listeners[evt] || [];
        this._listeners[evt].push(fn);
      },
      dispatchEvent(evtName) {
        if (this._listeners[evtName]) {
          this._listeners[evtName].forEach(fn => fn({ target: this, preventDefault: () => {} }));
        }
      },
      appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
        if (child.id) elements.set(child.id, child);
        // Recursively register inner elements with ID from innerHTML
        parseAndRegisterIds(child);
        return child;
      },
      remove() {
        if (this.parentNode) {
          const idx = this.parentNode.children.indexOf(this);
          if (idx !== -1) this.parentNode.children.splice(idx, 1);
        }
        if (this.id) elements.delete(this.id);
      }
    };
    if (id) elements.set(id, el);
    return el;
  }

  function parseAndRegisterIds(parent) {
    if (!parent.innerHTML) return;
    const idMatches = parent.innerHTML.matchAll(/id=["']([^"']+)["']/g);
    for (const m of idMatches) {
      const id = m[1];
      if (!elements.has(id)) {
        const fakeEl = makeElement('DIV', id);
        fakeEl.parentNode = parent;
        elements.set(id, fakeEl);
      }
    }
  }

  const doc = {
    head: makeElement('HEAD', 'mock-head'),
    body: makeElement('BODY', 'mock-body'),
    readyState: 'complete',
    getElementById(id) {
      return elements.get(id) || null;
    },
    createElement(tag) {
      return makeElement(tag);
    },
    addEventListener: () => {}
  };

  const win = {
    location: { search: '' },
    getComputedStyle: (el) => el.style || {},
    document: doc,
    localStorage: {
      getItem: (k) => (k in lStore ? lStore[k] : null),
      setItem: (k, v) => { lStore[k] = String(v); },
      removeItem: (k) => { delete lStore[k]; },
      clear: () => { lStore = {}; }
    },
    sessionStorage: {
      getItem: (k) => (k in sStore ? sStore[k] : null),
      setItem: (k, v) => { sStore[k] = String(v); },
      removeItem: (k) => { delete sStore[k]; },
      clear: () => { sStore = {}; }
    }
  };

  return { win, doc, elements, lStore, sStore };
}

// Case 4.1: Khách mới vào, Preloader chạy xong -> Pop-up 1 xuất hiện
{
  const { win, doc, elements, lStore, sStore } = createMockEnv();

  // Tạo sẵn preloader
  const preloader = doc.createElement('div');
  preloader.id = 'vlxt-preloader';
  doc.body.appendChild(preloader);

  // Chạy code popup
  const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'setTimeout', 'setInterval', 'clearInterval', 'MutationObserver', popupCode);
  
  // Custom timer simulation
  let queuedTimers = [];
  const mockSetTimeout = (cb, ms) => {
    const t = { cb, ms, id: queuedTimers.length + 1 };
    queuedTimers.push(t);
    return t.id;
  };
  const mockSetInterval = (cb, ms) => 999;
  const mockClearInterval = () => {};

  fn(win, doc, win.localStorage, win.sessionStorage, mockSetTimeout, mockSetInterval, mockClearInterval, class {
    observe() {}
    disconnect() {}
  });

  // Bước 1: Giả lập Preloader fade-out
  preloader.classList.add('fade-out');

  // Chạy các timers (chờ preloader tắt + 3000ms đếm thời gian chiêm ngưỡng giao diện)
  while (queuedTimers.length > 0) {
    const next = queuedTimers.shift();
    next.cb();
  }

  const popup1 = doc.getElementById('vlxt-smart-popup-overlay');
  assert.ok(popup1, 'Pop-up 1 phải được tiêm vào DOM');
  assert.ok(popup1.classList.contains('is-active'), 'Pop-up 1 phải có class is-active');
  console.log('   ✓ Case 4.1 PASS: Preloader fade-out -> 3000ms sau Pop-up 1 xuất hiện (is-active)');

  // Bước 2: Bấm nút đóng [×] trên Pop-up 1
  const closeBtn1 = doc.getElementById('vlxt-btn-close-p1');
  assert.ok(closeBtn1, 'Phải có nút vlxt-btn-close-p1');
  closeBtn1.dispatchEvent('click');

  // Đóng pop-up 1
  assert.ok(!popup1.classList.contains('is-active'), 'Pop-up 1 phải bị gỡ is-active khi bấm đóng');
  const sessionData = JSON.parse(win.sessionStorage.getItem('vlxt_popup_session_guest'));
  assert.ok(sessionData.p1Dismissed, 'sessionStorage vlxt_popup_session_guest phải ghi nhận p1Dismissed = true');
  assert.strictEqual(win.localStorage.getItem('vlxt_popup_state_guest'), null, 'localStorage KHÔNG được ghi sai trạng thái test của guest');

  // Kích hoạt tiếp timer 300ms chuyển sang Pop-up 2
  while (queuedTimers.length > 0) {
    const next = queuedTimers.shift();
    next.cb();
  }

  const popup2 = doc.getElementById('vlxt-smart-popup-overlay-trial');
  assert.ok(popup2, 'Pop-up 2 phải được tiêm vào DOM sau 300ms');
  assert.ok(popup2.classList.contains('is-active'), 'Pop-up 2 phải có class is-active');
  console.log('   ✓ Case 4.2 PASS: Bấm [×] trên Pop-up 1 -> Đóng Pop-up 1 -> sau 300ms Pop-up 2 xuất hiện (is-active)');

  // Bước 3: Bấm nút đóng [×] trên Pop-up 2
  const closeBtn2 = doc.getElementById('vlxt-btn-close-p2');
  assert.ok(closeBtn2, 'Phải có nút vlxt-btn-close-p2');
  closeBtn2.dispatchEvent('click');

  assert.ok(!popup2.classList.contains('is-active'), 'Pop-up 2 phải bị gỡ is-active khi bấm đóng');
  const sessionDataAfter2 = JSON.parse(win.sessionStorage.getItem('vlxt_popup_session_guest'));
  assert.ok(sessionDataAfter2.p2Dismissed, 'sessionStorage vlxt_popup_session_guest phải ghi nhận p2Dismissed = true');
  console.log('   ✓ Case 4.3 PASS: Bấm [×] trên Pop-up 2 -> Đóng Pop-up 2 -> Lưu session p2Dismissed');
}

// Case 4.4: Học sinh đã có kết quả test thực tế (vlxt_dgnl_latest_result)
{
  const testResult = JSON.stringify({ score: 8.5, completedAt: '2026-11-11' });
  const { win, doc, elements } = createMockEnv({ 'vlxt_dgnl_latest_result': testResult });

  const fn = new Function('window', 'document', 'localStorage', 'sessionStorage', 'setTimeout', 'setInterval', 'clearInterval', 'MutationObserver', popupCode);
  
  let queuedTimers = [];
  const mockSetTimeout = (cb, ms) => {
    const t = { cb, ms, id: queuedTimers.length + 1 };
    queuedTimers.push(t);
    return t.id;
  };
  const mockSetInterval = (cb, ms) => 999;
  const mockClearInterval = () => {};

  fn(win, doc, win.localStorage, win.sessionStorage, mockSetTimeout, mockSetInterval, mockClearInterval, class {
    observe() {}
    disconnect() {}
  });

  while (queuedTimers.length > 0) {
    const next = queuedTimers.shift();
    next.cb();
  }

  const popup1 = doc.getElementById('vlxt-smart-popup-overlay');
  const popup2 = doc.getElementById('vlxt-smart-popup-overlay-trial');

  assert.strictEqual(popup1, null, 'Học sinh đã test KHÔNG được hiện Pop-up 1');
  assert.ok(popup2, 'Học sinh đã test phải hiện thẳng Pop-up 2');
  assert.ok(popup2.classList.contains('is-active'), 'Pop-up 2 phải is-active');
  console.log('   ✓ Case 4.4 PASS: Đã có kết quả test thực tế -> Bỏ qua Pop-up 1, hiện thẳng Pop-up 2');
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('TẤT CẢ CÁC BƯỚC KIỂM ĐỊNH THÀNH CÔNG 100%!');
console.log('═══════════════════════════════════════════════════════════════');
