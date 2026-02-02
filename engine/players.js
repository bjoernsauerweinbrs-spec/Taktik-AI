// =========================================
// Toni 2.0 – Players Engine (Vollständig)
// =========================================

window.PlayerEngine = {
    // Sucht einen Spieler an einer bestimmten Koordinate (für Drag & Drop)
    findPlayerAt(x, y) {
        if (!window.arena || !window.arena.players) return null;
        
        // Wir prüfen von hinten nach vorne (oberster Spieler zuerst)
        for (let i = window.arena.players.length - 1; i >= 0; i--) {
            const p = window.arena.players[i];
            const dx = x - p.x;
            const dy = y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 25) { // 25px Toleranz-Radius
                return p;
            }
        }
        return null;
    },

    // Aktualisiert die Position eines Spielers und löst Neuzeichnen aus
    movePlayer(player, x, y) {
        if (!player) return;
        player.x = x;
        player.y = y;
        if (window.arena && typeof window.arena.render === "function") {
            window.arena.render();
        }
    }
};

// Falls du eine globale Hilfsfunktion brauchst:
window.movePlayer = (p, x, y) => window.PlayerEngine.movePlayer(p, x, y);
