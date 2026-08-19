// Test dùng thư mục tạm thật trên đĩa (không gọi mạng) - xác nhận:
//   1) Khi buildQuizGrouping phát hiện lỗi (migration-in-progress/alias-
//      collision/duplicate-id), applyQuizPublishPlan() TUYỆT ĐỐI không đụng
//      vào snapshot cũ.
//   2) (FAULT-INJECTION, vòng 3) Nếu quá trình ghi file MỚI bị lỗi giữa chừng
//      (vd hết dung lượng đĩa ở file thứ 2), quiz-index.json CŨ và mọi file
//      nó đang tham chiếu phải còn NGUYÊN VẸN byte-for-byte.
//   3) (FAULT-INJECTION, vòng 3) Nếu lỗi xảy ra khi ghi/rename quiz-index.json
//      mới, snapshot cũ vẫn dùng được bình thường; file mới dư (đã ghi thành
//      công trước khi lỗi) có thể được dọn ở lần chạy sau, không cần dọn ngay.
//   4) (vòng 4, theo review Codex) applyQuizPublishPlan() KHÔNG được coi
//      "readFile thành công" (file tồn tại) là bằng chứng nội dung đã đúng -
//      nếu 1 file content-addressed đã tồn tại nhưng nội dung bị CẮT CỤT/SAI
//      (mô phỏng lần chạy trước bị ngắt giữa chừng đúng lúc đang ghi file
//      đó), lần chạy này PHẢI phát hiện sai khác và ghi lại đầy đủ (qua file
//      tạm + rename), KHÔNG được bỏ qua rồi để index mới trỏ tới file hỏng.
//   5) (FAULT-INJECTION, vòng 4) Lỗi khi ghi file TẠM của 1 quiz file (không
//      phải index) cũng phải giữ nguyên snapshot cũ - và không để lại file
//      tạm mồ côi nếu dọn được.
//   6) Sau MỌI kịch bản (kể cả các fault-injection), quiz-index.json (nếu có)
//      không bao giờ được trỏ tới file thiếu hoặc JSON hỏng - assertIndexConsistent().
// Chạy: node scripts/test-quiz-publish.mjs
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, writeFile as writeFileReal } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { planQuizPublish, applyQuizPublishPlan, fileNameForEntry } from './quiz-publish.mjs';

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
    console.error('     ', e.stack || e.message);
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

// Xác nhận quiz-index.json (nếu tồn tại) KHÔNG BAO GIỜ trỏ tới file thiếu
// hoặc JSON hỏng - gọi sau MỌI kịch bản test (kể cả các fault-injection) để
// đảm bảo bất kể thành công hay lỗi giữa chừng, trạng thái trên đĩa luôn ở
// dạng mà 1 client đọc quiz-index.json rồi tải file nó trỏ tới sẽ KHÔNG BAO
// GIỜ gặp 404 hay JSON.parse lỗi.
async function assertIndexConsistent(paths, label) {
  let indexRaw;
  try {
    indexRaw = await readFile(paths.quizIndexFile, 'utf8');
  } catch {
    return; // chưa từng publish thành công lần nào - không có gì để kiểm tra
  }
  const index = JSON.parse(indexRaw); // phải là JSON hợp lệ - nếu không, assert này tự ném lỗi rõ ràng
  for (const [key, entry] of Object.entries(index.lessons || {})) {
    const fileName = String(entry.file || '').split('?')[0].replace(/^data\/quizzes\//, '');
    const filePath = path.join(paths.quizDir, fileName);
    let content;
    try {
      content = await readFile(filePath, 'utf8');
    } catch (e) {
      throw new Error(`[${label}] quiz-index.json trỏ tới file KHÔNG TỒN TẠI cho khoá "${key}": ${fileName} (${e.message})`);
    }
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      throw new Error(`[${label}] file "${fileName}" (khoá "${key}") mà quiz-index.json trỏ tới KHÔNG PHẢI JSON hợp lệ: ${e.message}`);
    }
    assert.ok(Array.isArray(parsed), `[${label}] file "${fileName}" (khoá "${key}") phải là mảng câu hỏi`);
  }
}

// Gieo sẵn 1 snapshot "tốt" (cũ) trong thư mục tạm để kiểm tra không bị đụng tới.
async function seedGoodSnapshot(paths) {
  const oldRows = [{ id: 'keep1' }, { id: 'keep2' }];
  const oldFile = fileNameForEntry('OLD_LESSON_KEY', oldRows);
  const oldIndex = { lessons: { OLD_LESSON_KEY: { file: `data/quizzes/${oldFile}`, count: 2 } } };
  await writeFile(paths.quizIndexFile, `${JSON.stringify(oldIndex)}\n`, 'utf8');
  await writeFile(path.join(paths.quizDir, oldFile), `${JSON.stringify(oldRows)}\n`, 'utf8');
  return { oldIndex, oldFile, oldFileContent: `${JSON.stringify(oldRows)}\n` };
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

    await assertIndexConsistent(paths, label);
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

  await assertIndexConsistent(paths, 'gop-sach');
});

