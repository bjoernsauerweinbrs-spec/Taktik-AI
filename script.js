/* ==========================================================================
   TONI 2.0 | NEURAL LOGIC CORE V20.0 (GIGANTIC EDITION)
   ========================================================================== */

const STORAGE_KEY = "TONI_NCOS_V20";

// --- 1. CORE DATA ARCHITECTURE ---
let NCOS = {
    state: {
        budget: 4500000,
        activeModule: 'tactics',
        isMicActive: false
    },
    config: { apiKey: "" },
    
    // Taktik-Daten (Vektoren & Equipment)
    tactics: {
        players: [
            { id: 1, label: "TW", x: 50, y: 92, team: 'home' },
            { id: 2, label: "IV", x: 35, y: 78, team: 'home' },
            { id: 3, label: "IV", x: 65, y: 78, team: 'home' },
            { id: 4, label: "ST", x: 50, y: 15, team: 'home' }
        ],
        vectors: [
            { fromX: 50, fromY: 50, toX: 50, toY: 15, type: 'run' }, // Laufweg
            { fromX: 35, fromY: 78, toX: 50, toY: 50, type: 'pass' }  // Passweg
        ],
        equipment: [
            { type: 'cone', x: 45, y: 45 }, { type: 'cone', x: 55, y: 45 }
        ]
    },

    // NLZ (Panini-System)
    academy: {
        players: [
            { id: 101, name: "Lukas Weber", rating: 68, age: "U15", dev: "+4", stickers: [true, true, false], aiReview: "Herausragende Übersicht, körperlich in der Wachstumsphase." },
            { id: 102, name: "Finn Maier", rating: 72, age: "U17", dev: "+2", stickers: [true, false, false], aiReview: "Abschlussstark, Fokus auf defensives Umschaltspiel nötig." }
        ]
    },

    // Finanz-Ledger (ERP)
    finance: [
        { id: 1, date: "26.02.", desc: "Sponsoring: Neural Gear", val: 1500000, cat: "Income" },
        { id: 2, date: "26.02.", desc: "Logistik: Stadion-Catering", val: -4500, cat: "Expense" },
        { id: 3, date: "25.02.", desc: "Transfer-Erlös: Verkauf U19", val: 250000, cat: "Income" }
    ],

    // Press-Station (Magazin)
    press: {
        title: "OFFICIAL MATCHDAY",
        issue: "Nr. 14 / Saison 2026",
        pages: 4 // Standard: 4-8-12
    }
};

// --- 2. BOOT & INITIALIZATION ---
function bootSystem() {
    const btn = document.querySelector('.btn-main');
    btn.innerText = "SYNCHRONISIERE NEURAL CORES...";
    
    setTimeout(() => {
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('app-interface').classList.remove('hidden');
        initClock();
        loadModule('tactics');
        updateGlobalHUD();
    }, 1200);
}

function initClock() {
    setInterval(() => {
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE');
    }, 1000);
}

// --- 3. MODULE ROUTER ---
function loadModule(name) {
    const stage = document.getElementById('stage-content');
    NCOS.state.activeModule = name;
    
    // Update Sidebar
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(name));
    });
    
    document.getElementById('active-mod-name').innerText = "// " + name.toUpperCase();

    // Render Logic
    if (name === 'tactics') renderTactics(stage);
    if (name === 'manager') renderManager(stage);
    if (name === 'nlz') renderNLZ(stage);
    if (name === 'press') renderPress(stage);
    if (name === 'video') renderVideo(stage);
}

