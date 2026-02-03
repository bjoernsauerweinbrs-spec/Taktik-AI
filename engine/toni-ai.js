window.ToniAI = {
    isListening: false,
    
    init() {
        console.log("Toni 2.0: KI-Schnittstelle aktiv.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const msg = "Ola Björn! Ich bin bereit. Hast du meinen Key im System-Ordner hinterlegt? Sobald der drin ist, kann ich für dich das Netz scannen!";
        this.addChatMessage("Toni", msg, "bot-msg");
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const input = text.toLowerCase();
        const apiKey = localStorage.getItem('toni_api_key');

        // FORMATIONEN (Immer lokal verfügbar)
        if (input.includes("formation") || input.includes("aufstellung")) {
            const type = input.includes("352") ? "352" : "433";
            const response = `Com certeza! Ich schiebe die Jungs ins ${type}. Schau auf das Board!`;
            this.addChatMessage("Toni", response, "bot-msg");
            window.BriefcaseUI.applyFormation(type);
            this.speak(response);
            return;
        }

        // WEB-RECHERCHE MIT API
        if (apiKey && apiKey.length > 10) {
            this.addChatMessage("Toni", "⚡ Ich verbinde mich mit dem Taktik-Netzwerk...", "bot-msg");
            
            try {
                // Wir nutzen hier den OpenAI-Standard (funktioniert auch mit vielen anderen KIs)
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini", // Kostengünstig und schnell
                        messages: [
                            { role: "system", content: "Du bist Toni, ein brasilianischer Fußball-Experte für Trainer Björn. Antworte kurz, fachlich und mit Ginga-Flair." },
                            { role: "user", content: text }
                        ]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "API-Fehler");
                }

                const data = await response.json();
                const aiReply = data.choices[0].message.content;
                this.addChatMessage("Toni", aiReply, "bot-msg");
                this.speak(aiReply);

            } catch (error) {
                console.error("Detaillierter Fehler:", error);
                let userError = "Björn, Verbindung zum Netz fehlgeschlagen.";
                if(error.message.includes("401")) userError = "Björn, der API-Key im System-Ordner scheint ungültig zu sein.";
                if(error.message.includes("429")) userError = "Björn, mein Kontingent im Netz ist erschöpft (Limit erreicht).";
                
                this.addChatMessage("Toni", userError, "bot-msg");
                this.speak(userError);
            }
        } else {
            const noKey = "Björn, ohne gültigen Key im System-Ordner kann ich nicht recherchieren. Ich nutze jetzt mein Basis-Wissen: Wir sollten offensiv agieren!";
            this.addChatMessage("Toni", noKey, "bot-msg");
            this.speak(noKey);
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
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.8;
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
