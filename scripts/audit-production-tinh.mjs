import https from 'https';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { isApprovedTinhQuestion, filterQuestionsByScope } = require('../teaching-scope.js');

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

async function runAudit() {
  console.log('=== AUDIT THỰC TẾ NGÂN HÀNG CÂU HỎI PRODUCTION (VERSION 78) ===');
  console.log('Endpoint:', PROD_URL);
  
  const res = await fetchJson(PROD_URL);
  const rows = res.data || (Array.isArray(res) ? res : []);
  
  const total = rows.length;
  let countChatLuongTinh = 0;
  let countRawTierTinh = 0;
  let countTho = 0;
  let countEmptyBoth = 0;
  let countDuaTop = 0;
  let countSolo = 0;
  
  const chStatsDuaTop = {};
  const chStatsSolo = {};
  
  rows.forEach(q => {
    const rt = q.rawTier !== undefined && q.rawTier !== null ? String(q.rawTier).trim().toLowerCase() : '';
    const cl = q.chatLuong !== undefined && q.chatLuong !== null ? String(q.chatLuong).trim().toLowerCase() : '';
    
    if (cl === 'tinh') countChatLuongTinh++;
    if (rt === 'tinh') countRawTierTinh++;
    if (cl === 'tho' || rt === 'tho') countTho++;
    if (!cl && !rt) countEmptyBoth++;
    
    if (isApprovedTinhQuestion(q, 'DUA_TOP')) {
      countDuaTop++;
      const ch = (q.chuong || 'Chưa phân chương').trim();
      chStatsDuaTop[ch] = (chStatsDuaTop[ch] || 0) + 1;
    }
    
    if (isApprovedTinhQuestion(q, 'SOLO')) {
      countSolo++;
      const ch = (q.chuong || 'Chưa phân chương').trim();
      chStatsSolo[ch] = (chStatsSolo[ch] || 0) + 1;
    }
  });
  
  console.log('------------------------------------------------------------');
  console.log('Tổng số câu production:              ', total);
  console.log('chatLuong=tinh:                      ', countChatLuongTinh);
  console.log('rawTier=tinh:                        ', countRawTierTinh);
  console.log('Thiếu/rỗng cả hai trường (BỊ CHẶN):  ', countEmptyBoth);
  console.log('Thô (BỊ CHẶN):                       ', countTho);
  console.log('TN Tinh hợp lệ cho DUA_TOP:          ', countDuaTop);
  console.log('TN Tinh hợp lệ cho SOLO:             ', countSolo);
  console.log('Phân bố câu Tinh hợp lệ theo chương (DUA_TOP):', JSON.stringify(chStatsDuaTop, null, 2));
  console.log('Phân bố câu Tinh hợp lệ theo chương (SOLO):   ', JSON.stringify(chStatsSolo, null, 2));
  console.log('------------------------------------------------------------');
  console.log('=== KẾT THÚC AUDIT THỰC TẾ ===');
}

runAudit().catch(err => {
  console.error('Lỗi khi chạy audit:', err.message);
  process.exit(1);
});
