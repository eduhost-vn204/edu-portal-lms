/* ═══════════════════════════════════════════════════════════════════════
   UNIT & STATIC TEST SUITE: VLXT WRONG QUESTION BANK & PROFILE STATS
   ═══════════════════════════════════════════════════════════════════════ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();

function createMockLocalStorage() {
  const store = new Map();
  return {
    getItem(k) { return store.has(k) ? store.get(k) : null; },
    setItem(k, v) { store.set(String(k), String(v)); },
    removeItem(k) { store.delete(String(k)); },
    clear() { store.clear(); },
    key(i) { return Array.from(store.keys())[i] ?? null; },
    get length() { return store.size; }
  };
}

// Inject mock localStorage and disable cloud sync BEFORE loading wrong-bank.js
globalThis.localStorage = createMockLocalStorage();
globalThis.__VLXT_DISABLE_CLOUD_SYNC__ = true;

const VlxtWrongBank = require(path.join(ROOT, 'wrong-bank.js'));

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log('✓ ' + name);
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('GATE 1 & 3: WRONG QUESTION BANK UNIT & STATIC VERIFICATION');
console.log('═══════════════════════════════════════════════════════════════');

test('1. Account key normalization & guest fallback', () => {
  assert.equal(VlxtWrongBank.normalizeAccountKey('0912 345 678'), '0912345678');
  assert.equal(VlxtWrongBank.normalizeAccountKey('HocSinh.A@Gmail.com'), 'hocsinh_a@gmail_com');
  assert.equal(VlxtWrongBank.normalizeAccountKey('FREE'), 'guest');
  assert.equal(VlxtWrongBank.normalizeAccountKey('HS-THITHU-123'), 'guest');
  assert.equal(VlxtWrongBank.normalizeAccountKey(''), 'guest');
});

test('2. Chapter auto-detection across C1..C4 from code, subTopic, and stem', () => {
  assert.equal(VlxtWrongBank.detectChapter({ chapterCode: 'C1' }).code, 'C1');
  assert.equal(VlxtWrongBank.detectChapter({ subTopic: 'CD07 – Quá trình đẳng nhiệt & Định luật Boyle' }).code, 'C2');
  assert.equal(VlxtWrongBank.detectChapter({ subTopic: 'DS-C3.2 – Thanh dẫn chuyển động' }).code, 'C3');
  assert.equal(VlxtWrongBank.detectChapter({ question: 'Đồng vị phóng xạ Iodine-131 có chu kì bán rã 8 ngày' }).code, 'C4');
  assert.equal(VlxtWrongBank.detectChapter({ question: 'Nhiệt dung riêng của nước là 4200 J/kg.K' }).code, 'C1');
});

test('3. Strict per-account isolation (Account A vs Account B vs Email)', () => {
  localStorage.clear();
  const q1 = {
    id: 'VLXT-ST220-C2-CD07-LT02',
    type: 'mc',
    chapterCode: 'C2',
    question: 'Trong thí nghiệm Boyle, dịch chuyển pit-tông từ từ để làm gì?',
    options: ['Khối lượng không đổi', 'Nhiệt độ không đổi', 'Thể tích không đổi', 'Áp suất không đổi'],
    answer: 1,
    correctLetter: 'B',
    explain: 'Đẳng nhiệt nên nhiệt độ không đổi.',
    modelId: 'MH-TN220-C2-30'
  };
  const q2 = {
    id: 'VLXT-DS-VD28-013',
    type: 'tf',
    chapterCode: 'C1',
    question: 'Khảo sát bảng nhiệt độ băng phiến <div class="vlxt-model-slot" data-model-id="MH-STAGING-C1-13"></div>',
    options: ['Ý a', 'Ý b', 'Ý c', 'Ý d'],
    answer: 'SĐSS',
    boolAnswers: [false, true, false, false],
    explain: 'Nhiệt độ nóng chảy là 80°C.'
  };

  VlxtWrongBank.recordWrong(q1, { accountKey: '0911111111', userAnswer: 'A', source: 'dgnl', sourceLabel: 'Đề 01' });
  VlxtWrongBank.recordWrong(q2, { accountKey: '0988888888', userAnswer: [true, true, false, false], source: 'thithu', sourceLabel: 'Thi thử Đề 02' });

  const listA = VlxtWrongBank.getAll('0911111111');
  const listB = VlxtWrongBank.getAll('0988888888');
  const listEmail = VlxtWrongBank.getAll('student@gmail.com');

  assert.equal(listA.length, 1);
  assert.equal(listA[0].qId, 'VLXT-ST220-C2-CD07-LT02');
  assert.equal(listA[0].lastUserAnswer, 'A');
  assert.equal(listA[0].correctAnswer, 'B');

  assert.equal(listB.length, 1);
  assert.equal(listB[0].qId, 'VLXT-DS-VD28-013');
  assert.equal(listB[0].modelId, 'MH-STAGING-C1-13'); // auto-extracted from slot!
  assert.equal(listB[0].type, 'tf');

  assert.equal(listEmail.length, 0);
});

test('4. Guest-to-account migration transfers items and clears guest bucket', () => {
  localStorage.clear();
  const qGuest = {
    id: 'VLXT-TLN-2026-05',
    type: 'short',
    chapterCode: 'C3',
    question: 'Cường độ dòng điện trong thanh kim loại là bao nhiêu mA?',
    answer: '2,67',
    explain: 'I = e/R = 2,67 mA'
  };
  VlxtWrongBank.recordWrong(qGuest, { accountKey: 'guest', userAnswer: '5,0', source: 'dgnl', sourceLabel: 'Đề 01' });
  assert.equal(VlxtWrongBank.getAll('guest').length, 1);

  const moved = VlxtWrongBank.migrateGuestToAccount('0912345678');
  assert.equal(moved, 1);
  assert.equal(VlxtWrongBank.getAll('guest').length, 0);
  assert.equal(VlxtWrongBank.getAll('0912345678').length, 1);
  assert.equal(VlxtWrongBank.getAll('0999999999').length, 0);
});

test('5. Repeated mistakes increment wrongCount & auto-mastery on retry/subsequent right answer', () => {
  localStorage.clear();
  const qShort = {
    id: 'VLXT-TLN-2026-05',
    type: 'short',
    chapterCode: 'C3',
    question: 'Cường độ dòng điện cảm ứng bằng bao nhiêu mA?',
    answer: '2,67'
  };
  const acc = '0912345678';
  VlxtWrongBank.recordWrong(qShort, { accountKey: acc, userAnswer: '1,2', source: 'dgnl', sourceLabel: 'Đề 01' });
  VlxtWrongBank.recordWrong(qShort, { accountKey: acc, userAnswer: '3,4', source: 'baihoc', sourceLabel: 'B25' });

  let stats = VlxtWrongBank.getStats(acc);
  assert.equal(stats.total, 1);
  assert.equal(stats.needReview, 1);
  assert.equal(stats.repeated, 1);
  assert.equal(VlxtWrongBank.getAll(acc)[0].wrongCount, 2);

  // Retry wrong again -> wrongCount becomes 3
  const rBad = VlxtWrongBank.recordRetryResult('VLXT-TLN-2026-05', '9.9', acc);
  assert.equal(rBad.ok, false);
  assert.equal(rBad.item.wrongCount, 3);
  assert.equal(rBad.item.status, 'need_review');

  // Retry right using dot instead of comma ("2.67" === "2,67") -> mastered!
  const rOk = VlxtWrongBank.recordRetryResult('VLXT-TLN-2026-05', '2.67', acc);
  assert.equal(rOk.ok, true);
  assert.equal(rOk.item.status, 'mastered');
  assert.equal(rOk.item.retryCorrectCount, 1);

  stats = VlxtWrongBank.getStats(acc);
  assert.equal(stats.needReview, 0);
  assert.equal(stats.mastered, 1);
  assert.equal(stats.masteryPct, 100);

  // Batch grading: answering a never-wrong question right does NOT add it;
  // missing previously mastered question reopens it as need_review
  const neverWrong = { id: 'VLXT-NEVER-WRONG-01', type: 'mc', question: 'Câu đúng sẵn', options: ['A','B','C','D'], answer: 0 };
  const batchRes = VlxtWrongBank.recordBatch([
    { question: neverWrong, isCorrect: true, userAnswer: 'A', source: 'dgnl' },
    { question: qShort, isCorrect: false, userAnswer: '0', source: 'dgnl' }
  ], { accountKey: acc });

  assert.equal(batchRes.recordedWrong, 1);
  assert.equal(VlxtWrongBank.getAll(acc).length, 1);
  assert.equal(VlxtWrongBank.getItem('VLXT-TLN-2026-05', acc).status, 'need_review');
  assert.equal(VlxtWrongBank.getItem('VLXT-TLN-2026-05', acc).wrongCount, 4);
});

test('6. Cloud store merge keeps max wrongCount and latest status cleanly', () => {
  const localMap = {
    'Q1': { key: 'Q1', question: 'Câu 1', wrongCount: 2, status: 'need_review', updatedAt: 1000, firstWrongAt: 500, lastWrongAt: 1000, explain: '' },
    'Q2': { key: 'Q2', question: 'Câu 2', wrongCount: 1, status: 'need_review', updatedAt: 1500, firstWrongAt: 1500, lastWrongAt: 1500, explain: 'Giải 2' }
  };
  const remoteMap = {
    'Q1': { key: 'Q1', question: 'Câu 1', wrongCount: 1, status: 'mastered', updatedAt: 2000, firstWrongAt: 600, lastWrongAt: 800, explain: 'Lời giải chi tiết' },
    'Q3': { key: 'Q3', question: 'Câu 3', wrongCount: 3, status: 'need_review', updatedAt: 1800, firstWrongAt: 700, lastWrongAt: 1800, explain: 'Giải 3' }
  };
  const merged = VlxtWrongBank.mergeStores(localMap, remoteMap);
  assert.equal(Object.keys(merged).length, 3);
  assert.equal(merged.Q1.status, 'mastered');
  assert.equal(merged.Q1.wrongCount, 2);
  assert.equal(merged.Q1.explain, 'Lời giải chi tiết');
  assert.equal(merged.Q1.firstWrongAt, 500);
});

test('7. Static syntax check of inline <script> blocks & </html> closing tag', () => {
  const htmlFiles = ['hoso.html', 'danh-gia-nang-luc.html', 'baihoc.html', 'thithu.html'];
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    assert.match(content.trimEnd(), /<\/html>\s*$/i, `${file} must end cleanly with </html>`);
    assert.ok(content.includes('wrong-bank.js'), `${file} must load wrong-bank.js`);
    const scripts = [...content.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
    assert.ok(scripts.length > 0, `${file} should have inline scripts`);
    scripts.forEach((m, idx) => {
      try {
        new vm.Script(m[1], { filename: `${file}#script${idx + 1}` });
      } catch (err) {
        assert.fail(`Syntax error in ${file} inline script #${idx + 1}: ${err.message}`);
      }
    });
  }
});

test('8. Zero AI Glow check on wrong-bank-ui.js', () => {
  const uiCode = fs.readFileSync(path.join(ROOT, 'wrong-bank-ui.js'), 'utf8');
  assert.equal(/text-shadow\s*:\s*0\s+0/i.test(uiCode), false, 'No text-shadow AI glow');
  assert.equal(/drop-shadow\(\s*0\s+0/i.test(uiCode), false, 'No drop-shadow AI glow');
  assert.equal(/box-shadow\s*:\s*0\s+0\s+\d+px/i.test(uiCode), false, 'No neon box-shadow AI glow');
});

console.log('═══════════════════════════════════════════════════════════════');
console.log(`ALL ${passed} WRONG-BANK UNIT & STATIC TESTS PASSED (100%)!`);
console.log('═══════════════════════════════════════════════════════════════');
