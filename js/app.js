// app.js (aktualisiert) — robuste UI-Initialisierung und Fallbacks

(function () {
  'use strict';

  // Hilfsfunktionen
  function getEl(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element #${id} nicht gefunden.`);
    return el;
  }

  function safeJSONParse(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('JSON Parse Fehler:', e);
      return null;
    }
  }

  // Storage-API-Fallback: benutze vorhandene Storage-API oder localStorage
  const StorageBackend = (function () {
    if (window.StorageAPI && typeof window.StorageAPI.save === 'function') {
      return {
        save: (key, value) => window.StorageAPI.save(key, value),
        load: (key) => window.StorageAPI.load(key),
        remove: (key) => window.StorageAPI.remove(key)
      };
    }
    return {
      save: (key, value) => {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error('localStorage save failed', e); }
      },
      load: (key) => {
        try { const v = localStorage.getItem(key); return v ? safeJSONParse(v) : null; } catch (e) { console.error('localStorage load failed', e); return null; }
      },
      remove: (key) => {
        try { localStorage.removeItem(key); } catch (e) { console.error('localStorage remove failed', e); }
      }
    };
  })();

  // Kernfunktionen (minimal, anpassbar)
  function saveState() {
    try {
      const state = window.__appState || { players: window.ToniPlayers || [] };
      StorageBackend.save('taktikai_state', state);
      console.log('App-Zustand gespeichert.');
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
    }
  }

  function exportState() {
    try {
      const state = window.__appState || { players: window.ToniPlayers || [] };
      const text = JSON.stringify(state, null, 2);
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'taktikai-state.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      console.log('Export gestartet.');
    } catch (e) {
      console.error('Export fehlgeschlagen:', e);
    }
  }

  function importFileHandler(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const text = ev.target.result;
      const data = safeJSONParse(text);
      if (!data) {
        console.error('Import: ungültiges JSON.');
        return;
      }
      // Übernehme importierte Daten in App-Zustand (minimal)
      window.__appState = data;
      StorageBackend.save('taktikai_state', data);
      console.log('Import erfolgreich, Zustand aktualisiert.');
      // Optional: trigger UI refresh hooks
      if (typeof window.onStateImported === 'function') window.onStateImported(data);
    };
    reader.onerror = function (err) {
      console.error('Dateilesefehler:', err);
    };
    reader.readAsText(file);
  }

  function handleLogout() {
    try {
      StorageBackend.remove('sessionUser');
      sessionStorage.removeItem('sessionUser');
      console.log('Logout: Session entfernt.');
      if (typeof window.onLogout === 'function') window.onLogout();
      // Optional: redirect if function exists
      if (typeof window.redirectToLogin === 'function') {
        window.redirectToLogin();
      }
    } catch (e) {
      console.error('Logout Fehler:', e);
    }
  }

  // Initialisierung der UI-Elemente (id-basierte Bindungen)
  function initUIBindings() {
    const saveBtn = getEl('save-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveState);

    const exportBtn = getEl('export-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportState);

    const importFile = getEl('import-file');
    const importBtn = getEl('import-btn'); // optional sichtbarer Button
    if (importFile) {
      importFile.addEventListener('change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) importFileHandler(f);
      });
    }
    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
    }

    const logoutBtn = getEl('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Beispiel: voice toggle (falls vorhanden)
    const voiceToggle = getEl('voice-toggle');
    const voiceStatus = getEl('voice-status');
    if (voiceToggle && voiceStatus) {
      voiceToggle.addEventListener('click', () => {
        const active = voiceStatus.textContent.toLowerCase().includes('aktiv');
        voiceStatus.textContent = active ? 'Mikrofon: inaktiv' : 'Mikrofon: aktiv';
        if (typeof window.onVoiceToggle === 'function') window.onVoiceToggle(!active);
      });
    }
  }

  // Öffentliche Initialisierung, damit main.js oder andere Skripte window.initApp() aufrufen können
  function initApp() {
    try {
      initUIBindings();
      console.log('app.js: UI Bindings initialisiert.');
      // Lade gespeicherten Zustand falls vorhanden
      const saved = StorageBackend.load('taktikai_state');
      if (saved) {
        window.__appState = saved;
        console.log('app.js: Zustand aus Storage geladen.');
        if (typeof window.onStateLoaded === 'function') window.onStateLoaded(saved);
      }
    } catch (e) {
      console.error('initApp Fehler:', e);
    }
  }

  // Automatische Initialisierung nach DOMContentLoaded, falls initApp nicht manuell aufgerufen wird
  document.addEventListener('DOMContentLoaded', () => {
    // Wenn main.js bereits initApp aufruft, ist das kein Problem — initApp ist idempotent.
    if (!window.initAppCalled) {
      try {
        initApp();
        window.initAppCalled = true;
      } catch (e) {
        console.error('Automatische initApp fehlgeschlagen:', e);
      }
    }
  });

  // Exporte auf window für externe Aufrufe und Tests
  window.initApp = initApp;
  window.appSaveState = saveState;
  window.appExportState = exportState;
  window.appImportFileHandler = importFileHandler;
  window.appLogout = handleLogout;

})();
