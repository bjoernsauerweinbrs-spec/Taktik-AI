/**
 * TONI 2.0 - ZENTRALE DATENBANK
 * Verwaltet Kader, Trainingsdaten und System-Konfiguration.
 */
window.ToniDB = {
    // Standard-Kader Initialisierung
    init: function() {
        if (!localStorage.getItem('toni_players')) {
            localStorage.setItem('toni_players', JSON.stringify([]));
        }
        console.log("ToniDB: Kader-Schnittstelle aktiv.");
    },

    // Spieler-Operationen
    savePlayer: function(playerData) {
        let players = this.getPlayers();
        const index = players.findIndex(p => p.id === playerData.id);
        
        if (index > -1) {
            players[index] = playerData; // Update
        } else {
            players.push(playerData); // Neu
        }
        localStorage.setItem('toni_players', JSON.stringify(players));
    },

    getPlayers: function() {
        return JSON.parse(localStorage.getItem('toni_players')) || [];
    },

    deletePlayer: function(id) {
        let players = this.getPlayers().filter(p => p.id !== id);
        localStorage.setItem('toni_players', JSON.stringify(players));
    }
};

// Start beim Laden
window.ToniDB.init();
