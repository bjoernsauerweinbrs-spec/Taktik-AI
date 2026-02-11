/**
 * TONI 2.0 - DATABASE CORE (ELITE EDIT SYNC 2026)
 * Fokus: 11+5 Trainer-Kader vs. 11 Toni-Gegner
 * Status: STEP 1 COMPLETED - FULL SQUAD SYNC
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

        // Master-Inject: Erstellt das volle 22+5 Setup
        this.injectEliteSeedData();
        
        console.log("📂 TONI-Datenbank: " + this.players.length + " Einheiten bereit zur Bearbeitung.");
    },

    updatePlayer(id, updatedData) {
        const index = this.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.players[index] = { ...this.players[index], ...updatedData };
            this.save();
            console.log(`✅ Spieler ${id} aktualisiert: ${this.players[index].name}`);
            
            if(window.Arena) window.Arena.draw();
            if(window.Arena) window.Arena.renderBench();
        }
    },

    injectEliteSeedData() {
        // Wir definieren hier das komplette Feld-Setup
        const musterKader = [
            // --- TRAINER-MANNSCHAFT (ROT) - STAMM 11 ---
            { id: 101, name: "TW TRAINER", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 80, dob: "1995-01-01", height: 190, weight: 85, onField: true, assignment: "Trainer" },
            { id: 102, name: "AB LINKS", team: "Senioren", jugend: "", pos: "AB", number: "2", rat: 75, onField: true, assignment: "Trainer" },
            { id: 103, name: "AB MITTE L", team: "Senioren", jugend: "", pos: "AB", number: "4", rat: 75, onField: true, assignment: "Trainer" },
            { id: 104, name: "AB MITTE R", team: "Senioren", jugend: "", pos: "AB", number: "5", rat: 75, onField: true, assignment: "Trainer" },
            { id: 105, name: "AB RECHTS", team: "Senioren", jugend: "", pos: "AB", number: "3", rat: 75, onField: true, assignment: "Trainer" },
            { id: 106, name: "MF LINKS", team: "Senioren", jugend: "", pos: "MF", number: "7", rat: 78, onField: true, assignment: "Trainer" },
            { id: 107, name: "MF MITTE L", team: "Senioren", jugend: "", pos: "MF", number: "6", rat: 78, onField: true, assignment: "Trainer" },
            { id: 108, name: "MF MITTE R", team: "Senioren", jugend: "", pos: "MF", number: "8", rat: 78, onField: true, assignment: "Trainer" },
            { id: 109, name: "MF RECHTS", team: "Senioren", jugend: "", pos: "MF", number: "11", rat: 78, onField: true, assignment: "Trainer" },
            { id: 110, name: "ST LINKS", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 85, onField: true, assignment: "Trainer" },
            { id: 111, name: "ST RECHTS", team: "Senioren", jugend: "", pos: "ST", number: "10", rat: 82, onField: true, assignment: "Trainer" },

            // --- TRAINER-MANNSCHAFT (ROT) - ERSATZBANK 5 ---
            { id: 120, name: "ERSATZ TW", team: "Senioren", jugend: "", pos: "TW", number: "22", rat: 72, onField: false, assignment: "Trainer" },
            { id: 121, name: "ERSATZ 1", team: "Senioren", jugend: "", pos: "AB", number: "14", rat: 70, onField: false, assignment: "Trainer" },
            { id: 122, name: "ERSATZ 2", team: "Senioren", jugend: "", pos: "MF", number: "16", rat: 72, onField: false, assignment: "Trainer" },
            { id: 123, name: "ERSATZ 3", team: "Senioren", jugend: "", pos: "MF", number: "18", rat: 71, onField: false, assignment: "Trainer" },
            { id: 124, name: "ERSATZ 4", team: "Senioren", jugend: "", pos: "ST", number: "20", rat: 74, onField: false, assignment: "Trainer" },

            // --- TONI-MANNSCHAFT (GRÜN) - STAMM 11 ---
            { id: 501, name: "TONI TW", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 88, onField: true, assignment: "Toni" },
            { id: 502, name: "TONI AB 1", team: "Senioren", jugend: "", pos: "AB", number: "2", rat: 82, onField: true, assignment: "Toni" },
            { id: 503, name: "TONI AB 2", team: "Senioren", jugend: "", pos: "AB", number: "4", rat: 84, onField: true, assignment: "Toni" },
            { id: 504, name: "TONI AB 3", team: "Senioren", jugend: "", pos: "AB", number: "5", rat: 82, onField: true, assignment: "Toni" },
            { id: 505, name: "TONI MF 1", team: "Senioren", jugend: "", pos: "MF", number: "6", rat: 85, onField: true, assignment: "Toni" },
            { id: 506, name: "TONI MF 2", team: "Senioren", jugend: "", pos: "MF", number: "8", rat: 86, onField: true, assignment: "Toni" },
            { id: 507, name: "TONI MF 3", team: "Senioren", jugend: "", pos: "MF", number: "10", rat: 90, onField: true, assignment: "Toni" },
            { id: 508, name: "TONI MF 4", team: "Senioren", jugend: "", pos: "MF", number: "7", rat: 85, onField: true, assignment: "Toni" },
            { id: 509, name: "TONI ST 1", team: "Senioren", jugend: "", pos: "ST", number: "11", rat: 84, onField: true, assignment: "Toni" },
            { id: 510, name: "TONI ST 2", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 91, onField: true, assignment: "Toni" },
            { id: 511, name: "TONI ST 3", team: "Senioren", jugend: "", pos: "ST", number: "13", rat: 82, onField: true, assignment: "Toni" }
        ];

        // Wir prüfen nur auf die IDs, um den LocalStorage nicht zu wipen,
        // fügen aber alles Fehlende hinzu.
        musterKader.forEach(mPlayer => {
            const exists = this.players.find(p => p.id === mPlayer.id);
            if (!exists) {
                // Standardwerte für neue Spieler ergänzen
                const fullPlayer = {
                    pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70,
                    height: 180, weight: 75,
                    ...mPlayer
                };
                this.players.push(fullPlayer);
            }
        });

        this.save();
    },

    save() {
        const data = { players: this.players, sponsors: this.sponsors };
        localStorage.setItem('toni_database_2026', JSON.stringify(data));
        console.log("💾 Master-Datenbank versiegelt.");
    }
};

window.Database.init();
