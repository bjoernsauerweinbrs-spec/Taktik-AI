/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 5.3.0 (COGNITIVE DECISION UPDATE)
   Architecture: Monolith / Local-First / VR-Hybrid / Retina-Design
   ========================================================================== */

/**
 * --------------------------------------------------------------------------
 * 1. DATABASE & STATE MANAGEMENT
 * --------------------------------------------------------------------------
 */
const DEFAULT_DB = {
    settings: {
        pass: "Toni2026",
        clubName: "RB Leipzig",
        coachName: "Head Coach",
        version: "5.3.0"
    },
    finance: [
        { id: 1708221, date: "2026-02-20", desc: "Sponsoring: Red Bull Global", amount: 4500000, type: "in" },
        { id: 1708222, date: "2026-02-21", desc: "Gehaltslauf: Profikader Feb", amount: -2100000, type: "out" },
        { id: 1708223, date: "2026-02-22", desc: "Reha-Equipment: Cryo Chamber", amount: -45000, type: "out" },
        { id: 1708224, date: "2026-02-23", desc: "Ticketing: Vorverkauf CL", amount: 850000, type: "in" }
    ],
    squad: [
        { id: 101, name: "Péter Gulácsi", pos: "TW", rating: 84, status: "Fit", img: "" },
        { id: 102, name: "Willi Orbán", pos: "IV", rating: 83, status: "Fit", img: "" },
        { id: 103, name: "Dani Olmo", pos: "ZOM", rating: 87, status: "Verletzt", img: "" },
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit", img: "" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Reha", img: "" },
        { id: 106, name: "Benjamin Henrichs", pos: "AV", rating: 81, status: "Fit", img: "" },
        { id: 107, name: "Xaver Schlager", pos: "ZM", rating: 82, status: "Fit", img: "" }
    ],
    telemetry: {
        lastScanRate: 0,
        avgReactionTime: 0,
        totalBalls: 0,
        successDecisions: 0
    },
    tactics: {
        formation: "4-4-2",
        objects: []
    }
};

let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

function saveSystem() {
    try {
        localStorage.setItem('toni_elite_db', JSON.stringify(DB));
        refreshKPIs();
    } catch (e) {
        console.error("Save Error", e);
    }
}

function refreshKPIs() {
    let budget = 10000000; 
    DB.finance.forEach(tx => budget += tx.amount);
    let squadValue = DB.squad.reduce((acc, p) => acc + (p.rating * 1500000), 0);
    const budgetEl = document.getElementById('kpi-budget');
    if(budgetEl) {
        budgetEl.innerText = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(budget);
        budgetEl.className = budget < 0 ? 'value val-neg' : 'value val-pos';
    }
    const squadEl = document.getElementById('kpi-squad-value');
    if(squadEl) squadEl.innerText = (squadValue / 1000000).toFixed(1) + "M €";
}

/**
 * --------------------------------------------------------------------------
 * 2. AUTHENTICATION & BOOT
 * --------------------------------------------------------------------------
 */
function systemBootSequence() {
    const input = document.getElementById('sys-pass').value;
    const terminal = document.getElementById('auth-layer');
    if (input === DB.settings.pass) {
        terminal.style.opacity = '0';
        speak("Biometrischer Scan erfolgreich. Willkommen im Elite Center.");
        setTimeout(() => {
            terminal.classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            refreshKPIs();
            startSystemClock();
            loadModule('kader');
        }, 800);
    } else {
        alert("ZUGRIFF VERWEIGERT.");
    }
}

/**
 * --------------------------------------------------------------------------
 * 3. MODULE NAVIGATION
 * --------------------------------------------------------------------------
 */
