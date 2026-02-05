/**
 * TONI 2.0 - ZENTRALE DATENBANK & SEED ENGINE
 * Verwaltet den Kader und generiert bei Erststart die Musterdaten (11+11).
 * Integriert in den Event-Bus für reaktive UI-Updates.
 */
window.ToniDB = {
    init: function() {
        console.log("ToniDB: Initialisierung...");
        if (!localStorage.getItem('toni_players')) {
            this.seed();
        } else {
            console.log("ToniDB: Kader bereits vorhanden.");
        }
    },

    seed: function() {
        console.log("ToniDB: Generiere Elite-Kader für Coach Björn...");
        
        const eliteSquad = [
            // --- HEIMTEAM: STARTELF (11) ---
            { id: 'p1', name: 'Manuel Neuer', nr: 1, pos: 'TW', rat: 89, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 72, spo2: 99 }, photoUrl: '' },
            { id: 'p2', name: 'Virgil van Dijk', nr: 4, pos: 'IV', rat: 88, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 75, spo2: 98 }, photoUrl: '' },
            { id: 'p3', name: 'Ruben Dias', nr: 3, pos: 'IV', rat: 87, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 78, spo2: 98 }, photoUrl: '' },
            { id: 'p4', name: 'Alphonso Davies', nr: 19, pos: 'LV', rat: 85, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 82, spo2: 97 }, photoUrl: '' },
            { id: 'p5', name: 'Trent A.-Arnold', nr: 66, pos: 'RV', rat: 86, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 80, spo2: 98 }, photoUrl: '' },
            { id: 'p6', name: 'Joshua Kimmich', nr: 6, pos: 'ZM', rat: 86, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 85, spo2: 96 }, photoUrl: '' },
            { id: 'p7', name: 'Kevin De Bruyne', nr: 17, pos: 'ZM', rat: 91, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 88, spo2: 95 }, photoUrl: '' },
            { id: 'p8', name: 'Jude Bellingham', nr: 5, pos: 'ZM', rat: 88, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 90, spo2: 97 }, photoUrl: '' },
            { id: 'p9', name: 'Mohamed Salah', nr: 11, pos: 'RM', rat: 89, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 92, spo2: 98 }, photoUrl: '' },
            { id: 'p10', name: 'Kylian Mbappé', nr: 7, pos: 'ST', rat: 92, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 178, spo2: 93 }, photoUrl: '' },
            { id: 'p11', name: 'Erling Haaland', nr: 9, pos: 'ST', rat: 91, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 82, spo2: 98 }, photoUrl: '' },

            // --- HEIMTEAM: BANK (5) ---
            { id: 'p12', name: 'Alisson Becker', nr: 12, pos: 'TW', rat: 87, team: 'home', isStarter: false, isPresent: true, vitals: { pulse: 65, spo2: 99 } },
            { id: 'p13', name: 'Luka Modric', nr: 10, pos: 'ZM', rat: 87, team: 'home', isStarter: false, isPresent: true, vitals: { pulse: 70, spo2: 98 } },
            { id: 'p14', name: 'Vinícius Júnior', nr: 20, pos: 'LM', rat: 89, team: 'home', isStarter: false, isPresent: true, vitals: { pulse: 75, spo2: 98 } },
            { id: 'p15', name: 'Harry Kane', nr: 99, pos: 'ST', rat: 90, team: 'home', isStarter: false, isPresent: true, vitals: { pulse: 78, spo2: 97 } },
            { id: 'p16', name: 'Jamal Musiala', nr: 42, pos: 'OM', rat: 86, team: 'home', isStarter: false, isPresent: true, vitals: { pulse: 80, spo2: 98 } }
        ];

        // --- GEGNERTEAM (BLAU): 11 SPIELER ---
        for (let i = 1; i <= 11; i++) {
            eliteSquad.push({
                id: 'opp_' + i,
                name: 'Gegner ' + i,
                nr: i,
                pos: 'PRO',
                rat: 82,
                team: 'away',
                isStarter: true,
                isPresent: true,
                vitals: { pulse: 75, spo2: 98 }
            });
        }

        this.saveAll(eliteSquad);
        console.log("ToniDB: Seed abgeschlossen. 27 Spieler erstellt.");
    },

    getPlayers: function() {
        const data = localStorage.getItem('toni_players');
        return data ? JSON.parse(data) : [];
    },

    saveAll: function(players) {
        localStorage.setItem('toni_players', JSON.stringify(players));
        // Informiere alle UI-Komponenten via Event-Bus
        if (window.ToniEvents) {
            window.ToniEvents.emit('players:updated', players);
        }
    },

    updatePlayer: function(id, patch) {
        const players = this.getPlayers();
        const idx = players.findIndex(p => p.id === id);
        if (idx !== -1) {
            players[idx] = { ...players[idx], ...patch };
            this.saveAll(players);
        }
    },

    deletePlayer: function(id) {
        const players = this.getPlayers().filter(p => p.id !== id);
        this.saveAll(players);
    }
};

// Initialisierung
window.ToniDB.init();
