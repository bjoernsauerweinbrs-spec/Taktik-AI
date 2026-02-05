/**
 * TONI 2.0 - LLM GATEWAY (PRO)
 * Alleinige Schnittstelle zu Ollama und OpenAI.
 * Verarbeitet Anfragen und extrahiert taktische Befehle für die Arena.
 */
window.ToniGateway = {
    /**
     * Ruft das lokale Modell auf deinem MacBook ab (Standard-Pfad).
     */
    async callOllama(question, context) {
        try {
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: this.buildFinalPrompt(question, context),
                    stream: false
                })
            });
            
            if (!response.ok) throw new Error("Ollama Status: " + response.status);
            
            const data = await response.json();
            return { 
                text: data.response, 
                tacticalMove: this.extractMove(data.response),
                provider: 'Ollama'
            };
        } catch (e) {
            console.warn("ToniGateway: Ollama nicht erreichbar. Fallback erforderlich.");
            return null; 
        }
    },

    /**
     * Ruft die OpenAI Cloud-KI ab, falls Ollama offline ist oder die Qualität nicht reicht.
     */
    async callOpenAI(question, context) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return { text: "System-Info: Bitte OpenAI API-Key in den Einstellungen hinterlegen.", provider: 'Error' };
        
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {role: "system", content: "Du bist Toni, ein brasilianischer Taktik-Experte für Coach Björn. Antworte fachlich versiert."},
                        {role: "user", content: this.buildFinalPrompt(question, context)}
                    ]
                })
            });
            
            if (!response.ok) throw new Error("OpenAI Status: " + response.status);
            
            const data = await response.json();
            const content = data.choices[0].message.content;
            return { 
                text: content, 
                tacticalMove: this.extractMove(content),
                provider: 'OpenAI'
            };
        } catch (e) {
            console.error("ToniGateway: OpenAI Fehler", e);
            return { text: "Cloud-KI aktuell nicht erreichbar. Bitte Internetverbindung prüfen.", provider: 'Error' };
        }
    },

    /**
     * Hilfsfunktion: Baut den Prompt mit taktischen Anweisungen.
     */
    buildFinalPrompt(question, context) {
        return `
            Kontext: ${JSON.stringify(context)}
            Frage von Coach Björn: ${question}
            
            Anweisung: Antworte als internationaler Taktik-Experte. 
            Falls eine Verschiebung auf dem Board nötig ist, füge am Ende [MOVE: {"pos": "compact"}] oder [MOVE: {"pos": "wide"}] oder [MOVE: {"pos": "pressing"}] ein.
        `;
    },

    /**
     * Extrahiert den JSON-Befehl aus der KI-Antwort.
     */
    extractMove(text) {
        try {
            const match = text.match(/\[MOVE:\s*({.*?})\]/);
            return match ? JSON.parse(match[1]) : null;
        } catch (e) {
            console.error("ToniGateway: Fehler beim Parsen des taktischen Befehls", e);
            return null;
        }
    }
};
