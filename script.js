/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V6.6 - AI SHIFTING EDITION)
   ========================================================================== */

/**
 * 1. GLOBAL STATE & DATA ARCHITECTURE
 */
const eliteStore = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [15, 12, 18, 20, 15, 12, 19], med: "Fit" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 4, 6, 5, 4, 5, 6], med: "Fit" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 10, 11, 12, 10, 9, 11], med: "Reha" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], load: [8, 9, 8, 10, 8, 9, 8], med: "Fit" }
    ],
    mgmt: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        liquidAssets: 12500000,
        budget: 25000000,
        sponsorships: [
            { id: 1, partner: "Global Dynamics", value: 3500000, roi: 0.85, status: "Active" },
            { id: 2, partner: "CyberFit Analytics", value: 1200000, roi: 0.92, status: "Active" }
        ],
        infrastructure: { medicalLevel: 4, analysisLevel: 5, stadiumPaperActive: true }
    },
    tactics: {
        activeFormation: '4-4-2',
        oppFormation: '3-4-3',
        pitchControlActive: true
    },
    activeModule: 'kader',
    isLive: false
};

/**
 * 2. SYSTEM BOOT & AUTHENTICATION
 */
function systemBootSequence() {
    const pass = document.getElementById('sys-pass').value;
    if (pass === "1234") { 
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initEliteCore();
    } else {
        alert("ACCESS DENIED: NEURAL LINK FAILED");
    }
}

function initEliteCore() {
    console.log("TONI 2.0: Neural Core Synchronized.");
    updateClock();
    setInterval(updateClock, 1000);
    loadModule(eliteStore.activeModule);
    updateKPIs();
    voiceEngine.init();
}

/**
 * 3. MODULE CONTROLLER
 */
function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    const display = document.getElementById('active-module-display');
    
    viewport.classList.remove('hidden');
    vrViewport.classList.add('hidden');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));

    switch(modId) {
        case 'kader':
            display.innerText = "MANAGEMENT // KADER & STATUS";
            renderLockerRoom();
            break;
        case 'finance':
            display.innerText = "MANAGEMENT // FINANZ LABOR";
            renderFinanceLab();
            break;
        case 'vr-hub':
            display.innerText = "INNOVATION // OCTAGON VR HUB";
            viewport.classList.add('hidden');
            vrViewport.classList.remove('hidden');
            initVRHub();
            break;
        case 'tactics':
            display.innerText = "COACHING // TAKTIK BOARD PRO";
            renderTacticBoard();
            break;
        case 'stadionzeitung':
            display.innerText = "MEDIA // STADION ZEITUNG CMS";
            renderNewspaperCMS();
            break;
    }
}

/* ==========================================================================
   MODULE: VR HUB & AI SHIFTING ENGINE (11v11)
   ========================================================================== */

