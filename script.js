/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 4.1.0 (MAXIMUM INTEGRITY BUILD)
   Architecture: Monolith / Local-First / VR-Hybrid / Retina-Design
   ========================================================================== */

/**
 * --------------------------------------------------------------------------
 * 1. DATABASE & STATE MANAGEMENT (Local Storage Engine)
 * --------------------------------------------------------------------------
 */
const DEFAULT_DB = {
    settings: {
        pass: "Toni2026",
        clubName: "RB Leipzig",
        coachName: "Head Coach",
        version: "4.1.0"
    },
    // Finanz-Daten (Transaktionsbasiert)
    finance: [
        { id: 1708221, date: "2026-02-20", desc: "Sponsoring: Red Bull Global", amount: 4500000, type: "in" },
        { id: 1708222, date: "2026-02-21", desc: "Gehaltslauf: Profikader Feb", amount: -2100000, type: "out" },
        { id: 1708223, date: "2026-02-22", desc: "Reha-Equipment: Cryo Chamber", amount: -45000, type: "out" },
        { id: 1708224, date: "2026-02-23", desc: "Ticketing: Vorverkauf CL", amount: 850000, type: "in" }
    ],
    // Spieler-Daten (FIFA Cards - Full Detail)
    squad: [
        { id: 101, name: "Péter Gulácsi", pos: "TW", rating: 84, status: "Fit", img: "" },
        { id: 102, name: "Willi Orbán", pos: "IV", rating: 83, status: "Fit", img: "" },
        { id: 103, name: "Dani Olmo", pos: "ZOM", rating: 87, status: "Verletzt", img: "" },
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit", img: "" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Reha", img: "" },
        { id: 106, name: "Benjamin Henrichs", pos: "AV", rating: 81, status: "Fit", img: "" },
        { id: 107, name: "Xaver Schlager", pos: "ZM", rating: 82, status: "Fit", img: "" }
    ],
    // VR Telemetrie Cache (Scanning & xG)
    telemetry: {
        lastScanRate: 0,
        lastLatency: 0,
        sessionCount: 12,
        highScore: 94
    },
    // Taktik-Board Cache (Positionen)
    tactics: []
};

// Initialisiere DB beim Start oder lade Backup
let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

/**
 * Speichert den aktuellen Zustand persistent im Browser.
 * Wird nach jeder Änderung (Kader, Finanzen, Taktik) aufgerufen.
 */
function saveSystem() {
    try {
        localStorage.setItem('toni_elite_db', JSON.stringify(DB));
        refreshKPIs(); // Aktualisiert sofort die Budget-Anzeige oben
        console.log("System state saved successfully.");
    } catch (e) {
        console.error("Save failed:", e);
        speak("Fehler beim Speichern der Datenbank.");
    }
}

/**
 * Berechnet KPIs für den Header neu (Live-Budget).
 */
function refreshKPIs() {
    // 1. Budget berechnen (Startkapital 10M + Transaktionen)
    let budget = 10000000; 
    DB.finance.forEach(tx => budget += tx.amount);
    
    // 2. Kaderwert schätzen (Rating * 1.5M - vereinfachte Formel)
    let squadValue = DB.squad.reduce((acc, p) => acc + (p.rating * 1500000), 0);

    // 3. UI Updates
    const budgetEl = document.getElementById('kpi-budget');
    if(budgetEl) {
        budgetEl.innerText = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(budget);
        
        // Budget Farbe (Rot wenn negativ, Grün wenn positiv)
        if(budget < 0) { 
            budgetEl.classList.remove('val-pos'); 
            budgetEl.classList.add('val-neg'); 
        } else { 
            budgetEl.classList.add('val-pos'); 
            budgetEl.classList.remove('val-neg'); 
        }
    }
    
    const squadEl = document.getElementById('kpi-squad-value');
    if(squadEl) squadEl.innerText = (squadValue / 1000000).toFixed(1) + "M €";
}

/**
 * --------------------------------------------------------------------------
 * 2. AUTHENTICATION & BOOT SEQUENCE (Security Layer)
 * --------------------------------------------------------------------------
 */
