/**
 * =========================================
 * TONI 2.0 – TACTICAL AI (FUNINHO UPDATE)
 * =========================================
 */
(function() {
    window.AnalysisAI = {
        scanBoard() {
            const mode = window.arena.mode;
            if (mode === 'funinho') return this.analyzeFuninho();
            return this.analyzeStandard();
        },

        analyzeStandard() {
            const homeTeam = window.arena.players.filter(p => p.team === 'home');
            if (homeTeam.length < 4) return "Nicht genug Spieler für Kettenanalyse.";
            
            const sorted = [...homeTeam].sort((a, b) => b.y - a.y).slice(0, 4).sort((a, b) => a.x - b.x);
            let gap = false;
            for (let i = 0; i < sorted.length - 1; i++) {
                if (Math.abs(sorted[i+1].x - sorted[i].x) > 130) gap = true;
            }
            
            return gap ? "Björn, da ist eine Schnittstelle in der Kette. Soll ich sie schließen?" : "Abwehr steht kompakt.";
        },

        analyzeFuninho() {
            const homeTeam = window.arena.players.filter(p => p.team === 'home');
            if (homeTeam.length !== 3) return "Funinho-Analyse erfordert genau 3 Spieler pro Team.";

            // Analyse der Dreiecksbildung (Raumbesetzung)
            const centerX = homeTeam.reduce((acc, p) => acc + p.x, 0) / 3;
            const spread = Math.max(...homeTeam.map(p => p.x)) - Math.min(...homeTeam.map(p => p.x));

            if (spread < 150) {
                return "Wir stehen zu eng! Zieh das Spiel in die Breite, um beide Mini-Tore zu bedrohen.";
            }
            return "Gute Raumaufteilung. Wir können beide Tore effektiv attackieren.";
        },

        fixDefenseLine() {
            // Bestehende Korrektur-Logik
            const defenseLine = window.arena.players.filter(p => p.team === 'home').sort((a,b) => a.x - b.x);
            const spacing = window.arena.canvas.width / 5;
            defenseLine.forEach((p, i) => {
                p.x = spacing * (i + 1);
                p.y = 400;
            });
            window.toniSpeak("Kette korrigiert. Kompaktheit ist wiederhergestellt.");
        }
    };
})();
