/**
 * Toni 2.0 - Board Engine
 * Verantwortlich für das Zeichnen der Spieler, Tore, Bälle und die Drag-Logik.
 */

const pitch = document.getElementById('pitch');

/**
 * Kernfunktion: Zeichnet das komplette Spielfeld basierend auf dem Status
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Spielfeld leeren (außer Linien)
    const dynamicElements = pitch.querySelectorAll('.player-dot, .goal, .cone, .shooting-zone');
    dynamicElements.forEach(el => el.remove());

    // 2. Modus-Setup (Größe & Tore)
    if (currentMode === 'funino') {
        setupFuninoField();
    } else {
        setupStandardField();
    }

    // 3. Rote Spieler (Dein Team) platzieren
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        const coords = formations["4-4-2_RED"][p.pos] || {x: 50, y: 50};
        createPlayerElement(p, coords, 'var(--red-team)');
    });

    // 4. Blaue Spieler (Gegner) - nur im 11v11 Modus
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            const coords = formations["3-4-3_BLUE"][o.pos];
            createPlayerElement(o, coords, 'var(--blue-team)', true);
        });
    }

    // 5. Ersatzbank (Rechter Rand)
    squad.filter(p => p.active && p.status === 'bank').forEach((p, index) => {
        const bankCoords = { x: 96, y: 15 + (index * 7) };
        createPlayerElement(p, bankCoords, 'var(--red-team)');
    });
}

/**
 * Erstellt einen Spieler-Punkt (Dot)
 */
function createPlayerElement(player, coords, color, isOpponent = false) {
    if (!coords) return;

    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + '%';
    dot.style.top = coords.y + '%';
    dot.style.backgroundColor = color;
    
    // Ball-Icon anzeigen, wenn der Spieler einen Ball hat (für deine 16 Bälle)
    const ballHtml = (!isOpponent && player.hasBall) ? '<div class="player-ball">⚽</div>' : '';
    
    let content = `<span>${player.nr}</span>${ballHtml}`;
    if (!isOpponent && player.name) {
        content += `<span class="player-label">${player.name}</span>`;
    }
    dot.innerHTML = content;

    // Interaktives Verschieben aktivieren
    dot.onmousedown = (e) => startDrag(e, dot);
    
    pitch.appendChild(dot);
}

/**
 * Standard-Spielfeld (11v11 oder Training)
 */
function setupStandardField() {
    pitch.style.width = '850px';
    pitch.style.height = '550px';
    
    // Tore erstellen (Standardmäßig nach innen geöffnet)
    createGoal('left', 'standard-goal', 0); // 0 Grad
    createGoal('right', 'standard-goal', 0);
}

/**
 * Funino-Feld (4 Tore & Schusszonen)
 */
function setupFuninoField() {
    pitch.style.width = '650px';
    pitch.style.height = '450px';

    createGoal('left', 'funino-goal', 0, '20%');
    createGoal('left', 'funino-goal', 0, '80%');
    createGoal('right', 'funino-goal', 0, '20%');
    createGoal('right', 'funino-goal', 0, '80%');

    // Schusszonen einzeichnen
    ['left', 'right'].forEach(side => {
        const zone = document.createElement('div');
        zone.className = `shooting-zone ${side}`;
        zone.style.display = 'block';
        pitch.appendChild(zone);
    });
}

/**
 * Erstellt ein Tor mit Rotations-Möglichkeit
 */
function createGoal(side, type, rotation = 0, topPos = '50%') {
    const goal = document.createElement('div');
    goal.className = `goal ${type}`;
    if (side === 'left') {
        goal.style.left = '-6px';
    } else {
        goal.style.right = '-6px';
    }
    goal.style.top = topPos;
    goal.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    
    // Klick auf Tor ermöglicht Drehung (z.B. nach links öffnen)
    goal.onclick = () => {
        const currentRot = parseInt(goal.getAttribute('data-rot') || 0);
        const newRot = (currentRot + 90) % 360;
        goal.style.transform = `translateY(-50%) rotate(${newRot}deg)`;
        goal.setAttribute('data-rot', newRot);
    };

    pitch.appendChild(goal);
}

/**
 * Die kombinierte Drag-Logik (Maus-Steuerung)
 */
function startDrag(e, element) {
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
 * Hütchen-Logik
 */
function placeCones(count) {
    for (let i = 0; i < count; i++) {
        const cone = document.createElement('div');
        cone.className = 'cone';
        cone.style.left = (Math.random() * 70 + 15) + '%';
        cone.style.top = (Math.random() * 70 + 15) + '%';
        cone.innerHTML = '▲'; 
        cone.style.position = 'absolute';
        cone.style.color = 'orange';
        cone.style.fontSize = '24px';
        cone.style.cursor = 'move';
        cone.onmousedown = (e) => startDrag(e, cone);
        pitch.appendChild(cone);
    }
    toniSpeak(`Björn, ich habe ${count} Hütchen auf dem Feld verteilt.`);
}

/**
 * Modus-Wechsel
 */
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');
    drawBoard();
}

/**
 * Reset-Funktion
 */
function resetBoardPositions() {
    drawBoard();
    toniSpeak("Alle Positionen sind wieder auf die taktische Grundordnung zurückgesetzt.");
}
