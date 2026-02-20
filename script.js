/* ==========================================================
   TONI 2.0 | ELITE COMMAND CORE (FULL REPLACEMENT)
   ========================================================== */

/**
 * 1. CENTRAL DATA ENGINE (Single Source of Truth)
 */
const eliteStore = {
    // Kader-Daten mit Belastungshistorie für ACWR
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [15, 12, 18, 20, 15, 12, 19], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 4, 6, 5, 4, 5, 6], img: "" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 10, 11, 12, 10, 9, 11], img: "" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], load: [8, 9, 8, 10, 8, 9, 8], img: "" },
        { id: 105, name: "A. Fischer", pos: "LM", rating: 86, stats: [92, 78, 82, 88, 50, 70], load: [15, 16, 14, 15, 17, 18, 16], img: "" }
    ],
    // Taktik-Vorgaben
    formations: {
        toni: { name: '4-4-2', color: '#22c55e', side: 1 },
        trainer: { name: '3-4-3', color: '#3b82f6', side: -1 }
    },
    activeModule: 'vr-center'
};

let editingPlayerId = null;

/**
 * 2. INITIALISIERUNG BEIM START
 */
window.onload = () => {
    console.log("TONI 2.0 ELITE: System gestartet.");
    updateClock();
    setInterval(updateClock, 1000);
    
    // UI-Elemente initialisieren
    renderLockerRoom();
    showModule('vr-center');
    
    // Voice-Engine initialisieren
    if (typeof voiceEngine !== 'undefined') voiceEngine.init();
};

/* ==========================================================
   3. VR ANALYSIS CENTER (A-FRAME 3D & xG ENGINE)
   ========================================================== */

function init3DPitch() {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    // Reset der Szene (Alte Avatare & Heatmaps löschen)
    document.querySelectorAll('.player-model, .analysis-cell').forEach(el => el.remove());

    // Teams spawnen
    spawnTeam3D(eliteStore.formations.toni);
    spawnTeam3D(eliteStore.formations.trainer);

    // xG Heatmap Grid generieren
    generateHeatmapGrid(scene);
}

function spawnTeam3D(form) {
    const scene = document.querySelector('a-scene');
    const playerPositions = calculatePositions(form.name, form.side);

    playerPositions.forEach((pos, index) => {
        const entity = document.createElement('a-entity');
        entity.setAttribute('class', 'player-model');
        entity.setAttribute('position', `${pos.x} 0.9 ${pos.z}`);
        
        entity.innerHTML = `
            <a-cylinder color="${form.color}" height="1.8" radius="0.5" metalness="0.4"></a-cylinder>
            <a-text value="${index === 0 ? 'GK' : 'ELITE'}" position="0 1.5 0" align="center" scale="2 2 2"></a-text>
            <a-cone color="white" radius-bottom="0.2" radius-top="0" height="0.5" position="0 2.2 0" opacity="0.5"></a-cone>
        `;
        scene.appendChild(entity);
    });
}

function generateHeatmapGrid(scene) {
    for (let x = -30; x <= 30; x += 6) {
        for (let z = -50; z <= 50; z += 7) {
            const xG = calculateXG(x, z);
            const cell = document.createElement('a-plane');
            cell.setAttribute('position', `${x} 0.05 ${z}`);
            cell.setAttribute('rotation', '-90 0 0');
            cell.setAttribute('width', '5.5');
            cell.setAttribute('height', '6.5');
            cell.setAttribute('class', 'analysis-cell');
            // Farbe basierend auf xG (Grün = Hoch, Rot = Geringe Kontrolle)
            const color = xG > 0.4 ? '#22c55e' : '#0f172a';
            cell.setAttribute('material', `color: ${color}; opacity: ${xG * 0.6}; transparent: true; shader: flat`);
            scene.appendChild(cell);
        }
    }
}

function calculateXG(x, z) {
    const dist = Math.hypot(x, z + 52); // Distanz zum Tor
    return Math.max(0.01, Math.min(0.9, 1 / (dist * 0.1)));
}

function calculatePositions(formation, side) {
    const positions = [];
    const w = 30, h = 50 * side;
    
    // Vereinfachte Formations-Logik für 3D Raum
    positions.push({ x: 0, z: h > 0 ? 45 : -45 }); // Keeper
    
    if (formation === '4-4-2') {
        [-15, -5, 5, 15].forEach(x => positions.push({ x: x, z: h * 0.6 })); // Abwehr
        [-15, -5, 5, 15].forEach(x => positions.push({ x: x, z: h * 0.3 })); // Mitte
        [-5, 5].forEach(x => positions.push({ x: x, z: h * 0.1 })); // Sturm
    } else {
        [-12, 0, 12].forEach(x => positions.push({ x: x, z: h * 0.6 })); // 3er Kette
        [-15, -5, 5, 15].forEach(x => positions.push({ x: x, z: h * 0.3 })); // 4er Mitte
        [-10, 0, 10].forEach(x => positions.push({ x: x, z: h * 0.1 })); // 3er Sturm
    }
    return positions;
}

