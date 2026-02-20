/* ==========================================================
   TONI 2.0 - ELITE ENGINE (STABLE & BUG-FIXED)
   ========================================================== */

// 1. MUSTER-DATEN (Die Basis, falls der Speicher leer oder kaputt ist)
const eliteMuster = [
    { id: 101, name: "M. Müller", pos: "ST", rating: 88, stats: [85, 90, 78, 84, 42, 81], img: "" },
    { id: 102, name: "L. Schmidt", pos: "TW", rating: 91, stats: [88, 45, 62, 58, 92, 85], img: "" },
    { id: 103, name: "K. Schneider", pos: "ZDM", rating: 84, stats: [72, 68, 85, 78, 84, 82], img: "" },
    { id: 104, name: "J. Weber", pos: "IV", rating: 82, stats: [68, 45, 65, 60, 88, 90], img: "" },
    { id: 105, name: "A. Fischer", pos: "LM", rating: 86, stats: [92, 78, 82, 88, 50, 70], img: "" }
];

let playersData = [];

function loadPlayers() {
    const saved = localStorage.getItem('toni_players');
    try {
        if (saved) {
            const parsed = JSON.parse(saved);
            // Validierung: Hat jeder Spieler stats? Wenn nicht -> Muster laden
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].stats) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Speicher-Fehler, lade Muster...");
    }
    return eliteMuster;
}

playersData = loadPlayers();
let editingPlayerId = null;

window.onload = () => {
    // Modal-Sicherheit: Knallhart verstecken
    const modal = document.getElementById('player-modal');
    if (modal) modal.style.display = 'none';

    renderLockerRoom();
    showModule('dashboard'); 
};

/* ==========================================================
   KABINE: RENDERN & EDITIEREN (FIX FÜR ERROR LINE 87)
   ========================================================== */

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if (!container) return;

    container.innerHTML = playersData.map(p => {
        // SICHERHEITS-CHECK: Verhindert "reading properties of undefined (reading '0')"
        const s = (p.stats && Array.isArray(p.stats)) ? p.stats : [50, 50, 50, 50, 50, 50];
        
        return `
            <div class="fut-card" onclick="openPlayerModal(${p.id})">
                <div class="card-top"><span>${p.rating || 50}</span><span>${p.pos || '??'}</span></div>
                <div class="card-img-container">
                    ${p.img ? `<img src="${p.img}">` : '<span style="font-size:35px;">👤</span>'}
                </div>
                <div class="card-name">${p.name || 'Unbekannt'}</div>
                <div class="card-stats">
                    <span>TEM: ${s[0]}</span><span>DRI: ${s[3]}</span>
                    <span>SCH: ${s[1]}</span><span>DEF: ${s[4]}</span>
                    <span>PAS: ${s[2]}</span><span>PHY: ${s[5]}</span>
                </div>
            </div>
        `;
    }).join('');
}

function openPlayerModal(id) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    if (!modal) return;

    const p = playersData.find(x => x.id === id);
    if (!p) return;

    // Felder befüllen
    document.getElementById('edit-name').value = p.name;
    document.getElementById('edit-pos').value = p.pos;
    document.getElementById('edit-rating').value = p.rating;
    
    const s = p.stats || [50, 50, 50, 50, 50, 50];
    document.getElementById('edit-tem').value = s[0];
    document.getElementById('edit-sch').value = s[1];
    document.getElementById('edit-pas').value = s[2];
    document.getElementById('edit-dri').value = s[3];
    document.getElementById('edit-def').value = s[4];
    document.getElementById('edit-phy').value = s[5];

    // CSS-Klasse für Sichtbarkeit nutzen
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closePlayerModal() {
    const modal = document.getElementById('player-modal');
    modal.classList.remove('active');
    modal.style.display = 'none';
}

function savePlayer() {
    const name = document.getElementById('edit-name').value;
    if (!name) return;

    const stats = [
        parseInt(document.getElementById('edit-tem').value) || 50,
        parseInt(document.getElementById('edit-sch').value) || 50,
        parseInt(document.getElementById('edit-pas').value) || 50,
        parseInt(document.getElementById('edit-dri').value) || 50,
        parseInt(document.getElementById('edit-def').value) || 50,
        parseInt(document.getElementById('edit-phy').value) || 50
    ];

    const updatedPlayer = {
        id: editingPlayerId,
        name: name,
        pos: document.getElementById('edit-pos').value.toUpperCase(),
        rating: Math.round(stats.reduce((a, b) => a + b, 0) / 6),
        stats: stats,
        img: document.getElementById('edit-img-url').value
    };

    playersData = playersData.map(x => x.id === editingPlayerId ? updatedPlayer : x);
    localStorage.setItem('toni_players', JSON.stringify(playersData));
    
    closePlayerModal();
    renderLockerRoom();
}

/* ==========================================================
   NAVIGATION & TAKTIK
   ========================================================== */

function showModule(moduleId) {
    document.querySelectorAll('.module-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const target = document.getElementById(moduleId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    if (moduleId === 'tactics') setTimeout(initBoard, 150);
}

let canvas, ctx;
function initBoard() {
    canvas = document.getElementById('tacticBoard');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    drawBoard();
}

function drawBoard() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Tore (Fix Screenshot 3)
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, 10); ctx.lineTo(canvas.width * 0.6, 10);
    ctx.moveTo(canvas.width * 0.4, canvas.height - 10); ctx.lineTo(canvas.width * 0.6, canvas.height - 10);
    ctx.stroke();
}
