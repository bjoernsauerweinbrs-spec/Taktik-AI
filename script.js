/* ==========================================================
   TONI 2.0 | ELITE VR ENGINE (FULL REPLACEMENT)
   ========================================================== */

const vrSystem = {
    // Kader-Daten für die 3D-Avatare
    players: [
        { id: 101, name: "M. Neuer", pos: "TW", team: "TONI", color: "#22c55e", x: 0, z: 48 },
        { id: 102, name: "V. van Dijk", pos: "IV", team: "TONI", color: "#ef4444", x: -10, z: 25 },
        { id: 103, name: "K. Schneider", pos: "IV", team: "TONI", color: "#ef4444", x: 10, z: 25 },
        { id: 201, name: "Gegner ST", pos: "ST", team: "OPP", color: "#3b82f6", x: 0, z: -10 }
    ],

    init: function() {
        console.log("VR-System wird kalibriert...");
        this.spawnPlayers();
        this.setupEventListeners();
    },

    /**
     * Erzeugt die 3D-Avatare im Stadion
     */
    spawnPlayers: function() {
        const container = document.getElementById('player-assets');
        if (!container) return;

        this.players.forEach(p => {
            const playerEl = document.createElement('a-entity');
            playerEl.setAttribute('id', `player-${p.id}`);
            playerEl.setAttribute('position', `${p.x} 0 ${p.z}`);
            
            // Blickrichtung zum gegnerischen Tor (z = -52.5)
            const lookAt = p.team === 'TONI' ? '0 0 -52.5' : '0 0 52.5';
            playerEl.setAttribute('look-at', lookAt);

            playerEl.innerHTML = `
                <a-box position="0 0.9 0" width="0.6" height="1.2" depth="0.3" color="${p.color}" shadow></a-box>
                <a-sphere position="0 1.7 0" radius="0.25" color="#ffccaa">
                    <a-box position="0 0 0.2" width="0.1" height="0.1" depth="0.2" color="black"></a-box>
                </a-sphere>
                <a-text value="${p.name}" position="0 2.4 0" align="center" width="5" side="double"></a-text>
            `;
            container.appendChild(playerEl);
        });
    },

    /**
     * VR-Ereignisse (Spatial Audio & Meta Quest Connection)
     */
    setupEventListeners: function() {
        const scene = document.querySelector('a-scene');
        scene.addEventListener('enter-vr', () => {
            this.speak("Initialisierung abgeschlossen. Taktische Ebene 1 geladen. Willkommen auf dem Platz, Coach.");
        });
    },

    speak: function(text) {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.lang = 'de-DE';
            msg.pitch = 0.85;
            window.speechSynthesis.speak(msg);
        }
    }
};

// Startet die Engine
window.onload = () => vrSystem.init();
