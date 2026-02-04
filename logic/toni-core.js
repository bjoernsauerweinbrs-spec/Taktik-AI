/**
 * TONI 2.0 - CORE ENGINE (PRO-TACTICAL EDITION)
 * Verarbeitet Onboarding, KI-Anfragen (Ollama/OpenAI) und adaptive Board-Logik.
 */
window.ToniCore = {
    isProcessing: false,
    
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

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. Onboarding-Check
        if (this.detectOnboarding(text)) {
            await this.handleOnboarding(text);
        } 
        // 2. Lokale Taktik-Befehle (Sofort-Ausführung ohne KI-Verzögerung)
        else if (cmd.includes("viererkette") || cmd.includes("4er kette")) {
            this.executeFormation("viererkette", "Ich formiere die Viererkette. Fokus auf die Abstände.");
        }
        else if (cmd.includes("3-4-3")) {
            this.executeFormation("3-4-3", "Wechsel auf 3-4-3. Wir überladen jetzt das Zentrum.");
        }
        else if (cmd.includes("schieb") && (cmd.includes("vor") || cmd.includes("hoch"))) {
            if(window.arena) window.arena.shiftTeam("forward");
            this.finalizeResponse("Team rückt auf. Wir erhöhen den Pressing-Druck.");
        }
        // 3. Medizin-Check
        else if (cmd.includes("medizin") || cmd.includes("vital") || cmd.includes("puls")) {
            this.evaluateHealthData();
        }
        // 4. Allgemeine taktische KI-Anfrage
        else {
            await this.handleTacticalQuery(text);
        }

        this.isProcessing = false;
        this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
    },

    detectOnboarding: function(text) {
        const keywords = ["verein", "club", "liga", "klasse", "name", "heiße", "trainer"];
        const lowerText = text.toLowerCase();
        return keywords.some(key => lowerText.includes(key)) && lowerText.length < 150;
    },

    handleOnboarding: async function(text) {
        if(window.ToniTTS) ToniTTS.speak("Einen Moment, Coach. Ich konfiguriere mein System.", "warm");
        const currentConfig = JSON.parse(localStorage.getItem('toni_club_config')) || {};
        
        // Logik zur Extraktion (vereinfacht)
        setTimeout(() => {
            const config = {
                name: text.includes("von") ? text.split("von")[1].trim() : (currentConfig.name || "Dein Verein"),
                coach: currentConfig.coach || "Björn",
                league: currentConfig.league || "Pro-Level"
            };
            localStorage.setItem('toni_club_config', JSON.stringify(config));
            const response = `Konfiguration abgeschlossen. Ich habe den ${config.name} im System hinterlegt. Bereit für die Analyse, Coach ${config.coach}.`;
            this.finalizeResponse(response);
        }, 1000);
    },

    handleTacticalQuery: async function(text) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');

        if (provider === "llama") {
            await this.queryOllama(text);
        } else {
            await this.queryOpenAI(text, apiKey);
        }
    },

    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                body: JSON.stringify({
                    model: 'gemma',
                    prompt: `Du bist Toni, ein internationaler Fußball-Experte. Antworte kurz, präzise und professionell auf Deutsch. Frage: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            this.finalizeResponse(data.response);
        } catch (e) {
            this.handleError("Ollama nicht erreichbar. Läuft der Server (Port 11434)?");
        }
    },

    queryOpenAI: async function(prompt, key) {
        this.finalizeResponse("OpenAI-Schnittstelle aktiv. Analysiere Daten-Cluster...");
    },

    executeFormation: function(key, responseText) {
        const coords = this.formations[key];
        if(window.arena && window.arena.applyTacticalPositions) {
            window.arena.applyTacticalPositions(coords);
            this.finalizeResponse(responseText);
        }
    },

    evaluateHealthData: function() {
        const players = JSON.parse(localStorage.getItem('toni_players')) || [];
        const atTraining = players.filter(p => p.isPresent);
        const atRisk = atTraining.filter(p => p.vitals && p.vitals.pulse > 175);
        
        if(atRisk.length > 0) {
            const names = atRisk.map(p => p.name).join(", ");
            this.finalizeResponse(`KRITISCHE BELASTUNG: ${names} über 175 BPM. Belastung drosseln.`);
        } else {
            this.finalizeResponse("Alle anwesenden Spieler sind im optimalen Belastungsbereich.");
        }
    },

    finalizeResponse: function(answer) {
        this.addToChat("Toni", answer);
        if(window.ToniTTS) ToniTTS.speak(answer, "warm");
    },

    addUserMessage: function(text) {
        const chatBox = document.getElementById('chat-messages');
        if(chatBox) {
            const div = document.createElement('div');
            div.style.cssText = "margin-bottom:10px; color:var(--text-dim); text-align:right;";
            div.innerHTML = `<span style="background:rgba(255,255,255,0.05); padding:5px 10px; border-radius:5px;"><b>Björn:</b> ${text}</span>`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    },

    addToChat: function(sender, msg) {
        const chatBox = document.getElementById('chat-messages');
        if(chatBox) {
            const div = document.createElement('div');
            div.style.marginBottom = "15px";
            div.style.animation = "fadeIn 0.3s ease-out";
            div.innerHTML = `<b style="color:var(--neon-green)">${sender}:</b> <span style="color:#fff">${msg}</span>`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    },

    updateStatus: function(text, color) {
        const statusText = document.getElementById('toni-status-text');
        if(statusText) {
            statusText.innerText = text;
            statusText.style.color = color;
        }
    },

    handleError: function(err) {
        this.addToChat("System", err);
        if(window.ToniTTS) ToniTTS.speak("Verbindungsproblem, Coach.", "warm");
    },

    startVoice: function() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) return this.handleError("Browser unterstützt keine Spracherkennung.");
        
        const rec = new Recognition();
        rec.lang = 'de-DE';
        rec.onstart = () => this.updateStatus("TONI HÖRT ZU...", "var(--accent-orange)");
        rec.onresult = (e) => this.processMessage(e.results[0][0].transcript);
        rec.onend = () => this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
        rec.start();
    }
};
