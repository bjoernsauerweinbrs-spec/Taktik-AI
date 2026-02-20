const eliteData = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "M. Neuer", pos: "TW", rating: 89, stats: [50, 50, 50, 50, 50, 50] },
        { id: 2, name: "V. van Dijk", pos: "IV", rating: 88, stats: [50, 50, 50, 50, 50, 50] }
    ],
    pitchPlayers: []
};

let canvas, ctx;

window.onload = () => {
    initBoard();
    renderLockerRoom();
    setInterval(() => { 
        document.getElementById('system-clock').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
};

/* --- TAKTIKBOARD 2D LOGIK --- */
function initBoard() {
    canvas = document.getElementById('mainTacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    setFormation('4-4-2');
}

function setFormation(type) {
    eliteData.pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => eliteData.pitchPlayers.push({ x: w * f, y: h * 0.75, team: 'TONI', c: '#ef4444' }));
        eliteData.pitchPlayers.push({ x: w/2, y: h-40, team: 'TONI', c: '#ef4444' });
    } else {
        [0.25, 0.5, 0.75].forEach(f => eliteData.pitchPlayers.push({ x: w * f, y: h * 0.25, team: 'OPP', c: '#3b82f6' }));
    }
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Feldlinien
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    // Tore
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.35, 10); ctx.lineTo(canvas.width * 0.65, 10);
    ctx.moveTo(canvas.width * 0.35, canvas.height - 10); ctx.lineTo(canvas.width * 0.65, canvas.height - 10);
    ctx.stroke();

    // Spieler zeichnen
    eliteData.pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 15, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 10px Inter";
        ctx.fillText(p.team, p.x - 12, p.y + 30);
    });
}

/* --- KABINE --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;
    container.innerHTML = eliteData.players.map(p => `
        <div class="fut-card">
            <div class="card-name">${p.rating} ${p.pos}</div>
            <div style="font-size:40px; margin:20px 0;">👤</div>
            <div class="card-name">${p.name}</div>
            <div class="card-stats">
                <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                <span>PAS: ${p.stats[2]}</span><span>PHY: ${p.stats[5]}</span>
            </div>
        </div>
    `).join('');
}

/* --- VR MODUS SWITCH --- */
function startVRMode() {
    document.getElementById('vr-overlay').style.display = 'block';
    const vrContainer = document.getElementById('vr-players-container');
    vrContainer.innerHTML = '';
    // Transfer der 2D Spieler in den 3D Raum
    eliteData.pitchPlayers.forEach(p => {
        const el = document.createElement('a-cylinder');
        el.setAttribute('position', `${(p.x / canvas.width * 60) - 30} 0.9 ${(p.y / canvas.height * 100) - 50}`);
        el.setAttribute('color', p.c);
        el.setAttribute('radius', '0.5'); el.setAttribute('height', '1.8');
        vrContainer.appendChild(el);
    });
}

function stopVRMode() { document.getElementById('vr-overlay').style.display = 'none'; }

function showModule(id) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (id === 'tactic-board') initBoard();
}
