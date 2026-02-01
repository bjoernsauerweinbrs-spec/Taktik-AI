// =========================================
// Toni 2.0 – Voice UI
// Overlay, Status, Transcript
// =========================================

let voiceOverlay = null;
let voiceStatus = null;
let voiceTranscript = null;

// -----------------------------------------
// Voice-UI initialisieren
// -----------------------------------------
function initVoice() {
    voiceOverlay = document.getElementById("voice-overlay");
    voiceStatus = document.getElementById("voice-status");
    voiceTranscript = document.getElementById("voice-transcript");

    if (!voiceOverlay || !voiceStatus || !voiceTranscript) {
        console.warn("Voice UI nicht gefunden.");
        return;
    }

    hideVoiceOverlay();
}

// -----------------------------------------
// Overlay anzeigen
// -----------------------------------------
function showVoiceOverlay() {
    if (!voiceOverlay) return;
    voiceOverlay.classList.remove("hidden");
}

// -----------------------------------------
// Overlay ausblenden
// -----------------------------------------
function hideVoiceOverlay() {
    if (!voiceOverlay) return;
    voiceOverlay.classList.add("hidden");
}

// -----------------------------------------
// Status setzen
// -----------------------------------------
function setVoiceStatus(text, listening = false) {
    if (!voiceStatus) return;

    voiceStatus.textContent = text;

    if (listening) {
        voiceStatus.classList.add("listening");
    } else {
        voiceStatus.classList.remove("listening");
    }
}

// -----------------------------------------
// Transcript hinzufügen
// -----------------------------------------
function addTranscriptLine(text) {
    if (!voiceTranscript) return;

    const line = document.createElement("div");
    line.textContent = text;
    voiceTranscript.appendChild(line);

    voiceTranscript.scrollTop = voiceTranscript.scrollHeight;
}

// -----------------------------------------
// Voice-Eingabe starten (UI)
// -----------------------------------------
function startVoiceInput() {
    showVoiceOverlay();
    setVoiceStatus("Toni hört zu…", true);
    addTranscriptLine("🎤 (Warten auf Spracheingabe…)");

    // Hier später echte Spracherkennung einbauen
    console.log("Voice Input gestartet.");
}

// -----------------------------------------
// Voice-Eingabe stoppen (UI)
// -----------------------------------------
function stopVoiceInput() {
    setVoiceStatus("Toni verarbeitet…", false);
    addTranscriptLine("⏳ Toni denkt nach…");

    // Overlay bleibt sichtbar, bis Toni antwortet
}