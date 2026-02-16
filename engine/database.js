window.ToniDatabase = {
    // --- PROFI KADER ---
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "MUSTERPROFI", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, inTraining: true, inMatch: true, photo: 'https://via.placeholder.com/200x300/111/39FF14?text=PRO' }
    ],

    // --- JUNIOREN (AKADEMIE) ---
    juniors: JSON.parse(localStorage.getItem('toni_juniors')) || [
        { id: 101, name: "NINO", team: "G-JUGEND", collected: false, trainingCount: 8, skillTechnik: 75, skillTaktik: 40, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=JUNIOR' }
    ],

    // --- BIOMETRIE ---
    biometrics: JSON.parse(localStorage.getItem('toni_bio')) || {
        hrv: { val: 72, max: 100, unit: 'ms', label: 'HRV (Regeneration)' },
        vo2: { val: 62, max: 80, unit: 'ml/kg', label: 'VO2 MAX' },
        readiness: { val: 85, max: 100, unit: '%', label: 'BEREITSCHAFT' },
        weight: { val: 78.5, max: 100, unit: 'kg', label: 'GEWICHT' }
    },

    // --- MANAGEMENT & KURIER ---
    management: JSON.parse(localStorage.getItem('toni_mgmt')) || {
        sponsors: [{ id: 1, name: "Global Tech", logo: "https://via.placeholder.com/100x50/000/fff?text=LOGO" }],
        newsGreeting: "Willkommen zum Spieltag, Coach! Die Jungs sind heiß."
    },

    save() {
        localStorage.setItem('toni_players', JSON.stringify(this.players));
        localStorage.setItem('toni_juniors', JSON.stringify(this.juniors));
        localStorage.setItem('toni_bio', JSON.stringify(this.biometrics));
        localStorage.setItem('toni_mgmt', JSON.stringify(this.management));
    },

    updatePhoto(type, id, base64) {
        let t = (type === 'player') ? this.players : (type === 'junior' ? this.juniors : this.management.sponsors);
        const item = t.find(x => x.id == id);
        if(item) { 
            item.photo ? item.photo = base64 : item.logo = base64; 
            if(type === 'junior') item.collected = true;
            this.save(); 
        }
    },

    toggleStatus(id, type) {
        const p = this.players.find(x => x.id == id);
        if(p) { p[type] = !p[type]; this.save(); }
    }
};
