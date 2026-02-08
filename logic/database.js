/**
 * TONI 2.0 - DATABASE (MASTER LOGISTICS UPDATE)
 * Jetzt mit Inventar-Verwaltung für die Materialkammer.
 */
window.Database = {
    players: [],
    activeMode: 'training',
    coachProfile: { name: null, verein: null, position: null, onboardingDone: false },
    videoLibrary: { /* ... (wie zuvor) */ },
    
    // NEU: Die Materialkammer (Soll-Bestand)
    inventory: {
        balls: { name: "Bälle", count: 20, icon: "fa-futbol" },
        cones: { name: "Hütchen", count: 40, icon: "fa-triangle-exclamation" },
        miniGoals: { name: "Minitore", count: 4, icon: "fa-door-open" },
        bibs: { name: "Leibchen", count: 15, icon: "fa-shirt" },
        poles: { name: "Stangen", count: 10, icon: "fa-bars" }
    },

    trainingPlan: { warmup: { desc: "", img: null }, mainPart: { desc: "", img: null }, coolDown: { desc: "", img: null }, materials: [] },
    matchPlan: { lineupImg: null, notes: "", motivation: "", opponentInfo: "", opponentTeam: "", formations: { toni: "4-4-2", trainer: "3-4-3" } },

    init() {
        const savedData = localStorage.getItem('toni_pro_db');
        const savedProfile = localStorage.getItem('toni_coach_data');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;
            // Lade Inventar oder nutze Standard
            this.inventory = parsed.inventory || this.inventory;
            this.repairPlayerData();
        } else {
            this.createDemoTeam();
        }

        if (savedProfile) this.coachProfile = JSON.parse(savedProfile);
        this.activeMode = localStorage.getItem('toni_active_mode') || 'training';
    },

    save() {
        const dataToSave = {
            players: this.players,
            trainingPlan: this.trainingPlan,
            matchPlan: this.matchPlan,
            inventory: this.inventory // Inventar mitspeichern
        };
        localStorage.setItem('toni_pro_db', JSON.stringify(dataToSave));
        localStorage.setItem('toni_coach_data', JSON.stringify(this.coachProfile));
        localStorage.setItem('toni_active_mode', this.activeMode);
    },

    // Helfer für Toni: Prüft, ob Material für eine Übung reicht
    checkMaterial(key, requiredCount) {
        const item = this.inventory[key];
        if (!item) return { available: false, count: 0 };
        return {
            available: item.count >= requiredCount,
            current: item.count,
            diff: requiredCount - item.count
        };
    },

    updateInventory(key, newCount) {
        if (this.inventory[key]) {
            this.inventory[key].count = parseInt(newCount) || 0;
            this.save();
        }
    }
    // ... restliche Funktionen (calculateRating, etc.) bleiben gleich
};
window.Database.init();
