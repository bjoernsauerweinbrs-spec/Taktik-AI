/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 5.5.0 (ELITE PATTERN & TIMING UPDATE)
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
        version: "5.5.0"
    },
    finance: [
        { id: 1708221, date: "2026-02-20", desc: "Sponsoring: Red Bull Global", amount: 4500000, type: "in" },
        { id: 1708222, date: "2026-02-21", desc: "Gehaltslauf: Profikader Feb", amount: -2100000, type: "out" }
    ],
    squad: [
        { id: 101, name: "Péter Gulácsi", pos: "TW", rating: 84, status: "Fit" },
        { id: 102, name: "Willi Orbán", pos: "IV", rating: 83, status: "Fit" },
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Reha" }
    ],
    leaderboard: [
        { name: "Xavi Simons", scanRate: 98, reaction: 410, date: "2026-02-20" },
        { name: "Loïs Openda", scanRate: 92, reaction: 445, date: "2026-02-21" }
    ],
    telemetry: {
        lastScanRate: 0,
        avgReactionTime: 0,
        totalBalls: 0,
        eliteScans: 0 // Scans im perfekten Zeitfenster
    }
};

let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

function saveSystem() {
    try {
        localStorage.setItem('toni_elite_db', JSON.stringify(DB));
        refreshKPIs();
    } catch (e) { console.error("Save Error", e); }
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
}

/**
 * --------------------------------------------------------------------------
 * 2. AUTH & NAVIGATION
 * --------------------------------------------------------------------------
 */
function systemBootSequence() {
    const input = document.getElementById('sys-pass').value;
    if (input === DB.settings.pass) {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        refreshKPIs(); startSystemClock(); loadModule('kader');
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

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
        case 'leaderboard': displayTitle.innerText = "COMPETITION // BESTENLISTE"; renderLeaderboard(viewport); break;
        case 'tactics': displayTitle.innerText = "COACHING // TAKTIK BOARD"; renderTacticsBoard(viewport); break;
        case 'scouting': displayTitle.innerText = "COACHING // MATCH PREP"; renderMatchPrep(viewport); break;
        case 'drills': displayTitle.innerText = "COACHING // PLANNER"; renderDrillPlanner(viewport); break;
    }
}

/**
 * --------------------------------------------------------------------------
 * 3. VR COGNITIVE ELITE ENGINE (v5.5.0 - Pattern Edition)
 * --------------------------------------------------------------------------
 */
let trainingActive = false;
let ballInterval;
let eliteScans = 0;
let totalBalls = 0;
let successDecisions = 0;
let correctTargetId = null;
let targetStartTime = 0;
let reactionTimes = [];

function renderVRHub(target) {
    target.innerHTML = `
        <div class="vr-hub-ui">
            <h1 style="font-family:'Orbitron'; color:var(--neon-main);">RETINA ELITE v5.5</h1>
            <div class="stats-grid" style="display:flex; gap:10px; margin:20px 0;">
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1; text-align:center;">
                    <h3>PATTERN SCORE</h3><div id="vr-live-scan" style="font-size:24px; color:var(--neon-main);">0%</div>
                </div>
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1; text-align:center;">
                    <h3>TIMING</h3><div id="vr-live-speed" style="font-size:24px;">0ms</div>
                </div>
            </div>
            <button class="live-btn active" style="width:100%; padding:20px; font-size:18px;" onclick="enterVRMode()">
                ELITE SESSION STARTEN
            </button>
            <p style="font-size:10px; color:#666; margin-top:15px; text-align:center;">HINWEIS: Scanne das Feld, während der Ball rollt (Timing Fenster).</p>
        </div>`;
}

function enterVRMode() {
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) scene.enterVR();
    
    trainingActive = true;
    eliteScans = 0; totalBalls = 0; successDecisions = 0; reactionTimes = [];
    speak("Elite Engine aktiv. Erkenne das offene Muster.");
    startCognitiveLoop();
}

