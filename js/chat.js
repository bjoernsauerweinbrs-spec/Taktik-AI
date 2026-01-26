/**
 * Toni 2.0 - Chat & Voice Engine (Stabil)
 */

const outputContainer = document.getElementById('toni-output');
const apiKey = sessionStorage.getItem('groq_api_key');

// Stimmen-Management für die Männerstimme
let voices = [];
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

function toniSpeak(message) {
    if (!outputContainer) return;
    
    // Visuelle Nachricht im Chat
    const msgDiv = document.createElement('div');
    msgDiv.className = "toni-msg";
    msgDiv.style = "background:#e8f5e9; border-left:5px solid #2e7d32; padding:10px; margin-bottom:10px; border-radius:4px; font-family: sans-serif;";
    msgDiv.innerHTML = `<strong>Toni:</strong> ${message}`;
    outputContainer.prepend(msgDiv);

    // Sprachausgabe (Männerstimme erzwingen)
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'de-DE';
        utter.pitch = 0.8; // Tieferer Ton
        utter.rate = 1.0;
        
        // Suche nach einer männlichen Stimme (Stefan, Google oder Microsoft)
        const maleVoice = voices.find(v => v.name.includes('Stefan') || v.name.includes('Google Deutsch') || v.name.includes('Male'));
        if (maleVoice) utter.voice = maleVoice;
        
        window.speechSynthesis.speak(utter);
    }
}

async function getToniResponse(userInput) {
    if (!apiKey) {
        toniSpeak("Björn, ich brauche den API-Key, um taktisch analysieren zu können.");
        return;
    }

    // Welchen Stil hat Björn gewählt? (Standard: Profi)
    const style = localStorage.getItem('toni_type') || 'Profi';

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
                        Dein aktueller Coaching-Stil: ${style}.
                        Du kannst Spieler bewegen mit: [MOVE: Name/Nummer, X, Y]. 
                        X und Y sind 0-100. Antworte immer fachlich fundiert und motivierend.`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // 1. Befehle ans Board senden
        executeToniCommands(aiMessage);

        // 2. Text ohne Befehlsklammern sprechen/anzeigen
        const cleanMsg = aiMessage.replace(/\[.*?\]/g, "").trim();
        toniSpeak(cleanMsg);

    } catch (error) {
        console.error("Chat Fehler:", error);
    }
}

function executeToniCommands(text) {
    const moveRegex = /\[MOVE:\s*(.*?),\s*(\d+),\s*(\d+)\]/g;
    let match;
    while ((match = moveRegex.exec(text)) !== null) {
        if (typeof movePlayerOnBoard === "function") {
            movePlayerOnBoard(match[1].trim(), match[2], match[3]);
        }
    }
}
