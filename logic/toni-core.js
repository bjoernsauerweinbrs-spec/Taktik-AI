/**
 * TONI 2.0 - CORE ENGINE (ULTIMATE STABILITY EDITION)
 * Fixes CORS issues and ensures Ollama communication from GitHub Pages.
 */
window.ToniCore = {
    isProcessing: false,
    
    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. SYSTEM-COMMANDS
        if (cmd.includes("öffne") || cmd.includes("gehe zu")) {
            this.handleNavigation(cmd);
        }
        else if (cmd.includes("speichere") || cmd.includes("sichern")) {
            const name = text.split(/speichere|sichern/i)[1]?.trim() || "Unbenannte Übung";
            this.saveCurrentDrill(name);
        }
        else if (cmd.includes("viererkette") || cmd.includes("3-4-3")) {
            const type = cmd.includes("3-4-3") ? "3-4-3" : "viererkette";
            this.executeFormation(type, `Formiere ${type}.`);
        }
        // 2. KI-BRAINSTORMING
        else {
            await this.handleTacticalQuery(text);
        }

        this.isProcessing = false;
        this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
    },

    handleTacticalQuery: async function(text) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');
        const boardState = this.getBoardContext();
        const prompt = `Kontext: ${boardState}. Frage: ${text}`;

        if (provider === "openai" && apiKey) {
            await this.queryOpenAI(prompt, apiKey);
        } else {
            await this.queryOllama(prompt);
        }
    },

    getBoardContext: function() {
        if(!window.arena) return "Board nicht bereit";
        return `${window.arena.players.length} Spieler aktiv.`;
    },

    /**
     * OLLAMA ABFRAGE MIT ROBUSTER FEHLERBEHANDLUNG
     */
    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                // Wir entfernen spezielle Header, die CORS-Fehler provozieren könnten
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: `Antworte als Fußball-Experte Toni kurz auf Deutsch: ${prompt}`,
                    stream: false
                })
            });

            if (!response.ok) throw new Error("CORS oder Server Fehler");

            const data = await response.json();
            
            // Schutz vor undefined: Wir prüfen alle Pfade
            let answer = data.response || (data.message ? data.message.content : null) || "";
            
            if (!answer) {
                answer = "Analyse abgeschlossen, aber das Gehirn lieferte keine Daten. Prüfe die Modell-Installation.";
            }

            this.finalizeResponse(answer);

        } catch (e) {
            console.error("Connection Error:", e);
            this.handleError("VERBINDUNG BLOCKIERT: Bitte starte Ollama neu mit: 'set OLLAMA_ORIGINS=* && ollama serve' (im CMD Fenster).");
        }
    },

    queryOpenAI: async function(prompt, key) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{role: "system", content: "Du bist Toni, int. Taktik-Experte."}, {role: "user", content: prompt}]
                })
            });
            const data = await response.json();
            this.finalizeResponse(data.choices[0].message.content);
        } catch (e) {
            this.handleError("OpenAI API Fehler.");
        }
    },

    handleNavigation: function(cmd) {
        if(!window.BriefcaseUI) return;
        const targets = { "kabine": "sport", "training": "training", "labor": "analyse", "heft": "templates", "setup": "system" };
        for (let key in targets) {
            if (cmd.includes(key)) {
                if(!window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
                window.BriefcaseUI.switchSektor(targets[key]);
                this.finalizeResponse(`Öffne Sektor ${key.toUpperCase()}.`);
                return;
            }
        }
    },

    saveCurrentDrill: function(name) {
        if(!window.arena) return;
        const drillData = {
            name: name,
            date: new Date().toLocaleString(),
            players: window.arena.players.map(p => ({id: p.id, x: p.x, y: p.y, team: p.team})),
            objects: window.arena.trainingObjects.map(o => ({type: o.type, x: o.x, y: o.y}))
        };
        let archive = JSON.parse(localStorage.getItem('toni_drills')) || [];
        archive.push(drillData);
        localStorage.setItem('toni_drills', JSON.stringify(archive));
        this.finalizeResponse(`Übung "${name}" gespeichert.`);
    },

    executeFormation: function(key, res) {
        const formations = {
            "viererkette": [{pos: "TW", x: 0.1, y: 0.5}, {pos: "LV", x: 0.25, y: 0.2}, {pos: "IV", x: 0.25, y: 0.4}, {pos: "IV", x: 0.25, y: 0.6}, {pos: "RV", x: 0.25, y: 0.8}],
            "3-4-3": [{pos: "TW", x: 0.1, y: 0.5}, {pos: "IV", x: 0.25, y: 0.3}, {pos: "IV", x: 0.25, y: 0.5}, {pos: "IV", x: 0.25, y: 0.7}, {pos: "LM", x: 0.45, y: 0.2}, {pos: "ZM", x: 0.45, y: 0.4}, {pos: "ZM", x: 0.45, y: 0.6}, {pos: "RM", x: 0.45, y: 0.8}, {pos: "ST", x: 0.7, y: 0.2}, {pos: "ST", x: 0.7, y: 0.5}, {pos: "ST", x: 0.7, y: 0.8}]
        };
        if(window.arena) {
            window.arena.applyTacticalPositions(formations[key]);
            this.finalizeResponse(res);
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
        this.updateStatus("FEHLER", "red");
    },

    startVoice: function() {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!Recognition) return;
        const rec = new Recognition();
        rec.lang = 'de-DE';
        rec.onstart = () => this.updateStatus("TONI HÖRT ZU...", "var(--accent-orange)");
        rec.onresult = (e) => this.processMessage(e.results[0][0].transcript);
        rec.onend = () => this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
        rec.start();
    }
};
