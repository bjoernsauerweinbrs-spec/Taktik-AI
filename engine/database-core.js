window.Database = {
    players: [],
    sponsors: [],
    
    init() {
        const saved = localStorage.getItem('toni_database_2026');
        if (saved) {
            const data = JSON.parse(saved);
            this.players = data.players || [];
            this.sponsors = data.sponsors || [];
            console.log("📂 Datenbank geladen: " + this.players.length + " Spieler gefunden.");
        }
    },

    save() {
        const data = { players: this.players, sponsors: this.sponsors };
        localStorage.setItem('toni_database_2026', JSON.stringify(data));
        console.log("💾 Datenbank-Sync abgeschlossen.");
    },

    /**
     * Prüft, ob ein Spieler basierend auf dem Geburtsjahr in die Jugend passt.
     */
    validateAge(dob, teamContext) {
        if (!dob || teamContext === "Senioren") return true;
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
window.Database.init();
