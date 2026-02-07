window.Database = {
    players: [],
    init() {
        const saved = localStorage.getItem('toni_pro_db');
        if (saved) {
            this.players = JSON.parse(saved);
        } else {
            this.createDemoTeam();
        }
    },
    save() {
        localStorage.setItem('toni_pro_db', JSON.stringify(this.players));
    },
    createDemoTeam() {
        const names = ["Max Master", "Lukas Wall", "Toni Technic", "Marc Speed", "Sven Safe", "Finn Flügel", "Ben Beißer", "Leo Luft", "Mika Mitti", "Sam Solo", "Jan Jäger", "Oli Ordnung", "Paul Pass", "Kalle Kante", "Nico Netz", "Dennis Dribbel", "Uli Umkehr", "Basti Ball", "Rene Räumer", "Flo Flanke"];
        this.players = names.map((name, i) => ({
            id: i + 1, name, pos: i === 4 ? "TW" : "FELD", rat: 85, 
            pac: 80, sho: 70, pas: 75, heart: 72, km: 0, present: i < 11, img: null
        }));
        this.save();
    },
    getPresentPlayers() { return this.players.filter(p => p.present); },
    updatePlayer(id, key, val) {
        const p = this.players.find(x => x.id === id);
        if (p) { p[key] = val; this.save(); }
    },
    togglePresence(id) {
        const p = this.players.find(x => x.id === id);
        if (p) { p.present = !p.present; this.save(); if(window.arena) window.arena.syncFromDatabase(); }
    }
};
window.Database.init();
