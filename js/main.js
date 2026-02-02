// =========================================
// Toni 2.0 – Main Orchestrator (Final Fix)
// =========================================

window.TONI = {
    version: "2.0.1",
    players: [],
    isInitialized: false
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log("⚽ Toni 2.0 Tiefenanalyse-Start...");

    try {
        // 1. Daten laden
        const response = await fetch('data/players.sample.json');
        if (!response.ok) throw new Error("Kaderdaten nicht gefunden (404).");
        
        const rawData = await response.json();
        
        // Wir stellen sicher, dass jeder Spieler X/Y Koordinaten hat, falls die JSON sie nicht liefert
        window.TONI.players = rawData.map((p, index) => ({
            ...p,
            x: p.x || 100 + (index * 40),
            y: p.y || 150 + (index * 20),
            color: p.team === 'blue' ? 'rgba(0, 100, 255, 0.9)' : 'rgba(255, 106, 0, 0.9)'
        }));

        // 2. Arena initialisieren
        const canvas = document.getElementById('arena-canvas');
        if (canvas && window.arena) {
            window.arena.init(canvas);
            // WICHTIG: Die Spieler-Referenz an die Arena übergeben
            window.arena.players = window.TONI.players; 
            window.arena.render();
        }

        // 3. UI-Module starten (Nur wenn vorhanden)
        if (typeof initTaktikboardUI === 'function') initTaktikboardUI();
        if (typeof initAktentascheUI === 'function') initAktentascheUI();
        if (typeof initVoiceInput === 'function') initVoiceInput();

        // 4. Session-Management
        const user = sessionStorage.getItem('sessionUser');
        if (user && typeof enterApp === 'function') {
            enterApp(user);
        }

        window.TONI.isInitialized = true;
        console.log("✅ System stabilisiert.");

    } catch (err) {
        console.error("❌ Kritischer Fehler in main.js:", err);
    }
});

// Hilfsfunktion für Navigation
window.switchView = (viewName) => {
    const board = document.getElementById('board-container');
    const pocket = document.getElementById('aktentasche-container');
    
    if (viewName === 'board') {
        board.style.display = 'block';
        pocket.style.display = 'none';
        if (window.arena) window.arena.resize();
    } else {
        board.style.display = 'none';
        pocket.style.display = 'block';
    }
};
