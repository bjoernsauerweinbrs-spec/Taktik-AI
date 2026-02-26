/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V22.0 (ELITE NLZ & PERSISTENCE)
   ========================================================================== */

const STORAGE_KEY = "TONI_GIGANTIC_V22";

// --- 1. STATE MANAGEMENT (LOAD/SAVE) ---
let NCOS = {
    state: {
        budget: 4500000,
        activeModule: 'nlz',
        isMicActive: false
    },
    academy: {
        players: [
            { 
                id: 101, name: "Julian Weber", birthDate: "2011-05-15", position: "ST", 
                stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 }, 
                promotedTo: null, 
                stickers: [true, true, false], 
                aiReview: "Herausragender Torinstinkt. Muss an der defensiven Mitarbeit arbeiten." 
            }
        ]
    },
    finance: [
        { id: 1, date: "26.02.", desc: "Startkapital Saison 2026", val: 4500000, cat: "Income" }
    ]
};

// Lade gespeicherte Daten
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        NCOS.academy = parsed.academy;
        NCOS.finance = parsed.finance;
        NCOS.state.budget = parsed.state.budget;
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS));
}

// --- 2. BOOT SEQUENCE ---
function bootSystem() {
    loadData();
    const btn = document.querySelector('.btn-main');
    btn.innerText = "AUFBAU DER GOLD-DATENBANK...";
    
    setTimeout(() => {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');
        initClock();
        loadModule(NCOS.state.activeModule);
        updateGlobalHUD();
    }, 1200);
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
    if (name === 'video') renderVideo(stage);
}

