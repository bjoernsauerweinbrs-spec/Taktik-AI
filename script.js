/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V15.0 - CEO & AI ARCHITECTURE)
   ========================================================================== */

// 1. KONFIGURATION & DATENBANK
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// ZENTRALER STATE (ERWEITERT FÜR V15)
const eliteStore = {
    players: [], 
    staff: [], // Neu in V15: Mitarbeiter
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { id: 1, day: 1, time: "10:00", title: "Laktattest", type: "physio", attendance: [] },
        { id: 2, day: 1, time: "15:00", title: "Team-Training", type: "training", attendance: [] },
        { id: 3, day: 5, time: "15:30", title: "Ligaspiel vs. BVB", type: "match", attendance: [] }
    ],
    finance: JSON.parse(localStorage.getItem('toni_finance')) || [
        { id: 1, label: "TV-Rechte / Streaming", value: 4500000, type: "income", cat: "pro" },
        { id: 2, label: "Hauptsponsor (Brust)", value: 2500000, type: "income", cat: "pro" },
        { id: 3, label: "Bandenwerbung (Lokal)", value: 12500, type: "income", cat: "amateur" },
        { id: 4, label: "Catering / Wurstverkauf", value: 3200, type: "income", cat: "amateur" },
        { id: 5, label: "Mitgliedsbeiträge", value: 45000, type: "income", cat: "amateur" },
        { id: 6, label: "Spielergehälter (Kader)", value: 0, type: "expense", cat: "pro" }, // Wird dynamisch berechnet!
        { id: 7, label: "Stadionmiete / Pacht", value: -120000, type: "expense", cat: "pro" },
        { id: 8, label: "Personal (Staff)", value: 0, type: "expense", cat: "pro" } // Neu
    ],
    gazette: {
        headline: "SAISONSTART: ALLES AUF ANGRIFF",
        lead: "Der Vorstand gibt die Marschroute vor.",
        body: "Mit neuen Strukturen und modernster Analysetechnik startet der Verein in die Zukunft..."
    },
    mgmt: {
        liquidAssets: 0,
        infrastructure: { medicalLevel: 5, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" },
        aiContext: "" // Speicher für den Ollama-Prompt
    },
    activeModule: 'kader'
};

/* ==========================================================================
   2. SYSTEM BOOT & NETWORK
   ========================================================================== */

function systemBootSequence() {
    const pass = document.getElementById('sys-pass').value;
    if (pass === "1234") { 
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initEliteCore();
    } else {
        alert("ACCESS DENIED: SECURITY PROTOCOL ACTIVE");
    }
}

async function initEliteCore() {
    console.log("TONI 2.0 V15.0: Initializing Neural CEO Engine...");
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    
    // Versuch GitHub Sync, sonst Local
    await syncWithGitHub(); 

    // V15 RESET: Wir brauchen saubere Daten für das CEO-Modul
    if (eliteStore.players.length === 0 || !eliteStore.players[0].salary) {
        console.log("V15: Upgrade Database structure...");
        generateLuxurySquad();
        generateDefaultStaff();
    }

    fetchWeatherData();
    injectLabStyles();
    updateFinanceTotals(); // Berechnet Gehälter neu
    loadModule(eliteStore.activeModule);
    voiceEngine.init();
}

// V15: LUXURY SQUAD GENERATOR (Mit Gehalt & Vertrag)
function generateLuxurySquad() {
    eliteStore.players = [];
    const positions = ["TW", "IV", "IV", "RV", "LV", "ZDM", "ZM", "ZM", "RF", "LF", "ST", "TW", "IV", "ZM", "OM", "ST"];
    positions.forEach((pos, i) => {
        const rating = 75 + Math.floor(Math.random() * 15);
        const marketVal = rating * 150000;
        const salary = Math.round(rating * 2500); // Gehalt basierend auf Rating
        
        eliteStore.players.push({
            id: Date.now() + i, 
            name: `Profi ${i+1}`, 
            position: pos, 
            rating: rating,
            salary: salary,
            contract_exp: 2026 + Math.floor(Math.random() * 3), // Laufzeit bis 2026-2028
            market_value: marketVal,
            img_url: "https://cdn-icons-png.flaticon.com/512/21/21104.png",
            status: { im_kader: true, im_training: true, morale: 80 + Math.floor(Math.random()*20) },
            fifa_stats: { pac:70, sho:70, pas:70, dri:70, def:70, phy:70 },
            labor_daten: { waage: {gewicht:75}, uhr: {ruhepuls:55} }
        });
    });
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
}

