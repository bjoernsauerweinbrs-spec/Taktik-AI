/* --- TONI TAKTIK-BRAIN --- */

function analyzeSituation() {
    const ball = document.getElementById('ball');
    const ballX = parseInt(ball.style.left);
    const ballY = parseInt(ball.style.top);
    
    clearArrows(); // Alte Pfeile weg

    // 1. Wer hat den Ball? (Einfacher Check nach Nähe)
    const players = document.querySelectorAll('.player-wrapper');
    let owner = null;
    let minDist = 50;

    players.forEach(p => {
        const px = parseInt(p.style.left) + 30;
        const py = parseInt(p.style.top) + 25;
        const dist = Math.sqrt(Math.pow(px - ballX, 2) + Math.pow(py - ballY, 2));
        if (dist < minDist) { owner = p; minDist = dist; }
    });

    if (owner) {
        const team = owner.classList.contains('red') ? 'Björn' : 'Toni';
        const name = owner.querySelector('.player-circle').innerText;
        
        if (team === 'Björn') {
            handleUserAttack(owner, ballX, ballY);
        } else {
            handleToniAttack(owner, ballX, ballY);
        }
    }
}

// TONI REAGIERT AUF DEINEN ANGRIFF
function handleUserAttack(player, bx, by) {
    const name = player.querySelector('.player-circle').innerText;
    
    // Taktik-Logik: Wenn Ball links (by < 200)
    if (by < 200) {
        addMsg('toni', `Coach Björn, ${name} hat den Ball am Flügel! Ich ziehe meine Abwehr rüber. Dein rechter Flügel sollte jetzt diagonal einrücken!`);
        drawArrow(400, 400, 550, 300, '#2ecc71'); // Vorschlags-Pfeil
        shiftBlueTeam(bx + 100, by);
    } else {
        addMsg('toni', `Zentraler Aufbau durch ${name}. David Luiz sollte den Raum absichern, falls wir den Ball verlieren!`);
        drawArrow(150, 250, 150, 350, '#e74c3c');
    }
}

// TONI GREIFT SELBST AN
function handleToniAttack(player, bx, by) {
    const name = player.querySelector('.player-circle').innerText;
    addMsg('toni', `Achtung Björn! Mein Spieler ${name} sucht die Lücke. Deine Kette steht zu tief, schieb raus!`);
    drawArrow(bx, by, bx - 150, by + 50, '#3498db');
}

// HELFER: Pfeile zeichnen (SVG)
function drawArrow(x1, y1, x2, y2, color) {
    const svg = document.getElementById('tactical-arrows');
    const newArrow = document.createElementNS("http://www.w3.org/2000/svg", "line");
    newArrow.setAttribute("x1", x1); newArrow.setAttribute("y1", y1);
    newArrow.setAttribute("x2", x2); newArrow.setAttribute("y2", y2);
    newArrow.setAttribute("stroke", color);
    newArrow.setAttribute("stroke-width", "3");
    newArrow.setAttribute("marker-end", "url(#arrowhead)");
    svg.appendChild(newArrow);
    
    // Pfeilspitze Marker
    if (!document.getElementById('arrowhead')) {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        defs.innerHTML = `<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="${color}" /></marker>`;
        svg.appendChild(defs);
    }
}

function clearArrows() { document.getElementById('tactical-arrows').innerHTML = ''; }

function shiftBlueTeam(tx, ty) {
    const blue = document.querySelectorAll('.player-wrapper.blue');
    blue.forEach(p => {
        p.style.transition = "all 0.8s ease-in-out";
        let curX = parseInt(p.style.left);
        p.style.left = (curX - 20) + "px"; // Rückt leicht entgegen
    });
}

/* KADER EDIT LOGIK */
function openKaderManager() {
    document.getElementById('kader-modal').style.display = 'flex';
    const list = document.getElementById('kader-list');
    list.innerHTML = '';
    const reds = document.querySelectorAll('.player-wrapper.red');
    reds.forEach(p => {
        const n = p.querySelector('.player-circle').innerText;
        const nr = p.querySelector('.player-label').innerText;
        list.innerHTML += `<div style="margin-bottom:5px;"><input type="text" value="${n}" onchange="document.getElementById('${p.id}').querySelector('.player-circle').innerText=this.value.toUpperCase()"> <input type="text" value="${nr}" style="width:30px;" onchange="document.getElementById('${p.id}').querySelector('.player-label').innerText=this.value"></div>`;
    });
}
function closeKaderManager() { document.getElementById('kader-modal').style.display = 'none'; }
