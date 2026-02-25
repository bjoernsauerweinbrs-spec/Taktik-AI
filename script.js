/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - FULL CONFIG
   ========================================================================== */

// 1. DER ZENTRALE DATEN-TRESOR (ELITE STORE)
const eliteStore = {
    config: {
        passkey: "1234",
        version: "15.8 PRO",
        isKiActive: false,
        voiceMode: "Klopp/Nagelsmann"
    },
    mgmt: {
        budget: 4850000,
        morale: 88,
        reputation: 72,
        activeModule: 'kader'
    },
    // Finanz-Datenbank (Tiefen-Analyse Pro & Amateur)
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1500000, tickets: 800000, transfers: -500000 },
        amateur: { members: 50000, gear: -5000, travel: -2000, events: 10000 }
    },
    // Spieler-Datenbank (Pro & Youth)
    players: [
        { id: 1, name: "NEUER", pos: "TW", stats: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 }, bio: { weight: 92, kfa: 11, muscle: 48, water: 62, heart: 48, vo2: 60 }, type: 'pro', rating: 89 },
        { id: 10, name: "KANE", pos: "ST", stats: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 }, bio: { weight: 86, kfa: 12, muscle: 47, water: 59, heart: 46, vo2: 58 }, type: 'pro', rating: 90 },
        { id: 101, name: "LEON", pos: "ST", stats: { pac: 70, sho: 60, pas: 65, dri: 75, def: 40, phy: 50 }, bio: { weight: 35, kfa: 8, muscle: 15, water: 65, heart: 62, vo2: 50 }, type: 'youth', stickers: [true, true, false, false, false, false, false, false, false, false, false, false], rating: 65 }
    ],
    inventory: { huetchen: 40, baelle: 25, trikots: 22 }
};

// 2. SYSTEM INITIALISIERUNG & LOGIN
function systemBootSequence() {
    const input = document.getElementById('passkey');
    const auth = document.getElementById('auth-layer');
    const main = document.getElementById('main-interface');

    if (input.value === eliteStore.config.passkey) {
        auth.classList.add('hidden');
        main.classList.remove('hidden');
        initializeSystem();
    } else {
        alert("ZUGRIFF VERWEIGERT. IDENTITÄT UNBEKANNT.");
        input.value = "";
    }
}

function initializeSystem() {
    updateGlobalUI();
    renderQuickList();
    switchModule('kader');
    
    // Live-Uhr & Budget-Sync
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
        updateGlobalUI();
    }, 1000);
}

function updateGlobalUI() {
    // Budget-Berechnung
    const proSum = Object.values(eliteStore.finance.pro).reduce((a, b) => a + b, 0);
    const amateurSum = Object.values(eliteStore.finance.amateur).reduce((a, b) => a + b, 0);
    eliteStore.mgmt.budget = proSum + amateurSum;
    
    document.getElementById('kpi-budget').innerText = eliteStore.mgmt.budget.toLocaleString() + " €";
    document.getElementById('kpi-morale').innerText = eliteStore.mgmt.morale + "%";
    document.getElementById('kpi-reputation').innerText = eliteStore.mgmt.reputation + "/100";
}

// 3. MODUL-ROUTING (ANTI-VERSCHWINDEN-LOGIK)
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    const title = document.getElementById('active-mod-title');
    eliteStore.mgmt.activeModule = modId;
    
    // UI-Buttons Update
    document.querySelectorAll('.side-nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${modId}`);
    if(activeBtn) activeBtn.classList.add('active');

    title.innerText = modId.toUpperCase().replace('YOUTH', 'JUNIOR HUB').replace('FINANCE', 'OFFICE PRIME');

    // Rendering-Logik
    switch(modId) {
        case 'kader': renderKader(stage); break;
        case 'tactics': renderTactics(stage); break;
        case 'finance': renderOffice(stage); break;
        case 'youth': renderJuniorHub(stage); break;
        case 'media': renderMediaCenter(stage); break;
    }
}