// --- 4. TACTICAL CO-PILOT (VECTOR ENGINE) ---
function renderTactics(target) {
    target.innerHTML = `
        <div style="padding:20px; height:100%; display:flex; flex-direction:column;">
            <div style="margin-bottom:15px; display:flex; justify-content:space-between;">
                <h2 style="font-family:var(--font-ui)">TACTICAL VECTOR ENGINE V1.0</h2>
                <div style="display:flex; gap:10px;">
                    <button class="btn-main" style="width:auto; padding:5px 15px;" onclick="addEquipment()">+ HÜTCHEN</button>
                    <button class="btn-main" style="width:auto; padding:5px 15px; border-color:var(--neon-gold);" onclick="generateAIScheme()">AI PLANNING</button>
                </div>
            </div>
            <div class="pitch-container" id="pitch-main">
                <svg id="vector-layer" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:5;">
                    </svg>
                ${NCOS.tactics.players.map(p => `
                    <div class="player-dot team-home" style="left:${p.x}%; top:${p.y}%;" onmousedown="initDrag(event, ${p.id})">
                        ${p.label}
                    </div>
                `).join('')}
                ${NCOS.tactics.equipment.map(e => `
                    <div class="equipment-icon" style="left:${e.x}%; top:${e.y}%;"></div>
                `).join('')}
            </div>
        </div>
    `;
    drawVectors();
}

function drawVectors() {
    const svg = document.getElementById('vector-layer');
    if(!svg) return;
    svg.innerHTML = NCOS.tactics.vectors.map(v => `
        <line x1="${v.fromX}%" y1="${v.fromY}%" x2="${v.toX}%" y2="${v.toY}%" 
              class="vector-path" 
              style="stroke:${v.type === 'run' ? 'var(--path-vector)' : 'var(--pass-vector)'}" />
        <circle cx="${v.toX}%" cy="${v.toY}%" r="4" fill="white" />
    `).join('');
}

