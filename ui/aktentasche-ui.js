/**
 * TONI 2.0 - BRIEFCASE UI (ZENTRALE)
 * Verwaltet das 9-Kachel-Raster und das Laden der Sektoren
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase System Online");
        // Event-Bus Listener könnten hier hin
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        this.isOpen = !this.isOpen;
        overlay.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.renderMainGrid();
    },

    renderMainGrid() {
        const content = document.getElementById('active-content');
        content.innerHTML = `
            <div class="kabine-header">
                <h1 style="color: var(--neon-green); letter-spacing: 5px; text-align:center;">ZENTRALE</h1>
            </div>
            <div class="management-grid">
                <div class="mgmt-card" onclick="window.SektorSporttasche.open()">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>50+ Spieler als FIFA-Karten. Ratings & Anwesenheit.</p>
                </div>
                <div class="mgmt-card" onclick="window.SektorAnalyse.open()">
                    <div class="card-header"><i class="fas fa-heartbeat pulse-anim"></i> ANALYSE</div>
                    <p>Vitals: Puls, Kilometer, Schlaf. Manuelle Dateneingabe.</p>
                </div>
                <div class="mgmt-card" onclick="alert('Business Sektor lädt...')">
                    <div class="card-header"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoren, Finanzen & Vereinsführung.</p>
                </div>
                <div class="mgmt-card" onclick="alert('Stadion-Zeitung (Nino) wird generiert...')">
                    <div class="card-header"><i class="fas fa-print"></i> STADION</div>
                    <p>Print-Engine: Stadion-Zeitung (A4).</p>
                </div>
                <div class="mgmt-card" onclick="alert('Materialkammer offen')">
                    <div class="card-header"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>Equipment: Hütchen, Bälle, Stangen für die Arena.</p>
                </div>
                <div class="mgmt-card" onclick="alert('Video-Bibliothek')">
                    <div class="card-header"><i class="fas fa-play-circle"></i> SKILLS</div>
                    <p>Technik-Videos & Split-Screen Analyse.</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-search"></i> SCOUTING</div>
                    <p>Externe Datenbank & Spielersuche.</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formationen & Toni-Befehlskette.</p>
                </div>
                <div class="mgmt-card">
                    <div class="card-header"><i class="fas fa-robot"></i> SETTINGS</div>
                    <p>System & Ollama KI-Anleitung.</p>
                </div>
            </div>
            <button class="pro-btn-gold" onclick="window.BriefcaseUI.toggle()" style="margin-top:20px; width: 200px; display:block; margin-left:auto; margin-right:auto;">X SCHLIESSEN</button>
        `;
    }
};
