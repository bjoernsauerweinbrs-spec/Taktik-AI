/* ==========================================================
   TONI 2.0 - MASTER ENGINE (UNGEKÜRZT & BUG-FIXED)
   ========================================================== */

/**
 * 1. DATEN-SICHERUNG & INITIALISIERUNG
 * Stellt sicher, dass stats[0] niemals undefined ist.
 */
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) return parsed;
        } catch (e) {
            console.error("Datenkorruption erkannt, lade Musterkader...");
        }
    }

    // Elite-Musterkader für den ersten Start (Screenshot Fix)
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

/**
 * WINDOW ONLOAD
 * Initialisiert das System und versteckt das Modal.
 */
window.onload = () => {
    // 1. Modal knallhart verstecken (Screenshot 14:24:04 Fix)
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');

    // 2. Speicher synchronisieren
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }

    // 3. Ansicht rendern
    renderLockerRoom();
    showModule('dashboard'); 
    
    addMessage("Toni", "Elite System 2.0 aktiv. Daten-Integrität geprüft.");
};

/* ==========================================================
   2. NAVIGATION (ANTI-STAPEL-LOGIK)
   ========================================================== */

function showModule(moduleId) {
    // Alle Bereiche ausblenden
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; // Zusätzliche Sicherheit gegen Überlappung
    });

    // Sidebar-Buttons zurücksetzen
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Ziel-Modul aktivieren
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        document.querySelector('.main-content').scrollTop = 0;
    }

    // Aktiven Button markieren
    const activeBtn = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(moduleId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Taktik-Initialisierung
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

function toggleToni() {
    document.body.classList.toggle('toni-collapsed');
    if (document.getElementById('tactics').classList.contains('active')) {
        setTimeout(initBoard, 300);
    }
}

/* ==========================================================
   3. KABINE & FIFA-CARDS (UNCAUGHT TYPEERROR FIX)
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    // Sicherheits-Check gegen leere Daten
    if (playersData.length === 0) {
        playersData = getInitialPlayers();
    }

    container.innerHTML = playersData.map(p => {
        // Falls stats aus irgendeinem Grund fehlen, Fallback setzen
        const s = p.stats || [50, 50, 50, 50, 50, 50];
        
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

/* ==========================================================
   4. PLAYER MODAL STEUERUNG
   ========================================================== */

function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.classList.add('active');
    
    const ratingInput = document.getElementById('edit-rating');
    if (ratingInput) ratingInput.readOnly = true;

    if (id) {
        const p = playersData.find(x => x.id === id);
        if (!p) return;

        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-pos').value = p.pos;
        document.getElementById('edit-rating').value = p.rating;
        document.getElementById('edit-img-url').value = p.img || "";
        
        const s = p.stats || [50, 50, 50, 50, 50, 50];
        document.getElementById('edit-tem').value = s[0];
        document.getElementById('edit-sch').value = s[1];
        document.getElementById('edit-pas').value = s[2];
        document.getElementById('edit-dri').value = s[3];
        document.getElementById('edit-def').value = s[4];
        document.getElementById('edit-phy').value = s[5];
        
        document.getElementById('btn-delete').style.display = "block";
    } else {
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

function savePlayer() {
    const nameInput = document.getElementById('edit-name');
    if (!nameInput || !nameInput.value) return;

    const stats = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    const autoRating = Math.round(stats.reduce((a, b) => a + b, 0) / 6);

    const newP = {
        id: editingPlayerId || Date.now(),
        name: nameInput.value,
        pos: document.getElementById('edit-pos').value.toUpperCase() || "??",
        rating: autoRating,
        stats: stats,
        img: document.getElementById('edit-img-url').value
    };

    if (editingPlayerId) {
        playersData = playersData.map(x => x.id === editingPlayerId ? newP : x);
    } else {
        playersData.push(newP);
    }

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

/* ==========================================================
   5. TAKTIK-BOARD (MACBOOK RATIO FIX)
   ========================================================== */

let canvas, ctx, pitchPlayers = [];
let isDragging = false, dragTarget = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // MacBook Scaling Fix
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Mouse & Touch
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Feld-Linien
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Tore (Fix Screenshot 3)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.38, 10); ctx.lineTo(canvas.width * 0.62, 10);
    ctx.moveTo(canvas.width * 0.38, canvas.height - 10); ctx.lineTo(canvas.width * 0.62, canvas.height - 10);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

    // Spieler
    pitchPlayers.forEach(p => {
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText(p.l, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    const col = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: col }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.52, l: "MF", c: col }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.28, l: "ST", c: col }));
    } else {
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: col }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.45, l: "MF", c: col }));
        [0.2, 0.5, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.22, l: "ST", c: col }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 50, l: "TW", c: col });
    drawBoard();
}

/* --- DRAG LOGIK --- */
function startDrag(e) {
    const pos = getMousePos(e);
    dragTarget = pitchPlayers.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
    if (dragTarget) isDragging = true;
}
function doDrag(e) {
    if (!isDragging) return;
    const pos = getMousePos(e);
    dragTarget.x = pos.x; dragTarget.y = pos.y;
    drawBoard();
}
function stopDrag() { isDragging = false; dragTarget = null; }
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
}

/* ==========================================================
   6. TONI CHAT UTILS
   ========================================================== */

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}
