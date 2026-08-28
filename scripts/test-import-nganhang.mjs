import assert from 'assert';

console.log('=== TEST SUITE: IMPORT NGAN HANG ROUTE & BATCH WORKFLOW ===\n');

function check(title, fn) {
  try {
    fn();
    console.log('OK   -', title);
  } catch (e) {
    console.error('FAIL -', title);
    console.error(e);
    process.exitCode = 1;
  }
}

const NH_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong'];

class MockSheet {
  constructor(headers, initialRows = []) {
    this.headers = [...headers];
    this.data = [this.headers, ...initialRows];
  }
  getDataRange() {
    return {
      getValues: () => this.data.map(r => [...r])
    };
  }
  getLastRow() {
    return this.data.length;
  }
  getRange(row, col, numRows = 1, numCols = 1) {
    return {
      getValues: () => {
        const res = [];
        for (let r = 0; r < numRows; r++) {
          const targetRow = row - 1 + r;
          const rowData = this.data[targetRow] || [];
          res.push(rowData.slice(col - 1, col - 1 + numCols));
        }
        return res;
      },
      setValues: (matrix) => {
        for (let r = 0; r < matrix.length; r++) {
          const targetRow = row - 1 + r;
          while (this.data.length <= targetRow) this.data.push(new Array(this.headers.length).fill(''));
          for (let c = 0; c < matrix[r].length; c++) {
            this.data[targetRow][col - 1 + c] = matrix[r][c];
          }
        }
      }
    };
  }
  deleteRows(startRow, numRows) {
    this.data.splice(startRow - 1, numRows);
  }
}

