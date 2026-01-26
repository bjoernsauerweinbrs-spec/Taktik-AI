/**
 * Toni 2.0 - Board Engine (Final Version)
 * Steuert das Spielfeld, Drag & Drop und die dynamischen Tore.
 */

const pitch = document.getElementById('pitch');

/**
 * Hauptzeichenfunktion: Synchronisiert Daten aus logic.js mit dem Spielfeld
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Feld aufräumen
    const dynamicElements = pitch.querySelectorAll('.player-dot, .goal, .cone, .shooting-zone');
    dynamicElements.forEach(el => el.remove());

    // 2. Spielfeld-Größe und Tore je nach Modus
    if (currentMode === 'funino') {
        setupFuninoVisuals();
    } else {
        setupStandardVisuals();
    }

    // 3. Dein Team (ROT) platzieren
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        const coords = formations["4-4-2_RED"][p.pos] || {x: 50, y: 50};
        createPlayerDot(p, coords, p.color || 'var(--red-team)');
    });

    // 4. Gegner (BLAU) platzieren (nur im Analyse-Modus 11v11)
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            const coords = formations["3-4-3_BLUE"][o.pos];
            createPlayerDot(o, coords, 'var(--blue-team)', true);
        });
    }

    // 5. Ersatzbank (RECHTS)
    squad.filter(p => p.active && p.status === 'bank').forEach((p, index) => {
        const bankCoords = { x: 96, y: 12 + (index * 7) };
        createPlayerDot(p, bankCoords, 'var(--red-team)');
    });
}

function createPlayerDot(player, coords, color, isOpponent = false) {
    if (!coords) return;
    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + '%';
    dot.style.top = coords.y + '%';
    dot.style.backgroundColor = color;
    
    let content = `<span>${player.nr}</span>`;
    if (!isOpponent && player.name) {
        content += `<span class="player-label">${player.name}</span>`;
    }
    dot.innerHTML = content;

    // Drag & Drop
    dot.onmousedown = (e) => startDrag(e, dot);
    pitch.appendChild(dot);
}

function setupStandardVisuals() {
    pitch.style.width = '850px';
    pitch.style.height = '550px';
    createGoal('left', 'standard-goal');
    createGoal('right', 'standard-goal');
}

function setupFuninoVisuals() {
    pitch.style.width = '650px';
    pitch.style.height = '450px';
    // 4 Tore für Funino
    createGoal('left', 'funino-goal', '20%');
    createGoal('left', 'funino-goal', '80%');
    createGoal('right', 'funino-goal', '20%');
    createGoal('right', 'funino-goal', '80%');

    // Schusszonen
    ['left', 'right'].forEach(side => {
        const zone = document.createElement('div');
        zone.className = `shooting-zone ${side}`;
        zone.style.display = 'block';
        pitch.appendChild(zone);
    });
}

function createGoal(side, type, topPos = '50%') {
    const goal = document.createElement('div');
    goal.className = `goal ${type}`;
    side === 'left' ? goal.style.left = '-6px' : goal.style.right = '-6px';
    goal.style.top = topPos;
    goal.style.transform = 'translateY(-50%)';
    pitch.appendChild(goal);
}

function startDrag(e, element) {
    let shiftX = e.clientX - element.getBoundingClientRect().left;
    let shiftY = e.clientY - element.getBoundingClientRect().top;
    function moveAt(pageX, pageY) {
        let newX = (pageX - shiftX - pitch.getBoundingClientRect().left) / pitch.offsetWidth * 100;
        let newY = (pageY - shiftY - pitch.getBoundingClientRect().top) / pitch.offsetHeight * 100;
        element.style.left = newX + '%';
        element.style.top = newY + '%';
    }
    function onMouseMove(event) { moveAt(event.pageX, event.pageY); }
    document.addEventListener('mousemove', onMouseMove);
    element.onmouseup = () => document.removeEventListener('mousemove', onMouseMove);
}

function switchMode(mode) {
    currentMode = mode;
    // UI Button Update
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');
    drawBoard();
    toniSpeak(`Modus gewechselt: Ich habe das Feld auf ${mode} angepasst.`);
}

function placeCones(count) {
    for (let i = 0; i < count; i++) {
        const cone = document.createElement('div');
        cone.className = 'cone';
        cone.style.left = (Math.random() * 60 + 20) + '%';
        cone.style.top = (Math.random() * 60 + 20) + '%';
        cone.innerHTML = '▲'; 
        cone.style.position = 'absolute';
        cone.style.color = 'orange';
        cone.style.fontSize = '20px';
        pitch.appendChild(cone);
    }
}
