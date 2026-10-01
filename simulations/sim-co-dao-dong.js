/**
 * MÔ HÌNH 3D: DAO ĐỘNG ĐIỀU HÒA, VÒNG TRÒN LƯỢNG GIÁC & 3 ĐỊNH LUẬT NEWTON
 * (Dành cho các bài Lấy gốc Vật lí 10 & 11)
 * Trực quan hóa bản chất vật lý:
 * - Mối liên hệ một-một giữa Chuyển động tròn đều và Dao động điều hòa x = A·cos(ωt + φ)
 * - Lò xo 3D co dãn thực tế đồng bộ với hình chiếu của vector quay lượng giác
 * - Vector vận tốc v và gia tốc a đổi hướng liên tục
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimCoDaoDong = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimCoDaoDong {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.mode = options.mode || 'shm'; // 'shm' | 'newton'
      this.isSlowMo = false;
      this.animId = null;
      this.time = 0;

      this.A = 1.6; // Biên độ dao động
      this.omega = 3.0; // Tần số góc

      this.init();
    }

    init() {
      const width = this.container.clientWidth || 340;
      const height = this.container.clientHeight || 240;

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x0a0f1d);

      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      this.resetCamera();

      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.container.innerHTML = '';
      this.container.appendChild(this.renderer.domElement);

      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
      }

      const ambient = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      dirLight.position.set(5, 8, 5);
      this.scene.add(dirLight);

      // Dựng hệ Dao động điều hòa & Vòng tròn lượng giác
      this.buildShmScene();

      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);

      this.updateHud();
    }

    buildShmScene() {
      this.shmGroup = new THREE.Group();

      // 1. Đường tròn lượng giác 3D bán kính A
      const circleCurve = new THREE.EllipseCurve(0, 0.8, this.A, this.A, 0, 2 * Math.PI);
      const pts = circleCurve.getPoints(64);
      const circleGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const circleMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
      this.circleLine = new THREE.Line(circleGeo, circleMat);
      this.shmGroup.add(this.circleLine);

      // Trục tọa độ ngang Ox của vòng tròn
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-this.A - 0.4, 0.8, 0),
        new THREE.Vector3(this.A + 0.4, 0.8, 0)
      ]);
      const axisMat = new THREE.LineDashedMaterial({ color: 0x64748b, dashSize: 0.1, gapSize: 0.05 });
      const axisLine = new THREE.Line(axisGeo, axisMat);
      axisLine.computeLineDistances();
      this.shmGroup.add(axisLine);

      // 2. Chất điểm quay tròn đều (Màu vàng neon)
      const pRotGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const pRotMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xeab308, emissiveIntensity: 0.6 });
      this.pRotating = new THREE.Mesh(pRotGeo, pRotMat);
      this.shmGroup.add(this.pRotating);

      // Bán kính vector quay A (nối từ tâm đường tròn tới chất điểm quay)
      const radiusGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(this.A, 0.8, 0)]);
      const radiusMat = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 2 });
      this.radiusLine = new THREE.Line(radiusGeo, radiusMat);
      this.shmGroup.add(this.radiusLine);

      // Đường dóng vuông góc xuống trục dao động Ox bên dưới
      const dropGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.8, 0), new THREE.Vector3(0, -1.0, 0)]);
      const dropMat = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.08, gapSize: 0.05 });
      this.dropLine = new THREE.Line(dropGeo, dropMat);
      this.dropLine.computeLineDistances();
      this.shmGroup.add(this.dropLine);

      // 3. Quả nặng dao động điều hòa bên dưới (Màu đỏ neon)
      const oscGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const oscMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.6 });
      this.pOscillating = new THREE.Mesh(oscGeo, oscMat);
      this.pOscillating.position.y = -1.0;
      this.shmGroup.add(this.pOscillating);

      // 4. Lò xo 3D gắn vào tường bên trái (-2.4, -1.0, 0)
      this.wallX = -2.4;
      this.springCoils = 14;
      this.springGroup = new THREE.Group();
      this.springMat = new THREE.LineBasicMaterial({ color: 0x0ea5e9, linewidth: 2 });

      const springGeo = new THREE.BufferGeometry();
      const springPts = new Float32Array((this.springCoils * 16 + 2) * 3);
      springGeo.setAttribute('position', new THREE.BufferAttribute(springPts, 3));
      this.springLine = new THREE.Line(springGeo, this.springMat);
      this.springGroup.add(this.springLine);
      this.shmGroup.add(this.springGroup);

      // Tường cố định gắn lò xo
      const wallGeo = new THREE.BoxGeometry(0.1, 0.8, 0.6);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(this.wallX, -1.0, 0);
      this.shmGroup.add(wall);

      // Trục tọa độ Ox dao động
      const trackGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.4, 8);
      const trackMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const track = new THREE.Mesh(trackGeo, trackMat);
      track.rotation.z = Math.PI / 2;
      track.position.set(0, -1.0, 0);
      this.shmGroup.add(track);

      this.scene.add(this.shmGroup);
    }

    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const timeScale = this.isSlowMo ? 0.2 : 1.0;
      const dt = Math.min(delta, 0.05) * timeScale;
      this.time += dt * this.omega;

      const angle = this.time;
      const rotX = Math.cos(angle) * this.A;
      const rotY = 0.8 + Math.sin(angle) * this.A;

      // Cập nhật vị trí chất điểm quay tròn đều
      this.pRotating.position.set(rotX, rotY, 0);

      // Cập nhật vector bán kính quay
      const radPos = this.radiusLine.geometry.attributes.position;
      radPos.setXYZ(0, 0, 0.8, 0);
      radPos.setXYZ(1, rotX, rotY, 0);
      radPos.needsUpdate = true;

      // Cập nhật chất điểm dao động điều hòa x(t) = A·cos(ωt)
      const oscX = rotX;
      this.pOscillating.position.set(oscX, -1.0, 0);

      // Cập nhật đường dóng vuông góc
      const dropPos = this.dropLine.geometry.attributes.position;
      dropPos.setXYZ(0, rotX, rotY, 0);
      dropPos.setXYZ(1, oscX, -1.0, 0);
      dropPos.needsUpdate = true;
      this.dropLine.computeLineDistances();

      // Cập nhật hình dạng lò xo 3D co dãn
      const springLength = oscX - this.wallX;
      const totalPts = this.springCoils * 16;
      const sPos = this.springLine.geometry.attributes.position;

      for (let i = 0; i <= totalPts; i++) {
        const u = i / totalPts;
        const x = this.wallX + u * springLength;
        const theta = u * this.springCoils * Math.PI * 2;
        const radius = (u > 0.05 && u < 0.95) ? 0.14 : 0.04;
        const y = -1.0 + Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        sPos.setXYZ(i, x, y, z);
      }
      sPos.needsUpdate = true;

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    updateHud() {
      const forceEl = document.getElementById('sim-hud-force');
      const tempEl = document.getElementById('sim-hud-temp');
      const countEl = document.getElementById('sim-hud-count');

      if (forceEl) forceEl.textContent = 'x = A·cos(ωt + φ) · v = -ωA·sin(ωt + φ)';
      if (tempEl) {
        tempEl.textContent = `A = ${this.A.toFixed(1)} cm · ω = ${this.omega.toFixed(1)} rad/s`;
        tempEl.style.color = '#facc15';
      }
      if (countEl) countEl.textContent = 'Hình chiếu tròn đều';
    }

    toggleSlowMo() {
      this.isSlowMo = !this.isSlowMo;
      return this.isSlowMo;
    }

    toggleTemp() {
      // Tăng tần số góc omega
      this.omega = (this.omega === 3.0) ? 6.0 : 3.0;
      this.updateHud();
      return this.omega > 3.0;
    }

    toggleMode() {
      // Tăng biên độ A
      this.A = (this.A === 1.6) ? 2.0 : 1.6;
      this.updateHud();
      return this.A > 1.6;
    }

    resetCamera() {
      this.camera.position.set(0, 0.5, 6);
      this.camera.lookAt(0, -0.1, 0);
      if (this.controls) this.controls.target.set(0, -0.1, 0);
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
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }

  return SimCoDaoDong;
});
