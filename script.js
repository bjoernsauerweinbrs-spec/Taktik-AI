/* ==========================================================
   TONI 2.0 - MASTER SKRIPT (VOLLSTÄNDIG & UNGEKÜRZT)
   ========================================================== */

// 1. MUSTER-KADER (Sorgt für volle Kabine beim Start)
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);

    // Initialer Elite-Kader
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

// INITIALISIERUNG
window.onload = () => {
    // SICHERHEIT: Modal knallhart verstecken beim Laden
    const modal = document.getElementById('player-modal');
    if(modal) modal.classList.remove('active');
    
    // Falls Speicher leer, initialen Kader setzen
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    renderLockerRoom();
    showModule('dashboard'); 
    addMessage("Toni", "Elite System 2.0 online. Analyse-Protokoll gestartet.");
};

// MODUL-NAVIGATION (VERHINDERT DAS STAPELN - Screenshot 13:30)
function showModule(moduleId) {
    // 1. Alle Module unsichtbar machen
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => s.classList.remove('active'));

    // 2. Alle Sidebar-Buttons deaktivieren
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // 3. Ziel-Modul aktivieren
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        document.querySelector('.main-content').scrollTop = 0;
    }

    // 4. Den richtigen Button markieren
    const activeBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(moduleId));
    if (activeBtn) activeBtn.classList.add('active');

    // Taktik-Initialisierung
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

// SPIELER-KABINE RENDERN (FIFA-CARDS)
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

// PLAYER-MODAL STEUERUNG (Screenshot 14:24:04 FIX)
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.classList.add('active'); // Öffnet das Modal erst hier
    
    // Rating Feld auf Schreibgeschützt setzen
    const ratingInput = document.getElementById('edit-rating');
    ratingInput.readOnly = true;

    if (id) {
        const p = playersData.find(x => x.id === id);
        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-pos').value = p.pos;
        document.getElementById('edit-rating').value = p.rating;
        document.getElementById('edit-img-url').value = p.img || "";
        
        document.getElementById('edit-tem').value = p.stats[0];
        document.getElementById('edit-sch').value = p.stats[1];
        document.getElementById('edit-pas').value = p.stats[2];
        document.getElementById('edit-dri').value = p.stats[3];
        document.getElementById('edit-def').value = p.stats[4];
        document.getElementById('edit-phy').value = p.stats[5];
        
        document.getElementById('btn-delete').style.display = "block";
    } else {
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

// AUTO-RATING SPEICHERN
function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;

    const s = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    const autoRating = Math.round(s.reduce((a, b) => a + b, 0) / 6);

    const p = {
        id: editingPlayerId || Date.now(),
        name: name,
        pos: document.getElementById('edit-pos').toUpperCase() || "??",
        rating: autoRating,
        stats: s,
        img: document.getElementById('edit-img-url').value
    };

    if (editingPlayerId) playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    else playersData.push(p);

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

// TAKTIK ENGINE (JETZT MIT TOREN - Screenshot 14:25:48 FIX)
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
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außen
    
    // TORE ZEICHNEN (Fix für Screenshot 3)
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10); // Tor Oben
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10); // Tor Unten
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

    // Strafräume
    const bw = canvas.width * 0.65;
    ctx.strokeRect((canvas.width-bw)/2, 10, bw, 80); 
    ctx.strokeRect((canvas.width-bw)/2, canvas.height-90, bw, 80);

    // Spieler zeichnen
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.fillText(p.l, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    const c = type === '4-4-2' ? '#ef4444' : '#3b82f6';
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.75, l: "ABW", c: c }));
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.5, l: "MF", c: c }));
        [0.4, 0.6].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.25, l: "ST", c: c }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, l: "TW", c: c });
    drawBoard();
}

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}