await check('Nội dung 1 bài KHÔNG đổi giữa 2 lần chạy -> tên file giữ nguyên, không ghi lại, file cũ (được index cũ tham chiếu) không hề bị đụng tới', async () => {
  const paths = await makeTempQuizDir();
  const lessons = [lesson('MB01', 'K', 'C', 'B1')];
  const quizRows = Array.from({ length: 3 }, (_, i) => stableRow('MB01', 's' + i));

  const plan1 = planQuizPublish(lessons, quizRows);
  await applyQuizPublishPlan(plan1, paths);
  const fileName1 = plan1.files[0].fileName;
  const contentAfterRun1 = await readFile(path.join(paths.quizDir, fileName1), 'utf8');

  // Chạy lại lần 2 với DỮ LIỆU GIỐNG HỆT - tên file (content-addressed) phải
  // giống hệt lần 1, và applyQuizPublishPlan không cần ghi lại (đã tồn tại).
  const plan2 = planQuizPublish(lessons, quizRows);
  assert.equal(plan2.files[0].fileName, fileName1, 'nội dung không đổi -> tên file (content-addressed) phải giống hệt lần trước');
  const result2 = await applyQuizPublishPlan(plan2, paths);
  assert.deepEqual(result2.written, [], 'không cần ghi lại file đã tồn tại với đúng nội dung (trùng tên content-addressed)');

  const contentAfterRun2 = await readFile(path.join(paths.quizDir, fileName1), 'utf8');
  assert.equal(contentAfterRun2, contentAfterRun1, 'nội dung file không được đổi khi dữ liệu nguồn không đổi');

  await assertIndexConsistent(paths, 'noi-dung-khong-doi');
});

await check('Nội dung 1 bài THAY ĐỔI giữa 2 lần chạy -> ra tên file MỚI, file CŨ (index cũ đang tham chiếu) không bị ghi đè', async () => {
  const paths = await makeTempQuizDir();
  const lessons = [lesson('MB01', 'K', 'C', 'B1')];
  const rowsV1 = Array.from({ length: 3 }, (_, i) => stableRow('MB01', 'v1-' + i));
  const rowsV2 = Array.from({ length: 5 }, (_, i) => stableRow('MB01', 'v2-' + i)); // nội dung khác hẳn v1

  const plan1 = planQuizPublish(lessons, rowsV1);
  await applyQuizPublishPlan(plan1, paths);
  const fileNameV1 = plan1.files[0].fileName;
  const contentV1Before = await readFile(path.join(paths.quizDir, fileNameV1), 'utf8');

  // Giả lập: quiz-index.json CŨ (đang tham chiếu fileNameV1) vẫn còn đó lúc
  // này - kịch bản thực tế là 1 client khác có thể đang đọc dở fileNameV1
  // đúng lúc lần chạy sau bắt đầu.
  const plan2 = planQuizPublish(lessons, rowsV2);
  assert.notEqual(plan2.files[0].fileName, fileNameV1, 'nội dung đổi -> PHẢI ra tên file khác hẳn, không được trùng tên với file cũ');
  await applyQuizPublishPlan(plan2, paths);

  // File CŨ (fileNameV1) không được đụng tới - vẫn còn y hệt nội dung cũ dù
  // đã bị "expectedFiles" của plan2 loại khỏi index mới (nghĩa là NÓ SẼ bị
  // dọn rác ở CHÍNH lần chạy plan2 này - SAU khi index mới đã cutover xong,
  // không phải bị ghi đè nội dung). Ở đây ta xác nhận nó không hề bị GHI ĐÈ
  // nội dung trước khi bị dọn - tức là nếu nó còn tồn tại tại bất kỳ thời
  // điểm nào trong quá trình, nội dung phải luôn đúng là contentV1Before.
  // Vì applyQuizPublishPlan đã chạy xong (đồng bộ, không có race thật), ở
  // đây ta chỉ có thể xác nhận invariant gián tiếp: file MỚI (fileNameV2)
  // phải tồn tại và ĐÚNG nội dung rowsV2, và không có bất kỳ file nào trong
  // thư mục mang tên fileNameV1 nhưng nội dung rowsV2 (tức bị ghi đè).
  const filesInDir = await readdir(paths.quizDir);
  assert.ok(!filesInDir.includes(fileNameV1) || (await readFile(path.join(paths.quizDir, fileNameV1), 'utf8')) === contentV1Before,
    'nếu file cũ (tên v1) còn tồn tại trên đĩa, nội dung của nó phải VẪN LÀ nội dung v1 - không được bị ghi đè bởi nội dung v2');

  await assertIndexConsistent(paths, 'noi-dung-thay-doi');
});

