/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 5.2.2 (FULL INDUSTRIAL BUILD - NO COMPRESSION)
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
        version: "5.2.2"
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
        totalBalls: 0,
        successScans: 0
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
        console.log("System saved.");
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
        speak("System-Check erfolgreich. Willkommen zurück.");
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
    
    // UI Reset
    document.getElementById('vr-viewport').classList.add('hidden');
    viewport.classList.remove('hidden');

    switch(moduleId) {
        case 'kader':
            displayTitle.innerText = "DASHBOARD // KADER";
            renderSquadModule(viewport);
            break;
        case 'finance':
            displayTitle.innerText = "MANAGEMENT // FINANZEN";
            renderFinanceModule(viewport);
            break;
        case 'vr-hub':
            displayTitle.innerText = "INNOVATION // OCTAGON VR";
            renderVRHub(viewport);
            break;
        case 'tactics':
            displayTitle.innerText = "COACHING // TAKTIK BOARD";
            renderTacticsBoard(viewport);
            break;
        case 'scouting':
            displayTitle.innerText = "COACHING // MATCH PREP";
            renderMatchPrep(viewport);
            break;
        case 'drills':
            displayTitle.innerText = "COACHING // PLANNER";
            renderDrillPlanner(viewport);
            break;
        case 'stadionzeitung':
            displayTitle.innerText = "MEDIA // ZEITUNG CMS";
            renderNewspaperModule(viewport);
            break;
    }
}

/**
 * --------------------------------------------------------------------------
 * 4. KADER-MANAGEMENT (Full FIFA-Card-System)
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
    html += `<div class="fifa-card add-new" onclick="createNewPlayer()"><i class="fa-solid fa-plus"></i></div></div>`;
    target.innerHTML = html;
}

function createNewPlayer() {
    const newId = Date.now();
    DB.squad.push({ id: newId, name: "Neuer Spieler", pos: "ZM", rating: 75, status: "Fit", img: "" });
    saveSystem();
    renderSquadModule(document.getElementById('content-viewport'));
    openPlayerEditor(newId);
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
        saveSystem();
        closeModal('modal-player-editor');
        renderSquadModule(document.getElementById('content-viewport'));
    }
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

/**
 * --------------------------------------------------------------------------
 * 5. FINANZ-LABOR (Vollständige Buchhaltung)
 * --------------------------------------------------------------------------
 */
