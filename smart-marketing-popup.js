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

  // Key sessionStorage quản lý phiên
  function getSessionKey() {
    var u = getCurrentUser();
    var uid = (u && (u.username || u.sdt || u.id)) ? (u.username || u.sdt || u.id) : 'guest';
    return (uid === 'guest') ? 'vlxt_popup_session_guest' : ('vlxt_popup_session_' + uid);
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

      /* Ẩn con trỏ chuột mặc định của hệ điều hành trên toàn bộ popup để hiện tàu vũ trụ */
      .vlxt-smart-overlay,
      .vlxt-smart-overlay *,
      .vlxt-smart-card,
      .vlxt-smart-card *,
      .vlxt-smart-close,
      .vlxt-smart-btn-action {
        cursor: none !important;
      }

      /* Lớp nền mờ trong suốt (nhìn xuyên qua vũ trụ 3D Three.js phía sau) */
      .vlxt-smart-overlay {
        position: fixed;
        inset: 0;
        z-index: 99990;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(3, 8, 22, 0.58);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        padding: 24px 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .vlxt-smart-overlay.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Thẻ Card Kính Trong Suốt (Deep Space Glassmorphism) - Kích thước rộng rãi 680px - Phẳng, Sắc nét, Chuẩn EdTech */
      .vlxt-smart-card {
        position: relative;
        width: 100%;
        max-width: 680px;
        background: rgba(8, 22, 50, 0.65);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(56, 189, 248, 0.35);
        border-radius: 24px;
        padding: 38px 36px 32px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        color: #f1f5f9;
        text-align: center;
        transform: scale(0.94) translateY(14px);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }
      .vlxt-smart-overlay.is-active .vlxt-smart-card {
        transform: scale(1) translateY(0);
      }

      /* Nút đóng tròn kính trong suốt sắc nét */
      .vlxt-smart-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(56, 189, 248, 0.35);
        color: #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        line-height: 1;
        transition: all 0.2s ease;
        z-index: 10;
        backdrop-filter: blur(6px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      }
      .vlxt-smart-close:hover {
        background: rgba(239, 68, 68, 0.85);
        border-color: #ef4444;
        color: #ffffff;
        transform: rotate(90deg) scale(1.06);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Badge sắc nét, phẳng, không AI glow */
      .vlxt-smart-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 16px;
        border-radius: 100px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
      .vlxt-smart-badge.cyan {
        background: rgba(14, 116, 144, 0.25);
        border: 1px solid rgba(56, 189, 248, 0.4);
        color: #38bdf8;
      }
      .vlxt-smart-badge.gold {
        background: rgba(180, 83, 9, 0.25);
        border: 1px solid rgba(251, 191, 36, 0.4);
        color: #fbbf24;
      }

      .vlxt-smart-title {
        font-size: clamp(20px, 3.8vw, 25px);
        font-weight: 800;
        line-height: 1.35;
        margin-bottom: 12px;
        color: #ffffff;
        letter-spacing: -0.01em;
        text-shadow: none !important;
      }
      .vlxt-smart-desc {
        font-size: 14.5px;
        color: #cbd5e1;
        line-height: 1.6;
        margin-bottom: 22px;
        max-width: 580px;
        margin-left: auto;
        margin-right: auto;
      }

      /* Hộp tính năng trong suốt, phẳng */
      .vlxt-smart-features {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 16px;
        padding: 16px 20px;
        text-align: left;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        backdrop-filter: blur(8px);
      }
      .vlxt-smart-feat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: #f1f5f9;
        line-height: 1.5;
      }
      .vlxt-smart-feat-item i {
        color: #38bdf8;
        font-size: 15px;
        flex-shrink: 0;
      }

      /* Nút CTA phẳng sắc nét, bóng đổ vật lý tự nhiên */
      .vlxt-smart-btn-action {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 15px 28px;
        border-radius: 100px;
        font-size: 15.5px;
        font-weight: 800;
        border: 1px solid rgba(56, 189, 248, 0.35);
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        font-family: inherit;
        letter-spacing: 0.01em;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      }
      .vlxt-smart-btn-action.cyan {
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        color: #ffffff;
      }
      .vlxt-smart-btn-action.cyan:hover {
        filter: brightness(1.1);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
      }

      .vlxt-smart-footer-note {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 16px;
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
        <div class="vlxt-smart-badge cyan"><i class="fa-solid fa-bolt"></i> CHUẨN MA TRẬN BỘ GD&amp;ĐT 2026</div>
        <h2 class="vlxt-smart-title">🎯 TEST ĐIỂM THI THPT &amp; QUÉT LỖ HỔNG VẬT LÝ 12</h2>
        <p class="vlxt-smart-desc">
          Làm bài test chẩn đoán 20 câu để hệ thống đo lường chính xác mức điểm hiện tại và định vị các lỗ hổng kiến thức tiềm ẩn của em.
        </p>

        <div class="vlxt-smart-features">
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Dự đoán điểm thi THPT chính xác theo ma trận chuẩn Bộ GD&amp;ĐT 2026.</span>
          </div>
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Quét toàn diện 4 chuyên đề: Nhiệt, Khí, Từ trường, Hạt nhân.</span>
          </div>
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Tự động cấp quyền vào học bài khắc phục cấp tốc từ Thầy.</span>
          </div>
        </div>

        <a href="danh-gia-nang-luc.html?autostart=1" class="vlxt-smart-btn-action cyan" id="vlxt-btn-go-test">
          <i class="fa-solid fa-play"></i> BẮT ĐẦU TEST 20 CÂU NGAY (MIỄN PHÍ) →
        </a>

        <div class="vlxt-smart-footer-note">
          Thời gian làm bài: 30 phút · Chấm điểm &amp; đối soát chi tiết ngay lập tức
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
    }
  }

  // POP-UP 2: Vào Học Thử Miễn Phí (Chương 1 & Chương 2)
  function showPopup2_FreeTrial() {
    injectPopupStyles();

    var existing = document.getElementById('vlxt-smart-popup-overlay-trial');
    if (existing) existing.remove();

    var u = getCurrentUser();
    var noteHtml = (u && (u.username || u.sdt || u.hoten))
      ? '<i class="fa-solid fa-circle-check" style="color:#38bdf8"></i> Đã đăng nhập tài khoản <strong>' + (u.hoten || u.username || u.sdt || 'Học viên') + '</strong> · Tiến độ học tập được lưu tự động'
      : 'Không cần thẻ ngân hàng · Đăng nhập trong 3 giây để lưu tiến độ';

    var overlay = document.createElement('div');
    overlay.className = 'vlxt-smart-overlay';
    overlay.id = 'vlxt-smart-popup-overlay-trial';

    overlay.innerHTML = `
      <div class="vlxt-smart-card">
        <button type="button" class="vlxt-smart-close" id="vlxt-btn-close-p2" title="Đóng">&times;</button>
        <div class="vlxt-smart-badge cyan"><i class="fa-solid fa-gift"></i> HỌC BẢN CHẤT CÙNG THẦY XUÂN TRƯỜNG</div>
        <h2 class="vlxt-smart-title">🚀 VÀO HỌC THỬ MIỄN PHÍ KHÓA VẬT LÝ 12</h2>
        <p class="vlxt-smart-desc">
          Mở khóa miễn phí toàn bộ <strong>Chương 1 (Vật Lí Nhiệt)</strong> &amp; <strong>Chương 2 (Khí Lí Tưởng)</strong>. Trải nghiệm phương pháp học bản chất cùng Thầy!
        </p>

        <div class="vlxt-smart-features">
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-circle-play"></i>
            <span>Video bài giảng thực chiến, giải thích bản chất không học vẹt.</span>
          </div>
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-cube"></i>
            <span>Mô phỏng 3D WebGL tương tác trực tiếp thí nghiệm nhiệt &amp; khí.</span>
          </div>
          <div class="vlxt-smart-feat-item">
            <i class="fa-solid fa-check-double"></i>
            <span>Luyện tập trắc nghiệm củng cố và câu hỏi dừng video tương tác.</span>
          </div>
        </div>

        <a href="baihoc.html" class="vlxt-smart-btn-action cyan" id="vlxt-btn-go-trial">
          <i class="fa-solid fa-graduation-cap"></i> VÀO HỌC THỬ MIỄN PHÍ NGAY →
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
    }
  }

  // Hàm chờ Preloader (#vlxt-preloader) kết thúc rồi đếm 3000ms
  function waitForPreloaderThen(callback) {
    var preloader = document.getElementById('vlxt-preloader');

    // Nếu không có preloader trên trang -> Đợi đúng 3000ms từ lúc load
    if (!preloader) {
      setTimeout(callback, 3000);
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
      setTimeout(callback, 3000);
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
      // Đợi đúng 3000ms sau khi preloader tắt để học sinh chiêm ngưỡng giao diện
      setTimeout(callback, 3000);
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

    // Timeout an toàn phòng hờ nếu preloader bị treo quá 4.5s
    setTimeout(function () {
      onPreloaderFinished();
    }, 4500);
  }

  // Khởi động hệ thống Smart Marketing Pop-up
  function initSmartMarketingPopup() {
    var urlParams = new URLSearchParams(window.location.search);
    var isReset = urlParams.get('reset_popup') === '1' || urlParams.get('welcome') === '1';

    if (isReset) {
      try {
        sessionStorage.removeItem(getSessionKey());
        sessionStorage.removeItem('vlxt_popup_session_guest');
      } catch (e) {}
    }

    var session = getSessionState();

    // Nếu trong phiên này học sinh đã đóng Pop-up 2 hoặc đã bấm vào học thử / bấm làm test -> không tự hiện lại
    if (session.p2Dismissed || session.clickedGoTrial || session.clickedGoTest) {
      return;
    }

    // Đảm bảo con trỏ tàu vũ trụ luôn nằm trên cùng
    liftRocketCursorToTop();

    // Đợi Preloader kết thúc rồi đợi đúng 3 giây (3000ms)
    waitForPreloaderThen(function () {
      // Đọc lại session state đề phòng thay đổi trong lúc chờ
      var currentSession = getSessionState();
      if (currentSession.p2Dismissed || currentSession.clickedGoTrial || currentSession.clickedGoTest) {
        return;
      }

      // Kiểm tra kết quả test thực tế trong localStorage
      var hasTested = hasActualTestResult();

      if (!hasTested) {
        // Chưa có kết quả test thực tế -> Hiện Pop-up 1
        showPopup1_DiagnosticTest();
      } else {
        // Đã có kết quả test thực tế -> Bỏ qua Pop-up 1, hiện Pop-up 2 (Học Thử Miễn Phí)
        if (!currentSession.p1Dismissed) {
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
  window.vlxtShowDiagnosticPopup = function () {
    showPopup1_DiagnosticTest();
  };
  window.vlxtShowTrialPopup = function () {
    showPopup2_FreeTrial();
  };
})();
