/**
 * Toni 2.0 - Board Engine
 * Zeichnet das Spielfeld, die Spieler-Icons und die rotierbaren Tore.
 */

const pitch = document.getElementById('pitch');

/**
 * Kernfunktion: Löscht das Feld und zeichnet alles basierend auf dem aktuellen Stand neu.
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Alte Elemente entfernen (Spieler, Tore, Hütchen)
    const dynamicElements = pitch.querySelectorAll('.player-dot, .goal, .cone, .shooting-zone');
    dynamicElements.forEach(el => el.remove());

    // 2. Tore und Feld-Setup
    if (currentMode === 'funino') {
        setupFuninoField();
    } else {
        setupStandardField();
    }

    // 3. Deine Spieler (Team Rot) platzieren
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        const coords = formations["4-4-2_RED"][p.pos] || {x: 50, y: 50};
        createPlayerElement(p, coords, 'var(--red-team)');
    });

    // 4. Gegner (Team Blau) platzieren (nur im 11v11 Modus)
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            const coords = formations["3-4-3_BLUE"][o.pos];
            createPlayerElement(o, coords, 'var(--blue-team)', true);
        });
    }

    // 5. Ersatzbank (Rechter Rand des Boards)
    squad.filter(p => p.active && p.status === 'bank').forEach((p, index) => {
        const bankCoords = { x: 96, y: 15 + (index * 7) };
        createPlayerElement(p, bankCoords, 'var(--red-team)');
    });
}

/**
 * Erstellt einen Spieler-Punkt mit Ball-Option
 */
function createPlayerElement(player, coords, color, isOpponent = false) {
    if (!coords) return;

    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + '%';
    dot.style.top = coords.y + '%';
    dot.style.backgroundColor = color;
    
    // Ball-Logik: Wenn der Spieler einen Ball hat, ⚽ Icon anzeigen
    const ballHtml = (!isOpponent && player.hasBall) ? '<div class="player-ball" style="position:absolute; bottom:-5px; right:-5px; font-size:12px;">⚽</div>' : '';
    
    let content = `<span>${player.nr}</span>${ballHtml}`;
    if (!isOpponent && player.name) {
        content += `<span class="player-label" style="position:absolute; top:32px; font-size:10px; font-weight:bold; white-space:nowrap; color:#333;">${player.name}</span>`;
    }
    dot.innerHTML = content;

    // Interaktives Verschieben (Drag & Drop)
    dot.onmousedown = (e) => startDrag(e, dot);
    
    pitch.appendChild(dot);
}

/**
 * Standard-Spielfeld Tore
 */
function setupStandardField() {
    createGoal('left', 'standard-goal', 0, '50%');
    createGoal('right', 'standard-goal', 0, '50%');
}

/**
 * Funino-Feld Setup (4 Tore)
 */
function setupFuninoField() {
    createGoal('left', 'funino-goal', 0, '20%');
    createGoal('left', 'funino-goal', 0, '80%');
    createGoal('right', 'funino-goal', 0, '20%');
    createGoal('right', 'funino-goal', 0, '80%');
}

/**
 * Erstellt ein Tor, das bei Klick rotiert
 */
function createGoal(side, type, rotation = 0, topPos = '50%') {
    const goal = document.createElement('div');
    goal.className = `goal ${type}`;
    if (side === 'left') goal.style.left = '-6px';
    else goal.style.right = '-6px';
    
    goal.style.top = topPos;
    goal.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    goal.style.cursor = 'pointer';
    
    // Dreh-Logik bei Klick
    goal.onclick = () => {
        let currentRot = parseInt(goal.getAttribute('data-rot') || 0);
        currentRot = (currentRot + 90) % 360;
        goal.style.transform = `translateY(-50%) rotate(${currentRot}deg)`;
        goal.setAttribute('data-rot', currentRot);
    };

    pitch.appendChild(goal);
}

/**
 * Drag & Drop Engine
 */
function startDrag(e, element) {
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        let rect = pitch.getBoundingClientRect();
        let newX = (pageX - shiftX - rect.left) / rect.width * 100;
        let newY = (pageY - shiftY - rect.top) / rect.height * 100;
        element.style.left = newX + '%';
        element.style.top = newY + '%';
    }

    function onMouseMove(event) { moveAt(event.pageX, event.pageY); }
    document.addEventListener('mousemove', onMouseMove);

    element.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

/**
 * Hütchen platzieren
 */
function placeCones(count) {
    for (let i = 0; i < count; i++) {
        const cone = document.createElement('div');
        cone.className = 'cone';
        cone.style.left = (20 + Math.random() * 60) + '%';
        cone.style.top = (20 + Math.random() * 60) + '%';
        cone.style.position = 'absolute';
        cone.style.cursor = 'move';
        cone.style.fontSize = '20px';
        cone.innerHTML = '▲'; 
        cone.style.color = 'orange';
        cone.onmousedown = (e) => startDrag(e, cone);
        pitch.appendChild(cone);
    }
}

/**
 * Modus-Wechsel (11v11 / Funino)
 */
function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) activeBtn.classList.add('active');
    drawBoard();
}
