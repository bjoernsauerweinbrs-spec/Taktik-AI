/**
 * Toni 2.0 - Voice Engine
 * Männliche Identität mit präziser Autorität (Pitch 0.75-0.9).
 */

window.toniVoice = {
    speak: (text) => {
        // Falls der Browser gerade schon spricht, brich es ab (für flüssige Übergänge)
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        
        // Suche nach einer männlichen deutschen Stimme (Stefan, Markus, Microsoft, etc.)
        const maleVoice = voices.find(v => 
            v.lang.startsWith('de') && 
            (v.name.includes('Stefan') || v.name.includes('Markus') || v.name.includes('Microsoft') || v.name.includes('Male'))
        );

        if (maleVoice) {
            utter.voice = maleVoice;
        }
        
        utter.lang = 'de-DE';
        utter.pitch = 0.85; // Copilot-Vorgabe für tiefere, autoritäre Stimme
        utter.rate = 1.0;   // Natürliches Sprechtempo
        utter.volume = 1.0; // Volle Lautstärke
        
        speechSynthesis.speak(utter);
    }
};

// Wichtig für Chrome/Mac: Stimmen müssen initial geladen werden
speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
};
