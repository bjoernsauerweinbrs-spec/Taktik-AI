/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V7.5 - MASTER CONNECTIVITY)
   ========================================================================== */

// GLOBALE KONFIGURATION
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";

// ZENTRALER DATENSPEICHER
const eliteStore = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, load: [15, 12, 18, 20, 15], med: "Fit" },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, load: [5, 4, 6, 5, 5], med: "Fit" },
        { id: 103, name: "K. Schneider", pos: "IV", rating: 84, load: [10, 11, 12, 10, 9], med: "Reha" },
        { id: 104, name: "J. Weber", pos: "IV", rating: 82, load: [8, 9, 8, 10, 8], med: "Fit" }
    ],
    mgmt: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        liquidAssets: 12500000,
        infrastructure: { medicalLevel: 4, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" }
    },
    activeModule: 'kader'
};

/* ==========================================================================
   1. SYSTEM BOOT & AUTHENTICATION
   ========================================================================== */

function systemBootSequence() {
    const pass = document.getElementById('sys-pass').value;
    if (pass === "1234") { 
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initEliteCore();
    } else {
        alert("ACCESS DENIED: SECURITY PROTOCOL ACTIVE");
    }
}

async function initEliteCore() {
    console.log("TONI 2.0: Initializing Core Systems...");
    updateClock(); 
    setInterval(updateClock, 1000);
    
    // Status der KI prüfen
    checkAIConnection();
    
    // Echtes Wetter laden (Asynchron)
    await fetchWeatherData();
    
    // Modul laden
    loadModule(eliteStore.activeModule);
    updateKPIs();
    voiceEngine.init();
}

/* ==========================================================================
   2. SYSTEM CONFIGURATION (API KEY MANAGEMENT)
   ========================================================================== */

function openSysConfig() {
    document.getElementById('modal-sys-config').classList.remove('hidden');
    const statusDiv = document.getElementById('key-status-display');
    const input = document.getElementById('input-api-key');
    
    if(USER_API_KEY && USER_API_KEY.length > 10) {
        input.value = "********************"; // Maskierung
        statusDiv.innerText = "VERBUNDEN (GESPEICHERT)";
        statusDiv.style.color = "var(--neon-main)";
    } else {
        input.value = "";
        statusDiv.innerText = "NICHT VERBUNDEN";
        statusDiv.style.color = "var(--neon-alert)";
    }
}

function saveSystemConfig() {
    const input = document.getElementById('input-api-key').value;
    
    // Einfache Validierung für OpenAI Keys
    if(input && input.startsWith("sk-")) {
        localStorage.setItem('toni_api_key', input);
        USER_API_KEY = input;
        alert("Neural Link hergestellt. Toni ist jetzt online.");
        closeModal('modal-sys-config');
        checkAIConnection();
    } else if (input.includes("***")) {
        closeModal('modal-sys-config'); // War schon gespeichert
    } else {
        alert("Ungültiges Format. Key muss mit 'sk-' beginnen.");
    }
}

function clearSystemConfig() {
    localStorage.removeItem('toni_api_key');
    USER_API_KEY = "";
    document.getElementById('input-api-key').value = "";
    alert("Key gelöscht. System läuft im Simulations-Modus.");
    openSysConfig(); // UI Refresh
    checkAIConnection();
}

function checkAIConnection() {
    const visualizer = document.getElementById('ai-status-text');
    if(USER_API_KEY) {
        visualizer.innerText = "NEURAL LINK: ONLINE (GPT-4)";
        visualizer.style.color = "var(--neon-main)";
    } else {
        visualizer.innerText = "NEURAL LINK: OFFLINE (SIMULATION)";
        visualizer.style.color = "var(--neon-warn)";
    }
}

/* ==========================================================================
   3. AI AGENT (THE BRAIN)
   ========================================================================== */

const aiAgent = {
    ask: async function(prompt) {
        addChatMessage("USER", prompt);
        
        // --- FALLBACK (SIMULATION) ---
        if(!USER_API_KEY) {
            setTimeout(() => {
                let reply = "Ich laufe im Simulations-Modus. Bitte API Key hinterlegen für volle Intelligenz.";
                if(prompt.toLowerCase().includes("wetter")) reply = `Live-Daten Standort: ${eliteStore.mgmt.liveData.temp}°C, ${eliteStore.mgmt.liveData.condition}.`;
                if(prompt.toLowerCase().includes("analyse")) reply = "Basierend auf den ACWR-Werten empfehle ich heute regeneratives Training.";
                voiceEngine.speak(reply);
            }, 600);
            return;
        }

        // --- ECHTE INTELLIGENZ (OPENAI REQUEST) ---
        try {
            const systemContext = `
                Du bist Toni, ein Elite-Co-Trainer für RB Leipzig.
                Aktueller Kontext:
                - Wetter: ${eliteStore.mgmt.liveData.temp}°C (${eliteStore.mgmt.liveData.condition})
                - Budget: ${eliteStore.mgmt.liquidAssets} €
                - Verletzte Spieler: ${eliteStore.players.filter(p => p.med !== 'Fit').length}
                Antworte präzise, taktisch fundiert und professionell.
            `;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${USER_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4", // Oder gpt-3.5-turbo für Geschwindigkeit
                    messages: [
                        {role: "system", content: systemContext},
                        {role: "user", content: prompt}
                    ],
                    temperature: 0.7
                })
            });

            const data = await response.json();
            
            if(data.error) {
                throw new Error(data.error.message);
            }

            const aiText = data.choices[0].message.content;
            voiceEngine.speak(aiText);

        } catch (error) {
            console.error(error);
            addChatMessage("SYSTEM", "Fehler bei der KI-Verbindung: " + error.message);
            voiceEngine.speak("Verbindung zum Neural Core unterbrochen.");
        }
    }
};

