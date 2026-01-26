/* --- BOARD LOGIK 11 VS 11 --- */
const board = document.getElementById('board-container');
const bench = document.getElementById('bench');

const initialPlayers = [
    // ROT (11 Spieler)
    { id: 'R1', role: 'TW', x: 20, y: 235, team: 'red' },
    { id: 'R2', role: 'IV', x: 140, y: 150, team: 'red' }, { id: 'R3', role: 'IV', x: 140, y: 320, team: 'red' },
    { id: 'R4', role: 'LV', x: 160, y: 40, team: 'red' }, { id: 'R5', role: 'RV', x: 160, y: 430, team: 'red' },
    { id: 'R6', role: 'DM', x: 280, y: 235, team: 'red' },
    { id: 'R7', role: 'ZM', x: 400, y: 140, team: 'red' }, { id: 'R8', role: 'ZM', x: 400, y: 330, team: 'red' },
    { id: 'R9', role: 'LF', x: 550, y: 80, team: 'red' }, { id: 'R10', role: 'RF', x: 550, y: 390, team: 'red' },
    { id: 'R11', role: 'ST', x: 650, y: 235, team: 'red' },

    // BLAU (11 Spieler)
    { id: 'B1', role: 'TW', x: 750, y: 235, team: 'blue' },
    { id: 'B2', role: 'V', x: 620, y: 150, team: 'blue' }, { id: 'B3', role: 'V', x: 620, y: 320, team: 'blue' },
    { id: 'B4', role: 'V', x: 640, y: 40, team: 'blue' }, { id: 'B5', role: 'V', x: 640, y: 430, team: 'blue' },
    { id: 'B6', role: 'M', x: 500, y: 235, team: 'blue' },
    { id: 'B7', role: 'M', x: 450, y: 100, team: 'blue' }, { id: 'B8', role: 'M', x: 450, y: 370, team: 'blue' },
    { id: 'B9', role: 'A', x: 300, y: 80, team: 'blue' }, { id: 'B10', role: 'A', x: 300, y: 390, team: 'blue' },
    { id: 'B11', role: 'A', x: 200, y: 235, team: 'blue' }
];

const subPlayers = [
    { id: 'S1', role: 'Luiz', team: 'red' }, // David Luiz auf der Bank
    { id: 'S2', role: 'SUB', team: 'red' },
    { id: 'S3', role: 'SUB', team: 'blue' }
];

function initBoard() {
    if (!board || !bench) return;
    board.innerHTML = `
        <div class="box-16-left"></div><div class="box-5-left"></div><div class="goal-left"></div>
        <div class="box-16-right"></div><div class="box-5-right"></div><div class="goal-right"></div>
    `;
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
        div.style.position = 'absolute';
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
    } else {
        div.style.position = 'relative';
    }
    makeDraggable(div);
    container.appendChild(div);
}

function makeDraggable(el) {
    let isDown = false;
    el.onmousedown = () => { isDown = true; el.style.zIndex = 1000; };
    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - 15;
        let y = e.clientY - rect.top - 15;
        // Check ob auf Feld oder Bank
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            el.style.position = 'absolute';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            if (el.parentElement !== board) board.appendChild(el);
        }
    };
    document.onmouseup = () => { isDown = false; el.style.zIndex = 10; };
}

function resetBoard() { initBoard(); }

window.onload = initBoard;
