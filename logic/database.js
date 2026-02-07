/**
 * TONI 2.0 - DATABASE (STRATEGIC UPDATE)
 * Kaderplanung, automatisches Rating & Modus-Filterung
 */
window.Database = {
    players: [],
    activeMode: 'training', // 'training' oder 'match'

    init() {
        const savedData = localStorage.getItem('toni_pro_db');
        const savedMode = localStorage.getItem('toni_active_mode');
        
        if (savedData) {
            this.players = JSON.parse(savedData);
        } else {
            this.createDemoTeam();
        }
        
        if (savedMode) {
            this.activeMode = savedMode;
        }
    },

    save() {
        localStorage.setItem('toni_pro_db', JSON.stringify(this.players));
        localStorage.setItem('toni_active_mode', this.activeMode);
    },

    // Berechnet das Overall-Rating automatisch aus den 6 FIFA-Stats
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
                // Startwerte
                pac: 75, sho: 70, pas: 80, dri: 75, def: 50, phy: 70,
                heart: 65,
                km: 0.0,
                // NEU: Zuweisung (both, training, match, none)
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

    // Filtert Spieler basierend darauf, was der Trainer gerade sehen will (Training/Spiel)
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
            
            // Wenn ein Stat geändert wurde, Rating neu berechnen
            const statsKeys = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
            if (statsKeys.includes(key)) {
                p.rat = this.calculateRating(p);
            }
            
            this.save();
            
            // Falls der Modus oder die Zuweisung geändert wurde, Arena refreshen
            if (key === 'assignment' && window.arena) {
                window.arena.syncFromDatabase();
            }
        }
    },

    setMode(mode) {
        this.activeMode = mode; // 'training' oder 'match'
        this.save();
        if (window.arena) window.arena.syncFromDatabase();
    }
};

window.Database.init();
