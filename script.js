/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V23.0 (PRESS AGENCY & NCOS CORE)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V23_ELITE";

// --- 1. CORE DATA ARCHITECTURE ---
let NCOS = {
    state: {
        budget: 4500000,
        activeModule: 'press',
        isMicActive: false
    },
    academy: {
        players: [
            { 
                id: 101, name: "Julian Weber", birthDate: "2011-05-15", position: "ST", 
                stats: { pac: 75, sho: 68, pas: 62, dri: 71, def: 34, phy: 60 }, 
                promotedTo: null, stickers: [true, true, false], 
                aiReview: "Technisch versiert, Fokus auf Physis-Aufbau." 
            }
        ]
    },
    finance: [
        { id: 1, date: "26.02.", desc: "Sponsoring: Neural Gear", val: 1500000, cat: "Income" }
    ],
    press: {
        title: "TONI NEWS",
        issue: "NR. 01 / FEBRUAR 2026",
        pageCount: 4,
        articles: [
            { id: 1, headline: "DER GIGANT ERWACHT", content: "Die neue Ära im Club hat begonnen. Mit TONI 2.0 wird die Analyse auf ein neues Level gehoben..." },
            { id: 2, headline: "NLZ REVOLUTION", content: "Die Jugendakademie meldet Rekordzuwächse. Talente werden jetzt per KI gescoutet." }
        ]
    },
    tactics: {
        players: [{ id: 1, label: "TW", x: 50, y: 92, team: 'home' }],
        vectors: [],
        equipment: []
    }
};

// --- 2. PERSISTENCE ENGINE ---
function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        NCOS.academy = parsed.academy || NCOS.academy;
        NCOS.finance = parsed.finance || NCOS.finance;
        NCOS.press = parsed.press || NCOS.press;
        NCOS.state.budget = parsed.state.budget || NCOS.state.budget;
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(NCOS));
}

// --- 3. BOOT SEQUENCE ---
function bootSystem() {
    loadData();
    const btn = document.querySelector('.btn-main');
    btn.innerText = "VERBINDE PRESSE-BUREAU...";
    
    setTimeout(() => {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');
        initClock();
        loadModule(NCOS.state.activeModule);
        updateGlobalHUD();
    }, 1000);
}

function initClock() {
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// --- 4. MODULE ROUTER ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });
    
    document.getElementById('active-mod-name').innerText = "// " + name.toUpperCase();

    if (name === 'press') renderPressAgency(stage);
    if (name === 'nlz') renderNLZ(stage);
    if (name === 'tactics') renderTactics(stage);
    if (name === 'manager') renderManager(stage);
    if (name === 'video') renderVideo(stage);
}

// --- 5. PRESS AGENCY MODULE (THE NEWSROOM) ---
function renderPressAgency(target) {
    target.innerHTML = `
        <div class="agency-workspace">
            <div class="agency-tools">
                <div class="tool-section">
                    <span class="tool-label">AGENCY TOOLS</span>
                    <button class="btn-agency" onclick="toggleModal('modal-ai-editor', true)">
                        <i class="fa-solid fa-robot"></i> AI NEWS DESK
                    </button>
                    <button class="btn-agency" onclick="addMagazinePages()">
                        <i class="fa-solid fa-plus"></i> SEITEN (+4)
                    </button>
                    <button class="btn-agency" onclick="window.print()">
                        <i class="fa-solid fa-print"></i> DRUCKAUFTRAG
                    </button>
                </div>

                <div class="tool-section">
                    <span class="tool-label">ARCHIV & ASSETS</span>
                    <button class="btn-agency" onclick="importAsset('nlz')"><i class="fa-solid fa-id-card"></i> NLZ-PROFIL</button>
                    <button class="btn-agency" onclick="importAsset('tactics')"><i class="fa-solid fa-chess-board"></i> TAKTIK-MAP</button>
                </div>

                <div class="tool-section" style="margin-top:auto;">
                    <span class="tool-label">STATUS</span>
                    <p style="font-size:11px; color:var(--neon-cyan);">ONLINE // REDAKTION AKTIV</p>
                </div>
            </div>

            <div class="magazine-viewport">
                <div class="magazine-page">
                    <div class="page-half">
                        <div class="luxury-logo" style="font-size: 50px; margin-bottom: 20px;">TONI 2.0</div>
                        <h1 class="mag-headline" contenteditable="true" onblur="savePressData()">${NCOS.press.title}</h1>
                        <p class="mag-subline" contenteditable="true" onblur="savePressData()">${NCOS.press.issue}</p>
                        <div style="margin-top:auto; font-family:var(--font-ui); font-size:10px;">AGENCY EXCLUSIVE // 2026</div>
                    </div>
                    <div class="page-half">
                        <h2 class="mag-headline" style="font-size:32px; border-bottom: 2px solid #000;" contenteditable="true">EDITORIAL</h2>
                        <div class="mag-article" contenteditable="true" onblur="savePressData()">
                            ${NCOS.press.articles[0].content}
                        </div>
                    </div>
                </div>

                ${renderAdditionalPages()}
            </div>
        </div>
    `;
}

