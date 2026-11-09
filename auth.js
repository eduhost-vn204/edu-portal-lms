/* ═══════════════════════════════════════════
   AUTH MODULE — Vật Lý Xuân Trường
═══════════════════════════════════════════ */

/* Theme toggle — định nghĩa sớm để onclick="toggleTheme()" luôn hoạt động */
function toggleTheme(){
  document.body.classList.toggle('dark');
  try{ localStorage.setItem('vlxt_theme', document.body.classList.contains('dark')?'dark':'light'); }catch(e){}
}
(function(){ try{ if(localStorage.getItem('vlxt_theme')==='dark') document.body.classList.add('dark'); }catch(e){} })();
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

function vlxtToggleDropdown(){
  const dd=document.getElementById('vlxt-dropdown');
  if(dd) dd.classList.toggle('open');
}

// Đổi giao diện sáng/tối DÙNG CHUNG cho mọi trang (gọi từ menu dropdown avatar).
// Lưu vào cùng 1 key localStorage 'vlxt_theme' mà mọi trang đều đọc khi tải →
// đảm bảo trạng thái sáng/tối luôn đồng bộ khi chuyển qua lại giữa các trang.
function vlxtToggleTheme(e){
  if(e) e.stopPropagation();
  const isDark = document.body.classList.toggle('dark');
  document.documentElement.classList.toggle('dark', isDark);
  try{ localStorage.setItem('vlxt_theme', isDark ? 'dark' : 'light'); }catch(err){}
  const btn = document.getElementById('vlxt-theme-btn');
  if(btn) btn.textContent = isDark ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';
}
window.vlxtToggleTheme = vlxtToggleTheme;

document.addEventListener('click',function(e){
  const w=document.getElementById('vlxt-user-widget');
  if(w&&!w.contains(e.target)){ const dd=document.getElementById('vlxt-dropdown'); if(dd) dd.classList.remove('open'); }
});

// Đọc số bài đã học từ localStorage (chính xác hơn GAS)
function vlxtLocalDoneCount(sdt){
  try{
    var arr=JSON.parse(localStorage.getItem('vlxt_watched_'+sdt)||'[]');
    return Array.isArray(arr)?arr.length:0;
  }catch{ return 0; }
}

