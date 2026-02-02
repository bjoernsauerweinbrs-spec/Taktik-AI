/**
 * TONI 2.0 – INTELLIGENCE & VOICE CORE
 * Fokus: Freier Dialog, Spracherkennung & Klopp/Nagelsmann Persona
 */

(function() {
    window.ToniAI = {
        userName: '',
        recognition: null,
        isListening: false,

        init() {
            this.setupVoice();
            this.startGreeting();
        },

        // --- SPRACHAUSGABE (Toni spricht) ---
        say(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); // Vorherige Sprache stoppen
                const msg = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                msg.voice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Male')) || voices[0];
                msg.pitch = 0.85; 
                msg.rate = 1.0;
                window.speechSynthesis.speak(msg);
            }
        },

        // --- SPRACHERKENNUNG (Toni hört zu) ---
        setupVoice() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.lang = 'de-DE';
                this.recognition.continuous = false;
                this.recognition.interimResults = false;

                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.processInput(transcript);
                };

                this.recognition.onend = () => {
                    this.setListeningState(false);
                };
            }
        },

        toggleListening() {
            if (!this.recognition) return alert("Spracherkennung wird von diesem Browser nicht unterstützt.");
            if (this.isListening) {
                this.recognition.stop();
            } else {
                this.recognition.start();
                this.setListeningState(true);
            }
        },

        setListeningState(state) {
            this.isListening = state;
            const btn = document.getElementById('voice-trigger-btn');
            if (btn) {
                btn.style.background = state ? 'var(--accent-orange)' : 'var(--data-cyan)';
                btn.classList.toggle('pulse-animation', state);
            }
        },

        // --- DIALOG LOGIK ---
        async speak(text, showInput = true) {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble animate-fadeIn">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    ${showInput ? `
                        <div id="toni-chat-area" style="margin-top:20px;">
                            <div style="display:flex; gap:10px;">
                                <input id="toni-free-input" type="text" placeholder="Antworte Toni..." onkeypress="if(event.key==='Enter') ToniAI.handleManualInput()">
                                <button id="voice-trigger-btn" onclick="ToniAI.toggleListening()" title="Spracheingabe">🎤</button>
                            </div>
                            <div id="toni-quick-actions" style="margin-top:15px; display:flex; flex-wrap:wrap; gap:5px;"></div>
                        </div>
                    ` : ''}
                </div>
            `;
            this.say(text.replace(/<[^>]*>/g, ''));
        },

        // Verarbeitet sowohl getippten als auch gesprochenen Text
        processInput(input) {
            console.log("Toni empfängt:", input);
            const lowInput = input.toLowerCase();

            // Beispiel für flexible Logik (wird durch Gemini/KI-Modell im Hintergrund gesteuert)
            if (this.userName === '') {
                this.userName = input;
                this.speak(`Schön dich kennenzulernen, ${this.userName}! Ich hab das System gecheckt – wir sind bereit für Höchstleistung. Was hast du heute vor? Taktik büffeln, Training planen oder die Stadionzeitung rocken?`);
                return;
            }

            if (lowInput.includes("training") || lowInput.includes("buch")) {
                this.speak("Alles klar, ab in die Sporttasche. Ich lade die Übungskataloge!");
                setTimeout(() => BriefcaseUI.switchSektor('sport'), 1500);
            } else if (lowInput.includes("zeitung") || lowInput.includes("stadion")) {
                this.speak("Redaktionsschluss! Ich öffne das Geschäftszimmer für dich.");
                setTimeout(() => BriefcaseUI.switchSektor('orga'), 1500);
            } else if (lowInput.includes("hallo") || lowInput.includes("hi")) {
                this.speak(`Hi ${this.userName}! Alles im grünen Bereich. Worauf liegt der Fokus?`);
            } else {
                this.speak("Das klingt nach einem Plan! Ich analysiere das im Hintergrund. Soll ich dir die Details in der Zentrale zeigen?");
            }
        },

        handleManualInput() {
            const inputEl = document.getElementById('toni-free-input');
            const val = inputEl.value;
            if (val) {
                this.processInput(val);
                inputEl.value = '';
            }
        },

        startGreeting() {
            this.speak("Hallo! Ich bin Toni, dein persönlicher Co-Trainer. Ich stehe dir für die tägliche Arbeit als Coach oder Manager zur Verfügung. Wie ist dein Name?");
        }
    };
})();
