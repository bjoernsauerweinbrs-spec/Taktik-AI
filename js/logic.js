// Kader-Zustand
let squad = [
    { id: 1, nr: 8, name: "Thorsten", pos: "ST", active: true, status: "team", color: "var(--red-team)" },
    { id: 2, nr: 99, name: "David Luiz", pos: "IV", active: true, status: "team", color: "var(--red-team)" }
];

// Gegner-Zustand (Team Blau - nur Nummern)
let opponents = [
    { id: 101, nr: 1, pos: "TW_B" }, { id: 102, nr: 4, pos: "IV_B" }, { id: 103, nr: 5, pos: "IV_B2" }
    // Wird automatisch für 3-4-3 erweitert
];

// Koordinaten-Mapping (Prozentual)
const formations = {
    "4-4-2": {
        "TW": {x: 8, y: 50}, "IV": {x: 25, y: 35}, "IV2": {x: 25, y: 65},
        "LV": {x: 30, y: 15}, "RV": {x: 30, y: 85}, "ST": {x: 80, y: 40}, "ST2": {x: 80, y: 60}
        // Weitere Positionen folgen...
    },
    "3-4-3_BLUE": {
        "TW_B": {x: 92, y: 50}, "IV_B": {x: 75, y: 50}, "IV_B2": {x: 75, y: 25}, "IV_B3": {x: 75, y: 75}
        // Weitere Positionen folgen...
    }
};

function updatePlayerStatus(id, key, value) {
    const player = squad.find(p => p.id === id);
    if (player) {
        player[key] = value;
        renderSquad(); // Neu zeichnen
        drawBoard();   // Board aktualisieren
    }
}
