/**
 * TONI 2.0 - CORE ENGINE
 * Zentrale Befehlsverarbeitung & Voice-Integration
 */
window.ToniCore = {
    isListening: false,

    /**
     * Hauptfunktion zur Verarbeitung von Nachrichten (wird vom Senden-Button aufgerufen)
     */
    processMessage: function(input) {
        if (!input || input.trim() === "") return;
        
        // 1. Deine Nachricht im Chat anzeigen
        this.addUserMessage(input);
        
        const cmd = input.toLowerCase();
        console.log("ToniCore analysiert:", cmd);

        // 2. Logik-Weiche für Antworten
        if (cmd.includes("hallo") || cmd.includes("start") || cmd.includes("hi")) {
            this.respond(`Ginga-Modus aktiv, Coach Björn. Ich habe das System hochgefahren. Alle Sektoren sind bereit.`);
        } 
        else if (cmd.includes("status") || cmd.includes("kader") || cmd.includes("spieler")) {
            const players = JSON.parse(localStorage.getItem('toni_players')) || [];
            this.respond(`Greife auf die Mannschaftskabine zu. Wir haben aktuell ${players.length} Spieler im System. Die OVR-Werte sind synchronisiert.`);
        } 
        else if (cmd.includes("taktik") || cmd.includes("formation")) {
            this.respond("Taktik-Zentrale bereit. Soll ich die Pressing-Linie verschieben oder die Kompaktheit im Mittelfeld erhöhen?");
        }
        else if (cmd.includes("foto") || cmd.includes("bild")) {
            this.respond("Verstanden. Du kannst jetzt in der Mannschaftskabine jedem Profi eine Bild-URL zuweisen, um die FIFA-Karte zu vervollständigen.");
        }
        else {
            this.respond("Ich habe die Daten empfangen und leite sie an die Tiefenanalyse weiter. Was ist der nächste Schritt, Coach?");
        }
    },

    /**
     * Startet die Spracherkennung (Mikrofon)
     */
    startVoice: function() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
            this.respond("Siri/Chrome Spracherkennung wird von diesem Browser leider nicht unterstützt.");
            return;
        }

        const rec = new Recognition();
        rec.lang = 'de-DE';
        rec.interimResults = false;

        rec.onstart = () => {
            this.isListening = true;
            this.respond("Ich höre zu, Coach... (Sprechen Sie jetzt)");
        };

        rec.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.processMessage(transcript);
        };

        rec.onerror = () => {
            this.respond("Da gab es ein Problem mit dem Mikrofon. Ist es freigegeben?");
            this.isListening = false;
        };

        rec.onend = () => { this.isListening = false; };

        rec.start();
    },

    /**
     * Zeigt die Nachricht des Users im Chat an
     */
    addUserMessage: function(text) {
        const chatArea = document.getElementById('chat-messages');
        if(chatArea) {
            const userMsg = document.createElement('div');
            userMsg.style.cssText = "margin-bottom:10px; color:var(--text-dim); text-align:right;";
            userMsg.innerHTML = `<span style="background:rgba(255,255,255,0.05); padding:5px 10px; border-radius:5px;"><b>Coach Björn:</b> ${text}</span>`;
            chatArea.appendChild(userMsg);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    },

    /**
     * Toni antwortet im Chat und per Sprache
     */
    respond: function(text) {
        // Sprachausgabe via TTS
        if(window.ToniTTS) ToniTTS.speak(text, "warm");
        
        // Chat-Ausgabe
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
