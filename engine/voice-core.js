/**
 * TONI 2.0 - VOICE CORE (PRO SYNC 2026)
 * Fokus: Bidirektionale Kommunikation & Akustisches Feedback
 * Status: ETAPPE 1.3 - KOMMUNIKATION VERSIEGELT
 */
window.ToniVoice = {
    synth: window.speechSynthesis,
    isMuted: false,
    recognition: null,

    /**
     * Lässt TONI einen Text laut vorlesen und im Chat einblenden
     */
    speak(text) {
        if (this.isMuted || !this.synth) return;

        this.synth.cancel(); // Vorherige Sprache stoppen

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.pitch = 0.95;
        utterance.rate = 1.0;

        const voices = this.synth.getVoices();
        const maleVoice = voices.find(v => v.lang.includes('de') && (v.name.includes('Microsoft') || v.name.includes('Google')));
        if (maleVoice) utterance.voice = maleVoice;

        // Antwort im Chat einblenden
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `<div class="chat-msg system"><b>TONI:</b> ${text}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        this.synth.speak(utterance);
    },

    initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'de-DE';
        this.recognition.continuous = false; // Auf Einzelsegment-Erkennung für präzise Befehle
        this.recognition.interimResults = false;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            this.handleVoiceCommand(transcript);
        };

        this.recognition.onend = () => {
            // Visueller Reset des Mikro-Buttons, falls gewünscht
            const micBtn = document.getElementById('main-mic-btn');
            if (micBtn) micBtn.style.color = "#fff";
        };
    },

    handleVoiceCommand(cmd) {
        // Anzeige des gehörten Textes
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            chatBox.innerHTML += `<div class="chat-msg user" style="color:var(--data-cyan)">🎤 ${cmd}</div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // --- INTELLIGENTE ANTWORT-LOGIK ---
        if (cmd.includes("kabine") || cmd.includes("spieler")) {
            this.speak("Ich öffne die Spielerkabine. Der Kader wird geladen.");
            if(window.BriefcaseUI) { window.BriefcaseUI.toggle(); window.openSection('kabine'); }
        } 
        else if (cmd.includes("finanzen") || cmd.includes("geld")) {
            this.speak("Finanzstatus wird abgerufen. Die Sponsorenverträge sind stabil.");
            if(window.BriefcaseUI) { window.BriefcaseUI.toggle(); window.openSection('finanzen'); }
        }
        else if (cmd.includes("zeitung") || cmd.includes("presse")) {
            this.speak("Redaktionssystem wird hochgefahren. Die neue Ausgabe ist bereit.");
            if(window.BriefcaseUI) { window.BriefcaseUI.toggle(); window.openSection('stadionzeitung'); }
        }
        else if (cmd.includes("labor") || cmd.includes("analyse")) {
            this.speak("Analysezentrum aktiviert. Biometrische Daten werden synchronisiert.");
            if(window.BriefcaseUI) { window.BriefcaseUI.toggle(); window.openSection('analyse'); }
        }
        else if (cmd.includes("schließe") || cmd.includes("danke")) {
            this.speak("Verstanden. Ich bleibe im Standby.");
            if(window.BriefcaseUI && window.BriefcaseUI.isOpen) window.BriefcaseUI.toggle();
        }
        else {
            this.speak("Befehl analysiert: " + cmd + ". Ich bin mir nicht sicher, wie ich hier helfen kann, Coach.");
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    window.ToniVoice.initRecognition();
});
