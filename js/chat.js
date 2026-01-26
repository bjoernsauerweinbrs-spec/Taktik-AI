/**
 * Toni 2.0 - Chat & Intelligence Engine (Final Version)
 */

const outputContainer = document.getElementById('toni-output');

/**
 * Toni gibt eine Nachricht aus (Text & Audio)
 */
function toniSpeak(message) {
    if (!outputContainer) return;

    const msg = document.createElement('div');
    msg.style = "background: #e8f5e9; padding: 10px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid #2e7d32;";
    msg.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msg);

    // Männliche Stimme (Deutsch)
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(message);
        utter.pitch = 0.85; // Tiefer für männliche Stimme
        utter.rate = 1.0;
        synth.speak(utter);
    }
}

/**
 * Simuliert die Internet-Recherche
 */
function searchTrainingNet() {
    toniSpeak("Ich scanne das Internet nach Top-Übungen für " + activeTrainingCount + " Spieler... Vergleiche brasilianische Technik mit europäischer Taktik.");
    
    setTimeout(() => {
        const title = currentMode === 'funino' ? "Ginga-Kids 3v3" : "Brasilianisches Umschaltspiel";
        toniSpeak(`Björn, ich habe die Übung <strong>"${title}"</strong> gefunden. Ich platziere die Hütchen und teile die Leibchen für dich ein!`);
        
        // Leibchen-Logik: Erste Hälfte Gelb, zweite Hälfte Rot
        squad.forEach((p, i) => {
            if(p.status === 'team') {
                p.color = (i % 2 === 0) ? 'var(--yellow-leibchen)' : 'var(--red-team)';
            }
        });
        
        placeCones(8);
        drawBoard();
    }, 2000);
}

/**
 * Verarbeitet manuelle Trainer-Eingaben
 */
function handleChatInput(input) {
    const val = input.toLowerCase();
    if (val.includes("suche") || val.includes("übung")) {
        searchTrainingNet();
    } else if (val.includes("funino")) {
        switchMode('funino');
    } else if (val.includes("11")) {
        switchMode('11v11');
    } else {
        toniSpeak("Interessanter Punkt, Björn. Soll ich das taktisch für dich auf dem Board demonstrieren?");
    }
}
