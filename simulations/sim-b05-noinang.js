/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 5: NỘI NĂNG & ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC
 * Mã bài học: Be5b72ccf1261
 * Thiết kế hoàn toàn theo đúng kịch bản trực quan sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: BẢN CHẤT NỘI NĂNG U = f(T, V)
 *    - Nội năng U = tổng động năng chuyển động nhiệt phân tử + tổng thế năng tương tác giữa chúng.
 *    - Động năng Ed phụ thuộc vào Nhiệt độ T (T tăng -> phân tử bay nhanh hơn).
 *    - Thế năng Et phụ thuộc vào Thể tích V / khoảng cách phân tử r (nén hay dãn -> r thay đổi).
 *    - So sánh Khí thực (U = Ed + Et) vs Khí lý tưởng (bỏ qua thế năng, U chỉ phụ thuộc T).
 * 
 * 2. MÔ HÌNH 2: HAI CÁCH LÀM THAY ĐỔI NỘI NĂNG (A vs Q)
 *    - Thực hiện công A: Ngoại lực nén piston -> Cơ năng chuyển hóa thành Nội năng, khí nóng lên.
 *    - Truyền nhiệt Q: Đun nóng đáy bình bằng đèn cồn -> Không có chuyển hóa năng lượng, chỉ TRUYỀN nội năng từ nguồn nóng sang khối khí.
 * 
 * 3. MÔ HÌNH 3: ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC (ΔU = A + Q)
 *    - Hệ xilanh piston với 4 kịch bản quy ước dấu kinh điển:
 *      + Kịch bản 1: Nén khí nhận nhiệt (A > 0, Q > 0 => ΔU > 0 nội năng tăng mạnh).
 *      + Kịch bản 2: Dãn nở sinh công đoạn nhiệt (A < 0, Q = 0 => ΔU < 0 nội năng giảm, khí lạnh đi).
 *      + Kịch bản 3: Nhận nhiệt dãn nở sinh công (Q > 0, A < 0 => ΔU biến thiên theo độ lớn).
 *      + Kịch bản 4: Nén khí tỏa nhiệt đẳng nhiệt (A > 0, Q < 0 => ΔU = 0 nhiệt độ không đổi).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB05NoiNang = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB05NoiNang {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Bản chất U=f(T,V), 1: Công A vs Nhiệt Q, 2: Định luật I (ΔU = A + Q)
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: U = f(T, V) ──
      this.m1TempMode = 'room'; // 'cold' (150K) | 'room' (300K) | 'hot' (600K)
      this.m1VolMode = 'norm';  // 'comp' (nhỏ) | 'norm' (vừa) | 'exp' (lớn)
      this.m1GasType = 'real';  // 'real' (khí thực: Ed + Et) | 'ideal' (khí lí tưởng: chỉ Ed)
      this.m1Particles = [];
      this.m1BoxBounds = { x: 2.2, y: 2.2, z: 2.2 };
      this.m1SpringLines = [];

      // ── BIẾN SỐ MÔ HÌNH 2: HAI CÁCH THAY ĐỔI NỘI NĂNG (A vs Q) ──
      this.m2Mode = 'idle'; // 'work' (công A) | 'heat' (nhiệt Q) | 'idle'
      this.m2PistonY = 1.6;
      this.m2TargetPistonY = 1.6;
      this.m2Temp = 25; // 25°C ban đầu
      this.m2TargetTemp = 25;
      this.m2FlameIntensity = 0;
      this.m2Particles = [];

      // ── BIẾN SỐ MÔ HÌNH 3: ĐỊNH LUẬT I (ΔU = A + Q) ──
      this.m3Scenario = 1; // 1: A>0, Q>0 | 2: A<0, Q=0 | 3: Q>0, A<0 | 4: A>0, Q<0
      this.m3WorkA = 30; // J
      this.m3HeatQ = 20; // J
      this.m3DeltaU = 50; // J
      this.m3PistonY = 1.6;
      this.m3TargetPistonY = 1.6;
      this.m3GasColor = 0x38bdf8;
      this.m3Particles = [];

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

      // 4. Legend Overlay trong suốt
      this.legendOverlay = document.createElement('div');
      this.legendOverlay.className = 'sim-legend-overlay';
      this.legendOverlay.style.cssText = 'position: absolute; top: 40px; left: 8px; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.08); padding: 5px 8px; border-radius: 6px; font-size: 11px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 3px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: left; max-width: 260px;';
      this.container.appendChild(this.legendOverlay);

      // 5. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 25;
        this.controls.minDistance = 3;
      }

      // 6. Lights
      this.setupLights();

      // 7. Groups
      this.groupM1 = new THREE.Group();
      this.groupM2 = new THREE.Group();
      this.groupM3 = new THREE.Group();

      this.scene.add(this.groupM1);
      this.scene.add(this.groupM2);
      this.scene.add(this.groupM3);

      this.buildModel1InternalEnergy();
      this.buildModel2WorkAndHeat();
      this.buildModel3FirstLaw();

      // 8. UI Elements
      this.buildUI();
      this.switchScene(0);

      // 9. Resize Listener
      this.onResize = this.onResize.bind(this);
      window.addEventListener('resize', this.onResize);

      // 10. Start Loop
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);
    }

    resetCamera() {
      this.camera.position.set(0, 2.2, 7.2);
      this.camera.lookAt(0, 0.2, 0);
    }

    setupLights() {
      const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
      dirLight1.position.set(5, 10, 7);
      this.scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.4);
      dirLight2.position.set(-5, -3, -5);
      this.scene.add(dirLight2);
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 1: BẢN CHẤT NỘI NĂNG U = f(T, V)
    // ══════════════════════════════════════════════════════════════════
    buildModel1InternalEnergy() {
      // Buồng chứa khí trong suốt
      const boxGeo = new THREE.BoxGeometry(3.6, 3.2, 2.6);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.15,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      this.m1BoxMesh = new THREE.Mesh(boxGeo, boxMat);
      this.groupM1.add(this.m1BoxMesh);

      // Khung viền kim loại bao quanh
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2, transparent: true, opacity: 0.7 });
      this.m1Wireframe = new THREE.LineSegments(edges, lineMat);
      this.groupM1.add(this.m1Wireframe);

      // Piston điều chỉnh thể tích (mặt trên di động)
      const pistonGeo = new THREE.BoxGeometry(3.55, 0.18, 2.55);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
      this.m1Piston = new THREE.Mesh(pistonGeo, pistonMat);
      this.m1Piston.position.y = 1.4;
      this.groupM1.add(this.m1Piston);

      // Cán piston
      const rodGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8, roughness: 0.2 });
      this.m1Rod = new THREE.Mesh(rodGeo, rodMat);
      this.m1Rod.position.set(0, 2.2, 0);
      this.groupM1.add(this.m1Rod);

      // 40 Phân tử khí
      const pGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const count = 38;
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.3,
          roughness: 0.3
        });
        const mesh = new THREE.Mesh(pGeo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 3.0,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 2.0
        );
        mesh.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        );
        mesh.speedMultiplier = 1.0;
        this.groupM1.add(mesh);
        this.m1Particles.push(mesh);
      }

      // Các đường nối biểu diễn thế năng tương tác (chỉ bật khi Khí thực)
      this.m1SpringGroup = new THREE.Group();
      this.groupM1.add(this.m1SpringGroup);
      for (let i = 0; i < 15; i++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xf59e0b,
          dashSize: 0.1,
          gapSize: 0.05,
          transparent: true,
          opacity: 0.5
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.computeLineDistances();
        this.m1SpringGroup.add(line);
        this.m1SpringLines.push(line);
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 2: HAI CÁCH LÀM THAY ĐỔI NỘI NĂNG (A vs Q)
    // ══════════════════════════════════════════════════════════════════
    buildModel2WorkAndHeat() {
      // Vỏ xilanh trong suốt
      const cylGeo = new THREE.CylinderGeometry(1.4, 1.4, 3.4, 32, 1, true);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      this.groupM2.add(cylMesh);

      // Đáy xilanh dày
      const bottomGeo = new THREE.CylinderGeometry(1.45, 1.45, 0.2, 32);
      const bottomMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
      bottomMesh.position.y = -1.7;
      this.groupM2.add(bottomMesh);

      // Piston trượt
      const pistonGeo = new THREE.CylinderGeometry(1.38, 1.38, 0.22, 32);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
      this.m2Piston = new THREE.Mesh(pistonGeo, pistonMat);
      this.m2Piston.position.y = this.m2PistonY;
      this.groupM2.add(this.m2Piston);

      // Cán piston & tay cầm
      const shaftGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.0, 16);
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.1 });
      this.m2Shaft = new THREE.Mesh(shaftGeo, shaftMat);
      this.m2Shaft.position.y = this.m2PistonY + 1.0;
      this.groupM2.add(this.m2Shaft);

      const handleGeo = new THREE.CylinderGeometry(0.18, 0.18, 1.4, 16);
      handleGeo.rotateZ(Math.PI / 2);
      const handleMesh = new THREE.Mesh(handleGeo, shaftMat);
      handleMesh.position.y = 1.0;
      this.m2Shaft.add(handleMesh);

      // Nhiệt kế gắn bên hông xilanh
      const thermoBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2.4, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
      );
      thermoBody.position.set(1.65, 0, 0);
      this.groupM2.add(thermoBody);

      this.m2ThermoCol = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.8, 16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      this.m2ThermoCol.position.set(1.65, -0.6, 0);
      this.groupM2.add(this.m2ThermoCol);

      // Bầu nhiệt kế
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      bulb.position.set(1.65, -1.2, 0);
      this.groupM2.add(bulb);

      // Ngọn lửa đèn cồn ở dưới đáy xilanh
      this.m2FlameGroup = new THREE.Group();
      this.m2FlameGroup.position.set(0, -2.1, 0);
      this.m2FlameGroup.visible = false;
      this.groupM2.add(this.m2FlameGroup);

      // Thân đèn cồn
      const burnerBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.9, 0.6, 24),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5, roughness: 0.4 })
      );
      burnerBody.position.y = -0.4;
      this.m2FlameGroup.add(burnerBody);

      // Ngọn lửa 3 tầng
      const flameCoreGeo = new THREE.ConeGeometry(0.25, 0.8, 16);
      flameCoreGeo.translate(0, 0.4, 0);
      this.m2FlameCore = new THREE.Mesh(
        flameCoreGeo,
        new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.9 })
      );
      this.m2FlameGroup.add(this.m2FlameCore);

      const flameOuterGeo = new THREE.ConeGeometry(0.4, 1.1, 16);
      flameOuterGeo.translate(0, 0.5, 0);
      this.m2FlameOuter = new THREE.Mesh(
        flameOuterGeo,
        new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.6 })
      );
      this.m2FlameGroup.add(this.m2FlameOuter);

      // 36 Phân tử khí trong xilanh
      const pGeo = new THREE.SphereGeometry(0.08, 16, 16);
      for (let i = 0; i < 36; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4
        });
        const mesh = new THREE.Mesh(pGeo, mat);
        const r = Math.random() * 1.1;
        const theta = Math.random() * Math.PI * 2;
        mesh.position.set(
          Math.cos(theta) * r,
          -1.5 + Math.random() * 2.8,
          Math.sin(theta) * r
        );
        mesh.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        );
        this.groupM2.add(mesh);
        this.m2Particles.push(mesh);
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // MÔ HÌNH 3: ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC (ΔU = A + Q)
    // ══════════════════════════════════════════════════════════════════
    buildModel3FirstLaw() {
      // Xilanh định lượng với thước chia vạch
      const cylGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.4, 32, 1, true);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0.1,
        side: THREE.DoubleSide
      });
      const cylMesh = new THREE.Mesh(cylGeo, cylMat);
      this.groupM3.add(cylMesh);

      // Đáy xilanh
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.25, 32);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = -1.75;
      this.groupM3.add(baseMesh);

      // Thước chia thể tích (Vạch kẻ 3D)
      const rulerGroup = new THREE.Group();
      rulerGroup.position.set(-1.6, 0, 0);
      for (let y = -1.4; y <= 1.4; y += 0.4) {
        const markGeo = new THREE.BoxGeometry(0.2, 0.02, 0.02);
        const markMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const mark = new THREE.Mesh(markGeo, markMat);
        mark.position.set(0, y, 0);
        rulerGroup.add(mark);
      }
      this.groupM3.add(rulerGroup);

      // Piston
      const pistonGeo = new THREE.CylinderGeometry(1.48, 1.48, 0.25, 32);
      const pistonMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.2 });
      this.m3Piston = new THREE.Mesh(pistonGeo, pistonMat);
      this.m3Piston.position.y = this.m3PistonY;
      this.groupM3.add(this.m3Piston);

      // Cán piston
      const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16);
      const shaftMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.1 });
      this.m3Shaft = new THREE.Mesh(shaftGeo, shaftMat);
      this.m3Shaft.position.y = this.m3PistonY + 1.1;
      this.groupM3.add(this.m3Shaft);

      // Mũi tên chỉ lực/công A (Arrow cơ học)
      this.m3WorkArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 2.8, 0),
        0.8,
        0x10b981,
        0.25,
        0.15
      );
      this.groupM3.add(this.m3WorkArrow);

      // Vòng hào quang nhiệt Q xung quanh đáy
      const heatRingGeo = new THREE.TorusGeometry(1.65, 0.08, 16, 32);
      this.m3HeatRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0.7 });
      this.m3HeatRing = new THREE.Mesh(heatRingGeo, this.m3HeatRingMat);
      this.m3HeatRing.rotation.x = Math.PI / 2;
      this.m3HeatRing.position.y = -1.6;
      this.groupM3.add(this.m3HeatRing);

      // 40 Phân tử khí
      const pGeo = new THREE.SphereGeometry(0.08, 16, 16);
      for (let i = 0; i < 40; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4
        });
        const mesh = new THREE.Mesh(pGeo, mat);
        const r = Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        mesh.position.set(
          Math.cos(theta) * r,
          -1.5 + Math.random() * 2.8,
          Math.sin(theta) * r
        );
        mesh.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        );
        this.groupM3.add(mesh);
        this.m3Particles.push(mesh);
      }
    }

    // ══════════════════════════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════════
    // GIAO DIỆN ĐIỀU KHIỂN (UI) & TABS
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
      // 1. Header Tabs nằm phía trên canvas
      this.tabBar = document.createElement('div');
      this.tabBar.className = 'sim-tab-bar';
      this.tabBar.style.cssText = 'position: absolute; top: 6px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px; z-index: 25; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); padding: 3px 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 4px 12px rgba(0,0,0,0.4); max-width: 95%;';

      const tabs = [
        { id: 0, label: '⚛️ Bản chất U = f(T,V)' },
        { id: 1, label: '⚙️🔥 Công A vs Nhiệt Q' },
        { id: 2, label: '⚖️ Định luật I: ΔU = A+Q' }
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

      // Cập nhật tab active
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

      // Ẩn/Hiện nhóm 3D
      this.groupM1.visible = (idx === 0);
      this.groupM2.visible = (idx === 1);
      this.groupM3.visible = (idx === 2);

      this.hideDefaultToolbars();
      this.renderControls();
      this.updateLegend();
    }

    renderControls() {
      const targetBox = this.getControlsContainer();
      if (!targetBox) return;
      targetBox.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // Tab 0: U = f(T, V)
        const row1 = document.createElement('div');
        row1.style.cssText = 'display: flex; gap: 5px; width: 100%; justify-content: center;';
        const tBtn1 = this.createButton('❄️ Lạnh 150K', () => this.setM1Temp('cold'), this.m1TempMode === 'cold');
        const tBtn2 = this.createButton('🌡️ Phòng 300K', () => this.setM1Temp('room'), this.m1TempMode === 'room');
        const tBtn3 = this.createButton('🔥 Nóng 600K', () => this.setM1Temp('hot'), this.m1TempMode === 'hot');
        row1.appendChild(tBtn1);
        row1.appendChild(tBtn2);
        row1.appendChild(tBtn3);

        const row2 = document.createElement('div');
        row2.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const vBtn1 = this.createButton('🤏 Nén (V nhỏ)', () => this.setM1Vol('comp'), this.m1VolMode === 'comp');
        const vBtn2 = this.createButton('📦 Chuẩn', () => this.setM1Vol('norm'), this.m1VolMode === 'norm');
        const vBtn3 = this.createButton('↔️ Dãn (V lớn)', () => this.setM1Vol('exp'), this.m1VolMode === 'exp');
        const gBtn = this.createButton(
          this.m1GasType === 'real' ? '🌿 Khí thực' : '✨ Khí lí tưởng',
          () => this.toggleM1GasType(),
          true,
          this.m1GasType === 'real' ? '#059669' : '#f59e0b'
        );
        row2.appendChild(vBtn1);
        row2.appendChild(vBtn2);
        row2.appendChild(vBtn3);
        row2.appendChild(gBtn);

        targetBox.appendChild(row1);
        targetBox.appendChild(row2);
      } 
      else if (this.currentSceneIdx === 1) {
        // Tab 1: Công A vs Nhiệt Q
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 5px; width: 100%; justify-content: center; flex-wrap: wrap;';
        const btnWork = this.createButton('⚙️ Nén thực hiện công A', () => this.triggerM2Work(), this.m2Mode === 'work', '#10b981');
        const btnHeat = this.createButton('🔥 Đun nóng truyền nhiệt Q', () => this.triggerM2Heat(), this.m2Mode === 'heat', '#ef4444');
        const btnReset = this.createButton('🔄 Đặt lại', () => this.resetM2(), false, '#64748b');

        row.appendChild(btnWork);
        row.appendChild(btnHeat);
        row.appendChild(btnReset);
        targetBox.appendChild(row);
      } 
      else if (this.currentSceneIdx === 2) {
        // Tab 2: Định luật I (ΔU = A + Q)
        const row1 = document.createElement('div');
        row1.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const s1 = this.createButton('1️⃣ Nén & Cấp nhiệt (+50J)', () => this.setM3Scenario(1), this.m3Scenario === 1);
        const s2 = this.createButton('2️⃣ Dãn sinh công (-35J)', () => this.setM3Scenario(2), this.m3Scenario === 2);
        row1.appendChild(s1);
        row1.appendChild(s2);

        const row2 = document.createElement('div');
        row2.style.cssText = 'display: flex; gap: 4px; width: 100%; justify-content: center;';
        const s3 = this.createButton('3️⃣ Cấp nhiệt dãn nở (+20J)', () => this.setM3Scenario(3), this.m3Scenario === 3);
        const s4 = this.createButton('4️⃣ Nén tỏa nhiệt (0J)', () => this.setM3Scenario(4), this.m3Scenario === 4);
        row2.appendChild(s3);
        row2.appendChild(s4);

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
    setM1Temp(mode) {
      this.m1TempMode = mode;
      let mult = 1.0;
      let color = 0x38bdf8;
      if (mode === 'cold') { mult = 0.4; color = 0x60a5fa; }
      else if (mode === 'room') { mult = 1.0; color = 0x38bdf8; }
      else if (mode === 'hot') { mult = 2.2; color = 0xf87171; }

      this.m1Particles.forEach(p => {
        p.speedMultiplier = mult;
        p.material.color.setHex(color);
        p.material.emissive.setHex(color);
      });
      this.renderControls();
      this.updateLegend();
    }

    setM1Vol(mode) {
      this.m1VolMode = mode;
      let targetY = 1.4;
      if (mode === 'comp') targetY = 0.5;
      else if (mode === 'norm') targetY = 1.4;
      else if (mode === 'exp') targetY = 2.0;

      if (typeof gsap !== 'undefined') {
        gsap.to(this.m1Piston.position, { y: targetY, duration: 0.6 });
        gsap.to(this.m1Rod.position, { y: targetY + 0.8, duration: 0.6 });
      } else {
        this.m1Piston.position.y = targetY;
        this.m1Rod.position.y = targetY + 0.8;
      }

      this.m1BoxBounds.y = (targetY + 1.6) / 2;
      this.renderControls();
      this.updateLegend();
    }

    toggleM1GasType() {
      this.m1GasType = (this.m1GasType === 'real') ? 'ideal' : 'real';
      this.m1SpringGroup.visible = (this.m1GasType === 'real');
      this.renderControls();
      this.updateLegend();
    }

    // ── XỬ LÝ MÔ HÌNH 2 ──
    triggerM2Work() {
      this.m2Mode = 'work';
      this.m2FlameGroup.visible = false;
      this.m2TargetPistonY = 0.3; // Nén mạnh xuống
      this.m2TargetTemp = 75; // Nóng lên 75°C
      this.renderControls();
      this.updateLegend();
    }

    triggerM2Heat() {
      this.m2Mode = 'heat';
      this.m2FlameGroup.visible = true;
      this.m2TargetPistonY = 1.6; // Piston giữ nguyên (đẳng tích)
      this.m2TargetTemp = 70; // Đun nóng lên 70°C
      this.renderControls();
      this.updateLegend();
    }

    resetM2() {
      this.m2Mode = 'idle';
      this.m2FlameGroup.visible = false;
      this.m2TargetPistonY = 1.6;
      this.m2TargetTemp = 25;
      this.renderControls();
      this.updateLegend();
    }

    // ── XỬ LÝ MÔ HÌNH 3 ──
    setM3Scenario(num) {
      this.m3Scenario = num;
      if (num === 1) {
        // Nén khí & Cấp nhiệt: A = +30J, Q = +20J => ΔU = +50J
        this.m3WorkA = 30;
        this.m3HeatQ = 20;
        this.m3DeltaU = 50;
        this.m3TargetPistonY = 0.5; // Nén xuống
        this.m3GasColor = 0xef4444; // Đỏ nóng
        this.m3WorkArrow.visible = true;
        this.m3WorkArrow.setDirection(new THREE.Vector3(0, -1, 0)); // Nén từ trên xuống
        this.m3WorkArrow.position.set(0, 2.6, 0);
        this.m3WorkArrow.setColor(0x10b981);
        this.m3HeatRing.visible = true;
        this.m3HeatRingMat.color.setHex(0xef4444); // Cấp nhiệt
      } 
      else if (num === 2) {
        // Đoạn nhiệt dãn nở: A = -35J, Q = 0 => ΔU = -35J
        this.m3WorkA = -35;
        this.m3HeatQ = 0;
        this.m3DeltaU = -35;
        this.m3TargetPistonY = 1.5; // Đẩy lên
        this.m3GasColor = 0x38bdf8; // Lạnh xanh
        this.m3WorkArrow.visible = true;
        this.m3WorkArrow.setDirection(new THREE.Vector3(0, 1, 0)); // Đẩy lên
        this.m3WorkArrow.position.set(0, 1.8, 0);
        this.m3WorkArrow.setColor(0xf59e0b);
        this.m3HeatRing.visible = false;
      } 
      else if (num === 3) {
        // Cấp nhiệt dãn nở: Q = +60J, A = -40J => ΔU = +20J
        this.m3WorkA = -40;
        this.m3HeatQ = 60;
        this.m3DeltaU = 20;
        this.m3TargetPistonY = 1.5;
        this.m3GasColor = 0xf59e0b; // Vàng ấm
        this.m3WorkArrow.visible = true;
        this.m3WorkArrow.setDirection(new THREE.Vector3(0, 1, 0));
        this.m3WorkArrow.position.set(0, 1.8, 0);
        this.m3WorkArrow.setColor(0xf59e0b);
        this.m3HeatRing.visible = true;
        this.m3HeatRingMat.color.setHex(0xef4444);
      } 
      else if (num === 4) {
        // Nén tỏa nhiệt (Đẳng nhiệt): A = +40J, Q = -40J => ΔU = 0
        this.m3WorkA = 40;
        this.m3HeatQ = -40;
        this.m3DeltaU = 0;
        this.m3TargetPistonY = 0.6;
        this.m3GasColor = 0x38bdf8;
        this.m3WorkArrow.visible = true;
        this.m3WorkArrow.setDirection(new THREE.Vector3(0, -1, 0));
        this.m3WorkArrow.position.set(0, 2.6, 0);
        this.m3WorkArrow.setColor(0x10b981);
        this.m3HeatRing.visible = true;
        this.m3HeatRingMat.color.setHex(0x38bdf8); // Tỏa nhiệt ra môi trường
      }

      this.renderControls();
      this.updateLegend();
    }

    // ── CẬP NHẬT CHÚ THÍCH TRONG SUỐT (HUD OVERLAY) ──
    updateLegend() {
      if (!this.legendOverlay) return;

      if (this.currentSceneIdx === 0) {
        const tVal = this.m1TempMode === 'cold' ? '150 K (Lạnh)' : (this.m1TempMode === 'room' ? '300 K (Phòng)' : '600 K (Nóng)');
        const vVal = this.m1VolMode === 'comp' ? 'V nhỏ (Nén)' : (this.m1VolMode === 'norm' ? 'V chuẩn' : 'V lớn (Dãn)');
        const edVal = this.m1TempMode === 'cold' ? 'Thấp (phân tử chậm)' : (this.m1TempMode === 'room' ? 'Trung bình' : 'Rất cao (phân tử cực nhanh)');
        const etVal = this.m1GasType === 'ideal' ? '0 (Bỏ qua tương tác)' : (this.m1VolMode === 'comp' ? 'Lớn (khoảng cách r bé)' : 'Bé (khoảng cách r lớn)');
        const typeDesc = this.m1GasType === 'real' ? 'Khí thực: U = f(T, V)' : 'Khí lí tưởng: U = f(T)';

        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            ⚛️ BẢN CHẤT NỘI NĂNG: U = ΣEđ + ΣEt
          </div>
          <div>🌡️ Nhiệt độ T: <b style="color: #f87171;">${tVal}</b></div>
          <div>📦 Thể tích V: <b style="color: #38bdf8;">${vVal}</b></div>
          <div>⚡ Động năng ΣEđ(T): <b>${edVal}</b></div>
          <div>🧲 Thế năng ΣEt(V): <b style="color: #f59e0b;">${etVal}</b></div>
          <div style="background: rgba(56, 189, 248, 0.12); padding: 3px 5px; border-radius: 4px; margin-top: 2px; color: #7dd3fc;">
            👉 <b>${typeDesc}</b>
          </div>
        `;
      } 
      else if (this.currentSceneIdx === 1) {
        let actionDesc = 'Khí ở trạng thái cân bằng ban đầu (T = 25°C).';
        let natureDesc = 'Chọn một trong 2 cách để xem sự biến đổi nội năng.';
        if (this.m2Mode === 'work') {
          actionDesc = '⚙️ <b>Thực hiện công A</b>: Ấn mạnh cán piston nén khối khí.';
          natureDesc = '🔥 <b>Bản chất</b>: Có sự <i>chuyển hóa</i> Cơ năng thành Nội năng làm khí nóng lên!';
        } else if (this.m2Mode === 'heat') {
          actionDesc = '🔥 <b>Truyền nhiệt Q</b>: Ngọn lửa đèn cồn cung cấp nhiệt lượng qua đáy bình.';
          natureDesc = '💡 <b>Bản chất</b>: <i>Không chuyển hóa</i> năng lượng, chỉ <i>truyền</i> trực tiếp nội năng!';
        }

        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            ⚙️🔥 2 CÁCH BIẾN ĐỔI NỘI NĂNG
          </div>
          <div>🌡️ Nhiệt độ khí: <b style="color: ${this.m2Temp > 35 ? '#ef4444' : '#38bdf8'};">${Math.round(this.m2Temp)}°C</b></div>
          <div style="margin-top: 2px;">${actionDesc}</div>
          <div style="background: rgba(245, 158, 11, 0.15); padding: 3px 5px; border-radius: 4px; margin-top: 2px; color: #fde68a;">
            ${natureDesc}
          </div>
        `;
      } 
      else if (this.currentSceneIdx === 2) {
        let statusText = 'TĂNG';
        let statusColor = '#ef4444';
        if (this.m3DeltaU < 0) { statusText = 'GIẢM'; statusColor = '#38bdf8'; }
        else if (this.m3DeltaU === 0) { statusText = 'KHÔNG ĐỔI'; statusColor = '#94a3b8'; }

        this.legendOverlay.innerHTML = `
          <div style="font-weight: 700; color: #38bdf8; font-size: 11.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 2px;">
            ⚖️ ĐỊNH LUẬT I: ΔU = A + Q
          </div>
          <div>⚙️ Công nhận được A: <b style="color: ${this.m3WorkA >= 0 ? '#10b981' : '#f59e0b'};">${this.m3WorkA > 0 ? '+' : ''}${this.m3WorkA} J</b> ${this.m3WorkA > 0 ? '(Bị nén)' : (this.m3WorkA < 0 ? '(Dãn nở sinh công)' : '')}</div>
          <div>🔥 Nhiệt nhận được Q: <b style="color: ${this.m3HeatQ >= 0 ? '#ef4444' : '#38bdf8'};">${this.m3HeatQ > 0 ? '+' : ''}${this.m3HeatQ} J</b> ${this.m3HeatQ > 0 ? '(Nhận nhiệt)' : (this.m3HeatQ < 0 ? '(Tỏa nhiệt)' : '')}</div>
          <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin-top: 3px; padding-top: 3px;">
            🎯 Biến thiên: <b>ΔU = (${this.m3WorkA > 0 ? '+' : ''}${this.m3WorkA}) + (${this.m3HeatQ > 0 ? '+' : ''}${this.m3HeatQ}) = <span style="color: ${statusColor};">${this.m3DeltaU > 0 ? '+' : ''}${this.m3DeltaU} J</span></b>
          </div>
          <div style="background: rgba(16, 185, 129, 0.15); padding: 2px 5px; border-radius: 4px; margin-top: 2px; color: #a7f3d0;">
            👉 Nội năng khối khí: <b style="color: ${statusColor};">${statusText}</b>
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
      }

      this.renderer.render(this.scene, this.camera);
    }

    updateModel1() {
      const boundX = 1.6;
      const boundZ = 1.1;
      const minY = -1.5;
      const maxY = this.m1Piston.position.y - 0.15;

      // Cập nhật vị trí các phân tử khí
      for (let i = 0; i < this.m1Particles.length; i++) {
        const p = this.m1Particles[i];
        const spd = (p.speedMultiplier || 1.0) * 0.018;
        p.position.x += p.velocity.x * spd;
        p.position.y += p.velocity.y * spd;
        p.position.z += p.velocity.z * spd;

        // Va chạm đàn hồi thành hộp
        if (p.position.x > boundX) { p.position.x = boundX; p.velocity.x *= -1; }
        if (p.position.x < -boundX) { p.position.x = -boundX; p.velocity.x *= -1; }
        if (p.position.z > boundZ) { p.position.z = boundZ; p.velocity.z *= -1; }
        if (p.position.z < -boundZ) { p.position.z = -boundZ; p.velocity.z *= -1; }
        if (p.position.y > maxY) { p.position.y = maxY; p.velocity.y *= -1; }
        if (p.position.y < minY) { p.position.y = minY; p.velocity.y *= -1; }
      }

      // Cập nhật lò xo thế năng tương tác giữa các hạt lân cận
      if (this.m1GasType === 'real' && this.m1SpringLines.length > 0) {
        for (let i = 0; i < this.m1SpringLines.length; i++) {
          const p1 = this.m1Particles[i * 2];
          const p2 = this.m1Particles[i * 2 + 1];
          if (p1 && p2) {
            const positions = this.m1SpringLines[i].geometry.attributes.position;
            positions.setXYZ(0, p1.position.x, p1.position.y, p1.position.z);
            positions.setXYZ(1, p2.position.x, p2.position.y, p2.position.z);
            positions.needsUpdate = true;
          }
        }
      }
    }

    updateModel2() {
      // Di chuyển Piston mượt mà
      this.m2PistonY += (this.m2TargetPistonY - this.m2PistonY) * 0.08;
      this.m2Piston.position.y = this.m2PistonY;
      this.m2Shaft.position.y = this.m2PistonY + 1.0;

      // Cập nhật nhiệt độ nhiệt kế
      this.m2Temp += (this.m2TargetTemp - this.m2Temp) * 0.05;
      const thermoH = THREE.MathUtils.clamp((this.m2Temp / 100) * 1.8, 0.2, 2.0);
      this.m2ThermoCol.scale.y = thermoH;
      this.m2ThermoCol.position.y = -1.2 + thermoH / 2;

      // Ngọn lửa rung rinh
      if (this.m2FlameGroup.visible) {
        const s = 1.0 + Math.sin(this.time * 20) * 0.12;
        this.m2FlameCore.scale.set(s, 1.0 + Math.cos(this.time * 25) * 0.15, s);
        this.m2FlameOuter.scale.set(s, 1.0 + Math.sin(this.time * 22) * 0.18, s);
      }

      // Phân tử khí trong xilanh
      const maxR = 1.25;
      const minY = -1.5;
      const maxY = this.m2PistonY - 0.15;
      const speedFactor = 0.012 * (1.0 + (this.m2Temp - 25) / 50 * 1.5);

      for (let i = 0; i < this.m2Particles.length; i++) {
        const p = this.m2Particles[i];
        p.position.x += p.velocity.x * speedFactor;
        p.position.y += p.velocity.y * speedFactor;
        p.position.z += p.velocity.z * speedFactor;

        // Bán kính hình trụ
        const r2 = p.position.x * p.position.x + p.position.z * p.position.z;
        if (r2 > maxR * maxR) {
          p.velocity.x *= -1;
          p.velocity.z *= -1;
        }
        if (p.position.y > maxY) {
          p.position.y = maxY;
          p.velocity.y = -Math.abs(p.velocity.y);
        }
        if (p.position.y < minY) {
          p.position.y = minY;
          p.velocity.y = Math.abs(p.velocity.y);
        }

        // Đổi màu hạt theo nhiệt độ
        if (this.m2Temp > 45) {
          p.material.color.setHex(0xf87171);
          p.material.emissive.setHex(0xef4444);
        } else {
          p.material.color.setHex(0x38bdf8);
          p.material.emissive.setHex(0x0284c7);
        }
      }
    }

    updateModel3() {
      // Di chuyển Piston mô hình 3
      this.m3PistonY += (this.m3TargetPistonY - this.m3PistonY) * 0.08;
      this.m3Piston.position.y = this.m3PistonY;
      this.m3Shaft.position.y = this.m3PistonY + 1.1;

      // Phân tử khí
      const maxR = 1.35;
      const minY = -1.55;
      const maxY = this.m3PistonY - 0.15;
      const spd = 0.018;

      for (let i = 0; i < this.m3Particles.length; i++) {
        const p = this.m3Particles[i];
        p.position.x += p.velocity.x * spd;
        p.position.y += p.velocity.y * spd;
        p.position.z += p.velocity.z * spd;

        const r2 = p.position.x * p.position.x + p.position.z * p.position.z;
        if (r2 > maxR * maxR) {
          p.velocity.x *= -1;
          p.velocity.z *= -1;
        }
        if (p.position.y > maxY) {
          p.position.y = maxY;
          p.velocity.y = -Math.abs(p.velocity.y);
        }
        if (p.position.y < minY) {
          p.position.y = minY;
          p.velocity.y = Math.abs(p.velocity.y);
        }

        p.material.color.setHex(this.m3GasColor);
        p.material.emissive.setHex(this.m3GasColor);
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
    }
  }

  return SimB05NoiNang;
});
