window.ToniDatabase = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "PROFI 1", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'https://via.placeholder.com/200x300/111/39FF14?text=FOTO+ZIEHEN' }
    ],
    juniors: JSON.parse(localStorage.getItem('toni_juniors')) || [
        { id: 101, name: "NINO", team: "G-JUGEND", collected: false, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER+ZIEHEN' },
        { id: 102, name: "LUKAS", team: "F-JUGEND", collected: false, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER+ZIEHEN' },
        { id: 103, name: "MAX", team: "E-JUGEND", collected: false, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER+ZIEHEN' }
    ],
    sponsors: JSON.parse(localStorage.getItem('toni_sponsors')) || [
        { id: 1, name: "HAUPTSPONSOR", logo: "https://via.placeholder.com/100x50/000/fff?text=LOGO" }
    ],
    biometrics: JSON.parse(localStorage.getItem('toni_bio')) || { weight: {val:75}, kfa: {val:12} },

    save() {
        localStorage.setItem('toni_players', JSON.stringify(this.players));
        localStorage.setItem('toni_juniors', JSON.stringify(this.juniors));
        localStorage.setItem('toni_sponsors', JSON.stringify(this.sponsors));
        localStorage.setItem('toni_bio', JSON.stringify(this.biometrics));
    },

    updatePhoto(type, id, base64) {
        let target = (type === 'player') ? this.players : this.juniors;
        if(type === 'sponsor') target = this.sponsors;
        
        const item = target.find(x => x.id == id);
        if(item) {
            item.photo = base64;
            if(type === 'junior') item.collected = true; // Automatisch einkleben
            this.save();
        }
    }
};