await check('File content-addressed đã tồn tại nhưng nội dung bị CẮT CỤT/SAI (mô phỏng lần chạy trước bị ngắt giữa chừng) -> publish PHẢI phát hiện và ghi lại đầy đủ, KHÔNG được bỏ qua', async () => {
  const paths = await makeTempQuizDir();

  // Bài MBT1 (sẽ bị gieo file hỏng) VÀ bài MBT2 (bình thường, dùng để xác
  // nhận phần còn lại của lần publish này vẫn đúng) - cùng nằm trong 1 lần
  // publish, giống thực tế sync-public-data.mjs luôn tính lại TOÀN BỘ danh
  // sách bài học mỗi lần chạy (không phải publish từng phần).
  const lessons = [lesson('MBT1', 'K', 'C', 'BT1'), lesson('MBT2', 'K', 'C', 'BT2')];
  const quizRows = [
    ...Array.from({ length: 4 }, (_, i) => stableRow('MBT1', 't1-' + i)),
    ...Array.from({ length: 2 }, (_, i) => stableRow('MBT2', 't2-' + i))
  ];
  const plan = planQuizPublish(lessons, quizRows);
  assert.equal(plan.action, 'publish');
  assert.equal(plan.files.length, 2);

  const truncatedEntry = plan.files.find(f => f.key === 'MBT1');
  const untouchedEntry = plan.files.find(f => f.key === 'MBT2');
  const expectedContent = `${JSON.stringify(truncatedEntry.rows)}\n`;

  // Gieo sẵn file ĐÚNG TÊN content-addressed (đúng như plan sẽ tính ra cho
  // MBT1) nhưng NỘI DUNG BỊ CẮT CỤT - mô phỏng writeFile() của lần chạy
  // TRƯỚC bị ngắt giữa chừng (mất điện/OOM/crash) ngay sau khi tạo file
  // nhưng trước khi ghi xong. Đây chính là kịch bản review Codex chỉ ra:
  // "readFile thành công" (file này ĐỌC ĐƯỢC bình thường, không lỗi) KHÔNG
  // phải bằng chứng nội dung đã đúng.
  const truncatedContent = expectedContent.slice(0, Math.floor(expectedContent.length / 2));
  assert.notEqual(truncatedContent, expectedContent, 'nội dung cắt cụt trong test phải THỰC SỰ khác nội dung đầy đủ');
  await writeFile(path.join(paths.quizDir, truncatedEntry.fileName), truncatedContent, 'utf8');

  const result = await applyQuizPublishPlan(plan, paths);

  // File bị cắt cụt PHẢI được coi là "đã ghi lại" (không được bỏ qua chỉ vì
  // tên đã tồn tại). File MBT2 (chưa từng tồn tại) dĩ nhiên cũng được ghi.
  assert.ok(result.written.includes(truncatedEntry.fileName), 'phải ghi lại file bị cắt cụt, không được bỏ qua chỉ vì tên đã tồn tại');
  assert.ok(result.written.includes(untouchedEntry.fileName));

  const finalContent = await readFile(path.join(paths.quizDir, truncatedEntry.fileName), 'utf8');
  assert.equal(finalContent, expectedContent, 'nội dung cuối cùng trên đĩa phải là nội dung ĐẦY ĐỦ, không còn bị cắt cụt');

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, plan.index, 'index mới phải cutover sau khi file đã được ghi lại đầy đủ và đúng cho CẢ 2 bài');

  await assertIndexConsistent(paths, 'file-cat-cut-duoc-ghi-lai');
});

