/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V13.0 - DEEP FINANCE & STRATEGY)
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
    // V13: Erweitere Finanz-Datenbank (Mix aus Profi & Amateur für Demo)
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
    // V13: Gazette State
    gazette: {
        headline: "DER GROSSE SAISON-REPORT",
        lead: "Wie sich unser Team neu erfindet.",
        body: "Hier steht der redaktionelle Text..."
    },
    mgmt: {
        liquidAssets: 0, // Wird berechnet
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
    console.log("TONI 2.0 V13: Booting Strategy Engine...");
    updateClock(); 
    setInterval(updateClock, 1000);
    checkAIConnection();
    await syncWithGitHub();
    fetchWeatherData();
    injectLabStyles();
    recalculateBudget(); // Initiale Berechnung
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
    // Summiert alles aus dem Finance-Array
    const total = eliteStore.finance.reduce((acc, curr) => acc + curr.value, 0);
    eliteStore.mgmt.liquidAssets = total;
    updateKPIs();
}

function injectLabStyles() {
    if (document.getElementById('lab-styles-v13')) return;
    const style = document.createElement('style');
    style.id = 'lab-styles-v13';
    style.innerHTML = `
        /* V13 STYLE UPGRADES */
        .lab-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.96); z-index: 9000; padding: 25px; display: flex; flex-direction: column; backdrop-filter: blur(15px); }
        .lab-grid { display: grid; grid-template-columns: 300px 1fr 1fr; gap: 20px; height: 100%; margin-top: 20px; overflow: hidden; }
        .lab-panel { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 25px; overflow-y: auto; display:flex; flex-direction:column; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        
        /* FINANCE TABS */
        .fin-tabs { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px; }
        .fin-tab { background: transparent; border: 1px solid #333; color: #888; padding: 8px 16px; cursor: pointer; border-radius: 4px; font-family: var(--font-hud); transition: 0.3s; }
        .fin-tab.active { background: var(--neon-blue); color: black; border-color: var(--neon-blue); font-weight: bold; }
        .fin-tab:hover { border-color: var(--neon-blue); color: white; }

        /* FINANCE TABLE */
        .finance-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .finance-table th { text-align: left; padding: 10px; color: #64748b; border-bottom: 1px solid #333; }
        .finance-table td { padding: 8px 10px; border-bottom: 1px solid #1e293b; color: #ccc; }
        .fin-inp { background: rgba(0,0,0,0.2); border: 1px solid #333; color: white; padding: 4px; width: 100%; font-family: monospace; }
        .val-pos { color: var(--neon-main); } .val-neg { color: var(--neon-alert); }

        /* ADVISOR CARDS */
        .advisor-card { background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .advisor-card h4 { margin: 0 0 10px 0; color: var(--neon-blue); font-family: var(--font-hud); }
        .advice-box { background: rgba(0,0,0,0.5); padding: 10px; border-left: 3px solid var(--neon-main); margin-top: 10px; font-size: 12px; display:none; }
        
        /* OFFICE */
        .office-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; height: 100%; }
        .template-btn { display: block; width: 100%; text-align: left; padding: 10px; margin-bottom: 5px; background: #1e293b; border: none; color: white; cursor: pointer; }
        .template-btn:hover { background: #334155; }

        /* GAZETTE EDITOR */
        .gazette-editor { background: white; color: black; padding: 40px; font-family: 'Times New Roman', serif; min-height: 500px; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
        .gazette-head { font-size: 42px; font-weight: bold; border-bottom: 4px solid black; margin-bottom: 20px; text-align: center; text-transform: uppercase; }
        .gazette-inp { width: 100%; border: none; background: transparent; outline: none; }
        .g-lead { font-size: 18px; font-style: italic; margin-bottom: 20px; color: #444; }
        .g-body { font-size: 14px; line-height: 1.6; text-align: justify; columns: 2; column-gap: 30px; }

        /* LAB & OTHER */
        .bio-val { background: transparent; border: none; color: white; border-bottom: 1px solid #444; width: 100%; text-align: center; }
        .bio-label { font-size: 10px; color: #888; display: block; margin-bottom: 4px; }
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
    
    // Wetter im Header aktualisieren (sicherstellen, dass es da ist)
    updateKPIs();

    if(modId === 'kader') renderSquadOverview();
    if(modId === 'analysis') renderAnalysisCenter(); 
    if(modId === 'finance') renderFinanceHub(); // V13: NEUER HUB
    if(modId === 'stadionzeitung') renderGazetteCMS(); // V13: NEUES CMS
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
   4. V13: DEEP FINANCE & STRATEGY HUB
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
   5. GAZETTE CMS (STADIONZEITUNG)
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
    localStorage.setItem('toni_finance', JSON.stringify(eliteStore.finance)); // Save everything
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
   6. CORE MODULES (KADER, BIO-LAB, TACTICS - UNGEKÜRZT)
   ========================================================================== */

function renderSquadOverview() {
    const viewport = document.getElementById('content-viewport');
    let html = `<div style="display:flex; justify-content:space-between; margin-bottom:20px;"><h2 style="font-family:var(--font-hud); color:white;">ELITE KADER</h2><button class="btn-save" onclick="openBioLab(-1)">+ NEUER SPIELER</button></div><div class="kader-grid">`;
    eliteStore.players.forEach(p => {
        const op = p.status.im_training ? 1 : 0.5;
        const bc = p.status.im_kader ? "var(--neon-main)" : "#444";
        html += `<div class="fifa-card" style="opacity:${op}; border-color:${bc};" onclick="openBioLab(${p.id})"><div class="card-inner"><div class="card-front"><div class="card-rating">${p.rating}</div><img src="${p.img_url}" class="player-img" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'"><div class="card-info"><div class="card-name">${p.name}</div><div class="card-pos">${p.position}</div><div style="text-align:center; font-size:10px; margin-top:5px; color:var(--neon-blue);">LABOR ÖFFNEN</div></div></div></div></div>`;
    });
    viewport.innerHTML = html + `</div>`;
}

