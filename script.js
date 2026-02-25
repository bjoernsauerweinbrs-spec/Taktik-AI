/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE (V15.8 - FULL RECONSTRUCTION)
   BLOCK 1 VON 6: CORE CONFIG & GLOBAL STATE
   ========================================================================== */

// 1. SYSTEM SETTINGS
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// 2. DER GLOBALE SPEICHER (DER "STATE")
// Hier definieren wir jedes Detail, damit wir später darauf zugreifen können.
const eliteStore = {
    players: [], // Wird via GitHub oder generateDefaultSquad gefüllt
    
    // PERSONAL & STAFF
    staff: JSON.parse(localStorage.getItem('toni_staff')) || [
        { id: 1, role: "Co-Trainer", name: "Hansi M.", salary: 5000, effect: "Taktik-Analyse +10%", level: 3 },
        { id: 2, role: "Chef-Physio", name: "Dr. Müller", salary: 8500, effect: "Verletzungsrisiko -15%", level: 5 },
        { id: 3, role: "Chef-Scout", name: "Sven Mislintat", salary: 12000, effect: "Transfer-Wissen Pro", level: 5 }
    ],

    // KALENDER (Training, Matches, Events)
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { id: 1, day: 1, time: "10:00", title: "Laktattest (Bio-Lab)", type: "physio", attendance: [] },
        { id: 2, day: 1, time: "15:00", title: "Team-Taktik 4-4-2", type: "training", attendance: [] },
        { id: 3, day: 2, time: "11:00", title: "Sponsoren-Termin", type: "event", attendance: [] },
        { id: 4, day: 5, time: "15:30", title: "HEIMSPIEL (STADION)", type: "match", attendance: [] }
    ],

    // FINANZEN & AKTENTASCHE (Sponsoring)
    finance: JSON.parse(localStorage.getItem('toni_finance')) || [
        { id: 1, label: "TV-Rechte (Zentralvermarktung)", value: 4500000, type: "income", cat: "pro" },
        { id: 2, label: "Hauptsponsor (Brust)", value: 2500000, type: "income", cat: "pro" },
        { id: 3, label: "Ausrüster (Premium)", value: 800000, type: "income", cat: "pro" },
        { id: 4, label: "Bandenwerbung (Lokal)", value: 12500, type: "income", cat: "amateur" },
        { id: 5, label: "Spielergehälter (Gesamt)", value: 0, type: "expense", cat: "pro" }, // Auto-berechnet
        { id: 6, label: "Staff & Mitarbeiter", value: 0, type: "expense", cat: "pro" },     // Auto-berechnet
        { id: 7, label: "Stadionmiete & Betrieb", value: -125000, type: "expense", cat: "pro" },
        { id: 8, label: "Jugendförderung", value: -45000, type: "expense", cat: "pro" }
    ],

    // DIE AKTENTASCHE (ERWEITERUNGEN)
    briefcase: {
        sponsoring: {
            activeSponsors: ["Adidas", "Telekom"],
            negotiationStatus: "Läuft",
            potentialIncome: 500000
        },
        analysisCenter: {
            level: 1,
            nextUpgradeCost: 250000,
            features: ["Video-Analyse", "Neural-Tracking"]
        },
        stadiumPress: {
            lastEdition: "Ausgabe #42",
            headline: "Saisonstart geglückt!",
            status: "Druckfertig"
        }
    },

    // MEDIENZENTRUM
    gazette: {
        headline: "TRANSFERS UND TAKTIK",
        lead: "Der Neural-Advisor übernimmt die Analyse.",
        body: "Mit modernster KI-Technik analysiert der Verein nun jedes Detail der Spieler..."
    },

    // MANAGEMENT & SYSTEM-STATUS
    mgmt: {
        liquidAssets: 0,
        clubReputation: 75, // 0-100
        infrastructure: { 
            medical: 5, 
            analysis: 3,
            stadium: 4
        },
        liveData: { temp: "--", condition: "Lade...", wind: "--" },
        aiContext: "" 
    },

    activeModule: 'kader' // Start-Modul
};

// 3. INITIALISIERUNG (BOOT-LOGIK)
async function initEliteCore() {
    console.log("TONI 2.0: Starting High-End Reconstruction (V15.8)...");
    
    // Zeit-Dienste
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    
    // Daten-Sync
    await syncWithGitHub();
    
    // Datenbank auf V15.8 Tiefe bringen
    upgradeDatabaseToFullDetail();

    // System-Ready
    fetchWeatherData();
    injectFullStyles(); // Kommt in Block 2
    updateFinanceTotals();
    
    // Modul laden
    loadModule(eliteStore.activeModule);
    
    // Sprachsteuerung & Mikrofon
    voiceEngine.init();
}

// 4. DEEP-DATABASE UPGRADE (Detaillierung der Daten)
function upgradeDatabaseToFullDetail() {
    // Falls keine Spieler da sind (Erster Start)
    if(eliteStore.players.length === 0) {
        generateHighDetailSquad();
    }
    
    // Fehlende Felder bei bestehenden Spielern ergänzen
    eliteStore.players.forEach(p => {
        // V15.8 Finanz-Daten
        if(!p.salary) p.salary = Math.round((p.rating || 60) * 2800);
        if(!p.contract_exp) p.contract_exp = 2026 + Math.floor(Math.random() * 4);
        if(!p.market_value) p.market_value = (p.rating || 60) * 185000;
        
        // V15.8 Medical-Daten (Bio-Lab Tiefe)
        if(!p.labor_daten) p.labor_daten = { waage: {}, uhr: {} };
        if(!p.labor_daten.waage.gewicht) p.labor_daten.waage.gewicht = 75 + Math.floor(Math.random() * 10);
        if(!p.labor_daten.waage.kfa) p.labor_daten.waage.kfa = 8 + Math.floor(Math.random() * 6);
        if(!p.labor_daten.waage.muskel_kg) p.labor_daten.waage.muskel_kg = 38 + Math.floor(Math.random() * 5);
        if(!p.labor_daten.waage.wasser) p.labor_daten.waage.wasser = 62 + Math.floor(Math.random() * 5);
        if(!p.labor_daten.waage.viszeral) p.labor_daten.waage.viszeral = 4 + Math.floor(Math.random() * 3);
        if(!p.labor_daten.waage.metabolic) p.labor_daten.waage.metabolic = 22 + Math.floor(Math.random() * 5);
        
        // V15.8 Performance-Daten (Smartwatch)
        if(!p.labor_daten.uhr.ruhepuls) p.labor_daten.uhr.ruhepuls = 48 + Math.floor(Math.random() * 10);
        if(!p.labor_daten.uhr.load) p.labor_daten.uhr.load = 3.5 + Math.random() * 4;
        if(!p.labor_daten.uhr.vo2max) p.labor_daten.uhr.vo2max = 52 + Math.floor(Math.random() * 10);
        
        // V15.8 Status-Daten
        if(!p.status) p.status = { im_kader: true, im_training: true, morale: 85 };
    });
}

