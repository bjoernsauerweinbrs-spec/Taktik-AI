let players = [];
let briefcaseOpen = false;

// --- 1. TAB-STEUERUNG (Kader, Tasche, Analyse, Match) ---
function switchTab(tabId) {
    // Alle Inhalte ausblenden
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Gewählten Tab aktivieren
    document.getElementById('tab-' + tabId).classList.add('active');
    // Button als aktiv markieren
    event.currentTarget.classList.add('active');
}

function toggleBriefcase() {
    briefcaseOpen = !briefcaseOpen;
    const overlay = document.getElementById('briefcase-overlay');
    overlay.classList.toggle('overlay-hidden', !briefcaseOpen);
}

// --- 2. KADER & BOARD-AUTOMATIK ---
function addPlayerToBriefcase() {
    const nr = document.getElementById('p-nr').value;
    const name = document.getElementById('p-name').value;
    const pos = document.getElementById('p-pos').value;

    if (!nr || !name) {
        alert("Coach, wir brauchen Nummer und Name!");
        return;
    }

    const player = {
        id: Date.now(),
        nr: nr,
        name: name,
        pos: pos,
        status: 'green',
        rating: 3,
        weight: "", // Vorbereitung für optionale Gewichtskontrolle
        lastAnalysis: null
    };

    players.push(player);
    renderSquad();
    createBoardChip(player); // SPIELER ERSCHEINT JETZT AUF DEM BOARD

    // Felder leeren
    document.getElementById('p-nr').value = '';
    document.getElementById('p-name').value = '';
}

function renderSquad() {
    const list = document.getElementById('smart-squad-list');
    list.innerHTML = players.map(p => `
        <div class="player-smart-box">
            <div class="box-header" style="padding:15px; display:flex; justify-content:space-between; cursor:pointer;" onclick="togglePlayerDetails(${p.id})">
                <span><strong>${p.nr}</strong> - ${p.name}</span>
                <span>${p.status === 'green' ? '🟢' : '🔴'}</span>
            </div>
            <div id="details-${p.id}" style="display:none; padding:15px; background:rgba(0,0,0,0.3); border-top:1px solid rgba(255,255,255,0.1);">
                <div style="margin-bottom:10px;">
                    <label>Technik-Rating:</label>
                    <span class="rating-stars" style="color:#f6e05e; cursor:pointer; font-size:1.2em;" onclick="updateRating(${p.id})">
                        ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}
                    </span>
                </div>
                <div style="display:flex; gap:10px; margin-top:10px;">
                    <input type="number" placeholder="Gewicht (opt.)" value="${p.weight}" onchange="updateWeight(${p.id}, this.value)" style="width:50%; background:#0f172a; color:white; border:none; padding:5px; border-radius:4px;">
                    <select onchange="updateStatus(${p.id}, this.value)" style="flex:1; background:#0f172a; color:white; border:none; border-radius:4px;">
                        <option value="green" ${p.status === 'green' ? 'selected' : ''}>Anwesend</option>
                        <option value="red" ${p.status === 'red' ? 'selected' : ''}>Fehlt</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');
}

// --- 3. VIDEO & ANALYSE FUNKTIONEN ---
function handleVideoUpload(input) {
    if (input.files && input.files[0]) {
        appendMessage('toni', "🚀 Video empfangen! Ich analysiere jetzt den Bewegungsablauf (Beidfüßigkeit & Explosivität)...");
        // Hier wird später die API-Anbindung für die Videoanalyse sitzen
        setTimeout(() => {
            appendMessage('toni', "✅ Analyse fertig: Der Übersteiger war explosiv, aber die Ballmitnahme mit dem rechten Fuß war etwas zu weit. 82% Samba-Score!");
        }, 3000);
    }
}

// --- 4. HILFSFUNKTIONEN ---
function togglePlayerDetails(id) {
    const el = document.getElementById(`details-${id}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function updateRating(id) {
    const p = players.find(x => x.id === id);
    p.rating = (p.rating % 5) + 1;
    renderSquad();
}

function updateWeight(id, val) {
    const p = players.find(x => x.id === id);
    p.weight = val;
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
    chip.innerHTML = `<span class="nr">${player.nr}</span><span class="name-label">${player.name}</span>`;
    chip.style.left = '45%'; chip.style.top = '45%';
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
        el.style.left = Math.max(0, Math.min(92, ((x - b.left) / b.width) * 100)) + '%';
        el.style.top = Math.max(0, Math.min(92, ((y - b.top) / b.height) * 100)) + '%';
    };
    el.onmousedown = el.ontouchstart = () => isDragging = true;
    document.onmousemove = document.ontouchmove = move;
    document.onmouseup = document.ontouchend = () => isDragging = false;
}
