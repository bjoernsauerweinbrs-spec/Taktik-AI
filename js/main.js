// Debug‑Wrapper (temporär)
(function(){
  try {
    // ab hier kommt dein bisheriger main.js‑Code
  } catch (err) {
    console.error('Fehler in main.js (gefangen):', err);
    console.error(err.stack);
    throw err; // optional: weiterwerfen, damit DevTools normale Fehleranzeige behält
  }
})();
// public/js/main.js
document.addEventListener('DOMContentLoaded', async () => {
  console.log("Toni 2.0 startet…");

  // Spieler laden (lokale JSON)
  try {
    const res = await fetch('js/data/players.sample.json');
    const players = await res.json();
    window.ToniPlayers = players;
    console.log("Spieler geladen:", players.length);
  } catch (err) {
    console.error("Fehler beim Laden der Spieler:", err);
  }

  // UI‑Module initialisieren (falls vorhanden)
  if (window.TaktikboardUI && typeof window.TaktikboardUI.init === 'function') {
    try {
      window.TaktikboardUI.init();
    } catch (err) {
      console.error("TaktikboardUI Fehler:", err);
    }
  }

  if (window.AnalysisCenterUI && typeof window.AnalysisCenterUI.init === 'function') {
    try {
      window.AnalysisCenterUI.init();
    } catch (err) {
      console.error("AnalysisCenterUI Fehler:", err);
    }
  }

  if (window.SportwatchUI && typeof window.SportwatchUI.init === 'function') {
    try {
      window.SportwatchUI.init();
    } catch (err) {
      console.error("SportwatchUI Fehler:", err);
    }
  }

  // Voice‑Module initialisieren
  if (window.VoiceInput && typeof window.VoiceInput.init === 'function') {
    try {
      window.VoiceInput.init();
    } catch (err) {
      console.error("VoiceInput Fehler:", err);
    }
  }

  // Wenn User eingeloggt → App öffnen
  const u = sessionStorage.getItem('sessionUser');
  if (u && typeof enterApp === 'function') {
    enterApp(u);
  }
});
