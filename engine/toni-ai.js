/**
 * TONI 2.0 – INTELLIGENCE & ONBOARDING
 * Persona: Mix aus Klopp & Nagelsmann (Männlich, Energetisch, Taktik-Fokus)
 */

(function() {
    window.ToniAI = {
        userName: '',

        // Sprachausgabe (Männliche Stimme)
        say(text) {
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance(text);
                const voices = window.speechSynthesis.getVoices();
                // Versuche eine deutsche männliche Stimme zu finden
                msg.voice = voices.find(v => v.lang === 'de-DE' && (v.name.includes('Male') || v.name.includes('Google'))) || voices[0];
                msg.pitch = 0.9; // Etwas tiefer für Nagelsmann-Vibe
                msg.rate = 1.0; 
                window.speechSynthesis.speak(msg);
            }
        },

        async speak(text, htmlContent = "") {
            const container = document.getElementById('setcard-content');
            container.innerHTML = `
                <div class="toni-speech-bubble animate-fadeIn">
                    <div class="toni-badge">TONI // CO-TRAINER AI</div>
                    <div class="toni-text">${text}</div>
                    <div id="toni-interaction-area">${htmlContent}</div>
                </div>
            `;
            this.say(text.replace(/<[^>]*>/g, '')); // Spricht den reinen Text
        },

        // Schritt 1: Die Begrüßung
        startGreeting() {
            const introText = "Hallo! Ich bin Toni, dein persönlicher Co-Trainer. Ich stehe dir in der täglichen Arbeit eines Trainers oder Managers zur Seite, um Weltklasse-Lösungen zu finden. Wie ist dein Name?";
            const html = `
                <div style="margin-top:15px; display:flex; gap:10px;">
                    <input id="trainer-name-input" type="text" placeholder="Dein Name..." style="flex:1; padding:10px; border-radius:8px; border:none; background:#0B1220; color:white;">
                    <button class="tool-btn" onclick="ToniAI.handleName()" style="width:auto; margin:0; background:var(--data-cyan); color:black;">OK</button>
                </div>
            `;
            this.speak(introText, html);
        },

        // Schritt 2: Kennenlernen & Erklärung
        handleName() {
            const name = document.getElementById('trainer-name-input').value;
            if(!name) return;
            this.userName = name;
            const text = `Schön dich kennenzulernen, ${this.userName}! Lass uns direkt auf den Platz gehen. Ich erkläre dir kurz, was das KI-Taktikboard und Toni 2.0 für dich tun können.`;
            const html = `<button class="tool-btn" onclick="ToniAI.explainCapabilities()">WAS KANNST DU?</button>`;
            this.speak(text, html);
        },

        // Schritt 3: Die Fähigkeiten
        explainCapabilities() {
            const text = "Toni 2.0 ist dein digitales Cockpit. Du kannst hier dein komplettes Training planen, Übungen aus meiner globalen Datenbank ziehen und deine Spieltags-Taktik bis ins Detail simulieren. Ich analysiere die Belastung deiner Spieler in Echtzeit, damit wir am Wochenende mit maximaler Intensität pressen können!";
            const html = `<button class="tool-btn" onclick="ToniAI.explainStorage()">WO WERDEN MEINE DATEN GESPEICHERT?</button>`;
            this.speak(text, html);
        },

        // Schritt 4: Lokale Speicherung
        explainStorage() {
            const text = "Ganz wichtig: Deine Privatsphäre hat Priorität. Alles, was wir hier erarbeiten – dein Kader, deine Taktiken, deine Notizen – wird ausschließlich lokal auf deinem Gerät gespeichert. Kein Cloud-Zwang, volle Kontrolle für dich.";
            const html = `<button class="tool-btn" onclick="ToniAI.finalCall()">STARTEN WIR!</button>`;
            this.speak(text, html);
        },

        // Schritt 5: Start-Auswahl
        finalCall() {
            const text = `Womit wollen wir heute starten, ${this.userName}? Du kannst dich entweder selbst durch die Zentrale klicken, oder du sagst mir einfach, was du machen willst – dann öffne ich die entsprechende Seite für dich.`;
            const html = `
                <div style="display:grid; grid-template-columns:1fr; gap:10px;">
                    <button class="tool-btn" onclick="BriefcaseUI.toggle()">KLICK-MODUS (ZENTRALE ÖFFNEN)</button>
                    <button class="tool-btn" style="border-color:var(--accent-orange);" onclick="alert('Sprachsteuerung aktiviert...')">SAGEN, WAS ICH WILL (VOICE)</button>
                </div>
            `;
            this.speak(text, html);
        }
    };
})();
