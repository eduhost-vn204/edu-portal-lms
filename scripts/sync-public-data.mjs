import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { planQuizPublish, applyQuizPublishPlan } from './quiz-publish.mjs';

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
// FIX (Codex review 19/8): khoaconfig/lichlive/danhsachde KHONG con dung guard
// "rong thi giu file cu" nua. Rong o 3 loai nay CO THE la trang thai hop le that
// (vd giao vien xoa het lich live tuan nay, xoa het de thi cu) - neu am tham giu
// file cu khi khong co tin hieu/version xac nhan tu backend rang du lieu rong la
// LOI (khong phai giao vien chu dong xoa that), website se giu mai du lieu da bi
// xoa hop le, khong bao gio phan anh dung trang thai that. Quay lai hanh vi ghi
// truc tiep nhu truoc, CHI rieng quiz (cau hoi luyen tap - rong bat ngo rui ro cao
// hon nhieu vi anh huong truc tiep den viec hoc, kho phan biet loi/that su rong o
// muc dong hang loat) moi co lop bao ve rieng (xem duoi).
await writeJson(path.join(dataDir, 'khoaconfig.json'), configs);
await writeJson(path.join(dataDir, 'lichlive.json'), liveRows);
await writeJson(path.join(dataDir, 'danhsachde.json'), exams);
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
  // FIX (Codex review 19/8): plan/apply tach rieng (scripts/quiz-publish.mjs) -
  // neu buildQuizGrouping phat hien canh bao (migration-in-progress/alias-
  // collision/duplicate-id) thi KHONG ghi bo du lieu moi (co kha nang sai) de,
  // chi ghi quiz-warnings.json de bao cho admin. Khi an toan de xuat ban, ghi
  // HET file moi + index moi TRUOC, chi don dep file cu KHONG CON DUNG toi SAU
  // khi da ghi thanh cong (xem chi tiet trong quiz-publish.mjs).
  const buildVersion = Date.now().toString(36);
  const plan = planQuizPublish(lessons, quizRows, { buildVersion });
  if (plan.action === 'blocked') {
    console.warn(`⚠️  Phát hiện ${plan.warnings.length} cảnh báo khi gộp câu hỏi luyện tập — KHÔNG xuất bản dữ liệu mới, GIỮ NGUYÊN toàn bộ quiz-*.json và quiz-index.json cũ:`);
    for (const w of plan.warnings) console.warn('   -', JSON.stringify(w));
  }
  await applyQuizPublishPlan(plan, {
    quizDir,
    quizIndexFile: path.join(dataDir, 'quiz-index.json'),
    quizWarningsFile: path.join(dataDir, 'quiz-warnings.json')
  });
}

console.log(`Đã đồng bộ ${lessons.length} bài học, ${configs.length} cấu hình, ${quizRows.length} câu hỏi, ${liveRows.length} lịch live và ${examRows.length} đề.`);
