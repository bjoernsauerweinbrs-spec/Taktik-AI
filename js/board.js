/**
 * Toni 2.0 - Stabiles Board (Wiederherstellung)
 */

const pitch = document.getElementById('pitch');

function drawBoard() {
    if (!pitch) return;

    // Spielfeld-Struktur (Markierungen)
    pitch.innerHTML = `
        <div class="center-line"></div>
        <div class="center-circle"></div>
        <div class="penalty-area left"></div>
        <div class="penalty-area right"></div>
        <div id="ball" class="ball" style="position:absolute; top:50%; left:50%; width:15px; height:15px; background:white; border-radius:50%; transform:translate(-50%,-50%); border:1px solid black; z-index:10;"></div>
    `;

    // Tore zeichnen
    addGoal('left');
    addGoal('right');

    // Spieler-Dots aus dem Kader (squad) laden
    if (typeof squad !== 'undefined') {
        squad.forEach(p => {
            // Wir rendern jeden Spieler, der im Team ist
            createDot(p, 'red');
        });
    }
}

function createDot(player, colorClass) {
    const dot = document.createElement('div');
    dot.className = `player-dot ${colorClass}`;
    dot.id = `player-${player.id}`;
    
    // Standard-Position in der Mitte, falls nichts gespeichert ist
    dot.style.left = player.x || '50%';
    dot.style.top = player.y || '50%';
    
    // Label mit Nummer und Name
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
        
        const posX = Math.max(0, Math.min(100, x)) + '%';
        const posY = Math.max(0, Math.min(100, y)) + '%';
        
        el.style.left = posX;
        el.style.top = posY;

        // Position im squad-Objekt sichern
        const p = squad.find(player => player.id === playerId);
        if (p) { p.x = posX; p.y = posY; }
    };
    document.onmouseup = () => {
        isDragging = false;
        if (typeof saveSquadData === 'function') saveSquadData(); // In Aktentasche speichern
    };
}

// Schnittstelle für Toni zum Bewegen der Spieler
function movePlayerOnBoard(identifier, x, y) {
    const dots = document.querySelectorAll('.player-dot');
    dots.forEach(dot => {
        const label = dot.querySelector('.player-label').innerText.toLowerCase();
        if (label.includes(identifier.toString().toLowerCase())) {
            dot.style.left = x + '%';
            dot.style.top = y + '%';
        }
    });
}

// Sofort beim Laden ausführen
document.addEventListener('DOMContentLoaded', drawBoard);
