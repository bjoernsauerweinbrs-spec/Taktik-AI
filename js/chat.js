/** * Toni 2.0 - Taktische Intelligenz & Board-Anbindung
 * Fachmann-Modus: Brasilianischer Style & Proaktive Analyse
 */
window.handleToniAction = async function() {
    const inputField = document.getElementById('user-msg');
    const msg = inputField.value.trim();
    if (!msg) return;

    appendChatMessage("Björn", msg); //
    inputField.value = "";
    const lowMsg = msg.toLowerCase();

    // 1. Identitäts-Check & Altersklassen-Abfrage
    if (lowMsg.includes("hallo") || lowMsg.includes("start")) {
        const r = "Hallo Björn! Um das System scharf zu schalten: Welche Altersklasse trainieren wir heute? Senioren, U19 oder Funino? Ich brauche das, um das richtige Spielfeld zu generieren.";
        processToniOutput(r);
        return;
    }

    // 2. Automatisches Spielfeld-Setup (Senioren = Großfeld)
    if (lowMsg.includes("senioren") || lowMsg.includes("herren")) {
        if (typeof window.setPitch === "function") window.setPitch('grossfeld'); //
        const r = "Senioren erkannt. Großfeld ist aufgebaut, Björn. Brasilianischer Ginga-Style ist geladen. Sollen wir mit der 4-3-3 Grundordnung starten?";
        processToniOutput(r);
        return;
    }

    // 3. Experten-KI (Groq/Llama-Schnittstelle)
    const aiResponse = await askToniAI(msg); 
    processToniOutput(aiResponse);
};

function processToniOutput(text) {
    appendChatMessage("Toni", text); //
    speakText(text); //
}

function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = "chat-msg " + (sender === "Björn" ? "bjorn-msg" : "toni-msg");
    div.style = `margin: 10px 0; padding: 12px; border-radius: 10px; border-left: 4px solid ${sender === "Björn" ? "#2ecc71" : "#f1c40f"}; background: rgba(255,255,255,0.05);`;
    div.innerHTML = `<strong>${sender}:</strong> ${text}`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

function speakText(text) {
    window.speechSynthesis.cancel();
    const m = new SpeechSynthesisUtterance(text);
    m.lang = 'de-DE';
    m.pitch = 0.85; // Männliche Stimme
    const voices = window.speechSynthesis.getVoices();
    m.voice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Deutsch')) || voices[0];
    window.speechSynthesis.speak(m);
}

async function askToniAI(prompt) {
    // Hier wird deine Groq-API-Anbindung sitzen
    return "Ich analysiere die Spielsituation für dich, Björn. Wie sollen die roten Spieler sich taktisch verhalten?";
}
