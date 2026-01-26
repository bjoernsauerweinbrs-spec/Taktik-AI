/* --- LOGIC.JS: TAKTIK-KI & CHAT-INTERFACE --- */

let coachName = "Björn";
let currentFormationMode = "standard";

// 1. SYSTEM-START (Wird vom Login-Button gerufen)
function startToni() {
    const nameInput = document.getElementById('trainer-name-input');
    const loginOverlay = document.getElementById('login-overlay');
    const benchLabel = document.getElementById('trainer-bench-label');

    if (nameInput && nameInput.value.trim() !== "") {
        coachName = nameInput.value.trim();
        if (benchLabel) benchLabel.innerText = `BANK TEAM ${coachName.toUpperCase()}`;
    }
    
    if (loginOverlay) loginOverlay.style.display = 'none';
    
    addMsg('toni', `Tudo bem, Coach ${coachName}! Ich bin bereit. Bewege den Ball oder deine Spieler, und ich sage dir, was ich davon halte. Du kannst mir auch Spielstände nennen!`);
}

// 2. CHAT-FUNKTION (REPARIERT)
async function askToni() {
    const inputField = document.getElementById('user-input');
    const text = inputField.value.trim();
    if (!text) return;

    // Nachricht im Chat anzeigen
    addMsg('user', text);
    inputField.value = '';

    // A) Spielstand-Erkennung (Dynamisch)
    const scoreMatch = text.match(/(\d+)[\s:-]+(\d+)/);
    if (scoreMatch) {
        const scoreUser = parseInt(scoreMatch[1]);
        const scoreToni = parseInt(scoreMatch[2]);
        handleScoreChange(scoreUser, scoreToni);
    } 
    // B) Allgemeine Taktik-Anfrage
    else {
        // Hier simulieren wir die KI-Antwort basierend auf Tonis Fußball-Wissen
        setTimeout(() => {
            addMsg('toni', `Interessanter Punkt, Björn. Taktisch gesehen würde ein brasilianischer Trainer hier das Tempo verschärfen. Sollen wir mehr über die Flügel kommen?`);
        }, 800);
    }
}

// 3. SPIELSTAND-LOGIK
function handleScoreChange(user, toni) {
    const diff = toni - user;
    if (diff <= -2) {
        currentFormationMode = "attack";
        addMsg('toni', `Ein ${user}:${toni}? Das ist inakzeptabel! Ich löse meine Kette auf und gehe ins totale Pressing. Schau dir an, wie meine Jungs jetzt schieben!`);
    } else if (diff >= 2) {
        currentFormationMode = "defense";
        addMsg('toni', `Ich führe ${toni}:${user}. Zeit für "Jogo Fechado" – wir machen den Laden dicht und kontern nur noch.`);
    } else {
        currentFormationMode = "standard";
        addMsg('toni', `Bei einem ${user}:${toni} bleiben wir geduldig und halten unsere Grundordnung.`);
    }
    // Visuelle Umsetzung auf dem Board
    analyzeSituation(); 
}

// 4. SITUATIONS-ANALYSE (REAGIERT AUF BOARD-BEWEGUNG)
function analyzeSituation() {
    const ball = document.getElementById('ball');
    if (!ball) return;
    
    const bx = parseInt(ball.style.left);
    const by = parseInt(ball.style.top);
    
    clearArrows();

    // Wer hat den Ball?
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDist = 70;

    players.forEach(p => {
        const px = parseInt(p.style.left) + 30;
        const py = parseInt(p.style.top) + 25;
        const d = Math.sqrt(Math.pow(px - bx, 2) + Math.pow(py - by, 2));
        if (d < minDist) { owner = p; minDist = d; }
    });

    if (owner) {
        if (owner.classList.contains('red')) {
            // Team Rot am Ball -> Toni berechnet Passwege & verschiebt Blau
            calculatePasses(owner, bx, by);
            shiftTeamBlue(bx, by);
        } else {
            // Team Blau am Ball -> Toni plant den Angriff
            addMsg('toni', `Achtung Björn! Mein Spieler ${owner.querySelector('.player-circle').innerText} sucht die Tiefe!`);
            drawArrow(bx + 15, by + 10, bx - 100, by, '#3498db', true);
        }
    }
}

// 5. TAKTISCHES VERSCHIEBEN (BLAU)
function shiftTeamBlue(bx, by) {
    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    
    bluePlayers.forEach(p => {
        let curX = parseInt(p.style.left);
        let curY = parseInt(p.style.top);
        
        // Grund-Verschiebung zum Ball
        let targetX = curX;
        let targetY = curY;

        if (currentFormationMode === "attack") {
            targetX = curX + (bx - curX) * 0.2; // Aggressiv zum Ball
        } else if (currentFormationMode === "defense") {
            targetX = curX + (bx - curX) * 0.05 + 20; // Zieht sich eher zurück
        } else {
            targetX = curX + (bx - curX) * 0.1; // Standard
        }

        // Pfeile für Gegner-Laufwege (Blau)
        drawArrow(curX + 30, curY + 20, targetX + 30, curY + 20, '#3498db', false);

        p.style.transition = "all 0.8s ease-in-out";
        p.style.left = targetX + "px";
    });
}

// 6. PASSWEGE (ROT)
function calculatePasses(owner, bx, by) {
    document.querySelectorAll('.player-wrapper.red').forEach(p => {
        if (p.id === owner.id) return;
        const tx = parseInt(p.style.left) + 30;
        const ty = parseInt(p.style.top) + 25;
        const d = Math.sqrt(Math.pow(tx - bx, 2) + Math.pow(ty - by, 2));
        if (d > 50 && d < 350) {
            drawArrow(bx + 15, by + 10, tx, ty, '#2ecc71', true);
        }
    });
}

// 7. HELFER: CHAT & GRAFIK
function addMsg(sender, text) {
    const hist = document.getElementById('chat-history');
    const m = document.createElement('div');
    m.className = `msg ${sender}`;
    m.innerText = (sender === 'toni' ? '⚽ TONI: ' : '📋 COACH: ') + text;
    hist.appendChild(m);
    hist.scrollTop = hist.scrollHeight;
}

function drawArrow(x1, y1, x2, y2, color, dashed) {
    const svg = document.getElementById('tactical-arrows');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", color); line.setAttribute("stroke-width", "3");
    if (dashed) line.setAttribute("stroke-dasharray", "8,4");
    
    const mId = `arrowhead-${color.replace('#','')}`;
    line.setAttribute("marker-end", `url(#${mId})`);
    
    if (!document.getElementById(mId)) {
        const defs = svg.querySelector('defs') || document.createElementNS("http://www.w3.org/2000/svg", "defs");
        if (!svg.querySelector('defs')) svg.appendChild(defs);
        const m = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        m.setAttribute("id", mId); m.setAttribute("viewBox", "0 0 10 10");
        m.setAttribute("refX", "9"); m.setAttribute("refY", "5");
        m.setAttribute("markerWidth", "5"); m.setAttribute("markerHeight", "5");
        m.setAttribute("orient", "auto");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0 0 L 10 5 L 0 10 z"); path.setAttribute("fill", color);
        m.appendChild(path); defs.appendChild(m);
    }
    svg.appendChild(line);
}

function clearArrows() { document.getElementById('tactical-arrows').innerHTML = ''; }
