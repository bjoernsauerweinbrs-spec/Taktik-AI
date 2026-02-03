window.ToniAI = {
    isListening: false,
    
    init() {
        console.log("Toni 2.0: KI-Schnittstelle aktiv. Warte auf Björns Befehle.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const msg = "Ola Björn! Toni 2.0 ist einsatzbereit. Ich habe das Web im Blick. Was möchtest du heute analysieren oder welche Formation soll ich einstellen?";
        this.addChatMessage("Toni", msg, "bot-msg");
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const input = text.toLowerCase();
        const apiKey = localStorage.getItem('toni_api_key');

        // 1. Taktik-Befehle (Lokal ohne API)
        if (input.includes("formation") || input.includes("aufstellung")) {
            const type = input.includes("352") ? "352" : "433";
            const response = `Com certeza! Ich schiebe die Jungs ins ${type}. Schau auf das Board, Björn!`;
            this.addChatMessage("Toni", response, "bot-msg");
            window.BriefcaseUI.applyFormation(type);
            this.speak(response);
            return;
        }

        // 2. Web-Recherche (Mit API-Key)
        if (apiKey && apiKey.trim() !== "") {
            this.addChatMessage("Toni", "⚡ Recherchiere Live-Web-Daten... Analysiere Taktik-Trends...", "bot-msg");
            
            try {
                // Beispiel-Anbindung an ein LLM (Standard-Endpoint)
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-4o", 
                        messages: [
                            { 
                                role: "system", 
                                content: "Du bist Toni, ein brasilianischer Fußball-Taktik-Experte. Du arbeitest für Trainer Björn. Antworte präzise, fachlich fundiert, mit Fokus auf Technik und Ginga-Style. Du hast Zugriff auf das Internet 2026." 
                            },
                            { role: "user", content: text }
                        ]
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices[0]) {
                    const aiReply = data.choices[0].message.content;
                    this.addChatMessage("Toni", aiReply, "bot-msg");
                    this.speak(aiReply);
                } else {
                    throw new Error("API Antwort fehlerhaft");
                }

            } catch (error) {
                console.error("KI-Fehler:", error);
                const errorMsg = "Björn, ich habe Probleme mit der Internetverbindung. Prüfe bitte deinen API-Key in der Zentrale.";
                this.addChatMessage("Toni", errorMsg, "bot-msg");
                this.speak(errorMsg);
            }
        } 
        // 3. Fallback (Kein API-Key)
        else {
            const fallback = "Björn, für eine echte Web-Analyse brauche ich meinen API-Key in den Einstellungen. Aber mein Gefühl sagt: Wir müssen heute über die Flügel zaubern!";
            this.addChatMessage("Toni", fallback, "bot-msg");
            this.speak(fallback);
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
        // Stoppt laufende Sprachausgabe
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.85; // Männlicherer, tieferer Klang
        utterance.rate = 1.0;
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
        console.log("Mikrofon Status:", this.isListening);
    },

    setupVoiceCommands() {
        const btn = document.getElementById('send-btn');
        const input = document.getElementById('chat-input');
        
        if (btn && input) {
            btn.onclick = () => {
                const val = input.value.trim();
                if (val !== "") {
                    this.processCommand(val);
                    input.value = "";
                }
            };
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    const val = input.value.trim();
                    if (val !== "") {
                        this.processCommand(val);
                        input.value = "";
                    }
                }
            };
        }
    }
};
