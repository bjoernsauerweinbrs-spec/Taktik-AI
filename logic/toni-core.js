/**
 * TONI 2.0 - CORE ENGINE
 * Zentrale Befehlsverarbeitung ohne Export-Fehler
 */
window.ToniCore = {
    processCommand: function(input) {
        if (!input) return;
        const cmd = input.toLowerCase();
        
        console.log("ToniCore Befehl:", cmd);

        if (cmd.includes("hallo") || cmd.includes("start")) {
            this.respond("Ginga-Modus aktiv. Ich analysiere den Kader, Coach Björn.");
        } else if (cmd.includes("status") || cmd.includes("kader")) {
            this.respond("Greife auf die Mannschaftskabine zu. Die FIFA-Karten werden abgeglichen.");
        } else if (cmd.includes("taktik")) {
            this.respond("Analysiere Formation. Soll ich Pressing oder Kompakt-Modus forcieren?");
        } else {
            this.respond("Verstanden. Die Daten werden in die Tiefenanalyse übernommen.");
        }
    },

    respond: function(text) {
        if(window.ToniTTS) ToniTTS.speak(text, "warm");
        
        const chatArea = document.getElementById('chat-messages');
        if(chatArea) {
            const botMsg = document.createElement('div');
            botMsg.style.cssText = "margin-bottom:15px; color:var(--neon-green); text-shadow: 0 0 5px rgba(57,255,20,0.3);";
            botMsg.innerHTML = `<b>Toni:</b> ${text}`;
            chatArea.appendChild(botMsg);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
};
