/* js/logic.js 
   Zuständig für: KI-Fachwissen, brasilianische Taktik-Prinzipien, 
   altersgerechte Ernährung und Performance-Berechnungen
*/

const ToniLogic = {
    
    // 1. DER SYSTEM-PROMPT (Tonis Fachwissen-Identität)
    // Diese Instruktion wird bei jeder Anfrage an Groq mitgeschickt
    getSystemInstruction(trainerName, modus) {
        return `Du bist Toni, ein Weltklasse-Fußball-Co-Trainer mit brasilianischer Seele. 
        Du arbeitest für Coach ${trainerName}.
        
        DEIN CHARAKTER:
        - Deine Stimme ist männlich, fachmännisch, ruhig und inspirierend.
        - Dein Stil ist "Jogo Bonito": Du liebst technische Finesse, Rotation und Mut im 1vs1.
        
        DEINE EXPERTISE:
        - Taktik: Du bist Experte für das Verschieben im Block (11vs11) und Funino (3vs3).
        - Analyse: Du erkennst Räume (Half-Spaces) und gibst präzise Coaching-Points.
        - Ernährung: Du berätst altersgerecht (U11, U15, U19, Herren).
        
        ANWEISUNGEN FÜR DAS BOARD:
        - Modus: ${modus}. 
        - Wenn du Übungen vorschlägst, nenne immer: Titel, Dauer, Material und Coaching-Points.
        - Visualisierung: Beschreibe Laufwege als "brasilianische Kurven" – flüssig und raumschaffend.
        
        Wichtig: Bleibe immer der loyale Fachmann an der Seite von Coach ${trainerName}.`;
    },

    // 2. DAS PUNKTESYSTEM (Auswertung für die Aktentasche)
    // Berechnet den Gesamtscore basierend auf deinen 5 Kategorien
    calculateTotalScore(p) {
        if (!p || !p.stats) return 0;
        const s = p.stats;
        // Gewichtung: Technik und Taktik zählen in deinem brasilianischen Stil am meisten
        const total = (s.kondition * 0.15) + 
                      (s.uebersicht * 0.20) + 
                      (s.technik * 0.30) + 
                      (s.taktik * 0.25) + 
                      (s.sonderpunkte * 0.10);
        return Math.round(total);
    },

    // 3. KI-ERNÄHRUNGSBERATUNG (Altersentsprechend)
    // Diese Funktion liefert Toni die Fakten für die Live-Beratung
    getNutritionAdvice(ageGroup) {
        const advice = {
            "U11": {
                fokus: "Wachstum & Energie",
                tipps: [
                    "Viel Obst und Gemüse für die Regeneration.",
                    "Ausreichend Wasser vor und während des Trainings.",
                    "Keine Energy-Drinks! Natürliche Schorlen bevorzugen.",
                    "Kohlenhydrate (Nudeln/Reis) 3 Stunden vor dem Spiel."
                ],
                warnung: "Vermeide zu viel Zucker direkt vor dem Spiel."
            },
            "U15": {
                fokus: "Muskelaufbau & Ausdauer",
                tipps: [
                    "Erhöhter Proteinbedarf (Hülsenfrüchte, helles Fleisch, Quark).",
                    "Vollkornprodukte für langanhaltende Energie.",
                    "Magnesium gegen Krämpfe bei hoher Intensität.",
                    "Regenerations-Snack (Banane) direkt nach dem Training."
                ]
            },
            "U19/Herren": {
                fokus: "Maximale Performance & Regeneration",
                tipps: [
                    "Gezieltes Carbo-Loading 24h vor dem Wettkampf.",
                    "Optimierung des Elektrolythaushalts.",
                    "Hochwertige Fette (Omega-3) zur Entzündungshemmung.",
                    "Individualisierte Flüssigkeitsstrategie."
                ]
            }
        };

        return advice[ageGroup] || advice["U19/Herren"];
    },

    // 4. BRASILIANISCHE TAKTIK-LOGIK (Bewegungsregeln)
    // Definiert, wie Toni die "roten Spieler" taktisch bewegen soll
    getTacticalMove(playerId, ballPosition) {
        // Beispiel-Logik: Ein brasilianischer Verteidiger wie David Luiz 
        // rückt bei Ballbesitz aktiv ins Mittelfeld ein, um das Spiel aufzubauen.
        if (playerId.includes('DL4')) { // Speziell für David Luiz
            return {
                action: "Inverted Fullback / Libero",
                targetSpace: "Zentrum / Zone 14",
                instruction: "Übernimm die Spielgestaltung und schaffe Überzahl."
            };
        }
        return null;
    }
};
