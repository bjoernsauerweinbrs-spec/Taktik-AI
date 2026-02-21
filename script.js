/* ==========================================================================
   TONI 2.0 | ELITE CORE ENGINE
   Version: 3.5.0 (Production Build)
   Architecture: Monolith / Local-First / VR-Hybrid
   ========================================================================== */

/**
 * --------------------------------------------------------------------------
 * 1. DATABASE & STATE MANAGEMENT (Local Storage)
 * --------------------------------------------------------------------------
 */
const DEFAULT_DB = {
    settings: {
        pass: "Toni2026",
        clubName: "RB Leipzig",
        coachName: "Head Coach"
    },
    // Finanz-Daten (Transaktionsbasiert)
    finance: [
        { id: 1708221, date: "2026-02-20", desc: "Sponsoring: Red Bull Global", amount: 4500000, type: "in" },
        { id: 1708222, date: "2026-02-21", desc: "Gehaltslauf: Profikader Feb", amount: -2100000, type: "out" },
        { id: 1708223, date: "2026-02-22", desc: "Reha-Equipment: Cryo Chamber", amount: -45000, type: "out" }
    ],
    // Spieler-Daten (FIFA Cards)
    squad: [
        { id: 101, name: "Péter Gulácsi", pos: "TW", rating: 84, status: "Fit", img: "" },
        { id: 102, name: "Willi Orbán", pos: "IV", rating: 83, status: "Fit", img: "" },
        { id: 103, name: "Dani Olmo", pos: "ZOM", rating: 87, status: "Verletzt", img: "" },
        { id: 104, name: "Loïs Openda", pos: "ST", rating: 85, status: "Fit", img: "" },
        { id: 105, name: "Xavi Simons", pos: "FL", rating: 89, status: "Reha", img: "" }
    ],
    // VR Telemetrie Cache
    telemetry: {
        lastScanRate: 0,
        lastLatency: 0,
        sessionCount: 12
    }
};

// Initialisiere DB beim Start
let DB = JSON.parse(localStorage.getItem('toni_elite_db')) || DEFAULT_DB;

/**
 * Speichert den aktuellen Zustand persistent im Browser.
 */
function saveSystem() {
    localStorage.setItem('toni_elite_db', JSON.stringify(DB));
    refreshKPIs(); // Aktualisiert sofort die Budget-Anzeige oben
}

/**
 * Berechnet KPIs für den Header neu.
 */
function refreshKPIs() {
    // 1. Budget berechnen (Startkapital 10M + Transaktionen)
    let budget = 10000000; 
    DB.finance.forEach(tx => budget += tx.amount);
    
    // 2. Kaderwert schätzen (Rating * 1.5M)
    let squadValue = DB.squad.reduce((acc, p) => acc + (p.rating * 1500000), 0);

    // 3. UI Updates
    document.getElementById('kpi-budget').innerText = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(budget);
    document.getElementById('kpi-squad-value').innerText = (squadValue / 1000000).toFixed(1) + "M €";
    
    // Budget Farbe (Rot wenn negativ)
    const budgetElement = document.getElementById('kpi-budget');
    if(budget < 0) { budgetElement.classList.remove('val-pos'); budgetElement.classList.add('val-neg'); }
    else { budgetElement.classList.add('val-pos'); budgetElement.classList.remove('val-neg'); }
}

/**
 * --------------------------------------------------------------------------
 * 2. AUTHENTICATION & BOOT SEQUENCE
 * --------------------------------------------------------------------------
 */
function systemBootSequence() {
    const input = document.getElementById('sys-pass').value;
    const terminal = document.getElementById('auth-layer');
    
    if (input === DB.settings.pass) {
        // Erfolgreicher Login
        terminal.style.opacity = '0';
        speak("Identifikation bestätigt. Willkommen im taktischen Operationszentrum.");
        
        setTimeout(() => {
            terminal.classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            refreshKPIs();
            startSystemClock();
            loadModule('kader'); // Standard-Modul laden
        }, 800);
    } else {
        // Fehler Animation
        const wrap = document.querySelector('.input-wrapper');
        wrap.style.animation = "shake 0.5s";
        setTimeout(() => wrap.style.animation = "", 500);
        speak("Zugriff verweigert.");
    }
}

