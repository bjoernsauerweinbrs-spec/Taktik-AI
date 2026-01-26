/* --- BOARD.JS: VOLLSTÄNDIGER KADER --- */
const board = document.getElementById('board-container');
const ball = document.getElementById('ball');
const benchRed = document.getElementById('bench-red');
const benchBlue = document.getElementById('bench-blue');

// DIE KOMPLETTE STARTELF (22 SPIELER)
let squad = [
    // TEAM ROT (Björn) - 11 Spieler
    { id: 'R1', name: 'NEUER', nr: '1', x: 30, y: 235, team: 'red' },
    { id: 'R2', name: 'LUIZ', nr: '4', x: 150, y: 150, team: 'red' },
    { id: 'R3', name: 'BOAT', nr: '17', x: 150, y: 320, team: 'red' },
    { id: 'R4', name: 'DAVIES', nr: '19', x: 180, y: 40, team: 'red' },
    { id: 'R5', name: 'KIMM', nr: '6', x: 180, y: 430, team: 'red' },
    { id: 'R6', name: 'GORE', nr: '8', x: 300, y: 235, team: 'red' },
    { id: 'R7', name: 'MÜLLER', nr: '25', x: 420, y: 140, team: 'red' },
    { id: 'R8', name: 'MUSI', nr: '42', x: 420, y: 330, team: 'red' },
    { id: 'R9', name: 'SANE', nr: '10', x: 580, y: 80, team: 'red' },
    { id: 'R10', name: 'GNA', nr: '7', x: 580, y: 390, team: 'red' },
    { id: 'R11', name: 'KANE', nr: '9', x: 680, y: 235, team: 'red' },

    // TEAM BLAU (Gegner) - 11 Spieler
    { id: 'B1', name: 'KAHN', nr: '1', x: 740, y: 235, team: 'blue' },
    { id: 'B2', name: 'LAHM', nr: '21', x: 620, y: 150, team: 'blue' },
    { id: 'B3', name: 'HUMS', nr: '5', x: 620, y: 320, team: 'blue' },
    { id: 'B4', name: 'MERT', nr: '4', x: 600, y: 40, team: 'blue' },
    { id: 'B5', name: 'BREH', nr: '3', x: 600, y: 430, team: 'blue' },
    { id: 'B6', name: 'SCHW', nr: '31', x: 480, y: 235, team: 'blue' },
    { id: 'B7', name: 'KROO', nr: '8', x: 400, y: 100, team: 'blue' },
    { id: 'B8', name: 'BALL', nr: '13', x: 400, y: 370, team: 'blue' },
    { id: 'B9', name: 'CLO', nr: '11', x: 280, y: 80, team: 'blue' },
    { id: 'B10', name: 'PODO', nr: '20', x: 280, y: 390, team: 'blue' },
    { id: 'B11', name: 'GÖTZ', nr: '19', x: 180, y: 235, team: 'blue' }
];

// DIE AUSWECHSELBANK (3 ROT / 3 BLAU)
let subSquad = [
    { id: 'S1', name: 'DAVID', nr: '7', team: 'red' },
    { id: 'S2', name: 'MARIO', nr: '33', team: 'red' },
    { id: 'S3', name: 'LEROY', nr: '11', team: 'red' },
    { id: 'S4', name: 'PELE', nr: '10', team: 'blue' },
    { id: 'S5', name: 'MARA', nr: '10', team: 'blue' },
    { id: 'S6', name: 'ZIDAN', nr: '5', team: 'blue' }
];

function initBoard() {
    if (!board || !benchRed || !benchBlue) return;
    const existing = board.querySelectorAll('.player-wrapper');
    existing.forEach(p => p.remove());
    benchRed.innerHTML = ''; benchBlue.innerHTML = '';

    squad.forEach(p => createPlayer(p, board, true));
    subSquad.forEach(p => {
        const container = p.team === 'red' ? benchRed : benchBlue;
        createPlayer(p, container, false);
    });

    // Ball zentrieren
    ball.style.left = "415px"; ball.style.top = "265px";
    makeDraggable(ball, true);
}

function createPlayer(p, container, isOnField) {
    const div = document.createElement('div');
    div.className = `player-wrapper ${p.team}`;
    div.id = p.id;
    div.innerHTML = `<div class="player-circle">${p.name}</div><div class="player-label">${p.nr}</div>`;
    if (isOnField) {
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
    }
    makeDraggable(div);
    container.appendChild(div);
}

function makeDraggable(el, isBall = false) {
    let isDown = false;
    el.onmousedown = (e) => { isDown = true; el.style.zIndex = 1000; e.preventDefault(); };
    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - (isBall ? 9 : 30);
        let y = e.clientY - rect.top - (isBall ? 9 : 25);
        if (x > -30 && x < rect.width + 30) {
            if (el.parentElement !== board) board.appendChild(el);
            el.style.position = 'absolute';
            el.style.left = x + 'px'; el.style.top = y + 'px';
        }
    };
    document.onmouseup = () => { 
        if(isDown) {
            isDown = false; el.style.zIndex = isBall ? 200 : 100;
            if(typeof analyzeSituation === 'function') analyzeSituation();
        }
    };
}

function resetBoard() { initBoard(); if(typeof clearArrows === 'function') clearArrows(); }
window.onload = initBoard;
