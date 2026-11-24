/* ═══════════════════════════════════════════════════════════════════════════════
   VLXT GLOBAL FEEDBACK, BUG REPORT & ZALO CONTACT HUB (v2.0.0)
   - Co mat tren 100% trang Web Hoc Sinh (desktop, mobile, phong thi CBT & 1-khung)
   - Thiet ke phang EdTech chuan quoc te (0 AI Glow), tu dong theo nen sang o phong-thi-thu.html
   - 3 Tab sieu toc: Bao loi (tu bat Auto-Context) | Dong gop y kien | Lien he Zalo Thay & Nhom Zalo Web
   ═══════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var ZALO_TEACHER_URL = 'https://zalo.me/0964885920';
  var ZALO_TEACHER_PHONE = '0964.885.920';
  var ZALO_GROUP_URL = 'https://zalo.me/g/str1pllhp4uxa3rtvnou';
  var RTDB_ROOT = 'https://edu-portal-live-default-rtdb.firebaseio.com/support_chats/_vlxt_system';

  var _activeTab = 'bug';
  var _selectedBugCat = 'Sai đáp án / Công thức';
  var _selectedRating = 5;
  var _panelOpen = false;

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getPageFile() {
    try {
      return (global.location.pathname.split('/').pop() || 'index.html').toLowerCase() || 'index.html';
    } catch (e) {
      return 'index.html';
    }
  }

  function isLightCbtPage() {
    var p = getPageFile();
    return p === 'phong-thi-thu.html' || p === 'thithu.html';
  }

  function getUserSafe() {
    try {
      if (typeof global.vlxtGetUser === 'function') return global.vlxtGetUser();
      return JSON.parse(localStorage.getItem('vlxt_user_v2') || 'null');
    } catch (e) {
      return null;
    }
  }

  function getContextSnapshot() {
    if (global.VLXT_TELEMETRY && typeof global.VLXT_TELEMETRY.getContext === 'function') {
      return global.VLXT_TELEMETRY.getContext();
    }
    return {
      page: getPageFile(),
      url: (global.location && global.location.href) || '',
      contextLabel: getPageFile(),
      deviceType: (global.innerWidth || 1280) <= 640 ? 'mobile' : 'desktop'
    };
  }

  function notifyToast(msg, tone) {
    if (typeof global.vlxtToast === 'function') {
      global.vlxtToast(msg, { tone: tone || 'ok' });
      return;
    }
    var box = document.getElementById('vlxt-fb-toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'vlxt-fb-toast';
      box.className = 'vlxt-fb-toast';
      document.body.appendChild(box);
    }
    box.textContent = msg;
    box.classList.add('show');
    clearTimeout(box._tm);
    box._tm = setTimeout(function () { box.classList.remove('show'); }, 3800);
  }

  function injectCSS() {
    if (typeof document === 'undefined' || !document.head) return;
    if (document.getElementById('vlxt-fb-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-fb-css';
    s.textContent = [
      ':root{--vfb-bg:#0f172a;--vfb-card:#151e31;--vfb-border:rgba(148,163,184,0.24);--vfb-text:#f1f5f9;--vfb-sub:#94a3b8;--vfb-accent:#0b84f3;--vfb-accent-hover:#1d90fa;--vfb-chip:#1e293b;}',
      'body.vlxt-fb-cbt-light{--vfb-bg:#ffffff;--vfb-card:#f8fafc;--vfb-border:#cbd5e1;--vfb-text:#0f172a;--vfb-sub:#475569;--vfb-accent:#1d4ed8;--vfb-accent-hover:#1e40af;--vfb-chip:#f1f5f9;}',
      '.vlxt-fb-fab{position:fixed;bottom:20px;right:20px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border-radius:999px;border:1px solid var(--vfb-border);background:var(--vfb-bg);color:var(--vfb-text);font-family:"Inter",system-ui,sans-serif;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.26);transition:transform .14s ease,background-color .16s ease,border-color .16s ease;}',
      '.vlxt-fb-fab:hover{transform:translateY(-2px);border-color:var(--vfb-accent);}',
      '.vlxt-fb-fab-dot{width:8px;height:8px;border-radius:50%;background:#10b981;flex-shrink:0;}',
      'body.vlxt-fb-exam-left .vlxt-fb-fab{right:auto;left:16px;bottom:14px;padding:8px 12px;font-size:12px;}',
      '@media(max-width:640px){.vlxt-fb-fab{bottom:14px;right:12px;padding:8px 12px;font-size:12px;}.vlxt-fb-fab .vfb-label-full{display:none;}.vlxt-fb-fab .vfb-label-short{display:inline!important;}body.vlxt-fb-exam-left .vlxt-fb-fab{left:10px;right:auto;bottom:64px;}}',
      '.vlxt-fb-fab .vfb-label-short{display:none;}',
      '.vlxt-fb-panel{display:none;position:fixed;bottom:72px;right:20px;z-index:2147483100;width:368px;max-width:calc(100vw - 24px);max-height:78vh;background:var(--vfb-bg);border:1px solid var(--vfb-border);border-radius:16px;box-shadow:0 16px 40px rgba(0,0,0,0.45);color:var(--vfb-text);font-family:"Inter",system-ui,sans-serif;flex-direction:column;overflow:hidden;}',
      'body.vlxt-fb-exam-left .vlxt-fb-panel{right:auto;left:16px;bottom:62px;}',
      '.vlxt-fb-panel.open{display:flex;}',
      '@media(max-width:640px){.vlxt-fb-panel{right:12px;left:12px;width:auto;bottom:62px;max-height:74vh;}body.vlxt-fb-exam-left .vlxt-fb-panel{left:12px;right:12px;bottom:112px;}}',
      '.vfb-head{padding:13px 16px;background:var(--vfb-card);border-bottom:1px solid var(--vfb-border);display:flex;align-items:center;justify-content:space-between;gap:8px;}',
      '.vfb-head-title{font-size:14px;font-weight:800;color:var(--vfb-text);}',
      '.vfb-head-sub{font-size:11.5px;color:var(--vfb-sub);margin-top:2px;}',
      '.vfb-close{width:30px;height:30px;border-radius:8px;border:1px solid var(--vfb-border);background:transparent;color:var(--vfb-sub);cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;}',
      '.vfb-close:hover{color:var(--vfb-text);border-color:var(--vfb-accent);}',
      '.vfb-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:8px 12px;background:var(--vfb-card);border-bottom:1px solid var(--vfb-border);}',
      '.vfb-tab{padding:7px 6px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--vfb-sub);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;text-align:center;transition:background-color .15s,color .15s;}',
      '.vfb-tab.active{background:var(--vfb-accent);color:#ffffff;}',
      '.vfb-body{padding:14px 16px;overflow-y:auto;display:flex;flex-direction:column;gap:11px;}',
      '.vfb-ctx-box{padding:8px 11px;border-radius:9px;background:var(--vfb-card);border:1px solid var(--vfb-border);font-size:11.5px;color:var(--vfb-sub);line-height:1.45;}',
      '.vfb-ctx-box strong{color:var(--vfb-text);}',
      '.vfb-chips{display:flex;flex-wrap:wrap;gap:6px;}',
      '.vfb-chip{padding:6px 10px;border-radius:8px;border:1px solid var(--vfb-border);background:var(--vfb-chip);color:var(--vfb-text);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}',
      '.vfb-chip.active{background:var(--vfb-accent);border-color:var(--vfb-accent);color:#ffffff;}',
      '.vfb-ratings{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;}',
      '.vfb-rate{padding:7px 4px;border-radius:8px;border:1px solid var(--vfb-border);background:var(--vfb-chip);color:var(--vfb-text);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:2px;}',
      '.vfb-rate.active{border-color:var(--vfb-accent);background:var(--vfb-accent);color:#ffffff;}',
      '.vfb-field-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
      '.vfb-input,.vfb-textarea{width:100%;box-sizing:border-box;padding:9px 11px;border-radius:9px;border:1px solid var(--vfb-border);background:var(--vfb-card);color:var(--vfb-text);font-family:inherit;font-size:13px;outline:none;}',
      '.vfb-input:focus,.vfb-textarea:focus{border-color:var(--vfb-accent);}',
      '.vfb-textarea{min-height:86px;resize:vertical;line-height:1.45;}',
      '.vfb-btn{width:100%;padding:11px 14px;border-radius:10px;border:none;font-family:inherit;font-size:13.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;transition:background-color .15s,opacity .15s;}',
      '.vfb-btn.primary{background:var(--vfb-accent);color:#ffffff;}',
      '.vfb-btn.primary:hover{background:var(--vfb-accent-hover);}',
      '.vfb-btn.zalo{background:#0068ff;color:#ffffff;}',
      '.vfb-btn.zalo:hover{background:#1677ff;}',
      '.vfb-btn.secondary{background:var(--vfb-chip);color:var(--vfb-text);border:1px solid var(--vfb-border);}',
      '.vfb-btn.secondary:hover{border-color:var(--vfb-accent);}',
      '.vfb-note{font-size:12px;color:var(--vfb-sub);line-height:1.5;}',
      '.vfb-done-box{padding:12px;border-radius:10px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);font-size:12.5px;line-height:1.5;color:var(--vfb-text);}',
      '.vlxt-fb-toast{position:fixed;bottom:78px;right:20px;z-index:2147483200;background:#0f172a;color:#f8fafc;border:1px solid rgba(56,189,248,0.35);padding:10px 14px;border-radius:10px;font-size:12.5px;font-weight:600;box-shadow:0 8px 24px rgba(0,0,0,0.4);opacity:0;transform:translateY(8px);transition:all .2s;pointer-events:none;}',
      '.vlxt-fb-toast.show{opacity:1;transform:none;}'
    ].join('');
    document.head.appendChild(s);
  }

  function syncPlacementClass() {
    if (typeof document === 'undefined' || !document.body) return;
    document.body.classList.toggle('vlxt-fb-cbt-light', isLightCbtPage());
    var p = getPageFile();
    var isDgnlExam = (p === 'danh-gia-nang-luc.html' && !document.body.classList.contains('dgnl-lobby-active'));
    document.body.classList.toggle('vlxt-fb-exam-left', isDgnlExam);
  }

  function submitDirectFallback(record) {
    if (global.VLXT_TELEMETRY && typeof global.VLXT_TELEMETRY.submitFeedbackReport === 'function') {
      return global.VLXT_TELEMETRY.submitFeedbackReport(record);
    }
    var id = 'fb_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
    var u = getUserSafe() || {};
    var ctx = getContextSnapshot();
    var fullRecord = {
      id: id,
      type: record.type === 'idea' ? 'idea' : 'bug',
      category: record.category || 'general',
      rating: record.rating || null,
      message: String(record.message || '').trim().slice(0, 1500),
      contactPhone: String(record.contactPhone || u.sdt || '').trim(),
      contactName: String(record.contactName || u.hoten || 'Khách').trim(),
      lop: u.lop || '',
      page: ctx.page,
      pageUrl: ctx.url,
      context: { label: ctx.contextLabel },
      status: 'open',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    return fetch(RTDB_ROOT + '/feedback_reports/' + encodeURIComponent(id) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullRecord)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return { ok: true, id: id };
    });
  }

  function renderPanelBody() {
    var body = document.getElementById('vlxt-fb-body');
    if (!body) return;
    var ctx = getContextSnapshot();
    var u = getUserSafe() || {};
    var userLabel = (u && u.sdt) ? (escHtml(u.hoten || 'Học sinh') + ' · ' + escHtml(u.sdt)) : 'Chưa đăng nhập';

    if (_activeTab === 'bug') {
      var bugCats = [
        'Sai đáp án / Công thức',
        'Mô phỏng / Video lỗi',
        'Lỗi hiển thị / Bị che',
        'Lỗi khác'
      ];
      body.innerHTML = [
        '<div class="vfb-ctx-box">',
        '  <div>📍 <strong>Tự động đính kèm vị trí:</strong> ' + escHtml(ctx.contextLabel || ctx.page) + '</div>',
        '  <div>👤 <strong>Tài khoản:</strong> ' + userLabel + '</div>',
        '</div>',
        '<div style="font-size:12px;font-weight:700;color:var(--vfb-text)">1. Em gặp vấn đề gì?</div>',
        '<div class="vfb-chips" id="vfb-bug-chips">',
        bugCats.map(function (c) {
          return '<button type="button" class="vfb-chip ' + (_selectedBugCat === c ? 'active' : '') + '" data-cat="' + escHtml(c) + '">' + escHtml(c) + '</button>';
        }).join(''),
        '</div>',
        '<div style="font-size:12px;font-weight:700;color:var(--vfb-text)">2. Mô tả ngắn để Thầy kiểm tra ngay:</div>',
        '<textarea class="vfb-textarea" id="vfb-msg-input" placeholder="VD: Câu này công thức bị lệch hoặc bấm phát video không chạy..."></textarea>',
        (!u || !u.sdt
          ? '<div class="vfb-field-row"><input class="vfb-input" id="vfb-name-input" placeholder="Tên của em"><input class="vfb-input" id="vfb-phone-input" placeholder="SĐT Zalo (tùy chọn)"></div>'
          : ''),
        '<button type="button" class="vfb-btn primary" id="vfb-submit-btn">🐞 Gửi báo lỗi cho Thầy</button>',
        '<div id="vfb-status-slot"></div>',
        '<div class="vfb-note">Cần xử lý gấp? <a href="' + ZALO_TEACHER_URL + '" target="_blank" rel="noopener" style="color:var(--vfb-accent);font-weight:700;">Nhắn trực tiếp Zalo Thầy (' + ZALO_TEACHER_PHONE + ') →</a></div>'
      ].join('');

      body.querySelectorAll('#vfb-bug-chips .vfb-chip').forEach(function (btn) {
        btn.onclick = function () {
          _selectedBugCat = btn.getAttribute('data-cat');
          body.querySelectorAll('#vfb-bug-chips .vfb-chip').forEach(function (b) {
            b.classList.toggle('active', b === btn);
          });
        };
      });
    } else if (_activeTab === 'idea') {
      var ratings = [
        { v: 5, ico: '🤩', txt: 'Rất mê' },
        { v: 4, ico: '👍', txt: 'Tốt' },
        { v: 3, ico: '🙂', txt: 'Ổn' },
        { v: 2, ico: '😕', txt: 'Hơi rối' },
        { v: 1, ico: '⚠️', txt: 'Cần sửa' }
      ];
      body.innerHTML = [
        '<div style="font-size:12px;font-weight:700;color:var(--vfb-text)">Trải nghiệm học hôm nay của em thế nào?</div>',
        '<div class="vfb-ratings" id="vfb-ratings">',
        ratings.map(function (r) {
          return '<button type="button" class="vfb-rate ' + (_selectedRating === r.v ? 'active' : '') + '" data-rate="' + r.v + '"><span style="font-size:16px">' + r.ico + '</span><span>' + r.txt + '</span></button>';
        }).join(''),
        '</div>',
        '<div style="font-size:12px;font-weight:700;color:var(--vfb-text)">Em thích phần nào nhất hoặc muốn Thầy nâng cấp gì?</div>',
        '<textarea class="vfb-textarea" id="vfb-msg-input" placeholder="Góp ý của em giúp Thầy tối ưu web cho cả khóa 2k9 học tốt hơn..."></textarea>',
        (!u || !u.sdt
          ? '<div class="vfb-field-row"><input class="vfb-input" id="vfb-name-input" placeholder="Tên của em"><input class="vfb-input" id="vfb-phone-input" placeholder="SĐT (tùy chọn)"></div>'
          : ''),
        '<button type="button" class="vfb-btn primary" id="vfb-submit-btn">💡 Gửi đóng góp cho Thầy</button>',
        '<div id="vfb-status-slot"></div>'
      ].join('');

      body.querySelectorAll('#vfb-ratings .vfb-rate').forEach(function (btn) {
        btn.onclick = function () {
          _selectedRating = Number(btn.getAttribute('data-rate'));
          body.querySelectorAll('#vfb-ratings .vfb-rate').forEach(function (b) {
            b.classList.toggle('active', b === btn);
          });
        };
      });
    } else {
      body.innerHTML = [
        '<div class="vfb-ctx-box">',
        '  <strong>📲 Phản hồi nhanh nhất qua Zalo Thầy Xuân Trường</strong><br>',
        '  Thầy ít trực hộp chat trên web. Em bấm nút bên dưới để nhắn thẳng Zalo cá nhân của Thầy (hệ thống tự chép sẵn thông tin trang em đang xem).',
        '</div>',
        '<a href="' + ZALO_TEACHER_URL + '" target="_blank" rel="noopener" class="vfb-btn zalo" id="vfb-zalo-teacher-btn">💬 Nhắn Zalo Thầy Trường (' + ZALO_TEACHER_PHONE + ')</a>',
        '<a href="' + ZALO_GROUP_URL + '" target="_blank" rel="noopener" class="vfb-btn secondary" id="vfb-zalo-group-btn">👥 Vào Nhóm Zalo Thành Viên Web</a>',
        '<div class="vfb-ctx-box">',
        '  <div>📍 <strong>Vị trí hiện tại:</strong> ' + escHtml(ctx.contextLabel || ctx.page) + '</div>',
        '  <div>👤 <strong>Tài khoản:</strong> ' + userLabel + '</div>',
        '</div>',
        '<div class="vfb-note">Nếu em phát hiện câu hỏi sai đáp án hoặc lỗi mô phỏng, hãy gửi ở tab <strong>🐞 Báo lỗi</strong> để hệ thống lưu tự động đúng mã câu hỏi giúp Thầy sửa ngay.</div>'
      ].join('');

      var zT = document.getElementById('vfb-zalo-teacher-btn');
      var zG = document.getElementById('vfb-zalo-group-btn');
      if (zT) {
        zT.onclick = function () {
          var summary = '[VLXT Hỗ trợ] ' + (u && u.hoten ? (u.hoten + ' (' + u.sdt + ')') : 'Học sinh') + ' · Đang ở: ' + (ctx.contextLabel || ctx.page);
          try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(summary); } catch (e) {}
          if (global.VLXT_TELEMETRY) global.VLXT_TELEMETRY.track('zalo_teacher_click', { target: 'feedback_hub', label: ctx.contextLabel });
          notifyToast('Đã chép sẵn thông tin bài đang xem — em dán gửi Thầy qua Zalo nhé!', 'info');
        };
      }
      if (zG) {
        zG.onclick = function () {
          if (global.VLXT_TELEMETRY) global.VLXT_TELEMETRY.track('zalo_group_click', { source: 'feedback_hub', url: ZALO_GROUP_URL });
        };
      }
      return;
    }

    var submitBtn = document.getElementById('vfb-submit-btn');
    if (submitBtn) {
      submitBtn.onclick = function () {
        var msgEl = document.getElementById('vfb-msg-input');
        var msg = msgEl ? msgEl.value.trim() : '';
        if (!msg) {
          notifyToast('Em nhập nội dung ngắn trước khi gửi nhé!', 'warn');
          if (msgEl) msgEl.focus();
          return;
        }
        var nameEl = document.getElementById('vfb-name-input');
        var phoneEl = document.getElementById('vfb-phone-input');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi...';
        submitDirectFallback({
          type: _activeTab === 'idea' ? 'idea' : 'bug',
          category: _activeTab === 'idea' ? 'suggestion' : _selectedBugCat,
          rating: _activeTab === 'idea' ? _selectedRating : null,
          message: msg,
          contactName: nameEl ? nameEl.value.trim() : '',
          contactPhone: phoneEl ? phoneEl.value.trim() : ''
        }).then(function () {
          var slot = document.getElementById('vfb-status-slot');
          if (msgEl) msgEl.value = '';
          if (slot) {
            slot.innerHTML = '<div class="vfb-done-box">✅ <strong>Đã gửi thành công tới Admin của Thầy!</strong><br>Cảm ơn em đã đóng góp. Nếu cần phản hồi ngay, em nhắn Zalo Thầy: <a href="' + ZALO_TEACHER_URL + '" target="_blank" rel="noopener" style="color:#38bdf8;font-weight:700;">' + ZALO_TEACHER_PHONE + '</a>.</div>';
          }
          notifyToast('Cảm ơn em! Phản hồi đã được ghi nhận.', 'ok');
          submitBtn.disabled = false;
          submitBtn.textContent = _activeTab === 'idea' ? '💡 Gửi tiếp góp ý' : '🐞 Gửi thêm báo lỗi';
        }).catch(function () {
          notifyToast('Không gửi được lúc này, em nhắn qua Zalo Thầy nhé!', 'err');
          submitBtn.disabled = false;
          submitBtn.textContent = _activeTab === 'idea' ? '💡 Gửi đóng góp cho Thầy' : '🐞 Gửi báo lỗi cho Thầy';
        });
      };
    }
  }

  function setTab(tab) {
    _activeTab = (tab === 'idea' || tab === 'contact') ? tab : 'bug';
    var panel = document.getElementById('vlxt-fb-panel');
    if (panel) {
      panel.querySelectorAll('.vfb-tab').forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-tab') === _activeTab);
      });
    }
    renderPanelBody();
  }

  function openHub(defaultTab) {
    ensureUI();
    syncPlacementClass();
    var panel = document.getElementById('vlxt-fb-panel');
    if (!panel) return;
    _panelOpen = true;
    panel.classList.add('open');
    if (defaultTab) {
      setTab(defaultTab);
    } else {
      var p = getPageFile();
      setTab((p === 'baihoc.html' || p === 'danh-gia-nang-luc.html' || p === 'phong-thi-thu.html') ? 'bug' : 'contact');
    }
    if (global.VLXT_TELEMETRY) global.VLXT_TELEMETRY.track('feedback_hub_open', { target: _activeTab });
  }

  function closeHub() {
    var panel = document.getElementById('vlxt-fb-panel');
    if (panel) panel.classList.remove('open');
    _panelOpen = false;
  }

  function ensureUI() {
    if (typeof document === 'undefined' || !document.body) return;
    injectCSS();
    syncPlacementClass();

    // Go bo bong bong chat cu neu da ton tai
    var oldFab = document.getElementById('vlxt-ht-fab');
    var oldPanel = document.getElementById('vlxt-ht-panel');
    if (oldFab) oldFab.remove();
    if (oldPanel) oldPanel.remove();

    if (!document.getElementById('vlxt-fb-fab')) {
      var fab = document.createElement('button');
      fab.type = 'button';
      fab.id = 'vlxt-fb-fab';
      fab.className = 'vlxt-fb-fab';
      fab.setAttribute('aria-label', 'Báo lỗi, đóng góp ý kiến hoặc liên hệ Zalo Thầy');
      fab.innerHTML = '<span class="vlxt-fb-fab-dot"></span><span class="vfb-label-full">🛠️ Báo lỗi · Góp ý · Zalo Thầy</span><span class="vfb-label-short">🛠️ Hỗ trợ</span>';
      fab.onclick = function () {
        if (_panelOpen) closeHub();
        else openHub();
      };
      document.body.appendChild(fab);
    }

    if (!document.getElementById('vlxt-fb-panel')) {
      var panel = document.createElement('div');
      panel.id = 'vlxt-fb-panel';
      panel.className = 'vlxt-fb-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Đóng góp, báo lỗi và liên hệ Thầy Xuân Trường');
      panel.innerHTML = [
        '<div class="vfb-head">',
        '  <div>',
        '    <div class="vfb-head-title">🛠️ Góp Ý · Báo Lỗi · Liên Hệ</div>',
        '    <div class="vfb-head-sub">Phản hồi trực tiếp cho Thầy Xuân Trường</div>',
        '  </div>',
        '  <button type="button" class="vfb-close" id="vlxt-fb-close-btn" aria-label="Đóng">✕</button>',
        '</div>',
        '<div class="vfb-tabs" role="tablist">',
        '  <button type="button" class="vfb-tab active" data-tab="bug" role="tab">🐞 Báo lỗi</button>',
        '  <button type="button" class="vfb-tab" data-tab="idea" role="tab">💡 Đóng góp</button>',
        '  <button type="button" class="vfb-tab" data-tab="contact" role="tab">💬 Zalo Thầy</button>',
        '</div>',
        '<div class="vfb-body" id="vlxt-fb-body"></div>'
      ].join('');
      document.body.appendChild(panel);

      document.getElementById('vlxt-fb-close-btn').onclick = closeHub;
      panel.querySelectorAll('.vfb-tab').forEach(function (t) {
        t.onclick = function () { setTab(t.getAttribute('data-tab')); };
      });
    }
  }

  function init() {
    if (typeof document === 'undefined') return;
    if (global.__vlxtFeedbackHubLoaded) return;
    global.__vlxtFeedbackHubLoaded = true;

    var mount = function () {
      ensureUI();
      if (typeof MutationObserver !== 'undefined' && document.body) {
        var obs = new MutationObserver(syncPlacementClass);
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mount);
    } else {
      mount();
    }
  }

  global.vlxtOpenFeedbackHub = openHub;
  global.vlxtCloseFeedbackHub = closeHub;
  global.vlxtToggleChat = function () { openHub('contact'); };

  init();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { openHub: openHub, closeHub: closeHub, ZALO_TEACHER_URL: ZALO_TEACHER_URL, ZALO_GROUP_URL: ZALO_GROUP_URL };
  }
})(typeof window !== 'undefined' ? window : globalThis);
