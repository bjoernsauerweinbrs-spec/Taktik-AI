/**
 * Toni 2.0 - Board Engine (Stabilisiert für KI-Zugriff)
 */

const pitch = document.getElementById('pitch');

// Funktion, die Toni direkt aufruft, um Spieler zu schieben
function movePlayerOnBoard(identifier, x, y) {
    const dots = document.querySelectorAll('.player-dot');
    let found = false;

    dots.forEach(dot => {
        const label = dot.querySelector('.player-label').innerText.toLowerCase();
        const idStr = identifier.toString().toLowerCase();

        // Prüfe ob Name oder Nummer im Label vorkommen
        if (label.includes(idStr)) {
            dot.style.left = x + '%';
            dot.style.top = y + '%';
            found = true;
            console.log(`Toni bewegt ${label} nach ${x}/${y}`);
        }
    });

    if(!found) console.warn(`Toni konnte Spieler "${identifier}" nicht finden.`);
}

// Zeichnet das Board neu (inklusive 16m-Raum)
function drawBoard() {
    if (!pitch) return;
    pitch.innerHTML = `
        <div class="center-line"></div>
        <div class="center-circle"></div>
        <div class="penalty-area left"></div>
        <div class="penalty-area right"></div>
        <div id="ball" style="position:absolute; top:50%; left:50%; width:15px; height:15px; background:white; border-radius:50%; border:1px solid black; transform:translate(-50%,-50%); z-index:10;"></div>
    `;

    // Spieler rendern
    squad.forEach(p => {
        if (p.status === 'team') {
            createDot(p, 'red');
        }
    });
}

function createDot(player, colorClass) {
    const dot = document.createElement('div');
    dot.className = `player-dot ${colorClass}`;
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.innerHTML = `<div class="player-label">#${player.nr} ${player.name}</div>`;
    
    // Drag & Drop für manuelles Verschieben
    makeDraggable(dot);
    pitch.appendChild(dot);
}

function makeDraggable(el) {
    let isDragging = false;
    el.onmousedown = (e) => { isDragging = true; };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        let rect = pitch.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.left = Math.max(0, Math.min(100, x)) + '%';
        el.style.top = Math.max(0, Math.min(100, y)) + '%';
    };
    document.onmouseup = () => { isDragging = false; };
}

document.addEventListener('DOMContentLoaded', drawBoard);
