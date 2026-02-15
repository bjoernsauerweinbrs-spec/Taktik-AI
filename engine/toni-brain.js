window.ToniBrain = {
    isListening: false, recognition: null, synth: window.speechSynthesis, mentorVoice: null,

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
        if(this.synth.speaking) this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.voice = this.mentorVoice; ut.pitch = 0.85; ut.rate = 0.95;
        this.log(text, 'toni');
        this.synth.speak(ut);
    },

    log(text, sender) {
        const box = document.getElementById('chat-box');
        if(!box) return;
        const msg = document.createElement('div');
        msg.style.marginBottom = "20px"; msg.style.paddingLeft = "15px";
        msg.style.borderLeft = `2px solid ${sender==='toni'?'#39FF14':'#00D1FF'}`;
        msg.innerHTML = `<small style="color:${sender==='toni'?'#39FF14':'#00D1FF'}; font-family:'Orbitron'; font-size:0.55rem;">${sender==='toni'?'TONI':'COACH'}</small><br><span style="font-size:0.85rem;">${text}</span>`;
        box.appendChild(msg); box.scrollTop = box.scrollHeight;
    },

    toggleMic() {
        this.isListening = !this.isListening;
        const btn = document.getElementById('mic-trigger');
        const dot = document.getElementById('status-dot');
        if(this.isListening) {
            this.recognition.start(); btn.classList.add('active'); dot.style.background = "#FF3131";
        } else {
            this.recognition.stop(); btn.classList.remove('active'); dot.style.background = "#39FF14";
        }
    },

    processCommand(cmd) {
        this.log(cmd, 'user');
        const t = cmd.toLowerCase();

        if(t.includes("funino")) {
            window.PitchEngine.setMode('funino');
            this.speak("Spielfeld auf Funino umgestellt.");
        } else if(t.includes("großfeld")) {
            window.PitchEngine.setMode('grossfeld');
            this.speak("Großfeld aktiviert.");
        } else if(t.includes("setup") || t.includes("handy") || t.includes("verbinden")) {
            openSetup(); // In app.html definiert
            this.speak("Ich öffne das Setup-Zentrum für die Handy-Verbindung.");
        } else {
            this.speak("Habe ich verstanden. Was kann ich noch für dich tun?");
        }
    },

    firstGreeting() {
        this.init();
        document.getElementById('status-dot').classList.add('status-online');
        setTimeout(() => this.speak("Hallo, ich bin TONI 2.0, dein persönlicher Co-Trainer. Mit wem habe ich das Vergnügen?"), 1200);
    }
};
