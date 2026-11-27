/* Lucian UX/UI Prompt #408 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#408 */
/* Lucian UX/UI Prompt #435 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#435 */
/* ═══════════════════════════════════════════
   AUTH MODULE — Vật Lý Xuân Trường
═══════════════════════════════════════════ */

function vlxtSyncRootThemeAttr(){
  try{
    if(typeof document === 'undefined' || !document.documentElement) return;
    var isDark = document.body ? document.body.classList.contains('dark') : (localStorage.getItem('vlxt_theme') === 'dark');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  }catch(e){}
}

function vlxtEnsureLucianTokens(){
  try{
    if(typeof document === 'undefined' || !document.head) return;
    if(!window.location.pathname.includes('thithu.html') && !window.location.pathname.includes('phong-thi-thu.html')){
      if(!document.getElementById('vlxt-lucian-tokens')){
        var link = document.createElement('link');
        link.id = 'vlxt-lucian-tokens';
        link.rel = 'stylesheet';
        link.href = 'assets/lucian-uxui.css?v=20261124';
        document.head.appendChild(link);
      }
    }
    if(typeof window.VLXT_TELEMETRY === 'undefined' && !document.querySelector('script[src*="vlxt-telemetry.js"]')){
      var st = document.createElement('script');
      st.src = 'vlxt-telemetry.js?v=20261124';
      st.defer = true;
      document.head.appendChild(st);
    }
    if(typeof window.vlxtOpenFeedbackHub !== 'function' && !document.querySelector('script[src*="vlxt-feedback-hub.js"]')){
      var sf = document.createElement('script');
      sf.src = 'vlxt-feedback-hub.js?v=20261124';
      sf.defer = true;
      document.head.appendChild(sf);
    }
  }catch(e){}
}

/* Theme toggle — định nghĩa sớm để onclick="toggleTheme()" luôn hoạt động */
function toggleTheme(){
  document.body.classList.toggle('dark');
  var isDark = document.body.classList.contains('dark');
  try{ localStorage.setItem('vlxt_theme', isDark ? 'dark' : 'light'); }catch(e){}
  vlxtSyncRootThemeAttr();
  var btn = document.getElementById('vlxt-theme-btn');
  if(btn) btn.textContent = isDark ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';
}
(function(){
  try{
    if(localStorage.getItem('vlxt_theme')==='dark' && document.body) document.body.classList.add('dark');
    vlxtEnsureLucianTokens();
    vlxtSyncRootThemeAttr();
  }catch(e){}
})();

const VLXT_AUTH_KEY = 'vlxt_user_v2';
const VLXT_GAS = 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';
if (typeof window !== 'undefined') window.VLXT_GAS = VLXT_GAS;

function vlxtGetUser(){
  try{ return JSON.parse(localStorage.getItem(VLXT_AUTH_KEY)||'null'); }catch{ return null; }
}
function vlxtSaveUser(u){ localStorage.setItem(VLXT_AUTH_KEY,JSON.stringify(u)); }
function vlxtLogout(){ localStorage.removeItem(VLXT_AUTH_KEY); window.location.href='login.html'; }
function vlxtRequireAuth(){
  const u=vlxtGetUser();
  if(!u){ window.location.href='login.html?from='+encodeURIComponent(window.location.pathname+window.location.search); return null; }
  return u;
}

// Luôn đối chiếu lại quyền tài khoản với GAS. Nhờ vậy khi admin nâng/hạ cấp,
// học sinh chỉ cần tải lại trang, không phải đăng xuất rồi đăng nhập lại.
function vlxtRefreshUser(){
  var current=vlxtGetUser();
  if(!current||!current.sdt) return Promise.resolve(current);
  if(!current.token) return Promise.resolve(current);
  return fetch(VLXT_GAS, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action: 'getprofile', sdt: current.sdt, token: current.token })
  })
    .then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(function(d){
      if(!d||!d.ok||!d.user) return current;
      var fresh=Object.assign({},current,d.user);
      if(current.token && !fresh.token) fresh.token = current.token;
      vlxtSaveUser(fresh);
      window.dispatchEvent(new CustomEvent('vlxt:user-refreshed',{detail:fresh}));
      return fresh;
    }).catch(function(){ return current; });
}
window.vlxtRefreshUser=vlxtRefreshUser;

function vlxtCloseDropdown(focusBtn){
  var dd = document.getElementById('vlxt-dropdown');
  var btn = document.getElementById('vlxt-avatar-btn');
  if(dd) dd.classList.remove('open');
  if(btn){
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    if(focusBtn && typeof btn.focus === 'function') btn.focus({ preventScroll: true });
  }
}

function vlxtToggleDropdown(e){
  if(e && typeof e.stopPropagation === 'function') e.stopPropagation();
  const dd = document.getElementById('vlxt-dropdown');
  const btn = document.getElementById('vlxt-avatar-btn');
  if(!dd) return;
  const isOpen = dd.classList.toggle('open');
  if(btn){
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  }
}

// Đổi giao diện sáng/tối DÙNG CHUNG cho mọi trang (gọi từ menu dropdown avatar).
// Lưu vào cùng 1 key localStorage 'vlxt_theme' mà mọi trang đều đọc khi tải →
// đảm bảo trạng thái sáng/tối luôn đồng bộ khi chuyển qua lại giữa các trang.
function vlxtToggleTheme(e){
  if(e) e.stopPropagation();
  const isDark = document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark', isDark);
  try{ localStorage.setItem('vlxt_theme', isDark ? 'dark' : 'light'); }catch(err){}
  vlxtSyncRootThemeAttr();
  const btn = document.getElementById('vlxt-theme-btn');
  if(btn) btn.textContent = isDark ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';
}
window.vlxtToggleTheme = vlxtToggleTheme;

