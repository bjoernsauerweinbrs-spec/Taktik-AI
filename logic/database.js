/**
 * TONI 2.0 - DATABASE (MASTER LOGISTICS, SPONSORING & BIOMETRICS)
 * Status: VOLLSTÄNDIG & ERWEITERT (Smart-Alert Ready)
 */

// 1. GLOBALER SPONSOREN-POOL
window.SponsorPool = [
    { id: 'sp_1', name: "Fly Emirates", logo: "✈️", fee: 5000, color: "#d71920" },
    { id: 'sp_2', name: "Adidas", logo: "👟", fee: 4500, color: "#000000" },
    { id: 'sp_3', name: "Sparkasse", logo: "🏦", fee: 3000, color: "#ff0000" },
    { id: 'sp_4', name: "Lokal-Hero", logo: "🍺", fee: 1500, color: "#f1c40f" }
];

window.Database = {
    players: [],
    activeMode: 'training',
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
        console.log("TONI Database: Initialisierung mit Sponsoring...");
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
            
            // FIFA-STATS (Werte schützen)
            p.rat = p.rat || 70;
            p.pac = p.pac || 70;
            p.sho = p.sho || 70;
            p.pas = p.pas || 70;
            p.dri = p.dri || 70;
            p.def = p.def || 70;
            p.phy = p.phy || 70;
            p.img = p.img || null;

            // SPONSORING & MEDIEN SLOTS
            if (p.sponsorId === undefined) p.sponsorId = null; 
            if (p.isNewspaperStar === undefined) p.isNewspaperStar = false;
            
            // --- NEU: BIOMETRISCHE DIAGNOSE-DATEN ---
            p.fat = p.fat || 11.5;      // Körperfett %
            p.weight = p.weight || 78;  // Gewicht kg
            p.muscle = p.muscle || 44;  // Muskelmasse kg
            p.water = p.water || 62;    // Wasser %
            p.sleep = p.sleep || 90;    // Schlaf-Index 0-100
            p.hrRest = p.hrRest || 50;  // Ruhepuls BPM
            p.hrv = p.hrv || 85;        // HRV ms
            p.vo2 = p.vo2 || 60;        // VO2 Max

            // POSITIONEN (Auf die Bank)
            if (p.x === undefined) p.x = 100;
            if (p.y === undefined) p.y = 550; 

            // TEAM ZUWEISUNG
            p.assignment = p.assignment || 'both';
        });
        this.save();
        console.log("TONI Database: Daten-Reparatur & Biometrie-Check OK.");
    },

    createDemoTeam() {
        this.players = [
            { 
                id: 1, name: "Max Master", pos: "ST", number: 9, x: 300, y: 550, 
                rat: 85, pac: 90, sho: 88, pas: 75, dri: 82, def: 30, phy: 75, 
                assignment: 'both', sponsorId: 'sp_1', isNewspaperStar: true,
                fat: 10.5, sleep: 95, hrRest: 45
            },
            { 
                id: 2, name: "Finn Flügel", pos: "LM", number: 7, x: 100, y: 550, 
                rat: 80, pac: 92, sho: 75, pas: 78, dri: 85, def: 45, phy: 65, 
                assignment: 'both', sponsorId: null, isNewspaperStar: false,
                fat: 14.2, sleep: 65, hrRest: 62 // Beispiel für Smart-Alert Trigger
            }
        ];
        this.save();
    },

    updatePlayer(id, key, value) {
        const index = this.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.players[index][key] = value;
            this.save();
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
