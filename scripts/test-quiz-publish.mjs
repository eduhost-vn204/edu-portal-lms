// Test dùng thư mục tạm thật trên đĩa (không gọi mạng) - xác nhận rằng khi
// buildQuizGrouping phát hiện lỗi (migration-in-progress/alias-collision/
// duplicate-id), applyQuizPublishPlan() TUYỆT ĐỐI không đụng vào snapshot cũ:
// không ghi đè quiz-index.json, không ghi đè/xoá bất kỳ file quiz-*.json nào.
// Chạy: node scripts/test-quiz-publish.mjs
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { planQuizPublish, applyQuizPublishPlan, fileNameForKey } from './quiz-publish.mjs';

const lesson = (mabai, khoa, chuong, ten) => ({ MaBai: mabai, KhoaHoc: khoa, Chuong: chuong, TenBai: ten });
const stableRow = (mabai, id) => ({ baiKey: mabai, id, question: 'q' + id });
const legacyRow = (khoa, chuong, ten, id) => ({ baiKey: `${khoa}|||${chuong}|||${ten}`, id, question: 'q' + id });

let passed = 0;
async function check(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`OK   - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error('     ', e.message);
    process.exitCode = 1;
  }
}

async function makeTempQuizDir() {
  const root = await mkdtemp(path.join(tmpdir(), 'vlxt-quiz-'));
  const quizDir = path.join(root, 'quizzes');
  await mkdir(quizDir, { recursive: true });
  return {
    root,
    quizDir,
    quizIndexFile: path.join(root, 'quiz-index.json'),
    quizWarningsFile: path.join(root, 'quiz-warnings.json')
  };
}

// Gieo sẵn 1 snapshot "tốt" (cũ) trong thư mục tạm để kiểm tra không bị đụng tới.
async function seedGoodSnapshot(paths) {
  const oldFile = fileNameForKey('OLD_LESSON_KEY');
  const oldIndex = { lessons: { OLD_LESSON_KEY: { file: `data/quizzes/${oldFile}`, count: 2 } } };
  await writeFile(paths.quizIndexFile, `${JSON.stringify(oldIndex)}\n`, 'utf8');
  await writeFile(path.join(paths.quizDir, oldFile), `${JSON.stringify([{ id: 'keep1' }, { id: 'keep2' }])}\n`, 'utf8');
  return { oldIndex, oldFile };
}

for (const [label, warnLessons, warnRows] of [
  [
    'migration-in-progress',
    [lesson('MB02', 'K', 'C', 'B2')],
    [stableRow('MB02', 's0'), ...Array.from({ length: 20 }, (_, i) => legacyRow('K', 'C', 'B2', 'l' + i))]
  ],
  [
    'duplicate-id',
    [lesson('MB03', 'K', 'C', 'B3')],
    [stableRow('MB03', 'dup1'), stableRow('MB03', 'dup1')]
  ],
  [
    'alias-collision',
    [lesson('MB04A', 'K', 'Chương 1', 'Bài Một'), lesson('MB04B', 'K', 'chương 1', 'bài một')],
    [legacyRow('K', 'Chương 1', 'Bài Một', 'x1')]
  ]
]) {
  await check(`${label} -> applyQuizPublishPlan KHÔNG đụng snapshot cũ`, async () => {
    const paths = await makeTempQuizDir();
    const { oldIndex, oldFile } = await seedGoodSnapshot(paths);

    const plan = planQuizPublish(warnLessons, warnRows);
    assert.equal(plan.action, 'blocked', 'phải bị chặn xuất bản khi có cảnh báo');
    assert.ok(plan.warnings.length >= 1);

    await applyQuizPublishPlan(plan, paths);

    const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
    assert.deepEqual(indexAfter, oldIndex, 'quiz-index.json cũ phải giữ nguyên y hệt');

    const oldFileContentAfter = await readFile(path.join(paths.quizDir, oldFile), 'utf8');
    assert.ok(oldFileContentAfter.includes('keep1') && oldFileContentAfter.includes('keep2'), 'file quiz cũ phải còn nguyên nội dung');

    const filesInDir = await readdir(paths.quizDir);
    assert.deepEqual(filesInDir.sort(), [oldFile].sort(), 'không được tạo/xoá thêm file quiz-*.json nào khác trong lúc bị chặn');

    const warningsRaw = JSON.parse(await readFile(paths.quizWarningsFile, 'utf8'));
    assert.ok(Array.isArray(warningsRaw.warnings) && warningsRaw.warnings.length >= 1, 'phải ghi quiz-warnings.json để admin biết');
  });
}

await check('Gộp sạch (không cảnh báo) -> ghi file mới + index mới, rồi mới dọn file cũ không còn dùng', async () => {
  const paths = await makeTempQuizDir();
  // File cũ theo kiểu đặt tên SỐ THỨ TỰ cũ (quiz-0001.json) - mô phỏng dữ liệu
  // từ trước khi đổi sang đặt tên theo hash, phải được dọn vì không còn dùng.
  await writeFile(path.join(paths.quizDir, 'quiz-0001.json'), '[{"id":"stale"}]\n', 'utf8');
  await writeFile(paths.quizIndexFile, `${JSON.stringify({ lessons: { STALE: { file: 'data/quizzes/quiz-0001.json', count: 1 } } })}\n`, 'utf8');

  const lessons = [lesson('MB01', 'K', 'C', 'B1')];
  const quizRows = Array.from({ length: 5 }, (_, i) => stableRow('MB01', 's' + i));
  const plan = planQuizPublish(lessons, quizRows, { buildVersion: 'testv1' });
  assert.equal(plan.action, 'publish');
  assert.equal(plan.warnings.length, 0);
  assert.equal(plan.files.length, 1);

  const result = await applyQuizPublishPlan(plan, paths);
  assert.deepEqual(result.written, [plan.files[0].fileName]);
  assert.deepEqual(result.deleted, ['quiz-0001.json'], 'file cũ theo kiểu đặt tên cũ không còn dùng phải được dọn SAU khi index mới đã ghi xong');

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, plan.index);

  const newFileContent = JSON.parse(await readFile(path.join(paths.quizDir, plan.files[0].fileName), 'utf8'));
  assert.equal(newFileContent.length, 5);

  const filesInDir = await readdir(paths.quizDir);
  assert.deepEqual(filesInDir, [plan.files[0].fileName], 'file cũ (quiz-0001.json) phải đã bị xoá, chỉ còn file mới');
});

await check('fileNameForKey ổn định: cùng 1 khoá luôn ra cùng 1 tên file giữa các lần gọi', () => {
  assert.equal(fileNameForKey('MB01'), fileNameForKey('MB01'));
  assert.notEqual(fileNameForKey('MB01'), fileNameForKey('MB02'));
});

console.log(`\n${passed} test đã qua.`);
if (process.exitCode) {
  console.error('CÓ TEST THẤT BẠI.');
} else {
  console.log('TẤT CẢ TEST ĐÃ QUA.');
}
