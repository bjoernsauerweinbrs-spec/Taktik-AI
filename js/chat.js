// --- TONI ELITE 2026: KI-STEUERUNG & FUNK-FIX ---

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userText = userInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    const apiKey = localStorage.getItem('api_key');
    // Wichtig: Wir nutzen das aktuellste Modell, um das Decommissioned-Problem zu lösen
    const modelId = "llama-3.3-70b-versatile"; 

    if (!apiKey || apiKey.length < 10) {
        appendMessage('toni', "❌ Coach, ich finde keinen gültigen Key! Bitte geh kurz zur Startseite und log dich neu ein.");
        return;
    }

    const loadingId = 'loading-' + Date.now();
    appendMessage('toni', 'Toni analysiert... 🇧🇷', loadingId);

    // Kontext für Toni sammeln
    const currentMode = document.getElementById('field-mode').value;
    const activeTab = document.querySelector('.tab-btn.active')?.innerText || 'Kader';
    const squadInfo = players.map(p => `${p.name} (Nr. ${p.nr}, ${p.rating} Sterne, ${p.weight || 'kein'} kg)`).join(', ');

    const systemPrompt = `
        Du bist Toni, ein brasilianischer Elite-Fußballtrainer. Dein Chef ist Björn.
        Verhalte dich wie ein absoluter Fachmann für Taktik, Technik und Sport-Ernährung.
        AKTUELLER BEREICH: ${activeTab}.
        SPIELFELD: ${currentMode}.
        KADER: ${squadInfo || 'Noch leer'}.
        
        DEINE AUFGABEN:
        1. Gib präzise Tipps zur Beidfüßigkeit und Bewegungsabläufen (z.B. Übersteiger).
        2. Wenn Björn im Ernährungs-Tab ist, schlage gesunde 'Samba-Rezepte' vor.
        3. Nutze MOVE:Nr:X:Y am Ende, um Spieler zu verschieben.
        4. Bleib motivierend, professionell und brasilianisch im Stil.
    `;

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userText }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();

        if (data.error) throw new Error(data.error.message);

        const toniAntwort = data.choices[0].message.content;
        appendMessage('toni', toniAntwort);
        
        // Bewegungen auf dem Board ausführen
        handleToniMoves(toniAntwort);

    } catch (error) {
        const loader = document.getElementById(loadingId);
        if (loader) loader.remove();
        appendMessage('toni', "📡 Funkloch behoben, aber API meldet: " + error.message);
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
            if (chip.querySelector('.nr').innerText === nr) {
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
