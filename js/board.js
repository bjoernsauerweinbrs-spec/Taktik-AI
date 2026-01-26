/**
 * Toni 2.0 - Board Engine
 * Steuert die Spielfeldgrafik, Tore, Bälle und Interaktionen.
 */

const pitch = document.getElementById('pitch');

/**
 * Hauptfunktion: Zeichnet das Board basierend auf dem Modus neu.
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Alle dynamischen Elemente entfernen
    const dynamicElements = pitch.querySelectorAll('.player-dot, .goal, .cone, .game-ball, .penalty-area');
    dynamicElements.forEach(el => el.remove());

    // 2. Spielfeld-Geometrie (16m-Raum & Modus-Setup)
    if (currentMode === 'funino') {
        setupFuninoField();
        addGameBall(); 
    } else if (currentMode === '11v11') {
        setupStandardField();
        addGameBall(); 
    } else {
        setupStandardField(); // Training startet sauber
    }

    // 3. Spieler (Team Rot) platzieren
    squad.filter(p => p.active && p.status === 'team').forEach(p => {
        const coords = formations["4-4-2_RED"][p.pos] || {x: 50, y: 50};
        createPlayerElement(p, coords, 'var(--red-team)');
    });

    // 4. Gegner (Team Blau) platzieren (nur 11v11)
    if (currentMode === '11v11') {
        opponents.forEach(o => {
            const coords = formations["3-4-3_BLUE"][o.pos];
            createPlayerElement(o, coords, 'var(--blue-team)', true);
        });
    }

    // 5. Ersatzbank
    squad.filter(p => p.active && p.status === 'bank').forEach((p, index) => {
        const bankCoords = { x: 96, y: 15 + (index * 7) };
        createPlayerElement(p, bankCoords, 'var(--red-team)');
    });
}

function setupStandardField() {
    pitch.style.width = '850px';
    pitch.style.height = '550px';
    drawPenaltyAreas();
    createGoal('left', 'standard-goal', 0, '50%');
    createGoal('right', 'standard-goal', 0, '50%');
}

function setupFuninoField() {
    pitch.style.width = '650px';
    pitch.style.height = '450px';
    createGoal('left', 'funino-goal', 0, '20%');
    createGoal('left', 'funino-goal', 0, '80%');
    createGoal('right', 'funino-goal', 0, '20%');
    createGoal('right', 'funino-goal', 0, '80%');
}

function drawPenaltyAreas() {
    const boxLeft = document.createElement('div');
    boxLeft.className = 'penalty-area';
    boxLeft.style = "position:absolute; left:0; top:20%; width:16%; height:60%; border:2px solid rgba(0,0,0,0.3); border-left:none; z-index:1;";
    pitch.appendChild(boxLeft);

    const boxRight = document.createElement('div');
    boxRight.className = 'penalty-area';
    boxRight.style = "position:absolute; right:0; top:20%; width:16%; height:60%; border:2px solid rgba(0,0,0,0.3); border-right:none; z-index:1;";
    pitch.appendChild(boxRight);
}

function addGameBall() {
    const ball = document.createElement('div');
    ball.className = 'game-ball';
    ball.innerHTML = '⚽';
    ball.style = "position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); cursor:move; font-size:22px; z-index:15;";
    ball.onmousedown = (e) => startDrag(e, ball);
    pitch.appendChild(ball);
}

function createPlayerElement(player, coords, color, isOpponent = false) {
    if (!coords) return;
    const dot = document.createElement('div');
    dot.className = 'player-dot';
    dot.style.left = coords.x + '%';
    dot.style.top = coords.y + '%';
    dot.style.backgroundColor = color;
    
    const ballHtml = (!isOpponent && player.hasBall) ? '<div style="position:absolute; bottom:-5px; right:-5px; font-size:12px;">⚽</div>' : '';
    dot.innerHTML = `<span>${player.nr}</span>${ballHtml}<span class="player-label">${isOpponent ? '' : player.name}</span>`;
    
    dot.onmousedown = (e) => startDrag(e, dot);
    pitch.appendChild(dot);
}

function createGoal(side, type, rotation = 0, topPos = '50%') {
    const goal = document.createElement('div');
    goal.className = `goal ${type}`;
    side === 'left' ? goal.style.left = '-6px' : goal.style.right = '-6px';
    goal.style.top = topPos;
    goal.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
    goal.onclick = () => {
        let r = parseInt(goal.getAttribute('data-rot') || 0) + 90;
        goal.style.transform = `translateY(-50%) rotate(${r % 360}deg)`;
        goal.setAttribute('data-rot', r % 360);
    };
    pitch.appendChild(goal);
}

function startDrag(e, el) {
    let sX = e.clientX - el.getBoundingClientRect().left;
    let sY = e.clientY - el.getBoundingClientRect().top;
    function move(ev) {
        let r = pitch.getBoundingClientRect();
        el.style.left = (ev.clientX - sX - r.left) / r.width * 100 + '%';
        el.style.top = (ev.clientY - sY - r.top) / r.height * 100 + '%';
    }
    document.addEventListener('mousemove', move);
    el.onmouseup = () => document.removeEventListener('mousemove', move);
}

function placeCones(count) {
    for (let i = 0; i < count; i++) {
        const c = document.createElement('div');
        c.className = 'cone';
        c.style = `position:absolute; left:${20+Math.random()*60}%; top:${20+Math.random()*60}%; cursor:move; font-size:20px; color:orange; z-index:5;`;
        c.innerHTML = '▲';
        c.onmousedown = (e) => startDrag(e, c);
        pitch.appendChild(c);
    }
}

function switchMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');
    drawBoard();
}
