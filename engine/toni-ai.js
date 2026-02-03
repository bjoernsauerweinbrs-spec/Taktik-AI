window.ToniAI = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,

    init() {
        this.setupMic();
        const input = document.getElementById('chat-input');
        if(input) {
            input.addEventListener('keypress', (e) => { if(e.key === 'Enter') this.process(input.value); });
        }
        document.getElementById('send-btn').onclick = () => this.process(input.value);
    },

    setupMic() {
        if (!('webkitSpeechRecognition' in window)) return;
        this.recognition = new webkitSpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.onresult = (e) => { this.process(e.results[0][0].transcript); };
        this.recognition.onend = () => { this.isListening = false; document.getElementById('voice-indicator').classList.remove('active'); };
    },

    toggleListening() {
        if(this.isListening) { this.recognition.stop(); }
        else { this.isListening = true; this.recognition.start(); document.getElementById('voice-indicator').classList.add('active'); }
    },

    process(txt) {
        if(!txt) return;
        this.addChat('user', txt);
        document.getElementById('chat-input').value = '';
        
        let resp = "Björn, ich analysiere das im Brazilian Style. Wir sollten den Fokus auf Technik legen.";
        if(txt.toLowerCase().includes('hallo')) resp = "Hallo Björn! Wie kann ich dich heute beim Training unterstützen?";
        
        setTimeout(() => {
            this.addChat('bot', resp);
            this.speak(resp);
        }, 500);
    },

    addChat(role, txt) {
        const c = document.getElementById('chat-messages');
        const m = document.createElement('p');
        m.className = role === 'user' ? 'user-msg' : 'bot-msg';
        m.innerText = txt;
        c.appendChild(m);
        c.scrollTop = c.scrollHeight;
    },

    speak(txt) {
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(txt);
        u.lang = 'de-DE';
        const voices = this.synth.getVoices();
        const male = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Yannick'));
        if(male) u.voice = male;
        u.pitch = 0.9;
        this.synth.speak(u);
    }
};
