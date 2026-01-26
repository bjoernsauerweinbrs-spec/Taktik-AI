/**
 * Toni 2.0 - Stabiles Board (Wiederherstellung)
 */

const pitch = document.getElementById('pitch');
let squad = []; // Wird von der logic.js befüllt

// DIESE FUNKTION IST DER SCHLÜSSEL FÜR TONI
function movePlayerOnBoard(identifier, x, y) {
    const dots = document.querySelectorAll('.player-dot');
    let found = false;
    dots.forEach(dot => {
        const label = dot.querySelector('.player-label').innerText.toLowerCase();
        const idStr = identifier.toString().toLowerCase();
        if (label.includes(idStr)) {
            dot.style.left = x + '%';
            dot.style.top = y + '%';
            found = true;
        }
    });
    if(!found) console.log("Spieler nicht gefunden: " + identifier);
}

function drawBoard() {
    if (!pitch) return;
    // Das Spielfeld mit deinen Markierungen
    pitch.innerHTML = `
        <div class="center-line"></div>
        <div class="center-circle"></div>
        <div class="penalty-area left"></div>
        <div class="penalty-area right"></div>
        <div id="ball" class="ball"></div>
    `;
    
    // Hier werden deine roten Spieler wieder geladen
    if (typeof squad !== 'undefined') {
        squad.forEach(p => {
            if (p.status === 'team' || p.active === true) {
                createDot(p, 'red');
            }
        });
    }
    
    // Die Tore (interaktiv wie besprochen)
    addGoal('left');
    addGoal('right');
}

function createDot(player, colorClass) {
    const dot = document.createElement('div');
    dot.className = `player-dot ${colorClass}`;
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.innerHTML = `<div class="player-label">#${player.nr} ${player.name}</div>`;
    makeDraggable(dot);
    pitch.appendChild(dot);
}

function addGoal(side) {
    const goal = document.createElement('div');
    goal.className = `goal ${side}`;
    goal.onclick = () => goal.classList.toggle('rotated');
    pitch.appendChild(goal);
}

function makeDraggable(el) {
    let isDragging = false;
    el.onmousedown = () => isDragging = true;
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let rect = pitch.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.left = Math.max(0, Math.min(100, x)) + '%';
        el.style.top = Math.max(0, Math.min(100, y)) + '%';
    };
    document.onmouseup = () => isDragging = false;
}

document.addEventListener('DOMContentLoaded', drawBoard);
