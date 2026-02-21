/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (FULL VERSION V6.0)
   ========================================================================== */

/**
 * 1. GLOBAL STATE & DATA ARCHITECTURE
 */
const eliteStore = {
    // Kader-Daten mit kognitiven & physischen Profilen
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [15, 12, 18, 20, 15, 12, 19], med: "Fit" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 4, 6, 5, 4, 5, 6], med: "Fit" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, stats: [72, 68, 85, 78, 84, 82], load: [10, 10, 11, 12, 10, 9, 11], med: "Reha" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], load: [8, 9, 8, 10, 8, 9, 8], med: "Fit" }
    ],
    // Finanz-Daten (Management Labor)
    mgmt: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        liquidAssets: 12500000,
        budget: 25000000,
        sponsorships: [
            { id: 1, partner: "Global Dynamics", value: 3500000, roi: 0.85, status: "Active" },
            { id: 2, partner: "CyberFit Analytics", value: 1200000, roi: 0.92, status: "Active" }
        ],
        infrastructure: {
            medicalLevel: 4,
            analysisLevel: 5,
            stadiumPaperActive: true
        }
    },
    // Taktik-Konfiguration (Bayern/Leipzig Standard)
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
    // Der Code "1234" schaltet den Zugang frei
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
   MODULE: VR HUB (Meta Quest Engine)
   ========================================================================== */

const trainingEngine = {
    currentLevel: 0,
    startLevel: function(lvl) {
        this.currentLevel = lvl;
        const assets = document.getElementById('vr-player-assets');
        if(!assets) return;
        assets.innerHTML = ''; 
        
        if (lvl === 1) { // SCANNING (Reha Modus)
            voiceEngine.speak("Scanning Drill aktiv. Identifizieren Sie die Farbcodes hinter Ihnen.");
            this.spawnVRPlayers(assets, 5, true);
        } else if (lvl === 2) { // GAP FINDER
            voiceEngine.speak("Lücke finden. Analysieren Sie die Abwehrkette.");
            this.spawnVRPlayers(assets, 11, false);
        }
    },

    spawnVRPlayers: function(container, count, random) {
        for(let i=0; i<count; i++) {
            const p = document.createElement('a-entity');
            const x = random ? (Math.random() * 40 - 20) : (i * 6 - 30);
            const z = random ? (Math.random() * 40 - 20) : -15;
            
            p.setAttribute('position', `${x} 0 ${z}`);
            p.innerHTML = `
                <a-cylinder radius="0.5" height="1.8" color="${i % 2 === 0 ? '#ef4444' : '#3b82f6'}"></a-cylinder>
                <a-sphere position="0 1.7 0" radius="0.25" color="#ffccaa">
                    <a-box position="0 0 0.2" width="0.1" height="0.1" depth="0.2" color="black"></a-box>
                </a-sphere>
            `;
            container.appendChild(p);
        }
    }
};

function initVRHub() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) {
        trainingEngine.startLevel(1);
    } else if(scene) {
        scene.addEventListener('loaded', () => trainingEngine.startLevel(1));
    }
}

function exitVRMode() { loadModule('kader'); }

/* ==========================================================================
   MODULE: MANAGEMENT LABOR
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
                <p style="color:var(--text-dim); font-size:10px;">FLÜSSIGE MITTEL // OPERATIV</p>
                <div style="margin-top:20px;">
                    <div class="metric-row"><span>KADERWERT</span> <span>${squadValue.toLocaleString()} €</span></div>
                    <div class="metric-row"><span>SPONSORING ROI</span> <span style="color:var(--neon-main)">+18.4%</span></div>
                </div>
            </div>
            <div class="mgmt-card">
                <h3>INFRASTRUKTUR-ROI</h3>
                <div style="display:grid; gap:10px; margin-top:15px;">
                    <button class="btn-save" style="width:100%" onclick="investInInfra('med')">UPGRADE MEDICAL CENTER (Lvl ${m.infrastructure.medicalLevel})</button>
                    <button class="btn-save" style="width:100%" onclick="investInInfra('vr')">EXTEND ANALYSEZENTRUM (Lvl ${m.infrastructure.analysisLevel})</button>
                </div>
            </div>
        </div>
    `;
}

function investInInfra(type) {
    if (eliteStore.mgmt.liquidAssets >= 1000000) {
        eliteStore.mgmt.liquidAssets -= 1000000;
        if (type === 'med') eliteStore.mgmt.infrastructure.medicalLevel++;
        else eliteStore.mgmt.infrastructure.analysisLevel++;
        saveState();
        renderFinanceLab();
        updateKPIs();
        voiceEngine.speak("Investition bestätigt. Infrastruktur-Level erhöht.");
    }
}

/* ==========================================================================
   MODULE: KADER & MEDICAL (ACWR Logic)
   ========================================================================== */

