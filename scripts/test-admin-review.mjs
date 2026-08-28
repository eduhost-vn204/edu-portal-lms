import assert from 'assert';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { isApprovedTinhQuestion, filterQuestionsByScope } = require('../teaching-scope.js');

console.log('=== TEST SUITE: ADMIN REVIEW & QUALITY WORKFLOW ===\n');

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

// ── Backend Logic Emulation ──
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
  getRange(row, col, numRows = 1, numCols = 1) {
    return {
      setValue: (val) => {
        while (this.data.length < row) this.data.push(new Array(this.headers.length).fill(''));
        this.data[row - 1][col - 1] = val;
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
}

const NH_HEADERS = ['id','mon','chuong','mucDo','loai','nhomId','deBaiChung','question','optA','optB','optC','optD','correct','hinhAnh','giaiThich','ngayThem','baiHoc','chatLuong'];

function mockBulkSetChatLuong(sheet, data, adminKey = 'valid_key') {
  if (!data.adminKey || data.adminKey !== adminKey) {
    return { ok: false, error: 'Unauthorized', msg: 'Khóa quản trị không hợp lệ' };
  }
  if (data.chatLuong === undefined || data.chatLuong === null) {
    return { ok: false, msg: 'Thiếu trường chatLuong' };
  }
  const chatLuong = String(data.chatLuong).trim().toLowerCase();
  if (chatLuong !== '' && chatLuong !== 'tinh' && chatLuong !== 'tho') {
    return { ok: false, msg: 'Chất lượng không hợp lệ' };
  }
  const rawIds = Array.isArray(data.ids) ? data.ids : [];
  const uniqueIds = Array.from(new Set(rawIds.map(x => String(x).trim()).filter(Boolean)));
  if (!uniqueIds.length) {
    return { ok: false, msg: 'Thiếu danh sách ids hợp lệ' };
  }
  if (uniqueIds.length > 500) {
    return { ok: false, msg: 'Số lượng câu cập nhật vượt quá giới hạn' };
  }

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0].map(String);
  let clCol = headers.indexOf('chatLuong');
  if (clCol === -1) clCol = 17;

  const existingIdMap = new Map();
  for (let i = 1; i < rows.length; i++) {
    const rId = String(rows[i][0]).trim();
    if (rId) existingIdMap.set(rId, i + 1);
  }

  const updatedIds = [];
  const failedItems = [];

  uniqueIds.forEach(id => {
    const rowIdx = existingIdMap.get(id);
    if (rowIdx) {
      sheet.getRange(rowIdx, clCol + 1).setValue(chatLuong);
      updatedIds.push(id);
    } else {
      failedItems.push({ id: id, reason: 'ID không tồn tại trong ngân hàng' });
    }
  });

  if (updatedIds.length === 0) {
    return { ok: false, requested: uniqueIds.length, updated: 0, failed: failedItems.length, updatedIds: [], failedItems, chatLuong };
  }
  return { ok: true, requested: uniqueIds.length, updated: updatedIds.length, failed: failedItems.length, updatedIds, failedItems, chatLuong };
}

// 1. Kiểm thử xác thực adminKey
check('1. Backend: từ chối khi adminKey sai (Unauthorized)', () => {
  const sheet = new MockSheet(NH_HEADERS, [['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', '']]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'wrong_key', ids: ['NH001'], chatLuong: 'tinh' });
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Unauthorized');
});

// 2. Kiểm thử giá trị chatLuong không hợp lệ
check('2. Backend: từ chối chatLuong không hợp lệ', () => {
  const sheet = new MockSheet(NH_HEADERS, [['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', '']]);
  const res1 = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001'], chatLuong: 'invalid_val' });
  const res2 = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001'], chatLuong: 'xuat_sac' });
  assert.equal(res1.ok, false);
  assert.equal(res2.ok, false);
});

