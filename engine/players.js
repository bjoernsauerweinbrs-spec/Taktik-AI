/**
 * =========================================
 * TONI 2.0 – PLAYERS LOGIC
 * Datenverwaltung für den Kader
 * =========================================
 */
(function() {
    window.PlayerEngine = {
        // Hilfsfunktion zum Erzeugen neuer Spieler-Objekte
        createPlayer(id, name, number, team, x, y) {
            return {
                id: id,
                name: name,
                number: number,
                team: team, // 'home' oder 'away'
                x: x,
                y: y,
                color: team === 'home' ? '#FF6A00' : '#00D1FF'
            };
        }
    };
})();
