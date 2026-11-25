import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(String(k), String(v)); },
    removeItem(k) { store.delete(k); },
    clear() { store.clear(); },
    _dump() { return Object.fromEntries(store.entries()); }
  };
}

function loadModule(localStorage, fetchImpl) {
  const code = fs.readFileSync('dgnl-progress-store.js', 'utf8');
  const events = [];
  const sandbox = {
    localStorage,
    fetch: fetchImpl,
    CustomEvent: function CustomEvent(name, init) {
      this.type = name;
      this.detail = init ? init.detail : null;
    },
    dispatchEvent(ev) { events.push(ev); },
    console,
    setTimeout,
    clearTimeout
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.runInNewContext(code, sandbox, { filename: 'dgnl-progress-store.js' });
  return { store: sandbox.VlxtDgnlProgress, sandbox, events };
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('TEST SUITE: DGNL PROGRESS ISOLATION & MULTI-DEVICE CLOUD SYNC');
console.log('═══════════════════════════════════════════════════════════════');

// 1. Account key normalization
{
  const ls = createLocalStorageMock();
  const { store } = loadModule(ls);
  assert.equal(store.normalizeAccountKey('0896.487.515'), '0896487515');
  assert.equal(store.normalizeAccountKey('HocSinh.12A@Gmail.com'), 'hocsinh_12a@gmail_com');
  assert.equal(store.normalizeAccountKey('FREE'), 'guest');
  assert.equal(store.normalizeAccountKey(''), 'guest');
  console.log('✓ 1. Account key normalization (SĐT / Gmail / guest)');
}

// 2. Strict per-account isolation on the same browser/machine
{
  const ls = createLocalStorageMock();
  const { store, sandbox } = loadModule(ls);
  sandbox.__VLXT_DISABLE_CLOUD_SYNC__ = true;

  // Legacy global keys from earlier visits should NEVER bleed into logged-in accounts
  ls.setItem('vlxt_thptqg50_history_v1', JSON.stringify({ DE_02: { examNumber: 2, score10: '0.25', bestScore: '0.25', attempts: 1, ts: 1000 } }));
  ls.setItem('vlxt_dgnl_latest_result', JSON.stringify({ examNumber: 2, score10: '0.25', timestamp: 1000 }));
  ls.setItem('vlxt_dgnl_sessions_v2', JSON.stringify({ '2': { examNumber: 2, status: 'in_progress', answeredCount: 0, remainingSeconds: 2995, updatedAt: 1000 } }));

  // Login Account A
  ls.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0896487515', hoten: 'HS A', lop: '12a3' }));
  assert.equal(store.getCurrentAccountKey(), '0896487515');
  assert.equal(Object.keys(store.getHistory()).length, 0);
  assert.equal(store.getLatestResult(), null);
  assert.equal(store.getInProgressList().length, 0);

  // Account A submits De 02 (8.50) and pauses De 03
  store.saveHistoryEntry('DE_02', { examNumber: 2, score10: '8.50', bestScore: '8.50', attempts: 1, ts: 2000 });
  store.saveLatestResult({ examNumber: 2, score10: '8.50', predictedScore: 8.5, timestamp: 2000 });
  store.setSession(3, { examNumber: 3, status: 'in_progress', answeredCount: 5, remainingSeconds: 2500, updatedAt: 3000 });

  assert.equal(Object.keys(store.getHistory()).length, 1);
  assert.equal(store.getHistory().DE_02.bestScore, '8.50');
  assert.equal(store.getInProgressList().length, 1);
  assert.equal(store.getInProgressList()[0].examNumber, 3);

  // Switch to Account B on the exact same machine -> clean slate!
  ls.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0912345678', hoten: 'HS B', lop: '12a1' }));
  assert.equal(store.getCurrentAccountKey(), '0912345678');
  assert.equal(Object.keys(store.getHistory()).length, 0);
  assert.equal(store.getLatestResult(), null);
  assert.equal(store.getInProgressList().length, 0);

  // Switch back to Account A -> A's data is still intact!
  ls.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0896487515', hoten: 'HS A', lop: '12a3' }));
  assert.equal(store.getHistory().DE_02.bestScore, '8.50');
  assert.equal(store.getLatestResult().score10, '8.50');
  assert.equal(store.getInProgressList()[0].examNumber, 3);
  console.log('✓ 2. Strict per-account isolation on same machine (A vs B vs legacy keys)');
}

// 3. Guest -> Account migration on login
{
  const ls = createLocalStorageMock();
  const { store, sandbox } = loadModule(ls);
  sandbox.__VLXT_DISABLE_CLOUD_SYNC__ = true;

  store.saveHistoryEntry('DE_01', { examNumber: 1, score10: '7.25', bestScore: '7.25', attempts: 1, ts: 1500 }, 'guest');
  store.saveLatestResult({ examNumber: 1, score10: '7.25', timestamp: 1500 }, 'guest');
  const migrated = store.migrateGuestToAccount('0988776655');
  assert.equal(migrated, true);
  assert.equal(store.getHistory('0988776655').DE_01.bestScore, '7.25');
  assert.equal(store.getLatestResult('0988776655').score10, '7.25');
  assert.equal(Object.keys(store.getHistory('guest')).length, 0);
  assert.equal(store.getLatestResult('guest'), null);
  console.log('✓ 3. Guest-to-account migration transfers progress & cleans guest bucket');
}

// 4. Multi-device Cloud Sync (Device 1 <-> Firebase RTDB <-> Device 2)
{
  const cloudDb = {};
  const makeFetch = () => async (url, opts) => {
    const m = url.match(/\/profiles\/([^/]+)\/dgnlProgress\.json/);
    const key = m ? decodeURIComponent(m[1]) : '';
    if (opts && opts.method === 'PUT') {
      cloudDb[key] = JSON.parse(opts.body);
      return { ok: true, async json() { return cloudDb[key]; } };
    }
    return { ok: true, async json() { return cloudDb[key] || null; } };
  };

  // Device 1: Account A saves De 02 (8.50) and pauses De 03
  const ls1 = createLocalStorageMock();
  ls1.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0896487515', hoten: 'HS A' }));
  const dev1 = loadModule(ls1, makeFetch()).store;
  dev1.saveHistoryEntry('DE_02', { examNumber: 2, score10: '8.50', bestScore: '8.50', attempts: 1, ts: 10000 });
  dev1.saveLatestResult({ examNumber: 2, score10: '8.50', predictedScore: 8.5, timestamp: 10000 });
  dev1.setSession(3, { examNumber: 3, status: 'in_progress', answeredCount: 12, remainingSeconds: 1800, updatedAt: 11000 });
  await dev1.flushCloudPush();
  assert.ok(cloudDb['0896487515'], 'Cloud should receive Device 1 snapshot');

  // Device 2 (fresh phone/browser): Logs into Account A -> syncs from Cloud!
  const ls2 = createLocalStorageMock();
  ls2.setItem('vlxt_user_v2', JSON.stringify({ sdt: '0896487515', hoten: 'HS A' }));
  const dev2 = loadModule(ls2, makeFetch()).store;
  const syncRes1 = await dev2.syncFromCloud();
  assert.equal(syncRes1.synced, true);
  assert.equal(syncRes1.changed, true);
  assert.equal(dev2.getHistory().DE_02.bestScore, '8.50');
  assert.equal(dev2.getLatestResult().score10, '8.50');
  assert.equal(dev2.getInProgressList()[0].examNumber, 3);
  assert.equal(dev2.getInProgressList()[0].answeredCount, 12);

  // Device 2 completes and submits De 03 (9.25) with ts > session.updatedAt, then pushes
  dev2.clearSession(3);
  dev2.saveHistoryEntry('DE_03', { examNumber: 3, score10: '9.25', bestScore: '9.25', attempts: 1, ts: 20000 });
  dev2.saveLatestResult({ examNumber: 3, score10: '9.25', predictedScore: 9.25, timestamp: 20000 });
  await dev2.pushToCloud();

  // Device 1 syncs back -> receives De 03 score (9.25) AND drops stale in_progress session for De 03!
  const syncRes2 = await dev1.syncFromCloud();
  assert.equal(syncRes2.synced, true);
  assert.equal(syncRes2.changed, true);
  assert.equal(dev1.getHistory().DE_03.bestScore, '9.25');
  assert.equal(dev1.getLatestResult().score10, '9.25');
  assert.equal(dev1.getInProgressList().length, 0);
  console.log('✓ 4. Multi-device Cloud Sync (push, pull on new phone, and stale session cleanup)');
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('ALL 4 DGNL PROGRESS ISOLATION & CLOUD SYNC TESTS PASSED (100%)!');
console.log('═══════════════════════════════════════════════════════════════');