/* ==========================================================
   4. LOCKER ROOM (FIFA CARDS & MEDICAL ACWR)
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = eliteStore.players.map(p => {
        const acute = p.load.slice(-7).reduce((a,b) => a+b, 0) / 7;
        const chronic = p.load.reduce((a,b) => a+b, 0) / p.load.length;
        const acwr = chronic > 0 ? (acute / chronic) : 1.0;

        let statusColor = '#22c55e'; // Green
        if (acwr > 1.3) statusColor = '#eab308'; // Yellow
        if (acwr > 1.5) statusColor = '#ef4444'; // Red

        return `
            <div class="fut-card" onclick="openPlayerModal(${p.id})">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                    <span>PAS: ${p.stats[2]}</span><span>PHY: ${p.stats[5]}</span>
                </div>
                <div class="medical-badge" style="background:${statusColor}">
                    ACWR: ${acwr.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

/* ==========================================================
   5. VOICE INTELLIGENCE (TONI AI ANALYST)
   ========================================================== */

const voiceEngine = {
    recognition: null,
    isListening: false,
    synth: window.speechSynthesis,

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

    toggle: function() {
        if (!this.recognition) this.init();
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            document.getElementById('mic-btn').classList.remove('active');
        } else {
            this.recognition.start();
            this.isListening = true;
            document.getElementById('mic-btn').classList.add('active');
            this.speak("System-Check vollständig. Ich analysiere die Raumkontrolle.");
        }
    },

    processCommand: function(cmd) {
        addMessage("User", cmd);
        if (cmd.includes("status") || cmd.includes("analyse")) {
            this.speak("Die taktische Abdeckung im 4-4-2 ist optimal. xG-Werte im Zentrum steigen.");
        } else if (cmd.includes("kabine") || cmd.includes("spieler")) {
            this.speak("Ich öffne das medizinische Register.");
            showModule('locker-room');
        }
    },

    speak: function(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.85;
        this.synth.speak(msg);
        addMessage("Toni", text);
    }
};

/* ==========================================================
   6. UI & MODULE CONTROLLER
   ========================================================== */

function showModule(modId) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(modId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(modId));
    if (btn) btn.classList.add('active');

    if (modId === 'vr-center') setTimeout(init3DPitch, 100);
    if (modId === 'mgmt-lab' && typeof mgmt !== 'undefined') mgmt.init();
}

function updateClock() {
    const el = document.getElementById('system-clock');
    if (el) el.innerText = new Date().toLocaleTimeString('de-DE');
}

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;
    const div = document.createElement('div');
    div.className = `msg-${sender.toLowerCase()}`;
    div.innerHTML = `<strong>${sender.toUpperCase()}:</strong> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

// Global verfügbare Funktionen für Modals (Sicherheits-Layer)
window.openPlayerModal = function(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    const form = document.getElementById('modal-form');
    modal.style.display = 'flex';
    
    const p = id ? eliteStore.players.find(x => x.id === id) : { name: "", pos: "ST", rating: 50, stats: [50,50,50,50,50,50] };
    form.innerHTML = `
        <h3 class="orbitron">ASSET EDITOR</h3>
        <input type="text" id="edit-name" value="${p.name}" placeholder="Name">
        <input type="text" id="edit-pos" value="${p.pos}" placeholder="POS">
        <div class="grid-2">
            ${p.stats.map((s, i) => `<input type="number" class="stat-in" value="${s}">`).join('')}
        </div>
    `;
};

window.closePlayerModal = () => document.getElementById('player-modal').style.display = 'none';

window.savePlayer = function() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;
    const stats = Array.from(document.querySelectorAll('.stat-in')).map(i => parseInt(i.value) || 50);
    const updated = {
        id: editingPlayerId || Date.now(),
        name,
        pos: document.getElementById('edit-pos').value.toUpperCase(),
        stats,
        rating: Math.round(stats.reduce((a,b) => a+b, 0) / 6),
        load: [10, 10, 10, 10, 10, 10, 10],
        img: ""
    };
    if (editingPlayerId) {
        eliteStore.players = eliteStore.players.map(x => x.id === editingPlayerId ? updated : x);
    } else {
        eliteStore.players.push(updated);
    }
    localStorage.setItem('toni_players', JSON.stringify(eliteStore.players));
    closePlayerModal();
    renderLockerRoom();
};
