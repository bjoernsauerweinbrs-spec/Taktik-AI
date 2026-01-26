/**
 * Toni 2.0 - Core Logic Engine
 * Kader-Matrix, Ampel-System & Performance-Tracking
 */

// Initialer Kader (Beispiel-Daten basierend auf deinen Vorgaben)
let squad = [
    { id: 1, nr: 8, name: "Thorsten", status: "present", points: { tech: 0, scan: 0, fit: 0, star: 0 }, x: "25%", y: "40%" },
    { id: 2, nr: 99, name: "David Luiz", status: "present", points: { tech: 0, scan: 0, fit: 0, star: 0 }, x: "25%", y: "60%" }
];

/**
 * Erzeugt die interaktive Kader-Matrix in der linken Sidebar
 */
function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(p => {
        const total = p.points.tech + p.points.scan + p.points.fit + p.points.star;
        
        const card = document.createElement('div');
        card.className = 'player-card';
        card.style = `
            background: rgba(255,255,255,0.03); margin-bottom: 12px; padding: 15px; 
            border-radius: 12px; border-left: 4px solid ${getStatusColor(p.status)};
            position: relative; transition: 0.3s;
        `;

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <strong style="color:white;">#${p.nr} ${p.name}</strong>
                <span style="font-size: 10px; background: #333; padding: 2px 6px; border-radius: 4px;">${total} PKT</span>
            </div>
            
            <div style="display:flex; gap:5px; margin-bottom:12px;">
                <div onclick="setStatus(${p.id}, 'present')" style="width:12px; height:12px; border-radius:50%; background:#2ecc71; cursor:pointer; opacity:${p.status==='present'?1:0.2}" title="Anwesend"></div>
                <div onclick="setStatus(${p.id}, 'matchday')" style="width:12px; height:12px; border-radius:50%; background:#f1c40f; cursor:pointer; opacity:${p.status==='matchday'?1:0.2}" title="Nur Spieltag"></div>
                <div onclick="setStatus(${p.id}, 'absent')" style="width:12px; height:12px; border-radius:50%; background:#e74c3c; cursor:pointer; opacity:${p.status==='absent'?1:0.2}" title="Abwesend"></div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <button onclick="addPoint(${p.id}, 'tech')" class="btn-mini">⚽ Tech</button>
                <button onclick="addPoint(${p.id}, 'scan')" class="btn-mini">👁️ Scan</button>
                <button onclick="addPoint(${p.id}, 'fit')" class="btn-mini">🏃 Fit</button>
                <button onclick="addPoint(${p.id}, 'star')" class="btn-mini">⭐ Ginga</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function getStatusColor(status) {
    if (status === 'present') return '#2ecc71';
    if (status === 'matchday') return '#f1c40f';
    return '#e74c3c';
}

function setStatus(id, newStatus) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player.status = newStatus;
        renderSquad();
        if (typeof drawBoard === 'function') drawBoard();
        saveSquadData();
    }
}

function addPoint(id, category) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player.points[category]++;
        renderSquad();
        saveSquadData();
        // Toni gibt Feedback bei Sonderpunkten
        if (category === 'star' && typeof toniSpeak === 'function') {
            toniSpeak(`Herausragend! ${player.name} zeigt echten Ginga-Style.`);
        }
    }
}

function addNewPlayerPrompt() {
    const name = prompt("Name des Spielers:");
    const nr = prompt("Trikotnummer:");
    if (name && nr) {
        squad.push({
            id: Date.now(),
            nr: parseInt(nr),
            name: name,
            status: "present",
            points: { tech: 0, scan: 0, fit: 0, star: 0 },
            x: "50%", y: "50%"
        });
        renderSquad();
        if (typeof drawBoard === 'function') drawBoard();
        saveSquadData();
    }
}

// Start der Logik beim Laden
document.addEventListener('DOMContentLoaded', () => {
    // Hier wird später aus dem LocalStorage geladen
    renderSquad();
});

// Hilfs-Style für die kleinen Buttons
const style = document.createElement('style');
style.innerHTML = `
    .btn-mini { 
        background: #1a232e; border: 1px solid #333; color: #9aa3ad; 
        font-size: 10px; padding: 4px; border-radius: 4px; cursor: pointer; 
    }
    .btn-mini:hover { background: #2ecc71; color: white; }
`;
document.head.appendChild(style);