document.addEventListener('click',function(e){
  const w=document.getElementById('vlxt-user-widget');
  if(w&&!w.contains(e.target)) vlxtCloseDropdown(false);
});
document.addEventListener('keydown',function(e){
  const dd=document.getElementById('vlxt-dropdown');
  if(!dd || !dd.classList.contains('open')) return;
  if(e.key === 'Escape'){
    e.preventDefault();
    e.stopPropagation();
    vlxtCloseDropdown(true);
    return;
  }
  if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End'){
    var items = Array.prototype.slice.call(dd.querySelectorAll('.vlxt-dd-item'));
    if(!items.length) return;
    e.preventDefault();
    var idx = items.indexOf(document.activeElement);
    var nextIdx = 0;
    if(e.key === 'ArrowDown') nextIdx = (idx + 1) % items.length;
    else if(e.key === 'ArrowUp') nextIdx = (idx - 1 + items.length) % items.length;
    else if(e.key === 'End') nextIdx = items.length - 1;
    items[nextIdx].focus({ preventScroll: true });
  }
});

/* ─── LUCIAN #435 TOAST STACK (window.vlxtToast) ─── */
(function(){
  if(typeof window === 'undefined' || typeof document === 'undefined') return;
  var H = 56, GAP = 8, LIFE = 4200, MAX = 3;
  var toasts = [], open = false, paused = false, leaveT = 0;
  var host = null, rg = null;
  var rm = function(){ return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  function ensureHost(){
    vlxtEnsureLucianTokens();
    if(host && host.isConnected && rg && rg.isConnected) return rg;
    host = document.getElementById('vlxt-toast-host');
    if(!host){
      host = document.createElement('div');
      host.id = 'vlxt-toast-host';
      host.className = 'ux vlxt-toast-host';
      host.innerHTML = '<section class="vlxt-toast-rg" id="vlxt-toast-region" aria-label="Thông báo hệ thống" aria-live="polite"></section>';
      (document.body || document.documentElement).appendChild(host);
    }
    rg = host.querySelector('.vlxt-toast-rg');
    if(rg && !rg.__vlxtBound){
      rg.__vlxtBound = true;
      rg.addEventListener('pointerenter', function(){ clearTimeout(leaveT); setOpen(true); });
      rg.addEventListener('pointerleave', function(){ clearTimeout(leaveT); leaveT = setTimeout(function(){ if(!rg.contains(document.activeElement)) setOpen(false); }, 120); });
      rg.addEventListener('focusin', function(){ setOpen(true); });
      rg.addEventListener('focusout', function(e){ if(!rg.contains(e.relatedTarget)) setOpen(false); });
    }
    return rg;
  }

  function layout(){
    if(!rg) return;
    var live = toasts.filter(function(t){ return !t.gone; }), n = live.length;
    live.forEach(function(t, k){
      var i = n - 1 - k;
      var y = open ? -i * (H + GAP) : -i * 10;
      var s = open ? 1 : 1 - i * 0.05;
      t.el.style.setProperty('--y', y + 'px');
      t.el.style.setProperty('--s', s.toFixed(3));
      t.el.style.setProperty('--o', i < MAX ? 1 : 0);
      t.el.style.zIndex = String(20 - i);
      t.el.classList.toggle('is-back', !open && i > 0);
    });
    rg.style.height = (open && n > 1 ? n * H + (n - 1) * GAP : H + 20) + 'px';
  }

  function timer(t){
    clearTimeout(t.tm);
    t.t0 = Date.now();
    if(!paused) t.tm = setTimeout(function(){ if(t.el.isConnected) dismiss(t); }, t.left);
  }

  function bar(t, ms){
    var pb = t.el.querySelector('.vlxt-toast-pb');
    pb.innerHTML = '<i style="animation-duration:' + ms + 'ms"></i>';
    t.left = ms;
    timer(t);
  }

  function dismiss(t, dir, quiet){
    if(t.gone) return;
    t.gone = true;
    clearTimeout(t.tm);
    var el = t.el;
    el.style.pointerEvents = 'none';
    var done = function(){ el.remove(); var idx = toasts.indexOf(t); if(idx >= 0) toasts.splice(idx, 1); layout(); };
    layout();
    if(rm() || !el.animate){ done(); return; }
    var y = el.style.getPropertyValue('--y') || '0px';
    var s = el.style.getPropertyValue('--s') || '1';
    if(dir){
      var v = Math.max(1.2, Math.abs(t.v || 0));
      var dist = 360;
      var dur = Math.max(150, Math.min(300, dist / v));
      el.classList.add('is-drag');
      el.animate(
        [{ transform: 'translate3d(' + (t.dx || 0) + 'px,' + y + ',0) scale(' + s + ')', opacity: 1 },
         { transform: 'translate3d(' + dir * dist + 'px,' + y + ',0) scale(' + s + ') rotate(' + dir * 5 + 'deg)', opacity: 0 }],
        { duration: dur, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }
      ).onfinish = done;
    } else {
      el.animate(
        [{ opacity: quiet ? 0 : 1 }, { transform: 'translate3d(0,calc(' + y + ' + 14px),0) scale(' + (Number(s) * 0.94) + ')', opacity: 0 }],
        { duration: 240, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' }
      ).onfinish = done;
    }
  }

  function swipe(t){
    var el = t.el, on = false, x0 = 0, last = [];
    el.addEventListener('pointerdown', function(e){
      if(e.button !== 0 || e.target.closest('button') || t.gone) return;
      on = true; x0 = e.clientX; t.dx = 0; t.v = 0; last = [[e.clientX, e.timeStamp]];
      el.classList.add('is-drag');
      try{ el.setPointerCapture(e.pointerId); }catch(er){}
    });
    el.addEventListener('pointermove', function(e){
      if(!on) return;
      t.dx = e.clientX - x0;
      last.push([e.clientX, e.timeStamp]);
      if(last.length > 5) last.shift();
      el.style.setProperty('--x', t.dx.toFixed(1) + 'px');
      el.style.opacity = String(Math.max(0.35, 1 - Math.abs(t.dx) / 300));
    });
    function end(){
      if(!on) return;
      on = false;
      var a = last[0], b = last[last.length - 1];
      t.v = b && a && b[1] > a[1] ? (b[0] - a[0]) / (b[1] - a[1]) : 0;
      el.style.opacity = '';
      if(Math.abs(t.dx) > 80 || Math.abs(t.v) > 0.6){
        dismiss(t, (Math.abs(t.v) > 0.6 ? t.v : t.dx) > 0 ? 1 : -1);
        return;
      }
      el.classList.remove('is-drag');
      el.style.setProperty('--x', '0px');
      t.dx = 0;
    }
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
  }

  function setOpen(v){
    if(open === v) return;
    open = v; paused = v;
    if(rg) rg.classList.toggle('is-paused', v);
    toasts.forEach(function(t){
      if(t.gone) return;
      if(v){ clearTimeout(t.tm); t.left = Math.max(500, t.left - (Date.now() - t.t0)); }
      else timer(t);
    });
    layout();
  }

  window.vlxtToast = function(message, options){
    var opts = options || {};
    var tone = opts.tone || opts.type || 'success';
    var duration = Number(opts.duration) > 0 ? Number(opts.duration) : LIFE;
    var region = ensureHost();
    if(!region) return null;

    var toneClass = tone === 'error' ? 'err' : tone === 'warn' ? 'warn' : tone === 'info' ? 'info' : 'ok';
    var iconSvg = toneClass === 'err'
      ? '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>'
      : toneClass === 'warn'
        ? '<svg viewBox="0 0 24 24"><path d="M12 8v5"/><path d="M12 16.5v.5"/></svg>'
        : toneClass === 'info'
          ? '<svg viewBox="0 0 24 24"><path d="M12 11v5"/><path d="M12 7.5v.5"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="m6 12.5 4 4 8-9"/></svg>';

    var el = document.createElement('div');
    el.className = 'vlxt-toast-t';
    el.setAttribute('role', 'status');
    el.setAttribute('data-tone', tone);
    el.innerHTML = '<span class="vlxt-toast-ic" aria-hidden="true"><span class="' + toneClass + '">' + iconSvg + '</span></span>'
      + '<span class="vlxt-toast-tx"></span>'
      + '<button type="button" class="vlxt-toast-x" aria-label="Đóng thông báo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>'
      + '<span class="vlxt-toast-pb" aria-hidden="true"></span>';
    el.querySelector('.vlxt-toast-tx').textContent = String(message || '');

    var t = { el: el, dx: 0, v: 0, gone: false, left: duration };
    el.querySelector('.vlxt-toast-x').addEventListener('click', function(){ dismiss(t); });
    swipe(t);
    toasts.push(t);
    if(!rm()){
      el.classList.add('is-in');
      el.style.setProperty('--y', '84px');
      el.style.setProperty('--s', '.9');
      el.style.setProperty('--o', '0');
      el.style.transition = 'none';
      region.appendChild(el);
      void el.offsetWidth;
      el.style.transition = '';
    } else {
      region.appendChild(el);
    }
    bar(t, duration);
    var live = toasts.filter(function(x){ return !x.gone; });
    if(live.length > MAX) dismiss(live[0], 0, true);
    layout();
    return t;
  };
})();

// Đọc số bài đã học từ localStorage (chính xác hơn GAS)
function vlxtLocalDoneCount(sdt){
  try{
    var arr=JSON.parse(localStorage.getItem('vlxt_watched_'+sdt)||'[]');
    return Array.isArray(arr)?arr.length:0;
  }catch{ return 0; }
}

// Render widget — inline nếu có #vlxt-nav-user-area, fixed nếu không
function vlxtRenderWidget(user){
  // Trong phòng thi thử CBT (thithu.html, phong-thi-thu.html), không hiện widget nổi để học sinh tập trung tối đa làm bài
  if(window.location.pathname.includes('thithu.html') || window.location.pathname.includes('phong-thi-thu.html')) return;
  vlxtEnsureLucianTokens();
  vlxtSyncRootThemeAttr();

  const ex = document.getElementById('vlxt-user-widget');
  if(ex) ex.remove();

  const navArea = document.getElementById('vlxt-nav-user-area');
  const isValidUser = Boolean(user && user.sdt && user.sdt !== 'FREE');

  // Nếu là KHÁCH (chưa đăng nhập)
  if(!isValidUser) {
    if(!navArea) return;
    navArea.innerHTML = '';
    const guestWidget = document.createElement('div');
    guestWidget.id = 'vlxt-user-widget';
    guestWidget.style.position = 'relative';

    const guestCSS = `
      .vlxt-pill-btn {
        display: inline-flex !important;
        align-items: center !important;
        gap: 8px !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        padding: 5px 14px !important;
        border-radius: 100px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        color: #e2e8f0 !important;
        cursor: pointer !important;
        transition: background-color 0.2s var(--ux-ease, ease), border-color 0.2s var(--ux-ease, ease), transform 0.35s var(--ux-spring, ease) !important;
        user-select: none !important;
      }
      .vlxt-pill-btn:hover {
        background: rgba(16, 185, 129, 0.12) !important;
        border-color: rgba(16, 185, 129, 0.45) !important;
        color: #ffffff !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
      }
      .vlxt-pill-btn:active { transform: scale(0.96) !important; }
      .vlxt-dot-neon {
        width: 8px !important;
        height: 8px !important;
        border-radius: 50% !important;
        flex-shrink: 0 !important;
        display: inline-block !important;
      }
      .vlxt-dot-neon.green {
        background: #10b981 !important;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25) !important;
        animation: vlxtDotPulse 2s infinite !important;
      }
      @keyframes vlxtDotPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.65; transform: scale(1.12); }
      }
      .vlxt-pill-name {
        font-size: 13px !important;
        font-weight: 600 !important;
        color: #e2e8f0 !important;
        white-space: nowrap !important;
      }
      @media (max-width: 420px) {
        .vlxt-pill-btn { padding: 4px 10px !important; gap: 6px !important; }
        .vlxt-pill-name { font-size: 12px !important; }
        .top-bar { padding: 0 12px !important; }
        .nav-left-wrap { gap: 8px !important; }
        .brand-glow-text { font-size: 13.5px !important; }
      }
    `;

    guestWidget.innerHTML = `
      <style>${guestCSS}</style>
      <button type="button" id="vlxt-avatar-btn" class="vlxt-pill-btn guest" onclick="vlxtHandleGuestClick(event)">
        <span class="vlxt-dot-neon green"></span>
        <span class="vlxt-pill-name">Khách trải nghiệm</span>
      </button>
    `;
    navArea.appendChild(guestWidget);
    return;
  }

  // Nếu ĐÃ ĐĂNG NHẬP
  const words = (user.hoten || 'Học sinh').trim().split(/\s+/);
  const shortName = words.slice(-2).join(' ');
  const widget = document.createElement('div');
  widget.id = 'vlxt-user-widget';

  const loaiTK = user.loaiTK || 'vip';
  const trialExpiry = user.trialExpiry || 0;
  const msLeft = trialExpiry ? (trialExpiry - Date.now()) : 0;
  const daysLeft = Math.max(0, Math.ceil(msLeft / 86400000));
  const isPaidLocal = Boolean(
    user.isPaid ||
    loaiTK === 'pro' ||
    loaiTK === 'premium' ||
    (loaiTK === 'vip' && daysLeft > 8) ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('vlxt_is_paid') === 'true')
  );
  const eaState = (typeof window !== 'undefined' && window.VLXT_CAMPAIGN && typeof window.VLXT_CAMPAIGN.getUserEarlyAccessState === 'function')
    ? window.VLXT_CAMPAIGN.getUserEarlyAccessState(user)
    : null;
  const vipBadge = loaiTK === 'premium' ? '<span class="vlxt-pill-badge pro">💎 VIP</span>'
    : isPaidLocal ? '<span class="vlxt-pill-badge pro">👑 PRO</span>'
    : (eaState && eaState.active && !eaState.isLegacyTrial) ? ('<span class="vlxt-pill-badge pro" style="white-space:nowrap">⏳ Sớm ' + (eaState.totalDays || 3) + 'd</span>')
    : (loaiTK === 'vip' && msLeft > 0) ? `<span class="vlxt-pill-badge pro">⭐ ${daysLeft}d</span>`
    : '<span class="vlxt-pill-badge free">Free</span>';

  const localDone = vlxtLocalDoneCount(user.sdt);

  const ddCSS = [
    '#vlxt-dropdown{position:absolute;top:calc(100% + 10px);right:0;',
    'background:#151c2c;border:1px solid rgba(56,189,248,0.24);border-radius:16px;',
    'padding:14px;min-width:246px;max-width:288px;box-shadow:0 16px 38px rgba(0,0,0,0.65),0 2px 8px rgba(0,0,0,0.35);',
    'transform-origin:calc(100% - 26px) -10px;transform:scale(.86) translateY(-6px);opacity:0;visibility:hidden;pointer-events:none;',
    'transition:transform .24s var(--ux-ease,ease),opacity .18s ease,visibility 0s .24s;z-index:99999;}',
    '#vlxt-dropdown::before{content:"";position:absolute;right:20px;top:-6px;width:10px;height:10px;border-radius:2px;',
    'background:#151c2c;border-top:1px solid rgba(56,189,248,0.24);border-left:1px solid rgba(56,189,248,0.24);transform:rotate(45deg);}',
    '#vlxt-dropdown.open{transform:none;opacity:1;visibility:visible;pointer-events:auto;',
    'transition:transform .44s var(--ux-spring,cubic-bezier(.34,1.45,.64,1)),opacity .16s ease,visibility 0s;}',
    '#vlxt-dropdown>*{opacity:0;transform:translateY(-5px);transition:opacity .15s ease,transform .32s var(--ux-spring,ease);}',
    '#vlxt-dropdown.open>*{opacity:1;transform:none;transition-delay:calc(36ms + var(--i,0) * 28ms);}',
    '.vlxt-user-name{font-size:14.5px;font-weight:700;color:#f8fafc;margin-bottom:2px;display:flex;align-items:center;justify-content:space-between;gap:8px;}',
    '.vlxt-user-meta{font-size:11.5px;color:#94a3b8;margin-bottom:12px;}',
    '.vlxt-stats{display:flex;gap:8px;margin-bottom:12px;}',
    '.vlxt-stat{flex:1;background:#0f172a;border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:7px 8px;text-align:center;}',
    '.vlxt-stat-val{font-size:15px;font-weight:800;color:#38bdf8;}',
    '.vlxt-stat-label{font-size:10.5px;color:#94a3b8;margin-top:2px;}',
    '.vlxt-nav-links{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;}',
    '.vlxt-nav-link{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;font-size:13px;font-weight:600;color:#e2e8f0;text-decoration:none;transition:background-color 0.15s,color 0.15s;}',
    '.vlxt-nav-link:hover,.vlxt-nav-link:focus-visible{background:rgba(255,255,255,0.08);color:#fff;outline:none;}',
    '.vlxt-divider{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:10px 0;}',
    '.vlxt-theme-btn{width:100%;padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.05);color:#cbd5e1;font-size:12.5px;font-weight:600;cursor:pointer;text-align:left;transition:background-color 0.15s,color 0.15s;font-family:inherit;margin-bottom:8px;}',
    '.vlxt-theme-btn:hover,.vlxt-theme-btn:focus-visible{background:rgba(255,255,255,0.1);color:#fff;outline:none;}',
    '.vlxt-logout-btn{width:100%;padding:8px 10px;border-radius:10px;border:none;background:rgba(239,68,68,0.12);color:#f87171;font-size:12.5px;font-weight:600;cursor:pointer;text-align:left;transition:background-color 0.15s,color 0.15s;font-family:inherit;}',
    '.vlxt-logout-btn:hover,.vlxt-logout-btn:focus-visible{background:rgba(239,68,68,0.25);color:#fca5a5;outline:none;}',
    '@media(max-width:600px){#vlxt-dropdown{right:0;left:auto;min-width:225px;max-width:92vw;}}',
    '@media(prefers-reduced-motion:reduce){#vlxt-dropdown,#vlxt-dropdown>*,.vlxt-pill-chevron{transition:none!important;}}'
  ].join('');

  var _isDarkNow = document.body.classList.contains('dark');
  var _themeLabel = _isDarkNow ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';

  const ddHTML = '<div id="vlxt-dropdown" role="menu" aria-label="Menu tài khoản">'
    +'<div style="--i:0"><div class="vlxt-user-name"><span>'+user.hoten+'</span>'+vipBadge+'</div>'
    +'<div class="vlxt-user-meta">Lớp '+(user.lop || '12')+' · '+(user.sdt || '')+'</div></div>'
    +'<div class="vlxt-stats" style="--i:1">'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-lp">'+(isNaN(Number(user.lpTotal))?0:(Number(user.lpTotal)||0))+'</div><div class="vlxt-stat-label">⚡ LP</div></div>'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-done">'+localDone+'</div><div class="vlxt-stat-label">📚 Bài học</div></div>'
    +'</div>'
    +'<button type="button" class="vlxt-theme-btn vlxt-dd-item" role="menuitem" style="--i:2" id="vlxt-theme-btn" onclick="vlxtToggleTheme(event)">'+_themeLabel+'</button>'
    +'<div class="vlxt-nav-links" style="--i:3">'
    +'<a href="hoso.html" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="color:#38bdf8;font-weight:700">👤 Hồ sơ cá nhân</a>'
    +(!isPaidLocal ? '<button type="button" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="width:100%;background:none;border:none;text-align:left;cursor:pointer;font-family:inherit;color:#34d399;font-weight:700" onclick="vlxtCloseDropdown(false);if(window.VLXT_GROWTH&&typeof window.VLXT_GROWTH.openMissionModal===\'function\'){window.VLXT_GROWTH.openMissionModal();}else if(window.VLXT_CAMPAIGN&&typeof window.VLXT_CAMPAIGN.openEarlyAccessModal===\'function\'){window.VLXT_CAMPAIGN.openEarlyAccessModal();}">🎁 Nhận thêm ngày VIP (+2d/bạn)</button>' : '')
    +(isPaidLocal ? '<a href="goi-hoc.html" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="color:#34d399;font-weight:700">👑 Gói Pro đang dùng</a>' : '<a href="goi-hoc.html" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="color:#fbbf24;font-weight:700">⭐ Giữ suất / Nâng cấp VIP</a>')
    +'<a href="https://zalo.me/g/str1pllhp4uxa3rtvnou" target="_blank" rel="noopener" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="color:#60a5fa;font-weight:700" onclick="try{if(window.VLXT_TELEMETRY)window.VLXT_TELEMETRY.track(\'zalo_group_click\',{source:\'nav_dropdown\'});}catch(e){}">👥 Nhóm Zalo Thành Viên Web</a>'
    +'<button type="button" class="vlxt-nav-link vlxt-dd-item" role="menuitem" style="width:100%;background:none;border:none;text-align:left;cursor:pointer;font-family:inherit" onclick="vlxtCloseDropdown(false);if(typeof vlxtOpenFeedbackHub===\'function\'){vlxtOpenFeedbackHub(\'bug\');}">🛠️ Báo lỗi · Góp ý · Zalo Thầy</button>'
    +'<a href="huongdan.html" class="vlxt-nav-link vlxt-dd-item" role="menuitem">🧭 Hướng dẫn học tập</a>'
    +'</div><hr class="vlxt-divider" style="--i:4">'
    +'<button type="button" class="vlxt-logout-btn vlxt-dd-item" role="menuitem" style="--i:5" onclick="vlxtLogout()">↩ Đăng xuất</button>'
    +'</div>';

  if(navArea){
    navArea.innerHTML = '';
    var inlineCSS = [
      '#vlxt-user-widget{position:relative;font-family:\'Plus Jakarta Sans\',system-ui,sans-serif;}',
      '.vlxt-pill-btn{display:inline-flex!important;align-items:center!important;gap:8px!important;',
      'background:rgba(255,255,255,0.05)!important;border:1px solid rgba(255,255,255,0.14)!important;',
      'padding:5px 14px!important;border-radius:100px!important;font-size:13px!important;font-weight:600!important;',
      'color:#f1f5f9!important;cursor:pointer!important;transition:background-color 0.2s ease,border-color 0.2s ease,transform 0.35s var(--ux-spring,ease)!important;',
      'user-select:none!important;}',
      '.vlxt-pill-btn:hover{background:rgba(16,185,129,0.1)!important;border-color:rgba(16,185,129,0.45)!important;',
      'color:#fff!important;box-shadow:0 2px 8px rgba(0,0,0,0.3)!important;}',
      '.vlxt-pill-btn:active{transform:scale(0.96)!important;}',
      '.vlxt-pill-btn.is-open{border-color:#0b84f3!important;box-shadow:0 0 0 2px rgba(11,132,243,0.35)!important;}',
      '.vlxt-dot-neon{width:8px!important;height:8px!important;border-radius:50%!important;flex-shrink:0!important;display:inline-block!important;}',
      '.vlxt-dot-neon.green{background:#10b981!important;box-shadow:0 0 0 2px rgba(16,185,129,0.25)!important;animation:vlxtDotPulse 2s infinite!important;}',
      '@keyframes vlxtDotPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.65;transform:scale(1.12);}}',
      '.vlxt-pill-name{font-size:13px!important;font-weight:600!important;color:#f1f5f9!important;white-space:nowrap!important;}',
      '.vlxt-pill-badge{font-size:10.5px!important;font-weight:800!important;padding:1px 6px!important;border-radius:4px!important;}',
      '.vlxt-pill-badge.free{background:rgba(255,255,255,0.1)!important;color:#94a3b8!important;}',
      '.vlxt-pill-badge.pro{background:rgba(245,158,11,0.2)!important;color:#fbbf24!important;border:1px solid rgba(245,158,11,0.4)!important;}',
      '.vlxt-pill-chevron{font-size:10px!important;color:#94a3b8!important;margin-left:2px!important;transition:transform .28s var(--ux-spring,ease)!important;}',
      '.vlxt-pill-btn.is-open .vlxt-pill-chevron{transform:rotate(180deg)!important;}',
      '@media(max-width:420px){.vlxt-pill-btn{padding:4px 10px!important;gap:6px!important;}.vlxt-pill-name{font-size:12px!important;}.top-bar{padding:0 12px!important;}.nav-left-wrap{gap:8px!important;}.brand-glow-text{font-size:13.5px!important;}}',
      ddCSS
    ].join('');

    widget.innerHTML = '<style>' + inlineCSS + '</style>'
      + '<button type="button" id="vlxt-avatar-btn" class="vlxt-pill-btn" aria-haspopup="menu" aria-expanded="false" aria-controls="vlxt-dropdown" onclick="vlxtToggleDropdown(event)">'
      + '<span class="vlxt-dot-neon green"></span>'
      + '<span class="vlxt-pill-name">' + shortName + '</span>'
      + vipBadge
      + '<i class="fa-solid fa-chevron-down vlxt-pill-chevron"></i>'
      + '</button>' + ddHTML;
    navArea.appendChild(widget);

    if(isPaidLocal){
      document.querySelectorAll('a.nav-item-pro, .nav-item-pro').forEach(function(el){
        el.innerHTML = '👑 Gói Pro <span class="nav-pro-badge" style="background:rgba(16,185,129,0.22);color:#34d399;border:1px solid rgba(16,185,129,0.45)">ĐANG BẬT</span>';
      });
    }
  } else {
    return;
  }

  // Cập nhật LP từ GAS qua POST body (async, không chặn render, không lộ token trên URL)
  if(user && user.sdt) {
    var pFetch = (user.token)
      ? fetch(VLXT_GAS, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'getprofile', sdt: user.sdt, token: user.token })
        }).then(function(r){ return r.json(); }).then(function(d){
          if(d && d.ok && d.user) return d;
          return fetch(VLXT_GAS + '?type=profile&hs=' + encodeURIComponent(user.sdt)).then(function(r){ return r.json(); });
        }).catch(function(){
          return fetch(VLXT_GAS + '?type=profile&hs=' + encodeURIComponent(user.sdt)).then(function(r){ return r.json(); });
        })
      : fetch(VLXT_GAS + '?type=profile&hs=' + encodeURIComponent(user.sdt)).then(function(r){ return r.json(); });

    pFetch
      .then(function(d){
        if(d && d.ok){
          var lpEl=document.getElementById('vlxt-lp');
          var doneEl=document.getElementById('vlxt-done');
          if(lpEl) lpEl.textContent=(isNaN(Number(d.user.lpTotal))?0:(Number(d.user.lpTotal)||0));
          if(doneEl){
            var gasDone=(d.tiendo||[]).length;
            var best=Math.max(gasDone, vlxtLocalDoneCount(user.sdt));
            doneEl.textContent=best;
          }
          var fresh=Object.assign({},user,d.user);
          var wasPaidLocal = Boolean(
            user.isPaid ||
            user.loaiTK === 'pro' ||
            user.loaiTK === 'premium' ||
            (typeof localStorage !== 'undefined' && localStorage.getItem('vlxt_is_paid') === 'true')
          );
          var serverPaid = Boolean(
            d.user && (
              d.user.isPaid ||
              d.user.loaiTK === 'pro' ||
              d.user.loaiTK === 'premium' ||
              (d.user.loaiTK === 'vip' && Number(d.user.trialExpiry || 0) > Date.now() + 8 * 86400000)
            )
          );
          if((wasPaidLocal && (!user.proExpiry || user.proExpiry > Date.now())) || serverPaid) {
            fresh.isPaid = true;
            fresh.proExpiry = Number(d.user && d.user.proExpiry) || Number(user.proExpiry) || Number(d.user && d.user.trialExpiry) || (Date.now() + 30 * 86400000);
            if(fresh.loaiTK !== 'premium') {
              fresh.loaiTK = (user.loaiTK === 'premium' || (d.user && d.user.loaiTK === 'premium')) ? 'premium' : 'pro';
            }
            if(user.planCode && !fresh.planCode) fresh.planCode = user.planCode;
            if(user.planName && !fresh.planName) fresh.planName = user.planName;
            if(user.activatedAt && !fresh.activatedAt) fresh.activatedAt = user.activatedAt;
            if(user.lastPayment && !fresh.lastPayment) fresh.lastPayment = user.lastPayment;
            try { localStorage.setItem('vlxt_is_paid', 'true'); } catch(e){}
          }
          if(Array.isArray(d.payments) && d.payments.length > 0) {
            try {
              var existingHist = JSON.parse(localStorage.getItem('vlxt_payment_history') || '[]');
              if(!Array.isArray(existingHist)) existingHist = [];
              d.payments.forEach(function(p) {
                var pId = String(p.transactionId || p.maGD || p.orderId || '');
                var exists = pId && existingHist.some(function(x) { return String(x.transactionId || x.maGD || x.orderId || x.id || '') === pId; });
                if(!exists) existingHist.unshift(p);
              });
              localStorage.setItem('vlxt_payment_history', JSON.stringify(existingHist.slice(0, 50)));
            } catch(e){}
          }
          if(user.token && !fresh.token) fresh.token = user.token;
          vlxtSaveUser(fresh);
          if(fresh.loaiTK!==user.loaiTK || Number(fresh.trialExpiry||0)!==Number(user.trialExpiry||0) || Boolean(fresh.isPaid)!==Boolean(user.isPaid)){
            vlxtRenderWidget(fresh);
            window.dispatchEvent(new CustomEvent('vlxt:user-refreshed',{detail:fresh}));
          }
        }
      }).catch(function(){});
  }
}

