/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - TACTICAL ENGINE UPGRADE
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
        infrastructure: {
            analysisCenter: 1, 
            stadiumExp: 1,
            academy: 1
        }
    },

    magazine: {
        clubName: "FC TONI 2.0",
        sheets: 1,
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
            sensors: { heart: 48, vo2: 60 },
            rating: 89 
        },
        { 
            id: 10, name: "KANE", pos: "ST", type: 'pro', imgUrl: "",
            stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 },
            bio: { weight: 86.1, kfa: 12.5, muscle: 47.2, water: 59.8 },
            sensors: { heart: 46, vo2: 58 },
            rating: 90 
        }
    ]
};

// --- ELITE ADVISOR LOGIK (NAGELSMANN-MODUS) ---
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
    if (savedData) { eliteStore = {...eliteStore, ...JSON.parse(savedData)}; }
}

// 1. SYSTEM-BOOT
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
    if (modId === 'youth') renderJuniorHub(stage);
    if (modId === 'media') renderMediaCenter(stage);
    if (modId === 'tactics') renderTactics(stage);
}

// 3. KADER RENDERING
function renderKader(target) {
    target.innerHTML = `
        <div class="kader-grid fade-in">
            ${eliteStore.players.map(p => `
                <div class="fifa-card" onclick="openBioLab(${p.id})">
                    <div class="card-inner">
                        <div class="card-rating-box"><span class="val">${p.rating}</span><span class="pos">${p.pos}</span></div>
                        <div class="player-img-box">${p.imgUrl ? `<img src="${p.imgUrl}">` : `<i class="fa-solid fa-user-ninja"></i>`}</div>
                        <div class="card-name">${p.name}</div>
                        <div class="card-stats">
                            <span>PAC <b>${p.stats.pac}</b></span><span>SHO <b>${p.stats.sho}</b></span>
                            <span>PAS <b>${p.stats.pas}</b></span><span>DRI <b>${p.stats.dri}</b></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 4. BIO-LAB
function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');
    analyzePerformance(p);
    container.innerHTML = `
        <div class="column-header">PERFORMANCE-HUB // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel">
                <h3>PHYSIO-ANALYSE</h3>
                <div class="lab-row"><span>GEWICHT</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="updateValue(${p.id}, 'bio', 'weight', this.value)"></div>
                <div class="lab-row"><span>KFA %</span><input type="number" step="0.1" value="${p.bio.kfa}" onchange="updateValue(${p.id}, 'bio', 'kfa', this.value)"></div>
            </div>
            <div class="office-panel">
                <h3>TELEMETRIE</h3>
                <div class="lab-row"><span>PULS</span><input type="number" value="${p.sensors.heart}" onchange="updateValue(${p.id}, 'sensors', 'heart', this.value)"></div>
                <div class="lab-row"><span>VO2MAX</span><input type="number" value="${p.sensors.vo2}" onchange="updateValue(${p.id}, 'sensors', 'vo2', this.value)"></div>
            </div>
        </div>
        <button onclick="closeBioLab()" class="btn-neon-small" style="width:100%; margin-top:20px;">ANALYSE ABSCHLIESSEN</button>
    `;
}

function updateValue(id, cat, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[cat][key] = parseFloat(val);
    saveToDisk();
    analyzePerformance(p);
}

function closeBioLab() { document.getElementById('bio-lab-modal').classList.add('hidden'); }

// 5. OFFICE PRIME
function renderOffice(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>PARTNER (ROI)</h3>
                ${eliteStore.finance.sponsors.map(s => `<div class="lab-row"><span>${s.name}</span><b>ROI: ${s.roi}%</b></div>`).join('')}
            </div>
            <div class="office-panel">
                <h3>INFRASTRUKTUR</h3>
                <div class="lab-row"><span>ANALYSEZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b></div>
            </div>
        </div>`;
}

// 6. MEDIA CENTER
function renderMediaCenter(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>STADIONZEITUNG PRO-STUDIO</h3><button class="btn-neon-small" onclick="openMagazineStudio()">EDITOR ÖFFNEN</button></div>`;
}

