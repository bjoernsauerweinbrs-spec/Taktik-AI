window.ToniAI = {
    isListening: false,
    recognition: null,
    
    init() {
        console.log("Toni AI: Systemstart... Brasilianischer Style aktiv.");
        this.setupVoiceCommands();
        this.welcomeMessage();
    },

    welcomeMessage() {
        const msg = "Ola Björn! Toni 2.0 ist bereit. Dein Board ist frei, der Kader geladen. Wie gehen wir heute taktisch vor? Soll ich die Jungs ins 4-3-3 schieben?";
        this.addChatMessage("Toni", msg, "bot-msg");
    },

    toggleListening() {
        this.isListening = !this.isListening;
        const micIcon = document.getElementById('mic-icon');
        if (this.isListening) {
            micIcon.style.color = "#FF3B30";
            micIcon.classList.add('pulse');
            console.log("Toni hört zu...");
            // Hier würde die Web Speech API starten
        } else {
            micIcon.style.color = "";
            micIcon.classList.remove('pulse');
        }
    },

    // Die Logik, wie Toni auf Björn reagiert
    async processCommand(text) {
        this.addChatMessage("Björn", text, "user-msg");
        
        let response = "";
        const input = text.toLowerCase();

        if (input.includes("formation") || input.includes("aufstellung")) {
            response = "Kein Problem, Björn! Ich schiebe die Jungs in die Formation. Schau aufs Board!";
            window.BriefcaseUI.applyFormation(input.includes("352") ? "352" : "433");
        } 
        else if (input.includes("zeitung") || input.includes("marketing")) {
            response = "Die Stadionzeitung für den FC Toni 2.0 sieht spitze aus. Soll ich noch mehr Werbung für unser Board machen?";
            window.BriefcaseUI.switchSektor('marketing');
        }
        else if (input.includes("kader") || input.includes("spieler")) {
            response = "Ich öffne dir die Sporttasche. Wer ist heute fit für den brasilianischen Zauber?";
            window.BriefcaseUI.switchSektor('sport');
        }
        else {
            response = "Verstanden, Björn. Ich analysiere das... Als dein Berater sage ich: Wir brauchen mehr Ballbesitz im Mittelfeld!";
        }

        setTimeout(() => {
            this.addChatMessage("Toni", response, "bot-msg");
            this.speak(response);
        }, 600);
    },

    addChatMessage(sender, text, type) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = type;
        msgDiv.innerHTML = `<b>${sender}:</b><br>${text}`;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    },

    speak(text) {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.9; // Etwas tiefer, männlich
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    },

    setupVoiceCommands() {
        const btn = document.getElementById('send-btn');
        const input = document.getElementById('chat-input');
        
        if (btn && input) {
            btn.onclick = () => {
                if (input.value.trim() !== "") {
                    this.processCommand(input.value);
                    input.value = "";
                }
            };
            input.onkeypress = (e) => {
                if (e.key === 'Enter' && input.value.trim() !== "") {
                    this.processCommand(input.value);
                    input.value = "";
                }
            };
        }
    }
};

// Initialisierung bei Systemstart
document.addEventListener('DOMContentLoaded', () => {
    // Toni wartet kurz auf das System-Login
});
