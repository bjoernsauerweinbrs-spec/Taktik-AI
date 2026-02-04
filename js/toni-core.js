/**
 * TONI 2.0 - CORE ENGINE
 * Verarbeitet Onboarding, KI-Anfragen und adaptive Logik.
 */
window.ToniCore = {
    isProcessing: false,

    /**
     * Verarbeitet die Nachricht des Nutzers
     */
    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;

        // 1. Prüfen, ob es sich um Onboarding-Daten handelt
        if (this.detectOnboarding(text)) {
            await this.handleOnboarding(text);
        } else {
            // Normale taktische Anfrage
            await this.handleTacticalQuery(text);
        }

        this.isProcessing = false;
    },

    /**
     * Erkennt, ob der Nutzer gerade seine Daten (Name, Verein, Liga) angibt
     */
    detectOnboarding: function(text) {
        const keywords = ["verein", "club", "liga", "klasse", "name", "heiße", "trainer"];
        const lowerText = text.toLowerCase();
        return keywords.some(key => lowerText.includes(key)) && lowerText.length < 150;
    },

    /**
     * Extrahiert Daten aus dem Onboarding-Gespräch und speichert sie
     */
    handleOnboarding: async function(text) {
        if(window.ToniTTS) ToniTTS.speak("Einen Moment, Coach. Ich konfiguriere mein System auf deine Vorgaben.", "warm");

        // Simulation einer einfachen Extraktion (kann später durch KI verfeinert werden)
        const currentConfig = JSON.parse(localStorage.getItem('toni_club_config')) || {};
        
        // Beispielhafte Logik: "Ich bin Björn vom FC Toni aus der Bundesliga"
        const words = text.split(" ");
        
        // Wir triggern hier eine kurze Denkpause für Toni
        setTimeout(() => {
            const config = {
                name: currentConfig.name || "Dein Verein",
                coach: currentConfig.coach || "Coach",
                league: currentConfig.league || "Pro-Level"
            };

            // Speichern und im System-Modul reflektieren
            localStorage.setItem('toni_club_config', JSON.stringify(config));
            if(window.BriefcaseUI) window.BriefcaseUI.clubData = config;

            const response = `Alles klar! Ich habe das System auf den ${config.name} in der ${config.league} eingestellt. Ich freue mich auf die Arbeit, Coach ${config.coach}. Wie gehen wir das heutige Training an?`;
            
            this.addToChat("Toni", response);
            if(window.ToniTTS) ToniTTS.speak(response, "deep");
        }, 1500);
    },

    /**
     * Verarbeitet taktische Fragen über den gewählten KI-Provider (Ollama/OpenAI)
     */
    handleTacticalQuery: async function(text) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');

        this.addToChat("Toni", "Analysiere Spielsituation...");

        if (provider === "llama") {
            // OLLAMA LOKALE ABFRAGE (Standard 127.0.0.1:11434)
            this.queryOllama(text);
        } else {
            // OPENAI CLOUD ABFRAGE
            this.queryOpenAI(text, apiKey);
        }
    },

    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                body: JSON.stringify({
                    model: 'gemma', // oder dein bevorzugtes Modell
                    prompt: `Du bist Toni, ein internationaler Fußball-Experte. Antworte kurz und präzise auf Deutsch. Frage: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            this.finalizeResponse(data.response);
        } catch (e) {
            this.handleError("Ollama nicht erreichbar. Läuft der Server auf Port 11434?");
        }
    },

    queryOpenAI: async function(prompt, key) {
        // Platzhalter für OpenAI Fetch-Logik
        this.finalizeResponse("OpenAI Verbindung wird initialisiert... (API-Key Check)");
    },

    finalizeResponse: function(answer) {
        this.addToChat("Toni", answer);
        if(window.ToniTTS) ToniTTS.speak(answer, "warm");
    },

    addToChat: function(sender, msg) {
        const chatBox = document.getElementById('chat-messages');
        if(chatBox) {
            const div = document.createElement('div');
            div.style.marginBottom = "15px";
            div.innerHTML = `<b style="color:var(--neon-green)">${sender}:</b> <span style="color:#fff">${msg}</span>`;
            chatBox.appendChild(div);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    },

    handleError: function(err) {
        this.addToChat("System", err);
        if(window.ToniTTS) ToniTTS.speak("Da gibt es ein Verbindungsproblem, Coach.", "warm");
    }
};
