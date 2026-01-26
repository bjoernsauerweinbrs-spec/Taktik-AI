/* --- BOARD.JS: KADER & STEUERUNG --- */
const board = document.getElementById('board-container');
const ball = document.getElementById('ball');
const benchRed = document.getElementById('bench-red');
const benchBlue = document.getElementById('bench-blue');

// DIE KOMPLETTE STARTELF (22 SPIELER)
let squad = [
    // TEAM ROT (Trainer) - Name & Nummer
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

    // TEAM BLAU (Gegner) - Name & Position
    { id: 'B1', name: 'KAHN', label: 'TW', x: 780, y: 235, team: 'blue' },
    { id: 'B2', name: 'LAHM', label: 'RV', x: 650, y: 80, team: 'blue' },
    { id: 'B3', name: 'HUMS', label: 'IV', x: 650, y: 390, team: 'blue' },
    { id: 'B4', name: 'MERT', label: 'IV', x: 680, y: 235, team: 'blue' },
    { id: 'B5', name: 'BREH', label: 'LV', x: 600, y: 430, team: 'blue' },
    { id: 'B6', name: 'SCHW', label: 'ZM', x: 500, y: 235, team: 'blue' },
    { id: 'B7', name: 'KROO', label: 'ZM', x: 450, y: 100, team: 'blue' },
    { id: 'B8', name: 'BALL', label: 'ZM', x: 450, y: 370, team: 'blue' },
    { id: 'B9', name: 'CLO', label: 'ST', x: 300, y: 120, team: 'blue' },
    { id: 'B10', name: 'PODO', label: 'ST', x: 300, y: 350, team: 'blue' },
    { id: 'B11', name: 'GÖTZ', label: 'OM', x: 380, y: 235, team: 'blue' }
];

// DIE AUSWECHSELBANK
let subSquad = [
    { id: 'S1', name: 'DAVID', label: '7', team: 'red' },
    { id: 'S2', name: 'MARIO', label: '33', team: 'red' },
    { id: 'S3', name: 'LEROY', label: '11', team: 'red' },
    { id: 'S4', name: 'PELE', label: '10', team: 'blue' },
    { id: 'S5', name: 'MARA', label: '10', team: 'blue' },
    { id: 'S6', name: 'ZIDAN', label: '5', team: 'blue' }
];

function initBoard() {
    if (!board) return;
    const existing = board.querySelectorAll('.player-wrapper');
    existing.forEach(p => p.remove());
    benchRed.innerHTML = ''; benchBlue.innerHTML = '';

    squad.forEach(p => createPlayer(p, board, true));
    subSquad.forEach(p => {
        const container = p.team === 'red' ? benchRed : benchBlue;
        createPlayer(p, container, false);
    });

    ball.style.left = "415px"; ball.style.top = "265px";
    makeDraggable(ball, true);
}

function createPlayer(p, container, isOnField) {
    const div = document.createElement('div');
    div.className = `player-wrapper ${p.team}`;
    div.id = p.id;
    // Name im Kreis, Label (Nummer oder Position) darunter
    div.innerHTML = `<div class="player-circle">${p.name}</div><div class="player-label">${p.label}</div>`;
    
    if (isOnField) {
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
    }
    
    // Nur Team Rot und der Ball sind steuerbar
    if (p.team === 'red' || p.id === 'ball') {
        makeDraggable(div, p.id === 'ball');
    }
    
    container.appendChild(div);
}

function makeDraggable(el, isBall = false) {
    let isDown = false;
    el.onmousedown = (e) => { 
        isDown = true; 
        el.style.zIndex = 1000; 
        e.preventDefault(); 
    };

    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - (isBall ? 10 : 30);
        let y = e.clientY - rect.top - (isBall ? 10 : 25);
        
        if (x > -30 && x < rect.width + 30) {
            if (el.parentElement !== board) board.appendChild(el);
            el.style.position = 'absolute';
            el.style.left = Math.max(0, Math.min(x, rect.width - (isBall ? 20 : 60))) + 'px';
            el.style.top = Math.max(0, Math.min(y, rect.height - (isBall ? 20 : 50))) + 'px';
        }
    };

    document.onmouseup = () => { 
        if(isDown) {
            isDown = false; 
            el.style.zIndex = isBall ? 200 : 100;
            // Analyse auslösen, wenn der Ball oder ein Spieler bewegt wurde
            if(typeof analyzeSituation === 'function') analyzeSituation();
        }
    };
}

function resetBoard() { initBoard(); if(typeof clearArrows === 'function') clearArrows(); }
window.onload = initBoard;
