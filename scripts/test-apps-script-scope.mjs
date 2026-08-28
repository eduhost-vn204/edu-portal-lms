import assert from 'node:assert/strict';

let passed = 0;
function check(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`OK   - ${name}`);
  } catch (e) {
    console.error(`FAIL - ${name}`);
    console.error('     ', e.message);
    process.exitCode = 1;
  }
}

console.log('=== TEST SUITE: APPS SCRIPT TEACHING SCOPE LOGIC EMULATION ===\n');

// Giả lập Sheets database và optimistic revision control
class MockSheet {
  constructor(headers = [], initialRows = []) {
    this.headers = [...headers];
    this.rows = initialRows.map(r => [...r]);
  }
  getLastRow() { return this.rows.length + 1; }
  getLastColumn() { return this.headers.length; }
  getRange(row, col, numRows = 1, numCols = 1) {
    const self = this;
    return {
      getValues() {
        const res = [];
        for (let r = 0; r < numRows; r++) {
          const rowIndex = row + r; // 1-based row index
          if (rowIndex === 1) {
            res.push(self.headers.slice(col - 1, col - 1 + numCols));
          } else {
            const dataRow = self.rows[rowIndex - 2] || [];
            const slice = [];
            for (let c = 0; c < numCols; c++) {
              slice.push(dataRow[col - 1 + c] !== undefined ? dataRow[col - 1 + c] : '');
            }
            res.push(slice);
          }
        }
        return res;
      },
      setValues(values) {
        for (let r = 0; r < values.length; r++) {
          const rowIndex = row + r; // 1-based
          if (rowIndex === 1) {
            for (let c = 0; c < values[r].length; c++) self.headers[col - 1 + c] = values[r][c];
          } else {
            const dataIdx = rowIndex - 2;
            while (self.rows.length <= dataIdx) self.rows.push([]);
            for (let c = 0; c < values[r].length; c++) self.rows[dataIdx][col - 1 + c] = values[r][c];
          }
        }
      }
    };
  }
  appendRow(rowValues) {
    if (this.headers.length === 0) {
      this.headers = [...rowValues];
    } else {
      this.rows.push([...rowValues]);
    }
  }
}

class MockSpreadsheet {
  constructor() {
    this.sheets = {};
  }
  getSheetByName(name) {
    return this.sheets[name] || null;
  }
  insertSheet(name) {
    const s = new MockSheet([]);
    this.sheets[name] = s;
    return s;
  }
}

const TS_HEADERS = ['courseId', 'stageId', 'openChapterIds', 'activeLessonIds', 'openAllLessons', 'validFrom', 'validTo', 'isActive', 'updatedAt', 'updatedBy', 'revision'];
const ADMIN_HASH = 'mock_admin_hash_123';

function mockCheckAdminKey(key) {
  return key === ADMIN_HASH;
}

function mockGetTeachingScope(ss, e) {
  const sheet = ss.getSheetByName('TeachingScope');
  if (!sheet) return { ok: true, data: [] };
  const rows = sheet.getRange(2, 1, Math.max(1, sheet.rows.length), TS_HEADERS.length).getValues();
  const isAdmin = mockCheckAdminKey(e && e.parameter && e.parameter.adminKey);
  const now = (e && e.parameter && e.parameter.nowMs) ? Number(e.parameter.nowMs) : Date.now();
  
  const list = [];
  rows.forEach(r => {
    if (!r[0]) return;
    let openCh = [];
    let activeLes = {};
    let openAll = false;
    try { openCh = JSON.parse(r[2] || '[]'); } catch(_) { openCh = []; }
    try { activeLes = JSON.parse(r[3] || '{}'); } catch(_) { activeLes = {}; }
    try {
      if (r[4] === 'true' || r[4] === true) openAll = true;
      else if (r[4]) openAll = JSON.parse(r[4]);
    } catch(_) { openAll = false; }

    const item = {
      courseId: r[0],
      stageId: r[1] || 'toan_khoa',
      openChapterIds: openCh,
      activeLessonIds: activeLes,
      openAllLessons: openAll,
      validFrom: r[5] || '',
      validTo: r[6] || '',
      isActive: r[7] === true || r[7] === 'true',
      updatedAt: r[8] || '',
      updatedBy: isAdmin ? (r[9] || '') : undefined,
      revision: Number(r[10] || 1)
    };

    if (!isAdmin) {
      if (!item.isActive) return;
      if (item.validFrom && now < Date.parse(item.validFrom)) return;
      if (item.validTo && now > Date.parse(item.validTo)) return;
    }
    list.push(item);
  });
  return { ok: true, data: list };
}

