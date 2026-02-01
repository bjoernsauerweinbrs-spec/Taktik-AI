// =========================================
// Toni 2.0 – AI Client (FINALE VERSION)
// Zentrale Schnittstelle für KI-Anfragen
// =========================================

const ToniAI = {
    async ask(prompt, context = {}) {
        console.log("ToniAI Anfrage:", prompt, context);

        // Später: Server-Route /api/ai
        // Jetzt: Demo-Antworten

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`Toni 2.0 Analyse: ${prompt}`);
            }, 300);
        });
    }
};