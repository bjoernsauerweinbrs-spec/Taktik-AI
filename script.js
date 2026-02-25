/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8)
   ========================================================================= */

const eliteStore = {
    config: { passkey: "1234", version: "15.8" },
    mgmt: { budget: 4500000, morale: 82, weather: "18°C" },
    players: [
        // 11 Stammspieler (4-4-2 Setup)
        { id: 1, name: "NEUER", pos: "TW", rating: 89, stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, bio: { weight: 92, kfa: 11, muscle: 48, water: 62, heart: 48, vo2: 60 }, contract: { salary: 15000, expiry: 2026 } },
        { id: 2, name: "DAVIES", pos: "LV", rating: 84, stats: { pac: 95, sho: 68, pas: 77, dri: 82, def: 76, phy: 78 }, bio: { weight: 75, kfa: 9, muscle: 40, water: 65, heart: 42, vo2: 65 }, contract: { salary: 8000, expiry: 2027 } },
        { id: 3, name: "KIM", pos: "IV", rating: 83, stats: { pac: 80, sho: 35, pas: 70, dri: 65, def: 85, phy: 88 }, bio: { weight: 84, kfa: 12, muscle: 50, water: 58, heart: 50, vo2: 55 }, contract: { salary: 9000, expiry: 2028 } },
        { id: 4, name: "UPAMECANO", pos: "IV", rating: 82, stats: { pac: 82, sho: 40, pas: 68, dri: 68, def: 81, phy: 84 }, bio: { weight: 88, kfa: 13, muscle: 52, water: 57, heart: 52, vo2: 54 }, contract: { salary: 8500, expiry: 2026 } },
        { id: 5, name: "BOEY", pos: "RV", rating: 79, stats: { pac: 88, sho: 55, pas: 72, dri: 78, def: 74, phy: 76 }, bio: { weight: 72, kfa: 10, muscle: 38, water: 63, heart: 45, vo2: 62 }, contract: { salary: 5000, expiry: 2028 } },
        { id: 6, name: "PAVLOVIC", pos: "ZM", rating: 77, stats: { pac: 72, sho: 65, pas: 80, dri: 78, def: 72, phy: 70 }, bio: { weight: 76, kfa: 11, muscle: 39, water: 61, heart: 46, vo2: 63 }, contract: { salary: 3000, expiry: 2029 } },
        { id: 7, name: "KIMMICH", pos: "ZM", rating: 86, stats: { pac: 70, sho: 72, pas: 90, dri: 84, def: 82, phy: 79 }, bio: { weight: 74, kfa: 10, muscle: 41, water: 64, heart: 40, vo2: 68 }, contract: { salary: 18000, expiry: 2025 } },
        { id: 8, name: "MUSIALA", pos: "LF", rating: 87, stats: { pac: 85, sho: 81, pas: 84, dri: 92, def: 35, phy: 64 }, bio: { weight: 70, kfa: 8, muscle: 36, water: 66, heart: 44, vo2: 64 }, contract: { salary: 12000, expiry: 2026 } },
        { id: 9, name: "SANÉ", pos: "RF", rating: 85, stats: { pac: 91, sho: 82, pas: 79, dri: 88, def: 38, phy: 68 }, bio: { weight: 75, kfa: 9, muscle: 39, water: 64, heart: 45, vo2: 61 }, contract: { salary: 15000, expiry: 2025 } },
        { id: 10, name: "KANE", pos: "ST", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, bio: { weight: 86, kfa: 12, muscle: 47, water: 59, heart: 46, vo2: 58 }, contract: { salary: 25000, expiry: 2027 } },
        { id: 11, name: "MÜLLER", pos: "ST", rating: 84, stats: { pac: 63, sho: 82, pas: 83, dri: 80, def: 55, phy: 69 }, bio: { weight: 76, kfa: 10, muscle: 40, water: 63, heart: 42, vo2: 60 }, contract: { salary: 15000, expiry: 2025 } },
        // 5 Ersatzspieler
        { id: 12, name: "TEL", pos: "ST", rating: 77, stats: { pac: 84, sho: 76, pas: 70, dri: 80, def: 28, phy: 72 }, bio: { weight: 77, kfa: 9, muscle: 41, water: 65, heart: 44, vo2: 64 }, contract: { salary: 4000, expiry: 2029 } },
        { id: 13, name: "LAIMER", pos: "ZM", rating: 81, stats: { pac: 79, sho: 68, pas: 75, dri: 77, def: 80, phy: 82 }, bio: { weight: 73, kfa: 10, muscle: 39, water: 64, heart: 38, vo2: 70 }, contract: { salary: 7000, expiry: 2027 } },
        { id: 14, name: "DIER", pos: "IV", rating: 77, stats: { pac: 55, sho: 60, pas: 72, dri: 64, def: 79, phy: 80 }, bio: { weight: 89, kfa: 14, muscle: 51, water: 56, heart: 52, vo2: 52 }, contract: { salary: 6000, expiry: 2026 } },
        { id: 15, name: "GUERREIRO", pos: "LV", rating: 81, stats: { pac: 72, sho: 75, pas: 84, dri: 85, def: 74, phy: 62 }, bio: { weight: 71, kfa: 12, muscle: 35, water: 61, heart: 48, vo2: 59 }, contract: { salary: 6500, expiry: 2026 } },
        { id: 16, name: "ULREICH", pos: "TW", rating: 74, stats: { pac: 50, sho: 35, pas: 68, dri: 55, def: 74, phy: 70 }, bio: { weight: 84, kfa: 13, muscle: 44, water: 58, heart: 54, vo2: 50 }, contract: { salary: 3500, expiry: 2025 } }
    ]
};

