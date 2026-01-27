/**
 * Toni 2.0 - Taktische Intelligenz & Board-Anbindung
 */

window.handleToniAction = async function() {
    const inputField = document.getElementById('user-msg');
    const message = inputField.value.trim();
    if (!message) return;

    appendChatMessage("Björn", message);
    inputField.value = "";

    // 1. Lokale Vorab-Prüfung (Decision Tree)
    const lowMsg = message.toLowerCase();
    
    if (lowMsg.includes("hallo") || lowMsg.includes("start")) {
        const reply = "Hallo Björn! Bevor wir loslegen: Für welche Altersklasse steht heute die Analyse an? (Senioren, U19, Funino?) Sobald ich das weiß, baue ich das passende Spielfeld auf.";
        appendChatMessage("Toni", reply);
        speakText(reply);
        return;
    }

    // 2. Taktische Automatik: Senioren erkannt?
    if (lowMsg.includes("senioren") || lowMsg.includes("herren")) {
        if (typeof window.setPitch === "function") window.setPitch('grossfeld');
        const reply = "Senioren – alles klar, Björn. Das Großfeld ist aufgebaut. Soll ich die Grundformation 4-3-3 oder 4-4-2 setzen?";
        appendChatMessage("Toni", reply);
        speakText(reply);
        return;
    }

    // 3. Wenn keine Automatik greift: Echte KI-Anfrage (Groq)
    // Hier fügen wir deinen API-Key ein, um Toni echtes Wissen zu geben
    const response = await askToniAI(message);
    appendChatMessage("Toni", response);
    speakText(response);
};

// Hilfsfunktion für das Chat-Design
function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const msgDiv = document.createElement('div');
    msgDiv.style.margin = "10px 0";
    msgDiv.style.padding = "12px";
    msgDiv.style.borderRadius = "10px";
    
    if (sender === "Björn") {
        msgDiv.style.background = "rgba(46, 204, 113, 0.15)";
        msgDiv.style.borderLeft = "4px solid #2ecc71";
    } else {
        msgDiv.style.background = "rgba(255, 255, 255, 0.05)";
        msgDiv.style.borderLeft = "4px solid #f1c40f";
    }
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(msgDiv);
    history.scrollTop = history.scrollHeight;
}

function speakText(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85; // Männlicher, tiefer Ton
    window.speechSynthesis.speak(msg);
}
