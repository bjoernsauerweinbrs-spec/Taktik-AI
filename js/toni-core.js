window.ToniAI = {
    voices: [],
    
    init() {
        // Voice-Check: Warte bis Stimmen geladen sind
        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
            console.log("Stimmen geladen:", this.voices.length);
        };
        this.setupMic();
        this.speak("Systeme online. Ich bin Toni. Wie lautet dein Name?");
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        // EXPLIZITE SUCHE NACH MÄNNLICHER STIMME
        const maleVoice = this.voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Kaspar') || v.name.includes('Google')));
        msg.voice = maleVoice || this.voices[0];
        msg.pitch = 0.9; 
        window.speechSynthesis.speak(msg);
        
        // UI-Anzeige
        document.getElementById('setcard-content').innerHTML = `<div class="toni-speech-bubble">${text}</div>`;
    },

    setupMic() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return;
        this.rec = new Speech();
        this.rec.lang = 'de-DE';
        this.rec.continuous = true; // DAUERHAFTES HÖREN
        
        this.rec.onresult = (e) => {
            const last = e.results.length - 1;
            const command = e.results[last][0].transcript.toLowerCase();
            this.handleCommand(command);
        };
    },

    handleCommand(cmd) {
        console.log("Toni hört:", cmd);
        if(cmd.includes("zentrale") || cmd.includes("koffer")) BriefcaseUI.toggle();
        if(cmd.includes("ball links")) arena.moveBall('links');
        // Toni antwortet flexibel
        if(cmd.includes("hallo")) this.speak("Moin Coach! Bereit für die Analyse?");
    }
};
