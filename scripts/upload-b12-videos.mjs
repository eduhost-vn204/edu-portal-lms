import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'D:/Work/Dạy học/Xây Dựng Lộ Trình XPS 2k9/Triển khai/GĐ1 - Chuyên đề Lý thuyết/Chương 2/Bài 12 - Định luật Charles - Quá trình đẳng áp';
const authDir = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_admin_speedfix/implement_youtube_pilot_auth';
const secret = JSON.parse(fs.readFileSync(path.join(authDir, '.youtube-client-secret.json'), 'utf8')).installed;
const token = JSON.parse(fs.readFileSync(path.join(authDir, '.youtube-token.json'), 'utf8'));

const cpFile = 'data/b12-youtube-upload-checkpoint.json';

function getCp() {
  if (fs.existsSync(cpFile)) {
    try { return JSON.parse(fs.readFileSync(cpFile, 'utf8')); } catch {}
  }
  return {};
}

function saveCp(data) {
  const cur = getCp();
  const merged = { ...cur, ...data, updatedAt: new Date().toISOString() };
  fs.writeFileSync(cpFile, JSON.stringify(merged, null, 2), 'utf8');
}

async function getAccessToken() {
  const bodyParams = new URLSearchParams({
    client_id: secret.client_id,
    client_secret: secret.client_secret,
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token'
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: bodyParams.toString()
  });
  const json = await res.json();
  if (!json.access_token) throw new Error('Refresh token error: ' + JSON.stringify(json));
  return json.access_token;
}

async function uploadVideo(filePath, title, description, accessToken, cpKey) {
  const cp = getCp();
  if (cp[cpKey] && cp[cpKey].videoId && cp[cpKey].status === 'UPLOADED') {
    console.log(`[YouTube] Video đã upload trước đó: ${title} -> ID: ${cp[cpKey].videoId}`);
    return cp[cpKey];
  }

  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  const chunkSize = 10 * 1024 * 1024; // 10MB chunk

  console.log(`\n======================================================`);
  console.log(`[YouTube] Bắt đầu tải video: ${path.basename(filePath)} (${(fileSize / (1024*1024)).toFixed(1)} MB)`);
  console.log(`          Tiêu đề: ${title}`);
  console.log(`          Quyền riêng tư: UNLISTED (Học sinh xem được qua web)`);
  console.log(`======================================================`);

  let sessionUrl = cp[cpKey]?.sessionUrl;
  let startByte = 0;

  if (!sessionUrl) {
    const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Type': 'video/mp4',
        'X-Upload-Content-Length': String(fileSize)
      },
      body: JSON.stringify({
        snippet: {
          title,
          description,
          tags: ['Vật Lý 12', 'XPS 2k9', 'Định luật Charles', 'Quá trình đẳng áp', 'B12'],
          categoryId: '27'
        },
        status: {
          privacyStatus: 'unlisted',
          selfDeclaredMadeForKids: false
        }
      })
    });

    if (!initRes.ok) {
      const txt = await initRes.text();
      throw new Error(`Khởi tạo session thất bại (${initRes.status}): ${txt}`);
    }

    sessionUrl = initRes.headers.get('location');
    saveCp({ [cpKey]: { sessionUrl, bytesConfirmed: 0, fileSize, status: 'INITIALIZED' } });
  } else {
    // Check range
    const rangeRes = await fetch(sessionUrl, {
      method: 'PUT',
      headers: { 'Content-Range': `bytes */${fileSize}` }
    });
    if (rangeRes.status === 308) {
      const rangeH = rangeRes.headers.get('range');
      if (rangeH) {
        const m = /bytes=0-(\d+)/.exec(rangeH);
        if (m) {
          startByte = parseInt(m[1], 10) + 1;
          console.log(`[Resume] Đã tải trước: ${(startByte / (1024*1024)).toFixed(1)} MB / ${(fileSize / (1024*1024)).toFixed(1)} MB`);
        }
      }
    } else if (rangeRes.ok) {
      const data = await rangeRes.json();
      saveCp({ [cpKey]: { videoId: data.id, status: 'UPLOADED', privacyStatus: 'unlisted', uploadedAt: new Date().toISOString() } });
      return { videoId: data.id };
    }
  }

  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(chunkSize);

  try {
    while (startByte < fileSize) {
      const currentChunkSize = Math.min(chunkSize, fileSize - startByte);
      fs.readSync(fd, buffer, 0, currentChunkSize, startByte);
      const endByte = startByte + currentChunkSize - 1;

      let retries = 0;
      let success = false;

      while (!success && retries < 5) {
        try {
          const chunkRes = await fetch(sessionUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'video/mp4',
              'Content-Length': String(currentChunkSize),
              'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`
            },
            body: buffer.subarray(0, currentChunkSize)
          });

          if (chunkRes.status === 308) {
            startByte = endByte + 1;
            const pct = ((startByte / fileSize) * 100).toFixed(1);
            process.stdout.write(`\r[Upload] Đã tải: ${(startByte / (1024*1024)).toFixed(1)} / ${(fileSize / (1024*1024)).toFixed(1)} MB (${pct}%)`);
            saveCp({ [cpKey]: { sessionUrl, bytesConfirmed: startByte, fileSize, status: 'UPLOADING' } });
            success = true;
          } else if (chunkRes.ok) {
            const data = await chunkRes.json();
            console.log(`\n✓ Tải lên hoàn tất 100%!`);
            console.log(`✓ Video ID: ${data.id} -> https://www.youtube.com/watch?v=${data.id}`);
            saveCp({
              [cpKey]: {
                videoId: data.id,
                status: 'UPLOADED',
                privacyStatus: 'unlisted',
                uploadedAt: new Date().toISOString()
              }
            });
            return { videoId: data.id };
          } else {
            const errTxt = await chunkRes.text();
            console.error(`\nLỗi chunk ${startByte}-${endByte} (${chunkRes.status}): ${errTxt}`);
            retries++;
            await new Promise(r => setTimeout(r, 3000 * retries));
          }
        } catch (e) {
          retries++;
          console.error(`\nLỗi mạng tại chunk ${startByte}: ${e.message}. Đang thử lại (${retries}/5)...`);
          await new Promise(r => setTimeout(r, 3000 * retries));
        }
      }

      if (!success) {
        throw new Error(`Thất bại sau 5 lần thử tải chunk ${startByte}-${endByte}`);
      }
    }
  } finally {
    fs.closeSync(fd);
  }
}