function systemBootSequence() {
    const input = document.getElementById('passkey');
    const auth = document.getElementById('auth-layer');
    const main = document.getElementById('main-interface');
    if (input.value === eliteStore.config.passkey) {
        auth.classList.add('hidden');
        main.classList.remove('hidden');
        initializeDashboard();
    } else {
        alert("ZUGRIFF VERWEIGERT.");
    }
}

function initializeDashboard() {
    updateClock();
    setInterval(updateClock, 1000);
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.budget.toLocaleString() + " €";
    document.getElementById('kpi-morale').innerText = eliteStore.mgmt.morale + "%";
    
    // Linke Liste (Quick-Status)
    const list = document.getElementById('quick-squad-list');
    list.innerHTML = eliteStore.players.map(p => `
        <div class="player-list-item" onclick="openBioLab(${p.id})">
            <span class="pos-badge">${p.pos}</span> ${p.name}
            <i class="fa-solid fa-circle" style="color: var(--neon-main)"></i>
        </div>
    `).join('');

    switchModule('kader');
}

function switchModule(modId) {
    const stage = document.getElementById('module-content');
    if (modId === 'kader') {
        renderSquad();
    } else {
        stage.innerHTML = `<div class="placeholder-module">MODUL [${modId.toUpperCase()}] AKTIVIERT.</div>`;
    }
}

function renderSquad() {
    const stage = document.getElementById('module-content');
    const starters = eliteStore.players.slice(0, 11);
    const subs = eliteStore.players.slice(11);

    stage.innerHTML = `
        <div class="pitch-container">
            <div class="pitch-overlay">
                <div class="formation-title">MATCH-DAY SETUP: 4-4-2</div>
                <div class="kader-grid">
                    ${starters.map(p => createFifaCard(p)).join('')}
                </div>
            </div>
        </div>
        <div class="sub-bench">
            <div class="column-header">ERSATZBANK</div>
            <div class="sub-grid">${subs.map(p => createFifaCard(p, true)).join('')}</div>
        </div>
    `;
}

