// Test khong goi mang - kiem tra logic gop cau hoi (quiz-merge.mjs) dung yeu
// cau bat buoc. Chay: node scripts/test-quiz-merge.mjs
import assert from 'node:assert/strict';
import { buildQuizGrouping, normalizeLegacyKey } from './quiz-merge.mjs';

const lesson = (mabai, khoa, chuong, ten) => ({ MaBai: mabai, KhoaHoc: khoa, Chuong: chuong, TenBai: ten });
const stableRow = (mabai, id) => ({ baiKey: mabai, id, question: 'q' + id });
const legacyRow = (khoa, chuong, ten, id) => ({ baiKey: `${khoa}|||${chuong}|||${ten}`, id, question: 'q' + id });

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`OK   - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error('     ', e.message);
    process.exitCode = 1;
  }
}

// 1) stable=30, legacy=20 -> ket qua 30 (khong cong don, khong con legacy)
check('stable=30, legacy=20 -> 30 cau, khong cong don', () => {
  const lessons = [lesson('MB01', 'K', 'C', 'B1')];
  const quizRows = [
    ...Array.from({ length: 30 }, (_, i) => stableRow('MB01', 's' + i)),
    ...Array.from({ length: 20 }, (_, i) => legacyRow('K', 'C', 'B1', 'l' + i))
  ];
  const { grouped, warnings } = buildQuizGrouping(lessons, quizRows);
  assert.equal(grouped.get('MB01').length, 30);
  assert.equal(warnings.filter(w => w.type === 'migration-in-progress').length, 0);
});

// 2) stable=1, legacy=20 -> KHONG duoc am tham con 1 cau; phai canh bao va
//    fallback ve tap lon hon (legacy) de khong lam mat du lieu cho hoc sinh.
check('stable=1, legacy=20 -> canh bao migration dang do, khong con lai 1 cau', () => {
  const lessons = [lesson('MB02', 'K', 'C', 'B2')];
  const quizRows = [
    stableRow('MB02', 's0'),
    ...Array.from({ length: 20 }, (_, i) => legacyRow('K', 'C', 'B2', 'l' + i))
  ];
  const { grouped, warnings } = buildQuizGrouping(lessons, quizRows);
  assert.equal(grouped.get('MB02').length, 20, 'phai fallback ve 20 cau legacy, khong duoc con 1');
  const w = warnings.find(x => x.type === 'migration-in-progress' && x.key === 'MB02');
  assert.ok(w, 'phai co canh bao migration-in-progress');
  assert.equal(w.stableCount, 1);
  assert.equal(w.legacyCount, 20);
});

// 3) Trung ID trong cung 1 bai -> phat hien loi, khong am tham giu ca 2 dong
check('stable trung ID -> phat hien duplicate-id', () => {
  const lessons = [lesson('MB03', 'K', 'C', 'B3')];
  const quizRows = [
    stableRow('MB03', 'dup1'),
    stableRow('MB03', 'dup1'),
    stableRow('MB03', 'unique2')
  ];
  const { grouped, warnings } = buildQuizGrouping(lessons, quizRows);
  assert.equal(grouped.get('MB03').length, 2, 'phai loai bo dong trung, giu 2 cau duy nhat');
  const w = warnings.find(x => x.type === 'duplicate-id' && x.key === 'MB03');
  assert.ok(w, 'phai co canh bao duplicate-id');
  assert.equal(w.id, 'dup1');
});

// 4) Hai bai hoc khac nhau nhung chuoi ten chuan hoa trung nhau -> alias
//    collision, phai canh bao thay vi am tham ghi de anh xa.
check('alias collision giua 2 bai hoc trung ten chuan hoa -> phat hien loi', () => {
  const lessons = [
    lesson('MB04A', 'K', 'Chương 1', 'Bài Một'),
    lesson('MB04B', 'K', 'chương 1', 'bài một') // chuan hoa ra trung voi dong tren
  ];
  const quizRows = [legacyRow('K', 'Chương 1', 'Bài Một', 'x1')];
  const { warnings } = buildQuizGrouping(lessons, quizRows);
  const w = warnings.find(x => x.type === 'alias-collision');
  assert.ok(w, 'phai co canh bao alias-collision');
  assert.equal(w.keptStableKey, 'MB04A');
  assert.equal(w.ignoredStableKey, 'MB04B');
});

// 5) Khong co du lieu quiz nao (mo phong o sync-public-data.mjs, kiem tra rieng
//    o do) - o day chi kiem tra buildQuizGrouping voi mang rong khong crash va
//    tra ve rong, phan "giu file JSON cu neu API rong" nam o sync-public-data.mjs.
check('quizRows rong -> grouped rong, khong loi', () => {
  const lessons = [lesson('MB05', 'K', 'C', 'B5')];
  const { grouped, warnings } = buildQuizGrouping(lessons, []);
  assert.equal(grouped.size, 0);
  assert.equal(warnings.length, 0);
});

// 6) normalizeLegacyKey dung nhat quan cho dau/khoang trang/hoa-thuong
check('normalizeLegacyKey bo qua dau, hoa/thuong, khoang trang thua', () => {
  const a = normalizeLegacyKey('Vật Lý 12', 'Chương 1', 'Bài  Một');
  const b = normalizeLegacyKey('vat ly 12', 'chuong 1', 'bai mot');
  assert.equal(a, b);
});

console.log(`\n${passed} test da qua.`);
if (process.exitCode) {
  console.error('CO TEST THAT BAI.');
} else {
  console.log('TAT CA TEST DA QUA.');
}
