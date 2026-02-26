/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - CO-TRAINER COMMAND
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

let eliteStore = {
    config: { passkey: "1234", version: "15.8 PRO", clubLogoUrl: "" },
    mgmt: { 
        budget: 4850000, morale: 88, activeModule: 'kader',
        opponentIntel: { name: "", strengths: "", topPlayers: [], tacticalRisk: "" }
    },
    
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1500000, stadium: 850000 },
        amateur: { members: 55000, gear: -4500, travel: -1200 },
        sponsors: [
            { id: 1, name: "Neural Gear", type: "Haupt", value: 1000000, bonus: 200000, roi: 12.5 },
            { id: 2, name: "AI-Fit", type: "Ärmel", value: 300000, bonus: 50000, roi: 8.2 },
            { id: 3, name: "ToniLogic", type: "Lokal", value: 200000, bonus: 20000, roi: 15.0 }
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
        }
    ]
};

// --- CO-TRAINER INTELLIGENCE: GEGNER-BRIEFING ---
function startOpponentBriefing(opponentName) {
    const aiBox = document.querySelector('.ai-msg');
    
    // Simulation: Toni zieht Daten aus Fußball.de / Scout-Datenbank
    const intel = {
        name: opponentName.toUpperCase(),
        strengths: "Extremes Umschaltspiel über die Flügel",
        topPlayers: ["Top-Scorer: Müller (12 Tore)", "Spielgestalter: Kroos (Rating 88)"],
        tacticalRisk: "Hohe Anfälligkeit bei Pressing in Zone 5"
    };

    eliteStore.mgmt.opponentIntel = intel;
    
    aiBox.innerHTML = `
        <strong>CO-TRAINER TONI // BRIEFING:</strong><br>
        Gegner ${intel.name} ist offensivstark (${intel.strengths}). <br>
        <strong>Top-Gefahr:</strong> ${intel.topPlayers.join(', ')}.<br>
        Ich bereite die taktische Gegenmaßnahme vor...
    `;

    setTimeout(() => suggestAnalyticalLineup(), 2000);
}

// TONIS AUFSTELLUNGS-VORSCHLAG (BASIEREND AUF RATINGS)
function suggestAnalyticalLineup() {
    const aiBox = document.querySelector('.ai-msg');
    
    // Logik: Wer hat das höchste DEF & PAC Rating für die Defensive?
    const defenders = [...eliteStore.players].sort((a, b) => b.stats.def - a.stats.def);
    const speedsters = [...eliteStore.players].sort((a, b) => b.stats.pac - a.stats.pac);

    aiBox.innerHTML += `<br><br><strong>EMPFEHLUNG:</strong> Da der Gegner über die Flügel drückt, schlage ich ${defenders[0].name} als defensiven Anker vor. 
    Lass mich die Formation auf dem Board anpassen...`;

    // Toni übernimmt das Board (Co-Trainer Autonomie)
    setTimeout(() => {
        applyTacticalShift('defensive_compactness');
    }, 2500);
}

// TONI VERSCHIEBT SPIELER (HANDS-FREE SIMULATION)
function applyTacticalShift(mode) {
    if (mode === 'defensive_compactness') {
        // Toni rückt die CMs näher an die CBs
        const cm1 = eliteStore.tactics.toni.find(p => p.id === 't7');
        const cm2 = eliteStore.tactics.toni.find(p => p.id === 't8');
        
        cm1.t = 60; cm1.l = 45;
        cm2.t = 60; cm2.l = 55;

        saveToDisk();
        if (eliteStore.mgmt.activeModule === 'tactics') {
            renderTactics(document.getElementById('module-content'));
        }
        
        document.querySelector('.ai-msg').innerHTML += `<br><br><span style="color:var(--neon-cyan)">[BOARD-UPDATE]: Kompaktheit im Zentrum hergestellt.</span>`;
    }
}

// --- CORE SYSTEM FUNKTIONEN ---
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
}

