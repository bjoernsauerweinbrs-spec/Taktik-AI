/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE (V15.5 - ULTIMATE EDITION)
   BLOCK 1 VON 4: SYSTEM CORE & DATENBANK
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. KONFIGURATION & API
// --------------------------------------------------------------------------

let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// --------------------------------------------------------------------------
// 2. ZENTRALER SPEICHER (STATE)
// --------------------------------------------------------------------------

const eliteStore = {
    // KADER (Spieler-Datenbank)
    players: [], 
    
    // PERSONAL (Neu in V15: Mitarbeiter-Stamm)
    staff: [], 

    // KALENDER (Training & Events)
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { 
            id: 1, 
            day: 1, 
            time: "10:00", 
            title: "Laktattest", 
            type: "physio", 
            attendance: [] 
        },
        { 
            id: 2, 
            day: 1, 
            time: "15:00", 
            title: "Team-Training", 
            type: "training", 
            attendance: [] 
        },
        { 
            id: 3, 
            day: 5, 
            time: "15:30", 
            title: "Ligaspiel vs. BVB", 
            type: "match", 
            attendance: [] 
        }
    ],

    // FINANZEN (Erweitert für V15 Office & Bilanz)
    finance: JSON.parse(localStorage.getItem('toni_finance')) || [
        { id: 1, label: "TV-Rechte / Streaming", value: 4500000, type: "income", cat: "pro" },
        { id: 2, label: "Hauptsponsor (Brust)", value: 2500000, type: "income", cat: "pro" },
        { id: 3, label: "Bandenwerbung (Lokal)", value: 12500, type: "income", cat: "amateur" },
        { id: 4, label: "Spielergehälter (Auto)", value: 0, type: "expense", cat: "pro" }, 
        { id: 5, label: "Personal / Staff", value: 0, type: "expense", cat: "pro" },     
        { id: 6, label: "Stadionbetrieb", value: -120000, type: "expense", cat: "pro" }
    ],

    // MEDIENZENTRUM (Gazette Inhalte)
    gazette: {
        headline: "SAISONSTART: ALLES AUF ANGRIFF",
        lead: "Der Vorstand gibt die Marschroute vor.",
        body: "Mit neuen Strukturen und modernster Analysetechnik startet der Verein in die Zukunft..."
    },

    // MANAGEMENT & AI CONTEXT
    mgmt: {
        liquidAssets: 0,
        infrastructure: { medicalLevel: 5, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" },
        aiContext: "" 
    },

    activeModule: 'kader' // Das Start-Modul
};

// --------------------------------------------------------------------------
// 3. SYSTEM BOOT & LOGIN (FIXED)
// --------------------------------------------------------------------------

function systemBootSequence() {
    console.log("TONI 2.0: Boot Sequence Initiated...");
    const passField = document.getElementById('sys-pass');
    
    // Wir akzeptieren alles oder leeres Feld, da wir lokal sind
    const pass = passField ? passField.value : "1234";
    
    // Login-Layer ausblenden
    const auth = document.getElementById('auth-layer');
    if(auth) {
        auth.classList.add('hidden');
        auth.style.display = 'none'; // Zur Sicherheit
    }
        
    // Haupt-Interface einblenden
    const main = document.getElementById('main-interface');
    if(main) {
        main.classList.remove('hidden');
    }
        
    initEliteCore();
}

// Enter-Taste Support für Login
document.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        const auth = document.getElementById('auth-layer');
        if (auth && !auth.classList.contains('hidden')) {
            systemBootSequence();
        }
    }
});

// --------------------------------------------------------------------------
// 4. INITIALISIERUNG & DATEN-CHECK
// --------------------------------------------------------------------------

async function initEliteCore() {
    console.log("TONI 2.0 V15.5: Loading High-End Suite...");
    
    // Uhren & Services starten
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    
    // Daten laden (GitHub oder Backup)
    await syncWithGitHub();
    
    // V15 UPGRADE ROUTINE: Prüft auf alte Daten und aktualisiert sie
    upgradeDatabaseToV15();

    // Wetter & Styles laden
    fetchWeatherData();
    injectLabStyles(); 
    
    // Finanzen initial berechnen
    updateFinanceTotals();
    
    // Start-Modul laden
    loadModule(eliteStore.activeModule);
    
    // Voice Engine bereitmachen
    voiceEngine.init();
}

