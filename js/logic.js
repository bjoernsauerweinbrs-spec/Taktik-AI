/**
 * Toni 2.0 - Core Logic (Final)
 * Fokus: Kader-Management & Performance-Daten
 */

let currentMode = '11v11'; 

// Initialer Kader
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, perc: 0, fit: 0, special: 0 } },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, perc: 0, fit: 0, special: 0 } }
];

/**
 * Rendert die Kader-Matrix in der Sidebar
 */
function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(p => {
        const total = p.points.tech + p.points.perc + p.points.fit + p.points.special;
        const div = document.createElement('div');
        div.className = 'player-card';
        div.style = "background:white; margin:8px; padding:10px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); position:relative; border-left:4px solid #d32f2f;";
        
        div.innerHTML = `
            <button onclick="deletePlayer(${p.id})" style="position:absolute; top:2px; right:5px; border:none; background:none; cursor:pointer; color:#ccc;">✕</button>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="font-size:0.8em; color:#2e7d32; font-weight:bold;">${total} Pkt</span>
            </div>
            
            <select onchange="setPlayerStatus(${p.id}, this.value)" style="width:100%; font-size:0.75em; margin-bottom:8px; border-radius:4px; border:1px solid #ddd;">
                <option value="team" ${p.status === 'team' ? 'selected' : ''}>🟢 Anwesend (Training+Spiel)</option>
                <option value="spiel" ${p.status === 'spiel' ? 'selected' : ''}>🟡 Nur Spieltag (fehlt Training)</option>
                <option value="none" ${p.status === 'none' ? 'selected' : ''}>🔴 Abwesend</option>
            </select>

            <div style="display:flex; justify-content:space-between; gap:2px;">
                <button onclick="addPoint(${p.id}, 'tech')" title="Technik">⚽</button>
                <button onclick="addPoint(${p.id}, 'perc')" title="Wahrnehmung">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')" title="Fitness">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')" title="Sonderpunkt">⭐</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function setPlayerStatus(id, status) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.status = status;
        // Im Training nur anzeigen, wenn status 'team' ist
        p.active = (status === 'team');
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        saveSquadData();
    }
}

function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        saveSquadData();
        // Kleiner Ginga-Effekt: Toni gibt kurzes Feedback im Chat
        if (cat === 'special' && typeof toniSpeak === "function") {
            toniSpeak(`Sensationell, Björn! Sonderpunkt für ${p.name}. Das formt den Charakter der Truppe!`);
        }
    }
}

function deletePlayer(id) {
    if(confirm("Spieler wirklich aus dem Kader entfernen?")) {
        squad = squad.filter(p => p.id !== id);
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        saveSquadData();
    }
}

function addNewPlayerPrompt() {
    const name = prompt("Name des neuen Spielers:");
    const nr = prompt("Trikotnummer:");
    if (name && nr) {
        squad.push({ id: Date.now(), nr: parseInt(nr), name: name, pos: "ZM", active: true, status: "team", points: { tech: 0, perc: 0, fit: 0, special: 0 } });
        renderSquad();
        saveSquadData();
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    if (typeof loadSquadData === 'function') loadSquadData();
    renderSquad();
});
