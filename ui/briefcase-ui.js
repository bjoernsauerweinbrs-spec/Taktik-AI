window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,
    clubData: JSON.parse(localStorage.getItem('toni_club_config')) || { name: 'FC TONI 2.0', coach: 'Björn', league: 'Regionalliga', logo: '' },

    init: function() {
        console.log("TONI 2.0 Elite-Engine initialisiert...");
        this.setupSpeechRecognition();
        this.renderFolderGrid();
    },

    // --- NEU: KI SPRACHERKENNUNG ---
    setupSpeechRecognition: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };
    },

    toggleVoice: function() {
        if (!this.recognition) return;
        this.isListening = !this.isListening;
        const micBtn = document.getElementById('main-mic-btn');
        if (this.isListening) {
            this.recognition.start();
            if(micBtn) micBtn.style.color = "var(--neon-green)";
            if(window.ToniAI) window.ToniAI.speak("Ich höre zu, Coach.");
        } else {
            this.recognition.stop();
            if(micBtn) micBtn.style.color = "#fff";
        }
    },

    handleVoiceCommand: function(cmd) {
        console.log("Toni erkannt:", cmd);
        // TRICK-SUCHE LOGIK
        if (cmd.includes("zeig mir") || cmd.includes("video von") || cmd.includes("wie geht der")) {
            const trick = cmd.replace("toni", "").replace("zeig mir", "").replace("video von", "").replace("wie geht der", "").trim();
            this.switchSektor('reports'); // Wechselt zum Performance Lab (Reports)
            setTimeout(() => {
                if(window.SektorAnalyse) window.SektorAnalyse.playTrickVideo(trick);
            }, 500);
        }
        // SEKTOR-STEUERUNG
        if (cmd.includes("kabine")) this.switchSektor('sport');
        if (cmd.includes("heft") || cmd.includes("zeitung")) this.switchSektor('templates');
        if (cmd.includes("schließe")) this.toggle();
    },

    // --- NAVIGATION ---
    toggle: function() {
        var overlay = document.getElementById('briefcase-overlay');
        if (overlay) {
            overlay.classList.toggle('hidden');
            this.isOpen = !overlay.classList.contains('hidden');
            if (this.isOpen) { this.backToNav(); }
        }
    },

    backToNav: function() {
        var nav = document.getElementById('briefcase-nav');
        var content = document.getElementById('briefcase-content');
        var title = document.getElementById('sector-title');
        if(!nav || !content) return;
        nav.classList.remove('hidden');
        content.classList.add('hidden');
        
        // Titel mit Mikrofon-Integration
        title.innerHTML = `
            <div style="display:flex; align-items:center; gap:15px;">
                ZENTRALE AKTENTASCHE
                <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" style="cursor:pointer; font-size:1.1rem;"></i>
            </div>`;
        this.renderFolderGrid();
    },

    renderFolderGrid: function() {
        var nav = document.getElementById('briefcase-nav');
        if(!nav) return;
        var folders = [
            { id: 'sport', name: 'KABINE', icon: 'fa-users', color: '#ff9500' },
            { id: 'training', name: 'TRAINING', icon: 'fa-dumbbell', color: '#ff9500' },
            { id: 'templates', name: 'STADIONHEFT', icon: 'fa-book-open', color: '#fff' },
            { id: 'reports', name: 'PERFORMANCE LAB', icon: 'fa-video', color: 'var(--neon-green)' },
            { id: 'sponsoring', name: 'SPONSORING', icon: 'fa-handshake', color: '#00d1ff' },
            { id: 'system', name: 'SYSTEM', icon: 'fa-cogs', color: '#888' }
        ];
        nav.innerHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; padding: 10px;">' +
            folders.map(f => `
                <div class="folder-card" onclick="BriefcaseUI.switchSektor('${f.id}')" 
                    style="background: rgba(255,255,255,0.03); border: 1px solid #333; padding: 25px; border-radius: 12px; text-align: center; cursor: pointer;">
                    <i class="fas ${f.icon}" style="font-size: 2rem; color: ${f.color}; margin-bottom: 10px; display: block;"></i>
                    <span style="font-size: 0.75rem; font-weight: bold; color: #fff;">${f.name}</span>
                </div>`).join('') + '</div>';
    },

    switchSektor: function(sektor) {
        document.getElementById('briefcase-nav').classList.add('hidden');
        document.getElementById('briefcase-content').classList.remove('hidden');
        
        // Header mit Mikrofon-Status behalten
        document.getElementById('sector-title').innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div>
                    <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:#ff9500; cursor:pointer; margin-right:10px;"><i class="fas fa-arrow-left"></i></button>
                    ${sektor.toUpperCase()}
                </div>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" style="color:${this.isListening ? 'var(--neon-green)' : '#fff'}; cursor:pointer;"></i>
            </div>`;
        
        // Routing zu den Elite-Sektoren
        if (sektor === 'sport') { if(window.SektorSporttasche) window.SektorSporttasche.open(); }
        else if (sektor === 'templates') { if(window.SektorTemplates) window.SektorTemplates.render(); }
        else if (sektor === 'reports') { if(window.SektorAnalyse) window.SektorAnalyse.open(); }
        else if (sektor === 'system') this.renderSystem();
        else if (sektor === 'sponsoring') { if(window.SektorSponsoring) window.SektorSponsoring.open(); }
        else if (sektor === 'training') this.renderTraining();
        else this.renderPlaceholder(sektor);
    },

    // ... (restliche Funktionen wie renderSystem bleiben erhalten)
};
BriefcaseUI.init();
