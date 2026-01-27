/**
 * Toni 2.0 - Elite Logic Center (KI-Video & Kader-Brücke)
 */

let squad = [];
let detector;
let isAiLoading = false;

// 1. KI-INITIALISIERUNG
async function initToniAI() {
    if (isAiLoading) return;
    isAiLoading = true;
    console.log("Toni: Starte KI-Sichtsystem...");
    try {
        detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        document.getElementById('ai-status').innerText = "● KI-ENGINE AKTIV";
    } catch (e) {
        console.error("KI-Fehler:", e);
    }
}

// 2. TAB-STEUERUNG
window.loadTabContent = function(tab) {
    const area = document.getElementById('tab-content-area');
    area.innerHTML = ""; 

    switch(tab) {
        case 'kader': renderKader(area); break;
        case 'analyse': renderAnalyse(area); break;
        case 'match': renderMatch(area); break;
        case 'training': renderTraining(area); break;
    }
};

// 3. VIDEO-KI-LABOR
function renderAnalyse(area) {
    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>🔬 KI-Video-Labor</h2>
            <div id="ai-status" style="color:var(--ginga-green); font-size:12px;">● Initialisiere...</div>
        </div>
        
        <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:20px;">
            <div class="card" style="background:#0d1117; padding:15px; border-radius:15px; border:1px solid #30363d;">
                <div id="video-container" style="position:relative; background:#000; border-radius:10px; min-height:350px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                    <video id="v-player" style="width:100%; border-radius:10px; display:none;" muted playsinline></video>
                    <canvas id="v-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;"></canvas>
                    <p id="v-placeholder" style="color:#444;">Video hochladen für Technik-Check</p>
                </div>
                <div style="margin-top:15px; display:flex; gap:10px;">
                    <input type="file" id="v-upload" style="display:none;" accept="video/*" onchange="loadVideo(event)">
                    <button class="btn-send" onclick="document.getElementById('v-upload').click()">VIDEO UPLOAD</button>
                    <button class="btn-send" style="background:#30363d;" onclick="startAnalysis()">ANALYSE STARTEN</button>
                </div>
            </div>

            <div class="card" style="background:#161b22; padding:15px; border-radius:15px; border:1px solid #30363d;">
                <h3 style="color:var(--ginga-green); font-size:16px;">📊 KI-ERKENNTNISSE</h3>
                <div id="analysis-log" style="height:300px; overflow-y:auto; font-family:monospace; font-size:11px; color:#8b949e;">
                    <p>> Toni wartet auf Daten...</p>
                </div>
            </div>
        </div>
    `;
    initToniAI();
}

function loadVideo(e) {
    const file = e.target.files[0];
    const v = document.getElementById('v-player');
    if (file) {
        v.src = URL.createObjectURL(file);
        v.style.display = "block";
        document.getElementById('v-placeholder').style.display = "none";
        logToAI("Video erfolgreich geladen. Bereit für Inferenz.");
    }
}

async function startAnalysis() {
    const v = document.getElementById('v-player');
    if (!v.src || !detector) return;
    v.play();
    processVideoFrame();
}

async function processVideoFrame() {
    const v = document.getElementById('v-player');
    const c = document.getElementById('v-overlay');
    if (!v || v.paused || v.ended) return;

    const ctx = c.getContext('2d');
    c.width = v.videoWidth;
    c.height = v.videoHeight;

    const poses = await detector.estimatePoses(v);
    ctx.clearRect(0, 0, c.width, c.height);

    if (poses.length > 0) {
        drawSkeleton(ctx, poses[0].keypoints);
        checkJointAngles(poses[0].keypoints);
    }
    requestAnimationFrame(processVideoFrame);
}

function drawSkeleton(ctx, kp) {
    ctx.fillStyle = "#2ecc71";
    ctx.strokeStyle = "#2ecc71";
    ctx.lineWidth = 2;
    kp.forEach(p => {
        if (p.score > 0.5) {
            ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI); ctx.fill();
        }
    });
}

function checkJointAngles(kp) {
    const hip = kp.find(k => k.name === 'left_hip');
    const knee = kp.find(k => k.name === 'left_knee');
    const ankle = kp.find(k => k.name === 'left_ankle');

    if (hip?.score > 0.6 && knee?.score > 0.6 && ankle?.score > 0.6) {
        const angle = calcAngle(hip, knee, ankle);
        if (angle < 150) {
            logToAI(`WARNUNG: Standbein-Winkel kritisch (${Math.round(angle)}°)`);
        }
    }
}

function calcAngle(p1, p2, p3) {
    const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x**2 + v1.y**2);
    const mag2 = Math.sqrt(v2.x**2 + v2.y**2);
    return Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI);
}

function logToAI(msg) {
    const log = document.getElementById('analysis-log');
    const entry = document.createElement('div');
    entry.style = "margin-bottom:5px; border-left:2px solid #2ecc71; padding-left:5px;";
    entry.innerText = `> ${new Date().toLocaleTimeString()}: ${msg}`;
    log.prepend(entry);
}

// 4. KADER-VERWALTUNG (Bleibt stabil für deine Daten)
function renderKader(area) {
    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>Kader-Management</h2>
            <button class="btn-send" style="width:auto; padding:10px 20px;" onclick="addPlayerElite()">+ SPIELER HINZUFÜGEN</button>
        </div>
        <div id="player-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:15px;"></div>
    `;
    updatePlayerList();
}

function addPlayerElite() {
    const name = prompt("Name des Spielers:");
    if(!name) return;
    const nr = prompt("Trikotnummer:");
    const h = prompt("Größe in m (z.B. 1.85):");
    const w = prompt("Gewicht in kg:");

    squad.push({ id: Date.now(), name, nr, h: parseFloat(h), w: parseFloat(w), status: 'green' });
    updatePlayerList();
}

function updatePlayerList() {
    const grid = document.getElementById('player-grid');
    if(!grid) return; grid.innerHTML = "";
    squad.forEach(p => {
        const bmi = (p.h && p.w) ? (p.w / (p.h * p.h)).toFixed(1) : "N/A";
        grid.innerHTML += `
            <div style="background:#161b22; border:1px solid #30363d; padding:15px; border-radius:12px;">
                <div style="font-size:20px; font-weight:900; color:var(--ginga-green);">#${p.nr}</div>
                <div style="font-weight:bold;">${p.name}</div>
                <div style="font-size:11px; color:#8b949e;">BMI: ${bmi}</div>
            </div>`;
    });
}
