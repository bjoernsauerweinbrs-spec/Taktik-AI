/* --- LOGIC.JS: TAKTIK-KI MIT FORMATIONS-DISZIPLIN --- */

let coachName = "Björn"; // Standardmäßig Björn, wird durch Login überschrieben

// 1. SYSTEM START & TRAINER-NAME
function startToni() {
    const nameInput = document.getElementById('trainer-name-input');
    const loginOverlay = document.getElementById('login-overlay');
    const benchLabel = document.getElementById('trainer-bench-label');

    if (nameInput && nameInput.value.trim() !== "") {
        coachName = nameInput.value.trim();
        if (benchLabel) benchLabel.innerText = `BANK TEAM ${coachName.toUpperCase()}`;
    }
    
    if (loginOverlay) loginOverlay.style.display = 'none';
    
    addMsg('toni', `System bereit. Coach ${coachName}, ich habe die Formationen analysiert. Team Blau hält jetzt die Räume diszipliniert besetzt.`);
}

// 2. HAUPTANALYSE (Wird nach jeder Bewegung aufgerufen)
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
        
        // Passwege für Team Rot (Björn) berechnen
        calculatePassLanes(owner, ballX, ballY);
        
        // Team Blau verschiebt diszipliniert (Formation bleibt gewahrt)
        tacticalShiftBlue(ballX, ballY);
        
        addMsg('toni', `Analyse: ${name} am Ball. Ich schlage drei Passwege vor (grün). Mein Team Blau verschiebt ballorientiert, hält aber die Kette (blaue Pfeile).`);
    }
}

// 3. PASSWEG-BERECHNUNG (GRÜN GESTRICHELT)
function calculatePassLanes(owner, bx, by) {
    const teammates = document.querySelectorAll('.player-wrapper.red');
    
    teammates.forEach(p => {
        if (p.id === owner.id) return;

        const tx = parseInt(p.style.left) + 30;
        const ty = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(tx - bx, 2) + Math.pow(ty - by, 2));

        // Nur sinnvolle Pässe im Umkreis von 400px vorschlagen
        if (dist > 60 && dist < 400) {
            drawArrow(bx + 10, by + 10, tx, ty, '#2ecc71', true); 
        }
    });
}

// 4. DISZIPLINIERTES VERSCHIEBEN (BLAU)
function tacticalShiftBlue(ballX, ballY) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    // Anker-Positionen aus dem squad-Array in board.js (als Fallback)
    const anchors = {
        'B1': {x: 740, y: 235}, 'B2': {x: 620, y: 150}, 'B3': {x: 620, y: 320},
        'B4': {x: 680, y: 235}, 'B5': {x: 600, y: 430}, 'B6': {x: 480, y: 235},
        'B7': {x: 400, y: 100}, 'B8': {x: 400, y: 370}, 'B9': {x: 280, y: 80},
        'B10': {x: 280, y: 390}, 'B11': {x: 180, y: 235}
    };

    bluePlayers.forEach(p => {
        const anchor = anchors[p.id] || { x: parseInt(p.style.left), y: parseInt(p.style.top) };
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);

        // Berechnung: Spieler bewegt sich nur 15% weg von seinem ANKER in Richtung Ball
        // Das sorgt dafür, dass die Kette niemals zerreißt.
        let targetX = anchor.x + (ballX - anchor.x) * 0.15;
        let targetY = anchor.y + (ballY - anchor.y) * 0.15;

        // Blauen Laufweg-Pfeil einzeichnen (Von-Zu Bewegung)
        drawArrow(curX + 30, curY + 20, targetX + 30, targetY + 20, '#3498db', false);

        // Tatsächliche Bewegung
        p.style.transition = "all 0.8s ease-in-out";
        p.style.left = targetX + "px";
        p.style.top = targetY + "px";
    });
}

// 5. GRAFIK-ENGINE FÜR PFEILE
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
        const defs = svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
        if (!svg.querySelector('defs')) svg.appendChild(defs);
        
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", markerId);
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
    svg.appendChild(line);
}

function clearArrows() {
    const svg = document.getElementById('tactical-arrows');
    if (svg) svg.innerHTML = '';
}

// 6. MODAL & KADER STEUERUNG
function openKaderManager() {
    const modal = document.getElementById('kader-modal');
    const list = document.getElementById('kader-list');
    modal.style.display = 'flex';
    list.innerHTML = '';
    document.querySelectorAll('.player-wrapper.red').forEach(p => {
        const n = p.querySelector('.player-circle').innerText;
        const nr = p.querySelector('.player-label').innerText;
        list.innerHTML += `<div style="margin-bottom:8px;"><input value="${n}" onchange="updateP('${p.id}',this.value,'name')"> <input value="${nr}" style="width:40px;" onchange="updateP('${p.id}',this.value,'nr')"></div>`;
    });
}
function updateP(id, v, t) {
    const el = document.getElementById(id);
    if(t==='name') el.querySelector('.player-circle').innerText = v.toUpperCase();
    else el.querySelector('.player-label').innerText = v;
}
function closeKaderManager() { document.getElementById('kader-modal').style.display = 'none'; }