// 7. TAKTIK-ENGINE (4-4-2 VS 3-4-3 ANALYSE)
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header">
                <h3>TAKTIK-COCKPIT: MATRIX-ANALYSE</h3>
                <div class="tactics-status">FORMATION: 4-4-2 vs 3-4-3 (Gegner)</div>
            </div>
            
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    <div class="player-marker team-toni" style="top: 85%; left: 50%;">GK</div>
                    <div class="player-marker team-toni" style="top: 70%; left: 20%;">LB</div>
                    <div class="player-marker team-toni" style="top: 70%; left: 40%;">CB</div>
                    <div class="player-marker team-toni" style="top: 70%; left: 60%;">CB</div>
                    <div class="player-marker team-toni" style="top: 70%; left: 80%;">RB</div>
                    <div class="player-marker team-toni" style="top: 45%; left: 15%;">LM</div>
                    <div class="player-marker team-toni" style="top: 45%; left: 40%;">CM</div>
                    <div class="player-marker team-toni" style="top: 45%; left: 60%;">CM</div>
                    <div class="player-marker team-toni" style="top: 45%; left: 85%;">RM</div>
                    <div class="player-marker team-toni" style="top: 20%; left: 45%;">ST</div>
                    <div class="player-marker team-toni" style="top: 20%; left: 55%;">ST</div>

                    <div class="player-marker team-opp" style="top: 10%; left: 50%;">GK</div>
                    <div class="player-marker team-opp" style="top: 25%; left: 30%;">CB</div>
                    <div class="player-marker team-opp" style="top: 25%; left: 50%;">CB</div>
                    <div class="player-marker team-opp" style="top: 25%; left: 70%;">CB</div>
                    <div class="player-marker team-opp" style="top: 40%; left: 10%;">LWB</div>
                    <div class="player-marker team-opp" style="top: 40%; left: 35%;">CM</div>
                    <div class="player-marker team-opp" style="top: 40%; left: 65%;">CM</div>
                    <div class="player-marker team-opp" style="top: 40%; left: 90%;">RWB</div>
                    <div class="player-marker team-opp" style="top: 60%; left: 25%;">LW</div>
                    <div class="player-marker team-opp" style="top: 60%; left: 50%;">ST</div>
                    <div class="player-marker team-opp" style="top: 60%; left: 75%;">RW</div>
                </div>
            </div>

            <div class="tactics-report-panel">
                <div class="report-row"><span>SCHNITTSTELLEN:</span> <b style="color:var(--neon-green)">OFFEN</b></div>
                <div class="report-row"><span>ÜBERLADUNG:</span> <b style="color:var(--neon-gold)">FLÜGEL-ZONE 2 & 8</b></div>
                <p class="tactical-advice">
                    <strong>TONI ANALYSE:</strong> Das 3-4-3 des Gegners erzeugt Druck auf unsere Außenverteidiger. 
                    Empfehlung: Die CMs müssen bei Ballbesitz die Halbräume besetzen, um die 3er-Kette vertikal zu binden. 
                    Restverteidigung über 4-2 Staffelung sichern.
                </p>
            </div>
        </div>
    `;
    
    // Einfache Drag-Logik Initialisierung (Simulation)
    initDragAndDrop();
}

function initDragAndDrop() {
    const markers = document.querySelectorAll('.player-marker');
    markers.forEach(m => {
        m.addEventListener('mousedown', (e) => {
            m.style.cursor = 'grabbing';
            // Erweiterte Logik für Koordinaten-Tracking hier möglich
        });
        m.addEventListener('mouseup', () => m.style.cursor = 'pointer');
    });
}

// 8. HELFER
function updateBudget() {
    const total = Object.values(eliteStore.finance.pro).reduce((a,b)=>a+b,0) + Object.values(eliteStore.finance.amateur).reduce((a,b)=>a+b,0);
    document.getElementById('kpi-budget').innerText = total.toLocaleString() + " €";
}

function renderQuickList() {
    document.getElementById('quick-squad-list').innerHTML = eliteStore.players.map(p => `<div class="list-item" onclick="openBioLab(${p.id})"><span>${p.name}</span><b>${p.rating}</b></div>`).join('');
}

let mic = false;
function toggleMic() {
    mic = !mic;
    document.getElementById('mic-btn').className = mic ? 'mic-active' : 'mic-inactive';
    document.querySelector('.ai-msg').innerText = mic ? "Toni im Live-Analyse-Modus. Warte auf taktische Parameter." : "System im Standby.";
}
