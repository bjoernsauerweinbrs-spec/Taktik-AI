/**
 * TONI 2.0 - INTERNATIONAL TACTICAL CORE
 * Sprach- & Logik-Zentrale für High-Performance Training.
 * Steuert Formationen, Verschiebe-Befehle und methodische Beratung.
 */
window.ToniCore = {
    isListening: false,
    
    // Taktische Bibliothek (Relative Koordinaten: 0.0 bis 1.0)
    formations: {
        "viererkette": [
            {pos: "TW", x: 0.1, y: 0.5},
            {pos: "LV", x: 0.25, y: 0.2}, {pos: "IV", x: 0.25, y: 0.4}, 
            {pos: "IV", x: 0.25, y: 0.6}, {pos: "RV", x: 0.25, y: 0.8}
        ],
        "3-4-3": [
            {pos: "TW", x: 0.1, y: 0.5},
            {pos: "IV", x: 0.25, y: 0.3}, {pos: "IV", x: 0.25, y: 0.5}, {pos: "IV", x: 0.25, y: 0.7},
            {pos: "LM", x: 0.45, y: 0.2}, {pos: "ZM", x: 0.45, y: 0.4}, 
            {pos: "ZM", x: 0.45, y: 0.6}, {pos: "RM", x: 0.45, y: 0.8},
            {pos: "ST", x: 0.70, y: 0.2}, {pos: "ST", x: 0.70, y: 0.5}, {pos: "ST", x: 0.70, y: 0.8}
        ]
    },

    processMessage: function(input) {
        if (!input || input.trim() === "") return;
        this.addUserMessage(input);
        const cmd = input.toLowerCase();

        // 1. FORMATIONS-BEFEHLE (Verschiebt Spieler auf dem Board)
        if (cmd.includes("viererkette") || cmd.includes("4er kette")) {
            this.executeFormation("viererkette", "Ich formiere die Viererkette. Achte auf die horizontale Kompaktheit beim Verschieben.");
        } 
        else if (cmd.includes("3-4-3")) {
            this.executeFormation("3-4-3", "Wechsel auf 3-4-3. Wir besetzen die Halbräume jetzt offensiver.");
        }
        else if (cmd.includes("schieb") && (cmd.includes("vor") || cmd.includes("pressing"))) {
            this.executeMovement("forward", "Team rückt auf. Wir forcieren das Gegenpressing nach Klopp-Standard.");
        }

        // 2. METHODIK & BERATUNG (Nagelsmann / Klopp / Jugend)
        else if (cmd.includes("koordination") || cmd.includes("leiter")) {
            this.respond("Für die Koordinationsleiter: Fokus auf die Frequenz. 2 Kontakte pro Feld, Blick vom Boden lösen. Das schult die Handlungsschnelligkeit.");
        }
        else if (cmd.includes("kinder") || cmd.includes("f-jugend") || cmd.includes("funino")) {
            this.respond("Bei den Kleinen gilt: Spielnahe Abläufe. Wir nutzen die 4 Tore beim Funino, um die Wahrnehmung zu schulen. Coaching-Punkt: Kopf hoch vor dem Pass.");
        }
        else if (cmd.includes("taktik") || cmd.includes("analyse")) {
            this.respond("Analysiere vertikale Schnittstellen. Empfehlung: Überladungen in den Halbräumen schaffen, um die gegnerische Kette zu binden.");
        }

        // 3. MEDIZIN-SCAN (Prüft nur Spieler, die aktuell im Training sind)
        else if (cmd.includes("medizin") || cmd.includes("puls") || cmd.includes("vital")) {
            const players = JSON.parse(localStorage.getItem('toni_players')) || [];
            const atTraining = players.filter(p => p.isPresent);
            this.evaluateHealthData(atTraining);
        }

        else if (cmd.includes("motivation") || cmd.includes("spruch")) {
            this.respond("Fokus! Qualität kommt von Quälen. Jede Aktion im Training ist die Vorbereitung auf den Sieg am Wochenende. 100%!");
        }
        else {
            this.respond("Daten im internationalen Kontext verarbeitet. Soll ich eine spezifische Übung visualisieren oder die Formation anpassen?");
        }
    },

    executeFormation: function(key, responseText) {
        const coords = this.formations[key];
        if(window.arena && window.arena.applyTacticalPositions) {
            window.arena.applyTacticalPositions(coords);
            this.respond(responseText);
        } else {
            this.respond("Formation erkannt, aber das Spielfeld ist noch nicht bereit.");
        }
    },

    executeMovement: function(direction, responseText) {
        if(window.arena && window.arena.shiftTeam) {
            window.arena.shiftTeam(direction);
            this.respond(responseText);
        }
    },

    evaluateHealthData: function(players) {
        const atRisk = players.filter(p => p.vitals && p.vitals.pulse > 175);
        if(atRisk.length > 0) {
            const names = atRisk.map(p => p.name).join(", ");
            this.respond(`KRITISCHE BELASTUNG: ${names} liegen über 175 BPM. Belastungssteuerung einleiten, Intensität drosseln.`);
        } else if (players.length > 0) {
            this.respond("Belastungs-Check abgeschlossen: Alle Spieler im grünen Bereich der internationalen Leistungsdiagnostik.");
        } else {
            this.respond("Keine Spieler als 'Anwesend' im Training markiert. Scan abgebrochen.");
        }
    },

    respond: function(text) {
        if(window.ToniTTS) ToniTTS.speak(text, "deep");
        const chatArea = document.getElementById('chat-messages');
        if(chatArea) {
            const botMsg = document.createElement('div');
            botMsg.style.cssText = "margin-bottom:15px; color:var(--neon-green); font-weight:bold;";
            botMsg.innerHTML = `<b>Toni [PRO]:</b> ${text}`;
            chatArea.appendChild(botMsg);
            chatArea.scrollTop = chatArea.scrollHeight;
        }
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

    startVoice: function() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) return this.respond("Browser unterstützt keine Spracherkennung.");
        const rec = new Recognition();
        rec.lang = 'de-DE';
        rec.onstart = () => { this.respond("System hört zu... (International Protocol)"); };
        rec.onresult = (event) => { this.processMessage(event.results[0][0].transcript); };
        rec.start();
    }
};
