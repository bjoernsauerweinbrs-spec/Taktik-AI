/**
 * Toni 2.0 - Die Steuerzentrale (Final Version)
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

// Erzwingt das Laden der Stimmen für die Männerstimme
let voices = [];
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;

function toniSpeak(message) {
    if (!outputContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = "toni-msg";
    msgDiv.style = "background:#f1f8e9; border-left:5px solid #2e7d32; padding:12px; margin-bottom:15px; border-radius:5px;";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.8; // Tiefe Männerstimme
        utter.rate = 1.0;
        
        // Suche gezielt nach einer männlichen Stimme
        const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'));
        if (maleVoice) utter.voice = maleVoice;
        
        window.speechSynthesis.speak(utter);
    }
}

async function getToniResponse(userInput) {
    if (!apiKey) { toniSpeak("Björn, ohne API-Key kann ich nicht arbeiten."); return; }

    // Ermittle den gewählten Trainer-Typ (Standard: Profi)
    const trainerType = localStorage.getItem('toni_type') || 'Profi';

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
                        Trainer-Stil: ${trainerType}.
                        Wenn der User eine Übung will, bewege die Spieler mit: [MOVE: Name/Nummer, X, Y].
                        X und Y sind Koordinaten von 0 bis 100.
                        Antworte fachlich brillant, motivierend und im Ginga-Style.`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // BEFEHLE AUSFÜHREN
        executeToniCommands(aiMessage);

        // Nachricht ohne die technischen Befehle anzeigen
        const cleanMsg = aiMessage.replace(/\[.*?\]/g, "").trim();
        toniSpeak(cleanMsg);

    } catch (error) {
        console.error("Fehler:", error);
    }
}

function executeToniCommands(text) {
    const moveRegex = /\[MOVE:\s*(.*?),\s*(\d+),\s*(\d+)\]/g;
    let match;
    while ((match = moveRegex.exec(text)) !== null) {
        // Dieser Aufruf geht direkt in die js/board.js, die du gerade aktualisiert hast
        if (typeof movePlayerOnBoard === "function") {
            movePlayerOnBoard(match[1].trim(), match[2], match[3]);
        }
    }
}

function handleChatInput(val) {
    if (!val.trim()) return;
    getToniResponse(val);
}
