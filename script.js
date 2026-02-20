/* --- PLAYER MANAGEMENT & PERSISTENCE --- */
let playersData = JSON.parse(localStorage.getItem('toni_players')) || [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 82, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] }
];

let editingPlayerId = null;

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    if(!container) return;
    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            <div class="card-name">${p.name}</div>
            <div class="card-stats">
                <span>TEM: ${p.stats[0]}</span><span>DRI: ${p.stats[3]}</span>
                <span>SCH: ${p.stats[1]}</span><span>DEF: ${p.stats[4]}</span>
                <span>PAS: ${p.stats[2]}</span><span>PHY: ${p.stats[5]}</span>
            </div>
        </div>
    `).join('');
}

function openPlayerModal(id = null) {
    editingPlayerId = id;
    const modal = document.getElementById('player-modal');
    modal.style.display = "block";
    
    if (id) {
        const p = playersData.find(x => x.id === id);
        document.getElementById('modal-title').innerText = "Spieler bearbeiten";
        document.getElementById('edit-name').value = p.name;
        document.getElementById('edit-pos').value = p.pos;
        document.getElementById('edit-rating').value = p.rating;
        document.getElementById('edit-tem').value = p.stats[0];
        document.getElementById('edit-sch').value = p.stats[1];
        document.getElementById('edit-pas').value = p.stats[2];
        document.getElementById('edit-dri').value = p.stats[3];
        document.getElementById('edit-def').value = p.stats[4];
        document.getElementById('edit-phy').value = p.stats[5];
        document.getElementById('btn-delete').style.display = "block";
    } else {
        document.getElementById('modal-title').innerText = "Neuer Spieler";
        document.querySelectorAll('.modal-content input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

function savePlayer() {
    const p = {
        id: editingPlayerId || Date.now(),
        name: document.getElementById('edit-name').value || "Unbekannt",
        pos: document.getElementById('edit-pos').value || "??",
        rating: document.getElementById('edit-rating').value || 50,
        stats: [
            document.getElementById('edit-tem').value || 50, document.getElementById('edit-sch').value || 50,
            document.getElementById('edit-pas').value || 50, document.getElementById('edit-dri').value || 50,
            document.getElementById('edit-def').value || 50, document.getElementById('edit-phy').value || 50
        ]
    };
    if (editingPlayerId) playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    else playersData.push(p);
    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal(); renderLockerRoom();
}

function deletePlayer() {
    if(confirm("Spieler wirklich löschen?")) {
        playersData = playersData.filter(x => x.id !== editingPlayerId);
        localStorage.setItem('toni_players', JSON.stringify(playersData));
        closePlayerModal(); renderLockerRoom();
    }
}

function closePlayerModal() { document.getElementById('player-modal').style.display = "none"; }

/* --- UI CONTROLS & TONI TOGGLE --- */
function toggleToni() { document.body.classList.toggle('toni-collapsed'); }

function showModule(m) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(m).classList.add('active');
    const btn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.getAttribute('onclick').includes(m));
    if(btn) btn.classList.add('active');
    if (m === 'tactics') setTimeout(initBoard, 150);
}

/* --- TACTICS ENGINE --- */
let canvas, ctx, playersPitch = [], zones = [];
function initBoard() {
    canvas = document.getElementById('tacticBoard'); ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    setFormation('4-4-2');
    canvas.onmousedown = canvas.ontouchstart = startDrag;
    canvas.onmousemove = canvas.ontouchmove = doDrag;
    canvas.onmouseup = canvas.ontouchend = stopDrag;
}

function drawBoard() {
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2;
    ctx.strokeRect(10,10,canvas.width-20,canvas.height-20); // Außen
    ctx.beginPath(); ctx.moveTo(10, canvas.height/2); ctx.lineTo(canvas.width-10, canvas.height/2); ctx.stroke(); // Mitte
    ctx.beginPath(); ctx.arc(canvas.width/2, canvas.height/2, 45, 0, Math.PI*2); ctx.stroke(); // Kreis
    const boxW = canvas.width * 0.65; ctx.strokeRect((canvas.width-boxW)/2, 10, boxW, 75); // Box oben
    ctx.strokeRect((canvas.width-boxW)/2, canvas.height-85, boxW, 75); // Box unten
    zones.forEach(z => { ctx.fillStyle = z.c; ctx.fillRect(z.x, z.y, z.w, z.h); ctx.fillStyle = "white"; ctx.fillText(z.l, z.x+5, z.y+15); });
    playersPitch.forEach(p => {
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "white"; ctx.font = "bold 11px Arial"; ctx.fillText(p.l, p.x-12, p.y+30);
    });
}

function setFormation(f) {
    playersPitch = []; zones = []; const w = canvas.width, h = canvas.height, c = f==='4-4-2'?'#ef4444':'#3b82f6';
    if(f==='4-4-2') {
        zones.push({x:10, y:h*0.4, w:w-20, h:h*0.2, c:"rgba(34,197,94,0.2)", l:"PRESSING"});
        [0.2,0.4,0.6,0.8].forEach(x => playersPitch.push({x:w*x, y:h*0.75, l:"ABW", c}));
        [0.2,0.4,0.6,0.8].forEach(x => playersPitch.push({x:w*x, y:h*0.5, l:"MF", c}));
        [0.4,0.6].forEach(x => playersPitch.push({x:w*x, y:h*0.25, l:"ST", c}));
    } else {
        zones.push({x:10, y:10, w:w*0.15, h:h-20, c:"rgba(59,130,246,0.2)", l:"FLÜGEL"});
        [0.25,0.5,0.75].forEach(x => playersPitch.push({x:w*x, y:h*0.75, l:"ABW", c}));
        [0.2,0.4,0.6,0.8].forEach(x => playersPitch.push({x:w*x, y:h*0.4, l:"MF", c}));
        [0.2,0.5,0.8].forEach(x => playersPitch.push({x:w*x, y:h*0.2, l:"ST", c}));
    }
    playersPitch.push({x:w/2, y:h-40, l:"TW", c}); drawBoard();
}

/* DRAG LOGIK */
let dragging = false, activePlayer = null;
function startDrag(e) { const pos = getPos(e); activePlayer = playersPitch.find(p => Math.hypot(p.x-pos.x, p.y-pos.y)<25); if(activePlayer) dragging = true; }
function doDrag(e) { if(!dragging) return; const pos = getPos(e); activePlayer.x = pos.x; activePlayer.y = pos.y; drawBoard(); }
function stopDrag() { dragging = false; activePlayer = null; }
function getPos(e) { const r = canvas.getBoundingClientRect(); const cx = e.touches?e.touches[0].clientX:e.clientX, cy = e.touches?e.touches[0].clientY:e.clientY; return {x:cx-r.left, y:cy-r.top}; }

/* CHAT */
function addMessage(s, t) {
    const d = document.createElement('div'); d.className = `message msg-${s.toLowerCase()==='toni'?'toni':'user'}`;
    d.innerHTML = `<b>${s}:</b> ${t}`; document.getElementById('chat-history').appendChild(d);
    document.getElementById('chat-history').scrollTop = 10000;
}

window.onload = () => { renderLockerRoom(); addMessage("Toni", "Elite System geladen. Alle Module bereit."); };
