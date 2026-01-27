/**
 * Toni 2.0 - Elite Board Engine (Step 10.1: ID-Fix & Real Zone Analysis)
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let currentPitchType = 'none';
let players = []; 
let nextPlayerId = 1; // Eindeutige ID für jeden Spieler
let ball = { x: 475, y: 300, targetX: 475, targetY: 300 };
let runs = []; 
let draggedObject = null;
let showZones = false; 

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pitch');
    if(container) {
        container.innerHTML = '';
        container.appendChild(canvas);
        resizeCanvas();
        setupInteractions(); 
        renderLoop(); 
    }
});

function resizeCanvas() { canvas.width = 950; canvas.height = 600; }

function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentPitchType !== 'none') {
        drawPitchLines(currentPitchType);
        if(showZones) drawZones();
        updateAndDrawRuns();
        updateAndDrawPlayers();
        drawBall();
    }
    requestAnimationFrame(renderLoop);
}

// 18-Zonen-Grid
function drawZones() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.setLineDash([5, 5]);
    const zoneW = 850 / 6;
    const zoneH = 500 / 3;
    for(let i=1; i<6; i++) {
        let x = 50 + zoneW * i;
        ctx.beginPath(); ctx.moveTo(x, 50); ctx.lineTo(x, 550); ctx.stroke();
    }
    for(let i=1; i<3; i++) {
        let y = 50 + zoneH * i;
        ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(900, y); ctx.stroke();
    }
    ctx.setLineDash([]);
}

function updateAndDrawRuns() {
    runs = runs.filter(r => {
        const p = players.find(pl => pl.id === r.playerId);
        if(!p) return false;
        const dist = Math.sqrt((p.x - r.toX)**2 + (p.y - r.toY)**2);
        if(dist > 10) {
            drawArrow(r.fromX, r.fromY, r.toX, r.toY);
            return true;
        }
        return false;
    });
}

function drawArrow(fx, fy, tx, ty) {
    const headlen = 12;
    const angle = Math.atan2(ty - fy, tx - fx);
    ctx.strokeStyle = "rgba(46, 204, 113, 0.7)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - headlen * Math.cos(angle - Math.PI/6), ty - headlen * Math.sin(angle - Math.PI/6));
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx - headlen * Math.cos(angle + Math.PI/6), ty - headlen * Math.sin(angle + Math.PI/6));
    ctx.stroke();
}

function setupInteractions() {
    canvas.onmousedown = e => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
        if(Math.sqrt((mx-ball.x)**2+(my-ball.y)**2) < 15) { draggedObject = ball; return; }
        draggedObject = players.find(p => Math.sqrt((mx-p.x)**2+(my-p.y)**2) < 20);
        
        // Copilot Fix: Nur Runs für Spieler, nicht für den Ball
        if(draggedObject && draggedObject !== ball) {
            runs = runs.filter(r => r.playerId !== draggedObject.id);
            runs.push({ fromX: draggedObject.x, fromY: draggedObject.y, toX: draggedObject.x, toY: draggedObject.y, playerId: draggedObject.id });
        }
    };
    canvas.onmousemove = e => {
        if (draggedObject) {
            const rect = canvas.getBoundingClientRect();
            draggedObject.targetX = e.clientX - rect.left;
            draggedObject.targetY = e.clientY - rect.top;
            if(draggedObject !== ball) {
                let run = runs.find(r => r.playerId === draggedObject.id);
                if(run) { run.toX = draggedObject.targetX; run.toY = draggedObject.targetY; }
            }
        }
    };
    canvas.onmouseup = () => { draggedObject = null; };
}

// "Echte" Zonen-Analyse (Nagelsmann-Mode)
window.analyzeZones = () => {
    showZones = true;
    const zoneW = 850 / 6;
    const zoneH = 500 / 3;
    let report = "Analyse läuft... ";

    // Beispiel: Zähle Spieler in Zone 14 (Zentrum vor dem 16er)
    // Zone 14 ist meistens die 5. Spalte, mittlere Reihe (Index 4,1)
    const redInZone14 = players.filter(p => p.team === 'red' && p.x > 50 + 4*zoneW && p.x < 50 + 5*zoneW && p.y > 50 + zoneH && p.y < 50 + 2*zoneH).length;
    const blueInZone14 = players.filter(p => p.team === 'blue' && p.x > 50 + 4*zoneW && p.x < 50 + 5*zoneW && p.y > 50 + zoneH && p.y < 50 + 2*zoneH).length;

    if(redInZone14 > blueInZone14) {
        report = "Björn, wir dominieren Zone 14! Wir haben dort Überzahl. Such den Steckpass!";
    } else if (redInZone14 < blueInZone14) {
        report = "Coach, der Gegner macht das Zentrum vor dem Sechzehner dicht. Wir müssen über die Flügel kommen!";
    } else {
        report = "Zentrum ist ausgeglichen. Wir brauchen einen kreativen Laufweg, um die Kette zu sprengen.";
    }
    return report;
};

window.spawnPlayer = (team, nr, name, x, y) => {
    players.push({ id: nextPlayerId++, team, nr, name, x, y, targetX: x, targetY: y });
};

// ... Rest wie bisher (setPitch, setFormation etc.)
