/* --- LOGIC.JS: TAKTIK-KI MIT ZONEN-VERTEIDIGUNG --- */

let coachName = "Trainer";

// 1. LOGIN & TRAINER-NAME
function startToni() {
    const nameInput = document.getElementById('trainer-name-input');
    const loginOverlay = document.getElementById('login-overlay');
    const benchLabel = document.getElementById('trainer-bench-label');

    if (nameInput && nameInput.value.trim() !== "") {
        coachName = nameInput.value.trim();
        if (benchLabel) benchLabel.innerText = `BANK TEAM ${coachName.toUpperCase()}`;
    }
    if (loginOverlay) loginOverlay.style.display = 'none';
    
    addMsg('toni', `Coach ${coachName}, ich habe die Abwehrkette von Team Blau neu eingestellt. Wir spielen jetzt eine ballorientierte Raumdeckung. Analysiere deine Passwege!`);
}

// 2. HAUPTANALYSE (Wird bei jedem Drop von Ball/Spieler aufgerufen)
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    
    clearArrows();

    // Wer hat den Ball?
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDistance = 70;

    players.forEach(p => {
        const px = parseInt(p.style.left) + 30;
        const py = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(px - ballX, 2) + Math.pow(py - ballY, 2));
        if (dist < minDistance) { owner = p; minDistance = dist; }
    });

    if (owner && owner.classList.contains('red')) {
        const name = owner.querySelector('.player-circle').innerText;
        
        // A) Passwege für Team Rot berechnen
        calculatePassOptions(owner, ballX, ballY);
        
        // B) Team Blau verschiebt sich intelligent (KEIN HAUFEN MEHR)
        intelligentShiftBlue(ballX, ballY);
        
        addMsg('toni', `Analyse für ${name}: Passoptionen sind grün markiert. Team Blau verschiebt in der Kette (blaue Pfeile), um die Räume eng zu machen.`);
    }
}

// 3. PASSWEG-ANALYSE (GRÜNE PFEILE)
function calculatePassOptions(owner, bx, by) {
    const teammates = document.querySelectorAll('.player-wrapper.red');
    
    teammates.forEach(p => {
        if (p.id === owner.id) return;

        const tx = parseInt(p.style.left) + 30;
        const ty = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(tx - bx, 2) + Math.pow(ty - by, 2));

        // Nur sinnvolle Pässe im Umkreis anzeigen
        if (dist > 50 && dist < 400) {
            drawArrow(bx + 15, by + 10, tx, ty, '#2ecc71', true); 
        }
    });
}

// 4. INTELLIGENTE VERSCHIEBUNG BLAU (ZONEN-LOGIK)
function intelligentShiftBlue(ballX, ballY) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    bluePlayers.forEach(p => {
        // Wir holen uns die aktuelle Position
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);
        
        // ZONEN-LOGIK: Spieler rückt nur maximal 60px von seiner Position zum Ball
        // Das verhindert, dass alle auf einen Haufen rennen.
        let moveX = (ballX - curX) * 0.12; 
        let moveY = (ballY - curY) * 0.12;

        // Begrenzung der Verschiebung pro Spielzug
        moveX = Math.max(-60, Math.min(60, moveX));
        moveY = Math.max(-60, Math.min(60, moveY));

        let targetX = curX + moveX;
        let targetY = curY + moveY;

        // Blauen Laufweg-Pfeil zeichnen
        drawArrow(curX + 30, curY + 20, targetX + 30, targetY + 20, '#3498db', false);

        // Spieler sanft bewegen
        p.style.transition = "all 0.8s ease-in-out";
        p.style.left = targetX + "px";
        p.style.top = targetY + "px";
    });
}

// 5. GRAFIK: PFEILE ZEICHNEN
function drawArrow(x1, y1, x2, y2, color, isDashed) {
    const svg = document.getElementById('tactical-arrows');
    if (!svg) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", color);
    line.setAttribute("stroke-width", "3");
    if (isDashed) line.setAttribute("stroke-dasharray", "8,4");
    
    const markerId = `arrowhead-${color.replace('#', '')}`;
    line.setAttribute("marker-end", `url(#${markerId})`);
    
    if (!document.getElementById(markerId)) {
        createMarker(markerId, color);
    }
    svg.appendChild(line);
}

function createMarker(id, color) {
    const svg = document.getElementById('tactical-arrows');
    let defs = svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.appendChild(defs);
    
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

// 6. KADER-MANAGEMENT (NAME & NUMMER)
function openKaderManager() {
    const modal = document.getElementById('kader-modal');
    const list = document.getElementById('kader-list');
    modal.style.display = 'flex';
    list.innerHTML = '';

    document.querySelectorAll('.player-wrapper.red').forEach(p => {
        const name = p.querySelector('.player-circle').innerText;
        const nr = p.querySelector('.player-label').innerText;
        const item = document.createElement('div');
        item.className = 'kader-item';
        item.innerHTML = `
            <input type="text" value="${name}" onchange="updatePlayer('${p.id}', this.value, 'name')">
            <input type="text" value="${nr}" style="width:40px;" onchange="updatePlayer('${p.id}', this.value, 'nr')">
        `;
        list.appendChild(item);
    });
}

function updatePlayer(id, val, type) {
    const p = document.getElementById(id);
    if (type === 'name') p.querySelector('.player-circle').innerText = val.toUpperCase();
    else p.querySelector('.player-label').innerText = val;
}

function closeKaderManager() { document.getElementById('kader-modal').style.display = 'none'; }
function exportPlanPDF() { alert("Exportiere Taktik-Analyse..."); }
