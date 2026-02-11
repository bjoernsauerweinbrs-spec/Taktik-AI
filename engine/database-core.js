/**
 * TONI 2.0 - DATABASE CORE (ELITE EDIT SYNC 2026)
 * Fokus: 11 Stammspieler + 5 Bankspieler, editierbar & geschützt
 * Status: MASTER-SYNC COMPLETED - FINAL 11+5 SETUP
 */
window.Database = {
    players: [],
    sponsors: [],
    
    init() {
        const saved = localStorage.getItem('toni_database_2026');
        if (saved) {
            const data = JSON.parse(saved);
            this.players = data.players || [];
            this.sponsors = data.sponsors || [];
        }

        // Sicherheits-Check: Nur fehlende Strukturen ergänzen
        this.injectEliteSeedData();
        
        console.log("📂 TONI-Datenbank: " + this.players.length + " Einheiten bereit zur Bearbeitung.");
    },

    updatePlayer(id, updatedData) {
        const index = this.players.findIndex(p => p.id === id);
        if (index !== -1) {
            this.players[index] = { ...this.players[index], ...updatedData };
            this.save();
            console.log(`✅ Spieler ${id} aktualisiert: ${this.players[index].name}`);
            
            if(window.Arena) window.Arena.draw();
            if(window.Arena) window.Arena.renderBench();
        }
    },

    injectEliteSeedData() {
        const musterKader = [
            // --- SENIOREN STAMM (11 SPIELER AUF DEM FELD) ---
            { id: 101, name: "TW VORLAGE", team: "Senioren", jugend: "", pos: "TW", number: "1", rat: 80, dob: "1995-01-01", height: 190, weight: 85, pac: 50, sho: 30, pas: 75, dri: 60, def: 40, phy: 80, onField: true, x: 100, y: 400, assignment: "Trainer" },
            { id: 102, name: "AB VORLAGE 1", team: "Senioren", jugend: "", pos: "AB", number: "2", rat: 75, dob: "1996-01-01", height: 185, weight: 80, pac: 75, sho: 40, pas: 70, dri: 65, def: 80, phy: 82, onField: true, x: 300, y: 200, assignment: "Trainer" },
            { id: 103, name: "AB VORLAGE 2", team: "Senioren", jugend: "", pos: "AB", number: "4", rat: 75, dob: "1996-01-01", height: 188, weight: 82, pac: 70, sho: 45, pas: 65, dri: 60, def: 82, phy: 85, onField: true, x: 300, y: 400, assignment: "Trainer" },
            { id: 104, name: "AB VORLAGE 3", team: "Senioren", jugend: "", pos: "AB", number: "5", rat: 75, dob: "1996-01-01", height: 184, weight: 78, pac: 78, sho: 42, pas: 68, dri: 66, def: 78, phy: 78, onField: true, x: 300, y: 600, assignment: "Trainer" },
            { id: 105, name: "MF VORLAGE 1", team: "Senioren", jugend: "", pos: "MF", number: "6", rat: 78, dob: "1997-01-01", height: 180, weight: 75, pac: 75, sho: 65, pas: 82, dri: 78, def: 72, phy: 74, onField: true, x: 550, y: 300, assignment: "Trainer" },
            { id: 106, name: "MF VORLAGE 2", team: "Senioren", jugend: "", pos: "MF", number: "8", rat: 78, dob: "1997-01-01", height: 182, weight: 77, pac: 72, sho: 70, pas: 80, dri: 76, def: 75, phy: 78, onField: true, x: 550, y: 500, assignment: "Trainer" },
            { id: 107, name: "MF VORLAGE 3", team: "Senioren", jugend: "", pos: "MF", number: "7", rat: 78, dob: "1997-01-01", height: 175, weight: 70, pac: 85, sho: 75, pas: 78, dri: 84, def: 40, phy: 65, onField: true, x: 750, y: 150, assignment: "Trainer" },
            { id: 108, name: "MF VORLAGE 4", team: "Senioren", jugend: "", pos: "MF", number: "10", rat: 82, dob: "1998-01-01", height: 178, weight: 72, pac: 82, sho: 80, pas: 85, dri: 88, def: 45, phy: 68, onField: true, x: 750, y: 400, assignment: "Trainer" },
            { id: 109, name: "ST VORLAGE 1", team: "Senioren", jugend: "", pos: "ST", number: "11", rat: 80, dob: "1998-01-01", height: 180, weight: 76, pac: 88, sho: 82, pas: 70, dri: 84, def: 30, phy: 70, onField: true, x: 750, y: 650, assignment: "Trainer" },
            { id: 110, name: "ST VORLAGE 2", team: "Senioren", jugend: "", pos: "ST", number: "9", rat: 85, dob: "1994-01-01", height: 188, weight: 88, pac: 78, sho: 90, pas: 75, dri: 80, def: 35, phy: 85, onField: true, x: 950, y: 300, assignment: "Trainer" },
            { id: 111, name: "ST VORLAGE 3", team: "Senioren", jugend: "", pos: "ST", number: "13", rat: 78, dob: "1994-01-01", height: 185, weight: 84, pac: 76, sho: 84, pas: 70, dri: 78, def: 38, phy: 82, onField: true, x: 950, y: 500, assignment: "Trainer" },

            // --- SENIOREN ERSATZBANK (5 SPIELER ALS FIFA CARDS) ---
            { id: 120, name: "ERSATZ TW", team: "Senioren", jugend: "", pos: "TW", number: "22", rat: 72, dob: "2000-01-01", height: 192, weight: 88, onField: false, assignment: "Trainer" },
            { id: 121, name: "ERSATZ 1", team: "Senioren", jugend: "", pos: "AB", number: "14", rat: 70, dob: "2001-01-01", height: 184, weight: 78, onField: false, assignment: "Trainer" },
            { id: 122, name: "ERSATZ 2", team: "Senioren", jugend: "", pos: "MF", number: "16", rat: 72, dob: "2002-01-01", height: 178, weight: 72, onField: false, assignment: "Trainer" },
            { id: 123, name: "ERSATZ 3", team: "Senioren", jugend: "", pos: "MF", number: "18", rat: 71, dob: "2002-01-01", height: 176, weight: 70, onField: false, assignment: "Trainer" },
            { id: 124, name: "ERSATZ 4", team: "Senioren", jugend: "", pos: "ST", number: "20", rat: 74, dob: "2003-01-01", height: 180, weight: 75, onField: false, assignment: "Trainer" }
        ];

        let addedCount = 0;
        musterKader.forEach(mPlayer => {
            const exists = this.players.find(p => p.id === mPlayer.id);
            if (!exists) {
                this.players.push(mPlayer);
                addedCount++;
            }
        });

        if (addedCount > 0) this.save();
    },

    save() {
        const data = { players: this.players, sponsors: this.sponsors };
        localStorage.setItem('toni_database_2026', JSON.stringify(data));
        console.log("💾 Daten im LocalStorage versiegelt.");
    }
};

window.Database.init();
