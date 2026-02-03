window.ToniAI = {
    init() {
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    // Die professionelle Begrüßung laut Protokoll
    welcomeMessage() {
        const name = localStorage.getItem('trainer_name');
        let msg = "";

        if (!name) {
            msg = "Ola! Ich bin Toni, dein neuer Co-Trainer. Ich freue mich sehr auf die Zusammenarbeit und darauf, gemeinsam mit dir die taktische Marschroute zu entwickeln. Bevor wir loslegen: Wie darf ich dich ansprechen, Coach?";
        } else {
            msg = `Beleza, Coach ${name}! Ich bin bereit. Die Jungs warten auf deine Anweisungen. Womit starten wir die Analyse?`;
        }

        this.addChatMessage("Toni", msg, "bot-msg");
        setTimeout(() => this.speak(msg), 1000);
    },

    async processCommand(text) {
        this.addChatMessage("Coach", text, "user-msg");
        const name = localStorage.getItem('trainer_name');
        const provider = localStorage.getItem('toni_api_provider') || "llama";
        const apiKey = localStorage.getItem('toni_api_key');

        // Erst-Kontakt Logik: Name lernen und zur Sporttasche führen
        if (!name) {
            localStorage.setItem('trainer_name', text);
            const reply = `Hallo Coach ${text}! Freut mich sehr. Da wir heute das erste Mal zusammen am Taktikboard stehen, ist der erste wichtige Schritt, unseren Kader zu erfassen. Bitte geh in die Aktentasche und öffne die Sporttasche, um die Spieler anzulegen. Nur so kann ich eine fundierte Analyse erstellen. Hast du dazu Fragen?`;
            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);
            return;
        }

        // Standard-Antwort, falls die KI-Verbindung noch hakt (Kein "Was geht ab" mehr!)
        const fallbackMsg = `Coach ${name}, ich habe gerade eine Störung in der Datenleitung zu Gemma 3. Aber fachlich ist klar: Wir müssen als Erstes die Liste in der Sporttasche vervollständigen, damit das Board mit Leben gefüllt wird. Schau bitte kurz im System-Ordner nach dem Rechten.`;

        this.addChatMessage("Toni", `⚡ Analysiere für Coach ${name}...`, "bot-msg");

        try {
            const systemPrompt = `Du bist Toni, Co-Trainer von Coach ${name}. Dein Stil ist eine Mischung aus Jürgen Klopp (leidenschaftlich, motivierend) und Julian Nagelsmann (taktisch brillant, präzise). Du sprichst IMMER Deutsch. Deine oberste Priorität ist die Professionalität. Du weist den Trainer freundlich darauf hin, dass die Sporttasche (Kaderpflege) das wichtigste Werkzeug ist. Antworte fachlich fundiert und kurz.`;

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

            if (!reply) throw new Error("Empty response");

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);

        } catch (e) {
            this.localFallback(fallbackMsg);
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
        
        // Männliche Stimme erzwingen
        const voices = window.speechSynthesis.getVoices();
        const proVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Stefan') || v.name.includes('Conrad') || v.name.includes('Male')));
        if (proVoice) utterance.voice = proVoice;

        utterance.pitch = 0.85; // Tieferer Grundton
        utterance.rate = 0.95;  // Leicht langsamer für mehr Autorität
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
