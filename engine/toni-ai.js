window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        this.speak("Bom dia, Coach Björn! Systeme online. Nutze das Mikrofon in der Sidebar.");
    },

    setupVoice() {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            // Suche männliche deutsche Stimme (Stefan, Kaspar, Google)
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Stefan'))) || voices[0];
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        if(this.maleVoice) msg.voice = this.maleVoice;
        msg.pitch = 0.85; 
        
        document.getElementById('setcard-content').innerHTML = `
            <div class="toni-speech-bubble">
                <div class="toni-badge">TONI // CO-TRAINER AI</div>
                <div class="toni-text">${text}</div>
            </div>
        `;
        window.speechSynthesis.speak(msg);
    },

    setupMic() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return;
        this.recognition = new Speech();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.onresult = (e) => {
            const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
            this.handleCommand(cmd);
        };
    },

    toggleListening() {
        const btn = document.getElementById('voice-trigger-btn');
        const label = document.getElementById('mic-status-label');
        if (this.isListening) {
            this.recognition.stop(); this.isListening = false;
            btn.classList.remove('mic-active-glow'); label.innerText = "AUS";
        } else {
            this.recognition.start(); this.isListening = true;
            btn.classList.add('mic-active-glow'); label.innerText = "AKTIV";
        }
    },

    handleCommand(cmd) {
        if(cmd.includes("koffer") || cmd.includes("zentrale")) BriefcaseUI.toggle();
        this.speak("Verstanden: " + cmd);
    }
};
