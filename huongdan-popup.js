/* ═══════════════════════════════════════════
   HƯỚNG DẪN HỌC TẬP — popup video/text theo khu vực
   Thêm 17/8/2026. Dùng chung cho mọi trang: gọi
   vlxtAutoShowGuide('key') sau khi trang tải xong.
═══════════════════════════════════════════ */
(function(){
  const HD_GAS = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
  let _hdCache = null;

  function hdYtId(url){
    if(!url) return '';
    url = url.toString().trim();
    if(/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
    const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : '';
  }
  function hdEsc(s){ return (s==null?'':s).toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async function hdFetchAll(){
    if(_hdCache) return _hdCache;
    try{
      const r = await cachedFetch(HD_GAS + '?type=huongdan').then(r=>r.json());
      const map = {};
      (r.data||[]).forEach(row=>{ if(row.key) map[row.key] = row; });
      _hdCache = map;
    }catch(e){ _hdCache = {}; }
    return _hdCache;
  }

  function hdInjectCSS(){
    if(document.getElementById('vlxt-hd-css')) return;
    const css = document.createElement('style');
    css.id = 'vlxt-hd-css';
    css.textContent = `
      #vlxt-hd-overlay{position:fixed;inset:0;background:rgba(4,8,16,.78);backdrop-filter:blur(3px);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;animation:vlxtHdFade .15s ease-out}
      @keyframes vlxtHdFade{from{opacity:0}to{opacity:1}}
      #vlxt-hd-box{background:#0d1117;border:1px solid rgba(0,240,255,.25);border-radius:16px;max-width:640px;width:100%;max-height:88vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:'Inter',system-ui,sans-serif}
      #vlxt-hd-head{padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:12px}
      #vlxt-hd-head h3{margin:0;font-size:16px;font-weight:800;color:#e6edf3;display:flex;align-items:center;gap:8px}
      #vlxt-hd-close{background:rgba(255,255,255,.08);border:none;color:#c9d1d9;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;flex-shrink:0}
      #vlxt-hd-close:hover{background:rgba(255,255,255,.16);color:#fff}
      #vlxt-hd-body{padding:20px 22px 24px}
      .vlxt-hd-video{position:relative;width:100%;padding-top:56.25%;border-radius:12px;overflow:hidden;background:#000;margin-bottom:14px}
      .vlxt-hd-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
      #vlxt-hd-text{color:#c9d1d9;font-size:14px;line-height:1.6;white-space:pre-wrap}
      #vlxt-hd-ok{margin-top:18px;width:100%;padding:11px;background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}
      #vlxt-hd-ok:hover{opacity:.92}
      #vlxt-guide-fab{position:fixed;bottom:20px;right:20px;z-index:99998;width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;border:none;font-size:20px;cursor:pointer;box-shadow:0 4px 16px rgba(0,114,255,.45);display:flex;align-items:center;justify-content:center;transition:transform .15s}
      #vlxt-guide-fab:hover{transform:scale(1.08)}
      @media(max-width:480px){#vlxt-guide-fab{bottom:14px;right:14px;width:44px;height:44px;font-size:18px}}
    `;
    document.head.appendChild(css);
  }

  function hdCloseModal(){
    const ov = document.getElementById('vlxt-hd-overlay');
    if(ov) ov.remove();
  }

  function hdRenderModal(item){
    hdInjectCSS();
    hdCloseModal();
    const vid = hdYtId(item.videoUrl);
    const videoHtml = vid ? `<div class="vlxt-hd-video"><iframe src="https://www.youtube.com/embed/${vid}" title="Hướng dẫn" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen></iframe></div>` : '';
    const textHtml = item.noiDung ? `<div id="vlxt-hd-text">${hdEsc(item.noiDung)}</div>` : '';
    const overlay = document.createElement('div');
    overlay.id = 'vlxt-hd-overlay';
    overlay.innerHTML = `
      <div id="vlxt-hd-box">
        <div id="vlxt-hd-head">
          <h3>🎬 ${hdEsc(item.tieuDe || 'Hướng dẫn')}</h3>
          <button id="vlxt-hd-close" title="Đóng">✕</button>
        </div>
        <div id="vlxt-hd-body">
          ${videoHtml}
          ${textHtml}
          <button id="vlxt-hd-ok">Đã hiểu, bắt đầu thôi!</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) hdCloseModal(); });
    document.getElementById('vlxt-hd-close').onclick = hdCloseModal;
    document.getElementById('vlxt-hd-ok').onclick = hdCloseModal;
  }

  function hdAddFab(key, item){
    if(document.getElementById('vlxt-guide-fab')) return;
    const btn = document.createElement('button');
    btn.id = 'vlxt-guide-fab';
    btn.title = 'Xem lại hướng dẫn';
    btn.innerHTML = '❓';
    btn.onclick = function(){ hdRenderModal(item); };
    document.body.appendChild(btn);
  }

  // Hiện popup ngay (dùng khi cần ép hiện, vd sau đăng ký) — trả về true nếu có nội dung để hiện
  window.vlxtShowGuide = async function(key){
    const map = await hdFetchAll();
    const item = map[key];
    if(!item || (!item.videoUrl && !item.noiDung)) return false;
    hdRenderModal(item);
    return true;
  };

  // Tự hiện LẦN ĐẦU cho mỗi khu vực (nhớ bằng localStorage), luôn gắn nút ❓ để xem lại nếu có nội dung
  window.vlxtAutoShowGuide = async function(key){
    const map = await hdFetchAll();
    const item = map[key];
    if(!item || (!item.videoUrl && !item.noiDung)) return; // chưa có nội dung, không hiện gì cả
    hdAddFab(key, item);
    const seenKey = 'vlxt_guide_seen_' + key;
    if(!localStorage.getItem(seenKey)){
      hdRenderModal(item);
      try{ localStorage.setItem(seenKey, '1'); }catch(e){}
    }
  };
})();
