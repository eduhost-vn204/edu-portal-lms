import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'D:/Work/Dạy học/Xây Dựng Lộ Trình XPS 2k9/Triển khai/GĐ1 - Chuyên đề Lý thuyết/Chương 2/Bài 11 - Định luật Boyle – Quá trình đẳng nhiệt';
const authDir = 'C:/Users/Xuan Truong/.gemini/antigravity/worktrees/_codex_admin_speedfix/implement_youtube_pilot_auth';
const secret = JSON.parse(fs.readFileSync(path.join(authDir, '.youtube-client-secret.json'), 'utf8')).installed;
const token = JSON.parse(fs.readFileSync(path.join(authDir, '.youtube-token.json'), 'utf8'));

const cpFile = 'data/b11-youtube-upload-checkpoint.json';

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
          tags: ['Vật Lý 12', 'XPS 2k9', 'Định luật Boyle', 'Quá trình đẳng nhiệt', 'B11'],
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
        if (m) startByte = parseInt(m[1], 10) + 1;
      }
      console.log(`[YouTube] Tiếp tục tải từ byte ${startByte} / ${fileSize}`);
    } else if (rangeRes.ok) {
      const json = await rangeRes.json();
      const resData = { videoId: json.id, url: `https://www.youtube.com/watch?v=${json.id}`, status: 'UPLOADED' };
      saveCp({ [cpKey]: resData });
      return resData;
    }
  }

  let currentByte = startByte;
  let finalJson = null;

  while (currentByte < fileSize) {
    const endByte = Math.min(currentByte + chunkSize, fileSize) - 1;
    const chunkLength = endByte - currentByte + 1;
    const chunkBuffer = Buffer.alloc(chunkLength);

    const fd = fs.openSync(filePath, 'r');
    try {
      fs.readSync(fd, chunkBuffer, 0, chunkLength, currentByte);
    } finally {
      fs.closeSync(fd);
    }

    const chunkRes = await fetch(sessionUrl, {
      method: 'PUT',
      headers: {
        'Content-Range': `bytes ${currentByte}-${endByte}/${fileSize}`,
        'Content-Type': 'video/mp4'
      },
      body: chunkBuffer
    });

    if (chunkRes.status === 308) {
      const rangeH = chunkRes.headers.get('range');
      let nextByte = endByte + 1;
      if (rangeH) {
        const m = /bytes=0-(\d+)/.exec(rangeH);
        if (m) nextByte = parseInt(m[1], 10) + 1;
      }
      currentByte = nextByte;
      const pct = ((currentByte / fileSize) * 100).toFixed(1);
      const curMb = (currentByte / (1024 * 1024)).toFixed(1);
      const totMb = (fileSize / (1024 * 1024)).toFixed(1);
      process.stdout.write(`\r[Upload] Đã tải: ${curMb} / ${totMb} MB (${pct}%)`);
      saveCp({ [cpKey]: { sessionUrl, bytesConfirmed: currentByte, fileSize, status: 'UPLOADING' } });
    } else if (chunkRes.status === 200 || chunkRes.status === 201) {
      finalJson = await chunkRes.json();
      currentByte = fileSize;
      console.log(`\n✓ Tải lên hoàn tất 100%!`);
      break;
    } else {
      const txt = await chunkRes.text();
      throw new Error(`Upload chunk error (${chunkRes.status}): ${txt}`);
    }
  }

  const videoId = finalJson.id;
  const result = {
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    status: 'UPLOADED',
    privacyStatus: 'unlisted',
    uploadedAt: new Date().toISOString()
  };
  saveCp({ [cpKey]: result });
  console.log(`✓ Video ID: ${videoId} -> ${result.url}`);
  return result;
}

async function main() {
  console.log('[YouTube] Đang refresh access token...');
  const accessToken = await getAccessToken();
  console.log('✓ Access token hợp lệ.');

  const videoTheoryPath = path.join(srcDir, 'Bài 11. Lý thuyết.mp4');
  const videoPracticePath = path.join(srcDir, 'Bài 11. Luyện tập .mp4');

  if (!fs.existsSync(videoTheoryPath)) throw new Error('Không tìm thấy: ' + videoTheoryPath);
  if (!fs.existsSync(videoPracticePath)) throw new Error('Không tìm thấy: ' + videoPracticePath);

  // 1. Upload Video Lý thuyết
  const theoryRes = await uploadVideo(
    videoTheoryPath,
    'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT - Lý thuyết | Vật Lý 12 - XPS 2k9',
    'Bài 11: Định luật Boyle – Quá trình đẳng nhiệt (Lý thuyết trọng tâm) - Khóa học Vật Lý 12 XPS 2k9 - Thầy Xuân Trường',
    accessToken,
    'theory'
  );

  // 2. Upload Video Luyện tập
  const practiceRes = await uploadVideo(
    videoPracticePath,
    'B11. ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT - Luyện tập | Vật Lý 12 - XPS 2k9',
    'Bài 11: Định luật Boyle – Quá trình đẳng nhiệt (Chữa bài tập luyện tập) - Khóa học Vật Lý 12 XPS 2k9 - Thầy Xuân Trường',
    accessToken,
    'practice'
  );

  console.log('\n======================================================');
  console.log('🎉 TẢI LÊN THÀNH CÔNG 2 VIDEO BÀI 11 LÊN YOUTUBE:');
  console.log(`   - Video Lý thuyết: ${theoryRes.url} (ID: ${theoryRes.videoId})`);
  console.log(`   - Video Luyện tập: ${practiceRes.url} (ID: ${practiceRes.videoId})`);
  console.log('======================================================\n');
}

main().catch(err => {
  console.error('\n❌ Lỗi upload video:', err);
  process.exit(1);
});