// --- 4. NLZ ACADEMY HUB (PANINI & STICKER) ---
function renderNLZ(target) {
    target.innerHTML = `
        <div class="nlz-background" style="padding:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <div>
                    <div class="luxury-logo" style="font-size:32px;">TONI 2.0 ERINNERUNGSALBUM</div>
                    <p style="color:#444; font-family:var(--font-ui); font-size:10px; letter-spacing:2px;">OFFIZIELLES NLZ SAMMELSYSTEM</p>
                </div>
                <button class="btn-main" style="width:auto; padding:10px 30px;" onclick="openAddPlayerModal()">+ NEUES TALENT</button>
            </div>
            
            <div class="panini-album">
                ${NCOS.academy.players.map(p => {
                    const ageGroup = calculateAgeGroup(p.birthDate, p.promotedTo);
                    const ovr = calculateOVR(p.stats);
                    return `
                    <div class="panini-card" onclick="editYouthPlayer(${p.id})">
                        <div style="padding:20px;">
                            <div style="display:flex; justify-content:space-between;">
                                <div>
                                    <div style="font-family:var(--font-ui); color:var(--neon-gold); font-size:24px;">${ovr}</div>
                                    <div style="font-size:10px; color:#888;">${p.position}</div>
                                </div>
                                <div style="text-align:right;">
                                    <div style="font-family:var(--font-ui); color:var(--neon-cyan); font-size:14px;">${ageGroup}</div>
                                </div>
                            </div>
                            
                            <div style="text-align:center; margin:15px 0;">
                                <i class="fa-solid fa-user-graduate" style="font-size:60px; color:#1a253d;"></i>
                            </div>
                            
                            <div style="text-align:center; font-family:var(--font-ui); margin-bottom:10px;">${p.name}</div>
                            
                            <div class="sticker-grid">
                                <div class="sticker-slot ${p.stickers[0] ? 'unlocked' : ''}"><i class="fa-solid fa-star"></i></div>
                                <div class="sticker-slot ${p.stickers[1] ? 'unlocked' : ''}"><i class="fa-solid fa-bolt"></i></div>
                                <div class="sticker-slot ${p.stickers[2] ? 'unlocked' : ''}"><i class="fa-solid fa-trophy"></i></div>
                            </div>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// --- 5. EDITOR & STICKER LOGIC ---
function editYouthPlayer(id) {
    const p = NCOS.academy.players.find(x => x.id === id);
    const modal = document.getElementById('modal-bio');
    const inner = document.getElementById('bio-content-inner');
    
    inner.innerHTML = `
        <div style="padding:40px; background:var(--bg-panel); border:1px solid var(--neon-gold); display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
            <div>
                <h2 style="font-family:var(--font-ui); margin-bottom:20px;">${p.name} // AKTE</h2>
                <div style="margin-bottom:20px;">
                    <label style="font-size:10px; color:#666;">GEWÄHLTE STICKER (KLICKEN ZUM KLEBEN)</label>
                    <div class="sticker-grid" style="grid-template-columns: repeat(3, 1fr); margin-top:10px;">
                        <button onclick="toggleSticker(${p.id}, 0)" class="sticker-slot ${p.stickers[0] ? 'unlocked' : ''}">TALENT</button>
                        <button onclick="toggleSticker(${p.id}, 1)" class="sticker-slot ${p.stickers[1] ? 'unlocked' : ''}">KÄMPFER</button>
                        <button onclick="toggleSticker(${p.id}, 2)" class="sticker-slot ${p.stickers[2] ? 'unlocked' : ''}">LEADER</button>
                    </div>
                </div>
                <h4 style="color:var(--neon-cyan); margin-bottom:10px;">FIFA WERTE</h4>
                ${Object.keys(p.stats).map(stat => `
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span>${stat.toUpperCase()}</span>
                        <input type="number" id="stat-${stat}" value="${p.stats[stat]}" style="width:50px; background:#000; color:#fff; border:1px solid #333; text-align:center;">
                    </div>
                `).join('')}
            </div>
            
            <div>
                <h4 style="color:var(--neon-gold); margin-bottom:10px;">PROMOTION & ALTER</h4>
                <input type="date" id="p-birth" value="${p.birthDate}" class="auth-input" style="text-align:left;">
                <select id="p-promote" class="auth-input" style="text-align:left;">
                    <option value="" ${!p.promotedTo ? 'selected' : ''}>STANDARD (Nach Alter)</option>
                    <option value="U17" ${p.promotedTo === 'U17' ? 'selected' : ''}>U17 (Hochgezogen)</option>
                    <option value="U19" ${p.promotedTo === 'U19' ? 'selected' : ''}>U19 (Hochgezogen)</option>
                    <option value="PRO" ${p.promotedTo === 'PRO' ? 'selected' : ''}>PROFI-KADER</option>
                </select>
                <h4 style="margin-top:20px;">KI ANALYSE</h4>
                <textarea id="p-review" style="width:100%; height:100px; background:#111; color:#aaa; border:1px solid #333; padding:10px; font-size:12px;">${p.aiReview}</textarea>
                <button class="btn-main" style="margin-top:20px;" onclick="updatePlayer(${p.id})">AKTE SYNCHRONISIEREN</button>
                <button class="btn-main" style="margin-top:10px; border-color:#444;" onclick="toggleModal('modal-bio', false)">SCHLIESSEN</button>
            </div>
        </div>
    `;
    toggleModal('modal-bio', true);
}

function toggleSticker(playerId, stickerIndex) {
    const p = NCOS.academy.players.find(x => x.id === playerId);
    p.stickers[stickerIndex] = !p.stickers[stickerIndex];
    saveData();
    editYouthPlayer(playerId); // Refresh Modal
}

function updatePlayer(id) {
    const p = NCOS.academy.players.find(x => x.id === id);
    Object.keys(p.stats).forEach(stat => {
        p.stats[stat] = parseInt(document.getElementById('stat-' + stat).value);
    });
    p.birthDate = document.getElementById('p-birth').value;
    p.promotedTo = document.getElementById('p-promote').value || null;
    p.aiReview = document.getElementById('p-review').value;
    
    saveData();
    toggleModal('modal-bio', false);
    loadModule('nlz');
}

// --- 6. CORE LOGIC (CALCULATIONS) ---
function calculateAgeGroup(birthDate, promotedTo) {
    if (promotedTo) return promotedTo;
    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age <= 11) return "U11";
    if (age <= 13) return "U13";
    if (age <= 15) return "U15";
    if (age <= 17) return "U17";
    return "U19";
}

function calculateOVR(stats) {
    const v = Object.values(stats);
    return Math.round(v.reduce((a, b) => a + b) / v.length);
}

// --- 7. HUD & SYSTEM ---
function updateGlobalHUD() {
    document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €";
}

function toggleModal(id, show) {
    document.getElementById(id).classList.toggle('hidden', !show);
}

function openAddPlayerModal() {
    // Einfache Version für Demo
    const name = prompt("Name des Talents:");
    if(name) {
        NCOS.academy.players.push({
            id: Date.now(), name, birthDate: "2012-01-01", position: "ZM",
            stats: { pac: 50, sho: 50, pas: 50, dri: 50, def: 50, phy: 50 },
            promotedTo: null, stickers: [false, false, false], aiReview: "Neu erfasst."
        });
        saveData();
        loadModule('nlz');
    }
}

// Platzhalter für andere Module
function renderTactics(target) { target.innerHTML = `<div style="padding:40px;"><h2>TACTICAL ENGINE V20</h2><p>Vektoren bereit.</p></div>`; }
function renderManager(target) { target.innerHTML = `<div style="padding:40px;"><h2>ERP FINANCIALS</h2><p>Buchhaltung online.</p></div>`; }
function renderPress(target) { target.innerHTML = `<div style="padding:40px;"><h2>PRESS STATION</h2><p>Layout: A4 Landscape.</p></div>`; }
function renderVideo(target) { target.innerHTML = `<div style="padding:40px;"><h2>BROADCAST LAB</h2><p>Telestrator aktiv.</p></div>`; }
