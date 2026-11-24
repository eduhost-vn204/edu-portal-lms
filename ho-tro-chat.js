/* ═══════════════════════════════════════════════════════════
   BONG BÓNG CHAT HỖ TRỢ — Vật Lý Xuân Trường v2.0 (Bridge)
   Đã hợp nhất vào Trung tâm Góp ý · Báo lỗi · Liên hệ Zalo (`vlxt-feedback-hub.js`)
   để tránh trùng nút trên các trang cũ và ưu tiên chuyển tiếp sang Zalo Thầy.
═══════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function loadHubScript() {
    if (typeof document === 'undefined' || typeof global.vlxtOpenFeedbackHub === 'function') return;
    if (document.querySelector('script[src*="vlxt-feedback-hub.js"]')) return;
    var s = document.createElement('script');
    s.src = 'vlxt-feedback-hub.js?v=20261124';
    s.defer = true;
    (document.head || document.body || document.documentElement).appendChild(s);
  }

  if (typeof global.vlxtToggleChat !== 'function') {
    global.vlxtToggleChat = function () {
      if (typeof global.vlxtOpenFeedbackHub === 'function') {
        global.vlxtOpenFeedbackHub('contact');
      } else {
        window.open('https://zalo.me/0964885920', '_blank', 'noopener');
      }
    };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadHubScript);
    } else {
      loadHubScript();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
