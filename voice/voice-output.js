// =========================================
// Toni 2.0 – Voice Output (Text-to-Speech)
// =========================================

function toniSpeak(text) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "de-DE";
    utter.rate = 1.0;
    utter.pitch = 1.0;

    window.speechSynthesis.speak(utter);
}