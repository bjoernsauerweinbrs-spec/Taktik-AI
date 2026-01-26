const board = document.getElementById('board-container');
const bench = document.getElementById('bench');

// EXAKT 11 gegen 11
const initialPlayers = [
    // TEAM ROT (11)
    { id: 'R1', role: 'TW', x: 20, y: 235, team: 'red' },
    { id: 'R2', role: 'IV', x: 150, y: 150, team: 'red' }, { id: 'R3', role: 'IV', x: 150, y: 320, team: 'red' },
    { id: 'R4', role: 'LV', x: 180, y: 40, team: 'red' }, { id: 'R5', role: 'RV', x: 180, y: 430, team: 'red' },
    { id: 'R6', role: 'DM', x: 300, y: 235, team: 'red' },
    { id: 'R7', role: 'ZM', x: 420, y: 140, team: 'red' }, { id: 'R8', role: 'ZM', x: 420, y: 330, team: 'red' },
    { id: 'R9', role: 'LF', x: 550, y: 80, team: 'red' }, { id: 'R10', role: 'RF', x: 550, y: 390, team: 'red' },
    { id: 'R11', role: 'ST', x: 650, y: 235, team: 'red' },

    // TEAM BLAU (11)
    { id: 'B1', role: 'TW', x: 740, y: 235, team: 'blue' },
    { id: 'B2', role: 'V', x: 620, y: 150, team: 'blue' }, { id: 'B3', role: 'V', x: 620, y: 320, team: 'blue' },
    { id: 'B4', role: 'V', x: 600, y: 40, team: 'blue' }, { id: 'B5', role: 'V', x: 600, y: 430, team: 'blue' },
    { id: 'B6', role: 'M', x: 500, y: 235, team: 'blue' },
    { id: 'B7', role: 'M', x: 450, y: 100, team: 'blue' }, { id: 'B8', role: 'M', x: 450, y: 370, team: 'blue' },
    { id: 'B9', role: 'A', x: 300, y: 80, team: 'blue' }, { id: 'B10', role: 'A', x: 300, y: 390, team: 'blue' },
    { id: 'B11', role: 'A', x: 200, y: 235, team: 'blue' }
];

// AUSWECHSELBANK
const subPlayers = [
    { id: 'S1', role: 'Luiz', team: 'red' },
    { id: 'S2', role: 'Sub2', team: 'red' },
    { id: 'S3', role: 'Sub3', team: 'blue' }
];

function initBoard() {
    if (!board || !bench) return;
    const existing = board.querySelectorAll('.player');
    existing.forEach(p => p.remove());
    bench.innerHTML = '';

    initialPlayers.forEach(p => createPlayer(p, board, true));
    subPlayers.forEach(p => createPlayer(p, bench, false));
}

function createPlayer(p, container, isOnField) {
    const div = document.createElement('div');
    div.className = `player ${p.team}`;
    div.id = p.id;
    div.innerText = p.role;
    if (isOnField) {
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
    }
    makeDraggable(div);
    container.appendChild(div);
}

function makeDraggable(el) {
    let isDown = false;
    el.onmousedown = (e) => { isDown = true; el.style.zIndex = 1000; e.preventDefault(); };
    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - 16;
        let y = e.clientY - rect.top - 16;
        
        if (x > -20 && x < rect.width + 20 && y > -20 && y < rect.height + 20) {
            if (el.parentElement !== board) board.appendChild(el);
            el.style.position = 'absolute';
            el.style.left = Math.max(0, Math.min(x, rect.width - 32)) + 'px';
            el.style.top = Math.max(0, Math.min(y, rect.height - 32)) + 'px';
        }
    };
    document.onmouseup = () => { isDown = false; el.style.zIndex = 100; };
}

function resetBoard() { initBoard(); }
window.onload = initBoard;
