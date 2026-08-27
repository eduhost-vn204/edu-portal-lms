// -*- coding: utf-8 -*-
/**
 * Test: Canonical Hash Verifier Harness
 * Validates the JavaScript verification engine using synthetic test vectors.
 */
import assert from 'node:assert';
import { CanonicalHashVerifier } from '../src/modules/canonical-hash-verifier.mjs';

console.log('--- Testing CanonicalHashVerifier Harness ---');

const verifier = new CanonicalHashVerifier();

// 1. Kiểm tra trạng thái khi chưa có file golden vectors từ Machine-2
const pendingRes = verifier.verifyGoldenVectors([]);
assert.strictEqual(pendingRes.status, 'PENDING_GOLDEN_VECTORS');
console.log('✓ 1. Xử lý chính xác trạng thái PENDING_GOLDEN_VECTORS khi chờ Machine-2.');

// 2. Kiểm tra khả năng đối soát chính xác với synthetic golden vector
const sampleQuestion = {
  type: 'MULTIPLE_CHOICE_4',
  stem: 'Trong mô hình động học phân tử chất khí...',
  options: [{ key: 'A', content: 'Tăng gấp đôi.' }],
  correctAnswer: 'A'
};

const computedHash = verifier.defaultCompositeHasher(sampleQuestion);

const mockGoldenVectors = [
  {
    description: 'Synthetic Vector 01',
    payload: sampleQuestion,
    expectedHash: computedHash
  }
];

const passRes = verifier.verifyGoldenVectors(mockGoldenVectors);
assert.strictEqual(passRes.status, 'ALL_PASSED');
assert.strictEqual(passRes.passCount, 1);
console.log('✓ 2. Đối soát thành công với Synthetic Golden Vector.');

console.log('CanonicalHashVerifier Test Passed Successfully!\n');
