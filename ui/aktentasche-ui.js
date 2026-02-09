/**
 * TONI 2.0 - AKTENTASCHE UI (FINALER FIX)
 * Fokus: Struktur-Erhalt für Sektor-Inhalte
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI System initialisiert.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;
        overlay.style.display = this.isOpen ? 'flex' : 'none';
        
        if (this.isOpen) {
            overlay.classList.remove('hidden');
            this.renderMainGrid();
        }
    },

    /**
     * Rendert das Haupt-Navigations-Grid
     */
    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        // WICHTIG: Wir erhalten die Grundstruktur (Titel & Close) 
        // und nutzen nur einen Bereich für das Grid.
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 id="sector-title" style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <div id="briefcase-nav">
                <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">
                <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    
                    <div class="mgmt-card" onclick="window.openSection('junioren')" style="border: 1px solid var(--neon-green); box-shadow: 0 0 15px rgba(57, 255, 20, 0.1); cursor: pointer;">
                        <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-graduation-cap"></i> JUNIOREN</div>
                        <p>G- bis A-Jugend Verwaltung</p>
                    </div>

                    <div class="mgmt-card" onclick="window.openSection('kabine')" style="cursor: pointer;">
                        <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                        <p>Kader & Spielerprofile</p>
                    </div>

                    <div class="mgmt-card" onclick="window.openSection('matchday')" style="cursor: pointer;">
                        <div class="card-header" style="color: var(--accent-orange);"><i class="fas fa-clipboard-list"></i> MATCHDAY</div>
                        <p>Match-Plan & Motivation</p>
                    </div>

                    </div>
            </div>

            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content"></div>
            </div>
        `;
    }
};

/**
 * Globaler Router (Repariert)
 */
window.openSection = function(section) {
    console.log("Routing nach:", section);
    
    // Zuerst das Nav-Grid verstecken, um Platz für den Sektor zu machen
    const nav = document.getElementById('briefcase-nav');
    if(nav) nav.style.display = 'none';

    try {
        switch(section) {
            case 'junioren': 
                if(window.SektorJunioren) window.SektorJunioren.open(); 
                break;
            case 'kabine': 
                if(window.SektorSporttasche) window.SektorSporttasche.open(); 
                break;
            case 'matchday': 
                if(window.SektorMatchday) window.SektorMatchday.open(); 
                break;
            default: 
                console.warn("Sektor noch nicht implementiert:", section);
        }
    } catch (e) {
        console.error("Fehler beim Öffnen des Sektors:", e);
    }
};
