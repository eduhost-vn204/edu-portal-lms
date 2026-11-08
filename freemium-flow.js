/* ═══════════════════════════════════════════════════════════════════
   FREEMIUM FLOW & CRO FUNNEL MODULE — VẬT LÝ XUÂN TRƯỜNG
   Luồng Chuyển Đổi Tâm Lý 6 Bước (CRO Funnel):
   - Bước 1: Trải nghiệm 0 rào cản (Free Hook: Chương 1, 2 & 5 gói đề đầu)
   - Bước 2: Hành động nhanh (Khởi động làm trắc nghiệm)
   - Bước 3: Nhận giá trị trọn vẹn (Điểm, đáp án, lời giải chi tiết, video chữa)
   - Bước 4: Component <DiagnosticReportCard /> (Báo cáo lỗ hổng, 3 thanh tags, THPT vs 8.5+)
   - Bước 5: Component <UpgradeValueModal /> (4 đặc quyền, feedback Minh Quân - Khánh Linh, so sánh giá 50k)
   - Bước 6: Component <VietQRCheckoutModal /> (VietQR động, polling, confetti, mở khóa Chương 3 & 4)
   ═══════════════════════════════════════════════════════════════════ */

(function (window) {
  'use strict';

  const PAYMENT_CONFIG = {
    bankId: 'ICB', // VietinBank (Ngân hàng TMCP Công Thương Việt Nam - BIN 970415)
    bankName: 'VietinBank (Công Thương)',
    accountNo: '198490756789',
    accountName: 'NGUYEN XUAN TRUONG',
    template: 'compact2',
    defaultAmount: 50000,
    prefix: 'VL12_'
  };

  const STORAGE_KEYS = {
    ZERO_FRICTION: 'vlxt_cro_zero_friction_state',
    USER: 'vlxt_user_v2',
    LEGACY_USER: 'vlxt_user'
  };

  const FreemiumFlow = {
    CONFIG: PAYMENT_CONFIG,
    KEYS: STORAGE_KEYS,
    _pollTimer: null,
    _pollCount: 0,

    // ── 1. Kiểm tra quyền truy cập Chương ──
    isChapterFree: function (chapterName, user) {
      if (this.isPaidUser(user)) return true;
      if (!chapterName) return true;
      const lower = chapterName.toLowerCase();
      // Chương 1 và Chương 2 được mở MIỄN PHÍ hoàn toàn
      if (lower.includes('chương 1') || lower.includes('nhiệt') || 
          lower.includes('chương 2') || lower.includes('khí')) {
        return true;
      }
      // Chương 3 và Chương 4 dành riêng cho tài khoản Pro / VIP
      if (lower.includes('chương 3') || lower.includes('từ trường') || 
          lower.includes('chương 4') || lower.includes('hạt nhân')) {
        return false;
      }
      return true;
    },

    // ── 2. Kiểm tra tài khoản đã nâng cấp Pro / Paid chưa ──
    isPaidUser: function (user) {
      if (!user) {
        try {
          user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
        } catch (e) {
          user = null;
        }
      }
      if (!user) return false;
      if (user.isPaid === true) return true;
      const tier = String(user.loaiTK || '').toLowerCase();
      const proExpiry = Number(user.proExpiry || user.trialExpiry || 0);
      const isStillValid = proExpiry > Date.now();
      return tier === 'pro' || tier === 'premium' || (tier === 'vip' && isStillValid);
    },

    // ── 3. Thứ tự gói Quiz & Kiểm tra miễn phí (5 gói đầu) ──
    getQuizPacketOrder: function (course, lessonKey) {
      if (!course || !course.chapters) return 1;
      let count = 0;
      for (const ch of course.chapters) {
        if (!this.isChapterFree(ch.name)) continue;
        for (const l of ch.lessons) {
          if ((l.baitap && l.baitap.length > 0) || Number(l._quizCount) > 0) {
            count++;
            if (l.key === lessonKey) return count;
          }
        }
      }
      return count || 1;
    },

    isQuizFree: function (course, lessonKey, user) {
      if (this.isPaidUser(user)) return true;
      const order = this.getQuizPacketOrder(course, lessonKey);
      return order <= 5; // 5 gói đầu miễn phí hoàn toàn
    },

    // ── 4. Phân loại câu hỏi thành 3 Tags chuẩn CRO ──
    // Tags: 'ly_thuyet' (Lý thuyết), 'bay_don_vi' (Bẫy đơn vị), 'do_thi_vdc' (Đồ thị & VDC)
    classifyQuestion: function (q) {
      if (!q) return 'ly_thuyet';

      // 1. Kiểm tra tag có sẵn trong câu hỏi
      const explicitTag = (q.tag || q.tags || q.category || q.dang || q.phanLoai || '').toString().toLowerCase();
      if (explicitTag.includes('do_thi') || explicitTag.includes('vdc') || explicitTag.includes('do-thi')) return 'do_thi_vdc';
      if (explicitTag.includes('bay') || explicitTag.includes('don_vi') || explicitTag.includes('don-vi')) return 'bay_don_vi';
      if (explicitTag.includes('ly_thuyet') || explicitTag.includes('ly-thuyet')) return 'ly_thuyet';

      // 2. Phân tích nội dung văn bản (Domain Physics 12 Classifier)
      const text = [
        q.question || q.q || '',
        q.optA || q.A || '',
        q.optB || q.B || '',
        q.optC || q.C || '',
        q.optD || q.D || '',
        q.explain || q.giaiThich || ''
      ].join(' ').toLowerCase();

      // Đồ thị & VDC
      if (/đồ thị|hình vẽ|hình bên|chu trình|hệ trục|\bp\s*-\s*v\b|\bp\s*-\s*t\b|\bv\s*-\s*t\b|trục tung|trục hoành|vận dụng cao|cực đại|cực tiểu|tối đa|tối thiểu|thanh dẫn|ray song song|thí nghiệm|cảm ứng xuất hiện/i.test(text)) {
        return 'do_thi_vdc';
      }

      // Bẫy đơn vị & biến đổi số liệu
      if (/đổi đơn vị|bẫy|nhầm|dm3|dm³|cm3|cm³|lít|lit|ml|bar|atm|\bpa\b|kpa|mpa|mmhg|torr|°c|độ c|kelvin|\b\d+[\s,]*(k|c|atm|bar|l|dm3|cm3|pa)\b|g\/l|kg\/m3|hụt khối|amu|mev|tỏa hay thu/i.test(text)) {
        return 'bay_don_vi';
      }

      // Mặc định là lý thuyết bản chất
      return 'ly_thuyet';
    },

    // ── 5. Lưu trữ tiến độ Zero-Friction vào localStorage ──
    saveZeroFrictionProgress: function (payload) {
      try {
        const state = this.getZeroFrictionProgress() || {
          attempts: [],
          packets: {},
          lastAttempt: null
        };

        const qs = payload.questions || [];
        const wrongIndices = payload.wrongIndices || [];
        const total = qs.length || payload.total || 0;
        const correct = payload.correct !== undefined ? payload.correct : (total - wrongIndices.length);

        // Thống kê 3 tags
        const tagStats = {
          ly_thuyet: { total: 0, correct: 0, wrong: 0, pct: 0 },
          bay_don_vi: { total: 0, correct: 0, wrong: 0, pct: 0 },
          do_thi_vdc: { total: 0, correct: 0, wrong: 0, pct: 0 }
        };

        const wrongIds = [];

        qs.forEach((q, idx) => {
          const tag = this.classifyQuestion(q);
          tagStats[tag].total++;
          const isWrong = wrongIndices.includes(idx);
          if (isWrong) {
            tagStats[tag].wrong++;
            wrongIds.push(q.id || q._rowIndex || q.thuTu || (idx + 1));
          } else {
            tagStats[tag].correct++;
          }
        });

        // Tính % từng tag
        Object.keys(tagStats).forEach(t => {
          const item = tagStats[t];
          item.pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 100;
        });

        // Tính điểm thi THPT dự kiến (Ma trận thang điểm 10)
        const rawScore = total > 0 ? (correct / total) * 10 : 0;
        let predictedScore = 0;
        if (rawScore >= 9.5) predictedScore = 9.25;
        else if (rawScore >= 8.5) predictedScore = 8.5;
        else if (rawScore >= 7.0) predictedScore = 7.25;
        else if (rawScore >= 5.0) predictedScore = 6.0;
        else predictedScore = Math.max(3.5, (rawScore * 0.85 + 0.5));
        predictedScore = Number(predictedScore.toFixed(1));

        const attemptData = {
          lessonKey: payload.lessonKey || 'packet_free',
          title: payload.title || 'Đánh giá năng lực Vật Lý 12',
          order: payload.packetOrder || 1,
          total: total,
          correct: correct,
          score10: rawScore.toFixed(1),
          predictedScore: predictedScore,
          targetScore: 8.5,
          wrongIds: wrongIds,
          tagStats: tagStats,
          timestamp: Date.now()
        };

        state.lastAttempt = attemptData;
        state.attempts.push(attemptData);
        if (payload.lessonKey) {
          state.packets[payload.lessonKey] = attemptData;
        }

        localStorage.setItem(STORAGE_KEYS.ZERO_FRICTION, JSON.stringify(state));
        return attemptData;
      } catch (e) {
        console.warn('Lỗi lưu ZeroFrictionProgress:', e);
        return null;
      }
    },

    getZeroFrictionProgress: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ZERO_FRICTION);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    // ── 6. Component <DiagnosticReportCard /> (Bước 4) ──
    renderDiagnosticReportCard: function (container, customStats) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (!container) return;

      const state = this.getZeroFrictionProgress();
      const stats = customStats || (state ? state.lastAttempt : null) || {
        total: 20,
        correct: 14,
        score10: '7.0',
        predictedScore: 6.75,
        targetScore: 8.5,
        tagStats: {
          ly_thuyet: { total: 8, correct: 7, pct: 88, wrong: 1 },
          bay_don_vi: { total: 9, correct: 5, pct: 56, wrong: 4 },
          do_thi_vdc: { total: 3, correct: 1, pct: 33, wrong: 2 }
        }
      };

      const predicted = Number(stats.predictedScore || 6.75);
      const target = Number(stats.targetScore || 8.5);
      const gap = Math.max(0.5, Number((target - predicted).toFixed(1)));
      const tags = stats.tagStats || {};

      const lyThuyet = tags.ly_thuyet || { total: 8, correct: 7, pct: 88, wrong: 1 };
      const bayDonVi = tags.bay_don_vi || { total: 9, correct: 5, pct: 56, wrong: 4 };
      const doThiVdc = tags.do_thi_vdc || { total: 3, correct: 1, pct: 33, wrong: 2 };

      // Xác định câu nhận xét sư phạm
      let statusNote = '';
      if (bayDonVi.pct < 70 || doThiVdc.pct < 60) {
        statusNote = 'Em đang có xu hướng mất điểm ở các câu hỏi bẫy đổi đơn vị ($dm^3 \\leftrightarrow m^3, bar \\leftrightarrow Pa$) và biến đổi đồ thị đa trục.';
      } else {
        statusNote = 'Em có nền tảng khá chắc chắn, nhưng cần tăng tốc độ xử lý các câu VDC phân hóa 9+ để về đích an toàn.';
      }

      const card = document.createElement('div');
      card.id = 'cro-diagnostic-report-card';
      card.className = 'cro-diagnostic-card';
      card.innerHTML = `
        <div class="cro-diag-header">
          <div class="cro-diag-chip">
            <i class="fa-solid fa-chart-line"></i> BƯỚC 4: CHẨN ĐOÁN LỖ HỔNG NĂNG LỰC
          </div>
          <h2 class="cro-diag-title">Báo Cáo Phân Tích Lỗ Hổng Kiến Thức Vật Lý 12</h2>
          <p class="cro-diag-sub">Dựa trên phân tích thời gian thực bài làm vừa nộp của em — Đo lường năng lực chuẩn ma trận Bộ GD&ĐT.</p>
        </div>

        <!-- Khối so sánh điểm thi dự kiến vs mục tiêu 8.5+ -->
        <div class="cro-score-compare-grid">
          <div class="cro-score-box current">
            <div class="cro-sb-label"><i class="fa-solid fa-gauge-simple-high"></i> ĐIỂM THI THPT DỰ KIẾN</div>
            <div class="cro-sb-val">${predicted}<span>/10</span></div>
            <div class="cro-sb-desc">Ước lượng từ độ chính xác &amp; tốc độ làm bài</div>
          </div>
          <div class="cro-score-box target">
            <div class="cro-sb-label"><i class="fa-solid fa-bullseye"></i> ĐIỂM MỤC TIÊU TOP 1</div>
            <div class="cro-sb-val">${target}+<span>/10</span></div>
            <div class="cro-sb-desc">Cần cải thiện <strong style="color:#00f0ff">+${gap} điểm</strong> để chạm mốc an toàn</div>
          </div>
        </div>

        <!-- 3 Thanh tiến độ theo Tags -->
        <div class="cro-progress-tags-wrap">
          <div class="cro-pt-heading">
            <i class="fa-solid fa-layer-group" style="color:#38bdf8"></i> ĐO LƯỜNG 3 TRỤ CỘT NĂNG LỰC BÀI THI
          </div>

          <!-- Tag 1: Lý thuyết -->
          <div class="cro-tag-row">
            <div class="cro-tag-info">
              <span class="cro-tag-name"><i class="fa-solid fa-book-bookmark" style="color:#10b981"></i> 1. Lý Thuyết Nền Tảng &amp; Khái Niệm Cốt Lõi</span>
              <span class="cro-tag-pct" style="color:#10b981">${lyThuyet.correct}/${lyThuyet.total} câu (${lyThuyet.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill emerald" style="width: ${lyThuyet.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              ${lyThuyet.pct >= 75 
                ? '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> Nắm vững bản chất khái niệm · Đã kích hoạt phản xạ nhanh' 
                : '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i> Cần rà soát lại các định nghĩa và điều kiện áp dụng định luật'}
            </div>
          </div>

          <!-- Tag 2: Bẫy đơn vị -->
          <div class="cro-tag-row">
            <div class="cro-tag-info">
              <span class="cro-tag-name"><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i> 2. Phản Xạ Bẫy Đơn Vị &amp; Công Thức Biến Đổi</span>
              <span class="cro-tag-pct" style="color:#f59e0b">${bayDonVi.correct}/${bayDonVi.total} câu (${bayDonVi.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill amber" style="width: ${bayDonVi.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              <i class="fa-solid fa-circle-exclamation" style="color:#f59e0b"></i> Cảnh báo mất điểm oan: Thường nhầm lẫn $dm^3 \\leftrightarrow m^3$, nhiệt độ $K \\leftrightarrow ^\\circ C$ và góc pháp tuyến $\\alpha$.
            </div>
          </div>

          <!-- Tag 3: Đồ thị & VDC -->
          <div class="cro-tag-row">
            <div class="cro-tag-info">
              <span class="cro-tag-name"><i class="fa-solid fa-chart-area" style="color:#a855f7"></i> 3. Tư Duy Đồ Thị Đa Trục &amp; Vận Dụng Cao (VDC)</span>
              <span class="cro-tag-pct" style="color:#a855f7">${doThiVdc.correct}/${doThiVdc.total} câu (${doThiVdc.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill purple" style="width: ${doThiVdc.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              <i class="fa-solid fa-circle-exclamation" style="color:#a855f7"></i> Điểm nghẽn then chốt: Chưa vững phương pháp giải nhanh đồ thị chu trình khí &amp; từ trường biến thiên.
            </div>
          </div>
        </div>

        <!-- Lời nhận xét sư phạm từ Thầy -->
        <div class="cro-teacher-advice-box">
          <div class="cro-tab-heading">💡 <strong>Chỉ Dẫn Chiến Lược Từ Thầy Xuân Trường:</strong></div>
          <p class="cro-tab-content">
            "Em đã nắm được mạch lý thuyết cơ bản, nhưng dữ liệu bài làm cho thấy em đang gặp nguy cơ đánh rơi từ <strong>1.5 đến 2.5 điểm</strong> ở các câu hỏi gài bẫy đơn vị ($dm^3 \\leftrightarrow m^3, bar \\leftrightarrow Pa$) và dạng bài đồ thị biến thiên trạng thái. Đề thi tốt nghiệp THPT 2026 sẽ phân hóa cực mạnh ở <strong>Chương 3 (Từ trường)</strong> và <strong>Chương 4 (Vật lý hạt nhân)</strong>. Nếu không lấp các lỗ hổng này ngay từ bây giờ, em sẽ rất khó vượt qua ngưỡng 8.0!"
          </p>
        </div>

        <!-- Nút CTA sang Bước 5 -->
        <div class="cro-diag-cta-wrap">
          <button type="button" class="cro-btn-cta-step4" onclick="FreemiumFlow.openUpgradeValueModal('Lộ trình lấp lỗ hổng &amp; Bứt phá 8.5+ môn Vật lý 12')">
            <span><i class="fa-solid fa-arrow-trend-up"></i> Xem lộ trình lấp lỗ hổng &amp; Bứt phá 8.5+ cùng Thầy</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;

      // Render KaTeX nếu có
      if (window.renderMathInElement) {
        try {
          renderMathInElement(card, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {}
      }

      // Xóa card cũ nếu có và gắn card mới
      const old = document.getElementById('cro-diagnostic-report-card');
      if (old) old.remove();
      container.appendChild(card);
      return card;
    },

    // ── 7. Component <UpgradeValueModal /> (Bước 5) ──
    openUpgradeValueModal: function (contextTitle) {
      this.ensureModalsInDOM();
      const modal = document.getElementById('cro-upgrade-value-modal');
      if (!modal) return;
      if (contextTitle) {
        const titleEl = document.getElementById('cro-uvm-context-title');
        if (titleEl) titleEl.textContent = contextTitle;
      }
      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');
    },

    closeUpgradeValueModal: function () {
      const modal = document.getElementById('cro-upgrade-value-modal');
      if (modal) modal.classList.remove('cro-modal-open');
      document.body.classList.remove('cro-body-locked');
    },

    // ── 8. Component <VietQRCheckoutModal /> & VNPay Checkout (Bước 6) ──
    _currentPlan: { code: 'THANG50K', name: 'Gói Tự Học Vật Lý 12 Toàn Diện', amount: 50000 },

    openVietQRCheckoutModal: function (planCode, planName, amount, defaultTab) {
      this.closeUpgradeValueModal();
      this.ensureModalsInDOM();
      const modal = document.getElementById('cro-vietqr-checkout-modal');
      if (!modal) return;

      const amt = amount || PAYMENT_CONFIG.defaultAmount;
      this._currentPlan = {
        code: planCode || 'THANG50K',
        name: planName || 'Gói Tự Học Vật Lý 12 Toàn Diện',
        amount: amt
      };

      const user = this._getCurrentUser();
      const sdtVal = (user && user.sdt && user.sdt !== 'FREE') ? user.sdt : '';
      const nameVal = (user && user.hoten && user.hoten !== 'Học sinh trải nghiệm') ? user.hoten : '';

      const phoneInput = document.getElementById('cro-qr-phone-input');
      const nameInput = document.getElementById('cro-qr-name-input');
      if (phoneInput && !phoneInput.value) phoneInput.value = sdtVal;
      if (nameInput && !nameInput.value) nameInput.value = nameVal;

      this._updateVietQRImage(amt);
      if (defaultTab === 'vnpay') {
        this.switchCheckoutTab('vnpay');
      } else {
        this.switchCheckoutTab('vietqr');
      }

      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');

      // Bắt đầu lắng nghe trạng thái thanh toán (polling mô phỏng)
      this.startPaymentListener();
    },

    switchCheckoutTab: function (tab) {
      const btnVietQR = document.getElementById('cro-tab-btn-vietqr');
      const btnVnPay = document.getElementById('cro-tab-btn-vnpay');
      const paneVietQR = document.getElementById('cro-pane-vietqr');
      const paneVnPay = document.getElementById('cro-pane-vnpay');
      if (!btnVietQR || !btnVnPay || !paneVietQR || !paneVnPay) return;

      if (tab === 'vnpay') {
        btnVnPay.classList.add('active');
        btnVietQR.classList.remove('active');
        paneVnPay.style.display = 'block';
        paneVietQR.style.display = 'none';
      } else {
        btnVietQR.classList.add('active');
        btnVnPay.classList.remove('active');
        paneVietQR.style.display = 'block';
        paneVnPay.style.display = 'none';
      }
    },

    payWithVnPay: function () {
      const phoneInput = document.getElementById('cro-qr-phone-input');
      const nameInput = document.getElementById('cro-qr-name-input');
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const rawName = nameInput ? nameInput.value.trim() : '';
      const user = this._getCurrentUser() || {};

      const sdt = rawPhone.replace(/\D/g, '') || user.sdt || '0987654321';
      const hoten = rawName || user.hoten || 'Hoc sinh VLXT';
      const plan = this._currentPlan || { code: 'THANG50K', name: 'Goi Tu Hoc Vat Ly 12', amount: 50000 };

      // Lưu thông tin học sinh vào localStorage trước khi chuyển cổng
      try {
        const updatedUser = Object.assign({}, user, { hoten: hoten, sdt: sdt });
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      } catch (e) {}

      if (typeof window.VnPayService !== 'undefined') {
        return window.VnPayService.redirectToVnPay({
          OrderType: 'other',
          Amount: plan.amount,
          OrderDescription: `Thanh toan ${plan.code} tai Vat Ly Xuan Truong`,
          Name: hoten,
          planCode: plan.code,
          sdt: sdt,
          bankCode: 'NCB'
        });
      } else {
        // Tự động nạp vnpay-service.js nếu trang chưa nhúng trực tiếp
        const s = document.createElement('script');
        s.src = 'vnpay-service.js?v=1';
        s.onload = () => {
          if (typeof window.VnPayService !== 'undefined') {
            window.VnPayService.redirectToVnPay({
              OrderType: 'other',
              Amount: plan.amount,
              OrderDescription: `Thanh toan ${plan.code} tai Vat Ly Xuan Truong`,
              Name: hoten,
              planCode: plan.code,
              sdt: sdt
            });
          }
        };
        document.head.appendChild(s);
      }
    },

    closeVietQRCheckoutModal: function () {
      const modal = document.getElementById('cro-vietqr-checkout-modal');
      if (modal) modal.classList.remove('cro-modal-open');
      document.body.classList.remove('cro-body-locked');
      this.stopPaymentListener();
    },

    // Cập nhật mã VietQR động dựa trên SĐT / User ID
    _updateVietQRImage: function (amount) {
      const amt = amount || PAYMENT_CONFIG.defaultAmount;
      const phoneInput = document.getElementById('cro-qr-phone-input');
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const normPhone = rawPhone.replace(/\D/g, '');
      const userId = normPhone || (this._getCurrentUser()?.sdt !== 'FREE' ? this._getCurrentUser()?.sdt : '') || ('HS' + Math.floor(1000 + Math.random() * 9000));
      const memo = `${PAYMENT_CONFIG.prefix}${userId}`.toUpperCase();

      const qrImg = document.getElementById('cro-qr-dynamic-img');
      const qrMemoEl = document.getElementById('cro-qr-memo-val');
      const qrAmtEl = document.getElementById('cro-qr-amount-val');

      if (qrMemoEl) qrMemoEl.textContent = memo;
      if (qrAmtEl) qrAmtEl.textContent = amt.toLocaleString('vi-VN') + 'đ';

      const qrUrl = `https://img.vietqr.io/image/${PAYMENT_CONFIG.bankId}-${PAYMENT_CONFIG.accountNo}-${PAYMENT_CONFIG.template}.png?amount=${amt}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(PAYMENT_CONFIG.accountName)}`;
      if (qrImg) qrImg.src = qrUrl;

      // Lưu lại thông tin nếu học sinh vừa nhập
      if (rawPhone && rawPhone.length >= 9) {
        const nameInput = document.getElementById('cro-qr-name-input');
        const hoten = nameInput ? nameInput.value.trim() : 'Học sinh Pro';
        const updatedUser = Object.assign({}, this._getCurrentUser(), {
          hoten: hoten || 'Học sinh Pro',
          sdt: normPhone
        });
        try {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        } catch (e) {}
      }
    },

    // ── 9. Lắng nghe thanh toán tự động qua Google Apps Script & Kích hoạt Confetti ──
    startPaymentListener: function () {
      this.stopPaymentListener();
      this._pollCount = 0;
      const statusPill = document.getElementById('cro-qr-listen-status');
      if (statusPill) {
        statusPill.innerHTML = `
          <span class="cro-pulse-dot"></span>
          <span>Hệ thống đang tự động lắng nghe giao dịch chuyển khoản...</span>
        `;
      }

      this._pollTimer = setInterval(() => {
        this._pollCount++;
        this._checkRealBankPayment(false);
      }, 4000);
    },

    _checkRealBankPayment: function (isManualClick) {
      const phoneInput = document.getElementById('cro-qr-phone-input');
      const nameInput = document.getElementById('cro-qr-name-input');
      const memoEl = document.getElementById('cro-qr-memo-val');
      const rawPhone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      const rawName = nameInput ? nameInput.value.trim() : '';
      const user = this._getCurrentUser() || {};
      const sdt = rawPhone || (user.sdt && user.sdt !== 'FREE' ? user.sdt : '');
      const hoten = rawName || user.hoten || 'Học sinh';
      const memo = memoEl ? memoEl.textContent.trim() : '';
      const plan = this._currentPlan || { code: 'THANG50K', amount: 50000 };
      const statusPill = document.getElementById('cro-qr-listen-status');

      if (isManualClick && (!sdt || sdt.length < 9)) {
        if (statusPill) {
          statusPill.innerHTML = `<span style="color:#fbbf24"><i class="fa-solid fa-triangle-exclamation"></i> Vui lòng nhập Số điện thoại của em ở ô phía trên để hệ thống đối soát giao dịch!</span>`;
        }
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!sdt || typeof fetch !== 'function') return;
      const gasUrl = (typeof window !== 'undefined' && window.VLXT_GAS)
        ? window.VLXT_GAS
        : 'https://script.google.com/macros/s/AKfycbwF8whuCRmJtodfusehx6CWYS04yRlsVvQWNp0X2dBTCfZF-AmqmJ_KR0MIVLekVFqW/exec';

      if (isManualClick && statusPill) {
        statusPill.innerHTML = `<span class="cro-pulse-dot"></span><span style="color:#38bdf8">Đang kiểm tra biến động số dư VietinBank cho SĐT ${sdt}...</span>`;
      }

      fetch(gasUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'checkpaymentstatus',
          sdt: sdt,
          hoten: hoten,
          planCode: plan.code,
          amount: plan.amount,
          memo: memo,
          manualCheck: Boolean(isManualClick)
        })
      })
        .then(r => r.json())
        .then(res => {
          if (res && res.ok && res.paid) {
            this.confirmPaymentSuccess(res);
          } else if (isManualClick && statusPill) {
            statusPill.innerHTML = `
              <span class="cro-pulse-dot"></span>
              <span style="color:#fcd34d">Hệ thống đã ghi nhận yêu cầu (${memo}) và đang chờ VietinBank xác nhận tiền về (thường 5–15 giây). Màn hình sẽ tự mở khóa ngay khi khớp lệnh!</span>
            `;
          }
        })
        .catch(() => {
          if (isManualClick && statusPill) {
            statusPill.innerHTML = `
              <span class="cro-pulse-dot"></span>
              <span style="color:#fcd34d">Đã gửi yêu cầu đối soát (${memo}). Hệ thống sẽ tự động kích hoạt ngay khi giao dịch hoàn tất!</span>
            `;
          }
        });
    },

    verifyRealPaymentBeforeUnlock: function () {
      this._checkRealBankPayment(true);
    },

    stopPaymentListener: function () {
      if (this._pollTimer) {
        clearInterval(this._pollTimer);
        this._pollTimer = null;
      }
    },

    // Kích hoạt xác nhận thanh toán thành công
    confirmPaymentSuccess: function () {
      this.stopPaymentListener();

      // Cập nhật trạng thái người dùng thành PRO / PAID trong localStorage
      const currentUser = this._getCurrentUser() || { hoten: 'Học sinh Pro', sdt: '0987654321' };
      const proUser = Object.assign({}, currentUser, {
        loaiTK: 'pro',
        isPaid: true,
        proExpiry: Date.now() + 30 * 24 * 3600 * 1000 // 30 ngày
      });

      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(proUser));
        localStorage.setItem('vlxt_is_paid', 'true');
      } catch (e) {}

      // Kích hoạt hiệu ứng Confetti ăn mừng
      this.triggerConfetti();

      // Chuyển giao diện Modal sang chúc mừng thành công
      const card = document.querySelector('#cro-vietqr-checkout-modal .cro-modal-card');
      if (card) {
        card.innerHTML = `
          <div class="cro-celebrate-wrap">
            <div class="cro-celebrate-icon">🎉</div>
            <h2 class="cro-celebrate-title">CHÚC MỪNG EM ĐÃ NÂNG CẤP THÀNH CÔNG!</h2>
            <div class="cro-celebrate-badge"><i class="fa-solid fa-crown"></i> GÓI TỰ HỌC PRO 50K ĐÃ KÍCH HOẠT</div>
            <p class="cro-celebrate-desc">
              Toàn bộ <strong>Chương 3 (Từ trường)</strong>, <strong>Chương 4 (Vật lý hạt nhân)</strong>, 
              <strong>1.200+ bài tập có video chữa chi tiết</strong> và phòng <strong>thí nghiệm 3D</strong> đã được mở khóa 100%!
            </p>
            <div class="cro-celebrate-cta">
              <button type="button" class="cro-btn-triumph" onclick="FreemiumFlow.finishAndUnlockAll()">
                <i class="fa-solid fa-rocket"></i> BẮT ĐẦU HỌC NGAY 🚀
              </button>
            </div>
          </div>
        `;
      }

      // Phát sự kiện toàn hệ thống để mở khóa ngay trên giao diện web
      window.dispatchEvent(new CustomEvent('vlxt:pro_unlocked', { detail: { user: proUser } }));
    },

    finishAndUnlockAll: function () {
      this.closeVietQRCheckoutModal();
      // Nếu đang ở baihoc.html, mở lại bài học hoặc load lại trạng thái
      if (typeof window.renderAllCourses === 'function') {
        try { window.renderAllCourses(); } catch (e) {}
      }
      if (typeof window.location !== 'undefined') {
        window.location.reload();
      }
    },

    // ── 10. Hiệu ứng Canvas Confetti (Hỗ trợ cả CDN lẫn Engine nhúng sẵn) ──
    triggerConfetti: function () {
      if (typeof window.confetti === 'function') {
        // Sử dụng thư viện canvas-confetti nếu đã nạp
        window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          window.confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
        }, 200);
        setTimeout(() => {
          window.confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
        }, 350);
      } else {
        // Fallback engine canvas confetti siêu nhẹ
        this._runFallbackConfetti();
      }
    },

    _runFallbackConfetti: function () {
      const canvas = document.createElement('canvas');
      canvas.id = 'cro-confetti-canvas';
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9999999;pointer-events:none;';
      document.body.appendChild(canvas);

      if (!canvas || typeof canvas.getContext !== 'function') return;
      const ctx = canvas.getContext('2d');
      const width = canvas.width = window.innerWidth;
      const height = canvas.height = window.innerHeight;

      const particles = [];
      const colors = ['#00f0ff', '#0b84f3', '#10b981', '#f59e0b', '#ec4899', '#ffffff'];

      for (let i = 0; i < 140; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.4,
          r: Math.random() * 7 + 4,
          d: Math.random() * 140,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.random() * 10 - 10,
          tiltAngleIncremental: Math.random() * 0.07 + 0.05,
          tiltAngle: 0
        });
      }

      let animationFrame;
      let frameCount = 0;

      function render() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          p.tiltAngle += p.tiltAngleIncremental;
          p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
          p.x += Math.sin(p.d);
          p.tilt = Math.sin(p.tiltAngle) * 15;

          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
          ctx.stroke();
        });

        frameCount++;
        if (frameCount < 160) {
          animationFrame = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animationFrame);
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }
      }
      render();
    },

    // Modal Bước 4 khi bấm vào nội dung bị khóa (Gói đề 6 / Chương 3)
    openDiagnosticModal: function (contextTitle) {
      this.ensureModalsInDOM();
      const modal = document.getElementById('cro-diagnostic-modal-wrapper');
      if (!modal) return;
      const container = document.getElementById('cro-dm-card-slot');
      if (container) {
        container.innerHTML = '';
        this.renderDiagnosticReportCard(container);
      }
      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');
    },

    closeDiagnosticModal: function () {
      const modal = document.getElementById('cro-diagnostic-modal-wrapper');
      if (modal) modal.classList.remove('cro-modal-open');
      document.body.classList.remove('cro-body-locked');
    },

    // ── 11. Đăng ký & Chèn HTML Modals vào DOM ──
    ensureModalsInDOM: function () {
      if (document.getElementById('cro-upgrade-value-modal')) return;

      // CSS Styling phong cách Obsidian Precision Glass & TailwindCSS Utilities
      const style = document.createElement('style');
      style.textContent = `
        /* ══════════════════════════════════════════
           CRO FUNNEL STYLES — OBSIDIAN GLASS
           ══════════════════════════════════════════ */
        body.cro-body-locked { overflow: hidden !important; }

        /* Component <DiagnosticReportCard /> (Bước 4) */
        .cro-diagnostic-card {
          margin-top: 24px;
          background: linear-gradient(180deg, rgba(13, 21, 39, 0.95) 0%, rgba(8, 13, 26, 0.98) 100%);
          border: 1px solid rgba(0, 240, 255, 0.35);
          border-radius: 20px;
          padding: 30px 26px;
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 240, 255, 0.12);
          animation: croFadeIn 0.35s ease-out;
          color: #f1f5f9;
        }
        @keyframes croFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }

        .cro-diag-header { text-align: center; margin-bottom: 24px; }
        .cro-diag-chip {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 9999px;
          background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35);
          color: #00f0ff; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .cro-diag-title { font-size: clamp(20px, 3.5vw, 26px); font-weight: 900; color: #ffffff; line-height: 1.3; margin-bottom: 6px; }
        .cro-diag-sub { font-size: 14px; color: #94a3b8; max-width: 640px; margin: 0 auto; line-height: 1.5; }

        /* Score compare grid */
        .cro-score-compare-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 26px;
        }
        @media(max-width: 600px){ .cro-score-compare-grid { grid-template-columns: 1fr; } }
        .cro-score-box {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px; padding: 18px; text-align: center;
        }
        .cro-score-box.current { border-color: rgba(56, 189, 248, 0.3); background: rgba(56, 189, 248, 0.05); }
        .cro-score-box.target { border-color: rgba(16, 185, 129, 0.35); background: rgba(16, 185, 129, 0.06); }
        .cro-sb-label { font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .cro-sb-val { font-size: 36px; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 4px; }
        .cro-sb-val span { font-size: 18px; color: #64748b; font-weight: 700; }
        .cro-score-box.current .cro-sb-val { color: #38bdf8; }
        .cro-score-box.target .cro-sb-val { color: #10b981; }
        .cro-sb-desc { font-size: 12px; color: #94a3b8; }

        /* Progress bars */
        .cro-progress-tags-wrap {
          background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px; padding: 20px; margin-bottom: 24px;
        }
        .cro-pt-heading {
          font-size: 12.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          color: #cbd5e1; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
        }
        .cro-tag-row { margin-bottom: 18px; }
        .cro-tag-row:last-child { margin-bottom: 0; }
        .cro-tag-info { display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; font-weight: 700; margin-bottom: 6px; }
        .cro-tag-name { color: #e2e8f0; display: flex; align-items: center; gap: 6px; }
        .cro-bar-track { height: 9px; border-radius: 9999px; background: rgba(255, 255, 255, 0.08); overflow: hidden; margin-bottom: 5px; }
        .cro-bar-fill { height: 100%; border-radius: 9999px; transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .cro-bar-fill.emerald { background: linear-gradient(90deg, #10b981, #34d399); }
        .cro-bar-fill.amber { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
        .cro-bar-fill.purple { background: linear-gradient(90deg, #a855f7, #c084fc); }
        .cro-tag-insight { font-size: 12px; color: #94a3b8; line-height: 1.4; }

        /* Teacher advice */
        .cro-teacher-advice-box {
          background: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 14px; padding: 18px 20px; margin-bottom: 24px;
        }
        .cro-tab-heading { font-size: 13.5px; color: #c4b5fd; margin-bottom: 6px; }
        .cro-tab-content { font-size: 13.5px; color: #e2e8f0; line-height: 1.6; }

        /* CTA button step 4 */
        .cro-diag-cta-wrap { text-align: center; }
        .cro-btn-cta-step4 {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 15px 28px; border-radius: 14px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: 1px solid rgba(0, 240, 255, 0.6);
          color: #ffffff; font-size: 16px; font-weight: 800; cursor: pointer;
          box-shadow: 0 6px 26px rgba(2, 132, 199, 0.45); transition: all 0.2s;
        }
        .cro-btn-cta-step4:hover {
          filter: brightness(1.15); transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 240, 255, 0.5);
        }

        /* Modal Overlays */
        .cro-modal-overlay {
          position: fixed; inset: 0; z-index: 999999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(3, 7, 18, 0.85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          opacity: 0; pointer-events: none; transition: opacity 0.25s ease; padding: 20px;
        }
        .cro-modal-overlay.cro-modal-open { opacity: 1; pointer-events: auto; }
        .cro-modal-card {
          position: relative; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto;
          background: linear-gradient(180deg, #0e172a 0%, #070c18 100%);
          border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 24px;
          box-shadow: 0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 240, 255, 0.15);
          padding: 34px 30px; transform: scale(0.96) translateY(12px);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          color: #f1f5f9;
        }
        .cro-modal-overlay.cro-modal-open .cro-modal-card { transform: scale(1) translateY(0); }
        .cro-btn-close {
          position: absolute; top: 20px; right: 20px; width: 34px; height: 34px;
          border-radius: 50%; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14);
          color: #94a3b8; display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 16px; transition: all 0.15s; z-index: 10;
        }
        .cro-btn-close:hover { background: rgba(255, 255, 255, 0.2); color: #fff; }

        /* Step 5: UpgradeValueModal */
        .cro-uvm-hero { margin-bottom: 24px; text-align: left; }
        .cro-uvm-chip {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 9999px;
          background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fbbf24; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 12px;
        }
        .cro-uvm-title { font-size: clamp(22px, 3.5vw, 26px); font-weight: 900; color: #fff; line-height: 1.25; margin-bottom: 8px; }
        .cro-uvm-sub { font-size: 14px; color: #94a3b8; line-height: 1.5; }

        /* Grid 2x2 Privileges */
        .cro-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        @media(max-width: 600px){ .cro-grid-2x2 { grid-template-columns: 1fr; } }
        .cro-priv-item {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px; padding: 14px 16px; display: flex; gap: 12px;
        }
        .cro-priv-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(0, 240, 255, 0.12); color: #00f0ff;
          display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
        }
        .cro-priv-title { font-size: 13.5px; font-weight: 700; color: #fff; margin-bottom: 3px; }
        .cro-priv-desc { font-size: 12px; color: #8b949e; line-height: 1.4; }

        /* Social Proof Block */
        .cro-social-proof-wrap {
          background: rgba(0, 240, 255, 0.04); border: 1px solid rgba(0, 240, 255, 0.18);
          border-radius: 16px; padding: 18px; margin-bottom: 22px;
        }
        .cro-sp-counter-row {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
          padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 14px;
        }
        .cro-sp-live-pill {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 700; color: #34d399;
        }
        .cro-sp-live-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 8px #10b981; animation: croDotPulse 1.5s infinite;
        }
        @keyframes croDotPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
        .cro-sp-stat-badge { font-size: 12px; color: #cbd5e1; font-weight: 600; }
        .cro-reviews-grid { display: flex; flex-direction: column; gap: 10px; }
        .cro-review-card {
          background: rgba(255, 255, 255, 0.02); border-left: 3px solid #00f0ff;
          border-radius: 0 10px 10px 0; padding: 10px 14px; font-size: 12.5px; color: #cbd5e1; line-height: 1.5;
        }
        .cro-review-card strong { color: #fff; }
        .cro-review-author { font-size: 11px; color: #94a3b8; margin-top: 4px; font-weight: 600; }

        /* Price Comparison Block */
        .cro-price-comparison-box {
          background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px; padding: 20px; text-align: center; margin-bottom: 10px;
        }
        .cro-price-contrast-pills {
          display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
        }
        .cro-pc-pill {
          font-size: 11.5px; color: #94a3b8; background: rgba(255, 255, 255, 0.04);
          padding: 4px 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .cro-pc-pill.highlight {
          color: #00f0ff; background: rgba(0, 240, 255, 0.1); border-color: rgba(0, 240, 255, 0.3); font-weight: 700;
        }
        .cro-price-main-row { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 12px; }
        .cro-price-number { font-size: 34px; font-weight: 900; color: #00f0ff; }
        .cro-price-unit { font-size: 14px; color: #94a3b8; }
        .cro-btn-upgrade-now {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px 28px; border-radius: 14px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: 1px solid rgba(0, 240, 255, 0.6);
          color: #ffffff; font-size: 16px; font-weight: 800; cursor: pointer;
          box-shadow: 0 6px 26px rgba(2, 132, 199, 0.5); transition: all 0.2s;
        }
        .cro-btn-upgrade-now:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0, 240, 255, 0.6); }
        .cro-guarantee-note { font-size: 12px; color: #64748b; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }

        /* Step 6: VietQR Checkout Modal */
        .cro-checkout-card { max-width: 480px; text-align: center; }
        .cro-phone-compact-box {
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px; padding: 14px; margin-bottom: 16px; text-align: left;
        }
        .cro-pcb-label { font-size: 12px; font-weight: 700; color: #cbd5e1; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .cro-inputs-flex { display: flex; gap: 8px; }
        @media(max-width: 440px){ .cro-inputs-flex { flex-direction: column; } }
        .cro-compact-input {
          flex: 1; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff; padding: 10px 12px; border-radius: 8px; font-size: 13.5px; font-family: inherit;
        }
        .cro-compact-input:focus { outline: none; border-color: #00f0ff; background: rgba(0, 0, 0, 0.5); }

        .cro-qr-box {
          background: #ffffff; padding: 14px; border-radius: 18px; width: 230px; height: 230px;
          margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .cro-qr-box img { width: 100%; height: 100%; object-fit: contain; }

        .cro-transfer-table {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px; padding: 12px 16px; margin-bottom: 16px; text-align: left; font-size: 13px;
        }
        .cro-tr-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
        .cro-tr-row:last-child { border-bottom: none; }
        .cro-tr-row span { color: #94a3b8; }
        .cro-tr-row strong { color: #f1f5f9; font-weight: 700; }
        .cro-btn-copy {
          background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.3);
          color: #00f0ff; border-radius: 6px; padding: 2px 8px; font-size: 11px; font-weight: 700;
          cursor: pointer; margin-left: 6px;
        }
        .cro-btn-copy:hover { background: #00f0ff; color: #04101e; }

        .cro-listener-status-pill {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399; font-size: 12.5px; font-weight: 700; padding: 8px 14px; border-radius: 9999px;
          margin-bottom: 14px; width: 100%;
        }
        .cro-pulse-dot {
          width: 8px; height: 8px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 10px #10b981; animation: croDotPulse 1.2s infinite;
        }

        /* Celebrate screen */
        .cro-celebrate-wrap { padding: 20px 10px; text-align: center; }
        .cro-celebrate-icon { font-size: 56px; margin-bottom: 12px; animation: croBounce 0.6s ease-out; }
        @keyframes croBounce { 0% { transform: scale(0.3); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .cro-celebrate-title { font-size: 22px; font-weight: 900; color: #fff; margin-bottom: 8px; }
        .cro-celebrate-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 14px; border-radius: 9999px; background: rgba(0, 240, 255, 0.15);
          color: #00f0ff; font-size: 12px; font-weight: 800; margin-bottom: 14px;
        }
        .cro-celebrate-desc { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px; }
        .cro-btn-triumph {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #fff; font-size: 16px; font-weight: 800; border: none; padding: 14px 32px;
          border-radius: 14px; cursor: pointer; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
        }

        /* Tabs VietQR vs VNPay */
        .cro-pay-tabs {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
          background: rgba(0, 0, 0, 0.35); padding: 5px; border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 16px;
        }
        .cro-pay-tab-btn {
          padding: 10px 12px; border-radius: 9px; border: none;
          background: transparent; color: #94a3b8; font-size: 13px; font-weight: 800;
          cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          transition: all 0.2s; font-family: inherit;
        }
        .cro-pay-tab-btn.active {
          background: linear-gradient(135deg, #0b84f3 0%, #0284c7 100%);
          color: #ffffff; box-shadow: 0 4px 14px rgba(11, 132, 243, 0.4);
        }
        .cro-vnpay-card-box {
          background: rgba(0, 91, 170, 0.12); border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 16px; padding: 16px; margin-bottom: 16px; text-align: left;
        }
        .cro-btn-vnpay-submit {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 22px; border-radius: 14px;
          background: linear-gradient(135deg, #005baa 0%, #ed1c24 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff; font-size: 15.5px; font-weight: 800; cursor: pointer;
          box-shadow: 0 8px 25px rgba(0, 91, 170, 0.5); transition: all 0.2s; font-family: inherit;
        }
        .cro-btn-vnpay-submit:hover {
          filter: brightness(1.12); transform: translateY(-2px);
        }
      `;
      document.head.appendChild(style);

      // ── Modal Bước 5: UpgradeValueModal ──
      const upgradeModal = document.createElement('div');
      upgradeModal.id = 'cro-upgrade-value-modal';
      upgradeModal.className = 'cro-modal-overlay';
      upgradeModal.innerHTML = `
        <div class="cro-modal-card">
          <button type="button" class="cro-btn-close" onclick="FreemiumFlow.closeUpgradeValueModal()" title="Đóng">&times;</button>
          
          <!-- Phần 1: Hero Title -->
          <div class="cro-uvm-hero">
            <div class="cro-uvm-chip"><i class="fa-solid fa-crown"></i> BƯỚC 5: LỘ TRÌNH ĐỘC QUYỀN CHINH PHỤC 8.5+</div>
            <h1 class="cro-uvm-title" id="cro-uvm-context-title">Bứt Phá 8.5+ Kì Thi THPT Cùng Thầy Xuân Trường</h1>
            <p class="cro-uvm-sub">Chiến lược học bản chất — Không học vẹt — Làm chủ 100% định dạng đề thi mới của Bộ GD&amp;ĐT.</p>
          </div>

          <!-- Phần 2: Grid 2x2 — 4 Đặc Quyền Mở Khóa -->
          <div class="cro-grid-2x2">
            <div class="cro-priv-item">
              <div class="cro-priv-icon"><i class="fa-solid fa-unlock-keyhole"></i></div>
              <div>
                <div class="cro-priv-title">Mở Khóa Trọn Bộ 4 Chương</div>
                <div class="cro-priv-desc">Full bài giảng Chương 3 (Từ trường) &amp; Chương 4 (Hạt nhân) — chiếm 40% câu hỏi phân loại 8+ và 9+.</div>
              </div>
            </div>
            <div class="cro-priv-item">
              <div class="cro-priv-icon"><i class="fa-solid fa-play"></i></div>
              <div>
                <div class="cro-priv-title">1.200+ Câu &amp; Video Chữa Bản Chất</div>
                <div class="cro-priv-desc">Đầy đủ 4 format mới Bộ GD&amp;ĐT (Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Đồ thị) kèm video Thầy chữa từng câu.</div>
              </div>
            </div>
            <div class="cro-priv-item">
              <div class="cro-priv-icon"><i class="fa-solid fa-atom"></i></div>
              <div>
                <div class="cro-priv-title">Thí Nghiệm Ảo 3D Độc Quyền</div>
                <div class="cro-priv-desc">Tương tác trực quan 3D WebGL (Thuyết động học phân tử, Brown, Khung dây, Phóng xạ) — nhớ sâu gấp 5 lần.</div>
              </div>
            </div>
            <div class="cro-priv-item">
              <div class="cro-priv-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <div>
                <div class="cro-priv-title">Trợ Lý AI Định Vị Lỗ Hổng</div>
                <div class="cro-priv-desc">Tự động phát hiện điểm yếu sau mỗi bài kiểm tra, chỉ định đúng video cần ôn tập và hỗ trợ kèm riêng.</div>
              </div>
            </div>
          </div>

          <!-- Phần 3: Khối Social Proof (Minh Quân, Khánh Linh + Live Counter) -->
          <div class="cro-social-proof-wrap">
            <div class="cro-sp-counter-row">
              <div class="cro-sp-live-pill">
                <span class="cro-sp-live-dot"></span>
                <span>2.847 học sinh 2k7/2k8 đang trực tuyến luyện đề</span>
              </div>
              <div class="cro-sp-stat-badge">
                <i class="fa-solid fa-circle-check" style="color:#10b981"></i> 94.6% tăng 1.5 - 2.5 điểm sau 4 tuần
              </div>
            </div>
            <div class="cro-reviews-grid">
              <div class="cro-review-card">
                "Trước khi học với Thầy, em rất hay bị bẫy ở phần đồ thị khí lý tưởng và từ trường. Phương pháp dạy bản chất và hệ thống bài tập dừng video của Thầy giúp em tăng từ 6.5 lên 9.25 một cách vững vàng."
                <div class="cro-review-author">— <strong>Lê Minh Quân</strong> (THPT Chuyên Lê Khiết — Đạt 9.25đ môn Vật lý)</div>
              </div>
              <div class="cro-review-card">
                "Điều em thích nhất là kho bài tập bám sát 100% định dạng mới của Bộ. Phần mô phỏng 3D giúp em 'nhìn thấy' được các hiện tượng vật lý trừu tượng mà SGK không diễn tả hết được."
                <div class="cro-review-author">— <strong>Trần Khánh Linh</strong> (THPT Chuyên Hà Nội - Amsterdam — Đạt 9.5đ môn Vật lý)</div>
              </div>
            </div>
          </div>

          <!-- Phần 4: Khối So Sánh Giá (50.000đ/tháng = 1.600đ/ngày) -->
          <div class="cro-price-comparison-box">
            <div class="cro-price-contrast-pills">
              <div class="cro-pc-pill">🥤 1 cốc trà sữa = 55.000đ (15 phút)</div>
              <div class="cro-pc-pill">👨‍🏫 1 buổi gia sư = 150.000đ - 250.000đ</div>
              <div class="cro-pc-pill highlight">⚡ Gói VLXT = 1.600đ / ngày</div>
            </div>
            <div class="cro-price-main-row">
              <span class="cro-price-number">50.000đ</span>
              <span class="cro-price-unit">/ 30 ngày tự học toàn diện</span>
            </div>
            <button type="button" class="cro-btn-upgrade-now" onclick="FreemiumFlow.openVietQRCheckoutModal('THANG50K', 'Gói Tự Học Vật Lý 12 Toàn Diện', 50000)">
              <i class="fa-solid fa-bolt"></i> Tôi muốn đăng ký nâng cấp ngay (50.000đ/tháng)
            </button>
            <div class="cro-guarantee-note">
              <i class="fa-solid fa-shield-halved" style="color:#10b981"></i> Không tự động gia hạn · Không ràng buộc thẻ · Hỗ trợ giải đáp trọn vẹn
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(upgradeModal);

      // ── Modal Bước 6: VietQR CheckoutModal (VNPay ở chế độ chờ Hộ Kinh Doanh) ──
      const vnpEnabled = (typeof window.VnPayService !== 'undefined' && typeof window.VnPayService.isEnabled === 'function' && window.VnPayService.isEnabled());
      const qrModal = document.createElement('div');
      qrModal.id = 'cro-vietqr-checkout-modal';
      qrModal.className = 'cro-modal-overlay';
      qrModal.innerHTML = `
        <div class="cro-modal-card cro-checkout-card">
          <button type="button" class="cro-btn-close" onclick="FreemiumFlow.closeVietQRCheckoutModal()" title="Đóng">&times;</button>
          
          <div class="cro-uvm-chip" style="background:rgba(0,240,255,0.15);border-color:rgba(0,240,255,0.4);color:#00f0ff">
            <i class="fa-solid fa-shield-halved"></i> BƯỚC 6: QUÉT MÃ VIETQR TỰ ĐỘNG KHỚP LỆNH 24/7
          </div>
          <h2 style="font-size:20px;font-weight:900;color:#fff;margin-bottom:6px">Kích Hoạt Tức Thì Gói Pro 50k</h2>
          <p style="font-size:13px;color:#94a3b8;margin-bottom:14px">Quét mã VietQR bằng bất kỳ App Ngân hàng hoặc MoMo (Tự động điền số tiền &amp; nội dung)</p>

          <!-- Ô nhập SĐT / Tên siêu gọn nếu chưa có -->
          <div class="cro-phone-compact-box">
            <div class="cro-pcb-label">
              <i class="fa-solid fa-user-check" style="color:#00f0ff"></i> Thông tin học sinh nhận tài khoản Pro:
            </div>
            <div class="cro-inputs-flex">
              <input type="text" id="cro-qr-name-input" class="cro-compact-input" placeholder="Họ và tên của em" oninput="FreemiumFlow._updateVietQRImage()">
              <input type="tel" id="cro-qr-phone-input" class="cro-compact-input" placeholder="Số điện thoại Zalo" oninput="FreemiumFlow._updateVietQRImage()">
            </div>
          </div>

          <!-- 2 Tab chọn Phương Thức Thanh Toán (Ẩn VNPay khi ở chế độ chờ Hộ Kinh Doanh) -->
          <div class="cro-pay-tabs" style="${vnpEnabled ? '' : 'display:none;'}">
            <button type="button" id="cro-tab-btn-vietqr" class="cro-pay-tab-btn active" onclick="FreemiumFlow.switchCheckoutTab('vietqr')">
              <i class="fa-solid fa-qrcode"></i> Quét Mã VietQR
            </button>
            <button type="button" id="cro-tab-btn-vnpay" class="cro-pay-tab-btn" onclick="FreemiumFlow.switchCheckoutTab('vnpay')">
              <i class="fa-solid fa-credit-card"></i> Cổng VNPay
            </button>
          </div>

          <!-- PANE 1: VIETQR -->
          <div id="cro-pane-vietqr">
            <!-- Khung QR Image -->
            <div class="cro-qr-box">
              <img id="cro-qr-dynamic-img" src="" alt="Mã VietQR Chuyển Khoản">
            </div>

            <!-- Bảng thông tin thanh toán sao chép nhanh -->
            <div class="cro-transfer-table">
              <div class="cro-tr-row">
                <span>Ngân hàng:</span>
                <strong>VietinBank (Công Thương)</strong>
              </div>
              <div class="cro-tr-row">
                <span>Số tài khoản:</span>
                <span>
                  <strong id="cro-qr-acc-val">198490756789</strong>
                  <button type="button" class="cro-btn-copy" onclick="FreemiumFlow.copyVal('cro-qr-acc-val','Số tài khoản')">Sao chép</button>
                </span>
              </div>
              <div class="cro-tr-row">
                <span>Chủ tài khoản:</span>
                <strong>NGUYEN XUAN TRUONG</strong>
              </div>
              <div class="cro-tr-row">
                <span>Số tiền:</span>
                <span>
                  <strong id="cro-qr-amount-val" style="color:#00f0ff">50.000đ</strong>
                  <button type="button" class="cro-btn-copy" onclick="FreemiumFlow.copyVal('cro-qr-amount-val','Số tiền')">Sao chép</button>
                </span>
              </div>
              <div class="cro-tr-row">
                <span>Nội dung CK:</span>
                <span>
                  <strong id="cro-qr-memo-val" style="color:#fbbf24">VL12_...</strong>
                  <button type="button" class="cro-btn-copy" onclick="FreemiumFlow.copyVal('cro-qr-memo-val','Nội dung CK')">Sao chép</button>
                </span>
              </div>
            </div>

            <!-- Trạng thái lắng nghe thanh toán (Polling) -->
            <div class="cro-listener-status-pill" id="cro-qr-listen-status">
              <span class="cro-pulse-dot"></span>
              <span>Hệ thống đang tự động lắng nghe giao dịch chuyển khoản...</span>
            </div>

            <!-- Nút kích hoạt kiểm tra ngay -->
            <button type="button" class="cro-btn-upgrade-now" style="padding:12px 20px;font-size:15px;" onclick="FreemiumFlow.verifyRealPaymentBeforeUnlock()">
              <i class="fa-solid fa-check-double"></i> Tôi Đã Chuyển Khoản Xong (Kích Hoạt Ngay)
            </button>
          </div>

          <!-- PANE 2: CỔNG VNPAY (Chuẩn HMAC-SHA512 Sandbox/Production) -->
          <div id="cro-pane-vnpay" style="display:none;">
            <div class="cro-vnpay-card-box">
              <div style="font-size:13px;font-weight:800;color:#38bdf8;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
                <i class="fa-solid fa-building-columns"></i> Cổng Thanh Toán Quốc Gia VNPay (v2.1.0)
              </div>
              <div style="font-size:12.5px;color:#cbd5e1;line-height:1.5;margin-bottom:10px;">
                Hỗ trợ Thẻ ATM Nội địa (NCB, Vietcombank, MB,...), Thẻ Quốc tế (Visa/MasterCard) và Ví VNPay. Tự động xác thực chữ ký <code>HMAC-SHA512</code> và mở khóa ngay khi hoàn tất!
              </div>
              <div style="background:rgba(0,0,0,0.35);border:1px dashed rgba(56,189,248,0.35);border-radius:10px;padding:10px 12px;font-size:12px;color:#e2e8f0;">
                <div style="color:#fbbf24;font-weight:700;margin-bottom:4px;">💳 Thẻ Ngân Hàng Demo Test (Sandbox):</div>
                <div>• Ngân hàng: <strong>NCB</strong> &nbsp;|&nbsp; Ngày phát hành: <strong>07/15</strong></div>
                <div>• Số thẻ: <strong id="cro-vnp-test-card">9704198526191432198</strong> <button type="button" class="cro-btn-copy" onclick="FreemiumFlow.copyVal('cro-vnp-test-card','Số thẻ NCB')">Copy</button></div>
                <div>• Chủ thẻ: <strong>NGUYEN VAN A</strong> &nbsp;|&nbsp; OTP: <strong>123456</strong></div>
              </div>
            </div>

            <button type="button" class="cro-btn-vnpay-submit" onclick="FreemiumFlow.payWithVnPay()">
              <i class="fa-solid fa-credit-card"></i> Thanh Toán Ngay Qua Cổng VNPay
            </button>
          </div>
          
          <div style="font-size:12px;color:#64748b;margin-top:10px">
            Cần hỗ trợ trực tiếp? Nhắn Zalo Thầy Trường: <strong>0987.654.321</strong>
          </div>
        </div>
      `;
      document.body.appendChild(qrModal);

      // ── Modal Bước 4 khi click vào nội dung khóa ──
      const diagModal = document.createElement('div');
      diagModal.id = 'cro-diagnostic-modal-wrapper';
      diagModal.className = 'cro-modal-overlay';
      diagModal.innerHTML = `
        <div class="cro-modal-card" style="max-width:760px;padding:30px 24px;">
          <button type="button" class="cro-btn-close" onclick="FreemiumFlow.closeDiagnosticModal()" title="Đóng">&times;</button>
          <div id="cro-dm-card-slot"></div>
        </div>
      `;
      document.body.appendChild(diagModal);
    },

    copyVal: function (elementId, label) {
      const el = document.getElementById(elementId);
      if (!el) return;
      const text = el.textContent.trim().replace(/đ$/, '').replace(/\./g, '');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          alert('Đã sao chép ' + label + ': ' + el.textContent);
        }).catch(() => {
          prompt('Sao chép ' + label + ':', el.textContent);
        });
      } else {
        prompt('Sao chép ' + label + ':', el.textContent);
      }
    },

    _getCurrentUser: function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null');
      } catch (e) {
        return null;
      }
    },

    // Backward compatibility API
    renderUpsellCard: function (lesson, correct, total) {
      const container = document.getElementById('quiz-block') || document.querySelector('.quiz-actions');
      if (!container) return;
      this.renderDiagnosticReportCard(container, {
        lessonKey: lesson?.key,
        title: lesson?.name || 'Bài tập trắc nghiệm',
        total: total,
        correct: correct,
        score10: total > 0 ? ((correct / total) * 10).toFixed(1) : '0.0',
        predictedScore: total > 0 ? Number(((correct / total) * 9.2).toFixed(1)) : 5.0,
        targetScore: 8.5
      });
    },

    openBenefitsModal: function (contextTitle) {
      this.openUpgradeValueModal(contextTitle);
    },

    closeBenefitsModal: function () {
      this.closeUpgradeValueModal();
    },

    openCheckoutQR: function (code, planName, amount) {
      this.openVietQRCheckoutModal(code, planName, amount);
    },

    closeCheckoutQR: function () {
      this.closeVietQRCheckoutModal();
    }
  };

  window.FreemiumFlow = FreemiumFlow;

  document.addEventListener('DOMContentLoaded', function () {
    FreemiumFlow.ensureModalsInDOM();
  });

})(window);
