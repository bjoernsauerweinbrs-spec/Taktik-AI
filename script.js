/* ==========================================================
   TONI 2.0 | ELITE COMMAND CORE (FULL VERSION)
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
    // Quest Telemetrie-Speicher
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
 * 1. SECURITY & AUTHENTICATION
 */
function checkAuth() {
    const input = document.getElementById('sys-pass').value;
    if (input === sysConfig.pass) {
        document.getElementById('auth-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('auth-overlay').classList.add('hidden');
            document.getElementById('main-board').classList.remove('hidden');
            loadModule('finance'); 
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
        case 'stadionzeitung':
            title.innerText = "STADION-ZEITUNG // EDITOR";
            renderNewspaper(display);
            break;
    }
}

/**
 * 3. VR STADIUM TRANSFORMATION (Elite Upgrade)
 */
function enterVR() {
    const board = document.getElementById('main-board');
    const stadium = document.getElementById('vr-stadium');
    
    board.classList.add('hidden');
    stadium.style.display = 'block';
    
    // Befehl an die Quest, in den Vollbild-VR-Modus zu wechseln
    document.querySelector('a-scene').enterVR();
    speak("Stadion-Modus aktiv. Starte Live-Analyse der xG-Scoring Probability.");

    // Echtzeit-Berechnung der Metriken wie beim FC Bayern Tool
    setInterval(updateEliteVRMetrics, 500);
}

function updateEliteVRMetrics() {
    const cam = document.getElementById('quest-cam');
    if (!cam) return;

    const pos = cam.getAttribute('position');
    // Berechnung der Torwahrscheinlichkeit (xG) basierend auf Position zum Tor (z = -52.5)
    const dist = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.z - (-52.5), 2));
    let xG = Math.max(0, 100 - (dist * 1.6)); // Profi-Distanz-Algorithmus
    
    const xgDisplay = document.getElementById('xg-display');
    if(xgDisplay) {
        xgDisplay.setAttribute('value', `GOAL PROBABILITY: ${xG.toFixed(1)}%`);
        xgDisplay.setAttribute('color', xG > 60 ? '#22c55e' : (xG > 30 ? '#fbbf24' : '#ef4444'));
    }

    // Telemetrie an das Board spiegeln
    sysConfig.questData.scanRate = Math.floor(Math.random() * 10) + 85; 
    updateTelemetryUI();
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
 * 5. STADION-ZEITUNG
 */
function renderNewspaper(target) {
    target.innerHTML = `
        <div class="newspaper-module">
            <div class="news-controls" style="margin-bottom: 20px; display: flex; gap: 10px;">
                <button onclick="generateArticle()" class="vr-trigger">KI-ARTIKEL GENERIEREN</button>
                <button onclick="window.print()" class="tactical-btn">PDF EXPORT</button>
            </div>
            <div class="magazine-preview">
                <div class="mag-page">
                    <h1 class="orbitron" style="color:black; border-bottom: 2px solid black;">ELITE MATCHDAY</h1>
                    <div class="mag-content" style="margin-top: 20px; color:black;">
                        <h2 id="news-headline" style="font-weight:900;">TITELSTORY: ANALYSE BEREIT</h2>
                        <p id="news-text" style="margin-top: 15px; line-height: 1.6;">Warte auf Daten-Input aus der Aktentasche...</p>
                    </div>
                    <div class="mag-footer" style="margin-top: 40px; font-size: 10px; border-top: 1px solid #ccc; padding-top: 10px; color: #666;">
                        TONI 2.0 // STRATEGIE-AUSGABE
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateArticle() {
    const headline = document.getElementById('news-headline');
    const text = document.getElementById('news-text');
    headline.innerText = "VR-ANALYSE: SCAN-RATE AUF REKORDNIVEAU";
    text.innerText = `Die neuesten Telemetrie-Daten zeigen eine Scanning-Rate von ${sysConfig.questData.scanRate > 0 ? sysConfig.questData.scanRate : 88}%. Toni empfiehlt die Integration in den Spielbetrieb.`;
    speak("Stadionzeitung aktualisiert.");
}

/**
 * 6. KADER & MEDICAL
 */
function renderKader(target) {
    target.innerHTML = `<div class="card-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:20px;">
        ${sysConfig.players.map(p => `
            <div class="mgmt-card player-card">
                <div class="p-rating" style="font-family:'Orbitron'; color:var(--accent); font-size:24px;">${p.rating}</div>
                <div class="p-name" style="font-weight:900; margin:10px 0;">${p.name}</div>
                <div class="p-status ${p.medical === 'Reha' ? 'warn' : ''}">STATUS: ${p.medical}</div>
            </div>
        `).join('')}
    </div>`;
}

function renderMedical(target) {
    target.innerHTML = `
        <div class="mgmt-card">
            <h3>WASM REHA ENGINE // SYMMETRIE</h3>
            <div class="symmetry-meter" style="display:flex; height:20px; background:#1e293b; margin:20px 0; border-radius:10px; overflow:hidden;">
                <div style="width: 48%; background:var(--accent); border-right:2px solid black;"></div>
                <div style="width: 52%; background:var(--accent);"></div>
            </div>
            <p class="small">Abweichung: 4% (Optimal)</p>
        </div>
    `;
}

/**
 * 7. QUEST HUB & TELEMETRIE
 */
function renderQuestHub(target) {
    target.innerHTML = `
        <div class="quest-layout">
            <div class="quest-grid">
                <div class="mgmt-card high-end">
                    <h3>SCAN RATE</h3>
                    <div class="big-metric" id="q-scan">${sysConfig.questData.scanRate}%</div>
                </div>
                <div class="mgmt-card high-end">
                    <h3>LATENCY</h3>
                    <div class="big-metric" id="q-latency">${sysConfig.questData.latency}ms</div>
                </div>
            </div>
            <button class="vr-trigger" style="margin-top:20px" onclick="simulateQuestData()">SIMULATE STREAM</button>
        </div>
    `;
}

function updateTelemetryUI() {
    const s = document.getElementById('m-scan');
    const l = document.getElementById('m-latency');
    if(s) s.innerText = sysConfig.questData.scanRate + "%";
    if(l) l.innerText = "112ms";
}

function simulateQuestData() {
    sysConfig.questData.scanRate = Math.floor(Math.random() * 20) + 75;
    updateTelemetryUI();
}

/**
 * 8. AI ASSISTANT (TONI)
 */
function askToni() {
    const input = document.getElementById('toni-input');
    const history = document.getElementById('chat-history');
    if(!input.value) return;
    history.innerHTML += `<div class="user-msg">> ${input.value}</div>`;
    setTimeout(() => {
        const res = "Analyse abgeschlossen. xG-Werte im Stadion-Modus sind stabil.";
        history.innerHTML += `<div class="ai-msg">${res}</div>`;
        speak(res);
    }, 1000);
    input.value = '';
}

function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

window.onload = () => { console.log("TONI 2.0 ELITE CORE READY."); };
