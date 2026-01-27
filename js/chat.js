/**
 * Toni 2.0 - Stabiler Chat-Kern
 */

// 1. Hauptfunktion für den Button
window.handleToniAction = function() {
    console.log("Toni: Button gedrückt");
    const input = document.getElementById('user-msg');
    if (!input) return;

    const message = input.value.trim();
    
    if (message === "") {
        const hello = "Ich bin bereit, Björn. Was steht auf dem Trainingsplan?";
        addChatMessage("Toni", hello);
        speakText(hello);
        return;
    }

    addChatMessage("Björn", message);
    input.value = "";

    // Einfache Logik-Weiche
    const reply = getToniReply(message.toLowerCase());
    addChatMessage("Toni", reply);
    speakText(reply);
};

// 2. Antwort-Logik
function getToniReply(msg) {
    if (msg.includes("hallo") || msg.includes("hi")) {
        return "Hallo Coach Björn! Alle Systeme sind scharf geschaltet. Bereit für die Analyse?";
    }
    if (msg.includes("kader") || msg.includes("briefcase")) {
        if (typeof toggleBriefcase === "function") toggleBriefcase();
        return "Ich öffne die Aktentasche für dich.";
    }
    return "Verstanden, Björn. Ich habe das im Blick und bereite alles vor.";
}

// 3. Sprachausgabe (Männlich & Souverän)
function speakText(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Vorherige Sprache stoppen
    
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.85;
    msg.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch'));
    if (maleVoice) msg.voice = maleVoice;

    window.speechSynthesis.speak(msg);
}

// 4. Chat-UI Update
function addChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    if (!history) return;

    const div = document.createElement('div');
    div.style.margin = "8px 0";
    div.style.padding = "10px";
    div.style.borderRadius = "8px";
    div.style.fontSize = "13px";
    
    if (sender === "Björn") {
        div.style.background = "rgba(46, 204, 113, 0.1)";
        div.style.borderLeft = "3px solid #2ecc71";
        div.style.marginLeft = "20px";
    } else {
        div.style.background = "rgba(255, 255, 255, 0.05)";
        div.style.borderLeft = "3px solid #f1c40f";
        div.style.marginRight = "20px";
    }

    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

// Enter-Taste Support
document.getElementById('user-msg')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        window.handleToniAction();
    }
});

console.log("Toni: Chat-Modul geladen.");