// Render widget — inline nếu có #vlxt-nav-user-area, fixed nếu không
function vlxtRenderWidget(user){
  if(!user) return;
  // Trong phòng thi thử CBT (thithu.html), không hiện widget nổi để học sinh tập trung tối đa làm bài
  if(window.location.pathname.includes('thithu.html')) return;
  const ex=document.getElementById('vlxt-user-widget');
  if(ex) ex.remove();

  const initials=(user.hoten||'HS').split(' ').map(w=>w[0]).slice(-2).join('').toUpperCase();
  const words=(user.hoten||'Học sinh').trim().split(/\s+/);
  const shortName=words.slice(-2).join(' ');
  const navArea=document.getElementById('vlxt-nav-user-area');
  const widget=document.createElement('div');
  widget.id='vlxt-user-widget';

  // VIP badge
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
  const vipBadge = loaiTK === 'premium' ? '<span style="font-size:10px;font-weight:800;background:rgba(124,58,237,.25);color:#c4b5fd;padding:1px 6px;border-radius:4px;margin-left:4px">💎 VIP</span>'
    : isPaidLocal ? '<span style="font-size:10px;font-weight:800;background:rgba(16,185,129,.22);color:#34d399;padding:1px 6px;border-radius:4px;margin-left:4px">👑 PRO</span>'
    : (loaiTK === 'vip' && msLeft > 0) ? `<span style="font-size:10px;font-weight:800;background:rgba(217,119,6,.2);color:#d97706;padding:1px 6px;border-radius:4px;margin-left:4px">⭐ ${daysLeft}d</span>`
    : '<span style="font-size:10px;font-weight:700;background:rgba(107,114,128,.15);color:#888;padding:1px 6px;border-radius:4px;margin-left:4px">Free</span>';

  // Số bài từ localStorage — hiện ngay, không cần chờ GAS
  const localDone = vlxtLocalDoneCount(user.sdt);

  const ddCSS=[
    '#vlxt-dropdown{display:none;position:absolute;top:calc(100% + 8px);right:0;',
    'background:#0f172a;border:1px solid rgba(0,240,255,0.25);border-radius:14px;',
    'padding:14px;min-width:230px;max-width:280px;box-shadow:0 12px 36px rgba(0,0,0,0.75);',
    'animation:vlxtDropIn 0.15s ease-out;z-index:99999;}',
    '@keyframes vlxtDropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}',
    '#vlxt-dropdown.open{display:block;}',
    '.vlxt-user-name{font-size:14.5px;font-weight:700;color:#f8fafc;margin-bottom:2px;display:flex;align-items:center;justify-content:space-between;}',
    '.vlxt-user-meta{font-size:11.5px;color:#94a3b8;margin-bottom:12px;}',
    '.vlxt-stats{display:flex;gap:8px;margin-bottom:12px;}',
    '.vlxt-stat{flex:1;background:rgba(15,23,42,0.8);border:1px solid rgba(0,240,255,0.2);border-radius:8px;padding:6px 8px;text-align:center;}',
    '.vlxt-stat-val{font-size:15px;font-weight:800;color:#00f0ff;}',
    '.vlxt-stat-label{font-size:10.5px;color:#94a3b8;margin-top:2px;}',
    '.vlxt-nav-links{display:flex;flex-direction:column;gap:5px;margin-bottom:10px;}',
    '.vlxt-nav-link{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:600;color:#e2e8f0;text-decoration:none;transition:background 0.15s;}',
    '.vlxt-nav-link:hover{background:rgba(255,255,255,0.08);color:#fff;}',
    '.vlxt-divider{border:none;border-top:1px solid rgba(255,255,255,0.1);margin:10px 0;}',
    '.vlxt-theme-btn{width:100%;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.05);color:#cbd5e1;font-size:12.5px;font-weight:600;cursor:pointer;text-align:left;transition:background 0.15s;font-family:inherit;margin-bottom:8px;}',
    '.vlxt-theme-btn:hover{background:rgba(255,255,255,0.1);color:#fff;}',
    '.vlxt-logout-btn{width:100%;padding:8px 10px;border-radius:8px;border:none;background:rgba(239,68,68,0.12);color:#f87171;font-size:12.5px;font-weight:600;cursor:pointer;text-align:left;transition:background 0.15s;font-family:inherit;}',
    '.vlxt-logout-btn:hover{background:rgba(239,68,68,0.25);color:#fca5a5;}',
    '@media(max-width:600px){#vlxt-dropdown{right:0;left:auto;min-width:220px;max-width:92vw;}}'
  ].join('');

  // Nhãn nút đổi giao diện, đọc trạng thái dark hiện tại của trang (đã được set từ
  // sớm bởi script chống nháy màn hình ở đầu mỗi trang) để hiển thị đúng ngay từ đầu.
  var _isDarkNow = document.body.classList.contains('dark');
  var _themeLabel = _isDarkNow ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';

  const ddHTML='<div id="vlxt-dropdown">'
    +'<div class="vlxt-user-name"><span>'+user.hoten+'</span>'+vipBadge+'</div>'
    +'<div class="vlxt-user-meta">Lớp '+(user.lop || '12')+' · '+(user.sdt || '')+'</div>'
    +'<div class="vlxt-stats">'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-lp">'+(isNaN(Number(user.lpTotal))?0:(Number(user.lpTotal)||0))+'</div><div class="vlxt-stat-label">⚡ LP</div></div>'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-done">'+localDone+'</div><div class="vlxt-stat-label">📚 Bài học</div></div>'
    +'</div>'
    +'<button type="button" class="vlxt-theme-btn" id="vlxt-theme-btn" onclick="vlxtToggleTheme(event)">'+_themeLabel+'</button>'
    +'<div class="vlxt-nav-links">'
    +'<a href="hoso.html" class="vlxt-nav-link" style="color:#38bdf8;font-weight:700">👤 Hồ sơ cá nhân</a>'
    +(isPaidLocal ? '<a href="goi-hoc.html" class="vlxt-nav-link" style="color:#34d399;font-weight:700">👑 Gói Pro đang dùng</a>' : '<a href="goi-hoc.html" class="vlxt-nav-link" style="color:#fbbf24;font-weight:700">⭐ Nâng cấp Gói Pro (50k)</a>')
    +'<a href="huongdan.html" class="vlxt-nav-link">🧭 Hướng dẫn học tập</a>'
    +'</div><hr class="vlxt-divider">'
    +'<button class="vlxt-logout-btn" onclick="vlxtLogout()">↩ Đăng xuất</button>'
    +'</div>';

  if(navArea){
    navArea.innerHTML = ''; // Dọn sạch fallback đăng nhập
    var inlineCSS=[
      '#vlxt-user-widget{position:relative;font-family:\'Inter\',system-ui,sans-serif;}',
      '#vlxt-avatar-btn{display:flex;align-items:center;gap:8px;padding:5px 12px 5px 6px;background:rgba(0,114,255,0.08);border:1.5px solid rgba(0,114,255,0.25);border-radius:50px;cursor:pointer;user-select:none;transition:all 0.15s;}',
      '#vlxt-avatar-btn:hover{background:rgba(0,114,255,0.15);border-color:rgba(0,114,255,0.5);}',
      '#vlxt-avatar-circle{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
      // Mac dinh la chu TOI (vi da so trang co nen SANG khi chua bat dark mode) —
      // truoc day mac dinh la mau sang (#e6edf3) => chu 'trang mo' tren nen sang,
      // gan nhu khong doc duoc o moi trang (tru index.html co gan san thuoc tinh
      // data-vlxt-nav="light" de vá rieng). Gio sua tan goc: mac dinh toi, dark mode
      // (body.dark) moi chuyen sang sang, ap dung dung cho TAT CA cac trang.
      '#vlxt-avatar-name{font-size:13px;font-weight:600;color:#0f0f0f;white-space:nowrap;}',
      '#vlxt-nav-user-area[data-vlxt-nav="light"] #vlxt-avatar-name{color:#0f0f0f;}',
      'body.dark #vlxt-avatar-btn{background:linear-gradient(135deg,rgba(0,114,255,0.2),rgba(0,240,255,0.1));border-color:rgba(0,240,255,0.4);}',
      'body.dark #vlxt-avatar-name{color:#e6edf3!important;}',
      ddCSS
    ].join('');
    widget.innerHTML='<style>'+inlineCSS+'</style>'
      +'<div id="vlxt-avatar-btn" onclick="vlxtToggleDropdown()">'
      +'<div id="vlxt-avatar-circle">'+initials+'</div>'
      +'<span id="vlxt-avatar-name">'+shortName+vipBadge+'</span>'
      +'</div>'+ddHTML;
    navArea.appendChild(widget);
    if(isPaidLocal){
      document.querySelectorAll('a.nav-item-pro').forEach(function(el){
        el.innerHTML = '👑 Gói Pro <span class="nav-pro-badge" style="background:rgba(16,185,129,0.22);color:#34d399;border:1px solid rgba(16,185,129,0.45)">ĐANG BẬT</span>';
      });
    }
  } else {
    var fixedCSS=[
      '#vlxt-user-widget{position:fixed;top:72px;right:16px;z-index:99999;font-family:\'Inter\',system-ui,sans-serif;}',
      '#vlxt-avatar-btn{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#0072ff,#00f0ff);',
      'border:2px solid rgba(0,240,255,0.4);color:#fff;font-size:13.5px;font-weight:700;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 3px 14px rgba(0,114,255,0.35);transition:transform 0.15s;user-select:none;}',
      '#vlxt-avatar-btn:hover{transform:scale(1.08);}',
      ddCSS
    ].join('');
    widget.innerHTML='<style>'+fixedCSS+'</style>'
      +'<div id="vlxt-avatar-btn" onclick="vlxtToggleDropdown()" title="'+user.hoten+'">'+initials+'</div>'
      +ddHTML;
    document.body.appendChild(widget);
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
      .then(function(r){return r.json();}).then(function(d){
        if(d.ok){
          var lpEl=document.getElementById('vlxt-lp');
          var doneEl=document.getElementById('vlxt-done');
          if(lpEl) lpEl.textContent=(isNaN(Number(d.user.lpTotal))?0:(Number(d.user.lpTotal)||0));
          // Lấy max giữa GAS và localStorage (tránh hiện số thấp hơn thực tế)
          if(doneEl){
            var gasDone=(d.tiendo||[]).length;
            var best=Math.max(gasDone, vlxtLocalDoneCount(user.sdt));
            doneEl.textContent=best;
          }
          // Đồng bộ toàn bộ hồ sơ, đặc biệt loaiTK/trialExpiry sau khi admin nâng cấp.
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

document.addEventListener('DOMContentLoaded',function(){
  var user=vlxtGetUser();
  if(user&&!document.getElementById('vlxt-user-widget')) vlxtRenderWidget(user);
});


// ── BỘ ĐIỀU HƯỚNG DRAWER DI ĐỘNG ĐỒNG NHẤT TOÀN HỆ THỐNG ──
function vlxtEnsureGlobalDrawer() {
  if (typeof document === 'undefined') return;

  // Cung cấp toggleNavDrawer toàn cục để các trang luôn hoạt động đồng nhất
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

  // Đảm bảo các nút .nav-hamburger hoặc #navHamburgerBtn luôn kích hoạt toggleNavDrawer
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

  // Nếu trang chưa có navDrawer, tự động tạo Drawer đồng bộ chuẩn VLXT
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
      '      <span style="font-size:18px">⚛️</span>',
      '      <span>Vật Lý Xuân Trường</span>',
      '    </a>',
      '    <button class="nav-drawer-close" onclick="toggleNavDrawer(false)" aria-label="Đóng menu">✕</button>',
      '  </div>',
      '  <div class="nav-drawer-links" id="vlxt-drawer-links">',
      '    <a href="index.html"' + (curPath === 'index.html' ? ' class="active"' : '') + '>🏠 Trang Chủ</a>',
      '    <a href="danh-gia-nang-luc.html"' + (curPath === 'danh-gia-nang-luc.html' ? ' class="active"' : '') + ' style="color:#00f0ff;font-weight:700">🎯 Đánh Giá Năng Lực (Free)</a>',
      '    <a href="baihoc.html"' + (curPath === 'baihoc.html' ? ' class="active"' : '') + '>📚 Khóa Học Vật Lý 12</a>',
      '    <a href="goi-hoc.html"' + (curPath === 'goi-hoc.html' ? ' class="active"' : '') + ' style="color:#fbbf24;font-weight:700">' + (isPaid ? '👑 Gói Học Đang Bật' : '⭐ Gói Học (50k/Tháng)') + '</a>',
      '    <a href="live-record.html"' + (curPath === 'live-record.html' ? ' class="active"' : '') + ' style="color:#f87171">📡 Live Class & Xem Lại</a>',
      '    <a href="phong-thi-thu.html"' + (curPath === 'phong-thi-thu.html' ? ' class="active"' : '') + '>📋 Phòng Thi Thử (Chuẩn Bộ)</a>',
      '    <a href="danhsach-ly12.html"' + (curPath === 'danhsach-ly12.html' ? ' class="active"' : '') + '>📝 Phòng Kiểm Tra (Theo bài)</a>',
      '    <a href="dau-thuong-hud.html"' + (curPath === 'dau-thuong-hud.html' || curPath === 'dau-thuong.html' ? ' class="active"' : '') + ' style="color:#00f0ff">⚔️ Đấu Thường (PvP)</a>',
      '    <a href="dua-top.html"' + (curPath === 'dua-top.html' ? ' class="active"' : '') + ' style="color:#fbbf24">🏆 Đấu Hạng (Đua Top)</a>',
      '    <a href="solo.html"' + (curPath === 'solo.html' ? ' class="active"' : '') + ' style="color:#f472b6">🎯 Solo (1vs1)</a>',
      '    <a href="huongdan.html"' + (curPath === 'huongdan.html' ? ' class="active"' : '') + '>🧭 Hướng Dẫn</a>',
      '    <a href="hoso.html"' + (curPath === 'hoso.html' ? ' class="active"' : '') + ' style="font-weight:700;color:#38bdf8">👤 Hồ Sơ Cá Nhân</a>',
      '  </div>',
      '</aside>'
    ].join('\n');

    var drawerWrap = document.createElement('div');
    drawerWrap.id = 'vlxt-global-drawer-wrap';
    drawerWrap.innerHTML = drawerHTML;
    document.body.appendChild(drawerWrap);

    // CSS chuẩn cho Global Drawer
    var dStyle = document.createElement('style');
    dStyle.id = 'vlxt-global-drawer-css';
    dStyle.textContent = [
      '.nav-drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);z-index:99990;opacity:0;visibility:hidden;transition:all 0.25s;}',
      '.nav-drawer-overlay.open{opacity:1;visibility:visible;}',
      '.nav-drawer{position:fixed;top:0;left:0;bottom:0;width:82vw;max-width:300px;background:#0d1117;border-right:1px solid rgba(0,240,255,0.2);box-shadow:8px 0 32px rgba(0,0,0,0.8);z-index:99991;transform:translateX(-105%);transition:transform 0.28s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;font-family:\'Plus Jakarta Sans\',system-ui,sans-serif;}',
      '.nav-drawer.open{transform:translateX(0);}',
      '.nav-drawer-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);}',
      '.ndh-brand{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15px;color:#f8fafc;text-decoration:none;}',
      '.nav-drawer-close{background:rgba(255,255,255,0.06);border:none;color:#94a3b8;font-size:16px;width:32px;height:32px;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
      '.nav-drawer-links{display:flex;flex-direction:column;gap:4px;padding:12px;overflow-y:auto;}',
      '.nav-drawer-links a{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;color:#cbd5e1;text-decoration:none;font-size:13.5px;font-weight:600;transition:background 0.15s;}',
      '.nav-drawer-links a:hover,.nav-drawer-links a.active{background:rgba(0,240,255,0.12);color:#00f0ff;}',
      'body.nav-drawer-locked{overflow:hidden;}'
    ].join('');
    document.head.appendChild(dStyle);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(vlxtEnsureGlobalDrawer, 50);
});
