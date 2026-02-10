/**
 * TONI 2.0 - AKTENTASCHE UI (ULTRA-STABIL & ELITE ROUTER)
 * Status: REPARIERT - Alle Sidebar-Funktionen aktiv
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
        console.log("🖱 Klick registriert: Aktentasche Toggle");
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

    // FIX: Funktion für die Sidebar (Setup-Button)
    switchSektor(section) {
        if (!this.isOpen) this.toggle();
        window.openSection(section);
    },

    // FIX: Funktion für den Mikrofon-Button in der Sidebar
    toggleVoice() {
        if (window.ToniVoice && window.ToniVoice.toggle) {
            window.ToniVoice.toggle();
        } else {
            console.warn("ToniVoice System nicht gefunden. Prüfe mic-trigger.");
            // Kleiner visueller Feedback-Effekt
            const mic = document.getElementById('main-mic-btn');
            if(mic) mic.style.color = 'var(--status-error)';
            setTimeout(() => { if(mic) mic.style.color = ''; }, 1000);
        }
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB 2026</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: var(--status-error); font-size: 1.5rem; padding: 10px;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" style="border: 1px solid var(--neon-green); padding: 20px; background: rgba(57, 255, 20, 0.05);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">⚽ SPIEL & TRAINING</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('kabine')"><i class="fas fa-users"></i> KABINE</button>
                        <button class="tactic-btn" onclick="window.openSection('junioren')"><i class="fas fa-graduation-cap"></i> JUNIOREN</button>
                        <button class="tactic-btn" onclick="window.openSection('transfer')"><i class="fas fa-exchange-alt"></i> TRANSFER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 20px; background: rgba(212, 175, 55, 0.05);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📈 BUSINESS & ANALYSE</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('management')"><i class="fas fa-handshake"></i> PARTNER-POOL</button>
                        <button class="tactic-btn" onclick="window.openSection('analyse')"><i class="fas fa-chart-line"></i> PERFORMANCE</button>
                        <button class="tactic-btn" onclick="window.openSection('material')"><i class="fas fa-box-open"></i> LAGER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); padding: 20px; background: rgba(0, 209, 255, 0.05);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📦 LOGISTIK & MEDIEN</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('stadion')"><i class="fas fa-newspaper"></i> STADIONZEITUNG</button>
                        <button class="tactic-btn" onclick="window.openSection('stammplatz')"><i class="fas fa-id-badge"></i> STICKER-STUDIO</button>
                        <button class="tactic-btn" onclick="window.openSection('video')"><i class="fas fa-video"></i> VIDEO-ANALYSE</button>
                    </div>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content" class="fadeIn"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px; padding-bottom: 50px;">
                <button class="pro-btn" style="border: 1px solid var(--neon-green); color: var(--neon-green); background: none; padding: 10px 20px; cursor: pointer;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    }
};

/**
 * GLOBALER ROUTER (FINALE VERSION)
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
            case 'management': 
                if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'kabine': 
                if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'material': 
                if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': 
                if(window.SektorVideo) window.SektorVideo.open(); break;
            case 'junioren': 
                if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'analyse': 
                if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'system': 
                if(window.SektorSettings) window.SektorSettings.open(); break;
            case 'transfer': 
                if(window.BriefcaseUI.renderTransferCenter) window.BriefcaseUI.renderTransferCenter(); break;
            case 'stadion': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('magazine'); }, 50);
                } break;
            case 'stammplatz': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('stammplatz'); }, 50);
                } break;
            default:
                if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor <b>${section}</b> konnte nicht geladen werden.</p>`;
        }
    } catch (e) {
        console.error("Router-Fehler:", e);
    }
};

// Initialisierung
window.BriefcaseUI.init();
