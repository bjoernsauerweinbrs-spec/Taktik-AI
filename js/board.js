/**
 * Toni 2.0 - Das Ginga-Board (Wiederherstellung)
 */
const pitch = document.getElementById('pitch');

function drawBoard() {
    if (!pitch) return;

    // Das Spielfeld mit professionellen Markierungen
    pitch.innerHTML = `
        <div class="pitch-lines">
            <div class="center-line"></div>
            <div class="center-circle"></div>
            <div class="penalty-area left"></div>
            <div class="penalty-area right"></div>
            <div class="goal-area left"></div>
            <div class="goal-area right"></div>
        </div>
        <div id="ball" class="ball"></div>
    `;

    // Tore hinzufügen (interaktiv)
    addGoal('left');
    addGoal('right');

    // Spieler-Dots wiederherstellen
    if (typeof squad !== 'undefined') {
        squad.forEach(p => {
            if (p.active || p.status === 'team') {
                createDot(p, 'red');
            }
        });
    }
}

function createDot(player, colorClass) {
    const dot = document.createElement('div');
    dot.className = `player-dot ${colorClass}`;
    dot.id = `player-${player.id}`;
    dot.style.left = player.x || '50%';
    dot.style.top = player.y || '50%';
    
    // Das Label mit Nummer und Name
    dot.innerHTML = `<div class="player-label">#${player.nr} ${player.name}</div>`;
    
    makeDraggable(dot, player.id);
    pitch.appendChild(dot);
}

function addGoal(side) {
    const goal = document.createElement('div');
    goal.className = `goal ${side}`;
    goal.onclick = () => goal.classList.toggle('rotated'); // Rotation per Klick
    pitch.appendChild(goal);
}

function makeDraggable(el, playerId) {
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
    document.onmouseup = () => {
        isDragging = false;
        // Position im Speicher halten
        const p = squad.find(player => player.id === playerId);
        if (p) { p.x = el.style.left; p.y = el.style.top; saveSquadData(); }
    };
}

document.addEventListener('DOMContentLoaded', drawBoard);
