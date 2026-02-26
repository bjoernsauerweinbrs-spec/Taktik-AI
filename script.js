/* ==========================================================================
   TONI 4.0 | NEURAL LOGIC CORE (NLZ MODULE IMPLEMENTATION)
   ========================================================================== */

// --- 1. STATE & PERSISTENCE ENGINE ---
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
            
            // ** NEUE DATENSTRUKTUR FÜR DIE JUGEND **
            youth: {
                players: [
                    { id: 1677353940001, name: "Julian Weber", birthDate: "2010-05-15", position: "ST", stats: { tempo: 75, schuss: 68, passen: 62, dribbling: 71, defensive: 34, physis: 60 }, cardImage: null, promotedTo: null, notes: "" },
                    { id: 1677353940002, name: "Leon Kraft", birthDate: "2008-09-22", position: "IV", stats: { tempo: 62, schuss: 45, passen: 58, dribbling: 51, defensive: 78, physis: 75 }, cardImage: null, promotedTo: null, notes: "" },
                    { id: 1677353940003, name: "Max Schmidt", birthDate: "2010-01-10", position: "ZM", stats: { tempo: 68, schuss: 65, passen: 74, dribbling: 72, defensive: 58, physis: 61 }, cardImage: null, promotedTo: "U15", notes: "Technisch brillant, muss aber körperlich zulegen. Wird gegen Ältere getestet." },
                ]
            },
            finance: [ /* Finanzen */ ],
            tactics: { /* Taktik */ },
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

    // ** NEUE ACTIONS FÜR DIE JUGENDVERWALTUNG **
    addOrUpdateYouthPlayer(playerData) {
        this.commit(state => {
            const index = state.youth.players.findIndex(p => p.id === playerData.id);
            if (index > -1) {
                state.youth.players[index] = playerData; // Update
            } else {
                playerData.id = Date.now(); // Neue ID für neuen Spieler
                state.youth.players.push(playerData); // Add
            }
        });
    }

    deleteYouthPlayer(playerId) {
        this.commit(state => {
            state.youth.players = state.youth.players.filter(p => p.id!== playerId);
        });
    }
    
    //... andere Actions bleiben gleich...
}

// --- BIS HIERHIN: DATENBANK-LOGIK ---
// Der Rest des Skripts (Initialisierung, Event Listeners, UI-Funktionen etc.) wird jetzt angepasst

const ToniDB = new NeuralCore("TONI_V4_NLZ_DATA");

//... Boot-Sequenz bleibt unverändert...

// --- RENDER UI ANGEPASST ---
function renderUI(state) {
    //... updateBudget, renderKader etc. bleiben gleich...
    renderYouth(state.youth); // Die zentrale Render-Funktion ruft jetzt die neue NLZ-Funktion auf
}

// --- 7. NEUES NLZ-MODUL ---

