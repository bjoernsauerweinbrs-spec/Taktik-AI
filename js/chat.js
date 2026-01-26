/**
 * Toni 2.0 - Stabile Steuerung & Sprachausgabe
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

// --- Sprachausgabe (Tief & Männlich) ---
let voices = [];
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function toniSpeak(message) {
    if (!outputContainer) return;

    // Nachricht im Chat anzeigen
    const msgDiv = document.createElement('div');
    msgDiv.className = "toni-msg";
    msgDiv.style = "background:#f9f9f9; border-left:4px solid #2e7d32; padding:10px; margin-bottom:10px; border-radius:4px; font-family: sans-serif;";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    // Audio-Ausgabe (Stefan oder Google Deutsch)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.8; // Erzeugt eine tiefere Stimme
        
        const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'));
        if (maleVoice) utter.voice = maleVoice;
        
        window.speechSynthesis.speak(utter);
    }
}

// --- Chat-Logik ---
async function getToniResponse(userInput) {
    if (!apiKey) {
        toniSpeak("Björn, ich benötige den API-Key für die Analyse.");
        return;
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein erfahrener Fußballfachmann. 
                        Du kannst Spieler auf dem Board bewegen mit: [MOVE: Name, X, Y]. 
                        X und Y sind Werte von 0-100. 
                        Antworte fachlich fundiert, motivierend und kurz.`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Befehl ausführen (z.B. Spieler schieben)
        const moveRegex = /\[MOVE:\s*(.*?),\s*(\d+),\s*(\d+)\]/g;
        let match;
        while ((match = moveRegex.exec(aiMessage)) !== null) {
            if (typeof movePlayerOnBoard === 'function') {
                movePlayerOnBoard(match[1].trim(), match[2], match[3]);
            }
        }

        // Text sprechen (Befehle aus dem Audio entfernen)
        const cleanMsg = aiMessage.replace(/\[.*?\]/g, "").trim();
        toniSpeak(cleanMsg);

    } catch (error) {
        console.error("Fehler im Chat:", error);
    }
}
