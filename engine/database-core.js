/**
 * TONI 2.0 - DATABASE CORE (ELITE EDIT SYNC 2026)
 * Fokus: Stabiler Datenspeicher & Fehler-Prävention (Anti-Verschwinden-Schutz)
 */
window.Database = {
    players: [],
    sponsors: [],
    
    init() {
        console.log("📂 Datenbank-Bootvorgang...");
        try {
            const saved = localStorage.getItem('toni_database_2026');
            if (saved) {
                const data = JSON.parse(saved);
                this.players = data.players || [];
                this.sponsors = data.sponsors || [];
            }
        } catch (e) {
            console.error("Datenbank-Lesefehler, starte Notfall-Recovery...");
        }

        // Füllt den Kader auf, falls er leer ist oder Spieler fehlen
        this.injectEliteSeedData();
        
        console.log(`✅ Sync abgeschlossen: ${this.players.length} Einheiten aktiv.`);
    },

    // Notfall-Funktion: Falls mal alles weg ist, tippe Database.hardReset() in die Konsole
    hardReset() {
        localStorage.removeItem('toni_database_2026');
        location.reload();
    },

    save() {
        try {
            // Wir filtern korrupte Daten (NaN-Positionen) vor dem Speichern raus
            this.players.forEach(p => {
                if (isNaN(p.x)) p.x = 100;
                if (isNaN(p.y)) p.y = 100;
            });

            const data = { players: this.players, sponsors: this.sponsors };
            localStorage.setItem('toni_database_2026', JSON.stringify(data));
            console.log("💾 Master-Datenbank versiegelt.");
        } catch (e) {
            console.error("Speicherfehler!", e);
        }
    },

    injectEliteSeedData() {
        const musterKader = [
            // --- TRAINER-MANNSCHAFT (ROT) ---
            { id: 101, name: "TW TRAINER", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 80, onField: true, assignment: "Trainer", x: 100, y: 400 },
            { id: 110, name: "ST LINKS", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 85, onField: true, assignment: "Trainer", x: 500, y: 200 },
            { id: 111, name: "ST RECHTS", team: "Senioren", jugend: "", pos: "ST", number: "10", rat: 82, onField: true, assignment: "Trainer", x: 500, y: 600 },
            
            // --- TONI-MANNSCHAFT (GRÜN) ---
            { id: 501, name: "TONI TW", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 88, onField: true, assignment: "Toni", x: 1100, y: 400 },
            { id: 510, name: "TONI ST 1", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 91, onField: true, assignment: "Toni", x: 700, y: 400 }
        ];

        // Ergänze den Kader um die Standard-FIFA-Stats, falls sie fehlen
        musterKader.forEach(mPlayer => {
            const exists = this.players.find(p => p.id === mPlayer.id);
            if (!exists) {
                const fullPlayer = {
                    pac: 70, sho: 70, pas: 70, dri: 70, def: 70, phy: 70,
                    height: 180, weight: 75, fat: 12, muscle: 40, vo2: 50, rhr: 60, spo2: 98,
                    onTraining: false,
                    img: "", // Platzhalter für Foto
                    ...mPlayer
                };
                this.players.push(fullPlayer);
            }
        });

        // Falls gar keine Sponsoren da sind, einen Platzhalter für die Stadionzeitung einfügen
        if (this.sponsors.length === 0) {
            this.sponsors.push({ id: 1, name: "TITAN LEASING", type: "Trikotsponsor", income: 2500 });
        }

        this.save();
    }
};

window.Database.init();
