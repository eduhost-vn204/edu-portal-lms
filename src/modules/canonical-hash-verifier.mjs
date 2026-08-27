// -*- coding: utf-8 -*-
/**
 * Module: Canonical Hash Verifier Harness (JavaScript Implementation)
 * Prepared to ingest CANONICAL_HASH_SPEC_V1.md and hash-golden-vectors.json from Machine-2.
 * Validates that JavaScript hash generation matches Python output byte-for-byte.
 */
import crypto from 'node:crypto';

export class CanonicalHashVerifier {
  constructor(customHasher = null) {
    this.hasher = customHasher || this.defaultCompositeHasher;
  }

  setHasher(customHasher) {
    if (typeof customHasher !== 'function') throw new Error('Hasher must be a function');
    this.hasher = customHasher;
  }

  // Placeholder composite normalizer (matches SDR-v2.1 specification)
  defaultCompositeHasher(question) {
    const norm = (str) => String(str || '').trim().toLowerCase().replace(/\s+/g, ' ');

    const payload = [
      question.type || '',
      norm(question.stem),
      question.parentId ? norm(question.introText || '') : '',
      Array.isArray(question.options) ? question.options.map(o => `${o.key}:${norm(o.content)}`).join('|') : '',
      Array.isArray(question.subItems) ? question.subItems.map(s => `${s.key}:${norm(s.statement)}:${s.isCorrect}`).join('|') : '',
      norm(question.correctAnswer),
      question.numericValue !== null && question.numericValue !== undefined ? String(question.numericValue) : '',
      question.tolerance !== null && question.tolerance !== undefined ? String(question.tolerance) : '',
      norm(question.unit),
      Array.isArray(question.mediaAssets) ? question.mediaAssets.map(m => m.sha256).sort().join(',') : ''
    ].join('::');

    return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
  }

  /**
   * Chạy kiểm thử đối soát với bộ Golden Vectors từ Machine-2
   * @param {Array} goldenVectors Danh sách các test cases [{ payload, expectedHash, description }]
   */
  verifyGoldenVectors(goldenVectors = []) {
    if (!Array.isArray(goldenVectors) || goldenVectors.length === 0) {
      return {
        status: 'PENDING_GOLDEN_VECTORS',
        message: 'Đang chờ MACHINE-2 cung cấp file hash-golden-vectors.json chính thức.',
        passCount: 0,
        totalCount: 0,
        failures: []
      };
    }

    let passCount = 0;
    const failures = [];

    for (let i = 0; i < goldenVectors.length; i++) {
      const vector = goldenVectors[i];
      const actualHash = this.hasher(vector.payload);

      if (actualHash === vector.expectedHash) {
        passCount++;
      } else {
        failures.push({
          index: i,
          description: vector.description || `Vector #${i + 1}`,
          expected: vector.expectedHash,
          actual: actualHash,
          payload: vector.payload
        });
      }
    }

    return {
      status: failures.length === 0 ? 'ALL_PASSED' : 'HAS_DISCREPANCIES',
      totalCount: goldenVectors.length,
      passCount,
      failures
    };
  }
}
