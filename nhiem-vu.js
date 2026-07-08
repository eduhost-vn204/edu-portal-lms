/* ═══════════════════════════════════════════════════════════
   NHIỆM VỤ HỌC MỖI NGÀY — Vật Lý Xuân Trường  v1.0
   Tự động khởi động khi trang load xong và học sinh đã đăng nhập.
═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GAS = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
  var EXAM_DATE = new Date('2027-06-05'); // Mốc thi THPT QG 2027 (ước tính)

  // ─── State toàn cục ───────────────────────────────────────
  var _state = null; // { nv, xps, user }
  var _selectedNhip = 0;

  // ─── Tiện ích ─────────────────────────────────────────────
  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysLeft() {
    return Math.max(1, Math.ceil((EXAM_DATE - new Date()) / 86400000));
  }

  function gasPost(body) {
    return fetch(GAS, { method: 'POST', body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false }; });
  }

  // ─── Tiến độ THẬT (đồng bộ với baihoc.html) ────────────────
  // conTro không còn là bộ đếm tự bấm — được tính lại từ dữ liệu
  // "đã xem/đã làm bài đạt" thật sự (GAS type=tiendo), y hệt nguồn
  // dùng để vẽ % trên thẻ khoá học ở baihoc.html.
  function normKey(s) {
    return (s == null ? '' : s).toString().toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]/g, '');
  }

  function fieldOf(row, names) {
    for (var k in row) {
      var nk = normKey(k);
      for (var i = 0; i < names.length; i++) {
        if (nk === normKey(names[i])) return row[k];
      }
    }
    return '';
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
      })
      .catch(function () { return watched; });
  }

  // Vị trí bài ĐẦU TIÊN trong lộ trình XPS mà học sinh CHƯA hoàn thành thật
  function computeRealConTro(xps, watched) {
    // Chỉ tính "đang nợ buổi" nếu bài đó ĐÃ CÓ VIDEO mà chưa xem.
    // Bài chưa có video (thầy chưa kịp cập nhật) không được tính là chặn tiến độ —
    // nếu không học sinh sẽ mãi mãi "chưa kịp tiến độ" dù đã học hết phần đã sẵn sàng.
    for (var i = 0; i < xps.length; i++) {
      var l = xps[i];
      var key = (l.KhoaHoc || '') + '|||' + (l.Chuong || '') + '|||' + (l.TenBai || '');
      var hasVideo = !!(l.Video || l.video || l.link);
      if (!watched.has(key)) {
        if (hasVideo) return i; // bài có video mà chưa xem → đây mới là buổi đang nợ thật
        // bài chưa có video → bỏ qua, không chặn tiến độ
      }
    }
    return xps.length; // đã xem hết mọi bài ĐÃ CÓ VIDEO → coi như bắt kịp tiến độ, mở Đua Top
  }

  // ─── CSS một lần ─────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('vlxt-nv-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-nv-css';
    s.textContent = [
      /* Overlay / popup */
      '#vlxt-nv-overlay{display:none;position:fixed;inset:0;z-index:999990;',
      'background:rgba(0,0,20,.85);backdrop-filter:blur(6px);',
      'align-items:center;justify-content:center;}',
      '#vlxt-nv-overlay.open{display:flex;}',
      '#vlxt-nv-card{background:linear-gradient(135deg,#0d1117,#0d1b2a);',
      'border:1.5px solid rgba(0,240,255,.3);border-radius:20px;',
      'padding:48px 52px 40px;max-width:820px;width:96%;',
      'box-shadow:0 20px 60px rgba(0,114,255,.3);',
      'animation:nvCardIn .2s ease-out;max-height:90vh;overflow-y:auto;}',
      '@keyframes nvCardIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}',
      '.nv-title{font-size:28px;font-weight:800;color:#00f0ff;margin-bottom:5px;}',
      '.nv-sub{font-size:16px;color:#8b949e;margin-bottom:22px;line-height:1.5;}',
      '.nv-lesson-card{background:rgba(0,240,255,.06);border:1px solid rgba(0,240,255,.18);',
      'border-radius:14px;padding:20px 24px;margin-bottom:16px;}',
      '.nv-lesson-name{font-size:20px;font-weight:700;color:#e6edf3;margin-bottom:3px;}',
      '.nv-lesson-meta{font-size:15px;color:#8b949e;}',
      '.nv-chips{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;}',
      '.nv-chip{padding:7px 16px;border-radius:20px;font-size:15px;font-weight:700;',
      'background:rgba(0,240,255,.1);color:#00f0ff;border:1px solid rgba(0,240,255,.2);}',
      '.nv-chip.warn{background:rgba(251,191,36,.1);color:#fbbf24;border-color:rgba(251,191,36,.3);}',
      '.nv-chip.ok{background:rgba(52,211,153,.1);color:#34d399;border-color:rgba(52,211,153,.3);}',
      '.nv-progress-wrap{margin:10px 0;}',
      '.nv-progress-label{font-size:14px;color:#8b949e;margin-bottom:7px;',
      'display:flex;justify-content:space-between;}',
      '.nv-progress-bar{height:10px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;}',
      '.nv-progress-fill{height:100%;background:linear-gradient(90deg,#0072ff,#00f0ff);',
      'border-radius:99px;transition:width .6s ease;}',
      '.nv-btn-row{display:flex;gap:8px;margin-top:16px;}',
      '.nv-btn{flex:1;padding:18px;border:none;border-radius:14px;font-size:18px;',
      'font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s;}',
      '.nv-btn-primary{background:linear-gradient(135deg,#0072ff,#00c6ff);color:#fff;}',
      '.nv-btn-primary:hover{opacity:.88;transform:translateY(-1px);}',
      '.nv-btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;}',
      '.nv-btn-secondary{background:rgba(255,255,255,.06);color:#8b949e;',
      'border:1px solid rgba(255,255,255,.1);}',
      '.nv-btn-secondary:hover{background:rgba(255,255,255,.1);color:#e6edf3;}',
      '.nv-nhip-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0;}',
      '.nv-nhip-btn{padding:22px 14px;border:1.5px solid rgba(0,240,255,.2);',
      'border-radius:12px;background:rgba(0,240,255,.05);color:#e6edf3;',
      'font-size:14px;font-weight:700;cursor:pointer;text-align:center;',
      'font-family:inherit;transition:all .15s;line-height:1.4;}',
      '.nv-nhip-btn:hover,.nv-nhip-btn.sel{border-color:#00f0ff;',
      'background:rgba(0,240,255,.15);color:#00f0ff;}',
      '.nv-nhip-sub{font-size:14px;font-weight:400;color:#8b949e;display:block;}',
      /* Banner sticky */
      '#vlxt-mission-banner{position:fixed;bottom:16px;right:16px;z-index:99980;',
      'background:linear-gradient(135deg,#0d1b2a,#0d1117);',
      'border:1px solid rgba(0,240,255,.3);border-radius:14px;',
      'padding:9px 14px;display:flex;align-items:center;gap:9px;',
      'box-shadow:0 4px 20px rgba(0,114,255,.3);cursor:pointer;',
      'transition:all .15s;font-family:\'Inter\',system-ui,sans-serif;',
      'max-width:240px;animation:nvBanIn .3s ease-out;}',
      '@keyframes nvBanIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
      '#vlxt-mission-banner:hover{border-color:#00f0ff;transform:translateY(-2px);}',
      '.nvb-icon{font-size:18px;flex-shrink:0;}',
      '.nvb-text{flex:1;min-width:0;}',
      '.nvb-title{font-size:12px;font-weight:700;color:#e6edf3;white-space:nowrap;',
      'overflow:hidden;text-overflow:ellipsis;}',
      '.nvb-close{width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.1);',
      'color:#8b949e;border:none;cursor:pointer;font-size:10px;line-height:16px;',
      'flex-shrink:0;font-family:inherit;padding:0;display:inline-flex;',
      'align-items:center;justify-content:center;}',
      '@media(max-width:480px){',
      '#vlxt-nv-card{padding:28px 22px 22px;}',
      '.nv-title{font-size:22px;}',
      '#vlxt-mission-banner{bottom:10px;right:10px;left:10px;max-width:none;}}'
    ].join('');
    document.head.appendChild(s);
  }

  // ─── Overlay helpers ──────────────────────────────────────
  function getOrCreateOverlay() {
    var o = document.getElementById('vlxt-nv-overlay');
    if (!o) {
      o = document.createElement('div');
      o.id = 'vlxt-nv-overlay';
      o.addEventListener('click', function (e) {
        if (e.target === o) window.vlxtCloseNhiemVu();
      });
      document.body.appendChild(o);
    }
    return o;
  }

  function openOverlay(html) {
    var o = getOrCreateOverlay();
    o.innerHTML = '<div id="vlxt-nv-card">' + html + '</div>';
    o.classList.add('open');
  }

  function closeOverlay() {
    var o = document.getElementById('vlxt-nv-overlay');
    if (o) o.classList.remove('open');
  }

  // ─── 1. Chọn nhịp học (lần đầu) ─────────────────────────
  function showNhipHocSelector(user) {
    injectCSS();
    openOverlay(
      '<div class="nv-title">📚 Thiết lập lộ trình</div>' +
      '<div class="nv-sub">Chào ' + (user.hoten || '').split(' ').pop() + '!<br>' +
      'Bạn muốn học mấy ngày mỗi tuần để kịp thi THPT 2027?</div>' +
      '<div class="nv-nhip-grid">' +
        '<button class="nv-nhip-btn" onclick="vlxtSelectNhip(this,3)">3 ngày<span class="nv-nhip-sub">Thứ 2·4·6</span></button>' +
        '<button class="nv-nhip-btn" onclick="vlxtSelectNhip(this,5)">5 ngày<span class="nv-nhip-sub">Thứ 2–6</span></button>' +
        '<button class="nv-nhip-btn" onclick="vlxtSelectNhip(this,7)">7 ngày<span class="nv-nhip-sub">Mỗi ngày</span></button>' +
      '</div>' +
      '<div id="nv-nhip-hint" style="font-size:11px;color:#8b949e;text-align:center;min-height:16px;margin-bottom:12px"></div>' +
      '<div class="nv-btn-row">' +
        '<button class="nv-btn nv-btn-secondary" onclick="vlxtCloseNhiemVu()">Để sau</button>' +
        '<button class="nv-btn nv-btn-primary" id="nv-btn-confirm" disabled onclick="vlxtConfirmNhip()">Bắt đầu →</button>' +
      '</div>'
    );
  }

  // ─── 2. Popup nhiệm vụ hằng ngày ────────────────────────
  // teachingKey = "KhoaHoc|||Chuong|||TenBai" từ setting của thầy
  function showMissionPopup(nv, xps, user, teachingKey, streakToday) {
    injectCSS();
    var conTro  = Number(nv.conTro) || 0;
    var total   = xps.length;
    var pct     = total > 0 ? Math.round(conTro / total * 100) : 0;
    var lesson  = xps[conTro] || null;
    var dlDays  = daysLeft();

    // Tính học chậm so với lịch tự đặt
    var nhip      = Number(nv.nhipHoc) || 5;
    var startD    = nv.startDate || today();
    var daysPast  = Math.max(0, Math.floor((new Date() - new Date(startD)) / 86400000));
    var expected  = Math.min(Math.floor(daysPast / 7 * nhip), total);
    var cham      = Math.max(0, expected - conTro);

    // Tìm vị trí thầy đang dạy trong lộ trình XPS
    var teacherIdx = -1;
    if (teachingKey) {
      for (var ti = 0; ti < xps.length; ti++) {
        var tKey = (xps[ti].KhoaHoc || '') + '|||' + (xps[ti].Chuong || '') + '|||' + (xps[ti].TenBai || '');
        if (tKey === teachingKey) { teacherIdx = ti; break; }
      }
    }

    // Khối "Thầy đang dạy đến" + chiến lược
    var teacherHtml = '';
    if (teacherIdx >= 0) {
      var tLesson = xps[teacherIdx];
      var diff    = conTro - teacherIdx; // dương = em trước thầy, âm = em chậm hơn thầy
      var strategyText;
      if (diff > 0) {
        strategyText = '🚀 Em đang học <strong>trước thầy ' + diff + ' buổi</strong> — rất tốt! Ôn lại phần đã học để nắm chắc hơn.';
      } else if (diff === 0) {
        strategyText = '✅ Em đang học <strong>đúng tiến độ thầy</strong> — giữ vững nhịp này nhé!';
      } else if (diff >= -5) {
        strategyText = '⏰ Em chậm hơn thầy <strong>' + (-diff) + ' buổi</strong> — cố học thêm ' + (-diff) + ' buổi để theo kịp!';
      } else {
        strategyText = '⚡ Em chậm hơn thầy <strong>' + (-diff) + ' buổi</strong> — cần tăng tốc ngay, học bù nhiều buổi/ngày!';
      }
      teacherHtml =
        '<div style="background:rgba(245,158,11,.08);border:1px solid rgba(245,158,11,.25);' +
        'border-radius:12px;padding:14px 18px;margin-bottom:14px;">' +
          '<div style="font-size:11px;color:#f59e0b;font-weight:700;letter-spacing:.05em;margin-bottom:6px;">📍 THẦY ĐANG DẠY ĐẾN</div>' +
          '<div style="font-size:17px;font-weight:700;color:#e6edf3;margin-bottom:2px;">' + (tLesson.TenBai || '') + '</div>' +
          '<div style="font-size:13px;color:#8b949e;margin-bottom:10px;">' +
            'Chương ' + (tLesson.Chuong || '?') + ' · Buổi ' + (teacherIdx + 1) + '/' + total +
          '</div>' +
          '<div style="font-size:13px;color:#e6edf3;line-height:1.5;">' + strategyText + '</div>' +
        '</div>';
    }

    var lessonHtml = lesson
      ? ('<div class="nv-lesson-card">' +
          '<div class="nv-lesson-name">📖 ' + (lesson.TenBai || 'Buổi học') + '</div>' +
          '<div class="nv-lesson-meta">Chương ' + (lesson.Chuong || '?') + ' · ' + (lesson.KhoaHoc || '') + '</div>' +
          (lesson.MoTaBai ? '<div class="nv-lesson-meta" style="margin-top:3px">' + lesson.MoTaBai + '</div>' : '') +
         '</div>')
      : '<div class="nv-lesson-card"><div class="nv-lesson-name" style="color:#34d399">🎉 Hoàn thành lộ trình!</div></div>';

    var chamChip = cham > 0
      ? '<span class="nv-chip warn" title="So với lịch tự đặt của em (nhịp ' + nhip + ' buổi/tuần), không phải so với thầy">⏰ Chậm ' + cham + ' buổi (lịch riêng của em)</span>'
      : '<span class="nv-chip ok">✅ Đúng lịch riêng của em</span>';

    var actionBtn = lesson
      ? '<button class="nv-btn nv-btn-primary" onclick="vlxtGoStudy()">Học ngay →</button>'
      : '<button class="nv-btn nv-btn-primary" onclick="window.location.href=\'dua-top.html\'">Vào Đua Top 🏆</button>';

    openOverlay(
      '<div class="nv-title">📋 Nhiệm vụ hôm nay</div>' +
      '<div class="nv-sub">' + today() + ' · Buổi ' + (conTro + 1) + '/' + total + ' · Còn ' + dlDays + ' ngày đến thi</div>' +
      teacherHtml +
      lessonHtml +
      '<div class="nv-chips">' + chamChip + '<span class="nv-chip">' + (total - conTro) + ' buổi còn lại</span>' +
        (streakToday ? '<span class="nv-chip ok">🔥 Đã hoàn thành hôm qua — Chuỗi ' + (Number(nv.chuoiDung) || 0) + ' ngày!</span>' : '') +
      '</div>' +
      '<div class="nv-progress-wrap">' +
        '<div class="nv-progress-label"><span>Tiến độ XPS 2k9</span><span>' + pct + '%</span></div>' +
        '<div class="nv-progress-bar"><div class="nv-progress-fill" style="width:' + pct + '%"></div></div>' +
      '</div>' +
      (cham > 0 ? '<div style="font-size:11px;color:#fbbf24;margin-bottom:4px">💡 Có thể làm bù nhiều buổi/ngày để đuổi kịp.</div>' : '') +
      '<div class="nv-btn-row">' +
        '<button class="nv-btn nv-btn-secondary" onclick="vlxtCloseNhiemVu()">Tắt</button>' +
        actionBtn +
      '</div>'
    );
  }

  // ─── 3. Đua Top đã mở khoá ───────────────────────────────
  function showDuaTopUnlocked(nv, user) {
    injectCSS();
    openOverlay(
      '<div style="text-align:center">' +
        '<div style="font-size:48px;margin-bottom:10px">🏆</div>' +
        '<div class="nv-title" style="justify-content:center">Đua Top đã mở khoá!</div>' +
        '<div class="nv-sub" style="text-align:center">Em đã hoàn thành tốt nhiệm vụ hôm nay,<br>giờ là lúc leo Bảng Vàng!</div>' +
        '<div class="nv-chips" style="justify-content:center">' +
          '<span class="nv-chip ok">Tổng điểm Đua Top: ' + (nv.tongDiemDuaTop || 0) + ' LP</span>' +
          (nv.chuoiDung ? '<span class="nv-chip">🔥 Chuỗi ' + Number(nv.chuoiDung) + ' ngày</span>' : '') +
        '</div>' +
        '<div class="nv-btn-row" style="margin-top:18px">' +
          '<button class="nv-btn nv-btn-secondary" onclick="vlxtCloseNhiemVu()">Để sau</button>' +
          '<button class="nv-btn nv-btn-primary" onclick="window.location.href=\'dua-top.html\'">Vào Đua Top 🚀</button>' +
        '</div>' +
      '</div>'
    );
  }

  // ─── Banner sticky (sau khi tắt popup) ──────────────────
  function showMissionBanner(nv, xps) {
    if (document.getElementById('vlxt-mission-banner')) return;
    injectCSS();
    var conTro  = Number(nv.conTro) || 0;
    var total   = xps ? xps.length : 0;
    var isDone  = total > 0 && conTro >= total;
    var lesson  = (xps && !isDone) ? xps[conTro] : null;
    var title   = isDone ? 'Chế độ Đua Top' : '📋 Nhiệm vụ hôm nay';
    var sub     = isDone ? 'Leo Bảng Vàng ngay!' : (lesson ? lesson.TenBai : 'Buổi ' + (conTro + 1) + '/' + total);

    var ban = document.createElement('div');
    ban.id  = 'vlxt-mission-banner';
    // Bỏ dòng phụ đề (tên bài học) — chữ quá bé, hay tràn lem ra ngoài khung, nhìn rối mắt.
    ban.innerHTML =
      '<span class="nvb-icon">' + (isDone ? '🏆' : '📋') + '</span>' +
      '<span class="nvb-text">' +
        '<span class="nvb-title">' + title + '</span>' +
      '</span>' +
      '<button class="nvb-close" title="Ẩn" onclick="event.stopPropagation();this.closest(\'#vlxt-mission-banner\').remove()">×</button>';
    ban.addEventListener('click', function () {
      // Overlay có thể chưa từng được tạo (trường hợp popup không hiện lại trong
      // ngày, chỉ có banner) → build lại popup đầy đủ từ _state thay vì chỉ toggle
      // class của 1 overlay có thể không tồn tại.
      if (_state) {
        var _realConTro = Number(_state.nv.conTro) || 0;
        var _total = _state.xps ? _state.xps.length : 0;
        if (_total > 0 && _realConTro >= _total) {
          showDuaTopUnlocked(_state.nv, _state.user);
        } else {
          showMissionPopup(_state.nv, _state.xps, _state.user, _state.teachingKey);
        }
      } else {
        var o = document.getElementById('vlxt-nv-overlay');
        if (o) o.classList.add('open');
      }
    });
    document.body.appendChild(ban);
  }

  // ─── Main init ────────────────────────────────────────────
  async function init() {
    var user = (typeof vlxtGetUser === 'function') ? vlxtGetUser() : null;
    if (!user || !user.sdt) return;

    try {
      var resp = await fetch(GAS + '?type=nhiemvu&hs=' + encodeURIComponent(user.sdt));
      var data = await resp.json();
      var nv   = (data && data.ok) ? data.data : null;

      // Chưa setup — hỏi nhịp học
      if (!nv || !nv.nhipHoc) {
        showNhipHocSelector(user);
        return;
      }

      // Tải danh sách bài học + settings + tiến độ THẬT song song
      var fetches = await Promise.all([
        fetch(GAS + '?type=baihoc').then(function (r) { return r.json(); }).catch(function () { return []; }),
        fetch(GAS + '?type=settings').then(function (r) { return r.json(); }).catch(function () { return {}; }),
        fetch(GAS + '?type=khoaconfig').then(function (r) { return r.json(); }).catch(function () { return []; }),
        fetchWatchedSet(user.sdt)
      ]);
      var allL        = Array.isArray(fetches[0]) ? fetches[0] : [];
      var settings    = (fetches[1] && fetches[1].ok) ? (fetches[1].data || {}) : {};
      var khoaRaw     = Array.isArray(fetches[2]) ? fetches[2] : (fetches[2].data || []);
      var watchedSet  = fetches[3];
      var teachingKey = settings.currentTeachingLesson || '';

      // Tạo map khoaHoc → config (thuTu, daKhaiGiang)
      var khoaMap = {};
      khoaRaw.forEach(function (k) { khoaMap[k.khoaHoc] = k; });

      // XPS = bài từ TẤT CẢ khoá đã khai giảng (daKhaiGiang=true), xếp theo thuTu → chương → thứ tự sheet
      var xps = allL
        .filter(function (l) {
          var cfg = khoaMap[l.KhoaHoc || ''];
          return cfg && (cfg.daKhaiGiang === true || String(cfg.daKhaiGiang) === 'true');
        })
        .sort(function (a, b) {
          var cfgA = khoaMap[a.KhoaHoc] || {}, cfgB = khoaMap[b.KhoaHoc] || {};
          var ta = parseInt(cfgA.thuTu) || 999, tb = parseInt(cfgB.thuTu) || 999;
          if (ta !== tb) return ta - tb;                          // Khoá khác nhau → theo thuTu
          var ma = (a.Chuong || '').match(/\d+/), mb = (b.Chuong || '').match(/\d+/);
          var ca = ma ? parseInt(ma[0]) : 0, cb = mb ? parseInt(mb[0]) : 0;
          return ca - cb;                                         // Cùng khoá → theo chương (TUẦN N)
          // Cùng chương → giữ nguyên thứ tự sheet
        });

      // conTro = vị trí bài chưa hoàn thành đầu tiên, tính từ tiến độ THẬT
      // (không dùng số tự bấm nữa) → luôn khớp với % trên thẻ khoá học.
      var realConTro = computeRealConTro(xps, watchedSet);
      var todayS     = today();
      var prevConTro = Number(nv.conTro) || 0; // tiến độ đã lưu TRƯỚC khi ghi đè — dùng để tính chuỗi ngày

      // Đồng bộ lại sheet nếu số đã lưu bị lệch so với tiến độ thật (không chặn UI)
      if (realConTro !== prevConTro) {
        gasPost({ action: 'savenhiemvu', sdt: user.sdt, conTro: realConTro });
      }
      nv.conTro = realConTro;

      // Lưu state để các callback dùng (kèm teachingKey để banner có thể mở lại popup đầy đủ)
      _state = { nv: nv, xps: xps, user: user, teachingKey: teachingKey };

      // Đã hiện popup hôm nay → chỉ show banner
      // (kiểm tra cả localStorage vì gasPost là fire-and-forget: nếu học sinh
      //  chuyển trang ngay sau khi tắt popup, request lưu lastMissionDate lên
      //  Sheet có thể bị huỷ giữa chừng → cờ localStorage đảm bảo popup vẫn
      //  không hiện lại trong cùng ngày dù server chưa kịp lưu.)
      var localShownKey = 'vlxt_missionShown_' + user.sdt + '_' + todayS;
      var localShown = false;
      try { localShown = localStorage.getItem(localShownKey) === '1'; } catch (e) {}

      if (nv.lastMissionDate === todayS || localShown) {
        showMissionBanner(nv, xps);
        return;
      }

      // ─── Chuỗi ngày liên tục (chuoiDung) ─────────────────────
      // Đua Top là ĐỀ XUẤT THEO NGÀY, không phải mở khoá vĩnh viễn:
      // mỗi ngày quay lại, nếu học sinh đã tiến bộ (xem xong bài được giao)
      // kể từ lần ghé thăm gần nhất → tăng chuỗi +1 và hiện đề xuất Đua Top
      // hôm đó. Bỏ lỡ (không tiến bộ trong ngày liền trước, hoặc bỏ cách
      // ≥1 ngày không vào) → reset chuỗi về 0.
      var prevDateStr = nv.lastMissionDate || '';
      var daysSince = prevDateStr ? Math.round((new Date(todayS) - new Date(prevDateStr)) / 86400000) : null;
      var advanced  = realConTro > prevConTro;
      var newStreak;
      if (daysSince === null)      newStreak = Number(nv.chuoiDung) || 0; // lần đầu — chưa đủ dữ liệu để tính chuỗi
      else if (daysSince === 1 && advanced) newStreak = (Number(nv.chuoiDung) || 0) + 1;
      else                          newStreak = 0; // bỏ lỡ hôm qua, hoặc cách ≥1 ngày không vào
      var streakToday = advanced && (daysSince === 1 || daysSince === null);

      // Đánh dấu đã hiện nhiệm vụ hôm nay — lưu local NGAY LẬP TỨC (đồng bộ)
      // rồi mới gửi lên server (không chặn UI).
      try { localStorage.setItem(localShownKey, '1'); } catch (e) {}
      gasPost({ action: 'savenhiemvu', sdt: user.sdt, lastMissionDate: todayS, chuoiDung: newStreak });
      nv.lastMissionDate = todayS;
      nv.chuoiDung = newStreak;

      // Hiện popup — Đua Top chỉ bật màn hình chúc mừng vào đúng ngày vừa
      // hoàn thành nhiệm vụ VÀ đã xem hết mọi bài hiện có; nếu đã ở trạng
      // thái "hết bài" từ trước (không có gì mới hôm nay) thì chỉ hiện banner
      // nhắc nhẹ, tránh lặp lại popup ăn mừng mỗi ngày.
      if (realConTro >= xps.length && streakToday) {
        showDuaTopUnlocked(nv, user);
      } else if (realConTro >= xps.length) {
        showMissionBanner(nv, xps);
      } else {
        showMissionPopup(nv, xps, user, teachingKey, streakToday);
      }

    } catch (e) {
      console.warn('[NhiemVu]', e);
    }
  }

  // ─── Callbacks (phải là global để onclick="..." hoạt động) ──

  window.vlxtSelectNhip = function (btn, nhip) {
    _selectedNhip = nhip;
    document.querySelectorAll('.nv-nhip-btn').forEach(function (b) { b.classList.remove('sel'); });
    btn.classList.add('sel');
    var hints = { 3: '~2 buổi/ngày học', 5: '1 buổi/ngày học', 7: '1 buổi/ngày mỗi ngày' };
    var el = document.getElementById('nv-nhip-hint');
    if (el) el.textContent = hints[nhip] || '';
    var confirm = document.getElementById('nv-btn-confirm');
    if (confirm) confirm.disabled = false;
  };

  window.vlxtConfirmNhip = function () {
    var user = (typeof vlxtGetUser === 'function') ? vlxtGetUser() : null;
    if (!user || !_selectedNhip) return;
    var btn = document.getElementById('nv-btn-confirm');
    if (btn) { btn.disabled = true; btn.textContent = 'Đang lưu...'; }
    gasPost({ action: 'savenhiemvu', sdt: user.sdt, nhipHoc: _selectedNhip, conTro: 0, startDate: today(), lastMissionDate: '' })
      .then(function () { location.reload(); });
  };

  window.vlxtCloseNhiemVu = function () {
    closeOverlay();
    if (_state && !document.getElementById('vlxt-mission-banner')) {
      showMissionBanner(_state.nv, _state.xps);
    }
  };

  window.vlxtGoStudy = function () {
    if (!_state) return;
    var lesson = _state.xps[Number(_state.nv.conTro) || 0];
    if (!lesson) return;
    closeOverlay();
    // Truyền đủ 3 phần: khoa + chuong + tenbai → baihoc.html tự scroll/mở đúng bài
    var key = encodeURIComponent((lesson.KhoaHoc || '') + '|||' + (lesson.Chuong || '') + '|||' + (lesson.TenBai || ''));
    window.location.href = 'baihoc.html?openLesson=' + key;
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500); // đợi auth.js render xong
  }

  window.vlxtNhiemVuInit = init;

})();
