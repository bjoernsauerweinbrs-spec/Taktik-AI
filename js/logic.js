/* --- LOGIC.JS: FLEXIBLE SPIELSTANDS-KI --- */

let coachName = "Björn";
let currentFormationBlue = { /* Standard 4-4-2 Anker */
    'B1': {x: 740, y: 235}, 'B2': {x: 620, y: 150}, 'B3': {x: 620, y: 320},
    'B4': {x: 680, y: 235}, 'B5': {x: 600, y: 430}, 'B6': {x: 480, y: 235},
    'B7': {x: 400, y: 100}, 'B8': {x: 400, y: 370}, 'B9': {x: 280, y: 80},
    'B10': {x: 280, y: 390}, 'B11': {x: 180, y: 235}
};

// 1. DYNAMISCHE SPIELSTAND-ERKENNUNG
window.askToni = async function() {
    const input = document.getElementById('user-input').value;
    
    // Regulärer Ausdruck sucht nach Zahlen wie "2:1" oder "3-0"
    const scoreMatch = input.match(/(\d+)[\s:-]+(\d+)/);
    
    if (scoreMatch) {
        const scoreUser = parseInt(scoreMatch[1]); // Dein Spielstand
        const scoreToni = parseInt(scoreMatch[2]); // Tonis Spielstand
        const diff = scoreToni - scoreUser; // Differenz aus Tonis Sicht

        if (diff <= -3) {
            // Toni liegt mit 3 oder mehr Toren hinten -> Totaler Angriff
            applyTacticalShift("extreme-attack");
            addMsg('toni', `Coach ${coachName}, bei einem ${scoreUser}:${scoreToni} gegen mich gibt es kein Halten mehr. Ich löse alles auf und werfe meine brasilianische Technik komplett nach vorne!`);
        } else if (diff < 0) {
            // Toni liegt knapp hinten -> Offensiver Druck
            applyTacticalShift("light-attack");
            addMsg('toni', `Das ${scoreUser}:${scoreToni} gefällt mir nicht. Ich schiebe meine Kette 15 Meter weiter vor, um dich früher zu stören.`);
        } else if (diff >= 2) {
            // Toni führt sicher -> Defensiv & Kompakt
            applyTacticalShift("heavy-defense");
            addMsg('toni', `Ich führe ${scoreToni}:${scoreUser}. Ich ziehe meine Jungs tief an den eigenen Strafraum. Komm erst mal an Hummels und Kahn vorbei!`);
        } else {
            // Unentschieden oder knappe Führung -> Standard
            applyTacticalShift("standard");
            addMsg('toni', `Ein ${scoreUser}:${scoreToni} ist ein enges Ding. Wir bleiben bei unserer taktischen Grundordnung.`);
        }
    }

    // Original-Aufruf an die KI (Groq), damit er auch darüber redet
    if (typeof originalAskToni === 'function') await originalAskToni();
};

// 2. TAKTISCHE VERSCHIEBUNG DER ANKER
function applyTacticalShift(mode) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    bluePlayers.forEach(p => {
        let shiftX = 0;
        let spreadY = 1;

        if (mode === "extreme-attack") { shiftX = -150; spreadY = 1.2; }
        if (mode === "light-attack") { shiftX = -70; spreadY = 1.1; }
        if (mode === "heavy-defense") { shiftX = 80; spreadY = 0.8; }
        if (mode === "standard") { shiftX = 0; spreadY = 1.0; }

        // Wir holen die Basis-Koordinate und modifizieren sie
        // Ein negativer shiftX bewegt Team Blau nach LINKS (Angriff auf Björn)
        // spreadY verändert die Breite der Formation
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);
        let targetX = curX + shiftX;
        
        // Grenzen einhalten (Nicht hinter das Tor rennen)
        targetX = Math.max(50, Math.min(targetX, 800));

        p.style.transition = "all 1.5s ease-in-out";
        p.style.left = targetX + "px";
        
        // Pfeile für die Umstellung zeichnen
        drawArrow(curX + 30, curY + 20, targetX + 30, curY + 20, '#3498db', false);
    });
}

// 3. ANALYSE (BALLORIENTIERT - BLEIBT BESTEHEN)
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    clearArrows();

    // Passwege für Team Rot
    const owner = findBallOwner(ballX, ballY);
    if (owner && owner.classList.contains('red')) {
        calculatePassLanes(owner, ballX, ballY);
        // Kleine ballorientierte Korrektur der Blauen
        shiftTeamBlueDynamic(ballX, ballY);
    }
}

// HILFSFUNKTIONEN (Wie gehabt, aber robust)
function findBallOwner(bx, by) {
    let owner = null; let minD = 70;
    document.querySelectorAll('.player-wrapper').forEach(p => {
        const d = Math.sqrt(Math.pow((parseInt(p.style.left)+30)-bx, 2) + Math.pow((parseInt(p.style.top)+25)-by, 2));
        if (d < minD) { owner = p; minD = d; }
    });
    return owner;
}

function drawArrow(x1, y1, x2, y2, color, isDashed) {
    const svg = document.getElementById('tactical-arrows');
    if (!svg) return;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", color); line.setAttribute("stroke-width", "3");
    if (isDashed) line.setAttribute("stroke-dasharray", "8,4");
    const mId = `arrowhead-${color.replace('#','')}`;
    line.setAttribute("marker-end", `url(#${mId})`);
    if (!document.getElementById(mId)) createMarker(mId, color);
    svg.appendChild(line);
}

function createMarker(id, color) {
    const svg = document.getElementById('tactical-arrows');
    let defs = svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
    if (!svg.querySelector('defs')) svg.appendChild(defs);
    const m = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    m.setAttribute("id", id); m.setAttribute("viewBox", "0 0 10 10");
    m.setAttribute("refX", "9"); m.setAttribute("refY", "5");
    m.setAttribute("markerWidth", "5"); m.setAttribute("markerHeight", "5");
    m.setAttribute("orient", "auto");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "M 0 0 L 10 5 L 0 10 z"); p.setAttribute("fill", color);
    m.appendChild(p); defs.appendChild(m);
}

function clearArrows() { document.getElementById('tactical-arrows').innerHTML = ''; }
