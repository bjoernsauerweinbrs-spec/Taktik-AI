/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V16.0 ULTIMATE) - ALL SYSTEMS GO
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

let eliteStore = {
    config: { passkey: "1234", version: "16.0 ULTIMATE", clubLogoUrl: "" },
    mgmt: { 
        budget: 4850000, morale: 88, activeModule: 'kader',
        opponentIntel: { name: "", strengths: "", topPlayers: [], tacticalRisk: "" }
    },
    
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1500000, stadium: 850000 },
        amateur: { members: 55000, gear: -4500, travel: -1200 },
        sponsors: [
            { id: 1, name: "Neural Gear", type: "Haupt", value: 1000000, logo: "🛡️", roi: 12.5 },
            { id: 2, name: "AI-Fit", type: "Ärmel", value: 300000, logo: "⚡", roi: 8.2 },
            { id: 3, name: "ToniLogic", type: "Lokal", value: 200000, logo: "🧠", roi: 15.0 }
        ],
        infrastructure: { analysisCenter: 1, stadiumExp: 1, academy: 1 }
    },

    tactics: {
        toni: [
            { id: 't1', label: 'GK', t: 85, l: 50 }, { id: 't2', label: 'LB', t: 70, l: 20 },
            { id: 't3', label: 'CB', t: 70, l: 40 }, { id: 't4', label: 'CB', t: 70, l: 60 },
            { id: 't5', label: 'RB', t: 70, l: 80 }, { id: 't6', label: 'LM', t: 45, l: 15 },
            { id: 't7', label: 'CM', t: 45, l: 40 }, { id: 't8', label: 'CM', t: 45, l: 60 },
            { id: 't9', label: 'RM', t: 45, l: 85 }, { id: 't10', label: 'ST', t: 20, l: 45 },
            { id: 't11', label: 'ST', t: 20, l: 55 }
        ],
        opp: [
            { id: 'o1', label: 'GK', t: 10, l: 50 }, { id: 'o2', label: 'CB', t: 25, l: 30 },
            { id: 'o3', label: 'CB', t: 25, l: 50 }, { id: 'o4', label: 'CB', t: 25, l: 70 },
            { id: 'o5', label: 'LWB', t: 40, l: 10 }, { id: 'o6', label: 'CM', t: 40, l: 35 },
            { id: 'o7', label: 'CM', t: 40, l: 65 }, { id: 'o8', label: 'RWB', t: 40, l: 90 },
            { id: 'o9', label: 'LW', t: 60, l: 25 }, { id: 'o10', label: 'ST', t: 60, l: 50 },
            { id: 'o11', label: 'RW', t: 60, l: 75 }
        ]
    },

    magazine: {
        clubName: "FC TONI 2.0", sheets: 1,
        pages: [
            { id: 1, title: "MATCH DAY", content: "ANALYSE: Fokus auf Halbräume." },
            { id: 2, title: "DATEN-REPORT", content: "Warten auf Gegner-Sync..." },
            { id: 3, title: "VORSTAND", content: "ROI-Analyse Sponsoring." },
            { id: 4, title: "PARTNER", content: "Offizielle Vereinspartner." }
        ]
    },

    players: [
        { 
            id: 1, name: "NEUER", pos: "TW", type: 'pro', imgUrl: "", 
            stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, 
            bio: { weight: 92.4, kfa: 11.2, muscle: 48.5, water: 62.1 }, 
            sensors: { heart: 48, vo2: 60 }, rating: 89 
        },
        { 
            id: 10, name: "KANE", pos: "ST", type: 'pro', imgUrl: "", 
            stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, 
            bio: { weight: 86.1, kfa: 12.5, muscle: 47.2, water: 59.8 }, 
            sensors: { heart: 46, vo2: 58 }, rating: 90 
        },
        // WICHTIG: Der Jugendspieler für das Album
        { 
            id: 101, name: "LEON", pos: "ST", type: 'youth', imgUrl: "",
            stats: { pac: 70, sho: 60, pas: 65, dri: 75, def: 40, phy: 50 },
            bio: { weight: 34.5, kfa: 9.0, muscle: 14.8, water: 66.0 },
            sensors: { heart: 65, vo2: 52 },
            stickers: [true, true, false, false, false, false, false, false, false, false, false, false],
            rating: 65 
        }
    ]
};

// --- SYSTEM CORE ---
function saveToDisk() { localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore)); }
function loadFromDisk() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) { eliteStore = { ...eliteStore, ...JSON.parse(savedData) }; }
}

