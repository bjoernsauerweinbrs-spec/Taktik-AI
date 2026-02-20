/* ==========================================================
   TONI 2.0 - MASTER ENGINE (HEAVYWEIGHT UNGEKÜRZT)
   ========================================================== */

/**
 * 1. DATEN-INITIALISIERUNG
 * Stellt sicher, dass immer Spieler vorhanden sind.
 */
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    
    // Hard-Check: Wenn nichts da ist oder die Liste leer ist, Musterspieler laden
    if (!saved || JSON.parse(saved).length === 0) {
        console.log("Toni 2.0: Lade Elite-Musterkader...");
        return [
            { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
            { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
            { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" },
            { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], img: "" },
            { id: 105, name: "A. Fischer", pos: "LM", rating: 86, stats: [92, 78, 82, 88, 50, 70], img: "" }
        ];
    }
    return JSON.parse(saved);
}

let playersData = getInitialPlayers();
let editingPlayerId = null;

/**
 * START-ROUTINE
 * Wird beim Laden der Seite ausgeführt.
 */
window.onload = () => {
    // 1. Sicherheit: Modal knallhart schließen
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');

    // 2. Speicher prüfen und ggf. füllen
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }

    // 3. UI Rendern
    renderLockerRoom();
    
    // 4. Start-Modul setzen
    showModule('dashboard'); 
    
    addMessage("Toni", "Elite System 2.0 erfolgreich synchronisiert. Alle kognitiven Module sind aktiv.");
};

/* ==========================================================
   2. NAVIGATION & MODUL-STEUERUNG
   ========================================================== */

/**
 * Wechselt zwischen den Bereichen und verhindert das "Stapeln".
 */
function showModule(moduleId) {
    // Alle Sektionen deaktivieren
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; // Zusätzliche Sicherheit
    });

    // Alle Nav-Buttons zurücksetzen
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Ziel-Sektion aktivieren
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
        // Scroll-Fix für MacBook/Smartphone
        document.querySelector('.main-content').scrollTop = 0;
    }

    // Den richtigen Button in der Sidebar markieren
    const activeBtn = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(moduleId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Taktikboard braucht Initialisierung nach dem Einblenden
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

/**
 * Klappt das Toni-Interface ein/aus (Toni-Toggle).
 */
function toggleToni() {
    document.body.classList.toggle('toni-collapsed');
    // Canvas-Größe bei Taktik korrigieren
    if (document.getElementById('tactics').classList.contains('active')) {
        setTimeout(initBoard, 300);
    }
}

/* ==========================================================
   3. KABINEN-LOGIK (FIFA-CARDS)
   ========================================================== */

/**
 * Erzeugt die interaktiven FIFA-Karten basierend auf playersData.
 */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    // Falls die Liste leer ist (Sicherheitsnetz)
    if (playersData.length === 0) {
        playersData = getInitialPlayers();
    }

    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            
            <div class="card-img-container">
                ${p.img ? `<img src="${p.img}" alt="${p.name}">` : '<span style="font-size:35px;">👤</span>'}
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

/**
 * Modal zum Bearbeiten öffnen.
 */
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.classList.add('active');
    
    // Rating-Feld ist Read-Only (Toni berechnet)
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

/**
 * Speichern-Logik mit automatischer Rating-Berechnung.
 */
function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;

    // 1. Stats erfassen
    const s = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    // 2. Durchschnitt berechnen (Auto-Rating)
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
    addMessage("Toni", `${p.name} wurde aktualisiert. Rating: ${autoRating}`);
}

function deletePlayer() {
    if (confirm("Spieler wirklich löschen?")) {
        playersData = playersData.filter(x => x.id !== editingPlayerId);
        localStorage.setItem('toni_players', JSON.stringify(playersData));
        closePlayerModal();
        renderLockerRoom();
    }
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

/* ==========================================================
   4. TAKTIK-ENGINE (PROFI-BOARD)
   ========================================================== */

let canvas, ctx, pitchPlayers = [], zones = [];
let dragging = false, activeP = null;

/**
 * Initialisiert das Board und passt die Größe an das MacBook/Screen an.
 */
function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Scaling-Fix: Nutzt die reale Container-Größe
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Events für Drag & Drop
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

/**
 * Zeichnet das Feld inklusive der Tore (Fix für Sichtbarkeit).
 */
function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Linien
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20); // Außenlinie
    
    // TORE ZEICHNEN (Dicke Linien oben/unten)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10); // Tor Oben
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10); // Tor Unten
    ctx.stroke();

    // Spielfeld-Elemente (Mitte, Kreis)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2); ctx.lineTo(canvas.width - 10, canvas.height / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2); ctx.stroke();

    // Strafräume
    const boxW = canvas.width * 0.65;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, 80); 
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - 90, boxW, 80);

    // Spieler zeichnen
    pitchPlayers.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText(p.l, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.5, l: "MF", c: color }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, l: "ST", c: color }));
    } else {
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.4, l: "MF", c: color }));
        [0.2, 0.5, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.2, l: "ST", c: color }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, l: "TW", c: color });
    drawBoard();
}

/* --- DRAG LOGIK --- */
function startDrag(e) {
    const pos = getPos(e);
    activeP = pitchPlayers.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
    if (activeP) dragging = true;
}
function doDrag(e) {
    if (!dragging) return;
    const pos = getPos(e);
    activeP.x = pos.x; activeP.y = pos.y;
    drawBoard();
}
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
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function toggleVoice() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Speech) return alert("Browser unterstützt keine Sprachsteuerung.");
    const recognition = new Speech();
    recognition.lang = 'de-DE';
    recognition.start();
    addMessage("System", "Toni hört zu...");
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        addMessage("Du", transcript);
        if (transcript.includes("taktik")) showModule('tactics');
        if (transcript.includes("kabine")) showModule('dashboard');
    };
}
