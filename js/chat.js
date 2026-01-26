function toniSpeak(message) {
    const output = document.getElementById('toni-output');
    output.innerHTML = `<p><strong>Toni:</strong> ${message}</p>`;
    // Hier wird später die Sprachausgabe (Männerstimme) verknüpft
}

function startTrainingSearch(playerCount) {
    toniSpeak(`Ich durchsuche das Internet nach den besten Übungen für ${playerCount} Spieler...`);
    // Simulierter Web-Call
    setTimeout(() => {
        toniSpeak("Ich habe 3 Übungen gefunden. Soll ich die Hütchen für die erste Übung aufstellen?");
    }, 1500);
}
