import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { planQuizPublish, applyQuizPublishPlan } from './quiz-publish.mjs';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';
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

async function fetchOptional(type, attempts = 2, params = {}, timeoutMs = 30_000) {
  try { return await fetchJson(type, attempts, params, timeoutMs); }
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

const [lessonData, configData, quizData, liveData, examData, settingsData, guideData, teachingScopeData, liveRecordData] = await Promise.all([
  fetchJson('baihoc'),
  fetchJson('khoaconfig'),
  fetchOptional('baitaptracnghiem', 1, {}, 150_000),
  fetchJson('lichlive'),
  fetchJson('danhsachde'),
  fetchOptional('settings'),
  fetchOptional('huongdan'),
  fetchOptional('teachingscope'),
  fetchOptional('liverecord')
]);

const rawLessons = rowsOf(lessonData, ['baihoc', 'data']);
// Draft/Hidden Lesson Contract: Tuyệt đối không đưa bài draft hoặc archived vào dữ liệu tĩnh công khai
const lessons = rawLessons.filter(l => {
  const st = (l?.TrangThai || l?.trangthai || l?.status || 'published').toString().trim().toLowerCase();
  return st === 'published';
});
const rawLiveRecords = rowsOf(liveRecordData, ['liverecord', 'data', 'baihoc']);
const liveRecords = rawLiveRecords.filter(l => {
  const st = (l?.TrangThai || l?.trangthai || l?.status || 'published').toString().trim().toLowerCase();
  return st === 'published';
});
const configs = rowsOf(configData, ['khoaconfig', 'data']);
const quizRows = rowsOf(quizData, ['baitaptracnghiem', 'data']);
const liveRows = rowsOf(liveData, ['lichlive', 'data']);
const exams = Array.isArray(examData) ? examData : examData;

if (!lessons.length) throw new Error('Không nhận được dữ liệu BaiHoc; giữ nguyên JSON cũ.');

await mkdir(quizDir, { recursive: true });
await writeJson(path.join(dataDir, 'baihoc.json'), lessons);
await writeJson(path.join(dataDir, 'live-record.json'), liveRecords);
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
if (teachingScopeData) await writeJson(path.join(dataDir, 'teachingscope.json'), teachingScopeData);

const examRows = rowsOf(examData, ['data', 'danhsachde']);

// Tự động bổ sung câu hỏi từ cột BaiTap của bài học nếu sheet BaiTapTracNghiem bị thiếu/timeout
for (const lesson of lessons) {
  const maBai = String(lesson.MaBai || '').trim();
  if (!maBai) continue;
  const hasInQuizRows = quizRows.some(r => String(r.baiKey || '').trim() === maBai);
  if (!hasInQuizRows && lesson.BaiTap) {
    try {
      const items = typeof lesson.BaiTap === 'string' ? JSON.parse(lesson.BaiTap) : lesson.BaiTap;
      if (Array.isArray(items) && items.length > 0) {
        items.forEach((it, idx) => {
          quizRows.push({
            baiKey: maBai,
            thuTu: idx + 1,
            type: it.type || 'mc',
            question: it.q || it.question || '',
            optA: it.A || it.optA || '',
            optB: it.B || it.optB || '',
            optC: it.C || it.optC || '',
            optD: it.D || it.optD || '',
            correct: it.correct || it.ans || ''
          });
        });
      }
    } catch(e) {}
  }
}

if (quizRows.length > 0) {
  const buildVersion = Date.now().toString(36);
  const plan = planQuizPublish(lessons, quizRows, { buildVersion });
  if (plan.action === 'blocked') {
    console.warn(`⚠️  Phát hiện ${plan.warnings.length} cảnh báo khi gộp câu hỏi luyện tập — KHÔNG xuất bản dữ liệu mới, GIỮ NGUYÊN toàn bộ quiz-*.json và quiz-index.json cũ:`);
    for (const w of plan.warnings) console.warn('   -', JSON.stringify(w));
  } else {
    await applyQuizPublishPlan(plan, {
      quizDir,
      quizIndexFile: path.join(dataDir, 'quiz-index.json'),
      quizWarningsFile: path.join(dataDir, 'quiz-warnings.json')
    });
  }
} else {
  console.warn('⚠️  Không có câu hỏi luyện tập nào — GIỮ NGUYÊN toàn bộ file quiz-*.json và quiz-index.json cũ.');
}

console.log(`Đã đồng bộ ${lessons.length} bài học, ${liveRecords.length} buổi live, ${configs.length} cấu hình, ${quizRows.length} câu hỏi, ${liveRows.length} lịch live và ${examRows.length} đề.`);
