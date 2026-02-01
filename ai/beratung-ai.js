// =========================================
// Toni 2.0 – Beratungs-KI (FINALE VERSION)
// =========================================

const BeratungAI = {
    async tacticalAdvice() {
        const module = ToniContext.getActiveModule();

        const prompt = `
            Gib eine taktische Empfehlung basierend auf dem aktuellen Modul: ${module}.
            Stil: kurz, professionell, Co-Trainer.
        `;

        return ToniAI.ask(prompt);
    },

    async playerAdvice(player) {
        const prompt = `
            Gib eine Empfehlung für Spieler ${player.name}.
            Stil: realistisch, sportwissenschaftlich.
        `;

        return ToniAI.ask(prompt);
    },

    async trainingAdvice() {
        const focus = ToniContext.getTrainingFocus();

        const prompt = `
            Gib eine Trainings-Empfehlung basierend auf dem Fokus: ${focus}.
        `;

        return ToniAI.ask(prompt);
    }
};