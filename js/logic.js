/**
 * Toni Rettungs-Logik: Stellt Kader & Board-Verbindung wieder her
 */

// Dein Kern-Kader
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, points: { tech: 0, perc: 0, fit: 0, special: 0 } },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, points: { tech: 0, perc: 0, fit: 0, special: 0 } }
];

function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(p => {
        const total = p.points.tech + p.points.perc + p.points.fit + p.points.special;
        const div = document.createElement('div');
        div.className = 'player-card';
        div.style = "background:white; margin:8px; padding:10px; border-radius:8px; border-left:4px solid #d32f2f; box-shadow:0 2px 4px rgba(0,0,0,0.1);";
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>#${p.nr} ${p.name}</strong>
                <span>${total} Pkt</span>
            </div>
            <div style="margin-top:8px; display:flex; gap:4px;">
                <button onclick="addPoint(${p.id}, 'tech')">⚽</button>
                <button onclick="addPoint(${p.id}, 'perc')">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')">⭐</button>
            </div>
        `;
        container.appendChild(div);
    });

    // WICHTIG: Das Board wird sofort mit den Spielern gezeichnet
    if (typeof drawBoard === 'function') drawBoard();
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        if (typeof saveSquadData === 'function') saveSquadData(); // Aktentasche
    }
}

// Startet die Anzeige beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Falls du Daten im Speicher hast, lade sie
    if (localStorage.getItem('toni_squad')) {
        squad = JSON.parse(localStorage.getItem('toni_squad'));
    }
    renderSquad();
});

// Speicher-Funktion für die Aktentasche
function saveSquadData() {
    localStorage.setItem('toni_squad', JSON.stringify(squad));
}
