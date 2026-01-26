/**
 * Toni 2.0 - Core Logic Engine
 * Verwaltung von Kader (3-Stufen-Status) und deutschen Leistungs-Kategorien.
 */

let currentMode = '11v11'; 
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, fit: 0, special: 0 }, hasBall: false },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, fit: 0, special: 0 }, hasBall: false }
];

let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 4, pos: "IV_B" }, { id: 103, nr: 5, pos: "IV_B2" },
    { id: 104, nr: 2, pos: "IV_B3" }, { id: 106, nr: 7, pos: "RM_B" }, { id: 107, nr: 8, pos: "ZM_B" }, 
    { id: 108, nr: 10, pos: "ZM_B2" }, { id: 109, nr: 9, pos: "ST_B" }, { id: 110, nr: 11, pos: "ST_B2" }
];

const formations = {
    "4-4-2_RED": {
        "TW": {x: 8, y: 50}, "IV": {x: 22, y: 35}, "IV2": {x: 22, y: 65},
        "LV": {x: 28, y: 15}, "RV": {x: 28, y: 85}, "ZM": {x: 45, y: 38},
        "ZM2": {x: 45, y: 62}, "LM": {x: 48, y: 15}, "RM": {x: 48, y: 85},
        "ST": {x: 78, y: 38}, "ST2": {x: 78, y: 62}
    },
    "3-4-3_BLUE": {
        "TW_B": {x: 92, y: 50}, "IV_B": {x: 75, y: 50}, "IV_B2": {x: 75, y: 28},
        "IV_B3": {x: 75, y: 72}, "ZM_B": {x: 55, y: 40}, "ZM_B2": {x: 55, y: 60},
        "LM_B": {x: 60, y: 15}, "RM_B": {x: 60, y: 85}, "ST_B": {x: 35, y: 50},
        "ST_B2": {x: 35, y: 25}, "ST_B3": {x: 35, y: 75}
    }
};

function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';

    squad.forEach(p => {
        const total = p.points.tech + p.points.scan + p.points.fit + p.points.special;
        const div = document.createElement('div');
        div.className = 'player-card';
        div.style = "background:white; margin:8px; padding:10px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); position:relative; border-left:4px solid var(--red-team);";
        
        div.innerHTML = `
            <button onclick="deletePlayer(${p.id})" style="position:absolute; top:2px; right:5px; border:none; background:none; cursor:pointer; color:#ccc;">✕</button>
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="font-size:0.8em; color:var(--toni-green); font-weight:bold;">${total} Pkt</span>
            </div>
            <select onchange="setPlayerStatus(${p.id}, this.value)" style="width:100%; font-size:0.75em; margin-bottom:8px;">
                <option value="team" ${p.status === 'team' ? 'selected' : ''}>Anwesend (Training+Spiel)</option>
                <option value="spiel" ${p.status === 'spiel' ? 'selected' : ''}>Nur Spieltag (fehlt Training)</option>
                <option value="none" ${p.status === 'none' ? 'selected' : ''}>Abwesend (Nicht im Kader)</option>
            </select>
            <div style="display:flex; justify-content:space-between; gap:2px;">
                <button onclick="addPoint(${p.id}, 'tech')" title="Technik">⚽</button>
                <button onclick="addPoint(${p.id}, 'scan')" title="Wahrnehmung">👁️</button>
                <button onclick="addPoint(${p.id}, 'fit')" title="Fitness">🏃</button>
                <button onclick="addPoint(${p.id}, 'special')" title="Sonderpunkte">⭐</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function setPlayerStatus(id, status) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.status = status;
        p.active = (status !== 'none');
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
    }
}

function deletePlayer(id) {
    if(confirm("Spieler wirklich löschen?")) {
        squad = squad.filter(p => p.id !== id);
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        saveSquadData();
    }
}

function addNewPlayerPrompt() {
    const name = prompt("Name:");
    const nr = prompt("Nummer:");
    if (name && nr) {
        squad.push({ id: Date.now(), nr: parseInt(nr), name: name, pos: "ZM", active: true, status: "team", points: { tech: 0, scan: 0, fit: 0, special: 0 }, hasBall: false });
        renderSquad();
        saveSquadData();
    }
}

document.addEventListener('DOMContentLoaded', () => { renderSquad(); });
