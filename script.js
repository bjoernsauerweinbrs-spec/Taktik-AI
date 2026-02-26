/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - TACTICAL DRAG & PERSISTENCE
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

let eliteStore = {
    config: { passkey: "1234", version: "15.8 PRO", clubLogoUrl: "" },
    mgmt: { budget: 4850000, morale: 88, activeModule: 'kader' },
    
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

    // Speicherung der Taktik-Positionen (Persistence)
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
            { id: 1, title: "MATCH DAY", content: "ANALYSE: Fokus auf Halbräume. Gegner agiert mit 3er-Kette." },
            { id: 2, title: "TACTICAL DATA", content: "Schnittstellen-Analyse: Vertikale Passwege im 4-4-2." },
            { id: 3, title: "OFFICE REPORT", content: "ROI-Analyse der Sponsoren-Pyramide." },
            { id: 4, title: "IMPRESSUM", content: "Toni 2.0 High-End Management Suite." }
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

// --- ELITE ADVISOR ---
function analyzePerformance(player) {
    const aiBox = document.querySelector('.ai-msg');
    let report = `ANALYSE [${player.name}]: `;
    if (player.bio.kfa > 13) report += `KFA bei ${player.bio.kfa}% kritisch für Explosivität. `;
    if (player.sensors.heart > 55) report += `Erhöhter Ruhepuls indiziert mangelnde Regeneration. `;
    else report += `VO2max (${player.sensors.vo2}) auf Elite-Niveau. Hohe Pressing-Intensität möglich. `;
    aiBox.innerHTML = `<strong>TONI PERF-ADVISOR:</strong> <br>${report}`;
}

// --- MEMORY CORE ---
function saveToDisk() { localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore)); }
function loadFromDisk() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) { 
        const parsed = JSON.parse(savedData);
        eliteStore = { ...eliteStore, ...parsed }; 
    }
}

// 1. BOOT
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

// 2. MODUL-ROUTER
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

// 3. KADER & BIO-LAB
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
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');
    analyzePerformance(p);
    container.innerHTML = `<div class="column-header">PERFORMANCE-HUB // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel"><h3>PHYSIO</h3>
                <div class="lab-row"><span>GEWICHT</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="updateValue(${p.id}, 'bio', 'weight', this.value)"></div>
            </div>
            <div class="office-panel"><h3>TELEMETRIE</h3>
                <div class="lab-row"><span>PULS</span><input type="number" value="${p.sensors.heart}" onchange="updateValue(${p.id}, 'sensors', 'heart', this.value)"></div>
            </div>
        </div><button onclick="closeBioLab()" class="btn-neon-small" style="width:100%; margin-top:20px;">DONE</button>`;
}

function updateValue(id, cat, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[cat][key] = parseFloat(val);
    saveToDisk();
    analyzePerformance(p);
}

function closeBioLab() { document.getElementById('bio-lab-modal').classList.add('hidden'); }

// 4. OFFICE PRIME
function renderOffice(target) {
    target.innerHTML = `<div class="office-grid fade-in">
        <div class="office-panel"><h3>PARTNER (ROI)</h3>${eliteStore.finance.sponsors.map(s => `<div class="lab-row"><span>${s.name}</span><b>${s.roi}%</b></div>`).join('')}</div>
        <div class="office-panel"><h3>INFRASTRUKTUR</h3><div class="lab-row"><span>ANALYSEZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b></div></div>
    </div>`;
}

// 5. MEDIA CENTER
function renderMediaCenter(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>STADIONZEITUNG PRO-STUDIO</h3><button class="btn-neon-small">EDITOR ÖFFNEN</button></div>`;
}

// 6. TAKTIK-ENGINE (INTEGRATED DRAG & DROP)
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header">
                <h3>TAKTIK-COCKPIT: MATRIX-ANALYSE</h3>
                <div class="tactics-status">FORMATION: 4-4-2 vs 3-4-3 (Gegner)</div>
            </div>
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    ${eliteStore.tactics.toni.map(p => `<div class="player-marker team-toni" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                    ${eliteStore.tactics.opp.map(p => `<div class="player-marker team-opp" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                </div>
            </div>
            <div class="tactics-report-panel">
                <div class="report-row"><span>ABSTÄNDE:</span> <b id="tactical-compactness">OPTIMAL</b></div>
                <p class="tactical-advice" id="toni-tactical-feed"><strong>TONI ANALYSE:</strong> Verschiebe die Spieler, um die defensive Kompaktheit gegen das 3-4-3 zu prüfen.</p>
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

        // Bounds check (0-100%)
        l = Math.max(2, Math.min(98, l));
        t = Math.max(2, Math.min(98, t));

        activeMarker.style.left = `${l}%`;
        activeMarker.style.top = `${t}%`;

        updateTacticalPosition(activeMarker.id, t, l);
    }

    function stopDrag() {
        if (activeMarker) {
            activeMarker = null;
            saveToDisk();
            evaluateKloppLogic();
        }
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('touchend', stopDrag);
    }
}

function updateTacticalPosition(id, t, l) {
    const toniP = eliteStore.tactics.toni.find(p => p.id === id);
    const oppP = eliteStore.tactics.opp.find(p => p.id === id);
    if (toniP) { toniP.t = t; toniP.l = l; }
    else if (oppP) { oppP.t = t; oppP.l = l; }
}

function evaluateKloppLogic() {
    const advice = document.getElementById('toni-tactical-feed');
    const compactness = document.getElementById('tactical-compactness');
    // Beispielhafte Analyse: Wenn ST zu weit weg von CM
    const st = eliteStore.tactics.toni.find(p => p.label === 'ST');
    const cm = eliteStore.tactics.toni.find(p => p.label === 'CM');
    
    const dist = Math.abs(st.t - cm.t);
    if (dist > 40) {
        compactness.innerText = "GEFÄHRDET";
        compactness.style.color = "var(--neon-alert)";
        advice.innerHTML = "<strong>TONI ANALYSE:</strong> Die vertikale Distanz zwischen Mittelfeld und Sturm ist zu groß. Wir verlieren den Zugriff auf den zweiten Ball.";
    } else {
        compactness.innerText = "OPTIMAL";
        compactness.style.color = "var(--neon-green)";
        advice.innerHTML = "<strong>TONI ANALYSE:</strong> Gute Kompaktheit. Die Abstände ermöglichen ein effektives Gegenpressing.";
    }
}

// 7. HELFER
function updateBudget() {
    const total = Object.values(eliteStore.finance.pro).reduce((a,b)=>a+b,0) + Object.values(eliteStore.finance.amateur).reduce((a,b)=>a+b,0);
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
    document.querySelector('.ai-msg').innerText = mic ? "Toni im Live-Analyse-Modus. Warte auf taktische Parameter." : "System im Standby.";
}
