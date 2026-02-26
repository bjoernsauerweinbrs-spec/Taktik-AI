/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V21.0 (NLZ MASTERY & TALENT ENGINE)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V21";

// --- 1. CORE DATA ARCHITECTURE ---
let NCOS = {
    state: {
        budget: 4500000,
        activeModule: 'nlz',
        isMicActive: false
    },
    
    // NLZ DATA (Struktur für Panini-Karten & Jahrgänge)
    academy: {
        players: [
            { 
                id: 101, name: "Julian Weber", birthDate: "2011-05-15", position: "ST", 
                stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 }, 
                promotedTo: null, // Wenn null, dann Standard nach Alter
                stickers: [true, true, false], 
                aiReview: "Technisch versiert, Fokus auf Physis-Aufbau." 
            },
            { 
                id: 102, name: "Leon Kraft", birthDate: "2009-09-22", position: "IV", 
                stats: { pac: 62, sho: 45, pas: 58, dri: 51, def: 78, phy: 75 }, 
                promotedTo: "U19", // Beispiel: Ein Talent wurde hochgezogen
                stickers: [true, false, false], 
                aiReview: "Körperlich bereits auf Senior-Niveau. Taktik-Schulung nötig." 
            }
        ]
    },

    finance: [
        { id: 1, date: "26.02.", desc: "Sponsoring: Neural Gear", val: 1500000, cat: "Income" }
    ],

    tactics: {
        players: [{ id: 1, label: "TW", x: 50, y: 92, team: 'home' }],
        vectors: [],
        equipment: []
    }
};

// --- 2. SYSTEM START ---
function bootSystem() {
    const btn = document.querySelector('.btn-main');
    btn.innerText = "INITIALISIERE TALENT-DATENBANK...";
    
    setTimeout(() => {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');
        initClock();
        loadModule('nlz');
        updateGlobalHUD();
    }, 1000);
}

function initClock() {
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// --- 3. MODULE ROUTER ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });
    
    document.getElementById('active-mod-name').innerText = "// " + name.toUpperCase();

    if (name === 'nlz') renderNLZ(stage);
    if (name === 'tactics') renderTactics(stage);
    if (name === 'manager') renderManager(stage);
    if (name === 'press') renderPress(stage);
}

