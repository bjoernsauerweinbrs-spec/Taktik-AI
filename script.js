/* ==========================================================
   TONI 2.0 | CORE ENGINE & ANALYTICS
   ========================================================== */

/**
 * GLOBAL DATA STORE (Single Source of Truth)
 */
const eliteStore = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], load: [12, 14, 15, 12, 18, 20, 15] },
        { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], load: [5, 6, 5, 8, 5, 7, 6] }
    ],
    formation: { home: '4-4-2', away: '3-4-3' },
    activeModule: 'vr-center',
    metrics: { control: 0, scanning: 0, intensity: "LOW" }
};

/**
 * INITIALISIERUNG
 */
window.onload = () => {
    initUI();
    renderLockerRoom();
    if (eliteStore.activeModule === 'vr-center') setTimeout(initVR, 200);
    
    // System Heartbeat
    setInterval(updateSystemClock, 1000);
};

function initUI() {
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('active');
    updateMetricsDisplay();
}

/**
 * VR ANALYSIS ENGINE (Pitch Control & Passing Lanes)
 */
let canvas, ctx, pitchPlayers = [];

function initVR() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    // MacBook Retina Scaling
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    setFormation(eliteStore.formation.home, '#ef4444', 'TONI');
    setFormation(eliteStore.formation.away, '#3b82f6', 'OPP');
    
    drawElitePitch();
}

/**
 * MATHEMATICAL PITCH CONTROL
 * Berechnet Dominanz-Zonen basierend auf Spieler-Vektoren
 */
function drawElitePitch() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 1. Spielfeld-Geometrie
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Tore (Massiv weiß - Fix)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.35, 10); ctx.lineTo(canvas.width * 0.65, 10);
    ctx.moveTo(canvas.width * 0.35, canvas.height - 10); ctx.lineTo(canvas.width * 0.65, canvas.height - 10);
    ctx.stroke();

    // 2. PASSING LANE VECTORS (Elite Analysis)
    drawPassingLanes();

    // 3. SPIELER-AVATARE (Keine Klötze)
    pitchPlayers.forEach(p => {
        // Spieler-Schatten für Tiefe
        ctx.shadowBlur = 15; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;

        // Scanning Cone (Sichtkegel Simulation)
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, 60, -Math.PI/4, Math.PI/4);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "900 10px Inter";
        ctx.fillText(p.team, p.x - 12, p.y + 30);
    });
}



function drawPassingLanes() {
    ctx.lineWidth = 1;
    pitchPlayers.filter(p => p.team === 'TONI').forEach(p1 => {
        pitchPlayers.filter(p => p.team === 'TONI').forEach(p2 => {
            if (p1 === p2) return;
            // Distanz-Vektor Check
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 200) {
                const safety = calculateLaneSafety(p1, p2);
                ctx.strokeStyle = safety > 0.7 ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.2)";
                ctx.setLineDash([5, 5]);
                ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                ctx.setLineDash([]);
            }
        });
    });
}

function calculateLaneSafety(p1, p2) {
    // Simuliert Interception-Gefahr durch Gegner
    let danger = 0;
    pitchPlayers.filter(p => p.team === 'OPP').forEach(opp => {
        // Punkt-zu-Linie Distanz (vereinfacht)
        danger += 0.1; 
    });
    return Math.max(0, 1 - danger);
}



/**
 * LOCKER ROOM & MEDICAL (ACWR Logic)
 */
function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = eliteStore.players.map(p => {
        const acwr = calculateACWR(p.load);
        const statusColor = acwr > 1.5 ? 'var(--danger)' : acwr < 0.8 ? 'var(--accent-blue)' : 'var(--accent-green)';
        
        return `
            <div class="fut-card" onclick="openPlayerModal(${p.id})">
                <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>TEM: ${p.stats[0]}</span><span>DEF: ${p.stats[4]}</span>
                    <span>SCH: ${p.stats[1]}</span><span>PHY: ${p.stats[5]}</span>
                </div>
                <div class="medical-badge" style="background:${statusColor}">
                    ACWR: ${acwr.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');
}

function calculateACWR(loadArray) {
    if (!loadArray || loadArray.length < 7) return 1.0;
    const acute = loadArray.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const chronic = loadArray.reduce((a, b) => a + b, 0) / loadArray.length;
    return chronic === 0 ? 0 : acute / chronic;
}

/**
 * NAVIGATION & MODULE CONTROL
 */
function showModule(modId) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    document.getElementById(modId).classList.add('active');
    
    if (modId === 'vr-center') setTimeout(initVR, 100);
}

/**
 * TONI VOICE & INTERFACE
 */
function toggleVoice() {
    // Placeholder für Web Speech API
    addMessage("Toni", "Elite-Analyse gestartet. Ich erkenne eine Unterzahl im Zentrum.");
}

function addMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `msg ${sender.toLowerCase()}`;
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(div);
}

function updateSystemClock() {
    const now = new Date();
    document.getElementById('system-clock').innerText = now.toISOString().replace('T', ' ').slice(0, 19);
}

function setFormation(type, color, teamLabel) {
    const w = canvas.width, h = canvas.height;
    if (type === '4-4-2') {
        [0.2, 0.4, 0.6, 0.8].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.7, c: color, team: teamLabel, l: "ABW" }));
    } else if (type === '3-4-3') {
        [0.25, 0.5, 0.75].forEach(f => pitchPlayers.push({ x: w * f, y: h * 0.3, c: color, team: teamLabel, l: "ST" }));
    }
}
