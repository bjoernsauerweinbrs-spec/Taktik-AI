/**
 * TONI 2.0 - ZENTRALE DATENBANK [PRO-EDITION]
 * Verwaltet Kader, Trainingsdaten und System-Konfiguration.
 * Optimiert für automatische Muster-Generierung und Analyse-Trigger.
 */
window.ToniDB = {
    init: function() {
        let players = this.getPlayers();
        
        // MUSTER-PROFI CHECK (Sicherstellen, dass Mbappé mit Pro-Werten existiert)
        const hasMbappe = players.some(p => p.id === 'p_mbappe_7');
        
        if (!hasMbappe) {
            console.log("ToniDB: Erstelle Elite-Musterprofi für Testzwecke...");
            const musterProfi = {
                id: 'p_mbappe_7',
                name: 'Kylian Mbappé',
                number: 7,
                pos: 'ST',
                rating: 92,
                isPresent: true,   // Aktiviert den grünen Punkt
                isStarter: true,   // Aktiviert den Startelf-Rahmen
                isNominated: true,
                photoUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200',
                status: 'BELASTET',
                vitals: { 
                    pulse: 178,    // Löst roten Alarm im Analysezentrum aus
                    spo2: 93       // Löst Warnung aus
                },
                proKpis: { 
                    vmax: 37.9, 
                    rsa: 95 
                },
                // Skills für die Radar-Matrix
                skills: { spr: 98, aus: 85, tec: 92, pas: 88, phy: 80 }
            };
            players.push(musterProfi);
            this.saveAll(players);
        }
        
        console.log("ToniDB: Kader-Schnittstelle aktiv. Spieler im System:", players.length);
    },

    savePlayer: function(playerData) {
        let players = this.getPlayers();
        const index = players.findIndex(p => p.id === playerData.id);
        
        if (index > -1) {
            players[index] = playerData;
        } else {
            players.push(playerData);
        }
        this.saveAll(players);
    },

    saveAll: function(playersArray) {
        localStorage.setItem('toni_players', JSON.stringify(playersArray));
    },

    getPlayers: function() {
        try {
            const data = localStorage.getItem('toni_players');
            return data ? JSON.parse(data) : [];
        } catch(e) {
            console.error("ToniDB: Fehler beim Laden der Spieler", e);
            return [];
        }
    },

    deletePlayer: function(id) {
        let players = this.getPlayers().filter(p => p.id !== id);
        this.saveAll(players);
    }
};

// Initialisierung beim Laden
window.ToniDB.init();
