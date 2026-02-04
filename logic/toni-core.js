window.ToniCore = {
    processCommand: function(input) {
        if (!input) return;
        console.log("ToniCore: Verarbeite Befehl...", input);

        // Simulation der KI-Antwort (Später echte API-Anbindung)
        if (input.toLowerCase().includes("hallo") || input.toLowerCase().includes("bereit")) {
            ToniTTS.speak("Ich bin bereit. Sollen wir das Training für Mittwoch planen?");
        } else if (input.toLowerCase().includes("test")) {
            ToniTTS.test();
        } else {
            // Fallback für KI-Analyse
            ToniTTS.speak("Verstanden. Ich analysiere das für das nächste Update.");
        }
    }
};
