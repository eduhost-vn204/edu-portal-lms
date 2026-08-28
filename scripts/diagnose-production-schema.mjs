import https from 'https';
import fs from 'fs';

const PROD_URL = 'https://script.google.com/macros/s/AKfycbyqejp4SzgwNsJb3QrTP76C5-6K2MYqv5T1CzPyi6KUOEEsC7GKQLCnR07i0DNbqKBL/exec?type=nganhang';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchJson(res.headers.location));
      }
      let raw = '';
      res.on('data', d => raw += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function diagnose() {
  console.log('=== CHẨN ĐOÁN CHI TIẾT SCHEMA PRODUCTION & DỮ LIỆU CÂU HỎI ===');
  console.log('Fetching:', PROD_URL);
  
  const res = await fetchJson(PROD_URL);
  const rows = res.data || (Array.isArray(res) ? res : []);
  console.log('1. Tổng số bản ghi nhận được:', rows.length);
  
  // A. Keys 5 bản ghi đầu tiên
  console.log('\n2. Keys của 5 bản ghi đầu tiên:');
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    console.log(`   [Row ${i}]:`, Object.keys(rows[i]));
  }
  
  // B. Keys hợp nhất toàn bộ 5,438 bản ghi
  const allKeys = new Set();
  rows.forEach(r => Object.keys(r).forEach(k => allKeys.add(k)));
  console.log('\n3. Keys hợp nhất của TOÀN BỘ 5.438 bản ghi:', Array.from(allKeys));
  
  // C. Một bản ghi mẫu (chỉ metadata)
  const sampleMeta = { ...rows[0] };
  delete sampleMeta.question;
  delete sampleMeta.deBaiChung;
  delete sampleMeta.optA;
  delete sampleMeta.optB;
  delete sampleMeta.optC;
  delete sampleMeta.optD;
  delete sampleMeta.giaiThich;
  console.log('\n4. Cấu trúc bản ghi mẫu (loại bỏ nội dung câu hỏi/đáp án):', JSON.stringify(sampleMeta, null, 2));

  // D. Thống kê mọi key liên quan chất lượng / duyệt
  console.log('\n5. Thống kê các key tiềm năng liên quan chất lượng / trạng thái:');
  const targetKeyPatterns = [/quality/i, /chatluong/i, /tier/i, /tinh/i, /tho/i, /status/i, /duyet/i, /scope/i, /mucdo/i, /loai/i];
  const matchingKeys = Array.from(allKeys).filter(k => targetKeyPatterns.some(p => p.test(k)));
  console.log('   Các key khớp mẫu:', matchingKeys);
  
  matchingKeys.forEach(k => {
    const valCounts = {};
    rows.forEach(r => {
      const v = String(r[k] !== undefined && r[k] !== null ? r[k] : '(undefined)');
      valCounts[v] = (valCounts[v] || 0) + 1;
    });
    console.log(`   Phân bố giá trị của [${k}]:`, valCounts);
  });

  // E. Tìm chuỗi "tinh", "tho", "thô" trong TOÀN BỘ các trường của TẤT CẢ các câu
  console.log('\n6. Tìm kiếm chuỗi "tinh" và "tho/thô" trên TOÀN BỘ các trường:');
  const fieldMatches = {};
  rows.forEach((r, idx) => {
    Object.entries(r).forEach(([k, v]) => {
      if (typeof v === 'string') {
        const lower = v.toLowerCase();
        if (lower.includes('tinh') || lower.includes('tho') || lower.includes('thô')) {
          if (!fieldMatches[k]) fieldMatches[k] = { tinh: 0, tho: 0, sampleTinh: [], sampleTho: [] };
          if (lower.includes('tinh')) {
            fieldMatches[k].tinh++;
            if (fieldMatches[k].sampleTinh.length < 2 && k !== 'question' && k !== 'deBaiChung' && k !== 'giaiThich' && !k.startsWith('opt')) {
              fieldMatches[k].sampleTinh.push(v);
            }
          }
          if (lower.includes('tho') || lower.includes('thô')) {
            fieldMatches[k].tho++;
            if (fieldMatches[k].sampleTho.length < 2 && k !== 'question' && k !== 'deBaiChung' && k !== 'giaiThich' && !k.startsWith('opt')) {
              fieldMatches[k].sampleTho.push(v);
            }
          }
        }
      }
    });
  });
  console.log('   Kết quả quét chuỗi trên từng field:', JSON.stringify(fieldMatches, null, 2));

  console.log('\n=== KẾT THÚC CHẨN ĐOÁN PRODUCTION SCHEMA ===');
}

diagnose().catch(err => {
  console.error('Lỗi diagnose:', err);
  process.exit(1);
});
