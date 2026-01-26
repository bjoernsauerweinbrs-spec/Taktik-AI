/**
 * Toni 2.0 - Core Logic Engine (Clean Version)
 * Verwaltung von Kader, Formationen und Material-Logik.
 */

// --- Globaler Zustand ---
let currentMode = '11v11'; 
let activeTrainingCount = 0;

// --- Kader-Datenmodell (Deine Jungs) ---
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false },
    { id: 3, nr: 7, name: "David", pos: "ZM", active: true, status: "bank", points: { tech: 0, scan: 0, team: 0 }, hasBall: false }
];

// --- Gegner-Modell (Team Blau) ---
let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 4, pos: "IV_B" }, { id: 103, nr: 5, pos: "IV_B2" },
    { id: 104, nr: 2, pos: "IV_B3" }, { id: 105, nr: 6, pos: "LM_B" }, { id: 106, nr: 7, pos: "RM_B" },
    { id: 107, nr: 8, pos: "ZM_B" }, { id: 108, nr: 10, pos: "ZM_B2" }, { id: 109, nr: 9, pos: "ST_B" },
    { id: 110, nr: 11, pos: "ST_B2" }, { id: 111, nr: 3, pos: "ST_B3" }
];

// --- Formationen-Mappings (Koordinaten in % des Feldes) ---
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
 * Material-Verteilung: Jedem aktiven Spieler einen Ball zuweisen
 */
function distributeBalls(count) {
    squad.forEach(p => {
        if (p.active && p.status === 'team') p.hasBall = true;
    });
    // Toni gibt Feedback über die neue KI-Schnittstelle
    if (typeof toniSpeak === "function") {
        toniSpeak(`Björn, jeder Spieler auf dem Feld hat jetzt einen Ball. Ginga-Modus aktiviert!`);
    }
    if (typeof drawBoard === "function") drawBoard();
}

/**
 * Team-Farben: Aktualisiert die Leibchen-Farben (CSS Variablen)
 */
function updateTeamColors() {
    const colorA = document.getElementById('color-team-a').value;
    const colorB = document.getElementById('color-team-b').value;
    
    document.documentElement.style.setProperty('--red-team', colorA);
    document.documentElement.style.setProperty('--yellow-leibchen', colorB);
    
    if (typeof drawBoard === "function") drawBoard();
}

/**
 * Rendert die Spielerliste in der Sidebar
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
        div.className = 'squad-item';
        div.style = "background: #fff; margin: 8px; padding: 12px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-left: 4px solid var(--red-team);";
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:0.9em;">#${p.nr} ${p.name}</strong>
                <span style="font-size:0.75em; font-weight:bold; color:var(--toni-green);">${totalPoints} Pkt</span>
            </div>
            <div style="display:flex; gap:6px; margin-top:8px;">
                <select onchange="setPlayerStatus(${p.id}, this.value)" style="font-size:0.7em; flex-grow:1; border-radius:4px; border:1px solid #ddd;">
                    <option value="none" ${p.status === 'none' ? 'selected' : ''}>Aus</option>
                    <option value="team" ${p.status === 'team' ? 'selected' : ''}>Feld</option>
                    <option value="bank" ${p.status === 'bank' ? 'selected' : ''}>Bank</option>
                </select>
                <button onclick="addPoint(${p.id}, 'tech')" style="font-size:0.8em; border:none; background:#eee; cursor:pointer; border-radius:4px;">⚽</button>
                <button onclick="addPoint(${p.id}, 'scan')" style="font-size:0.8em; border:none; background:#eee; cursor:pointer; border-radius:4px;">👁️</button>
            </div>
        `;
        container.appendChild(div);
    });
}

/**
 * Performance-Monitoring: Punkte vergeben & Speichern
 */
function addPoint(id, category) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player.points[category]++;
        renderSquad();
        if (typeof saveSquadData === "function") saveSquadData();
        if (typeof toniSpeak === "function") {
            const catLabel = category === 'tech' ? 'Technik' : 'Scanning';
            toniSpeak(`Klasse Aktion von ${player.name}! Ein Punkt für ${catLabel}.`);
        }
    }
}

/**
 * Status-Wechsel: Feld, Bank oder Abwesend
 */
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

/**
 * Taktischer Reset: Alle Spieler auf Grundpositionen
 */
function resetBoardPositions() {
    if (typeof drawBoard === "function") drawBoard();
    if (typeof toniSpeak === "function") {
        toniSpeak("Alles wieder in Reih und Glied, Björn. Taktische Grundordnung ist wiederhergestellt.");
    }
}

/**
 * Neuen Spieler über Prompt hinzufügen
 */
function addNewPlayerPrompt() {
    const name = prompt("Name des neuen Spielers:");
    const nr = prompt("Trikotnummer:");
    if (name && nr) {
        const newId = squad.length > 0 ? Math.max(...squad.map(p => p.id)) + 1 : 1;
        squad.push({ id: newId, nr: parseInt(nr), name: name, pos: "ZM", active: true, status: "team", points: { tech: 0, scan: 0, team: 0 }, hasBall: false });
        renderSquad();
        if (typeof drawBoard === "function") drawBoard();
        if (typeof saveSquadData === "function") saveSquadData();
    }
}

// Initialer Aufruf
document.addEventListener('DOMContentLoaded', () => {
    renderSquad();
});
