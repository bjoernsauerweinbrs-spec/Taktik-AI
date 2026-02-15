window.ToniBrain = {
    isListening: false, recognition: null, synth: window.speechSynthesis,
    init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.onresult = (e) => this.process(e.results[0][0].transcript);
            this.recognition.onend = () => { if(this.isListening) this.recognition.start(); };
        }
    },
    speak(t) {
        const u = new SpeechSynthesisUtterance(t); u.lang = 'de-DE'; u.pitch = 0.8;
        this.log(t, 'toni'); this.synth.speak(u);
    },
    log(t, s) {
        const b = document.getElementById('chat-box');
        const m = document.createElement('div');
        m.style.marginBottom = "15px";
        m.style.borderLeft = s === 'toni' ? "2px solid #39FF14" : "2px solid #00D1FF";
        m.style.paddingLeft = "10px";
        m.innerHTML = `<small style="color:${s==='toni'?'#39FF14':'#00D1FF'}; font-family:'Orbitron'; font-size:0.6rem;">${s==='toni'?'TONI':'COACH'}</small><br>${t}`;
        b.appendChild(m); b.scrollTop = b.scrollHeight;
    },
    toggleMic() {
        this.isListening = !this.isListening;
        const btn = document.getElementById('mic-trigger');
        if(this.isListening) { this.recognition.start(); btn.classList.add('active'); }
        else { this.recognition.stop(); btn.classList.remove('active'); }
    },
    process(cmd) { this.log(cmd, 'user'); this.speak("Verstanden: " + cmd); },
    firstGreeting() { this.init(); setTimeout(() => this.speak("Hallo Coach, TONI 2.0 ist online."), 1000); }
};
