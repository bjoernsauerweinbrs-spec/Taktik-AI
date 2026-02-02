/**
 * =========================================
 * TONI 2.0 – UEFA PRO DRILL LIBRARY
 * Intelligente Übungsauswahl basierend auf Board-Analyse
 * =========================================
 */
(function() {
    window.TrainingLibrary = {
        // Die Datenbank der Übungen
        drills: {
            defense_gap: {
                title: "Ketten-Kompaktheit: 4vs4 + 3",
                description: "Viererkette verteidigt gegen 4 Angreifer. 3 neutrale Spieler im Mittelfeld provozieren Spielverlagerungen.",
                coaching_points: ["Verschieben zum Ball", "Abstände einhalten (max. 10m)", "Kommunikation beim Übergeben"],
                uefa_level: "Pro",
                duration: "20 Min"
            },
            positional_play: {
                title: "Triangulation: Rondo 4vs4 + 3",
                description: "Positionsspiel in drei Zonen. Fokus auf Dreiecksbildung und Überzahl in Ballnähe.",
                coaching_points: ["Offene Stellung", "Winkel zum Mitspieler", "Vororientierung"],
                uefa_level: "Elite",
                duration: "15 Min"
            },
            funinho_transition: {
                title: "Funinho: Umschalten 3vs3",
                description: "Spiel auf 4 Mini-Tore. Nach Ballgewinn sofortiges Spiel in die Breite.",
                coaching_points: ["Raumbesetzung", "Tiefe nach Ballgewinn", "Gegenpressing"],
                uefa_level: "Grassroots-Pro",
                duration: "12 Min"
            }
        },

        // Gibt eine Empfehlung basierend auf dem Analyse-Ergebnis
        getRecommendation(analysisKey) {
            const drill = this.drills[analysisKey];
            if (!drill) return null;

            return `
                <div class="drill-card animate-slide-in">
                    <div class="drill-badge">${drill.uefa_level} Level</div>
                    <h4>${drill.title}</h4>
                    <p>${drill.description}</p>
                    <div class="drill-meta">
                        <span>⏱️ ${drill.duration}</span>
                        <span>🎯 ${drill.coaching_points.length} Coaching-Points</span>
                    </div>
                </div>
            `;
        }
    };
})();
