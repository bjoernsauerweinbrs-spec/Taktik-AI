/**
 * Toni 2.0 - Elite AI Engine
 * Fokus: Taktik-Analyse, BMI-Auswertung & Performance
 */

async function handleToniAction() {
    const inputField = document.getElementById('user-msg');
    const text = inputField.value.trim();
    if (!text) return;

    // Nachricht im Chat anzeigen
    appendChatMessage('user', text);
    inputField.value = '';

    const history = document.getElementById('chat-history');
    const thinking = document.createElement('div');
    thinking.className = 'msg toni-msg';
    thinking.innerHTML = "<em>Toni greift auf globale Taktik-Datenbanken zu...</em>";
    history.appendChild(thinking);
    history.scrollTop = history.scrollHeight;

    // Wir ziehen die aktuellen Kader-Daten für Toni (inkl. BMI)
    const squadContext = squad.map(p => {
        const bmi = (p.weight / (p.height * p.height)).toFixed(1);
        return `${p.name} (#${p.nr}, Pos: ${p.pos}, BMI: ${bmi}, Status: ${p.status})`;
    }).join(", ");

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
                        content: `Du bist Toni, ein Elite-Fußball-KI-Coach. Dein Wissen basiert auf weltweiten Analysen, Big Data und moderner Sportwissenschaft.
                        Dein Stil: Hochprofessionell, präzise, analytisch. Kein Smalltalk über "Ginga" oder Klischees.
                        Du kennst den aktuellen Kader: ${squadContext}.
                        Wenn der Trainer nach Ernährung fragt und Daten fehlen, gib einen Standard-Profi-Plan aus. Wenn Größe/Gewicht da sind, beziehe den BMI ein.
                        Du nennst deinen Partner beim Namen (Björn) oder sagst 'Trainer'.`
                    },
                    { role: "user", content: text }
                ],
                temperature: 0.5
            })
        });

        const data = await response.json();
        const toniText = data.choices[0].message.content;

        thinking.remove();
        appendChatMessage('toni', toniText);
        
        // Elite-Sprachausgabe (Tiefere, professionelle Stimme)
        const speech = new SpeechSynthesisUtterance(toniText);
        speech.lang = 'de-DE';
        speech.pitch = 0.85; 
        speech.rate = 1.0;
        window.speechSynthesis.speak(speech);

    } catch (error) {
        thinking.innerHTML = "Fehler bei der Datenabfrage. Bitte API-Key prüfen.";
    }
}

function appendChatMessage(role, text) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.style = `
        padding: 12px; 
        border-radius: 8px; 
        margin-bottom: 10px; 
        font-size: 14px;
        line-height: 1.5;
        ${role === 'toni' ? 'background: #1c2128; border-left: 4px solid #2ecc71;' : 'background: #238636; align-self: flex-end; color: white;'}
    `;
    div.innerText = text;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}
