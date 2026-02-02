/**
 * =========================================
 * TONI 2.0 – TACTICAL AI ENGINE
 * Geometrische Analyse & Mustererkennung
 * =========================================
 */
(function() {
    window.AnalysisAI = {
        config: {
            gapThreshold: 120, // Max. Abstand in der Kette
            defensiveZoneY: 0.6 // Ab wann zählt es als Abwehr (60% des Feldes)
        },

        // Startet den Scan des aktuellen Board-Zustands
        scanBoard() {
            console.log("🧠 Toni scannt das Spielfeld...");
            const players = window.arena.players;
            const homeTeam = players.filter(p => p.team === 'home');
            const awayTeam = players.filter(p => p.team === 'away');

            if (homeTeam.length < 4) return "Nicht genug Spieler für eine Kettenanalyse.";

            // 1. Suche nach der Abwehrkette (tiefste Spieler)
            const defenseLine = this.detectBackFour(homeTeam);
            
            // 2. Suche nach Lücken in der Kette
            const gaps = this.findGaps(defenseLine);

            // 3. Suche nach gefährlichen Gegnern
            const threats = this.detectThreats(awayTeam, defenseLine);

            return this.generateReport(defenseLine, gaps, threats);
        },

        detectBackFour(team) {
            // Sortiere Spieler nach Y (von oben nach unten) und nimm die hintersten
            const sortedByY = [...team].sort((a, b) => b.y - a.y);
            // Die 4 Spieler mit den höchsten Y-Werten (am weitesten hinten)
            return sortedByY.slice(0, 4).sort((a, b) => a.x - b.x);
        },

        findGaps(line) {
            let foundGaps = [];
            for (let i = 0; i < line.length - 1; i++) {
                const dist = line[i+1].x - line[i].x;
                if (dist > this.config.gapThreshold) {
                    foundGaps.push({ p1: line[i], p2: line[i+1], width: dist });
                }
            }
            return foundGaps;
        },

        detectThreats(opponents, defenseLine) {
            // Findet Gegner, die hinter der Kette oder in Lücken lauern
            const lineY = defenseLine[0].y;
            return opponents.filter(opp => opp.y > lineY - 50); // Gegner nahe der Kette
        },

        generateReport(line, gaps, threats) {
            let message = "";

            if (gaps.length > 0) {
                message = `Björn, ich sehe eine gefährliche Lücke in deiner Viererkette zwischen ${gaps[0].p1.name} und ${gaps[0].p2.name}. `;
            } else {
                message = "Deine defensive Grundordnung sieht stabil aus. Kompakt wie der Zuckerhut. ";
            }

            if (threats.length > 0) {
                message += `Achte auf die Nummer ${threats[0].number}, er lauert im Zwischenlinienraum.`;
            }

            return message;
        }
    };
})();
