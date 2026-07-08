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
const VLXT_GAS = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

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
  const vipBadge = loaiTK === 'premium' ? '<span style="font-size:10px;font-weight:800;background:rgba(124,58,237,.2);color:#7c3aed;padding:1px 6px;border-radius:4px;margin-left:4px">💎</span>'
    : (loaiTK === 'vip' && msLeft > 0) ? `<span style="font-size:10px;font-weight:800;background:rgba(217,119,6,.2);color:#d97706;padding:1px 6px;border-radius:4px;margin-left:4px">⭐ ${daysLeft}d</span>`
    : '<span style="font-size:10px;font-weight:700;background:rgba(107,114,128,.15);color:#888;padding:1px 6px;border-radius:4px;margin-left:4px">Free</span>';

  // Số bài từ localStorage — hiện ngay, không cần chờ GAS
  const localDone = vlxtLocalDoneCount(user.sdt);

  const ddCSS=[
    '#vlxt-dropdown{display:none;position:absolute;top:calc(100% + 10px);right:0;',
    'background:#0d1117;border:1px solid rgba(0,240,255,0.2);border-radius:14px;',
    'padding:12px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.7);',
    'animation:vlxtDropIn 0.15s ease-out;z-index:99999;}',
    '@keyframes vlxtDropIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}',
    '#vlxt-dropdown.open{display:block;}',
    '.vlxt-user-name{font-size:14px;font-weight:700;color:#e6edf3;margin-bottom:2px;}',
    '.vlxt-user-meta{font-size:12px;color:#8b949e;margin-bottom:10px;}',
    '.vlxt-stats{display:flex;gap:8px;margin-bottom:10px;}',
    '.vlxt-stat{flex:1;background:rgba(0,240,255,0.07);border:1px solid rgba(0,240,255,0.15);border-radius:8px;padding:6px 8px;text-align:center;}',
    '.vlxt-stat-val{font-size:15px;font-weight:800;color:#00f0ff;}',
    '.vlxt-stat-label{font-size:10px;color:#8b949e;margin-top:1px;}',
    '.vlxt-nav-links{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;}',
    '.vlxt-nav-link{display:block;padding:7px 10px;border-radius:8px;font-size:13px;color:#c9d1d9;text-decoration:none;transition:background 0.1s;}',
    '.vlxt-nav-link:hover{background:rgba(255,255,255,0.07);color:#fff;}',
    '.vlxt-divider{border:none;border-top:1px solid rgba(255,255,255,0.08);margin:8px 0;}',
    '.vlxt-theme-btn{width:100%;padding:7px 10px;border-radius:8px;border:none;background:rgba(255,255,255,0.05);color:#c9d1d9;font-size:13px;font-weight:600;cursor:pointer;text-align:left;transition:background 0.1s;font-family:inherit;margin-bottom:8px;}',
    '.vlxt-theme-btn:hover{background:rgba(255,255,255,0.1);}',
    '.vlxt-logout-btn{width:100%;padding:7px 10px;border-radius:8px;border:none;background:rgba(239,68,68,0.12);color:#f87171;font-size:13px;font-weight:600;cursor:pointer;text-align:left;transition:background 0.1s;font-family:inherit;}',
    '.vlxt-logout-btn:hover{background:rgba(239,68,68,0.22);}',
    '@media(max-width:600px){#vlxt-dropdown{right:auto;left:50%;transform:translateX(-50%);min-width:200px;max-width:90vw;}}'
  ].join('');

  // Nhãn nút đổi giao diện, đọc trạng thái dark hiện tại của trang (đã được set từ
  // sớm bởi script chống nháy màn hình ở đầu mỗi trang) để hiển thị đúng ngay từ đầu.
  var _isDarkNow = document.body.classList.contains('dark');
  var _themeLabel = _isDarkNow ? '☀️ Chuyển sang giao diện sáng' : '🌙 Chuyển sang giao diện tối';

  const ddHTML='<div id="vlxt-dropdown">'
    +'<div class="vlxt-user-name">'+user.hoten+'</div>'
    +'<div class="vlxt-user-meta">Lớp '+user.lop+' \xb7 '+user.sdt+'</div>'
    +'<div class="vlxt-stats">'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-lp">'+(isNaN(Number(user.lpTotal))?0:(Number(user.lpTotal)||0))+'</div><div class="vlxt-stat-label">⚡ LP</div></div>'
    +'<div class="vlxt-stat"><div class="vlxt-stat-val" id="vlxt-done">'+localDone+'</div><div class="vlxt-stat-label">📚 B\xe0i học</div></div>'
    +'</div>'
    +'<button type="button" class="vlxt-theme-btn" id="vlxt-theme-btn" onclick="vlxtToggleTheme(event)">'+_themeLabel+'</button>'
    +'<div class="vlxt-nav-links">'
    +'<a href="index.html" class="vlxt-nav-link">🏠 Trang chủ</a>'
    +'<a href="baihoc.html" class="vlxt-nav-link">📚 Kh\xf3a học</a>'
    +'<a href="danhsach-ly12.html" class="vlxt-nav-link">📝 Đề thi</a>'
    +'<a href="trochoi.html" class="vlxt-nav-link">🎮 Tr\xf2 chơi</a>'
    +'<a href="hoso.html" class="vlxt-nav-link">👤 Hồ sơ & Xếp hạng</a>'+'<a href="dua-top.html" class="vlxt-nav-link" style="color:#fbbf24;font-weight:700">🏆 Đua Top</a>'
    +'</div><hr class="vlxt-divider">'
    +'<button class="vlxt-logout-btn" onclick="vlxtLogout()">↩ Đăng xuất</button>'
    +'</div>';

  if(navArea){
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
  } else {
    var fixedCSS=[
      '#vlxt-user-widget{position:fixed;top:12px;right:12px;z-index:99999;font-family:\'Inter\',system-ui,sans-serif;}',
      '#vlxt-avatar-btn{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#0072ff,#00f0ff);',
      'border:2px solid rgba(0,240,255,0.4);color:#fff;font-size:14px;font-weight:700;cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;',
      'box-shadow:0 2px 12px rgba(0,114,255,0.4);transition:transform 0.15s;user-select:none;}',
      '#vlxt-avatar-btn:hover{transform:scale(1.08);}',
      ddCSS
    ].join('');
    widget.innerHTML='<style>'+fixedCSS+'</style>'
      +'<div id="vlxt-avatar-btn" onclick="vlxtToggleDropdown()" title="'+user.hoten+'">'+initials+'</div>'
      +ddHTML;
    document.body.appendChild(widget);
  }

  // Cập nhật LP từ GAS (async, không chặn render)
  // Cập nhật LP từ GAS (async, không chặn render)
  fetch(VLXT_GAS+'?type=profile&hs='+encodeURIComponent(user.sdt))
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
        vlxtSaveUser(Object.assign({},user,{lpTotal:d.user.lpTotal}));
      }
    }).catch(function(){});
}

document.addEventListener('DOMContentLoaded',function(){
  var user=vlxtGetUser();
  if(user&&!document.getElementById('vlxt-user-widget')) vlxtRenderWidget(user);
});
