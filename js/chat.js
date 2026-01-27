/**
 * Toni 2.0 - Stabiler Chat-Kern (Fix für ReferenceError)
 */

// 1. Die Hauptfunktion, die dein Button in der app.html aufruft
window.handleToniAction = async function() {
    console.log("Toni: Aktion ausgelöst");
    const inputField = document.getElementById('user-msg');
    if (!inputField) return;

    const message = inputField.value.trim();
    
    if (message === "") {
        const greeting = "Ich bin bereit, Björn. Was steht heute auf dem Plan?";
        appendChatMessage("Toni", greeting);
        speakText(greeting);
        return;
    }

    // Zeige deine Nachricht an
    appendChatMessage("Björn", message);
    inputField.value = "";

    // Hole Antwort von Toni
    const reply = getToniDecision(message.toLowerCase());
    appendChatMessage("Toni", reply);
    speakText(reply);
};

// 2. Die Funktion, die laut Konsole gefehlt hat
function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) {
        console.error("Fehler: chat-history Element nicht gefunden!");
        return;
    }

    const msgDiv = document.createElement('div');
    msgDiv.style.margin = "10px 0";
    msgDiv.style.padding = "10px";
    msgDiv.style.borderRadius = "10px";
    msgDiv.style.fontSize = "14px";
    msgDiv.style.lineHeight = "1.4";
    
    if (sender === "Björn") {
        msgDiv.style.background = "rgba(46, 204, 113, 0.15)";
        msgDiv.style.borderLeft = "4px solid #2ecc71";
        msgDiv.style.marginLeft = "30px";
    } else {
        msgDiv.style.background = "rgba(255, 255, 255, 0.05)";
        msgDiv.style.borderLeft = "4px solid #f1c40f";
        msgDiv.style.marginRight = "30px";
    }

    msgDiv.innerHTML = `<strong style="color:var(--accent);">${sender}:</strong> ${text}`;
    history.appendChild(msgDiv);
    
    // Automatisch nach unten scrollen
    history.scrollTop = history.scrollHeight;
}

// 3. Logik-Zentrale
function getToniDecision(msg) {
    if (msg.includes("hallo") || msg.includes("hi")) {
        return "Servus Björn! Das System läuft auf Hochtouren. Sollen wir das Training starten?";
    }
    if (msg.includes("kader") || msg.includes("briefcase")) {
        if (typeof toggleBriefcase === "function") toggleBriefcase();
        return "Ich öffne die Aktentasche. Werfen wir einen Blick auf die Jungs.";
    }
    return "Alles klar, Coach. Ich habe das notiert und bereite die Analyse vor.";
}

// 4. Sprachausgabe
function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85;
    msg.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch'));
    if (maleVoice) msg.voice = maleVoice;

    window.speechSynthesis.speak(msg);
}

// Enter-Taste aktivieren
document.getElementById('user-msg')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        window.handleToniAction();
    }
});

console.log("Toni: Chat-Modul erfolgreich initialisiert.");
