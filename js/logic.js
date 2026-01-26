/* --- LOGIC.JS: ANALYSE & TRAINER-LOGIK --- */

let coachName = "Trainer";

// 1. SYSTEM INITIALISIEREN & NAME ÜBERNEHMEN
function startToni() {
    const nameInput = document.getElementById('trainer-name-input');
    const loginOverlay = document.getElementById('login-overlay');
    const benchLabel = document.getElementById('trainer-bench-label');

    if (nameInput && nameInput.value.trim() !== "") {
        coachName = nameInput.value.trim();
        if (benchLabel) benchLabel.innerText = `BANK TEAM ${coachName.toUpperCase()}`;
    }

    // Login ausblenden
    if (loginOverlay) loginOverlay.style.display = 'none';
    
    addMsg('toni', `Willkommen an der Seitenlinie, Coach ${coachName}! Das System ist bereit. Team Rot hört auf dein Kommando.`);
}

// 2. ANALYSE DER SITUATION (Wird nach jedem Zug aufgerufen)
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    
    clearArrows();

    // Wer ist am Ball?
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDistance = 70;

    players.forEach(p => {
        const px = parseInt(p.style.left) + 30;
        const py = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(px - ballX, 2) + Math.pow(py - ballY, 2));
        
        if (dist < minDistance) {
            owner = p;
            minDistance = dist;
        }
    });

    if (owner) {
        const team = owner.classList.contains('red') ? 'Besucher' : 'Toni';
        const name = owner.querySelector('.player-circle').innerText;
        
        if (team === 'Besucher') {
            handleUserAction(name, ballX, ballY);
            // Blau verschiebt sich defensiv
            shiftTeamBlue(ballX, ballY);
        }
    }
}

// 3. TONIS TAKTISCHE REAKTION & PFEILE
function handleUserAction(playerName, bx, by) {
    // Beispiel: Ball auf dem Flügel (Y-Achse oben < 150 oder unten > 400)
    if (by < 150 || by > 400) {
        const seite = by < 150 ? "linken" : "rechten";
        addMsg('toni', `Coach ${coachName}, ${playerName} hat den Ball auf der ${seite} Außenbahn! Ich ziehe meine Kette eng zusammen. Mein Vorschlag: Ein Tiefenlauf in den Halbraum!`);
        
        // Zeichne Vorschlags-Pfeil (Grün)
        const targetX = bx + 150;
        const targetY = (by < 150) ? by + 80 : by - 80;
        drawArrow(bx + 30, by + 20, targetX, targetY, '#2ecc71');
    } 
    else if (bx > 500) {
        addMsg('toni', `Wir sind im Angriffsdrittel! Die blauen Verteidiger orientieren sich jetzt zum Ball. Achte auf die Konterabsicherung.`);
        drawArrow(bx, by, 750, 275, '#2ecc71');
    }
}

// 4. TEAM BLAU BEWEGT SICH AUTOMATISCH
function shiftTeamBlue(ballX, ballY) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    bluePlayers.forEach(p => {
        // Die Blauen rücken ein Stück in Richtung Ball
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);
        
        // Berechne Verschiebung (leicht verzögert durch CSS Transition)
        let diffX = (ballX - curX) * 0.05;
        let diffY = (ballY - curY) * 0.05;
        
        p.style.transition = "all 1s ease-in-out";
        p.style.left = (curX + diffX) + "px";
        p.style.top = (curY + diffY) + "px";
    });
}

// 5. GRAFIK: TAKTISCHE PFEILE ZEICHNEN
function drawArrow(x1, y1, x2, y2, color) {
    const svg = document.getElementById('tactical-arrows');
    if (!svg) return;

    // Pfeil-Linie
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "5");
    line.setAttribute("marker-end", "url(#arrowhead)");
    line.setAttribute("stroke-dasharray", "10,5"); // Gestrichelter Laufweg
    
    // Pfeilspitze (Marker)
    if (!document.getElementById('arrowhead')) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("viewBox", "0 0 10 10");
        marker.setAttribute("refX", "8");
        marker.setAttribute("refY", "5");
        marker.setAttribute("markerWidth", "6");
        marker.setAttribute("markerHeight", "6");
        marker.setAttribute("orient", "auto-start-reverse");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
        path.setAttribute("fill", color);
        
        marker.appendChild(path);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }

    svg.appendChild(line);
}

function clearArrows() {
    const svg = document.getElementById('tactical-arrows');
    if (svg) svg.innerHTML = '';
}

// KADER MANAGER & PDF EXPORT
function openKaderManager() { document.getElementById('kader-modal').style.display = 'flex'; /* (Logik wie gehabt) */ }
function closeKaderManager() { document.getElementById('kader-modal').style.display = 'none'; }
function exportPlanPDF() { alert("Trainingsplan wird generiert..."); }
