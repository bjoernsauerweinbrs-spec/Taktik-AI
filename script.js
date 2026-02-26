/* ==========================================================================
   TONI 2.0 | NEURAL CORE ENGINE (V16.5 FINAL)
   ========================================================================== */

const SAVE_KEY = "TONI_DATA_V16";

// --- 1. DATENBANK (Der Speicher) ---
let DB = {
    config: { apiKey: "" },
    budget: 0, // Wird live berechnet
    
    // SPIELER
    players: [
        { 
            id: 1, name: "NEUER", pos: "TW", rating: 89, 
            stats: { reflex: 90, hechten: 88, kicken: 91, pos: 85 },
            bio: { weight: 92.5, fat: 11.0, muscle: 48.0, heart: 45 }
        },
        { 
            id: 9, name: "KANE", pos: "ST", rating: 90, 
            stats: { pace: 70, shoot: 93, pass: 85, drib: 82 },
            bio: { weight: 86.0, fat: 12.5, muscle: 46.5, heart: 48 }
        },
        { 
            id: 42, name: "MUSIALA", pos: "ZM", rating: 86, 
            stats: { pace: 88, shoot: 80, pass: 85, drib: 94 },
            bio: { weight: 72.0, fat: 8.5, muscle: 44.0, heart: 50 }
        }
    ],

    // FINANZEN
    finance: [
        { id: 1, txt: "Sponsoring: Neural Gear", val: 1500000, type: "income" },
        { id: 2, txt: "TV-Rechte: Bundesliga", val: 2500000, type: "income" },
        { id: 3, txt: "Reisekosten: London", val: 12500, type: "expense" },
        { id: 4, txt: "Medizinische Ausrüstung", val: 4500, type: "expense" }
    ],

    // TAKTIK (Positionen in %)
    tactics: [
        { id: 1, label: "TW", x: 50, y: 90 },
        { id: 2, label: "IV", x: 35, y: 75 }, { id: 3, label: "IV", x: 65, y: 75 },
        { id: 4, label: "LV", x: 15, y: 70 }, { id: 5, label: "RV", x: 85, y: 70 },
        { id: 6, label: "ZM", x: 40, y: 50 }, { id: 7, label: "ZM", x: 60, y: 50 },
        { id: 8, label: "LM", x: 10, y: 40 }, { id: 9, label: "RM", x: 90, y: 40 },
        { id: 10, label: "ST", x: 40, y: 20 }, { id: 11, label: "ST", x: 60, y: 20 }
    ],

    // JUGEND STICKER (true = eingeklebt)
    stickers: [true, true, false, false, false, false, false, false, false, false, false, false]
};

// --- 2. SYSTEM START ---
function bootSystem() {
    // Verstecke Login, zeige Interface
    document.getElementById('auth-layer').classList.add('hidden');
    document.getElementById('main-interface').classList.remove('hidden');
    
    // Starte erstes Modul
    updateBudgetDisplay();
    loadModule('kader');
    
    // Starte Uhr
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE').slice(0,5);
    }, 1000);
}

// --- 3. MODUL MANAGER (Seitenwechsel) ---
function loadModule(name) {
    const stage = document.getElementById('content-stage');
    
    // UI Update (Titel & Active State)
    document.getElementById('active-module-title').innerText = name.toUpperCase();
    document.querySelectorAll('#sidebar button').forEach(b => b.classList.remove('active'));
    const navBtn = document.getElementById('nav-' + name);
    if(navBtn) navBtn.classList.add('active');

    // Inhalt rendern
    if (name === 'kader') renderKader(stage);
    if (name === 'tactics') renderTactics(stage);
    if (name === 'office') renderOffice(stage);
    if (name === 'youth') renderYouth(stage);
    if (name === 'media') renderMedia(stage);
}

