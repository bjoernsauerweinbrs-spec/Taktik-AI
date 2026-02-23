/* ==========================================================================
   TONI 2.0 | NEURAL ELITE ENGINE CORE (V10.1 - THE TEAM BRAIN)
   ========================================================================== */

// 1. KONFIGURATION & DATENBANK
let USER_API_KEY = localStorage.getItem('toni_api_key') || "";
const GITHUB_REPO_URL = "https://raw.githubusercontent.com/bjoernsauerweinbrs-spec/Taktik-AI/refs/heads/main/vereinsdaten.json";

// ZENTRALER STATE (Der "RAM" des Systems)
const eliteStore = {
    players: [], // Wird jetzt von GitHub geladen
    calendar: JSON.parse(localStorage.getItem('toni_calendar')) || [
        { id: 1, day: 1, time: "10:00", title: "Laktattest", type: "physio", attendance: [] },
        { id: 2, day: 1, time: "15:00", title: "Team-Training", type: "training", attendance: [] },
        { id: 3, day: 5, time: "15:30", title: "Ligaspiel vs. BVB", type: "match", attendance: [] }
    ],
    mgmt: {
        liquidAssets: 12500000,
        infrastructure: { medicalLevel: 4, analysisLevel: 5 },
        liveData: { temp: "--", condition: "Lade...", wind: "--" }
    },
    activeModule: 'kader' // Start-Modul
};

/* ==========================================================================
   2. SYSTEM BOOT & NETWORK
   ========================================================================== */

function systemBootSequence() {
    const pass = document.getElementById('sys-pass').value;
    if (pass === "1234") { 
        document.getElementById('auth-layer').classList.add('hidden');
        document.getElementById('main-interface').classList.remove('hidden');
        initEliteCore();
    } else {
        alert("ACCESS DENIED: SECURITY PROTOCOL ACTIVE");
    }
}

async function initEliteCore() {
    console.log("TONI 2.0: Booting Neural Core...");
    
    // 1. Uhrzeit starten
    updateClock(); 
    setInterval(updateClock, 1000);
    
    // 2. KI Status
    checkAIConnection();
    
    // 3. GitHub Daten laden (Das "Gehirn" synchronisieren)
    await syncWithGitHub();

    // 4. Wetter laden
    fetchWeatherData();
    
    // 5. Erstes Modul rendern
    loadModule(eliteStore.activeModule);
    voiceEngine.init();
}

// NEU: Daten von GitHub holen
async function syncWithGitHub() {
    try {
        const response = await fetch(GITHUB_REPO_URL);
        if (!response.ok) throw new Error("GitHub nicht erreichbar");
        
        const data = await response.json();
        
        // Wir nehmen 'kader_toni' aus der JSON und speichern es im RAM
        if(data.kader_toni) {
            eliteStore.players = data.kader_toni;
            console.log("✅ GITHUB: Kader synchronisiert (" + eliteStore.players.length + " Spieler)");
        }
        
        // Optional: Budget übernehmen
        if(data.config && data.config.budget) {
            eliteStore.mgmt.liquidAssets = data.config.budget;
        }

        updateKPIs();

    } catch (error) {
        console.error("❌ GITHUB FEHLER:", error);
        alert("OFFLINE MODE: Konnte keine Daten von GitHub laden. Nutze lokalen Cache.");
        // Fallback: Lokale Daten nutzen falls vorhanden
        const local = localStorage.getItem('toni_players_backup');
        if(local) eliteStore.players = JSON.parse(local);
    }
}

/* ==========================================================================
   3. MODULE CONTROLLER
   ========================================================================== */

