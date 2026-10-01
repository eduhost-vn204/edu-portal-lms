/**
 * BỘ ĐIỀU PHỐI VÀ ĐĂNG KÝ MÔ PHỎNG 3D VẬT LÝ — VẬT LÝ XUÂN TRƯỜNG
 * Registry trung tâm phủ 100% tất cả các bài học trên website.
 * Tự động ánh xạ bài học với mô hình 3D tương ứng, bám sát hiện tượng thực tế và lý thuyết cốt lõi.
 * Quản lý Lazy Loading Three.js, OrbitControls, GSAP & Memory Lifecycle.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimRegistry = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // BẢNG CẤU HÌNH CHI TIẾT 100% BÀI HỌC VẬT LÝ
  const REGISTRY_MAP = {
    // ══════════════════════════════════════════════════════════
    // CHƯƠNG 1 – VẬT LÝ NHIỆT
    // ══════════════════════════════════════════════════════════
    "B1036d251af19": { // B1
      id: "b1_cautrucchat",
      lessonNum: 1,
      title: "MÔ HÌNH 3D: CẤU TRÚC CHẤT & MÔ HÌNH ĐỘNG HỌC PHÂN TỬ",
      scriptUrl: "simulations/sim-b01-thuyet-dhpt.js",
      className: "SimB01ThuyetDHPT",
      mode: "structure",
      formulaTag: "Mô hình Động học phân tử & Cấu trúc 3 thể:",
      conceptText: "1) Các chất được cấu tạo từ các phân tử riêng rẽ; 2) Các phân tử chuyển động hỗn loạn không ngừng; chuyển động này càng nhanh thì nhiệt độ càng cao; 3) Giữa các phân tử có lực tương tác (hút và đẩy).",
      deltaPText: "Chuyển động nhiệt hỗn loạn & Lực liên kết",
      initialForce: "🧊 Thể Rắn (Dao động quanh VTCB)",
      hudStat1: "Nhiệt độ T = 300 K",
      hudStat2: "Trạng thái: Thể Rắn",
      description: "Mô hình 3D tương tác chuẩn kiến thức Bài 1: 1) Cấu trúc 3 Thể & Nhiệt độ (kéo thanh T để thấy dao động mạnh/nhanh hơn), 2) Lực liên kết phân tử (màu sắc trực quan hóa lực Rắn > Lỏng > Khí), 3) Thí nghiệm Brown (hạt phấn hoa / hạt bụi bị va chạm ziczac)."
    },
    "B04e20f0ec67d": { // B2
      id: "b2_chuyenthe",
      lessonNum: 2,
      title: "MÔ HÌNH 3D: LỰC LIÊN KẾT & SỰ CHUYỂN THỂ (RẮN - LỎNG - KHÍ)",
      scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
      className: "SimNhietChuyenThe",
      mode: "liquid",
      formulaTag: "Nhiệt nóng chảy & Hóa hơi:",
      formulaCore: "Q = \\lambda m \\quad ; \\quad Q = L m",
      deltaPText: "Chuyển đổi trạng thái tập hợp của chất",
      initialForce: "💧 Thể Lỏng (Trượt hỗn loạn)",
      hudStat1: "T = 300 K",
      hudStat2: "Lực liên kết: Trung bình",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Chuyển thể",
      btnHeroLabel: "Đổi thể chất",
      description: "Khi cung cấp nhiệt lượng, lực liên kết phân tử bị kéo dãn và phá vỡ: Rắn tan chảy thành Lỏng, Lỏng hóa hơi thành Khí."
    },
    "Bfb85fde44802": { // B3
      id: "b3_nhietdo_thangdo",
      lessonNum: 3,
      title: "MÔ HÌNH 3D: THANG NHIỆT ĐỘ KELVIN & CHUYỂN ĐỘNG NHIỆT",
      scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
      className: "SimNhietChuyenThe",
      mode: "solid",
      formulaTag: "Liên hệ thang nhiệt Kelvin & Celsius:",
      formulaCore: "T(K) = t(^\\circ C) + 273{,}15",
      deltaPText: "Nhiệt độ đo động năng chuyển động nhiệt",
      initialForce: "Độ không tuyệt đối (0 K: hạt đứng yên)",
      hudStat1: "T = 150 K (-123°C)",
      hudStat2: "Nhiệt kế Kelvin",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng nhiệt độ",
      btnHeroLabel: "Đổi thể chất",
      description: "Nhiệt độ tuyệt đối là số đo động năng chuyển động nhiệt hỗn loạn của các hạt vi mô cấu tạo nên chất."
    },
    "Bfc4552a2a3b2": { // B4
      id: "b4_nhietdungrieng",
      lessonNum: 4,
      title: "MÔ HÌNH 3D: NHIỆT DUNG RIÊNG & TRAO ĐỔI NHIỆT",
      scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
      className: "SimNhietChuyenThe",
      mode: "liquid",
      formulaTag: "Nhiệt lượng truyền trong trao đổi nhiệt:",
      formulaCore: "Q = m c \\Delta t",
      deltaPText: "Năng lượng làm tăng động năng phân tử",
      initialForce: "Truyền năng lượng nhiệt Q",
      hudStat1: "T = 300 K",
      hudStat2: "Q = mcΔt",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Cấp nhiệt Q",
      btnHeroLabel: "Đổi thể chất",
      description: "Cung cấp nhiệt lượng Q làm tăng nội năng và vận tốc chuyển động nhiệt hỗn loạn của hệ các phân tử."
    },
    "Be5b72ccf1261": { // B5
      id: "b5_noinang_ndlh1",
      lessonNum: 5,
      title: "MÔ HÌNH 3D: NỘI NĂNG & ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Định luật I Nhiệt động lực học:",
      formulaCore: "\\Delta U = Q + A",
      deltaPText: "Độ biến thiên nội năng = Nhiệt + Công",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "0 va chạm",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Cấp nhiệt Q",
      btnHeroLabel: "Nén thực hiện công A",
      description: "Độ biến thiên nội năng của khối khí bằng tổng công A thực hiện lên khối khí và nhiệt lượng Q khối khí nhận được."
    },
    "B0d8e14bf80dd": { // B6
      id: "b6_dongconhiet",
      lessonNum: 6,
      title: "MÔ HÌNH 3D: ĐỘNG CƠ NHIỆT & CHU TRÌNH PISTON",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Hiệu suất động cơ nhiệt:",
      formulaCore: "H = \\frac{|A'|}{Q_1} = \\frac{Q_1 - Q_2}{Q_1} \\le \\frac{T_1 - T_2}{T_1}",
      deltaPText: "Chuyển hóa nhiệt năng thành cơ năng",
      initialForce: "Xilanh sinh công",
      hudStat1: "T₁ = 600 K (Nóng)",
      hudStat2: "Sinh công A'",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nguồn nhiệt T₁",
      btnHeroLabel: "Chu trình Piston",
      description: "Động cơ nhiệt nhận nhiệt lượng Q1 từ nguồn nóng, sinh công cơ học A' đẩy piston và thải nhiệt lượng Q2 cho nguồn lạnh."
    },
    "Ba7a539a4d488": { // B7
      id: "b7_tongon_nhiet1",
      lessonNum: 7,
      title: "MÔ HÌNH 3D: TỔNG ÔN VẬT LÝ NHIỆT (P1)",
      scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
      className: "SimNhietChuyenThe",
      mode: "liquid",
      formulaTag: "Cốt lõi Vật lý nhiệt:",
      formulaCore: "\\Delta U = Q + A \\quad ; \\quad Q = mc\\Delta t",
      deltaPText: "Tổng hợp các hiện tượng nhiệt vi mô",
      initialForce: "Cấu trúc & Truyền nhiệt",
      hudStat1: "T = 300 K",
      hudStat2: "3 Thể của chất",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Chuyển thể",
      btnHeroLabel: "Đổi thể chất",
      description: "Tổng hợp trực quan cấu trúc hạt phân tử ở 3 thể Rắn - Lỏng - Khí và các quá trình truyền nhiệt lượng."
    },
    "B3b3bebe2a801": { // B8
      id: "b8_tongon_nhiet2",
      lessonNum: 8,
      title: "MÔ HÌNH 3D: TỔNG ÔN VẬT LÝ NHIỆT (P2)",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Tổng ôn Định luật I NĐLH:",
      formulaCore: "H = \\frac{|A'|}{Q_1} = 1 - \\frac{Q_2}{Q_1}",
      deltaPText: "Chu trình nhiệt & Hiệu suất",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "Piston xilanh",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Gia nhiệt T",
      btnHeroLabel: "Nén piston",
      description: "Tổng ôn định lượng các quá trình biến đổi nội năng, tính toán công và nhiệt lượng trong xilanh động cơ nhiệt."
    },

    // ══════════════════════════════════════════════════════════
    // CHƯƠNG 2 – KHÍ LÍ TƯỞNG
    // ══════════════════════════════════════════════════════════
    "B5d320f0a8875": { // B9
      id: "b9_mhdhpt_chatkhi",
      lessonNum: 9,
      title: "MÔ HÌNH 3D: MÔ HÌNH ĐỘNG HỌC PHÂN TỬ CHẤT KHÍ",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Giả thuyết Khí lí tưởng:",
      formulaCore: "p = \\frac{1}{3} \\mu m_0 \\overline{v^2}",
      deltaPText: "Chất điểm, va chạm đàn hồi",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "0 va chạm",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "Nén piston",
      description: "Chất khí gồm các phân tử chuyển động hỗn loạn không ngừng. Kích thước phân tử rất nhỏ so với khoảng cách giữa chúng."
    },
    "B557b8fccbc72": { // B10
      id: "b10_pt_trangthai",
      lessonNum: 10,
      title: "MÔ HÌNH 3D: PHƯƠNG TRÌNH TRẠNG THÁI KHÍ LÍ TƯỞNG",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Phương trình trạng thái:",
      formulaCore: "\\frac{p_1 V_1}{T_1} = \\frac{p_2 V_2}{T_2} = \\text{hằng số}",
      deltaPText: "Liên hệ đồng thời 3 thông số (p, V, T)",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "V ≈ 3.6 L",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng nhiệt T",
      btnHeroLabel: "Thay đổi thể tích V",
      description: "Mối quan hệ đồng thời giữa áp suất p, thể tích V và nhiệt độ tuyệt đối T của một khối lượng khí xác định."
    },
    "B4ca24b64572f": { // B11
      id: "b11_boyle",
      lessonNum: 11,
      title: "MÔ HÌNH 3D: ĐỊNH LUẬT BOYLE – QUÁ TRÌNH ĐẲNG NHIỆT",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "boyle",
      formulaTag: "Định luật Boyle (T = const):",
      formulaCore: "p V = \\text{hằng số} \\iff p_1 V_1 = p_2 V_2",
      deltaPText: "Khi V giảm 1/2 thì p tăng gấp 2",
      initialForce: "p ≈ 1.00 atm · V ≈ 3.6 L",
      hudStat1: "T = 300 K (Không đổi)",
      hudStat2: "Đẳng nhiệt",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Giữ đẳng nhiệt",
      btnHeroLabel: "Nén/Nhả Piston",
      description: "Khi nhiệt độ T không đổi, nén piston giảm thể tích V làm mật độ phân tử tăng tỉ lệ nghịch, số va chạm tăng làm áp suất p tăng."
    },
    "Bfbfa62b6cbf1": { // B12
      id: "b12_charles",
      lessonNum: 12,
      title: "MÔ HÌNH 3D: ĐỊNH LUẬT CHARLES – QUÁ TRÌNH ĐẲNG ÁP",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "charles",
      formulaTag: "Định luật Charles (p = const):",
      formulaCore: "\\frac{V}{T} = \\text{hằng số} \\iff \\frac{V_1}{T_1} = \\frac{V_2}{T_2}",
      deltaPText: "Nhiệt tăng làm khí dãn nở đẩy piston",
      initialForce: "p = 1.00 atm (Đẳng áp)",
      hudStat1: "T = 300 K",
      hudStat2: "Piston tự do",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nung nóng lửa T",
      btnHeroLabel: "Dãn nở thể tích V",
      description: "Khi áp suất giữ không đổi, nung nóng chất khí làm các hạt bay nhanh hơn, đẩy piston lên trên làm thể tích V tăng tỉ lệ thuận với T."
    },
    "B24bbd84d8ea9": { // B13
      id: "b13_gaylussac",
      lessonNum: 13,
      title: "MÔ HÌNH 3D: ĐỊNH LUẬT GAY-LUSSAC – QUÁ TRÌNH ĐẲNG TÍCH",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "gaylussac",
      formulaTag: "Định luật Gay-Lussac (V = const):",
      formulaCore: "\\frac{p}{T} = \\text{hằng số} \\iff \\frac{p_1}{T_1} = \\frac{p_2}{T_2}",
      deltaPText: "Bình kín V không đổi, áp kế kim quay vọt",
      initialForce: "p ≈ 1.00 atm (Ban đầu)",
      hudStat1: "T = 300 K",
      hudStat2: "V = const (Bình kín)",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nung nóng bình",
      btnHeroLabel: "Khoá kín thể tích",
      description: "Trong bình kín thể tích không đổi, tăng nhiệt độ làm các phân tử va đập dữ dội hơn vào thành bình, kim đồng hồ áp kế tăng vọt."
    },
    "B4f80e5e236f5": { // B14
      id: "b14_claperon",
      lessonNum: 14,
      title: "MÔ HÌNH 3D: PHƯƠNG TRÌNH CLAPERON – MENDELEEV",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Phương trình Claperon – Mendeleev:",
      formulaCore: "p V = n R T = \\frac{m}{M} R T",
      deltaPText: "R = 8.31 J/(mol·K)",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "n = 1.0 mol",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "Nén piston",
      description: "Mối liên hệ giữa 4 đại lượng: Áp suất p, Thể tích V, Lượng chất n (mol) và Nhiệt độ tuyệt đối T của khí lí tưởng."
    },
    "Bf5228f7e1791": { // B15
      id: "b15_apsuat_mhdhpt",
      lessonNum: 15,
      title: "MÔ HÌNH 3D: VA CHẠM PHÂN TỬ & ÁP SUẤT KHÍ",
      scriptUrl: "simulations/sim-b15-apsuat.js",
      className: "SimB15ApSuat",
      formulaTag: "Bản chất Áp suất vi mô:",
      formulaCore: "p = \\frac{1}{3}\\mu m_0 \\overline{v^2} = \\frac{2}{3}\\mu \\overline{W_d}",
      deltaPText: "Δp = 2m₀vₓ (Đàn hồi)",
      initialForce: "F ≈ 2.4 × 10⁻²¹ N",
      hudStat1: "T = 300 K",
      hudStat2: "0 va chạm",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "1 Hạt tiêu điểm",
      description: "Phân tử va chạm đàn hồi vào thành bình, truyền độ biến thiên động lượng Δp = 2m₀vₓ sinh ra lực nén F và áp suất p = F/S."
    },
    "B6c3fa5a4f9c6": { // B16
      id: "b16_dothi_khi",
      lessonNum: 16,
      title: "MÔ HÌNH 3D: ĐỒ THỊ TRẠNG THÁI KHÍ LÍ TƯỞNG",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Hệ tọa độ (p,V), (p,T), (V,T):",
      formulaCore: "p V = \\text{const} \\quad ; \\quad \\frac{V}{T} = \\text{const} \\quad ; \\quad \\frac{p}{T} = \\text{const}",
      deltaPText: "Biểu diễn trực quan các đẳng quá trình",
      initialForce: "Trạng thái (p, V, T)",
      hudStat1: "T = 300 K",
      hudStat2: "Điểm trạng thái",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Biến đổi T",
      btnHeroLabel: "Biến đổi V",
      description: "Quan sát trực tiếp sự thay đổi điểm trạng thái trên không gian 3D tương ứng với các đường đẳng nhiệt, đẳng tích, đẳng áp."
    },
    "B36a25d22d438": { // B17
      id: "b17_ndlh1_dangquatrinh",
      lessonNum: 17,
      title: "MÔ HÌNH 3D: ĐỊNH LUẬT I NĐLH ĐỐI VỚI CÁC ĐẲNG QUÁ TRÌNH",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Định luật I theo đẳng quá trình:",
      formulaCore: "\\text{Đẳng tích: } \\Delta U = Q \\quad ; \\quad \\text{Đẳng nhiệt: } Q = -A = A'",
      deltaPText: "Công và nhiệt lượng trong biến đổi",
      initialForce: "A' = p·ΔV",
      hudStat1: "T = 300 K",
      hudStat2: "Cân bằng năng lượng",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Truyền nhiệt Q",
      btnHeroLabel: "Sinh công A'",
      description: "Quá trình đẳng tích khối khí không sinh công (A = 0 => ΔU = Q); Quá trình đẳng nhiệt nội năng không đổi (ΔU = 0 => Q = A')."
    },
    "Bba8284ab6aae": { // B18
      id: "b18_tongon_khi1",
      lessonNum: 18,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG II – KHÍ LÍ TƯỞNG (P1)",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "general",
      formulaTag: "Hệ thống định luật chất khí:",
      formulaCore: "\\frac{p V}{T} = \\text{const} \\quad ; \\quad \\overline{E_d} = \\frac{3}{2} k T",
      deltaPText: "Tổng hợp các đẳng quá trình",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "Va chạm đàn hồi",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "Piston xilanh",
      description: "Tổng hợp trực quan vi mô và vĩ mô của chất khí lí tưởng: Động năng phân tử, áp suất vi mô và các định luật thực nghiệm."
    },
    "B3b28f5827d14": { // B19
      id: "b19_tongon_khi2",
      lessonNum: 19,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG II – KHÍ LÍ TƯỞNG (P2)",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "boyle",
      formulaTag: "Khí lí tưởng nâng cao:",
      formulaCore: "p = \\frac{2}{3} \\mu \\overline{W_d} = n_0 k T",
      deltaPText: "Mối liên hệ vi mô và vĩ mô",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "Đẳng nhiệt Boyle",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "Nén xilanh",
      description: "Rèn luyện và củng cố phương pháp giải các bài toán xilanh, piston, bình nối thông và đồ thị chu trình khí."
    },

    // ══════════════════════════════════════════════════════════
    // CHƯƠNG 3 – TỪ TRƯỜNG
    // ══════════════════════════════════════════════════════════
    "Bce1e3725b0e5": { // B21
      id: "b21_tutruong",
      lessonNum: 21,
      title: "MÔ HÌNH 3D: KHÔNG GIAN TỪ TRƯỜNG & ĐƯỜNG SỨC TỪ",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lorentz",
      formulaTag: "Đặc trưng của Từ trường:",
      formulaCore: "\\vec{B} \\quad (\\text{Vào Nam Ra Bắc: Ra N, Vào S})",
      deltaPText: "Đường sức từ cong khép kín trong không gian",
      initialForce: "B = 0.5 T",
      hudStat1: "Cực N (Đỏ) → Cực S (Xanh)",
      hudStat2: "Đường sức từ 3D",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo cực từ N-S",
      btnHeroLabel: "Đổi chế độ",
      description: "Từ trường là dạng vật chất tồn tại xung quanh hạt mang điện chuyển động hoặc nam châm, tác dụng lực từ lên nam châm khác hoặc dòng điện."
    },
    "Bc71adbcb4dce": { // B22
      id: "b22_camungtu_luctu",
      lessonNum: 22,
      title: "MÔ HÌNH 3D: CẢM ỨNG TỪ & LỰC TỪ LORENTZ XOẮN ỐC",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lorentz",
      formulaTag: "Lực Lorentz tác dụng lên điện tích:",
      formulaCore: "F_L = |q| v B \\sin\\alpha \\quad ; \\quad R = \\frac{m v}{|q| B}",
      deltaPText: "Quỹ đạo xoắn ốc Helical trong không gian 3D",
      initialForce: "F_L ≈ 3.2 × 10⁻¹⁴ N",
      hudStat1: "B = 0.5 T",
      hudStat2: "R = 0.7 m",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo chiều B",
      btnHeroLabel: "Đổi chế độ",
      description: "Hạt mang điện tích bay vào từ trường chịu lực từ Lorentz luôn vuông góc với vận tốc, uốn cong quỹ đạo thành đường xoắn ốc 3D."
    },
    "B03a8c3d57055": { // B23
      id: "b23_tuthong",
      lessonNum: 23,
      title: "MÔ HÌNH 3D: TỪ THÔNG & GÓC HỢP VỚI ĐƯỜNG SỨC TỪ",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lenz",
      formulaTag: "Công thức Từ thông qua diện tích S:",
      formulaCore: "\\Phi = B S \\cos\\alpha \\quad (\\alpha = (\\vec{n}, \\vec{B}))",
      deltaPText: "Số lượng đường sức từ xuyên qua mặt phẳng S",
      initialForce: "Từ thông Φ (Weber)",
      hudStat1: "B = 0.5 T · S = const",
      hudStat2: "Góc α thay đổi",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo chiều B",
      btnHeroLabel: "Xoay khung dây",
      description: "Từ thông đo lượng đường sức từ xuyên qua khung dây. Khi xoay khung dây hoặc đổi khoảng cách nam châm, từ thông biến thiên."
    },
    "Be44c36de0605": { // B24
      id: "b24_camung_lenz",
      lessonNum: 24,
      title: "MÔ HÌNH 3D: CẢM ỨNG ĐIỆN TỪ & ĐỊNH LUẬT LENZ",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lenz",
      formulaTag: "Bản chất Định luật Lenz:",
      formulaCore: "e_c = -\\frac{\\Delta\\Phi}{\\Delta t} \\quad (\\text{Chống lại nguyên nhân sinh ra nó})",
      deltaPText: "Dòng cảm ứng sinh từ trường ngược chiều",
      initialForce: "Dòng cảm ứng i_c phát sáng",
      hudStat1: "ΔΦ/Δt biến thiên",
      hudStat2: "Đèn LED bật sáng",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo cực nam châm",
      btnHeroLabel: "Chuyển động nam châm",
      description: "Khi nam châm di chuyển lại gần vòng dây, từ thông tăng làm xuất hiện dòng điện cảm ứng sinh ra từ trường chống lại sự tiến vào của nam châm."
    },
    "B470c1c579961": { // B25
      id: "b25_suatdiendong_faraday",
      lessonNum: 25,
      title: "MÔ HÌNH 3D: SUẤT ĐIỆN ĐỘNG CẢM ỨNG – ĐỊNH LUẬT FARADAY",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lenz",
      formulaTag: "Định luật Faraday:",
      formulaCore: "|e_c| = \\left| \\frac{\\Delta\\Phi}{\\Delta t} \\right| = N \\left| \\frac{\\Delta\\Phi}{\\Delta t} \\right|",
      deltaPText: "Độ lớn e_c tỉ lệ với tốc độ biến thiên từ thông",
      initialForce: "Suất điện động e_c",
      hudStat1: "Tốc độ dịch chuyển nhanh => e_c lớn",
      hudStat2: "Cuộn dây N vòng",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi chiều từ trường",
      btnHeroLabel: "Chế độ máy phát",
      description: "Độ lớn của suất điện động cảm ứng trong mạch kín tỉ lệ thuận với tốc độ biến thiên từ thông qua mạch đó."
    },
    "B7ec10a73d785": { // B26
      id: "b26_mayphat_xoaychieu",
      lessonNum: 26,
      title: "MÔ HÌNH 3D: KHUNG DÂY QUAY & MÁY PHÁT ĐIỆN XOAY CHIỀU",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "generator",
      formulaTag: "Suất điện động xoay chiều hình sin:",
      formulaCore: "e = E_0 \\cos(\\omega t) = \\omega N B S \\sin(\\omega t)",
      deltaPText: "Khung dây quay 360° đều trong từ trường",
      initialForce: "e = E₀·cos(ωt)",
      hudStat1: "f = 50 Hz · U = 220 V",
      hudStat2: "Khung quay 360°",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo chiều B",
      btnHeroLabel: "Đổi chế độ",
      description: "Khung dây dẫn quay đều trong từ trường, từ thông qua khung biến thiên điều hòa làm xuất hiện suất điện động xoay chiều hình sin."
    },
    "Bbce17157c399": { // B27
      id: "b27_ungdung_camung",
      lessonNum: 27,
      title: "MÔ HÌNH 3D: ỨNG DỤNG CẢM ỨNG ĐIỆN TỪ (DÒNG FU-CÔ & BẾP TỪ)",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "generator",
      formulaTag: "Hiện tượng dòng điện Foucault:",
      formulaCore: "P = I^2 R = \\frac{e_c^2}{R}",
      deltaPText: "Dòng xoáy Foucault sinh nhiệt trong khối kim loại",
      initialForce: "Cảm ứng điện từ thực tế",
      hudStat1: "Từ trường xoay chiều cao tần",
      hudStat2: "Dòng Fu-cô xoáy",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo chiều B",
      btnHeroLabel: "Đổi chế độ",
      description: "Từ trường biến thiên sinh ra dòng điện xoáy Foucault trong khối kim loại, ứng dụng trong phanh điện từ và nấu ăn bằng bếp từ."
    },
    "B7255c3f634b6": { // B28
      id: "b28_songdientu",
      lessonNum: 28,
      title: "MÔ HÌNH 3D: ĐIỆN TỪ TRƯỜNG & SÓNG ĐIỆN TỪ LAN TRUYỀN",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lorentz",
      formulaTag: "Bộ ba vector sóng điện từ:",
      formulaCore: "\\vec{E} \\perp \\vec{B} \\perp \\vec{v} \\quad ; \\quad \\lambda = \\frac{c}{f}",
      deltaPText: "Dao động đồng pha giữa điện trường và từ trường",
      initialForce: "v = c ≈ 3 × 10⁸ m/s",
      hudStat1: "Vector E ⊥ Vector B",
      hudStat2: "Sóng ngang 3D",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi pha sóng",
      btnHeroLabel: "Đổi chế độ",
      description: "Điện trường biến thiên sinh ra từ trường xoáy và ngược lại, tạo thành sóng điện từ lan truyền trong không gian 3D với tốc độ ánh sáng."
    },
    "Bd4a26cafa552": { // B29
      id: "b29_tongon_tutruong1",
      lessonNum: 29,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG III – TỪ TRƯỜNG (P1)",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lorentz",
      formulaTag: "Cốt lõi Từ trường & Lực từ:",
      formulaCore: "F_L = |q|vB\\sin\\alpha \\quad ; \\quad \\Phi = BS\\cos\\alpha",
      deltaPText: "Tổng hợp không gian từ trường 3D",
      initialForce: "F_L ≈ 3.2 × 10⁻¹⁴ N",
      hudStat1: "B = 0.5 T",
      hudStat2: "Quỹ đạo xoắn ốc",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo cực từ N-S",
      btnHeroLabel: "Đổi chế độ",
      description: "Tổng kết định luật từ trường, lực từ Lorentz, bài toán chuyển động của điện tích trong từ trường đều."
    },
    "B8a886e33c834": { // B30
      id: "b30_tongon_tutruong2",
      lessonNum: 30,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG III – TỪ TRƯỜNG (P2)",
      scriptUrl: "simulations/sim-tu-truong.js",
      className: "SimTuTruong",
      mode: "lenz",
      formulaTag: "Cốt lõi Cảm ứng điện từ:",
      formulaCore: "e_c = -\\frac{\\Delta\\Phi}{\\Delta t} \\quad ; \\quad e = E_0\\cos(\\omega t)",
      deltaPText: "Hiện tượng cảm ứng và máy điện",
      initialForce: "Định luật Lenz & Faraday",
      hudStat1: "e_c cảm ứng",
      hudStat2: "Khung dây quay",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo chiều B",
      btnHeroLabel: "Chế độ máy phát",
      description: "Tổng hợp các phương pháp xác định chiều dòng điện cảm ứng, tính toán suất điện động và dòng điện xoay chiều."
    },

    // ══════════════════════════════════════════════════════════
    // CHƯƠNG 4 – VẬT LÍ HẠT NHÂN
    // ══════════════════════════════════════════════════════════
    "B394ede55a127": { // B31
      id: "b31_cautao_hatnhan",
      lessonNum: 31,
      title: "MÔ HÌNH 3D: CẤU TẠO HẠT NHÂN NGUYÊN TỬ",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "nucleus",
      formulaTag: "Kí hiệu hạt nhân nguyên tử:",
      formulaCore: "^{A}_{Z}X \\implies Z \\text{ (Proton)} \\ ; \\ N = A - Z \\text{ (Neutron)}",
      deltaPText: "Lực hạt nhân mạnh liên kết các nucleon",
      initialForce: "Bán kính R ≈ 1.2 × 10⁻¹⁵ · A^(1/3) m",
      hudStat1: "Z = 15 (Proton) · N = 15 (Neutron)",
      hudStat2: "Lực hạt nhân mạnh",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi cực tính",
      btnHeroLabel: "Chuyển mô hình",
      description: "Hạt nhân nằm ở tâm nguyên tử, gồm các proton tích điện dương và neutron không mang điện gắn kết bởi lực hạt nhân mạnh."
    },
    "B600c414815cd": { // B32
      id: "b32_nangluong_lienket",
      lessonNum: 32,
      title: "MÔ HÌNH 3D: ĐỘ HỤT KHỐI & NĂNG LƯỢNG LIÊN KẾT",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "nucleus",
      formulaTag: "Năng lượng liên kết hạt nhân:",
      formulaCore: "E_{lk} = \\Delta m \\cdot c^2 = \\left[ Z m_p + (A-Z) m_n - m_X \\right] c^2",
      deltaPText: "Năng lượng liên kết riêng E_lk/A quyết định độ bền vững",
      initialForce: "Độ hụt khối Δm > 0",
      hudStat1: "E_lk = Δm·c²",
      hudStat2: "Bền vững nhất: A ≈ 50-70",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi cực tính",
      btnHeroLabel: "Chuyển mô hình",
      description: "Khối lượng hạt nhân luôn nhỏ hơn tổng khối lượng các nucleon riêng lẻ. Độ chênh lệch khối lượng biến thành năng lượng liên kết cực lớn."
    },
    "B762a4f776cf9": { // B33
      id: "b33_phanung_hatnhan",
      lessonNum: 33,
      title: "MÔ HÌNH 3D: PHẢN ỨNG HẠT NHÂN & PHÂN HẠCH DÂY CHUYỀN",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "fission",
      formulaTag: "Năng lượng phản ứng hạt nhân:",
      formulaCore: "\\Delta E = (m_{\\text{trước}} - m_{\\text{sau}}) c^2",
      deltaPText: "Bắn phá neutron kích hoạt phân hạch hạt nhân",
      initialForce: "Tỏa năng lượng hạt nhân",
      hudStat1: "U-235 + n → Hạt nhân con + 3n",
      hudStat2: "Phân hạch dây chuyền",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi cực tính",
      btnHeroLabel: "Chuyển mô hình",
      description: "Một hạt neutron chậm bắn vào hạt nhân Urani-235 làm hạt nhân vỡ đôi thành 2 mảnh nhẹ hơn, giải phóng 2-3 neutron và năng lượng khổng lồ."
    },
    "Bdc35c4bbe803": { // B34
      id: "b34_hientuong_phongxa",
      lessonNum: 34,
      title: "MÔ HÌNH 3D: 3 CHÙM TIA PHÓNG XẠ TRONG ĐIỆN TRƯỜNG (α, β, γ)",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "radiation",
      formulaTag: "3 Loại tia phóng xạ:",
      formulaCore: "\\alpha (^4_2\\text{He}, +2e) \\quad ; \\quad \\beta^- (e^-, -e) \\quad ; \\quad \\gamma (\\text{photon})",
      deltaPText: "α lệch sang cực (-); β lệch sang cực (+); γ đi thẳng",
      initialForce: "Quỹ đạo trong điện trường 3D",
      hudStat1: "3 Chùm tia phóng xạ",
      hudStat2: "Định luật phóng xạ",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo bản cực (+/-)",
      btnHeroLabel: "Chuyển hạt nhân",
      description: "Tia α tích điện dương lệch nhẹ về phía bản âm; Tia β tích điện âm nhẹ hơn rất nhiều nên lệch mạnh về bản dương; Tia γ không mang điện đi thẳng."
    },
    "Bf0c2006a6c22": { // B35
      id: "b35_dothi_phongxa",
      lessonNum: 35,
      title: "MÔ HÌNH 3D: ĐỊNH LUẬT & ĐỒ THỊ BÁN RÃ PHÓNG XẠ",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "radiation",
      formulaTag: "Định luật phóng xạ theo thời gian:",
      formulaCore: "N(t) = N_0 \\cdot 2^{-\\frac{t}{T}} = N_0 \\cdot e^{-\\lambda t}",
      deltaPText: "Sau mỗi chu kỳ T, số hạt nhân mẹ giảm đi một nửa",
      initialForce: "Chu kỳ bán rã T",
      hudStat1: "Hằng số phóng xạ λ = ln2 / T",
      hudStat2: "Bán rã hạt nhân",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo bản cực (+/-)",
      btnHeroLabel: "Chuyển hạt nhân",
      description: "Hiện tượng phóng xạ diễn ra tự phát theo hàm số mũ giảm dần theo thời gian, không phụ thuộc vào các điều kiện hóa học hay nhiệt độ bên ngoài."
    },
    "B7edbba769501": { // B36
      id: "b36_tongon_hatnhan1",
      lessonNum: 36,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG IV – VẬT LÍ HẠT NHÂN (P1)",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "nucleus",
      formulaTag: "Cốt lõi Vật lí hạt nhân:",
      formulaCore: "E_{lk} = \\Delta m \\cdot c^2 \\quad ; \\quad N(t) = N_0 2^{-t/T}",
      deltaPText: "Tổng hợp hạt nhân và phản ứng",
      initialForce: "Cấu trúc & Năng lượng",
      hudStat1: "Hạt nhân nguyên tử",
      hudStat2: "Độ hụt khối",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đổi bản cực",
      btnHeroLabel: "Chuyển mô hình",
      description: "Hệ thống hóa toàn bộ kiến thức cấu tạo hạt nhân, độ hụt khối, năng lượng liên kết và các định luật bảo toàn trong phản ứng hạt nhân."
    },
    "B736a9a9f39b2": { // B37
      id: "b37_tongon_hatnhan2",
      lessonNum: 37,
      title: "MÔ HÌNH 3D: TỔNG ÔN CHƯƠNG IV – VẬT LÍ HẠT NHÂN (P2)",
      scriptUrl: "simulations/sim-hat-nhan.js",
      className: "SimHatNhan",
      mode: "radiation",
      formulaTag: "Phóng xạ & Năng lượng phân hạch:",
      formulaCore: "\\Delta E = \\sum E_{lk(\\text{sau})} - \\sum E_{lk(\\text{trước})}",
      deltaPText: "Ứng dụng năng lượng hạt nhân & đồng vị phóng xạ",
      initialForce: "3 tia α, β, γ",
      hudStat1: "Định luật bảo toàn Z và A",
      hudStat2: "Phản ứng hạt nhân",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Đảo bản cực",
      btnHeroLabel: "Chuyển mô hình",
      description: "Tổng hợp chuyên sâu bài tập đồ thị phóng xạ, tính tuổi cổ vật bằng đồng vị Carbon-14 và ứng dụng y học hạt nhân xạ trị."
    },

    // ══════════════════════════════════════════════════════════
    // KHÓA 5 NGÀY LẤY GỐC VẬT LÍ (10 & 11)
    // ══════════════════════════════════════════════════════════
    "B04ff6fe289da": { // Ngày 1: Đơn vị
      id: "lg_ngay1_donvi",
      title: "MÔ HÌNH 3D: HỆ ĐƠN VỊ VÀ ĐẠI LƯỢNG VẬT LÝ",
      scriptUrl: "simulations/sim-co-dao-dong.js",
      className: "SimCoDaoDong",
      mode: "shm",
      formulaTag: "Ý nghĩa thứ nguyên & đơn vị:",
      formulaCore: "[F] = \\text{kg}\\cdot\\text{m/s}^2 = \\text{N} \\quad ; \\quad [W] = \\text{N}\\cdot\\text{m} = \\text{J}",
      deltaPText: "Mỗi đại lượng gắn liền với một hiện tượng cụ thể",
      initialForce: "Thứ nguyên SI",
      hudStat1: "Không gian 3D",
      hudStat2: "Đơn vị đo chuẩn",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng tần số ω",
      btnHeroLabel: "Tăng biên độ A",
      description: "Nắm vững ý nghĩa vật lý của các thứ nguyên cơ bản: Chiều dài (m), Thời gian (s), Khối lượng (kg), Cường độ dòng điện (A)."
    },
    "Be6fa0d8a7c89": { // Ngày 2: 3 Định luật Newton
      id: "lg_ngay2_newton",
      title: "MÔ HÌNH 3D: 3 ĐỊNH LUẬT NEWTON VÀ LỰC TƯƠNG TÁC",
      scriptUrl: "simulations/sim-co-dao-dong.js",
      className: "SimCoDaoDong",
      mode: "shm",
      formulaTag: "Định luật II Newton:",
      formulaCore: "\\vec{a} = \\frac{\\sum \\vec{F}}{m} \\iff \\vec{F} = m\\vec{a}",
      deltaPText: "Gia tốc cùng hướng với hợp lực tác dụng",
      initialForce: "F = m·a",
      hudStat1: "Khối lượng quán tính m",
      hudStat2: "Định luật Newton",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng tần số ω",
      btnHeroLabel: "Tăng biên độ A",
      description: "Trực quan hóa lực kéo, lực cản và gia tốc. Lực không phải là nguyên nhân duy trì chuyển động mà là nguyên nhân làm thay đổi vận tốc."
    },
    "B0962bb0d9791": { // Ngày 3: Năng lượng - Công
      id: "lg_ngay3_nangluong",
      title: "MÔ HÌNH 3D: CÔNG CƠ HỌC VÀ BẢO TOÀN CƠ NĂNG",
      scriptUrl: "simulations/sim-co-dao-dong.js",
      className: "SimCoDaoDong",
      mode: "shm",
      formulaTag: "Định luật bảo toàn cơ năng:",
      formulaCore: "W = W_d + W_t = \\frac{1}{2} m v^2 + \\frac{1}{2} k x^2 = \\text{hằng số}",
      deltaPText: "Sự chuyển hóa qua lại giữa Động năng và Thế năng",
      initialForce: "W_đ + W_t = const",
      hudStat1: "Bảo toàn cơ năng",
      hudStat2: "Chuyển hóa năng lượng",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng tần số ω",
      btnHeroLabel: "Tăng biên độ A",
      description: "Trong hệ cô lập không ma sát, động năng và thế năng chuyển hóa nhịp nhàng cho nhau, tổng cơ năng được bảo toàn tuyệt đối."
    },
    "B10d7ae6a0fb6": { // Ngày 4: Dao động điều hòa & Chuyển động tròn
      id: "lg_ngay4_daodong",
      title: "MÔ HÌNH 3D: DAO ĐỘNG ĐIỀU HÒA & VÒNG TRÒN LƯỢNG GIÁC",
      scriptUrl: "simulations/sim-co-dao-dong.js",
      className: "SimCoDaoDong",
      mode: "shm",
      formulaTag: "Phương trình dao động điều hòa:",
      formulaCore: "x = A \\cos(\\omega t + \\varphi) \\quad ; \\quad v = -\\omega A \\sin(\\omega t + \\varphi)",
      deltaPText: "Hình chiếu của chuyển động tròn đều lên trục Ox",
      initialForce: "x = A·cos(ωt + φ)",
      hudStat1: "A = 1.6 cm · ω = 3.0 rad/s",
      hudStat2: "Hình chiếu tròn đều",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng tần số ω",
      btnHeroLabel: "Tăng biên độ A",
      description: "Mối liên hệ tương đương 1-1 giữa vector quay tròn đều và dao động điều hòa của con lắc lò xo trên trục tọa độ Ox."
    },
    "B9ed0f81f82f5": { // Ngày 5: Kỹ thuật xử lý bài toán
      id: "lg_ngay5_kythuat",
      title: "MÔ HÌNH 3D: KỸ THUẬT GIẢI BÀI TOÁN DAO ĐỘNG & SÓNG",
      scriptUrl: "simulations/sim-co-dao-dong.js",
      className: "SimCoDaoDong",
      mode: "shm",
      formulaTag: "Độc lập thời gian:",
      formulaCore: "x^2 + \\frac{v^2}{\\omega^2} = A^2 \\quad ; \\quad a = -\\omega^2 x",
      deltaPText: "Hệ thức độc lập thời gian giữa li độ x, vận tốc v và gia tốc a",
      initialForce: "Hệ thức vuông pha",
      hudStat1: "Đồ thị elip (x, v)",
      hudStat2: "Kỹ thuật vector quay",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Tăng tần số ω",
      btnHeroLabel: "Tăng biên độ A",
      description: "Rèn luyện kỹ thuật sử dụng vòng tròn đa trục, trục thời gian và hệ thức độc lập để giải nhanh mọi bài toán Vật lí 12."
    },

    // ══════════════════════════════════════════════════════════
    // KHÓA GĐ2: BÀI TẬP NÂNG CAO
    // ══════════════════════════════════════════════════════════
    "Bba4abcf79a35": {
      id: "gd2_dangbai_ch1",
      title: "MÔ HÌNH 3D: DẠNG BÀI TẬP VẬT LÝ NHIỆT & NỘI NĂNG",
      scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
      className: "SimNhietChuyenThe",
      mode: "liquid",
      formulaTag: "Phương trình cân bằng nhiệt:",
      formulaCore: "Q_{\\text{tỏa}} = Q_{\\text{thu}} \\quad ; \\quad \\Delta U = Q + A",
      deltaPText: "Mô hình cân bằng nhiệt và chuyển thể",
      initialForce: "Trao đổi nhiệt hệ cô lập",
      hudStat1: "T_cân bằng",
      hudStat2: "Động năng vi mô",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Chuyển thể",
      btnHeroLabel: "Đổi thể chất",
      description: "Mô hình chuyển pha nhiệt học phục vụ phân tích các bài toán đồ thị nhiệt và phương trình cân bằng nhiệt nâng cao."
    }
  };

  // PHÂN GIẢI THÔNG MINH (FALLBACK AUTO-RESOLVER THEO CHƯƠNG / TÊN BÀI)
  function resolveFallbackConfig(keyOrName, lessonData) {
    const raw = String(keyOrName || '').trim().toLowerCase();
    const lName = (lessonData && lessonData.name ? lessonData.name : raw).toLowerCase();
    const lChapter = (lessonData && lessonData.chapter ? (lessonData.chapter.name || lessonData.chapter) : '').toLowerCase();

    // 1. Phân loại theo Chương 4: Hạt nhân
    if (lChapter.includes('hạt nhân') || lChapter.includes('chương 4') || lName.includes('hạt nhân') || lName.includes('phóng xạ') || lName.includes('phân hạch')) {
      return {
        id: "fb_hat_nhan",
        title: "MÔ HÌNH 3D: VẬT LÍ HẠT NHÂN NGUYÊN TỬ",
        scriptUrl: "simulations/sim-hat-nhan.js",
        className: "SimHatNhan",
        mode: "nucleus",
        formulaTag: "Vật lí hạt nhân cốt lõi:",
        formulaCore: "E = m c^2 \\quad ; \\quad N(t) = N_0 2^{-t/T}",
        deltaPText: "Cấu trúc hạt nhân và chùm tia phóng xạ 3D",
        initialForce: "Lực hạt nhân mạnh",
        hudStat1: "Proton & Neutron",
        hudStat2: "Tia phóng xạ α, β, γ",
        btnSlowLabel: "Xem chậm",
        btnTempLabel: "Đảo điện cực",
        btnHeroLabel: "Chuyển mô hình",
        description: "Mô hình không gian 3D cấu tạo hạt nhân nguyên tử và các chùm tia phóng xạ trong điện trường."
      };
    }

    // 2. Phân loại theo Chương 3: Từ trường
    if (lChapter.includes('từ trường') || lChapter.includes('chương 3') || lName.includes('từ trường') || lName.includes('cảm ứng') || lName.includes('xoay chiều') || lName.includes('từ thông') || lName.includes('lenz') || lName.includes('lorentz')) {
      return {
        id: "fb_tu_truong",
        title: "MÔ HÌNH 3D: TỪ TRƯỜNG & HIỆN TƯỢNG CẢM ỨNG ĐIỆN TỪ",
        scriptUrl: "simulations/sim-tu-truong.js",
        className: "SimTuTruong",
        mode: "lorentz",
        formulaTag: "Cốt lõi Từ trường:",
        formulaCore: "F_L = |q| v B \\sin\\alpha \\quad ; \\quad e_c = -\\frac{\\Delta\\Phi}{\\Delta t}",
        deltaPText: "Đường sức từ 3D & Quỹ đạo hạt xoắn ốc",
        initialForce: "B = 0.5 T",
        hudStat1: "Từ trường B (Vector)",
        hudStat2: "Cảm ứng điện từ",
        btnSlowLabel: "Xem chậm",
        btnTempLabel: "Đảo chiều B",
        btnHeroLabel: "Đổi chế độ",
        description: "Mô hình không gian 3D đường sức từ, lực Lorentz xoắn ốc và hiện tượng cảm ứng điện từ theo định luật Lenz."
      };
    }

    // 3. Phân loại theo Khóa Lấy gốc: Dao động & Cơ học (Vật lí 10, 11)
    if (lChapter.includes('vật lí 10') || lChapter.includes('vật lí 11') || lName.includes('dao động') || lName.includes('newton') || lName.includes('tròn')) {
      return {
        id: "fb_co_dao_dong",
        title: "MÔ HÌNH 3D: DAO ĐỘNG ĐIỀU HÒA & VÒNG TRÒN LƯỢNG GIÁC",
        scriptUrl: "simulations/sim-co-dao-dong.js",
        className: "SimCoDaoDong",
        mode: "shm",
        formulaTag: "Phương trình dao động điều hòa:",
        formulaCore: "x = A \\cos(\\omega t + \\varphi)",
        deltaPText: "Hình chiếu tròn đều lên trục Ox",
        initialForce: "x = A·cos(ωt + φ)",
        hudStat1: "A = 1.6 cm",
        hudStat2: "ω = 3.0 rad/s",
        btnSlowLabel: "Xem chậm",
        btnTempLabel: "Tăng tần số ω",
        btnHeroLabel: "Tăng biên độ A",
        description: "Mối liên hệ giữa chuyển động tròn đều và dao động điều hòa của con lắc lò xo 3D."
      };
    }

    // 4. Phân loại theo Chương 1: Vật lý nhiệt
    if (lChapter.includes('nhiệt') || lChapter.includes('chương 1') || lName.includes('nhiệt') || lName.includes('nóng chảy') || lName.includes('hóa hơi') || lName.includes('thể')) {
      return {
        id: "fb_vlnhiet",
        title: "MÔ HÌNH 3D: CẤU TRÚC PHÂN TỬ 3 THỂ (RẮN - LỎNG - KHÍ)",
        scriptUrl: "simulations/sim-nhiet-chuyen-the.js",
        className: "SimNhietChuyenThe",
        mode: "solid",
        formulaTag: "Nhiệt động lực học vi mô:",
        formulaCore: "\\Delta U = Q + A \\quad ; \\quad Q = mc\\Delta t",
        deltaPText: "Chuyển động nhiệt và tương tác phân tử",
        initialForce: "Mạng tinh thể & Chuyển thể",
        hudStat1: "T = 300 K",
        hudStat2: "3 Thể của chất",
        btnSlowLabel: "Xem chậm",
        btnTempLabel: "Chuyển thể",
        btnHeroLabel: "Đổi thể chất",
        description: "Mô hình 3D cấu trúc mạng tinh thể thể rắn, thể lỏng và chuyển thể hóa hơi thành chất khí."
      };
    }

    // 5. Mặc định là Chương 2: Khí lí tưởng
    return {
      id: "fb_khi_ly_tuong",
      title: "MÔ HÌNH 3D: KHÍ LÍ TƯỞNG & PISTON XILANH",
      scriptUrl: "simulations/sim-khi-ly-tuong.js",
      className: "SimKhiLyTuong",
      mode: "boyle",
      formulaTag: "Khí lí tưởng & Đẳng quá trình:",
      formulaCore: "\\frac{p V}{T} = \\text{hằng số} \\quad ; \\quad p = \\frac{1}{3} \\mu m_0 \\overline{v^2}",
      deltaPText: "Va chạm phân tử sinh áp suất lên thành bình",
      initialForce: "p ≈ 1.00 atm",
      hudStat1: "T = 300 K",
      hudStat2: "0 va chạm",
      btnSlowLabel: "Xem chậm",
      btnTempLabel: "Nhiệt T (600K)",
      btnHeroLabel: "Nén piston",
      description: "Mô hình xilanh khí lí tưởng 3D tương tác nén/dãn piston và thay đổi nhiệt độ ngọn lửa."
    };
  }

  // TÌM CẤU HÌNH CHO MỘT BÀI HỌC
  function findConfig(keyOrName, lessonData) {
    if (!keyOrName && !lessonData) return null;

    // 1. Tìm trực tiếp theo MaBai trong bảng REGISTRY_MAP
    if (keyOrName && REGISTRY_MAP[keyOrName]) {
      return REGISTRY_MAP[keyOrName];
    }
    if (lessonData && lessonData.key && REGISTRY_MAP[lessonData.key]) {
      return REGISTRY_MAP[lessonData.key];
    }
    if (lessonData && lessonData.id && REGISTRY_MAP[lessonData.id]) {
      return REGISTRY_MAP[lessonData.id];
    }

    // 2. Tìm theo số bài trong Tên bài (ví dụ "B11.", "B12.", "B15.", "Bài 15", v.v.)
    const lName = (lessonData && lessonData.name ? lessonData.name : String(keyOrName)).toLowerCase();
    for (const k in REGISTRY_MAP) {
      const item = REGISTRY_MAP[k];
      if (item.lessonNum) {
        const regex = new RegExp(`(^|\\b|b)0?${item.lessonNum}(\\.|\\b|\\s)`, 'i');
        if (regex.test(lName)) {
          return item;
        }
      }
    }

    // 3. Fallback phân giải thông minh: LUÔN TRẢ VỀ CẤU HÌNH HỢP LÝ CHO 100% CÁC BÀI
    return resolveFallbackConfig(keyOrName, lessonData);
  }

  // Tự động tải thư viện Three.js, OrbitControls, GSAP
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.getAttribute('data-loaded') === 'true') return resolve();
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', (e) => reject(e));
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => {
        s.setAttribute('data-loaded', 'true');
        resolve();
      };
      s.onerror = (e) => reject(e);
      document.head.appendChild(s);
    });
  }

  let libsLoadingPromise = null;
  function ensureLibraries() {
    if (libsLoadingPromise) return libsLoadingPromise;

    const tasks = [];
    if (typeof THREE === 'undefined') {
      tasks.push(loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"));
    }

    libsLoadingPromise = Promise.all(tasks).then(() => {
      const subTasks = [];
      if (typeof THREE !== 'undefined' && typeof THREE.OrbitControls === 'undefined') {
        subTasks.push(loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"));
      }
      if (typeof gsap === 'undefined') {
        subTasks.push(loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"));
      }
      return Promise.all(subTasks);
    });

    return libsLoadingPromise;
  }

  let currentInstance = null;
  let currentModalInstance = null;

  return {
    // Chỉ kích hoạt mô phỏng 3D cho các bài đã được Thầy nghiệm thu và chốt chuẩn kiến thức (Bài 1 và Bài 15)
    hasSimulation: function (keyOrName, lessonData) {
      const config = findConfig(keyOrName, lessonData);
      if (!config) return false;
      return (config.lessonNum === 1 || config.lessonNum === 15 || config.id === 'b1_cautrucchat' || config.id === 'b15_apsuat_mhdhpt');
    },

    getConfig: function (keyOrName, lessonData) {
      const config = findConfig(keyOrName, lessonData);
      if (!config) return null;
      if (config.lessonNum === 1 || config.lessonNum === 15 || config.id === 'b1_cautrucchat' || config.id === 'b15_apsuat_mhdhpt') {
        return config;
      }
      return null;
    },

    loadAndMount: async function (containerEl, config, options = {}) {
      if (!containerEl || !config) return null;

      this.unmount();
      await ensureLibraries();

      if (config.scriptUrl) {
        await loadScript(config.scriptUrl);
      }

      const SimClass = window[config.className];
      if (typeof SimClass !== 'function') {
        console.error("Không tìm thấy class mô phỏng:", config.className);
        return null;
      }

      // Hợp nhất tùy chọn bao gồm mode của bài
      const mergedOptions = Object.assign({ mode: config.mode }, options);
      currentInstance = new SimClass(containerEl, mergedOptions);
      return currentInstance;
    },

    getCurrentInstance: function () {
      return currentInstance;
    },

    unmount: function () {
      if (currentInstance) {
        try {
          currentInstance.destroy();
        } catch (e) {
          console.warn("Lỗi khi hủy instance 3D:", e);
        }
        currentInstance = null;
      }
      if (currentModalInstance) {
        try {
          currentModalInstance.destroy();
        } catch (e) {
          console.warn("Lỗi khi hủy modal 3D:", e);
        }
        currentModalInstance = null;
      }
    },

    openModal: async function (config) {
      const modalOverlay = document.getElementById('sim-modal-overlay');
      const modalCanvasWrap = document.getElementById('sim-modal-canvas');
      if (!modalOverlay || !modalCanvasWrap) return;

      modalOverlay.classList.add('active');
      modalCanvasWrap.innerHTML = '';

      await ensureLibraries();
      if (config.scriptUrl) await loadScript(config.scriptUrl);

      const SimClass = window[config.className];
      if (typeof SimClass === 'function') {
        currentModalInstance = new SimClass(modalCanvasWrap, {
          isModal: true,
          mode: config.mode,
          onCollision: (count, isHero) => {
            const countEl = document.getElementById('sim-modal-hud-count');
            const forceEl = document.getElementById('sim-modal-hud-force');
            if (countEl) countEl.textContent = count;
            if (forceEl && isHero) {
              forceEl.textContent = `F = ${(1.8 + Math.random() * 1.2).toFixed(1)} × 10⁻²¹ N`;
            }
          }
        });
      }
    },

    closeModal: function () {
      const modalOverlay = document.getElementById('sim-modal-overlay');
      if (modalOverlay) modalOverlay.classList.remove('active');
      if (currentModalInstance) {
        currentModalInstance.destroy();
        currentModalInstance = null;
      }
    },

    getModalInstance: function () {
      return currentModalInstance;
    }
  };
});
