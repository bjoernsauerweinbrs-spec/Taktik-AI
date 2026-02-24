/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V11.0 - HIGH TECH LAB)
   ========================================================================== */

// 1. KONFIGURATION & DATENBANK
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// ZENTRALER STATE (Der "RAM" des Systems)
const eliteStore = {
    players: [], // Wird jetzt von GitHub geladen
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { id: 1, day: 1, time: "10:00", title: "Laktattest", type: "physio", attendance: [] },
        { id: 2, day: 1, time: "15:00", title: "Team-Training", type: "training", attendance: [] },
        { id: 3, day: 5, time: "15:30", title: "Ligaspiel vs. BVB", type: "match", attendance: [] }
    ],
    mgmt: {
        liquidAssets: 12500000,
        infrastructure: { medicalLevel: 5, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" }
    },
    activeModule: 'kader' // Start-Modul
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
    console.log("TONI 2.0: Booting Bio-Metrics...");
    
    // 1. Uhrzeit starten
    updateClock(); 
    setInterval(updateClock, 1000);
    
    // 2. KI Status
    checkAIConnection();
    
    // 3. GitHub Daten laden
    await syncWithGitHub();

    // 4. Wetter laden
    fetchWeatherData();
    
    // 5. Styles für das neue Labor injizieren
    injectLabStyles();
    
    // 6. Erstes Modul rendern
    loadModule(eliteStore.activeModule);
    voiceEngine.init();
}

// NEU: Daten von GitHub holen
async function syncWithGitHub() {
    try {
        const response = await fetch(GITHUB_REPO_URL);
        if (!response.ok) throw new Error("GitHub nicht erreichbar");
        
        const data = await response.json();
        
        if(data.kader_toni) {
            eliteStore.players = data.kader_toni;
            console.log("✅ GITHUB: Kader synchronisiert (" + eliteStore.players.length + " Spieler)");
        }
        
        if(data.config && data.config.budget) {
            eliteStore.mgmt.liquidAssets = data.config.budget;
        }
        updateKPIs();

    } catch (error) {
        console.error("❌ GITHUB FEHLER:", error);
        alert("OFFLINE MODE: Konnte keine Daten von GitHub laden. Nutze lokalen Cache.");
        const local = localStorage.getItem('toni_players_backup');
        if(local) eliteStore.players = JSON.parse(local);
    }
}