function generateDefaultStaff() {
    eliteStore.staff = [
        { id: 1, role: "Co-Trainer", name: "Hansi M.", salary: 5000, effect: "Taktik +5%" },
        { id: 2, role: "Physio-Head", name: "Dr. Müller", salary: 8000, effect: "Regeneration +10%" }
    ];
}

function updateFinanceTotals() {
    // 1. Summiere Spielergehälter
    const totalPlayerSalary = eliteStore.players.reduce((acc, p) => acc + (p.salary * 12), 0);
    const salaryItem = eliteStore.finance.find(f => f.label.includes("Spielergehälter"));
    if(salaryItem) salaryItem.value = -totalPlayerSalary;

    // 2. Summiere Staff
    const totalStaffSalary = eliteStore.staff.reduce((acc, s) => acc + (s.salary * 12), 0);
    const staffItem = eliteStore.finance.find(f => f.label.includes("Personal"));
    if(staffItem) staffItem.value = -totalStaffSalary;

    // 3. Gesamtbudget berechnen
    const total = eliteStore.finance.reduce((acc, curr) => acc + curr.value, 0);
    eliteStore.mgmt.liquidAssets = total;
    updateKPIs();
    
    // V15: Update AI Context
    eliteStore.mgmt.aiContext = `SYSTEM: Verein Budget: ${total}€. Kadergröße: ${eliteStore.players.length}. Saisonziel: Aufstieg.`;
}

