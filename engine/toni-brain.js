window.ToniBrain = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,
    mentorVoice: null,

    init() {
        const setVoice = () => {
            const voices = this.synth.getVoices();
            this.mentorVoice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Google')) || voices[0];
        };
        if (this.synth.onvoiceschanged !== undefined) this.synth.onvoiceschanged = setVoice;
        setVoice();

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => this.processCommand(e.results[0][0].transcript);
            this.recognition.onend = () => { if(this.isListening) this.recognition.start(); };
        }
    },

    speak(text) {
        const ut = new SpeechSynthesisUtterance(text);
        ut.voice = this.mentorVoice;
        ut.pitch = 0.85; ut.rate = 0.95;
        this.log(text, 'toni');
        this.synth.speak(ut);
    },

    log(text, sender) {
        const box = document.getElementById('chat-box');
        const msg = document.createElement('div');
        msg.style.marginBottom = "15px";
        msg.style.borderLeft = sender === 'toni' ? "2px solid #39FF14" : "2px solid #00D1FF";
        msg.style.paddingLeft = "10px";
        msg.innerHTML = `<small style="color:${sender==='toni'?'#39FF14':'#00D1FF'}; font-family:'Orbitron'; font-size:0.6rem;">${sender==='toni'?'TONI':'COACH'}</small><br>${text}`;
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;
    },

    toggleMic() {
        this.isListening = !this.isListening;
        const btn = document.getElementById('main-mic');
        const dot = document.getElementById('status-dot');
        if(this.isListening) {
            this.recognition.start();
            btn.classList.add('active');
            dot.style.background = "#FF3131";
        } else {
            this.recognition.stop();
            btn.classList.remove('active');
            dot.style.background = "#39FF14";
        }
    },

    processCommand(cmd) {
        const t = cmd.toLowerCase();
        this.log(cmd, 'user');
        if(t.includes("funino") || t.includes("g-jugend")) {
            window.PitchEngine.setMode('funino');
            this.speak("Ich habe das Spielfeld auf Funino umgestellt.");
        } else if(t.includes("großfeld")) {
            window.PitchEngine.setMode('grossfeld');
            this.speak("Großfeld aktiviert.");
        } else {
            this.speak("Das habe ich verstanden. Soll ich eine Funktion in der Aktentasche öffnen?");
        }
    },

    firstGreeting() {
        this.init();
        document.getElementById('status-dot').classList.add('status-online');
        setTimeout(() => this.speak("Hallo, ich bin TONI 2.0, dein persönlicher Co-Trainer. Mit wem habe ich das Vergnügen?"), 1000);
    }
};
