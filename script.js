/* --- DATEN --- */
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
        setTimeout(initBoard, 100); // Kurz warten bis Canvas sichtbar
    }
}

/* --- KABINE RENDERN --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    container.innerHTML = '<div class="card-grid"></div>';
    const grid = container.querySelector('.card-grid');

    teamData.forEach(p => {
        grid.innerHTML += `
            <div class="fut-card" onclick="chatSay('Spieler-Fokus: ${p.name}')">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div style="height:50px; background:#333; margin:5px 0; border-radius:50%"></div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                </div>
            </div>`;
    });
}

/* --- TAKTIK BOARD LOGIK --- */
let canvas, ctx, players = [];
let dragging = false, activePlayer = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Mouse & Touch Events
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Mittellinie
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, canvas.height/2); ctx.lineTo(canvas.width, canvas.height/2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 40, 0, Math.PI*2); ctx.stroke();

    players.forEach(p => {
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "10px Arial"; ctx.fillText(p.label, p.x - 10, p.y + 22);
    });
}

function setFormation(type) {
    players = [];
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';
    const w = canvas.width, h = canvas.height;
    
    // TW immer da
    players.push({x: w/2, y: h-30, label: "TW", color: color});

    if(type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.55, label: "MF", color}));
        [0.4, 0.6].forEach(f => players.push({x: w*f, y: h*0.35, label: "ST", color}));
    } else {
        [0.25, 0.5, 0.75].forEach(f => players.push({x: w*f, y: h*0.75, label: "ABW", color}));
        [0.2, 0.4, 0.6, 0.8].forEach(f => players.push({x: w*f, y: h*0.55, label: "MF", color}));
        [0.2, 0.5, 0.8].forEach(f => players.push({x: w*f, y: h*0.35, label: "ST", color}));
    }
    drawBoard();
    addMessage("Toni", `Formation ${type} aufgestellt. Taktik bereit!`);
}

function clearBoard() { players = []; drawBoard(); }

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

/* --- CHAT LOGIK --- */
function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase()}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    document.getElementById('chat-history').appendChild(div);
    document.getElementById('chat-history').scrollTop = 10000;
}

function chatSay(txt) { addMessage("Toni", txt); }

document.getElementById('text-input').onkeypress = function(e) {
    if(e.key === 'Enter' && this.value) {
        addMessage("Du", this.value);
        this.value = '';
        setTimeout(() => addMessage("Toni", "Analysiere Daten..."), 600);
    }
};

function toggleMic() {
    addMessage("System", "Mikrofon aktiviert. Toni hört zu...");
}

// Start
renderLockerRoom();
