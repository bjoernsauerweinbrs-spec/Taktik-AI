/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE RECOVERY)
 * Fix: Alle Sektoren verknüpft, Clipping-Schutz & stabile Navigation.
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

    /**
     * Haupt-Navigator (3x3 Grid)
     */
    renderMainGrid() {
        const content = document.querySelector('.briefcase-window');
        if (!content) return;

        // CSS Fix: Verhindert das Abschneiden der Karten und sorgt für Scrollbarkeit
        content.style.overflowY = "auto";
        content.style.maxHeight = "90vh";
        content.style.paddingBottom = "50px"; 

        content.innerHTML = `
            <div class="kabine-header" style="text-align:center; margin-bottom: 30px;">
                <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin-bottom:5px;">ZENTRALE</h2>
                <p style="color: #666; font-size: 0.7rem; letter-spacing: 2px;">STRATEGIC HUB & UNIT CONTROL</p>
                <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-top: 15px; width: 60%; margin-left: auto; margin-right: auto;">
            </div>
            
            <div class="management-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                <div class="mgmt-card" onclick="openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & Spielerprofile</p>
                </div>

                <div class="mgmt-card" onclick="openSection('analyse')">
                    <div class="card-header"><i class="fas fa-heartbeat pulse-anim"></i> ANALYSE</div>
                    <p>Vital-Check & Körperfett</p>
                </div>

                <div class="mgmt-card" onclick="openSection('management')">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoring & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="openSection('stadion')">
                    <div class="card-header"><i class="fas fa-newspaper"></i> STADION</div>
                    <p>Stadionzeitung (A5)</p>
                </div>

                <div class="mgmt-card" onclick="openSection('training')">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>KI-Einheiten & Archiv</p>
                </div>

                <div class="mgmt-card" onclick="openSection('material')">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-box-open"></i> LAGER</div>
                    <p>Material & Bestandsliste</p>
                </div>

                <div class="mgmt-card" onclick="openSection('video')">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Video-Analyse & Vektoren</p>
                </div>

                <div class="mgmt-card" onclick="openSection('matchday')">
                    <div class="card-header" style="color: var(--accent-orange);"><i class="fas fa-clipboard-list"></i> MATCHDAY</div>
                    <p>Match-Plan & Gegner</p>
                </div>

                <div class="mgmt-card" onclick="openSection('taktik')">
                    <div class="card-header" style="color: #ff3b30;"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formation & Spielzüge</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 40px; padding-bottom: 20px;">
                <button class="pro-btn-gold" style="width: 250px; padding: 15px; border-radius: 30px;" onclick="window.BriefcaseUI.toggle()">ARENA BETRETEN</button>
            </div>
        `;
    }
};

/**
 * Globaler Router für die Aktentasche
 */
window.openSection = function(section) {
    console.log("Öffne Sektor:", section);
    switch(section) {
        case 'kabine': window.SektorSporttasche.open(); break;
        case 'analyse': window.SektorAnalyse.open(); break;
        case 'management': window.SektorManagement.open(); break;
        case 'stadion': window.SektorStadion.open(); break;
        case 'training': window.SektorTraining.open(); break;
        case 'material': window.SektorMaterial.open(); break;
        case 'video': window.SektorVideo.open(); break;
        case 'matchday': window.SektorMatchday.open(); break;
        case 'taktik': window.SektorTaktik.open(); break;
        case 'settings': window.SektorSettings.open(); break;
        default: console.warn("Sektor nicht gefunden:", section);
    }
};
