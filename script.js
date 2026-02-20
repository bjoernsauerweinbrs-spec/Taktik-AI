/* --- DATEN & NAVIGATION --- */
const teamData = [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 75, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] }
];

function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(moduleId).classList.add('active');
    
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 200);
    }
}

/* --- TAKTIK BOARD ZEICHNUNG --- */
let canvas, ctx, players = [];
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
    
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Linien
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außenlinie
    
    // Mittellinie & Kreis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 40, 0, Math.PI * 2);
    ctx.stroke();

    // 16-Meter-Räume & Tore
    const boxW = canvas.width * 0.6;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, 50); // Oben
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - 60, boxW, 50); // Unten
    
    ctx.lineWidth = 4; // Tore dicker
    ctx.strokeRect(canvas.width * 0.4, 5, canvas.width * 0.2, 5);
    ctx.strokeRect(canvas.width * 0.4, canvas.height - 10, canvas.width * 0.2, 5);

    // Spieler
    players.forEach(p => {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 10px Arial"; ctx.fillText(p.label, p.x - 12, p.y + 25);
    });
}

function setFormation(type) {
    players = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if(type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.5, label: "MF", color}));
        [0.4, 0.6].forEach(f => players.push({x: w*f, y: h*0.25, label: "ST", color}));
    } else {
        [0.25, 0.5, 0.75].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.4, label: "MF", color}));
        [0.2, 0.5, 0.8].forEach(f => players.push({x: w*f, y: h*0.2, label: "ST", color}));
    }
    players.push({x: w/2, y: h-40, label: "TW", color});
    drawBoard();
}

function clearBoard() { players = []; drawBoard(); }

/* --- DRAG LOGIK --- */
function startDrag(e) {
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
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

/* --- CHAT --- */
function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    document.getElementById('chat-history').appendChild(div);
    document.getElementById('chat-history').scrollTop = 10000;
}

window.onload = () => {
    const container = document.getElementById('locker-room-container');
    container.innerHTML = '<div class="card-grid"></div>';
    teamData.forEach(p => {
        container.querySelector('.card-grid').innerHTML += `
            <div class="fut-card">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div class="card-name">${p.name}</div>
            </div>`;
    });
};