/**
 * --------------------------------------------------------------------------
 * 3. MODULE NAVIGATION (The Switchboard)
 * --------------------------------------------------------------------------
 */
function loadModule(moduleId) {
    const viewport = document.getElementById('content-viewport');
    const displayTitle = document.getElementById('active-module-display');

    // UI Reset
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    if(event && event.target) event.target.classList.add('active');

    // VR Viewport verstecken falls aktiv
    document.getElementById('vr-viewport').classList.add('hidden');
    viewport.classList.remove('hidden');

    // Modul Logik
    switch(moduleId) {
        case 'kader':
            displayTitle.innerText = "DASHBOARD // MANNSCHAFT";
            renderSquadModule(viewport);
            break;
        case 'finance':
            displayTitle.innerText = "DASHBOARD // FINANZ LABOR";
            renderFinanceModule(viewport);
            break;
        case 'stadionzeitung':
            displayTitle.innerText = "MEDIA // STADION ZEITUNG CMS";
            renderNewspaperModule(viewport);
            break;
        case 'vr-hub':
            displayTitle.innerText = "INNOVATION // VR TELEMETRIE";
            renderVRHub(viewport);
            break;
        case 'drills':
        case 'medical':
        case 'scouting':
        case 'sponsors':
            displayTitle.innerText = "DASHBOARD // " + moduleId.toUpperCase();
            viewport.innerHTML = `<div style="padding:50px; text-align:center; color:#64748b;">
                <h1><i class="fa-solid fa-person-digging"></i></h1>
                <p>Modul ${moduleId} wird geladen...</p>
            </div>`;
            break;
    }
}

/**
 * --------------------------------------------------------------------------
 * 4. MODULE: SQUAD MANAGEMENT (CRUD Editor)
 * --------------------------------------------------------------------------
 */
function renderSquadModule(target) {
    let html = `<div class="card-grid">`;
    
    // Bestehende Spieler
    DB.squad.forEach(p => {
        let statusColor = p.status === 'Fit' ? 'status-fit' : (p.status === 'Reha' ? 'status-reha' : 'status-verletzt');
        html += `
        <div class="fifa-card" onclick="openPlayerEditor(${p.id})">
            <div class="med-status ${statusColor}"></div>
            <div class="card-top">
                <span class="rating">${p.rating}</span>
                <span class="pos">${p.pos}</span>
            </div>
            <img src="https://ui-avatars.com/api/?name=${p.name}&background=random&size=128" class="player-img">
            <div class="player-name">${p.name}</div>
        </div>`;
    });

    // "Neu hinzufügen" Karte
    html += `
        <div class="fifa-card add-new" onclick="createNewPlayer()">
            <i class="fa-solid fa-plus" style="font-size:40px;"></i>
            <span style="margin-top:10px; font-size:12px; font-weight:700;">NEUER SPIELER</span>
        </div>
    </div>`;

    target.innerHTML = html;
}

// EDITOR LOGIC
function openPlayerEditor(id) {
    const p = DB.squad.find(x => x.id === id);
    if(!p) return;

    document.getElementById('edit-p-id').value = p.id;
    document.getElementById('edit-p-name').value = p.name;
    document.getElementById('edit-p-pos').value = p.pos;
    document.getElementById('edit-p-rating').value = p.rating;
    document.getElementById('edit-p-med').value = p.status;

    document.getElementById('modal-player-editor').classList.remove('hidden');
}

function createNewPlayer() {
    const newId = Date.now();
    DB.squad.push({ id: newId, name: "Neuer Spieler", pos: "ZM", rating: 75, status: "Fit", img: "" });
    saveSystem();
    renderSquadModule(document.getElementById('content-viewport'));
    openPlayerEditor(newId);
}

