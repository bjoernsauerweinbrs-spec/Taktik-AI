/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V13.1 - SAFE MERGE EDITION)
   ========================================================================== */

// 1. KONFIGURATION & DATENBANK
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// ZENTRALER STATE
const eliteStore = {
    players: [], 
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { id: 1, day: 1, time: "10:00", title: "Laktattest", type: "physio", attendance: [] },
        { id: 2, day: 1, time: "15:00", title: "Team-Training", type: "training", attendance: [] },
        { id: 3, day: 5, time: "15:30", title: "Ligaspiel vs. BVB", type: "match", attendance: [] }
    ],
    // V13 FINANZEN
    finance: JSON.parse(localStorage.getItem('toni_finance')) || [
        { id: 1, label: "TV-Rechte / Streaming", value: 4500000, type: "income", cat: "pro" },
        { id: 2, label: "Hauptsponsor (Brust)", value: 2500000, type: "income", cat: "pro" },
        { id: 3, label: "Bandenwerbung (Lokal)", value: 12500, type: "income", cat: "amateur" },
        { id: 4, label: "Catering / Wurstverkauf", value: 3200, type: "income", cat: "amateur" },
        { id: 5, label: "Mitgliedsbeiträge", value: 45000, type: "income", cat: "amateur" },
        { id: 6, label: "Spielergehälter (Kader)", value: -3500000, type: "expense", cat: "pro" },
        { id: 7, label: "Stadionmiete / Pacht", value: -120000, type: "expense", cat: "pro" },
        { id: 8, label: "Material & Bälle", value: -5000, type: "expense", cat: "amateur" }
    ],
    // V13 GAZETTE
    gazette: {
        headline: "DER GROSSE SAISON-REPORT",
        lead: "Wie sich unser Team neu erfindet.",
        body: "Hier steht der redaktionelle Text..."
    },
    mgmt: {
        liquidAssets: 0,
        infrastructure: { medicalLevel: 5, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" }
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
    console.log("TONI 2.0 V13.1: Restoring Full Functionality...");
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    await syncWithGitHub();
    fetchWeatherData();
    injectLabStyles();     // Lädt ALLE Styles (Kader + Finanzen)
    recalculateBudget(); 
    loadModule(eliteStore.activeModule);
    voiceEngine.init();
}

async function syncWithGitHub() {
    try {
        const response = await fetch(GITHUB_REPO_URL);
        if (!response.ok) throw new Error("GitHub Offline");
        const data = await response.json();
        if(data.kader_toni) eliteStore.players = data.kader_toni;
        recalculateBudget();
    } catch (error) {
        console.warn("Offline Mode Active");
        const local = localStorage.getItem('toni_players_backup');
        if(local) eliteStore.players = JSON.parse(local);
        recalculateBudget();
    }
}

function recalculateBudget() {
    const total = eliteStore.finance.reduce((acc, curr) => acc + curr.value, 0);
    eliteStore.mgmt.liquidAssets = total;
    updateKPIs();
}

// STYLES: KOMBINATION AUS V11 (LABOR) UND V13 (FINANZEN)
function injectLabStyles() {
    if (document.getElementById('lab-styles-v13-1')) return;
    const style = document.createElement('style');
    style.id = 'lab-styles-v13-1';
    style.innerHTML = `
        /* CORE OVERLAY */
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9000; padding: 25px; display: flex; flex-direction: column; backdrop-filter: blur(15px); }
        .lab-grid { display: grid; grid-template-columns: 320px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 25px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .lab-title { font-family: var(--font-hud); color: var(--neon-blue); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 20px; font-size: 14px; letter-spacing: 2px; }
        
        /* V11 BIO LAB STYLES */
        .scale-display { background: #000; border: 4px solid #333; border-radius: 10px; padding: 25px; text-align: center; color: var(--neon-main); font-family: monospace; font-size: 36px; margin-bottom: 20px; box-shadow: inset 0 0 20px rgba(0,255,65,0.2); text-shadow: 0 0 10px var(--neon-main); }
        .bio-input-group { background: rgba(255,255,255,0.04); padding: 12px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .bio-label { display: block; font-size: 10px; color: #888; margin-bottom: 5px; font-family: var(--font-hud); }
        .bio-val { background: transparent; border: none; color: white; font-family: var(--font-hud); font-size: 18px; width: 100%; text-align: center; border-bottom: 1px solid #444; }
        .watch-face { width: 160px; height: 160px; border-radius: 50%; border: 6px solid #1e293b; margin: 0 auto 20px; position: relative; background: radial-gradient(circle, #222, #000); display: flex; align-items: center; justify-content: center; flex-direction: column; box-shadow: 0 0 40px rgba(0,243,255,0.1); }
        .watch-time { color: white; font-size: 26px; font-family: var(--font-hud); }
        .watch-bpm { color: #f43f5e; font-size: 14px; margin-top: 5px; animation: pulse 1s infinite; }
        .metric-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 5px; align-items: center; }
        .toggle-btn { background: #333; color: #aaa; border: 1px solid #555; padding: 5px 10px; cursor: pointer; flex: 1; font-size: 10px; }
        .toggle-btn.active { background: var(--neon-main); color: black; border-color: var(--neon-main); }
        .toggle-btn.absent { background: transparent; color: #555; }
        
        /* V13 FINANCE STYLES */
        .fin-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .fin-tab { background: transparent; border: 1px solid #333; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-family: var(--font-hud); transition: 0.3s; }
        .fin-tab.active { background: var(--neon-blue); color: black; border-color: var(--neon-blue); font-weight: bold; }
        .finance-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .finance-table th { text-align: left; padding: 10px; color: #64748b; border-bottom: 1px solid #333; }
        .finance-table td { padding: 8px 10px; border-bottom: 1px solid #1e293b; color: #ccc; }
        .fin-inp { background: rgba(0,0,0,0.2); border: 1px solid #333; color: white; padding: 4px; width: 100%; font-family: monospace; }
        .val-pos { color: var(--neon-main); } .val-neg { color: var(--neon-alert); }
        .advisor-card { background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .advice-box { background: rgba(0,0,0,0.5); padding: 10px; border-left: 3px solid var(--neon-main); margin-top: 10px; font-size: 12px; display:none; }
        .office-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%; }
        .template-btn { display: block; width: 100%; text-align: left; padding: 10px; margin-bottom: 5px; background: #1e293b; border: none; color: white; cursor: pointer; }
        .gazette-editor { background: white; color: black; padding: 40px; font-family: 'Times New Roman', serif; min-height: 500px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .gazette-head { font-size: 42px; font-weight: bold; border-bottom: 4px solid black; margin-bottom: 20px; text-align: center; text-transform: uppercase; }
        .gazette-inp { width: 100%; border: none; background: transparent; outline: none; }
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
    
    updateKPIs(); // Wetter/Budget Header Update

    if(modId === 'kader') renderSquadOverview(); // Das VOLLE Kader-Modul
    if(modId === 'analysis') renderAnalysisCenter(); 
    if(modId === 'finance') renderFinanceHub(); // V13 Neu
    if(modId === 'stadionzeitung') renderGazetteCMS(); // V13 Neu
    if(modId === 'drills') renderCalendar(); // Der VOLLE Kalender
    
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
   4. KADER & BIO-LAB (WIEDERHERGESTELLTE VOLLVERSION)
   ========================================================================== */

function calculateFifaRating(s) {
    const stats = [s.pac||0, s.sho||0, s.pas||0, s.dri||0, s.def||0, s.phy||0];
    const sum = stats.reduce((a, b) => a + b, 0);
    return Math.round(sum / stats.length);
}

function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-family:var(--font-hud); color:white;">ELITE KADER</h2>
        <button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER</button>
    </div>
    <div class="kader-grid">`;

    eliteStore.players.forEach(p => {
        const stat = p.status || { im_kader: true, im_training: true };
        const opacity = stat.im_training ? "1" : "0.5";
        const borderCol = stat.im_kader ? "var(--neon-main)" : "#444";
        
        html += `
        <div class="fifa-card" style="opacity:${opacity}; border-color:${borderCol}; cursor:pointer;" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-rating">${p.rating || 75}</div>
                    <img src="${p.img_url || 'https://cdn-icons-png.flaticon.com/512/21/21104.png'}" class="player-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
                    <div class="card-info">
                        <div class="card-name">${p.name}</div>
                        <div class="card-pos">${p.position}</div>
                        <div style="text-align:center; margin-top:10px; font-size:10px; color:var(--neon-blue); border-top:1px solid #333; padding-top:5px;">
                            <i class="fa-solid fa-microscope"></i> LABOR ÖFFNEN
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    viewport.innerHTML = html + `</div>`;
}

function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    if(!p && id === -1) {
        p = { id: Date.now(), name: "Rekrut", position: "ZM", rating: 60, status: {im_kader:true, im_training:true}, fifa_stats:{pac:60,sho:60,pas:60,dri:60,def:60,phy:60}, labor_daten:{waage:{}, uhr:{}}, img_url:"" };
    }
    
    const lab = p.labor_daten || { waage: {}, uhr: {}, history: {} };
    const s = p.fifa_stats || {pac:0, sho:0, pas:0, dri:0, def:0, phy:0};

    const overlay = document.createElement('div');
    overlay.className = 'lab-overlay';
    overlay.id = 'active-bio-lab';
    
    overlay.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px;">
            <div style="display:flex; align-items:center; gap:20px;">
                <img src="${p.img_url || 'https://cdn-icons-png.flaticon.com/512/21/21104.png'}" style="width:60px; height:60px; border-radius:50%; border:2px solid var(--neon-blue);">
                <div>
                    <h1 style="font-family:var(--font-hud); font-size:26px; color:white; margin:0;">${p.name.toUpperCase()}</h1>
                    <span style="color:var(--neon-blue); font-size:11px;">ELITE BIO-METRIC MONITORING SYSTEM</span>
                </div>
            </div>
            <div>
                <button class="btn-save" onclick="saveBioLab(${p.id})">ANALYSE SPEICHERN</button>
                <button class="btn-cancel" onclick="closeBioLab()">BEENDEN</button>
            </div>
        </div>

        <div class="lab-grid">
            <div class="lab-panel" style="border-color:var(--neon-main);">
                <div class="lab-title">FIFA IDENTITÄT & CORE STATS</div>
                <div class="bio-input-group"><span class="bio-label">NAME</span><input type="text" class="bio-val" value="${p.name}" onchange="updateIdentityLab(${p.id}, 'name', this.value)"></div>
                <div style="display:flex; gap:10px;">
                    <div class="bio-input-group" style="flex:1;"><span class="bio-label">RATING (AUTO)</span><input type="number" id="lab-rating-val" class="bio-val" value="${p.rating}" readonly></div>
                    <div class="bio-input-group" style="flex:1;"><span class="bio-label">POSITION</span><input type="text" class="bio-val" value="${p.position}" onchange="updateIdentityLab(${p.id}, 'pos', this.value)"></div>
                </div>
                <div style="margin-top:10px; border-top:1px solid #333; padding-top:15px;">
                    <span class="bio-label" style="color:var(--neon-main);">LEISTUNGSWERTE</span>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        <div class="bio-input-group"><span class="bio-label">PAC</span><input type="number" class="bio-val lab-stat" data-stat="pac" value="${s.pac}" onchange="updateFifaValue(${p.id}, 'pac', this.value)"></div>
                        <div class="bio-input-group"><span class="bio-label">SHO</span><input type="number" class="bio-val lab-stat" data-stat="sho" value="${s.sho}" onchange="updateFifaValue(${p.id}, 'sho', this.value)"></div>
                        <div class="bio-input-group"><span class="bio-label">PAS</span><input type="number" class="bio-val lab-stat" data-stat="pas" value="${s.pas}" onchange="updateFifaValue(${p.id}, 'pas', this.value)"></div>
                        <div class="bio-input-group"><span class="bio-label">DRI</span><input type="number" class="bio-val lab-stat" data-stat="dri" value="${s.dri}" onchange="updateFifaValue(${p.id}, 'dri', this.value)"></div>
                        <div class="bio-input-group"><span class="bio-label">DEF</span><input type="number" class="bio-val lab-stat" data-stat="def" value="${s.def}" onchange="updateFifaValue(${p.id}, 'def', this.value)"></div>
                        <div class="bio-input-group"><span class="bio-label">PHY</span><input type="number" class="bio-val lab-stat" data-stat="phy" value="${s.phy}" onchange="updateFifaValue(${p.id}, 'phy', this.value)"></div>
                    </div>
                </div>
                <div style="margin-top:auto;">
                    <button class="toggle-btn ${p.status.im_kader ? 'active' : ''}" onclick="toggleStatusLab(${p.id}, 'kader')">KADER</button>
                    <button class="toggle-btn ${p.status.im_training ? 'active' : 'absent'}" onclick="toggleStatusLab(${p.id}, 'training')">TRAINING</button>
                </div>
            </div>

            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-weight-scale"></i> BODY ANALYZER (ANIMIERT)</div>
                <div class="scale-display"><span id="lab-weight-disp">${lab.waage.gewicht || 0}</span> <span style="font-size:16px; color:#555;">KG</span></div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                    <div class="bio-input-group"><span class="bio-label">GEWICHT</span><input type="number" class="bio-val" value="${lab.waage.gewicht || 0}" oninput="document.getElementById('lab-weight-disp').innerText=this.value" onchange="updateMedicalMetric(${p.id}, 'waage', 'gewicht', this.value)"></div>
                    <div class="bio-input-group"><span class="bio-label">FETT %</span><input type="number" class="bio-val" value="${lab.waage.kfa || 0}" onchange="updateMedicalMetric(${p.id}, 'waage', 'kfa', this.value)"></div>
                    <div class="bio-input-group"><span class="bio-label">MUSKEL KG</span><input type="number" class="bio-val" value="${lab.waage.muskel_kg || 0}" onchange="updateMedicalMetric(${p.id}, 'waage', 'muskel_kg', this.value)"></div>
                    <div class="bio-input-group"><span class="bio-label">METABOLIC AGE</span><input type="number" class="bio-val" value="${lab.waage.metabolic_age || 0}" onchange="updateMedicalMetric(${p.id}, 'waage', 'metabolic_age', this.value)"></div>
                    <div class="bio-input-group"><span class="bio-label">WASSER %</span><input type="number" class="bio-val" value="${lab.waage.wasser || 0}" onchange="updateMedicalMetric(${p.id}, 'waage', 'wasser', this.value)"></div>
                    <div class="bio-input-group"><span class="bio-label">VISZERALFETT</span><input type="number" class="bio-val" value="${lab.waage.viszeral || 0}" onchange="updateMedicalMetric(${p.id}, 'waage', 'viszeral', this.value)"></div>
                </div>
                <div style="margin-top:20px; padding:15px; background:rgba(255,165,0,0.05); border:1px solid var(--neon-warn); border-radius:10px; text-align:center;">
                    <span class="bio-label" style="color:var(--neon-warn);">BERECHNETER BMI</span>
                    <div id="lab-bmi-disp" style="font-size:24px; font-weight:bold; font-family:var(--font-hud);">${lab.waage.bmi || '--'}</div>
                </div>
            </div>

            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-stopwatch"></i> SMARTWATCH PERFORMANCE HUB</div>
                <div class="watch-face">
                    <div class="watch-time" id="lab-watch-time">00:00</div>
                    <div class="watch-bpm"><i class="fa-solid fa-heart"></i> <span id="lab-bpm-disp">${lab.uhr.ruhepuls || '--'}</span></div>
                </div>
                <div class="metric-row"><span class="bio-label">RUHEPULS</span><input type="number" class="bio-val" style="width:60px;" value="${lab.uhr.ruhepuls || 0}" oninput="document.getElementById('lab-bpm-disp').innerText=this.value" onchange="updateMedicalMetric(${p.id}, 'uhr', 'ruhepuls', this.value)"></div>
                <div class="metric-row"><span class="bio-label">HRV (STRESS)</span><input type="number" class="bio-val" style="width:60px;" value="${lab.uhr.hrv || 0}" onchange="updateMedicalMetric(${p.id}, 'uhr', 'hrv', this.value)"></div>
                <div class="metric-row"><span class="bio-label">VO2 MAX</span><input type="number" class="bio-val" style="width:60px;" value="${lab.uhr.vo2max || 0}" onchange="updateMedicalMetric(${p.id}, 'uhr', 'vo2max', this.value)"></div>
                <div class="metric-row"><span class="bio-label">SCHLAF-SCORE</span><input type="number" class="bio-val" style="width:60px;" value="${lab.uhr.schlaf || 0}" onchange="updateMedicalMetric(${p.id}, 'uhr', 'schlaf', this.value)"></div>
                <div style="margin-top:15px;">
                    <span class="bio-label">BELASTUNGS-INDEX (LOAD)</span>
                    <div class="analysis-chart-bar"><div class="analysis-fill" style="width:${(lab.uhr.load || 5)*10}%"></div></div>
                    <input type="number" class="bio-val" style="margin-top:8px;" value="${lab.uhr.load || 0}" onchange="updateMedicalMetric(${p.id}, 'uhr', 'load', this.value)">
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    const watchLoop = setInterval(() => {
        const d = new Date();
        const el = document.getElementById('lab-watch-time');
        if(el) el.innerText = d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes();
        else clearInterval(watchLoop);
    }, 1000);
}

// UPDATE LOGIK FÜR LABOR
function updateFifaValue(id, stat, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    if(!p.fifa_stats) p.fifa_stats = {};
    p.fifa_stats[stat] = parseInt(val);
    p.rating = calculateFifaRating(p.fifa_stats);
    const disp = document.getElementById('lab-rating-val');
    if(disp) disp.value = p.rating;
}

function updateIdentityLab(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) { if(key === 'name') p.name = val; if(key === 'pos') p.position = val; if(key === 'img') p.img_url = val; }
}

function updateMedicalMetric(id, device, field, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    if(!p.labor_daten) p.labor_daten = { waage: {}, uhr: {} };
    if(!p.labor_daten[device]) p.labor_daten[device] = {};
    p.labor_daten[device][field] = parseFloat(val);
    
    if(device === 'waage' && field === 'gewicht') {
        const bmi = (parseFloat(val) / (1.85 * 1.85)).toFixed(1);
        p.labor_daten.waage.bmi = bmi;
        if(document.getElementById('lab-bmi-disp')) document.getElementById('lab-bmi-disp').innerText = bmi;
    }
}

function toggleStatusLab(id, type) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    if(type === 'kader') p.status.im_kader = !p.status.im_kader;
    if(type === 'training') p.status.im_training = !p.status.im_training;
    closeBioLab(); openBioLab(id);
}

function closeBioLab() {
    const el = document.getElementById('active-bio-lab');
    if(el) el.remove();
    loadModule('kader');
}

function saveBioLab(id) {
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    voiceEngine.speak("Analysedaten synchronisiert.");
    closeBioLab();
}

/* ==========================================================================
   5. V13: FINANCE & STRATEGY HUB (NEU & ERWEITERT)
   ========================================================================== */

function renderFinanceHub() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2 style="font-family:var(--font-hud); color:white; margin:0;">STRATEGIE-ZENTRALE</h2>
                <div class="fin-tabs">
                    <button class="fin-tab active" onclick="switchFinTab('bilanz')">BILANZ & CASHFLOW</button>
                    <button class="fin-tab" onclick="switchFinTab('strategy')">BERATER & BENCHMARK</button>
                    <button class="fin-tab" onclick="switchFinTab('office')">OFFICE & EVENTS</button>
                </div>
            </div>
            <div id="fin-content-area" style="flex:1; overflow:hidden;"></div>
        </div>
    `;
    renderBilanzTab(); // Start-Tab
}

function switchFinTab(tab) {
    document.querySelectorAll('.fin-tab').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    if(tab === 'bilanz') renderBilanzTab();
    if(tab === 'strategy') renderStrategyTab();
    if(tab === 'office') renderOfficeTab();
}

// --- TAB 1: DIE GROSSE BILANZ ---
function renderBilanzTab() {
    let rows = eliteStore.finance.map((item, idx) => `
        <tr>
            <td><input type="text" class="fin-inp" value="${item.label}" onchange="updateFin(${idx}, 'label', this.value)"></td>
            <td>
                <select class="fin-inp" onchange="updateFin(${idx}, 'type', this.value)">
                    <option value="income" ${item.type==='income'?'selected':''}>Einnahme</option>
                    <option value="expense" ${item.type==='expense'?'selected':''}>Ausgabe</option>
                </select>
            </td>
            <td><input type="number" class="fin-inp ${item.value>=0?'val-pos':'val-neg'}" value="${item.value}" onchange="updateFin(${idx}, 'value', this.value)"></td>
            <td><button onclick="delFin(${idx})" style="color:#f43f5e; background:none; border:none; cursor:pointer;"><i class="fa-solid fa-trash"></i></button></td>
        </tr>
    `).join('');

    const html = `
        <div class="lab-panel" style="height:100%;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <div style="font-size:12px; color:#aaa;">ALLE POSITIONEN LIVE EDITIERBAR</div>
                <button class="btn-save" onclick="addFin()">+ NEUER POSTEN</button>
            </div>
            <div style="overflow-y:auto; flex:1;">
                <table class="finance-table">
                    <thead><tr><th width="40%">Bezeichnung</th><th width="20%">Typ</th><th width="30%">Betrag (€)</th><th></th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <div style="margin-top:15px; padding-top:15px; border-top:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
                <span class="bio-label">LIQUIDE MITTEL (AKTUELL)</span>
                <span style="font-size:24px; font-family:monospace; color:${eliteStore.mgmt.liquidAssets>=0?'var(--neon-main)':'var(--neon-alert)'}">
                    ${eliteStore.mgmt.liquidAssets.toLocaleString()} €
                </span>
            </div>
        </div>
    `;
    document.getElementById('fin-content-area').innerHTML = html;
}

// --- TAB 2: TONI DER UNTERNEHMENSBERATER ---
function renderStrategyTab() {
    const html = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; height:100%; overflow-y:auto;">
            <div class="lab-panel">
                <div class="lab-title">PREIS-ANALYSE (BENCHMARK)</div>
                
                <div class="advisor-card">
                    <h4><i class="fa-solid fa-beer-mug-empty"></i> CATERING CHECK</h4>
                    <div class="bio-label">BIERPREIS / WURST (€)</div>
                    <input type="number" id="check-beer" class="fin-inp" style="width:100px; display:inline-block;" placeholder="4.50">
                    <button class="btn-save" style="padding:5px 10px;" onclick="runAdvisor('catering')">PRÜFEN</button>
                    <div id="adv-catering" class="advice-box"></div>
                </div>

                <div class="advisor-card">
                    <h4><i class="fa-solid fa-rectangle-ad"></i> SPONSORING CHECK</h4>
                    <div class="bio-label">QUADRATMETERPREIS BANDE (€)</div>
                    <input type="number" id="check-ad" class="fin-inp" style="width:100px; display:inline-block;" placeholder="150">
                    <button class="btn-save" style="padding:5px 10px;" onclick="runAdvisor('sponsor')">ANALYSE</button>
                    <div id="adv-sponsor" class="advice-box"></div>
                </div>
            </div>

            <div class="lab-panel">
                <div class="lab-title">STRATEGISCHE EMPFEHLUNGEN</div>
                <ul style="font-size:12px; color:#ccc; line-height:1.6; padding-left:20px;">
                    <li><strong>Fan-Bindung:</strong> Die Auslastung liegt unter 85%. Empfehlung: "Bring a Friend"-Aktion für das nächste Heimspiel.</li>
                    <li><strong>Merchandising:</strong> Der Schal-Verkauf stagniert. Design-Refresh für V14.0 empfohlen.</li>
                    <li><strong>Cashflow:</strong> Hohe Ausgaben im nächsten Monat erwartet (Reisekosten). Liquiditätspuffer prüfen!</li>
                </ul>
                <div style="margin-top:auto; padding:15px; background:rgba(255,255,255,0.05); border-radius:8px;">
                    <span class="bio-label">KI-PROGNOSE</span>
                    <div style="color:var(--neon-blue);">"Basierend auf dem aktuellen Trend erreichen wir den Break-Even am 24. Spieltag."</div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('fin-content-area').innerHTML = html;
}

function runAdvisor(type) {
    let msg = "";
    if(type === 'catering') {
        const val = parseFloat(document.getElementById('check-beer').value) || 0;
        if(val > 5.50) msg = "WARNUNG: Preis übersteigt Liga-Durchschnitt drastisch. Fan-Proteste wahrscheinlich.";
        else if(val < 3.00) msg = "TIPP: Du verschenkst Marge. Der Durchschnitt liegt bei 4.50 €.";
        else msg = "OK: Preis ist marktgerecht und fair.";
        document.getElementById('adv-catering').style.display = 'block';
        document.getElementById('adv-catering').innerText = "TONI: " + msg;
    }
    if(type === 'sponsor') {
        const val = parseFloat(document.getElementById('check-ad').value) || 0;
        if(val < 100) msg = "KRITISCH: Zu billig! Amateur-Schnitt liegt bei 150€/qm, Profis bei >500€.";
        else msg = "GUT: Preis ist solide. Versuche, digitale Reichweite als Upsell anzubieten.";
        document.getElementById('adv-sponsor').style.display = 'block';
        document.getElementById('adv-sponsor').innerText = "TONI: " + msg;
    }
}

// --- TAB 3: OFFICE & KOMMUNIKATION ---
function renderOfficeTab() {
    const html = `
        <div class="office-grid">
            <div class="lab-panel">
                <div class="lab-title">DOKUMENTEN-GENERATOR</div>
                <span class="bio-label">VORLAGEN WÄHLEN</span>
                <button class="template-btn" onclick="loadTemplate('sponsor')"><i class="fa-solid fa-handshake"></i> Sponsoren-Anschreiben (Akquise)</button>
                <button class="template-btn" onclick="loadTemplate('absage')"><i class="fa-solid fa-circle-xmark"></i> Spielabsage (Wetter)</button>
                <button class="template-btn" onclick="loadTemplate('einladung')"><i class="fa-solid fa-champagne-glasses"></i> Einladung VIP-Event</button>
                
                <span class="bio-label" style="margin-top:20px;">EVENT-PLANER</span>
                <button class="template-btn" onclick="loadTemplate('sommerfest')"><i class="fa-solid fa-sun"></i> Checkliste: Sommerfest</button>
                <button class="template-btn" onclick="loadTemplate('turnier')"><i class="fa-solid fa-trophy"></i> Checkliste: Jugend-Turnier</button>
            </div>
            <div class="lab-panel">
                <div class="lab-title">EDITOR / VORSCHAU</div>
                <textarea id="office-editor" style="width:100%; height:100%; background:transparent; border:none; color:white; font-family:monospace; resize:none;" placeholder="Wähle links eine Vorlage..."></textarea>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button class="btn-save" onclick="alert('Gesendet / Gedruckt!')">AUSFÜHREN</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('fin-content-area').innerHTML = html;
}

function loadTemplate(key) {
    const texts = {
        sponsor: "Sehr geehrte Damen und Herren,\n\nunser Verein steht für Leidenschaft und lokale Verbundenheit. Wir haben analysiert, dass Ihre Zielgruppe zu 85% mit unserer Fanbasis übereinstimmt.\n\nWir bieten Ihnen:\n- Trikotwerbung (Reichweite: 5000+)\n- Social Media Features\n\nLassen Sie uns über eine Partnerschaft sprechen.\n\nMit sportlichen Grüßen,\nDer Vorstand",
        absage: "WICHTIGE MITTEILUNG\n\nAufgrund der aktuellen Witterungsbedingungen (Unbespielbarkeit des Platzes) muss das Spiel am Wochenende leider abgesagt werden.\nEin Nachholtermin wird zeitnah bekanntgegeben.",
        sommerfest: "CHECKLISTE SOMMERFEST:\n[ ] Genehmigung Stadt einholen\n[ ] Getränkewagen bestellen (30 Hektoliter)\n[ ] DJ / Band buchen\n[ ] Hüpfburg für Kids\n[ ] Presse einladen\n[ ] Tombola-Preise organisieren",
        turnier: "CHECKLISTE TURNIER:\n[ ] Schiedsrichter einteilen\n[ ] Spielplan erstellen (Turnierbaum)\n[ ] Medaillen & Pokale gravieren\n[ ] Ersthelfer vor Ort?\n[ ] Verkauf: Kuchenspenden organisieren"
    };
    document.getElementById('office-editor').value = texts[key] || "";
}

// FINANCE HELPERS
function updateFin(idx, key, val) {
    if(key === 'value') eliteStore.finance[idx].value = parseFloat(val);
    else eliteStore.finance[idx][key] = val;
    recalculateBudget();
    renderBilanzTab(); // Refresh um Summen zu zeigen
}
function addFin() {
    eliteStore.finance.push({id: Date.now(), label: "Neuer Posten", value: 0, type: "expense", cat: "amateur"});
    renderBilanzTab();
}
function delFin(idx) {
    eliteStore.finance.splice(idx, 1);
    recalculateBudget();
    renderBilanzTab();
}

/* ==========================================================================
   6. V13: GAZETTE CMS (STADIONZEITUNG)
   ========================================================================== */

function renderGazetteCMS() {
    const g = eliteStore.gazette;
    document.getElementById('content-viewport').innerHTML = `
        <div style="height:100%; overflow-y:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="font-family:var(--font-hud); color:white;">MEDIA CENTER: ELITE GAZETTE</h2>
                <div>
                    <button class="btn-save" onclick="saveGazette()"><i class="fa-solid fa-floppy-disk"></i> SPEICHERN</button>
                    <button class="btn-save" style="background:#fff; color:#000;" onclick="printGazette()"><i class="fa-solid fa-print"></i> DRUCK-VORSCHAU</button>
                </div>
            </div>
            
            <div class="gazette-editor" id="gazette-print-area">
                <input type="text" class="gazette-inp gazette-head" value="${g.headline}" onchange="eliteStore.gazette.headline=this.value">
                <textarea class="gazette-inp g-lead" onchange="eliteStore.gazette.lead=this.value">${g.lead}</textarea>
                <div style="width:100%; height:2px; background:black; margin-bottom:20px;"></div>
                <textarea class="gazette-inp g-body" style="height:400px;" onchange="eliteStore.gazette.body=this.value">${g.body}</textarea>
                
                <div style="margin-top:40px; border-top:1px solid #ccc; padding-top:10px; font-size:10px; text-align:center;">
                    OFFIZIELLES ORGAN DES VEREINS | AUFLAGE: 5.000 | POWERED BY TONI 2.0
                </div>
            </div>
        </div>
    `;
}

function saveGazette() {
    localStorage.setItem('toni_finance', JSON.stringify(eliteStore.finance)); 
    voiceEngine.speak("Redaktionsschluss. Ausgabe gespeichert.");
}
function printGazette() {
    const content = document.getElementById('gazette-print-area').innerHTML;
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>GAZETTE PREVIEW</title>');
    win.document.write('<style>body{font-family:"Times New Roman"; padding:40px;}</style>');
    win.document.write('</head><body>');
    win.document.write(content);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
}

/* ==========================================================================
   7. ANALYSIS CENTER (WIEDERHERGESTELLTE VOLLVERSION)
   ========================================================================== */

function renderAnalysisCenter() {
    const viewport = document.getElementById('content-viewport');
    let html = `
    <h2 style="font-family:var(--font-hud); color:white; border-bottom:1px solid #333; padding-bottom:10px;">ANALYSEZENTRUM (ELITE VERLÄUFE)</h2>
    <div style="background:#0f172a; padding:20px; border-radius:8px; margin-top:20px; overflow-x:auto;">
        <table style="width:100%; text-align:left; color:#ccc; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom:1px solid #555; color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">
                    <th style="padding:10px;">SPIELER</th>
                    <th>RATING</th>
                    <th>GEWICHT</th>
                    <th>FETT %</th>
                    <th>VO2 MAX</th>
                    <th>LOAD</th>
                    <th>STATUS</th>
                </tr>
            </thead>
            <tbody>`;

    eliteStore.players.forEach(p => {
        const lab = p.labor_daten || { waage: {}, uhr: {} };
        html += `
            <tr style="border-bottom:1px solid #222;">
                <td style="padding:12px; font-weight:bold; color:white;">${p.name}</td>
                <td style="color:var(--neon-main); font-family:var(--font-hud);">${p.rating || 0}</td>
                <td>${lab.waage.gewicht || '--'} kg</td>
                <td>${lab.waage.kfa || '--'} %</td>
                <td>${lab.uhr.vo2max || '--'}</td>
                <td><div style="width:50px; height:5px; background:#333; border-radius:3px;"><div style="width:${(lab.uhr.load||5)*10}%; height:100%; background:var(--neon-blue);"></div></div></td>
                <td>${p.status && p.status.im_training ? 'FIT' : 'AUSFALL'}</td>
            </tr>`;
    });
    viewport.innerHTML = html + `</tbody></table></div>`;
}

/* ==========================================================================
   8. TACTICS BOARD (WIEDERHERGESTELLTE VOLLVERSION)
   ========================================================================== */

const tacticsCore = {
    canvas: null, ctx: null, mode: 'move', isDrawing: false, elements: [], drawingPath: [],
    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const container = document.querySelector('.tactics-stage');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        if(this.elements.length === 0) eliteStore.players.slice(0, 11).forEach(p => this.addPlayerToBoard(p.id));
        this.renderLoop();
    },
    setMode: function(newMode) {
        this.mode = newMode;
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${newMode}`).classList.add('active');
    },
    addPlayerToBoard: function(playerId) {
        const p = eliteStore.players.find(x => x.id === playerId);
        if(!p) return;
        this.elements.push({ type: 'player', id: p.id, label: p.position, name: p.name, x: this.canvas.width / 2 + (Math.random()*40-20), y: this.canvas.height / 2 + (Math.random()*40-20), color: '#ef4444', radius: 15, isDragging: false });
        this.renderLoop();
    },
    startAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        if (this.mode === 'move') {
            this.elements.forEach(el => { if(el.type === 'player') { const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2); if (dist < el.radius + 5) el.isDragging = true; } });
        } else if (this.mode === 'draw') { this.isDrawing = true; this.drawingPath = [{x, y}]; }
    },
    moveAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left; const y = e.clientY - rect.top;
        if (this.mode === 'move') { this.elements.forEach(el => { if (el.isDragging) { el.x = x; el.y = y; } }); this.renderLoop(); }
        else if (this.mode === 'draw' && this.isDrawing) { this.drawingPath.push({x, y}); this.renderLoop(); }
    },
    endAction: function() {
        if (this.mode === 'move') { this.elements.forEach(el => el.isDragging = false); }
        else if (this.mode === 'draw' && this.isDrawing) { this.isDrawing = false; this.elements.push({ type: 'path', points: [...this.drawingPath], color: '#ffff00', width: 3 }); this.drawingPath = []; this.renderLoop(); }
    },
    clearBoard: function() { this.elements = []; this.renderLoop(); },
    exportImage: function() { const l = document.createElement('a'); l.download = 'toni-matchplan.png'; l.href = this.canvas.toDataURL(); l.click(); },
    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.elements.filter(e => e.type === 'path').forEach(path => {
            this.ctx.beginPath(); this.ctx.strokeStyle = path.color; this.ctx.lineWidth = path.width;
            if(path.points.length > 0) { this.ctx.moveTo(path.points[0].x, path.points[0].y); path.points.forEach(p => this.ctx.lineTo(p.x, p.y)); this.ctx.stroke(); }
        });
        if (this.isDrawing && this.drawingPath.length > 0) {
            this.ctx.beginPath(); this.ctx.strokeStyle = '#ffff00'; this.ctx.lineWidth = 3;
            this.ctx.moveTo(this.drawingPath[0].x, this.drawingPath[0].y); this.drawingPath.forEach(p => this.ctx.lineTo(p.x, p.y)); this.ctx.stroke();
        }
        this.elements.filter(e => e.type === 'player').forEach(p => {
            this.ctx.beginPath(); this.ctx.arc(p.x+2, p.y+2, p.radius, 0, Math.PI * 2); this.ctx.fillStyle = 'rgba(0,0,0,0.4)'; this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); this.ctx.fillStyle = p.color; this.ctx.fill();
            this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2; this.ctx.stroke();
            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 11px Arial'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText(p.label, p.x, p.y);
            this.ctx.fillStyle = '#ccc'; this.ctx.font = '9px Arial'; this.ctx.fillText(p.name, p.x, p.y + p.radius + 12);
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    let squadHtml = eliteStore.players.map(p => `<div class="draggable-player" onclick="tacticsCore.addPlayerToBoard(${p.id})"><span><b>${p.position}</b> ${p.name}</span><i class="fa-solid fa-plus-circle" style="color:var(--neon-main)"></i></div>`).join('');
    viewport.innerHTML = `<div class="tactics-wrapper"><aside class="tactics-sidebar"><h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">WERKZEUGE</h3><div class="tool-btn active" id="btn-move" onclick="tacticsCore.setMode('move')"><i class="fa-solid fa-arrows-up-down-left-right"></i> VERSCHIEBEN</div><div class="tool-btn" id="btn-draw" onclick="tacticsCore.setMode('draw')"><i class="fa-solid fa-pen"></i> ZEICHNEN</div><div class="tool-btn" onclick="tacticsCore.clearBoard()"><i class="fa-solid fa-trash"></i> BOARD LÖSCHEN</div><div class="tool-btn" onclick="tacticsCore.exportImage()"><i class="fa-solid fa-file-export"></i> EXPORT PNG</div><hr style="border-color:#333; width:100%;"><div class="analysis-sheet"><h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px; margin-bottom:5px;">MATCHPLAN NOTIZEN</h3><textarea style="width:100%; height:120px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;"></textarea></div></aside><div class="tactics-stage"><canvas id="tactics-canvas"></canvas></div><aside class="tactics-sidebar squad-list"><h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">KADER</h3><div style="margin-top:10px;">${squadHtml}</div></aside></div>`;
}