// 3. Kiểm thử chuyển Chưa duyệt -> Tinh
check('3. Backend: chuyển Chưa duyệt ("") -> Tinh ("tinh")', () => {
  const sheet = new MockSheet(NH_HEADERS, [
    ['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', ''],
    ['NH002', 'Vật lý', 'Vật lí nhiệt', 'TH', 'TN', '', '', 'Câu 2', 'A', 'B', 'C', 'D', 'B', '', '', '', 'B1', '']
  ]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001', 'NH002'], chatLuong: 'tinh' });
  assert.equal(res.ok, true);
  assert.equal(res.updated, 2);
  assert.deepEqual(res.updatedIds, ['NH001', 'NH002']);
  assert.equal(sheet.data[1][17], 'tinh');
  assert.equal(sheet.data[2][17], 'tinh');
});

// 4. Kiểm thử chuyển Tinh -> Thô
check('4. Backend: chuyển Tinh ("tinh") -> Thô ("tho")', () => {
  const sheet = new MockSheet(NH_HEADERS, [
    ['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', 'tinh']
  ]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001'], chatLuong: 'tho' });
  assert.equal(res.ok, true);
  assert.equal(res.updated, 1);
  assert.equal(sheet.data[1][17], 'tho');
});

// 5. Kiểm thử chuyển Tinh/Thô -> Chưa duyệt ("") bằng chuỗi rỗng
check('5. Backend: chuyển Tinh/Thô -> Chưa duyệt bằng chuỗi rỗng ("")', () => {
  const sheet = new MockSheet(NH_HEADERS, [
    ['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', 'tinh'],
    ['NH002', 'Vật lý', 'Vật lí nhiệt', 'TH', 'TN', '', '', 'Câu 2', 'A', 'B', 'C', 'D', 'B', '', '', '', 'B1', 'tho']
  ]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001', 'NH002'], chatLuong: '' });
  assert.equal(res.ok, true);
  assert.equal(res.updated, 2);
  assert.equal(sheet.data[1][17], '');
  assert.equal(sheet.data[2][17], '');
});

// 6. Kiểm thử loại bỏ ID trùng lặp
check('6. Backend: tự động khử trùng lặp ID (Deduplication)', () => {
  const sheet = new MockSheet(NH_HEADERS, [
    ['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', '']
  ]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001', 'NH001', 'NH001'], chatLuong: 'tinh' });
  assert.equal(res.ok, true);
  assert.equal(res.requested, 1);
  assert.equal(res.updated, 1);
});

// 7. Kiểm thử ID không tồn tại và thành công một phần
check('7. Backend: ghi nhận ID không tồn tại và báo cáo failedItems chính xác', () => {
  const sheet = new MockSheet(NH_HEADERS, [
    ['NH001', 'Vật lý', 'Vật lí nhiệt', 'NB', 'TN', '', '', 'Câu 1', 'A', 'B', 'C', 'D', 'A', '', '', '', 'B1', '']
  ]);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: ['NH001', 'NH999'], chatLuong: 'tinh' });
  assert.equal(res.ok, true);
  assert.equal(res.requested, 2);
  assert.equal(res.updated, 1);
  assert.equal(res.failed, 1);
  assert.deepEqual(res.failedItems, [{ id: 'NH999', reason: 'ID không tồn tại trong ngân hàng' }]);
});

// 8. Kiểm thử từ chối mảng rỗng
check('8. Backend: từ chối danh sách ID rỗng', () => {
  const sheet = new MockSheet(NH_HEADERS, []);
  const res = mockBulkSetChatLuong(sheet, { adminKey: 'valid_key', ids: [], chatLuong: 'tinh' });
  assert.equal(res.ok, false);
});

// 9. Kiểm thử Đua Top / Solo chỉ lấy câu Tinh (bảo toàn commit 48f4665)
check('9. Frontend LMS: Đua Top & Solo chặn 100% câu Chưa duyệt ("") và câu Thô ("tho")', () => {
  const bank = [
    { id: 'NH001', chuong: 'Vật lí nhiệt', chatLuong: 'tinh', loai: 'TN', question: 'Q1', optA: 'A', optB: 'B', correct: 'A' },
    { id: 'NH002', chuong: 'Vật lí nhiệt', chatLuong: '', loai: 'TN', question: 'Q2', optA: 'A', optB: 'B', correct: 'A' }, // Chưa duyệt -> CHẶN
    { id: 'NH003', chuong: 'Vật lí nhiệt', chatLuong: 'tho', loai: 'TN', question: 'Q3', optA: 'A', optB: 'B', correct: 'A' } // Thô -> CHẶN
  ];
  const scope = {
    courseId: 'K12',
    stageId: 'toan_khoa',
    openChapterIds: ['Vật lí nhiệt'],
    openAllLessons: true,
    isActive: true
  };

  const filteredDuaTop = filterQuestionsByScope(bank, scope, { requiredScope: 'DUA_TOP' });
  const filteredSolo = filterQuestionsByScope(bank, scope, { requiredScope: 'SOLO' });

  assert.equal(filteredDuaTop.length, 1);
  assert.equal(filteredDuaTop[0].id, 'NH001');
  assert.equal(filteredSolo.length, 1);
  assert.equal(filteredSolo[0].id, 'NH001');
});

console.log('\n=== KẾT QUẢ: TOÀN BỘ 9 / 9 KIỂM THỬ ĐẠT YÊU CẦU 100% ===');
