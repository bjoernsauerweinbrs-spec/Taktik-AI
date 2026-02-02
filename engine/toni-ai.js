window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        this.speak("Bom dia, Coach Björn! Systeme sind online. Nutze das Mikrofon links für die Analyse.");
    },

    setupVoice() {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            // Sucht nach männlicher Stimme
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'))) || voices[0];
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
            <div style="background:rgba(0,209,255,0.05); border:1px solid var(--data-cyan); padding:20px; border-radius:15px;">
                <div style="color:var(--data-cyan); font-size:9px; font-weight:bold; letter-spacing:2px; margin-bottom:10px;">TONI // AI CO-TRAINER</div>
                <div style="line-height:1.6; font-size:14px; color:white;">${text}</div>
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
            if(cmd.includes("zentrale") || cmd.includes("koffer")) BriefcaseUI.toggle();
            this.speak(`Analysiere: "${cmd}"`);
        };
    },

    toggleListening() {
        const btn = document.getElementById('voice-trigger-btn');
        const label = document.getElementById('mic-status-label');
        if (this.isListening) {
            this.recognition.stop(); this.isListening = false;
            btn.style.color = 'white'; label.innerText = "AUS";
        } else {
            this.recognition.start(); this.isListening = true;
            btn.style.color = 'var(--data-cyan)'; label.innerText = "AKTIV";
        }
    }
};
