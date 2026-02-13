/**
 * TONI 2.0 - MOBILE TACTICS CONTROLLER (STABILISIERT)
 * Fokus: Drag-Schutz & Saubere Einwechslung
 */
window.MobileTactics = {
    selectedBenchId: null,
    lastClickTime: 0,

    init() {
        console.log("📱 Mobile Tactics: Stabilisierung geladen.");
        this.setupBoardInteractions();
        this.createHotkeyOverlay();
    },

    handleBenchClick(playerId) {
        if (this.selectedBenchId === playerId) {
            this.selectedBenchId = null;
            this.refreshBenchUI();
            return;
        }
        this.selectedBenchId = playerId;
        this.refreshBenchUI();
        
        if(window.ToniVoice) {
            const player = window.Database.players.find(p => p.id == playerId);
            if(player) window.ToniVoice.speak(player.name.split(' ').pop() + " bereit.");
        }
    },

    setupBoardInteractions() {
        const canvas = document.getElementById('tactic-board');
        if (!canvas) return;

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            // 1. Einwechseln, wenn einer von der Bank gewählt ist
            if (this.selectedBenchId) {
                this.executeSubstitution(x, y);
                return;
            } 

            // 2. Doppelklick-Check für Auswechslung (verhindert versehentliches Löschen)
            const now = Date.now();
            if (now - this.lastClickTime < 300) {
                this.checkForRemoval(x, y);
            }
            this.lastClickTime = now;
        });
    },

    executeSubstitution(x, y) {
        const player = window.Database.players.find(p => p.id == this.selectedBenchId);
        if (player) {
            player.onField = true;
            player.x = x;
            player.y = y;
            this.selectedBenchId = null;
            window.Database.save();
            if (window.Arena) window.Arena.draw();
            if (window.Arena) window.Arena.renderBench();
            this.refreshBenchUI();
        }
    },

    checkForRemoval(x, y) {
        const player = window.Database.players.find(p => 
            p.onField && Math.hypot(p.x - x, p.y - y) < 30
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

    refreshBenchUI() {
        document.querySelectorAll('.fifa-card-mini').forEach(card => {
            card.style.border = '1px solid var(--accent-gold)';
            card.style.boxShadow = 'none';
        });
        if (this.selectedBenchId) {
            const activeCard = document.querySelector(`[data-id="${this.selectedBenchId}"]`);
            if (activeCard) {
                activeCard.style.border = '2px solid var(--neon-green)';
                activeCard.style.boxShadow = '0 0 15px var(--neon-green)';
            }
        }
    },

    createHotkeyOverlay() {
        if (document.getElementById('mobile-hotkeys')) return;
        const overlay = document.createElement('div');
        overlay.id = 'mobile-hotkeys';
        overlay.style = "position: fixed; bottom: 100px; left: 20px; display: flex; flex-direction: column; gap: 10px; z-index: 10000;";
        overlay.innerHTML = `
            <button onclick="location.reload()" class="mgmt-card" style="padding:10px; background:#111; border:1px solid #ff3131; color:#ff3131; border-radius:50%;"><i class="fas fa-sync"></i></button>
            <button onclick="window.BriefcaseUI.toggle()" class="mgmt-card" style="padding:10px; background:#111; border:1px solid var(--neon-green); color:var(--neon-green); border-radius:50%;"><i class="fas fa-briefcase"></i></button>
        `;
        document.body.appendChild(overlay);
    }
};
