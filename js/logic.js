/**
 * Toni 2.0 - Core Logic Engine
 * Zuständig für Kader, Formationen, Material und Team-Farben.
 */

// --- Globaler Zustand ---
let currentMode = '11v11'; 
let activeTrainingCount = 0;

// --- Kader Datenmodell (Deine Jungs) ---
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false },
    { id: 3, nr: 7, name: "David", pos: "ZM", active: true, status: "bank", points: { tech: 0, scan: 0, team: 0 }, hasBall: false }
];

// --- Gegner Modell (Team Blau) ---
let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 4, pos: "IV_B" }, { id: 103, nr: 5, pos: "IV_B2" },
    { id: 104, nr: 2, pos: "IV_B3" }, { id: 105, nr: 6, pos: "LM_B" }, { id: 106, nr: 7, pos: "RM_B" },
    { id: 107, nr: 8, pos: "ZM_B" }, { id: 108, nr: 10, pos: "ZM_B2" }, { id: 109, nr: 9, pos: "ST_B" },
    { id: 110, nr: 11, pos: "ST_B2" }, { id: 111, nr: 3, pos: "ST_B3" }
];

// --- Formationen (in % des Feldes) ---
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

/**
 * Material-Logik: Jedem aktiven Spieler einen Ball geben
 */
function distributeBalls(count) {
    squad.forEach(p => {
        if (p.active) p.hasBall = true;
    });
    toniSpeak(`Björn, ich habe jedem deiner ${activeTrainingCount} Jungs einen Ball gegeben. Jetzt bringen wir Ginga ins Training!`);
    drawBoard();
}

/**
 * Team-Farben aktualisieren (Leibchen-System)
 */
function updateTeamColors() {
    const colorA = document.getElementById('color-team-a').value;
    const colorB = document.getElementById('color-team-b').value;
    
    // Wir setzen CSS Variablen global
    document.documentElement.style.setProperty('--red-team', colorA);
    document.documentElement.style.setProperty('--yellow-leibchen', colorB);
    
    toniSpeak("Die Leibchenfarben wurden angepasst. Sieht gut aus!");
    drawBoard();
}

/**
 * Spielerliste links rendern
 */
function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';
    activeTrainingCount = 0;

    squad.forEach(p => {
        if (p.active) activeTrainingCount++;
        const total = p.points.tech + p.points.scan + p.points.team;
        
        const div = document.createElement('div');
        div.className = 'player-card'; // Styling über CSS
        div.style = "background: white; margin: 10px; padding: 12px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="background:var(--toni-green); color:white; padding:2px 6px; border-radius:10px; font-size:0.7em;">${total} Pkt</span>
            </div>
            <div style="display:flex; gap:5px; margin-top:8px;">
                <select onchange="setPlayerStatus(${p.id}, this.value)" style="font-size:0.7em; flex-grow:1;">
                    <option value="none" ${p.status === 'none' ? 'selected' : ''}>Ausblenden</option>
                    <option value="team" ${p.status === 'team' ? 'selected' : ''}>Spielfeld</option>
                    <option value="bank" ${p.status === 'bank' ? 'selected' : ''}>Bank</option>
                </select>
                <button onclick="addPoint(${p.id}, 'tech')" title="Technik">⚽</button>
                <button onclick="addPoint(${p.id}, 'scan')" title="Scanning">👁️</button>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Punktesystem mit Auto-Save
 */
function addPoint(id, cat) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.points[cat]++;
        renderSquad();
        saveSquadData();
        toniSpeak(`Punkt für ${p.name}! Seine ${cat === 'tech' ? 'Technik' : 'Wahrnehmung'} wird immer besser.`);
    }
}

function setPlayerStatus(id, status) {
    const p = squad.find(player => player.id === id);
    if (p) {
        p.status = status;
        p.active = (status !== 'none');
        renderSquad();
        drawBoard();
        saveSquadData();
    }
}

// Initialer Start
document.addEventListener('DOMContentLoaded', () => {
    renderSquad();
});
