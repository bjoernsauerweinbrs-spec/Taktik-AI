// js/app.js
// App bootstrap, Sequencer (Ginga), EventBus wiring and minimal Sidebar integration.
// Exports: start(options) -> initializes modules and runs sequencer hooks.
// Assumes modules exist under ./modules/*.js (eventbus, voice, database, roster, arena)

import EventBus from './modules/eventbus.js';
import Voice from './modules/voice.js';
import Database from './modules/database.js';
import Roster from './modules/roster.js';
import Arena from './modules/arena.js';

// Simple perf detection (low-power heuristic)
function detectLowPower() {
  try {
    const nav = navigator;
    if (nav && nav.deviceMemory && nav.deviceMemory < 2) return true;
    if (nav && 'connection' in nav && nav.connection) {
      const c = nav.connection;
      if (c.saveData) return true;
      if (c.effectiveType && (c.effectiveType.includes('2g') || c.effectiveType.includes('3g'))) return true;
    }
  } catch (e) { /* ignore */ }
  return false;
}

// Sequencer: controls deterministic Ginga start phases
class Sequencer {
  constructor({ voice, arena, sidebarEl, blackoutEl }) {
    this.voice = voice;
    this.arena = arena;
    this.sidebarEl = sidebarEl;
    this.blackoutEl = blackoutEl;
    this._aborted = false;
    this._current = null;
  }

  async start() {
    this._aborted = false;
    try {
      // Phase 0: Blackout already visible by default
      EventBus.emit('sequence:phase', { phase: 'blackout' });

      // Phase 1: Voice Intro
      const intro = "Ich bin Toni. Dein Taktik-System auf Weltniveau ist bereit. Björn, übernehmen wir die Spielkontrolle?";
      await this._awaitOrAbort(this.voice.speak(intro, { role: 'intro' }));

      EventBus.emit('sequence:phase', { phase: 'voice:ended' });

      // Phase 2: Ask age/class (Gretchenfrage)
      // Emit event so UI (sidebar/chat) can show selection UI
      EventBus.emit('sequence:ask:ageclass', {
        prompt: 'Wähle Altersklasse',
        options: ['senioren', 'jugend', 'funino']
      });

      // Wait for user selection event: 'sequence:ageclass:selected'
      const selected = await this._waitForEvent('sequence:ageclass:selected');
      if (!selected) throw new Error('No selection');

      EventBus.emit('sequence:phase', { phase: 'ageclass:selected', value: selected });

      // Phase 3: SVG Build (construction)
      // arena.animateConstruction should return a Promise that resolves when animation completes
      await this._awaitOrAbort(this.arena.animateConstruction(selected));

      EventBus.emit('sequence:phase', { phase: 'construction:done' });

      // Reveal field: fade in grass / enable interactions
      this._revealField();

      // Open sidebar chat automatically
      EventBus.emit('ui:openSidebar', { view: 'chat', auto: true });

      EventBus.emit('sequence:done');
    } catch (err) {
      if (this._aborted) {
        EventBus.emit('sequence:aborted');
      } else {
        console.error('Sequencer error', err);
        EventBus.emit('sequence:error', { error: String(err) });
      }
    }
  }

  // Helper to await a promise but allow abort via sequence:skip or sequence:abort
  _awaitOrAbort(promise) {
    if (!promise || typeof promise.then !== 'function') return Promise.resolve();
    this._current = promise;
    return new Promise((resolve, reject) => {
      let done = false;
      promise.then((v) => { if (!this._aborted) { done = true; resolve(v); } })
             .catch((e) => { if (!this._aborted) reject(e); });
      // listen for skip/abort
      const onSkip = () => {
        if (done) return;
        this._aborted = true;
        EventBus.off('sequence:skip', onSkip);
        reject(new Error('sequence skipped'));
      };
      EventBus.on('sequence:skip', onSkip);
    });
  }

  _waitForEvent(eventType) {
    return new Promise((resolve) => {
      const handler = (payload) => {
        EventBus.off(eventType, handler);
        resolve(payload);
      };
      EventBus.on(eventType, handler);
    });
  }

  abort() {
    this._aborted = true;
    EventBus.emit('sequence:abort');
  }

  _revealField() {
    if (this.blackoutEl) {
      this.blackoutEl.style.transition = 'opacity 420ms ease';
      this.blackoutEl.style.opacity = '0';
      setTimeout(() => {
        this.blackoutEl.setAttribute('aria-hidden', 'true');
        this.blackoutEl.style.display = 'none';
      }, 450);
    }
    // enable arena interactions
    EventBus.emit('field:revealed');
  }
}

