/**
 * TONI 2.0 - AUDIO COCKPIT (Männlich/Deutsch)
 * Steuert die TTS-Ausgabe und das visuelle Feedback der Buttons.
 */

window.ToniTTS = {
    ready: false,
    selectedVoice: null,
    // Presets basierend auf Soll-Ist Analyse
    presets: {
        deep: { pitch: 0.7, rate: 0.9, volume: 1.0 },   // Manager/Sponsoring
        warm: { pitch: 0.85, rate: 0.95, volume: 1.0 }, // Coach/Training
        system: { pitch: 1.0, rate: 1.0, volume: 0.8 }  // Kurze Hinweise
    },

    init: function() {
        const setupVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Suche nach männlichen deutschen Stimmen (Stefan, Male, Kilian)
                this.selectedVoice = voices.find(v => 
                    v.lang.includes('de-DE') && 
                    (v.name.includes('Stefan') || v.name.includes('Male') || v.name.includes('Kilian') || v.name.includes('Google'))
                ) || voices.find(v => v.lang.includes('de'));

                this.ready = true;
                console.log("ToniTTS: Aktiviert. Stimme:", this.selectedVoice?.name);
            }
        };

        // Chrome/Edge brauchen dieses Event
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = setupVoice;
        }
        setupVoice();
    },

    /**
     * Hauptfunktion für die Sprachausgabe
     * @param {string} text - Der Text der gesprochen werden soll
     * @param {string} mode - 'deep', 'warm' oder 'system'
     */
    speak: function(text, mode = 'warm') {
        if (!window.speechSynthesis) return;

        // Alle laufenden Ausgaben sofort stoppen (Verhindert Überlappung)
        window.speechSynthesis.cancel();

        const p = this.presets[mode] || this.presets.warm;
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (this.selectedVoice) utterance.voice = this.selectedVoice;
        
        utterance.pitch = p.pitch;
        utterance.rate = p.rate;
        utterance.volume = p.volume;

        // VISUELLES FEEDBACK (Verknüpfung mit style.css)
        utterance.onstart = () => {
            document.body.classList.add('toni-speaking');
            // Status-Indikator im Header des Advisors anzeigen (falls vorhanden)
            const chatHeader = document.querySelector('.chat-header');
            if (chatHeader && !chatHeader.querySelector('.speaking-pulse')) {
                const pulse = document.createElement('div');
                pulse.className = 'speaking-pulse';
                chatHeader.prepend(pulse);
            }
        };

        utterance.onend = () => {
            document.body.classList.remove('toni-speaking');
            const pulse = document.querySelector('.speaking-pulse');
            if (pulse) pulse.remove();
        };

        window.speechSynthesis.speak(utterance);
    },

    /**
     * Test-Funktion für das Audio-Cockpit (Soll-Ist Punkt 1)
     */
    test: function() {
        this.speak("Initialisierung der Audio-Schnittstelle abgeschlossen. Ich bin bereit für die Taktik-Analyse, Coach Björn.", "deep");
    }
};

// Autostart des Audio-Systems
ToniTTS.init();
