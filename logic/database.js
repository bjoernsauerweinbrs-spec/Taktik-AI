/**
 * TONI 2.0 - ZENTRALE DATENBANK [PRO-EDITION]
 * Verwaltet Kader, Trainingsdaten und System-Konfiguration.
 */
window.ToniDB = {
    // Standard-Kader Initialisierung
    init: function() {
        let players = JSON.parse(localStorage.getItem('toni_players')) || [];
        
        // MUSTER-PROFI LADEN (Damit das Analysezentrum sofort Futter hat)
        if (players.length === 0) {
            console.log("ToniDB: Erstelle Elite-Musterprofi für Testzwecke...");
            const musterProfi = {
                id: 'p_mbappe_7',
                name: 'Kylian Mbappé',
                number: 7,
                pos: 'ST',
                rating: 92,
                isPresent: true,   // Grüner Punkt ist hier aktiv!
                isStarter: true,
                isNominated: true,
                photoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200',
                status: 'BELASTET',
                vitals: { 
                    pulse: 178,    // Hoher Puls -> Löst Alarm im Analysezentrum aus
                    spo2: 93       // Niedriger Wert -> Löst Warnung aus
                },
                proKpis: { 
                    vmax: 37.9, 
                    rsa: 95 
                },
                skills: { spr: 98, aus: 85, tec: 92, pas: 88, phy: 80 }
            };
            players.push(musterProfi);
            localStorage.setItem('toni_players', JSON.stringify(players));
        }
        
        console.log("ToniDB: Kader-Schnittstelle aktiv. Spieler geladen:", players.length);
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
        try {
            return JSON.parse(localStorage.getItem('toni_players')) || [];
        } catch(e) {
            return [];
        }
    },

    deletePlayer: function(id) {
        let players = this.getPlayers().filter(p => p.id !== id);
        localStorage.setItem('toni_players', JSON.stringify(players));
    }
};

// Start beim Laden
window.ToniDB.init();
