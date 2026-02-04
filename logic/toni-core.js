/**
 * TONI 2.0 - CORE ENGINE (PRO-TACTICAL EDITION)
 * Hybrid-Architektur: Ollama (Lokal/Gratis) & OpenAI (High-Intelligence)
 * Fokus: Beherrschung des Systems, Board-Steuerung & Dynamisches Routing.
 */
window.ToniCore = {
    isProcessing: false,
    
    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("ANALYSIERE...", "var(--accent-orange)");
        this.addUserMessage(text);

        const cmd = text.toLowerCase();

        // 1. SYSTEM-COMMANDS (Direkte Steuerung ohne KI-Umweg)
        if (cmd.includes("öffne") || cmd.includes("gehe zu")) {
            this.handleNavigation(cmd);
        }
        else if (cmd.includes("speichere") || cmd.includes("sichern")) {
            const name = text.split(/speichere|sichern/i)[1]?.trim() || "Unbenannte Übung";
            this.saveCurrentDrill(name);
        }
        // 2. TAKTIK-BEFEHLE (Sofort-Board-Aktion)
        else if (cmd.includes("viererkette") || cmd.includes("3-4-3")) {
            const type = cmd.includes("3-4-3") ? "3-4-3" : "viererkette";
            this.executeFormation(type, `Formiere ${type}.`);
        }
        // 3. BRAINSTORMING & ANALYSE (Hybrid-KI)
        else {
            await this.handleTacticalQuery(text);
        }

        this.isProcessing = false;
        this.updateStatus("SYSTEM BEREIT [PRO]", "var(--neon-green)");
    },

    /**
     * Hybrid-KI Logik: Entscheidet zwischen Lokal und Cloud
     */
    handleTacticalQuery: async function(text) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');
        
        // Kontext für die KI: Was passiert gerade auf dem Board?
        const boardState = this.getBoardContext();
        const prompt = `Kontext Board: ${boardState}. Nutzer-Anfrage: ${text}`;

        // Wenn der Text sehr komplex ist, erzwinge OpenAI (falls Key vorhanden)
        const isComplex = text.length > 100 || text.includes("analysiere") || text.includes("konzept");

        if (provider === "openai" && apiKey && isComplex) {
            await this.queryOpenAI(prompt, apiKey);
        } else {
            await this.queryOllama(prompt);
        }
    },

    /**
     * Erfasst den aktuellen Zustand des Spielfelds als Text-Kontext für die KI
     */
    getBoardContext: function() {
        if(!window.arena) return "Board nicht geladen";
        const players = window.arena.players.length;
        const objects = window.arena.trainingObjects.length;
        return `${players} Spieler und ${objects} Objekte auf dem Feld. Modus: ${window.arena.pitchMode}.`;
    },

    /**
     * Beherrscht die Navigation: Toni wechselt die Sektoren
     */
    handleNavigation: function(cmd) {
        if(!window.BriefcaseUI) return;
        let target = "";
        if(cmd.includes("kabine") || cmd.includes("sporttasche")) target = "sport";
        if(cmd.includes("training")) target = "training";
        if(cmd.includes("labor") || cmd.includes("analyse")) target = "analyse";
        if(cmd.includes("heft") || cmd.includes("zeitung")) target = "templates";
        if(cmd.includes("setup") || cmd.includes("system")) target = "system";

        if(target) {
            if(!window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
            window.BriefcaseUI.switchSektor(target);
            this.finalizeResponse(`Ich habe den Bereich ${target.toUpperCase()} für dich geöffnet, Coach.`);
        }
    },

    queryOllama: async function(prompt) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                body: JSON.stringify({
                    model: 'gemma',
                    prompt: `Du bist Toni, int. Fußball-Experte. Antworte kurz und präzise: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            this.finalizeResponse(data.response);
        } catch (e) {
            this.handleError("Ollama offline. Nutze Standard-Logik.");
        }
    },

    queryOpenAI: async function(prompt, key) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // Kostengünstig & extrem intelligent
                    messages: [
                        {role: "system", content: "Du bist Toni, ein A-Lizenz Fußball-Analyst. Du beherrschst das Board."},
                        {role: "user", content: prompt}
                    ]
                })
            });
            const data = await response.json();
            this.finalizeResponse(data.choices[0].message.content);
        } catch (e) {
            this.handleError("OpenAI API Fehler. Bitte Key prüfen.");
        }
    },

    // --- Bestehende Hilfsfunktionen (Optimiert) ---

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
        this.finalizeResponse(`Übung "${name}" ist in der Trainingsmappe gesichert.`);
    },

    executeFormation: function(key, responseText) {
        // ... (Bestehende Logik)
        const formations = {
            "viererkette": [{pos: "TW", x: 0.1, y: 0.5}, {pos: "LV", x: 0.25, y: 0.2}, {pos: "IV", x: 0.25, y: 0.4}, {pos: "IV", x: 0.25, y: 0.6}, {pos: "RV", x: 0.25, y: 0.8}],
            "3-4-3": [{pos: "TW", x: 0.1, y: 0.5}, {pos: "IV", x: 0.25, y: 0.3}, {pos: "IV", x: 0.25, y: 0.5}, {pos: "IV", x: 0.25, y: 0.7}, {pos: "LM", x: 0.45, y: 0.2}, {pos: "ZM", x: 0.45, y: 0.4}, {pos: "ZM", x: 0.45, y: 0.6}, {pos: "RM", x: 0.45, y: 0.8}, {pos: "ST", x: 0.7, y: 0.2}, {pos: "ST", x: 0.7, y: 0.5}, {pos: "ST", x: 0.7, y: 0.8}]
        };
        if(window.arena) {
            window.arena.applyTacticalPositions(formations[key]);
            this.finalizeResponse(responseText);
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
