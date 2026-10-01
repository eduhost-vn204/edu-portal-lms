/**
 * MÔ HÌNH 3D: CẤU TRÚC PHÂN TỬ 3 THỂ & NHIỆT ĐỘNG LỰC HỌC (CHƯƠNG 1)
 * Trực quan hóa bản chất vật lý:
 * - RẮN: Mạng tinh thể lập phương trật tự, hạt dao động quanh VTCB cố định
 * - LỎNG: Các hạt trượt hỗn loạn sát nhau ở đáy bình, hình dạng thay đổi
 * - KHÍ: Hạt bứt liên kết, bay hỗn loạn tự do chiếm toàn bộ thể tích
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimNhietChuyenThe = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimNhietChuyenThe {
    constructor(container, options = {}) {
      this.container = container;
      this.options = options;
      this.state = options.initialState || 'solid'; // 'solid' | 'liquid' | 'gas'
      this.T = options.initialT || (this.state === 'solid' ? 150 : (this.state === 'liquid' ? 300 : 600));

      this.isSlowMo = false;
      this.animId = null;
      this.time = 0;

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
      }

      // 5. Ánh sáng
      const ambient = new THREE.AmbientLight(0xffffff, 0.7);
      this.scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      dirLight.position.set(5, 8, 5);
      this.scene.add(dirLight);
      const bottomLight = new THREE.PointLight(0x06b6d4, 1.0, 8);
      bottomLight.position.set(0, -2, 0);
      this.scene.add(bottomLight);
      this.bottomLight = bottomLight;

      // 6. Buồng chứa thủy tinh 3D
      this.buildContainerBox();

      // 7. Tạo hệ 64 hạt phân tử (Mạng 4x4x4)
      this.buildParticles();

      // 8. Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.container);

      // 9. Vòng lặp Render
      this.clock = new THREE.Clock();
      this.animate = this.animate.bind(this);
      this.animId = requestAnimationFrame(this.animate);

      this.updateHud();
    }

    buildContainerBox() {
      this.boxSize = 2.8;
      const boxGeo = new THREE.BoxGeometry(this.boxSize, this.boxSize, this.boxSize);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      this.boxEdges = new THREE.LineSegments(edges, lineMat);
      this.scene.add(this.boxEdges);

      // Mặt đế
      const planeGeo = new THREE.PlaneGeometry(this.boxSize, this.boxSize);
      const planeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8,
        metalness: 0.2,
        side: THREE.DoubleSide
      });
      const floor = new THREE.Mesh(planeGeo, planeMat);
      floor.rotation.x = Math.PI / 2;
      floor.position.y = -this.boxSize / 2;
      this.scene.add(floor);
    }

    buildParticles() {
      this.particles = [];
      const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
      this.sphereGeo = sphereGeo;

      // Màu sắc theo thể
      this.matSolid = new THREE.MeshStandardMaterial({
        color: 0x60a5fa,
        metalness: 0.4,
        roughness: 0.2,
        emissive: 0x2563eb,
        emissiveIntensity: 0.5
      });
      this.matLiquid = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.2,
        roughness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9
      });
      this.matGas = new THREE.MeshStandardMaterial({
        color: 0xf87171,
        metalness: 0.1,
        roughness: 0.2,
        emissive: 0xdc2626,
        emissiveIntensity: 0.7
      });

      // Tạo 64 hạt theo ma trận 4x4x4
      const spacing = 0.6;
      const offset = 1.5 * spacing; // căn giữa tâm (0,0,0)

      for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
          for (let z = 0; z < 4; z++) {
            const originX = x * spacing - offset;
            const originY = y * spacing - offset;
            const originZ = z * spacing - offset;

            const mesh = new THREE.Mesh(sphereGeo, this.matSolid.clone());
            mesh.position.set(originX, originY, originZ);
            this.scene.add(mesh);

            this.particles.push({
              mesh,
              origin: new THREE.Vector3(originX, originY, originZ),
              pos: new THREE.Vector3(originX, originY, originZ),
              vel: new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
              ),
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      // Tạo các liên kết lò xo giữa các hạt ở thể rắn
      this.latticeLines = new THREE.Group();
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 });

      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const d = this.particles[i].origin.distanceTo(this.particles[j].origin);
          if (Math.abs(d - spacing) < 0.05) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
              this.particles[i].pos,
              this.particles[j].pos
            ]);
            const line = new THREE.Line(lineGeo, lineMaterial);
            line.userData = { p1: this.particles[i], p2: this.particles[j] };
            this.latticeLines.add(line);
          }
        }
      }
      this.scene.add(this.latticeLines);
    }

    animate() {
      this.animId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta();
      const timeScale = this.isSlowMo ? 0.2 : 1.0;
      const dt = Math.min(delta, 0.05) * timeScale;
      this.time += dt * 4;

      const halfBox = this.boxSize / 2 - 0.12;

      if (this.state === 'solid') {
        // THỂ RẮN: Dao động nhỏ điều hòa quanh vị trí cân bằng cố định
        this.latticeLines.visible = true;
        const amp = 0.08 * (this.T / 150); // Biên độ nhiệt

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.pos.x = p.origin.x + Math.sin(this.time * 6 + p.phase) * amp;
          p.pos.y = p.origin.y + Math.cos(this.time * 7 + p.phase * 1.3) * amp;
          p.pos.z = p.origin.z + Math.sin(this.time * 5 + p.phase * 0.7) * amp;
          p.mesh.position.copy(p.pos);
        }

        // Cập nhật tọa độ thanh liên kết mạng tinh thể
        const lines = this.latticeLines.children;
        for (let k = 0; k < lines.length; k++) {
          const l = lines[k];
          const posAttr = l.geometry.attributes.position;
          posAttr.setXYZ(0, l.userData.p1.pos.x, l.userData.p1.pos.y, l.userData.p1.pos.z);
          posAttr.setXYZ(1, l.userData.p2.pos.x, l.userData.p2.pos.y, l.userData.p2.pos.z);
          posAttr.needsUpdate = true;
        }

      } else if (this.state === 'liquid') {
        // THỂ LỎNG: Mạng tinh thể tan rã, trượt lên nhau ở đáy bình
        this.latticeLines.visible = false;
        const liquidTop = -0.1; // Mức chất lỏng chiếm nửa dưới bình

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.pos.addScaledVector(p.vel, dt * 1.5);

          // Trọng lực kéo xuống đáy
          p.vel.y -= dt * 3.0;

          // Va chạm đáy và mặt nước
          if (p.pos.y < -halfBox) {
            p.pos.y = -halfBox;
            p.vel.y = Math.abs(p.vel.y) * 0.6;
          }
          if (p.pos.y > liquidTop) {
            p.pos.y = liquidTop;
            p.vel.y = -Math.abs(p.vel.y) * 0.6;
          }
          // Va chạm thành bên
          if (Math.abs(p.pos.x) > halfBox) {
            p.pos.x = Math.sign(p.pos.x) * halfBox;
            p.vel.x = -p.vel.x;
          }
          if (Math.abs(p.pos.z) > halfBox) {
            p.pos.z = Math.sign(p.pos.z) * halfBox;
            p.vel.z = -p.vel.z;
          }
          p.mesh.position.copy(p.pos);
        }

      } else {
        // THỂ KHÍ: Bay hỗn loạn tự do khắp toàn bộ không gian bình chứa
        this.latticeLines.visible = false;
        const speedMultiplier = 3.5 * Math.sqrt(this.T / 600);

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.pos.addScaledVector(p.vel, dt * speedMultiplier);

          // Bật nảy phản xạ đàn hồi toàn diện 6 mặt hộp
          if (Math.abs(p.pos.x) > halfBox) {
            p.pos.x = Math.sign(p.pos.x) * halfBox;
            p.vel.x = -p.vel.x;
          }
          if (Math.abs(p.pos.y) > halfBox) {
            p.pos.y = Math.sign(p.pos.y) * halfBox;
            p.vel.y = -p.vel.y;
          }
          if (Math.abs(p.pos.z) > halfBox) {
            p.pos.z = Math.sign(p.pos.z) * halfBox;
            p.vel.z = -p.vel.z;
          }
          p.mesh.position.copy(p.pos);
        }
      }

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }

    applyStateMaterial() {
      const mat = this.state === 'solid' ? this.matSolid : (this.state === 'liquid' ? this.matLiquid : this.matGas);
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].mesh.material = mat;
      }
      this.bottomLight.color.setHex(this.state === 'solid' ? 0x06b6d4 : (this.state === 'liquid' ? 0x38bdf8 : 0xef4444));
    }

    updateHud() {
      const forceEl = document.getElementById('sim-hud-force');
      const tempEl = document.getElementById('sim-hud-temp');
      const countEl = document.getElementById('sim-hud-count');

      const stateNames = {
        solid: '🧊 THỂ RẮN (Tinh thể dao động VTCB)',
        liquid: '💧 THỂ LỎNG (Trượt hỗn loạn đáy bình)',
        gas: '💨 THỂ KHÍ (Chuyển động hỗn loạn tự do)'
      };

      if (forceEl) {
        forceEl.textContent = stateNames[this.state] || 'Mô hình cấu trúc chất';
      }
      if (tempEl) {
        tempEl.textContent = `T = ${Math.round(this.T)} K (${(this.T - 273).toFixed(0)}°C)`;
        tempEl.style.color = this.state === 'solid' ? '#60a5fa' : (this.state === 'liquid' ? '#38bdf8' : '#f87171');
      }
      if (countEl) {
        const linkForces = { solid: 'Rất mạnh', liquid: 'Trung bình', gas: 'Rất yếu (bỏ qua)' };
        countEl.textContent = linkForces[this.state];
      }
    }

    // Tương tác tương thích chuẩn baihoc.html
    toggleSlowMo() {
      this.isSlowMo = !this.isSlowMo;
      return this.isSlowMo;
    }

    toggleTemp() {
      // Tăng nhiệt độ và tự động chuyển trạng thái chuyển thể
      if (this.state === 'solid') {
        this.state = 'liquid';
        this.T = 300;
      } else if (this.state === 'liquid') {
        this.state = 'gas';
        this.T = 600;
      } else {
        this.state = 'solid';
        this.T = 150;
      }
      this.applyStateMaterial();
      this.updateHud();
      return this.state !== 'solid';
    }

    toggleMode() {
      // Chuyển trực tiếp giữa 3 thể Rắn -> Lỏng -> Khí
      return this.toggleTemp();
    }

    resetCamera() {
      this.camera.position.set(4, 3, 5);
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

  return SimNhietChuyenThe;
});
