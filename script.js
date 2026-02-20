/* ==========================================================
   TONI 2.0 ELITE | QUEST TELEMETRY & REALTIME INGEST
   ========================================================== */

const sysConfig = {
    pass: "Toni2026",
    assets: 12500000,
    transactions: [
        { date: "2026-02-18", label: "Sponsoring Global Dynamics", amount: 3500000, type: "income" },
        { date: "2026-02-19", label: "Gehälter Profikader", amount: -1200000, type: "expense" }
    ],
    // Aktuelle Telemetrie-Daten aus der Quest
    telemetry: {
        scanRate: 0,
        latency: 0,
        pitchControl: 0,
        lastSync: null
    }
};

/**
 * 1. SECURITY PROTOCOL
 */
function checkAuth() {
    const input = document.getElementById('sys-pass').value;
    const overlay = document.getElementById('auth-overlay');
    const board = document.getElementById('main-board');

    if (input === sysConfig.pass) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.add('hidden');
            board.classList.remove('hidden');
            loadModule('quest-sync'); // Startet direkt im Telemetrie-Bereich
        }, 500);
        speak("Biometrische Kopplung mit Quest-Headset initiiert.");
    } else {
        alert("ACCESS DENIED");
    }
}

/**
 * 2. QUEST TELEMETRY INGEST (Die Schnittstelle zu deiner Unity-Architektur)
 * Diese Funktion simuliert den Empfang von Daten aus dem Unity-Blueprint
 */
function ingestQuestData(data) {
    // Hier kommen die Daten aus dem Unity Event Hook (onPassComplete, headTurn etc.)
    sysConfig.telemetry.scanRate = data.scanRate || Math.floor(Math.random() * 20) + 70;
    sysConfig.telemetry.latency = data.latency || Math.floor(Math.random() * 50) + 100;
    sysConfig.telemetry.pitchControl = data.pitchControl || (Math.random() * 1).toFixed(2);
    sysConfig.telemetry.lastSync = new Date().toLocaleTimeString();

    updateTelemetryUI();
}

function updateTelemetryUI() {
    document.getElementById('m-scan').innerText = sysConfig.telemetry.scanRate + "%";
    document.getElementById('m-latency').innerText = sysConfig.telemetry.latency + "ms";
    
    // Toni gibt Feedback bei schlechten Werten
    if (sysConfig.telemetry.scanRate < 75) {
        speak("Warnung: Scanning-Rate unter Schwellenwert. Reha-Protokoll prüfen.");
    }
}

/**
 * 3. MODULE CONTROLLER
 */
function loadModule(modId) {
    const display = document.getElementById('display-area');
    const title = document.getElementById('module-title');
    
    document.querySelectorAll('.sub-nav button').forEach(btn => btn.style.color = '#64748b');
    if(event && event.target) event.target.style.color = '#22c55e';

    switch(modId) {
        case 'quest-sync':
            title.innerText = "META QUEST | LIVE TELEMETRY";
            renderQuestDashboard(display);
            break;
        case 'finance':
            title.innerText = "MANAGEMENT LABOR | FINANZEN";
            renderFinance(display);
            break;
        case 'medical':
            title.innerText = "MEDICAL & REHA METRIKEN";
            renderMedical(display);
            break;
    }
}

/**
 * 4. QUEST DASHBOARD RENDERING
 */
function renderQuestDashboard(target) {
    target.innerHTML = `
        <div class="mgmt-grid">
            <div class="mgmt-card" style="background: rgba(34, 197, 94, 0.05); border: 1px solid var(--accent);">
                <h3 style="color:var(--accent); font-family:'Orbitron'; font-size:11px;">LIVE STREAM: UNITY ASSET ENGINE</h3>
                <div id="unity-placeholder" style="height:300px; display:flex; align-items:center; justify-content:center; color:#64748b; border: 1px dashed var(--border); margin-top:15px;">
                    [ WARTE AUF WEBSOCKET HANDSHAKE... ]
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
                <div class="mgmt-card">
                    <label style="font-size:10px; color:var(--text-muted);">DECISION ACCURACY</label>
                    <div style="font-size:24px; font-family:'Orbitron'; color:var(--accent);">92.4%</div>
                </div>
                <div class="mgmt-card">
                    <label style="font-size:10px; color:var(--text-muted);">SPACE CREATION INDEX</label>
                    <div style="font-size:24px; font-family:'Orbitron'; color:var(--accent);">+0.42</div>
                </div>
            </div>
        </div>
    `;
    
    // Simuliere eingehende Daten für den Test
    setInterval(() => ingestQuestData({}), 5000);
}

/**
 * 5. MEDICAL / REHA KPI
 */
function renderMedical(target) {
    target.innerHTML = `
        <div class="mgmt-card">
            <h3>Reha-Monitoring (WASM Engine)</h3>
            <p style="color:#94a3b8; margin-bottom:20px;">Symmetrie-Analyse & ROM (Range of Motion)</p>
            <div style="height:10px; background:#1e293b; border-radius:5px; overflow:hidden;">
                <div style="width:85%; height:100%; background:var(--accent);"></div>
            </div>
            <small>Movement Symmetry: 85% (Optimaler Bereich)</small>
        </div>
    `;
}

// RESTLICHE FUNKTIONEN (FINANCE, SPEECH ETC.) WIE GEHABT
function renderFinance(target) {
    const total = sysConfig.transactions.reduce((acc, t) => acc + t.amount, sysConfig.assets);
    document.getElementById('stat-cash').innerText = `${(total / 1000000).toFixed(1)}M €`;
    target.innerHTML = `<div class="mgmt-card"><h3>Finanz-Labor aktiv</h3><p>G&V Daten geladen.</p></div>`;
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85;
    window.speechSynthesis.speak(msg);
}

function askToni() {
    const input = document.getElementById('toni-input');
    const history = document.getElementById('chat-history');
    if(!input.value) return;
    history.innerHTML += `<div style="margin-bottom:15px; color:#94a3b8;">> ${input.value}</div>`;
    input.value = '';
}
