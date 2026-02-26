/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V17.0
   ========================================================================== */

const STORE_KEY = "TONI_V17_DATA";

// --- 1. DATENBANK (INIT) ---
let CORE = {
    config: { apiKey: "" },
    budget: 0,
    
    // KADER DATEN
    players: [
        { id: 1, name: "NEUER", pos: "TW", rating: 89, img: "user-ninja", bio: { weight: 92, fat: 11, status: "Fit" } },
        { id: 2, name: "KANE", pos: "ST", rating: 90, img: "crosshairs", bio: { weight: 86, fat: 12, status: "Fit" } },
        { id: 3, name: "MUSIALA", pos: "ZM", rating: 86, img: "bolt", bio: { weight: 72, fat: 8, status: "Fit" } },
        { id: 4, name: "KIMMICH", pos: "CDM", rating: 88, img: "shield-halved", bio: { weight: 75, fat: 9, status: "Fatigue" } }
    ],

    // FINANZEN
    finance: [
        { desc: "TV-Rechte Bundesliga", val: 2500000, type: "in" },
        { desc: "Sponsoring: Neural Gear", val: 1500000, type: "in" },
        { desc: "Reisekosten London", val: 12500, type: "out" },
        { desc: "Medizinische Abteilung", val: 4500, type: "out" }
    ],

    // TAKTIK (Positionen für 4-2-3-1)
    tactics: [
        { id: 1, label: "TW", x: 50, y: 90 },
        { id: 2, label: "IV", x: 35, y: 75 },
        { id: 3, label: "IV", x: 65, y: 75 },
        { id: 4, label: "LV", x: 10, y: 65 },
        { id: 5, label: "RV", x: 90, y: 65 },
        { id: 6, label: "ZM", x: 40, y: 50 },
        { id: 7, label: "ZM", x: 60, y: 50 },
        { id: 8, label: "LM", x: 15, y: 35 },
        { id: 9, label: "RM", x: 85, y: 35 },
        { id: 10, label: "ZOM", x: 50, y: 35 },
        { id: 11, label: "ST", x: 50, y: 15 }
    ]
};

// --- 2. SYSTEM START ---
function bootSystem() {
    // Animation simulieren
    const btn = document.querySelector('.btn-main');
    btn.innerText = "LADE MODULE...";
    
    setTimeout(() => {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');
        initDashboard();
    }, 800);
}

function initDashboard() {
    updateBudget();
    loadModule('tactics'); // Startseite
    
    // Uhrzeit
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString('de-DE').slice(0,5);
    }, 1000);
}

// --- 3. NAVIGATION ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    
    // UI Update
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    // Versuch Button zu finden (generisch)
    const btn = document.querySelector(`button[onclick="loadModule('${name}')"]`);
    if(btn) btn.classList.add('active');

    document.getElementById('active-mod-name').innerText = "// " + name.toUpperCase();

    // Router
    if (name === 'kader') renderKader(stage);
    if (name === 'tactics') renderTactics(stage);
    if (name === 'office') renderOffice(stage);
    if (name === 'media') renderMedia(stage);
    if (name === 'youth') stage.innerHTML = "<h2 style='text-align:center; color:#555;'>JUGEND AKADEMIE (Wartung)</h2>";
}

// --- 4. MODULE: KADER ---
function renderKader(target) {
    target.innerHTML = `
        <div class="roster-grid fade-in">
            ${CORE.players.map(p => `
                <div class="player-card" onclick="openBio(${p.id})">
                    <div class="pc-rating">${p.rating}</div>
                    <div class="pc-pos">${p.pos}</div>
                    <div class="pc-face"><i class="fa-solid fa-${p.img}"></i></div>
                    <div class="pc-name">${p.name}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function openBio(id) {
    const p = CORE.players.find(x => x.id === id);
    const modal = document.getElementById('modal-bio');
    const content = document.getElementById('bio-content');
    
    content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding-bottom:10px;">
            <h2 style="font-family:'Orbitron'; color:#fff;">${p.name} <span style="color:#00f3ff; font-size:14px;">// BIO-DATEN</span></h2>
            <div style="font-size:30px; color:#ffd700;">${p.rating}</div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px; margin-top:20px;">
            <div>
                <h4 style="color:#666; margin-bottom:10px;">PHYSIK</h4>
                <div style="margin-bottom:10px;">Gewicht: <input type="number" value="${p.bio.weight}" style="background:#111; color:#fff; border:1px solid #333; width:60px;"> kg</div>
                <div style="margin-bottom:10px;">Körperfett: <input type="number" value="${p.bio.fat}" style="background:#111; color:#fff; border:1px solid #333; width:60px;"> %</div>
            </div>
            <div>
                <h4 style="color:#666; margin-bottom:10px;">STATUS</h4>
                <div style="color:${p.bio.status === 'Fit' ? '#0aff60' : '#ff003c'}">${p.bio.status.toUpperCase()}</div>
            </div>
        </div>
        <button class="btn-main" style="margin-top:20px;" onclick="closeModals()">SPEICHERN & SCHLIESSEN</button>
    `;
    modal.classList.remove('hidden');
}

// --- 5. MODULE: TAKTIK (GEOMETRY UPDATE) ---
function renderTactics(target) {
    target.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
            <h3 style="font-family:'Orbitron'">TAKTIK BOARD PRO</h3>
            <button class="btn-main" style="width:auto; padding:5px 15px; font-size:10px;" onclick="resetTactics()">RESET</button>
        </div>
        
        <div class="pitch-wrapper">
            <div class="pitch-surface" id="pitch-area">
                <div class="pitch-line line-mid"></div><div class="pitch-border circle-mid"></div>
                
                <div class="pitch-border box-16-top"></div><div class="pitch-border box-5-top"></div>
                <div class="goal-net-top"></div> <div class="pitch-border box-16-bot"></div><div class="pitch-border box-5-bot"></div>
                <div class="goal-net-bot"></div> ${CORE.tactics.map(t => `
                    <div class="tactic-player" id="pl-${t.id}" style="left:${t.x}%; top:${t.y}%;" onmousedown="dragStart(event, ${t.id})">
                        ${t.label}
                    </div>
                `).join('')}
            </div>
        </div>
        <div style="text-align:center; margin-top:10px; color:#555; font-size:10px;">DRAG & DROP AKTIVIERT</div>
    `;
}

function dragStart(e, id) {
    const el = document.getElementById('pl-' + id);
    const container = document.getElementById('pitch-area');
    
    function move(evt) {
        const rect = container.getBoundingClientRect();
        let x = ((evt.clientX - rect.left) / rect.width) * 100;
        let y = ((evt.clientY - rect.top) / rect.height) * 100;
        
        // Limits
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));

        el.style.left = x + '%';
        el.style.top = y + '%';
    }
    
    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);
        // Hier könnte man speichern: CORE.tactics[id].x = x...
    }
    
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
}

