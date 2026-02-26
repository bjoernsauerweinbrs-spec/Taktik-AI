/* ==========================================================================
   TONI 4.1 | NEURAL LOGIC CORE (FINAL STABILITY & RENDER FIX)
   ========================================================================== */

// --- 1. STATE & PERSISTENCE ENGINE (UNVERÄNDERT) ---
class NeuralCore {
    constructor(storageKey) {
        this.storageKey = storageKey;
        this.state = this._load();
        this.observers = [];
    }

    _load() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) { return JSON.parse(savedData); }
        } catch (e) { console.error("Fehler:", e); }
        return this._getInitialState();
    }

    _getInitialState() {
        return {
            config: { apiKey: "" },
            players: [ /* Profis */ ],
            youth: {
                players: [
                    { id: 1677353940001, name: "Julian Weber", birthDate: "2010-05-15", position: "ST", stats: { tempo: 75, schuss: 68, passen: 62, dribbling: 71, defensive: 34, physis: 60 }, cardImage: null, promotedTo: null, notes: "" },
                    { id: 1677353940002, name: "Leon Kraft", birthDate: "2008-09-22", position: "IV", stats: { tempo: 62, schuss: 45, passen: 58, dribbling: 51, defensive: 78, physis: 75 }, cardImage: null, promotedTo: null, notes: "" },
                    { id: 1677353940003, name: "Max Schmidt", birthDate: "2010-01-10", position: "ZM", stats: { tempo: 68, schuss: 65, passen: 74, dribbling: 72, defensive: 58, physis: 61 }, cardImage: null, promotedTo: "U15", notes: "Technisch brillant, muss aber körperlich zulegen. Wird gegen Ältere getestet." },
                ]
            },
            finance: [ /* Finanzen */ ],
            tactics: { "4-2-3-1": [ /* Taktik */ ] },
            activeFormation: "4-2-3-1"
        };
    }

    commit(mutationFn) {
        mutationFn(this.state);
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) { console.error("Fehler:", e); }
        this.notifyObservers();
    }

    addObserver(observerFn) { this.observers.push(observerFn); }
    notifyObservers() { this.observers.forEach(observer => observer(this.state)); }

    addOrUpdateYouthPlayer(playerData) { this.commit(state => { const i = state.youth.players.findIndex(p => p.id === playerData.id); if (i > -1) { state.youth.players[i] = playerData; } else { playerData.id = Date.now(); state.youth.players.push(playerData); } }); }
    deleteYouthPlayer(playerId) { this.commit(state => { state.youth.players = state.youth.players.filter(p => p.id!== playerId); }); }
    saveApiKey(key) { this.commit(state => { state.config.apiKey = key; }); }
    resetTactics() { this.commit(state => { state.tactics[state.activeFormation] = this._getInitialState().tactics[state.activeFormation]; }); }
}

const ToniDB = new NeuralCore("TONI_V4_NLZ_DATA");

// --- BOOT SEQUENCE ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-boot').addEventListener('click', () => bootSystem());
    // Autologin, falls Session aktiv
    if (sessionStorage.getItem('TONI_AUTH') === 'true') {
        bootSystem();
    }
});

function bootSystem() {
    const authLayer = document.getElementById('auth-layer');
    const appInterface = document.getElementById('app-interface');
    const btn = document.getElementById('btn-boot');
    
    btn.innerText = "LADE MODULE...";
    btn.disabled = true;

    // Sanfter Übergang
    authLayer.style.opacity = '0';
    setTimeout(() => {
        authLayer.classList.add('hidden');
        appInterface.classList.remove('hidden');
        sessionStorage.setItem('TONI_AUTH', 'true');
        finishInitialization();
    }, 500);
}

function finishInitialization() {
    initGlobalEventListeners();
    ToniDB.addObserver(renderUI);
    renderUI(ToniDB.state);
    navigateTo('youth'); // Starten wir direkt im neuen Modul
    setInterval(updateClock, 1000);
}

// --- GLOBALE EVENT LISTENERS (Kugelsicher) ---
function initGlobalEventListeners() {
    // Navigation ist immer da
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => navigateTo(btn.dataset.module));
    });

    // Globale Steuerungselemente sind immer da
    document.getElementById('btn-toggle-settings').addEventListener('click', () => {
        document.getElementById('api-key').value = ToniDB.state.config.apiKey || "";
        toggleModal('modal-settings', true);
    });

    // Schließen-Buttons in Modals (sind immer im DOM)
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => toggleModal(btn.dataset.modalId, false));
    });

    // Speichern-Button im Einstellungs-Modal (immer im DOM)
    document.getElementById('btn-save-settings').addEventListener('click', () => {
        ToniDB.saveApiKey(document.getElementById('api-key').value);
        toggleModal('modal-settings', false);
    });
    
    // AI Mic-Button (immer da)
    document.getElementById('mic-btn').addEventListener('click', (e) => e.currentTarget.classList.toggle('active'));
}

