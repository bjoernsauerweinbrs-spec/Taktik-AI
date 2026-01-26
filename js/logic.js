/* --- LOGIC.JS: DAS TAKTISCHE GEHIRN --- */

// 1. ANALYSE DER SPIELSITUATION
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    
    // Vor jeder neuen Analyse alte Pfeile entfernen
    clearArrows();

    // Wer ist am Ball?
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDistance = 60; // Fangradius für den Ballbesitz

    players.forEach(p => {
        const px = parseInt(p.style.left) + 25; // Zentrum des Spielers
        const py = parseInt(p.style.top) + 25;
        const distance = Math.sqrt(Math.pow(px - ballX, 2) + Math.pow(py - ballY, 2));
        
        if (distance < minDistance) {
            owner = p;
            minDistance = distance;
        }
    });

    if (owner) {
        const team = owner.classList.contains('red') ? 'Besucher' : 'Toni';
        const name = owner.querySelector('.player-circle').innerText;
        
        if (team === 'Besucher') {
            handleUserAttack(owner, ballX, ballY);
        } else {
            handleToniAttack(owner, ballX, ballY);
        }
    }
}

// 2. REAKTION: DER BENUTZER GREIFT AN (TEAM ROT)
function handleUserAttack(player, bx, by) {
    const name = player.querySelector('.player-circle').innerText;
    
    // Taktische Logik basierend auf der Ballposition
    if (by < 180) { // Ball auf dem linken Flügel
        addMsg('toni', `Analyse: ${name} zieht das Spiel über links auf. Mein blauer Verteidiger rückt ein. Mein Vorschlag: Dein zentraler Stürmer sollte jetzt in den 16er kreuzen!`);
        drawArrow(bx, by, bx + 150, by + 50, '#2ecc71'); // Offensiv-Pfeil (Grün)
    } 
    else if (bx > 550) { // Ball tief in der gegnerischen Hälfte
        addMsg('toni', `Gefährliche Zone! ${name} ist im Angriffsdrittel. Achtung: Die Absicherung durch David Luiz muss jetzt stehen, falls der Konter kommt.`);
        drawArrow(150, 250, 200, 300, '#e74c3c'); // Defensiv-Pfeil (Rot)
    } 
    else {
        addMsg('toni', `${name} kontrolliert das Mittelfeld. Wir verschieben asymmetrisch, um die Passwege zuzustellen.`);
    }
}

// 3. REAKTION: TONI GREIFT AN (TEAM BLAU)
function handleToniAttack(player, bx, by) {
    const name = player.querySelector('.player-circle').innerText;
    addMsg('toni', `Ich (Toni) starte den Gegenangriff über ${name}. Deine Defensive steht zu weit auseinander – mach das Zentrum dicht!`);
    drawArrow(bx, by, bx - 120, by + 40, '#3498db'); // Gegner-Pfeil (Blau)
}

// 4. GRAFIK-ENGINE: TAKTISCHE PFEILE (SVG)
function drawArrow(x1, y1, x2, y2, color) {
    const svg = document.getElementById('tactical-arrows');
    if (!svg) return;

    const newArrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newArrow.setAttribute("x1", x1);
    newArrow.setAttribute("y1", y1);
    newArrow.setAttribute("x2", x2);
    newArrow.setAttribute("y2", y2);
    newArrow.setAttribute("stroke", color);
    newArrow.setAttribute("stroke-width", "4");
    newArrow.setAttribute("marker-end", "url(#arrowhead)");
    
    // Pfeilspitze (Marker) definieren, falls nicht vorhanden
    if (!document.getElementById('arrowhead')) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "arrowhead");
        marker.setAttribute("markerWidth", "10");
        marker.setAttribute("markerHeight", "7");
        marker.setAttribute("refX", "9");
        marker.setAttribute("refY", "3.5");
        marker.setAttribute("orient", "auto");
        
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
        polygon.setAttribute("fill", color); // Farbe wird später dynamisch angepasst
        
        marker.appendChild(polygon);
        defs.appendChild(marker);
        svg.appendChild(defs);
    }

    svg.appendChild(newArrow);
}

function clearArrows() {
    const svg = document.getElementById('tactical-arrows');
    if (svg) svg.innerHTML = '';
}

// 5. KADER-MANAGEMENT (NAME & NUMMER EDITIEREN)
function openKaderManager() {
    const modal = document.getElementById('kader-modal');
    const list = document.getElementById('kader-list');
    if (!modal || !list) return;

    modal.style.display = 'flex';
    list.innerHTML = '';

    const redPlayers = document.querySelectorAll('.player-wrapper.red');
    redPlayers.forEach(p => {
        const currentName = p.querySelector('.player-circle').innerText;
        const currentNr = p.querySelector('.player-label').innerText;
        
        const item = document.createElement('div');
        item.className = 'kader-item';
        item.style.marginBottom = "10px";
        item.innerHTML = `
            <input type="text" value="${currentName}" onchange="updatePlayerData('${p.id}', this.value, 'name')">
            <input type="text" value="${currentNr}" style="width: 40px;" onchange="updatePlayerData('${p.id}', this.value, 'nr')">
        `;
        list.appendChild(item);
    });
}

function updatePlayerData(id, value, type) {
    const playerEl = document.getElementById(id);
    if (!playerEl) return;

    if (type === 'name') {
        playerEl.querySelector('.player-circle').innerText = value.toUpperCase();
    } else {
        playerEl.querySelector('.player-label').innerText = value;
    }
}

function closeKaderManager() {
    document.getElementById('kader-modal').style.display = 'none';
}

// 6. PDF EXPORT PLACEHOLDER
function exportPlanPDF() {
    alert("Trainingsplan-Export: Alle taktischen Laufwege von Toni werden in die PDF übertragen...");
}
