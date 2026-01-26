/**
 * Toni 2.0 - Kader & Logik Steuerung
 * Verknüpft die Namensliste mit dem Spielfeld
 */

// Unser Start-Kader (wie besprochen)
let squad = [
    { id: "p1", nr: 1, name: "Torwart", team: "red" },
    { id: "p2", nr: 8, name: "Thorsten", team: "red" },
    { id: "p3", nr: 11, name: "David Luiz", team: "red" }
];

document.addEventListener('DOMContentLoaded', () => {
    renderSquad();
});

// Zeichnet die Liste links und aktualisiert das Feld
function renderSquad() {
    const list = document.getElementById('player-list');
    list.innerHTML = '';
    
    squad.forEach(p => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <span class="delete-btn" onclick="removePlayer('${p.id}')">✕</span>
            <div style="font-weight:bold; color:#2ecc71;">#${p.nr} ${p.name}</div>
            <div style="font-size:10px; color:#8b949e; margin-top:4px;">Tech: 85% | Scan: 90%</div>
        `;
        list.appendChild(card);
    });

    // WICHTIG: Synchronisiere die roten Punkte auf dem Feld
    syncPlayersToBoard();
}

// Spieler hinzufügen Dialog
function addNewPlayerPrompt() {
    const nr = prompt("Trikotnummer eingeben:");
    if(!nr) return;
    const name = prompt("Name des Spielers:");
    if(!name) return;

    const newId = "p" + Date.now();
    squad.push({ id: newId, nr: nr, name: name, team: "red" });
    renderSquad();
}

// Spieler löschen (Das "x")
function removePlayer(id) {
    squad = squad.filter(p => p.id !== id);
    renderSquad();
    
    // Auch vom Spielfeld löschen
    const boardPlayer = document.getElementById(id);
    if(boardPlayer) boardPlayer.remove();
}

// Bringt die Liste als rote Punkte auf das Spielfeld
function syncPlayersToBoard() {
    // Nur rote Spieler synchronisieren (Blaue steuert Toni/Formation)
    squad.forEach((p, index) => {
        let boardPlayer = document.getElementById(p.id);
        
        if(!boardPlayer) {
            // Wenn Spieler noch nicht auf dem Feld, erstelle ihn
            // Startpositionen leicht versetzt, damit sie nicht alle aufeinander liegen
            createPlayerOnBoard(p.team, p.nr, p.name, p.id, 100, 100 + (index * 50));
        } else {
            // Update Label falls Name/Nummer geändert wurde
            const label = boardPlayer.querySelector('.player-label');
            if(label) label.innerText = `${p.nr} ${p.name}`;
            boardPlayer.firstChild.textContent = p.nr;
        }
    });
}

function createPlayerOnBoard(team, nr, name, id, x, y) {
    const p = document.createElement('div');
    p.className = `player ${team}`;
    p.id = id;
    p.innerText = nr;
    p.draggable = true;
    p.style.left = x + 'px';
    p.style.top = y + 'px';

    if(name) {
        const label = document.createElement('div');
        label.className = 'player-label';
        label.innerText = `${nr} ${name}`;
        p.appendChild(label);
    }

    // Drag & Drop Logik
    p.addEventListener('dragend', (e) => {
        const rect = document.getElementById('pitch').getBoundingClientRect();
        p.style.left = (e.clientX - rect.left - 20) + 'px';
        p.style.top = (e.clientY - rect.top - 20) + 'px';
    });

    document.getElementById('pitch').appendChild(p);
}
