/**
 * TONI 2.0 - VOICE CORE (SPEECH ENGINE)
 * Fokus: Mikrofon-Steuerung & KI-Sprachausgabe
 * Status: MASTER-SYNC 2026 - INITIAL BUILD
 */
window.ToniVoice = {
    synth: window.speechSynthesis,
    isMuted: false,

    /**
     * Lässt TONI einen Text laut vorlesen
     */
    speak(text) {
        if (this.isMuted || !this.synth) return;

        // Laufende Sprache abbrechen, um Überlappungen zu vermeiden
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.9; // Etwas tiefer für den "KI-Sound"
        utterance.rate = 1.0;  // Normale Geschwindigkeit

        // Versuche eine männliche, professionelle Stimme zu finden
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('de') && v.name.includes('Google'));
        if (preferredVoice) utterance.voice = preferredVoice;

        this.synth.speak(utterance);
    },

    /**
     * Initialisiert die Spracherkennung (Mikrofon)
     */
    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error("Browser unterstützt keine Spracherkennung.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'de-DE';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            console.log("🎤 TONI hört:", transcript);
            this.handleVoiceCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.warn("🎤 Mikrofon-Fehler:", event.error);
        };

        // Startet das Mikrofon (muss durch User-Interaktion getriggert werden)
        this.recognition = recognition;
    },

    handleVoiceCommand(cmd) {
        // Visuelles Feedback im Chat
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `<div class="chat-msg user" style="color:var(--data-cyan)">🎤 ${cmd}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Logik-Weiterleitung an das KI-Büro
        if (window.BriefcaseUI) {
            window.BriefcaseUI.handleVoiceCommand(cmd);
        }
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.speak(this.isMuted ? "Sprachausgabe deaktiviert." : "Sprachausgabe aktiv.");
    }
};

// Initialisierung bei Systemstart
window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.initRecognition();
});