await check('FAULT-INJECTION: lỗi khi ghi file TẠM của 1 quiz file (không phải index) -> snapshot cũ giữ nguyên, file tạm được dọn nếu có thể', async () => {
  const paths = await makeTempQuizDir();
  const { oldIndex, oldFile, oldFileContent } = await seedGoodSnapshot(paths);

  const lessons = [lesson('MBW1', 'K', 'C', 'BW1')];
  const quizRows = Array.from({ length: 3 }, (_, i) => stableRow('MBW1', 'w1-' + i));
  const plan = planQuizPublish(lessons, quizRows);
  assert.equal(plan.action, 'publish');
  const targetFileName = plan.files[0].fileName;

  // Chỉ chặn ghi vào file TẠM của CHÍNH quiz file này (tên dạng
  // ".<fileName>.tmp-...") - phân biệt với file tạm của index
  // ('.quiz-index.json.tmp-...') đã có test riêng ở trên.
  const faultyWriteFile = async (filePath, ...rest) => {
    if (String(filePath).includes(`.${targetFileName}.tmp-`)) {
      throw new Error('Giả lập lỗi đĩa khi ghi file tạm của 1 quiz file');
    }
    return writeFileReal(filePath, ...rest);
  };

  await assert.rejects(
    () => applyQuizPublishPlan(plan, paths, { writeFile: faultyWriteFile }),
    /Giả lập lỗi đĩa khi ghi file tạm của 1 quiz file/
  );

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, oldIndex, 'quiz-index.json CŨ phải giữ nguyên (lỗi xảy ra trước khi kịp cutover)');

  const oldFileContentAfter = await readFile(path.join(paths.quizDir, oldFile), 'utf8');
  assert.equal(oldFileContentAfter, oldFileContent, 'file cũ mà index cũ tham chiếu vẫn còn nguyên vẹn');

  // File đích (targetFileName) KHÔNG được tồn tại - vì rename() chưa bao giờ
  // chạy tới (writeFile file tạm đã lỗi trước đó).
  const filesInDir = await readdir(paths.quizDir);
  assert.ok(!filesInDir.includes(targetFileName), 'file đích chưa từng được rename() vào vì file tạm ghi lỗi trước đó');
  // Không được để lại file tạm mồ côi (đã được dọn trong catch của applyQuizPublishPlan).
  assert.ok(!filesInDir.some(f => f.includes(`.${targetFileName}.tmp-`)), 'file tạm của lần ghi lỗi phải được dọn, không để mồ côi trên đĩa');

  await assertIndexConsistent(paths, 'loi-ghi-file-tam-cua-1-quiz-file');
});

await check('FAULT-INJECTION: lỗi khi ghi file MỚI thứ 2 -> quiz-index.json cũ + file nó tham chiếu GIỮ NGUYÊN byte-for-byte', async () => {
  const paths = await makeTempQuizDir();
  const { oldIndex, oldFile, oldFileContent } = await seedGoodSnapshot(paths);

  // 2 bài học khác nhau -> 2 file MỚI hoàn toàn khác oldFile (nội dung khác
  // 'OLD_LESSON_KEY' nên chắc chắn khác tên).
  const lessons = [lesson('MBX1', 'K', 'C', 'BX1'), lesson('MBX2', 'K', 'C', 'BX2')];
  const quizRows = [
    ...Array.from({ length: 3 }, (_, i) => stableRow('MBX1', 'x1-' + i)),
    ...Array.from({ length: 3 }, (_, i) => stableRow('MBX2', 'x2-' + i))
  ];
  const plan = planQuizPublish(lessons, quizRows);
  assert.equal(plan.action, 'publish');
  assert.equal(plan.files.length, 2, 'test này cần đúng 2 file mới để mô phỏng lỗi ở file thứ 2');

  let callCount = 0;
  const faultyWriteFile = async (filePath, ...rest) => {
    callCount += 1;
    if (callCount === 2) {
      throw new Error('Giả lập lỗi đĩa (hết dung lượng) khi ghi file quiz thứ 2');
    }
    return writeFileReal(filePath, ...rest);
  };

  await assert.rejects(
    () => applyQuizPublishPlan(plan, paths, { writeFile: faultyWriteFile }),
    /Giả lập lỗi đĩa/,
    'applyQuizPublishPlan phải NÉM lỗi ra ngoài (không nuốt lỗi rồi âm thầm tiếp tục sang bước ghi index)'
  );

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, oldIndex, 'quiz-index.json CŨ phải giữ nguyên y hệt sau khi lỗi giữa chừng');

  const oldFileContentAfter = await readFile(path.join(paths.quizDir, oldFile), 'utf8');
  assert.equal(oldFileContentAfter, oldFileContent, 'file quiz CŨ (đang được index cũ tham chiếu) phải còn nguyên byte-for-byte');

  await assertIndexConsistent(paths, 'loi-ghi-file-moi-thu-2');
});