function renderAdditionalPages() {
    let pagesHTML = '';
    // Jedes Blatt Papier hat 2 Seiten. pageCount / 4 = Anzahl der zusätzlichen Blätter
    for (let i = 1; i < NCOS.press.pageCount / 2; i++) {
        pagesHTML += `
            <div class="magazine-page">
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;" contenteditable="true">FEATURE STORY</h2>
                    <div class="mag-article" contenteditable="true" onblur="savePressData()">
                        Schreibe hier einen detaillierten Bericht oder importiere ein Interview...
                    </div>
                </div>
                <div class="page-half">
                    <h2 class="mag-headline" style="font-size:24px;" contenteditable="true">KI-ANALYSE</h2>
                    <div style="background:#eee; height:200px; display:flex; align-items:center; justify-content:center; color:#ccc; margin-bottom:20px;">
                        [BILD-ASSET]
                    </div>
                    <div class="mag-article" contenteditable="true" onblur="savePressData()">
                        Die taktische Ausrichtung war entscheidend für den Ausgang der Partie. Die Vektoren zeigen eine klare Tendenz...
                    </div>
                </div>
            </div>
        `;
    }
    return pagesHTML;
}

// --- 6. PRESS AGENCY LOGIC ---
function addMagazinePages() {
    NCOS.press.pageCount += 4;
    saveData();
    loadModule('press');
}

function savePressData() {
    // Hier werden die Inhalte der Zeitung aus dem DOM gelesen und in NCOS gespeichert
    const headlines = document.querySelectorAll('.mag-headline');
    if (headlines.length > 0) NCOS.press.title = headlines[0].innerText;
    saveData();
}

function generateNewsContent() {
    const prompt = document.getElementById('ai-prompt').value;
    const log = document.getElementById('ai-log');
    
    toggleModal('modal-ai-editor', false);
    log.innerHTML = `<div class="ai-message" style="color:var(--neon-cyan)">KI-Redakteur erstellt Schlagzeile für: "${prompt}"...</div>`;
    
    setTimeout(() => {
        const generatedText = "DER DURCHBRUCH: Wie unsere KI-Strategie den Gegner im Keim erstickte. Ein Exklusiv-Bericht aus der Kabine.";
        NCOS.press.articles[0].content = generatedText;
        saveData();
        loadModule('press');
        log.innerHTML = `<div class="ai-message">Artikel erfolgreich generiert und platziert.</div>`;
    }, 2000);
}

function importAsset(type) {
    const log = document.getElementById('ai-log');
    if (type === 'nlz') {
        log.innerHTML = `<div class="ai-message">Importiere Daten von ${NCOS.academy.players[0].name} in die Zeitung...</div>`;
        // Logik zum Einfügen in den Zeitungs-State
    }
}

// --- 7. NLZ & TACTICS INTEGRATION (EXISTING LOGIC) ---
function renderNLZ(target) {
    target.innerHTML = `
        <div class="nlz-background" style="padding:40px; overflow-y:auto; height:100%;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:40px;">
                <div class="luxury-logo" style="font-size:32px;">TONI 2.0 // ERINNERUNGSALBUM</div>
                <button class="btn-main" style="width:auto; padding:10px 30px;" onclick="openAddPlayerModal()">+ REGISTRIEREN</button>
            </div>
            <div class="panini-album">
                ${NCOS.academy.players.map(p => `
                    <div class="panini-card" onclick="editYouthPlayer(${p.id})">
                        <div style="padding:20px;">
                            <div style="font-family:var(--font-ui); color:var(--neon-gold); font-size:24px;">${calculateOVR(p.stats)}</div>
                            <div style="text-align:center; margin:15px 0;"><i class="fa-solid fa-user-graduate" style="font-size:50px; color:#1a253d;"></i></div>
                            <div style="text-align:center; font-family:var(--font-ui);">${p.name}</div>
                            <div class="sticker-grid">
                                <div class="sticker-slot ${p.stickers[0] ? 'unlocked' : ''}"><i class="fa-solid fa-star"></i></div>
                                <div class="sticker-slot ${p.stickers[1] ? 'unlocked' : ''}"><i class="fa-solid fa-bolt"></i></div>
                                <div class="sticker-slot ${p.stickers[2] ? 'unlocked' : ''}"><i class="fa-solid fa-trophy"></i></div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- 8. UTILS & SYSTEM ---
function calculateOVR(stats) {
    const v = Object.values(stats);
    return Math.round(v.reduce((a, b) => a + b) / v.length);
}

function updateGlobalHUD() {
    document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €";
}

function toggleModal(id, show) {
    document.getElementById(id).classList.toggle('hidden', !show);
}

function toggleMic() {
    NCOS.state.isMicActive = !NCOS.state.isMicActive;
    document.getElementById('mic-btn').classList.toggle('active', NCOS.state.isMicActive);
    if(NCOS.state.isMicActive) toggleModal('modal-ai-editor', true);
}

// Platzhalter für Taktik & Video
function renderTactics(target) { target.innerHTML = `<div style="padding:40px;"><h2>TACTICAL ENGINE V23</h2><div class="pitch-container"></div></div>`; }
function renderManager(target) { target.innerHTML = `<div style="padding:40px;"><h2>ERP FINANCIALS</h2></div>`; }
function renderVideo(target) { target.innerHTML = `<div style="padding:40px;"><h2>BROADCAST LAB</h2></div>`; }

// Editor-Modus für Jugendspieler (aus V22 übernommen)
function editYouthPlayer(id) {
    const p = NCOS.academy.players.find(x => x.id === id);
    const inner = document.getElementById('bio-content-inner');
    inner.innerHTML = `<div style="padding:40px; background:#000; border:1px solid var(--neon-gold);">
        <h2>${p.name} EDITIEREN</h2>
        <button class="btn-main" onclick="toggleModal('modal-bio', false)">SCHLIESSEN</button>
    </div>`;
    toggleModal('modal-bio', true);
}
