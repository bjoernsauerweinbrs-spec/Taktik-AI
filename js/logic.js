/**
 * Toni 2.0 - Core Logic Engine
 */
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
        div.style = "background:white; margin:10px; padding:15px; border-radius:10px; box-shadow:0 4px 6px rgba(0,0,0,0.1); border-left:5px solid #2e7d32; color:#333;";
        div.innerHTML = 
            '<div style="display:flex; justify-content:space-between; font-weight:bold;">' +
                '<span>#' + p.nr + ' ' + p.name + '</span>' +
                '<span>' + total + ' Pkt</span>' +
            '</div>' +
            '<div style="margin-top:10px; display:flex; gap:5px;">' +
                '<button onclick="addPerformancePoint(' + p.id + ', \'tech\')">⚽</button>' +
                '<button onclick="addPerformancePoint(' + p.id + ', \'scan\')">👁️</button>' +
            '</div>';
        container.appendChild(div);
    });
}

function addPerformancePoint(id, cat) {
    var p = squad.find(function(player) { return player.id === id; });
    if (p) {
        p.points[cat]++;
        renderSquad();
        if (typeof saveSquadData === "function") saveSquadData();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderSquad();
});
