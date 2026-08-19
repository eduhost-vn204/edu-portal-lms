// Buoc "xuat ban" ket qua gop cau hoi (quiz-merge.mjs) ra file tinh
// data/quiz-index.json + data/quizzes/quiz-*.json, tach rieng khoi
// sync-public-data.mjs de co the test bang temp dir (khong goi mang that).
//
// Nguyen tac AN TOAN bat buoc (theo yeu cau review cua Codex 19/8, vong 3 -
// "quiz publish phai that su atomic"):
//   1) Neu buildQuizGrouping() phat hien BAT KY canh bao nao (migration-in-
//      progress / alias-collision / duplicate-id) thi KHONG duoc ghi bo du
//      lieu moi (co kha nang sai) de - GIU NGUYEN toan bo quiz-index.json va
//      cac file quiz-*.json cu, chi ghi/cap nhat quiz-warnings.json de bao
//      cho admin biet. Khong duoc "chi canh bao roi van ghi".
//   2) Ten file quiz-*.json la CONTENT-ADDRESSED: hash cua CA khoa bai hoc LAN
//      noi dung cac dong cau hoi (khong chi hash khoa nhu ban truoc). Vi vay:
//        - Neu noi dung 1 bai KHONG doi giua 2 lan chay -> cung ten file y het
//          nhu lan truoc (file da ton tai, khong can ghi lai).
//        - Neu noi dung 1 bai THAY DOI -> ten file MOI, khac hoan toan ten cu.
//          File CU (dang duoc quiz-index.json HIEN TAI tham chieu) khong bao
//          gio bi dung toi/ghi de - chi co file MOI duoc tao them.
//      Dieu nay loai bo hoan toan rui ro "ghi de noi dung vao 1 ten file ma
//      index cu van dang tro toi truoc khi index moi kip cutover" - bug ma
//      ban dung "hash chi theo khoa" (khong theo noi dung) mac phai: 2 lan
//      chay khac nhau cua CUNG 1 bai hoc se ra CUNG 1 ten file du noi dung
//      cau hoi da thay doi, nen ghi de o buoc 1 sẽ pha snapshot dang duoc
//      index CU (chua kip thay) tham chieu.
//   3) Thu tu ghi bat buoc:
//        a. Ghi TOAN BO file quiz-*.json MOI (ten content-addressed, khong
//           trung ten voi file nao dang duoc quiz-index.json HIEN TAI tham
//           chieu) - neu buoc nay loi giua chung, quiz-index.json va moi file
//           no dang tro toi VAN NGUYEN VEN (chua bi dung toi o buoc nay).
//        b. CHI sau khi (a) xong TOAN BO, ghi quiz-index.json MOI: ghi ra 1
//           file TAM trong CUNG thu muc data/ (dam bao cung filesystem) roi
//           rename() sang quiz-index.json - rename() la thao tac ATOMIC tren
//           filesystem POSIX (Linux, GitHub Actions runner) nen khong ton tai
//           trang thai "nua cu nua moi" khi mot request khac dang doc file
//           nay. Neu buoc (b) loi (vd ghi file tam that bai, hoac rename
//           that bai), quiz-index.json GOC hoan toan khong bi dung toi - van
//           dung duoc binh thuong, chi con vai file quiz-*.json MOI du thua
//           tren dia (khong anh huong gi, se duoc don o lan chay SAU).
//        c. CHI sau khi (b) THANH CONG (da rename xong), moi duoc don cac
//           file quiz-*.json CU khong con duoc quiz-index.json MOI tham
//           chieu nua.
//   Xem fault-injection test trong scripts/test-quiz-publish.mjs: gia lap
//   loi khi ghi file thu 2, va gia lap loi khi ghi/rename index - ca 2
//   truong hop deu phai xac nhan snapshot cu (index + file no tham chieu)
//   giu nguyen byte-for-byte.

import {
  mkdir as mkdirReal,
  readdir as readdirReal,
  readFile as readFileReal,
  rename as renameReal,
  rm as rmReal,
  writeFile as writeFileReal
} from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildQuizGrouping } from './quiz-merge.mjs';

// Cac kieu ten file quiz-*.json tung/dang duoc dung, de nhan dien file "do
// he thong nay quan ly" khi don rac (khong dong tay vao file la khac trong
// thu muc, neu co).
const LEGACY_SEQ_FILE_RE = /^quiz-\d+\.json$/; // ban rat cu: so thu tu tang dan (quiz-0001.json...)
const LEGACY_KEY_ONLY_HASH_RE = /^quiz-[0-9a-f]{10}\.json$/; // ban truoc (19/8 vong 2): hash CHI theo khoa - khong con dung vi khong atomic
const CONTENT_HASH_FILE_RE = /^quiz-[0-9a-f]{20}\.json$/; // ban hien tai: hash theo khoa + noi dung

