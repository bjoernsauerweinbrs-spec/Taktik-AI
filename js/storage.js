/* js/storage.js 
   Zuständig für: Kaderverwaltung, Ampelsystem, Aktentaschen-Archiv, 
   Punktesystem (Kondition, Übersicht, Technik, Taktik) und Persistenz 
*/

const ToniStorage = {
    
    // 1. AUTHENTIFIZIERUNG & TRAINER-IDENTITÄT
    saveAuthConfig(name, apiKey) {
        localStorage.setItem('toni_trainer_name', name);
        localStorage.setItem('toni_api_key', apiKey);
    },

    getAuthConfig() {
        return {
            name: localStorage.getItem('toni_trainer_name') || 'Trainer',
            apiKey: localStorage.getItem('toni_api_key') || ''
        };
    },

    // 2. KADER-MANAGEMENT & AMPELSYSTEM
    // Speichert den kompletten Kader inklusive aller Leistungsdaten
    saveKader(kaderData) {
        localStorage.setItem('toni_kader', JSON.stringify(kaderData));
    },

    getKader() {
        const savedKader = localStorage.getItem('toni_kader');
        if (savedKader) {
            return JSON.parse(savedKader);
        } else {
            // Initialer Standard-Kader (Beispiel: David Luiz)
            return [
                { 
                    id: 'home_dl4', 
                    name: 'David Luiz', 
                    nummer: 4, 
                    status: 'green', // Ampel: green=Teilnahme, yellow=Nur Training, red=Abwesend
                    onPitch: true,   // Ob der Spieler in der Startelf/auf dem Feld ist
                    stats: { 
                        kondition: 85, 
                        uebersicht: 90, 
                        technik: 95, 
                        taktik: 88, 
                        sonderpunkte: 5 
                    },
                    history: [] // Für spätere Leistungsentwicklung
                }
            ];
        }
    },

    // 3. AKTENTASCHE: ARCHIV FÜR TRAININGSDOKUMENTE
    // Speichert eine abgeschlossene Einheit mit Trainername und Zeitstempel
    saveTrainingSession(sessionText) {
        const config = this.getAuthConfig();
        const archiv = this.getArchiv();
        
        const newEntry = {
            id: 'session_' + Date.now(),
            trainer: config.name,
            datum: new Date().toLocaleDateString('de-DE'),
            uhrzeit: new Date().toLocaleTimeString('de-DE'),
            titel: "Trainingseinheit " + new Date().toLocaleDateString(),
            inhalt: sessionText,
            timestamp: Date.now()
        };

        archiv.push(newEntry);
        localStorage.setItem('toni_archiv', JSON.stringify(archiv));
        return newEntry;
    },

    getArchiv() {
        const archiv = localStorage.getItem('toni_archiv');
        return archiv ? JSON.parse(archiv) : [];
    },

    deleteFromArchiv(id) {
        let archiv = this.getArchiv();
        archiv = archiv.filter(entry => entry.id !== id);
        localStorage.setItem('toni_archiv', JSON.stringify(archiv));
    },

    // 4. SPEZIAL: ERNÄHRUNGSVORSCHLÄGE (CACHE)
    // Damit Toni sich merkt, was er zuletzt für welche Altersgruppe empfohlen hat
    saveNutritionAdvice(ageGroup, advice) {
        const nutritionData = JSON.parse(localStorage.getItem('toni_nutrition')) || {};
        nutritionData[ageGroup] = {
            text: advice,
            date: new Date().toISOString()
        };
        localStorage.setItem('toni_nutrition', JSON.stringify(nutritionData));
    }
};

// Initialisierung der Datenstrukturen, falls sie leer sind
if (!localStorage.getItem('toni_kader')) {
    ToniStorage.saveKader(ToniStorage.getKader());
}
