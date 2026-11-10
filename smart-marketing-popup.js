/**
 * SMART MARKETING POPUP SYSTEM — VẬT LÝ XUÂN TRƯỜNG
 * Thiết kế: Glassmorphism trong suốt màu xanh dương (Deep Space Transparent),
 * kích thước rộng rãi 680px, con trỏ tàu vũ trụ (#quantum-cursor-ring) bay lướt trên bề mặt.
 * Kịch bản 2 tầng thông minh:
 *   - Pop-up 1: Test Điểm Thi THPT Quốc Gia & Quét Lỗ Hổng Kiến Thức.
 *   - Pop-up 2: Vào Học Thử Miễn Phí (Chương 1 & Chương 2) khi học sinh tắt Pop-up 1 hoặc đã từng test.
 */

(function () {
  'use strict';

  // Lấy thông tin user hiện tại để quản lý trạng thái riêng biệt theo từng tài khoản
  function getCurrentUser() {
    try {
      var u = localStorage.getItem('vlxt_user_v2') || localStorage.getItem('vlxt_auth_user');
      if (u) return JSON.parse(u);
    } catch (e) {}
    return null;
  }

  function getStorageKey() {
    var u = getCurrentUser();
    var uid = (u && (u.username || u.sdt || u.id)) ? (u.username || u.sdt || u.id) : 'guest';
    return 'vlxt_popup_state_' + uid;
  }

  function getTrackerState() {
    var key = getStorageKey();
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    return {
      testDismissedCount: 0,
      trialDismissedCount: 0,
      hasTakenTest: false,
      hasEnrolledTrial: false,
      sessionShown: false
    };
  }

  function saveTrackerState(st) {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(st));
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
        background: rgba(3, 8, 22, 0.42);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        padding: 24px 20px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .vlxt-smart-overlay.is-active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Thẻ Card Kính Trong Suốt Màu Xanh Dương (Glassmorphism Deep Space) - Kích thước to rộng rãi 680px */
      .vlxt-smart-card {
        position: relative;
        width: 100%;
        max-width: 680px;
        background: rgba(8, 22, 50, 0.45);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1.5px solid rgba(0, 240, 255, 0.45);
        border-radius: 28px;
        padding: 42px 40px 36px;
        box-shadow: 
          0 25px 80px rgba(0, 0, 0, 0.65), 
          0 0 50px rgba(0, 240, 255, 0.25),
          inset 0 0 35px rgba(0, 240, 255, 0.12);
        color: #f1f5f9;
        text-align: center;
        transform: scale(0.92) translateY(18px);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
      }
      .vlxt-smart-overlay.is-active .vlxt-smart-card {
        transform: scale(1) translateY(0);
      }

      /* Nút đóng tròn kính trong suốt */
      .vlxt-smart-close {
        position: absolute;
        top: 22px;
        right: 22px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(0, 240, 255, 0.35);
        color: #cbd5e1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        line-height: 1;
        transition: all 0.2s;
        z-index: 10;
        backdrop-filter: blur(6px);
      }
      .vlxt-smart-close:hover {
        background: rgba(239, 68, 68, 0.35);
        border-color: #ef4444;
        color: #ffffff;
        transform: rotate(90deg) scale(1.08);
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
      }

      /* Badge phát sáng */
      .vlxt-smart-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 7px 18px;
        border-radius: 100px;
        font-size: 12.5px;
        font-weight: 800;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-bottom: 18px;
      }
      .vlxt-smart-badge.cyan {
        background: rgba(0, 240, 255, 0.15);
        border: 1px solid rgba(0, 240, 255, 0.5);
        color: #00f0ff;
        box-shadow: 0 0 22px rgba(0, 240, 255, 0.35);
      }
      .vlxt-smart-badge.gold {
        background: rgba(245, 158, 11, 0.18);
        border: 1px solid rgba(251, 191, 36, 0.5);
        color: #fbbf24;
        box-shadow: 0 0 22px rgba(245, 158, 11, 0.35);
      }

      .vlxt-smart-title {
        font-size: clamp(22px, 4vw, 27px);
        font-weight: 900;
        line-height: 1.35;
        margin-bottom: 14px;
        color: #ffffff;
        letter-spacing: -0.02em;
        text-shadow: 0 0 28px rgba(0, 240, 255, 0.4);
      }
      .vlxt-smart-desc {
        font-size: 15px;
        color: #cbd5e1;
        line-height: 1.65;
        margin-bottom: 26px;
        max-width: 580px;
        margin-left: auto;
        margin-right: auto;
      }

      /* Hộp tính năng trong suốt */
      .vlxt-smart-features {
        background: rgba(0, 240, 255, 0.04);
        border: 1px solid rgba(0, 240, 255, 0.22);
        border-radius: 18px;
        padding: 18px 24px;
        text-align: left;
        margin-bottom: 28px;
        display: flex;
        flex-direction: column;
        gap: 14px;
        backdrop-filter: blur(8px);
      }
      .vlxt-smart-feat-item {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 14.5px;
        color: #f1f5f9;
        line-height: 1.5;
      }
      .vlxt-smart-feat-item i {
        color: #00f0ff;
        font-size: 16px;
        flex-shrink: 0;
      }

      /* Nút CTA to rộng rãi phát sáng */
      .vlxt-smart-btn-action {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 17px 32px;
        border-radius: 100px;
        font-size: 16.5px;
        font-weight: 900;
        border: none;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        font-family: inherit;
        letter-spacing: 0.02em;
      }
      .vlxt-smart-btn-action.cyan {
        background: linear-gradient(135deg, #00f0ff 0%, #0b84f3 100%);
        color: #04101e;
        box-shadow: 0 8px 32px rgba(0, 240, 255, 0.55);
      }
      .vlxt-smart-btn-action.cyan:hover {
        filter: brightness(1.18);
        transform: translateY(-2px);
        box-shadow: 0 12px 45px rgba(0, 240, 255, 0.75);
      }

      .vlxt-smart-footer-note {
        font-size: 13px;
        color: #94a3b8;
        margin-top: 18px;
      }
    `;
    document.head.appendChild(style);
  }

  // POP-UP 1: Test Điểm Thi THPT & Quét Lỗ Hổng
  function showPopup1_DiagnosticTest(tracker) {
    injectPopupStyles();

    // Xóa overlay cũ nếu có
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

    // Gắn hiệu ứng hover con trỏ tàu vũ trụ
    attachCursorHover(document.getElementById('vlxt-btn-close-p1'));
    attachCursorHover(document.getElementById('vlxt-btn-go-test'));

    setTimeout(function () {
      overlay.classList.add('is-active');
      liftRocketCursorToTop();
    }, 50);

    // Xử lý khi click làm bài
    var btnGo = document.getElementById('vlxt-btn-go-test');
    if (btnGo) {
      btnGo.addEventListener('click', function () {
        tracker.hasTakenTest = true;
        saveTrackerState(tracker);
      });
    }

    // Xử lý khi học sinh bấm tắt Pop-up 1 -> Chuyển sang Pop-up 2 (Học Thử Miễn Phí)
    var btnClose = document.getElementById('vlxt-btn-close-p1');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        tracker.testDismissedCount = (tracker.testDismissedCount || 0) + 1;
        saveTrackerState(tracker);

        overlay.classList.remove('is-active');
        setTimeout(function () {
          overlay.remove();
          // Sau khi tắt Pop-up 1, hiển thị tiếp Pop-up 2 (Học thử miễn phí)
          setTimeout(function () {
            showPopup2_FreeTrial(tracker);
          }, 350);
        }, 350);
      });
    }
  }

  // POP-UP 2: Vào Học Thử Miễn Phí (Chương 1 & Chương 2)
  function showPopup2_FreeTrial(tracker) {
    injectPopupStyles();

    var existing = document.getElementById('vlxt-smart-popup-overlay-trial');
    if (existing) existing.remove();

    var u = getCurrentUser();
    var noteHtml = (u && (u.username || u.sdt || u.hoten))
      ? '<i class="fa-solid fa-circle-check" style="color:#00f0ff"></i> Đã đăng nhập tài khoản <strong>' + (u.hoten || u.username || u.sdt || 'Học viên') + '</strong> · Tiến độ học tập được lưu tự động'
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

    // Gắn hiệu ứng hover con trỏ tàu vũ trụ
    attachCursorHover(document.getElementById('vlxt-btn-close-p2'));
    attachCursorHover(document.getElementById('vlxt-btn-go-trial'));

    setTimeout(function () {
      overlay.classList.add('is-active');
      liftRocketCursorToTop();
    }, 50);

    var btnGo = document.getElementById('vlxt-btn-go-trial');
    if (btnGo) {
      btnGo.addEventListener('click', function () {
        tracker.hasEnrolledTrial = true;
        saveTrackerState(tracker);
      });
    }

    var btnClose = document.getElementById('vlxt-btn-close-p2');
    if (btnClose) {
      btnClose.addEventListener('click', function () {
        tracker.trialDismissedCount = (tracker.trialDismissedCount || 0) + 1;
        saveTrackerState(tracker);

        overlay.classList.remove('is-active');
        setTimeout(function () {
          overlay.remove();
        }, 350);
      });
    }
  }

  // Khởi động hệ thống Smart Marketing Pop-up
  function initSmartMarketingPopup() {
    var tracker = getTrackerState();

    // Nếu trang có tham số ?welcome=1 (vừa đăng ký tài khoản mới) -> reset để đảm bảo hiển thị
    var urlParams = new URLSearchParams(window.location.search);
    var isNewReg = urlParams.get('welcome') === '1';
    if (isNewReg) {
      tracker.testDismissedCount = 0;
      tracker.trialDismissedCount = 0;
      tracker.hasTakenTest = false;
      saveTrackerState(tracker);
    }

    // Đảm bảo con trỏ tàu vũ trụ luôn nằm trên cùng
    liftRocketCursorToTop();

    // Chờ đúng 3 GIÂY để học sinh chiêm ngưỡng giao diện vũ trụ 3D tuyệt đẹp của trang web
    setTimeout(function () {
      // Nếu chưa làm test -> Hiện Pop-up 1 (Test Điểm Thi THPT)
      if (!tracker.hasTakenTest) {
        showPopup1_DiagnosticTest(tracker);
      } else {
        // Đã làm test rồi -> Hiện Pop-up 2 (Học Thử Miễn Phí)
        showPopup2_FreeTrial(tracker);
      }
    }, 3000);
  }

  // Đảm bảo khởi chạy sau khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSmartMarketingPopup);
  } else {
    initSmartMarketingPopup();
  }

  // Export helper toàn cục để có thể gọi kích hoạt chủ động nếu cần
  window.vlxtShowDiagnosticPopup = function () {
    showPopup1_DiagnosticTest(getTrackerState());
  };
  window.vlxtShowTrialPopup = function () {
    showPopup2_FreeTrial(getTrackerState());
  };
})();
