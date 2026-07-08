/* ============================================================
   cache.js v4 - Toc do TUC THI cho web Vat Ly Xuan Truong (mien phi)
   (A) stale-while-revalidate: mo trang HIEN NGAY du lieu lan truoc
       (localStorage, 0 giay), dong thoi tai moi ngam de lan sau dung.
   (B) uu tien JSON tinh tren GitHub Pages (~50ms) thay cho goi GAS (~1.6s)
       CHO danhsachde/baihoc (it doi, khong gap).
   (C) 'lichlive' KHONG dung file tinh (tu v4): GitHub Pages CDN (Fastly)
       co the mat vai phut moi cap nhat file tinh sau khi da commit xong
       tren GitHub - ngoai tam kiem soat. Du lieu lichlive rat it (vai
       dong) nen goi thang GAS moi lan, nhanh va LUON dung nhat.
   (D) rieng 'lichlive' refresh ngam nhanh hon (8s thay vi 3 phut). Khi
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
  var FRESH_MS_OVERRIDE = { lichlive: 8000 };

  // 'lichlive' KHONG dung file tinh nua: GitHub Pages CDN (Fastly) co the
  // mat vai phut de cap nhat file tinh sau moi lan deploy, ngoai tam kiem
  // soat cua minh. Du lieu lichlive it (vai dong) nen goi thang GAS moi lan
  // nhanh hon va LUON dung nhat, khong can cho CDN.
  var STATIC_TYPES = { danhsachde: 1, baihoc: 1 };

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
          return fetch(url).then(function (r) { return r.json(); });
        })
      : fetch(url).then(function (r) { return r.json(); });

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
        return fetch(url).then(function (r) { return r.json(); }).then(function (d) { return wrap(d); });
      });
  };

  window.clearVlxtCache = function () {
    try {
      Object.keys(localStorage)
        .filter(function (k) { return k.indexOf('vlxt_cache_') === 0; })
        .forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  };
})();
