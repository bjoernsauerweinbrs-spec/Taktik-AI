/**
 * TONI 2.0 – INTELLIGENCE & VOICE CORE (DEBUG VERSION)
 */

(function() {
    window.ToniAI = {
        userName: '',
        recognition: null,
        isListening: false,

        init() {
            console.log("🎤 Toni Voice-System wird initialisiert...");
            this.setupVoice();
            this.startGreeting();
        },

        say(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                msg.voice = voices.find(v => v.lang === 'de-DE' && (v.name.includes('Male') || v.name.includes('Google'))) || voices[0];
                msg.pitch = 0.85; 
                window.speechSynthesis.speak(msg);
            }
        },

        setupVoice() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                console.error("❌ Web Speech API wird von diesem Browser nicht unterstützt.");
                return;
            }

            this.recognition = new SpeechRecognition();
            this.recognition.lang = 'de-DE';
            this.recognition.interimResults = true; // Zeigt Zwischenergebnisse
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                console.log("🎤 Mikrofon ist jetzt AKTIV.");
                this.updateStatusText("Toni hört zu...");
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.updateStatusText(`Erkannt: "${transcript}"`);
                
                if (event.results[0].isFinal) {
                    this.processInput(transcript);
                }
            };

            this.recognition.onerror = (event) => {
                console.error("❌ Sprachfehler:", event.error);
                this.updateStatusText(`Fehler: ${event.error}`);
                this.setListeningState(false);
            };

            this.recognition.onend = () => {
                this.setListeningState(false);
                this.updateStatusText("");
            };
        },

        updateStatusText(msg) {
            const statusEl = document.getElementById('toni-status-msg');
            if (statusEl) statusEl.innerText = msg;
        },

        toggleListening() {
            if (!this.recognition) return alert("Sprachsteuerung nicht verfügbar.");
            try {
                if (this.isListening) {
                    this.recognition.stop();
                } else {
                    this.recognition.start();
                    this.setListeningState(true);
                }
            } catch (e) {
                console.error("Fehler beim Starten der Recognition:", e);
            }
        },

        setListeningState(state) {
            this.isListening = state;
            const btn = document.getElementById('voice-trigger-btn');
            if (btn) btn.classList.toggle('pulse-animation', state);
        },

        async speak(text, showInput = true) {
            const container = document.getElementById('setcard-content');
            if (!container) return;

            container.innerHTML = `
                <div class="toni-speech-bubble animate-fadeIn">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    ${showInput ? `
                        <div id="toni-chat-area" style="margin-top:20px;">
                            <div style="font-size:10px; color:var(--data-cyan); margin-bottom:5px;" id="toni-status-msg"></div>
                            <div style="display:flex; gap:10px;">
                                <input id="toni-free-input" type="text" placeholder="Antworte Toni..." onkeypress="if(event.key==='Enter') ToniAI.handleManualInput()">
                                <button id="voice-trigger-btn" onclick="ToniAI.toggleListening()">🎤</button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
            this.say(text.replace(/<[^>]*>/g, ''));
        },

        processInput(input) {
            const low = input.toLowerCase();
            if (this.userName === '') {
                this.userName = input;
                this.speak(`Weltklasse, ${this.userName}! Jetzt kann es losgehen. Ich habe alle globalen Taktiken im Zugriff. Willst du dein Training planen oder die Stadionzeitung bearbeiten?`);
            } else if (low.includes("training") || low.includes("sport")) {
                this.speak("Alles klar, Coach. Ich öffne die Sporttasche.");
                setTimeout(() => BriefcaseUI.switchSektor('sport'), 1200);
            } else if (low.includes("zeitung")) {
                this.speak("Redaktion wird geladen. Machen wir Druck!");
                setTimeout(() => BriefcaseUI.switchSektor('orga'), 1200);
            } else {
                this.speak("Verstanden! Ich bereite alles vor.");
            }
        },

        handleManualInput() {
            const el = document.getElementById('toni-free-input');
            if (el && el.value) { this.processInput(el.value); el.value = ''; }
        },

        startGreeting() {
            this.speak("Hallo! Ich bin Toni, dein persönlicher Co-Trainer. Wie ist dein Name?");
        }
    };
})();
