/**
 * TONI 2.0 - DATABASE (MASTER LOGISTICS UPDATE - REPAIRED)
 * Fokus: Erweiterung für FIFA-Stats & Modus-Logik
 * Stand: 14:00 Uhr Recovery
 */
window.Database = {
    players: [],
    activeMode: 'training', // 'training' oder 'match'
    coachProfile: { name: null, verein: null, position: null, onboardingDone: false },
    
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
        const savedMode = localStorage.getItem('toni_active_mode');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;
            this.inventory = parsed.inventory || this.inventory;
            
            this.repairPlayerData();
        } else {
            this.createDemoTeam();
        }

        if (savedProfile) this.coachProfile = JSON.parse(savedProfile);
        this.activeMode = savedMode || 'training';

        setTimeout(() => {
            if (window.arena && typeof window.arena.syncFromDatabase === 'function') {
                window.arena.syncFromDatabase();
            }
        }, 150);
    },

    repairPlayerData() {
        if (!this.players) return;
        this.players.forEach(p => {
            if (!p.id) p.id = Date.now() + Math.random();
            // Sicherstellen, dass alle FIFA-Stats existieren
            p.rat = p.rat || 70;
            p.pac = p.pac || 70;
            p.sho = p.sho || 70;
            p.pas = p.pas || 70;
            p.dri = p.dri || 70;
            p.def = p.def || 70;
            p.phy = p.phy || 70;
            p.img = p.img || null;
            // Standard-Zuweisung
            p.assignment = p.assignment || 'both'; // 'both', 'training' (Leibchen), 'match' (Ersatz), 'none'
            if (p.x === undefined) p.x = 100;
            if (p.y === undefined) p.y = 500; // Start auf der Bank (unten)
        });
        this.save();
    },

    createDemoTeam() {
        this.players = [
            { id: 1, name: "Max Master", pos: "ST", number: 9, x: 300, y: 550, rat: 85, pac: 90, sho: 88, pas: 75, dri: 82, def: 30, phy: 75, assignment: 'both' },
            { id: 2, name: "Finn Flügel", pos: "LM", number: 7, x: 100, y: 550, rat: 80, pac: 92, sho: 75, pas: 78, dri: 85, def: 45, phy: 65, assignment: 'both' }
        ];
        this.save();
    },

    updatePlayer(id, key, value) {
        const index = this.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.players[index][key] = value;
            this.save();
            // Signal an Arena, falls sich Position oder Status geändert hat
            if (window.arena && typeof window.arena.syncFromDatabase === 'function') {
                window.arena.syncFromDatabase();
            }
        }
    },

    setMode(newMode) {
        this.activeMode = newMode;
        this.save();
        if (window.arena && typeof window.arena.syncFromDatabase === 'function') {
            window.arena.syncFromDatabase();
        }
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
    }
};

window.Database.init();
