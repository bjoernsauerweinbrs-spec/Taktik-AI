/**
 * Toni 2.0 - Elite Board Engine (Canvas & Animation)
 */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let currentPitchType = 'none';
let players = []; // Hier leben unsere Spieler-Objekte
let ball = { x: 475, y: 300, targetX: 475, targetY: 300 };

window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pitch');
    if(container) {
        container.innerHTML = '';
        container.appendChild(canvas);
        resizeCanvas();
        renderLoop(); // Startet die 60 FPS Animation
    }
});

function resizeCanvas() {
    canvas.width = 950;
    canvas.height = 600;
}

// Die Render-Loop (Copilots Herzstück)
function renderLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentPitchType !== 'none') {
        drawPitchLines(currentPitchType);
        updateAndDrawPlayers();
        drawBall();
    }
    
    requestAnimationFrame(renderLoop);
}

function updateAndDrawPlayers() {
    players.forEach(p => {
        // Smooth Movement (Laufwege wie im Video)
        p.x += (p.targetX - p.x) * 0.08;
        p.y += (p.targetY - p.y) * 0.08;

        // Spieler zeichnen (Elite-Design)
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, 20);
        grad.addColorStop(0, p.team === 'red' ? '#ff4d4d' : '#3498db');
        grad.addColorStop(1, p.team === 'red' ? '#b30000' : '#2980b9');
        
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nummer & Name
        ctx.fillStyle = "white";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + 5);
        
        ctx.font = "10px sans-serif";
        ctx.fillText(p.name, p.x, p.y + 35);
    });
}

function drawBall() {
    ball.x += (ball.targetX - ball.x) * 0.1;
    ball.y += (ball.targetY - ball.y) * 0.1;
    
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();
}

// Spielfeld-Linien (Nagelsmann-Style)
function drawPitchLines(type) {
    ctx.fillStyle = "#1a3a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;

    ctx.strokeRect(50, 50, 850, 500); // Außen
    if(type === 'grossfeld') {
        ctx.beginPath();
        ctx.moveTo(475, 50); ctx.lineTo(475, 550); // Mitte
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(475, 300, 70, 0, Math.PI * 2); // Kreis
        ctx.stroke();
    }
}

// Befehle für Toni (KI-Hooks)
window.spawnPlayer = (team, nr, name, x, y) => {
    players.push({ team, nr, name, x, y, targetX: x, targetY: y });
};

window.movePlayer = (nr, newX, newY) => {
    const p = players.find(player => player.nr == nr);
    if(p) { p.targetX = newX; p.targetY = newY; }
};

window.setPitch = (type) => { 
    currentPitchType = type; 
    document.getElementById('setup-overlay').style.display = 'none';
    document.getElementById('pitch').style.display = 'block';
};
