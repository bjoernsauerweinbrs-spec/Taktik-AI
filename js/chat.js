/**
 * Toni 2.0 - Elite AI Engine (Fix: Male Voice & Decision Tree)
 */

let recognition;
let isListening = false;
const coachName = sessionStorage.getItem('toni_coach_name') || "Coach";

// 1. BEFEHLSEBENE (Decision Tree nach Copilot)
function processTacticalCommand(input) {
    const text = input.toLowerCase();
    
    // Altersklassen-Logik
    if (text.includes("senioren") || text.includes("u19") || text.includes("herren") || text.includes("großfeld")) {
        window.setPitch('grossfeld');
        return "Alles klar, Björn. Senioren spielen auf dem Großfeld. Ich habe das Board vorbereitet!";
    }
    if (text.includes("funino") || text.includes("u7") || text.includes("minis")) {
        window.setPitch('funino');
        return "Funino-Festival! Ich baue das Feld mit den 4 Toren auf.";
    }
    if (text.includes("kleinfeld") || text.includes("u13") || text.includes("d-jugend")) {
        window.setPitch('kleinfeld');
        return "Kleinfeld-Modus aktiviert. Das halbe Feld steht bereit.";
    }
    return null; // Kein direkter Befehl erkannt -> KI fragen
}

// 2. STIMMEN-FIX (Männlich)
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Wir suchen gezielt nach deutschen Männerstimmen
    const maleVoice = voices.find(v => 
        (v.lang.startsWith('de')) && 
        (v.name.includes('Stefan') || v.name.includes('Conrad') || v.name.includes('Klaus') || v.name.includes('Male'))
    );

    if (maleVoice) msg.voice = maleVoice;
    msg.pitch = 0.85; // Tiefere Stimme für Björns Toni
    msg.rate = 1.0;
    msg.lang = 'de-DE';
    window.speechSynthesis.speak(msg);
}

// Stimmen laden beim Start
window.speechSynthesis.onvoiceschanged = () => { console.log("Stimmen synchronisiert."); };

async function handleToniAction() {
    const inputField = document.getElementById('user-msg');
    const userInput = inputField.value.trim();
    if (!userInput) return;

    appendChatMessage('user', userInput);
    inputField.value = '';

    // Erst prüfen: Ist es ein direkter Befehl für das Spielfeld?
    const autoResponse = processTacticalCommand(userInput);
    
    if (autoResponse) {
        appendChatMessage('toni', autoResponse);
        speak(autoResponse);
        return; // Loop beenden, keine KI-Anfrage nötig!
    }

    // Wenn kein direkter Befehl: KI fragen
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('toni_key')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein Elite-Fußball-KI-Coach (Mix aus Klopp & Nagelsmann). 
                        Dein Partner ist Coach ${coachName}. Sei motivierend und direkt. 
                        Wenn du eine Altersklasse hörst, bestätige den Spielfeldtyp sofort.`
                    },
                    { role: "user", content: userInput }
                ]
            })
        });

        const data = await response.json();
        const answer = data.choices[0].message.content;
        appendChatMessage('toni', answer);
        speak(answer);
    } catch (e) {
        appendChatMessage('toni', "Verbindungsproblem, Coach!");
    }
}

// ... (Rest der Funktionen: toggleVoice, appendChatMessage bleiben gleich)
