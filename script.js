/* ==========================================================
   TONI 2.0 | ELITE COMMAND CORE (QUEST-INTEGRATED)
   ========================================================== */

const sysConfig = {
    pass: "Toni2026",
    assets: 12500000,
    // Management-Labor Datenmodell
    transactions: [
        { date: "2026-02-18", label: "Sponsoring Global Dynamics", amount: 3500000, type: "income", category: "Sponsoring" },
        { date: "2026-02-19", label: "Gehälter Profikader", amount: -1200000, type: "expense", category: "Personal" },
        { date: "2026-02-20", label: "Expansion Analysezentrum", amount: -450000, type: "expense", category: "Infrastruktur" }
    ],
    // Quest Telemetrie-Speicher (Realtime-Buffer)
    questData: {
        connected: false,
        scanRate: 0,
        latency: 0,
        pitchControl: 0,
        headTurns: [],
        decisionScore: 0,
        rehaSymmetry: 0
    },
    players: [
        { id: 101, name: "M. Neuer", pos: "TW", rating: 89, medical: "Fit", acwr: 1.05 },
        { id: 102, name: "J. Musiala", pos: "ZOM", rating: 91, medical: "Reha", acwr: 1.42 }
    ]
};

/**
 * 1. AUTHENTIFIZIERUNG
 */
function checkAuth() {
    const input = document.getElementById('sys-pass').value;
    if (input === sysConfig.pass) {
        document.getElementById('auth-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('main-board').classList.remove('hidden');
            loadModule('finance'); // Standardstart im Finanz-Labor
        }, 500);
        speak("Zentraler Zugriff gewährt. Alle Systeme auf Standby.");
    } else {
        alert("ZUGRIFF VERWEIGERT: Ungültiger Sicherheitsschlüssel.");
    }
}

/**
 * 2. MODUL-CONTROLLER (DIE AKTENTASCHE)
 */
function loadModule(modId) {
    const display = document.getElementById('display-area');
    const title = document.getElementById('module-title');
    
    // UI-State Reset
    document.querySelectorAll('.sub-nav button').forEach(btn => btn.style.color = '#64748b');
    if(event && event.target) event.target.style.color = '#22c55e';

    switch(modId) {
        case 'finance':
            title.innerText = "MANAGEMENT LABOR // FINANZEN & ROI";
            renderFinance(display);
            break;
        case 'quest-sync':
            title.innerText = "META QUEST // ELITE TELEMETRY HUB";
            renderQuestHub(display);
            break;
        case 'kader':
            title.innerText = "KADERVERWALTUNG // ASSET MANAGEMENT";
            renderKader(display);
            break;
        case 'medical':
            title.innerText = "MEDICAL CENTER // REHA-DIAGNOSTIK";
            renderMedical(display);
            break;
    }
}

/**
 * 3. QUEST ELITE HUB (DEIN LUXUS-BOARD)
 */
function renderQuestHub(target) {
    target.innerHTML = `
        <div class="quest-layout">
            <div class="quest-header-bar">
                <div class="connection-pill ${sysConfig.questData.connected ? 'active' : ''}">
                    ${sysConfig.questData.connected ? 'LIVE LINK ACTIVE' : 'AWAITING HANDSHAKE...'}
                </div>
                <div class="quest-device-info">Device: Meta Quest 3 // Status: High Performance Mode</div>
            </div>

            <div class="quest-grid">
                <div class="mgmt-card high-end">
                    <h3>COGNITIVE SCAN RATE</h3>
                    <div class="big-metric" id="q-scan">${sysConfig.questData.scanRate}%</div>
                    <div class="metric-graph"><div class="fill" style="width:${sysConfig.questData.scanRate}%"></div></div>
                    <p class="small">Zielwert: > 85% für Profi-Level</p>
                </div>

                <div class="mgmt-card high-end">
                    <h3>DECISION LATENCY</h3>
                    <div class="big-metric" id="q-latency">${sysConfig.questData.latency}ms</div>
                    <p class="small" style="color:var(--accent)">Optimale Verarbeitungsgeschwindigkeit</p>
                </div>

                <div class="mgmt-card full-width">
                    <h3>PITCH CONTROL MATRIX (PROBABILISTIC MODEL)</h3>
                    <div class="matrix-viz">
                        <div class="matrix-cell" style="opacity: 0.8"></div><div class="matrix-cell" style="opacity: 0.4"></div>
                        <div class="matrix-cell" style="opacity: 0.9"></div><div class="matrix-cell" style="opacity: 0.2"></div>
                        <div class="matrix-cell" style="opacity: 0.6"></div><div class="matrix-cell" style="opacity: 0.7"></div>
                    </div>
                    <p class="small">Berechnung: Softmax-Distribution basierend auf v_max und t_reaction</p>
                </div>
            </div>

            <div class="quest-actions">
                <button class="vr-trigger" onclick="simulateQuestData()">SIMULATE UNITY DATA-STREAM</button>
            </div>
        </div>
    `;
}