function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const index = DB.squad.findIndex(x => x.id === id);

    if(index > -1) {
        DB.squad[index].name = document.getElementById('edit-p-name').value;
        DB.squad[index].pos = document.getElementById('edit-p-pos').value;
        DB.squad[index].rating = parseInt(document.getElementById('edit-p-rating').value);
        DB.squad[index].status = document.getElementById('edit-p-med').value;

        saveSystem();
        closeModal('modal-player-editor');
        renderSquadModule(document.getElementById('content-viewport'));
        speak(`Profil von ${DB.squad[index].name} aktualisiert.`);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

/**
 * --------------------------------------------------------------------------
 * 5. MODULE: FINANCE LABORATORY
 * --------------------------------------------------------------------------
 */
function renderFinanceModule(target) {
    target.innerHTML = `
        <div class="finance-dashboard">
            <div class="input-panel">
                <input type="date" id="fin-date" value="${new Date().toISOString().split('T')[0]}">
                <input type="text" id="fin-desc" placeholder="Verwendungszweck (z.B. Transfererlös)">
                <input type="number" id="fin-amount" placeholder="Betrag (+/-)">
                <button class="btn-action" onclick="addFinanceTransaction()">BUCHEN</button>
            </div>

            <div style="background:var(--bg-card); padding:20px; border-radius:8px; border:1px solid var(--border-light);">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Datum</th>
                            <th>Beschreibung</th>
                            <th style="text-align:right;">Betrag</th>
                            <th style="text-align:center;">Aktion</th>
                        </tr>
                    </thead>
                    <tbody id="finance-tbody">
                        ${DB.finance.map(tx => `
                            <tr>
                                <td style="color:#64748b; font-family:monospace;">#${tx.id}</td>
                                <td>${tx.date}</td>
                                <td><b style="color:white;">${tx.desc}</b></td>
                                <td style="text-align:right;" class="${tx.type === 'in' ? 'val-pos' : 'val-neg'}">
                                    ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                                </td>
                                <td style="text-align:center;">
                                    <i class="fa-solid fa-trash" style="cursor:pointer; color:#64748b;" onclick="deleteTransaction(${tx.id})"></i>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function addFinanceTransaction() {
    const desc = document.getElementById('fin-desc').value;
    const amount = parseFloat(document.getElementById('fin-amount').value);
    const date = document.getElementById('fin-date').value;

    if(desc && amount && date) {
        DB.finance.unshift({
            id: Date.now(),
            date: date,
            desc: desc,
            amount: amount,
            type: amount >= 0 ? 'in' : 'out'
        });
        saveSystem();
        loadModule('finance'); // Reload
        speak("Transaktion verbucht.");
    } else {
        alert("Bitte alle Felder ausfüllen.");
    }
}

function deleteTransaction(id) {
    if(confirm("Soll diese Buchung wirklich storniert werden?")) {
        DB.finance = DB.finance.filter(tx => tx.id !== id);
        saveSystem();
        loadModule('finance');
    }
}

/**
 * --------------------------------------------------------------------------
 * 6. MODULE: STADION ZEITUNG (CMS)
 * --------------------------------------------------------------------------
 */
function renderNewspaperModule(target) {
    target.innerHTML = `
        <div style="display:flex; justify-content:center;">
            <div class="newspaper-wrapper">
                <div class="paper-header">
                    <h1 class="paper-brand">DIE ROTE BULLEN ARENA</h1>
                    <div class="paper-meta">
                        <span>AUSGABE #24</span>
                        <span>SAISON 2025/26</span>
                        <span>PREIS: 2,50 €</span>
                    </div>
                </div>
                
                <h1 class="headline-l cms-editable" contenteditable="true">RB LEIPZIG GREIFT NACH DEN STERNEN</h1>
                
                <div style="width:100%; height:300px; background:#ccc; display:flex; align-items:center; justify-content:center; margin:20px 0; color:#666;" class="cms-editable">
                    [PLATZHALTER FÜR BILD - HIER KLICKEN]
                </div>
                
                <div class="article-text cms-editable" contenteditable="true" id="paper-body">
                    Hier beginnt der Text. Klicken Sie, um zu schreiben. Die Mannschaft ist in Topform und bereit für das Spitzenspiel. 
                    Trainer Rose betont die Wichtigkeit der Defensive. "Wir müssen kompakt stehen", so der Coach.
                </div>

                <div style="margin-top:40px; border-top:2px solid black; padding-top:20px; text-align:center;">
                     <button onclick="window.print()" class="btn-action"><i class="fa-solid fa-print"></i> DRUCKEN / PDF</button>
                     <button onclick="generateAIArticle()" class="btn-action" style="background:#0f172a; color:white;"><i class="fa-solid fa-wand-magic-sparkles"></i> KI TEXT</button>
                </div>
            </div>
        </div>
    `;
}

function generateAIArticle() {
    const textBlock = document.getElementById('paper-body');
    const phrases = [
        "Die Arena wird beben.",
        "Analysten sehen einen klaren Vorteil im Umschaltspiel.",
        "Xavi Simons könnte heute der entscheidende Faktor sein.",
        "Die Fans haben eine spektakuläre Choreo vorbereitet.",
        "In der Kabine herrscht fokussierte Stille."
    ];
    // Fügt zufällige Sätze hinzu
    textBlock.innerText += " " + phrases[Math.floor(Math.random() * phrases.length)] + " " + phrases[Math.floor(Math.random() * phrases.length)];
    speak("Artikel wurde durch KI erweitert.");
}

/**
 * --------------------------------------------------------------------------
 * 7. MODULE: VR HUB & STADIUM ENGINE
 * --------------------------------------------------------------------------
 */
function renderVRHub(target) {
    target.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%;">
            <h2 style="font-family:'Orbitron'; color:var(--accent-primary); margin-bottom:20px;">VR TRAINING ENGINE</h2>
            <div style="background:var(--bg-card); padding:40px; border-radius:12px; border:1px solid var(--border-light); text-align:center; width:500px;">
                <i class="fa-brands fa-meta" style="font-size:60px; color:white; margin-bottom:20px;"></i>
                <p style="color:var(--text-muted); margin-bottom:30px;">
                    Verbinden Sie die Meta Quest 3 via WebXR.
                    Das Stadion-Modell wird geladen und die xG-Sensoren werden kalibriert.
                </p>
                <button class="live-btn active" style="width:100%; justify-content:center; padding:20px; font-size:16px;" onclick="enterVRMode()">
                    START VR SESSION
                </button>
            </div>
        </div>
    `;
}

function enterVRMode() {
    // 1. UI Switch
    document.getElementById('content-viewport').classList.add('hidden');
    document.getElementById('vr-viewport').classList.remove('hidden');

    // 2. A-Frame Logic Trigger
    const scene = document.querySelector('a-scene');
    if (scene.enterVR) {
        scene.enterVR(); // Versucht, den Full-Immersive Mode der Brille zu starten
    }

    speak("Stadion Umgebung geladen. xG Analyse aktiv.");
    startVRTelemetryLoop();
}

function exitVRMode() {
    document.getElementById('vr-viewport').classList.add('hidden');
    document.getElementById('content-viewport').classList.remove('hidden');
    stopVRTelemetryLoop();
}

// Physik & Mathe Loop für VR
let vrInterval;
function startVRTelemetryLoop() {
    vrInterval = setInterval(() => {
        // 1. Simuliere xG Werte (In echter App käme das von der Kamera-Position)
        const xG = Math.random().toFixed(2);
        
        // 2. Update VR HUD (Text im 3D Raum)
        const hud = document.getElementById('vr-hud-text');
        if(hud) {
            hud.setAttribute('value', `SYSTEM ONLINE | xG: ${xG}`);
            hud.setAttribute('color', xG > 0.5 ? '#22c55e' : '#ef4444');
        }

        // 3. Update Dashboard Telemetrie (Rechte Sidebar)
        const scanRate = Math.floor(Math.random() * 20 + 75); // 75-95%
        const latency = Math.floor(Math.random() * 50 + 80);  // 80-130ms

        document.getElementById('val-scan').innerText = scanRate + "%";
        document.getElementById('bar-scan').style.width = scanRate + "%";
        
        document.getElementById('val-lat').innerText = latency + "ms";
        // Latenz Balken invertiert (weniger ist besser)
        let latPercent = Math.max(0, 100 - (latency - 50)); 
        document.getElementById('bar-lat').style.width = latPercent + "%";

    }, 800);
}

function stopVRTelemetryLoop() {
    clearInterval(vrInterval);
}

/**
 * --------------------------------------------------------------------------
 * 8. TONI AI PERSONA (Chat Logic)
 * --------------------------------------------------------------------------
 */
function askToni() {
    const input = document.getElementById('toni-input');
    const container = document.getElementById('chat-stream');
    const question = input.value;

    if(!question) return;

    // 1. User Bubble
    container.innerHTML += `
        <div class="msg user">
            <div class="msg-header">COACH</div>
            <div class="msg-body">${question}</div>
        </div>`;
    input.value = "";
    container.scrollTop = container.scrollHeight;

    // 2. Toni "Thinking"
    speak("Moment, ich prüfe die Daten.");

    setTimeout(() => {
        // 3. AI Logic (Keyword Matching)
        let answer = "Das kann ich gerade nicht berechnen, Coach.";
        const q = question.toLowerCase();

        if(q.includes("finanz") || q.includes("geld") || q.includes("budget")) {
            answer = "Unsere Finanzen sehen solide aus. Das Sponsoring deckt die laufenden Kosten, aber für große Transfers im Sommer müssen wir noch Einnahmen generieren.";
        } else if(q.includes("aufstellung") || q.includes("taktik")) {
            answer = "Gegen das 4-4-2 des Gegners empfehle ich Überzahl im Zentrum. Olmo muss zwischen die Ketten.";
        } else if(q.includes("verletzt") || q.includes("status")) {
            answer = "Olmo fällt noch 2 Wochen aus. Xavi macht gute Fortschritte in der Reha.";
        } else {
            const generic = [
                "Hör mal, Coach. Die Daten sind eindeutig: Wir müssen die Intensität hochfahren.",
                "Ich sehe da eine Lücke in der gegnerischen Kette, die wir nutzen können.",
                "Rein statistisch gesehen gewinnen wir 80% der Spiele mit dieser Aufstellung."
            ];
            answer = generic[Math.floor(Math.random() * generic.length)];
        }

        container.innerHTML += `
            <div class="msg ai">
                <div class="msg-header">TONI</div>
                <div class="msg-body">${answer}</div>
            </div>`;
        container.scrollTop = container.scrollHeight;
        speak(answer);

    }, 1500);
}

function activateVoice() {
    alert("Mikrofon-Zugriff wird angefordert... (Browser-Feature)");
}

function speak(text) {
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.rate = 1.05;
        window.speechSynthesis.speak(msg);
    }
}

/**
 * --------------------------------------------------------------------------
 * 9. UTILS & HELPERS
 * --------------------------------------------------------------------------
 */
function startSystemClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock-display').innerText = now.toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
    }, 1000);
}

function toggleLiveMode() {
    const btn = document.getElementById('live-match-btn');
    btn.classList.toggle('active');
    
    if(btn.classList.contains('active')) {
        speak("Matchday Modus aktiviert. Alle Systeme auf Live-Tracking.");
    } else {
        speak("Training Modus wiederhergestellt.");
    }
}

// Event Listener für "Enter" im Passwortfeld
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Fokus auf Passwortfeld beim Start
    document.getElementById('sys-pass').focus();
});