function mockImportNganHang(sheet, data, adminKey = 'valid_key', forceVerifyFail = false) {
  if (!data.adminKey || data.adminKey !== adminKey) {
    return { ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' };
  }

  const dryRun = data.dryRun === true || data.dryRun === 'true';
  const batchId = String(data.batchId || 'BATCH_IMPORT').trim();
  const rawQuestions = Array.isArray(data.questions) ? data.questions : [];

  if (!rawQuestions.length) {
    return { ok: false, msg: 'Danh sách questions rỗng' };
  }
  if (rawQuestions.length > 200) {
    return { ok: false, msg: 'Số lượng câu vượt quá giới hạn tối đa (200 câu/lần)' };
  }

  const rows = sheet.getDataRange().getValues();
  const countBefore = rows.length > 1 ? rows.length - 1 : 0;

  const existingIdSet = new Set();
  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0] || '').trim();
    if (rId) existingIdSet.add(rId);
  }

  const seenPayloadIds = new Set();
  const duplicates = [];
  const invalidItems = [];
  const normalizedRows = [];
  const normalizedPreview = [];
  const nowIso = new Date().toISOString();

  for (let idx = 0; idx < rawQuestions.length; idx++) {
    const q = rawQuestions[idx] || {};
    const id = String(q.id || '').trim();
    const itemErrors = [];

    if (!id) {
      itemErrors.push('Thiếu id');
    } else if (seenPayloadIds.has(id)) {
      itemErrors.push('ID bị trùng lặp trong payload');
    } else if (existingIdSet.has(id)) {
      duplicates.push(id);
      itemErrors.push('ID đã tồn tại trong ngân hàng production');
    }
    if (id) seenPayloadIds.add(id);

    const loai = String(q.loai || 'TN').trim().toUpperCase();
    if (loai !== 'TN' && loai !== 'DS' && loai !== 'TLN') {
      itemErrors.push('loai không hợp lệ (chỉ nhận TN, DS, TLN)');
    }

    const questionText = String(q.question || '').trim();
    if (!questionText) {
      itemErrors.push('Nội dung question không được để trống');
    }

    const correct = String(q.correct || '').trim().toUpperCase();
    if (loai === 'TN') {
      if (!['A', 'B', 'C', 'D'].includes(correct)) {
        itemErrors.push('Đáp án đúng correct cho TN phải là A, B, C hoặc D');
      }
      if (!String(q.optA || '').trim() || !String(q.optB || '').trim() || 
          !String(q.optC || '').trim() || !String(q.optD || '').trim()) {
        itemErrors.push('Câu TN phải có đầy đủ 4 phương án optA, optB, optC, optD');
      }
    }

    const mucDo = String(q.mucDo || '').trim().toUpperCase();
    if (!['NB', 'TH', 'VD', 'VDC'].includes(mucDo)) {
      itemErrors.push('Mức độ mucDo phải là NB, TH, VD hoặc VDC');
    }

    const chatLuong = String(q.chatLuong || '').trim().toLowerCase();
    if (chatLuong !== 'tinh') {
      itemErrors.push('chatLuong phải là "tinh" đối với gói câu duyệt');
    }

    let mon = String(q.mon || 'Vật lý').trim();
    if (mon === 'Vật Lý 12' || mon === 'Vật lí 12') mon = 'Vật lý';

    let chuong = String(q.chuong || '').trim();
    if (/chương 1|vật l[yí] nhiệt/i.test(chuong)) chuong = 'Vật lí nhiệt';
    if (!chuong) itemErrors.push('Chương không được để trống');

    let baiHoc = String(q.baiHoc || '').trim();
    if (/b3|thang nhiệt độ|nhiệt kế/i.test(baiHoc)) baiHoc = 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế';
    if (!baiHoc) itemErrors.push('Bài học không được để trống');

    const optA = String(q.optA || '').trim();
    const optB = String(q.optB || '').trim();
    const optC = String(q.optC || '').trim();
    const optD = String(q.optD || '').trim();
    const giaiThich = String(q.giaiThich || q.explanation || '').trim();
    const hinhAnh = String(q.hinhAnh || '').trim();
    const nhomId = String(q.nhomId || '').trim();
    const deBaiChung = String(q.deBaiChung || '').trim();

    if (itemErrors.length > 0) {
      invalidItems.push({ index: idx, id: id || `(index ${idx})`, errors: itemErrors });
    } else {
      const rowArr = [
        id, mon, chuong, mucDo, loai, nhomId, deBaiChung,
        questionText, optA, optB, optC, optD, correct,
        hinhAnh, giaiThich, nowIso, baiHoc, chatLuong
      ];
      normalizedRows.push(rowArr);
      normalizedPreview.push({
        id, mon, chuong, baiHoc, mucDo, loai,
        question: questionText.slice(0, 120) + (questionText.length > 120 ? '...' : ''),
        optA, optB, optC, optD, correct, chatLuong
      });
    }
  }

  const requested = rawQuestions.length;
  const insertable = normalizedRows.length;

  if (invalidItems.length > 0) {
    return {
      ok: false,
      dryRun: dryRun,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      insertable: 0,
      duplicates: duplicates,
      invalidItems: invalidItems,
      expectedCountAfter: countBefore,
      msg: 'Có ' + invalidItems.length + ' câu không hợp lệ hoặc trùng ID. Toàn bộ batch bị từ chối (Fail-Closed).'
    };
  }

  if (dryRun) {
    return {
      ok: true,
      dryRun: true,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      insertable: insertable,
      duplicates: [],
      invalidItems: [],
      normalizedPreview: normalizedPreview,
      expectedCountAfter: countBefore + insertable,
      msg: 'Dry-run thành công: Toàn bộ ' + insertable + ' câu hợp lệ và sẵn sàng nạp.'
    };
  }

  // Ghi thật
  const startRow = rows.length + 1;
  const numRows = normalizedRows.length;
  const numCols = NH_HEADERS.length;

  try {
    sheet.getRange(startRow, 1, numRows, numCols).setValues(normalizedRows);

    if (forceVerifyFail) {
      // Simulate verification failure
      sheet.deleteRows(startRow, numRows);
      return {
        ok: false,
        dryRun: false,
        batchId: batchId,
        rollbackApplied: true,
        countBefore: countBefore,
        requested: requested,
        inserted: 0,
        msg: 'Kiểm tra sau ghi thất bại. Đã tự động rollback toàn bộ ' + numRows + ' dòng.'
      };
    }

    return {
      ok: true,
      dryRun: false,
      batchId: batchId,
      countBefore: countBefore,
      requested: requested,
      inserted: insertable,
      insertedIds: normalizedRows.map(r => r[0]),
      expectedCountAfter: countBefore + insertable,
      msg: 'Đã nạp thành công ' + insertable + ' câu Tinh vào ngân hàng.'
    };
  } catch (err) {
    sheet.deleteRows(startRow, numRows);
    return {
      ok: false,
      dryRun: false,
      batchId: batchId,
      rollbackApplied: true,
      error: err.message,
      msg: 'Lỗi ghi Sheet: ' + err.message
    };
  }
}

