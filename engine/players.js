// =========================================
// Toni 2.0 – Player Engine
// Spieler laden, verwalten, bewegen
// =========================================

/**
 * Spielerstruktur:
 * {
 *   id: string,
 *   name: string,
 *   number: number,
 *   position: string,
 *   x: number,
 *   y: number,
 *   color: string
 * }
 */

// Globale Spieler-Liste
arena.players = [];

// -----------------------------------------
// Spieler aus JSON laden
// -----------------------------------------
async function loadPlayersFromJSON(url = "js/data/players.sample.json") {
    try {
        const response = await fetch(url);
        const data = await response.json();

        arena.players = data.map(p => ({
            id: p.id,
            name: p.name,
            number: p.number,
            position: p.position,
            x: p.x || randomX(),
            y: p.y || randomY(),
            color: p.color || "rgba(255,106,0,0.8)"
        }));

        console.log("Spieler geladen:", arena.players);
        renderArena();
    } catch (err) {
        console.error("Fehler beim Laden der Spieler:", err);
    }
}

// -----------------------------------------
// Spieler hinzufügen
// -----------------------------------------
function addPlayer(player) {
    arena.players.push({
        id: player.id || crypto.randomUUID(),
        name: player.name || "Unbekannt",
        number: player.number || "?",
        position: player.position || "MF",
        x: player.x || randomX(),
        y: player.y || randomY(),
        color: player.color || "rgba(255,106,0,0.8)"
    });

    renderArena();
}

// -----------------------------------------
// Spieler bewegen
// -----------------------------------------
function movePlayer(id, newX, newY) {
    const player = arena.players.find(p => p.id === id);
    if (!player) return;

    player.x = newX;
    player.y = newY;

    renderArena();
}

// -----------------------------------------
// Spieler anhand der Canvas-Koordinaten finden
// -----------------------------------------
function getPlayerAtPosition(x, y) {
    return arena.players.find(p => {
        const dx = p.x - x;
        const dy = p.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 25; // Radius 22px + Toleranz
    });
}

// -----------------------------------------
// Spieler entfernen
// -----------------------------------------
function removePlayer(id) {
    arena.players = arena.players.filter(p => p.id !== id);
    renderArena();
}

// -----------------------------------------
// Hilfsfunktionen für zufällige Startpositionen
// -----------------------------------------
function randomX() {
    return 100 + Math.random() * (arena.width - 200);
}

function randomY() {
    return 100 + Math.random() * (arena.height - 200);
}