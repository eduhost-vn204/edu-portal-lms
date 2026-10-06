/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 2: LỰC TƯƠNG TÁC PHÂN TỬ & SỰ CHUYỂN THỂ CỦA CHẤT
 * Thiết kế hoàn toàn theo đúng chỉ đạo sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: KHOẢNG CÁCH r & LỰC TƯƠNG TÁC PHÂN TỬ
 *    - Hai phân tử vi mô, khoảng cách r thay đổi so với r0.
 *    - Vector 3D: Lực đẩy (đỏ hướng ra ngoài), Lực hút (xanh hướng vào trong), Hợp lực F (vàng gold).
 *    - 3 Nút bấm cốt lõi chuẩn kiến thức:
 *      + [r = r₀]: Cân bằng bền (F_hút = F_đẩy => Hợp lực F = 0, Wt cực tiểu).
 *      + [r < r₀]: Rất gần nhau (Lực ĐẨY chiếm ưu thế).
 *      + [r > r₀]: Cách nhau vừa phải (Lực HÚT chiếm ưu thế).
 *    - KHÔNG cho dao động, KHÔNG đồ thị mini (tinh gọn, đúng bản chất tĩnh).
 * 
 * 2. MÔ HÌNH 2: NƯỚC CHUYỂN THỂ (-50°C ĐẾN 150°C) VỚI 3 CHẾ ĐỘ NHIỆT ĐỘNG
 *    - 3 Chế độ điều khiển nhiệt:
 *      + [🔥 Cấp nhiệt]: Tăng nhiệt độ liên tục (-50°C -> 150°C).
 *      + [❄️ Tỏa nhiệt]: Giảm nhiệt độ liên tục (150°C -> -50°C).
 *      + [⏸ Tạm dừng]: Đứng yên ở nhiệt độ hiện tại để quan sát.
 *    - Các nút mốc nhanh: Đá (-20°C), Nóng chảy (0°C), Nước (30°C), Sôi (100°C), Hơi nước (130°C).
 *    - Đồ thị T(t) đường gấp khúc: TẠI 130°C ĐIỂM CHẠY VỌT CAO HƠN HẲN ĐƯỜNG 100°C.
 *    - Tại 0°C và 100°C: Nhiệt độ giữ nguyên không đổi trong suốt quá trình chuyển thể.
 * 
 * 3. MÔ HÌNH 3: 6 QUÁ TRÌNH CHUYỂN THỂ THỰC TẾ TRÊN MỘT KHỐI VẬT CHẤT
 *    - Khối chất thực tế (Nước đá / Đá khô CO2 / Sáp) trong khay thí nghiệm.
 *    - 6 Nút bấm tương ứng 6 quá trình chuyển thể:
 *      1) [🔥 Nóng chảy]: Rắn -> Lỏng (tan chảy thành vũng chất lỏng).
 *      2) [❄️ Đông đặc]: Lỏng -> Rắn (đông cứng thành khối rắn).
 *      3) [💨 Hóa hơi]: Lỏng -> Khí (sôi/bay hơi bốc thành luồng khí).
 *      4) [💧 Ngưng tụ]: Khí -> Lỏng (hơi tụ thành giọt nước đọng lại).
 *      5) [✨ Thăng hoa]: Rắn -> Khí trực tiếp không qua thể lỏng (bốc khói trực tiếp như đá khô).
 *      6) [❄️ Ngưng kết]: Khí -> Rắn trực tiếp không qua thể lỏng (kết tinh sương muối/tuyết).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB02ChuyenThe = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB02ChuyenThe {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Khoảng cách r, 1: Nước chuyển thể, 2: 6 Quá trình chuyển thể
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: KHOẢNG CÁCH r & LỰC TƯƠNG TÁC ──
      this.rRatio = 1.0; // r / r0 (0.75, 1.0, 1.45)

      // ── BIẾN SỐ MÔ HÌNH 2: NƯỚC CHUYỂN THỂ (-50°C -> 150°C) ──
      this.tempC = -20; // Nhiệt độ độ C (-50 đến 150)
      this.heatMode = 'stop'; // 'heat' (cấp nhiệt) | 'cool' (tỏa nhiệt) | 'stop' (dừng)
      this.meltProgress = 0; // 0 -> 1 khi ở 0°C (nóng chảy / đông đặc)
      this.boilProgress = 0; // 0 -> 1 khi ở 100°C (sôi / ngưng tụ)
      this.heatSpeed = 0.5;

      // ── BIẾN SỐ MÔ HÌNH 3: 6 QUÁ TRÌNH CHUYỂN THỂ ──
      this.processState = 'solid'; // 'solid' | 'melting' | 'liquid' | 'freezing' | 'vaporizing' | 'gas' | 'condensing' | 'sublimating' | 'depositing'
      this.processProgress = 0; // 0 -> 1
      this.currentProcessName = 'solid';

      this.init();
    }

    init() {
      const width = this.container.clientWidth || 340;
      const height = this.container.clientHeight || 280;

      // 1. Three.js Scene
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

      // Bảng Chú thích trong suốt (Legend Overlay) - Đặt dưới dải tabs (top: 38px)
      this.legendOverlay = document.createElement('div');
      this.legendOverlay.className = 'sim-legend-overlay';
      this.legendOverlay.style.cssText = 'position: absolute; top: 38px; left: 8px; background: transparent; border: none; padding: 2px 4px; font-size: 11px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 2.5px; text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9); text-align: left; max-width: 260px;';
      this.container.appendChild(this.legendOverlay);

      // 4. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 16;
      }

      // 5. Ánh sáng
      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      dirLight.position.set(5, 10, 7);
      this.scene.add(dirLight);

      // 6. Xây dựng 3 Phân hệ 3D
      this.buildModel1ForceR();
      this.buildModel2WaterPhase();
      this.buildModel3SixProcesses();

      // 7. Gắn thanh Tabs chuyển mô hình
      this.buildSubSceneTabs();

      // Ẩn thanh .sim-toolbar mặc định của trang để dùng bộ nút riêng biệt cho từng mô hình
      this.hideDefaultToolbars();

      // 8. Chuyển về Mô hình 1 mặc định
      this.switchScene(0);

      // 9. Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      // 10. Vòng lặp render
      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);
    }

    resetCamera() {
      if (this.currentSceneIdx === 0) {
        this.camera.position.set(0, 1.2, 5.2);
        this.camera.lookAt(0.5, 0, 0);
      } else if (this.currentSceneIdx === 1) {
        this.camera.position.set(0, 1.8, 6.2);
        this.camera.lookAt(0, 0, 0);
      } else {
        this.camera.position.set(0, 2.2, 5.8);
        this.camera.lookAt(0, -0.2, 0);
      }
      if (this.controls) {
        this.controls.target.set(this.currentSceneIdx === 0 ? 0.5 : 0, this.currentSceneIdx === 2 ? -0.2 : 0, 0);
        this.controls.update();
      }
    }

    handleResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      if (width === 0 || height === 0) return;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    // ─────────────────────────────────────────────────────────────
    // GẮN TABS CHUYỂN ĐỔI 3 MÔ HÌNH SƯ PHẠM
    // ─────────────────────────────────────────────────────────────
    buildSubSceneTabs() {
      let tabsBar = this.container.querySelector('.sim-subscene-tabs');
      if (!tabsBar) {
        tabsBar = document.createElement('div');
        tabsBar.className = 'sim-subscene-tabs';
        tabsBar.style.cssText = 'position: absolute; top: 6px; left: 6px; right: 6px; z-index: 25; display: flex; justify-content: center; gap: 4px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); padding: 3px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.5);';

        const scenes = [
          { name: '1. Khoảng cách r', title: 'Lực tương tác phân tử theo khoảng cách r' },
          { name: '2. Nước chuyển thể', title: 'Mô hình chuyển thể của Nước (-50°C đến 150°C)' },
          { name: '3. 6 Quá trình', title: 'Trực quan 6 quá trình chuyển thể thực tế' }
        ];

        scenes.forEach((s, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-tab-btn' + (idx === 0 ? ' active' : '');
          btn.textContent = s.name;
          btn.title = s.title;
          btn.style.cssText = 'background: ' + (idx === 0 ? '#0284c7' : 'transparent') + '; color: ' + (idx === 0 ? '#fff' : '#94a3b8') + '; border: none; padding: 3px 6px; border-radius: 6px; font-size: 10.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; flex: 1; text-align: center;';

          btn.onclick = () => {
            tabsBar.querySelectorAll('.sim-tab-btn').forEach((b, i) => {
              b.style.background = i === idx ? '#0284c7' : 'transparent';
              b.style.color = i === idx ? '#fff' : '#94a3b8';
              b.classList.toggle('active', i === idx);
            });
            this.switchScene(idx);
          };
          tabsBar.appendChild(btn);
        });
        this.container.appendChild(tabsBar);
      }
    }

    switchScene(idx) {
      this.currentSceneIdx = idx;
      this.groupM1.visible = (idx === 0);
      this.groupM2.visible = (idx === 1);
      this.groupM3.visible = (idx === 2);

      // Đảm bảo dừng chế độ nhiệt khi rời tab 2
      if (idx !== 1) this.heatMode = 'stop';

      this.resetCamera();
      this.updateLegendAndContextControls();
      this.updateHudStats();
    }

    // ─────────────────────────────────────────────────────────────
    // 1. MÔ HÌNH 1: KHOẢNG CÁCH r & LỰC TƯƠNG TÁC PHÂN TỬ
    // ─────────────────────────────────────────────────────────────
    buildModel1ForceR() {
      this.groupM1 = new THREE.Group();
      this.scene.add(this.groupM1);

      this.r0 = 1.6; // Khoảng cách cân bằng cơ bản trong không gian 3D

      // Trục tọa độ X nằm ngang
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.0, 0, 0),
        new THREE.Vector3(5.5, 0, 0)
      ]);
      const axisMat = new THREE.LineDashedMaterial({ color: 0x475569, dashSize: 0.15, gapSize: 0.08 });
      const axisLine = new THREE.Line(axisGeo, axisMat);
      axisLine.computeLineDistances();
      this.groupM1.add(axisLine);

      // Vạch đánh dấu vị trí cân bằng r0
      const r0MarkerGeo = new THREE.RingGeometry(0.55, 0.58, 32);
      const r0MarkerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      this.r0Ring = new THREE.Mesh(r0MarkerGeo, r0MarkerMat);
      this.r0Ring.position.set(this.r0, 0, 0);
      this.groupM1.add(this.r0Ring);

      // Phân tử 1 (Cố định ở gốc O = (0, 0, 0))
      const p1Geo = new THREE.SphereGeometry(0.38, 32, 32);
      const p1Mat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.3
      });
      this.mol1 = new THREE.Mesh(p1Geo, p1Mat);
      this.mol1.position.set(0, 0, 0);
      this.groupM1.add(this.mol1);

      // Phân tử 2 (Di chuyển ở khoảng cách r)
      const p2Geo = new THREE.SphereGeometry(0.38, 32, 32);
      const p2Mat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x9333ea,
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.3
      });
      this.mol2 = new THREE.Mesh(p2Geo, p2Mat);
      this.mol2.position.set(this.r0, 0, 0);
      this.groupM1.add(this.mol2);

      // Lò xo lượng tử nối giữa 2 phân tử
      this.buildSpringConnection();

      // Vector Mũi tên 3D
      // 1. Vector Lực Đẩy (Màu đỏ cam, hướng ra xa nhau)
      this.arrowRepulse = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(this.r0, 0.45, 0), 0.8, 0xef4444, 0.25, 0.15);
      this.groupM1.add(this.arrowRepulse);

      // 2. Vector Lực Hút (Màu xanh lục/xanh cyan, hướng về phân tử 1)
      this.arrowAttract = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(this.r0, -0.45, 0), 0.8, 0x10b981, 0.25, 0.15);
      this.groupM1.add(this.arrowAttract);

      // 3. Vector Hợp Lực F (Màu vàng sáng rực rỡ)
      this.arrowNet = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(this.r0, 0, 0), 0.8, 0xfacc15, 0.3, 0.18);
      this.groupM1.add(this.arrowNet);

      this.updateModel1Positions();
    }

    buildSpringConnection() {
      const springPoints = [];
      for (let i = 0; i <= 60; i++) {
        springPoints.push(new THREE.Vector3(i / 60, 0, 0));
      }
      const springGeo = new THREE.BufferGeometry().setFromPoints(springPoints);
      this.springMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
      this.springLine = new THREE.Line(springGeo, this.springMat);
      this.groupM1.add(this.springLine);
    }

    updateSpringGeometry(startX, endX) {
      if (!this.springLine) return;
      const positions = this.springLine.geometry.attributes.position.array;
      const count = positions.length / 3;
      const len = endX - startX;
      const radius = 0.15;
      const coils = 9;

      for (let i = 0; i < count; i++) {
        const u = i / (count - 1);
        const x = startX + u * len;
        let y = 0;
        let z = 0;
        if (u > 0.1 && u < 0.9) {
          const t = (u - 0.1) / 0.8;
          y = Math.sin(t * Math.PI * 2 * coils) * radius;
          z = Math.cos(t * Math.PI * 2 * coils) * radius;
        }
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      this.springLine.geometry.attributes.position.needsUpdate = true;

      if (this.rRatio < 0.98) {
        this.springMat.color.setHex(0xef4444); // Đỏ (Nén mạnh)
      } else if (this.rRatio > 1.05) {
        this.springMat.color.setHex(0x38bdf8); // Xanh (Dãn)
      } else {
        this.springMat.color.setHex(0x10b981); // Xanh lục (Cân bằng)
      }
    }

    updateModel1Positions() {
      const currentR = this.r0 * this.rRatio;
      this.mol2.position.set(currentR, 0, 0);

      this.updateSpringGeometry(0.38, currentR - 0.38);

      const u = Math.max(0.6, this.rRatio);
      const fRepulse = Math.min(3.5, 1.2 * Math.pow(1 / u, 5));
      const fAttract = Math.min(3.0, 1.2 * Math.pow(1 / u, 2.5));
      const fNet = fRepulse - fAttract;

      this.arrowRepulse.position.set(currentR, 0.42, 0);
      this.arrowRepulse.setDirection(new THREE.Vector3(1, 0, 0));
      this.arrowRepulse.setLength(Math.max(0.1, fRepulse * 0.7), Math.min(0.25, fRepulse * 0.25), 0.12);

      this.arrowAttract.position.set(currentR, -0.42, 0);
      this.arrowAttract.setDirection(new THREE.Vector3(-1, 0, 0));
      this.arrowAttract.setLength(Math.max(0.1, fAttract * 0.7), Math.min(0.25, fAttract * 0.25), 0.12);

      this.arrowNet.position.set(currentR, 0, 0);
      const netDir = fNet >= 0 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(-1, 0, 0);
      const netMag = Math.abs(fNet);
      this.arrowNet.setDirection(netDir);
      this.arrowNet.setLength(Math.max(0.01, netMag * 0.75), Math.min(0.3, netMag * 0.3), 0.15);
      this.arrowNet.visible = netMag > 0.04;
    }

    // ─────────────────────────────────────────────────────────────
    // 2. MÔ HÌNH 2: NƯỚC CHUYỂN THỂ (-50°C -> 150°C)
    // ─────────────────────────────────────────────────────────────
    buildModel2WaterPhase() {
      this.groupM2 = new THREE.Group();
      this.groupM2.visible = false;
      this.scene.add(this.groupM2);

      this.chamberWidth = 3.2;
      this.chamberHeight = 3.6;
      this.chamberDepth = 2.4;

      const boxGeo = new THREE.BoxGeometry(this.chamberWidth, this.chamberHeight, this.chamberDepth);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      this.chamberEdges = new THREE.LineSegments(edges, edgeMat);
      this.groupM2.add(this.chamberEdges);

      const floorGeo = new THREE.PlaneGeometry(this.chamberWidth, this.chamberDepth);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8, metalness: 0.2 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -this.chamberHeight / 2;
      this.groupM2.add(floor);

      this.buildBurnerFlame();
      this.buildH2OMolecules();
      this.buildBoilingBubbles();
      this.buildMiniGraphM2();
    }

    buildBurnerFlame() {
      const flameGroup = new THREE.Group();
      flameGroup.position.set(0, -this.chamberHeight / 2 - 0.4, 0);

      const burnerGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 16);
      const burnerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const burner = new THREE.Mesh(burnerGeo, burnerMat);
      burner.position.y = -0.2;
      flameGroup.add(burner);

      const flameGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
      this.flameMesh = new THREE.Mesh(flameGeo, flameMat);
      this.flameMesh.position.y = 0.25;
      flameGroup.add(this.flameMesh);

      this.flameLight = new THREE.PointLight(0xf59e0b, 1.2, 4);
      this.flameLight.position.set(0, 0.3, 0);
      flameGroup.add(this.flameLight);

      this.groupM2.add(flameGroup);
    }

    buildH2OMolecules() {
      const total = 72;
      this.h2oMolecules = [];

      const oGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const oMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const hGeo = new THREE.SphereGeometry(0.075, 12, 12);
      const hMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });

      for (let i = 0; i < total; i++) {
        const molGroup = new THREE.Group();

        const oMesh = new THREE.Mesh(oGeo, oMat);
        molGroup.add(oMesh);

        const h1 = new THREE.Mesh(hGeo, hMat);
        h1.position.set(0.15, 0.1, 0);
        molGroup.add(h1);

        const h2 = new THREE.Mesh(hGeo, hMat);
        h2.position.set(-0.15, 0.1, 0);
        molGroup.add(h2);

        const bondGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8);
        const bondMat = new THREE.MeshBasicMaterial({ color: 0xcbd5e1 });
        const b1 = new THREE.Mesh(bondGeo, bondMat);
        b1.position.set(0.075, 0.05, 0);
        b1.rotation.z = -Math.PI / 4;
        molGroup.add(b1);

        const b2 = new THREE.Mesh(bondGeo, bondMat);
        b2.position.set(-0.075, 0.05, 0);
        b2.rotation.z = Math.PI / 4;
        molGroup.add(b2);

        this.groupM2.add(molGroup);

        this.h2oMolecules.push({
          group: molGroup,
          pos: new THREE.Vector3(),
          basePos: new THREE.Vector3(),
          vel: new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
          ),
          phase: Math.random() * Math.PI * 2,
          isSurface: i % 5 === 0
        });
      }

      this.initWaterLatticePositions();
    }

    initWaterLatticePositions() {
      const cols = 6;
      const rows = 4;
      const layers = 3;
      let idx = 0;

      const spacingX = 0.48;
      const spacingY = 0.44;
      const spacingZ = 0.52;

      for (let ly = 0; ly < layers; ly++) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (idx >= this.h2oMolecules.length) break;
            const mol = this.h2oMolecules[idx++];
            const offsetX = (r % 2 === 1) ? 0.2 : 0;
            const x = (c - cols / 2 + 0.5) * spacingX + offsetX;
            const y = -this.chamberHeight / 2 + 0.4 + r * spacingY;
            const z = (ly - layers / 2 + 0.5) * spacingZ;

            mol.basePos.set(x, y, z);
            mol.pos.copy(mol.basePos);
            mol.group.position.copy(mol.pos);
          }
        }
      }
    }

    buildBoilingBubbles() {
      this.bubbles = [];
      const bGeo = new THREE.SphereGeometry(0.1, 12, 12);
      const bMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.65 });

      for (let i = 0; i < 15; i++) {
        const bubble = new THREE.Mesh(bGeo, bMat);
        bubble.visible = false;
        this.groupM2.add(bubble);
        this.bubbles.push({
          mesh: bubble,
          x: (Math.random() - 0.5) * (this.chamberWidth - 0.6),
          y: -this.chamberHeight / 2 + 0.2,
          z: (Math.random() - 0.5) * (this.chamberDepth - 0.6),
          speed: 0.03 + Math.random() * 0.04,
          scale: 0.4 + Math.random() * 0.8
        });
      }
    }

    buildMiniGraphM2() {
      const graphWrap = document.createElement('div');
      graphWrap.className = 'sim-m2-graph-wrap';
      graphWrap.style.cssText = 'position: absolute; bottom: 8px; right: 8px; width: 148px; height: 104px; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 4px; z-index: 20; pointer-events: none; display: flex; flex-direction: column;';

      const title = document.createElement('div');
      title.style.cssText = 'font-size: 9.5px; font-weight: 700; color: #94a3b8; text-align: center; margin-bottom: 2px;';
      title.textContent = 'ĐƯỜNG BIỂU DIỄN T(t)';
      graphWrap.appendChild(title);

      const canvas = document.createElement('canvas');
      canvas.width = 140;
      canvas.height = 84;
      canvas.style.cssText = 'width: 140px; height: 84px;';
      graphWrap.appendChild(canvas);

      this.m2GraphCanvas = canvas;
      this.m2GraphWrap = graphWrap;
      this.container.appendChild(graphWrap);
    }

    drawMiniGraphM2() {
      if (!this.m2GraphCanvas || this.currentSceneIdx !== 1) return;
      const ctx = this.m2GraphCanvas.getContext('2d');
      const w = this.m2GraphCanvas.width;
      const h = this.m2GraphCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const ox = 20;
      const oy = h - 14;

      // Trục tọa độ
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(w - 4, oy); // Trục t
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox, 6);     // Trục T
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '7.5px sans-serif';
      ctx.fillText('t', w - 8, oy - 2);
      ctx.fillText('T(°C)', ox + 2, 8);

      // Điểm mốc T: phân bổ tỉ lệ chiều cao chuẩn xác!
      // Tổng chiều cao từ oy đến đỉnh là (oy - 8) ≈ 62px
      // -50°C: y = oy - 2
      // 0°C: y = oy - 16
      // 100°C: y = oy - 42
      // 150°C: y = oy - 62
      const y0 = oy - 16;
      const y100 = oy - 42;
      const y150 = oy - 62;

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(ox, y0);
      ctx.lineTo(w - 4, y0);
      ctx.moveTo(ox, y100);
      ctx.lineTo(w - 4, y100);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('0°', 4, y0 + 3);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('100°', 1, y100 + 3);

      // 5 Đoạn đường gấp khúc kinh điển:
      const pts = [
        { x: ox, y: oy - 2 },           // -50°C
        { x: ox + 18, y: y0 },          // 0°C bắt đầu tan
        { x: ox + 38, y: y0 },          // 0°C tan xong 100%
        { x: ox + 68, y: y100 },        // 100°C bắt đầu sôi
        { x: ox + 94, y: y100 },        // 100°C sôi xong hóa hơi 100%
        { x: ox + 114, y: y150 }        // 150°C (vọt cao hơn 20px so với đường 100°C)
      ];

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      pts.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Tính vị trí chấm đỏ đồng bộ 100%
      let curX = ox;
      let curY = oy - 2;

      if (this.tempC < 0) {
        const u = (this.tempC - (-50)) / 50;
        curX = pts[0].x + u * (pts[1].x - pts[0].x);
        curY = pts[0].y + u * (pts[1].y - pts[0].y);
      } else if (this.tempC === 0) {
        curX = pts[1].x + this.meltProgress * (pts[2].x - pts[1].x);
        curY = y0;
      } else if (this.tempC < 100) {
        const u = this.tempC / 100;
        curX = pts[2].x + u * (pts[3].x - pts[2].x);
        curY = pts[2].y + u * (pts[3].y - pts[2].y);
      } else if (this.tempC === 100) {
        curX = pts[3].x + this.boilProgress * (pts[4].x - pts[3].x);
        curY = y100;
      } else {
        const u = (this.tempC - 100) / 50; // u từ 0 -> 1 khi T từ 100 -> 150
        curX = pts[4].x + u * (pts[5].x - pts[4].x);
        curY = pts[4].y + u * (pts[5].y - pts[4].y); // y giảm dần từ y100 lên y150!
      }

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(curX, curY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ─────────────────────────────────────────────────────────────
    // 3. MÔ HÌNH 3: 6 QUÁ TRÌNH CHUYỂN THỂ THỰC TẾ TRÊN KHỐI VẬT CHẤT
    // ─────────────────────────────────────────────────────────────
    buildModel3SixProcesses() {
      this.groupM3 = new THREE.Group();
      this.groupM3.visible = false;
      this.scene.add(this.groupM3);

      // Đĩa / Khay thí nghiệm chứa khối chất
      const dishGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.2, 32);
      const dishMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.6 });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.y = -1.0;
      this.groupM3.add(dish);

      // Vành khay
      const rimGeo = new THREE.TorusGeometry(1.58, 0.05, 16, 48);
      const rimMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.8 });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.9;
      this.groupM3.add(rim);

      // 1. Khối CHẤT RẮN (Khối lập phương tinh thể băng đá / sáp / đá khô CO2)
      const solidGeo = new THREE.BoxGeometry(1.2, 1.0, 1.2);
      const solidMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.1,
        transparent: true,
        opacity: 0.92
      });
      this.solidBlock = new THREE.Mesh(solidGeo, solidMat);
      this.solidBlock.position.y = -0.4;
      this.groupM3.add(this.solidBlock);

      // 2. Vũng CHẤT LỎNG (Hình đĩa dẹt lỏng lóng lánh)
      const liquidGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.15, 32);
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0891b2,
        emissiveIntensity: 0.4,
        roughness: 0.1,
        metalness: 0.4,
        transparent: true,
        opacity: 0.85
      });
      this.liquidPuddle = new THREE.Mesh(liquidGeo, liquidMat);
      this.liquidPuddle.position.y = -0.85;
      this.liquidPuddle.scale.set(0.01, 0.01, 0.01);
      this.groupM3.add(this.liquidPuddle);

      // 3. Hệ thống hạt KHÍ / HƠI / KHÓI THĂNG HOA
      this.buildProcessParticles();
    }

    buildProcessParticles() {
      const pCount = 60;
      const pGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.7 });

      this.processParticles = [];
      for (let i = 0; i < pCount; i++) {
        const p = new THREE.Mesh(pGeo, pMat);
        p.visible = false;
        this.groupM3.add(p);
        this.processParticles.push({
          mesh: p,
          pos: new THREE.Vector3(),
          vel: new THREE.Vector3(),
          life: 0,
          maxLife: 1.0
        });
      }
    }

    triggerProcess(type) {
      this.currentProcessName = type;
      this.processProgress = 0;

      // Reset các hạt
      this.processParticles.forEach(p => p.mesh.visible = false);

      this.updateLegendAndContextControls();
      this.updateHudStats();
    }

    // ─────────────────────────────────────────────────────────────
    // CẬP NHẬT GIAO DIỆN CHÚ THÍCH TRONG SUỐT (KHÔNG HỦY DOM NÚT BẤM)
    // ─────────────────────────────────────────────────────────────
    updateLegend() {
      if (this.m2GraphWrap) this.m2GraphWrap.style.display = this.currentSceneIdx === 1 ? 'flex' : 'none';

      let html = '';
      if (this.currentSceneIdx === 0) {
        // MÔ HÌNH 1: KHOẢNG CÁCH r
        let stateText = '';
        let forceStatus = '';
        if (this.rRatio < 0.98) {
          stateText = 'r < r₀ (Rất gần nhau)';
          forceStatus = 'Lực ĐẨY chiếm ưu thế 🔴';
        } else if (this.rRatio <= 1.05) {
          stateText = 'r = r₀ (VTCB bền)';
          forceStatus = 'Hợp lực F = 0 (Wt min) 🟢';
        } else {
          stateText = 'r > r₀ (Cách nhau vừa phải)';
          forceStatus = 'Lực HÚT chiếm ưu thế 🔵';
        }

        html = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">📏 LỰC TƯƠNG TÁC PHÂN TỬ</div>
          <div>Khoảng cách: <b>r = ${this.rRatio.toFixed(2)} r₀</b> (${stateText})</div>
          <div>🔴 <b>F_đẩy</b> hướng ra xa | 🔵 <b>F_hút</b> hướng vào trong</div>
          <div style="color:#facc15; font-weight:700;">🟡 HỢP LỰC: ${forceStatus}</div>
        `;
      } else if (this.currentSceneIdx === 1) {
        // MÔ HÌNH 2: NƯỚC CHUYỂN THỂ
        let phaseDesc = '';
        let formulaDesc = '';
        if (this.tempC < 0) {
          phaseDesc = '🧊 NƯỚC ĐÁ (Thể Rắn - Mạng lục giác rỗng)';
          formulaDesc = 'Đun nóng: Q = mc_đá.ΔT';
        } else if (this.tempC === 0) {
          phaseDesc = `🔥 ĐANG CHUYỂN THỂ (${Math.round(this.meltProgress * 100)}%) - T = 0°C KHÔNG ĐỔI!`;
          formulaDesc = 'Phá vỡ / tái lập mạng tinh thể: Q = λ.m';
        } else if (this.tempC < 100) {
          phaseDesc = '💧 NƯỚC LỎNG (Trượt hỗn loạn + Bay hơi bề mặt)';
          formulaDesc = 'Đun nóng: Q = mc_nước.ΔT';
        } else if (this.tempC === 100) {
          phaseDesc = `💨 ĐANG CHUYỂN THỂ (${Math.round(this.boilProgress * 100)}%) - T = 100°C KHÔNG ĐỔI!`;
          formulaDesc = 'Bẻ gãy / tái lập liên kết: Q = L.m';
        } else {
          phaseDesc = '☁️ HƠI NƯỚC (Thể Khí - Chuyển động tự do)';
          formulaDesc = 'Đun nóng hơi: Q = mc_hơi.ΔT';
        }

        let modeBadge = this.heatMode === 'heat' ? '🔥 Đang CẤP NHIỆT (Tăng)' : (this.heatMode === 'cool' ? '❄️ Đang TỎA NHIỆT (Giảm)' : '⏸ Đang TẠM DỪNG');

        html = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">💧 CHUYỂN THỂ CỦA NƯỚC (H₂O)</div>
          <div>Nhiệt độ: <b style="font-size:13px; color:${this.tempC < 0 ? '#38bdf8' : (this.tempC < 100 ? '#06b6d4' : '#ef4444')}">${this.tempC}°C</b> · <span style="font-size:10px; color:#facc15;">${modeBadge}</span></div>
          <div style="font-weight:700; color:#facc15;">${phaseDesc}</div>
          <div style="color:#e2e8f0; font-size:10px;">${formulaDesc}</div>
        `;
      } else {
        // MÔ HÌNH 3: 6 QUÁ TRÌNH CHUYỂN THỂ
        const pNames = {
          'solid': '🧊 KHỐI CHẤT RẮN BAN ĐẦU',
          'nong_chay': '🔥 NÓNG CHẢY (Rắn ➔ Lỏng) · Thu nhiệt Q = λ.m',
          'dong_dac': '❄️ ĐÔNG ĐẶC (Lỏng ➔ Rắn) · Tỏa nhiệt Q = λ.m',
          'hoa_hoi': '💨 HÓA HƠI (Lỏng ➔ Khí) · Thu nhiệt Q = L.m',
          'ngung_tu': '💧 NGƯNG TỤ (Khí ➔ Lỏng) · Tỏa nhiệt Q = L.m',
          'thang_hoa': '✨ THĂNG HOA (Rắn ➔ Khí) · Không qua thể lỏng',
          'ngung_ket': '❄️ NGƯNG KẾT (Khí ➔ Rắn) · Không qua thể lỏng'
        };

        const pDesc = {
          'solid': 'Chọn 1 trong 6 nút bên dưới để xem trực quan quá trình chuyển thể.',
          'nong_chay': 'Chất rắn nóng chảy ở nhiệt độ xác định. Ví dụ: Đá tan, nấu sáp, đúc đồng.',
          'dong_dac': 'Chất lỏng đông đặc ở nhiệt độ xác định. Ví dụ: Nước đóng băng, làm đá.',
          'hoa_hoi': 'Chất lỏng biến thành khí (bay hơi ở mặt thoáng hoặc sôi mãnh liệt).',
          'ngung_tu': 'Chất khí tụ lại thành chất lỏng. Ví dụ: Hơi nước ngưng tụ thành mưa, sương.',
          'thang_hoa': 'Chất rắn biến thẳng thành khí. Ví dụ: Đá khô CO₂, băng phiến (long não).',
          'ngung_ket': 'Chất khí kết tinh thẳng thành rắn. Ví dụ: Sương muối, tuyết rơi mùa đông.'
        };

        html = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">📦 6 QUÁ TRÌNH CHUYỂN THỂ THỰC TẾ</div>
          <div style="font-weight:700; color:#facc15;">${pNames[this.currentProcessName] || ''}</div>
          <div style="font-size:10px; color:#e2e8f0;">${pDesc[this.currentProcessName] || ''}</div>
          <div style="font-size:9.5px; color:#94a3b8;">*Trong suốt quá trình chuyển thể, nhiệt độ không đổi!</div>
        `;
      }
      this.legendOverlay.innerHTML = html;
    }

    updateLegendAndContextControls() {
      this.updateLegend();
      this.renderContextControls();
      this.updateTempControls();
    }

    updateTempControls() {
      const ctrlBox = this.getControlsContainer();
      if (!ctrlBox) return;

      const btnHeat = ctrlBox.querySelector('#sim-b2-btn-heat');
      const btnCool = ctrlBox.querySelector('#sim-b2-btn-cool');
      const btnStop = ctrlBox.querySelector('#sim-b2-btn-stop');

      if (btnHeat) {
        btnHeat.classList.toggle('active', this.heatMode === 'heat');
        btnHeat.style.background = this.heatMode === 'heat' ? '#ea580c' : 'rgba(30,41,59,0.7)';
        btnHeat.style.borderColor = this.heatMode === 'heat' ? '#f97316' : 'rgba(255,255,255,0.12)';
        btnHeat.style.boxShadow = this.heatMode === 'heat' ? '0 0 8px rgba(234,88,12,0.4)' : 'none';
      }
      if (btnCool) {
        btnCool.classList.toggle('active', this.heatMode === 'cool');
        btnCool.style.background = this.heatMode === 'cool' ? '#0284c7' : 'rgba(30,41,59,0.7)';
        btnCool.style.borderColor = this.heatMode === 'cool' ? '#38bdf8' : 'rgba(255,255,255,0.12)';
        btnCool.style.boxShadow = this.heatMode === 'cool' ? '0 0 8px rgba(56,189,248,0.4)' : 'none';
      }
      if (btnStop) {
        btnStop.classList.toggle('active', this.heatMode === 'stop');
        btnStop.style.background = this.heatMode === 'stop' ? '#475569' : 'rgba(30,41,59,0.7)';
        btnStop.style.borderColor = this.heatMode === 'stop' ? '#94a3b8' : 'rgba(255,255,255,0.12)';
        btnStop.style.boxShadow = 'none';
      }

      const tVal = ctrlBox.querySelector('#sim-b2-t-val');
      if (tVal) {
        tVal.textContent = this.tempC + '°C';
      }

      const tSlider = ctrlBox.querySelector('#sim-b2-t-slider');
      if (tSlider && document.activeElement !== tSlider) {
        tSlider.value = this.tempC;
      }
    }

    getControlsContainer() {
      // 1. Kiểm tra nếu trong Modal
      const modalContent = this.container.closest('.sim-modal-content');
      if (modalContent) {
        const modalFooter = modalContent.querySelector('.sim-modal-footer');
        if (modalFooter) {
          let ctrlBox = modalFooter.querySelector('.sim-custom-controls');
          if (!ctrlBox) {
            ctrlBox = document.createElement('div');
            ctrlBox.className = 'sim-custom-controls';
            ctrlBox.style.cssText = 'max-width:680px; margin:0 auto; padding:4px 0; display:flex; flex-direction:column; gap:6px; align-items:center; width:100%;';
            const fBox = modalFooter.querySelector('.sim-formula-box');
            if (fBox) modalFooter.insertBefore(ctrlBox, fBox);
            else modalFooter.appendChild(ctrlBox);
          }
          return ctrlBox;
        }
      }

      // 2. Nếu trong Sidebar card của bài học
      const sidebarCard = this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (sidebarCard) {
        let ctrlBox = sidebarCard.querySelector('.sim-custom-controls');
        if (!ctrlBox) {
          ctrlBox = document.createElement('div');
          ctrlBox.className = 'sim-custom-controls';
          ctrlBox.style.cssText = 'padding:6px 4px; display:flex; flex-direction:column; gap:6px; align-items:center; width:100%; box-sizing:border-box;';
          const fBox = sidebarCard.querySelector('.sim-formula-box');
          if (fBox) sidebarCard.insertBefore(ctrlBox, fBox);
          else sidebarCard.appendChild(ctrlBox);
        }
        return ctrlBox;
      }
      return null;
    }

    hideDefaultToolbars() {
      const scope = this.container.closest('.sim-modal-content') || this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (scope) {
        scope.querySelectorAll('.sim-toolbar').forEach(tb => {
          tb.style.display = 'none';
        });
        // Bỏ ô kiến thức công thức vật lý ở dưới theo yêu cầu của Thầy:
        scope.querySelectorAll('.sim-formula-box').forEach(fb => {
          fb.style.display = 'none';
        });
      }
    }

    restoreDefaultToolbars() {
      const scope = this.container.closest('.sim-modal-content') || this.container.closest('.sim-sidebar-card') || this.container.parentElement;
      if (scope) {
        scope.querySelectorAll('.sim-toolbar').forEach(tb => {
          tb.style.display = '';
        });
        scope.querySelectorAll('.sim-formula-box').forEach(fb => {
          fb.style.display = '';
        });
        const customBox = scope.querySelector('.sim-custom-controls');
        if (customBox && customBox.parentElement) {
          customBox.parentElement.removeChild(customBox);
        }
      }
    }

    renderContextControls() {
      const ctrlBox = this.getControlsContainer();
      if (!ctrlBox) return;
      ctrlBox.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // ── NÚT BẤM RIÊNG CỦA MÔ HÌNH 1 (KHOẢNG CÁCH r) ──
        // Đúng 3 nút cốt lõi chuẩn kiến thức + thanh trượt r
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box;';

        const btnEq = document.createElement('button');
        btnEq.type = 'button';
        btnEq.className = 'sim-btn' + (this.rRatio === 1.0 ? ' active' : '');
        btnEq.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.rRatio === 1.0 ? 'background:#059669; color:#fff; border:1px solid #10b981; box-shadow:0 0 8px rgba(16,185,129,0.4);' : '');
        btnEq.innerHTML = '🟢 r = r₀ (Cân bằng)';
        btnEq.onclick = () => {
          this.rRatio = 1.0;
          this.updateModel1Positions();
          this.updateLegendAndContextControls();
        };
        rowBtns.appendChild(btnEq);

        const btnRep = document.createElement('button');
        btnRep.type = 'button';
        btnRep.className = 'sim-btn' + (this.rRatio < 0.98 ? ' active' : '');
        btnRep.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.rRatio < 0.98 ? 'background:#dc2626; color:#fff; border:1px solid #ef4444; box-shadow:0 0 8px rgba(239,68,68,0.4);' : '');
        btnRep.innerHTML = '🔴 r &lt; r₀ (Lực ĐẨY)';
        btnRep.onclick = () => {
          this.rRatio = 0.75;
          this.updateModel1Positions();
          this.updateLegendAndContextControls();
        };
        rowBtns.appendChild(btnRep);

        const btnAtt = document.createElement('button');
        btnAtt.type = 'button';
        btnAtt.className = 'sim-btn' + (this.rRatio > 1.05 ? ' active' : '');
        btnAtt.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.rRatio > 1.05 ? 'background:#0284c7; color:#fff; border:1px solid #38bdf8; box-shadow:0 0 8px rgba(56,189,248,0.4);' : '');
        btnAtt.innerHTML = '🔵 r &gt; r₀ (Lực HÚT)';
        btnAtt.onclick = () => {
          this.rRatio = 1.45;
          this.updateModel1Positions();
          this.updateLegendAndContextControls();
        };
        rowBtns.appendChild(btnAtt);
        ctrlBox.appendChild(rowBtns);

        // Thanh trượt kéo tinh chỉnh r
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:6px; background:rgba(30,41,59,0.7); padding:4px 8px; border-radius:6px; font-size:11px; width:100%; box-sizing:border-box; border:1px solid rgba(255,255,255,0.08);';
        rowSlider.innerHTML = `
          <span style="color:#94a3b8; white-space:nowrap;">Kéo khoảng cách r:</span>
          <input type="range" min="0.65" max="2.8" step="0.05" value="${this.rRatio}" style="flex:1; cursor:pointer;" id="sim-b2-r-slider">
          <span id="sim-b2-r-val" style="font-weight:700; color:#38bdf8; width:38px; text-align:right;">${this.rRatio.toFixed(2)}r₀</span>
        `;
        const slider = rowSlider.querySelector('#sim-b2-r-slider');
        const valSpan = rowSlider.querySelector('#sim-b2-r-val');
        slider.oninput = (e) => {
          this.rRatio = parseFloat(e.target.value);
          valSpan.textContent = this.rRatio.toFixed(2) + 'r₀';
          this.updateModel1Positions();
          this.updateLegendAndContextControls();
        };
        ctrlBox.appendChild(rowSlider);

      } else if (this.currentSceneIdx === 1) {
        // ── NÚT BẤM RIÊNG CỦA MÔ HÌNH 2 (NƯỚC CHUYỂN THỂ) ──
        // 1. Hàng trên: 3 Chế độ nhiệt động học (Cấp nhiệt, Tỏa nhiệt, Dừng)
        const rowModes = document.createElement('div');
        rowModes.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box;';

        const btnHeat = document.createElement('button');
        btnHeat.id = 'sim-b2-btn-heat';
        btnHeat.type = 'button';
        btnHeat.className = 'sim-btn' + (this.heatMode === 'heat' ? ' active' : '');
        btnHeat.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.heatMode === 'heat' ? 'background:#ea580c; color:#fff; border:1px solid #f97316; box-shadow:0 0 8px rgba(234,88,12,0.4);' : '');
        btnHeat.innerHTML = '🔥 Cấp nhiệt';
        btnHeat.title = 'Nhiệt độ tăng liên tục (-50°C ➔ 150°C)';
        const onHeat = (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          this.heatMode = 'heat';
          this.updateTempControls();
          this.updateLegend();
          this.updateHudStats();
        };
        btnHeat.onclick = onHeat;
        btnHeat.onpointerdown = onHeat;
        rowModes.appendChild(btnHeat);

        const btnCool = document.createElement('button');
        btnCool.id = 'sim-b2-btn-cool';
        btnCool.type = 'button';
        btnCool.className = 'sim-btn' + (this.heatMode === 'cool' ? ' active' : '');
        btnCool.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.heatMode === 'cool' ? 'background:#0284c7; color:#fff; border:1px solid #38bdf8; box-shadow:0 0 8px rgba(56,189,248,0.4);' : '');
        btnCool.innerHTML = '❄️ Tỏa nhiệt';
        btnCool.title = 'Nhiệt độ giảm liên tục chạy lùi (150°C ➔ -50°C)';
        const onCool = (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          this.heatMode = 'cool';
          this.updateTempControls();
          this.updateLegend();
          this.updateHudStats();
        };
        btnCool.onclick = onCool;
        btnCool.onpointerdown = onCool;
        rowModes.appendChild(btnCool);

        const btnStop = document.createElement('button');
        btnStop.id = 'sim-b2-btn-stop';
        btnStop.type = 'button';
        btnStop.className = 'sim-btn' + (this.heatMode === 'stop' ? ' active' : '');
        btnStop.style.cssText = 'flex:1; padding:7px 2px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.heatMode === 'stop' ? 'background:#475569; color:#fff; border:1px solid #94a3b8;' : '');
        btnStop.innerHTML = '⏸ Dừng lại';
        btnStop.title = 'Đứng yên ở nhiệt độ hiện tại để quan sát';
        const onStop = (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          this.heatMode = 'stop';
          this.updateTempControls();
          this.updateLegend();
          this.updateHudStats();
        };
        btnStop.onclick = onStop;
        btnStop.onpointerdown = onStop;
        rowModes.appendChild(btnStop);
        ctrlBox.appendChild(rowModes);

        // 2. Hàng giữa: 5 Mốc nhiệt độ nhảy nhanh
        const rowPresets = document.createElement('div');
        rowPresets.style.cssText = 'display:flex; gap:3px; width:100%; box-sizing:border-box;';

        const presets = [
          { label: '🧊 -20°', t: -20, m: 0, b: 0, title: 'Nước đá thể rắn (-20°C)' },
          { label: '🌡️ 0°',   t: 0,   m: 0.5, b: 0, title: 'Nhiệt độ nóng chảy (0°C)' },
          { label: '💧 30°',  t: 30,  m: 1, b: 0, title: 'Nước thể lỏng (30°C)' },
          { label: '💨 100°', t: 100, m: 1, b: 0.5, title: 'Nhiệt độ sôi (100°C)' },
          { label: '☁️ 130°', t: 130, m: 1, b: 1, title: 'Hơi nước thể khí (130°C)' }
        ];

        presets.forEach(p => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-btn';
          btn.style.cssText = 'flex:1; padding:5px 1px; font-size:10px; font-weight:600; text-align:center; border-radius:5px; cursor:pointer; background:rgba(30,41,59,0.7); border:1px solid rgba(255,255,255,0.1); color:#e2e8f0; white-space:nowrap;';
          btn.textContent = p.label;
          btn.title = p.title;
          btn.onclick = () => {
            this.heatMode = 'stop';
            this.tempC = p.t;
            this.meltProgress = p.m;
            this.boilProgress = p.b;
            this.updateLegendAndContextControls();
          };
          rowPresets.appendChild(btn);
        });
        ctrlBox.appendChild(rowPresets);

        // 3. Hàng dưới: Thanh kéo nhiệt độ T mịn
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:6px; background:rgba(30,41,59,0.7); padding:4px 8px; border-radius:6px; font-size:11px; width:100%; box-sizing:border-box; border:1px solid rgba(255,255,255,0.08);';
        rowSlider.innerHTML = `
          <span style="color:#94a3b8; white-space:nowrap;">Nhiệt độ T:</span>
          <input type="range" min="-50" max="150" step="1" value="${this.tempC}" style="flex:1; cursor:pointer;" id="sim-b2-t-slider">
          <span id="sim-b2-t-val" style="font-weight:700; color:#38bdf8; width:44px; text-align:right;">${this.tempC}°C</span>
        `;
        const slider = rowSlider.querySelector('#sim-b2-t-slider');
        const valSpan = rowSlider.querySelector('#sim-b2-t-val');
        slider.oninput = (e) => {
          this.heatMode = 'stop';
          this.tempC = parseInt(e.target.value);
          this.meltProgress = this.tempC > 0 ? 1.0 : (this.tempC === 0 ? 0.5 : 0.0);
          this.boilProgress = this.tempC > 100 ? 1.0 : (this.tempC === 100 ? 0.5 : 0.0);
          valSpan.textContent = this.tempC + '°C';
          this.updateLegendAndContextControls();
        };
        ctrlBox.appendChild(rowSlider);

      } else {
        // ── NÚT BẤM RIÊNG CỦA MÔ HÌNH 3 (6 QUÁ TRÌNH CHUYỂN THỂ) ──
        // Lưới 3 cột x 2 hàng: gọn gàng, vừa khít khung nhìn, không tràn chữ
        const gridBox = document.createElement('div');
        gridBox.style.cssText = 'display:grid; grid-template-columns:repeat(3, 1fr); gap:5px; width:100%; box-sizing:border-box;';

        const processes = [
          { key: 'nong_chay', label: '🔥 Nóng chảy', desc: 'Rắn ➔ Lỏng', type: 'absorb' },
          { key: 'hoa_hoi',   label: '💨 Hóa hơi',   desc: 'Lỏng ➔ Khí', type: 'absorb' },
          { key: 'thang_hoa', label: '✨ Thăng hoa', desc: 'Rắn ➔ Khí',  type: 'absorb' },
          { key: 'dong_dac',  label: '❄️ Đông đặc',  desc: 'Lỏng ➔ Rắn', type: 'release' },
          { key: 'ngung_tu',  label: '💧 Ngưng tụ',  desc: 'Khí ➔ Lỏng', type: 'release' },
          { key: 'ngung_ket', label: '🌨️ Ngưng kết', desc: 'Khí ➔ Rắn',  type: 'release' }
        ];

        processes.forEach(p => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-btn' + (this.currentProcessName === p.key ? ' active' : '');
          const isActive = (this.currentProcessName === p.key);
          const activeBg = p.type === 'absorb' ? '#b45309' : '#0369a1';
          const activeBorder = p.type === 'absorb' ? '1.5px solid #f59e0b' : '1.5px solid #38bdf8';
          const glow = isActive ? (p.type === 'absorb' ? '0 0 10px rgba(245,158,11,0.45)' : '0 0 10px rgba(56,189,248,0.45)') : 'none';

          btn.style.cssText = `background:${isActive ? activeBg : 'rgba(30, 41, 59, 0.7)'}; border:${isActive ? activeBorder : '1px solid rgba(255,255,255,0.12)'}; box-shadow:${glow}; color:#fff; border-radius:6px; padding:5px 2px; text-align:center; cursor:pointer; transition:all 0.2s ease; display:flex; flex-direction:column; align-items:center; justify-content:center;`;
          btn.innerHTML = `<span style="font-size:11px; font-weight:700; white-space:nowrap;">${p.label}</span><span style="font-size:9.5px; opacity:0.85; margin-top:1px; white-space:nowrap;">${p.desc}</span>`;
          btn.onclick = () => {
            this.triggerProcess(p.key);
          };
          gridBox.appendChild(btn);
        });
        ctrlBox.appendChild(gridBox);
      }
    }

    updateHudStats() {
      const fEl = document.getElementById('sim-hud-force');
      const tEl = document.getElementById('sim-hud-temp');
      const cEl = document.getElementById('sim-hud-count');

      if (this.currentSceneIdx === 0) {
        if (fEl) {
          if (this.rRatio < 0.98) fEl.textContent = 'Lực ĐẨY chiếm ưu thế (r < r₀)';
          else if (this.rRatio <= 1.05) fEl.textContent = 'Hợp lực F = 0 (Cân bằng r₀)';
          else fEl.textContent = 'Lực HÚT chiếm ưu thế (r > r₀)';
        }
        if (tEl) tEl.textContent = `r = ${this.rRatio.toFixed(2)} r₀`;
        if (cEl) cEl.textContent = '2 Phân tử vi mô';
      } else if (this.currentSceneIdx === 1) {
        if (fEl) {
          if (this.tempC < 0) fEl.textContent = 'Thể Rắn (Nước đá)';
          else if (this.tempC === 0) fEl.textContent = 'Nóng chảy (T=0°C không đổi)';
          else if (this.tempC < 100) fEl.textContent = 'Thể Lỏng (Nước)';
          else if (this.tempC === 100) fEl.textContent = 'Đang sôi (T=100°C không đổi)';
          else fEl.textContent = 'Thể Khí (Hơi nước)';
        }
        if (tEl) tEl.textContent = `T = ${this.tempC}°C`;
        if (cEl) cEl.textContent = '72 Phân tử H₂O';
      } else {
        if (fEl) fEl.textContent = '6 Quá trình chuyển thể';
        if (tEl) tEl.textContent = 'Khối vật chất thực tế';
        if (cEl) cEl.textContent = 'Rắn · Lỏng · Khí';
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ANIMATION LOOP
    // ─────────────────────────────────────────────────────────────
    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      this.time += delta;

      if (this.controls) this.controls.update();

      if (this.currentSceneIdx === 0) {
        this.animateModel1(delta);
      } else if (this.currentSceneIdx === 1) {
        this.animateModel2(delta);
      } else if (this.currentSceneIdx === 2) {
        this.animateModel3(delta);
      }

      this.renderer.render(this.scene, this.camera);
    }

    animateModel1(delta) {
      if (this.r0Ring) {
        this.r0Ring.rotation.z += delta * 0.4;
      }
    }

    animateModel2(delta) {
      this.tempStepAcc = (this.tempStepAcc || 0) + delta;

      // Chế độ CẤP NHIỆT (Tăng nhiệt độ)
      if (this.heatMode === 'heat') {
        if (this.tempC < 0) {
          if (this.tempStepAcc >= 0.08) {
            this.tempStepAcc = 0;
            this.tempC += 1;
            if (this.tempC >= 0) {
              this.tempC = 0;
              this.meltProgress = 0;
            }
          }
        } else if (this.tempC === 0) {
          this.meltProgress += delta * 0.4;
          if (this.meltProgress >= 1.0) {
            this.meltProgress = 1.0;
            this.tempC = 1;
            this.tempStepAcc = 0;
          }
        } else if (this.tempC < 100) {
          if (this.tempStepAcc >= 0.07) {
            this.tempStepAcc = 0;
            this.tempC += 1;
            if (this.tempC >= 100) {
              this.tempC = 100;
              this.boilProgress = 0;
            }
          }
        } else if (this.tempC === 100) {
          this.boilProgress += delta * 0.4;
          if (this.boilProgress >= 1.0) {
            this.boilProgress = 1.0;
            this.tempC = 101;
            this.tempStepAcc = 0;
          }
        } else if (this.tempC < 150) {
          if (this.tempStepAcc >= 0.08) {
            this.tempStepAcc = 0;
            this.tempC += 1;
            if (this.tempC >= 150) {
              this.tempC = 150;
              this.heatMode = 'stop';
            }
          }
        }
        this.updateLegend();
        this.updateTempControls();
        this.updateHudStats();
      }

      // Chế độ TỎA NHIỆT (Giảm nhiệt độ chạy ngược lại)
      else if (this.heatMode === 'cool') {
        if (this.tempC > 100) {
          if (this.tempStepAcc >= 0.08) {
            this.tempStepAcc = 0;
            this.tempC -= 1;
            if (this.tempC <= 100) {
              this.tempC = 100;
              this.boilProgress = 1.0;
            }
          }
        } else if (this.tempC === 100) {
          this.boilProgress -= delta * 0.4;
          if (this.boilProgress <= 0) {
            this.boilProgress = 0;
            this.tempC = 99;
            this.tempStepAcc = 0;
          }
        } else if (this.tempC > 0) {
          if (this.tempStepAcc >= 0.07) {
            this.tempStepAcc = 0;
            this.tempC -= 1;
            if (this.tempC <= 0) {
              this.tempC = 0;
              this.meltProgress = 1.0;
            }
          }
        } else if (this.tempC === 0) {
          this.meltProgress -= delta * 0.4;
          if (this.meltProgress <= 0) {
            this.meltProgress = 0;
            this.tempC = -1;
            this.tempStepAcc = 0;
          }
        } else if (this.tempC > -50) {
          if (this.tempStepAcc >= 0.08) {
            this.tempStepAcc = 0;
            this.tempC -= 1;
            if (this.tempC <= -50) {
              this.tempC = -50;
              this.heatMode = 'stop';
            }
          }
        }
        this.updateLegend();
        this.updateTempControls();
        this.updateHudStats();
      }

      // Nhấp nháy ngọn lửa khi cấp nhiệt
      if (this.flameMesh) {
        if (this.heatMode === 'heat') {
          const s = 1.0 + Math.sin(this.time * 20) * 0.15;
          this.flameMesh.scale.set(s, s * 1.2, s);
          this.flameMesh.visible = true;
          this.flameLight.intensity = 1.5;
        } else if (this.heatMode === 'cool') {
          this.flameMesh.visible = false;
          this.flameLight.intensity = 0.2;
        } else {
          this.flameMesh.scale.set(0.8, 0.8, 0.8);
          this.flameMesh.visible = (this.tempC > 0);
          this.flameLight.intensity = this.tempC > 0 ? 0.6 : 0.0;
        }
      }

      // Chuyển động của các phân tử nước H2O
      const floorY = -this.chamberHeight / 2 + 0.35;
      const ceilY = this.chamberHeight / 2 - 0.35;
      const boundX = this.chamberWidth / 2 - 0.35;
      const boundZ = this.chamberDepth / 2 - 0.35;

      const isSolid = this.tempC < 0 || (this.tempC === 0 && this.meltProgress < 0.2);
      const isMelting = this.tempC === 0;
      const isLiquid = (this.tempC > 0 && this.tempC < 100) || (this.tempC === 0 && this.meltProgress >= 0.2);
      const isBoiling = this.tempC === 100;
      const isGas = this.tempC > 100 || (this.tempC === 100 && this.boilProgress > 0.85);

      this.h2oMolecules.forEach((mol, idx) => {
        if (isSolid) {
          const amp = 0.025 + ((this.tempC + 50) / 50) * 0.04;
          mol.pos.x = mol.basePos.x + Math.sin(this.time * 8 + mol.phase) * amp;
          mol.pos.y = mol.basePos.y + Math.cos(this.time * 8 + mol.phase * 1.5) * amp;
          mol.pos.z = mol.basePos.z + Math.sin(this.time * 9 + mol.phase * 2) * amp;
        } else if (isMelting) {
          const meltRatio = this.meltProgress;
          if (idx < this.h2oMolecules.length * meltRatio) {
            mol.pos.y = Math.max(floorY + (idx % 6) * 0.18, mol.pos.y - delta * 1.2);
            mol.pos.x += mol.vel.x * 0.5;
            mol.pos.z += mol.vel.z * 0.5;
            if (mol.pos.x > boundX || mol.pos.x < -boundX) mol.vel.x *= -1;
            if (mol.pos.z > boundZ || mol.pos.z < -boundZ) mol.vel.z *= -1;
          } else {
            mol.pos.x = mol.basePos.x + Math.sin(this.time * 12 + mol.phase) * 0.07;
            mol.pos.y = mol.basePos.y + Math.cos(this.time * 12 + mol.phase) * 0.07;
            mol.pos.z = mol.basePos.z + Math.sin(this.time * 12 + mol.phase) * 0.07;
          }
        } else if (isLiquid && !isBoiling) {
          const speedFactor = 0.5 + (this.tempC / 100) * 0.9;
          mol.pos.addScaledVector(mol.vel, speedFactor);

          const waterSurfaceY = floorY + 1.2;
          if (mol.pos.y < floorY) { mol.pos.y = floorY; mol.vel.y *= -1; }
          if (mol.pos.y > waterSurfaceY) { mol.pos.y = waterSurfaceY; mol.vel.y *= -1; }
          if (mol.pos.x > boundX) { mol.pos.x = boundX; mol.vel.x *= -1; }
          if (mol.pos.x < -boundX) { mol.pos.x = -boundX; mol.vel.x *= -1; }
          if (mol.pos.z > boundZ) { mol.pos.z = boundZ; mol.vel.z *= -1; }
          if (mol.pos.z < -boundZ) { mol.pos.z = -boundZ; mol.vel.z *= -1; }

          if (mol.isSurface && Math.random() < 0.015) {
            mol.pos.y = waterSurfaceY + 0.3;
            mol.vel.y = 0.04 + Math.random() * 0.05;
          }
          if (mol.pos.y > waterSurfaceY && mol.pos.y > ceilY) {
            mol.pos.y = waterSurfaceY;
          }

          mol.group.rotation.x += delta * speedFactor * 2;
          mol.group.rotation.y += delta * speedFactor * 1.5;
        } else if (isBoiling) {
          const boilRatio = this.boilProgress;
          const speedFactor = 1.8;
          mol.pos.addScaledVector(mol.vel, speedFactor);

          if (mol.pos.y < floorY) { mol.pos.y = floorY; mol.vel.y = Math.abs(mol.vel.y); }
          if (mol.pos.y > ceilY) { mol.pos.y = ceilY; mol.vel.y = -Math.abs(mol.vel.y); }
          if (mol.pos.x > boundX) { mol.pos.x = boundX; mol.vel.x *= -1; }
          if (mol.pos.x < -boundX) { mol.pos.x = -boundX; mol.vel.x *= -1; }
          if (mol.pos.z > boundZ) { mol.pos.z = boundZ; mol.vel.z *= -1; }
          if (mol.pos.z < -boundZ) { mol.pos.z = -boundZ; mol.vel.z *= -1; }

          mol.group.rotation.x += delta * 4;
          mol.group.rotation.y += delta * 3;
        } else if (isGas) {
          const speedFactor = 2.2 + ((this.tempC - 100) / 50) * 1.2;
          mol.pos.addScaledVector(mol.vel, speedFactor);

          if (mol.pos.x > boundX) { mol.pos.x = boundX; mol.vel.x *= -1; }
          if (mol.pos.x < -boundX) { mol.pos.x = -boundX; mol.vel.x *= -1; }
          if (mol.pos.y > ceilY) { mol.pos.y = ceilY; mol.vel.y *= -1; }
          if (mol.pos.y < floorY) { mol.pos.y = floorY; mol.vel.y *= -1; }
          if (mol.pos.z > boundZ) { mol.pos.z = boundZ; mol.vel.z *= -1; }
          if (mol.pos.z < -boundZ) { mol.pos.z = -boundZ; mol.vel.z *= -1; }

          mol.group.rotation.x += delta * speedFactor * 3;
          mol.group.rotation.y += delta * speedFactor * 2.5;
        }

        mol.group.position.copy(mol.pos);
      });

      // Bọt khí sôi
      if (this.bubbles) {
        const showBubbles = (this.tempC >= 95 && this.tempC <= 105);
        this.bubbles.forEach((b) => {
          b.mesh.visible = showBubbles;
          if (showBubbles) {
            b.y += b.speed * 1.2;
            const waterSurfaceY = floorY + 1.2 * (1 - this.boilProgress);
            if (b.y > waterSurfaceY) {
              b.y = floorY + 0.1;
              b.x = (Math.random() - 0.5) * (this.chamberWidth - 0.6);
              b.z = (Math.random() - 0.5) * (this.chamberDepth - 0.6);
            }
            b.mesh.position.set(b.x, b.y, b.z);
            b.mesh.scale.setScalar(b.scale * (1 + (b.y - floorY) * 0.8));
          }
        });
      }

      this.drawMiniGraphM2();
    }

    animateModel3(delta) {
      if (this.processProgress < 1.0) {
        this.processProgress = Math.min(1.0, this.processProgress + delta * 0.45);
      }
      const t = this.processProgress;

      if (this.currentProcessName === 'nong_chay') {
        // Nóng chảy: Rắn xẹp dần xuống (y scale giảm), Vũng lỏng loang to ra
        this.solidBlock.scale.set(1 - t * 0.85, Math.max(0.05, 1 - t * 0.95), 1 - t * 0.85);
        this.solidBlock.position.y = -0.4 - t * 0.45;
        this.liquidPuddle.scale.set(t, 1, t);
      } else if (this.currentProcessName === 'dong_dac') {
        // Đông đặc: Vũng lỏng co lại, Khối rắn trồi lên hình thành lại
        this.solidBlock.scale.set(t * 0.85 + 0.15, t * 0.95 + 0.05, t * 0.85 + 0.15);
        this.solidBlock.position.y = -0.85 + t * 0.45;
        this.liquidPuddle.scale.set(Math.max(0.01, 1 - t), 1, Math.max(0.01, 1 - t));
      } else if (this.currentProcessName === 'hoa_hoi') {
        // Hóa hơi: Vũng lỏng cạn dần, Khí bốc mù mịt lên trên
        this.solidBlock.scale.set(0.01, 0.01, 0.01);
        this.liquidPuddle.scale.set(Math.max(0.01, 1 - t), 1, Math.max(0.01, 1 - t));

        this.processParticles.forEach((p, idx) => {
          p.mesh.visible = true;
          if (p.life <= 0) {
            p.life = 1.0;
            p.pos.set((Math.random() - 0.5) * 1.5, -0.8, (Math.random() - 0.5) * 1.5);
            p.vel.set((Math.random() - 0.5) * 0.8, 1.2 + Math.random() * 1.5, (Math.random() - 0.5) * 0.8);
          } else {
            p.life -= delta * 0.8;
            p.pos.addScaledVector(p.vel, delta);
          }
          p.mesh.position.copy(p.pos);
          p.mesh.scale.setScalar(p.life * 1.2);
        });
      } else if (this.currentProcessName === 'ngung_tu') {
        // Ngưng tụ: Khí từ trên tụ lại thành các giọt rơi xuống đọng thành vũng lỏng
        this.solidBlock.scale.set(0.01, 0.01, 0.01);
        this.liquidPuddle.scale.set(t, 1, t);

        this.processParticles.forEach((p) => {
          p.mesh.visible = (t < 0.85);
          if (p.life <= 0) {
            p.life = 1.0;
            p.pos.set((Math.random() - 0.5) * 2.0, 1.5 + Math.random() * 0.5, (Math.random() - 0.5) * 2.0);
            p.vel.set((Math.random() - 0.5) * 0.2, -1.5, (Math.random() - 0.5) * 0.2);
          } else {
            p.life -= delta;
            p.pos.addScaledVector(p.vel, delta);
            if (p.pos.y < -0.85) p.life = 0;
          }
          p.mesh.position.copy(p.pos);
        });
      } else if (this.currentProcessName === 'thang_hoa') {
        // Thăng hoa: Khối rắn teo dần và bốc khói trực tiếp, ĐÁY KHÔNG CÓ GIỌT LỎNG NÀO!
        this.liquidPuddle.scale.set(0.01, 0.01, 0.01);
        this.solidBlock.scale.set(Math.max(0.05, 1 - t), Math.max(0.05, 1 - t), Math.max(0.05, 1 - t));

        this.processParticles.forEach((p) => {
          p.mesh.visible = (t < 0.95);
          if (p.life <= 0) {
            p.life = 1.0;
            p.pos.set((Math.random() - 0.5) * 0.8, -0.4, (Math.random() - 0.5) * 0.8);
            p.vel.set((Math.random() - 0.5) * 1.5, 1.5 + Math.random() * 1.8, (Math.random() - 0.5) * 1.5);
          } else {
            p.life -= delta * 0.7;
            p.pos.addScaledVector(p.vel, delta);
          }
          p.mesh.position.copy(p.pos);
          p.mesh.scale.setScalar(p.life * 1.4);
        });
      } else if (this.currentProcessName === 'ngung_ket') {
        // Ngưng kết: Khí lạnh kết tinh thẳng thành tinh thể rắn, ĐÁY KHÔNG QUA THỂ LỎNG!
        this.liquidPuddle.scale.set(0.01, 0.01, 0.01);
        this.solidBlock.scale.set(t, t, t);

        this.processParticles.forEach((p) => {
          p.mesh.visible = (t < 0.8);
          if (p.life <= 0) {
            p.life = 1.0;
            p.pos.set((Math.random() - 0.5) * 2.2, 1.6, (Math.random() - 0.5) * 2.2);
            p.vel.set(-p.pos.x * 0.8, -1.2, -p.pos.z * 0.8); // tụ về tâm khối rắn
          } else {
            p.life -= delta;
            p.pos.addScaledVector(p.vel, delta);
          }
          p.mesh.position.copy(p.pos);
        });
      } else {
        // Trạng thái ban đầu: Khối rắn nguyên vẹn
        this.solidBlock.scale.set(1, 1, 1);
        this.solidBlock.position.y = -0.4;
        this.liquidPuddle.scale.set(0.01, 0.01, 0.01);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // HÀM ĐIỀU KHIỂN TƯƠNG THÍCH VỚI BUTTONS NGOÀI
    // ─────────────────────────────────────────────────────────────
    toggleSlowMo() {
      if (this.currentSceneIdx === 1) {
        this.heatMode = this.heatMode === 'heat' ? 'stop' : 'heat';
        this.updateLegendAndContextControls();
        return this.heatMode === 'heat';
      }
      return false;
    }

    toggleTemp() {
      if (this.currentSceneIdx === 1) {
        this.heatMode = this.heatMode === 'cool' ? 'stop' : 'cool';
        this.updateLegendAndContextControls();
        return this.heatMode === 'cool';
      }
      return false;
    }

    toggleMode() {
      const nextIdx = (this.currentSceneIdx + 1) % 3;
      const tabsBar = this.container.querySelector('.sim-subscene-tabs');
      if (tabsBar) {
        const btns = tabsBar.querySelectorAll('.sim-tab-btn');
        if (btns[nextIdx]) btns[nextIdx].click();
      } else {
        this.switchScene(nextIdx);
      }
      return this.currentSceneIdx === 1;
    }

    destroy() {
      if (this.animId) cancelAnimationFrame(this.animId);
      if (this.resizeObserver) this.resizeObserver.disconnect();

      this.restoreDefaultToolbars();

      if (this.legendOverlay && this.legendOverlay.parentElement) {
        this.legendOverlay.parentElement.removeChild(this.legendOverlay);
      }
      if (this.m2GraphWrap && this.m2GraphWrap.parentElement) {
        this.m2GraphWrap.parentElement.removeChild(this.m2GraphWrap);
      }

      if (this.renderer && this.renderer.domElement) {
        this.renderer.dispose();
        if (this.renderer.domElement.parentElement) {
          this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
        }
      }
    }
  }

  return SimB02ChuyenThe;
});
