window.ToniAI = {
    init() {
        console.log("Toni 2.0 Gehirn initialisiert.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const provider = localStorage.getItem('toni_api_provider') || "Basis";
        this.addChatMessage("Toni", `Ola Björn! Modus ${provider.toUpperCase()} ist bereit. Was recherchieren wir heute?`, "bot-msg");
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const provider = localStorage.getItem('toni_api_provider') || "free";
        const apiKey = localStorage.getItem('toni_api_key');
        const input = text.toLowerCase();

        // Lokale Taktik-Befehle (Ohne KI)
        if (input.includes("formation") || input.includes("aufstellung")) {
            const type = input.includes("352") ? "352" : "433";
            const res = `Tudo bem! Ich stelle auf ${type} um. Schau auf das Feld!`;
            this.addChatMessage("Toni", res, "bot-msg");
            window.BriefcaseUI.applyFormation(type);
            this.speak(res);
            return;
        }

        // KI-Recherche
        if (provider === "free" || (!apiKey && provider !== "llama" && provider !== "free")) {
            this.localFallback("Björn, im Basis-Modus ohne Key empfehle ich: Kompakt stehen und Flügelspiel forcieren!");
            return;
        }

        this.addChatMessage("Toni", `⚡ Recherche via ${provider.toUpperCase()}...`, "bot-msg");

        try {
            let apiUrl = "";
            let headers = { "Content-Type": "application/json" };
            let body = {};

            if (provider === "openai") {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                headers["Authorization"] = `Bearer ${apiKey}`;
                body = {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Du bist Toni, ein brasilianischer Fußball-Experte für Trainer Björn. Antworte kurz, präzise und mit Ginga-Flair." },
                        { role: "user", content: text }
                    ]
                };
            } 
            else if (provider === "gemini") {
                apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
                body = { contents: [{ parts: [{ text: `Du bist Fußball-Experte Toni. Antworte Björn auf: ${text}` }] }] };
            }
            else if (provider === "llama") {
                apiUrl = 'http://localhost:11434/api/generate';
                body = {
                    model: "llama3",
                    prompt: `Antworte als Fußball-Experte Toni kurz und knackig: ${text}`,
                    stream: false
                };
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                if(response.status === 429) throw new Error("LIMIT_REACHED");
                throw new Error("SERVER_OFFLINE");
            }

            const data = await response.json();
            let reply = "";
            
            if (provider === "openai") reply = data.choices[0].message.content;
            else if (provider === "gemini") reply = data.candidates[0].content.parts[0].text;
            else if (provider === "llama") reply = data.response;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);

        } catch (error) {
            let errorMsg = "Björn, Verbindung zum Anbieter fehlgeschlagen.";
            if(error.message === "LIMIT_REACHED") errorMsg = "Björn, das Guthaben/Limit dieses Anbieters ist leer.";
            if(provider === "llama") errorMsg = "Björn, Llama (Ollama) ist offline. Bitte starte das Programm auf deinem Rechner!";
            
            this.addChatMessage("Toni", errorMsg, "bot-msg");
            this.speak(errorMsg);
        }
    },

    localFallback(msg) {
        this.addChatMessage("Toni", msg, "bot-msg");
        this.speak(msg);
    },

    addChatMessage(sender, text, type) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = type;
        msgDiv.innerHTML = `<b>${sender}:</b><br>${text}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.85;
        window.speechSynthesis.speak(utterance);
    },

    toggleListening() {
        this.isListening = !this.isListening;
        const micIcon = document.getElementById('mic-icon');
        if (micIcon) {
            micIcon.style.color = this.isListening ? "#FF3B30" : "";
            if(this.isListening) micIcon.classList.add('pulse');
            else micIcon.classList.remove('pulse');
        }
    },

    setupVoiceCommands() {
        const btn = document.getElementById('send-btn');
        const input = document.getElementById('chat-input');
        if (btn && input) {
            btn.onclick = () => { if(input.value.trim()){ this.processCommand(input.value); input.value=""; }};
            input.onkeypress = (e) => { if(e.key === 'Enter' && input.value.trim()){ this.processCommand(input.value); input.value=""; }};
        }
    }
};
