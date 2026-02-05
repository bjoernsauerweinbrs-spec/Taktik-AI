/**
 * TONI 2.0 - ACTION BRAIN ENGINE
 * Erlaubt der KI, Spieler auf dem Board aktiv zu verschieben.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. SYSTEM-NAVIGATION (Sofort-Befehle)
        if (cmd.includes("öffne") || cmd.includes("gehe zu")) {
            this.handleNavigation(cmd);
            this.finishProcess();
            return;
        }

        // 2. HYBRID-INTELLIGENZ MIT ACTION-PARSER
        await this.handleHybridAction(text);
    },

    handleHybridAction: async function(text) {
        const boardContext = this.getBoardContext();
        // Wir weisen Toni an, bei taktischen Änderungen ein spezielles JSON-Format zu nutzen
        const systemInstruction = `
            Du bist Toni. Wenn du die Formation ändern willst, füge am Ende deiner Antwort 
            EXAKT dieses Format an: [MOVE: {"pos": "compact"}] oder [MOVE: {"pos": "wide"}].
            Kontext: ${boardContext}`;

        let aiResponse = null;
        let provider = "Ollama";

        try {
            aiResponse = await this.queryOllama(text, systemInstruction);
            if (!aiResponse || aiResponse.length < 15) {
                provider = "OpenAI";
                aiResponse = await this.queryOpenAI(text, systemInstruction);
            }
        } catch (e) {
            aiResponse = await this.queryOpenAI(text, systemInstruction);
        }

        this.parseAndExecuteActions(aiResponse);
        this.finalizeResponse(aiResponse, provider);
        this.finishProcess();
    },

    /**
     * Scannt die Antwort nach [MOVE: ...] Befehlen
     */
    parseAndExecuteActions: function(text) {
        const moveRegex = /\[MOVE:\s*({.*?})\]/;
        const match = text.match(moveRegex);

        if (match && window.arena) {
            try {
                const actionData = JSON.parse(match[1]);
                console.log("Toni führt Aktion aus:", actionData);
                
                if (actionData.pos === "compact") {
                    // Beispiel: Zieht das Team im Zentrum zusammen
                    window.arena.applyTacticalPositions([
                        {x: 0.1, y: 0.5}, {x: 0.3, y: 0.4}, {x: 0.3, y: 0.6}, 
                        {x: 0.5, y: 0.45}, {x: 0.5, y: 0.55}
                    ]);
                } else if (actionData.pos === "wide") {
                    // Beispiel: Zieht das Team in die Breite
                    window.arena.applyTacticalPositions([
                        {x: 0.1, y: 0.5}, {x: 0.3, y: 0.2}, {x: 0.3, y: 0.8}, 
                        {x: 0.5, y: 0.1}, {x: 0.5, y: 0.9}
                    ]);
                }
            } catch (e) {
                console.error("Fehler beim Parsen der Toni-Aktion", e);
            }
        }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const starters = squad.filter(p => p.isStarter).map(p => p.name);
        return `Startelf: ${starters.join(", ")}. Spielfeld-Modus: ${window.arena?.pitchMode || 'pro'}.`;
    },

    // ... Bestehende queryOllama, queryOpenAI, finalizeResponse etc. beibehalten
    // Wichtig: In den API-Calls muss die systemInstruction mitgeschickt werden!
};
