window.ToniDB = {
    // 1. INITIALISIERUNG
    init: function() {
        if (!localStorage.getItem('toni_players')) {
            console.log("ToniDB: Erstelle initialen Profi-Kader...");
            this.seed();
        }
    },

    // 2. DAS "SEEDING" (Hier kommen die vollen Daten)
    seed: function() {
        const initialPlayers = [
            // HEIMTEAM (ROT) - Brasilianische Technik & Internationaler Mix
            { id: 'h1', name: 'Alisson', nr: 1, pos: 'TW', team: 'home', isStarter: true, isPresent: true, rat: 89, flag: '🇧🇷', stats: {PAC: 86, SHO: 85, PAS: 85, DRI: 89, DEF: 54, PHY: 90} },
            { id: 'h2', name: 'Marquinhos', nr: 4, pos: 'IV', team: 'home', isStarter: true, isPresent: true, rat: 87, flag: '🇧🇷', stats: {PAC: 79, SHO: 53, PAS: 75, DRI: 74, DEF: 89, PHY: 80} },
            { id: 'h3', name: 'Vini Jr.', nr: 7, pos: 'ST', team: 'home', isStarter: true, isPresent: true, rat: 91, flag: '🇧🇷', stats: {PAC: 97, SHO: 82, PAS: 79, DRI: 92, DEF: 34, PHY: 68} },
            { id: 'h4', name: 'Kimmich', nr: 6, pos: 'CDM', team: 'home', isStarter: true, isPresent: true, rat: 88, flag: '🇩🇪', stats: {PAC: 70, SHO: 72, PAS: 90, DRI: 84, DEF: 83, PHY: 79} },
            { id: 'h5', name: 'Bellingham', nr: 5, pos: 'ZM', team: 'home', isStarter: true, isPresent: true, rat: 88, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stats: {PAC: 76, SHO: 75, PAS: 79, DRI: 85, DEF: 78, PHY: 82} },
            // ... (Hier würden im Live-System alle 11 Heimspieler stehen)

            // GASTTEAM (BLAU)
            { id: 'a1', name: 'Opponent 1', nr: 1, pos: 'TW', team: 'away', isStarter: true, isPresent: true, rat: 82, flag: '🇪🇺', stats: {PAC: 80, SHO: 80, PAS: 80, DRI: 80, DEF: 80, PHY: 80} },
            { id: 'a2', name: 'Opponent 2', nr: 4, pos: 'IV', team: 'away', isStarter: true, isPresent: true, rat: 81, flag: '🇪🇺', stats: {PAC: 70, SHO: 50, PAS: 65, DRI: 60, DEF: 82, PHY: 85} }
            // ... (Hier würden alle 11 Gastspieler stehen)
        ];

        // Wir füllen den Kader automatisch auf 11 vs 11 auf, falls oben welche fehlen
        while (initialPlayers.filter(p => p.team === 'home').length < 11) {
            const i = initialPlayers.filter(p => p.team === 'home').length + 1;
            initialPlayers.push({ id: 'h'+i, name: 'Spieler '+i, nr: i, pos: 'FLD', team: 'home', isStarter: true, isPresent: true, rat: 80, flag: '🏳️', stats: {PAC: 75, SHO: 75, PAS: 75, DRI: 75, DEF: 75, PHY: 75} });
        }
        while (initialPlayers.filter(p => p.team === 'away').length < 11) {
            const i = initialPlayers.filter(p => p.team === 'away').length + 1;
            initialPlayers.push({ id: 'a'+i, name: 'Gegner '+i, nr: i, pos: 'FLD', team: 'away', isStarter: true, isPresent: true, rat: 78, flag: '🏳️', stats: {PAC: 70, SHO: 70, PAS: 70, DRI: 70, DEF: 70, PHY: 70} });
        }

        localStorage.setItem('toni_players', JSON.stringify(initialPlayers));
    },

    // 3. DATEN ABRUFEN
    getPlayers: function() {
        return JSON.parse(localStorage.getItem('toni_players')) || [];
    },

    // 4. DATEN AKTUALISIEREN (Mit Event-Trigger für die Arena)
    updatePlayer: function(id, patch) {
        let players = this.getPlayers();
        const index = players.findIndex(p => p.id === id);
        
        if (index !== -1) {
            players[index] = { ...players[index], ...patch };
            localStorage.setItem('toni_players', JSON.stringify(players));
            
            // WICHTIG: Signal an alle anderen (Arena, Sporttasche), dass sich was geändert hat
            if (window.ToniEvents) {
                window.ToniEvents.emit('players:updated', players);
            }
            return true;
        }
        return false;
    },

    // 5. KOMPLETT-RESET (Falls man neu anfangen will)
    reset: function() {
        localStorage.removeItem('toni_players');
        this.init();
        window.location.reload();
    }
};
