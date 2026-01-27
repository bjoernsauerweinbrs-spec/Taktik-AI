/**
 * Toni 2.0 - Chat & Voice Engine
 */

// Diese Funktion wird aufgerufen, wenn du auf "ANALYSE STARTEN" drückst
function handleToniAction() {
    const input = document.getElementById('user-msg');
    const message = input.value.trim();
    
    if (message === "") {
        // Wenn das Feld leer ist, fragen wir Toni nach einem Status-Check
        toniSpeak("Ich bin bereit, Björn. Möchtest du eine taktische Analyse starten oder den Kader prüfen?");
        addChatMessage("Toni", "Ich bin bereit, Björn. Möchtest du eine taktische Analyse starten oder den Kader prüfen?");
        return;
    }

    // Nachricht im Chat anzeigen
    addChatMessage("Björn", message);
    
    // Logik-Check für Toni
    processToniResponse(message.toLowerCase());
    
    // Feld leeren
    input.value = "";
}

function processToniResponse(msg) {
    let response = "";

    if (msg.includes("hallo") || msg.includes("hi")) {
        response = "Hallo Björn! Ich habe alle Systeme hochgefahren. Der brasilianische Ginga-Style ist bereit für das Training. Was steht heute an?";
    } else if (msg.includes("taktik") || msg.includes("board")) {
        response = "Ich öffne das Board. Die roten Spieler stehen bereit für deine Anweisungen.";
        if(window.showPitch) window.showPitch(); // Falls Board-Logik verknüpft
    } else if (msg.includes("kader") || msg.includes("briefcase")) {
        response = "Ich öffne die Aktentasche. Deine Spielerdaten sind geladen.";
        toggleBriefcase();
    } else {
        response = "Verstanden, Björn. Ich analysiere das und bereite die Spielsituation entsprechend vor.";
    }

    toniSpeak(response);
    addChatMessage("Toni", response);
}

// Sprachausgabe (Toni als absoluter Fachmann)
function toniSpeak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new Uint8Array(); // Placeholder für saubere Syntax
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'de-DE';
        msg.pitch = 0.9; // Etwas tiefere, männliche Stimme
        msg.rate = 1.0;
        
        // Findet eine männliche Stimme, falls vorhanden
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(voice => voice.name.includes('Stefan') || voice.name.includes('Google Deutsch'));
        if (maleVoice) msg.voice = maleVoice;

        window.speechSynthesis.speak(msg);
    }
}

// Chat-Historie im UI ergänzen
function addChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;

    const div = document.createElement('div');
    div.style.marginBottom = "10px";
    div.style.padding = "8px 12px";
    div.style.borderRadius = "8px";
    
    if (sender === "Björn") {
        div.style.background = "rgba(46, 204, 113, 0.1)";
        div.style.alignSelf = "flex-end";
        div.style.borderLeft = "3px solid #2ecc71";
    } else {
        div.style.background = "rgba(255, 255, 255, 0.05)";
        div.style.borderLeft = "3px solid #f1c40f";
    }

    div.innerHTML = `<strong>${sender}:</strong> <span style="font-size: 13px;">${text}</span>`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

// Enter-Taste zum Senden erlauben
document.getElementById('user-msg').addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleToniAction();
    }
});
