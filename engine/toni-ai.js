window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        // Begrüßung wie besprochen [cite: 2026-01-24, 2026-01-26]
        this.speak("Bom dia, Coach Björn! Ich habe den Tiefenscan abgeschlossen. Die Teamliste ist in der Aktentasche bereit."); 
    },

    setupVoice() {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            // Erzwungene männliche Stimme [cite: 2026-01-26]
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Stefan') || v.name.includes('Male'))) || voices[0];
        };
        load(); window.speechSynthesis.onvoiceschanged = load;
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        if(this.maleVoice) msg.voice = this.maleVoice;
        msg.pitch = 0.85;
        document.getElementById('setcard-content').innerHTML = `
            <div class="toni-speech-bubble">
                <small>TONI // TACTICAL AI</small><br>${text}
            </div>`;
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
            label.innerText = "BEREIT";
        } else {
            this.recognition.start(); this.isListening = true;
            label.innerText = "AKTIV";
            this.speak("Ich höre zu, Coach.");
        }
    },

    handleCommand(cmd) {
        if(cmd.includes("zentrale") || cmd.includes("koffer")) BriefcaseUI.toggle();
        if(cmd.includes("team") || cmd.includes("liste")) BriefcaseUI.switchSektor('sport');
        this.speak("Befehl erkannt: " + cmd);
    }
};
