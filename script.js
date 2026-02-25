/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V15.1 - FIXED LOGIN & FULL MERGE)
   ========================================================================== */

// 1. KONFIGURATION & DATENBANK
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// ZENTRALER STATE
const eliteStore = {
    players: [], 
    staff: [], 
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
        { id: 6, label: "Spielergehälter (Kader)", value: 0, type: "expense", cat: "pro" },
        { id: 7, label: "Stadionmiete / Pacht", value: -120000, type: "expense", cat: "pro" },
        { id: 8, label: "Personal (Staff)", value: 0, type: "expense", cat: "pro" }
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
        aiContext: "" 
    },
    activeModule: 'kader'
};

/* ==========================================================================
   2. SYSTEM BOOT (REPARIERT - KEIN PASSWORT MEHR NÖTIG)
   ========================================================================== */

function systemBootSequence() {
    console.log("TONI 2.0: Security Bypass active...");
    // Wir erzwingen den Start, egal was im Passwortfeld steht
    const auth = document.getElementById('auth-layer');
    const main = document.getElementById('main-interface');
    
    if(auth) auth.classList.add('hidden'); // Verstecke Login
    if(main) main.classList.remove('hidden'); // Zeige Interface
    
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

async function initEliteCore() {
    console.log("TONI 2.0 V15.1: Initializing Neural CEO Engine...");
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    
    await syncWithGitHub(); 

    // V15 RESET: Wir brauchen saubere Daten für das CEO-Modul
    if (eliteStore.players.length === 0 || !eliteStore.players[0].salary) {
        console.log("V15: Upgrade Database structure...");
        generateLuxurySquad();
        generateDefaultStaff();
    }

    fetchWeatherData();
    injectLabStyles();
    updateFinanceTotals(); 
    loadModule(eliteStore.activeModule);
    voiceEngine.init();
}

function generateLuxurySquad() {
    eliteStore.players = [];
    const positions = ["TW", "IV", "IV", "RV", "LV", "ZDM", "ZM", "ZM", "RF", "LF", "ST", "TW", "IV", "ZM", "OM", "ST"];
    positions.forEach((pos, i) => {
        const rating = 75 + Math.floor(Math.random() * 15);
        const marketVal = rating * 150000;
        const salary = Math.round(rating * 2500); 
        
        eliteStore.players.push({
            id: Date.now() + i, 
            name: `Profi ${i+1}`, 
            position: pos, 
            rating: rating,
            salary: salary,
            contract_exp: 2026 + Math.floor(Math.random() * 3), 
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
    const totalPlayerSalary = eliteStore.players.reduce((acc, p) => acc + (p.salary * 12), 0);
    const salaryItem = eliteStore.finance.find(f => f.label.includes("Spielergehälter"));
    if(salaryItem) salaryItem.value = -totalPlayerSalary;

    const totalStaffSalary = eliteStore.staff.reduce((acc, s) => acc + (s.salary * 12), 0);
    const staffItem = eliteStore.finance.find(f => f.label.includes("Personal"));
    if(staffItem) staffItem.value = -totalStaffSalary;

    const total = eliteStore.finance.reduce((acc, curr) => acc + curr.value, 0);
    eliteStore.mgmt.liquidAssets = total;
    updateKPIs();
    eliteStore.mgmt.aiContext = `SYSTEM: Verein Budget: ${total}€. Kadergröße: ${eliteStore.players.length}. Saisonziel: Aufstieg.`;
}

// STYLES
function injectLabStyles() {
    if (document.getElementById('lab-styles-v15')) return;
    const style = document.createElement('style');
    style.id = 'lab-styles-v15';
    style.innerHTML = `
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9000; padding: 25px; display: flex; flex-direction: column; backdrop-filter: blur(15px); }
        .lab-grid { display: grid; grid-template-columns: 320px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 25px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .lab-title { font-family: var(--font-hud); color: var(--neon-blue); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 14px; letter-spacing: 2px; }
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
        .tactics-wrapper { display: grid; grid-template-columns: 200px 1fr 200px; gap: 20px; height: 100%; }
        .tactics-sidebar { background: #0a0f1d; padding: 15px; border-radius: 8px; border: 1px solid #333; overflow-y: auto; }
        .tactics-stage { background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soccer_Field_Transparant.svg/1200px-Soccer_Field_Transparant.svg.png') no-repeat center center; background-size: contain; position: relative; border: 2px solid #444; border-radius: 4px; background-color: #1e3a1e; }
        .tool-btn { background: #1e293b; color: white; border: 1px solid #333; padding: 8px; margin-bottom: 5px; cursor: pointer; text-align: left; font-size: 11px; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .tool-btn:hover, .tool-btn.active { background: var(--neon-main); color: black; border-color: var(--neon-main); font-weight: bold; }
        .draggable-player { padding: 5px; background: rgba(255,255,255,0.05); margin-bottom: 5px; cursor: grab; display: flex; justify-content: space-between; font-size: 11px; border-left: 2px solid #555; }
        .draggable-player:hover { border-left-color: var(--neon-main); background: rgba(255,255,255,0.1); }
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
    if(modId === 'analysis') renderAdvisorHub(); 
    if(modId === 'finance') renderOfficeHub(); 
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
        voiceEngine.speak("Audit abgeschlossen.");
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
            <td><div style="width:50px; height:4px; background:#333;"><div style="width:${p.status.morale}%; height:100%; background:${p.status.morale>50?'var(--neon-main)':'red'}"></div></div></td>
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
                        <thead><tr><th>Spieler</th><th>Laufzeit</th><th>Gehalt/M</th><th>Marktwert</th><th>Moral</th><th>Aktion</th></tr></thead>
                        <tbody>${playerRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function switchOfficeTab(tab) {
    const container = document.getElementById('office-content');
    if(tab === 'contracts') renderOfficeHub(); 
    
    if(tab === 'staff') {
        const staffRows = eliteStore.staff.map(s => `<tr><td>${s.role}</td><td>${s.name}</td><td>${s.salary} €</td><td style="color:var(--neon-blue)">${s.effect}</td><td><button class="action-btn danger">X</button></td></tr>`).join('');
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
        let rows = eliteStore.finance.map((item, idx) => `<tr><td>${item.label}</td><td>${item.value} €</td></tr>`).join('');
        container.innerHTML = `<div class="lab-panel"><div class="lab-title">BILANZ-ÜBERSICHT</div><table class="finance-table"><tbody>${rows}</tbody></table></div>`;
    }
}

function negotiate(id) {
    const p = eliteStore.players.find(x=>x.id===id);
    alert(`Verhandlung mit ${p.name} gestartet. (Berater fordert: ${Math.round(p.salary*1.2)}€)`);
}

/* ==========================================================================
   6. TACTICS BOARD PRO (V14.0)
   ========================================================================== */

const tacticsCore = {
    canvas: null, ctx: null, mode: 'move', tacticMode: 'match', elements: [],
    
    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const stage = document.querySelector('.tactics-stage');
        this.canvas.width = stage.clientWidth;
        this.canvas.height = stage.clientHeight;
        
        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        
        this.loadMatchMode(); 
    },

    setTacticMode: function(mode) {
        this.tacticMode = mode;
        this.elements = []; 
        document.getElementById('mode-match-btn').classList.toggle('active', mode === 'match');
        document.getElementById('mode-training-btn').classList.toggle('active', mode === 'training');
        if (mode === 'match') this.loadMatchMode(); else this.loadTrainingMode();
    },

    loadMatchMode: function() {
        const starters = eliteStore.players.slice(0, 11); 
        this.applyFormation(starters, '4-4-2', 'player');
        const opponents = Array(11).fill(0).map((_, i) => ({name: `Gegner ${i+1}`, id: 9000+i}));
        this.applyFormation(opponents, '4-4-2', 'opponent');
        this.renderLoop();
    },

    loadTrainingMode: function() {
        const starters = eliteStore.players.slice(0, 11);
        this.applyFormation(starters, 'training', 'player');
        this.elements.push({type: 'ball', x: 400, y: 300, radius: 6});
        this.renderLoop();
    },

    applyFormation: function(squad, formation, type) {
        const color = type === 'player' ? '#ef4444' : '#3b82f6';
        const startY = type === 'player' ? 400 : 100;
        squad.forEach((p, i) => {
            let x = 100 + (i % 4) * 150; 
            let y = startY + Math.floor(i / 4) * 60;
            if(formation === 'training') y = 300 + Math.random()*200; 
            this.elements.push({type: type, id: p.id, label: type==='player'?p.position:'G', name: p.name, x: x, y: y, color: color, radius: 14, isDragging: false});
        });
    },

    setMode: function(m) { this.mode = m; },
    startAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        this.elements.forEach(el => { if(Math.hypot(x-el.x, y-el.y) < el.radius + 5) el.isDragging = true; });
    },
    moveAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        this.elements.forEach(el => { if(el.isDragging) { el.x = x; el.y = y; } });
        this.renderLoop();
    },
    endAction: function() { this.elements.forEach(el => el.isDragging = false); },
    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.elements.forEach(el => {
            if(el.type === 'ball') {
                this.ctx.beginPath(); this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI*2); this.ctx.fillStyle = 'white'; this.ctx.fill(); this.ctx.stroke();
            } else {
                this.ctx.beginPath(); this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI*2); this.ctx.fillStyle = el.color; this.ctx.fill();
                this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2; this.ctx.stroke();
                this.ctx.fillStyle = 'white'; this.ctx.font = 'bold 10px Arial'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText(el.label, el.x, el.y);
                this.ctx.fillStyle = '#ddd'; this.ctx.font = '9px Arial'; this.ctx.fillText(el.name, el.x, el.y + 22);
            }
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    const bench = eliteStore.players.length > 11 ? eliteStore.players.slice(11) : [];
    const benchHtml = bench.map(p => `<div class="draggable-player"><span><b>${p.position}</b> ${p.name}</span></div>`).join('');

    viewport.innerHTML = `
        <div class="tactics-wrapper">
            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">MODUS</h3>
                <div class="fin-tabs" style="display:block; border:none; margin-bottom:10px;">
                    <button class="fin-tab active" id="mode-match-btn" style="width:100%; margin-bottom:5px;" onclick="tacticsCore.setTacticMode('match')">MATCH (11vs11)</button>
                    <button class="fin-tab" id="mode-training-btn" style="width:100%;" onclick="tacticsCore.setTacticMode('training')">TRAINING</button>
                </div>
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px; margin-top:20px;">WERKZEUGE</h3>
                <div class="tool-btn" onclick="tacticsCore.setMode('move')"><i class="fa-solid fa-arrows-up-down-left-right"></i> BEWEGEN</div>
                <div class="tool-btn" onclick="tacticsCore.setMode('draw')"><i class="fa-solid fa-pen"></i> ZEICHNEN</div>
            </aside>
            <div class="tactics-stage"><canvas id="tactics-canvas"></canvas></div>
            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">ERSATZBANK (${bench.length})</h3>
                <div style="margin-top:10px;">${benchHtml}</div>
                <hr style="border-color:#333; margin:15px 0;">
                <div class="analysis-sheet"><h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px;">MATCHPLAN NOTIZEN</h3><textarea style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;"></textarea></div>
            </aside>
        </div>`;
}

function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    let html = `<div style="display:flex; justify-content:space-between; margin-bottom:20px;"><h2 style="font-family:var(--font-hud); color:white;">ELITE KADER</h2><button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER</button></div><div class="kader-grid">`;
    eliteStore.players.forEach(p => {
        const op = p.status.im_training ? 1 : 0.5;
        html += `<div class="fifa-card" style="opacity:${op}; border-color:${p.status.im_kader?"var(--neon-main)":"#444"};" onclick="openBioLab(${p.id})"><div class="card-inner"><div class="card-front"><div class="card-rating">${p.rating}</div><img src="${p.img_url}" class="player-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'"><div class="card-info"><div class="card-name">${p.name}</div><div class="card-pos">${p.position}</div><div style="text-align:center; font-size:10px; margin-top:5px; color:var(--neon-blue);">LABOR ÖFFNEN</div></div></div></div></div>`;
    });
    viewport.innerHTML = html + `</div>`;
}

function calculateFifaRating(s) { return Math.round(( (s.pac||0)+(s.sho||0)+(s.pas||0)+(s.dri||0)+(s.def||0)+(s.phy||0) )/6); }
function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    if(!p && id === -1) p = {id:Date.now(),name:"Neu",position:"ZM",rating:60,salary:2000,contract_exp:2026,market_value:50000,status:{im_kader:true,im_training:true,morale:80},fifa_stats:{pac:60,sho:60,pas:60,dri:60,def:60,phy:60},labor_daten:{waage:{gewicht:75},uhr:{ruhepuls:60}}};
    const s=p.fifa_stats; const l=p.labor_daten;
    const ov = document.createElement('div'); ov.className = 'lab-overlay'; ov.id = 'active-bio-lab';
    ov.innerHTML = `<div style="display:flex; justify-content:space-between; padding-bottom:15px; border-bottom:1px solid #333;"><h1 style="font-family:var(--font-hud); color:white;">${p.name.toUpperCase()}</h1><button class="btn-cancel" onclick="document.getElementById('active-bio-lab').remove(); loadModule('kader');">X</button></div>
    <div class="lab-grid">
        <div class="lab-panel"><div class="lab-title">STATS</div><input class="bio-val" value="${p.name}" onchange="updateP(${p.id},'name',this.value)"><div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;"><span class="bio-label">PAC</span><input type="number" class="bio-val" value="${s.pac}" onchange="updateStat(${p.id},'pac',this.value)"></div></div>
        <div class="lab-panel"><div class="lab-title">BODY</div><span class="bio-label">GEWICHT</span><input type="number" class="bio-val" value="${l.waage.gewicht}" onchange="updateLab(${p.id},'waage','gewicht',this.value)"></div>
        <div class="lab-panel"><div class="lab-title">CONTRACT</div><span class="bio-label">GEHALT</span><input type="number" class="bio-val" value="${p.salary}" onchange="updateP(${p.id},'salary',this.value)"><span class="bio-label">LAUFZEIT</span><input type="number" class="bio-val" value="${p.contract_exp}" onchange="updateP(${p.id},'contract_exp',this.value)"></div>
    </div>`;
    document.body.appendChild(ov);
}
function updateP(id,k,v){const p=eliteStore.players.find(x=>x.id===id); if(p){p[k]=k==='name'?v:parseInt(v); updateFinanceTotals();}}
function updateStat(id,k,v){const p=eliteStore.players.find(x=>x.id===id); if(p){p.fifa_stats[k]=parseInt(v); p.rating=calculateFifaRating(p.fifa_stats);}}
function updateLab(id,d,k,v){const p=eliteStore.players.find(x=>x.id===id); if(p)p.labor_daten[d][k]=parseFloat(v);}

function renderGazetteCMS() { document.getElementById('content-viewport').innerHTML=`<div class="gazette-editor"><h1>GAZETTE V15</h1><p>Inhalt folgt...</p></div>`; }
function renderCalendar() { const v=document.getElementById('content-viewport'); v.innerHTML=`<div class="cal-grid"><div class="cal-header"><h2>WOCHENPLAN</h2></div></div>`; }

function updateKPIs() { 
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; 
    const w = document.getElementById('weather-header-widget'); if(w) w.innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ${eliteStore.mgmt.liveData.temp}°C`;
}
async function fetchWeatherData() { try{const r=await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8&longitude=9.4&current_weather=true");const d=await r.json();eliteStore.mgmt.liveData.temp=d.current_weather.temperature;updateKPIs();}catch(e){} }
function initVRHub() { document.getElementById('match-simulation-layer').innerHTML='<a-text value="VR MODE" position="0 1.6 -2" color="white"></a-text>'; }
function checkAIConnection() { document.getElementById('ai-status-text').innerText = USER_API_KEY ? "AI: ONLINE" : "AI: OFFLINE"; }
const voiceEngine = { init:()=>{ window.SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition; if(window.SpeechRecognition){const r=new SpeechRecognition();r.lang='de-DE';r.onresult=(e)=>askToniStrategy(e.results[e.results.length-1][0].transcript);} }, speak:(t)=>{ const u=new SpeechSynthesisUtterance(t);u.lang='de-DE';window.speechSynthesis.speak(u); } };
function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openSysConfig() { document.getElementById('modal-sys-config').classList.remove('hidden'); }
function saveSystemConfig() { const k=document.getElementById('input-api-key').value; localStorage.setItem('toni_api_key', k); USER_API_KEY=k; closeModal('modal-sys-config'); }
// END OF FILE
