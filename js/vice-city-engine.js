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
  // ==========================================================================
  // SCENE 3: SYNTHESIZED WEB AUDIO SYSTEM FOR TRAFFIC RACER
  // ==========================================================================
  class ArcadeSoundSystem {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.masterGain = null;
      this.filter = null;
      this.engineGain = null;
      this.engineOsc = null;
      this.subOsc = null;
      this.initialized = false;
      this.isPlayingEngine = false;
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        // 1. Master Output Gain (Comfortable, polite volume)
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.06, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // 2. Low-Pass Filter (Removes harsh digital buzzing, yields deep warm purr)
        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = 'lowpass';
        this.filter.frequency.setValueAtTime(420, this.ctx.currentTime);
        this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);
        this.filter.connect(this.masterGain);

        // 3. Engine Gain Node
        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.engineGain.connect(this.filter);

        // 4. Smooth Triangle Wave (Engine Body)
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = 'triangle';
        this.engineOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
        this.engineOsc.connect(this.engineGain);
        this.engineOsc.start();

        // 5. Sub-Bass Sine Wave (Low rumble)
        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(28, this.ctx.currentTime);
        this.subOsc.connect(this.engineGain);
        this.subOsc.start();

        this.initialized = true;
      } catch (e) {
        console.warn('[Traffic Racer Audio] Web Audio unavailable', e);
      }
    }

    startEngine() {
      if (!this.initialized) this.init();
      if (!this.ctx || this.muted) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isPlayingEngine = true;
      const t = this.ctx.currentTime;
      this.engineGain.gain.setTargetAtTime(0.04, t, 0.1);
    }

    updateEngine(speedRatio, isAccelerating) {
      if (!this.initialized || !this.ctx || this.muted || !this.isPlayingEngine) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const t = this.ctx.currentTime;
      // Frequency rises smoothly with km/h: from 52Hz to 160Hz
      const targetFreq = 52 + speedRatio * 105 + (isAccelerating ? 18 : 0);
      const subFreq = targetFreq * 0.5;
      const filterFreq = 380 + speedRatio * 340;

      this.engineOsc.frequency.setTargetAtTime(targetFreq, t, 0.08);
      this.subOsc.frequency.setTargetAtTime(subFreq, t, 0.08);
      this.filter.frequency.setTargetAtTime(filterFreq, t, 0.08);
      this.engineGain.gain.setTargetAtTime(0.035 + speedRatio * 0.025, t, 0.08);
    }

    stopEngine() {
      this.isPlayingEngine = false;
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
      }
    }

    playCloseCall() {
      if (!this.initialized || !this.ctx || this.muted) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1760, t + 0.12);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.22);
      } catch (e) {}
    }

    playCrash() {
      if (!this.initialized || !this.ctx || this.muted) return;
      try {
        const t = this.ctx.currentTime;
        // Low impact boom
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(115, t);
        osc.frequency.exponentialRampToValueAtTime(32, t + 0.35);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.4);
      } catch (e) {}
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.06, this.ctx.currentTime, 0.05);
      }
      if (this.muted) {
        this.stopEngine();
      } else if (this.initialized) {
        this.startEngine();
      }
      return this.muted;
    }
  }

  // ==========================================================================
  // SCENE 3: COMPLETE 3D TRAFFIC RACER HIGHWAY RACING ENGINE
  // ==========================================================================
  class ArcadeCarGame {
    constructor(container) {
      this.container = container;
      this.scene = null;
      this.camera = null;
      this.renderer = null;

      // Audio System
      this.sound = new ArcadeSoundSystem();

      // Game State Machine: 'menu', 'playing', 'paused', 'crashed'
      this.gameState = 'menu';
      this.isPaused = false;
      this.cameraMode = 'chase'; // 'chase', 'hood', 'side'

      // Career Stats & Scoring (Traffic Racer)
      this.score = 0;
      this.distanceKM = 0;
      this.overtakes = 0;
      this.closeCalls = 0;
      this.topSpeedKMH = 0;
      this.highScore = parseInt(localStorage.getItem('vice_city_tr_highscore') || '0', 10);

      // Driving Physics State (in KM/H)
      this.speedKMH = 0;           // current speed (-25 to 220 km/h)
      this.maxSpeedKMH = 200;      // base top speed
      this.accelRate = 48;         // km/h per sec
      this.brakeRate = 92;         // km/h per sec
      this.coastFriction = 16;     // km/h per sec
      this.posX = 0;               // lateral highway position (-6.8 to +6.8)
      this.steerAngle = 0;         // front wheel visual steering angle
      this.chassisRoll = 0;        // body roll during turns
      this.chassisPitch = 0;       // pitch on accel/brake
      this.crashTimer = 0;         // crash animation cooldown

      // 4 Highway Lanes (X Coordinates)
      this.lanes = [-5.4, -1.8, 1.8, 5.4];

      // Player Car Dimensions (for accurate collision)
      this.playerWidth = 1.9;
      this.playerLength = 4.4;

      // Player Car Group & Parts
      this.carGroup = null;
      this.allWheels = [];
      this.frontLeftPivot = null;
      this.frontRightPivot = null;
      this.spotlights = [];
      this.underglow = null;
      this.taillights = [];

      // Traffic Vehicles Pool
      this.trafficCars = [];
      this.maxTrafficCount = 8;

      // Scenery Arrays
      this.roadStripes = [];
      this.palmTrees = [];
      this.streetlights = [];
      this.cityBuildings = [];
      this.gantries = [];
      this.oceanMesh = null;
      this.sunLight = null;
      this.ambientLight = null;
      this.hemiLight = null;

      // Controls State
      this.keys = { forward: false, backward: false, left: false, right: false, handbrake: false };

      // Continuous 24-Hour Day–Sunset–Night–Sunrise Cycle State
      this.autoCycle = true;
      this.timeOfDayMinutes = 1080; // Start at 18:00 (Golden Vice City Sunset)
      this.cycleDurationSec = 240;  // 4 minutes full 24-hour cycle
      this.manualTargetMinutes = null;

      // Dimension cache to auto-self-heal canvas on tab switch
      this.lastWidth = 0;
      this.lastHeight = 0;

      this.init();
    }

    init() {
      if (!window.THREE) {
        console.warn('[Traffic Racer] Three.js not loaded. Game unavailable.');
        return;
      }

      // Safe container dimension resolution (handles initially hidden tab)
      let width = (this.container && this.container.clientWidth > 50) ? this.container.clientWidth : 960;
      let height = (this.container && this.container.clientHeight > 50) ? this.container.clientHeight : 540;
      this.lastWidth = width;
      this.lastHeight = height;

      // Three.js Scene
      this.scene = new THREE.Scene();

      // Clear, Linear Horizon Fog (Starts at 45m ahead, crystal clear near player)
      this.scene.fog = new THREE.Fog(0xff8866, 45, 280);

      // Camera: Positioned behind and slightly above player's car
      this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 400);
      this.camera.position.set(0, 1.9, 5.8);
      this.camera.lookAt(0, 0.65, -18);

      // WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Clear initial color to warm sunset sky
      const initialSky = new THREE.Color(0xff6644);
      this.scene.background = initialSky;
      this.renderer.setClearColor(initialSky);

      this.container.appendChild(this.renderer.domElement);

      // Lighting Setup (Multi-directional for clear visibility)
      this.ambientLight = new THREE.AmbientLight(0xffeedd, 1.5);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0x70c0ff, 0x332244, 1.2);
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(0xfffae0, 2.2);
      this.sunLight.position.set(25, 45, -30);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.scene.add(this.sunLight);

      // 1. Build 4-Lane Coastal Highway & Ocean Environment
      this.buildCoastalEnvironment();

      // 2. Build Player's Exotic Sports Car
      this.buildSupercar();

      // 3. Build Diverse Traffic Pool (Sedans, SUVs, Vans, Buses, Trucks)
      this.buildTrafficPool();

      // 4. Setup Input Listeners (Keyboard & Touch)
      this.setupControls();

      // 5. Setup UI & Menu Overlays Listeners
      this.setupUIListeners();

      // 6. Set initial Start Menu stats
      const menuBestEl = document.getElementById('menu-best-score');
      if (menuBestEl) menuBestEl.textContent = `${this.highScore} PTS`;
      const hudBestEl = document.getElementById('hud-best-val');
      if (hudBestEl) hudBestEl.textContent = `${this.highScore}`;
    }

    buildCoastalEnvironment() {
      // 4-Lane Asphalt Highway Road (18 units wide, deep visible asphalt)
      const roadGeo = new THREE.PlaneGeometry(18, 340, 1, 34);
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x242033, roughness: 0.75, metalness: 0.15 });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -90);
      road.receiveShadow = true;
      this.scene.add(road);

      // Curbs with Neon Edge Strips on both boundaries (x = -9.0, +9.0)
      [-9.0, 9.0].forEach(x => {
        const curb = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.24, 340),
          new THREE.MeshStandardMaterial({ color: 0x3a284c, roughness: 0.55 })
        );
        curb.position.set(x, 0.12, -90);
        this.scene.add(curb);

        const neonStrip = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.1, 340),
          new THREE.MeshBasicMaterial({ color: 0xff2a85 })
        );
        neonStrip.position.set(x + (x > 0 ? -0.32 : 0.32), 0.25, -90);
        this.scene.add(neonStrip);
      });

      // 3 Continuous Dashed Lane Dividers (at x = -3.6, 0.0, 3.6 - Crisp White)
      const stripeGeo = new THREE.PlaneGeometry(0.25, 4.5);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      [-3.6, 0.0, 3.6].forEach(laneDividerX => {
        for (let i = 0; i < 30; i++) {
          const stripe = new THREE.Mesh(stripeGeo, stripeMat);
          stripe.rotation.x = -Math.PI / 2;
          stripe.position.set(laneDividerX, 0.025, -180 + i * 11.5);
          this.scene.add(stripe);
          this.roadStripes.push(stripe);
        }
      });

      // Turquoise Tropical Ocean (Left of highway)
      const oceanGeo = new THREE.PlaneGeometry(95, 340, 24, 24);
      const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x05b8cc,
        roughness: 0.18,
        metalness: 0.85,
        transparent: true,
        opacity: 0.94
      });
      this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
      this.oceanMesh.rotation.x = -Math.PI / 2;
      this.oceanMesh.position.set(-57, -0.42, -90);
      this.scene.add(this.oceanMesh);

      // Roadside Palm Trees & Streetlights along both sides
      for (let i = 0; i < 22; i++) {
        const z = -190 + i * 16;

        // Palm Trees on Left Seawall and Right Roadside
        [11.5, 16.5, -11.2, -15.5].forEach(x => {
          const palm = this.createPalmTree();
          palm.position.set(x, 0, z + (x < 0 ? 6 : 0));
          this.scene.add(palm);
          this.palmTrees.push(palm);
        });

        // Art Deco Streetlights curving inward over curbs
        [-10.1, 10.1].forEach(x => {
          const streetLight = this.createStreetlight(x < 0);
          streetLight.position.set(x, 0, z);
          this.scene.add(streetLight);
          this.streetlights.push(streetLight);
        });

        // Vice City Skyline Architecture (Right & Background)
        if (i % 2 === 0) {
          const building = this.createCityBuilding();
          building.position.set(30 + (i % 3) * 7, 0, z);
          this.scene.add(building);
          this.cityBuildings.push(building);
        }
      }

      // Overhead Highway Gantry Road Signs (every 90 units)
      [-60, -150, -240].forEach(z => {
        const gantry = this.buildHighwayGantry(z);
        this.scene.add(gantry);
        this.gantries.push(gantry);
      });
    }

    buildHighwayGantry(z) {
      const gantryGroup = new THREE.Group();
      gantryGroup.position.set(0, 0, z);

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x2e2840, metalness: 0.8, roughness: 0.3 });
      // Left and Right Posts
      const leftPost = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 7.8, 8), frameMat);
      leftPost.position.set(-9.8, 3.9, 0);
      gantryGroup.add(leftPost);

      const rightPost = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 7.8, 8), frameMat);
      rightPost.position.set(9.8, 3.9, 0);
      gantryGroup.add(rightPost);

      // Top Crossbar
      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(20.4, 0.35, 0.35), frameMat);
      crossbar.position.set(0, 7.4, 0);
      gantryGroup.add(crossbar);

      // Road Sign Boards (Highway Green)
      const signMat = new THREE.MeshStandardMaterial({ color: 0x0a5238, roughness: 0.4 });
      const signBoard = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.8, 0.15), signMat);
      signBoard.position.set(0, 6.2, 0);
      gantryGroup.add(signBoard);

      // Neon Sign Trim
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(14.7, 0.08, 0.18),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      trim.position.set(0, 5.25, 0);
      gantryGroup.add(trim);

      return gantryGroup;
    }

    createPalmTree() {
      const group = new THREE.Group();
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3e2c, roughness: 0.9 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.36, 7.8, 8), trunkMat);
      trunk.position.y = 3.9;
      trunk.rotation.z = -0.06;
      trunk.castShadow = true;
      group.add(trunk);

      const frondMat = new THREE.MeshStandardMaterial({ color: 0x228045, roughness: 0.7 });
      for (let f = 0; f < 7; f++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.95, 4.0, 5), frondMat);
        frond.position.set(0, 7.6, 0);
        frond.rotation.z = (f % 2 === 0 ? 0.96 : -0.96);
        frond.rotation.y = (f / 7) * Math.PI * 2;
        group.add(frond);
      }
      return group;
    }

    createStreetlight(isLeft = false) {
      const group = new THREE.Group();
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x2e2248, metalness: 0.85, roughness: 0.3 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 6.4, 8), poleMat);
      pole.position.y = 3.2;
      group.add(pole);

      // Glowing Cyan Head curving inward over the roadway
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 8),
        new THREE.MeshBasicMaterial({ color: 0x00f0ff })
      );
      lamp.position.set(isLeft ? 0.85 : -0.85, 6.2, 0);
      group.add(lamp);
      return group;
    }

    createCityBuilding() {
      const h = 20 + Math.random() * 26;
      const w = 9 + Math.random() * 7;
      const d = 11 + Math.random() * 9;
      const colors = [0x2d1f4b, 0x1d3255, 0x4a234f, 0x1d424e];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const bMat = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.5 });
      const building = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), bMat);
      building.position.y = h / 2;
      return building;
    }

    buildSupercar() {
      this.carGroup = new THREE.Group();
      this.carGroup.position.set(0, 0.44, 0);
      this.scene.add(this.carGroup);

      // Vibrant Cherry Red Metallic Paint
      const paintMat = new THREE.MeshStandardMaterial({ color: 0xd60b44, roughness: 0.22, metalness: 0.88 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x100820, roughness: 0.1, metalness: 0.92 });
      const trimMat = new THREE.MeshStandardMaterial({ color: 0x151518, roughness: 0.6 });

      // Lower Chassis & Aerodynamic Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.45, 4.3), paintMat);
      body.position.y = 0.22;
      body.castShadow = true;
      this.carGroup.add(body);

      // Sleek Fastback Cabin
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.44, 2.2), glassMat);
      cabin.position.set(0, 0.62, -0.2);
      this.carGroup.add(cabin);

      // Aerodynamic Rear Wing / Spoiler
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x1a0410, roughness: 0.3 });
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.08, 0.38), wingMat);
      wing.position.set(0, 0.66, 2.05);
      this.carGroup.add(wing);

      // Dual Spotlights / Headlights
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      [-0.65, 0.65].forEach(x => {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.1), headMat);
        h.position.set(x, 0.3, -2.18);
        this.carGroup.add(h);

        // Forward Projecting Spot Beam for night driving
        const spot = new THREE.SpotLight(0xfffae0, 2.8, 65, Math.PI / 7, 0.4, 1.2);
        spot.position.set(x, 0.35, -2.1);
        spot.target.position.set(x, 0, -35);
        this.carGroup.add(spot);
        this.carGroup.add(spot.target);
        this.spotlights.push(spot);
      });

      // Rear Neon Taillight Bar
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xee0022 });
      const taillight = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 0.08), tailMat);
      taillight.position.set(0, 0.35, 2.18);
      this.carGroup.add(taillight);
      this.taillights.push(taillight);

      // Hot Pink Neon Underglow
      this.underglow = new THREE.PointLight(0xff2a85, 2.2, 5.5);
      this.underglow.position.set(0, 0.08, 0);
      this.carGroup.add(this.underglow);

      // 4 Wheels with Steerable Front Pivots
      const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 16);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.95 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.9, roughness: 0.2 });

      const createWheel = () => {
        const wGroup = new THREE.Group();
        const tire = new THREE.Mesh(wheelGeo, tireMat);
        tire.rotation.z = Math.PI / 2;
        wGroup.add(tire);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.27, 12), rimMat);
        rim.rotation.z = Math.PI / 2;
        wGroup.add(rim);
        return wGroup;
      };

      // Front Wheels on Pivots
      this.frontLeftPivot = new THREE.Group();
      this.frontLeftPivot.position.set(-0.98, 0.16, -1.35);
      const flWheel = createWheel();
      this.frontLeftPivot.add(flWheel);
      this.carGroup.add(this.frontLeftPivot);

      this.frontRightPivot = new THREE.Group();
      this.frontRightPivot.position.set(0.98, 0.16, -1.35);
      const frWheel = createWheel();
      this.frontRightPivot.add(frWheel);
      this.carGroup.add(this.frontRightPivot);

      // Rear Wheels
      const rlWheel = createWheel();
      rlWheel.position.set(-0.98, 0.16, 1.35);
      this.carGroup.add(rlWheel);

      const rrWheel = createWheel();
      rrWheel.position.set(0.98, 0.16, 1.35);
      this.carGroup.add(rrWheel);

      // Store wheels directly as groups so w.rotation.x operates smoothly
      this.allWheels = [flWheel, frWheel, rlWheel, rrWheel];
    }

    // ========================================================================
    // 5 DIVERSE TRAFFIC CLASSES (SEDAN, SUV, VAN, BUS, TRUCK)
    // ========================================================================
    buildTrafficPool() {
      const types = ['sedan', 'suv', 'van', 'bus', 'truck', 'sedan', 'suv', 'sedan'];
      const initialZ = [-45, -75, -110, -145, -180, -215, -250, -285];

      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        const carData = this.createVehicle(type);
        const laneX = this.lanes[i % this.lanes.length];
        const z = initialZ[i];

        carData.group.position.set(laneX, 0.38, z);
        this.scene.add(carData.group);

        this.trafficCars.push({
          group: carData.group,
          wheels: carData.wheels,
          headlights: carData.headlights,
          taillights: carData.taillights,
          width: carData.width,
          length: carData.length,
          height: carData.height,
          type: type,
          laneX: laneX,
          speedKMH: carData.baseSpeedKMH,
          baseSpeedKMH: carData.baseSpeedKMH,
          passed: false,
          seed: Math.random() * 10
        });
      }
    }

    createVehicle(type) {
      if (type === 'sedan') return this.createSedan();
      if (type === 'suv') return this.createSUV();
      if (type === 'van') return this.createVan();
      if (type === 'bus') return this.createBus();
      if (type === 'truck') return this.createTruck();
      return this.createSedan();
    }

    createSedan() {
      const colors = [0xf4c430, 0x00d4d4, 0x223355, 0xcc2244, 0xf0f0f0];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.65 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.5, 4.2), bodyMat);
      lower.position.y = 0.25;
      lower.castShadow = true;
      group.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.44, 2.2), new THREE.MeshStandardMaterial({ color: 0x120c1e, roughness: 0.1, metalness: 0.8 }));
      cabin.position.set(0, 0.7, -0.15);
      group.add(cabin);

      const wheels = this.attachTrafficWheels(group, 0.32, 1.85, 2.6);
      const lights = this.attachTrafficLights(group, 1.85, 4.2, 0.32);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 1.85,
        length: 4.2,
        height: 1.25,
        baseSpeedKMH: 80 + Math.random() * 25
      };
    }

    createSUV() {
      const colors = [0xf5f5f5, 0x263238, 0x2e7d32, 0xd84315];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.55 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 4.8), bodyMat);
      lower.position.y = 0.35;
      lower.castShadow = true;
      group.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 2.8), new THREE.MeshStandardMaterial({ color: 0x140e22, roughness: 0.1, metalness: 0.8 }));
      cabin.position.set(0, 0.92, -0.1);
      group.add(cabin);

      const wheels = this.attachTrafficWheels(group, 0.38, 2.1, 3.0);
      const lights = this.attachTrafficLights(group, 2.1, 4.8, 0.42);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.1,
        length: 4.8,
        height: 1.55,
        baseSpeedKMH: 85 + Math.random() * 28
      };
    }

    createVan() {
      const colors = [0xf77f00, 0x009688, 0xe0e0e0, 0x3f51b5];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.45 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.25, 5.2), bodyMat);
      box.position.y = 0.65;
      box.castShadow = true;
      group.add(box);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.45, 0.1), new THREE.MeshStandardMaterial({ color: 0x100818, roughness: 0.1 }));
      windshield.position.set(0, 0.85, -2.62);
      group.add(windshield);

      const wheels = this.attachTrafficWheels(group, 0.35, 2.1, 3.3);
      const lights = this.attachTrafficLights(group, 2.1, 5.2, 0.38);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.1,
        length: 5.2,
        height: 1.8,
        baseSpeedKMH: 70 + Math.random() * 20
      };
    }

    createBus() {
      const colors = [0xff2a85, 0x0288d1, 0xffb300];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.4 });
      const main = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.75, 9.4), bodyMat);
      main.position.y = 0.95;
      main.castShadow = true;
      group.add(main);

      // Long Tinted Window Strip
      const winMat = new THREE.MeshStandardMaterial({ color: 0x100c1e, roughness: 0.1 });
      const winL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 8.2), winMat);
      winL.position.set(-1.18, 1.15, 0);
      group.add(winL);
      const winR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 8.2), winMat);
      winR.position.set(1.18, 1.15, 0);
      group.add(winR);

      const wheels = this.attachTrafficWheels(group, 0.42, 2.35, 6.2);
      const lights = this.attachTrafficLights(group, 2.35, 9.4, 0.45);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.35,
        length: 9.4,
        height: 2.4,
        baseSpeedKMH: 60 + Math.random() * 18
      };
    }

    createTruck() {
      const group = new THREE.Group();

      // Red/Blue Cab
      const cabMat = new THREE.MeshStandardMaterial({ color: 0xbf1a2f, roughness: 0.35, metalness: 0.6 });
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.85, 2.8), cabMat);
      cab.position.set(0, 1.0, -4.1);
      cab.castShadow = true;
      group.add(cab);

      // Large Chrome/White Trailer
      const trailerMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3, metalness: 0.7 });
      const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.1, 7.8), trailerMat);
      trailer.position.set(0, 1.15, 1.4);
      trailer.castShadow = true;
      group.add(trailer);

      const wheels = this.attachTrafficWheels(group, 0.44, 2.4, 7.6);
      const lights = this.attachTrafficLights(group, 2.4, 11.2, 0.48);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.4,
        length: 11.2,
        height: 2.65,
        baseSpeedKMH: 52 + Math.random() * 18
      };
    }

    attachTrafficWheels(group, radius, width, wheelbase) {
      const wheels = [];
      const wheelGeo = new THREE.CylinderGeometry(radius, radius, 0.24, 14);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.95 });
      const halfW = width / 2;
      const halfL = wheelbase / 2;

      [[-halfW, halfL], [halfW, halfL], [-halfW, -halfL], [halfW, -halfL]].forEach(pos => {
        const w = new THREE.Mesh(wheelGeo, tireMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(pos[0], radius, pos[1]);
        group.add(w);
        wheels.push(w);
      });
      return wheels;
    }

    attachTrafficLights(group, width, length, height) {
      const headMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
      const tailMat = new THREE.MeshBasicMaterial({ color: 0xee1122 });
      const halfW = width * 0.38;
      const halfL = length / 2;

      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.08), headMat);
      hl.position.set(-halfW, height, -halfL);
      group.add(hl);

      const hr = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.08), headMat);
      hr.position.set(halfW, height, -halfL);
      group.add(hr);

      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), tailMat);
      tl.position.set(-halfW, height, halfL);
      group.add(tl);

      const tr = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.14, 0.08), tailMat);
      tr.position.set(halfW, height, halfL);
      group.add(tr);

      return { heads: [hl, hr], tails: [tl, tr] };
    }

    // ========================================================================
    // CONTROLS & EVENT LISTENERS
    // ========================================================================
    setupControls() {
      window.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'arrowup') { this.keys.forward = true; e.preventDefault(); }
        if (key === 's' || key === 'arrowdown') { this.keys.backward = true; e.preventDefault(); }
        if (key === 'a' || key === 'arrowleft') { this.keys.left = true; e.preventDefault(); }
        if (key === 'd' || key === 'arrowright') { this.keys.right = true; e.preventDefault(); }
        if (e.code === 'Space') { this.keys.handbrake = true; e.preventDefault(); }
        if (key === 'p' || key === 'escape') { this.togglePause(); e.preventDefault(); }
      });

      window.addEventListener('keyup', e => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'arrowup') this.keys.forward = false;
        if (key === 's' || key === 'arrowdown') this.keys.backward = false;
        if (key === 'a' || key === 'arrowleft') this.keys.left = false;
        if (key === 'd' || key === 'arrowright') this.keys.right = false;
        if (e.code === 'Space') this.keys.handbrake = false;
      });

      this.setupTouchControls();
    }

    setupTouchControls() {
      const bindTouch = (id, keyName) => {
        const btn = document.getElementById(id);
        if (!btn) return;
        const setKey = (active, e) => {
          if (e) e.preventDefault();
          this.keys[keyName] = active;
          btn.classList.toggle('touch-active', active);
        };
        btn.addEventListener('pointerdown', e => setKey(true, e));
        btn.addEventListener('pointerup', e => setKey(false, e));
        btn.addEventListener('pointercancel', e => setKey(false, e));
        btn.addEventListener('pointerleave', e => setKey(false, e));
      };

      bindTouch('touch-gas', 'forward');
      bindTouch('touch-brake', 'backward');
      bindTouch('touch-left', 'left');
      bindTouch('touch-right', 'right');
    }

    setupUIListeners() {
      // Start Race Button
      const btnStart = document.getElementById('btn-start-race');
      if (btnStart) {
        btnStart.addEventListener('click', () => {
          this.startRace();
        });
      }

      // Pause Buttons
      const btnPause = document.getElementById('btn-game-pause');
      if (btnPause) btnPause.addEventListener('click', () => this.togglePause());

      const btnResume = document.getElementById('btn-resume-race');
      if (btnResume) btnResume.addEventListener('click', () => this.resumeRace());

      const btnRestartPause = document.getElementById('btn-restart-from-pause');
      if (btnRestartPause) btnRestartPause.addEventListener('click', () => this.retryRace());

      // Retry & Menu Buttons from Game Over
      const btnRetry = document.getElementById('btn-retry-race');
      if (btnRetry) btnRetry.addEventListener('click', () => this.retryRace());

      const btnMenu = document.getElementById('btn-menu-from-gameover');
      if (btnMenu) btnMenu.addEventListener('click', () => this.showMenu());

      // Audio Toggle Button
      const btnAudio = document.getElementById('btn-game-audio');
      if (btnAudio) {
        btnAudio.addEventListener('click', () => {
          const isMuted = this.sound.toggleMute();
          btnAudio.textContent = isMuted ? '🔇' : '🔊';
          btnAudio.classList.toggle('muted', isMuted);
          this.showToast(isMuted ? 'AUDIO MUTED 🔇' : 'AUDIO ACTIVE 🔊');
        });
      }

      // Camera Switch Button
      const btnCam = document.getElementById('btn-game-cam');
      if (btnCam) btnCam.addEventListener('click', () => this.toggleCamera());

      // Day/Night Mode Buttons
      const envButtons = document.querySelectorAll('.game-env-btn');
      envButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          envButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mode = btn.dataset.gamemode;
          if (mode === 'auto') {
            this.autoCycle = true;
            this.manualTargetMinutes = null;
          } else {
            this.autoCycle = false;
            if (mode === 'day') this.manualTargetMinutes = 720; // 12:00
            else if (mode === 'sunset') this.manualTargetMinutes = 1110; // 18:30
            else if (mode === 'night') this.manualTargetMinutes = 1380; // 23:00
          }
        });
      });
    }

    // ========================================================================
    // GAME RUN LIFECYCLE & STATE TRANSITIONS
    // ========================================================================
    startRace() {
      this.gameState = 'playing';
      this.isPaused = false;
      this.score = 0;
      this.distanceKM = 0;
      this.overtakes = 0;
      this.closeCalls = 0;
      this.topSpeedKMH = 0;
      this.speedKMH = 35; // brisk rolling start
      this.posX = 0;

      // Start sound cleanly
      if (this.sound) {
        this.sound.startEngine();
      }

      // Hide Overlays
      const startOverlay = document.getElementById('game-start-overlay');
      if (startOverlay) startOverlay.style.display = 'none';
      const pauseOverlay = document.getElementById('game-pause-overlay');
      if (pauseOverlay) pauseOverlay.style.display = 'none';
      const goOverlay = document.getElementById('game-gameover-overlay');
      if (goOverlay) goOverlay.style.display = 'none';

      // Reset Traffic positions
      this.resetTrafficPositions();
      this.showToast('RACE STARTED! WATCH FOR TRAFFIC 🚦');
    }

    pauseRace() {
      if (this.gameState !== 'playing') return;
      this.gameState = 'paused';
      this.isPaused = true;
      if (this.sound) this.sound.stopEngine();

      const pauseOverlay = document.getElementById('game-pause-overlay');
      if (pauseOverlay) {
        pauseOverlay.style.display = 'flex';
        const pSpeed = document.getElementById('pause-stat-speed');
        if (pSpeed) pSpeed.textContent = `${Math.round(this.speedKMH)} KM/H`;
        const pDist = document.getElementById('pause-stat-dist');
        if (pDist) pDist.textContent = `${this.distanceKM.toFixed(2)} KM`;
        const pScore = document.getElementById('pause-stat-score');
        if (pScore) pScore.textContent = `${this.score}`;
      }
      const pauseBtn = document.getElementById('btn-game-pause');
      if (pauseBtn) pauseBtn.textContent = '▶ RESUME';
    }

    resumeRace() {
      if (this.gameState !== 'paused') return;
      this.gameState = 'playing';
      this.isPaused = false;

      if (this.sound) this.sound.startEngine();

      const pauseOverlay = document.getElementById('game-pause-overlay');
      if (pauseOverlay) pauseOverlay.style.display = 'none';

      const pauseBtn = document.getElementById('btn-game-pause');
      if (pauseBtn) pauseBtn.textContent = '⏸ PAUSE';
    }

    togglePause() {
      if (this.gameState === 'playing') this.pauseRace();
      else if (this.gameState === 'paused') this.resumeRace();
    }

    retryRace() {
      this.startRace();
    }

    showMenu() {
      this.gameState = 'menu';
      this.isPaused = false;
      this.speedKMH = 0;
      if (this.sound) this.sound.stopEngine();

      const startOverlay = document.getElementById('game-start-overlay');
      if (startOverlay) startOverlay.style.display = 'flex';
      const pauseOverlay = document.getElementById('game-pause-overlay');
      if (pauseOverlay) pauseOverlay.style.display = 'none';
      const goOverlay = document.getElementById('game-gameover-overlay');
      if (goOverlay) goOverlay.style.display = 'none';

      const menuBestEl = document.getElementById('menu-best-score');
      if (menuBestEl) menuBestEl.textContent = `${this.highScore} PTS`;
    }

    triggerCrash(hitCar) {
      if (this.gameState === 'crashed') return;
      this.gameState = 'crashed';

      // Play Sound
      if (this.sound) {
        this.sound.playCrash();
        this.sound.stopEngine();
      }

      // Cut speed sharply
      this.speedKMH = Math.min(this.speedKMH * 0.12, 14);

      // Jolt / spin car
      if (this.carGroup) {
        this.carGroup.rotation.y = (this.posX > hitCar.group.position.x ? -0.35 : 0.35);
        this.carGroup.rotation.z = (Math.random() - 0.5) * 0.4;
      }

      // Check Career High Score
      const isNewBest = this.score > this.highScore;
      if (isNewBest) {
        this.highScore = this.score;
        localStorage.setItem('vice_city_tr_highscore', this.highScore.toString());
      }

      // Fill Game Over Modal Stats
      const goScore = document.getElementById('gameover-score');
      if (goScore) goScore.textContent = `${this.score}`;

      const goBest = document.getElementById('gameover-best');
      if (goBest) goBest.textContent = `${this.highScore}`;

      const goNewBest = document.getElementById('gameover-new-best');
      if (goNewBest) goNewBest.style.display = isNewBest ? 'block' : 'none';

      const goDist = document.getElementById('gameover-distance');
      if (goDist) goDist.textContent = `${this.distanceKM.toFixed(2)} KM`;

      const goPass = document.getElementById('gameover-overtakes');
      if (goPass) goPass.textContent = `${this.overtakes}`;

      const goClose = document.getElementById('gameover-closecalls');
      if (goClose) goClose.textContent = `${this.closeCalls}`;

      const goTopSpeed = document.getElementById('gameover-topspeed');
      if (goTopSpeed) goTopSpeed.textContent = `${Math.round(this.topSpeedKMH)} KM/H`;

      // Show Mission Failed Modal Screen after 0.35s brief impact pause
      setTimeout(() => {
        const goOverlay = document.getElementById('game-gameover-overlay');
        if (goOverlay) goOverlay.style.display = 'flex';
      }, 350);
    }

    showToast(message) {
      const toast = document.getElementById('game-bonus-toast');
      if (!toast) return;
      toast.textContent = message;
      toast.classList.add('active');
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.remove('active');
      }, 1400);
    }

    toggleCamera() {
      const modes = ['chase', 'hood', 'side'];
      const idx = modes.indexOf(this.cameraMode);
      this.cameraMode = modes[(idx + 1) % modes.length];
      this.showToast(`CAMERA: ${this.cameraMode.toUpperCase()}`);
    }

    resetTrafficPositions() {
      const initialZ = [-45, -75, -110, -145, -180, -215, -250, -285];
      this.trafficCars.forEach((c, idx) => {
        c.laneX = this.lanes[idx % this.lanes.length];
        c.group.position.set(c.laneX, 0.38, initialZ[idx % initialZ.length]);
        c.speedKMH = c.baseSpeedKMH;
        c.passed = false;
      });
    }

    // ========================================================================
    // PHYSICS & DRIVING SIMULATION
    // ========================================================================
    updatePhysics(delta) {
      if (this.gameState === 'paused') return;

      if (this.gameState === 'playing') {
        // 1. Throttle / Acceleration & Braking (KM/H)
        if (this.keys.handbrake) {
          if (this.speedKMH > 0) this.speedKMH = Math.max(0, this.speedKMH - this.brakeRate * 1.5 * delta);
          else if (this.speedKMH < 0) this.speedKMH = Math.min(0, this.speedKMH + this.brakeRate * 1.5 * delta);
        } else if (this.keys.forward) {
          this.speedKMH = Math.min(this.maxSpeedKMH, this.speedKMH + this.accelRate * delta);
        } else if (this.keys.backward) {
          if (this.speedKMH > 2) {
            this.speedKMH = Math.max(0, this.speedKMH - this.brakeRate * delta);
          } else {
            this.speedKMH = Math.max(-25, this.speedKMH - this.accelRate * 0.6 * delta);
          }
        } else {
          // Natural coasting deceleration
          if (this.speedKMH > 0) this.speedKMH = Math.max(0, this.speedKMH - this.coastFriction * delta);
          else if (this.speedKMH < 0) this.speedKMH = Math.min(0, this.speedKMH + this.coastFriction * delta);
        }

        // Top Speed tracker
        if (this.speedKMH > this.topSpeedKMH) this.topSpeedKMH = this.speedKMH;

        // Scoring: Distance Points + High Speed Bonus (> 100 KM/H)
        if (this.speedKMH > 0) {
          this.score += Math.round((this.speedKMH / 10) * delta * 5);
          if (this.speedKMH > 100) {
            this.score += Math.round((this.speedKMH - 100) * delta * 4);
          }
        }

        // Distance in KM
        if (this.speedKMH > 0) {
          this.distanceKM += (this.speedKMH / 3600) * delta;
        }

        // Update Sound Synthesizer smoothly
        if (this.sound) {
          const speedRatio = Math.max(0, Math.min(1.0, this.speedKMH / this.maxSpeedKMH));
          this.sound.updateEngine(speedRatio, this.keys.forward);
        }
      }

      // 2. Responsive Steering & Lateral Movement
      const speedNorm = Math.abs(this.speedKMH) / this.maxSpeedKMH;
      const steerSpeed = (4.8 + speedNorm * 4.2) * delta;
      const targetSteerAngle = (this.keys.left ? 0.32 : 0) + (this.keys.right ? -0.32 : 0);
      this.steerAngle += (targetSteerAngle - this.steerAngle) * Math.min(1.0, delta * 12.0);

      if (Math.abs(this.speedKMH) > 0.5) {
        const dir = this.speedKMH >= 0 ? 1 : -1;
        if (this.keys.left) this.posX -= steerSpeed * dir;
        if (this.keys.right) this.posX += steerSpeed * dir;
      }

      // Road Curbs Soft Clamping (4 lanes: max range [-6.8, 6.8])
      const maxLaneX = 6.8;
      if (this.posX < -maxLaneX) {
        this.posX = -maxLaneX;
        this.speedKMH *= 0.94;
      } else if (this.posX > maxLaneX) {
        this.posX = maxLaneX;
        this.speedKMH *= 0.94;
      }

      // 3. Chassis Dynamics (Roll into turns, Pitch on accel/brake)
      const targetRoll = -this.steerAngle * 0.18 * speedNorm;
      this.chassisRoll += (targetRoll - this.chassisRoll) * Math.min(1.0, delta * 10.0);

      const targetPitch = (this.keys.forward ? 0.025 : 0) - (this.keys.backward ? 0.038 : 0);
      this.chassisPitch += (targetPitch - this.chassisPitch) * Math.min(1.0, delta * 8.0);

      if (this.carGroup && this.gameState !== 'crashed') {
        this.carGroup.position.x = this.posX;
        this.carGroup.rotation.z = this.chassisRoll;
        this.carGroup.rotation.x = this.chassisPitch;
        this.carGroup.rotation.y = this.steerAngle * 0.16;
      }

      // 4. Turn Front Wheel Pivots
      if (this.frontLeftPivot && this.frontRightPivot) {
        this.frontLeftPivot.rotation.y = this.steerAngle;
        this.frontRightPivot.rotation.y = this.steerAngle;
      }

      // 5. Spin All 4 Wheels cleanly on w.rotation.x (NO w.wheel error!)
      const linearSpeed = (this.speedKMH / 100) * 32; // 3D units/sec
      const tireRadius = 0.36;
      const wheelAngularDelta = (linearSpeed / tireRadius) * delta;
      this.allWheels.forEach(w => {
        w.rotation.x -= wheelAngularDelta;
      });

      // 6. Move Scenery Backward with Player Speed
      this.roadStripes.forEach(s => {
        s.position.z += linearSpeed * delta;
        if (s.position.z > 25) s.position.z -= 345;
        else if (s.position.z < -320) s.position.z += 345;
      });

      this.palmTrees.forEach(p => {
        p.position.z += linearSpeed * delta;
        if (p.position.z > 30) p.position.z -= 350;
        else if (p.position.z < -320) p.position.z += 350;
      });

      this.streetlights.forEach(sl => {
        sl.position.z += linearSpeed * delta;
        if (sl.position.z > 30) sl.position.z -= 350;
        else if (sl.position.z < -320) sl.position.z += 350;
      });

      this.cityBuildings.forEach(b => {
        b.position.z += linearSpeed * 0.45 * delta;
        if (b.position.z > 40) b.position.z -= 350;
        else if (b.position.z < -310) b.position.z += 350;
      });

      this.gantries.forEach(g => {
        g.position.z += linearSpeed * delta;
        if (g.position.z > 30) g.position.z -= 270;
      });

      if (this.oceanMesh) {
        this.oceanMesh.position.z += linearSpeed * 0.18 * delta;
        if (this.oceanMesh.position.z > 25) this.oceanMesh.position.z -= 170;
      }

      // Brake Taillight illumination
      if (this.taillights.length > 0) {
        const isBraking = this.keys.backward || this.keys.handbrake;
        this.taillights.forEach(t => {
          t.material.color.setHex(isBraking ? 0xff0022 : 0xaa0022);
        });
      }
    }

    // ========================================================================
    // TRAFFIC SIMULATION & COLLISION SYSTEM
    // ========================================================================
    updateTraffic(delta) {
      if (this.gameState === 'paused') return;

      this.trafficCars.forEach(car => {
        // Relative forward velocity between player and traffic vehicle
        const relSpeedKMH = this.speedKMH - car.speedKMH;
        const relLinearSpeed = (relSpeedKMH / 100) * 32;
        car.group.position.z += relLinearSpeed * delta;

        // Spin traffic wheels with their ground speed
        const spinDelta = ((car.speedKMH / 100) * 32 / 0.34) * delta;
        car.wheels.forEach(w => w.rotation.x -= spinDelta);

        // Organic lane keeping micro-sway
        car.group.position.x = car.laneX + Math.sin(car.group.position.z * 0.04 + car.seed) * 0.12;

        // Close-Call & Overtake Detection
        if (!car.passed && car.group.position.z > 0) {
          car.passed = true;
          this.overtakes++;

          // Close-Call criteria: speed >= 80 km/h and lateral distance <= 2.1m
          const lateralDist = Math.abs(this.posX - car.group.position.x);
          if (this.speedKMH >= 80 && lateralDist < 2.1) {
            this.closeCalls++;
            this.score += 100;
            if (this.sound) this.sound.playCloseCall();
            this.showToast('⚡ CLOSE CALL! +100 PTS');
          }
        }

        // Recycle traffic ahead when passed behind player (z > 26)
        if (car.group.position.z > 26) {
          car.passed = false;
          car.group.position.z -= 240 + Math.random() * 40;
          car.laneX = this.lanes[Math.floor(Math.random() * this.lanes.length)];
          car.speedKMH = car.baseSpeedKMH + (Math.random() * 10 - 5);
        } else if (car.group.position.z < -320) {
          car.group.position.z = -120 - Math.random() * 40;
        }
      });

      // Check Collisions (only if active)
      if (this.gameState === 'playing') {
        this.checkCollisions();
      }
    }

    checkCollisions() {
      for (let i = 0; i < this.trafficCars.length; i++) {
        const car = this.trafficCars[i];
        const dx = Math.abs(this.posX - car.group.position.x);
        const dz = Math.abs(0 - car.group.position.z);

        const thresholdX = (this.playerWidth + car.width) * 0.44;
        const thresholdZ = (this.playerLength + car.length) * 0.44;

        if (dx < thresholdX && dz < thresholdZ) {
          this.triggerCrash(car);
          break;
        }
      }
    }

    // ========================================================================
    // CONTINUOUS DAY–SUNSET–NIGHT–SUNRISE CYCLE
    // ========================================================================
    updateEnvironment(delta) {
      // 1. Advance in-game clock (1440 minutes in 24 hours)
      if (this.autoCycle) {
        this.timeOfDayMinutes = (this.timeOfDayMinutes + (delta / this.cycleDurationSec) * 1440) % 1440;
      } else if (this.manualTargetMinutes !== null) {
        this.timeOfDayMinutes += (this.manualTargetMinutes - this.timeOfDayMinutes) * Math.min(1.0, delta * 3.0);
      }

      // 2. Format 24h clock for HUD
      const mins = Math.floor(this.timeOfDayMinutes);
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      const hh = hours.toString().padStart(2, '0');
      const mm = remMins.toString().padStart(2, '0');

      // 3. Mathematical color interpolation across 6 phases
      const skyColor = new THREE.Color();
      const sunColor = new THREE.Color();
      const ambColor = new THREE.Color();
      const fogColor = new THREE.Color();
      const waterColor = new THREE.Color();
      let sunIntensity = 2.4;
      let phaseName = 'DAY';
      let isDark = false;

      if (mins >= 300 && mins < 480) {
        // DAWN / SUNRISE (05:00 - 08:00)
        phaseName = 'SUNRISE';
        const f = (mins - 300) / 180;
        skyColor.lerpColors(new THREE.Color(0x160c32), new THREE.Color(0x38a8e8), f);
        sunColor.lerpColors(new THREE.Color(0xff8855), new THREE.Color(0xfffae0), f);
        ambColor.lerpColors(new THREE.Color(0x281845), new THREE.Color(0xbde8ff), f);
        fogColor.lerpColors(new THREE.Color(0x241238), new THREE.Color(0x6ec0f0), f);
        waterColor.lerpColors(new THREE.Color(0x0a1c32), new THREE.Color(0x05b8cc), f);
        sunIntensity = 0.8 + f * 1.8;
        isDark = f < 0.35;
      } else if (mins >= 480 && mins < 990) {
        // BRIGHT TROPICAL DAY (08:00 - 16:30)
        phaseName = 'DAY';
        skyColor.setHex(0x38a8e8);
        sunColor.setHex(0xfffae0);
        ambColor.setHex(0xbde8ff);
        fogColor.setHex(0x6ec0f0);
        waterColor.setHex(0x05b8cc);
        sunIntensity = 2.6;
        isDark = false;
      } else if (mins >= 990 && mins < 1170) {
        // GOLDEN SUNSET (16:30 - 19:30) - Vice City Iconic Palette
        phaseName = 'SUNSET';
        const f = (mins - 990) / 180;
        skyColor.lerpColors(new THREE.Color(0x38a8e8), new THREE.Color(0xff4466), f);
        sunColor.lerpColors(new THREE.Color(0xfffae0), new THREE.Color(0xffaa44), f);
        ambColor.lerpColors(new THREE.Color(0xbde8ff), new THREE.Color(0xff9966), f);
        fogColor.lerpColors(new THREE.Color(0x6ec0f0), new THREE.Color(0xff7755), f);
        waterColor.lerpColors(new THREE.Color(0x05b8cc), new THREE.Color(0x188899), f);
        sunIntensity = 2.6 - f * 0.8;
        isDark = f > 0.7;
      } else if (mins >= 1170 && mins < 1290) {
        // TWILIGHT / DUSK (19:30 - 21:30)
        phaseName = 'DUSK';
        const f = (mins - 1170) / 120;
        skyColor.lerpColors(new THREE.Color(0xff4466), new THREE.Color(0x1a0e3a), f);
        sunColor.lerpColors(new THREE.Color(0xffaa44), new THREE.Color(0x4a1e64), f);
        ambColor.lerpColors(new THREE.Color(0xff9966), new THREE.Color(0x2e1848), f);
        fogColor.lerpColors(new THREE.Color(0xff7755), new THREE.Color(0x180e2e), f);
        waterColor.lerpColors(new THREE.Color(0x188899), new THREE.Color(0x082840), f);
        sunIntensity = 1.8 - f * 1.3;
        isDark = true;
      } else {
        // NEON NIGHT (21:30 - 05:00)
        phaseName = 'NIGHT';
        skyColor.setHex(0x0c0722);
        sunColor.setHex(0x221240);
        ambColor.setHex(0x221840);
        fogColor.setHex(0x0e0826);
        waterColor.setHex(0x06182c);
        sunIntensity = 0.5;
        isDark = true;
      }

      // Apply to Three.js Scene, Fog, Renderer & Lighting
      if (this.scene) {
        this.scene.background = skyColor;
        if (this.scene.fog) {
          this.scene.fog.color.copy(fogColor);
        }
      }
      if (this.renderer) {
        this.renderer.setClearColor(skyColor);
      }
      if (this.ambientLight) {
        this.ambientLight.color.copy(ambColor);
        this.ambientLight.intensity = isDark ? 1.3 : 1.6;
      }
      if (this.hemiLight) {
        this.hemiLight.color.copy(skyColor);
        this.hemiLight.intensity = isDark ? 0.9 : 1.3;
      }
      if (this.sunLight) {
        this.sunLight.color.copy(sunColor);
        this.sunLight.intensity = sunIntensity;
        // Keep sun elevation at minimum 16 units high so top of road and cars are always lit
        const sunAngle = (this.timeOfDayMinutes / 1440) * Math.PI * 2 - Math.PI / 2;
        this.sunLight.position.set(
          Math.cos(sunAngle) * 50,
          Math.max(16, Math.sin(sunAngle) * 45),
          -50
        );
      }
      if (this.oceanMesh) this.oceanMesh.material.color.copy(waterColor);

      // Spotlights on player car (Bright beams at night)
      this.spotlights.forEach(s => {
        s.intensity = isDark ? 4.5 : 0.6;
      });

      // Synchronize Traffic Headlights & Taillights
      this.trafficCars.forEach(car => {
        car.headlights.forEach(h => {
          h.material.color.setHex(isDark ? 0xfffae0 : 0xaa9988);
        });
        car.taillights.forEach(t => {
          t.material.color.setHex(isDark ? 0xff1122 : 0x881122);
        });
      });

      // Update HUD Environment Pill
      const statusPill = document.getElementById('hud-env-status');
      if (statusPill) {
        statusPill.textContent = `[${hh}:${mm} ${phaseName}]`;
      }
    }

    updateCamera(delta) {
      if (!this.camera) return;

      if (this.cameraMode === 'chase') {
        const targetCamX = this.posX * 0.74;
        const targetCamZ = 5.8 + (this.speedKMH / 200) * 0.9;
        this.camera.position.x += (targetCamX - this.camera.position.x) * Math.min(1.0, delta * 8.0);
        this.camera.position.y = 1.9 + (this.speedKMH / 200) * 0.22;
        this.camera.position.z = targetCamZ;
        this.camera.lookAt(this.posX * 0.45, 0.68, -20);
      } else if (this.cameraMode === 'hood') {
        this.camera.position.set(this.posX, 1.05, -0.2);
        this.camera.lookAt(this.posX + this.steerAngle * 4.5, 0.8, -35);
      } else if (this.cameraMode === 'side') {
        this.camera.position.set(this.posX + 4.2, 0.85, 1.0);
        this.camera.lookAt(this.posX, 0.5, -3.0);
      }
    }

    updateHUD() {
      // 1. Digital Speedometer & Tachometer in KM/H
      const speedValEl = document.getElementById('hud-speed-val');
      if (speedValEl) speedValEl.textContent = `${Math.round(this.speedKMH)}`;

      const revFillEl = document.getElementById('hud-rev-fill');
      if (revFillEl) {
        const pct = Math.min(100, (Math.abs(this.speedKMH) / this.maxSpeedKMH) * 100);
        revFillEl.style.width = `${pct}%`;
      }

      // 2. Distance in KM
      const distValEl = document.getElementById('hud-distance-val');
      if (distValEl) distValEl.textContent = `${this.distanceKM.toFixed(2)} KM`;

      // 3. Score & High Score
      const scoreValEl = document.getElementById('hud-score-val');
      if (scoreValEl) scoreValEl.textContent = `${this.score}`;

      const bestValEl = document.getElementById('hud-best-val');
      if (bestValEl) bestValEl.textContent = `${Math.max(this.score, this.highScore)}`;

      // 4. Overtakes
      const passValEl = document.getElementById('hud-overtakes-val');
      if (passValEl) passValEl.textContent = `${this.overtakes}`;

      // 5. High Speed Bonus Warning
      const hsIndicator = document.getElementById('hud-highspeed-indicator');
      if (hsIndicator) {
        hsIndicator.classList.toggle('active', this.speedKMH >= 100);
      }
    }

    // ========================================================================
    // MAIN ENGINE LOOP HOOKS
    // ========================================================================
    update(delta) {
      this.updatePhysics(delta);
      this.updateTraffic(delta);
      this.updateEnvironment(delta);
      this.updateCamera(delta);
      this.updateHUD();
    }

    render() {
      if (!this.renderer || !this.scene || !this.camera) return;

      // Auto-self-heal: ensure canvas dimensions always match container
      if (this.container && this.container.clientWidth > 50 && this.container.clientHeight > 50) {
        const cw = this.container.clientWidth;
        const ch = this.container.clientHeight;
        if (Math.abs(this.lastWidth - cw) > 3 || Math.abs(this.lastHeight - ch) > 3) {
          this.lastWidth = cw;
          this.lastHeight = ch;
          this.resize(cw, ch);
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
      if (!this.camera || !this.renderer) return;
      if (!width || !height || width < 20 || height < 20) {
        width = (this.container && this.container.clientWidth > 50) ? this.container.clientWidth : 960;
        height = (this.container && this.container.clientHeight > 50) ? this.container.clientHeight : 540;
      }
      this.lastWidth = width;
      this.lastHeight = height;
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

      // When switching to car game, ensure carGame resizes cleanly after layout reflow
      if (tabName === 'cruise' && this.carGame) {
        const resizeAction = () => {
          const container = document.getElementById('three-game-viewport');
          if (container && this.carGame) {
            this.carGame.resize(container.clientWidth, container.clientHeight);
          }
        };
        resizeAction();
        setTimeout(resizeAction, 60);
        setTimeout(resizeAction, 250);
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
