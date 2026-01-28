/**
 * Toni 2.0 - Player Engine
 * Verantwortlich für das Erstellen und Bewegen der roten Spieler (Dein Team).
 */

window.toniPlayerEngine = {
    // Koordinaten für die 4-3-3 Ginga-Grundordnung (in % vom Spielfeld)
    formations: {
        "4-3-3": [
            { id: 1, x: 50, y: 92, pos: "TW" },  // Torwart
            { id: 2, x: 15, y: 75, pos: "LV" },  // Linksverteidiger
            { id: 3, x: 38, y: 80, pos: "IV" },  // Innenverteidiger
            { id: 4, x: 62, y: 80, pos: "IV" },  // Innenverteidiger
            { id: 5, x: 85, y: 75, pos: "RV" },  // Rechtsverteidiger
            { id: 6, x: 50, y: 65, pos: "DM" },  // Defensives Mittelfeld
            { id: 8, x: 30, y: 50, pos: "ZM" },  // Zentrales Mittelfeld
            { id: 10, x: 70, y: 50, pos: "ZM" }, // Zentrales Mittelfeld
            { id: 7, x: 15, y: 30, pos: "LF" },  // Linksaußen
            { id: 9, x: 50, y: 20, pos: "ST" },  // Stürmer
            { id: 11, x: 85, y: 30, pos: "RF" }  // Rechtsaußen
        ]
    },

    /**
     * Erstellt die 11 roten Spieler am Spielfeldrand
     */
    initTeam: function() {
        const pitch = document.getElementById('pitch');
        if (!pitch) return;
        
        // Altes Team entfernen, um Dopplungen zu vermeiden
        const existingPlayers = document.querySelectorAll('.player.red');
        existingPlayers.forEach(p => p.remove());

        // 11 Spieler generieren
        for (let i = 1; i <= 11; i++) {
            const playerEl = document.createElement('div');
            playerEl.className = 'player red';
            playerEl.id = `player-red-${i}`;
            playerEl.innerHTML = `<span class="player-number">${i}</span>`;
            
            // Startposition: "In der Kabine" (unten außerhalb des Sichtfelds)
            playerEl.style.left = '50%';
            playerEl.style.top = '110%';
            
            pitch.appendChild(playerEl);
        }
        console.log("🔴 Team Rot steht bereit.");
    },

    /**
     * Lässt die Spieler elegant in die Formation ausschwärmen
     */
    applyFormation: function(name) {
        const setup = this.formations[name];
        if (!setup) return;

        console.log(`🏃 Team rückt aus: ${name}`);

        setup.forEach((p, index) => {
            const el = document.getElementById(`player-red-${p.id}`);
            if (el) {
                // Verzögerter Start für jeden Spieler (brasilianischer "Flow")
                setTimeout(() => {
                    el.style.left = `${p.x}%`;
                    el.style.top = `${p.y}%`;
                    el.classList.add('in-position');
                }, index * 80); 
            }
        });
    }
};
