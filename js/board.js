const board = document.getElementById('board-container');
const benchRed = document.getElementById('bench-red');
const benchBlue = document.getElementById('bench-blue');

let squad = [
    // TEAM ROT (Björn)
    { id: 'R1', name: 'LUIZ', sub: '4', x: 20, y: 235, team: 'red', onField: true },
    { id: 'R2', name: 'MÜLLER', sub: '13', x: 150, y: 150, team: 'red', onField: true },
    { id: 'R3', name: 'BOAT', sub: '17', x: 150, y: 320, team: 'red', onField: true },
    // TEAM BLAU (Gegner - Toni)
    { id: 'B1', name: 'KAHN', sub: 'TW', x: 780, y: 235, team: 'blue', onField: true },
    { id: 'B2', name: 'LAHM', sub: 'RV', x: 650, y: 100, team: 'blue', onField: true },
    { id: 'B3', name: 'HUMS', sub: 'IV', x: 650, y: 370, team: 'blue', onField: true }
];

// Bank-Spieler
let subSquad = [
    { id: 'S1', name: 'DAVID', sub: '7', team: 'red' },
    { id: 'S2', name: 'MARIO', sub: '9', team: 'red' },
    { id: 'S3', name: 'PELE', sub: 'ST', team: 'blue' }
];

function initBoard() {
    const playersOnField = board.querySelectorAll('.player-wrapper');
    playersOnField.forEach(p => p.remove());
    benchRed.innerHTML = ''; benchBlue.innerHTML = '';

    squad.forEach(p => createPlayer(p, board));
    subSquad.forEach(p => {
        const container = p.team === 'red' ? benchRed : benchBlue;
        createPlayer(p, container, false);
    });
}

function createPlayer(p, container, isOnField = true) {
    const wrapper = document.createElement('div');
    wrapper.className = `player-wrapper ${p.team}`;
    wrapper.id = p.id;

    wrapper.innerHTML = `
        <div class="player-circle">${p.name}</div>
        <div class="player-label">${p.sub}</div>
    `;

    if (isOnField) {
        wrapper.style.left = p.x + 'px';
        wrapper.style.top = p.y + 'px';
    }
    
    makeDraggable(wrapper);
    container.appendChild(wrapper);
}

function makeDraggable(el) {
    let isDown = false;
    el.onmousedown = (e) => { isDown = true; el.style.zIndex = 1000; e.preventDefault(); };
    
    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - 25;
        let y = e.clientY - rect.top - 25;
        
        if (x > -30 && x < rect.width + 30) {
            if (el.parentElement !== board) board.appendChild(el);
            el.style.position = 'absolute';
            el.style.left = x + 'px'; el.style.top = y + 'px';
        }
    };
    
    document.onmouseup = () => { 
        if(isDown) {
            isDown = false; 
            el.style.zIndex = 100;
            // TRIGGER: Toni reagiert auf den Zug
            if(typeof toniReacts === 'function') toniReacts(el.id);
        }
    };
}

function resetBoard() { initBoard(); }
window.onload = initBoard;
