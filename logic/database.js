window.ToniDB = {
    init: function() {
        if (!localStorage.getItem('toni_players')) {
            console.log("ToniDB: Initialisiere Profi-Kader (22 Spieler)...");
            this.seed();
        }
    },

    seed: function() {
        const initialPlayers = [
            // --- HEIMTEAM (ROT) - 11 SPIELER ---
            { id: 'h1', name: 'Alisson', nr: 1, pos: 'TW', team: 'home', isStarter: true, isPresent: true, rat: 89, country: 'BRA', stats: {PAC: 86, SHO: 85, PAS: 85, DRI: 89, DEF: 54, PHY: 90} },
            { id: 'h2', name: 'Marquinhos', nr: 4, pos: 'IV', team: 'home', isStarter: true, isPresent: true, rat: 87, country: 'BRA', stats: {PAC: 79, SHO: 53, PAS: 75, DRI: 74, DEF: 89, PHY: 80} },
            { id: 'h3', name: 'E. Militao', nr: 3, pos: 'IV', team: 'home', isStarter: true, isPresent: true, rat: 86, country: 'BRA', stats: {PAC: 82, SHO: 50, PAS: 70, DRI: 72, DEF: 86, PHY: 82} },
            { id: 'h4', name: 'Danilo', nr: 2, pos: 'RV', team: 'home', isStarter: true, isPresent: true, rat: 81, country: 'BRA', stats: {PAC: 78, SHO: 68, PAS: 77, DRI: 78, DEF: 81, PHY: 80} },
            { id: 'h5', name: 'Casemiro', nr: 5, pos: 'CDM', team: 'home', isStarter: true, isPresent: true, rat: 89, country: 'BRA', stats: {PAC: 63, SHO: 73, PAS: 75, DRI: 72, DEF: 87, PHY: 90} },
            { id: 'h6', name: 'Bruno G.', nr: 8, pos: 'ZM', team: 'home', isStarter: true, isPresent: true, rat: 84, country: 'BRA', stats: {PAC: 72, SHO: 75, PAS: 82, DRI: 83, DEF: 79, PHY: 80} },
            { id: 'h7', name: 'Paqueta', nr: 10, pos: 'ZOM', team: 'home', isStarter: true, isPresent: true, rat: 82, country: 'BRA', stats: {PAC: 76, SHO: 80, PAS: 82, DRI: 83, DEF: 70, PHY: 78} },
            { id: 'h8', name: 'Vini Jr.', nr: 7, pos: 'LF', team: 'home', isStarter: true, isPresent: true, rat: 91, country: 'BRA', stats: {PAC: 97, SHO: 82, PAS: 79, DRI: 92, DEF: 34, PHY: 68} },
            { id: 'h9', name: 'Rodrygo', nr: 11, pos: 'RF', team: 'home', isStarter: true, isPresent: true, rat: 85, country: 'BRA', stats: {PAC: 88, SHO: 81, PAS: 79, DRI: 86, DEF: 32, PHY: 58} },
            { id: 'h10', name: 'Neymar Jr', nr: 10, pos: 'ST', team: 'home', isStarter: true, isPresent: true, rat: 89, country: 'BRA', stats: {PAC: 82, SHO: 83, PAS: 85, DRI: 93, DEF: 37, PHY: 61} },
            { id: 'h11', name: 'Richarlison', nr: 9, pos: 'ST', team: 'home', isStarter: true, isPresent: true, rat: 81, country: 'BRA', stats: {PAC: 82, SHO: 82, PAS: 73, DRI: 82, DEF: 43, PHY: 80} },

            // --- GASTTEAM (BLAU) - 11 SPIELER ---
            { id: 'a1', name: 'Opponent 1', nr: 1, pos: 'TW', team: 'away', isStarter: true, isPresent: true, rat: 82, country: 'EUR', stats: {PAC: 80, SHO: 80, PAS: 80, DRI: 80, DEF: 80, PHY: 80} },
            { id: 'a2', name: 'Opponent 2', nr: 2, pos: 'RV', team: 'away', isStarter: true, isPresent: true, rat: 80, country: 'EUR', stats: {PAC: 75, SHO: 60, PAS: 70, DRI: 70, DEF: 80, PHY: 80} },
            { id: 'a3', name: 'Opponent 3', nr: 4, pos: 'IV', team: 'away', isStarter: true, isPresent: true, rat: 81, country: 'EUR', stats: {PAC: 70, SHO: 50, PAS: 65, DRI: 60, DEF: 82, PHY: 85} },
            { id: 'a4', name: 'Opponent 4', nr: 5, pos: 'IV', team: 'away', isStarter: true, isPresent: true, rat: 80, country: 'EUR', stats: {PAC: 68, SHO: 45, PAS: 60, DRI: 58, DEF: 81, PHY: 88} },
            { id: 'a5', name: 'Opponent 5', nr: 3, pos: 'LV', team: 'away', isStarter: true, isPresent: true, rat: 79, country: 'EUR', stats: {PAC: 82, SHO: 55, PAS: 72, DRI: 74, DEF: 78, PHY: 75} },
            { id: 'a6', name: 'Opponent 6', nr: 6, pos: 'CDM', team: 'away', isStarter: true, isPresent: true, rat: 82, country: 'EUR', stats: {PAC: 65, SHO: 60, PAS: 80, DRI: 75, DEF: 82, PHY: 82} },
            { id: 'a7', name: 'Opponent 7', nr: 8, pos: 'ZM', team: 'away', isStarter: true, isPresent: true, rat: 80, country: 'EUR', stats: {PAC: 72, SHO: 75, PAS: 78, DRI: 77, DEF: 72, PHY: 74} },
            { id: 'a8', name: 'Opponent 8', nr: 10, pos: 'ZOM', team: 'away', isStarter: true, isPresent: true, rat: 83, country: 'EUR', stats: {PAC: 78, SHO: 81, PAS: 82, DRI: 84, DEF: 45, PHY: 70} },
            { id: 'a9', name: 'Opponent 9', nr: 7, pos: 'LF', team: 'away', isStarter: true, isPresent: true, rat: 84, country: 'EUR', stats: {PAC: 89, SHO: 82, PAS: 78, DRI: 85, DEF: 35, PHY: 65} },
            { id: 'a10', name: 'Opponent 10', nr: 11, pos: 'RF', team: 'away', isStarter: true, isPresent: true, rat: 82, country: 'EUR', stats: {PAC: 87, SHO: 80, PAS: 75, DRI: 83, DEF: 30, PHY: 60} },
            { id: 'a11', name: 'Opponent 11', nr: 9, pos: 'ST', team: 'away', isStarter: true, isPresent: true, rat: 85, country: 'EUR', stats: {PAC: 84, SHO: 86, PAS: 70, DRI: 81, DEF: 40, PHY: 82} }
        ];

        localStorage.setItem('toni_players', JSON.stringify(initialPlayers));
    },

    getPlayers: function() {
        const data = localStorage.getItem('toni_players');
        return data ? JSON.parse(data) : [];
    },

    updatePlayer: function(id, patch) {
        let players = this.getPlayers();
        const index = players.findIndex(p => p.id === id);
        
        if (index !== -1) {
            players[index] = { ...players[index], ...patch };
            localStorage.setItem('toni_players', JSON.stringify(players));
            
            if (window.ToniEvents) {
                window.ToniEvents.emit('players:updated', players);
            }
            return true;
        }
        return false;
    },

    reset: function() {
        localStorage.removeItem('toni_players');
        this.init();
        window.location.reload();
    }
};