function loadModule(modId) {
    eliteStore.activeModule = modId;
    const viewport = document.getElementById('content-viewport');
    const vrViewport = document.getElementById('vr-viewport');
    
    // UI Cleanup
    viewport.classList.remove('hidden');
    vrViewport.classList.add('hidden');
    document.querySelectorAll('.nav-content button').forEach(b => b.classList.remove('active'));
    
    // Routing
    if(modId === 'kader') renderDynamicSquad();
    if(modId === 'finance') renderFinanceLab();
    if(modId === 'stadionzeitung') renderNewspaperCMS();
    if(modId === 'drills') renderCalendar(); // Kalender
    
    if(modId === 'tactics') { 
        renderTacticBoard(); 
        setTimeout(tacticsCore.init, 100); 
    }

    if(modId === 'vr-hub') { 
        viewport.classList.add('hidden'); 
        vrViewport.classList.remove('hidden'); 
        initVRHub(); 
    }
}

/* ==========================================================================
   4. KADER & LABOR ENGINE (3D CARDS)
   ========================================================================== */

function renderDynamicSquad() {
    const viewport = document.getElementById('content-viewport');
    
    // Header
    let html = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-family:var(--font-hud); color:white;">KADER & LABOR ANALYSE</h2>
        <div style="font-size:10px; color:var(--text-dim);">DATENQUELLE: GITHUB RAW</div>
        <button class="btn-save" onclick="openPlayerEditor(-1)">+ NEUER SPIELER</button>
    </div>
    <div class="kader-grid">`;

    // Karten Loop
    eliteStore.players.forEach(p => {
        // Fallback für fehlende Datenstrukturen (falls JSON unvollständig)
        const stats = p.fifa_stats || { pac:0, sho:0, pas:0, dri:0, def:0, phy:0 };
        const lab = p.labor_daten || { waage: { gewicht:0, kfa:0 }, uhr: { ruhepuls:0 } };
        const status = p.status || { im_kader: true, im_training: true };
        const img = p.img_url || "https://cdn-icons-png.flaticon.com/512/21/21104.png"; // Placeholder Bild

        html += `
        <div class="fifa-card" onclick="this.classList.toggle('flipped')">
            <div class="card-inner">
                
                <div class="card-front">
                    <div class="card-rating">${p.rating || 75}</div>
                    <img src="${img}" class="player-img" alt="${p.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/21/21104.png'">
                    
                    <div class="card-info">
                        <div class="card-name">${p.name}</div>
                        <div class="card-pos">${p.position}</div>
                        
                        <div class="stats-grid">
                            <div class="stat-row"><span class="stat-label">PAC</span><span class="stat-val">${stats.pac || stats.div || 0}</span></div>
                            <div class="stat-row"><span class="stat-label">SHO</span><span class="stat-val">${stats.sho || stats.han || 0}</span></div>
                            <div class="stat-row"><span class="stat-label">PAS</span><span class="stat-val">${stats.pas || stats.kic || 0}</span></div>
                            <div class="stat-row"><span class="stat-label">DRI</span><span class="stat-val">${stats.dri || stats.ref || 0}</span></div>
                        </div>
                    </div>
                </div>

                <div class="card-back" onclick="event.stopPropagation()">
                    <div class="lab-header">MEDIZIN & LABOR</div>
                    
                    <div class="lab-group">
                        <span class="lab-label">Körperanalyse (kg / KFA)</span>
                        <div style="display:flex; gap:5px;">
                            <input type="number" class="lab-input" value="${lab.waage.gewicht}" onchange="updateLabData(${p.id}, 'weight', this.value)">
                            <input type="number" class="lab-input" value="${lab.waage.kfa}" onchange="updateLabData(${p.id}, 'kfa', this.value)">
                        </div>
                    </div>

                    <div class="lab-group">
                        <span class="lab-label">Fitness Tracker (Ruhepuls)</span>
                        <input type="number" class="lab-input" value="${lab.uhr.ruhepuls}" onchange="updateLabData(${p.id}, 'puls', this.value)">
                    </div>

                    <div class="lab-toggles">
                        <button class="toggle-btn ${status.im_kader ? 'active' : ''}" onclick="toggleStatus(${p.id}, 'kader')">KADER</button>
                        <button class="toggle-btn ${status.im_training ? 'active' : 'absent'}" onclick="toggleStatus(${p.id}, 'training')">TRAINING</button>
                    </div>

                    <div class="card-actions">
                        <button class="action-btn btn-save-card" onclick="voiceEngine.speak('Daten für ${p.name} aktualisiert.')">UPDATE</button>
                        <button class="action-btn btn-delete-card" onclick="alert('Löschen via GitHub JSON erforderlich.')"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>

            </div>
        </div>`;
    });

    html += `</div>`;
    viewport.innerHTML = html;
}

// Funktionen für die Rückseite der Karte
function updateLabData(id, type, val) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    
    // Datenstruktur sicherstellen
    if(!p.labor_daten) p.labor_daten = { waage: {}, uhr: {} };

    if(type === 'weight') p.labor_daten.waage.gewicht = parseFloat(val);
    if(type === 'kfa') p.labor_daten.waage.kfa = parseFloat(val);
    if(type === 'puls') p.labor_daten.uhr.ruhepuls = parseInt(val);
    
    // Lokal speichern (Backup)
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    console.log(`📝 LABOR: ${p.name} -> ${type}: ${val}`);
}

function toggleStatus(id, type) {
    const p = eliteStore.players.find(x => x.id === id);
    if(!p) return;
    if(!p.status) p.status = { im_kader: true, im_training: true };

    if(type === 'kader') p.status.im_kader = !p.status.im_kader;
    if(type === 'training') p.status.im_training = !p.status.im_training;
    
    // UI neu laden um Farben zu aktualisieren
    renderDynamicSquad(); 
}

/* ==========================================================================
   5. CALENDAR & ORGA (V10.0)
   ========================================================================== */

function renderCalendar() {
    const viewport = document.getElementById('content-viewport');
    const days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
    const todayIndex = (new Date().getDay() + 6) % 7; 

    let gridHtml = days.map((day, index) => {
        const dayEvents = eliteStore.calendar.filter(e => e.day === index).sort((a,b) => a.time.localeCompare(b.time));
        
        let eventsHtml = dayEvents.map(e => {
            const attendingCount = e.attendance ? e.attendance.filter(a => a.present).length : 0;
            return `
            <div class="cal-event type-${e.type}" onclick="openAttendance(${e.id})">
                <div style="font-weight:bold;">${e.time}</div>
                <div>${e.title}</div>
                <div class="attendance-badge"><i class="fa-solid fa-users"></i> ${attendingCount}</div>
            </div>`;
        }).join('');

        return `<div class="cal-day ${index === todayIndex ? 'today' : ''}"><div class="cal-day-header">${day}</div><div style="flex:1; overflow-y:auto;">${eventsHtml}</div></div>`;
    }).join('');

    viewport.innerHTML = `
        <div class="calendar-wrapper">
            <div class="cal-header">
                <h2 style="font-family:var(--font-hud);">WOCHENPLANUNG (KW ${getWeekNumber(new Date())})</h2>
                <button class="btn-save" onclick="document.getElementById('modal-event-create').classList.remove('hidden')">+ TERMIN</button>
            </div>
            <div class="cal-grid">${gridHtml}</div>
        </div>`;
}

function createEvent() {
    const title = document.getElementById('evt-title').value;
    const day = parseInt(document.getElementById('evt-day').value);
    const time = document.getElementById('evt-time').value;
    const type = document.getElementById('evt-type').value;

    if(title) {
        const initialAttendance = eliteStore.players.map(p => ({ playerId: p.id, present: false }));
        eliteStore.calendar.push({ id: Date.now(), day, time, title, type, attendance: initialAttendance });
        
        localStorage.setItem('toni_calendar', JSON.stringify(eliteStore.calendar));
        renderCalendar();
        closeModal('modal-event-create');
        voiceEngine.speak("Termin erstellt.");
    }
}

function openAttendance(eventId) {
    const evt = eliteStore.calendar.find(e => e.id === eventId);
    if(!evt) return;
    document.getElementById('modal-attendance').classList.remove('hidden');
    document.getElementById('att-evt-title').innerText = evt.title;
    document.getElementById('att-evt-id').value = evt.id;

    const list = document.getElementById('attendance-list');
    list.innerHTML = eliteStore.players.map(p => {
        const status = evt.attendance ? evt.attendance.find(a => a.playerId === p.id) : null;
        return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid #333;">
            <span>${p.name}</span>
            <input type="checkbox" class="att-check" data-pid="${p.id}" ${status && status.present ? 'checked' : ''} style="width:20px; height:20px;">
        </div>`;
    }).join('');
}