/* ==========================================================================
   4. LIVE DATA (WETTER API)
   ========================================================================== */

async function fetchWeatherData() {
    try {
        // Koordinaten für Bad Hersfeld / Homberg (Ohm)
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=9.4&current_weather=true");
        const data = await response.json();
        
        eliteStore.mgmt.liveData.temp = data.current_weather.temperature;
        eliteStore.mgmt.liveData.wind = data.current_weather.windspeed;
        
        // Wetter-Code Interpretation
        const code = data.current_weather.weathercode;
        let cond = "Stabil";
        if(code > 3) cond = "Bewölkt";
        if(code > 50) cond = "Regen";
        if(code > 80) cond = "Sturm";
        
        eliteStore.mgmt.liveData.condition = cond;
        
    } catch (e) {
        console.warn("Wetter-Daten konnten nicht geladen werden.");
        eliteStore.mgmt.liveData.temp = "N/A";
    }
}

/* ==========================================================================
   5. VR HUB & 11v11 SIMULATION ENGINE
   ========================================================================== */

const trainingEngine = {
    shiftingInterval: null,
    opponents: [],

    startLevel: function() {
        const container = document.getElementById('match-simulation-layer');
        if(!container) return;
        container.innerHTML = '';
        this.opponents = [];

        // HUD Update
        document.getElementById('vr-hud-text').setAttribute('value', 'SIMULATION: PRESSING RESISTANCE');

        // Spawn Teams (11 vs 11)
        this.spawnTeam(container, 'home', '4-4-2', '#00ff41'); // Eigene
        this.spawnTeam(container, 'away', '3-4-3', '#ef4444'); // Gegner

        // Start Logic
        voiceEngine.speak("Simulation gestartet. Gegnerische 3er-Kette verschiebt ballorientiert.");
        this.startShiftingLogic();
    },

    spawnTeam: function(container, side, formation, color) {
        const coords = this.getFormationCoords(formation, side);
        coords.forEach((pos, i) => {
            const player = document.createElement('a-entity');
            player.setAttribute('position', `${pos.x} 0 ${pos.z}`);
            player.setAttribute('rotation', side === 'home' ? "0 0 0" : "0 180 0");
            
            // Humanoid Avatar mit Visier
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

    startShiftingLogic: function() {
        if(this.shiftingInterval) clearInterval(this.shiftingInterval);
        
        this.shiftingInterval = setInterval(() => {
            // Hole Position des Users (Kamera)
            const rig = document.getElementById('player-rig');
            const userX = rig ? rig.getAttribute('position').x : 0;
            
            this.opponents.forEach(opp => {
                // Verschiebe Gegner basierend auf User-Position (Ballseite)
                const shift = userX * 0.4; 
                opp.el.setAttribute('animation', {
                    property: 'position',
                    to: `${opp.basePos.x + shift} 0 ${opp.basePos.z}`,
                    dur: 900,
                    easing: 'easeOutQuad'
                });
            });
        }, 1000);
    },

    getFormationCoords: function(type, side) {
        const p = [];
        const dir = side === 'home' ? 1 : -1;
        p.push({x: 0, z: 50 * dir}); // GK
        
        // Vereinfachte Koordinaten für Demo
        if (type === '4-4-2') {
            [-18, -6, 6, 18].forEach(x => p.push({x: x, z: 32 * dir}));
            [-20, -7, 7, 20].forEach(x => p.push({x: x, z: 12 * dir}));
            [-7, 7].forEach(x => p.push({x: x, z: -5 * dir}));
        } else {
            [-15, 0, 15].forEach(x => p.push({x: x, z: 35 * dir}));
            [-22, -8, 8, 22].forEach(x => p.push({x: x, z: 15 * dir}));
            [-10, 0, 10].forEach(x => p.push({x: x, z: -8 * dir}));
        }
        return p;
    }
};

function initVRHub() {
    const scene = document.querySelector('a-scene');
    if (scene && scene.hasLoaded) trainingEngine.startLevel();
    else if(scene) scene.addEventListener('loaded', () => trainingEngine.startLevel());
}

function exitVRMode() {
    if(trainingEngine.shiftingInterval) clearInterval(trainingEngine.shiftingInterval);
    loadModule('kader');
}

/* ==========================================================================
   6. MODULE CONTROLLER & UI RENDERERS
   ========================================================================== */

function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    // UI Cleanup
    viewport.classList.remove('hidden');
    vrViewport.classList.add('hidden');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));

    // Routing
    if(modId === 'kader') renderLockerRoom();
    if(modId === 'finance') renderFinanceLab();
    if(modId === 'vr-hub') { 
        viewport.classList.add('hidden'); 
        vrViewport.classList.remove('hidden'); 
        initVRHub(); 
    }
    if(modId === 'stadionzeitung') renderNewspaperCMS();
    if(modId === 'tactics') renderTacticBoard();
}

