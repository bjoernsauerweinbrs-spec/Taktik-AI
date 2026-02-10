/**
 * TONI 2.0 - AKTENTASCHE UI (MASTER ROUTER)
 * Status: VOLLSTÄNDIG ABGEGLICHEN MIT SEKTOR-DATEIEN
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("Briefcase UI initialisiert.");
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;
        this.isOpen = !this.isOpen;
        overlay.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) this.renderMainGrid();
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="color: var(--neon-green); font-family: 'Orbitron'; letter-spacing: 5px;">ZENTRALE</h2>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #666; font-size: 1.5rem;"></i>
            </div>
            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <div class="mgmt-card" onclick="window.openSection('transfer')" style="border:1px solid #fff; cursor:pointer;">
                    <div class="card-header"><i class="fas fa-exchange-alt"></i> TRANSFER & KADER</div>
                    <p>Spieler hinzufügen & entfernen</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('kabine')" style="cursor:pointer;">
                    <div class="card-header"><i class="fas fa-users"></i> KABINE</div>
                    <p>Kader & FIFA-Cards</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('management')" style="border:1px solid var(--accent-gold); cursor:pointer;">
                    <div class="card-header" style="color: var(--accent-gold);"><i class="fas fa-chart-line"></i> BUSINESS</div>
                    <p>Sponsoring & Pool</p>
                </div>
                <div class="mgmt-card" onclick="window.openSection('stadion')" style="cursor:pointer;">
                    <div class="card-header"><i class="fas fa-newspaper"></i> STADION</div>
                    <p>Stadionzeitung & Print</p>
                </div>
            </div>
            <div id="briefcase-content" class="hidden"><div id="active-content"></div></div>
            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
            </div>
        `;
    },

    renderTransferCenter() {
        const active = document.getElementById('active-content');
        if (active) {
            // Falls du eine eigene Sektor-Datei für Transfer hast, hier window.SektorTransfer.open()
            // Ansonsten nutzen wir deine interne renderTransferCenter Logik:
            const players = window.Database ? window.Database.players : [];
            active.innerHTML = `<h3>TRANSFER-ZENTRUM</h3><p>Aktueller Kader: ${players.length} Spieler.</p>`;
        }
    }
};

/**
 * DER GLOBALE ROUTER (EXAKT GEMAPPT)
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
                // Nutzt deine gesendete Datei
                if(window.SektorManagement) window.SektorManagement.open();
                break;
            
            case 'stadion':
                // Nutzt das Media Hub Modul
                if(window.SektorTemplates) {
                    window.SektorTemplates.render();
                    setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('magazine'); }, 50);
                }
                break;

            case 'kabine':
                // Nutzt die FIFA-Card Logik
                if(window.SektorSporttasche) window.SektorSporttasche.open();
                break;

            case 'transfer':
                window.BriefcaseUI.renderTransferCenter();
                break;

            case 'junioren':
                if(window.SektorJunioren) window.SektorJunioren.open();
                break;
        }
    } catch (e) {
        console.error("Routing Fehler:", e);
    }
};
