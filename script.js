/* ==========================================================
   1. GLOBALER SPEICHER & INITIALISIERUNG
   ========================================================== */

// Spieler-Daten mit allen 6 Attributen (TEM, SCH, PAS, DRI, DEF, PHY)
let playersData = JSON.parse(localStorage.getItem('toni_players')) || [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 82, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] }
];

let editingPlayerId = null;

// Initialer Start beim Laden der Seite
window.onload = () => {
    renderLockerRoom();
    addMessage("Toni", "Elite Performance System aktiv. Alle Module synchronisiert.");
    // Falls ein Modul in der URL steht oder Standard:
    showModule('dashboard');
};

/* ==========================================================
   2. NAVIGATION & UI-STEUERUNG
   ========================================================== */

function showModule(moduleId) {
    // Verhindert das "Stapeln": Alle Sektionen verstecken
    const sections = document.querySelectorAll('.module-section');
    sections.forEach(s => s.classList.remove('active'));

    // Buttons in der Sidebar aktualisieren
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));

    // Ziel-Sektion aktivieren
    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        // Scrollt nach oben, wichtig für Smartphone
        document.querySelector('.main-content').scrollTop = 0;
    }

    // Aktiven Button markieren
    const activeBtn = Array.from(buttons).find(btn => 
        btn.getAttribute('onclick').includes(moduleId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Spezielle Initialisierungen beim Wechsel
    if (moduleId === 'tactics') {
        setTimeout(initBoard, 150);
    }
}

// Toni AI ein- und ausklappen für mehr Platz (besonders auf Handy/Taktik)
function toggleToni() {
    document.body.classList.toggle('toni-collapsed');
    // Canvas-Größe nach dem Einklappen korrigieren
    if (document.getElementById('tactics').classList.contains('active')) {
        setTimeout(initBoard, 300);
    }
}

/* ==========================================================
   3. MANNSCHAFTSKABINE (SPIELER-VERWALTUNG / CRUD)
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;
    
    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
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
    const modal = document.getElementById('player-modal');
    modal.style.display = "flex"; // Nutzt Flex für Zentrierung
    
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
        document.getElementById('btn-delete').style.display = "block";
    } else {
        document.getElementById('modal-title').innerText = "Neuer Spieler";
        document.querySelectorAll('#player-modal input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return alert("Name erforderlich!");

    const p = {
        id: editingPlayerId || Date.now(),
        name: name,
        pos: document.getElementById('edit-pos').value.toUpperCase(),
        rating: document.getElementById('edit-rating').value,
        stats: [
            document.getElementById('edit-tem').value || 50,
            document.getElementById('edit-sch').value || 50,
            document.getElementById('edit-pas').value || 50,
            document.getElementById('edit-dri').value || 50,
            document.getElementById('edit-def').value || 50,
            document.getElementById('edit-phy').value || 50
        ]
    };

    if (editingPlayerId) {
        playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    } else {
        playersData.push(p);
    }

    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal();
    renderLockerRoom();
    addMessage("Toni", `${p.name} wurde im Kader aktualisiert.`);
}

function deletePlayer() {
    if (confirm("Spieler wirklich aus dem Kader entfernen?")) {
        playersData = playersData.filter(x => x.id !== editingPlayerId);
        localStorage.setItem('toni_players', JSON.stringify(playersData));
        closePlayerModal();
        renderLockerRoom();
        addMessage("Toni", "Spieler wurde gelöscht.");
    }
}

function closePlayerModal() {
    document.getElementById('player-modal').style.display = "none";
}

/* ==========================================================
   4. ELITE TAKTIK-BOARD (ENGINE)
   ========================================================== */

let canvas, ctx, pitchPlayers = [], zones = [];
let dragging = false, activeP = null;

function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // Canvas-Größe an Container anpassen
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Maus- & Touch-Events
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
    
    if (pitchPlayers.length === 0) setFormation('4-4-2');
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spielfeld-Linien (Weiß)
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    
    // Außenlinie
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Mittellinie & Kreis
    ctx.beginPath();
    ctx.moveTo(10, canvas.height / 2);
    ctx.lineTo(canvas.width - 10, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2);
    ctx.stroke();

    // Strafräume
    const boxW = canvas.width * 0.65;
    ctx.strokeRect((canvas.width - boxW) / 2, 10, boxW, 80); // Oben
    ctx.strokeRect((canvas.width - boxW) / 2, canvas.height - 90, boxW, 80); // Unten
    
    // Tore
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10);
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10);
    ctx.stroke();
    ctx.lineWidth = 2;

    // Strategische Zonen zeichnen
    zones.forEach(z => {
        ctx.fillStyle = z.c;
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "white";
        ctx.font = "italic 11px Inter";
        ctx.fillText(z.l, z.x + 10, z.y + 20);
    });

    // Spieler zeichnen
    pitchPlayers.forEach(p => {
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Inter";
        ctx.fillText(p.l, p.x - 12, p.y + 32);
    });
}

