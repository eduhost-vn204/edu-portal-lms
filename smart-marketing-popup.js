/**
 * SMART MARKETING POPUP SYSTEM — VẬT LÝ XUÂN TRƯỜNG
 * Thiết kế: Glassmorphism trong suốt màu xanh vũ trụ (Deep Space Transparent),
 * kích thước rộng rãi 680px, chuẩn EdTech quốc tế phẳng sắc nét (TUYỆT ĐỐI CẤM AI GLOW).
 * Con trỏ tàu vũ trụ (#quantum-cursor-ring) bay lướt trên bề mặt với z-index: 2147483647.
 * Kịch bản 2 tầng thông minh:
 *   - Pop-up 1: Test Điểm Thi THPT & Quét Lỗ Hổng Kiến Thức Vật Lý 12.
 *   - Pop-up 2: Vào Học Thử Miễn Phí (Chương 1 & Chương 2) khi học sinh bấm [×] tắt Pop-up 1 hoặc đã có kết quả test.
 */

(function () {
  'use strict';

  var POPUP_INITIAL_DELAY_MS = 15000;

  // Lấy thông tin user hiện tại
  function getCurrentUser() {
    try {
      var u = localStorage.getItem('vlxt_user_v2') || localStorage.getItem('vlxt_auth_user');
      if (u) return JSON.parse(u);
    } catch (e) {}
    return null;
  }

  // Kiểm tra kết quả test thực tế: chỉ coi là đã làm bài test nếu trong localStorage thực sự có dữ liệu kết quả đã nộp
  function hasActualTestResult() {
    try {
      var raw = localStorage.getItem('vlxt_dgnl_latest_result');
      if (raw) {
        var data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  // Key sessionStorage quản lý phiên (đổi sang v3 để tránh kẹt cờ phiên cũ)
  function getSessionKey() {
    var u = getCurrentUser();
    var uid = (u && (u.username || u.sdt || u.id)) ? (u.username || u.sdt || u.id) : 'guest';
    return (uid === 'guest') ? 'vlxt_popup_v3_guest' : ('vlxt_popup_v3_' + uid);
  }

  function getSessionState() {
    try {
      var raw = sessionStorage.getItem(getSessionKey());
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      p1Dismissed: false,
      p2Dismissed: false,
      clickedGoTest: false,
      clickedGoTrial: false
    };
  }

  function saveSessionState(st) {
    try {
      sessionStorage.setItem(getSessionKey(), JSON.stringify(st));
    } catch (e) {}
  }

  // Đảm bảo con trỏ tàu vũ trụ luôn nằm trên cùng tuyệt đối của mọi phần tử
  function liftRocketCursorToTop() {
    var cursorRing = document.getElementById('quantum-cursor-ring');
    if (cursorRing && cursorRing.parentNode !== document.body) {
      document.body.appendChild(cursorRing);
    }
    if (cursorRing) {
      cursorRing.style.zIndex = '2147483647';
      cursorRing.style.pointerEvents = 'none';
    }
  }

  // Kích hoạt hiệu ứng hover mở rộng và tăng lửa đẩy cho con tàu vũ trụ
  function attachCursorHover(el) {
    if (!el) return;
    el.addEventListener('mouseenter', function () {
      var ring = document.getElementById('quantum-cursor-ring');
      if (ring) ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', function () {
      var ring = document.getElementById('quantum-cursor-ring');
      if (ring) ring.classList.remove('cursor-hover');
    });
  }

  // Tiêm CSS chuẩn EdTech — Tuyệt đối cấm hiệu ứng AI Glow theo AGENTS.md
  function injectPopupStyles() {
    if (document.getElementById('vlxt-smart-popup-style')) return;
    var style = document.createElement('style');
    style.id = 'vlxt-smart-popup-style';
    style.innerHTML = `
      /* Con trỏ chuột tàu vũ trụ luôn nổi lên trên cùng của popup */
      #quantum-cursor-ring {
        z-index: 2147483647 !important;
        pointer-events: none !important;
      }

      /* Ẩn con trỏ chuột mặc định trên desktop để hiện tàu vũ trụ */
      @media (hover: hover) and (pointer: fine) {
        .vlxt-smart-overlay,
        .vlxt-smart-overlay *,
        .vlxt-smart-card,
        .vlxt-smart-card *,
        .vlxt-smart-close,
        .vlxt-smart-btn-action {
          cursor: none !important;
        }
      }

      /* Lớp nền mờ trong suốt (nhìn xuyên qua vũ trụ 3D Three.js phía sau) */
      .vlxt-smart-overlay {
        position: fixed;
        inset: 0;
        z-index: 99990;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(3, 8, 22, 0.56);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        padding: 20px 16px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .vlxt-smart-overlay.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Thẻ Card Gọn Đẹp Sắc Nét (460px) - Ít chữ, điểm nhấn trực quan, Zero AI Glow */
      .vlxt-smart-card {
        position: relative;
        width: 100%;
        max-width: 460px;
        background: linear-gradient(180deg, rgba(12, 26, 56, 0.90) 0%, rgba(7, 17, 38, 0.94) 100%);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(56, 189, 248, 0.38);
        border-radius: 22px;
        padding: 26px 24px 22px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.72);
        color: #f1f5f9;
        text-align: center;
        transform: scale(0.95) translateY(12px);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }
      .vlxt-smart-card.is-gold {
        border-color: rgba(251, 191, 36, 0.42);
      }
      .vlxt-smart-overlay.is-active .vlxt-smart-card {
        transform: scale(1) translateY(0);
      }

      .vlxt-smart-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.72);
        border: 1px solid rgba(148, 163, 184, 0.32);
        color: #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        line-height: 1;
        transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
      }
      .vlxt-smart-close:hover {
        background: #ef4444;
        border-color: #ef4444;
        color: #ffffff;
        transform: rotate(90deg);
      }

      .vlxt-smart-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-bottom: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      }
      .vlxt-smart-badge.cyan {
        background: rgba(14, 116, 144, 0.28);
        border: 1px solid rgba(56, 189, 248, 0.42);
        color: #7dd3fc;
      }
      .vlxt-smart-badge.gold {
        background: rgba(180, 83, 9, 0.28);
        border: 1px solid rgba(251, 191, 36, 0.45);
        color: #fde68a;
      }

      .vlxt-smart-title {
        font-size: clamp(19px, 3.6vw, 23px);
        font-weight: 800;
        line-height: 1.28;
        margin-bottom: 8px;
        color: #ffffff;
        letter-spacing: -0.015em;
        text-shadow: none !important;
      }
      .vlxt-smart-desc {
        font-size: 13.5px;
        color: #cbd5e1;
        line-height: 1.5;
        margin: 0 auto 16px;
        max-width: 390px;
      }

      /* 3 Ô điểm nhấn ngắn gọn trực quan thay cho danh sách dài dòng */
      .vlxt-smart-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
      }
      .vlxt-smart-metric {
        background: rgba(15, 23, 42, 0.62);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 14px;
        padding: 11px 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
      }
      .vlxt-smart-card.is-gold .vlxt-smart-metric {
        border-color: rgba(251, 191, 36, 0.22);
      }
      .vlxt-smart-metric strong {
        font-size: 14px;
        font-weight: 800;
        color: #38bdf8;
        line-height: 1.2;
      }
      .vlxt-smart-card.is-gold .vlxt-smart-metric strong {
        color: #fbbf24;
      }
      .vlxt-smart-metric span {
        font-size: 11.5px;
        font-weight: 600;
        color: #cbd5e1;
        line-height: 1.25;
      }

      .vlxt-smart-btn-action {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 13px 20px;
        border-radius: 14px;
        font-size: 14.5px;
        font-weight: 800;
        border: 1px solid rgba(56, 189, 248, 0.4);
        text-decoration: none;
        transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        font-family: inherit;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
      }
      .vlxt-smart-btn-action.cyan {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        color: #ffffff;
      }
      .vlxt-smart-btn-action.gold {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        border-color: rgba(253, 224, 71, 0.45);
        color: #0b1120;
      }
      .vlxt-smart-btn-action:hover {
        filter: brightness(1.08);
        transform: translateY(-2px);
      }

      .vlxt-smart-footer-note {
        font-size: 12px;
        color: #94a3b8;
        margin-top: 12px;
      }
      @media (max-width: 480px) {
        .vlxt-smart-card { padding: 22px 16px 18px; border-radius: 18px; }
        .vlxt-smart-metric { padding: 9px 4px; border-radius: 11px; }
        .vlxt-smart-metric strong { font-size: 13px; }
        .vlxt-smart-metric span { font-size: 10.5px; }
      }
    `;
    document.head.appendChild(style);
  }

  // POP-UP 1: Test Điểm Thi THPT & Quét Lỗ Hổng
  function showPopup1_DiagnosticTest() {
    injectPopupStyles();

    var existing = document.getElementById('vlxt-smart-popup-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'vlxt-smart-overlay';
    overlay.id = 'vlxt-smart-popup-overlay';

    overlay.innerHTML = `
      <div class="vlxt-smart-card">
        <button type="button" class="vlxt-smart-close" id="vlxt-btn-close-p1" title="Đóng">&times;</button>
        <div class="vlxt-smart-badge cyan"><i class="fa-solid fa-bullseye"></i> KHẢO SÁT NĂNG LỰC · MIỄN PHÍ</div>
        <h2 class="vlxt-smart-title">Đo Điểm Thi THPT Vật Lý 12</h2>
        <p class="vlxt-smart-desc">
          Làm nhanh đề chuẩn Bộ 2026 để biết mức điểm hiện tại và chuyên đề cần bù.
        </p>

        <div class="vlxt-smart-metrics">
          <div class="vlxt-smart-metric">
            <strong>28 Câu</strong>
            <span>Chuẩn Bộ 2026</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>60 FPS</strong>
            <span>Thí nghiệm 3D</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>Báo cáo</strong>
            <span>Quét 4 chương</span>
          </div>
        </div>

        <a href="danh-gia-nang-luc.html?autostart=1" class="vlxt-smart-btn-action cyan" id="vlxt-btn-go-test">
          <i class="fa-solid fa-play"></i> Bắt đầu khảo sát ngay →
        </a>

        <div class="vlxt-smart-footer-note">
          Miễn phí 100% · Chấm điểm &amp; giải chi tiết tức thì
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    liftRocketCursorToTop();

    attachCursorHover(document.getElementById('vlxt-btn-close-p1'));
    attachCursorHover(document.getElementById('vlxt-btn-go-test'));

    setTimeout(function () {
      overlay.classList.add('is-active');
      liftRocketCursorToTop();
    }, 50);

    // Xử lý khi click làm bài: Chỉ đánh dấu session, không lưu cứng hasTakenTest vào localStorage
    var btnGo = document.getElementById('vlxt-btn-go-test');
    if (btnGo) {
      btnGo.addEventListener('click', function () {
        var s = getSessionState();
        s.clickedGoTest = true;
        saveSessionState(s);
      });
    }

    // Xử lý khi bấm nút đóng [×] trên Pop-up 1 -> Đóng Pop-up 1 và sau 300ms hiện ngay Pop-up 2
    var btnClose = document.getElementById('vlxt-btn-close-p1');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        var s = getSessionState();
        s.p1Dismissed = true;
        saveSessionState(s);

        overlay.classList.remove('is-active');
        setTimeout(function () {
          overlay.remove();
          // Sau đúng 300ms hiện ngay Pop-up 2: Vào Học Thử Miễn Phí
          setTimeout(function () {
            showPopup2_FreeTrial();
          }, 300);
        }, 300);
      });
      overlay.addEventListener('click', function (e) {
        if (e && e.target === overlay) btnClose.click();
      });
    }
  }

  // POP-UP RETEST: Luyện Tập Đề Số 2 (Kiểm Chứng Tiến Bộ Đột Phá)
  function showPopupRetest_Exam2() {
    injectPopupStyles();

    var existing = document.getElementById('vlxt-smart-popup-overlay-retest');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'vlxt-smart-overlay';
    overlay.id = 'vlxt-smart-popup-overlay-retest';

    overlay.innerHTML = `
      <div class="vlxt-smart-card">
        <button type="button" class="vlxt-smart-close" id="vlxt-btn-close-pretest" title="Đóng">&times;</button>
        <div class="vlxt-smart-badge cyan"><i class="fa-solid fa-rocket"></i> ĐÃ MỞ KHÓA ĐỀ SỐ 02</div>
        <h2 class="vlxt-smart-title">Kiểm Chứng Tiến Bộ Với Đề Số 02</h2>
        <p class="vlxt-smart-desc">
          Bộ đề mới 100% giúp em đo lại mức điểm sau khi ôn vá lỗ hổng.
        </p>

        <div class="vlxt-smart-metrics">
          <div class="vlxt-smart-metric">
            <strong>Đề số 02</strong>
            <span>Câu hỏi mới</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>4 Chương</strong>
            <span>Quét toàn diện</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>Radar HUD</strong>
            <span>Cập nhật điểm</span>
          </div>
        </div>

        <a href="danh-gia-nang-luc.html?exam=2&autostart=1" class="vlxt-smart-btn-action cyan" id="vlxt-btn-go-retest">
          <i class="fa-solid fa-play"></i> Vào làm Đề số 02 ngay →
        </a>

        <div class="vlxt-smart-footer-note">
          Miễn phí · Lưu kết quả tự động vào hồ sơ
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    liftRocketCursorToTop();

    attachCursorHover(document.getElementById('vlxt-btn-close-pretest'));
    attachCursorHover(document.getElementById('vlxt-btn-go-retest'));

    setTimeout(function () {
      overlay.classList.add('is-active');
      liftRocketCursorToTop();
    }, 50);

    var btnGo = document.getElementById('vlxt-btn-go-retest');
    if (btnGo) {
      btnGo.addEventListener('click', function () {
        var s = getSessionState();
        s.clickedGoTest = true;
        saveSessionState(s);
      });
    }

    var btnClose = document.getElementById('vlxt-btn-close-pretest');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        var s = getSessionState();
        s.p1Dismissed = true;
        saveSessionState(s);

        overlay.classList.remove('is-active');
        setTimeout(function () {
          overlay.remove();
          // Sau khi tắt pop-up Đề 2, hiện tiếp Pop-up học thử miễn phí
          setTimeout(function () {
            showPopup2_FreeTrial();
          }, 300);
        }, 300);
      });
      overlay.addEventListener('click', function (e) {
        if (e && e.target === overlay) btnClose.click();
      });
    }
  }

  // POP-UP 2: Vào Học Thử Miễn Phí (Chương 1 & Chương 2)
  function showPopup2_FreeTrial() {
    injectPopupStyles();

    var existing = document.getElementById('vlxt-smart-popup-overlay-trial');
    if (existing) existing.remove();

    var u = getCurrentUser();
    var noteHtml = (u && (u.username || u.sdt || u.hoten))
      ? 'Tài khoản <strong>' + (u.hoten || u.username || u.sdt || 'Học viên') + '</strong> · Tự động lưu tiến độ'
      : 'Không cần thẻ · Lưu tiến độ tự động';

    var overlay = document.createElement('div');
    overlay.className = 'vlxt-smart-overlay';
    overlay.id = 'vlxt-smart-popup-overlay-trial';

    overlay.innerHTML = `
      <div class="vlxt-smart-card is-gold">
        <button type="button" class="vlxt-smart-close" id="vlxt-btn-close-p2" title="Đóng">&times;</button>
        <div class="vlxt-smart-badge gold"><i class="fa-solid fa-gift"></i> HỌC THỬ 0Đ · MỞ SẴN</div>
        <h2 class="vlxt-smart-title">Học Thử Miễn Phí Chương 1 &amp; 2</h2>
        <p class="vlxt-smart-desc">
          Trải nghiệm bài giảng bản chất và thí nghiệm tương tác cùng Thầy Xuân Trường.
        </p>

        <div class="vlxt-smart-metrics">
          <div class="vlxt-smart-metric">
            <strong>2 Chương</strong>
            <span>Nhiệt &amp; Khí</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>Video HD</strong>
            <span>Hiểu bản chất</span>
          </div>
          <div class="vlxt-smart-metric">
            <strong>Quiz dừng</strong>
            <span>Tương tác ngay</span>
          </div>
        </div>

        <a href="baihoc.html" class="vlxt-smart-btn-action gold" id="vlxt-btn-go-trial">
          <i class="fa-solid fa-graduation-cap"></i> Vào học thử miễn phí →
        </a>

        <div class="vlxt-smart-footer-note">
          ${noteHtml}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    liftRocketCursorToTop();

    attachCursorHover(document.getElementById('vlxt-btn-close-p2'));
    attachCursorHover(document.getElementById('vlxt-btn-go-trial'));

    setTimeout(function () {
      overlay.classList.add('is-active');
      liftRocketCursorToTop();
    }, 50);

    var btnGo = document.getElementById('vlxt-btn-go-trial');
    if (btnGo) {
      btnGo.addEventListener('click', function () {
        var s = getSessionState();
        s.clickedGoTrial = true;
        saveSessionState(s);
      });
    }

    var btnClose = document.getElementById('vlxt-btn-close-p2');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        var s = getSessionState();
        s.p2Dismissed = true;
        saveSessionState(s);

        overlay.classList.remove('is-active');
        setTimeout(function () {
          overlay.remove();
        }, 300);
      });
      overlay.addEventListener('click', function (e) {
        if (e && e.target === overlay) btnClose.click();
      });
    }
  }

  // Hàm chờ Preloader (#vlxt-preloader) kết thúc rồi đếm 15000ms (15 giây)
  function waitForPreloaderThen(callback) {
    var preloader = document.getElementById('vlxt-preloader');

    // Nếu không có preloader trên trang -> Đợi đúng 15000ms từ lúc load
    if (!preloader) {
      setTimeout(callback, POPUP_INITIAL_DELAY_MS);
      return;
    }

    function isPreloaderDone() {
      if (!preloader || !preloader.parentNode) return true;
      if (preloader.classList.contains('fade-out')) return true;
      try {
        var comp = window.getComputedStyle ? window.getComputedStyle(preloader) : null;
        if (comp && (comp.display === 'none' || comp.opacity === '0' || comp.visibility === 'hidden')) {
          return true;
        }
      } catch (e) {}
      return false;
    }

    if (isPreloaderDone()) {
      setTimeout(callback, POPUP_INITIAL_DELAY_MS);
      return;
    }

    var fired = false;
    function onPreloaderFinished() {
      if (fired) return;
      fired = true;
      if (observer) {
        try { observer.disconnect(); } catch (e) {}
      }
      if (pollTimer) clearInterval(pollTimer);
      // Đợi đúng 15000ms (15s) sau khi preloader tắt để học sinh khám phá Hố Đen & Sao Neutron
      setTimeout(callback, POPUP_INITIAL_DELAY_MS);
    }

    // Lắng nghe qua MutationObserver khi preloader đổi class sang fade-out hoặc display:none
    var observer = null;
    if (typeof MutationObserver !== 'undefined') {
      observer = new MutationObserver(function () {
        if (isPreloaderDone()) {
          onPreloaderFinished();
        }
      });
      try {
        observer.observe(preloader, { attributes: true, attributeFilter: ['class', 'style'] });
      } catch (e) {}
    }

    // Polling backup mỗi 100ms phòng hờ
    var pollTimer = setInterval(function () {
      if (isPreloaderDone()) {
        onPreloaderFinished();
      }
    }, 100);

    // Timeout an toàn phòng hờ nếu preloader bị treo quá 1.5s
    setTimeout(function () {
      onPreloaderFinished();
    }, 1500);
  }

  // Khởi động hệ thống Smart Marketing Pop-up
  function initSmartMarketingPopup() {
    var urlParams = new URLSearchParams(window.location.search);
    var isReset = urlParams.get('reset_popup') === '1' || urlParams.get('welcome') === '1';
    var isPageReload = false;
    try {
      if (window.performance && typeof window.performance.getEntriesByType === 'function') {
        var navs = window.performance.getEntriesByType('navigation');
        if (navs && navs[0] && navs[0].type === 'reload') isPageReload = true;
      } else if (window.performance && window.performance.navigation && window.performance.navigation.type === 1) {
        isPageReload = true;
      }
    } catch (e) {}

    if (isReset || isPageReload) {
      try {
        sessionStorage.removeItem(getSessionKey());
        sessionStorage.removeItem('vlxt_popup_v3_guest');
      } catch (e) {}
    }

    var session = getSessionState();

    // Nếu trong phiên này (khi điều hướng nội bộ) học sinh đã đóng Pop-up 2 hoặc đã bấm học/test -> không tự hiện lại
    if (session.p2Dismissed || session.clickedGoTrial || session.clickedGoTest) {
      return;
    }

    // Đảm bảo con trỏ tàu vũ trụ luôn nằm trên cùng
    liftRocketCursorToTop();

    // Đợi Preloader kết thúc rồi đợi đúng 15 giây (15000ms)
    waitForPreloaderThen(function () {
      // Đọc lại session state đề phòng thay đổi trong lúc chờ
      var currentSession = getSessionState();
      if (currentSession.p2Dismissed || currentSession.clickedGoTrial || currentSession.clickedGoTest) {
        return;
      }

      // Kiểm tra kết quả test thực tế trong localStorage
      var hasTested = hasActualTestResult();

      if (!hasTested) {
        // Chưa có kết quả test thực tế -> Hiện Pop-up 1 (Đề 1 chẩn đoán)
        showPopup1_DiagnosticTest();
      } else {
        // Đã có kết quả test thực tế -> Hiện Pop-up Luyện tập Đề 2 (Đề mới)
        if (!currentSession.p1Dismissed) {
          showPopupRetest_Exam2();
        } else if (!currentSession.p2Dismissed) {
          showPopup2_FreeTrial();
        }
      }
    });
  }

  // Đảm bảo khởi chạy sau khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartMarketingPopup);
  } else {
    initSmartMarketingPopup();
  }

  // Export helper toàn cục để kích hoạt chủ động nếu cần
  window.vlxtShowRetestPopup = function () {
    showPopupRetest_Exam2();
  };
  window.vlxtShowDiagnosticPopup = function () {
    showPopup1_DiagnosticTest();
  };
  window.vlxtShowTrialPopup = function () {
    showPopup2_FreeTrial();
  };
})();
