/**
 * TONI 2.0 - YOUTH MANAGER LOGIC
 * Verwaltet Altersklassen, Spielfeld-Vorgaben und Kader-Filterung.
 */
window.YouthManager = {
    // Definition der Spielfeld-Typen
    rules: {
        "G-Jugend": { field: "3vs3", goals: 4, zones: "6m-Schusszone", ball: 3 },
        "F-Jugend": { field: "5vs5", goals: 2, zones: "Kleinfeld", ball: 3 },
        "E-Jugend": { field: "7vs7", goals: 2, zones: "Halbfeld", ball: 4 },
        "D-Jugend": { field: "9vs9", goals: 2, zones: "Kompaktfeld", ball: 4 },
        "A-B-C-Jugend": { field: "11vs11", goals: 2, zones: "Grossfeld", ball: 5 }
    },

    /**
     * Filtert Spieler aus der Preset-Datenbank nach Altersklasse
     */
    getPlayersByGroup(group) {
        if (!window.YouthPresets) return [];
        return window.YouthPresets.musterspieler.filter(p => p.jugend === group);
    },

    /**
     * Bereitet die Arena-Daten vor (wird morgen mit arena.js verknüpft)
     */
    applyYouthRules(group) {
        const setting = this.rules[group] || this.rules["A-B-C-Jugend"];
        console.log(`TONI-LOGIK: Wende ${group}-Regeln an:`, setting);
        
        // Hier triggern wir morgen die visuelle Verwandlung
        if(window.chat) {
            // Falls dein Chat-System global erreichbar ist
            // window.chat.addMessage("TONI", `${group} Modus aktiviert. Tore: ${setting.goals}`);
        }
        
        return setting;
    }
};