// 4. KADER & FIFA-KARTEN
function renderKader(target) {
    target.innerHTML = `
        <div class="kader-container fade-in">
            <div class="kader-grid">
                ${eliteStore.players.filter(p => p.type === 'pro').map(p => `
                    <div class="fifa-card" onclick="openBioLab(${p.id})">
                        <div class="card-inner">
                            <div class="card-rating">${p.rating}</div>
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
        </div>
    `;
}

function renderQuickList() {
    const list = document.getElementById('quick-squad-list');
    list.innerHTML = eliteStore.players.map(p => `
        <div class="list-item" onclick="openBioLab(${p.id})">
            <span><b>${p.pos}</b> ${p.name}</span>
            <span style="color:var(--neon-cyan)">${p.rating}</span>
        </div>
    `).join('');
}

// 5. BIO-LAB (EDITIERMODUS)
function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    modal.classList.remove('hidden');

    modal.innerHTML = `
        <div class="lab-container">
            <div class="column-header">NEURAL BIO-LAB // ${p.name}</div>
            <div class="lab-grid">
                <div class="office-panel">
                    <h3>FIFA STATS (EDIT)</h3>
                    ${Object.keys(p.stats).map(s => `
                        <div class="finance-row">
                            <span>${s.toUpperCase()}</span>
                            <input type="number" value="${p.stats[s]}" onchange="updateStat(${p.id}, '${s}', this.value)" style="width:60px; background:#000; border:1px solid var(--neon-cyan); color:#fff; text-align:center;">
                        </div>
                    `).join('')}
                    <div style="margin-top:15px; text-align:center; font-size:24px; color:var(--neon-gold)">RATING: <span id="lab-rating">${p.rating}</span></div>
                </div>
                <div class="office-panel">
                    <h3>BIOMETRIE / WAAGE</h3>
                    <p>GEWICHT: ${p.bio.weight} kg</p>
                    <p>KFA: ${p.bio.kfa} %</p>
                    <p>MUSKEL: ${p.bio.muscle} kg</p>
                    <p>PULS: ${p.bio.heart} BPM</p>
                </div>
            </div>
            <button onclick="closeBioLab()" style="width:100%; margin-top:20px; padding:10px; background:var(--neon-cyan); border:none; border-radius:10px; cursor:pointer;">DATEN SPEICHERN & SCHLIEẞEN</button>
        </div>
    `;
}

function updateStat(id, stat, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p.stats[stat] = parseInt(val);
    
    // Die offizielle Toni 2.0 Rating Formel
    const s = p.stats;
    const total = (s.pac * 2) + (s.sho * 1.5) + (s.pas * 2) + (s.dri * 1.5) + (s.def * 1) + (s.phy * 2);
    p.rating = Math.round(total / 10);
    
    document.getElementById('lab-rating').innerText = p.rating;
    switchModule(eliteStore.mgmt.activeModule); // UI Refresh
    renderQuickList();
}

function closeBioLab() { document.getElementById('bio-lab-modal').classList.add('hidden'); }

// 6. OFFICE PRIME (FINANZEN & SEKRETARIAT)
function renderOffice(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>PROFI ABTEILUNG</h3>
                ${renderFinanceFields('pro')}
            </div>
            <div class="office-panel">
                <h3>AMATEUR / JUGEND</h3>
                ${renderFinanceFields('amateur')}
            </div>
            <div class="office-panel" style="grid-column: span 2;">
                <h3>NEURAL SECRETARY (KI-BRIEFE)</h3>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button class="nav-btn" style="border:1px solid var(--neon-cyan); padding:5px 10px;" onclick="generateText('sponsoring')">SPONSOREN</button>
                    <button class="nav-btn" style="border:1px solid var(--neon-cyan); padding:5px 10px;" onclick="generateText('parents')">ELTERNBRIEF</button>
                </div>
                <textarea id="ai-text-output" style="width:100%; height:120px; background:#000; color:var(--neon-cyan); border-radius:10px; padding:10px; border:1px solid var(--border);" placeholder="Toni entwirft hier deinen Text..."></textarea>
            </div>
        </div>
    `;
}

