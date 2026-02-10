/**
 * TONI 2.0 - AKTENTASCHE UI (ULTIMATE RECOVERY FIX)
 * Status: REPARIERT - Sichtbarkeit wird nun erzwungen
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI System initialisiert.");
        // Sicherstellen, dass das Overlay beim Start wirklich zu ist
        const overlay = document.getElementById('briefcase-overlay');
        if(overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) {
            console.error("FEHLER: 'briefcase-overlay' nicht gefunden!");
            return;
        }

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            // FIX: Wir entfernen alle Blockaden und erzwingen Display Flex
            overlay.classList.remove('hidden');
            overlay.style.setProperty('display', 'flex', 'important'); 
            this.renderMainGrid();
            console.log("Tasche wird geöffnet...");
        } else {
            overlay.style.setProperty('display', 'none', 'important');
            overlay.classList.add('hidden');
            console.log("Tasche wird geschlossen.");
        }
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) {
            console.error("FEHLER: '.briefcase-window' fehlt!");
            return;
        }

        windowBody.style.overflowY = "auto";
        // Wir injizieren das komplette Hub-Layout
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem; padding: 10px;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" style="border: 1px solid var(--neon-green); padding: 20px; background: rgba(57, 255, 20, 0.03);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">⚽ SPIEL & TRAINING</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('kabine')"><i class="fas fa-users"></i> KABINE</button>
                        <button class="tactic-btn" onclick="window.openSection('junioren')"><i class="fas fa-graduation-cap"></i> JUNIOREN</button>
                        <button class="tactic-btn" onclick="window.openSection('transfer')"><i class="fas fa-exchange-alt"></i> TRANSFER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid #fff; padding: 20px; background: rgba(255, 255, 255, 0.03);">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📰 MEDIEN & PRESSE</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('stadion')"><i class="fas fa-newspaper"></i> STADIONZEITUNG</button>
                        <button class="tactic-btn" onclick="window.openSection('stammplatz')"><i class="fas fa-id-badge"></i> STICKER-STUDIO</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 20px; background: rgba(255, 204, 0, 0.03);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📈 BUSINESS & ORGA</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('management')"><i class="fas fa-handshake"></i> PARTNER-POOL</button>
                        <button class="tactic-btn" onclick="window.openSection('analyse')"><i class="fas fa-heartbeat"></i> ANALYSE</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); padding: 20px; background: rgba(0, 255, 255, 0.03);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📦 LOGISTIK & SKILLS</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" onclick="window.openSection('material')"><i class="fas fa-box-open"></i> LAGER & BESTAND</button>
                        <button class="tactic-btn" onclick="window.openSection('video')"><i class="fas fa-video"></i> VIDEO-ANALYSE</button>
                    </div>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px; min-height: 400px;">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px; padding-bottom: 50px;">
                <button class="pro-btn" style="border: 1px solid var(--neon-green); color: var(--neon-green); background: none; padding: 10px 20px; cursor: pointer;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    }
};

/**
 * REPARIERTER ROUTER
 */
window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');
    const activeContent = document.getElementById('active-content');

    if(nav) nav.style.display = 'none';
    if(content) content.classList.remove('hidden');
    if(backBtn) backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'management': if(window.SektorManagement) window.SektorManagement.open(); break;
            case 'stadion': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('magazine'); }, 50);
                }
                break;
            case 'stammplatz': 
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('stammplatz'); }, 50);
                }
                break;
            case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
            case 'junioren': if(window.SektorJunioren) window.SektorJunioren.open(); break;
            case 'transfer': 
                if(window.BriefcaseUI.renderTransferCenter) window.BriefcaseUI.renderTransferCenter(); 
                break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            default:
                if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor ${section} wird geladen...</p>`;
        }
    } catch (e) { console.error("Router Fehler:", e); }
};
