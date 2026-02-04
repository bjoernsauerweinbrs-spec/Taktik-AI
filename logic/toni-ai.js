/**
 * TONI 2.0 - AI ENGINE & TTS CONTROL
 * Fokus: Internationales Niveau, Männliche Stimme, Deutsche Sprache
 */

window.ToniAI = {
    // --- STIMMEN KONFIGURATION ---
    presets: {
        deep: { pitch: 0.7, rate: 0.9, timbre: 'Manager (Watzke/Hoeneß)' },
        warm: { pitch: 0.85, rate: 0.95, timbre: 'Co-Trainer (Klopp/Nagelsmann)' },
        neutral: { pitch: 1.0, rate: 1.0, timbre: 'System-Ansage' }
    },

    // --- SPRACHAUSGABE (TTS) ---
    speak: function(text, mode = 'warm') {
        if (!window.speechSynthesis) {
            console.error("Browser unterstützt keine Sprachausgabe.");
            return;
        }

        // Laufende Sprache stoppen
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const p = this.presets[mode] || this.presets.warm;

        // Gezielte Suche nach männlichen deutschen Stimmen
        let selectedVoice = voices.find(v => 
            v.lang.startsWith('de') && 
            (v.name.toLowerCase().includes('male') || 
             v.name.toLowerCase().includes('stefan') || 
             v.name.toLowerCase().includes('kilian') || 
             v.name.toLowerCase().includes('google'))
        );

        // Fallback: Erste deutsche Stimme
        if (!selectedVoice) {
            selectedVoice = voices.find(v => v.lang.startsWith('de'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`Toni nutzt Stimme: ${selectedVoice.name} im Modus: ${p.timbre}`);
        }

        utterance.pitch = p.pitch; 
        utterance.rate = p.rate;
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
    },

    // --- BEFEHLS-VERARBEITUNG ---
    processCommand: function(input) {
        console.log("Toni analysiert Befehl:", input);
        
        // Hier wird später die API-Anbindung (Ollama/OpenAI) aktiv.
        // Für den Moment simulieren wir die fachmännische Antwort:
        
        if (input.toLowerCase().includes("training") || input.toLowerCase().includes("übung")) {
            this.speak("Ich erstelle einen internationalen Trainingsplan für unsere Defensive, Coach.", "warm");
        } 
        else if (input.toLowerCase().includes("preis") || input.toLowerCase().includes("sponsor")) {
            this.speak("Ich kalkuliere die Marktwerte für unser Sponsoring basierend auf der aktuellen Liga.", "deep");
        }
        else {
            this.speak("Verstanden, Coach Björn. Ich kümmere mich darum.", "neutral");
        }
    },

    // --- TEST-SEQUENZ ---
    testVoices: function() {
        this.speak("Hallo Björn. Hier spricht dein Co-Manager Toni im Deep-Modus. Wir müssen die Finanzen prüfen.", "deep");
        setTimeout(() => {
            this.speak("Und hier bin ich wieder auf dem Platz, Coach! Lass uns das Training rocken.", "warm");
        }, 6000);
    }
};

// Stimmen müssen im Browser oft erst geladen werden
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log("TTS Stimmen geladen und bereit.");
    };
}