function renderFinanceFields(cat) {
    return Object.keys(eliteStore.finance[cat]).map(key => `
        <div class="finance-row">
            <span>${key.toUpperCase()}</span>
            <input type="number" value="${eliteStore.finance[cat][key]}" onchange="eliteStore.finance['${cat}']['${key}'] = parseInt(this.value); updateGlobalUI();" style="width:100px; background:#000; border:1px solid #333; color:#fff; text-align:right;">
        </div>
    `).join('');
}

function generateText(type) {
    const box = document.getElementById('ai-text-output');
    box.value = "Toni analysiert... \n\n" + (type === 'sponsoring' ? "Sehr geehrte Sponsoren, wir suchen für Toni 2.0..." : "Liebe Eltern, bitte Schienbeinschoner mitbringen...");
}

// 7. JUNIOR HERO HUB (PANINI ALBUM)
function renderJuniorHub(target) {
    const kids = eliteStore.players.filter(p => p.type === 'youth');
    target.innerHTML = `
        <div class="youth-grid fade-in">
            ${kids.map(kid => `
                <div class="office-panel">
                    <h3>PANINI ALBUM // ${kid.name}</h3>
                    <div class="sticker-grid">
                        ${kid.stickers.map((s, i) => `<div class="sticker ${s ? 'unlocked' : ''}" onclick="unlockSticker(${kid.id}, ${i})">${s ? '<i class="fa-solid fa-star"></i>' : i+1}</div>`).join('')}
                    </div>
                    <button onclick="window.print()" style="margin-top:15px; background:none; border:1px solid var(--neon-pink); color:var(--neon-pink); padding:5px; border-radius:5px; cursor:pointer;">STICKER DRUCKEN</button>
                </div>
            `).join('')}
        </div>
    `;
}

function unlockSticker(kidId, index) {
    const kid = eliteStore.players.find(p => p.id === kidId);
    kid.stickers[index] = !kid.stickers[index];
    renderJuniorHub(document.getElementById('module-content'));
}

// 8. MEDIA CENTER (STADIONZEITUNG)
function renderMediaCenter(target) {
    target.innerHTML = `
        <div class="office-container fade-in">
            <div class="office-panel">
                <h3>STADIONZEITUNG EDITOR</h3>
                <input type="text" placeholder="TITEL DER AUSGABE" style="width:100%; background:#111; border:1px solid var(--neon-cyan); color:#fff; padding:10px; margin-bottom:10px; border-radius:5px;">
                <textarea style="width:100%; height:200px; background:#111; color:#fff; padding:10px; border-radius:10px; border:1px solid var(--border);" placeholder="Schreibe hier den Spielbericht für die Fans..."></textarea>
            </div>
        </div>
    `;
}

// 9. TAKTIK-BOARD (DUMMY)
function renderTactics(target) {
    target.innerHTML = `
        <div class="pitch-container">
            <h2 style="font-family:var(--font-hud); color:var(--neon-cyan); margin-bottom:20px;">KI-TAKTIK-ENGINE</h2>
            <div style="flex:1; border:2px dashed var(--neon-cyan); display:flex; align-items:center; justify-content:center; color:var(--neon-cyan);">
                <i class="fa-solid fa-microphone-lines" style="font-size:50px; margin-right:20px;"></i>
                <span>SPRICHE MIT TONI: "ZEIG MIR DIE formation 4-4-2"</span>
            </div>
        </div>
    `;
}

// 10. AI VOICE CONTROL
let micActive = false;
function toggleMic() {
    micActive = !micActive;
    const btn = document.getElementById('mic-btn');
    btn.className = micActive ? 'mic-active' : 'mic-inactive';
    const msg = micActive ? "Ich höre zu, Trainer! Klopp-Modus aktiviert." : "Toni ist im Standby.";
    document.querySelector('.ai-msg').innerText = msg;
}
