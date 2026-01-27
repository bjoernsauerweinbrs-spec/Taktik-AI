/**
 * Toni 2.0 - Chat & AI Engine
 * Steuert die Kommunikation mit den KIs und die Live-Synchronisation
 */

const ToniChat = {
    isMuted: false,
    synth: window.speechSynthesis,

    // --- SYSTEM PROMPT (Die DNA von Toni) ---
    getSystemPrompt: function() {
        const trainer = localStorage.getItem('toni_trainer_name') || 'Coach';
        const mode = document.querySelector('.mode-selector .active')?.innerText || 'Training';

        return `Du bist Toni, der hochprofessionelle Co-Trainer. 
        Dein Schöpfer und Manager ist Björn. Der Nutzer vor dir ist der Trainer (${trainer}).
        Dein Stil: Brasilianische Technik-Expertise kombiniert mit globaler Elite-Taktik (UEFA Pro Standard).
        Deine Aufgabe: Erstelle Trainings (4 Phasen: Aktivierung, Technik, Taktik, Spiel) oder Spielanalysen.
        Aktueller Modus: ${mode}.
        
        WICHTIG: Wenn du Spieler bewegst, antworte im Text normal, aber hänge am Ende JEDER Anweisung für Bewegungen dieses Format an: 
        MOVE:ID:X:Y (Beispiel: MOVE:13:50:70 für Spieler 13 auf Position 50% Breite, 70% Höhe).
        Bewege die ROTEN Spieler. Das BLAUE Team ist der Gegner.`;
    },

    // --- API CALL ROUTER ---
    sendMessage: async function() {
        const inputField = document.getElementById('user-input');
        const message = inputField.value.trim();
        if (!message) return;

        this.appendMessage('user', message);
        inputField.value = '';

        const model = localStorage.getItem('toni_active_model');
        const apiKey = localStorage.getItem('toni_key_' + model);

        try {
            let responseText = "";
            if (model === 'gemini') {
                responseText = await this.callGemini(apiKey, message);
            } else if (model === 'openai') {
                responseText = await this.callOpenAI(apiKey, message);
            } else if (model === 'groq') {
                responseText = await this.callGroq(apiKey, message);
            }

            this.processToniResponse(responseText);
        } catch (error) {
            this.appendMessage('ai', "Manager, wir haben ein Funkloch zur KI. Key prüfen!");
            console.error(error);
        }
    },

    // --- GEMINI INTEGRATION ---
    callGemini: async function(key, prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: this.getSystemPrompt() + "\n\nAnfrage: " + prompt }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    },

    // --- RESPONSE PROCESSING (Voice & Move) ---
    processToniResponse: function(text) {
        // 1. Bewegungs-Befehle filtern (z.B. MOVE:13:50:70)
        const moveRegex = /MOVE:(\w+):(\d+):(\d+)/g;
        let cleanText = text.replace(moveRegex, '').trim();

        // 2. Text im Chat anzeigen
        this.appendMessage('ai', cleanText);

        // 3. Sprachausgabe (Männlich, Brasilianischer Vibe wird durch Text erzeugt)
        if (!this.isMuted) {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.lang = 'de-DE';
            utterance.rate = 0.9; // Etwas langsamer für mehr Autorität
            this.synth.speak(utterance);
        }

        // 4. Board-Animationen auslösen
        let match;
        while ((match = moveRegex.exec(text)) !== null) {
            const [_, id, x, y] = match;
            this.animatePlayer(id, x, y);
        }
    },

    animatePlayer: function(id, xPercent, yPercent) {
        const chip = document.getElementById(`chip-${id}`);
        if (chip) {
            const pitch = document.getElementById('pitch');
            const targetX = (pitch.offsetWidth * xPercent) / 100;
            const targetY = (pitch.offsetHeight * yPercent) / 100;
            
            chip.style.transition = "all 1.5s ease-in-out";
            chip.style.left = targetX + "px";
            chip.style.top = targetY + "px";
        }
    },

    appendMessage: function(role, text) {
        const history = document.getElementById('chat-history');
        const msgDiv = document.createElement('div');
        msgDiv.className = role === 'ai' ? 'ai-msg' : 'user-msg';
        msgDiv.style.marginBottom = "10px";
        msgDiv.style.padding = "10px";
        msgDiv.style.borderRadius = "8px";
        msgDiv.style.background = role === 'ai' ? "#1e293b" : "#334155";
        msgDiv.innerText = text;
        history.appendChild(msgDiv);
        history.scrollTop = history.scrollHeight;
    }
};

// Globaler Trigger für app.html
function sendMessage() { ToniChat.sendMessage(); }
function toggleMute() { 
    ToniChat.isMuted = !ToniChat.isMuted;
    document.getElementById('mute-btn').innerHTML = ToniChat.isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}
