/**
 * TONI 2.0 - DATABASE (STRATEGIC UPDATE + PLANNING MAPS)
 * Kaderplanung, automatisches Rating & Modus-Filterung
 */
window.Database = {
    players: [],
    activeMode: 'training', // 'training' oder 'match'

    // NEU: Datenspeicher für die Einsatz-Mappen
    trainingPlan: {
        warmup: { desc: "", img: null },
        mainPart: { desc: "", img: null },
        coolDown: { desc: "", img: null },
        materials: [] // Automatische Liste aus der Arena
    },
    matchPlan: {
        lineupImg: null, // Screenshot der Aufstellung
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
            // Wir stellen sicher, dass wir sowohl Spieler als auch Pläne laden
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;
        } else {
            this.createDemoTeam();
        }
        
        if (savedMode) {
            this.activeMode = savedMode;
        }
    },

    save() {
        // Wir speichern das komplette Paket
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
        const names = ["Max Master", "Lukas Wall", "Toni Technic", "Marc Speed", "Sven Safe", "Finn Flügel", "Ben Beißer", "Leo Luft", "Mika Mitti", "Sam Solo", "Jan Jäger", "Oli Ordnung", "Paul Pass", "Kalle Kante", "Nico Netz", "Dennis Dribbel", "Uli Umkehr", "Basti Ball", "Rene Räumer", "Flo Flanke"];
        const positions = ["ST", "IV", "ZOM", "RV", "TW", "LF", "CDM", "IV", "ZM", "MS", "ST", "IV", "ZM", "LV", "RF", "ZOM", "CDM", "ST", "IV", "LV"];
        
        this.players = names.map((name, i) => {
            const player = {
                id: i + 1,
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
            if (key === 'assignment' && window.arena) {
                window.arena.syncFromDatabase();
            }
        }
    },

    // NEU: Funktionen zum Speichern der Mappen-Inhalte
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
