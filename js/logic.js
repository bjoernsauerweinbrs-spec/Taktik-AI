/**
 * Toni 2.0 - Kader-Matrix & Initialisierung
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
        div.style = "background:white; margin:10px; padding:15px; border-radius:10px; box-shadow:0 4px 6px rgba(0,0,0,0.1); border-left:5px solid #b71c1c;";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold;">
                <span>#${p.nr} ${p.name}</span>
                <span>${total} Pkt</span>
            </div>
            <div style="margin-top:10px; display:flex; gap:5px;">
                <button onclick="addPoint(${p.id}, 'tech')">⚽</button>
                <button onclick="addPoint(${p.id}, 'perc')">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')">⭐</button>
            </div>
        `;
        container.appendChild(div);
    });
    // Zeichne das Board sofort nach der Liste
    if (typeof drawBoard === 'function') drawBoard();
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
    }
}

// Beim Start ausführen
document.addEventListener('DOMContentLoaded', renderSquad);
