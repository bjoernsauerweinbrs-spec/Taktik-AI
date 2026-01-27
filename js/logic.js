// --- FINALE GEPRÜFTE LOGIK ---
let briefcaseOpen = false;
let players = [];

function toggleBriefcase() {
    const overlay = document.getElementById('briefcase-overlay');
    briefcaseOpen = !briefcaseOpen;
    overlay.classList.toggle('overlay-hidden', !briefcaseOpen);
}

function updateFieldMode() {
    const mode = document.getElementById('field-mode').value;
    document.getElementById('taktik-board').className = 'soccer-pitch ' + mode;
}

function addPlayerToBriefcase() {
    const nr = document.getElementById('p-nr').value;
    const name = document.getElementById('p-name').value;
    const pos = document.getElementById('p-pos').value;

    if (!nr || !name) return alert("Coach, Name und Nummer fehlen!");

    const player = { id: Date.now(), nr, name, pos, status: 'green', rating: 4 };
    players.push(player);
    renderSquad();
    updateBoard(); // Synchronisiert die Chips
    
    document.getElementById('p-nr').value = '';
    document.getElementById('p-name').value = '';
}

// Rendert die Smart-Boxen mit Anwesenheits-Logik
function renderSquad() {
    const list = document.getElementById('smart-squad-list');
    list.innerHTML = players.map(p => `
        <div class="player-smart-box" style="border-left-color: ${p.status === 'green' ? '#48bb78' : p.status === 'red' ? '#f56565' : '#ecc94b'}">
            <div class="box-header" onclick="togglePlayerDetails(${p.id})">
                <span class="p-nr-badge">${p.nr}</span>
                <strong>${p.name}</strong>
                <select onchange="updateStatus(${p.id}, this.value)" onclick="event.stopPropagation()">
                    <option value="green" ${p.status === 'green' ? 'selected' : ''}>🟢 Fit</option>
                    <option value="red" ${p.status === 'red' ? 'selected' : ''}>🔴 Fehlt</option>
                </select>
            </div>
            <div id="details-${p.id}" style="display:none; margin-top:10px; border-top:1px solid #444; padding-top:10px;">
                <label>Position: ${p.pos}</label><br>
                <label>Bewertung: ★★★★☆</label>
            </div>
        </div>
    `).join('');
}

function updateStatus(id, newStatus) {
    const player = players.find(p => p.id === id);
    if(player) {
        player.status = newStatus;
        renderSquad();
        updateBoard(); // Entfernt oder zeigt den Chip auf dem Feld
    }
}

function updateBoard() {
    const board = document.getElementById('taktik-board');
    // Alle alten Chips entfernen, um sauber neu zu zeichnen
    document.querySelectorAll('.player-chip').forEach(c => c.remove());
    
    // Nur fitte Spieler (Grün) auf dem Board anzeigen
    players.filter(p => p.status === 'green').forEach(p => {
        const chip = document.createElement('div');
        chip.className = 'player-chip';
        chip.innerText = p.nr;
        chip.style.left = '10%';
        chip.style.top = (20 + (players.indexOf(p) * 8)) + '%';
        makeDraggable(chip);
        board.appendChild(chip);
    });
}

function togglePlayerDetails(id) {
    const el = document.getElementById(`details-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function makeDraggable(el) {
    let isDragging = false;
    const start = (e) => { isDragging = true; };
    const move = (e) => {
        if (!isDragging) return;
        const b = document.getElementById('taktik-board').getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        el.style.left = Math.max(0, Math.min(95, ((clientX - b.left) / b.width) * 100)) + '%';
        el.style.top = Math.max(0, Math.min(95, ((clientY - b.top) / b.height) * 100)) + '%';
    };
    const stop = () => { isDragging = false; };
    el.onmousedown = el.ontouchstart = start;
    document.onmousemove = document.ontouchmove = move;
    document.onmouseup = document.ontouchend = stop;
}
