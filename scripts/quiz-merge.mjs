// Logic gop cau hoi luyen tap (BaiTapTracNghiem) theo bai hoc, tach rieng khoi
// sync-public-data.mjs de co the viet test khong can goi mang that (xem
// scripts/test-quiz-merge.mjs).
//
// Boi canh: moi bai hoc co the co cau hoi luu theo 2 kieu key trong sheet
// BaiTapTracNghiem:
//   - "stable": row.baiKey = MaBai cua bai hoc (ma dinh danh on dinh, khong doi
//     khi doi ten khoa/chuong/bai).
//   - "legacy": row.baiKey = "KhoaHoc|||Chuong|||TenBai" (chuoi ghep ten cu,
//     truoc khi co MaBai).
// Khi 1 bai da duoc migrate sang MaBai, cac dong legacy cu (neu con sot) phai
// duoc BO QUA de khong cong don thanh trung cau (vd 30 stable + 20 legacy = 50).
// NHUNG "co it nhat 1 dong stable" khong duoc coi la migrate xong: neu stable
// it hon legacy nhieu (vd stable=1, legacy=20) thi rat co the migrate moi lam
// dang do/loi, khong duoc am tham chi con lai 1 cau - phai canh bao va fallback
// ve tap lon hon (an toan hon cho hoc sinh) thay vi lam mat du lieu.

export function normalizeToken(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

export function normalizeLegacyKey(khoa, chuong, tenBai) {
  return [khoa, chuong, tenBai].map(normalizeToken).join('|');
}

/**
 * @param {Array<object>} lessons Danh sach bai hoc (tu sheet BaiHoc), can field MaBai/KhoaHoc/Chuong/TenBai.
 * @param {Array<object>} quizRows Danh sach dong cau hoi (tu sheet BaiTapTracNghiem), can field baiKey.
 * @returns {{ grouped: Map<string, object[]>, warnings: Array<object> }}
 */
export function buildQuizGrouping(lessons, quizRows) {
  const warnings = [];
  const stableLessonKeys = new Set();
  const lessonAliases = new Map(); // legacyKey(normalized) -> stableKey

  for (const lesson of lessons || []) {
    const stableKey = String(lesson?.MaBai || '').trim();
    if (!stableKey) continue;
    stableLessonKeys.add(stableKey);
    const legacyKey = normalizeLegacyKey(lesson.KhoaHoc, lesson.Chuong, lesson.TenBai);
    if (!legacyKey || legacyKey === '||') continue;
    const existing = lessonAliases.get(legacyKey);
    if (existing && existing !== stableKey) {
      // Hai bai hoc khac nhau nhung ten chuan hoa giong het nhau -> khong biet
      // dong quiz legacy nao thuoc ve bai nao. Giu anh xa DAU TIEN, canh bao de
      // con nguoi kiem tra thay vi am tham ghi de.
      warnings.push({
        type: 'alias-collision',
        legacyKey,
        keptStableKey: existing,
        ignoredStableKey: stableKey
      });
      continue;
    }
    lessonAliases.set(legacyKey, stableKey);
  }

  const stableRowsByKey = new Map();
  const legacyRowsByKey = new Map();
  const otherRowsByKey = new Map();

  for (const row of quizRows || []) {
    const rawKey = String(row?.baiKey || '').trim();
    if (!rawKey) continue;
    if (stableLessonKeys.has(rawKey)) {
      if (!stableRowsByKey.has(rawKey)) stableRowsByKey.set(rawKey, []);
      stableRowsByKey.get(rawKey).push(row);
      continue;
    }
    if (rawKey.includes('|||')) {
      const legacyKey = rawKey.split('|||').map(normalizeToken).join('|');
      const mappedKey = lessonAliases.get(legacyKey);
      const bucketKey = mappedKey || rawKey;
      if (!legacyRowsByKey.has(bucketKey)) legacyRowsByKey.set(bucketKey, []);
      legacyRowsByKey.get(bucketKey).push(row);
      continue;
    }
    // Key la khong ro dang (khong phai MaBai da biet, khong phai chuoi legacy
    // co "|||") - giu nguyen rieng, khong bo mat cau hoi.
    if (!otherRowsByKey.has(rawKey)) otherRowsByKey.set(rawKey, []);
    otherRowsByKey.get(rawKey).push(row);
  }

  const allKeys = new Set([
    ...stableRowsByKey.keys(),
    ...legacyRowsByKey.keys(),
    ...otherRowsByKey.keys()
  ]);

  const grouped = new Map();
  for (const key of allKeys) {
    const stableRows = stableRowsByKey.get(key) || [];
    const legacyRows = legacyRowsByKey.get(key) || [];
    const otherRows = otherRowsByKey.get(key) || [];

    let rows;
    if (stableRows.length && legacyRows.length) {
      if (stableRows.length >= legacyRows.length) {
        // Bo stable duoc coi la day du (>= so luong legacy) -> dung stable,
        // bo legacy de khong cong don trung cau.
        rows = stableRows;
      } else {
        // Stable it hon legacy ro ret -> nghi ngo migrate dang do (vd stable=1,
        // legacy=20). KHONG am tham chi con vai cau - canh bao va fallback ve
        // legacy (tap lon hon, an toan hon cho hoc sinh dang hoc).
        warnings.push({
          type: 'migration-in-progress',
          key,
          stableCount: stableRows.length,
          legacyCount: legacyRows.length
        });
        rows = legacyRows;
      }
    } else if (stableRows.length) {
      rows = stableRows;
    } else {
      rows = legacyRows;
    }
    rows = rows.concat(otherRows);

    // Phat hien ID cau hoi trung lap trong cung 1 bai (giu dong dau tien, bao loi).
    const seenIds = new Set();
    const deduped = [];
    for (const row of rows) {
      const id = row && row.id != null ? String(row.id).trim() : '';
      if (id) {
        if (seenIds.has(id)) {
          warnings.push({ type: 'duplicate-id', key, id });
          continue;
        }
        seenIds.add(id);
      }
      deduped.push(row);
    }
    grouped.set(key, deduped);
  }

  return { grouped, warnings };
}
