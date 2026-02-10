/**
 * TONI 2.0 - MASTER HUB UI (RESTRUCTURED 2026)
 * Fokus: Rollentrennung Pro/Jugend & Pitch-Setup
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("🚀 TONI Zentrale: System-Check startet...");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            overlay.classList.remove('hidden');
            overlay.style.setProperty('display', 'flex', 'important');
            overlay.style.zIndex = "999999"; 
            this.renderMainGrid();
        } else {
            overlay.style.setProperty('display', 'none', 'important');
            overlay.classList.add('hidden');
        }
    },

    switchSektor(section) {
        if (!this.isOpen) this.toggle();
        window.openSection(section);
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">TONI ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: var(--status-error); font-size: 1.5rem; padding: 10px;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid">
                
                <div class="mgmt-card" style="border-color: var(--neon-green);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">⚽ PRO AREA</div>
                    <button class="tactic-btn" onclick="window.openSection('kabine')"><i class="fas fa-users-cog"></i> KABINE (STATS & TRANSFERS)</button>
                    <button class="tactic-btn" onclick="window.openSection('matchmappe')"><i class="fas fa-file-invoice"></i> MATCH-MAPPE</button>
                    <button class="tactic-btn" onclick="window.openSection('training')"><i class="fas fa-clipboard-list"></i> TRAININGS-PLANER</button>
                    
                    <div style="margin-top:15px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.05);">
                        <span style="font-size:0.55rem; color:#555; letter-spacing:1px;">ARENA-MODUS:</span>
                        <div style="display:flex; gap:5px; margin-top:5px;">
                            <button class="tactic-btn" style="flex:1; font-size:0.55rem; padding:5px;" onclick="window.arena.setPitchMode('funino')">FUNINO</button>
                            <button class="tactic-btn" style="flex:1; font-size:0.55rem; padding:5px;" onclick="window.arena.setPitchMode('kleinfeld')">KLEINFELD</button>
                            <button class="tactic-btn" style="flex:1; font-size:0.55rem; padding:5px;" onclick="window.arena.setPitchMode('grossfeld')">NORMAL</button>
                        </div>
                    </div>
                </div>

                <div class="mgmt-card" style="border-color: var(--data-cyan);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">🎓 ACADEMY</div>
                    <button class="tactic-btn" onclick="window.openSection('junioren_pool')"><i class="fas fa-sitemap"></i> JUGEND-KADER (A-G)</button>
                    <button class="tactic-btn" onclick="window.openSection('stammplatz')"><i class="fas fa-id-badge"></i> MISSION STAMMPLATZ</button>
                    <button class="tactic-btn" onclick="window.openSection('scouting')"><i class="fas fa-search"></i> TALENT-SCOUTING</button>
                </div>

                <div class="mgmt-card" style="border-color: var(--accent-gold);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📈 BUSINESS</div>
                    <button class="tactic-btn" onclick="window.openSection('management')"><i class="fas fa-handshake"></i> PARTNER-POOL</button>
                    <button class="tactic-btn" onclick="window.openSection('analyse')"><i class="fas fa-heartbeat"></i> PERFORMANCE-HUB</button>
                    <button class="tactic-btn" onclick="window.openSection('material')"><i class="fas fa-box"></i> LAGER / LOGISTIK</button>
                </div>

                <div class="mgmt-card" style="border-color: #fff;">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📺 MEDIA</div>
                    <button class="tactic-btn" onclick="window.openSection('stadionzeitung')"><i class="fas fa-newspaper"></i> MATCHDAY REPORT</button>
                    <button class="tactic-btn" onclick="window.openSection('video')"><i class="fas fa-video"></i> VIDEO-ARCHIV</button>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content" class="fadeIn"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px; padding-bottom: 50px;">
                <button class="pro-btn" style="border: 1px solid var(--neon-green); color: var(--neon-green); background: none; padding: 10px 20px; cursor: pointer; font-family:'Orbitron'; font-size:0.7rem;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    }
};

/**
 * GLOBALER ROUTER (AKTUALISIERT)
 */
window.openSection = function(section) {
    console.log("📂 Sektor-Anfrage:", section);
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');
    const activeContent = document.getElementById('active-content');

    if(nav) nav.style.display = 'none';
    if(content) content.classList.remove('hidden');
    if(backBtn) backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'matchmappe': if(window.SektorMatchMappe) window.SektorMatchMappe.open(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.open(); break;
            case 'junioren_pool': if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'stammplatz': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('stammplatz'); }, 50);
                } break;
            case 'scouting': if(window.SektorScouting) window.SektorScouting.open(); break;
            case 'management': if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'stadionzeitung': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('magazine'); }, 50);
                } break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            case 'system': 
            case 'settings': if(window.SektorSettings) window.SektorSettings.open(); break;
            default:
                if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor <b>${section}</b> wird vorbereitet.</p>`;
        }
    } catch (e) {
        console.error("Router-Fehler:", e);
    }
};

window.BriefcaseUI.init();
