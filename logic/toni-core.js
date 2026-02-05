/**
 * TONI 2.0 - ACTION BRAIN ENGINE (HYBRID & PRO)
 * Steuert die KI-Logik, den Silent-Fallback und die Board-Aktionen.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. SYSTEM-NAVIGATION (Direkt-Befehle)
        if (cmd.includes("öffne") || cmd.includes("gehe zu") || cmd.includes("zeige")) {
            this.handleNavigation(cmd);
            this.finishProcess();
            return;
        }

        // 2. HYBRID-INTELLIGENZ MIT ACTION-PARSER
        await this.handleHybridAction(text);
    },

    handleHybridAction: async function(text) {
        const boardContext = this.getBoardContext();
        
        // System-Instruktion: Zwingt die KI zur Einhaltung des Befehls-Formats
        const systemInstruction = `
            Du bist Toni, ein brasilianischer Taktik-Experte. Antworte kurz und fachlich.
            Wenn du die Formation ändern willst, füge am Ende deiner Antwort 
            EXAKT dieses Format an: [MOVE: {"pos": "compact"}] oder [MOVE: {"pos": "wide"}] oder [MOVE: {"pos": "pressing"}].
            Kontext: ${boardContext}`;

        let aiResponse = null;
        let provider = "Ollama";

        try {
            // Erstversuch: Lokal via Ollama
            aiResponse = await this.queryOllama(text, systemInstruction);
            
            // Qualitäts-Check: Wenn Ollama scheitert oder zu kurz antwortet -> Silent Upgrade
            if (!aiResponse || aiResponse.length < 15) {
                console.log("ToniCore: Silent Upgrade auf OpenAI...");
                provider = "OpenAI";
                aiResponse = await this.queryOpenAI(text, systemInstruction);
            }
        } catch (e) {
            provider = "OpenAI (Fallback)";
            aiResponse = await this.queryOpenAI(text, systemInstruction);
        }

        // Action-Befehle ausführen
        this.parseAndExecuteActions(aiResponse);
        
        // Den technischen Teil [MOVE: ...] für die UI entfernen
        const cleanDisplayResponse = aiResponse.replace(/\[MOVE:.*?\]/g, "").trim();
        
        this.finalizeResponse(cleanDisplayResponse, provider);
        this.finishProcess();
    },

    parseAndExecuteActions: function(text) {
        const moveRegex = /\[MOVE:\s*({.*?})\]/;
        const match = text.match(moveRegex);

        if (match && window.arena) {
            try {
                const actionData = JSON.parse(match[1]);
                console.log("Toni Action Trigger:", actionData.pos);
                
                // Aufruf der Arena-Formationen
                if (window.arena.applyTacticalFormation) {
                    window.arena.applyTacticalFormation(actionData.pos);
                } else {
                    // Fallback für einfache Verschiebungen
                    this.fallbackMove(actionData.pos);
                }
            } catch (e) {
                console.error("Fehler beim Parsen der Toni-Aktion", e);
            }
        }
    },

    fallbackMove: function(pos) {
        if (pos === "compact") {
            window.arena.applyTacticalPositions([{x: 0.1, y: 0.5}, {x: 0.3, y: 0.4}, {x: 0.3, y: 0.6}, {x: 0.5, y: 0.45}, {x: 0.5, y: 0.55}]);
        } else if (pos === "wide") {
            window.arena.applyTacticalPositions([{x: 0.1, y: 0.5}, {x: 0.3, y: 0.2}, {x: 0.3, y: 0.8}, {x: 0.5, y: 0.1}, {x: 0.5, y: 0.9}]);
        }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const starters = squad.filter(p => p.isStarter).map(p => p.name);
        return `Startelf: ${starters.join(", ")}. Pitch: ${window.arena?.pitchMode || 'pro'}.`;
    },

    handleNavigation: function(cmd) {
        if (!window.BriefcaseUI) return;
        if (cmd.includes("kabine") || cmd.includes("sporttasche")) SektorSporttasche.render();
        if (cmd.includes("training")) SektorTraining.render();
        if (cmd.includes("analyse")) SektorAnalyse.render();
        if (cmd.includes("system")) SektorSystem.render();
        if (cmd.includes("heft") || cmd.includes("magazin")) SektorTemplates.render();
        
        if (!document.getElementById('briefcase-overlay').classList.contains('active')) {
            window.BriefcaseUI.toggle();
        }
    },

    async queryOllama(prompt, system) {
        try {
            const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                body: JSON.stringify({
                    model: 'gemma', // Oder dein MacBook-Modell
                    prompt: `${system}\n\nCoach: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            return data.response;
        } catch (e) { return null; }
    },

    async queryOpenAI(prompt, system) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return "Toni: Bitte hinterlege einen API-Key für komplexe Analysen.";
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [{role: "system", content: system}, {role: "user", content: prompt}]
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (e) { return "Toni: Experten-Server nicht erreichbar."; }
    },

    addUserMessage: function(text) {
        const container = document.getElementById('chat-messages');
        if(!container) return;
        container.innerHTML += `<div style="margin-bottom:10px; color:var(--text-dim)"><b>Björn:</b> ${text}</div>`;
        container.scrollTop = container.scrollHeight;
    },

    finalizeResponse: function(answer, provider) {
        const container = document.getElementById('chat-messages');
        if(!container) return;
        container.innerHTML += `<div style="margin-bottom:15px; color:#fff; border-left: 2px solid var(--neon-green); padding-left:10px;"><b>Toni:</b> ${answer}</div>`;
        container.scrollTop = container.scrollHeight;
        if(window.ToniTTS) window.ToniTTS.speak(answer, "warm");
        console.log(`Response via ${provider}`);
    },

    updateStatus: function(text, color) {
        const el = document.getElementById('toni-status-text');
        if(el) { el.innerText = text; el.style.color = color; }
    },

    finishProcess: function() {
        this.isProcessing = false;
        setTimeout(() => this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)"), 2000);
    }
};
