import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildQuizGrouping } from './quiz-merge.mjs';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.join(root, 'data');
const quizDir = path.join(dataDir, 'quizzes');

async function fetchJson(type, attempts = 3, params = {}, timeoutMs = 120_000) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const query = new URLSearchParams({ type, ...params });
      const response = await fetch(`${GAS_URL}?${query}`, {
        signal: controller.signal,
        redirect: 'follow'
      });
      if (!response.ok) throw new Error(`${type}: HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise(resolve => setTimeout(resolve, attempt * 5_000));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function fetchOptional(type) {
  try { return await fetchJson(type, 2, {}, 30_000); }
  catch (error) { console.warn(`Bỏ qua ${type}, giữ dữ liệu cũ: ${error.message}`); return null; }
}

function rowsOf(value, keys) {
  if (Array.isArray(value)) return value;
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return [];
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value)}\n`, 'utf8');
}

async function readJsonSafe(file) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch { return null; }
}

// Khong ghi mang RONG de de len 1 file JSON dang co du lieu that (vd sheet
// tra ve tam thoi rong do loi GAS/thao tac giua chung). Neu file cu KHONG co
// hoac cung dang rong thi van cho ghi (lan dau chay / du lieu thuc su rong).
async function writeJsonGuarded(file, value, label) {
  if (Array.isArray(value) && value.length === 0) {
    const old = await readJsonSafe(file);
    const oldLen = Array.isArray(old) ? old.length : (old && typeof old === 'object' ? Object.keys(old).length : 0);
    if (oldLen > 0) {
      console.warn(`⚠️  ${label}: nguồn trả về RỖNG (0 dòng) — GIỮ NGUYÊN file cũ (${oldLen} mục) để tránh làm trống trang thật.`);
      return;
    }
  }
  await writeJson(file, value);
}

const [lessonData, configData, quizData, liveData, examData, settingsData, guideData] = await Promise.all([
  fetchJson('baihoc'),
  fetchJson('khoaconfig'),
  fetchOptional('baitaptracnghiem'),
  fetchJson('lichlive'),
  fetchJson('danhsachde'),
  fetchOptional('settings'),
  fetchOptional('huongdan')
]);

const lessons = rowsOf(lessonData, ['baihoc', 'data']);
const configs = rowsOf(configData, ['khoaconfig', 'data']);
const quizRows = rowsOf(quizData, ['baitaptracnghiem', 'data']);
const liveRows = rowsOf(liveData, ['lichlive', 'data']);
const exams = Array.isArray(examData) ? examData : examData;

if (!lessons.length) throw new Error('Không nhận được dữ liệu BaiHoc; giữ nguyên JSON cũ.');

await mkdir(quizDir, { recursive: true });
await writeJson(path.join(dataDir, 'baihoc.json'), lessons);
// khoaconfig/lichlive/danhsachde CO THE hop le rong tam thoi (vd chua co lich
// live tuan nay) nhung neu truoc do dang co du lieu that thi rong dot ngot
// nhieu kha nang la loi nguon, khong phai that su rong - giu file cu, canh bao.
await writeJsonGuarded(path.join(dataDir, 'khoaconfig.json'), configs, 'khoaconfig');
await writeJsonGuarded(path.join(dataDir, 'lichlive.json'), liveRows, 'lichlive');
await writeJsonGuarded(path.join(dataDir, 'danhsachde.json'), exams, 'danhsachde');
if (settingsData) await writeJson(path.join(dataDir, 'settings.json'), settingsData);
if (guideData) await writeJson(path.join(dataDir, 'huongdan.json'), guideData);

const examRows = rowsOf(examData, ['data', 'danhsachde']);

// FIX 19/8: truoc day, neu quizData KHAC null nhung quizRows rong (0 dong -
// vi du GAS tra ve mang rong do loi tam thoi, KHONG phai do fetchOptional bat
// loi mang), code cu van chay tiep vao khoi duoi va XOA SACH toan bo file
// quiz-*.json + ghi quiz-index.json rong - lam MAT toan bo cau hoi luyen tap
// dang hien co tren web hoc sinh dù nguon that su khong loi han. Gio coi
// truong hop nay GIONG HET fetch that bai: bo qua, giu nguyen file cu.
if (quizData && quizRows.length === 0) {
  console.warn('⚠️  baitaptracnghiem: nguồn trả về RỖNG (0 dòng) — GIỮ NGUYÊN toàn bộ file quiz-*.json và quiz-index.json cũ, KHÔNG xoá.');
} else if (quizData) {
  const { grouped, warnings } = buildQuizGrouping(lessons, quizRows);

  if (warnings.length) {
    console.warn(`⚠️  Phát hiện ${warnings.length} cảnh báo khi gộp câu hỏi luyện tập:`);
    for (const w of warnings) console.warn('   -', JSON.stringify(w));
    await writeJson(path.join(dataDir, 'quiz-warnings.json'), { generatedAt: new Date().toISOString(), warnings });
  } else {
    // Khong con canh bao nao -> xoa file canh bao cu (neu co) de khong con lai
    // thong tin loi thoi.
    await rm(path.join(dataDir, 'quiz-warnings.json'), { force: true });
  }

  const index = { lessons: {} };
  const expectedFiles = new Set();
  const buildVersion = Date.now().toString(36);
  let sequence = 1;
  for (const key of [...grouped.keys()].sort((a, b) => a.localeCompare(b, 'vi'))) {
    const rows = grouped.get(key).sort((a, b) => (Number(a.thuTu) || 0) - (Number(b.thuTu) || 0));
    const fileName = `quiz-${String(sequence).padStart(4, '0')}.json`;
    sequence += 1;
    expectedFiles.add(fileName);
    index.lessons[key] = { file: `data/quizzes/${fileName}?v=${buildVersion}`, count: rows.length };
    await writeJson(path.join(quizDir, fileName), rows);
  }

  for (const fileName of await readdir(quizDir)) {
    if (/^quiz-\d+\.json$/.test(fileName) && !expectedFiles.has(fileName)) {
      await rm(path.join(quizDir, fileName));
    }
  }
  await writeJson(path.join(dataDir, 'quiz-index.json'), index);
}

console.log(`Đã đồng bộ ${lessons.length} bài học, ${configs.length} cấu hình, ${quizRows.length} câu hỏi, ${liveRows.length} lịch live và ${examRows.length} đề.`);
