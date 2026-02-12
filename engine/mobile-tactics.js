/**
 * TONI 2.0 - MOBILE TACTICS CONTROLLER (ELITE SYNC)
 * Fokus: Ein-/Auswechslung, Board-Interaktion & Hotkeys
 * Status: ETAPPE 1.4 - STEUERUNG VERSIEGELT
 */
window.MobileTactics = {
    selectedBenchId: null,

    init() {
        console.log("📱 Mobile Tactics: Steuerungssystem synchronisiert.");
        this.setupBoardInteractions();
        this.createHotkeyOverlay();
    },

    /**
     * Logik für die Ersatzbank (Mini-Cards)
     */
    handleBenchClick(playerId) {
        // Falls bereits ausgewählt, Auswahl aufheben
        if (this.selectedBenchId === playerId) {
            this.selectedBenchId = null;
            this.refreshBenchUI();
            return;
        }

        this.selectedBenchId = playerId;
        this.refreshBenchUI();
        
        if(window.ToniVoice) {
            const player = window.Database.players.find(p => p.id == playerId);
            window.ToniVoice.speak(player.name.split(' ').pop() + " bereit zum Einsatz.");
        }
    },

    /**
     * Verknüpft das Spielfeld mit der Einwechslungs-Logik
     */
    setupBoardInteractions() {
        const canvas = document.getElementById('tactic-board');
        if (!canvas) return;

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            // 1. Wenn ein Bank-Spieler ausgewählt ist -> Einwechseln
            if (this.selectedBenchId) {
                this.executeSubstitution(x, y);
            } 
            // 2. Wenn kein Bank-Spieler gewählt ist -> Prüfen ob Spieler angeklickt für Auswechslung
            else {
                this.checkForRemoval(x, y);
            }
        });
    },

    /**
     * Bringt einen Spieler von der Bank aufs Feld
     */
    executeSubstitution(x, y) {
        const player = window.Database.players.find(p => p.id == this.selectedBenchId);
        if (player) {
            player.onField = true;
            player.x = x;
            player.y = y;
            
            this.selectedBenchId = null; // Auswahl zurücksetzen
            window.Database.save();
            
            if (window.Arena) {
                window.Arena.draw();
                window.Arena.renderBench();
            }
            this.refreshBenchUI();
        }
    },

    /**
     * Nimmt einen Spieler vom Feld (Rechtsklick oder Doppel-Tap simulieren)
     * Hier: Wenn man auf einen Spieler klickt, der schon auf dem Feld ist.
     */
    checkForRemoval(x, y) {
        const player = window.Database.players.find(p => 
            p.onField && Math.hypot(p.x - x, p.y - y) < 25
        );

        if (player) {
            player.onField = false;
            window.Database.save();
            if (window.Arena) {
                window.Arena.draw();
                window.Arena.renderBench();
            }
        }
    },

    /**
     * Aktualisiert das visuelle Feedback auf der Ersatzbank
     */
    refreshBenchUI() {
        document.querySelectorAll('.fifa-card-mini').forEach(card => {
            card.style.borderColor = 'var(--accent-gold)';
            card.style.boxShadow = 'none';
        });

        if (this.selectedBenchId) {
            // Wir suchen das Element über ein Daten-Attribut (muss in Arena.renderBench ergänzt werden)
            const activeCard = document.querySelector(`[data-id="${this.selectedBenchId}"]`);
            if (activeCard) {
                activeCard.style.borderColor = 'var(--neon-green)';
                activeCard.style.boxShadow = '0 0 20px var(--neon-green)';
            }
        }
    },

    createHotkeyOverlay() {
        if (document.getElementById('mobile-hotkeys')) return;
        const overlay = document.createElement('div');
        overlay.id = 'mobile-hotkeys';
        overlay.style = "position: fixed; bottom: 90px; right: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 1000;";
        
        overlay.innerHTML = `
            <button onclick="location.reload()" class="send-btn" style="background:#111; color:#ff3b30; border:1px solid #ff3b30;"><i class="fas fa-power-off"></i></button>
            <button onclick="window.BriefcaseUI.toggle()" class="send-btn"><i class="fas fa-folder-open"></i></button>
        `;
        document.body.appendChild(overlay);
    }
};
