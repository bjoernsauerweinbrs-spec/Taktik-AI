speak: function(text) {
        if (!window.speechSynthesis) return;
        
        // Laufende Sprachausgabe abbrechen
        window.speechSynthesis.cancel();
        
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE';

        // Stimmen abrufen
        const voices = window.speechSynthesis.getVoices();

        /** * Prioritätenliste für eine männliche, tiefe Stimme:
         * 1. Microsoft Stefan (Sehr klar)
         * 2. Google Deutsch (Männlich)
         * 3. Jede Stimme, die "Male" im Namen trägt
         */
        const maleVoice = voices.find(v => 
            v.name.includes('Stefan') || 
            v.name.includes('Google Deutsch') || 
            (v.name.includes('Male') && v.lang.startsWith('de'))
        ) || voices[0];

        if (maleVoice) {
            u.voice = maleVoice;
        }

        // Akustisches Feintuning für den Trainer-Vibe
        u.pitch = 0.85; // Leicht gesenkt für eine tiefere, maskuline Resonanz
        u.rate = 1.0;   // Natürliche Sprechgeschwindigkeit
        u.volume = 1.0; // Volle Lautstärke

        window.speechSynthesis.speak(u);
    },