/* ==========================================================================
   9. KALENDER, VR, WETTER & AI
   ========================================================================== */

function renderCalendar() {
    const viewport = document.getElementById('content-viewport');
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const today = (new Date().getDay() + 6) % 7; 
    let grid = days.map((day, idx) => {
        const events = eliteStore.calendar.filter(e => e.day === idx).map(e => `<div class="cal-event type-${e.type}" onclick="openAttendance(${e.id})"><b>${e.time}</b> ${e.title}</div>`).join('');
        return `<div class="cal-day ${idx === today ? 'today' : ''}"><div class="cal-day-header">${day}</div><div style="flex:1; overflow-y:auto;">${events}</div></div>`;
    }).join('');
    viewport.innerHTML = `<div class="calendar-wrapper"><div class="cal-header"><h2 style="font-family:var(--font-hud);">WOCHENPLANUNG</h2><button class="btn-save" onclick="document.getElementById('modal-event-create').classList.remove('hidden')">+ TERMIN</button></div><div class="cal-grid">${grid}</div></div>`;
}

function openAttendance(eventId) {
    const evt = eliteStore.calendar.find(e => e.id === eventId);
    if(!evt) return;
    document.getElementById('modal-attendance').classList.remove('hidden');
    document.getElementById('att-evt-title').innerText = evt.title;
    document.getElementById('att-evt-id').value = evt.id;
    document.getElementById('attendance-list').innerHTML = eliteStore.players.map(p => {
        const present = evt.attendance && evt.attendance.find(a => a.playerId === p.id && a.present);
        return `<div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #333;"><span>${p.name}</span><input type="checkbox" class="att-check" data-pid="${p.id}" ${present ? 'checked' : ''}></div>`;
    }).join('');
}