// CSS Injection für das neue Labor-Design (Overlay)
function injectLabStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        /* LABOR OVERLAY STYLES */
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 8000; padding: 20px; display: flex; flex-direction: column; backdrop-filter: blur(10px); }
        .lab-grid { display: grid; grid-template-columns: 280px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 20px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .lab-title { font-family: var(--font-hud); color: var(--neon-blue); border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px; font-size: 14px; letter-spacing: 2px; }
        
        /* WAAGE INTERFACE */
        .scale-display { background: #000; border: 4px solid #333; border-radius: 10px; padding: 20px; text-align: center; color: var(--neon-main); font-family: monospace; font-size: 32px; margin-bottom: 20px; box-shadow: inset 0 0 20px rgba(0,255,65,0.2); text-shadow: 0 0 10px var(--neon-main); }
        .bio-input-group { background: rgba(255,255,255,0.05); padding: 10px; border-radius: 4px; margin-bottom: 5px; }
        .bio-label { display: block; font-size: 10px; color: #aaa; margin-bottom: 5px; font-family: var(--font-hud); }
        .bio-val { background: transparent; border: none; color: white; font-family: var(--font-hud); font-size: 16px; width: 100%; text-align: center; border-bottom: 1px solid #555; }
        .bio-val:focus { border-color: var(--neon-blue); }

        /* WATCH INTERFACE */
        .watch-face { width: 150px; height: 150px; border-radius: 50%; border: 6px solid #333; margin: 0 auto 20px; position: relative; background: radial-gradient(circle, #222, #000); display: flex; align-items: center; justify-content: center; flex-direction: column; box-shadow: 0 0 30px rgba(0,243,255,0.1); }
        .watch-time { color: white; font-size: 24px; font-family: var(--font-hud); }
        .watch-bpm { color: var(--neon-alert); font-size: 14px; margin-top: 5px; animation: pulse 1s infinite; }
        .metric-row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 5px; align-items: center; }
        
        /* TREND ARROWS */
        .trend-up { color: var(--neon-main); }
        .trend-down { color: var(--neon-alert); }
        .trend-flat { color: var(--neon-warn); }
        .analysis-chart-bar { height: 6px; background: #333; border-radius: 3px; overflow: hidden; margin-top: 5px; }
        .analysis-fill { height: 100%; background: var(--neon-blue); width: 0%; transition: width 1s; }
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
    
    // UI Cleanup
    viewport.classList.remove('hidden');
    viewport.innerHTML = ""; // Clear Viewport for manual rendering modules
    vrViewport.classList.add('hidden');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    
    // Routing
    if(modId === 'kader') renderSquadOverview();
    if(modId === 'analysis') renderAnalysisCenter(); // NEU: Aktentasche
    if(modId === 'finance') renderFinanceLab();
    if(modId === 'stadionzeitung') renderNewspaperCMS();
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
   4. KADER OVERVIEW (READ ONLY - CLICK TO OPEN LAB)
   ========================================================================== */

function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    
    let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-family:var(--font-hud); color:white;">ELITE KADER ÜBERSICHT</h2>
        <div style="font-size:10px; color:var(--text-dim);">KLICKE AUF EINEN SPIELER FÜR DAS BIO-LABOR</div>
        <button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER</button>
    </div>
    <div class="kader-grid">`;

    eliteStore.players.forEach(p => {
        const stat = p.status || { im_kader: true, im_training: true };
        const opacity = stat.im_training ? "1" : "0.5";
        const borderCol = stat.im_kader ? "var(--neon-main)" : "#444";
        const img = p.img_url || "https://cdn-icons-png.flaticon.com/512/21/21104.png";
        
        // Vereinfachte Karte nur für Anzeige
        html += `
        <div class="fifa-card" style="opacity:${opacity}; border-color:${borderCol}; cursor:pointer;" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-rating">${p.rating || 75}</div>
                    <img src="${img}" class="player-img" alt="${p.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
                    <div class="card-info">
                        <div class="card-name">${p.name}</div>
                        <div class="card-pos">${p.position}</div>
                        <div style="text-align:center; margin-top:10px; font-size:10px; color:var(--neon-blue); border-top:1px solid #333; padding-top:5px;">
                            <i class="fa-solid fa-microscope"></i> ANALYSE ÖFFNEN
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    html += `</div>`;
    viewport.innerHTML = html;
}

/* ==========================================================================
   5. BIO LAB (THE POPUP OVERLAY)
   ========================================================================== */

function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    
    // Fallback für neuen Spieler (-1) oder fehlende Daten
    if(!p && id === -1) {
        p = { id: -1, name: "Neuer Spieler", position: "ST", rating: 75, status: {im_kader:true, im_training:true}, fifa_stats:{}, labor_daten:{waage:{}, uhr:{}}, img_url:"" };
    }
    
    const lab = p.labor_daten || { waage: {}, uhr: {}, history: {} };
    const s = p.fifa_stats || {pac:0, sho:0, pas:0, dri:0, def:0, phy:0};

    // Overlay erstellen
    const overlay = document.createElement('div');
    overlay.className = 'lab-overlay';
    overlay.id = 'active-bio-lab';
    
    overlay.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:15px;">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${p.img_url || 'https://cdn-icons-png.flaticon.com/512/21/21104.png'}" style="width:50px; height:50px; border-radius:50%; border:2px solid var(--neon-blue);">
                <div>
                    <h1 style="font-family:var(--font-hud); font-size:24px; color:white; margin:0;">${p.name.toUpperCase()}</h1>
                    <span style="color:var(--neon-blue); font-size:10px;">ID: ${p.id === -1 ? 'NEW' : p.id} // MEDICAL CENTER ACCESS GRANTED</span>
                </div>
            </div>
            <div>
                <button class="btn-save" onclick="saveBioLab(${p.id})"><i class="fa-solid fa-briefcase"></i> DATEN IN AKTENTASCHE ÜBERTRAGEN</button>
                <button class="btn-cancel" onclick="closeBioLab()">SCHLIESSEN</button>
            </div>
        </div>

        <div class="lab-grid">
            
            <div class="lab-panel" style="border-color:var(--neon-main);">
                <div class="lab-title">FIFA IDENTITÄT & STATUS</div>
                
                <div class="bio-input-group">
                    <span class="bio-label">NAME</span>
                    <input type="text" class="bio-val" value="${p.name}" onchange="tempUpdate(${p.id}, 'name', this.value)">
                </div>
                
                <div style="display:flex; gap:10px;">
                    <div class="bio-input-group" style="flex:1;">
                        <span class="bio-label">RATING</span>
                        <input type="number" class="bio-val" value="${p.rating}" onchange="tempUpdate(${p.id}, 'rating', this.value)">
                    </div>
                    <div class="bio-input-group" style="flex:1;">
                        <span class="bio-label">POS</span>
                        <input type="text" class="bio-val" value="${p.position}" onchange="tempUpdate(${p.id}, 'pos', this.value)">
                    </div>
                </div>
                 <div class="bio-input-group">
                    <span class="bio-label">BILD URL</span>
                    <input type="text" class="bio-val" value="${p.img_url}" style="font-size:10px;" onchange="tempUpdate(${p.id}, 'img', this.value)">
                </div>

                <div style="margin-top:20px; border-top:1px solid #333; padding-top:10px;">
                    <span class="bio-label" style="color:var(--neon-main); margin-bottom:10px;">GAME STATS</span>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                        <input type="number" class="bio-val" value="${s.pac}" placeholder="PAC" title="Pace" onchange="tempUpdate(${p.id}, 'pac', this.value)">
                        <input type="number" class="bio-val" value="${s.sho}" placeholder="SHO" title="Shooting" onchange="tempUpdate(${p.id}, 'sho', this.value)">
                        <input type="number" class="bio-val" value="${s.pas}" placeholder="PAS" title="Passing" onchange="tempUpdate(${p.id}, 'pas', this.value)">
                        <input type="number" class="bio-val" value="${s.dri}" placeholder="DRI" title="Dribbling" onchange="tempUpdate(${p.id}, 'dri', this.value)">
                        <input type="number" class="bio-val" value="${s.def}" placeholder="DEF" title="Defense" onchange="tempUpdate(${p.id}, 'def', this.value)">
                        <input type="number" class="bio-val" value="${s.phy}" placeholder="PHY" title="Physical" onchange="tempUpdate(${p.id}, 'phy', this.value)">
                    </div>
                </div>

                <div style="margin-top:auto;">
                    <span class="bio-label">VERFÜGBARKEIT</span>
                    <div style="display:flex; gap:5px;">
                        <button class="toggle-btn ${p.status && p.status.im_kader ? 'active' : ''}" onclick="toggleStatusLab(${p.id}, 'kader')">KADER</button>
                        <button class="toggle-btn ${p.status && p.status.im_training ? 'active' : 'absent'}" onclick="toggleStatusLab(${p.id}, 'training')">TRAINING</button>
                    </div>
                </div>
            </div>

            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-weight-scale"></i> BODY ANALYZER</div>
                
                <div class="scale-display">
                    <span id="scale-val-display">${lab.waage.gewicht || 0}</span> <span style="font-size:14px;">KG</span>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                    <div class="bio-input-group">
                        <span class="bio-label">GEWICHT (KG)</span>
                        <input type="number" class="bio-val" value="${lab.waage.gewicht || 0}" oninput="document.getElementById('scale-val-display').innerText=this.value" onchange="updateDeepData(${p.id}, 'waage', 'gewicht', this.value)">
                    </div>
                    <div class="bio-input-group">
                        <span class="bio-label">KÖRPERFETT (KFA %)</span>
                        <input type="number" class="bio-val" value="${lab.waage.kfa || 0}" onchange="updateDeepData(${p.id}, 'waage', 'kfa', this.value)">
                    </div>
                    <div class="bio-input-group">
                        <span class="bio-label">MUSKELMASSE (KG)</span>
                        <input type="number" class="bio-val" value="${lab.waage.muskel_kg || 0}" onchange="updateDeepData(${p.id}, 'waage', 'muskel_kg', this.value)">
                    </div>
                    <div class="bio-input-group">
                        <span class="bio-label">WASSERANTEIL (%)</span>
                        <input type="number" class="bio-val" value="${lab.waage.wasser_prozent || 0}" onchange="updateDeepData(${p.id}, 'waage', 'wasser_prozent', this.value)">
                    </div>
                    <div class="bio-input-group">
                        <span class="bio-label">VISZERALFETT (1-15)</span>
                        <input type="number" class="bio-val" value="${lab.waage.viszeralfett || 0}" onchange="updateDeepData(${p.id}, 'waage', 'viszeralfett', this.value)">
                    </div>
                    <div class="bio-input-group">
                        <span class="bio-label">METABOLIC AGE</span>
                        <input type="number" class="bio-val" value="${lab.waage.metabolic_age || 0}" onchange="updateDeepData(${p.id}, 'waage', 'metabolic_age', this.value)">
                    </div>
                </div>
                
                <div style="margin-top:20px; padding:15px; background:rgba(255,174,0,0.1); border:1px solid var(--neon-warn); border-radius:4px; text-align:center;">
                    <span class="bio-label" style="color:var(--neon-warn)">LIVE BMI RECHNER (Basis 1.85m)</span>
                    <div id="bmi-calc" style="font-size:24px; font-weight:bold; font-family:var(--font-hud);">${lab.waage.bmi || '--'}</div>
                </div>
            </div>

            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-stopwatch"></i> SMART PERFORMANCE</div>
                
                <div class="watch-face">
                    <div class="watch-time" id="watch-time-display">00:00</div>
                    <div class="watch-bpm"><i class="fa-solid fa-heart"></i> <span id="watch-bpm-disp">${lab.uhr.ruhepuls || '--'}</span></div>
                </div>

                <div style="margin-top:10px;">
                    <div class="metric-row">
                        <span class="bio-label">RUHEPULS</span>
                        <input type="number" style="width:60px; background:none; border:none; color:white; text-align:right; font-family:var(--font-hud);" value="${lab.uhr.ruhepuls || 0}" oninput="document.getElementById('watch-bpm-disp').innerText=this.value" onchange="updateDeepData(${p.id}, 'uhr', 'ruhepuls', this.value)">
                    </div>
                    <div class="metric-row">
                        <span class="bio-label">HERZVARIABILITÄT (HRV)</span>
                        <input type="number" style="width:60px; background:none; border:none; color:white; text-align:right; font-family:var(--font-hud);" value="${lab.uhr.hrv || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'hrv', this.value)">
                    </div>
                    <div class="metric-row">
                        <span class="bio-label">VO2 MAX (Ausdauer)</span>
                        <input type="number" style="width:60px; background:none; border:none; color:white; text-align:right; font-family:var(--font-hud);" value="${lab.uhr.vo2max || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'vo2max', this.value)">
                    </div>
                    <div class="metric-row">
                        <span class="bio-label">SAUERSTOFF (SPO2 %)</span>
                        <input type="number" style="width:60px; background:none; border:none; color:white; text-align:right; font-family:var(--font-hud);" value="${lab.uhr.spo2 || 98}" onchange="updateDeepData(${p.id}, 'uhr', 'spo2', this.value)">
                    </div>
                    
                    <span class="bio-label" style="margin-top:15px; color:var(--neon-blue); display:block; border-bottom:1px solid #333;">SCHLAF ARCHITEKTUR</span>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:5px; margin-top:5px;">
                        <div class="bio-input-group">
                            <span style="font-size:8px; color:#aaa;">SCORE</span>
                            <input type="number" class="bio-val" value="${lab.uhr.schlaf_score || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'schlaf_score', this.value)">
                        </div>
                        <div class="bio-input-group">
                            <span style="font-size:8px; color:#aaa;">REM (Min)</span>
                            <input type="number" class="bio-val" value="${lab.uhr.rem_schlaf_min || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'rem_schlaf_min', this.value)">
                        </div>
                        <div class="bio-input-group">
                            <span style="font-size:8px; color:#aaa;">DEEP (Min)</span>
                            <input type="number" class="bio-val" value="${lab.uhr.tief_schlaf_min || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'tief_schlaf_min', this.value)">
                        </div>
                    </div>

                     <div style="margin-top:15px;">
                        <span class="bio-label">BELASTUNG (TRAINING LOAD 1-10)</span>
                        <div class="analysis-chart-bar"><div class="analysis-fill" style="width:${(lab.uhr.belastung || 5)*10}%"></div></div>
                         <input type="number" class="bio-val" style="margin-top:5px;" value="${lab.uhr.belastung || 0}" onchange="updateDeepData(${p.id}, 'uhr', 'belastung', this.value)">
                    </div>
                </div>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);
    
    // Uhr Animation starten
    const watchInterval = setInterval(() => {
        const d = new Date();
        const el = document.getElementById('watch-time-display');
        if(el) el.innerText = d.getHours() + ":" + (d.getMinutes()<10?'0':'') + d.getMinutes();
        else clearInterval(watchInterval);
    }, 1000);
}

function closeBioLab() {
    const overlay = document.getElementById('active-bio-lab');
    if(overlay) overlay.remove();
    loadModule('kader'); // Refresh Main View
}

function saveBioLab(id) {
    // Hier simulieren wir die Übertragung an das Analysezentrum
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    voiceEngine.speak("Datensatz gespeichert und an das Analysezentrum übertragen.");
    closeBioLab();
}

// UPDATE LOGIC FÜR DAS LABOR
function tempUpdate(id, key, val) {
    let p = eliteStore.players.find(x => x.id === id);
    if(id === -1 && !p) { /* Logic for new player creation pending save */ } 
    if(!p) return;

    if(key === 'name') p.name = val;
    if(key === 'rating') p.rating = parseInt(val);
    if(key === 'pos') p.position = val;
    if(key === 'img') p.img_url = val;

    if(['pac','sho','pas','dri','def','phy'].includes(key)) {
        if(!p.fifa_stats) p.fifa_stats = {};
        p.fifa_stats[key] = parseInt(val);
    }
}

function updateDeepData(id, device, field, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;

    if(!p.labor_daten) p.labor_daten = { waage: {}, uhr: {} };
    if(!p.labor_daten[device]) p.labor_daten[device] = {};
    
    p.labor_daten[device][field] = parseFloat(val);
    
    // Live BMI Berechnung (Basis 1.85m Standardgröße für Demo)
    if(device === 'waage' && field === 'gewicht') {
        const height = 1.85; 
        const bmi = (parseFloat(val) / (height * height)).toFixed(1);
        p.labor_daten.waage.bmi = bmi;
        const bmiDisplay = document.getElementById('bmi-calc');
        if(bmiDisplay) bmiDisplay.innerText = bmi;
    }
}

function toggleStatusLab(id, type) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    if(!p.status) p.status = { im_kader: true, im_training: true };
    
    if(type === 'kader') p.status.im_kader = !p.status.im_kader;
    if(type === 'training') p.status.im_training = !p.status.im_training;
    
    // UI Refresh (Buttons neu zeichnen, Hack via re-open)
    closeBioLab();
    openBioLab(id);
}

/* ==========================================================================
   6. ANALYSEZENTRUM (DIE AKTENTASCHE)
   ========================================================================== */

function renderAnalysisCenter() {
    const viewport = document.getElementById('content-viewport');
    
    let html = `
    <h2 style="font-family:var(--font-hud); color:white; border-bottom:1px solid #333; padding-bottom:10px;">ANALYSEZENTRUM (TRENDS & VERLÄUFE)</h2>
    <div style="background:#0f172a; padding:20px; border-radius:8px; margin-top:20px; overflow-x:auto;">
        <table style="width:100%; text-align:left; color:#ccc; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom:1px solid #555; font-family:var(--font-hud); font-size:12px; color:var(--neon-blue);">
                    <th style="padding:10px;">SPIELER</th>
                    <th>RATING</th>
                    <th>GEWICHT</th>
                    <th>KFA TREND</th>
                    <th>VO2 MAX</th>
                    <th>BELASTUNG</th>
                    <th>STATUS</th>
                </tr>
            </thead>
            <tbody>`;

    eliteStore.players.forEach(p => {
        const lab = p.labor_daten || { waage: {}, uhr: {}, history: {} };
        const hist = lab.history || { trend_kfa: "stable", trend_vo2: "stable" };
        
        // Simulation von Trends basierend auf Werten
        let kfaIcon = '<i class="fa-solid fa-minus trend-flat"></i>';
        if(lab.waage.kfa < 10) kfaIcon = '<i class="fa-solid fa-arrow-trend-down trend-up"></i> (Top)';
        else if(lab.waage.kfa > 15) kfaIcon = '<i class="fa-solid fa-arrow-trend-up trend-down"></i> (Kritisch)';

        let vo2Icon = '<i class="fa-solid fa-minus trend-flat"></i>';
        if(lab.uhr.vo2max > 60) vo2Icon = '<i class="fa-solid fa-arrow-trend-up trend-up"></i> (Elite)';
        
        const load = lab.uhr.belastung || 5;
        const loadColor = load > 8 ? 'var(--neon-alert)' : (load > 6 ? 'var(--neon-warn)' : 'var(--neon-main)');

        html += `
            <tr style="border-bottom:1px solid #222;">
                <td style="padding:12px; font-weight:bold; color:white;">${p.name}</td>
                <td style="color:var(--neon-main); font-family:var(--font-hud);">${p.rating || 0}</td>
                <td>${lab.waage.gewicht || '--'} kg</td>
                <td>${kfaIcon}</td>
                <td>${lab.uhr.vo2max || '--'} ${vo2Icon}</td>
                <td style="vertical-align:middle;">
                    <div style="width:80px; height:6px; background:#333; border-radius:3px;">
                        <div style="width:${load*10}%; height:100%; background:${loadColor}; border-radius:3px;"></div>
                    </div>
                </td>
                <td>${p.status && p.status.im_training ? '<span style="color:var(--neon-main); font-size:10px; border:1px solid var(--neon-main); padding:2px 4px;">FIT</span>' : '<span style="color:var(--neon-alert); font-size:10px; border:1px solid var(--neon-alert); padding:2px 4px;">ABWESEND</span>'}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    viewport.innerHTML = html;
}

/* ==========================================================================
   7. RESTLICHE MODULE (FINANCE, CALENDAR, TACTICS)
   ========================================================================== */

function renderFinanceLab() {
    const m = eliteStore.mgmt;
    document.getElementById('content-viewport').innerHTML = `
        <div class="mgmt-dashboard">
            <div class="mgmt-card">
                <h3>LIVE UMWELTDATEN</h3>
                <div class="roi-indicator">${m.liveData.temp}°C</div>
                <div style="color:${m.liveData.condition.includes('Regen') ? 'red' : 'var(--neon-main)'}">${m.liveData.condition} / Wind: ${m.liveData.wind} km/h</div>
            </div>
            <div class="mgmt-card">
                <h3>VEREINSKONTO</h3>
                <div class="roi-indicator">${m.liquidAssets.toLocaleString()} €</div>
                <div style="font-size:10px; color:#aaa; margin-top:10px;">AKTUELLES BUDGET</div>
            </div>
        </div>`;
}

function renderNewspaperCMS() {
    document.getElementById('content-viewport').innerHTML = `
        <div class="newspaper-wrapper" style="background:white; color:black; padding:40px;">
            <h1 style="font-family:serif; border-bottom:2px solid black;">RB LEIPZIG UPDATE</h1>
            <p><strong>Wetter-Prognose:</strong> Bei ${eliteStore.mgmt.liveData.temp}°C wird ein schnelles Spiel erwartet.</p>
            <p><strong>Finanzen:</strong> Der Verein verfügt über liquide Mittel von ${eliteStore.mgmt.liquidAssets.toLocaleString()} €.</p>
            <button class="btn-save" style="background:black; color:white; margin-top:20px;" onclick="window.print()">DRUCKEN</button>
        </div>`;
}

// Player Editor (Legacy Helper - jetzt meist via BioLab)
function openPlayerEditor(id) {
    // Leitet jetzt direkt zum BioLab weiter, da es das neue Edit-Interface ist
    openBioLab(id);
}
function savePlayerChanges() { /* Legacy Stub */ }

// SYSTEM HELPERS
function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }
function updateKPIs() { document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
async function fetchWeatherData() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=9.4&current_weather=true");
        const data = await response.json();
        eliteStore.mgmt.liveData.temp = data.current_weather.temperature;
        eliteStore.mgmt.liveData.wind = data.current_weather.windspeed;
        let cond = "Stabil";
        if(data.current_weather.weathercode > 3) cond = "Bewölkt";
        if(data.current_weather.weathercode > 50) cond = "Regen";
        eliteStore.mgmt.liveData.condition = cond;
    } catch (e) { console.warn("Wetter Fehler"); }
}

// AI & VOICE
function openSysConfig() {
    document.getElementById('modal-sys-config').classList.remove('hidden');
    const statusDiv = document.getElementById('key-status-display');
    const input = document.getElementById('input-api-key');
    if(USER_API_KEY && USER_API_KEY.length > 10) {
        input.value = "********************";
        statusDiv.innerText = "VERBUNDEN (GESPEICHERT)";
        statusDiv.style.color = "var(--neon-main)";
    } else {
        input.value = "";
        statusDiv.innerText = "NICHT VERBUNDEN";
        statusDiv.style.color = "var(--neon-alert)";
    }
}
function saveSystemConfig() {
    const input = document.getElementById('input-api-key').value;
    if(input && input.startsWith("sk-")) {
        localStorage.setItem('toni_api_key', input);
        USER_API_KEY = input;
        alert("Neural Link hergestellt. Toni ist jetzt online.");
        closeModal('modal-sys-config');
        checkAIConnection();
    } else if (input.includes("***")) { closeModal('modal-sys-config'); }
    else { alert("Ungültiges Format."); }
}
function clearSystemConfig() {
    localStorage.removeItem('toni_api_key');
    USER_API_KEY = "";
    document.getElementById('input-api-key').value = "";
    alert("Key gelöscht.");
    openSysConfig();
    checkAIConnection();
}
function checkAIConnection() {
    const visualizer = document.getElementById('ai-status-text');
    if(USER_API_KEY) {
        visualizer.innerText = "NEURAL LINK: ONLINE (GPT-4)";
        visualizer.style.color = "var(--neon-main)";
    } else {
        visualizer.innerText = "NEURAL LINK: OFFLINE (SIMULATION)";
        visualizer.style.color = "var(--neon-warn)";
    }
}
const aiAgent = {
    ask: async function(prompt) {
        addChatMessage("USER", prompt);
        if(!USER_API_KEY) {
            setTimeout(() => {
                let reply = "Ich laufe im Simulations-Modus. Bitte API Key hinterlegen.";
                if(prompt.toLowerCase().includes("wetter")) reply = `Live-Daten: ${eliteStore.mgmt.liveData.temp}°C, ${eliteStore.mgmt.liveData.condition}.`;
                voiceEngine.speak(reply);
            }, 600);
            return;
        }
        try {
            const systemContext = `Du bist Toni, ein Elite-Co-Trainer. Wetter: ${eliteStore.mgmt.liveData.temp}°C.`;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${USER_API_KEY}` },
                body: JSON.stringify({ model: "gpt-4", messages: [{role: "system", content: systemContext}, {role: "user", content: prompt}], temperature: 0.7 })
            });
            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            voiceEngine.speak(data.choices[0].message.content);
        } catch (error) { addChatMessage("SYSTEM", "KI Fehler: " + error.message); }
    }
};
const voiceEngine = {
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => aiAgent.ask(e.results[e.results.length - 1][0].transcript);
        }
    },
    speak: function(text) {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE';
        window.speechSynthesis.speak(u);
        addChatMessage("TONI AI", text);
    },
    toggle: function() { if(this.recognition) this.recognition.start(); }
};
function askToni() {
    const input = document.getElementById('toni-input');
    if(input.value.trim() === "") return;
    aiAgent.ask(input.value);
    input.value = "";
}
function addChatMessage(sender, text) {
    const s = document.getElementById('chat-stream');
    s.innerHTML += `<div class="msg ${sender==='USER'?'user':'ai'}"><div class="msg-header">${sender}</div><div class="msg-body">${text}</div></div>`;
    s.scrollTop = s.scrollHeight;
}