function mockSaveTeachingScope(ss, data) {
  if (!mockCheckAdminKey(data.adminKey)) {
    return { ok: false, error: 'Unauthorized', msg: 'adminKey không hợp lệ' };
  }
  let sheet = ss.getSheetByName('TeachingScope');
  if (!sheet) {
    sheet = ss.insertSheet('TeachingScope');
    sheet.appendRow(TS_HEADERS);
  }

  const courseId = (data.courseId || '').trim();
  const stageId = (data.stageId || 'toan_khoa').trim();
  if (!courseId) return { ok: false, error: 'Thiếu courseId' };

  const rows = sheet.rows;
  let targetRowIdx = -1;
  let currentRev = 0;

  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0] || '').trim() === courseId && String(rows[i][1] || 'toan_khoa').trim() === stageId) {
      targetRowIdx = i;
      currentRev = Number(rows[i][10] || 1);
      break;
    }
  }

  // Optimistic revision locking
  if (data.expectedRevision !== undefined && data.expectedRevision !== null) {
    const expected = Number(data.expectedRevision);
    if (targetRowIdx !== -1 && expected !== 0 && currentRev !== expected) {
      return {
        ok: false,
        error: 'Conflict',
        msg: `Dữ liệu đã bị thay đổi bởi người khác (current revision: ${currentRev}, expected: ${expected})`
      };
    }
  }

  const nextRev = targetRowIdx !== -1 ? currentRev + 1 : 1;
  const rowData = [
    courseId,
    stageId,
    JSON.stringify(data.openChapterIds || []),
    JSON.stringify(data.activeLessonIds || {}),
    JSON.stringify(data.openAllLessons !== undefined ? data.openAllLessons : false),
    data.validFrom || '',
    data.validTo || '',
    data.isActive ? 'true' : 'false',
    new Date().toISOString(),
    'admin',
    nextRev
  ];

  if (targetRowIdx !== -1) {
    sheet.getRange(targetRowIdx + 2, 1, 1, TS_HEADERS.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  return {
    ok: true,
    revision: nextRev,
    scope: {
      courseId,
      stageId,
      openChapterIds: data.openChapterIds || [],
      activeLessonIds: data.activeLessonIds || {},
      openAllLessons: data.openAllLessons || false,
      validFrom: data.validFrom || '',
      validTo: data.validTo || '',
      isActive: Boolean(data.isActive),
      revision: nextRev
    }
  };
}

// ── TEST CASES ──

const mockSS = new MockSpreadsheet();

check('1. Backend: từ chối ghi khi adminKey sai (Unauthorized)', () => {
  const res = mockSaveTeachingScope(mockSS, {
    adminKey: 'wrong_key',
    courseId: 'K1',
    stageId: 'toan_khoa'
  });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Unauthorized');
});

check('2. Backend: ghi cấu hình ban đầu tạo sheet TeachingScope với revision 1 và openAllLessons', () => {
  const ss = new MockSpreadsheet();
  const res = mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1',
    stageId: 'GD1',
    openChapterIds: ['CHƯƠNG 1'],
    activeLessonIds: { 'CHƯƠNG 1': ['B1', 'B2'] },
    openAllLessons: { 'CHƯƠNG 1': true },
    isActive: true,
    expectedRevision: 0
  });
  assert.equal(res.ok, true);
  assert.equal(res.revision, 1);
  assert.equal(res.scope.openAllLessons['CHƯƠNG 1'], true);

  const getRes = mockGetTeachingScope(ss, { parameter: { adminKey: ADMIN_HASH } });
  assert.equal(getRes.ok, true);
  assert.equal(getRes.data.length, 1);
  assert.equal(getRes.data[0].courseId, 'CHUYÊN ĐỀ LÝ THUYẾT GĐ1');
  assert.deepEqual(getRes.data[0].openChapterIds, ['CHƯƠNG 1']);
  assert.equal(getRes.data[0].revision, 1);
});

check('3. Backend: route public không tiết lộ updatedBy và lọc bỏ scope inactive / hết hạn', () => {
  const ss = new MockSpreadsheet();
  // Scope 1: Active
  mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'KHOA_ACTIVE',
    stageId: 'toan_khoa',
    isActive: true
  });
  // Scope 2: Inactive
  mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'KHOA_INACTIVE',
    stageId: 'toan_khoa',
    isActive: false
  });

  // Public GET (không có adminKey)
  const pubRes = mockGetTeachingScope(ss, {});
  assert.equal(pubRes.ok, true);
  assert.equal(pubRes.data.length, 1); // chỉ có 1 scope active
  assert.equal(pubRes.data[0].courseId, 'KHOA_ACTIVE');
  assert.equal(pubRes.data[0].updatedBy, undefined); // Không tiết lộ updatedBy

  // Admin GET (có adminKey)
  const admRes = mockGetTeachingScope(ss, { parameter: { adminKey: ADMIN_HASH } });
  assert.equal(admRes.ok, true);
  assert.equal(admRes.data.length, 2); // Thấy cả 2 scopes
  assert.equal(admRes.data[0].updatedBy, 'admin'); // Admin thấy updatedBy
});

check('4. Backend: phát hiện xung đột và từ chối khi expectedRevision bị lệch (Optimistic Lock)', () => {
  const ss = new MockSpreadsheet();
  mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'Lý 12',
    stageId: 'toan_khoa',
    openChapterIds: ['CHƯƠNG 1'],
    isActive: true,
    expectedRevision: 0
  });

  // Client khác đã lưu lên revision 2
  mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'Lý 12',
    stageId: 'toan_khoa',
    openChapterIds: ['CHƯƠNG 1', 'CHƯƠNG 2'],
    isActive: true,
    expectedRevision: 1
  });

  // Client cũ vẫn gửi expectedRevision = 1 -> Phải bị từ chối với mã Conflict
  const conflictRes = mockSaveTeachingScope(ss, {
    adminKey: ADMIN_HASH,
    courseId: 'Lý 12',
    stageId: 'toan_khoa',
    openChapterIds: ['CHƯƠNG 3'],
    isActive: true,
    expectedRevision: 1
  });

  assert.equal(conflictRes.ok, false);
  assert.equal(conflictRes.error, 'Conflict');
});

console.log(`\n=== KẾT QUẢ: ${passed} / 4 KIỂM THỬ BACKEND ĐẠT YÊU CẦU ===\n`);