function saveAttendance() {
    const eventId = parseInt(document.getElementById('att-evt-id').value);
    const evt = eliteStore.calendar.find(e => e.id === eventId);
    const checks = document.querySelectorAll('.att-check');
    const newAttendance = [];
    checks.forEach(c => newAttendance.push({ playerId: parseInt(c.dataset.pid), present: c.checked }));

    evt.attendance = newAttendance;
    localStorage.setItem('toni_calendar', JSON.stringify(eliteStore.calendar));
    renderCalendar();
    closeModal('modal-attendance');
    voiceEngine.speak("Anwesenheit gespeichert.");
}

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
}

/* ==========================================================================
   6. TACTICS BOARD (PRO CANVAS)
   ========================================================================== */

const tacticsCore = {
    canvas: null, ctx: null, mode: 'move', isDrawing: false, elements: [], drawingPath: [],
    
    init: function() {
        this.canvas = document.getElementById('tactics-canvas');
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const container = document.querySelector('.tactics-stage');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        this.canvas.addEventListener('mousedown', (e) => this.startAction(e));
        this.canvas.addEventListener('mousemove', (e) => this.moveAction(e));
        this.canvas.addEventListener('mouseup', (e) => this.endAction(e));
        
        // Initial 11 Spieler aufstellen (wenn leer)
        if(this.elements.length === 0) {
            // Wir nehmen die ersten 11 aus dem GitHub Kader
            eliteStore.players.slice(0, 11).forEach(p => this.addPlayerToBoard(p.id));
        }

        this.renderLoop();
    },

    setMode: function(newMode) {
        this.mode = newMode;
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`btn-${newMode}`).classList.add('active');
    },

    addPlayerToBoard: function(playerId) {
        const p = eliteStore.players.find(x => x.id === playerId);
        if(!p) return;
        this.elements.push({
            type: 'player', id: p.id, label: p.number || "?", name: p.name,
            x: this.canvas.width / 2 + (Math.random() * 60 - 30),
            y: this.canvas.height / 2 + (Math.random() * 60 - 30),
            color: '#ef4444', radius: 14, isDragging: false
        });
        this.renderLoop();
    },

    startAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.mode === 'move') {
            this.elements.forEach(el => {
                if(el.type === 'player') {
                    const dist = Math.sqrt((x - el.x) ** 2 + (y - el.y) ** 2);
                    if (dist < el.radius + 10) el.isDragging = true;
                }
            });
        } else if (this.mode === 'draw') {
            this.isDrawing = true;
            this.drawingPath = [{x, y}];
        }
    },

    moveAction: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (this.mode === 'move') {
            this.elements.forEach(el => { if (el.isDragging) { el.x = x; el.y = y; } });
            this.renderLoop();
        } else if (this.mode === 'draw' && this.isDrawing) {
            this.drawingPath.push({x, y});
            this.renderLoop();
        }
    },

    endAction: function(e) {
        if (this.mode === 'move') {
            this.elements.forEach(el => el.isDragging = false);
        } else if (this.mode === 'draw' && this.isDrawing) {
            this.isDrawing = false;
            this.elements.push({ type: 'path', points: [...this.drawingPath], color: '#ffff00', width: 3 });
            this.drawingPath = [];
            this.renderLoop();
        }
    },

    clearBoard: function() { this.elements = []; this.renderLoop(); },
    exportImage: function() {
        const link = document.createElement('a');
        link.download = 'toni-matchplan.png';
        link.href = this.canvas.toDataURL();
        link.click();
    },

    renderLoop: function() {
        if(!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Pfade
        this.elements.filter(e => e.type === 'path').forEach(path => {
            this.ctx.beginPath();
            this.ctx.strokeStyle = path.color;
            this.ctx.lineWidth = path.width;
            if(path.points.length > 0) {
                this.ctx.moveTo(path.points[0].x, path.points[0].y);
                path.points.forEach(p => this.ctx.lineTo(p.x, p.y));
                this.ctx.stroke();
            }
        });

        // Live Drawing
        if (this.isDrawing && this.drawingPath.length > 0) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 3;
            this.ctx.moveTo(this.drawingPath[0].x, this.drawingPath[0].y);
            this.drawingPath.forEach(p => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
        }

        // Spieler
        this.elements.filter(e => e.type === 'player').forEach(p => {
            this.ctx.beginPath(); this.ctx.arc(p.x+2, p.y+2, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)'; this.ctx.fill();

            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color; this.ctx.fill();
            this.ctx.strokeStyle = '#fff'; this.ctx.lineWidth = 2; this.ctx.stroke();
            
            this.ctx.fillStyle = '#fff'; this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.label, p.x, p.y);
            
            this.ctx.fillStyle = '#ccc'; this.ctx.font = '9px Arial';
            this.ctx.fillText(p.name, p.x, p.y + p.radius + 12);
        });
    }
};

