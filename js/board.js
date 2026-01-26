const board = document.getElementById('board-container');
const ball = document.getElementById('ball');
const benchRed = document.getElementById('bench-red');
const benchBlue = document.getElementById('bench-blue');

let squad = [
    { id: 'R1', name: 'LUIZ', nr: '4', x: 100, y: 235, team: 'red' },
    { id: 'B1', name: 'KAHN', nr: '1', x: 730, y: 235, team: 'blue' },
    { id: 'B2', name: 'MÜLLER', nr: '13', x: 500, y: 150, team: 'blue' }
];

let benchPlayers = [
    { id: 'S1', name: 'DAVID', nr: '7', team: 'red' },
    { id: 'S2', name: 'PELE', nr: '10', team: 'blue' }
];

function initBoard() {
    const players = board.querySelectorAll('.player-wrapper');
    players.forEach(p => p.remove());
    benchRed.innerHTML = ''; benchBlue.innerHTML = '';

    squad.forEach(p => createPlayer(p, board));
    benchPlayers.forEach(p => {
        const container = p.team === 'red' ? benchRed : benchBlue;
        createPlayer(p, container, false);
    });

    // Ball-Position initialisieren
    ball.style.left = "415px"; ball.style.top = "265px";
    makeDraggable(ball, true);
}

function createPlayer(p, container, isOnField = true) {
    const wrapper = document.createElement('div');
    wrapper.className = `player-wrapper ${p.team}`;
    wrapper.id = p.id;
    wrapper.innerHTML = `<div class="player-circle">${p.name}</div><div class="player-label">${p.nr}</div>`;
    if (isOnField) { wrapper.style.left = p.x + 'px'; wrapper.style.top = p.y + 'px'; }
    makeDraggable(wrapper);
    container.appendChild(wrapper);
}

function makeDraggable(el, isBall = false) {
    let isDown = false;
    el.onmousedown = (e) => { isDown = true; el.style.zIndex = 1000; e.preventDefault(); };
    
    document.onmousemove = (e) => {
        if (!isDown) return;
        const rect = board.getBoundingClientRect();
        let x = e.clientX - rect.left - (isBall ? 9 : 30);
        let y = e.clientY - rect.top - (isBall ? 9 : 25);
        
        if (x > -20 && x < rect.width + 20) {
            if (el.parentElement !== board) board.appendChild(el);
            el.style.position = 'absolute';
            el.style.left = x + "px"; el.style.top = y + "px";
        }
    };
    
    document.onmouseup = () => { 
        if(isDown) {
            isDown = false; el.style.zIndex = isBall ? 200 : 100;
            // Wenn etwas bewegt wurde, Toni analysieren lassen
            if(typeof analyzeSituation === 'function') analyzeSituation();
        }
    };
}

window.onload = initBoard;
function resetBoard() { initBoard(); if(typeof clearArrows === 'function') clearArrows(); }
