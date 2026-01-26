/**
 * Toni 2.0 - Core Logic
 * Verwaltet den Zustand des Kaders, die Formationen und die Trainingsmodi.
 */

// --- Globaler Zustand ---
let currentMode = '11v11'; // '11v11', 'training', 'funino'
let activeTrainingCount = 0;

// --- Kader-Datenmodell ---
// status: 'team' (Spielfeld), 'bank' (Ersatzbank), 'none' (nicht im Kader für diesen Tag)
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 } },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 } },
    { id: 3, nr: 7, name: "Jordy", pos: "ZM", active: true, status: "bank", points: { tech: 0, scan: 0, team: 0 } }
];

// Gegner-Modell (Team Blau - Anonym mit Nummern)
let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 2, pos: "IV_B" }, { id: 103, nr: 3, pos: "IV_B2" },
    { id: 104, nr: 4, pos: "IV_B3" }, { id: 105, nr: 5, pos: "LM_B" }, { id: 106, nr: 6, pos: "RM_B" },
    { id: 107, nr: 7, pos: "ZM_B" }, { id: 108, nr: 8, pos: "ZM_B2" }, { id: 109, nr: 9, pos: "ST_B" },
    { id: 110, nr: 10, pos: "ST_B2" }, { id: 111, nr: 11, pos: "ST_B3" }
];

// --- Formations-Mappings (in % der Spielfeldgröße) ---
const formations = {
    "4-4-2_RED": {
        "TW": {x: 8, y: 50},
        "IV": {x: 22, y: 35}, "IV2": {x: 22, y: 65},
        "LV": {x: 28, y: 15}, "RV": {x: 28, y: 85},
        "LM": {x: 48, y: 15}, "RM": {x: 48, y: 85},
        "ZM": {x: 45, y: 38}, "ZM2": {x: 45, y: 62},
        "ST": {x: 78, y: 38}, "ST2": {x: 78, y: 62}
    },
    "3-4-3_BLUE": {
        "TW_B": {x: 92, y: 50},
        "IV_B": {x: 75, y: 50}, "IV_B2": {x: 75, y: 28}, "IV_B3": {x: 75, y: 72},
        "LM_B": {x: 60, y: 15}, "RM_B": {x: 60, y: 85},
        "ZM_B": {x: 55, y: 40}, "ZM_B2": {x: 55, y: 60},
        "ST_B": {x: 35, y: 50}, "ST_B2": {x: 35, y: 25}, "ST_B3": {x: 35, y: 75}
    }
};

// --- Kader-Funktionen ---

/**
 * Rendert die Spielerliste in der linken Sidebar
 */
function renderSquad() {
    const container = document.getElementById('player-list');
    if(!container) return;
    
    container.innerHTML = '';
    activeTrainingCount = 0;

    squad.forEach(p => {
        if(p.active) activeTrainingCount++;

        const div = document.createElement('div');
        div.className = 'squad-item';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong>#${p.nr} ${p.name}</strong>
                <span class="performance-badge">${p.points.tech + p.points.scan + p.points.team} Pkt</span>
            </div>
            <div style="font-size:0.8em; color:gray; margin-bottom:5px;">Position: ${p.pos}</div>
            <div class="squad-controls">
                <label style="font-size:0.8em;">
                    <input type="checkbox" ${p.active ? 'checked' : ''} onchange="toggleAttendance(${p.id})"> Training
                </label>
                <select onchange="setPlayerStatus(${p.id}, this.value)" style="font-size:0.8em;">
                    <option value="none" ${p.status === 'none' ? 'selected' : ''}>-</option>
                    <option value="team" ${p.status === 'team' ? 'selected' : ''}>Spielfeld</option>
                    <option value="bank" ${p.status === 'bank' ? 'selected' : ''}>Bank</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Schaltet die Anwesenheit für das Training um
 */
function toggleAttendance(id) {
    const player = squad.find(p => p.id === id);
    if(player) {
        player.active = !player.active;
        renderSquad();
        if(typeof drawBoard === "function") drawBoard();
    }
}

/**
 * Setzt den Status (Spielfeld/Bank)
 */
function setPlayerStatus(id, status) {
    const player = squad.find(p => p.id === id);
    if(player) {
        player.status = status;
        renderSquad();
        if(typeof drawBoard === "function") drawBoard();
    }
}

/**
 * Monitoring: Fügt einem Spieler Punkte hinzu
 */
function addPerformancePoint(id, category) {
    const player = squad.find(p => p.id === id);
    if(player && player.points[category] !== undefined) {
        player.points[category]++;
        renderSquad();
        // Toni gibt Feedback
        if(typeof toniSpeak === "function") {
            toniSpeak(`Klasse Aktion von ${player.name}! Er bekommt einen Punkt für ${category}.`);
        }
    }
}

// Initialer Aufruf beim Laden
document.addEventListener('DOMContentLoaded', () => {
    renderSquad();
});
