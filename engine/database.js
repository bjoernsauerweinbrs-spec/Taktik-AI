window.ToniDatabase = {
    // --- SPIELER KADER ---
    players: [
        { id: 1, name: "Musterprofi", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'https://via.placeholder.com/200x250/000/00d1ff?text=PRO' },
        { id: 2, name: "Nachwuchs-Star", pos: "LW", rating: 78, pace: 85, sho: 70, pas: 75, dri: 80, def: 30, phy: 60, type: 'sticker', photo: 'https://via.placeholder.com/200x250/fff/000?text=JUGEND' }
    ],

    // --- ELITE LABOR DATEN ---
    biometrics: {
        weight: { val: 78.5, unit: 'kg', max: 100, label: "GEWICHT" },
        kfa: { val: 11.2, unit: '%', max: 25, label: "KÖRPERFETT (KFA)" },
        rhr: { val: 48, unit: 'bpm', max: 80, label: "RUHEPULS (RHR)", reverse: true }, // reverse: niedriger ist besser
        vo2: { val: 62, unit: 'ml/kg', max: 75, label: "VO2 MAX" }
    },

    // --- UPDATE FUNKTIONEN ---
    updatePlayer(id, key, value) {
        const p = this.players.find(x => x.id == id);
        if(p) p[key] = value;
        console.log("💾 Spieler aktualisiert:", p.name);
    },

    updateBiometric(key, value) {
        if(this.biometrics[key]) {
            this.biometrics[key].val = parseFloat(value);
             console.log("💾 Biometrie aktualisiert:", key, value);
        }
    }
};
