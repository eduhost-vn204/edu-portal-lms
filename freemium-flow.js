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
      if (lower.includes('chương 1') || lower.includes('nhiệt') || 
          lower.includes('chương 2') || lower.includes('khí')) {
        return true;
      }
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

        // Tính điểm thi THPT dự kiến (Ma trận thang điểm 10 phản ánh chính xác kết quả bài test)
        const rawScore = total > 0 ? (correct / total) * 10 : 0;
        const predictedScore = Number(rawScore.toFixed(1));

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
          topicStats: payload.topicStats || {},
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
        correct: 0,
        score10: '0.0',
        predictedScore: 0.0,
        targetScore: 8.5,
        tagStats: {
          ly_thuyet: { total: 8, correct: 0, pct: 0, wrong: 8 },
          bay_don_vi: { total: 9, correct: 0, pct: 0, wrong: 9 },
          do_thi_vdc: { total: 3, correct: 0, pct: 0, wrong: 3 }
        }
      };

      const predicted = (stats.predictedScore !== undefined) ? Number(stats.predictedScore) : Number(stats.score10 || 0);
      const target = Number(stats.targetScore || 8.5);
      const gap = Number(Math.max(0, target - predicted).toFixed(1));
      const tags = stats.tagStats || {};

      const lyThuyet = tags.ly_thuyet || { total: 8, correct: 0, pct: 0, wrong: 8 };
      const bayDonVi = tags.bay_don_vi || { total: 9, correct: 0, pct: 0, wrong: 9 };
      const doThiVdc = tags.do_thi_vdc || { total: 3, correct: 0, pct: 0, wrong: 3 };

      const isZero = (stats.correct === 0 || predicted === 0);

      // Nhận xét sư phạm động và trung thực từ Thầy
      const topicStats = stats.topicStats || {};
      const weakTopics = Object.keys(topicStats).filter(t => {
        const item = topicStats[t];
        return item && (item.total - item.correct > 0);
      });
      const weakTopicNames = weakTopics.join(', ');

      let teacherAdvice = '';
      if (isZero) {
        teacherAdvice = 'Em chưa trả lời đúng câu nào trong bài test này (hoặc đã nộp bài khi chưa chọn đáp án). Đừng lo lắng! Kiến thức Vật lý 12 chương trình mới đòi hỏi hiểu sâu bản chất hiện tượng. Thầy đã mở sẵn bài học nền tảng trọng tâm ở Chương 1 & Chương 2 cho em, hãy bắt đầu ngay từ Video bài giảng và Mô phỏng 3D để lấy lại gốc và từng bước bứt phá nhé!';
      } else if (weakTopics.length > 0 && predicted < 8.5) {
        teacherAdvice = `Dữ liệu bài làm cho thấy em đã nỗ lực đạt <strong>${predicted}/10 điểm</strong>, tuy nhiên đang bị mất điểm ở chuyên đề <strong>${weakTopicNames}</strong>. Hãy bấm vào các bài học khắc phục tương ứng ngay bên dưới để lấp trọn vẹn lỗ hổng và bứt phá lên mốc 8.5+!`;
      } else if (predicted < 5.0) {
        teacherAdvice = 'Em đang bị hổng khá nhiều kiến thức nền tảng và thường xuyên mất điểm ở các câu hỏi lý thuyết cốt lõi cũng như đổi đơn vị. Hãy tập trung học lại các bài giảng nền tảng trọng tâm để xây chắc gốc trước khi làm bài tập nâng cao.';
      } else if (predicted < 7.0) {
        teacherAdvice = 'Em đã nắm được một phần kiến thức cơ bản, nhưng dữ liệu bài làm cho thấy em còn đánh rơi điểm ở các câu hỏi bẫy đổi đơn vị ($dm^3 \\leftrightarrow m^3, bar \\leftrightarrow Pa$) và biến đổi công thức. Hãy hoàn thành bài học khắc phục để bứt phá lên mốc 8.0+!';
      } else if (predicted < 8.5) {
        teacherAdvice = 'Nền tảng của em tương đối tốt! Lỗ hổng lớn nhất hiện tại là các câu hỏi đồ thị đa trục và vận dụng cao (VDC) ở Chương 3 (Từ trường) và Chương 4 (Hạt nhân). Tập trung khắc phục các dạng bài này sẽ giúp em tự tin chạm mốc 8.5+ đến 9+!';
      } else {
        teacherAdvice = 'Chúc mừng em! Em có tư duy vật lý rất xuất sắc và phản xạ chuẩn xác ở hầu hết các bẫy đề thi. Hãy tiếp tục duy trì phong độ và luyện thêm các đề thi thử chuẩn Bộ để tối đa hóa điểm 10!';
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
              <span class="cro-tag-pct" style="color:${lyThuyet.pct > 0 ? '#10b981' : '#94a3b8'}">${lyThuyet.correct}/${lyThuyet.total} câu (${lyThuyet.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill emerald" style="width: ${lyThuyet.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              ${lyThuyet.total === 0 ? 'Chưa có câu hỏi' : (lyThuyet.pct >= 75 ? '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> Nắm vững bản chất khái niệm · Đã kích hoạt phản xạ nhanh' : (lyThuyet.correct === 0 ? '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444"></i> Chưa trả lời đúng câu nào · Cần củng cố toàn diện khái niệm cốt lõi' : '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i> Cần rà soát lại các định nghĩa và điều kiện áp dụng định luật'))}
            </div>
          </div>

          <!-- Tag 2: Bẫy đơn vị -->
          <div class="cro-tag-row">
            <div class="cro-tag-info">
              <span class="cro-tag-name"><i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b"></i> 2. Phản Xạ Bẫy Đơn Vị &amp; Công Thức Biến Đổi</span>
              <span class="cro-tag-pct" style="color:${bayDonVi.pct > 0 ? '#f59e0b' : '#94a3b8'}">${bayDonVi.correct}/${bayDonVi.total} câu (${bayDonVi.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill amber" style="width: ${bayDonVi.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              ${bayDonVi.total === 0 ? 'Chưa có câu hỏi' : (bayDonVi.pct >= 75 ? '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> Phản xạ bẫy đổi đơn vị rất tốt' : (bayDonVi.correct === 0 ? '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444"></i> Chưa vượt qua bẫy đơn vị · Cần rèn luyện lại kỹ năng đổi đơn vị' : '<i class="fa-solid fa-circle-exclamation" style="color:#f59e0b"></i> Cảnh báo mất điểm oan: Thường nhầm lẫn $dm^3 \\leftrightarrow m^3$, nhiệt độ $K \\leftrightarrow ^\\circ C$ và góc pháp tuyến $\\alpha$.'))}
            </div>
          </div>

          <!-- Tag 3: Đồ thị & VDC -->
          <div class="cro-tag-row">
            <div class="cro-tag-info">
              <span class="cro-tag-name"><i class="fa-solid fa-chart-area" style="color:#a855f7"></i> 3. Tư Duy Đồ Thị Đa Trục &amp; Vận Dụng Cao (VDC)</span>
              <span class="cro-tag-pct" style="color:${doThiVdc.pct > 0 ? '#a855f7' : '#94a3b8'}">${doThiVdc.correct}/${doThiVdc.total} câu (${doThiVdc.pct}%)</span>
            </div>
            <div class="cro-bar-track">
              <div class="cro-bar-fill purple" style="width: ${doThiVdc.pct}%"></div>
            </div>
            <div class="cro-tag-insight">
              ${doThiVdc.total === 0 ? 'Chưa có câu hỏi' : (doThiVdc.pct >= 66 ? '<i class="fa-solid fa-circle-check" style="color:#10b981"></i> Tư duy đồ thị và bài toán thực tế tốt' : (doThiVdc.correct === 0 ? '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444"></i> Chưa giải được các câu đồ thị và vận dụng cao' : '<i class="fa-solid fa-circle-exclamation" style="color:#a855f7"></i> Điểm nghẽn then chốt: Chưa vững phương pháp giải nhanh đồ thị chu trình khí &amp; từ trường biến thiên.'))}
            </div>
          </div>
        </div>

        <!-- Lời nhận xét sư phạm từ Thầy -->
        <div class="cro-teacher-advice-box">
          <div class="cro-tab-heading">💡 <strong>Chỉ Dẫn Chiến Lược Từ Thầy Xuân Trường:</strong></div>
          <p class="cro-tab-content">
            ${teacherAdvice}
          </p>
        </div>

        <!-- Nút CTA sang Bước 5 -->
        <div class="cro-diag-cta-wrap">
          <button type="button" class="cro-btn-cta-step4" onclick="FreemiumFlow.openUpgradeValueModal('Lộ trình lấp lỗ hổng &amp; Bứt phá 8.5+ môn Vật lý 12')">
            <i class="fa-solid fa-arrow-trend-up" style="font-size:17px;color:#a5f3fc"></i>
            <span>Xem Lộ Trình Vá Lỗ Hổng &amp; Bứt Phá 8.5+ Cùng Thầy</span>
            <i class="fa-solid fa-arrow-right" style="font-size:14px"></i>
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
      // Nếu học sinh đã đăng ký Gói Tháng Pro, đổi nút trong modal thành Nâng cấp Gói Năm (399k) thay vì hiện lại Đăng ký Gói Tháng 50k
      const curUser = this._getCurrentUser();
      if (this.isPaidUser(curUser)) {
        const priceNum = modal.querySelector('.cro-price-number');
        const priceUnit = modal.querySelector('.cro-price-unit');
        const upgradeBtn = modal.querySelector('.cro-btn-upgrade-now');
        if (priceNum) priceNum.textContent = '399.000đ';
        if (priceUnit) priceUnit.textContent = '/ Trọn khóa cả năm XPS 2k9 (Đang dùng Gói Tháng Pro)';
        if (upgradeBtn) {
          upgradeBtn.innerHTML = '<i class="fa-solid fa-arrow-up-right-dots"></i> Nâng cấp lên Gói Trọn Năm XPS 2k9 (399.000đ)';
          upgradeBtn.setAttribute('onclick', "FreemiumFlow.openVietQRCheckoutModal('NAM399K', 'Trọn Khóa Cả Năm (XPS 2k9)', 399000)");
        }
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
      const user = this._getCurrentUser();
      if (!user || !user.sdt || user.sdt === 'FREE') {
        if (typeof alert === 'function') {
          alert('Em vui lòng đăng nhập tài khoản học sinh trước khi đăng ký gói học để hệ thống tự động lấy Họ tên & Số điện thoại kích hoạt gói nhé!');
        }
        if (typeof window !== 'undefined' && window.location) {
          window.location.href = 'login.html?from=' + encodeURIComponent(window.location.pathname + window.location.search);
        }
        return;
      }

      this.ensureModalsInDOM();
      const modal = document.getElementById('cro-vietqr-checkout-modal');
      if (!modal) return;

      const amt = amount || PAYMENT_CONFIG.defaultAmount;
      this._currentPlan = {
        code: planCode || 'THANG50K',
        name: planName || 'Gói Tự Học Vật Lý 12 Toàn Diện',
        amount: amt
      };

      const sdtVal = String(user.sdt).trim();
      const nameVal = (user.hoten && user.hoten !== 'Học sinh trải nghiệm') ? user.hoten : 'Học sinh';

      const phoneInput = document.getElementById('cro-qr-phone-input');
      const nameInput = document.getElementById('cro-qr-name-input');
      const accDisplay = document.getElementById('cro-qr-account-display');
      if (phoneInput) phoneInput.value = sdtVal;
      if (nameInput) nameInput.value = nameVal;
      if (accDisplay) accDisplay.textContent = `${nameVal} · ${sdtVal}`;

      this._updateVietQRImage(amt);
      if (defaultTab === 'vnpay') {
        this.switchCheckoutTab('vnpay');
      } else {
        this.switchCheckoutTab('vietqr');
      }

      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');

      // Bắt đầu lắng nghe trạng thái thanh toán tự động
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
    // Legacy ref: https://img.vietqr.io/image/ | VL12_
    _updateVietQRImage: function (amount) {
      const amt = amount || PAYMENT_CONFIG.defaultAmount;
      const phoneInput = document.getElementById('cro-qr-phone-input');
      const rawPhone = phoneInput ? phoneInput.value.trim() : '';
      const normPhone = rawPhone.replace(/\D/g, '');
      const userId = normPhone || (this._getCurrentUser()?.sdt !== 'FREE' ? this._getCurrentUser()?.sdt : '') || ('HS' + Math.floor(1000 + Math.random() * 9000));
      const planCode = (this._currentPlan && this._currentPlan.code) || 'THANG50K';
      const memo = `SEVQR VLXT ${userId} ${planCode}`.toUpperCase();

      const qrImg = document.getElementById('cro-qr-dynamic-img');
      const qrMemoEl = document.getElementById('cro-qr-memo-val');
      const qrAmtEl = document.getElementById('cro-qr-amount-val');

      if (qrMemoEl) qrMemoEl.textContent = memo;
      if (qrAmtEl) qrAmtEl.textContent = amt.toLocaleString('vi-VN') + 'đ';

      const qrUrl = `https://qr.sepay.vn/img?acc=${PAYMENT_CONFIG.accountNo}&bank=VietinBank&amount=${amt}&des=${encodeURIComponent(memo)}`;
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
    confirmPaymentSuccess: function (res) {
      this.stopPaymentListener();

      const currentUser = this._getCurrentUser() || { hoten: 'Học sinh Pro', sdt: '0987654321' };
      const plan = this._currentPlan || { code: 'THANG50K', name: 'Gói Tháng Linh Hoạt', amount: 50000 };
      const planCode = (res && res.planCode) || plan.code || 'THANG50K';
      const isYear = planCode === 'NAM399K' || planCode === 'VIP850K' || Number(plan.amount) >= 300000;
      const tier = (res && res.loaiTK) || (isYear ? 'premium' : 'pro');
      const nowMs = Date.now();
      const expiryMs = (res && Number(res.proExpiry)) || (nowMs + (isYear ? 365 : 30) * 24 * 3600 * 1000);
      const txId = (res && (res.transactionId || res.maGD)) || ('VQR-' + nowMs);
      const planName = plan.name || (planCode === 'VIP850K' ? 'Lớp Online Cùng Thầy (VIP)' : planCode === 'NAM399K' ? 'Trọn Khóa Cả Năm (XPS 2k9)' : 'Gói Tháng Linh Hoạt');

      const paymentRecord = {
        id: String(txId),
        transactionId: String(txId),
        gateway: 'VietQR',
        method: 'VietQR VietinBank',
        sdt: currentUser.sdt || '',
        hoten: currentUser.hoten || 'Học sinh Pro',
        planCode: planCode,
        planName: planName,
        loaiTK: tier,
        amount: Number((res && res.amount) || plan.amount || 50000),
        activatedAt: nowMs,
        paidAt: (res && res.paidAt) || new Date(nowMs).toISOString(),
        expiryAt: expiryMs,
        status: 'paid'
      };

      // Cập nhật trạng thái người dùng thành PRO / PAID trong localStorage
      const proUser = Object.assign({}, currentUser, {
        loaiTK: tier,
        isPaid: true,
        planCode: planCode,
        planName: planName,
        activatedAt: nowMs,
        proExpiry: expiryMs,
        trialExpiry: expiryMs,
        lastPayment: paymentRecord
      });

      try {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(proUser));
        localStorage.setItem('vlxt_is_paid', 'true');
        const hist = JSON.parse(localStorage.getItem('vlxt_payment_history') || '[]');
        const arr = Array.isArray(hist) ? hist : [];
        const exists = arr.some(x => String(x.transactionId || x.id) === String(paymentRecord.id));
        if (!exists) arr.unshift(paymentRecord);
        localStorage.setItem('vlxt_payment_history', JSON.stringify(arr.slice(0, 50)));
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

        /* ══════════════════════════════════════════
           GIAO DIỆN LÀM BÀI ĐỀ B CHUẨN XUÂN TRƯỜNG (BƯỚC 6)
           ══════════════════════════════════════════ */
        .retest-de-b-card {
          margin: 32px 0 40px;
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%);
          border: 1px solid rgba(0, 240, 255, 0.28);
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 240, 255, 0.1);
          color: #f1f5f9;
        }
        @media(max-width: 640px) {
          .retest-de-b-card { padding: 22px 16px; border-radius: 16px; }
        }

        .rdb-header {
          text-align: center;
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .rdb-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 9999px;
          background: rgba(0, 240, 255, 0.12);
          border: 1px solid rgba(0, 240, 255, 0.35);
          color: #00f0ff;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .rdb-title {
          font-size: clamp(20px, 3.5vw, 26px);
          font-weight: 900;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 8px;
        }
        .rdb-desc {
          font-size: 14px;
          color: #94a3b8;
          max-width: 620px;
          margin: 0 auto 16px;
          line-height: 1.5;
        }
        .rdb-prog-bar-wrap {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 16px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 100px;
          font-size: 13px;
          color: #cbd5e1;
        }
        .rdb-prog-bar-wrap strong { color: #00f0ff; }

        /* Từng Card Câu Hỏi */
        .retest-q-card {
          background: #0b1329;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 22px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
        }
        .retest-q-card:hover {
          border-color: rgba(0, 240, 255, 0.25);
        }
        .retest-q-card.is-correct {
          border-color: #10b981 !important;
          background: rgba(16, 185, 129, 0.04) !important;
        }
        .retest-q-card.is-wrong {
          border-color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.04) !important;
        }

        .rdb-q-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .rdb-q-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(11, 132, 243, 0.25) 100%);
          border: 1px solid rgba(0, 240, 255, 0.4);
          color: #00f0ff;
          font-size: 12px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .rdb-q-topic {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 600;
        }
        .rdb-level-badge {
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .rdb-level-badge.nb {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .rdb-level-badge.th {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .rdb-level-badge.vdc {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .rdb-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          padding: 3px 10px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.06);
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .rdb-status-pill.done {
          background: rgba(0, 240, 255, 0.12);
          color: #00f0ff;
          border-color: rgba(0, 240, 255, 0.3);
        }
        .rdb-status-pill.ok {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-color: #10b981;
          font-weight: 700;
        }
        .rdb-status-pill.err {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: #ef4444;
          font-weight: 700;
        }

        .rdb-q-stem {
          font-size: 15.5px;
          color: #f1f5f9;
          line-height: 1.7;
          margin-bottom: 20px;
          font-weight: 500;
        }

        /* Danh Sách Phương Án A, B, C, D */
        .rdb-opts-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .rdb-opt-item {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
        }
        .rdb-opt-item:hover {
          background: rgba(0, 240, 255, 0.06);
          border-color: rgba(0, 240, 255, 0.4);
          transform: translateX(4px);
        }
        .rdb-opt-radio {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
          color: #cbd5e1;
          transition: all 0.2s;
        }
        .rdb-opt-text {
          font-size: 14.5px;
          color: #e2e8f0;
          line-height: 1.5;
          flex: 1;
        }

        /* Khi được chọn */
        .rdb-opt-item.selected {
          background: rgba(0, 240, 255, 0.1) !important;
          border-color: #00f0ff !important;
          box-shadow: 0 0 14px rgba(0, 240, 255, 0.2) !important;
        }
        .rdb-opt-item.selected .rdb-opt-radio {
          background: #00f0ff !important;
          border-color: #00f0ff !important;
          color: #04101e !important;
          font-weight: 900 !important;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.6) !important;
        }

        /* Kết quả Đúng / Sai */
        .rdb-opt-item.correct-choice {
          background: rgba(16, 185, 129, 0.16) !important;
          border-color: #10b981 !important;
        }
        .rdb-opt-item.correct-choice .rdb-opt-radio {
          background: #10b981 !important;
          border-color: #10b981 !important;
          color: #ffffff !important;
        }
        .rdb-opt-item.wrong-choice {
          background: rgba(239, 68, 68, 0.16) !important;
          border-color: #ef4444 !important;
        }
        .rdb-opt-item.wrong-choice .rdb-opt-radio {
          background: #ef4444 !important;
          border-color: #ef4444 !important;
          color: #ffffff !important;
        }

        /* Khối Lời Giải Chi Tiết Của Thầy */
        .rdb-explain-box {
          margin-top: 16px;
          padding: 16px 18px;
          border-radius: 10px;
          background: rgba(2, 6, 23, 0.7);
          border-left: 4px solid #00f0ff;
          animation: croFadeIn 0.3s ease-out;
        }
        .rdb-explain-title {
          font-size: 13px;
          font-weight: 800;
          color: #00f0ff;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rdb-explain-body {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* Nút Nộp Bài & Hộp Kết Quả */
        .rdb-actions {
          margin-top: 28px;
          text-align: center;
        }
        .btn-submit-retest {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          padding: 16px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-size: 15.5px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-submit-retest:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.5);
          filter: brightness(1.1);
        }
        .rdb-result-summary {
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 14px;
          padding: 22px;
          text-align: center;
          animation: croFadeIn 0.3s ease-out;
        }
        .rdb-rs-score {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .rdb-rs-score strong { color: #10b981; }
        .rdb-rs-sub {
          font-size: 13.5px;
          color: #94a3b8;
          margin-bottom: 14px;
        }

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
          padding: 15px 30px; border-radius: 999px !important;
          background: linear-gradient(135deg, #0284c7 0%, #00b4d8 50%, #0077b6 100%) !important;
          border: 1px solid rgba(144, 224, 239, 0.6) !important;
          color: #ffffff !important;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
          font-size: 15.5px !important; font-weight: 800 !important; letter-spacing: -0.01em !important;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(0, 180, 216, 0.45) !important;
          transition: all 0.25s ease;
        }
        .cro-btn-cta-step4:hover {
          filter: brightness(1.12); transform: translateY(-2px);
          box-shadow: 0 10px 36px rgba(0, 240, 255, 0.6) !important;
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

        /* Retest Mastery Celebration Modal (Popup Đề B) */
        .mastery-box {
          max-width: 580px; text-align: center;
          background: linear-gradient(180deg, #0e172a 0%, #070c18 100%);
          border: 1.5px solid rgba(0, 240, 255, 0.45);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 45px rgba(0, 240, 255, 0.2);
          padding: 34px 28px;
        }
        .mm-confetti-icon {
          font-size: 52px; margin-bottom: 12px; display: inline-block;
          filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.6));
          animation: croBounce 0.6s ease-out;
        }
        .mm-title {
          font-size: 23px; font-weight: 900; color: #ffffff;
          background: linear-gradient(135deg, #00f0ff 0%, #fbbf24 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 8px; letter-spacing: -0.02em;
        }
        .mm-sub {
          font-size: 14.5px; color: #94a3b8; margin-bottom: 22px; line-height: 1.5;
        }
        .mm-sub strong { color: #f1f5f9; }
        .mm-compare-grid {
          display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 14px;
          margin-bottom: 18px;
        }
        .mm-box {
          background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px; padding: 16px 12px; text-align: center;
        }
        .mm-box.before {
          background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.3);
        }
        .mm-box.after {
          background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.45);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
        }
        .mm-label {
          font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .mm-box.before .mm-label { color: #f87171; }
        .mm-box.after .mm-label { color: #34d399; }
        .mm-val {
          font-size: 32px; font-weight: 900; line-height: 1; margin-bottom: 6px;
        }
        .mm-box.before .mm-val { color: #ef4444; }
        .mm-box.after .mm-val { color: #10b981; text-shadow: 0 0 16px rgba(16, 185, 129, 0.5); }
        .mm-note { font-size: 11.5px; color: #94a3b8; }
        .mm-arrow {
          font-size: 20px; color: #00f0ff; opacity: 0.8;
          display: flex; align-items: center; justify-content: center;
        }
        .mm-growth-badge {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35);
          color: #00f0ff; font-size: 13.5px; font-weight: 800; padding: 10px 18px;
          border-radius: 9999px; margin-bottom: 22px; width: 100%; box-sizing: border-box;
        }
        .mm-upsell-cta {
          background: rgba(15, 23, 42, 0.6); border: 1px dashed rgba(245, 158, 11, 0.35);
          border-radius: 18px; padding: 20px; text-align: center;
        }
        .mm-upsell-desc {
          font-size: 13.5px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px; text-align: left;
        }
        .mm-upsell-desc strong { color: #fbbf24; }
        .cro-btn-pro-action {
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 24px; border-radius: 14px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: 1px solid rgba(251, 191, 36, 0.5);
          color: #04101e; font-size: 15px; font-weight: 900; cursor: pointer;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); transition: all 0.2s; font-family: inherit;
        }
        .cro-btn-pro-action:hover { filter: brightness(1.15); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6); }
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

          <!-- Thẻ hiển thị tự động Tài khoản học sinh đã đăng nhập (không cần gõ lại Tên & SĐT) -->
          <div class="cro-phone-compact-box" style="display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(11,132,243,0.1);border-color:rgba(0,240,255,0.3);">
            <div>
              <div class="cro-pcb-label" style="margin-bottom:2px;">
                <i class="fa-solid fa-user-check" style="color:#00f0ff"></i> Tài khoản nhận gói nâng cấp Pro:
              </div>
              <div id="cro-qr-account-display" style="color:#fff;font-size:14px;font-weight:800;">Đang tải tài khoản...</div>
            </div>
            <span style="background:rgba(16,185,129,0.18);color:#34d399;border:1px solid rgba(16,185,129,0.35);font-size:11px;font-weight:800;padding:3px 8px;border-radius:99px;white-space:nowrap;">⚡ Tự khớp SĐT</span>
            <input type="hidden" id="cro-qr-name-input" value="">
            <input type="hidden" id="cro-qr-phone-input" value="">
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

            <!-- Nút khóa chờ ngân hàng tự động xác nhận (mở khóa tự động khi khớp lệnh) -->
            <!-- Legacy ref: Tôi Đã Chuyển Khoản Xong (Kích Hoạt Ngay) -->
            <button type="button" id="cro-btn-check-pay" class="cro-btn-upgrade-now" style="padding:12px 20px;font-size:14.5px;background:rgba(30,41,59,0.9);border:1px solid rgba(148,163,184,0.28);color:#94a3b8;cursor:not-allowed;box-shadow:none;" disabled>
              <i class="fa-solid fa-lock"></i> Đang Chờ Ngân Hàng Xác Nhận Tự Động...
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


    // ═══════════════════════════════════════════════════════════════════
    // BƯỚC 6: BÀI TEST KIỂM CHỨNG TIẾN BỘ (ĐỀ B - RETEST & PROGRESS COMPARISON)
    // ═══════════════════════════════════════════════════════════════════
    RETEST_BANKS: {
      'Vật lí nhiệt': [
        {
          q: 'Nhiệt lượng cần cung cấp để làm nóng chảy $0,5\\text{ kg}$ nước đá ở $0^\\circ\\text{C}$ là bao nhiêu? Biết nhiệt nóng chảy riêng của nước đá là $\\lambda = 3,34 \\times 10^5\\text{ J/kg}$.',
          options: ['A. $167\\text{ kJ}$', 'B. $334\\text{ kJ}$', 'C. $66,8\\text{ kJ}$', 'D. $83,5\\text{ kJ}$'],
          ans: 0,
          explain: 'Áp dụng công thức $Q = \\lambda m = 3,34 \\times 10^5 \\times 0,5 = 167000\\text{ J} = 167\\text{ kJ}$.'
        },
        {
          q: 'Công thức tính nhiệt dung riêng $c$ từ nhiệt lượng $Q$, khối lượng $m$ và độ tăng nhiệt độ $\\Delta t$ là:',
          options: ['A. $c = \\frac{Q}{m\\Delta t}$', 'B. $c = \\frac{m\\Delta t}{Q}$', 'C. $c = Qm\\Delta t$', 'D. $c = \\frac{Q\\Delta t}{m}$'],
          ans: 0,
          explain: 'Từ công thức $Q = mc\\Delta t \\Rightarrow c = \\frac{Q}{m\\Delta t}$.'
        },
        {
          q: 'Một ấm điện đun sôi $1,5\\text{ lít}$ nước từ $20^\\circ\\text{C}$. Biết $c = 4200\\text{ J/(kg.K)}$ và khối lượng riêng của nước là $1\\text{ kg/lít}$. Bỏ qua hao phí, nhiệt lượng nước đã thu vào là:',
          options: ['A. $504\\text{ kJ}$', 'B. $630\\text{ kJ}$', 'C. $126\\text{ kJ}$', 'D. $5040\\text{ J}$'],
          ans: 0,
          explain: '$Q = mc\\Delta t = 1,5 \\times 4200 \\times (100 - 20) = 504000\\text{ J} = 504\\text{ kJ}$.'
        },
        {
          q: 'Đồ thị biểu diễn nhiệt độ theo thời gian của một chất rắn kết tinh trong suốt quá trình nóng chảy có đặc điểm gì?',
          options: ['A. Là đoạn thẳng song song với trục thời gian', 'B. Luôn dốc lên không đổi', 'C. Là đường hypebol', 'D. Là đoạn thẳng dốc xuống'],
          ans: 0,
          explain: 'Trong suốt quá trình nóng chảy, chất rắn kết tinh duy trì nhiệt độ nóng chảy không đổi, do đó đồ thị nhiệt độ là đoạn nằm ngang (song song với trục thời gian).'
        },
        {
          q: 'Thả một thỏi nhôm $0,1\\text{ kg}$ ở $100^\\circ\\text{C}$ vào $0,2\\text{ kg}$ nước ở $20^\\circ\\text{C}$. Biết $c_{\\text{Al}} = 880\\text{ J/(kg.K)}$ và $c_{\\text{nước}} = 4200\\text{ J/(kg.K)}$. Bỏ qua hao phí nhiệt, nhiệt độ khi cân bằng nhiệt gần nhất với:',
          options: ['A. $27,6^\\circ\\text{C}$', 'B. $35,2^\\circ\\text{C}$', 'C. $22,4^\\circ\\text{C}$', 'D. $40,0^\\circ\\text{C}$'],
          ans: 0,
          explain: 'Phương trình cân bằng nhiệt: $m_1c_1(t_1 - t) = m_2c_2(t - t_2) \\Rightarrow 0,1 \\times 880 \\times (100 - t) = 0,2 \\times 4200 \\times (t - 20) \\Rightarrow t \\approx 27,6^\\circ\\text{C}$.'
        }
      ],
      'Khí lí tưởng': [
        {
          q: 'Trong quá trình biến đổi đẳng áp của một lượng khí lí tưởng xác định, nếu nhiệt độ tuyệt đối tăng lên 2 lần thì thể tích của khối khí sẽ:',
          options: ['A. Tăng lên 2 lần', 'B. Giảm đi 2 lần', 'C. Không thay đổi', 'D. Tăng lên 4 lần'],
          ans: 0,
          explain: 'Theo định luật Charles: $\\frac{V}{T} = \\text{const} \\Rightarrow$ Thể tích tỉ lệ thuận với nhiệt độ tuyệt đối, $T$ tăng 2 lần thì $V$ tăng 2 lần.'
        },
        {
          q: 'Một khối khí có thể tích $4\\text{ lít}$ ở áp suất $10^5\\text{ Pa}$. Nén đẳng nhiệt khối khí đến thể tích $2\\text{ lít}$ thì áp suất mới là:',
          options: ['A. $2 \\times 10^5\\text{ Pa}$', 'B. $0,5 \\times 10^5\\text{ Pa}$', 'C. $4 \\times 10^5\\text{ Pa}$', 'D. $10^5\\text{ Pa}$'],
          ans: 0,
          explain: 'Theo định luật Boyle: $p_1V_1 = p_2V_2 \\Rightarrow p_2 = \\frac{10^5 \\times 4}{2} = 2 \\times 10^5\\text{ Pa}$.'
        },
        {
          q: 'Một lượng khí ở nhiệt độ $27^\\circ\\text{C}$ có áp suất $1,5\\text{ atm}$. Nung nóng đẳng tích lượng khí này lên đến $127^\\circ\\text{C}$. Áp suất của khối khí lúc này bằng:',
          options: ['A. $2,0\\text{ atm}$', 'B. $3,0\\text{ atm}$', 'C. $7,05\\text{ atm}$', 'D. $1,8\\text{ atm}$'],
          ans: 0,
          explain: '$T_1 = 300\\text{ K}, T_2 = 400\\text{ K}$. Áp dụng Gay-Lussac: $p_2 = p_1 \\times \\frac{T_2}{T_1} = 1,5 \\times \\frac{400}{300} = 2,0\\text{ atm}$.'
        },
        {
          q: 'Phương trình nào sau đây diễn tả đúng định luật Charles đối với quá trình đẳng áp?',
          options: ['A. $\\frac{V}{T} = \\text{hằng số}$', 'B. $V \\cdot T = \\text{hằng số}$', 'C. $\\frac{p}{T} = \\text{hằng số}$', 'D. $p \\cdot V = \\text{hằng số}$'],
          ans: 0,
          explain: 'Định luật Charles cho quá trình đẳng áp: thương số giữa thể tích và nhiệt độ tuyệt đối là hằng số: $\\frac{V}{T} = \\text{const}$.'
        },
        {
          q: 'Trên hệ trục tọa độ $(p, V)$, đường biểu diễn quá trình đẳng nhiệt của một lượng khí lí tưởng có dạng là:',
          options: ['A. Nhánh đường hyperbol', 'B. Đường thẳng vuông góc với trục $p$', 'C. Đường thẳng kéo dài qua gốc tọa độ', 'D. Đường parabol'],
          ans: 0,
          explain: 'Đường đẳng nhiệt trên hệ trục $(p, V)$ có phương trình $p = \\frac{\\text{const}}{V}$, đồ thị là một nhánh hyperbol.'
        }
      ],
      'Từ trường': [
        {
          q: 'Từ thông qua một diện tích $S$ đặt trong từ trường đều $\\vec{B}$ được xác định bởi công thức nào sau đây?',
          options: ['A. $\\Phi = BS\\cos\\alpha$', 'B. $\\Phi = BS\\sin\\alpha$', 'C. $\\Phi = \\frac{BS}{\\cos\\alpha}$', 'D. $\\Phi = B^2S$'],
          ans: 0,
          explain: 'Từ thông $\\Phi = BS\\cos\\alpha$, với $\\alpha$ là góc hợp bởi vectơ pháp tuyến $\\vec{n}$ và cảm ứng từ $\\vec{B}$.'
        },
        {
          q: 'Đơn vị đo chuẩn của từ thông trong hệ đo lường quốc tế SI là:',
          options: ['A. Weber ($\\text{Wb}$)', 'B. Tesla ($\\text{T}$)', 'C. Henry ($\\text{H}$)', 'D. Volt ($\\text{V}$)'],
          ans: 0,
          explain: 'Đơn vị của từ thông là Weber ($\\text{Wb}$). $1\\text{ Wb} = 1\\text{ T} \\cdot \\text{m}^2$.'
        },
        {
          q: 'Theo định luật Faraday, độ lớn của suất điện động cảm ứng trong một mạch kín tỉ lệ với:',
          options: ['A. Tốc độ biến thiên của từ thông qua mạch', 'B. Độ lớn của từ trường', 'C. Diện tích của mạch', 'D. Điện trở của dây dẫn'],
          ans: 0,
          explain: 'Độ lớn suất điện động cảm ứng: $|e_c| = \\left|\\frac{\\Delta \\Phi}{\\Delta t}\\right|$, tỉ lệ với tốc độ biến thiên từ thông.'
        },
        {
          q: 'Lực từ tác dụng lên đoạn dây dẫn dài $l$ mang dòng điện $I$ đặt vuông góc với cảm ứng từ $B$ có độ lớn bằng:',
          options: ['A. $F = BIl$', 'B. $F = \\frac{BI}{l}$', 'C. $F = \\frac{Bl}{I}$', 'D. $F = B^2Il$'],
          ans: 0,
          explain: '$F = BIl\\sin 90^\\circ = BIl$.'
        },
        {
          q: 'Một khung dây phẳng có diện tích $10\\text{ cm}^2$ đặt vuông góc với đường sức của từ trường đều $B = 0,2\\text{ T}$. Từ thông qua khung dây bằng:',
          options: ['A. $2 \\times 10^{-4}\\text{ Wb}$', 'B. $2 \\times 10^{-3}\\text{ Wb}$', 'C. $0,2\\text{ Wb}$', 'D. $2 \\times 10^{-5}\\text{ Wb}$'],
          ans: 0,
          explain: 'Góc giữa $\\vec{n}$ và $\\vec{B}$ là $0^\\circ$. $\\Phi = BS\\cos 0^\\circ = 0,2 \\times (10 \\times 10^{-4}) \\times 1 = 2 \\times 10^{-4}\\text{ Wb}$.'
        }
      ],
      'Vật lí hạt nhân': [
        {
          q: 'Hạt nhân nguyên tử $_{11}^{23}\\text{Na}$ được cấu tạo từ bao nhiêu hạt proton và neutron?',
          options: ['A. $11\\text{ proton}$ và $12\\text{ neutron}$', 'B. $11\\text{ proton}$ và $23\\text{ neutron}$', 'C. $23\\text{ proton}$ và $11\\text{ neutron}$', 'D. $12\\text{ proton}$ và $11\\text{ neutron}$'],
          ans: 0,
          explain: '$Z = 11\\text{ proton}$, $N = A - Z = 23 - 11 = 12\\text{ neutron}$.'
        },
        {
          q: 'Năng lượng liên kết riêng của hạt nhân là đại lượng đặc trưng cho:',
          options: ['A. Mức độ bền vững của hạt nhân', 'B. Khối lượng của hạt nhân', 'C. Điện tích của hạt nhân', 'D. Bán kính hạt nhân'],
          ans: 0,
          explain: 'Năng lượng liên kết riêng $\\frac{W_{lk}}{A}$ là đại lượng đặc trưng cho mức độ bền vững của hạt nhân. Càng lớn thì hạt nhân càng bền vững.'
        },
        {
          q: 'Sau khoảng thời gian bằng 3 chu kì bán rã ($t = 3T$), tỉ lệ phần trăm số hạt nhân phóng xạ còn lại so với ban đầu là:',
          options: ['A. $12,5\\%$', 'B. $25\\%$', 'C. $33,3\\%$', 'D. $87,5\\%$'],
          ans: 0,
          explain: '$\\frac{N}{N_0} = 2^{-\\frac{t}{T}} = 2^{-3} = \\frac{1}{8} = 12,5\\%$.'
        },
        {
          q: 'Độ hụt khối $\\Delta m$ của hạt nhân $_{Z}^{A}X$ có khối lượng $m_X$ được tính bằng biểu thức:',
          options: ['A. $\\Delta m = [Zm_p + (A - Z)m_n] - m_X$', 'B. $\\Delta m = m_X - [Zm_p + (A - Z)m_n]$', 'C. $\\Delta m = Zm_p + Am_n$', 'D. $\\Delta m = Am_p - Zm_n$'],
          ans: 0,
          explain: 'Độ hụt khối là hiệu giữa tổng khối lượng các nucleon tạo thành hạt nhân và khối lượng thực tế của hạt nhân: $\\Delta m = [Zm_p + (A - Z)m_n] - m_X$.'
        },
        {
          q: 'Hạt nhân có năng lượng liên kết riêng càng lớn thì:',
          options: ['A. Càng bền vững', 'B. Càng kém bền vững', 'C. Có khối lượng càng lớn', 'D. Có độ hụt khối càng nhỏ'],
          ans: 0,
          explain: 'Hạt nhân có năng lượng liên kết riêng càng lớn thì liên kết giữa các nucleon càng chặt chẽ, hạt nhân càng bền vững.'
        }
      ]
    },

    _currentRetestTopic: 'Khí lí tưởng',
    _currentRetestLessonCode: '',
    _currentRetestLessonTitle: '',
    _currentRetestQuestions: null,
    _currentRetestSource: 'topic_fallback',
    _retestAnswers: {},
    _lessonRetestBank: null,
    _loadingRetestBankPromise: null,

    // Nạp ngân hàng Đề B phân theo 23 bài học trọng tâm từ data/retest_bank_by_lessons.json
    loadLessonRetestBank: function () {
      if (this._lessonRetestBank) return Promise.resolve(this._lessonRetestBank);
      if (this._loadingRetestBankPromise) return this._loadingRetestBankPromise;

      const self = this;
      // 1. Thử nạp đồng bộ nếu trong môi trường Node.js (test suites)
      try {
        if (typeof globalThis !== 'undefined' && globalThis.__VLXT_RETEST_BANK__) {
          self._lessonRetestBank = globalThis.__VLXT_RETEST_BANK__;
          return Promise.resolve(self._lessonRetestBank);
        }
        if (typeof process !== 'undefined' && process.versions && process.versions.node) {
          const _fs = (typeof fs !== 'undefined' ? fs : (typeof globalThis !== 'undefined' && globalThis.fs)) || 
                      (typeof process.getBuiltinModule === 'function' ? process.getBuiltinModule('fs') : null);
          if (_fs && _fs.readFileSync) {
            const raw = _fs.readFileSync('data/retest_bank_by_lessons.json', 'utf8');
            self._lessonRetestBank = JSON.parse(raw);
            return Promise.resolve(self._lessonRetestBank);
          }
        }
      } catch (e) {}

      // 2. Nạp qua fetch (Browser environment)
      if (typeof fetch === 'function') {
        this._loadingRetestBankPromise = fetch('data/retest_bank_by_lessons.json')
          .then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          })
          .then(function (data) {
            if (data && (data.lessons || data.byMaBai)) {
              self._lessonRetestBank = data;
              return data;
            }
            return null;
          })
          .catch(function () {
            return null;
          });
        return this._loadingRetestBankPromise;
      }

      return Promise.resolve(null);
    },

    // Lấy 5 câu hỏi Đề B: Ưu tiên theo mã bài học (lessonId / maBai), nếu chưa có mới fallback bộ 4 đề chung theo topic
    getRetestQuestions: function (lessonId, topicName) {
      if (!this._lessonRetestBank) {
        this.loadLessonRetestBank();
      }
      const bank = this._lessonRetestBank;
      let matchedLesson = null;

      if (bank) {
        const cleanId = String(lessonId || '').trim();
        // 1. Ưu tiên tìm theo maBai (ví dụ: 'B04e20f0ec67d', 'B1036d251af19')
        if (cleanId && bank.byMaBai && bank.byMaBai[cleanId]) {
          matchedLesson = bank.byMaBai[cleanId];
        }
        // 2. Tìm theo lessonCode (ví dụ: 'B01', 'B02', 'B10'...)
        if (!matchedLesson && cleanId && bank.lessons) {
          const upper = cleanId.toUpperCase();
          if (bank.lessons[upper]) {
            matchedLesson = bank.lessons[upper];
          } else {
            const m = upper.match(/^B0*(\d+)$/i);
            if (m) {
              const padCode = 'B' + String(m[1]).padStart(2, '0');
              if (bank.lessons[padCode]) {
                matchedLesson = bank.lessons[padCode];
              }
            }
          }
        }
        // 3. Tìm theo chuỗi tên bài hoặc key chứa 'Bxx' (ví dụ: 'B2. Lực liên kết...')
        if (!matchedLesson && cleanId && bank.lessons) {
          const m = cleanId.match(/\bB0*(\d+)\b/i);
          if (m) {
            const padCode = 'B' + String(m[1]).padStart(2, '0');
            if (bank.lessons[padCode]) {
              matchedLesson = bank.lessons[padCode];
            }
          }
        }
        // 4. Tìm theo so khớp tiêu đề bài trong bank
        if (!matchedLesson && cleanId && bank.lessons) {
          const lower = cleanId.toLowerCase();
          const foundKey = Object.keys(bank.lessons).find(function (k) {
            const l = bank.lessons[k];
            return l && l.tenBai && l.tenBai.toLowerCase().includes(lower);
          });
          if (foundKey) matchedLesson = bank.lessons[foundKey];
        }

        if (matchedLesson && Array.isArray(matchedLesson.questions) && matchedLesson.questions.length > 0) {
          return {
            questions: matchedLesson.questions,
            topic: matchedLesson.topic || topicName || 'Vật lí 12',
            lessonCode: matchedLesson.lessonCode || '',
            lessonTitle: matchedLesson.tenBai || '',
            chuong: matchedLesson.chuong || '',
            source: 'lesson'
          };
        }
      }

      // 5. Fallback về bộ 4 đề chung theo topic như cũ
      const normTopic = topicName || 'Khí lí tưởng';
      let questions = this.RETEST_BANKS[normTopic];
      let finalTopic = normTopic;
      if (!questions) {
        const keys = Object.keys(this.RETEST_BANKS);
        const matched = keys.find(function (k) {
          return normTopic.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(normTopic.toLowerCase());
        });
        questions = matched ? this.RETEST_BANKS[matched] : this.RETEST_BANKS['Khí lí tưởng'];
        finalTopic = matched || 'Khí lí tưởng';
      }

      return {
        questions: questions || this.RETEST_BANKS['Khí lí tưởng'],
        topic: finalTopic,
        lessonCode: '',
        lessonTitle: '',
        chuong: '',
        source: 'topic_fallback'
      };
    },

    // Render khối Đề B vào container
    renderRetestDeB: function (container, topicOrOptions, maybeLessonId) {
      this.ensureModalsInDOM();
      if (typeof container === 'string') container = document.querySelector(container);
      if (!container) return;

      let topicName = '';
      let lessonId = '';

      if (topicOrOptions && typeof topicOrOptions === 'object') {
        topicName = topicOrOptions.topic || topicOrOptions.topicName || '';
        lessonId = topicOrOptions.lessonId || topicOrOptions.maBai || topicOrOptions.lessonCode || topicOrOptions.key || '';
      } else {
        topicName = topicOrOptions || '';
        lessonId = maybeLessonId || '';
      }

      // Tự động suy luận lessonId từ URL / sessionStorage / DOM nếu caller chưa truyền
      if (!lessonId) {
        try {
          if (typeof window !== 'undefined') {
            lessonId = window._lessonCurrentKey || 
                       sessionStorage.getItem('vlxt_remedial_lesson') || 
                       (new URLSearchParams(window.location.search).get('openLesson')) ||
                       (window.location.hash.startsWith('#lesson/') ? window.location.hash.slice(8) : '');
          }
        } catch(e) {}
      }

      // Tự động suy luận topicName nếu caller chưa truyền
      if (!topicName) {
        try {
          if (typeof window !== 'undefined') {
            const rawTop = sessionStorage.getItem('vlxt_remedial_topic') || (new URLSearchParams(window.location.search).get('topic'));
            if (rawTop) topicName = decodeURIComponent(rawTop);
          }
        } catch(e) {}
      }

      const qBundle = this.getRetestQuestions(lessonId, topicName);
      const questions = qBundle.questions;
      this._currentRetestLessonId = lessonId || (qBundle && qBundle.lessonCode);
      this._currentRetestTopic = qBundle.topic;
      this._currentRetestLessonCode = qBundle.lessonCode;
      this._currentRetestLessonTitle = qBundle.lessonTitle;
      this._currentRetestQuestions = questions;
      this._currentRetestSource = qBundle.source;
      this._retestAnswers = {};
      this._retestSubmitted = false;

      const letters = ['A', 'B', 'C', 'D'];
      let qHtml = '';

      questions.forEach((q, idx) => {
        let optHtml = '';
        const opts = Array.isArray(q.options) ? q.options : ['A.', 'B.', 'C.', 'D.'];
        opts.forEach((opt, oIdx) => {
          let cleanText = opt;
          const letterMatch = opt.match(/^[A-D]\.\s*(.*)/i);
          if (letterMatch) cleanText = letterMatch[1];

          optHtml += `
            <div class="rdb-opt-item" id="rdb-opt-${idx}-${oIdx}" onclick="FreemiumFlow.selectRetestOption(${idx}, ${oIdx})">
              <div class="rdb-opt-radio">
                <span class="rdb-opt-letter">${letters[oIdx]}</span>
              </div>
              <div class="rdb-opt-text">${cleanText}</div>
            </div>
          `;
        });

        const levelBadge = q.level === 'van_dung' ? '<span class="rdb-level-badge vdc"><i class="fa-solid fa-bolt"></i> Vận dụng · Bẫy</span>' :
                          (q.level === 'thong_hieu' ? '<span class="rdb-level-badge th"><i class="fa-solid fa-calculator"></i> Thông hiểu</span>' : 
                          '<span class="rdb-level-badge nb"><i class="fa-solid fa-book-open"></i> Nhận biết</span>');

        const topicBadgeText = this._currentRetestLessonCode 
          ? `${this._currentRetestLessonCode} · ${this._currentRetestTopic}`
          : this._currentRetestTopic;

        qHtml += `
          <div class="retest-q-card" id="retest-q-${idx}">
            <div class="rdb-q-top">
              <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                <span class="rdb-q-badge"><i class="fa-solid fa-cube"></i> Câu ${idx + 1} / ${questions.length}</span>
                <span class="rdb-q-topic">${topicBadgeText}</span>
                ${levelBadge}
              </div>
              <span class="rdb-status-pill" id="rdb-status-${idx}">
                <i class="fa-regular fa-circle"></i> Chưa làm
              </span>
            </div>
            <div class="rdb-q-stem">${q.q}</div>
            <div class="rdb-opts-list">${optHtml}</div>
            <div class="rdb-explain-box" id="rdb-explain-${idx}" style="display:none;">
              <div class="rdb-explain-title"><i class="fa-solid fa-lightbulb"></i> Lời giải chi tiết của Thầy:</div>
              <div class="rdb-explain-body">${q.explain}</div>
            </div>
          </div>
        `;
      });

      const titleDisplay = this._currentRetestLessonTitle 
        ? `<span style="color:#00f0ff">${this._currentRetestLessonTitle}</span>`
        : `<span style="color:#00f0ff">${this._currentRetestTopic}</span>`;

      const badgeText = this._currentRetestLessonCode
        ? `BƯỚC 6: BÀI TEST KIỂM CHỨNG TIẾN BỘ · ${this._currentRetestLessonCode}`
        : `BƯỚC 6: BÀI TEST KIỂM CHỨNG TIẾN BỘ`;

      const descText = `Gói 5 câu hỏi trọng tâm để chứng thực em đã làm chủ trọn vẹn bản chất sau khi học cùng Thầy. Hãy làm cẩn thận và xem lời giải chi tiết bên dưới nhé!`;

      const wrapper = document.createElement('div');
      wrapper.id = 'cro-retest-de-b-wrapper';
      wrapper.className = 'retest-de-b-card';
      wrapper.innerHTML = `
        <div class="rdb-header">
          <div class="rdb-badge"><i class="fa-solid fa-bullseye"></i> ${badgeText}</div>
          <h3 class="rdb-title">Kiểm Chứng Năng Lực: ${titleDisplay}</h3>
          <p class="rdb-desc">${descText}</p>
          <div class="rdb-prog-bar-wrap">
            <div class="rdb-prog-text">
              <span><i class="fa-solid fa-list-check"></i> Tiến độ hoàn thành:</span>
              <strong id="rdb-answered-count">0 / ${questions.length} câu</strong>
            </div>
          </div>
        </div>

        <div class="rdb-list">${qHtml}</div>

        <div class="rdb-actions" id="rdb-actions-slot">
          <button type="button" class="btn-submit-retest" id="btn-submit-retest-deb" onclick="FreemiumFlow.submitRetestDeB()">
            <i class="fa-solid fa-circle-check"></i> Nộp Bài Đề B &amp; Xem Biểu Đồ Bứt Phá Điểm Số <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;

      container.innerHTML = '';
      container.appendChild(wrapper);

      if (window.renderMathInElement) {
        try {
          renderMathInElement(wrapper, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {}
      }

      // Nếu đang dùng fallback do chưa nạp xong bank, tự nâng cấp khi bank tải về xong
      if (this._currentRetestSource === 'topic_fallback' && !this._lessonRetestBank && typeof fetch === 'function') {
        const self = this;
        this.loadLessonRetestBank().then(function (bank) {
          if (bank && !self._retestSubmitted && Object.keys(self._retestAnswers).length === 0) {
            const recheck = self.getRetestQuestions(lessonId, topicName);
            if (recheck.source === 'lesson') {
              self.renderRetestDeB(container, topicName, lessonId);
            }
          }
        }).catch(function () {});
      }
    },

    selectRetestOption: function (qIdx, oIdx) {
      if (this._retestSubmitted) return; // Đã nộp bài thì không sửa
      this._retestAnswers[qIdx] = oIdx;

      for (let i = 0; i < 4; i++) {
        const el = document.getElementById(`rdb-opt-${qIdx}-${i}`);
        if (el) el.classList.remove('selected');
      }
      const sel = document.getElementById(`rdb-opt-${qIdx}-${oIdx}`);
      if (sel) sel.classList.add('selected');

      const statusEl = document.getElementById(`rdb-status-${qIdx}`);
      if (statusEl) {
        statusEl.className = 'rdb-status-pill done';
        statusEl.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Đã chọn';
      }

      const answered = Object.keys(this._retestAnswers).length;
      const countEl = document.getElementById('rdb-answered-count');
      const totalQ = this._currentRetestQuestions ? this._currentRetestQuestions.length : 5;
      if (countEl) countEl.textContent = `${answered} / ${totalQ} câu`;
    },

    submitRetestDeB: function () {
      if (this._retestSubmitted) return;
      const topic = this._currentRetestTopic;
      const questions = this._currentRetestQuestions || this.RETEST_BANKS[topic] || this.RETEST_BANKS['Khí lí tưởng'];
      const ansCount = Object.keys(this._retestAnswers).length;
      
      // Nếu chưa làm hết số câu -> Mở modal HTML custom căn giữa màn hình (TUYỆT ĐỐI KHÔNG DÙNG confirm() native)
      if (ansCount < questions.length) {
        this.showRetestConfirmModal(ansCount, questions.length, () => {
          this._executeSubmitRetestDeB();
        });
        return;
      }

      this._executeSubmitRetestDeB();
    },

    showRetestConfirmModal: function (ansCount, total, onConfirm) {
      let modal = document.getElementById('vlxt-retest-confirm-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'vlxt-retest-confirm-modal';
        modal.className = 'cro-modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="cro-modal-card" style="max-width:440px;text-align:center;padding:32px 28px;">
          <div style="font-size:36px;color:#fbbf24;margin-bottom:12px;"><i class="fa-solid fa-triangle-exclamation"></i></div>
          <h3 style="font-size:20px;font-weight:900;color:#fff;margin-bottom:10px;">Xác nhận nộp bài Đề B</h3>
          <p style="font-size:14px;color:#cbd5e1;line-height:1.6;margin-bottom:24px;">
            Em mới làm <strong>${ansCount} / ${total} câu</strong>. Em có chắc chắn muốn nộp để xem kết quả và đối soát lời giải chi tiết không?
          </p>
          <div style="display:flex;gap:12px;justify-content:center;">
            <button type="button" class="btn-cancel-confirm" id="btn-retest-cancel" style="flex:1;padding:12px;border-radius:100px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#f1f5f9;font-weight:800;cursor:pointer;">
              Làm tiếp
            </button>
            <button type="button" class="btn-ok-confirm" id="btn-retest-ok" style="flex:1.2;padding:12px;border-radius:100px;background:linear-gradient(135deg,#00f0ff,#0b84f3);color:#04101e;font-weight:900;border:none;cursor:pointer;box-shadow:0 0 16px rgba(0,240,255,0.4);">
              Nộp bài ngay
            </button>
          </div>
        </div>
      `;

      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');

      const btnCancel = document.getElementById('btn-retest-cancel');
      if (btnCancel) {
        btnCancel.onclick = () => {
          modal.classList.remove('cro-modal-open');
          document.body.classList.remove('cro-body-locked');
        };
      }

      const btnOk = document.getElementById('btn-retest-ok');
      if (btnOk) {
        btnOk.onclick = () => {
          modal.classList.remove('cro-modal-open');
          document.body.classList.remove('cro-body-locked');
          if (typeof onConfirm === 'function') onConfirm();
        };
      }
    },

    _executeSubmitRetestDeB: function () {
      if (this._retestSubmitted) return;
      this._retestSubmitted = true;
      const topic = this._currentRetestTopic;
      const questions = this._currentRetestQuestions || this.RETEST_BANKS[topic] || this.RETEST_BANKS['Khí lí tưởng'];
      let correct = 0;

      questions.forEach((q, idx) => {
        const userAns = this._retestAnswers[idx];
        const isCorrect = (userAns === q.ans);
        if (isCorrect) correct++;

        const cardEl = document.getElementById(`retest-q-${idx}`);
        const statusEl = document.getElementById(`rdb-status-${idx}`);
        const explainEl = document.getElementById(`rdb-explain-${idx}`);

        if (cardEl) {
          cardEl.classList.remove('is-correct', 'is-wrong');
          cardEl.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
        }

        if (statusEl) {
          statusEl.className = `rdb-status-pill ${isCorrect ? 'ok' : 'err'}`;
          statusEl.innerHTML = isCorrect ? '<i class="fa-solid fa-check"></i> Làm đúng' : '<i class="fa-solid fa-xmark"></i> Làm sai';
        }

        // Đánh dấu phương án đúng / sai
        for (let i = 0; i < 4; i++) {
          const optEl = document.getElementById(`rdb-opt-${idx}-${i}`);
          if (optEl) {
            optEl.style.pointerEvents = 'none'; // Khóa click
            if (i === q.ans) {
              optEl.classList.add('correct-choice');
            } else if (i === userAns && !isCorrect) {
              optEl.classList.add('wrong-choice');
            }
          }
        }

        // Mở lời giải chi tiết
        if (explainEl) {
          explainEl.style.display = 'block';
        }
      });

      const deBScorePct = Math.round((correct / questions.length) * 100);

      // Đọc điểm test đầu vào từ bài chẩn đoán
      let preScorePct = 0;
      try {
        const rawRes = localStorage.getItem('vlxt_danhgianangluc_result');
        if (rawRes) {
          const parsed = JSON.parse(rawRes);
          if (parsed && parsed.topicStats) {
            const matchedKey = Object.keys(parsed.topicStats).find(k => topic.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(topic.toLowerCase()));
            if (matchedKey && parsed.topicStats[matchedKey].total > 0) {
              const stat = parsed.topicStats[matchedKey];
              preScorePct = Math.round((stat.correct / stat.total) * 100);
            }
          }
        }
      } catch (e) {}

      const growth = deBScorePct - preScorePct;

      // Thay thế nút nộp bài bằng hộp tổng kết ở CUỐI CÙNG (sau Câu 5)
      const actionSlot = document.getElementById('rdb-actions-slot');
      const nextRemedial = this.getNextRemedialTarget(this._currentRetestLessonId);
      const isZero = (correct === 0);
      const isAllDone = nextRemedial && nextRemedial.isAllDone;

      let summaryNoteHtml = '';
      let summaryButtonsHtml = '';

      if (isZero) {
        summaryNoteHtml = `
          <div style="background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);padding:14px 18px;border-radius:12px;margin:14px 0 18px;color:#fbbf24;font-size:14px;line-height:1.6;text-align:left;">
            <i class="fa-solid fa-triangle-exclamation"></i> <strong>Lời dặn của Thầy:</strong> Em chưa ghi điểm ở Đề B lần này. Đừng nản lòng nhé! Em hãy đọc thật kỹ lời giải chi tiết của Thầy ở từng câu phía trên để hiểu rõ nguyên nhân sai, sau đó bấm <strong>Luyện tập lại Đề B</strong> để nắm chắc kiến thức trước khi đi tiếp!
          </div>
        `;
        summaryButtonsHtml = `
          <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;">
            <button type="button" class="btn-retry-retest" onclick="FreemiumFlow.retryRetestDeB()" style="flex:1.4;min-width:220px;padding:15px 24px;border-radius:999px;background:linear-gradient(135deg,#00f0ff 0%,#0b84f3 100%);color:#04101e;border:none;font-weight:900;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 30px rgba(0,240,255,0.45);transition:all 0.25s;">
              <i class="fa-solid fa-rotate-left"></i> Luyện Tập Lại Đề B Này (Khuyên dùng)
            </button>
            <button type="button" class="btn-next-remedial" onclick="FreemiumFlow.goToNextRemedialLesson('${nextRemedial.key}', '${nextRemedial.topic}')" style="flex:1;min-width:200px;padding:15px 20px;border-radius:999px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.2);color:#cbd5e1;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.25s;">
              <span>Vá Lỗ Hổng Tiếp Theo (${nextRemedial.code || 'Bài mới'}) →</span>
            </button>
          </div>
        `;
      } else {
        summaryNoteHtml = `
          <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);padding:14px 18px;border-radius:12px;margin:14px 0 18px;color:#34d399;font-size:14px;line-height:1.6;text-align:left;">
            <i class="fa-solid fa-circle-check"></i> <strong>Rất xuất sắc!</strong> Em đã làm chủ dạng bài này và chứng thực tiến bộ sau khi học bài cùng Thầy. Hãy tiếp tục bứt phá các lỗ hổng tiếp theo!
          </div>
        `;
        const nextBtnTitle = isAllDone 
          ? '🎉 Hoàn Thành 4 Trạm: Đo Lường Điểm Số THPT (20 Câu) →'
          : `⚡ Vá Lỗ Hổng Tiếp Theo: ${nextRemedial.name.split(':')[0]} →`;
        summaryButtonsHtml = `
          <div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;">
            <button type="button" class="btn-next-remedial" onclick="FreemiumFlow.goToNextRemedialLesson('${nextRemedial.key}', '${nextRemedial.topic}')" style="flex:1.4;min-width:240px;padding:15px 24px;border-radius:999px;background:linear-gradient(135deg,#00f0ff 0%,#0b84f3 100%);color:#04101e;border:none;font-weight:900;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 30px rgba(0,240,255,0.45);transition:all 0.25s;">
              <i class="fa-solid fa-bolt"></i> ${nextBtnTitle}
            </button>
            <button type="button" class="btn-retry-retest" onclick="FreemiumFlow.retryRetestDeB()" style="flex:0.8;min-width:160px;padding:15px 18px;border-radius:999px;background:rgba(255,255,255,0.06);border:1.5px solid rgba(0,240,255,0.35);color:#00f0ff;font-weight:700;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.25s;">
              <i class="fa-solid fa-rotate-left"></i> Luyện Tập Lại
            </button>
          </div>
        `;
      }

      if (actionSlot) {
        actionSlot.innerHTML = `
          <div class="rdb-result-summary" style="margin-top:24px;padding:22px;border-radius:16px;background:linear-gradient(135deg,rgba(13,27,42,0.95),rgba(5,10,24,0.95));border:1.5px solid rgba(0,240,255,0.4);box-shadow:0 10px 40px rgba(0,0,0,0.6);">
            <div class="rdb-rs-score" style="font-size:18px;font-weight:800;color:#ffffff;display:flex;align-items:center;justify-content:center;gap:10px;">
              <i class="fa-solid fa-award" style="color:#00f0ff;font-size:22px;"></i>
              <span>KẾT QUẢ ĐỀ B KIỂM CHỨNG: <strong style="color:#00f0ff">ĐÚNG ${correct} / ${questions.length} CÂU (${deBScorePct}%)</strong></span>
            </div>
            ${summaryNoteHtml}
            ${summaryButtonsHtml}
          </div>
        `;
      }

      // Render KaTeX cho các khối lời giải vừa mở
      const wrap = document.getElementById('cro-retest-de-b-wrapper');
      if (wrap && window.renderMathInElement) {
        try {
          renderMathInElement(wrap, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {}
      }

      // Hiển thị Confetti ăn mừng CHỈ KHI có tiến bộ thực chất
      if (correct > 0 && typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }

      this._lastCelebrationData = {
        topic: this._currentRetestLessonTitle || topic,
        lessonCode: this._currentRetestLessonCode || '',
        correct: correct,
        total: questions.length,
        preScorePct: preScorePct,
        deBScorePct: deBScorePct,
        growth: growth
      };

      // THEO YÊU CẦU CỦA THẦY: TUYỆT ĐỐI KHÔNG TỰ ĐỘNG BUNG MODAL CHE PHỦ MÀN HÌNH!
      // Kết quả và nút chuyển tiếp đã được đặt ở CUỐI CÙNG sau Câu 5 để học sinh đọc lời giải chi tiết trước.
      // this.showMasteryCelebrationModal(this._lastCelebrationData);
    },

    openMasteryModalFromAction: function () {
      if (this._lastCelebrationData) {
        this.showMasteryCelebrationModal(this._lastCelebrationData);
      }
    },

    scrollToExplanation: function () {
      this.closeMasteryCelebrationModal();
      const wrap = document.getElementById('cro-retest-de-b-wrapper');
      if (wrap) {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    goToNextLessonFree: function () {
      this.closeMasteryCelebrationModal();
      // Chuyển sang bài học tiếp theo trong chương
      if (typeof window.route === 'function') {
        const nextBtn = document.querySelector('.btn-next-lesson') || document.querySelector('[data-action="next-lesson"]');
        if (nextBtn) {
          nextBtn.click();
          return;
        }
      }
      window.location.href = 'baihoc.html';
    },

    showMasteryCelebrationModal: function (data) {
      let modal = document.getElementById('cro-mastery-celebration-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cro-mastery-celebration-modal';
        modal.className = 'cro-modal-overlay';
        document.body.appendChild(modal);
      }

      const isZero = (data.correct === 0);
      const isImproved = (data.deBScorePct > data.preScorePct && data.correct > 0);
      const realGrowth = isImproved ? (data.deBScorePct - data.preScorePct) : 0;

      // Tiêu đề & Icon trung thực theo kết quả thật của học sinh
      const modalIcon = isZero ? '📝' : (isImproved ? '🏆' : '🎯');
      const modalTitle = isZero 
        ? 'KẾT QUẢ ĐỀ B KIỂM CHỨNG' 
        : (isImproved ? 'CHÚC MỪNG EM ĐÃ TIẾN BỘ!' : 'KẾT QUẢ ĐỀ B KIỂM CHỨNG');

      const feedbackNoteHTML = isZero ? `
        <div class="mm-growth-badge" style="background:rgba(245,158,11,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.35);">
          <i class="fa-solid fa-lightbulb"></i> Em chưa đạt điểm ở Đề B lần này. Đừng nản lòng nhé!
        </div>
        <p style="font-size:13.5px;color:#cbd5e1;line-height:1.6;margin:14px 0 20px;">
          Hãy cuộn xuống để xem kỹ <strong>Lời giải chi tiết của Thầy</strong> cho từng câu hỏi, đồng thời ôn lại phần <strong>Video bài giảng &amp; Mô phỏng 3D</strong> phía trên để nắm chắc bản chất nhé!
        </p>
      ` : (isImproved ? `
        <div class="mm-growth-badge">
          <i class="fa-solid fa-arrow-trend-up"></i> Tiến bộ thực chất +${realGrowth}% năng lực giải quyết dạng bài!
        </div>
        <p style="font-size:13.5px;color:#cbd5e1;line-height:1.6;margin:14px 0 20px;">
          Rất tốt! Em đã nắm vững phương pháp học bản chất cùng Thầy. Hãy tiếp tục duy trì tinh thần học tập này ở các bài học tiếp theo nhé!
        </p>
      ` : `
        <div class="mm-growth-badge" style="background:rgba(0,240,255,0.12);color:#00f0ff;border:1px solid rgba(0,240,255,0.3);">
          <i class="fa-solid fa-circle-check"></i> Đã hoàn thành 5 câu kiểm chứng Đề B!
        </div>
        <p style="font-size:13.5px;color:#cbd5e1;line-height:1.6;margin:14px 0 20px;">
          Đối chiếu lại lời giải chi tiết bên dưới để hoàn thiện các điểm còn vướng mắc nhé em!
        </p>
      `);

      // Nút hành động học tập thực chất (TUYỆT ĐỐI KHÔNG KHÈO GÓI PRO Ở ĐÂY)
      const nextRemedial = this.getNextRemedialTarget(this._currentRetestLessonId);
      const actionButtonsHTML = `
        <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px;">
          <button type="button" onclick="FreemiumFlow.goToNextRemedialLesson('${nextRemedial.key}', '${nextRemedial.topic}')" style="width:100%;padding:14px 20px;border-radius:12px;background:linear-gradient(135deg,#00f0ff 0%,#0b84f3 100%);color:#04101e;border:none;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 6px 25px rgba(0,240,255,0.45);display:flex;align-items:center;justify-content:center;gap:8px;">
            <i class="fa-solid fa-bolt"></i> Vá Lỗ Hổng Tiếp Theo (${nextRemedial.name.split(':')[0]}) →
          </button>
          <div style="display:flex;gap:10px;">
            <button type="button" onclick="FreemiumFlow.retryRetestDeB()" style="flex:1;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(0,240,255,0.35);color:#00f0ff;font-weight:700;font-size:13.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
              <i class="fa-solid fa-rotate-left"></i> Luyện Tập Lại Đề B
            </button>
            <button type="button" onclick="FreemiumFlow.scrollToExplanation()" style="flex:1;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.18);color:#cbd5e1;font-weight:600;font-size:13.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;">
              <i class="fa-solid fa-book-open"></i> Xem Lời Giải Chi Tiết ↓
            </button>
          </div>
        </div>
      `;

      modal.innerHTML = `
        <div class="cro-modal-card mastery-box">
          <button type="button" class="cro-btn-close" onclick="FreemiumFlow.closeMasteryCelebrationModal()" title="Đóng">&times;</button>
          <div class="mm-confetti-icon">${modalIcon}</div>
          <h2 class="mm-title">${modalTitle}</h2>
          <p class="mm-sub">Đo lường kết quả chuyên đề <strong>${data.topic}</strong> (Đúng <strong>${data.correct}/${data.total} câu</strong> Đề B):</p>

          <div class="mm-compare-grid">
            <div class="mm-box before">
              <div class="mm-label">TRƯỚC KHI HỌC</div>
              <div class="mm-val">${data.preScorePct}%</div>
              <div class="mm-note">Trong bài Test Chẩn Đoán</div>
            </div>
            <div class="mm-arrow"><i class="fa-solid fa-arrow-right"></i></div>
            <div class="mm-box after">
              <div class="mm-label">SAU KHI HỌC CÙNG THẦY</div>
              <div class="mm-val">${data.deBScorePct}%</div>
              <div class="mm-note">Kết quả Đề B kiểm chứng</div>
            </div>
          </div>

          ${feedbackNoteHTML}
          ${actionButtonsHTML}
        </div>
      `;

      modal.classList.add('cro-modal-open');
      document.body.classList.add('cro-body-locked');
    },

    closeMasteryCelebrationModal: function () {
      const modal = document.getElementById('cro-mastery-celebration-modal');
      if (modal) modal.classList.remove('cro-modal-open');
      document.body.classList.remove('cro-body-locked');
    },

    openProUpgradeFromRetest: function (topic) {
      this.closeMasteryCelebrationModal();
      this.openUpgradeValueModal(`Lộ trình bứt phá 8.5+ môn Vật lý 12 (Chuyên đề ${topic || 'Toàn Diện'})`);
    },

    
    getNextRemedialTarget: function (currentLessonKey) {
      try {
        // Chuỗi tuần tự chuẩn 4 chuyên đề Vật Lý 12:
        // Bài 2 (Nhiệt) -> Bài 11 (Khí) -> Bài 19 (Từ trường) -> Bài 29 (Hạt nhân)
        const sequence = [
          { key: 'B04e20f0ec67d', code: 'B02', topic: 'Vật lí nhiệt', name: 'Bài 2: Lực liên kết & Sự chuyển thể của chất' },
          { key: 'B4ca24b64572f', code: 'B11', topic: 'Khí lí tưởng', name: 'Bài 11: Định luật Boyle – Quá trình đẳng nhiệt' },
          { key: 'Bc71adbcb4dce', code: 'B19', topic: 'Từ trường', name: 'Bài 19: Cảm ứng từ & Lực từ' },
          { key: 'B600c414815cd', code: 'B29', topic: 'Vật lí hạt nhân', name: 'Bài 29: Năng lượng liên kết hạt nhân' }
        ];

        // Lấy currentKey từ tham số hoặc URL/session
        let currentKey = currentLessonKey;
        if (!currentKey && typeof window !== 'undefined') {
          const u = new URLSearchParams(window.location.search);
          currentKey = u.get('openLesson') || (window.location.hash.startsWith('#lesson/') ? window.location.hash.slice(8) : '') || sessionStorage.getItem('vlxt_remedial_lesson');
        }

        // Đọc danh sách các bài đã hoàn thành
        let completed = [];
        try {
          completed = JSON.parse(localStorage.getItem('vlxt_remedial_completed_list') || '[]');
        } catch(e) {}
        if (currentKey && !completed.includes(currentKey)) {
          completed.push(currentKey);
          try { localStorage.setItem('vlxt_remedial_completed_list', JSON.stringify(completed)); } catch(e) {}
        }

        // Tìm vị trí hiện tại trong chuỗi sequence
        const curIdx = sequence.findIndex(s => s.key === currentKey || (s.code && currentKey && currentKey.toUpperCase().includes(s.code)));

        if (curIdx >= 0) {
          // Lấy bài kế tiếp trong sequence
          if (curIdx + 1 < sequence.length) {
            return sequence[curIdx + 1];
          } else {
            // Đã hoàn thành cả 4 bài trọng tâm
            return {
              key: 'ALL_DONE',
              code: 'HOÀN THÀNH',
              topic: 'Toàn diện',
              name: 'Đo lường lại Năng lực (20 câu)',
              isAllDone: true
            };
          }
        }

        // Fallback an toàn theo mã bài
        if (currentKey === 'B04e20f0ec67d') return sequence[1];
        if (currentKey === 'B4ca24b64572f') return sequence[2];
        if (currentKey === 'Bc71adbcb4dce') return sequence[3];
        return sequence[1];
      } catch (e) {
        return { key: 'Bc71adbcb4dce', code: 'B19', topic: 'Từ trường', name: 'Bài 19: Cảm ứng từ & Lực từ' };
      }
    },

    retryRetestDeB: function () {
      this._retestUserAnswers = {};
      const wrap = document.getElementById('cro-retest-de-b-wrapper');
      if (wrap) {
        wrap.querySelectorAll('.rdb-opt').forEach(el => {
          el.classList.remove('selected', 'correct', 'wrong');
          el.style.pointerEvents = 'auto';
        });
        wrap.querySelectorAll('.rdb-explain').forEach(el => {
          el.style.display = 'none';
        });
      }
      const actionSlot = document.getElementById('rdb-actions-slot');
      if (actionSlot) {
        actionSlot.innerHTML = `
          <button type="button" class="btn-submit-retest" onclick="FreemiumFlow.submitRetestDeB()">
            <i class="fa-solid fa-paper-plane"></i> Nộp Bài Đề B &amp; Xem Sự Tiến Bộ →
          </button>
        `;
      }
      this.closeMasteryCelebrationModal();
      if (wrap) {
        wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },

    goToNextRemedialLesson: function (lessonKey, topic) {
      this.closeMasteryCelebrationModal();
      if (lessonKey === 'ALL_DONE') {
        window.location.href = 'danh-gia-nang-luc.html';
        return;
      }
      try {
        sessionStorage.setItem('vlxt_remedial_active', '1');
        sessionStorage.setItem('vlxt_remedial_topic', encodeURIComponent(topic || 'Khí lí tưởng'));
        sessionStorage.setItem('vlxt_remedial_lesson', lessonKey);
      } catch (e) {}
      window.location.href = 'baihoc.html?openLesson=' + encodeURIComponent(lessonKey) + '&remedial=1&topic=' + encodeURIComponent(topic || '') + '#lesson/' + encodeURIComponent(lessonKey);
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
        predictedScore: total > 0 ? Number(((correct / total) * 10).toFixed(1)) : 0.0,
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
    try { FreemiumFlow.loadLessonRetestBank(); } catch (e) {}
  });

  // Tự động nạp ngầm sớm ngân hàng Đề B nếu môi trường cho phép
  try {
    if (typeof FreemiumFlow.loadLessonRetestBank === 'function') {
      FreemiumFlow.loadLessonRetestBank();
    }
  } catch (e) {}

})(window);
