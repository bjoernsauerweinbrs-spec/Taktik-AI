/**
 * Toni 2.0 - Board Engine
 * Steuert die visuelle Darstellung, Modi-Wechsel und Objekt-Platzierung.
 */

const pitch = document.getElementById('pitch');

/**
 * Hauptfunktion zum Zeichnen des Boards
 * Berücksichtigt den aktuellen Modus und die Spielerdaten.
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Spielfeld reinigen (außer statische Linien)
    const dynamicElements = pitch.querySelectorAll('.player-dot, .standard-goal, .funino-goal, .cone, .shooting-zone');
    dynamicElements.forEach(el => el.remove());

    // 2. Modus-spezifisches Setup
    if (currentMode === 'funino') {
        setupFuninoVisuals();
    } else {
        setupStandardVisuals();
    }

    // 3. Rote Spieler (Dein Team) platzieren
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        const coords = formations["4-4-2_RED"][p.pos] || {x: 50, y: 50};
        createPlayerDot(p, coords, 'var(--red-team)');
    });

    // 4. Blaue Spieler (Gegner) platzieren (nur im 11v11 Modus)
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            const coords = formations["3-4-3_BLUE"][o.pos];
            createPlayerDot(o, coords, 'var(--blue-team)', true);
        });
    }

    // 5. Bank-Spieler am Rand positionieren
    squad.filter(p => p.active && p.status === 'bank').forEach((p, index) => {
        const bankCoords = { x: 95, y: 15 + (index * 7) };
        createPlayerDot(p, bankCoords, 'var(--red-team)');
    });
}

/**
 * Erstellt einen Spieler-Punkt auf dem Feld
 */
function createPlayerDot(player, coords, color, isOpponent = false) {
    if (!coords) return;

    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + '%';
    dot.style.top = coords.y + '%';
    dot.style.backgroundColor = color;
    
    // HTML Inhalt: Nummer + (optional) Name
    let content = `<span>${player.nr}</span>`;
    if (!isOpponent && player.name) {
        content += `<span class="player-label">${player.name}</span>`;
    }
    dot.innerHTML = content;

    // Drag & Drop Vorbereitung
    dot.onmousedown = (e) => startDrag(e, dot, player.id);
    
    pitch.appendChild(dot);
}

/**
 * Setup für 11 gegen 11 und Training (Standard-Feld)
 */
function setupStandardVisuals() {
    pitch.style.width = '850px';
    pitch.style.height = '550px';
    
    // Zwei Standard-Großtore
    createGoal('left', 'standard-goal');
    createGoal('right', 'standard-goal');
}

/**
 * Setup für Funino (kleines Feld, 4 Tore, Schusszonen)
 */
function setupFuninoVisuals() {
    pitch.style.width = '650px';
    pitch.style.height = '450px';

    // 4 Mini-Tore (Funino-Style)
    createGoal('left', 'funino-goal', '15%');
    createGoal('left', 'funino-goal', '85%');
    createGoal('right', 'funino-goal', '15%');
    createGoal('right', 'funino-goal', '85%');

    // Schusszonen einzeichnen (6m Zonen)
    const zoneL = document.createElement('div');
    zoneL.className = 'shooting-zone';
    zoneL.style.display = 'block';
    pitch.appendChild(zoneL);

    const zoneR = document.createElement('div');
    zoneR.className = 'shooting-zone right';
    zoneR.style.display = 'block';
    pitch.appendChild(zoneR);
}

/**
 * Erstellt ein Tor-Objekt
 */
function createGoal(side, type, topPos = '50%') {
    const goal = document.createElement('div');
    goal.className = `goal ${type}`;
    if (side === 'left') {
        goal.style.left = '-6px';
    } else {
        goal.style.right = '-6px';
    }
    goal.style.top = topPos;
    goal.style.transform = 'translateY(-50%)';
    pitch.appendChild(goal);
}

/**
 * Einfache Drag-Logik für Spieler-Dots
 */
function startDrag(e, element, playerId) {
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        let newX = (pageX - shiftX - pitch.getBoundingClientRect().left) / pitch.offsetWidth * 100;
        let newY = (pageY - shiftY - pitch.getBoundingClientRect().top) / pitch.offsetHeight * 100;
        element.style.left = newX + '%';
        element.style.top = newY + '%';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

/**
 * Hilfsfunktion für Toni: Platziert Hütchen auf dem Board
 */
function placeCones(count) {
    for (let i = 0; i < count; i++) {
        const cone = document.createElement('div');
        cone.className = 'cone';
        cone.style.left = (20 + (i * 5)) + '%';
        cone.style.top = '10%';
        cone.innerHTML = '▲'; // Symbol für Hütchen
        cone.style.position = 'absolute';
        cone.style.color = 'orange';
        pitch.appendChild(cone);
    }
}

// Event-Listener für den Modus-Switch
function switchMode(mode) {
    currentMode = mode;
    drawBoard();
    if(typeof toniSpeak === "function") {
        const modeText = mode === 'funino' ? "Funino Modus" : (mode === '11v11' ? "11 gegen 11 Analyse" : "Trainingsmodus");
        toniSpeak(`Björn, ich habe auf ${modeText} umgestellt. Die Tore sind platziert.`);
    }
}

// Initiales Zeichnen
document.addEventListener('DOMContentLoaded', () => {
    drawBoard();
});
