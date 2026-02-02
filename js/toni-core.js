window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        this.speak("Bom dia, Coach Björn! Ich habe alle Systeme gescannt. Klicke auf das Mikrofon in der Sidebar, um die Voice-Analyse zu starten."); [cite: 2026-01-24, 2026-01-26]
    },

    setupVoice() {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            // Erzwingt männliche Stimme [cite: 2026-01-26]
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Stefan'))) || voices[0];
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        if(this.maleVoice) msg.voice = this.maleVoice;
        msg.pitch = 0.85; // Klopp-Tiefe
        
        document.getElementById('setcard-content').innerHTML = `
            <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:20px; border-radius:15px;">
                <div style="color:var(--data-cyan); font-size:9px; font-weight:bold; letter-spacing:2px; margin-bottom:10px;">TONI // AI CO-TRAINER</div>
                <div style="line-height:1.6;">${text}</div>
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
            this.recognition.stop();
            this.isListening = false;
            btn.classList.remove('mic-active-glow');
            label.innerText = "AUS";
        } else {
            this.recognition.start();
            this.isListening = true;
            btn.classList.add('mic-active-glow');
            label.innerText = "AKTIV";
        }
    },

    handleCommand(cmd) {
        if(cmd.includes("zentrale") || cmd.includes("koffer")) BriefcaseUI.toggle(); [cite: 2026-02-02]
        this.speak(`Verstanden: "${cmd}". Ich analysiere die Positionen...`);
    }
};
