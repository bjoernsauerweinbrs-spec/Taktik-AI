/* ==========================================================
   1. CORE STORAGE & INITIALISIERUNG
   ========================================================== */

/**
 * Initialisiert den Kader. Erstellt Muster-Spieler, falls 
 * der lokale Speicher noch leer ist.
 */
function getInitialPlayers() {
    const saved = localStorage.getItem('toni_players');
    if (saved) {
        return JSON.parse(saved);
    }

    // Hochprofessioneller Muster-Kader für den ersten Start
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
 * Start-Routine: Lädt den Kader und schaltet auf das Dashboard.
 */
window.onload = () => {
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(playersData));
    }
    renderLockerRoom();
    showModule('dashboard'); 
    addMessage("Toni", "Elite Performance System bereit. Analyse-Protokoll gestartet.");
};

/* ==========================================================
   2. INTERFACE & NAVIGATION
   ========================================================== */

/**
 * Wechselt zwischen den Modulen und verhindert das "Stapeln".
 */
function showModule(moduleId) {
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => s.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        // Sorgt für sauberes Scrollen auf Smartphones
        document.querySelector('.main-content').scrollTop = 0;
    }

    // Aktiven Nav-Button markieren
    const activeBtn = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(moduleId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Taktik-Initialisierung braucht einen Moment für das Canvas-Rendering
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

/**
 * Klappt das Toni-Interface ein/aus (Toni-Toggle).
 */
function toggleToni() {
    document.body.classList.toggle('toni-collapsed');
    if (document.getElementById('tactics').classList.contains('active')) {
        setTimeout(initBoard, 300);
    }
}

/* ==========================================================
   3. SPIELER-KABINE (CRUD & AUTO-RATING)
   ========================================================== */

/**
 * Erzeugt die FIFA-Karten in der Kabine.
 */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            
            <div style="height:65px; width:65px; margin:10px auto; border-radius:50%; overflow:hidden; background:rgba(0,0,0,0.1); display:flex; align-items:center; justify-content:center; border: 2px solid rgba(255,255,255,0.2);">
                ${p.img ? `<img src="${p.img}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:35px;">👤</span>'}
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
 * Öffnet das Modal zum Bearbeiten oder Erstellen von Spielern.
 */
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.style.display = "flex";
    
    // Rating-Feld ist Read-Only, da Toni rechnet
    const ratingInput = document.getElementById('edit-rating');

    if (id) {
        const p = playersData.find(x => x.id === id);
        document.getElementById('modal-title').innerText = "Spieler-Profil bearbeiten";
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
        document.getElementById('modal-title').innerText = "Neuen Spieler erstellen";
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

/**
 * Speichert den Spieler und berechnet automatisch das Rating.
 */
function savePlayer() {
    const nameInput = document.getElementById('edit-name').value;
    if (!nameInput) {
        alert("Bitte einen Namen eingeben!");
        return;
    }

    // 1. Die 6 FIFA-Stats erfassen
    const s = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    // 2. Mathematische Rating-Berechnung (Durchschnitt)
    const calculatedRating = Math.round(s.reduce((a, b) => a + b, 0) / 6);

    const newPlayer = {
        id: editingPlayerId || Date.now(),
        name: nameInput,
        pos: document.getElementById('edit-pos').value.toUpperCase() || "??",
        rating: calculatedRating,
        stats: s,
        img: document.getElementById('edit-img-url').value
    };

    if (editingPlayerId) {
        playersData = playersData.map(x => x.id === editingPlayerId ? newPlayer : x);
    } else {
        playersData.push(newPlayer);
    }

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
    addMessage("Toni", `Analyse für ${newPlayer.name} abgeschlossen. Rating: ${calculatedRating}.`);
}

function deletePlayer() {
    if (confirm("Möchtest du diesen Spieler wirklich unwiderruflich löschen?")) {
        playersData = playersData.filter(x => x.id !== editingPlayerId);
        localStorage.setItem('toni_players', JSON.stringify(playersData));
        closePlayerModal();
        renderLockerRoom();
        addMessage("Toni", "Spieler wurde aus dem Kader entfernt.");
    }
}

function closePlayerModal() {
    document.getElementById('player-modal').style.display = "none";
}

/* ==========================================================
   4. ELITE TAKTIK-ENGINE (canvas Drawing)
   ========================================================== */

let canvas, ctx, pitchPlayers = [], zones = [];
let dragging = false, activePlayer = null;

/**
 * Initialisiert das Taktikfeld und passt es an die Containergröße an.
 */
function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Wichtig für Smartphone: Canvas-Pixel an CSS-Größe anpassen
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Touch & Maus Support
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

/**
 * Zeichnet das Spielfeld mit allen Linien, Toren und Zonen.
 */
function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Markierungen
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    
    // Außenlinien
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Mittellinie & Anstoßkreis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2);
    ctx.stroke();

    // Strafräume (16m)
    const boxWidth = canvas.width * 0.65;
    ctx.strokeRect((canvas.width - boxWidth) / 2, 10, boxWidth, 80); // Oben
    ctx.strokeRect((canvas.width - boxWidth) / 2, canvas.height - 90, boxWidth, 80); // Unten
    
    // Strategische Zonen zeichnen (falls vorhanden)
    zones.forEach(z => {
        ctx.fillStyle = z.color;
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "white";
        ctx.font = "italic 11px Arial";
        ctx.fillText(z.label, z.x + 10, z.y + 20);
    });

    // Spieler-Markierungen auf dem Feld
    pitchPlayers.forEach(p => {
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Arial";
        ctx.fillText(p.label, p.x - 12, p.y + 35);
    });
}

function setFormation(type) {
    pitchPlayers = []; zones = [];
    const w = canvas.width, h = canvas.height;
    const teamColor = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        zones.push({ x: 10, y: h * 0.4, w: w - 20, h: h * 0.2, color: "rgba(34, 197, 94, 0.2)", label: "PRESSING" });
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, label: "ABW", color: teamColor }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.5, label: "MF", color: teamColor }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, label: "ST", color: teamColor }));
    } else {
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, label: "ABW", color: teamColor }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.4, label: "MF", color: teamColor }));
        [0.2, 0.5, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.2, label: "ST", color: teamColor }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, label: "TW", color: teamColor });
    drawBoard();
}

function clearBoard() { pitchPlayers = []; zones = []; drawBoard(); }

function startDrag(e) {
    const pos = getPos(e);
    activePlayer = pitchPlayers.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < 25);
    if (activePlayer) dragging = true;
}
function doDrag(e) {
    if (!dragging) return;
    const pos = getPos(e);
    activePlayer.x = pos.x; activePlayer.y = pos.y;
    drawBoard();
}
function stopDrag() { dragging = false; activePlayer = null; }
function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
}

/* ==========================================================
   5. TONI AI CHAT & VOICE INTERFACE
   ========================================================== */

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    msgDiv.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(msgDiv);
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