function renderFinanceLab() {
    const m = eliteStore.mgmt;
    const squadValue = eliteStore.players.reduce((s, p) => s + (p.rating * 150000), 0);
    
    document.getElementById('content-viewport').innerHTML = `
        <div class="mgmt-dashboard">
            <div class="mgmt-card">
                <h3>LIVE DATEN (HOMBERG/OHM)</h3>
                <div class="roi-indicator">${m.liveData.temp}°C</div>
                <div style="color:${m.liveData.condition === 'Regen' ? 'red' : 'var(--neon-main)'}">
                    ${m.liveData.condition} / Wind: ${m.liveData.wind} km/h
                </div>
            </div>
            <div class="mgmt-card">
                <h3>FINANZ STATUS</h3>
                <div class="roi-indicator">${m.liquidAssets.toLocaleString()} €</div>
                <div style="font-size:10px; color:#aaa; margin-top:10px;">KADERWERT: ${squadValue.toLocaleString()} €</div>
            </div>
            <div class="mgmt-card" style="grid-column: span 2;">
                <h3>INFRASTRUKTUR</h3>
                <button class="btn-save" style="width:100%" onclick="alert('Infrastruktur erweitert')">ANALYSEZENTRUM ERWEITERN</button>
            </div>
        </div>
    `;
}

function renderLockerRoom() {
    document.getElementById('content-viewport').innerHTML = `
        <div class="card-grid">
            ${eliteStore.players.map(p => {
                const statusClass = p.med === 'Verletzt' ? 'status-verletzt' : (p.med === 'Reha' ? 'status-reha' : 'status-fit');
                return `
                <div class="fifa-card" onclick="openPlayerEditor(${p.id})">
                    <div class="med-status ${statusClass}"></div>
                    <div class="card-top"><span class="rating">${p.rating}</span><span class="pos">${p.pos}</span></div>
                    <div class="player-name-elite">${p.name}</div>
                    <div style="text-align:center; font-size:10px; margin-top:10px; color:#aaa;">Status: ${p.med}</div>
                </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderTacticBoard() {
    document.getElementById('content-viewport').innerHTML = `
        <div class="tactics-container" style="display:flex; height:100%; gap:20px;">
            <div class="tactics-pitch" style="flex:2; background:#0b1812; border:1px solid #333; position:relative;">
                 <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#444;">TACTICAL GRID ACTIVE</div>
            </div>
            <div class="analysis-sheet" style="flex:1;">
                <h3 style="color:var(--neon-main); font-family:var(--font-hud);">MATCH PREP</h3>
                <textarea style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; margin-top:10px; padding:10px;" placeholder="Notizen..."></textarea>
            </div>
        </div>
    `;
}

function renderNewspaperCMS() {
    document.getElementById('content-viewport').innerHTML = `
        <div class="newspaper-wrapper" style="background:white; color:black; padding:40px;">
            <h1 style="font-family:serif; border-bottom:2px solid black;">RB LEIPZIG UPDATE</h1>
            <p><strong>Wetter-Prognose:</strong> Bei ${eliteStore.mgmt.liveData.temp}°C wird ein schnelles Spiel erwartet.</p>
            <p><strong>Finanzen:</strong> Der Verein verfügt über liquide Mittel von ${eliteStore.mgmt.liquidAssets.toLocaleString()} €.</p>
            <button class="btn-save" style="background:black; color:white; margin-top:20px;" onclick="window.print()">DRUCKEN</button>
        </div>
    `;
}

/* ==========================================================================
   7. PLAYER EDITOR & UTILS
   ========================================================================== */

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
        localStorage.setItem('toni_players', JSON.stringify(eliteStore.players));
        loadModule('kader');
        closeModal('modal-player-editor');
    }
}

function askToni() {
    const input = document.getElementById('toni-input');
    if(input.value.trim() === "") return;
    aiAgent.ask(input.value);
    input.value = "";
}

// Helper Utils
const voiceEngine = {
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => aiAgent.ask(e.results[e.results.length - 1][0].transcript);
        }
    },
    speak: function(text) {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE';
        window.speechSynthesis.speak(u);
        addChatMessage("TONI AI", text);
    },
    toggle: function() { if(this.recognition) this.recognition.start(); }
};

function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }
function updateKPIs() { document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function addChatMessage(sender, text) {
    const s = document.getElementById('chat-stream');
    s.innerHTML += `<div class="msg ${sender==='USER'?'user':'ai'}"><div class="msg-header">${sender}</div><div class="msg-body">${text}</div></div>`;
    s.scrollTop = s.scrollHeight;
}
