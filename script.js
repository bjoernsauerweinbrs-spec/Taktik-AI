/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 5.4.0 (LEADERBOARD & COMPETITION UPDATE)
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
        version: "5.4.0"
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
    // NEU: Globales Leaderboard
    leaderboard: [
        { name: "Xavi Simons", scanRate: 98, reaction: 410, date: "2026-02-20" },
        { name: "Loïs Openda", scanRate: 92, reaction: 445, date: "2026-02-21" }
    ],
    telemetry: {
        lastScanRate: 0,
        avgReactionTime: 0,
        totalBalls: 0,
        successDecisions: 0
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
 * 3. VR COGNITIVE ELITE ENGINE (v5.4.0)
 * --------------------------------------------------------------------------
 */
let trainingActive = false;
let ballInterval;
let scanCount = 0;
let totalBalls = 0;
let successDecisions = 0;
let correctTargetId = null;
let targetStartTime = 0;
let reactionTimes = [];

function renderVRHub(target) {
    target.innerHTML = `
        <div class="vr-hub-ui">
            <h1 style="font-family:'Orbitron'; color:var(--neon-main);">OCTAGON VR v5.4</h1>
            <div class="stats-grid" style="display:flex; gap:10px; margin:20px 0;">
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1; text-align:center;">
                    <h3>LIVE SCAN</h3><div id="vr-live-scan" style="font-size:24px; color:var(--neon-main);">0%</div>
                </div>
                <div class="v-card" style="background:#000; padding:15px; border:1px solid #333; flex:1; text-align:center;">
                    <h3>REAKTION</h3><div id="vr-live-speed" style="font-size:24px;">0ms</div>
                </div>
            </div>
            <button class="live-btn active" style="width:100%; padding:20px; font-size:18px;" onclick="enterVRMode()">
                SESSION STARTEN
            </button>
            <button class="live-btn" style="width:100%; margin-top:10px;" onclick="loadModule('leaderboard')">
                BESTENLISTE ANSEHEN
            </button>
        </div>`;
}

function enterVRMode() {
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) scene.enterVR();
    
    trainingActive = true;
    scanCount = 0; totalBalls = 0; successDecisions = 0; reactionTimes = [];
    speak("Training gestartet. Konzentrier dich auf den Schulterblick.");
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

    ballInterval = setInterval(() => {
        if(!trainingActive) return;
        bZ += 0.22;

        if(bZ > -10.2 && bZ < -9.8 && !correctTargetId) {
            resetTargets();
            correctTargetId = targets[Math.floor(Math.random() * targets.length)];
            document.getElementById(correctTargetId).querySelector('a-cylinder').setAttribute('color', '#00ff41');
            targetStartTime = Date.now();
        }

        if(bZ > 0) {
            totalBalls++;
            if(hasScanned && decisionMade) { successDecisions++; }
            bZ = -15; hasScanned = false; decisionMade = false;
            resetTargets(); correctTargetId = null;
        }

        if(ball) ball.setAttribute('position', `0 0.15 ${bZ}`);

        const rot = camera.getAttribute('rotation');
        if(Math.abs(rot.y) > 35) hasScanned = true;

        if(correctTargetId && !decisionMade) {
            if(isLookingAtTarget(rot.y, correctTargetId)) {
                let rTime = Date.now() - targetStartTime;
                reactionTimes.push(rTime);
                decisionMade = true;
                updateUIMetrics(rTime);
            }
        }

        if(hud) {
            let rate = totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0;
            hud.setAttribute('value', `SCORE: ${successDecisions}/${totalBalls}\nSCAN: ${hasScanned ? 'OK' : '...'}`);
        }
    }, 50);
}

function isLookingAtTarget(rotY, id) {
    if(id === 'target-L' && rotY > 60) return true;
    if(id === 'target-R' && rotY < -60) return true;
    if(id === 'target-DL' && rotY > 20 && rotY < 60) return true;
    if(id === 'target-DR' && rotY < -20 && rotY > -60) return true;
    return false;
}

function resetTargets() {
    ['target-L', 'target-R', 'target-DL', 'target-DR'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.querySelector('a-cylinder').setAttribute('color', '#333');
    });
}

function updateUIMetrics(time) {
    document.getElementById('vr-live-speed').innerText = time + "ms";
    document.getElementById('vr-live-scan').innerText = Math.round((successDecisions/totalBalls)*100) + "%";
}

/**
 * --------------------------------------------------------------------------
 * 4. LEADERBOARD SYSTEM (Bestenliste)
 * --------------------------------------------------------------------------
 */
