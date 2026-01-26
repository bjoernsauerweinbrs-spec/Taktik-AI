/**
 * Toni 2.0 - Board Steuerung
 * Formationen, Modi und Spielfeld-Logik
 */

let currentMode = '11v11';

function setMode(mode) {
    currentMode = mode;
    console.log("Wechsle in Modus:", mode);

    // UI Feedback
    document.querySelectorAll('.top-nav .btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase().includes(mode.toLowerCase()));
    });

    if (mode === '11v11') {
        applyTacticalFormation();
    } else if (mode === 'training') {
        applyTrainingSetup();
    }
}

// 11 vs 11: Rot im 3-4-3, Blau im 4-4-2
function applyTacticalFormation() {
    const pitch = document.getElementById('pitch');
    // Zuerst alle blauen Spieler löschen, um neu zu ordnen
    document.querySelectorAll('.player.blue').forEach(el => el.remove());

    // 1. Blaue Spieler (Toni - 4-4-2)
    const bluePositions = [
        {x: 920, y: 280}, // TW
        {x: 780, y: 80}, {x: 750, y: 200}, {x: 750, y: 360}, {x: 780, y: 480}, // Abwehr
        {x: 600, y: 80}, {x: 580, y: 200}, {x: 580, y: 360}, {x: 600, y: 480}, // Mittelfeld
        {x: 400, y: 200}, {x: 400, y: 360} // Sturm
    ];

    bluePositions.forEach((pos, i) => {
        createPlayerOnBoard('blue', i + 1, "", "b" + i, pos.x, pos.y);
    });

    // 2. Rote Spieler (Dein Kader - 3-4-3)
    // Wir nehmen die vorhandenen roten Spieler und schieben sie auf Position
    const redPlayers = document.querySelectorAll('.player.red');
    const redPositions = [
        {x: 40, y: 280}, // TW (Nr 1)
        {x: 180, y: 120}, {x: 160, y: 280}, {x: 180, y: 440}, // 3er Kette
        {x: 350, y: 50}, {x: 330, y: 200}, {x: 330, y: 360}, {x: 350, y: 510}, // 4er Mittelfeld
        {x: 550, y: 120}, {x: 580, y: 280}, {x: 550, y: 440} // 3er Sturm
    ];

    redPlayers.forEach((p, i) => {
        if (redPositions[i]) {
            p.style.transition = "all 0.8s ease-in-out";
            p.style.left = redPositions[i].x + 'px';
            p.style.top = redPositions[i].y + 'px';
            setTimeout(() => p.style.transition = "none", 800);
        }
    });
}

// Trainings-Setup: Buntere Mischung (Leibchen-Prinzip)
function applyTrainingSetup() {
    // Hier könnten wir später Hütchen und Bälle per Zufall oder Standardmuster streuen
    alert("Trainingsmodus aktiviert: Materialliste in der Aktentasche verfügbar.");
}

// Hilfsfunktion (falls noch nicht in logic.js global verfügbar)
if (typeof createPlayerOnBoard !== 'function') {
    function createPlayerOnBoard(team, nr, name, id, x, y) {
        const p = document.createElement('div');
        p.className = `player ${team}`;
        p.id = id;
        p.innerText = nr;
        p.draggable = true;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        if (name) {
            const label = document.createElement('div');
            label.className = 'player-label';
            label.innerText = `${nr} ${name}`;
            p.appendChild(label);
        }
        p.addEventListener('dragend', (e) => {
            const rect = document.getElementById('pitch').getBoundingClientRect();
            p.style.left = (e.clientX - rect.left - 20) + 'px';
            p.style.top = (e.clientY - rect.top - 20) + 'px';
        });
        document.getElementById('pitch').appendChild(p);
    }
}
