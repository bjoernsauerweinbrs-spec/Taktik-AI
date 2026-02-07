/**
 * TONI 2.0 - AKTENTASCHE UI (REPARATUR)
 * Stellt das 3x3 Raster gemäß Master-CSS wieder her.
 */
window.BriefcaseUI = {
    isOpen: false,

    toggle() {
        const modal = document.getElementById('briefcase-modal');
        if (!modal) return;
        this.isOpen = !this.isOpen;
        modal.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.renderMainGrid();
    },

    renderMainGrid() {
        const content = document.getElementById('active-content') || document.querySelector('.briefcase-window');
        if (!content) return;

        // Wir nutzen exakt die Klassen aus deinem Master-CSS:
        // .management-grid und .mgmt-card
        content.innerHTML = `
            <div class="kabine-header">
                <h2 style="color: var(--neon-green); letter-spacing: 3px; text-align:center; margin-bottom:30px;">AKTEN-TASCHE</h2>
            </div>
            
            <div class="management-grid">
                <div class="mgmt-card" onclick="openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>50+ Spieler & FIFA Karten</p>
                </div>
                <div class="mgmt-card" onclick="openSection('analyse')">
                    <div class="card-header"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p>Puls & Fitness-Daten</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-briefcase"></i> BUSINESS</div>
                    <p>Sponsoren & Finanzen</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-print"></i> STADION</div>
                    <p>Print-Engine (Nino)</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>Equipment & Material</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Video-Bibliothek</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-search"></i> SCOUTING</div>
                    <p>Spielersuche</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formationen & Befehle</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-cog"></i> SETTINGS</div>
                    <p>Ollama & System</p>
                </div>
            </div>
            
            <div style="text-align:center; margin-top:30px;">
                <button class="pro-btn-gold" style="width: 200px;" onclick="toggleBriefcase()">SCHLIESSEN</button>
            </div>
        `;
    }
};
