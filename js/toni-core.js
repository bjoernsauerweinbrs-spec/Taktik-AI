/**
 * TONI 2.0 - INTERNATIONAL TACTICAL CORE (PRO-EDITION 2026)
 * Das Gehirn des Performance Centers. Steuert Board-Logik, 
 * Sprach-Interface und KI-Analysen (Ollama/OpenAI).
 */
window.ToniCore = {
    isProcessing: false,
    recognition: null,

    /**
     * Haupt-Verarbeitung der Eingabe (Sprache oder Text)
     */
    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;

        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const input = text.toLowerCase();

        // 1. TAKTISCHE SOFORT-BEFEHLE (Lokale Board-Steuerung ohne KI-Latenz)
        if (input.includes("viererkette") || input.includes("4er kette")) {
            this.executeBoardAction(() => {
                // Koordinaten für eine klassische Viererkette (0.0 - 1.0)
                const coords = [
                    {pos: "TW", x: 0.1, y: 0.5},
                    {pos: "LV", x: 0.25, y: 0.15}, {pos: "IV", x: 0.25, y: 0.38}, 
                    {pos: "IV", x: 0.25, y: 0.62}, {pos: "RV", x: 0.25, y: 0.85}
                ];
                window.arena.applyTacticalPositions(coords);
                this.finalizeResponse("Ich formiere die Viererkette. Achte auf die Abstände in der horizontalen Verschiebung.");
            });
        } 
        else if (input.includes("schieb") && (input.includes("vor") || input.includes("hoch"))) {
            this.executeBoardAction(() => {
                window.arena.shiftTeam('forward');
                this.finalizeResponse("Das Team rückt auf. Wir forcieren das Gegenpressing nach internationalem Elite-Standard.");
            });
        }
        else if (input.includes("reset") || input.includes("anfang")) {
            this.executeBoardAction(() => {
                window.arena.resetBoard();
                this.finalizeResponse("Spielfeld zurückgesetzt. Ball liegt am Anstoßpunkt.");
            });
        }

        // 2. ONBOARDING-CHECK
        else if (this.detectOnboarding(input)) {
            await this.handleOnboarding(text);
        } 

        // 3. KOMPLEXE TAKTIK-ANFRAGE (KI-Modul)
        else {
            await this.handleTacticalQuery(text);
        }

        this.isProcessing = false;
        this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
    },

    /**
     * Führt Board-Aktionen sicher aus
     */
    executeBoardAction: function(callback) {
        if (window.arena && typeof window.arena.render === 'function') {
            callback();
        } else {
            this.finalizeResponse("Board-Engine noch nicht bereit. Bitte Spielfeld laden.");
        }
    },

    detectOnboarding: function(text) {
        const keywords = ["verein", "club", "liga", "name", "heiße", "trainer"];
        return keywords.some(key => text.includes(key)) && text.length < 150;
    },

    handleOnboarding: async function(text) {
        const currentConfig = JSON.parse(localStorage.getItem('toni_club_config')) || {};
        const config = {
            name: currentConfig.name || "Dein Verein",
            coach: "Björn", // Dein Name ist gesetzt
            league: currentConfig.league || "Elite-League"
        };
        localStorage.setItem('toni_club_config', JSON.stringify(config));
        this.finalizeResponse(`System auf ${config.name} konfiguriert. Willkommen zurück, Coach Björn. Analyse-Einheit aktiv.`);
    },

    handleTacticalQuery: async function(text) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');

        if (provider === "llama") {
            await this.queryOllama(text);
        } else {
            this.queryOpenAI(text, apiKey);
        }
    },

    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma', // Empfohlen für Taktik-Präzision
                    prompt: `Context: Du bist TONI, ein weltweiter Elite-Fußballanalyst. Björn ist der Coach. 
                             Das Feld hat ein 5m Raster. Wir nutzen 11 Starter und 5 Subs. 
                             Frage: ${prompt}. Antworte fachmännisch, kurz und präzise.`,
                    stream: false
                })
            });

            if (!response.ok) throw new Error("API Offline");
            const data = await response.json();
            
            // FIX für "undefined": Sicherstellen, dass data.response existiert
            const answer = data.response || data.message || "Analyse abgeschlossen, aber Daten-Cluster unvollständig.";
            this.finalizeResponse(answer);

        } catch (e) {
            console.error("TONI Core Error:", e);
            this.handleError("Verbindung zum KI-Kern (Ollama) fehlgeschlagen. Läuft der Server auf Port 11434?");
        }
    },

    queryOpenAI: function(prompt, key) {
        this.finalizeResponse("OpenAI Cloud-Analyse wird initialisiert. (Feature-Release 2026)");
    },

    finalizeResponse: function(answer) {
        this.addToChat("Toni [PRO]", answer);
        if(window.ToniTTS) ToniTTS.speak(answer, "warm");
    },

    addUserMessage: function(text) {
        this.addToChat("Coach Björn", text, true);
    },

    addToChat: function(sender, msg, isUser = false) {
        const chatBox = document.getElementById('chat-messages');
        if(!chatBox) return;

        const div = document.createElement('div');
        div.style.cssText = `margin-bottom:15px; animation: fadeIn 0.3s; text-align: ${isUser ? 'right' : 'left'}`;
        div.innerHTML = `
            <b style="color:${isUser ? 'var(--text-dim)' : 'var(--neon-green)'}">${sender}:</b> 
            <span style="color:#fff; display:block; background:${isUser ? 'rgba(255,255,255,0.05)' : 'transparent'}; padding:5px; border-radius:5px;">
                ${msg}
            </span>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    updateStatus: function(text, color) {
        const statusText = document.getElementById('toni-status-text');
        if(statusText) {
            statusText.innerText = text;
            statusText.style.color = color;
        }
    },

    handleError: function(err) {
        this.addToChat("SYSTEM", err);
        if(window.ToniTTS) ToniTTS.speak("Coach, wir haben ein Daten-Leck. Verbindung prüfen.", "warm");
    },

    /**
     * TONI LIVE: Spracherkennung aktivieren
     */
    startVoice: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return this.handleError("Browser unterstützt kein Voice-Interface.");

        if (!this.recognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => this.updateStatus("TONI HÖRT ZU...", "var(--accent-orange)");
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processMessage(transcript);
            };
            this.recognition.onerror = (e) => this.updateStatus("SYSTEM FEHLER", "var(--status-error)");
            this.recognition.onend = () => this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
        }

        try {
            this.recognition.start();
        } catch (e) {
            console.log("Recognition bereits aktiv.");
        }
    }
};
