window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const name = localStorage.getItem('trainer_name');
        let msg = name ? `Beleza, Coach ${name}! Ich bin bereit. Wo setzen wir heute taktisch an?` 
                       : "Ola! Ich bin Toni, dein Co-Trainer. Ich freue mich auf die Zusammenarbeit! Wie darf ich dich ansprechen, Coach?";
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
            const reply = `Hallo Coach ${text}! Erster Schritt: Leg unseren Kader in der Sporttasche an (Aktentasche), damit ich die Jungs auf das Board schieben kann!`;
            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
            return;
        }

        const input = text.toLowerCase();
        // Spezial-Logik für Taktik-Verschiebung
        if (input.includes("verschieben") || input.includes("taktik") || input.includes("ginga")) {
            this.addChatMessage("Toni", "Coach, ich optimiere die Abstände. Wir schieben die Kette jetzt höher ins Pressing!", "bot-msg");
            if (window.arena && window.arena.players.length > 0) {
                window.arena.players.forEach((p, i) => {
                    window.arena.glideTo(p.id, 250 + (i*15), 100 + (i*40)); // Beispiel-Verschiebung
                });
            }
            return;
        }

        this.addChatMessage("Toni", `⚡ Analysiere für Coach ${name}...`, "bot-msg");

        try {
            const systemPrompt = `Du bist Toni, Co-Trainer von Coach ${name}. Dein Stil ist eine Mischung aus Klopp und Nagelsmann. Antworte immer auf Deutsch, fachmännisch und motivierend.`;
            let apiUrl = "", body = {};

            if (provider === "llama") {
                apiUrl = 'http://127.0.0.1:11434/api/generate';
                body = { model: "gemma3:1b", prompt: `System: ${systemPrompt}\nUser: ${text}\nAntwort:`, stream: false };
            } else {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                body = { model: "gpt-4o-mini", messages: [{role:"system", content:systemPrompt}, {role:"user", content:text}] };
            }

            const response = await fetch(apiUrl, { 
                method: 'POST', 
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${apiKey}`}, 
                body: JSON.stringify(body) 
            });
            const data = await response.json();
            const reply = provider === "llama" ? data.response : data.choices[0].message.content;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
        } catch (e) {
            this.localFallback(`Coach ${name}, ich habe gerade eine Funkstörung zu Gemma 3. Aber fachlich gilt: Die Sporttasche muss gepflegt sein!`);
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
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE'; u.pitch = 0.85;
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
