window.ToniGateway = {
    askToni: async function(question) {
        const context = this.buildContext();
        window.ToniCore.updateStatus("PRÜFE LOKALES GEHIRN...", "var(--accent-orange)");

        // 1. VERSUCH: OLLAMA (mit hartem Timeout)
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 2000); // 2 Sek. Zeit für Ollama

            const res = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                signal: controller.signal,
                body: JSON.stringify({ model: 'gemma', prompt: question, stream: false })
            });
            clearTimeout(timeout);
            if (res.ok) {
                const data = await res.json();
                return { text: data.response, provider: 'Ollama' };
            }
        } catch (e) {
            console.log("Ollama offline oder zu langsam. Nutze OpenAI.");
        }

        // 2. VERSUCH: OPENAI (Fallback)
        window.ToniCore.updateStatus("NUTZE CLOUD-WISSEN...", "var(--accent-gold)");
        return await this.callOpenAI(question, context);
    },
    
    callOpenAI: async function(prompt, ctx) {
        const key = localStorage.getItem('toni_api_key');
        if (!key) return { text: "Bitte API-Key in den Einstellungen hinterlegen!", error: true };
        
        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{role: "system", content: "Du bist Toni."}, {role: "user", content: prompt}]
                })
            });
            const data = await res.json();
            return { text: data.choices[0].message.content, provider: 'OpenAI' };
        } catch (e) {
            return { text: "Beide KI-Dienste offline.", error: true };
        }
    },
    
    buildContext: function() {
        const p = window.ToniDB.getPlayers().filter(p => p.isPresent && p.team === 'home');
        return `Kader: ${p.map(s => s.name).join(", ")}.`;
    }
};
