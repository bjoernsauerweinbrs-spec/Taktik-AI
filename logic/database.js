/**
 * TONI 2.0 - DATABASE (MASTER RECOVERY)
 * Langzeitgedächtnis für Coach-Profil, Kader, Video-Links und Taktik-Setups.
 */
window.Database = {
    players: [],
    activeMode: 'training', // 'training' oder 'match'

    // NEU: Dein persönliches Profil
    coachProfile: {
        name: null,
        verein: null,
        position: null,
        onboardingDone: false
    },

    // NEU: Video-Datenbank für High-Speed Zugriff (Zidane, etc.)
    videoLibrary: {
        "zidane turn": "https://www.youtube.com/embed/R0fE9S9v6mE",
        "torschuss": "https://www.youtube.com/embed/O86mC-N-f3c",
        "annahme": "https://www.youtube.com/embed/82YF-mX2B9Y",
        "dribbling": "https://www.youtube.com/embed/v8v0p-Csc9A"
    },

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
        opponentInfo: "Keine Daten vorhanden. KI-Analyse läuft...",
        opponentTeam: "",
        // Taktik-Vorgabe laut Anweisung
        formations: {
            toni: "4-4-2",
            trainer: "3-4-3"
        }
    },

    init() {
        const savedData = localStorage.getItem('toni_pro_db');
        const savedMode = localStorage.getItem('toni_active_mode');
        const savedProfile = localStorage.getItem('toni_coach_data');
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            this.players = parsed.players || [];
            this.trainingPlan = parsed.trainingPlan || this.trainingPlan;
            this.matchPlan = parsed.matchPlan || this.matchPlan;
            this.repairPlayerData();
        } else {
            this.createDemoTeam();
        }

        if (savedProfile) {
            this.coachProfile = JSON.parse(savedProfile);
        }
        
        if (savedMode) {
            this.activeMode = savedMode;
        }
    },

    save() {
        const dataToSave = {
            players: this.players,
            trainingPlan: this.trainingPlan,
            matchPlan: this.matchPlan
        };
        localStorage.setItem('toni_pro_db', JSON.stringify(dataToSave));
        localStorage.setItem('toni_active_mode', this.activeMode);
        localStorage.setItem('toni_coach_data', JSON.stringify(this.coachProfile));
    },

    // Helfer für Toni: Sucht Video-Link oder generiert YouTube-Suche
    getVideoLink(query) {
        const q = query.toLowerCase();
        for (let key in this.videoLibrary) {
            if (q.includes(key)) return this.videoLibrary[key];
        }
        // Fallback: Dynamische Suche
        return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(query + " football tutorial")}`;
    },

    repairPlayerData() {
        let changed = false;
        this.players.forEach((p, index) => {
            if (p.dri === undefined) { p.dri = 75; changed = true; }
            if (p.def === undefined) { p.def = 50; changed = true; }
            if (p.phy === undefined) { p.phy = 70; changed = true; }
            if (p.number === undefined) { p.number = p.id || (index + 1); changed = true; }
            if (p.team === undefined) { p.team = (index < 11) ? 'A' : 'B'; changed = true; }
            if (!p.rat) { p.rat = this.calculateRating(p); changed = true; }
        });
        if (changed) this.save();
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
                number: i + 1,
                name: name,
                pos: positions[i],
                pac: 75, sho: 70, pas: 80, dri: 75, def: 50, phy: 70,
                heart: 65, km: 0.0,
                assignment: i < 11 ? 'both' : 'training', 
                team: i < 11 ? 'A' : 'B', 
                status: "FIT"
            };
            player.rat = this.calculateRating(player);
            return player;
        });
        this.save();
    },

    updatePlayer(id, key, val) {
        const p = this.players.find(x => x.id === id);
        if (p) {
            p[key] = val;
            if (['pac', 'sho', 'pas', 'dri', 'def', 'phy'].includes(key)) {
                p.rat = this.calculateRating(p);
            }
            this.save();
            if ((key === 'assignment' || key === 'team') && window.arena) {
                window.arena.syncFromDatabase();
            }
        }
    }
};

window.Database.init();
