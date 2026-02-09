/**
 * TONI 2.0 - YOUTH MANAGER LOGIC
 * Verwaltung der Altersklassen, Regeln und Kader-Filterung.
 */
window.YouthManager = {
    // Die offiziellen Vorgaben für TONI
    rules: {
        "G-Jugend": { field: "3vs3 Funino", goals: 4, zones: "6m Schusszone", ball: "3er Leicht", zeit: "7-10 Min pro Spiel" },
        "F-Jugend": { field: "5vs5 / 7vs7", goals: 2, zones: "Kleinfeld", ball: "3er/4er Leicht", zeit: "12 Min pro Spiel" },
        "E-Jugend": { field: "7vs7", goals: 2, zones: "Halbfeld", ball: "4er", zeit: "15-20 Min pro Spiel" },
        "D-Jugend": { field: "9vs9", goals: 2, zones: "Kompaktfeld", ball: "4er/5er", zeit: "20-25 Min pro Spiel" },
        "Standard": { field: "11vs11", goals: 2, zones: "Großfeld", ball: "5er", zeit: "Ab 35 Min pro Spiel" }
    },

    /**
     * Filtert die Musterspieler aus youth-presets.js
     */
    getKader(jugendKlasse) {
        if (!window.YouthPresets) return [];
        return window.YouthPresets.musterspieler.filter(p => p.jugend === jugendKlasse);
    },

    /**
     * Gibt die Trainings-Regeln für TONI zurück
     */
    getTrainingTemplate(jugendKlasse) {
        return this.rules[jugendKlasse] || this.rules["Standard"];
    }
};
