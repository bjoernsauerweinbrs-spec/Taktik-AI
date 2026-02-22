/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V9.0 - TACTICAL WAR ROOM)
   ========================================================================== */

// GLOBALE KONFIGURATION
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";

// ZENTRALER DATENSPEICHER
const eliteStore = {
    // V9.0 Update: Erweiterte Spielerdaten für Taktik (Nummer, Position)
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", number: 25, pos: "ST", rating: 88, med: "Fit", attributes: [] },
        { id: 102, name: "L. Schmidt", number: 1, pos: "TW", rating: 91, med: "Fit", attributes: [] },
        { id: 103, name: "K. Schneider", number: 4, pos: "IV", rating: 84, med: "Reha", attributes: [] },
        { id: 104, name: "J. Weber", number: 5, pos: "IV", rating: 82, med: "Fit", attributes: [] },
        { id: 105, name: "D. Raum", number: 22, pos: "LAV", rating: 80, med: "Fit", attributes: [] }
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
   2. MODULE CONTROLLER
   ========================================================================== */

function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    // UI Cleanup
    viewport.classList.remove('hidden');
    vrViewport.classList.add('hidden');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));

    // Routing Logic
    if(modId === 'kader') renderDynamicSquad();
    if(modId === 'finance') renderFinanceLab();
    if(modId === 'stadionzeitung') renderNewspaperCMS();
    
    // Taktik Board mit Canvas-Init Verzögerung (damit DOM bereit ist)
    if(modId === 'tactics') { 
        renderTacticBoard(); 
        setTimeout(tacticsCore.init, 100); 
    }

    // VR Hub
    if(modId === 'vr-hub') { 
        viewport.classList.add('hidden'); 
        vrViewport.classList.remove('hidden'); 
        initVRHub(); 
    }
}

/* ==========================================================================
   3. TACTICS CORE ENGINE (V9.0 NEW FEATURE)
   ========================================================================== */