function systemBootSequence() {
    loadFromDisk();
    const input = document.getElementById('passkey');
    if (input.value === eliteStore.config.passkey) {
        document.getElementById('auth-layer').style.display = 'none';
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else { alert("ACCESS DENIED."); }
}

function initDashboard() {
    updateBudget();
    renderQuickList();
    switchModule('kader');
    setInterval(() => {
        const clock = document.getElementById('clock-display');
        if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// --- MODUL ROUTER ---
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    const title = document.getElementById('active-mod-title');
    eliteStore.mgmt.activeModule = modId;
    document.querySelectorAll('.side-nav button').forEach(b => b.classList.remove('active'));
    const navBtn = document.getElementById(`nav-${modId}`);
    if(navBtn) navBtn.classList.add('active');
    title.innerText = modId.toUpperCase();

    if (modId === 'kader') renderKader(stage);
    if (modId === 'finance') renderOffice(stage);
    if (modId === 'media') renderMediaCenter(stage);
    if (modId === 'tactics') renderTactics(stage);
    if (modId === 'youth') renderJuniorHub(stage);
}

// --- KADER & BIO-LAB ---
function renderKader(target) {
    target.innerHTML = `<div class="kader-grid fade-in">${eliteStore.players.filter(p => p.type === 'pro').map(p => `
        <div class="fifa-card" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-rating-box"><span class="val">${p.rating}</span></div>
                <div class="card-name">${p.name}</div>
            </div>
        </div>`).join('')}</div>`;
}

function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    modal.classList.remove('hidden');
    document.getElementById('modal-container').innerHTML = `
        <div class="column-header">ANALYSE // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel"><h3>BIOMETRIE</h3>
                <div class="lab-row"><span>GEWICHT</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="p.bio.weight=parseFloat(this.value); saveToDisk();"></div>
                <div class="lab-row"><span>KFA %</span><input type="number" step="0.1" value="${p.bio.kfa}" onchange="p.bio.kfa=parseFloat(this.value); saveToDisk();"></div>
            </div>
            <div class="office-panel"><h3>TELEMETRIE</h3>
                <div class="lab-row"><span>PULS</span><input type="number" value="${p.sensors.heart}" onchange="p.sensors.heart=parseInt(this.value); saveToDisk();"></div>
            </div>
        </div><button onclick="document.getElementById('bio-lab-modal').classList.add('hidden')" class="btn-neon-small" style="width:100%; margin-top:20px;">SYNC</button>`;
}

// --- OFFICE (AKTENTASCHE) ---
function renderOffice(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>SPONSOREN-MANAGEMENT (ROI)</h3>
                ${eliteStore.finance.sponsors.map(s => `
                    <div class="lab-row"><span>${s.name}</span><b>${s.roi}% ROI</b></div>
                `).join('')}
            </div>
            <div class="office-panel">
                <h3>INFRASTRUKTUR</h3>
                <div class="lab-row"><span>ANALYSEZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b></div>
            </div>
            <div class="office-panel" style="grid-column: span 2;">
                <h3>FINANZ-VORSCHAU</h3>
                ${Object.keys(eliteStore.finance.pro).map(k => `<div class="lab-row"><span>${k.toUpperCase()}</span><input type="number" value="${eliteStore.finance.pro[k]}" onchange="eliteStore.finance.pro['${k}']=parseInt(this.value); saveToDisk(); updateBudget();"></div>`).join('')}
            </div>
        </div>`;
}

// --- MEDIA CENTER (STUDIO) ---
function renderMediaCenter(target) {
    target.innerHTML = `
        <div class="office-panel fade-in" style="text-align:center;">
            <h3>STADIONZEITUNG PRO-EDITOR</h3>
            <p>Layout: DIN-A4 Querformat | Bögen: ${eliteStore.magazine.sheets}</p>
            <div style="margin-top:20px;">
                <button class="btn-neon-small" onclick="openMagazineStudio()"><i class="fa-solid fa-file-invoice"></i> EDITOR ÖFFNEN</button>
            </div>
        </div>`;
}

function openMagazineStudio() {
    const modal = document.getElementById('magazine-studio-modal');
    const container = document.getElementById('magazine-sheet-container');
    modal.classList.remove('hidden');
    renderMagSheets(container);
}

function renderMagSheets(container) {
    let html = "";
    for (let i = 0; i < eliteStore.magazine.pages.length; i += 2) {
        html += `
            <div class="magazine-sheet-sim">
                <div class="mag-page-sim">
                    <small>SEITE ${i+1}</small>
                    <h4 contenteditable="true" onblur="eliteStore.magazine.pages[${i}].title=this.innerText; saveToDisk();">${eliteStore.magazine.pages[i].title}</h4>
                    <div class="mag-content-editable" contenteditable="true" onblur="eliteStore.magazine.pages[${i}].content=this.innerText; saveToDisk();">${eliteStore.magazine.pages[i].content}</div>
                </div>
                <div class="mag-page-sim">
                    <small>SEITE ${i+2}</small>
                    <h4 contenteditable="true" onblur="eliteStore.magazine.pages[${i+1}].title=this.innerText; saveToDisk();">${eliteStore.magazine.pages[i+1].title}</h4>
                    <div class="mag-content-editable" contenteditable="true" onblur="eliteStore.magazine.pages[${i+1}].content=this.innerText; saveToDisk();">${eliteStore.magazine.pages[i+1].content}</div>
                    ${(i+2 === eliteStore.magazine.sheets * 4) ? `<div class="mag-sponsor-footer">${eliteStore.finance.sponsors.map(s => `<div class="mag-sponsor-logo"><b>${s.logo}</b> ${s.name}</div>`).join('')}</div>` : ""}
                </div>
            </div>`;
    }
    container.innerHTML = html;
}

// --- TAKTIK ENGINE & CO-TRAINER ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header">
                <h3>TAKTIK-COCKPIT // CO-TRAINER</h3>
                <div class="input-group" style="margin: 10px 0;">
                    <input type="text" id="opponent-search" placeholder="GEGNER ANALYSIEREN...">
                    <button class="btn-neon-small" onclick="startOpponentBriefing(document.getElementById('opponent-search').value)">START</button>
                </div>
            </div>
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    ${eliteStore.tactics.toni.map(p => `<div class="player-marker team-toni" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                    ${eliteStore.tactics.opp.map(p => `<div class="player-marker team-opp" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                </div>
            </div>
            <div class="tactics-report-panel">
                <div class="report-row"><span>GEGNER:</span> <b>${eliteStore.mgmt.opponentIntel.name || 'STANDBY'}</b></div>
                <p class="tactical-advice" id="toni-tactical-feed">Bereit für Performance-Analyse.</p>
            </div>
        </div>`;
    initDragAndDrop();
}

function startOpponentBriefing(club) {
    if(!club) return;
    const aiBox = document.querySelector('.ai-msg');
    eliteStore.mgmt.opponentIntel = { name: club.toUpperCase(), strengths: "Zentrumsfokus", tacticalRisk: "Konteranfällig" };
    aiBox.innerHTML = `<strong>CO-TRAINER:</strong> Analyse für ${club} abgeschlossen. Ich schlage eine kompakte Verschiebung vor.`;
    setTimeout(() => applyTacticalShift(), 1000);
}

function applyTacticalShift() {
    const cm1 = eliteStore.tactics.toni.find(p => p.id === 't7');
    const cm2 = eliteStore.tactics.toni.find(p => p.id === 't8');
    cm1.t = 60; cm2.t = 60; // Toni verschiebt CMs tiefer
    saveToDisk();
    renderTactics(document.getElementById('module-content'));
}

function initDragAndDrop() {
    const pitch = document.getElementById('tactical-pitch');
    if (!pitch) return;
    const markers = document.querySelectorAll('.player-marker');
    let activeMarker = null;

    markers.forEach(m => {
        m.addEventListener('mousedown', (e) => { activeMarker = m; });
        m.addEventListener('touchstart', (e) => { activeMarker = m; }, { passive: false });
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeMarker) return;
        const rect = pitch.getBoundingClientRect();
        let l = ((e.clientX - rect.left) / rect.width) * 100;
        let t = ((e.clientY - rect.top) / rect.height) * 100;
        activeMarker.style.left = `${Math.max(2, Math.min(98, l))}%`;
        activeMarker.style.top = `${Math.max(2, Math.min(98, t))}%`;
        updateTacticalPosition(activeMarker.id, t, l);
    });

    document.addEventListener('mouseup', () => { activeMarker = null; saveToDisk(); });
}

function updateTacticalPosition(id, t, l) {
    const p = eliteStore.tactics.toni.find(x => x.id === id) || eliteStore.tactics.opp.find(x => x.id === id);
    if (p) { p.t = t; p.l = l; }
}

// --- JUNIOR HERO HUB (WIEDERHERGESTELLT) ---
function renderJuniorHub(target) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    if (!kid) { target.innerHTML = "Kein Jugendspieler gefunden."; return; }
    
    target.innerHTML = `
        <div class="office-panel fade-in">
            <h3>PANINI ALBUM // ${kid.name}</h3>
            <div class="sticker-grid" style="display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:20px;">
                ${kid.stickers.map((s, i) => `
                    <div class="sticker ${s ? 'unlocked' : ''}" 
                         style="height:60px; background:${s ? 'var(--neon-gold)' : '#333'}; border:1px solid #555; display:flex; align-items:center; justify-content:center; cursor:pointer;"
                         onclick="toggleSticker(${i})">
                        ${s ? '★' : i+1}
                    </div>
                `).join('')}
            </div>
            <p style="margin-top:15px; font-size:10px;">* Klicke auf ein Feld, um Sticker einzukleben.</p>
        </div>`;
}

function toggleSticker(i) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    if (kid) {
        kid.stickers[i] = !kid.stickers[i];
        saveToDisk();
        renderJuniorHub(document.getElementById('module-content'));
    }
}

// --- HELFER ---
function updateBudget() {
    const total = Object.values(eliteStore.finance.pro).reduce((a,b)=>a+b,0);
    const el = document.getElementById('kpi-budget');
    if(el) el.innerText = total.toLocaleString() + " €";
}

function renderQuickList() {
    const el = document.getElementById('quick-squad-list');
    if(el) el.innerHTML = eliteStore.players.map(p => `<div class="list-item" onclick="openBioLab(${p.id})"><span>${p.name}</span><b>${p.rating}</b></div>`).join('');
}

function toggleMic() {
    const mic = document.getElementById('mic-btn');
    mic.classList.toggle('mic-active');
    document.querySelector('.ai-msg').innerText = "Toni hört zu...";
}
