/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V15.8 PRO) - FULL MEDIA & MANAGEMENT
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

let eliteStore = {
    config: { passkey: "1234", version: "15.8 PRO", clubLogoUrl: "" },
    mgmt: { budget: 4850000, morale: 88, activeModule: 'kader' },
    
    // DIE AKTENTASCHE (MANAGER-BEREICH)
    finance: {
        pro: { tvRights: 2500000, sponsoring: 1500000, stadium: 850000 },
        amateur: { members: 55000, gear: -4500, travel: -1200 },
        sponsors: [
            { id: 1, name: "Neural Gear", type: "Haupt", value: 1000000, bonus: 200000 },
            { id: 2, name: "AI-Fit", type: "Ärmel", value: 300000, bonus: 50000 },
            { id: 3, name: "ToniLogic", type: "Lokal", value: 200000, bonus: 20000 }
        ],
        infrastructure: {
            analysisCenter: 1, // Level 1-5
            stadiumExp: 1,
            academy: 1
        }
    },

    // STADIONZEITUNG DATA CORE (DIN-A4 QUER LOGIK)
    magazine: {
        clubName: "FC TONI 2.0",
        sheets: 1, // 1 Bogen = 4 Seiten
        pages: [
            { id: 1, title: "MATCH DAY", content: "Willkommen im Hexenkessel! Trainer Toni begrüßt alle Fans zum Heimspiel. Wir sind bereit für den SV Hennes!" },
            { id: 2, title: "DIE TABELLE", content: "Platz 1: FC Toni 2.0 (32 Pkt) | Platz 2: SV Hennes (28 Pkt). Der Kampf um die Spitze ist eröffnet." },
            { id: 3, title: "VORSTANDS-GRUSS", content: "Das Management dankt allen Partnern. Unsere Investitionen in die K.I. Infrastruktur tragen erste Früchte." },
            { id: 4, title: "PARTNER & IMPRESSUM", content: "Premium-Partner: Neural Gear, AI-Fit, ToniLogic. Kontakt: media@fc-toni-2-0.de" }
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

// --- MEMORY CORE ---
function saveToDisk() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore));
}

function loadFromDisk() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        const parsed = JSON.parse(savedData);
        eliteStore = {...eliteStore, ...parsed};
    }
}

