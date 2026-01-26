/**
 * Toni 2.0 - Board Engine
 * Zeichnet das Feld, platziert Spieler und steuert die Modi.
 */

const pitch = document.getElementById('pitch');
let currentMode = '11v11';

/**
 * Zeichnet das Spielfeld und alle aktiven Spieler
 */
function drawBoard() {
    if (!pitch) return;

    // 1. Feld leeren (außer Linien)
    const players = pitch.querySelectorAll('.player, .ball, .cone');
    players.forEach(p => p.remove());

    // 2. Spieler platzieren (Nur wenn Status 'present' ist)
    squad.forEach(p => {
        if (p.status === 'present') {
            createPlayerDot(p);
        }
    });

    // 3. Ball initial platzieren
    createObject('ball', '⚽', '50%', '50%');
}

/**
 * Erstellt einen Spieler-Punkt auf dem Feld
 */
function createPlayerDot(p) {
    const dot = document.createElement('div');
    dot.className = 'player red';
    dot.id = `pitch-player-${p.id}`;
    dot.style.left = p.x || '50%';
    dot.style.top = p.y || '50%';
    
    dot.innerHTML = `
        ${p.nr}
        <div class="player-label">#${p.nr} ${p.name}</div>
    `;

    makeDraggable(dot, p.id);
    pitch.appendChild(dot);
}

/**
 * Universelle Drag & Drop Funktion
 */
function makeDraggable(el, id) {
    let isDragging = false;

    el.onmousedown = (e) => {
        isDragging = true;
        el.style.zIndex = 1000;
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        
        const rect = pitch.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;

        // Begrenzung aufs Spielfeld
        x = Math.max(2, Math.min(98, x));
        y = Math.max(2, Math.min(98, y));

        el.style.left = x + '%';
        el.style.top = y + '%';

        // Position im Kader-Objekt speichern
        const player = squad.find(p => p.id === id);
        if (player) {
            player.x = x + '%';
            player.y = y + '%';
        }
    };

    document.onmouseup = () => {
        isDragging = false;
        el.style.zIndex = 100;
        saveSquadData(); // Automatische Sicherung in der Aktentasche
    };
}

/**
 * Schaltet zwischen den Modi um (11v11, Training, Funino)
 */
function switchMode(mode) {
    currentMode = mode;
    
    // UI Updates
    document.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${mode}`).classList.add('active');

    const funinoGoals = document.querySelectorAll('.funino-goal');
    const stdGoals = document.querySelectorAll('.goal');

    if (mode === 'funino') {
        pitch.style.width = '700px';
        pitch.style.height = '450px';
        funinoGoals.forEach(g => g.style.display = 'block');
        stdGoals.forEach(g => g.style.display = 'none');
        if(typeof toniSpeak === 'function') toniSpeak("Funino-Modus. Vier Tore, volle Action, Björn!");
    } else if (mode === 'training') {
        pitch.style.width = '850px';
        pitch.style.height = '500px';
        funinoGoals.forEach(g => g.style.display = 'none');
        stdGoals.forEach(g => g.style.display = 'none');
    } else {
        pitch.style.width = '900px';
        pitch.style.height = '550px';
        funinoGoals.forEach(g => g.style.display = 'none');
        stdGoals.forEach(g => g.style.display = 'block');
    }
    
    drawBoard();
}

/**
 * Hilfsfunktion für Ball und Hütchen
 */
function createObject(type, icon, x, y) {
    const obj = document.createElement('div');
    obj.className = type;
    obj.style.position = 'absolute';
    obj.style.left = x;
    obj.style.top = y;
    obj.style.fontSize = '20px';
    obj.style.cursor = 'move';
    obj.style.zIndex = '10';
    obj.innerHTML = icon;
    
    // Ball auch ziehbar machen
    let isDragging = false;
    obj.onmousedown = () => isDragging = true;
    document.onmousemove = (e) => {
        if(!isDragging) return;
        const rect = pitch.getBoundingClientRect();
        obj.style.left = ((e.clientX - rect.left) / rect.width) * 100 + '%';
        obj.style.top = ((e.clientY - rect.top) / rect.height) * 100 + '%';
    };
    document.onmouseup = () => isDragging = false;
    
    pitch.appendChild(obj);
}

// Initialer Start
document.addEventListener('DOMContentLoaded', drawBoard);
