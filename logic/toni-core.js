/**
 * TONI 2.0 - ACTION BRAIN ENGINE (HYBRID & PRO)
 * Optimiert für MacBook (Ollama) & Cloud (OpenAI) mit automatischer Navigation.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. SYSTEM-NAVIGATION (Direkt-Befehle für Björn)
        if (cmd.includes("öffne") || cmd.includes("gehe zu") || cmd.includes("zeige")) {
            console.log("ToniCore: Navigations-Befehl erkannt.");
            this.handleNavigation(cmd);
            this.finishProcess();
            return;
        }

        // 2. HYBRID-INTELLIGENZ MIT ACTION-PARSER
        await this.handleHybridAction(text);
    },

    handleHybridAction: async function(text) {
        const boardContext = this.getBoardContext();
        
        const systemInstruction = `
            Du bist Toni, ein brasilianischer Taktik-Experte. Antworte kurz, fachlich und mit Stil.
            Wichtig: Wenn du die Formation ändern willst, füge am Ende deiner Antwort 
            EXAKT dieses Format an: [MOVE: {"pos": "compact"}] oder [MOVE: {"pos": "wide"}] oder [MOVE: {"pos": "pressing"}].
            Kontext: ${boardContext}`;

        let aiResponse = null;
        let provider = "Ollama";

        try {
            // Schritt A: Lokal via Ollama (MacBook Power)
            aiResponse = await this.queryOllama(text, systemInstruction);
            
            // Schritt B: Qualitäts-Check & Silent Upgrade
            if (!aiResponse || aiResponse.length < 10 || aiResponse.includes("error")) {
                console.log("ToniCore: Silent Upgrade auf OpenAI (HQ)...");
                provider = "OpenAI";
                aiResponse = await this.queryOpenAI(text, systemInstruction);
            }
        } catch (e) {
            provider = "OpenAI (Fallback)";
            aiResponse = await this.queryOpenAI(text, systemInstruction);
        }

        // Taktische Befehle parsen & Board steuern
        this.parseAndExecuteActions(aiResponse);
        
        // Technischen Code aus der Sprechblase entfernen
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
                
                if (window.arena.applyTacticalFormation) {
                    window.arena.applyTacticalFormation(actionData.pos);
                } else {
                    this.fallbackMove(actionData.pos);
                }
            } catch (e) {
                console.error("Action-Parsing fehlgeschlagen", e);
            }
        }
    },

    fallbackMove: function(pos) {
        if (!window.arena) return;
        if (pos === "compact") {
            window.arena.applyTacticalPositions([{x: 0.15, y: 0.5}, {x: 0.35, y: 0.4}, {x: 0.35, y: 0.6}, {x: 0.5, y: 0.45}, {x: 0.5, y: 0.55}]);
        } else if (pos === "wide") {
            window.arena.applyTacticalPositions([{x: 0.15, y: 0.5}, {x: 0.35, y: 0.15}, {x: 0.35, y: 0.85}, {x: 0.5, y: 0.1}, {x: 0.5, y: 0.9}]);
        }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const starters = squad.filter(p => p.isStarter).map(p => p.name);
        return `Startelf: ${starters.join(", ")}. Pitch: ${window.arena?.pitchMode || 'pro'}.`;
    },

    handleNavigation: function(cmd) {
        if (!window.BriefcaseUI) return;
        
        // Sektor-Wechsel Logik
        if (cmd.includes("kabine") || cmd.includes("sporttasche") || cmd.includes("mannschaft")) SektorSporttasche.render();
        else if (cmd.includes("training")) SektorTraining.render();
        else if (cmd.includes("analyse")) SektorAnalyse.render();
        else if (cmd.includes("system") || cmd.includes("einstellung")) SektorSystem.render();
        else if (cmd.includes("heft") || cmd.includes("plan")) SektorTemplates.render();
        
        // Öffne die Aktentasche, falls sie zu ist
        const overlay = document.getElementById('briefcase-overlay');
        if (overlay && !overlay.classList.contains('active')) {
            window.BriefcaseUI.toggle();
        }
        
        if(window.ToniTTS) ToniTTS.speak("Sofort, Coach. Ich öffne den Bereich.", "warm");
    },

    async queryOllama(prompt, system) {
        try {
            // Wichtig: Timeout eingebaut, falls Ollama nicht läuft
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 3000); 

            const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                signal: controller.signal,
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: `${system}\n\nCoach: ${prompt}`,
                    stream: false
                })
            });
            clearTimeout(id);
            const data = await response.json();
            return data.response;
        } catch (e) { return null; }
    },

    async queryOpenAI(prompt, system) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return "Toni: Coach, bitte hinterlege den OpenAI Key im System-Sektor.";
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
        } catch (e) { return "Toni: Der Experten-Server ist aktuell nicht erreichbar."; }
    },

    addUserMessage: function(text) {
        const container = document.getElementById('chat-messages');
        if(!container) return;
        container.innerHTML += `<div style="margin-bottom:10px; color:var(--text-dim); font-size: 0.85rem;"><b>Björn:</b> ${text}</div>`;
        container.scrollTop = container.scrollHeight;
    },

    finalizeResponse: function(answer, provider) {
        const container = document.getElementById('chat-messages');
        if(!container) return;
        container.innerHTML += `<div style="margin-bottom:15px; color:#fff; border-left: 2px solid var(--neon-green); padding-left:10px; font-size: 0.9rem;"><b>Toni:</b> ${answer}</div>`;
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