// --- UI / NAVIGATION ---
function navigateTo(moduleName) { /*...unverändert... */ }
function updateClock() { /*...unverändert... */ }
function toggleModal(modalId, show) { /*...unverändert... */ }

// --- ZENTRALE RENDER-FUNKTION ---
function renderUI(state) {
    updateBudget(state.finance);
    // renderKader(state.players); // Temporär deaktiviert, um Fokus zu halten
    // renderTactics(state.tactics[state.activeFormation]);
    // renderOffice(state.finance);
    renderYouth(state.youth); // Unser Fokus-Modul
    // renderMedia();
}

// --- MODUL-RENDERER (mit lokaler Event-Bindung) ---

function updateBudget(financeData) { /*...unverändert... */ }

function renderYouth(youthState) {
    const target = document.getElementById('module-youth');
    const ageGroups = ["Alle", "U19", "U17", "U15", "U13"];
    
    target.innerHTML = `
        <div class="youth-header">
            <div class="youth-tabs">
                ${ageGroups.map(age => `<button class="tab-btn" data-age-group="${age}">${age}</button>`).join('')}
            </div>
            <button class="btn-main" id="btn-add-youth-player" style="width:auto; padding: 8px 20px;">+ SPIELER HINZUFÜGEN</button>
        </div>
        <div class="youth-player-grid"></div>`;

    const grid = target.querySelector('.youth-player-grid');
    const tabs = target.querySelectorAll('.tab-btn');

    function filterAndDisplayPlayers(ageGroup) {
        //... Logik zum Filtern und Anzeigen bleibt unverändert...
        tabs.forEach(t => t.classList.toggle('active', t.dataset.ageGroup === ageGroup));
        grid.innerHTML = '';
        let playersToShow = youthState.players.filter(player => { /*... Filterlogik... */ });
        playersToShow.forEach(player => {
            const card = document.createElement('div');
            card.className = 'panini-card';
            //... Card HTML bleibt unverändert...
            card.addEventListener('click', () => openYouthPlayerModal(player));
            grid.appendChild(card);
        });
    }

    tabs.forEach(tab => tab.addEventListener('click', () => filterAndDisplayPlayers(tab.dataset.ageGroup)));
    // HIER wird der Listener gebunden, NACHDEM der Button existiert
    target.querySelector('#btn-add-youth-player').addEventListener('click', () => openYouthPlayerModal(null));

    filterAndDisplayPlayers("Alle");
}

function openYouthPlayerModal(player) {
    //... Funktion bleibt unverändert, sie bindet ihre eigenen Listener...
    const isNew = player === null;
    const p = isNew? { /*... leeres Spielerobjekt... */ } : player;
    const wrapper = document.getElementById('youth-player-content-wrapper');
    //... wrapper.innerHTML bleibt unverändert...

    // Binden der Listener für dieses spezifische Modal
    wrapper.querySelector('.modal-close').addEventListener('click', () => toggleModal('modal-youth-player', false));
    wrapper.querySelector('#btn-save-youth-player').addEventListener('click', () => { /*... Speicherlogik... */ });
    if (!isNew) {
        wrapper.querySelector('#btn-delete-player').addEventListener('click', () => { /*... Löschlogik... */ });
    }
    toggleModal('modal-youth-player', true);
}

// --- HILFSFUNKTIONEN ---
function getAge(birthDate) { /*...unverändert... */ }

// Platzhalter für andere Module, um Fehler zu vermeiden
function renderKader(players) { document.getElementById('module-kader').innerHTML = "<h2>PROFI KADER (in Entwicklung)</h2>"; }
function renderTactics(formation) { document.getElementById('module-tactics').innerHTML = "<h2>TAKTIK BOARD (in Entwicklung)</h2>"; }
function renderOffice(financeData) { document.getElementById('module-office').innerHTML = "<h2>OFFICE PRIME (in Entwicklung)</h2>"; }
function renderMedia() { document.getElementById('module-media').innerHTML = "<h2>MEDIA & ANALYSE (in Entwicklung)</h2>"; }
//... (Die detaillierten Render-Funktionen für diese Module werden wir im nächsten Schritt wieder einbauen)...

// Vereinfachte Funktionen, um Fehler zu vermeiden
function openBio(id) { console.log("Öffne Bio für Profi-ID:", id); }
function dragStart(e, id) { console.log("Beginne Drag für Taktik-Spieler:", id); }
function addFinance(type) { console.log("Füge Finanz-Eintrag hinzu:", type); }
function loadVideo(input) { console.log("Lade Video:", input.files[0]); }
function initVideoCanvas() { console.log("Initialisiere Video-Canvas"); }