/**
 * 4. MANAGEMENT LABOR (G&V)
 */
function renderFinance(target) {
    const balance = sysConfig.transactions.reduce((acc, t) => acc + t.amount, sysConfig.assets);
    document.getElementById('stat-cash').innerText = `${(balance / 1000000).toFixed(2)}M €`;

    target.innerHTML = `
        <div class="mgmt-card">
            <h3>TRANSAKTIONS-JOURNAL (ELITE LEVEL)</h3>
            <table class="mgmt-table">
                <thead>
                    <tr><th>Datum</th><th>Kategorie</th><th>Bezeichnung</th><th>Effekt</th></tr>
                </thead>
                <tbody>
                    ${sysConfig.transactions.map(t => `
                        <tr>
                            <td>${t.date}</td>
                            <td><span class="tag">${t.category}</span></td>
                            <td>${t.label}</td>
                            <td class="${t.amount > 0 ? 'val-pos' : 'val-neg'}">
                                ${t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()} €
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * 5. KADER & MEDICAL
 */
function renderKader(target) {
    target.innerHTML = `<div class="card-grid">
        ${sysConfig.players.map(p => `
            <div class="mgmt-card player-card">
                <div class="p-rating">${p.rating}</div>
                <div class="p-name">${p.name}</div>
                <div class="p-status ${p.medical === 'Reha' ? 'warn' : ''}">${p.medical}</div>
            </div>
        `).join('')}
    </div>`;
}

function renderMedical(target) {
    target.innerHTML = `
        <div class="mgmt-card">
            <h3>WASM REHA ENGINE // SYMMETRIE-ANALYSE</h3>
            <p>Echtzeit-Verarbeitung von Bewegungsdaten (Quest Telemetrie)</p>
            <div class="symmetry-meter">
                <div class="bar-left" style="width: 48%"></div>
                <div class="bar-right" style="width: 52%"></div>
            </div>
            <p class="small">Abweichung: 4% (Innerhalb der Toleranz)</p>
        </div>
    `;
}

/**
 * 6. TELEMETRIE LOGIK & KI
 */
function simulateQuestData() {
    sysConfig.questData.connected = true;
    sysConfig.questData.scanRate = Math.floor(Math.random() * 20) + 75;
    sysConfig.questData.latency = Math.floor(Math.random() * 40) + 110;
    
    loadModule('quest-sync'); // Refresh view
    document.getElementById('m-scan').innerText = sysConfig.questData.scanRate + "%";
    document.getElementById('m-latency').innerText = sysConfig.questData.latency + "ms";
    
    if (sysConfig.questData.scanRate < 80) {
        speak("Achtung Coach: Die Scanning-Rate sinkt. Der Spieler verliert den Fokus im Rückenraum.");
    }
}

function askToni() {
    const input = document.getElementById('toni-input');
    const history = document.getElementById('chat-history');
    if(!input.value) return;

    history.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    
    setTimeout(() => {
        const response = "Taktische Empfehlung: Die Pitch Control Probability zeigt eine Schwäche in Zone 4. Ich empfehle das Quest-Szenario 'Gap Finder' Level 2.";
        history.innerHTML += `<div class="ai-msg">${response}</div>`;
        history.scrollTop = history.scrollHeight;
        speak(response);
    }, 1000);
    
    input.value = '';
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85;
    window.speechSynthesis.speak(msg);
}
