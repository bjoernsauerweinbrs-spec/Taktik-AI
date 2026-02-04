// logic/toni-core.js
// KEIN "export" benutzen! Der Browser erkennt window.ToniCore automatisch.

window.ToniCore = {
    processCommand: function(input) {
        if (!input) return;
        
        console.log("ToniCore analysiert:", input);
        
        // Einfache Logik-Prüfung für den Start
        const cmd = input.toLowerCase();
        
        if (cmd.includes("hallo") || cmd.includes("start")) {
            if(window.ToniTTS) ToniTTS.speak("System bereit. Ich analysiere den Kader, Coach Björn.", "warm");
        } else if (cmd.includes("taktik")) {
            if(window.ToniTTS) ToniTTS.speak("Welches System bevorzugst du? Pressing oder Kompakt?", "deep");
        } else {
            // Standard-Antwort
            if(window.ToniTTS) ToniTTS.speak("Verstanden. Ich nehme das in die Analyse auf.");
        }
        
        // Nachricht im Feed anzeigen
        this.displayMessage(input, 'user');
    },

    displayMessage: function(text, sender) {
        const msgArea = document.getElementById('chat-messages');
        if(!msgArea) return;
        
        const div = document.createElement('div');
        div.className = sender === 'user' ? 'user-msg' : 'bot-msg';
        div.innerText = text;
        msgArea.appendChild(div);
        msgArea.scrollTop = msgArea.scrollHeight;
    }
};
