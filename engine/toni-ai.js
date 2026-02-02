/**
 * TONI 2.0 – VOICE ENGINE & PERSONA CONTROL
 */

(function() {
    window.ToniAI = {
        userName: '',
        voiceSettings: {
            volume: 0.8,
            rate: 1.0,
            pitch: 0.9,
            vibe: 'analytisch' // 'analytisch' (Nagelsmann) vs 'matchday' (Klopp)
        },

        init() {
            this.startGreeting();
            console.log("🎙️ Toni Voice-Engine: Bereit für Anweisungen.");
        },

        // --- DIE PERSONA-LOGIK (SSML Simulation) ---
        applyPersona(text) {
            let processed = text;
            if (this.voiceSettings.vibe === 'matchday') {
                // Klopp-Style: Kürzer, energetischer, Pausen für Effekt
                this.voiceSettings.rate = 1.1;
                this.voiceSettings.pitch = 1.0;
                processed = "Männer, hört zu! " + processed + " Gebt alles!";
            } else {
                // Nagelsmann-Style: Sachlich, präzise, tiefere Stimme
                this.voiceSettings.rate = 0.95;
                this.voiceSettings.pitch = 0.85;
                processed = "In der Analyse zeigt sich: " + processed;
            }
            return processed;
        },

        say(text) {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();

            const processedText = this.applyPersona(text);
            const msg = new SpeechSynthesisUtterance(processedText);
            
            const voices = window.speechSynthesis.getVoices();
            msg.voice = voices.find(v => v.lang === 'de-DE' && v.name.includes('Male')) || voices[0];
            
            msg.volume = this.voiceSettings.volume;
            msg.rate = this.voiceSettings.rate;
            msg.pitch = this.voiceSettings.pitch;

            // UI-Feedback beim Sprechen
            msg.onstart = () => document.querySelector('.toni-speech-bubble')?.classList.add('speaking-glow');
            msg.onend = () => document.querySelector('.toni-speech-bubble')?.classList.remove('speaking-glow');

            window.speechSynthesis.speak(msg);
        },

        // --- UI ACTIONS ---
        updateSetting(key, val) {
            this.voiceSettings[key] = parseFloat(val);
            if(key === 'vibe') {
                document.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('active'));
                document.getElementById('vibe-' + val).classList.add('active');
                this.voiceSettings.vibe = val;
            }
        },

        testVoice() {
            this.say("Björn, das ist ein Test der aktuellen Sprachausgabe. Intensität ist alles!");
        },

        // --- DYNAMISCHE UI ERZEUGUNG ---
        renderVoiceControls() {
            return `
                <div class="voice-control-panel animate-fadeIn">
                    <h4>🎙️ Voice-Command-Center</h4>
                    
                    <div class="control-group">
                        <label>LAUTSTÄRKE</label>
                        <input type="range" class="voice-slider" min="0" max="1" step="0.1" value="${this.voiceSettings.volume}" oninput="ToniAI.updateSetting('volume', this.value)">
                    </div>

                    <div class="control-group">
                        <label>PERSONA-MODUS</label>
                        <div class="vibe-selector">
                            <button id="vibe-analytisch" class="vibe-btn ${this.voiceSettings.vibe === 'analytisch' ? 'active' : ''}" onclick="ToniAI.updateSetting('vibe', 'analytisch')">ANALYTISCH (NGLS)</button>
                            <button id="vibe-matchday" class="vibe-btn ${this.voiceSettings.vibe === 'matchday' ? 'active' : ''}" onclick="ToniAI.updateSetting('vibe', 'matchday')">MATCHDAY (KLPP)</button>
                        </div>
                    </div>

                    <button class="tool-btn" style="border-color:var(--success-green); color:var(--success-green);" onclick="ToniAI.testVoice()">STIMME TESTEN</button>
                </div>
            `;
        },

        speak(text, html = "") {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    ${html}
                </div>
                ${this.renderVoiceControls()}
            `;
            this.say(text);
        },

        startGreeting() {
            this.speak("Hallo! Ich bin Toni, dein Co-Trainer. Wie lautet dein Name?");
        }
    };
})();
