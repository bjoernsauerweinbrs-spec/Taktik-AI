/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V16.3 ULTIMATE)
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

// --- 1. DATEN-STRUKTUR ---
let eliteStore = {
    config: { passkey: "1234", apiKey: "" },
    
    // Dynamisches Finanzsystem
    finance: {
        budget: 0,
        transactions: [
            { id: 1, desc: "Sponsoring: Neural Gear", type: "income", val: 1500000 },
            { id: 2, desc: "TV-Gelder: Bundesliga", type: "income", val: 2500000 },
            { id: 3, desc: "Reisekosten: London", type: "expense", val: 12500 },
            { id: 4, desc: "Medizinische Abteilung", type: "expense", val: 5000 }
        ],
        infrastructure: { analysisCenter: 1, stadium: 1 }
    },

    // Taktik Positionen (in Prozent)
    tactics: {
        toni: [
            { id: 't1', label: 'TW', t: 90, l: 50 }, 
            { id: 't2', label: 'IV', t: 75, l: 35 }, { id: 't3', label: 'IV', t: 75, l: 65 },
            { id: 't4', label: 'LV', t: 70, l: 15 }, { id: 't5', label: 'RV', t: 70, l: 85 },
            { id: 't6', label: 'ZM', t: 50, l: 40 }, { id: 't7', label: 'ZM', t: 50, l: 60 },
            { id: 't8', label: 'LM', t: 40, l: 10 }, { id: 't9', label: 'RM', t: 40, l: 90 },
            { id: 't10', label: 'ST', t: 20, l: 40 }, { id: 't11', label: 'ST', t: 20, l: 60 }
        ],
        opp: [
            { id: 'o1', label: 'TW', t: 5, l: 50 }, 
            { id: 'o2', label: 'IV', t: 20, l: 50 },
            { id: 'o3', label: 'ST', t: 80, l: 50 }
        ]
    },

    // Spieler Datenbank
    players: [
        { 
            id: 1, name: "NEUER", pos: "TW", rating: 89, type: 'pro',
            fifa: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 },
            bio: { weight: 92.4, fat: 11.2, muscle: 48.5 },
            sensor: { heart: 48, sleep: 8.2 }
        },
        { 
            id: 10, name: "KANE", pos: "ST", rating: 90, type: 'pro',
            fifa: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 },
            bio: { weight: 86.1, fat: 12.5, muscle: 47.2 },
            sensor: { heart: 46, sleep: 7.5 }
        },
        // Jugendspieler für das Album
        { 
            id: 99, name: "LEON", pos: "ZM", rating: 65, type: 'youth',
            stickers: [true, true, false, false, false, false, false, false, false, false, false, false]
        }
    ],

    magazine: {
        pages: [{ title: "MATCH DAY", content: "Analyse..." }]
    }
};

// --- 2. SYSTEM BOOT ---
function systemBootSequence() {
    loadFromDisk();
    const input = document.getElementById('passkey').value;
    
    // Auto-Login wenn leer (für Testzwecke) oder korrekt
    if (input === eliteStore.config.passkey || input === "") {
        document.getElementById('auth-layer').style.display = 'none';
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

function initDashboard() {
    updateBudgetCalc();
    renderQuickList();
    switchModule('kader'); // Start-Screen
    
    // Uhrzeit
    setInterval(() => {
        const c = document.getElementById('clock-display');
        if(c) c.innerText = new Date().toLocaleTimeString();
    }, 1000);
}

// --- 3. NAVIGATION ---
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    
    // Buttons umschalten
    document.querySelectorAll('.side-nav button').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`nav-${modId}`);
    if(btn) btn.classList.add('active');
    
    // Titel ändern
    document.getElementById('active-mod-title').innerText = modId.toUpperCase();

    // Inhalt laden
    if (modId === 'kader') renderKader(stage);
    if (modId === 'finance') renderOffice(stage);
    if (modId === 'tactics') renderTactics(stage);
    if (modId === 'media') renderMedia(stage);
    if (modId === 'youth') renderYouth(stage);
}

// --- 4. KADER & LABOR ---
function renderKader(target) {
    target.innerHTML = `<div class="kader-grid fade-in">${eliteStore.players.filter(p=>p.type==='pro').map(p => `
        <div class="fifa-card" onclick="openBioLab(${p.id})">
            <div class="card-rating-box">${p.rating}</div>
            <div class="card-name">${p.name}</div>
            <div style="text-align:center; padding-top:60px; font-size:50px; color:#333; opacity:0.5;">
                <i class="fa-solid fa-user"></i>
            </div>
        </div>`).join('')}</div>`;
}

