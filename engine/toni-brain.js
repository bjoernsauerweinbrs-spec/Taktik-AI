window.ToniBrain = {
    isListening: false,
    synth: window.speechSynthesis,
    
    speak(text) {
        const ut = new SpeechSynthesisUtterance(text);
        ut.lang = 'de-DE';
        ut.pitch = 0.9;
        ut.rate = 1.0;
        this.synth.speak(ut);
        
        // Text in den Chat schreiben
        const chat = document.getElementById('chat-box');
        const msg = document.createElement('div');
        msg.innerHTML = `<b style="color:#39FF14">TONI:</b> ${text}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    firstGreeting() {
        this.speak("Hallo, ich bin TONI 2.0, dein persönlicher Co-Trainer. Mit wem habe ich das Vergnügen?");
        document.getElementById('status-dot').classList.add('ai-online');
    }
};