const trainingEngine = {
    currentLevel: 0,
    opponents: [],
    shiftingInterval: null,
    
    initHUD: function(title, instruction) {
        const briefing = document.getElementById('mission-briefing');
        const hudText = document.getElementById('vr-hud-text');
        if(briefing) briefing.setAttribute('value', title);
        if(hudText) hudText.setAttribute('value', instruction);
    },

    startLevel: function(lvl) {
        this.currentLevel = lvl;
        this.opponents = [];
        const container = document.getElementById('match-simulation-layer');
        if(!container) return;
        container.innerHTML = ''; 
        
        if (lvl === 1) { // SCANNING & REHA
            this.initHUD("LEVEL 1: SCANNING ADAPTION", "Checke die Schulter. Wer steht frei?");
            this.spawnTeam(container, 'home', '4-4-2', '#00ff41');
            this.spawnTeam(container, 'away', '4-4-2', '#ef4444');
        } else if (lvl === 2) { // 11v11 DYNAMIC SHIFTING
            this.initHUD("LEVEL 2: PITCH CONTROL", "Bewege dich. Beobachte das Einrücken.");
            this.spawnTeam(container, 'home', '4-4-2', '#00ff41');
            this.spawnTeam(container, 'away', '3-4-3', '#3b82f6');
            this.startShiftingLogic();
        }
    },

    spawnTeam: function(container, side, formation, color) {
        const coords = this.getFormationCoords(formation, side);
        coords.forEach((pos, i) => {
            const player = document.createElement('a-entity');
            player.setAttribute('position', `${pos.x} 0 ${pos.z}`);
            player.setAttribute('rotation', side === 'home' ? "0 0 0" : "0 180 0");
            player.setAttribute('class', side === 'away' ? 'ai-opponent' : 'ai-teammate');

            player.innerHTML = `
                <a-box width="0.6" height="1.4" depth="0.3" color="${color}" shadow></a-box>
                <a-sphere position="0 1.6 0" radius="0.25" color="#ffccaa">
                    <a-box position="0 0 0.2" width="0.15" height="0.1" depth="0.2" color="black"></a-box>
                </a-sphere>
                <a-text value="${i+1}" position="0 2 0" align="center" width="4" color="white"></a-text>
            `;
            container.appendChild(player);
            if(side === 'away') this.opponents.push({ el: player, basePos: pos });
        });
    },

    /**
     * AI LOGIK: Ballorientiertes Verschieben
     * Die Gegner rücken ein, basierend auf der X-Position des Users (Ball)
     */
    startShiftingLogic: function() {
        if(this.shiftingInterval) clearInterval(this.shiftingInterval);
        
        this.shiftingInterval = setInterval(() => {
            const userPos = document.getElementById('player-rig').getAttribute('position');
            const ballX = userPos.x;
            
            this.opponents.forEach(opp => {
                // Berechne den Shift: Gegner rücken ca. 30% des Ballweges ein
                const shiftX = opp.basePos.x + (ballX * 0.35);
                const currentPos = opp.el.getAttribute('position');
                
                // Sanfte Bewegung (Interpolation)
                opp.el.setAttribute('animation', {
                    property: 'position',
                    to: `${shiftX} 0 ${opp.basePos.z}`,
                    dur: 800,
                    easing: 'easeOutQuad'
                });
            });
        }, 1000);
    },

    getFormationCoords: function(type, side) {
        const p = [];
        const dir = side === 'home' ? 1 : -1;
        p.push({x: 0, z: 50 * dir}); // GK
        if (type === '4-4-2') {
            [-18, -6, 6, 18].forEach(x => p.push({x: x, z: 32 * dir})); // DEF
            [-20, -7, 7, 20].forEach(x => p.push({x: x, z: 12 * dir})); // MID
            [-7, 7].forEach(x => p.push({x: x, z: -5 * dir}));        // ATK
        } else if (type === '3-4-3') {
            [-15, 0, 15].forEach(x => p.push({x: x, z: 35 * dir}));    // DEF
            [-22, -8, 8, 22].forEach(x => p.push({x: x, z: 15 * dir})); // MID
            [-15, 0, 15].forEach(x => p.push({x: x, z: -8 * dir}));    // ATK
        }
        return p;
    }
};

function initVRHub() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) trainingEngine.startLevel(2);
    else if(scene) scene.addEventListener('loaded', () => trainingEngine.startLevel(2));
}

function exitVRMode() { 
    if(trainingEngine.shiftingInterval) clearInterval(trainingEngine.shiftingInterval);
    loadModule('kader'); 
}

/* ==========================================================================
   MODULE: MANAGEMENT & KADER (Optimiert)
   ========================================================================== */

function renderFinanceLab() {
    const viewport = document.getElementById('content-viewport');
    const m = eliteStore.mgmt;
    const squadValue = eliteStore.players.reduce((s, p) => s + (p.rating * 150000), 0);
    viewport.innerHTML = `
        <div class="mgmt-dashboard">
            <div class="mgmt-card">
                <h3>FINANZ-MATRIX</h3>
                <div class="roi-indicator">${m.liquidAssets.toLocaleString()} €</div>
                <div style="margin-top:20px;">
                    <div class="metric-row"><span>KADERWERT</span> <span>${squadValue.toLocaleString()} €</span></div>
                    <div class="metric-row"><span>ROI</span> <span style="color:var(--neon-main)">+18.4%</span></div>
                </div>
            </div>
            <div class="mgmt-card">
                <h3>INFRASTRUKTUR</h3>
                <button class="btn-save" style="width:100%" onclick="investInInfra('vr')">UPGRADE VR-HUB (Lvl ${m.infrastructure.analysisLevel})</button>
            </div>
        </div>`;
}

