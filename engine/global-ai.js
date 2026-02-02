/**
 * =========================================
 * TONI 2.0 – GLOBAL INTELLIGENCE ENGINE
 * Analyse von Welttrainer-Konzepten
 * =========================================
 */
(function() {
    window.GlobalAI = {
        // Analysiert das "Positionsspiel" (Triangulation)
        analyzePositionalPlay() {
            const players = window.arena.players.filter(p => p.team === 'home');
            let triangles = 0;

            // Suche nach Dreiecken (Spieler in Passdistanz zueinander)
            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    for (let k = j + 1; k < players.length; k++) {
                        const d1 = Math.hypot(players[i].x - players[j].x, players[i].y - players[j].y);
                        const d2 = Math.hypot(players[j].x - players[k].x, players[j].y - players[k].y);
                        const d3 = Math.hypot(players[k].x - players[i].x, players[k].y - players[i].y);
                        
                        // Wenn alle Distanzen < 150px, haben wir ein taktisches Dreieck
                        if (d1 < 150 && d2 < 150 && d3 < 150) triangles++;
                    }
                }
            }

            if (triangles < 2) {
                return "Björn, wir brauchen mehr Dreiecke im Spielaufbau. Die Spieler stehen zu isoliert – kein brasilianischer Flow!";
            }
            return `Ich sehe ${triangles} aktive Dreiecke. Das ist Weltklasse-Niveau, wir kontrollieren den Raum.`;
        },

        // Strategie-Update für Weltweite Trends 2026
        getTacticalUpdate() {
            const hour = new Date().getHours();
            if (hour < 12) return "Frische Analyse aus der Premier League: Teams nutzen vermehrt lange Einwürfe als taktisches Mittel im letzten Drittel.";
            return "Trend-Check: Top-Teams verzichten vermehrt auf kurzes Rausspielen beim Abstoß, wenn der Gegner hoch presst – Sicherheit geht vor.";
        }
    };
})();
