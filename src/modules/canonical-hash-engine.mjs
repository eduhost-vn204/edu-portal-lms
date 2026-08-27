// -*- coding: utf-8 -*-
/**
 * Module: Canonical Hash Engine (JavaScript / Apps Script Implementation)
 * Implements 100% byte-for-byte cross-platform canonical hashing matching Python generators/normalizer.py.
 * Conforms to CANONICAL_HASH_SPEC_V1.md.
 */
import crypto from 'node:crypto';

/**
 * Standardizes physics units, exponents, and LaTeX notation in JavaScript.
 */
export function normalizePhysicsLatex(text) {
  if (!text) return '';
  let res = String(text).trim();

  // Normalize degrees Celsius
  res = res.replace(/(\d+)\s*0C\b/g, '$1^{\\circ}\\text{C}');
  res = res.replace(/(\d+)\s*°C\b/g, '$1^{\\circ}\\text{C}');
  res = res.replace(/(\d+)\s*oC\b/g, '$1^{\\circ}\\text{C}');

  // Common physics scientific notations
  res = res.replace(/1023\s*hạt/g, '10^{23}\\text{ hạt}');
  res = res.replace(/105\s*Pa/g, '10^5\\text{ Pa}');
  res = res.replace(/105\s*N\/m2/g, '10^5\\text{ N/m}^2');

  // Constants & variables
  res = res.replace(/\bNA\b/g, 'N_A');
  res = res.replace(/\bpo\b/g, 'p_0');
  res = res.replace(/\bTo\b/g, 'T_0');
  res = res.replace(/\bVo\b/g, 'V_0');
  res = res.replace(/\bDelta\s*t\b/g, '\\Delta t');
  res = res.replace(/\bDelta\s*U\b/g, '\\Delta U');
  res = res.replace(/\bpi\b/g, '\\pi');
  res = res.replace(/\bvecto\s+([A-Z])\b/g, '\\vec{$1}');

  // Collapse multiple whitespaces
  res = res.replace(/\s+/g, ' ');
  return res.trim();
}

/**
 * Normalizes text for identity comparison: applies LaTeX normalization, NFC, lowercase, and whitespace collapse.
 */
