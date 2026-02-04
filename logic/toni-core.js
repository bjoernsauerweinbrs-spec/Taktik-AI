/**
     * OLLAMA ABFRAGE - OPTIMIERT FÜR MACOS & GITHUB PAGES
     * Versucht die Verbindung auch bei strengen Browser-Sicherheitsregeln.
     */
    queryOllama: async function(prompt) {
        try {
            // Wir nutzen die IP 127.0.0.1 statt 'localhost', da Macs das oft stabiler auflösen
            const response = await fetch('http://127.0.0.1:11434/api/generate', {
                method: 'POST',
                // Wir senden es als 'text/plain', um die 'Preflight'-Sicherheitsprüfung des Browsers zu vereinfachen
                headers: { 'Content-Type': 'text/plain' }, 
                body: JSON.stringify({
                    model: 'gemma', 
                    prompt: `Antworte als Fußball-Trainer Toni kurz auf Deutsch: ${prompt}`,
                    stream: false
                })
            });

            if (!response.ok) throw new Error("Verbindung verweigert");

            const data = await response.json();
            
            // Schutz vor 'undefined': Wir prüfen alle möglichen Felder, in denen die Antwort stecken könnte
            const answer = data.response || (data.message ? data.message.content : null) || "Analyse bereit, Coach.";
            
            this.finalizeResponse(answer);

        } catch (e) {
            console.error("Mac-Connect-Error:", e);
            // Klare Fehlermeldung im Chat, wenn die Verbindung blockiert wird
            this.handleError("COACH-HINWEIS: Verbindung zu Ollama blockiert. Bitte Chrome-Schloss -> Website-Einstellungen -> Unsichere Inhalte auf 'Zulassen' stellen.");
        }
    },
