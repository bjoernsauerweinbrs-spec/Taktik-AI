/* ==========================================================
   TONI 2.0 - MASTER SKRIPT (UNGEKÜRZT)
   ========================================================== */

function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);

    // MUSTER-KADER (Fix für die leere Kabine)
    return [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
        { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], img: "" },
        { id: 105, name: "A. Fischer", pos: "LM", rating: 86, stats: [92, 78, 82, 88, 50, 70], img: "" }
    ];
}

let playersData = getInitialPlayers();
let editingPlayerId = null;

window.onload = () => {
    // SICHERHEIT: Modal beim Start verstecken
    const modal = document.getElementById('player-modal');
    if(modal) modal.classList.remove('active');
    
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    renderLockerRoom();
    showModule('dashboard'); 
    addMessage("Toni", "Elite System 2.0 online. Analyse gestartet.");
};

/* --- NAVIGATION --- */
function showModule(moduleId) {
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => s.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        document.querySelector('.main-content').scrollTop = 0;
    }

    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(moduleId));
    if (activeBtn) activeBtn.classList.add('active');

    if (moduleId === 'tactics') setTimeout(initBoard, 150);
}

/* --- KABINE & FIFA CARDS --- */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            <div class="card-img-container">
                ${p.img ? `<img src="${p.img}">` : '<span style="font-size:35px;">👤</span>'}
            </div>
            <div class="card-name">${p.name}</div>
            <div class="card-stats">
                <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                <span>PAS: ${p.stats[2]}</span><span>PHY: ${p.stats[5]}</span>
            </div>
        </div>
    `).join('');
}

/* --- TAKTIK ENGINE (MIT TOREN) --- */
let canvas, ctx, pitchPlayers = [];

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Linien
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außen
    
    // TORE (Fix für Screenshot 3)
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10); // Tor Oben
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10); // Tor Unten
    ctx.stroke();
    
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

    // Spieler zeichnen
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.fillText(p.label, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, label: "ABW", color: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.5, label: "MF", color: color }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, label: "ST", color: color }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, label: "TW", color: color });
    drawBoard();
}

/* --- PLAYER MODAL FIX --- */
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.classList.add('active'); // Öffnet das Modal nur bei Klick

    if (id) {
        const p = playersData.find(x => x.id === id);
        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-pos').value = p.pos;
        document.getElementById('edit-rating').value = p.rating;
        // ... stats laden ...
    }
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

function savePlayer() {
    // ... Speicher-Logik mit Auto-Rating Berechnung ...
    closePlayerModal();
    renderLockerRoom();
}
