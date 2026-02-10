/**
 * TONI 2.0 - MOBILE TACTICS CONTROLLER
 * Fokus: Tap-to-Sub & Quick-Hotkeys für das Smartphone
 * Status: 2026 MOBILE OPTIMIZED
 */
window.MobileTactics = {
    selectedPlayerId: null,

    init() {
        console.log("📱 Mobile Tactics: Touch-Schnittstelle aktiv.");
        this.createHotkeyOverlay();
    },

    /**
     * Wird aufgerufen, wenn eine Mini-Card auf der Bank getippt wird
     */
    handleBenchTap(playerId) {
        this.selectedPlayerId = playerId;
        
        // Visuelles Feedback: Alle Karten normal, gewählte Karte leuchtet
        document.querySelectorAll('.fifa-card-mini').forEach(card => {
            card.style.borderColor = 'rgba(255,255,255,0.1)';
            card.style.boxShadow = 'none';
        });

        const activeCard = event.currentTarget;
        activeCard.style.borderColor = 'var(--neon-green)';
        activeCard.style.boxShadow = '0 0 15px var(--neon-green)';
        
        if(window.ToniVoice) window.ToniVoice.speak("Einheit bereit zum Einwechseln.");
    },

    /**
     * Wird aufgerufen, wenn das Spielfeld (Canvas) getippt wird
     */
    handleBoardTap(x, y) {
        if (!this.selectedPlayerId) return;

        const player = window.Database.players.find(p => p.id == this.selectedPlayerId);
        if (player) {
            // Koordinaten dem Spieler zuweisen
            player.x = x;
            player.y = y;
            player.onField = true;

            // Auswahl aufheben
            this.selectedPlayerId = null;
            
            // Arena neu zeichnen
            if(window.Arena.draw) window.Arena.draw();
            if(window.ToniVoice) window.ToniVoice.speak(player.name.split(' ').pop() + " auf Position.");
        }
    },

    /**
     * Mobile Hotkeys für schnellen Zugriff am Spielfeldrand
     */
    createHotkeyOverlay() {
        if (document.getElementById('mobile-hotkeys')) return;

        const overlay = document.createElement('div');
        overlay.id = 'mobile-hotkeys';
        overlay.className = 'no-print';
        overlay.style = `
            position: fixed; bottom: 20px; right: 20px; 
            display: flex; flex-direction: column; gap: 10px; z-index: 10000;
        `;

        overlay.innerHTML = `
            <button onclick="window.Arena.resetBoard()" class="tactic-btn" style="width:50px; height:50px; border-radius:50%; background:rgba(0,0,0,0.8); border:1px solid #ff3b30; color:#ff3b30;">
                <i class="fas fa-undo"></i>
            </button>
            <button onclick="window.MobileTactics.toggleNames()" class="tactic-btn" style="width:50px; height:50px; border-radius:50%; background:rgba(0,0,0,0.8); border:1px solid var(--data-cyan); color:var(--data-cyan);">
                <i class="fas fa-font"></i>
            </button>
            <button onclick="window.BriefcaseUI.renderMainGrid()" class="tactic-btn" style="width:50px; height:50px; border-radius:50%; background:rgba(0,0,0,0.8); border:1px solid var(--accent-gold); color:var(--accent-gold);">
                <i class="fas fa-briefcase"></i>
            </button>
        `;
        document.body.appendChild(overlay);
    },

    toggleNames() {
        window.Arena.showNames = !window.Arena.showNames;
        window.Arena.draw();
    }
};
