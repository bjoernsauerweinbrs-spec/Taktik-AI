window.ToniAI = {
    init() {
        console.log("Toni 2.0: Persona Klopp/Nagelsmann aktiv.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const msg = "Ola Björn! Toni hier. Die Kette steht tief, das Pressing läuft. Ich habe das Web via Gemma 3 im Blick. Was ist der Plan für heute?";
        this.addChatMessage("Toni", msg, "bot-msg");
        // Nur sprechen, wenn der User die Seite bereits interagiert hat (Browser-Regel)
    },

    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        const provider = localStorage.getItem('toni_api_provider') || "free";
        const apiKey = localStorage.getItem('toni_api_key');

        if (provider === "free") {
            this.localFallback("Björn, im Basis-Modus: Wir müssen die Räume zwischen den Linien besser besetzen. Ginga-Style auf die Außen!");
            return;
        }

        this.addChatMessage("Toni", `⚡ Analysiere...`, "bot-msg");

        try {
            let apiUrl = "";
            let body = {};
            let headers = { "Content-Type": "application/json" };

            // PERSONA DEFINITION (Klopp/Nagelsmann Hybrid)
            const systemPrompt = "Du bist Toni, ein absoluter Fußball-Fachmann. Dein Stil ist eine Mischung aus Jürgen Klopp (motivierend, leidenschaftlich) und Julian Nagelsmann (extrem taktisch, präzise, Fokus auf Raumaufteilung). Du sprichst IMMER Deutsch. Nutze ab und zu brasilianische Begriffe wie 'Ginga' oder 'Beleza', aber bleibe ein taktisches Genie. Antworte Björn kurz und direkt.";

            if (provider === "openai") {
                apiUrl = 'https://api.openai.com/v1/chat/completions';
                headers["Authorization"] = `Bearer ${apiKey}`;
                body = { 
                    model: "gpt-4o-mini", 
                    messages: [{role: "system", content: systemPrompt}, {role: "user", content: text}] 
                };
            } 
            else if (provider === "llama") {
                apiUrl = 'http://127.0.0.1:11434/api/generate';
                body = { 
                    model: "gemma3:1b", 
                    prompt: `System: ${systemPrompt}\nUser: ${text}\nAntwort:`, 
                    stream: false 
                };
            }

            const response = await fetch(apiUrl, { method: 'POST', headers: headers, body: JSON.stringify(body) });
            if (!response.ok) throw new Error("OFFLINE");

            const data = await response.json();
            const reply = provider === "openai" ? data.choices[0].message.content : data.response;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);

        } catch (e) {
            this.addChatMessage("Toni", "Björn, kleine Funkstörung im Taktik-Netz. Prüf mal Ollama!", "bot-msg");
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

    // STIMME OPTIMIERUNG (Männlich, Pitch & Rate)
    speak(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Suche nach einer männlichen deutschen Stimme im System
        const voices = window.speechSynthesis.getVoices();
        const germanMale = voices.find(v => v.lang.includes('de') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('conrad') || v.name.toLowerCase().includes('stefan')));
        
        if (germanMale) utterance.voice = germanMale;
        
        utterance.lang = 'de-DE';
        utterance.pitch = 0.8; // Tieferer, männlicherer Klang (Klopp-Vibe)
        utterance.rate = 1.0;  // Normale Geschwindigkeit für Klarheit (Nagelsmann-Vibe)
        
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

// Stimmen laden (für Chrome wichtig)
window.speechSynthesis.onvoiceschanged = () => { window.ToniAI.init(); };
