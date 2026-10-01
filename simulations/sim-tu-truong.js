/**
 * MÔ HÌNH 3D: TỪ TRƯỜNG, LỰC LORENTZ & CẢM ỨNG ĐIỆN TỪ (CHƯƠNG 3)
 * Trực quan hóa bản chất vật lý:
 * - Đường sức từ 3D từ cực Bắc (N) sang cực Nam (S)
 * - Lực Lorentz F = q[v x B] bẻ cong quỹ đạo hạt thành đường xoắn ốc (Helical)
 * - Hiện tượng cảm ứng điện từ & Định luật Lenz: Nam châm di chuyển qua vòng dây sinh dòng điện ic
 * - Khung dây máy phát điện quay 360° sinh dòng điện xoay chiều
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimTuTruong = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimTuTruong {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.mode = options.mode || 'lorentz'; // 'lorentz' | 'lenz' | 'generator'
      this.isSlowMo = false;
      this.isFieldReversed = false;
      this.animId = null;
      this.time = 0;
      this.trailPoints = [];
      this.maxTrail = 120;

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

      // 1. Dựng Nam châm 3D hai cực N-S
      this.buildMagnets();

      // 2. Dựng các đường sức từ 3D (Field lines)
      this.buildFieldLines();

      // 3. Dựng hạt tích điện bay xoắn ốc (Lorentz)
      this.buildLorentzParticle();

      // 4. Dựng vòng dây dẫn cảm ứng (Lenz / Generator)
      this.buildCoilAndGenerator();

      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);

      this.updateHud();
    }

    buildMagnets() {
      this.magnetGroup = new THREE.Group();

      const magnetGeo = new THREE.BoxGeometry(0.8, 0.8, 1.8);

      // Cực Bắc (N - Đỏ)
      const matNorth = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        metalness: 0.5,
        roughness: 0.3
      });
      this.northPole = new THREE.Mesh(magnetGeo, matNorth);
      this.northPole.position.x = -2.2;
      this.magnetGroup.add(this.northPole);

      // Cực Nam (S - Xanh)
      const matSouth = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        metalness: 0.5,
        roughness: 0.3
      });
      this.southPole = new THREE.Mesh(magnetGeo, matSouth);
      this.southPole.position.x = 2.2;
      this.magnetGroup.add(this.southPole);

      this.scene.add(this.magnetGroup);
    }

    buildFieldLines() {
      this.fieldLinesGroup = new THREE.Group();
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4
      });

      // Tạo chùm 9 đường sức từ chạy thẳng hoặc hơi uốn từ N sang S
      for (let y = -0.6; y <= 0.6; y += 0.6) {
        for (let z = -0.6; z <= 0.6; z += 0.6) {
          const points = [];
          for (let x = -1.8; x <= 1.8; x += 0.4) {
            const bulge = Math.sin((x + 1.8) / 3.6 * Math.PI) * 0.15;
            points.push(new THREE.Vector3(x, y * (1 + bulge), z * (1 + bulge)));
          }
          const geo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(geo, lineMat);
          this.fieldLinesGroup.add(line);
        }
      }
      this.scene.add(this.fieldLinesGroup);
    }

    buildLorentzParticle() {
      this.lorentzGroup = new THREE.Group();

      // Hạt mang điện tích q
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xeab308,
        emissiveIntensity: 0.8
      });
      this.chargeParticle = new THREE.Mesh(sphereGeo, sphereMat);
      this.lorentzGroup.add(this.chargeParticle);

      // Vệt sáng quỹ đạo xoắn ốc (Trail)
      const trailGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(this.maxTrail * 3);
      trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const trailMat = new THREE.LineBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.7
      });
      this.trailLine = new THREE.Line(trailGeo, trailMat);
      this.lorentzGroup.add(this.trailLine);

      // Vector vận tốc v (mũi tên xanh lá)
      this.velArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        0.5,
        0x22c55e,
        0.15,
        0.08
      );
      this.lorentzGroup.add(this.velArrow);

      // Vector Lực từ Lorentz F (mũi tên đỏ)
      this.forceArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        0.5,
        0xef4444,
        0.15,
        0.08
      );
      this.lorentzGroup.add(this.forceArrow);

      this.scene.add(this.lorentzGroup);
    }

    buildCoilAndGenerator() {
      this.coilGroup = new THREE.Group();

      // Vòng dây tròn dẫn điện
      const torusGeo = new THREE.TorusGeometry(1.0, 0.04, 16, 48);
      const coilMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2
      });
      this.coilMesh = new THREE.Mesh(torusGeo, coilMat);
      this.coilMesh.rotation.y = Math.PI / 2;
      this.coilGroup.add(this.coilMesh);

      // Đèn LED phát sáng khi có dòng cảm ứng
      const ledGeo = new THREE.SphereGeometry(0.12, 16, 16);
      this.ledMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        emissive: 0x16a34a,
        emissiveIntensity: 0
      });
      this.ledMesh = new THREE.Mesh(ledGeo, this.ledMat);
      this.ledMesh.position.set(0, 1.0, 0);
      this.coilGroup.add(this.ledMesh);

      this.coilGroup.visible = (this.mode !== 'lorentz');
      this.scene.add(this.coilGroup);
    }

    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const timeScale = this.isSlowMo ? 0.2 : 1.0;
      const dt = Math.min(delta, 0.05) * timeScale;
      this.time += dt * 3;

      if (this.mode === 'lorentz') {
        // CHẾ ĐỘ LORENTZ: Hạt bay xoắn ốc 3D trong từ trường đều
        this.lorentzGroup.visible = true;
        this.coilGroup.visible = false;

        const R = 0.7; // Bán kính Larmor
        const omega = (this.isFieldReversed ? -1 : 1) * 4.0;
        const vz = 0.6; // Vận tốc tịnh tiến dọc trục z

        const zPos = ((this.time * vz) % 4.0) - 2.0;
        const xPos = Math.cos(this.time * omega) * R;
        const yPos = Math.sin(this.time * omega) * R;

        this.chargeParticle.position.set(xPos, yPos, zPos);

        // Hướng vector vận tốc v (tiếp tuyến với vòng tròn và hướng theo z)
        const vx = -Math.sin(this.time * omega) * omega * R;
        const vy = Math.cos(this.time * omega) * omega * R;
        const vDir = new THREE.Vector3(vx, vy, vz).normalize();
        this.velArrow.position.set(xPos, yPos, zPos);
        this.velArrow.setDirection(vDir);

        // Hướng lực Lorentz F hướng về tâm vòng tròn xoắn
        const fDir = new THREE.Vector3(-xPos, -yPos, 0).normalize();
        this.forceArrow.position.set(xPos, yPos, zPos);
        this.forceArrow.setDirection(fDir);

        // Cập nhật vệt sáng quỹ đạo
        this.trailPoints.push(new THREE.Vector3(xPos, yPos, zPos));
        if (this.trailPoints.length > this.maxTrail) this.trailPoints.shift();

        const posAttr = this.trailLine.geometry.attributes.position;
        for (let i = 0; i < this.maxTrail; i++) {
          const pt = this.trailPoints[i] || this.trailPoints[this.trailPoints.length - 1] || new THREE.Vector3(0, 0, 0);
          posAttr.setXYZ(i, pt.x, pt.y, pt.z);
        }
        posAttr.needsUpdate = true;

      } else {
        // CHẾ ĐỘ LENZ / MÁY PHÁT ĐIỆN XOAY CHIỀU
        this.lorentzGroup.visible = false;
        this.coilGroup.visible = true;

        if (this.mode === 'generator') {
          // Khung dây quay 360 độ sinh suất điện động e = E0 cos(wt)
          this.coilMesh.rotation.z = this.time * 2;
          const emf = Math.abs(Math.sin(this.time * 2));
          this.ledMat.emissiveIntensity = emf * 1.5;
        } else {
          // Nam châm dao động qua lại quanh vòng dây
          const magOffset = Math.sin(this.time * 2) * 1.2;
          this.magnetGroup.position.z = magOffset;
          // Suất điện động tỉ lệ với tốc độ biến thiên dPhi/dt
          const vel = Math.abs(Math.cos(this.time * 2));
          this.ledMat.emissiveIntensity = vel * 1.8;
        }
      }

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    updateHud() {
      const forceEl = document.getElementById('sim-hud-force');
      const tempEl = document.getElementById('sim-hud-temp');
      const countEl = document.getElementById('sim-hud-count');

      if (this.mode === 'lorentz') {
        if (forceEl) forceEl.textContent = 'F_L = |q|·v·B·sin(α) ≈ 3.2 × 10⁻¹⁴ N';
        if (tempEl) {
          tempEl.textContent = `B = 0.5 T · ${this.isFieldReversed ? 'B↓ (Ngược chiều)' : 'B↑ (Thuận chiều)'}`;
          tempEl.style.color = '#38bdf8';
        }
        if (countEl) countEl.textContent = 'R_Larmor = 0.7 m';
      } else if (this.mode === 'generator') {
        if (forceEl) forceEl.textContent = 'e = E₀·cos(ωt) = -dΦ/dt';
        if (tempEl) {
          tempEl.textContent = 'f = 50 Hz · U = 220 V';
          tempEl.style.color = '#22c55e';
        }
        if (countEl) countEl.textContent = 'Khung quay 360°';
      } else {
        if (forceEl) forceEl.textContent = 'Định luật Lenz: e_c = -ΔΦ/Δt';
        if (tempEl) {
          tempEl.textContent = 'Dòng cảm ứng i_c chống lại nguyên nhân';
          tempEl.style.color = '#f59e0b';
        }
        if (countEl) countEl.textContent = 'Đèn LED phát sáng';
      }
    }

    toggleSlowMo() {
      this.isSlowMo = !this.isSlowMo;
      return this.isSlowMo;
    }

    toggleTemp() {
      // Đảo chiều từ trường B hoặc đổi cực N-S
      this.isFieldReversed = !this.isFieldReversed;
      this.northPole.position.x = this.isFieldReversed ? 2.2 : -2.2;
      this.southPole.position.x = this.isFieldReversed ? -2.2 : 2.2;
      this.updateHud();
      return this.isFieldReversed;
    }

    toggleMode() {
      // Chuyển đổi giữa Chế độ Lực Lorentz xoắn ốc <-> Cảm ứng Lenz / Máy phát điện
      if (this.mode === 'lorentz') {
        this.mode = 'lenz';
      } else if (this.mode === 'lenz') {
        this.mode = 'generator';
      } else {
        this.mode = 'lorentz';
      }
      this.trailPoints = [];
      this.updateHud();
      return this.mode !== 'lorentz';
    }

    resetCamera() {
      this.camera.position.set(4, 2.8, 5);
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
      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer.dispose();
    }
  }

  return SimTuTruong;
});
