/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V16.2 ULTIMATE)
   ========================================================================== */

const SAVE_KEY = "TONI20_SYSTEM_DATA";

// --- 1. DATEN-KERN (ELITE STORE) ---
let eliteStore = {
    config: { passkey: "1234", version: "16.2", clubLogoUrl: "", apiKey: "" },
    
    // Neuer Office-Manager: Transaktionen statt starre Werte
    finance: {
        budget: 0, // Wird live berechnet
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
            { id: 'o1', label: 'TW', t: 5, l: 50 }, { id: 'o2', label: 'IV', t: 20, l: 30 },
            { id: 'o3', label: 'IV', t: 20, l: 50 }, { id: 'o4', label: 'IV', t: 20, l: 70 }
        ]
    },

    magazine: {
        clubName: "FC TONI 2.0", sheets: 1,
        pages: [
            { id: 1, title: "MATCH DAY", content: "ANALYSE: Fokus auf Halbräume." },
            { id: 2, title: "DATEN-REPORT", content: "Gegner-Analyse läuft..." },
            { id: 3, title: "VORSTAND", content: "Finanz-Update Q3." },
            { id: 4, title: "PARTNER", content: "Wir danken unseren Sponsoren." }
        ]
    },

    // Komplettes Spieler-Profil (FIFA + Bio + Sticker)
    players: [
        { 
            id: 1, name: "NEUER", pos: "TW", rating: 89, type: 'pro',
            fifa: { pac: 50, sho: 40, pas: 91, dri: 60, def: 90, phy: 85 },
            bio: { weight: 92.4, fat: 11.2, muscle: 48.5, water: 62.1 },
            sensor: { heart: 48, sleep: 8.2, vo2: 60, stress: 12 }
        },
        { 
            id: 10, name: "KANE", pos: "ST", rating: 90, type: 'pro',
            fifa: { pac: 69, sho: 93, pas: 84, dri: 83, def: 48, phy: 82 },
            bio: { weight: 86.1, fat: 12.5, muscle: 47.2, water: 59.8 },
            sensor: { heart: 46, sleep: 7.5, vo2: 58, stress: 25 }
        },
        { 
            id: 99, name: "JUNIOR", pos: "ST", rating: 65, type: 'youth',
            stickers: [true, true, false, false, false, false, false, false] 
        }
    ]
};

// --- 2. SYSTEM BOOT & GLOBAL SETTINGS ---
function systemBootSequence() {
    loadFromDisk();
    const input = document.getElementById('passkey');
    // Bypass möglich, wenn Feld leer ist (für schnelleres Testen)
    if (input.value === eliteStore.config.passkey || input.value === "") {
        document.getElementById('auth-layer').style.display = 'none';
        document.getElementById('main-interface').classList.remove('hidden');
        initDashboard();
    } else { alert("ZUGRIFF VERWEIGERT."); }
}

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

