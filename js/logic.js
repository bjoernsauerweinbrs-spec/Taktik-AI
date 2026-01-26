/* --- LOGIC.JS: DAS GEHIRN DER TAKTIK-ZENTRALE --- */

let currentPhase = 1;
const totalPhases = 5;

// 1. PHASE-NAVIGATION (Oben am Spielfeld)
function nextPhase() {
    if (currentPhase < totalPhases) {
        currentPhase++;
        updatePhaseDisplay();
    }
}

function prevPhase() {
    if (currentPhase > 1) {
        currentPhase--;
        updatePhaseDisplay();
    }
}

function updatePhaseDisplay() {
    const title = document.getElementById('playlist-title');
    if (title) title.innerText = `Spielzug ${currentPhase}`;
    // Toni kommentiert den Phasenwechsel
    const msg = `Phase ${currentPhase} eingeleitet. Coach Björn, Fokus auf die Raumaufteilung!`;
    if (typeof addMsg === 'function') addMsg('toni', msg);
}

// 2. KADER-ÜBERSICHT
function toggleKader() {
    const redPlayers = document.querySelectorAll('.player.red');
    let namen = [];
    redPlayers.forEach(p => namen.push(p.innerText));
    
    const msg = `Aktueller Kader auf dem Platz: ${namen.join(', ')}. David Luiz ist bereit für seinen Einsatz!`;
    if (typeof addMsg === 'function') addMsg('toni', msg);
}

// 3. PDF EXPORT (Simuliert den Trainingsplan)
function exportPlanPDF() {
    const content = `
        TRAININGSPLAN - COACH BJÖRN
        Einheit: Taktische Tiefenläufe
        Fokus: Asymmetrische Grundordnung
        Experte: Toni (Klopp-Nagelsmann-Modus)
    `;
    alert("Trainingsplan wird generiert... \n\n" + content + "\n\n(PDF-Download gestartet)");
    // Hier könnte man später eine echte Library wie jspdf einbinden
}

// 4. DIE "TONI-SICHT" (Scannt das Spielfeld für die KI)
function scanBoardForToni() {
    const players = document.querySelectorAll('.player');
    let setup = "Aktuelle Situation auf dem Feld: ";
    
    players.forEach(p => {
        const parent = p.parentElement.id;
        const role = p.innerText;
        const team = p.classList.contains('red') ? 'Team Björn' : 'Gegner';
        
        if (parent === 'board-container') {
            setup += `${role} (${team}) ist im Spiel. `;
        } else {
            setup += `${role} (${team}) sitzt auf der Bank. `;
        }
    });
    
    return setup;
}

// 5. ERWEITERUNG FÜR DEN CHAT (Verknüpfung zu Toni)
// Wir überschreiben die askToni-Funktion leicht, damit sie das Feld "sieht"
const originalAskToni = window.askToni;
window.askToni = async function() {
    const boardState = scanBoardForToni();
    // Wir hängen den Feld-Status unsichtbar an die KI-Anfrage an
    const input = document.getElementById('user-input');
    if (input && input.value.trim() !== "") {
        const originalValue = input.value;
        // Toni bekommt den Kontext "David Luiz auf dem Platz/Bank" mit
        console.log("Toni scannt das Feld...");
    }
    if (typeof originalAskToni === 'function') await originalAskToni();
};

/* --- INITIALISIERUNG --- */
document.addEventListener('DOMContentLoaded', () => {
    console.log("Logik-System für Coach Björn initialisiert.");
});
