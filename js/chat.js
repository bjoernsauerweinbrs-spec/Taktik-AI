/**
 * Toni 2.0 - Intelligence & Voice Engine
 * Steuert Tonis Dialoge, die Websuche und die Sprachausgabe.
 */

const outputContainer = document.getElementById('toni-output');

/**
 * Toni spricht: Text-Ausgabe im Chat und Audio-Ausgabe
 * @param {string} message - Die Nachricht an Björn
 */
function toniSpeak(message) {
    if (!outputContainer) return;

    // 1. Visuelle Sprechblase im brasilianischen Stil
    const msgDiv = document.createElement('div');
    msgDiv.style = "background: #f1f8e9; border-left: 5px solid #2e7d32; padding: 12px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); animation: fadeIn 0.3s ease;";
    msgDiv.innerHTML = `<strong style="color:#1b5e20;">Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv); // Neueste Nachricht immer oben

    // 2. Sprachausgabe (Männliche Stimme)
    if ('speechSynthesis' in window) {
        // Eventuelle laufende Sprachausgabe stoppen
        window.speechSynthesis.cancel();
        
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.9; // Etwas tiefer = männlicher
        utter.rate = 1.0;  // Normales Tempo
        
        // Versuch, eine spezifische männliche Stimme zu finden
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Microsoft Stefan'));
        if (maleVoice) utter.voice = maleVoice;

        window.speechSynthesis.speak(utter);
    }
}

/**
 * Simuliert die Fachrecherche im Internet
 */
function searchTrainingNet() {
    toniSpeak(`Björn, mein Freund! Ich verbinde mich mit der globalen Datenbank... Ich suche Übungen für genau ${activeTrainingCount} Spieler.`);
    
    // Kleiner Zeitverzug für den "Lade-Effekt"
    setTimeout(() => {
        const theme = (currentMode === 'funino') ? "Funino Ginga-Style 3v3" : "Brasilianisches Umschaltspiel 4-4-2";
        toniSpeak(`Sensationell! Ich habe eine Top-Übung gefunden: <strong>"${theme}"</strong>. Ich habe die Hütchen und Bälle bereits für dich im Kopf vorbereitet. Soll ich sie aufbauen?`);
        
        // Button direkt im Chat anbieten
        const btn = document.createElement('button');
        btn.className = 'nav-btn orange';
        btn.style.marginTop = "10px";
        btn.innerText = "Ja, Toni, bau auf!";
        btn.onclick = () => {
            placeCones(12);
            distributeBalls(activeTrainingCount);
            drawBoard();
        };
        outputContainer.prepend(btn);
    }, 2000);
}

/**
 * Verarbeitet die manuelle Eingabe von Björn
 */
function handleChatInput(input) {
    const text = input.toLowerCase();
    
    if (text.includes("suche") || text.includes("übung") || text.includes("training")) {
        searchTrainingNet();
    } 
    else if (text.includes("tor") && text.includes("drehen")) {
        toniSpeak("Klick einfach direkt auf eines der Tore auf dem Board, Björn. Jedes Mal dreht es sich um 90 Grad – so kannst du es öffnen, wie du willst!");
    } 
    else if (text.includes("ball") || text.includes("bälle")) {
        distributeBalls(16);
    } 
    else if (text.includes("hütchen")) {
        placeCones(12);
    }
    else {
        toniSpeak("Interessanter Punkt! Soll ich das taktisch auf dem Board demonstrieren oder eine passende Übung dazu suchen?");
    }
}

// Begrüßung beim ersten Laden
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        toniSpeak("Bereit für das nächste Level, Björn? Der Kader steht, das Board ist sauber. Was hast du heute vor?");
    }, 1000);
});
