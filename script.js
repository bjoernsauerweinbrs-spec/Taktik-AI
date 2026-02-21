/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 5.1.0 (MASTER MERGE: FULL UI + PHYSICS ENGINE)
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
        version: "5.1.0"
    },
    // Finanz-Daten
    finance: [
        { id: 1708221, date: "2026-02-20", desc: "Sponsoring: Red Bull Global", amount: 4500000, type: "in" },
        { id: 1708222, date: "2026-02-21", desc: "Gehaltslauf: Profikader Feb", amount: -2100000, type: "out" },
        { id: 1708223, date: "2026-02-22", desc: "Reha-Equipment: Cryo Chamber", amount: -45000, type: "out" },
        { id: 1708224, date: "2026-02-23", desc: "Ticketing: Vorverkauf CL", amount: 850000, type: "in" }
    ],
    // Spieler-Daten
    squad: [
        { id: 101, name: "Péter Gulácsi", pos: "TW", rating: 84, status: "Fit", img: "" },
        { id: 102, name: "Willi Orbán", pos: "IV", rating: 83, status: "Fit", img: "" },
        { id: 103, name: "Dani Olmo", pos: "ZOM", rating: 87, status: "Verletzt", img: "" },
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit", img: "" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Reha", img: "" },
        { id: 106, name: "Benjamin Henrichs", pos: "AV", rating: 81, status: "Fit", img: "" },
        { id: 107, name: "Xaver Schlager", pos: "ZM", rating: 82, status: "Fit", img: "" }
    ],
    // VR Telemetrie Cache
    telemetry: {
        lastScanRate: 0,
        lastLatency: 0,
        sessionCount: 12,
        highScore: 94
    },
    tactics: []
};

// Initialisiere DB beim Start oder lade Backup
let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

/**
 * Speichert den aktuellen Zustand persistent im Browser.
 */
