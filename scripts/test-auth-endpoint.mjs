import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../login.html', import.meta.url), 'utf8');
const endpointMatch = html.match(/const\s+GAS\s*=\s*['"](https:\/\/script\.google\.com\/macros\/s\/[^'"]+\/exec)['"]/);
assert.ok(endpointMatch, 'Không tìm thấy endpoint GAS trong login.html');

const endpoint = endpointMatch[1];

async function post(payload) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    assert.equal(response.status, 200, `GAS trả HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

// Cả hai request đều dừng trước thao tác ghi dữ liệu thật.
const unknown = await post({ action: 'non_existent_auth_smoke_test' });
assert.deepEqual(unknown, { ok: false, msg: 'Unknown action' });

const invalidRegistration = await post({ action: 'register', sdt: '' });
assert.equal(invalidRegistration.ok, false);
assert.equal(invalidRegistration.msg, 'Số điện thoại không hợp lệ!');

console.log('PASS: endpoint đăng ký online, đúng router và trả JSON hợp lệ');