// TACTICS & CALENDAR & VR (UNCHANGED CORE LOGIC)
function renderCalendar() { /* Siehe oben V10.0 Code, hier integriert */ 
    const viewport = document.getElementById('content-viewport');
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const todayIndex = (new Date().getDay() + 6) % 7; 
    let gridHtml = days.map((day, index) => {
        const dayEvents = eliteStore.calendar.filter(e => e.day === index).sort((a,b) => a.time.localeCompare(b.time));
        let eventsHtml = dayEvents.map(e => {
            const attendingCount = e.attendance ? e.attendance.filter(a => a.present).length : 0;
            return `<div class="cal-event type-${e.type}" onclick="openAttendance(${e.id})"><div style="font-weight:bold;">${e.time}</div><div>${e.title}</div><div class="attendance-badge"><i class="fa-solid fa-users"></i> ${attendingCount}</div></div>`;
        }).join('');
        return `<div class="cal-day ${index === todayIndex ? 'today' : ''}"><div class="cal-day-header">${day}</div><div style="flex:1; overflow-y:auto;">${eventsHtml}</div></div>`;
    }).join('');
    viewport.innerHTML = `<div class="calendar-wrapper"><div class="cal-header"><h2 style="font-family:var(--font-hud);">WOCHENPLANUNG</h2><button class="btn-save" onclick="document.getElementById('modal-event-create').classList.remove('hidden')">+ TERMIN</button></div><div class="cal-grid">${gridHtml}</div></div>`;
}

