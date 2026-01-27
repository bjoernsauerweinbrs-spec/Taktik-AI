/**
 * Toni 2.0 - Storage Engine
 * Verwaltet Kader, Bewertungen und die Aktentasche (Saison-Archiv)
 */

const ToniStorage = {
    // Keys für den LocalStorage
    KEYS: {
        PLAYERS: 'toni_players',
        ARCHIVE: 'toni_archive',
        CONFIG: 'toni_config'
    },

    // --- KADER MANAGEMENT ---
    
    getPlayers: function() {
        const data = localStorage.getItem(this.KEYS:PLAYERS);
        return data ? JSON.parse(data) : [];
    },

    savePlayer: function(player) {
        let players = this.getPlayers();
        const index = players.findIndex(p => p.id === player.id);
        
        if (index > -1) {
            players[index] = player; // Update
        } else {
            players.push(player); // Neu
        }
        
        localStorage.setItem(this.KEYS.PLAYERS, JSON.stringify(players));
        this.updateUI();
    },

    deletePlayer: function(id) {
        let players = this.getPlayers().filter(p => p.id !== id);
        localStorage.setItem(this.KEYS.PLAYERS, JSON.stringify(players));
        this.updateUI();
    },

    // --- BEWERTUNGSSYSTEM (Die 5 Kategorien) ---

    addAssessment: function(playerId, values) {
        let players = this.getPlayers();
        let player = players.find(p => p.id === playerId);
        
        if (player) {
            if (!player.history) player.history = [];
            
            player.history.push({
                date: new Date().toISOString(),
                stats: {
                    kondition: values.kondition || 3,
                    technik: values.technik || 3,
                    taktik: values.taktik || 3,
                    teamgeist: values.teamgeist || 3,
                    koordination: values.koordination || 3
                },
                mode: localStorage.getItem('toni_active_mode')
            });

            // Nur die letzten 20 Einträge behalten (wie vom Manager gewünscht)
            if (player.history.length > 20) player.history.shift();
            
            this.savePlayer(player);
        }
    },

    // --- AKTENTASCHE (Trainings-Archiv) ---

    saveToArchive: function(sessionData) {
        let archive = this.getArchive();
        archive.push({
            id: 'session_' + Date.now(),
            date: new Date().toLocaleString(),
            trainer: localStorage.getItem('toni_trainer_name'),
            title: sessionData.title || "Trainingseinheit",
            notes: sessionData.notes || "",
            boardState: sessionData.boardState // Screenshot/Positionen
        });
        
        localStorage.setItem(this.KEYS.ARCHIVE, JSON.stringify(archive));
    },

    getArchive: function() {
        const data = localStorage.getItem(this.KEYS.ARCHIVE);
        return data ? JSON.parse(data) : [];
    },

    // --- UI UPDATE TRIGGER ---

    updateUI: function() {
        // Diese Funktion wird in der app.html / board.js überschrieben, 
        // um die Spielerliste links neu zu zeichnen.
        if (typeof renderPlayerList === 'function') {
            renderPlayerList();
        }
    }
};

// Beispielhafter Spieler-Bauplan für den Manager:
/*
{
    id: "uuid-123",
    name: "David Luiz",
    number: "23",
    status: "green", // green, yellow, red, gray
    history: [ { date: "...", stats: {...} } ]
}
*/