function generateHighDetailSquad() {
    const positions = ["TW", "IV", "IV", "RV", "LV", "ZDM", "ZM", "ZM", "RF", "LF", "ST", "TW", "IV", "ZM", "OM", "ST", "ST", "IV"];
    positions.forEach((pos, i) => {
        eliteStore.players.push({
            id: Date.now() + i, 
            name: `Elite Player ${i+1}`, 
            position: pos, 
            rating: 78 + (i%5),
            img_url: `https://cdn-icons-png.flaticon.com/512/21/21104.png`,
            status: { im_kader: (i < 11), im_training: true, morale: 80 },
            fifa_stats: { pac:75, sho:70, pas:78, dri:80, def:65, phy:75 },
            labor_daten: { 
                waage: { gewicht: 78, kfa: 10, muskel_kg: 40, wasser: 65, viszeral: 5, metabolic: 24 }, 
                uhr: { ruhepuls: 50, load: 4.0, vo2max: 55 } 
            },
            salary: 42000, 
            contract_exp: 2028, 
            market_value: 1250000
        });
    });
}

// 5. DATA SYNC (GITHUB)
async function syncWithGitHub() {
    try {
        const response = await fetch(GITHUB_REPO_URL);
        if (!response.ok) throw new Error("GitHub Verbindung fehlgeschlagen.");
        const data = await response.json();
        if(data.kader_toni && data.kader_toni.length > 0) {
            eliteStore.players = data.kader_toni;
        }
    } catch (error) {
        console.warn("Lade Daten aus lokalem Speicher...");
        const local = localStorage.getItem('toni_players_backup');
        if(local) eliteStore.players = JSON.parse(local);
    }
   /* ==========================================================================
   BLOCK 2 VON 6: DESIGN ENGINE (EXTENDED CSS SUITE)
   ========================================================================== */

function injectFullStyles() {
    if (document.getElementById('toni-elite-styles')) return;
    const style = document.createElement('style');
    style.id = 'toni-elite-styles';
    style.innerHTML = `
        /* --- 1. CORE LAYOUT & GLASSMORPHISM --- */
        :root {
            --panel-bg: rgba(15, 23, 42, 0.95);
            --border-color: #334155;
            --neon-blue: #00f3ff;
            --neon-main: #10b981;
            --neon-alert: #f43f5e;
            --font-hud: 'Orbitron', sans-serif;
        }

        .lab-overlay { 
            position: fixed; 
            inset: 0; 
            background: rgba(0, 0, 0, 0.97); 
            z-index: 9999; 
            padding: 30px; 
            display: flex; 
            flex-direction: column; 
            backdrop-filter: blur(20px); 
            animation: fadeIn 0.3s ease-out;
        }

        .lab-grid { 
            display: grid; 
            grid-template-columns: 350px 1fr 380px; 
            gap: 25px; 
            height: 100%; 
            margin-top: 25px; 
            overflow: hidden; 
        }

        .lab-panel { 
            background: var(--panel-bg); 
            border: 1px solid var(--border-color); 
            border-radius: 16px; 
            padding: 25px; 
            overflow-y: auto; 
            display: flex; 
            flex-direction: column; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.6);
            transition: border-color 0.3s ease;
        }

        .lab-panel:hover {
            border-color: #475569;
        }

        .lab-title { 
            font-family: var(--font-hud); 
            color: var(--neon-blue); 
            border-bottom: 2px solid #1e293b; 
            padding-bottom: 12px; 
            margin-bottom: 25px; 
            font-size: 13px; 
            letter-spacing: 3px; 
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* --- 2. FIFA CARDS & KADER GRID --- */
        .kader-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 25px;
            padding: 10px;
        }

        .fifa-card {
            background: linear-gradient(160deg, #1e293b 0%, #020617 100%);
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 15px;
            position: relative;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }

        .fifa-card:hover {
            transform: translateY(-10px) scale(1.03);
            border-color: var(--neon-blue);
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
        }

        .card-rating {
            font-family: var(--font-hud);
            font-size: 28px;
            font-weight: 900;
            color: var(--neon-main);
            line-height: 1;
        }

        .player-img {
            width: 100%;
            height: 140px;
            object-fit: contain;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.5));
            margin: 10px 0;
        }

        /* --- 3. BIO-LAB SPECIALS --- */
        .bio-val { 
            background: rgba(0,0,0,0.3); 
            border: 1px solid #1e293b; 
            color: #fff; 
            font-family: monospace; 
            font-size: 20px; 
            width: 100%; 
            text-align: center; 
            padding: 8px;
            border-radius: 6px;
            margin-top: 5px;
        }

        .bio-val:focus {
            outline: none;
            border-color: var(--neon-blue);
            background: rgba(0, 243, 255, 0.05);
        }

        .scale-display { 
            background: #000; 
            border: 2px solid #334155; 
            border-radius: 12px; 
            padding: 30px; 
            text-align: center; 
            color: var(--neon-main); 
            font-family: 'Courier New', monospace; 
            font-size: 42px; 
            margin-bottom: 25px; 
            text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
            position: relative;
        }

        .scale-display::after {
            content: "LIVE DATA SENSOR";
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 8px;
            color: #444;
            letter-spacing: 2px;
        }

        /* --- 4. CEO & OFFICE UI --- */
        .ceo-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px; 
            margin-bottom: 25px; 
        }

        .ceo-card { 
            background: linear-gradient(145deg, #1e293b, #0f172a); 
            border: 1px solid #334155; 
            padding: 25px; 
            border-radius: 16px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }

        .ceo-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 100%; height: 3px;
            background: var(--neon-blue);
            opacity: 0.5;
        }

        .contract-table { 
            width: 100%; 
            border-collapse: separate; 
            border-spacing: 0 8px; 
        }

        .contract-table th { 
            text-align: left; 
            color: #64748b; 
            padding: 12px; 
            font-size: 11px; 
            text-transform: uppercase; 
        }

        .contract-table td { 
            padding: 15px 12px; 
            background: rgba(30, 41, 59, 0.5);
            color: #cbd5e1;
            border-top: 1px solid #1e293b;
            border-bottom: 1px solid #1e293b;
        }

        /* --- 5. TACTICS & INTERACTION --- */
        .tactics-wrapper { 
            display: grid; 
            grid-template-columns: 240px 1fr 240px; 
            gap: 25px; 
            height: 100%; 
        }

        .tactics-stage { 
            border-radius: 20px;
            border: 5px solid #0f172a;
            box-shadow: inset 0 0 100px rgba(0,0,0,0.5);
            cursor: crosshair;
        }

        .fin-inp { 
            background: rgba(0,0,0,0.4); 
            border: 1px solid #444; 
            color: var(--neon-main); 
            padding: 10px; 
            width: 100%; 
            font-family: monospace; 
            border-radius: 8px;
            font-size: 14px;
        }

        /* --- 6. ANIMATIONS --- */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .btn-save {
            background: var(--neon-main);
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            font-family: var(--font-hud);
            font-size: 12px;
            transition: all 0.2s;
        }

        .btn-save:hover {
            filter: brightness(1.2);
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }

        /* Scrollbar-Design */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon-blue); }
    `;
    document.head.appendChild(style);
}
/* ==========================================================================
   BLOCK 3 VON 6: MODULE CONTROLLER & FINANCIAL ENGINE (EDITABLE)
   ========================================================================== */

// --------------------------------------------------------------------------
// 6. MODULE CONTROLLER (DER ROUTER)
// --------------------------------------------------------------------------
function loadModule(modId) {
    console.log(`TONI 2.0: Switching to Module [${modId}]`);
    eliteStore.activeModule = modId;
    
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    // UI Reset
    if(viewport) {
        viewport.classList.remove('hidden');
        viewport.innerHTML = ""; 
    }
    if(vrViewport) vrViewport.classList.add('hidden');
    
    // Top-KPIs aktualisieren
    updateKPIs(); 

    // Routing Logik
    switch(modId) {
        case 'kader': 
            renderSquadOverview(); 
            break;
        case 'status': 
            renderStatusModule(); 
            break;
        case 'analysis': 
            renderAdvisorHub(); 
            break;
        case 'finance': 
            renderOfficeHub(); 
            break;
        case 'stadionzeitung': 
            renderGazetteCMS(); 
            break;
        case 'drills': 
            renderCalendar(); 
            break;
        case 'tactics': 
            renderTacticBoard(); 
            setTimeout(() => tacticsCore.init(), 100); 
            break;
        case 'vr-hub':
            if(viewport) viewport.classList.add('hidden'); 
            if(vrViewport) vrViewport.classList.remove('hidden'); 
            initVRHub(); 
            break;
    }
}

// --------------------------------------------------------------------------
// 7. OFFICE PRIME (FINANZEN & AKTENTASCHE)
// --------------------------------------------------------------------------
function renderOfficeHub() {
    const viewport = document.getElementById('content-viewport');
    
    viewport.innerHTML = `
        <div style="height:100%; display:flex; flex-direction:column;">
            <div class="fin-tabs">
                <button class="fin-tab active" onclick="switchOfficeTab('contracts', this)">KADER-VERTRÄGE</button>
                <button class="fin-tab" onclick="switchOfficeTab('staff', this)">PERSONAL & STAFF</button>
                <button class="fin-tab" onclick="switchOfficeTab('finance', this)">BILANZ-EDITOR</button>
                <button class="fin-tab" onclick="switchOfficeTab('briefcase', this)">AKTENTASCHE (UPGRADES)</button>
            </div>
            
            <div id="office-content" style="flex:1; overflow-y:auto; padding-right:10px;">
                </div>
        </div>
    `;
    
    // Startet mit der Vertragsübersicht
    switchOfficeTab('contracts');
}

function switchOfficeTab(tab, btnElement) {
    const container = document.getElementById('office-content');
    
    // Tab-Highlighting
    if(btnElement) {
        const tabs = document.querySelectorAll('.fin-tab');
        tabs.forEach(t => t.classList.remove('active'));
        btnElement.classList.add('active');
    }

    switch(tab) {
        case 'contracts':
            renderContractMatrix(container);
            break;
        case 'staff':
            renderStaffManagement(container);
            break;
        case 'finance':
            renderEditableBalance(container);
            break;
        case 'briefcase':
            renderBriefcaseUpgrades(container);
            break;
    }
}

// --------------------------------------------------------------------------
// 8. FINANZ-LOGIK (DIE BEARBEITBARE BILANZ)
// --------------------------------------------------------------------------

// A. Die bearbeitbare Tabelle
function renderEditableBalance(container) {
    let rows = eliteStore.finance.map((item, idx) => `
        <tr>
            <td style="color:#94a3b8;">${item.label}</td>
            <td style="text-align:right;">
                <input type="number" class="fin-inp" 
                       value="${item.value}" 
                       onchange="updateFinanceValue(${idx}, this.value)">
            </td>
            <td style="width:40px; color:#444; font-size:12px;">EUR</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="lab-panel">
            <div class="lab-title"><i class="fa-solid fa-file-invoice-dollar"></i> BILANZ-EDITOR // MANUELLE KORREKTUR</div>
            <table class="contract-table">
                <thead>
                    <tr>
                        <th>POSITION</th>
                        <th style="text-align:right; padding-right:45px;">WERT (AKTUELL)</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            
            <div style="margin-top:30px; padding:20px; background:rgba(16, 185, 129, 0.05); border-radius:12px; border:1px solid rgba(16, 185, 129, 0.2);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#64748b; font-size:12px; text-transform:uppercase;">Aktuelle Liquidität (Gesamt)</span>
                    <span id="office-total-budget" style="color:var(--neon-main); font-size:24px; font-family:var(--font-hud);">
                        ${eliteStore.mgmt.liquidAssets.toLocaleString()} €
                    </span>
                </div>
            </div>
        </div>
    `;
}

// B. Werte in Echtzeit speichern
function updateFinanceValue(idx, val) {
    const newValue = parseInt(val) || 0;
    eliteStore.finance[idx].value = newValue;
    
    // Alles neu berechnen
    updateFinanceTotals();
    
    // UI Update
    const display = document.getElementById('office-total-budget');
    if(display) {
        display.innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €";
    }
    
    // In LocalStorage sichern
    localStorage.setItem('toni_finance', JSON.stringify(eliteStore.finance));
}

// C. Sponsoring & Aktentasche (Upgrades)
function renderBriefcaseUpgrades(container) {
    const b = eliteStore.briefcase;
    
    container.innerHTML = `
        <div class="lab-grid" style="grid-template-columns: 1fr 1fr; margin-top:0;">
            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-briefcase"></i> SPONSORING-AKTIVITÄTEN</div>
                <div class="ceo-card" style="margin-bottom:15px; text-align:left;">
                    <span class="ceo-label">Aktive Partner</span>
                    <span class="ceo-val" style="font-size:18px;">${b.sponsoring.activeSponsors.join(', ')}</span>
                </div>
                <div class="bio-input-group">
                    <span class="bio-label">Verhandlungs-Status</span>
                    <div style="color:var(--neon-blue); font-weight:bold;">${b.sponsoring.negotiationStatus}</div>
                </div>
                <button class="btn-save" style="margin-top:auto;" onclick="alert('Verhandlung gestartet...')">NEUEN SPONSOR SUCHEN</button>
            </div>

            <div class="lab-panel">
                <div class="lab-title"><i class="fa-solid fa-microchip"></i> ANALYSEZENTRUM (V15)</div>
                <div class="scale-display" style="font-size:24px; padding:15px;">LEVEL ${b.analysisCenter.level}</div>
                <p style="font-size:11px; color:#64748b;">Features: ${b.analysisCenter.features.join(' + ')}</p>
                
                <div style="margin-top:20px;">
                    <span class="bio-label">Upgrade-Kosten</span>
                    <div style="color:var(--neon-alert);">${b.analysisCenter.nextUpgradeCost.toLocaleString()} €</div>
                </div>
                <button class="btn-save" style="margin-top:auto; background:var(--neon-blue);" onclick="upgradeInfrastructure()">JETZT AUSBAUEN</button>
            </div>
        </div>
    `;
}

function upgradeInfrastructure() {
    const cost = eliteStore.briefcase.analysisCenter.nextUpgradeCost;
    if(eliteStore.mgmt.liquidAssets >= cost) {
        eliteStore.mgmt.liquidAssets -= cost;
        eliteStore.briefcase.analysisCenter.level++;
        eliteStore.briefcase.analysisCenter.nextUpgradeCost *= 2;
        alert("Analysezentrum wurde erweitert!");
        loadModule('finance');
    } else {
        alert("Nicht genügend Budget!");
    }
} 
/* ==========================================================================
   BLOCK 4 VON 6: SQUAD STATUS, CONTRACT MATRIX & STAFF MANAGEMENT
   ========================================================================== */

// --------------------------------------------------------------------------
// 9. STATUS-MODUL (DIE KADER-STEUERUNG)
// --------------------------------------------------------------------------
/**
 * Dieses Modul behebt das Problem der "verschwundenen Spieler".
 * Hier werden ALLE Spieler der Datenbank gelistet, egal ob nominiert oder nicht.
 */
function renderStatusModule() {
    const viewport = document.getElementById('content-viewport');
    
    let html = `
        <div style="margin-bottom:20px;">
            <h2 style="font-family:var(--font-hud); color:white; margin:0;">KADER-STATUS & VERFÜGBARKEIT</h2>
            <p style="font-size:12px; color:#64748b; margin-top:5px;">
                Wähle aus, welche Spieler für den Spieltag nominiert sind (Kader) oder wer aufgrund von Belastung pausiert (Fit).
            </p>
        </div>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:15px;">`;
    
    eliteStore.players.forEach(p => {
        const isReady = p.status.im_training && p.status.im_kader;
        
        html += `
            <div class="lab-panel" style="border-left: 4px solid ${isReady ? 'var(--neon-main)' : 'var(--neon-alert)'}; padding:15px; flex-direction:row; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:15px;">
                    <img src="${p.img_url}" style="width:40px; height:40px; border-radius:50%; background:#000;" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
                    <div>
                        <div style="font-weight:bold; color:white;">${p.name}</div>
                        <div style="font-size:10px; color:var(--neon-blue); letter-spacing:1px;">${p.position} // MORAL: ${p.status.morale}%</div>
                    </div>
                </div>
                
                <div style="display:flex; gap:15px; text-align:center;">
                    <div class="status-toggle">
                        <div style="font-size:8px; color:#444; margin-bottom:2px;">KADER</div>
                        <input type="checkbox" ${p.status.im_kader ? 'checked' : ''} 
                               style="accent-color:var(--neon-main); scale:1.2; cursor:pointer;"
                               onchange="updatePlayerStatus(${p.id}, 'im_kader', this.checked)">
                    </div>
                    <div class="status-toggle">
                        <div style="font-size:8px; color:#444; margin-bottom:2px;">FIT</div>
                        <input type="checkbox" ${p.status.im_training ? 'checked' : ''} 
                               style="accent-color:var(--neon-blue); scale:1.2; cursor:pointer;"
                               onchange="updatePlayerStatus(${p.id}, 'im_training', this.checked)">
                    </div>
                </div>
            </div>`;
    });
    
    viewport.innerHTML = html + `</div>`;
}

function updatePlayerStatus(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) {
        p.status[key] = val;
        // Sofortiges Neu-Zeichnen für visuelles Feedback
        renderStatusModule();
        // Optional: In LocalStorage sichern
        localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    }
}

// --------------------------------------------------------------------------
// 10. OFFICE-DETAILS: VERTRÄGE & STAFF
// --------------------------------------------------------------------------

// A. Die Vertragsmatrix (Profi-Ansicht)
function renderContractMatrix(container) {
    const rows = eliteStore.players.map(p => {
        const salaryAnnual = p.salary * 12;
        const colorClass = p.contract_exp <= 2026 ? 'color:var(--neon-alert);' : '';
        
        return `
            <tr>
                <td style="font-weight:bold; color:white;">${p.name}</td>
                <td>${p.position}</td>
                <td style="${colorClass}">${p.contract_exp}</td>
                <td style="font-family:monospace;">${p.salary.toLocaleString()} €</td>
                <td style="font-family:monospace; color:#64748b;">${salaryAnnual.toLocaleString()} €</td>
                <td>
                    <button class="action-btn" onclick="negotiate(${p.id})">
                        <i class="fa-solid fa-file-signature"></i> EDIT
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div class="lab-panel">
            <div class="lab-title">VERTRAGSMATRIX // PROFI-ABTEILUNG</div>
            <table class="contract-table">
                <thead>
                    <tr>
                        <th>SPIELER</th>
                        <th>POS</th>
                        <th>LAUFZEIT</th>
                        <th>MONATSGEHALT</th>
                        <th>JAHRESGEHALT</th>
                        <th>AKTION</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// B. Personalverwaltung
function renderStaffManagement(container) {
    const rows = eliteStore.staff.map(s => `
        <tr>
            <td style="font-weight:bold; color:var(--neon-blue);">${s.role}</td>
            <td>${s.name}</td>
            <td style="color:var(--neon-main); font-size:11px;">${s.effect}</td>
            <td style="font-family:monospace;">${s.salary.toLocaleString()} €</td>
            <td>
                <button class="action-btn danger" onclick="alert('Kündigungsschutz aktiv.')">ENTLASSEN</button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="lab-panel">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <div class="lab-title">STAFF & EXPERTEN-TEAM</div>
                <button class="btn-save" onclick="alert('Stellenausschreibung läuft...')">+ EXPERTE ANSTELLEN</button>
            </div>
            <table class="contract-table">
                <thead>
                    <tr>
                        <th>FUNKTION</th>
                        <th>NAME</th>
                        <th>EFFEKT</th>
                        <th>GEHALT/M</th>
                        <th>AKTION</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function negotiate(id) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    
    const bonus = Math.round(p.salary * 0.1);
    const text = `VERHANDLUNGS-PROTOKOLL: ${p.name}\n\nBerater fordert eine Erhöhung auf ${(p.salary + bonus).toLocaleString()} €.\n\nSoll das neue Angebot vorgelegt werden?`;
    
    if(confirm(text)) {
        p.salary += bonus;
        updateFinanceTotals();
        switchOfficeTab('contracts');
        voiceEngine.speak("Vertrag für " + p.name + " wurde erfolgreich angepasst.");
    }
}   
/* ==========================================================================
   BLOCK 5 VON 6: TACTICS ENGINE (4-4-2 vs 3-4-3) & DEEP-DIVE LABOR
   ========================================================================== */

// --------------------------------------------------------------------------
// 11. TACTICS ENGINE PRO (CANVAS LOGIC)
// --------------------------------------------------------------------------
const tacticsCore = {
    canvas: null, ctx: null, mode: 'move', elements: [],
    
    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const stage = document.querySelector('.tactics-stage');
        this.canvas.width = stage.clientWidth;
        this.canvas.height = stage.clientHeight;
        
        // Listener für Drag & Drop
        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        
        this.resetMatchFormation(); // Startet das geforderte Setup
    },

    // Das Herzstück: Toni (4-4-2) vs. Trainer (3-4-3)
    resetMatchFormation: function() {
        this.elements = [];
        
        // 1. TONI-MANNSCHAFT (Unten, Rot, 4-4-2)
        const toniPlayers = eliteStore.players.filter(p => p.status.im_kader).slice(0, 11);
        this.applyFormation(toniPlayers, '4-4-2', '#ef4444', 'bottom');
        
        // 2. TRAINER-MANNSCHAFT (Oben, Blau, 3-4-3)
        // Hier simulieren wir 11 Dummy-Gegner für das Taktik-Training
        const trainerPlayers = Array(11).fill(0).map((_, i) => ({ name: `Trainer-PL ${i+1}`, position: "G" }));
        this.applyFormation(trainerPlayers, '3-4-3', '#3b82f6', 'top');
        
        this.renderLoop();
    },

    applyFormation: function(squad, formation, color, side) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const isTop = (side === 'top');
        
        // Einfaches Koordinaten-Mapping für Formationen
        let positions = [];
        if(formation === '4-4-2') {
            positions = [
                [0.5, 0.9], // TW
                [0.2, 0.75], [0.4, 0.75], [0.6, 0.75], [0.8, 0.75], // Abwehr
                [0.2, 0.55], [0.4, 0.55], [0.6, 0.55], [0.8, 0.55], // Mittelfeld
                [0.4, 0.4], [0.6, 0.4] // Sturm
            ];
        } else if(formation === '3-4-3') {
            positions = [
                [0.5, 0.1], // TW
                [0.3, 0.25], [0.5, 0.25], [0.7, 0.25], // Abwehr
                [0.2, 0.45], [0.4, 0.45], [0.6, 0.45], [0.8, 0.45], // Mittelfeld
                [0.3, 0.6], [0.5, 0.6], [0.7, 0.6] // Sturm
            ];
        }

        squad.forEach((p, i) => {
            if(!positions[i]) return;
            const x = positions[i][0] * w;
            const y = positions[i][1] * h;
            
            this.elements.push({
                id: p.id || Date.now() + i,
                name: p.name,
                pos: p.position || "??",
                x: x, y: y,
                color: color,
                radius: 15,
                isDragging: false
            });
        });
    },

    startAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        this.elements.forEach(el => {
            if(Math.hypot(x - el.x, y - el.y) < el.radius + 5) el.isDragging = true;
        });
    },

    moveAction: function(e) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        this.elements.forEach(el => {
            if(el.isDragging) { el.x = x; el.y = y; }
        });
        this.renderLoop();
    },

    endAction: function() { this.elements.forEach(el => el.isDragging = false); },

    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.elements.forEach(el => {
            // Schatten
            this.ctx.shadowBlur = 10; this.ctx.shadowColor = "black";
            // Kreis
            this.ctx.beginPath();
            this.ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = el.color;
            this.ctx.fill();
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            // Text
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 10px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText(el.pos, el.x, el.y + 4);
            this.ctx.fillStyle = "rgba(255,255,255,0.7)";
            this.ctx.font = "9px Arial";
            this.ctx.fillText(el.name, el.x, el.y + 28);
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div class="tactics-wrapper">
            <aside class="lab-panel" style="padding:15px;">
                <div class="lab-title">STRATEGIE</div>
                <button class="tool-btn" onclick="tacticsCore.resetMatchFormation()">RE-SET FORMATION</button>
                <div style="margin-top:20px;">
                    <span class="bio-label">TEAM TONI</span>
                    <div style="color:var(--neon-main); font-weight:bold;">4 - 4 - 2</div>
                </div>
                <div style="margin-top:10px;">
                    <span class="bio-label">TEAM TRAINER</span>
                    <div style="color:var(--neon-blue); font-weight:bold;">3 - 4 - 3</div>
                </div>
            </aside>
            <div class="tactics-stage">
                <canvas id="tactics-canvas"></canvas>
            </div>
            <aside class="lab-panel" style="padding:15px;">
                <div class="lab-title">ANALYSE</div>
                <textarea class="fin-inp" style="height:200px; font-size:11px;" placeholder="Taktische Anweisungen hier eingeben..."></textarea>
                <button class="btn-save" style="margin-top:10px; width:100%;">MATCHPLAN SPEICHERN</button>
            </aside>
        </div>
    `;
}

// --------------------------------------------------------------------------
// 12. DEEP-DIVE BIO LAB (V15.8 ULTIMATE)
// --------------------------------------------------------------------------
function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    if(!p && id !== -1) return;

    // Falls neuer Spieler
    if(id === -1) {
        p = {
            id: Date.now(), name: "New Elite", position: "ZM", rating: 70,
            fifa_stats: { pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70 },
            labor_daten: { waage: { gewicht: 75, kfa: 12, muskel_kg: 35, wasser: 60, viszeral: 5, metabolic: 24 }, uhr: { ruhepuls: 55, load: 4.5, vo2max: 50 } },
            salary: 5000, contract_exp: 2027, market_value: 1000000, status: { im_kader: true, im_training: true, morale: 80 }
        };
        eliteStore.players.push(p);
    }

    const s = p.fifa_stats; 
    const l = p.labor_daten;
    const bmi = (l.waage.gewicht / (1.85 * 1.85)).toFixed(1);

    const ov = document.createElement('div'); 
    ov.className = 'lab-overlay'; ov.id = 'active-bio-lab';
    
    ov.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:15px; border-bottom:1px solid #333;">
        <div>
            <h1 style="font-family:var(--font-hud); color:white; margin:0;">${p.name.toUpperCase()}</h1>
            <span style="font-size:10px; color:#64748b;">NEURAL BIOMETRIC DATA // UNIT-${p.id}</span>
        </div>
        <button class="btn-save" style="background:var(--neon-alert); color:white;" onclick="document.getElementById('active-bio-lab').remove(); loadModule('kader');">LABOR SCHLIESSEN X</button>
    </div>
    
    <div class="lab-grid">
        <div class="lab-panel" style="border-top: 3px solid var(--neon-blue);">
            <div class="lab-title"><i class="fa-solid fa-chart-line"></i> PERFORMANCE PROFILE</div>
            <div class="scale-display" style="font-size:32px; padding:15px;" id="lab-rating">${p.rating}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                ${Object.keys(s).map(key => `
                    <div class="bio-input-group">
                        <span class="bio-label">${key.toUpperCase()}</span>
                        <input type="number" class="bio-val" value="${s[key]}" onchange="updateStat(${p.id}, '${key}', this.value)">
                    </div>
                `).join('')}
            </div>
            <div style="margin-top:15px;">
                <span class="bio-label">NAME</span>
                <input class="bio-val" value="${p.name}" onchange="updateP(${p.id}, 'name', this.value)">
            </div>
        </div>

        <div class="lab-panel" style="border-top: 3px solid var(--neon-main);">
            <div class="lab-title"><i class="fa-solid fa-dna"></i> BIOMETRIC SCAN</div>
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <div class="scale-display" style="flex:1; font-size:20px;">${l.waage.gewicht} <small>KG</small></div>
                <div class="scale-display" style="flex:1; font-size:20px; color:var(--neon-blue);">${bmi} <small>BMI</small></div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div class="bio-input-group"><span class="bio-label">KFA %</span><input type="number" class="bio-val" value="${l.waage.kfa}" onchange="updateLab(${p.id}, 'waage', 'kfa', this.value)"></div>
                <div class="bio-input-group"><span class="bio-label">MUSKEL KG</span><input type="number" class="bio-val" value="${l.waage.muskel_kg}" onchange="updateLab(${p.id}, 'waage', 'muskel_kg', this.value)"></div>
                <div class="bio-input-group"><span class="bio-label">WASSER %</span><input type="number" class="bio-val" value="${l.waage.wasser}" onchange="updateLab(${p.id}, 'waage', 'wasser', this.value)"></div>
                <div class="bio-input-group"><span class="bio-label">VISZERAL</span><input type="number" class="bio-val" value="${l.waage.viszeral}" onchange="updateLab(${p.id}, 'waage', 'viszeral', this.value)"></div>
                <div class="bio-input-group" style="grid-column: span 2;"><span class="bio-label">METABOLIC AGE</span><input type="number" class="bio-val" value="${l.waage.metabolic}" onchange="updateLab(${p.id}, 'waage', 'metabolic', this.value)"></div>
            </div>
        </div>

        <div class="lab-panel" style="border-top: 3px solid var(--neon-alert);">
            <div class="lab-title"><i class="fa-solid fa-file-contract"></i> FINANCE & SENSORS</div>
            <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:12px; margin-bottom:20px;">
                <span class="bio-label">MONATSGEHALT (€)</span>
                <input type="number" class="bio-val" style="color:var(--neon-alert);" value="${p.salary}" onchange="updateP(${p.id}, 'salary', this.value)">
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <div style="flex:1;"><span class="bio-label">EXPIRY</span><input type="number" class="bio-val" value="${p.contract_exp}" onchange="updateP(${p.id}, 'contract_exp', this.value)"></div>
                    <div style="flex:1;"><span class="bio-label">VALUE</span><input type="number" class="bio-val" value="${p.market_value}" onchange="updateP(${p.id}, 'market_value', this.value)"></div>
                </div>
            </div>
            <div class="lab-title" style="color:orange; border-color:orange;"><i class="fa-solid fa-stopwatch"></i> LIVE TRACKING</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div class="bio-input-group"><span class="bio-label">RUHEPULS</span><input type="number" class="bio-val" value="${l.uhr.ruhepuls}" onchange="updateLab(${p.id}, 'uhr', 'ruhepuls', this.value)"></div>
                <div class="bio-input-group"><span class="bio-label">VO2 MAX</span><input type="number" class="bio-val" value="${l.uhr.vo2max}" onchange="updateLab(${p.id}, 'uhr', 'vo2max', this.value)"></div>
                <div class="bio-input-group" style="grid-column: span 2;">
                    <span class="bio-label">DAILY LOAD (1-10)</span>
                    <input type="range" style="width:100%;" min="1" max="10" step="0.1" value="${l.uhr.load}" onchange="updateLab(${p.id}, 'uhr', 'load', this.value)">
                </div>
            </div>
        </div>
    </div>
    `;
    document.body.appendChild(ov);
} 
 /* ==========================================================================
   BLOCK 6 VON 6: SQUAD OVERVIEW, AI VOICE & SYSTEM SERVICES
   ========================================================================== */

// --------------------------------------------------------------------------
// 13. SQUAD OVERVIEW (DIE ELITE KADER-KARTEN)
// --------------------------------------------------------------------------
function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    
    // Header mit Add-Button
    let html = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px;">
            <div>
                <h2 style="font-family:var(--font-hud); color:white; margin:0;">ACTIVE ELITE SQUAD</h2>
                <div style="font-size:10px; color:var(--neon-blue); letter-spacing:2px;">KADERGRÖSSE: ${eliteStore.players.length} SPIELER</div>
            </div>
            <button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER-DATENSATZ</button>
        </div>
        <div class="kader-grid">
    `;
    
    // Nur Spieler anzeigen, die "im Kader" sind (Nominiert)
    const activeSquad = eliteStore.players.filter(p => p.status.im_kader);
    
    activeSquad.forEach(p => {
        const isFit = p.status.im_training;
        const moraleColor = p.status.morale > 70 ? 'var(--neon-main)' : 'var(--neon-alert)';
        
        html += `
        <div class="fifa-card" onclick="openBioLab(${p.id})" style="opacity: ${isFit ? 1 : 0.6}">
            <div style="position:absolute; top:10px; left:12px; text-align:center;">
                <div class="card-rating" style="font-size:24px;">${p.rating}</div>
                <div style="font-size:10px; font-weight:bold; color:#64748b;">${p.position}</div>
            </div>
            
            <div style="position:absolute; top:12px; right:12px;">
                <i class="fa-solid fa-bolt" style="color:${isFit ? 'var(--neon-main)' : '#444'};"></i>
            </div>

            <img src="${p.img_url}" class="player-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
            
            <div style="text-align:center; border-top:1px solid #1e293b; padding-top:10px;">
                <div style="color:white; font-weight:bold; font-size:14px; text-transform:uppercase; letter-spacing:1px;">${p.name}</div>
                <div style="display:flex; justify-content:center; gap:8px; margin-top:5px;">
                    <span style="font-size:9px; color:#64748b;">PAC <b style="color:#ccc;">${p.fifa_stats.pac}</b></span>
                    <span style="font-size:9px; color:#64748b;">DRI <b style="color:#ccc;">${p.fifa_stats.dri}</b></span>
                    <span style="font-size:9px; color:#64748b;">SHO <b style="color:#ccc;">${p.fifa_stats.sho}</b></span>
                </div>
                
                <div style="width:100%; height:2px; background:#111; margin-top:10px; border-radius:1px; overflow:hidden;">
                    <div style="width:${p.status.morale}%; height:100%; background:${moraleColor}; box-shadow: 0 0 5px ${moraleColor};"></div>
                </div>
            </div>
        </div>`;
    });
    
    viewport.innerHTML = html + `</div>`;
}

// --------------------------------------------------------------------------
// 14. DATA PERSISTENCE HELPERS (UPDATE-LOGIK)
// --------------------------------------------------------------------------

// Update für Top-Level Daten
function updateP(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) {
        if(key === 'name' || key === 'position') {
            p[key] = val;
        } else {
            p[key] = parseInt(val) || 0;
        }
        if(key === 'salary') updateFinanceTotals();
        saveToLocalStorage();
    }
}

// Update für FIFA Stats & Rating-Berechnung
function updateStat(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p) {
        p.fifa_stats[key] = parseInt(val) || 0;
        p.rating = calculateFifaRating(p.fifa_stats);
        
        // Live-Update im Labor-Overlay
        const ratingDisp = document.getElementById('lab-rating');
        if(ratingDisp) ratingDisp.innerText = p.rating;
        saveToLocalStorage();
    }
}

// Update für Biometrische Labor-Daten
function updateLab(id, device, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(p && p.labor_daten[device]) {
        p.labor_daten[device][key] = parseFloat(val) || 0;
        saveToLocalStorage();
    }
}

function calculateFifaRating(s) {
    const avg = (s.pac + s.sho + s.pas + s.dri + s.def + s.phy) / 6;
    return Math.round(avg);
}

function saveToLocalStorage() {
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    localStorage.setItem('toni_finance', JSON.stringify(eliteStore.finance));
}

// --------------------------------------------------------------------------
// 15. AI VOICE ENGINE & MIKROFON (AKTIVIERT)
// --------------------------------------------------------------------------
const voiceEngine = {
    recognition: null,
    isListening: false,

    init: function() {
        console.log("TONI 2.0: Initializing Voice Engine...");
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Sprachbefehl erkannt:", transcript);
                this.handleCommand(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                document.getElementById('ai-mic-indicator')?.classList.remove('active');
            };
        }
    },

    startListening: function() {
        if (!this.recognition) return alert("Sprachsteuerung wird von diesem Browser nicht unterstützt.");
        if (this.isListening) return;
        
        this.isListening = true;
        this.recognition.start();
        document.getElementById('ai-mic-indicator')?.classList.add('active');
        this.speak("Ich höre zu.");
    },

    handleCommand: function(cmd) {
        const text = cmd.toLowerCase();
        // Beispiel-Befehle
        if (text.includes("kader")) loadModule('kader');
        if (text.includes("finanzen") || text.includes("geld")) loadModule('finance');
        if (text.includes("taktik")) loadModule('tactics');
        
        // Befehl an den Advisor-Chat senden
        const promptInput = document.getElementById('advisor-prompt');
        if(promptInput) {
            promptInput.value = cmd;
            this.speak("Analysiere " + cmd);
        }
    },

    speak: function(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.9;
        msg.rate = 1.0;
        window.speechSynthesis.speak(msg);
    }
};

// --------------------------------------------------------------------------
// 16. SYSTEM SERVICES & GAZETTE
// --------------------------------------------------------------------------
function renderGazetteCMS() {
    const viewport = document.getElementById('content-viewport');
    viewport.innerHTML = `
        <div class="lab-panel" style="background:#fff; color:#111; font-family:serif; padding:50px; max-width:800px; margin:0 auto; box-shadow: 20px 20px 0px var(--border-color);">
            <div style="text-align:center; border-bottom:4px double #111; padding-bottom:20px; margin-bottom:20px;">
                <h1 style="font-size:48px; margin:0;">ELITE GAZETTE</h1>
                <div style="letter-spacing:5px;">STADIONZEITUNG // V15.8</div>
            </div>
            <h2>${eliteStore.gazette.headline}</h2>
            <p style="font-size:18px; line-height:1.6; font-style:italic;">${eliteStore.gazette.lead}</p>
            <hr>
            <textarea style="width:100%; height:400px; border:none; font-family:serif; font-size:16px; line-height:1.5; outline:none;" 
                      onchange="eliteStore.gazette.body = this.value">${eliteStore.gazette.body}</textarea>
            <div style="margin-top:30px; border-top:1px solid #ccc; padding-top:10px; font-size:12px; text-align:right;">
                REDAKTION: NEURAL-AI ADVISOR SYSTEM
            </div>
        </div>
    `;
}

function updateKPIs() {
    const budgetEl = document.getElementById('kpi-budget');
    if(budgetEl) budgetEl.innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €";
    
    const weatherEl = document.getElementById('weather-header-widget');
    if(weatherEl) weatherEl.innerHTML = `<i class="fa-solid fa-temperature-half"></i> ${eliteStore.mgmt.liveData.temp}°C`;
}

async function fetchWeatherData() {
    try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=7.4&current_weather=true");
        const data = await res.json();
        eliteStore.mgmt.liveData.temp = data.current_weather.temperature;
        updateKPIs();
    } catch(e) { console.warn("Wetter-API offline."); }
}

function updateClock() {
    const clock = document.getElementById('clock-display');
    if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
}

// --------------------------------------------------------------------------
// SYSTEM START LOG
// --------------------------------------------------------------------------
console.log("=========================================");
console.log("TONI 2.0 NEURAL ENGINE V15.8 COMPLETED");
console.log("STATUS: ALL SYSTEMS OPERATIONAL");
console.log("=========================================");  
}
