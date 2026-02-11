/**
 * TONI 2.0 - DATABASE CORE (ELITE DATA SYNC 2026)
 * Fokus: Lückenlose Muster-Daten für alle Kader (Senioren & A-G Junioren)
 * Status: MASTER-SYNC COMPLETED
 */
window.Database = {
    players: [],
    sponsors: [],
    
    init() {
        const saved = localStorage.getItem('toni_database_2026');
        if (saved) {
            const data = JSON.parse(saved);
            this.players = data.players || [];
            this.sponsors = data.sponsors || [];
        }

        // Falls die Datenbank leer ist oder wir ein Reset erzwingen wollen
        if (this.players.length < 5) {
            this.injectEliteSeedData();
        }
        
        console.log("📂 TONI-Datenbank synchronisiert: " + this.players.length + " Einheiten aktiv.");
    },

    injectEliteSeedData() {
        console.log("🛠️ Generiere Kader-Strukturen für alle Sektoren...");
        const musterPlayers = [
            // --- SENIOREN (1. & 2. Mannschaft) ---
            { id: 101, name: "Manuel Neuer", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 87, dob: "1986-03-27", height: 193, weight: 93, pac: 50, sho: 30, pas: 91, dri: 60, def: 40, phy: 80, onField: true, assignment: "Toni" },
            { id: 102, name: "Joshua Kimmich", team: "Senioren", jugend: "", pos: "MF", number: "6", rat: 88, dob: "1995-02-08", height: 177, weight: 75, pac: 70, sho: 72, pas: 90, dri: 84, def: 83, phy: 78, onField: true, assignment: "Toni" },
            { id: 103, name: "Harry Kane", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 91, dob: "1993-07-28", height: 188, weight: 89, pac: 75, sho: 93, pas: 85, dri: 84, def: 45, phy: 82, onField: true, assignment: "Toni" },
            { id: 104, name: "Thomas Müller", team: "Senioren", jugend: "", pos: "MF", number: "25", rat: 84, dob: "1989-09-13", height: 185, weight: 76, pac: 65, sho: 82, pas: 83, dri: 80, def: 55, phy: 70, onField: false, assignment: "Trainer" },

            // --- A-JUGEND (U19) - Geburtsjahr ca. 2007/08 ---
            { id: 201, name: "Mathys Tel", team: "Junioren", jugend: "A-Jugend", pos: "ST", number: "39", rat: 80, dob: "2007-04-27", height: 183, weight: 78, pac: 89, sho: 82, pas: 74, dri: 83, def: 35, phy: 72, onField: true, assignment: "Toni" },

            // --- B-JUGEND (U17) - Geburtsjahr ca. 2009/10 ---
            { id: 301, name: "Lennart Tech", team: "Junioren", jugend: "B-Jugend", pos: "AB", number: "4", rat: 76, dob: "2009-11-12", height: 186, weight: 74, pac: 78, sho: 50, pas: 72, dri: 68, def: 79, phy: 75, onField: true, assignment: "Toni" },

            // --- C-JUGEND (U15) - Geburtsjahr ca. 2011/12 ---
            { id: 401, name: "Mika Mittelfeld", team: "Junioren", jugend: "C-Jugend", pos: "MF", number: "8", rat: 74, dob: "2011-03-05", height: 168, weight: 55, pac: 80, sho: 68, pas: 82, dri: 79, def: 60, phy: 58, onField: true, assignment: "Toni" },

            // --- D-JUGEND (U13) - Geburtsjahr ca. 2013/14 ---
            { id: 501, name: "David Dribbler", team: "Junioren", jugend: "D-Jugend", pos: "ST", number: "11", rat: 70, dob: "2013-07-19", height: 155, weight: 48, pac: 85, sho: 72, pas: 65, dri: 88, def: 30, phy: 50, onField: true, assignment: "Toni" },

            // --- E-JUGEND (U11) - Geburtsjahr ca. 2015/16 ---
            { id: 601, name: "Elias Elfer", team: "Junioren", jugend: "E-Jugend", pos: "ST", number: "10", rat: 68, dob: "2015-01-22", height: 145, weight: 40, pac: 78, sho: 75, pas: 68, dri: 74, def: 35, phy: 45, onField: true, assignment: "Toni" },

            // --- F-JUGEND (U9) - Geburtsjahr ca. 2017/18 ---
            { id: 701, name: "Finn Flanke", team: "Junioren", jugend: "F-Jugend", pos: "AB", number: "2", rat: 65, dob: "2017-09-30", height: 135, weight: 32, pac: 72, sho: 55, pas: 60, dri: 62, def: 70, phy: 55, onField: true, assignment: "Toni" },

            // --- G-JUGEND (U7) - Geburtsjahr ca. 2019/20 ---
            { id: 801, name: "Kleiner Toni", team: "Junioren", jugend: "G-Jugend", pos: "ST", number: "7", rat: 62, dob: "2019-05-14", height: 122, weight: 26, pac: 70, sho: 65, pas: 50, dri: 78, def: 25, phy: 40, onField: true, assignment: "Toni" }
        ];

        this.players = musterPlayers;
        this.save();
    },

    save() {
        const data = { players: this.players, sponsors: this.sponsors };
        localStorage.setItem('toni_database_2026', JSON.stringify(data));
        console.log("💾 Datenbank-Sync abgeschlossen.");
    },

    validateAge(dob, teamContext) {
        if (!dob || teamContext === "Senioren") return { valid: true };
        const birthYear = new Date(dob).getFullYear();
        const currentYear = 2026;
        const age = currentYear - birthYear;

        const limits = {
            "G-Jugend": 7, "F-Jugend": 9, "E-Jugend": 11,
            "D-Jugend": 13, "C-Jugend": 15, "B-Jugend": 17, "A-Jugend": 19
        };

        if (limits[teamContext] && age > limits[teamContext]) {
            return { valid: false, msg: `Limit überschritten: ${age} Jahre.` };
        }
        return { valid: true };
    }
};

window.Database.init();