function systemBootSequence() {
    const input = document.getElementById('sys-pass').value;
    const terminal = document.getElementById('auth-layer');
    
    // Einfache Passwortprüfung (In Production: Serverseitig)
    if (input === DB.settings.pass) {
        // Erfolgreicher Login
        terminal.style.opacity = '0'; // Fade Out Effekt
        speak("Identifikation bestätigt. Willkommen im RETINA STRIKER System.");
        
        setTimeout(() => {
            terminal.classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            
            // Initialisierung aller Subsysteme
            refreshKPIs();
            startSystemClock();
            loadModule('kader'); // Standard-Modul laden
        }, 800);
    } else {
        // Fehler Animation (Shake)
        const wrap = document.querySelector('.input-wrapper');
        wrap.style.animation = "shake 0.5s";
        setTimeout(() => wrap.style.animation = "", 500);
        speak("Zugriff verweigert. Sicherheitsprotokoll aktiv.");
    }
}

/**
 * --------------------------------------------------------------------------
 * 3. MODULE NAVIGATION (The Switchboard)
 * --------------------------------------------------------------------------
 */
function loadModule(moduleId) {
    const viewport = document.getElementById('content-viewport');
    const displayTitle = document.getElementById('active-module-display');

    // UI Reset (Buttons deaktivieren)
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    // Button aktiv setzen, der geklickt wurde
    if(event && event.target && event.target.tagName === 'BUTTON') {
        event.target.classList.add('active');
    }

    // VR Viewport sicherheitshalber verstecken
    const vrView = document.getElementById('vr-viewport');
    if(vrView) vrView.classList.add('hidden');
    viewport.classList.remove('hidden');

    // Modul Logik Weiche
    switch(moduleId) {
        case 'kader':
            displayTitle.innerText = "DASHBOARD // MANNSCHAFT";
            renderSquadModule(viewport);
            break;
        case 'finance':
            displayTitle.innerText = "DASHBOARD // FINANZ LABOR";
            renderFinanceModule(viewport);
            break;
        case 'stadionzeitung':
            displayTitle.innerText = "MEDIA // STADION ZEITUNG CMS";
            renderNewspaperModule(viewport);
            break;
        case 'vr-hub':
            displayTitle.innerText = "INNOVATION // OCTAGON VR HUB";
            renderVRHub(viewport);
            break;
        case 'tactics':
            displayTitle.innerText = "COACHING // TAKTIK BOARD PRO";
            renderTacticsBoard(viewport); // Volle Taktik-Engine laden
            break;
        
        // Platzhalter für zukünftige Module
        case 'drills':
        case 'medical':
        case 'scouting':
        case 'sponsors':
            displayTitle.innerText = "DASHBOARD // " + moduleId.toUpperCase();
            renderPlaceholder(viewport, moduleId);
            break;
    }
}

function renderPlaceholder(target, id) {
    target.innerHTML = `
        <div style="padding:100px; text-align:center; color:#64748b; border:1px dashed #333; border-radius:8px;">
            <i class="fa-solid fa-person-digging" style="font-size:40px; margin-bottom:20px;"></i>
            <h1>MODUL: ${id.toUpperCase()}</h1>
            <p>Dieses Modul wird in Kürze freigeschaltet.</p>
        </div>`;
}

/**
 * --------------------------------------------------------------------------
 * 4. MODULE: SQUAD MANAGEMENT (CRUD Editor)
 * --------------------------------------------------------------------------
 */
