// =========================================
// Toni 2.0 – Analyse KI (FINALE VERSION)
// =========================================

const AnalysisAI = {
    async generateTeamAnalysis() {
        const stats = ToniContext.getTeamStats();

        const prompt = `
            Erstelle eine kurze, realistische Team-Analyse.
            Fitness: ${stats.avgFitness}
            Form: ${stats.avgForm}
            Belastung: ${stats.avgLoad}
        `;

        return ToniAI.ask(prompt);
    },

    async generatePlayerAnalysis(player) {
        const prompt = `
            Erstelle eine kurze Analyse für Spieler ${player.name}.
            Position: ${player.position}
            Nummer: ${player.number}
        `;

        return ToniAI.ask(prompt);
    }
};