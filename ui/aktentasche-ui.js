/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE RECOVERY)
 * Status: ALLE KACHELN ERHALTEN & JUNIOREN FIX
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

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.style.paddingBottom = "50px"; 

        // WICHTIG: Hier sind ALLE deine Kacheln wieder drin!
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" onclick="window.openSection('junioren')" style="border: 1px solid var(--neon-green); box-shadow: 0 0 15px rgba(57, 255, 20, 0.1); cursor: pointer;">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-graduation-cap"></i> JUNIOREN</div>
                    <p>G- bis A-Jugend Verwaltung</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('kabine')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & Spielerprofile</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('analyse')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-heartbeat"></i> ANALYSE</div>
                    <p>Vital-Check & Performance</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('management')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoring & Finanzen</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('stadion')" style="cursor: pointer;">
                    <div class="card-header"><i class="fas fa-newspaper"></i> STADION</div>
                    <p>Stadionzeitung (A5)</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('training')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-dumbbell"></i> TRAINING</div>
                    <p>KI-Einheiten & Archiv</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('material')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-box-open"></i> LAGER</div>
                    <p>Material & Bestandsliste</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('video')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--data-cyan);"><i class="fas fa-video"></i> SKILLS</div>
                    <p>Video-Analyse & Vektoren</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('matchday')" style="cursor: pointer;">
                    <div class="card-header" style="color: var(--accent-orange);"><i class="fas fa-clipboard-list"></i> MATCHDAY</div>
                    <p>Match-Plan & Gegner</p>
                </div>

                <div class="mgmt-card" onclick="window.openSection('taktik')" style="cursor: pointer;">
                    <div class="card-header" style="color: #ff3b30;"><i class="fas fa-chess-board"></i> TAKTIK</div>
                    <p>Formation & Spielzüge</p>
                </div>
            </div>
            
            <div id="briefcase-content" class="hidden">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    }
};

/**
 * GLOBALER ROUTER
 */
window.openSection = function(section) {
    console.log("Routing nach:", section);
    
    // UI-Wechsel: Grid verstecken, Content & Back-Button zeigen
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');

    if(nav) nav.style.display = 'none';
    if(content) content.classList.remove('hidden');
    if(backBtn) backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'junioren': if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'management': if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'stadion': if(window.SektorStadion) window.SektorStadion.open(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            case 'matchday': if(window.SektorMatchday) window.SektorMatchday.open(); break;
            case 'taktik': if(window.SektorTaktik) window.SektorTaktik.open(); break;
            default: console.warn("Sektor unbekannt:", section);
        }
    } catch (e) {
        console.error("Sektor-Ladefehler:", e);
    }
};