function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const m = document.getElementById('bio-lab-modal');
    m.classList.remove('hidden');
    
    document.getElementById('modal-container').innerHTML = `
        <div class="column-header">AKTE: ${p.name}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:10px;">
            <div class="office-panel">
                <h3>FIFA STATS</h3>
                ${Object.keys(p.fifa).map(k=>`
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="color:#aaa;">${k.toUpperCase()}</span>
                        <input type="number" value="${p.fifa[k]}" onchange="updateStat(${id},'fifa','${k}',this.value)" style="width:60px;">
                    </div>`).join('')}
            </div>
            <div class="office-panel">
                <h3>BIO-METRIK</h3>
                <div style="margin-bottom:5px;">Gewicht: <input type="number" value="${p.bio.weight}" onchange="updateStat(${id},'bio','weight',this.value)"></div>
                <div style="margin-bottom:5px;">Fett: <input type="number" value="${p.bio.fat}" onchange="updateStat(${id},'bio','fat',this.value)"></div>
                <div style="margin-bottom:5px;">Puls: <input type="number" value="${p.sensor.heart}" onchange="updateStat(${id},'sensor','heart',this.value)"></div>
            </div>
        </div>
        <button class="btn-neon-small" style="margin-top:20px; width:100%;" onclick="document.getElementById('bio-lab-modal').classList.add('hidden')">SCHLIESSEN</button>
    `;
}

function updateStat(id, cat, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[cat][key] = parseFloat(val);
    saveToDisk();
}