function renderTacticBoard() {
    const viewport = document.getElementById('content-viewport');
    let squadHtml = eliteStore.players.map(p => `
        <div class="draggable-player" onclick="tacticsCore.addPlayerToBoard(${p.id})">
            <span><b>${p.position}</b> ${p.name}</span>
            <i class="fa-solid fa-plus-circle" style="color:var(--neon-main)"></i>
        </div>`).join('');

    viewport.innerHTML = `
        <div class="tactics-wrapper">
            <aside class="tactics-sidebar">
                <h3 style="color:var(--neon-main); font-family:var(--font-hud); font-size:12px;">WERKZEUGE</h3>
                <div class="tool-btn active" id="btn-move" onclick="tacticsCore.setMode('move')"><i class="fa-solid fa-arrows-up-down-left-right"></i> VERSCHIEBEN</div>
                <div class="tool-btn" id="btn-draw" onclick="tacticsCore.setMode('draw')"><i class="fa-solid fa-pen"></i> ZEICHNEN</div>
                <div class="tool-btn" onclick="tacticsCore.clearBoard()"><i class="fa-solid fa-trash"></i> BOARD LÖSCHEN</div>
                <div class="tool-btn" onclick="tacticsCore.exportImage()"><i class="fa-solid fa-file-export"></i> EXPORT PNG</div>
                <hr style="border-color:#333; width:100%;">
                <div class="analysis-sheet">
                    <h3 style="color:#aaa; font-family:var(--font-hud); font-size:10px; margin-bottom:5px;">MATCHPLAN NOTIZEN</h3>
                    <textarea style="width:100%; height:120px; background:rgba(0,0,0,0.5); color:white; border:1px solid #333; font-size:11px; padding:8px;"></textarea>
                </div>
            </aside>
            <div class="tactics-stage"><canvas id="tactics-canvas"></canvas></div>
            <aside class="tactics-sidebar squad-list">
                <h3 style="color:var(--neon-blue); font-family:var(--font-hud); font-size:12px;">KADER</h3>
                <div style="margin-top:10px;">${squadHtml}</div>
            </aside>
        </div>`;
}

