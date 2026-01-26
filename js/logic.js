var currentMode = '11v11'; 
var squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 } },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 } }
];

function renderSquad() {
    var container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(function(p) {
        var total = p.points.tech + p.points.scan;
        var div = document.createElement('div');
        div.className = 'player-card';
        div.style = "background:white; margin:10px; padding:12px; border-radius:10px; box-shadow:0 2px 4px rgba(0,0,0,0.1); position:relative; color:#333;";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="background:#2e7d32; color:white; padding:2px 8px; border-radius:10px; font-size:0.8em;">${total} Pkt</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:10px;">
                <button onclick="addPerformancePoint(${p.id}, 'tech')">⚽</button>
                <button onclick="addPerformancePoint(${p.id}, 'scan')">👁️</button>
                <button onclick="deletePlayer(${p.id})" style="margin-left:auto; border:none; background:none; color:#ff5252; cursor:pointer;">✕</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function addPerformancePoint(id, cat) {
    var p = squad.find(function(player) { return player.id === id; });
    if (p) { p.points[cat]++; renderSquad(); if(typeof saveSquadData === "function") saveSquadData(); }
}

function deletePlayer(id) {
    if(confirm("Spieler löschen?")) { squad = squad.filter(function(p) { return p.id !== id; }); renderSquad(); drawBoard(); }
}

function addNewPlayerPrompt() {
    var name = prompt("Name:");
    var nr = prompt("Nummer:");
    if (name && nr) {
        squad.push({ id: Date.now(), nr: parseInt(nr), name: name, pos: "ZM", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 } });
        renderSquad();
        if(typeof drawBoard === "function") drawBoard();
    }
}

document.addEventListener('DOMContentLoaded', renderSquad);
