/**
 * TONI 2.0 - AKTENTASCHE UI (ELITE ROUTER)
 * Status: TIEFENANALYSE ABGESCHLOSSEN - ALLE WEGE AKTIVIERT
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
                <div class="mgmt-card" onclick="window.openSection('junioren')">
                    <div class="card-header" style="color: var(--neon-green);"><i class="fas fa-graduation-cap"></i> JUNIOREN</div>
                    <p>G- bis A-Jugend Verwaltung</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('transfer')">
                    <div class="card-header" style="color: #fff;"><i class="fas fa-exchange-alt"></i> TRANSFER & KADER</div>
                    <p>Spieler hinzufügen & entfernen</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('kabine')">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & FIFA-Cards</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('management')">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoring & Finanzen</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('stadion')">
                    <div class="card-header"><i class="fas fa-newspaper"></i> STADION</div>
                    <p>Stadionzeitung (A5)</p>
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
        const players = window.Database ? window.Database.players : [];
        active.innerHTML = `
            <div style="background:rgba(255,255,255,0.03); padding:20px; border-radius:12px; border:1px solid #333;">
                <h3 style="color:var(--neon-green); font-family:'Orbitron';">TRANSFER-ZENTRUM</h3>
                <p>Aktuell verwaltete Spieler: <b>${players.length}</b></p>
                <button class="pro-btn-gold" onclick="window.openSection('kabine')">ZUR KABINE (PROFILE ÄNDERN)</button>
            </div>`;
    }
};

/**
 * GLOBALER ROUTER - REPARIERT & SYNCHRONISIERT
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
            case 'management':
                if(window.SektorManagement) window.SektorManagement.open();
                break;
            
            case 'stadion':
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    // Kurz warten bis das HTML injiziert ist, dann Tab wechseln
                    setTimeout(() => {
                        if(window.SektorTemplates.switchTab) {
                            window.SektorTemplates.switchTab('magazine');
                        }
                    }, 50);
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

            default:
                if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor ${section} wird initialisiert...</p>`;
        }
    } catch (e) {
        console.error("Routing-Fehler:", e);
    }
};