// --- 4. NLZ ACADEMY HUB (FIFA-CARDS & PROMOTION) ---
function renderNLZ(target) {
    target.innerHTML = `
        <div style="padding:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <div class="luxury-logo" style="font-size:32px;">TONI 2.0 // NLZ STICKER-ALBUM</div>
                <button class="btn-main" style="width:auto; padding:10px 30px;" onclick="openAddPlayerModal()">+ SPIELER REGISTRIEREN</button>
            </div>
            
            <div class="panini-album">
                ${NCOS.academy.players.map(p => {
                    const ageGroup = calculateAgeGroup(p.birthDate, p.promotedTo);
                    const ovr = calculateOVR(p.stats);
                    return `
                    <div class="panini-card" onclick="editYouthPlayer(${p.id})">
                        <div style="padding:20px;">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                                <div>
                                    <div style="font-family:var(--font-ui); color:var(--neon-gold); font-size:24px;">${ovr}</div>
                                    <div style="font-size:10px; color:#888;">${p.position}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-family:var(--font-ui); color:var(--neon-cyan); font-size:14px;">${ageGroup}</div>
                                    ${p.promotedTo ? '<div style="font-size:8px; color:var(--neon-gold);">PROMOTED</div>' : ''}
                                </div>
                            </div>
                            
                            <div style="text-align:center; margin:15px 0;">
                                <i class="fa-solid fa-user-graduate" style="font-size:60px; color:#1a253d;"></i>
                            </div>
                            
                            <div style="text-align:center; font-family:var(--font-ui); margin-bottom:10px; border-bottom:1px solid #333; padding-bottom:5px;">${p.name}</div>
                            
                            <div class="panini-stats" style="display:grid; grid-template-columns: 1fr 1fr; gap:5px; font-size:10px; font-family:var(--font-ui);">
                                <span>PAC <strong>${p.stats.pac}</strong></span> <span>DRI <strong>${p.stats.dri}</strong></span>
                                <span>SHO <strong>${p.stats.sho}</strong></span> <span>DEF <strong>${p.stats.def}</strong></span>
                                <span>PAS <strong>${p.stats.pas}</strong></span> <span>PHY <strong>${p.stats.phy}</strong></span>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// --- 5. TALENT-LOGIK (ALTER & OVR) ---
function calculateAgeGroup(birthDate, promotedTo) {
    if (promotedTo) return promotedTo; // Manuelle Beförderung sticht Alter
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    if (age <= 11) return "U11";
    if (age <= 13) return "U13";
    if (age <= 15) return "U15";
    if (age <= 17) return "U17";
    return "U19";
}

function calculateOVR(stats) {
    const values = Object.values(stats);
    return Math.round(values.reduce((a, b) => a + b) / values.length);
}

// --- 6. SPIELER-EDITOR (MODAL) ---
function openAddPlayerModal() {
    const modal = document.getElementById('modal-bio');
    const inner = document.getElementById('bio-content-inner');
    
    inner.innerHTML = `
        <div style="padding:40px; background:var(--bg-panel); border:1px solid var(--neon-cyan);">
            <h2 style="font-family:var(--font-ui); margin-bottom:30px;">NEUES TALENT REGISTRIEREN</h2>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                <input id="p-name" class="auth-input" style="text-align:left;" placeholder="NAME">
                <input id="p-birth" type="date" class="auth-input" style="text-align:left;" placeholder="GEBURTSDATUM">
                <select id="p-pos" class="auth-input" style="text-align:left;">
                    <option value="TW">TW</option><option value="IV">IV</option><option value="ZM">ZM</option><option value="ST">ST</option>
                </select>
            </div>
            <button class="btn-main" style="margin-top:30px;" onclick="saveNewPlayer()">IN DEN KADER AUFNEHMEN</button>
            <button class="btn-main" style="margin-top:10px; border-color:#444;" onclick="toggleModal('modal-bio', false)">ABBRECHEN</button>
        </div>
    `;
    toggleModal('modal-bio', true);
}

function editYouthPlayer(id) {
    const p = NCOS.academy.players.find(x => x.id === id);
    const modal = document.getElementById('modal-bio');
    const inner = document.getElementById('bio-content-inner');
    
    inner.innerHTML = `
        <div style="padding:40px; background:var(--bg-panel); border:1px solid var(--neon-gold);">
            <h2 style="font-family:var(--font-ui); margin-bottom:10px;">AKTE: ${p.name}</h2>
            <p style="font-size:10px; color:#666; margin-bottom:30px;">GEBOREN: ${p.birthDate}</p>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:40px;">
                <div>
                    <h4 style="font-family:var(--font-ui); font-size:12px; margin-bottom:15px; color:var(--neon-cyan);">FIFA-WERTE</h4>
                    ${Object.keys(p.stats).map(stat => `
                        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                            <label style="text-transform:uppercase;">${stat}</label>
                            <input type="number" id="stat-${stat}" value="${p.stats[stat]}" style="width:60px; background:#000; border:1px solid #333; color:white; text-align:center;">
                        </div>
                    `).join('')}
                </div>
                <div>
                    <h4 style="font-family:var(--font-ui); font-size:12px; margin-bottom:15px; color:var(--neon-gold);">PROMOTION</h4>
                    <label style="font-size:10px; color:#666;">MANUELLE ALTERSGRUPPE (HOCHZIEHEN)</label>
                    <select id="p-promote" class="auth-input" style="text-align:left; margin-top:5px;">
                        <option value="" ${!p.promotedTo ? 'selected' : ''}>STANDARD (Nach Alter)</option>
                        <option value="U17" ${p.promotedTo === 'U17' ? 'selected' : ''}>U17 (Förderkader)</option>
                        <option value="U19" ${p.promotedTo === 'U19' ? 'selected' : ''}>U19 (Leistungskader)</option>
                        <option value="PRO" ${p.promotedTo === 'PRO' ? 'selected' : ''}>PROFI-KADER</option>
                    </select>
                </div>
            </div>
            
            <button class="btn-main" style="margin-top:30px;" onclick="updatePlayer(${p.id})">WERTE SYNCHRONISIEREN</button>
            <button class="btn-main" style="margin-top:10px; border-color:#444;" onclick="toggleModal('modal-bio', false)">SCHLIESSEN</button>
        </div>
    `;
    toggleModal('modal-bio', true);
}

// --- 7. CORE ENGINE FUNCTIONS ---
function saveNewPlayer() {
    const name = document.getElementById('p-name').value;
    const birth = document.getElementById('p-birth').value;
    const pos = document.getElementById('p-pos').value;
    
    if (name && birth) {
        NCOS.academy.players.push({
            id: Date.now(), name, birthDate: birth, position: pos,
            stats: { pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50 },
            promotedTo: null, stickers: [], aiReview: "Neu im System."
        });
        toggleModal('modal-bio', false);
        loadModule('nlz');
    }
}

function updatePlayer(id) {
    const p = NCOS.academy.players.find(x => x.id === id);
    Object.keys(p.stats).forEach(stat => {
        p.stats[stat] = parseInt(document.getElementById('stat-' + stat).value);
    });
    p.promotedTo = document.getElementById('p-promote').value || null;
    toggleModal('modal-bio', false);
    loadModule('nlz');
}

function updateGlobalHUD() {
    document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €";
}

function toggleModal(id, show) {
    document.getElementById(id).classList.toggle('hidden', !show);
}

// Platzhalter für andere Module
function renderTactics(target) { target.innerHTML = `<div style="padding:40px;"><h2>TACTICAL BOARD ACTIVE</h2><p>Vektor-Ebene geladen.</p></div>`; }
function renderManager(target) { target.innerHTML = `<div style="padding:40px;"><h2>MANAGER OFFICE</h2><p>Finanz-System aktiv.</p></div>`; }
function renderPress(target) { target.innerHTML = `<div style="padding:40px;"><h2>PRESS STATION</h2><p>Layout: A4 Landscape.</p></div>`; }
