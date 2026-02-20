/* ==========================================================
   TONI 2.0 - MASTER ENGINE (FEHLERFREI & UNGEKÜRZT)
   ========================================================== */

/**
 * 1. DATEN-INITIALISIERUNG
 */
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.length > 0) return parsed;
        } catch (e) { console.error("Daten-Reset erforderlich"); }
    }

    // Elite-Musterkader (Sorgt für FIFA-Karten beim Start)
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
    // Sicherheit: Modal beim Start knallhart verstecken
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');

    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    
    renderLockerRoom();
    showModule('dashboard'); 
    
    if (typeof addMessage === 'function') {
        addMessage("Toni", "Elite System 2.0 online. Analyse-Modul einsatzbereit.");
    }
};

/* ==========================================================
   2. NAVIGATION (KEIN STAPELN MEHR)
   ========================================================== */

function showModule(moduleId) {
    // Alle Sektionen unsichtbar machen
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    // Ziel-Sektion aktivieren
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Sidebar-Buttons markieren
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));
    
    const activeBtn = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(moduleId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Taktik-Initialisierung bei Wechsel
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

/* ==========================================================
   3. KABINE: FIFA-KARTEN RENDERN & EDITIEREN
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => {
        // Fallback für fehlende Stats (Verhindert Error)
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

/**
 * Öffnet den Editor für einen Spieler (Klick-Fix)
 */
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    if (!modal) return;
    
    modal.classList.add('active'); // CSS sorgt für Sichtbarkeit

    if (id) {
        const p = playersData.find(x => x.id === id);
        if (p) {
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
        }
    } else {
        // Felder leeren für neuen Spieler
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
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

    const autoRating = Math.round(s.reduce((a, b) => a + b, 0) / 6);

    const p = {
        id: editingPlayerId || Date.now(),
        name: name,
        pos: document.getElementById('edit-pos').value.toUpperCase() || "??",
        rating: autoRating,
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
   4. TAKTIK-BOARD (MACBOOK SCALING & TORE)
   ========================================================== */

let canvas, ctx, pitchPlayers = [];

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Scaling-Fix: MacBook Container-Größe auslesen
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
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außen
    
    // TORE ZEICHNEN (Fett & Sichtbar)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10); // Tor Oben
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10); // Tor Unten
    ctx.stroke();

    // Mittel-Linie & Kreis
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

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
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: color }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, l: "ST", c: color }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, l: "TW", c: color });
    drawBoard();
}

/* ==========================================================
   5. CHAT SYSTEM
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
