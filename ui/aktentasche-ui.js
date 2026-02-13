/**
 * TONI 2.0 - MASTER HUB UI (ELITE 3x3 SYNC 2026)
 * Fokus: 9-Kachel-Raster & Sektor-Routing
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,

    init() {
        console.log("🚀 TONI Zentrale: 9-Sektor-System wird initialisiert...");
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay) overlay.classList.add('hidden');
        this.setupSpeechRecognition();
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

    switchSektor(sektorKey) {
        if (!this.isOpen) this.toggle();
        window.openSection(sektorKey);
    },

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };
    },

    toggleVoice() {
        if (!this.recognition) return;
        this.isListening = !this.isListening;
        const micIcon = document.getElementById('main-mic-btn');
        if (this.isListening) {
            try {
                this.recognition.start();
                if(micIcon) micIcon.style.color = "#39FF14";
                if(window.ToniVoice) window.ToniVoice.speak("Ich höre zu, Coach.");
            } catch(e) { console.warn("Spracherkennung bereits aktiv."); }
        } else {
            this.recognition.stop();
            if(micIcon) micIcon.style.color = "#fff";
        }
    },

    handleVoiceCommand(cmd) {
        if (cmd.includes("kabine")) window.openSection('kabine');
        if (cmd.includes("analyse") || cmd.includes("labor")) window.openSection('analyse');
        if (cmd.includes("jugend") || cmd.includes("kinder")) window.openSection('jugend');
        if (cmd.includes("spieltag") || cmd.includes("match")) window.openSection('matchday');
        if (cmd.includes("training")) window.openSection('training');
        if (cmd.includes("business") || cmd.includes("finanzen")) window.openSection('business');
        if (cmd.includes("zeitung") || cmd.includes("stadion")) window.openSection('stadionzeitung');
        if (cmd.includes("scouting")) window.openSection('scouting');
        if (cmd.includes("setup") || cmd.includes("einstellung")) window.openSection('settings');
        if (cmd.includes("schließe") || cmd.includes("zurück")) this.renderMainGrid();
    },

    renderMainGrid() {
        const windowBody = document.querySelector('.briefcase-window');
        if (!windowBody) return;

        const sectors = [
            { id: 'kabine', name: 'KABINE', icon: 'fa-user-group', color: '#39FF14' },
            { id: 'analyse', name: 'ANALYSE', icon: 'fa-flask-vial', color: '#39FF14' },
            { id: 'jugend', name: 'JUGENDBEREICH', icon: 'fa-child-reaching', color: '#00D1FF' },
            { id: 'matchday', name: 'MATCH-DAY', icon: 'fa-file-signature', color: '#39FF14' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: '#39FF14' },
            { id: 'business', name: 'BUSINESS', icon: 'fa-handshake', color: '#D4AF37' },
            { id: 'stadionzeitung', name: 'STADION', icon: 'fa-newspaper', color: '#fff' },
            { id: 'scouting', name: 'SCOUTING', icon: 'fa-magnifying-glass-chart', color: '#00D1FF' },
            { id: 'settings', name: 'SYSTEM', icon: 'fa-gears', color: '#666' }
        ];

        windowBody.innerHTML = `
            <div id="sector-title">
                <div style="display: flex; flex-direction: column;">
                    <span style="letter-spacing: 3px; font-weight: 900; font-size: 1.1rem;">ZENTRALE ARCHIV</span>
                    <span style="color: #666; font-size: 0.5rem; letter-spacing: 2px;">STRATEGIC HUB 2026</span>
                </div>
                <i class="fas fa-times" onclick="window.BriefcaseUI.toggle()" style="cursor: pointer; color: #ff3b30; font-size: 1.2rem;"></i>
            </div>
            
            <div class="management-grid">
                ${sectors.map(s => `
                    <div class="mgmt-card" onclick="window.openSection('${s.id}')">
                        <i class="fas ${s.icon}" style="color: ${s.color}"></i>
                        <div class="card-header" style="color: ${s.color}">${s.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

/**
 * Globaler Sektor-Router (Synchronisiert mit den 9 Kacheln)
 */
window.openSection = function(section) {
    const activeContent = document.getElementById('active-content');
    const briefcaseContent = document.getElementById('briefcase-content');
    const mainGrid = document.querySelector('.management-grid');

    if (mainGrid) mainGrid.classList.add('hidden');
    if (briefcaseContent) briefcaseContent.classList.remove('hidden');

    // Titel anpassen
    const title = document.querySelector('#sector-title span');
    if(title) title.innerText = section.toUpperCase();

    switch(section) {
        case 'kabine': if(window.SektorSporttasche) window.SektorSporttasche.open(); break;
        case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.open(); break;
        case 'jugend': if(window.SektorJugendbereich) window.SektorJugendbereich.open(); break;
        case 'matchday': if(window.Arena) window.Arena.switchMode('match'); window.BriefcaseUI.toggle(); break;
        case 'training': if(window.Arena) window.Arena.switchMode('training'); window.BriefcaseUI.toggle(); break;
        case 'business': if(window.SektorSponsoring) window.SektorSponsoring.open(); break;
        case 'stadionzeitung': if(window.SektorStadionzeitung) window.SektorStadionzeitung.open(); break;
        case 'scouting': activeContent.innerHTML = '<div style="padding:50px; text-align:center;">Scouting-Datenbank wird synchronisiert...</div>'; break;
        case 'settings': if(window.SektorSettings) window.SektorSettings.open(); break;
        default:
            activeContent.innerHTML = `<p style="text-align:center; padding:40px; color:#666;">Sektor ${section} lädt...</p>`;
    }

    // Zurück-Button Logik
    if (!document.getElementById('back-to-hub')) {
        const backBtn = document.createElement('div');
        backBtn.id = 'back-to-hub';
        backBtn.style = 'text-align: center; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;';
        backBtn.innerHTML = `<button class="pro-btn" style="border: 1px solid #39FF14; color: #39FF14; background: none; padding: 10px 20px; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem;" onclick="window.BriefcaseUI.renderMainGrid()">← ZURÜCK ZUR ZENTRALE</button>`;
        activeContent.parentElement.appendChild(backBtn);
    }
};

window.BriefcaseUI.init();
