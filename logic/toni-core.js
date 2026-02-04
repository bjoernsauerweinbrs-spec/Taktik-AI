/**
 * TONI 2.0 - INTERNATIONAL PERFORMANCE CORE
 * Global standard command processing & vital data evaluation.
 */
window.ToniCore = {
    isListening: false,

    /**
     * Hauptfunktion zur Verarbeitung von Nachrichten
     */
    processMessage: function(input) {
        if (!input || input.trim() === "") return;
        
        this.addUserMessage(input);
        const cmd = input.toLowerCase();

        // INTEGRATION: Zugriff auf Kaderdaten für Echtzeit-Analyse
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];

        // Logik-Weiche: Internationaler Experten-Modus
        if (cmd.includes("hallo") || cmd.includes("start") || cmd.includes("status")) {
            this.respond(`Internationales System online. Analysiere ${players.length} Profile basierend auf globalen Performance-Standards.`);
        } 
        else if (cmd.includes("medizin") || cmd.includes("puls") || cmd.includes("vital")) {
            this.evaluateHealthData(players);
        }
        else if (cmd.includes("taktik") || cmd.includes("formation")) {
            this.respond("Taktik-Modul bereit. Analysiere vertikale Räume und die RSA-Werte der Startelf für das nächste Match-Szenario.");
        }
        else if (cmd.includes("motivation") || cmd.includes("spruch")) {
            this.respond("Fokus, Männer! Absolute Professionalität ist die Basis für internationalen Erfolg. Jede Aktion zählt – 100% Disziplin bis zum Abpfiff!");
        }
        else if (cmd.includes("foto") || cmd.includes("bild")) {
            this.respond("Foto-Protokoll aktiv. Du kannst nun jedem Spieler-Dossier eine internationale Profil-ID (Bild-URL) zuweisen.");
        }
        else {
            this.respond("Informationen empfangen und im Kern-System für die Tiefenanalyse verarbeitet. Was ist die nächste Anweisung?");
        }
    },

    /**
     * Professionelle medizinische Auswertung der Vitalwerte
     */
    evaluateHealthData: function(players) {
        const atRisk = players.filter(p => p.vitals && p.vitals.pulse > 170);
        
        if(atRisk.length > 0) {
            const names = atRisk.map(p => p.name).join(", ");
            this.respond(`KRITISCHER HINWEIS: Die Belastungswerte von ${names} liegen über dem internationalen Standard (Pulse > 170 BPM). Umgehende Belastungssteuerung empfohlen.`);
        } else if (players.length > 0) {
            this.respond("Alle aktiven Vitaldaten liegen innerhalb der medizinischen Toleranzbereiche der internationalen Leistungsdiagnostik.");
        } else {
            this.respond("Keine Spielerdaten für eine medizinische Analyse im System gefunden.");
        }
    },

    /**
     * Startet die Spracherkennung (International Protocol)
     */
    startVoice: function() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) {
            this.respond("Siri/Chrome Spracherkennung wird nicht unterstützt.");
            return;
        }

        const rec = new Recognition();
        rec.lang = 'de-DE';
        rec.onstart = () => {
            this.isListening = true;
            this.respond("System hört zu... (International Protocol active)");
        };

        rec.onresult = (event) => {
            this.processMessage(event.results[0][0].transcript);
        };

        rec.onerror = () => { this.isListening = false; };
        rec.onend = () => { this.isListening = false; };
        rec.start();
    },

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

    respond: function(text) {
        if(window.ToniTTS) ToniTTS.speak(text, "deep");
        
        const chatArea = document.getElementById('chat-messages');
        if(chatArea) {
            const botMsg = document.createElement('div');
            botMsg.style.cssText = "margin-bottom:15px; color:var(--neon-green); font-weight:bold;";
            botMsg.innerHTML = `<b>Toni [INT]:</b> ${text}`;
            chatArea.appendChild(botMsg);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }
};
