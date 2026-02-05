/**
 * TONI 2.0 - CORE ENGINE (RESTORATION UPDATE)
 * Stellt die ursprüngliche, funktionierende Verbindung wieder her.
 */
window.ToniCore = {
    isProcessing: false,

    processMessage: async function(text) {
        if (!text || this.isProcessing) return;
        this.isProcessing = true;
        
        this.updateStatus("TONI DENKT NACH...", "var(--accent-orange)");
        this.addUserMessage(text);

        const context = this.getBoardContext();
        
        // Direkte Abfrage ohne Terminal-Umwege
        try {
            let response = await this.queryOllama(text, context);
            
            // Falls Ollama nicht reagiert (Backup-Sicherung)
            if (!response) {
                response = await this.queryOpenAI(text, context);
            }

            this.finalizeResponse(response);
        } catch (e) {
            console.error("Verbindungsfehler", e);
            this.finalizeResponse("Coach, ich habe ein Problem mit der Leitung. Prüfe bitte die Verbindung.");
        }
        this.finishProcess();
    },

    queryOllama: async function(prompt, context) {
        try {
            // Wir nutzen wieder den direkten API-Pfad, der bei dir funktioniert hat
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: `Du bist Toni, brasilianischer Taktik-Experte. Kontext: ${context}. Björn fragt: ${prompt}`,
                    stream: false
                })
            });
            const data = await response.json();
            return data.response;
        } catch (e) { 
            return null; 
        }
    },

    getBoardContext: function() {
        const squad = window.ToniDB ? window.ToniDB.getPlayers() : [];
        const active = squad.filter(p => p.isPresent).map(p => p.name).join(", ");
        return `Anwesende Spieler: ${active}. Modus: ${window.arena?.pitchMode || 'pro'}.`;
    },

    // ... (queryOpenAI, addUserMessage, finalizeResponse bleiben wie besprochen)
    finalizeResponse: function(answer) {
        const container = document.getElementById('chat-messages');
        if(container) {
            container.innerHTML += `<div style="margin-bottom:15px; color:#fff;"><b>Toni:</b> ${answer}</div>`;
            container.scrollTop = container.scrollHeight;
        }
        if(window.ToniTTS) ToniTTS.speak(answer, "warm");
    },
    
    updateStatus: function(text, color) {
        const el = document.getElementById('toni-status-text');
        if(el) { el.innerText = text; el.style.color = color; }
    },

    finishProcess: function() {
        this.isProcessing = false;
        this.updateStatus("BEREIT", "var(--neon-green)");
    }
};
