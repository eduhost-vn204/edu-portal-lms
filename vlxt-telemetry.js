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
  var GROWTH_PREFIX = 'vlxt_growth_v1_';
  var PENDING_REF_KEY = 'vlxt_pending_ref_v1';
  var DEVICE_ID_FALLBACK_KEY = 'vlxt_growth_dev_id_v1';
  var REF_VISIT_PREFIX = 'vlxt_ref_visit_';
  var TRIGGER_KEY = 'vlxt_last_conv_trigger_v1';
  var SESSION_ID_KEY = 'vlxt_session_id_v1';
  var JOURNEY_LOCAL_KEY = 'vlxt_journey_summary_v1';

  var DEFAULT_CAMPAIGN_CONFIG = {
    id: 'early_access_20261125',
    title: 'Trải Nghiệm Sớm VIP',
    enabled: true,
    startAt: '2026-11-25T00:00:00+07:00',
    endAt: '2027-06-30T23:59:59+07:00',
    durationDays: 3,
    bonusDaysFeedback: 2,
    bonusDaysReferral: 2,
    maxBonusDays: 14,
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
    var str = String(s || '').trim();
    if (str.indexOf('@') !== -1) return str.toLowerCase();
    return str.replace(/\D/g, '');
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
  // PHẦN 1B: ĐỘNG CƠ TĂNG TRƯỞNG VIRAL (3 NGÀY GỐC + NHIỆM VỤ CỘNG +2 NGÀY VIP)
  // ═══════════════════════════════════════════════════════════════════════════
  function makeRefCode(sdt) {
    var norm = normSdt(sdt) || String(sdt || '').trim().toLowerCase();
    if (!norm) return '';
    var h1 = 2166136261;
    var h2 = 5381;
    for (var i = 0; i < norm.length; i++) {
      var c = norm.charCodeAt(i);
      h1 ^= c;
      h1 = (typeof Math.imul === 'function') ? Math.imul(h1, 16777619) : ((h1 * 16777619) >>> 0);
      h2 = (((h2 << 5) + h2) + c) >>> 0;
    }
    var p1 = ((h1 >>> 0).toString(36)).toUpperCase();
    var p2 = ((h2 >>> 0).toString(36)).toUpperCase();
    while (p1.length < 4) p1 = '0' + p1;
    while (p2.length < 4) p2 = '0' + p2;
    return 'VL' + p1.slice(-3) + p2.slice(-3);
  }

  function getClientDeviceId() {
    try {
      var existing = safeStorageGet(global.localStorage, DEVICE_ID_FALLBACK_KEY);
      if (existing) return existing;
      if (typeof global.vlxtDeviceFingerprint === 'function') {
        var fp = global.vlxtDeviceFingerprint();
        if (typeof fp === 'string' && fp) {
          safeStorageSet(global.localStorage, DEVICE_ID_FALLBACK_KEY, fp);
          return fp;
        }
      }
      var storedFp = safeStorageGet(global.localStorage, 'vlxt_device_fp') || safeStorageGet(global.localStorage, 'vlxt_device_id');
      if (storedFp) return storedFp;
    } catch (e) {}
    return getOrCreateAnonId();
  }

  function getGrowthStorageKey(u) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return '';
    var sdtKey = safeKey(normSdt(user.sdt) || user.sdt);
    return GROWTH_PREFIX + sdtKey;
  }

  function recomputeGrowthMetrics(profile, cfg) {
    var c = cfg || getCampaignConfig();
    var bonusFb = Math.max(0, Number(c.bonusDaysFeedback != null ? c.bonusDaysFeedback : 2));
    var bonusRef = Math.max(0, Number(c.bonusDaysReferral != null ? c.bonusDaysReferral : 2));
    var maxBonus = Math.max(0, Number(c.maxBonusDays != null ? c.maxBonusDays : 14));

    var qRefs = Math.max(0, Number(profile.qualifiedReferralsCount || 0));
    var rRefs = Math.max(qRefs, Number(profile.registeredReferralsCount || 0));
    var fbDays = profile.feedbackMissionDone ? bonusFb : 0;
    var inviteeDays = profile.inviteBonusClaimed ? bonusRef : 0;
    var rawInviterDays = qRefs * bonusRef;
    var rawTotal = fbDays + inviteeDays + rawInviterDays;
    var totalBonus = Math.min(maxBonus, rawTotal);
    var cappedInviterDays = Math.max(0, totalBonus - fbDays - inviteeDays);

    profile.qualifiedReferralsCount = qRefs;
    profile.registeredReferralsCount = rRefs;
    profile.feedbackBonusDays = fbDays;
    profile.inviteeBonusDays = inviteeDays;
    profile.inviterBonusDays = cappedInviterDays;
    profile.totalBonusDays = totalBonus;
    profile.isClassLeader = qRefs >= 3;
    profile.unlockedMaxDgnlExam = Math.min(10, 5 + (profile.feedbackMissionDone ? 1 : 0) + qRefs + (qRefs >= 3 ? 1 : 0));
    profile.unlockedLayGocDay = qRefs >= 3 ? 3 : ((profile.feedbackMissionDone || qRefs >= 1) ? 2 : 1);
    return profile;
  }

  function buildDefaultGrowthProfile(user) {
    var sdt = user ? (normSdt(user.sdt) || String(user.sdt || '').trim()) : '';
    var actorKey = sdt ? ('hs_' + safeKey(sdt)) : safeKey(getOrCreateAnonId());
    return recomputeGrowthMetrics({
      actorKey: actorKey,
      sdt: sdt,
      hoten: user ? String(user.hoten || user.name || '').trim() : '',
      lop: user ? String(user.lop || '').trim() : '',
      refCode: makeRefCode(sdt),
      qualifiedExamsCount: 0,
      firstExamSummary: null,
      feedbackMissionDone: false,
      feedbackBonusDays: 0,
      feedbackCompletedAt: 0,
      favoriteFeature: '',
      targetScore: '',
      invitedByCode: '',
      invitedByActorKey: '',
      invitedByName: '',
      invitedBySdt: '',
      inviteChallengeExam: '',
      inviteChallengeScore: '',
      inviteBonusClaimed: false,
      inviteeBonusDays: 0,
      qualifiedReferralsCount: 0,
      registeredReferralsCount: 0,
      inviterBonusDays: 0,
      referralsList: [],
      totalBonusDays: 0,
      unlockedMaxDgnlExam: 5,
      unlockedLayGocDay: 1,
      isClassLeader: false,
      anonId: getOrCreateAnonId(),
      deviceId: getClientDeviceId(),
      updatedAt: 0
    });
  }

  function getGrowthProfile(u) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return buildDefaultGrowthProfile(null);
    var base = buildDefaultGrowthProfile(user);
    var sk = getGrowthStorageKey(user);
    var raw = sk ? safeStorageGet(global.localStorage, sk) : null;
    var parsed = raw ? safeJsonParse(raw, null) : null;
    if (parsed && typeof parsed === 'object') {
      var merged = Object.assign(base, parsed);
      merged.actorKey = base.actorKey;
      merged.sdt = base.sdt;
      merged.refCode = merged.refCode || base.refCode;
      merged.hoten = base.hoten || merged.hoten;
      merged.lop = base.lop || merged.lop;
      return recomputeGrowthMetrics(merged);
    }
    return base;
  }

  function saveGrowthProfileLocal(u, data) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return buildDefaultGrowthProfile(null);
    var cur = Object.assign(getGrowthProfile(user), data || {});
    cur.updatedAt = Date.now();
    recomputeGrowthMetrics(cur);
    var sk = getGrowthStorageKey(user);
    if (sk) safeStorageSet(global.localStorage, sk, JSON.stringify(cur));
    updateCountdownUI();
    return cur;
  }

  function publishMyRefCode(profile) {
    if (!profile || !profile.refCode || !profile.actorKey || typeof fetch !== 'function') {
      return Promise.resolve(false);
    }
    var guardKey = 'vlxt_refpub_' + profile.refCode;
    if (safeStorageGet(global.sessionStorage, guardKey) === '1') return Promise.resolve(true);
    var payload = {
      refCode: profile.refCode,
      actorKey: profile.actorKey,
      sdt: profile.sdt,
      hoten: profile.hoten || 'Học sinh VLXT',
      lop: profile.lop || '12',
      anonId: getOrCreateAnonId(),
      deviceId: profile.deviceId || getClientDeviceId(),
      updatedAt: Date.now()
    };
    return fetch(RTDB_ROOT + '/referral_codes/' + encodeURIComponent(profile.refCode) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (r && r.ok) safeStorageSet(global.sessionStorage, guardKey, '1');
      return !!(r && r.ok);
    }).catch(function () { return false; });
  }

  function persistGrowthProfileRemote(profile) {
    if (!profile || !profile.actorKey || typeof fetch !== 'function') return Promise.resolve(false);
    var out = Object.assign({}, profile);
    delete out.referralsList;
    return fetch(RTDB_ROOT + '/growth_profiles/' + encodeURIComponent(profile.actorKey) + '.json', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(out)
    }).then(function (r) { return !!(r && r.ok); }).catch(function () { return false; });
  }

  function notifyGrowthToast(msg) {
    try {
      if (typeof global.vlxtToast === 'function') {
        global.vlxtToast(msg, { tone: 'ok' });
        return;
      }
      if (typeof document === 'undefined' || !document.body) return;
      var box = document.getElementById('vlxt-growth-toast');
      if (!box) {
        box = document.createElement('div');
        box.id = 'vlxt-growth-toast';
        box.style.cssText = 'position:fixed;top:74px;right:16px;z-index:2147483250;background:#0f172a;color:#ecfdf5;border:1px solid #10b981;padding:11px 16px;border-radius:12px;font-family:"Inter",system-ui,sans-serif;font-size:13px;font-weight:700;box-shadow:0 8px 24px rgba(0,0,0,0.42);max-width:340px;line-height:1.45;';
        document.body.appendChild(box);
      }
      box.textContent = msg;
      box.style.display = 'block';
      clearTimeout(box._tm);
      box._tm = setTimeout(function () { box.style.display = 'none'; }, 5500);
    } catch (e) {}
  }

  function syncGrowthProfile(u) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return Promise.resolve(buildDefaultGrowthProfile(null));
    var localP = getGrowthProfile(user);
    if (typeof fetch !== 'function') return Promise.resolve(localP);

    publishMyRefCode(localP);

    return Promise.all([
      fetch(RTDB_ROOT + '/growth_profiles/' + encodeURIComponent(localP.actorKey) + '.json', { cache: 'no-store' })
        .then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; }),
      fetch(RTDB_ROOT + '/referrals/' + encodeURIComponent(localP.actorKey) + '.json', { cache: 'no-store' })
        .then(function (r) { return r && r.ok ? r.json() : null; }).catch(function () { return null; })
    ]).then(function (res) {
      var remoteP = (res[0] && typeof res[0] === 'object') ? res[0] : null;
      var refsMap = (res[1] && typeof res[1] === 'object') ? res[1] : null;
      var prevQualified = Number(localP.qualifiedReferralsCount || 0);

      if (remoteP) {
        localP.qualifiedExamsCount = Math.max(Number(localP.qualifiedExamsCount || 0), Number(remoteP.qualifiedExamsCount || 0));
        localP.firstExamSummary = localP.firstExamSummary || remoteP.firstExamSummary || null;
        localP.feedbackMissionDone = Boolean(localP.feedbackMissionDone || remoteP.feedbackMissionDone);
        localP.feedbackCompletedAt = Math.max(Number(localP.feedbackCompletedAt || 0), Number(remoteP.feedbackCompletedAt || 0));
        localP.favoriteFeature = localP.favoriteFeature || remoteP.favoriteFeature || '';
        localP.targetScore = localP.targetScore || remoteP.targetScore || '';
        localP.invitedByCode = localP.invitedByCode || remoteP.invitedByCode || '';
        localP.invitedByActorKey = localP.invitedByActorKey || remoteP.invitedByActorKey || '';
        localP.invitedByName = localP.invitedByName || remoteP.invitedByName || '';
        localP.invitedBySdt = localP.invitedBySdt || remoteP.invitedBySdt || '';
        localP.inviteChallengeExam = localP.inviteChallengeExam || remoteP.inviteChallengeExam || '';
        localP.inviteChallengeScore = localP.inviteChallengeScore || remoteP.inviteChallengeScore || '';
        localP.inviteBonusClaimed = Boolean(localP.inviteBonusClaimed || remoteP.inviteBonusClaimed);
      }

      if (refsMap) {
        var keys = Object.keys(refsMap);
        var list = [];
        var qCnt = 0;
        keys.forEach(function (k) {
          var item = refsMap[k];
          if (!item || typeof item !== 'object') return;
          if (item.status === 'qualified') qCnt++;
          list.push({
            actorKey: item.actorKey || k,
            hoten: item.hoten || 'Bạn học',
            lop: item.lop || '12',
            status: item.status || 'registered',
            firstScore: item.firstScore || '',
            examNumber: item.examNumber || null,
            createdAt: Number(item.createdAt || 0),
            qualifiedAt: Number(item.qualifiedAt || 0)
          });
        });
        list.sort(function (a, b) { return (b.qualifiedAt || b.createdAt) - (a.qualifiedAt || a.createdAt); });
        localP.referralsList = list;
        localP.registeredReferralsCount = Math.max(list.length, Number(localP.registeredReferralsCount || 0));
        localP.qualifiedReferralsCount = Math.max(qCnt, Number(localP.qualifiedReferralsCount || 0));
      } else if (remoteP) {
        localP.registeredReferralsCount = Math.max(Number(localP.registeredReferralsCount || 0), Number(remoteP.registeredReferralsCount || 0));
        localP.qualifiedReferralsCount = Math.max(Number(localP.qualifiedReferralsCount || 0), Number(remoteP.qualifiedReferralsCount || 0));
      }

      saveGrowthProfileLocal(user, localP);
      persistGrowthProfileRemote(localP);

      if (localP.qualifiedReferralsCount > prevQualified) {
        var addedFriends = localP.qualifiedReferralsCount - prevQualified;
        var cfg = getCampaignConfig();
        notifyGrowthToast('🎉 ' + addedFriends + ' bạn cùng lớp vừa hoàn thành đề qua link của em! Cộng thêm +' + (addedFriends * Number(cfg.bonusDaysReferral || 2)) + ' ngày VIP.');
      }
      return localP;
    }).catch(function () {
      return localP;
    });
  }

  function getPendingReferral() {
    var raw = safeStorageGet(global.localStorage, PENDING_REF_KEY) || safeStorageGet(global.sessionStorage, PENDING_REF_KEY);
    if (!raw) return null;
    var parsed = safeJsonParse(raw, null);
    return (parsed && parsed.refCode) ? parsed : null;
  }

  function captureIncomingReferralFromUrl() {
    try {
      if (!global.location || !global.location.search) return getPendingReferral();
      var sp = new URLSearchParams(global.location.search);
      var rawRef = sp.get('ref');
      if (!rawRef) return getPendingReferral();
      var refCode = String(rawRef).trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
      if (!refCode) return getPendingReferral();

      var user = getUser();
      if (isLoggedInUser(user) && makeRefCode(user.sdt) === refCode) {
        return getPendingReferral();
      }

      var data = {
        refCode: refCode,
        cexam: String(sp.get('cexam') || sp.get('exam') || '').trim().slice(0, 24),
        cscore: String(sp.get('cscore') || '').trim().slice(0, 12),
        cname: String(sp.get('cname') || '').trim().slice(0, 60),
        clop: String(sp.get('clop') || '').trim().slice(0, 16),
        ctype: String(sp.get('ctype') || 'dgnl').trim().slice(0, 24),
        capturedAt: Date.now()
      };
      var json = JSON.stringify(data);
      safeStorageSet(global.localStorage, PENDING_REF_KEY, json);
      safeStorageSet(global.sessionStorage, PENDING_REF_KEY, json);
      setConversionTrigger('referral_' + refCode, 'Thách đấu từ ' + (data.cname || refCode));

      var visitGuard = REF_VISIT_PREFIX + refCode;
      if (safeStorageGet(global.sessionStorage, visitGuard) !== '1') {
        safeStorageSet(global.sessionStorage, visitGuard, '1');
        track('referral_link_visit', {
          target: refCode,
          label: (data.cname || 'Bạn học') + (data.cscore ? (' (' + data.cscore + 'đ)') : ''),
          meta: data
        });
      }
      return data;
    } catch (e) {
      return getPendingReferral();
    }
  }

  function bindReferralOnRegister(u, deviceId) {
    var user = u || getUser();
    if (!isLoggedInUser(user)) return Promise.resolve({ bound: false, reason: 'not_logged_in' });
    var devId = String(deviceId || getClientDeviceId() || '');
    if (devId) safeStorageSet(global.localStorage, DEVICE_ID_FALLBACK_KEY, devId);

    var profile = getGrowthProfile(user);
    if (devId && !profile.deviceId) {
      profile.deviceId = devId;
      saveGrowthProfileLocal(user, profile);
    }
    publishMyRefCode(profile);

    var pending = getPendingReferral();
    if (!pending || !pending.refCode) {
      persistGrowthProfileRemote(profile);
      return Promise.resolve({ bound: false, reason: 'no_pending_ref', profile: profile });
    }
    if (profile.invitedByActorKey || profile.inviteBonusClaimed) {
      return Promise.resolve({ bound: false, reason: 'already_bound', profile: profile });
    }
    if (hasFullAccess(user)) {
      return Promise.resolve({ bound: false, reason: 'already_full_access', profile: profile });
    }
    if (pending.refCode === profile.refCode) {
      return Promise.resolve({ bound: false, reason: 'self_referral', profile: profile });
    }
    if (typeof fetch !== 'function') {
      return Promise.resolve({ bound: false, reason: 'no_fetch', profile: profile });
    }

    return fetch(RTDB_ROOT + '/referral_codes/' + encodeURIComponent(pending.refCode) + '.json', { cache: 'no-store' })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (inviter) {
        if (!inviter || !inviter.actorKey) {
          return { bound: false, reason: 'invalid_ref_code', profile: profile };
        }
        var myAnon = getOrCreateAnonId();
        var myNorm = normSdt(user.sdt) || String(user.sdt || '').trim().toLowerCase();
        var invNorm = normSdt(inviter.sdt || '') || String(inviter.sdt || '').trim().toLowerCase();
        if (inviter.actorKey === profile.actorKey || (invNorm && invNorm === myNorm)) {
          return { bound: false, reason: 'self_referral', profile: profile };
        }
        if (inviter.anonId && myAnon && inviter.anonId === myAnon) {
          return { bound: false, reason: 'same_browser_device', profile: profile };
        }
        if (devId && inviter.deviceId && String(devId) === String(inviter.deviceId)) {
          return { bound: false, reason: 'same_device_fingerprint', profile: profile };
        }

        profile.invitedByCode = pending.refCode;
        profile.invitedByActorKey = inviter.actorKey;
        profile.invitedByName = inviter.hoten || pending.cname || 'Bạn học';
        profile.invitedBySdt = inviter.sdt || '';
        profile.inviteChallengeExam = pending.cexam || '';
        profile.inviteChallengeScore = pending.cscore || '';
        if (devId) profile.deviceId = devId;

        saveGrowthProfileLocal(user, profile);
        safeStorageRemove(global.localStorage, PENDING_REF_KEY);
        safeStorageRemove(global.sessionStorage, PENDING_REF_KEY);

        var refEntry = {
          actorKey: profile.actorKey,
          hoten: profile.hoten || 'Học sinh',
          lop: profile.lop || '12',
          status: 'registered',
          createdAt: Date.now(),
          qualifiedAt: 0,
          firstScore: null,
          examNumber: null
        };

        track('referral_bound', {
          target: inviter.actorKey,
          label: (profile.hoten || profile.sdt) + ' được mời bởi ' + profile.invitedByName,
          meta: { refCode: pending.refCode, inviterActorKey: inviter.actorKey }
        });

        return Promise.all([
          persistGrowthProfileRemote(profile),
          fetch(RTDB_ROOT + '/referrals/' + encodeURIComponent(inviter.actorKey) + '/' + encodeURIComponent(profile.actorKey) + '.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(refEntry)
          }).catch(function () {})
        ]).then(function () {
          return { bound: true, inviterName: profile.invitedByName, profile: profile };
        });
      })
      .catch(function () {
        return { bound: false, reason: 'network_error', profile: profile };
      });
  }

  function recordQualifiedActivity(activity) {
    var user = getUser();
    if (!isLoggedInUser(user)) {
      return Promise.resolve({ ok: false, qualified: false, reason: 'not_logged_in' });
    }
    var act = activity || {};
    var answeredCount = Number(act.answeredCount || 0);
    var spentSeconds = Number(act.spentSeconds || 0);
    var isSolo = act.type === 'solo_match';
    var isQualified = isSolo ? (answeredCount >= 3) : (answeredCount >= 3 && spentSeconds >= 60);

    if (!isQualified) {
      return Promise.resolve({
        ok: false,
        qualified: false,
        reason: answeredCount < 3 ? 'too_few_answers' : 'too_fast',
        minAnswers: 3,
        minSeconds: 60
      });
    }

    var profile = getGrowthProfile(user);
    profile.qualifiedExamsCount = Number(profile.qualifiedExamsCount || 0) + 1;
    if (!profile.firstExamSummary) {
      profile.firstExamSummary = {
        type: act.type || 'dgnl_exam',
        examId: String(act.examId || ''),
        examNumber: act.examNumber || null,
        score10: act.score10 != null ? String(act.score10) : '',
        answeredCount: answeredCount,
        spentSeconds: spentSeconds,
        ts: Date.now()
      };
    }

    var cfg = getCampaignConfig();
    var justQualifiedReferral = false;
    var bonusAdded = 0;

    if (profile.invitedByActorKey && profile.invitedByActorKey !== profile.actorKey && !profile.inviteBonusClaimed && !hasFullAccess(user)) {
      profile.inviteBonusClaimed = true;
      justQualifiedReferral = true;
      bonusAdded = Number(cfg.bonusDaysReferral != null ? cfg.bonusDaysReferral : 2);
    }

    saveGrowthProfileLocal(user, profile);

    track('qualified_exam_recorded', {
      target: String(act.examId || act.type || 'exam'),
      label: 'Hoàn thành đề hợp lệ (' + answeredCount + ' câu · ' + spentSeconds + 's)',
      meta: { score10: act.score10 || '', justQualifiedReferral: justQualifiedReferral }
    });

    var reqs = [persistGrowthProfileRemote(profile)];
    if (justQualifiedReferral) {
      track('referral_qualified', {
        target: profile.invitedByActorKey,
        label: (profile.hoten || profile.sdt) + ' hoàn thành đề đầu tiên · +' + bonusAdded + 'd cho cả hai',
        meta: {
          inviterActorKey: profile.invitedByActorKey,
          inviteeActorKey: profile.actorKey,
          score10: act.score10 != null ? String(act.score10) : '',
          examNumber: act.examNumber || null
        }
      });
      if (typeof fetch === 'function') {
        reqs.push(
          fetch(RTDB_ROOT + '/referrals/' + encodeURIComponent(profile.invitedByActorKey) + '/' + encodeURIComponent(profile.actorKey) + '.json', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'qualified',
              qualifiedAt: Date.now(),
              firstScore: act.score10 != null ? String(act.score10) : '',
              examNumber: act.examNumber || null,
              examType: act.type || 'dgnl_exam'
            })
          }).catch(function () {})
        );
      }
      flush(true);
    }

    return Promise.all(reqs).then(function () {
      return {
        ok: true,
        qualified: true,
        justQualifiedReferral: justQualifiedReferral,
        bonusAdded: bonusAdded,
        inviterName: profile.invitedByName || '',
        challengeScore: profile.inviteChallengeScore || '',
        profile: profile
      };
    });
  }

  function completeFeedbackMission(payload) {
    var user = getUser();
    if (!isLoggedInUser(user)) {
      return Promise.resolve({ ok: false, reason: 'not_logged_in' });
    }
    var profile = getGrowthProfile(user);
    if (profile.feedbackMissionDone) {
      return Promise.resolve({ ok: false, reason: 'already_completed', profile: profile });
    }
    if (Number(profile.qualifiedExamsCount || 0) < 1) {
      return Promise.resolve({ ok: false, reason: 'need_exam_first', profile: profile });
    }

    var p = payload || {};
    var msg = String(p.message || '').trim();
    var compact = msg.replace(/\s+/g, '');
    var uniq = {};
    for (var i = 0; i < compact.length; i++) {
      uniq[compact[i].toLowerCase()] = true;
    }
    var wordCount = msg.split(/\s+/).filter(Boolean).length;
    if (msg.length < 15 || Object.keys(uniq).length < 4 || wordCount < 3) {
      return Promise.resolve({ ok: false, reason: 'message_too_short_or_spam', profile: profile });
    }

    var cfg = getCampaignConfig();
    var bonusDays = Number(cfg.bonusDaysFeedback != null ? cfg.bonusDaysFeedback : 2);
    var favoriteFeature = String(p.favoriteFeature || 'Mô phỏng 60 FPS').trim().slice(0, 80);
    var targetScore = String(p.targetScore || '8.5+').trim().slice(0, 20);
    var rating = Math.min(5, Math.max(1, Number(p.rating || 5)));

    profile.feedbackMissionDone = true;
    profile.feedbackCompletedAt = Date.now();
    profile.favoriteFeature = favoriteFeature;
    profile.targetScore = targetScore;
    saveGrowthProfileLocal(user, profile);

    track('mission_feedback_completed', {
      target: favoriteFeature,
      label: 'Đánh giá ' + rating + '★ · Mục tiêu ' + targetScore + ' (+' + bonusDays + ' ngày VIP)',
      meta: { rating: rating, favoriteFeature: favoriteFeature, targetScore: targetScore }
    });

    var reportPromise = submitFeedbackReport({
      type: 'idea',
      category: 'mission_feedback',
      rating: rating,
      favoriteFeature: favoriteFeature,
      targetScore: targetScore,
      isMissionFeedback: true,
      firstExamSummary: profile.firstExamSummary || null,
      message: msg
    }).catch(function () { return { ok: false }; });

    return Promise.all([
      reportPromise,
      persistGrowthProfileRemote(profile)
    ]).then(function () {
      return {
        ok: true,
        bonusAdded: bonusDays,
        profile: profile
      };
    });
  }

  function buildSharePayload(opts) {
    var user = getUser();
    var profile = getGrowthProfile(user);
    var o = opts || {};
    var refCode = profile.refCode || 'VLXT';
    var name = (profile.hoten || (user && user.hoten) || 'Mình').trim();
    var lop = (profile.lop || (user && user.lop) || '').trim();
    var cexam = o.examNumber ? String(o.examNumber) : '';
    var cscore = (o.score10 !== undefined && o.score10 !== null && String(o.score10) !== '') ? String(o.score10) : '';
    var ctype = o.ctype || 'dgnl';

    var originBase = 'https://vatlyxuantruong.io.vn/';
    try {
      if (global.location && global.location.origin && /^https?:/i.test(global.location.origin)) {
        var dirPath = (global.location.pathname || '/').replace(/[^/]*$/, '');
        originBase = global.location.origin + dirPath;
      }
    } catch (e) {}

    var targetPage = (ctype === 'thithu')
      ? 'thithu.html'
      : (ctype === 'solo' ? 'solo.html' : 'danh-gia-nang-luc.html');
    var qp = [];
    if (cexam && ctype === 'dgnl') qp.push('exam=' + encodeURIComponent(String(cexam).padStart(2, '0')));
    qp.push('ref=' + encodeURIComponent(refCode));
    if (cexam) qp.push('cexam=' + encodeURIComponent(cexam));
    if (cscore) qp.push('cscore=' + encodeURIComponent(cscore));
    if (name) qp.push('cname=' + encodeURIComponent(name));
    if (lop) qp.push('clop=' + encodeURIComponent(lop));
    if (ctype) qp.push('ctype=' + encodeURIComponent(ctype));

    var url = originBase + targetPage + '?' + qp.join('&');
    var challengeLine = cscore
      ? (name + ' vừa đạt ' + cscore + 'đ ở Đề ' + (cexam ? ('số ' + cexam) : 'Vật Lý 12') + ' chuẩn Bộ 2026 trên Web Vật Lý Xuân Trường (có mô phỏng thí nghiệm 60 FPS)!')
      : (name + ' đang luyện đề Vật Lý 12 có mô phỏng thí nghiệm 60 FPS trực quan trên Web Vật Lý Xuân Trường!');
    var text = challengeLine + '\nBấm link vào thi thử phá kỷ lục cùng mình — hoàn thành 1 đề CẢ HAI được cộng +2 ngày VIP miễn phí:\n' + url;
    return { url: url, text: text, refCode: refCode };
  }

  function copyChallengeLink(opts) {
    var payload = buildSharePayload(opts);
    track('referral_share_copy', { target: payload.refCode, label: (opts && opts.source) || 'mission_modal' });
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(payload.text).then(function () {
        notifyGrowthToast('✓ Đã chép lời thách đấu kèm link! Dán gửi nhóm lớp Zalo/Messenger ngay nhé.');
        return Object.assign({ copied: true }, payload);
      }).catch(function () {
        return Object.assign({ copied: false }, payload);
      });
    }
    return Promise.resolve(Object.assign({ copied: false }, payload));
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
    var baseDays = Math.max(1, Number(cfg.durationDays != null ? cfg.durationDays : 3));

    var paidFull = isPaidFullUser(user);
    var legacyTrial = isLegacyPreCampaignTrial(user);
    var full = paidFull || legacyTrial;
    var gp = (!full && isLoggedInUser(user)) ? getGrowthProfile(user) : null;
    var bonusDays = gp ? Math.max(0, Number(gp.totalBonusDays || 0)) : 0;
    var totalDays = baseDays + bonusDays;
    var durationMs = totalDays * 86400000;
    var windowLbl = cfg.windowLabel || ('Gốc ' + baseDays + ' ngày + Thưởng VIP');

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
        baseDays: baseDays,
        bonusDays: bonusDays,
        totalDays: totalDays,
        formattedShort: now > endMs ? 'Đã kết thúc đợt trải nghiệm sớm' : 'Đang tạm đóng',
        windowLabel: windowLbl,
        config: cfg
      };
    }

    var sdtKey = isLoggedInUser(user) ? normSdt(user.sdt) : 'guest';
    var startedKey = EA_STARTED_PREFIX + (cfg.id || 'ea') + '_' + (sdtKey || 'guest');
    var storedStart = Number(safeStorageGet(global.localStorage, startedKey) || 0);
    var effectiveStart;

    if (now < startMs) {
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
      baseDays: baseDays,
      bonusDays: bonusDays,
      totalDays: totalDays,
      formattedShort: now < startMs
        ? ('Còn ' + totalDays + ' ngày')
        : ('Còn ' + formatDurationVN(remainingMs)),
      windowLabel: windowLbl,
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
    var idx = (typeof lessonIndexZeroBased === 'number') ? lessonIndexZeroBased : null;
    if (idx === null) {
      var lname = String((lessonObj && (lessonObj.name || lessonObj.TenBai)) || '').trim();
      var m = lname.match(/^\s*(?:ngày|bài|buổi)\s*(\d+)(?:\b|[:.\-\s])/i);
      if (m) idx = Number(m[1]) - 1;
    }
    if (idx === 0) return true;
    if (idx === null || idx < 0 || idx > 2) return false; // Ngày 4-5 khóa tuyệt đối cho Paid Pro
    var st = getUserEarlyAccessState(u);
    if (!st.active) return false;
    var gp = getGrowthProfile(u);
    var maxDay = Number((gp && gp.unlockedLayGocDay) || 1);
    return (idx + 1) <= maxDay;
  }

  function canAccessDgnlExam(examNumber, u) {
    if (hasFullAccess(u)) return true;
    var n = Number(examNumber);
    if (n >= 1 && n <= 5) return true;
    if (n < 1 || n > 10) return false; // Đề 11-50 khóa tuyệt đối cho Paid Pro
    var st = getUserEarlyAccessState(u);
    if (!st.active) return false;
    var gp = getGrowthProfile(u);
    return n <= Number((gp && gp.unlockedMaxDgnlExam) || 5);
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
  // PHẦN 2: CHIP ĐẾM NGƯỢC & TRUNG TÂM NHIỆM VỤ CỘNG NGÀY VIP (ZERO AI GLOW)
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
      '.vlxt-ea-modal-bd{--ea-bg:#0f172a;--ea-card:#151f33;--ea-border:rgba(148,163,184,0.24);--ea-text:#f1f5f9;--ea-sub:#cbd5e1;--ea-muted:#94a3b8;position:fixed;inset:0;z-index:2147483150;background:rgba(2,6,23,0.78);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:16px;}',
      '.vlxt-ea-modal-bd.vlxt-ea-cbt-light{--ea-bg:#ffffff;--ea-card:#f8fafc;--ea-border:#cbd5e1;--ea-text:#0f172a;--ea-sub:#334155;--ea-muted:#64748b;}',
      '.vlxt-ea-modal-bd.open{display:flex;}',
      '.vlxt-ea-modal{width:100%;max-width:580px;background:var(--ea-bg);border:1px solid var(--ea-border);border-radius:18px;padding:22px;color:var(--ea-text);font-family:"Inter",system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,0.55);position:relative;max-height:92vh;overflow-y:auto;}',
      '.vlxt-ea-close{position:absolute;top:14px;right:14px;width:32px;height:32px;border-radius:8px;border:1px solid var(--ea-border);background:var(--ea-card);color:var(--ea-muted);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;}',
      '.vlxt-ea-close:hover{color:var(--ea-text);border-color:#0b84f3;}',
      '.vlxt-ea-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(245,158,11,0.14);border:1px solid rgba(245,158,11,0.38);color:#d97706;font-size:11.5px;font-weight:800;margin-bottom:8px;max-width:calc(100% - 42px);line-height:1.35;}',
      '.vlxt-ea-modal-bd:not(.vlxt-ea-cbt-light) .vlxt-ea-badge{color:#fbbf24;}',
      '.vlxt-ea-title{font-size:19px;font-weight:800;color:var(--ea-text);line-height:1.35;margin-bottom:6px;}',
      '.vlxt-ea-sub{font-size:13.5px;color:var(--ea-sub);line-height:1.5;margin-bottom:12px;}',
      '.vlxt-ea-quota{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px;}',
      '.vlxt-ea-qbox{padding:10px 12px;border-radius:11px;background:var(--ea-card);border:1px solid var(--ea-border);text-align:center;}',
      '.vlxt-ea-qval{font-size:16px;font-weight:800;color:var(--ea-text);}',
      '.vlxt-ea-qlbl{font-size:11px;color:var(--ea-muted);margin-top:2px;font-weight:600;}',
      '.vlxt-ea-mission-card{padding:14px 15px;border-radius:14px;background:var(--ea-card);border:1px solid var(--ea-border);margin-bottom:12px;}',
      '.vlxt-ea-mission-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;}',
      '.vlxt-ea-mission-title{font-size:14px;font-weight:800;color:var(--ea-text);}',
      '.vlxt-ea-tag{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:800;}',
      '.vlxt-ea-tag.ok{background:rgba(16,185,129,0.16);color:#10b981;border:1px solid rgba(16,185,129,0.35);}',
      '.vlxt-ea-tag.wait{background:rgba(245,158,11,0.16);color:#d97706;border:1px solid rgba(245,158,11,0.38);}',
      '.vlxt-ea-modal-bd:not(.vlxt-ea-cbt-light) .vlxt-ea-tag.wait{color:#fbbf24;}',
      '.vlxt-ea-chips{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0 10px;}',
      '.vlxt-ea-chip-opt{padding:5px 10px;border-radius:8px;border:1px solid var(--ea-border);background:var(--ea-bg);color:var(--ea-sub);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;}',
      '.vlxt-ea-chip-opt.active{background:#0b84f3;border-color:#0b84f3;color:#ffffff;}',
      '.vlxt-ea-input,.vlxt-ea-textarea{width:100%;box-sizing:border-box;padding:9px 11px;border-radius:9px;border:1px solid var(--ea-border);background:var(--ea-bg);color:var(--ea-text);font-family:inherit;font-size:13px;outline:none;}',
      '.vlxt-ea-textarea{min-height:70px;resize:vertical;line-height:1.45;margin-bottom:8px;}',
      '.vlxt-ea-share-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px;}',
      '.vlxt-ea-progress{width:100%;height:7px;border-radius:999px;background:rgba(148,163,184,0.2);overflow:hidden;margin:8px 0;}',
      '.vlxt-ea-progress>i{display:block;height:100%;background:#10b981;border-radius:999px;transition:width .25s ease;}',
      '.vlxt-ea-ref-list{margin-top:8px;display:flex;flex-direction:column;gap:5px;max-height:120px;overflow-y:auto;}',
      '.vlxt-ea-ref-item{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px;padding:6px 9px;border-radius:8px;background:var(--ea-bg);border:1px solid var(--ea-border);}',
      '.vlxt-ea-actions{display:flex;flex-direction:column;gap:8px;margin-top:6px;}',
      '.vlxt-ea-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px 15px;border-radius:11px;font-size:13.5px;font-weight:800;text-decoration:none;cursor:pointer;border:none;font-family:inherit;transition:background-color .16s ease,transform .12s ease;}',
      '.vlxt-ea-btn:active{transform:scale(0.98);}',
      '.vlxt-ea-btn.primary{background:#10b981;color:#ffffff;}',
      '.vlxt-ea-btn.primary:hover{background:#059669;}',
      '.vlxt-ea-btn.zalo{background:#0068ff;color:#ffffff;}',
      '.vlxt-ea-btn.zalo:hover{background:#1677ff;}',
      '.vlxt-ea-btn.vip{background:#0b84f3;color:#ffffff;}',
      '.vlxt-ea-btn.vip:hover{background:#1d90fa;}',
      '.vlxt-ea-btn.ghost{background:var(--ea-card);color:var(--ea-sub);border:1px solid var(--ea-border);}',
      '.vlxt-ea-btn.ghost:hover{border-color:#0b84f3;color:var(--ea-text);}'
    ].join('');
    document.head.appendChild(s);
  }

  function updateCountdownUI() {
    if (typeof document === 'undefined') return;
    var el = document.getElementById('vlxt-ea-chip-text');
    var modalTimerEl = document.getElementById('vlxt-ea-modal-timer');
    var st = getUserEarlyAccessState(getUser());
    if (el) el.textContent = st.formattedShort;
    if (modalTimerEl) modalTimerEl.textContent = st.formattedShort + ' (' + st.baseDays + 'd gốc + ' + st.bonusDays + 'd thưởng)';
  }

  function openMissionModal(defaultFocus) {
    if (typeof document === 'undefined' || !document.body) return;
    injectEarlyAccessCSS();
    var oldBd = document.getElementById('vlxt-ea-modal-bd');
    if (oldBd) oldBd.remove();

    var cfg = getCampaignConfig();
    var user = getUser();
    var st = getUserEarlyAccessState(user);
    var gp = getGrowthProfile(user);
    var isWelcome = defaultFocus === 'welcome';
    var page = getPageFile();
    var isLight = (page === 'phong-thi-thu.html' || page === 'thithu.html');
    var nameDisplay = (user && user.hoten) ? escHtml(user.hoten) : 'em';
    var share = buildSharePayload({ source: 'mission_modal' });
    var bonusFb = Number(cfg.bonusDaysFeedback != null ? cfg.bonusDaysFeedback : 2);
    var bonusRef = Number(cfg.bonusDaysReferral != null ? cfg.bonusDaysReferral : 2);
    var maxBonus = Number(cfg.maxBonusDays != null ? cfg.maxBonusDays : 14);
    var leaderPct = Math.min(100, Math.round((gp.qualifiedReferralsCount / 3) * 100));

    var bd = document.createElement('div');
    bd.id = 'vlxt-ea-modal-bd';
    bd.className = 'vlxt-ea-modal-bd open' + (isLight ? ' vlxt-ea-cbt-light' : '');

    var selectedFeat = gp.favoriteFeature || 'Mô phỏng 60 FPS';
    var selectedTarget = gp.targetScore || '8.5+';
    var selectedRate = 5;

    function buildModalHtml() {
      st = getUserEarlyAccessState(getUser());
      gp = getGrowthProfile(getUser());
      share = buildSharePayload({ source: 'mission_modal' });
      leaderPct = Math.min(100, Math.round((gp.qualifiedReferralsCount / 3) * 100));

      var refItemsHtml = (gp.referralsList && gp.referralsList.length)
        ? gp.referralsList.map(function (it) {
            var isQ = it.status === 'qualified';
            return '<div class="vlxt-ea-ref-item"><span><b>' + escHtml(it.hoten) + '</b> (' + escHtml(it.lop || '12') + ')' + (it.firstScore ? (' · ' + escHtml(it.firstScore) + 'đ') : '') + '</span><span class="vlxt-ea-tag ' + (isQ ? 'ok' : 'wait') + '">' + (isQ ? ('✓ +' + bonusRef + 'd') : '⏳ Chờ làm 1 đề') + '</span></div>';
          }).join('')
        : '<div style="font-size:12px;color:var(--ea-muted);margin-top:6px">Chưa có bạn cùng lớp nào. Gửi link để nhận +' + bonusRef + ' ngày VIP cho cả 2 ngay khi bạn làm xong đề đầu tiên!</div>';

      var mission1Html = gp.feedbackMissionDone
        ? ('<div class="vlxt-ea-mission-head"><span class="vlxt-ea-mission-title">✅ Nhiệm vụ 1: Làm 1 đề &amp; Đánh giá Web</span><span class="vlxt-ea-tag ok">Đã nhận +' + bonusFb + ' ngày &amp; Mở Đề 06</span></div><div style="font-size:12.5px;color:var(--ea-sub)">Cảm ơn em đã góp ý (<b>' + escHtml(gp.favoriteFeature || '—') + '</b> · Mục tiêu <b>' + escHtml(gp.targetScore || '8.5+') + '</b>). Đề 06 ĐGNL &amp; Ngày 2 Lấy Gốc đã được mở!</div>')
        : ('<div class="vlxt-ea-mission-head"><span class="vlxt-ea-mission-title">🎯 Nhiệm vụ 1: Làm 1 đề &amp; Gửi Đánh Giá</span><span class="vlxt-ea-tag wait">+' + bonusFb + ' ngày VIP + Mở Đề 06</span></div>'
          + '<div style="font-size:12.5px;color:var(--ea-sub);margin-bottom:8px">'
          + (gp.qualifiedExamsCount >= 1
            ? '✅ Bước 1: Em đã hoàn thành <b>' + gp.qualifiedExamsCount + '</b> đề hợp lệ. Gửi nhanh 15 giây đánh giá bên dưới để nhận thưởng ngay!'
            : '⏳ Bước 1: Em hãy vào làm &amp; nộp ít nhất <b>1 đề bất kỳ</b> (trả lời ≥ 3 câu, tối thiểu 60s) để đủ điều kiện nhận thưởng.')
          + '</div>'
          + (gp.qualifiedExamsCount >= 1 ? [
              '<div style="font-size:11.5px;font-weight:700;color:var(--ea-muted)">Tính năng em mê nhất trên Web:</div>',
              '<div class="vlxt-ea-chips" id="ea-feat-chips">',
              ['Mô phỏng 60 FPS', 'Chẩn đoán lỗ hổng', 'Đề chuẩn Bộ 2026', 'Sổ tay câu sai', 'Đấu trường Solo'].map(function (f) {
                return '<button type="button" class="vlxt-ea-chip-opt ' + (selectedFeat === f ? 'active' : '') + '" data-feat="' + escHtml(f) + '">' + escHtml(f) + '</button>';
              }).join(''),
              '</div>',
              '<div style="font-size:11.5px;font-weight:700;color:var(--ea-muted)">Mục tiêu điểm Vật Lý &amp; mức hài lòng:</div>',
              '<div class="vlxt-ea-chips" id="ea-target-chips">',
              ['7+', '8+', '8.5+', '9+'].map(function (t) {
                return '<button type="button" class="vlxt-ea-chip-opt ' + (selectedTarget === t ? 'active' : '') + '" data-target="' + escHtml(t) + '">Mục tiêu ' + escHtml(t) + '</button>';
              }).join(''),
              [5, 4, 3].map(function (r) {
                return '<button type="button" class="vlxt-ea-chip-opt ' + (selectedRate === r ? 'active' : '') + '" data-rate="' + r + '">' + r + '★</button>';
              }).join(''),
              '</div>',
              '<textarea id="ea-fb-msg" class="vlxt-ea-textarea" placeholder="Nhận xét thật của em sau khi làm đề (tối thiểu 15 ký tự, VD: Mô phỏng dễ hiểu, muốn thêm đề nhiệt học...)"></textarea>',
              '<button type="button" class="vlxt-ea-btn primary" id="ea-fb-submit-btn">🎁 Gửi Đánh Giá &amp; Nhận +' + bonusFb + ' Ngày VIP</button>',
              '<div id="ea-fb-err" style="font-size:12px;color:#ef4444;margin-top:6px"></div>'
            ].join('') : '<a href="danh-gia-nang-luc.html?exam=01" class="vlxt-ea-btn vip" style="margin-top:4px">Làm ngay Đề 01 ĐGNL (60 FPS) →</a>'));

      return [
        '<div class="vlxt-ea-modal" role="dialog" aria-modal="true" aria-labelledby="vlxt-ea-modal-title">',
        '  <button type="button" class="vlxt-ea-close" aria-label="Đóng" id="vlxt-ea-close-btn">✕</button>',
        '  <div class="vlxt-ea-badge">' + (gp.isClassLeader ? '🏆 THỦ LĨNH HỌC TẬP LỚP' : (isWelcome ? '🎉 KÍCH HOẠT 3 NGÀY TRẢI NGHIỆM VIP' : '⏳ QUỸ THỜI GIAN &amp; NHIỆM VỤ VIP')) + '</div>',
        '  <h3 class="vlxt-ea-title" id="vlxt-ea-modal-title">' + (isWelcome ? ('Chào mừng ' + nameDisplay + ' nhận 3 ngày VIP!') : 'Nhiệm Vụ Cộng Ngày VIP &amp; Mở Khóa Đề') + '</h3>',
        '  <p class="vlxt-ea-sub">Thời hạn còn lại: <strong id="vlxt-ea-modal-timer" style="color:#f59e0b">' + escHtml(st.formattedShort) + ' (' + st.baseDays + 'd gốc + ' + st.bonusDays + 'd thưởng)</strong></p>',
        '  <div class="vlxt-ea-quota">',
        '    <div class="vlxt-ea-qbox"><div class="vlxt-ea-qval">' + st.totalDays + ' ngày</div><div class="vlxt-ea-qlbl">Tổng quỹ (tối đa ' + (st.baseDays + maxBonus) + 'd)</div></div>',
        '    <div class="vlxt-ea-qbox"><div class="vlxt-ea-qval">Đề 01–' + String(gp.unlockedMaxDgnlExam).padStart(2, '0') + '</div><div class="vlxt-ea-qlbl">Kho 50 Đề đang mở</div></div>',
        '    <div class="vlxt-ea-qbox"><div class="vlxt-ea-qval">Ngày 1–' + gp.unlockedLayGocDay + '</div><div class="vlxt-ea-qlbl">Khóa 5 Ngày Lấy Gốc</div></div>',
        '  </div>',
        '  <div class="vlxt-ea-mission-card" id="ea-mission-1-box">' + mission1Html + '</div>',
        '  <div class="vlxt-ea-mission-card" id="ea-mission-2-box">',
        '    <div class="vlxt-ea-mission-head"><span class="vlxt-ea-mission-title">⚔️ Nhiệm vụ 2: Rủ Bạn Cùng Lớp Thi Đấu</span><span class="vlxt-ea-tag ok">+' + bonusRef + 'd cho CẢ HAI / bạn</span></div>',
        '    <div style="font-size:12.5px;color:var(--ea-sub)">Mỗi bạn cùng lớp bấm link của em và làm xong 1 đề, <b>cả 2 đều được cộng +' + bonusRef + ' ngày VIP</b> &amp; mở thêm đề mới tới <b>Đề 10</b> (tối đa +' + maxBonus + 'd).</div>',
        '    <div style="margin-top:8px;font-size:12px;color:var(--ea-muted)">Tiến độ Thủ Lĩnh Lớp (<b>' + gp.qualifiedReferralsCount + '/3</b> bạn đã thi · +Ngày 3 Lấy Gốc &amp; Đề 10):</div>',
        '    <div class="vlxt-ea-progress"><i style="width:' + leaderPct + '%"></i></div>',
        '    <div class="vlxt-ea-share-row">',
        '      <input type="text" class="vlxt-ea-input" readonly value="' + escHtml(share.url) + '" id="ea-share-url-inp" style="flex:1;min-width:180px;font-size:12px">',
        '      <button type="button" class="vlxt-ea-btn primary" id="ea-copy-challenge-btn" style="width:auto;padding:9px 14px;white-space:nowrap">📋 Chép Lời Thách Đấu</button>',
        '    </div>',
        '    <div class="vlxt-ea-ref-list">' + refItemsHtml + '</div>',
        '  </div>',
        '  <div class="vlxt-ea-actions">',
        '    <a href="' + escHtml(cfg.zaloGroupUrl) + '" target="_blank" rel="noopener" id="vlxt-ea-join-zalo-btn" class="vlxt-ea-btn zalo">👥 Tham gia Nhóm Zalo Nhận PDF &amp; Lịch Live</a>',
        '    <a href="goi-hoc.html?reserve=1&trigger=ea_mission_modal" id="vlxt-ea-goihoc-btn" class="vlxt-ea-btn ghost">👑 Mở khóa trọn bộ 50 Đề &amp; 4 Chương (50.000đ/tháng)</a>',
        '  </div>',
        '</div>'
      ].join('');
    }

    function mountAndBind() {
      bd.innerHTML = buildModalHtml();
      var close = function () { bd.remove(); };
      var cBtn = document.getElementById('vlxt-ea-close-btn');
      if (cBtn) cBtn.onclick = close;

      bd.querySelectorAll('#ea-feat-chips .vlxt-ea-chip-opt').forEach(function (btn) {
        btn.onclick = function () {
          selectedFeat = btn.getAttribute('data-feat');
          bd.querySelectorAll('#ea-feat-chips .vlxt-ea-chip-opt').forEach(function (b) { b.classList.toggle('active', b === btn); });
        };
      });
      bd.querySelectorAll('#ea-target-chips .vlxt-ea-chip-opt[data-target]').forEach(function (btn) {
        btn.onclick = function () {
          selectedTarget = btn.getAttribute('data-target');
          bd.querySelectorAll('#ea-target-chips .vlxt-ea-chip-opt[data-target]').forEach(function (b) { b.classList.toggle('active', b === btn); });
        };
      });
      bd.querySelectorAll('#ea-target-chips .vlxt-ea-chip-opt[data-rate]').forEach(function (btn) {
        btn.onclick = function () {
          selectedRate = Number(btn.getAttribute('data-rate') || 5);
          bd.querySelectorAll('#ea-target-chips .vlxt-ea-chip-opt[data-rate]').forEach(function (b) { b.classList.toggle('active', b === btn); });
        };
      });

      var fbBtn = document.getElementById('ea-fb-submit-btn');
      if (fbBtn) {
        fbBtn.onclick = function () {
          var msgEl = document.getElementById('ea-fb-msg');
          var errEl = document.getElementById('ea-fb-err');
          var msg = msgEl ? msgEl.value.trim() : '';
          fbBtn.disabled = true;
          fbBtn.textContent = 'Đang xác nhận...';
          completeFeedbackMission({
            rating: selectedRate,
            favoriteFeature: selectedFeat,
            targetScore: selectedTarget,
            message: msg
          }).then(function (res) {
            if (res && res.ok) {
              notifyGrowthToast('🎉 Tuyệt vời! Cộng +' + res.bonusAdded + ' ngày VIP & Đã mở Đề 06 ĐGNL + Ngày 2 Lấy Gốc!');
              mountAndBind();
            } else {
              fbBtn.disabled = false;
              fbBtn.textContent = '🎁 Gửi Đánh Giá & Nhận +' + bonusFb + ' Ngày VIP';
              if (errEl) {
                errEl.textContent = (res && res.reason === 'message_too_short_or_spam')
                  ? 'Em viết nhận xét thật tối thiểu 15 ký tự (ít nhất 3 từ) nhé!'
                  : 'Chưa thể hoàn tất lúc này, em thử lại nhé.';
              }
            }
          });
        };
      }

      var cpBtn = document.getElementById('ea-copy-challenge-btn');
      if (cpBtn) {
        cpBtn.onclick = function () {
          copyChallengeLink({ source: 'mission_modal' }).then(function (res) {
            cpBtn.textContent = res.copied ? '✓ Đã chép link & lời mời!' : '✓ Đã tạo link';
            setTimeout(function () { if (cpBtn) cpBtn.textContent = '📋 Chép Lời Thách Đấu'; }, 2400);
          });
        };
      }

      var zBtn = document.getElementById('vlxt-ea-join-zalo-btn');
      var gBtn = document.getElementById('vlxt-ea-goihoc-btn');
      if (zBtn) zBtn.onclick = function () { track('zalo_group_click', { source: 'mission_modal', url: cfg.zaloGroupUrl }); };
      if (gBtn) gBtn.onclick = function () { setConversionTrigger('ea_mission_modal', 'Nâng cấp VIP từ Modal Nhiệm Vụ'); };
    }

    bd.addEventListener('click', function (e) { if (e.target === bd) bd.remove(); });
    document.body.appendChild(bd);
    mountAndBind();

    if (defaultFocus === 'feedback' && document.getElementById('ea-fb-msg')) {
      setTimeout(function () { var m = document.getElementById('ea-fb-msg'); if (m) m.focus(); }, 120);
    }
  }

  function openEarlyAccessModal(mode) {
    return openMissionModal(mode || 'info');
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
    chip.title = 'Xem quỹ ngày VIP & làm nhiệm vụ nhận thêm +2 ngày/bạn';
    chip.innerHTML = '<span class="ea-dot"></span><span id="vlxt-ea-chip-text">' + escHtml(st.formattedShort) + '</span>';
    chip.onclick = function () {
      setConversionTrigger('ea_countdown_chip', 'Bấm đồng hồ đếm ngược ' + st.totalDays + ' ngày');
      track('ea_chip_click', { page: page, totalDays: st.totalDays });
      openMissionModal('info');
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
    var cPhone = String((payload && payload.contactPhone) || actor.sdt || '').trim();
    var cName = String((payload && payload.contactName) || actor.hoten || 'Khách').trim();
    var record = {
      id: id,
      type: (payload && payload.type) === 'idea' ? 'idea' : 'bug',
      category: (payload && payload.category) || 'general',
      rating: (payload && payload.rating) ? Number(payload.rating) : null,
      favoriteFeature: (payload && payload.favoriteFeature) ? String(payload.favoriteFeature).trim().slice(0, 80) : '',
      targetScore: (payload && payload.targetScore) ? String(payload.targetScore).trim().slice(0, 20) : '',
      isMissionFeedback: Boolean(payload && payload.isMissionFeedback),
      firstExamSummary: (payload && payload.firstExamSummary) || null,
      message: String((payload && payload.message) || '').trim().slice(0, 1500),
      contactPhone: cPhone,
      contactName: cName,
      sdt: cPhone,
      hoten: cName,
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
      deviceType: getDeviceType(),
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
      captureIncomingReferralFromUrl();
      refreshCampaignConfig(false);
      var uNow = getUser();
      if (isLoggedInUser(uNow)) syncGrowthProfile(uNow);
      renderCountdownChip();
      maybeShowZaloGroupWelcomeModal(uNow, false);
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
    openMissionModal: openMissionModal,
    maybeShowZaloGroupWelcomeModal: maybeShowZaloGroupWelcomeModal
  };

  var VLXT_GROWTH = {
    makeRefCode: makeRefCode,
    getGrowthProfile: getGrowthProfile,
    saveGrowthProfileLocal: saveGrowthProfileLocal,
    syncGrowthProfile: syncGrowthProfile,
    getPendingReferral: getPendingReferral,
    captureIncomingReferralFromUrl: captureIncomingReferralFromUrl,
    bindReferralOnRegister: bindReferralOnRegister,
    recordQualifiedActivity: recordQualifiedActivity,
    completeFeedbackMission: completeFeedbackMission,
    buildSharePayload: buildSharePayload,
    copyChallengeLink: copyChallengeLink,
    openMissionModal: openMissionModal
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
  global.VLXT_GROWTH = VLXT_GROWTH;
  global.VLXT_TELEMETRY = VLXT_TELEMETRY;
  global.vlxtLog = legacyCompatibleLog;

  startBrowserLifecycle();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VLXT_CAMPAIGN: VLXT_CAMPAIGN, VLXT_GROWTH: VLXT_GROWTH, VLXT_TELEMETRY: VLXT_TELEMETRY };
  }
})(typeof window !== 'undefined' ? window : globalThis);