// 5. DATENBANK MANAGEMENT
function upgradeDatabaseToV15() {
    // 1. Wenn gar keine Spieler da sind: Generiere Standard-Team
    if(eliteStore.players.length === 0) {
        console.log("V15: Database empty. Generating Default Squad...");
        generateDefaultSquad();
    }
    
    // 2. Iteriere durch alle Spieler und füge fehlende CEO-Daten hinzu
    // Dies macht aus "alten" Spielern echte "Profi-Datensätze"
    eliteStore.players.forEach(p => {
        // Gehalt berechnen
        if(!p.salary) {
            const baseSalary = (p.rating || 60) * 2500;
            p.salary = Math.round(baseSalary);
        }
        // Vertragslaufzeit setzen
        if(!p.contract_exp) {
            p.contract_exp = 2026 + Math.floor(Math.random() * 3);
        }
        // Marktwert berechnen
        if(!p.market_value) {
            p.market_value = (p.rating || 60) * 150000;
        }
        // Moral hinzufügen
        if(!p.status.morale) {
            p.status.morale = 70 + Math.floor(Math.random() * 30);
        }
    });

    // 3. Wenn kein Personal da ist: Generiere Standard-Staff
    if(eliteStore.staff.length === 0) {
        eliteStore.staff = [
            { id: 1, role: "Co-Trainer", name: "Hansi M.", salary: 5000, effect: "Taktik +5%" },
            { id: 2, role: "Physio-Head", name: "Dr. Müller", salary: 8000, effect: "Regeneration +10%" },
            { id: 3, role: "Scout", name: "Sven M.", salary: 12000, effect: "Transfers +15%" }
        ];
    }
    
    console.log("V15: Database Upgrade Complete.");
}

function generateDefaultSquad() {
    const positions = ["TW", "IV", "IV", "RV", "LV", "ZDM", "ZM", "ZM", "RF", "LF", "ST", "TW", "IV", "ZM", "OM", "ST"];
    positions.forEach((pos, i) => {
        eliteStore.players.push({
            id: Date.now() + i, name: `Spieler ${i+1}`, position: pos, rating: 75 + (i%10),
            img_url: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
            status: { im_kader: true, im_training: true, morale: 80 },
            fifa_stats: { pac:70, sho:70, pas:70, dri:70, def:70, phy:70 },
            labor_daten: { waage: {gewicht:75}, uhr: {ruhepuls:55} },
            salary: 35000, contract_exp: 2027, market_value: 500000
        });
    });
}

function updateFinanceTotals() {
    // 1. Spielergehälter summieren
    const totalPlayerSalary = eliteStore.players.reduce((acc, p) => acc + (p.salary * 12), 0);
    const salaryItem = eliteStore.finance.find(f => f.label.includes("Spielergehälter"));
    if(salaryItem) salaryItem.value = -totalPlayerSalary;

    // 2. Personal summieren
    const totalStaffSalary = eliteStore.staff.reduce((acc, s) => acc + (s.salary * 12), 0);
    const staffItem = eliteStore.finance.find(f => f.label.includes("Personal"));
    if(staffItem) staffItem.value = -totalStaffSalary;

    // 3. Liquidität berechnen
    const total = eliteStore.finance.reduce((acc, curr) => acc + curr.value, 0);
    eliteStore.mgmt.liquidAssets = total;
    
    // 4. Update UI
    updateKPIs();
    
    // 5. Update AI Context (für Ollama)
    eliteStore.mgmt.aiContext = `SYSTEM: Verein Budget: ${total}€. Kadergröße: ${eliteStore.players.length}.`;
}

async function syncWithGitHub() {
    try {
        const response = await fetch(GITHUB_REPO_URL);
        if (!response.ok) throw new Error("GitHub Offline");
        const data = await response.json();
        if(data.kader_toni && data.kader_toni.length > 0) eliteStore.players = data.kader_toni;
    } catch (error) {
        // Fallback LocalStorage
        const local = localStorage.getItem('toni_players_backup');
        if(local) eliteStore.players = JSON.parse(local);
    }
}
// --- ENDE BLOCK 1 ---
/* ==========================================================================
   BLOCK 2 VON 4: DESIGN ENGINE, ROUTER & V15 MODULE
   ========================================================================== */

// --------------------------------------------------------------------------
// 6. STYLESHEET INJECTION (DESIGN ENGINE)
// --------------------------------------------------------------------------

