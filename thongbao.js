/* ═══════════════════════════════════════════════════════════
   CHUÔNG THÔNG BÁO — Vật Lý Xuân Trường  v1.0
   Hiện cạnh widget hồ sơ (#vlxt-nav-user-area) trên mọi trang.
   Gộp 2 nguồn: Lịch Live sắp tới + Nhiệm vụ hôm nay.
   Luôn fetch mới mỗi lần tải trang (không cache theo ngày) nên
   nội dung tự cập nhật hằng ngày — không cần bấm gì thêm.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GAS = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';

  function today() { return new Date().toISOString().slice(0, 10); }

  function normKey(s) {
    return (s == null ? '' : s).toString().toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');
  }
  function fieldOf(row, names) {
    for (var k in row) {
      var nk = normKey(k);
      for (var i = 0; i < names.length; i++) { if (nk === normKey(names[i])) return row[k]; }
    }
    return '';
  }

  function parseVnDate(str) {
    if (!str) return null;
    var p = (str + '').split('/').map(Number);
    if (p.length !== 3 || !p[0] || !p[1] || !p[2]) return null;
    return new Date(p[2], p[1] - 1, p[0]);
  }

  function injectCSS() {
    if (document.getElementById('vlxt-tb-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-tb-css';
    s.textContent = [
      '.vlxt-tb-wrap{position:relative;display:inline-flex;align-items:center;margin-right:6px;}',
      '.vlxt-tb-btn{position:relative;background:none;border:none;cursor:pointer;',
      'padding:7px 9px;border-radius:8px;color:#555;font-size:16px;display:inline-flex;',
      'align-items:center;transition:color .15s,background .15s;}',
      '.vlxt-tb-btn:hover{background:rgba(11,132,243,.1);color:var(--blue,#0b84f3);}',
      'body.dark .vlxt-tb-btn{color:#8b949e;}',
      'body.dark .vlxt-tb-btn:hover{color:#00f0ff;background:rgba(0,240,255,.08);}',
      '.vlxt-tb-dot{position:absolute;top:5px;right:6px;width:8px;height:8px;border-radius:50%;',
      'background:#ef4444;border:1.5px solid var(--bg,#fff);display:none;}',
      '.vlxt-tb-dot.show{display:block;}',
      '.vlxt-tb-panel{display:none;position:absolute;top:calc(100% + 10px);right:0;width:320px;',
      'max-width:88vw;max-height:420px;overflow-y:auto;background:#0d1117;',
      'border:1px solid rgba(0,240,255,.2);border-radius:14px;padding:10px;',
      'box-shadow:0 8px 32px rgba(0,0,0,.55);z-index:99999;animation:vlxtTbIn .15s ease-out;}',
      '.vlxt-tb-panel.open{display:block;}',
      '@keyframes vlxtTbIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}',
      '.vlxt-tb-head{font-size:13px;font-weight:800;color:#e6edf3;padding:6px 8px 8px;',
      'border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:6px;}',
      '.vlxt-tb-item{display:block;padding:9px 8px;border-radius:10px;text-decoration:none;',
      'margin-bottom:4px;transition:background .15s;}',
      '.vlxt-tb-item:hover{background:rgba(0,240,255,.07);}',
      '.vlxt-tb-item .t{font-size:12.5px;font-weight:700;color:#00f0ff;margin-bottom:2px;}',
      '.vlxt-tb-item .m{font-size:12.5px;color:#e6edf3;line-height:1.4;}',
      '.vlxt-tb-item .s{font-size:11px;color:#8b949e;margin-top:2px;}',
      '.vlxt-tb-empty{padding:16px 8px;text-align:center;font-size:12.5px;color:#8b949e;}'
    ].join('');
    document.head.appendChild(s);
  }

  function esc(s) {
    return (s == null ? '' : s + '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function mount() {
    var navArea = document.getElementById('vlxt-nav-user-area');
    if (!navArea || !navArea.parentNode) return null;
    if (document.getElementById('vlxt-tb-wrap')) return document.getElementById('vlxt-tb-wrap');
    injectCSS();
    var wrap = document.createElement('div');
    wrap.className = 'vlxt-tb-wrap';
    wrap.id = 'vlxt-tb-wrap';
    wrap.innerHTML =
      '<button class="vlxt-tb-btn" id="vlxt-tb-btn" title="Thông báo">' +
        '<span aria-hidden="true">🔔</span><span class="vlxt-tb-dot" id="vlxt-tb-dot"></span>' +
      '</button>' +
      '<div class="vlxt-tb-panel" id="vlxt-tb-panel">' +
        '<div class="vlxt-tb-head">🔔 Thông báo</div>' +
        '<div id="vlxt-tb-list"><div class="vlxt-tb-empty">Đang tải...</div></div>' +
      '</div>';
    navArea.parentNode.insertBefore(wrap, navArea);
    document.getElementById('vlxt-tb-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      document.getElementById('vlxt-tb-panel').classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      var p = document.getElementById('vlxt-tb-panel');
      if (p && !wrap.contains(e.target)) p.classList.remove('open');
    });
    return wrap;
  }

  function fetchWatchedSet(sdt) {
    var watched = new Set();
    try {
      (JSON.parse(localStorage.getItem('vlxt_watched_' + sdt) || '[]')).forEach(function (k) { watched.add(k); });
    } catch (e) {}
    return fetch(GAS + '?type=tiendo&hs=' + encodeURIComponent(sdt) + '&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var arr = Array.isArray(data) ? data : (data.tiendo || data.data || []);
        arr.forEach(function (it) {
          var k = (typeof it === 'string') ? it : fieldOf(it, ['lesson', 'bai', 'key']);
          if (k) watched.add(k.toString());
        });
        return watched;
      }).catch(function () { return watched; });
  }

  function keyOf(l) {
    return (l.KhoaHoc || '') + '|||' + (l.Chuong || '') + '|||' + (l.TenBai || '');
  }

  function findTeacherIdx(xps, teachingKey) {
    if (!teachingKey) return -1;
    for (var i = 0; i < xps.length; i++) {
      if (keyOf(xps[i]) === teachingKey) return i;
    }
    return -1;
  }

  // Đồng bộ với nhiem-vu.js: bài chưa có video vẫn tính là "nợ" nếu nằm
  // trong phạm vi thầy đã dạy tới (i <= teacherIdx) — tránh báo sai "đã
  // xong nhiệm vụ" khi cả khoá chưa có video nào (vd học sinh mới tạo TK).
  function computeRealConTro(xps, watched, teacherIdx) {
    for (var i = 0; i < xps.length; i++) {
      var l = xps[i];
      var key = keyOf(l);
      var hasVideo = !!(l.Video || l.video || l.link);
      if (!watched.has(key)) {
        if (hasVideo) return i;
        if (teacherIdx >= 0 && i <= teacherIdx) return i;
      }
    }
    return xps.length;
  }

  function buildMissionItem(user) {
    return fetch(GAS + '?type=nhiemvu&hs=' + encodeURIComponent(user.sdt))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var nv = (data && data.ok) ? data.data : null;
        if (!nv || !nv.nhipHoc) {
          return {
            html: '<a class="vlxt-tb-item" href="index.html"><div class="t">📋 Nhiệm vụ hôm nay</div>' +
              '<div class="m">Chưa thiết lập lộ trình học — vào trang chủ để bắt đầu.</div></a>',
            urgent: false
          };
        }
        return Promise.all([
          fetch(GAS + '?type=baihoc').then(function (r) { return r.json(); }).catch(function () { return []; }),
          fetch(GAS + '?type=khoaconfig').then(function (r) { return r.json(); }).catch(function () { return []; }),
          fetch(GAS + '?type=settings').then(function (r) { return r.json(); }).catch(function () { return {}; }),
          fetchWatchedSet(user.sdt)
        ]).then(function (res) {
          var allL = Array.isArray(res[0]) ? res[0] : [];
          var khoaRaw = Array.isArray(res[1]) ? res[1] : (res[1].data || []);
          var settings = (res[2] && res[2].ok) ? (res[2].data || {}) : {};
          var watchedSet = res[3];
          var teachingKey = settings.currentTeachingLesson || '';
          var khoaMap = {};
          khoaRaw.forEach(function (k) { khoaMap[k.khoaHoc] = k; });
          var xps = allL.filter(function (l) {
            var cfg = khoaMap[l.KhoaHoc || ''];
            return cfg && (cfg.daKhaiGiang === true || String(cfg.daKhaiGiang) === 'true');
          }).sort(function (a, b) {
            var cfgA = khoaMap[a.KhoaHoc] || {}, cfgB = khoaMap[b.KhoaHoc] || {};
            var ta = parseInt(cfgA.thuTu) || 999, tb = parseInt(cfgB.thuTu) || 999;
            if (ta !== tb) return ta - tb;
            var ma = (a.Chuong || '').match(/\d+/), mb = (b.Chuong || '').match(/\d+/);
            return (ma ? parseInt(ma[0]) : 0) - (mb ? parseInt(mb[0]) : 0);
          });
          var teacherIdx = findTeacherIdx(xps, teachingKey);
          var realConTro = computeRealConTro(xps, watchedSet, teacherIdx);
          var todayS = today();
          var doneToday = nv.lastMissionDate === todayS &&
            (function () { try { return localStorage.getItem('vlxt_missionShown_' + user.sdt + '_' + todayS) === '1'; } catch (e) { return false; } })();

          // Dòng "thầy đang dạy đến bài nào + còn bao nhiêu buổi để bắt kịp"
          var teacherLine = '';
          if (teacherIdx >= 0) {
            var tLesson = xps[teacherIdx];
            var behind = teacherIdx - realConTro; // dương = học sinh đang chậm hơn thầy
            var behindTxt = behind > 0
              ? ('📍 Thầy đang dạy: ' + esc(tLesson.TenBai || '') + ' · Còn ' + behind + ' buổi để bắt kịp thầy')
              : ('📍 Thầy đang dạy: ' + esc(tLesson.TenBai || '') + ' · Bạn đã bắt kịp thầy!');
            teacherLine = '<div class="s">' + behindTxt + '</div>';
          }

          if (realConTro >= xps.length) {
            return {
              html: '<a class="vlxt-tb-item" href="dua-top.html"><div class="t">🏆 Đua Top</div>' +
                '<div class="m">Đã hoàn thành mọi bài hiện có — vào Đua Top để rinh điểm!</div>' +
                (nv.chuoiDung ? '<div class="s">🔥 Chuỗi ' + Number(nv.chuoiDung) + ' ngày</div>' : '') +
                teacherLine + '</a>',
              urgent: false
            };
          }
          var lesson = xps[realConTro];
          var lessonName = lesson ? (lesson.TenBai || 'Buổi học') : '';
          return {
            html: '<a class="vlxt-tb-item" href="baihoc.html"><div class="t">📋 Nhiệm vụ hôm nay</div>' +
              '<div class="m">Buổi ' + (realConTro + 1) + '/' + xps.length + (lessonName ? ': ' + esc(lessonName) : '') + '</div>' +
              '<div class="s">' + (doneToday ? '✅ Đã xem hôm nay' : '⏰ Chưa hoàn thành hôm nay') + '</div>' +
              teacherLine + '</a>',
            urgent: !doneToday
          };
        });
      }).catch(function () {
        return { html: '', urgent: false };
      });
  }

  function buildLiveItems() {
    return fetch(GAS + '?type=lichlive&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var all = Array.isArray(data) ? data : [];
        var now = new Date(); now.setHours(0, 0, 0, 0);
        var limit = new Date(now.getTime() + 3 * 86400000 + 86399999); // +3 ngày, tới cuối ngày
        var items = all.filter(function (s) { return !s.done; })
          .map(function (s) { return { s: s, dt: parseVnDate(s.date) }; })
          .filter(function (x) { return x.dt && x.dt >= now && x.dt <= limit; })
          .sort(function (a, b) { return a.dt - b.dt; });
        var urgent = items.some(function (x) { return (x.dt.getTime() - now.getTime()) <= 86400000; });
        var html = items.map(function (x) {
          var dd = String(x.dt.getDate()).padStart(2, '0'), mm = String(x.dt.getMonth() + 1).padStart(2, '0');
          return '<a class="vlxt-tb-item" href="lichlive.html"><div class="t">📡 Lịch Live</div>' +
            '<div class="m">' + esc(x.s.title || '') + '</div>' +
            '<div class="s">' + dd + '/' + mm + ' · ' + esc(x.s.time || '') + '</div></a>';
        }).join('');
        return { html: html, urgent: urgent };
      }).catch(function () { return { html: '', urgent: false }; });
  }

  function init() {
    var user = (typeof vlxtGetUser === 'function') ? vlxtGetUser() : null;
    if (!user || !user.sdt) return;
    var wrap = mount();
    if (!wrap) return;

    Promise.all([buildLiveItems(), buildMissionItem(user)]).then(function (parts) {
      var liveHtml = parts[0].html, missionHtml = parts[1].html;
      var anyUrgent = parts[0].urgent || parts[1].urgent;
      var list = document.getElementById('vlxt-tb-list');
      var dot = document.getElementById('vlxt-tb-dot');
      var html = missionHtml + liveHtml;
      list.innerHTML = html || '<div class="vlxt-tb-empty">Chưa có thông báo mới.</div>';
      if (dot) dot.classList.toggle('show', !!anyUrgent);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); });
  } else {
    setTimeout(init, 200);
  }
  window.vlxtThongBaoInit = init;

})()