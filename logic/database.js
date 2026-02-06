/**
 * TONI 2.0 - DATABASE
 * Verwaltet den Status aller Spieler und Objekte
 */
window.Database = {
    players: [
        { id: 1, name: "Sauerwein", rat: 88, pos: "ST", present: true, x: 100, y: 100 },
        { id: 2, name: "Toni", rat: 99, pos: "ZOM", present: false, x: 150, y: 150 },
        // Hier können wir später alle 50+ Spieler laden
    ],

    getPresentPlayers() {
        return this.players.filter(p => p.present);
    },

    togglePresence(id) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.present = !player.present;
            // Nach Änderung: Arena informieren
            window.arena.syncFromDatabase();
        }
    }
};
