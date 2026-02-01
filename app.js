// public/js/app.js
(function () {
  'use strict';

  function updateStatus(msg, isError = false) {
    const el = document.getElementById('status');
    if (el) {
      el.textContent = msg;
      el.style.color = isError ? '#b00020' : '';
    } else {
      console.log('Status:', msg);
    }
  }

  function safeGet(id) {
    const el = document.getElementById(id);
    if (!el) console.warn(`Element #${id} nicht gefunden.`);
    return el;
  }

  function onSave() {
    try {
      const u = sessionStorage.getItem('sessionUser');
      if (!u) return updateStatus('Nicht angemeldet.', true);
      const dataEl = safeGet('user-data');
      const data = dataEl ? dataEl.value : '';
      Storage.saveUserData(u, data);
      updateStatus('Gespeichert lokal.');
    } catch (err) {
      console.error('Save error:', err);
      updateStatus('Fehler beim Speichern.', true);
    }
  }

  function onExport() {
    try {
      const u = sessionStorage.getItem('sessionUser');
      if (!u) return updateStatus('Nicht angemeldet.', true);
      Storage.exportAll(u);
      updateStatus('Export gestartet.');
    } catch (err) {
      console.error('Export error:', err);
      updateStatus('Export fehlgeschlagen.', true);
    }
  }

  function onImportChange(e) {
    const input = e && e.target;
    const file = input && input.files && input.files[0];
    if (!file) {
      if (input) input.value = '';
      return updateStatus('Keine Datei ausgewählt.', true);
    }

    try {
      Storage.importFromFile(file, (err, obj) => {
        if (err) {
          console.error('Import error:', err);
          updateStatus('Import fehlgeschlagen.', true);
          if (input) input.value = '';
          return;
        }
        if (obj && obj.user && obj.user.username) {
          try {
            Storage.saveUser(obj.user.username, obj.user.password || '');
            if (obj.data !== undefined) Storage.saveUserData(obj.user.username, obj.data);
            updateStatus('Import erfolgreich. Bitte anmelden.');
          } catch (e) {
            console.error('Processing import error:', e);
            updateStatus('Fehler beim Verarbeiten der Importdatei.', true);
          }
        } else {
          updateStatus('Ungültige Datei.', true);
        }
        if (input) input.value = '';
      });
    } catch (err) {
      console.error('Import exception:', err);
      updateStatus('Import fehlgeschlagen.', true);
      if (input) input.value = '';
    }
  }

  function onLogout() {
    try {
      sessionStorage.removeItem('sessionUser');
      const appSection = safeGet('app-section');
      const authSection = safeGet('auth-section');
      if (appSection) appSection.style.display = 'none';
      if (authSection) authSection.style.display = 'block';
      updateStatus('Abgemeldet.');
    } catch (err) {
      console.error('Logout error:', err);
      updateStatus('Fehler beim Abmelden.', true);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const saveBtn = safeGet('save-btn');
    const exportBtn = safeGet('export-btn');
    const importFile = safeGet('import-file');
    const logoutBtn = safeGet('logout-btn');

    if (saveBtn) saveBtn.addEventListener('click', onSave);
    if (exportBtn) exportBtn.addEventListener('click', onExport);
    if (importFile) importFile.addEventListener('change', onImportChange);
    if (logoutBtn) logoutBtn.addEventListener('click', onLogout);

    const u = sessionStorage.getItem('sessionUser');
    if (u && typeof enterApp === 'function') {
      try {
        enterApp(u);
      } catch (err) {
        console.error('enterApp Fehler:', err);
      }
    }
  });
})();