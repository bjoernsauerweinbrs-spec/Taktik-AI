// Ergänzung in window.ToniBrain
window.ToniBrain.handleCommand = function(command) {
    const cmd = command.toLowerCase();
    
    if (cmd.includes("funino") || cmd.includes("g-jugend")) {
        window.PitchEngine.setMode('funino');
        this.speak("Stelle den Platz auf Funino um. Vier Minitore sind bereit.");
    } 
    else if (cmd.includes("kleinfeld") || cmd.includes("jugend")) {
        window.PitchEngine.setMode('kleinfeld');
        this.speak("Wechsle auf Kleinfeld für das Jugendtraining.");
    }
    else if (cmd.includes("großfeld") || cmd.includes("senioren")) {
        window.PitchEngine.setMode('grossfeld');
        this.speak("Großfeld aktiviert. Volle Distanz für die Senioren.");
    }
};
