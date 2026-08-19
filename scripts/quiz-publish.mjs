// Buoc "xuat ban" ket qua gop cau hoi (quiz-merge.mjs) ra file tinh
// data/quiz-index.json + data/quizzes/quiz-*.json, tach rieng khoi
// sync-public-data.mjs de co the test bang temp dir (khong goi mang that).
//
// Nguyen tac AN TOAN bat buoc (theo yeu cau review cua Codex 19/8):
//   1) Neu buildQuizGrouping() phat hien BAT KY canh bao nao (migration-in-
//      progress / alias-collision / duplicate-id) thi KHONG duoc ghi bo du
//      lieu moi (co kha nang sai) de - GIU NGUYEN toan bo quiz-index.json va
//      cac file quiz-*.json cu, chi ghi/cap nhat quiz-warnings.json de bao
//      cho admin biet. Khong duoc "chi canh bao roi van ghi".
//   2) Khi KHONG co canh bao (an toan de xuat ban): ghi HET cac file
//      quiz-*.json moi va quiz-index.json moi TRUOC, chi sau khi TOAN BO da
//      ghi thanh cong moi duoc xoa cac file quiz-*.json cu khong con dung
//      toi (dep rac). Khong duoc xoa file cu truoc khi du lieu moi da ghi
//      xong - tranh khoang thoi gian index tro toi file da bi xoa.
//   3) Ten file quiz-*.json duoc sinh TU KHOA BAI HOC (hash on dinh) thay vi
//      so thu tu tang dan theo vi tri sap xep - de cung 1 bai hoc luon anh xa
//      ve cung 1 ten file giua cac lan chay, tranh truong hop 1 ten file (vd
//      quiz-0002.json) mang y nghia KHAC nhau giua lan chay truoc va lan chay
//      sau (rui ro ghi de noi dung bai khac vao 1 file ma index cu van dang
//      tro toi, trong luc dang cho ghi index moi).

import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildQuizGrouping } from './quiz-merge.mjs';

const LEGACY_SEQ_FILE_RE = /^quiz-\d+\.json$/; // ten file kieu cu (quiz-0001.json...) - don dep 1 lan khi chuyen sang ten hash
const HASH_FILE_RE = /^quiz-[0-9a-f]{10}\.json$/; // ten file kieu moi (on dinh theo key)

export function fileNameForKey(key) {
  const hash = crypto.createHash('sha1').update(String(key)).digest('hex').slice(0, 10);
  return `quiz-${hash}.json`;
}

/**
 * Tinh toan KE HOACH xuat ban (thuan, khong dung fs/mang) tu ket qua
 * buildQuizGrouping. Khong tu ghi/xoa gi ca - xem applyQuizPublishPlan.
 *
 * @param {Array<object>} lessons
 * @param {Array<object>} quizRows
 * @param {{ buildVersion?: string }} [options]
 * @returns {{action:'blocked', warnings:object[]} | {action:'publish', warnings:object[], files:Array<{fileName:string,key:string,rows:object[]}>, index:object, expectedFiles:Set<string>}}
 */
export function planQuizPublish(lessons, quizRows, options = {}) {
  const { grouped, warnings } = buildQuizGrouping(lessons, quizRows);

  if (warnings.length) {
    // KHONG an toan de xuat ban - co the lam mat/sai cau hoi hoc sinh dang thay.
    return { action: 'blocked', warnings };
  }

  const index = { lessons: {} };
  const files = [];
  const expectedFiles = new Set();
  const sortedKeys = [...grouped.keys()].sort((a, b) => a.localeCompare(b, 'vi'));
  for (const key of sortedKeys) {
    const rows = grouped.get(key).sort((a, b) => (Number(a.thuTu) || 0) - (Number(b.thuTu) || 0));
    const fileName = fileNameForKey(key);
    expectedFiles.add(fileName);
    index.lessons[key] = {
      file: `data/quizzes/${fileName}${options.buildVersion ? `?v=${options.buildVersion}` : ''}`,
      count: rows.length
    };
    files.push({ fileName, key, rows });
  }

  return { action: 'publish', warnings: [], files, index, expectedFiles };
}

/**
 * Thuc thi ke hoach tu planQuizPublish() len dia that (hoac temp dir khi test).
 * @param {ReturnType<typeof planQuizPublish>} plan
 * @param {{ quizDir: string, quizIndexFile: string, quizWarningsFile: string }} paths
 */
export async function applyQuizPublishPlan(plan, paths) {
  const { quizDir, quizIndexFile, quizWarningsFile } = paths;

  if (plan.action === 'blocked') {
    await mkdir(quizDir, { recursive: true });
    await writeFile(
      quizWarningsFile,
      `${JSON.stringify({ generatedAt: new Date().toISOString(), warnings: plan.warnings })}\n`,
      'utf8'
    );
    // CO Y khong dung gi khac o day: khong ghi de/xoa quiz-index.json hay bat
    // ky file quiz-*.json nao - giu nguyen snapshot tot dang co.
    return { written: [], deleted: [], warningsWritten: true };
  }

  // plan.action === 'publish'
  await mkdir(quizDir, { recursive: true });
  const written = [];
  for (const f of plan.files) {
    await writeFile(path.join(quizDir, f.fileName), `${JSON.stringify(f.rows)}\n`, 'utf8');
    written.push(f.fileName);
  }
  // Ghi index MOI chi sau khi TOAN BO file quiz-*.json moi da ghi xong.
  await writeFile(quizIndexFile, `${JSON.stringify(plan.index)}\n`, 'utf8');
  // Khong con canh bao nao dang treo -> xoa file canh bao cu (neu co).
  await rm(quizWarningsFile, { force: true }).catch(() => {});

  // CHI SAU KHI index moi da ghi xong moi don dep file quiz-*.json cu khong
  // con duoc tham chieu (kieu ten hash moi VA kieu ten so thu tu cu, de don
  // dep 1 lan cac file con sot lai tu truoc khi doi sang dat ten theo hash).
  const deleted = [];
  let existingFiles = [];
  try {
    existingFiles = await readdir(quizDir);
  } catch {
    existingFiles = [];
  }
  for (const fileName of existingFiles) {
    const looksManaged = HASH_FILE_RE.test(fileName) || LEGACY_SEQ_FILE_RE.test(fileName);
    if (looksManaged && !plan.expectedFiles.has(fileName)) {
      await rm(path.join(quizDir, fileName), { force: true });
      deleted.push(fileName);
    }
  }

  return { written, deleted, warningsWritten: false };
}

export async function readJsonSafe(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}
