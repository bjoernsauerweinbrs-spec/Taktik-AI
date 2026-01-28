/**
 * Toni 2.0 - Arena Build Engine
 * Steuert die Animation und das Voice-Timing nach dem 4-Sekunden-Drehbuch.
 */

window.toniArena = {
    start: async () => {
        console.log("🏟️ Arena-Build läuft...");
        const pitchContainer = document.getElementById('pitch-container');
        
        // Phase 1 (0,0s): Begrüßung
        window.toniVoice.speak("Hallo Björn, ich bin Toni, dein KI Co-Trainer. Ich fahre die Systeme hoch und bereite das Stadion vor.");
        pitchContainer.classList.add('building');

        // Phase 4 (2,6s): Präzise Abfrage
        setTimeout(() => {
            window.toniVoice.speak("Für welche Altersklasse schalten wir das Board heute scharf? Senioren-Großfeld, Jugend-Kleinfeld oder Funino?");
            pitchContainer.classList.add('scanning'); 
        }, 2600);

        // Phase 5 (4,0s): Abschluss
        setTimeout(() => {
            pitchContainer.classList.remove('building');
            pitchContainer.classList.add('ready');
            console.log("✅ Arena bereit.");
        }, 4000);
    }
};
