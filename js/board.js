/* --- BOARD LOGIK --- */
const boardContainer = document.getElementById('board-container');

const initialPlayers = [
    { id: 'R1', role: 'TW', x: 30, y: 235, team: 'red' },
    { id: 'R2', role: 'IV', x: 150, y: 150, team: 'red' },
    { id: 'R3', role: 'IV', x: 150, y: 320, team: 'red' },
    { id: 'R4', role: 'ST', x: 600, y: 235, team: 'red' },
    { id: 'B1', role: 'TW', x: 740, y: 235, team: 'blue' },
    { id: 'B2', role: 'V', x: 550, y: 100, team: 'blue' },
    { id: 'B3', role: 'V', x: 550, y: 370, team: 'blue' }
];

function initBoard() {
    if (!boardContainer) return;
    boardContainer.innerHTML = ''; 
    initialPlayers.forEach(p => {
        const div = document.createElement('div');
        div.className = `player ${p.team}`;
        div.id = p.id;
        div.innerText = p.role;
        div.style.left = p.x + 'px';
        div.style.top = p.y + 'px';
        makeDraggable(div);
        boardContainer.appendChild(div);
    });
}

function makeDraggable(el) {
    let isDown = false;
    el.addEventListener('mousedown', () => { isDown = true; el.style.zIndex = 1000; });
    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const rect = boardContainer.getBoundingClientRect();
        let x = e.clientX - rect.left - 16;
        let y = e.clientY - rect.top - 16;
        el.style.left = Math.max(0, Math.min(x, rect.width - 32)) + 'px';
        el.style.top = Math.max(0, Math.min(y, rect.height - 32)) + 'px';
    });
    document.addEventListener('mouseup', () => { isDown = false; el.style.zIndex = 100; });
}

function resetBoard() { initBoard(); }

/* WICHTIG: Der automatische Start */
window.onload = () => {
    initBoard();
};
