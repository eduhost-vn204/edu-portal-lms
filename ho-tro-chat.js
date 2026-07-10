/* ═══════════════════════════════════════════════════════════
   BONG BÓNG CHAT HỖ TRỢ — Vật Lý Xuân Trường  v1.0
   Nút chat nổi góc phải (cạnh khung "Nhiệm vụ hôm nay") để học
   sinh nhắn thắc mắc cho thầy. Tin nhắn lưu Firebase Realtime DB
   (dùng chung hạ tầng với trang live.html) — thầy đọc & trả lời
   ngay trong tab "Hỗ trợ" của trang Admin.
   Yêu cầu: firebase-app-compat.js + firebase-database-compat.js
   phải được nhúng TRƯỚC file này.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyBCwxhKlvJXrms7AdKfI1NyzOXQ3onbdH0",
    authDomain: "edu-portal-live.firebaseapp.com",
    databaseURL: "https://edu-portal-live-default-rtdb.firebaseio.com",
    projectId: "edu-portal-live",
    storageBucket: "edu-portal-live.firebasestorage.app",
    messagingSenderId: "49980372137",
    appId: "1:49980372137:web:ab7483591b9dcabca865b8"
  };

  var db = null;
  var threadId = null;
  var threadMeta = { hoten: '', lop: '', sdt: '' };
  var panelOpen = false;
  var msgListenerAttached = false;
  var lastSeenCount = 0;

  function injectCSS() {
    if (document.getElementById('vlxt-ht-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-ht-css';
    s.textContent = [
      '#vlxt-ht-fab{position:fixed;bottom:92px;right:20px;z-index:99982;',
      'width:52px;height:52px;border-radius:50%;border:none;cursor:pointer;',
      'background:linear-gradient(135deg,#0072ff,#00f0ff);color:#fff;font-size:22px;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 4px 18px rgba(0,114,255,.45);transition:transform .15s;}',
      '#vlxt-ht-fab:hover{transform:scale(1.08);}',
      '#vlxt-ht-dot{position:absolute;top:2px;right:2px;width:13px;height:13px;border-radius:50%;',
      'background:#ef4444;border:2px solid #0d1117;display:none;}',
      '#vlxt-ht-dot.show{display:block;}',
      '@media(max-width:480px){#vlxt-ht-fab{bottom:78px;right:14px;width:46px;height:46px;font-size:19px;}}',

      '#vlxt-ht-panel{display:none;position:fixed;bottom:152px;right:20px;z-index:99983;',
      'width:328px;max-width:92vw;height:440px;max-height:70vh;',
      'background:linear-gradient(135deg,#0d1117,#0d1b2a);border:1.5px solid rgba(0,240,255,.3);',
      'border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.5);',
      'flex-direction:column;overflow:hidden;font-family:\'Inter\',system-ui,sans-serif;',
      'animation:vlxtHtIn .18s ease-out;}',
      '#vlxt-ht-panel.open{display:flex;}',
      '@keyframes vlxtHtIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
      '@media(max-width:480px){#vlxt-ht-panel{bottom:132px;right:10px;width:calc(100vw - 20px);height:60vh;}}',

      '.vlxt-ht-head{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08);',
      'display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}',
      '.vlxt-ht-head-title{font-size:14px;font-weight:800;color:#e6edf3;display:flex;align-items:center;gap:7px;}',
      '.vlxt-ht-head-sub{font-size:11px;color:#8b949e;margin-top:2px;}',
      '.vlxt-ht-close{background:none;border:none;color:#8b949e;font-size:18px;cursor:pointer;padding:2px 6px;line-height:1;}',
      '.vlxt-ht-close:hover{color:#e6edf3;}',

      '.vlxt-ht-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;}',
      '.vlxt-ht-empty{text-align:center;color:#8b949e;font-size:12.5px;padding:24px 10px;line-height:1.6;}',
      '.vlxt-ht-msg{max-width:80%;padding:8px 12px;border-radius:12px;font-size:13px;line-height:1.45;',
      'word-wrap:break-word;white-space:pre-wrap;}',
      '.vlxt-ht-msg.hs{align-self:flex-end;background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;border-bottom-right-radius:4px;}',
      '.vlxt-ht-msg.admin{align-self:flex-start;background:rgba(255,255,255,.08);color:#e6edf3;border-bottom-left-radius:4px;}',
      '.vlxt-ht-msg-time{font-size:9.5px;opacity:.65;margin-top:3px;}',

      '.vlxt-ht-namebox{padding:12px;display:flex;flex-direction:column;gap:8px;}',
      '.vlxt-ht-namebox input{padding:9px 11px;border-radius:9px;border:1px solid rgba(255,255,255,.15);',
      'background:rgba(255,255,255,.05);color:#e6edf3;font-size:13px;font-family:inherit;outline:none;}',
      '.vlxt-ht-namebox input:focus{border-color:#00f0ff;}',
      '.vlxt-ht-namebox button{padding:9px;border:none;border-radius:9px;background:linear-gradient(135deg,#0072ff,#00f0ff);',
      'color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;}',

      '.vlxt-ht-foot{padding:10px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:8px;flex-shrink:0;}',
      '.vlxt-ht-foot textarea{flex:1;resize:none;padding:9px 11px;border-radius:10px;',
      'border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#e6edf3;',
      'font-size:13px;font-family:inherit;outline:none;height:38px;line-height:1.3;}',
      '.vlxt-ht-foot textarea:focus{border-color:#00f0ff;}',
      '.vlxt-ht-send{width:38px;height:38px;flex-shrink:0;border:none;border-radius:10px;',
      'background:linear-gradient(135deg,#0072ff,#00f0ff);color:#fff;font-size:15px;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;}',
      '.vlxt-ht-send:hover{opacity:.88;}',

      '.vlxt-ht-toast{position:fixed;bottom:152px;right:20px;z-index:99984;background:#0d1b2a;',
      'border:1px solid rgba(0,240,255,.35);color:#e6edf3;font-size:12.5px;padding:10px 14px;',
      'border-radius:10px;box-shadow:0 6px 22px rgba(0,0,0,.4);max-width:260px;',
      'opacity:0;transform:translateY(8px);transition:all .2s;pointer-events:none;}',
      '.vlxt-ht-toast.show{opacity:1;transform:none;}'
    ].join('');
    document.head.appendChild(s);
  }

  function initFirebase() {
    try {
      if (typeof firebase === 'undefined') return false;
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.database();
      return true;
    } catch (e) { return false; }
  }

  function normDigits(s) { return String(s || '').replace(/\D/g, ''); }

  function getIdentity() {
    var user = (typeof vlxtGetUser === 'function') ? vlxtGetUser() : null;
    if (user && user.sdt) {
      return Promise.resolve({
        threadId: 'hs_' + normDigits(user.sdt),
        hoten: user.hoten || 'Học sinh',
        lop: user.lop || '',
        sdt: user.sdt
      });
    }
    var guestName = localStorage.getItem('vlxt_guest_name') || '';
    return (typeof vlxtDeviceFingerprint === 'function' ? vlxtDeviceFingerprint() : Promise.resolve('unknown'))
      .then(function (fp) {
        return {
          threadId: 'guest_' + String(fp).slice(0, 20),
          hoten: guestName,
          lop: '',
          sdt: '',
          isGuest: true
        };
      });
  }

  function fmtTime(ts) {
    try {
      var d = new Date(ts);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  function escHtml(s) {
    return (s == null ? '' : s).toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderMsg(m) {
    var div = document.createElement('div');
    div.className = 'vlxt-ht-msg ' + (m.from === 'admin' ? 'admin' : 'hs');
    div.innerHTML = escHtml(m.text).replace(/\n/g, '<br>') +
      '<div class="vlxt-ht-msg-time">' + (m.from === 'admin' ? '👨‍🏫 Thầy · ' : '') + fmtTime(m.time) + '</div>';
    return div;
  }

  function showToast(text) {
    var t = document.getElementById('vlxt-ht-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'vlxt-ht-toast';
      t.className = 'vlxt-ht-toast';
      document.body.appendChild(t);
    }
    t.textContent = text;
    t.classList.add('show');
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(function () { t.classList.remove('show'); }, 4200);
  }

  function setDot(show) {
    var dot = document.getElementById('vlxt-ht-dot');
    if (dot) dot.classList.toggle('show', !!show);
  }

  function attachMetaListener() {
    if (!db || !threadId) return;
    db.ref('support_chats/' + threadId + '/meta/unreadForStudent').on('value', function (snap) {
      var unread = !!snap.val();
      setDot(unread);
      if (unread && !panelOpen) {
        db.ref('support_chats/' + threadId + '/meta/lastMsg').once('value').then(function (s) {
          var lastMsg = s.val();
          if (lastMsg) showToast('💬 Thầy vừa trả lời: ' + String(lastMsg).slice(0, 60));
        });
      }
    });
  }

  function attachMsgListener(bodyEl) {
    if (msgListenerAttached || !db || !threadId) return;
    msgListenerAttached = true;
    var emptyNote = bodyEl.querySelector('.vlxt-ht-empty');
    db.ref('support_chats/' + threadId + '/messages').limitToLast(80).on('child_added', function (snap) {
      if (emptyNote) { emptyNote.remove(); emptyNote = null; }
      bodyEl.appendChild(renderMsg(snap.val()));
      bodyEl.scrollTop = bodyEl.scrollHeight;
    });
  }

  function markReadByStudent() {
    if (!db || !threadId) return;
    db.ref('support_chats/' + threadId + '/meta/unreadForStudent').set(false);
    setDot(false);
  }

  function ensureMeta() {
    if (!db || !threadId) return;
    db.ref('support_chats/' + threadId + '/meta').once('value').then(function (snap) {
      if (!snap.exists()) {
        db.ref('support_chats/' + threadId + '/meta').set({
          hoten: threadMeta.hoten || 'Học sinh',
          lop: threadMeta.lop || '',
          sdt: threadMeta.sdt || '',
          isGuest: !!threadMeta.isGuest,
          createdAt: Date.now(),
          lastMsg: '',
          lastTime: Date.now(),
          unreadForAdmin: false,
          unreadForStudent: false
        });
      }
    });
  }

  function sendMessage(text, bodyEl) {
    if (!text.trim() || !db || !threadId) return;
    var msg = { from: 'hs', text: text.trim(), time: Date.now() };
    db.ref('support_chats/' + threadId + '/messages').push(msg);
    db.ref('support_chats/' + threadId + '/meta').update({
      hoten: threadMeta.hoten || 'Học sinh',
      lop: threadMeta.lop || '',
      sdt: threadMeta.sdt || '',
      lastMsg: msg.text,
      lastTime: msg.time,
      unreadForAdmin: true,
      unreadForStudent: false
    });
  }

  function buildPanel() {
    var panel = document.createElement('div');
    panel.id = 'vlxt-ht-panel';

    var needName = threadMeta.isGuest && !threadMeta.hoten;

    panel.innerHTML =
      '<div class="vlxt-ht-head">' +
        '<div>' +
          '<div class="vlxt-ht-head-title">💬 Hỗ trợ học tập</div>' +
          '<div class="vlxt-ht-head-sub">Nhắn thắc mắc, thầy sẽ trả lời sớm nhất</div>' +
        '</div>' +
        '<button class="vlxt-ht-close" id="vlxt-ht-close-btn" title="Đóng">✕</button>' +
      '</div>' +
      (needName
        ? '<div class="vlxt-ht-namebox" id="vlxt-ht-namebox">' +
            '<input type="text" id="vlxt-ht-name-input" placeholder="Tên của em là gì?" maxlength="40">' +
            '<button id="vlxt-ht-name-btn">Bắt đầu chat →</button>' +
          '</div>'
        : '<div class="vlxt-ht-body" id="vlxt-ht-body">' +
            '<div class="vlxt-ht-empty">Có thắc mắc gì cứ nhắn cho thầy nhé! 😊<br>Thầy sẽ trả lời trong thời gian sớm nhất.</div>' +
          '</div>' +
          '<div class="vlxt-ht-foot">' +
            '<textarea id="vlxt-ht-input" placeholder="Nhập tin nhắn..." maxlength="1000"></textarea>' +
            '<button class="vlxt-ht-send" id="vlxt-ht-send-btn" title="Gửi">➤</button>' +
          '</div>');

    document.body.appendChild(panel);

    document.getElementById('vlxt-ht-close-btn').onclick = closePanel;

    if (needName) {
      var nameBtn = document.getElementById('vlxt-ht-name-btn');
      var nameInput = document.getElementById('vlxt-ht-name-input');
      var submitName = function () {
        var v = nameInput.value.trim();
        if (!v) { nameInput.focus(); return; }
        localStorage.setItem('vlxt_guest_name', v);
        threadMeta.hoten = v;
        ensureMeta();
        panel.remove();
        buildPanel();
        openPanel();
      };
      nameBtn.onclick = submitName;
      nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitName(); });
    } else {
      var bodyEl = document.getElementById('vlxt-ht-body');
      var inputEl = document.getElementById('vlxt-ht-input');
      var sendBtn = document.getElementById('vlxt-ht-send-btn');
      var doSend = function () {
        var v = inputEl.value;
        if (!v.trim()) return;
        sendMessage(v, bodyEl);
        inputEl.value = '';
      };
      sendBtn.onclick = doSend;
      inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
      });
      attachMsgListener(bodyEl);
    }

    return panel;
  }

  function openPanel() {
    var panel = document.getElementById('vlxt-ht-panel');
    if (!panel) panel = buildPanel();
    panel.classList.add('open');
    panelOpen = true;
    markReadByStudent();
    var inputEl = document.getElementById('vlxt-ht-input');
    if (inputEl) setTimeout(function () { inputEl.focus(); }, 150);
  }

  function closePanel() {
    var panel = document.getElementById('vlxt-ht-panel');
    if (panel) panel.classList.remove('open');
    panelOpen = false;
  }

  function togglePanel() {
    if (panelOpen) closePanel(); else openPanel();
  }

  function buildFab() {
    if (document.getElementById('vlxt-ht-fab')) return;
    var fab = document.createElement('button');
    fab.id = 'vlxt-ht-fab';
    fab.title = 'Hỗ trợ học tập';
    fab.innerHTML = '💬<span id="vlxt-ht-dot"></span>';
    fab.onclick = togglePanel;
    document.body.appendChild(fab);
  }

  function init() {
    injectCSS();
    if (!initFirebase()) return; // Firebase SDK chưa load -> bỏ qua, không chặn trang
    buildFab();
    getIdentity().then(function (identity) {
      threadId = identity.threadId;
      threadMeta = identity;
      ensureMeta();
      attachMetaListener();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
