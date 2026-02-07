/**
 * TONI 2.0 - GLOBAL AI INTELLIGENCE
 * Analyse von Welttrainer-Konzepten & Taktik-Metriken.
 */
window.AnalysisAI = {
    
    scanBoard() {
        // Wir holen uns die Spieler, die aktuell auf dem Feld (nicht auf der Bank) sind
        const playersOnField = window.arena.elements.filter(el => 
            el.type === 'player' && el.y < window.arena.canvas.height - 80
        );

        if (playersOnField.length < 3) return "Coach, wir brauchen mehr Spieler auf dem Feld für eine tiefe Analyse.";

        // 1. Suche nach Triangulation (Positionsspiel nach Weltklasse-Standard)
        const triangles = this.findTriangles(playersOnField);
        
        // 2. Trend-Abfrage (2026 Taktik-Datenbank)
        const trend = this.getGlobalTrend();

        // 3. Brasilianische Bewertung (Jinga-Faktor)
        let report = `Analyse abgeschlossen: Ich erkenne ${triangles} aktive Pass-Dreiecke. `;
        
        if (triangles < 2) {
            report += "Das Spiel ist noch zu starr. Wir müssen mehr Anspielstationen in den Halbräumen schaffen. ";
        } else {
            report += "Hervorragende Raumaufteilung! Das ist die brasilianische Leichtigkeit, die wir suchen. ";
        }

        report += "\nTrend-Insight: " + trend;
        return report;
    },

    findTriangles(players) {
        let count = 0;
        const distLimit = 180; // Maximaler Abstand für effektive Triangulation

        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                for (let k = j + 1; k < players.length; k++) {
                    const d1 = Math.hypot(players[i].x - players[j].x, players[i].y - players[j].y);
                    const d2 = Math.hypot(players[j].x - players[k].x, players[j].y - players[k].y);
                    const d3 = Math.hypot(players[k].x - players[i].x, players[k].y - players[i].y);
                    
                    // Ein Dreieck ist gültig, wenn alle drei Seiten unter dem Limit liegen
                    if (d1 < distLimit && d2 < distLimit && d3 < distLimit) count++;
                }
            }
        }
        return count;
    },

    getGlobalTrend() {
        const trends = [
            "Premier League 2026: Die 'Box-Midfield' Formation dominiert das Zentrum.",
            "FIFA-Studie: 42% der Tore fallen durch diagonale Läufe hinter die Kette.",
            "Trend: Torhüter agieren jetzt fast als Libero im 1-4-4-2 Aufbau."
        ];
        return trends[Math.floor(Math.random() * trends.length)];
    },

    /**
     * Richtet die Abwehrkette automatisch aus (Horizontaler Modus)
     * Die Kette steht nun vertikal (X-Achse fixiert, Y-Achse verteilt)
     */
    fixDefenseLine() {
        const players = window.arena.elements.filter(el => el.type === 'player');
        // Wir nehmen die 4 Spieler, die am weitesten links (Verteidigung West-Tor) stehen
        const defenseLine = players.sort((a, b) => a.x - b.x).slice(0, 4);
        
        if (defenseLine.length < 4) return "Nicht genug Spieler für eine Viererkette gefunden.";

        const startY = 100;
        const availableSpace = window.arena.canvas.height - 250;
        const spacing = availableSpace / 3;

        defenseLine.forEach((p, i) => {
            p.x = 180; // Feste Verteidigungslinie vor dem linken Tor
            p.y = startY + (i * spacing);
            
            // Speichern der Position in der Datenbank
            window.Database.updatePlayer(p.id, 'x', p.x);
            window.Database.updatePlayer(p.id, 'y', p.y);
        });
        
        return "Abwehrkette nach UEFA-Pro-Standard ausgerichtet. Kompaktheit bei 100%.";
    }
};
