window.ToniAI = {
    // --- INITIALISIERUNG ---
    init: function() {
        console.log("Toni AI wird initialisiert...");
        this.setupVoiceCommands();
        
        // Stimmen im Browser-Cache vorwärmen
        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices();
            if (speechSynthesis.onvoiceschanged !== undefined) {
                speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
            }
        }
    },

    // --- SPRACHAUSGABE (MÄNNLICH) ---
    speak: function(text) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'de-DE';

        const voices = window.speechSynthesis.getVoices();
        // Gezielte Suche nach männlichen Stimmen (Stefan oder Google Deutsch Male)
        const maleVoice = voices.find(v => 
            v.name.includes('Stefan') || 
            v.name.includes('Google Deutsch') || 
            (v.name.includes('Male') && v.lang.startsWith('de'))
        ) || voices[0];

        if (maleVoice) u.voice = maleVoice;
        
        u.pitch = 0.85; // Tieferer Pitch für maskulinen Experten-Klang
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
    },

    // --- BEFEHLSVERARBEITUNG ---
    processCommand: async function(text) {
        const apiKey = localStorage.getItem('toni_api_key');
        const provider = localStorage.getItem('toni_api_provider') || "llama";

        if (!text.trim()) return;
        this.addChatMessage("Coach", text, "user-msg");

        try {
            let apiUrl = provider === "llama" ? 'http://127.0.0.1:11434/api/generate' : 'https://api.openai.com/v1/chat/completions';
            const systemPrompt = "Du bist Toni, ein brasilianischer Fußball-Taktik-Experte. Antworte kurz, professionell und motivierend.";

            let body = provider === "llama" 
                ? { model: "gemma3:1b", prompt: `System: ${systemPrompt}\nUser: ${text}\nAntwort:`, stream: false }
                : { model: "gpt-4o-mini", messages: [{role:"system", content:systemPrompt}, {role:"user", content:text}] };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": provider === "openai" ? `Bearer ${apiKey}` : ""
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            const reply = provider === "llama" ? data.response : data.choices[0].message.content;

            this.addChatMessage("Toni", reply, "bot-msg");
            this.speak(reply);

        } catch (error) {
            console.error("KI-Fehler:", error);
            const errorMsg = "Coach, die Verbindung hakt. Läuft Ollama im Hintergrund?";
            this.addChatMessage("Toni", errorMsg, "bot-msg");
            this.speak(errorMsg);
        }
    },

    // --- CHAT UI ---
    addChatMessage: function(sender, text, type) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${type}`; // Stellt sicher, dass CSS Klassen greifen
        msgDiv.innerHTML = `<b>${sender}:</b><br>${text}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    // --- EVENT LISTENERS ---
    setupVoiceCommands: function() {
        const btn = document.getElementById('send-btn');
        const input = document.getElementById('chat-input');
        
        if (btn && input) {
            btn.onclick = () => {
                const val = input.value;
                input.value = "";
                this.processCommand(val);
            };
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    const val = input.value;
                    input.value = "";
                    this.processCommand(val);
                }
            };
        }
    }
};