// 1. SYSTEM-BOOT
function systemBootSequence() {
    loadFromDisk();
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
            ${eliteStore.players.filter(p => p.type === 'pro').map(p => `
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

// 4. BIO-LAB (EDITIERBAR)
function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');

    container.innerHTML = `
        <div class="column-header">ANALYSE-ZENTRUM // ${p.name}</div>
        <div class="lab-grid">
            <div class="office-panel">
                <h3>PERFORMANCE</h3>
                ${Object.keys(p.stats).map(s => `<div class="lab-row"><span>${s.toUpperCase()}</span><input type="number" value="${p.stats[s]}" onchange="updateValue(${p.id}, 'stats', '${s}', this.value)"></div>`).join('')}
                <div style="margin-top:20px; font-size:24px; color:var(--neon-gold); text-align:center;">RATING: <span id="lab-rating">${p.rating}</span></div>
            </div>
            <div class="office-panel">
                <h3>FETT-ANALYSE</h3>
                <div class="lab-row"><span>GEWICHT</span><input type="number" step="0.1" value="${p.bio.weight}" onchange="updateValue(${p.id}, 'bio', 'weight', this.value)"></div>
                <div class="lab-row"><span>KFA</span><input type="number" step="0.1" value="${p.bio.kfa}" onchange="updateValue(${p.id}, 'bio', 'kfa', this.value)"></div>
            </div>
            <div class="office-panel">
                <h3>SENSOR-DATEN</h3>
                <div class="lab-row"><span>PULS</span><input type="number" value="${p.sensors.heart}" onchange="updateValue(${p.id}, 'sensors', 'heart', this.value)"></div>
            </div>
        </div>
        <button onclick="closeBioLab()" class="btn-neon-small" style="width:100%; margin-top:20px;">SYNC</button>
    `;
}

function updateValue(id, cat, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[cat][key] = parseFloat(val);
    if (cat === 'stats') {
        const s = p.stats;
        const total = (s.pac * 2) + (s.sho * 1.5) + (s.pas * 2) + (s.dri * 1.5) + (s.def * 1) + (s.phy * 2);
        p.rating = Math.round(total / 10);
    }
    saveToDisk();
    renderKader(document.getElementById('module-content'));
    renderQuickList();
}

function closeBioLab() { document.getElementById('bio-lab-modal').classList.add('hidden'); }

// 5. MANAGER-BEREICH (AKTENTASCHE)
function renderOffice(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel">
                <h3>SPONSOREN-PYRAMIDE</h3>
                ${eliteStore.finance.sponsors.map(s => `
                    <div class="lab-row"><span>${s.name} (${s.type})</span><b>${s.value.toLocaleString()} €</b></div>
                `).join('')}
            </div>
            <div class="office-panel">
                <h3>INFRASTRUKTUR</h3>
                <div class="lab-row"><span>ANALYSE-ZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b></div>
                <div class="lab-row"><span>STADION-STATUS</span><b>LVL ${eliteStore.finance.infrastructure.stadiumExp}</b></div>
            </div>
            <div class="office-panel" style="grid-column: span 2;">
                <h3>FINANZEN (PRO)</h3>
                ${Object.keys(eliteStore.finance.pro).map(k => `<div class="lab-row"><span>${k.toUpperCase()}</span><input type="number" value="${eliteStore.finance.pro[k]}" onchange="eliteStore.finance.pro['${k}']=parseInt(this.value); saveToDisk(); updateBudget();"></div>`).join('')}
            </div>
        </div>`;
}

// 6. MEDIA CENTER (STUDIO)
function renderMediaCenter(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="grid-column: span 2; text-align:center;">
                <i class="fa-solid fa-newspaper" style="font-size:50px; color:var(--neon-cyan); margin-bottom:20px;"></i>
                <h2>STADIONZEITUNG STUDIO</h2>
                <p>Status: ${eliteStore.magazine.sheets * 4} Seiten (Querformat)</p>
                <div style="margin-top:20px; display:flex; gap:10px; justify-content:center;">
                    <button class="btn-neon-small" onclick="openMagazineStudio()"><i class="fa-solid fa-pen-nib"></i> EDITOR ÖFFNEN</button>
                    <button class="btn-neon-small" onclick="syncWithFootballDe()"><i class="fa-solid fa-rotate"></i> TONI-SYNC (HENNES)</button>
                </div>
            </div>
        </div>
    `;
}

function openMagazineStudio() {
    const modal = document.getElementById('magazine-studio-modal');
    const container = document.getElementById('magazine-sheet-container');
    modal.classList.remove('hidden');
    renderMagazineSheets(container);
}

function renderMagazineSheets(container) {
    let html = "";
    for (let i = 0; i < eliteStore.magazine.pages.length; i += 2) {
        html += `
            <div class="magazine-sheet-sim">
                <div class="mag-page-sim">
                    <small>SEITE ${i+1}</small>
                    <h4 contenteditable="true" onblur="updateMag(${i}, 'title', this.innerText)">${eliteStore.magazine.pages[i].title}</h4>
                    <div class="mag-content-editable" contenteditable="true" onblur="updateMag(${i}, 'content', this.innerText)">${eliteStore.magazine.pages[i].content}</div>
                </div>
                <div class="mag-page-sim">
                    <small>SEITE ${i+2}</small>
                    <h4 contenteditable="true" onblur="updateMag(${i+1}, 'title', this.innerText)">${eliteStore.magazine.pages[i+1].title}</h4>
                    <div class="mag-content-editable" contenteditable="true" onblur="updateMag(${i+1}, 'content', this.innerText)">${eliteStore.magazine.pages[i+1].content}</div>
                    ${(i+2 === eliteStore.magazine.sheets * 4) ? `<div class="mag-sponsor-footer"><div class="mag-sponsor-logo">NEURAL GEAR</div><div class="mag-sponsor-logo">AI-FIT</div><div class="mag-sponsor-logo">TONILOGIC</div></div>` : ""}
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function updateMag(idx, field, val) { eliteStore.magazine.pages[idx][field] = val; saveToDisk(); }

function addMagazineSheet() {
    eliteStore.magazine.sheets++;
    for(let i=0; i<4; i++) {
        eliteStore.magazine.pages.push({ id: eliteStore.magazine.pages.length+1, title: "NEUE SEITE", content: "Inhalt eingeben..." });
    }
    saveToDisk();
    renderMagazineSheets(document.getElementById('magazine-sheet-container'));
}

function syncWithFootballDe() {
    alert("Toni analysiert SV Hennes... Daten geladen!");
    eliteStore.magazine.pages[1].content = "LIVE-UPDATE: Der SV Hennes lauert auf Platz 2. Toni empfiehlt eine verstärkte Abwehrleistung für das kommende Derby!";
    saveToDisk();
}

// 7. JUNIOR HUB & TAKTIK
function renderJuniorHub(target) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    target.innerHTML = `<div class="office-panel fade-in"><h3>PANINI ALBUM // ${kid.name}</h3><div class="sticker-grid">${kid.stickers.map((s, i) => `<div class="sticker ${s ? 'unlocked' : ''}" onclick="kid.stickers[${i}]=!kid.stickers[${i}]; saveToDisk(); renderJuniorHub(target);">${s ? '★' : i+1}</div>`).join('')}</div></div>`;
}

function renderTactics(target) {
    target.innerHTML = `<div class="office-panel fade-in"><h3>TAKTIK-BOARD</h3><p>Formation: 4-4-2 vs 3-4-3 (Gegner)</p></div>`;
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
    document.querySelector('.ai-msg').innerText = mic ? "Toni hört zu. Was ist der Plan?" : "System im Standby.";
}
