// main.js (aktualisiert)
// Debug‑Wrapper (temporär)
(function () {
  try {
    // --- Hauptcode ---
    async function fetchPlayersWithFallback() {
      const candidates = [
        'data/players.sample.json',   // bevorzugter Pfad (Repo-Root/data)
        'js/data/players.sample.json' // Fallback, falls Datei in js/data liegt
      ];

      for (const url of candidates) {
        try {
          const res = await fetch(url, { cache: 'no-store' });
          if (!res.ok) {
            // 404/500 etc. — weiter zum nächsten Kandidaten
            console.warn(`Fetch ${url} returned ${res.status}`);
            continue;
          }
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            console.log(`Players geladen von ${url}`);
            return { data: json, url };
          } catch (parseErr) {
            console.error(`Ungültiges JSON in ${url}:`, parseErr);
            // Wenn HTML (z. B. 404-Seite) zurückkam, weiter versuchen
            continue;
          }
        } catch (fetchErr) {
          console.warn(`Fehler beim Fetch ${url}:`, fetchErr);
          // weiter zum nächsten Kandidaten
        }
      }

      // Wenn keiner der Pfade funktioniert hat:
      throw new Error('players.sample.json konnte nicht geladen werden (alle Pfade fehlgeschlagen)');
    }

    // DOMContentLoaded Handler
    document.addEventListener('DOMContentLoaded', async () => {
      console.log('Toni 2.0 startet…');

      // Spieler laden
      try {
        const result = await fetchPlayersWithFallback();
        window.ToniPlayers = result.data;
        // Wenn Array erwartet wird, logge Länge, sonst Objekt‑Keys
        if (Array.isArray(result.data)) {
          console.log('Spieler geladen:', result.data.length);
        } else if (result.data && typeof result.data === 'object') {
          console.log('Spieler geladen (Objekt):', Object.keys(result.data).length);
        } else {
          console.log('Spieler geladen (unbekanter Typ):', result.data);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Spieler:', err);
      }

      // UI‑Module initialisieren (falls vorhanden)
      try {
        if (window.TaktikboardUI && typeof window.TaktikboardUI.init === 'function') {
          window.TaktikboardUI.init();
          console.log('TaktikboardUI initialisiert');
        }
      } catch (err) {
        console.error('TaktikboardUI Fehler:', err);
      }

      try {
        if (window.AnalysisCenterUI && typeof window.AnalysisCenterUI.init === 'function') {
          window.AnalysisCenterUI.init();
          console.log('AnalysisCenterUI initialisiert');
        }
      } catch (err) {
        console.error('AnalysisCenterUI Fehler:', err);
      }

      try {
        if (window.SportwatchUI && typeof window.SportwatchUI.init === 'function') {
          window.SportwatchUI.init();
          console.log('SportwatchUI initialisiert');
        }
      } catch (err) {
        console.error('SportwatchUI Fehler:', err);
      }

      // Voice‑Module initialisieren
      try {
        if (window.VoiceInput && typeof window.VoiceInput.init === 'function') {
          window.VoiceInput.init();
          console.log('VoiceInput initialisiert');
        }
      } catch (err) {
        console.error('VoiceInput Fehler:', err);
      }

      // Wenn User eingeloggt → App öffnen
      try {
        const u = sessionStorage.getItem('sessionUser');
        if (u && typeof enterApp === 'function') {
          enterApp(u);
          console.log('enterApp aufgerufen für User:', u);
        }
      } catch (err) {
        console.error('Fehler beim Aufruf von enterApp:', err);
      }
    });
    // --- Ende Hauptcode ---
  } catch (err) {
    console.error('Fehler in main.js (gefangen):', err);
    console.error(err.stack);
    throw err;
  }
})();
