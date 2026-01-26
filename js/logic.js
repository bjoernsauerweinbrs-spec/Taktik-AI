/* --- LOGIC.JS: TAKTIK-EXPERTEN-MODUS --- */

let coachName = "Trainer";

function startToni() {
    const nameInput = document.getElementById('trainer-name-input');
    const loginOverlay = document.getElementById('login-overlay');
    const benchLabel = document.getElementById('trainer-bench-label');

    if (nameInput && nameInput.value.trim() !== "") {
        coachName = nameInput.value.trim();
        if (benchLabel) benchLabel.innerText = `BANK TEAM ${coachName.toUpperCase()}`;
    }
    if (loginOverlay) loginOverlay.style.display = 'none';
    addMsg('toni', `System online. Coach ${coachName}, ich habe mich kurz in die aktuellen Taktik-Analysen von Klopp und Nagelsmann eingelesen. Wir sind bereit für die Analyse!`);
}

// HAUPTANALYSE
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    
    clearArrows();

    // 1. Besitzer finden
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDistance = 70;

    players.forEach(p => {
        const px = parseInt(p.style.left) + 30;
        const py = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(px - ballX, 2) + Math.pow(py - ballY, 2));
        if (dist < minDistance) { owner = p; minDistance = dist; }
    });

    if (owner) {
        const team = owner.classList.contains('red') ? 'Besucher' : 'Toni';
        const name = owner.querySelector('.player-circle').innerText;
        
        if (team === 'Besucher') {
            // Toni analysiert Passwege für Team Rot
            calculatePassingLanes(owner, ballX, ballY);
            // Toni verschiebt Team Blau und zeichnet deren Laufwege ein
            shiftTeamBlue(ballX, ballY);
            
            addMsg('toni', `Analyse für ${name}: Ich habe drei Passoptionen berechnet. Team Blau verschiebt sich ballorientiert – achte auf die blauen Laufweg-Pfeile der Gegner!`);
        }
    }
}

// BERECHNET PASSWEGE ZU MITSPRILERN
function calculatePassingLanes(owner, bx, by) {
    const teammates = document.querySelectorAll('.player-wrapper.red');
    
    teammates.forEach(p => {
        if (p.id === owner.id) return; // Nicht zu sich selbst passen

        const tx = parseInt(p.style.left) + 30;
        const ty = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(tx - bx, 2) + Math.pow(ty - by, 2));

        // Nur Pässe in Reichweite (z.B. 300px) vorschlagen
        if (dist < 350) {
            drawArrow(bx + 15, by + 10, tx, ty, '#2ecc71', true); // Grüner Pass-Pfeil
        }
    });
}

// BLAU VERSCHIEBT SICH UND ZEIGT LAUFWEGE
function shiftTeamBlue(ballX, ballY) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    bluePlayers.forEach(p => {
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);
        
        // Zielposition berechnen (etwas näher zum Ball)
        let targetX = curX + (ballX - curX) * 0.08;
        let targetY = curY + (ballY - curY) * 0.08;

        // Blauen Laufweg-Pfeil zeichnen (Von Wo -> Nach Wo)
        drawArrow(curX + 30, curY + 20, targetX + 30, targetY + 20, '#3498db', false);

        // Spieler bewegen
        p.style.transition = "all 1s ease-in-out";
        p.style.left = targetX + "px";
        p.style.top = targetY + "px";
    });
}

// ERWEITERTE PFEIL-LOGIK FÜR FARBEN
function drawArrow(x1, y1, x2, y2, color, isDashed) {
    const svg = document.getElementById('tactical-arrows');
    if (!svg) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "3");
    if (isDashed) line.setAttribute("stroke-dasharray", "8,4");
    
    // Dynamischer Marker-End (für verschiedene Farben)
    const markerId = `arrowhead-${color.replace('#', '')}`;
    line.setAttribute("marker-end", `url(#${markerId})`);
    
    if (!document.getElementById(markerId)) {
        createMarker(markerId, color);
    }

    svg.appendChild(line);
}

function createMarker(id, color) {
    const svg = document.getElementById('tactical-arrows');
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        svg.appendChild(defs);
    }
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", id);
    marker.setAttribute("viewBox", "0 0 10 10");
    marker.setAttribute("refX", "9"); marker.setAttribute("refY", "5");
    marker.setAttribute("markerWidth", "5"); marker.setAttribute("markerHeight", "5");
    marker.setAttribute("orient", "auto");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
    path.setAttribute("fill", color);
    marker.appendChild(path);
    defs.appendChild(marker);
}

function clearArrows() {
    const svg = document.getElementById('tactical-arrows');
    if (svg) svg.innerHTML = '';
}