function setFormation(type) {
    pitchPlayers = []; zones = [];
    const w = canvas.width, h = canvas.height;
    const color = type === '4-4-2' ? '#ef4444' : '#3b82f6';

    if (type === '4-4-2') {
        zones.push({ x: 10, y: h * 0.4, w: w - 20, h: h * 0.2, c: "rgba(34, 197, 94, 0.25)", l: "PRESSING-ZONE" });
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.5, l: "MF", c: color }));
        [0.4, 0.6].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, l: "ST", c: color }));
    } else {
        zones.push({ x: 10, y: 10, w: w * 0.15, h: h - 20, c: "rgba(59, 130, 246, 0.2)", l: "FLÜGEL" });
        zones.push({ x: w * 0.85, y: 10, w: w * 0.15, h: h - 20, c: "rgba(59, 130, 246, 0.2)", l: "FLÜGEL" });
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, l: "ABW", c: color }));
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.4, l: "MF", c: color }));
        [0.2, 0.5, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.2, l: "ST", c: color }));
    }
    pitchPlayers.push({ x: w / 2, y: h - 45, l: "TW", c: color });
    drawBoard();
    addMessage("Toni", `Formation ${type} aufgestellt. Analyse der Laufwege aktiv.`);
}

function clearBoard() {
    pitchPlayers = []; zones = [];
    drawBoard();
}

/* --- DRAG & DROP LOGIK --- */
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
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
}

/* ==========================================================
   5. TONI AI INTERAKTION (CHAT & VOICE)
   ========================================================== */

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    
    const div = document.createElement('div');
    div.className = `message msg-${sender.toLowerCase() === 'toni' ? 'toni' : 'user'}`;
    div.innerHTML = `<b>${sender}:</b> ${text}`;
    history.appendChild(div);
    
    // Auto-Scroll
    history.scrollTop = history.scrollHeight;
}

// Sprachsteuerung (Web Speech API)
function toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser unterstützt keine Sprachsteuerung.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.start();

    addMessage("System", "Toni hört zu...");

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage("Du", transcript);
        processCommand(transcript.toLowerCase());
    };
}

function processCommand(cmd) {
    if (cmd.includes("taktik") || cmd.includes("board")) showModule('tactics');
    else if (cmd.includes("kabine") || cmd.includes("spieler")) showModule('dashboard');
    else if (cmd.includes("finanz") || cmd.includes("geld")) showModule('management');
    else if (cmd.includes("labor") || cmd.includes("werte")) showModule('bio');
    else if (cmd.includes("formation 4-4-2")) setFormation('4-4-2');
    else addMessage("Toni", "Befehl erkannt. Analysiere Umsetzung...");
}

// Texteingabe-Event
document.getElementById('text-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && this.value) {
        addMessage("Du", this.value);
        processCommand(this.value.toLowerCase());
        this.value = '';
    }
});
