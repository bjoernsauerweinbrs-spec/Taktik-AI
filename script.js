/* ==========================================================
   TONI 2.0 | ELITE COMMAND CORE (UNABRIDGED)
   ========================================================== */

/**
 * GLOBAL DATA STORE & STATE MANAGEMENT
 */
const eliteStore = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [12, 14, 15, 12, 18, 20, 15], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 6, 5, 8, 5, 7, 6], img: "" },
        { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 12, 11, 10, 12, 11, 13], img: "" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], load: [8, 9, 8, 10, 8, 9, 8], img: "" },
        { id: 105, name: "A. Fischer", pos: "LM", rating: 86, stats: [92, 78, 82, 88, 50, 70], load: [15, 16, 14, 15, 17, 18, 16], img: "" }
    ],
    formation: { home: '4-4-2', away: '3-4-3' },
    activeModule: 'vr-center',
    metrics: { control: 0, scanning: 0 }
};

let editingPlayerId = null;

/**
 * INITIALISIERUNG
 */
window.onload = () => {
    console.log("TONI 2.0 Elite-System initialisiert.");
    
    // UI-Setup
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');
    
    // Daten-Persistenz
    if (!localStorage.getItem('toni_players')) {
        localStorage.setItem('toni_players', JSON.stringify(eliteStore.players));
    }

    renderLockerRoom();
    showModule('vr-center');
    
    // Startet die Uhr im Dashboard
    setInterval(updateSystemClock, 1000);
};

/* ==========================================================
   MODULE NAVIGATION (ANTI-STAPEL-LOGIK)
   ========================================================== */

function showModule(modId) {
    document.querySelectorAll('.module-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const target = document.getElementById(modId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // Sidebar-Aktivierung
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => 
        b.getAttribute('onclick').includes(modId)
    );
    if (activeBtn) activeBtn.classList.add('active');

    // Modul-spezifische Initialisierung
    if (modId === 'vr-center') setTimeout(initVR, 150);
    if (modId === 'mgmt-lab' && typeof mgmt !== 'undefined') mgmt.render();
}

/* ==========================================================
   VR ANALYSIS CENTER (PITCH CONTROL & PASSING LANES)
   ========================================================== */

let canvas, ctx, pitchPlayers = [];

function initVR() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // MacBook Retina / Screen Scaling
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Simulation zurücksetzen und neu befüllen
    pitchPlayers = [];
    setFormation(eliteStore.formation.home, '#ef4444', 'TONI');
    setFormation(eliteStore.formation.away, '#3b82f6', 'OPP');
    
    drawElitePitch();
}

function drawElitePitch() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Spielfeld-Geometrie
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Tore (Massiv weiß)
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.38, 10); ctx.lineTo(canvas.width * 0.62, 10);
    ctx.moveTo(canvas.width * 0.38, canvas.height - 10); ctx.lineTo(canvas.width * 0.62, canvas.height - 10);
    ctx.stroke();

    // 2. Passing Lane Analysis
    drawPassingLanes();

    // 3. Spieler & Scanning Cones
    pitchPlayers.forEach(p => {
        // Schatten für Tiefenwirkung
        ctx.shadowBlur = 15; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Scanning Cone Simulation
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, 70, -Math.PI/4, Math.PI/4);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "center";
        ctx.fillText(p.team, p.x, p.y + 32);
    });
}

function drawPassingLanes() {
    ctx.setLineDash([5, 5]);
    pitchPlayers.filter(p => p.team === 'TONI').forEach(p1 => {
        pitchPlayers.filter(p => p.team === 'TONI').forEach(p2 => {
            if (p1 === p2) return;
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 220) {
                ctx.strokeStyle = "rgba(34, 197, 94, 0.3)"; // Grüne Lanes für sichere Optionen
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
        });
    });
    ctx.setLineDash([]);
}

/* ==========================================================
   LOCKER ROOM (FIFA CARDS & MEDICAL ACWR)
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = eliteStore.players.map(p => {
        const acwr = calculateACWR(p.load);
        const statusColor = acwr > 1.5 ? 'var(--danger)' : acwr < 0.8 ? 'var(--accent-blue)' : 'var(--accent-green)';
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
                <div class="medical-badge" style="background:${statusColor}">
                    ACWR: ${acwr.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

function calculateACWR(loadArray) {
    if (!loadArray || loadArray.length < 7) return 1.0;
    const acute = loadArray.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const chronic = loadArray.reduce((a, b) => a + b, 0) / loadArray.length;
    return chronic === 0 ? 0 : acute / chronic;
}

/**
 * PLAYER MODAL LOGIK
 */
