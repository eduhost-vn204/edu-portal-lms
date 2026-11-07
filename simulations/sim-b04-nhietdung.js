/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 4: NHIỆT DUNG RIÊNG – NÓNG CHẢY RIÊNG – HOÁ HƠI RIÊNG
 * Mã bài học: Bfc4552a2a3b2
 * Thiết kế hoàn toàn theo đúng kịch bản trực quan sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: NHIỆT DUNG RIÊNG (c) & PHƯƠNG TRÌNH CÂN BẰNG NHIỆT
 *    - Thí nghiệm so sánh 2 cốc chất lỏng (Nước c = 4200 vs Dầu ăn c = 2100) trên 2 bếp điện cùng công suất P.
 *    - Đun cùng thời gian: Dầu ăn tăng nhiệt nhanh gấp đôi Nước vì c_dầu = 1/2 c_nước (c nhỏ -> nóng nhanh).
 *    - Chế độ Cân bằng nhiệt: Thả quả cầu kim loại nóng vào cốc nước lạnh, dòng nhiệt Q truyền từ vật nóng sang
 *      nước đến khi T1 = T2 = Tcb (Qtỏa = Qthu).
 * 
 * 2. MÔ HÌNH 2: BẢN CHẤT VI MÔ CỦA NHIỆT NÓNG CHẢY RIÊNG (lambda) — Q = lambda * m
 *    - Mạng tinh thể chất rắn 3D lập phương với các liên kết tinh thể liên kết các phân tử trật tự.
 *    - Quá trình nóng chảy: Nhiệt lượng cung cấp dùng để PHÁ VỠ MẠNG TINH THỂ, tăng THẾ NĂNG tương tác.
 *    - Điểm nhấn sư phạm cốt lõi: NHIỆT ĐỘ KHÔNG ĐỔI trong suốt quá trình nóng chảy (nhiệt kế đứng yên ở Tnc)!
 *    - Cấu trúc chuyển từ mạng tinh thể trật tự sang trạng thái chất lỏng trượt tự do.
 * 
 * 3. MÔ HÌNH 3: BẢN CHẤT VI MÔ CỦA NHIỆT HOÁ HƠI RIÊNG (L) — Q = L * m & ĐỒ THỊ 5 GIAI ĐOẠN
 *    - Khối chất lỏng sôi với các phân tử chuyển động tự do.
 *    - Quá trình hoá hơi: Nhiệt lượng dùng để THẮNG LỰC HÚT giữa các phân tử, giải phóng phân tử bứt ra mặt thoáng thành thể khí.
 *    - Điểm nhấn sư phạm: Nhiệt độ giữ nguyên không đổi trong suốt quá trình sôi (nhiệt kế đứng yên ở 100°C).
 *    - Đồ thị T(Q) đường gấp khúc 5 đoạn: nổi bật 2 đoạn nằm ngang nóng chảy và hoá hơi.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB04NhietDung = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB04NhietDung {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Nhiệt dung riêng (c), 1: Nhiệt nóng chảy riêng, 2: Nhiệt hoá hơi riêng
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: NHIỆT DUNG RIÊNG ──
      this.m1Mode = 'compare'; // 'compare' (so sánh Nước vs Dầu) | 'equilibrium' (cân bằng nhiệt)
      this.m1IsHeating = false;
      this.m1HeatTime = 0; // giây đun (0 -> 60)
      this.m1TempWater = 25; // 25°C -> max ~50°C
      this.m1TempOil = 25;   // 25°C -> max ~75°C (gấp đôi)
      // Cân bằng nhiệt
      this.m1EqProgress = 0; // 0 -> 1
      this.m1MetalTemp = 100;
      this.m1WaterTempEq = 20;
      this.m1FinalTemp = 36; // Cân bằng

      // ── BIẾN SỐ MÔ HÌNH 2: NHIỆT NÓNG CHẢY RIÊNG ──
      this.m2MeltProgress = 0; // 0 (rắn tinh thể) -> 1 (lỏng hoàn toàn)
      this.m2IsMelting = false;
      this.m2Molecules = [];
      this.m2Bonds = [];

      // ── BIẾN SỐ MÔ HÌNH 3: NHIỆT HOÁ HƠI RIÊNG ──
      this.m3BoilProgress = 0; // 0 -> 1
      this.m3IsBoiling = false;
      this.m3LiquidParticles = [];
      this.m3GasParticles = [];

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

      // Bảng Chú thích trong suốt (Legend Overlay)
      this.legendOverlay = document.createElement('div');
      this.legendOverlay.className = 'sim-legend-overlay';
      this.legendOverlay.style.cssText = 'position: absolute; top: 40px; left: 8px; background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.08); padding: 4px 6px; border-radius: 6px; font-size: 10.5px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: left; max-width: 250px;';
      this.container.appendChild(this.legendOverlay);

      // 4. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 30;
        this.controls.minDistance = 3;
      }

      // 5. Lighting
      this.setupLights();

      // 6. Xây dựng 3 nhóm 3D
      this.groupM1 = new THREE.Group();
      this.groupM2 = new THREE.Group();
      this.groupM3 = new THREE.Group();

      this.scene.add(this.groupM1);
      this.scene.add(this.groupM2);
      this.scene.add(this.groupM3);

      this.buildModel1SpecificHeat();
      this.buildModel2LatentFusion();
      this.buildModel3LatentVaporization();

      // Khởi tạo tab 0
      this.groupM1.visible = true;
      this.groupM2.visible = false;
      this.groupM3.visible = false;

      // 7. Gắn Tabs & Controls
      this.buildSubSceneTabs();
      this.hideDefaultToolbars();
      this.updateLegendAndContextControls();
      this.updateHudStats();

      // 8. Event Resize & Animation
      this._onResize = () => this.onResize();
      window.addEventListener('resize', this._onResize);

      this.animate();
    }

    setupLights() {
      const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight1.position.set(5, 10, 7);
      this.scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
      dirLight2.position.set(-8, -4, -5);
      this.scene.add(dirLight2);

      const pointLight = new THREE.PointLight(0xf59e0b, 1.0, 15);
      pointLight.position.set(0, 0, 4);
      this.scene.add(pointLight);
    }

    resetCamera() {
      if (this.currentSceneIdx === 0) {
        this.camera.position.set(0, 0.6, 6.8);
        this.camera.lookAt(0, -0.2, 0);
        if (this.controls) {
          this.controls.target.set(0, -0.2, 0);
          this.controls.update();
        }
      } else if (this.currentSceneIdx === 1) {
        this.camera.position.set(0, 0.8, 6.2);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.target.set(0, 0, 0);
          this.controls.update();
        }
      } else {
        this.camera.position.set(0, 0.3, 6.6);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.target.set(0, 0, 0);
          this.controls.update();
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // GẮN TABS CHUYỂN ĐỔI 3 MÔ HÌNH SƯ PHẠM
    // ─────────────────────────────────────────────────────────────
    buildSubSceneTabs() {
      let tabsBar = this.container.querySelector('.sim-subscene-tabs');
      if (!tabsBar) {
        tabsBar = document.createElement('div');
        tabsBar.className = 'sim-subscene-tabs';
        tabsBar.style.cssText = 'position: absolute; top: 6px; left: 6px; right: 6px; z-index: 25; display: flex; justify-content: center; gap: 4px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); padding: 3px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 4px 12px rgba(0,0,0,0.5);';

        const scenes = [
          { name: '1. Nhiệt dung riêng (c)', title: 'Q = mcΔT & Cân bằng nhiệt' },
          { name: '2. Nhiệt nóng chảy (λ)', title: 'Q = λm & Phá vỡ tinh thể (T không đổi)' },
          { name: '3. Nhiệt hoá hơi (L)', title: 'Q = Lm & Thắng lực hút phân tử' }
        ];

        scenes.forEach((s, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-tab-btn' + (idx === 0 ? ' active' : '');
          btn.textContent = s.name;
          btn.title = s.title;
          btn.style.cssText = 'background: ' + (idx === 0 ? '#0284c7' : 'transparent') + '; color: ' + (idx === 0 ? '#fff' : '#94a3b8') + '; border: none; padding: 4px 6px; border-radius: 6px; font-size: 10.5px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; flex: 1; text-align: center;';

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

      this.m1IsHeating = false;
      this.m2IsMelting = false;
      this.m3IsBoiling = false;

      this.resetCamera();
      this.updateLegendAndContextControls();
      this.updateHudStats();
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 1: NHIỆT DUNG RIÊNG (c) & SO SÁNH / CÂN BẰNG NHIỆT
    // ─────────────────────────────────────────────────────────────
    buildModel1SpecificHeat() {
      this.groupM1.clear();

      // Bệ đỡ chung
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(6.4, 0.2, 2.0),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
      );
      baseMesh.position.y = -2.2;
      this.groupM1.add(baseMesh);

      // Nhóm con: So sánh 2 cốc (Water vs Oil)
      this.m1CompareGroup = new THREE.Group();
      this.groupM1.add(this.m1CompareGroup);

      // Cốc 1: Nước (x = -1.5)
      this.m1WaterBeaker = this.createBeakerSetup(-1.5, '💧 NƯỚC (c = 4200)', 0x38bdf8);
      this.m1CompareGroup.add(this.m1WaterBeaker.group);

      // Cốc 2: Dầu ăn (x = 1.5)
      this.m1OilBeaker = this.createBeakerSetup(1.5, '🌻 DẦU ĂN (c = 2100)', 0xf59e0b);
      this.m1CompareGroup.add(this.m1OilBeaker.group);

      // Nhóm con: Cân bằng nhiệt (Equilibrium)
      this.m1EqGroup = new THREE.Group();
      this.m1EqGroup.visible = false;
      this.groupM1.add(this.m1EqGroup);

      // Cốc nước lớn ở giữa
      const eqBeaker = this.createBeakerSetup(0, '💧 NƯỚC (20°C)', 0x38bdf8, 1.4);
      this.m1EqBeaker = eqBeaker;
      this.m1EqGroup.add(eqBeaker.group);

      // Quả cầu kim loại nóng (sắt/đồng)
      const metalGeom = new THREE.SphereGeometry(0.42, 24, 24);
      this.m1MetalMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xef4444,
        emissiveIntensity: 0.6
      });
      this.m1MetalMesh = new THREE.Mesh(metalGeom, this.m1MetalMat);
      this.m1MetalMesh.position.set(0, 0.8, 0); // Thả từ trên xuống
      this.m1EqGroup.add(this.m1MetalMesh);

      this.updateModel1Visuals();
    }

    createBeakerSetup(posX, labelText, liquidColor, scale = 1.0) {
      const g = new THREE.Group();
      g.position.x = posX;

      // 1. Bếp điện đun nóng (Heater base)
      const heaterGeom = new THREE.CylinderGeometry(0.9 * scale, 0.95 * scale, 0.25, 24);
      const heaterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
      const heater = new THREE.Mesh(heaterGeom, heaterMat);
      heater.position.y = -1.95;
      g.add(heater);

      // Vòng mayso phát sáng nhiệt khi bật bếp
      const burnerGeom = new THREE.TorusGeometry(0.65 * scale, 0.05, 12, 32);
      const burnerMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        emissive: 0xef4444,
        emissiveIntensity: 0.0
      });
      const burner = new THREE.Mesh(burnerGeom, burnerMat);
      burner.rotation.x = Math.PI / 2;
      burner.position.y = -1.8;
      g.add(burner);

      // 2. Cốc thủy tinh (Beaker)
      const bGeom = new THREE.CylinderGeometry(0.85 * scale, 0.8 * scale, 1.8 * scale, 24, 1, true);
      const bMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 0.3,
        transparent: true,
        roughness: 0.1
      });
      const beaker = new THREE.Mesh(bGeom, bMat);
      beaker.position.y = -0.9 * scale;
      g.add(beaker);

      // Đáy cốc
      const bBottom = new THREE.Mesh(new THREE.CircleGeometry(0.8 * scale, 24), bMat);
      bBottom.rotation.x = Math.PI / 2;
      bBottom.position.y = -1.8 * scale;
      g.add(bBottom);

      // 3. Khối chất lỏng
      const lGeom = new THREE.CylinderGeometry(0.82 * scale, 0.77 * scale, 1.3 * scale, 24);
      const lMat = new THREE.MeshStandardMaterial({
        color: liquidColor,
        transparent: true,
        opacity: 0.55,
        roughness: 0.2
      });
      const liquid = new THREE.Mesh(lGeom, lMat);
      liquid.position.y = -1.15 * scale;
      g.add(liquid);

      // 4. Nhiệt kế cắm trong cốc
      const thermoG = new THREE.Group();
      thermoG.position.set(0.35 * scale, -0.2 * scale, 0);

      // Thân nhiệt kế
      const stemGeom = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 16);
      const stem = new THREE.Mesh(stemGeom, bMat);
      thermoG.add(stem);

      // Cột chất lỏng đỏ dâng trong nhiệt kế
      const colGeom = new THREE.CylinderGeometry(0.035, 0.035, 1, 12);
      colGeom.translate(0, 0.5, 0); // pivot đáy
      const colMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 });
      const stemLiquid = new THREE.Mesh(colGeom, colMat);
      stemLiquid.position.y = -1.1;
      thermoG.add(stemLiquid);

      // Bầu nhiệt kế
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), colMat);
      bulb.position.y = -1.1;
      thermoG.add(bulb);

      g.add(thermoG);

      // 5. Bảng nhãn tên cốc
      const canvas = document.createElement('canvas');
      canvas.width = 360;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(0, 0, 360, 64);
      ctx.fillStyle = liquidColor === 0x38bdf8 ? '#38bdf8' : '#f59e0b';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labelText, 180, 42);

      const tex = new THREE.CanvasTexture(canvas);
      const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 0.4), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      labelMesh.position.set(0, 1.45 * scale, 0);
      g.add(labelMesh);

      return {
        group: g,
        burnerMat: burnerMat,
        liquidMat: lMat,
        stemLiquid: stemLiquid,
        scale: scale
      };
    }

    updateModel1Visuals() {
      if (this.m1Mode === 'compare') {
        this.m1CompareGroup.visible = true;
        this.m1EqGroup.visible = false;

        // Chiều cao cột nhiệt kế:
        // Nước (25°C -> 50°C): cao từ 0.4 -> 1.0
        // Dầu ăn (25°C -> 75°C): cao từ 0.4 -> 1.8
        const normWater = (this.m1TempWater - 25) / 50;
        const normOil = (this.m1TempOil - 25) / 50;

        if (this.m1WaterBeaker && this.m1WaterBeaker.stemLiquid) {
          this.m1WaterBeaker.stemLiquid.scale.y = 0.4 + normWater * 1.0;
          this.m1WaterBeaker.burnerMat.emissiveIntensity = this.m1IsHeating ? 0.9 : 0.0;
        }
        if (this.m1OilBeaker && this.m1OilBeaker.stemLiquid) {
          this.m1OilBeaker.stemLiquid.scale.y = 0.4 + normOil * 1.5;
          this.m1OilBeaker.burnerMat.emissiveIntensity = this.m1IsHeating ? 0.9 : 0.0;
        }
      } else {
        this.m1CompareGroup.visible = false;
        this.m1EqGroup.visible = true;

        // Tiến trình thả quả cầu và truyền nhiệt
        // Quả cầu hạ xuống cốc tại y = -1.1
        const p = this.m1EqProgress;
        const ballY = 0.8 - p * 1.9; // 0.8 -> -1.1
        if (this.m1MetalMesh) {
          this.m1MetalMesh.position.y = ballY;

          // Màu quả cầu nguội dần (đỏ rực 100°C -> vàng cam 36°C)
          const r = 0.95 - p * 0.2;
          const g = 0.2 + p * 0.55;
          const b = 0.2;
          this.m1MetalMat.color.setRGB(r, g, b);
          this.m1MetalMat.emissive.setRGB(r, g, b).multiplyScalar(0.6 * (1 - p * 0.5));
        }

        // Nhiệt độ nước ấm dần từ 20°C -> 36°C
        const curWaterT = 20 + p * (this.m1FinalTemp - 20);
        if (this.m1EqBeaker && this.m1EqBeaker.stemLiquid) {
          this.m1EqBeaker.stemLiquid.scale.y = 0.3 + (curWaterT / 100) * 1.5;
        }
      }
    }

    animateModel1(dt) {
      if (!this.groupM1.visible) return;

      if (this.m1Mode === 'compare' && this.m1IsHeating) {
        // Cùng công suất P: Q = P*t = mc*deltaT
        // => deltaT = (P*t) / (m*c)
        // Vì c_dầu = 1/2 c_nước => dT_dầu tăng nhanh gấp 2 lần dT_nước!
        this.m1HeatTime += (dt / 1000);
        const rateWater = 0.35; // °C/frame
        const rateOil = 0.70;   // gấp đôi

        if (this.m1TempWater < 60) this.m1TempWater += rateWater * (dt / 16.6);
        if (this.m1TempOil < 95) this.m1TempOil += rateOil * (dt / 16.6);

        this.updateModel1Visuals();
        this.updateLegend();
        this.updateHudStats();
      } else if (this.m1Mode === 'equilibrium' && this.m1IsHeating) {
        if (this.m1EqProgress < 1.0) {
          this.m1EqProgress = Math.min(1.0, this.m1EqProgress + 0.008 * (dt / 16.6));
          this.updateModel1Visuals();
          this.updateLegend();
          this.updateHudStats();
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 2: BẢN CHẤT VI MÔ CỦA NHIỆT NÓNG CHẢY RIÊNG (lambda)
    // ─────────────────────────────────────────────────────────────
    buildModel2LatentFusion() {
      this.groupM2.clear();
      this.m2Molecules = [];
      this.m2Bonds = [];

      // Khung buồng quan sát tinh thể 3D
      const boxSize = 3.6;
      const boxGeom = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
      const boxEdges = new THREE.EdgesGeometry(boxGeom);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
      this.groupM2.add(new THREE.LineSegments(boxEdges, edgeMat));

      // Nhiệt kế bên cạnh buồng (Nhấn mạnh T KHÔNG ĐỔI ở 0°C)
      const thermoG = new THREE.Group();
      thermoG.position.set(-2.2, 0, 0);

      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.35, transparent: true });
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 16), glassMat);
      thermoG.add(stem);

      const colMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 });
      this.m2StemLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.2, 12), colMat);
      this.m2StemLiquid.position.y = -0.5; // Đứng yên ở vạch 0°C
      thermoG.add(this.m2StemLiquid);

      // Vạch 0°C phát sáng nổi bật
      const tickCanvas = document.createElement('canvas');
      tickCanvas.width = 128;
      tickCanvas.height = 64;
      const tCtx = tickCanvas.getContext('2d');
      tCtx.fillStyle = '#facc15';
      tCtx.font = 'bold 28px sans-serif';
      tCtx.fillText('0°C (const)', 10, 42);

      const tTex = new THREE.CanvasTexture(tickCanvas);
      const tMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshBasicMaterial({ map: tTex, transparent: true }));
      tMesh.position.set(0.7, 0.1, 0);
      thermoG.add(tMesh);

      this.groupM2.add(thermoG);

      // Tạo mạng tinh thể 3x3x3 phân tử (27 hạt) với các liên kết lò xo/thanh nối
      const N = 3;
      const spacing = 0.85;
      const sphereGeom = new THREE.SphereGeometry(0.12, 16, 16);

      for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
          for (let z = 0; z < N; z++) {
            const posX = (x - (N - 1) / 2) * spacing;
            const posY = (y - (N - 1) / 2) * spacing;
            const posZ = (z - (N - 1) / 2) * spacing;

            const mat = new THREE.MeshStandardMaterial({
              color: 0x38bdf8,
              roughness: 0.3,
              metalness: 0.4,
              emissive: 0x0284c7,
              emissiveIntensity: 0.3
            });
            const mesh = new THREE.Mesh(sphereGeom, mat);
            mesh.position.set(posX, posY, posZ);
            this.groupM2.add(mesh);

            this.m2Molecules.push({
              mesh: mesh,
              basePos: new THREE.Vector3(posX, posY, posZ),
              curPos: new THREE.Vector3(posX, posY, posZ),
              randOffset: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      // Tạo các đường liên kết mạng tinh thể (Bonds)
      const bondMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85, linewidth: 2 });
      for (let i = 0; i < this.m2Molecules.length; i++) {
        for (let j = i + 1; j < this.m2Molecules.length; j++) {
          const d = this.m2Molecules[i].basePos.distanceTo(this.m2Molecules[j].basePos);
          if (Math.abs(d - spacing) < 0.05) {
            const lineGeom = new THREE.BufferGeometry().setFromPoints([
              this.m2Molecules[i].basePos,
              this.m2Molecules[j].basePos
            ]);
            const line = new THREE.Line(lineGeom, bondMat.clone());
            this.groupM2.add(line);
            this.m2Bonds.push({ line: line, i: i, j: j });
          }
        }
      }

      this.updateModel2Visuals();
    }

    updateModel2Visuals() {
      const p = this.m2MeltProgress; // 0 -> 1

      // Khi p = 0: Rắn tinh thể trật tự, các thanh liên kết nguyên vẹn
      // Khi p tăng: Các thanh liên kết đứt gãy dần (opacity giảm, ẩn dần),
      // phân tử dãn cách và trôi tự do (chuyển thành chất lỏng)
      this.m2Bonds.forEach((b, idx) => {
        // Đứt gãy lần lượt theo tiến trình
        const threshold = (idx / this.m2Bonds.length);
        if (p > threshold) {
          b.line.visible = false;
        } else {
          b.line.visible = true;
          b.line.material.opacity = Math.max(0.1, 0.85 * (1 - p));
        }
      });

      // Màu phân tử đổi từ xanh băng sang xanh nước biển lỏng
      this.m2Molecules.forEach(m => {
        const r = 0.22 + p * 0.1;
        const g = 0.74 - p * 0.1;
        const b = 0.97;
        m.mesh.material.color.setRGB(r, g, b);
      });
    }

    animateModel2(dt) {
      if (!this.groupM2.visible) return;

      const p = this.m2MeltProgress;

      if (this.m2IsMelting && p < 1.0) {
        this.m2MeltProgress = Math.min(1.0, this.m2MeltProgress + 0.005 * (dt / 16.6));
        this.updateModel2Visuals();
        this.updateLegend();
        this.updateHudStats();
      }

      // Dao động và chuyển động phân tử:
      // Ở thể rắn (p=0): dao động nhỏ quanh vị trí cân bằng cố định
      // Ở thể lỏng (p->1): trượt và dời vị trí tự do hơn
      this.m2Molecules.forEach(m => {
        const vibAmp = 0.03 + p * 0.25; // Biên độ dao động
        const t = this.time * 4 + m.phase;

        const vx = Math.sin(t) * vibAmp + m.randOffset.x * p * 0.6;
        const vy = Math.cos(t * 1.2) * vibAmp + m.randOffset.y * p * 0.6;
        const vz = Math.sin(t * 0.8) * vibAmp + m.randOffset.z * p * 0.6;

        m.curPos.copy(m.basePos).add(new THREE.Vector3(vx, vy, vz));
        m.mesh.position.copy(m.curPos);
      });

      // Cập nhật vị trí các liên kết còn lại
      this.m2Bonds.forEach(b => {
        if (b.line.visible) {
          const posAttr = b.line.geometry.attributes.position;
          const p1 = this.m2Molecules[b.i].curPos;
          const p2 = this.m2Molecules[b.j].curPos;
          posAttr.setXYZ(0, p1.x, p1.y, p1.z);
          posAttr.setXYZ(1, p2.x, p2.y, p2.z);
          posAttr.needsUpdate = true;
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 3: BẢN CHẤT VI MÔ CỦA NHIỆT HOÁ HƠI RIÊNG (L)
    // ─────────────────────────────────────────────────────────────
    buildModel3LatentVaporization() {
      this.groupM3.clear();
      this.m3LiquidParticles = [];
      this.m3GasParticles = [];

      // 1. Cốc đun sôi có bọt khí
      const beakerGeom = new THREE.CylinderGeometry(1.2, 1.1, 2.4, 24, 1, true);
      const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.9, opacity: 0.3, transparent: true });
      const beaker = new THREE.Mesh(beakerGeom, glassMat);
      beaker.position.set(-0.9, -0.9, 0);
      this.groupM3.add(beaker);

      // Đáy cốc
      const bBottom = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), glassMat);
      bBottom.rotation.x = Math.PI / 2;
      bBottom.position.set(-0.9, -2.1, 0);
      this.groupM3.add(bBottom);

      // Khối chất lỏng trong cốc
      const waterGeom = new THREE.CylinderGeometry(1.15, 1.05, 1.6, 24);
      const waterMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
      const waterMesh = new THREE.Mesh(waterGeom, waterMat);
      waterMesh.position.set(-0.9, -1.3, 0);
      this.groupM3.add(waterMesh);

      // Nhiệt kế đứng yên ở 100°C (nhiệt độ sôi không đổi)
      const thermoG = new THREE.Group();
      thermoG.position.set(-1.8, 0, 0);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 3.2, 16), glassMat);
      thermoG.add(stem);

      const colMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.6 });
      const stemLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 12), colMat);
      stemLiquid.position.y = 0.1; // Chạm vạch 100°C
      thermoG.add(stemLiquid);

      // Nhãn 100°C không đổi
      const lCanvas = document.createElement('canvas');
      lCanvas.width = 128;
      lCanvas.height = 64;
      const lCtx = lCanvas.getContext('2d');
      lCtx.fillStyle = '#ef4444';
      lCtx.font = 'bold 26px sans-serif';
      lCtx.fillText('100°C (sôi)', 5, 42);

      const lTex = new THREE.CanvasTexture(lCanvas);
      const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.55), new THREE.MeshBasicMaterial({ map: lTex, transparent: true }));
      lMesh.position.set(-0.8, 1.1, 0);
      thermoG.add(lMesh);

      this.groupM3.add(thermoG);

      // 2. Các phân tử chất lỏng trong cốc (40 hạt)
      const pGeom = new THREE.SphereGeometry(0.075, 12, 12);
      for (let i = 0; i < 35; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.3 });
        const p = new THREE.Mesh(pGeom, mat);
        p.position.set(
          -0.9 + (Math.random() - 0.5) * 1.5,
          -1.8 + Math.random() * 1.0,
          (Math.random() - 0.5) * 1.5
        );
        this.groupM3.add(p);
        this.m3LiquidParticles.push({
          mesh: p,
          baseY: p.position.y,
          speed: 0.02 + Math.random() * 0.02
        });
      }

      // 3. Các phân tử hơi nước bứt phá bay lên mặt thoáng (25 hạt)
      for (let i = 0; i < 25; i++) {
        const mat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 0.5 });
        const p = new THREE.Mesh(pGeom, mat);
        p.position.set(
          -0.9 + (Math.random() - 0.5) * 1.4,
          -0.5 + Math.random() * 2.2,
          (Math.random() - 0.5) * 1.4
        );
        this.groupM3.add(p);
        this.m3GasParticles.push({
          mesh: p,
          vy: 0.03 + Math.random() * 0.04,
          vx: (Math.random() - 0.5) * 0.02
        });
      }

      // 4. Đồ thị 5 giai đoạn gấp khúc T(Q) bên phải (x = 1.4)
      this.buildPhaseDiagramM3();
    }

    buildPhaseDiagramM3() {
      const g = new THREE.Group();
      g.position.set(1.4, 0, 0);

      // Trục tọa độ Q (ngang) và T (đứng)
      const axisGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-1.4, -1.8, 0),
        new THREE.Vector3(1.6, -1.8, 0), // Trục Q
        new THREE.Vector3(-1.4, -1.8, 0),
        new THREE.Vector3(-1.4, 1.8, 0)   // Trục T
      ]);
      const axisLine = new THREE.LineSegments(axisGeom, new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 }));
      g.add(axisLine);

      // Đường gấp khúc 5 đoạn:
      // (1) Rắn tăng T: (-1.4, -1.5) -> (-1.0, -0.6)
      // (2) NÓNG CHẢY (ngang): (-1.0, -0.6) -> (-0.3, -0.6)
      // (3) Lỏng tăng T: (-0.3, -0.6) -> (0.3, 0.9)
      // (4) HOÁ HƠI (ngang): (0.3, 0.9) -> (1.1, 0.9)
      // (5) Hơi tăng T: (1.1, 0.9) -> (1.5, 1.6)
      const graphPts = [
        new THREE.Vector3(-1.4, -1.5, 0.02),
        new THREE.Vector3(-1.0, -0.6, 0.02), // Đoạn 1
        new THREE.Vector3(-0.3, -0.6, 0.02), // Đoạn 2 (nóng chảy ngang)
        new THREE.Vector3(0.3, 0.9, 0.02),   // Đoạn 3
        new THREE.Vector3(1.1, 0.9, 0.02),   // Đoạn 4 (hoá hơi ngang)
        new THREE.Vector3(1.5, 1.6, 0.02)    // Đoạn 5
      ];
      const graphGeom = new THREE.BufferGeometry().setFromPoints(graphPts);
      const graphLine = new THREE.Line(graphGeom, new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 3 }));
      g.add(graphLine);

      // Điểm sáng chỉ báo vị trí đang sôi trên đồ thị (ở đoạn 4)
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      dot.position.set(0.7, 0.9, 0.05); // Nằm giữa đoạn hoá hơi
      g.add(dot);

      // Bảng nhãn đồ thị
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(0, 0, 256, 128);
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('📈 ĐỒ THỊ T THEO Q', 20, 36);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '18px sans-serif';
      ctx.fillText('• 2 đoạn ngang: Chuyển thể', 20, 70);
      ctx.fillText('• Nhiệt độ KHÔNG đổi!', 20, 102);

      const tex = new THREE.CanvasTexture(canvas);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
      label.position.set(0.1, -1.0, 0.05);
      g.add(label);

      this.groupM3.add(g);
    }

    animateModel3(dt) {
      if (!this.groupM3.visible) return;

      // Hạt chất lỏng sôi dập dềnh
      this.m3LiquidParticles.forEach(p => {
        p.mesh.position.y += Math.sin(this.time * 6 + p.baseY) * 0.005;
      });

      // Hạt hơi nước bứt ra bay vút lên cao (thể hiện thắng lực hút liên kết bề mặt)
      this.m3GasParticles.forEach(p => {
        p.mesh.position.y += p.vy * (dt / 16.6);
        p.mesh.position.x += p.vx * (dt / 16.6);

        // Bay quá trần thì hồi sinh ở mặt nước
        if (p.mesh.position.y > 1.8) {
          p.mesh.position.y = -0.5;
          p.mesh.position.x = -0.9 + (Math.random() - 0.5) * 1.3;
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // CẬP NHẬT CHÚ THÍCH TRONG SUỐT (LEGEND OVERLAY) & HUD
    // ─────────────────────────────────────────────────────────────
    updateLegend() {
      if (!this.legendOverlay) return;

      if (this.currentSceneIdx === 0) {
        if (this.m1Mode === 'compare') {
          const tW = this.m1TempWater.toFixed(1);
          const tO = this.m1TempOil.toFixed(1);
          this.legendOverlay.innerHTML = `
            <div style="font-weight:700; color:#38bdf8; font-size:12px;">⚖️ SO SÁNH NHIỆT DUNG RIÊNG (c)</div>
            <div>• Nước ($c = 4200$): <b style="color:#38bdf8;">${tW}°C</b> (nóng chậm)</div>
            <div>• Dầu ($c = 2100$): <b style="color:#f59e0b;">${tO}°C</b> (nóng nhanh gấp đôi!)</div>
            <div style="font-size:10px; color:#94a3b8; font-style:italic;">*Cùng công suất P: c nhỏ thì nhiệt độ tăng nhanh hơn (Q = mcΔT).</div>
          `;
        } else {
          const p = (this.m1EqProgress * 100).toFixed(0);
          const tM = (100 - this.m1EqProgress * (100 - this.m1FinalTemp)).toFixed(1);
          const tW = (20 + this.m1EqProgress * (this.m1FinalTemp - 20)).toFixed(1);
          this.legendOverlay.innerHTML = `
            <div style="font-weight:700; color:#10b981; font-size:12px;">🤝 CÂN BẰNG NHIỆT (Qtỏa = Qthu)</div>
            <div>• Thỏi kim loại toả nhiệt: <b style="color:#ef4444;">${tM}°C</b></div>
            <div>• Nước thu nhiệt: <b style="color:#38bdf8;">${tW}°C</b></div>
            <div>• Tiến trình: <b style="color:#facc15;">${p}%</b> (Tcb = 36°C)</div>
          `;
        }
      } else if (this.currentSceneIdx === 1) {
        const p = (this.m2MeltProgress * 100).toFixed(0);
        this.legendOverlay.innerHTML = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">🧊 NHIỆT NÓNG CHẢY RIÊNG (λ)</div>
          <div>• Công thức: <b style="color:#facc15;">Q = λ · m</b></div>
          <div>• Nhiệt độ: <b style="color:#10b981;">0°C (KHÔNG ĐỔI!)</b></div>
          <div>• Bản chất vi mô: Nhiệt lượng dùng để <b style="color:#ef4444;">phá vỡ mạng tinh thể</b>, tăng thế năng tương tác, động năng TB không đổi.</div>
          <div>• Tiến trình tan chảy: <b style="color:#38bdf8;">${p}%</b></div>
        `;
      } else {
        this.legendOverlay.innerHTML = `
          <div style="font-weight:700; color:#f59e0b; font-size:12px;">♨️ NHIỆT HOÁ HƠI RIÊNG (L)</div>
          <div>• Công thức: <b style="color:#facc15;">Q = L · m</b></div>
          <div>• Nhiệt độ sôi: <b style="color:#10b981;">100°C (KHÔNG ĐỔI!)</b></div>
          <div>• Bản chất vi mô: Nhiệt lượng dùng để <b style="color:#ef4444;">thắng lực hút phân tử</b>, giải phóng phân tử bứt ra mặt thoáng thành thể khí.</div>
          <div style="font-size:10px; color:#94a3b8; font-style:italic;">*Xem đồ thị 5 đoạn bên phải: 2 đoạn nằm ngang là dấu hiệu chuyển thể!</div>
        `;
      }
    }

    updateHudStats() {
      const hud1 = document.querySelector('#sim-hud-stat1') || document.querySelector('.sim-hud-stat1');
      const hud2 = document.querySelector('#sim-hud-stat2') || document.querySelector('.sim-hud-stat2');
      if (this.currentSceneIdx === 0) {
        if (hud1) hud1.textContent = this.m1Mode === 'compare' ? `Nước: ${this.m1TempWater.toFixed(0)}°C | Dầu: ${this.m1TempOil.toFixed(0)}°C` : 'Qtỏa = Qthu';
        if (hud2) hud2.textContent = 'Nhiệt dung riêng c';
      } else if (this.currentSceneIdx === 1) {
        if (hud1) hud1.textContent = 'T = 0°C (Không đổi)';
        if (hud2) hud2.textContent = `Nóng chảy ${(this.m2MeltProgress * 100).toFixed(0)}%`;
      } else {
        if (hud1) hud1.textContent = 'T = 100°C (Không đổi)';
        if (hud2) hud2.textContent = 'Đang sôi hoá hơi';
      }
    }

    // ─────────────────────────────────────────────────────────────
    // CONTROLS RIÊNG CHO TỪNG MÔ HÌNH
    // ─────────────────────────────────────────────────────────────
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
            const fBox = modalFooter.querySelector('.sim-formula-box');
            if (fBox) modalFooter.insertBefore(ctrlBox, fBox);
            else modalFooter.appendChild(ctrlBox);
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

    updateLegendAndContextControls() {
      this.updateLegend();
      this.renderContextControls();
    }

    renderContextControls() {
      const ctrlBox = this.getControlsContainer();
      if (!ctrlBox) return;
      ctrlBox.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // ── CONTROLS MÔ HÌNH 1: NHIỆT DUNG RIÊNG ──
        const rowMode = document.createElement('div');
        rowMode.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box;';

        const btnCmp = document.createElement('button');
        btnCmp.type = 'button';
        btnCmp.className = 'sim-btn' + (this.m1Mode === 'compare' ? ' active' : '');
        btnCmp.style.cssText = 'flex:1; padding:6px 2px; font-size:11px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; ' + (this.m1Mode === 'compare' ? 'background:#0284c7; color:#fff; border:1px solid #38bdf8;' : 'background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);');
        btnCmp.textContent = '⚖️ So sánh Nước vs Dầu';
        btnCmp.onclick = () => {
          this.m1Mode = 'compare';
          this.m1IsHeating = false;
          this.updateModel1Visuals();
          this.updateLegendAndContextControls();
          this.updateHudStats();
        };
        rowMode.appendChild(btnCmp);

        const btnEq = document.createElement('button');
        btnEq.type = 'button';
        btnEq.className = 'sim-btn' + (this.m1Mode === 'equilibrium' ? ' active' : '');
        btnEq.style.cssText = 'flex:1; padding:6px 2px; font-size:11px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; ' + (this.m1Mode === 'equilibrium' ? 'background:#059669; color:#fff; border:1px solid #10b981;' : 'background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);');
        btnEq.textContent = '🤝 Cân bằng nhiệt (Qtỏa = Qthu)';
        btnEq.onclick = () => {
          this.m1Mode = 'equilibrium';
          this.m1IsHeating = false;
          this.m1EqProgress = 0;
          this.updateModel1Visuals();
          this.updateLegendAndContextControls();
          this.updateHudStats();
        };
        rowMode.appendChild(btnEq);
        ctrlBox.appendChild(rowMode);

        // Nút hành động đun nóng / dừng / đặt lại
        const rowActions = document.createElement('div');
        rowActions.style.cssText = 'display:flex; gap:6px; width:100%; box-sizing:border-box;';

        const btnHeat = document.createElement('button');
        btnHeat.type = 'button';
        btnHeat.className = 'sim-btn';
        btnHeat.style.cssText = 'flex:1; padding:7px 4px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.m1IsHeating ? 'background:#ea580c; color:#fff; border:1px solid #f97316;' : 'background:#1e293b; color:#f8fafc; border:1px solid #64748b;');
        btnHeat.textContent = this.m1IsHeating ? '⏸ Tạm dừng' : (this.m1Mode === 'compare' ? '🔥 Bật bếp đun cả 2 cốc' : '⚡ Thả kim loại truyền nhiệt');
        btnHeat.onclick = () => {
          this.m1IsHeating = !this.m1IsHeating;
          this.updateModel1Visuals();
          this.renderContextControls();
        };
        rowActions.appendChild(btnHeat);

        const btnReset = document.createElement('button');
        btnReset.type = 'button';
        btnReset.className = 'sim-btn';
        btnReset.style.cssText = 'flex:0.4; padding:7px 4px; font-size:11px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; background:rgba(30,41,59,0.7); color:#94a3b8; border:1px solid rgba(255,255,255,0.1);';
        btnReset.textContent = '🔄 Đặt lại';
        btnReset.onclick = () => {
          this.m1IsHeating = false;
          this.m1TempWater = 25;
          this.m1TempOil = 25;
          this.m1EqProgress = 0;
          this.updateModel1Visuals();
          this.updateLegendAndContextControls();
          this.updateHudStats();
        };
        rowActions.appendChild(btnReset);
        ctrlBox.appendChild(rowActions);

      } else if (this.currentSceneIdx === 1) {
        // ── CONTROLS MÔ HÌNH 2: NHIỆT NÓNG CHẢY RIÊNG ──
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box;';

        const btnStartMelt = document.createElement('button');
        btnStartMelt.type = 'button';
        btnStartMelt.className = 'sim-btn';
        btnStartMelt.style.cssText = 'flex:1; padding:7px 4px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; ' + (this.m2IsMelting ? 'background:#ea580c; color:#fff; border:1px solid #f97316;' : 'background:#0284c7; color:#fff; border:1px solid #38bdf8;');
        btnStartMelt.textContent = this.m2IsMelting ? '⏸ Tạm dừng' : '🔥 Cung cấp nhiệt nóng chảy (Q = λm)';
        btnStartMelt.onclick = () => {
          this.m2IsMelting = !this.m2IsMelting;
          this.renderContextControls();
        };
        rowBtns.appendChild(btnStartMelt);

        const btnReset = document.createElement('button');
        btnReset.type = 'button';
        btnReset.className = 'sim-btn';
        btnReset.style.cssText = 'flex:0.4; padding:7px 4px; font-size:11px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; background:rgba(30,41,59,0.7); color:#94a3b8; border:1px solid rgba(255,255,255,0.1);';
        btnReset.textContent = '🔄 Đặt lại';
        btnReset.onclick = () => {
          this.m2IsMelting = false;
          this.m2MeltProgress = 0;
          this.updateModel2Visuals();
          this.updateLegendAndContextControls();
          this.updateHudStats();
        };
        rowBtns.appendChild(btnReset);
        ctrlBox.appendChild(rowBtns);

        // Thanh trượt tiến trình nóng chảy
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%; padding:2px 4px; box-sizing:border-box;';

        const sLabel = document.createElement('span');
        sLabel.style.cssText = 'font-size:11px; font-weight:600; color:#94a3b8; white-space:nowrap;';
        sLabel.innerHTML = `Nóng chảy: <b style="color:#38bdf8;">${(this.m2MeltProgress * 100).toFixed(0)}%</b> (T = 0°C const)`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '1';
        slider.step = '0.02';
        slider.value = this.m2MeltProgress;
        slider.style.cssText = 'flex:1; cursor:pointer; accent-color:#0284c7;';
        slider.oninput = (e) => {
          this.m2MeltProgress = parseFloat(e.target.value);
          sLabel.innerHTML = `Nóng chảy: <b style="color:#38bdf8;">${(this.m2MeltProgress * 100).toFixed(0)}%</b> (T = 0°C const)`;
          this.updateModel2Visuals();
          this.updateLegend();
          this.updateHudStats();
        };

        rowSlider.appendChild(slider);
        rowSlider.appendChild(sLabel);
        ctrlBox.appendChild(rowSlider);

      } else {
        // ── CONTROLS MÔ HÌNH 3: NHIỆT HOÁ HƠI RIÊNG ──
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box;';

        const btnBoil = document.createElement('button');
        btnBoil.type = 'button';
        btnBoil.className = 'sim-btn';
        btnBoil.style.cssText = 'flex:1; padding:7px 4px; font-size:11px; font-weight:700; text-align:center; border-radius:6px; cursor:pointer; background:#ea580c; color:#fff; border:1px solid #f97316;';
        btnBoil.textContent = '♨️ Quan sát hoá hơi: Phân tử bứt phá thắng lực hút (T = 100°C)';
        rowBtns.appendChild(btnBoil);
        ctrlBox.appendChild(rowBtns);

        // Chú thích giải thích
        const infoRow = document.createElement('div');
        infoRow.style.cssText = 'font-size:10.5px; color:#cbd5e1; text-align:center; padding:2px 4px;';
        infoRow.innerHTML = '✨ <i>Nhiệt lượng Q = L·m giải phóng phân tử khỏi bề mặt lỏng mà KHÔNG làm tăng nhiệt độ (đoạn ngang trên đồ thị).</i>';
        ctrlBox.appendChild(infoRow);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ANIMATION & RESIZE
    // ─────────────────────────────────────────────────────────────
    animate() {
      this.animId = requestAnimationFrame(() => this.animate());
      this.time += 0.016;

      if (this.controls) this.controls.update();

      if (this.currentSceneIdx === 0) {
        this.animateModel1(16.6);
      } else if (this.currentSceneIdx === 1) {
        this.animateModel2(16.6);
      } else if (this.currentSceneIdx === 2) {
        this.animateModel3(16.6);
      }

      this.renderer.render(this.scene, this.camera);
    }

    onResize() {
      if (!this.container || !this.renderer) return;
      const width = this.container.clientWidth || 340;
      const height = this.container.clientHeight || 280;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    destroy() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this._onResize) {
        window.removeEventListener('resize', this._onResize);
      }
      this.restoreDefaultToolbars();

      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
      }
    }
  }

  return SimB04NhietDung;
});