// STYLES: LUXURY & HIGH-TECH
function injectLabStyles() {
    if (document.getElementById('lab-styles-v15')) return;
    const style = document.createElement('style');
    style.id = 'lab-styles-v15';
    style.innerHTML = `
        /* CORE */
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9000; padding: 25px; display: flex; flex-direction: column; backdrop-filter: blur(15px); }
        .lab-grid { display: grid; grid-template-columns: 320px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 25px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .lab-title { font-family: var(--font-hud); color: var(--neon-blue); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 14px; letter-spacing: 2px; }
        
        /* V15 CEO UI */
        .ceo-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .ceo-card { background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; padding: 20px; border-radius: 12px; text-align: center; }
        .ceo-val { font-size: 24px; color: white; font-family: monospace; display: block; margin-top: 5px; }
        .ceo-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
        .audit-alert { background: rgba(244, 63, 94, 0.1); border: 1px solid #f43f5e; color: #f43f5e; padding: 10px; margin-bottom: 5px; border-radius: 6px; font-size: 12px; display: flex; justify-content: space-between; align-items: center; }
        .audit-ok { background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; padding: 10px; margin-bottom: 5px; border-radius: 6px; font-size: 12px; }
        .contract-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .contract-table th { text-align: left; color: #64748b; padding: 8px; border-bottom: 1px solid #333; }
        .contract-table td { padding: 8px; border-bottom: 1px solid #1e293b; color: #ccc; }
        .action-btn { background: var(--neon-blue); color: black; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold; }
        .action-btn:hover { background: white; }
        .action-btn.danger { background: #f43f5e; color: white; }

        /* TACTICS PRO (V14) */
        .tactics-wrapper { display: grid; grid-template-columns: 200px 1fr 200px; gap: 20px; height: 100%; }
        .tactics-sidebar { background: #0a0f1d; padding: 15px; border-radius: 8px; border: 1px solid #333; overflow-y: auto; }
        .tactics-stage { background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/1200px-Soccer_Field_Transparant.svg.png') no-repeat center center; background-size: contain; position: relative; border: 2px solid #444; border-radius: 4px; background-color: #1e3a1e; }
        .tool-btn { background: #1e293b; color: white; border: 1px solid #333; padding: 8px; margin-bottom: 5px; cursor: pointer; text-align: left; font-size: 11px; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .tool-btn:hover, .tool-btn.active { background: var(--neon-main); color: black; border-color: var(--neon-main); font-weight: bold; }
        .draggable-player { padding: 5px; background: rgba(255,255,255,0.05); margin-bottom: 5px; cursor: grab; display: flex; justify-content: space-between; font-size: 11px; border-left: 2px solid #555; }
        .draggable-player:hover { border-left-color: var(--neon-main); background: rgba(255,255,255,0.1); }
        
        /* SHARED & OLDER */
        .fin-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .fin-tab { background: transparent; border: 1px solid #333; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-family: var(--font-hud); transition: 0.3s; }
        .fin-tab.active { background: var(--neon-blue); color: black; border-color: var(--neon-blue); font-weight: bold; }
        .finance-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .finance-table td, .finance-table th { padding: 8px; border-bottom: 1px solid #333; color: #ccc; }
        .fin-inp { background: rgba(0,0,0,0.2); border: 1px solid #333; color: white; padding: 4px; width: 100%; font-family: monospace; }
        .val-pos { color: var(--neon-main); } .val-neg { color: var(--neon-alert); }
        .bio-val { background: transparent; border: none; color: white; border-bottom: 1px solid #444; width: 100%; text-align: center; }
        .scale-display { font-size: 36px; color: var(--neon-main); text-align: center; font-family: monospace; border: 2px solid #333; padding: 10px; margin-bottom: 10px; }
        .watch-face { width: 100px; height: 100px; border-radius: 50%; background: #111; margin: 0 auto; border: 4px solid #333; display:flex; align-items:center; justify-content:center; flex-direction:column; }
        .gazette-editor { background: white; color: black; padding: 40px; font-family: 'Times New Roman', serif; min-height: 500px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
    `;
    document.head.appendChild(style);
}

/* ==========================================================================
   3. MODULE CONTROLLER
   ========================================================================== */

function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    viewport.classList.remove('hidden');
    viewport.innerHTML = ""; 
    vrViewport.classList.add('hidden');
    
    updateKPIs(); 

    if(modId === 'kader') renderSquadOverview(); 
    if(modId === 'analysis') renderAdvisorHub(); // V15: UPGRADE (Berater)
    if(modId === 'finance') renderOfficeHub();   // V15: UPGRADE (Office/Finanz)
    if(modId === 'stadionzeitung') renderGazetteCMS(); 
    if(modId === 'drills') renderCalendar(); 
    
    if(modId === 'tactics') { 
        renderTacticBoard(); 
        setTimeout(tacticsCore.init, 100); 
    }

    if(modId === 'vr-hub') { 
        viewport.classList.add('hidden'); 
        vrViewport.classList.remove('hidden'); 
        initVRHub(); 
    }
}

/* ==========================================================================
   4. V15: NEURAL ADVISOR (BERATER & INTELLIGENZ)
   ========================================================================== */