function renderSquadModule(target) {
    let html = `<div class="card-grid">`;
    
    // Bestehende Spieler rendern
    DB.squad.forEach(p => {
        let statusColor = p.status === 'Fit' ? 'status-fit' : (p.status === 'Reha' ? 'status-reha' : 'status-verletzt');
        
        html += `
        <div class="fifa-card" onclick="openPlayerEditor(${p.id})">
            <div class="med-status ${statusColor}"></div>
            <div class="card-top">
                <span class="rating">${p.rating}</span>
                <span class="pos">${p.pos}</span>
            </div>
            <img src="https://ui-avatars.com/api/?name=${p.name}&background=random&size=128&bold=true" class="player-img">
            <div class="player-name">${p.name}</div>
        </div>`;
    });

    // "Neu hinzufügen" Karte am Ende
    html += `
        <div class="fifa-card add-new" onclick="createNewPlayer()">
            <i class="fa-solid fa-plus" style="font-size:40px;"></i>
            <span style="margin-top:10px; font-size:12px; font-weight:700;">NEUER SPIELER</span>
        </div>
    </div>`;

    target.innerHTML = html;
}

// EDITOR LOGIC
function openPlayerEditor(id) {
    const p = DB.squad.find(x => x.id === id);
    if(!p) return;

    // Werte in das Modal füllen
    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-pos').value = p.pos;
    document.getElementById('edit-p-rating').value = p.rating;
    document.getElementById('edit-p-med').value = p.status;

    document.getElementById('modal-player-editor').classList.remove('hidden');
}

function createNewPlayer() {
    const newId = Date.now();
    // Standard-Template für neue Spieler
    DB.squad.push({ id: newId, name: "Neuer Spieler", pos: "ZM", rating: 75, status: "Fit", img: "" });
    saveSystem();
    renderSquadModule(document.getElementById('content-viewport'));
    // Direkt Editor öffnen
    openPlayerEditor(newId);
}