function investInInfra(type) {
    if (eliteStore.mgmt.liquidAssets >= 1000000) {
        eliteStore.mgmt.liquidAssets -= 1000000;
        eliteStore.mgmt.infrastructure.analysisLevel++;
        saveState(); renderFinanceLab(); updateKPIs();
        voiceEngine.speak("Investition bestätigt.");
    }
}

function renderLockerRoom() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `<div class="card-grid">${eliteStore.players.map(p => {
        const acwr = calculateACWR(p.load);
        return `<div class="fifa-card" onclick="openPlayerEditor(${p.id})">
            <div class="card-top"><span class="rating">${p.rating}</span><span class="pos">${p.pos}</span></div>
            <div class="player-name-elite">${p.name}</div>
            <div style="text-align:center; font-size:10px; margin-top:10px;">ACWR: ${acwr.toFixed(2)}</div>
        </div>`;
    }).join('')}</div>`;
}

function calculateACWR(load) {
    const acute = load.slice(-7).reduce((a,b) => a+b, 0) / 7;
    const chronic = load.reduce((a,b) => a+b, 0) / load.length;
    return chronic > 0 ? (acute / chronic) : 1.0;
}

function renderTacticBoard() {
    document.getElementById('content-viewport').innerHTML = `<div class="tactics-container"><div class="tactics-pitch"></div><div class="analysis-sheet"><h3 class="sheet-title">TACTICAL BRIEFING</h3><button class="btn-save" onclick="voiceEngine.speak('Sync abgeschlossen.')">SYNC TO SQUAD</button></div></div>`;
}

function renderNewspaperCMS() {
    document.getElementById('content-viewport').innerHTML = `<div class="newspaper-wrapper"><h1>RB LEIPZIG // DAILY</h1><p>Assets: ${eliteStore.mgmt.liquidAssets.toLocaleString()} €</p><button class="btn-save" style="background:black; color:white;" onclick="window.print()">PRINT</button></div>`;
}

/* --- SYSTEM --- */
const voiceEngine = {
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => handleVoiceCommand(e.results[e.results.length - 1][0].transcript);
        }
    },
    speak: function(text) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE'; u.pitch = 0.9;
        window.speechSynthesis.speak(u);
        addChatMessage("TONI ELITE", text);
    },
    toggle: function() { if(this.recognition) this.recognition.start(); }
};

function handleVoiceCommand(cmd) {
    if (cmd.toLowerCase().includes("status")) voiceEngine.speak("Simulation aktiv. Gegner verschieben ballorientiert.");
}

function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
function updateKPIs() { document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; document.getElementById('kpi-epi').innerText = "88.4"; }
function addChatMessage(sender, text) {
    const stream = document.getElementById('chat-stream');
    if(!stream) return;
    const msg = document.createElement('div');
    msg.className = `msg ${sender === 'USER' ? 'user' : 'ai'}`;
    msg.innerHTML = `<div class="msg-header">${sender}</div><div class="msg-body">${text}</div>`;
    stream.appendChild(msg); stream.scrollTop = stream.scrollHeight;
}
function saveState() { localStorage.setItem('toni_players', JSON.stringify(eliteStore.players)); localStorage.setItem('toni_mgmt', JSON.stringify(eliteStore.mgmt)); }
function openPlayerEditor(id) {
    const p = eliteStore.players.find(x => x.id === id);
    if (!p) return;
    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-pos').value = p.pos;
    document.getElementById('edit-p-rating').value = p.rating;
    document.getElementById('edit-p-med').value = p.med;
    document.getElementById('modal-player-editor').classList.remove('hidden');
}
function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const p = eliteStore.players.find(x => x.id === id);
    if (p) {
        p.name = document.getElementById('edit-p-name').value;
        p.pos = document.getElementById('edit-p-pos').value;
        p.rating = parseInt(document.getElementById('edit-p-rating').value);
        p.med = document.getElementById('edit-p-med').value;
        saveState(); loadModule('kader');
        document.getElementById('modal-player-editor').classList.add('hidden');
    }
}
