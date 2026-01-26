// Einfacher local/session Storage Wrapper
const Storage = {
  saveSquad(key = 'toni.squad', data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.warn('Storage save failed', e); }
  },
  loadSquad(key = 'toni.squad') {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (e) { console.warn('Storage load failed', e); return null; }
  },
  saveSession(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) { console.warn('Session save failed', e); }
  },
  loadSession(key) {
    try { return sessionStorage.getItem(key); } catch (e) { console.warn('Session load failed', e); return null; }
  }
};
