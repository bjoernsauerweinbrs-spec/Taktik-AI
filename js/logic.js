let players = [];
let briefcaseOpen = false;

// --- 1. AKTENSTASCHE STEUERN ---
function toggleBriefcase() {
    briefcaseOpen = !briefcaseOpen;
    const overlay = document.getElementById('briefcase-overlay');
    overlay.classList.toggle('overlay-hidden', !briefcaseOpen);
}

// --- 2. SPIELFELD-MODI (MATCH, FUNINO, HALBFELD) ---
function updateFieldMode() {
    const mode = document.getElementById('field-mode').value;
    const board = document.getElementById('taktik-board');
    
    // Setzt die Klasse für das CSS-Design
    board.className = 'soccer-pitch ' + mode;
    
    // Toni kommentiert den Wechsel
    const modeName = mode === 'mode-half' ? 'Halbfeld' : (mode === 'mode-funino' ? 'Funino' : 'Großfeld');
    appendMessage('toni', `Manager, Spielfeld auf ${modeName} angepasst. Alles bereit für die Taktik!`);
}

// --- 3. KADER-MANAGEMENT (DER FELSEN) ---
function addPlayerToBriefcase() {
    const nr = document.getElementById('p-nr').value;
    const name = document.getElementById('p-name').value;
    const pos = document.getElementById('p-pos').value;

    if (!nr || !name) {
        alert("Coach, wir brauchen Nummer und Name für den Kader!");
        return;
    }

    const player = {
        id: Date.now(),
        nr: nr,
        name: name,
        pos: pos,
        status: 'green',
        rating: 3, // Startbewertung 3 Sterne
        notes: ""
    };

    players.push(player);
    renderSquad();
    createBoardChip(player);

    // Felder leeren
    document.getElementById('p-nr').value = '';
    document.getElementById('p-name').value = '';
}

function renderSquad() {
    const list = document.getElementById('smart-squad-list');
    list.innerHTML = players.map(p => `
        <div class="player-smart-box" style="border-left: 5px solid ${p.status === 'green' ? '#48bb78' : '#f56565'}; margin-top:10px; background:#2d3748; border-radius:8px;">
            <div class="box-header" style="padding:10px; display:flex; justify-content:space-between; cursor:pointer;" onclick="togglePlayerDetails(${p.id})">
                <span><strong>${p.nr}</strong> - ${p.name}</span>
                <span>${p.status === 'green' ? '🟢' : '🔴'}</span>
            </div>
            <div id="details-${p.id}" style="display:none; padding:10px; background:#1a202c; border-radius:0 0 8px 8px;">
                <p>Position: ${p.pos}</p>
                <div class="rating-system">
                    <span>Bewertung: </span>
                    <span style="color:#f6e05e; cursor:pointer;" onclick="updateRating(${p.id})">
                        ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}
                    </span>
                </div>
                <select onchange="updateStatus(${p.id}, this.value)" style="margin-top:10px; width:100%;">
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
    const p = players.find(player => player.id === id);
    p.rating = (p.rating % 5) + 1; // Rotiert durch 1-5 Sterne
    renderSquad();
}

function updateStatus(id, status) {
    const p = players.find(player => player.id === id);
    p.status = status;
    renderSquad();
    // Chip vom Board entfernen oder zeigen
    const chip = document.getElementById(`chip-${id}`);
    if (chip) chip.style.display = status === 'red' ? 'none' : 'block';
}

// --- 4. BOARD-LOGIK (DRAG & DROP) ---
function createBoardChip(player) {
    const board = document.getElementById('taktik-board');
    const chip = document.createElement('div');
    chip.className = 'player-chip';
    chip.id = `chip-${player.id}`;
    chip.innerText = player.nr;
    chip.style.left = '10%';
    chip.style.top = '20%';
    
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

// Platzhalter für Chat-Funktion, damit app.html nicht abstürzt
function appendMessage(sender, text) {
    const out = document.getElementById('chat-output');
    if(out) {
        const d = document.createElement('div');
        d.className = sender + "-msg";
        d.innerText = text;
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
    }
}
