/* ==========================================================
   TONI 2.0 - MASTER ENGINE (DEEP-FIX EDITION)
   ========================================================== */

// 1. MUSTERDATEN ERZWINGEN
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) return parsed;
        } catch (e) { console.error("Toni: Speicher-Reset"); }
    }
    return [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
        { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" }
    ];
}

let playersData = getInitialPlayers();
let editingPlayerId = null;

window.onload = () => {
    console.log("Toni 2.0: System gestartet...");
    
    // Modal initial verstecken
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');

    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    
    renderLockerRoom();
    showModule('dashboard'); 
};

/* ==========================================================
   MODUL-STEUERUNG (KEIN ÜBERLAPPEN)
   ========================================================== */

function showModule(moduleId) {
    console.log("Wechsle zu Modul:", moduleId);
    
    // Alle Sektionen unsichtbar
    document.querySelectorAll('.module-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Buttons in der Sidebar markieren
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => 
        b.getAttribute('onclick') && b.getAttribute('onclick').includes(moduleId)
    );
    if (btn) btn.classList.add('active');

    // Taktik-Board bei jedem Klick neu zeichnen
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 200);
    }
}

/* ==========================================================
   KABINE: BEARBEITEN-FUNKTION (FIX)
   ========================================================== */

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

function openPlayerModal(id = null) {
    console.log("Toni: Öffne Editor für ID", id); // DEBUG-LOG
    
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    if (!modal) {
        console.error("Fehler: Element 'player-modal' wurde im HTML nicht gefunden!");
        return;
    }
    
    modal.classList.add('active');

    if (id) {
        const p = playersData.find(x => x.id === id);
        if (p) {
            // Werte in die Input-Felder schreiben
            document.getElementById('edit-name').value = p.name || "";
            document.getElementById('edit-pos').value = p.pos || "";
            document.getElementById('edit-rating').value = p.rating || "";
            
            const s = p.stats || [50, 50, 50, 50, 50, 50];
            document.getElementById('edit-tem').value = s[0];
            document.getElementById('edit-sch').value = s[1];
            document.getElementById('edit-pas').value = s[2];
            document.getElementById('edit-dri').value = s[3];
            document.getElementById('edit-def').value = s[4];
            document.getElementById('edit-phy').value = s[5];
        }
    }
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

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

    const p = {
        id: editingPlayerId || Date.now(),
        name: name,
        pos: document.getElementById('edit-pos').value.toUpperCase(),
        rating: Math.round(s.reduce((a,b) => a+b, 0) / 6),
        stats: s,
        img: document.getElementById('edit-img-url').value
    };

    if (editingPlayerId) {
        playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    } else {
        playersData.push(p);
    }

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
}

/* ==========================================================
   TAKTIK-BOARD (MACBOOK-FIX MIT TOREN)
   ========================================================== */

let canvas, ctx, pitchPlayers = [];

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Fix: Immer die aktuelle Container-Größe nehmen
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Linien
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // TORE (Fett und Weiß)
    ctx.lineWidth = 10;
    ctx.beginPath();
    // Tor oben
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10);
    // Tor unten
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10);
    ctx.stroke();

    // Mittelkreis
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2); ctx.stroke();

    // Spieler
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 12px Arial"; ctx.fillText(p.l, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: "#ef4444" }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, l: "ST", c: "#ef4444" }));
        pitchPlayers.push({ x: w/2, y: h-45, l: "TW", c: "#ef4444" });
    }
    drawBoard();
}
