window.ToniAI = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,

    init() {
        console.log("Toni AI initialisiert...");
        this.setupRecognition();
        
        // Event Listener für das Eingabefeld
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        
        if(input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleUserMessage(input.value);
            });
        }
        if(sendBtn) {
            sendBtn.onclick = () => this.handleUserMessage(input.value);
        }
    },

    setupRecognition() {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn("Spracherkennung wird nicht unterstützt.");
            return;
        }
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'de-DE';

        this.recognition.onresult = (event) => {
            const text = event.results[0][0].transcript;
            this.handleUserMessage(text);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            document.getElementById('mic-icon').style.color = '';
            document.getElementById('voice-indicator').classList.remove('active');
        };
    },

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.isListening = true;
            this.recognition.start();
            document.getElementById('mic-icon').style.color = '#FF3B30';
            document.getElementById('voice-indicator').classList.add('active');
        }
    },

    handleUserMessage(text) {
        if (!text.trim()) return;
        
        // User Nachricht im Chat anzeigen
        this.addMessageToChat('user', text);
        document.getElementById('chat-input').value = '';

        // Toni's Logik (Brazilian Style & Fachwissen)
        setTimeout(() => {
            const response = this.generateResponse(text);
            this.addMessageToChat('bot', response);
            this.speak(response);
            this.updateAnalysisPanel(response);
        }, 600);
    },

    addMessageToChat(role, text) {
        const container = document.getElementById('chat-messages');
        const msg = document.createElement('p');
        msg.className = role === 'user' ? 'user-msg' : 'bot-msg';
        msg.innerText = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    },

    generateResponse(input) {
        const query = input.toLowerCase();
        if (query.includes('taktik') || query.includes('aufstellung')) {
            return "Björn, die taktische Ausrichtung sollte den 'Ginga'-Spirit widerspiegeln. Wir lassen die Außenverteidiger hoch schieben.";
        }
        if (query.includes('training') || query.includes('übung')) {
            return "Ich habe die besten Übungen für Ballkontrolle unter Druck analysiert. Wir sollten heute Fokus auf das Kurzpassspiel legen.";
        }
        if (query.includes('hallo') || query.includes('hi')) {
            return "Hallo Björn. Ich bin bereit für die Analyse. Was steht heute an?";
        }
        return "Verstanden. Ich prüfe die Daten im Internet und passe unsere Strategie im Brazilian Style an.";
    },

    updateAnalysisPanel(text) {
        const panel = document.getElementById('setcard-content');
        panel.innerHTML = `
            <div class="toni-speech-bubble">
                <b>LIVE-ANALYSE:</b><br>${text}
            </div>
        `;
    },

    speak(text) {
        if (!this.synth) return;
        this.synth.cancel(); // Aktuelle Ausgabe stoppen
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        
        // Männliche Stimme suchen
        const voices = this.synth.getVoices();
        const maleVoice = voices.find(v => v.name.includes('Google Deutsch') || v.name.includes('Stefan') || v.name.includes('Yannick'));
        
        if (maleVoice) utterance.voice = maleVoice;
        utterance.pitch = 0.9; // Etwas tiefer für männlichen Klang
        utterance.rate = 1.0;
        
        this.synth.speak(utterance);
    }
};

// Start der Engine
window.onload = () => {
    if(window.ToniAI) window.ToniAI.init();
};
