/* ═══════════════════════════════════════════════════════════
   BẠN BÈ — Vật Lý Xuân Trường  v1.0
   Hồ sơ cá nhân hoá (ảnh đại diện + bio) + kết bạn + nhắn tin
   realtime 1-1 + chuỗi ngày nhắn tin liên tiếp giữa 2 bạn.
   Dùng chung Firebase Realtime DB với ho-tro-chat.js.
   Yêu cầu: firebase-app-compat.js + firebase-database-compat.js
   phải được nhúng TRƯỚC file này. Cần thẻ:
     <div class="avatar-big" id="vlxt-avatar-slot">...</div>
     <div id="vlxt-bio-slot"></div>   (đặt trong .profile-info)
     <div id="tab-banbe"></div>       (nội dung tab "Bạn bè")
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
  var me = null;          // { sdt, hoten, lop }
  var mySdt = '';         // normalized digits/email dùng làm key
  var friendsCache = {};  // sdtKey -> {name, lop}
  var activeThread = null; // sdtKey đang chat
  var searchCache = null;  // toàn bộ profiles_public, load 1 lần

  function normKey(s) {
    s = String(s || '').trim();
    if (!s) return '';
    if (s.indexOf('@') > -1) return s.toLowerCase().replace(/[.#$\[\]\/]/g, '_'); // key Firebase hợp lệ
    return s.replace(/\D/g, '');
  }
  function escHtml(s) {
    return (s == null ? '' : s).toString()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmtTime(ts) {
    try { return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); }
    catch (e) { return ''; }
  }
  function todayStr(ts) {
    var d = ts ? new Date(ts) : new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function daysBetween(dateStrA, dateStrB) {
    var a = new Date(dateStrA + 'T00:00:00');
    var b = new Date(dateStrB + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }
  function threadIdFor(a, b) {
    var arr = [normKey(a), normKey(b)].sort();
    return arr[0] + '__' + arr[1];
  }

  function initFirebase() {
    try {
      if (typeof firebase === 'undefined') return false;
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      db = firebase.database();
      return true;
    } catch (e) { return false; }
  }

  function injectCSS() {
    if (document.getElementById('vlxt-bb-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-bb-css';
    s.textContent = [
      '#vlxt-avatar-slot{position:relative;overflow:visible;}',
      '#vlxt-avatar-slot img.vlxt-bb-avatar-img{width:100%;height:100%;border-radius:50%;object-fit:cover;}',
      '.vlxt-bb-cam{position:absolute;bottom:-2px;right:-2px;width:24px;height:24px;border-radius:50%;',
      'background:#fff;border:2px solid var(--blue);color:var(--blue);font-size:11px;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.2);}',
      'body.dark .vlxt-bb-cam{background:#161b22;}',
      '.vlxt-bb-bio{font-size:13px;color:var(--gray2);margin-top:4px;cursor:pointer;font-style:italic;}',
      '.vlxt-bb-bio:hover{color:var(--blue);}',
      '.vlxt-bb-bio.empty{opacity:.6;}',
      '.vlxt-bb-bio-edit{display:flex;gap:6px;margin-top:6px;align-items:center;}',
      '.vlxt-bb-bio-edit textarea{flex:1;font-size:13px;padding:6px 8px;border-radius:8px;',
      'border:1px solid var(--border);background:var(--bg,#fff);color:inherit;font-family:inherit;resize:none;height:34px;}',
      '.vlxt-bb-bio-edit button{padding:6px 10px;border:none;border-radius:8px;background:var(--blue);color:#fff;',
      'font-size:12px;font-weight:700;cursor:pointer;}',

      '.vlxt-bb-wrap{display:flex;gap:16px;align-items:flex-start;}',
      '.vlxt-bb-col{flex:1;min-width:0;}',
      '.vlxt-bb-search{display:flex;gap:8px;margin-bottom:12px;}',
      '.vlxt-bb-search input{flex:1;padding:9px 12px;border-radius:9px;border:1px solid var(--border);',
      'background:var(--bg,#fff);color:inherit;font-size:13px;font-family:inherit;}',
      '.vlxt-bb-search button{padding:9px 14px;border:none;border-radius:9px;background:var(--blue);color:#fff;',
      'font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;}',

      '.vlxt-bb-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--border);}',
      '.vlxt-bb-row.profile-link{cursor:pointer;transition:background .15s;}',
      '.vlxt-bb-row.profile-link:hover{background:rgba(11,132,243,.07);}',
      '.vlxt-bb-row:last-child{border-bottom:none;}',
      '.vlxt-bb-av{width:38px;height:38px;border-radius:50%;background:var(--blue);color:#fff;',
      'display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;flex-shrink:0;overflow:hidden;}',
      '.vlxt-bb-av img{width:100%;height:100%;object-fit:cover;}',
      '.vlxt-bb-info{flex:1;min-width:0;}',
      '.vlxt-bb-name{font-weight:700;font-size:13.5px;}',
      '.vlxt-bb-sub{font-size:11.5px;color:var(--gray2);}',
      '.vlxt-bb-streak{font-size:11.5px;color:#d97706;font-weight:700;}',
      '.vlxt-bb-btn{padding:6px 11px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;}',
      '.vlxt-bb-btn.add{background:var(--blue);color:#fff;}',
      '.vlxt-bb-btn.ok{background:var(--green);color:#fff;}',
      '.vlxt-bb-btn.no{background:transparent;border:1px solid var(--border);color:var(--gray2);}',
      '.vlxt-bb-btn.pending{background:transparent;border:1px solid var(--border);color:var(--gray2);cursor:default;}',
      '.vlxt-bb-btn[disabled]{opacity:.55;cursor:default;}',
      '.vlxt-profile-overlay{position:fixed;inset:0;z-index:10050;background:var(--bg,#f7f8fa);color:var(--text,#111827);overflow-y:auto;}',
      'body.dark .vlxt-profile-overlay{background:#0d1117;color:#f0f6fc;}',
      '.vlxt-profile-pagebar{height:64px;position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:14px;padding:0 max(20px,calc((100% - 848px)/2));background:var(--nav-bg,#fff);border-bottom:1px solid var(--border);}',
      'body.dark .vlxt-profile-pagebar{background:#0d1117;}',
      '.vlxt-profile-pagebar b{font-size:15px;}',
      '.vlxt-profile-close{width:auto;height:36px;padding:0 13px;border:1px solid var(--border);border-radius:10px;background:transparent;color:inherit;font-size:13px;font-weight:700;cursor:pointer;}',
      '.vlxt-profile-shell{width:min(848px,calc(100% - 32px));margin:24px auto 60px;}',
      '.vlxt-profile-card{width:100%;background:var(--card,#fff);color:var(--text,#111827);border:1px solid var(--border);border-radius:18px;overflow:hidden;}',
      'body.dark .vlxt-profile-card{background:#161b22;color:#f0f6fc;}',
      '.vlxt-profile-body{padding:30px 28px;display:grid;grid-template-columns:88px minmax(0,1fr) auto;gap:5px 18px;align-items:center;}',
      '.vlxt-profile-avatar{width:76px;height:76px;grid-row:1/4;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;font-size:25px;font-weight:900;overflow:hidden;}',
      '.vlxt-profile-avatar img{width:100%;height:100%;object-fit:cover;}',
      '.vlxt-profile-name{font-size:21px;font-weight:850;}',
      '.vlxt-profile-class{color:var(--gray2);font-size:13px;}',
      '.vlxt-profile-bio{font-size:13px;line-height:1.5;color:var(--gray2);font-style:italic;}',
      '.vlxt-profile-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0;}',
      '.vlxt-profile-stat{min-height:90px;padding:18px 12px;border:1px solid var(--border);border-radius:14px;background:var(--card,#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;}',
      'body.dark .vlxt-profile-stat{background:#161b22;}',
      '.vlxt-profile-stat b{display:block;color:var(--blue);font-size:25px;}',
      '.vlxt-profile-stat span{margin-top:4px;font-size:12px;color:var(--gray2);}',
      '.vlxt-profile-actions{grid-column:3;grid-row:1/4;display:flex;gap:9px;justify-content:center;}',
      '.vlxt-profile-actions .vlxt-bb-btn{padding:9px 16px;}',
      '.vlxt-profile-section{background:var(--card,#fff);border:1px solid var(--border);border-radius:14px;overflow:hidden;}',
      'body.dark .vlxt-profile-section{background:#161b22;}',
      '.vlxt-profile-tabs{display:flex;border-bottom:1px solid var(--border);}',
      '.vlxt-profile-tabs span{flex:1;text-align:center;padding:13px;font-size:13px;font-weight:700;}',
      '.vlxt-profile-tabs span:first-child{color:var(--blue);box-shadow:inset 0 -3px var(--blue);}',
      '.vlxt-profile-note{padding:28px;text-align:center;color:var(--gray2);font-size:13px;}',
      '.vlxt-bb-badge{background:#ef4444;color:#fff;font-size:10px;font-weight:800;border-radius:10px;',
      'padding:1px 6px;margin-left:6px;}',
      '.vlxt-bb-empty{padding:24px 12px;text-align:center;color:var(--gray2);font-size:13px;}',
      '.vlxt-bb-head{font-size:13px;font-weight:800;color:var(--gray2);text-transform:uppercase;',
      'letter-spacing:.4px;padding:10px 12px 4px;}',

      '.vlxt-bb-chatbox{border:1px solid var(--border);border-radius:14px;overflow:hidden;',
      'display:flex;flex-direction:column;height:420px;}',
      '.vlxt-bb-chat-head{padding:11px 14px;border-bottom:1px solid var(--border);',
      'display:flex;align-items:center;gap:10px;font-weight:700;font-size:13.5px;}',
      '.vlxt-bb-chat-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;}',
      '.vlxt-bb-msg{max-width:78%;padding:8px 12px;border-radius:12px;font-size:13px;line-height:1.45;',
      'word-wrap:break-word;white-space:pre-wrap;}',
      '.vlxt-bb-msg.me{align-self:flex-end;background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;',
      'border-bottom-right-radius:4px;}',
      '.vlxt-bb-msg.them{align-self:flex-start;background:rgba(120,120,120,.14);border-bottom-left-radius:4px;}',
      'body.dark .vlxt-bb-msg.them{background:rgba(255,255,255,.08);}',
      '.vlxt-bb-msg-time{font-size:9.5px;opacity:.65;margin-top:3px;}',
      '.vlxt-bb-chat-foot{padding:10px;border-top:1px solid var(--border);display:flex;gap:8px;}',
      '.vlxt-bb-chat-foot textarea{flex:1;resize:none;padding:9px 11px;border-radius:10px;',
      'border:1px solid var(--border);background:var(--bg,#fff);color:inherit;font-size:13px;',
      'font-family:inherit;height:38px;line-height:1.3;}',
      '.vlxt-bb-chat-foot button{width:38px;height:38px;flex-shrink:0;border:none;border-radius:10px;',
      'background:var(--blue);color:#fff;font-size:15px;cursor:pointer;}',
      '@media(max-width:700px){.vlxt-bb-wrap{flex-direction:column;} .vlxt-bb-chatbox{height:360px;}',
      '.vlxt-profile-body{grid-template-columns:68px 1fr;padding:22px 18px}.vlxt-profile-avatar{width:60px;height:60px;}',
      '.vlxt-profile-actions{grid-column:1/3;grid-row:auto;margin-top:14px}.vlxt-profile-stats{gap:8px}.vlxt-profile-stat{min-height:78px}.vlxt-profile-stat b{font-size:20px;}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ── Ảnh đại diện + bio ────────────────────────────────── */

  function ensurePublicProfile() {
    if (!db || !mySdt) return;
    db.ref('profiles_public/' + mySdt).update({
      hoten: me.hoten || '', lop: me.lop || '', updatedAt: Date.now()
    });
    db.ref('profiles/' + mySdt).once('value').then(function (snap) {
      if (!snap.exists()) db.ref('profiles/' + mySdt).set({ avatar: '', bio: '', updatedAt: Date.now() });
    });
  }

  function resizeToBase64(file, cb) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var size = 140;
        var canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        var ctx = canvas.getContext('2d');
        var scale = Math.max(size / img.width, size / img.height);
        var w = img.width * scale, h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        var q = 0.75, out = canvas.toDataURL('image/jpeg', q);
        while (out.length > 60000 && q > 0.35) { q -= 0.1; out = canvas.toDataURL('image/jpeg', q); }
        cb(out);
      };
      img.onerror = function () { cb(null); };
      img.src = e.target.result;
    };
    reader.onerror = function () { cb(null); };
    reader.readAsDataURL(file);
  }

  function renderAvatarSlot() {
    var slot = document.getElementById('vlxt-avatar-slot');
    if (!slot || !db || !mySdt) return;
    if (slot.querySelector('.vlxt-bb-cam')) { /* đã gắn nút, chỉ cập nhật ảnh */ }
    db.ref('profiles/' + mySdt).once('value').then(function (snap) {
      var data = snap.val() || {};
      if (data.avatar) {
        slot.innerHTML = '<img class="vlxt-bb-avatar-img" src="' + data.avatar + '">';
      } else {
        var initials = (me.hoten || 'HS').split(' ').map(function (w) { return w[0]; }).slice(-2).join('').toUpperCase();
        slot.textContent = initials;
      }
      var cam = document.createElement('label');
      cam.className = 'vlxt-bb-cam';
      cam.title = 'Đổi ảnh đại diện';
      cam.innerHTML = '📷<input type="file" accept="image/*" style="display:none">';
      cam.querySelector('input').onchange = function (e) {
        var f = e.target.files[0];
        if (!f) return;
        cam.innerHTML = '⏳';
        resizeToBase64(f, function (dataUrl) {
          if (!dataUrl) { renderAvatarSlot(); return; }
          db.ref('profiles/' + mySdt).update({ avatar: dataUrl, updatedAt: Date.now() }).then(renderAvatarSlot);
        });
      };
      slot.appendChild(cam);

      renderBioSlot(data.bio || '');
    });
  }

  function renderBioSlot(bio) {
    var slot = document.getElementById('vlxt-bio-slot');
    if (!slot) return;
    slot.innerHTML = '';
    var p = document.createElement('div');
    p.className = 'vlxt-bb-bio' + (bio ? '' : ' empty');
    p.textContent = bio ? bio : '✏️ Viết vài dòng giới thiệu bản thân...';
    p.onclick = function () {
      slot.innerHTML = '<div class="vlxt-bb-bio-edit">' +
        '<textarea maxlength="150" placeholder="Giới thiệu ngắn về bạn...">' + escHtml(bio) + '</textarea>' +
        '<button>Lưu</button></div>';
      var ta = slot.querySelector('textarea');
      ta.focus();
      slot.querySelector('button').onclick = function () {
        var v = ta.value.trim();
        db.ref('profiles/' + mySdt).update({ bio: v, updatedAt: Date.now() }).then(function () { renderBioSlot(v); });
      };
    };
    slot.appendChild(p);
  }

  /* ── Tìm bạn + kết bạn ─────────────────────────────────── */

  function loadSearchCache() {
    if (searchCache) return Promise.resolve(searchCache);
    return db.ref('profiles_public').once('value').then(function (snap) {
      searchCache = snap.val() || {};
      return searchCache;
    });
  }

  function searchProfilesGAS(term) {
    if (typeof VLXT_GAS === 'undefined') return Promise.resolve([]);
    var url = VLXT_GAS + '?type=searchprofiles&hs=' + encodeURIComponent(me.sdt) +
      '&q=' + encodeURIComponent(term) + '&t=' + Date.now();
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!d || d.ok !== true || !Array.isArray(d.data)) return [];
      return d.data;
    });
  }

  function friendState(targetKey, requestsIn, requestsOut) {
    if (friendsCache[targetKey]) return 'friend';
    if (requestsOut && requestsOut[targetKey]) return 'sent';
    if (requestsIn && requestsIn[targetKey]) return 'incoming';
    return 'none';
  }

  function doSearch(term, resultsEl) {
    term = term.trim().toLowerCase();
    if (!term) { resultsEl.innerHTML = ''; return; }
    resultsEl.innerHTML = '<div class="vlxt-bb-empty">Đang tìm...</div>';
    Promise.all([
      loadSearchCache(),
      db.ref('friend_requests/' + mySdt).once('value').then(function (s) { return s.val() || {}; }),
      db.ref('friend_outgoing/' + mySdt).once('value').then(function (s) { return s.val() || {}; }),
      searchProfilesGAS(term)
    ]).then(function (r) {
      var all = r[0], reqIn = r[1], reqOut = r[2];
      var termDigits = term.replace(/\D/g, '');
      var matches = [];
      Object.keys(all).forEach(function (k) {
        if (k === mySdt) return;
        var p = all[k];
        var nameMatch = (p.hoten || '').toLowerCase().indexOf(term) > -1;
        var sdtMatch = termDigits.length >= 4 && k.indexOf(termDigits) > -1;
        if (nameMatch || sdtMatch) matches.push({ key: k, hoten: p.hoten, lop: p.lop });
      });
      // API GAS bổ sung các học sinh chưa từng mở tab Bạn bè/Firebase.
      (r[3] || []).forEach(function (p) {
        var key = normKey(p.key);
        if (!key || key === mySdt || matches.some(function (m) { return m.key === key; })) return;
        matches.push({ key: key, hoten: p.hoten || '', lop: p.lop || '' });
      });
      matches = matches.slice(0, 20);
      if (!matches.length) { resultsEl.innerHTML = '<div class="vlxt-bb-empty">Không tìm thấy học sinh nào.</div>'; return; }
      resultsEl.innerHTML = '';
      matches.forEach(function (m) {
        var st = friendState(m.key, reqIn, reqOut);
        var row = document.createElement('div');
        row.className = 'vlxt-bb-row profile-link';
        row.onclick = function () { openPublicProfile({ key: m.key, hoten: m.hoten, lop: m.lop }); };
        row.innerHTML = '<div class="vlxt-bb-av">' + (m.hoten || 'HS').charAt(0).toUpperCase() + '</div>' +
          '<div class="vlxt-bb-info"><div class="vlxt-bb-name">' + escHtml(m.hoten) + '</div>' +
          '<div class="vlxt-bb-sub">Lớp ' + escHtml(m.lop || '') + '</div></div>';
        var btn = document.createElement('button');
        if (st === 'friend') { btn.className = 'vlxt-bb-btn pending'; btn.textContent = '✓ Bạn bè'; btn.disabled = true; }
        else if (st === 'sent') { btn.className = 'vlxt-bb-btn pending'; btn.textContent = 'Đã gửi lời mời'; btn.disabled = true; }
        else if (st === 'incoming') { btn.className = 'vlxt-bb-btn pending'; btn.textContent = 'Xem lời mời ⬇'; btn.disabled = true; }
        else {
          btn.className = 'vlxt-bb-btn add'; btn.textContent = '+ Kết bạn';
          btn.onclick = function (e) { e.stopPropagation(); sendFriendRequest(m.key, m.hoten, m.lop, btn); };
        }
        row.appendChild(btn);
        resultsEl.appendChild(row);
      });
    }).catch(function () {
      resultsEl.innerHTML = '<div class="vlxt-bb-empty">Không tải được danh sách bạn. Vui lòng thử lại.</div>';
    });
  }

  function sendFriendRequest(targetKey, targetName, targetLop, btn) {
    btn.disabled = true; btn.textContent = 'Đang gửi...';
    var now = Date.now();
    Promise.all([
      db.ref('friend_requests/' + targetKey + '/' + mySdt).set({ fromName: me.hoten, fromLop: me.lop, time: now }),
      db.ref('friend_outgoing/' + mySdt + '/' + targetKey).set({ toName: targetName, toLop: targetLop, time: now })
    ]).then(function () {
      btn.className = 'vlxt-bb-btn pending'; btn.textContent = 'Đã gửi lời mời';
    });
  }

  /* ── Hồ sơ công khai ───────────────────────────────────── */
  function profileInitials(name) {
    return (name || 'HS').trim().split(/\s+/).map(function (w) { return w.charAt(0); }).slice(-2).join('').toUpperCase();
  }
  function closePublicProfile() {
    var old = document.getElementById('vlxt-profile-overlay');
    if (old) old.remove();
  }
  function resolveProfileKey(seed) {
    var key = normKey(seed.key);
    if (key) return Promise.resolve(key);
    if (!seed.hoten) return Promise.resolve('');
    return searchProfilesGAS(seed.hoten).then(function (rows) {
      var wantedName = String(seed.hoten || '').trim().toLowerCase();
      var wantedClass = String(seed.lop || '').trim().toLowerCase();
      var exact = rows.find(function (p) {
        return String(p.hoten || '').trim().toLowerCase() === wantedName &&
          (!wantedClass || String(p.lop || '').trim().toLowerCase() === wantedClass);
      });
      return exact ? normKey(exact.key) : '';
    }).catch(function () { return ''; });
  }
  function openPublicProfile(seed) {
    seed = seed || {};
    if (seed.rank == null && Array.isArray(window._vlxtCurrentLbRows)) {
      var lbIndex = window._vlxtCurrentLbRows.findIndex(function (row) {
        return String(row.hoten || '').trim().toLowerCase() === String(seed.hoten || '').trim().toLowerCase() &&
          String(row.lop || '').trim().toLowerCase() === String(seed.lop || '').trim().toLowerCase();
      });
      if (lbIndex > -1) {
        seed.rank = lbIndex + 1;
        seed.lpTotal = Number(window._vlxtCurrentLbRows[lbIndex].lpTotal) || 0;
      }
    }
    closePublicProfile();
    var overlay = document.createElement('div');
    overlay.id = 'vlxt-profile-overlay'; overlay.className = 'vlxt-profile-overlay';
    overlay.innerHTML = '<div class="vlxt-profile-pagebar"><button class="vlxt-profile-close" aria-label="Quay lại">← Quay lại</button><b>Hồ sơ học sinh</b></div>' +
      '<main class="vlxt-profile-shell"><div class="vlxt-profile-card" role="region" aria-label="Hồ sơ học sinh">' +
      '<div class="vlxt-profile-body"><div class="vlxt-profile-avatar">' + escHtml(profileInitials(seed.hoten)) + '</div>' +
      '<div class="vlxt-profile-name">' + escHtml(seed.hoten || 'Học sinh') + '</div>' +
      '<div class="vlxt-profile-class">' + (seed.lop ? 'Lớp ' + escHtml(seed.lop) : 'Đang tải thông tin...') + '</div>' +
      '<div class="vlxt-profile-bio">Đang tải giới thiệu...</div><div class="vlxt-profile-actions"></div></div></div>' +
      '<div class="vlxt-profile-stats"></div><div class="vlxt-profile-section"><div class="vlxt-profile-tabs">' +
      '<span>👤 Hồ sơ</span><span>🏆 Thành tích</span><span>🤝 Tương tác</span></div>' +
      '<div class="vlxt-profile-note">Thông tin công khai của học sinh trên Vật Lý Xuân Trường</div></div></main>';
    document.body.appendChild(overlay);
    overlay.querySelector('.vlxt-profile-close').onclick = closePublicProfile;
    var stats = overlay.querySelector('.vlxt-profile-stats');
    stats.innerHTML = '<div class="vlxt-profile-stat"><b>' + (seed.lpTotal != null ? escHtml(seed.lpTotal) : '—') + '</b><span>⚡ Tổng LP</span></div>' +
      '<div class="vlxt-profile-stat"><b>' + (seed.rank != null ? '#' + escHtml(seed.rank) : '—') + '</b><span>🏆 Xếp hạng</span></div>' +
      '<div class="vlxt-profile-stat"><b>—</b><span>🏅 Điểm cao nhất</span></div>';
    resolveProfileKey(seed).then(function (key) {
      if (!document.body.contains(overlay)) return;
      if (!key) { overlay.querySelector('.vlxt-profile-bio').textContent = 'Học sinh chưa cập nhật phần giới thiệu.'; return; }
      Promise.all([
        db.ref('profiles_public/' + key).once('value'), db.ref('profiles/' + key).once('value'),
        db.ref('friend_requests/' + mySdt + '/' + key).once('value'), db.ref('friend_outgoing/' + mySdt + '/' + key).once('value')
      ]).then(function (r) {
        if (!document.body.contains(overlay)) return;
        var pub = r[0].val() || {}, detail = r[1].val() || {};
        var name = pub.hoten || seed.hoten || 'Học sinh', lop = pub.lop || seed.lop || '';
        overlay.querySelector('.vlxt-profile-name').textContent = name;
        overlay.querySelector('.vlxt-profile-class').textContent = lop ? 'Lớp ' + lop : '';
        overlay.querySelector('.vlxt-profile-bio').textContent = detail.bio || 'Học sinh chưa cập nhật phần giới thiệu.';
        if (detail.avatar) {
          overlay.querySelector('.vlxt-profile-avatar').innerHTML = '<img alt="Ảnh đại diện">';
          overlay.querySelector('.vlxt-profile-avatar img').src = detail.avatar;
        }
        var actions = overlay.querySelector('.vlxt-profile-actions');
        if (key === mySdt) return;
        var state = friendsCache[key] ? 'friend' : (r[3].exists() ? 'sent' : (r[2].exists() ? 'incoming' : 'none'));
        var btn = document.createElement('button');
        if (state === 'friend') {
          btn.className = 'vlxt-bb-btn add'; btn.textContent = '💬 Nhắn tin';
          btn.onclick = function () {
            closePublicProfile();
            if (typeof window.switchTab === 'function') window.switchTab('banbe');
            openChat(key, name);
          };
        } else if (state === 'none') {
          btn.className = 'vlxt-bb-btn add'; btn.textContent = '+ Kết bạn';
          btn.onclick = function () { sendFriendRequest(key, name, lop, btn); };
        } else {
          btn.className = 'vlxt-bb-btn pending'; btn.disabled = true;
          btn.textContent = state === 'sent' ? 'Đã gửi lời mời' : 'Đang chờ bạn xác nhận';
        }
        actions.appendChild(btn);
      });
    });
  }

  function acceptRequest(fromKey, fromName, fromLop) {
    var now = Date.now();
    return Promise.all([
      db.ref('friends/' + mySdt + '/' + fromKey).set({ name: fromName, lop: fromLop, since: now }),
      db.ref('friends/' + fromKey + '/' + mySdt).set({ name: me.hoten, lop: me.lop, since: now }),
      db.ref('friend_requests/' + mySdt + '/' + fromKey).remove(),
      db.ref('friend_outgoing/' + fromKey + '/' + mySdt).remove()
    ]);
  }

  function declineRequest(fromKey) {
    return Promise.all([
      db.ref('friend_requests/' + mySdt + '/' + fromKey).remove(),
      db.ref('friend_outgoing/' + fromKey + '/' + mySdt).remove()
    ]);
  }

  /* ── Danh sách lời mời + bạn bè ────────────────────────── */

  function renderRequestsAndFriends(reqEl, friendsEl) {
    db.ref('friend_requests/' + mySdt).on('value', function (snap) {
      var data = snap.val() || {};
      var keys = Object.keys(data);
      if (!keys.length) { reqEl.innerHTML = ''; return; }
      reqEl.innerHTML = '<div class="vlxt-bb-head">Lời mời kết bạn (' + keys.length + ')</div>';
      keys.forEach(function (k) {
        var r = data[k];
        var row = document.createElement('div');
        row.className = 'vlxt-bb-row profile-link';
        row.onclick = function () { openPublicProfile({ key: k, hoten: r.fromName, lop: r.fromLop }); };
        row.innerHTML = '<div class="vlxt-bb-av">' + (r.fromName || 'HS').charAt(0).toUpperCase() + '</div>' +
          '<div class="vlxt-bb-info"><div class="vlxt-bb-name">' + escHtml(r.fromName) + '</div>' +
          '<div class="vlxt-bb-sub">Lớp ' + escHtml(r.fromLop || '') + '</div></div>';
        var okBtn = document.createElement('button');
        okBtn.className = 'vlxt-bb-btn ok'; okBtn.textContent = 'Đồng ý';
        okBtn.onclick = function (e) { e.stopPropagation(); okBtn.disabled = true; acceptRequest(k, r.fromName, r.fromLop); };
        var noBtn = document.createElement('button');
        noBtn.className = 'vlxt-bb-btn no'; noBtn.textContent = 'Từ chối';
        noBtn.style.marginLeft = '6px';
        noBtn.onclick = function (e) { e.stopPropagation(); declineRequest(k); };
        row.appendChild(okBtn); row.appendChild(noBtn);
        reqEl.appendChild(row);
      });
    });

    db.ref('friends/' + mySdt).on('value', function (snap) {
      var data = snap.val() || {};
      friendsCache = data;
      var keys = Object.keys(data);
      if (!keys.length) {
        friendsEl.innerHTML = '<div class="vlxt-bb-empty">Chưa có bạn bè nào. Tìm bạn học ở ô phía trên nhé! 👆</div>';
        return;
      }
      friendsEl.innerHTML = '';
      var pending = keys.length;
      keys.forEach(function (k) {
        var f = data[k];
        db.ref('dm_threads/' + threadIdFor(mySdt, k) + '/meta').once('value').then(function (mSnap) {
          var meta = mSnap.val() || {};
          var streak = (meta.streak && meta.streak.count) || 0;
          var row = document.createElement('div');
          row.className = 'vlxt-bb-row profile-link';
          var unread = meta.unread && meta.unread[mySdt];
          row.innerHTML = '<div class="vlxt-bb-av" id="vlxt-bb-fav-' + k + '">' + (f.name || 'HS').charAt(0).toUpperCase() + '</div>' +
            '<div class="vlxt-bb-info"><div class="vlxt-bb-name">' + escHtml(f.name) +
            (unread ? '<span class="vlxt-bb-badge">mới</span>' : '') + '</div>' +
            '<div class="vlxt-bb-sub">Lớp ' + escHtml(f.lop || '') +
            (streak > 0 ? ' · <span class="vlxt-bb-streak">🔥 ' + streak + ' ngày</span>' : '') + '</div></div>';
          row.onclick = function () { openPublicProfile({ key: k, hoten: f.name, lop: f.lop }); };
          friendsEl.appendChild(row);
          db.ref('profiles/' + k + '/avatar').once('value').then(function (aSnap) {
            var av = aSnap.val();
            if (av) { var el = document.getElementById('vlxt-bb-fav-' + k); if (el) el.innerHTML = '<img src="' + av + '">'; }
          });
        });
      });
    });
  }

  /* ── Chat 1-1 + chuỗi ngày ─────────────────────────────── */

  var chatMsgListener = null, chatMsgRef = null;

  function openChat(friendKey, friendName) {
    activeThread = friendKey;
    var box = document.getElementById('vlxt-bb-chatbox');
    if (!box) return;
    var tid = threadIdFor(mySdt, friendKey);
    box.style.display = 'flex';
    box.innerHTML = '<div class="vlxt-bb-chat-head">💬 ' + escHtml(friendName) + '<span id="vlxt-bb-streak-lbl" style="margin-left:auto;font-size:12px;color:#d97706;font-weight:700;"></span></div>' +
      '<div class="vlxt-bb-chat-body" id="vlxt-bb-chat-body"><div class="vlxt-bb-empty">Nhắn gì đó để bắt đầu trò chuyện nhé! 😊</div></div>' +
      '<div class="vlxt-bb-chat-foot"><textarea id="vlxt-bb-chat-input" maxlength="1000" placeholder="Nhập tin nhắn..."></textarea>' +
      '<button id="vlxt-bb-chat-send">➤</button></div>';

    if (chatMsgListener && chatMsgRef) chatMsgRef.off('child_added', chatMsgListener);
    var bodyEl = document.getElementById('vlxt-bb-chat-body');
    var emptyNote = bodyEl.querySelector('.vlxt-bb-empty');
    chatMsgRef = db.ref('dm_threads/' + tid + '/messages').limitToLast(100);
    chatMsgListener = function (snap) {
      if (emptyNote) { emptyNote.remove(); emptyNote = null; }
      var m = snap.val();
      var div = document.createElement('div');
      div.className = 'vlxt-bb-msg ' + (m.from === mySdt ? 'me' : 'them');
      div.innerHTML = escHtml(m.text).replace(/\n/g, '<br>') + '<div class="vlxt-bb-msg-time">' + fmtTime(m.time) + '</div>';
      bodyEl.appendChild(div);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    };
    chatMsgRef.on('child_added', chatMsgListener);

    db.ref('dm_threads/' + tid + '/meta/streak/count').once('value').then(function (s) {
      var c = s.val() || 0;
      var lbl = document.getElementById('vlxt-bb-streak-lbl');
      if (lbl && c > 0) lbl.textContent = '🔥 ' + c + ' ngày';
    });
    db.ref('dm_threads/' + tid + '/meta/unread/' + mySdt).set(false);

    var inputEl = document.getElementById('vlxt-bb-chat-input');
    var sendBtn = document.getElementById('vlxt-bb-chat-send');
    var doSend = function () {
      var v = inputEl.value;
      if (!v.trim()) return;
      sendDM(tid, friendKey, v.trim());
      inputEl.value = '';
    };
    sendBtn.onclick = doSend;
    inputEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } });
    setTimeout(function () { inputEl.focus(); }, 100);
  }

  function sendDM(tid, friendKey, text) {
    var now = Date.now();
    db.ref('dm_threads/' + tid + '/messages').push({ from: mySdt, text: text, time: now });
    var metaRef = db.ref('dm_threads/' + tid + '/meta');
    var upd = {}; upd['lastMsg'] = text; upd['lastTime'] = now;
    upd['members/' + mySdt] = true; upd['members/' + friendKey] = true;
    upd['names/' + mySdt] = me.hoten; upd['names/' + friendKey] = friendsCache[friendKey] ? friendsCache[friendKey].name : '';
    upd['unread/' + friendKey] = true; upd['unread/' + mySdt] = false;
    metaRef.update(upd);

    metaRef.child('streak').transaction(function (cur) {
      var today = todayStr(now);
      if (!cur) return { count: 1, lastDate: today };
      if (cur.lastDate === today) return cur;
      var gap = daysBetween(cur.lastDate, today);
      if (gap === 1) return { count: (cur.count || 0) + 1, lastDate: today };
      return { count: 1, lastDate: today };
    }, function (err, committed, snap) {
      if (committed && snap) {
        var v = snap.val();
        var lbl = document.getElementById('vlxt-bb-streak-lbl');
        if (lbl && v && v.count > 0) lbl.textContent = '🔥 ' + v.count + ' ngày';
      }
    });
  }

  /* ── Mount tab "Bạn bè" ────────────────────────────────── */

  function renderTab() {
    if (!db || !mySdt) return; // chưa init xong (trang có thể gọi hàm này sớm trước khi DOMContentLoaded) — an toàn bỏ qua, init() sẽ tự gọi lại
    var host = document.getElementById('tab-banbe');
    if (!host || host.dataset.bbMounted) return;
    host.dataset.bbMounted = '1';
    host.innerHTML =
      '<div class="vlxt-bb-wrap">' +
        '<div class="vlxt-bb-col">' +
          '<div class="vlxt-bb-search"><input id="vlxt-bb-search-input" placeholder="Tìm bạn theo tên hoặc SĐT..."><button id="vlxt-bb-search-btn">Tìm</button></div>' +
          '<div class="section-card"><div id="vlxt-bb-search-results"></div></div>' +
          '<div class="section-card" style="margin-top:14px"><div id="vlxt-bb-requests"></div><div id="vlxt-bb-friends"></div></div>' +
        '</div>' +
        '<div class="vlxt-bb-col">' +
          '<div class="vlxt-bb-chatbox" id="vlxt-bb-chatbox" style="display:none"></div>' +
        '</div>' +
      '</div>';

    var input = document.getElementById('vlxt-bb-search-input');
    var btn = document.getElementById('vlxt-bb-search-btn');
    var resultsEl = document.getElementById('vlxt-bb-search-results');
    btn.onclick = function () { doSearch(input.value, resultsEl); };
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSearch(input.value, resultsEl); });

    renderRequestsAndFriends(document.getElementById('vlxt-bb-requests'), document.getElementById('vlxt-bb-friends'));
  }

  function init() {
    injectCSS();
    if (!initFirebase()) return;
    var user = (typeof vlxtGetUser === 'function') ? vlxtGetUser() : null;
    if (!user || !user.sdt) return;
    me = user;
    mySdt = normKey(user.sdt);
    ensurePublicProfile();
    renderAvatarSlot();
    renderTab();
  }

  window.vlxtBanBeRefreshProfileUI = function () { if (db && mySdt) renderAvatarSlot(); };
  window.vlxtRenderBanBeTab = renderTab;
  window.vlxtOpenPublicProfile = function (seed) { if (db && mySdt) openPublicProfile(seed || {}); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
