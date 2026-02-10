/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE ROUTER & CATEGORY LAYOUT)
 * Status: REPARIERT - TOGGLE-LOGIK STABILISIERT
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI System initialisiert.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) {
            console.error("Kritisches Problem: 'briefcase-overlay' nicht im DOM gefunden!");
            return;
        }

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            // Erst die Klasse weg, dann Display auf Flex für das Layout
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex';
            this.renderMainGrid();
        } else {
            overlay.style.display = 'none';
            overlay.classList.add('hidden');
        }
    },

    renderMainGrid() {
        // Sicherstellen, dass wir das richtige Element ansprechen
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) {
            console.error("Kritisches Problem: '.briefcase-window' nicht gefunden!");
            return;
        }

        windowBody.style.overflowY = "auto";
        // Wir setzen das HTML neu, um sicherzustellen, dass die Kacheln (Nav) sichtbar sind
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <div>
                    <h2 style="color: var(--neon-green); letter-spacing: 5px; text-transform: uppercase; margin:0; font-family: 'Orbitron'; font-size: 1.2rem;">ZENTRALE</h2>
                    <p style="color: #666; font-size: 0.6rem; letter-spacing: 2px; margin: 5px 0 0 0;">STRATEGIC HUB & UNIT CONTROL</p>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            
            <hr style="border: 0; border-top: 1px solid rgba(57, 255, 20, 0.2); margin-bottom: 30px;">

            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                
                <div class="mgmt-card" style="border: 1px solid var(--neon-green); padding: 20px; background: rgba(57, 255, 20, 0.03);">
                    <div style="color: var(--neon-green); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">⚽ SPIEL & TRAINING</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('kabine')"><i class="fas fa-users" style="width:20px;"></i> KABINE (FIFA-CARDS)</button>
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('junioren')"><i class="fas fa-graduation-cap" style="width:20px;"></i> JUNIOREN-ZENTRALE</button>
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('transfer')"><i class="fas fa-exchange-alt" style="width:20px;"></i> TRANSFER & KADER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid #fff; padding: 20px; background: rgba(255, 255, 255, 0.03);">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📰 MEDIEN & PRESSE</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('stadion')"><i class="fas fa-newspaper" style="width:20px;"></i> STADIONZEITUNG</button>
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('stammplatz')"><i class="fas fa-id-badge" style="width:20px;"></i> STICKER-STUDIO</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 20px; background: rgba(255, 204, 0, 0.03);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📈 BUSINESS & ORGA</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('management')"><i class="fas fa-handshake" style="width:20px;"></i> PARTNER-POOL</button>
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('analyse')"><i class="fas fa-heartbeat" style="width:20px;"></i> ANALYSE-ZENTRUM</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); padding: 20px; background: rgba(0, 255, 255, 0.03);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; letter-spacing: 1px; font-family: 'Orbitron';">📦 LOGISTIK & SKILLS</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('material')"><i class="fas fa-box-open" style="width:20px;"></i> LAGER & BESTAND</button>
                        <button class="tactic-btn" style="width:100%; text-align:left; font-size:0.7rem;" onclick="window.openSection('video')"><i class="fas fa-video" style="width:20px;"></i> VIDEO-ANALYSE</button>
                    </div>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    },

    renderTransferCenter() {
        const active = document.getElementById('active-content');
        if (!active) return;
        const players = window.Database ? (window.Database.players || []) : [];
        active.innerHTML = `
            <div style="background:rgba(255,255,255,0.03); padding:30px; border-radius:12px; border:1px solid #333; text-align:center;">
                <h3 style="color:var(--neon-green); font-family:'Orbitron'; margin-bottom:15px;">TRANSFER-ZENTRUM</h3>
                <p style="margin-bottom:20px;">Aktuell verwaltete Spieler: <b style="color:var(--neon-green);">${players.length}</b></p>
                <div style="display:flex; gap:10px; justify-content:center;">
                    <button class="pro-btn-gold" onclick="window.openSection('kabine')">SPIELER PROFILE BEARBEITEN</button>
                </div>
            </div>`;
    }
};

// GLOBALER ROUTER BLEIBT IDENTISCH
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
            case 'transfer': window.BriefcaseUI.renderTransferCenter(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
            case 'material': if(window.SektorMaterial) window.SektorMaterial.open(); break;
            case 'video': if(window.SektorVideo) window.SektorVideo.open(); break;
            default:
                if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor ${section.toUpperCase()} kalibrieren...</p>`;
        }
    } catch (e) { console.error("Routing-Fehler:", e); }
};
