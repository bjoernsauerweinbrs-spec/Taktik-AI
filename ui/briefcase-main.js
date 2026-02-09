/**
 * TONI 2.0 - BRIEFCASE UI + SPEECH RECOGNITION
 * Fokus: Live-Spracherkennung & KI-Talk Integration
 */
window.BriefcaseUI = {
    isOpen: false,
    isListening: false,
    recognition: null,

    init: function() {
        console.log("TONI 2.0 Briefcase System: Online.");
        this.setupSpeechRecognition();
        this.renderFolderGrid();
    },

    // Initialisiert die Browser-Spracherkennung
    setupSpeechRecognition: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Spracherkennung wird von diesem Browser nicht unterstützt.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = false; // Hört nach einem Satz auf (besser für Befehle)
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            console.log("TONI Voice-Input:", transcript);
            this.handleVoiceCommand(transcript);
        };

        this.recognition.onend = () => {
            if (this.isListening) this.recognition.start(); // Auto-Restart wenn Modus aktiv
        };
    },

    toggleVoice: function() {
        if (!this.recognition) return alert("Mikrofon-Feature im Browser deaktiviert.");
        
        this.isListening = !this.isListening;
        const micBtn = document.querySelectorAll('#main-mic-btn');

        if (this.isListening) {
            this.recognition.start();
            micBtn.forEach(btn => {
                btn.style.color = "var(--neon-green)";
                btn.classList.add('fa-beat');
            });
            if(window.ToniTTS) ToniTTS.speak("Ich höre dir zu.", "warm");
        } else {
            this.recognition.stop();
            micBtn.forEach(btn => {
                btn.style.color = "#fff";
                btn.classList.remove('fa-beat');
            });
        }
    },

    // Verarbeitet die erkannten Sprachbefehle
    handleVoiceCommand: function(cmd) {
        if (cmd.includes("kabine") || cmd.includes("sporttasche")) {
            this.switchSektor('sport');
        } else if (cmd.includes("training")) {
            this.switchSektor('training');
        } else if (cmd.includes("analyse") || cmd.includes("labor")) {
            this.switchSektor('analyse');
        } else if (cmd.includes("zeitung") || cmd.includes("heft")) {
            this.switchSektor('templates');
        } else if (cmd.includes("geld") || cmd.includes("sponsor")) {
            this.switchSektor('sponsoring');
        } else if (cmd.includes("schließe") || cmd.includes("ende")) {
            this.toggle();
        } else {
            // Wenn kein System-Befehl, dann ab an die KI (Gateway)
            if (window.ToniGateway) window.ToniGateway.askAI(cmd);
        }
    },

    // ... (Hier folgen backToNav, renderFolderGrid und switchSektor wie zuvor)
    
    backToNav: function() {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        if(nav) nav.classList.remove('hidden');
        if(content) content.classList.add('hidden');
        if(title) {
            title.innerHTML = `
                <div style="display:flex; align-items:center; gap:20px;">
                    ZENTRALE AKTENTASCHE
                    <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" 
                       style="cursor:pointer; font-size:1.2rem; transition:0.3s;" title="KI Sprachsteuerung"></i>
                </div>
            `;
        }
        this.renderFolderGrid();
    },

    switchSektor: function(sektor) {
        const nav = document.getElementById('briefcase-nav');
        const content = document.getElementById('briefcase-content');
        const title = document.getElementById('sector-title');
        const active = document.getElementById('active-content');
        if(!nav || !content || !active) return;
        active.innerHTML = ""; 
        nav.classList.add('hidden');
        content.classList.remove('hidden');
        
        const sectorNames = {
            'sport': 'MANNSCHAFTSKABINE', 'training': 'TRAININGSBETRIEB', 'analyse': 'PERFORMANCE LAB',
            'templates': 'STADIONHEFT', 'sponsoring': 'FINANZ-ZENTRALE', 'system': 'SYSTEM-SETUP'
        };

        title.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                <div style="display:flex; align-items:center;">
                    <button onclick="BriefcaseUI.backToNav()" style="background:none; border:none; color:var(--neon-green); cursor:pointer; margin-right:15px; font-size:1.5rem;">
                        <i class="fas fa-arrow-left"></i>
                    </button> 
                    ${sectorNames[sektor] || sektor.toUpperCase()}
                </div>
                <i id="main-mic-btn" class="fas fa-microphone" onclick="BriefcaseUI.toggleVoice()" 
                   style="cursor:pointer; font-size:1.2rem; margin-right:20px; color:${this.isListening ? 'var(--neon-green)' : '#fff'}"></i>
            </div>
        `;

        switch(sektor) {
            case 'sport': if(window.SektorSporttasche) window.SektorSporttasche.render(); break;
            case 'training': if(window.SektorTraining) window.SektorTraining.render(); break;
            case 'analyse': if(window.SektorAnalyse) window.SektorAnalyse.render(); break;
            case 'templates': if(window.SektorTemplates) window.SektorTemplates.render(); break;
            case 'sponsoring': if(window.SektorSponsoring) window.SektorSponsoring.open(); break;
            case 'system': if(window.SektorSystem) window.SektorSystem.render(); break;
        }
    }
};

BriefcaseUI.init();
