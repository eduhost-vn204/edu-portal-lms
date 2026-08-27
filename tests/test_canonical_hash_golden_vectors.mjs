// -*- coding: utf-8 -*-
/**
 * Master Verification Suite: Canonical Hash Golden Vectors (22 Test Vectors)
 * Validates that JavaScript canonical hashing matches Python outputs byte-for-byte.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildContentIdentityPayload,
  buildRevisionPayload,
  canonicalJsonStringify,
  computeContentIdentityHash,
  computeRevisionHash
} from '../src/modules/canonical-hash-engine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTORS_PATH = path.join(__dirname, '..', 'data', 'synthetic-fixtures', 'hash-golden-vectors.json');
const goldenVectors = JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf-8'));

console.log('======================================================================');
console.log(`   KIỂM ĐỊNH CANONICAL HASH GOLDEN VECTORS (${goldenVectors.length} VECTORS)          `);
console.log('======================================================================\n');

let passCount = 0;
let failCount = 0;
const failures = [];

for (let i = 0; i < goldenVectors.length; i++) {
  const v = goldenVectors[i];
  const q = v.inputQuestion;
  const parent = v.parentContext;

  try {
    // 1. Kiểm tra Identity Payload
    const actualIdentityPayload = buildContentIdentityPayload(q, parent);
    assert.deepStrictEqual(
      actualIdentityPayload,
      v.canonicalIdentityPayload,
      `[${v.vectorId}] Identity Payload sai lệch cấu trúc`
    );

    // 2. Kiểm tra Serialized Identity String
    const actualSerializedIdentity = canonicalJsonStringify(actualIdentityPayload);
    assert.strictEqual(
      actualSerializedIdentity,
      v.canonicalSerializedIdentityString,
      `[${v.vectorId}] Serialized Identity String sai lệch từng ký tự`
    );

    // 3. Kiểm tra Content Identity Hash (SHA-256)
    const actualIdentityHash = computeContentIdentityHash(q, parent);
    assert.strictEqual(
      actualIdentityHash,
      v.expectedContentIdentityHash,
      `[${v.vectorId}] contentIdentityHash sai lệch byte`
    );

    // 4. Kiểm tra Revision Payload
    const actualRevisionPayload = buildRevisionPayload(q, parent);
    assert.deepStrictEqual(
      actualRevisionPayload,
      v.canonicalRevisionPayload,
      `[${v.vectorId}] Revision Payload sai lệch cấu trúc`
    );

    // 5. Kiểm tra Serialized Revision String
    const actualSerializedRevision = canonicalJsonStringify(actualRevisionPayload);
    assert.strictEqual(
      actualSerializedRevision,
      v.canonicalSerializedRevisionString,
      `[${v.vectorId}] Serialized Revision String sai lệch từng ký tự`
    );

    // 6. Kiểm tra Revision Hash (SHA-256)
    const actualRevisionHash = computeRevisionHash(q, parent);
    assert.strictEqual(
      actualRevisionHash,
      v.expectedRevisionHash,
      `[${v.vectorId}] revisionHash sai lệch byte`
    );

    passCount++;
    console.log(`  ✓ PASS Vector #${i + 1} [${v.vectorId}]: ${v.description}`);
  } catch (err) {
    failCount++;
    failures.push({
      vectorId: v.vectorId,
      description: v.description,
      error: err.message
    });
    console.error(`  ❌ FAIL Vector #${i + 1} [${v.vectorId}]: ${err.message}`);
  }
}

console.log('\n======================================================================');
console.log(`  KẾT QUẢ ĐỐI SOÁT HASH ĐA NỀN TẢNG:`);
console.log(`  • Tổng số vector kiểm thử: ${goldenVectors.length}`);
console.log(`  • Số vector KHỚP 100% (JavaScript == Python): ${passCount} / ${goldenVectors.length}`);
console.log(`  • Số vector thất bại: ${failCount}`);
console.log('======================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 KẾT LUẬN: CROSS-PLATFORM HASH VERIFICATION: PASS (100% BYTE-FOR-BYTE MATCH)!');
}