function calculateFifaRating(s) { return Math.round(( (s.pac||0)+(s.sho||0)+(s.pas||0)+(s.dri||0)+(s.def||0)+(s.phy||0) )/6); }

function openBioLab(id) {
    let p = eliteStore.players.find(x => x.id === id);
    if(!p && id === -1) p = {id: Date.now(), name: "Neu", position: "ZM", rating: 60, status:{im_kader:true,im_training:true}, fifa_stats:{pac:60,sho:60,pas:60,dri:60,def:60,phy:60}, labor_daten:{waage:{},uhr:{}}, img_url:""};
    const s = p.fifa_stats || {}; const l = p.labor_daten || {waage:{}, uhr:{}};

    const ov = document.createElement('div'); ov.className = 'lab-overlay'; ov.id = 'active-bio-lab';
    ov.innerHTML = `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #333; padding-bottom:15px;">
            <h1 style="font-family:var(--font-hud); color:white;">${p.name.toUpperCase()} // BIO-LAB</h1>
            <button class="btn-cancel" onclick="this.closest('.lab-overlay').remove()">X</button>
        </div>
        <div class="lab-grid">
            <div class="lab-panel">
                <div class="lab-title">FIFA CORE</div>
                <input class="bio-val" value="${p.name}" onchange="updateP(${p.id}, 'name', this.value)">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                    <input type="number" class="bio-val" value="${s.pac}" onchange="updateStat(${p.id},'pac',this.value)">
                    <input type="number" class="bio-val" value="${s.sho}" onchange="updateStat(${p.id},'sho',this.value)">
                    <input type="number" class="bio-val" value="${s.pas}" onchange="updateStat(${p.id},'pas',this.value)">
                    <input type="number" class="bio-val" value="${s.dri}" onchange="updateStat(${p.id},'dri',this.value)">
                    <input type="number" class="bio-val" value="${s.def}" onchange="updateStat(${p.id},'def',this.value)">
                    <input type="number" class="bio-val" value="${s.phy}" onchange="updateStat(${p.id},'phy',this.value)">
                </div>
                <div style="margin-top:20px; font-size:20px; color:var(--neon-main); text-align:center;">RATING: ${p.rating}</div>
            </div>
            <div class="lab-panel">
                <div class="lab-title">BODY SCAN</div>
                <div class="scale-display">${l.waage.gewicht||0} KG</div>
                <input type="number" class="bio-val" placeholder="Gewicht" value="${l.waage.gewicht}" onchange="updateLab(${p.id},'waage','gewicht',this.value)">
                <input type="number" class="bio-val" placeholder="KFA %" value="${l.waage.kfa}" onchange="updateLab(${p.id},'waage','kfa',this.value)">
            </div>
            <div class="lab-panel">
                <div class="lab-title">PERFORMANCE</div>
                <div class="watch-face"><div class="watch-time">00:00</div></div>
                <input type="number" class="bio-val" placeholder="Ruhepuls" value="${l.uhr.ruhepuls}" onchange="updateLab(${p.id},'uhr','ruhepuls',this.value)">
            </div>
        </div>`;
    document.body.appendChild(ov);
}
// Helper Updates
function updateP(id,k,v){ const p=eliteStore.players.find(x=>x.id===id); if(p) p[k]=v; }
function updateStat(id,k,v){ const p=eliteStore.players.find(x=>x.id===id); if(p){ p.fifa_stats[k]=parseInt(v); p.rating=calculateFifaRating(p.fifa_stats); } }
function updateLab(id,d,k,v){ const p=eliteStore.players.find(x=>x.id===id); if(p) p.labor_daten[d][k]=parseFloat(v); }

