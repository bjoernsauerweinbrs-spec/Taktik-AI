/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8)
   ========================================================================= */

const eliteStore = {
    config: { passkey: "1234", version: "15.8" },
    mgmt: { budget: 4500000, morale: 82, weather: "18°C" },
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1200000, stadiumIncome: 800000, transfers: -500000, maintenance: -150000 },
        amateur: { memberships: 45000, equipment: -2500, travel: -1200, events: 5000 }
    },
    players: [
        { id: 1, name: "NEUER", pos: "TW", rating: 89, stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, bio: { weight: 92, kfa: 11, muscle: 48, water: 62, heart: 48, vo2: 60 }, contract: { salary: 15000, expiry: 2026 } },
        { id: 10, name: "KANE", pos: "ST", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, bio: { weight: 86, kfa: 12, muscle: 47, water: 59, heart: 46, vo2: 58 }, contract: { salary: 25000, expiry: 2027 } }
    ],
    // KINDER- & JUGENDBEREICH
    youth: {
        teams: ["Funino (G-Jugend)", "F-Jugend", "E-Jugend"],
        activeTeam: "Funino (G-Jugend)",
        kids: [
            { 
                id: 101, name: "Leon", rating: 65, 
                stats: { pac: 70, sho: 60, pas: 65, dri: 75, def: 40, phy: 50 },
                paniniProgress: [true, true, false, false, false, false, false, false, false, false, false, false] // 12 Monate
            },
            { 
                id: 102, name: "Sophie", rating: 68, 
                stats: { pac: 75, sho: 62, pas: 70, dri: 80, def: 45, phy: 55 },
                paniniProgress: [true, false, false, false, false, false, false, false, false, false, false, false]
            }
        ]
    }
};

// 1. BOOT & NAVI
function systemBootSequence() {
    const input = document.getElementById('passkey');
    if (input.value === eliteStore.config.passkey) {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initializeDashboard();
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

function initializeDashboard() {
    updateClock();
    setInterval(updateClock, 1000);
    refreshBudgetDisplay();
    switchModule('kader');
}

function refreshBudgetDisplay() {
    const total = Object.values(eliteStore.finance.pro).reduce((a, b) => a + b, 0) + 
                  Object.values(eliteStore.finance.amateur).reduce((a, b) => a + b, 0);
    document.getElementById('kpi-budget').innerText = total.toLocaleString() + " €";
}

function switchModule(modId) {
    const stage = document.getElementById('module-content');
    if (modId === 'kader') renderSquad();
    if (modId === 'finance') renderOffice();
    if (modId === 'youth') renderYouthCenter();
}

// 2. JUNIOR HERO HUB (KINDERBEREICH)
function renderYouthCenter() {
    const stage = document.getElementById('module-content');
    stage.innerHTML = `
        <div class="youth-container fade-in">
            <header class="youth-header">
                <h2><i class="fa-solid fa-child-reaching"></i> JUNIOR HERO HUB // ${eliteStore.youth.activeTeam}</h2>
                <div class="youth-tools">
                    <button class="btn-print" onclick="window.print()"><i class="fa-solid fa-print"></i> KARTEN DRUCKEN</button>
                </div>
            </header>

            <div class="youth-grid">
                ${eliteStore.youth.kids.map(kid => `
                    <div class="kid-card-wrapper">
                        <div class="fifa-card youth-card">
                            <div class="card-inner">
                                <div class="card-top">
                                    <span class="card-rating">${kid.rating}</span>
                                    <span class="card-pos">KID</span>
                                </div>
                                <div class="card-img-placeholder"><i class="fa-solid fa-star"></i></div>
                                <div class="card-name">${kid.name.toUpperCase()}</div>
                                <div class="card-stats">
                                    <span>PAC <b>${kid.stats.pac}</b></span>
                                    <span>DRI <b>${kid.stats.dri}</b></span>
                                    <span>PAS <b>${kid.stats.pas}</b></span>
                                    <span>SHO <b>${kid.stats.sho}</b></span>
                                </div>
                            </div>
                        </div>

                        <div class="panini-album">
                            <h4>STREAK: MONATS-STICKER</h4>
                            <div class="sticker-grid">
                                ${kid.paniniProgress.map((unlocked, index) => `
                                    <div class="sticker-slot ${unlocked ? 'unlocked' : 'locked'}">
                                        ${unlocked ? `<i class="fa-solid fa-certificate"></i>` : index + 1}
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn-stick" onclick="unlockSticker(${kid.id})">STICKER EINKLEBEN</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function unlockSticker(kidId) {
    const kid = eliteStore.youth.kids.find(k => k.id === kidId);
    const nextSlot = kid.paniniProgress.indexOf(false);
    if(nextSlot !== -1) {
        kid.paniniProgress[nextSlot] = true;
        renderYouthCenter();
        console.log(`Sticker für ${kid.name} Monat ${nextSlot + 1} eingeklebt!`);
    }
}

// Hilfsfunktionen (Kader & Office bleiben im Hintergrund stabil)
function renderSquad() { document.getElementById('module-content').innerHTML = `<div class="placeholder">SQUAD AKTIV</div>`; }
function renderOffice() { /* Siehe vorheriges Update */ }
function updateClock() {
    const clock = document.getElementById('clock-display');
    if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
}
