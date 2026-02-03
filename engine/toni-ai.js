window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        this.addChatMessage("Toni", "Ola Björn! Falls Ollama am Mac noch hakt, schau in die Hilfe im System-Ordner.", "bot-msg");
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const provider = localStorage.getItem('toni_api_provider') || "free";
        const apiKey = localStorage.getItem('toni_api_key');

        if (provider === "free") {
            this.localFallback("Björn, Basis-Modus aktiv: Flügelspiel ist heute der Schlüssel!");
            return;
        }

        this.addChatMessage("Toni", `⚡ Verbindung zu ${provider.toUpperCase()}...`, "bot-msg");

        try {
            let apiUrl = "";
            let body = {};
            let headers = { "Content-Type": "application/json" };

            if (provider === "openai") {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                headers["Authorization"] = `Bearer ${apiKey}`;
                body = { model: "gpt-4o-mini", messages: [{role: "system", content: "Taktik-Experte Toni."}, {role: "user", content: text}] };
            } else if (provider === "llama") {
                apiUrl = 'http://127.0.0.1:11434/api/generate';
                body = { model: "llama3", prompt: `Toni antwortet: ${text}`, stream: false };
            }

            const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(body) });
            if (!response.ok) throw new Error("OFFLINE");

            const data = await response.json();
            const reply = provider === "openai" ? data.choices[0].message.content : data.response;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
        } catch (e) {
            this.addChatMessage("Toni", "Björn, Verbindung fehlgeschlagen. Prüfe die Hilfe im System-Ordner!", "bot-msg");
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
