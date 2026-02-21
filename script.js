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
            { id: 1, name: "Global Dynamics", value: 3500000, roi: 0.85, status: "Active" },
            { id: 2, name: "CyberFit Analytics", value: 1200000, roi: 0.92, status: "Active" }
        ],
        infrastructure: {
            medicalLevel: 4,
            analysisLevel: 5,
            stadiumPaperActive: true
        }
    },
    // Taktik-Konfiguration (Bayern/Leipzig Standard)
    tactics: {
        activeFormation: '4-4-2', // Toni Mannschaft
        oppFormation: '3-4-3',   // Trainer Mannschaft
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
    if (pass === "1234") { // Platzhalter für Elite-Key
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
    
    // Initiales Laden
    loadModule(eliteStore.activeModule);
    updateKPIs();
    
    // Voice Engine Initialisierung
    voiceEngine.init();
}

/**
 * 3. MODULE CONTROLLER (Die Schaltzentrale)
 */
function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    const display = document.getElementById('active-module-display');
    
    // UI Cleanup
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
    timer: null,

    startLevel: function(lvl) {
        this.currentLevel = lvl;
        const assets = document.getElementById('vr-player-assets');
        assets.innerHTML = ''; // Reset
        
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
    if (scene.hasLoaded) {
        trainingEngine.startLevel(1);
    } else {
        scene.addEventListener('loaded', () => trainingEngine.startLevel(1));
    }
}

function exitVRMode() {
    loadModule('kader');
}

/* ==========================================================================
   MODULE: MANAGEMENT LABOR (Finance & ROI)
   ========================================================================== */

function renderFinanceLab() {
    const viewport = document.getElementById('content-viewport');
    const m = eliteStore.mgmt;
    
    // Berechnung des Kaderwerts (Elite-Metrik)
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
                <h3>INFRASTRUKTUR-INVESTITIONEN</h3>
                <div style="display:grid; gap:10px; margin-top:15px;">
                    <button class="tool-btn" style="width:100%" onclick="investInInfra('med')">UPGRADE MEDICAL CENTER (Lvl ${m.infrastructure.medicalLevel})</button>
                    <button class="tool-btn" style="width:100%" onclick="investInInfra('vr')">ERWEITERUNG ANALYSEZENTRUM (Lvl ${m.infrastructure.analysisLevel})</button>
                </div>
            </div>
            <div class="mgmt-card" style="grid-column: span 2;">
                <h3>AKTIVE SPONSOREN</h3>
                <div class="card-grid" style="grid-template-columns: 1fr 1fr 1fr;">
                    ${m.sponsorships.map(s => `
                        <div class="fifa-card" style="height:120px; padding:15px;">
                            <div style="font-family:var(--font-hud); color:var(--neon-blue);">${s.partner}</div>
                            <div style="font-size:18px; margin:10px 0;">${s.value.toLocaleString()} €</div>
                            <div style="font-size:9px; color:var(--neon-main);">KPI: ${(s.roi * 100).toFixed(0)}% Erreicht</div>
                        </div>
                    `).join('')}
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
                        <div class="telemetry-widget" style="border:none; background:transparent;">
                            <div class="bar-bg"><div class="bar-fill" style="width:${p.rating}%"></div></div>
                        </div>
                    </div>
                `;
            }).join('')}
            <div class="fifa-card add-new" onclick="addNewPlayer()">
                <i class="fa-solid fa-plus" style="font-size:30px;"></i>
                <p>ASSET HINZUFÜGEN</p>
            </div>
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
   4. TONI AI & VOICE ENGINE
   ========================================================================== */

const voiceEngine = {
    recognition: null,
    synth: window.speechSynthesis,
    
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => {
                const msg = e.results[e.results.length - 1][0].transcript;
                handleVoiceCommand(msg);
            };
        }
    },

    speak: function(text) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE';
        u.pitch = 0.85;
        this.synth.speak(u);
        addChatMessage("TONI", text);
    },

    toggle: function() {
        if (this.recognition) {
            this.recognition.start();
            addChatMessage("SYSTEM", "KI hört zu...");
        }
    }
};

function handleVoiceCommand(cmd) {
    const c = cmd.toLowerCase();
    if (c.includes("status")) voiceEngine.speak("Die Kader-Kompaktheit liegt bei 84 Prozent. Zwei Spieler im Reha-Status.");
    if (c.includes("finanzen")) loadModule('finance');
    if (c.includes("vr")) loadModule('vr-hub');
}

/* ==========================================================================
   5. UTILS & SYSTEM HELPERS
   ========================================================================== */

function updateClock() {
    const now = new Date();
    document.getElementById('clock-display').innerText = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function updateKPIs() {
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €";
    document.getElementById('kpi-epi').innerText = "88.4";
}

function addChatMessage(sender, text) {
    const stream = document.getElementById('chat-stream');
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
        saveState();
        loadModule('kader');
        document.getElementById('modal-player-editor').classList.add('hidden');
    }
}