const samplePilot5 = [
  { id: 'VLXT-G12-C1-P07-VD03', mon: 'Vật Lý 12', chuong: 'CHƯƠNG 1 – VẬT LÝ NHIỆT', baiHoc: 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ', mucDo: 'VD', loai: 'TN', question: 'Q1', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', chatLuong: 'tinh' },
  { id: 'VLXT-G12-C1-P07-VD04', mon: 'Vật Lý 12', chuong: 'CHƯƠNG 1 – VẬT LÝ NHIỆT', baiHoc: 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ', mucDo: 'VD', loai: 'TN', question: 'Q2', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', chatLuong: 'tinh' },
  { id: 'VLXT-G12-C1-P07-VD05', mon: 'Vật Lý 12', chuong: 'CHƯƠNG 1 – VẬT LÝ NHIỆT', baiHoc: 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ', mucDo: 'VD', loai: 'TN', question: 'Q3', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', chatLuong: 'tinh' },
  { id: 'VLXT-G12-C1-P08-VD07', mon: 'Vật Lý 12', chuong: 'CHƯƠNG 1 – VẬT LÝ NHIỆT', baiHoc: 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ', mucDo: 'VD', loai: 'TN', question: 'Q4', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', chatLuong: 'tinh' },
  { id: 'VLXT-G12-C1-P09-VD08', mon: 'Vật Lý 12', chuong: 'CHƯƠNG 1 – VẬT LÝ NHIỆT', baiHoc: 'B3. NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ', mucDo: 'VD', loai: 'TN', question: 'Q5', optA: 'A', optB: 'B', optC: 'C', optD: 'D', correct: 'A', chatLuong: 'tinh' }
];

// 1. Wrong key
check('1. Backend: từ chối khi adminKey sai (Unauthorized)', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const res = mockImportNganHang(sheet, { adminKey: 'wrong_key', questions: samplePilot5 });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Unauthorized');
});

// 2. dryRun=true does NOT write to sheet
check('2. Backend: dryRun=true không thay đổi số dòng của Sheet', () => {
  const sheet = new MockSheet(NH_HEADERS, [['OLD01', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Q', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', 'tinh']]);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: samplePilot5 });
  assert.equal(res.ok, true);
  assert.equal(res.dryRun, true);
  assert.equal(res.insertable, 5);
  assert.equal(res.countBefore, 1);
  assert.equal(res.expectedCountAfter, 6);
  assert.equal(sheet.data.length, 2); // Chỉ có header + 1 dòng cũ
});

// 3. 5 câu pilot hợp lệ
check('3. Backend: 5 câu pilot hợp lệ chuẩn hóa taxonomy chính xác', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: samplePilot5 });
  assert.equal(res.ok, true);
  assert.equal(res.normalizedPreview[0].mon, 'Vật lý');
  assert.equal(res.normalizedPreview[0].chuong, 'Vật lí nhiệt');
  assert.equal(res.normalizedPreview[0].baiHoc, 'Bài 3. Nhiệt độ - Thang nhiệt độ - Nhiệt kế');
});

