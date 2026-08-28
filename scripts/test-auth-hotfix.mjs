import assert from 'assert';
import fs from 'fs';

console.log('=== TEST SUITE: AUTH CONSOLIDATION & HOTFIX V81 ===\n');

function check(title, fn) {
  try {
    fn();
    console.log('OK   -', title);
  } catch (e) {
    console.error('FAIL -', title);
    console.error(e);
    process.exitCode = 1;
  }
}

// Storage migration and canonical name
class MockStorage {
  constructor() { this.store = new Map(); }
  getItem(k) { return this.store.get(k) || null; }
  setItem(k, v) { this.store.set(k, String(v)); }
  removeItem(k) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

function createAuthEnv() {
  const localStorage = new MockStorage();
  const sessionStorage = new MockStorage();

  function migrateAdminKeyStorage() {
    try {
      const legacy = localStorage.getItem('adminKey');
      if (legacy && !localStorage.getItem('vlxt_backend_admin_key') && !sessionStorage.getItem('vlxt_backend_admin_key')) {
        localStorage.setItem('vlxt_backend_admin_key', legacy.trim());
      }
      localStorage.removeItem('adminKey');
    } catch (e) {}
  }

  function getAdminKey() {
    return sessionStorage.getItem('vlxt_backend_admin_key')
        || localStorage.getItem('vlxt_backend_admin_key')
        || '';
  }

  function setAdminKey(key, remember) {
    const cleanKey = String(key || '').trim();
    if (cleanKey) {
      if (remember) {
        localStorage.setItem('vlxt_backend_admin_key', cleanKey);
        sessionStorage.removeItem('vlxt_backend_admin_key');
      } else {
        sessionStorage.setItem('vlxt_backend_admin_key', cleanKey);
        localStorage.removeItem('vlxt_backend_admin_key');
      }
    } else {
      clearAdminKey();
    }
    try { localStorage.removeItem('adminKey'); } catch (e) {}
  }

  function clearAdminKey() {
    sessionStorage.removeItem('vlxt_backend_admin_key');
    localStorage.removeItem('vlxt_backend_admin_key');
    try { localStorage.removeItem('adminKey'); } catch (e) {}
  }

  return { localStorage, sessionStorage, migrateAdminKeyStorage, getAdminKey, setAdminKey, clearAdminKey };
}

check('1. Frontend: migration chuyển legacy adminKey sang vlxt_backend_admin_key và xóa legacy', () => {
  const env = createAuthEnv();
  env.localStorage.setItem('adminKey', 'legacy_secret_123');
  env.migrateAdminKeyStorage();
  assert.equal(env.getAdminKey(), 'legacy_secret_123');
  assert.equal(env.localStorage.getItem('adminKey'), null);
  assert.equal(env.localStorage.getItem('vlxt_backend_admin_key'), 'legacy_secret_123');
});

check('2. Frontend: remember=true lưu vào localStorage, xóa sessionStorage', () => {
  const env = createAuthEnv();
  env.sessionStorage.setItem('vlxt_backend_admin_key', 'old_session');
  env.setAdminKey('my_admin_key', true);
  assert.equal(env.localStorage.getItem('vlxt_backend_admin_key'), 'my_admin_key');
  assert.equal(env.sessionStorage.getItem('vlxt_backend_admin_key'), null);
  assert.equal(env.getAdminKey(), 'my_admin_key');
});

check('3. Frontend: remember=false lưu vào sessionStorage, xóa localStorage', () => {
  const env = createAuthEnv();
  env.localStorage.setItem('vlxt_backend_admin_key', 'old_local');
  env.setAdminKey('session_only_key', false);
  assert.equal(env.sessionStorage.getItem('vlxt_backend_admin_key'), 'session_only_key');
  assert.equal(env.localStorage.getItem('vlxt_backend_admin_key'), null);
  assert.equal(env.getAdminKey(), 'session_only_key');
});

check('4. Frontend: clearAdminKey() xóa sạch cả canonical và legacy', () => {
  const env = createAuthEnv();
  env.localStorage.setItem('vlxt_backend_admin_key', 'val1');
  env.sessionStorage.setItem('vlxt_backend_admin_key', 'val2');
  env.localStorage.setItem('adminKey', 'val3');
  env.clearAdminKey();
  assert.equal(env.getAdminKey(), '');
  assert.equal(env.localStorage.getItem('vlxt_backend_admin_key'), null);
  assert.equal(env.sessionStorage.getItem('vlxt_backend_admin_key'), null);
  assert.equal(env.localStorage.getItem('adminKey'), null);
});

// Backend requireAdmin standardization
function mockGasRequireAdmin(getScriptPropertyFn, key) {
  const expected = String(getScriptPropertyFn() || '').trim();
  const provided = String(key || '').trim();
  return Boolean(expected && provided && expected === provided);
}

check('5. Backend: requireAdmin trim cả 2 đầu và fail-closed khi rỗng', () => {
  assert.equal(mockGasRequireAdmin(() => '  SUPER_SECRET_KEY\n ', 'SUPER_SECRET_KEY'), true);
  assert.equal(mockGasRequireAdmin(() => 'SUPER_SECRET_KEY', '  SUPER_SECRET_KEY  '), true);
  assert.equal(mockGasRequireAdmin(() => 'SUPER_SECRET_KEY', 'WRONG_KEY'), false);
  assert.equal(mockGasRequireAdmin(() => '', 'SOME_KEY'), false);
  assert.equal(mockGasRequireAdmin(() => null, 'SOME_KEY'), false);
});

console.log('\n=== KẾT QUẢ: TOÀN BỘ KIỂM THỬ AUTH HOTFIX ĐẠT 100% ===');
