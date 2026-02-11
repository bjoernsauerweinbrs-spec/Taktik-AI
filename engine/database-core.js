/**
 * TONI 2.0 - DATABASE CORE (ELITE DATA SYNC 2026)
 * Fokus: Muster-Daten für alle Sektoren, Analyse-Parameter & Bio-Stats
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

        // Falls die Datenbank leer ist, füllen wir sie mit dem Elite-Musterkader
        if (this.players.length === 0) {
            console.log("🛠️ Initialisiere Muster-Daten für Senioren & Junioren...");
            this.injectEliteSeedData();
        }
        
        console.log("📂 TONI-Datenbank: " + this.players.length + " Einheiten aktiv.");
    },

    /**
     * Erstellt ein vollständiges Vereins-Abbild für die Analyse
     */
    injectEliteSeedData() {
        const musterPlayers = [
            // --- SENIOREN (1. Mannschaft) ---
            { id: 10, name: "Manuel Neuer", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 87, dob: "1986-03-27", height: 193, weight: 93, pac: 50, sho: 30, pas: 91, dri: 60, def: 40, phy: 80, onField: true, assignment: "Toni" },
            { id: 11, name: "Joshua Kimmich", team: "Senioren", jugend: "", pos: "MF", number: "6", rat: 88, dob: "1995-02-08", height: 177, weight: 75, pac: 70, sho: 72, pas: 90, dri: 84, def: 83, phy: 78, onField: true, assignment: "Toni" },
            { id: 12, name: "Harry Kane", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 91, dob: "1993-07-28", height: 188, weight: 89, pac: 75, sho: 93, pas: 85, dri: 84, def: 45, phy: 82, onField: true, assignment: "Toni" },
            
            // --- SENIOREN (2. Mannschaft) ---
            { id: 21, name: "Sven Ulreich", team: "Senioren", jugend: "", pos: "TW", number: "26", rat: 78, dob: "1988-08-03", height: 192, weight: 87, pac: 45, sho: 25, pas: 70, dri: 50, def: 35, phy: 75, onField: false, assignment: "Trainer" },
            
            // --- A-JUGEND (U19) ---
            { id: 31, name: "Mathys Tel", team: "Junioren", jugend: "A-Jugend", pos: "ST", number: "39", rat: 80, dob: "2007-04-27", height: 183, weight: 78, pac: 89, sho: 82, pas: 74, dri: 83, def: 35, phy: 72, onField: true, assignment: "Toni" },
            
            // --- C-JUGEND (U15) ---
            { id: 51, name: "Talent Alpha", team: "Junioren", jugend: "C-Jugend", pos: "MF", number: "10", rat: 72, dob: "2011-06-15", height: 165, weight: 58, pac: 82, sho: 70, pas: 75, dri: 78, def: 55, phy: 60, onField: true, assignment: "Toni" },
            
            // --- G-JUGEND (Bambini - Max 7 Jahre in 2026) ---
            { id: 71, name: "Kleiner Toni", team: "Junioren", jugend: "G-Jugend", pos: "ST", number: "7", rat: 65, dob: "2019-03-10", height: 125, weight: 28, pac: 70, sho: 60, pas: 55, dri: 75, def: 30, phy: 45, onField: true, assignment: "Toni" }
        ];

        this.players = musterPlayers;
        this.save();
    },

    save() {
        const data = { players: this.players, sponsors: this.sponsors };
        localStorage.setItem('toni_database_2026', JSON.stringify(data));
        console.log("💾 Datenbank-Sync: " + this.players.length + " Einheiten gesichert.");
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
            return { valid: false, msg: `FEHLER: Der Spieler ist ${age}. Limit für ${teamContext} ist ${limits[teamContext]}.` };
        }
        return { valid: true };
    }
};

// Start-Sequenz
window.Database.init();