async function main() {
  const at = await getAccessToken();
  console.log('Got YouTube Access Token.');

  const theoryVideoPath = path.join(srcDir, 'Bài 12. Lý thuyết.mp4');
  const practiceVideoPath = path.join(srcDir, 'Bài 12. Luyện tập.mp4');

  const theoryRes = await uploadVideo(
    theoryVideoPath,
    'B12. ĐỊNH LUẬT CHARLES – QUÁ TRÌNH ĐẲNG ÁP - Lý thuyết & Áp dụng | Vật Lý 12 - XPS 2k9',
    'Bài giảng Lý thuyết và Chữa 20 câu Bài tập áp dụng Bài 12: Định luật Charles – Quá trình đẳng áp môn Vật Lý 12 - Khóa học XPS 2k9 Thầy Xuân Trường.',
    at,
    'theory'
  );

  const practiceRes = await uploadVideo(
    practiceVideoPath,
    'B12. ĐỊNH LUẬT CHARLES – QUÁ TRÌNH ĐẲNG ÁP - Luyện tập | Vật Lý 12 - XPS 2k9',
    'Chữa chi tiết 20 câu Bài tập luyện tập Bài 12: Định luật Charles – Quá trình đẳng áp môn Vật Lý 12 - Khóa học XPS 2k9 Thầy Xuân Trường.',
    at,
    'practice'
  );

  console.log('\n======================================================');
  console.log('🎉 TẢI LÊN THÀNH CÔNG 2 VIDEO BÀI 12 LÊN YOUTUBE:');
  console.log(`   - Video Lý thuyết: https://www.youtube.com/watch?v=${theoryRes.videoId} (ID: ${theoryRes.videoId})`);
  console.log(`   - Video Luyện tập: https://www.youtube.com/watch?v=${practiceRes.videoId} (ID: ${practiceRes.videoId})`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('Fatal upload error:', err);
  process.exit(1);
});