function injectLabStyles() {
    if (document.getElementById('lab-styles-v15')) return;
    const style = document.createElement('style');
    style.id = 'lab-styles-v15';
    style.innerHTML = `
        /* --- CORE OVERLAY & LAYOUT --- */
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9000; padding: 25px; display: flex; flex-direction: column; backdrop-filter: blur(15px); }
        .lab-grid { display: grid; grid-template-columns: 320px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 25px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .lab-title { font-family: var(--font-hud); color: var(--neon-blue); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 14px; letter-spacing: 2px; }
        
        /* --- V15 CEO DASHBOARD ELEMENTS --- */
        .ceo-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .ceo-card { background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; }
        .ceo-val { font-size: 24px; color: white; font-family: monospace; display: block; margin-top: 5px; }
        .ceo-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        
        .contract-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .contract-table th { text-align: left; color: #64748b; padding: 8px; border-bottom: 1px solid #333; }
        .contract-table td { padding: 8px; border-bottom: 1px solid #1e293b; color: #ccc; }
        
        .action-btn { background: var(--neon-blue); color: black; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; transition: 0.2s; }
        .action-btn:hover { background: white; }
        .action-btn.danger { background: #f43f5e; color: white; }
        
        .audit-alert { background: rgba(244, 63, 94, 0.1); border: 1px solid #f43f5e; color: #f43f5e; padding: 10px; margin-bottom: 5px; border-radius: 6px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
        .audit-success { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 10px; margin-bottom: 5px; border-radius: 6px; font-size: 12px; }

        /* --- V14 BIO LAB ELEMENTS --- */
        .bio-val { background: transparent; border: none; color: white; font-family: var(--font-hud); font-size: 18px; width: 100%; text-align: center; border-bottom: 1px solid #444; }
        .scale-display { background: #000; border: 4px solid #333; border-radius: 10px; padding: 25px; text-align: center; color: var(--neon-main); font-family: monospace; font-size: 36px; margin-bottom: 20px; }
        .bio-input-group { background: rgba(255,255,255,0.04); padding: 12px; border-radius: 6px; margin-bottom: 8px; }
        .bio-label { display: block; font-size: 10px; color: #888; margin-bottom: 5px; }
        .metric-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 5px; align-items: center; }
        
        /* --- NAVIGATION & TABS --- */
        .fin-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .fin-tab { background: transparent; border: 1px solid #333; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
        .fin-tab.active { background: var(--neon-blue); color: black; border-color: var(--neon-blue); font-weight: bold; }
        
        /* --- LEGACY FINANCE TABLE --- */
        .finance-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .finance-table td { padding: 8px; border-bottom: 1px solid #333; color: #ccc; }
        .fin-inp { background: rgba(0,0,0,0.2); border: 1px solid #333; color: white; padding: 4px; width: 100%; font-family: monospace; }
        .val-pos { color: var(--neon-main); } .val-neg { color: var(--neon-alert); }
        
        /* --- TACTICS BOARD --- */
        .tactics-wrapper { display: grid; grid-template-columns: 200px 1fr 200px; gap: 20px; height: 100%; }
        .tactics-sidebar { background: #0a0f1d; padding: 15px; border-radius: 8px; border: 1px solid #333; overflow-y: auto; }
        .tactics-stage { background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/1200px-Soccer_Field_Transparant.svg.png') no-repeat center center; background-size: contain; position: relative; border: 2px solid #444; border-radius: 4px; background-color: #1e3a1e; }
        .tool-btn { background: #1e293b; color: white; border: 1px solid #333; padding: 8px; margin-bottom: 5px; cursor: pointer; text-align: left; font-size: 11px; display: flex; align-items: center; gap: 8px; }
        .draggable-player { padding: 5px; background: rgba(255,255,255,0.05); margin-bottom: 5px; cursor: grab; display: flex; justify-content: space-between; font-size: 11px; border-left: 2px solid #555; }
        
        /* --- MISC --- */
        .gazette-editor { background: white; color: black; padding: 40px; font-family: 'Times New Roman', serif; min-height: 500px; }
        .toggle-btn { background: #333; color: #aaa; border: 1px solid #555; padding: 5px 10px; cursor: pointer; flex: 1; font-size: 10px; }
        .toggle-btn.active { background: var(--neon-main); color: black; border-color: var(--neon-main); }
        .watch-face { width: 100px; height: 100px; border-radius: 50%; background: #111; margin: 0 auto; border: 4px solid #333; display:flex; align-items:center; justify-content:center; flex-direction:column; }
    `;
    document.head.appendChild(style);
}

// --------------------------------------------------------------------------
// 7. MODULE CONTROLLER (ROUTER)
// --------------------------------------------------------------------------

function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    // Reset Viewports
    if(viewport) viewport.classList.remove('hidden');
    if(viewport) viewport.innerHTML = ""; 
    if(vrViewport) vrViewport.classList.add('hidden');
    
    updateKPIs(); 

    // ROUTING
    switch(modId) {
        case 'kader': renderSquadOverview(); break;
        case 'analysis': renderAdvisorHub(); break; // V15: Neural Advisor
        case 'finance': renderOfficeHub(); break;   // V15: Office Prime
        case 'stadionzeitung': renderGazetteCMS(); break;
        case 'drills': renderCalendar(); break;
        case 'tactics': 
            renderTacticBoard(); 
            setTimeout(tacticsCore.init, 100); 
            break;
        case 'vr-hub':
            if(viewport) viewport.classList.add('hidden'); 
            if(vrViewport) vrViewport.classList.remove('hidden'); 
            initVRHub(); 
            break;
    }
}

// --------------------------------------------------------------------------
// 8. NEURAL ADVISOR (V15 Feature: Das Gehirn)
// --------------------------------------------------------------------------

