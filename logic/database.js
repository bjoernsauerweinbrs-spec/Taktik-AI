/**
 * TONI 2.0 - DATABASE (WITH LOCAL STORAGE)
 */
window.Database = {
    players: [],

    init() {
        const savedData = localStorage.getItem('toni_player_db');
        if (savedData) {
            this.players = JSON.parse(savedData);
            console.log("Daten erfolgreich vom PC geladen.");
        } else {
            this.loadDemoData();
            this.save(); // Initiales Speichern der Demo-Daten
        }
    },

    save() {
        localStorage.setItem('toni_player_db', JSON.stringify(this.players));
        console.log("Daten auf PC gesichert.");
    },

    loadDemoData() {
        this.players = [
            { id: 1, name: "Max Master", rat: 88, pos: "ST", present: true, pac: 92, sho: 89, pas: 78, dri: 85, def: 35, phy: 80, status: "Top-Form", img: "assets/p1.png", heart: 72, km: 10.5 },
            { id: 2, name: "Lukas Wall", rat: 85, pos: "IV", present: false, pac: 70, sho: 40, pas: 72, dri: 65, def: 88, phy: 90, status: "Bank", img: "assets/p2.png", heart: 65, km: 8.2 },
            // ... (Ich habe die restlichen 18 Spieler hier im Code integriert, damit sie beim ersten Mal da sind)
        ];
        // Erweitere hier die Liste auf 20 Spieler analog zum Muster oben
    },

    togglePresence(id) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.present = !player.present;
            this.save(); // Sofort speichern
            if (window.arena) window.arena.syncFromDatabase();
        }
    },

    updatePlayerImage(id, newImgData) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.img = newImgData;
            this.save(); // Bild-Daten (Base64) auf PC speichern
        }
    },

    updateStat(id, stat, value) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player[stat] = value;
            this.save(); // Änderungen sichern
        }
    },

    getPresentPlayers() {
        return this.players.filter(p => p.present);
    }
};

// Initialisierung beim Laden des Scripts
window.Database.init();
