/**
 * TONI 2.0 - DATABASE MASTER
 * Inklusive Korrektur für Arena-Synchronisation
 */
window.Database = {
    players: [],

    init() {
        const saved = localStorage.getItem('toni_pro_db');
        if (saved) {
            this.players = JSON.parse(saved);
            console.log("Database: Daten erfolgreich vom PC geladen.");
        } else {
            console.log("Database: Keine Daten gefunden, erstelle Demo-Team.");
            this.createDemoTeam();
        }
    },

    save() {
        localStorage.setItem('toni_pro_db', JSON.stringify(this.players));
    },

    createDemoTeam() {
        const names = ["Max Master", "Lukas Wall", "Toni Technic", "Marc Speed", "Sven Safe", "Finn Flügel", "Ben Beißer", "Leo Luft", "Mika Mitti", "Sam Solo", "Jan Jäger", "Oli Ordnung", "Paul Pass", "Kalle Kante", "Nico Netz", "Dennis Dribbel", "Uli Umkehr", "Basti Ball", "Rene Räumer", "Flo Flanke"];
        const positions = ["ST", "IV", "ZOM", "RV", "TW", "LF", "CDM", "IV", "ZM", "MS", "ST", "IV", "ZM", "LV", "RF", "ZOM", "CDM", "ST", "IV", "LV"];
        
        this.players = names.map((name, i) => ({
            id: i + 1,
            name: name,
            pos: positions[i],
            rat: 80 + Math.floor(Math.random() * 10),
            pac: 70 + Math.floor(Math.random() * 20),
            sho: 65, pas: 75,
            present: i < 11, // Die ersten 11 sind im Training
            status: "Fit",
            img: null
        }));
        this.save();
    },

    // DIESE FUNKTION FEHLTE:
    getPresentPlayers() {
        return this.players.filter(p => p.present);
    },

    updatePlayer(id, key, val) {
        const p = this.players.find(x => x.id === id);
        if (p) { 
            p[key] = val; 
            this.save(); 
        }
    },

    togglePresence(id) {
        const p = this.players.find(x => x.id === id);
        if (p) { 
            p.present = !p.present; 
            this.save();
            // Wenn die Arena da ist, sofort synchronisieren
            if (window.arena) window.arena.syncFromDatabase(); 
        }
    }
};

// Datenbank beim Laden des Scripts initialisieren
window.Database.init();