function createEvent() {
    const title = document.getElementById('evt-title').value;
    const day = parseInt(document.getElementById('evt-day').value);
    const time = document.getElementById('evt-time').value;
    const type = document.getElementById('evt-type').value;
    if(title) {
        const initialAttendance = eliteStore.players.map(p => ({ playerId: p.id, present: false }));
        eliteStore.calendar.push({ id: Date.now(), day, time, title, type, attendance: initialAttendance });
        localStorage.setItem('toni_calendar', JSON.stringify(eliteStore.calendar));
        renderCalendar();
        closeModal('modal-event-create');
        voiceEngine.speak("Termin erstellt.");
    }
}
function openAttendance(eventId) {
    const evt = eliteStore.calendar.find(e => e.id === eventId);
    if(!evt) return;
    document.getElementById('modal-attendance').classList.remove('hidden');
    document.getElementById('att-evt-title').innerText = evt.title;
    document.getElementById('att-evt-id').value = evt.id;
    const list = document.getElementById('attendance-list');
    list.innerHTML = eliteStore.players.map(p => {
        const status = evt.attendance ? evt.attendance.find(a => a.playerId === p.id) : null;
        return `<div style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid #333;"><span>${p.name}</span><input type="checkbox" class="att-check" data-pid="${p.id}" ${status && status.present ? 'checked' : ''} style="width:20px; height:20px;"></div>`;
    }).join('');
}
function saveAttendance() {
    const eventId = parseInt(document.getElementById('att-evt-id').value);
    const evt = eliteStore.calendar.find(e => e.id === eventId);
    const checks = document.querySelectorAll('.att-check');
    const newAttendance = [];
    checks.forEach(c => newAttendance.push({ playerId: parseInt(c.dataset.pid), present: c.checked }));
    evt.attendance = newAttendance;
    localStorage.setItem('toni_calendar', JSON.stringify(eliteStore.calendar));
    renderCalendar();
    closeModal('modal-attendance');
    voiceEngine.speak("Anwesenheit gespeichert.");
}
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
}

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
        this.elements.push({ type: 'player', id: p.id, label: p.number || "?", name: p.name, x: this.canvas.width / 2 + (Math.random() * 60 - 30), y: this.canvas.height / 2 + (Math.random() * 60 - 30), color: '#ef4444', radius: 14, isDragging: false });
        this.renderLoop();
    },
    startAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.mode === 'move') {
            this.elements.forEach(el => { if(el.type === 'player') { const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2); if (dist < el.radius + 10) el.isDragging = true; } });
        } else if (this.mode === 'draw') { this.isDrawing = true; this.drawingPath = [{x, y}]; }
    },
    moveAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.mode === 'move') { this.elements.forEach(el => { if (el.isDragging) { el.x = x; el.y = y; } }); this.renderLoop(); }
        else if (this.mode === 'draw' && this.isDrawing) { this.drawingPath.push({x, y}); this.renderLoop(); }
    },
    endAction: function(e) {
        if (this.mode === 'move') { this.elements.forEach(el => el.isDragging = false); }
        else if (this.mode === 'draw' && this.isDrawing) { this.isDrawing = false; this.elements.push({ type: 'path', points: [...this.drawingPath], color: '#ffff00', width: 3 }); this.drawingPath = []; this.renderLoop(); }
    },
    clearBoard: function() { this.elements = []; this.renderLoop(); },
    exportImage: function() { const link = document.createElement('a'); link.download = 'toni-matchplan.png'; link.href = this.canvas.toDataURL(); link.click(); },
    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.elements.filter(e => e.type === 'path').forEach(path => {
            this.ctx.beginPath(); this.ctx.strokeStyle = path.color; this.ctx.lineWidth = path.width;
            if(path.points.length > 0) { this.ctx.moveTo(path.points[0].x, path.points[0].y); path.points.forEach(p => this.ctx.lineTo(p.x, p.y)); this.ctx.stroke(); }
        });
        if (this.isDrawing && this.drawingPath.length > 0) { this.ctx.beginPath(); this.ctx.strokeStyle = '#ffff00'; this.ctx.lineWidth = 3; this.ctx.moveTo(this.drawingPath[0].x, this.drawingPath[0].y); this.drawingPath.forEach(p => this.ctx.lineTo(p.x, p.y)); this.ctx.stroke(); }
        this.elements.filter(e => e.type === 'player').forEach(p => {
            this.ctx.beginPath(); this.ctx.arc(p.x+2, p.y+2, p.radius, 0, Math.PI * 2); this.ctx.fillStyle = 'rgba(0,0,0,0.5)'; this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); this.ctx.fillStyle = p.color; this.ctx.fill(); this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2; this.ctx.stroke();
            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 12px Arial'; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle'; this.ctx.fillText(p.label, p.x, p.y);
            this.ctx.fillStyle = '#ccc'; this.ctx.font = '9px Arial'; this.ctx.fillText(p.name, p.x, p.y + p.radius + 12);
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    let squadHtml = eliteStore.players.map(p => `<div class="draggable-player" onclick="tacticsCore.addPlayerToBoard(${p.id})"><span><b>${p.position}</b> ${p.name}</span><i class="fa-solid fa-plus-circle" style="color:var(--neon-main)"></i></div>`).join('');
    viewport.innerHTML = `<div class="tactics-wrapper"><aside class="tactics-sidebar"><h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">WERKZEUGE</h3><div class="tool-btn active" id="btn-move" onclick="tacticsCore.setMode('move')"><i class="fa-solid fa-arrows-up-down-left-right"></i> VERSCHIEBEN</div><div class="tool-btn" id="btn-draw" onclick="tacticsCore.setMode('draw')"><i class="fa-solid fa-pen"></i> ZEICHNEN</div><div class="tool-btn" onclick="tacticsCore.clearBoard()"><i class="fa-solid fa-trash"></i> BOARD LÖSCHEN</div><div class="tool-btn" onclick="tacticsCore.exportImage()"><i class="fa-solid fa-file-export"></i> EXPORT PNG</div><hr style="border-color:#333; width:100%;"><div class="analysis-sheet"><h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px; margin-bottom:5px;">MATCHPLAN NOTIZEN</h3><textarea style="width:100%; height:120px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;"></textarea></div></aside><div class="tactics-stage"><canvas id="tactics-canvas"></canvas></div><aside class="tactics-sidebar squad-list"><h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">KADER</h3><div style="margin-top:10px;">${squadHtml}</div></aside></div>`;
}

// VR STUBS
function initVRHub() { const container = document.getElementById('match-simulation-layer'); if(container) container.innerHTML = '<a-text value="VR MODUL - BITTE HEADSET AUFSETZEN" position="-2 1.6 -3" color="white"></a-text>'; }
function exitVRMode() { loadModule('kader'); }