function renderAdvisorHub() {
    const viewport = document.getElementById('content-viewport');
    
    // Berechne Metriken
    const avgRating = Math.round(eliteStore.players.reduce((a,b)=>a+b.rating,0)/eliteStore.players.length);
    const totalWage = eliteStore.players.reduce((a,b)=>a+b.salary,0);
    const efficiency = Math.round(avgRating / (totalWage/100000)); 

    viewport.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2 style="font-family:var(--font-hud); color:white; margin:0;">NEURAL ADVISOR <span style="font-size:12px; color:var(--neon-blue);">// AI CONNECTED</span></h2>
                <button class="btn-save" onclick="runNeuralAudit()"><i class="fa-solid fa-brain"></i> LIVE AUDIT STARTEN</button>
            </div>
            
            <div class="ceo-grid">
                <div class="ceo-card"><span class="ceo-label">KADER RATING Ø</span><span class="ceo-val" style="color:var(--neon-main)">${avgRating}</span></div>
                <div class="ceo-card"><span class="ceo-label">EFFIZIENZ-SCORE</span><span class="ceo-val">${efficiency}</span></div>
                <div class="ceo-card"><span class="ceo-label">GEHALTS-VOLUMEN</span><span class="ceo-val" style="color:#f43f5e">${(totalWage/1000).toFixed(1)}K / M</span></div>
            </div>

            <div class="lab-grid" style="flex:1;">
                <div class="lab-panel">
                    <div class="lab-title">SYSTEM PROMPT (OLLAMA PREVIEW)</div>
                    <div style="font-family:monospace; font-size:11px; color:#64748b; line-height:1.4; padding:10px; background:rgba(0,0,0,0.3); border-radius:4px;">
                        > CONTEXT LOADED: CLUB_DATA<br>
                        > BUDGET: ${eliteStore.mgmt.liquidAssets}<br>
                        > SQUAD_SIZE: ${eliteStore.players.length}<br>
                        > STRATEGY: "AGGRESSIVE GROWTH"<br>
                        > WAITING FOR USER QUERY...
                    </div>
                    <div style="margin-top:auto;">
                        <input type="text" class="fin-inp" placeholder="Frage an die Strategie-KI..." id="advisor-prompt">
                        <button class="btn-save" style="width:100%; margin-top:5px;" onclick="askToniStrategy()">SENDEN</button>
                    </div>
                </div>

                <div class="lab-panel" style="grid-column: span 2;">
                    <div class="lab-title">AUDIT PROTOKOLL</div>
                    <div id="audit-results-area">
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
    area.innerHTML = `<div style="color:var(--neon-blue);">Analysiere ${eliteStore.players.length} Datensätze...</div>`;
    
    setTimeout(() => {
        let html = "";
        // 1. Checke überbezahlte Spieler
        eliteStore.players.forEach(p => {
            if(p.salary > 6000 && p.rating < 80) {
                html += `<div class="audit-alert"><span><b>${p.name}</b> (Rat: ${p.rating}) verdient ${p.salary}€ - Zu teuer!</span> <button class="action-btn danger">VERKAUFEN</button></div>`;
            }
        });
        // 2. Checke Verträge
        eliteStore.players.forEach(p => {
            if(p.contract_exp <= 2026) {
                html += `<div class="audit-alert" style="border-color:orange; color:orange;"><span>Vertrag von <b>${p.name}</b> läuft 2026 aus.</span> <button class="action-btn">VERLÄNGERN</button></div>`;
            }
        });
        
        if(html === "") html = `<div class="audit-ok"><i class="fa-solid fa-check"></i> Keine kritischen Probleme gefunden. Der Laden läuft.</div>`;
        
        area.innerHTML = html;
        voiceEngine.speak("Audit abgeschlossen. Kritische Faktoren identifiziert.");
    }, 1000);
}

function askToniStrategy() {
    const p = document.getElementById('advisor-prompt').value;
    voiceEngine.speak("Verarbeite Strategie-Anfrage: " + p);
    document.getElementById('advisor-prompt').value = "";
}

/* ==========================================================================
   5. V15: OFFICE PRIME (VERWALTUNG)
   ========================================================================== */

function renderOfficeHub() {
    const viewport = document.getElementById('content-viewport');
    
    // Generiere Vertrags-Tabelle
    const playerRows = eliteStore.players.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.contract_exp}</td>
            <td>${p.salary.toLocaleString()} €</td>
            <td>${p.market_value.toLocaleString()} €</td>
            <td><div style="width:50px; height:4px; background:#333;"><div style="width:${p.status.morale}%; height:100%; background:${p.
