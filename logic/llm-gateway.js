/**
 * TONI 2.0 - LLM GATEWAY
 * Alleinige Schnittstelle zu Ollama und OpenAI.
 */
window.ToniGateway = {
    async callOllama(question, context) {
        try {
            // Wir nutzen den Pfad, der bei dir funktioniert hat
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: `Du bist Toni. Kontext: ${JSON.stringify(context)}. Frage: ${question}`,
                    stream: false
                })
            });
            if (!response.ok) throw new Error();
            const data = await response.json();
            return { text: data.response, tacticalMove: this.extractMove(data.response) };
        } catch (e) {
            console.error("Ollama offline");
            return null; 
        }
    },

    async callOpenAI(question, context) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return { text: "Kein API-Key hinterlegt." };
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {role: "system", content: "Du bist Toni, ein brasilianischer Taktik-Experte."},
                        {role: "user", content: `Kontext: ${JSON.stringify(context)}. Frage: ${question}`}
                    ]
                })
            });
            const data = await response.json();
            const content = data.choices[0].message.content;
            return { text: content, tacticalMove: this.extractMove(content) };
        } catch (e) {
            return { text: "Cloud-KI Fehler." };
        }
    },

    extractMove(text) {
        const match = text.match(/\[MOVE:\s*({.*?})\]/);
        return match ? JSON.parse(match[1]) : null;
    }
};
