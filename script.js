let playersData = JSON.parse(localStorage.getItem('toni_players')) || [
    { id: 1, name: "Müller", pos: "ST", rating: 88, stats: [85, 90, 82, 82, 40, 80] },
    { id: 2, name: "Schmidt", pos: "TW", rating: 91, stats: [88, 50, 60, 55, 92, 85] }
];

let editingPlayerId = null;

function renderLockerRoom() {
    const container = document.getElementById('locker-room-container');
    container.innerHTML = playersData.map(p => `
        <div class="fut-card" onclick="openPlayerModal(${p.id})">
            <div class="card-top"><span>${p.rating}</span><span>${p.pos}</span></div>
            <div class="card-name">${p.name}</div>
            <div class="card-stats">
                <span>TEM: ${p.stats[0]}</span><span>SCH: ${p.stats[1]}</span>
                <span>PAS: ${p.stats[2]}</span><span>DRI: ${p.stats[3]}</span>
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
        document.getElementById('player-modal').querySelectorAll('input').forEach(i => i.value = "");
        document.getElementById('btn-delete').style.display = "none";
    }
}

function savePlayer() {
    const p = {
        id: editingPlayerId || Date.now(),
        name: document.getElementById('edit-name').value,
        pos: document.getElementById('edit-pos').value,
        rating: document.getElementById('edit-rating').value,
        stats: [
            document.getElementById('edit-tem').value, document.getElementById('edit-sch').value,
            document.getElementById('edit-pas').value, document.getElementById('edit-dri').value,
            document.getElementById('edit-def').value, document.getElementById('edit-phy').value
        ]
    };
    if (editingPlayerId) playersData = playersData.map(x => x.id === editingPlayerId ? p : x);
    else playersData.push(p);
    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal(); renderLockerRoom();
}

function deletePlayer() {
    playersData = playersData.filter(x => x.id !== editingPlayerId);
    localStorage.setItem('toni_players', JSON.stringify(playersData));
    closePlayerModal(); renderLockerRoom();
}

function closePlayerModal() { document.getElementById('player-modal').style.display = "none"; }

function toggleToni() { document.body.classList.toggle('toni-collapsed'); }

function showModule(m) {
    document.querySelectorAll('.module-section').forEach(s => s.classList.remove('active'));
    document.getElementById(m).classList.add('active');
    if (m === 'tactics') setTimeout(initBoard, 100);
}

// Taktik-Board Initialisierung (Dummy für Zeichnung)
let canvas, ctx;
function initBoard() {
    canvas = document.getElementById('tacticBoard'); ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    drawPitch();
}
function drawPitch() {
    ctx.clearRect(0,0,canvas.width,canvas.height); ctx.strokeStyle = "white"; ctx.lineWidth = 2;
    ctx.strokeRect(10,10,canvas.width-20,canvas.height-20);
    ctx.strokeRect(canvas.width*0.2,10,canvas.width*0.6,60);
    ctx.strokeRect(canvas.width*0.2,canvas.height-70,canvas.width*0.6,60);
}

window.onload = () => { renderLockerRoom(); };