const tacticsCore = {
    canvas: null,
    ctx: null,
    mode: 'move', // 'move', 'draw', 'erase'
    isDrawing: false,
    elements: [], // Spieler Tokens & Pfade
    drawingPath: [],

    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Canvas Größe an Container anpassen
        const container = document.querySelector('.tactics-stage');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Event Listeners (Maus)
        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        
        // Touch Support (für Tablets)
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); this.startAction(e.touches[0]); });
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); this.moveAction(e.touches[0]); });
        this.canvas.addEventListener('touchend', (e) => { e.preventDefault(); this.endAction(e.changedTouches[0]); });

        this.renderLoop();
    },

    setMode: function(newMode) {
        this.mode = newMode;
        // UI Feedback
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${newMode}`).classList.add('active');
    },

    addPlayerToBoard: function(playerId) {
        const p = eliteStore.players.find(x => x.id === playerId);
        // Zufällige Position nahe der Mitte
        this.elements.push({
            type: 'player',
            id: p.id,
            label: p.number || "?",
            name: p.name,
            x: this.canvas.width / 2 + (Math.random() * 60 - 30),
            y: this.canvas.height / 2 + (Math.random() * 60 - 30),
            color: '#ef4444', 
            radius: 14,
            isDragging: false
        });
        this.renderLoop();
        voiceEngine.speak(`${p.name} auf dem Feld.`);
    },

    startAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.mode === 'move') {
            // Hit Detection für Spieler-Token
            this.elements.forEach(el => {
                if(el.type === 'player') {
                    const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2);
                    if (dist < el.radius + 10) el.isDragging = true;
                }
            });
        } else if (this.mode === 'draw') {
            this.isDrawing = true;
            this.drawingPath = [{x, y}];
        }
    },

    moveAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.mode === 'move') {
            this.elements.forEach(el => {
                if (el.isDragging) {
                    el.x = x;
                    el.y = y;
                }
            });
            this.renderLoop();
        } else if (this.mode === 'draw' && this.isDrawing) {
            this.drawingPath.push({x, y});
            this.renderLoop();
        }
    },

    endAction: function(e) {
        if (this.mode === 'move') {
            this.elements.forEach(el => el.isDragging = false);
        } else if (this.mode === 'draw' && this.isDrawing) {
            this.isDrawing = false;
            // Pfad permanent speichern
            this.elements.push({
                type: 'path',
                points: [...this.drawingPath],
                color: '#ffff00', // Gelb für Taktik-Zeichnungen
                width: 3
            });
            this.drawingPath = [];
            this.renderLoop();
        }
    },

    clearBoard: function() {
        if(confirm("Taktiktafel komplett löschen?")) {
            this.elements = [];
            this.renderLoop();
        }
    },

    exportImage: function() {
        const link = document.createElement('a');
        link.download = 'toni-matchplan.png';
        link.href = this.canvas.toDataURL();
        link.click();
        voiceEngine.speak("Matchplan exportiert.");
    },

    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 1. Gespeicherte Pfade (Laufwege)
        this.elements.filter(e => e.type === 'path').forEach(path => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = path.color;
            this.ctx.lineWidth = path.width;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            if(path.points.length > 0) {
                this.ctx.moveTo(path.points[0].x, path.points[0].y);
                path.points.forEach(p => this.ctx.lineTo(p.x, p.y));
                this.ctx.stroke();
                
                // Pfeilspitze
                const last = path.points[path.points.length-1];
                this.ctx.fillStyle = path.color;
                this.ctx.beginPath();
                this.ctx.arc(last.x, last.y, 4, 0, Math.PI*2);
                this.ctx.fill();
            }
        });

        // 2. Aktueller Pfad (Live Preview)
        if (this.isDrawing && this.drawingPath.length > 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 3;
            this.ctx.moveTo(this.drawingPath[0].x, this.drawingPath[0].y);
            this.drawingPath.forEach(p => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
        }

        // 3. Spieler Tokens
        this.elements.filter(e => e.type === 'player').forEach(p => {
            // Schatten
            this.ctx.beginPath();
            this.ctx.arc(p.x+2, p.y+2, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fill();

            // Körper
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // Nummer
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.label, p.x, p.y);
            
            // Name (klein drunter)
            this.ctx.fillStyle = '#ccc';
            this.ctx.font = '9px Arial';
            this.ctx.fillText(p.name, p.x, p.y + p.radius + 12);
        });
    }
};

/* ==========================================================================
   4. UI RENDERERS
   ========================================================================== */

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    
    // Squad Liste für Drag&Drop Simulation (Klick = Add)
    let squadHtml = eliteStore.players.map(p => `
        <div class="draggable-player" onclick="tacticsCore.addPlayerToBoard(${p.id})">
            <span><b>${p.number}.</b> ${p.name}</span>
            <i class="fa-solid fa-plus-circle" style="color:var(--neon-main)"></i>
        </div>
    `).join('');

    viewport.innerHTML = `
        <div class="tactics-wrapper">
            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">WERKZEUGE</h3>
                <div class="tool-btn active" id="btn-move" onclick="tacticsCore.setMode('move')">
                    <i class="fa-solid fa-arrows-up-down-left-right"></i> VERSCHIEBEN
                </div>
                <div class="tool-btn" id="btn-draw" onclick="tacticsCore.setMode('draw')">
                    <i class="fa-solid fa-pen"></i> ZEICHNEN (GELB)
                </div>
                <div class="tool-btn" onclick="tacticsCore.clearBoard()">
                    <i class="fa-solid fa-trash"></i> BOARD LÖSCHEN
                </div>
                <div class="tool-btn" onclick="tacticsCore.exportImage()">
                    <i class="fa-solid fa-file-export"></i> EXPORT PNG
                </div>
                <hr style="border-color:#333; width:100%;">
                <div class="analysis-sheet">
                    <h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px; margin-bottom:5px;">MATCHPLAN NOTIZEN</h3>
                    <textarea style="width:100%; height:120px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;" placeholder="Pressing-Höhe, Zuteilung bei Ecken..."></textarea>
                </div>
            </aside>

            <div class="tactics-stage">
                <canvas id="tactics-canvas"></canvas>
            </div>

            <aside class="tactics-sidebar squad-list">
                <h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">KADER</h3>
                <div style="margin-top:10px;">
                    ${squadHtml}
                </div>
            </aside>
        </div>
    `;
}

function renderDynamicSquad() {
    // V9.0 Updated Kader Ansicht
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
    <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
        <h2 style="font-family:var(--font-hud);">KADER & STATUS</h2>
        <button class="btn-save" onclick="alert('Neuen Spieler anlegen...')">+ SPIELER</button>
    </div>
    <div class="card-grid">
        ${eliteStore.players.map(p => {
            const statusClass = p.med === 'Verletzt' ? 'status-verletzt' : (p.med === 'Reha' ? 'status-reha' : 'status-fit');
            return `
            <div class="fifa-card" onclick="openPlayerEditor(${p.id})">
                <div class="med-status ${statusClass}"></div>
                <div class="card-top"><span class="rating">${p.rating}</span><span class="pos">${p.pos}</span></div>
                <div class="player-name-elite">${p.name}</div>
                <div style="text-align:center; font-size:10px; margin-top:10px; color:#aaa;">Nr. ${p.number}</div>
            </div>`;
        }).join('')}
    </div>`;
}

