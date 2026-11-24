/* ═══ VLXT — Bridge hoat-dong.js sang vlxt-telemetry.js v2.0 ═══ */
(function (global) {
  'use strict';

  function loadTelemetry() {
    if (typeof document === 'undefined' || global.VLXT_TELEMETRY) return;
    if (document.querySelector('script[src*="vlxt-telemetry.js"]')) return;
    var s = document.createElement('script');
    s.src = 'vlxt-telemetry.js?v=20261124';
    s.defer = true;
    (document.head || document.body || document.documentElement).appendChild(s);
  }

  if (typeof global.vlxtLog !== 'function') {
    global.vlxtLog = function (hanhdong, chitiet) {
      if (global.VLXT_TELEMETRY && typeof global.VLXT_TELEMETRY.track === 'function') {
        global.VLXT_TELEMETRY.track('legacy_log', { target: String(hanhdong || ''), label: String(chitiet || '') });
      }
    };
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadTelemetry);
    } else {
      loadTelemetry();
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
