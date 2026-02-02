window.ToniAI = {
    voices: [],
    userName: 'Björn', // Standardmäßig auf Björn gesetzt [cite: 2026-01-24]

    init() {
        // Stimmen laden & männliche Stimme fixieren
        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
        this.setupMic();
        this.speak(`Systeme online. Bom dia, Coach Björn! Dein persönlicher API-Key ist aktiv. Wie verschieben wir heute?`);
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        // Suche nach einer männlichen deutschen Stimme
        const maleVoice = this.voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Kaspar') || v.name.includes('Google')));
        msg.voice = maleVoice || this.voices[0];
        msg.pitch = 0.9;
        window.speechSynthesis.speak(msg);

        document.getElementById('setcard-content').innerHTML = `
            <div class="toni-speech-bubble animate-fadeIn">
                <div class="toni-badge">TONI // CO-TRAINER AI</div>
                <div class="toni-text">${text}</div>
            </div>
        `;
    },

    setupMic() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return;
        this.rec = new Speech();
        this.rec.lang = 'de-DE';
        this.rec.continuous = true; // HÖRT DAUERHAFT ZU
        
        this.rec.onresult = (e) => {
            const transcript = e.results[e.results.length - 1][0].transcript.toLowerCase();
            this.handleCommand(transcript);
        };
        this.rec.start();
    },

    handleCommand(cmd) {
        console.log("Toni hört Taktik:", cmd);
        if(cmd.includes("ball links")) arena.moveBall('links');
        if(cmd.includes("ball rechts")) arena.moveBall('rechts');
        if(cmd.includes("koffer") || cmd.includes("zentrale")) BriefcaseUI.toggle();
    }
};
