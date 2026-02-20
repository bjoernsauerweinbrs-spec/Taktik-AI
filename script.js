/* ==========================================================
   TONI 2.0 ELITE | CORE ENGINE (FULL REPLACEMENT)
   ========================================================== */

/**
 * 1. CENTRAL STATE MANAGER (Single Source of Truth)
 */
const eliteStore = {
    // Kader mit kognitiven & physischen Profilen
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [15, 12, 18, 20, 15, 12, 19], img: "" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 4, 6, 5, 4, 5, 6], img: "" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 10, 11, 12, 10, 9, 11], img: "" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], load: [8, 9, 8, 10, 8, 9, 8], img: "" }
    ],
    // Finanz- & Infrastruktur-Daten (Management-Labor)
    mgmt: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        liquidAssets: 12500000,
        sponsorships: [{ partner: "Global Dynamics", value: 3500000, roi: 0.88 }],
        infrastructure: [{ name: "VR Tactical Hub", level: 5, bonus: 0.25 }]
    },
    formations: {
        toni: { name: '4-4-2', color: '#22c55e', side: 1 },
        trainer: { name: '3-4-3', color: '#3b82f6', side: -1 }
    }
};

/**
 * 2. INITIALISIERUNG
 */
window.onload = () => {
    console.log("TONI 2.0: System-Check vollständig. Elite-Layer aktiv.");
    
    // UI Setup
    updateClock();
    setInterval(updateClock, 1000);
    
    // Erster Start: VR-Modus vorbereiten
    init3DEnvironment();
    
    // Voice Engine aktivieren
    if (typeof voiceEngine !== 'undefined') voiceEngine.init();
};

/* ==========================================================
   3. VR ANALYSIS ENGINE (PITCH CONTROL & xG)
   ========================================================== */

function init3DEnvironment() {
    const scene = document.querySelector('a-scene');
    if (!scene) return;

    // Grid-Berechnung für Pitch Control
    generateAnalyticsGrid(scene);
    
    // Spieler-Spawning (Meta Quest Ready)
    spawnVRTeam(eliteStore.formations.toni);
    spawnVRTeam(eliteStore.formations.trainer);
}

function generateAnalyticsGrid(scene) {
    const gridContainer = document.getElementById('analysis-grid');
    if (!gridContainer) return;
    
    // 10x15 Raster für mathematische Raumkontrolle
    for (let x = -30; x <= 30; x += 6) {
        for (let z = -50; z <= 50; z += 7) {
            const cell = document.createElement('a-plane');
            const xG = calculateXG(x, z);
            
            cell.setAttribute('position', `${x} 0.05 ${z}`);
            cell.setAttribute('rotation', '-90 0 0');
            cell.setAttribute('width', '5.8');
            cell.setAttribute('height', '6.8');
            cell.setAttribute('material', `color: ${xG > 0.4 ? '#22c55e' : '#0f172a'}; opacity: ${xG * 0.5}; transparent: true; shader: flat`);
            cell.setAttribute('class', 'analysis-cell');
            gridContainer.appendChild(cell);
        }
    }
}

function calculateXG(x, z) {
    const distToGoal = Math.hypot(x, z + 52.5);
    return Math.max(0.01, Math.min(0.95, 1 / (distToGoal * 0.1)));
}

function spawnVRTeam(form) {
    const container = document.getElementById('players-3d');
    const positions = getPositionsByFormation(form.name, form.side);

    positions.forEach((pos, i) => {
        const player = document.createElement('a-entity');
        player.setAttribute('position', `${pos.x} 0.9 ${pos.z}`);
        player.innerHTML = `
            <a-cylinder color="${form.color}" height="1.8" radius="0.5" metalness="0.5"></a-cylinder>
            <a-text value="${i === 0 ? 'GK' : 'ELITE'}" position="0 1.6 0" align="center" width="5"></a-text>
            <a-ring color="white" radius-inner="0.6" radius-outer="0.7" rotation="-90 0 0" position="0 -0.85 0" opacity="0.3"></a-ring>
        `;
        container.appendChild(player);
    });
}

function getPositionsByFormation(name, side) {
    const p = [];
    const h = 50 * side;
    p.push({ x: 0, z: h > 0 ? 48 : -48 }); // Keeper
    
    if (name === '4-4-2') {
        [-18, -6, 6, 18].forEach(x => p.push({ x: x, z: h * 0.7 })); // DEF
        [-18, -6, 6, 18].forEach(x => p.push({ x: x, z: h * 0.3 })); // MID
        [-6, 6].forEach(x => p.push({ x: x, z: h * 0.1 })); // ATK
    } else {
        [-15, 0, 15].forEach(x => p.push({ x: x, z: h * 0.7 })); // 3er DEF
        [-20, -7, 7, 20].forEach(x => p.push({ x: x, z: h * 0.4 })); // 4er MID
        [-12, 0, 12].forEach(x => p.push({ x: x, z: h * 0.1 })); // 3er ATK
    }
    return p;
}

/* ==========================================================
   4. MEDICAL & LOCKER ROOM (ACWR DIAGNOSTICS)
   ========================================================= */

function calculateACWR(loadArray) {
    if (!loadArray || loadArray.length < 7) return 1.0;
    const acute = loadArray.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const chronic = loadArray.reduce((a, b) => a + b, 0) / loadArray.length;
    return chronic > 0 ? (acute / chronic) : 1.0;
}

/* ==========================================================
   5. VOICE AI (SPATIAL ANALYST)
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
            this.handleCommand(cmd);
        };
    },

    toggle: function() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            this.recognition.start();
            this.isListening = true;
            this.speak("Ich analysiere die Raumkontrolle im VR-Sektor, Coach.");
        }
    },

    handleCommand: function(cmd) {
        if (cmd.includes("status")) {
            this.speak("Die xG-Werte im Zentrum sind optimal. Defensive Kompression stabil.");
        }
    },

    speak: function(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.9;
        this.synth.speak(msg);
    }
};

/* ==========================================================
   6. UTILS & NAVIGATION
   ========================================================== */

function updateClock() {
    const el = document.getElementById('system-clock');
    if (el) el.innerText = new Date().toLocaleTimeString('de-DE');
}

function toggleHeatmap() {
    const grid = document.getElementById('analysis-grid');
    grid.setAttribute('visible', !grid.getAttribute('visible'));
}

function showVRView() {
    console.log("Navigiere zum VR-Viewport...");
    // Hier können Transitionen eingefügt werden
}