/* ==========================================================================
   7. UTILS & FINANCE
   ========================================================================== */

function renderFinanceLab() {
    const m = eliteStore.mgmt;
    document.getElementById('content-viewport').innerHTML = `
        <div class="mgmt-dashboard">
            <div class="mgmt-card">
                <h3>LIVE UMWELTDATEN</h3>
                <div class="roi-indicator">${m.liveData.temp}°C</div>
                <div style="color:${m.liveData.condition.includes('Regen') ? 'red' : 'var(--neon-main)'}">${m.liveData.condition} / Wind: ${m.liveData.wind} km/h</div>
            </div>
            <div class="mgmt-card">
                <h3>VEREINSKONTO</h3>
                <div class="roi-indicator">${m.liquidAssets.toLocaleString()} €</div>
                <div style="font-size:10px; color:#aaa; margin-top:10px;">AKTUELLES BUDGET</div>
            </div>
        </div>`;
}

function renderNewspaperCMS() {
    document.getElementById('content-viewport').innerHTML = `
        <div class="newspaper-wrapper" style="background:white; color:black; padding:40px;">
            <h1 style="font-family:serif; border-bottom:2px solid black;">RB LEIPZIG UPDATE</h1>
            <p><strong>Wetter-Prognose:</strong> Bei ${eliteStore.mgmt.liveData.temp}°C wird ein schnelles Spiel erwartet.</p>
            <p><strong>Finanzen:</strong> Der Verein verfügt über liquide Mittel von ${eliteStore.mgmt.liquidAssets.toLocaleString()} €.</p>
            <button class="btn-save" style="background:black; color:white; margin-top:20px;" onclick="window.print()">DRUCKEN</button>
        </div>`;
}

