/**
 * TONI 2.0 - DAS UNIVERSAL-GEHIRN
 * Unterstützt Groq, OpenAI und Gemini.
 * Liest automatisch die Aktentasche und den Spielfeld-Modus aus.
 */

async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const chatOutput = document.getElementById('chat-output');
    const userText = userInput.value.trim();

    if (!userText) return;

    // 1. Nachricht im Chat anzeigen
    appendMessage('user', userText);
    userInput.value = '';

    // 2. Lade-Animation (Toni überlegt...)
    const loadingId = 'loading-' + Date.now();
    appendMessage('toni', '...', loadingId);

    // 3. DATEN-CHECK: Was weiß die Aktentasche?
    const currentMode = document.getElementById('field-mode').value;
    const squadInfo = players.map(p => `Nr. ${p.nr}: ${p.name} (${p.pos})`).join(', ');
    
    // 4. DER SYSTEM-PROMPT (Das Briefing für die KI)
    const systemPrompt = `
        Du bist Toni, ein brasilianischer Taktik-Experte. Dein Chef ist Björn.
        Verhalte dich professionell, aber mit brasilianischem Flair.
        AKTUELLER MODUS: ${currentMode === 'mode-funino' ? 'FUNINO (4 Tore)' : 'MATCH (2 Tore)'}.
        KADER IN DER AKTENTASCHE: ${squadInfo || 'Der Kader ist noch leer'}.

        DEINE AUFGABE: Analysiere Björns Fragen. Wenn du Spieler bewegen willst, 
        nutze am Ende deiner Antwort das Format: MOVE:Nr:X:Y (X, Y von 0-100).
        Beispiel: MOVE:10:50:50 stellt die Nr. 10 exakt in den Mittelpunkt.
    `;

    try {
        const apiKey = localStorage.getItem('api_key');
        const provider = localStorage.getItem('selected_provider') || 'groq'; // Standard: Groq

        if (!apiKey) throw new Error("Kein API-Key hinterlegt!");

        let response;

        // 5. PROVIDER-LOGIK (Hier entscheidet sich, welcher Motor läuft)
        if (provider === 'groq' || provider === 'openai') {
            const url = (provider === 'groq') 
                ? 'https://api.groq.com/openai/v1/chat/completions' 
                : 'https://api.openai.com/v1/chat/completions';
            
            const model = (provider === 'groq') ? 'llama3-70b-8192' : 'gpt-4';

            response = await fetch(url, {
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
        } 
        else if (provider === 'gemini') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: systemPrompt + "\n\nAnfrage: " + userText }]
                    }]
                })
            });
        }

        const data = await response.json();
        
        // Antwort-Extraktion je nach Anbieter
        let toniAntwort = "";
        if (provider === 'gemini') {
            toniAntwort = data.candidates[0].content.parts[0].text;
        } else {
            toniAntwort = data.choices[0].message.content;
        }

        // 6. ANTWORT DARSTELLEN & BEWEGUNG AUSFÜHREN
        document.getElementById(loadingId).remove();
        appendMessage('toni', toniAntwort);
        handleMoveCommands(toniAntwort);

    } catch (error) {
        if(document.getElementById(loadingId)) document.getElementById(loadingId).remove();
        appendMessage('toni', "Funkloch, Manager Björn! " + error.message);
    }
}

// --- HILFSFUNKTIONEN ---

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
                chip.style.transition = "all 0.8s ease-in-out";
                chip.style.left = x + '%';
                chip.style.top = y + '%';
            }
        });
    }
}