function renderAdvisorHub() {
    const viewport = document.getElementById('content-viewport');
    
    // LIVE-BERECHNUNGEN
    const count = eliteStore.players.length || 1;
    const avgRating = Math.round(eliteStore.players.reduce((a,b)=>a+(b.rating||70),0)/count);
    const totalWage = eliteStore.players.reduce((a,b)=>a+(b.salary||0),0);
    // Effizienz = Rating pro 1000€ Gehalt
    const efficiency = (avgRating / (totalWage/100000 || 1)).toFixed(2); 

    viewport.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2 style="font-family:var(--font-hud); color:white; margin:0;">
                    NEURAL ADVISOR 
                    <span style="font-size:12px; color:var(--neon-blue); margin-left:10px;">// SYSTEM V15.5 ONLINE</span>
                </h2>
                <button class="btn-save" onclick="runNeuralAudit()">
                    <i class="fa-solid fa-brain"></i> LIVE AUDIT STARTEN
                </button>
            </div>
            
            <div class="ceo-grid">
                <div class="ceo-card">
                    <span class="ceo-label">KADER RATING Ø</span>
                    <span class="ceo-val" style="color:var(--neon-main)">${avgRating}</span>
                </div>
                <div class="ceo-card">
                    <span class="ceo-label">EFFIZIENZ-SCORE</span>
                    <span class="ceo-val">${efficiency}</span>
                </div>
                <div class="ceo-card">
                    <span class="ceo-label">GEHALTS-VOLUMEN</span>
                    <span class="ceo-val" style="color:#f43f5e">${(totalWage/1000).toFixed(1)}K € / M</span>
                </div>
            </div>

            <div class="lab-grid" style="flex:1;">
                <div class="lab-panel">
                    <div class="lab-title">STRATEGIE-ASSISTENT (OLLAMA PREVIEW)</div>
                    <div style="font-family:monospace; font-size:11px; color:#64748b; line-height:1.4; padding:10px; background:rgba(0,0,0,0.3); border-radius:4px; margin-bottom:10px;">
                        > CONTEXT LOADED: CLUB_DATA_V15<br>
                        > BUDGET: ${eliteStore.mgmt.liquidAssets} €<br>
                        > SQUAD_SIZE: ${eliteStore.players.length}<br>
                        > STATUS: WAITING FOR INPUT...
                    </div>
                    <div style="margin-top:auto;">
                        <input type="text" class="fin-inp" placeholder="Frage an die Strategie-KI..." id="advisor-prompt">
                        <button class="btn-save" style="width:100%; margin-top:5px;" onclick="askToniStrategy()">SENDEN</button>
                    </div>
                </div>

                <div class="lab-panel" style="grid-column: span 2;">
                    <div class="lab-title">AUDIT PROTOKOLL</div>
                    <div id="audit-results-area" style="overflow-y:auto; max-height:400px;">
                        <div style="text-align:center; color:#555; margin-top:50px;">
                            <i class="fa-solid fa-satellite-dish" style="font-size:40px; margin-bottom:10px;"></i><br>
                            Warte auf Audit-Start...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function runNeuralAudit() {
    const area = document.getElementById('audit-results-area');
    area.innerHTML = `<div style="color:var(--neon-blue); padding:10px;">
        <i class="fa-solid fa-circle-notch fa-spin"></i> Analysiere ${eliteStore.players.length} Datensätze...
    </div>`;
    
    setTimeout(() => {
        let html = "";
        
        // 1. Analyse: Überbezahlte Spieler
        eliteStore.players.forEach(p => {
            if(p.salary > 20000 && p.rating < 78) {
                html += `
                <div class="audit-alert">
                    <span>
                        <i class="fa-solid fa-triangle-exclamation"></i> 
                        <b>${p.name}</b> (Rating: ${p.rating}) verdient ${p.salary.toLocaleString()}€ - <b style="color:red">INEFFIZIENT</b>
                    </span> 
                    <button class="action-btn danger">VERKAUFEN</button>
                </div>`;
            }
        });

        // 2. Analyse: Auslaufende Verträge
        eliteStore.players.forEach(p => {
            if(p.contract_exp <= 2026) {
                html += `
                <div class="audit-alert" style="border-color:orange; color:orange;">
                    <span>
                        <i class="fa-solid fa-clock"></i> 
                        Vertrag von <b>${p.name}</b> läuft 2026 aus.
                    </span> 
                    <button class="action-btn">VERLÄNGERN</button>
                </div>`;
            }
        });
        
        // Wenn alles okay ist
        if(html === "") html = `
            <div class="audit-success">
                <i class="fa-solid fa-check"></i> Keine kritischen Probleme gefunden. Der Laden läuft stabil.
            </div>`;
        
        area.innerHTML = html;
        voiceEngine.speak("Audit abgeschlossen. Bericht liegt vor.");
    }, 1200);
}

function askToniStrategy() {
    const p = document.getElementById('advisor-prompt').value;
    if(!p) return;
    voiceEngine.speak("Verarbeite Strategie-Anfrage: " + p);
    document.getElementById('advisor-prompt').value = "";
    // Hier würde später der echte API Call stehen
}

// --------------------------------------------------------------------------
// 9. OFFICE PRIME (V15 Feature: Verträge & Personal)
// --------------------------------------------------------------------------

function renderOfficeHub() {
    const viewport = document.getElementById('content-viewport');
    
    // Generiere Vertrags-Tabelle aus den Spielerdaten
    const playerRows = eliteStore.players.map(p => `
        <tr>
            <td style="font-weight:bold;">${p.name}</td>
            <td>${p.contract_exp || 2026}</td>
            <td>${(p.salary||0).toLocaleString()} €</td>
            <td>${(p.market_value||0).toLocaleString()} €</td>
            <td>
                <div style="width:50px; height:4px; background:#333; border-radius:2px;">
                    <div style="width:${p.status.morale||50}%; height:100%; background:${(p.status.morale||50)>50?'var(--neon-main)':'red'}"></div>
                </div>
            </td>
            <td><button class="action-btn" onclick="negotiate(${p.id})">EDIT</button></td>
        </tr>
    `).join('');

    viewport.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column;">
            <div class="fin-tabs">
                <button class="fin-tab active" onclick="switchOfficeTab('contracts')">VERTRÄGE & KADER</button>
                <button class="fin-tab" onclick="switchOfficeTab('staff')">PERSONAL & STAFF</button>
                <button class="fin-tab" onclick="switchOfficeTab('finance')">BILANZ (LEGACY)</button>
            </div>
            
            <div id="office-content" style="flex:1; overflow-y:auto; padding-right:5px;">
                <div class="lab-panel">
                    <div class="lab-title">VERTRAGSMATRIX (PROFI-KADER)</div>
                    <table class="contract-table">
                        <thead>
                            <tr>
                                <th>Spieler</th>
                                <th>Laufzeit</th>
                                <th>Gehalt/M</th>
                                <th>Marktwert</th>
                                <th>Moral</th>
                                <th>Aktion</th>
                            </tr>
                        </thead>
                        <tbody>${playerRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function switchOfficeTab(tab) {
    const container = document.getElementById('office-content');
    if(tab === 'contracts') renderOfficeHub(); // Reload default
    
    if(tab === 'staff') {
        const staffRows = eliteStore.staff.map(s => `
            <tr>
                <td><b>${s.role}</b></td>
                <td>${s.name}</td>
                <td>${s.salary.toLocaleString()} €</td>
                <td style="color:var(--neon-blue)">${s.effect}</td>
                <td><button class="action-btn danger">FEUERN</button></td>
            </tr>
        `).join('');
        
        container.innerHTML = `
            <div class="lab-panel">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <div class="lab-title">PERSONALSTAMM</div>
                    <button class="btn-save" onclick="alert('Headhunter beauftragt...')">+ MITARBEITER</button>
                </div>
                <table class="contract-table">
                    <thead><tr><th>Rolle</th><th>Name</th><th>Gehalt</th><th>Effekt</th><th></th></tr></thead>
                    <tbody>${staffRows}</tbody>
                </table>
            </div>`;
    }

    if(tab === 'finance') {
        // Alte Ansicht für manuelle Eingaben
        let rows = eliteStore.finance.map((item, idx) => `
            <tr>
                <td>${item.label}</td>
                <td>${item.value.toLocaleString()} €</td>
            </tr>`).join('');
        container.innerHTML = `
            <div class="lab-panel">
                <div class="lab-title">BILANZ-ÜBERSICHT</div>
                <table class="finance-table"><tbody>${rows}</tbody></table>
            </div>`;
    }
}

function negotiate(id) {
    const p = eliteStore.players.find(x=>x.id===id);
    const demand = Math.round(p.salary * 1.15);
    alert(`Verhandlung mit ${p.name} gestartet.\n\nBerater fordert: ${demand} € (+15%)\nAktuell: ${p.salary} €`);
}
// --- ENDE BLOCK 2 ---
/* ==========================================================================
   BLOCK 3 VON 4: TACTICS ENGINE & BIO LAB
   ========================================================================== */

// --------------------------------------------------------------------------
// 10. TACTICS BOARD PRO (Canvas Logic)
// --------------------------------------------------------------------------

const tacticsCore = {
    canvas: null, 
    ctx: null, 
    mode: 'move',       // 'move' oder 'draw'
    tacticMode: 'match', // 'match' oder 'training'
    elements: [],       // Alle Objekte auf dem Feld
    
    // Initialisierung des Canvas
    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        const stage = document.querySelector('.tactics-stage');
        
        // Canvas Größe an Container anpassen
        this.canvas.width = stage.clientWidth;
        this.canvas.height = stage.clientHeight;
        
        // Event Listener für Maus-Interaktion
        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        
        // Standard-Modus laden
        this.loadMatchMode(); 
    },

    // Umschalten zwischen Match (11vs11) und Training
    setTacticMode: function(mode) {
        this.tacticMode = mode;
        this.elements = []; // Board leeren
        
        // UI Buttons aktualisieren
        document.getElementById('mode-match-btn').classList.toggle('active', mode === 'match');
        document.getElementById('mode-training-btn').classList.toggle('active', mode === 'training');
        
        if (mode === 'match') {
            this.loadMatchMode();
        } else {
            this.loadTrainingMode();
        }
    },

    loadMatchMode: function() {
        // 1. Lade Startelf (Rot) - Die ersten 11 Spieler
        const starters = eliteStore.players.slice(0, 11); 
        this.applyFormation(starters, '4-4-2', 'player');
        
        // 2. Lade Gegner (Blau) - Dummy Daten
        const opponents = Array(11).fill(0).map((_, i) => ({name: `Gegner ${i+1}`, id: 9000+i}));
        this.applyFormation(opponents, '4-4-2', 'opponent');
        
        this.renderLoop();
    },

    loadTrainingMode: function() {
        // Lade nur eigenes Team
        const starters = eliteStore.players.slice(0, 11);
        this.applyFormation(starters, 'training', 'player');
        
        // Füge Trainingsmaterial hinzu (Ball)
        this.elements.push({
            type: 'ball', 
            x: this.canvas.width / 2, 
            y: this.canvas.height / 2, 
            radius: 6
        });
        
        this.renderLoop();
    },

    applyFormation: function(squad, formation, type) {
        const color = type === 'player' ? '#ef4444' : '#3b82f6';
        // Positionierung: Wir unten (400), Gegner oben (100)
        const startY = type === 'player' ? 400 : 100;
        
        squad.forEach((p, i) => {
            // Einfache Grid-Berechnung für 4er Reihen
            let x = 100 + (i % 4) * 150; 
            let y = startY + Math.floor(i / 4) * 60;
            
            // Zufallsverteilung im Training
            if(formation === 'training') {
                x = 50 + Math.random() * (this.canvas.width - 100);
                y = 50 + Math.random() * (this.canvas.height - 100);
            }
            
            this.elements.push({
                type: type, 
                id: p.id, 
                label: type==='player' ? p.position : 'G', 
                name: p.name, 
                x: x, 
                y: y, 
                color: color, 
                radius: 14, 
                isDragging: false
            });
        });
    },

    setMode: function(m) { 
        this.mode = m; 
    },
    
    // Maus Start
    startAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        
        // Prüfen ob ein Element getroffen wurde
        this.elements.forEach(el => {
            const dist = Math.hypot(x - el.x, y - el.y);
            if(dist < el.radius + 5) {
                el.isDragging = true;
            }
        });
    },
    
    // Maus Bewegung
    moveAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        
        this.elements.forEach(el => { 
            if(el.isDragging) { 
                el.x = x; 
                el.y = y; 
            } 
        });
        
        this.renderLoop(); // Neu zeichnen bei Bewegung
    },
    
    // Maus Ende
    endAction: function() { 
        this.elements.forEach(el => el.isDragging = false); 
    },
    
    // Zeichenschleife (Rendering)
    renderLoop: function() {
        if(!this.ctx) return;
        
        // 1. Alles löschen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2. Alle Elemente zeichnen
        this.elements.forEach(el => {
            if(el.type === 'ball') {
                // Ball zeichnen
                this.ctx.beginPath(); 
                this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI*2); 
                this.ctx.fillStyle = 'white'; 
                this.ctx.fill(); 
                this.ctx.strokeStyle = 'black'; 
                this.ctx.stroke();
            } else {
                // Spieler Kreis
                this.ctx.beginPath(); 
                this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI*2); 
                this.ctx.fillStyle = el.color; 
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff'; 
                this.ctx.lineWidth = 2; 
                this.ctx.stroke();
                
                // Position (Text im Kreis)
                this.ctx.fillStyle = 'white'; 
                this.ctx.font = 'bold 10px Arial'; 
                this.ctx.textAlign = 'center'; 
                this.ctx.textBaseline = 'middle'; 
                this.ctx.fillText(el.label, el.x, el.y);
                
                // Name (Text unter Kreis)
                this.ctx.fillStyle = '#ddd'; 
                this.ctx.font = '9px Arial'; 
                this.ctx.fillText(el.name, el.x, el.y + 22);
            }
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    
    // Ersatzbank generieren (Spieler ab Index 11)
    const bench = eliteStore.players.length > 11 ? eliteStore.players.slice(11) : [];
    const benchHtml = bench.map(p => `
        <div class="draggable-player">
            <span><b>${p.position}</b> ${p.name}</span>
        </div>
    `).join('');

    viewport.innerHTML = `
        <div class="tactics-wrapper">
            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">MODUS</h3>
                <div class="fin-tabs" style="display:block; border:none; margin-bottom:10px;">
                    <button class="fin-tab active" id="mode-match-btn" style="width:100%; margin-bottom:5px;" onclick="tacticsCore.setTacticMode('match')">MATCH (11vs11)</button>
                    <button class="fin-tab" id="mode-training-btn" style="width:100%;" onclick="tacticsCore.setTacticMode('training')">TRAINING</button>
                </div>
                
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px; margin-top:20px;">WERKZEUGE</h3>
                <div class="tool-btn" onclick="tacticsCore.setMode('move')">
                    <i class="fa-solid fa-arrows-up-down-left-right"></i> BEWEGEN
                </div>
                <div class="tool-btn" onclick="tacticsCore.setMode('draw')">
                    <i class="fa-solid fa-pen"></i> ZEICHNEN
                </div>
            </aside>

            <div class="tactics-stage">
                <canvas id="tactics-canvas"></canvas>
            </div>

            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">ERSATZBANK (${bench.length})</h3>
                <div style="margin-top:10px;">${benchHtml}</div>
                
                <hr style="border-color:#333; margin:15px 0;">
                
                <div class="analysis-sheet">
                    <h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px;">MATCHPLAN NOTIZEN</h3>
                    <textarea style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;"></textarea>
                </div>
            </aside>
        </div>`;
}

// --------------------------------------------------------------------------
// 11. BIO LAB & STANDARD MODULE (KADER)
// --------------------------------------------------------------------------

function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    let html = `
        <div style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <h2 style="font-family:var(--font-hud); color:white;">ELITE KADER</h2>
            <button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER</button>
        </div>
        <div class="kader-grid">
    `;
    
    eliteStore.players.forEach(p => {
        const op = p.status.im_training ? 1 : 0.5;
        const borderCol = p.status.im_kader ? "var(--neon-main)" : "#444";
        
        html += `
        <div class="fifa-card" style="opacity:${op}; border-color:${borderCol};" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-rating">${p.rating}</div>
                    <img src="${p.img_url}" class="player-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
                    <div class="card-info">
                        <div class="card-name">${p.name}</div>
                        <div class="card-pos">${p.position}</div>
                        <div style="text-align:center; font-size:10px; margin-top:5px; color:var(--neon-blue);">LABOR ÖFFNEN</div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    
    viewport.innerHTML = html + `</div>`;
}

// Berechnet Gesamtrating aus Einzelwerten
function calculateFifaRating(s) { 
    return Math.round(( (s.pac||0)+(s.sho||0)+(s.pas||0)+(s.dri||0)+(s.def||0)+(s.phy||0) )/6); 
}

// Das detaillierte Spieler-Overlay (Herzstück der Datenpflege)
function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    
    // Neuer Spieler Template
    if(!p && id === -1) {
        p = {
            id:Date.now(), name:"Neu", position:"ZM", rating:60,
            salary:2000, contract_exp:2026, market_value:50000,
            status:{im_kader:true, im_training:true, morale:80},
            fifa_stats:{pac:60, sho:60, pas:60, dri:60, def:60, phy:60},
            labor_daten:{waage:{gewicht:75}, uhr:{ruhepuls:60}}
        };
    }
    
    const s = p.fifa_stats; 
    const l = p.labor_daten;
    
    // Sicherheits-Check für V15 Daten
    if(!p.salary) p.salary = 2500;
    
    const ov = document.createElement('div'); 
    ov.className = 'lab-overlay'; 
    ov.id = 'active-bio-lab';
    
    ov.innerHTML = `
    <div style="display:flex; justify-content:space-between; padding-bottom:15px; border-bottom:1px solid #333;">
        <h1 style="font-family:var(--font-hud); color:white;">${p.name.toUpperCase()}</h1>
        <button class="btn-cancel" onclick="document.getElementById('active-bio-lab').remove(); loadModule('kader');">X</button>
    </div>
    
    <div class="lab-grid">
        <div class="lab-panel">
            <div class="lab-title">STATS & IDENTITÄT</div>
            <input class="bio-val" value="${p.name}" onchange="updateP(${p.id},'name',this.value)">
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-top:10px;">
                <span class="bio-label">PAC</span><input type="number" class="bio-val" value="${s.pac}" onchange="updateStat(${p.id},'pac',this.value)">
                <span class="bio-label">SHO</span><input type="number" class="bio-val" value="${s.sho}" onchange="updateStat(${p.id},'sho',this.value)">
                <span class="bio-label">PAS</span><input type="number" class="bio-val" value="${s.pas}" onchange="updateStat(${p.id},'pas',this.value)">
                <span class="bio-label">DRI</span><input type="number" class="bio-val" value="${s.dri}" onchange="updateStat(${p.id},'dri',this.value)">
                <span class="bio-label">DEF</span><input type="number" class="bio-val" value="${s.def}" onchange="updateStat(${p.id},'def',this.value)">
                <span class="bio-label">PHY</span><input type="number" class="bio-val" value="${s.phy}" onchange="updateStat(${p.id},'phy',this.value)">
            </div>
        </div>
        
        <div class="lab-panel">
            <div class="lab-title">BODY LAB</div>
            <span class="bio-label">GEWICHT (KG)</span>
            <input type="number" class="bio-val" value="${l.waage.gewicht}" onchange="updateLab(${p.id},'waage','gewicht',this.value)">
            
            <div style="margin-top:20px; text-align:center;">
                <div class="scale-display">${l.waage.gewicht}</div>
            </div>
        </div>
        
        <div class="lab-panel">
            <div class="lab-title">VERTRAG (OFFICE LINK)</div>
            
            <span class="bio-label">MONATSGEHALT (€)</span>
            <input type="number" class="bio-val" value="${p.salary}" onchange="updateP(${p.id},'salary',this.value)">
            
            <span class="bio-label" style="margin-top:10px;">LAUFZEIT (JAHR)</span>
            <input type="number" class="bio-val" value="${p.contract_exp||2026}" onchange="updateP(${p.id},'contract_exp',this.value)">
            
            <span class="bio-label" style="margin-top:10px;">MARKTWERT (€)</span>
            <input type="number" class="bio-val" value="${p.market_value||0}" onchange="updateP(${p.id},'market_value',this.value)">
        </div>
    </div>`;
    
    document.body.appendChild(ov);
}
// --- ENDE BLOCK 3 ---
/* ==========================================================================
   BLOCK 4 VON 4: HELPER, SERVICES & SYSTEM FINALIZATION
   ========================================================================== */

// --------------------------------------------------------------------------
// 12. DATA UPDATE HELPER (Die Logik hinter den Eingabefeldern)
// --------------------------------------------------------------------------

// Aktualisiert Top-Level Eigenschaften (Name, Gehalt, etc.)
function updateP(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) {
        // Unterscheidung Text oder Zahl
        if(key === 'name') {
            p[key] = val;
        } else {
            p[key] = parseInt(val);
        }
        
        // V15 SPECIAL: Wenn Gehalt geändert wird, sofort Finanzen neu berechnen
        if(key === 'salary') {
            updateFinanceTotals();
        }
    }
}

// Aktualisiert FIFA Stats (PAC, SHO, etc.) & berechnet Rating neu
function updateStat(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) {
        p.fifa_stats[key] = parseInt(val);
        // Automatisches Rating-Update
        p.rating = calculateFifaRating(p.fifa_stats);
        
        // GUI Update falls Overlay offen
        const labRatingDisp = document.querySelector('#active-bio-lab .card-rating');
        if(labRatingDisp) labRatingDisp.innerText = p.rating;
    }
}

// Aktualisiert Labor Daten (Verschachteltes Objekt)
function updateLab(id, device, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p && p.labor_daten[device]) {
        p.labor_daten[device][key] = parseFloat(val);
    }
}

// --------------------------------------------------------------------------
// 13. STANDARD MODULE (GAZETTE, KALENDER, WETTER, VR)
// --------------------------------------------------------------------------

function renderGazetteCMS() { 
    document.getElementById('content-viewport').innerHTML = `
        <div class="gazette-editor">
            <h1 style="border-bottom: 2px solid black;">ELITE GAZETTE V15</h1>
            <p>Die Redaktion arbeitet an neuen Inhalten...</p>
            <textarea style="width:100%; height:300px; border:none; outline:none; font-family:'Times New Roman'; font-size:18px;">${eliteStore.gazette.body}</textarea>
        </div>
    `; 
}

function renderCalendar() { 
    const v = document.getElementById('content-viewport'); 
    v.innerHTML = `
        <div class="cal-grid">
            <div class="cal-header">
                <h2 style="font-family:var(--font-hud);">WOCHENPLANUNG</h2>
            </div>
            <div style="padding:20px; color:#ccc;">
                Work in Progress: Drag & Drop Trainingseinheiten kommen im nächsten Update.
            </div>
        </div>
    `; 
}

// Aktualisiert die Anzeige oben rechts (Budget & Wetter)
function updateKPIs() { 
    const el = document.getElementById('kpi-budget'); 
    if(el) {
        el.innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; 
    }
    
    const w = document.getElementById('weather-header-widget'); 
    if(w) {
        w.innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ${eliteStore.mgmt.liveData.temp}°C`;
    }
}

// Holt echtes Wetter (Open-Meteo API)
async function fetchWeatherData() { 
    try {
        // Koordinaten für Deutschland (Zentral)
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8&longitude=9.4&current_weather=true");
        const d = await r.json();
        
        eliteStore.mgmt.liveData.temp = d.current_weather.temperature;
        eliteStore.mgmt.liveData.condition = "Live";
        eliteStore.mgmt.liveData.wind = d.current_weather.windspeed;
        
        updateKPIs();
    } catch(e) {
        console.warn("Wetter-Dienst nicht erreichbar.");
    } 
}

// VR Modus Platzhalter
function initVRHub() { 
    document.getElementById('match-simulation-layer').innerHTML = '<a-text value="VR MODE ACTIVE" position="-1 1.6 -3" color="white"></a-text>'; 
}

// Prüft ob API Key da ist
function checkAIConnection() { 
    const el = document.getElementById('ai-status-text');
    if(el) {
        el.innerText = USER_API_KEY ? "AI: ONLINE" : "AI: OFFLINE"; 
    }
}

// --------------------------------------------------------------------------
// 14. VOICE ENGINE (Sprachsteuerung)
// --------------------------------------------------------------------------

const voiceEngine = { 
    init: () => { 
        // Browser Kompatibilität prüfen
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
        
        if(window.SpeechRecognition) {
            const r = new SpeechRecognition();
            r.lang = 'de-DE';
            
            // Wenn Sprache erkannt wurde
            r.onresult = (e) => {
                const text = e.results[e.results.length-1][0].transcript;
                console.log("Voice Command:", text);
                
                // Leite an Strategie-KI weiter
                const prompt = document.getElementById('advisor-prompt');
                if(prompt) {
                    prompt.value = text;
                    askToniStrategy();
                }
            };
            // r.start(); // Auto-Start deaktiviert für Performance
        }
    }, 
    
    // Text-to-Speech (Toni spricht)
    speak: (t) => { 
        const u = new SpeechSynthesisUtterance(t);
        u.lang = 'de-DE';
        window.speechSynthesis.speak(u); 
    } 
};

// --------------------------------------------------------------------------
// 15. SYSTEM CLOCK & UTILS
// --------------------------------------------------------------------------

function updateClock() { 
    const el = document.getElementById('clock-display');
    if(el) {
        el.innerText = new Date().toLocaleTimeString('de-DE'); 
    }
}

function closeModal(id) { 
    document.getElementById(id).classList.add('hidden'); 
}

function openSysConfig() { 
    document.getElementById('modal-sys-config').classList.remove('hidden'); 
}

function saveSystemConfig() { 
    const k = document.getElementById('input-api-key').value; 
    localStorage.setItem('toni_api_key', k); 
    USER_API_KEY = k; 
    closeModal('modal-sys-config');
    checkAIConnection();
}

// FINAL SYSTEM LOG
console.log("TONI 2.0 V15.5: ALL SYSTEMS GREEN. READY.");
/* END OF FILE */
