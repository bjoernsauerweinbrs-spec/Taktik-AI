/**
 * TONI 2.0 - AKTENTASCHE UI (MASTER FIX)
 * Stellt das 3x3 Kachel-Grid wieder her und verknüpft die Sektoren.
 */
window.BriefcaseUI = {
    isOpen: false,

    toggle() {
        const modal = document.getElementById('briefcase-modal');
        if (!modal) return;
        this.isOpen = !this.isOpen;
        
        // Modal anzeigen/verstecken
        modal.style.display = this.isOpen ? 'flex' : 'none';
        
        // Sicherheit: Modal immer über die Arena legen
        modal.style.zIndex = "100000"; 

        if (this.isOpen) {
            this.renderMainGrid();
        }
    },

    renderMainGrid() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // Wir erzwingen hier die exakte Struktur aus deinem style.css
        // Nutzt .management-grid (3 Spalten) und .mgmt-card (Kacheln)
        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase;">ZENTRALE</h2>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin-top: 15px;">
            </div>
            
            <div class="management-grid">
                <div class="mgmt-card" onclick="openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>20 Spieler & FIFA Karten</p>
                </div>

                <div class="mgmt-card" onclick="openSection('analyse')">
                    <div class="card-header"><i class="fas fa-heartbeat pulse-anim"></i> ANALYSE</div>
                    <p>Puls & Fitness-Daten</p>
                </div>

                <div class="mgmt-card" onclick="alert('Business-Sektor lädt...')">
                    <div class="card-header"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoren & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="alert('Print-Engine (Nino) wird initialisiert...')">
                    <div class="card-header"><i class="fas fa-print"></i> STADION</div>
                    <p>Stadion-Zeitung (Print)</p>
                </div>

                <div class="mgmt-card" onclick="alert('Materialkammer geöffnet...')">
                    <div class="card-header"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>Equipment & Material</p>
                </div>

                <div class="mgmt-card" onclick="alert('Video-Bibliothek lädt...')">
                    <div class="card-header"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Video-Analyse</p>
                </div>

                <div class="mgmt-card" onclick="alert('Scouting-Datenbank wird gescannt...')">
                    <div class="card-header"><i class="fas fa-search"></i> SCOUTING</div>
                    <p>Spielersuche</p>
                </div>

                <div class="mgmt-card" onclick="alert('Taktik-Board aktiviert...')">
                    <div class="card-header"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formationen & Befehle</p>
                </div>

                <div class="mgmt-card" onclick="alert('System-Einstellungen...')">
                    <div class="card-header"><i class="fas fa-cog"></i> SETTINGS</div>
                    <p>Ollama & System-Config</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <button class="pro-btn-gold" style="width: 250px; padding: 15px;" onclick="toggleBriefcase()">SCHLIESSEN</button>
            </div>
        `;
    }
};
