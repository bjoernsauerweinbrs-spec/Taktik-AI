function drawBoard() {
    const pitch = document.getElementById('pitch');
    // Alle alten Spieler-Elemente entfernen
    document.querySelectorAll('.player-dot').forEach(el => el.remove());

    // 1. Rote Spieler zeichnen (Dein Team)
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        createDot(p, formations["4-4-2"][p.pos]);
    });

    // 2. Blaue Spieler zeichnen (Gegner 3-4-3) - Nur im Analyse-Modus
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            createDot(o, formations["3-4-3_BLUE"][o.pos], true);
        });
    }
}

function createDot(data, coords, isOpponent = false) {
    if (!coords) return;
    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + "%";
    dot.style.top = coords.y + "%";
    dot.style.background = isOpponent ? "var(--blue-team)" : "var(--red-team)";
    dot.innerHTML = data.nr + (isOpponent ? "" : `<span class="player-label">${data.name}</span>`);
    document.getElementById('pitch').appendChild(dot);
}
