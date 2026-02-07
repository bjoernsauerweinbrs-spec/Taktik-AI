/**
 * TONI 2.0 - DATABASE & STORAGE
 * Verwaltet 20 Spieler + LocalStorage
 */
window.Database = {
    players: [],

    init() {
        const saved = localStorage.getItem('toni_pro_db');
        if (saved) {
            this.players = JSON.parse(saved);
            console.log("Spielerdaten vom PC geladen.");
        } else {
            this.loadDemoData();
            this.save();
        }
    },

    save() {
        localStorage.setItem('toni_pro_db', JSON.stringify(this.players));
    },

    loadDemoData() {
        // Erstellung von 20 Muster-Spielern
        const names = ["Max Master", "Lukas Wall", "Toni Technic", "Marc Speed", "Sven Safe", "Finn Flügel", "Ben Beißer", "Leo Luft", "Mika Mitti", "Sam Solo", "Jan Jäger", "Oli Ordnung", "Paul Pass", "Kalle Kante", "Nico Netz", "Dennis Dribbel", "Uli Umkehr", "Basti Ball", "Rene Räumer", "Flo Flanke"];
        const positions = ["ST", "IV", "ZOM", "RV", "TW", "LF", "CDM", "IV", "ZM", "MS", "ST", "IV", "ZM", "LV", "RF", "ZOM", "CDM", "ST", "IV", "LV"];
        
        this.players = names.map((name, i) => ({
            id: i + 1,
            name: name,
            pos: positions[i],
            rat: 75 + Math.floor(Math.random() * 20),
            pac: 70 + Math.floor(Math.random() * 25),
            sho: 60 + Math.floor(Math.random() * 30),
            pas: 65 + Math.floor(Math.random() * 25),
            present: i < 11, // Die ersten 11 sind im Training
            status: i % 5 === 0 ? "Top-Form" : "Fit",
            img: null // null bedeutet: Standard-Icon anzeigen
        }));
    },

    updatePlayer(id, key, value) {
        const p = this.players.find(player => player.id === id);
        if (p) {
            p[key] = value;
            this.save();
        }
    },

    togglePresence(id) {
        const p = this.players.find(player => player.id === id);
        if (p) {
            p.present = !p.present;
            this.save();
            if (window.arena) window.arena.syncFromDatabase();
        }
    },

    getPresentPlayers() {
        return this.players.filter(p => p.present);
    }
};

// Startet die Datenbank sofort
window.Database.init();