function loadModule(moduleId) {
    const viewport = document.getElementById('content-viewport');
    const displayTitle = document.getElementById('active-module-display');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    document.getElementById('vr-viewport').classList.add('hidden');
    viewport.classList.remove('hidden');

    switch(moduleId) {
        case 'kader': displayTitle.innerText = "DASHBOARD // KADER"; renderSquadModule(viewport); break;
        case 'finance': displayTitle.innerText = "MANAGEMENT // FINANZEN"; renderFinanceModule(viewport); break;
        case 'vr-hub': displayTitle.innerText = "INNOVATION // OCTAGON VR"; renderVRHub(viewport); break;
        case 'tactics': displayTitle.innerText = "COACHING // TAKTIK BOARD"; renderTacticsBoard(viewport); break;
        case 'scouting': displayTitle.innerText = "COACHING // MATCH PREP"; renderMatchPrep(viewport); break;
        case 'drills': displayTitle.innerText = "COACHING // PLANNER"; renderDrillPlanner(viewport); break;
        case 'stadionzeitung': displayTitle.innerText = "MEDIA // ZEITUNG CMS"; renderNewspaperModule(viewport); break;
    }
}

/**
 * --------------------------------------------------------------------------
 * 4. KADER & FINANZEN (Full Version)
 * --------------------------------------------------------------------------
 */
function renderSquadModule(target) {
    let html = `<div class="card-grid">`;
    DB.squad.forEach(p => {
        let statusColor = p.status === 'Fit' ? 'status-fit' : (p.status === 'Reha' ? 'status-reha' : 'status-verletzt');
        html += `<div class="fifa-card" onclick="openPlayerEditor(${p.id})">
            <div class="med-status ${statusColor}"></div>
            <div class="card-top"><span class="rating">${p.rating}</span><span class="pos">${p.pos}</span></div>
            <img src="https://ui-avatars.com/api/?name=${p.name}&background=random&size=128&bold=true" class="player-img">
            <div class="player-name">${p.name}</div>
        </div>`;
    });
    html += `<div class="fifa-card add-new" onclick="createNewPlayer()"><i class="fa-solid fa-plus"></i></div></div>`;
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

function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const index = DB.squad.findIndex(x => x.id === id);
    if(index > -1) {
        DB.squad[index].name = document.getElementById('edit-p-name').value;
        DB.squad[index].pos = document.getElementById('edit-p-pos').value;
        DB.squad[index].rating = parseInt(document.getElementById('edit-p-rating').value);
        DB.squad[index].status = document.getElementById('edit-p-med').value;
        saveSystem(); closeModal('modal-player-editor'); renderSquadModule(document.getElementById('content-viewport'));
    }
}

