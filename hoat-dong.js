/* ═══ VLXT — Ghi lịch sử hoạt động học sinh (hiện trong Admin > Tài khoản HS > bấm vào 1 tài khoản) ═══ */
(function(){
  const GAS = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
  function getUser(){ try{ return JSON.parse(localStorage.getItem('vlxt_user_v2')||'null'); }catch(e){ return null; } }

  function send(hanhdong, chitiet){
    const u = getUser(); if(!u || !u.sdt) return;
    try{
      fetch(GAS, { method:'POST', mode:'cors', keepalive:true,
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({ action:'loghoatdong', sdt:u.sdt, hanhdong:String(hanhdong||''), chitiet:String(chitiet||'') }) }).catch(function(){});
    }catch(e){}
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
