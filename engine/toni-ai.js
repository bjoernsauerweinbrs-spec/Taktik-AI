window.ToniAI = {
    init() {
        console.log("Toni 2.0: KI-Schnittstelle aktiv.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const provider = localStorage.getItem('toni_api_provider') || "Basis";
        this.addChatMessage("Toni", `Ola Björn! Verbindung steht. Modus: ${provider.toUpperCase()} (Gemma 3).`, "bot-msg");
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const provider = localStorage.getItem('toni_api_provider') || "free";
        const apiKey = localStorage.getItem('toni_api_key');

        if (provider === "free") {
            this.localFallback("Björn, Basis-Modus: Fokus auf das Flügelspiel!");
            return;
        }

        this.addChatMessage("Toni", `⚡ Recherche via ${provider.toUpperCase()}...`, "bot-msg");

        try {
            let apiUrl = "";
            let body = {};
            let headers = { "Content-Type": "application/json" };

            if (provider === "openai") {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                headers["Authorization"] = `Bearer ${apiKey}`;
                body = { 
                    model: "gpt-4o-mini", 
                    messages: [{role: "system", content: "Du bist Toni, Taktik-Experte."}, {role: "user", content: text}] 
                };
            } 
            else if (provider === "llama") {
                // Lokale Verbindung zum MacBook Ollama Server
                apiUrl = 'http://127.0.0.1:11434/api/generate';
                body = { 
                    model: "gemma3:1b", // EXAKT ANGEPASST AN DEIN BILD
                    prompt: `Antworte als brasilianischer Fußball-Experte Toni kurz auf deutsch: ${text}`, 
                    stream: false 
                };
            }

            const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(body) });
            
            if (response.status === 404) {
                throw new Error("MODEL_NOT_FOUND");
            }
            if (!response.ok) throw new Error("OFFLINE");

            const data = await response.json();
            const reply = provider === "openai" ? data.choices[0].message.content : data.response;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);

        } catch (e) {
            console.error("Detail-Fehler:", e);
            let msg = "Björn, Verbindung fehlgeschlagen.";
            if (e.message === "MODEL_NOT_FOUND") {
                msg = "Björn, Fehler 404: Das Modell gemma3:1b wurde nicht gefunden. Prüfe den Namen in der Ollama App!";
            } else if (provider === "llama") {
                msg = "Björn, ist OLLAMA_ORIGINS='*' am Mac gesetzt? Starte Ollama danach einmal neu.";
            }
            this.addChatMessage("Toni", msg, "bot-msg");
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
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
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
