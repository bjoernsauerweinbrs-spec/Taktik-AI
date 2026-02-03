window.ToniAI = {
    isListening: false,
    recognition: null,

    init() {
        console.log("Toni AI initialisiert...");
        this.setupMic();
    },

    setupMic() {
        const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Speech) return;
        this.recognition = new Speech();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = true;
        this.recognition.onresult = (e) => {
            const cmd = e.results[e.results.length - 1][0].transcript.toLowerCase();
            console.log("Toni hörte:", cmd);
        };
    },

    toggleListening() {
        if (!this.recognition) return alert("Mikrofon nicht unterstützt.");
        const label = document.getElementById('mic-status-label');
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            if (label) label.innerText = "AUS";
        } else {
            this.recognition.start();
            this.isListening = true;
            if (label) label.innerText = "AKTIV";
        }
    }
};
