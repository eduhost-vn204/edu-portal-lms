/* ============================================================
   cache.js v5 - Toc do TUC THI cho web Vat Ly Xuan Truong (mien phi)
   (A) stale-while-revalidate: mo trang HIEN NGAY du lieu lan truoc
       (localStorage, 0 giay), dong thoi tai moi ngam de lan sau dung.
   (B) uu tien JSON tinh tren GitHub Pages cho du lieu cong khai.
   (C) du lieu ca nhan van cache rieng theo URL, khong xuat ra JSON cong khai.
   (D) rieng 'lichlive' refresh ngam nhanh hon. Khi
       phat hien du lieu MOI (khac ban cu), tu dispatch event
       'vlxt:data-updated' de trang tu ve lai KHONG CAN bam reload.
   Cach dung KHONG DOI: van goi cachedFetch(url).then(r=>r.json())
   Trang muon tu-refresh: window.addEventListener('vlxt:data-updated', function(e){
     if (e.detail.type === 'lichlive') { ... ve lai voi e.detail.data ... }
   });
   ============================================================ */
(function () {
  var FRESH_MS = 180000;       // 3 phut: mac dinh cho cac loai du lieu khac
  var MAX_STALE_MS = 86400000; // 24 gio: qua han nay thi PHAI cho du lieu moi

  // Rieng vai loai du lieu can "gan nhu tuc thi" (da co auto-refresh backend)
  // FIX 19/8: leaderboard tung la 5000 (5s) - qua day, vuot yeu cau toi da 1 request/phut/tab.
  // Doi sang 90s; dong bo tuc thi giua cac trang van dam bao qua event 'vlxt:data-updated'
  // duoi day (khong can revalidate ngam nhanh nua).
  var FRESH_MS_OVERRIDE = { lichlive: 8000, leaderboard: 90000 };

  var REQUEST_TIMEOUT_MS = 15000;
  var STATIC_TYPES = { danhsachde: 1, baihoc: 1, khoaconfig: 1, lichlive: 1,
    settings: 1, huongdan: 1 };

  function keyOf(url) {
    return 'vlxt_cache_' + url.replace(/([?&])t=\d+/g, '').replace(/[?&]$/, '');
  }
  function typeOf(url) {
    var m = url.match(/[?&]type=([a-z0-9_]+)/i);
    return m ? m[1].toLowerCase() : '';
  }
  function staticUrlFor(url) {
    var t = typeOf(url);
    return STATIC_TYPES[t] ? ('data/' + t + '.json') : null;
  }

  function fetchJson(url) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (controller) controller.abort(); }, REQUEST_TIMEOUT_MS);
    return fetch(url, controller ? { signal: controller.signal } : undefined).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).finally(function () { clearTimeout(timer); });
  }
  function freshMsFor(url) {
    var t = typeOf(url);
    return FRESH_MS_OVERRIDE.hasOwnProperty(t) ? FRESH_MS_OVERRIDE[t] : FRESH_MS;
  }

  function wrap(data, ok) {
    return {
      ok: ok !== false,
      json: function () { return Promise.resolve(data); },
      text: function () { return Promise.resolve(JSON.stringify(data)); }
    };
  }

  function revalidate(url, key) {
    var type = typeOf(url);
    var staticUrl = staticUrlFor(url);
    var prevRaw = null;
    try { prevRaw = localStorage.getItem(key); } catch (e) {}

    var p = staticUrl
      ? fetch(staticUrl, { cache: 'no-store' }).then(function (r) {
          if (!r.ok) throw new Error('static ' + r.status);
          return r.json();
        }).catch(function () {
          return fetchJson(url);
        })
      : fetchJson(url);

    return p.then(function (data) {
      var newRaw = JSON.stringify(data);
      var changed = true;
      try {
        if (prevRaw) {
          var prevObj = JSON.parse(prevRaw);
          changed = JSON.stringify(prevObj.data) !== newRaw;
        }
      } catch (e) {}

      try { localStorage.setItem(key, JSON.stringify({ time: Date.now(), data: data })); } catch (e) {}

      if (changed && type && prevRaw) {
        try {
          window.dispatchEvent(new CustomEvent('vlxt:data-updated', { detail: { type: type, url: url, data: data } }));
        } catch (e) {}
      }
      return data;
    });
  }

  window.cachedFetch = function (url) {
    var key = keyOf(url);
    var hit = null;
    try { hit = JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) {}
    var age = hit ? (Date.now() - hit.time) : Infinity;

    if (hit && age < MAX_STALE_MS) {
      if (age >= freshMsFor(url)) { revalidate(url, key).catch(function () {}); }
      return Promise.resolve(wrap(hit.data));
    }

    return revalidate(url, key).then(function (data) { return wrap(data); })
      .catch(function () {
        if (hit) return wrap(hit.data);
        return fetchJson(url).then(function (d) { return wrap(d); });
      });
  };

  window.clearVlxtCache = function () {
    try {
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf('vlxt_cache_') === 0; })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  };

  /* FIX 19/8: poll dinh ky nhung CHI khi tab dang hien (document.visibilityState==='visible'),
     tranh spam GAS khi nguoi dung mo nhieu tab/de tab nen (yeu cau: khong qua 1 request/phut/tab
     khi trang dang hien, dung han khi an tab). Khi tab an roi hien lai va da qua >= intervalMs
     ke tu lan goi truoc, goi ngay 1 lan de khong phai cho het chu ky. Dung cho leaderboard va
     cac vong lap poll ngam khac muon tiet kiem request. */
  window.vlxtVisiblePoll = function (fn, intervalMs) {
    var last = Date.now();
    function tick() {
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      last = Date.now();
      try { fn(); } catch (e) {}
    }
    var timer = setInterval(tick, intervalMs);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible' && (Date.now() - last) >= intervalMs) tick();
      });
    }
    return timer;
  };

  /* Menu dieu huong cho dien thoai. Tu dong lay cac muc da co tren thanh menu
     cua tung trang, nen cac trang van dung chung mot giao dien va khong anh
     huong den menu tren may tinh. */
  function setupMobileMenu() {
    var linksBox = document.querySelector('.nav-links') || document.querySelector('header .nav');
    if (!linksBox || document.getElementById('vlxt-mobile-menu')) return;

    var bar = linksBox.closest('header, nav');
    if (!bar) return;
    /* Các trang đã có drawer riêng (bản GitHub mới nhất) giữ nguyên giao diện đó. */
    if (bar.querySelector('.nav-hamburger')) return;

    var menu = document.createElement('aside');
    menu.id = 'vlxt-mobile-menu';
    menu.className = 'vlxt-mobile-menu';
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = '<div class="vlxt-mobile-menu__head"><strong>Điều hướng</strong><button type="button" class="vlxt-mobile-menu__close" aria-label="Đóng menu"><i class="fa-solid fa-xmark"></i></button></div><nav class="vlxt-mobile-menu__links"></nav>';

    var menuLinks = menu.querySelector('.vlxt-mobile-menu__links');
    var hasHome = false;
    Array.prototype.forEach.call(linksBox.querySelectorAll('a[href]'), function (link) {
      var item = link.cloneNode(true);
      if ((item.getAttribute('href') || '').indexOf('index.html') === 0) hasHome = true;
      menuLinks.appendChild(item);
    });
    if (!hasHome) {
      var home = document.createElement('a');
      home.href = 'index.html';
      home.innerHTML = '<i class="fa-solid fa-house"></i> Trang chủ';
      menuLinks.insertBefore(home, menuLinks.firstChild);
    }

    var overlay = document.createElement('button');
    overlay.type = 'button';
    overlay.className = 'vlxt-mobile-menu__overlay';
    overlay.setAttribute('aria-label', 'Đóng menu');

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'vlxt-mobile-menu__trigger';
    trigger.setAttribute('aria-label', 'Mở menu điều hướng');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<i class="fa-solid fa-bars"></i>';

    var right = bar.querySelector(':scope > .nav-right');
    if (right) bar.insertBefore(trigger, right); else bar.appendChild(trigger);
    document.body.appendChild(overlay);
    document.body.appendChild(menu);

    function closeMenu() {
      menu.classList.remove('is-open'); overlay.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true'); trigger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('vlxt-menu-open');
    }
    function openMenu() {
      menu.classList.add('is-open'); overlay.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false'); trigger.setAttribute('aria-expanded', 'true');
      document.body.classList.add('vlxt-menu-open'); menu.querySelector('a, button').focus();
    }
    trigger.addEventListener('click', function () { menu.classList.contains('is-open') ? closeMenu() : openMenu(); });
    overlay.addEventListener('click', closeMenu);
    menu.querySelector('.vlxt-mobile-menu__close').addEventListener('click', closeMenu);
    menuLinks.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeMenu(); });
  }

  function addMobileMenuStyles() {
    var style = document.createElement('style');
    style.textContent = '.vlxt-mobile-menu__trigger,.vlxt-mobile-menu,.vlxt-mobile-menu__overlay{display:none}@media(max-width:760px){body.vlxt-menu-open{overflow:hidden}.navbar .nav-links,header .nav{display:none!important}.vlxt-mobile-menu__trigger{display:inline-flex!important;align-items:center;justify-content:center;width:40px;height:40px;flex:0 0 40px;padding:0;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#1f2937;font-size:18px;cursor:pointer}.dark .vlxt-mobile-menu__trigger,body.dark .vlxt-mobile-menu__trigger{background:#161b22;color:#e6edf3;border-color:#30363d}.vlxt-mobile-menu__overlay{position:fixed;inset:0;z-index:900;background:rgba(15,23,42,.45);border:0;opacity:0;transition:opacity .22s}.vlxt-mobile-menu__overlay.is-open{display:block;opacity:1}.vlxt-mobile-menu{display:block;position:fixed;top:0;left:0;bottom:0;z-index:901;width:min(82vw,330px);padding:18px 16px;background:#fff;color:#111827;box-shadow:12px 0 36px rgba(15,23,42,.22);transform:translateX(-105%);transition:transform .24s ease;overflow-y:auto}.vlxt-mobile-menu.is-open{transform:translateX(0)}body.dark .vlxt-mobile-menu,.dark .vlxt-mobile-menu{background:#0d1117;color:#e6edf3}.vlxt-mobile-menu__head{display:flex;align-items:center;justify-content:space-between;padding:2px 4px 16px;border-bottom:1px solid #e5e7eb;font-size:17px}.dark .vlxt-mobile-menu__head,body.dark .vlxt-mobile-menu__head{border-color:#30363d}.vlxt-mobile-menu__close{width:36px;height:36px;border:0;border-radius:9px;background:#f1f5f9;color:#334155;font-size:20px;cursor:pointer}.dark .vlxt-mobile-menu__close,body.dark .vlxt-mobile-menu__close{background:#21262d;color:#e6edf3}.vlxt-mobile-menu__links{display:flex!important;flex-direction:column!important;gap:4px!important;padding-top:14px}.vlxt-mobile-menu__links a{display:flex!important;align-items:center;gap:11px;min-height:46px;padding:11px 12px!important;border-radius:9px!important;color:#334155!important;background:transparent!important;font-size:15px!important;font-weight:650!important;text-decoration:none!important}.vlxt-mobile-menu__links a.active,.vlxt-mobile-menu__links a:hover{color:#0b84f3!important;background:rgba(11,132,243,.10)!important}.dark .vlxt-mobile-menu__links a,body.dark .vlxt-mobile-menu__links a{color:#c9d1d9!important}.navbar .nav-left{min-width:0}.navbar .nav-right{gap:8px!important}.navbar .nav-right .nav-btn{display:none!important}}';
    document.head.appendChild(style);
  }

  addMobileMenuStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupMobileMenu);
  else setupMobileMenu();
})();
