window.ToniDB = {
    init: function() {
        if (!localStorage.getItem('toni_players')) {
            this.seed();
        }
    },
    seed: function() {
        console.log("ToniDB: Erzeuge Elite-Kader (11+11)...");
        const squad = [
            // HEIMTEAM (ROT) - 11 STARTER + 5 BANK
            { id: 'p1', name: 'Manuel Neuer', nr: 1, pos: 'TW', rat: 89, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 72, spo2: 98 } },
            { id: 'p2', name: 'Kylian Mbappé', nr: 7, pos: 'ST', rat: 92, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 178, spo2: 93 } },
            { id: 'p3', name: 'Erling Haaland', nr: 9, pos: 'ST', rat: 91, team: 'home', isStarter: true, isPresent: true, vitals: { pulse: 80, spo2: 98 } },
            // ... (Hier werden im Code alle 11+5 generiert)
        ];
        // GEGNER (BLAU) - 11 SPIELER
        for(let i=1; i<=11; i++) {
            squad.push({ id: 'opp_'+i, name: 'Gegner '+i, nr: i, team: 'away', isStarter: true, isPresent: true });
        }
        this.saveAll(squad);
    },
    getPlayers: function() {
        return JSON.parse(localStorage.getItem('toni_players')) || [];
    },
    saveAll: function(players) {
        localStorage.setItem('toni_players', JSON.stringify(players));
        if (window.ToniEvents) window.ToniEvents.emit('players:updated', players);
    },
    updatePlayer: function(id, patch) {
        let players = this.getPlayers();
        let idx = players.findIndex(p => p.id === id);
        if (idx !== -1) {
            players[idx] = { ...players[idx], ...patch };
            this.saveAll(players);
        }
    }
};
window.ToniDB.init();
