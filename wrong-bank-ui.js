/* ═══════════════════════════════════════════════════════════════════════
   VLXT WRONG QUESTION BANK UI — GIAO DIỆN THỐNG KÊ & PHỤC THÙ CÂU SAI
   Tích hợp vào hoso.html (#tab-causai) · Chuẩn EdTech phẳng (Zero AI Glow)
   ═══════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var MODEL_SCRIPTS = [
    'assets/canvas-core-helpers.js?v=20261118-50de',
    'assets/mo-hinh-thuc-te-models.js?v=20261118-50de',
    'assets/staging-ds-models.js?v=20261118-50de',
    'assets/staging-tn50-models.js?v=20261118-50de',
    'assets/staging-tn220-models.js?v=20261118-50de',
    'assets/tln-thuc-te-models.js?v=20261118-50de'
  ];

  var _modelsPromise = null;
  var _state = {
    status: 'need_review', // need_review | mastered | repeated | all
    chapter: 'ALL',        // ALL | C1 | C2 | C3 | C4 | OTHER
    source: 'ALL',         // ALL | dgnl | baihoc | video_quiz | thithu
    type: 'ALL',           // ALL | mc | tf | short
    sort: 'recent',        // recent | most_wrong | chapter
    search: '',
    pageLimit: 15,
    expandedExplain: {},   // key -> bool
    retrying: {},          // key -> { mc:'', tf:[null,null,null,null], short:'', feedback:null }
    showRealImg: {}        // key -> bool
  };

  var _session = {
    open: false,
    items: [],
    idx: 0,
    draft: null,
    checked: null,
    solvedCount: 0,
    wrongCount: 0,
    finished: false
  };

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fixFormulaStrings(str) {
    if (!str || typeof str !== 'string') return str || '';
    return str
      .replace(/\\d\\frac\{/g, '\\dfrac{')
      .replace(/\\\\text\{/g, '\\text{')
      .replace(/\\text\{\s+/g, '\\text{')
      .replace(/\\\\rightarrow/g, '\\rightarrow')
      .replace(/\\\\times/g, '\\times');
  }

  function stripModelSlotTags(html) {
    return String(html || '').replace(/<div[^>]*class=["'][^"']*vlxt-model-slot[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
  }

  function formatRelTime(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    if (isNaN(d.getTime())) return '';
    var diff = Date.now() - d.getTime();
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' phút trước';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' giờ trước';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function getAccountKey() {
    if (!root.VlxtWrongBank) return 'guest';
    return root.VlxtWrongBank.getCurrentAccountKey();
  }

  function injectCSS() {
    if (document.getElementById('vlxt-wb-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-wb-css';
    s.textContent = [
      '/* ── SỔ TAY CÂU LÀM SAI — FLAT EDTECH PRO (ZERO AI GLOW) ── */',
      '.wb-wrap{display:flex;flex-direction:column;gap:18px;}',
      '.wb-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}',
      '@media(max-width:900px){.wb-kpi-grid{grid-template-columns:repeat(2,1fr);}}',
      '.wb-kpi-card{background:#0f1930;border:1px solid rgba(148,163,184,0.2);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;box-shadow:0 2px 8px rgba(0,0,0,0.22);}',
      '.wb-kpi-top{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:700;color:#94a3b8;}',
      '.wb-kpi-val{font-size:24px;font-weight:900;color:#f8fafc;letter-spacing:-0.02em;}',
      '.wb-kpi-sub{font-size:11.5px;color:#94a3b8;}',
      '.wb-progress-track{height:6px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;margin-top:4px;}',
      '.wb-progress-fill{height:100%;background:#10b981;border-radius:999px;transition:width 0.25s ease;}',

      '.wb-chap-section{background:#0f1930;border:1px solid rgba(148,163,184,0.2);border-radius:16px;padding:16px 18px;}',
      '.wb-chap-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px;}',
      '.wb-chap-title{font-size:13.5px;font-weight:800;color:#f1f5f9;display:inline-flex;align-items:center;gap:8px;}',
      '.wb-chap-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;}',
      '@media(max-width:900px){.wb-chap-grid{grid-template-columns:repeat(2,1fr);}}',
      '@media(max-width:520px){.wb-chap-grid{grid-template-columns:1fr;}}',
      '.wb-chap-btn{text-align:left;background:#111d38;border:1px solid rgba(148,163,184,0.18);border-radius:12px;padding:11px 13px;cursor:pointer;transition:border-color 0.15s,background 0.15s;color:#f1f5f9;display:flex;flex-direction:column;gap:6px;}',
      '.wb-chap-btn:hover{border-color:#38bdf8;background:#152546;}',
      '.wb-chap-btn.active{border-color:#38bdf8;background:rgba(56,189,248,0.14);}',
      '.wb-chap-btn-row{display:flex;align-items:center;justify-content:space-between;gap:6px;}',
      '.wb-chap-name{font-size:12.5px;font-weight:800;color:#f8fafc;display:inline-flex;align-items:center;gap:6px;}',
      '.wb-chap-count{font-size:12px;font-weight:800;padding:2px 8px;border-radius:999px;}',
      '.wb-weak-tag{font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:999px;background:rgba(239,68,68,0.16);color:#fca5a5;border:1px solid rgba(239,68,68,0.35);}',

      '.wb-toolbar{background:#0f1930;border:1px solid rgba(148,163,184,0.2);border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:12px;}',
      '.wb-status-pills{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}',
      '.wb-pills-group{display:flex;flex-wrap:wrap;gap:7px;}',
      '.wb-pill{border:1px solid rgba(148,163,184,0.24);background:#131f3b;color:#cbd5e1;font-size:12.5px;font-weight:700;padding:7px 13px;border-radius:999px;cursor:pointer;transition:all 0.15s;display:inline-flex;align-items:center;gap:6px;}',
      '.wb-pill:hover{border-color:#38bdf8;color:#fff;}',
      '.wb-pill.active{background:#0b84f3;border-color:#0b84f3;color:#ffffff;}',
      '.wb-pill-cnt{font-size:11px;font-weight:800;padding:1px 6px;border-radius:999px;background:rgba(0,0,0,0.25);}',

      '.wb-cta-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}',
      '.wb-btn-primary{border:1px solid #059669;background:#10b981;color:#022c22;font-size:13px;font-weight:800;padding:8px 16px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:background 0.15s;box-shadow:0 2px 8px rgba(0,0,0,0.25);}',
      '.wb-btn-primary:hover{background:#34d399;}',
      '.wb-btn-primary:disabled{opacity:0.45;cursor:not-allowed;}',
      '.wb-btn-ghost{border:1px solid rgba(148,163,184,0.26);background:#131f3b;color:#cbd5e1;font-size:12.5px;font-weight:700;padding:7px 12px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.15s;text-decoration:none;}',
      '.wb-btn-ghost:hover{border-color:#38bdf8;color:#ffffff;background:#19284b;}',
      '.wb-btn-danger{border:1px solid rgba(239,68,68,0.32);background:rgba(239,68,68,0.1);color:#fca5a5;}',
      '.wb-btn-danger:hover{border-color:#ef4444;background:rgba(239,68,68,0.2);color:#fff;}',

      '.wb-filters-row{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:9px;}',
      '@media(max-width:900px){.wb-filters-row{grid-template-columns:1fr 1fr;}}',
      '@media(max-width:520px){.wb-filters-row{grid-template-columns:1fr;}}',
      '.wb-input,.wb-select{width:100%;padding:8px 11px;border-radius:10px;border:1px solid rgba(148,163,184,0.24);background:#0a1224;color:#f1f5f9;font-size:13px;outline:none;}',
      '.wb-input:focus,.wb-select:focus{border-color:#38bdf8;}',

      '.wb-list{display:flex;flex-direction:column;gap:14px;}',
      '.wb-card{background:#0f1930;border:1px solid rgba(148,163,184,0.22);border-radius:16px;padding:18px 20px;box-shadow:0 4px 14px rgba(0,0,0,0.26);}',
      '.wb-card.is-mastered{border-color:rgba(16,185,129,0.35);}',
      '.wb-card.is-repeated{border-left:4px solid #f59e0b;}',
      '.wb-card-head{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-bottom:11px;margin-bottom:12px;border-bottom:1px solid rgba(255,255,255,0.07);}',
      '.wb-badges{display:flex;flex-wrap:wrap;align-items:center;gap:6px;}',
      '.wb-badge{font-size:11px;font-weight:800;padding:3px 9px;border-radius:6px;display:inline-flex;align-items:center;gap:4px;border:1px solid transparent;}',
      '.wb-badge-type{background:rgba(56,189,248,0.12);color:#7dd3fc;border-color:rgba(56,189,248,0.28);}',
      '.wb-badge-src{background:rgba(148,163,184,0.12);color:#cbd5e1;border-color:rgba(148,163,184,0.24);}',
      '.wb-badge-wrong{background:rgba(239,68,68,0.15);color:#fca5a5;border-color:rgba(239,68,68,0.34);}',
      '.wb-badge-repeat{background:rgba(245,158,11,0.18);color:#fde047;border-color:rgba(245,158,11,0.42);}',
      '.wb-badge-mastered{background:rgba(16,185,129,0.16);color:#6ee7b7;border-color:rgba(16,185,129,0.38);}',
      '.wb-time{font-size:11.5px;color:#94a3b8;font-weight:600;}',

      '.wb-meta-line{font-size:12px;color:#94a3b8;margin-bottom:10px;display:flex;flex-wrap:wrap;gap:10px;}',
      '.wb-context{background:#0a1224;border-left:3px solid #38bdf8;border-radius:8px;padding:10px 13px;font-size:13.5px;color:#cbd5e1;line-height:1.65;margin-bottom:10px;}',
      '.wb-stem{font-size:15px;font-weight:600;color:#f8fafc;line-height:1.7;margin-bottom:12px;overflow-x:auto;}',
      '.wb-wrap .vstep-data-panel,.wb-modal-card .vstep-data-panel{background:#0a1224 !important;border:1px solid rgba(148,163,184,0.28) !important;border-radius:10px !important;padding:10px !important;margin:10px 0 !important;overflow-x:auto !important;box-shadow:none !important;}',
      '.wb-stem table,.wb-context table,.wb-wrap .vstep-data-table,.wb-modal-card .vstep-data-table{width:100% !important;border-collapse:collapse !important;margin:6px 0 !important;font-size:13px !important;color:#f1f5f9 !important;background:#0c162b !important;}',
      '.wb-stem th,.wb-stem td,.wb-context th,.wb-context td,.wb-wrap .vstep-data-table th,.wb-wrap .vstep-data-table td,.wb-modal-card .vstep-data-table th,.wb-modal-card .vstep-data-table td{border:1px solid rgba(148,163,184,0.28) !important;padding:6px 9px !important;text-align:center !important;color:#f1f5f9 !important;background:transparent !important;}',
      '.wb-wrap .vstep-data-table tbody tr,.wb-modal-card .vstep-data-table tbody tr{background:#0c162b !important;}',
      '.wb-wrap .vstep-data-table tbody tr:nth-child(even),.wb-modal-card .vstep-data-table tbody tr:nth-child(even){background:#12203d !important;}',
      '.wb-stem th,.wb-context th,.wb-wrap .vstep-data-table th,.wb-modal-card .vstep-data-table th{background:#162444 !important;color:#ffffff !important;font-weight:800 !important;}',
      '.tab-btn.active #wb-tab-badge-count{background:#04101e !important;color:#ffffff !important;}',
      '.wb-media-box{margin:10px 0 14px;background:#070d1d;border:1px solid rgba(148,163,184,0.22);border-radius:12px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:8px;}',
      '.wb-media-box canvas{width:100%;max-width:740px;height:auto;border-radius:8px;display:block;}',
      '.wb-media-box img{max-width:100%;max-height:280px;object-fit:contain;border-radius:8px;background:#ffffff;padding:6px;}',
      '.wb-media-bar{width:100%;display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#94a3b8;padding:0 4px;}',

      '.wb-opts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;}',
      '@media(max-width:700px){.wb-opts{grid-template-columns:1fr;}}',
      '.wb-opt{padding:10px 13px;border-radius:10px;border:1px solid rgba(148,163,184,0.2);background:#121e38;color:#e2e8f0;font-size:13.5px;line-height:1.5;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;}',
      '.wb-opt.is-correct{border-color:#10b981;background:rgba(16,185,129,0.12);color:#ecfdf5;}',
      '.wb-opt.is-wrong-pick{border-color:#ef4444;background:rgba(239,68,68,0.12);color:#fef2f2;}',
      '.wb-opt.is-interactive{cursor:pointer;text-align:left;width:100%;font-family:inherit;}',
      '.wb-opt.is-interactive:hover{border-color:#38bdf8;background:#172748;}',
      '.wb-opt.is-selected{border-color:#38bdf8;background:rgba(56,189,248,0.16);color:#ffffff;}',

      '.wb-tf-list{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;}',
      '.wb-tf-row{padding:10px 13px;border-radius:10px;border:1px solid rgba(148,163,184,0.2);background:#121e38;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:13.5px;color:#e2e8f0;line-height:1.55;}',
      '.wb-tf-row.is-ok{border-color:rgba(16,185,129,0.45);background:rgba(16,185,129,0.09);}',
      '.wb-tf-row.is-bad{border-color:rgba(239,68,68,0.45);background:rgba(239,68,68,0.09);}',
      '.wb-tf-btns{display:inline-flex;gap:6px;flex-shrink:0;}',
      '.wb-tf-toggle{padding:5px 12px;border-radius:8px;border:1px solid rgba(148,163,184,0.28);background:#0a1224;color:#cbd5e1;font-size:12px;font-weight:800;cursor:pointer;}',
      '.wb-tf-toggle.sel-true{background:#10b981;border-color:#10b981;color:#022c22;}',
      '.wb-tf-toggle.sel-false{background:#ef4444;border-color:#ef4444;color:#ffffff;}',

      '.wb-short-box{background:#121e38;border:1px solid rgba(148,163,184,0.2);border-radius:10px;padding:11px 14px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;font-size:13.5px;margin-bottom:12px;}',
      '.wb-short-input{padding:8px 12px;border-radius:8px;border:1px solid #38bdf8;background:#0a1224;color:#ffffff;font-size:14px;font-weight:700;width:190px;outline:none;}',

      '.wb-actions{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.06);}',
      '.wb-actions-left,.wb-actions-right{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}',
      '.wb-explain-box{margin-top:12px;padding:14px 16px;border-radius:12px;background:#0a1326;border:1px solid rgba(56,189,248,0.26);font-size:13.5px;color:#e2e8f0;line-height:1.7;overflow-x:auto;}',
      '.wb-explain-box .exp-stmt-item{margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);}',
      '.wb-explain-box .exp-stmt-item:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}',
      '.wb-explain-box .exp-key-badge{display:inline-block;font-size:11px;font-weight:800;padding:2px 7px;border-radius:5px;margin-right:6px;}',
      '.wb-explain-box .exp-key-badge.true{background:rgba(16,185,129,0.2);color:#34d399;}',
      '.wb-explain-box .exp-key-badge.false{background:rgba(239,68,68,0.2);color:#f87171;}',
      '.wb-explain-box .vlxt-math-callout{background:rgba(56,189,248,0.08);border-left:3px solid #38bdf8;padding:8px 12px;border-radius:6px;margin:6px 0;}',
      '.wb-retry-banner{margin-bottom:12px;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;}',
      '.wb-retry-banner.ok{background:rgba(16,185,129,0.16);border:1px solid rgba(16,185,129,0.4);color:#6ee7b7;}',
      '.wb-retry-banner.bad{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;}',

      '.wb-empty{background:#0f1930;border:1px dashed rgba(148,163,184,0.28);border-radius:16px;padding:38px 20px;text-align:center;color:#94a3b8;}',
      '.wb-empty h4{font-size:16px;font-weight:800;color:#f8fafc;margin-bottom:6px;}',
      '.wb-empty p{font-size:13.5px;margin-bottom:16px;line-height:1.6;}',
      '.wb-load-more-wrap{text-align:center;padding-top:6px;}',

      '/* ── FOCUSED RETRY MODAL (PHÒNG PHỤC THÙ CÂU SAI) ── */',
      '.wb-modal-overlay{position:fixed;inset:0;z-index:20050;background:rgba(3,7,18,0.84);display:none;align-items:center;justify-content:center;padding:18px;overflow-y:auto;}',
      '.wb-modal-overlay.open{display:flex;}',
      '.wb-modal-card{width:min(860px,100%);max-height:92vh;overflow-y:auto;background:#0d162b;border:1px solid rgba(148,163,184,0.3);border-radius:18px;padding:22px 24px;box-shadow:0 20px 50px rgba(0,0,0,0.65);color:#f1f5f9;}',
      '.wb-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.08);}',
      '.wb-modal-title{font-size:16px;font-weight:800;color:#ffffff;display:inline-flex;align-items:center;gap:8px;}',
      '.wb-modal-close{background:#131f3b;border:1px solid rgba(148,163,184,0.25);color:#cbd5e1;border-radius:8px;width:34px;height:34px;cursor:pointer;font-size:15px;}',
      '.wb-modal-close:hover{background:#1e2f56;color:#fff;}'
    ].join('');
    document.head.appendChild(s);
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve) {
      if (document.querySelector('script[data-wb-src="' + src + '"]')) {
        resolve();
        return;
      }
      var el = document.createElement('script');
      el.src = src;
      el.async = false;
      el.setAttribute('data-wb-src', src);
      el.onload = function () { resolve(); };
      el.onerror = function () { resolve(); };
      document.head.appendChild(el);
    });
  }

  function ensureModelsLoaded() {
    if (_modelsPromise) return _modelsPromise;
    _modelsPromise = MODEL_SCRIPTS.reduce(function (p, src) {
      return p.then(function () { return loadScriptOnce(src); });
    }, Promise.resolve());
    return _modelsPromise;
  }

  function renderMath(el) {
    if (!el || typeof root.renderMathInElement !== 'function') return;
    try {
      root.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'svg', 'canvas'],
        throwOnError: false
      });
    } catch (e) {}
  }

  function mountVisualsIn(container) {
    if (!container) return;
    var slots = container.querySelectorAll('.wb-canvas-slot[data-model-id]');
    if (!slots.length) return;
    ensureModelsLoaded().then(function () {
      slots.forEach(function (slot) {
        if (slot.dataset.mounted === '1') return;
        var mid = slot.dataset.modelId;
        if (!mid || !root.VLXTModels) return;
        try {
          if (typeof root.VLXTModels.has === 'function' && !root.VLXTModels.has(mid)) {
            if (typeof root.VLXTModels.mountAll === 'function') {
              slot.innerHTML = '<div class="vlxt-model-slot" data-model-id="' + escHtml(mid) + '"></div>';
              root.VLXTModels.mountAll(slot, { compact: true });
              slot.dataset.mounted = '1';
            }
            return;
          }
          slot.innerHTML = '<div class="vlxt-model-slot" data-model-id="' + escHtml(mid) + '"></div>';
          if (typeof root.VLXTModels.mountAll === 'function') {
            root.VLXTModels.mountAll(slot, { compact: true });
          }
          slot.dataset.mounted = '1';
        } catch (e) {}
      });
    });
  }

  function filterAndSortItems(allItems) {
    var qSearch = (_state.search || '').trim().toLowerCase();
    var filtered = allItems.filter(function (it) {
      var justCheckedHere = Boolean(_state.retrying[it.key] && _state.retrying[it.key].feedback);
      if (!justCheckedHere) {
        if (_state.status === 'need_review' && it.status === 'mastered') return false;
        if (_state.status === 'mastered' && it.status !== 'mastered') return false;
        if (_state.status === 'repeated' && (Number(it.wrongCount) || 1) < 2) return false;
      }
      if (_state.chapter !== 'ALL' && it.chapter !== _state.chapter) return false;
      if (_state.source !== 'ALL' && it.source !== _state.source) return false;
      if (_state.type !== 'ALL' && it.type !== _state.type) return false;
      if (qSearch) {
        var hay = [it.question, it.deBaiChung, it.subTopic, it.baiHoc, it.sourceLabel, it.chapterName, it.qId]
          .filter(Boolean).join(' ').toLowerCase();
        if (hay.indexOf(qSearch) === -1) return false;
      }
      return true;
    });

    var chapRank = { C1: 1, C2: 2, C3: 3, C4: 4, OTHER: 5 };
    filtered.sort(function (a, b) {
      if (_state.sort === 'most_wrong') {
        var diff = (Number(b.wrongCount) || 1) - (Number(a.wrongCount) || 1);
        if (diff !== 0) return diff;
      } else if (_state.sort === 'chapter') {
        var cd = (chapRank[a.chapter] || 9) - (chapRank[b.chapter] || 9);
        if (cd !== 0) return cd;
      }
      return (Number(b.lastWrongAt || b.updatedAt || 0)) - (Number(a.lastWrongAt || a.updatedAt || 0));
    });
    return filtered;
  }

  function typeLabel(t) {
    if (t === 'tf') return 'Phần II · Đúng/Sai';
    if (t === 'short') return 'Phần III · Trả lời ngắn';
    return 'Phần I · Trắc nghiệm';
  }

  function renderVisualBlock(item) {
    var hasModel = Boolean(item.modelId);
    var hasImg = Boolean(item.hinhAnh);
    if (!hasModel && !hasImg) return '';
    var showImgOnly = Boolean(_state.showRealImg[item.key]) || !hasModel;
    var toggleBtn = (hasModel && hasImg)
      ? '<button type="button" class="wb-btn-ghost" style="padding:4px 9px;font-size:11.5px" data-wb-action="toggle-media" data-wb-key="' + escHtml(item.key) + '">' +
        (showImgOnly ? '<i class="fa-solid fa-cube"></i> Xem mô phỏng 60 FPS' : '<i class="fa-regular fa-image"></i> Xem ảnh đề gốc') +
        '</button>'
      : '';
    return '<div class="wb-media-box">' +
      (showImgOnly
        ? '<img src="' + escHtml(item.hinhAnh) + '" alt="Hình minh họa câu hỏi" loading="lazy">'
        : '<div class="wb-canvas-slot" data-model-id="' + escHtml(item.modelId) + '" style="width:100%;"></div>') +
      '<div class="wb-media-bar">' +
        '<span>' + (showImgOnly ? '🖼️ Hình minh họa đề gốc' : ('⚡ Mô phỏng Vật Lý 60 FPS · ' + escHtml(item.modelId))) + '</span>' +
        toggleBtn +
      '</div>' +
    '</div>';
  }

  function renderReviewBody(item) {
    var letters = ['A', 'B', 'C', 'D'];
    var subLetters = ['a', 'b', 'c', 'd'];

    if (item.type === 'tf') {
      var userArr = Array.isArray(item.lastUserAnswer) ? item.lastUserAnswer : [null, null, null, null];
      var keyArr = Array.isArray(item.boolAnswers) && item.boolAnswers.length ? item.boolAnswers : [];
      var rows = (item.options || []).map(function (optText, i) {
        var uVal = userArr[i];
        var kVal = Boolean(keyArr[i]);
        var ok = (uVal === true || uVal === false) && (uVal === kVal);
        var uStr = uVal === true ? 'Đúng' : (uVal === false ? 'Sai' : 'Chưa chọn');
        var kStr = kVal ? 'Đúng' : 'Sai';
        return '<div class="wb-tf-row ' + (ok ? 'is-ok' : 'is-bad') + '">' +
          '<div style="flex:1;min-width:220px"><strong>' + subLetters[i] + ')</strong> ' + fixFormulaStrings(optText) + '</div>' +
          '<div style="font-size:12px;white-space:nowrap">' +
            'Em chọn: <b style="color:' + (ok ? '#34d399' : '#fca5a5') + '">' + uStr + '</b> · Chuẩn: <b style="color:#34d399">' + kStr + '</b> ' +
            (ok ? '<span style="color:#34d399">✔</span>' : '<span style="color:#f87171">✘</span>') +
          '</div>' +
        '</div>';
      }).join('');
      return '<div class="wb-tf-list">' + rows + '</div>';
    }

    if (item.type === 'short') {
      var uAns = item.lastUserAnswer ? escHtml(item.lastUserAnswer) : '<em>(Bỏ trống)</em>';
      return '<div class="wb-short-box">' +
        '<span>Em từng điền: <strong style="color:#fca5a5">' + uAns + '</strong></span>' +
        '<span>·</span>' +
        '<span>Đáp án chuẩn: <strong style="color:#34d399">' + escHtml(item.correctAnswer || '---') + '</strong></span>' +
      '</div>';
    }

    // mc
    var uLet = String(item.lastUserAnswer || '').toUpperCase();
    var cLet = String(item.correctAnswer || '').toUpperCase();
    var optsHtml = (item.options || []).map(function (optText, i) {
      var L = letters[i];
      var clean = fixFormulaStrings(optText).replace(/^[A-D]\.\s*/i, '');
      var isCorr = L === cLet;
      var isWrongPick = L === uLet && !isCorr;
      var cls = isCorr ? 'is-correct' : (isWrongPick ? 'is-wrong-pick' : '');
      var tag = isCorr
        ? '<span style="color:#34d399;font-weight:800;font-size:11.5px;white-space:nowrap">✔ Đáp án đúng</span>'
        : (isWrongPick ? '<span style="color:#fca5a5;font-weight:800;font-size:11.5px;white-space:nowrap">✘ Em chọn</span>' : '');
      return '<div class="wb-opt ' + cls + '"><span><strong>' + L + '.</strong> ' + clean + '</span>' + tag + '</div>';
    }).join('');
    return '<div class="wb-opts">' + optsHtml + '</div>';
  }

  function renderInteractiveRetryBody(item, draft, keyAttr) {
    var letters = ['A', 'B', 'C', 'D'];
    var subLetters = ['a', 'b', 'c', 'd'];

    if (item.type === 'tf') {
      var tfArr = Array.isArray(draft.tf) ? draft.tf : [null, null, null, null];
      return '<div class="wb-tf-list">' + (item.options || []).map(function (optText, i) {
        var cur = tfArr[i];
        return '<div class="wb-tf-row">' +
          '<div style="flex:1;min-width:220px"><strong>' + subLetters[i] + ')</strong> ' + fixFormulaStrings(optText) + '</div>' +
          '<div class="wb-tf-btns">' +
            '<button type="button" class="wb-tf-toggle ' + (cur === true ? 'sel-true' : '') + '" data-wb-action="pick-tf" data-wb-key="' + keyAttr + '" data-wb-idx="' + i + '" data-wb-val="true">Đúng</button>' +
            '<button type="button" class="wb-tf-toggle ' + (cur === false ? 'sel-false' : '') + '" data-wb-action="pick-tf" data-wb-key="' + keyAttr + '" data-wb-idx="' + i + '" data-wb-val="false">Sai</button>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>';
    }

    if (item.type === 'short') {
      return '<div class="wb-short-box">' +
        '<label style="font-weight:700;color:#cbd5e1">Nhập đáp số của em:</label>' +
        '<input type="text" class="wb-short-input" placeholder="VD: 2,67" value="' + escHtml(draft.short || '') + '" data-wb-input="short" data-wb-key="' + keyAttr + '">' +
      '</div>';
    }

    // mc
    return '<div class="wb-opts">' + (item.options || []).map(function (optText, i) {
      var L = letters[i];
      var clean = fixFormulaStrings(optText).replace(/^[A-D]\.\s*/i, '');
      var isSel = draft.mc === L;
      return '<button type="button" class="wb-opt is-interactive ' + (isSel ? 'is-selected' : '') + '" data-wb-action="pick-mc" data-wb-key="' + keyAttr + '" data-wb-val="' + L + '">' +
        '<span><strong>' + L + '.</strong> ' + clean + '</span>' +
        (isSel ? '<span style="color:#38bdf8;font-weight:800;font-size:12px">● Đang chọn</span>' : '') +
      '</button>';
    }).join('') + '</div>';
  }

  function renderCard(item) {
    var wb = root.VlxtWrongBank;
    var chap = wb.CHAPTER_META[item.chapter] || wb.CHAPTER_META.OTHER;
    var srcMeta = wb.SOURCE_META[item.source] || wb.SOURCE_META.dgnl;
    var wc = Number(item.wrongCount) || 1;
    var isMastered = item.status === 'mastered';
    var retryDraft = _state.retrying[item.key] || null;
    var showExplain = Boolean(_state.expandedExplain[item.key]);
    var keyEsc = escHtml(item.key);

    var ctxHtml = item.deBaiChung
      ? '<div class="wb-context">' + fixFormulaStrings(stripModelSlotTags(item.deBaiChung)) + '</div>'
      : '';
    var stemHtml = '<div class="wb-stem">' + fixFormulaStrings(stripModelSlotTags(item.question || '')) + '</div>';

    var feedbackBanner = '';
    if (retryDraft && retryDraft.feedback) {
      var fb = retryDraft.feedback;
      feedbackBanner = '<div class="wb-retry-banner ' + (fb.ok ? 'ok' : 'bad') + '">' +
        '<span>' + (fb.ok
          ? '<i class="fa-solid fa-circle-check"></i> Chính xác! Em đã chinh phục thành công câu này — chuyển sang mục Đã khắc phục!'
          : '<i class="fa-solid fa-circle-xmark"></i> Chưa chính xác' + (item.type === 'tf' ? (' (đúng ' + fb.matchedCount + '/4 ý)') : '') + ' — xem kỹ lời giải bên dưới để tránh lặp lỗi nhé!') +
        '</span>' +
      '</div>';
    }

    var bodyHtml = (retryDraft && !retryDraft.feedback)
      ? renderInteractiveRetryBody(item, retryDraft, keyEsc)
      : renderReviewBody(item);

    var retryControls = (retryDraft && !retryDraft.feedback)
      ? '<button type="button" class="wb-btn-primary" data-wb-action="submit-retry" data-wb-key="' + keyEsc + '"><i class="fa-solid fa-check"></i> Kiểm tra ngay</button>' +
        '<button type="button" class="wb-btn-ghost" data-wb-action="cancel-retry" data-wb-key="' + keyEsc + '">Hủy</button>'
      : '<button type="button" class="wb-btn-primary" data-wb-action="start-retry" data-wb-key="' + keyEsc + '"><i class="fa-solid fa-rotate-right"></i> Làm lại câu này</button>' +
        '<button type="button" class="wb-btn-ghost" data-wb-action="toggle-explain" data-wb-key="' + keyEsc + '">' +
          '<i class="fa-solid fa-lightbulb" style="color:#fbbf24"></i> ' + (showExplain ? 'Ẩn lời giải' : 'Xem lời giải chi tiết') +
        '</button>';

    var explainHtml = (showExplain && !(retryDraft && !retryDraft.feedback))
      ? '<div class="wb-explain-box"><div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:6px;text-transform:uppercase"><i class="fa-solid fa-chalkboard-user"></i> Lời giải chi tiết</div>' +
          (item.explain ? fixFormulaStrings(item.explain) : '<em>Câu hỏi này chưa có lời giải chi tiết — em hãy xem lại bài giảng tương ứng hoặc đối chiếu đáp án chuẩn ở trên nhé.</em>') +
        '</div>'
      : '';

    return '<article class="wb-card ' + (isMastered ? 'is-mastered' : '') + (wc >= 2 && !isMastered ? ' is-repeated' : '') + '" data-wb-card="' + keyEsc + '">' +
      '<div class="wb-card-head">' +
        '<div class="wb-badges">' +
          '<span class="wb-badge" style="background:' + chap.color + '22;color:' + chap.color + ';border-color:' + chap.color + '55">' +
            '<i class="fa-solid ' + chap.icon + '"></i> ' + escHtml(chap.short) +
          '</span>' +
          '<span class="wb-badge wb-badge-type">' + typeLabel(item.type) + '</span>' +
          '<span class="wb-badge wb-badge-src"><i class="fa-solid ' + srcMeta.icon + '"></i> ' + escHtml(item.sourceLabel || srcMeta.short) + '</span>' +
          (wc >= 2
            ? '<span class="wb-badge wb-badge-repeat"><i class="fa-solid fa-fire"></i> Sai ' + wc + ' lần</span>'
            : '<span class="wb-badge wb-badge-wrong">Sai 1 lần</span>') +
          (isMastered
            ? '<span class="wb-badge wb-badge-mastered"><i class="fa-solid fa-check-double"></i> Đã khắc phục</span>'
            : '') +
        '</div>' +
        '<span class="wb-time"><i class="fa-regular fa-clock"></i> ' + formatRelTime(item.lastWrongAt || item.updatedAt) + '</span>' +
      '</div>' +
      ((item.subTopic || item.baiHoc)
        ? '<div class="wb-meta-line">' +
            (item.subTopic ? '<span><i class="fa-solid fa-tag" style="color:#38bdf8"></i> ' + escHtml(item.subTopic) + '</span>' : '') +
            (item.baiHoc ? '<span><i class="fa-solid fa-book" style="color:#10b981"></i> ' + escHtml(item.baiHoc) + '</span>' : '') +
          '</div>'
        : '') +
      feedbackBanner +
      ctxHtml +
      stemHtml +
      renderVisualBlock(item) +
      bodyHtml +
      '<div class="wb-actions">' +
        '<div class="wb-actions-left">' + retryControls + '</div>' +
        '<div class="wb-actions-right">' +
          (isMastered
            ? '<button type="button" class="wb-btn-ghost" data-wb-action="mark-review" data-wb-key="' + keyEsc + '"><i class="fa-solid fa-rotate-left"></i> Đưa lại cần ôn</button>'
            : '<button type="button" class="wb-btn-ghost" data-wb-action="mark-mastered" data-wb-key="' + keyEsc + '"><i class="fa-solid fa-check"></i> Đánh dấu đã hiểu</button>') +
          (item.sourceUrl
            ? '<a class="wb-btn-ghost" href="' + escHtml(item.sourceUrl) + '"><i class="fa-solid fa-arrow-up-right-from-square"></i> Mở nguồn</a>'
            : '') +
          '<button type="button" class="wb-btn-ghost wb-btn-danger" data-wb-action="delete" data-wb-key="' + keyEsc + '" title="Xóa câu này khỏi sổ tay"><i class="fa-regular fa-trash-can"></i></button>' +
        '</div>' +
      '</div>' +
      explainHtml +
    '</article>';
  }

  function updateGlobalBadges(stats) {
    var tabCountEl = document.getElementById('wb-tab-badge-count');
    if (tabCountEl) {
      tabCountEl.textContent = String(stats.needReview);
      tabCountEl.style.background = stats.needReview > 0 ? 'rgba(239,68,68,0.22)' : 'rgba(16,185,129,0.22)';
      tabCountEl.style.color = stats.needReview > 0 ? '#fca5a5' : '#6ee7b7';
    }
    var statCardVal = document.getElementById('wb-profile-stat-val');
    if (statCardVal) {
      statCardVal.textContent = String(stats.needReview);
    }
  }

  function renderWrongBankTab() {
    injectCSS();
    var container = document.getElementById('tab-causai');
    if (!container || !root.VlxtWrongBank) return;

    var wb = root.VlxtWrongBank;
    var acc = getAccountKey();
    var allItems = wb.getAll(acc);
    var stats = wb.getStats(acc);
    updateGlobalBadges(stats);

    var filtered = filterAndSortItems(allItems);
    var visible = filtered.slice(0, _state.pageLimit);
    var practiceCandidates = filtered.filter(function (x) { return x.status !== 'mastered'; });
    var fallbackCandidates = allItems.filter(function (x) { return x.status !== 'mastered'; });
    var sessionPoolCount = practiceCandidates.length > 0 ? practiceCandidates.length : fallbackCandidates.length;

    var chapCardsHtml = ['C1', 'C2', 'C3', 'C4'].map(function (cCode) {
      var ch = stats.byChapter[cCode];
      var isWeakest = stats.weakestChapter && stats.weakestChapter.code === cCode && ch.needReview > 0;
      var isAct = _state.chapter === cCode;
      var pctDone = ch.total > 0 ? Math.round((ch.mastered / ch.total) * 100) : 0;
      return '<button type="button" class="wb-chap-btn ' + (isAct ? 'active' : '') + '" data-wb-action="filter-chapter" data-wb-val="' + (isAct ? 'ALL' : cCode) + '">' +
        '<div class="wb-chap-btn-row">' +
          '<span class="wb-chap-name"><i class="fa-solid ' + ch.icon + '" style="color:' + ch.color + '"></i> ' + escHtml(ch.short) + '</span>' +
          '<span class="wb-chap-count" style="background:' + (ch.needReview > 0 ? 'rgba(239,68,68,0.16);color:#fca5a5' : 'rgba(16,185,129,0.16);color:#6ee7b7') + '">' + ch.needReview + ' cần ôn</span>' +
        '</div>' +
        '<div class="wb-chap-btn-row" style="font-size:11.5px;color:#94a3b8">' +
          '<span>Tổng sai: ' + ch.total + ' · Đã vá: ' + ch.mastered + '</span>' +
          (isWeakest ? '<span class="wb-weak-tag">Trọng tâm</span>' : '<span>' + pctDone + '%</span>') +
        '</div>' +
        '<div class="wb-progress-track"><div class="wb-progress-fill" style="width:' + pctDone + '%;background:' + ch.color + '"></div></div>' +
      '</button>';
    }).join('');

    var listHtml = '';
    if (allItems.length === 0) {
      listHtml = '<div class="wb-empty">' +
        '<div style="font-size:36px;margin-bottom:10px">🎯</div>' +
        '<h4>Chưa có câu làm sai nào được ghi nhận!</h4>' +
        '<p>Mỗi khi em làm bài ở <strong>Đánh Giá Năng Lực (50 Đề THPTQG)</strong>, <strong>Bài Tập Khóa Học</strong>, <strong>Video Quiz</strong> hoặc <strong>Phòng Thi Thử CBT</strong>, mọi câu trả lời sai của riêng tài khoản này sẽ tự động được gom về đây để em ôn lại và phục thù.</p>' +
        '<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">' +
          '<a href="danh-gia-nang-luc.html" class="wb-btn-primary" style="text-decoration:none"><i class="fa-solid fa-bullseye"></i> Làm Đề Đánh Giá Năng Lực</a>' +
          '<a href="baihoc.html" class="wb-btn-ghost"><i class="fa-solid fa-graduation-cap"></i> Vào Khóa Học Luyện Tập</a>' +
        '</div>' +
      '</div>';
    } else if (filtered.length === 0) {
      listHtml = '<div class="wb-empty">' +
        '<div style="font-size:32px;margin-bottom:8px">' + (_state.status === 'need_review' ? '🏆' : '🔍') + '</div>' +
        '<h4>' + (_state.status === 'need_review' ? 'Xuất sắc! Không còn câu nào cần ôn ở bộ lọc này' : 'Không tìm thấy câu hỏi phù hợp') + '</h4>' +
        '<p>' + (_state.status === 'need_review' ? 'Em đã khắc phục hết các lỗi sai thuộc tiêu chí đang chọn. Có thể chuyển sang tab Đã khắc phục để xem lại thành tích.' : 'Thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm nhé.') + '</p>' +
        '<button type="button" class="wb-btn-ghost" data-wb-action="reset-filters"><i class="fa-solid fa-filter-circle-xmark"></i> Đặt lại bộ lọc (Xem tất cả)</button>' +
      '</div>';
    } else {
      listHtml = '<div class="wb-list">' + visible.map(renderCard).join('') + '</div>';
      if (filtered.length > visible.length) {
        listHtml += '<div class="wb-load-more-wrap">' +
          '<button type="button" class="wb-btn-ghost" data-wb-action="load-more">' +
            '<i class="fa-solid fa-angles-down"></i> Xem thêm (' + (filtered.length - visible.length) + ' câu còn lại)' +
          '</button>' +
        '</div>';
      }
    }

    container.innerHTML = '<div class="wb-wrap">' +
      '<!-- 1. TỔNG QUAN CHỈ SỐ CÂU SAI -->' +
      '<div class="wb-kpi-grid">' +
        '<div class="wb-kpi-card">' +
          '<div class="wb-kpi-top"><span>Cần ôn tập ngay</span><i class="fa-solid fa-triangle-exclamation" style="color:#f87171"></i></div>' +
          '<div class="wb-kpi-val" style="color:#f87171">' + stats.needReview + '</div>' +
          '<div class="wb-kpi-sub">Câu sai chưa được phục thù</div>' +
        '</div>' +
        '<div class="wb-kpi-card">' +
          '<div class="wb-kpi-top"><span>Đã chinh phục</span><i class="fa-solid fa-circle-check" style="color:#34d399"></i></div>' +
          '<div class="wb-kpi-val" style="color:#34d399">' + stats.mastered + '</div>' +
          '<div class="wb-kpi-sub">Câu từng sai đã làm đúng lại</div>' +
        '</div>' +
        '<div class="wb-kpi-card">' +
          '<div class="wb-kpi-top"><span>Hay sai lặp lại</span><i class="fa-solid fa-fire" style="color:#fbbf24"></i></div>' +
          '<div class="wb-kpi-val" style="color:#fbbf24">' + stats.repeated + '</div>' +
          '<div class="wb-kpi-sub">Câu bị sai từ 2 lần trở lên</div>' +
        '</div>' +
        '<div class="wb-kpi-card">' +
          '<div class="wb-kpi-top"><span>Tỉ lệ khắc phục</span><i class="fa-solid fa-chart-line" style="color:#38bdf8"></i></div>' +
          '<div class="wb-kpi-val" style="color:#38bdf8">' + stats.masteryPct + '%</div>' +
          '<div class="wb-progress-track"><div class="wb-progress-fill" style="width:' + stats.masteryPct + '%"></div></div>' +
        '</div>' +
      '</div>' +

      '<!-- 2. PHÂN BỐ CÂU SAI THEO 4 CHƯƠNG VẬT LÝ 12 -->' +
      '<div class="wb-chap-section">' +
        '<div class="wb-chap-head">' +
          '<span class="wb-chap-title"><i class="fa-solid fa-layer-group" style="color:#38bdf8"></i> THỐNG KÊ LỖ HỔNG THEO 4 CHƯƠNG VẬT LÝ 12 (Bấm vào chương để lọc)</span>' +
          (stats.weakestChapter
            ? '<span style="font-size:12px;color:#fca5a5;font-weight:700"><i class="fa-solid fa-bullseye"></i> Chương cần ưu tiên vá: <strong>' + escHtml(stats.weakestChapter.name) + '</strong> (' + stats.weakestChapter.needReview + ' câu)</span>'
            : '<span style="font-size:12px;color:#6ee7b7;font-weight:700"><i class="fa-solid fa-shield-halved"></i> Không có lỗ hổng tồn đọng</span>') +
        '</div>' +
        '<div class="wb-chap-grid">' + chapCardsHtml + '</div>' +
      '</div>' +

      '<!-- 3. THANH CÔNG CỤ LỌC & PHÒNG PHỤC THÙ -->' +
      '<div class="wb-toolbar">' +
        '<div class="wb-status-pills">' +
          '<div class="wb-pills-group">' +
            '<button type="button" class="wb-pill ' + (_state.status === 'need_review' ? 'active' : '') + '" data-wb-action="filter-status" data-wb-val="need_review">Cần ôn <span class="wb-pill-cnt">' + stats.needReview + '</span></button>' +
            '<button type="button" class="wb-pill ' + (_state.status === 'repeated' ? 'active' : '') + '" data-wb-action="filter-status" data-wb-val="repeated">🔥 Sai lặp lại <span class="wb-pill-cnt">' + stats.repeated + '</span></button>' +
            '<button type="button" class="wb-pill ' + (_state.status === 'mastered' ? 'active' : '') + '" data-wb-action="filter-status" data-wb-val="mastered">✓ Đã khắc phục <span class="wb-pill-cnt">' + stats.mastered + '</span></button>' +
            '<button type="button" class="wb-pill ' + (_state.status === 'all' ? 'active' : '') + '" data-wb-action="filter-status" data-wb-val="all">Tất cả <span class="wb-pill-cnt">' + stats.total + '</span></button>' +
          '</div>' +
          '<div class="wb-cta-row">' +
            '<button type="button" class="wb-btn-primary" data-wb-action="open-session" ' + (sessionPoolCount === 0 ? 'disabled' : '') + '>' +
              '<i class="fa-solid fa-bolt"></i> Ôn Tập Tập Trung (' + sessionPoolCount + ' câu)' +
            '</button>' +
            (stats.mastered > 0
              ? '<button type="button" class="wb-btn-ghost" data-wb-action="clear-mastered" title="Xóa các câu đã chinh phục khỏi sổ tay"><i class="fa-solid fa-broom"></i> Dọn câu đã vá</button>'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="wb-filters-row">' +
          '<input type="text" class="wb-input" id="wb-search-input" placeholder="🔍 Tìm theo đề bài, chủ đề, bài học (VD: Boyle, phóng xạ...)" value="' + escHtml(_state.search) + '">' +
          '<select class="wb-select" id="wb-filter-source">' +
            '<option value="ALL"' + (_state.source === 'ALL' ? ' selected' : '') + '>Tất cả nguồn (' + stats.total + ')</option>' +
            '<option value="dgnl"' + (_state.source === 'dgnl' ? ' selected' : '') + '>50 Đề THPTQG (' + stats.bySource.dgnl + ')</option>' +
            '<option value="baihoc"' + (_state.source === 'baihoc' ? ' selected' : '') + '>Bài tập khóa học (' + stats.bySource.baihoc + ')</option>' +
            '<option value="video_quiz"' + (_state.source === 'video_quiz' ? ' selected' : '') + '>Câu hỏi Video (' + stats.bySource.video_quiz + ')</option>' +
            '<option value="thithu"' + (_state.source === 'thithu' ? ' selected' : '') + '>Phòng thi thử CBT (' + stats.bySource.thithu + ')</option>' +
          '</select>' +
          '<select class="wb-select" id="wb-filter-type">' +
            '<option value="ALL"' + (_state.type === 'ALL' ? ' selected' : '') + '>Tất cả dạng câu</option>' +
            '<option value="mc"' + (_state.type === 'mc' ? ' selected' : '') + '>Phần I · Trắc nghiệm (' + stats.byType.mc + ')</option>' +
            '<option value="tf"' + (_state.type === 'tf' ? ' selected' : '') + '>Phần II · Đúng/Sai (' + stats.byType.tf + ')</option>' +
            '<option value="short"' + (_state.type === 'short' ? ' selected' : '') + '>Phần III · Trả lời ngắn (' + stats.byType.short + ')</option>' +
          '</select>' +
          '<select class="wb-select" id="wb-filter-sort">' +
            '<option value="recent"' + (_state.sort === 'recent' ? ' selected' : '') + '>Sắp xếp: Mới sai gần đây</option>' +
            '<option value="most_wrong"' + (_state.sort === 'most_wrong' ? ' selected' : '') + '>Sắp xếp: Sai nhiều lần nhất</option>' +
            '<option value="chapter"' + (_state.sort === 'chapter' ? ' selected' : '') + '>Sắp xếp: Theo chương (C1–C4)</option>' +
          '</select>' +
        '</div>' +
      '</div>' +

      '<!-- 4. DANH SÁCH CÂU LÀM SAI -->' +
      listHtml +
    '</div>';

    bindControls(container);
    renderMath(container);
    mountVisualsIn(container);
  }

  function ensureModalEl() {
    var modal = document.getElementById('wb-practice-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'wb-practice-modal';
    modal.className = 'wb-modal-overlay';
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePracticeSession();
    });
    document.body.appendChild(modal);
    return modal;
  }

  function makeEmptyDraft() {
    return { mc: '', tf: [null, null, null, null], short: '' };
  }

  function openPracticeSession() {
    var wb = root.VlxtWrongBank;
    if (!wb) return;
    var allItems = wb.getAll(getAccountKey());
    var filteredNeed = filterAndSortItems(allItems).filter(function (x) { return x.status !== 'mastered'; });
    var pool = filteredNeed.length ? filteredNeed : allItems.filter(function (x) { return x.status !== 'mastered'; });
    if (!pool.length) return;

    // Prioritize higher wrongCount first
    var ordered = pool.slice().sort(function (a, b) {
      return (Number(b.wrongCount) || 1) - (Number(a.wrongCount) || 1);
    }).slice(0, 20);

    _session = {
      open: true,
      items: ordered,
      idx: 0,
      draft: makeEmptyDraft(),
      checked: null,
      solvedCount: 0,
      wrongCount: 0,
      finished: false
    };
    renderPracticeModal();
  }

  function closePracticeSession() {
    _session.open = false;
    var modal = document.getElementById('wb-practice-modal');
    if (modal) modal.classList.remove('open');
    renderWrongBankTab();
  }

  function renderPracticeModal() {
    var modal = ensureModalEl();
    if (!_session.open) {
      modal.classList.remove('open');
      return;
    }
    modal.classList.add('open');

    if (_session.finished) {
      var totalS = _session.items.length;
      var pctS = totalS > 0 ? Math.round((_session.solvedCount / totalS) * 100) : 0;
      modal.innerHTML = '<div class="wb-modal-card">' +
        '<div class="wb-modal-head">' +
          '<span class="wb-modal-title"><i class="fa-solid fa-trophy" style="color:#fbbf24"></i> Hoàn Thành Phiên Phục Thù Câu Sai</span>' +
          '<button type="button" class="wb-modal-close" data-wb-modal="close">✕</button>' +
        '</div>' +
        '<div style="text-align:center;padding:24px 10px">' +
          '<div style="font-size:44px;font-weight:900;color:#34d399;margin-bottom:6px">' + _session.solvedCount + ' / ' + totalS + '</div>' +
          '<div style="font-size:15px;font-weight:700;color:#f8fafc;margin-bottom:8px">Chinh phục thành công ' + pctS + '% câu sai trong phiên ôn tập!</div>' +
          '<p style="font-size:13.5px;color:#94a3b8;max-width:520px;margin:0 auto 20px;line-height:1.6">Các câu em vừa làm đúng đã tự động chuyển sang mục <strong>Đã khắc phục</strong>. Những câu vẫn còn sai sẽ ở lại đầu danh sách để em ôn tiếp.</p>' +
          '<button type="button" class="wb-btn-primary" data-wb-modal="close"><i class="fa-solid fa-check"></i> Quay về Sổ Tay Câu Sai</button>' +
        '</div>' +
      '</div>';
      bindModalEvents(modal);
      return;
    }

    var item = _session.items[_session.idx];
    var chap = root.VlxtWrongBank.CHAPTER_META[item.chapter] || root.VlxtWrongBank.CHAPTER_META.OTHER;
    var pct = Math.round(((_session.idx + 1) / _session.items.length) * 100);
    var ctxHtml = item.deBaiChung ? '<div class="wb-context">' + fixFormulaStrings(stripModelSlotTags(item.deBaiChung)) + '</div>' : '';
    var stemHtml = '<div class="wb-stem">' + fixFormulaStrings(stripModelSlotTags(item.question || '')) + '</div>';

    var bodyHtml = _session.checked
      ? '<div class="wb-retry-banner ' + (_session.checked.ok ? 'ok' : 'bad') + '">' +
          '<span>' + (_session.checked.ok
            ? '<i class="fa-solid fa-circle-check"></i> Chính xác tuyệt đối! Câu này đã được đánh dấu Đã khắc phục.'
            : '<i class="fa-solid fa-circle-xmark"></i> Chưa chính xác' + (item.type === 'tf' ? (' (đúng ' + _session.checked.matchedCount + '/4 ý)') : '') + '. Xem kỹ đáp án chuẩn và lời giải bên dưới nhé!') +
          '</span>' +
        '</div>' +
        renderReviewBody(Object.assign({}, item, { lastUserAnswer: _session.checked.normalizedUserAnswer })) +
        '<div class="wb-explain-box"><div style="font-size:12px;font-weight:800;color:#38bdf8;margin-bottom:6px;text-transform:uppercase"><i class="fa-solid fa-chalkboard-user"></i> Lời giải chi tiết</div>' +
          (item.explain ? fixFormulaStrings(item.explain) : '<em>Đối chiếu đáp án chuẩn ở trên và ôn lại lý thuyết bài học nhé.</em>') +
        '</div>'
      : renderInteractiveRetryBody(item, _session.draft, '__MODAL__');

    modal.innerHTML = '<div class="wb-modal-card">' +
      '<div class="wb-modal-head">' +
        '<span class="wb-modal-title"><i class="fa-solid fa-bolt" style="color:#10b981"></i> Phòng Phục Thù Câu Sai · Câu ' + (_session.idx + 1) + ' / ' + _session.items.length + '</span>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<span class="wb-badge wb-badge-mastered">Đã vá: ' + _session.solvedCount + '</span>' +
          '<button type="button" class="wb-modal-close" data-wb-modal="close" aria-label="Đóng">✕</button>' +
        '</div>' +
      '</div>' +
      '<div class="wb-progress-track" style="margin-bottom:14px"><div class="wb-progress-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="wb-badges" style="margin-bottom:12px">' +
        '<span class="wb-badge" style="background:' + chap.color + '22;color:' + chap.color + ';border-color:' + chap.color + '55">' + escHtml(chap.short) + '</span>' +
        '<span class="wb-badge wb-badge-type">' + typeLabel(item.type) + '</span>' +
        '<span class="wb-badge wb-badge-repeat">Từng sai ' + (Number(item.wrongCount) || 1) + ' lần</span>' +
      '</div>' +
      ctxHtml +
      stemHtml +
      renderVisualBlock(item) +
      bodyHtml +
      '<div class="wb-actions" style="margin-top:16px">' +
        '<button type="button" class="wb-btn-ghost" data-wb-modal="close">Thoát phiên ôn</button>' +
        '<div class="wb-actions-right">' +
          (!_session.checked
            ? '<button type="button" class="wb-btn-primary" data-wb-modal="submit"><i class="fa-solid fa-check"></i> Kiểm tra đáp án</button>'
            : '<button type="button" class="wb-btn-primary" data-wb-modal="next">' + (_session.idx + 1 < _session.items.length ? 'Câu tiếp theo →' : 'Xem tổng kết phiên ôn →') + '</button>') +
        '</div>' +
      '</div>' +
    '</div>';

    bindModalEvents(modal);
    renderMath(modal);
    mountVisualsIn(modal);
  }

  function extractDraftAnswer(item, draft) {
    if (item.type === 'tf') return draft.tf;
    if (item.type === 'short') return draft.short;
    return draft.mc;
  }

  function bindModalEvents(modal) {
    modal.querySelectorAll('[data-wb-modal]').forEach(function (btn) {
      btn.onclick = function () {
        var act = btn.getAttribute('data-wb-modal');
        if (act === 'close') { closePracticeSession(); return; }
        if (act === 'submit') {
          var item = _session.items[_session.idx];
          var ans = extractDraftAnswer(item, _session.draft);
          var res = root.VlxtWrongBank.recordRetryResult(item.key, ans, getAccountKey());
          if (res) {
            _session.checked = res;
            _session.items[_session.idx] = res.item;
            if (res.ok) _session.solvedCount++; else _session.wrongCount++;
            renderPracticeModal();
          }
          return;
        }
        if (act === 'next') {
          if (_session.idx + 1 < _session.items.length) {
            _session.idx++;
            _session.draft = makeEmptyDraft();
            _session.checked = null;
          } else {
            _session.finished = true;
          }
          renderPracticeModal();
        }
      };
    });

    modal.querySelectorAll('[data-wb-action="pick-mc"]').forEach(function (btn) {
      btn.onclick = function () {
        _session.draft.mc = btn.getAttribute('data-wb-val');
        renderPracticeModal();
      };
    });
    modal.querySelectorAll('[data-wb-action="pick-tf"]').forEach(function (btn) {
      btn.onclick = function () {
        var i = Number(btn.getAttribute('data-wb-idx'));
        _session.draft.tf[i] = btn.getAttribute('data-wb-val') === 'true';
        renderPracticeModal();
      };
    });
    var shortInp = modal.querySelector('[data-wb-input="short"]');
    if (shortInp) {
      shortInp.oninput = function () { _session.draft.short = shortInp.value; };
      shortInp.onkeydown = function (e) {
        if (e.key === 'Enter') {
          var subBtn = modal.querySelector('[data-wb-modal="submit"]');
          if (subBtn) subBtn.click();
        }
      };
    }
    modal.querySelectorAll('[data-wb-action="toggle-media"]').forEach(function (btn) {
      btn.onclick = function () {
        var k = btn.getAttribute('data-wb-key');
        _state.showRealImg[k] = !_state.showRealImg[k];
        renderPracticeModal();
      };
    });
  }

  function bindControls(container) {
    var searchEl = container.querySelector('#wb-search-input');
    if (searchEl) {
      searchEl.oninput = function () {
        _state.search = searchEl.value;
        _state.pageLimit = 15;
        renderWrongBankTab();
        var nextInp = document.getElementById('wb-search-input');
        if (nextInp) { nextInp.focus(); nextInp.setSelectionRange(nextInp.value.length, nextInp.value.length); }
      };
    }
    var srcEl = container.querySelector('#wb-filter-source');
    if (srcEl) srcEl.onchange = function () { _state.source = srcEl.value; _state.pageLimit = 15; renderWrongBankTab(); };
    var typeEl = container.querySelector('#wb-filter-type');
    if (typeEl) typeEl.onchange = function () { _state.type = typeEl.value; _state.pageLimit = 15; renderWrongBankTab(); };
    var sortEl = container.querySelector('#wb-filter-sort');
    if (sortEl) sortEl.onchange = function () { _state.sort = sortEl.value; renderWrongBankTab(); };

    container.querySelectorAll('[data-wb-input="short"]').forEach(function (inp) {
      inp.oninput = function () {
        var k = inp.getAttribute('data-wb-key');
        if (_state.retrying[k]) _state.retrying[k].short = inp.value;
      };
    });

    container.onclick = function (e) {
      var btn = e.target.closest('[data-wb-action]');
      if (!btn) return;
      var act = btn.getAttribute('data-wb-action');
      var key = btn.getAttribute('data-wb-key');
      var val = btn.getAttribute('data-wb-val');
      var wb = root.VlxtWrongBank;
      var acc = getAccountKey();

      if (act === 'filter-status') { _state.status = val; _state.pageLimit = 15; renderWrongBankTab(); return; }
      if (act === 'filter-chapter') { _state.chapter = val; _state.pageLimit = 15; renderWrongBankTab(); return; }
      if (act === 'reset-filters') {
        _state.status = 'all'; _state.chapter = 'ALL'; _state.source = 'ALL'; _state.type = 'ALL'; _state.search = ''; _state.pageLimit = 15;
        renderWrongBankTab(); return;
      }
      if (act === 'load-more') { _state.pageLimit += 15; renderWrongBankTab(); return; }
      if (act === 'open-session') { openPracticeSession(); return; }
      if (act === 'clear-mastered') {
        if (typeof root.confirm !== 'function' || root.confirm('Xóa toàn bộ các câu đã chinh phục khỏi sổ tay? (Các câu cần ôn vẫn giữ nguyên)')) {
          wb.clearMastered(acc);
          renderWrongBankTab();
        }
        return;
      }
      if (act === 'toggle-explain' && key) {
        _state.expandedExplain[key] = !_state.expandedExplain[key];
        renderWrongBankTab(); return;
      }
      if (act === 'toggle-media' && key) {
        _state.showRealImg[key] = !_state.showRealImg[key];
        renderWrongBankTab(); return;
      }
      if (act === 'start-retry' && key) {
        _state.retrying[key] = makeEmptyDraft();
        renderWrongBankTab(); return;
      }
      if (act === 'cancel-retry' && key) {
        delete _state.retrying[key];
        renderWrongBankTab(); return;
      }
      if (act === 'pick-mc' && key) {
        if (!_state.retrying[key]) _state.retrying[key] = makeEmptyDraft();
        _state.retrying[key].mc = val;
        renderWrongBankTab(); return;
      }
      if (act === 'pick-tf' && key) {
        if (!_state.retrying[key]) _state.retrying[key] = makeEmptyDraft();
        var i = Number(btn.getAttribute('data-wb-idx'));
        _state.retrying[key].tf[i] = (val === 'true');
        renderWrongBankTab(); return;
      }
      if (act === 'submit-retry' && key) {
        var item = wb.getItem(key, acc);
        var draft = _state.retrying[key] || makeEmptyDraft();
        if (!item) return;
        var res = wb.recordRetryResult(key, extractDraftAnswer(item, draft), acc);
        if (res) {
          _state.retrying[key] = Object.assign({}, draft, { feedback: res });
          _state.expandedExplain[key] = true;
          renderWrongBankTab();
        }
        return;
      }
      if (act === 'mark-mastered' && key) {
        wb.markMastered(key, acc);
        delete _state.retrying[key];
        renderWrongBankTab(); return;
      }
      if (act === 'mark-review' && key) {
        wb.markNeedReview(key, acc);
        delete _state.retrying[key];
        renderWrongBankTab(); return;
      }
      if (act === 'delete' && key) {
        wb.removeItem(key, acc);
        delete _state.retrying[key];
        renderWrongBankTab(); return;
      }
    };
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && _session.open) {
      closePracticeSession();
    }
  });

  root.addEventListener('vlxt:wrong-bank-updated', function () {
    if (document.getElementById('tab-causai')) {
      var stats = root.VlxtWrongBank ? root.VlxtWrongBank.getStats(getAccountKey()) : null;
      if (stats) updateGlobalBadges(stats);
    }
  });

  root.addEventListener('load', function () {
    var tabEl = document.getElementById('tab-causai');
    if (tabEl) renderMath(tabEl);
  });

  root.vlxtRenderWrongBankTab = renderWrongBankTab;
  root.vlxtOpenWrongPracticeSession = openPracticeSession;
})(typeof window !== 'undefined' ? window : globalThis);
