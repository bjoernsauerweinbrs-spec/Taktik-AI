/**
 * Toni 2.0 - KI Engine
 * Kommunikation mit Groq & Board-Interaktion
 */

async function handleToniAction() {
    const userInput = document.getElementById('user-msg');
    const chatHistory = document.getElementById('chat-history');
    const text = userInput.value.trim();

    if (!text) return;

    // 1. User Nachricht anzeigen
    appendMessage('user', text);
    userInput.value = '';

    // 2. Board-Zustand scannen (Was sieht Toni?)
    const boardData = typeof getBoardState === 'function' ? getBoardState() : "Keine Daten";
    const trainerName = sessionStorage.getItem('toni_name') || 'Coach';

    // 3. Anfrage an die KI (Groq Cloud)
    try {
        const apiKey = sessionStorage.getItem('toni_key');
        if (!apiKey) throw new Error("API-Key fehlt!");

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `Du bist Toni, ein Elite-Fußballtrainer mit brasilianischem Ginga-Style. 
                        Du arbeitest für den Trainer ${trainerName}. 
                        Deine Aufgabe: Taktik-Analyse auf Profi-Niveau. 
                        
                        REGELN:
                        1. Nutze Fachbegriffe (Halbräume, Deckungsschatten, Verschieben).
                        2. Wenn du Spieler bewegen willst, schreibe am Ende deiner Antwort: COMMAND_MOVE(id, x, y).
                        3. Wenn du einen Passweg vorschlägst, schreibe: COMMAND_PASS(id1, id2).
                        4. Der aktuelle Modus ist 11v11 (Taktik) oder Training.
                        
                        AKTUELLER BOARD-ZUSTAND: ${boardData}`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.6
            })
        });

        const data = await response.json();
        let toniAnswer = data.choices[0].message.content;

        // 4. Befehle aus dem Text extrahieren und ausführen
        processToniCommands(toniAnswer);

        // 5. Toni Nachricht anzeigen (Befehle für den User ausblenden)
        const cleanAnswer = toniAnswer.replace(/COMMAND_.*?\(.*?\)/g, "").trim();
        appendMessage('toni', cleanAnswer);
        
        // Sprachausgabe
        speakToni(cleanAnswer);

    } catch (error) {
        console.error("Toni Error:", error);
        appendMessage('toni', "Fehler bei der Taktik-Analyse. Prüfe den API-Key.");
    }
}

function appendMessage(role, text) {
    const container = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

/**
 * Verarbeitet die taktischen Befehle der KI
 */
function processToniCommands(text) {
    // Beispiel: COMMAND_MOVE(p-blue-4, 500, 300)
    const moveRegex = /COMMAND_MOVE\((.*?),\s*(\d+),\s*(\d+)\)/g;
    let match;

    while ((match = moveRegex.exec(text)) !== null) {
        const id = match[1].trim();
        const x = parseInt(match[2]);
        const y = parseInt(match[3]);
        
        if (typeof animateMove === 'function') {
            setTimeout(() => {
                animateMove(id, x, y);
            }, 500);
        }
    }
}

function speakToni(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'de-DE';
    msg.pitch = 0.8; // Männlichere, tiefere Stimme
    window.speechSynthesis.speak(msg);
}
