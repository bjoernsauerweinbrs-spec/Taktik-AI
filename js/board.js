/* --- BOARD.JS: ABSOLUTE BEWEGUNGSFREIHEIT --- */
const board = document.getElementById('board-container');
const ball = document.getElementById('ball');
const benchRed = document.getElementById('bench-red');
const benchBlue = document.getElementById('bench-blue');

// KADER: 11 Rot, 11 Blau
let squad = [
    { id: 'R1', name: 'NEUER', label: '1', x: 30, y: 235, team: 'red' },
    { id: 'R2', name: 'LUIZ', label: '4', x: 150, y: 150, team: 'red' },
    { id: 'R3', name: 'BOAT', label: '17', x: 150, y: 320, team: 'red' },
    { id: 'R4', name: 'DAVIES', label: '19', x: 180, y: 40, team: 'red' },
    { id: 'R5', name: 'KIMM', label: '6', x: 180, y: 430, team: 'red' },
    { id: 'R6', name: 'GORE', label: '8', x: 300, y: 235, team: 'red' },
    { id: 'R7', name: 'MÜLLER', label: '25', x: 420, y: 140, team: 'red' },
    { id: 'R8', name: 'MUSI', label: '42', x: 420, y: 330, team: 'red' },
    { id: 'R9', name: 'SANE', label: '10', x: 580, y: 80, team: 'red' },
    { id: 'R10', name: 'GNA', label: '7', x: 580, y: 390, team: 'red' },
    { id: 'R11', name: 'KANE', label: '9', x: 680, y: 235, team: 'red' },

    { id: 'B1', name: 'KAHN', label: 'TW', x: 740, y: 235, team: 'blue' },
    { id: 'B2', name: 'LAHM', label: 'RV', x: 620, y: 150, team: 'blue' },
    { id: 'B3', name: 'HUMS', label: 'IV', x: 620, y: 320, team: 'blue' },
    { id: 'B4', name: 'MERT', label: 'IV', x: 680, y: 235, team: 'blue' },
    { id: 'B5', name: 'BREH', label: 'LV', x: 600, y: 430, team: 'blue' },
    { id: 'B6', name: 'SCHW', label: 'ZM', x: 500, y: 235, team: 'blue' },
    { id: 'B7', name: 'KROO', label: 'ZM', x: 400, y: 100, team: 'blue' },
    { id: 'B8', name: 'BALL', label: 'ZM', x: 400, y: 370, team: 'blue' },
    { id: 'B9', name: 'CLO', label: 'ST', x: 280, y: 80, team: 'blue' },
    { id: 'B10', name: 'PODO', label: 'ST', x: 280, y: 390, team: 'blue' },
    { id: 'B11', name: 'GÖTZ', label: 'OM', x: 380, y: 235, team: 'blue' }
];

function initBoard() {
    if (!board) return;
    board.querySelectorAll('.player-wrapper').forEach(p => p.remove());
    benchRed.innerHTML = ''; benchBlue.innerHTML = '';

    squad.forEach(p => {
        const div = document.createElement('div');
        div.className = `player-wrapper ${p.team}`;
        div.id = p.id;
        div.innerHTML = `<div class="player-circle">${p.name}</div><div class="player-label">${p.label}</div>`;
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
        makeDraggable(div);
        board.appendChild(div);
    });

    ball.style.left = "415px"; ball.style.top = "265px";
    makeDraggable(ball, true);
}

function makeDraggable(el, isBall = false) {
    let isDown = false;
    let offset = [0,0];

    el.onmousedown = (e) => {
        isDown = true;
        el.style.zIndex = 1000;
        const rect = board.getBoundingClientRect();
        offset = [ el.offsetLeft - (e.clientX - rect.left), el.offsetTop - (e.clientY - rect.top) ];
        e.preventDefault();
    };

    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left + offset[0];
        let y = e.clientY - rect.top + offset[1];
        el.style.left = x + 'px';
        el.style.top = y + 'px';
    };

    document.onmouseup = () => {
        if (isDown) {
            isDown = false;
            el.style.zIndex = isBall ? 200 : 100;
            // WICHTIG: Hier wird Toni wach!
            if (typeof analyzeSituation === 'function') {
                analyzeSituation();
            }
        }
    };
}

window.onload = initBoard;
function resetBoard() { initBoard(); if(typeof clearArrows==='function') clearArrows(); }
