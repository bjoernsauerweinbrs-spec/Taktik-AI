/**
 * TONI 2.0 - VOICE CORE (PRO SYNC 2026)
 * Fokus: Bidirektionale Kommunikation & Akustisches Feedback
 * Status: CLEAN & SYNCED 2026
 */
window.ToniVoice = {
    synth: window.speechSynthesis,
    isMuted: false,
    recognition: null,

    /**
     * TONI spricht: Lautausgabe & Chat-Eintrag
     */
    speak(text) {
        if (this.isMuted || !this.synth) return;

        // Laufende Sprachausgabe abbrechen für sofortige Reaktion
        this.synth.cancel(); 

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.9; // Etwas tiefer für markanten Klang
        utterance.rate = 1.0;

        // Stimme wählen (Asynchroner Schutz)
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('de') && v.name.includes('Stefan')) || 
                              voices.find(v => v.lang.includes('de') && v.name.includes('Google')) ||
                              voices[0];
        
        if (preferredVoice) utterance.voice = preferredVoice;

        // Visuelles Feedback im Chat
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            chatBox.innerHTML += `
                <div class="chat-msg system fadeIn" style="border-left: 2px solid var(--neon-green); background: rgba(57, 255, 20, 0.03); padding: 10px; margin-bottom: 8px;">
                    <span style="font-size: 0.5rem; color: #555; display: block;">${time} - TONI KI</span>
                    <span style="color: #fff; font-size: 0.8rem;">${text}</span>
                </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        this.synth.speak(utterance);
    },

    /**
     * Sprachsteuerung initialisieren
     */
    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Spracherkennung wird von diesem Browser nicht unterstützt.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };

        this.recognition.onend = () => {
            const micBtn = document.getElementById('main-mic-btn');
            if (micBtn) micBtn.classList.remove('active');
        };

        this.recognition.onerror = (err) => {
            console.error("Voice Error:", err.error);
        };
    },

    /**
     * Logik-Zentrale für Sprachbefehle
     */
    handleVoiceCommand(cmd) {
        console.log("🎤 Befehl empfangen:", cmd);
        
        // Chat-Anzeige des Nutzers
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `<div class="chat-msg user" style="color:var(--data-cyan); font-size: 0.8rem; text-align: right; margin-bottom: 10px;">"${cmd}"</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // NAVIGATION & AKTIONEN
        if (cmd.includes("kabine") || cmd.includes("kader") || cmd.includes("spieler")) {
            this.speak("Ich öffne die Kabine. Alle Einheiten sind bereit.");
            window.openSection('kabine');
        } 
        else if (cmd.includes("sponsoring") || cmd.includes("geld") || cmd.includes("finanzen") || cmd.includes("kontor")) {
            this.speak("Öffne das Kontor. Die Sponsorenverträge werden geladen.");
            window.openSection('sponsoring');
        }
        else if (cmd.includes("zeitung") || cmd.includes("presse") || cmd.includes("stadion")) {
            this.speak("Redaktion wird hochgefahren. Die neue Stadionzeitung liegt bereit.");
            window.openSection('stadionzeitung');
        }
        else if (cmd.includes("labor") || cmd.includes("analyse") || cmd.includes("werte")) {
            this.speak("Analysezentrum aktiviert. Biometrische Scans werden synchronisiert.");
            window.openSection('analyse');
        }
        else if (cmd.includes("zentrale") || cmd.includes("menü") || cmd.includes("briefcase")) {
            this.speak("Kehre zurück in die Zentrale.");
            if(window.BriefcaseUI) window.BriefcaseUI.renderMainGrid();
        }
        else if (cmd.includes("schließe") || cmd.includes("danke") || cmd.includes("standby")) {
            this.speak("Verstanden. Ich bleibe im Hintergrund aktiv.");
            if(window.BriefcaseUI && window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
        }
        else if (cmd.includes("reload") || cmd.includes("neu laden") || cmd.includes("reboot")) {
            this.speak("System-Reboot eingeleitet.");
            setTimeout(() => location.reload(), 1000);
        }
        else {
            this.speak("Ich habe den Befehl gehört, Coach. Aber für '" + cmd + "' fehlen mir noch die Zugriffsberechtigungen.");
        }
    },

    startListening() {
        if (!this.recognition) this.initRecognition();
        try {
            this.recognition.start();
            const micBtn = document.getElementById('main-mic-btn');
            if (micBtn) micBtn.classList.add('active');
        } catch (e) {
            console.log("Erkennung bereits aktiv.");
        }
    }
};

// Automatischer Start bei Stimmenänderung (Chrome Fix)
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => {
        console.log("🔊 Stimmen-Datenbank geladen.");
    };
}
