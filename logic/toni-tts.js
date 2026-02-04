/**
 * TONI 2.0 - VOICE ENGINE
 */
window.ToniTTS = {
    selectedVoice: null,

    init: function() {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            // Suche männliche deutsche Stimme (Stefan oder Google)
            this.selectedVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Stefan') || v.name.includes('Male')));
        };
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    },

    speak: function(text, mode = "warm") {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const msg = new SpeechSynthesisUtterance(text);
        if (this.selectedVoice) msg.voice = this.selectedVoice;
        
        msg.pitch = mode === "deep" ? 0.75 : 0.85;
        msg.rate = 0.95;
        window.speechSynthesis.speak(msg);
    },

    test: function() {
        this.speak("Toni Sprachausgabe online. Ich bin bereit für die Ginga-Analyse, Coach Björn.", "warm");
    }
};
ToniTTS.init();
