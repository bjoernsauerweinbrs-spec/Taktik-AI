/**
 * Toni 2.0 - UI Logic
 * Steuert die Spielerliste, die Ampel-Logik und das Bewertungs-System
 */

// Funktion zum Anzeigen der Spielerliste in der Sidebar
function renderPlayerList() {
    const listContainer = document.getElementById('player-list');
    const players = ToniStorage.getPlayers();
    const countSpan = document.getElementById('player-count');
    
    countSpan.innerText = `(${players.length})`;
    listContainer.innerHTML = '';

    if (players.length === 0) {
        listContainer.innerHTML = '<p style="color: #64748b; font-size: 0.8rem; text-align: center;">Keine Spieler im Kader.</p>';
        return;
    }

    players.forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.style.cssText = "background: #1e293b; padding: 10px; border-radius: 6px; margin-bottom: 8px; border-left: 4px solid " + getStatusColor(player.status);
        
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 600;">#${player.number} ${player.name}</span>
                <div style="display: flex; gap: 5px;">
                    <button onclick="changeStatus('${player.id}')" style="background:none; border:none; color:#94a3b8; cursor:pointer;"><i class="fas fa-traffic-light"></i></button>
                    <button onclick="deletePlayer('${player.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

// Hilfsfunktion für Farben
function getStatusColor(status) {
    const colors = { 'green': '#22c55e', 'yellow': '#eab308', 'red': '#ef4444', 'gray': '#64748b' };
    return colors[status] || colors.gray;
}

// Neuen Spieler hinzufügen
function addNewPlayer() {
    const name = prompt("Name des Spielers:");
    const number = prompt("Rückennummer:");
    if (name && number) {
        const newPlayer = {
            id: 'p_' + Date.now(),
            name: name,
            number: number,
            status: 'green',
            posX: '10px',
            posY: '10px',
            history: []
        };
        ToniStorage.savePlayer(newPlayer);
        ToniBoard.renderPlayersOnPitch(); // Sofort auf das Feld bringen
    }
}

function deletePlayer(id) {
    if(confirm("Spieler wirklich löschen?")) {
        ToniStorage.deletePlayer(id);
        ToniBoard.renderPlayersOnPitch();
    }
}

function changeStatus(id) {
    const players = ToniStorage.getPlayers();
    const p = players.find(player => player.id === id);
    if (p) {
        const states = ['green', 'yellow', 'red', 'gray'];
        let current = states.indexOf(p.status);
        p.status = states[(current + 1) % states.length];
        ToniStorage.savePlayer(p);
        ToniBoard.renderPlayersOnPitch();
    }
}

// Initiale Liste laden
document.addEventListener('DOMContentLoaded', renderPlayerList);
