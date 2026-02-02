(function() {
    window.ToniAI = {
        userName: '',
        recognition: null,
        isListening: false,

        init() {
            this.setupContinuousVoice();
            this.startGreeting();
        },

        setupContinuousVoice() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return;

            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.continuous = true; // HIER: Mikro bleibt an!
            this.recognition.interimResults = false;

            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                this.processTacticalInput(transcript);
            };

            this.recognition.onerror = (e) => console.error("Voice Error:", e);
        },

        toggleVoice() {
            if (this.isListening) {
                this.recognition.stop();
                this.isListening = false;
            } else {
                this.recognition.start();
                this.isListening = true;
            }
            document.getElementById('voice-trigger-btn').classList.toggle('mic-active-glow', this.isListening);
        },

        // Die taktische Analyse-Logik
        processTacticalInput(input) {
            const low = input.toLowerCase();
            console.log("Toni hört Taktik:", low);

            // 1. Ballbewegung
            if (low.includes("ball") && low.includes("links")) {
                arena.moveBall('links');
                this.speak("Ich habe den Ball nach links verschoben. Meine Kette schiebt ballorientiert ein, um das Zentrum zu schließen. Wie reagiert deine Hintermannschaft?");
            } 
            else if (low.includes("ball") && low.includes("rechts")) {
                arena.moveBall('rechts');
                this.speak("Ball ist rechts. Ich verdichte den Raum. Schau dir meine Verschiebebewegung an – stehen wir so kompakt genug?");
            }
            // 2. Argumentation & Überprüfung
            else if (low.includes("steht") && low.includes("richtig")) {
                this.analyzePositioning();
            }
            else {
                // Allgemeiner Dialog (KI-gestützt)
                this.speak("Interessanter Punkt, Björn. Aber achte auf die Halbräume. Wenn wir so weit rausschieben, öffnen wir die Mitte für einen Steckpass. Was meinst du?");
            }
        },

        analyzePositioning() {
            const feedback = "Björn, deine Abwehr steht etwas zu flach. Wenn der Gegner jetzt überschlägt, kommen wir nicht in den Rückwärtsgang. Ich würde die Innenverteidiger leicht versetzt staffeln. Probier das mal aus!";
            this.speak(feedback);
        },

        say(text) {
            if (!('speechSynthesis' in window)) return;
            const msg = new SpeechSynthesisUtterance(text);
            msg.pitch = 0.9;
            window.speechSynthesis.speak(msg);
        },

        speak(text) {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble animate-fadeIn">
                    <div class="toni-badge">TONI // LIVE ANALYSE</div>
                    <div class="toni-text">${text}</div>
                    <div class="toni-argument">Toni's Taktik-Logik: Aktiv</div>
                </div>
                <button id="voice-trigger-btn" class="${this.isListening ? 'mic-active-glow' : ''}" onclick="ToniAI.toggleVoice()" style="width:100%; padding:15px; border-radius:10px; border:none; background:var(--data-cyan); cursor:pointer; font-weight:bold;">
                    ${this.isListening ? 'TONI HÖRT ZU...' : 'MIKROFON STARTEN'}
                </button>
            `;
            this.say(text);
        },

        startGreeting() {
            this.speak("Hallo Björn! Ich bin bereit. Aktiviere das Mikrofon, dann können wir uns während der Taktik-Session direkt unterhalten. Wo ist der Ball?");
        }
    };
})();
