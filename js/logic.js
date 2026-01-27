/**
 * Toni 2.0 - Elite Logic Center (Aktentasche & Archiv)
 */

let squad = [];

// Tab-Steuerung innerhalb der Aktentasche
window.loadTabContent = function(tab) {
    const area = document.getElementById('tab-content-area');
    area.innerHTML = ""; // Clear

    switch(tab) {
        case 'kader': renderKader(area); break;
        case 'analyse': renderAnalyse(area); break;
        case 'match': renderMatch(area); break;
        case 'training': renderTraining(area); break;
    }
};

// 1. KADER-VERWALTUNG (Mit optionalen Daten)
function renderKader(area) {
    area.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2>Kader-Management</h2>
            <button class="btn-send" style="width:auto; padding:10px 20px;" onclick="addPlayerElite()">+ SPIELER HINZUFÜGEN</button>
        </div>
        <div id="player-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap:15px;"></div>
    `;
    updatePlayerList();
}

function addPlayerElite() {
    const name = prompt("Name des Spielers:");
    if(!name) return;
    const nr = prompt("Trikotnummer:");
    const pos = prompt("Position (TW, IV, MF, ST):");
    const h = prompt("Größe in m (Optional - z.B. 1.85):");
    const w = prompt("Gewicht in kg (Optional):");

    const player = {
        id: "p" + Date.now(),
        name: name,
        nr: nr || "?",
        pos: pos || "Feld",
        h: h ? parseFloat(h) : null,
        w: w ? parseFloat(w) : null,
        status: 'green' // Ampel: green, yellow, red
    };
    squad.push(player);
    updatePlayerList();
}

function updatePlayerList() {
    const grid = document.getElementById('player-grid');
    if(!grid) return;
    grid.innerHTML = "";
    
    squad.forEach(p => {
        const bmi = (p.h && p.w) ? (p.w / (p.h * p.h)).toFixed(1) : "N/A";
        const card = document.createElement('div');
        card.className = "card";
        card.style = "background:#0d1117; border:1px solid #30363d; padding:15px; border-radius:12px; position:relative;";
        card.innerHTML = `
            <div style="font-size:20px; font-weight:900; color:var(--ginga-green);">#${p.nr}</div>
            <div style="font-weight:bold; margin:5px 0;">${p.name} <span style="font-size:12px; color:#8b949e;">(${p.pos})</span></div>
            <div style="font-size:11px; color:#8b949e;">BMI: ${bmi} ${bmi === 'N/A' ? '(Daten fehlen)' : ''}</div>
            
            <div style="display:flex; gap:10px; margin-top:15px;">
                <div onclick="setPlayerStatus('${p.id}', 'green')" style="width:20px; height:20px; border-radius:50%; cursor:pointer; background:${p.status==='green'?'#2ecc71':'#030'}; border:1px solid white;"></div>
                <div onclick="setPlayerStatus('${p.id}', 'yellow')" style="width:20px; height:20px; border-radius:50%; cursor:pointer; background:${p.status==='yellow'?'#f1c40f':'#330'}; border:1px solid white;"></div>
                <div onclick="setPlayerStatus('${p.id}', 'red')" style="width:20px; height:20px; border-radius:50%; cursor:pointer; background:${p.status==='red'?'#f85149':'#300'}; border:1px solid white;"></div>
            </div>
            <button onclick="removePlayer('${p.id}')" style="position:absolute; top:10px; right:10px; background:none; border:none; color:#f85149; cursor:pointer;">✕</button>
        `;
        grid.appendChild(card);
    });
}

function setPlayerStatus(id, stat) {
    const p = squad.find(x => x.id === id);
    if(p) p.status = stat;
    updatePlayerList();
}

// 2. ANALYSE-ZENTRUM (Video & Live-Cam)
function renderAnalyse(area) {
    area.innerHTML = `
        <h2>Analyse-Zentrum</h2>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:30px;">
            <div style="background:#161b22; padding:20px; border-radius:15px;">
                <h3>📹 Video-Kabine</h3>
                <p style="font-size:13px; color:#8b949e;">Lade Trainingssequenzen hoch oder starte die Live-Analyse.</p>
                <input type="file" id="v-upload" style="display:none;" onchange="alert('Video zur Analyse bereit!')">
                <button class="btn-send" onclick="document.getElementById('v-upload').click()">VIDEO HOCHLADEN</button>
                <button class="btn-send" style="background:#30363d; margin-top:10px;" onclick="startCamera()">LIVE-KAMERA STARTEN</button>
                <video id="v-preview" style="width:100%; margin-top:15px; border-radius:10px; display:none;" autoplay></video>
            </div>
            <div style="background:#161b22; padding:20px; border-radius:15px;">
                <h3>📊 Performance-Metriken</h3>
                <p>Wähle einen Spieler, um Technik, Scanning und Fitness zu bewerten.</p>
                </div>
        </div>
    `;
}

async function startCamera() {
    const v = document.getElementById('v-preview');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        v.srcObject = stream;
        v.style.display = "block";
    } catch(e) { alert("Kamera-Fehler: Bitte Berechtigung prüfen."); }
}

// 3. MATCH & TRAINING
function renderMatch(area) {
    area.innerHTML = `
        <h2>Spieltags-Zentrale</h2>
        <div class="card" style="border:1px dashed var(--ginga-green); padding:40px; text-align:center;">
            <h3>Neues Matchboard erstellen</h3>
            <p>Generiere eine A4-Aufstellung inklusive Gegner-Analyse.</p>
            <button class="btn-send" style="width:auto; padding:10px 30px;" onclick="alert('Druckvorlage wird generiert...')">A4 BOARD GENERIEREN</button>
        </div>
    `;
}

function renderTraining(area) {
    area.innerHTML = `<h2>Trainings-Archiv</h2><p>Hier werden deine gespeicherten Übungseinheiten abgelegt.</p>`;
}

function removePlayer(id) {
    squad = squad.filter(p => p.id !== id);
    updatePlayerList();
}
