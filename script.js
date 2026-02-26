/* ==========================================================================
   TONI 3.0 | NEURAL LOGIC CORE V3.2 (FINAL STABILITY FIX)
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
        } catch (e) {
            console.error("Fehler beim Laden der Daten aus dem LocalStorage:", e);
        }
        return this._getInitialState();
    }

    _getInitialState() {
        return {
            config: { apiKey: "" },
            players: [
                { id: 1, name: "NEUER", pos: "TW", rating: 89, img: "user-ninja", bio: { weight: 92, fat: 11, status: "Fit" } },
                { id: 2, name: "KANE", pos: "ST", rating: 90, img: "crosshairs", bio: { weight: 86, fat: 12, status: "Fit" } },
                { id: 3, name: "MUSIALA", pos: "ZM", rating: 86, img: "bolt", bio: { weight: 72, fat: 8, status: "Fit" } },
                { id: 4, name: "KIMMICH", pos: "CDM", rating: 88, img: "shield-halved", bio: { weight: 75, fat: 9, status: "Fatigue" } }
            ],
            finance: [
                { id: Date.now() + 1, desc: "TV-Rechte Bundesliga", val: 2500000, type: "in" },
                { id: Date.now() + 2, desc: "Sponsoring: Neural Gear", val: 1500000, type: "in" }
            ],
            tactics: {
                "4-2-3-1": [
                    { id: 1, label: "TW", x: 50, y: 90 }, { id: 2, label: "IV", x: 35, y: 75 },
                    { id: 3, label: "IV", x: 65, y: 75 }, { id: 4, label: "LV", x: 10, y: 65 },
                    { id: 5, label: "RV", x: 90, y: 65 }, { id: 6, label: "DM", x: 40, y: 60 },
                    { id: 7, label: "DM", x: 60, y: 60 }, { id: 8, label: "LM", x: 20, y: 35 },
                    { id: 9, label: "RM", x: 80, y: 35 }, { id: 10, label: "OM", x: 50, y: 40 },
                    { id: 11, label: "ST", x: 50, y: 20 }
                ]
            },
            activeFormation: "4-2-3-1"
        };
    }

    commit(mutationFn) {
        mutationFn(this.state);
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        } catch (e) {
            console.error("Fehler beim Speichern der Daten im LocalStorage:", e);
        }
        this.notifyObservers();
    }

    addObserver(observerFn) { this.observers.push(observerFn); }
    notifyObservers() { this.observers.forEach(observer => observer(this.state)); }

    addFinanceEntry(desc, val, type) { this.commit(state => { state.finance.unshift({ id: Date.now(), desc, val, type }); }); }
    updatePlayerPosition(playerId, newX, newY) { this.commit(state => { const p = state.tactics[state.activeFormation].find(p => p.id === playerId); if (p) { p.x = newX; p.y = newY; } }); }
    saveApiKey(key) { this.commit(state => { state.config.apiKey = key; }); }
    resetTactics() { this.commit(state => { state.tactics[state.activeFormation] = this._getInitialState().tactics[state.activeFormation]; }); }
}

const ToniDB = new NeuralCore("TONI_V3_LUXURY_DATA");

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('TONI_AUTH') === 'true') {
        bootSystem();
    } else {
        document.getElementById('btn-boot').addEventListener('click', () => bootSystem(true));
    }
});

function bootSystem(isInitialBoot = false) {
    const authLayer = document.getElementById('auth-layer');
    const appInterface = document.getElementById('app-interface');
    if (isInitialBoot) {
        const btn = document.getElementById('btn-boot');
        btn.innerText = "LADE MODULE...";
        btn.disabled = true;
        authLayer.style.opacity = '0';
        setTimeout(() => {
            authLayer.classList.add('hidden');
            appInterface.classList.remove('hidden');
            sessionStorage.setItem('TONI_AUTH', 'true');
            finishInitialization();
        }, 500);
    } else {
        authLayer.classList.add('hidden');
        appInterface.classList.remove('hidden');
        finishInitialization();
    }
}

function finishInitialization() {
    initEventListeners();
    ToniDB.addObserver(renderUI);
    renderUI(ToniDB.state);
    navigateTo('tactics');
    setInterval(updateClock, 1000);
}

function initEventListeners() {
    document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => navigateTo(btn.dataset.module)));
    document.getElementById('btn-toggle-settings').addEventListener('click', () => {
        document.getElementById('api-key').value = ToniDB.state.config.apiKey;
        toggleModal('modal-settings', true);
    });
    document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => toggleModal(btn.dataset.modalId, false)));
    document.getElementById('btn-save-settings').addEventListener('click', () => {
        ToniDB.saveApiKey(document.getElementById('api-key').value);
        toggleModal('modal-settings', false);
    });
    document.getElementById('mic-btn').addEventListener('click', (e) => e.currentTarget.classList.toggle('active'));
    document.getElementById('btn-load-video').addEventListener('click', () => document.getElementById('vid-up').click());
    document.getElementById('vid-up').addEventListener('change', (e) => loadVideo(e.target));
}

function navigateTo(moduleName) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.module === moduleName));
    document.getElementById('active-mod-name').innerText = `// ${moduleName.toUpperCase()}`;
    document.querySelectorAll('.stage-module').forEach(module => module.classList.toggle('active', module.id === `module-${moduleName}`));
}

function updateClock() { document.getElementById('clock').innerText = new Date().toLocaleTimeString('de-DE').slice(0, 5); }
function toggleModal(modalId, show) { const modal = document.getElementById(modalId); if (modal) { modal.classList.toggle('hidden',!show); } }

function renderUI(state) {
    updateBudget(state.finance);
    renderKader(state.players);
    renderTactics(state.tactics[state.activeFormation]);
    renderOffice(state.finance);
    renderMedia();
    renderYouth();
}

function updateBudget(financeData) {
    const el = document.getElementById('budget-display');
    const newTotal = financeData.reduce((acc, f) => acc + (f.type === 'in'? f.val : -f.val), 0);
    el.innerText = newTotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function renderKader(players) {
    const target = document.getElementById('module-kader');
    target.innerHTML = `<div class="roster-grid"></div>`;
    const grid = target.querySelector('.roster-grid');
    players.forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `<div class="pc-rating">${p.rating}</div><div class="pc-pos">${p.pos}</div><div class="pc-face"><i class="fa-solid fa-${p.img}"></i></div><div class="pc-name">${p.name}</div>`;
        card.addEventListener('click', () => openBio(p.id));
        grid.appendChild(card);
    });
}

function renderTactics(formation) {
    const target = document.getElementById('module-tactics');
    // ** KORREKTUR: Der Reset-Button wird hier im HTML hinzugefügt. **
    target.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
             <h3 style="font-family:'Orbitron'">TAKTIK BOARD PRO</h3>
             <button class="btn-main" id="btn-reset-tactics" style="width:auto; padding:5px 15px; font-size:10px;">RESET</button>
        </div>
        <div class="pitch-wrapper">
            <div class="pitch-surface" id="pitch-area">
                <div class="pitch-line line-mid"></div><div class="pitch-border circle-mid"></div>
                <div class="pitch-border box-16-top"></div><div class="pitch-border box-5-top"></div><div class="goal-net-top"></div>
                <div class="pitch-border box-16-bot"></div><div class="pitch-border box-5-bot"></div><div class="goal-net-bot"></div>
                ${formation.map(p => `<div class="tactic-player" id="pl-${p.id}" style="left:${p.x}%; top:${p.y}%;" data-id="${p.id}">${p.label}</div>`).join('')}
            </div>
        </div>`;
    
    target.querySelectorAll('.tactic-player').forEach(p => p.addEventListener('mousedown', (e) => dragStart(e, parseInt(p.dataset.id))));
    target.querySelector('#btn-reset-tactics').addEventListener('click', () => ToniDB.resetTactics());
}

function renderOffice(financeData) {
    const target = document.getElementById('module-office');
    target.innerHTML = `... (Der lange HTML-String für Office bleibt gleich)...`; // Gekürzt für Lesbarkeit
    target.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
            <div>
                <h3 style="font-family:'Orbitron'; color:#00f3ff; margin-bottom:20px;">FINANZ ÜBERSICHT</h3>
                <table class="finance-table">
                    <thead><tr><th>BESCHREIBUNG</th><th>TYP</th><th>BETRAG</th></tr></thead>
                    <tbody>
                        ${financeData.map(f => `<tr><td>${f.desc}</td><td style="color:${f.type === 'in'? '#0aff60' : '#ff003c'}">${f.type.toUpperCase()}</td><td>${f.val.toLocaleString('de-DE')} €</td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:20px; border:1px solid #333;">
                <h4 style="margin-bottom:15px;">NEUE BUCHUNG</h4>
                <input id="fin-desc" placeholder="Beschreibung" class="auth-input" style="font-size:12px; margin-bottom:10px;">
                <input id="fin-val" type="number" placeholder="Betrag" class="auth-input" style="font-size:12px; margin-bottom:10px;">
                <div style="display:flex; gap:10px;">
                    <button class="btn-main" id="btn-add-in">EINNAHME</button>
                    <button class="btn-main" id="btn-add-out" style="background:#ff003c;">AUSGABE</button>
                </div>
            </div>
        </div>`;
    document.getElementById('btn-add-in').addEventListener('click', () => addFinance('in'));
    document.getElementById('btn-add-out').addEventListener('click', () => addFinance('out'));
}

function renderYouth() {
    document.getElementById('module-youth').innerHTML = "<h2 style='text-align:center; color:#555; margin-top:50px;'>JUGEND AKADEMIE (Wartung)</h2>";
}

function renderMedia() {
    const target = document.getElementById('module-media');
    target.innerHTML = `... (Der lange HTML-String für Media bleibt gleich)...`; // Gekürzt für Lesbarkeit
    target.innerHTML = `
        <div class="newspaper-workspace">
            <div class="newspaper-sheet">
                <div class="news-header"><h1 style="font-size:60px; margin:0;">TONI SPORT</h1><p contenteditable="true">Donnerstag, 26. Februar 2026 | Nr. 102</p></div>
                <div class="news-headline" contenteditable="true">MEISTERSCHAFT IN SICHT!</div>
                <div class="news-img-placeholder"><i class="fa-solid fa-image"></i>&nbsp; BILD ODER VIDEO-SNAPSHOT EINFÜGEN</div>
                <div class="news-columns" contenteditable="true">Dies ist ein bearbeitbarer Text...</div>
            </div>
        </div>
        <div style="text-align:center; padding:20px;"><button class="btn-main" id="btn-print" style="width:auto; padding: 10px 30px;">DRUCKEN / PDF</button></div>`;
    target.querySelector('#btn-print').addEventListener('click', () => window.print());
    target.querySelector('.news-img-placeholder').addEventListener('click', () => { toggleModal('modal-video', true); initVideoCanvas(); });
}

function openBio(id) {
    const p = ToniDB.state.players.find(x => x.id === id);
    if (!p) return;
    const contentWrapper = document.getElementById('bio-content-wrapper');
    // ** KORREKTUR: Der Schließen-Button wird hier im HTML hinzugefügt. **
    contentWrapper.innerHTML = `
        <button class="modal-close" data-modal-id="modal-bio">×</button>
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px;">
            <h2 style="font-family:'Orbitron'; color:#fff;">${p.name} <span style="color:#00f3ff; font-size:14px;">// BIO-DATEN</span></h2>
            <div style="font-size:30px; color:#ffd700;">${p.rating}</div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-top:20px;">
            <div><h4 style="color:#666; margin-bottom:10px;">PHYSIK</h4><div style="margin-bottom:10px;">Gewicht: ${p.bio.weight} kg</div><div>Körperfett: ${p.bio.fat} %</div></div>
            <div><h4 style="color:#666; margin-bottom:10px;">STATUS</h4><div style="color:${p.bio.status === 'Fit'? '#0aff60' : '#ff003c'}">${p.bio.status.toUpperCase()}</div></div>
        </div>`;
    contentWrapper.querySelector('.modal-close').addEventListener('click', () => toggleModal('modal-bio', false));
    toggleModal('modal-bio', true);
}

function dragStart(e, id) {
    e.preventDefault();
    const el = document.getElementById('pl-' + id);
    const container = document.getElementById('pitch-area');
    function move(evt) {
        const rect = container.getBoundingClientRect();
        let x = ((evt.clientX - rect.left) / rect.width) * 100;
        let y = ((evt.clientY - rect.top) / rect.height) * 100;
        el.style.left = `${Math.max(2, Math.min(98, x))}%`;
        el.style.top = `${Math.max(2, Math.min(98, y))}%`;
    }
    function stop(evt) {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
        const rect = container.getBoundingClientRect();
        let finalX = ((evt.clientX - rect.left) / rect.width) * 100;
        let finalY = ((evt.clientY - rect.top) / rect.height) * 100;
        ToniDB.updatePlayerPosition(id, Math.max(2, Math.min(98, finalX)), Math.max(2, Math.min(98, finalY)));
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
}

function addFinance(type) {
    const descEl = document.getElementById('fin-desc');
    const valEl = document.getElementById('fin-val');
    const v = parseFloat(valEl.value);
    if (descEl.value && v > 0) {
        ToniDB.addFinanceEntry(descEl.value, v, type);
        descEl.value = ''; valEl.value = '';
    }
}

function loadVideo(input) {
    const v = document.getElementById('video-player');
    if (input.files && input.files[0]) { v.src = URL.createObjectURL(input.files[0]); v.play(); }
}

function initVideoCanvas() {
    const c = document.getElementById('video-canvas');
    const ctx = c.getContext('2d');
    const container = c.parentElement;
    c.width = container.clientWidth; c.height = container.clientHeight;
    ctx.strokeStyle = "#00f3ff"; ctx.lineWidth = 4; ctx.lineCap = "round";
    let paint = false;
    c.onmousedown = (e) => { paint = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
    c.onmousemove = (e) => { if (paint) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
    c.onmouseup = () => paint = false;
    c.onmouseleave = () => paint = false;
}
