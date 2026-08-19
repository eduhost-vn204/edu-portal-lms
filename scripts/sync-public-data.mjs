import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
await writeJson(path.join(dataDir, 'khoaconfig.json'), configs);
await writeJson(path.join(dataDir, 'lichlive.json'), liveRows);
await writeJson(path.join(dataDir, 'danhsachde.json'), exams);
if (settingsData) await writeJson(path.join(dataDir, 'settings.json'), settingsData);
if (guideData) await writeJson(path.join(dataDir, 'huongdan.json'), guideData);

const examRows = rowsOf(examData, ['data', 'danhsachde']);

if (quizData) {
const grouped = new Map();
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const lessonAliases = new Map();
const stableLessonKeys = new Set();
for (const lesson of lessons) {
  const stableKey = String(lesson?.MaBai || '').trim();
  if (!stableKey) continue;
  stableLessonKeys.add(stableKey);
  const legacyKey = [lesson.KhoaHoc, lesson.Chuong, lesson.TenBai].map(normalize).join('|');
  lessonAliases.set(legacyKey, stableKey);
}
// Neu MaBai moi da co du lieu, do la nguon chuan. Khong tron them cac dong
// baiKey kieu cu (KhoaHoc|||Chuong|||TenBai), neu khong se cong don 30+20=50.
const stableKeysWithRows = new Set(quizRows
  .map(row => String(row?.baiKey || '').trim())
  .filter(key => stableLessonKeys.has(key)));
for (const row of quizRows) {
  const rawKey = String(row?.baiKey || '').trim();
  let key = rawKey;
  if (!key) continue;
  if (key.includes('|||')) {
    const legacyKey = key.split('|||').map(normalize).join('|');
    const mappedKey = lessonAliases.get(legacyKey);
    if (mappedKey && stableKeysWithRows.has(mappedKey)) continue;
    key = mappedKey || key;
  }
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(row);
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
