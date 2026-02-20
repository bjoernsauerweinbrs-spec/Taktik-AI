/* --- DATEN & BASIS-SETUP --- */
const teamData = [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 75, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] },
    { id: 3, name: "Schneider", pos: "ZDM", rating: 84, stats: [70, 65, 88, 75, 85, 82] },
    { id: 4, name: "Weber", pos: "IV", rating: 82, stats: [68, 40, 60, 55, 88, 90] }
];

/* --- NAVIGATION --- */
function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(moduleId).classList.add('active');
    
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 100); 
    }
}

/* --- KABINE RENDERN (FIFA KARTEN) --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if(!container) return;
    container.innerHTML = '<div class="card-grid"></div>';
    const grid = container.querySelector('.card-grid');

    teamData.forEach(p => {
        grid.innerHTML += `
            <div class="fut-card" onclick="addMessage('Toni', 'Analyse für ${p.name}: Formstatus stabil.')">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div style="height:50px; background:rgba(0,0,0,0.1); margin:5px 0; border-radius:50%; display:flex; align-items:center; justify-content:center;">👤</div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                </div>
            </div>`;
    });
}

/* --- TAKTIK BOARD MIT STRATEGIE-ZONEN --- */
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
    
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Spielfeld-Linien
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI*2); ctx.stroke();

    // 2. Strategie-Zonen zeichnen
    zones.forEach(z => {
        ctx.fillStyle = z.color;
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "white"; ctx.font = "italic 10px Arial";
        ctx.fillText(z.label, z.x + 5, z.y + 15);
    });

    // 3. Spieler zeichnen
    players.forEach(p => {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 10px Arial"; ctx.fillText(p.label, p.x - 10, p.y + 25);
    });
}

function setFormation(type) {
    players = []; zones = [];
    const w = canvas.width, h = canvas.height;
    
    if(type === '4-4-2') {
        // TONI MANNSCHAFT (Klassisch, kompakt)
        addMessage("Toni", "4-4-2 System: Wir fokussieren uns auf das Zentrum und schnelles Umschaltspiel.");
        zones.push({x: 0, y: h*0.4, w: w, h: h*0.2, color: "rgba(34, 197, 94, 0.2)", label: "PRESSING ZONE"});
        
        const color = '#ef4444';
        players.push({x: w/2, y: h-30, label: "TW", color});
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.5, label: "MF", color}));
        [0.4, 0.6].forEach(f => players.push({x: w*f, y: h*0.25, label: "ST", color}));
    } else {
        // TRAINER MANNSCHAFT (Offensiv, Flügelspiel)
        addMessage("Toni", "3-4-3 System: Hohes Risiko, Fokus auf die Außenbahnen.");
        zones.push({x: 0, y: 0, w: w*0.2, h: h, color: "rgba(59, 130, 246, 0.2)", label: "FLÜGEL LAUFWEG"});
        zones.push({x: w*0.8, y: 0, w: w*0.2, h: h, color: "rgba(59, 130, 246, 0.2)", label: "FLÜGEL LAUFWEG"});
        
        const color = '#3b82f6';
        players.push({x: w/2, y: h-30, label: "TW", color});
        [0.25, 0.5, 0.75].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.45, label: "MF", color}));
        [0.2, 0.5, 0.8].forEach(f => players.push({x: w*f, y: h*0.2, label: "ST", color}));
    }
    drawBoard();
}

function clearBoard() { players = []; zones = []; drawBoard(); }

/* --- TOUCH & DRAG LOGIK --- */
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

/* --- CHAT INTERFACE --- */
function addMessage(sender, text) {
    const chat = document.getElementById('chat-history');
    if(!chat) return;
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function toggleMic() {
    addMessage("System", "Mikrofon aktiviert. Toni hört zu...");
}

// Initialer Start
renderLockerRoom();
