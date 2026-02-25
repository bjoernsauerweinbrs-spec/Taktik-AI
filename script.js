/* ==========================================================================
   TONI 2.0 | THE BRAIN - FULL SYSTEM LOGIC
   ========================================================================== */

const eliteStore = {
    config: { passkey: "1234", version: "15.8", isKiActive: false },
    mgmt: { budget: 4850000, morale: 88, reputation: 72 },
    players: [
        { id: 1, name: "NEUER", pos: "TW", rating: 89, stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, bio: { weight: 92, heart: 48 }, type: 'pro' },
        { id: 10, name: "KANE", pos: "ST", rating: 90, stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, bio: { weight: 86, heart: 46 }, type: 'pro' },
        { id: 101, name: "LEON", pos: "ST", rating: 65, stats: { pac: 70, sho: 60, pas: 65, dri: 75, def: 40, phy: 50 }, bio: { weight: 35, heart: 65 }, type: 'youth', stickers: [true, true, false, false, false, false, false, false, false, false, false, false] }
    ],
    finance: {
        income: { tv: 2500000, sponsor: 1500000, members: 50000 },
        expenses: { salary: 1200000, equipment: 5000, stadium: 200000 }
    }
};

// 1. BOOT SEQUENCE
function systemBootSequence() {
    const input = document.getElementById('passkey');
    if (input.value === eliteStore.config.passkey) {
        document.getElementById('auth-layer').style.transform = "translate(-50%, -50%) scale(0)";
        document.getElementById('auth-layer').style.opacity = "0";
        setTimeout(() => {
            document.getElementById('auth-layer').classList.add('hidden');
            document.getElementById('main-interface').classList.remove('hidden');
            initDashboard();
        }, 600);
    } else {
        alert("ACCESS DENIED.");
    }
}

// 2. DASHBOARD INIT
function initDashboard() {
    updateUI();
    renderQuickList();
    switchModule('kader');
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

function updateUI() {
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.budget.toLocaleString() + " €";
    document.getElementById('kpi-morale').innerText = eliteStore.mgmt.morale + "%";
}

function renderQuickList() {
    const list = document.getElementById('quick-squad-list');
    list.innerHTML = eliteStore.players.map(p => `
        <div class="list-item" onclick="openBioLab(${p.id})">
            <small>${p.pos}</small> <span>${p.name}</span> <i class="fa-solid fa-bolt" style="color:var(--neon-cyan)"></i>
        </div>
    `).join('');
}

// 3. MODULE SWITCHER
function switchModule(mod) {
    const stage = document.getElementById('module-content');
    document.getElementById('active-mod-title').innerText = mod.toUpperCase();
    
    if (mod === 'kader') renderKader(stage);
    if (mod === 'finance') renderFinance(stage);
    if (mod === 'youth') renderYouth(stage);
    if (mod === 'tactics') renderTactics(stage);
}

// 4. MODULE RENDERING
function renderKader(target) {
    target.innerHTML = `
        <div class="pitch-container fade-in">
            <div class="kader-grid">
                ${eliteStore.players.filter(p => p.type === 'pro').map(p => createCardHTML(p)).join('')}
            </div>
        </div>
    `;
}

function createCardHTML(p) {
    return `
        <div class="fifa-card" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-rating">${p.rating}</div>
                <div class="card-name">${p.name}</div>
                <div class="card-stats">
                    <span>PAC <b>${p.stats.pac}</b></span><span>SHO <b>${p.stats.sho}</b></span>
                    <span>PAS <b>${p.stats.pas}</b></span><span>DRI <b>${p.stats.dri}</b></span>
                </div>
            </div>
        </div>
    `;
}

function renderFinance(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>PRO-FINANZEN</h3>
                <p>TV-Rechte: ${eliteStore.finance.income.tv.toLocaleString()} €</p>
                <p>Gehälter: -${eliteStore.finance.expenses.salary.toLocaleString()} €</p>
            </div>
            <div class="office-panel">
                <h3>AMATEUR-BEREICH</h3>
                <p>Mitglieder: ${eliteStore.finance.income.members.toLocaleString()} €</p>
                <p>Bälle/Hütchen: -${eliteStore.finance.expenses.equipment.toLocaleString()} €</p>
            </div>
            <div class="office-panel" style="grid-column: span 2;">
                <h3>AI SECRETARY</h3>
                <button onclick="aiGenerate('Elternbrief')">ELTERNBRIEF ERSTELLEN</button>
                <button onclick="aiGenerate('Sponsoring')">SPONSOREN-ANFRAGE</button>
            </div>
        </div>
    `;
}

function renderYouth(target) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    target.innerHTML = `
        <div class="youth-grid fade-in">
            <div class="office-panel">
                <h3>PANINI ALBUM: ${kid.name}</h3>
                <div class="sticker-grid">
                    ${kid.stickers.map(s => `<div class="sticker ${s ? 'unlocked' : ''}"></div>`).join('')}
                </div>
            </div>
            <div class="office-panel">
                <h3>DRUCK-CENTER</h3>
                <button onclick="window.print()">STICKER / KARTE DRUCKEN</button>
            </div>
        </div>
    `;
}

function renderTactics(target) {
    target.innerHTML = `
        <div class="pitch-container">
            <h2 style="font-family:var(--font-hud); color:var(--neon-cyan)">KI-TAKTIK-BOARD</h2>
            <p>Sprich mit Toni, um Laufwege zu animieren.</p>
            <canvas id="tactic-canvas" style="width:100%; height:300px; border:1px solid #333; margin-top:20px;"></canvas>
        </div>
    `;
}

// 5. AI & VOICE
let micActive = false;
function toggleMic() {
    micActive = !micActive;
    const btn = document.getElementById('mic-btn');
    btn.className = micActive ? 'mic-active' : 'mic-inactive';
    const msg = micActive ? "Ich höre zu, Trainer! Was ist der Plan?" : "Toni ist im Standby.";
    document.querySelector('.ai-msg').innerText = msg;
}

function aiGenerate(type) {
    alert("Toni erstellt gerade den " + type + ". Dokument wird im Media Center gespeichert.");
}

function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    alert(`BIO-LAB ANALYSE: ${p.name}\nPuls: ${p.bio.heart} BPM\nGewicht: ${p.bio.weight}kg\nRating: ${p.rating}`);
}