function saveSystem() {
    try {
        localStorage.setItem('toni_elite_db', JSON.stringify(DB));
        refreshKPIs();
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
    let budget = 10000000; 
    DB.finance.forEach(tx => budget += tx.amount);
    let squadValue = DB.squad.reduce((acc, p) => acc + (p.rating * 1500000), 0);

    const budgetEl = document.getElementById('kpi-budget');
    if(budgetEl) {
        budgetEl.innerText = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(budget);
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
    
    if (input === DB.settings.pass) {
        terminal.style.opacity = '0';
        speak("Identifikation bestätigt. Willkommen im RETINA STRIKER System.");
        
        setTimeout(() => {
            terminal.classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            refreshKPIs();
            startSystemClock();
            loadModule('kader'); 
        }, 800);
    } else {
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

    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    if(event && event.target && event.target.tagName === 'BUTTON') {
        event.target.classList.add('active');
    }

    const vrView = document.getElementById('vr-viewport');
    if(vrView) vrView.classList.add('hidden');
    viewport.classList.remove('hidden');

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
            renderTacticsBoard(viewport); 
            break;
        case 'scouting':
            displayTitle.innerText = "MATCH PREP // SPIELTAGS-CLIPBOARD";
            renderMatchPrep(viewport);
            break;
        case 'drills':
            displayTitle.innerText = "COACHING // SESSION PLANNER";
            renderDrillPlanner(viewport);
            break;
        
        case 'medical':
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
    html += `
        <div class="fifa-card add-new" onclick="createNewPlayer()">
            <i class="fa-solid fa-plus" style="font-size:40px;"></i>
            <span style="margin-top:10px; font-size:12px; font-weight:700;">NEUER SPIELER</span>
        </div>
    </div>`;
    target.innerHTML = html;
}

function openPlayerEditor(id) {
    const p = DB.squad.find(x => x.id === id);
    if(!p) return;
    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-pos').value = p.pos;
    document.getElementById('edit-p-rating').value = p.rating;
    document.getElementById('edit-p-med').value = p.status;
    document.getElementById('modal-player-editor').classList.remove('hidden');
}

function createNewPlayer() {
    const newId = Date.now();
    DB.squad.push({ id: newId, name: "Neuer Spieler", pos: "ZM", rating: 75, status: "Fit", img: "" });
    saveSystem();
    renderSquadModule(document.getElementById('content-viewport'));
    openPlayerEditor(newId);
}

function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const index = DB.squad.findIndex(x => x.id === id);
    if(index > -1) {
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

function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }

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
                    <thead><tr><th>ID</th><th>Datum</th><th>Beschreibung</th><th style="text-align:right;">Betrag</th><th style="text-align:center;">Aktion</th></tr></thead>
                    <tbody id="finance-tbody">
                        ${DB.finance.map(tx => `
                            <tr>
                                <td style="color:#64748b; font-family:monospace;">#${tx.id}</td>
                                <td>${tx.date}</td>
                                <td><b style="color:white;">${tx.desc}</b></td>
                                <td style="text-align:right;" class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tx.amount)}</td>
                                <td style="text-align:center;"><i class="fa-solid fa-trash" style="cursor:pointer; color:#64748b;" onclick="deleteTransaction(${tx.id})"></i></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
}

function addFinanceTransaction() {
    const desc = document.getElementById('fin-desc').value;
    const amount = parseFloat(document.getElementById('fin-amount').value);
    const date = document.getElementById('fin-date').value;
    if(desc && amount && date) {
        DB.finance.unshift({ id: Date.now(), date: date, desc: desc, amount: amount, type: amount >= 0 ? 'in' : 'out' });
        saveSystem();
        loadModule('finance'); 
        speak("Transaktion erfolgreich verbucht.");
    } else { alert("Bitte alle Felder ausfüllen."); }
}

function deleteTransaction(id) {
    if(confirm("Soll diese Buchung wirklich storniert werden?")) { DB.finance = DB.finance.filter(tx => tx.id !== id); saveSystem(); loadModule('finance'); }
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
                <div class="paper-header"><h1 class="paper-brand">DIE ROTE BULLEN ARENA</h1><div class="paper-meta"><span>AUSGABE #24</span><span>SAISON 2025/26</span></div></div>
                <h1 class="headline-l cms-editable" contenteditable="true">MATCHDAY VORSCHAU: ALLES ODER NICHTS</h1>
                <div style="width:100%; height:300px; background:#e2e8f0; display:flex; align-items:center; justify-content:center; margin:20px 0; color:#666;" class="cms-editable">[BILD EINFÜGEN - HIER KLICKEN]</div>
                <div class="article-text cms-editable" contenteditable="true" id="paper-body">Hier beginnt der Text. Klicken Sie, um zu schreiben.</div>
                <div style="margin-top:40px; border-top:2px solid black; padding-top:20px; text-align:center;">
                     <button onclick="window.print()" class="btn-action"><i class="fa-solid fa-print"></i> DRUCKEN / PDF</button>
                     <button onclick="generateAIArticle()" class="btn-action" style="background:#0f172a; color:white;"><i class="fa-solid fa-wand-magic-sparkles"></i> KI TEXT GENERIEREN</button>
                </div>
            </div>
        </div>`;
}

function generateAIArticle() {
    document.getElementById('paper-body').innerText += " Die Arena wird beben. Analysten sehen einen klaren Vorteil im Umschaltspiel.";
    speak("Artikel wurde durch KI erweitert.");
}

/**
 * --------------------------------------------------------------------------
 * 7. MODULE: VR HUB & PHYSICS ENGINE (THE CORE)
 * --------------------------------------------------------------------------
 */
function renderVRHub(target) {
    target.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
            <h2 style="font-family:'Orbitron'; color:var(--neon-main); margin-bottom:20px; letter-spacing:3px;">RETINA STRIKER v5.1</h2>
            <div style="background:rgba(0,0,0,0.8); padding:40px; border:1px solid var(--neon-main); border-radius:4px; text-align:center; width:500px; box-shadow:0 0 30px rgba(0,255,65,0.1);">
                <i class="fa-brands fa-meta" style="font-size:60px; color:white; margin-bottom:20px; animation: pulse 2s infinite;"></i>
                <p style="color:var(--text-dim); margin-bottom:30px;">
                    PHYSICS ENGINE ONLINE.<br>
                    Lade 3D-Umgebung: Tor, Ball, Gegner-KI.
                </p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
                     <div style="border:1px solid #333; padding:10px; color:#666; font-size:10px;">WAR ROOM<br>(Inaktiv)</div>
                     <div style="border:1px solid var(--neon-main); padding:10px; color:var(--neon-main); font-size:10px; background:rgba(0,255,65,0.1);">OCTAGON<br>(Bereit)</div>
                </div>
                <button class="live-btn active" style="width:100%; justify-content:center; padding:20px; font-size:16px;" onclick="enterVRMode()">
                    START SIMULATION
                </button>
            </div>
        </div>`;
}

// PHYSICS LOOP
let ballInterval;

function enterVRMode() {
    const viewport = document.getElementById('content-viewport');
    const vrView = document.getElementById('vr-viewport');
    
    viewport.classList.add('hidden');
    vrView.classList.remove('hidden');

    const scene = document.querySelector('a-scene');
    
    // BODEN FIX FÜR META QUEST (SICHTBARKEIT)
    const plane = document.querySelector('a-plane');
    if(plane) {
        plane.removeAttribute('src'); 
        plane.setAttribute('material', 'color: #00ff41; wireframe: true; wireframeLinewidth: 2; opacity: 1;');
    }
    
    if (scene.enterVR) {
        scene.enterVR();
    }

    speak("Physics Engine gestartet. Ball-Simulation aktiv.");
    startBallSimulation();
}

function startBallSimulation() {
    const ball = document.getElementById('vr-ball');
    const hud = document.getElementById('vr-hud-text');
    let posZ = -2;
    let direction = -1; 

    if(ballInterval) clearInterval(ballInterval);

    ballInterval = setInterval(() => {
        // Ball Physik (Ping Pong)
        posZ += (0.1 * direction);
        if(posZ < -8) direction = 1; 
        if(posZ > -1) direction = -1;

        if(ball) ball.setAttribute('position', `0 0.2 ${posZ}`);

        // Live HUD Telemetrie
        if(hud) {
            let dist = Math.abs(posZ).toFixed(1);
            let xG = (1/dist).toFixed(2); if(xG>0.99)xG=0.99;
            hud.setAttribute('value', `DIST: ${dist}m | xG: ${xG}`);
            hud.setAttribute('color', '#00ff41'); 
        }
    }, 50);
}

function exitVRMode() {
    if(ballInterval) clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');
}

/**
 * --------------------------------------------------------------------------
 * 8. TONI AI PERSONA
 * --------------------------------------------------------------------------
 */
function askToni() {
    const input = document.getElementById('toni-input');
    const container = document.getElementById('chat-stream');
    const question = input.value;
    if(!question) return;

    container.innerHTML += `<div class="msg user"><div class="msg-header">COACH</div><div class="msg-body">${question}</div></div>`;
    input.value = "";
    container.scrollTop = container.scrollHeight;
    
    speak("Moment...");
    setTimeout(() => {
        let answer = "Checke die Daten...";
        const q = question.toLowerCase();
        if(q.includes("finanz") || q.includes("geld")) answer = "Das Budget ist stabil. Sponsoring deckt die Kosten.";
        else if(q.includes("taktik") || q.includes("aufstellung")) answer = "Gegen tiefstehende Gegner empfehle ich Breite im Spiel. Openda muss in die Tiefe starten.";
        else if(q.includes("training") || q.includes("vr")) answer = "Die Scan-Raten im Octagon sind um 15% gestiegen.";
        else answer = "Die Intensität im Training muss hoch bleiben. Das ist der Schlüssel.";

        container.innerHTML += `<div class="msg ai"><div class="msg-header">TONI</div><div class="msg-body">${answer}</div></div>`;
        container.scrollTop = container.scrollHeight;
        speak(answer);
    }, 1500);
}

function activateVoice() { alert("Mikrofon-Zugriff wird angefordert... (Browser-Feature)"); }

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

    setTimeout(() => {
        const canvas = document.getElementById('tactics-canvas');
        if(canvas) {
            canvas.width = document.getElementById('pitch-area').offsetWidth;
            canvas.height = document.getElementById('pitch-area').offsetHeight;
            canvasContext = canvas.getContext('2d');
        }
    }, 100);
}

function setTool(tool) {
    activeTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
}

function addObj(type) {
    const el = document.createElement('div');
    el.className = `t-obj obj-${type}`;
    el.style.top = '50%'; el.style.left = '50%';
    el.onmousedown = function(e) { startDrag(e, this); };
    document.getElementById('pitch-area').appendChild(el);
}

function clearBoard() {
    document.querySelectorAll('.obj-cone, .obj-ball, .obj-goal').forEach(o => o.remove());
    if(canvasContext) {
        const c = document.getElementById('tactics-canvas');
        canvasContext.clearRect(0, 0, c.width, c.height);
    }
}

function startDrag(e, el) {
    if(activeTool !== 'move') return;
    draggedEl = el;
    e.stopPropagation(); 
}

document.addEventListener('mousemove', (e) => {
    if (!draggedEl) return;
    const pitch = document.getElementById('pitch-area');
    if(!pitch) return;
    const rect = pitch.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    draggedEl.style.left = x + 'px'; 
    draggedEl.style.top = y + 'px';
});

document.addEventListener('mouseup', () => { draggedEl = null; });

function handleBoardClick(e) {
    if (activeTool === 'move' || !canvasContext) return;
    const pitch = document.getElementById('pitch-area').getBoundingClientRect();
    const x = e.clientX - pitch.left;
    const y = e.clientY - pitch.top;
    const ctx = canvasContext;
    ctx.strokeStyle = activeTool === 'draw-pass' ? '#ffae00' : '#00ff41';
    ctx.lineWidth = 3;
    if (activeTool === 'draw-pass') ctx.setLineDash([5, 5]); else ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * Math.PI); ctx.stroke();
}

function toniGenerateDrill() {
    clearBoard();
    speak("Rondo wird aufgebaut. Fokus auf schnelles Passspiel.");
    const pitch = document.getElementById('pitch-area');
    const w = pitch.offsetWidth; const h = pitch.offsetHeight;
    
    [{x:w*0.3, y:h*0.3}, {x:w*0.7, y:h*0.3}, {x:w*0.7, y:h*0.7}, {x:w*0.3, y:h*0.7}].forEach(pos => {
        const c = document.createElement('div'); c.className = 't-obj obj-cone';
        c.style.left = pos.x + 'px'; c.style.top = pos.y + 'px';
        c.onmousedown = function(e) { startDrag(e, this); };
        pitch.appendChild(c);
    });
}

/**
 * --------------------------------------------------------------------------
 * 11. MODULE: MATCH PREP CLIPBOARD (Nagelsmann Mode)
 * --------------------------------------------------------------------------
 */
function renderMatchPrep(target) {
    let playerOptions = `<option value="">-- Wähle Spieler --</option>`;
    DB.squad.forEach(p => {
        if(p.status !== 'Verletzt') {
            playerOptions += `<option value="${p.name}">${p.pos} - ${p.name} (${p.rating})</option>`;
        }
    });

    target.innerHTML = `
        <div class="clipboard-wrapper">
            <div class="formation-board">
                <div class="pos-slot" style="bottom: 5%; left: 50%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 20%; left: 35%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 20%; left: 65%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 25%; left: 10%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 25%; left: 90%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 40%; left: 40%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="bottom: 40%; left: 60%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="top: 35%; left: 15%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="top: 30%; left: 50%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="top: 35%; left: 85%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
                <div class="pos-slot" style="top: 15%; left: 50%;"><div class="pos-dot"></div><select class="pos-select">${playerOptions}</select></div>
            </div>

            <div class="analysis-sheet">
                <div class="sheet-header"><div class="sheet-title">MATCHPLAN: SAISON 25/26</div><div style="font-size:10px; color:#666;">COACHING ZONE ONLY</div></div>
                <div class="form-group"><label class="notes-label">GEGNER</label><input type="text" style="width:100%; background:black; color:white; border:1px solid #333; padding:5px;" value="Borussia Dortmund"></div>
                <div class="form-group"><label class="notes-label">GEGNERISCHE SCHWÄCHEN (ANALYSE)</label><textarea class="notes-area" id="enemy-weakness">Hohe Kette bei Ballverlust anfällig. Außenverteidiger rücken zu weit auf. Umschaltspiel über Openda forcieren.</textarea></div>
                <div class="form-group"><label class="notes-label">STANDARDS / KEY DUELS</label><textarea class="notes-area" id="key-duels">Ecken auf den ersten Pfosten (Orban). Simons vs. Can im Zentrum isolieren.</textarea></div>
                <div style="margin-top:auto; display:flex; gap:10px;">
                    <button class="live-btn" onclick="toniAutoAnalyze()"><i class="fa-solid fa-brain"></i> TONI ANALYSE</button>
                    <button class="live-btn active" onclick="window.print()"><i class="fa-solid fa-print"></i> DRUCKEN (KABINE)</button>
                </div>
            </div>
        </div>`;
}

function toniAutoAnalyze() {
    speak("Ich lade die Daten der letzten 5 Spiele des Gegners...");
    const area = document.getElementById('enemy-weakness');
    setTimeout(() => {
        area.value += "\n\n[TONI UPDATE]: Torwart hat Schwächen bei Fernschüssen. Pressing-Trigger: Sobald der Innenverteidiger aufdreht.";
        speak("Analyse ergänzt. Pressing-Trigger identifiziert.");
    }, 1500);
}

/**
 * --------------------------------------------------------------------------
 * 12. MODULE: SESSION PLANNER (Training)
 * --------------------------------------------------------------------------
 */
const DRILL_DB = [
    { id: 'd1', name: "Rondo 5vs2 (Klassik)", time: 15, cat: "Warmup", icon: "fa-ring" },
    { id: 'd2', name: "Passform Y-Muster", time: 20, cat: "Technik", icon: "fa-share-nodes" },
    { id: 'd3', name: "Torschuss aus Drehung", time: 25, cat: "Abschluss", icon: "fa-bullseye" },
    { id: 'd4', name: "Pressing-Simulation (VR)", time: 30, cat: "Taktik", icon: "fa-vr-cardboard" },
    { id: 'd5', name: "Laktat-Shuttles", time: 20, cat: "Physis", icon: "fa-heart-pulse" },
    { id: 'd6', name: "Cool Down / Dehnen", time: 10, cat: "Recovery", icon: "fa-bed" },
    { id: 'd7', name: "11vs11 Abschlussspiel", time: 30, cat: "Match", icon: "fa-users" }
];
let currentSession = [];

function renderDrillPlanner(target) {
    target.innerHTML = `
        <div class="planner-wrapper">
            <div class="drill-library">
                <div class="lib-header">ÜBUNGS-KATALOG</div>
                ${DRILL_DB.map(d => `
                    <div class="drill-item" onclick="addDrillToSession('${d.id}')">
                        <i class="fa-solid ${d.icon} drill-icon"></i>
                        <span class="drill-name">${d.name}</span>
                        <span class="drill-time">${d.time} min</span>
                        <i class="fa-solid fa-plus" style="font-size:10px; color:#666;"></i>
                    </div>
                `).join('')}
                <div style="margin-top:20px; border-top:1px solid #333; padding-top:10px;">
                    <div class="lib-header">KI ASSISTENT</div>
                    <button class="live-btn" style="width:100%; justify-content:center; margin-bottom:10px;" onclick="aiGenerateSession('hard')"><i class="fa-solid fa-fire"></i> INTENSITÄT (High)</button>
                    <button class="live-btn" style="width:100%; justify-content:center; border-color:var(--neon-warn); color:var(--neon-warn);" onclick="aiGenerateSession('recovery')"><i class="fa-solid fa-battery-half"></i> REGENERATION</button>
                </div>
            </div>
            <div class="session-board" id="session-list">
                <div class="session-header">
                    <div><h2 style="font-family:'Orbitron'; color:white;">TRAININGSPLAN: HEUTE</h2><small style="color:#888;">Start: 10:00 Uhr | Platz 1</small></div>
                    <div class="total-time" id="total-session-time">0 min</div>
                </div>
                <div id="active-drills-container"><div style="text-align:center; color:#444; padding:50px;"><i>Wähle Übungen aus der Bibliothek...</i></div></div>
                <div class="session-footer" style="margin-top:30px; border-top:1px solid #333; padding-top:20px; display:flex; gap:10px;">
                    <button class="live-btn active" onclick="window.print()" style="flex:1; justify-content:center;"><i class="fa-solid fa-print"></i> DRUCKEN</button>
                    <button class="live-btn" onclick="clearSession()" style="flex:1; justify-content:center; border-color:var(--neon-alert); color:var(--neon-alert);"><i class="fa-solid fa-trash"></i> CLEAR</button>
                </div>
            </div>
        </div>`;
    updateSessionView();
}

function addDrillToSession(id) {
    const drill = DRILL_DB.find(d => d.id === id);
    if(drill) { currentSession.push(drill); updateSessionView(); }
}

function removeDrill(index) {
    currentSession.splice(index, 1);
    updateSessionView();
}

function clearSession() {
    currentSession = [];
    updateSessionView();
}

function updateSessionView() {
    const container = document.getElementById('active-drills-container');
    const timeDisplay = document.getElementById('total-session-time');
    if(!container) return;
    if(currentSession.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:#444; padding:50px;"><i>Liste leer...</i></div>`;
        timeDisplay.innerText = "0 min";
        return;
    }
    let total = 0;
    container.innerHTML = currentSession.map((d, index) => {
        total += d.time;
        return `
        <div class="active-drill">
            <div style="font-family:'Orbitron'; color:var(--neon-main); font-size:18px; width:30px;">${index + 1}</div>
            <div style="flex:1;">
                <div class="drill-name" style="font-size:14px; margin-bottom:2px;">${d.name}</div>
                <div style="font-size:10px; color:#888;">${d.cat}</div>
            </div>
            <div style="font-family:'Orbitron'; font-size:14px;">${d.time}'</div>
            <i class="fa-solid fa-xmark" style="cursor:pointer; color:#666;" onclick="removeDrill(${index})"></i>
        </div>`;
    }).join('');
    timeDisplay.innerText = total + " min";
    if(total > 90) timeDisplay.style.color = "var(--neon-alert)";
    else timeDisplay.style.color = "var(--neon-main)";
}

function aiGenerateSession(type) {
    currentSession = [];
    if(type === 'hard') {
        addDrillToSession('d1'); addDrillToSession('d2'); addDrillToSession('d5'); addDrillToSession('d7');
        speak("Intensives Training erstellt. Dauer: 85 Minuten.");
    } else {
        addDrillToSession('d1'); addDrillToSession('d6');
        speak("Regenerations-Einheit erstellt. Dauer: 25 Minuten.");
    }
}
