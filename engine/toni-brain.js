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
        if(this.synth.speaking) this.synth.cancel();
        const ut = new SpeechSynthesisUtterance(text);
        ut.voice = this.mentorVoice;
        ut.pitch = 0.85; ut.rate = 0.95;
        this.log(text, 'toni');
        this.synth.speak(ut);
    },

    log(text, sender) {
        const box = document.getElementById('chat-box');
        if(!box) return;
        const msg = document.createElement('div');
        msg.style.marginBottom = "20px";
        msg.style.paddingLeft = "15px";
        msg.style.borderLeft = `2px solid ${sender==='toni'?'#39FF14':'#00D1FF'}`;
        msg.innerHTML = `<small style="color:${sender==='toni'?'#39FF14':'#00D1FF'}; font-family:'Orbitron'; font-size:0.55rem; letter-spacing:1px;">${sender==='toni'?'TONI':'COACH'}</small><br><span style="font-size:0.85rem; color:#ccc;">${text}</span>`;
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;
    },

    toggleMic() {
        this.isListening = !this.isListening;
        const btn = document.getElementById('mic-trigger');
        const status = document.getElementById('mic-status');
        const dot = document.getElementById('status-dot');
        
        if(this.isListening) {
            this.recognition.start();
            btn.classList.add('active');
            status.innerHTML = "LISTENING...";
            status.style.color = "#39FF14";
            dot.style.background = "#FF3131";
        } else {
            this.recognition.stop();
            btn.classList.remove('active');
            status.innerHTML = "VOICE OFF";
            status.style.color = "#444";
            dot.style.background = "#39FF14";
        }
    },

    processCommand(cmd) {
        this.log(cmd, 'user');
        const t = cmd.toLowerCase();

        if(t.includes("funino") || t.includes("g-jugend")) {
            window.PitchEngine.setMode('funino');
            document.getElementById('pitch-info').innerHTML = "FUNINO G-JUGEND";
            this.speak("Ich habe das Spielfeld auf Funino umgestellt. Vier Tore sind aktiv.");
        } else if(t.includes("großfeld") || t.includes("senioren")) {
            window.PitchEngine.setMode('grossfeld');
            document.getElementById('pitch-info').innerHTML = "GROSSFELD SENIOREN";
            this.speak("Großfeld aktiviert. Die Arena ist bereit für die Senioren.");
        } else if(t.includes("internet") || t.includes("online")) {
            this.speak("Für den vollen Cloud-Zugriff müssen wir das Setup im Menü abschließen. Dort erkläre ich dir alles.");
        } else {
            this.speak("Habe ich verstanden. Soll ich ein spezielles Modul für dich öffnen?");
        }
    },

    firstGreeting() {
        this.init();
        document.getElementById('status-dot').classList.add('status-online');
        setTimeout(() => {
            this.speak("Hallo, ich bin TONI 2.0, dein persönlicher Co-Trainer. Mit wem habe ich das Vergnügen?");
        }, 1200);
    }
};