function saveAttendance() {
    const id = parseInt(document.getElementById('att-evt-id').value);
    const evt = eliteStore.calendar.find(e => e.id === id);
    const newAtt = [];
    document.querySelectorAll('.att-check').forEach(c => newAtt.push({ playerId: parseInt(c.dataset.pid), present: c.checked }));
    evt.attendance = newAtt; localStorage.setItem('toni_calendar', JSON.stringify(eliteStore.calendar));
    renderCalendar(); closeModal('modal-attendance');
}

function updateKPIs() {
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €";
    // Wetter im Header
    const w = document.getElementById('weather-display');
    if(w) w.innerHTML = `<i class="fa-solid fa-cloud-sun"></i> ${eliteStore.mgmt.liveData.temp}°C`;
}

async function fetchWeatherData() {
    try {
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=9.4&current_weather=true");
        const d = await r.json(); 
        eliteStore.mgmt.liveData.temp = d.current_weather.temperature;
        updateKPIs();
    } catch(e){}
}

function initVRHub() { document.getElementById('match-simulation-layer').innerHTML='<a-text value="VR MODE" position="0 1.6 -2" color="white"></a-text>'; }
function exitVRMode() { loadModule('kader'); }

// AI SYSTEM & CHAT
function checkAIConnection() { document.getElementById('ai-status-text').innerText = USER_API_KEY ? "AI: ONLINE" : "AI: OFFLINE"; }
const voiceEngine = { 
    init:()=>{
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(window.SpeechRecognition){
            const r = new SpeechRecognition(); r.lang='de-DE'; 
            r.onresult = (e) => aiAgent.ask(e.results[e.results.length-1][0].transcript);
        }
    }, 
    speak:(t)=>{ 
        const u = new SpeechSynthesisUtterance(t); u.lang='de-DE'; window.speechSynthesis.speak(u);
        const s=document.getElementById('chat-stream'); 
        if(s)s.innerHTML+=`<div class="msg ai"><div class="msg-header">TONI</div><div class="msg-body">${t}</div></div>`; 
    },
    toggle:()=>{ /* activation logic */ }
};
const aiAgent = {
    ask: async function(prompt) {
        const s = document.getElementById('chat-stream');
        s.innerHTML += `<div class="msg user"><div class="msg-header">USER</div><div class="msg-body">${prompt}</div></div>`;
        if(!USER_API_KEY) { voiceEngine.speak("Neural Link offline."); return; }
        try {
            const r = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${USER_API_KEY}` },
                body: JSON.stringify({ model: "gpt-4", messages: [{role: "system", content: "Du bist Toni, ein Elite-Trainer."}, {role: "user", content: prompt}] })
            });
            const d = await r.json(); voiceEngine.speak(d.choices[0].message.content);
        } catch (e) { console.error(e); }
    }
};
function askToni() { const i=document.getElementById('toni-input'); if(i.value){ aiAgent.ask(i.value); i.value=""; } }
function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openSysConfig() { document.getElementById('modal-sys-config').classList.remove('hidden'); }
function saveSystemConfig() {
    const k = document.getElementById('input-api-key').value;
    if(k.startsWith("sk-")) { localStorage.setItem('toni_api_key', k); USER_API_KEY = k; checkAIConnection(); closeModal('modal-sys-config'); }
}
function clearSystemConfig() { localStorage.removeItem('toni_api_key'); USER_API_KEY=""; checkAIConnection(); }
