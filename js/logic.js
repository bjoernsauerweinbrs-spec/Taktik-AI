/**
 * Toni 2.0 - Kader-Matrix & Daten-Sync
 */
let squad = [
    { id: 1, nr: 8, name: "Thorsten", status: "team", active: true, points: { tech: 0, perc: 0, fit: 0, special: 0 } },
    { id: 2, nr: 99, name: "David Luiz", status: "team", active: true, points: { tech: 0, perc: 0, fit: 0, special: 0 } }
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
            <div class="card-header">
                <strong>#${p.nr} ${p.name}</strong>
                <span class="total-points">${total} Pkt</span>
            </div>
            <div class="card-actions">
                <button onclick="addPoint(${p.id}, 'tech')">⚽</button>
                <button onclick="addPoint(${p.id}, 'perc')">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')">⭐</button>
            </div>
        `;
        container.appendChild(div);
    });
    if (typeof drawBoard === 'function') drawBoard();
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        saveSquadData(); // In die Aktentasche speichern
    }
}

function saveSquadData() {
    localStorage.setItem('toni_squad', JSON.stringify(squad));
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('toni_squad');
    if (saved) squad = JSON.parse(saved);
    renderSquad();
});
