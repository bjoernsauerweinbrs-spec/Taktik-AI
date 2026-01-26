let currentMode = '11v11';
let players = [];
let materials = [];

// Initialisierung beim Laden
document.addEventListener('DOMContentLoaded', () => {
    setupBoard();
    loadTrainerSettings();
});

function setupBoard() {
    const pitch = document.getElementById('pitch');
    
    // Spieler-Setup basierend auf Modus
    renderPlayers();
    
    // Drag & Drop Initialisierung
    pitch.addEventListener('dragover', e => e.preventDefault());
}

function setMode(mode) {
    currentMode = mode;
    const matBtn = document.getElementById('material-btn-container');
    
    // UI-Anpassung
    document.querySelectorAll('.mode-group .btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(mode.toLowerCase()));
    });

    if(mode === 'training' || mode === 'funino') {
        matBtn.style.display = 'flex';
        // Im Trainingsmodus: Start-Setup mit bunten Spielern
        initTrainingPlayers();
    } else {
        matBtn.style.display = 'none';
        // Im 11v11: Klassisch Rot gegen Blau
        initTacticalPlayers();
    }
}

function initTacticalPlayers() {
    const pitch = document.getElementById('pitch');
    // Alle alten Spieler/Materialien löschen
    document.querySelectorAll('.player, .cone, .ball').forEach(el => el.remove());
    
    // Erstelle 11 Rote (Trainer) und 11 Blaue (Toni)
    for(let i=1; i<=11; i++) {
        createPlayer('red', i, 50, i * 45 + 50);
        createPlayer('blue', i, 850, i * 45 + 50);
    }
}

function createPlayer(team, number, x, y) {
    const p = document.createElement('div');
    p.className = `player ${team}`;
    p.id = `p-${team}-${number}`;
    p.innerText = number;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.draggable = true;
    
    // Drag-Logic
    p.addEventListener('dragend', (e) => {
        const rect = document.getElementById('pitch').getBoundingClientRect();
        p.style.left = (e.clientX - rect.left - 20) + 'px';
        p.style.top = (e.clientY - rect.top - 20) + 'px';
        
        // Nach jeder Bewegung: Toni "sieht" das jetzt
        console.log(`Spieler ${number} bewegt auf:`, p.style.left, p.style.top);
    });

    document.getElementById('pitch').appendChild(p);
}

// NEU: Material-Funktionen
function addCone() {
    const cone = document.createElement('div');
    cone.className = 'cone';
    cone.style.position = 'absolute';
    cone.style.width = '20px';
    cone.style.height = '20px';
    cone.style.background = 'orange'; // Symbol für Hütchen
    cone.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    cone.style.left = '475px';
    cone.style.top = '300px';
    cone.draggable = true;
    
    cone.addEventListener('dragend', (e) => {
        const rect = document.getElementById('pitch').getBoundingClientRect();
        cone.style.left = (e.clientX - rect.left - 10) + 'px';
        cone.style.top = (e.clientY - rect.top - 10) + 'px';
    });
    
    document.getElementById('pitch').appendChild(cone);
}

// NEU: Animation für Toni (Laufwege)
function animateMove(playerId, targetX, targetY) {
    const player = document.getElementById(playerId);
    if(!player) return;
    
    // Zeichne Pfeil (vereinfacht)
    drawArrow(parseFloat(player.style.left), parseFloat(player.style.top), targetX, targetY);
    
    // Bewege Spieler
    player.style.transition = "all 2s ease-in-out";
    player.style.left = targetX + "px";
    player.style.top = targetY + "px";
    
    // Nach Animation Transition entfernen
    setTimeout(() => { player.style.transition = "none"; }, 2000);
}

function drawArrow(x1, y1, x2, y2) {
    const svg = document.getElementById('drawing-layer');
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1 + 20);
    line.setAttribute("y1", y1 + 20);
    line.setAttribute("x2", x2 + 20);
    line.setAttribute("y2", y2 + 20);
    line.setAttribute("stroke", "rgba(255,255,255,0.5)");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("stroke-dasharray", "5,5");
    svg.appendChild(line);
}

// Funktion für den "Zustandsscan" (Wichtig für Tonis Qualifikation!)
function getBoardState() {
    const state = {
        mode: currentMode,
        redTeam: [],
        blueTeam: [],
        materials: []
    };
    
    document.querySelectorAll('.player.red').forEach(p => {
        state.redTeam.push({ id: p.innerText, x: p.style.left, y: p.style.top });
    });
    
    document.querySelectorAll('.player.blue').forEach(p => {
        state.blueTeam.push({ id: p.innerText, x: p.style.left, y: p.style.top });
    });
    
    return JSON.stringify(state);
}
