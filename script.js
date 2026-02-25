/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - FULL CONFIG
   ========================================================================== */

const eliteStore = {
    config: { passkey: "1234", version: "15.8 PRO", clubLogoUrl: "" },
    mgmt: { budget: 4850000, morale: 88, activeModule: 'kader' },
    
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1500000, stadium: 850000 },
        amateur: { members: 55000, gear: -4500, travel: -1200 }
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
        },
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

// 1. SYSTEM-BOOT
function systemBootSequence() {
    const input = document.getElementById('passkey');
    if (input.value === eliteStore.config.passkey) {
        document.getElementById('auth-layer').style.display = 'none';
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else {
        alert("ZUGRIFF VERWEIGERT.");
        input.value = "";
    }
}

function initDashboard() {
    updateBudget();
    renderQuickList();
    switchModule('kader');
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// 2. MODUL-ROUTER
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    const title = document.getElementById('active-mod-title');
    eliteStore.mgmt.activeModule = modId;

    document.querySelectorAll('.side-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${modId}`).classList.add('active');
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
            ${eliteStore.players.filter(p => p.type === 'pro').map(p => `
                <div class="fifa-card" onclick="openBioLab(${p.id})">
                    <div class="card-inner">
                        <div class="card-rating-box">
                            <span class="val">${p.rating}</span>
                            <span class="pos">${p.pos}</span>
                        </div>
                        <div class="player-img-box">
                            ${p.imgUrl ? `<img src="${p.imgUrl}">` : `<i class="fa-solid fa-user-ninja"></i>`}
                        </div>
                        <div class="card-name">${p.name}</div>
                        <div class="card-stats">
                            <span>PAC <b>${p.stats.pac}</b></span><span>SHO <b>${p.stats.sho}</b></span>
                            <span>PAS <b>${p.stats.pas}</b></span><span>DRI <b>${p.stats.dri}</b></span>
                            <span>DEF <b>${p.stats.def}</b></span><span>PHY <b>${p.stats.phy}</b></span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 4. BIO-LAB (DEINE ANFRAGE: FETTWAAGE & PULSUHR EDITIERBAR)
function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');

    container.innerHTML = `
        <div class="column-header">ANALYSE-ZENTRUM // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel">
                <h3>FIFA PERFORMANCE</h3>
                ${Object.keys(p.stats).map(s => `
                    <div class="lab-row"><span>${s.toUpperCase()}</span>
                    <input type="number" value="${p.stats[s]}" onchange="updateValue(${p.id}, 'stats', '${s}', this.value)"></div>
                `).join('')}
                <div style="margin-top:20px; font-size:24px; color:var(--neon-gold); text-align:center;">RATING: <span id="lab-rating">${p.rating}</span></div>
            </div>

            <div class="office-panel">
                <h3>FETT-ANALYSE (WAAGE)</h3>
                <div class="lab-row"><span>GEWICHT (KG)</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="updateValue(${p.id}, 'bio', 'weight', this.value)"></div>
                <div class="lab-row"><span>KFA (%)</span><input type="number" step="0.1" value="${p.bio.kfa}" onchange="updateValue(${p.id}, 'bio', 'kfa', this.value)"></div>
                <div class="lab-row"><span>MUSKEL (KG)</span><input type="number" step="0.1" value="${p.bio.muscle}" onchange="updateValue(${p.id}, 'bio', 'muscle', this.value)"></div>
                <div class="lab-row"><span>WASSER (%)</span><input type="number" step="0.1" value="${p.bio.water}" onchange="updateValue(${p.id}, 'bio', 'water', this.value)"></div>
            </div>

            <div class="office-panel">
                <h3>SENSOR-DATEN (UHR)</h3>
                <div class="lab-row"><span>PULS (BPM)</span><input type="number" value="${p.sensors.heart}" onchange="updateValue(${p.id}, 'sensors', 'heart', this.value)"></div>
                <div class="lab-row"><span>VO2MAX</span><input type="number" value="${p.sensors.vo2}" onchange="updateValue(${p.id}, 'sensors', 'vo2', this.value)"></div>
            </div>
        </div>
        <button onclick="closeBioLab()" style="width:100%; margin-top:20px; padding:15px; background:var(--neon-cyan); color:#000; font-family:var(--font-hud); border:none; border-radius:10px; cursor:pointer;">DATEN SYNCHRONISIEREN</button>
    `;
}

function updateValue(id, cat, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[cat][key] = parseFloat(val);

    if (cat === 'stats') {
        const s = p.stats;
        const total = (s.pac * 2) + (s.sho * 1.5) + (s.pas * 2) + (s.dri * 1.5) + (s.def * 1) + (s.phy * 2);
        p.rating = Math.round(total / 10);
        document.getElementById('lab-rating').innerText = p.rating;
    }
    renderKader(document.getElementById('module-content'));
    renderQuickList();
}

function closeBioLab() { document.getElementById('bio-lab-modal').classList.add('hidden'); }

// 5. WEITERE MODULE
function renderOffice(target) {
    target.innerHTML = `<div class="office-grid fade-in"><div class="office-panel"><h3>FINANZEN</h3>${Object.keys(eliteStore.finance.pro).map(k => `<div class="lab-row"><span>${k.toUpperCase()}</span><input type="number" value="${eliteStore.finance.pro[k]}" onchange="eliteStore.finance.pro['${k}']=parseInt(this.value); updateBudget();"></div>`).join('')}</div></div>`;
}

function renderJuniorHub(target) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    target.innerHTML = `<div class="office-panel fade-in"><h3>PANINI ALBUM // ${kid.name}</h3><div class="sticker-grid">${kid.stickers.map((s, i) => `<div class="sticker ${s ? 'unlocked' : ''}" onclick="toggleSticker(${i})">${s ? '★' : i+1}</div>`).join('')}</div></div>`;
}

function toggleSticker(i) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    kid.stickers[i] = !kid.stickers[i];
    renderJuniorHub(document.getElementById('module-content'));
}

function renderMediaCenter(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>STADIONZEITUNG</h3><textarea style="width:100%; height:300px; background:#000; color:var(--neon-cyan); padding:15px;" placeholder="Spielbericht schreiben..."></textarea></div>`;
}

function renderTactics(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>TAKTIK-BOARD</h3><p>Toni ist bereit. Aktiviere das Mikrofon für Live-Anweisungen.</p></div>`;
}

// 6. HELFER
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
    document.querySelector('.ai-msg').innerText = mic ? "Toni hört zu. Was ist der Plan?" : "System im Standby.";
}
