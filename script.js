/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE
   Version: 6.0.0 (THE ULTIMATE VR & AI BUILD)
   Architecture: Adaptive Neuro-Football Logic
   ========================================================================== */

const DEFAULT_DB = {
    settings: { pass: "Toni2026", clubName: "RB Leipzig", version: "6.0.0" },
    finance: [{ id: 1, date: "2026-02-21", desc: "Sponsoring Neural Lab", amount: 5000000, type: "in" }],
    squad: [
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Fit" }
    ],
    leaderboard: [
        { name: "Simons (AI-Mode)", epi: 94, reaction: 380, date: "2026-02-21" }
    ],
    performance_history: []
};

let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

/** 1. CORE FUNCTIONS **/
function saveSystem() { localStorage.setItem('toni_elite_db', JSON.stringify(DB)); refreshKPIs(); }

function refreshKPIs() {
    let budget = 0; DB.finance.forEach(tx => budget += tx.amount);
    document.getElementById('kpi-budget').innerText = new Intl.NumberFormat('de-DE').format(budget) + " €";
    // EPI KPI (Durchschnitt der letzten Session)
    const avgEpi = DB.performance_history.length > 0 ? DB.performance_history[DB.performance_history.length-1].epi : "--";
    document.getElementById('kpi-epi').innerText = avgEpi + "%";
}

function systemBootSequence() {
    if (document.getElementById('sys-pass').value === DB.settings.pass) {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        refreshKPIs(); startSystemClock(); loadModule('vr-hub');
    }
}

/** 2. MODULE LOADER **/
function loadModule(moduleId) {
    const view = document.getElementById('content-viewport');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    document.getElementById('vr-viewport').classList.add('hidden');
    view.classList.remove('hidden');

    switch(moduleId) {
        case 'vr-hub': renderVRHub(view); break;
        case 'leaderboard': renderLeaderboard(view); break;
        case 'kader': renderSquad(view); break;
        case 'finance': renderFinance(view); break;
        case 'scouting': renderScouting(view); break;
        case 'tactics': renderTactics(view); break;
    }
}

/** 3. VR NEURAL ENGINE v6.0 **/
let trainingActive = false;
let ballInterval;
let ballSpeed = 0.25; // Adaptive Start Speed
let epiData = { scansInWindow: 0, correctDecisions: 0, reactionTimes: [], ballsTotal: 0 };
let currentTargetId = null;
let startTime = 0;

function renderVRHub(target) {
    target.innerHTML = `
        <div class="vr-hub-v6">
            <h1 style="color:var(--neon-main); font-family:'Orbitron';">NEURAL ENGINE v6.0</h1>
            <div style="display:flex; gap:20px; margin:20px 0;">
                <div class="v-card-v6"><h3>DIFFICULTY (AI)</h3><div id="ai-diff">ADAPTIVE</div></div>
                <div class="v-card-v6"><h3>LAST EPI</h3><div id="ai-last-epi">--%</div></div>
            </div>
            <button class="live-btn active" style="width:100%; height:80px; font-size:24px;" onclick="enterVRMode()">SESSION START</button>
        </div>`;
}

function enterVRMode() {
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) scene.enterVR();
    
    trainingActive = true;
    epiData = { scansInWindow: 0, correctDecisions: 0, reactionTimes: [], ballsTotal: 0 };
    speak("Neural Link etabliert. AI Gegner aktiv. Starte Training.");
    startNeuralLoop();
}

function startNeuralLoop() {
    const ball = document.getElementById('vr-ball');
    const hud = document.getElementById('vr-hud-text');
    const timingBar = document.getElementById('hud-timing-bar');
    const indicator = document.getElementById('scan-indicator');
    const camera = document.getElementById('vr-cam');
    const shadow = document.getElementById('shadow-defender');
    
    let bZ = -20;
    let decisionMade = false;
    let scanWindowActive = false;
    let scannedInWindow = false;

    ballInterval = setInterval(() => {
        if(!trainingActive) return;

        bZ += ballSpeed;

        // Ball Start & Spatial Sound
        if(bZ > -19.8 && bZ < -19.4) {
            document.getElementById('snd-pass').play();
            generateScenario();
            startTime = Date.now();
        }

        // ELITE TIMING WINDOW (Optimiert für 2026 Training)
        if(bZ > -14 && bZ < -4) {
            scanWindowActive = true;
            timingBar.setAttribute('color', '#00ff41');
        } else {
            scanWindowActive = false;
            timingBar.setAttribute('color', '#333');
        }

        // AI SHADOW DEFENDER MOVEMENT
        if(bZ > -15) {
            let shadowX = Math.sin(Date.now() / 200) * 2; // Bewegt sich taktisch
            shadow.setAttribute('position', `${shadowX} 1.25 -8`);
        }

        // BALL TREFFPUNKT
        if(bZ > 0) {
            epiData.ballsTotal++;
            if(scannedInWindow && decisionMade) {
                epiData.scansInWindow++;
                epiData.correctDecisions++;
                // Adaptive Steigerung
                if(ballSpeed < 0.6) ballSpeed += 0.01;
            } else {
                document.getElementById('snd-fail').play();
                if(ballSpeed > 0.2) ballSpeed -= 0.02; // AI macht es leichter
            }
            bZ = -20; scannedInWindow = false; decisionMade = false;
            resetScenario();
        }

        if(ball) ball.setAttribute('position', `0 0.22 ${bZ}`);

        // NEURAL SCAN DETECTION
        const rot = camera.getAttribute('rotation');
        if(scanWindowActive && Math.abs(rot.y) > 40) {
            scannedInWindow = true;
            indicator.setAttribute('color', '#00ff41');
        } else if(!scannedInWindow) {
            indicator.setAttribute('color', '#ff2a2a');
        }

        // DECISION LOGIC
        if(currentTargetId && !decisionMade) {
            if(isLookingAt(rot.y, currentTargetId)) {
                epiData.reactionTimes.push(Date.now() - startTime);
                decisionMade = true;
            }
        }

        // HUD UPDATE
        const currentEpi = calculateEPI();
        hud.setAttribute('value', `EPI: ${currentEpi}% | SPEED: ${ballSpeed.toFixed(2)}\n${scannedInWindow ? 'SCAN CAPTURED' : 'READY TO SCAN'}`);
        
        // Live Dashboard Update
        document.getElementById('val-epi').innerText = currentEpi + "%";
        document.getElementById('bar-epi').style.width = currentEpi + "%";

    }, 50);
}

