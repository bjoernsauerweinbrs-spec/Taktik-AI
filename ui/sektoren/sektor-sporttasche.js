/**
 * TONI 2.0 - AKTENTASCHE UI (MASTER ROUTER)
 * Status: FINALISIERT basierend auf Sektor-Codes & GitHub-Struktur
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Zentrale initialisiert.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;
        this.isOpen = !this.isOpen;
        overlay.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.renderMainGrid();
    },

    /**
     * ZENTRALE MIT 4 KATEGORIEN (Vorbereitung für Aufräum-Aktion)
     */
    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: var(--neon-green); font-family: 'Orbitron'; letter-spacing: 5px;">ZENTRALE</h2>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" style="border: 1px solid var(--neon-green); padding: 20px; background: rgba(57, 255, 20, 0.05);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 15px; font-size: 0.8rem; letter-spacing: 1px;">⚽ SPIEL & TRAINING</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('kabine')"><i class="fas fa-users"></i> KABINE (FIFA-CARDS)</button>
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('junioren')"><i class="fas fa-graduation-cap"></i> JUNIOREN-ZENTRALE</button>
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('transfer')"><i class="fas fa-exchange-alt"></i> TRANSFER & KADER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid #fff; padding: 20px; background: rgba(255, 255, 255, 0.05);">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 15px; font-size: 0.8rem; letter-spacing: 1px;">📰 MEDIEN & PRESSE</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('stadion')"><i class="fas fa-newspaper"></i> STADIONZEITUNG</button>
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('stammplatz')"><i class="fas fa-id-badge"></i> STICKER-STUDIO</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 20px; background: rgba(255, 204, 0, 0.05);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.8rem; letter-spacing: 1px;">📈 BUSINESS & ORGA</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('management')"><i class="fas fa-handshake"></i> PARTNER-POOL</button>
                        <button class="tactic-btn" style="width:100%; text-align:left;" onclick="window.openSection('analyse')"><i class="fas fa-chart-line"></i> PERFORMANCE-CHECK</button>
                    </div>
                </div>

            </div>

            <div id="briefcase-content" class="hidden" style="margin-top: 30px;">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" style="border-color: var(--neon-green); color: var(--neon-green);" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    },

    renderTransferCenter() {
        const active = document.getElementById('active-content');
        if (!active) return;
        const players = window.Database ? (window.Database.players || []) : [];
        active.innerHTML = `
            <div style="background: rgba(255,255,255,0.03); padding: 30px; border-radius: 15px; border: 1px solid #333;">
                <h3 style="color: var(--neon-green); font-family: 'Orbitron';">TRANSFER-ZENTRUM</h3>
                <p>Aktueller Kader: <b>${players.length} Spieler</b> im System.</p>
                <hr style="border: 0; border-top: 1px solid #444; margin: 20px 0;">
                <button class="pro-btn-gold" onclick="window.openSection('kabine')">ZUR KABINE (STATS BEARBEITEN)</button>
            </div>`;
    }
};

/**
 * GLOBALER ROUTER - REPARIERT FÜR ALLE SEKTOREN
 */
window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const backBtn = document.getElementById('back-to-hub');

    if(nav) nav.style.display = 'none';
    if(content) content.classList.remove('hidden');
    if(backBtn) backBtn.classList.remove('hidden');

    try {
        switch(section) {
            case 'management':
                if(window.SektorManagement) window.SektorManagement.open();
                break;
            
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

            case 'kabine':
                if(window.SektorSporttasche) window.SektorSporttasche.open();
                break;

            case 'junioren':
                if(window.SektorJunioren) window.SektorJunioren.open();
                break;

            case 'transfer':
                window.BriefcaseUI.renderTransferCenter();
                break;

            case 'analyse':
                if(window.SektorAnalyse) window.SektorAnalyse.open();
                break;
        }
    } catch (e) {
        console.error("Routing-Fehler:", e);
    }
};
