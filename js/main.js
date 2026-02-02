// =========================================
// Toni 2.0 – Main Orchestrator
// =========================================

window.TONI = {
    version: "2.0",
    players: [],
    storage: typeof Storage !== 'undefined' ? Storage : null,
    isInitialized: false
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("⚽ Toni 2.0 wird hochgefahren...");

    try {
        // 1. Daten laden (absoluter Pfad für GitHub Pages)
        const response = await fetch('data/players.sample.json');
        if (!response.ok) throw new Error("Kaderdaten konnten nicht geladen werden.");
        window.TONI.players = await response.json();
        console.log("✅ Kader geladen:", window.TONI.players.length, "Spieler");

        // 2. Arena Initialisieren
        const canvas = document.getElementById('arena-canvas');
        if (canvas && typeof initArena === 'function') {
            initArena(canvas);
            // Spieler in die Arena-Engine übertragen
            arena.players = window.TONI.players; 
            renderArena();
        }

        // 3. UI Komponenten starten
        if (typeof initTaktikboardUI === 'function') initTaktikboardUI();
        if (typeof initAktentascheUI === 'function') initAktentascheUI();
        if (typeof initVoice === 'function') initVoice();
        if (typeof initHologramEffects === 'function') initHologramEffects();

        // 4. Session Check
        const user = sessionStorage.getItem('sessionUser');
        if (user && typeof enterApp === 'function') {
            enterApp(user);
        }

        window.TONI.isInitialized = true;
        console.log("🚀 Toni 2.0 Einsatzbereit.");

    } catch (err) {
        console.error("❌ Kritischer Systemfehler beim Start:", err);
    }
});

// Navigation-Steuerung
document.getElementById('open-board')?.addEventListener('click', () => {
    document.getElementById('board-container').style.display = 'block';
    document.getElementById('aktentasche-container').style.display = 'none';
});

document.getElementById('open-aktentasche')?.addEventListener('click', () => {
    document.getElementById('board-container').style.display = 'none';
    document.getElementById('aktentasche-container').style.display = 'block';
});