function resetTactics() {
    loadModule('tactics'); // Simpler Reset auf Standardwerte
}

// --- 6. MODULE: OFFICE ---
function renderOffice(target) {
    updateBudget();
    target.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 300px; gap:20px;">
            <div>
                <h3 style="font-family:'Orbitron'; color:#00f3ff; margin-bottom:20px;">FINANZ ÜBERSICHT</h3>
                <table class="finance-table">
                    <thead><tr><th>BESCHREIBUNG</th><th>TYP</th><th>BETRAG</th></tr></thead>
                    <tbody>
                        ${CORE.finance.map(f => `
                            <tr>
                                <td>${f.desc}</td>
                                <td style="color:${f.type==='in' ? '#0aff60' : '#ff003c'}">${f.type.toUpperCase()}</td>
                                <td>${f.val.toLocaleString()} €</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div style="background:rgba(255,255,255,0.02); padding:20px; border:1px solid #333;">
                <h4 style="margin-bottom:15px;">NEUE BUCHUNG</h4>
                <input id="fin-desc" placeholder="Beschreibung" style="margin-bottom:10px; background:#222; border:1px solid #444; color:#fff; padding:8px; width:100%;">
                <input id="fin-val" type="number" placeholder="Betrag" style="margin-bottom:10px; background:#222; border:1px solid #444; color:#fff; padding:8px; width:100%;">
                <div style="display:flex; gap:10px;">
                    <button class="btn-main" onclick="addFinance('in')">EINNAHME</button>
                    <button class="btn-main" style="background:#ff003c; color:#fff;" onclick="addFinance('out')">AUSGABE</button>
                </div>
            </div>
        </div>
    `;
}

function addFinance(type) {
    const d = document.getElementById('fin-desc').value;
    const v = parseFloat(document.getElementById('fin-val').value);
    
    if(d && v) {
        CORE.finance.push({ desc: d, val: v, type: type });
        loadModule('office');
    }
}

function updateBudget() {
    let total = 0;
    CORE.finance.forEach(f => {
        if(f.type === 'in') total += f.val;
        else total -= f.val;
    });
    CORE.budget = total;
    const el = document.getElementById('budget-display');
    if(el) el.innerText = total.toLocaleString() + " €";
}

// --- 7. MODULE: MEDIA (ZEITUNG) ---
function renderMedia(target) {
    target.innerHTML = `
        <div class="newspaper-workspace">
            <div class="newspaper-sheet">
                <div class="news-header">
                    <h1 style="font-size:60px; margin:0;">TONI SPORT</h1>
                    <p contenteditable="true">Donnerstag, 26. Februar 2026 | Nr. 102</p>
                </div>

                <div class="news-headline" contenteditable="true">MEISTERSCHAFT IN SICHT!</div>
                
                <div class="news-img-placeholder" onclick="document.getElementById('modal-video').classList.remove('hidden'); initVideoCanvas();">
                    <i class="fa-solid fa-image"></i>&nbsp; BILD ODER VIDEO-SNAPSHOT EINFÜGEN
                </div>

                <div class="news-columns" contenteditable="true">
                    Dies ist ein bearbeitbarer Text. Klicke hier, um den Spielbericht zu schreiben. 
                    Die Mannschaft hat gestern eine überragende Leistung gezeigt. 
                    Taktisch perfekt eingestellt vom Trainerteam.
                    <br><br>
                    Besonders
