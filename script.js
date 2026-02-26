/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V16.1 FIX) - MANAGER & TACTICS REPAIR
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

// --- DATEN-KERN ---
let eliteStore = {
    config: { passkey: "1234", version: "16.1", clubLogoUrl: "", apiKey: "" },
    
    // Neuer Office-Manager: Transaktionen statt starre Werte
    finance: {
        budget: 4850000,
        transactions: [
            { id: 1, desc: "TV-Gelder Q1", type: "income", val: 2500000 },
            { id: 2, desc: "Hauptsponsor: Neural Gear", type: "income", val: 1000000 },
            { id: 3, desc: "Reisekosten: Madrid", type: "expense", val: 12000 },
            { id: 4, desc: "Neue Trainingsbälle", type: "expense", val: 4500 }
        ],
        infrastructure: { analysisCenter: 1, stadium: 1 }
    },

    tactics: {
        toni: [
            { id: 't1', label: 'TW', t: 90, l: 50 }, { id: 't2', label: 'LV', t: 75, l: 20 },
            { id: 't3', label: 'IV', t: 75, l: 40 }, { id: 't4', label: 'IV', t: 75, l: 60 },
            { id: 't5', label: 'RV', t: 75, l: 80 }, { id: 't6', label: 'ZM', t: 50, l: 40 },
            { id: 't7', label: 'ZM', t: 50, l: 60 }, { id: 't8', label: 'LM', t: 40, l: 15 },
            { id: 't9', label: 'RM', t: 40, l: 85 }, { id: 't10', label: 'ST', t: 20, l: 45 },
            { id: 't11', label: 'ST', t: 20, l: 55 }
        ],
        opp: [
            { id: 'o1', label: 'TW', t: 5, l: 50 }, { id: 'o2', label: 'IV', t: 20, l: 50 }
        ]
    },

    // Komplettes Spieler-Profil (FIFA + Bio)
    players: [
        { 
            id: 1, name: "NEUER", pos: "TW", rating: 89,
            fifa: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 },
            bio: { weight: 92.4, fat: 11.2, muscle: 48.5, water: 62.1 },
            sensor: { heart: 48, sleep: 8.2, vo2: 60, stress: 12 }
        },
        { 
            id: 10, name: "KANE", pos: "ST", rating: 90,
            fifa: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 },
            bio: { weight: 86.1, fat: 12.5, muscle: 47.2, water: 59.8 },
            sensor: { heart: 46, sleep: 7.5, vo2: 58, stress: 25 }
        }
    ]
};