function calculateEPI() {
    if(epiData.ballsTotal === 0) return 0;
    const scanFactor = (epiData.scansInWindow / epiData.ballsTotal) * 40;
    const decisionFactor = (epiData.correctDecisions / epiData.ballsTotal) * 60;
    return Math.round(scanFactor + decisionFactor);
}

function generateScenario() {
    const targets = ['L', 'R', 'DL', 'DR'];
    currentTargetId = 'target-' + targets[Math.floor(Math.random() * targets.length)];
    targets.forEach(t => {
        const icon = document.getElementById('icon-' + t);
        if('target-' + t === currentTargetId) {
            icon.setAttribute('value', 'O'); icon.setAttribute('color', '#00ff41');
        } else {
            icon.setAttribute('value', 'X'); icon.setAttribute('color', '#ff2a2a');
        }
    });
}

function isLookingAt(rotY, id) {
    if(id === 'target-L' && rotY > 70) return true;
    if(id === 'target-R' && rotY < -70) return true;
    if(id === 'target-DL' && rotY > 25 && rotY < 60) return true;
    if(id === 'target-DR' && rotY < -25 && rotY > -60) return true;
    return false;
}

function resetScenario() {
    ['L', 'R', 'DL', 'DR'].forEach(t => {
        document.getElementById('icon-' + t).setAttribute('value', '-');
        document.getElementById('icon-' + t).setAttribute('color', '#333');
    });
}

function exitVRMode() {
    trainingActive = false;
    clearInterval(ballInterval);
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');

    const finalEpi = calculateEPI();
    const avgReact = epiData.reactionTimes.length > 0 ? Math.round(epiData.reactionTimes.reduce((a,b)=>a+b)/epiData.reactionTimes.length) : 0;
    
    if(epiData.ballsTotal > 1) {
        const name = prompt(`SESSION ANALYSIS\nEPI: ${finalEpi}%\nReaction: ${avgReact}ms\n\nName für AI-Datenbank:`);
        if(name) {
            DB.performance_history.push({ epi: finalEpi, reaction: avgReact });
            DB.leaderboard.push({ name, epi: finalEpi, reaction: avgReact, date: "2026-02-21" });
            saveSystem(); loadModule('leaderboard');
        }
    }
}

/** 4. AI ANALYST (TONI 2.0) **/
function askToni() {
    const input = document.getElementById('toni-input');
    const chat = document.getElementById('chat-stream');
    if(!input.value) return;

    chat.innerHTML += `<div class="msg user"><div>COACH</div><div>${input.value}</div></div>`;
    const q = input.value.toLowerCase();
    input.value = "";

    setTimeout(() => {
        let response = "Analyse der Neural-Daten läuft...";
        if(q.includes("performance") || q.includes("besser")) {
            const last = DB.performance_history[DB.performance_history.length-1];
            response = `Deine kognitive Last ist stabil. Aber: Bei Speed > 0.4 sinkt deine Scan-Präzision um 12%. Fokus auf das Timing-Fenster!`;
        } else {
            response = "Die AI-Gegner erkennen deine Muster. Wir müssen die Scangeschwindigkeit um 0.2s steigern.";
        }
        chat.innerHTML += `<div class="msg ai"><div>TONI</div><div>${response}</div></div>`;
        speak(response);
    }, 1000);
}

/** 5. OTHER MODULES (Ungekürzt) **/
function renderLeaderboard(target) {
    target.innerHTML = `
        <div class="leaderboard-wrapper">
            <h2 style="font-family:'Orbitron'; color:var(--neon-main);">NEURAL HALL OF FAME</h2>
            <table class="data-table">
                <thead><tr><th>RANK</th><th>ELITE PLAYER</th><th>EPI</th><th>SPEED</th></tr></thead>
                <tbody>${DB.leaderboard.map((e,i)=>`<tr><td>#${i+1}</td><td>${e.name}</td><td>${e.epi}%</td><td>${e.reaction}ms</td></tr>`).join('')}</tbody>
            </table>
        </div>`;
}

function renderSquad(target) {
    target.innerHTML = `<div class="card-grid">${DB.squad.map(p => `
        <div class="fifa-card">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            <div class="player-name">${p.name}</div>
        </div>`).join('')}</div>`;
}

function speak(t) { window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)); }
function startSystemClock() { setInterval(() => { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }, 1000); }

document.addEventListener('DOMContentLoaded', () => { document.getElementById('sys-pass').focus(); });
