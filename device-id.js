/* ═══════════════════════════════════════════════════════════
   DEVICE FINGERPRINT — Vật Lý Xuân Trường  v1.0
   Nhận diện thiết bị/trình duyệt (best-effort, không dùng thư
   viện ngoài) để:
   1) Chống học sinh tạo nhiều tài khoản học thử trên cùng máy.
   2) Làm định danh khách (guest) cho khung chat hỗ trợ khi
      chưa đăng nhập.
   Lưu ý thật với thầy: đây là fingerprint phía trình duyệt,
   không phải điều tra phần cứng thật — đổi trình duyệt khác
   (Chrome ↔ Firefox) trên CÙNG máy vẫn ra mã khác nhau. Chặn
   được đa số trường hợp học sinh xoá cache/dùng ẩn danh để lách
   học thử, không phải giải pháp 100% tuyệt đối.
═══════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function canvasSig() {
    try {
      var c = document.createElement('canvas');
      c.width = 220; c.height = 40;
      var ctx = c.getContext('2d');
      if (!ctx) return '';
      ctx.textBaseline = 'top';
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = '#0b84f3';
      ctx.fillRect(0, 0, 220, 40);
      ctx.fillStyle = '#ff00aa';
      ctx.fillText('VLXT-fp 0123 ▲■● Đề', 2, 2);
      ctx.strokeStyle = 'rgba(0,240,255,0.6)';
      ctx.beginPath(); ctx.arc(180, 20, 14, 0, Math.PI * 2); ctx.stroke();
      return c.toDataURL();
    } catch (e) { return ''; }
  }

  function glSig() {
    try {
      var c = document.createElement('canvas');
      var gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) return '';
      var dbg = gl.getExtension('WEBGL_debug_renderer_info');
      var vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
      var renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      return String(vendor) + '|' + String(renderer);
    } catch (e) { return ''; }
  }

  function baseSig() {
    try {
      var n = navigator, s = screen;
      return [
        n.userAgent || '', n.language || '', (n.languages || []).join(','),
        n.hardwareConcurrency || '', n.deviceMemory || '', n.platform || '',
        (s.width || 0) + 'x' + (s.height || 0) + 'x' + (s.colorDepth || 0),
        (Intl.DateTimeFormat().resolvedOptions().timeZone || ''),
        (n.maxTouchPoints || 0)
      ].join('#');
    } catch (e) { return String(navigator.userAgent || ''); }
  }

  async function sha256Hex(str) {
    try {
      if (global.crypto && global.crypto.subtle) {
        var buf = await global.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      }
    } catch (e) { /* fall through */ }
    // Fallback nếu trình duyệt không hỗ trợ crypto.subtle (hiếm) — vẫn đủ để phân biệt thiết bị
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return 'fb' + Math.abs(h).toString(16);
  }

  var _cache = null;
  global.vlxtDeviceFingerprint = function () {
    if (_cache) return Promise.resolve(_cache);
    var raw = baseSig() + '#' + canvasSig() + '#' + glSig();
    return sha256Hex(raw).then(function (hex) { _cache = hex; return hex; });
  };
})(window);