// Player Editor Modal Logic (Create/Edit)
function openPlayerEditor(id) {
    if(id === -1) {
        // Create Mode
        document.getElementById('edit-p-id').value = -1;
        document.getElementById('edit-p-name').value = "";
        document.getElementById('edit-p-pos').value = "";
        document.getElementById('edit-p-rating').value = "";
        document.getElementById('edit-p-img').value = "";
    } else {
        // Edit Mode
        const p = eliteStore.players.find(x => x.id === id);
        if (!p) return;
        document.getElementById('edit-p-id').value = p.id;
        document.getElementById('edit-p-name').value = p.name;
        document.getElementById('edit-p-pos').value = p.position;
        document.getElementById('edit-p-rating').value = p.rating;
        document.getElementById('edit-p-img').value = p.img_url;
    }
    document.getElementById('modal-player-editor').classList.remove('hidden');
}

function savePlayerChanges() {
    const id = parseInt(document.getElementById('edit-p-id').value);
    const name = document.getElementById('edit-p-name').value;
    const pos = document.getElementById('edit-p-pos').value;
    const rating = parseInt(document.getElementById('edit-p-rating').value);
    const img = document.getElementById('edit-p-img').value;

    if(id === -1) {
        // Neuen Spieler anlegen
        const newId = eliteStore.players.length > 0 ? Math.max(...eliteStore.players.map(p=>p.id)) + 1 : 1;
        eliteStore.players.push({
            id: newId, name, position: pos, rating, img_url: img,
            status: { im_kader: true, im_training: true },
            labor_daten: { waage: { gewicht: 80, kfa: 10 }, uhr: { ruhepuls: 50 } }
        });
    } else {
        // Update
        const p = eliteStore.players.find(x => x.id === id);
        if (p) {
            p.name = name; p.position = pos; p.rating = rating; p.img_url = img;
        }
    }
    // Lokal speichern (GitHub kann client-seitig nicht überschrieben werden)
    localStorage.setItem('toni_players_backup', JSON.stringify(eliteStore.players));
    loadModule('kader');
    closeModal('modal-player-editor');
}

// SYSTEM HELPERS
function updateClock() { document.getElementById('clock-display').innerText = new Date().toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'}); }
function updateKPIs() { document.getElementById('kpi-budget').innerText = eliteStore.mgmt.liquidAssets.toLocaleString() + " €"; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
async function fetchWeatherData() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.8333&longitude=9.4&current_weather=true");
        const data = await response.json();
        eliteStore.mgmt.liveData.temp = data.current_weather.temperature;
        eliteStore.mgmt.liveData.wind = data.current_weather.windspeed;
        let cond = "Stabil";
        if(data.current_weather.weathercode > 3) cond = "Bewölkt";
        if(data.current_weather.weathercode > 50) cond = "Regen";
        eliteStore.mgmt.liveData.condition = cond;
    } catch (e) { console.warn("Wetter Fehler"); }
}

