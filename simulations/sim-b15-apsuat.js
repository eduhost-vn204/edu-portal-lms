/**
 * MODULE MÔ PHỎNG 3D VẬT LÝ XUÂN TRƯỜNG — BÀI 15
 * Tên: Áp suất theo mô hình động học phân tử & Động năng - Nhiệt độ
 * Công nghệ: Three.js (r128) + OrbitControls + GSAP
 * Bản quyền: Vật Lý Xuân Trường (vatlyxuantruong.io.vn)
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SimB15ApSuat = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  class SimulationB15 {
    constructor(container, options = {}) {
      this.container = container;
      this.options = Object.assign({
        isModal: false,
        onCollision: null
      }, options);

      this.animId = null;
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.controls = null;
      this.isDestroyed = false;

      this.state = {
        speedFactor: 1.0,
        isSlowMo: false,
        isHot: false,
        heroOnly: false,
        collisionCount: 0
      };

      this.particles = [];
      this.heroParticle = null;
      this.shockwaves = [];
      this.wallMat = null;
      this.forceArrow = null;
      this.pGroup = null;

      // Kích thước buồng khí vi mô
      this.boxW = 20;
      this.boxH = 13;
      this.boxD = 15;

      this.init();
    }

    init() {
      const w = this.container.clientWidth || 360;
      const h = this.container.clientHeight || 300;

      // 1. Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x070D1E);

      // 2. Camera
      this.camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
      this.camera.position.set(19, 13, 27);

      // 3. Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.container.appendChild(this.renderer.domElement);

      // 4. Controls
      if (typeof THREE.OrbitControls !== 'undefined') {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.maxDistance = 85;
        this.controls.minDistance = 8;
      }

      // 5. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      this.scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(15, 20, 15);
      this.scene.add(dirLight);

      const bluePoint = new THREE.PointLight(0x38bdf8, 1.5, 40);
      bluePoint.position.set(-10, 6, 0);
      this.scene.add(bluePoint);

      // 6. Chamber Wireframe
      const boxGeo = new THREE.BoxGeometry(this.boxW, this.boxH, this.boxD);
      const edges = new THREE.EdgesGeometry(boxGeo);
      const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      const boxWireframe = new THREE.LineSegments(edges, lineMat);
      this.scene.add(boxWireframe);

      // Grid đáy buồng
      const gridHelper = new THREE.GridHelper(this.boxW, 16, 0x1e3a8a, 0x1e293b);
      gridHelper.position.y = -this.boxH / 2;
      this.scene.add(gridHelper);

      // 7. Thành bình chịu lực bên phải (X = +boxW / 2 = 10)
      const wallThick = 0.8;
      const wallGeo = new THREE.BoxGeometry(wallThick, this.boxH, this.boxD);
      this.wallMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x0f172a,
        emissiveIntensity: 0.3
      });
      const wallMesh = new THREE.Mesh(wallGeo, this.wallMat);
      wallMesh.position.set(this.boxW / 2 + wallThick / 2, 0, 0);
      this.scene.add(wallMesh);

      // Viền sáng quanh thành bình
      const wallEdgeGeo = new THREE.EdgesGeometry(wallGeo);
      const wallEdgeMat = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
      const wallEdges = new THREE.LineSegments(wallEdgeGeo, wallEdgeMat);
      wallMesh.add(wallEdges);

      // Mũi tên lực bên ngoài chỉ sang phải (+X)
      const arrowDir = new THREE.Vector3(1, 0, 0);
      const arrowOrigin = new THREE.Vector3(this.boxW / 2 + wallThick + 0.1, 0, 0);
      this.forceArrow = new THREE.ArrowHelper(arrowDir, arrowOrigin, 4.0, 0xdc2626, 1.2, 0.65);
      this.scene.add(this.forceArrow);

      // 8. Shockwave Pool (sóng xung kích va chạm)
      this.shockwaves = [];
      const ringGeo = new THREE.RingGeometry(0.1, 0.45, 24);
      for (let i = 0; i < 3; i++) {
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.y = -Math.PI / 2;
        ring.position.x = this.boxW / 2 - 0.05;
        this.scene.add(ring);
        this.shockwaves.push({ mesh: ring, active: false });
      }

      // 9. Khối hạt khí thông thường (38 hạt)
      const sphereGeo = new THREE.SphereGeometry(0.42, 16, 16);
      this.normalMat = new THREE.MeshPhongMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        shininess: 95
      });

      this.pGroup = new THREE.Group();
      this.scene.add(this.pGroup);
      const PARTICLE_COUNT = 38;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const mesh = new THREE.Mesh(sphereGeo, this.normalMat);
        mesh.position.set(
          (Math.random() - 0.5) * (this.boxW - 2.5),
          (Math.random() - 0.5) * (this.boxH - 2.5),
          (Math.random() - 0.5) * (this.boxD - 2.5)
        );
        const speed = 0.08 + Math.random() * 0.05;
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize().multiplyScalar(speed);

        this.particles.push({ mesh, vel, radius: 0.42 });
        this.pGroup.add(mesh);
      }

      // 10. Hạt tiêu điểm "Hero Molecule" (Đỏ nổi bật, to 0.75, có vector vận tốc)
      const heroGeo = new THREE.SphereGeometry(0.75, 24, 24);
      const heroMat = new THREE.MeshPhongMaterial({
        color: 0xef4444,
        emissive: 0xb91c1c,
        shininess: 100
      });
      const heroMesh = new THREE.Mesh(heroGeo, heroMat);
      heroMesh.position.set(-6, 1.2, 0);
      this.scene.add(heroMesh);

      const heroArrowDir = new THREE.Vector3(1, 0, 0);
      const heroArrow = new THREE.ArrowHelper(heroArrowDir, heroMesh.position, 2.6, 0xfca5a5, 0.8, 0.45);
      this.scene.add(heroArrow);

      const heroVel = new THREE.Vector3(0.14, 0.04, 0.03);
      this.heroParticle = { mesh: heroMesh, vel: heroVel, radius: 0.75, arrow: heroArrow };

      // 11. Bắt đầu vòng lặp Render
      this.animate = this.animate.bind(this);
      this.animate();

      // 12. Lắng nghe resize container
      this.handleResize = this.handleResize.bind(this);
      window.addEventListener('resize', this.handleResize);
    }

    triggerShockwave(y, z, isHero = false) {
      if (typeof gsap === 'undefined') return;
      const sw = this.shockwaves.find(s => !s.active) || this.shockwaves[0];
      sw.active = true;
      sw.mesh.position.y = y;
      sw.mesh.position.z = z;
      sw.mesh.scale.set(1, 1, 1);
      sw.mesh.material.color.set(isHero ? 0xef4444 : 0x38bdf8);
      sw.mesh.material.opacity = 1;

      gsap.to(sw.mesh.scale, {
        x: isHero ? 5.2 : 2.8,
        y: isHero ? 5.2 : 2.8,
        duration: isHero ? 0.6 : 0.3,
        ease: "power2.out"
      });
      gsap.to(sw.mesh.material, {
        opacity: 0,
        duration: isHero ? 0.6 : 0.3,
        ease: "power2.out",
        onComplete: () => { sw.active = false; }
      });

      if (isHero) {
        gsap.to(this.wallMat.emissive, {
          r: 0.95, g: 0.25, b: 0.1,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          onComplete: () => this.wallMat.emissive.setHex(0x0f172a)
        });
        if (this.forceArrow) {
          gsap.fromTo(this.forceArrow.scale, { x: 1.45, y: 1.45, z: 1.45 }, { x: 1, y: 1, z: 1, duration: 0.4, ease: "back.out(2)" });
        }
      }
    }

    animate() {
      if (this.isDestroyed) return;
      this.animId = requestAnimationFrame(this.animate);

      if (this.controls) this.controls.update();

      const dt = this.state.speedFactor;
      const halfW = this.boxW / 2;
      const halfH = this.boxH / 2;
      const halfD = this.boxD / 2;

      // 1. Chuyển động hạt thông thường
      if (!this.state.heroOnly) {
        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          p.mesh.position.addScaledVector(p.vel, dt);

          // Va chạm thành phải (+X)
          if (p.mesh.position.x >= halfW - p.radius) {
            p.mesh.position.x = halfW - p.radius;
            p.vel.x = -Math.abs(p.vel.x);
            this.state.collisionCount++;
            this.triggerShockwave(p.mesh.position.y, p.mesh.position.z, false);
            if (this.options.onCollision) this.options.onCollision(this.state.collisionCount, false);
          } else if (p.mesh.position.x <= -halfW + p.radius) {
            p.mesh.position.x = -halfW + p.radius;
            p.vel.x = Math.abs(p.vel.x);
          }

          // Thành Y
          if (p.mesh.position.y >= halfH - p.radius) {
            p.mesh.position.y = halfH - p.radius;
            p.vel.y = -Math.abs(p.vel.y);
          } else if (p.mesh.position.y <= -halfH + p.radius) {
            p.mesh.position.y = -halfH + p.radius;
            p.vel.y = Math.abs(p.vel.y);
          }

          // Thành Z
          if (p.mesh.position.z >= halfD - p.radius) {
            p.mesh.position.z = halfD - p.radius;
            p.vel.z = -Math.abs(p.vel.z);
          } else if (p.mesh.position.z <= -halfD + p.radius) {
            p.mesh.position.z = -halfD + p.radius;
            p.vel.z = Math.abs(p.vel.z);
          }
        }
      }

      // 2. Chuyển động hạt tiêu điểm Hero Molecule
      if (this.heroParticle) {
        const hp = this.heroParticle;
        hp.mesh.position.addScaledVector(hp.vel, dt);

        if (hp.mesh.position.x >= halfW - hp.radius) {
          hp.mesh.position.x = halfW - hp.radius;
          hp.vel.x = -Math.abs(hp.vel.x);
          this.state.collisionCount++;
          this.triggerShockwave(hp.mesh.position.y, hp.mesh.position.z, true);
          if (this.options.onCollision) this.options.onCollision(this.state.collisionCount, true);
        } else if (hp.mesh.position.x <= -halfW + hp.radius) {
          hp.mesh.position.x = -halfW + hp.radius;
          hp.vel.x = Math.abs(hp.vel.x);
        }

        if (hp.mesh.position.y >= halfH - hp.radius) {
          hp.mesh.position.y = halfH - hp.radius;
          hp.vel.y = -Math.abs(hp.vel.y);
        } else if (hp.mesh.position.y <= -halfH + hp.radius) {
          hp.mesh.position.y = -halfH + hp.radius;
          hp.vel.y = Math.abs(hp.vel.y);
        }

        if (hp.mesh.position.z >= halfD - hp.radius) {
          hp.mesh.position.z = halfD - hp.radius;
          hp.vel.z = -Math.abs(hp.vel.z);
        } else if (hp.mesh.position.z <= -halfD + hp.radius) {
          hp.mesh.position.z = -halfD + hp.radius;
          hp.vel.z = Math.abs(hp.vel.z);
        }

        hp.arrow.position.copy(hp.mesh.position);
        hp.arrow.setDirection(hp.vel.clone().normalize());
      }

      this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
      if (this.isDestroyed || !this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }

    toggleSlowMo() {
      this.state.isSlowMo = !this.state.isSlowMo;
      const base = this.state.isHot ? 1.8 : 1.0;
      const target = this.state.isSlowMo ? 0.2 : base;
      if (typeof gsap !== 'undefined') {
        gsap.to(this.state, { speedFactor: target, duration: 0.35 });
      } else {
        this.state.speedFactor = target;
      }
      return this.state.isSlowMo;
    }

    toggleTemp() {
      this.state.isHot = !this.state.isHot;
      const baseSpeed = this.state.isHot ? 1.8 : 1.0;
      const target = this.state.isSlowMo ? baseSpeed * 0.2 : baseSpeed;
      if (typeof gsap !== 'undefined') {
        gsap.to(this.state, { speedFactor: target, duration: 0.35 });
        gsap.to(this.normalMat.color, {
          r: this.state.isHot ? 0.95 : 0.01,
          g: this.state.isHot ? 0.6 : 0.52,
          b: this.state.isHot ? 0.1 : 0.78,
          duration: 0.4
        });
      } else {
        this.state.speedFactor = target;
      }
      return this.state.isHot;
    }

    toggleMode() {
      this.state.heroOnly = !this.state.heroOnly;
      if (this.pGroup) this.pGroup.visible = !this.state.heroOnly;
      return this.state.heroOnly;
    }

    resetCamera() {
      if (typeof gsap !== 'undefined') {
        gsap.to(this.camera.position, { x: 19, y: 13, z: 27, duration: 0.7, ease: "power2.inOut" });
        if (this.controls) {
          gsap.to(this.controls.target, { x: 0, y: 0, z: 0, duration: 0.7, ease: "power2.inOut" });
        }
      } else {
        this.camera.position.set(19, 13, 27);
        if (this.controls) this.controls.target.set(0, 0, 0);
      }
    }

    destroy() {
      this.isDestroyed = true;
      if (this.animId) cancelAnimationFrame(this.animId);
      window.removeEventListener('resize', this.handleResize);

      if (this.controls) this.controls.dispose();

      // Giải phóng bộ nhớ WebGL
      if (this.scene) {
        this.scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
            else obj.material.dispose();
          }
        });
      }

      if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        this.renderer.dispose();
      }
    }
  }

  return SimulationB15;
});
