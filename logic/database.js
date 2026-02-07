/**
 * TONI 2.0 - DATABASE (ELITE MASTER)
 * Verwaltet 20 Spieler mit 6 Attributen, Vitaldaten & LocalStorage
 */
window.Database = {
    players: [],

    init() {
        const saved = localStorage.getItem('toni_pro_db');
        if (saved) {
            this.players = JSON.parse(saved);
            console.log("Database: Spieler erfolgreich vom PC geladen.");
        } else {
            console.log("Database: Kein Profil gefunden, erstelle Elite-Team.");
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
            rat: 82 + Math.floor(Math.random() * 10),
            // Die 6 FIFA Attribute
            pac: 70 + Math.floor(Math.random() * 25),
            sho: 60 + Math.floor(Math.random() * 30),
            pas: 65 + Math.floor(Math.random() * 25),
            dri: 70 + Math.floor(Math.random() * 20),
            def: 30 + Math.floor(Math.random() * 60),
            phy: 60 + Math.floor(Math.random() * 30),
            // Vitaldaten für Analyse
            heart: 65,
            km: 0.0,
            // Status & Arena
            present: i < 11, // Startelf-Demo
            status: "FIT",
            img: null,
            x: null, // Speicher für Position auf dem Feld
            y: null
        }));
        this.save();
    },

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
            // Automatische Synchronisation der Arena
            if (window.arena) {
                window.arena.syncFromDatabase();
            }
        }
    }
};

// Startet die Datenbank
window.Database.init();
