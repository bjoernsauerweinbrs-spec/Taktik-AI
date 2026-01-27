// --- GLOBALE VARIABLEN ---
let briefcaseOpen = false;
let players = [];

// --- 1. DIE AKTENTASCHE STEUERN ---
function toggleBriefcase() {
    briefcaseOpen = !briefcaseOpen;
    const overlay = document.getElementById('briefcase-overlay');
    overlay.classList.toggle('overlay-hidden', !briefcaseOpen);
}

// --- 2. SPIELFELD-MODUS (MATCH / FUNINO) ---
function updateFieldMode() {
    const mode = document.getElementById('field-mode').value;
    const board = document.getElementById('taktik-board');
    
    // Wechselt die CSS-Klasse (steuert die Tore)
    board.className = 'soccer-pitch ' + mode;
    
    console.log("Spielfeld-Modus geändert auf: " + mode);
}

// --- 3. KADER-MANAGEMENT (SMART-BOXEN) ---
function addPlayerToBriefcase() {
    const nr = document.getElementById('p-nr').value;
    const name = document.getElementById('p-name').value;
    const pos = document.getElementById('p-pos').value;

    if (!nr || !name) {
        alert("Coach, wir brauchen Nummer und Name für den Spielberichtsbogen!");
        return;
    }

    // Spieler-Objekt erstellen
    const player = {
        id: Date.now(),
        nr: nr,
        name: name,
        pos: pos,
        status: 'green' // Standard: Fit & Anwesend
    };

    players.push(player);
    renderSquad();        // Liste in der Tasche aktualisieren
    createBoardChip(player); // Chip auf das Feld bringen

    // Eingabefelder leeren
    document.getElementById('p-nr').value = '';
    document.getElementById('p-name').value = '';
}

// Erstellt die visuellen Karten in der Aktentasche
function renderSquad() {
    const list = document.getElementById('smart-squad-list');
    if (players.length === 0) {
        list.innerHTML = '<p class="empty-hint">Noch kein Profi im Kader.</p>';
        return;
    }

    list.innerHTML = players.map(p => `
        <div class="player-smart-box" onclick="togglePlayerDetails(${p.id})">
            <div class="box-header">
                <span class="p-nr-badge">${p.nr}</span>
                <strong>${p.name}</strong>
                <small>${p.pos}</small>
            </div>
            <div id="details-${p.id}" style="display:none; margin-top:10px; font-size:0.85em; border-top:1px solid #4a5568; padding-top:8px;">
                <p>Status: 🟢 Einsatzbereit</p>
                <p>Bewertung: ★★★★☆</p>
                <p style="color: #94a3b8; margin-top:5px;">Klick zum Einklappen</p>
            </div>
        </div>
    `).join('');
}

// Zeigt/Versteckt die Details einer Spieler-Box
function togglePlayerDetails(id) {
    const el = document.getElementById(`details-${id}`);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

// --- 4. BOARD-LOGIK (DIE ROTEN CHIPS) ---
function createBoardChip(player) {
    const board = document.getElementById('taktik-board');
    const chip = document.createElement('div');
    
    chip.className = 'player-chip';
    chip.id = `chip-${player.id}`;
    chip.innerText = player.nr;
    
    // Startposition an der Seitenlinie
    chip.style.left = '5%';
    chip.style.top = (15 + (players.indexOf(player) * 7)) + '%';
    
    // Drag & Drop aktivieren (Handy + MacBook)
    makeDraggable(chip);
    board.appendChild(chip);
}

// Die "Physik" für das Verschieben
function makeDraggable(el) {
    let isDragging = false;

    // Start (Maus & Touch)
    el.onmousedown = (e) => start(e);
    el.ontouchstart = (e) => start(e.touches[0]);

    function start(e) {
        isDragging = true;
        document.onmousemove = (e) => move(e);
        document.ontouchmove = (e) => move(e.touches[0]);
    }

    function move(e) {
        if (!isDragging) return;
        const board = document.getElementById('taktik-board').getBoundingClientRect();
        
        // Position in Prozent berechnen (für Responsive Design)
        let x = ((e.clientX - board.left) / board.width) * 100;
        let y = ((e.clientY - board.top) / board.height) * 100;
        
        // Grenzen einhalten (0-95%)
        el.style.left = Math.max(0, Math.min(95, x)) + '%';
        el.style.top = Math.max(0, Math.min(95, y)) + '%';
    }

    // Stop
    document.onmouseup = document.ontouchend = () => {
        isDragging = false;
        document.onmousemove = null;
        document.ontouchmove = null;
    };
}
