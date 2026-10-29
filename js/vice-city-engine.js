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
  // SCENE 2: NISHANT AI // INTERACTIVE PORTFOLIO CHATBOT ENGINE
  // ==========================================================================
  class DialogueChatbotEngine {
    constructor() {
      // DOM Elements
      this.historyViewport = document.getElementById('chat-history-viewport');
      this.composerForm = document.getElementById('chat-composer-form');
      this.inputField = document.getElementById('chat-input');
      this.sendBtn = document.getElementById('chat-send-btn');
      this.btnReset = document.getElementById('chat-btn-reset');
      this.readyPill = document.getElementById('chat-ready-pill');

      // State
      this.messages = [];
      this.isGenerating = false;
      this.welcomeSent = false;

      // Knowledge Base Data
      this.knowledge = this.buildKnowledgeBase();

      this.init();
    }

    init() {
      this.setupEventListeners();
      this.sendWelcomeMessage();
    }

    setupEventListeners() {
      // Form submission
      if (this.composerForm) {
        this.composerForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleUserSubmit();
        });
      }

      // Reset / New Chat Button
      if (this.btnReset) {
        this.btnReset.addEventListener('click', () => {
          this.resetConversation();
        });
      }

      // Event delegation for clicks on chips, quick tags, FAQ buttons, and in-chat action buttons
      document.addEventListener('click', (e) => {
        const chip = e.target.closest('.suggestion-chip, .quick-tag-btn, .faq-query-btn');
        if (chip) {
          const query = chip.dataset.query;
          if (query && !this.isGenerating) {
            this.submitDirectQuery(query);
          }
          return;
        }

        const actionBtn = e.target.closest('.chat-link-btn');
        if (actionBtn) {
          const switchTab = actionBtn.dataset.switchTab;
          if (switchTab) {
            e.preventDefault();
            const tabRadio = document.getElementById(`scene-toggle-${switchTab}`);
            if (tabRadio) {
              tabRadio.checked = true;
              tabRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
            return;
          }

          const scrollToId = actionBtn.dataset.scrollTo;
          if (scrollToId) {
            e.preventDefault();
            const targetEl = document.getElementById(scrollToId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      });
    }

    onTabActivated() {
      // When user clicks the Scene 2 tab, focus input and ensure scrolled to bottom
      setTimeout(() => {
        if (this.inputField) this.inputField.focus();
        this.scrollToBottom();
      }, 100);
    }

    sendWelcomeMessage() {
      if (this.welcomeSent) return;
      this.welcomeSent = true;

      const welcomeHtml = `Hey! Welcome to Nishant's digital world. I'm <strong>Nishant AI</strong>, your interactive guide to this portfolio. Ask me anything about Nishant, his documented missions, technical arsenal, or the interactive games hidden across this site!`;
      
      const welcomeActions = [
        { label: '👤 Who is Nishant?', query: 'Who is Nishant?' },
        { label: '🚀 Highlighted Missions', query: 'What projects has he built?' },
        { label: '🎙️ VoiceKhata Dossier', query: 'Tell me about VoiceKhata.' },
        { label: '⚔️ Technical Arsenal', query: 'What technologies does he use?' }
      ];

      this.appendMessage('bot', welcomeHtml, welcomeActions);
    }

    resetConversation() {
      if (this.isGenerating) return;
      if (this.historyViewport) {
        this.historyViewport.innerHTML = '';
      }
      this.messages = [];
      this.welcomeSent = false;
      this.sendWelcomeMessage();
      if (this.inputField) {
        this.inputField.value = '';
        this.inputField.focus();
      }
    }

    handleUserSubmit() {
      if (this.isGenerating || !this.inputField) return;
      const text = this.inputField.value.trim();
      if (!text) return;

      this.inputField.value = '';
      this.submitDirectQuery(text);
    }

    submitDirectQuery(text) {
      if (this.isGenerating) return;

      // 1. Render User Message Safely
      this.appendMessage('user', text);

      // 2. Lock Composer
      this.setGeneratingState(true);

      // 3. Show Typing Indicator
      const typingEl = this.showTypingIndicator();

      // 4. Simulate natural response latency (450ms - 650ms)
      const latency = 450 + Math.random() * 200;
      setTimeout(async () => {
        // Remove typing indicator
        if (typingEl && typingEl.parentNode) {
          typingEl.parentNode.removeChild(typingEl);
        }

        // Generate response
        const response = await this.generateResponse(text);

        // Append Bot Response
        this.appendMessage('bot', response.html, response.actions);

        // Unlock Composer
        this.setGeneratingState(false);
        if (this.inputField) this.inputField.focus();
      }, latency);
    }

    setGeneratingState(isGenerating) {
      this.isGenerating = isGenerating;
      if (this.sendBtn) this.sendBtn.disabled = isGenerating;
      if (this.inputField) this.inputField.disabled = isGenerating;
      if (this.readyPill) {
        this.readyPill.textContent = isGenerating ? 'THINKING' : 'ONLINE';
        this.readyPill.style.color = isGenerating ? '#ffaa00' : '#00ffaa';
        this.readyPill.style.borderColor = isGenerating ? '#ffaa00' : '#00ffaa';
      }
    }

    appendMessage(role, content, actions = []) {
      if (!this.historyViewport) return;

      const row = document.createElement('div');
      row.className = `chat-msg-row ${role}`;

      const bubble = document.createElement('div');
      bubble.className = 'chat-msg-bubble';

      // Meta header (Author & Time)
      const meta = document.createElement('div');
      meta.className = 'chat-msg-meta';

      const author = document.createElement('span');
      author.className = 'chat-msg-author';
      author.textContent = role === 'bot' ? '🤖 NISHANT AI' : '👤 YOU';

      const time = document.createElement('span');
      time.className = 'chat-msg-time';
      const now = new Date();
      time.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      meta.appendChild(author);
      meta.appendChild(time);
      bubble.appendChild(meta);

      // Message Body
      const body = document.createElement('div');
      body.className = 'chat-msg-text';

      if (role === 'user') {
        // Safe text node prevents any raw HTML / script execution
        const p = document.createElement('p');
        p.textContent = content;
        body.appendChild(p);
      } else {
        // Assistant responses use structured safe HTML
        body.innerHTML = content;
      }
      bubble.appendChild(body);

      // Action Buttons (Optional interactive jumps/queries)
      if (actions && actions.length > 0) {
        const actionsGroup = document.createElement('div');
        actionsGroup.className = 'chat-actions-group';

        actionsGroup.addEventListener('click', (e) => {
          const btn = e.target.closest('.chat-link-btn');
          if (btn && btn.dataset.chatQuery) {
            e.preventDefault();
            this.submitDirectQuery(btn.dataset.chatQuery);
          }
        });

        actions.forEach(act => {
          const btn = document.createElement('a');
          btn.className = `chat-link-btn ${act.accent ? 'accent-pink' : ''}`;
          btn.href = act.url || '#';
          btn.innerHTML = `${act.label} ↗`;

          if (act.query) {
            btn.dataset.chatQuery = act.query;
          }
          if (act.switchTab) {
            btn.dataset.switchTab = act.switchTab;
          }
          if (act.scrollTo) {
            btn.dataset.scrollTo = act.scrollTo;
          }
          if (act.url && act.url.startsWith('http')) {
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
          }

          actionsGroup.appendChild(btn);
        });

        bubble.appendChild(actionsGroup);
      }

      row.appendChild(bubble);
      this.historyViewport.appendChild(row);
      this.scrollToBottom();

      this.messages.push({ role, content, timestamp: Date.now() });
    }

    showTypingIndicator() {
      if (!this.historyViewport) return null;

      const row = document.createElement('div');
      row.className = 'chat-msg-row bot';

      const bubble = document.createElement('div');
      bubble.className = 'chat-typing-bubble';
      bubble.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;

      row.appendChild(bubble);
      this.historyViewport.appendChild(row);
      this.scrollToBottom();
      return row;
    }

    scrollToBottom() {
      if (this.historyViewport) {
        this.historyViewport.scrollTop = this.historyViewport.scrollHeight;
      }
    }

    // ========================================================================
    // INTELLIGENT KNOWLEDGE BASE & TOPIC MATCHER
    // ========================================================================
    buildKnowledgeBase() {
      return [
        {
          id: 'identity',
          keywords: ['who are you', 'who is nishant', 'tell me about yourself', 'about nishant', 'background', 'biography', 'identity', 'who is he', 'bio', 'intro'],
          html: `<p><strong>Nishant Ekka</strong> is a builder, technologist, and computer science innovator with deep foundations in ISC Class 12 Computer Science.</p>
                 <p>He specializes in scalable full-stack web applications, voice-enabled financial systems, cybersecurity perimeter auditing, embedded robotics, and real-time 3D WebGL experiences.</p>
                 <p>His signature aesthetic blends precision systems architecture with original GTA Vice City-inspired retro-futurism.</p>`,
          actions: [
            { label: '📄 Character Dossier', scrollTo: 'about' },
            { label: '⚔️ Technical Arsenal', scrollTo: 'skills' }
          ]
        },
        {
          id: 'voicekhata',
          keywords: ['voicekhata', 'voice khata', 'voice ledger', 'voice bookkeeping', 'micro vendor', 'offline voice', 'render backend', 'hackday'],
          html: `<p><strong>VoiceKhata</strong> is Nishant's featured flagship mission—a voice-first digital bookkeeping ledger engineered to eliminate digital literacy barriers for roadside merchants, micro-vendors, and small shops.</p>
                 <p>By speaking natural language transactions, vendors automatically record debit and credit entries without complex spreadsheets or manual typing.</p>
                 <p><strong>Architecture:</strong> Python backend, speech processing pipeline, financial ledger calculation engine, and live REST API deployment on Render.</p>`,
          actions: [
            { label: '🎙️ Live Render Service', url: 'https://voicekhata-hackday.onrender.com' },
            { label: '📂 GitHub Repository', url: 'https://github.com/nishantekka2007-sys/voicekhata-hackday' }
          ]
        },
        {
          id: 'projects',
          keywords: ['projects', 'what has he built', 'what projects', 'portfolio work', 'missions', 'creations', 'work', 'builds'],
          html: `<p>Here are Nishant's primary documented engineering missions:</p>
                 <ul>
                   <li><strong>VoiceKhata:</strong> Voice-first bookkeeping ledger for micro-merchants with speech processing and cloud API deployment on Render.</li>
                   <li><strong>Cyber Recon & Vulnerability Lab:</strong> Security audit and network topology exploration focusing on socket routines, port scans, and Linux hardening.</li>
                   <li><strong>Vice City 3D Engine:</strong> The very website you are exploring! Featuring real-time Three.js 3D Traffic Racer driving physics, multi-gear synthesized Web Audio, and tactical camera presets.</li>
                 </ul>`,
          actions: [
            { label: '🚀 Jump to Missions', scrollTo: 'projects' },
            { label: '📂 GitHub Profile', url: 'https://github.com/nishantekka2007-sys' }
          ]
        },
        {
          id: 'security',
          keywords: ['cyber recon', 'security', 'cybersecurity', 'vulnerability', 'ethical hacking', 'recon', 'port scanner', 'penetration', 'linux hardening'],
          html: `<p><strong>Cyber Recon & Vulnerability Lab</strong> is Nishant's ethical hacking exploration sandbox.</p>
                 <p>It investigates proactive defensive system hardening, network topology mapping, automated port scanning routines, and security header evaluations to understand attack surfaces and fortify digital perimeters.</p>`,
          actions: [
            { label: '🛡️ Security Mission Card', scrollTo: 'projects' },
            { label: '⚔️ Defense Skills', scrollTo: 'skills' }
          ]
        },
        {
          id: 'tech_stack',
          keywords: ['technology', 'technologies', 'tech stack', 'languages', 'skills', 'tools', 'python', 'javascript', 'c++', 'java', 'sql', 'frameworks', 'arsenal'],
          html: `<p>Nishant's verified technical arsenal spans several core domains:</p>
                 <ul>
                   <li><strong>Languages:</strong> Python, Java, C / C++, HTML5 & CSS3, JavaScript, SQL, Bash / Shell.</li>
                   <li><strong>Architecture & Web:</strong> RESTful APIs, WebGL (Three.js), Responsive Modern UI, Cloud Deployment (Render, Vercel).</li>
                   <li><strong>Cybersecurity:</strong> Ethical security auditing, socket programming, defensive Linux hardening, network reconnaissance.</li>
                   <li><strong>Embedded & IoT:</strong> Microcontroller systems, sensor telemetry integration, hardware logic.</li>
                 </ul>`,
          actions: [
            { label: '⚔️ View Full Arsenal', scrollTo: 'skills' }
          ]
        },
        {
          id: 'games_and_demos',
          keywords: ['game', 'games', 'traffic racer', 'coastal drive', 'car', 'drive', 'tactical stance', 'rooftop', 'easter egg', 'hidden', 'explore'],
          html: `<p>You're inside an interactive Vice City terminal! Nishant built several playable experiences directly into this page:</p>
                 <ul>
                   <li><strong>Scene 3 — Traffic Racer:</strong> A full 3D coastal highway driving game with 6 traffic vehicle categories (Sports Coupe, Sedan, SUV, Van, Heavy Semi-Truck, City Bus), 5-speed synthesized engine sound, 80s synthwave music loop, 4 difficulty stages, and near-miss close calls!</li>
                   <li><strong>Scene 4 — Tactical Stance:</strong> Rooftop vista sniper mode with 4 interactive camera perspectives and tactical night vision.</li>
                   <li><strong>Scene 1 — Character Cinema Studio:</strong> 3D lighting studio with 5 Vice City sunset & neon atmospheres.</li>
                 </ul>`,
          actions: [
            { label: '🏎️ Play Traffic Racer', switchTab: 'cruise' },
            { label: '🎯 Launch Tactical Stance', switchTab: 'action' },
            { label: '✨ Character Showcase', switchTab: 'idle' }
          ]
        },
        {
          id: 'interests',
          keywords: ['interest', 'interests', 'passion', 'passions', 'hobbies', 'what does he like', 'beyond the terminal', 'photography', 'videography', 'video editing'],
          html: `<p>Beyond the coding terminal, Nishant channels discipline and creative vision through:</p>
                 <ul>
                   <li><strong>Robotics & Hardware:</strong> Designing physical systems that interface with code.</li>
                   <li><strong>Cybersecurity Research:</strong> Studying network resilience and ethical defense.</li>
                   <li><strong>Videography & Photography:</strong> Cinematic visual storytelling, lighting direction, and digital color grading.</li>
                 </ul>`,
          actions: [
            { label: '🌟 Beyond the Terminal', scrollTo: 'interests' }
          ]
        },
        {
          id: 'contact',
          keywords: ['contact', 'hire', 'email', 'reach out', 'connect', 'social', 'github', 'message', 'collaborate'],
          html: `<p>Interested in collaborating, recruiting, or discussing technical projects with Nishant?</p>
                 <p>You can connect with him directly on GitHub or through the communications console below.</p>`,
          actions: [
            { label: '📬 Open Contact Section', scrollTo: 'contact' },
            { label: '📂 GitHub: nishantekka2007-sys', url: 'https://github.com/nishantekka2007-sys' }
          ]
        },
        {
          id: 'greetings',
          keywords: ['hi', 'hello', 'hey', 'sup', 'howdy', 'good morning', 'good evening', 'greetings', 'yo'],
          html: `<p>Hey there! Great to meet you. I'm <strong>Nishant AI</strong>, ready to answer questions about Nishant's portfolio, missions, code, or games.</p>
                 <p>What would you like to explore first?</p>`,
          actions: [
            { label: '👤 About Nishant', query: 'Who is Nishant?' },
            { label: '🚀 View Projects', query: 'What projects has he built?' },
            { label: '🏎️ Play Traffic Racer', switchTab: 'cruise' }
          ]
        },
        {
          id: 'gratitude',
          keywords: ['thanks', 'thank you', 'cool', 'awesome', 'great', 'nice', 'good job', 'bye', 'goodbye'],
          html: `<p>You're welcome! Glad I could help. Feel free to explore the interactive demos or jump to any section of the website whenever you like.</p>`,
          actions: [
            { label: '🏎️ Play Traffic Racer', switchTab: 'cruise' },
            { label: '🚀 Explore Projects', scrollTo: 'projects' }
          ]
        }
      ];
    }

    // ========================================================================
    // RESPONSE GENERATOR (Extensible for remote LLM backend in future)
    // ========================================================================
    async generateResponse(userQuery) {
      // NOTE FOR FUTURE LLM EXPANSION:
      // If a real AI backend API is configured in the future, connect it here:
      // if (window.NISHANT_AI_API_ENDPOINT) {
      //   return await this.fetchRemoteLLMResponse(userQuery);
      // }

      // Default: Reliable, zero-latency local knowledge base matcher
      return this.matchLocalKnowledge(userQuery);
    }

    matchLocalKnowledge(query) {
      const clean = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const queryWords = new Set(clean.split(' '));
      const stopWords = new Set(['what', 'who', 'how', 'why', 'when', 'where', 'which', 'is', 'are', 'was', 'were', 'the', 'a', 'an', 'and', 'or', 'to', 'for', 'of', 'in', 'on', 'at', 'about', 'tell', 'me', 'can', 'you', 'he', 'his', 'him', 'your', 'my', 'do', 'does', 'did', 'have', 'has', 'had', 'this', 'that', 'with', 'built', 'build', 'like', 'there']);

      let bestMatch = null;
      let highestScore = 0;

      for (const entry of this.knowledge) {
        let score = 0;
        for (const kw of entry.keywords) {
          const kwClean = kw.toLowerCase().trim();
          // 1. Exact phrase match with word boundaries
          if (clean === kwClean || clean.startsWith(kwClean + ' ') || clean.endsWith(' ' + kwClean) || clean.includes(' ' + kwClean + ' ')) {
            score += kwClean.length * 3 + 20;
          } else {
            // 2. Significant non-stop words match
            const kwWords = kwClean.split(' ').filter(w => !stopWords.has(w) && w.length >= 3);
            if (kwWords.length > 0) {
              let hits = 0;
              for (const w of kwWords) {
                if (queryWords.has(w)) hits++;
              }
              if (hits === kwWords.length) {
                score += hits * 10 + 10;
              } else if (hits > 0 && kwWords.length > 1) {
                score += hits * 4;
              }
            }
          }
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      }

      if (bestMatch && highestScore >= 12) {
        return {
          html: bestMatch.html,
          actions: bestMatch.actions || []
        };
      }

      // Intelligent Fallback with Helpful Suggestions
      return {
        html: `<p>I don't have that specific detail in my local portfolio knowledge base yet. As Nishant AI, I'm specifically programmed to discuss:</p>
               <ul>
                 <li><strong>Nishant's background</strong>, education & credentials</li>
                 <li><strong>VoiceKhata</strong> and his featured software projects</li>
                 <li><strong>Programming languages</strong>, tools & technical arsenal</li>
                 <li><strong>Playable mini-games</strong> like the Traffic Racer 3D coastal drive</li>
                 <li><strong>Contact details</strong> and how to reach out</li>
               </ul>
               <p>Try clicking one of the suggested topics below:</p>`,
        actions: [
          { label: '👤 Who is Nishant?', query: 'Who is Nishant?' },
          { label: '🚀 Documented Missions', query: 'What projects has he built?' },
          { label: '⚔️ Technical Arsenal', query: 'What technologies does he use?' },
          { label: '🏎️ Play Traffic Racer', switchTab: 'cruise' }
        ]
      };
    }
  }

  // Alias for backward compatibility
  const DialogueEngine = DialogueChatbotEngine;

  // ==========================================================================
  // PART 2: TROPICAL COASTAL ARCADE CAR-DRIVING MINI-GAME (THREE.JS)
  // ==========================================================================
  // ==========================================================================
  // SCENE 3: SYNTHESIZED WEB AUDIO & 80S SYNTHWAVE MUSIC SYSTEM
  // ==========================================================================
  class ArcadeSoundSystem {
    constructor() {
      this.ctx = null;
      this.initialized = false;
      this.muted = false;

      // Master & Channel Gains
      this.masterGain = null;
      this.musicGain = null;
      this.sfxGain = null;
      this.engineGain = null;

      // Volume settings (0.0 to 1.0)
      this.masterVol = 0.8;
      this.musicVol = 0.7;
      this.sfxVol = 0.85;
      this.engineVol = 0.85;
      this.musicEnabled = true;
      this.sfxEnabled = true;

      // Engine Synthesis Nodes
      this.engineOsc = null;
      this.subOsc = null;
      this.engineFilter = null;
      this.isPlayingEngine = false;
      this.currentGear = 1;
      this.lastGearShiftSpeed = 0;

      // Synthwave Music Sequencer
      this.musicTimer = null;
      this.isPlayingMusic = false;
      this.musicStep = 0;
      this.tempo = 124; // 124 BPM arcade drive
      this.nextNoteTime = 0;

      // Music Pattern (Bass & Melody notes in A Minor / F / C / G)
      // A1=55, C2=65.4, D2=73.4, E2=82.4, F2=87.3, G2=98, A2=110
      this.bassPattern = [
        55, 55, 110, 55, 55, 55, 110, 55, // Bar 1: Am
        87.3, 87.3, 174.6, 87.3, 87.3, 87.3, 174.6, 87.3, // Bar 2: F
        65.4, 65.4, 130.8, 65.4, 65.4, 65.4, 130.8, 65.4, // Bar 3: C
        98, 98, 196, 98, 82.4, 82.4, 164.8, 82.4 // Bar 4: G / Em
      ];

      // Arpeggiated melody line (frequencies in Hz)
      this.melodyPattern = [
        440, 0, 523.25, 0, 659.25, 0, 523.25, 0, // Bar 1: A4, C5, E5, C5
        349.23, 0, 440, 0, 523.25, 0, 440, 0,   // Bar 2: F4, A4, C5, A4
        261.63, 0, 329.63, 0, 392, 0, 523.25, 0, // Bar 3: C4, E4, G4, C5
        392, 0, 493.88, 0, 587.33, 0, 493.88, 0  // Bar 4: G4, B4, D5, B4
      ];
    }

    init() {
      if (this.initialized) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        // 1. Master Output Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVol * 0.08, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // 2. Channel Gains
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVol : 0, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? this.sfxVol : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // 3. Engine Filter & Gain Node
        this.engineFilter = this.ctx.createBiquadFilter();
        this.engineFilter.type = 'lowpass';
        this.engineFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
        this.engineFilter.Q.setValueAtTime(2.2, this.ctx.currentTime);
        this.engineFilter.connect(this.sfxGain);

        this.engineGain = this.ctx.createGain();
        this.engineGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.engineGain.connect(this.engineFilter);

        // 4. Engine Dual Oscillators (Triangle + Sub Sine)
        this.engineOsc = this.ctx.createOscillator();
        this.engineOsc.type = 'triangle';
        this.engineOsc.frequency.setValueAtTime(54, this.ctx.currentTime);
        this.engineOsc.connect(this.engineGain);
        this.engineOsc.start();

        this.subOsc = this.ctx.createOscillator();
        this.subOsc.type = 'sine';
        this.subOsc.frequency.setValueAtTime(27, this.ctx.currentTime);
        this.subOsc.connect(this.engineGain);
        this.subOsc.start();

        this.initialized = true;
      } catch (e) {
        console.warn('[Traffic Racer Audio] Web Audio unavailable', e);
      }
    }

    // ========================================================================
    // ENGINE SOUND SYSTEM WITH 5 SIMULATED GEARS
    // ========================================================================
    startEngine() {
      if (!this.initialized) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isPlayingEngine = true;
      const t = this.ctx.currentTime;
      const targetGain = this.sfxEnabled ? this.engineVol * 0.05 : 0.0001;
      this.engineGain.gain.setTargetAtTime(targetGain, t, 0.12);
    }

    updateEngine(speedKMH, isAccelerating, isBraking) {
      if (!this.initialized || !this.ctx || !this.isPlayingEngine) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const t = this.ctx.currentTime;

      // 5-Speed Gear Calculation
      let gear = 1;
      let minSpeed = 0, maxSpeed = 45;
      if (speedKMH < 45) {
        gear = 1; minSpeed = 0; maxSpeed = 45;
      } else if (speedKMH < 85) {
        gear = 2; minSpeed = 45; maxSpeed = 85;
      } else if (speedKMH < 125) {
        gear = 3; minSpeed = 85; maxSpeed = 125;
      } else if (speedKMH < 165) {
        gear = 4; minSpeed = 125; maxSpeed = 165;
      } else {
        gear = 5; minSpeed = 165; maxSpeed = 220;
      }

      // Check for Gear Shift
      if (gear !== this.currentGear) {
        if (gear > this.currentGear && isAccelerating) {
          this.playGearShift();
        }
        this.currentGear = gear;
      }

      // Relative RPM within current gear (0.25 to 1.0)
      const gearProgress = Math.max(0, Math.min(1.0, (speedKMH - minSpeed) / (maxSpeed - minSpeed)));
      const rpm = 0.25 + gearProgress * 0.75;

      // Smooth base frequency scaling with gear RPM
      const baseFreq = 48 + rpm * 95 + (isAccelerating ? 16 : 0) - (isBraking ? 12 : 0);
      const subFreq = baseFreq * 0.5;
      const filterFreq = 380 + rpm * 480 + (isAccelerating ? 140 : 0);

      this.engineOsc.frequency.setTargetAtTime(baseFreq, t, 0.08);
      this.subOsc.frequency.setTargetAtTime(subFreq, t, 0.08);
      this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.08);

      const dynamicVol = this.sfxEnabled ? (this.engineVol * (0.035 + rpm * 0.028)) : 0.0001;
      this.engineGain.gain.setTargetAtTime(dynamicVol, t, 0.08);

      // Play soft tire screech if braking hard at speed
      if (isBraking && speedKMH > 65) {
        this.playTireScreech();
      }
    }

    stopEngine() {
      this.isPlayingEngine = false;
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
      }
    }

    playGearShift() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);
        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.07);
      } catch (e) {}
    }

    playTireScreech() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      if (this.lastScreechTime && this.ctx.currentTime - this.lastScreechTime < 0.35) return;
      this.lastScreechTime = this.ctx.currentTime;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(840, t);
        osc.frequency.linearRampToValueAtTime(680, t + 0.18);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, t);
        filter.Q.setValueAtTime(3.0, t);

        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.18);
      } catch (e) {}
    }

    playCloseCall() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        // Dual Bell Chime (E6 -> B6)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1318.5, t); // E6
        osc.frequency.exponentialRampToValueAtTime(1975.5, t + 0.14); // B6
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.28);

        // Soft Air Whoosh Pan
        const whoosh = this.ctx.createOscillator();
        const wFilter = this.ctx.createBiquadFilter();
        const wGain = this.ctx.createGain();
        whoosh.type = 'triangle';
        whoosh.frequency.setValueAtTime(280, t);
        whoosh.frequency.exponentialRampToValueAtTime(540, t + 0.22);
        wFilter.type = 'lowpass';
        wFilter.frequency.setValueAtTime(600, t);
        wGain.gain.setValueAtTime(0.035, t);
        wGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        whoosh.connect(wFilter);
        wFilter.connect(wGain);
        wGain.connect(this.sfxGain);
        whoosh.start(t);
        whoosh.stop(t + 0.25);
      } catch (e) {}
    }

    playCrash() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        // 1. Low Impact Thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(135, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.45);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.5);

        // 2. High-Frequency Metal Crunch
        const crunch = this.ctx.createOscillator();
        const cFilter = this.ctx.createBiquadFilter();
        const cGain = this.ctx.createGain();
        crunch.type = 'sawtooth';
        crunch.frequency.setValueAtTime(420, t);
        crunch.frequency.linearRampToValueAtTime(80, t + 0.35);
        cFilter.type = 'bandpass';
        cFilter.frequency.setValueAtTime(850, t);
        cGain.gain.setValueAtTime(0.12, t);
        cGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
        crunch.connect(cFilter);
        cFilter.connect(cGain);
        cGain.connect(this.sfxGain);
        crunch.start(t);
        crunch.stop(t + 0.38);
      } catch (e) {}
    }

    playStageUp() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        // Two-tone fanfare
        [587.33, 880].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.12);
          gain.gain.setValueAtTime(0.07, t + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.12);
          osc.stop(t + idx * 0.12 + 0.35);
        });
      } catch (e) {}
    }

    playHighscoreFanfare() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.1);
          gain.gain.setValueAtTime(0.08, t + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t + idx * 0.1);
          osc.stop(t + idx * 0.1 + 0.4);
        });
      } catch (e) {}
    }

    playButtonClick() {
      if (!this.initialized || !this.ctx || !this.sfxEnabled) return;
      try {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(820, t);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.04);
      } catch (e) {}
    }

    // ========================================================================
    // 80S SYNTHWAVE RETRO MUSIC SEQUENCER
    // ========================================================================
    startMusic() {
      if (!this.initialized) this.init();
      if (!this.ctx || this.isPlayingMusic) return;
      this.isPlayingMusic = true;
      this.musicStep = 0;
      this.nextNoteTime = this.ctx.currentTime + 0.05;
      this.scheduleMusicLoop();
    }

    scheduleMusicLoop() {
      if (!this.isPlayingMusic || !this.ctx) return;
      const secondsPerBeat = 60.0 / this.tempo;
      const stepDuration = secondsPerBeat / 4; // 16th notes

      // Lookahead: schedule events for the next 100ms
      while (this.nextNoteTime < this.ctx.currentTime + 0.12) {
        if (this.musicEnabled) {
          this.playMusicStep(this.musicStep, this.nextNoteTime, stepDuration);
        }
        this.nextNoteTime += stepDuration;
        this.musicStep = (this.musicStep + 1) % 32;
      }

      this.musicTimer = setTimeout(() => this.scheduleMusicLoop(), 25);
    }

    playMusicStep(step, time, duration) {
      if (!this.ctx || !this.musicGain) return;

      // 1. Synth Bass Note on 16ths
      const bassFreq = this.bassPattern[step % this.bassPattern.length];
      if (bassFreq) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        const bFilter = this.ctx.createBiquadFilter();

        bOsc.type = 'sawtooth';
        bOsc.frequency.setValueAtTime(bassFreq, time);

        bFilter.type = 'lowpass';
        bFilter.frequency.setValueAtTime(420, time);
        bFilter.frequency.exponentialRampToValueAtTime(120, time + duration * 0.9);

        bGain.gain.setValueAtTime(0.038, time);
        bGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.85);

        bOsc.connect(bFilter);
        bFilter.connect(bGain);
        bGain.connect(this.musicGain);

        bOsc.start(time);
        bOsc.stop(time + duration);
      }

      // 2. Drum Percussion: Kick on beats 0, 4, 8, 12, 16, 20, 24, 28
      if (step % 4 === 0) {
        const kOsc = this.ctx.createOscillator();
        const kGain = this.ctx.createGain();
        kOsc.type = 'triangle';
        kOsc.frequency.setValueAtTime(130, time);
        kOsc.frequency.exponentialRampToValueAtTime(42, time + 0.08);
        kGain.gain.setValueAtTime(0.06, time);
        kGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
        kOsc.connect(kGain);
        kGain.connect(this.musicGain);
        kOsc.start(time);
        kOsc.stop(time + 0.1);
      }

      // 3. Snare on beats 4, 12, 20, 28
      if (step % 8 === 4) {
        const sOsc = this.ctx.createOscillator();
        const sGain = this.ctx.createGain();
        sOsc.type = 'triangle';
        sOsc.frequency.setValueAtTime(210, time);
        sOsc.frequency.exponentialRampToValueAtTime(80, time + 0.12);
        sGain.gain.setValueAtTime(0.035, time);
        sGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
        sOsc.connect(sGain);
        sGain.connect(this.musicGain);
        sOsc.start(time);
        sOsc.stop(time + 0.14);
      }

      // 4. Hi-Hat on every 2nd 16th note
      if (step % 2 === 1) {
        const hOsc = this.ctx.createOscillator();
        const hGain = this.ctx.createGain();
        const hFilter = this.ctx.createBiquadFilter();
        hOsc.type = 'sawtooth';
        hFilter.type = 'highpass';
        hFilter.frequency.setValueAtTime(5500, time);
        hGain.gain.setValueAtTime(0.015, time);
        hGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
        hOsc.connect(hFilter);
        hFilter.connect(hGain);
        hGain.connect(this.musicGain);
        hOsc.start(time);
        hOsc.stop(time + 0.04);
      }

      // 5. Retro Synth Melody Hook
      const melFreq = this.melodyPattern[step % this.melodyPattern.length];
      if (melFreq) {
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        const mFilter = this.ctx.createBiquadFilter();

        mOsc.type = 'sawtooth';
        mOsc.frequency.setValueAtTime(melFreq, time);

        mFilter.type = 'lowpass';
        mFilter.frequency.setValueAtTime(1400, time);
        mFilter.Q.setValueAtTime(2.0, time);

        mGain.gain.setValueAtTime(0.025, time);
        mGain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 1.6);

        mOsc.connect(mFilter);
        mFilter.connect(mGain);
        mGain.connect(this.musicGain);

        mOsc.start(time);
        mOsc.stop(time + duration * 1.7);
      }
    }

    stopMusic() {
      this.isPlayingMusic = false;
      if (this.musicTimer) {
        clearTimeout(this.musicTimer);
        this.musicTimer = null;
      }
    }

    duckMusic(ducked) {
      if (this.musicGain && this.ctx) {
        const target = (this.musicEnabled && !this.muted) ? (ducked ? this.musicVol * 0.25 : this.musicVol) : 0;
        this.musicGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.15);
      }
    }

    // ========================================================================
    // AUDIO SETTINGS & VOLUME CONTROLS
    // ========================================================================
    setMasterVolume(val) {
      this.masterVol = Math.max(0, Math.min(1.0, val));
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.masterVol * 0.08, this.ctx.currentTime, 0.05);
      }
    }

    setMusicVolume(val) {
      this.musicVol = Math.max(0, Math.min(1.0, val));
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setTargetAtTime(this.musicEnabled ? this.musicVol : 0, this.ctx.currentTime, 0.05);
      }
    }

    setSfxVolume(val) {
      this.sfxVol = Math.max(0, Math.min(1.0, val));
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setTargetAtTime(this.sfxEnabled ? this.sfxVol : 0, this.ctx.currentTime, 0.05);
      }
    }

    setEngineVolume(val) {
      this.engineVol = Math.max(0, Math.min(1.0, val));
    }

    toggleMusic(enabled) {
      this.musicEnabled = (enabled !== undefined) ? enabled : !this.musicEnabled;
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setTargetAtTime(this.musicEnabled ? this.musicVol : 0, this.ctx.currentTime, 0.05);
      }
      return this.musicEnabled;
    }

    toggleSfx(enabled) {
      this.sfxEnabled = (enabled !== undefined) ? enabled : !this.sfxEnabled;
      if (this.sfxGain && this.ctx) {
        this.sfxGain.gain.setTargetAtTime(this.sfxEnabled ? this.sfxVol : 0, this.ctx.currentTime, 0.05);
      }
      return this.sfxEnabled;
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.masterVol * 0.08, this.ctx.currentTime, 0.05);
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

      // Game State Machine: 'menu' | 'playing' | 'paused' | 'crashed'
      this.gameState = 'menu';
      this.isPaused = false;

      // Player Score & Progression
      this.score = 0;
      this.distanceKM = 0;
      this.overtakes = 0;
      this.closeCalls = 0;
      this.topSpeedKMH = 0;
      this.highScore = parseInt(localStorage.getItem('vice_city_tr_highscore') || '0', 10);

      // 4-Stage Progressive Difficulty
      this.currentStage = 1;
      this.lastStage = 1;
      this.stageNames = {
        1: 'COASTAL BREEZE',
        2: 'HIGHWAY TRAFFIC',
        3: 'HIGHWAY RUSH',
        4: 'MAX PRESSURE'
      };

      // Player Physics & Car Dynamics
      this.speedKMH = 0;
      this.maxSpeedKMH = 220;
      this.accelRate = 58; // km/h per second
      this.brakeRate = 110; // km/h per second
      this.coastFriction = 22; // natural drag
      this.posX = 0; // lateral road position (X)
      this.steerAngle = 0;
      this.chassisRoll = 0;
      this.chassisPitch = 0;
      this.playerWidth = 1.95;
      this.playerLength = 4.3;

      // Highway Architecture (4 standard 3.6m traffic lanes)
      this.lanes = [-5.4, -1.8, 1.8, 5.4];
      this.roadWidth = 15.6;

      // Highway & Scenery Mesh Collections
      this.roadStripes = [];
      this.palmTrees = [];
      this.streetlights = [];
      this.cityBuildings = [];
      this.gantries = [];
      this.oceanMesh = null;

      // Player Car 3D Objects
      this.carGroup = null;
      this.frontLeftPivot = null;
      this.frontRightPivot = null;
      this.allWheels = [];
      this.spotlights = [];
      this.taillights = [];
      this.underglow = null;

      // Traffic Collection (8 active vehicles)
      this.trafficCars = [];
      this.maxTrafficCount = 8;

      // Camera Modes: 'chase' | 'hood' | 'side'
      this.cameraMode = 'chase';

      // 24-Hour Continuous Day/Night Cycle
      this.timeOfDayMinutes = 1080; // 18:00 (Sunset default)
      this.cycleDurationSec = 120; // 2 minutes per full 24h cycle
      this.autoCycle = false;
      this.manualTargetMinutes = null;

      // Lighting Objects
      this.ambientLight = null;
      this.hemiLight = null;
      this.sunLight = null;

      // Input Keys State
      this.keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        handbrake: false
      };

      // Toast & Timing Helpers
      this.toastTimer = null;
      this.clock = new THREE.Clock();
      this.lastWidth = 0;
      this.lastHeight = 0;

      this.init();
    }

    init() {
      // 1. Scene Setup with Atmospheric Fog
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0xff7755, 0.0075);

      // 2. Camera Setup (Standard Chase Cam)
      const w = this.container.clientWidth || 960;
      const h = this.container.clientHeight || 540;
      this.camera = new THREE.PerspectiveCamera(54, w / h, 0.2, 500);
      this.camera.position.set(0, 1.9, 5.8);

      // 3. WebGL Renderer with High-Performance Settings
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
      });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.container.appendChild(this.renderer.domElement);

      // 4. Lighting System
      this.ambientLight = new THREE.AmbientLight(0xffeedd, 1.6);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0xff5577, 0x110822, 1.3);
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(0xffbb77, 2.4);
      this.sunLight.position.set(40, 30, -50);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.camera.near = 0.5;
      this.sunLight.shadow.camera.far = 250;
      this.sunLight.shadow.camera.left = -25;
      this.sunLight.shadow.camera.right = 25;
      this.sunLight.shadow.camera.top = 25;
      this.sunLight.shadow.camera.bottom = -25;
      this.scene.add(this.sunLight);

      // 5. Construct Vice City Coastal Highway & Scenery
      this.buildCoastalEnvironment();

      // 6. Construct Player's Detailed Supercar
      this.buildSupercar();

      // 7. Construct Diverse 6-Class Traffic Fleet
      this.buildTrafficPool();

      // 8. Event Listeners for Controls & Menus
      this.setupControls();
      this.setupUIListeners();

      // 9. Initial Menu Stat Display
      const menuBestEl = document.getElementById('menu-best-score');
      if (menuBestEl) menuBestEl.textContent = `${this.highScore} PTS`;

      // 10. Initial Canvas Sizing
      this.resize(w, h);
    }

    // ========================================================================
    // PROCEDURAL VICE CITY ENVIRONMENT
    // ========================================================================
    buildCoastalEnvironment() {
      // 1. Asphalt Roadway (15.6m wide, 400m long)
      const roadGeo = new THREE.PlaneGeometry(this.roadWidth, 400);
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0x18181c,
        roughness: 0.88,
        metalness: 0.12
      });
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0, -150);
      road.receiveShadow = true;
      this.scene.add(road);

      // 2. Concrete Curbs & Neon Guardrails
      [-this.roadWidth / 2 - 0.35, this.roadWidth / 2 + 0.35].forEach((x, idx) => {
        const curbGeo = new THREE.BoxGeometry(0.7, 0.32, 400);
        const curbMat = new THREE.MeshStandardMaterial({
          color: 0x505058,
          roughness: 0.9
        });
        const curb = new THREE.Mesh(curbGeo, curbMat);
        curb.position.set(x, 0.16, -150);
        this.scene.add(curb);

        // Neon Glow Strip along Edge
        const edgeNeonMat = new THREE.MeshBasicMaterial({
          color: idx === 0 ? 0xff2a85 : 0x00f0ff
        });
        const edgeNeon = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 400), edgeNeonMat);
        edgeNeon.position.set(x + (idx === 0 ? 0.3 : -0.3), 0.34, -150);
        this.scene.add(edgeNeon);
      });

      // 3. Dash Road Stripes (3 dividing lines for 4 lanes)
      const stripeGeo = new THREE.PlaneGeometry(0.2, 3.8);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const stripePositionsX = [-3.6, 0, 3.6];

      for (let z = 20; z > -320; z -= 8) {
        stripePositionsX.forEach(x => {
          const s = new THREE.Mesh(stripeGeo, stripeMat);
          s.rotation.x = -Math.PI / 2;
          s.position.set(x, 0.015, z);
          this.scene.add(s);
          this.roadStripes.push(s);
        });
      }

      // 4. Sparkling Ocean on West Side (x < -10)
      const oceanGeo = new THREE.PlaneGeometry(160, 400, 24, 24);
      const oceanMat = new THREE.MeshStandardMaterial({
        color: 0x05b8cc,
        roughness: 0.25,
        metalness: 0.85
      });
      this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
      this.oceanMesh.rotation.x = -Math.PI / 2;
      this.oceanMesh.position.set(-92, -0.15, -150);
      this.scene.add(this.oceanMesh);

      // 5. Sandy Beach Strip between Road & Ocean
      const beachGeo = new THREE.PlaneGeometry(8, 400);
      const beachMat = new THREE.MeshStandardMaterial({
        color: 0xd4a373,
        roughness: 0.95
      });
      const beach = new THREE.Mesh(beachGeo, beachMat);
      beach.rotation.x = -Math.PI / 2;
      beach.position.set(-11.8, -0.05, -150);
      this.scene.add(beach);

      // 6. Roadside Palm Trees
      for (let z = 25; z > -320; z -= 22) {
        const pWest = this.createPalmTree(-10.2, z);
        this.scene.add(pWest);
        this.palmTrees.push(pWest);

        const pEast = this.createPalmTree(10.2, z - 11);
        this.scene.add(pEast);
        this.palmTrees.push(pEast);
      }

      // 7. Highway Streetlights
      for (let z = 20; z > -320; z -= 38) {
        const slWest = this.createStreetlight(-8.8, z, false);
        this.scene.add(slWest);
        this.streetlights.push(slWest);

        const slEast = this.createStreetlight(8.8, z - 19, true);
        this.scene.add(slEast);
        this.streetlights.push(slEast);
      }

      // 8. Overhead Highway Gantry Signs
      for (let z = -60; z > -320; z -= 110) {
        const gantry = this.buildHighwayGantry(z);
        this.scene.add(gantry);
        this.gantrySigns = this.gantrySigns || [];
        this.gantries.push(gantry);
      }

      // 9. Vice City Skyline & Neon Hotels on East Side (x > 14)
      for (let z = 30; z > -320; z -= 26) {
        const b = this.createCityBuilding(18 + Math.random() * 8, z);
        this.scene.add(b);
        this.cityBuildings.push(b);
      }
    }

    buildHighwayGantry(z) {
      const gantryGroup = new THREE.Group();
      gantryGroup.position.set(0, 0, z);

      const poleMat = new THREE.MeshStandardMaterial({ color: 0x3a4048, metalness: 0.8, roughness: 0.3 });
      const pL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.8, 8), poleMat);
      pL.position.set(-this.roadWidth / 2 - 0.4, 2.9, 0);
      gantryGroup.add(pL);

      const pR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.8, 8), poleMat);
      pR.position.set(this.roadWidth / 2 + 0.4, 2.9, 0);
      gantryGroup.add(pR);

      const truss = new THREE.Mesh(new THREE.BoxGeometry(this.roadWidth + 1.2, 0.5, 0.5), poleMat);
      truss.position.set(0, 5.6, 0);
      gantryGroup.add(truss);

      const signMat = new THREE.MeshStandardMaterial({ color: 0x05482b, roughness: 0.4 });
      const sign = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.4, 0.15), signMat);
      sign.position.set(0, 5.4, -0.28);
      gantryGroup.add(sign);

      const signGlow = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.08, 0.04), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
      signGlow.position.set(0, 4.65, -0.36);
      gantryGroup.add(signGlow);

      return gantryGroup;
    }

    createPalmTree(x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.95 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, 5.5, 6), trunkMat);
      trunk.position.set(0, 2.75, 0);
      trunk.rotation.z = (Math.random() - 0.5) * 0.14;
      group.add(trunk);

      const frondMat = new THREE.MeshStandardMaterial({ color: 0x1f7a35, roughness: 0.8 });
      for (let i = 0; i < 6; i++) {
        const frond = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.6, 5), frondMat);
        const angle = (i / 6) * Math.PI * 2;
        frond.position.set(Math.cos(angle) * 0.9, 5.2, Math.sin(angle) * 0.9);
        frond.rotation.z = Math.cos(angle) * 0.8;
        frond.rotation.x = Math.sin(angle) * 0.8;
        group.add(frond);
      }
      return group;
    }

    createStreetlight(x, z, flip) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const poleMat = new THREE.MeshStandardMaterial({ color: 0x485058, metalness: 0.8, roughness: 0.3 });
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5.4, 8), poleMat);
      pole.position.y = 2.7;
      group.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.1), poleMat);
      arm.position.set(flip ? -0.85 : 0.85, 5.3, 0);
      group.add(arm);

      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.25), new THREE.MeshBasicMaterial({ color: 0xffea9f }));
      lamp.position.set(flip ? -1.65 : 1.65, 5.2, 0);
      group.add(lamp);

      return group;
    }

    createCityBuilding(x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const height = 14 + Math.random() * 22;
      const width = 8 + Math.random() * 6;
      const depth = 8 + Math.random() * 6;

      const colors = [0x221a3a, 0x1e2438, 0x2d1830, 0x16202c];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const bMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.6 });

      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bMat);
      mesh.position.y = height / 2;
      group.add(mesh);

      const neonColors = [0xff2a85, 0x00f0ff, 0xffd000, 0x9d4edd];
      const neonColor = neonColors[Math.floor(Math.random() * neonColors.length)];
      const neonMat = new THREE.MeshBasicMaterial({ color: neonColor });

      const roofStrip = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.4, depth + 0.2), neonMat);
      roofStrip.position.y = height + 0.2;
      group.add(roofStrip);

      return group;
    }

    // ========================================================================
    // PRIORITY 1: PLAYER HIGH-PERFORMANCE SUPERCAR (WEDGE NOSE, SPLITTER, QUAD EXHAUSTS)
    // ========================================================================
    buildSupercar() {
      this.carGroup = new THREE.Group();
      this.carGroup.position.set(0, 0.44, 0);
      this.scene.add(this.carGroup);

      // Vibrant Cherry Red Metallic Paint
      const paintMat = new THREE.MeshStandardMaterial({ color: 0xd60b44, roughness: 0.22, metalness: 0.88 });
      const glassMat = new THREE.MeshStandardMaterial({ color: 0x100820, roughness: 0.1, metalness: 0.92 });
      const carbonMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.6, metalness: 0.4 });
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.95, roughness: 0.1 });

      // Lower Aerodynamic Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.45, 4.3), paintMat);
      body.position.y = 0.22;
      body.castShadow = true;
      this.carGroup.add(body);

      // Front Splitter / Air Dam (Carbon fiber)
      const splitter = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.06, 0.45), carbonMat);
      splitter.position.set(0, 0.04, -2.18);
      this.carGroup.add(splitter);

      // Dual Hood Air Extractor Vents
      [-0.45, 0.45].forEach(x => {
        const vent = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.65), carbonMat);
        vent.position.set(x, 0.45, -1.1);
        this.carGroup.add(vent);
      });

      // Sleek Fastback Cabin
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.44, 2.2), glassMat);
      cabin.position.set(0, 0.62, -0.2);
      this.carGroup.add(cabin);

      // Aerodynamic Rear Wing / Spoiler on Dual Struts
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x1a0410, roughness: 0.3 });
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.08, 0.38), wingMat);
      wing.position.set(0, 0.76, 2.05);
      this.carGroup.add(wing);

      [-0.6, 0.6].forEach(x => {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.25, 0.18), carbonMat);
        strut.position.set(x, 0.62, 2.05);
        this.carGroup.add(strut);
      });

      // Quad Chrome Exhaust Pipes at Rear
      [-0.55, -0.38, 0.38, 0.55].forEach(x => {
        const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 10), chromeMat);
        tip.rotation.x = Math.PI / 2;
        tip.position.set(x, 0.18, 2.22);
        this.carGroup.add(tip);
      });

      // Dual Headlights & Forward Spot Beams
      const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      [-0.65, 0.65].forEach(x => {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.12, 0.1), headMat);
        h.position.set(x, 0.3, -2.18);
        this.carGroup.add(h);

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

      // High-Detail Wheels with Red Brake Calipers & 5-Spoke Rims
      const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.26, 16);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.95 });
      const rimMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.9, roughness: 0.2 });
      const caliperMat = new THREE.MeshStandardMaterial({ color: 0xcc0011, roughness: 0.3 });

      const createWheel = () => {
        const wGroup = new THREE.Group();
        const tire = new THREE.Mesh(wheelGeo, tireMat);
        tire.rotation.z = Math.PI / 2;
        wGroup.add(tire);

        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.27, 12), rimMat);
        rim.rotation.z = Math.PI / 2;
        wGroup.add(rim);

        // Red Brake Caliper
        const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.12), caliperMat);
        caliper.position.set(0, 0.12, 0);
        wGroup.add(caliper);

        return wGroup;
      };

      // Steerable Front Wheel Pivots
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

      this.allWheels = [flWheel, frWheel, rlWheel, rrWheel];
    }

    // ========================================================================
    // PRIORITY 1: 6 DISTINCT PROCEDURAL TRAFFIC CATEGORIES
    // ========================================================================
    buildTrafficPool() {
      const types = ['coupe', 'sedan', 'suv', 'van', 'bus', 'truck', 'coupe', 'sedan'];
      const initialZ = [-45, -75, -110, -145, -180, -215, -250, -285];

      for (let i = 0; i < this.maxTrafficCount; i++) {
        const type = types[i % types.length];
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
      if (type === 'coupe') return this.createCoupe();
      if (type === 'sedan') return this.createSedan();
      if (type === 'suv') return this.createSUV();
      if (type === 'van') return this.createVan();
      if (type === 'bus') return this.createBus();
      if (type === 'truck') return this.createTruck();
      return this.createSedan();
    }

    // 1. SPORTS COUPE: Low-slung retro sports car
    createCoupe() {
      const colors = [0xff0055, 0x00d4ff, 0xffa500, 0x7928ca, 0x10b981];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.28, metalness: 0.75 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.42, 4.1), bodyMat);
      lower.position.y = 0.21;
      lower.castShadow = true;
      group.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.40, 2.0), new THREE.MeshStandardMaterial({ color: 0x120a1c, roughness: 0.1, metalness: 0.9 }));
      cabin.position.set(0, 0.58, -0.15);
      group.add(cabin);

      // Rear Deck Spoiler
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 0.28), bodyMat);
      spoiler.position.set(0, 0.55, 1.9);
      group.add(spoiler);

      const wheels = this.attachTrafficWheels(group, 0.32, 1.82, 2.5);
      const lights = this.attachTrafficLights(group, 1.82, 4.1, 0.28);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 1.82,
        length: 4.1,
        height: 1.15,
        baseSpeedKMH: 88 + Math.random() * 26
      };
    }

    // 2. LUXURY EXECUTIVE SEDAN
    createSedan() {
      const colors = [0xf4c430, 0x1e3a8a, 0x334155, 0x991b1b, 0xf1f5f9];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.32, metalness: 0.65 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.5, 4.4), bodyMat);
      lower.position.y = 0.25;
      lower.castShadow = true;
      group.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.46, 2.4), new THREE.MeshStandardMaterial({ color: 0x120c1e, roughness: 0.1, metalness: 0.8 }));
      cabin.position.set(0, 0.71, -0.1);
      group.add(cabin);

      // Chrome Front Grille
      const grille = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.08), new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 }));
      grille.position.set(0, 0.26, -2.22);
      group.add(grille);

      const wheels = this.attachTrafficWheels(group, 0.34, 1.88, 2.7);
      const lights = this.attachTrafficLights(group, 1.88, 4.4, 0.32);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 1.88,
        length: 4.4,
        height: 1.28,
        baseSpeedKMH: 80 + Math.random() * 22
      };
    }

    // 3. 4x4 SUV: Elevated height, roof rack, rear spare tire
    createSUV() {
      const colors = [0xf8fafc, 0x1f2937, 0x15803d, 0xc2410c];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.52 });
      const lower = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.65, 4.8), bodyMat);
      lower.position.y = 0.35;
      lower.castShadow = true;
      group.add(lower);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.55, 2.9), new THREE.MeshStandardMaterial({ color: 0x140e22, roughness: 0.1, metalness: 0.8 }));
      cabin.position.set(0, 0.94, -0.1);
      group.add(cabin);

      // Roof Rails
      const railMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7 });
      [-0.75, 0.75].forEach(x => {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.6), railMat);
        rail.position.set(x, 1.25, -0.1);
        group.add(rail);
      });

      // Rear-Mounted Spare Tire on Tailgate
      const spareGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.22, 14);
      const spareTire = new THREE.Mesh(spareGeo, new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.95 }));
      spareTire.rotation.x = Math.PI / 2;
      spareTire.position.set(0, 0.6, 2.46);
      group.add(spareTire);

      const wheels = this.attachTrafficWheels(group, 0.38, 2.1, 3.0);
      const lights = this.attachTrafficLights(group, 2.1, 4.8, 0.42);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.1,
        length: 4.8,
        height: 1.58,
        baseSpeedKMH: 82 + Math.random() * 24
      };
    }

    // 4. CARGO DELIVERY VAN: Commercial delivery van
    createVan() {
      const colors = [0xf97316, 0x0ea5e9, 0xf3f4f6, 0x4f46e5];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.4 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.28, 5.2), bodyMat);
      box.position.y = 0.68;
      box.castShadow = true;
      group.add(box);

      const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.48, 0.1), new THREE.MeshStandardMaterial({ color: 0x100818, roughness: 0.1 }));
      windshield.position.set(0, 0.9, -2.62);
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
        height: 1.85,
        baseSpeedKMH: 72 + Math.random() * 18
      };
    }

    // 5. CITY TRANSIT BUS: Coach with panoramic windows & destination marquee
    createBus() {
      const colors = [0xff2a85, 0x0288d1, 0xf59e0b];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const group = new THREE.Group();

      const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.4 });
      const main = new THREE.Mesh(new THREE.BoxGeometry(2.35, 1.8, 9.6), bodyMat);
      main.position.y = 0.98;
      main.castShadow = true;
      group.add(main);

      // Tinted Window Strips
      const winMat = new THREE.MeshStandardMaterial({ color: 0x100c1e, roughness: 0.1 });
      [-1.18, 1.18].forEach(x => {
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.65, 8.4), winMat);
        win.position.set(x, 1.18, 0);
        group.add(win);
      });

      // Front Destination Marquee Sign
      const marqueeMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      const marquee = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 0.08), marqueeMat);
      marquee.position.set(0, 1.62, -4.82);
      group.add(marquee);

      const wheels = this.attachTrafficWheels(group, 0.42, 2.35, 6.4);
      const lights = this.attachTrafficLights(group, 2.35, 9.6, 0.45);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.35,
        length: 9.6,
        height: 2.45,
        baseSpeedKMH: 62 + Math.random() * 16
      };
    }

    // 6. HEAVY SEMI-TRUCK: Conventional cab with chrome stacks & corrugated trailer
    createTruck() {
      const group = new THREE.Group();

      // Conventional Tractor Cab
      const cabMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.35, metalness: 0.65 });
      const cab = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.9, 2.9), cabMat);
      cab.position.set(0, 1.05, -4.2);
      cab.castShadow = true;
      group.add(cab);

      // Hood / Engine Nose
      const nose = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.1, 1.6), cabMat);
      nose.position.set(0, 0.7, -6.1);
      group.add(nose);

      // Dual Vertical Chrome Exhaust Stacks
      const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.95, roughness: 0.15 });
      [-1.1, 1.1].forEach(x => {
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8), chromeMat);
        stack.position.set(x, 2.3, -3.2);
        group.add(stack);
      });

      // Heavy Corrugated Container Trailer
      const trailerMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3, metalness: 0.7 });
      const trailer = new THREE.Mesh(new THREE.BoxGeometry(2.42, 2.2, 8.2), trailerMat);
      trailer.position.set(0, 1.25, 1.6);
      trailer.castShadow = true;
      group.add(trailer);

      const wheels = this.attachTrafficWheels(group, 0.44, 2.4, 7.8);
      const lights = this.attachTrafficLights(group, 2.4, 12.2, 0.48);

      return {
        group,
        wheels,
        headlights: lights.heads,
        taillights: lights.tails,
        width: 2.42,
        length: 12.2,
        height: 2.7,
        baseSpeedKMH: 54 + Math.random() * 16
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
      const heads = [];
      const tails = [];
      const halfW = width / 2 - 0.25;
      const halfL = length / 2 + 0.02;

      const headMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
      [-halfW, halfW].forEach(x => {
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.06), headMat);
        h.position.set(x, height, -halfL);
        group.add(h);
        heads.push(h);
      });

      const tailMat = new THREE.MeshBasicMaterial({ color: 0xee1122 });
      [-halfW, halfW].forEach(x => {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.12, 0.06), tailMat);
        t.position.set(x, height, halfL);
        group.add(t);
        tails.push(t);
      });

      return { heads, tails };
    }

    // ========================================================================
    // INPUTS, CONTROLS & EVENT LISTENERS
    // ========================================================================
    setupControls() {
      window.addEventListener('keydown', e => {
        const key = e.key.toLowerCase();
        if (key === 'w' || key === 'arrowup') { this.keys.forward = true; e.preventDefault(); }
        if (key === 's' || key === 'arrowdown') { this.keys.backward = true; e.preventDefault(); }
        if (key === 'a' || key === 'arrowleft') { this.keys.left = true; e.preventDefault(); }
        if (key === 'd' || key === 'arrowright') { this.keys.right = true; e.preventDefault(); }
        if (e.code === 'Space') {
          // If on game over modal, space restarts instantly!
          if (this.gameState === 'crashed') {
            this.retryRace();
          } else {
            this.keys.handbrake = true;
          }
          e.preventDefault();
        }
        if (e.code === 'Enter') {
          if (this.gameState === 'crashed') {
            this.retryRace();
            e.preventDefault();
          } else if (this.gameState === 'menu') {
            this.startRace();
            e.preventDefault();
          }
        }
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
      if (btnStart) btnStart.addEventListener('click', () => this.startRace());

      // Pause Buttons
      const btnPause = document.getElementById('btn-game-pause');
      if (btnPause) btnPause.addEventListener('click', () => this.togglePause());

      const btnResume = document.getElementById('btn-resume-race');
      if (btnResume) btnResume.addEventListener('click', () => this.resumeRace());

      const btnRestartPause = document.getElementById('btn-restart-from-pause');
      if (btnRestartPause) btnRestartPause.addEventListener('click', () => this.retryRace());

      // Retry & Menu Buttons from Game Over (PRIORITY 3: NEVER CUT OFF)
      const btnRetry = document.getElementById('btn-retry-race');
      if (btnRetry) btnRetry.addEventListener('click', () => this.retryRace());

      const btnMenu = document.getElementById('btn-menu-from-gameover');
      if (btnMenu) btnMenu.addEventListener('click', () => this.showMenu());

      // Camera Switch Button
      const btnCam = document.getElementById('btn-game-cam');
      if (btnCam) btnCam.addEventListener('click', () => this.toggleCamera());

      // Audio Settings Modal Dialog Controls (PRIORITY 2 & 7)
      const btnAudio = document.getElementById('btn-game-audio');
      const btnOpenAudio = document.getElementById('btn-open-audio-settings');
      const audioModal = document.getElementById('game-audio-modal');
      const btnCloseAudio = document.getElementById('btn-close-audio-settings');

      if (btnAudio && audioModal) {
        btnAudio.addEventListener('click', () => {
          audioModal.style.display = 'flex';
        });
      }
      if (btnOpenAudio && audioModal) {
        btnOpenAudio.addEventListener('click', () => {
          audioModal.style.display = 'flex';
        });
      }

      if (btnCloseAudio && audioModal) {
        btnCloseAudio.addEventListener('click', () => {
          audioModal.style.display = 'none';
        });
      }

      // Audio Sliders & Displays
      const sliderMaster = document.getElementById('slider-audio-master');
      const dispMaster = document.getElementById('val-disp-master');
      if (sliderMaster) {
        sliderMaster.addEventListener('input', e => {
          const val = parseFloat(e.target.value) / 100;
          this.sound.setMasterVolume(val);
          if (dispMaster) dispMaster.textContent = `${e.target.value}%`;
        });
      }

      const sliderMusic = document.getElementById('slider-audio-music');
      if (sliderMusic) {
        sliderMusic.addEventListener('input', e => {
          const val = parseFloat(e.target.value) / 100;
          this.sound.setMusicVolume(val);
        });
      }

      const sliderSfx = document.getElementById('slider-audio-sfx');
      if (sliderSfx) {
        sliderSfx.addEventListener('input', e => {
          const val = parseFloat(e.target.value) / 100;
          this.sound.setSfxVolume(val);
        });
      }

      const sliderEngine = document.getElementById('slider-audio-engine');
      const dispEngine = document.getElementById('val-disp-engine');
      if (sliderEngine) {
        sliderEngine.addEventListener('input', e => {
          const val = parseFloat(e.target.value) / 100;
          this.sound.setEngineVolume(val);
          if (dispEngine) dispEngine.textContent = `${e.target.value}%`;
        });
      }

      // Music & SFX Toggles
      const toggleMusic = document.getElementById('toggle-audio-music');
      if (toggleMusic) {
        toggleMusic.addEventListener('click', () => {
          const active = this.sound.toggleMusic();
          toggleMusic.textContent = active ? 'ON' : 'OFF';
          toggleMusic.classList.toggle('active', active);
        });
      }

      const toggleSfx = document.getElementById('toggle-audio-sfx');
      if (toggleSfx) {
        toggleSfx.addEventListener('click', () => {
          const active = this.sound.toggleSfx();
          toggleSfx.textContent = active ? 'ON' : 'OFF';
          toggleSfx.classList.toggle('active', active);
        });
      }

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
            if (mode === 'day') this.manualTargetMinutes = 720;
            else if (mode === 'sunset') this.manualTargetMinutes = 1110;
            else if (mode === 'night') this.manualTargetMinutes = 1380;
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
      this.currentStage = 1;
      this.lastStage = 1;

      // Start Synthesized Sound & Synthwave Music
      if (this.sound) {
        this.sound.startEngine();
        this.sound.startMusic();
        this.sound.duckMusic(false);
      }

      // Reset car rotation from any previous crash
      if (this.carGroup) {
        this.carGroup.position.set(0, 0.44, 0);
        this.carGroup.rotation.set(0, 0, 0);
      }

      // Hide Overlays
      const startOverlay = document.getElementById('game-start-overlay');
      if (startOverlay) startOverlay.style.display = 'none';
      const pauseOverlay = document.getElementById('game-pause-overlay');
      if (pauseOverlay) pauseOverlay.style.display = 'none';
      const goOverlay = document.getElementById('game-gameover-overlay');
      if (goOverlay) goOverlay.style.display = 'none';

      // Update Stage Badge
      this.updateStageHUD();

      // Reset Traffic positions
      this.resetTrafficPositions();
      this.showToast('RACE STARTED! WATCH FOR TRAFFIC 🚦');
    }

    pauseRace() {
      if (this.gameState !== 'playing') return;
      this.gameState = 'paused';
      this.isPaused = true;
      if (this.sound) {
        this.sound.stopEngine();
        this.sound.duckMusic(true);
      }

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

      if (this.sound) {
        this.sound.startEngine();
        this.sound.duckMusic(false);
      }

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
      if (this.sound) {
        this.sound.stopEngine();
        this.sound.duckMusic(true);
      }

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

      // Play Sound & Duck Music
      if (this.sound) {
        this.sound.playCrash();
        this.sound.stopEngine();
        this.sound.duckMusic(true);
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
        if (this.sound) this.sound.playHighscoreFanfare();
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

      const goStage = document.getElementById('gameover-stage');
      if (goStage) goStage.textContent = `STAGE ${this.currentStage}: ${this.stageNames[this.currentStage] || ''}`;

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
      }, 1500);
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
    // PRIORITY 4: 4-STAGE PROGRESSIVE DIFFICULTY UPDATER
    // ========================================================================
    updateStageProgression() {
      let stage = 1;
      if (this.distanceKM < 1.0) stage = 1;
      else if (this.distanceKM < 2.5) stage = 2;
      else if (this.distanceKM < 5.0) stage = 3;
      else stage = 4;

      if (stage !== this.currentStage) {
        this.currentStage = stage;
        if (this.sound) this.sound.playStageUp();
        this.showToast(`🔥 ADVANCED TO STAGE ${this.currentStage}: ${this.stageNames[this.currentStage]}!`);
        this.updateStageHUD();
      }
    }

    updateStageHUD() {
      const pill = document.getElementById('hud-stage-pill');
      if (!pill) return;
      pill.textContent = `STAGE ${this.currentStage}: ${this.stageNames[this.currentStage]}`;
      pill.className = `game-stage-pill stage-${this.currentStage}`;
    }

    // ========================================================================
    // PHYSICS & DRIVING SIMULATION
    // ========================================================================
    updatePhysics(delta) {
      if (this.gameState === 'paused') return;

      if (this.gameState === 'playing') {
        const isBraking = this.keys.backward || this.keys.handbrake;
        const isAccelerating = this.keys.forward;

        // 1. Throttle / Acceleration & Braking (KM/H)
        if (this.keys.handbrake) {
          if (this.speedKMH > 0) this.speedKMH = Math.max(0, this.speedKMH - this.brakeRate * 1.5 * delta);
          else if (this.speedKMH < 0) this.speedKMH = Math.min(0, this.speedKMH + this.brakeRate * 1.5 * delta);
        } else if (isAccelerating) {
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
          this.updateStageProgression();
        }

        // Update Multi-Gear Engine Sound Synthesizer
        if (this.sound) {
          this.sound.updateEngine(this.speedKMH, isAccelerating, isBraking);
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

      // 5. Spin All 4 Wheels cleanly on w.rotation.x
      const linearSpeed = (this.speedKMH / 100) * 32;
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

      // Stage Speed Multiplier: Stage 1 is gentle, Stage 4 is fast and aggressive
      let stageSpeedBonus = 0;
      if (this.currentStage === 2) stageSpeedBonus = 10;
      else if (this.currentStage === 3) stageSpeedBonus = 22;
      else if (this.currentStage === 4) stageSpeedBonus = 35;

      this.trafficCars.forEach(car => {
        const effectiveCarSpeed = car.speedKMH + stageSpeedBonus;
        const relSpeedKMH = this.speedKMH - effectiveCarSpeed;
        const relLinearSpeed = (relSpeedKMH / 100) * 32;
        car.group.position.z += relLinearSpeed * delta;

        // Spin traffic wheels with their ground speed
        const spinDelta = ((effectiveCarSpeed / 100) * 32 / 0.34) * delta;
        car.wheels.forEach(w => w.rotation.x -= spinDelta);

        // Organic lane sway (slightly more dynamic at higher stages)
        const swayAmp = 0.12 + (this.currentStage * 0.04);
        car.group.position.x = car.laneX + Math.sin(car.group.position.z * 0.04 + car.seed) * swayAmp;

        // Close-Call & Overtake Detection (PRIORITY 5)
        if (!car.passed && car.group.position.z > 0) {
          car.passed = true;
          this.overtakes++;

          // Near Miss Criteria: Lateral distance < 2.1m and Player Speed >= 80 km/h
          const lateralDist = Math.abs(this.posX - car.group.position.x);
          if (this.speedKMH >= 80 && lateralDist < 2.1) {
            this.closeCalls++;
            this.score += 150;
            if (this.sound) this.sound.playCloseCall();
            this.showToast('⚡ +150 CLOSE CALL!');
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
      if (this.autoCycle) {
        this.timeOfDayMinutes = (this.timeOfDayMinutes + (delta / this.cycleDurationSec) * 1440) % 1440;
      } else if (this.manualTargetMinutes !== null) {
        this.timeOfDayMinutes += (this.manualTargetMinutes - this.timeOfDayMinutes) * Math.min(1.0, delta * 3.0);
      }

      const mins = Math.floor(this.timeOfDayMinutes);
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      const hh = hours.toString().padStart(2, '0');
      const mm = remMins.toString().padStart(2, '0');

      const skyColor = new THREE.Color();
      const sunColor = new THREE.Color();
      const ambColor = new THREE.Color();
      const fogColor = new THREE.Color();
      const waterColor = new THREE.Color();
      let sunIntensity = 2.4;
      let phaseName = 'DAY';
      let isDark = false;

      if (mins >= 300 && mins < 480) {
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
        phaseName = 'DAY';
        skyColor.setHex(0x38a8e8);
        sunColor.setHex(0xfffae0);
        ambColor.setHex(0xbde8ff);
        fogColor.setHex(0x6ec0f0);
        waterColor.setHex(0x05b8cc);
        sunIntensity = 2.6;
        isDark = false;
      } else if (mins >= 990 && mins < 1170) {
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
        phaseName = 'NIGHT';
        skyColor.setHex(0x0c0722);
        sunColor.setHex(0x221240);
        ambColor.setHex(0x221840);
        fogColor.setHex(0x0e0826);
        waterColor.setHex(0x06182c);
        sunIntensity = 0.5;
        isDark = true;
      }

      if (this.scene) {
        this.scene.background = skyColor;
        if (this.scene.fog) this.scene.fog.color.copy(fogColor);
      }
      if (this.renderer) this.renderer.setClearColor(skyColor);
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
        const sunAngle = (this.timeOfDayMinutes / 1440) * Math.PI * 2 - Math.PI / 2;
        this.sunLight.position.set(
          Math.cos(sunAngle) * 50,
          Math.max(16, Math.sin(sunAngle) * 45),
          -50
        );
      }
      if (this.oceanMesh) this.oceanMesh.material.color.copy(waterColor);

      this.spotlights.forEach(s => {
        s.intensity = isDark ? 4.5 : 0.6;
      });

      this.trafficCars.forEach(car => {
        car.headlights.forEach(h => {
          h.material.color.setHex(isDark ? 0xfffae0 : 0xaa9988);
        });
        car.taillights.forEach(t => {
          t.material.color.setHex(isDark ? 0xff1122 : 0x881122);
        });
      });

      const statusPill = document.getElementById('hud-env-status');
      if (statusPill) statusPill.textContent = `[${hh}:${mm} ${phaseName}]`;
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
      // 1. Digital Speedometer in KM/H
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

    update(delta) {
      this.updatePhysics(delta);
      this.updateTraffic(delta);
      this.updateEnvironment(delta);
      this.updateCamera(delta);
      this.updateHUD();
    }

    render() {
      if (!this.renderer || !this.scene || !this.camera) return;

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

    onTabActivated() {
      const stage = document.getElementById('main-studio-stage');
      if (stage) {
        stage.scrollTop = 0;
        stage.scrollLeft = 0;
      }
      this.setCameraPreset(this.currentPreset || 'front');
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
          if (input.checked) {
            this.activeTab = radios[id];
          }
          input.addEventListener('change', (e) => {
            if (e.target.checked) {
              this.switchTab(radios[id]);
            }
          });
        }
      });

      // Direct label clicks for immediate responsive switching
      const switcher = document.querySelector('.scene-switcher');
      if (switcher) {
        switcher.addEventListener('click', (e) => {
          const tabLabel = e.target.closest('.scene-tab');
          if (tabLabel) {
            const forId = tabLabel.getAttribute('for');
            if (forId && radios[forId]) {
              const radio = document.getElementById(forId);
              if (radio && !radio.checked) {
                radio.checked = true;
              }
              this.switchTab(radios[forId]);
            }
          }
        });
      }
    }

    switchTab(tabName) {
      this.activeTab = tabName;

      // 1. Reset studio stage scroll position to ensure zero viewport offset
      const stage = document.getElementById('main-studio-stage');
      if (stage) {
        stage.scrollTop = 0;
        stage.scrollLeft = 0;
      }

      // 2. Scene 2 (Chatbot) Tab Activation
      if (tabName === 'talk' && this.dialogueEngine && this.dialogueEngine.onTabActivated) {
        this.dialogueEngine.onTabActivated();
      }

      // 3. Scene 3 (Traffic Racer) Tab Activation
      if (tabName === 'cruise' && this.carGame) {
        const resizeAction = () => {
          if (stage) {
            stage.scrollTop = 0;
            stage.scrollLeft = 0;
          }
          const container = document.getElementById('three-game-viewport');
          if (container && this.carGame) {
            const w = container.clientWidth || 960;
            const h = container.clientHeight || 540;
            this.carGame.resize(w, h);
            this.carGame.render();
          }
        };
        resizeAction();
        requestAnimationFrame(resizeAction);
        setTimeout(resizeAction, 50);
        setTimeout(resizeAction, 150);
      }

      // 4. Scene 4 (Tactical Stance) Tab Activation
      if (tabName === 'action' && this.tacticalEngine && this.tacticalEngine.onTabActivated) {
        this.tacticalEngine.onTabActivated();
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

      // Update Scene 3: Arcade Car Game (only renders when game tab is active)
      if (this.carGame && this.activeTab === 'cruise') {
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
