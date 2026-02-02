/**
 * TONI 2.0 – INTELLIGENCE & VOICE CORE
 * Persona: Klopp/Nagelsmann Mix
 */

(function() {
    window.ToniAI = {
        userName: '',
        recognition: null,
        isListening: false,

        // Zentrale Start-Funktion [cite: 2026-02-02]
        init() {
            console.log("⚽ Toni Intelligence: Aufwärmen abgeschlossen.");
            this.setupVoice();
            this.startGreeting();
        },

        // --- SPRACHAUSGABE (Toni spricht) ---
        say(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                // Suche nach einer kräftigen, männlichen Stimme
                msg.voice = voices.find(v => v.lang === 'de-DE' && (v.name.includes('Male') || v.name.includes('Google'))) || voices[0];
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
                
                this.recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.processInput(transcript);
                };

                this.recognition.onend = () => this.setListeningState(false);
            }
        },

        toggleListening() {
            if (!this.recognition) return alert("Browser unterstützt keine Spracherkennung.");
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
            if (btn) btn.classList.toggle('pulse-animation', state);
        },

        // --- DIALOG-LOGIK ---
        async speak(text, showInput = true) {
            const container = document.getElementById('setcard-content');
            if (!container) return;

            container.innerHTML = `
                <div class="toni-speech-bubble animate-fadeIn">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    ${showInput ? `
                        <div id="toni-chat-area" style="margin-top:20px;">
                            <div style="display:flex; gap:10px;">
                                <input id="toni-free-input" type="text" placeholder="Schreib mir oder sprich..." onkeypress="if(event.key==='Enter') ToniAI.handleManualInput()">
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
                this.speak(`Schön dich kennenzulernen, ${this.userName}! Ich erkläre dir kurz was Toni 2.0 für dich tun kann. Ich plane dein Training, verwalte den Kader und erstelle Stadionzeitungen – alles lokal und sicher auf deinem Gerät. Womit fangen wir an?`);
                return;
            }

            if (low.includes("training") || low.includes("sporttasche")) {
                this.speak("Ab zur Sporttasche. Voller Fokus auf die Einheiten!");
                setTimeout(() => BriefcaseUI.switchSektor('sport'), 1500);
            } else if (low.includes("zeitung") || low.includes("geschäft")) {
                this.speak("Redaktion öffnet. Wir machen das Heft heute druckreif!");
                setTimeout(() => BriefcaseUI.switchSektor('orga'), 1500);
            } else {
                this.speak("Klasse Idee! Ich schlage vor, wir schauen uns das direkt in der Zentrale an.");
            }
        },

        handleManualInput() {
            const el = document.getElementById('toni-free-input');
            if (el.value) { this.processInput(el.value); el.value = ''; }
        },

        startGreeting() {
            this.speak("Hallo! Ich bin Toni, dein persönlicher Co-Trainer. Ich stehe dir in der täglichen Arbeit eines Trainers oder Managers zur Verfügung. Wie ist dein Name?");
        }
    };
})();
