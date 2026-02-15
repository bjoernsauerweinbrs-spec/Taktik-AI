window.ToniDatabase = {
    players: [
        { id: 1, name: "Musterprofi", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'https://via.placeholder.com/200x250?text=SPIELER' },
        { id: 2, name: "Nachwuchs-Star", pos: "LW", rating: 78, pace: 85, sho: 70, pas: 75, dri: 80, def: 30, phy: 60, type: 'sticker', photo: 'https://via.placeholder.com/200x250?text=JUGEND' }
    ],

    updatePlayer(id, key, value) {
        const p = this.players.find(x => x.id == id);
        if(p) p[key] = value;
        console.log("💾 Datenbank aktualisiert:", p);
    }
};
