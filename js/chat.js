function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Suche nach einer deutschen Männerstimme (z.B. "Google Deutsch" oder "Microsoft Stefan")
    const maleVoice = voices.find(voice => 
        (voice.lang === 'de-DE' || voice.lang === 'de_DE') && 
        (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('stefan') || voice.name.toLowerCase().includes('conrad'))
    );

    if (maleVoice) msg.voice = maleVoice;
    
    msg.lang = 'de-DE';
    msg.pitch = 0.8; // Etwas tiefer für mehr Autorität
    msg.rate = 1.0;
    window.speechSynthesis.speak(msg);
}

// Wichtig: Stimmen werden oft verzögert geladen
window.speechSynthesis.onvoiceschanged = () => {
    console.log("Stimmen geladen - Toni ist bereit.");
};