function startCognitiveLoop() {
    const ball = document.getElementById('vr-ball');
    const hud = document.getElementById('vr-hud-text');
    const timingBar = document.getElementById('hud-timing-bar');
    const camera = document.getElementById('vr-cam');
    const targets = ['target-L', 'target-R', 'target-DL', 'target-DR'];
    let bZ = -15; 
    let decisionMade = false;
    let scanWindowActive = false;
    let scanSuccessInWindow = false;

    ballInterval = setInterval(() => {
        if(!trainingActive) return;
        bZ += 0.22; // Elite Ball Speed

        // 1. BALL START & AUDIO CUE
        if(bZ > -14.9 && bZ < -14.5) {
            document.getElementById('snd-pass').play();
            generateTacticalPattern(targets);
            targetStartTime = Date.now();
        }

        // 2. TIMING WINDOW (Zwischen 12m und 3m Entfernung)
        if(bZ > -12 && bZ < -3) {
            scanWindowActive = true;
            if(timingBar) timingBar.setAttribute('color', '#00ff41'); // Aktiv
        } else {
            scanWindowActive = false;
            if(timingBar) timingBar.setAttribute('color', '#333'); // Inaktiv
        }

        // 3. BALL ERREICHT SPIELER
        if(bZ > 0) {
            totalBalls++;
            if(scanSuccessInWindow && decisionMade) {
                successDecisions++;
                eliteScans++;
                document.getElementById('snd-coach').play(); // Erfolgssound
            } else if (!scanSuccessInWindow) {
                speak("Poor Timing!");
            }
            
            bZ = -15; scanSuccessInWindow = false; decisionMade = false;
            resetTacticalNodes();
            correctTargetId = null;
        }

        if(ball) ball.setAttribute('position', `0 0.15 ${bZ}`);

        // 4. ELITE SCANNING LOGIK
        const rot = camera.getAttribute('rotation');
        if(scanWindowActive && Math.abs(rot.y) > 38) {
            scanSuccessInWindow = true;
        }

        // 5. PATTERN RECOGNITION (Entscheidung)
        if(correctTargetId && !decisionMade) {
            if(isLookingAtTarget(rot.y, correctTargetId)) {
                let rTime = Date.now() - targetStartTime;
                reactionTimes.push(rTime);
                decisionMade = true;
                updateUIMetrics(rTime);
            }
        }

        // HUD Update
        if(hud) {
            let rate = totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0;
            let statusText = scanSuccessInWindow ? "TIMING: ELITE" : "TIMING: WAIT...";
            hud.setAttribute('value', `${statusText}\nPATTERN: ${decisionMade ? 'READ' : 'SEARCHING'}\nSCORE: ${rate}%`);
        }
    }, 50);
}

function generateTacticalPattern(targets) {
    resetTacticalNodes();
    // Eines der Ziele wird "Offen" (O), die anderen "Gedeckt" (X)
    correctTargetId = targets[Math.floor(Math.random() * targets.length)];
    
    targets.forEach(id => {
        const icon = document.getElementById('icon-' + id.split('-')[1]);
        if(id === correctTargetId) {
            icon.setAttribute('value', 'O');
            icon.setAttribute('color', '#00ff41'); // Grün
        } else {
            icon.setAttribute('value', 'X');
            icon.setAttribute('color', '#ff2a2a'); // Rot
        }
    });
}

function resetTacticalNodes() {
    ['L', 'R', 'DL', 'DR'].forEach(suffix => {
        const icon = document.getElementById('icon-' + suffix);
        if(icon) {
            icon.setAttribute('value', '-');
            icon.setAttribute('color', '#333');
        }
    });
}

function isLookingAtTarget(rotY, id) {
    if(id === 'target-L' && rotY > 60) return true;
    if(id === 'target-R' && rotY < -60) return true;
    if(id === 'target-DL' && rotY > 20 && rotY < 60) return true;
    if(id === 'target-DR' && rotY < -20 && rotY > -60) return true;
    return false;
}

function updateUIMetrics(time) {
    const speedEl = document.getElementById('vr-live-speed');
    const scanEl = document.getElementById('vr-live-scan');
    if(speedEl) speedEl.innerText = time + "ms";
    if(scanEl) scanEl.innerText = Math.round((successDecisions/totalBalls)*100) + "%";
}

/**
 * --------------------------------------------------------------------------
 * 4. LEADERBOARD & EXIT
 * --------------------------------------------------------------------------
 */
function exitVRMode() {
    trainingActive = false;
    clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');

    const avgReact = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a,b) => a+b) / reactionTimes.length) : 0;
    const finalRate = totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0;

    if(totalBalls > 2) {
        const pName = prompt(`ELITE SESSION BEENDET\nPattern Score: ${finalRate}%\nAvg Timing: ${avgReact}ms\nName:`);
        if(pName) {
            DB.leaderboard.push({ name: pName, scanRate: finalRate, reaction: avgReact, date: new Date().toISOString().split('T')[0] });
            DB.leaderboard.sort((a,b) => b.scanRate - a.scanRate || a.reaction - b.reaction);
            DB.leaderboard = DB.leaderboard.slice(0, 10);
            saveSystem();
            loadModule('leaderboard');
        }
    }
}

function renderLeaderboard(target) {
    target.innerHTML = `
        <div class="leaderboard-wrapper">
            <h2 style="font-family:'Orbitron'; color:var(--neon-main); text-align:center; margin-bottom:20px;">HALL OF FAME (PATTERN ENGINE)</h2>
            <table class="data-table">
                <thead><tr><th>RANK</th><th>PRO PLAYER</th><th style="text-align:center;">ACCURACY</th><th style="text-align:center;">TIMING</th></tr></thead>
                <tbody>
                    ${DB.leaderboard.map((e, i) => `
                        <tr class="${i === 0 ? 'rank-gold' : ''}">
                            <td style="color:var(--neon-main);">#${i + 1}</td>
                            <td><b>${e.name}</b></td>
                            <td style="text-align:center;">${e.scanRate}%</td>
                            <td style="text-align:center;">${e.reaction}ms</td>
                        </tr>`).join('')}
                </tbody>
            </table>
            <button class="live-btn active" style="margin-top:20px; width:100%;" onclick="loadModule('vr-hub')">NEUE SESSION</button>
        </div>`;
}

