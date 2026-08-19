import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec';
const root = path.resolve(import.meta.dirname, '..');
const dataDir = path.join(root, 'data');
const quizDir = path.join(dataDir, 'quizzes');

async function fetchJson(type, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000);
    try {
      const response = await fetch(`${GAS_URL}?type=${encodeURIComponent(type)}`, {
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

function rowsOf(value, keys) {
  if (Array.isArray(value)) return value;
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return [];
}

async function writeJson(file, value) {
  await writeFile(file, `${JSON.stringify(value)}\n`, 'utf8');
}

const [lessonData, configData, quizData] = await Promise.all([
  fetchJson('baihoc'),
  fetchJson('khoaconfig'),
  fetchJson('baitaptracnghiem')
]);

const lessons = rowsOf(lessonData, ['baihoc', 'data']);
const configs = rowsOf(configData, ['khoaconfig', 'data']);
const quizRows = rowsOf(quizData, ['baitaptracnghiem', 'data']);

if (!lessons.length) throw new Error('Không nhận được dữ liệu BaiHoc; giữ nguyên JSON cũ.');

await mkdir(quizDir, { recursive: true });
await writeJson(path.join(dataDir, 'baihoc.json'), lessons);
await writeJson(path.join(dataDir, 'khoaconfig.json'), configs);

const grouped = new Map();
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const lessonAliases = new Map();
for (const lesson of lessons) {
  const stableKey = String(lesson?.MaBai || '').trim();
  if (!stableKey) continue;
  const legacyKey = [lesson.KhoaHoc, lesson.Chuong, lesson.TenBai].map(normalize).join('|');
  lessonAliases.set(legacyKey, stableKey);
}
for (const row of quizRows) {
  let key = String(row?.baiKey || '').trim();
  if (!key) continue;
  if (key.includes('|||')) {
    const legacyKey = key.split('|||').map(normalize).join('|');
    key = lessonAliases.get(legacyKey) || key;
  }
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(row);
}

const index = { lessons: {} };
const expectedFiles = new Set();
let sequence = 1;
for (const key of [...grouped.keys()].sort((a, b) => a.localeCompare(b, 'vi'))) {
  const rows = grouped.get(key).sort((a, b) => (Number(a.thuTu) || 0) - (Number(b.thuTu) || 0));
  const fileName = `quiz-${String(sequence).padStart(4, '0')}.json`;
  sequence += 1;
  expectedFiles.add(fileName);
  index.lessons[key] = { file: `data/quizzes/${fileName}`, count: rows.length };
  await writeJson(path.join(quizDir, fileName), rows);
}

for (const fileName of await readdir(quizDir)) {
  if (/^quiz-\d+\.json$/.test(fileName) && !expectedFiles.has(fileName)) {
    await rm(path.join(quizDir, fileName));
  }
}
await writeJson(path.join(dataDir, 'quiz-index.json'), index);

console.log(`Đã đồng bộ ${lessons.length} bài học, ${configs.length} cấu hình, ${quizRows.length} câu hỏi.`);
