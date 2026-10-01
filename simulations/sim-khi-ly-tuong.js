/**
 * MÔ HÌNH 3D: KHÍ LÍ TƯỞNG & CÁC ĐẲNG QUÁ TRÌNH (CHƯƠNG 2)
 * Hỗ trợ các chế độ:
 * - 'boyle': Đẳng nhiệt (T = const, nén/nhả piston => p thay đổi)
 * - 'charles': Đẳng áp (p = const, tăng nhiệt => piston dãn nở thể tích V)
 * - 'gaylussac': Đẳng tích (V = const, tăng nhiệt => áp suất p tăng vọt)
 * - 'general': Mô hình động học phân tử & phương trình trạng thái pV = nRT
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimKhiLyTuong = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimKhiLyTuong {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.mode = options.mode || 'general'; // 'boyle' | 'charles' | 'gaylussac' | 'general'
      this.onUpdate = options.onUpdate || null;
      this.onCollision = options.onCollision || null;

      // Trạng thái nhiệt động học
      this.T = options.initialT || 300; // Kelvin
      this.baseHeight = 2.4;
      this.currentHeight = 2.4; // Chiều cao buồng khí (đại diện cho thể tích V)
      this.minHeight = 1.2;
      this.maxHeight = 3.6;
      this.pistonTargetY = 2.4;

      this.isSlowMo = false;
      this.isPistonCompressed = false;
      this.isHeating = false;
      this.totalCollisions = 0;
      this.animId = null;

      this.init();
    }

    init() {
      const width = this.container.clientWidth || 340;
      const height = this.container.clientHeight || 240;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0f1d);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.resetCamera();

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);

      // 4. OrbitControls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
      }

      // 5. Ánh sáng
      const ambient = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      dirLight.position.set(5, 10, 7);
      this.scene.add(dirLight);
      const pointLight = new THREE.PointLight(0xf59e0b, 0.8, 10);
      pointLight.position.set(0, -1.5, 0);
      this.scene.add(pointLight);
      this.heatLight = pointLight;

      // 6. Dựng xilanh và Piston
      this.buildCylinderAndPiston();

      // 7. Dựng đồng hồ áp kế (Manometer)
      this.buildPressureGauge();

      // 8. Tạo hệ hạt phân tử
      this.buildMolecules();

      // 9. Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      // 10. Vòng lặp Render
      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);
    }

    buildCylinderAndPiston() {
      this.chamberRadius = 1.4;

      // Vỏ xilanh thủy tinh trong suốt
      const cylGeo = new THREE.CylinderGeometry(this.chamberRadius, this.chamberRadius, 4.0, 32, 1, true);
      const cylMat = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.18,
        roughness: 0.1,
        transmission: 0.8,
        thickness: 0.5,
        side: THREE.DoubleSide
      });
      this.cylinderMesh = new THREE.Mesh(cylGeo, cylMat);
      this.cylinderMesh.position.y = 0;
      this.scene.add(this.cylinderMesh);

      // Đáy xilanh bằng kim loại
      const baseGeo = new THREE.CylinderGeometry(this.chamberRadius + 0.1, this.chamberRadius + 0.1, 0.2, 32);
      const metalMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.8,
        roughness: 0.3
      });
      this.baseMesh = new THREE.Mesh(baseGeo, metalMat);
      this.baseMesh.position.y = -2.0;
      this.scene.add(this.baseMesh);

      // Piston chuyển động
      this.pistonGroup = new THREE.Group();

      const pistonHeadGeo = new THREE.CylinderGeometry(this.chamberRadius - 0.02, this.chamberRadius - 0.02, 0.25, 32);
      const pistonMat = new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        metalness: 0.6,
        roughness: 0.4
      });
      const pistonHead = new THREE.Mesh(pistonHeadGeo, pistonMat);
      this.pistonGroup.add(pistonHead);

      // Cán piston
      const rodGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.0, 16);
      const rodMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
      const rod = new THREE.Mesh(rodGeo, rodMat);
      rod.position.y = 1.0;
      this.pistonGroup.add(rod);

      // Tay nắm piston
      const handleGeo = new THREE.TorusGeometry(0.3, 0.06, 16, 32);
      const handle = new THREE.Mesh(handleGeo, rodMat);
      handle.position.y = 2.0;
      handle.rotation.x = Math.PI / 2;
      this.pistonGroup.add(handle);

      this.pistonGroup.position.y = 0.4; // Tương ứng currentHeight = 2.4
      this.scene.add(this.pistonGroup);

      // Ngọn lửa nhiệt dưới đáy (bình thường tắt, khi heating thì hiện)
      const fireGeo = new THREE.ConeGeometry(0.6, 1.0, 16);
      const fireMat = new THREE.MeshBasicMaterial({ color: 0xff5722, transparent: true, opacity: 0 });
      this.fireMesh = new THREE.Mesh(fireGeo, fireMat);
      this.fireMesh.position.y = -2.6;
      this.fireMesh.rotation.x = Math.PI;
      this.scene.add(this.fireMesh);
    }

    buildPressureGauge() {
      // Khung đồng hồ áp kế gắn bên hông
      this.gaugeGroup = new THREE.Group();
      this.gaugeGroup.position.set(1.9, 0, 0);

      // Ống nối
      const pipeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12);
      const pipeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
      const pipe = new THREE.Mesh(pipeGeo, pipeMat);
      pipe.rotation.z = Math.PI / 2;
      pipe.position.x = -0.25;
      this.gaugeGroup.add(pipe);

      // Mặt đồng hồ
      const dialGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
      const dialMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const dial = new THREE.Mesh(dialGeo, dialMat);
      dial.rotation.x = Math.PI / 2;
      this.gaugeGroup.add(dial);

      // Vành kim loại
      const ringGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      this.gaugeGroup.add(ring);

      // Kim đồng hồ áp kế
      const needleGeo = new THREE.BoxGeometry(0.04, 0.35, 0.02);
      needleGeo.translate(0, 0.15, 0);
      const needleMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      this.gaugeNeedle = new THREE.Mesh(needleGeo, needleMat);
      this.gaugeNeedle.position.z = 0.06;
      this.gaugeGroup.add(this.gaugeNeedle);

      this.scene.add(this.gaugeGroup);
    }

    buildMolecules() {
      const count = 70;
      this.molecules = [];
      const sphereGeo = new THREE.SphereGeometry(0.07, 12, 12);

      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
      });

      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(sphereGeo, baseMat.clone());
        const r = (this.chamberRadius - 0.2) * Math.sqrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = -1.8 + Math.random() * 2.0;

        mesh.position.set(x, y, z);
        this.scene.add(mesh);

        const speed = 1.8 + Math.random() * 1.2;
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();

        this.molecules.push({
          mesh,
          velocity: dir.multiplyScalar(speed),
          baseSpeed: speed
        });
      }
    }

    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const timeScale = this.isSlowMo ? 0.25 : 1.0;
      const effectiveDt = Math.min(delta, 0.05) * timeScale;

      // 1. Cập nhật vị trí Piston mượt mà
      this.pistonGroup.position.y += (this.pistonTargetY - this.pistonGroup.position.y) * 0.08;
      const pistonBottomY = this.pistonGroup.position.y - 0.12;
      const chamberBottomY = -1.9;
      this.currentHeight = Math.max(0.6, pistonBottomY - chamberBottomY);

      // 2. Tính toán áp suất nhiệt động học p ~ T / V
      const volumeRatio = this.currentHeight / this.baseHeight;
      const tempRatio = this.T / 300;
      const p = (tempRatio / volumeRatio) * 1.0; // atm
      this.currentP = p;

      // Xoay kim đồng hồ áp suất (-45 deg đến 135 deg)
      const targetAngle = -Math.PI / 4 + Math.min(p / 3.0, 1.5) * Math.PI;
      this.gaugeNeedle.rotation.z += (targetAngle - this.gaugeNeedle.rotation.z) * 0.1;

      // 3. Cập nhật các phân tử khí
      const speedFactor = Math.sqrt(this.T / 300);
      const radiusLimit = this.chamberRadius - 0.1;

      for (let i = 0; i < this.molecules.length; i++) {
        const m = this.molecules[i];
        m.mesh.position.addScaledVector(m.velocity, effectiveDt * speedFactor);

        // Va chạm đáy
        if (m.mesh.position.y <= chamberBottomY + 0.1) {
          m.mesh.position.y = chamberBottomY + 0.1;
          m.velocity.y = Math.abs(m.velocity.y);
          this.totalCollisions++;
        }
        // Va chạm mặt piston bên trên
        if (m.mesh.position.y >= pistonBottomY - 0.08) {
          m.mesh.position.y = pistonBottomY - 0.08;
          m.velocity.y = -Math.abs(m.velocity.y);
          this.totalCollisions++;
        }
        // Va chạm thành hình trụ
        const rCurrent = Math.sqrt(m.mesh.position.x * m.mesh.position.x + m.mesh.position.z * m.mesh.position.z);
        if (rCurrent >= radiusLimit) {
          const normalX = m.mesh.position.x / rCurrent;
          const normalZ = m.mesh.position.z / rCurrent;
          const dot = m.velocity.x * normalX + m.velocity.z * normalZ;
          m.velocity.x -= 2 * dot * normalX;
          m.velocity.z -= 2 * dot * normalZ;
          m.mesh.position.x = normalX * (radiusLimit - 0.01);
          m.mesh.position.z = normalZ * (radiusLimit - 0.01);
          this.totalCollisions++;
        }
      }

      // 4. Hiệu ứng ngọn lửa khi nung nóng
      if (this.isHeating) {
        this.fireMesh.material.opacity = 0.7 + Math.sin(Date.now() * 0.01) * 0.2;
        this.fireMesh.scale.y = 1.0 + Math.sin(Date.now() * 0.015) * 0.2;
        this.heatLight.intensity = 1.5 + Math.random() * 0.5;
      } else {
        this.fireMesh.material.opacity = 0;
        this.heatLight.intensity = 0.2;
      }

      // 5. Cập nhật HUD bên ngoài
      if (this.totalCollisions % 5 === 0) {
        this.updateHud();
      }

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    updateHud() {
      const forceEl = document.getElementById('sim-hud-force');
      const tempEl = document.getElementById('sim-hud-temp');
      const countEl = document.getElementById('sim-hud-count');

      if (forceEl) {
        forceEl.textContent = `p ≈ ${this.currentP.toFixed(2)} atm · V ≈ ${(this.currentHeight * 1.5).toFixed(1)} L`;
      }
      if (tempEl) {
        tempEl.textContent = `T = ${Math.round(this.T)} K`;
        tempEl.style.color = this.T > 350 ? '#f59e0b' : '#38bdf8';
      }
      if (countEl) {
        countEl.textContent = this.totalCollisions;
      }
    }

    // Các tương tác công khai tương thích với baihoc.html
    toggleSlowMo() {
      this.isSlowMo = !this.isSlowMo;
      return this.isSlowMo;
    }

    toggleTemp() {
      // Tăng nhiệt độ (nung nóng khối khí)
      this.isHeating = !this.isHeating;
      if (this.isHeating) {
        this.T = 600;
        // Nếu ở chế độ Charles (đẳng áp), tăng nhiệt thì piston tự nâng lên để p = const
        if (this.mode === 'charles') {
          this.pistonTargetY = 1.2; // dãn nở thể tích gấp đôi
        }
      } else {
        this.T = 300;
        if (this.mode === 'charles') {
          this.pistonTargetY = 0.4; // hạ về ban đầu
        }
      }
      this.updateHud();
      return this.isHeating;
    }

    toggleMode() {
      // Nén / nhả Piston (rất trực quan cho định luật Boyle)
      this.isPistonCompressed = !this.isPistonCompressed;
      if (this.isPistonCompressed) {
        this.pistonTargetY = -0.5; // nén xilanh lại, thể tích giảm một nửa
      } else {
        this.pistonTargetY = 0.4;  // thể tích bình thường
      }
      return this.isPistonCompressed;
    }

    resetCamera() {
      this.camera.position.set(4, 2.5, 5);
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

      // Hủy mesh và giải phóng bộ nhớ
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }

  return SimKhiLyTuong;
});
