/**
 * TONI 2.0 - DATABASE (RECOVERY & ELITE UPDATE)
 * Kaderplanung, automatisches Rating & Modus-Filterung
 */
window.Database = {
    players: [],
    activeMode: 'training', // 'training' oder 'match'

    // Datenspeicher für die Einsatz-Mappen
    trainingPlan: {
        warmup: { desc: "", img: null },
        mainPart: { desc: "", img: null },
        coolDown: { desc: "", img: null },
        materials: [] 
    },
    matchPlan: {
        lineupImg: null, 
        notes: "",
        motivation: "",
        opponentInfo: "Keine Daten vorhanden. KI-Analyse starten?",
        opponentTeam: ""
    },

    init() {
        const savedData = localStorage.getItem('toni_pro_db');
        const savedMode = localStorage.getItem('toni_active_mode');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;

            // REPARATUR-LOGIK: Falls Spieler da sind, aber Stats oder Nummern fehlen
            if (this.players.length > 0) {
                this.repairPlayerData();
            } else {
                this.createDemoTeam();
            }
        } else {
            // Falls gar nichts da ist -> Neuanlage
            this.createDemoTeam();
        }
        
        if (savedMode) {
            this.activeMode = savedMode;
        }
    },

    // Stellt sicher, dass jeder Spieler alle FIFA-Stats, IDs und RÜCKENNUMMERN hat
    repairPlayerData() {
        let changed = false;
        this.players.forEach((p, index) => {
            if (p.dri === undefined) { p.dri = 75; changed = true; }
            if (p.def === undefined) { p.def = 50; changed = true; }
            if (p.phy === undefined) { p.phy = 70; changed = true; }
            if (p.number === undefined) { p.number = p.id || (index + 1); changed = true; } // Rückennummer nachpflegen
            if (!p.rat) { p.rat = this.calculateRating(p); changed = true; }
        });
        if (changed) this.save();
    },

    save() {
        const dataToSave = {
            players: this.players,
            trainingPlan: this.trainingPlan,
            matchPlan: this.matchPlan
        };
        localStorage.setItem('toni_pro_db', JSON.stringify(dataToSave));
        localStorage.setItem('toni_active_mode', this.activeMode);
    },

    calculateRating(p) {
        const stats = [p.pac, p.sho, p.pas, p.dri, p.def, p.phy];
        const sum = stats.reduce((acc, val) => acc + (val || 0), 0);
        return Math.round(sum / stats.length);
    },

    createDemoTeam() {
        console.log("Toni: Erstelle frisches 20er Kader mit Rückennummern...");
        const names = ["Max Master", "Lukas Wall", "Toni Technic", "Marc Speed", "Sven Safe", "Finn Flügel", "Ben Beißer", "Leo Luft", "Mika Mitti", "Sam Solo", "Jan Jäger", "Oli Ordnung", "Paul Pass", "Kalle Kante", "Nico Netz", "Dennis Dribbel", "Uli Umkehr", "Basti Ball", "Rene Räumer", "Flo Flanke"];
        const positions = ["ST", "IV", "ZOM", "RV", "TW", "LF", "CDM", "IV", "ZM", "MS", "ST", "IV", "ZM", "LV", "RF", "ZOM", "CDM", "ST", "IV", "LV"];
        
        this.players = names.map((name, i) => {
            const player = {
                id: i + 1,
                number: i + 1, // Rückennummer (Jersey)
                name: name,
                pos: positions[i],
                pac: 75, sho: 70, pas: 80, dri: 75, def: 50, phy: 70,
                heart: 65,
                km: 0.0,
                assignment: i < 11 ? 'both' : 'training', 
                status: "FIT",
                img: null,
                x: null, 
                y: null
            };
            player.rat = this.calculateRating(player);
            return player;
        });
        this.save();
    },

    getPresentPlayers() {
        return this.players.filter(p => {
            if (p.assignment === 'none') return false;
            if (p.assignment === 'both') return true;
            return p.assignment === this.activeMode;
        });
    },

    updatePlayer(id, key, val) {
        const p = this.players.find(x => x.id === id);
        if (p) {
            p[key] = val;
            const statsKeys = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
            if (statsKeys.includes(key)) {
                p.rat = this.calculateRating(p);
            }
            this.save();
            if ((key === 'assignment' || key === 'present') && window.arena) {
                window.arena.syncFromDatabase();
            }
        }
    },

    updateTrainingStep(step, key, val) {
        if (this.trainingPlan[step]) {
            this.trainingPlan[step][key] = val;
            this.save();
        }
    },

    updateMatchInfo(key, val) {
        this.matchPlan[key] = val;
        this.save();
    },

    setMode(mode) {
        this.activeMode = mode;
        this.save();
        if (window.arena) window.arena.syncFromDatabase();
    }
};

window.Database.init();