// --- 5. MANAGER ERP ENGINE ---
function renderManager(target) {
    target.innerHTML = `
        <div style="padding:40px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                <h1 style="font-family:var(--font-ui)">FINANCIAL OPERATING SYSTEM</h1>
                <button class="btn-main" style="width:auto; padding:10px 30px;" onclick="generateAILetter()">KI-VERTRAG ERSTELLEN</button>
            </div>
            <table class="manager-ledger">
                <thead><tr><th>DATUM</th><th>TRANSAKTION</th><th>KATEGORIE</th><th>BETRAG</th></tr></thead>
                <tbody>
                    ${NCOS.finance.map(f => `
                        <tr>
                            <td>${f.date}</td>
                            <td>${f.desc}</td>
                            <td><span style="color:#666; font-size:10px;">${f.cat.toUpperCase()}</span></td>
                            <td style="color:${f.val > 0 ? 'var(--neon-cyan)' : 'var(--neon-alert)'}">${f.val.toLocaleString()} €</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// --- 6. NLZ ACADEMY HUB (PANINI) ---
function renderNLZ(target) {
    target.innerHTML = `
        <div style="padding:40px;">
            <div style="text-align:center; margin-bottom:40px;">
                <div class="luxury-logo" style="font-size:32px;">TONI 2.0 ERINNERUNGSALBUM</div>
                <p style="color:#666; font-family:var(--font-ui); font-size:10px; letter-spacing:3px;">NACHWUCHSLEISTUNGSZENTRUM OFFICIAL</p>
            </div>
            <div class="panini-album">
                ${NCOS.academy.players.map(p => `
                    <div class="panini-card" onclick="openPlayerDev(${p.id})">
                        <div style="padding:20px;">
                            <div style="display:flex; justify-content:space-between;">
                                <span style="font-family:var(--font-ui); color:var(--neon-gold);">${p.age}</span>
                                <span style="color:var(--path-vector)">${p.dev}</span>
                            </div>
                            <div style="text-align:center; margin:20px 0;">
                                <i class="fa-solid fa-user-graduate" style="font-size:50px; color:#222;"></i>
                            </div>
                            <div style="text-align:center; font-family:var(--font-ui); margin-bottom:15px;">${p.name}</div>
                            <div style="font-size:10px; color:#555; background:rgba(0,0,0,0.3); padding:10px; border-radius:5px;">
                                KI-EVOLUTION: <br> ${p.aiReview}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- 7. PRESS STATION (A4 ENGINE) ---
function renderPress(target) {
    target.innerHTML = `
        <div class="press-office-workspace">
            <div style="width:297mm; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div style="color:#fff; font-family:var(--font-ui);">MAGAZIN EDITOR // SEITEN: ${NCOS.press.pages}</div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-main" style="width:auto; padding:5px 20px;" onclick="addPressPages()">+ 4 SEITEN</button>
                    <button class="btn-main" style="width:auto; padding:5px 20px; border-color:white; color:white;" onclick="window.print()">JETZT DRUCKEN</button>
                </div>
            </div>
            <div class="magazine-page">
                <div class="magazine-content" style="border-right:1px solid #eee;">
                    <div class="luxury-logo" style="font-size:40px; margin-bottom:50px;">TONI 2.0</div>
                    <h1 contenteditable="true">HEIMSPIEL</h1>
                    <p style="margin-top:20px; font-size:18px;" contenteditable="true">Gegen den Rivalen geht es heute um alles. Die KI analysiert den Gegner...</p>
                </div>
                <div class="magazine-content">
                    <h2 style="font-size:30px; border-bottom:2px solid #000;" contenteditable="true">DIE ANALYSE</h2>
                    <div style="height:200px; background:#f0f0f0; margin:20px 0; display:flex; align-items:center; justify-content:center; color:#ccc;">
                        [PLATZHALTER: KI-HEATMAP]
                    </div>
                    <p contenteditable="true">Unsere Mannschaft ist bereit. Die Taktik wurde im Broadcast Lab verfeinert.</p>
                </div>
            </div>
        </div>
    `;
}

// --- 8. AI BROADCAST LAB ---
function renderVideo(target) {
    target.innerHTML = `
        <div style="padding:40px; height:100%; display:flex; flex-direction:column;">
            <div style="display:flex; gap:20px; flex:1;">
                <div style="flex:2; background:#000; border:1px solid #222; position:relative;">
                    <video id="broadcast-video" style="width:100%; height:100%; object-fit:contain;"></video>
                    <canvas id="telestrator" style="position:absolute; inset:0; width:100%; height:100%; cursor:crosshair;"></canvas>
                </div>
                <div style="flex:1; background:var(--bg-panel); border:1px solid #222; padding:20px;">
                    <h4 style="font-family:var(--font-ui); margin-bottom:15px;">KI-VIDEO ANALYSE</h4>
                    <div id="ai-video-log" style="font-size:12px; color:#666;">
                        Warte auf Szenen-Upload...
                    </div>
                    <button class="btn-main" style="margin-top:20px;" onclick="document.getElementById('vid-load').click()">LADE SZENE</button>
                    <input type="file" id="vid-load" hidden onchange="loadBroadcast(this)">
                </div>
            </div>
        </div>
    `;
    initTelestrator();
}

// --- UTILS & HELPERS ---
function updateGlobalHUD() {
    document.getElementById('budget-display').innerText = NCOS.state.budget.toLocaleString() + " €";
}

function toggleMic() {
    NCOS.state.isMicActive = !NCOS.state.isMicActive;
    const btn = document.getElementById('mic-btn');
    btn.classList.toggle('active', NCOS.state.isMicActive);
    const log = document.getElementById('ai-log');
    if(NCOS.state.isMicActive) {
        log.innerHTML = `<div class="ai-message" style="color:var(--neon-cyan)">Höre zu... Analysiere Trainings-Parameter...</div>`;
    }
}

function initDrag(e, id) {
    // Drag Logik hier einfügen (wie in V17)
}

function addPressPages() {
    NCOS.press.pages += 4;
    loadModule('press');
}

function generateAIScheme() {
    alert("KI berechnet optimale Laufwege basierend auf Gegner-Recherche...");
    NCOS.tactics.vectors.push({ fromX: 10, fromY: 65, toX: 50, toY: 50, type: 'run' });
    drawVectors();
}

// Canvas Painting für Video
function initTelestrator() {
    const c = document.getElementById('telestrator');
    if(!c) return;
    const ctx = c.getContext('2d');
    ctx.strokeStyle = '#00f3ff'; ctx.lineWidth = 3;
    let paint = false;
    c.onmousedown = (e) => { paint = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
    c.onmousemove = (e) => { if(paint) { ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke(); } };
    c.onmouseup = () => paint = false;
}

function loadBroadcast(input) {
    const v = document.getElementById('broadcast-video');
    v.src = URL.createObjectURL(input.files[0]);
    v.play();
}