export function normalizeTextForIdentity(text) {
  if (!text) return '';
  const latexNorm = normalizePhysicsLatex(text);
  // NFC form, lowercase, whitespace collapse
  return latexNorm.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

/**
 * Builds canonical identity payload for a question matching Python build_content_identity_payload.
 */
export function buildContentIdentityPayload(question, parent = null) {
  const qType = question.type || '';
  const stemNorm = normalizeTextForIdentity(question.stem || '');

  let parentIntro = '';
  if (typeof parent === 'string') {
    parentIntro = normalizeTextForIdentity(parent);
  } else if (parent && parent.introText) {
    parentIntro = normalizeTextForIdentity(parent.introText);
  } else if (question.introText) {
    parentIntro = normalizeTextForIdentity(question.introText);
  }

  const payload = {
    type: qType,
    stem: stemNorm,
    parentContext: parentIntro
  };

  // 1. Options (MULTIPLE_CHOICE_4)
  if (qType === 'MULTIPLE_CHOICE_4') {
    const rawOpts = question.options || [];
    const sortedOpts = [...rawOpts]
      .sort((a, b) => String(a.key || '').toUpperCase().localeCompare(String(b.key || '').toUpperCase()))
      .map(opt => ({
        key: String(opt.key || '').trim().toUpperCase(),
        content: normalizeTextForIdentity(opt.content || '')
      }));
    payload.options = sortedOpts;
    payload.correctAnswer = String(question.correctAnswer || '').trim().toUpperCase();
  }

  // 2. SubItems (TRUE_FALSE_4PART)
  else if (qType === 'TRUE_FALSE_4PART') {
    const rawSubs = question.subItems || [];
    const sortedSubs = [...rawSubs]
      .sort((a, b) => String(a.key || '').toLowerCase().localeCompare(String(b.key || '').toLowerCase()))
      .map(sub => ({
        key: String(sub.key || '').trim().toLowerCase(),
        statement: normalizeTextForIdentity(sub.statement || ''),
        isCorrect: Boolean(sub.isCorrect)
      }));
    payload.subItems = sortedSubs;
  }

  // 3. Short Answer
  else if (qType === 'SHORT_ANSWER') {
    const numVal = question.numericValue;
    const tol = question.tolerance;
    const unit = normalizeTextForIdentity(question.unit || '');
    const rawAccepted = (question.acceptedAnswers || []).map(a => normalizeTextForIdentity(String(a)));
    const uniqueAccepted = Array.from(new Set(rawAccepted)).sort();

    payload.shortAnswer = {
      numericValue: numVal !== null && numVal !== undefined ? Number(numVal) : null,
      tolerance: tol !== null && tol !== undefined ? Number(tol) : null,
      unit: unit,
      acceptedAnswers: uniqueAccepted
    };
  }

  // 4. Question Group
  else if (qType === 'QUESTION_GROUP') {
    const rawChildren = question.childQuestionIds || [];
    payload.childQuestionIds = rawChildren.map(cid => String(cid).trim()).sort();
  }

  // 5. Essential Media Hashes
  const mediaHashes = [];
  for (const asset of (question.mediaAssets || [])) {
    const binding = asset.questionBinding || 'UNBOUND';
    const sha = asset.sha256;
    if (binding !== 'UNBOUND' && sha) {
      mediaHashes.push(`${binding}:${String(sha).toLowerCase()}`);
    }
  }
  payload.essentialMediaHashes = mediaHashes.sort();

  return payload;
}

/**
 * Builds canonical revision payload matching Python build_revision_payload.
 */
export function buildRevisionPayload(question, parent = null) {
  const identityPayload = buildContentIdentityPayload(question, parent);

  const rawTax = question.taxonomy || {};
  const taxPayload = {
    grade: rawTax.grade !== undefined ? rawTax.grade : null,
    chapterNumber: rawTax.chapterNumber !== undefined ? rawTax.chapterNumber : null,
    chapterTitle: normalizeTextForIdentity(rawTax.chapterTitle || ''),
    lessonCode: rawTax.lessonCode || '',
    lessonTitle: normalizeTextForIdentity(rawTax.lessonTitle || ''),
    topic: normalizeTextForIdentity(rawTax.topic || '')
  };

  const rawSrc = question.sourceProvenance || {};
  const srcPayload = {
    sourceDocumentId: rawSrc.sourceDocumentId || '',
    sourceTitle: normalizeTextForIdentity(rawSrc.sourceTitle || ''),
    sourceAuthor: normalizeTextForIdentity(rawSrc.sourceAuthor || ''),
    sourceLicense: rawSrc.sourceLicense || '',
    originalQuestionNumber: rawSrc.originalQuestionNumber !== undefined && rawSrc.originalQuestionNumber !== null ? String(rawSrc.originalQuestionNumber) : ''
  };

  const rawFlags = question.qualityFlags || [];

  return {
    identity: identityPayload,
    explanation: normalizeTextForIdentity(question.explanation || ''),
    difficultyLevel: question.difficultyLevel !== undefined ? question.difficultyLevel : null,
    difficultyName: question.difficultyName || '',
    taxonomy: taxPayload,
    sourceProvenance: srcPayload,
    qualityFlags: [...rawFlags].sort()
  };
}

/**
 * Canonical JSON serialization: recursively sorts all object keys, compact representation, UTF-8 preserved.
 * Formats float numbers in shortAnswer (numericValue, tolerance) to match Python float serialization.
 */
export function canonicalJsonStringify(obj, parentKey = '') {
  if (obj === null) return 'null';
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'string') return JSON.stringify(obj);

  if (typeof obj === 'number') {
    // Nếu là numericValue hoặc tolerance trong shortAnswer, serialize dạng float (.0 nếu nguyên)
    if (parentKey === 'numericValue' || parentKey === 'tolerance') {
      return Number.isInteger(obj) ? obj.toFixed(1) : String(obj);
    }
    return String(obj);
  }

  if (Array.isArray(obj)) {
    return '[' + obj.map(item => canonicalJsonStringify(item, parentKey)).join(',') + ']';
  }

  if (typeof obj === 'object') {
    const sortedKeys = Object.keys(obj).sort();
    const entries = sortedKeys.map(key => {
      return JSON.stringify(key) + ':' + canonicalJsonStringify(obj[key], key);
    });
    return '{' + entries.join(',') + '}';
  }

  return JSON.stringify(obj);
}

/**
 * Computes deterministic SHA-256 contentIdentityHash from canonical identity payload.
 */
export function computeContentIdentityHash(question, parent = null) {
  const payload = buildContentIdentityPayload(question, parent);
  const serialized = canonicalJsonStringify(payload);
  return crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
}

/**
 * Computes deterministic SHA-256 revisionHash from full revision payload.
 */
export function computeRevisionHash(question, parent = null) {
  const payload = buildRevisionPayload(question, parent);
  const serialized = canonicalJsonStringify(payload);
  return crypto.createHash('sha256').update(serialized, 'utf8').digest('hex');
}
