/**
 * ============================================================================
 * VICE CITY // NISHANT EKKA PORTFOLIO
 * PART 1: CHARACTER CINEMA STUDIO (INTERACTIVE PHOTO SHOWCASE)
 * PART 2: TROPICAL COASTAL ARCADE CAR-DRIVING MINI-GAME
 * ============================================================================
 */

(function () {
  'use strict';

  // Global Engine Configuration
  const CONFIG = {
    prefersReducedMotion: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    dayNightCycleDuration: 60.0 // seconds per full day/night cycle
  };

  let isStudioVisible = true;
  let isTabActive = !document.hidden;

  // ==========================================================================
  // SCENE 1: CHARACTER CINEMA STUDIO (5 DISTINCT ENVIRONMENTS & ROTATION)
  // ==========================================================================
  class CharacterCinemaStudio {
    constructor() {
      this.panel = document.getElementById('panel-idle');
      this.stage = document.getElementById('showcase-bg-container');
      this.characterRig = document.getElementById('showcase-character-rig');
      this.lightSweep = document.getElementById('showcase-light-sweep');
      this.badge = document.getElementById('showcase-active-env-badge');
      this.timerIndicator = document.getElementById('env-timer-indicator');
      this.btnAuto = document.getElementById('env-btn-auto');

      this.environments = [
        { id: 'sunset', name: 'Sunset Beach', desc: 'Warm coral, peach & orange sky with coastal palms' },
        { id: 'neon', name: 'Neon Downtown', desc: 'Retro skyscrapers, illuminated windows & pink/cyan neon' },
        { id: 'boulevard', name: 'Palm Boulevard', desc: 'Tropical urban avenue, royal palms & warm streetlights' },
        { id: 'oceanfront', name: 'Oceanfront Night', desc: 'Deep navy ocean, specular water ripples & waterfront glow' },
        { id: 'day', name: 'Tropical Day', desc: 'Azure sky, emerald palm canopy & turquoise coastal waters' }
      ];

      this.currentIndex = 0;
      this.currentEnv = 'sunset';
      this.isAutoRotating = true;
      this.autoTimer = null;
      this.intervalMs = 7500;

      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.currentTiltX = 0;
      this.currentTiltY = 0;

      this.init();
    }

    init() {
      this.setupControls();
      this.setupParallaxListeners();
      this.startAutoRotation();
      this.updateUI();
    }

    setupControls() {
      // Previous button
      const btnPrev = document.getElementById('env-btn-prev');
      if (btnPrev) {
        btnPrev.addEventListener('click', () => {
          this.prevEnvironment();
        });
      }

      // Next button
      const btnNext = document.getElementById('env-btn-next');
      if (btnNext) {
        btnNext.addEventListener('click', () => {
          this.nextEnvironment();
        });
      }

      // Auto / Pause toggle
      if (this.btnAuto) {
        this.btnAuto.addEventListener('click', () => {
          this.toggleAutoRotation();
        });
      }

      // Reset button
      const btnReset = document.getElementById('env-btn-reset');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.setEnvironment('sunset', true);
          this.resetView();
        });
      }

      // Direct Pills selector
      const pillsContainer = document.getElementById('env-pills-row');
      if (pillsContainer) {
        pillsContainer.addEventListener('click', (e) => {
          const pill = e.target.closest('.env-pill-btn');
          if (!pill) return;
          const envId = pill.dataset.env;
          if (envId) {
            this.setEnvironment(envId, true);
          }
        });
      }
    }

    setEnvironment(envId, isManual = false) {
      const idx = this.environments.findIndex(e => e.id === envId);
      if (idx !== -1) {
        this.currentIndex = idx;
        this.currentEnv = envId;
      }

      this.updateUI();

      if (isManual) {
        if (this.isAutoRotating) {
          this.startAutoRotation();
        }
      }
    }

    nextEnvironment() {
      this.currentIndex = (this.currentIndex + 1) % this.environments.length;
      this.currentEnv = this.environments[this.currentIndex].id;
      this.updateUI();
      if (this.isAutoRotating) {
        this.startAutoRotation();
      }
    }

    prevEnvironment() {
      this.currentIndex = (this.currentIndex - 1 + this.environments.length) % this.environments.length;
      this.currentEnv = this.environments[this.currentIndex].id;
      this.updateUI();
      if (this.isAutoRotating) {
        this.startAutoRotation();
      }
    }

    toggleAutoRotation() {
      this.isAutoRotating = !this.isAutoRotating;
      if (this.isAutoRotating) {
        this.startAutoRotation();
      } else {
        this.stopAutoRotation();
      }
      this.updateUI();
    }

    startAutoRotation() {
      this.stopAutoRotation();
      this.autoTimer = setInterval(() => {
        if (!isStudioVisible || !isTabActive) return;
        this.currentIndex = (this.currentIndex + 1) % this.environments.length;
        this.currentEnv = this.environments[this.currentIndex].id;
        this.updateUI();
      }, this.intervalMs);
    }

    stopAutoRotation() {
      if (this.autoTimer) {
        clearInterval(this.autoTimer);
        this.autoTimer = null;
      }
    }

    updateUI() {
      const activeObj = this.environments[this.currentIndex];

      // Update Sky & Scenery layers
      const skyLayers = document.querySelectorAll('.showcase-sky-layer');
      skyLayers.forEach(l => {
        if (l.dataset.env === this.currentEnv) l.classList.add('active');
        else l.classList.remove('active');
      });

      const sceneryLayers = document.querySelectorAll('.showcase-scenery-layer');
      sceneryLayers.forEach(l => {
        if (l.dataset.env === this.currentEnv) l.classList.add('active');
        else l.classList.remove('active');
      });

      // Update Panel class
      if (this.panel) {
        this.panel.className = `scene-panel photo-showcase-panel env-${this.currentEnv}`;
      }

      // Update Badge
      if (this.badge) {
        this.badge.textContent = activeObj ? activeObj.name : 'Sunset Beach';
      }

      // Update Pill buttons
      const pills = document.querySelectorAll('.env-pill-btn');
      pills.forEach(p => {
        if (p.dataset.env === this.currentEnv) p.classList.add('active');
        else p.classList.remove('active');
      });

      // Update Auto/Pause Button
      if (this.btnAuto) {
        if (this.isAutoRotating) {
          this.btnAuto.textContent = '⏸ Pause';
          this.btnAuto.classList.add('active');
          if (this.timerIndicator) this.timerIndicator.textContent = 'Auto (7.5s)';
        } else {
          this.btnAuto.textContent = '▶ Auto';
          this.btnAuto.classList.remove('active');
          if (this.timerIndicator) this.timerIndicator.textContent = 'Paused';
        }
      }
    }

    resetView() {
      this.targetTiltX = 0;
      this.targetTiltY = 0;
      this.currentTiltX = 0;
      this.currentTiltY = 0;
      if (this.characterRig) {
        this.characterRig.style.transform = '';
      }
      if (this.lightSweep) {
        this.lightSweep.style.opacity = '0.55';
        this.lightSweep.style.transform = 'translate(-50%, -50%)';
      }
      const layers = document.querySelectorAll('.showcase-scenery-layer');
      layers.forEach(l => l.style.transform = '');
    }

    setupParallaxListeners() {
      if (CONFIG.prefersReducedMotion) return;

      const stage = document.getElementById('main-studio-stage');
      if (!stage) return;

      const onPointerMove = (e) => {
        const rect = stage.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2);

        const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
        const normY = Math.max(-1, Math.min(1, ((clientY - rect.top) / rect.height) * 2 - 1));

        this.targetTiltY = normX * 4.5;
        this.targetTiltX = -normY * 3.0;

        if (this.lightSweep) {
          const sweepX = 50 + normX * 18;
          const sweepY = 50 + normY * 18;
          this.lightSweep.style.transform = `translate(-${sweepX}%, -${sweepY}%)`;
          this.lightSweep.style.opacity = '0.65';
        }

        const activeScenery = document.querySelector('.showcase-scenery-layer.active');
        if (activeScenery) {
          activeScenery.style.transform = `translate(${(-normX * 8).toFixed(1)}px, ${(-normY * 4).toFixed(1)}px)`;
        }
      };

      stage.addEventListener('mousemove', onPointerMove, { passive: true });
      stage.addEventListener('touchmove', onPointerMove, { passive: true });

      stage.addEventListener('mouseleave', () => {
        this.targetTiltX = 0;
        this.targetTiltY = 0;
        if (this.lightSweep) {
          this.lightSweep.style.opacity = '0.55';
        }
      });
    }

    update(delta) {
      if (CONFIG.prefersReducedMotion) return;

      this.currentTiltX += (this.targetTiltX - this.currentTiltX) * Math.min(1.0, delta * 6.0);
      this.currentTiltY += (this.targetTiltY - this.currentTiltY) * Math.min(1.0, delta * 6.0);

      if (this.characterRig) {
        this.characterRig.style.transform = `perspective(1000px) rotateX(${this.currentTiltX.toFixed(2)}deg) rotateY(${this.currentTiltY.toFixed(2)}deg)`;
      }
    }
  }

  // ==========================================================================
  // SCENE 2: BRANCHING TYPEWRITER DIALOGUE ENGINE
  // ==========================================================================
  class DialogueEngine {
    constructor() {
      this.viewport = document.getElementById('dialogue-text-viewport');
      this.textContent = document.getElementById('dialogue-text-content');
      this.cursor = document.getElementById('dialogue-cursor');
      this.btnContinue = document.getElementById('dialogue-btn-continue');
      this.btnLabel = document.getElementById('dialogue-btn-label');
      this.btnTopics = document.getElementById('dialogue-btn-topics');
      this.btnRestart = document.getElementById('dialogue-btn-restart');
      this.choicesCluster = document.getElementById('dialogue-choices-cluster');
      this.statusPill = document.getElementById('dialogue-status-pill');
      this.progressIndicator = document.getElementById('dialogue-progress');

      this.introLines = [
        "Hey, I'm Nishant Ekka. Welcome to my world.",
        "I'm a technologist and creative builder focused on high-performance software, robotics, and interactive experiences.",
        "It's not just code—it's about building systems with impact, precision, and style. Select a topic below to explore deeper."
      ];

      this.topicBranches = {
        software: [
          "In full-stack engineering, I architect scalable web applications using TypeScript, React, Node.js, and Python.",
          "I prioritize clean modular patterns, responsive UI architectures, and resilient REST/GraphQL APIs that stay fast at scale."
        ],
        robotics: [
          "In hardware and IoT, I engineered SafePulse—an intelligent biomedical health tracker with real-time vitals telemetry.",
          "I also designed AquaSense, uniting ESP32 microcontrollers, water sensor arrays, and cloud monitoring."
        ],
        creative: [
          "Creatively, I craft real-time 3D web engines like this Vice City simulation, utilizing Three.js and custom GLSL shader physics.",
          "I believe the best technology should feel alive, cinematic, and genuinely exciting to interact with."
        ]
      };

      this.currentMode = 'intro';
      this.currentTopic = null;
      this.lineIndex = 0;
      this.activeLines = this.introLines;

      this.isTyping = false;
      this.typewriterTimer = null;
      this.currentFullText = '';
      this.charIndex = 0;

      this.init();
    }

    init() {
      this.setupListeners();
      this.startLine(0);
    }

    setupListeners() {
      if (this.btnContinue) {
        this.btnContinue.addEventListener('click', () => {
          this.handleAdvance();
        });
      }

      if (this.viewport) {
        this.viewport.addEventListener('click', () => {
          this.handleAdvance();
        });
      }

      if (this.choicesCluster) {
        this.choicesCluster.addEventListener('click', (e) => {
          const btn = e.target.closest('.dialogue-choice-btn');
          if (!btn) return;
          const topic = btn.dataset.topic;
          if (topic && this.topicBranches[topic]) {
            this.startTopic(topic);
          }
        });
      }

      if (this.btnTopics) {
        this.btnTopics.addEventListener('click', () => {
          this.toggleChoicesCluster();
        });
      }

      if (this.btnRestart) {
        this.btnRestart.addEventListener('click', () => {
          this.restart();
        });
      }

      window.addEventListener('keydown', (e) => {
        const talkRadio = document.getElementById('scene-toggle-talk');
        if (talkRadio && talkRadio.checked) {
          if (e.key === ' ' || e.key === 'Enter') {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              this.handleAdvance();
            }
          }
        }
      });
    }

    handleAdvance() {
      if (this.isTyping) {
        this.completeTypingImmediately();
      } else {
        if (this.lineIndex + 1 < this.activeLines.length) {
          this.startLine(this.lineIndex + 1);
        } else {
          this.showChoicesCluster();
        }
      }
    }

    startLine(idx) {
      this.lineIndex = idx;
      this.currentFullText = this.activeLines[this.lineIndex] || '';
      this.charIndex = 0;
      this.isTyping = true;

      if (this.textContent) {
        this.textContent.textContent = '';
      }
      if (this.btnLabel) {
        this.btnLabel.textContent = 'Skip ⏭';
      }
      if (this.statusPill) {
        this.statusPill.textContent = 'TRANSMITTING';
        this.statusPill.style.background = 'var(--neon-pink)';
      }

      this.updateProgress();

      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }

      if (CONFIG.prefersReducedMotion) {
        this.completeTypingImmediately();
        return;
      }

      this.typewriterTimer = setInterval(() => {
        if (this.charIndex < this.currentFullText.length) {
          this.charIndex++;
          if (this.textContent) {
            this.textContent.textContent = this.currentFullText.slice(0, this.charIndex);
          }
        } else {
          this.finishTyping();
        }
      }, 26);
    }

    completeTypingImmediately() {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      this.charIndex = this.currentFullText.length;
      if (this.textContent) {
        this.textContent.textContent = this.currentFullText;
      }
      this.finishTyping();
    }

    finishTyping() {
      if (this.typewriterTimer) {
        clearInterval(this.typewriterTimer);
        this.typewriterTimer = null;
      }
      this.isTyping = false;

      if (this.btnLabel) {
        if (this.lineIndex + 1 < this.activeLines.length) {
          this.btnLabel.textContent = 'Continue ▶';
        } else {
          this.btnLabel.textContent = 'Explore Topics 💬';
        }
      }

      if (this.statusPill) {
        this.statusPill.textContent = 'LIVE';
        this.statusPill.style.background = 'var(--hud-green)';
      }

      if (this.lineIndex + 1 >= this.activeLines.length) {
        this.showChoicesCluster();
      }
    }

    startTopic(topicKey) {
      this.currentMode = 'topic';
      this.currentTopic = topicKey;
      this.activeLines = this.topicBranches[topicKey];
      this.hideChoicesCluster();
      this.startLine(0);
    }

    showChoicesCluster() {
      if (this.choicesCluster) {
        this.choicesCluster.style.display = 'block';
      }
    }

    hideChoicesCluster() {
      if (this.choicesCluster) {
        this.choicesCluster.style.display = 'none';
      }
    }

    toggleChoicesCluster() {
      if (!this.choicesCluster) return;
      if (this.choicesCluster.style.display === 'none') {
        this.showChoicesCluster();
      } else {
        this.hideChoicesCluster();
      }
    }

    restart() {
      this.currentMode = 'intro';
      this.currentTopic = null;
      this.activeLines = this.introLines;
      this.hideChoicesCluster();
      this.startLine(0);
    }

    updateProgress() {
      if (!this.progressIndicator) return;
      if (this.currentMode === 'intro') {
        this.progressIndicator.textContent = `${this.lineIndex + 1} / ${this.activeLines.length}`;
      } else {
        const topicName = this.currentTopic ? this.currentTopic.toUpperCase() : 'TOPIC';
        this.progressIndicator.textContent = `${topicName} (${this.lineIndex + 1}/${this.activeLines.length})`;
      }
    }
  }

  // ==========================================================================
  // PART 2: TROPICAL COASTAL ARCADE CAR-DRIVING MINI-GAME (THREE.JS)
  // ==========================================================================
  class ArcadeCarGame {
    constructor(container) {
      this.container = container;
      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // Game Entities
      this.carGroup = null;
      this.frontLeftWheel = null;
      this.frontRightWheel = null;
      this.rearLeftWheel = null;
      this.rearRightWheel = null;
      this.allWheels = [];
      this.spotlights = [];
      this.underglow = null;
      this.taillight = null;

      // Scenery Arrays
      this.trafficCars = [];
      this.roadStripes = [];
      this.palmTrees = [];
      this.streetlights = [];
      this.cityBuildings = [];
      this.oceanMesh = null;
      this.sunLight = null;
      this.ambientLight = null;

      // Driving Physics State
      this.speedMPH = 0;           // current speed (-15 to +130 MPH)
      this.targetThrottle = 0;     // -1 (reverse/brake), 0 (coast), 1 (gas)
      this.steerInput = 0;         // -1 (left) to 1 (right)
      this.posX = 0;               // lateral lane position (-5.2 to +5.2)
      this.steerAngle = 0;         // front wheel visual steering angle
      this.chassisRoll = 0;        // body roll during turns
      this.chassisPitch = 0;       // acceleration squat / brake dive
      this.distanceMiles = 0;
      this.isPaused = false;
      this.cameraMode = 'chase';   // 'chase', 'side', 'hood'

      // Controls State
      this.keys = { forward: false, backward: false, left: false, right: false, handbrake: false };

      // Day/Night Cycle State
      this.autoCycle = true;
      this.cycleTime = 12.0;       // start in bright golden sunset (0 = Day, 15 = Sunset, 30 = Dusk, 45 = Night)
      this.manualEnvironment = null;

      this.init();
    }

    init() {
      if (!window.THREE) {
        console.warn('[Vice City Engine] Three.js not loaded. Game unavailable.');
        return;
      }

      const width = this.container.clientWidth || 900;
      const height = this.container.clientHeight || 520;

      // Scene & Fog
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xff8a50, 0.012);

      // Camera
      this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 350);
      this.camera.position.set(0, 1.85, 5.5);
      this.camera.lookAt(0, 0.6, -15);

      // WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      // Lighting Setup
      this.ambientLight = new THREE.AmbientLight(0xffb888, 1.4);
      this.scene.add(this.ambientLight);

      this.sunLight = new THREE.DirectionalLight(0xffa055, 2.4);
      this.sunLight.position.set(-30, 25, -60);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.scene.add(this.sunLight);

      // 1. Build Coastal Highway & Turquoise Ocean
      this.buildCoastalEnvironment();

      // 2. Build Detailed 3D Exotic Sports Car with Rotating Wheels
      this.buildSupercar();

      // 3. Setup Input Listeners (Keyboard & Mobile Touch Controls)
      this.setupControls();

      // 4. Setup HUD Telemetry & Game Buttons
      this.setupHUDControls();
    }

    buildCoastalEnvironment() {
      // Main Highway Asphalt Road
      const roadGeo = new THREE.PlaneGeometry(15, 300, 1, 30);
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1626, roughness: 0.85, metalness: 0.15 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -80);
      road.receiveShadow = true;
      this.scene.add(road);

      // Highway Curbs with Neon Edge Glow
      [-7.2, 7.2].forEach(x => {
        const curbGeo = new THREE.BoxGeometry(0.55, 0.22, 300);
        const curbMat = new THREE.MeshStandardMaterial({ color: 0x332545, roughness: 0.5 });
        const curb = new THREE.Mesh(curbGeo, curbMat);
        curb.position.set(x, 0.11, -80);
        this.scene.add(curb);

        const neonStrip = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.06, 300),
          new THREE.MeshBasicMaterial({ color: 0xff2a85 })
        );
        neonStrip.position.set(x + (x > 0 ? -0.28 : 0.28), 0.22, -80);
        this.scene.add(neonStrip);
      });

      // Streaming Center Dashed Road Markings
      const stripeGeo = new THREE.PlaneGeometry(0.3, 4.2);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
      for (let i = 0; i < 28; i++) {
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(0, 0.02, -160 + i * 11);
        this.scene.add(stripe);
        this.roadStripes.push(stripe);
      }

      // Coastal Turquoise Ocean (Left of highway)
      const oceanGeo = new THREE.PlaneGeometry(80, 300, 20, 20);
      const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x05b8cc, // Turquoise tropical water
        roughness: 0.2,
        metalness: 0.85,
        transparent: true,
        opacity: 0.92
      });
      this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
      this.oceanMesh.rotation.x = -Math.PI / 2;
      this.oceanMesh.position.set(-48, -0.4, -80);
      this.scene.add(this.oceanMesh);

      // Tropical Palm Trees & Streetlights (Enriched on both highway sides)
      for (let i = 0; i < 20; i++) {
        const z = -170 + i * 16;

        // Palm Trees on Roadside & Coastal Verge (Both Sides)
        [9.5, 14.5, -9.5, -13.5].forEach(x => {
          const palm = this.createPalmTree();
          palm.position.set(x, 0, z + (x < 0 ? 6 : 0));
          this.scene.add(palm);
          this.palmTrees.push(palm);
        });

        // Art Deco Streetlights along both curbs curving inward
        [-8.2, 8.2].forEach(x => {
          const streetLight = this.createStreetlight(x < 0);
          streetLight.position.set(x, 0, z);
          this.scene.add(streetLight);
          this.streetlights.push(streetLight);
        });

        // Distant Vice City Skyline Buildings (Far Right)
        if (i % 2 === 0) {
          const building = this.createCityBuilding();
          building.position.set(28 + (i % 3) * 6, 0, z);
          this.scene.add(building);
          this.cityBuildings.push(building);
        }
      }

      // Initialize Light Highway Traffic (Sparse 80s vehicles)
      this.buildTraffic();
    }

    createPalmTree() {
      const group = new THREE.Group();

      // Slender Curved Trunk
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3224, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 7.5, 8), trunkMat);
      trunk.position.y = 3.75;
      trunk.rotation.z = -0.06;
      trunk.castShadow = true;
      group.add(trunk);

      // Lush Tropical Palm Fronds
      const frondMat = new THREE.MeshStandardMaterial({ color: 0x1c663a, roughness: 0.75 });
      for (let f = 0; f < 7; f++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.9, 3.8, 5), frondMat);
        frond.position.set(0, 7.4, 0);
        frond.rotation.z = (f % 2 === 0 ? 0.95 : -0.95);
        frond.rotation.y = (f / 7) * Math.PI * 2;
        group.add(frond);
      }
      return group;
    }

    createStreetlight(isLeft = false) {
      const group = new THREE.Group();
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x221838, metalness: 0.85, roughness: 0.3 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 6.2, 8), poleMat);
      pole.position.y = 3.1;
      group.add(pole);

      // Glowing Cyan Head curving inward over the roadway
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      lamp.position.set(isLeft ? 0.75 : -0.75, 6.0, 0);
      group.add(lamp);
      return group;
    }

    createCityBuilding() {
      const h = 18 + Math.random() * 22;
      const w = 8 + Math.random() * 6;
      const d = 10 + Math.random() * 8;
      const colors = [0x22163b, 0x192742, 0x3d1b40, 0x16333d];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const bMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.5 });
      const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
      building.position.y = h / 2;
      return building;
    }

    buildTraffic() {
      // 4 distinct 80s vehicles traveling at varying cruising speeds
      const trafficDefs = [
        { name: 'Turquoise Cruiser', color: 0x00c4cc, x: -2.6, z: -55, speedMPH: 46 },
        { name: 'Gold Classic', color: 0xd49b28, x: 2.6, z: -105, speedMPH: 52 },
        { name: 'Coral Sport', color: 0xee4466, x: -2.6, z: -165, speedMPH: 58 },
        { name: 'Ivory Sedan', color: 0xe8e8e8, x: 2.6, z: -225, speedMPH: 50 }
      ];

      trafficDefs.forEach(def => {
        const car = this.createTrafficCar(def.color);
        car.group.position.set(def.x, 0.38, def.z);
        this.scene.add(car.group);
        this.trafficCars.push({
          group: car.group,
          wheels: car.wheels,
          headlights: car.headlights,
          taillights: car.taillights,
          laneX: def.x,
          speedMPH: def.speedMPH,
          baseSpeedMPH: def.speedMPH
        });
      });
    }

    createTrafficCar(bodyColor) {
      const group = new THREE.Group();

      // Lower Car Body
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.32,
        metalness: 0.65
      });
      const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.52, 4.4), bodyMat);
      lowerBody.position.y = 0.26;
      lowerBody.castShadow = true;
      group.add(lowerBody);

      // Cabin / Greenhouse
      const cabinMat = new THREE.MeshStandardMaterial({
        color: 0x120c1e,
        roughness: 0.1,
        metalness: 0.85
      });
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.45, 2.3), cabinMat);
      cabin.position.set(0, 0.72, -0.15);
      group.add(cabin);

      // Bumpers
      const bumperMat = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5 });
      const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.18, 0.25), bumperMat);
      frontBumper.position.set(0, 0.15, -2.25);
      group.add(frontBumper);

      const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.18, 0.25), bumperMat);
      rearBumper.position.set(0, 0.15, 2.25);
      group.add(rearBumper);

      // Headlights (facing forward in traffic direction -z)
      const headMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
      const leftHead = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), headMat);
      leftHead.position.set(-0.65, 0.35, -2.22);
      group.add(leftHead);

      const rightHead = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), headMat);
      rightHead.position.set(0.65, 0.35, -2.22);
      group.add(rightHead);

      // Taillights
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xee1133 });
      const leftTail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.08), tailMat);
      leftTail.position.set(-0.65, 0.35, 2.22);
      group.add(leftTail);

      const rightTail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.08), tailMat);
      rightTail.position.set(0.65, 0.35, 2.22);
      group.add(rightTail);

      // 4 Wheels
      const wheels = [];
      const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 14);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.9 });
      const wheelPositions = [
        [-0.98, 0.16, -1.35],
        [0.98, 0.16, -1.35],
        [-0.98, 0.16, 1.35],
        [0.98, 0.16, 1.35]
      ];

      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeo, tireMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(pos[0], pos[1], pos[2]);
        group.add(wheel);
        wheels.push(wheel);
      });

      return {
        group,
        wheels,
        headlights: [leftHead, rightHead],
        taillights: [leftTail, rightTail]
      };
    }

    buildSupercar() {
      this.carGroup = new THREE.Group();
      this.carGroup.position.set(0, 0.44, 0);
      this.scene.add(this.carGroup);

      // Materials
      const paintMat = new THREE.MeshStandardMaterial({
        color: 0xd60b44, // Vibrant Cherry Red
        roughness: 0.22,
        metalness: 0.88
      });

      const glassMat = new THREE.MeshStandardMaterial({
        color: 0x100820,
        roughness: 0.1,
        metalness: 0.92,
        transparent: true,
        opacity: 0.88
      });

      const trimMat = new THREE.MeshStandardMaterial({ color: 0x0e0e12, roughness: 0.8 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.15 });
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.9 });
      const brakeDiscMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.25 });
      const caliperMat = new THREE.MeshStandardMaterial({ color: 0xee1122, roughness: 0.3 });
      const yellowGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff075 });
      const redGlowMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });

      // 1. Lower Wedge Chassis
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.02, 0.42, 4.4), paintMat);
      chassis.position.y = 0.14;
      chassis.castShadow = true;
      this.carGroup.add(chassis);

      // Front Splitter
      const splitter = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.08, 0.42), trimMat);
      splitter.position.set(0, -0.04, -2.15);
      this.carGroup.add(splitter);

      // 2. Aerodynamic Hood
      const hood = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.24, 1.45), paintMat);
      hood.position.set(0, 0.14, -1.75);
      hood.rotation.x = 0.14;
      this.carGroup.add(hood);

      // Pop-up Headlights
      [-0.65, 0.65].forEach(x => {
        const pod = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.22), paintMat);
        pod.position.set(x, 0.24, -2.12);
        this.carGroup.add(pod);

        const lens = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.04), yellowGlowMat);
        lens.position.set(x, 0.24, -2.23);
        this.carGroup.add(lens);
      });

      // 3. Cabin & Greenhouse
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.48, 2.05), glassMat);
      cabin.position.set(0, 0.52, 0.08);
      this.carGroup.add(cabin);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.04, 1.62), paintMat);
      roof.position.set(0, 0.77, 0.08);
      this.carGroup.add(roof);

      // Side Mirrors
      [-0.88, 0.88].forEach(x => {
        const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.09, 0.12), paintMat);
        mirror.position.set(x, 0.55, -0.65);
        this.carGroup.add(mirror);
      });

      // 4. Testarossa Side Strakes
      [-1.03, 1.03].forEach(x => {
        for (let s = 0; s < 5; s++) {
          const strake = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 1.35), trimMat);
          strake.position.set(x, 0.06 + s * 0.07, 0.32);
          this.carGroup.add(strake);
        }
      });

      // 5. Rear Louvered Deck & Wing
      const deck = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.1), trimMat);
      deck.position.set(0, 0.42, 1.45);
      this.carGroup.add(deck);

      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.06, 0.42), paintMat);
      wing.position.set(0, 0.65, 2.05);
      this.carGroup.add(wing);

      // 6. Illuminated Tail Light & Dual Exhausts
      this.taillight = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.12, 0.06), redGlowMat);
      this.taillight.position.set(0, 0.26, 2.22);
      this.carGroup.add(this.taillight);

      [-0.55, -0.42, 0.42, 0.55].forEach(x => {
        const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), chromeMat);
        exhaust.rotation.x = Math.PI / 2;
        exhaust.position.set(x, -0.04, 2.26);
        this.carGroup.add(exhaust);
      });

      // 7. Volumetric Headlights & Neon Underglow
      [-0.65, 0.65].forEach(x => {
        const spot = new THREE.SpotLight(0xfff075, 4.2, 40, Math.PI / 5.5, 0.45);
        spot.position.set(x, 0.28, -2.2);
        spot.target.position.set(x, 0, -30);
        this.carGroup.add(spot);
        this.carGroup.add(spot.target);
        this.spotlights.push(spot);
      });

      this.underglow = new THREE.PointLight(0xff2a85, 3.8, 5.5);
      this.underglow.position.set(0, -0.22, 0);
      this.carGroup.add(this.underglow);

      // 8. 4 ROTATING WHEELS WITH BRAKE CALIPERS & STEERING PIVOTS
      const wheelDefs = [
        { name: 'FL', x: -0.98, y: 0.0, z: -1.35, isFront: true, isLeft: true },
        { name: 'FR', x: 0.98, y: 0.0, z: -1.35, isFront: true, isLeft: false },
        { name: 'RL', x: -0.98, y: 0.0, z: 1.35, isFront: false, isLeft: true },
        { name: 'RR', x: 0.98, y: 0.0, z: 1.35, isFront: false, isLeft: false }
      ];

      wheelDefs.forEach(def => {
        const pivot = new THREE.Group();
        pivot.position.set(def.x, def.y, def.z);

        // Fixed Brake Caliper Group
        const brakeGroup = new THREE.Group();
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), brakeDiscMat);
        disc.rotateZ(Math.PI / 2);
        brakeGroup.add(disc);

        const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.12), caliperMat);
        caliper.position.set(def.isLeft ? 0.02 : -0.02, 0.12, 0);
        brakeGroup.add(caliper);
        pivot.add(brakeGroup);

        // Rotating Wheel Assembly
        const wheel = new THREE.Group();

        // Rubber Tire
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.28, 28), tireMat);
        tire.rotateZ(Math.PI / 2);
        wheel.add(tire);

        // 5-Spoke Alloy Rim
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.29, 20), chromeMat);
        rim.rotateZ(Math.PI / 2);
        wheel.add(rim);

        for (let s = 0; s < 5; s++) {
          const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.21, 0.03), chromeMat);
          spoke.position.x = def.isLeft ? -0.13 : 0.13;
          spoke.rotation.x = (s / 5) * Math.PI * 2;
          wheel.add(spoke);
        }

        pivot.add(wheel);
        this.carGroup.add(pivot);

        const wheelObj = { pivot, wheel, isFront: def.isFront };
        this.allWheels.push(wheelObj);

        if (def.name === 'FL') this.frontLeftWheel = wheelObj;
        if (def.name === 'FR') this.frontRightWheel = wheelObj;
        if (def.name === 'RL') this.rearLeftWheel = wheelObj;
        if (def.name === 'RR') this.rearRightWheel = wheelObj;
      });
    }

    setupControls() {
      // 1. Desktop Keyboard Controls
      const onKeyDown = (e) => {
        // Prevent default only for Arrow keys and Space when driving
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
          const cruiseTab = document.getElementById('scene-toggle-cruise');
          if (cruiseTab && cruiseTab.checked) e.preventDefault();
        }

        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'ArrowUp') this.keys.forward = true;
        if (k === 's' || e.key === 'ArrowDown') this.keys.backward = true;
        if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = true;
        if (k === 'd' || e.key === 'ArrowRight') this.keys.right = true;
        if (e.key === ' ') this.keys.handbrake = true;
        if (k === 'r') this.resetCar();
        if (e.key === 'Escape') this.togglePause();
      };

      const onKeyUp = (e) => {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'ArrowUp') this.keys.forward = false;
        if (k === 's' || e.key === 'ArrowDown') this.keys.backward = false;
        if (k === 'a' || e.key === 'ArrowLeft') this.keys.left = false;
        if (k === 'd' || e.key === 'ArrowRight') this.keys.right = false;
        if (e.key === ' ') this.keys.handbrake = false;
      };

      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);

      // 2. Mobile Touch Buttons
      this.setupMobileTouchControls();
    }

    setupMobileTouchControls() {
      const touchContainer = document.querySelector('.game-touch-controls');
      if (!touchContainer) return;

      const bindTouch = (selector, keyProp) => {
        const el = touchContainer.querySelector(selector);
        if (!el) return;

        const press = (e) => {
          e.preventDefault();
          this.keys[keyProp] = true;
          el.classList.add('touch-active');
        };

        const release = (e) => {
          e.preventDefault();
          this.keys[keyProp] = false;
          el.classList.remove('touch-active');
        };

        el.addEventListener('pointerdown', press);
        el.addEventListener('pointerup', release);
        el.addEventListener('pointercancel', release);
        el.addEventListener('pointerleave', release);
      };

      bindTouch('.touch-btn-left', 'left');
      bindTouch('.touch-btn-right', 'right');
      bindTouch('.touch-btn-gas', 'forward');
      bindTouch('.touch-btn-brake', 'backward');
    }

    setupHUDControls() {
      // Pause button
      const pauseBtn = document.querySelector('.game-btn-pause');
      if (pauseBtn) {
        pauseBtn.addEventListener('click', () => this.togglePause());
      }

      // Reset button
      const resetBtn = document.querySelector('.game-btn-reset');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetCar());
      }

      // Camera Toggle button
      const camBtn = document.querySelector('.game-btn-cam');
      if (camBtn) {
        camBtn.addEventListener('click', () => this.toggleCamera());
      }

      // Day / Sunset / Night / Auto buttons
      const envButtons = document.querySelectorAll('.game-env-btn');
      envButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.gamemode;
          envButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (mode === 'auto') {
            this.autoCycle = true;
            this.manualEnvironment = null;
          } else {
            this.autoCycle = false;
            this.manualEnvironment = mode; // 'day', 'sunset', 'night'
          }
        });
      });
    }

    togglePause() {
      this.isPaused = !this.isPaused;
      const pauseBtn = document.querySelector('.game-btn-pause');
      if (pauseBtn) {
        pauseBtn.textContent = this.isPaused ? '▶ RESUME' : '⏸ PAUSE';
      }
    }

    resetCar() {
      this.speedMPH = 0;
      this.posX = 0;
      this.steerAngle = 0;
      this.chassisRoll = 0;
      this.chassisPitch = 0;
      if (this.carGroup) {
        this.carGroup.position.set(0, 0.44, 0);
        this.carGroup.rotation.set(0, 0, 0);
      }
      if (this.trafficCars) {
        const initZ = [-55, -105, -165, -225];
        this.trafficCars.forEach((c, idx) => {
          c.group.position.set(c.laneX, 0.38, initZ[idx % initZ.length]);
          c.speedMPH = c.baseSpeedMPH;
        });
      }
    }

    toggleCamera() {
      const modes = ['chase', 'side', 'hood'];
      const idx = modes.indexOf(this.cameraMode);
      this.cameraMode = modes[(idx + 1) % modes.length];
    }

    updatePhysics(delta) {
      if (this.isPaused) return;

      // 1. Throttle / Acceleration & Braking Curve
      const maxForwardMPH = 135;
      const maxReverseMPH = -18;
      const accelRate = 42; // MPH per sec
      const brakeRate = 75; // MPH per sec
      const coastFriction = 16; // MPH per sec

      if (this.keys.handbrake) {
        // Handbrake: fast deceleration
        if (this.speedMPH > 0) this.speedMPH = Math.max(0, this.speedMPH - brakeRate * 1.6 * delta);
        else if (this.speedMPH < 0) this.speedMPH = Math.min(0, this.speedMPH + brakeRate * 1.6 * delta);
      } else if (this.keys.forward) {
        // Accelerate
        this.speedMPH = Math.min(maxForwardMPH, this.speedMPH + accelRate * delta);
      } else if (this.keys.backward) {
        // Brake or Reverse
        if (this.speedMPH > 1) {
          this.speedMPH = Math.max(0, this.speedMPH - brakeRate * delta);
        } else {
          this.speedMPH = Math.max(maxReverseMPH, this.speedMPH - accelRate * 0.6 * delta);
        }
      } else {
        // Coasting friction
        if (this.speedMPH > 0) this.speedMPH = Math.max(0, this.speedMPH - coastFriction * delta);
        else if (this.speedMPH < 0) this.speedMPH = Math.min(0, this.speedMPH + coastFriction * delta);
      }

      // 2. Steering & Lateral Movement
      const speedNorm = Math.abs(this.speedMPH) / maxForwardMPH;
      const steerSpeed = (4.5 + speedNorm * 3.5) * delta; // responsive at speed
      const targetSteerAngle = (this.keys.left ? 0.32 : 0) + (this.keys.right ? -0.32 : 0);

      this.steerAngle += (targetSteerAngle - this.steerAngle) * Math.min(1.0, delta * 12.0);

      // Move car laterally along X axis proportional to velocity
      if (Math.abs(this.speedMPH) > 0.5) {
        const dir = this.speedMPH >= 0 ? 1 : -1;
        if (this.keys.left) this.posX -= steerSpeed * dir;
        if (this.keys.right) this.posX += steerSpeed * dir;
      }

      // Road Curbs Clamp & Soft Rebound
      const maxLaneX = 5.2;
      if (this.posX < -maxLaneX) {
        this.posX = -maxLaneX;
        this.speedMPH *= 0.94; // slight curb scrub
      } else if (this.posX > maxLaneX) {
        this.posX = maxLaneX;
        this.speedMPH *= 0.94;
      }

      // 3. Chassis Dynamics (Roll in turns, Pitch during accel/brake)
      const targetRoll = -this.steerAngle * 0.16 * speedNorm;
      this.chassisRoll += (targetRoll - this.chassisRoll) * Math.min(1.0, delta * 10.0);

      const targetPitch = (this.keys.forward ? 0.025 : 0) - (this.keys.backward ? 0.035 : 0);
      this.chassisPitch += (targetPitch - this.chassisPitch) * Math.min(1.0, delta * 8.0);

      // Apply to Car Group
      this.carGroup.position.x = this.posX;
      this.carGroup.rotation.z = this.chassisRoll;
      this.carGroup.rotation.x = this.chassisPitch;
      this.carGroup.rotation.y = this.steerAngle * 0.18;

      // 4. Turn Front Wheels visually on their pivots
      if (this.frontLeftWheel && this.frontRightWheel) {
        this.frontLeftWheel.pivot.rotation.y = this.steerAngle;
        this.frontRightWheel.pivot.rotation.y = this.steerAngle;
      }

      // 5. Rotate all 4 Wheels with actual linear speed: omega = v / r
      const linearSpeed = (this.speedMPH / 85) * 48; // 3D units/sec
      const tireRadius = 0.36;
      const wheelAngularDelta = (linearSpeed / tireRadius) * delta;

      this.allWheels.forEach(w => {
        w.wheel.rotation.x -= wheelAngularDelta;
      });

      // 6. Stream Road & Scenery backward in perspective
      this.roadStripes.forEach(s => {
        s.position.z += linearSpeed * delta;
        if (s.position.z > 20) s.position.z -= 300;
        else if (s.position.z < -280) s.position.z += 300;
      });

      this.palmTrees.forEach(p => {
        p.position.z += linearSpeed * delta;
        if (p.position.z > 25) p.position.z -= 300;
        else if (p.position.z < -275) p.position.z += 300;
      });

      this.streetlights.forEach(sl => {
        sl.position.z += linearSpeed * delta;
        if (sl.position.z > 25) sl.position.z -= 300;
        else if (sl.position.z < -275) sl.position.z += 300;
      });

      this.cityBuildings.forEach(b => {
        b.position.z += linearSpeed * 0.5 * delta; // distant parallax
        if (b.position.z > 35) b.position.z -= 300;
        else if (b.position.z < -265) b.position.z += 300;
      });

      // 7. Light Highway Traffic Physics & Relative Motion
      if (this.trafficCars) {
        this.trafficCars.forEach(car => {
          // Relative motion between player and traffic vehicle
          const relSpeedMPH = this.speedMPH - car.speedMPH;
          const relLinearSpeed = (relSpeedMPH / 85) * 48; // 3D units/sec
          car.group.position.z += relLinearSpeed * delta;

          // Rotate traffic wheels proportional to vehicle cruise speed
          const carWheelAngularDelta = ((car.speedMPH / 85) * 48 / 0.32) * delta;
          car.wheels.forEach(w => {
            w.rotation.x -= carWheelAngularDelta;
          });

          // Gentle organic lane centering with slight micro-variation
          car.group.position.x = car.laneX + Math.sin(car.group.position.z * 0.04) * 0.12;

          // Smooth recycle ahead when overtaken by player
          if (car.group.position.z > 28) {
            car.group.position.z -= 240 + Math.random() * 35;
            car.speedMPH = car.baseSpeedMPH + (Math.random() * 8 - 4);
          } else if (car.group.position.z < -300) {
            car.group.position.z = -75 - Math.random() * 40;
          }
        });
      }

      // Ocean Wave Surface Ripple Animation
      if (this.oceanMesh) {
        this.oceanMesh.position.z += linearSpeed * 0.2 * delta;
        if (this.oceanMesh.position.z > 20) this.oceanMesh.position.z -= 150;
      }

      // Distance traveled accumulator
      if (this.speedMPH > 0) {
        this.distanceMiles += (this.speedMPH / 3600) * delta;
      }

      // Taillight intensity on brake
      if (this.taillight) {
        this.taillight.material.color.setHex(this.keys.backward ? 0xff0000 : 0xaa0033);
      }
    }

    updateEnvironment(delta) {
      // Progress time of day cycle
      if (this.autoCycle) {
        this.cycleTime = (this.cycleTime + delta) % CONFIG.dayNightCycleDuration;
      } else {
        // Smoothly target manual time of day
        let targetTime = 12.0; // sunset
        if (this.manualEnvironment === 'day') targetTime = 0.0;
        else if (this.manualEnvironment === 'sunset') targetTime = 15.0;
        else if (this.manualEnvironment === 'night') targetTime = 42.0;

        this.cycleTime += (targetTime - this.cycleTime) * Math.min(1.0, delta * 3.0);
      }

      // Phase: 0-15 (Day), 15-28 (Sunset), 28-36 (Dusk), 36-52 (Night), 52-60 (Dawn)
      const t = this.cycleTime;
      const d = CONFIG.dayNightCycleDuration;
      const progress = t / d;

      let skyColor = new THREE.Color();
      let sunColor = new THREE.Color();
      let ambientColor = new THREE.Color();
      let fogColor = new THREE.Color();
      let waterColor = new THREE.Color();
      let sunIntensity = 2.4;
      let phaseName = 'DAY';

      if (progress < 0.25) {
        // DAY: Bright blue sky, warm sunlight, turquoise water
        phaseName = 'DAY';
        skyColor.setHex(0x38a8e8);
        sunColor.setHex(0xfffae0);
        ambientColor.setHex(0xbde8ff);
        fogColor.setHex(0x6ec0f0);
        waterColor.setHex(0x05b8cc);
        sunIntensity = 2.5;
        this.spotlights.forEach(s => s.intensity = 0.2);
      } else if (progress < 0.45) {
        // SUNSET: Warm orange, peach, coral pink
        phaseName = 'SUNSET';
        const factor = (progress - 0.25) / 0.20;
        skyColor.lerpColors(new THREE.Color(0x38a8e8), new THREE.Color(0xff5533), factor);
        sunColor.lerpColors(new THREE.Color(0xfffae0), new THREE.Color(0xffaa44), factor);
        ambientColor.lerpColors(new THREE.Color(0xbde8ff), new THREE.Color(0xff9966), factor);
        fogColor.lerpColors(new THREE.Color(0x6ec0f0), new THREE.Color(0xff7744), factor);
        waterColor.lerpColors(new THREE.Color(0x05b8cc), new THREE.Color(0x1a8899), factor);
        sunIntensity = 2.4 - factor * 0.8;
        this.spotlights.forEach(s => s.intensity = 1.0 + factor * 2.5);
      } else if (progress < 0.60) {
        // DUSK: Transition to deep indigo
        phaseName = 'DUSK';
        const factor = (progress - 0.45) / 0.15;
        skyColor.lerpColors(new THREE.Color(0xff5533), new THREE.Color(0x140e2e), factor);
        sunColor.lerpColors(new THREE.Color(0xffaa44), new THREE.Color(0x442266), factor);
        ambientColor.lerpColors(new THREE.Color(0xff9966), new THREE.Color(0x281640), factor);
        fogColor.lerpColors(new THREE.Color(0xff7744), new THREE.Color(0x180d28), factor);
        waterColor.lerpColors(new THREE.Color(0x1a8899), new THREE.Color(0x0a3344), factor);
        sunIntensity = 1.6 - factor * 1.2;
        this.spotlights.forEach(s => s.intensity = 3.5);
      } else if (progress < 0.85) {
        // NIGHT: Deep starry blue, streetlights, car spotlights
        phaseName = 'NIGHT';
        skyColor.setHex(0x090518);
        sunColor.setHex(0x221144);
        ambientColor.setHex(0x1c1033);
        fogColor.setHex(0x0b0616);
        waterColor.setHex(0x041c26);
        sunIntensity = 0.3;
        this.spotlights.forEach(s => s.intensity = 4.2);
      } else {
        // DAWN: Lavender & peach transition back to day
        phaseName = 'DAWN';
        const factor = (progress - 0.85) / 0.15;
        skyColor.lerpColors(new THREE.Color(0x090518), new THREE.Color(0x38a8e8), factor);
        sunColor.lerpColors(new THREE.Color(0x221144), new THREE.Color(0xfffae0), factor);
        ambientColor.lerpColors(new THREE.Color(0x1c1033), new THREE.Color(0xbde8ff), factor);
        fogColor.lerpColors(new THREE.Color(0x0b0616), new THREE.Color(0x6ec0f0), factor);
        waterColor.lerpColors(new THREE.Color(0x041c26), new THREE.Color(0x05b8cc), factor);
        sunIntensity = 0.3 + factor * 2.1;
        this.spotlights.forEach(s => s.intensity = 4.2 - factor * 3.8);
      }

      // Apply to Three.js Scene
      if (this.renderer) this.renderer.setClearColor(skyColor);
      if (this.scene.fog) this.scene.fog.color.copy(fogColor);
      if (this.sunLight) {
        this.sunLight.color.copy(sunColor);
        this.sunLight.intensity = sunIntensity;
      }
      if (this.ambientLight) this.ambientLight.color.copy(ambientColor);
      if (this.oceanMesh) this.oceanMesh.material.color.copy(waterColor);

      // Synchronize Traffic Headlights & Taillights with Day/Night Lighting
      if (this.trafficCars) {
        const isDark = (phaseName === 'NIGHT' || phaseName === 'DUSK');
        this.trafficCars.forEach(car => {
          car.headlights.forEach(h => {
            h.material.color.setHex(isDark ? 0xfffae0 : 0xaa9988);
          });
          car.taillights.forEach(t => {
            t.material.color.setHex(isDark ? 0xff1133 : 0x881122);
          });
        });
      }

      // Update HUD Environment Status Tag
      const statusPill = document.querySelector('.game-env-status-pill');
      if (statusPill) {
        const modeLabel = this.autoCycle ? 'AUTO' : 'MANUAL';
        statusPill.textContent = `[${modeLabel}: ${phaseName}]`;
      }
    }

    updateCamera(delta) {
      if (!this.camera) return;

      if (this.cameraMode === 'chase') {
        const targetCamX = this.posX * 0.72; // slight follow lead
        const targetCamZ = 5.4 + (this.speedMPH / 135) * 0.8; // speed pull-back
        this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1.0, delta * 8.0);
        this.camera.position.y = 1.85 + (this.speedMPH / 135) * 0.2;
        this.camera.position.z = targetCamZ;
        this.camera.lookAt(this.posX * 0.4, 0.65, -18);
      } else if (this.cameraMode === 'side') {
        this.camera.position.set(this.posX + 3.8, 0.75, 0.8);
        this.camera.lookAt(this.posX, 0.45, -2.6);
      } else if (this.cameraMode === 'hood') {
        this.camera.position.set(this.posX, 0.96, -0.25);
        this.camera.lookAt(this.posX + this.steerAngle * 4, 0.8, -32);
      }
    }

    updateHUD() {
      // 1. Digital Speedometer & Tachometer
      const speedValueEl = document.querySelector('.game-speedo-val');
      const revBarEl = document.querySelector('.game-rev-fill');
      if (speedValueEl) {
        speedValueEl.textContent = `${Math.round(this.speedMPH)}`;
      }
      if (revBarEl) {
        const pct = Math.min(100, (Math.abs(this.speedMPH) / 135) * 100);
        revBarEl.style.width = `${pct}%`;
      }

      // 2. Distance Traveled
      const distEl = document.querySelector('.game-distance-val');
      if (distEl) {
        distEl.textContent = `${this.distanceMiles.toFixed(1)} MI`;
      }
    }

    update(delta) {
      this.updatePhysics(delta);
      this.updateEnvironment(delta);
      this.updateCamera(delta);
      this.updateHUD();
    }

    render() {
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    }

    resize(width, height) {
      if (!this.camera || !this.renderer) return;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  }

  // ==========================================================================
  // SCENE 4: TACTICAL STANCE & ROOFTOP VISTA ENGINE
  // ==========================================================================
  class TacticalStanceEngine {
    constructor() {
      this.panel = document.getElementById('panel-action');
      this.btnStrike = document.getElementById('tactical-strike-btn');
      this.btnReset = document.getElementById('tactical-reset-btn');
      this.camButtons = document.querySelectorAll('.tactical-cam-btn');
      this.currentPreset = 'front';
      this.isShaking = false;

      this.init();
    }

    init() {
      this.setupCameraPresets();
      this.setupStrikeTrigger();
    }

    setupCameraPresets() {
      const group = document.querySelector('.tactical-cam-btn-group');
      if (!group) return;

      group.addEventListener('click', (e) => {
        const btn = e.target.closest('.tactical-cam-btn');
        if (!btn) return;
        const preset = btn.dataset.preset;
        if (preset) {
          this.setCameraPreset(preset);
        }
      });

      if (this.btnReset) {
        this.btnReset.addEventListener('click', () => {
          this.setCameraPreset('front');
        });
      }
    }

    setCameraPreset(preset) {
      this.currentPreset = preset;

      if (this.panel) {
        this.panel.classList.remove('cam-preset-front', 'cam-preset-portrait', 'cam-preset-wide');
        this.panel.classList.add(`cam-preset-${preset}`);
      }

      this.camButtons.forEach(btn => {
        if (btn.dataset.preset === preset) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    setupStrikeTrigger() {
      if (!this.btnStrike) return;

      this.btnStrike.addEventListener('click', () => {
        if (this.isShaking) return;
        this.isShaking = true;

        if (this.panel) {
          this.panel.classList.add('shaking');
        }

        setTimeout(() => {
          if (this.panel) {
            this.panel.classList.remove('shaking');
          }
          this.isShaking = false;
        }, 460);
      });
    }
  }

  // ==========================================================================
  // MAIN ENGINE ORCHESTRATOR
  // ==========================================================================
  class ViceCityEngine {
    constructor() {
      this.photoStudio = null;
      this.dialogueEngine = null;
      this.carGame = null;
      this.tacticalEngine = null;
      this.activeTab = 'idle';
      this.lastTimestamp = 0;
      this.rafId = null;

      this.init();
    }

    init() {
      // 1. Initialize Scene 1: Character Cinema Studio
      this.photoStudio = new CharacterCinemaStudio();

      // 2. Initialize Scene 2: Branching Dialogue Engine
      this.dialogueEngine = new DialogueEngine();

      // 3. Initialize Scene 3: Arcade Car Game (Three.js)
      const gameContainer = document.getElementById('three-game-viewport');
      if (gameContainer) {
        this.carGame = new ArcadeCarGame(gameContainer);
      }

      // 4. Initialize Scene 4: Tactical Stance Engine
      this.tacticalEngine = new TacticalStanceEngine();

      // 5. Bind Tab Switcher Navigation
      this.bindTabNavigation();

      // 6. Lifecycle Listeners
      this.setupLifecycle();

      // Start Master Animation Loop
      this.rafId = requestAnimationFrame(this.loop.bind(this));
    }

    bindTabNavigation() {
      const radios = {
        'scene-toggle-idle': 'idle',
        'scene-toggle-talk': 'talk',
        'scene-toggle-cruise': 'cruise',
        'scene-toggle-action': 'action'
      };

      Object.keys(radios).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.switchTab(radios[id]);
            }
          });
        }
      });
    }

    switchTab(tabName) {
      this.activeTab = tabName;

      // When switching to car game, ensure carGame resizes
      if (tabName === 'cruise' && this.carGame) {
        const container = document.getElementById('three-game-viewport');
        if (container) {
          this.carGame.resize(container.clientWidth, container.clientHeight);
        }
      }
    }

    setupLifecycle() {
      // IntersectionObserver: Pause when studio is scrolled off-screen
      const studioSection = document.getElementById('studio');
      if (studioSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isStudioVisible = entry.isIntersecting;
          });
        }, { threshold: 0.1 });
        observer.observe(studioSection);
      }

      // Visibility API: Pause when browser tab is inactive
      document.addEventListener('visibilitychange', () => {
        isTabActive = !document.hidden;
      });

      // Window Resize with debounce
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const gameContainer = document.getElementById('three-game-viewport');
          if (gameContainer && this.carGame) {
            this.carGame.resize(gameContainer.clientWidth, gameContainer.clientHeight);
          }
        }, 120);
      });
    }

    loop(timestamp) {
      this.rafId = requestAnimationFrame(this.loop.bind(this));

      if (!this.lastTimestamp) this.lastTimestamp = timestamp;
      const delta = Math.min(0.1, (timestamp - this.lastTimestamp) / 1000);
      this.lastTimestamp = timestamp;

      // Pause rendering when tab is hidden or studio is off-screen
      if (!isStudioVisible || !isTabActive) return;

      // Update Scene 1: Character Cinema Studio
      if (this.photoStudio) {
        this.photoStudio.update(delta);
      }

      // Update Scene 3: Arcade Car Game (only renders when game tab is active or loaded)
      if (this.carGame) {
        this.carGame.update(delta);
        this.carGame.render();
      }
    }
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ViceCityEngine());
  } else {
    new ViceCityEngine();
  }

})();
