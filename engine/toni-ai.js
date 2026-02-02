(function() {
    window.ToniAI = {
        userName: '',
        apiKey: '',
        isLoggedIn: false,

        init() {
            const savedKey = localStorage.getItem('toni2_api_key');
            if (savedKey) document.getElementById('api-key-input').value = savedKey;
        },

        // Der Login-Prozess
        handleLogin() {
            const pass = document.getElementById('password-input').value;
            const key = document.getElementById('api-key-input').value;

            // Einfaches Passwort-Beispiel (kannst du anpassen)
            if (pass === "Toni2026") { 
                this.apiKey = key;
                localStorage.setItem('toni2_api_key', key);
                this.isLoggedIn = true;
                
                // Login-Screen ausblenden
                document.getElementById('login-screen').classList.add('hidden');
                
                // App-Start
                this.startGreeting();
            } else {
                alert("Passwort inkorrekt!");
            }
        },

        say(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const msg = new SpeechSynthesisUtterance(text);
                msg.pitch = 0.85; 
                window.speechSynthesis.speak(msg);
            }
        },

        speak(text, html = "") {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    <div id="interaction-area" style="margin-top:20px;">${html}</div>
                </div>
            `;
            this.say(text.replace(/<[^>]*>/g, ''));
        },

        startGreeting() {
            this.speak("Willkommen zurück! Ich bin bereit für die tägliche Arbeit. Wie ist dein Name, Coach?", `
                <input id="name-input" type="text" class="login-input" placeholder="Name..." onkeypress="if(event.key==='Enter') ToniAI.setTrainerName()">
                <button class="login-btn" onclick="ToniAI.setTrainerName()">STARTEN</button>
            `);
        },

        setTrainerName() {
            this.userName = document.getElementById('name-input').value;
            if (this.userName) {
                const welcome = window.ToniBrain.getWelcomeMessage(this.userName);
                this.speak(welcome, `
                    <button class="tool-btn" onclick="BriefcaseUI.toggle()">ZENTRALE ÖFFNEN</button>
                    <button class="tool-btn" onclick="alert('Voice-Steuerung aktiv...')">VOICE-BEFEHL GEBEN</button>
                `);
            }
        }
    };
})();
