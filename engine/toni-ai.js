window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const name = localStorage.getItem('trainer_name');
        let msg = name ? `Beleza, Coach ${name}! Spielfeld ist markiert, Tore und 5-Meter-Raum stehen. Was ist der Plan?` : "Ola! Ich bin Toni. Wie darf ich dich nennen, Coach?";
        this.addChatMessage("Toni", msg, "bot-msg");
        setTimeout(() => this.speak(msg), 1000);
    },

    async processCommand(text) {
        this.addChatMessage("Coach", text, "user-msg");
        const name = localStorage.getItem('trainer_name');
        const apiKey = localStorage.getItem('toni_api_key');
        if (!name) {
            localStorage.setItem('trainer_name', text);
            this.addChatMessage("Toni", `Alles klar, Coach ${text}! Leg unseren Kader in der Sporttasche an.`, "bot-msg");
            return;
        }
        const input = text.toLowerCase();
        if (input.includes("pressing") || input.includes("verschieben")) {
            window.arena.applyTacticalPattern('pressing');
            return;
        }
        try {
            const provider = localStorage.getItem('toni_api_provider') || "llama";
            let apiUrl = provider === "llama" ? 'http://127.0.0.1:11434/api/generate' : 'https://api.openai.com/v1/chat/completions';
            const system = `Du bist Toni, Co-Trainer von Coach ${name}. Experte für Taktik (Klopp/Nagelsmann Hybrid). Antworte kurz, präzise und auf Deutsch.`;
            const body = provider === "llama" 
                ? { model: "gemma3:1b", prompt: `System: ${system}\nUser: ${text}\nAntwort:`, stream: false }
                : { model: "gpt-4o-mini", messages: [{role:"system", content:system}, {role:"user", content:text}] };

            const response = await fetch(apiUrl, { method: 'POST', headers: {"Content-Type": "application/json", "Authorization": `Bearer ${apiKey}`}, body: JSON.stringify(body) });
            const data = await response.json();
            const reply = provider === "llama" ? data.response : data.choices[0].message.content;
            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
        } catch (e) {
            this.localFallback(`Coach, meine Verbindung zu Gemma 3 klemmt gerade.`);
        }
    },

    localFallback(msg) { this.addChatMessage("Toni", msg, "bot-msg"); this.speak(msg); },

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
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE'; u.pitch = 0.9;
        window.speechSynthesis.speak(u);
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
