/**
 * Toni 2.0 - Intelligence & Communication Engine
 * Steuert Tonis Dialoge, die Websuche und die visuelle Demonstration.
 */

const chatOutput = document.getElementById('toni-output');

/**
 * Kernfunktion: Toni spricht zum Trainer
 * @param {string} message - Der Text von Toni
 * @param {boolean} useVoice - Ob die Sprachausgabe aktiviert werden soll
 */
function toniSpeak(message, useVoice = true) {
    if (!chatOutput) return;

    // 1. Textuelle Ausgabe
    const msgElement = document.createElement('div');
    msgElement.className = 'toni-message';
    msgElement.style = "margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;";
    msgElement.innerHTML = `<strong>Toni:</strong> ${message}`;
    chatOutput.prepend(msgElement); // Neueste Nachrichten nach oben

    // 2. Sprachausgabe (Web Speech API)
    if (useVoice && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'pt-BR'; // Kleiner Trick für brasilianischen Akzent bei dt. Text
        utterance.lang = 'de-DE'; 
        utterance.pitch = 0.9; // Etwas tiefere, männliche Stimme
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

/**
 * Simuliert die Websuche nach Trainingsübungen
 * Basierend auf der aktuellen Spieleranzahl im Kader.
 */
function searchTrainingNet() {
    const count = activeTrainingCount;
    toniSpeak(`Björn, ich durchsuche gerade das Netz nach den besten Übungen für unsere ${count} Jungs. Ich vergleiche Stile von Brasilien bis Europa...`);

    // Simulierte Verzögerung für die "Fachrecherche"
    setTimeout(() => {
        const trainingId = (currentMode === 'funino') ? "Funino-Power" : "Umschaltspiel-Expert";
        toniSpeak(`Sensationell! Ich habe eine Übung gefunden: <strong>"${trainingId}"</strong>. Soll ich die 12 gelben Hütchen aufstellen und die Jungs farblich einteilen?`);
        
        // Material-Button anbieten
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.style.marginTop = "10px";
        btn.innerText = "Ja, bau es auf!";
        btn.onclick = () => setupTrainingVisuals(trainingId);
        chatOutput.prepend(btn);
    }, 2000);
}

/**
 * Visuelle Demonstration: Toni baut die Übung auf dem Board auf
 */
function setupTrainingVisuals(type) {
    toniSpeak("Alles klar, ich bewege die Spieler und teile die Leibchen aus. Schau aufs Board!");

    // 1. Leibchen-Farben ändern (Beispiel: 5 Gelb vs. 5 Rot)
    squad.forEach((p, index) => {
        if(index < 5) p.color = "var(--yellow-leibchen)"; //
        else p.color = "var(--red-team)";
    });

    // 2. Material aufstellen (Hütchen)
    if (typeof placeCones === "function") {
        placeCones(12); //
    }

    // 3. Board neu zeichnen
    drawBoard();

    // 4. Animation der Laufwege einzeichnen (Demo)
    showTacticalArrows();
}

/**
 * Zeichnet taktische Pfeile für Pass- und Laufwege
 */
function showTacticalArrows() {
    // Hier nutzen wir ein Canvas-Overlay oder SVG (in Paket 5 detailliert)
    toniSpeak("Ich habe dir die Laufwege mit gestrichelten Linien eingezeichnet. Thorsten zieht nach innen, David Luiz sichert ab.");
}

/**
 * Feedback-Funktion: Trainer bewertet Spieler
 */
function openPlayerEvaluation(playerId) {
    const player = squad.find(p => p.id === playerId);
    if(!player) return;

    toniSpeak(`Björn, wie war ${player.name} heute? War er gut im Passspiel oder eher konditionell schwach?`);
    
    // Hier öffnet sich später das Modal aus Paket 5
}

// Event-Listener für Eingaben (falls du ein Chat-Feld hast)
function handleChatInput(text) {
    if(text.toLowerCase().includes("suche") || text.toLowerCase().includes("training")) {
        searchTrainingNet();
    }
}
