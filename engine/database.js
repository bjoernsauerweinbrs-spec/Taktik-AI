window.ToniDatabase = {
    // --- KADER ---
    players: [
        { id: 1, name: "Musterprofi", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'https://via.placeholder.com/200x250/000/00d1ff?text=PRO' }
    ],

    // --- BIOMETRIE ---
    biometrics: {
        weight: { val: 78.5, unit: 'kg', max: 100, label: "GEWICHT" },
        kfa: { val: 11.2, unit: '%', max: 25, label: "KÖRPERFETT (KFA)" },
        rhr: { val: 48, unit: 'bpm', max: 80, label: "RUHEPULS (RHR)", reverse: true },
        vo2: { val: 62, unit: 'ml/kg', max: 75, label: "VO2 MAX" }
    },

    // --- STADIONZEITUNG ---
    newspaper: {
        title: "STADION-KURIER ELITE",
        issue: "Ausgabe #24 - Saison 2026",
        greeting: "Willkommen im Stadion, Coach! Heute zählt nur der Sieg. TONI hat die Taktik bereits geschärft.",
        sponsor1: "Global Energy Corp",
        sponsor2: "Elite Sports Gear",
        mainMatch: "E-Jugend vs. Spitzenreiter"
    },

    // --- JUNIOREN (PANINI) ---
    juniors: [
        { id: 101, name: "Nino", team: "G-Jugend", collected: true, photo: 'https://via.placeholder.com/150x200?text=NINO' },
        { id: 102, name: "Lukas", team: "F-Jugend", collected: false, photo: 'https://via.placeholder.com/150x200?text=LUKAS' }
    ],

    // --- MANAGER BEREICH (SPONSORS & EVENTS) ---
    sponsors: [
        { id: 1, name: "Premium Bank", level: "GOLD", logo: "https://via.placeholder.com/100x50?text=BANK" },
        { id: 2, name: "Local Pizza", level: "BRONZE", logo: "https://via.placeholder.com/100x50?text=PIZZA" }
    ],
    events: [
        { id: 1, title: "Sommerfest 2026", date: "15.07.2026", type: "SOCIAL" },
        { id: 2, title: "Trainingslager", date: "01.08.2026", type: "PRO" }
    ],

    // --- UPDATE LOGIK ---
    updatePlayer(id, key, value) { const p = this.players.find(x => x.id == id); if(p) p[key] = value; },
    updateBiometric(key, value) { if(this.biometrics[key]) this.biometrics[key].val = parseFloat(value); },
    updateNews(key, value) { if(this.newspaper.hasOwnProperty(key)) this.newspaper[key] = value; },
    toggleSticker(id) { const j = this.juniors.find(x => x.id == id); if(j) j.collected = !j.collected; },
    
    addEvent(title, date) {
        this.events.push({ id: Date.now(), title, date, type: "NEU" });
    }
};
