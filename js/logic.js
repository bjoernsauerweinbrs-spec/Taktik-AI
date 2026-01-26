// TONI'S TAKTISCHE REAKTION
function toniReacts(movedPlayerId) {
    if (!movedPlayerId.startsWith('R')) return; // Nur auf Rot reagieren

    const bluePlayers = document.querySelectorAll('.player-wrapper.blue');
    const movedRed = document.getElementById(movedPlayerId);
    
    // Zufälliger blauer Verteidiger rückt ein Stück entgegen
    const targetBlue = bluePlayers[Math.floor(Math.random() * bluePlayers.length)];
    
    const rx = parseInt(movedRed.style.left);
    const ry = parseInt(movedRed.style.top);
    
    // Taktik: Toni schiebt einen Blauen leicht in Richtung des Balls (des bewegten Roten)
    let bx = parseInt(targetBlue.style.left) || 600;
    let by = parseInt(targetBlue.style.top) || 250;
    
    let newX = bx - (bx - rx) * 0.1;
    let newY = by - (by - ry) * 0.1;

    targetBlue.style.transition = "all 0.5s ease-out";
    targetBlue.style.left = newX + "px";
    targetBlue.style.top = newY + "px";

    // Toni kommentiert den Zug
    const name = movedRed.querySelector('.player-circle').innerText;
    addMsg('toni', `Coach Björn, ${name} zieht das Spiel breit! Ich verschiebe meine Kette, um die Räume eng zu machen.`);
}

// KADER MANAGER
function openKaderManager() {
    const modal = document.getElementById('kader-modal');
    const list = document.getElementById('kader-list');
    modal.style.display = 'flex';
    list.innerHTML = '';

    const allPlayers = document.querySelectorAll('.player-wrapper.red');
    allPlayers.forEach(p => {
        const name = p.querySelector('.player-circle').innerText;
        const nr = p.querySelector('.player-label').innerText;
        list.innerHTML += `
            <div class="kader-item">
                <input type="text" value="${name}" onchange="updatePlayerName('${p.id}', this.value)">
                <input type="text" value="${nr}" style="width: 50px;" onchange="updatePlayerNr('${p.id}', this.value)">
            </div>
        `;
    });
}

function updatePlayerName(id, val) {
    document.getElementById(id).querySelector('.player-circle').innerText = val.toUpperCase();
}
function updatePlayerNr(id, val) {
    document.getElementById(id).querySelector('.player-label').innerText = val;
}
function closeKaderManager() { document.getElementById('kader-modal').style.display = 'none'; }

function exportPlanPDF() { alert("Trainingsplan für Team Björn wird erstellt..."); }
