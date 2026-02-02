/**
 * TONI 2.0 – PRO VOICE ENGINE (API-DRIVEN)
 * Integration: OpenAI / ElevenLabs Streaming
 */

(function() {
    window.ToniAI = {
        userName: '',
        voiceSettings: {
            volume: 0.9,
            vibe: 'analytisch',
            provider: 'openai' // Hier kann später auf 'elevenlabs' gewechselt werden
        },

        // --- PROFI-SPRACHAUSGABE (API CALL) ---
        async say(text) {
            const apiKey = localStorage.getItem('toni2_api_key');
            if (!apiKey) {
                console.warn("Kein API-Key gefunden. Nutze System-Fallback.");
                this.fallbackSay(text); // Fallback auf System-Stimme
                return;
            }

            const processedText = this.applyPersona(text);
            const voice = this.voiceSettings.vibe === 'matchday' ? 'onyx' : 'alloy';

            try {
                // UI-Feedback: Toni "denkt" und "spricht"
                this.setVisualFeedback(true);

                const response = await fetch('https://api.openai.com/v1/audio/speech', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "tts-1",
                        input: processedText,
                        voice: voice,
                        speed: this.voiceSettings.vibe === 'matchday' ? 1.1 : 0.95
                    })
                });

                if (!response.ok) throw new Error("API-Fehler bei der Sprachausgabe");

                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.volume = this.voiceSettings.volume;
                
                audio.onended = () => this.setVisualFeedback(false);
                audio.play();

            } catch (error) {
                console.error("Voice-API Error:", error);
                this.fallbackSay(text);
            }
        },

        // --- FALLBACK (Falls API nicht erreichbar) ---
        fallbackSay(text) {
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance(text);
                msg.pitch = 0.9;
                window.speechSynthesis.speak(msg);
            }
        },

        applyPersona(text) {
            if (this.voiceSettings.vibe === 'matchday') {
                return `Männer, Fokus jetzt! ${text} Volle Intensität!`;
            }
            return `In der taktischen Analyse zeigt sich: ${text}`;
        },

        setVisualFeedback(isSpeaking) {
            const bubble = document.querySelector('.toni-speech-bubble');
            if (bubble) {
                isSpeaking ? bubble.classList.add('speaking-glow') : bubble.classList.remove('speaking-glow');
            }
        },

        // --- UI UPDATES ---
        updateSetting(key, val) {
            this.voiceSettings[key] = val;
            if(key === 'vibe') {
                document.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('active'));
                document.getElementById('vibe-' + val).classList.add('active');
            }
        },

        renderVoiceControls() {
            return `
                <div class="voice-control-panel animate-fadeIn">
                    <h4>🎙️ PROFISCHALTPRÜFUNG</h4>
                    <div class="control-group">
                        <label>MODUS (KLOPP vs. NAGELSMANN)</label>
                        <div class="vibe-selector">
                            <button id="vibe-analytisch" class="vibe-btn ${this.voiceSettings.vibe === 'analytisch' ? 'active' : ''}" onclick="ToniAI.updateSetting('vibe', 'analytisch')">ANALYTISCH</button>
                            <button id="vibe-matchday" class="vibe-btn ${this.voiceSettings.vibe === 'matchday' ? 'active' : ''}" onclick="ToniAI.updateSetting('vibe', 'matchday')">MATCHDAY</button>
                        </div>
                    </div>
                    <button class="tool-btn" style="border-color:var(--data-cyan);" onclick="ToniAI.say('Björn, ich bin bereit für die taktische Anweisung.')">STIMME TESTEN</button>
                </div>
            `;
        },

        speak(text, html = "") {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble">
                    <div class="toni-badge">TONI // PRO-AI VOICE</div>
                    <div class="toni-text">${text}</div>
                    ${html}
                </div>
                ${this.renderVoiceControls()}
            `;
            this.say(text);
        }
    };
})();