function renderKader(target) {
    target.innerHTML = `<div class="kader-grid fade-in">${eliteStore.players.map(p => `
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
        <div class="column-header">PERFORMANCE-HUB // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel"><h3>PHYSIO</h3>
                <div class="lab-row"><span>GEWICHT</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="p.bio.weight=parseFloat(this.value); saveToDisk();"></div>
            </div>
        </div><button onclick="document.getElementById('bio-lab-modal').classList.add('hidden')" class="btn-neon-small" style="width:100%; margin-top:20px;">SYNC</button>`;
}

// --- TAKTIK-ENGINE (AUTONOMER MODUS) ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header">
                <h3>TAKTIK-COCKPIT // CO-TRAINER AKTIV</h3>
                <div class="input-group" style="margin: 10px 0;">
                    <input type="text" id="opponent-search" placeholder="GEGNER ANALYSIEREN...">
                    <button class="btn-neon-small" onclick="startOpponentBriefing(document.getElementById('opponent-search').value)">BRIEFING STARTEN</button>
                </div>
            </div>
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    ${eliteStore.tactics.toni.map(p => `<div class="player-marker team-toni" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                    ${eliteStore.tactics.opp.map(p => `<div class="player-marker team-opp" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                </div>
            </div>
            <div class="tactics-report-panel">
                <div class="report-row"><span>GEGNER:</span> <b>${eliteStore.mgmt.opponentIntel.name || 'UNBEKANNT'}</b></div>
                <p class="tactical-advice" id="toni-tactical-feed">Warte auf Gegner-Analyse für proaktive Positions-Anpassung.</p>
            </div>
        </div>`;
    initDragAndDrop();
}

function initDragAndDrop() {
    const pitch = document.getElementById('tactical-pitch');
    const markers = document.querySelectorAll('.player-marker');
    let activeMarker = null;

    markers.forEach(marker => {
        marker.addEventListener('mousedown', startDrag);
        marker.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
        e.preventDefault();
        activeMarker = this;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    function drag(e) {
        if (!activeMarker) return;
        const rect = pitch.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let l = ((clientX - rect.left) / rect.width) * 100;
        let t = ((clientY - rect.top) / rect.height) * 100;
        l = Math.max(2, Math.min(98, l));
        t = Math.max(2, Math.min(98, t));
        activeMarker.style.left = `${l}%`;
        activeMarker.style.top = `${t}%`;
        updateTacticalPosition(activeMarker.id, t, l);
    }

    function stopDrag() {
        activeMarker = null;
        saveToDisk();
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function updateTacticalPosition(id, t, l) {
    const p = eliteStore.tactics.toni.find(x => x.id === id) || eliteStore.tactics.opp.find(x => x.id === id);
    if (p) { p.t = t; p.l = l; }
}

function updateBudget() {
    const total = Object.values(eliteStore.finance.pro).reduce((a,b)=>a+b,0);
    const el = document.getElementById('kpi-budget');
    if(el) el.innerText = total.toLocaleString() + " €";
}

function renderQuickList() {
    const el = document.getElementById('quick-squad-list');
    if(el) el.innerHTML = eliteStore.players.map(p => `<div class="list-item" onclick="openBioLab(${p.id})"><span>${p.name}</span><b>${p.rating}</b></div>`).join('');
}

let mic = false;
function toggleMic() {
    mic = !mic;
    document.getElementById('mic-btn').className = mic ? 'mic-active' : 'mic-inactive';
    document.querySelector('.ai-msg').innerText = mic ? "Co-Trainer Toni hört zu. Befehl zur Gegner-Analyse erwartet." : "System im Standby.";
}

function renderOffice(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>STRATEGISCHE PARTNER</h3><p>ROI-Management aktiv.</p></div>`;
}

function renderMediaCenter(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>STADIONZEITUNG STUDIO</h3><p>Druck-Engine bereit.</p></div>`;
}