// AI & VOICE
function openSysConfig() {
    document.getElementById('modal-sys-config').classList.remove('hidden');
    const statusDiv = document.getElementById('key-status-display');
    const input = document.getElementById('input-api-key');
    if(USER_API_KEY && USER_API_KEY.length > 10) {
        input.value = "********************";
        statusDiv.innerText = "VERBUNDEN (GESPEICHERT)";
        statusDiv.style.color = "var(--neon-main)";
    } else {
        input.value = "";
        statusDiv.innerText = "NICHT VERBUNDEN";
        statusDiv.style.color = "var(--neon-alert)";
    }
}
function saveSystemConfig() {
    const input = document.getElementById('input-api-key').value;
    if(input && input.startsWith("sk-")) {
        localStorage.setItem('toni_api_key', input);
        USER_API_KEY = input;
        alert("Neural Link hergestellt. Toni ist jetzt online.");
        closeModal('modal-sys-config');
        checkAIConnection();
    } else if (input.includes("***")) { closeModal('modal-sys-config'); }
    else { alert("Ungültiges Format."); }
}
function clearSystemConfig() {
    localStorage.removeItem('toni_api_key');
    USER_API_KEY = "";
    document.getElementById('input-api-key').value = "";
    alert("Key gelöscht.");
    openSysConfig();
    checkAIConnection();
}
function checkAIConnection() {
    const visualizer = document.getElementById('ai-status-text');
    if(USER_API_KEY) {
        visualizer.innerText = "NEURAL LINK: ONLINE (GPT-4)";
        visualizer.style.color = "var(--neon-main)";
    } else {
        visualizer.innerText = "NEURAL LINK: OFFLINE (SIMULATION)";
        visualizer.style.color = "var(--neon-warn)";
    }
}
const aiAgent = {
    ask: async function(prompt) {
        addChatMessage("USER", prompt);
        if(!USER_API_KEY) {
            setTimeout(() => {
                let reply = "Ich laufe im Simulations-Modus. Bitte API Key hinterlegen.";
                if(prompt.toLowerCase().includes("wetter")) reply = `Live-Daten: ${eliteStore.mgmt.liveData.temp}°C, ${eliteStore.mgmt.liveData.condition}.`;
                voiceEngine.speak(reply);
            }, 600);
            return;
        }
        try {
            const systemContext = `Du bist Toni, ein Elite-Co-Trainer. Wetter: ${eliteStore.mgmt.liveData.temp}°C.`;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${USER_API_KEY}` },
                body: JSON.stringify({ model: "gpt-4", messages: [{role: "system", content: systemContext}, {role: "user", content: prompt}], temperature: 0.7 })
            });
            const data = await response.json();
            if(data.error) throw new Error(data.error.message);
            voiceEngine.speak(data.choices[0].message.content);
        } catch (error) { addChatMessage("SYSTEM", "KI Fehler: " + error.message); }
    }
};
const voiceEngine = {
    init: function() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (window.SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => aiAgent.ask(e.results[e.results.length - 1][0].transcript);
        }
    },
    speak: function(text) {
        const u = new SpeechSynthesisUtterance(text); u.lang = 'de-DE';
        window.speechSynthesis.speak(u);
        addChatMessage("TONI AI", text);
    },
    toggle: function() { if(this.recognition) this.recognition.start(); }
};
function askToni() {
    const input = document.getElementById('toni-input');
    if(input.value.trim() === "") return;
    aiAgent.ask(input.value);
    input.value = "";
}
function addChatMessage(sender, text) {
    const s = document.getElementById('chat-stream');
    s.innerHTML += `<div class="msg ${sender==='USER'?'user':'ai'}"><div class="msg-header">${sender}</div><div class="msg-body">${text}</div></div>`;
    s.scrollTop = s.scrollHeight;
}

// VR STUBS
function initVRHub() { 
    const container = document.getElementById('match-simulation-layer');
    if(container) container.innerHTML = '<a-text value="VR MODUL - BITTE HEADSET AUFSETZEN" position="-2 1.6 -3" color="white"></a-text>';
}
function exitVRMode() { loadModule('kader'); }
