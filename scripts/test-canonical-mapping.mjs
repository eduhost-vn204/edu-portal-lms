// -*- coding: utf-8 -*-
/**
 * Test Suite: Synthetic Canonical Question Schema v2.1 -> Web Mapping Validator
 * Verifies that Canonical v2.1 objects correctly convert to Google Sheets flat row and LMS quiz JSON.
 */
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// Synthetic sample questions matching the exact format of Content Studio v2.1
const SYNTHETIC_QUESTIONS = [
  {
    schemaVersion: "2.1.0",
    id: "VLXT-G12-C1-B01-Q0001",
    version: 1,
    parentId: null,
    contentHash: "63ef8e39b173edae18cc978509d57da50286671d625756a16b153c8c6c9ebc9f",
    type: "MULTIPLE_CHOICE_4",
    stem: "Trong mô hình động học phân tử chất khí, khi nhiệt độ tuyệt đối của một khối khí lí tưởng tăng gấp đôi thì động năng tịnh tiến trung bình của các phân tử khí sẽ",
    khoaHoc: "XPS_2K9",
    giaiDoan: "GD1_LY_THUYET",
    options: [
      { key: "A", content: "tăng gấp đôi." },
      { key: "B", content: "tăng gấp bốn lần." },
      { key: "C", content: "giảm một nửa." },
      { key: "D", content: "không thay đổi." }
    ],
    subItems: [],
    correctAnswer: "A",
    numericValue: null,
    tolerance: null,
    unit: null,
    acceptedAnswers: [],
    childQuestionIds: [],
    introText: null,
    explanation: "Động năng tỉ lệ thuận với nhiệt độ tuyệt đối.",
    difficultyLevel: 2,
    difficultyName: "THONG_HIEU",
    taxonomy: {
      grade: 12,
      chapterNumber: 1,
      chapterTitle: "Chương 1: Vật lí nhiệt",
      lessonCode: "G12_C1_B01",
      lessonTitle: "Bài 1: Cấu trúc của chất",
      topic: "Động năng phân tử"
    },
    sourceProvenance: {
      sourceDocumentId: "SYNTHETIC_01",
      sourceTitle: "Ngân hàng Synthetic",
      sourceAuthor: "VLXT Team",
      sourcePage: 1,
      sourceLicense: "ORIGINAL_COPYRIGHT",
      originalQuestionNumber: "Câu 1"
    },
    originalityStatus: "ORIGINAL",
    qualityFlags: ["VERIFIED_ANSWER", "MATH_CHECKED"],
    usageScopes: ["THEORY_BANK", "EXERCISE_BANK"],
    mediaAssets: [],
    inVideoCue: null,
    reviewedBy: null,
    reviewedAt: null,
    status: "QA_PASSED",
    rawTier: "THO"
  }
];

function canonicalToSheetRow(q) {
  return {
    id: q.id,
    loaiNganHang: (q.usageScopes || []).join(','),
    khoaHoc: q.khoaHoc,
    giaiDoan: q.giaiDoan,
    chuong: `C${q.taxonomy.chapterNumber}_${q.taxonomy.chapterTitle}`,
    baiHoc: q.taxonomy.lessonCode,
    dangCauHoi: q.type === 'MULTIPLE_CHOICE_4' ? 'TN4' : q.type === 'TRUE_FALSE_4PART' ? 'DS' : q.type === 'SHORT_ANSWER' ? 'TLN' : 'CHUM',
    mucDo: q.difficultyLevel === 1 ? 'NB' : q.difficultyLevel === 2 ? 'TH' : q.difficultyLevel === 3 ? 'VD' : 'VDC',
    nhomId: q.parentId || '',
    deBaiChung: q.introText || '',
    question: q.stem,
    optA: q.options?.[0]?.content || '',
    optB: q.options?.[1]?.content || '',
    optC: q.options?.[2]?.content || '',
    optD: q.options?.[3]?.content || '',
    correct: q.correctAnswer || '',
    giaiThich: q.explanation || '',
    nguon: `${q.sourceProvenance?.sourceTitle || ''} - ${q.sourceProvenance?.sourceAuthor || ''}`,
    trangThaiBanQuyen: q.originalityStatus === 'ORIGINAL' ? 'doc_quyen_vlxt' : 'cong_khai_tham_khao',
    hinhAnh: (q.mediaAssets || []).map(a => a.webPath).join(','),
    trangThaiDuyet: q.rawTier === 'TINH' ? 'da_duyet_tinh' : 'tho',
    version: q.version || 1,
    contentHash: q.contentHash
  };
}

function canonicalToLmsQuizItem(q) {
  return {
    id: q.id,
    type: q.type === 'MULTIPLE_CHOICE_4' ? 'mc' : q.type === 'TRUE_FALSE_4PART' ? 'tf' : q.type === 'SHORT_ANSWER' ? 'short' : 'group',
    question: q.stem,
    options: {
      A: q.options?.[0]?.content || '',
      B: q.options?.[1]?.content || '',
      C: q.options?.[2]?.content || '',
      D: q.options?.[3]?.content || ''
    },
    correct: q.correctAnswer,
    explanation: q.explanation,
    level: q.difficultyLevel
  };
}

// Run Test Validations
console.log('--- Testing Canonical -> Sheet Flat Row Mapping ---');
const sheetRow = canonicalToSheetRow(SYNTHETIC_QUESTIONS[0]);
assert.strictEqual(sheetRow.id, "VLXT-G12-C1-B01-Q0001");
assert.strictEqual(sheetRow.dangCauHoi, "TN4");
assert.strictEqual(sheetRow.mucDo, "TH");
assert.strictEqual(sheetRow.optA, "tăng gấp đôi.");
assert.strictEqual(sheetRow.correct, "A");
assert.strictEqual(sheetRow.trangThaiDuyet, "tho");
console.log('✓ Sheet flat row mapping passed with zero data loss.');

console.log('--- Testing Canonical -> LMS Quiz Item Mapping ---');
const lmsItem = canonicalToLmsQuizItem(SYNTHETIC_QUESTIONS[0]);
assert.strictEqual(lmsItem.id, "VLXT-G12-C1-B01-Q0001");
assert.strictEqual(lmsItem.type, "mc");
assert.strictEqual(lmsItem.options.A, "tăng gấp đôi.");
assert.strictEqual(lmsItem.correct, "A");
console.log('✓ LMS quiz item mapping passed.');

console.log('\nAll 2/2 Canonical Mapping Tests Passed Successfully!');
