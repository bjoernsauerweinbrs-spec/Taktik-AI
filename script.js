/* ==========================================================
   1. GLOBALER SPEICHER & MUSTER-KADER (MIT AUTO-RATING)
   ========================================================== */

function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved) return JSON.parse(saved);

    // Elite Muster-Kader: Falls leer, wird dieser erstellt
    return [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
        { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], img: "" }
    ];
}

let playersData = getInitialPlayers();
let editingPlayerId = null;

// Start-Routine
window.onload = () => {
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    renderLockerRoom();
    showModule('dashboard'); 
    addMessage("Toni", "Elite System online. Kader-Daten wurden geladen.");
};

/* ==========================================================
   2. NAVIGATION & PLATZMANAGEMENT (TONI-TOGGLE)
   ========================================================== */

function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        document.querySelector('.main-content').scrollTop = 0;
    }

    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(moduleId));
    if (btn) btn.classList.add('active');

    if (moduleId === 'tactics') setTimeout(initBoard, 150);
}

function toggleToni() {
    document.body.classList.toggle('toni-collapsed');
    // Canvas Fix nach Größenänderung
    if (document.getElementById('tactics').classList.contains('active')) {
        setTimeout(initBoard, 300);
    }
}

/* ==========================================================
   3. KABINE: SPIELER-MANAGEMENT & AUTO-CALCULATION
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            
            <div style="height:65px; width:65px; margin:8px auto; border-radius:50%; overflow:hidden; background:rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.2);">
                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:32px;">👤</span>'}
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

function openPlayerModal(id = null) {
    editingPlayerId = id;
    document.getElementById('player-modal').style.display = "flex";
    
    // Rating Feld auf Schreibgeschützt setzen
    const ratingInput = document.getElementById('edit-rating');
    ratingInput.readOnly = true;
    ratingInput.style.opacity = "0.7";

    if (id) {
        const p = playersData.find(x => x.id === id);
        document.getElementById('modal-title').innerText = "Spieler bearbeiten";
        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-pos').value = p.pos;
        document.getElementById('edit-rating').value = p.rating;
        
        document.getElementById('edit-tem').value = p.stats[0];
        document.getElementById('edit-sch').value = p.stats[1];
        document.getElementById('edit-pas').value = p.stats[2];
        document.getElementById('edit-dri').value = p.stats[3];
        document.getElementById('edit-def').value = p.stats[4];
        document.getElementById('edit-phy').value = p.stats[5];
        // Bild URL (falls vorhanden)
        document.getElementById('edit-img-url').value = p.img || "";
        
        document.getElementById('btn-delete').style.display = "block";
    } else {
        document.getElementById('modal-title').innerText = "Neuer Spieler";
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;

    // HIER PASSIERT DIE INTELLIGENTE BERECHNUNG
    const s = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    // Durchschnittsberechnung für das Rating
    const autoRating = Math.round(s.reduce((a, b) => a + b, 0) / 6);

    const p = {
        id: editingPlayerId || Date.now(),
        name: name,
        pos: document.getElementById('edit-pos').value.toUpperCase() || "??",
        rating: autoRating,
        stats: s,
        img: document.getElementById('edit-img-url').value // Speichert die Bild-URL
    };

    if (editingPlayerId) playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    else playersData.push(p);

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
    addMessage("Toni", `Analyse abgeschlossen: ${p.name} (Rating: ${autoRating}) gespeichert.`);
}

function deletePlayer() {
    if (confirm("Spieler wirklich löschen?")) {
        playersData = playersData.filter(x => x.id !== editingPlayerId);
        localStorage.setItem('toni_players', JSON.stringify(playersData));
        closePlayerModal();
        renderLockerRoom();
    }
}

function closePlayerModal() { document.getElementById('player-modal').style.display = "none"; }

/* ==========================================================
   4. TAKTIK-BOARD ENGINE (PITCH)
   ========================================================== */

let canvas, ctx, pitchPlayers = [], zones = [];
let dragging = false, activeP = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Zeichnung
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außen
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke(); // Mitte
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke(); // Kreis

    const boxW = canvas.width * 0.65;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, 80); // Oben
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - 90, boxW, 80); // Unten
    
    // Strategische Zonen
    zones.forEach(z => { ctx.fillStyle = z.c; ctx.fillRect(z.x, z.y, z.w, z.h); });

    // Spieler-Markierungen
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 11px Inter"; ctx.fillText(p.l, p.x - 12, p.y + 32);
    });
}

function setFormation(type) {
    pitchPlayers = []; zones = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        zones.push({ x: 10, y: h * 0.4, w: w - 20, h: h * 0.2, c: "rgba(34, 197, 94, 0.25)", l: "PRESSING" });
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.5, l: "MF", c: color }));
        [0.4, 0.6].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.25, l: "ST", c: color }));
    } else {
        [0.25, 0.5, 0.75].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.4, l: "MF", c: color }));
        [0.2, 0.5, 0.8].forEach(x => pitchPlayers.push({ x: w * x, y: h * 0.2, l: "ST", c: color }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, l: "TW", c: color });
    drawBoard();
}

function clearBoard() { pitchPlayers = []; zones = []; drawBoard(); }

function startDrag(e) {
    const pos = getPos(e);
    activeP = pitchPlayers.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
    if (activeP) dragging = true;
}
function doDrag(e) { if (!dragging) return; const pos = getPos(e); activeP.x = pos.x; activeP.y = pos.y; drawBoard(); }
function stopDrag() { dragging = false; activeP = null; }
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
}

/* ==========================================================
   5. TONI CHAT & VOICE
   ========================================================== */

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const d = document.createElement('div');
    d.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    d.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(d);
    history.scrollTop = history.scrollHeight;
}

function toggleVoice() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Browser inkompatibel");
    const rec = new Speech(); rec.lang = 'de-DE'; rec.start();
    rec.onresult = (e) => {
        const t = e.results[0][0].transcript.toLowerCase();
        addMessage("Du", t);
        if (t.includes("taktik")) showModule('tactics');
        if (t.includes("kabine")) showModule('dashboard');
    };
}
