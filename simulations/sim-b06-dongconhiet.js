/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 6: ĐỘNG CƠ NHIỆT – ĐỒ THỊ NHIỆT
 * Mã bài học: B0d8e14bf80dd
 * Thiết kế hoàn toàn theo đúng kịch bản trực quan sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: NGUYÊN LÝ ĐỘNG CƠ NHIỆT & HIỆU SUẤT (H = A / Q1)
 *    - 3 bộ phận cốt lõi: Nguồn nóng (T1, cung cấp Q1) -> Tác nhân trong xilanh piston sinh công A -> Nguồn lạnh (T2, nhận Q2).
 *    - Bảo toàn năng lượng: A = Q1 - Q2 => Hiệu suất H = A/Q1 = 1 - Q2/Q1 < 100% (Nguyên lý II NĐLH).
 *    - Hoạt ảnh bánh đà (flywheel) quay sinh công cơ học và dòng năng lượng tuần hoàn.
 * 
 * 2. MÔ HÌNH 2: ĐỘNG CƠ ĐỐT TRONG 4 KỲ (4 THÌ)
 *    - Mặt cắt cơ khí 3D chuẩn xác: Piston, tay biên, trục khuỷu, van nạp, van xả, bugi đánh lửa.
 *    - 4 kỳ: 1. Hút (van nạp mở) -> 2. Nén (2 van đóng) -> 3. Nổ (bugi đánh lửa, sinh công duy nhất) -> 4. Xả (van xả mở).
 * 
 * 3. MÔ HÌNH 3: PHÂN TÍCH ĐỒ THỊ NHIỆT ĐỘ - THỜI GIAN (T - t) & CÂN BẰNG NHIỆT
 *    - Thí nghiệm đun nóng đồng thời vẽ đồ thị T(t) thời gian thực.
 *    - So sánh: Chất rắn kết tinh (nước đá có đoạn NẰM NGANG ở 0°C) vs Chất rắn vô định hình (sáp, đường cong liên tục không có đoạn ngang).
 *    - Đồ thị cân bằng nhiệt: Giao điểm 2 đường tại Tcb và phân tích độ dốc tan(alpha) = P / (mc).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB06DongCoNhiet = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB06DongCoNhiet {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Nguyên lý & Hiệu suất, 1: Động cơ đốt trong 4 kỳ, 2: Đồ thị nhiệt T-t
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: NGUYÊN LÝ & HIỆU SUẤT ──
      this.m1Running = true;
      this.m1EtaMode = 'std'; // 'low' (25%) | 'std' (40%) | 'carnot' (50%)
      this.m1Q1 = 100; // J
      this.m1Q2 = 60;  // J
      this.m1WorkA = 40; // J
      this.m1Eta = 40; // %
      this.m1FlywheelAngle = 0;
      this.m1HeatParticlesQ1 = [];
      this.m1HeatParticlesQ2 = [];

      // ── BIẾN SỐ MÔ HÌNH 2: ĐỘNG CƠ ĐỐT TRONG 4 KỲ ──
      this.m2Stroke = 1; // 1: Hút | 2: Nén | 3: Nổ (Sinh công) | 4: Xả
      this.m2Auto = true;
      this.m2CrankAngle = 0;
      this.m2SparkIntensity = 0;
      this.m2IntakeParticles = [];
      this.m2ExhaustParticles = [];

      // ── BIẾN SỐ MÔ HÌNH 3: ĐỒ THỊ NHIỆT T-t ──
      this.m3Mode = 'crystal'; // 'crystal' (nước đá kết tinh) | 'amorphous' (sáp vô định hình) | 'equilibrium' (cân bằng nhiệt)
      this.m3Progress = 0; // 0 -> 1
      this.m3IsSimulating = true;
      this.m3TempCurrent = -20;

      this.init();
    }

    init() {
      const width = this.container.clientWidth || 340;
      const height = this.container.clientHeight || 280;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x070d1e);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.resetCamera();

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.container.innerHTML = '';
      this.container.style.position = 'relative';
      this.container.appendChild(this.renderer.domElement);

      // 4. Overlay Canvas 2D để vẽ đồ thị (Dùng cho Tab 2)
      this.graphCanvas = document.createElement('canvas');
      this.graphCanvas.className = 'sim-graph-canvas';
      this.graphCanvas.style.cssText = 'position: absolute; right: 10px; top: 40px; width: 170px; height: 160px; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; pointer-events: none; z-index: 20; display: none;';
      this.graphCanvas.width = 340;
      this.graphCanvas.height = 320;
      this.container.appendChild(this.graphCanvas);
      this.graphCtx = this.graphCanvas.getContext('2d');

      // 5. Legend Overlay trong suốt
      this.legendOverlay = document.createElement('div');
      this.legendOverlay.className = 'sim-legend-overlay';
      this.legendOverlay.style.cssText = 'position: absolute; top: 40px; left: 8px; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.08); padding: 5px 8px; border-radius: 6px; font-size: 11px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 3px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: left; max-width: 260px;';
      this.container.appendChild(this.legendOverlay);

      // 6. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 25;
        this.controls.minDistance = 3;
      }

      // 7. Lights
      this.setupLights();

      // 8. 3D Groups
      this.groupM1 = new THREE.Group();
      this.groupM2 = new THREE.Group();
      this.groupM3 = new THREE.Group();

      this.scene.add(this.groupM1);
      this.scene.add(this.groupM2);
      this.scene.add(this.groupM3);

      this.buildModel1HeatEngine();
      this.buildModel2FourStrokeEngine();
      this.buildModel3ThermalGraph();

      // 9. UI Tabs & Controls
      this.buildUI();
      this.switchScene(0);

      // 10. Resize
      this.onResize = this.onResize.bind(this);
      window.addEventListener('resize', this.onResize);

      // 11. Loop
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);
    }

    resetCamera() {
      this.camera.position.set(0, 1.8, 7.5);
      this.camera.lookAt(0, 0.2, 0);
    }

    setupLights() {
      const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight1.position.set(5, 8, 7);
      this.scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
      dirLight2.position.set(-6, -3, -4);
      this.scene.add(dirLight2);
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 1: NGUYÊN LÝ ĐỘNG CƠ NHIỆT & HIỆU SUẤT
    // ══════════════════════════════════════════════════════════════════
    buildModel1HeatEngine() {
      // 1. Khối NGUỒN NÓNG T1 (bên trên)
      const hotGeo = new THREE.BoxGeometry(2.4, 0.7, 1.4);
      const hotMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.3
      });
      const hotBlock = new THREE.Mesh(hotGeo, hotMat);
      hotBlock.position.set(0, 2.0, 0);
      this.groupM1.add(hotBlock);

      // 2. Khối NGUỒN LẠNH T2 (bên dưới)
      const coldGeo = new THREE.BoxGeometry(2.4, 0.7, 1.4);
      const coldMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.3
      });
      const coldBlock = new THREE.Mesh(coldGeo, coldMat);
      coldBlock.position.set(0, -2.0, 0);
      this.groupM1.add(coldBlock);

      // 3. TÁC NHÂN: Xilanh & Piston ở giữa
      const cylGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.8, 24, 1, true);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      cylMesh.position.set(-0.8, 0, 0);
      this.groupM1.add(cylMesh);

      // Piston trượt
      const pistonGeo = new THREE.CylinderGeometry(0.82, 0.82, 0.2, 24);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      this.m1Piston = new THREE.Mesh(pistonGeo, pistonMat);
      this.m1Piston.position.set(-0.8, 0, 0);
      this.groupM1.add(this.m1Piston);

      // 4. BÁNH ĐÀ CƠ HỌC (FLYWHEEL) SINH CÔNG A
      const flyGroup = new THREE.Group();
      flyGroup.position.set(1.3, 0, 0);
      this.groupM1.add(flyGroup);

      const flyRimGeo = new THREE.TorusGeometry(0.9, 0.12, 16, 32);
      const flyRimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      this.m1Flywheel = new THREE.Mesh(flyRimGeo, flyRimMat);
      flyGroup.add(this.m1Flywheel);

      // Nan hoa bánh đà
      for (let i = 0; i < 4; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.7, 8);
        spokeGeo.rotateZ((i * Math.PI) / 4);
        const spoke = new THREE.Mesh(spokeGeo, flyRimMat);
        this.m1Flywheel.add(spoke);
      }

      // Trục quay
      const axleGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 16);
      axleGeo.rotateX(Math.PI / 2);
      const axle = new THREE.Mesh(axleGeo, new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 }));
      flyGroup.add(axle);

      // Thanh truyền (Connecting rod) nối Piston và Bánh đà
      const rodGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.1, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8 });
      this.m1ConRod = new THREE.Mesh(rodGeo, rodMat);
      this.m1ConRod.rotation.z = Math.PI / 2;
      this.groupM1.add(this.m1ConRod);

      // 5. Hạt dòng nhiệt Q1 (Nóng chảy xuống)
      const q1Geo = new THREE.SphereGeometry(0.06, 8, 8);
      const q1Mat = new THREE.MeshBasicMaterial({ color: 0xf87171 });
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(q1Geo, q1Mat);
        p.position.set(-0.8 + (Math.random() - 0.5) * 0.8, 1.6 - Math.random() * 0.8, (Math.random() - 0.5) * 0.4);
        this.groupM1.add(p);
        this.m1HeatParticlesQ1.push(p);
      }

      // 6. Hạt dòng nhiệt Q2 (Lạnh chảy xuống nguồn lạnh)
      const q2Geo = new THREE.SphereGeometry(0.05, 8, 8);
      const q2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(q2Geo, q2Mat);
        p.position.set(-0.8 + (Math.random() - 0.5) * 0.8, -0.6 - Math.random() * 1.0, (Math.random() - 0.5) * 0.4);
        this.groupM1.add(p);
        this.m1HeatParticlesQ2.push(p);
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 2: ĐỘNG CƠ ĐỐT TRONG 4 KỲ
    // ══════════════════════════════════════════════════════════════════
    buildModel2FourStrokeEngine() {
      // Vỏ xilanh cơ khí trong suốt
      const cylGeo = new THREE.CylinderGeometry(1.2, 1.2, 3.2, 32, 1, true);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.28,
        metalness: 0.3,
        roughness: 0.2,
        side: THREE.DoubleSide
      });
      const cyl = new THREE.Mesh(cylGeo, cylMat);
      cyl.position.y = 0.5;
      this.groupM2.add(cyl);

      // Piston kim loại với xéc-măng
      const pistonGeo = new THREE.CylinderGeometry(1.18, 1.18, 0.6, 32);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2 });
      this.m2Piston = new THREE.Mesh(pistonGeo, pistonMat);
      this.m2Piston.position.y = 0.5;
      this.groupM2.add(this.m2Piston);

      // Trục khuỷu (Crankshaft) ở phía dưới
      const crankGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
      crankGeo.rotateX(Math.PI / 2);
      this.m2Crank = new THREE.Mesh(crankGeo, new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 }));
      this.m2Crank.position.set(0, -1.8, 0);
      this.groupM2.add(this.m2Crank);

      // Thanh truyền (Connecting rod)
      const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.2 });
      this.m2ConRod = new THREE.Mesh(rodGeo, rodMat);
      this.m2ConRod.position.set(0, -0.6, 0);
      this.groupM2.add(this.m2ConRod);

      // Van NẠP (Intake Valve - Bên trái, màu xanh)
      const valveMatIn = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 });
      this.m2ValveIn = new THREE.Group();
      this.m2ValveIn.position.set(-0.6, 2.1, 0);
      const stemIn = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), valveMatIn);
      const headIn = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.15, 16), valveMatIn);
      headIn.position.y = -0.3;
      this.m2ValveIn.add(stemIn);
      this.m2ValveIn.add(headIn);
      this.groupM2.add(this.m2ValveIn);

      // Van XẢ (Exhaust Valve - Bên phải, màu đỏ cam)
      const valveMatEx = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.7 });
      this.m2ValveEx = new THREE.Group();
      this.m2ValveEx.position.set(0.6, 2.1, 0);
      const stemEx = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 12), valveMatEx);
      const headEx = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.15, 16), valveMatEx);
      headEx.position.y = -0.3;
      this.m2ValveEx.add(stemEx);
      this.m2ValveEx.add(headEx);
      this.groupM2.add(this.m2ValveEx);

      // Bugi đánh lửa ở giữa đỉnh buồng đốt
      const plugGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
      const plugMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.5, roughness: 0.3 });
      const plug = new THREE.Mesh(plugGeo, plugMat);
      plug.position.set(0, 2.3, 0);
      this.groupM2.add(plug);

      // Tia lửa điện bugi (Spark)
      const sparkGeo = new THREE.SphereGeometry(0.2, 16, 16);
      this.m2SparkMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0 });
      this.m2Spark = new THREE.Mesh(sparkGeo, this.m2SparkMat);
      this.m2Spark.position.set(0, 1.85, 0);
      this.groupM2.add(this.m2Spark);

      // Ánh sáng bùng cháy buồng đốt khi Nổ
      this.m2CombustionLight = new THREE.PointLight(0xff7700, 0, 5);
      this.m2CombustionLight.position.set(0, 1.6, 0);
      this.groupM2.add(this.m2CombustionLight);

      // Hạt hòa khí nạp vào (xanh lam)
      const partGeo = new THREE.SphereGeometry(0.05, 8, 8);
      for (let i = 0; i < 20; i++) {
        const p = new THREE.Mesh(partGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
        p.position.set(-0.6 + (Math.random() - 0.5) * 0.4, 1.8 - Math.random() * 0.8, (Math.random() - 0.5) * 0.4);
        p.visible = false;
        this.groupM2.add(p);
        this.m2IntakeParticles.push(p);
      }

      // Hạt khói xả ra (xám cam)
      for (let i = 0; i < 20; i++) {
        const p = new THREE.Mesh(partGeo, new THREE.MeshBasicMaterial({ color: 0x94a3b8 }));
        p.position.set(0.6 + (Math.random() - 0.5) * 0.4, 1.8 + Math.random() * 0.8, (Math.random() - 0.5) * 0.4);
        p.visible = false;
        this.groupM2.add(p);
        this.m2ExhaustParticles.push(p);
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 3: PHÂN TÍCH ĐỒ THỊ NHIỆT T-t & CÂN BẰNG NHIỆT
    // ══════════════════════════════════════════════════════════════════
    buildModel3ThermalGraph() {
      // 3D Bên trái: Bếp điện & Cốc đun thí nghiệm
      const setupGroup = new THREE.Group();
      setupGroup.position.set(-1.6, 0, 0);
      this.groupM3.add(setupGroup);

      // Bếp điện
      const stoveGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.4, 32);
      const stoveMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 });
      const stove = new THREE.Mesh(stoveGeo, stoveMat);
      stove.position.y = -1.6;
      setupGroup.add(stove);

      // Mâm nhiệt phát đỏ
      const burnerGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 32);
      this.m3BurnerMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xd97706,
        emissiveIntensity: 0.6
      });
      const burner = new THREE.Mesh(burnerGeo, this.m3BurnerMat);
      burner.position.y = -1.36;
      setupGroup.add(burner);

      // Cốc thủy tinh chịu nhiệt
      const beakerGeo = new THREE.CylinderGeometry(0.95, 0.9, 1.8, 32, 1, true);
      const beakerMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3,
        roughness: 0.1
      });
      const beaker = new THREE.Mesh(beakerGeo, beakerMat);
      beaker.position.y = -0.4;
      setupGroup.add(beaker);

      // Khối chất trong cốc (Nước đá / Sáp / Nước)
      const liquidGeo = new THREE.CylinderGeometry(0.9, 0.85, 1.2, 32);
      this.m3LiquidMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
        roughness: 0.2
      });
      this.m3Liquid = new THREE.Mesh(liquidGeo, this.m3LiquidMat);
      this.m3Liquid.position.y = -0.7;
      setupGroup.add(this.m3Liquid);

      // Nhiệt kế cắm vào cốc
      const thermoBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })
      );
      thermoBody.position.set(0.3, 0.2, 0);
      setupGroup.add(thermoBody);

      this.m3ThermoCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.8, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      this.m3ThermoCol.position.set(0.3, -0.4, 0);
      setupGroup.add(this.m3ThermoCol);
    }

    // ══════════════════════════════════════════════════════════════════
    // UI BUILDER
    // ══════════════════════════════════════════════════════════════════
    getControlsContainer() {
      const modalContent = this.container.closest('.sim-modal-content');
      if (modalContent) {
        const modalFooter = modalContent.querySelector('.sim-modal-footer');
        if (modalFooter) {
          let ctrlBox = modalFooter.querySelector('.sim-custom-controls');
          if (!ctrlBox) {
            ctrlBox = document.createElement('div');
            ctrlBox.className = 'sim-custom-controls';
            ctrlBox.style.cssText = 'max-width:680px; margin:0 auto; padding:4px 0; display:flex; flex-direction:column; gap:6px; align-items:center; width:100%;';
            modalFooter.appendChild(ctrlBox);
          }
          return ctrlBox;
        }
      }

      const sidebarCard = this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (sidebarCard) {
        let ctrlBox = sidebarCard.querySelector('.sim-custom-controls');
        if (!ctrlBox) {
          ctrlBox = document.createElement('div');
          ctrlBox.className = 'sim-custom-controls';
          ctrlBox.style.cssText = 'padding:6px 4px; display:flex; flex-direction:column; gap:6px; align-items:center; width:100%; box-sizing:border-box;';
          sidebarCard.appendChild(ctrlBox);
        }
        return ctrlBox;
      }
      return this.controlBar;
    }

    hideDefaultToolbars() {
      const scope = this.container.closest('.sim-modal-content') || this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (scope) {
        scope.querySelectorAll('.sim-toolbar').forEach(tb => tb.style.display = 'none');
        scope.querySelectorAll('.sim-formula-box').forEach(fb => fb.style.display = 'none');
      }
    }

    restoreDefaultToolbars() {
      const scope = this.container.closest('.sim-modal-content') || this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (scope) {
        scope.querySelectorAll('.sim-toolbar').forEach(tb => tb.style.display = '');
        scope.querySelectorAll('.sim-formula-box').forEach(fb => fb.style.display = '');
        const customBox = scope.querySelector('.sim-custom-controls');
        if (customBox && customBox.parentElement) {
          customBox.parentElement.removeChild(customBox);
        }
      }
    }

    buildUI() {
      // 1. Tab Bar phía trên canvas
      this.tabBar = document.createElement('div');
      this.tabBar.className = 'sim-tab-bar';
      this.tabBar.style.cssText = 'position: absolute; top: 6px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 25; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); padding: 3px 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 4px 12px rgba(0,0,0,0.4); max-width: 95%;';

      const tabs = [
        { id: 0, label: '⚙️ Nguyên lý & Hiệu suất H' },
        { id: 1, label: '🚗 Động cơ đốt trong 4 kỳ' },
        { id: 2, label: '📈 Đồ thị nhiệt T-t & Cân bằng' }
      ];

      this.tabButtons = [];
      tabs.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t.label;
        btn.style.cssText = 'background: transparent; border: none; color: #94a3b8; padding: 4px 9px; border-radius: 14px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;';
        btn.onclick = () => this.switchScene(t.id);
        this.tabBar.appendChild(btn);
        this.tabButtons.push(btn);
      });
      this.container.appendChild(this.tabBar);

      // Fallback control bar nếu không có container ngoài
      this.controlBar = document.createElement('div');
      this.controlBar.className = 'sim-ctrl-bar-fallback';
      this.controlBar.style.display = 'none';
      this.container.appendChild(this.controlBar);

      this.hideDefaultToolbars();
    }

    switchScene(idx) {
      this.currentSceneIdx = idx;

      // Active tab style
      this.tabButtons.forEach((btn, i) => {
        if (i === idx) {
          btn.style.background = '#38bdf8';
          btn.style.color = '#0f172a';
          btn.style.boxShadow = '0 2px 8px rgba(56, 189, 248, 0.4)';
        } else {
          btn.style.background = 'transparent';
          btn.style.color = '#94a3b8';
          btn.style.boxShadow = 'none';
        }
      });

      // Ẩn/Hiện nhóm 3D & Canvas đồ thị
      this.groupM1.visible = (idx === 0);
      this.groupM2.visible = (idx === 1);
      this.groupM3.visible = (idx === 2);
      this.graphCanvas.style.display = (idx === 2) ? 'block' : 'none';

      this.hideDefaultToolbars();
      this.renderControls();
      this.updateLegend();
    }

    renderControls() {
      const targetBox = this.getControlsContainer();
      if (!targetBox) return;
      targetBox.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // Tab 0: Nguyên lý & Hiệu suất
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';

        const playBtn = this.createButton(
          this.m1Running ? '⏸️ Tạm dừng' : '▶️ Chạy tiếp',
          () => {
            this.m1Running = !this.m1Running;
            this.renderControls();
          },
          this.m1Running,
          this.m1Running ? '#059669' : '#64748b'
        );

        const btnLow = this.createButton('🚗 Xăng (25%)', () => this.setM1Eta('low'), this.m1EtaMode === 'low');
        const btnStd = this.createButton('🚛 Diesel (40%)', () => this.setM1Eta('std'), this.m1EtaMode === 'std');
        const btnCarnot = this.createButton('✨ Carnot (50%)', () => this.setM1Eta('carnot'), this.m1EtaMode === 'carnot', '#f59e0b');

        row.appendChild(playBtn);
        row.appendChild(btnLow);
        row.appendChild(btnStd);
        row.appendChild(btnCarnot);
        targetBox.appendChild(row);
      } 
      else if (this.currentSceneIdx === 1) {
        // Tab 1: Động cơ đốt trong 4 kỳ
        const row1 = document.createElement('div');
        row1.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const s1 = this.createButton('1. Hút', () => this.setM2Stroke(1), this.m2Stroke === 1 && !this.m2Auto);
        const s2 = this.createButton('2. Nén', () => this.setM2Stroke(2), this.m2Stroke === 2 && !this.m2Auto);
        const s3 = this.createButton('3. Nổ (Sinh công)', () => this.setM2Stroke(3), this.m2Stroke === 3 && !this.m2Auto, '#ef4444');
        const s4 = this.createButton('4. Xả', () => this.setM2Stroke(4), this.m2Stroke === 4 && !this.m2Auto);
        row1.appendChild(s1);
        row1.appendChild(s2);
        row1.appendChild(s3);
        row1.appendChild(s4);

        const row2 = document.createElement('div');
        row2.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const autoBtn = this.createButton(
          this.m2Auto ? '⏸️ Dừng xem kỳ này' : '🔄 Chạy tự động 4 kỳ',
          () => {
            this.m2Auto = !this.m2Auto;
            this.renderControls();
            this.updateLegend();
          },
          this.m2Auto,
          this.m2Auto ? '#059669' : '#64748b'
        );
        row2.appendChild(autoBtn);

        targetBox.appendChild(row1);
        targetBox.appendChild(row2);
      } 
      else if (this.currentSceneIdx === 2) {
        // Tab 2: Đồ thị nhiệt T-t
        const row1 = document.createElement('div');
        row1.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const btnCryst = this.createButton('🧊 Kết tinh (Nước đá 0°C)', () => this.setM3Mode('crystal'), this.m3Mode === 'crystal');
        const btnAmorph = this.createButton('🕯️ Vô định hình (Sáp)', () => this.setM3Mode('amorphous'), this.m3Mode === 'amorphous');
        row1.appendChild(btnCryst);
        row1.appendChild(btnAmorph);

        const row2 = document.createElement('div');
        row2.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const btnEq = this.createButton('⚖️ Cân bằng nhiệt (Giao điểm)', () => this.setM3Mode('equilibrium'), this.m3Mode === 'equilibrium', '#10b981');
        const btnReplay = this.createButton('🔄 Vẽ lại', () => { this.m3Progress = 0; }, false, '#64748b');
        row2.appendChild(btnEq);
        row2.appendChild(btnReplay);

        targetBox.appendChild(row1);
        targetBox.appendChild(row2);
      }
    }

    createButton(label, onClick, isActive = false, customColor = null) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      const bg = customColor ? customColor : (isActive ? '#0284c7' : 'rgba(30, 41, 59, 0.85)');
      const color = (isActive || customColor) ? '#ffffff' : '#cbd5e1';
      const border = isActive ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)';
      btn.style.cssText = `background: ${bg}; border: ${border}; color: ${color}; padding: 5px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; flex: 1; text-align: center;`;
      btn.onclick = onClick;
      return btn;
    }

    // ── XỬ LÝ MÔ HÌNH 1 ──
    setM1Eta(mode) {
      this.m1EtaMode = mode;
      if (mode === 'low') {
        this.m1Q1 = 100; this.m1Q2 = 75; this.m1WorkA = 25; this.m1Eta = 25;
      } else if (mode === 'std') {
        this.m1Q1 = 100; this.m1Q2 = 60; this.m1WorkA = 40; this.m1Eta = 40;
      } else if (mode === 'carnot') {
        this.m1Q1 = 100; this.m1Q2 = 50; this.m1WorkA = 50; this.m1Eta = 50;
      }
      this.renderControls();
      this.updateLegend();
    }

    // ── XỬ LÝ MÔ HÌNH 2 ──
    setM2Stroke(stroke) {
      this.m2Auto = false;
      this.m2Stroke = stroke;
      if (stroke === 1) this.m2CrankAngle = 0; // Hút
      else if (stroke === 2) this.m2CrankAngle = Math.PI; // Nén
      else if (stroke === 3) this.m2CrankAngle = Math.PI * 2; // Nổ
      else if (stroke === 4) this.m2CrankAngle = Math.PI * 3; // Xả
      this.renderControls();
      this.updateLegend();
    }

    // ── XỬ LÝ MÔ HÌNH 3 ──
    setM3Mode(mode) {
      this.m3Mode = mode;
      this.m3Progress = 0;
      if (mode === 'crystal') {
        this.m3LiquidMat.color.setHex(0x38bdf8); // Nước đá -> nước
      } else if (mode === 'amorphous') {
        this.m3LiquidMat.color.setHex(0xf59e0b); // Sáp vàng
      } else if (mode === 'equilibrium') {
        this.m3LiquidMat.color.setHex(0xa855f7); // Cân bằng
      }
      this.renderControls();
      this.updateLegend();
    }

    // ── CẬP NHẬT HUD OVERLAY ──
    updateLegend() {
      if (!this.legendOverlay) return;

      this.legendOverlay.style.maxWidth = '260px';
      this.legendOverlay.style.fontSize = '11px';

      if (this.currentSceneIdx === 0) {
        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            ⚙️ NGUYÊN LÝ ĐỘNG CƠ NHIỆT & HIỆU SUẤT
          </div>
          <div>🔥 Nguồn nóng (T₁ = 600K): <b style="color: #ef4444;">Q₁ = ${this.m1Q1} J</b></div>
          <div>❄️ Nguồn lạnh (T₂ = 300K): <b style="color: #38bdf8;">Q₂ = ${this.m1Q2} J (Thải nhiệt)</b></div>
          <div>⚡ Công cơ học có ích: <b style="color: #10b981;">A = Q₁ - Q₂ = ${this.m1WorkA} J</b></div>
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin-top: 3px; padding-top: 3px;">
            🎯 Hiệu suất: <b>H = A / Q₁ = <span style="color: #f59e0b;">${this.m1Eta}%</span></b>
          </div>
          <div style="background: rgba(245, 158, 11, 0.15); padding: 2px 5px; border-radius: 4px; margin-top: 2px; color: #fde68a;">
            👉 <i>Định luật II: H luôn < 100%, không thể chuyển toàn bộ Q thành công!</i>
          </div>
        `;
      } 
      else if (this.currentSceneIdx === 1) {
        let strokeName = '1. KỲ HÚT (NẠP)';
        let strokeDesc = 'Van nạp mở, van xả đóng. Piston đi xuống hút hỗn hợp nhiên liệu + không khí.';
        let strokeColor = '#38bdf8';
        if (this.m2Stroke === 2) {
          strokeName = '2. KỲ NÉN';
          strokeDesc = 'Cả 2 van đóng kín. Piston đi lên nén hòa khí lại ở áp suất & nhiệt độ cao.';
          strokeColor = '#f59e0b';
        } else if (this.m2Stroke === 3) {
          strokeName = '3. KỲ NỔ (SINH CÔNG CÓ ÍCH)';
          strokeDesc = 'Bugi đánh lửa bùng cháy, sinh áp suất cực đại đẩy piston lao xuống. KỲ DUY NHẤT SINH CÔNG!';
          strokeColor = '#ef4444';
        } else if (this.m2Stroke === 4) {
          strokeName = '4. KỲ XẢ';
          strokeDesc = 'Van xả mở, van nạp đóng. Piston đi lên quét toàn bộ khí thải ra ngoài ống xả.';
          strokeColor = '#94a3b8';
        }

        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            🚗 ĐỘNG CƠ ĐỐT TRONG 4 KỲ
          </div>
          <div style="color: ${strokeColor}; font-weight: 700; font-size: 12px; margin-top: 2px;">
            ${strokeName}
          </div>
          <div style="margin-top: 2px; line-height: 1.3;">
            ${strokeDesc}
          </div>
          <div style="background: rgba(16, 185, 129, 0.15); padding: 2px 5px; border-radius: 4px; margin-top: 3px; color: #a7f3d0;">
            ${this.m2Auto ? '🔄 Đang chạy tự động 4 kỳ tuần hoàn' : '⏸️ Đang dừng xem chi tiết kỳ này'}
          </div>
        `;
      } 
      else if (this.currentSceneIdx === 2) {
        this.legendOverlay.style.maxWidth = '130px';
        this.legendOverlay.style.fontSize = '10px';

        let title = '🧊 KẾT TINH (NƯỚC ĐÁ)';
        let note = 'Nóng chảy tại 0°C (T không đổi, đoạn nằm ngang!).';
        if (this.m3Mode === 'amorphous') {
          title = '🕯️ VÔ ĐỊNH HÌNH';
          note = 'Đường cong liên tục, không có đoạn ngang!';
        } else if (this.m3Mode === 'equilibrium') {
          title = '⚖️ CÂN BẰNG NHIỆT';
          note = 'Giao nhau tại Tcb = 40°C. Độ dốc tanα ~ 1/(mc).';
        }

        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 10.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            📈 ĐỒ THỊ NHIỆT T - t
          </div>
          <div style="font-weight: 700; color: #f59e0b; margin-top: 2px;">${title}</div>
          <div>🌡️ T: <b style="color: #38bdf8;">${Math.round(this.m3TempCurrent)}°C</b></div>
          <div style="background: rgba(56, 189, 248, 0.15); padding: 2px 4px; border-radius: 4px; margin-top: 2px; color: #bae6fd; line-height: 1.25;">
            👉 ${note}
          </div>
        `;
      }
    }

    // ── ANIMATION LOOP ──
    animate() {
      this.animId = requestAnimationFrame(this.animate);
      this.time += 0.016;

      if (this.controls) this.controls.update();

      if (this.currentSceneIdx === 0) {
        this.updateModel1();
      } else if (this.currentSceneIdx === 1) {
        this.updateModel2();
      } else if (this.currentSceneIdx === 2) {
        this.updateModel3();
        this.drawGraph();
      }

      this.renderer.render(this.scene, this.camera);
    }

    updateModel1() {
      if (this.m1Running) {
        const speed = (this.m1Eta / 40) * 0.04;
        this.m1FlywheelAngle += speed;
      }

      // Quay bánh đà
      this.m1Flywheel.rotation.z = this.m1FlywheelAngle;

      // Piston dao động điều hòa
      const py = Math.sin(this.m1FlywheelAngle) * 0.45;
      this.m1Piston.position.y = py;

      // Thanh truyền nối
      this.m1ConRod.position.set(0.25, py / 2, 0);
      this.m1ConRod.rotation.z = Math.PI / 2 + Math.sin(this.m1FlywheelAngle) * 0.2;

      // Dòng hạt nhiệt Q1 chảy từ nguồn nóng xuống
      for (let i = 0; i < this.m1HeatParticlesQ1.length; i++) {
        const p = this.m1HeatParticlesQ1[i];
        p.position.y -= 0.025;
        if (p.position.y < 0.6) {
          p.position.y = 1.8;
          p.position.x = -0.8 + (Math.random() - 0.5) * 0.7;
        }
      }

      // Dòng hạt nhiệt Q2 chảy từ xilanh xuống nguồn lạnh
      for (let i = 0; i < this.m1HeatParticlesQ2.length; i++) {
        const p = this.m1HeatParticlesQ2[i];
        p.position.y -= 0.025;
        if (p.position.y < -1.8) {
          p.position.y = -0.6;
          p.position.x = -0.8 + (Math.random() - 0.5) * 0.7;
        }
      }
    }

    updateModel2() {
      if (this.m2Auto) {
        this.m2CrankAngle += 0.035;
        if (this.m2CrankAngle >= Math.PI * 4) {
          this.m2CrankAngle -= Math.PI * 4;
        }
        // Xác định kỳ hiện tại dựa trên góc quay (0 -> 4pi)
        const curCycle = (this.m2CrankAngle / (Math.PI * 4)) * 4;
        const newStroke = Math.floor(curCycle) + 1;
        if (newStroke !== this.m2Stroke) {
          this.m2Stroke = newStroke;
          this.updateLegend();
        }
      }

      // Vị trí piston theo góc quay trục khuỷu
      // Điểm chết trên: y = 1.3, Điểm chết dưới: y = -0.3
      const angle = this.m2CrankAngle;
      const pistonY = 0.5 + Math.cos(angle) * 0.7;
      this.m2Piston.position.y = pistonY;

      // Trục khuỷu và thanh truyền
      this.m2Crank.rotation.x = angle;
      this.m2ConRod.position.set(Math.sin(angle) * 0.15, (pistonY - 1.8) / 2, 0);
      this.m2ConRod.rotation.z = Math.sin(angle) * 0.25;

      // Điều khiển Van Nạp & Van Xả theo kỳ
      if (this.m2Stroke === 1) {
        // Hút: Van nạp mở (hạ xuống)
        this.m2ValveIn.position.y = 1.95;
        this.m2ValveEx.position.y = 2.1;
      } else if (this.m2Stroke === 4) {
        // Xả: Van xả mở (hạ xuống)
        this.m2ValveIn.position.y = 2.1;
        this.m2ValveEx.position.y = 1.95;
      } else {
        // Nén và Nổ: Cả 2 van đóng kín
        this.m2ValveIn.position.y = 2.1;
        this.m2ValveEx.position.y = 2.1;
      }

      // Kỳ 3: Bugi đánh lửa lóe sáng
      if (this.m2Stroke === 3) {
        const spark = Math.random() > 0.3 ? 0.9 : 0.2;
        this.m2SparkMat.opacity = spark;
        this.m2CombustionLight.intensity = spark * 2.5;
      } else {
        this.m2SparkMat.opacity = 0;
        this.m2CombustionLight.intensity = 0;
      }
    }

    updateModel3() {
      this.m3Progress = Math.min(1.0, this.m3Progress + 0.0035);

      if (this.m3Mode === 'crystal') {
        // Nước đá: -20°C -> 0°C -> 0°C (nóng chảy) -> 40°C
        if (this.m3Progress < 0.25) {
          this.m3TempCurrent = -20 + (this.m3Progress / 0.25) * 20; // -20 -> 0
        } else if (this.m3Progress < 0.6) {
          this.m3TempCurrent = 0; // Đứng yên ở 0°C
        } else {
          this.m3TempCurrent = ((this.m3Progress - 0.6) / 0.4) * 40; // 0 -> 40°C
        }
      } else if (this.m3Mode === 'amorphous') {
        // Sáp: Cong liên tục từ 20°C -> 70°C
        this.m3TempCurrent = 20 + Math.pow(this.m3Progress, 0.8) * 50;
      } else if (this.m3Mode === 'equilibrium') {
        // Cân bằng: T1 hạ từ 80->40, T2 tăng từ 10->40
        this.m3TempCurrent = 80 - this.m3Progress * 40;
      }

      // Cập nhật chiều cao cột nhiệt kế mô hình 3
      const h = THREE.MathUtils.clamp((this.m3TempCurrent + 30) / 100 * 1.6, 0.2, 1.8);
      this.m3ThermoCol.scale.y = h;
      this.m3ThermoCol.position.y = -0.9 + h / 2;
    }

    // ── VẼ ĐỒ THỊ 2D LÊN OVERLAY CANVAS ──
    drawGraph() {
      if (!this.graphCtx || this.currentSceneIdx !== 2) return;
      const ctx = this.graphCtx;
      const w = this.graphCanvas.width;
      const h = this.graphCanvas.height;

      ctx.clearRect(0, 0, w, h);

      // Tọa độ gốc đồ thị
      const ox = 45;
      const oy = h - 35;
      const plotW = w - ox - 25;
      const plotH = oy - 35;

      // Trục tọa độ
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(w - 15, oy); // Trục t (thời gian)
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox, 20);     // Trục T (nhiệt độ)
      ctx.stroke();

      // Mũi tên trục
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('t (phút)', w - 65, oy + 25);
      ctx.fillText('T (°C)', ox - 35, 25);

      // Lưới mờ
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let y = oy - 40; y > 30; y -= 40) {
        ctx.beginPath();
        ctx.moveTo(ox, y);
        ctx.lineTo(w - 20, y);
        ctx.stroke();
      }

      if (this.m3Mode === 'crystal') {
        // ĐỒ THỊ KẾT TINH (NƯỚC ĐÁ)
        // 0°C nằm ở khoảng 1/3 chiều cao
        const y0C = oy - plotH * 0.35;

        // Vạch 0°C
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(ox, y0C);
        ctx.lineTo(w - 20, y0C);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('0°C', ox - 35, y0C + 5);

        // Vẽ đường biểu diễn nhiệt độ
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();

        const x1 = ox;
        const y1 = oy; // -20°C

        const x2 = ox + plotW * 0.25;
        const y2 = y0C; // Chạm 0°C

        const x3 = ox + plotW * 0.6;
        const y3 = y0C; // Đoạn NẰM NGANG

        const x4 = ox + plotW;
        const y4 = oy - plotH * 0.85; // Tăng tiếp

        ctx.moveTo(x1, y1);
        if (this.m3Progress <= 0.25) {
          const ratio = this.m3Progress / 0.25;
          ctx.lineTo(x1 + (x2 - x1) * ratio, y1 + (y2 - y1) * ratio);
        } else if (this.m3Progress <= 0.6) {
          ctx.lineTo(x2, y2);
          const ratio = (this.m3Progress - 0.25) / 0.35;
          ctx.lineTo(x2 + (x3 - x2) * ratio, y2);
        } else {
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          const ratio = (this.m3Progress - 0.6) / 0.4;
          ctx.lineTo(x3 + (x4 - x3) * ratio, y3 + (y4 - y3) * ratio);
        }
        ctx.stroke();

        // Chú thích đoạn nằm ngang
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('⚡ Nóng chảy (T = const)', x2 + 5, y0C - 10);
      } 
      else if (this.m3Mode === 'amorphous') {
        // ĐỒ THỊ VÔ ĐỊNH HÌNH (SÁP / THỦY TINH - ĐƯỜNG CONG LIÊN TỤC)
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);

        const steps = 40;
        const maxStep = Math.floor(steps * this.m3Progress);
        for (let i = 1; i <= maxStep; i++) {
          const px = ox + (plotW * (i / steps));
          const prog = i / steps;
          const py = oy - Math.pow(prog, 0.75) * (plotH * 0.85);
          ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('Đường cong liên tục', ox + 30, oy - plotH * 0.4);
      } 
      else if (this.m3Mode === 'equilibrium') {
        // ĐỒ THỊ CÂN BẰNG NHIỆT (2 ĐƯỜNG GẶP NHAU)
        const xIntersect = ox + plotW * 0.7;
        const yIntersect = oy - plotH * 0.45;

        // Đường 1: Tỏa nhiệt (Đỏ) hạ từ đỉnh xuống
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox, oy - plotH * 0.85);
        const ratio = Math.min(1.0, this.m3Progress / 0.7);
        ctx.lineTo(ox + (xIntersect - ox) * ratio, (oy - plotH * 0.85) + (yIntersect - (oy - plotH * 0.85)) * ratio);
        ctx.stroke();

        // Đường 2: Thu nhiệt (Xanh) tăng từ đáy lên
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox + (xIntersect - ox) * ratio, oy + (yIntersect - oy) * ratio);
        ctx.stroke();

        // Điểm cân bằng
        if (this.m3Progress >= 0.7) {
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(xIntersect, yIntersect, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 15px sans-serif';
          ctx.fillText('Tcb = 40°C', xIntersect + 8, yIntersect + 5);
        }
      }
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
      window.removeEventListener('resize', this.onResize);
      this.restoreDefaultToolbars();
      if (this.renderer && this.renderer.domElement) {
        this.renderer.domElement.remove();
      }
      if (this.graphCanvas) {
        this.graphCanvas.remove();
      }
    }
  }

  return SimB06DongCoNhiet;
});
