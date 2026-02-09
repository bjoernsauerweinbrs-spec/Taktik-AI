/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE RECOVERY)
 * Status: FINALISIERT & SYNCHRONISIERT
 * Fix: ID-Matching mit app.html (briefcase-overlay) & Routing-Schutz.
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI System initialisiert.");
        // Falls beim Laden noch Reste im Modal sind, säubern wir es
        const content = document.getElementById('active-content');
        if(content) content.innerHTML = '';
    },

    toggle() {
        // FIX: Wir greifen auf die ID aus der app.html zu (briefcase-overlay)
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) {
            console.error("Fehler: briefcase-overlay nicht in app.html gefunden!");
            return;
        }

        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            overlay.style.display = 'flex';
            overlay.classList.remove('hidden');
            this.renderMainGrid();
        } else {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
        }
    },

    /**
     * Haupt-Navigator (3x3 Grid)
     */
    renderMainGrid() {
        // Wir nutzen den Container innerhalb des Windows für das Grid
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        // Clipping-Schutz & Scrollbarkeit für Mobile/MacBook
        windowBody.style.overflowY = "auto";
        windowBody.style.paddingBottom = "50px"; 

        // Titel und Grid rendern
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div class="mgmt-card" onclick="openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & Spielerprofile</p>
                </div>

                <div class="mgmt-card" onclick="openSection('analyse')">
                    <div class="card-header"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p>Vital-Check & Performance</p>
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
            
            <div style="text-align: center; margin-top: 40px;">
                <button class="pro-btn-gold" style="padding: 15px 40px; border-radius: 30px; cursor:pointer;" onclick="window.BriefcaseUI.toggle()">ZURÜCK ZUR ARENA</button>
            </div>
        `;
    },

    toggleVoice() {
        console.log("Sprachsteuerung aktiviert...");
        // Hier kommt später die Toni-Voice Logik rein
    }
};

/**
 * Globaler Router für die Aktentasche
 */
window.openSection = function(section) {
    console.log("Routing nach:", section);
    
    // Kleiner Schutz, falls ein Sektor-Skript noch nicht geladen wurde
    try {
        switch(section) {
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'management': if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'stadion': if(window.SektorStadion) window.SektorStadion.open(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            case 'matchday': if(window.SektorMatchday) window.SektorMatchday.open(); break;
            case 'taktik': if(window.SektorTaktik) window.SektorTaktik.open(); break;
            case 'settings': if(window.SektorSettings) window.SektorSettings.open(); break;
            default: console.warn("Sektor unbekannt:", section);
        }
    } catch (e) {
        alert("Sektor " + section + " wird noch geladen oder Datei fehlt.");
        console.error(e);
    }
};
