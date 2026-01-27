/**
 * Toni 2.0 - Board Engine
 * Steuert Drag & Drop, Spieler-Chips und das Zeichnen von Übungen
 */

const ToniBoard = {
    activeMode: 'training',
    selectedPlayerId: null,

    init: function() {
        console.log("Board Engine startet...");
        this.renderPlayersOnPitch();
        this.setupEventListeners();
    },

    // --- RENDERING ---

    renderPlayersOnPitch: function() {
        const pitch = document.getElementById('pitch');
        const players = ToniStorage.getPlayers().filter(p => p.status === 'green' || p.status === 'yellow');
        
        // Bestehende Chips entfernen (außer Overlay)
        const oldChips = pitch.querySelectorAll('.player-chip');
        oldChips.forEach(chip => chip.remove());

        players.forEach((player, index) => {
            const chip = document.createElement('div');
            chip.className = 'player-chip';
            chip.id = `chip-${player.id}`;
            chip.innerText = player.number || (index + 1);
            chip.title = player.name;
            
            // Startposition (verteilt am Rand oder geladen)
            chip.style.left = player.posX || "10px";
            chip.style.top = player.posY || (index * 45 + 10) + "px";

            chip.onmousedown = (e) => this.dragStart(e, chip, player.id);
            chip.ontouchstart = (e) => this.dragStart(e, chip, player.id);
            
            // Klick für Bewertung
            chip.onclick = () => this.openAssessment(player.id);

            pitch.appendChild(chip);
        });
    },

    // --- DRAG & DROP LOGIK ---

    dragStart: function(e, element, playerId) {
        e.preventDefault();
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        pos3 = clientX;
        pos4 = clientY;

        const elementDrag = (e) => {
            const cX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const cY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            
            pos1 = pos3 - cX;
            pos2 = pos4 - cY;
            pos3 = cX;
            pos4 = cY;
            
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        };

        const closeDragElement = () => {
            document.onmouseup = null;
            document.onmousemove = null;
            document.ontouchend = null;
            document.ontouchmove = null;
            
            // Position im Storage speichern
            this.savePosition(playerId, element.style.left, element.style.top);
        };

        if (e.type === 'touchstart') {
            document.ontouchend = closeDragElement;
            document.ontouchmove = elementDrag;
        } else {
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
    },

    savePosition: function(id, x, y) {
        let players = ToniStorage.getPlayers();
        let p = players.find(player => player.id === id);
        if (p) {
            p.posX = x;
            p.posY = y;
            ToniStorage.savePlayer(p);
        }
    },

    // --- TRAININGSOBJEKTE (Hütchen, Tore) ---

    addMaterial: function(type, x, y) {
        const overlay = document.getElementById('exercise-overlay');
        const item = document.createElement('div');
        item.className = `board-item ${type}`; // CSS Klassen für cone, ball, goal
        item.style.left = x + "px";
        item.style.top = y + "px";
        overlay.appendChild(item);
    },

    clearMaterial: function() {
        document.getElementById('exercise-overlay').innerHTML = '';
    },

    // --- SCREENSHOT ---

    takeSnapshot: function() {
        // Hier nutzen wir später html2canvas für den Flyer
        console.log("Screenshot vom Board erstellt...");
        alert("Screenshot gespeichert (Simulation)");
    }
};

// Globaler Reset für den Button
function resetBoard() {
    if(confirm("Board zurücksetzen? Alle Hütchen und Laufwege werden gelöscht.")) {
        ToniBoard.clearMaterial();
        ToniBoard.renderPlayersOnPitch();
    }
}

// Start der Engine
ToniBoard.init();
