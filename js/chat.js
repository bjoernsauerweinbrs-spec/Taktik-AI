// --- TONI 2.0: KI-STEUERUNG & FUNK-FIX ---

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userText = userInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    // Lade Key und Provider
    const apiKey = localStorage.getItem('api_key');
    const provider = localStorage.getItem('selected_provider') || 'groq';

    if (!apiKey || apiKey.length < 10) {
        appendMessage('toni', "❌ Coach, ich finde keinen gültigen Key! Bitte geh zurück zur Startseite und log dich neu ein.");
        return;
    }

    const loadingId = 'loading-' + Date.now();
    appendMessage('toni', 'Toni denkt nach... 🇧🇷', loadingId);

    // Hol aktuelle Daten für Toni
    const currentMode = document.getElementById('field-mode').value;
    const squadInfo = players.map(p => `${p.name} (Nr. ${p.nr}, ${p.rating} Sterne)`).join(', ');

    const systemPrompt = `
        Du bist Toni, ein brasilianischer Fußball-Fachmann. Dein Chef ist Björn.
        Antworte immer mit brasilianischem Flair. 
        AKTUELLER SPIELFELD-MODUS: ${currentMode}.
        DEIN KADER: ${squadInfo || 'Noch keine Spieler in der Aktentasche'}.
        
        Wenn Björn dich bittet, Spieler zu bewegen, nutze am Ende deiner Antwort:
        MOVE:Nr:X:Y (X und Y sind Prozentwerte 0-100).
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userText }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        // Entferne Lade-Animation
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const toniAntwort = data.choices[0].message.content;
        appendMessage('toni', toniAntwort);
        
        // Verarbeite Bewegungs-Befehle
        handleToniMoves(toniAntwort);

    } catch (error) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        appendMessage('toni', "📡 Funkloch, Manager! Fehler: " + error.message);
        console.error("KI Fehler:", error);
    }
}

function handleToniMoves(text) {
    const moveRegex = /MOVE:(\d+):(\d+):(\d+)/g;
    let match;
    while ((match = moveRegex.exec(text)) !== null) {
        const nr = match[1];
        const x = match[2];
        const y = match[3];
        
        const chips = document.querySelectorAll('.player-chip');
        chips.forEach(chip => {
            if (chip.innerText === nr) {
                chip.style.transition = "all 1s ease-in-out";
                chip.style.left = x + '%';
                chip.style.top = y + '%';
            }
        });
    }
}

function appendMessage(sender, text, id = null) {
    const chatOutput = document.getElementById('chat-output');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-msg`;
    if (id) msgDiv.id = id;
    msgDiv.innerText = text;
    chatOutput.appendChild(msgDiv);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}