// --- SYSTEM BOOT & SETTINGS (FIXED) ---
function systemBootSequence() {
    loadFromDisk();
    const input = document.getElementById('passkey');
    // Einfacher Bypass für Testzwecke, wenn leer
    if (input.value === eliteStore.config.passkey || input.value === "") {
        document.getElementById('auth-layer').style.display = 'none';
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

// FIX: Diese Funktion fehlte vorher!
function toggleSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.toggle('hidden');
}

function saveSettings() {
    const key = document.getElementById('api-key-input').value;
    eliteStore.config.apiKey = key;
    saveToDisk();
    alert("Systemkonfiguration gespeichert.");
    toggleSettings();
}

// --- OFFICE MANAGER SUITE (NEU) ---
function renderOffice(target) {
    // Berechne Budget Live
    const total = eliteStore.finance.transactions.reduce((acc, curr) => {
        return curr.type === 'income' ? acc + parseFloat(curr.val) : acc - parseFloat(curr.val);
    }, 0);
    eliteStore.finance.budget = total;

    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="grid-column: span 2;">
                <h3>FINANZ-ZENTRALE // BUDGET: ${total.toLocaleString()} €</h3>
                <div style="margin-bottom: 15px; display:flex; gap:10px;">
                    <input type="text" id="new-trans-desc" placeholder="Beschreibung (z.B. Neuer Sponsor)">
                    <select id="new-trans-type"><option value="income">Einnahme (+)</option><option value="expense">Ausgabe (-)</option></select>
                    <input type="number" id="new-trans-val" placeholder="Betrag">
                    <button class="btn-neon-small" onclick="addTransaction()">BUCHEN</button>
                </div>
                
                <table class="ledger-table">
                    <thead><tr><th>ID</th><th>BESCHREIBUNG</th><th>TYP</th><th>BETRAG</th><th>AKTION</th></tr></thead>
                    <tbody>
                        ${eliteStore.finance.transactions.map((t, idx) => `
                        <tr>
                            <td>#${t.id}</td>
                            <td>${t.desc}</td>
                            <td style="color:${t.type==='income'?'var(--neon-green)':'var(--neon-alert)'}">${t.type.toUpperCase()}</td>
                            <td>${t.val.toLocaleString()} €</td>
                            <td><button onclick="removeTransaction(${idx})" style="color:red; background:none; border:none;">X</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <div class="office-panel">
                <h3>INFRASTRUKTUR-STATUS</h3>
                <div class="lab-row"><span>ANALYSEZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b></div>
                <div class="lab-row"><span>STADION</span><b>LVL ${eliteStore.finance.infrastructure.stadium}</b></div>
            </div>
        </div>`;
    updateBudgetDisplay();
}

function addTransaction() {
    const desc = document.getElementById('new-trans-desc').value;
    const type = document.getElementById('new-trans-type').value;
    const val = parseFloat(document.getElementById('new-trans-val').value);
    
    if(desc && val) {
        eliteStore.finance.transactions.push({ id: Date.now(), desc, type, val });
        saveToDisk();
        renderOffice(document.getElementById('module-content'));
    }
}

function removeTransaction(idx) {
    eliteStore.finance.transactions.splice(idx, 1);
    saveToDisk();
    renderOffice(document.getElementById('module-content'));
}

// --- KADER & HIGH-END BIO LAB (FIXED) ---
function renderKader(target) {
    target.innerHTML = `<div class="kader-grid fade-in">${eliteStore.players.map(p => `
        <div class="fifa-card" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-rating-box"><span class="val">${p.rating}</span></div>
                <div class="card-name">${p.name}</div>
            </div>
        </div>`).join('')}</div>`;
}

// FIX: Öffnet jetzt alle Daten (FIFA + Bio)
function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');

    container.innerHTML = `
        <div class="column-header" style="display:flex; justify-content:space-between;">
            <span>SPIELER-AKTE // ${p.name}</span>
            <button onclick="document.getElementById('bio-lab-modal').classList.add('hidden')" class="btn-neon-small">SCHLIESSEN</button>
        </div>
        <div class="lab-grid-full">
            <div class="office-panel">
                <h3>LEISTUNGSDATEN (FIFA)</h3>
                ${Object.keys(p.fifa).map(key => `
                    <div class="stat-row">
                        <span>${key.toUpperCase()}</span>
                        <input type="number" value="${p.fifa[key]}" onchange="updatePlayerStat(${p.id}, 'fifa', '${key}', this.value)">
                    </div>`).join('')}
            </div>
            <div class="office-panel">
                <h3>KÖRPERANALYSE (WAAGE/UHR)</h3>
                <div class="stat-row"><span>GEWICHT (KG)</span><input type="number" value="${p.bio.weight}" onchange="updatePlayerStat(${p.id}, 'bio', 'weight', this.value)"></div>
                <div class="stat-row"><span>KÖRPERFETT (%)</span><input type="number" value="${p.bio.fat}" onchange="updatePlayerStat(${p.id}, 'bio', 'fat', this.value)"></div>
                <div class="stat-row"><span>MUSKELMASSE (%)</span><input type="number" value="${p.bio.muscle}" onchange="updatePlayerStat(${p.id}, 'bio', 'muscle', this.value)"></div>
                <div style="margin-top:10px; border-top:1px solid #333; padding-top:10px;">
                    <div class="stat-row"><span>RUHEPULS</span><input type="number" value="${p.sensor.heart}" onchange="updatePlayerStat(${p.id}, 'sensor', 'heart', this.value)"></div>
                    <div class="stat-row"><span>SCHLAF (STD)</span><input type="number" value="${p.sensor.sleep}" onchange="updatePlayerStat(${p.id}, 'sensor', 'sleep', this.value)"></div>
                </div>
            </div>
        </div>
    `;
}

function updatePlayerStat(id, category, key, val) {
    const p = eliteStore.players.find(x => x.id === id);
    p[category][key] = parseFloat(val);
    saveToDisk();
}

// --- VIDEO & MEDIA (FIXED) ---
function renderMediaCenter(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="text-align:center;">
                <h3>VIDEO ANALYSE SUITE</h3>
                <p>KI-gestützte Videoanalyse & Telestrator</p>
                <button class="btn-neon-small" onclick="openVideoSuite()">STUDIO ÖFFNEN</button>
            </div>
             <div class="office-panel" style="text-align:center;">
                <h3>PRESSE & ZEITUNG</h3>
                <p>Magazin-Erstellung (Druckvorschau)</p>
                <button class="btn-neon-small" onclick="openMagazineStudio()">LAYOUT EDITOR</button>
            </div>
        </div>`;
}

function openVideoSuite() {
    document.getElementById('video-suite-modal').classList.remove('hidden');
    initCanvas();
}
function closeVideoSuite() { document.getElementById('video-suite-modal').classList.add('hidden'); }

// Lädt das lokale Video in den Player
function loadVideoFile(input) {
    const file = input.files[0];
    const video = document.getElementById('analysis-video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.load();
    document.getElementById('video-ai-text').innerText = "Video geladen. Bereit für Zeichnungen.";
}

// Einfacher Zeichen-Canvas (Telestrator)
let isDrawing = false;
let ctx;
function initCanvas() {
    const canvas = document.getElementById('telestrator-canvas');
    const stage = document.querySelector('.video-stage');
    canvas.width = stage.clientWidth;
    canvas.height = stage.clientHeight;
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#00f3ff"; // Neon Cyan
    ctx.lineWidth = 3;

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
}

function startDraw(e) { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); }
function draw(e) { if(!isDrawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }
function clearCanvas() { ctx.clearRect(0,0, document.getElementById('telestrator-canvas').width, document.getElementById('telestrator-canvas').height); }
function setTool(tool) { if(tool==='pen') ctx.strokeStyle="#00f3ff"; }

// --- TAKTIK (VISUAL UPDATE) ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header">
                <h3>TAKTIK-COCKPIT</h3>
                <div class="input-group">
                    <button class="btn-neon-small" onclick="resetMarkers()">RESET AUFSTELLUNG</button>
                </div>
            </div>
            <div class="pitch-visualization">
                <div class="pitch-canvas" id="tactical-pitch">
                    <div class="pitch-box-top"></div><div class="pitch-small-box-top"></div><div class="pitch-goal-top"></div>
                    <div class="pitch-box-bottom"></div><div class="pitch-small-box-bottom"></div><div class="pitch-goal-bottom"></div>
                    
                    ${eliteStore.tactics.toni.map(p => `<div class="player-marker team-toni" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                    ${eliteStore.tactics.opp.map(p => `<div class="player-marker team-opp" id="${p.id}" style="top: ${p.t}%; left: ${p.l}%;">${p.label}</div>`).join('')}
                </div>
            </div>
        </div>`;
    initDragAndDrop();
}

function initDragAndDrop() {
    const pitch = document.getElementById('tactical-pitch');
    if (!pitch) return;
    const markers = document.querySelectorAll('.player-marker');
    let activeMarker = null;
    markers.forEach(m => { m.onmousedown = (e) => activeMarker = m; m.ontouchstart = (e) => activeMarker = m; });
    document.onmousemove = (e) => drag(e, activeMarker, pitch);
    document.onmouseup = () => { if(activeMarker) { activeMarker = null; saveToDisk(); } };
}

function drag(e, marker, pitch) {
    if(!marker) return;
    const rect = pitch.getBoundingClientRect();
    let l = ((e.clientX - rect.left) / rect.width) * 100;
    let t = ((e.clientY - rect.top) / rect.height) * 100;
    marker.style.left = `${l}%`; marker.style.top = `${t}%`;
    const p = eliteStore.tactics.toni.find(x => x.id === marker.id) || eliteStore.tactics.opp.find(x => x.id === marker.id);
    if(p) { p.t = t; p.l = l; }
}

// --- JUNIOR HUB & MAGAZIN (RENDERING) ---
function renderJuniorHub(target) { target.innerHTML = `<div class="office-panel"><h3>JUGENDZENTRUM</h3><p>Wähle einen Jahrgang (U19 - U11) für Kader & Taktik.</p></div>`; }
function openMagazineStudio() { document.getElementById('magazine-studio-modal').classList.remove('hidden'); }

// --- HELPER ---
function renderQuickList() { document.getElementById('quick-squad-list').innerHTML = ""; }
function updateBudget() { updateBudgetDisplay(); }
function updateBudgetDisplay() { 
    const el = document.getElementById('kpi-budget');
    if(el) el.innerText = eliteStore.finance.budget.toLocaleString() + " €";
}
function saveToDisk() { localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore)); }
function loadFromDisk() { const s = localStorage.getItem(SAVE_KEY); if(s) eliteStore = {...eliteStore, ...JSON.parse(s)}; }
function switchModule(modId) {
    eliteStore.mgmt.activeModule = modId;
    document.querySelectorAll('.side-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${modId}`).classList.add('active');
    document.getElementById('active-mod-title').innerText = modId.toUpperCase();
    const stage = document.getElementById('module-content');
    if(modId === 'kader') renderKader(stage);
    if(modId === 'finance') renderOffice(stage);
    if(modId === 'tactics') renderTactics(stage);
    if(modId === 'media') renderMediaCenter(stage);
    if(modId === 'youth') renderJuniorHub(stage);
}