function renderFinanceModule(target) {
    target.innerHTML = `<div class="finance-dashboard">
        <div class="input-panel">
            <input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}">
            <input type="text" id="fin-desc" placeholder="Zweck">
            <input type="number" id="fin-amount" placeholder="€">
            <button class="btn-action" onclick="addFinanceTransaction()">BUCHEN</button>
        </div>
        <table class="data-table">
            <thead><tr><th>Datum</th><th>Beschreibung</th><th style="text-align:right;">Betrag</th><th></th></tr></thead>
            <tbody>${DB.finance.map(tx => `<tr><td>${tx.date}</td><td>${tx.desc}</td><td style="text-align:right;" class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">${tx.amount} €</td><td style="text-align:center;"><i class="fa-solid fa-trash" onclick="deleteTransaction(${tx.id})"></i></td></tr>`).join('')}</tbody>
        </table>
    </div>`;
}

function addFinanceTransaction() {
    const desc = document.getElementById('fin-desc').value;
    const amount = parseFloat(document.getElementById('fin-amount').value);
    const date = document.getElementById('fin-date').value;
    if(desc && amount) {
        DB.finance.unshift({ id: Date.now(), date, desc, amount, type: amount >= 0 ? 'in' : 'out' });
        saveSystem(); loadModule('finance');
    }
}

function deleteTransaction(id) { DB.finance = DB.finance.filter(tx => tx.id !== id); saveSystem(); loadModule('finance'); }

/**
 * --------------------------------------------------------------------------
 * 5. VR COGNITIVE ELITE ENGINE (The Master Build 5.3.0)
 * --------------------------------------------------------------------------
 */
let trainingActive = false;
let ballInterval;
let scanCount = 0;
let totalBalls = 0;
let successDecisions = 0;
let correctTargetId = null;
let targetStartTime = 0;

function renderVRHub(target) {
    target.innerHTML = `
        <div class="vr-hub-ui">
            <h1 style="font-family:'Orbitron'; color:var(--neon-main);">COGNITIVE ELITE v5.3</h1>
            <div class="stats-grid" style="display:flex; gap:10px; margin:20px 0;">
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1;">
                    <h3>SCAN RATE</h3><div id="vr-live-scan" style="font-size:24px; color:var(--neon-main);">0%</div>
                </div>
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1;">
                    <h3>DECISION</h3><div id="vr-live-score" style="font-size:24px; color:#22c55e;">0/0</div>
                </div>
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1;">
                    <h3>SPEED</h3><div id="vr-live-speed" style="font-size:24px;">0ms</div>
                </div>
            </div>
            <button class="live-btn active" style="padding:15px 40px; font-size:16px;" onclick="enterVRMode()">
                START COGNITIVE SESSION
            </button>
        </div>`;
}

function enterVRMode() {
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) scene.enterVR();
    trainingActive = true;
    scanCount = 0; totalBalls = 0; successDecisions = 0;
    speak("Elite Training gestartet. Scanne das Feld nach dem grünen Signal.");
    startCognitiveLoop();
}

function startCognitiveLoop() {
    const ball = document.getElementById('vr-ball');
    const hud = document.getElementById('vr-hud-text');
    const camera = document.querySelector('a-camera');
    const targets = ['target-L', 'target-R', 'target-DL', 'target-DR'];
    let bZ = -15; 
    let decisionMade = false;
    let hasScanned = false;

    if(ballInterval) clearInterval(ballInterval);

    ballInterval = setInterval(() => {
        if(!trainingActive) return;

        bZ += 0.22; // Ballgeschwindigkeit

        // Phase 1: Signal geben (Ball bei -10m)
        if(bZ > -10.2 && bZ < -9.8 && !correctTargetId) {
            resetTargets();
            correctTargetId = targets[Math.floor(Math.random() * targets.length)];
            const targetEl = document.getElementById(correctTargetId);
            targetEl.querySelector('a-cylinder').setAttribute('color', '#00ff41'); // Grün
            targetStartTime = Date.now();
        }

        // Phase 2: Ball erreicht Spieler (Entscheidung prüfen)
        if(bZ > 0) {
            totalBalls++;
            if(hasScanned && decisionMade) {
                successDecisions++;
                speak("Top Entscheidung!");
            } else if (!hasScanned) {
                speak("Schulterblick vergessen!");
            } else {
                speak("Falsches Ziel!");
            }
            
            bZ = -15; hasScanned = false; decisionMade = false;
            resetTargets();
            correctTargetId = null;
        }

        if(ball) ball.setAttribute('position', `0 0.15 ${bZ}`);

        // Kognitive Überprüfung (Blickrichtung & Scan)
        const rot = camera.getAttribute('rotation');
        if(Math.abs(rot.y) > 35) hasScanned = true;

        // Prüfen, ob der Spieler zum richtigen Ziel schaut
        if(correctTargetId && !decisionMade) {
            if(isLookingAtTarget(rot.y, correctTargetId)) {
                let reactionTime = Date.now() - targetStartTime;
                decisionMade = true;
                updateUIMetrics(reactionTime);
            }
        }

        // HUD Update
        if(hud) {
            let rate = totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0;
            hud.setAttribute('value', `DECISION: ${decisionMade ? 'READY' : 'SCANNING'}\nSCORE: ${successDecisions}/${totalBalls} | ${rate}%`);
            hud.setAttribute('color', decisionMade ? "#00ff41" : "#ffae00");
        }
    }, 50);
}

function resetTargets() {
    ['target-L', 'target-R', 'target-DL', 'target-DR'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.querySelector('a-cylinder').setAttribute('color', '#333');
    });
}

function isLookingAtTarget(rotY, id) {
    // Einfache Winkel-Logik für die 4 Stationen
    if(id === 'target-L' && rotY > 60) return true;
    if(id === 'target-R' && rotY < -60) return true;
    if(id === 'target-DL' && rotY > 20 && rotY < 60) return true;
    if(id === 'target-DR' && rotY < -20 && rotY > -60) return true;
    return false;
}

function updateUIMetrics(time) {
    const speedEl = document.getElementById('vr-live-speed');
    const scoreEl = document.getElementById('vr-live-score');
    const latVal = document.getElementById('val-lat');
    const latBar = document.getElementById('bar-lat');

    if(speedEl) speedEl.innerText = time + "ms";
    if(scoreEl) scoreEl.innerText = successDecisions + "/" + totalBalls;
    if(latVal) latVal.innerText = time + "ms";
    if(latBar) latBar.style.width = Math.min(time/10, 100) + "%";
}

function exitVRMode() {
    trainingActive = false; clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');
    resetTargets();
}

/**
 * --------------------------------------------------------------------------
 * 6. TAKTIK & TOOLS (Full Depth)
 * --------------------------------------------------------------------------
 */
let canvasContext = null;
let activeTool = 'move';
let draggedEl = null;

function renderTacticsBoard(target) {
    target.innerHTML = `<div class="tactics-container">
        <div class="tactics-tools">
            <button class="tool-btn active" onclick="setTool('move', this)"><i class="fa-solid fa-arrows-up-down-left-right"></i></button>
            <button class="tool-btn" onclick="setTool('draw', this)"><i class="fa-solid fa-pen"></i></button>
            <button class="tool-btn" onclick="addObj('cone')"><i class="fa-solid fa-cone"></i></button>
            <button class="tool-btn" onclick="addObj('ball')"><i class="fa-solid fa-futbol"></i></button>
            <button class="tool-btn" onclick="clearBoard()" style="color:red;"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="tactics-pitch" id="pitch-area" onmousedown="handleBoardClick(event)">
            <canvas id="tactics-canvas"></canvas>
            ${DB.squad.map((p, i) => `<div class="t-obj obj-player" style="top:${20+(i*5)}%; left:${10+(i*8)}%;" onmousedown="startDrag(event, this)">${p.pos}</div>`).join('')}
        </div>
    </div>`;
    setTimeout(initCanvas, 100);
}

function initCanvas() {
    const c = document.getElementById('tactics-canvas');
    if(c) { c.width = c.parentElement.offsetWidth; c.height = c.parentElement.offsetHeight; canvasContext = c.getContext('2d'); }
}

function setTool(tool, btn) {
    activeTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function startDrag(e, el) { if(activeTool === 'move') { draggedEl = el; e.stopPropagation(); } }

document.addEventListener('mousemove', (e) => {
    if(!draggedEl) return;
    const rect = document.getElementById('pitch-area').getBoundingClientRect();
    draggedEl.style.left = (e.clientX - rect.left) + 'px';
    draggedEl.style.top = (e.clientY - rect.top) + 'px';
});

document.addEventListener('mouseup', () => draggedEl = null);

function handleBoardClick(e) {
    if(activeTool !== 'draw' || !canvasContext) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    canvasContext.strokeStyle = "#00ff41"; canvasContext.lineWidth = 3;
    canvasContext.beginPath(); canvasContext.arc(x, y, 4, 0, Math.PI*2); canvasContext.stroke();
}

function addObj(type) {
    const el = document.createElement('div'); el.className = `t-obj obj-${type}`;
    el.style.top = '50%'; el.style.left = '50%'; el.onmousedown = function(e) { startDrag(e, this); };
    document.getElementById('pitch-area').appendChild(el);
}

function clearBoard() {
    document.querySelectorAll('.obj-cone, .obj-ball').forEach(o => o.remove());
    if(canvasContext) canvasContext.clearRect(0,0,5000,5000);
}

/**
 * --------------------------------------------------------------------------
 * 7. MATCH PREP & DRILL PLANNER
 * --------------------------------------------------------------------------
 */
function renderMatchPrep(target) {
    let opts = `<option value="">-- Wählen --</option>` + DB.squad.map(p => `<option>${p.pos} - ${p.name}</option>`).join('');
    target.innerHTML = `<div class="clipboard-wrapper">
        <div class="formation-board">
            ${[...Array(11)].map((_, i) => `<div class="pos-slot slot-${i}"><div class="pos-dot"></div><select class="pos-select">${opts}</select></div>`).join('')}
        </div>
        <div class="analysis-sheet">
            <h3>MATCHPLAN SAISON 25/26</h3>
            <textarea class="notes-area">Bayern isolieren. Pressing über Musiala forcieren.</textarea>
            <button class="live-btn active" onclick="speak('Gegneranalyse abgeschlossen. Harry Kane wird in Manndeckung genommen.')">AI ANALYSE</button>
            <button class="live-btn" onclick="window.print()">PRINT</button>
        </div>
    </div>`;
}

const DRILL_LIB = [
    { id: 1, name: "Rondo 5vs2", time: 15 },
    { id: 2, name: "Cognitive Scanning VR", time: 10 },
    { id: 3, name: "Torschuss Pro", time: 25 }
];
let currentSession = [];

function renderDrillPlanner(target) {
    target.innerHTML = `<div class="planner-wrapper">
        <div class="drill-library">
            ${DRILL_LIB.map(d => `<div class="drill-item" onclick="addDrill(${d.id})"><span>${d.name}</span><span>${d.time}'</span></div>`).join('')}
        </div>
        <div class="session-board">
            <h3>PLANUNG HEUTE <span id="total-time">0</span> min</h3>
            <div id="session-list-container"></div>
            <button class="live-btn" onclick="currentSession=[]; updateSView();">RESET</button>
        </div>
    </div>`;
    updateSView();
}

function addDrill(id) {
    const d = DRILL_LIB.find(x => x.id === id);
    if(d) { currentSession.push(d); updateSView(); }
}

function updateSView() {
    const c = document.getElementById('session-list-container'); if(!c) return;
    c.innerHTML = currentSession.map((d, i) => `<div class="active-drill"><b>${i+1}.</b> ${d.name}</div>`).join('');
    document.getElementById('total-time').innerText = currentSession.reduce((acc, val) => acc + val.time, 0);
}

/**
 * --------------------------------------------------------------------------
 * 8. UTILS & SYSTEM
 * --------------------------------------------------------------------------
 */
function speak(t) { if('speechSynthesis' in window) { const m = new SpeechSynthesisUtterance(t); m.lang = 'de-DE'; window.speechSynthesis.speak(m); } }
function startSystemClock() { setInterval(() => { const el = document.getElementById('clock-display'); if(el) el.innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }, 1000); }
function askToni() {
    const input = document.getElementById('toni-input'); const chat = document.getElementById('chat-stream'); if(!input.value) return;
    chat.innerHTML += `<div class="msg user"><div class="msg-header">COACH</div><div class="msg-body">${input.value}</div></div>`;
    input.value = "";
    setTimeout(() => { chat.innerHTML += `<div class="msg ai"><div class="msg-header">TONI</div><div class="msg-body">Analyse läuft... Scanning-Rate bei ${totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0}%.</div></div>`; }, 1000);
}

function renderNewspaperModule(target) {
    target.innerHTML = `<div class="newspaper-wrapper"><h1 class="paper-brand">DIE ROTE BULLEN ARENA</h1><h2 contenteditable="true">TOP-SPIEL GEGEN MÜNCHEN</h2><div style="width:100%; height:200px; background:#333; margin:20px 0;"></div><div contenteditable="true" id="paper-body" class="article-text">Die Vorbereitung läuft...</div><button class="btn-action" onclick="this.parentElement.querySelector('#paper-body').innerText += ' Toni setzt auf Sieg.'">KI TEXT</button></div>`;
}

document.addEventListener('DOMContentLoaded', () => { if(document.getElementById('sys-pass')) document.getElementById('sys-pass').focus(); });
