/**
 * Toni 2.0 - Core Logic mit Hover-Support
 */

let squad = [
    { id: 1, nr: 8, name: "Thorsten", status: "team", points: { tech: 0, perc: 0, fit: 0, special: 0 } },
    { id: 2, nr: 99, name: "David Luiz", status: "team", points: { tech: 0, perc: 0, fit: 0, special: 0 } }
];

function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(p => {
        const total = p.points.tech + p.points.perc + p.points.fit + p.points.special;
        const div = document.createElement('div');
        div.className = 'player-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="font-weight:bold;">${total} Pkt</span>
            </div>
            <div style="margin-top:5px; display:flex; gap:5px;">
                <button onclick="addPoint(${p.id}, 'tech')">⚽</button>
                <button onclick="addPoint(${p.id}, 'perc')">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')">⭐</button>
                <button onclick="deletePlayer(${p.id})" style="background:#ffcdd2; border:none; margin-left:auto;">✕</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    // Board nach jedem Kader-Update neu zeichnen
    if (typeof drawBoard === 'function') drawBoard();
}

// Diese Funktion in der board.js oder logic.js sorgt für die Hover-Daten
function createDot(player, colorClass) {
    const dot = document.createElement('div');
    dot.className = `player-dot ${colorClass}`;
    
    // WICHTIG: Hier werden die Daten für den CSS-Hover (Block 4) gesetzt
    dot.setAttribute('data-tech', player.points.tech);
    dot.setAttribute('data-perc', player.points.perc);
    dot.setAttribute('data-fit', player.points.fit);
    dot.setAttribute('data-special', player.points.special);
    
    dot.style.left = '50%';
    dot.style.top = '50%';
    dot.innerHTML = `<div class="player-label">#${player.nr} ${player.name}</div>`;
    
    if (typeof makeDraggable === 'function') makeDraggable(dot);
    pitch.appendChild(dot);
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        if (typeof saveSquadData === 'function') saveSquadData();
        
        if (cat === 'special' && typeof toniSpeak === 'function') {
            toniSpeak(`Björn, klasse Coaching! Ein Sonderpunkt für ${p.name}.`);
        }
    }
}

function deletePlayer(id) {
    squad = squad.filter(p => p.id !== id);
    renderSquad();
}

document.addEventListener('DOMContentLoaded', renderSquad);
