/**
 * Toni 2.0 - Arena Build Engine
 * Steuert die Animation und das Voice-Timing nach dem 4-Sekunden-Drehbuch.
 */

window.toniArena = {
    start: async () => {
        console.log("🏟️ Arena-Build läuft...");
        const pitchContainer = document.getElementById('pitch-container');
        if (!pitchContainer) return;

        // Phase 1 (0,0 s): Begrüßung & Start der Transformation
        window.toniVoice.speak("Hallo Björn, ich bin Toni, dein KI Co-Trainer. Ich fahre die Systeme hoch und bereite das Stadion vor.");
        pitchContainer.classList.add('building');

        // Phase 4 (2,6 s): Der "Magic Moment" - Die Abfrage
        setTimeout(() => {
            window.toniVoice.speak("Für welche Altersklasse schalten wir das Board heute scharf? Senioren-Großfeld, Jugend-Kleinfeld oder Funino?");
            pitchContainer.classList.add('scanning'); 
            
            // Zeigt Auswahl-Buttons in der Sidebar an, falls du nicht tippen/sprechen willst
            showQuickSelectButtons();
        }, 2600);

        // Phase 5 (4,0 s): Arena eingerastet & bereit
        setTimeout(() => {
            pitchContainer.classList.remove('building');
            pitchContainer.classList.add('ready');
            console.log("✅ Arena-Build abgeschlossen.");
        }, 4000);
    }
};

/**
 * Hilfsfunktion: Zeigt Buttons in der Aktentasche während des Intros
 */
function showQuickSelectButtons() {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
        sidebar.innerHTML = `
            <div class="quick-select-area">
                <p style="color: white; margin-bottom: 10px;">Altersklasse wählen:</p>
                <button class="btn-select" onclick="window.processAgeGroupAnswer('Senioren')">Senioren</button>
                <button class="btn-select" onclick="window.processAgeGroupAnswer('Jugend')">Jugend</button>
                <button class="btn-select" onclick="window.processAgeGroupAnswer('Funino')">Funino</button>
            </div>
        `;
    }
}
