/* ═══ VLXT — Ghi lịch sử hoạt động học sinh (hiện trong Admin > Tài khoản HS > bấm vào 1 tài khoản) ═══ */
(function(){
  const GAS = 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';
  function getUser(){ try{ return JSON.parse(localStorage.getItem('vlxt_user_v2')||'null'); }catch(e){ return null; } }

  // ── Chỉ gửi log khi Apps Script đã có v50 (tránh doPost fallback ghi rác vào Bảng Vàng) ──
  // Cách dò: GET ?type=hoatdong KHÔNG kèm adminKey → v50 trả {error:'Unauthorized'}, bản cũ trả đề thi.
  let _ok = null;            // null = chưa biết, true/false = đã dò xong
  let _queue = [];
  (function checkV50(){
    try{
      const cached = JSON.parse(localStorage.getItem('vlxt_logok')||'null');
      if (cached && Date.now() - cached.t < 30*60*1000){ _ok = !!cached.ok; if(_ok) flush(); else _queue=[]; return; }
    }catch(e){}
    fetch(GAS + '?type=hoatdong&hs=ping').then(function(r){ return r.json(); }).then(function(d){
      _ok = !!(d && (d.error === 'Unauthorized' || d.ok === false && d.msg));
      localStorage.setItem('vlxt_logok', JSON.stringify({ ok:_ok, t:Date.now() }));
      if (_ok) flush(); else _queue = [];
    }).catch(function(){ _ok = false; _queue = []; });
  })();
  function flush(){ const q=_queue; _queue=[]; q.forEach(function(a){ post(a[0],a[1]); }); }
  function post(hanhdong, chitiet){
    const u = getUser(); if(!u || !u.sdt) return;
    try{
      fetch(GAS, { method:'POST', mode:'cors', keepalive:true,
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ action:'loghoatdong', sdt:u.sdt, hanhdong:String(hanhdong||''), chitiet:String(chitiet||'') }) }).catch(function(){});
    }catch(e){}
  }
  function send(hanhdong, chitiet){
    if (_ok === true) post(hanhdong, chitiet);
    else if (_ok === null) _queue.push([hanhdong, chitiet]);
    // _ok === false → GAS chưa cập nhật v50, bỏ qua để không ghi rác
  }
  window.vlxtLog = send;

  // Tự ghi "Vào trang" — mỗi trang tối đa 1 lần / 30 phút / 1 tài khoản
  const PAGE_NAMES = { '':'Trang chủ', 'index.html':'Trang chủ', 'baihoc.html':'Khóa học',
    'thithu.html':'Thi thử', 'danhsach-ly12.html':'Danh sách đề', 'hoso.html':'Hồ sơ',
    'live.html':'Xem Live', 'lichlive.html':'Lịch Live', 'dua-top.html':'Đua Top',
    'trochoi.html':'Trò chơi', 'huongdan.html':'Hướng dẫn', 'login.html':'Trang đăng nhập' };
  try{
    const page = (location.pathname.split('/').pop()||'').toLowerCase();
    if (page === 'login.html') return; // login ghi sự kiện riêng
    const u = getUser();
    if (u && u.sdt){
      const k = 'vlxt_actlog_' + page + '_' + u.sdt;
      const last = Number(localStorage.getItem(k)||0);
      if (Date.now() - last > 30*60*1000){
        localStorage.setItem(k, String(Date.now()));
        send('Vào trang', PAGE_NAMES[page] || page);
      }
    }
  }catch(e){}
})();
/* === TELEMETRY & BEHAVIOR TRACKING === */
(function(){
  if (window.vlxtTelemetryInited) return;
  window.vlxtTelemetryInited = true;
  
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pageLoadTime = Date.now();
  let isFirstClick = !sessionStorage.getItem('vlxt_first_click_done');
  let hasLoggedSkip = false;

  document.addEventListener('click', function(e){
    try {
      let link = e.target.closest('a[href]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          const isOrganic = !link.classList.contains('btn-next') && !link.classList.contains('system-suggested');
          const prefix = isOrganic ? 'T? do' : '�? xu?t';
          
          if (isFirstClick && page === 'index.html') {
            sessionStorage.setItem('vlxt_first_click_done', 'true');
            isFirstClick = false;
            window.vlxtLog('Click HUD d?u ti�n', prefix + ' -> ' + href);
          }
        }
      }

      let tabBtn = e.target.closest('.lt-tab-btn, .tab-btn');
      if (tabBtn) {
        const tabName = tabBtn.textContent.trim();
        if (page === 'baihoc.html' && (tabName.toLowerCase().includes('b�i t?p') || tabName.toLowerCase().includes('tr?c nghi?m'))) {
           const timeSinceLoad = Date.now() - pageLoadTime;
           if (timeSinceLoad < 60000 && !hasLoggedSkip) { 
               hasLoggedSkip = true;
               window.vlxtLog('Nh?y c�c b�i t?p', 'Sau ' + Math.round(timeSinceLoad/1000) + 's t? l�c m? b�i');
           }
        }
      }
    } catch(err) {}
  });

  let activeTime = 0;
  let lastTick = Date.now();
  const updateActiveTime = () => {
     if (!document.hidden) {
        activeTime += (Date.now() - lastTick);
     }
     lastTick = Date.now();
  };
  document.addEventListener('visibilitychange', () => { updateActiveTime(); });
  window.addEventListener('beforeunload', () => {
     updateActiveTime();
     const seconds = Math.round(activeTime / 1000);
     if (seconds >= 30) {
        window.vlxtLog('Th?i gian d?ng', page + ' | ' + seconds + ' gi�y');
     }
  });
})();
