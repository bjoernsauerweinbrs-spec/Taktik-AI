/**
 * Toni 2.0 - Core Logic Engine
 * Zuständig für Kader, Monitoring, Punkte und Storage-Anbindung.
 */

// --- Initialer Zustand ---
let currentMode = '11v11'; 
let activeTrainingCount = 0;

// --- Kader Datenmodell (Fallback, falls Storage leer ist) ---
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false }
];

// --- Gegner Modell (Blau) ---
let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 4, pos: "IV_B" }, { id: 103, nr: 5, pos: "IV_B2" },
    { id: 104, nr: 2, pos: "IV_B3" }, { id: 105, nr: 6, pos: "LM_B" }, { id: 106, nr: 7, pos: "RM_B" },
    { id: 107, nr: 8, pos: "ZM_B" }, { id: 108, nr: 10, pos: "ZM_B2" }, { id: 109, nr: 9, pos: "ST_B" },
    { id: 110, nr: 11, pos: "ST_B2" }, { id: 111, nr: 3, pos: "ST_B3" }
];

// --- Formationen Mappings (in % des Feldes) ---
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
 * Erzeugt die interaktive Kaderliste links
 */
function renderSquad() {
    const container = document.getElementById('player-list');
    if (!container) return;
    container.innerHTML = '';
    activeTrainingCount = 0;

    squad.forEach(p => {
        if (p.active) activeTrainingCount++;
        const totalPoints = p.points.tech + p.points.scan + p.points.team;
        
        const div = document.createElement('div');
        div.className = 'player-card'; // Nutzt das CSS aus deinem Sidebar-Design
        div.style = "background: white; margin: 10px; padding: 12px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;";
        
        div.innerHTML = `
            <button onclick="deletePlayer(${p.id})" style="position:absolute; top:5px; right:5px; border:none; background:none; color:#ff5252; cursor:pointer; font-weight:bold;">✕</button>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>#${p.nr} ${p.name}</strong>
                <span style="background:#2e7d32; color:white; padding:2px 8px; border-radius:10px; font-size:0.8em;">${totalPoints} Pkt</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:10px;">
                <select onchange="setPlayerStatus(${p.id}, this.value)" style="flex-grow:1; font-size:0.75em;">
                    <option value="none" ${p.status === 'none' ? 'selected' : ''}>Abwesend</option>
                    <option value="team" ${p.status === 'team' ? 'selected' : ''}>Spielfeld</option>
                    <option value="bank" ${p.status === 'bank' ? 'selected' : ''}>Bank</option>
                </select>
                <button onclick="addPerformancePoint(${p.id}, 'tech')" title="Technik">⚽</button>
                <button onclick="addPerformancePoint(${p.id}, 'scan')" title="Scanning">👁️</button>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Spieler permanent entfernen
 */
function deletePlayer(id) {
    if(confirm("Spieler wirklich löschen?")) {
        squad = squad.filter(p => p.id !== id);
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        if (typeof saveSquadData === "function") saveSquadData();
    }
}

/**
 * Team-Farben live aktualisieren
 */
function updateTeamColors() {
    const colorA = document.getElementById('color-team-a').value;
    const colorB = document.getElementById('color-team-b').value;
    const colorC = document.getElementById('color-team-c').value;
    
    document.documentElement.style.setProperty('--red-team', colorA);
    document.documentElement.style.setProperty('--yellow-leibchen', colorB);
    document.documentElement.style.setProperty('--blue-team', colorC);
    
    if (typeof drawBoard === "function") drawBoard();
}

/**
 * Material: Bälle an alle Feldspieler verteilen
 */
function distributeBalls(count) {
    squad.forEach(p => {
        if (p.active && p.status === 'team') p.hasBall = true;
    });
    if (typeof toniSpeak === "function") toniSpeak(`Björn, jeder Spieler auf dem Feld hat jetzt einen Ball.`);
    if (typeof drawBoard === "function") drawBoard();
}

/**
 * Umschalten des Material-Menüs (Hütchen/Bälle)
 */
function toggleMaterialMenu() {
    const menu = document.getElementById('material-menu');
    menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
}

function setPlayerStatus(id, status) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player.status = status;
        player.active = (status !== 'none');
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        if (typeof saveSquadData === "function") saveSquadData();
    }
}

function addPerformancePoint(id, category) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player.points[category]++;
        renderSquad();
        if (typeof saveSquadData === "function") saveSquadData();
        if (typeof toniSpeak === "function") {
            toniSpeak(`Klasse! ${player.name} bekommt einen Punkt.`);
        }
    }
}

function addNewPlayerPrompt() {
    const name = prompt("Name:");
    const nr = prompt("Nummer:");
    if (name && nr) {
        squad.push({ id: Date.now(), nr: parseInt(nr), name: name, pos: "ZM", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false });
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        if (typeof saveSquadData === "function") saveSquadData();
    }
}

function resetBoardPositions() {
    if (typeof drawBoard === "function") drawBoard();
    if (typeof toniSpeak === "function") toniSpeak("Alles wieder auf Anfang, Björn.");
}

document.addEventListener('DOMContentLoaded', () => {
    // Falls Daten in storage.js geladen werden, renderSquad() wird dort getriggert
    renderSquad();
});
