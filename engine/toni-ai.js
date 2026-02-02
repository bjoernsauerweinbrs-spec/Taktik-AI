// KEIN EXPORT HIER! Direkt mit window.ToniAI starten
window.ToniAI = {
    isListening: false,
    recognition: null,
    maleVoice: null,

    init() {
        this.setupVoice();
        this.setupMic();
        // Toni begrüßt Björn [cite: 2026-01-24]
        this.speak("Bom dia, Coach Björn! Alle Systeme sind scharf geschaltet. Aktiviere das Mikrofon in der Sidebar."); [cite: 2026-01-26, 2026-02-02]
    },

    setupVoice() {
        const load = () => {
            const voices = window.speechSynthesis.getVoices();
            // Erzwungene Suche nach einer MÄNNLICHEN STIMME [cite: 2026-01-26]
            this.maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Male') || v.name.includes('Stefan'))) || voices[0];
        };
        load();
        window.speechSynthesis.onvoiceschanged = load;
    },

    speak(text) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        if(this.maleVoice) msg.voice = this.maleVoice; [cite: 2026-01-26]
        msg.pitch = 0.85; // Klopp-Tiefe
        
        // Anzeige in der UI [cite: 2026-02-02]
        const container = document.getElementById('setcard-content');
        if(container) {
            container.innerHTML = `<div class="toni-speech-bubble"><b>TONI:</b><br>${text}</div>`;
        }
        window.speechSynthesis.speak(msg);
    },

    // ... Restliche Mikrofon-Logik ...
};