function renderFinanceLab() {
    // Finance behält die Live-Daten
    const m = eliteStore.mgmt;
    const squadValue = eliteStore.players.reduce((s, p) => s + (p.rating * 150000), 0);
    document.getElementById('content-viewport').innerHTML = `
        <div class="mgmt-dashboard">
            <div class="mgmt-card">
                <h3>LIVE UMWELTDATEN</h3>
                <div class="roi-indicator">${m.liveData.temp}°C</div>
                <div style="color:${m.liveData.condition.includes('Regen') ? 'red' : 'var(--neon-main)'}">
                    ${m.liveData.condition} / Wind: ${m.liveData.wind} km/h
                </div>
            </div>
            <div class="mgmt-card">
                <h3>VEREINSKONTO</h3>
                <div class="roi-indicator">${m.liquidAssets.toLocaleString()} €</div>
                <div style="font-size:10px; color:#aaa; margin-top:10px;">KADERWERT: ${squadValue.toLocaleString()} €</div>
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
   5. UTILS, AI & VR
   ========================================================================== */

function openSysConfig() {
    document.getElementById('modal-sys-config').classList.remove('hidden');
    const statusDiv = document.getElementById('key-status-display');
    const input = document.getElementById('input-api-key');
    if(USER_API_KEY && USER_API_KEY.length > 10) {
        input.value = "********************";
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
    if(input && input.startsWith("sk-")) {
        localStorage.setItem('toni_api_key', input);
        USER_API_KEY = input;
        alert("Neural Link hergestellt. Toni ist jetzt online.");
        closeModal('modal-sys-config');
        checkAIConnection();
    } else if (input.includes("***")) {
        closeModal('modal-sys-config');
    } else {
        alert("Ungültiges Format.");
    }
}

function clearSystemConfig() {
    localStorage.removeItem('toni_api_key');
    USER_API_KEY = "";
    document.getElementById('input-api-key').value = "";
    alert("Key gelöscht.");
    openSysConfig();
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

// AI AGENT
const aiAgent = {
    ask: async function(prompt) {
        addChatMessage("USER", prompt);
        
        if(!USER_API_KEY) {
            setTimeout(() => {
                let reply = "Ich laufe im Simulations-Modus. Bitte API Key hinterlegen.";
                if(prompt.toLowerCase().includes("wetter")) reply = `Live-Daten: ${eliteStore.mgmt.liveData.temp}°C, ${eliteStore.mgmt.liveData.condition}.`;
                voiceEngine.speak(reply);
            }, 600);
            return;
        }

        try {
            const systemContext = `Du bist Toni, ein Elite-Co-Trainer. Wetter: ${eliteStore.mgmt.liveData.temp}°C.`;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${USER_API_KEY}` },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [{role: "system", content: systemContext}, {role: "user", content: prompt}],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            voiceEngine.speak(data.choices[0].message.content);
        } catch (error) {
            addChatMessage("SYSTEM", "KI Fehler: " + error.message);
        }
    }
};

// LIVE WETTER API
async function fetchWeatherData() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=9.4&current_weather=true");
        const data = await response.json();
        eliteStore.mgmt.liveData.temp = data.current_weather.temperature;
        eliteStore.mgmt.liveData.wind = data.current_weather.windspeed;
        let cond = "Stabil";
        if(data.current_weather.weathercode > 3) cond = "Bewölkt";
        if(data.current_weather.weathercode > 50) cond = "Regen";
        eliteStore.mgmt.liveData.condition = cond;
    } catch (e) { console.warn("Wetter Fehler"); }
}

// EDITOR & UTILS
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

// VR Placeholder (Damit es nicht crasht, wenn du auf VR klickst)
const trainingEngine = { startLevel: function() { console.log("VR Start"); }};
function initVRHub() { 
    // Hier würde die A-Frame Logik starten. Für Web-Fokus V9.0 minimiert.
    const container = document.getElementById('match-simulation-layer');
    if(container) container.innerHTML = '<a-text value="VR MODUL - BITTE HEADSET AUFSETZEN" position="-2 1.6 -3" color="white"></a-text>';
}
function exitVRMode() { loadModule('kader'); }

function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }
function updateKPIs() { document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function addChatMessage(sender, text) {
    const s = document.getElementById('chat-stream');
    s.innerHTML += `<div class="msg ${sender==='USER'?'user':'ai'}"><div class="msg-header">${sender}</div><div class="msg-body">${text}</div></div>`;
    s.scrollTop = s.scrollHeight;
}
