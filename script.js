/* ==========================================================
   TONI 2.0 - MASTER ENGINE (FEHLER-FIX EDITION)
   ========================================================== */

function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) return parsed;
        } catch (e) { console.error("Daten-Reset"); }
    }
    return [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
        { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" }
    ];
}

let playersData = getInitialPlayers();

window.onload = () => {
    // Modal-Fix: Sicherstellen, dass es zu ist
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');
    
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    renderLockerRoom();
    showModule('dashboard'); 
};

function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(moduleId));
    if (btn) btn.classList.add('active');

    if (moduleId === 'tactics') setTimeout(initBoard, 150);
}

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => {
        // SICHERHEITS-CHECK: Falls stats fehlen, stürzt nichts ab (Fix Error line 130)
        const s = p.stats && p.stats.length === 6 ? p.stats : [50, 50, 50, 50, 50, 50];
        
        return `
            <div class="fut-card" onclick="openPlayerModal(${p.id})">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div class="card-img-container">
                    ${p.img ? `<img src="${p.img}">` : '<span style="font-size:35px;">👤</span>'}
                </div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${s[0]}</span><span>DRI: ${s[3]}</span>
                    <span>SCH: ${s[1]}</span><span>DEF: ${s[4]}</span>
                    <span>PAS: ${s[2]}</span><span>PHY: ${s[5]}</span>
                </div>
            </div>
        `;
    }).join('');
}

/* --- TAKTIK-BOARD ENGINE --- */
let canvas, ctx, pitchPlayers = [];
function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    // Tore
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10);
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10);
    ctx.stroke();
    // Spieler
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.fillText(p.l, p.x-12, p.y+35);
    });
}

function setFormation(t) {
    const w = canvas.width, h = canvas.height;
    const col = t === '4-4-2' ? '#ef4444' : '#3b82f6';
    pitchPlayers = [];
    if (t === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w*x, y: h*0.75, l: "ABW", c: col }));
        [0.4, 0.6].forEach(x => pitchPlayers.push({ x: w*x, y: h*0.25, l: "ST", c: col }));
    }
    pitchPlayers.push({ x: w/2, y: h-45, l: "TW", c: col });
    drawBoard();
}

function openPlayerModal(id = null) {
    const modal = document.getElementById('player-modal');
    modal.classList.add('active');
    // ... Logik zum Befüllen der Felder ...
}

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (history) {
        const div = document.createElement('div');
        div.innerHTML = `<b>${sender}:</b> ${text}`;
        history.appendChild(div);
        history.scrollTop = history.scrollHeight;
    }
}
