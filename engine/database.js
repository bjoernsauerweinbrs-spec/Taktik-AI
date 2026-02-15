window.ToniDatabase = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "MUSTERPROFI", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, photo: 'https://via.placeholder.com/200x300/111/39FF14?text=FOTO+ZIEHEN' }
    ],
    juniors: JSON.parse(localStorage.getItem('toni_juniors')) || [
        { id: 101, name: "NINO", team: "G-JUGEND", collected: false, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER' }
    ],
    biometrics: JSON.parse(localStorage.getItem('toni_bio')) || {
        weight: { val: 78.5, max: 100, unit: 'kg' }, kfa: { val: 11.2, max: 25, unit: '%' }
    },
    save() {
        localStorage.setItem('toni_players', JSON.stringify(this.players));
        localStorage.setItem('toni_juniors', JSON.stringify(this.juniors));
        localStorage.setItem('toni_bio', JSON.stringify(this.biometrics));
    },
    updatePhoto(type, id, base64) {
        let target = (type === 'player') ? this.players : this.juniors;
        const item = target.find(x => x.id == id);
        if(item) { item.photo = base64; if(type==='junior') item.collected=true; this.save(); }
    }
};
