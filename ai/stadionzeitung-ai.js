// =========================================
// Toni 2.0 – Stadionzeitung KI (FINALE VERSION)
// =========================================

const StadionzeitungAI = {
    async generateHeadline() {
        const prompt = `
            Erstelle eine realistische Schlagzeile für ein Vereinsmagazin.
            Stil: sachlich, professionell.
        `;

        return ToniAI.ask(prompt);
    },

    async generateTrainingReport() {
        const focus = ToniContext.getTrainingFocus();

        const prompt = `
            Erstelle einen Trainingsbericht.
            Schwerpunkt: ${focus}.
            Stil: journalistisch, realistisch.
        `;

        return ToniAI.ask(prompt);
    },

    async generatePlayerFocus(player) {
        const prompt = `
            Erstelle einen Spielerfokus für ${player.name}.
            Stil: sachlich, sportlich.
        `;

        return ToniAI.ask(prompt);
    }
};