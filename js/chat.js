/**
 * Toni 2.0 - KI-Schnittstelle (GroqCloud Integration)
 * Holt echte taktische Analysen basierend auf Björns Eingaben.
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

/**
 * Kernfunktion: Toni kommuniziert mit der Groq AI
 */
async function getToniResponse(userInput) {
    if (!apiKey) {
        toniSpeak("Björn, ich finde keinen API-Key. Ohne den kann ich meine brasilianischen Kontakte nicht erreichen.");
        return;
    }

    // Toni zeigt an, dass er nachdenkt
    const thinkingId = "think-" + Date.now();
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = thinkingId;
    thinkingDiv.style = "font-size: 0.8em; color: #666; font-style: italic; margin-bottom: 10px;";
    thinkingDiv.innerText = "Toni analysiert die Situation...";
    outputContainer.prepend(thinkingDiv);

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Top-Modell für schnelle, kluge Antworten
                messages: [
                    {
                        role: "system",
                        content: "Du bist Toni, ein absoluter Fußball-Fachmann mit brasilianischem Style. Du bist der Co-Trainer von Björn. Deine Antworten sind fachlich exzellent, präzise und haben einen motivierenden, lockeren Unterton (Du-Form). Du kennst dich perfekt mit Taktiken (4-4-2, 3-4-3), Trainingseinheiten und Spielersituationen aus. Halte dich kurz und knackig."
                    },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // "Denken" entfernen und echte Antwort anzeigen
        document.getElementById(thinkingId).remove();
        toniSpeak(aiMessage);

    } catch (error) {
        console.error("KI-Fehler:", error);
        document.getElementById(thinkingId).innerText = "Fehler bei der Verbindung zu GroqCloud.";
    }
}

/**
 * Visuelle und akustische Ausgabe
 */
function toniSpeak(message) {
    if (!outputContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.style = "background: #f1f8e9; border-left: 5px solid #2e7d32; padding: 12px; margin-bottom: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);";
    msgDiv.innerHTML = `<strong style="color:#1b5e20;">Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    // Männliche Sprachausgabe
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.9;
        window.speechSynthesis.speak(utter);
    }
}

/**
 * Steuerung der Trainer-Eingaben
 */
function handleChatInput(input) {
    if (!input.trim()) return;

    // Lokale Befehle (ohne KI)
    const text = input.toLowerCase();
    if (text === "bälle" || text === "ball") {
        distributeBalls(16);
    } else if (text === "hütchen") {
        placeCones(12);
    } else {
        // Alles andere geht an die echte KI
        getToniResponse(input);
    }
}

// Begrüßung
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        toniSpeak("Sensationell, Björn! Die KI-Power ist online. Was analysieren wir heute?");
    }, 1000);
});
