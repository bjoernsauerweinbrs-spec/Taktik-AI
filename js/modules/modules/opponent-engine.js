/**
 * Toni 2.0 - Opponent Engine
 * Verantwortlich für das Erstellen und Positionieren des gegnerischen Teams (Team Blau).
 */

window.toniOpponentEngine = {
    // Standard-Defensiv-Formation für den Gegner (z.B. ein kompaktes 4-4-2)
    formations: {
        "4-4-2-Defensiv": [
            { id: 1, x: 50, y: 8,  pos: "TW" },  // Gegner-Torwart
            { id: 2, x: 20, y: 25, pos: "RV" },  // Rechtsverteidiger
            { id: 3, x: 40, y: 22, pos: "IV" },  // Innenverteidiger
            { id: 4, x: 60, y: 22, pos: "IV" },  // Innenverteidiger
            { id: 5, x: 80, y: 25, pos: "LV" },  // Linksverteidiger
            { id: 6, x: 20, y: 40, pos: "RM" },  // Rechtes Mittelfeld
            { id: 7, x: 40, y: 38, pos: "ZM" },  // Zentrales Mittelfeld
            { id: 8, x: 60, y: 38, pos: "ZM" },  // Zentrales Mittelfeld
            { id: 9, x: 80, y: 40, pos: "LM" },  // Linkes Mittelfeld
            { id: 10, x: 45, y: 55, pos: "ST" }, // Stürmer
            { id: 11, x: 55, y: 55, pos: "ST" }  // Stürmer
        ]
    },

    /**
     * Erstellt die 11 blauen Gegenspieler
     */
    initOpponent: function() {
        const pitch = document.getElementById('pitch');
        if (!pitch) return;
        
        // Altes blaues Team entfernen
        const existingOpponents = document.querySelectorAll('.player.blue');
        existingOpponents.forEach(p => p.remove());

        for (let i = 1; i <= 11; i++) {
            const playerEl = document.createElement('div');
            playerEl.className = 'player blue';
            playerEl.id = `player-blue-${i}`;
            playerEl.innerHTML = `<span class="player-number">${i}</span>`;
            
            // Startposition: "Hinter der Grundlinie" (oben außerhalb)
            playerEl.style.left = '50%';
            playerEl.style.top = '-10%';
            
            pitch.appendChild(playerEl);
        }
        console.log("🔵 Team Blau (Gegner) steht bereit.");
    },

    /**
     * Schiebt die Gegner in die Formation
     */
    applyFormation: function(name) {
        const setup = this.formations[name];
        if (!setup) return;

        console.log(`🛡️ Gegner formiert sich: ${name}`);

        setup.forEach((p, index) => {
            const el = document.getElementById(`player-blue-${p.id}`);
            if (el) {
                setTimeout(() => {
                    el.style.left = `${p.x}%`;
                    el.style.top = `${p.y}%`;
                    el.classList.add('in-position');
                }, index * 50); 
            }
        });
    }
};
