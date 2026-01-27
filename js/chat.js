async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userText = userInput.value.trim();
    if (!userText) return;

    appendMessage('user', userText);
    userInput.value = '';

    // Diagnose-Meldung
    appendMessage('toni', 'Prüfe Verbindung... 📡');

    try {
        const apiKey = localStorage.getItem('api_key');
        const provider = localStorage.getItem('selected_provider') || 'groq';

        if (!apiKey || apiKey.length < 5) {
            throw new Error("API-Key fehlt oder ist zu kurz! Bitte neu einloggen.");
        }

        appendMessage('toni', `Verbindung zu ${provider.toUpperCase()} wird aufgebaut...`);

        // Wir testen hier spezifisch die Groq-Verbindung
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Kleineres Modell zum Testen
                messages: [{ role: "user", content: "Hallo" }],
                max_tokens: 10
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("KI-Fehler:", errorData);
            throw new Error(`Server meldet: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        appendMessage('toni', "✅ VERBINDUNG STEHT! Toni ist bereit. Antwort: " + data.choices[0].message.content);

    } catch (error) {
        appendMessage('toni', "❌ FEHLER GEFUNDEN: " + error.message);
        console.error("Detaillierter Fehler:", error);
    }
}

function appendMessage(sender, text) {
    const chatOutput = document.getElementById('chat-output');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-msg`;
    msgDiv.innerText = text;
    chatOutput.appendChild(msgDiv);
}
