/**
 * MÔ HÌNH 3D VẬT LÝ BÀI 1: CẤU TRÚC CỦA CHẤT & THUYẾT ĐỘNG HỌC PHÂN TỬ
 * Thiết kế hoàn toàn theo đúng chỉ đạo sư phạm & giáo án chuẩn của Thầy Xuân Trường:
 * 
 * 1. MÔ HÌNH 1: CẤU TRÚC 3 THỂ & NHIỆT ĐỘ (MÔ HÌNH ĐỘNG HỌC PHÂN TỬ)
 *    - Thể Rắn, Lỏng, Khí
 *    - 2 Tương tác: 
 *      1) Thay đổi 3 trạng thái vật chất (Rắn / Lỏng / Khí)
 *      2) Thanh kéo nhiệt độ T (100 K -> 600 K): Nhiệt độ cao hạt dao động mạnh hơn (rắn), chuyển động nhanh hơn (lỏng, khí).
 * 
 * 2. MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ Ở 3 THỂ
 *    - 3 Trạng thái Rắn - Lỏng - Khí
 *    - Trực quan hóa lực liên kết phân tử qua MÀU SẮC & ĐƯỜNG LIÊN KẾT:
 *      + Thể Rắn: Lực liên kết RẤT MẠNH (đường liên kết đỏ/cam dày, hạt dao động quanh VTCB cố định).
 *      + Thể Lỏng: Lực liên kết TRUNG BÌNH (yếu hơn rắn, mạnh hơn khí, đường liên kết vàng mảnh đứt rồi nối khi trượt).
 *      + Thể Khí: Lực liên kết RẤT YẾU (bỏ qua, không có đường liên kết, hạt bay tự do chiếm toàn bình).
 * 
 * 3. MÔ HÌNH 3: THỰC NGHIỆM CHUYỂN ĐỘNG BROWN (CHẤT LỎNG & CHẤT KHÍ)
 *    - Sự chuyển động nhiệt của các phân tử môi trường
 *    - 1 Phân tử to hơn hẳn (hạt phấn hoa trong nước, hoặc hạt bụi trong không khí)
 *    - Bị các phân tử nhỏ li ti đâm vào từ mọi phía làm nó chuyển động hỗn loạn lung tung ziczac.
 *    - 2 Tương tác: Đổi môi trường (Nước / Không khí) & Tăng nhiệt độ dung môi.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB01ThuyetDHPT = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimB01ThuyetDHPT {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.isModal = !!options.isModal;

      this.currentSceneIdx = 0; // 0: Cấu trúc 3 thể & Nhiệt độ, 1: Lực liên kết, 2: Thí nghiệm Brown
      this.animId = null;
      this.time = 0;

      // ── BIẾN SỐ MÔ HÌNH 1: CẤU TRÚC 3 THỂ & NHIỆT ĐỘ ──
      this.m1State = 'solid'; // 'solid' | 'liquid' | 'gas'
      this.m1Temp = 300; // Nhiệt độ Kelvin (100 K -> 600 K)

      // ── BIẾN SỐ MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ ──
      this.m2State = 'solid'; // 'solid' | 'liquid' | 'gas'

      // ── BIẾN SỐ MÔ HÌNH 3: THÍ NGHIỆM BROWN ──
      this.m3Medium = 'liquid'; // 'liquid' (phấn hoa trong nước) | 'gas' (hạt bụi trong không khí)
      this.m3Temp = 300; // Nhiệt độ môi trường Brown

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

      // Bảng Chú thích trực quan trực tiếp trên màn hình 3D (Legend Overlay) - Nền trong suốt để không che khuất mô hình
      this.legendOverlay = document.createElement('div');
      this.legendOverlay.className = 'sim-legend-overlay';
      this.legendOverlay.style.cssText = 'position: absolute; top: 8px; left: 8px; background: transparent; border: none; padding: 2px 4px; font-size: 11px; color: #e2e8f0; pointer-events: none; z-index: 20; display: flex; flex-direction: column; gap: 3.5px; text-shadow: 0 1px 4px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.9); text-align: left; max-width: 250px;';
      this.container.appendChild(this.legendOverlay);

      // 4. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 14;
      }

      // 5. Ánh sáng
      const ambient = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      dirLight.position.set(5, 10, 7);
      this.scene.add(dirLight);

      // 6. Xây dựng 3 Phân hệ 3D
      this.buildModel1StructureAndTemp();
      this.buildModel2IntermolecularForces();
      this.buildModel3BrownianMotion();

      // 7. Gắn thanh Tabs chuyển mô hình
      this.buildSubSceneTabs();

      // 8. Chuyển về Mô hình 1 mặc định
      this.switchScene(0);

      // 9. Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      // 10. Vòng lặp Render
      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);
    }

    // ════════════════════════════════════════════════════════════
    // MÔ HÌNH 1: CẤU TRÚC 3 THỂ & NHIỆT ĐỘ (THUYẾT ĐHPT)
    // ════════════════════════════════════════════════════════════
    buildModel1StructureAndTemp() {
      this.groupM1 = new THREE.Group();

      this.boxSizeM1 = 2.6;
      const boxGeo = new THREE.BoxGeometry(this.boxSizeM1, this.boxSizeM1, this.boxSizeM1);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      this.boxEdgesM1 = new THREE.LineSegments(edges, lineMat);
      this.groupM1.add(this.boxEdgesM1);

      this.particlesM1Group = new THREE.Group();
      this.particlesM1 = [];
      this.groupM1.add(this.particlesM1Group);

      this.scene.add(this.groupM1);
      this.rebuildM1Particles();
    }

    rebuildM1Particles() {
      while (this.particlesM1Group.children.length > 0) {
        const obj = this.particlesM1Group.children[0];
        if (obj.geometry) obj.geometry.dispose();
        this.particlesM1Group.remove(obj);
      }
      this.particlesM1 = [];

      const pGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.2
      });

      if (this.m1State === 'solid') {
        // Thể Rắn: Mạng tinh thể lập phương trật tự
        const spacing = 0.46;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              const mesh = new THREE.Mesh(pGeo, pMat.clone());
              const ox = x * spacing;
              const oy = y * spacing;
              const oz = z * spacing;
              mesh.position.set(ox, oy, oz);
              this.particlesM1Group.add(mesh);

              this.particlesM1.push({
                mesh,
                origin: new THREE.Vector3(ox, oy, oz),
                pos: new THREE.Vector3(ox, oy, oz),
                phase: Math.random() * Math.PI * 2
              });
            }
          }
        }
      } else if (this.m1State === 'liquid') {
        // Thể Lỏng: Hạt rơi xuống đáy hộp và trượt hỗn loạn ở sát đáy
        const count = 42;
        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(pGeo, pMat.clone());
          const x = (Math.random() - 0.5) * 2.0;
          const y = -1.18 + Math.random() * 0.42; // Sát đáy hộp từ -1.18 đến -0.76
          const z = (Math.random() - 0.5) * 2.0;
          mesh.position.set(x, y, z);
          this.particlesM1Group.add(mesh);

          this.particlesM1.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: new THREE.Vector3((Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 1.6)
          });
        }
      } else {
        // Thể Khí: Hạt phân tán bay tự do trong toàn bình
        const count = 32;
        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(pGeo, pMat.clone());
          const x = (Math.random() - 0.5) * 2.2;
          const y = (Math.random() - 0.5) * 2.2;
          const z = (Math.random() - 0.5) * 2.2;
          mesh.position.set(x, y, z);
          this.particlesM1Group.add(mesh);

          this.particlesM1.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: new THREE.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
          });
        }
      }
    }

    // ════════════════════════════════════════════════════════════
    // MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ Ở 3 THỂ (CÓ MÀU SẮC TRỰC QUAN)
    // ════════════════════════════════════════════════════════════
    buildModel2IntermolecularForces() {
      this.groupM2 = new THREE.Group();

      this.boxSizeM2 = 2.6;
      const boxGeo = new THREE.BoxGeometry(this.boxSizeM2, this.boxSizeM2, this.boxSizeM2);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.3 });
      this.boxEdgesM2 = new THREE.LineSegments(edges, lineMat);
      this.groupM2.add(this.boxEdgesM2);

      this.particlesM2Group = new THREE.Group();
      this.particlesM2 = [];
      this.groupM2.add(this.particlesM2Group);

      // Nhóm hiển thị đường liên kết lực phân tử
      this.bondsM2Group = new THREE.Group();
      this.groupM2.add(this.bondsM2Group);

      this.scene.add(this.groupM2);
      this.rebuildM2ParticlesAndBonds();
    }

    rebuildM2ParticlesAndBonds() {
      // Dọn dẹp cũ
      while (this.particlesM2Group.children.length > 0) {
        const obj = this.particlesM2Group.children[0];
        if (obj.geometry) obj.geometry.dispose();
        this.particlesM2Group.remove(obj);
      }
      while (this.bondsM2Group.children.length > 0) {
        const obj = this.bondsM2Group.children[0];
        if (obj.geometry) obj.geometry.dispose();
        this.bondsM2Group.remove(obj);
      }
      this.particlesM2 = [];

      const pGeo = new THREE.SphereGeometry(0.13, 16, 16);

      if (this.m2State === 'solid') {
        // THỂ RẮN: LỰC LIÊN KẾT RẤT MẠNH
        // Màu sắc hạt: ĐỎ CAM rực rỡ / Xanh neon phát sáng
        const pMatSolid = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xb91c1c,
          emissiveIntensity: 0.6,
          roughness: 0.2
        });

        const spacing = 0.50;
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              const mesh = new THREE.Mesh(pGeo, pMatSolid);
              const ox = x * spacing;
              const oy = y * spacing;
              const oz = z * spacing;
              mesh.position.set(ox, oy, oz);
              this.particlesM2Group.add(mesh);

              this.particlesM2.push({
                mesh,
                origin: new THREE.Vector3(ox, oy, oz),
                phase: Math.random() * Math.PI * 2
              });
            }
          }
        }

        // Tạo các đường liên kết lực phân tử RẤT MẠNH (MÀU ĐỎ/CAM RỰC RỠ, RẤT DÀY)
        const bondMatSolid = new THREE.LineBasicMaterial({
          color: 0xf87171,
          linewidth: 3,
          transparent: true,
          opacity: 0.85
        });

        for (let i = 0; i < this.particlesM2.length; i++) {
          for (let j = i + 1; j < this.particlesM2.length; j++) {
            const d = this.particlesM2[i].origin.distanceTo(this.particlesM2[j].origin);
            if (Math.abs(d - spacing) < 0.05) {
              const lGeo = new THREE.BufferGeometry().setFromPoints([
                this.particlesM2[i].origin,
                this.particlesM2[j].origin
              ]);
              const bondLine = new THREE.Line(lGeo, bondMatSolid);
              bondLine.userData = { p1: this.particlesM2[i], p2: this.particlesM2[j] };
              this.bondsM2Group.add(bondLine);
            }
          }
        }

      } else if (this.m2State === 'liquid') {
        // THỂ LỎNG: LỰC LIÊN KẾT YẾU HƠN RẮN NHƯNG MẠNH HƠN KHÍ
        // Màu sắc hạt: MÀU VÀNG CAM / HỔ PHÁCH - HẠT NẰM SÁT ĐÁY HỘP
        const pMatLiquid = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.5,
          roughness: 0.3
        });

        const count = 38;
        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(pGeo, pMatLiquid);
          const x = (Math.random() - 0.5) * 2.0;
          const y = -1.18 + Math.random() * 0.42; // Sát đáy hộp từ -1.18 đến -0.76
          const z = (Math.random() - 0.5) * 2.0;
          mesh.position.set(x, y, z);
          this.particlesM2Group.add(mesh);

          this.particlesM2.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: new THREE.Vector3((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 1.5)
          });
        }

      } else {
        // THỂ KHÍ: LỰC LIÊN KẾT RẤT YẾU (BỎ QUA)
        // Màu sắc hạt: MÀU XANH DƯƠNG / TÍM NHẠT (Hạt bay tự do, không liên kết)
        const pMatGas = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4,
          roughness: 0.4
        });

        const count = 28;
        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(pGeo, pMatGas);
          const x = (Math.random() - 0.5) * 2.2;
          const y = (Math.random() - 0.5) * 2.2;
          const z = (Math.random() - 0.5) * 2.2;
          mesh.position.set(x, y, z);
          this.particlesM2Group.add(mesh);

          this.particlesM2.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: new THREE.Vector3((Math.random() - 0.5) * 3.0, (Math.random() - 0.5) * 3.0, (Math.random() - 0.5) * 3.0)
          });
        }
      }
    }

    // ════════════════════════════════════════════════════════════
    // MÔ HÌNH 3: THỰC NGHIỆM CHUYỂN ĐỘNG BROWN TRONG HỘP KÍN 3D
    // ════════════════════════════════════════════════════════════
    buildModel3BrownianMotion() {
      this.groupM3 = new THREE.Group();

      // Hộp chứa 3D giữ 100% các phân tử không bao giờ bay ra ngoài
      this.boxSizeM3 = 2.6;
      const boxGeo = new THREE.BoxGeometry(this.boxSizeM3, this.boxSizeM3, this.boxSizeM3);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
      this.boxEdgesM3 = new THREE.LineSegments(edges, lineMat);
      this.groupM3.add(this.boxEdgesM3);

      // Mặt vách hộp mờ trong suốt
      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.05,
        roughness: 0.2,
        side: THREE.BackSide
      });
      const glassMesh = new THREE.Mesh(boxGeo, glassMat);
      this.groupM3.add(glassMesh);

      // Khối nước trong suốt thể hiện thể lỏng ở nửa dưới hộp (Nước có thể tích xác định, ranh giới rõ ràng)
      const waterVolMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      // Hộp cao 2.6 (từ -1.30 đến +1.30). Nước chiếm từ y = -1.28 đến y = 0.15 (chiều cao 1.43, tâm y = -0.565)
      this.waterVolumeM3 = new THREE.Mesh(new THREE.BoxGeometry(2.56, 1.43, 2.56), waterVolMat);
      this.waterVolumeM3.position.set(0, -0.565, 0);
      this.groupM3.add(this.waterVolumeM3);

      // Mặt thoáng nước ở y = 0.15 (sáng bóng, có viền phát sáng)
      const waterSurfMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        roughness: 0.05,
        metalness: 0.3,
        side: THREE.DoubleSide
      });
      const waterSurfGeo = new THREE.PlaneGeometry(2.56, 2.56);
      this.waterSurfaceM3 = new THREE.Mesh(waterSurfGeo, waterSurfMat);
      this.waterSurfaceM3.rotation.x = -Math.PI / 2;
      this.waterSurfaceM3.position.set(0, 0.15, 0);
      this.groupM3.add(this.waterSurfaceM3);

      const surfEdgesGeo = new THREE.EdgesGeometry(waterSurfGeo);
      const surfLineMat = new THREE.LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.9, linewidth: 2 });
      this.waterSurfaceEdgesM3 = new THREE.LineSegments(surfEdgesGeo, surfLineMat);
      this.waterSurfaceEdgesM3.rotation.x = -Math.PI / 2;
      this.waterSurfaceEdgesM3.position.set(0, 0.15, 0);
      this.groupM3.add(this.waterSurfaceEdgesM3);

      // Phân tử to hơn hẳn: HẠT PHẤN HOA TRONG NƯỚC hoặc HẠT BỤI TRONG KHÔNG KHÍ
      const pGeo = new THREE.SphereGeometry(0.32, 24, 24);
      this.matPollen = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        roughness: 0.3
      });
      this.pollenMeshM3 = new THREE.Mesh(pGeo, this.matPollen);
      this.groupM3.add(this.pollenMeshM3);

      // Vector mũi tên biểu diễn lực va đập tức thời
      this.arrowImpactM3 = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        0.5,
        0xef4444,
        0.18,
        0.08
      );
      this.arrowImpactM3.visible = false;
      this.groupM3.add(this.arrowImpactM3);

      // Vệt quỹ đạo ziczac Brown
      this.maxTrailM3 = 70;
      this.trailM3 = [];
      const trailGeo = new THREE.BufferGeometry();
      const trailPos = new Float32Array(this.maxTrailM3 * 3);
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
      const trailMat = new THREE.LineBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.85, linewidth: 2 });
      this.trailLineM3 = new THREE.Line(trailGeo, trailMat);
      this.groupM3.add(this.trailLineM3);

      // Các hạt phân tử môi trường nhỏ li ti (nước hoặc không khí)
      this.envParticlesGroup = new THREE.Group();
      this.envParticles = [];
      this.groupM3.add(this.envParticlesGroup);

      this.scene.add(this.groupM3);
      this.rebuildM3Environment();
    }

    rebuildM3Environment() {
      while (this.envParticlesGroup.children.length > 0) {
        const obj = this.envParticlesGroup.children[0];
        if (obj.geometry) obj.geometry.dispose();
        this.envParticlesGroup.remove(obj);
      }
      this.envParticles = [];
      this.trailM3 = [];

      const isLiquid = (this.m3Medium === 'liquid');

      // Ẩn/Hiện khối nước và mặt thoáng nước:
      // Thể lỏng (Nước) -> Hiện khối nước trong suốt ở nửa dưới hộp và mặt thoáng ở y = 0.15
      // Thể khí (Không khí) -> Ẩn khối nước, cả hộp rỗng hoàn toàn để phân tử khí bay tự do khắp hộp!
      if (this.waterVolumeM3) this.waterVolumeM3.visible = isLiquid;
      if (this.waterSurfaceM3) this.waterSurfaceM3.visible = isLiquid;
      if (this.waterSurfaceEdgesM3) this.waterSurfaceEdgesM3.visible = isLiquid;

      if (isLiquid) {
        // CHẤT LỎNG (NƯỚC):
        // 1. Hạt to: HẠT PHẤN HOA MÀU VÀNG CAM ÓNG ÁNH, chìm lơ lửng trong nước
        this.pollenMeshM3.material.color.setHex(0xf59e0b);
        this.pollenMeshM3.material.emissive.setHex(0xd97706);
        this.pollenMeshM3.position.set(0, -0.55, 0);

        // 2. Môi trường: PHÂN TỬ NƯỚC DÀY ĐẶC (85 hạt), chỉ nằm DƯỚI MẶT NƯỚC (y <= 0.10)
        const envGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const envMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.5,
          roughness: 0.2
        });

        const count = 85;
        const halfX = 1.15;
        const halfZ = 1.15;
        const yMin = -1.20;
        const yMax = 0.10;

        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(envGeo, envMat);
          let x, y, z;
          do {
            x = (Math.random() - 0.5) * 2 * halfX;
            y = yMin + Math.random() * (yMax - yMin);
            z = (Math.random() - 0.5) * 2 * halfZ;
          } while (Math.sqrt(x * x + (y - (-0.55)) * (y - (-0.55)) + z * z) < 0.42);

          mesh.position.set(x, y, z);
          this.envParticlesGroup.add(mesh);

          const baseSpeed = 1.35;
          const dir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          ).normalize();

          this.envParticles.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: dir.multiplyScalar(baseSpeed),
            baseSpeed
          });
        }
      } else {
        // CHẤT KHÍ (KHÔNG KHÍ / KHÓI BỤI):
        // 1. Hạt to: HẠT BỤI / KHÓI MÀU TRẮNG SÁNG, bay lơ lửng giữa buồng khí rỗng
        this.pollenMeshM3.material.color.setHex(0xffffff);
        this.pollenMeshM3.material.emissive.setHex(0x94a3b8);
        this.pollenMeshM3.position.set(0, 0, 0);

        // 2. Môi trường: PHÂN TỬ KHÔNG KHÍ LOÃNG HƠN RÕ RỆT (40 hạt), bay tự do TOÀN THỂ TÍCH HỘP
        const envGeo = new THREE.SphereGeometry(0.065, 12, 12);
        const envMat = new THREE.MeshStandardMaterial({
          color: 0x93c5fd,
          emissive: 0x3b82f6,
          emissiveIntensity: 0.5,
          roughness: 0.2
        });

        const count = 40;
        const halfBox = this.boxSizeM3 / 2 - 0.12; // ~1.18

        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(envGeo, envMat);
          let x, y, z;
          do {
            x = (Math.random() - 0.5) * 2 * halfBox;
            y = (Math.random() - 0.5) * 2 * halfBox;
            z = (Math.random() - 0.5) * 2 * halfBox;
          } while (Math.sqrt(x * x + y * y + z * z) < 0.45);

          mesh.position.set(x, y, z);
          this.envParticlesGroup.add(mesh);

          const baseSpeed = 2.8; // Chất khí bay nhanh và tự do hơn nhiều
          const dir = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
          ).normalize();

          this.envParticles.push({
            mesh,
            pos: new THREE.Vector3(x, y, z),
            vel: dir.multiplyScalar(baseSpeed),
            baseSpeed
          });
        }
      }
      this.pollenVelM3 = new THREE.Vector3(0, 0, 0);
    }

    // ════════════════════════════════════════════════════════════
    // THANH TABS CHUYỂN 3 MÔ HÌNH CHÍNH XÁC THEO Ý THẦY
    // ════════════════════════════════════════════════════════════
    buildSubSceneTabs() {
      const parentEl = this.container.parentElement;
      const cardEl = this.container.closest('.sim-sidebar-card') || (parentEl && parentEl.classList.contains('sim-sidebar-card') ? parentEl : null);
      const modalEl = this.container.closest('.sim-modal-content');

      const existingInCard = cardEl ? cardEl.querySelector('.sim-subtabs-strip') : null;
      if (existingInCard) existingInCard.remove();
      const existingInModal = modalEl ? modalEl.querySelector('.sim-subtabs-strip') : null;
      if (existingInModal) existingInModal.remove();

      const bar = document.createElement('div');
      bar.className = 'sim-subtabs-strip';

      const tabs = [
        { idx: 0, label: '1. Cấu trúc & T' },
        { idx: 1, label: '2. Lực liên kết' },
        { idx: 2, label: '3. TN Brown' }
      ];

      tabs.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = t.label;
        btn.title = (t.idx === 0) ? 'Mô hình 1: Cấu trúc 3 Thể & Nhiệt độ (Thuyết ĐHPT)' : ((t.idx === 1) ? 'Mô hình 2: Lực liên kết phân tử ở 3 Thể' : 'Mô hình 3: Thí nghiệm Chuyển động Brown');
        btn.className = `sim-subtab-btn ${t.idx === this.currentSceneIdx ? 'active' : ''}`;
        btn.onclick = (e) => {
          e.stopPropagation();
          this.switchScene(t.idx);
        };
        bar.appendChild(btn);
      });

      if (cardEl && this.container.parentNode === cardEl) {
        cardEl.insertBefore(bar, this.container);
      } else if (modalEl && this.container.parentNode) {
        this.container.parentNode.insertBefore(bar, this.container);
      } else {
        bar.style.position = 'absolute';
        bar.style.top = '6px';
        bar.style.left = '50%';
        bar.style.transform = 'translateX(-50%)';
        bar.style.zIndex = '10';
        this.container.style.position = 'relative';
        this.container.appendChild(bar);
      }
      this.subtabsBar = bar;
    }

    switchScene(idx) {
      this.currentSceneIdx = idx;

      // Ẩn/Hiện Groups
      this.groupM1.visible = (idx === 0);
      this.groupM2.visible = (idx === 1);
      this.groupM3.visible = (idx === 2);

      // Cập nhật tab active
      if (this.subtabsBar) {
        const btns = this.subtabsBar.querySelectorAll('.sim-subtab-btn');
        btns.forEach((b, i) => b.classList.toggle('active', i === idx));
      }

      this.resetCamera();
      this.buildContextualControls();
      this.updateHudAndPedagogicalText();
    }

    // ════════════════════════════════════════════════════════════
    // THANH TƯƠNG TÁC CHUYÊN BIỆT THEO ĐÚNG CHỈ ĐẠO CỦA THẦY
    // ════════════════════════════════════════════════════════════
    buildContextualControls() {
      const isModal = this.isModal;
      const toolbar = isModal
        ? document.querySelector('.sim-modal-footer .sim-toolbar')
        : document.querySelector('.sim-sidebar-card .sim-toolbar');

      if (!toolbar) return;
      toolbar.innerHTML = '';

      if (this.currentSceneIdx === 0) {
        // ── MÔ HÌNH 1: CẤU TRÚC 3 THỂ & THANH TRƯỢT NHIỆT ĐỘ ──
        // 1. Nút đổi 3 trạng thái vật chất (Rắn / Lỏng / Khí)
        const btnState = document.createElement('button');
        btnState.type = 'button';
        btnState.className = 'sim-btn';
        btnState.style.padding = '5px 8px';
        btnState.style.fontSize = '12px';
        btnState.style.whiteSpace = 'nowrap';
        const labelsM1 = { solid: '🧊 Thể Rắn', liquid: '💧 Thể Lỏng', gas: '💨 Thể Khí' };
        btnState.innerHTML = labelsM1[this.m1State];
        btnState.title = 'Nhấn để đổi trạng thái Rắn -> Lỏng -> Khí';
        btnState.onclick = () => {
          if (this.m1State === 'solid') this.m1State = 'liquid';
          else if (this.m1State === 'liquid') this.m1State = 'gas';
          else this.m1State = 'solid';
          btnState.innerHTML = labelsM1[this.m1State];
          this.rebuildM1Particles();
          this.updateHudAndPedagogicalText();
        };
        toolbar.appendChild(btnState);

        // 2. Thanh trượt Nhiệt độ T (100 K -> 600 K)
        const tempWrap = document.createElement('div');
        tempWrap.style.cssText = 'flex: 1; display: flex; align-items: center; gap: 6px; background: rgba(15,23,42,0.6); padding: 4px 7px; border-radius: 8px; border: 1px solid var(--line); min-width: 125px;';
        
        const tempIcon = document.createElement('span');
        tempIcon.innerHTML = '🔥';
        tempIcon.style.fontSize = '13px';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '100';
        slider.max = '600';
        slider.step = '25';
        slider.value = String(this.m1Temp);
        slider.style.cssText = 'flex: 1; min-width: 45px; accent-color: var(--blue, #0b84f3); cursor: pointer;';
        
        const tempVal = document.createElement('span');
        tempVal.style.cssText = 'font-size: 11px; font-weight: 800; color: #38bdf8; min-width: 42px; text-align: right; white-space: nowrap;';
        tempVal.textContent = `${this.m1Temp} K`;

        slider.oninput = () => {
          this.m1Temp = parseInt(slider.value, 10);
          tempVal.textContent = `${this.m1Temp} K`;
          if (this.m1Temp > 400) tempVal.style.color = '#f59e0b';
          else if (this.m1Temp < 200) tempVal.style.color = '#93c5fd';
          else tempVal.style.color = '#38bdf8';
          this.updateHudAndPedagogicalText();
        };

        tempWrap.appendChild(tempIcon);
        tempWrap.appendChild(slider);
        tempWrap.appendChild(tempVal);
        toolbar.appendChild(tempWrap);

      } else if (this.currentSceneIdx === 1) {
        // ── MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ Ở 3 THỂ (CÓ MÀU SẮC RÕ RÀNG) ──
        // Nút đổi 3 trạng thái vật chất
        const btnStateM2 = document.createElement('button');
        btnStateM2.type = 'button';
        btnStateM2.className = 'sim-btn';
        const labelsM2 = {
          solid: '🧊 Rắn: Lực RẤT MẠNH',
          liquid: '💧 Lỏng: Lực TRUNG BÌNH',
          gas: '💨 Khí: Lực RẤT YẾU'
        };
        btnStateM2.innerHTML = labelsM2[this.m2State];
        btnStateM2.style.flex = '3';
        btnStateM2.style.fontSize = '12px';
        btnStateM2.onclick = () => {
          if (this.m2State === 'solid') this.m2State = 'liquid';
          else if (this.m2State === 'liquid') this.m2State = 'gas';
          else this.m2State = 'solid';
          btnStateM2.innerHTML = labelsM2[this.m2State];
          this.rebuildM2ParticlesAndBonds();
          this.updateHudAndPedagogicalText();
        };
        toolbar.appendChild(btnStateM2);

      } else {
        // ── MÔ HÌNH 3: THÍ NGHIỆM BROWN (CHẤT LỎNG & KHÍ) ──
        // 1. Nút đổi môi trường (Chất lỏng / Chất khí)
        const btnMedM3 = document.createElement('button');
        btnMedM3.type = 'button';
        btnMedM3.className = 'sim-btn';
        btnMedM3.style.fontSize = '11.5px';
        btnMedM3.style.fontWeight = '600';
        btnMedM3.innerHTML = this.m3Medium === 'liquid' ? '🟡 Hạt phấn hoa (Nước)' : '⚪ Hạt bụi (Không khí)';
        btnMedM3.title = 'Nhấn để chuyển đổi giữa Thí nghiệm trong Nước và trong Không khí';
        btnMedM3.onclick = () => {
          this.m3Medium = (this.m3Medium === 'liquid') ? 'gas' : 'liquid';
          btnMedM3.innerHTML = this.m3Medium === 'liquid' ? '🟡 Hạt phấn hoa (Nước)' : '⚪ Hạt bụi (Không khí)';
          this.rebuildM3Environment();
          this.updateHudAndPedagogicalText();
        };
        toolbar.appendChild(btnMedM3);

        // 2. Nút Tăng/Hạ nhiệt độ môi trường
        const btnTempM3 = document.createElement('button');
        btnTempM3.type = 'button';
        btnTempM3.className = 'sim-btn';
        btnTempM3.style.fontSize = '11.5px';
        btnTempM3.innerHTML = this.m3Temp > 300 ? '❄️ Về 300 K' : '🔥 Tăng 500 K';
        btnTempM3.onclick = () => {
          this.m3Temp = (this.m3Temp > 300) ? 300 : 500;
          btnTempM3.innerHTML = this.m3Temp > 300 ? '❄️ Về 300 K' : '🔥 Tăng 500 K';
          this.updateHudAndPedagogicalText();
        };
        toolbar.appendChild(btnTempM3);
      }

      // Nút Reset góc nhìn chung
      const btnReset = document.createElement('button');
      btnReset.type = 'button';
      btnReset.className = 'sim-btn sim-btn-icon';
      btnReset.title = 'Đặt lại góc nhìn';
      btnReset.innerHTML = '<span>🔄</span>';
      btnReset.onclick = () => this.resetCamera();
      toolbar.appendChild(btnReset);
    }

    // ════════════════════════════════════════════════════════════
    // HOẠT HỌA THEO THỜI GIAN THỰC (ANIMATE LOOP)
    // ════════════════════════════════════════════════════════════
    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this.time += dt;

      if (this.currentSceneIdx === 0) {
        this.animateModel1(dt);
      } else if (this.currentSceneIdx === 1) {
        this.animateModel2(dt);
      } else {
        this.animateModel3(dt);
      }

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    // HOẠT HỌA MÔ HÌNH 1: NHIỆT ĐỘ CÀNG CAO DAO ĐỘNG CÀNG MẠNH, CHUYỂN ĐỘNG CÀNG NHANH
    animateModel1(dt) {
      const speedFactor = Math.sqrt(this.m1Temp / 300); // v tỉ lệ thuận căn bậc hai của T

      for (let i = 0; i < this.particlesM1.length; i++) {
        const p = this.particlesM1[i];

        if (this.m1State === 'solid') {
          // Thể Rắn: Dao động quanh VTCB cố định. T càng cao -> biên độ và tần số càng lớn!
          p.phase += dt * 10 * speedFactor;
          const amp = 0.02 + 0.04 * (this.m1Temp / 300);
          const dx = Math.sin(p.phase) * amp;
          const dy = Math.cos(p.phase * 1.3) * amp;
          const dz = Math.sin(p.phase * 0.7) * amp;
          p.mesh.position.set(p.origin.x + dx, p.origin.y + dy, p.origin.z + dz);

        } else if (this.m1State === 'liquid') {
          // Thể Lỏng: Rơi xuống đáy hộp và trượt hỗn loạn ở sát đáy. T càng cao -> trượt càng nhanh!
          // 1. Trọng lực kéo hạt rơi xuống đáy hộp
          p.vel.y -= 14.0 * dt;

          // 2. Kích động nhiệt ngẫu nhiên theo phương ngang
          p.vel.x += (Math.random() - 0.5) * 5.0 * speedFactor * dt;
          p.vel.z += (Math.random() - 0.5) * 5.0 * speedFactor * dt;

          // Ma sát nhớt nhẹ giữa các phân tử
          const friction = Math.pow(0.96, dt * 60);
          p.vel.x *= friction;
          p.vel.z *= friction;

          p.pos.x += p.vel.x * dt * speedFactor;
          p.pos.y += p.vel.y * dt;
          p.pos.z += p.vel.z * dt * speedFactor;

          // 3. Giữ hạt nằm sát đáy hộp (-1.18 đến -0.72)
          const yFloor = -1.18;
          const ySurface = -0.72;
          if (p.pos.y < yFloor) {
            p.pos.y = yFloor;
            p.vel.y = Math.abs(p.vel.y) * 0.25 + (Math.random() * 0.6 * speedFactor);
          } else if (p.pos.y > ySurface) {
            p.pos.y = ySurface;
            p.vel.y = -Math.abs(p.vel.y) * 0.5;
          }

          // 4. Giữ hạt trong 4 thành bên của đáy hộp
          const bound = 1.15;
          if (Math.abs(p.pos.x) > bound) {
            p.pos.x = Math.sign(p.pos.x) * bound;
            p.vel.x *= -0.7;
          }
          if (Math.abs(p.pos.z) > bound) {
            p.pos.z = Math.sign(p.pos.z) * bound;
            p.vel.z *= -0.7;
          }

          p.mesh.position.copy(p.pos);

        } else {
          // Thể Khí: Bay tự do toàn bình. T càng cao -> vận tốc nhiệt hỗn loạn càng lớn!
          p.pos.addScaledVector(p.vel, dt * 1.2 * speedFactor);
          const bound = 1.15;
          if (Math.abs(p.pos.x) > bound) { p.vel.x *= -1; p.pos.x = Math.sign(p.pos.x) * bound; }
          if (Math.abs(p.pos.y) > bound) { p.vel.y *= -1; p.pos.y = Math.sign(p.pos.y) * bound; }
          if (Math.abs(p.pos.z) > bound) { p.vel.z *= -1; p.pos.z = Math.sign(p.pos.z) * bound; }
          p.mesh.position.copy(p.pos);
        }
      }
    }

    // HOẠT HỌA MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ Ở 3 THỂ
    animateModel2(dt) {
      if (this.m2State === 'solid') {
        // Thể Rắn: Lực liên kết rất mạnh -> Hạt dao động rất nhỏ quanh VTCB cố định
        for (let i = 0; i < this.particlesM2.length; i++) {
          const p = this.particlesM2[i];
          p.phase += dt * 8;
          const amp = 0.02;
          const dx = Math.sin(p.phase) * amp;
          const dy = Math.cos(p.phase * 1.2) * amp;
          const dz = Math.sin(p.phase * 0.8) * amp;
          p.mesh.position.set(p.origin.x + dx, p.origin.y + dy, p.origin.z + dz);
        }

        // Cập nhật các đường liên kết lực phân tử (giữ nối liền giữa các hạt)
        for (let k = 0; k < this.bondsM2Group.children.length; k++) {
          const bondLine = this.bondsM2Group.children[k];
          const posAttr = bondLine.geometry.attributes.position;
          posAttr.setXYZ(0, bondLine.userData.p1.mesh.position.x, bondLine.userData.p1.mesh.position.y, bondLine.userData.p1.mesh.position.z);
          posAttr.setXYZ(1, bondLine.userData.p2.mesh.position.x, bondLine.userData.p2.mesh.position.y, bondLine.userData.p2.mesh.position.z);
          posAttr.needsUpdate = true;
        }

      } else if (this.m2State === 'liquid') {
        // Thể Lỏng: Trọng lực kéo hạt rơi xuống đáy hộp, các hạt trượt qua nhau ở sát đáy hộp
        const yFloor = -1.18;
        const ySurface = -0.72;
        const bound = 1.15;

        for (let i = 0; i < this.particlesM2.length; i++) {
          const p = this.particlesM2[i];
          p.vel.y -= 14.0 * dt;
          p.vel.x += (Math.random() - 0.5) * 4.5 * dt;
          p.vel.z += (Math.random() - 0.5) * 4.5 * dt;

          const friction = Math.pow(0.96, dt * 60);
          p.vel.x *= friction;
          p.vel.z *= friction;

          p.pos.x += p.vel.x * dt;
          p.pos.y += p.vel.y * dt;
          p.pos.z += p.vel.z * dt;

          if (p.pos.y < yFloor) {
            p.pos.y = yFloor;
            p.vel.y = Math.abs(p.vel.y) * 0.25 + Math.random() * 0.5;
          } else if (p.pos.y > ySurface) {
            p.pos.y = ySurface;
            p.vel.y = -Math.abs(p.vel.y) * 0.5;
          }

          if (Math.abs(p.pos.x) > bound) {
            p.pos.x = Math.sign(p.pos.x) * bound;
            p.vel.x *= -0.7;
          }
          if (Math.abs(p.pos.z) > bound) {
            p.pos.z = Math.sign(p.pos.z) * bound;
            p.vel.z *= -0.7;
          }
          p.mesh.position.copy(p.pos);
        }

        // Vẽ động các đường liên kết tạm thời (MÀU VÀNG CAM NHẸ) khi 2 hạt ở gần nhau
        while (this.bondsM2Group.children.length > 0) {
          const b = this.bondsM2Group.children[0];
          b.geometry.dispose();
          this.bondsM2Group.remove(b);
        }
        const bondMatLiquid = new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.55 });
        for (let i = 0; i < this.particlesM2.length; i++) {
          for (let j = i + 1; j < this.particlesM2.length; j++) {
            const dist = this.particlesM2[i].pos.distanceTo(this.particlesM2[j].pos);
            if (dist < 0.55) { // Hai hạt lân cận xuất hiện lực liên kết tạm thời
              const lGeo = new THREE.BufferGeometry().setFromPoints([this.particlesM2[i].pos, this.particlesM2[j].pos]);
              this.bondsM2Group.add(new THREE.Line(lGeo, bondMatLiquid));
            }
          }
        }

      } else {
        // Thể Khí: Lực liên kết hầu như không đáng kể (bỏ qua), hạt bay tự do
        while (this.bondsM2Group.children.length > 0) {
          const b = this.bondsM2Group.children[0];
          b.geometry.dispose();
          this.bondsM2Group.remove(b);
        }
        for (let i = 0; i < this.particlesM2.length; i++) {
          const p = this.particlesM2[i];
          p.pos.addScaledVector(p.vel, dt * 1.5);
          const bound = 1.15;
          if (Math.abs(p.pos.x) > bound) { p.vel.x *= -1; p.pos.x = Math.sign(p.pos.x) * bound; }
          if (Math.abs(p.pos.y) > bound) { p.vel.y *= -1; p.pos.y = Math.sign(p.pos.y) * bound; }
          if (Math.abs(p.pos.z) > bound) { p.vel.z *= -1; p.pos.z = Math.sign(p.pos.z) * bound; }
          p.mesh.position.copy(p.pos);
        }
      }
    }

    // HOẠT HỌA MÔ HÌNH 3: THỰC NGHIỆM CHUYỂN ĐỘNG BROWN TRONG HỘP KÍN 3D
    animateModel3(dt) {
      const isLiquid = (this.m3Medium === 'liquid');
      const tempMult = Math.sqrt(this.m3Temp / 300); // Nhiệt độ môi trường càng cao va đập càng mạnh
      let totalImpulse = new THREE.Vector3(0, 0, 0);

      const pPos = this.pollenMeshM3.position;
      const pRadius = 0.32;
      const envRadius = 0.065;
      const collisionDist = pRadius + envRadius;

      // Biên độ phản xạ: Khác biệt rõ rệt giữa Thể lỏng (chìm dưới mặt nước) và Thể khí (toàn hộp)
      const halfBox = this.boxSizeM3 / 2; // 1.3
      const envBoundX = halfBox - envRadius; // 1.235
      const envBoundZ = halfBox - envRadius; // 1.235
      const envBoundYMin = -halfBox + envRadius; // -1.235
      // Nếu là Nước: phân tử nước chỉ bơi dưới mặt thoáng nước ở y = 0.09
      // Nếu là Không khí: phân tử khí bay tự do khắp toàn bộ chiều cao hộp kín (+1.235)
      const envBoundYMax = isLiquid ? 0.09 : (halfBox - envRadius);

      const pollenBoundX = halfBox - pRadius; // 0.98
      const pollenBoundZ = halfBox - pRadius; // 0.98
      const pollenBoundYMin = -halfBox + pRadius; // -0.98
      // Hạt phấn hoa chìm hoàn toàn trong lòng nước (y <= -0.22)
      // Hạt bụi bay lơ lửng khắp toàn bộ không gian buồng khí (+0.98)
      const pollenBoundYMax = isLiquid ? -0.20 : (halfBox - pRadius);

      // Hiệu ứng sóng lăn tăn nhẹ trên mặt thoáng nước
      if (this.waterSurfaceM3 && isLiquid) {
        const waveY = 0.15 + Math.sin(this.time * 2.8) * 0.006;
        this.waterSurfaceM3.position.y = waveY;
        if (this.waterSurfaceEdgesM3) this.waterSurfaceEdgesM3.position.y = waveY;
      }

      for (let i = 0; i < this.envParticles.length; i++) {
        const m = this.envParticles[i];

        // 1. Cập nhật vị trí phân tử nhỏ li ti
        m.pos.addScaledVector(m.vel, dt * tempMult);

        // 2. Phản xạ đàn hồi: Nước nảy dưới mặt nước & đáy bình; Khí nảy 6 mặt hộp
        if (m.pos.x < -envBoundX) {
          m.pos.x = -envBoundX;
          m.vel.x = Math.abs(m.vel.x);
        } else if (m.pos.x > envBoundX) {
          m.pos.x = envBoundX;
          m.vel.x = -Math.abs(m.vel.x);
        }

        if (m.pos.y < envBoundYMin) {
          m.pos.y = envBoundYMin;
          m.vel.y = Math.abs(m.vel.y);
        } else if (m.pos.y > envBoundYMax) {
          m.pos.y = envBoundYMax;
          m.vel.y = -Math.abs(m.vel.y);
        }

        if (m.pos.z < -envBoundZ) {
          m.pos.z = -envBoundZ;
          m.vel.z = Math.abs(m.vel.z);
        } else if (m.pos.z > envBoundZ) {
          m.pos.z = envBoundZ;
          m.vel.z = -Math.abs(m.vel.z);
        }

        // 3. Va đập cơ học vào HẠT TO (hạt phấn hoa / hạt bụi)
        const diff = m.pos.clone().sub(pPos);
        const dist = diff.length();

        if (dist <= collisionDist && dist > 0.001) {
          const normal = diff.normalize();

          // Phản xạ đàn hồi phân tử nhỏ theo phương pháp tuyến
          const dot = m.vel.dot(normal);
          if (dot < 0) {
            m.vel.sub(normal.clone().multiplyScalar(2 * dot));
          }
          // Đẩy nhẹ phân tử ra bề mặt tiếp xúc
          m.pos.copy(pPos).addScaledVector(normal, collisionDist + 0.005);

          // Truyền xung lực ngược chiều vào hạt to
          const forceScale = (isLiquid ? 0.09 : 0.14) * tempMult;
          totalImpulse.addScaledVector(normal, -forceScale);
        }

        m.mesh.position.copy(m.pos);
      }

      // 4. Cập nhật chuyển động của HẠT TO do các cú va đập từ mọi phía không cân bằng
      if (totalImpulse.lengthSq() > 0.0005) {
        this.pollenVelM3.add(totalImpulse);
        this.arrowImpactM3.position.copy(pPos);
        this.arrowImpactM3.setDirection(totalImpulse.clone().normalize());
        this.arrowImpactM3.setLength(Math.min(totalImpulse.length() * 4, 0.8), 0.16, 0.06);
        this.arrowImpactM3.visible = true;
      } else {
        this.arrowImpactM3.visible = false;
      }

      // Ma sát môi trường cản bớt
      const damping = isLiquid ? Math.pow(0.86, dt * 60) : Math.pow(0.92, dt * 60);
      this.pollenVelM3.multiplyScalar(damping);
      pPos.add(this.pollenVelM3);

      // 5. Giữ hạt to luôn nảy bên trong giới hạn môi trường (Nước: chìm dưới mặt thoáng; Khí: toàn hộp)
      if (pPos.x < -pollenBoundX) { pPos.x = -pollenBoundX; this.pollenVelM3.x = Math.abs(this.pollenVelM3.x) * 0.4; }
      else if (pPos.x > pollenBoundX) { pPos.x = pollenBoundX; this.pollenVelM3.x = -Math.abs(this.pollenVelM3.x) * 0.4; }

      if (pPos.y < pollenBoundYMin) { pPos.y = pollenBoundYMin; this.pollenVelM3.y = Math.abs(this.pollenVelM3.y) * 0.4; }
      else if (pPos.y > pollenBoundYMax) { pPos.y = pollenBoundYMax; this.pollenVelM3.y = -Math.abs(this.pollenVelM3.y) * 0.4; }

      if (pPos.z < -pollenBoundZ) { pPos.z = -pollenBoundZ; this.pollenVelM3.z = Math.abs(this.pollenVelM3.z) * 0.4; }
      else if (pPos.z > pollenBoundZ) { pPos.z = pollenBoundZ; this.pollenVelM3.z = -Math.abs(this.pollenVelM3.z) * 0.4; }

      // 6. Vẽ vệt quỹ đạo ziczac Brown ghi lại đường đi hỗn loạn trong hộp
      if (this.time % 0.08 < 0.02) {
        this.trailM3.push(pPos.clone());
        if (this.trailM3.length > this.maxTrailM3) this.trailM3.shift();

        const posAttr = this.trailLineM3.geometry.attributes.position;
        for (let i = 0; i < this.maxTrailM3; i++) {
          if (i < this.trailM3.length) {
            posAttr.setXYZ(i, this.trailM3[i].x, this.trailM3[i].y, this.trailM3[i].z);
          } else if (this.trailM3.length > 0) {
            const last = this.trailM3[this.trailM3.length - 1];
            posAttr.setXYZ(i, last.x, last.y, last.z);
          }
        }
        posAttr.needsUpdate = true;
      }
    }

    // ════════════════════════════════════════════════════════════
    // CẬP NHẬT HUD & KHUNG GIẢI THÍCH CHUẨN XÁC THEO GIÁO ÁN THẦY
    // ════════════════════════════════════════════════════════════
    updateHudAndPedagogicalText() {
      const isModal = this.isModal;
      const forceEl = document.getElementById(isModal ? 'sim-modal-hud-force' : 'sim-hud-force');
      const subEl = document.getElementById(isModal ? 'sim-modal-hud-sub' : 'sim-hud-sub');
      const tempEl = document.getElementById(isModal ? 'sim-modal-hud-temp' : 'sim-hud-temp');
      const countEl = document.getElementById(isModal ? 'sim-modal-hud-count' : 'sim-hud-count');
      const formulaBox = isModal ? document.getElementById('sim-modal-formula-box') : document.querySelector('.sim-sidebar-card .sim-formula-box');

      if (this.currentSceneIdx === 0) {
        // MÔ HÌNH 1: CẤU TRÚC 3 THỂ & NHIỆT ĐỘ
        const stateName = (this.m1State === 'solid') ? 'Thể Rắn' : ((this.m1State === 'liquid') ? 'Thể Lỏng' : 'Thể Khí');
        const motionDesc = (this.m1State === 'solid')
          ? `Dao động quanh VTCB cố định (Nhiệt độ ${this.m1Temp} K)`
          : ((this.m1State === 'liquid') ? `Trượt hỗn loạn đáy bình (Nhiệt độ ${this.m1Temp} K)` : `Chuyển động tự do hỗn loạn (Nhiệt độ ${this.m1Temp} K)`);

        if (forceEl) forceEl.textContent = `${stateName} — Chuyển động nhiệt`;
        if (subEl) subEl.textContent = motionDesc;
        if (tempEl) {
          tempEl.textContent = `Nhiệt độ T = ${this.m1Temp} K (${this.m1Temp - 273}°C)`;
          tempEl.style.color = (this.m1Temp > 400) ? '#f59e0b' : ((this.m1Temp < 200) ? '#93c5fd' : '#38bdf8');
        }
        if (countEl) countEl.textContent = (this.m1Temp > 350) ? 'Chuyển động NHANH & MẠNH' : 'Chuyển động bình thường';

        if (formulaBox) {
          formulaBox.innerHTML = `
            <div class="sim-formula-tag">1. Thuyết Động học Phân tử Chất:</div>
            <div class="sim-formula-desc">
              • Các chất đều được cấu tạo từ các hạt riêng biệt gọi là <strong>phân tử</strong> (hoặc nguyên tử).<br>
              • Các phân tử <strong>chuyển động không ngừng, hỗn loạn</strong> (gọi là chuyển động nhiệt).<br>
              • <em>Quy luật nhiệt độ</em>: <strong>Nhiệt độ càng cao $\\implies$ các phân tử dao động càng mạnh (thể rắn) và chuyển động càng nhanh (thể lỏng, thể khí)!</strong> Hãy kéo thanh nhiệt độ để kiểm chứng trực tiếp.
            </div>
          `;
          if (typeof renderMath === 'function') renderMath(formulaBox);
        }

        if (this.legendOverlay) {
          const sName = (this.m1State === 'solid') ? 'Rắn' : ((this.m1State === 'liquid') ? 'Lỏng' : 'Khí');
          this.legendOverlay.innerHTML = `
            <div style="font-weight:700; color:#38bdf8; margin-bottom:2px; font-size:11px; display:flex; align-items:center; gap:4px;">
              <span>📌</span><span>CHÚ THÍCH (THUYẾT ĐHPT)</span>
            </div>
            <div>🔵 <b>Phân tử chất</b> (${sName})</div>
            <div>🔥 <b>Nhiệt độ:</b> ${this.m1Temp} K (${this.m1Temp > 350 ? 'Nhanh/mạnh' : 'Bình thường'})</div>
          `;
        }

      } else if (this.currentSceneIdx === 1) {
        // MÔ HÌNH 2: LỰC LIÊN KẾT PHÂN TỬ Ở 3 THỂ
        let forceRank = 'Lực liên kết: RẤT MẠNH (Màu Đỏ/Cam)';
        let structureDesc = 'Khoảng cách rất nhỏ -> Phân tử dao động quanh VTCB cố định';
        let colorTag = '#ef4444';

        if (this.m2State === 'liquid') {
          forceRank = 'Lực liên kết: TRUNG BÌNH (Màu Vàng Cam)';
          structureDesc = 'Yếu hơn rắn, mạnh hơn khí -> VTCB có thể dịch chuyển';
          colorTag = '#f59e0b';
        } else if (this.m2State === 'gas') {
          forceRank = 'Lực liên kết: RẤT YẾU (Bỏ qua)';
          structureDesc = 'Khoảng cách rất lớn -> Chuyển động tự do hỗn loạn';
          colorTag = '#38bdf8';
        }

        if (forceEl) {
          forceEl.textContent = forceRank;
          forceEl.style.color = colorTag;
        }
        if (subEl) subEl.textContent = structureDesc;
        if (tempEl) {
          tempEl.textContent = (this.m2State === 'solid') ? 'Có hình dạng & thể tích riêng' : ((this.m2State === 'liquid') ? 'Có thể tích riêng, không có hình dạng riêng' : 'Không có hình dạng & thể tích riêng');
          tempEl.style.color = colorTag;
        }
        if (countEl) countEl.textContent = (this.m2State === 'solid') ? 'Trật tự tinh thể khít' : ((this.m2State === 'liquid') ? 'Lỏng lẻo trượt qua nhau' : 'Phân tán toàn bộ bình');

        if (formulaBox) {
          formulaBox.innerHTML = `
            <div class="sim-formula-tag">2. Cấu trúc của Chất ở Ba Thể & Lực Liên kết:</div>
            <div class="sim-formula-desc">
              * <strong>Khoảng cách giữa các phân tử càng lớn thì lực liên kết giữa chúng càng yếu</strong>.<br>
              * <strong>Các phân tử sắp xếp có trật tự thì lực liên kết giữa chúng càng mạnh</strong>.<br>
              • <strong>Thể rắn</strong>: Khoảng cách rất nhỏ, <em>lực liên kết rất mạnh</em> (màu đỏ rực rỡ), phân tử dao động quanh VTCB cố định $\\implies$ có hình dạng và thể tích riêng xác định.<br>
              • <strong>Thể lỏng</strong>: Khoảng cách lớn hơn một chút, <em>lực liên kết yếu hơn rắn nhưng mạnh hơn khí</em> (màu vàng cam), VTCB có thể dịch chuyển $\\implies$ có thể tích riêng nhưng không có hình dạng riêng.<br>
              • <strong>Thể khí</strong>: Khoảng cách rất lớn, <em>lực liên kết gần như không đáng kể</em>, phân tử chuyển động tự do hỗn loạn $\\implies$ không có hình dạng, không có thể tích riêng.
            </div>
          `;
          if (typeof renderMath === 'function') renderMath(formulaBox);
        }

        if (this.legendOverlay) {
          const sName2 = (this.m2State === 'solid') ? 'Rắn' : ((this.m2State === 'liquid') ? 'Lỏng' : 'Khí');
          const fDot = (this.m2State === 'solid') ? '🔴' : ((this.m2State === 'liquid') ? '🟡' : '🔵');
          const fText = (this.m2State === 'solid') ? 'Rất mạnh' : ((this.m2State === 'liquid') ? 'Trung bình' : 'Rất yếu');
          this.legendOverlay.innerHTML = `
            <div style="font-weight:700; color:#38bdf8; margin-bottom:2px; font-size:11px; display:flex; align-items:center; gap:4px;">
              <span>📌</span><span>CHÚ THÍCH (LỰC LIÊN KẾT)</span>
            </div>
            <div>🔵 <b>Phân tử chất</b> (${sName2})</div>
            <div>${fDot} <b>Lực liên kết:</b> ${fText}</div>
          `;
        }

      } else {
        // MÔ HÌNH 3: THỰC NGHIỆM CHUYỂN ĐỘNG BROWN
        const isLiquid = (this.m3Medium === 'liquid');
        const particleName = isLiquid ? 'Hạt phấn hoa (trong Nước)' : 'Hạt bụi / khói (trong Không khí)';
        const solventName = isLiquid ? 'các phân tử nước' : 'các phân tử không khí';

        if (forceEl) forceEl.textContent = 'Hạt to chuyển động ziczac hỗn loạn';
        if (subEl) subEl.textContent = `Do bị ${solventName} va đập không cân bằng`;
        if (tempEl) {
          tempEl.textContent = `Môi trường: ${isLiquid ? 'Chất lỏng (Nước)' : 'Chất khí (Không khí)'} · T = ${this.m3Temp} K`;
          tempEl.style.color = isLiquid ? '#38bdf8' : '#93c5fd';
        }
        if (countEl) countEl.textContent = `${particleName} (Màu to ở giữa)`;

        if (formulaBox) {
          formulaBox.innerHTML = `
            <div class="sim-formula-tag">3. Bằng chứng Thực nghiệm — Chuyển động Brown:</div>
            <div class="sim-formula-desc">
              • Chuyển động hỗn loạn không ngừng của <strong>các hạt nhỏ/to hơn lơ lửng</strong> (như hạt phấn hoa trong nước, hạt bụi trong không khí) là <strong>bằng chứng gián tiếp</strong> về chuyển động hỗn loạn không ngừng của các phân tử chất lỏng và chất khí.<br>
              • Hạt to ở giữa không tự bơi mà liên tục bị vô số phân tử môi trường nhỏ li ti chuyển động nhiệt đâm vào từ mọi phía không cân bằng làm nó bị xô đẩy đổi hướng ziczac liên tục.<br>
              • <em>Ảnh hưởng nhiệt độ</em>: Khi tăng nhiệt độ, các phân tử môi trường chuyển động nhanh hơn $\\implies$ va đập mãnh liệt hơn $\\implies$ hạt to chuyển động hỗn loạn càng mạnh!
            </div>
          `;
          if (typeof renderMath === 'function') renderMath(formulaBox);
        }

        if (this.legendOverlay) {
          if (isLiquid) {
            this.legendOverlay.innerHTML = `
              <div style="font-weight:700; color:#38bdf8; margin-bottom:3px; font-size:11px; display:flex; align-items:center; gap:4px;">
                <span>📌</span><span>CHÚ THÍCH THÍ NGHIỆM BROWN</span>
              </div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:13px;">🟡</span><span><b style="color:#fbbf24;">Hạt phấn hoa</b> (lơ lửng trong nước)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">🔵</span><span><b style="color:#67e8f9;">Phân tử nước</b> (dưới mặt nước)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">🌊</span><span style="color:#38bdf8;">Mặt thoáng nước (ranh giới thể lỏng)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">〰️</span><span style="color:#fde047;">Đường vàng: Quỹ đạo ziczac</span></div>
            `;
          } else {
            this.legendOverlay.innerHTML = `
              <div style="font-weight:700; color:#38bdf8; margin-bottom:3px; font-size:11px; display:flex; align-items:center; gap:4px;">
                <span>📌</span><span>CHÚ THÍCH THÍ NGHIỆM BROWN</span>
              </div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:13px;">⚪</span><span><b style="color:#ffffff;">Hạt bụi / khói</b> (lơ lửng trong khí)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">🔵</span><span><b style="color:#93c5fd;">Phân tử không khí</b> (loãng, bay toàn hộp)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">📦</span><span style="color:#cbd5e1;">Buồng khí kín (toàn bộ bình)</span></div>
              <div style="display:flex; align-items:center; gap:5px;"><span style="font-size:11px;">〰️</span><span style="color:#fde047;">Đường vàng: Quỹ đạo ziczac</span></div>
            `;
          }
        }
      }
    }

    resetCamera() {
      if (this.currentSceneIdx === 0) {
        this.camera.position.set(0, 1.8, 5.2);
      } else if (this.currentSceneIdx === 1) {
        this.camera.position.set(0, 1.6, 5.2);
      } else {
        this.camera.position.set(0, 1.8, 5.2);
      }
      this.camera.lookAt(0, 0, 0);
      if (this.controls) this.controls.target.set(0, 0, 0);
    }

    handleResize() {
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
      if (this.resizeObserver) this.resizeObserver.disconnect();
      if (this.controls) this.controls.dispose();

      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });

      if (this.subtabsBar && this.subtabsBar.parentNode) {
        this.subtabsBar.parentNode.removeChild(this.subtabsBar);
      }
      if (this.legendOverlay && this.legendOverlay.parentNode) {
        this.legendOverlay.parentNode.removeChild(this.legendOverlay);
      }
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }

  return SimB01ThuyetDHPT;
});
