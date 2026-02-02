window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        this.speak("Bom dia, Björn! Ich bin bereit. Aktiviere das Mikrofon in der Sidebar, dann können wir uns unterhalten.");
    },

    setupVoice() {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Suche gezielt nach männlichen Stimmen (Microsoft Stefan, Google Deutsch Male, etc.)
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Stefan') || v.name.includes('Google Deutsch'))) || voices[0];
            console.log("Stimme gewählt:", this.maleVoice.name);
        };
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        if(this.maleVoice) msg.voice = this.maleVoice;
        msg.pitch = 0.9;
        msg.rate = 1.0;
        
        document.getElementById('setcard-content').innerHTML = `
            <div class="toni-speech-bubble animate-fadeIn">
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
        this.recognition.interimResults = false;

        this.recognition.onresult = (e) => {
            const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
            this.handleCommand(cmd);
        };
    },

    toggleListening() {
        const btn = document.getElementById('voice-trigger-btn');
        const label = document.getElementById('mic-status-label');
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            btn.classList.remove('mic-active-glow');
            label.innerText = "BEREIT";
        } else {
            this.recognition.start();
            this.isListening = true;
            btn.classList.add('mic-active-glow');
            label.innerText = "HÖRT ZU";
        }
    },

    handleCommand(cmd) {
        if(cmd.includes("zentrale") || cmd.includes("koffer")) BriefcaseUI.toggle();
        if(cmd.includes("ball links")) arena.moveBall('links');
        this.speak(`Ich habe verstanden: ${cmd}. Was ist der nächste Schritt?`);
    }
};
