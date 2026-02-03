window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const name = localStorage.getItem('trainer_name');
        let msg = name ? `Beleza, ${name}! Dein Co-Trainer Toni ist bereit.` : "Ola! Ich bin Toni, dein Co-Trainer. Ich freue mich auf die Zusammenarbeit! Wie darf ich dich nennen, Coach?";
        this.addChatMessage("Toni", msg, "bot-msg");
        setTimeout(() => this.speak(msg), 1000);
    },

    async processCommand(text) {
        this.addChatMessage("Coach", text, "user-msg");
        const name = localStorage.getItem('trainer_name');
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');

        if (!name) {
            localStorage.setItem('trainer_name', text);
            const reply = `Hallo ${text}! Bevor wir zaubern: Leg als Erstes deinen Kader in der Sporttasche an (Aktentasche -> Sporttasche). Nur so kann ich die Jungs auf dem Board analysieren!`;
            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
            return;
        }

        this.addChatMessage("Toni", `⚡ Analysiere für ${name}...`, "bot-msg");

        try {
            const systemPrompt = `Du bist Toni, Co-Trainer von ${name}. Mischung aus Klopp und Nagelsmann. Antworte immer auf Deutsch.`;
            let apiUrl = "", body = {}, headers = {"Content-Type": "application/json"};

            if (provider === "llama") {
                apiUrl = 'http://127.0.0.1:11434/api/generate';
                body = { model: "gemma3:1b", prompt: `System: ${systemPrompt}\nUser: ${text}\nAntwort:`, stream: false };
            } else {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                headers["Authorization"] = `Bearer ${apiKey}`;
                body = { model: "gpt-4o-mini", messages: [{role: "system", content: systemPrompt}, {role: "user", content: text}] };
            }

            const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(body) });
            const data = await response.json();
            const reply = provider === "llama" ? data.response : data.choices[0].message.content;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
        } catch (e) {
            this.localFallback(`Coach ${name}, mein Gehirn braucht kurz Sauerstoff. Schau mal im System-Ordner nach dem Rechten!`);
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

    setupVoiceCommands() {
        const btn = document.getElementById('send-btn');
        const input = document.getElementById('chat-input');
        if (btn && input) {
            btn.onclick = () => { if(input.value.trim()){ this.processCommand(input.value); input.value=""; }};
            input.onkeypress = (e) => { if(e.key === 'Enter' && input.value.trim()){ this.processCommand(input.value); input.value=""; }};
        }
    }
};