function createFifaCard(p, isSub = false) {
    return `
        <div class="fifa-card ${isSub ? 'mini-card' : ''}" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-top">
                    <span class="card-rating">${p.rating}</span>
                    <span class="card-pos">${p.pos}</span>
                </div>
                <div class="card-img-placeholder"><i class="fa-solid fa-user-ninja"></i></div>
                <div class="card-name">${p.name}</div>
                ${!isSub ? `
                <div class="card-stats">
                    <span>PAC <b>${p.stats.pac}</b></span>
                    <span>SHO <b>${p.stats.sho}</b></span>
                    <span>PAS <b>${p.stats.pas}</b></span>
                    <span>DRI <b>${p.stats.dri}</b></span>
                    <span>DEF <b>${p.stats.def}</b></span>
                    <span>PHY <b>${p.stats.phy}</b></span>
                </div>` : ''}
            </div>
        </div>
    `;
}

// --------------------------------------------------------------------------
// BIO-LAB OVERLAY (DAS ANALYSE-ZENTRUM)
// --------------------------------------------------------------------------
function openBioLab(playerId) {
    const p = eliteStore.players.find(x => x.id === playerId);
    if(!p) return;

    // Wir erzeugen das Overlay modular
    const overlay = document.createElement('div');
    overlay.id = "bio-lab-modal";
    overlay.className = "modal-overlay";
    
    overlay.innerHTML = `
        <div class="lab-container">
            <header class="lab-header">
                <h2><i class="fa-solid fa-dna"></i> NEURAL BIO-LAB // ${p.name}</h2>
                <button onclick="closeBioLab()" class="close-btn">X</button>
            </header>
            
            <div class="lab-grid">
                <section class="lab-col">
                    <h3>FIFA PERFORMANCE</h3>
                    <div class="stat-input-group">
                        ${Object.keys(p.stats).map(key => `
                            <label>${key.toUpperCase()}: 
                                <input type="number" value="${p.stats[key]}" onchange="updateStat(${p.id}, '${key}', this.value)">
                            </label>
                        `).join('')}
                    </div>
                    <div class="overall-display">NEURAL RATING: <span id="lab-overall">${p.rating}</span></div>
                </section>

                <section class="lab-col">
                    <h3>WAAGE / ANALYSE</h3>
                    <div class="bio-display">
                        <div class="bio-item"><span>GEWICHT:</span> <b>${p.bio.weight} kg</b></div>
                        <div class="bio-item"><span>KFA:</span> <b>${p.bio.kfa} %</b></div>
                        <div class="bio-item"><span>MUSKEL:</span> <b>${p.bio.muscle} kg</b></div>
                        <div class="bio-item"><span>WASSER:</span> <b>${p.bio.water} %</b></div>
                        <div class="bio-item" style="margin-top:10px; color:var(--neon-cyan)"><span>BMI:</span> <b>${(p.bio.weight / 3.4).toFixed(1)}</b></div>
                    </div>
                </section>

                <section class="lab-col">
                    <h3>LIVE SENSOREN</h3>
                    <div class="sensor-display">
                        <div class="sensor-item"><i class="fa-solid fa-heart-pulse"></i> PULS: <b>${p.bio.heart} BPM</b></div>
                        <div class="sensor-item"><i class="fa-solid fa-lungs"></i> VO2MAX: <b>${p.bio.vo2}</b></div>
                        <hr>
                        <div class="finance-item">GEHALT: <b>${p.contract.salary.toLocaleString()} €</b></div>
                    </div>
                </section>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

function updateStat(id, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p.stats[key] = parseInt(val);
    
    // Rating neu berechnen
    const s = p.stats;
    const total = (s.pac * 2) + (s.sho * 1.5) + (s.pas * 2) + (s.dri * 1.5) + (s.def * 1) + (s.phy * 2);
    p.rating = Math.round(total / 10);
    
    // Live UI Update
    document.getElementById('lab-overall').innerText = p.rating;
    renderSquad(); // Board im Hintergrund aktualisieren
}

function closeBioLab() {
    const modal = document.getElementById('bio-lab-modal');
    if(modal) modal.remove();
}

function updateClock() {
    const clock = document.getElementById('clock-display');
    if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
}
