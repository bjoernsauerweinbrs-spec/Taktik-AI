/**
 * =========================================
 * TONI 2.0 – TACTICAL AI ENGINE
 * Geometrische Analyse & Aktive Korrektur
 * =========================================
 */
(function() {
    window.AnalysisAI = {
        config: {
            gapThreshold: 120, 
            defensiveZoneY: 0.6 
        },

        // 1. ANALYSE: Scannt das Spielfeld
        scanBoard() {
            const players = window.arena.players;
            const homeTeam = players.filter(p => p.team === 'home');
            const awayTeam = players.filter(p => p.team === 'away');

            if (homeTeam.length < 4) return "Björn, ich brauche mindestens vier Verteidiger für eine Analyse.";

            const defenseLine = this.detectBackFour(homeTeam);
            const gaps = this.findGaps(defenseLine);
            const threats = this.detectThreats(awayTeam, defenseLine);

            return this.generateReport(defenseLine, gaps, threats);
        },

        // 2. AKTION: Korrigiert die Positionen aktiv
        fixDefenseLine() {
            const homeTeam = window.arena.players.filter(p => p.team === 'home');
            if (homeTeam.length < 4) return;

            const defenseLine = this.detectBackFour(homeTeam);
            const canvasW = window.arena.canvas.width;
            
            // Berechnung der idealen Werte
            const idealY = defenseLine.reduce((acc, p) => acc + p.y, 0) / defenseLine.length;
            const spacing = canvasW / 5;

            // Toni verschiebt die Spieler (Brasilianischer Stil: Harmonische Verteilung)
            defenseLine.forEach((player, index) => {
                player.x = spacing * (index + 1);
                player.y = idealY;
            });

            if (window.toniSpeak) {
                window.toniSpeak("Ich habe die Kette korrigiert, Björn. Jetzt stehen wir kompakt und lassen keine Schnittstellen mehr zu.");
            }
            
            console.log("🛡️ Taktische Korrektur ausgeführt.");
        },

        detectBackFour(team) {
            const sortedByY = [...team].sort((a, b) => b.y - a.y);
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
            const lineY = defenseLine[0].y;
            return opponents.filter(opp => opp.y > lineY - 50);
        },

        generateReport(line, gaps, threats) {
            if (gaps.length > 0) {
                return `Ich sehe eine Lücke zwischen ${gaps[0].p1.name} und ${gaps[0].p2.name}. Soll ich die Kette korrigieren?`;
            }
            return "Die Abwehr steht stabil. Sehr gut gearbeitet.";
        }
    };
})();
