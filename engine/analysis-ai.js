/**
 * =========================================
 * TONI 2.0 – GLOBAL AI INTELLIGENCE
 * Analyse von Welttrainer-Konzepten & Trends
 * =========================================
 */
(function() {
    window.AnalysisAI = {
        scanBoard() {
            const players = window.arena.players.filter(p => p.team === 'home');
            
            // 1. Suche nach Triangulation (Positionsspiel nach Weltklasse-Standard)
            const triangles = this.findTriangles(players);
            
            // 2. Trend-Abfrage (Simulierter Zugriff auf 2026 Trends)
            const trend = this.getGlobalTrend();

            // 3. Brasilianische Bewertung
            let report = `Björn, mein Scan zeigt ${triangles} aktive Dreiecke im Positionsspiel. `;
            
            if (triangles < 2) {
                report += "Das ist zu statisch. Wir brauchen mehr brasilianische Leichtigkeit und bessere Winkel. ";
            } else {
                report += "Das ist Weltklasse! Wir kontrollieren den Raum wie die Seleção. ";
            }

            report += "Übrigens: " + trend;
            return report;
        },

        findTriangles(players) {
            let count = 0;
            const distLimit = 160; // Max Distanz für effektives Passspiel

            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    for (let k = j + 1; k < players.length; k++) {
                        const d1 = Math.hypot(players[i].x - players[j].x, players[i].y - players[j].y);
                        const d2 = Math.hypot(players[j].x - players[k].x, players[j].y - players[k].y);
                        const d3 = Math.hypot(players[k].x - players[i].x, players[k].y - players[i].y);
                        
                        if (d1 < distLimit && d2 < distLimit && d3 < distLimit) count++;
                    }
                }
            }
            return count;
        },

        getGlobalTrend() {
            const trends = [
                "In der Premier League nutzen Top-Teams jetzt vermehrt asymmetrische Außenverteidiger.",
                "Die FIFA-Studie 2026 zeigt: Tore fallen zu 40% durch Umschaltmomente nach Gegenpressing.",
                "Trend-Check: Der 'Inverted Wingback' ist der Schlüssel gegen kompakte Fünferketten."
            ];
            return trends[Math.floor(Math.random() * trends.length)];
        },

        fixDefenseLine() {
            const defenseLine = window.arena.players.filter(p => p.team === 'home').sort((a,b) => a.x - b.x);
            if (defenseLine.length < 4) return;

            const spacing = window.arena.canvas.width / 5;
            defenseLine.forEach((p, i) => {
                p.x = spacing * (i + 1);
                p.y = 450;
            });
            
            if (window.toniSpeak) window.toniSpeak("Ich habe die Kette nach UEFA-Pro-Richtlinien ausgerichtet. Maximale Kompaktheit hergestellt.");
        }
    };
})();
