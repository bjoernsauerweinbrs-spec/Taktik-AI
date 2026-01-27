let players = [];
let briefcaseOpen = false;

function toggleBriefcase() {
    briefcaseOpen = !briefcaseOpen;
    const overlay = document.getElementById('briefcase-overlay');
    overlay.classList.toggle('overlay-hidden', !briefcaseOpen);
}

function updateFieldMode() {
    const mode = document.getElementById('field-mode').value;
    const board = document.getElementById('taktik-board');
    board.className = 'soccer-pitch ' + mode;
    appendMessage('toni', `Manager, Spielfeld auf ${mode} angepasst. Bereit für Samba!`);
}

function addPlayerToBriefcase() {
    const nr = document.getElementById('p-nr').value;
    const name = document.getElementById('p-name').value;
    const pos = document.getElementById('p-pos').value;

    if (!nr || !name) return;

    const player = {
        id: Date.now(),
        nr: nr,
        name: name,
        pos: pos,
        status: 'green',
        rating: 3
    };

    players.push(player);
    renderSquad();
    createBoardChip(player);
    document.getElementById('p-nr').value = '';
    document.getElementById('p-name').value = '';
}

function renderSquad() {
    const list = document.getElementById('smart-squad-list');
    list.innerHTML = players.map(p => `
        <div class="player-smart-box" style="border-left: 8px solid ${p.status === 'green' ? '#48bb78' : '#f56565'}; background:#2d3748; margin-bottom:10px; border-radius:8px; overflow:hidden;">
            <div class="box-header" style="padding:15px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="togglePlayerDetails(${p.id})">
                <span style="font-weight:bold;">${p.nr} - ${p.name}</span>
                <span>${p.status === 'green' ? '🟢 Fit' : '🔴 Fehlt'}</span>
            </div>
            <div id="details-${p.id}" style="display:none; padding:15px; background:#1a202c; border-top:1px solid #4a5568;">
                <div style="margin-bottom:10px;">
                    <label style="display:block; color:#94a3b8; font-size:0.8em;">Technik-Rating:</label>
                    <span style="color:#f6e05e; font-size:1.5em; cursor:pointer;" onclick="updateRating(${p.id})">
                        ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}
                    </span>
                </div>
                <select onchange="updateStatus(${p.id}, this.value)" style="width:100%; padding:8px; background:#2d3748; color:white; border-radius:4px; border:none;">
                    <option value="green" ${p.status === 'green' ? 'selected' : ''}>Anwesend</option>
                    <option value="red" ${p.status === 'red' ? 'selected' : ''}>Fehlt</option>
                </select>
            </div>
        </div>
    `).join('');
}

function togglePlayerDetails(id) {
    const el = document.getElementById(`details-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function updateRating(id) {
    const p = players.find(x => x.id === id);
    p.rating = (p.rating % 5) + 1;
    renderSquad();
}

function updateStatus(id, status) {
    const p = players.find(x => x.id === id);
    p.status = status;
    renderSquad();
    const chip = document.getElementById(`chip-${id}`);
    if (chip) chip.style.display = status === 'red' ? 'none' : 'block';
}

function createBoardChip(player) {
    const board = document.getElementById('taktik-board');
    const chip = document.createElement('div');
    chip.className = 'player-chip';
    chip.id = `chip-${player.id}`;
    chip.innerText = player.nr;
    chip.style.left = '50%'; chip.style.top = '50%';
    makeDraggable(chip);
    board.appendChild(chip);
}

function makeDraggable(el) {
    let isDragging = false;
    const move = (e) => {
        if (!isDragging) return;
        const b = document.getElementById('taktik-board').getBoundingClientRect();
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        el.style.left = Math.max(0, Math.min(93, ((x - b.left) / b.width) * 100)) + '%';
        el.style.top = Math.max(0, Math.min(93, ((y - b.top) / b.height) * 100)) + '%';
    };
    el.onmousedown = el.ontouchstart = () => isDragging = true;
    document.onmousemove = document.ontouchmove = move;
    document.onmouseup = document.ontouchend = () => isDragging = false;
}
