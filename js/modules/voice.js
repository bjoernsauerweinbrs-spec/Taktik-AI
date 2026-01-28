/**
 * Toni 2.0 - Voice Engine
 * Männliche Identität mit präziser Autorität.
 */

window.toniVoice = {
    speak: (text) => {
        // Falls Toni noch spricht, bricht er kurz ab für den neuen Satz
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();
        
        // Suche nach einer männlichen deutschen Stimme
        const maleVoice = voices.find(v => 
            v.lang.startsWith('de') && 
            (v.name.includes('Stefan') || v.name.includes('Markus') || v.name.includes('Microsoft'))
        );

        if (maleVoice) utter.voice = maleVoice;
        
        utter.lang = 'de-DE';
        utter.pitch = 0.85; // Tieferer Pitch für Trainer-Autorität
        utter.rate = 1.0;
        
        speechSynthesis.speak(utter);
    }
};

// Vorladen der Stimmen
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
