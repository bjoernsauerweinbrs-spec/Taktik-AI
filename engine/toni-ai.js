window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const name = localStorage.getItem('trainer_name');
        let msg = name ? `Beleza, Coach ${name}! Ich habe die blauen Linien im Blick. Analyse bereit.` : "Ola! Ich bin Toni. Wie darf ich dich nennen, Coach?";
        this.addChatMessage("Toni", msg, "bot-msg");
        setTimeout(() => this.speak(msg), 1000);
    },

    async processCommand(text) {
        this.addChatMessage("Coach", text, "user-msg");
        const name = localStorage.getItem('trainer_name');
        const input = text.toLowerCase();

        // LOGIK: Gegner-Analyse Trigger
        if (input.includes("analyse") || input.includes("schwachstelle") || input.includes("lücke")) {
            const boardData = window.arena.getTacticalData();
            const analysisPrompt = `Analysiere diese Situation: Gegner hat ${boardData.opponentsCount} Spieler auf dem Feld. Die größte vertikale Lücke beträgt ${boardData.biggestDefensiveGap} Pixel. Gib eine kurze taktische Anweisung im Klopp-Stil.`;
            
            this.addChatMessage("Toni", "⚡ Scanne gegnerische Formation...", "bot-msg");
            this.callAI(analysisPrompt);
            return;
        }

        // Standard-KI Aufruf
        this.callAI(text);
    },

    async callAI(promptText) {
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');
        const name = localStorage.getItem('trainer_name');

        try {
            const system = `Du bist Toni, Co-Trainer von Coach ${name}. Mischung aus Klopp und Nagelsmann. Fachmännisch, leidenschaftlich, Deutsch.`;
            let apiUrl = provider === "llama" ? 'http://127.0.0.1:11434/api/generate' : 'https://api.openai.com/v1/chat/completions';
            
            const body = provider === "llama" 
                ? { model: "gemma3:1b", prompt: `System: ${system}\nUser: ${promptText}\nAntwort:`, stream: false }
                : { model: "gpt-4o-mini", messages: [{role:"system", content:system}, {role:"user", content:promptText}] };

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
            this.addChatMessage("Toni", "Coach, die Datenverbindung hakt. Aber ich sehe: Wir müssen die Halbräume aggressiver besetzen!", "bot-msg");
        }
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
