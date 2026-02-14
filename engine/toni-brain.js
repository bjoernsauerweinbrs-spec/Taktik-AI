/**
 * TONI 2.0 - MASTER COGNITION ENGINE
 * Status: High-Level Elite
 */

window.ToniBrain = {
    isListening: false,
    recognition: null,
    synth: window.speechSynthesis,
    mentorVoice: null,

    /**
     * Initialisiert die Sprach-Engine und sucht die passende Mentor-Stimme
     */
    init() {
        console.log("🧠 TONI Brain wird hochgefahren...");
        
        // Stimme auswählen (Mentor-Style)
        const setVoice = () => {
            const voices = this.synth.getVoices();
            // Wir suchen nach einer tiefen, männlichen Stimme (z.B. Google Deutsch)
            this.mentorVoice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Google')) || voices[0];
        };

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = setVoice;
        }
        setVoice();

        // Spracherkennung initialisieren (Web Speech API)
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = false; // Für präzise Frage-Antwort-Zyklen
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.log(`Du: ${transcript}`, 'user');
                this.processCommand(transcript);
            };

            this.recognition.onend = () => {
                if (this.isListening) this.recognition.start(); // Auto-Restart für "Hands-Free"
            };
        }
    },

    /**
     * TONI spricht mit Mentor-Stimme
     */
    speak(text) {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.mentorVoice;
        utterance.pitch = 0.85; // Schön tief und ruhig
        utterance.rate = 0.95;  // Nicht zu hektisch
        
        this.log(text, 'toni');
        this.synth.speak(utterance);
    },

    /**
     * Loggt die Kommunikation in das rechte Panel
     */
    log(text, sender) {
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) return;

        const msg = document.createElement('div');
        msg.style.marginBottom = "15px";
        msg.style.paddingLeft = "10px";
        msg.style.borderLeft = sender === 'toni' ? "2px solid #39FF14" : "2px solid #00D1FF";
        
        const name = sender === 'toni' ? 'TONI' : 'COACH';
        const color = sender === 'toni' ? '#39FF14' : '#00D1FF';

        msg.innerHTML = `<small style="color:${color}; font-family:'Orbitron'; font-size:0.6rem;">${name}</small><br>${text}`;
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    },

    /**
     * Schaltet das Mikrofon live (Hands-Free Modus)
     */
    toggleMic() {
        const micBtn = document.getElementById('main-mic');
        const statusDot = document.getElementById('status-dot');

        if (!this.isListening) {
            this.isListening = true;
            this.recognition.start();
            micBtn.classList.add('mic-active');
            statusDot.style.background = "#FF3131"; // Rot wenn er zuhört
            console.log("🎤 TONI hört zu...");
        } else {
            this.isListening = false;
            this.recognition.stop();
            micBtn.classList.remove('mic-active');
            statusDot.style.background = "#39FF14"; // Wieder Grün
            console.log("🎤 Mikrofon aus.");
        }
    },

    /**
     * DIE INTELLIGENZ: Verarbeitet deine Fragen & Befehle
     */
    processCommand(cmd) {
        const text = cmd.toLowerCase();

        // 🏟️ SPIELFELD STEUERUNG
        if (text.includes("funino") || text.includes("g-jugend")) {
            if(window.PitchEngine) window.PitchEngine.setMode('funino');
            this.speak("Verstanden, Coach. Das Spielfeld ist für die G-Jugend auf Funino eingestellt.");
            return;
        }
        if (text.includes("großfeld") || text.includes("senioren")) {
            if(window.PitchEngine) window.PitchEngine.setMode('grossfeld');
            this.speak("Großfeld aktiviert. Die volle Arena steht bereit.");
            return;
        }

        // 📱 SETUP & ERKLÄRUNGEN (Wie wird TONI schlau?)
        if (text.includes("internet") || text.includes("schlau machen")) {
            this.speak("Um mich voll zu vernetzen, müssen wir meinen Kern mit der Cloud verbinden. Gehe dazu ins Setup-Menü in der Aktentasche. Dort zeige ich dir, wie du mein Gehirn mit dem Internet synchronisierst.");
            return;
        }
        if (text.includes("handy") || text.includes("verbinden")) {
            this.speak("Die Mobile-Anbindung ist einfach: In den Einstellungen generiere ich dir einen QR-Code. Scanne ihn mit deinem Handy, und du hast das Taktikboard live in deiner Tasche.");
            return;
        }

        // 💼 AKTENTASCHE STEUERUNG
        if (text.includes("aktentasche") || text.includes("Zentrale")) {
            toggleBriefcase(); // Funktion in app.html
            this.speak("Ich öffne das Management-Zentrum.");
            return;
        }

        // 🃏 FIFA KARTEN / KABINE
        if (text.includes("kabine") || text.includes("mannschaft")) {
            this.speak("Lade die Mannschafts-Übersicht. Die FIFA-Karten sind bereit zur Bearbeitung.");
            // Hier folgt später der Trigger für das Modul
            return;
        }

        // STANDARDFALL (KI Antwort)
        this.speak("Das habe ich verstanden, Coach. Soll ich einen speziellen Sektor für dich öffnen?");
    },

    /**
     * Die erste Begrüßung nach dem Login
     */
    firstGreeting() {
        this.init();
        setTimeout(() => {
            this.speak("Hallo, ich bin TONI 2.0, dein persönlicher Co-Trainer. Mit wem habe ich das Vergnügen?");
            document.getElementById('status-dot').style.background = "#39FF14";
        }, 500);
    }
};