// Sidebar controller (single DOM element API)
class SidebarController {
  constructor(sidebarEl) {
    this.el = sidebarEl;
    this.currentView = null;
    this._init();
  }

  _init() {
    // Tab clicks
    this.el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-view]');
      if (!btn) return;
      const view = btn.getAttribute('data-view');
      this.open(view);
    });

    // Listen to global events
    document.addEventListener('ui:toggleSidebar', () => {
      const hidden = this.el.getAttribute('aria-hidden') === 'true';
      if (hidden) this.open(this.currentView || 'chat');
      else this.close();
    });

    EventBus.on('ui:openSidebar', ({ view }) => {
      this.open(view || 'chat');
    });
  }

  open(view = 'chat') {
    // set aria and transform for mobile overlay
    this.el.setAttribute('aria-hidden', 'false');
    this.el.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = this.el.querySelector(`.tab[data-view="${view}"]`);
    if (tab) tab.classList.add('active');
    this.currentView = view;
    // lazy mount panel content via event
    EventBus.emit('sidebar:mount', { view });
  }

  close() {
    this.el.setAttribute('aria-hidden', 'true');
    EventBus.emit('sidebar:unmount', { view: this.currentView });
    this.currentView = null;
  }

  toggle(view) {
    const hidden = this.el.getAttribute('aria-hidden') === 'true';
    if (hidden) this.open(view || 'chat'); else this.close();
  }
}

// App start: wires modules and starts sequencer if autoStart true
export async function start(opts = {}) {
  const {
    root = document.getElementById('app'),
    blackout = document.getElementById('blackout'),
    sidebar = document.getElementById('sidebar'),
    pitchSvg = document.getElementById('pitch-svg'),
    pitchCanvas = document.getElementById('pitch-canvas'),
    quickPanel = document.getElementById('quick-panel'),
    autoStart = true
  } = opts;

  // Initialize EventBus (singleton)
  EventBus.init();

  // Perf / low power
  const lowPower = detectLowPower();
  EventBus.emit('perf:lowPower', { lowPower });

  // Initialize Database
  await Database.init();
  EventBus.emit('db:ready');

  // Initialize Roster (reads DB)
  await Roster.init({ db: Database, eventBus: EventBus });

  // Initialize Arena (SVG + Canvas)
  await Arena.init({ svg: pitchSvg, canvas: pitchCanvas, eventBus: EventBus, lowPower });

  // Initialize Voice
  await Voice.init({ eventBus: EventBus });

  // Sidebar controller
  const sidebarCtrl = new SidebarController(sidebar);

  // Sequencer
  const sequencer = new Sequencer({ voice: Voice, arena: Arena, sidebarEl: sidebar, blackoutEl: blackout });

  // Wire basic events for UI feedback
  EventBus.on('sequence:phase', (p) => {
    // update header/status or quick panel
    const status = document.getElementById('status-live');
    if (status) status.textContent = `● Sequenz: ${p.phase}`;
  });

  EventBus.on('field:revealed', () => {
    const status = document.getElementById('status-live');
    if (status) status.textContent = '● Live‑Analyse: Bereit';
  });

  EventBus.on('sidebar:mount', async ({ view }) => {
    // Lazy mount: request module to render into sidebar-content
    EventBus.emit('ui:mountPanel', { view, target: document.getElementById('sidebar-content') });
  });

  // Hook skip/abort
  document.addEventListener('sequence:skip', () => {
    sequencer.abort();
  });

  // Start sequence unless disabled
  if (autoStart) {
    // small delay to allow UI to render
    setTimeout(() => sequencer.start().catch(e => console.warn('Sequencer failed', e)), 120);
  }

  // Expose some debug handles
  window.TONI_APP = window.TONI_APP || {};
  window.TONI_APP.eventBus = EventBus;
  window.TONI_APP.db = Database;
  window.TONI_APP.roster = Roster;
  window.TONI_APP.arena = Arena;
  window.TONI_APP.voice = Voice;
  window.TONI_APP.sidebar = sidebarCtrl;
  window.TONI_APP.sequencer = sequencer;

  // Return a small API for external control
  return {
    eventBus: EventBus,
    db: Database,
    roster: Roster,
    arena: Arena,
    voice: Voice,
    sidebar: sidebarCtrl,
    sequencer
  };
}
