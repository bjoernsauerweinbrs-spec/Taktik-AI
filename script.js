/* --- BASIS-DATEN & SETUP --- */
const teamData = [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 75, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] },
    { id: 3, name: "Schneider", pos: "ZDM", rating: 84, stats: [70, 65, 88, 75, 85, 82] },
    { id: 4, name: "Weber", pos: "IV", rating: 82, stats: [68, 40, 60, 55, 88, 90] }
];

/* --- NAVIGATION & MODUL-STEUERUNG --- */
function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(moduleId);
    if(target) target.classList.add('active');
    
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick').includes(moduleId));
    if(activeBtn) activeBtn.classList.add('active');

    if (moduleId === 'tactics') {
        setTimeout(initBoard, 200); // Verzögerung für Canvas-Rendering
    }
}

/* --- KABINE (FIFA KARTEN) --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if(!container) return;
    container.innerHTML = '<div class="card-grid"></div>';
    const grid = container.querySelector('.card-grid');

    teamData.forEach(p => {
        grid.innerHTML += `
            <div class="fut-card" onclick="addMessage('Toni', 'Spieler-Analyse für ${p.name} gestartet...')">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div style="height:50px; background:rgba(255,255,255,0.1); margin:5px 0; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                </div>
            </div>`;
    });
}

/* --- TAKTIK BOARD LOGIK (PROFI-VERSION) --- */
let canvas, ctx, players = [], zones = [];
let dragging = false, activePlayer = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Größe an Container anpassen
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Event Listener für Maus und Touch
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    // Standardmäßig Toni-Formation laden
    setFormation('4-4-2');
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Zeichnung (Weiß auf Grün)
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;

    // Außenlinie
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Mittellinie & Kreis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
    ctx.stroke();

    // 16-Meter Räume & Tore
    const boxW = canvas.width * 0.6;
    const boxH = 60;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, boxH); // Oben
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - boxH - 10, boxW, boxH); // Unten
    
    // Tore (Dickere Linien)
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10);
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10);
    ctx.stroke();
    ctx.lineWidth = 2;

    // Strategie-Zonen
    zones.forEach(z => {
        ctx.fillStyle = z.color;
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "white"; ctx.font = "italic 10px Arial";
        ctx.fillText(z.label, z.x + 5, z.y + 15);
    });

    // Spieler zeichnen
    players.forEach(p => {
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white"; ctx.font = "bold 10px Arial";
        ctx.fillText(p.label, p.x - 12, p.y + 25);
    });
}

function setFormation(type) {
    players = []; zones = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if(type === '4-4-2') {
        zones.push({x: 10, y: h*0.4, w: w-20, h: h*0.2, color: "rgba(34, 197, 94, 0.2)", label: "PRESSING ZONE"});
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.5, label: "MF", color}));
        [0.4, 0.6].forEach(f => players.push({x: w*f, y: h*0.25, label: "ST", color}));
    } else {
        zones.push({x: 10, y: 10, w: w*0.15, h: h-20, color: "rgba(59, 130, 246, 0.2)", label: "FLÜGEL"});
        zones.push({x: w*0.85, y: 10, w: w*0.15, h: h-20, color: "rgba(59, 130, 246, 0.2)", label: "FLÜGEL"});
        [0.25, 0.5, 0.75].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.45, label: "MF", color}));
        [0.2, 0.5, 0.8].forEach(f => players.push({x: w*f, y: h*0.2, label: "ST", color}));
    }
    players.push({x: w/2, y: h-40, label: "TW", color}); // Torwart
    drawBoard();
    addMessage("Toni", `Formation ${type} aufgestellt. Taktik bereit.`);
}

function clearBoard() { players = []; zones = []; drawBoard(); }

/* --- DRAG & DROP LOGIK --- */
function startDrag(e) {
    e.preventDefault();
    const pos = getPos(e);
    activePlayer = players.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 20);
    if(activePlayer) dragging = true;
}
function doDrag(e) {
    if(!dragging) return;
    const pos = getPos(e);
    activePlayer.x = pos.x; activePlayer.y = pos.y;
    drawBoard();
}
function stopDrag() { dragging = false; activePlayer = null; }
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = (e.touches ? e.touches[0].clientX : e.clientX);
    const clientY = (e.touches ? e.touches[0].clientY : e.clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
}

/* --- CHAT-SYSTEM --- */
function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if(!history) return;
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function toggleMic() {
    addMessage("System", "Sprachsteuerung aktiv. Toni hört zu...");
}

document.getElementById('text-input').addEventListener('keypress', function(e) {
    if(e.key === 'Enter' && this.value) {
        addMessage("Du", this.value);
        this.value = '';
    }
});

// Initialisierung
window.onload = () => {
    renderLockerRoom();
};