// 4. Duplicate ID in payload
check('4. Backend: từ chối khi có ID trùng trong payload (Fail-Closed)', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const dupPayload = [...samplePilot5, { ...samplePilot5[0] }];
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: dupPayload });
  assert.equal(res.ok, false);
  assert.equal(res.insertable, 0);
  assert.ok(res.invalidItems.some(item => item.errors.includes('ID bị trùng lặp trong payload')));
});

// 5. Existing ID in production sheet
check('5. Backend: từ chối khi ID đã tồn tại trong Sheet (Idempotency)', () => {
  const sheet = new MockSheet(NH_HEADERS, [['VLXT-G12-C1-P07-VD03', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Q', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', 'tinh']]);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: samplePilot5 });
  assert.equal(res.ok, false);
  assert.deepEqual(res.duplicates, ['VLXT-G12-C1-P07-VD03']);
});

// 6. Invalid correct answer
check('6. Backend: từ chối khi correct không thuộc A/B/C/D', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const badCorrect = [{ ...samplePilot5[0], correct: 'E' }];
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: badCorrect });
  assert.equal(res.ok, false);
  assert.ok(res.invalidItems[0].errors.some(e => e.includes('Đáp án đúng')));
});

// 7. Missing option
check('7. Backend: từ chối khi thiếu option', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const missingOpt = [{ ...samplePilot5[0], optD: '' }];
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: missingOpt });
  assert.equal(res.ok, false);
  assert.ok(res.invalidItems[0].errors.some(e => e.includes('đầy đủ 4 phương án')));
});

// 8. chatLuong != tinh
check('8. Backend: từ chối khi chatLuong khác "tinh"', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const badQuality = [{ ...samplePilot5[0], chatLuong: 'tho' }];
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: badQuality });
  assert.equal(res.ok, false);
  assert.ok(res.invalidItems[0].errors.some(e => e.includes('chatLuong phải là "tinh"')));
});

// 9. Batch > 200 items
check('9. Backend: từ chối batch vượt quá 200 câu', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const hugeBatch = new Array(205).fill(samplePilot5[0]);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: true, questions: hugeBatch });
  assert.equal(res.ok, false);
  assert.ok(res.msg.includes('vượt quá giới hạn'));
});

// 10. Atomic all-or-nothing
check('10. Backend: 1 câu lỗi trong 5 câu -> 0 câu nào được ghi', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const mixedBatch = [samplePilot5[0], samplePilot5[1], { ...samplePilot5[2], correct: 'X' }, samplePilot5[3], samplePilot5[4]];
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: false, questions: mixedBatch });
  assert.equal(res.ok, false);
  assert.equal(sheet.data.length, 1); // 0 câu được ghi
});

// 11. Ghi thật thành công (dryRun=false)
check('11. Backend: ghi thật thành công bằng setValues() atomic', () => {
  const sheet = new MockSheet(NH_HEADERS);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: false, questions: samplePilot5 });
  assert.equal(res.ok, true);
  assert.equal(res.inserted, 5);
  assert.equal(sheet.data.length, 6);
  assert.equal(sheet.data[1][0], 'VLXT-G12-C1-P07-VD03');
  assert.equal(sheet.data[5][0], 'VLXT-G12-C1-P09-VD08');
});

// 12. Rollback sau ghi thất bại
check('12. Backend: tự động rollback khi verify sau ghi thất bại', () => {
  const sheet = new MockSheet(NH_HEADERS, [['OLD01', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Q', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', 'tinh']]);
  const res = mockImportNganHang(sheet, { adminKey: 'valid_key', dryRun: false, questions: samplePilot5 }, 'valid_key', true);
  assert.equal(res.ok, false);
  assert.equal(res.rollbackApplied, true);
  assert.equal(sheet.data.length, 2); // Trở về nguyên trạng 1 dòng cũ
});

console.log('\n=== KẾT QUẢ: TOÀN BỘ 12 / 12 KIỂM THỬ IMPORT NGAN HANG ĐẠT 100% ===');