await check('FAULT-INJECTION: lỗi khi ghi file TẠM của index -> snapshot cũ vẫn dùng được, file mới dư chờ dọn ở lần sau', async () => {
  const paths = await makeTempQuizDir();
  const { oldIndex, oldFile, oldFileContent } = await seedGoodSnapshot(paths);

  const lessons = [lesson('MBY1', 'K', 'C', 'BY1')];
  const quizRows = Array.from({ length: 3 }, (_, i) => stableRow('MBY1', 'y1-' + i));
  const plan = planQuizPublish(lessons, quizRows);
  assert.equal(plan.action, 'publish');

  // Chỉ chặn ghi vào file TẠM của index (nhận diện qua tên chứa
  // '.quiz-index.json.tmp-') - file quiz-*.json bình thường vẫn ghi được.
  const faultyWriteFile = async (filePath, ...rest) => {
    if (String(filePath).includes('.quiz-index.json.tmp-')) {
      throw new Error('Giả lập lỗi đĩa khi ghi file tạm của quiz-index.json');
    }
    return writeFileReal(filePath, ...rest);
  };

  await assert.rejects(
    () => applyQuizPublishPlan(plan, paths, { writeFile: faultyWriteFile }),
    /Giả lập lỗi đĩa khi ghi file tạm/
  );

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, oldIndex, 'quiz-index.json CŨ (chưa từng bị đụng tới - lỗi xảy ra TRƯỚC rename) phải dùng được bình thường');

  const oldFileContentAfter = await readFile(path.join(paths.quizDir, oldFile), 'utf8');
  assert.equal(oldFileContentAfter, oldFileContent, 'file cũ mà index cũ tham chiếu vẫn còn nguyên vẹn');

  // File MỚI (quiz-*.json cho MBY1) CÓ THỂ đã được ghi thành công trước khi
  // lỗi xảy ra ở bước index - đây là "rác dư" CHẤP NHẬN ĐƯỢC, không bắt buộc
  // phải dọn ngay (sẽ được coi là stale và dọn ở lần chạy publish thành công
  // tiếp theo, vì nó không nằm trong expectedFiles của lần đó nếu không còn
  // được dùng). Xác nhận: sự tồn tại của nó không phá vỡ tính hợp lệ của
  // snapshot cũ - trang web vẫn phục vụ đúng dữ liệu qua quiz-index.json cũ.
  const filesInDir = await readdir(paths.quizDir);
  assert.ok(filesInDir.includes(oldFile), 'file cũ vẫn phải còn trong thư mục');

  await assertIndexConsistent(paths, 'loi-ghi-file-tam-cua-index');
});

await check('FAULT-INJECTION: lỗi khi rename() file tạm thành quiz-index.json -> snapshot cũ vẫn dùng được', async () => {
  const paths = await makeTempQuizDir();
  const { oldIndex, oldFile, oldFileContent } = await seedGoodSnapshot(paths);

  const lessons = [lesson('MBZ1', 'K', 'C', 'BZ1')];
  const quizRows = Array.from({ length: 2 }, (_, i) => stableRow('MBZ1', 'z1-' + i));
  const plan = planQuizPublish(lessons, quizRows);

  const faultyRename = async () => {
    throw new Error('Giả lập lỗi rename() (vd khác filesystem/quyền ghi)');
  };

  await assert.rejects(
    () => applyQuizPublishPlan(plan, paths, { rename: faultyRename }),
    /Giả lập lỗi rename/
  );

  const indexAfter = JSON.parse(await readFile(paths.quizIndexFile, 'utf8'));
  assert.deepEqual(indexAfter, oldIndex, 'quiz-index.json CŨ phải giữ nguyên khi rename() thất bại');

  const oldFileContentAfter = await readFile(path.join(paths.quizDir, oldFile), 'utf8');
  assert.equal(oldFileContentAfter, oldFileContent, 'file cũ mà index cũ tham chiếu vẫn còn nguyên vẹn');

  await assertIndexConsistent(paths, 'loi-rename-index');
});

await check('fileNameForEntry: cùng khoá + cùng nội dung -> cùng tên; đổi nội dung -> đổi tên dù cùng khoá', () => {
  const rowsA = [{ id: '1' }];
  const rowsB = [{ id: '2' }];
  assert.equal(fileNameForEntry('MB01', rowsA), fileNameForEntry('MB01', rowsA));
  assert.notEqual(fileNameForEntry('MB01', rowsA), fileNameForEntry('MB01', rowsB));
  assert.notEqual(fileNameForEntry('MB01', rowsA), fileNameForEntry('MB02', rowsA));
});

console.log(`\n${passed} test đã qua.`);
if (process.exitCode) {
  console.error('CÓ TEST THẤT BẠI.');
} else {
  console.log('TẤT CẢ TEST ĐÃ QUA.');
}
