/**
 * =========================================
 * TONI 2.0 – VOICE OUTPUT (TTS)
 * Die Stimme des brasilianischen Fachmanns
 * =========================================
 */
(function() {
    window.ToniVoice = {
        isSpeaking: false,

        /**
         * Toni spricht einen Text aus
         * @param {string} text - Der auszusprechende Text
         */
        speak(text) {
            if (!('speechSynthesis' in window)) {
                console.warn("Sprachausgabe wird von diesem Browser nicht unterstützt.");
                return;
            }

            // Laufende Sprachausgabe abbrechen
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.pitch = 0.9; // Etwas tiefer für mehr Autorität
            utterance.rate = 1.0;  // Normale Geschwindigkeit

            // Stimme wählen (Sucht nach einer männlichen Stimme)
            const voices = window.speechSynthesis.getVoices();
            const maleVoice = voices.find(v => v.name.includes('Microsoft Stefan') || v.name.includes('Google Deutsch'));
            if (maleVoice) utterance.voice = maleVoice;

            utterance.onstart = () => {
                this.isSpeaking = true;
                this.toggleHologram(true);
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                this.toggleHologram(false);
            };

            window.speechSynthesis.speak(utterance);
        },

        // Steuert das visuelle Feedback (Hologramm-Ring)
        toggleHologram(active) {
            const overlay = document.getElementById('voice-overlay');
            if (overlay) {
                if (active) overlay.classList.add('active', 'pulse');
                else overlay.classList.remove('active', 'pulse');
            }
        }
    };

    // Globaler Alias für einfachen Zugriff
    window.toniSpeak = (text) => window.ToniVoice.speak(text);
})();
