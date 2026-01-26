/**
 * Toni 2.0 - Die Steuerzentrale (Finales Update)
 * Funktionen: Sprachausgabe (Männlich), Trainer-Stile, MOVE & LINE Befehle
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

// --- Sprach-Management ---
let voices = [];
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function toniSpeak(message) {
    if (!outputContainer) return;

    // Chat-Blase erstellen
    const msgDiv = document.createElement('div');
    msgDiv.className = "toni-msg";
    msgDiv.style = "background:#e8f5e9; border-left:5px solid #2e7d32; padding:12px; margin-bottom:15px; border-radius:5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    // Audio-Ausgabe (Erzwinge tiefe Männerstimme)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.8; 
        utter.rate = 1.0;
        
        const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'));
        if (maleVoice) utter.voice = maleVoice;
        
        window.speechSynthesis.speak(utter);
    }
}

// --- KI-Kommunikation ---
async function getToniResponse(userInput) {
    if (!apiKey) {
        toniSpeak("Björn, ohne API-Key kann ich keine Taktik-Analyse durchführen.");
        return;
    }

    // Trainer-Stil ermitteln
    const selectedType = localStorage.getItem('toni_type') || 'Profi';
    const typeInstructions = {
        'Kinder': 'Du bist ein geduldiger Kindertrainer. Erkläre Grundlagen (Passspiel, Standbein) sehr einfach. Sei extrem lobend.',
        'Amateur': 'Du bist ein motivierender Coach mit Ginga-Spirit. Sei locker, humorvoll und gib Björn oft Sonderlob für seine Arbeit.',
        'Profi': 'Du bist ein High-End-Analytiker (Stil Nagelsmann/Klopp). Nutze Fachbegriffe wie Halbräume, asymmetrisches Verschieben und Gegenpressing.'
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein hochintelligenter Fußballfachmann. 
                        Stil: ${typeInstructions[selectedType]}.
                        Bediene das Board mit:
                        1. [MOVE: Name/Nr, X, Y] - Spieler bewegen (X/Y 0-100)
                        2. [LINE: X1, Y1, X2, Y2, type] - type kann 'run' (rot) oder 'pass' (blau/gestrichelt) sein.
                        Antworte immer fachlich brillant und motivierend.`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Befehle extrahieren und ausführen
        processCommands(aiMessage);

        // Text bereinigen (Befehle entfernen) und sprechen
        const cleanMsg = aiMessage.replace(/\[.*?\]/g, "").trim();
        toniSpeak(cleanMsg);

    } catch (error) {
        console.error("KI-Fehler:", error);
    }
}

// --- Befehls-Verarbeitung ---
function processCommands(text) {
    // 1. MOVE-Befehle
    const moveRegex = /\[MOVE:\s*(.*?),\s*(\d+),\s*(\d+)\]/g;
    let moveMatch;
    while ((moveMatch = moveRegex.exec(text)) !== null) {
        if (typeof movePlayerOnBoard === "function") {
            movePlayerOnBoard(moveMatch[1].trim(), moveMatch[2], moveMatch[3]);
        }
    }

    // 2. LINE-Befehle (Pfeile/Laufwege)
    const lineRegex = /\[LINE:\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(.*?)\]/g;
    let lineMatch;
    while ((lineMatch = lineRegex.exec(text)) !== null) {
        if (typeof drawTacticalLine === "function") {
            drawTacticalLine(lineMatch[1], lineMatch[2], lineMatch[3], lineMatch[4], lineMatch[5].trim());
        }
    }
}
