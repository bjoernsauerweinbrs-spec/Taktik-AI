/**
 * Toni 2.0 - Elite Logic Center (Vollständige Version)
 * Enthält: Kader, Video-KI, Winkel-Check & Daten-Brücke
 */

let squad = [];
let detector;
let isAiLoading = false;
let currentVideoEvents = [];
let nextPlayerId = 1;

// 1. KI-INITIALISIERUNG (TensorFlow MoveNet)
async function initToniAI() {
    if (isAiLoading || !window.poseDetection) return;
    isAiLoading = true;
    try {
        detector = await poseDetection.createDetector(
            poseDetection.SupportedModels.MoveNet,
            { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
        );
        const status = document.getElementById('ai-status');
        if(status) status.innerText = "● KI-ENGINE AKTIV";
        console.log("Toni: KI-Sichtsystem erfolgreich geladen.");
    } catch (e) {
        console.error("KI-Fehler:", e);
    }
}

// 2. TAB-STEUERUNG
window.loadTabContent = function(tab) {
    const area = document.getElementById('tab-content-area');
    if(!area) return;
    area.innerHTML = ""; 

    switch(tab) {
        case 'kader': renderKader(area); break;
        case 'analyse': renderAnalyse(area); break;
        case 'match': renderMatch(area); break;
        case 'training': renderTraining(area); break;
    }
};

// 3. VIDEO-KI-LABOR (Interface)
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
                <div style="margin-top:15px; display:flex; flex-direction:column; gap:10px;">
                    <div style="display:flex; gap:10px;">
                        <input type="file" id="v-upload" style="display:none;" accept="video/*" onchange="loadVideo(event)">
                        <button class="btn-send" onclick="document.getElementById('v-upload').click()">VIDEO UPLOAD</button>
                        <button class="btn-send" style="background:#30363d;" onclick="startAnalysis()">ANALYSE STARTEN</button>
                    </div>
                    <button class="btn-send" style="background:#238636;" onclick="saveAnalysisToPlayer()">ERGEBNIS IN AKTE SPEICHERN</button>
                </div>
            </div>

            <div class="card" style="background:#161b22; padding:15px; border-radius:15px; border:1px solid #30363d;">
                <h3 style="color:var(--ginga-green); font-size:16px;">📊 KI-ERKENNTNISSE</h3>
                <div id="analysis-log" style="height:320px; overflow-y:auto; font-family:monospace; font-size:11px; color:#8b949e; background:#0d1117; padding:10px; border-radius:8px;">
                    <p>> Toni wartet auf Daten...</p>
                </div>
            </div>
        </div>
    `;
    initToniAI();
}

// 4. KI-VIDEO-LOGIK
async function startAnalysis() {
    const v = document.getElementById('v-player');
    if (!v || !v.src || !detector) return;
    currentVideoEvents = []; // Reset für neues Video
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

function checkJointAngles(kp) {
    const hip = kp.find(k => k.name === 'left_hip');
    const knee = kp.find(k => k.name === 'left_knee');
    const ankle = kp.find(k => k.name === 'left_ankle');

    if (hip?.score > 0.6 && knee?.score > 0.6 && ankle?.score > 0.6) {
        const angle = calcAngle(hip, knee, ankle);
        if (angle < 150) {
            logToAI(`Technik-Warnung: Standbein-Winkel kritisch (${Math.round(angle)}°)`);
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
    if(!log) return;
    const entry = document.createElement('div');
    entry.style = "margin-bottom:5px; border-left:2px solid #2ecc71; padding-left:5px;";
    const time = new Date().toLocaleTimeString();
    entry.innerText = `> ${time}: ${msg}`;
    log.prepend(entry);
    currentVideoEvents.push(`${new Date().toLocaleDateString()} ${time}: ${msg}`);
}

function drawSkeleton(ctx, kp) {
    ctx.fillStyle = "#2ecc71";
    kp.forEach(p => {
        if (p.score > 0.5) {
            ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI); ctx.fill();
        }
    });
}

function loadVideo(e) {
    const file = e.target.files[0];
    const v = document.getElementById('v-player');
    if (file && v) {
        v.src = URL.createObjectURL(file);
        v.style.display = "block";
        document.getElementById('v-placeholder').style.display = "none";
        logToAI("Video erfolgreich geladen.");
    }
}

// 5. KADER-MANAGEMENT & DATEN-BRÜCKE
function renderKader(area) {
    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>Kader-Management</h2>
            <button class="btn-send" style="width:auto; padding:10px 20px;" onclick="addPlayerElite()">+ SPIELER HINZUFÜGEN</button>
        </div>
        <div id="player-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:15px;"></div>
    `;
    updatePlayerList();
}

function addPlayerElite() {
    const name = prompt("Name des Spielers:");
    if(!name) return;
    const nr = prompt("Trikotnummer:");
    const h = prompt("Größe in m (z.B. 1.85):");
    const w = prompt("Gewicht in kg:");

    squad.push({ id: nextPlayerId++, name, nr, h: parseFloat(h), w: parseFloat(w), history: [] });
    updatePlayerList();
}

window.saveAnalysisToPlayer = function() {
    if (currentVideoEvents.length === 0) {
        alert("Keine Analyse-Daten vorhanden, Björn!");
        return;
    }
    const pName = prompt("Welchem Spieler soll diese Analyse zugeordnet werden?");
    const player = squad.find(p => p.name.toLowerCase() === pName?.toLowerCase());

    if (player) {
        player.history.push(...currentVideoEvents);
        alert(`Analyse für ${player.name} gespeichert!`);
        currentVideoEvents = [];
        updatePlayerList();
    } else {
        alert("Spieler nicht gefunden.");
    }
};

function updatePlayerList() {
    const grid = document.getElementById('player-grid');
    if(!grid) return; 
    grid.innerHTML = "";
    
    squad.forEach(p => {
        const bmi = (p.h && p.w) ? (p.w / (p.h * p.h)).toFixed(1) : "N/A";
        const historyHtml = p.history.length > 0 ? p.history.map(h => `<div style="font-size:10px; color:#aaa; border-bottom:1px solid #333; padding:2px 0;">${h}</div>`).join('') : "Keine Video-Daten.";
        
        grid.innerHTML += `
            <div style="background:#161b22; border:1px solid #30363d; padding:15px; border-radius:12px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-size:24px; font-weight:900; color:var(--ginga-green);">#${p.nr}</span>
                    <span style="font-size:10px; background:#30363d; padding:2px 6px; border-radius:4px;">BMI: ${bmi}</span>
                </div>
                <div style="font-weight:bold; font-size:18px; margin-bottom:10px;">${p.name}</div>
                <div style="background:#0d1117; padding:10px; border-radius:8px; max-height:100px; overflow-y:auto;">
                    <strong style="font-size:10px; color:var(--ginga-green);">KI-LOGBUCH:</strong>
                    ${historyHtml}
                </div>
            </div>`;
    });
}

function renderMatch(area) { area.innerHTML = "<h2>Spieltags-Zentrale</h2><p>In Kürze verfügbar.</p>"; }
function renderTraining(area) { area.innerHTML = "<h2>Übungs-Archiv</h2><p>In Kürze verfügbar.</p>"; }
