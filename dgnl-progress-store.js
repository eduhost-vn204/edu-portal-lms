/* ═══════════════════════════════════════════════════════════════════════
   VLXT DGNL PROGRESS STORE — LƯU LỊCH SỬ & TIẾN ĐỘ 50 ĐỀ THEO TÀI KHOẢN
   Vật Lý Xuân Trường (eduhost-vn204/edu-portal-lms)
   - Cô lập tuyệt đối theo từng tài khoản:
     vlxt_dgnl_history_v2_<acc>, vlxt_dgnl_sessions_v3_<acc>, vlxt_dgnl_latest_v2_<acc>
   - Đồng bộ nền đa thiết bị qua Firebase RTDB (profiles/<acc>/dgnlProgress),
     offline-first 0ms (không bao giờ chặn giao diện).
   ═══════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var HISTORY_PREFIX = 'vlxt_dgnl_history_v2_';
  var SESSIONS_PREFIX = 'vlxt_dgnl_sessions_v3_';
  var LATEST_PREFIX = 'vlxt_dgnl_latest_v2_';
  var USER_STORAGE_KEY = 'vlxt_user_v2';
  var RTDB_BASE = 'https://edu-portal-live-default-rtdb.firebaseio.com';

  var _pushTimers = {};
  var _dirtyAccounts = {};

  function getLS() {
    try {
      if (typeof root !== 'undefined' && root.localStorage) return root.localStorage;
      if (typeof localStorage !== 'undefined') return localStorage;
    } catch (e) {}
    return null;
  }

  function normalizeAccountKey(raw) {
    if (raw && typeof raw === 'object') {
      raw = raw.sdt || raw.email || raw.key || '';
    }
    var s = String(raw || '').trim();
    if (!s) return 'guest';
    var up = s.toUpperCase();
    if (up === 'FREE' || up === 'GUEST' || up.indexOf('HS-THITHU') === 0) return 'guest';
    if (s.indexOf('@') > -1) {
      return s.toLowerCase().replace(/[.#$\[\]\/]/g, '_');
    }
    var digits = s.replace(/\D/g, '');
    if (digits.length >= 6) return digits;
    var safe = s.toLowerCase().replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_');
    return safe || 'guest';
  }

  function getCurrentUser() {
    var ls = getLS();
    if (!ls) return null;
    try {
      return JSON.parse(ls.getItem(USER_STORAGE_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function getCurrentAccountKey() {
    var u = getCurrentUser();
    return normalizeAccountKey(u ? (u.sdt || u.email || '') : '');
  }

  function resolveAcc(accountKey) {
    return normalizeAccountKey(accountKey || getCurrentAccountKey());
  }

  function readJson(key, fallback) {
    var ls = getLS();
    if (!ls) return fallback;
    try {
      var raw = ls.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function writeJson(key, val) {
    var ls = getLS();
    if (!ls) return;
    try {
      if (val === null || val === undefined) {
        ls.removeItem(key);
      } else {
        ls.setItem(key, JSON.stringify(val));
      }
    } catch (e) {}
  }

  function pad2(n) {
    var num = Number(n);
    return num < 10 ? '0' + num : String(num);
  }

  function extractExamNumber(key, obj) {
    if (obj && Number.isFinite(Number(obj.examNumber)) && Number(obj.examNumber) >= 1 && Number(obj.examNumber) <= 50) {
      return Number(obj.examNumber);
    }
    var m = String(key || '').match(/DE[_-]?0*(\d{1,2})$/i);
    if (m) return Number(m[1]);
    var n = parseInt(String(key || ''), 10);
    if (Number.isFinite(n) && n >= 1 && n <= 50) return n;
    return null;
  }

  function canonicalExamId(examNum) {
    return 'DE_' + pad2(Number(examNum));
  }

  function parseScoreNum(val) {
    if (val === null || val === undefined || val === '') return 0;
    var n = parseFloat(String(val).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }

  function normalizeHistoryMap(rawMap) {
    var out = {};
    if (!rawMap || typeof rawMap !== 'object' || Array.isArray(rawMap)) return out;
    Object.keys(rawMap).forEach(function (k) {
      var item = rawMap[k];
      if (!item || typeof item !== 'object') return;
      var num = extractExamNumber(k, item);
      if (!num) return;
      var eid = canonicalExamId(num);
      var prev = out[eid];
      var curScore = parseScoreNum(item.score10 != null ? item.score10 : item.lastScore);
      var curBest = Math.max(parseScoreNum(item.bestScore != null ? item.bestScore : curScore), curScore);
      var curTs = Number(item.ts || 0);
      var curAttempts = Math.max(1, Number(item.attempts || 1));
      if (!prev) {
        out[eid] = Object.assign({}, item, {
          examNumber: num,
          bestScore: curBest.toFixed(2),
          attempts: curAttempts,
          ts: curTs
        });
      } else {
        var prevBest = parseScoreNum(prev.bestScore);
        var prevTs = Number(prev.ts || 0);
        var newer = curTs >= prevTs ? item : prev;
        out[eid] = Object.assign({}, newer, {
          examNumber: num,
          bestScore: Math.max(prevBest, curBest).toFixed(2),
          attempts: Math.max(Number(prev.attempts || 1), curAttempts),
          ts: Math.max(prevTs, curTs)
        });
      }
    });
    return out;
  }

  function normalizeSessionsMap(rawMap) {
    var out = {};
    if (!rawMap || typeof rawMap !== 'object' || Array.isArray(rawMap)) return out;
    var bestKey = null;
    var bestTs = -1;
    Object.keys(rawMap).forEach(function (k) {
      var s = rawMap[k];
      if (!s || typeof s !== 'object' || s.status !== 'in_progress') return;
      var num = extractExamNumber(k, s);
      if (!num) return;
      var ts = Number(s.updatedAt || s.startedAt || 0);
      if (ts >= bestTs) {
        bestTs = ts;
        bestKey = String(num);
        out = {};
        out[bestKey] = Object.assign({}, s, { examNumber: num });
      }
    });
    return out;
  }

  function getHistory(accountKey) {
    var acc = resolveAcc(accountKey);
    return normalizeHistoryMap(readJson(HISTORY_PREFIX + acc, {}));
  }

  function setHistory(map, accountKey, opts) {
    var acc = resolveAcc(accountKey);
    var norm = normalizeHistoryMap(map || {});
    writeJson(HISTORY_PREFIX + acc, norm);
    emitUpdated(acc);
    if (!(opts && opts.skipCloud) && acc !== 'guest') {
      scheduleCloudPush(acc, opts && opts.immediate ? 0 : 800);
    }
    return norm;
  }

  function saveHistoryEntry(examIdOrNum, entry, accountKey) {
    var acc = resolveAcc(accountKey);
    var num = extractExamNumber(examIdOrNum, entry);
    if (!num) return getHistory(acc);
    var eid = canonicalExamId(num);
    var map = getHistory(acc);
    var prev = map[eid];
    var curScore = parseScoreNum(entry && (entry.score10 != null ? entry.score10 : entry.lastScore));
    var prevBest = prev ? parseScoreNum(prev.bestScore) : 0;
    var curBest = Math.max(prevBest, parseScoreNum(entry && entry.bestScore), curScore);
    map[eid] = Object.assign({}, entry || {}, {
      examNumber: num,
      bestScore: curBest.toFixed(2),
      attempts: Math.max(Number(entry && entry.attempts || 0), (prev ? Number(prev.attempts || 0) : 0) + (entry && entry.attempts ? 0 : 1), 1),
      ts: Number((entry && entry.ts) || Date.now())
    });
    return setHistory(map, acc, { immediate: true });
  }

  function getSessions(accountKey) {
    var acc = resolveAcc(accountKey);
    return normalizeSessionsMap(readJson(SESSIONS_PREFIX + acc, {}));
  }

  function setSessions(map, accountKey, opts) {
    var acc = resolveAcc(accountKey);
    var norm = normalizeSessionsMap(map || {});
    writeJson(SESSIONS_PREFIX + acc, norm);
    emitUpdated(acc);
    if (!(opts && opts.skipCloud) && acc !== 'guest') {
      var delay = (opts && typeof opts.delayMs === 'number') ? opts.delayMs : 3500;
      scheduleCloudPush(acc, delay);
    }
    return norm;
  }

  function getSession(examNum, accountKey) {
    var all = getSessions(accountKey);
    return all[String(Number(examNum))] || null;
  }

  function setSession(examNum, sessObj, accountKey) {
    var num = Number(examNum);
    if (!Number.isFinite(num) || num < 1 || num > 50 || !sessObj) return null;
    var normalized = Object.assign({}, sessObj, { examNumber: num });
    var next = {};
    if (normalized.status === 'in_progress') {
      next[String(num)] = normalized;
    }
    setSessions(next, accountKey, { delayMs: 3500 });
    return normalized;
  }

  function clearSession(examNum, accountKey) {
    var acc = resolveAcc(accountKey);
    var all = getSessions(acc);
    var k = String(Number(examNum));
    if (all[k]) {
      delete all[k];
      setSessions(all, acc, { delayMs: 0 });
    }
    var ls = getLS();
    if (ls && acc === 'guest') {
      try { ls.removeItem('vlxt_dgnl_guest_answers_de' + examNum); } catch (e) {}
    }
  }

  function getInProgressList(accountKey) {
    var all = getSessions(accountKey);
    return Object.keys(all).map(function (k) { return all[k]; })
      .filter(function (s) { return s && s.status === 'in_progress' && Number(s.examNumber) >= 1 && Number(s.examNumber) <= 50; })
      .sort(function (a, b) { return Number(b.updatedAt || 0) - Number(a.updatedAt || 0); });
  }

  function getLatestResult(accountKey) {
    var acc = resolveAcc(accountKey);
    var obj = readJson(LATEST_PREFIX + acc, null);
    return (obj && typeof obj === 'object' && obj.examNumber) ? obj : null;
  }

  function saveLatestResult(resultObj, accountKey, opts) {
    var acc = resolveAcc(accountKey);
    if (!resultObj || typeof resultObj !== 'object') return null;
    var payload = Object.assign({}, resultObj, {
      timestamp: Number(resultObj.timestamp || Date.now())
    });
    writeJson(LATEST_PREFIX + acc, payload);
    emitUpdated(acc);
    if (!(opts && opts.skipCloud) && acc !== 'guest') {
      scheduleCloudPush(acc, opts && opts.immediate === false ? 800 : 0);
    }
    return payload;
  }

  function buildSnapshot(accountKey) {
    var acc = resolveAcc(accountKey);
    return {
      version: 2,
      accountKey: acc,
      updatedAt: Date.now(),
      history: getHistory(acc),
      sessions: getSessions(acc),
      latestResult: getLatestResult(acc)
    };
  }

  function mergeHistoryMaps(localMap, remoteMap) {
    var loc = normalizeHistoryMap(localMap);
    var rem = normalizeHistoryMap(remoteMap);
    var merged = {};
    var allKeys = Object.keys(loc);
    Object.keys(rem).forEach(function (k) {
      if (allKeys.indexOf(k) === -1) allKeys.push(k);
    });
    allKeys.forEach(function (k) {
      var a = loc[k];
      var b = rem[k];
      if (!a) { merged[k] = b; return; }
      if (!b) { merged[k] = a; return; }
      var aTs = Number(a.ts || 0);
      var bTs = Number(b.ts || 0);
      var newer = (bTs > aTs) ? b : a;
      var bestNum = Math.max(parseScoreNum(a.bestScore), parseScoreNum(b.bestScore), parseScoreNum(a.score10), parseScoreNum(b.score10));
      merged[k] = Object.assign({}, newer, {
        examNumber: Number(newer.examNumber || a.examNumber || b.examNumber),
        bestScore: bestNum.toFixed(2),
        attempts: Math.max(Number(a.attempts || 1), Number(b.attempts || 1)),
        ts: Math.max(aTs, bTs)
      });
    });
    return merged;
  }

  function mergeProgress(localSnap, remoteSnap) {
    var loc = (localSnap && typeof localSnap === 'object') ? localSnap : {};
    var rem = (remoteSnap && typeof remoteSnap === 'object') ? remoteSnap : {};

    var mergedHistory = mergeHistoryMaps(loc.history || {}, rem.history || {});

    var locLatest = (loc.latestResult && typeof loc.latestResult === 'object' && loc.latestResult.examNumber) ? loc.latestResult : null;
    var remLatest = (rem.latestResult && typeof rem.latestResult === 'object' && rem.latestResult.examNumber) ? rem.latestResult : null;
    var mergedLatest = null;
    if (locLatest && remLatest) {
      mergedLatest = Number(remLatest.timestamp || 0) > Number(locLatest.timestamp || 0) ? remLatest : locLatest;
    } else {
      mergedLatest = locLatest || remLatest;
    }

    // Pick newest in_progress session, but drop it if that exam was submitted more recently
    var locSess = normalizeSessionsMap(loc.sessions || {});
    var remSess = normalizeSessionsMap(rem.sessions || {});
    var candidates = [];
    Object.keys(locSess).forEach(function (k) { candidates.push(locSess[k]); });
    Object.keys(remSess).forEach(function (k) { candidates.push(remSess[k]); });
    candidates.sort(function (a, b) {
      return Number(b.updatedAt || b.startedAt || 0) - Number(a.updatedAt || a.startedAt || 0);
    });
    var mergedSessions = {};
    for (var i = 0; i < candidates.length; i++) {
      var cand = candidates[i];
      if (!cand || cand.status !== 'in_progress') continue;
      var eid = canonicalExamId(cand.examNumber);
      var h = mergedHistory[eid];
      var sTs = Number(cand.updatedAt || cand.startedAt || 0);
      if (h && Number(h.ts || 0) > sTs) {
        continue; // Exam already submitted after this paused session
      }
      mergedSessions[String(Number(cand.examNumber))] = cand;
      break;
    }

    return {
      history: mergedHistory,
      sessions: mergedSessions,
      latestResult: mergedLatest
    };
  }

  function emitUpdated(accountKey) {
    try {
      if (typeof root !== 'undefined' && typeof root.dispatchEvent === 'function' && typeof root.CustomEvent === 'function') {
        root.dispatchEvent(new root.CustomEvent('vlxt:dgnl-progress-updated', {
          detail: { accountKey: accountKey }
        }));
      }
    } catch (e) {}
  }

  function isCloudSyncAllowed(accountKey) {
    if (!accountKey || accountKey === 'guest') return false;
    if (typeof root !== 'undefined' && root.__VLXT_DISABLE_CLOUD_SYNC__) return false;
    if (typeof fetch !== 'function' && !(typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length)) return false;
    return true;
  }

  function scheduleCloudPush(accountKey, delayMs) {
    var acc = resolveAcc(accountKey);
    if (!isCloudSyncAllowed(acc)) return;
    _dirtyAccounts[acc] = true;
    if (_pushTimers[acc]) {
      clearTimeout(_pushTimers[acc]);
      delete _pushTimers[acc];
    }
    var wait = (typeof delayMs === 'number' && delayMs >= 0) ? delayMs : 600;
    if (wait === 0) {
      pushToCloud(acc);
      return;
    }
    _pushTimers[acc] = setTimeout(function () {
      delete _pushTimers[acc];
      pushToCloud(acc);
    }, wait);
  }

  function pushToCloud(accountKey, opts) {
    var acc = resolveAcc(accountKey);
    if (!isCloudSyncAllowed(acc)) return Promise.resolve(false);
    if (_pushTimers[acc]) {
      clearTimeout(_pushTimers[acc]);
      delete _pushTimers[acc];
    }
    _dirtyAccounts[acc] = false;
    var payload = buildSnapshot(acc);
    var useKeepalive = Boolean(opts && opts.keepalive);

    if (!useKeepalive) {
      try {
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
          return firebase.database().ref('profiles/' + acc + '/dgnlProgress').set(payload)
            .then(function () { return true; })
            .catch(function () { return false; });
        }
      } catch (e) {}
    }

    try {
      var fetchOpts = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      };
      if (useKeepalive) fetchOpts.keepalive = true;
      return fetch(RTDB_BASE + '/profiles/' + encodeURIComponent(acc) + '/dgnlProgress.json', fetchOpts)
        .then(function (r) { return Boolean(r && r.ok); })
        .catch(function () { return false; });
    } catch (e) {
      return Promise.resolve(false);
    }
  }

  function flushCloudPush(accountKey) {
    var acc = resolveAcc(accountKey);
    if (!isCloudSyncAllowed(acc)) return Promise.resolve(false);
    if (_pushTimers[acc] || _dirtyAccounts[acc]) {
      return pushToCloud(acc, { keepalive: true });
    }
    return Promise.resolve(false);
  }

  function snapshotComparable(snap) {
    return JSON.stringify({
      history: snap.history || {},
      sessions: snap.sessions || {},
      latestResult: snap.latestResult || null
    });
  }

  function syncFromCloud(accountKey) {
    var acc = resolveAcc(accountKey);
    if (!isCloudSyncAllowed(acc)) {
      return Promise.resolve({ synced: false, changed: false, accountKey: acc });
    }

    var fetchPromise;
    try {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length && typeof firebase.database === 'function') {
        fetchPromise = firebase.database().ref('profiles/' + acc + '/dgnlProgress').once('value')
          .then(function (snap) { return snap ? snap.val() : null; });
      }
    } catch (e) {}

    if (!fetchPromise) {
      try {
        fetchPromise = fetch(RTDB_BASE + '/profiles/' + encodeURIComponent(acc) + '/dgnlProgress.json')
          .then(function (r) { return (r && r.ok) ? r.json() : null; });
      } catch (e) {
        return Promise.resolve({ synced: false, changed: false, accountKey: acc });
      }
    }

    return fetchPromise.then(function (remoteData) {
      var remNorm = mergeProgress({}, remoteData || {});
      var localNow = buildSnapshot(acc);
      var merged = mergeProgress(localNow, remNorm);

      var localStr = snapshotComparable(localNow);
      var remoteStr = snapshotComparable(remNorm);
      var mergedStr = snapshotComparable(merged);

      var changed = localStr !== mergedStr;
      var needPushBack = mergedStr !== remoteStr && (
        Object.keys(merged.history).length > 0 ||
        Object.keys(merged.sessions).length > 0 ||
        Boolean(merged.latestResult)
      );

      if (changed) {
        writeJson(HISTORY_PREFIX + acc, merged.history);
        writeJson(SESSIONS_PREFIX + acc, merged.sessions);
        if (merged.latestResult) writeJson(LATEST_PREFIX + acc, merged.latestResult);
        else writeJson(LATEST_PREFIX + acc, null);
        emitUpdated(acc);
      }

      if (needPushBack) {
        pushToCloud(acc);
      }

      return { synced: true, changed: changed, accountKey: acc };
    }).catch(function () {
      return { synced: false, changed: false, accountKey: acc };
    });
  }

  function migrateGuestToAccount(accountKey) {
    var acc = resolveAcc(accountKey);
    if (!acc || acc === 'guest') return false;
    var guestSnap = buildSnapshot('guest');
    var hasGuestData = Object.keys(guestSnap.history).length > 0 ||
      Object.keys(guestSnap.sessions).length > 0 ||
      Boolean(guestSnap.latestResult);
    if (!hasGuestData) return false;

    var accSnap = buildSnapshot(acc);
    var merged = mergeProgress(accSnap, guestSnap);

    writeJson(HISTORY_PREFIX + acc, merged.history);
    writeJson(SESSIONS_PREFIX + acc, merged.sessions);
    if (merged.latestResult) writeJson(LATEST_PREFIX + acc, merged.latestResult);

    writeJson(HISTORY_PREFIX + 'guest', null);
    writeJson(SESSIONS_PREFIX + 'guest', null);
    writeJson(LATEST_PREFIX + 'guest', null);

    var ls = getLS();
    if (ls) {
      try {
        ls.removeItem('vlxt_dgnl_latest_result');
        ls.removeItem('vlxt_dgnl_guest_answers');
        ls.removeItem('vlxt_dgnl_timer');
        ls.removeItem('vlxt_dgnl_timer_exam');
      } catch (e) {}
    }

    emitUpdated(acc);
    pushToCloud(acc);
    return true;
  }

  var VlxtDgnlProgress = {
    VERSION: '1.0.0',
    HISTORY_PREFIX: HISTORY_PREFIX,
    SESSIONS_PREFIX: SESSIONS_PREFIX,
    LATEST_PREFIX: LATEST_PREFIX,
    normalizeAccountKey: normalizeAccountKey,
    getCurrentAccountKey: getCurrentAccountKey,
    getHistory: getHistory,
    setHistory: setHistory,
    saveHistoryEntry: saveHistoryEntry,
    getSessions: getSessions,
    setSessions: setSessions,
    getSession: getSession,
    setSession: setSession,
    clearSession: clearSession,
    getInProgressList: getInProgressList,
    getLatestResult: getLatestResult,
    saveLatestResult: saveLatestResult,
    migrateGuestToAccount: migrateGuestToAccount,
    mergeProgress: mergeProgress,
    syncFromCloud: syncFromCloud,
    pushToCloud: pushToCloud,
    flushCloudPush: flushCloudPush
  };

  if (typeof root !== 'undefined') root.VlxtDgnlProgress = VlxtDgnlProgress;
  if (typeof module !== 'undefined' && module.exports) module.exports = VlxtDgnlProgress;
})(typeof window !== 'undefined' ? window : globalThis);