function renderFinanceModule(target) {
    target.innerHTML = `
        <div class="finance-dashboard">
            <div class="input-panel">
                <input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}">
                <input type="text" id="fin-desc" placeholder="Buchungstext...">
                <input type="number" id="fin-amount" placeholder="Betrag € (+/-)">
                <button class="btn-action" onclick="addFinanceTransaction()">BUCHEN</button>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Datum</th>
                            <th>Beschreibung</th>
                            <th style="text-align:right;">Betrag</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${DB.finance.map(tx => `
                        <tr>
                            <td>${tx.date}</td>
                            <td>${tx.desc}</td>
                            <td style="text-align:right;" class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">
                                ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                            </td>
                            <td style="text-align:center;"><i class="fa-solid fa-trash" onclick="deleteTransaction(${tx.id})"></i></td>
                        </tr>`).join('')}
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
        DB.finance.unshift({ id: Date.now(), date, desc, amount, type: amount >= 0 ? 'in' : 'out' });
        saveSystem();
        loadModule('finance');
    }
}

function deleteTransaction(id) {
    if(confirm("Löschen?")) {
        DB.finance = DB.finance.filter(tx => tx.id !== id);
        saveSystem();
        loadModule('finance');
    }
}

/**
 * --------------------------------------------------------------------------
 * 6. VR OCTAGON COGNITIVE PRO (Die Profi-Physik)
 * --------------------------------------------------------------------------
 */
let trainingActive = false;
let ballInterval;
let scanCount = 0;
let totalBalls = 0;
let lastScanTime = 0;

function renderVRHub(target) {
    target.innerHTML = `
        <div class="vr-hub-ui">
            <h1 style="font-family:'Orbitron'; color:var(--neon-main);">OCTAGON COGNITIVE v5.2</h1>
            <p>PROFESSIONAL SCANNING TRAINING SYSTEM</p>
            <div class="stats-grid" style="display:flex; gap:20px; margin:30px 0;">
                <div class="v-card" style="background:#000; padding:20px; border:1px solid #333; flex:1;">
                    <h3>SCAN RATE</h3>
                    <div id="vr-live-scan" style="font-size:32px; color:var(--neon-main);">0%</div>
                </div>
                <div class="v-card" style="background:#000; padding:20px; border:1px solid #333; flex:1;">
                    <h3>DURCHGÄNGE</h3>
                    <div id="vr-live-balls" style="font-size:32px;">0</div>
                </div>
            </div>
            <button class="live-btn active" style="padding:20px 50px; font-size:18px;" onclick="enterVRMode()">
                START VR SIMULATION (QUEST 3)
            </button>
        </div>`;
}

function enterVRMode() {
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) scene.enterVR();
    trainingActive = true;
    scanCount = 0;
    totalBalls = 0;
    speak("Cognitive Engine geladen. Achte auf den Schulterblick.");
    startCognitiveLoop();
}

function startCognitiveLoop() {
    const ball = document.getElementById('vr-ball');
    const hud = document.getElementById('vr-hud-text');
    const camera = document.querySelector('a-camera');
    let bZ = -15; 
    let hasScanned = false;

    if(ballInterval) clearInterval(ballInterval);

    ballInterval = setInterval(() => {
        if(!trainingActive) return;

        // Ball Bewegung
        bZ += 0.2;
        if(bZ > 0) {
            totalBalls++;
            if(hasScanned) scanCount++;
            else speak("Kein Scan erfolgt!");
            
            bZ = -15; 
            hasScanned = false;
        }

        if(ball) ball.setAttribute('position', `0 0.15 ${bZ}`);

        // Kognitive Erkennung: Kopfdrehung
        const rot = camera.getAttribute('rotation');
        if(Math.abs(rot.y) > 45) {
            hasScanned = true;
            lastScanTime = Date.now();
        }

        // HUD Feedback
        let rate = totalBalls > 0 ? Math.round((scanCount/totalBalls)*100) : 0;
        if(hud) {
            hud.setAttribute('value', `SCAN: ${hasScanned ? 'OK' : 'FEHLT'}\nRATE: ${rate}%`);
            hud.setAttribute('color', hasScanned ? "#00ff41" : "#ffae00");
        }

        // Live Dashboard Update
        document.getElementById('vr-live-scan').innerText = rate + "%";
        document.getElementById('vr-live-balls').innerText = totalBalls;
        
        // Telemetrie Widget synchronisieren
        const sideScan = document.getElementById('val-scan');
        if(sideScan) sideScan.innerText = rate + "%";
        const sideBar = document.getElementById('bar-scan');
        if(sideBar) sideBar.style.width = rate + "%";

    }, 50);
}

function exitVRMode() {
    trainingActive = false;
    clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');
}

/**
 * --------------------------------------------------------------------------
 * 7. TAKTIK-BOARD PRO (Vollständige Canvas-Engine)
 * --------------------------------------------------------------------------
 */
let canvasContext = null;
let activeTool = 'move';
let draggedEl = null;

function renderTacticsBoard(target) {
    target.innerHTML = `
        <div class="tactics-container">
            <div class="tactics-tools">
                <button class="tool-btn active" onclick="setTool('move', this)"><i class="fa-solid fa-arrows-up-down-left-right"></i></button>
                <button class="tool-btn" onclick="setTool('draw', this)"><i class="fa-solid fa-pen-nib"></i></button>
                <button class="tool-btn" onclick="addObj('cone')"><i class="fa-solid fa-cone"></i></button>
                <button class="tool-btn" onclick="addObj('ball')"><i class="fa-solid fa-futbol"></i></button>
                <button class="tool-btn" onclick="clearBoard()" style="color:var(--neon-alert);"><i class="fa-solid fa-trash"></i></button>
                <button class="tool-btn" onclick="toniAutoFormation()" style="color:var(--neon-main);"><i class="fa-solid fa-robot"></i></button>
            </div>
            <div class="tactics-pitch" id="pitch-area" onmousedown="handleBoardClick(event)">
                <canvas id="tactics-canvas"></canvas>
                ${DB.squad.map((p, i) => `
                    <div class="t-obj obj-player" style="top:${20+(i*5)}%; left:${10+(i*8)}%;" onmousedown="startDrag(event, this)">
                        ${p.pos}
                    </div>`).join('')}
            </div>
        </div>`;
    setTimeout(initCanvas, 100);
}

function initCanvas() {
    const c = document.getElementById('tactics-canvas');
    if(c) {
        c.width = c.parentElement.offsetWidth;
        c.height = c.parentElement.offsetHeight;
        canvasContext = c.getContext('2d');
    }
}

function setTool(tool, btn) {
    activeTool = tool;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function startDrag(e, el) { 
    if(activeTool !== 'move') return;
    draggedEl = el; 
    e.stopPropagation(); 
}

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    canvasContext.strokeStyle = "#00ff41";
    canvasContext.lineWidth = 3;
    canvasContext.beginPath();
    canvasContext.arc(x, y, 5, 0, Math.PI*2);
    canvasContext.stroke();
}

function addObj(type) {
    const el = document.createElement('div');
    el.className = `t-obj obj-${type}`;
    el.style.top = '50%'; el.style.left = '50%';
    el.onmousedown = function(e) { startDrag(e, this); };
    document.getElementById('pitch-area').appendChild(el);
}

function clearBoard() {
    document.querySelectorAll('.obj-cone, .obj-ball').forEach(o => o.remove());
    if(canvasContext) canvasContext.clearRect(0,0,5000,5000);
}

/**
 * --------------------------------------------------------------------------
 * 8. MATCH PREP (Nagelsmann Clipboard)
 * --------------------------------------------------------------------------
 */
function renderMatchPrep(target) {
    let opts = `<option value="">-- Spieler wählen --</option>` + DB.squad.map(p => `<option>${p.pos} - ${p.name}</option>`).join('');
    target.innerHTML = `
        <div class="clipboard-wrapper">
            <div class="formation-board">
                ${[...Array(11)].map((_, i) => `
                <div class="pos-slot slot-${i}">
                    <div class="pos-dot"></div>
                    <select class="pos-select">${opts}</select>
                </div>`).join('')}
            </div>
            <div class="analysis-sheet">
                <div class="sheet-header">MATCHPLAN SAISON 25/26</div>
                <label class="notes-label">GEGNER: BAYERN MÜNCHEN</label>
                <textarea id="match-notes" class="notes-area">Harry Kane isolieren. Überladen der Außenbahnen bei Ballbesitz.</textarea>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="live-btn active" onclick="speak('Gegneranalyse Bayern abgeschlossen. Fokus auf Umschaltspiel.')">AI ANALYSE</button>
                    <button class="live-btn" onclick="window.print()">PRINT</button>
                </div>
            </div>
        </div>`;
}

/**
 * --------------------------------------------------------------------------
 * 9. SESSION PLANNER (Training)
 * --------------------------------------------------------------------------
 */
const DRILL_LIB = [
    { id: 1, name: "Rondo 5vs2", time: 15, cat: "Warmup" },
    { id: 2, name: "Kognitives VR Scanning", time: 10, cat: "Elite" },
    { id: 3, name: "Torschuss unter Druck", time: 25, cat: "Technik" },
    { id: 4, name: "Spielform 11vs11", time: 30, cat: "Taktik" }
];
let currentSession = [];

function renderDrillPlanner(target) {
    target.innerHTML = `
        <div class="planner-wrapper">
            <div class="drill-library">
                <div class="lib-header">ÜBUNGSKATALOG</div>
                ${DRILL_LIB.map(d => `<div class="drill-item" onclick="addDrillToSession(${d.id})"><span>${d.name}</span><span>${d.time}'</span></div>`).join('')}
            </div>
            <div class="session-board">
                <div class="session-header">HEUTIGER PLAN: <span id="total-time">0</span> min</div>
                <div id="session-list-container"></div>
                <button class="live-btn" style="margin-top:20px;" onclick="currentSession=[]; updateSView();">RESET</button>
            </div>
        </div>`;
    updateSView();
}

function addDrillToSession(id) {
    const drill = DRILL_LIB.find(x => x.id === id);
    if(drill) {
        currentSession.push(drill);
        updateSView();
    }
}

function updateSView() {
    const c = document.getElementById('session-list-container');
    if(!c) return;
    c.innerHTML = currentSession.map((d, i) => `<div class="active-drill"><b>${i+1}.</b> ${d.name} (${d.time} min)</div>`).join('');
    let total = currentSession.reduce((acc, val) => acc + val.time, 0);
    document.getElementById('total-time').innerText = total;
}

/**
 * --------------------------------------------------------------------------
 * 10. NEWS ZEITUNG CMS
 * --------------------------------------------------------------------------
 */
function renderNewspaperModule(target) {
    target.innerHTML = `
        <div style="display:flex; justify-content:center;">
            <div class="newspaper-wrapper">
                <h1 class="paper-brand">DIE ROTE BULLEN ARENA</h1>
                <h2 contenteditable="true" class="headline-l">TOP-SPIEL: LEIPZIG FORDERT DEN REKORDMEISTER</h2>
                <div style="width:100%; height:250px; background:#333; margin:20px 0;"></div>
                <div contenteditable="true" id="paper-body" class="article-text">
                    Die Mannschaft ist bereit. In der Kabine herrscht vollste Konzentration.
                </div>
                <button class="btn-action" onclick="generateAIArticle()">KI TEXT</button>
            </div>
        </div>`;
}

function generateAIArticle() {
    document.getElementById('paper-body').innerText += " Toni prognostiziert einen Sieg durch überlegene kognitive Geschwindigkeit.";
}

/**
 * --------------------------------------------------------------------------
 * 11. CORE UTILS (AI & CLOCK)
 * --------------------------------------------------------------------------
 */
function speak(t) {
    if('speechSynthesis' in window) {
        const m = new SpeechSynthesisUtterance(t);
        m.lang = 'de-DE';
        window.speechSynthesis.speak(m);
    }
}

function startSystemClock() {
    setInterval(() => {
        const el = document.getElementById('clock-display');
        if(el) el.innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

function askToni() {
    const input = document.getElementById('toni-input');
    const chat = document.getElementById('chat-stream');
    if(!input.value) return;
    chat.innerHTML += `<div class="msg user"><div class="msg-header">COACH</div><div class="msg-body">${input.value}</div></div>`;
    let q = input.value.toLowerCase();
    input.value = "";
    setTimeout(() => {
        let res = "Analyse läuft... Alle Systeme im Elite-Bereich.";
        if(q.includes("scan")) res = "Die Scanning-Rate liegt aktuell bei " + (totalBalls > 0 ? Math.round((scanCount/totalBalls)*100) : 0) + "%.";
        chat.innerHTML += `<div class="msg ai"><div class="msg-header">TONI</div><div class="msg-body">${res}</div></div>`;
        speak(res);
        chat.scrollTop = chat.scrollHeight;
    }, 1000);
}

// Global Listener
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('sys-pass')) document.getElementById('sys-pass').focus();
});
