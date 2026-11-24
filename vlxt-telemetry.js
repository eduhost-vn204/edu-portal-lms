/* ═══════════════════════════════════════════════════════════════════════════════
   VLXT TELEMETRY & EARLY ACCESS CAMPAIGN ENGINE (v2.0.0)
   - Quan ly Chien dich Trai Nghiem Som (25/11/2026 - 05/12/2026, dem nguoc 7 ngay)
   - Phan quyen kien thuc Early Access (2 chuong GD1, Bai 1 Lay Goc, 5 de dau DGNL, Phong Thi Thu)
   - Bao toan 100% quyen tai khoan dang dang ky / Paid Pro / Premium / VIP hien huu
   - Thu thap hanh vi nguoi dung toan trang (Active Dwell Time, Drop-off, Conversion Attribution, Live Presence)
   - Batching nhe qua Firebase RTDB REST API (0 lam cham UI, 0 nghen Google Apps Script)
   ═══════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var RTDB_ROOT = 'https://edu-portal-live-default-rtdb.firebaseio.com/support_chats/_vlxt_system';
  var LEGACY_GAS_URL = 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';

  var CFG_CACHE_KEY = 'vlxt_campaign_cfg_v1';
  var ANON_ID_KEY = 'vlxt_anon_id_v1';
  var EA_STARTED_PREFIX = 'vlxt_ea_started_';
  var EA_ZALO_PROMPT_PREFIX = 'vlxt_zalo_group_prompted_';
  var TRIGGER_KEY = 'vlxt_last_conv_trigger_v1';
  var SESSION_ID_KEY = 'vlxt_session_id_v1';
  var JOURNEY_LOCAL_KEY = 'vlxt_journey_summary_v1';

  var DEFAULT_CAMPAIGN_CONFIG = {
    id: 'early_access_20261125',
    title: 'Trải Nghiệm Sớm VIP',
    enabled: true,
    startAt: '2026-11-25T00:00:00+07:00',
    endAt: '2026-12-05T23:59:59+07:00',
    durationDays: 7,
    cutoffExistingTrialAt: '2026-11-24T15:00:00+07:00',
    zaloGroupUrl: 'https://zalo.me/g/str1pllhp4uxa3rtvnou',
    zaloTeacherUrl: 'https://zalo.me/0964885920',
    zaloTeacherPhone: '0964.885.920',
    updatedAt: 0
  };

  function safeStorageGet(store, key) {
    try { return store && typeof store.getItem === 'function' ? store.getItem(key) : null; } catch (e) { return null; }
  }
  function safeStorageSet(store, key, val) {
    try { if (store && typeof store.setItem === 'function') store.setItem(key, String(val)); } catch (e) {}
  }
  function safeStorageRemove(store, key) {
    try { if (store && typeof store.removeItem === 'function') store.removeItem(key); } catch (e) {}
  }

  function safeJsonParse(raw, fallback) {
    try {
      var v = JSON.parse(raw);
      return (v === null || v === undefined) ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeKey(s) {
    return String(s || '')
      .trim()
      .replace(/[.#$/\[\]\s]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 64) || 'unknown';
  }

  function normSdt(s) {
    return String(s || '').replace(/\D/g, '');
  }

  function getVnDateStr(ts) {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(ts ? new Date(ts) : new Date());
    } catch (e) {
      var d = new Date((ts || Date.now()) + 7 * 3600000);
      return d.toISOString().slice(0, 10);
    }
  }

  function getUser() {
    try {
      if (typeof global.vlxtGetUser === 'function') return global.vlxtGetUser();
      var raw = safeStorageGet(global.localStorage, 'vlxt_user_v2');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function isLoggedInUser(u) {
    var user = u || getUser();
    return Boolean(user && user.sdt && String(user.sdt).trim() !== '' && String(user.sdt).trim().toUpperCase() !== 'FREE');
  }

  function getPageFile() {
    try {
      var p = (global.location && global.location.pathname ? global.location.pathname.split('/').pop() : '') || 'index.html';
      return p.toLowerCase() || 'index.html';
    } catch (e) {
      return 'index.html';
    }
  }

  function getDeviceType() {
    try {
      var w = (global.innerWidth || (global.screen && global.screen.width) || 1280);
      var ua = (global.navigator && global.navigator.userAgent) || '';
      if (w <= 640 || /Android|iPhone|iPod/i.test(ua)) return 'mobile';
      if (w <= 1024 || /iPad|Tablet/i.test(ua)) return 'tablet';
      return 'desktop';
    } catch (e) {
      return 'desktop';
    }
  }

  function genId(prefix) {
    return (prefix || 'id') + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function getOrCreateAnonId() {
    var ls = global.localStorage;
    var existing = safeStorageGet(ls, ANON_ID_KEY);
    if (existing) return existing;
    var created = genId('anon');
    safeStorageSet(ls, ANON_ID_KEY, created);
    return created;
  }

  function getOrCreateSessionId() {
    var ss = global.sessionStorage;
    var existing = safeStorageGet(ss, SESSION_ID_KEY);
    if (existing) return existing;
    var created = genId('sess');
    safeStorageSet(ss, SESSION_ID_KEY, created);
    return created;
  }

  function detectTrafficSource() {
    try {
      var sp = new URLSearchParams((global.location && global.location.search) || '');
      var utm = sp.get('utm_source') || sp.get('src') || sp.get('ref') || '';
      if (utm) return String(utm).trim().slice(0, 40);
      if (sp.get('ttclid')) return 'tiktok';
      if (sp.get('fbclid')) return 'facebook';
      var ref = (typeof document !== 'undefined' && document.referrer) ? document.referrer : '';
      if (!ref) return 'direct';
      var low = ref.toLowerCase();
      if (low.indexOf('tiktok') >= 0) return 'tiktok';
      if (low.indexOf('facebook') >= 0 || low.indexOf('fb.') >= 0) return 'facebook';
      if (low.indexOf('zalo') >= 0) return 'zalo';
      if (low.indexOf('youtube') >= 0 || low.indexOf('youtu.be') >= 0) return 'youtube';
      if (low.indexOf('google') >= 0) return 'google';
      if (global.location && global.location.host && low.indexOf(global.location.host.toLowerCase()) >= 0) return 'internal';
      return 'referral';
    } catch (e) {
      return 'direct';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHẦN 1: QUẢN LÝ CHIẾN DỊCH TRẢI NGHIỆM SỚM & PHÂN QUYỀN KIẾN THỨC
  // ═══════════════════════════════════════════════════════════════════════════
  function getCampaignConfig() {
    var raw = safeStorageGet(global.localStorage, CFG_CACHE_KEY);
    var parsed = raw ? safeJsonParse(raw, null) : null;
    if (parsed && parsed.data && typeof parsed.data === 'object') {
      return Object.assign({}, DEFAULT_CAMPAIGN_CONFIG, parsed.data);
    }
    return Object.assign({}, DEFAULT_CAMPAIGN_CONFIG);
  }

  function saveCampaignConfigLocal(cfg) {
    var merged = Object.assign({}, DEFAULT_CAMPAIGN_CONFIG, cfg || {});
    safeStorageSet(global.localStorage, CFG_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: merged }));
    return merged;
  }

  function refreshCampaignConfig(force) {
    try {
      if (typeof fetch !== 'function') return Promise.resolve(getCampaignConfig());
      var raw = safeStorageGet(global.localStorage, CFG_CACHE_KEY);
      var parsed = raw ? safeJsonParse(raw, null) : null;
      if (!force && parsed && parsed.ts && (Date.now() - Number(parsed.ts)) < 5 * 60 * 1000 && parsed.data) {
        return Promise.resolve(Object.assign({}, DEFAULT_CAMPAIGN_CONFIG, parsed.data));
      }
      return fetch(RTDB_ROOT + '/campaign_config.json', { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (remoteCfg) {
          if (remoteCfg && typeof remoteCfg === 'object') {
            var merged = saveCampaignConfigLocal(remoteCfg);
            updateCountdownUI();
            return merged;
          }
          return getCampaignConfig();
        })
        .catch(function () { return getCampaignConfig(); });
    } catch (e) {
      return Promise.resolve(getCampaignConfig());
    }
  }

  function isPaidFullUser(u) {
    var user = u || getUser();
    try {
      if (typeof global.isTestAccount === 'function' && global.isTestAccount()) return true;
    } catch (e) {}
    if (!user) {
      return safeStorageGet(global.localStorage, 'vlxt_is_paid') === 'true';
    }
    if (user.isPaid === true) {
      if (!user.proExpiry || Number(user.proExpiry) > Date.now()) return true;
    }
    var tier = String(user.loaiTK || '').trim().toLowerCase();
    if (tier === 'pro' || tier === 'premium') return true;
    if (safeStorageGet(global.localStorage, 'vlxt_is_paid') === 'true') return true;
    var expiry = Number(user.proExpiry || user.trialExpiry || 0);
    // Tai khoan VIP tra phi (> 8 ngay con lai) hoac co ma goi tra phi
    if (tier === 'vip' && expiry > Date.now() + 8 * 86400000) return true;
    if (user.planCode && expiry > Date.now()) return true;
    return false;
  }

  // Tai khoan dang ky truoc khi bat chien dich (24/11/2026 15:00) van giu nguyen quyen trial cu
  function isLegacyPreCampaignTrial(u) {
    var user = u || getUser();
    if (!user) return false;
    var tier = String(user.loaiTK || '').trim().toLowerCase();
    if (tier !== 'vip') return false;
    var expiry = Number(user.trialExpiry || 0);
    if (!expiry || expiry <= Date.now()) return false;
    var cfg = getCampaignConfig();
    var cutoffMs = Date.parse(cfg.cutoffExistingTrialAt || DEFAULT_CAMPAIGN_CONFIG.cutoffExistingTrialAt);
    if (isNaN(cutoffMs)) return false;
    var approxCreatedMs = expiry - 7 * 86400000;
    return approxCreatedMs < cutoffMs;
  }

  function hasFullAccess(u) {
    return isPaidFullUser(u) || isLegacyPreCampaignTrial(u);
  }

  function formatDurationVN(ms) {
    var totalSec = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(totalSec / 86400);
    var h = Math.floor((totalSec % 86400) / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    if (d > 0) return d + ' ngày ' + String(h).padStart(2, '0') + 'g ' + String(m).padStart(2, '0') + 'p';
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function getUserEarlyAccessState(u, nowMs) {
    var user = u || getUser();
    var cfg = getCampaignConfig();
    var now = Number(nowMs || Date.now());
    var startMs = Date.parse(cfg.startAt) || Date.parse(DEFAULT_CAMPAIGN_CONFIG.startAt);
    var endMs = Date.parse(cfg.endAt) || Date.parse(DEFAULT_CAMPAIGN_CONFIG.endAt);
    var durationMs = Math.max(1, Number(cfg.durationDays || 7)) * 86400000;

    var paidFull = isPaidFullUser(user);
    var legacyTrial = isLegacyPreCampaignTrial(user);
    var full = paidFull || legacyTrial;

    if (!cfg.enabled || now > endMs) {
      return {
        enabled: !!cfg.enabled,
        active: false,
        isPaidFull: paidFull,
        isLegacyTrial: legacyTrial,
        hasFullAccess: full,
        inWindow: false,
        beforeStart: now < startMs,
        ended: now > endMs,
        startedAt: startMs,
        expiresAt: endMs,
        remainingMs: 0,
        formattedShort: now > endMs ? 'Đã kết thúc đợt trải nghiệm sớm' : 'Đang tạm đóng',
        windowLabel: '25/11 – 05/12',
        config: cfg
      };
    }

    var sdtKey = isLoggedInUser(user) ? normSdt(user.sdt) : 'guest';
    var startedKey = EA_STARTED_PREFIX + (cfg.id || 'ea') + '_' + (sdtKey || 'guest');
    var storedStart = Number(safeStorageGet(global.localStorage, startedKey) || 0);
    var effectiveStart;

    if (now < startMs) {
      // Cho phep xem truoc ngay hom nay, moc dem nguoc 7 ngay bat dau tu startAt
      effectiveStart = startMs;
    } else {
      if (!storedStart || storedStart < startMs || storedStart > endMs) {
        effectiveStart = now;
        if (sdtKey && sdtKey !== 'guest') {
          safeStorageSet(global.localStorage, startedKey, String(effectiveStart));
        }
      } else {
        effectiveStart = storedStart;
      }
    }

    var expiresAt = Math.min(effectiveStart + durationMs, endMs);
    var remainingMs = now < startMs ? Math.min(durationMs, endMs - startMs) : Math.max(0, expiresAt - now);
    var active = Boolean(cfg.enabled && (now < startMs || remainingMs > 0));

    return {
      enabled: true,
      active: active,
      isPaidFull: paidFull,
      isLegacyTrial: legacyTrial,
      hasFullAccess: full,
      inWindow: now >= startMs && now <= endMs,
      beforeStart: now < startMs,
      ended: false,
      startedAt: effectiveStart,
      expiresAt: expiresAt,
      remainingMs: remainingMs,
      formattedShort: now < startMs
        ? ('Còn ' + (cfg.durationDays || 7) + ' ngày · 25/11–05/12')
        : ('Còn ' + formatDurationVN(remainingMs)),
      windowLabel: '25/11 – 05/12',
      config: cfg
    };
  }

  function isLayGocCourseName(name) {
    var n = String(name || '').toLowerCase();
    return n.indexOf('lấy gốc') >= 0 || n.indexOf('lay goc') >= 0 || n.indexOf('5 ngày') >= 0 || n.indexOf('5 ngay') >= 0;
  }

  function isGd1CourseName(name) {
    var n = String(name || '').toLowerCase();
    if (isLayGocCourseName(n)) return false;
    if (n.indexOf('gđ2') >= 0 || n.indexOf('gd2') >= 0 || n.indexOf('gđ3') >= 0 || n.indexOf('gd3') >= 0 || n.indexOf('gđ4') >= 0 || n.indexOf('gd4') >= 0) return false;
    return n.indexOf('gđ1') >= 0 || n.indexOf('gd1') >= 0 || n.indexOf('lý thuyết') >= 0 || n.indexOf('vật lý 12') >= 0 || n.indexOf('khóa 12') >= 0;
  }

  function isAdvancedStageCourseName(name) {
    var n = String(name || '').toLowerCase();
    return n.indexOf('gđ2') >= 0 || n.indexOf('gd2') >= 0 || n.indexOf('gđ3') >= 0 || n.indexOf('gd3') >= 0 || n.indexOf('gđ4') >= 0 || n.indexOf('gd4') >= 0 || n.indexOf('tổng ôn') >= 0 || n.indexOf('luyện đề') >= 0;
  }

  function isFreeChapterName(chapterName) {
    var ch = String(chapterName || '').toLowerCase();
    if (!ch) return true;
    if (ch.indexOf('chương 3') >= 0 || ch.indexOf('chuong 3') >= 0 || ch.indexOf('từ trường') >= 0 || ch.indexOf('tu truong') >= 0 ||
        ch.indexOf('chương 4') >= 0 || ch.indexOf('chuong 4') >= 0 || ch.indexOf('hạt nhân') >= 0 || ch.indexOf('hat nhan') >= 0) {
      return false;
    }
    return ch.indexOf('chương 1') >= 0 || ch.indexOf('chuong 1') >= 0 || ch.indexOf('nhiệt') >= 0 ||
           ch.indexOf('chương 2') >= 0 || ch.indexOf('chuong 2') >= 0 || ch.indexOf('khí') >= 0;
  }

  function canAccessCourseChapter(courseName, chapterName, u) {
    if (hasFullAccess(u)) return true;
    if (isAdvancedStageCourseName(courseName)) return false;
    if (isLayGocCourseName(courseName)) return true; // Tung bai duoc kiem tra o canAccessLayGocLesson
    return isFreeChapterName(chapterName);
  }

  function canAccessLayGocLesson(courseName, lessonIndexZeroBased, lessonObj, u) {
    if (hasFullAccess(u)) return true;
    if (!isLayGocCourseName(courseName)) return true;
    if (typeof lessonIndexZeroBased === 'number' && lessonIndexZeroBased === 0) return true;
    if (typeof lessonIndexZeroBased === 'number' && lessonIndexZeroBased > 0) return false;
    var lname = String((lessonObj && (lessonObj.name || lessonObj.TenBai)) || '').trim();
    if (/^\s*(?:ngày|bài|buổi)\s*1(?:\b|[:.\-\s])/i.test(lname)) return true;
    return false;
  }

  function canAccessDgnlExam(examNumber, u) {
    if (hasFullAccess(u)) return true;
    var n = Number(examNumber);
    return n >= 1 && n <= 5;
  }

  function canAccessPhongThiThu(u) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return false;
    if (hasFullAccess(user)) return true;
    return getUserEarlyAccessState(user).active;
  }

  function requireAuthOrRedirect(triggerName, customFromUrl) {
    var user = getUser();
    if (isLoggedInUser(user)) return user;
    if (triggerName) setConversionTrigger(triggerName, 'Chuyển đăng nhập từ ' + triggerName);
    if (typeof global.location !== 'undefined') {
      var target = customFromUrl || ((global.location.pathname.split('/').pop() || 'index.html') + (global.location.search || '') + (global.location.hash || ''));
      var url = 'login.html?from=' + encodeURIComponent(target) + (triggerName ? ('&trigger=' + encodeURIComponent(triggerName)) : '');
      if (typeof global.location.replace === 'function') {
        global.location.replace(url);
      } else {
        global.location.href = url;
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHẦN 2: CHIP ĐẾM NGƯỢC & MODAL CHÀO MỪNG NHÓM ZALO (ZERO AI GLOW)
  // ═══════════════════════════════════════════════════════════════════════════
  function injectEarlyAccessCSS() {
    if (typeof document === 'undefined' || !document.head) return;
    if (document.getElementById('vlxt-ea-css')) return;
    var s = document.createElement('style');
    s.id = 'vlxt-ea-css';
    s.textContent = [
      '.vlxt-ea-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:999px;border:1px solid rgba(245,158,11,0.45);background:rgba(245,158,11,0.12);color:#fbbf24;font-family:"Inter",system-ui,sans-serif;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background-color .16s ease,border-color .16s ease;}',
      '.vlxt-ea-chip:hover{background:rgba(245,158,11,0.2);border-color:rgba(245,158,11,0.7);color:#fef3c7;}',
      '.vlxt-ea-chip .ea-dot{width:7px;height:7px;border-radius:50%;background:#f59e0b;flex-shrink:0;}',
      '@media(max-width:780px){.vlxt-ea-chip.in-topbar{display:none!important;}}',
      '.vlxt-ea-modal-bd{position:fixed;inset:0;z-index:99994;background:rgba(2,6,23,0.78);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:16px;}',
      '.vlxt-ea-modal-bd.open{display:flex;}',
      '.vlxt-ea-modal{width:100%;max-width:500px;background:#0f172a;border:1px solid rgba(56,189,248,0.3);border-radius:18px;padding:24px;color:#f1f5f9;font-family:"Inter",system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,0.65);position:relative;max-height:92vh;overflow-y:auto;}',
      '.vlxt-ea-close{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:8px;border:1px solid rgba(148,163,184,0.2);background:rgba(255,255,255,0.05);color:#94a3b8;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
      '.vlxt-ea-close:hover{background:rgba(255,255,255,0.12);color:#fff;}',
      '.vlxt-ea-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(245,158,11,0.14);border:1px solid rgba(245,158,11,0.35);color:#fbbf24;font-size:11.5px;font-weight:800;margin-bottom:10px;max-width:calc(100% - 42px);line-height:1.35;}',
      '.vlxt-ea-title{font-size:19px;font-weight:800;color:#ffffff;line-height:1.35;margin-bottom:8px;}',
      '.vlxt-ea-sub{font-size:13.5px;color:#cbd5e1;line-height:1.55;margin-bottom:14px;}',
      '.vlxt-ea-list{list-style:none;padding:12px 14px;margin:0 0 16px;border-radius:12px;background:#131c31;border:1px solid rgba(148,163,184,0.18);display:flex;flex-direction:column;gap:8px;font-size:13px;color:#e2e8f0;}',
      '.vlxt-ea-list li{display:flex;align-items:flex-start;gap:8px;line-height:1.45;}',
      '.vlxt-ea-actions{display:flex;flex-direction:column;gap:9px;}',
      '.vlxt-ea-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px 16px;border-radius:11px;font-size:13.5px;font-weight:800;text-decoration:none;cursor:pointer;border:none;font-family:inherit;transition:background-color .16s ease,transform .12s ease;}',
      '.vlxt-ea-btn:active{transform:scale(0.98);}',
      '.vlxt-ea-btn.zalo{background:#0068ff;color:#ffffff;}',
      '.vlxt-ea-btn.zalo:hover{background:#1677ff;}',
      '.vlxt-ea-btn.vip{background:#0b84f3;color:#ffffff;}',
      '.vlxt-ea-btn.vip:hover{background:#1d90fa;}',
      '.vlxt-ea-btn.ghost{background:rgba(255,255,255,0.06);color:#cbd5e1;border:1px solid rgba(148,163,184,0.25);}',
      '.vlxt-ea-btn.ghost:hover{background:rgba(255,255,255,0.12);color:#fff;}'
    ].join('');
    document.head.appendChild(s);
  }

  function updateCountdownUI() {
    if (typeof document === 'undefined') return;
    var el = document.getElementById('vlxt-ea-chip-text');
    var modalTimerEl = document.getElementById('vlxt-ea-modal-timer');
    var st = getUserEarlyAccessState(getUser());
    if (el) el.textContent = st.formattedShort;
    if (modalTimerEl) modalTimerEl.textContent = st.formattedShort + ' (25/11 – 05/12/2026)';
  }

  function openEarlyAccessModal(mode) {
    if (typeof document === 'undefined' || !document.body) return;
    injectEarlyAccessCSS();
    var bd = document.getElementById('vlxt-ea-modal-bd');
    if (bd) bd.remove();

    var cfg = getCampaignConfig();
    var st = getUserEarlyAccessState(getUser());
    var isWelcome = mode === 'welcome';
    var user = getUser();
    var nameDisplay = (user && user.hoten) ? escHtml(user.hoten) : 'em';

    bd = document.createElement('div');
    bd.id = 'vlxt-ea-modal-bd';
    bd.className = 'vlxt-ea-modal-bd open';
    bd.innerHTML = [
      '<div class="vlxt-ea-modal" role="dialog" aria-modal="true" aria-labelledby="vlxt-ea-modal-title">',
      '  <button type="button" class="vlxt-ea-close" aria-label="Đóng" id="vlxt-ea-close-btn">✕</button>',
      '  <div class="vlxt-ea-badge">⏳ ' + (isWelcome ? 'ĐĂNG KÝ THÀNH CÔNG · TRẢI NGHIỆM SỚM' : 'CHIẾN DỊCH TRẢI NGHIỆM SỚM') + '</div>',
      '  <h3 class="vlxt-ea-title" id="vlxt-ea-modal-title">' + (isWelcome ? ('Chào mừng ' + nameDisplay + ' vào nhóm thành viên Web VLXT!') : 'Quyền Lợi Đợt Trải Nghiệm Sớm (7 Ngày)') + '</h3>',
      '  <p class="vlxt-ea-sub">' + (isWelcome
        ? 'Em đã mở khóa trải nghiệm miễn phí đợt <strong>25/11 – 05/12/2026</strong>. Hãy tham gia ngay <strong>Nhóm Zalo Thành Viên Web</strong> để nhận lịch live chữa đề, tài liệu PDF và thông báo ưu đãi gói VIP từ Thầy Xuân Trường.'
        : 'Đợt trải nghiệm sớm diễn ra từ <strong>25/11 đến 05/12/2026</strong>. Thời hạn còn lại của em: <strong id="vlxt-ea-modal-timer" style="color:#fbbf24">' + escHtml(st.formattedShort) + '</strong>.') + '</p>',
      '  <ul class="vlxt-ea-list">',
      '    <li><span>✅</span><span><strong>Khóa GĐ1:</strong> Mở miễn phí trọn vẹn Chương 1 (Nhiệt) &amp; Chương 2 (Khí lí tưởng).</span></li>',
      '    <li><span>✅</span><span><strong>Khóa 5 Ngày Lấy Gốc:</strong> Mở miễn phí Bài 1 (Ngày 1) chuẩn hóa nền tảng.</span></li>',
      '    <li><span>✅</span><span><strong>Sảnh 50 Đề 60 FPS:</strong> Mở miễn phí 5 đề đầu (Đề 01 – Đề 05) kèm mô phỏng &amp; chẩn đoán lỗ hổng.</span></li>',
      '    <li><span>✅</span><span><strong>Phòng Thi Thử CBT:</strong> Mở trải nghiệm làm đề thi thử trực tuyến chuẩn cấu trúc Bộ.</span></li>',
      '  </ul>',
      '  <div class="vlxt-ea-actions">',
      '    <a href="' + escHtml(cfg.zaloGroupUrl) + '" target="_blank" rel="noopener" id="vlxt-ea-join-zalo-btn" class="vlxt-ea-btn zalo">👥 Tham gia Nhóm Zalo Thành Viên Web</a>',
      '    <a href="goi-hoc.html?reserve=1&trigger=' + encodeURIComponent(isWelcome ? 'welcome_modal' : 'ea_countdown_chip') + '" id="vlxt-ea-goihoc-btn" class="vlxt-ea-btn vip">👑 Giữ Suất Ưu Đãi / Nâng Cấp Full VIP</a>',
      '    <button type="button" id="vlxt-ea-continue-btn" class="vlxt-ea-btn ghost">Tiếp tục học ngay →</button>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(bd);

    function close() { bd.remove(); }
    bd.addEventListener('click', function (e) { if (e.target === bd) close(); });
    var cBtn = document.getElementById('vlxt-ea-close-btn');
    var contBtn = document.getElementById('vlxt-ea-continue-btn');
    var zBtn = document.getElementById('vlxt-ea-join-zalo-btn');
    var gBtn = document.getElementById('vlxt-ea-goihoc-btn');
    if (cBtn) cBtn.onclick = close;
    if (contBtn) contBtn.onclick = close;
    if (zBtn) zBtn.onclick = function () {
      track('zalo_group_click', { source: isWelcome ? 'welcome_modal' : 'ea_info_modal', url: cfg.zaloGroupUrl });
    };
    if (gBtn) gBtn.onclick = function () {
      setConversionTrigger(isWelcome ? 'welcome_modal' : 'ea_countdown_chip', 'Bấm từ modal Trải nghiệm sớm');
      track('conversion_intent', { target: 'goi-hoc.html', trigger: isWelcome ? 'welcome_modal' : 'ea_countdown_chip' });
    };
  }

  function renderCountdownChip() {
    if (typeof document === 'undefined' || !document.body) return;
    var page = getPageFile();
    if (page === 'phong-thi-thu.html' || page === 'thithu.html' || page === 'login.html') return;

    var user = getUser();
    if (hasFullAccess(user)) return;
    var st = getUserEarlyAccessState(user);
    if (!st.active) return;

    injectEarlyAccessCSS();
    var existing = document.getElementById('vlxt-ea-chip');
    if (existing) {
      updateCountdownUI();
      return;
    }

    var host = document.querySelector('.nav-right-wrap');
    if (!host) return;
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.id = 'vlxt-ea-chip';
    chip.className = 'vlxt-ea-chip in-topbar';
    chip.title = 'Xem quyền lợi Trải nghiệm sớm (25/11–05/12)';
    chip.innerHTML = '<span class="ea-dot"></span><span id="vlxt-ea-chip-text">' + escHtml(st.formattedShort) + '</span>';
    chip.onclick = function () {
      setConversionTrigger('ea_countdown_chip', 'Bấm đồng hồ đếm ngược 7 ngày');
      track('ea_chip_click', { page: page });
      openEarlyAccessModal('info');
    };
    host.insertBefore(chip, host.firstChild);
  }

  function maybeShowZaloGroupWelcomeModal(u, force) {
    if (typeof document === 'undefined' || !document.body) return;
    var page = getPageFile();
    if (page === 'login.html' || page === 'phong-thi-thu.html' || page === 'thithu.html') return;
    var user = u || getUser();
    if (!isLoggedInUser(user)) return;

    var sdt = normSdt(user.sdt) || safeKey(user.sdt);
    var flagKey = EA_ZALO_PROMPT_PREFIX + sdt;
    var sp = null;
    try { sp = new URLSearchParams(global.location.search || ''); } catch (e) {}
    var hasWelcomeParam = Boolean(sp && sp.get('welcome') === '1');
    var justRegistered = safeStorageGet(global.localStorage, 'vlxt_just_registered') === '1';

    if (!force && !hasWelcomeParam && !justRegistered) {
      if (safeStorageGet(global.localStorage, flagKey) === '1') return;
      // Chi tu bat o lan dau khi moi dang ky hoac lan dau dang nhap trong dot 25/11-05/12
      if (!getUserEarlyAccessState(user).active) return;
    }

    safeStorageRemove(global.localStorage, 'vlxt_just_registered');
    safeStorageSet(global.localStorage, flagKey, '1');
    setTimeout(function () {
      openEarlyAccessModal('welcome');
    }, 900);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHẦN 3: HỆ THỐNG TELEMETRY THU THẬP HÀNH VI NGƯỜI DÙNG
  // ═══════════════════════════════════════════════════════════════════════════
  var _queue = [];
  var _maxScrollPct = 0;
  var _activeSeconds = 0;
  var _lastInteractAt = Date.now();
  var _videoPlaying = false;
  var _pageEnteredAt = Date.now();
  var _flushing = false;
  var _presenceTimer = null;
  var _flushTimer = null;
  var _dwellTimer = null;
  var _errCount = 0;
  var _context = {
    courseName: '',
    lessonKey: '',
    lessonName: '',
    examNumber: null,
    examTitle: '',
    questionNum: null,
    questionId: '',
    partName: ''
  };

  function getConversionTrigger() {
    var s = safeStorageGet(global.sessionStorage, TRIGGER_KEY) || safeStorageGet(global.localStorage, TRIGGER_KEY);
    if (!s) return { trigger: 'direct_browse', label: 'Truy cập tự nhiên', ts: Date.now() };
    var parsed = safeJsonParse(s, null);
    return (parsed && parsed.trigger) ? parsed : { trigger: String(s), label: String(s), ts: Date.now() };
  }

  function setConversionTrigger(trigger, label) {
    if (!trigger) return;
    var payload = JSON.stringify({ trigger: String(trigger).slice(0, 80), label: String(label || trigger).slice(0, 140), page: getPageFile(), ts: Date.now() });
    safeStorageSet(global.sessionStorage, TRIGGER_KEY, payload);
    safeStorageSet(global.localStorage, TRIGGER_KEY, payload);
  }

  function getActorInfo() {
    var user = getUser();
    var anonId = getOrCreateAnonId();
    var logged = isLoggedInUser(user);
    var sdt = logged ? normSdt(user.sdt) || String(user.sdt).trim() : '';
    var actorKey = logged ? ('hs_' + safeKey(sdt)) : safeKey(anonId);
    var tier = 'guest';
    if (logged) {
      if (isPaidFullUser(user)) tier = String(user.loaiTK || 'pro').toLowerCase();
      else if (isLegacyPreCampaignTrial(user)) tier = 'legacy_vip';
      else tier = getUserEarlyAccessState(user).active ? 'early_access' : String(user.loaiTK || 'free').toLowerCase();
    }
    return {
      actorKey: actorKey,
      anonId: anonId,
      sessionId: getOrCreateSessionId(),
      logged: logged,
      sdt: sdt,
      hoten: logged ? String(user.hoten || user.name || sdt) : 'Khách',
      lop: logged ? String(user.lop || '') : '',
      tier: tier,
      isPaidFull: logged ? isPaidFullUser(user) : false
    };
  }

  function buildContextLabel() {
    if (_context.examNumber) {
      return 'Đề ' + String(_context.examNumber).padStart(2, '0') + (_context.questionNum ? (' · Câu ' + _context.questionNum) : '');
    }
    if (_context.lessonName || _context.lessonKey) {
      return (_context.courseName ? (_context.courseName.slice(0, 28) + ' · ') : '') + (_context.lessonName || _context.lessonKey);
    }
    if (_context.courseName) return _context.courseName;
    return getPageFile();
  }

  function track(type, data) {
    try {
      var actor = getActorInfo();
      var trig = getConversionTrigger();
      var evt = {
        id: genId('ev'),
        ts: Date.now(),
        date: getVnDateStr(),
        type: String(type || 'custom').slice(0, 48),
        actorKey: actor.actorKey,
        anonId: actor.anonId,
        sessionId: actor.sessionId,
        sdt: actor.sdt,
        hoten: actor.hoten,
        lop: actor.lop,
        tier: actor.tier,
        page: getPageFile(),
        target: data && data.target ? String(data.target).slice(0, 120) : '',
        label: data && data.label ? String(data.label).slice(0, 180) : '',
        courseName: (data && data.courseName) || _context.courseName || '',
        lessonKey: (data && data.lessonKey) || _context.lessonKey || '',
        lessonName: (data && data.lessonName) || _context.lessonName || '',
        examNumber: (data && data.examNumber !== undefined) ? data.examNumber : (_context.examNumber || null),
        questionNum: (data && data.questionNum !== undefined) ? data.questionNum : (_context.questionNum || null),
        questionId: (data && data.questionId) || _context.questionId || '',
        activeSec: _activeSeconds,
        maxScrollPct: _maxScrollPct,
        deviceType: getDeviceType(),
        source: detectTrafficSource(),
        trigger: (data && data.trigger) || trig.trigger || 'direct_browse',
        meta: (data && data.meta && typeof data.meta === 'object') ? data.meta : (data || {})
      };
      _queue.push(evt);
      updateLocalJourneySummary(actor, evt);
      if (_queue.length >= 12) flush(false);
    } catch (e) {}
  }

  function updateLocalJourneySummary(actor, evt) {
    try {
      var raw = safeStorageGet(global.localStorage, JOURNEY_LOCAL_KEY);
      var j = raw ? safeJsonParse(raw, {}) : {};
      j.actorKey = actor.actorKey;
      j.sdt = actor.sdt || j.sdt || '';
      j.anonId = actor.anonId;
      j.hoten = actor.hoten || j.hoten || '';
      j.lop = actor.lop || j.lop || '';
      j.tier = actor.tier;
      j.firstSource = j.firstSource || evt.source || 'direct';
      j.lastPage = evt.page;
      j.lastContext = buildContextLabel();
      j.lastTrigger = evt.trigger;
      j.deviceType = evt.deviceType;
      j.lastSeen = evt.ts;
      if (!Array.isArray(j.pagesVisited)) j.pagesVisited = [];
      if (evt.page && j.pagesVisited.indexOf(evt.page) === -1) j.pagesVisited.push(evt.page);
      if (!Array.isArray(j.timeline)) j.timeline = [];
      j.timeline.push({
        ts: evt.ts,
        type: evt.type,
        page: evt.page,
        label: evt.label || evt.target || buildContextLabel(),
        activeSec: evt.activeSec
      });
      if (j.timeline.length > 25) j.timeline = j.timeline.slice(-25);
      safeStorageSet(global.localStorage, JOURNEY_LOCAL_KEY, JSON.stringify(j));
    } catch (e) {}
  }

  function flush(useKeepalive) {
    if (typeof fetch !== 'function') return Promise.resolve();
    if (_flushing && !useKeepalive) return Promise.resolve();
    if (!_queue.length) return Promise.resolve();

    var batch = _queue.splice(0, 30);
    _flushing = true;

    var byDate = {};
    batch.forEach(function (ev) {
      var d = ev.date || getVnDateStr(ev.ts);
      if (!byDate[d]) byDate[d] = {};
      byDate[d][ev.id] = ev;
    });

    var reqs = Object.keys(byDate).map(function (day) {
      return fetch(RTDB_ROOT + '/events/' + encodeURIComponent(day) + '.json', {
        method: 'PATCH',
        keepalive: !!useKeepalive,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(byDate[day])
      }).catch(function () {});
    });

    try {
      var rawJ = safeStorageGet(global.localStorage, JOURNEY_LOCAL_KEY);
      var j = rawJ ? safeJsonParse(rawJ, null) : null;
      if (j && j.actorKey) {
        reqs.push(fetch(RTDB_ROOT + '/user_journeys/' + encodeURIComponent(j.actorKey) + '.json', {
          method: 'PATCH',
          keepalive: !!useKeepalive,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(j)
        }).catch(function () {}));
      }
    } catch (e) {}

    return Promise.all(reqs).finally(function () { _flushing = false; });
  }

  function pushLivePresence(useKeepalive) {
    if (typeof fetch !== 'function') return Promise.resolve();
    var actor = getActorInfo();
    var payload = {
      actorKey: actor.actorKey,
      anonId: actor.anonId,
      sdt: actor.sdt,
      hoten: actor.hoten,
      lop: actor.lop,
      tier: actor.tier,
      isPaidFull: actor.isPaidFull,
      page: getPageFile(),
      contextLabel: buildContextLabel(),
      courseName: _context.courseName || '',
      lessonKey: _context.lessonKey || '',
      examNumber: _context.examNumber || null,
      questionNum: _context.questionNum || null,
      activeSecSession: _activeSeconds,
      deviceType: getDeviceType(),
      source: detectTrafficSource(),
      lastSeen: Date.now()
    };
    return fetch(RTDB_ROOT + '/live_presence/' + encodeURIComponent(actor.actorKey) + '.json', {
      method: 'PUT',
      keepalive: !!useKeepalive,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(function () {});
  }

  function setContext(partial) {
    if (!partial || typeof partial !== 'object') return;
    Object.keys(partial).forEach(function (k) {
      if (partial[k] !== undefined) _context[k] = partial[k];
    });
  }

  function getContext() {
    return Object.assign({
      page: getPageFile(),
      url: (global.location && global.location.href) ? global.location.href : '',
      contextLabel: buildContextLabel(),
      activeSec: _activeSeconds,
      deviceType: getDeviceType()
    }, _context);
  }

  function submitVipReservation(payload) {
    if (typeof fetch !== 'function') return Promise.resolve({ ok: false });
    var actor = getActorInfo();
    var trig = getConversionTrigger();
    var jRaw = safeStorageGet(global.localStorage, JOURNEY_LOCAL_KEY);
    var j = jRaw ? safeJsonParse(jRaw, {}) : {};
    var id = genId('rsv');
    var record = {
      id: id,
      sdt: (payload && payload.sdt) || actor.sdt || '',
      hoten: (payload && payload.hoten) || actor.hoten || 'Học sinh',
      lop: (payload && payload.lop) || actor.lop || '',
      planCode: (payload && payload.planCode) || 'NAM399K',
      planName: (payload && payload.planName) || 'Trọn Khóa Cả Năm (XPS 2k9)',
      amount: Number((payload && payload.amount) || 399000),
      reasonSelected: (payload && payload.reasonSelected) || '',
      note: (payload && payload.note) || '',
      lastTrigger: trig.trigger || 'goi_hoc',
      triggerLabel: trig.label || '',
      pagesVisited: j.pagesVisited || [getPageFile()],
      totalActiveSec: _activeSeconds,
      deviceType: getDeviceType(),
      source: j.firstSource || detectTrafficSource(),
      status: 'new',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    track('vip_reserve_submit', {
      target: record.planCode,
      label: record.reasonSelected || record.planName,
      trigger: record.lastTrigger,
      meta: { planCode: record.planCode, reason: record.reasonSelected }
    });
    return fetch(RTDB_ROOT + '/vip_reservations/' + encodeURIComponent(id) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return flush(true).then(function () { return { ok: true, id: id, record: record }; });
    });
  }

  function submitFeedbackReport(payload) {
    if (typeof fetch !== 'function') return Promise.resolve({ ok: false });
    var actor = getActorInfo();
    var ctx = getContext();
    var id = genId('fb');
    var record = {
      id: id,
      type: (payload && payload.type) === 'idea' ? 'idea' : 'bug',
      category: (payload && payload.category) || 'general',
      rating: (payload && payload.rating) ? Number(payload.rating) : null,
      message: String((payload && payload.message) || '').trim().slice(0, 1500),
      contactPhone: String((payload && payload.contactPhone) || actor.sdt || '').trim(),
      contactName: String((payload && payload.contactName) || actor.hoten || 'Khách').trim(),
      lop: actor.lop || '',
      anonId: actor.anonId,
      page: ctx.page,
      pageUrl: ctx.url,
      context: {
        label: ctx.contextLabel,
        courseName: ctx.courseName || '',
        lessonKey: ctx.lessonKey || '',
        lessonName: ctx.lessonName || '',
        examNumber: ctx.examNumber || null,
        examTitle: ctx.examTitle || '',
        questionNum: ctx.questionNum || null,
        questionId: ctx.questionId || '',
        partName: ctx.partName || ''
      },
      deviceInfo: getDeviceType() + ' · ' + ((global.innerWidth || 0) + 'x' + (global.innerHeight || 0)),
      lastError: safeStorageGet(global.sessionStorage, 'vlxt_last_js_err') || '',
      status: 'open',
      adminNote: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    track('feedback_submitted', {
      target: record.type,
      label: record.category + ': ' + record.message.slice(0, 60)
    });
    return fetch(RTDB_ROOT + '/feedback_reports/' + encodeURIComponent(id) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return flush(true).then(function () { return { ok: true, id: id, record: record }; });
    });
  }

  // Tuong thich nguoc voi window.vlxtLog cu
  function legacyCompatibleLog(hanhdong, chitiet) {
    track('legacy_log', { target: String(hanhdong || ''), label: String(chitiet || '') });
    try {
      var u = getUser();
      if (!u || !u.sdt || typeof fetch !== 'function') return;
      var cached = safeJsonParse(safeStorageGet(global.localStorage, 'vlxt_logok'), null);
      if (cached && cached.ok === true) {
        fetch(LEGACY_GAS_URL, {
          method: 'POST',
          mode: 'cors',
          keepalive: true,
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'loghoatdong', sdt: u.sdt, hanhdong: String(hanhdong || ''), chitiet: String(chitiet || '') })
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function startBrowserLifecycle() {
    if (typeof document === 'undefined' || typeof global.addEventListener !== 'function') return;
    if (global.__vlxtTelemetryStarted) return;
    global.__vlxtTelemetryStarted = true;

    try {
      var sp = new URLSearchParams((global.location && global.location.search) || '');
      var urlTrig = sp.get('trigger');
      if (urlTrig) setConversionTrigger(urlTrig, 'URL trigger: ' + urlTrig);
    } catch (e) {}

    var markInteract = function () { _lastInteractAt = Date.now(); };
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) {
      global.addEventListener(ev, markInteract, { passive: true });
    });

    global.addEventListener('scroll', function () {
      try {
        var doc = document.documentElement;
        var scrollTop = global.scrollY || doc.scrollTop || 0;
        var maxH = Math.max(1, (doc.scrollHeight || 1) - (global.innerHeight || 1));
        var pct = Math.min(100, Math.round((scrollTop / maxH) * 100));
        if (pct > _maxScrollPct) _maxScrollPct = pct;
      } catch (e) {}
    }, { passive: true });

    // Ghi loi JS runtime (gioi han 3 loi / phien)
    global.addEventListener('error', function (e) {
      if (_errCount >= 3) return;
      _errCount++;
      var msg = (e && e.message) ? String(e.message).slice(0, 200) : 'Script error';
      safeStorageSet(global.sessionStorage, 'vlxt_last_js_err', msg);
      track('client_error', { target: getPageFile(), label: msg });
    });
    global.addEventListener('unhandledrejection', function (e) {
      if (_errCount >= 3) return;
      _errCount++;
      var msg = (e && e.reason && e.reason.message) ? String(e.reason.message).slice(0, 200) : String((e && e.reason) || 'Unhandled rejection').slice(0, 200);
      safeStorageSet(global.sessionStorage, 'vlxt_last_js_err', msg);
      track('client_error', { target: getPageFile(), label: msg });
    });

    // Bo dem thoi gian thuc hoc (Active Dwell Time)
    _dwellTimer = setInterval(function () {
      var visible = (document.visibilityState === 'visible');
      var recentlyActive = (Date.now() - _lastInteractAt) <= 60000;
      if (visible && (recentlyActive || _videoPlaying)) {
        _activeSeconds++;
      }
      updateCountdownUI();
    }, 1000);

    _flushTimer = setInterval(function () { flush(false); }, 12000);
    _presenceTimer = setInterval(function () {
      if (document.visibilityState === 'visible') pushLivePresence(false);
    }, 30000);

    var handleLeave = function () {
      var spent = Math.max(0, Math.round((Date.now() - _pageEnteredAt) / 1000));
      track('page_leave', {
        target: getPageFile(),
        label: buildContextLabel(),
        meta: { activeSec: _activeSeconds, totalWallSec: spent, maxScrollPct: _maxScrollPct }
      });
      flush(true);
    };

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') handleLeave();
    });
    global.addEventListener('pagehide', handleLeave);

    var onReady = function () {
      refreshCampaignConfig(false);
      renderCountdownChip();
      maybeShowZaloGroupWelcomeModal(getUser(), false);
      track('page_enter', { target: getPageFile(), label: (document.title || getPageFile()).slice(0, 90) });
      pushLivePresence(false);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      setTimeout(onReady, 40);
    }
  }

  var VLXT_CAMPAIGN = {
    RTDB_ROOT: RTDB_ROOT,
    DEFAULT_CONFIG: DEFAULT_CAMPAIGN_CONFIG,
    getConfig: getCampaignConfig,
    saveConfigLocal: saveCampaignConfigLocal,
    refreshConfig: refreshCampaignConfig,
    isPaidFullUser: isPaidFullUser,
    isLegacyPreCampaignTrial: isLegacyPreCampaignTrial,
    hasFullAccess: hasFullAccess,
    getUserEarlyAccessState: getUserEarlyAccessState,
    isLayGocCourseName: isLayGocCourseName,
    isGd1CourseName: isGd1CourseName,
    isAdvancedStageCourseName: isAdvancedStageCourseName,
    isFreeChapterName: isFreeChapterName,
    canAccessCourseChapter: canAccessCourseChapter,
    canAccessLayGocLesson: canAccessLayGocLesson,
    canAccessDgnlExam: canAccessDgnlExam,
    canAccessPhongThiThu: canAccessPhongThiThu,
    requireAuthOrRedirect: requireAuthOrRedirect,
    renderCountdownChip: renderCountdownChip,
    openEarlyAccessModal: openEarlyAccessModal,
    maybeShowZaloGroupWelcomeModal: maybeShowZaloGroupWelcomeModal
  };

  var VLXT_TELEMETRY = {
    RTDB_ROOT: RTDB_ROOT,
    track: track,
    flush: flush,
    pushLivePresence: pushLivePresence,
    setContext: setContext,
    getContext: getContext,
    setConversionTrigger: setConversionTrigger,
    getConversionTrigger: getConversionTrigger,
    setVideoPlaying: function (v) { _videoPlaying = !!v; },
    getActiveSeconds: function () { return _activeSeconds; },
    getActorInfo: getActorInfo,
    submitVipReservation: submitVipReservation,
    submitFeedbackReport: submitFeedbackReport
  };

  global.VLXT_CAMPAIGN = VLXT_CAMPAIGN;
  global.VLXT_TELEMETRY = VLXT_TELEMETRY;
  global.vlxtLog = legacyCompatibleLog;

  startBrowserLifecycle();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VLXT_CAMPAIGN: VLXT_CAMPAIGN, VLXT_TELEMETRY: VLXT_TELEMETRY };
  }
})(typeof window !== 'undefined' ? window : globalThis);
