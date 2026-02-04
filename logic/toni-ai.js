window.ToniAI = {
    ready: false,
    presets: {
        deep: { pitch: 0.7, rate: 0.9, timbre: 'Manager' },
        warm: { pitch: 0.85, rate: 0.95, timbre: 'Coach' },
        neutral: { pitch: 1.0, rate: 1.0, timbre: 'System' }
    },
    init: function() {
        console.log("ToniAI: Initialisiere männliche Stimme...");
        this.ready = true;
    },
    speak: function(text, mode = 'warm') {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const p = this.presets[mode] || this.presets.warm;

        let maleVoice = voices.find(v => v.lang.includes('de') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('stefan')));
        if (maleVoice) utterance.voice = maleVoice;

        utterance.pitch = p.pitch;
        utterance.rate = p.rate;
        window.speechSynthesis.speak(utterance);
    },
    processCommand: function(cmd) {
        console.log("Toni analysiert Befehl: " + cmd);
    }
};
ToniAI.init();
