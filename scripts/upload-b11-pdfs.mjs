import fs from 'node:fs';
import path from 'node:path';

const srcDir = 'D:/Work/Dạy học/Xây Dựng Lộ Trình XPS 2k9/Triển khai/GĐ1 - Chuyên đề Lý thuyết/Chương 2/Bài 11 - Định luật Boyle – Quá trình đẳng nhiệt';
const folderId = '17g57kX8pcGv5X-SDxMbJ8KFQI64qhdTX';

async function getAccessToken() {
  const clasprcPath = path.join(process.env.USERPROFILE, '.clasprc.json');
  const c = JSON.parse(fs.readFileSync(clasprcPath, 'utf8'));
  const t = c.tokens.default;
  const b = new URLSearchParams({
    client_id: t.client_id,
    client_secret: t.client_secret,
    refresh_token: t.refresh_token,
    grant_type: 'refresh_token'
  });
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: b.toString()
  });
  const json = await res.json();
  if (!json.access_token) throw new Error('Cannot get access token: ' + JSON.stringify(json));
  return json.access_token;
}

async function uploadPdf(filePath, accessToken) {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  const safeName = fileName.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const q = "'" + folderId + "' in parents and name = '" + safeName + "' and trashed = false";
  const listUrl = 'https://www.googleapis.com/drive/v3/files?q=' + encodeURIComponent(q) + '&fields=files(id,name,webViewLink)';
  const listRes = await fetch(listUrl, { headers: { Authorization: 'Bearer ' + accessToken } });
  const listJson = await listRes.json();

  if (listJson.files && listJson.files.length > 0) {
    const existing = listJson.files[0];
    console.log('[Drive] File da ton tai: ' + fileName + ' (ID: ' + existing.id + ')');
    await fetch('https://www.googleapis.com/drive/v3/files/' + existing.id + '/permissions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    }).catch(() => {});
    return {
      fileName,
      id: existing.id,
      link: 'https://drive.google.com/file/d/' + existing.id + '/view?usp=sharing'
    };
  }

  const boundary = '-------B11_PDF_UPLOAD_' + Date.now();
  const meta = JSON.stringify({ name: fileName, parents: [folderId], mimeType: 'application/pdf' });
  const head = '--' + boundary + '\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n' + meta + '\r\n--' + boundary + '\r\nContent-Type: application/pdf\r\n\r\n';
  const tail = '\r\n--' + boundary + '--\r\n';

  const body = Buffer.concat([Buffer.from(head, 'utf8'), fileBuffer, Buffer.from(tail, 'utf8')]);

  const upRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'multipart/related; boundary=' + boundary,
      'Content-Length': String(body.length)
    },
    body
  });

  const upJson = await upRes.json();
  if (!upRes.ok) throw new Error('Upload error: ' + JSON.stringify(upJson));

  await fetch('https://www.googleapis.com/drive/v3/files/' + upJson.id + '/permissions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'reader', type: 'anyone' })
  });

  console.log('[Drive] Upload moi thanh cong: ' + fileName + ' (ID: ' + upJson.id + ')');
  return {
    fileName,
    id: upJson.id,
    link: 'https://drive.google.com/file/d/' + upJson.id + '/view?usp=sharing'
  };
}

async function main() {
  console.log('[Drive] Dang lay Google OAuth access token...');
  const accessToken = await getAccessToken();

  const files = [
    path.join(srcDir, 'Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Ban Lí thuyết.pdf'),
    path.join(srcDir, 'Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập áp dụng.pdf'),
    path.join(srcDir, 'Bai 11 - Định luật Boyle – Quá trình đẳng nhiệt - Bài tập luyện tập.pdf')
  ];

  const results = {};
  for (const f of files) {
    if (!fs.existsSync(f)) throw new Error('Khong tim thay file: ' + f);
    const res = await uploadPdf(f, accessToken);
    if (f.includes('Ban Lí thuyết')) results.theory = res;
    else if (f.includes('Bài tập áp dụng')) results.applied = res;
    else if (f.includes('Bài tập luyện tập')) results.practice = res;
  }

  console.log('\n--- KET QUA UPLOAD DRIVE ---');
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('data/b11-drive-pdfs.json', JSON.stringify(results, null, 2), 'utf8');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
