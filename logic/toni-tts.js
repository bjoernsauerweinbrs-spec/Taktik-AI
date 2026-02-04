window.ToniTTS = {
    ready: false,
    selectedVoice: null,
    settings: { volume: 1.0, pitch: 0.8, rate: 0.95 },

    init: function() {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Suche Stefan (Windows) oder Google Deutsch (Chrome/Android)
                this.selectedVoice = voices.find(v => v.lang.includes('de') && 
                    (v.name.includes('Stefan') || v.name.includes('Male') || v.name.includes('Kilian')));
                this.ready = true;
                console.log("ToniTTS: Cockpit bereit. Stimme:", this.selectedVoice?.name || "Standard");
            }
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    },

    speak: function(text, type = 'warm') {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) utterance.voice = this.selectedVoice;
        
        utterance.volume = this.settings.volume;
        utterance.pitch = type === 'deep' ? 0.7 : 0.85;
        utterance.rate = this.settings.rate;

        // Visuelles Feedback Trigger
        document.body.classList.add('toni-speaking');
        utterance.onend = () => document.body.classList.remove('toni-speaking');
        
        window.speechSynthesis.speak(utterance);
    },

    test: function() {
        this.speak("Initialisierung erfolgreich. Ich bin bereit für die Taktik-Analyse, Coach Björn.", "deep");
    }
};
ToniTTS.init();
