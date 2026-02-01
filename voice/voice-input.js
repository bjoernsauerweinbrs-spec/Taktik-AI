// =========================================
// Toni 2.0 – Voice Input (Speech-to-Text)
// =========================================

let toniListening = false;
let recognition = null;

function initVoiceInput() {
    if (!("webkitSpeechRecognition" in window)) {
        console.warn("Speech Recognition wird nicht unterstützt.");
        return;
    }

    recognition = new webkitSpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        toniListening = true;
        updateVoiceUI(true);
    };

    recognition.onend = () => {
        toniListening = false;
        updateVoiceUI(false);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        handleVoiceCommand(transcript);
    };
}

function startVoiceListening() {
    if (recognition && !toniListening) {
        recognition.start();
    }
}

function updateVoiceUI(active) {
    const overlay = document.getElementById("voice-overlay");
    if (!overlay) return;

    overlay.classList.toggle("hidden", !active);
    overlay.querySelector("#voice-status").textContent =
        active ? "Toni hört zu…" : "Toni ist bereit.";
}