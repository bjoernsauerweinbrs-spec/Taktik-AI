/* --- DATEN & MODUL-STEUERUNG --- */
const teamData = [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 75, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] },
    { id: 3, name: "Schneider", pos: "ZDM", rating: 84, stats: [70, 65, 88, 75, 85, 82] }
];

function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(moduleId);
    if(target) target.classList.add('active');
    
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(moduleId));
    if(btn) btn.classList.add('active');

    if (moduleId === 'tactics') setTimeout(initBoard, 100);
}

/* --- TAKTIK-BOARD ZEICHNUNG --- */
let canvas, ctx, players = [], zones = [];
let dragging = false, activePlayer = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    setFormation('4-4-2');
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Markierungen
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außenlinie
    
    // Mittellinie & Kreis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

    // Strafräume & Tore
    const boxW = canvas.width * 0.65;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, 70); // Oben
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - 80, boxW, 70); // Unten
    
    // Tore
    ctx.lineWidth = 5;
    ctx.strokeRect(canvas.width * 0.4, 5, canvas.width * 0.2, 5);
    ctx.strokeRect(canvas.width * 0.4, canvas.height - 10, canvas.width * 0.2, 5);
    ctx.lineWidth = 2;

    // Strategische Zonen
    zones.forEach(z => {
        ctx.fillStyle = z.color; ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "white"; ctx.font = "italic 11px Arial"; ctx.fillText(z.label, z.x + 10, z.y + 20);
    });

    // Spieler
    players.forEach(p => {
        ctx.shadowBlur = 12; ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.fillText(p.label, p.x - 12, p.y + 30);
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
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.4, label: "MF", color}));
        [0.2, 0.5, 0.8].forEach(f => players.push({x: w*f, y: h*0.2, label: "ST", color}));
    }
    players.push({x: w/2, y: h-45, label: "TW", color});
    drawBoard();
    addMessage("Toni", `Formation ${type} geladen. Analysezentrum aktiv.`);
}

/* --- DRAG LOGIK --- */
function startDrag(e) {
    const pos = getPos(e);
    activePlayer = players.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
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
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
}

/* --- INITIALISIERUNG --- */
window.onload = () => {
    const locker = document.getElementById('locker-room-container');
    locker.innerHTML = '<div class="card-grid"></div>';
    teamData.forEach(p => {
        locker.querySelector('.card-grid').innerHTML += `
            <div class="fut-card" onclick="addMessage('Toni', 'Status Müller: 100% Einsatzbereit.')">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div style="height:60px; background:rgba(0,0,0,0.1); margin:10px 0; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                </div>
            </div>`;
    });
};

function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
    document.getElementById('chat-history').appendChild(msgDiv);
    document.getElementById('chat-history').scrollTop = 10000;
}
