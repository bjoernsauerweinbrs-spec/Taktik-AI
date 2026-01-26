/**
 * Toni 2.0 - Stabiles Board (Wiederherstellung der Anzeige)
 */

const pitch = document.getElementById('pitch');

function drawBoard() {
    if (!pitch) return;

    // Zeichnet das grüne Feld und die Markierungen (inkl. 16er)
    pitch.innerHTML = `
        <div class="center-line"></div>
        <div class="center-circle"></div>
        <div class="penalty-area left"></div>
        <div class="penalty-area right"></div>
        <div id="ball" style="position:absolute; top:50%; left:50%; width:15px; height:15px; background:white; border-radius:50%; border:1px solid black; transform:translate(-50%,-50%); z-index:10;"></div>
    `;

    // Tore hinzufügen
    addGoal('left');
    addGoal('right');

    // Spieler aus der logic.js rendern
    if (typeof squad !== 'undefined') {
        squad.forEach(p => {
            // Nur Spieler anzeigen, die aktiv oder im Team-Status sind
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
    
    // Positionierung (Standard Mitte, falls nichts gespeichert)
    dot.style.left = player.x || '50%';
    dot.style.top = player.y || '50%';
    
    dot.innerHTML = `<div class="player-label">#${player.nr} ${player.name}</div>`;
    
    makeDraggable(dot, player.id);
    pitch.appendChild(dot);
}

function addGoal(side) {
    const goal = document.createElement('div');
    goal.className = `goal ${side}`;
    goal.onclick = () => goal.classList.toggle('rotated');
    pitch.appendChild(goal);
}

function makeDraggable(el, playerId) {
    let isDragging = false;
    el.onmousedown = () => { isDragging = true; };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let rect = pitch.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const posX = Math.max(0, Math.min(100, x)) + '%';
        const posY = Math.max(0, Math.min(100, y)) + '%';
        
        el.style.left = posX;
        el.style.top = posY;

        // Position im squad-Objekt speichern
        const p = squad.find(player => player.id === playerId);
        if (p) { p.x = posX; p.y = posY; }
    };
    document.onmouseup = () => { 
        isDragging = false; 
        if (typeof saveSquadData === 'function') saveSquadData(); 
    };
}

// WICHTIG: Funktion für Toni, um Spieler zu schieben
function movePlayerOnBoard(identifier, x, y) {
    const dots = document.querySelectorAll('.player-dot');
    dots.forEach(dot => {
        const label = dot.querySelector('.player-label').innerText.toLowerCase();
        if (label.includes(identifier.toString().toLowerCase())) {
            dot.style.left = x + '%';
            dot.style.top = y + '%';
            
            // Wert auch im Datensatz speichern
            const id = parseInt(dot.id.replace('player-', ''));
            const p = squad.find(player => player.id === id);
            if (p) { p.x = x + '%'; p.y = y + '%'; }
        }
    });
}

document.addEventListener('DOMContentLoaded', drawBoard);
