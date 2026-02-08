/**
 * TONI 2.0 - DATABASE (MASTER LOGISTICS UPDATE - REPAIRED)
 * Fokus: Absturz-Fix & Arena-Trigger
 */
window.Database = {
    players: [],
    activeMode: 'training',
    coachProfile: { name: null, verein: null, position: null, onboardingDone: false },
    videoLibrary: {},
    
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
        console.log("TONI Database: Initialisierung gestartet...");
        const savedData = localStorage.getItem('toni_pro_db');
        const savedProfile = localStorage.getItem('toni_coach_data');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;
            this.inventory = parsed.inventory || this.inventory;
            
            // Reparatur-Funktion jetzt vorhanden!
            this.repairPlayerData();
        } else {
            this.createDemoTeam();
        }

        if (savedProfile) this.coachProfile = JSON.parse(savedProfile);
        this.activeMode = localStorage.getItem('toni_active_mode') || 'training';

        // DER WICHTIGSTE TEIL: Arena informieren
        setTimeout(() => {
            if (window.arena && typeof window.arena.syncFromDatabase === 'function') {
                window.arena.syncFromDatabase();
                window.arena.render(); 
                console.log("TONI Database: Arena synchronisiert.");
            }
        }, 100);
    },

    // FEHLENDE FUNKTION 1: Repariert kaputte Spieler-Datensätze
    repairPlayerData() {
        if (!this.players) return;
        this.players.forEach(p => {
            if (!p.id) p.id = Date.now() + Math.random();
            if (p.x === undefined) p.x = 100;
            if (p.y === undefined) p.y = 100;
        });
        console.log("TONI Database: Spieler-Daten bereinigt.");
    },

    // FEHLENDE FUNKTION 2: Erstellt Start-Kader, falls DB leer ist
    createDemoTeam() {
        this.players = [
            { id: 1, name: "Toni Test", pos: "ST", number: 9, x: 300, y: 200 },
            { id: 2, name: "Coach Junior", pos: "TW", number: 1, x: 50, y: 200 }
        ];
        this.save();
    },

    save() {
        const dataToSave = {
            players: this.players,
            trainingPlan: this.trainingPlan,
            matchPlan: this.matchPlan,
            inventory: this.inventory 
        };
        localStorage.setItem('toni_pro_db', JSON.stringify(dataToSave));
        localStorage.setItem('toni_coach_data', JSON.stringify(this.coachProfile));
        localStorage.setItem('toni_active_mode', this.activeMode);
    },

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
};

// Start-Befehl
window.Database.init();
