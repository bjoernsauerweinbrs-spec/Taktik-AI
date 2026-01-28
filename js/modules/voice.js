/**
 * TONI 2.0 - Voice Modul
 * Zuständig für die männliche Fachmann-Identität
 */

const ToniVoice = {
    synth: window.speechSynthesis,
    voice: null,

    /**
     * Initialisiert die Sprachausgabe und sucht eine männliche Stimme
     */
    init() {
        const setVoice = () => {
            const voices = this.synth.getVoices();
            // Heuristik: Suche nach deutschen männlichen Stimmen
            this.voice = voices.find(v => 
                v.lang.startsWith('de') && 
                (v.name.toLowerCase().includes('male') || 
                 v.name.toLowerCase().includes('stefan') || 
                 v.name.toLowerCase().includes('google deutsch'))
            ) || voices.find(v => v.lang.startsWith('de'));
            
            console.log(`[Voice] Gewählte Stimme: ${this.voice ? this.voice.name : 'System Standard'}`);
        };

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = setVoice;
        }
        setVoice();

        // Auf Befehle vom EventBus hören
        window.ToniEvents.on('VOICE:SPEAK', (data) => this.speak(data.text));
    },

    /**
     * Spricht den Text und meldet den Abschluss per EventBus
     */
    speak(text) {
        if (!text) return;

        // Falls Toni gerade noch spricht, brechen wir ab (kein Durcheinander)
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.pitch = 0.85; // Etwas tiefer für mehr Autorität (Nagelsmann/Klopp Mix)
        utterance.rate = 1.0;

        utterance.onend = () => {
            console.log("[Voice] Toni hat fertig gesprochen.");
            window.ToniEvents.emit('VOICE:ENDED'); // Signal für den nächsten Schritt in der Ginga-Sequenz
        };

        utterance.onerror = (e) => {
            console.error("[Voice] Fehler bei der Sprachausgabe:", e);
            window.ToniEvents.emit('VOICE:ENDED'); // Trotzdem weitermachen, falls System klemmt
        };

        this.synth.speak(utterance);
    }
};

// Modul sofort initialisieren
ToniVoice.init();
