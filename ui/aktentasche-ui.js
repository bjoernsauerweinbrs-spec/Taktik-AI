/**
 * TONI 2.0 - MASTER HUB UI (ELITE SYNC 2026)
 * Fokus: Hard-Linking der Sektoren & Fehlerfreie Navigation
 * Status: ETAPPE 2 - ZENTRALE VERSIEGELT
 */
window.BriefcaseUI = {
    isOpen: false,

    init() {
        console.log("🚀 TONI Zentrale: System-Check startet...");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    toggle() {
        const overlay = document.getElementById('briefcase-overlay');
        if (!overlay) return;

        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            overlay.classList.remove('hidden');
            this.renderMainGrid();
        } else {
            overlay.classList.add('hidden');
        }
    },

    /**
     * Aktiviert die Sprachsteuerung (Mikrofon-Funktion)
     */
    toggleVoice() {
        if(window.ToniVoice) {
            // Falls ToniVoice initRecognition nutzt, hier triggern
            if(window.ToniVoice.recognition) {
                try {
                    window.ToniVoice.recognition.start();
                    console.log("🎤 TONI hört jetzt zu...");
                } catch(e) { console.log("Mikro läuft bereits."); }
            }
        }
    },

    /**
     * Erstellt das Haupt-Gitter (Zentrale)
     */
    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        windowBody.style.overflowY = "auto";
        windowBody.innerHTML = `
            <div id="sector-title">
                <div style="display: flex; flex-direction: column;">
                    <span style="color: #39FF14; letter-spacing: 3px; font-weight: 900; font-size: 1.1rem;">TONI ZENTRALE</span>
                    <span style="color: #666; font-size: 0.5rem; letter-spacing: 2px;">ELITE UNIT CONTROL 2026</span>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: var(--status-error); font-size: 1.2rem;"></i>
            </div>
            
            <div id="briefcase-nav" class="management-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; padding: 20px;">
                
                <div class="mgmt-card" style="border: 1px solid #39FF14; background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px;">
                    <div style="color: #39FF14; font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">⚽ PRO AREA</div>
                    <button class="tactic-btn" style="width: 100%; margin-bottom: 8px;" onclick="window.openSection('kabine')"><i class="fas fa-users-cog"></i> KABINE</button>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('analyse')"><i class="fas fa-microscope"></i> LABOR</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--accent-gold); background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px;">
                    <div style="color: var(--accent-gold); font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">📈 BUSINESS</div>
                    <button class="tactic-btn" style="width: 100%; margin-bottom: 8px;" onclick="window.openSection('sponsoring')"><i class="fas fa-handshake"></i> SPONSORING</button>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('finanzen')"><i class="fas fa-wallet"></i> FINANZEN</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid #fff; background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px;">
                    <div style="color: #fff; font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">📺 MEDIA</div>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('stadionzeitung')"><i class="fas fa-newspaper"></i> STADIONZEITUNG</button>
                </div>

                <div class="mgmt-card" style="border: 1px solid var(--data-cyan); background: rgba(0,0,0,0.5); padding: 15px; border-radius: 10px;">
                    <div style="color: var(--data-cyan); font-weight: 900; margin-bottom: 12px; font-size: 0.7rem; font-family: 'Orbitron';">⚙️ SYSTEM</div>
                    <button class="tactic-btn" style="width: 100%;" onclick="window.openSection('settings')"><i class="fas fa-sliders-h"></i> SETUP</button>
                </div>

            </div>
            
            <div id="briefcase-content" class="hidden" style="padding: 20px;">
                <div id="active-content"></div>
                <div id="back-to-hub" style="text-align: center; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;">
                    <button class="pro-btn" style="border: 1px solid #39FF14; color: #39FF14; background: none; padding: 10px 20px; cursor: pointer; font-family:'Orbitron'; font-size:0.6rem;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>
                </div>
            </div>
        `;
    }
};

/**
 * GLOBALER ROUTER (FIXED SYNC)
 * Steuert das Ein- und Ausblenden der Sektoren
 */
window.openSection = function(section) {
    const nav = document.getElementById('briefcase-nav');
    const content = document.getElementById('briefcase-content');
    const activeContent = document.getElementById('active-content');

    if(nav) nav.classList.add('hidden');
    if(content) content.classList.remove('hidden');

    // Routing Logik basierend auf den existierenden Sektor-Objekten
    switch(section) {
        case 'kabine': 
            if(window.SektorSporttasche) window.SektorSporttasche.open(); 
            break;
        case 'analyse': 
            if(window.SektorAnalyse) window.SektorAnalyse.open(); 
            break;
        case 'sponsoring': 
            if(window.SektorSponsoring) window.SektorSponsoring.open(); 
            break;
        case 'finanzen': 
            if(window.SektorFinanzen) window.SektorFinanzen.open(); 
            break;
        case 'stadionzeitung': 
            if(window.SektorStadionzeitung) window.SektorStadionzeitung.open(); 
            break;
        case 'settings': 
            if(window.SektorSettings) window.SektorSettings.open(); 
            break;
        default:
            if(activeContent) activeContent.innerHTML = `<p style="text-align:center; padding:50px;">Sektor <b>${section}</b> in Vorbereitung...</p>`;
    }
};

window.BriefcaseUI.init();