/* ==========================================================================
   7. ANALYSIS CENTER (AKTENTASCHE)
   ========================================================================== */
function renderAnalysisCenter() {
    const v = document.getElementById('content-viewport');
    let h = `<h2 style="font-family:var(--font-hud); color:white;">ANALYSEZENTRUM</h2><div class="lab-panel"><table class="finance-table"><thead><tr><th>Name</th><th>Rating</th><th>Gewicht</th><th>Puls</th></tr></thead><tbody>`;
    eliteStore.players.forEach(p => {
        h += `<tr><td>${p.name}</td><td style="color:var(--neon-main)">${p.rating}</td><td>${p.labor_daten.waage.gewicht||'--'}</td><td>${p.labor_daten.uhr.ruhepuls||'--'}</td></tr>`;
    });
    v.innerHTML = h + `</tbody></table></div>`;
}

/* ==========================================================================
   8. TACTICS, CALENDAR, VR, WEATHER & AI
   ========================================================================== */

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

const tacticsCore = {
    canvas:null, ctx:null, elements:[],
    init: function() { this.canvas=document.getElementById('tactics-canvas'); if(this.canvas){this.ctx=this.canvas.getContext('2d'); this.render();} },
    addPlayerToBoard: function(id){ this.elements.push({id, x:100, y:100}); this.render(); },
    render: function(){ 
        if(!this.ctx)return; this.ctx.clearRect(0,0,800,600); 
        this.elements.forEach(e=>{ this.ctx.beginPath(); this.ctx.arc(e.x,e.y,15,0,6.28); this.ctx.fillStyle="red"; this.ctx.fill(); }); 
    }
};
function renderTacticBoard() { document.getElementById('content-viewport').innerHTML = `<div class="tactics-wrapper"><aside class="tactics-sidebar"><button onclick="tacticsCore.elements=[]">CLEAR</button></aside><div class="tactics-stage"><canvas id="tactics-canvas" width="800" height="600"></canvas></div></div>`; }

function renderCalendar() { document.getElementById('content-viewport').innerHTML = `<h2 style="font-family:var(--font-hud); color:white;">WOCHENPLAN</h2><div class="cal-grid">Kalender aktiv...</div>`; }
function initVRHub() { document.getElementById('match-simulation-layer').innerHTML='<a-text value="VR MODE" position="0 1.6 -2" color="white"></a-text>'; }
function exitVRMode() { loadModule('kader'); }

// AI SYSTEM
function checkAIConnection() { document.getElementById('ai-status-text').innerText = USER_API_KEY ? "AI: ONLINE" : "AI: OFFLINE"; }
const voiceEngine = { init:()=>{}, speak:(t)=>{ console.log(t); const s=document.getElementById('chat-stream'); if(s)s.innerHTML+=`<div><b>TONI:</b> ${t}</div>`; } };
function askToni() { const i=document.getElementById('toni-input'); if(i.value){ voiceEngine.speak("Analysiere: "+i.value); i.value=""; } }
