/**
 * MÔ HÌNH 3D: CẤU TẠO HẠT NHÂN & 3 CHÙM TIA PHÓNG XẠ TRONG ĐIỆN TRƯỜNG (CHƯƠNG 4)
 * Trực quan hóa bản chất vật lý:
 * - Hạt nhân gồm Proton (đỏ) & Neutron (xanh) liên kết chặt chẽ bởi lực hạt nhân mạnh
 * - 3 Chùm tia phóng xạ bay qua điện trường 2 bản cực:
 *   + Tia alpha (+2e) bị lệch nhẹ về phía cực âm (-)
 *   + Tia beta (-e) bị lệch mạnh về phía cực dương (+)
 *   + Tia gamma (photon) đi thẳng không bị lệch
 * - Phản ứng phân hạch giải phóng neutron tự do
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimHatNhan = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimHatNhan {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.mode = options.mode || 'nucleus'; // 'nucleus' | 'radiation' | 'fission'
      this.isSlowMo = false;
      this.animId = null;
      this.time = 0;

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

      // 1. Dựng cụm hạt nhân nguyên tử (Protons + Neutrons + Electron orbits)
      this.buildNucleus();

      // 2. Dựng buồng phóng xạ 3 tia qua điện trường
      this.buildRadiationChamber();

      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);

      this.updateHud();
    }

    buildNucleus() {
      this.nucleusGroup = new THREE.Group();

      const protonMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0xb91c1c,
        emissiveIntensity: 0.5
      });
      const neutronMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.2,
        metalness: 0.3,
        emissive: 0x1d4ed8,
        emissiveIntensity: 0.5
      });

      this.nucleons = [];
      const nucleonGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const totalNucleons = 30;

      for (let i = 0; i < totalNucleons; i++) {
        const isProton = (i % 2 === 0);
        const mesh = new THREE.Mesh(nucleonGeo, isProton ? protonMat : neutronMat);

        const phi = Math.acos(-1 + (2 * i) / totalNucleons);
        const theta = Math.sqrt(totalNucleons * Math.PI) * phi;
        const r = 0.55 * Math.cbrt(Math.random() * 0.8 + 0.2);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        mesh.position.set(x, y, z);
        this.nucleusGroup.add(mesh);

        this.nucleons.push({
          mesh,
          basePos: new THREE.Vector3(x, y, z),
          isProton,
          phase: Math.random() * Math.PI * 2
        });
      }

      // Quỹ đạo electron bao quanh
      this.electronTracks = new THREE.Group();
      const trackMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
      const eMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const eGeo = new THREE.SphereGeometry(0.06, 12, 12);

      this.orbitElectrons = [];
      const radii = [1.6, 2.3, 2.9];

      for (let k = 0; k < radii.length; k++) {
        const rad = radii[k];
        const curve = new THREE.EllipseCurve(0, 0, rad, rad * 0.6, 0, 2 * Math.PI, false, 0);
        const pts = curve.getPoints(64);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const trackLine = new THREE.Line(geo, trackMat);
        trackLine.rotation.x = Math.PI / 3 * (k + 1);
        trackLine.rotation.y = Math.PI / 4 * (k + 1);
        this.electronTracks.add(trackLine);

        const eMesh = new THREE.Mesh(eGeo, eMat);
        this.electronTracks.add(eMesh);
        this.orbitElectrons.push({ mesh: eMesh, curve, speed: 2.0 / (k + 1), track: trackLine });
      }

      this.nucleusGroup.add(this.electronTracks);
      this.nucleusGroup.visible = (this.mode === 'nucleus');
      this.scene.add(this.nucleusGroup);
    }

    buildRadiationChamber() {
      this.radiationGroup = new THREE.Group();

      // Bản cực điện trường trên (+) và dưới (-)
      const plateGeo = new THREE.BoxGeometry(2.4, 0.08, 1.2);

      // Cực dương (+) ở trên
      const posMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.7, roughness: 0.3 });
      this.topPlate = new THREE.Mesh(plateGeo, posMat);
      this.topPlate.position.set(0.6, 1.2, 0);
      this.radiationGroup.add(this.topPlate);

      // Cực âm (-) ở dưới
      const negMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.7, roughness: 0.3 });
      this.bottomPlate = new THREE.Mesh(plateGeo, negMat);
      this.bottomPlate.position.set(0.6, -1.2, 0);
      this.radiationGroup.add(this.bottomPlate);

      // Khối nguồn phóng xạ bằng chì bên trái
      const leadGeo = new THREE.BoxGeometry(0.8, 1.0, 0.8);
      const leadMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9, roughness: 0.4 });
      const leadBox = new THREE.Mesh(leadGeo, leadMat);
      leadBox.position.set(-1.8, 0, 0);
      this.radiationGroup.add(leadBox);

      // 3 chùm tia: Alpha, Beta, Gamma
      this.radiationParticles = [];
      const pGeo = new THREE.SphereGeometry(0.08, 12, 12);

      // Tia Alpha (hạt màu cam/đỏ nặng, lệch nhẹ xuống cực âm -)
      const alphaMat = new THREE.MeshBasicMaterial({ color: 0xf97316 });
      // Tia Beta (electron màu xanh lá nhẹ, lệch mạnh lên cực dương +)
      const betaMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      // Tia Gamma (photon màu tím sáng, truyền thẳng tắp)
      const gammaMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });

      for (let i = 0; i < 30; i++) {
        const type = i % 3; // 0: alpha, 1: beta, 2: gamma
        let mat = alphaMat;
        if (type === 1) mat = betaMat;
        if (type === 2) mat = gammaMat;

        const mesh = new THREE.Mesh(pGeo, mat);
        this.radiationGroup.add(mesh);

        this.radiationParticles.push({
          mesh,
          type,
          progress: Math.random(),
          speed: type === 2 ? 1.5 : (type === 1 ? 1.2 : 0.8)
        });
      }

      this.radiationGroup.visible = (this.mode !== 'nucleus');
      this.scene.add(this.radiationGroup);
    }

    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const timeScale = this.isSlowMo ? 0.2 : 1.0;
      const dt = Math.min(delta, 0.05) * timeScale;
      this.time += dt * 2.5;

      if (this.mode === 'nucleus') {
        this.nucleusGroup.visible = true;
        this.radiationGroup.visible = false;

        // Xoay nhẹ hạt nhân
        this.nucleusGroup.rotation.y = this.time * 0.3;

        // Dao động hạt nhân quanh vị trí cân bằng
        for (let i = 0; i < this.nucleons.length; i++) {
          const n = this.nucleons[i];
          const amp = 0.03;
          n.mesh.position.x = n.basePos.x + Math.sin(this.time * 8 + n.phase) * amp;
          n.mesh.position.y = n.basePos.y + Math.cos(this.time * 7 + n.phase) * amp;
          n.mesh.position.z = n.basePos.z + Math.sin(this.time * 9 + n.phase) * amp;
        }

        // Chuyển động của các electron trên quỹ đạo
        for (let k = 0; k < this.orbitElectrons.length; k++) {
          const oe = this.orbitElectrons[k];
          const tPos = (this.time * oe.speed) % 1;
          const pt = oe.curve.getPoint(tPos);
          oe.mesh.position.set(pt.x, pt.y, 0);
          oe.mesh.position.applyEuler(oe.track.rotation);
        }

      } else {
        this.nucleusGroup.visible = false;
        this.radiationGroup.visible = true;

        // Cập nhật chuyển động 3 chùm tia trong điện trường
        for (let i = 0; i < this.radiationParticles.length; i++) {
          const rp = this.radiationParticles[i];
          rp.progress += dt * rp.speed;
          if (rp.progress > 1.0) rp.progress = 0;

          // X chạy từ -1.4 (miệng bình chì) đến +2.0 (màn huỳnh quang)
          const startX = -1.4;
          const endX = 2.0;
          const curX = startX + (endX - startX) * rp.progress;

          let curY = 0;
          if (curX > -0.6) {
            const relX = (curX + 0.6) / 2.6; // quãng đường đi trong điện trường
            if (rp.type === 0) {
              // Tia Alpha (+2e): Lệch nhẹ xuống cực âm (-)
              curY = -0.4 * relX * relX;
            } else if (rp.type === 1) {
              // Tia Beta (-e): Lệch mạnh lên cực dương (+)
              curY = 0.9 * relX * relX;
            } else {
              // Tia Gamma (photon): Không mang điện => Đi thẳng tắp
              curY = 0;
            }
          }

          rp.mesh.position.set(curX, curY, (Math.random() - 0.5) * 0.05);
        }
      }

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    updateHud() {
      const forceEl = document.getElementById('sim-hud-force');
      const tempEl = document.getElementById('sim-hud-temp');
      const countEl = document.getElementById('sim-hud-count');

      if (this.mode === 'nucleus') {
        if (forceEl) forceEl.textContent = 'E_lk = Δm·c² = [Z·mp + (A-Z)mn - mX]·c²';
        if (tempEl) {
          tempEl.textContent = 'Hạt nhân nguyên tử: Z = 15 (Proton) · N = 15 (Neutron)';
          tempEl.style.color = '#ef4444';
        }
        if (countEl) countEl.textContent = 'Lực hạt nhân mạnh';
      } else {
        if (forceEl) forceEl.textContent = 'α (+2e lệch cực -) · β (-e lệch cực +) · γ (đi thẳng)';
        if (tempEl) {
          tempEl.textContent = '3 chùm tia phóng xạ trong điện trường đều';
          tempEl.style.color = '#a855f7';
        }
        if (countEl) countEl.textContent = 'Định luật phóng xạ';
      }
    }

    toggleSlowMo() {
      this.isSlowMo = !this.isSlowMo;
      return this.isSlowMo;
    }

    toggleTemp() {
      // Đảo cực tính điện trường bản cực (+ / -)
      const topColor = this.topPlate.material.color.getHex();
      this.topPlate.material.color.setHex(topColor === 0xef4444 ? 0x3b82f6 : 0xef4444);
      this.bottomPlate.material.color.setHex(topColor === 0xef4444 ? 0xef4444 : 0x3b82f6);
      this.updateHud();
      return true;
    }

    toggleMode() {
      // Chuyển đổi giữa Mô hình Cấu tạo hạt nhân <-> 3 Chùm tia phóng xạ trong điện trường
      this.mode = (this.mode === 'nucleus') ? 'radiation' : 'nucleus';
      this.updateHud();
      return this.mode !== 'nucleus';
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

  return SimHatNhan;
});
