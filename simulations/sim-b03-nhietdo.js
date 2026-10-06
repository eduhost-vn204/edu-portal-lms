/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 3: NHIỆT ĐỘ – THANG NHIỆT ĐỘ – NHIỆT KẾ
 * Mã bài học: Bfb85fde44802
 * Thiết kế hoàn toàn theo đúng chỉ đạo sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: BẢN CHẤT NHIỆT ĐỘ & ĐỘ KHÔNG TUYỆT ĐỐI (0 KELVIN)
 *    - Nhiệt độ đặc trưng cho mức độ chuyển động nhiệt hỗn loạn (động năng trung bình Ed) của phân tử.
 *    - 0 K (Độ không tuyệt đối): Phân tử DỪNG CHUYỂN ĐỘNG HOÀN TOÀN (Ed = 0, v = 0).
 *    - Khi T tăng (0 K -> 600 K): Tốc độ phân tử tăng theo căn bậc hai của T (v ~ sqrt(T)).
 *    - Màu sắc phân tử biến đổi từ xanh băng tuyết (0 K) -> vàng (300 K) -> đỏ rực lửa (600 K).
 *    - Có vector vận tốc v và vệt theo dõi chuyển động hỗn loạn của hạt vi mô.
 * 
 * 2. MÔ HÌNH 2: SO SÁNH 3 THANG NHIỆT ĐỘ (CELSIUS - KELVIN - FAHRENHEIT)
 *    - 3 cột nhiệt kế khổng lồ đặt song song trong không gian 3D: Celsius (°C), Kelvin (K), Fahrenheit (°F).
 *    - Cột chất lỏng dâng hạ đồng bộ theo nhiệt độ.
 *    - Dải đo phát sáng kết nối mốc tương đương:
 *      + Độ không tuyệt đối: 0 K = -273,15°C = -459,67°F
 *      + Điểm gặp nhau đặc biệt: -40°C = -40°F = 233,15 K
 *      + Nước đá đang tan: 0°C = 273,15 K = 32°F
 *      + Thân nhiệt bình thường: 37°C = 310,15 K = 98,6°F
 *      + Nước sôi: 100°C = 373,15 K = 212°F
 *    - Nổi bật: Khoảng chia delta T (K) = delta t (°C), còn Fahrenheit có khoảng chia 180°.
 * 
 * 3. MÔ HÌNH 3: NHIỆT KẾ CHẤT LỎNG & NGUYÊN TẮC HOẠT ĐỘNG (SỰ NỞ VÌ NHIỆT)
 *    - Nhiệt kế thủy tinh nhúng trong cốc thí nghiệm chứa môi trường nhiệt độ (0°C đến 100°C).
 *    - Cột chất lỏng dâng lên hạ xuống theo nhiệt độ.
 *    - Khung kính lúp vi mô (Micro Magnifier) phóng to bên trong bầu nhiệt kế:
 *      Học sinh thấy rõ: Khi nhận nhiệt, các phân tử dao động mạnh hơn, khoảng cách trung bình tăng
 *      -> thể tích nở ra -> chất lỏng dâng lên trong ống mao dẫn!
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB03NhietDo = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB03NhietDo {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Động năng & 0 K, 1: So sánh 3 Thang đo, 2: Nhiệt kế & Sự nở vì nhiệt
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: ĐỘNG NĂNG & 0 KELVIN ──
      this.m1TempK = 300; // Kelvin (0 đến 600 K)
      this.m1ShowVectors = true;
      this.m1ShowTrail = true;
      this.m1Particles = [];
      this.m1TrailPoints = [];
      this.m1BoxSize = 3.6;

      // ── BIẾN SỐ MÔ HÌNH 2: SO SÁNH 3 THANG ĐO ──
      this.m2TempC = 25; // Celsius (-273.15 đến 150 °C)
      this.m2DisplayTempC = 25;

      // ── BIẾN SỐ MÔ HÌNH 3: NHIỆT KẾ CHẤT LỎNG & SỰ NỞ VÌ NHIỆT ──
      this.m3TempC = 25; // 0 đến 100 °C
      this.m3ShowMicro = true;
      this.m3MicroParticles = [];

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
      this.legendOverlay.style.cssText = 'position: absolute; top: 40px; left: 8px; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.08); padding: 4px 6px; border-radius: 6px; font-size: 10.5px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 2px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); text-align: left; max-width: 240px;';
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

      this.buildModel1ZeroKelvin();
      this.buildModel2ScaleCompare();
      this.buildModel3ThermometerExpansion();

      // Khởi tạo hiển thị tab đầu tiên
      this.groupM1.visible = true;
      this.groupM2.visible = false;
      this.groupM3.visible = false;

      // 7. Gắn Tabs & Controls
      this.buildSubSceneTabs();
      this.hideDefaultToolbars();
      this.updateLegendAndContextControls();
      this.updateHudStats();

      // 8. Event Resize & Animation Loop
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
        // Mô hình 1: Buồng vi mô 3D
        this.camera.position.set(0, 1.0, 6.2);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.target.set(0, 0, 0);
          this.controls.update();
        }
      } else if (this.currentSceneIdx === 1) {
        // Mô hình 2: 3 Cột nhiệt kế song song
        this.camera.position.set(0, 0.2, 6.8);
        this.camera.lookAt(0, 0, 0);
        if (this.controls) {
          this.controls.target.set(0, 0, 0);
          this.controls.update();
        }
      } else {
        // Mô hình 3: Nhiệt kế & Kính lúp vi mô
        this.camera.position.set(0.1, 0.2, 6.4);
        this.camera.lookAt(0.1, 0, 0);
        if (this.controls) {
          this.controls.target.set(0.1, 0, 0);
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
          { name: '1. Động năng & 0 Kelvin', title: 'Bản chất nhiệt độ & Độ không tuyệt đối' },
          { name: '2. So sánh 3 Thang đo', title: 'Thang đo Celsius - Kelvin - Fahrenheit' },
          { name: '3. Nhiệt kế & Sự nở vì nhiệt', title: 'Nguyên tắc hoạt động của nhiệt kế chất lỏng' }
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

      this.resetCamera();
      this.updateLegendAndContextControls();
      this.updateHudStats();
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 1: BẢN CHẤT NHIỆT ĐỘ & 0 KELVIN (ĐỘ KHÔNG TUYỆT ĐỐI)
    // ─────────────────────────────────────────────────────────────
    buildModel1ZeroKelvin() {
      this.groupM1.clear();
      this.m1Particles = [];
      this.m1TrailPoints = [];

      const S = this.m1BoxSize; // 3.6
      const halfS = S / 2;

      // 1. Khung hộp lập phương vi mô bán trong suốt
      const boxGeom = new THREE.BoxGeometry(S, S, S);
      const boxEdges = new THREE.EdgesGeometry(boxGeom);
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, linewidth: 2 });
      const wireframeBox = new THREE.LineSegments(boxEdges, edgeMat);
      this.groupM1.add(wireframeBox);

      // Mặt sàn và thành hộp kính
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.18,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5
      });
      const boxMesh = new THREE.Mesh(boxGeom, glassMat);
      this.groupM1.add(boxMesh);

      // 2. Tạo tập hợp phân tử vi mô (60 hạt)
      const particleCount = 55;
      const sphereGeom = new THREE.SphereGeometry(0.09, 16, 16);

      for (let i = 0; i < particleCount; i++) {
        const isTarget = (i === 0); // Hạt tiêu điểm để theo dõi vệt
        const mat = new THREE.MeshStandardMaterial({
          color: isTarget ? 0xf59e0b : 0x38bdf8,
          roughness: 0.2,
          metalness: 0.5,
          emissive: isTarget ? 0xf59e0b : 0x0284c7,
          emissiveIntensity: isTarget ? 0.6 : 0.2
        });

        const mesh = new THREE.Mesh(sphereGeom, mat);
        // Vị trí ngẫu nhiên trong hộp
        mesh.position.set(
          (Math.random() - 0.5) * (S - 0.4),
          (Math.random() - 0.5) * (S - 0.4),
          (Math.random() - 0.5) * (S - 0.4)
        );

        // Vector vận tốc cơ sở (hướng ngẫu nhiên)
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();

        // Mũi tên vector vận tốc
        const arrowDir = dir.clone();
        const arrowLength = 0.25;
        const arrowColor = isTarget ? 0xffea00 : 0x38bdf8;
        const arrow = new THREE.ArrowHelper(arrowDir, new THREE.Vector3(0, 0, 0), arrowLength, arrowColor, 0.08, 0.05);
        arrow.visible = this.m1ShowVectors;
        this.groupM1.add(arrow);

        this.m1Particles.push({
          mesh: mesh,
          dir: dir,
          arrow: arrow,
          isTarget: isTarget,
          baseSpeed: 0.02 + Math.random() * 0.02
        });

        this.groupM1.add(mesh);
      }

      // 3. Đường vệt theo dõi hạt tiêu điểm (Trail)
      const maxTrail = 80;
      const trailGeom = new THREE.BufferGeometry();
      const trailPositions = new Float32Array(maxTrail * 3);
      trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      const trailMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85, linewidth: 2 });
      this.m1TrailLine = new THREE.Line(trailGeom, trailMat);
      this.groupM1.add(this.m1TrailLine);

      // Áp dụng nhiệt độ hiện tại
      this.updateModel1TemperatureVisuals();
    }

    updateModel1TemperatureVisuals() {
      // Tính toán màu sắc hạt theo T:
      // 0 K: 0x38bdf8 (cyan/băng), 300 K: 0xfef08a (vàng nhạt), 600 K: 0xef4444 (đỏ rực)
      let r, g, b;
      const factor = Math.min(1.0, Math.max(0.0, this.m1TempK / 600));

      if (this.m1TempK === 0) {
        r = 0.22; g = 0.74; b = 0.97; // 0x38bdf8 băng buốt
      } else if (factor < 0.5) {
        // 0 -> 300K: Xanh -> Vàng nhạt
        const t = factor / 0.5;
        r = 0.22 + t * (0.95 - 0.22);
        g = 0.74 + t * (0.90 - 0.74);
        b = 0.97 - t * (0.97 - 0.40);
      } else {
        // 300 -> 600K: Vàng -> Đỏ rực
        const t = (factor - 0.5) / 0.5;
        r = 0.95 + t * (0.98 - 0.95);
        g = 0.90 - t * (0.90 - 0.20);
        b = 0.40 - t * 0.35;
      }

      const pColor = new THREE.Color(r, g, b);

      this.m1Particles.forEach(p => {
        if (!p.isTarget) {
          p.mesh.material.color.copy(pColor);
          p.mesh.material.emissive.copy(pColor).multiplyScalar(this.m1TempK === 0 ? 0.1 : 0.35);
          p.arrow.setColor(pColor);
        }
      });
    }

    animateModel1(dt) {
      if (!this.groupM1.visible) return;

      const S = this.m1BoxSize;
      const halfS = (S / 2) - 0.12;

      // Vận tốc tỷ lệ với căn bậc 2 của T: v ~ sqrt(T)
      // Tại T = 0 K: v = 0 (hạt đứng yên hoàn toàn 100%)
      const speedScale = this.m1TempK === 0 ? 0 : Math.sqrt(this.m1TempK / 300) * 1.0;

      this.m1Particles.forEach(p => {
        if (this.m1TempK > 0) {
          const moveStep = p.baseSpeed * speedScale * (dt / 16.6);

          p.mesh.position.x += p.dir.x * moveStep;
          p.mesh.position.y += p.dir.y * moveStep;
          p.mesh.position.z += p.dir.z * moveStep;

          // Va chạm với 6 mặt hộp vi mô
          if (Math.abs(p.mesh.position.x) > halfS) {
            p.dir.x *= -1;
            p.mesh.position.x = Math.sign(p.mesh.position.x) * halfS;
          }
          if (Math.abs(p.mesh.position.y) > halfS) {
            p.dir.y *= -1;
            p.mesh.position.y = Math.sign(p.mesh.position.y) * halfS;
          }
          if (Math.abs(p.mesh.position.z) > halfS) {
            p.dir.z *= -1;
            p.mesh.position.z = Math.sign(p.mesh.position.z) * halfS;
          }
        }

        // Cập nhật vị trí và độ dài vector vận tốc
        if (p.arrow) {
          p.arrow.position.copy(p.mesh.position);
          if (this.m1TempK === 0 || !this.m1ShowVectors) {
            p.arrow.visible = false;
          } else {
            p.arrow.visible = true;
            p.arrow.setDirection(p.dir);
            const len = Math.max(0.12, Math.min(0.55, 0.25 * speedScale));
            p.arrow.setLength(len, len * 0.35, len * 0.22);
          }
        }

        // Nếu là hạt tiêu điểm, ghi lại vết chuyển động
        if (p.isTarget && this.m1ShowTrail && this.m1TrailLine) {
          if (this.m1TempK > 0) {
            this.m1TrailPoints.push(p.mesh.position.clone());
            if (this.m1TrailPoints.length > 70) {
              this.m1TrailPoints.shift();
            }
          } else {
            this.m1TrailPoints = [p.mesh.position.clone()];
          }

          const posAttr = this.m1TrailLine.geometry.attributes.position;
          const pts = this.m1TrailPoints;
          for (let i = 0; i < 80; i++) {
            if (i < pts.length) {
              posAttr.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
            } else if (pts.length > 0) {
              const last = pts[pts.length - 1];
              posAttr.setXYZ(i, last.x, last.y, last.z);
            } else {
              posAttr.setXYZ(i, 0, 0, 0);
            }
          }
          posAttr.needsUpdate = true;
          this.m1TrailLine.visible = (this.m1TempK > 0);
        }
      });
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 2: SO SÁNH 3 THANG NHIỆT ĐỘ (CELSIUS - KELVIN - FAHRENHEIT)
    // ─────────────────────────────────────────────────────────────
    buildModel2ScaleCompare() {
      this.groupM2.clear();

      // Cấu hình 3 cột nhiệt kế:
      // X: -1.75 (Celsius), 0 (Kelvin), +1.75 (Fahrenheit)
      const columnPositions = [
        { name: 'Celsius', unit: '°C', x: -1.75, color: 0x38bdf8 },
        { name: 'Kelvin', unit: 'K', x: 0, color: 0x10b981 },
        { name: 'Fahrenheit', unit: '°F', x: 1.75, color: 0xf59e0b }
      ];

      this.m2Columns = [];
      const colHeight = 4.2;
      const colRadius = 0.16;
      const bulbRadius = 0.32;

      // Bệ đỡ phía dưới
      const baseGeom = new THREE.BoxGeometry(4.8, 0.2, 1.2);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.8 });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.position.y = -2.3;
      this.groupM2.add(baseMesh);

      columnPositions.forEach((col, idx) => {
        const colGroup = new THREE.Group();
        colGroup.position.x = col.x;

        // 1. Bầu thủy tinh bên dưới
        const bulbGeom = new THREE.SphereGeometry(bulbRadius, 24, 24);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.9,
          opacity: 0.35,
          transparent: true,
          roughness: 0.1,
          ior: 1.5
        });
        const bulbGlass = new THREE.Mesh(bulbGeom, glassMat);
        bulbGlass.position.y = -2.0;
        colGroup.add(bulbGlass);

        // Bầu chất lỏng đỏ bên trong
        const bulbLiquidMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          roughness: 0.2,
          emissive: 0xd97706,
          emissiveIntensity: 0.35
        });
        const bulbLiquid = new THREE.Mesh(new THREE.SphereGeometry(bulbRadius * 0.85, 20, 20), bulbLiquidMat);
        bulbLiquid.position.y = -2.0;
        colGroup.add(bulbLiquid);

        // 2. Ống mao dẫn thủy tinh thẳng đứng
        const tubeGeom = new THREE.CylinderGeometry(colRadius, colRadius, colHeight, 20, 1, true);
        const tubeGlass = new THREE.Mesh(tubeGeom, glassMat);
        tubeGlass.position.y = 0.1;
        colGroup.add(tubeGlass);

        // Nắp đỉnh bo tròn
        const topCap = new THREE.Mesh(new THREE.SphereGeometry(colRadius, 16, 16), glassMat);
        topCap.position.y = 0.1 + colHeight / 2;
        colGroup.add(topCap);

        // 3. Cột chất lỏng đỏ dâng bên trong ống
        // Dùng Cylinder với pivot đáy tại y = -2.0
        const liquidGeom = new THREE.CylinderGeometry(colRadius * 0.72, colRadius * 0.72, 1, 16);
        liquidGeom.translate(0, 0.5, 0); // Dời tâm về đáy cylinder
        const liquidMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          roughness: 0.2,
          emissive: 0xef4444,
          emissiveIntensity: 0.4
        });
        const liquidMesh = new THREE.Mesh(liquidGeom, liquidMat);
        liquidMesh.position.y = -2.0;
        colGroup.add(liquidMesh);

        // 4. Bảng nhãn tên thang đo ở trên cùng
        const labelCanvas = document.createElement('canvas');
        labelCanvas.width = 256;
        labelCanvas.height = 128;
        const ctx = labelCanvas.getContext('2d');
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 256, 128);
        ctx.strokeStyle = idx === 0 ? '#38bdf8' : (idx === 1 ? '#10b981' : '#f59e0b');
        ctx.lineWidth = 6;
        ctx.strokeRect(4, 4, 248, 120);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(col.name, 128, 52);
        ctx.fillStyle = idx === 0 ? '#38bdf8' : (idx === 1 ? '#10b981' : '#f59e0b');
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText(col.unit, 128, 102);

        const labelTex = new THREE.CanvasTexture(labelCanvas);
        const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), labelMat);
        labelMesh.position.set(0, 2.65, 0);
        colGroup.add(labelMesh);

        // 5. Thước vạch chia độ bên cạnh ống (Backplate)
        const plateGeom = new THREE.PlaneGeometry(0.7, colHeight + 0.2);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
        const plate = new THREE.Mesh(plateGeom, plateMat);
        plate.position.set(-0.35, 0.1, -0.05);
        colGroup.add(plate);

        // Vạch chia độ chuẩn
        this.buildScaleTicks(colGroup, idx, colHeight);

        this.m2Columns.push({
          group: colGroup,
          liquidMesh: liquidMesh,
          type: col.name
        });

        this.groupM2.add(colGroup);
      });

      // 6. Đường dóng ngang phát sáng nối 3 cột (Đánh dấu nhiệt độ hiện tại)
      const lineGeom = new THREE.BufferGeometry();
      const linePositions = new Float32Array([-2.5, 0, 0.2, 2.5, 0, 0.2]);
      lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 3, transparent: true, opacity: 0.95 });
      this.m2IndicatorLine = new THREE.Line(lineGeom, lineMat);
      this.groupM2.add(this.m2IndicatorLine);

      // Điểm hạt sáng chạy theo đường dóng ngang
      const dotGeom = new THREE.SphereGeometry(0.06, 12, 12);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      this.m2Dots = [];
      [-1.75, 0, 1.75].forEach(x => {
        const d = new THREE.Mesh(dotGeom, dotMat);
        d.position.set(x, 0, 0.25);
        this.groupM2.add(d);
        this.m2Dots.push(d);
      });

      this.updateModel2ColumnsVisual();
    }

    buildScaleTicks(parentGroup, typeIdx, totalH) {
      // typeIdx: 0 (Celsius), 1 (Kelvin), 2 (Fahrenheit)
      // Mốc chuẩn từ đáy (y = -1.9 ứng với -273°C / 0 K / -460°F)
      // đến đỉnh (y = 2.0 ứng với 150°C / 423 K / 302°F)
      const tickCanvas = document.createElement('canvas');
      tickCanvas.width = 128;
      tickCanvas.height = 512;
      const ctx = tickCanvas.getContext('2d');
      ctx.clearRect(0, 0, 128, 512);

      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'right';

      // Các mốc chính hiển thị trên thước:
      // Định nghĩa hàm tính tỷ lệ chiều cao [0, 1] cho nhiệt độ Celsius tC
      const getNormY = (tC) => {
        // dải từ -273.15 đến +120°C
        return (tC - (-273.15)) / (120 - (-273.15));
      };

      const milestones = [
        { tC: 100, labelC: '100°', labelK: '373K', labelF: '212°' },
        { tC: 37, labelC: '37°', labelK: '310K', labelF: '98.6°' },
        { tC: 0, labelC: '0°', labelK: '273K', labelF: '32°' },
        { tC: -40, labelC: '-40°', labelK: '233K', labelF: '-40°' },
        { tC: -273.15, labelC: '-273°', labelK: '0K', labelF: '-460°' }
      ];

      milestones.forEach(m => {
        const ny = getNormY(m.tC);
        const canvasY = 512 - (ny * 480 + 16); // invert y
        ctx.beginPath();
        ctx.moveTo(85, canvasY);
        ctx.lineTo(125, canvasY);
        ctx.stroke();

        let txt = typeIdx === 0 ? m.labelC : (typeIdx === 1 ? m.labelK : m.labelF);
        ctx.fillText(txt, 80, canvasY + 7);
      });

      const tickTex = new THREE.CanvasTexture(tickCanvas);
      const tickMat = new THREE.MeshBasicMaterial({ map: tickTex, transparent: true });
      const tickMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, totalH), tickMat);
      tickMesh.position.set(-0.35, 0.1, 0.01);
      parentGroup.add(tickMesh);
    }

    updateModel2ColumnsVisual() {
      // Chiều cao chất lỏng dâng từ y = -2.0 đến max y = 2.0 (khoảng 4.0 đơn vị)
      // Phạm vi tC: -273.15°C (0 K) đến +120°C
      const tMin = -273.15;
      const tMax = 120.0;
      const ratio = Math.max(0.01, Math.min(1.0, (this.m2TempC - tMin) / (tMax - tMin)));

      const liquidHeight = ratio * 4.0;
      const topY = -2.0 + liquidHeight;

      if (this.m2Columns) {
        this.m2Columns.forEach(col => {
          if (col.liquidMesh) {
            col.liquidMesh.scale.y = liquidHeight;
          }
        });
      }

      // Cập nhật đường dóng ngang phát sáng
      if (this.m2IndicatorLine) {
        this.m2IndicatorLine.position.y = topY;
      }
      if (this.m2Dots) {
        this.m2Dots.forEach(d => {
          d.position.y = topY;
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // MÔ HÌNH 3: NHIỆT KẾ CHẤT LỎNG & NGUYÊN TẮC NỞ VÌ NHIỆT
    // ─────────────────────────────────────────────────────────────
    buildModel3ThermometerExpansion() {
      this.groupM3.clear();
      this.m3MicroParticles = [];

      // 1. Cốc thí nghiệm (Beaker) chứa môi trường đo
      const beakerGeom = new THREE.CylinderGeometry(1.15, 1.05, 2.2, 32, 1, true);
      const beakerGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0x93c5fd,
        transmission: 0.88,
        opacity: 0.3,
        transparent: true,
        roughness: 0.1,
        thickness: 0.3
      });
      const beaker = new THREE.Mesh(beakerGeom, beakerGlassMat);
      beaker.position.set(-1.15, -1.0, 0);
      this.groupM3.add(beaker);

      // Đáy cốc
      const beakerBottom = new THREE.Mesh(new THREE.CircleGeometry(1.05, 32), beakerGlassMat);
      beakerBottom.rotation.x = Math.PI / 2;
      beakerBottom.position.set(-1.15, -2.1, 0);
      this.groupM3.add(beakerBottom);

      // Nước trong cốc thí nghiệm
      const waterGeom = new THREE.CylinderGeometry(1.1, 1.0, 1.8, 32);
      this.m3WaterMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.2
      });
      this.m3WaterMesh = new THREE.Mesh(waterGeom, this.m3WaterMat);
      this.m3WaterMesh.position.set(-1.15, -1.2, 0);
      this.groupM3.add(this.m3WaterMesh);

      // 2. Nhiệt kế thủy tinh cắm vào cốc
      const thermoGroup = new THREE.Group();
      thermoGroup.position.set(-1.15, 0, 0);

      // Bầu nhiệt kế
      const bulbGeom = new THREE.SphereGeometry(0.32, 24, 24);
      const thermoGlassMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 0.35,
        transparent: true,
        roughness: 0.05
      });
      const thermoBulb = new THREE.Mesh(bulbGeom, thermoGlassMat);
      thermoBulb.position.y = -1.6;
      thermoGroup.add(thermoBulb);

      // Bầu chất lỏng màu đỏ rực
      const bulbLiquidMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xd97706,
        emissiveIntensity: 0.4
      });
      const bulbLiquid = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20), bulbLiquidMat);
      bulbLiquid.position.y = -1.6;
      thermoGroup.add(bulbLiquid);

      // Thân ống mao dẫn thủy tinh thẳng đứng
      const stemH = 3.8;
      const stemGeom = new THREE.CylinderGeometry(0.12, 0.12, stemH, 20, 1, true);
      const stemMesh = new THREE.Mesh(stemGeom, thermoGlassMat);
      stemMesh.position.y = 0.3;
      thermoGroup.add(stemMesh);

      // Cột chất lỏng đỏ dâng trong ống mao dẫn
      const columnGeom = new THREE.CylinderGeometry(0.065, 0.065, 1, 16);
      columnGeom.translate(0, 0.5, 0); // Đáy cylinder tại 0
      const columnMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xef4444,
        emissiveIntensity: 0.5
      });
      this.m3StemLiquid = new THREE.Mesh(columnGeom, columnMat);
      this.m3StemLiquid.position.y = -1.6;
      thermoGroup.add(this.m3StemLiquid);

      // Thước chia độ gắn trên thân nhiệt kế
      const scaleCanvas = document.createElement('canvas');
      scaleCanvas.width = 128;
      scaleCanvas.height = 512;
      const sCtx = scaleCanvas.getContext('2d');
      sCtx.clearRect(0, 0, 128, 512);
      sCtx.fillStyle = '#ffffff';
      sCtx.strokeStyle = '#e2e8f0';
      sCtx.lineWidth = 3;
      sCtx.font = 'bold 22px sans-serif';
      sCtx.textAlign = 'right';

      for (let t = 0; t <= 100; t += 20) {
        const cy = 512 - ((t / 100) * 440 + 36);
        sCtx.beginPath();
        sCtx.moveTo(70, cy);
        sCtx.lineTo(110, cy);
        sCtx.stroke();
        sCtx.fillText(t + '°', 65, cy + 8);
      }

      const scaleTex = new THREE.CanvasTexture(scaleCanvas);
      const scaleMat = new THREE.MeshBasicMaterial({ map: scaleTex, transparent: true });
      const scaleMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.45, stemH), scaleMat);
      scaleMesh.position.set(0.24, 0.3, 0);
      thermoGroup.add(scaleMesh);

      this.groupM3.add(thermoGroup);

      // 3. VÙNG KÍNH LÚP VI MÔ (MICRO MAGNIFIER LENS)
      // Đặt ở bên phải (x = 1.35) phóng to các phân tử trong bầu nhiệt kế
      this.m3MicroGroup = new THREE.Group();
      this.m3MicroGroup.position.set(1.35, 0.2, 0);

      // Khung viền kính lúp tròn neon
      const ringGeom = new THREE.TorusGeometry(1.15, 0.06, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      this.m3MicroGroup.add(ringMesh);

      // Nền kính tròn mờ bên trong kính lúp
      const lensGlassGeom = new THREE.CircleGeometry(1.14, 48);
      const lensGlassMat = new THREE.MeshBasicMaterial({
        color: 0x0f172a,
        transparent: true,
        opacity: 0.75
      });
      const lensGlass = new THREE.Mesh(lensGlassGeom, lensGlassMat);
      lensGlass.position.z = -0.05;
      this.m3MicroGroup.add(lensGlass);

      // Đường dóng kết nối từ bầu nhiệt kế sang kính lúp
      const connectGeom = new THREE.BufferGeometry();
      const connectPts = new Float32Array([-1.15, -1.6, 0, 0.25, 0.1, 0]);
      connectGeom.setAttribute('position', new THREE.BufferAttribute(connectPts, 3));
      const connectLine = new THREE.Line(connectGeom, new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.1,
        gapSize: 0.05,
        transparent: true,
        opacity: 0.6
      }));
      connectLine.computeLineDistances();
      this.groupM3.add(connectLine);

      // Bảng nhãn trên đỉnh kính lúp
      const lensLabelCanvas = document.createElement('canvas');
      lensLabelCanvas.width = 256;
      lensLabelCanvas.height = 64;
      const lCtx = lensLabelCanvas.getContext('2d');
      lCtx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      lCtx.fillRect(0, 0, 256, 64);
      lCtx.fillStyle = '#38bdf8';
      lCtx.font = 'bold 24px sans-serif';
      lCtx.textAlign = 'center';
      lCtx.fillText('🔬 VI MÔ BẦU NHIỆT KẾ', 128, 42);

      const lensLabelTex = new THREE.CanvasTexture(lensLabelCanvas);
      const lensLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.38), new THREE.MeshBasicMaterial({ map: lensLabelTex, transparent: true }));
      lensLabelMesh.position.set(0, 1.35, 0.05);
      this.m3MicroGroup.add(lensLabelMesh);

      // 4. Các phân tử chất lỏng bên trong kính lúp (36 hạt)
      // Khoảng cách r dãn nở theo nhiệt độ: r = r0 * (1 + beta * T)
      const pCount = 36;
      const microPGeom = new THREE.SphereGeometry(0.08, 16, 16);
      const rows = 6;
      const cols = 6;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0xef4444,
            roughness: 0.3,
            metalness: 0.4,
            emissive: 0xd97706,
            emissiveIntensity: 0.3
          });
          const mesh = new THREE.Mesh(microPGeom, mat);
          this.m3MicroGroup.add(mesh);

          this.m3MicroParticles.push({
            mesh: mesh,
            baseRow: r - (rows - 1) / 2,
            baseCol: c - (cols - 1) / 2,
            phase: Math.random() * Math.PI * 2
          });
        }
      }

      this.groupM3.add(this.m3MicroGroup);

      this.updateModel3ThermometerVisual();
    }

    updateModel3ThermometerVisual() {
      // Chiều cao chất lỏng trong mao dẫn: từ 0.5 (ở 0°C) đến 3.5 (ở 100°C)
      const norm = Math.max(0, Math.min(1.0, this.m3TempC / 100));
      const stemHeight = 0.4 + norm * 3.1;

      if (this.m3StemLiquid) {
        this.m3StemLiquid.scale.y = stemHeight;
      }

      // Màu nước trong cốc: 0°C (xanh dương lạnh) -> 100°C (cam nóng)
      if (this.m3WaterMat) {
        const r = 0.22 + norm * (0.95 - 0.22);
        const g = 0.74 - norm * (0.74 - 0.30);
        const b = 0.97 - norm * 0.75;
        this.m3WaterMat.color.setRGB(r, g, b);
      }
    }

    animateModel3(dt) {
      if (!this.groupM3.visible) return;

      const norm = Math.max(0, Math.min(1.0, this.m3TempC / 100));
      // Khoảng cách cơ sở dãn nở theo nhiệt độ:
      // Ở 0°C: d = 0.22 (sít nhau, thể tích nhỏ)
      // Ở 100°C: d = 0.34 (dãn cách rộng ra, nở vì nhiệt!)
      const spacing = 0.22 + norm * 0.13;
      // Biên độ dao động nhiệt tăng theo nhiệt độ:
      const jitterAmp = 0.015 + norm * 0.06;

      this.m3MicroParticles.forEach(p => {
        const timeOffset = this.time * (3 + norm * 8) + p.phase;
        const jx = Math.sin(timeOffset) * jitterAmp;
        const jy = Math.cos(timeOffset * 1.3) * jitterAmp;

        p.mesh.position.x = p.baseCol * spacing + jx;
        p.mesh.position.y = p.baseRow * spacing + jy;
        p.mesh.position.z = Math.sin(timeOffset * 0.8) * (jitterAmp * 0.5);

        // Màu sắc phân tử trong bầu nhiệt kế đổi dần khi nóng
        const r = 0.9 + norm * 0.1;
        const g = 0.25 + norm * 0.35;
        const b = 0.25 - norm * 0.2;
        p.mesh.material.color.setRGB(r, g, b);
      });
    }

    // ─────────────────────────────────────────────────────────────
    // CẬP NHẬT HUD & CHÚ THÍCH TRONG SUỐT (LEGEND OVERLAY)
    // ─────────────────────────────────────────────────────────────
    updateLegend() {
      if (!this.legendOverlay) return;

      if (this.currentSceneIdx === 0) {
        // Tab 1: Động năng & 0 Kelvin
        const tK = this.m1TempK;
        const tC = (tK - 273.15).toFixed(1);
        const edPercent = ((tK / 600) * 100).toFixed(0);

        let noteState = '';
        if (tK === 0) {
          noteState = '<b style="color:#38bdf8;">Độ không tuyệt đối (0 K)</b>: Phân tử đứng yên hoàn toàn (v = 0, Eđ = 0)';
        } else if (tK <= 100) {
          noteState = '<b style="color:#67e8f9;">Nhiệt độ cực thấp</b>: Chuyển động nhiệt rất chậm';
        } else if (tK <= 350) {
          noteState = '<b style="color:#fef08a;">Nhiệt độ phòng</b>: Chuyển động nhiệt hỗn loạn liên tục';
        } else {
          noteState = '<b style="color:#ef4444;">Nhiệt độ cao</b>: Va chạm kịch liệt, động năng lớn';
        }

        this.legendOverlay.innerHTML = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">❄️ BẢN CHẤT NHIỆT ĐỘ & ĐỘNG NĂNG</div>
          <div>• Nhiệt độ tuyệt đối: <b style="color:#fbbf24;">T = ${tK} K</b> (${tC}°C)</div>
          <div>• Động năng trung bình: <b style="color:#f97316;">Ēđ = ³/₂ k T</b> (~${edPercent}%)</div>
          <div>• ${noteState}</div>
          <div style="font-size:10px; color:#94a3b8; font-style:italic;">*Mũi tên chỉ vector vận tốc v⃗, vệt vàng là quỹ đạo 1 hạt tiêu điểm.</div>
        `;
      } else if (this.currentSceneIdx === 1) {
        // Tab 2: So sánh 3 Thang đo
        const tC = this.m2TempC;
        const tK = (tC + 273.15).toFixed(2);
        const tF = (1.8 * tC + 32).toFixed(2);

        let highlightText = '';
        if (Math.abs(tC - (-273.15)) < 0.2) {
          highlightText = '<b style="color:#38bdf8;">Độ không tuyệt đối</b>: 0 K = -273,15°C = -459,67°F';
        } else if (Math.abs(tC - (-40)) < 0.2) {
          highlightText = '<b style="color:#facc15;">Điểm gặp nhau đặc biệt</b>: -40°C = -40°F (hay gặp trong đề thi!)';
        } else if (Math.abs(tC - 0) < 0.2) {
          highlightText = '<b style="color:#38bdf8;">Nước đá đang tan</b>: 0°C = 273,15 K = 32°F';
        } else if (Math.abs(tC - 37) < 0.2) {
          highlightText = '<b style="color:#10b981;">Thân nhiệt bình thường</b>: 37°C = 310,15 K = 98,6°F';
        } else if (Math.abs(tC - 100) < 0.2) {
          highlightText = '<b style="color:#ef4444;">Nước sôi (1 atm)</b>: 100°C = 373,15 K = 212°F';
        } else {
          highlightText = '• Độ biến thiên: <b style="color:#10b981;">ΔT(K) = Δt(°C)</b> (cùng độ chia)';
        }

        this.legendOverlay.innerHTML = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">📏 SO SÁNH 3 THANG NHIỆT ĐỘ</div>
          <div>• Celsius: <b style="color:#38bdf8;">${tC}°C</b> | Kelvin: <b style="color:#10b981;">${tK} K</b> | Fahrenheit: <b style="color:#f59e0b;">${tF}°F</b></div>
          <div>${highlightText}</div>
          <div style="font-size:10px; color:#94a3b8; font-style:italic;">*Khoảng chia °F là 180° giữa đá tan & nước sôi, trong khi °C và K là 100°.</div>
        `;
      } else {
        // Tab 3: Nhiệt kế & Sự nở vì nhiệt
        const tC = this.m3TempC;
        this.legendOverlay.innerHTML = `
          <div style="font-weight:700; color:#38bdf8; font-size:12px;">🌡️ NHIỆT KẾ & SỰ NỞ VÌ NHIỆT</div>
          <div>• Nhiệt độ đo: <b style="color:#ef4444;">t = ${tC}°C</b></div>
          <div>• Nguyên lý: Bầu nhận nhiệt → Phân tử dao động xa nhau → V chất lỏng nở → Cột dâng cao</div>
          <div style="font-size:10px; color:#94a3b8; font-style:italic;">*Kính lúp vi mô bên phải mô phỏng trực tiếp các phân tử chất lỏng trong bầu nhiệt kế dãn nở.</div>
        `;
      }
    }

    updateHudStats() {
      // Cập nhật thẻ HUD nếu có trên trang
      const hud1 = document.querySelector('#sim-hud-stat1') || document.querySelector('.sim-hud-stat1');
      const hud2 = document.querySelector('#sim-hud-stat2') || document.querySelector('.sim-hud-stat2');
      if (this.currentSceneIdx === 0) {
        if (hud1) hud1.textContent = `T = ${this.m1TempK} K (${(this.m1TempK - 273.15).toFixed(1)}°C)`;
        if (hud2) hud2.textContent = this.m1TempK === 0 ? '❄️ Độ không tuyệt đối' : 'Chuyển động nhiệt';
      } else if (this.currentSceneIdx === 1) {
        if (hud1) hud1.textContent = `${this.m2TempC}°C = ${(this.m2TempC + 273.15).toFixed(1)} K`;
        if (hud2) hud2.textContent = `${(1.8 * this.m2TempC + 32).toFixed(1)}°F`;
      } else {
        if (hud1) hud1.textContent = `t = ${this.m3TempC}°C`;
        if (hud2) hud2.textContent = 'Nhiệt kế chất lỏng';
      }
    }

    // ─────────────────────────────────────────────────────────────
    // RENDER CONTROLS RIÊNG BIỆT CHO TỪNG MÔ HÌNH
    // ─────────────────────────────────────────────────────────────
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

    updateLegendAndContextControls() {
      this.updateLegend();
      this.renderContextControls();
    }

    renderContextControls() {
      const ctrlBox = this.getControlsContainer();
      if (!ctrlBox) return;
      ctrlBox.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // ── CONTROLS MÔ HÌNH 1: ĐỘNG NĂNG & 0 KELVIN ──
        // Hàng nút mốc nhanh: 0 K, 77 K, 273 K, 300 K, 373 K, 600 K
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:3px; width:100%; box-sizing:border-box; flex-wrap:wrap; justify-content:center;';

        const presets = [
          { label: '❄️ 0 K (Tuyệt đối)', k: 0 },
          { label: '🧪 77 K (Nitơ)', k: 77 },
          { label: '🧊 273 K (Đá tan)', k: 273 },
          { label: '🏠 300 K (Phòng)', k: 300 },
          { label: '♨️ 373 K (Sôi)', k: 373 },
          { label: '🔥 600 K (Nóng)', k: 600 }
        ];

        presets.forEach(p => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-btn' + (this.m1TempK === p.k ? ' active' : '');
          btn.style.cssText = 'flex:1; min-width:85px; padding:5px 2px; font-size:10.5px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; ' + (this.m1TempK === p.k ? 'background:#0284c7; color:#fff; border:1px solid #38bdf8;' : 'background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);');
          btn.textContent = p.label;
          btn.onclick = () => {
            this.m1TempK = p.k;
            this.updateModel1TemperatureVisuals();
            this.updateLegend();
            this.updateHudStats();
            this.renderContextControls();
          };
          rowBtns.appendChild(btn);
        });
        ctrlBox.appendChild(rowBtns);

        // Hàng thanh trượt nhiệt độ K (0 -> 600 K)
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%; padding:2px 4px; box-sizing:border-box;';

        const sLabel = document.createElement('span');
        sLabel.style.cssText = 'font-size:11px; font-weight:600; color:#94a3b8; white-space:nowrap;';
        sLabel.innerHTML = `Nhiệt độ T: <b style="color:#fbbf24;">${this.m1TempK} K</b> (${(this.m1TempK - 273.15).toFixed(1)}°C)`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '600';
        slider.step = '5';
        slider.value = this.m1TempK;
        slider.style.cssText = 'flex:1; cursor:pointer; accent-color:#0284c7;';
        slider.oninput = (e) => {
          this.m1TempK = parseInt(e.target.value, 10);
          sLabel.innerHTML = `Nhiệt độ T: <b style="color:#fbbf24;">${this.m1TempK} K</b> (${(this.m1TempK - 273.15).toFixed(1)}°C)`;
          this.updateModel1TemperatureVisuals();
          this.updateLegend();
          this.updateHudStats();
        };

        rowSlider.appendChild(slider);
        rowSlider.appendChild(sLabel);
        ctrlBox.appendChild(rowSlider);

        // Hàng tùy chọn bật/tắt Vector & Vệt
        const rowToggles = document.createElement('div');
        rowToggles.style.cssText = 'display:flex; gap:12px; font-size:11px; color:#cbd5e1;';

        const chkVecLabel = document.createElement('label');
        chkVecLabel.style.cssText = 'display:flex; align-items:center; gap:4px; cursor:pointer;';
        const chkVec = document.createElement('input');
        chkVec.type = 'checkbox';
        chkVec.checked = this.m1ShowVectors;
        chkVec.onchange = (e) => {
          this.m1ShowVectors = e.target.checked;
          this.m1Particles.forEach(p => {
            if (p.arrow) p.arrow.visible = (this.m1ShowVectors && this.m1TempK > 0);
          });
        };
        chkVecLabel.appendChild(chkVec);
        chkVecLabel.appendChild(document.createTextNode('Hiện Vector vận tốc v⃗'));
        rowToggles.appendChild(chkVecLabel);

        const chkTrailLabel = document.createElement('label');
        chkTrailLabel.style.cssText = 'display:flex; align-items:center; gap:4px; cursor:pointer;';
        const chkTrail = document.createElement('input');
        chkTrail.type = 'checkbox';
        chkTrail.checked = this.m1ShowTrail;
        chkTrail.onchange = (e) => {
          this.m1ShowTrail = e.target.checked;
          if (this.m1TrailLine) this.m1TrailLine.visible = this.m1ShowTrail;
        };
        chkTrailLabel.appendChild(chkTrail);
        chkTrailLabel.appendChild(document.createTextNode('Vệt theo dõi hạt vi mô'));
        rowToggles.appendChild(chkTrailLabel);

        ctrlBox.appendChild(rowToggles);

      } else if (this.currentSceneIdx === 1) {
        // ── CONTROLS MÔ HÌNH 2: SO SÁNH 3 THANG ĐO ──
        // Hàng 5 nút mốc nhiệt độ quan trọng
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:3px; width:100%; box-sizing:border-box; flex-wrap:wrap; justify-content:center;';

        const scalePresets = [
          { label: '❄️ 0 K (Độ không)', c: -273.15 },
          { label: '🎯 -40° (Gặp nhau)', c: -40 },
          { label: '🧊 0°C (Đá tan)', c: 0 },
          { label: '🌡️ 37°C (Thân nhiệt)', c: 37 },
          { label: '♨️ 100°C (Sôi)', c: 100 }
        ];

        scalePresets.forEach(p => {
          const isAct = Math.abs(this.m2TempC - p.c) < 0.2;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-btn' + (isAct ? ' active' : '');
          btn.style.cssText = 'flex:1; min-width:85px; padding:5px 2px; font-size:10.5px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; ' + (isAct ? 'background:#059669; color:#fff; border:1px solid #10b981;' : 'background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);');
          btn.textContent = p.label;
          btn.onclick = () => {
            this.m2TempC = p.c;
            this.updateModel2ColumnsVisual();
            this.updateLegend();
            this.updateHudStats();
            this.renderContextControls();
          };
          rowBtns.appendChild(btn);
        });
        ctrlBox.appendChild(rowBtns);

        // Hàng slider nhiệt độ Celsius (-273.15 -> 120°C)
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%; padding:2px 4px; box-sizing:border-box;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '-273.15';
        slider.max = '120';
        slider.step = '1';
        slider.value = this.m2TempC;
        slider.style.cssText = 'flex:1; cursor:pointer; accent-color:#059669;';

        const sLabel = document.createElement('span');
        sLabel.style.cssText = 'font-size:11px; font-weight:600; color:#94a3b8; white-space:nowrap;';
        sLabel.innerHTML = `t: <b style="color:#38bdf8;">${this.m2TempC}°C</b>`;

        slider.oninput = (e) => {
          this.m2TempC = parseFloat(e.target.value);
          sLabel.innerHTML = `t: <b style="color:#38bdf8;">${this.m2TempC}°C</b>`;
          this.updateModel2ColumnsVisual();
          this.updateLegend();
          this.updateHudStats();
          this.updateCardsM2(ctrlBox);
        };

        rowSlider.appendChild(slider);
        rowSlider.appendChild(sLabel);
        ctrlBox.appendChild(rowSlider);

        // 3 ô thẻ hiển thị giá trị và công thức chuyển đổi
        const cardsRow = document.createElement('div');
        cardsRow.id = 'sim-m2-cards-row';
        cardsRow.style.cssText = 'display:flex; gap:6px; width:100%; box-sizing:border-box;';
        ctrlBox.appendChild(cardsRow);
        this.updateCardsM2(ctrlBox);

      } else {
        // ── CONTROLS MÔ HÌNH 3: NHIỆT KẾ & SỰ NỞ VÌ NHIỆT ──
        // 4 nút môi trường cốc đo: 0°C, 25°C, 50°C, 100°C
        const rowBtns = document.createElement('div');
        rowBtns.style.cssText = 'display:flex; gap:4px; width:100%; box-sizing:border-box; justify-content:center;';

        const envs = [
          { label: '🧊 Đá lạnh (0°C)', c: 0 },
          { label: '💧 Phòng (25°C)', c: 25 },
          { label: '☕ Nước ấm (50°C)', c: 50 },
          { label: '♨️ Nước sôi (100°C)', c: 100 }
        ];

        envs.forEach(env => {
          const isAct = Math.abs(this.m3TempC - env.c) < 1;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'sim-btn' + (isAct ? ' active' : '');
          btn.style.cssText = 'flex:1; padding:6px 2px; font-size:11px; font-weight:600; text-align:center; border-radius:6px; cursor:pointer; ' + (isAct ? 'background:#ea580c; color:#fff; border:1px solid #f97316;' : 'background:rgba(30,41,59,0.7); color:#cbd5e1; border:1px solid rgba(255,255,255,0.1);');
          btn.textContent = env.label;
          btn.onclick = () => {
            this.m3TempC = env.c;
            this.updateModel3ThermometerVisual();
            this.updateLegend();
            this.updateHudStats();
            this.renderContextControls();
          };
          rowBtns.appendChild(btn);
        });
        ctrlBox.appendChild(rowBtns);

        // Hàng slider nhiệt độ cốc (0 -> 100°C)
        const rowSlider = document.createElement('div');
        rowSlider.style.cssText = 'display:flex; align-items:center; gap:8px; width:100%; padding:2px 4px; box-sizing:border-box;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.step = '1';
        slider.value = this.m3TempC;
        slider.style.cssText = 'flex:1; cursor:pointer; accent-color:#ea580c;';

        const sLabel = document.createElement('span');
        sLabel.style.cssText = 'font-size:11px; font-weight:600; color:#94a3b8; white-space:nowrap;';
        sLabel.innerHTML = `Nhiệt độ cốc: <b style="color:#ef4444;">${this.m3TempC}°C</b>`;

        slider.oninput = (e) => {
          this.m3TempC = parseInt(e.target.value, 10);
          sLabel.innerHTML = `Nhiệt độ cốc: <b style="color:#ef4444;">${this.m3TempC}°C</b>`;
          this.updateModel3ThermometerVisual();
          this.updateLegend();
          this.updateHudStats();
        };

        rowSlider.appendChild(slider);
        rowSlider.appendChild(sLabel);
        ctrlBox.appendChild(rowSlider);
      }
    }

    updateCardsM2(ctrlBox) {
      const cardsRow = ctrlBox.querySelector('#sim-m2-cards-row');
      if (!cardsRow) return;

      const tC = this.m2TempC;
      const tK = (tC + 273.15).toFixed(2);
      const tF = (1.8 * tC + 32).toFixed(2);

      cardsRow.innerHTML = `
        <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid #38bdf8; border-radius:6px; padding:4px; text-align:center;">
          <div style="font-size:10px; color:#94a3b8;">Celsius</div>
          <div style="font-size:13px; font-weight:700; color:#38bdf8;">${tC}°C</div>
          <div style="font-size:9.5px; color:#64748b;">Mốc: 0°C & 100°C</div>
        </div>
        <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid #10b981; border-radius:6px; padding:4px; text-align:center;">
          <div style="font-size:10px; color:#94a3b8;">Kelvin (T = t + 273,15)</div>
          <div style="font-size:13px; font-weight:700; color:#10b981;">${tK} K</div>
          <div style="font-size:9.5px; color:#64748b;">ΔT = Δt (cùng độ chia)</div>
        </div>
        <div style="flex:1; background:rgba(15,23,42,0.8); border:1px solid #f59e0b; border-radius:6px; padding:4px; text-align:center;">
          <div style="font-size:10px; color:#94a3b8;">Fahrenheit (1,8·t + 32)</div>
          <div style="font-size:13px; font-weight:700; color:#f59e0b;">${tF}°F</div>
          <div style="font-size:9.5px; color:#64748b;">Khoảng chia 180°</div>
        </div>
      `;
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

  return SimB03NhietDo;
});
