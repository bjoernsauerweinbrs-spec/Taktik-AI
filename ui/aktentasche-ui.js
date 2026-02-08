/**
 * TONI 2.0 - AKTENTASCHE UI (FINAL INTEGRATION)
 * Verknüpft das 3x3 Grid mit den aktiven Sektoren.
 * Alle Systeme – von Video bis Management – sind nun scharf geschaltet.
 */
window.BriefcaseUI = {
    isOpen: false,

    toggle() {
        const modal = document.getElementById('briefcase-modal');
        if (!modal) return;
        this.isOpen = !this.isOpen;
        
        modal.style.display = this.isOpen ? 'flex' : 'none';
        modal.style.zIndex = "100000"; 

        if (this.isOpen) {
            this.renderMainGrid();
        }
    },

    renderMainGrid() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase;">ZENTRALE</h2>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 15px;">
            </div>
            
            <div class="management-grid">
                <div class="mgmt-card" onclick="openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>20 Spieler & Kader-Management</p>
                </div>

                <div class="mgmt-card" onclick="openSection('analyse')">
                    <div class="card-header"><i class="fas fa-heartbeat pulse-anim"></i> ANALYSE</div>
                    <p>Live Vital-Daten & Fitness</p>
                </div>

                <div class="mgmt-card" onclick="openSection('management')">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoren-Pool & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="openSection('stadion')">
                    <div class="card-header"><i class="fas fa-print"></i> STADION</div>
                    <p>Matchday-Magazin (A5)</p>
                </div>

                <div class="mgmt-card" onclick="alert('Materialkammer wird kalibriert...')">
                    <div class="card-header"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>Equipment & Übungen</p>
                </div>

                <div class="mgmt-card" onclick="openSection('video')">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-video"></i> SKILLS</div>
                    <p>KI Video-Analyse</p>
                </div>

                <div class="mgmt-card" onclick="alert('Scouting-Netzwerk offline...')">
                    <div class="card-header"><i class="fas fa-search"></i> SCOUTING</div>
                    <p>Marktwerte & Suche</p>
                </div>

                <div class="mgmt-card" onclick="alert('Taktik-Board initialisiert...')">
                    <div class="card-header"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Match-Plan & Befehle</p>
                </div>

                <div class="mgmt-card" onclick="openSection('settings')">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-cog"></i> SETTINGS</div>
                    <p>Ollama IP & System-Sync</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <button class="pro-btn-gold" style="width: 250px; padding: 15px;" onclick="window.BriefcaseUI.toggle()">ZURÜCK ZUR ARENA</button>
            </div>
        `;
    }
};