function initDashboard() {
    updateBudgetCalc();
    renderQuickList();
    switchModule('kader'); // Start-Modul
    setInterval(() => {
        const clock = document.getElementById('clock-display');
        if(clock) clock.innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// --- 3. MODUL ROUTER ---
function switchModule(modId) {
    const stage = document.getElementById('module-content');
    eliteStore.mgmt.activeModule = modId;
    
    // Update Navigation UI
    document.querySelectorAll('.side-nav button').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`nav-${modId}`);
    if(btn) btn.classList.add('active');
    
    // Update Header
    document.getElementById('active-mod-title').innerText = modId.toUpperCase();

    // Render Content
    if (modId === 'kader') renderKader(stage);
    if (modId === 'finance') renderOffice(stage);
    if (modId === 'media') renderMediaCenter(stage);
    if (modId === 'tactics') renderTactics(stage);
    if (modId === 'youth') renderJuniorHub(stage);
}

// --- 4. OFFICE MANAGER (BUCHHALTUNG) ---
function renderOffice(target) {
    updateBudgetCalc();
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="grid-column: span 2;">
                <h3>FINANZ-ZENTRALE // BUDGET: ${eliteStore.finance.budget.toLocaleString()} €</h3>
                
                <div class="transaction-input-row">
                    <input type="text" id="new-trans-desc" placeholder="Beschreibung (z.B. Neuer Sponsor)" style="flex:2;">
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
                            <td><button onclick="removeTransaction(${idx})" style="color:var(--neon-alert); background:none; border:none; cursor:pointer;">LÖSCHEN</button></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="office-panel">
                <h3>INFRASTRUKTUR-STATUS</h3>
                <div class="lab-row" style="margin-bottom:10px; display:flex; justify-content:space-between;">
                    <span>ANALYSEZENTRUM</span><b>LVL ${eliteStore.finance.infrastructure.analysisCenter}</b>
                </div>
                <div class="lab-row" style="display:flex; justify-content:space-between;">
                    <span>STADION</span><b>LVL ${eliteStore.finance.infrastructure.stadium}</b>
                </div>
            </div>
        </div>`;
}

function updateBudgetCalc() {
    const total = eliteStore.finance.transactions.reduce((acc, curr) => {
        return curr.type === 'income' ? acc + parseFloat(curr.val) : acc - parseFloat(curr.val);
    }, 0);
    eliteStore.finance.budget = total;
    const display = document.getElementById('kpi-budget');
    if(display) display.innerText = total.toLocaleString() + " €";
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
    if(confirm("Buchung wirklich löschen?")) {
        eliteStore.finance.transactions.splice(idx, 1);
        saveToDisk();
        renderOffice(document.getElementById('module-content'));
    }
}

// --- 5. KADER & BIO LAB (VOLLE KONTROLLE) ---
function renderKader(target) {
    target.innerHTML = `<div class="kader-grid fade-in">${eliteStore.players.filter(p=>p.type==='pro').map(p => `
        <div class="fifa-card" onclick="openBioLab(${p.id})">
            <div class="card-inner">
                <div class="card-rating-box"><span class="val">${p.rating}</span></div>
                <div class="card-name">${p.name}</div>
                <div style="font-size:40px; color:#333; margin-top:40px;"><i class="fa-solid fa-user-ninja"></i></div>
            </div>
        </div>`).join('')}</div>`;
}

function openBioLab(id) {
    const p = eliteStore.players.find(x => x.id === id);
    const modal = document.getElementById('bio-lab-modal');
    const container = document.getElementById('modal-container');
    modal.classList.remove('hidden');

    container.innerHTML = `
        <div class="column-header" style="display:flex; justify-content:space-between; margin-bottom:20px;">
            <span style="font-size:18px;">SPIELER-AKTE // ${p.name}</span>
            <button onclick="document.getElementById('bio-lab-modal').classList.add('hidden')" class="btn-neon-small">SCHLIESSEN</button>
        </div>
        <div class="lab-grid-full" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            <div class="office-panel">
                <h3>LEISTUNGSDATEN (FIFA)</h3>
                ${Object.keys(p.fifa).map(key => `
                    <div class="stat-row" style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="color:#aaa;">${key.toUpperCase()}</span>
                        <input type="number" value="${p.fifa[key]}" onchange="updatePlayerStat(${p.id}, 'fifa', '${key}', this.value)" style="width:60px;">
                    </div>`).join('')}
            </div>
            <div class="office-panel">
                <h3>KÖRPERANALYSE (LIVE)</h3>
                <div class="stat-row" style="display:flex; justify-content:space-between;"><span>GEWICHT (KG)</span><input type="number" value="${p.bio.weight}" onchange="updatePlayerStat(${p.id}, 'bio', 'weight', this.value)" style="width:60px;"></div>
                <div class="stat-row" style="display:flex; justify-content:space-between;"><span>FETT (%)</span><input type="number" value="${p.bio.fat}" onchange="updatePlayerStat(${p.id}, 'bio', 'fat', this.value)" style="width:60px;"></div>
                <div class="stat-row" style="display:flex; justify-content:space-between;"><span>MUSKEL (%)</span><input type="number" value="${p.bio.muscle}" onchange="updatePlayerStat(${p.id}, 'bio', 'muscle', this.value)" style="width:60px;"></div>
                <div style="margin-top:15px; border-top:1px solid #444; padding-top:10px;">
                    <div class="stat-row" style="display:flex; justify-content:space-between;"><span>RUHEPULS</span><input type="number" value="${p.sensor.heart}" onchange="updatePlayerStat(${p.id}, 'sensor', 'heart', this.value)" style="width:60px;"></div>
                    <div class="stat-row" style="display:flex; justify-content:space-between;"><span>SCHLAF (H)</span><input type="number" value="${p.sensor.sleep}" onchange="updatePlayerStat(${p.id}, 'sensor', 'sleep', this.value)" style="width:60px;"></div>
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

// --- 6. TAKTIK BOARD (DRAG & DROP) ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-container fade-in">
            <div class="tactics-header" style="padding:10px; display:flex; justify-content:space-between;">
                <h3>TAKTIK-COCKPIT</h3>
                <button class="btn-neon-small" onclick="resetMarkers()">RESET AUFSTELLUNG</button>
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

function resetMarkers() {
    // Setzt Standardwerte zurück (Beispielhaft)
    if(confirm("Aufstellung zurücksetzen?")) {
        eliteStore.tactics.toni.forEach(p => { p.t = 50; p.l = 50; }); // Mitte
        saveToDisk();
        renderTactics(document.getElementById('module-content'));
    }
}

function initDragAndDrop() {
    const pitch = document.getElementById('tactical-pitch');
    if (!pitch) return;
    const markers = document.querySelectorAll('.player-marker');
    let activeMarker = null;

    // Mouse & Touch Events
    markers.forEach(m => {
        m.onmousedown = (e) => { activeMarker = m; };
        m.ontouchstart = (e) => { activeMarker = m; };
    });

    document.onmousemove = (e) => drag(e, activeMarker, pitch);
    document.ontouchmove = (e) => drag(e.touches[0], activeMarker, pitch);

    document.onmouseup = () => { if(activeMarker) { activeMarker = null; saveToDisk(); } };
    document.ontouchend = () => { if(activeMarker) { activeMarker = null; saveToDisk(); } };
}

function drag(e, marker, pitch) {
    if(!marker) return;
    const rect = pitch.getBoundingClientRect();
    let l = ((e.clientX - rect.left) / rect.width) * 100;
    let t = ((e.clientY - rect.top) / rect.height) * 100;
    // Bounds Check (damit sie nicht rausfliegen)
    l = Math.max(0, Math.min(100, l));
    t = Math.max(0, Math.min(100, t));
    
    marker.style.left = `${l}%`; 
    marker.style.top = `${t}%`;
    
    // Update Store
    const p = eliteStore.tactics.toni.find(x => x.id === marker.id) || eliteStore.tactics.opp.find(x => x.id === marker.id);
    if(p) { p.t = t; p.l = l; }
}

// --- 7. VIDEO & MEDIA SUITE ---
function renderMediaCenter(target) {
    target.innerHTML = `
        <div class="office-grid fade-in">
            <div class="office-panel" style="text-align:center;">
                <h3>VIDEO ANALYSE SUITE</h3>
                <p>KI-gestützte Videoanalyse & Telestrator</p>
                <div style="margin-top:15px;">
                    <button class="btn-neon-small" onclick="openVideoSuite()">STUDIO ÖFFNEN</button>
                </div>
            </div>
             <div class="office-panel" style="text-align:center;">
                <h3>PRESSE & ZEITUNG</h3>
                <p>Magazin-Erstellung (Druckvorschau)</p>
                <div style="margin-top:15px;">
                    <button class="btn-neon-small" onclick="openMagazineStudio()">LAYOUT EDITOR</button>
                </div>
            </div>
        </div>`;
}

function openVideoSuite() {
    document.getElementById('video-suite-modal').classList.remove('hidden');
    initCanvas();
}

function loadVideoFile(input) {
    const file = input.files[0];
    if(file) {
        const video = document.getElementById('analysis-video');
        video.src = URL.createObjectURL(file);
        video.load();
        document.getElementById('video-ai-text').innerText = "Video geladen. Zeichnen aktiv.";
    }
}

// Canvas Logik (Malen)
let isDrawing = false;
let ctx;
function initCanvas() {
    const canvas = document.getElementById('telestrator-canvas');
    const stage = document.querySelector('.video-stage');
    // Größe anpassen
    canvas.width = stage.clientWidth;
    canvas.height = stage.clientHeight;
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#00f3ff"; 
    ctx.lineWidth = 3;

    canvas.onmousedown = startDraw;
    canvas.onmousemove = draw;
    canvas.onmouseup = () => isDrawing = false;
}
function startDraw(e) { isDrawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); }
function draw(e) { if(!isDrawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); }
function clearCanvas() { ctx.clearRect(0,0, document.getElementById('telestrator-canvas').width, document.getElementById('telestrator-canvas').height); }
function setTool(tool) { /* Platzhalter für Tool-Switch */ }
function closeVideoSuite() { document.getElementById('video-suite-modal').classList.add('hidden'); }

// Magazin (Kurzfassung der Logik)
function openMagazineStudio() { document.getElementById('magazine-studio-modal').classList.remove('hidden'); renderMagSheets(document.getElementById('magazine-sheet-container')); }
function renderMagSheets(container) {
    let html = "";
    // Einfache Schleife für Seiten
    for(let i=0; i<eliteStore.magazine.pages.length; i+=2) {
        html += `<div class="magazine-sheet-sim"><div class="mag-page-sim"><h4>${eliteStore.magazine.pages[i].title}</h4><div contenteditable="true">${eliteStore.magazine.pages[i].content}</div></div><div class="mag-page-sim"><h4>${eliteStore.magazine.pages[i+1].title}</h4><div contenteditable="true">${eliteStore.magazine.pages[i+1].content}</div></div></div>`;
    }
    container.innerHTML = html;
}
function addMagazineSheet() { alert("Neue Seite hinzugefügt (Demo)"); }

// --- 8. JUNIOR HUB (STICKER ALBUM) ---
function renderJuniorHub(target) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    if (!kid) { target.innerHTML = "Kein Jugendspieler gefunden."; return; }
    
    target.innerHTML = `
        <div class="office-panel fade-in">
            <h3>PANINI ALBUM // ${kid.name} (U19)</h3>
            <div class="sticker-grid" style="margin-top:20px;">
                ${kid.stickers.map((s, i) => `
                    <div class="sticker ${s ? 'unlocked' : ''}" onclick="toggleSticker(${i})">
                        ${s ? '<i class="fa-solid fa-star"></i>' : i+1}
                    </div>
                `).join('')}
            </div>
            <p style="margin-top:15px; font-size:10px; color:#888;">* Klicke auf ein Feld, um Sticker einzukleben.</p>
        </div>`;
}

function toggleSticker(i) {
    const kid = eliteStore.players.find(p => p.type === 'youth');
    if (kid) {
        kid.stickers[i] = !kid.stickers[i];
        saveToDisk();
        renderJuniorHub(document.getElementById('module-content'));
    }
}

// --- HELFER & SPEICHER ---
function renderQuickList() { document.getElementById('quick-squad-list').innerHTML = ""; }
function saveToDisk() { localStorage.setItem(SAVE_KEY, JSON.stringify(eliteStore)); }
function loadFromDisk() { const s = localStorage.getItem(SAVE_KEY); if(s) eliteStore = {...eliteStore, ...JSON.parse(s)}; }
function toggleMic() { 
    const mic = document.getElementById('mic-btn');
    mic.classList.toggle('mic-active');
    document.querySelector('.ai-msg').innerText = "Toni hört zu...";
}