function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const index = DB.squad.findIndex(x => x.id === id);

    if(index > -1) {
        // Daten aus Formular übernehmen
        DB.squad[index].name = document.getElementById('edit-p-name').value;
        DB.squad[index].pos = document.getElementById('edit-p-pos').value;
        DB.squad[index].rating = parseInt(document.getElementById('edit-p-rating').value);
        DB.squad[index].status = document.getElementById('edit-p-med').value;

        saveSystem();
        closeModal('modal-player-editor');
        renderSquadModule(document.getElementById('content-viewport'));
        speak(`Profil von ${DB.squad[index].name} aktualisiert.`);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/**
 * --------------------------------------------------------------------------
 * 5. MODULE: FINANCE LABORATORY
 * --------------------------------------------------------------------------
 */
function renderFinanceModule(target) {
    target.innerHTML = `
        <div class="finance-dashboard">
            <div class="input-panel">
                <input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}">
                <input type="text" id="fin-desc" placeholder="Verwendungszweck">
                <input type="number" id="fin-amount" placeholder="Betrag (+/-)">
                <button class="btn-action" onclick="addFinanceTransaction()">BUCHEN</button>
            </div>

            <div style="background:rgba(0,0,0,0.5); padding:20px; border-radius:8px; border:1px solid var(--border-tech);">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Datum</th>
                            <th>Beschreibung</th>
                            <th style="text-align:right;">Betrag</th>
                            <th style="text-align:center;">Aktion</th>
                        </tr>
                    </thead>
                    <tbody id="finance-tbody">
                        ${DB.finance.map(tx => `
                            <tr>
                                <td style="color:#64748b; font-family:monospace;">#${tx.id}</td>
                                <td>${tx.date}</td>
                                <td><b style="color:white;">${tx.desc}</b></td>
                                <td style="text-align:right;" class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">
                                    ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                </td>
                                <td style="text-align:center;">
                                    <i class="fa-solid fa-trash" style="cursor:pointer; color:#64748b;" onclick="deleteTransaction(${tx.id})"></i>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function addFinanceTransaction() {
    const desc = document.getElementById('fin-desc').value;
    const amount = parseFloat(document.getElementById('fin-amount').value);
    const date = document.getElementById('fin-date').value;

    if(desc && amount && date) {
        DB.finance.unshift({
            id: Date.now(),
            date: date,
            desc: desc,
            amount: amount,
            type: amount >= 0 ? 'in' : 'out'
        });
        saveSystem();
        loadModule('finance'); 
        speak("Transaktion erfolgreich verbucht.");
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

function deleteTransaction(id) {
    if(confirm("Soll diese Buchung wirklich storniert werden?")) {
        DB.finance = DB.finance.filter(tx => tx.id !== id);
        saveSystem();
        loadModule('finance');
    }
}

/**
 * --------------------------------------------------------------------------
 * 6. MODULE: STADION ZEITUNG (CMS)
 * --------------------------------------------------------------------------
 */
function renderNewspaperModule(target) {
    target.innerHTML = `
        <div style="display:flex; justify-content:center;">
            <div class="newspaper-wrapper">
                <div class="paper-header">
                    <h1 class="paper-brand">DIE ROTE BULLEN ARENA</h1>
                    <div class="paper-meta">
                        <span>AUSGABE #24</span>
                        <span>SAISON 2025/26</span>
                        <span>PREIS: 2,50 €</span>
                    </div>
                </div>
                
                <h1 class="headline-l cms-editable" contenteditable="true">MATCHDAY VORSCHAU: ALLES ODER NICHTS</h1>
                
                <div style="width:100%; height:300px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; margin:20px 0; color:#666;" class="cms-editable">
                    [BILD EINFÜGEN - HIER KLICKEN]
                </div>
                
                <div class="article-text cms-editable" contenteditable="true" id="paper-body">
                    Hier beginnt der Text. Klicken Sie, um zu schreiben. Die Mannschaft ist in Topform und bereit für das Spitzenspiel. 
                    Unsere Datenanalysen zeigen klare Lücken in der gegnerischen Kette, die wir heute nutzen wollen.
                </div>

                <div style="margin-top:40px; border-top:2px solid black; padding-top:20px; text-align:center;">
                     <button onclick="window.print()" class="btn-action"><i class="fa-solid fa-print"></i> DRUCKEN / PDF</button>
                     <button onclick="generateAIArticle()" class="btn-action" style="background:#0f172a; color:white;"><i class="fa-solid fa-wand-magic-sparkles"></i> KI TEXT GENERIEREN</button>
                </div>
            </div>
        </div>
    `;
}

function generateAIArticle() {
    const textBlock = document.getElementById('paper-body');
    const phrases = [
        "Die Arena wird beben.",
        "Analysten sehen einen klaren Vorteil im Umschaltspiel.",
        "Xavi Simons könnte heute der entscheidende Faktor sein.",
        "Die Fans haben eine spektakuläre Choreo vorbereitet.",
        "In der Kabine herrscht fokussierte Stille."
    ];
    // Fügt zufällige Sätze hinzu
    textBlock.innerText += " " + phrases[Math.floor(Math.random() * phrases.length)] + " " + phrases[Math.floor(Math.random() * phrases.length)];
    speak("Artikel wurde durch KI erweitert.");
}

/**
 * --------------------------------------------------------------------------
 * 7. MODULE: VR HUB & RETINA STRIKER ENGINE
 * --------------------------------------------------------------------------
 */
function renderVRHub(target) {
    target.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
            <h2 style="font-family:'Orbitron'; color:var(--neon-main); margin-bottom:20px; letter-spacing:3px;">RETINA STRIKER v4.0</h2>
            <div style="background:rgba(0,0,0,0.8); padding:40px; border:1px solid var(--neon-main); border-radius:4px; text-align:center; width:500px; box-shadow:0 0 30px rgba(0,255,65,0.1);">
                <i class="fa-brands fa-meta" style="font-size:60px; color:white; margin-bottom:20px; animation: pulse 2s infinite;"></i>
                <p style="color:var(--text-dim); margin-bottom:30px;">
                    OCTAGON PROTOKOLL WIRD GELADEN.<br>
                    360° Scanning + Audio Feedback Engine.
                </p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
                     <div style="border:1px solid #333; padding:10px; color:#666; font-size:10px;">WAR ROOM<br>(Inaktiv)</div>
                     <div style="border:1px solid var(--neon-main); padding:10px; color:var(--neon-main); font-size:10px; background:rgba(0,255,65,0.1);">OCTAGON<br>(Bereit)</div>
                </div>
                <button class="live-btn active" style="width:100%; justify-content:center; padding:20px; font-size:16px;" onclick="enterVRMode()">
                    START IMMERSION
                </button>
            </div>
        </div>
    `;
}

function enterVRMode() {
    const viewport = document.getElementById('content-viewport');
    const vrView = document.getElementById('vr-viewport');
    
    // Switch to VR View
    viewport.classList.add('hidden');
    vrView.classList.remove('hidden');

    // SETUP VR SCENE (Elite Neon Style)
    const scene = document.querySelector('a-scene');
    
    // Wireframe Grid Boden (TRON Style)
    const plane = document.querySelector('a-plane');
    if(plane) {
        plane.setAttribute('color', '#000000');
        plane.setAttribute('src', ''); // Textur entfernen
        plane.setAttribute('material', 'color: #000; wireframe: true; wireframeLinewidth: 2; opacity: 0.3;');
    }
    
    // Himmel schwarz
    const sky = document.querySelector('a-sky');
    if(sky) sky.setAttribute('color', '#020408');

    // Browser-Befehl für Fullscreen VR
    if (scene.enterVR) {
        scene.enterVR();
    }

    speak("Willkommen im Octagon. Starten Sie das Scanning.");
    startVRTelemetryLoop();
}

function exitVRMode() {
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');
    stopVRTelemetryLoop();
}

// Physik & Mathe Loop für VR (Scanning Simulation)
let vrInterval;
function startVRTelemetryLoop() {
    vrInterval = setInterval(() => {
        // Simuliere Scanner-Daten
        const scanQuality = Math.floor(Math.random() * 20 + 80); // 80-100%
        const xG = (Math.random() * 0.9).toFixed(2);
        
        // Update VR HUD (Text direkt vor der Linse)
        const hud = document.getElementById('vr-hud-text');
        if(hud) {
            hud.setAttribute('value', `SCAN: ${scanQuality}% | xG: ${xG}`);
            hud.setAttribute('color', scanQuality > 90 ? '#00ff41' : '#ffae00');
        }

        // Update Dashboard Sidebar (Live Daten am Laptop)
        const barScan = document.getElementById('bar-scan');
        const valScan = document.getElementById('val-scan');
        const barLat = document.getElementById('bar-lat');
        const valLat = document.getElementById('val-lat');

        if(barScan && valScan) {
            valScan.innerText = scanQuality + "%";
            barScan.style.width = scanQuality + "%";
        }
        if(barLat && valLat) {
            // Latenz Simulation
            let lat = Math.floor(Math.random() * 20 + 70);
            valLat.innerText = lat + "ms";
            barLat.style.width = (100 - (lat-50)) + "%";
        }
    }, 800);
}

function stopVRTelemetryLoop() {
    clearInterval(vrInterval);
}

/**
 * --------------------------------------------------------------------------
 * 8. TONI AI PERSONA (Chat Logic)
 * --------------------------------------------------------------------------
 */
function askToni() {
    const input = document.getElementById('toni-input');
    const container = document.getElementById('chat-stream');
    const question = input.value;
    if(!question) return;

    // User Message
    container.innerHTML += `<div class="msg user"><div class="msg-header">COACH</div><div class="msg-body">${question}</div></div>`;
    input.value = "";
    container.scrollTop = container.scrollHeight;
    
    speak("Moment...");

    setTimeout(() => {
        let answer = "Checke die Daten...";
        const q = question.toLowerCase();

        // Keyword Detection
        if(q.includes("finanz") || q.includes("geld")) answer = "Das Budget ist stabil. Sponsoring deckt die Kosten.";
        else if(q.includes("taktik") || q.includes("aufstellung")) answer = "Gegen tiefstehende Gegner empfehle ich Breite im Spiel. Openda muss in die Tiefe starten.";
        else if(q.includes("training") || q.includes("vr")) answer = "Die Scan-Raten im Octagon sind um 15% gestiegen.";
        else answer = "Die Intensität im Training muss hoch bleiben. Das ist der Schlüssel.";

        container.innerHTML += `<div class="msg ai"><div class="msg-header">TONI</div><div class="msg-body">${answer}</div></div>`;
        container.scrollTop = container.scrollHeight;
        speak(answer);
    }, 1500);
}

function activateVoice() { 
    alert("Mikrofon-Zugriff wird angefordert... (Browser-Feature)"); 
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.rate = 1.05;
        window.speechSynthesis.speak(msg);
    }
}

/**
 * --------------------------------------------------------------------------
 * 9. UTILS & HELPERS
 * --------------------------------------------------------------------------
 */
function startSystemClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock-display').innerText = now.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

function toggleLiveMode() {
    const btn = document.getElementById('live-match-btn');
    btn.classList.toggle('active');
    if(btn.classList.contains('active')) speak("Matchday Modus aktiviert. Live-Tracking läuft.");
    else speak("Training Modus.");
}

// Fokus beim Start
document.addEventListener('DOMContentLoaded', () => {
    const passInput = document.getElementById('sys-pass');
    if(passInput) passInput.focus();
});


/**
 * --------------------------------------------------------------------------
 * 10. MODULE: TACTICS BOARD LOGIC (Full Engine)
 * --------------------------------------------------------------------------
 */
let canvasContext = null;
let activeTool = 'move';
let draggedEl = null;

function renderTacticsBoard(target) {
    target.innerHTML = `
        <div class="tactics-container">
            <div class="tactics-tools">
                <button class="tool-btn active" onclick="setTool('move')" title="Verschieben"><i class="fa-solid fa-arrows-up-down-left-right"></i></button>
                <button class="tool-btn" onclick="setTool('draw-pass')" title="Passlinie"><i class="fa-solid fa-share"></i></button>
                <button class="tool-btn" onclick="setTool('draw-run')" title="Laufweg"><i class="fa-solid fa-person-running"></i></button>
                <hr style="width:100%; border:0; border-top:1px solid #333; margin:10px 0;">
                <button class="tool-btn" onclick="addObj('cone')" title="Hütchen"><i class="fa-solid fa-cone"></i></button>
                <button class="tool-btn" onclick="addObj('ball')" title="Ball"><i class="fa-solid fa-futbol"></i></button>
                <button class="tool-btn" onclick="addObj('goal')" title="Tor"><i class="fa-solid fa-square"></i></button>
                <hr style="width:100%; border:0; border-top:1px solid #333; margin:10px 0;">
                <button class="tool-btn" onclick="clearBoard()" style="color:var(--neon-alert);"><i class="fa-solid fa-trash"></i></button>
                <button class="tool-btn" onclick="toniGenerateDrill()" style="color:var(--neon-main);"><i class="fa-solid fa-robot"></i></button>
            </div>

            <div class="tactics-pitch" id="pitch-area" onmousedown="handleBoardClick(event)">
                <canvas id="tactics-canvas"></canvas>
                ${DB.squad.map((p, i) => `
                    <div class="t-obj obj-player" id="p-${p.id}" style="top:${50 + (i*10)}%; left:${10 + (i*5)}%;" onmousedown="startDrag(event, this)">
                        ${p.pos}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Canvas initialisieren (Verzögert, damit DOM gerendert ist)
    setTimeout(() => {
        const canvas = document.getElementById('tactics-canvas');
        if(canvas) {
            canvas.width = document.getElementById('pitch-area').offsetWidth;
            canvas.height = document.getElementById('pitch-area').offsetHeight;
            canvasContext = canvas.getContext('2d');
        }
    }, 100);
}

// TOOL SWITCHING
function setTool(tool) {
    activeTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
}

// OBJECT MANAGEMENT
function addObj(type) {
    const pitch = document.getElementById('pitch-area');
    const el = document.createElement('div');
    el.className = `t-obj obj-${type}`;
    el.style.top = '50%'; 
    el.style.left = '50%';
    el.onmousedown = function(e) { startDrag(e, this); };
    pitch.appendChild(el);
}

function clearBoard() {
    // Entfernt alle Objekte außer Spieler
    document.querySelectorAll('.obj-cone, .obj-ball, .obj-goal').forEach(o => o.remove());
    // Leert Canvas
    if(canvasContext) {
        const c = document.getElementById('tactics-canvas');
        canvasContext.clearRect(0, 0, c.width, c.height);
    }
}

// DRAG & DROP ENGINE
function startDrag(e, el) {
    if(activeTool !== 'move') return;
    draggedEl = el;
    e.stopPropagation(); // Verhindert dass auf dem Canvas gezeichnet wird
}

// Global Listener (damit man nicht das Element verliert bei schnellen Bewegungen)
document.addEventListener('mousemove', (e) => {
    if (!draggedEl) return;
    const pitch = document.getElementById('pitch-area');
    if(!pitch) return;
    
    const rect = pitch.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    
    // Bounds Check (nicht aus dem Feld ziehen)
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    draggedEl.style.left = x + 'px'; 
    draggedEl.style.top = y + 'px';
});

document.addEventListener('mouseup', () => { draggedEl = null; });

// DRAWING ENGINE
function handleBoardClick(e) {
    if (activeTool === 'move' || !canvasContext) return;

    const pitch = document.getElementById('pitch-area').getBoundingClientRect();
    const x = e.clientX - pitch.left;
    const y = e.clientY - pitch.top;
    const ctx = canvasContext;

    ctx.strokeStyle = activeTool === 'draw-pass' ? '#ffae00' : '#00ff41'; // Neonfarben
    ctx.lineWidth = 3;
    
    if (activeTool === 'draw-pass') ctx.setLineDash([5, 5]); 
    else ctx.setLineDash([]); // Solid line for runs

    // Punkt zeichnen (Vereinfacht)
    ctx.beginPath(); 
    ctx.arc(x, y, 5, 0, 2 * Math.PI); 
    ctx.stroke();
}

/**
 * TONI AI: AUTOMATED DRILLS
 * Baut automatisch Übungen auf.
 */
function toniGenerateDrill() {
    clearBoard();
    speak("Rondo wird aufgebaut. Fokus auf schnelles Passspiel.");
    
    const pitch = document.getElementById('pitch-area');
    const w = pitch.offsetWidth; 
    const h = pitch.offsetHeight;
    
    // Hütchen setzen
    [{x:w*0.3, y:h*0.3}, {x:w*0.7, y:h*0.3}, {x:w*0.7, y:h*0.7}, {x:w*0.3, y:h*0.7}].forEach(pos => {
        const c = document.createElement('div'); 
        c.className = 't-obj obj-cone';
        c.style.left = pos.x + 'px'; 
        c.style.top = pos.y + 'px';
        c.onmousedown = function(e) { startDrag(e, this); };
        pitch.appendChild(c);
    });
    
    // Spieler verschieben (Animation)
    const players = document.querySelectorAll('.obj-player');
    const pos = [
        {x:w*0.3, y:h*0.5}, {x:w*0.5, y:h*0.3}, 
        {x:w*0.7, y:h*0.5}, {x:w*0.5, y:h*0.7}, 
        {x:w*0.5, y:h*0.5} // Mitte
    ];
    
    players.forEach((p, i) => {
        if(pos[i]) {
            p.style.transition = "all 1s cubic-bezier(0.4, 0, 0.2, 1)";
            p.style.left = pos[i].x + 'px'; 
            p.style.top = pos[i].y + 'px';
            setTimeout(() => { p.style.transition = ""; }, 1000); // Reset transition
        }
    });

    // Passweg zeichnen
    setTimeout(() => {
        if(canvasContext) {
            canvasContext.strokeStyle = '#ffae00'; 
            canvasContext.setLineDash([5, 5]); 
            canvasContext.lineWidth = 2;
            canvasContext.beginPath(); 
            canvasContext.moveTo(w*0.3, h*0.5); 
            canvasContext.lineTo(w*0.5, h*0.3); 
            canvasContext.stroke();
        }
    }, 1100);
}
