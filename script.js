/* ==========================================================
   TONI 2.0 ELITE | CORE ENGINE & MANAGEMENT SYSTEM
   ========================================================== */

const sysConfig = {
    pass: "Toni2026", // Dein Master-Passwort
    assets: 12500000, // 12.5 Mio Startkapital
    transactions: [
        { date: "2026-02-18", label: "Sponsoring Global Dynamics", amount: 3500000, type: "income" },
        { date: "2026-02-19", label: "Gehälter Profikader", amount: -1200000, type: "expense" },
        { date: "2026-02-20", label: "Wartung Analyse-Zentrum", amount: -45000, type: "expense" }
    ],
    players: [
        { id: 101, name: "M. Neuer", pos: "TW", rating: 89, load: 1.1 },
        { id: 102, name: "J. Musiala", pos: "ZOM", rating: 91, load: 0.8 }
    ]
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
            loadModule('finance'); // Startet im Finanz-Labor
        }, 500);
        speak("Protokoll akzeptiert. Willkommen zurück, Coach.");
    } else {
        alert("ACCESS DENIED - INVALID CREDENTIALS");
    }
}

/**
 * 2. MODULE CONTROLLER (Die Aktentasche)
 */
function loadModule(modId) {
    const display = document.getElementById('display-area');
    const title = document.getElementById('module-title');
    
    // UI Feedback: Aktiven Button markieren
    document.querySelectorAll('.sub-nav button').forEach(btn => btn.style.color = '#64748b');
    event.target.style.color = '#22c55e';

    switch(modId) {
        case 'finance':
            title.innerText = "MANAGEMENT LABOR | FINANZEN";
            renderFinance(display);
            break;
        case 'kader':
            title.innerText = "KADER-ANALYSE & PROFILE";
            renderKader(display);
            break;
        case 'quest-sync':
            title.innerText = "META QUEST | TELEMETRIE-SYNC";
            display.innerHTML = `<div class="ai-msg">Warte auf Handshake mit Oculus/Meta Service...</div>`;
            break;
        default:
            display.innerHTML = `<div class="ai-msg">Modul ${modId} wird für das nächste Update vorbereitet.</div>`;
    }
}

/**
 * 3. MANAGEMENT LABOR: Buchhaltung & ROI
 */
function renderFinance(target) {
    const total = sysConfig.transactions.reduce((acc, t) => acc + t.amount, sysConfig.assets);
    document.getElementById('stat-cash').innerText = `${(total / 1000000).toFixed(1)}M €`;

    let html = `
        <div class="mgmt-card">
            <h3 style="margin-bottom:20px; font-family:'Orbitron'; font-size:12px;">GEWINN- UND VERLUSTRECHNUNG (G&V)</h3>
            <table class="mgmt-table">
                <thead>
                    <tr><th>Datum</th><th>Bezeichnung</th><th>Betrag</th></tr>
                </thead>
                <tbody>
                    ${sysConfig.transactions.map(t => `
                        <tr>
                            <td>${t.date}</td>
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
    target.innerHTML = html;
}

/**
 * 4. KADER-MANAGEMENT
 */
function renderKader(target) {
    target.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:20px;">
            ${sysConfig.players.map(p => `
                <div style="background:rgba(255,255,255,0.05); padding:20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1)">
                    <div style="font-family:'Orbitron'; color:#22c55e;">${p.rating} OVR</div>
                    <div style="font-weight:900; margin:10px 0;">${p.name}</div>
                    <div style="font-size:10px; color:#94a3b8;">POSITION: ${p.pos}</div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * 5. KI ANALYSE (Toni)
 */
function askToni() {
    const input = document.getElementById('toni-input');
    const history = document.getElementById('chat-history');
    if(!input.value) return;

    history.innerHTML += `<div style="margin-bottom:15px; color:#94a3b8;">> ${input.value}</div>`;
    
    // Simulation eines kognitiven Checkups
    setTimeout(() => {
        const response = "Analyse abgeschlossen: Der finanzielle Spielraum für Infrastruktur-Upgrades beträgt 2.4 Mio. Euro. Quest-Telemetrie zeigt leichte Ermüdungserscheinungen bei den Flügelspielern.";
        history.innerHTML += `<div class="ai-msg">${response}</div>`;
        history.scrollTop = history.scrollHeight;
        speak(response);
    }, 800);
    
    input.value = '';
}

/**
 * 6. VOICE ENGINE
 */
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85;
    window.speechSynthesis.speak(msg);
}

function updateClock() {
    const el = document.getElementById('system-clock');
    if (el) el.innerText = new Date().toLocaleTimeString('de-DE');
}
