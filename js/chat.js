// --- TONI 2.0: KI-STEUERUNG & ANALYSE ---

async function checkKIConnection() {
    const statusBadge = document.getElementById('toni-status');
    const apiKey = localStorage.getItem('api_key');
    const provider = localStorage.getItem('selected_provider');

    if (!apiKey) {
        statusBadge.innerText = "KI: Kein Key gefunden";
        statusBadge.style.color = "#f56565";
        return;
    }
    statusBadge.innerText = `KI: Bereit (${provider})`;
    statusBadge.style.color = "#48bb78";
}

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatOutput = document.getElementById('chat-output');
    const userText = userInput.value.trim();

    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    const loadingId = 'loading-' + Date.now();
    appendMessage('toni', '...', loadingId);

    // DATEN AUS DER AKTENTASCHE HOLEN
    const currentMode = document.getElementById('field-mode').value;
    const squadInfo = players.map(p => `Nr. ${p.nr}: ${p.name} (${p.pos}, ${p.rating} Sterne)`).join(', ');

    const systemPrompt = `
        Du bist Toni, ein brasilianischer Taktik-Experte. Dein Chef ist Björn.
        Verhalte dich professionell, aber mit brasilianischem Flair.
        AKTUELLER MODUS: ${currentMode}.
        KADER: ${squadInfo || 'Noch leer'}.
        
        WICHTIG: Wenn du Spieler bewegen willst, antworte am Ende mit: 
        MOVE:Nr:X:Y (X/Y 0-100).
        Zusatz: Du kannst Hütchen setzen mit: CONE:X:Y.
    `;

    try {
        const apiKey = localStorage.getItem('api_key');
        const provider = localStorage.getItem('selected_provider') || 'groq';

        let url = 'https://api.groq.com/openai/v1/chat/completions';
        let model = "llama3-70b-8192";

        if (provider === 'openai') {
            url = 'https://api.openai.com/v1/chat/completions';
            model = "gpt-4";
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userText }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) throw new Error("API-Verbindung fehlgeschlagen.");

        const data = await response.json();
        const toniAntwort = data.choices[0].message.content;

        document.getElementById(loadingId).remove();
        appendMessage('toni', toniAntwort);
        handleMoveCommands(toniAntwort);

    } catch (error) {
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        appendMessage('toni', "Funkloch, Coach! Prüf mal deinen Key. Fehler: " + error.message);
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

function handleMoveCommands(text) {
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