// Hilfsfunktion zur Altersberechnung
function getAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Haupt-Render-Funktion für das NLZ
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
        <div class="youth-player-grid"></div>
    `;

    const grid = target.querySelector('.youth-player-grid');
    const tabs = target.querySelectorAll('.tab-btn');

    function filterAndDisplayPlayers(ageGroup) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.ageGroup === ageGroup));
        grid.innerHTML = ''; // Leere das Grid vor dem Neuzeichnen

        let playersToShow = youthState.players.filter(player => {
            const age = getAge(player.birthDate);
            if (ageGroup === "Alle") return true;

            const baseAgeGroup = `U${Math.ceil(age / 2) * 2 + 1}`; // U13, U15, U17, U19 Logik
            const effectiveAgeGroup = player.promotedTo || baseAgeGroup;
            
            return effectiveAgeGroup === ageGroup;
        });

        playersToShow.forEach(player => {
            const card = document.createElement('div');
            card.className = 'panini-card';
            const overall = Math.round(Object.values(player.stats).reduce((a, b) => a + b) / Object.values(player.stats).length);

            card.innerHTML = `
                <div class="panini-card-header">
                    <div class="panini-card-face"><i class="fa-solid fa-user"></i></div>
                    <div>
                        <div class="panini-card-name">${player.name}</div>
                        <div class="panini-card-pos">${player.position}</div>
                    </div>
                </div>
                <div class="panini-card-stats">
                    <span>TEMPO</span><strong>${player.stats.tempo}</strong>
                    <span>SCHUSS</span><strong>${player.stats.schuss}</strong>
                    <span>PASSEN</span><strong>${player.stats.passen}</strong>
                    <span>DRIBBLING</span><strong>${player.stats.dribbling}</strong>
                    <span>DEFENSIVE</span><strong>${player.stats.defensive}</strong>
                    <span>PHYSIS</span><strong>${player.stats.physis}</strong>
                </div>
                <div style="font-family: var(--font-ui); font-size: 24px; color: var(--neon-gold); position: absolute; top: 15px; right: 15px;">${overall}</div>
            `;
            card.addEventListener('click', () => openYouthPlayerModal(player));
            grid.appendChild(card);
        });
    }

    tabs.forEach(tab => tab.addEventListener('click', () => filterAndDisplayPlayers(tab.dataset.ageGroup)));
    target.querySelector('#btn-add-youth-player').addEventListener('click', () => openYouthPlayerModal(null));

    filterAndDisplayPlayers("Alle"); // Initialer Zustand
}

// Das Modal zum Erstellen und Bearbeiten
function openYouthPlayerModal(player) {
    const isNew = player === null;
    const p = isNew? { name: "", birthDate: "", position: "", stats: { tempo: 50, schuss: 50, passen: 50, dribbling: 50, defensive: 50, physis: 50 }, promotedTo: null, notes: "" } : player;
    
    const wrapper = document.getElementById('youth-player-content-wrapper');
    const age = isNew? "N/A" : getAge(p.birthDate);
    const baseAgeGroup = isNew? "" : `U${Math.ceil(age / 2) * 2 + 1}`;
    
    wrapper.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="font-family:'Orbitron'; color:#fff;">${isNew? "Neuer Spieler" : p.name}</h2>
            <button class="modal-close" data-modal-id="modal-youth-player">×</button>
        </div>
        <div class="youth-modal-grid">
            <div class="youth-modal-sidebar">
                 <div class="panini-card-face"><i class="fa-solid fa-user"></i></div>
                 <h3 style="text-align:center;">${isNew? "Neuer Spieler" : p.name}</h3>
                 <p style="text-align:center; color:#888;">${isNew? "" : `Alter: ${age} | Regulär: ${baseAgeGroup}`}</p>
                 <hr style="border-color: #333; margin: 20px 0;">
                 <button class="btn-main" id="btn-delete-player" style="background:var(--neon-alert); ${isNew? 'display:none;' : ''}">SPIELER LÖSCHEN</button>
            </div>
            <div class="youth-modal-main">
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px;">
                    <div class="youth-modal-form-group">
                        <label>Vollständiger Name</label>
                        <input type="text" id="youth-name" class="youth-modal-input" value="${p.name}">
                    </div>
                    <div class="youth-modal-form-group">
                        <label>Geburtsdatum</label>
                        <input type="date" id="youth-birthdate" class="youth-modal-input" value="${p.birthDate}">
                    </div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                     <div class="youth-modal-form-group">
                        <label>Position</label>
                        <input type="text" id="youth-pos" class="youth-modal-input" value="${p.position}">
                    </div>
                    <div class="youth-modal-form-group">
                        <label>Status / Mannschaftszugehörigkeit</label>
                        <select id="youth-promoted" class="youth-modal-select">
                            <option value="null">Reguläres Team (${baseAgeGroup})</option>
                            <option value="U19" ${p.promotedTo === 'U19'? 'selected' : ''}>Für U19 freigeben</option>
                            <option value="U17" ${p.promotedTo === 'U17'? 'selected' : ''}>Für U17 freigeben</option>
                            <option value="U15" ${p.promotedTo === 'U15'? 'selected' : ''}>Für U15 freigeben</option>
                        </select>
                    </div>
                </div>
                <!--... Weitere Felder für Stats, Notizen etc.... -->
                <div style="text-align:right;">
                    <button class="btn-main" id="btn-save-youth-player">SPEICHERN</button>
                </div>
            </div>
        </div>
    `;

    wrapper.querySelector('.modal-close').addEventListener('click', () => toggleModal('modal-youth-player', false));
    
    wrapper.querySelector('#btn-save-youth-player').addEventListener('click', () => {
        const updatedPlayer = {
            id: p.id,
            name: document.getElementById('youth-name').value,
            birthDate: document.getElementById('youth-birthdate').value,
            position: document.getElementById('youth-pos').value,
            promotedTo: document.getElementById('youth-promoted').value === "null"? null : document.getElementById('youth-promoted').value,
            stats: p.stats, // Vereinfacht, hier würden die Stats-Inputs ausgelesen
            notes: p.notes,
        };
        ToniDB.addOrUpdateYouthPlayer(updatedPlayer);
        toggleModal('modal-youth-player', false);
    });

    if (!isNew) {
        wrapper.querySelector('#btn-delete-player').addEventListener('click', () => {
            if (confirm(`Möchtest du ${p.name} wirklich endgültig aus dem NLZ entfernen?`)) {
                ToniDB.deleteYouthPlayer(p.id);
                toggleModal('modal-youth-player', false);
            }
        });
    }
    
    toggleModal('modal-youth-player', true);
}

// --- RESTLICHE FUNKTIONEN (unverändert) ---
//... openBio, dragStart, addFinance, etc. bleiben wie in der letzten Version...