function exitVRMode() {
    trainingActive = false;
    clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');

    // Ergebnis-Abfrage
    const avgReact = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a,b) => a+b) / reactionTimes.length) : 0;
    const finalRate = totalBalls > 0 ? Math.round((successDecisions/totalBalls)*100) : 0;

    if(totalBalls > 2) {
        const playerName = prompt(`Training beendet!\nScan-Rate: ${finalRate}%\nReaktion: ${avgReact}ms\n\nGib deinen Namen für das Leaderboard ein:`);
        if(playerName) {
            DB.leaderboard.push({
                name: playerName,
                scanRate: finalRate,
                reaction: avgReact,
                date: new Date().toISOString().split('T')[0]
            });
            // Sortieren nach ScanRate (höher besser) und dann Reaktion (niedriger besser)
            DB.leaderboard.sort((a,b) => b.scanRate - a.scanRate || a.reaction - b.reaction);
            DB.leaderboard = DB.leaderboard.slice(0, 10); // Nur Top 10
            saveSystem();
            loadModule('leaderboard');
        }
    }
}

function renderLeaderboard(target) {
    target.innerHTML = `
        <div class="leaderboard-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>RANK</th>
                        <th>SPIELER</th>
                        <th style="text-align:center;">SCAN RATE</th>
                        <th style="text-align:center;">REAKTION</th>
                        <th style="text-align:right;">DATUM</th>
                    </tr>
                </thead>
                <tbody>
                    ${DB.leaderboard.map((entry, i) => `
                        <tr class="${i === 0 ? 'rank-gold' : ''}">
                            <td style="font-family:'Orbitron'; color:var(--neon-main);">#${i + 1}</td>
                            <td><b style="color:white;">${entry.name}</b></td>
                            <td style="text-align:center;">${entry.scanRate}%</td>
                            <td style="text-align:center; color:var(--neon-warn);">${entry.reaction}ms</td>
                            <td style="text-align:right; font-size:10px; color:#666;">${entry.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="live-btn active" style="margin-top:20px; width:100%;" onclick="loadModule('vr-hub')">ZURÜCK ZUM START</button>
        </div>`;
}

/**
 * --------------------------------------------------------------------------
 * 5. WEITERE MODULE (Kader, Finanzen, Taktik, Planner)
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
            <button class="btn-action" onclick="addFinanceTransaction()">OK</button>
        </div>
        <table class="data-table">
            <tbody>${DB.finance.map(tx => `<tr><td>${tx.desc}</td><td class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">${tx.amount} €</td></tr>`).join('')}</tbody>
        </table>
    </div>`;
}

function renderTacticsBoard(target) {
    target.innerHTML = `<div class="tactics-container">
        <div class="tactics-tools"><button onclick="addObj('ball')">BALL</button><button onclick="clearBoard()">CLEAR</button></div>
        <div class="tactics-pitch" id="pitch-area">
            <canvas id="tactics-canvas"></canvas>
            ${DB.squad.map((p, i) => `<div class="t-obj obj-player" style="top:20%; left:${10+(i*10)}%;" onmousedown="startDrag(event, this)">${p.pos}</div>`).join('')}
        </div>
    </div>`;
    setTimeout(() => {
        const c = document.getElementById('tactics-canvas');
        if(c) { c.width = c.parentElement.offsetWidth; c.height = c.parentElement.offsetHeight; }
    }, 100);
}

function renderMatchPrep(target) {
    target.innerHTML = `<div class="clipboard-wrapper">
        <div class="analysis-sheet">
            <h3>MATCHPLAN VS. BAYERN</h3>
            <textarea class="notes-area">Musiala eng markieren. Konter über Openda.</textarea>
            <button class="live-btn active" onclick="speak('Gegneranalyse abgeschlossen.')">AI START</button>
        </div>
    </div>`;
}

function renderDrillPlanner(target) {
    target.innerHTML = `<div class="planner-wrapper"><div class="drill-library">ÜBUNGEN: Rondo, VR Scanning, Torschuss</div></div>`;
}

/**
 * --------------------------------------------------------------------------
 * 6. UTILS & SYSTEM
 * --------------------------------------------------------------------------
 */
function speak(t) { if('speechSynthesis' in window) { const m = new SpeechSynthesisUtterance(t); m.lang = 'de-DE'; window.speechSynthesis.speak(m); } }
function startSystemClock() { setInterval(() => { const el = document.getElementById('clock-display'); if(el) el.innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }, 1000); }
function askToni() { alert("Toni analysiert..."); }
function openPlayerEditor(id) { alert("Editor für ID " + id); }
function createNewPlayer() { alert("Neuer Spieler"); }
function addFinanceTransaction() { alert("Buchung"); }
function startDrag(e, el) { draggedEl = el; e.stopPropagation(); }
let draggedEl = null;
document.addEventListener('mousemove', (e) => {
    if(!draggedEl) return;
    const rect = document.getElementById('pitch-area').getBoundingClientRect();
    draggedEl.style.left = (e.clientX - rect.left) + 'px';
    draggedEl.style.top = (e.clientY - rect.top) + 'px';
});
document.addEventListener('mouseup', () => draggedEl = null);
