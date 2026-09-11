import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_BASE_DIR = 'D:\\Work\\Dạy học\\Xây Dựng Lộ Trình XPS 2k9\\Triển khai\\GĐ1 - Chuyên đề Lý thuyết';

export function normalizeName(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function parseLessonNumber(input) {
  if (typeof input === 'number') return input;
  const s = String(input || '').trim();
  const match = s.match(/(?:b(?:ài|uổi)?\s*|^)?(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

export function findLessonDirectory(lessonNum, baseDir = DEFAULT_BASE_DIR) {
  const num = parseLessonNumber(lessonNum);
  if (!num) {
    throw new Error(`Số bài học không hợp lệ: "${lessonNum}"`);
  }

  if (!fs.existsSync(baseDir)) {
    throw new Error(`Thư mục gốc không tồn tại: "${baseDir}"`);
  }

  const chapters = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && /chương|chuong/i.test(d.name))
    .map(d => path.join(baseDir, d.name));

  for (const chapterPath of chapters) {
    const chapterName = path.basename(chapterPath);
    const entries = fs.readdirSync(chapterPath, { withFileTypes: true })
      .filter(d => d.isDirectory());

    for (const entry of entries) {
      const norm = normalizeName(entry.name);
      const pattern = new RegExp(`^b(?:ai)?\\s*${num}(?:\\s|$)`);
      if (pattern.test(norm)) {
        return {
          lessonNum: num,
          chapterName,
          chapterPath,
          lessonDirName: entry.name,
          lessonDirPath: path.join(chapterPath, entry.name)
        };
      }
    }
  }

  return null;
}

export function inspectLessonPackage(lessonDirPath) {
  if (!fs.existsSync(lessonDirPath)) {
    throw new Error(`Thư mục bài học không tồn tại: ${lessonDirPath}`);
  }

  const allFiles = fs.readdirSync(lessonDirPath, { withFileTypes: true })
    .filter(f => f.isFile())
    .map(f => ({
      name: f.name,
      fullPath: path.join(lessonDirPath, f.name),
      size: fs.statSync(path.join(lessonDirPath, f.name)).size
    }));

  const pkg = {
    videoTheory: null,
    videoPractice: null,
    docxTheory: null,
    docxApplied: null,
    docxAppliedWeb: null,
    docxPractice: null,
    docxPracticeWeb: null,
    otherFiles: []
  };

  for (const f of allFiles) {
    const norm = normalizeName(f.name);
    const isDocx = f.name.endsWith('.docx') && !f.name.startsWith('~$');
    const isMp4 = f.name.endsWith('.mp4');

    if (isMp4) {
      if (norm.includes('ly thuyet')) {
        pkg.videoTheory = f;
      } else if (norm.includes('luyen tap')) {
        pkg.videoPractice = f;
      } else {
        pkg.otherFiles.push(f);
      }
    } else if (isDocx) {
      const isWeb = norm.includes('wed') || norm.includes('web');
      if (norm.includes('ban li thuyet') || norm.includes('ly thuyet')) {
        pkg.docxTheory = f;
      } else if (norm.includes('ap dung')) {
        if (isWeb) pkg.docxAppliedWeb = f;
        else pkg.docxApplied = f;
      } else if (norm.includes('luyen tap')) {
        if (isWeb) pkg.docxPracticeWeb = f;
        else pkg.docxPractice = f;
      } else {
        pkg.otherFiles.push(f);
      }
    } else {
      pkg.otherFiles.push(f);
    }
  }

  const missing = [];
  if (!pkg.videoTheory) missing.push('Video MP4 Lý thuyết (chứa "Lý thuyết")');
  if (!pkg.videoPractice) missing.push('Video MP4 Luyện tập (chứa "Luyện tập")');
  if (!pkg.docxTheory) missing.push('Word Bản Lí thuyết (chứa "Ban Lí thuyết.docx")');
  if (!pkg.docxApplied) missing.push('Word Bài tập áp dụng (chứa "Bài tập áp dụng.docx")');
  if (!pkg.docxAppliedWeb) missing.push('Word Bài tập áp dụng web (chứa "Bài tập áp dụng - wed.docx")');
  if (!pkg.docxPractice) missing.push('Word Bài tập luyện tập (chứa "Bài tập luyện tập.docx")');
  if (!pkg.docxPracticeWeb) missing.push('Word Bài tập luyện tập web (chứa "Bài tập luyện tập - wed.docx")');

  return {
    package: pkg,
    missing,
    isComplete: missing.length === 0,
    totalFiles: allFiles.length,
    files: allFiles
  };
}

if (process.argv[1] && path.basename(process.argv[1]) === 'resolve-lesson-source.mjs') {
  const arg = process.argv[2] || '12';
  try {
    const loc = findLessonDirectory(arg);
    if (!loc) {
      console.log(JSON.stringify({ found: false, lessonNum: arg, error: `Không tìm thấy thư mục Bài ${arg}` }, null, 2));
      process.exit(0);
    }
    const inspection = inspectLessonPackage(loc.lessonDirPath);
    const result = {
      found: true,
      lessonNum: loc.lessonNum,
      chapter: loc.chapterName,
      lessonTitle: loc.lessonDirName,
      fullPath: loc.lessonDirPath,
      isComplete: inspection.isComplete,
      missing: inspection.missing,
      package: {
        videoTheory: inspection.package.videoTheory ? inspection.package.videoTheory.name : null,
        videoPractice: inspection.package.videoPractice ? inspection.package.videoPractice.name : null,
        docxTheory: inspection.package.docxTheory ? inspection.package.docxTheory.name : null,
        docxApplied: inspection.package.docxApplied ? inspection.package.docxApplied.name : null,
        docxAppliedWeb: inspection.package.docxAppliedWeb ? inspection.package.docxAppliedWeb.name : null,
        docxPractice: inspection.package.docxPractice ? inspection.package.docxPractice.name : null,
        docxPracticeWeb: inspection.package.docxPracticeWeb ? inspection.package.docxPracticeWeb.name : null,
        otherFiles: inspection.package.otherFiles.map(f => f.name)
      }
    };
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
