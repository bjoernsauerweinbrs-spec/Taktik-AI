/**
 * Toni 2.0 - Stabile Logik & Kader-Management
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
        // Wir nutzen wieder das Design, das funktioniert hat
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
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        if (typeof saveSquadData === 'function') saveSquadData();
        
        // Toni gibt ein kurzes Audio-Feedback, wenn er geladen ist
        if (cat === 'special' && typeof toniSpeak === 'function') {
            toniSpeak("Klasse Arbeit, Björn! Ein Sonderlob für die Entwicklung.");
        }
    }
}

function deletePlayer(id) {
    squad = squad.filter(p => p.id !== id);
    renderSquad();
    if (typeof drawBoard === 'function') drawBoard();
}

function addNewPlayer() {
    const name = prompt("Name des Spielers:");
    const nr = prompt("Nummer:");
    if (name && nr) {
        squad.push({
            id: Date.now(),
            nr: parseInt(nr),
            name: name,
            status: "team",
            points: { tech: 0, perc: 0, fit: 0, special: 0 }
        });
        renderSquad();
        if (typeof drawBoard === 'function') drawBoard();
    }
}

// Beim Start direkt ausführen
document.addEventListener('DOMContentLoaded', () => {
    renderSquad();
    if (typeof drawBoard === 'function') drawBoard();
});
