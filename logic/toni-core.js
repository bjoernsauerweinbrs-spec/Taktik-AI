/**
 * TONI 2.0 - HYBRID BRAIN ENGINE (PRO-LEVEL)
 * Manages local Ollama power with invisible OpenAI Fallback.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. Direkt-Befehle (Sofort-Ausführung ohne KI)
        if (cmd.includes("öffne") || cmd.includes("gehe zu")) {
            this.handleNavigation(cmd);
            this.finishProcess();
            return;
        }

        // 2. Taktische Anfrage (Hybrid-KI Logik)
        await this.handleHybridIntelligence(text);
    },

    handleHybridIntelligence: async function(text) {
        const boardContext = this.getBoardContext();
        const prompt = `Kontext: ${boardContext}. Frage: ${text}`;
        
        let aiResponse = null;
        let usedProvider = "Ollama (Local)";

        try {
            // SCHRITT 1: Versuch mit Ollama (Schnell & Lokal)
            aiResponse = await this.queryOllama(prompt);

            // SCHRITT 2: Qualitäts-Check
            // Wenn Ollama keine Antwort liefert oder die Antwort zu kurz/generisch ist
            if (!aiResponse || aiResponse.length < 15 || aiResponse.includes("Fehler")) {
                console.log("Toni: Lokale Intelligenz reicht nicht aus. Starte Silent Upgrade...");
                usedProvider = "OpenAI (Cloud)";
                aiResponse = await this.queryOpenAI(prompt);
            }
        } catch (err) {
            // SCHRITT 3: Notfall-Fallback (Falls Ollama komplett crashed)
            aiResponse = await this.queryOpenAI(prompt);
        }

        this.finalizeResponse(aiResponse, usedProvider);
        this.finishProcess();
    },

    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                    model: 'gemma', // Oder dein installiertes Modell
                    prompt: `Antworte als internationaler Taktik-Experte Toni kurz auf Deutsch: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            return data.response;
        } catch (e) { return null; }
    },

    queryOpenAI: async function(prompt) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return "Toni: Ich benötige ein Upgrade (API-Key), um diese komplexe Taktik-Frage zu beantworten.";

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o", // Höchste Qualitätsstufe für Profis
                    messages: [
                        {role: "system", content: "Du bist Toni, ein brasilianischer Taktik-Experte mit Weltklasse-Niveau. Du analysierst Spielsituationen präzise, nutzt Fachbegriffe und hilfst Coach Björn."},
                        {role: "user", content: prompt}
                    ]
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (e) { return "Verbindung zum Experten-Server unterbrochen."; }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const starters = squad.filter(p => p.isStarter).map(p => `${p.name} (#${p.number})`);
        return `Kader aktiv: ${starters.join(", ")}. Trainer: Björn.`;
    },

    finalizeResponse: function(answer, provider) {
        console.log(`Antwort generiert via: ${provider}`);
        this.addToChat("Toni", answer);
        if(window.ToniTTS) ToniTTS.speak(answer, "warm");
    },

    finishProcess: function() {
        this.isProcessing = false;
        this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
    },

    // ... (Hier folgen deine bestehenden Hilfs-Funktionen wie addUserMessage, addToChat, updateStatus, handleNavigation)
};
