// main.js - Zentraler Startpunkt (Vollständig & ohne export)
window.TONI = {
    version: "2.0.2",
    players: [],
    isInitialized: false
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("⚽ Toni 2.0 startet...");

    try {
        // 1. Daten laden (Pfad für GitHub Pages prüfen!)
        const response = await fetch('data/players.sample.json');
        if (!response.ok) throw new Error("Kaderdaten konnten nicht geladen werden.");
        
        window.TONI.players = await response.json();
        console.log("✅ Daten geladen.");

        // 2. Arena Initialisieren
        const canvas = document.getElementById('arena-canvas');
        if (canvas && window.arena) {
            window.arena.init(canvas);
            window.arena.players = window.TONI.players;
            window.arena.render();
        }

        // 3. UI-Module initialisieren
        if (typeof initTaktikboardUI === 'function') initTaktikboardUI();
        if (typeof initAktentascheUI === 'function') initAktentascheUI();
        
        // 4. Prüfen ob User eingeloggt ist
        const sessionUser = sessionStorage.getItem('sessionUser');
        if (sessionUser && typeof enterApp === 'function') {
            enterApp(sessionUser);
        } else {
            // Zeige Login falls kein User (für Testzwecke hier oft ausgeblendet)
            document.getElementById('auth-section').style.display = 'block';
        }

        window.TONI.isInitialized = true;
    } catch (err) {
        console.error("❌ Fehler beim App-Start:", err);
    }
});