function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    const formContainer = document.getElementById('modal-form');
    
    modal.classList.add('active');
    
    const p = id ? eliteStore.players.find(x => x.id === id) : { name: "", pos: "ST", rating: 50, stats: [50,50,50,50,50,50], img: "" };

    formContainer.innerHTML = `
        <div class="elite-form">
            <input type="text" id="edit-name" value="${p.name}" placeholder="Name">
            <input type="text" id="edit-pos" value="${p.pos}" placeholder="Position">
            <div class="stat-inputs">
                <input type="number" id="edit-tem" value="${p.stats[0]}" placeholder="TEM">
                <input type="number" id="edit-sch" value="${p.stats[1]}" placeholder="SCH">
                <input type="number" id="edit-pas" value="${p.stats[2]}" placeholder="PAS">
                <input type="number" id="edit-dri" value="${p.stats[3]}" placeholder="DRI">
                <input type="number" id="edit-def" value="${p.stats[4]}" placeholder="DEF">
                <input type="number" id="edit-phy" value="${p.stats[5]}" placeholder="PHY">
            </div>
            <input type="text" id="edit-img-url" value="${p.img}" placeholder="Bild URL">
        </div>
    `;
}

function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;

    const stats = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    const updated = {
        id: editingPlayerId || Date.now(),
        name,
        pos: document.getElementById('edit-pos').value.toUpperCase(),
        stats,
        rating: Math.round(stats.reduce((a, b) => a + b, 0) / 6),
        img: document.getElementById('edit-img-url').value,
        load: editingPlayerId ? eliteStore.players.find(x => x.id === editingPlayerId).load : [10,10,10,10,10,10,10]
    };

    if (editingPlayerId) {
        eliteStore.players = eliteStore.players.map(x => x.id === editingPlayerId ? updated : x);
    } else {
        eliteStore.players.push(updated);
    }

    localStorage.setItem('toni_players', JSON.stringify(eliteStore.players));
    closePlayerModal();
    renderLockerRoom();
}

function closePlayerModal() {
    document.getElementById('player-modal').classList.remove('active');
}

/* ==========================================================
   VOICE INTELLIGENCE ENGINE (WEB SPEECH)
   ========================================================== */

const voiceEngine = {
    recognition: null,
    isListening: false,
    
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!window.SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.onresult = (e) => {
            const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
            this.processCommand(cmd);
        };
    },

    processCommand: function(cmd) {
        addMessage("User", cmd);
        if (cmd.includes("status") || cmd.includes("raumkontrolle")) {
            this.speak("Die Raumkontrolle ist stabil bei 62 Prozent. Passing-Lanes sind offen.");
        } else if (cmd.includes("simulation")) {
            this.speak("Simulation wird neu berechnet.");
            initVR();
        } else {
            this.speak("Befehl erkannt. Analyse läuft.");
        }
    },

    speak: function(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.85;
        window.speechSynthesis.speak(utterance);
        addMessage("Toni", text);
    },

    toggle: function() {
        if (!this.recognition) this.init();
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            document.getElementById('mic-btn').style.boxShadow = "none";
        } else {
            this.recognition.start();
            this.isListening = true;
            document.getElementById('mic-btn').style.boxShadow = "0 0 15px var(--danger)";
            this.speak("Ich höre zu.");
        }
    }
};

/* ==========================================================
   UTILITIES
   ========================================================== */

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const div = document.createElement('div');
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function updateSystemClock() {
    const clock = document.getElementById('system-clock');
    if (clock) {
        const now = new Date();
        clock.innerText = now.toLocaleString('de-DE').replace(',', ' |');
    }
}

function setFormation(type, color, teamLabel) {
    const w = canvas.width, h = canvas.height;
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.75, c: color, team: teamLabel }));
        pitchPlayers.push({ x: w/2, y: h-50, c: color, team: teamLabel });
    } else {
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.25, c: color, team: teamLabel }));
        pitchPlayers.push({ x: w/2, y: 50, c: color, team: teamLabel });
    }
}