/**
 * Ten file content-addressed: phu thuoc CA khoa bai hoc LAN noi dung cac dong
 * cau hoi. Cung 1 khoa nhung khac noi dung -> khac ten file hoan toan.
 */
export function fileNameForEntry(key, rows) {
  const hash = crypto.createHash('sha256')
    .update(String(key))
    .update('\u0000')
    .update(JSON.stringify(rows))
    .digest('hex')
    .slice(0, 20);
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
    const fileName = fileNameForEntry(key, rows);
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
 *
 * @param {ReturnType<typeof planQuizPublish>} plan
 * @param {{ quizDir: string, quizIndexFile: string, quizWarningsFile: string }} paths
 * @param {{ writeFile?: Function, readFile?: Function, rename?: Function, rm?: Function, mkdir?: Function, readdir?: Function }} [fsDeps]
 *   Cho phep tiem cac ham fs (thuong chi dung trong test - vd gia lap loi
 *   ghi file thu N) - mac dinh dung fs that.
 */
export async function applyQuizPublishPlan(plan, paths, fsDeps = {}) {
  const writeFile = fsDeps.writeFile || writeFileReal;
  const readFile = fsDeps.readFile || readFileReal;
  const rename = fsDeps.rename || renameReal;
  const rm = fsDeps.rm || rmReal;
  const mkdir = fsDeps.mkdir || mkdirReal;
  const readdir = fsDeps.readdir || readdirReal;

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

  // BUOC (a): ghi TOAN BO file MOI truoc. Ten content-addressed nen file nao
  // da ton tai dung ten nay chac chan da co noi dung giong het (bo qua, khong
  // ghi lai) - file nao chua ton tai la file THAT SU MOI, khong trung ten voi
  // bat ky file nao dang duoc quiz-index.json HIEN TAI (chua doi) tham chieu.
  // Neu vong lap nay nem loi giua chung (vd het dung luong dia), TOAN BO
  // quiz-index.json + moi file no dang tro toi VAN CHUA BI DUNG TOI o day.
  const written = [];
  for (const f of plan.files) {
    let alreadyExists = false;
    try {
      await readFile(path.join(quizDir, f.fileName), 'utf8');
      alreadyExists = true;
    } catch {
      alreadyExists = false;
    }
    if (alreadyExists) continue; // trung ten content-addressed -> noi dung da giong het, khong can ghi lai
    await writeFile(path.join(quizDir, f.fileName), `${JSON.stringify(f.rows)}\n`, 'utf8');
    written.push(f.fileName);
  }

  // BUOC (b): CHI sau khi (a) da ghi THANH CONG toan bo, moi duoc cutover
  // quiz-index.json - ghi ra file TAM trong CUNG thu muc (dam bao cung
  // filesystem de rename() la thao tac ATOMIC that su), roi rename() de thay
  // the quiz-index.json that. Neu buoc nay nem loi (ghi file tam that bai,
  // hoac rename that bai), quiz-index.json GOC hoan toan KHONG bi dung toi -
  // van dung duoc binh thuong; cac file quiz-*.json MOI da ghi thanh cong o
  // buoc (a) (neu co) chi la "du thua tam thoi", se tu dong duoc coi la rac
  // can don o LAN CHAY KE TIEP (khi do plan moi se tinh lai expectedFiles).
  const tmpIndexFile = path.join(
    path.dirname(quizIndexFile),
    `.quiz-index.json.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`
  );
  await writeFile(tmpIndexFile, `${JSON.stringify(plan.index)}\n`, 'utf8');
  await rename(tmpIndexFile, quizIndexFile);

  // Tu day tro di, quiz-index.json THAT SU da cutover sang bo file moi.
  await rm(quizWarningsFile, { force: true }).catch(() => {});

  // BUOC (c): CHI sau khi (b) da cutover THANH CONG, moi don cac file
  // quiz-*.json CU khong con duoc quiz-index.json MOI tham chieu nua (bao
  // gom ca cac kieu dat ten cu tu cac ban truoc - so thu tu, hoac hash-chi-
  // theo-khoa - de don dep dut diem khi chuyen sang scheme hien tai).
  const deleted = [];
  let existingFiles = [];
  try {
    existingFiles = await readdir(quizDir);
  } catch {
    existingFiles = [];
  }
  for (const fileName of existingFiles) {
    const looksManaged =
      CONTENT_HASH_FILE_RE.test(fileName) ||
      LEGACY_KEY_ONLY_HASH_RE.test(fileName) ||
      LEGACY_SEQ_FILE_RE.test(fileName);
    if (looksManaged && !plan.expectedFiles.has(fileName)) {
      await rm(path.join(quizDir, fileName), { force: true });
      deleted.push(fileName);
    }
  }

  return { written, deleted, warningsWritten: false };
}

export async function readJsonSafe(file) {
  try {
    return JSON.parse(await readFileReal(file, 'utf8'));
  } catch {
    return null;
  }
}