// Click khi là Khách trải nghiệm
window.vlxtHandleGuestClick = function(e) {
  if (e) e.stopPropagation();
  try {
    if (window.VLXT_TELEMETRY) window.VLXT_TELEMETRY.setConversionTrigger('nav_guest_pill', 'Bấm nút Khách trải nghiệm trên thanh điều hướng');
  } catch (err) {}
  if (typeof vlxtShowLoginModal === 'function') {
    vlxtShowLoginModal();
  } else {
    var fromUrl = (window.location.pathname.split('/').pop() || 'index.html') + (window.location.search || '') + (window.location.hash || '');
    window.location.href = 'login.html?from=' + encodeURIComponent(fromUrl) + '&trigger=nav_guest_pill';
  }
};

document.addEventListener('DOMContentLoaded', function(){
  try{
    if(localStorage.getItem('vlxt_theme')==='dark') document.body.classList.add('dark');
  }catch(e){}
  vlxtEnsureLucianTokens();
  vlxtSyncRootThemeAttr();
  var user = vlxtGetUser();
  if(!document.getElementById('vlxt-user-widget')) vlxtRenderWidget(user);
});


// ── BỘ ĐIỀU HƯỚNG DRAWER DI ĐỘNG ĐỒNG NHẤT TOÀN HỆ THỐNG ──
function vlxtEnsureGlobalDrawer() {
  if (typeof document === 'undefined') return;

  window.toggleNavDrawer = function(show) {
    var drawer = document.getElementById('navDrawer') || document.getElementById('vlxt-global-drawer');
    var overlay = document.getElementById('navDrawerOverlay') || document.getElementById('vlxt-global-drawer-overlay');
    if (!drawer) return;
    var willOpen = (typeof show === 'boolean') ? show : !drawer.classList.contains('open');
    if (willOpen) {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('open');
      document.body.classList.add('nav-drawer-locked');
    } else {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('nav-drawer-locked');
    }
  };

  document.querySelectorAll('.nav-hamburger, #navHamburgerBtn').forEach(function(btn) {
    if (!btn.__vlxtBound) {
      btn.__vlxtBound = true;
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleNavDrawer(true);
      });
    }
  });

  if (!document.getElementById('navDrawer') && !document.getElementById('vlxt-global-drawer')) {
    var u = null;
    try { u = vlxtGetUser(); } catch(e){}
    var isPaid = Boolean(u && (u.isPaid || u.loaiTK === 'pro' || u.loaiTK === 'premium' || (typeof localStorage !== 'undefined' && localStorage.getItem('vlxt_is_paid') === 'true')));
    var curPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

    var drawerHTML = [
      '<div class="nav-drawer-overlay" id="vlxt-global-drawer-overlay" onclick="toggleNavDrawer(false)"></div>',
      '<aside class="nav-drawer" id="vlxt-global-drawer" aria-hidden="true">',
      '  <div class="nav-drawer-head">',
      '    <a href="index.html" class="ndh-brand">',
      '    <svg class="logo-atom-icon" width="46" height="24" viewBox="0 0 88 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;flex-shrink:0;"><path d="M4 8 H14 L24 23 L34 8 H44 L30 28 L45 48 H35 L24 33 L13 48 H3 L18 28 Z" fill="#00f0ff"/><path d="M46 8 H82 V15 H68 V48 H58 V15 H46 Z" fill="#00f0ff"/><g transform="translate(46, 28)"><circle cx="0" cy="0" r="3.2" fill="#00f0ff"/><ellipse cx="0" cy="0" rx="6.5" ry="14" stroke="#00f0ff" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="0" rx="6.5" ry="14" stroke="#38bdf8" stroke-width="1.6" fill="none" transform="rotate(60)"/><ellipse cx="0" cy="0" rx="6.5" ry="14" stroke="#38bdf8" stroke-width="1.6" fill="none" transform="rotate(-60)"/></g></svg>',
      '      <span>Vật Lý Xuân Trường</span>',
      '    </a>',
      '    <button class="nav-drawer-close" onclick="toggleNavDrawer(false)" aria-label="Đóng menu">✕</button>',
      '  </div>',
      '  <div class="nav-drawer-links" id="vlxt-drawer-links">',
      '    <a href="index.html"' + (curPath === 'index.html' ? ' class="active"' : '') + '>🏠 Trang Chủ</a>',
      '    <a href="danh-gia-nang-luc.html?v=20261124c"' + (curPath === 'danh-gia-nang-luc.html' ? ' class="active"' : '') + ' style="color:#00f0ff;font-weight:700">🎯 Test Điểm Thi Khảo Sát Quốc Gia</a>',
      '    <a href="baihoc.html"' + (curPath === 'baihoc.html' ? ' class="active"' : '') + '>📚 Khóa Học</a>',
      '    <a href="phong-thi-thu.html"' + (curPath === 'phong-thi-thu.html' ? ' class="active"' : '') + '>📋 Phòng Thi Thử</a>',
      '    <a href="huongdan.html"' + (curPath === 'huongdan.html' ? ' class="active"' : '') + '>🧭 Hướng Dẫn Học</a>',
      '    <a href="goi-hoc.html"' + (curPath === 'goi-hoc.html' ? ' class="active"' : '') + ' style="color:#fbbf24;font-weight:700">' + (isPaid ? '👑 Gói Pro Đang Bật' : '⭐ Gói Pro (50k/Tháng)') + '</a>',
      '    <a href="hoso.html"' + (curPath === 'hoso.html' ? ' class="active"' : '') + ' style="font-weight:700;color:#38bdf8">👤 Hồ Sơ Cá Nhân</a>',
      '    <a href="https://zalo.me/g/str1pllhp4uxa3rtvnou" target="_blank" rel="noopener" style="color:#60a5fa;font-weight:700" onclick="try{if(window.VLXT_TELEMETRY)window.VLXT_TELEMETRY.track(\'zalo_group_click\',{source:\'mobile_drawer\'});}catch(e){}">👥 Nhóm Zalo Thành Viên Web</a>',
      '    <a href="javascript:void(0)" onclick="toggleNavDrawer(false);if(typeof vlxtOpenFeedbackHub===\'function\')vlxtOpenFeedbackHub(\'bug\')">🛠️ Báo lỗi · Góp ý · Zalo Thầy</a>',
      '  </div>',
      '</aside>'
    ].join('\n');

    var drawerWrap = document.createElement('div');
    drawerWrap.id = 'vlxt-global-drawer-wrap';
    drawerWrap.innerHTML = drawerHTML;
    document.body.appendChild(drawerWrap);

    var dStyle = document.createElement('style');
    dStyle.id = 'vlxt-global-drawer-css';
    dStyle.textContent = [
      '.nav-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);z-index:99990;opacity:0;visibility:hidden;transition:all 0.25s;}',
      '.nav-drawer-overlay.open{opacity:1;visibility:visible;}',
      '.nav-drawer{position:fixed;top:0;left:0;bottom:0;width:82vw;max-width:300px;background:#0d1117;border-right:1px solid rgba(56,189,248,0.22);box-shadow:8px 0 32px rgba(0,0,0,0.8);z-index:99991;transform:translateX(-105%);transition:transform 0.28s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;font-family:\'Plus Jakarta Sans\',system-ui,sans-serif;}',
      '.nav-drawer.open{transform:translateX(0);}',
      '.nav-drawer-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);}',
      '.ndh-brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:#f8fafc;text-decoration:none;}',
      '.nav-drawer-close{background:rgba(255,255,255,0.06);border:none;color:#94a3b8;font-size:16px;width:32px;height:32px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
      '.nav-drawer-links{display:flex;flex-direction:column;gap:4px;padding:12px;overflow-y:auto;}',
      '.nav-drawer-links a{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;color:#cbd5e1;text-decoration:none;font-size:13.5px;font-weight:600;transition:background 0.15s;}',
      '.nav-drawer-links a:hover,.nav-drawer-links a.active{background:rgba(11,132,243,0.16);color:#38bdf8;}',
      'body.nav-drawer-locked{overflow:hidden;}'
    ].join('');
    document.head.appendChild(dStyle);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(vlxtEnsureGlobalDrawer, 50);
});

window.vlxtRenderWidget = vlxtRenderWidget;
window.vlxtToggleDropdown = vlxtToggleDropdown;