function renderLockerRoom() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div class="card-grid">
            ${eliteStore.players.map(p => {
                const acwr = calculateACWR(p.load);
                const statusClass = acwr > 1.5 ? 'status-verletzt' : (acwr > 1.2 ? 'status-reha' : 'status-fit');
                return `
                    <div class="fifa-card" onclick="openPlayerEditor(${p.id})">
                        <div class="med-status ${statusClass}"></div>
                        <div class="card-top">
                            <span class="rating">${p.rating}</span>
                            <span class="pos">${p.pos}</span>
                        </div>
                        <div class="player-name-elite">${p.name}</div>
                        <div style="text-align:center; font-size:10px; margin-top:10px; color:var(--text-dim);">
                            ACWR INDEX: <span style="color:white">${acwr.toFixed(2)}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function calculateACWR(load) {
    if (!load || load.length < 7) return 1.0;
    const acute = load.slice(-7).reduce((a,b) => a+b, 0) / 7;
    const chronic = load.reduce((a,b) => a+b, 0) / load.length;
    return chronic > 0 ? (acute / chronic) : 1.0;
}

/* ==========================================================================
   MODULE: TACTICS & MEDIA (Missing Renders)
   ========================================================================== */

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div class="tactics-container">
            <div class="tactics-pitch">
                <div class="t-obj obj-player" style="top:50%; left:50%;">10</div>
                <div class="t-obj obj-ball" style="top:55%; left:52%;"></div>
            </div>
            <div class="analysis-sheet">
                <h3 class="sheet-title">MATCH PREP</h3>
                <textarea class="notes-area" placeholder="Taktische Anweisungen hier..."></textarea>
                <button class="btn-save" onclick="voiceEngine.speak('Taktik gespeichert.')">PUBLISH TO SQUAD</button>
            </div>
        </div>
    `;
}

function renderNewspaperCMS() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div class="newspaper-wrapper">
            <h1>STADION-ECHO // ELITE EDITION</h1>
            <p>Aktueller Kaderwert: ${eliteStore.mgmt.liquidAssets.toLocaleString()} €</p>
            <div style="border:1px solid #ccc; padding:20px; margin-top:20px;">
                <h3>TOP STORY: NEURAL TRAINING SUCCESS</h3>
                <p>Die VR-Sitzungen zeigen Wirkung bei der Scanning-Rate.</p>
            </div>
            <button onclick="window.print()">DRUCKVERSION GENERIEREN (A4)</button>
        </div>
    `;
}

/* ==========================================================================
   KI & SYSTEM TOOLS
   ========================================================================== */

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
        u.lang = 'de-DE'; u.pitch = 0.85;
        window.speechSynthesis.speak(u);
        addChatMessage("TONI ELITE", text);
    },
    toggle: function() { if(this.recognition) this.recognition.start(); }
};

function handleVoiceCommand(cmd) {
    const c = cmd.toLowerCase();
    if (c.includes("status")) voiceEngine.speak("System stabil. Alle Sensoren kalibriert.");
    if (c.includes("finanzen")) loadModule('finance');
}

function updateClock() {
    document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function updateKPIs() {
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €";
    document.getElementById('kpi-epi').innerText = "88.4";
}

function addChatMessage(sender, text) {
    const stream = document.getElementById('chat-stream');
    if(!stream) return;
    const msg = document.createElement('div');
    msg.className = `msg ${sender === 'USER' ? 'user' : 'ai'}`;
    msg.innerHTML = `<div class="msg-header">${sender}</div><div class="msg-body">${text}</div>`;
    stream.appendChild(msg);
    stream.scrollTop = stream.scrollHeight;
}

function saveState() {
    localStorage.setItem('toni_players', JSON.stringify(eliteStore.players));
    localStorage.setItem('toni_mgmt', JSON.stringify(eliteStore.mgmt));
}

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