// --- 4. KADER & MODAL ---
function renderKader(target) {
    target.innerHTML = `
        <div class="card-grid fade-in">
            ${DB.players.map(p => `
                <div class="fifa-card" onclick="openPlayerModal(${p.id})">
                    <div class="card-rating">${p.rating}</div>
                    <div class="card-icon"><i class="fa-solid fa-user-ninja"></i></div>
                    <div class="card-name">${p.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function openPlayerModal(id) {
    const p = DB.players.find(x => x.id === id);
    const modal = document.getElementById('modal-player');
    const content = document.getElementById('player-modal-content');
    
    document.getElementById('player-modal-title').innerText = p.name + " // AKTE";
    
    // Hier füllen wir das Modal mit HTML (damit es nicht leer ist)
    content.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
                <h4 style="color:#00f3ff; margin-bottom:10px;">LEISTUNGSDATEN</h4>
                ${Object.keys(p.stats).map(key => `
                    <div style="margin-bottom:10px;">
                        <span style="color:#888; font-size:12px;">${key.toUpperCase()}</span>
                        <input type="number" value="${p.stats[key]}" onchange="updatePlayerStat(${id}, 'stats', '${key}', this.value)">
                    </div>
                `).join('')}
            </div>
            <div>
                <h4 style="color:#ffd700; margin-bottom:10px;">BIO-METRIK</h4>
                <div style="margin-bottom:10px;">GEWICHT (KG)<input type="number" value="${p.bio.weight}" onchange="updatePlayerStat(${id}, 'bio', 'weight', this.value)"></div>
                <div style="margin-bottom:10px;">FETT (%)<input type="number" value="${p.bio.fat}" onchange="updatePlayerStat(${id}, 'bio', 'fat', this.value)"></div>
                <div style="margin-bottom:10px;">MUSKEL (%)<input type="number" value="${p.bio.muscle}" onchange="updatePlayerStat(${id}, 'bio', 'muscle', this.value)"></div>
                <div style="margin-bottom:10px;">RUHEPULS<input type="number" value="${p.bio.heart}" onchange="updatePlayerStat(${id}, 'bio', 'heart', this.value)"></div>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function updatePlayerStat(id, category, key, val) {
    const p = DB.players.find(x => x.id === id);
    p[category][key] = parseFloat(val);
}

// --- 5. TAKTIK BOARD (Mit Linien & Drag) ---
function renderTactics(target) {
    target.innerHTML = `
        <div class="tactics-wrapper fade-in">
            <div class="pitch" id="pitch-area">
                <div class="pitch-line mid-line"></div>
                <div class="pitch-border mid-circle"></div>
                
                <div class="pitch-border box-16-top"></div><div class="pitch-border box-5-top"></div><div class="goal-top"></div>
                <div class="pitch-border box-16-bot"></div><div class="pitch-border box-5-bot"></div><div class="goal-bot"></div>

                ${DB.tactics.map(t => `
                    <div class="player-dot team-home" id="pl-${t.id}" style="left:${t.x}%; top:${t.y}%;" onmousedown="initDrag(event, ${t.id})">
                        ${t.label}
                    </div>
                `).join('')}
            </div>
            <div style="text-align:center; padding:10px;">
                <small style="color:#888;">SPIELER VERSCHIEBBAR (DRAG & DROP)</small>
            </div>
        </div>
    `;
}

// Drag & Drop Logik
function initDrag(e, id) {
    const el = document.getElementById('pl-' + id);
    const container = document.getElementById('pitch-area');
    
    function move(evt) {
        const rect = container.getBoundingClientRect();
        let x = ((evt.clientX - rect.left) / rect.width) * 100;
        let y = ((evt.clientY - rect.top) / rect.height) * 100;
        
        // Begrenzung 0-100%
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        el.style.left = x + '%';
        el.style.top = y + '%';
    }

    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
        // Speichern der Position könnte hier erfolgen
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
}

// --- 6. OFFICE MANAGER ---
function renderOffice(target) {
    updateBudgetDisplay();
    target.innerHTML = `
        <div class="fade-in">
            <h3 style="color:#00f3ff; margin-bottom:20px;">FINANZ ZENTRALE</h3>
            
            <div style="background:rgba(255,255,255,0.05); padding:15px; margin-bottom:20px; display:flex; gap:10px;">
                <input id="fin-txt" placeholder="Beschreibung (z.B. Neuer Sponsor)" style="flex:2;">
                <input id="fin-val" type="number" placeholder="Betrag" style="width:150px;">
                <select id="fin-type" style="width:150px;">
                    <option value="income">EINNAHME (+)</option>
                    <option value="expense">AUSGABE (-)</option>
                </select>
                <button class="btn-neon" onclick="addTransaction()">BUCHEN</button>
            </div>

            <table class="ledger-table">
                <thead><tr><th>BESCHREIBUNG</th><th>TYP</th><th>BETRAG</th><th>AKTION</th></tr></thead>
                <tbody>
                    ${DB.finance.map((f, index) => `
                        <tr>
                            <td>${f.txt}</td>
                            <td style="color:${f.type === 'income' ? '#0aff60' : '#ff003c'}">${f.type.toUpperCase()}</td>
                            <td>${f.val.toLocaleString()} €</td>
                            <td><button style="color:red; background:none; border:none; cursor:pointer;" onclick="deleteTransaction(${index})">X</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function addTransaction() {
    const txt = document.getElementById('fin-txt').value;
    const val = parseFloat(document.getElementById('fin-val').value);
    const type = document.getElementById('fin-type').value;

    if(txt && val) {
        DB.finance.push({ txt, val, type });
        loadModule('office'); // Refresh
    }
}

function deleteTransaction(index) {
    DB.finance.splice(index, 1);
    loadModule('office');
}

function updateBudgetDisplay() {
    let sum = 0;
    DB.finance.forEach(f => {
        if(f.type === 'income') sum += parseFloat(f.val);
        else sum -= parseFloat(f.val);
    });
    DB.budget = sum;
    const el = document.getElementById('header-budget');
    if(el) el.innerText = sum.toLocaleString() + " €";
}

// --- 7. JUGEND (STICKER) ---
function renderYouth(target) {
    target.innerHTML = `
        <div class="fade-in">
            <h3 style="color:#ffd700; margin-bottom:10px;">U19 TALENT ALBUM</h3>
            <div class="sticker-grid">
                ${DB.stickers.map((s, i) => `
                    <div class="sticker ${s ? 'unlocked' : ''}" onclick="toggleSticker(${i})">
                        ${s ? '<i class="fa-solid fa-star"></i>' : (i+1)}
                    </div>
                `).join('')}
            </div>
            <p style="margin-top:20px; font-size:12px; color:#666;">* Klicke auf ein Feld, um Sticker einzukleben.</p>
        </div>
    `;
}

function toggleSticker(index) {
    DB.stickers[index] = !DB.stickers[index];
    loadModule('youth');
}

// --- 8. VIDEO SUITE & MEDIA ---
function renderMedia(target) {
    target.innerHTML = `
        <div style="text-align:center; padding-top:50px;" class="fade-in">
            <h3 style="margin-bottom:20px;">MEDIA CENTER</h3>
            <button class="btn-neon" style="font-size:18px; padding:20px 40px;" onclick="openVideoModal()">
                <i class="fa-solid fa-play-circle"></i> VIDEO ANALYSE STARTEN
            </button>
            <div style="margin-top:40px; border-top:1px solid #333; padding-top:20px;">
                <h4>PRESSE MAPPE</h4>
                <p style="color:#666;">Stadionzeitung Layout V1.2 aktiv</p>
                <button class="btn-neon" onclick="window.print()">DRUCKEN (PDF)</button>
            </div>
        </div>
    `;
}

function openVideoModal() {
    document.getElementById('modal-video').classList.remove('hidden');
    initCanvas();
}

function loadVideoFile(input) {
    const video = document.getElementById('main-video-player');
    video.src = URL.createObjectURL(input.files[0]);
    document.getElementById('video-status-text').innerText = "Video geladen. Bereit.";
}

// Canvas Painting (Telestrator)
function initCanvas() {
    const canvas = document.getElementById('telestrator-canvas');
    const container = document.querySelector('.video-container');
    
    // Größe anpassen
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "#00f3ff"; // Neon Cyan
    ctx.lineWidth = 4;
    
    let painting = false;

    canvas.onmousedown = (e) => {
        painting = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    };
    
    canvas.onmousemove = (e) => {
        if(painting) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    };
    
    canvas.onmouseup = () => painting = false;
}

// --- HELFER & SETTINGS ---
function closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
}
function toggleSettings() {
    document.getElementById('modal-settings').classList.remove('hidden');
}
function saveSettings() {
    DB.config.apiKey = document.getElementById('api-key-input').value;
    closeModals();
    alert("Einstellungen gespeichert.");
}
function toggleMic() {
    const btn = document.getElementById('mic-btn');
    btn.classList.toggle('active');
    const txt = document.querySelector('.ai-msg');
    txt.innerText = btn.classList.contains('active') ? "Toni hört zu..." : "System bereit.";
}
