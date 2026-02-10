/**
 * TONI 2.0 - AKTENTASCHE UI (ULTRA-STABIL & SELBSTHEILEND)
 * Status: FINAL RECOVERY - BUTTON-FIX 2026
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("🚀 TONI Zentrale: System-Check startet...");
        // Sicherstellen, dass das Overlay im DOM existiert
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }
    },

    // Die Funktion, die dein Button in der Sidebar aufruft
    toggle() {
        console.log("🖱 Klick registriert: Aktentasche wird angefordert...");
        const overlay = document.getElementById('briefcase-overlay');
        
        if (!overlay) {
            alert("Kritisches Problem: 'briefcase-overlay' fehlt in der app.html!");
            return;
        }

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

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        // Wir injizieren das komplette Hub-Layout NEU, um tote Listener zu vermeiden
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
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" onclick="window.openSection('kabine')">KABINE</button>
                        <button class="tactic-btn" onclick="window.openSection('transfer')">TRANSFER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); padding: 20px; background: rgba(212, 175, 55, 0.05);">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📈 BUSINESS</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" onclick="window.openSection('management')">PARTNER-POOL</button>
                        <button class="tactic-btn" onclick="window.openSection('material')">LAGER</button>
                    </div>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); padding: 20px; background: rgba(0, 209, 255, 0.05);">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 15px; font-size: 0.75rem; font-family: 'Orbitron';">📦 LOGISTIK</div>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="tactic-btn" onclick="window.openSection('stadion')">STADIONZEITUNG</button>
                        <button class="tactic-btn" onclick="window.openSection('video')">VIDEO-ANALYSE</button>
                    </div>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="margin-top: 20px;">
                <div id="active-content"></div>
            </div>

            <div id="back-to-hub" class="hidden" style="text-align: center; margin-top: 30px;">
                <button class="pro-btn" style="border: 1px solid var(--neon-green); color: var(--neon-green); background: none; padding: 10px 20px; cursor: pointer;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK</button>
            </div>
        `;
    }
};

// GLOBALER ROUTER (JETZT MIT FEHLERSCHUTZ)
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
        if (section === 'management' && window.SektorManagement) window.SektorManagement.open();
        else if (section === 'kabine' && window.SektorSporttasche) window.SektorSporttasche.open();
        else if (section === 'material' && window.SektorMaterial) window.SektorMaterial.open();
        else if (section === 'video' && window.SektorVideo) window.SektorVideo.open();
        else if (section === 'stadion' && window.SektorTemplates) {
            window.SektorTemplates.render();
            setTimeout(() => { if(window.SektorTemplates.switchTab) window.SektorTemplates.switchTab('magazine'); }, 50);
        }
        else {
            activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor <b>${section}</b> konnte nicht geladen werden oder Skript fehlt.</p>`;
        }
    } catch (e) {
        console.error("Router-Fehler:", e);
    }
};

// Sofort-Initialisierung
window.BriefcaseUI.init();