/**
 * --------------------------------------------------------------------------
 * 5. MANAGEMENT MODULES (Kader, Finance, Tactics)
 * --------------------------------------------------------------------------
 */
function renderSquadModule(target) {
    let html = `<div class="card-grid">`;
    DB.squad.forEach(p => {
        html += `<div class="fifa-card" onclick="openPlayerEditor(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            <img src="https://ui-avatars.com/api/?name=${p.name}&background=random&size=128&bold=true" class="player-img">
            <div class="player-name">${p.name}</div>
        </div>`;
    });
    html += `<div class="fifa-card add-new" onclick="createNewPlayer()"><i class="fa-solid fa-plus"></i></div></div>`;
    target.innerHTML = html;
}

function renderFinanceModule(target) {
    target.innerHTML = `<div class="finance-dashboard">
        <div class="input-panel">
            <input type="text" id="fin-desc" placeholder="Zweck">
            <input type="number" id="fin-amount" placeholder="€">
            <button class="btn-action" onclick="addFinanceTransaction()">BUCHEN</button>
        </div>
        <table class="data-table">
            <tbody>${DB.finance.map(tx => `<tr><td>${tx.date}</td><td>${tx.desc}</td><td class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">${tx.amount} €</td></tr>`).join('')}</tbody>
        </table>
    </div>`;
}

function renderTacticsBoard(target) {
    target.innerHTML = `<div class="tactics-container">
        <div class="tactics-tools">
            <button class="tool-btn" onclick="addObj('ball')">BALL</button>
            <button class="tool-btn" onclick="clearBoard()" style="color:red;">CLEAR</button>
        </div>
        <div class="tactics-pitch" id="pitch-area">
            <canvas id="tactics-canvas"></canvas>
            ${DB.squad.map((p, i) => `<div class="t-obj obj-player" style="top:20%; left:${10+(i*10)}%;" onmousedown="startDrag(event, this)">${p.pos}</div>`).join('')}
        </div>
    </div>`;
    setTimeout(() => {
        const c = document.getElementById('tactics-canvas');
        if(c) { c.width = c.parentElement.offsetWidth; c.height = c.parentElement.offsetHeight; canvasContext = c.getContext('2d'); }
    }, 100);
}

function renderMatchPrep(target) {
    target.innerHTML = `<div class="clipboard-wrapper">
        <div class="analysis-sheet">
            <h3>ELITE PREP: VS. FC BAYERN</h3>
            <textarea class="notes-area">Muster: Kimmich rückt ein -> Lücke am Flügel nutzen. Openda startet bei Ballgewinn sofort tief.</textarea>
            <button class="live-btn active" onclick="speak('Gegner-Muster geladen. Fokus auf schnelles Umschaltspiel.')">AI ANALYSE</button>
        </div>
    </div>`;
}

function renderDrillPlanner(target) {
    target.innerHTML = `<div class="planner-wrapper"><div class="drill-library">ÜBUNGEN: Rondo, Elite VR Scanning (v5.5), Torschuss</div></div>`;
}

/**
 * --------------------------------------------------------------------------
 * 6. UTILS & SYSTEM
 * --------------------------------------------------------------------------
 */
function speak(t) { if('speechSynthesis' in window) { const m = new SpeechSynthesisUtterance(t); m.lang = 'de-DE'; window.speechSynthesis.speak(m); } }
function startSystemClock() { setInterval(() => { const el = document.getElementById('clock-display'); if(el) el.innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }, 1000); }
function askToni() { alert("Toni analysiert das Elite-Pattern..."); }
function openPlayerEditor(id) { alert("Spieler ID: " + id); }
function createNewPlayer() { alert("Neuer Spieler"); }
function addFinanceTransaction() { 
    const d = document.getElementById('fin-desc').value;
    const a = document.getElementById('fin-amount').value;
    if(d && a) {
        DB.finance.unshift({id: Date.now(), date: '2026-02-21', desc: d, amount: parseFloat(a), type: a >= 0 ? 'in' : 'out'});
        saveSystem(); loadModule('finance');
    }
}
function clearBoard() { document.querySelectorAll('.obj-ball').forEach(o => o.remove()); }
function addObj(t) {
    const el = document.createElement('div'); el.className = `t-obj obj-${t}`;
    el.style.top = '50%'; el.style.left = '50%'; el.onmousedown = function(e) { startDrag(e, this); };
    document.getElementById('pitch-area').appendChild(el);
}
let draggedEl = null;
function startDrag(e, el) { draggedEl = el; e.stopPropagation(); }
document.addEventListener('mousemove', (e) => {
    if(!draggedEl) return;
    const rect = document.getElementById('pitch-area').getBoundingClientRect();
    draggedEl.style.left = (e.clientX - rect.left) + 'px';
    draggedEl.style.top = (e.clientY - rect.top) + 'px';
});
document.addEventListener('mouseup', () => draggedEl = null);

document.addEventListener('DOMContentLoaded', () => { if(document.getElementById('sys-pass')) document.getElementById('sys-pass').focus(); });