// --- 5. OFFICE MANAGER ---
function renderOffice(target) {
    updateBudgetCalc();
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>BUDGET: ${eliteStore.finance.budget.toLocaleString()} €</h3>
                
                <div style="display:flex; gap:10px; margin-bottom:15px; background:rgba(255,255,255,0.05); padding:10px; border-radius:5px;">
                    <input id="t-desc" placeholder="Beschreibung" style="flex:2;">
                    <select id="t-type"><option value="income">Einnahme</option><option value="expense">Ausgabe</option></select>
                    <input id="t-val" type="number" placeholder="Betrag" style="width:100px;">
                    <button class="btn-neon-small" onclick="addTrans()">BUCHEN</button>
                </div>

                <table class="ledger-table">
                    <thead><tr><th>BESCHREIBUNG</th><th>TYP</th><th>BETRAG</th><th></th></tr></thead>
                    <tbody>
                        ${eliteStore.finance.transactions.map((t,i) => `
                        <tr>
                            <td>${t.desc}</td>
                            <td style="color:${t.type==='income'?'var(--neon-green)':'var(--neon-alert)'}">${t.type.toUpperCase()}</td>
                            <td>${t.val.toLocaleString()} €</td>
                            <td><button onclick="delTrans(${i})" style="color:red; background:none; border:none; cursor:pointer;">X</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
        </div>`;
}

function addTrans() {
    const d = document.getElementById('t-desc').value;
    const v = document.getElementById('t-val').value;
    const t = document.getElementById('t-type').value;
    if(d && v) {
        eliteStore.finance.transactions.push({id:Date.now(), desc:d, val:v, type:t});
        saveToDisk();
        renderOffice(document.getElementById('module-content'));
    }
}

function delTrans(i) {
    if(confirm("Löschen?")) {
        eliteStore.finance.transactions.splice(i,1);
        saveToDisk();
        renderOffice(document.getElementById('module-content'));
    }
}

function updateBudgetCalc() {
    eliteStore.finance.budget = eliteStore.finance.transactions.reduce((acc, c) => {
        return c.type === 'income' ? acc + parseFloat(c.val) : acc - parseFloat(c.val);
    }, 0);
    const el = document.getElementById('kpi-budget');
    if(el) el.innerText = eliteStore.finance.budget.toLocaleString() + " €";
}

// --- 6. TAKTIK BOARD ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    <div class="pitch-box-top"></div><div class="pitch-goal-top"></div>
                    <div class="pitch-box-bottom"></div><div class="pitch-goal-bottom"></div>
                    
                    ${eliteStore.tactics.toni.map(p => `<div class="player-marker team-toni" id="${p.id}" style="top:${p.t}%; left:${p.l}%;">${p.label}</div>`).join('')}
                    ${eliteStore.tactics.opp.map(p => `<div class="player-marker team-opp" id="${p.id}" style="top:${p.t}%; left:${p.l}%;">${p.label}</div>`).join('')}
                </div>
            </div>
            <div style="text-align:center; padding:10px;">
                <button class="btn-neon-small" onclick="resetMarkers()">RESET POSITIONEN</button>
            </div>
        </div>`;
    initDrag();
}

function resetMarkers() {
    if(confirm("Alles zurücksetzen?")) {
        // Simple Reset Logic (alles in die Mitte)
        eliteStore.tactics.toni.forEach(p => {p.t=50; p.l=50;});
        saveToDisk();
        renderTactics(document.getElementById('module-content'));
    }
}

function initDrag() {
    const markers = document.querySelectorAll('.player-marker');
    const pitch = document.getElementById('tactical-pitch');
    let active = null;

    markers.forEach(m => {
        m.onmousedown = (e) => active = m;
        m.ontouchstart = (e) => active = m;
    });

    // Universelle Drag-Funktion
    const moveHandler = (clientX, clientY) => {
        if(!active) return;
        const rect = pitch.getBoundingClientRect();
        let l = ((clientX - rect.left) / rect.width) * 100;
        let t = ((clientY - rect.top) / rect.height) * 100;
        
        // Grenzen (0-100%)
        l = Math.max(0, Math.min(100, l));
        t = Math.max(0, Math.min(100, t));

        active.style.left = l + "%";
        active.style.top = t + "%";
        
        // Speichern im Objekt
        const p = eliteStore.tactics.toni.find(x => x.id === active.id) || eliteStore.tactics.opp.find(x => x.id === active.id);
        if(p) { p.t = t; p.l = l; }
    };

    document.onmousemove = (e) => moveHandler(e.clientX, e.clientY);
    document.ontouchmove = (e) => moveHandler(e.touches[0].clientX, e.touches[0].clientY);

    const endHandler = () => { if(active) { active = null; saveToDisk(); } };
    document.onmouseup = endHandler;
    document.ontouchend = endHandler;
}

// --- 7. MEDIA & VIDEO ---
function renderMedia(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="text-align:center;">
                <h3>VIDEO SUITE</h3>
                <p>Analyse & Telestrator</p>
                <button class="btn-neon-small" onclick="document.getElementById('video-suite-modal').classList.remove('hidden'); initCanvas();">ÖFFNEN</button>
            </div>
             <div class="office-panel" style="text-align:center;">
                <h3>ZEITUNG</h3>
                <p>Layout Editor</p>
                <button class="btn-neon-small" onclick="document.getElementById('magazine-studio-modal').classList.remove('hidden');">ÖFFNEN</button>
            </div>
        </div>`;
}

function loadVideoFile(input) {
    const file = input.files[0];
    if(file) {
        const v = document.getElementById('analysis-video');
        v.src = URL.createObjectURL(file);
        document.getElementById('video-ai-text').innerText = "Video geladen. Zeichnen aktiv.";
    }
}

// Canvas Painting
let isDraw=false, ctx;
function initCanvas() {
    const c = document.getElementById('telestrator-canvas');
    const container = document.querySelector('.video-stage');
    c.width = container.clientWidth;
    c.height = container.clientHeight;
    
    ctx = c.getContext('2d');
    ctx.strokeStyle = "#00f3ff";
    ctx.lineWidth = 3;
    
    c.onmousedown = (e) => { isDraw=true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
    c.onmousemove = (e) => { if(isDraw) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
    c.onmouseup = () => isDraw=false;
}
function closeVideoSuite() { document.getElementById('video-suite-modal').classList.add('hidden'); }

// --- 8. JUNIOR HUB ---
function renderYouth(target) {
    const k = eliteStore.players.find(p=>p.type==='youth');
    target.innerHTML = `
        <div class="office-panel fade-in">
            <h3>STICKER ALBUM: ${k.name}</h3>
            <div class="sticker-grid" style="margin-top:20px;">
                ${k.stickers.map((s,i) => `
                    <div class="sticker ${s?'unlocked':''}" onclick="toggleSticker(${i})">
                        ${s ? '★' : i+1}
                    </div>
                `).join('')}
            </div>
        </div>`;
}
function toggleSticker(i) {
    const k = eliteStore.players.find(p=>p.type==='youth');
    k.stickers[i] = !k.stickers[i];
    saveToDisk();
    renderYouth(document.getElementById('module-content'));
}

// --- HELPER & SETTINGS ---
function renderQuickList() { document.getElementById('quick-squad-list').innerHTML = ""; }
function saveToDisk() { localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore)); }
function loadFromDisk() { const s = localStorage.getItem(SAVE_KEY); if(s) eliteStore = {...eliteStore, ...JSON.parse(s)}; }

function toggleSettings() { document.getElementById('settings-modal').classList.toggle('hidden'); }
function saveSettings() {
    eliteStore.config.apiKey = document.getElementById('api-key-input').value;
    saveToDisk();
    toggleSettings();
}
function toggleMic() {
    document.getElementById('mic-btn').classList.toggle('mic-active');
    document.querySelector('.ai-msg').innerText = "Toni hört zu...";
}
