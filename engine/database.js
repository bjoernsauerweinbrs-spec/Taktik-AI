window.ToniDatabase = {
    // Lädt gespeicherte Daten oder nutzt Standardwerte
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "SPIELER 1", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'https://via.placeholder.com/200x300/111/39FF14?text=FOTO+HIERHER' },
        { id: 2, name: "SPIELER 2", pos: "ZM", rating: 88, pace: 80, sho: 80, pas: 90, dri: 85, def: 70, phy: 75, type: 'toty', photo: 'https://via.placeholder.com/200x300/111/39FF14?text=FOTO+HIERHER' }
    ],
    juniors: JSON.parse(localStorage.getItem('toni_juniors')) || [
        { id: 101, name: "NINO", team: "G-JUGEND", collected: true, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER' },
        { id: 102, name: "LUKAS", team: "F-JUGEND", collected: false, photo: 'https://via.placeholder.com/150x200/222/00D1FF?text=STICKER' }
    ],
    sponsors: JSON.parse(localStorage.getItem('toni_sponsors')) || [
        { id: 1, name: "HAUPTSPONSOR", level: "GOLD", logo: "https://via.placeholder.com/100x50/000/fff?text=LOGO+ZIEHEN" }
    ],
    biometrics: JSON.parse(localStorage.getItem('toni_bio')) || {
        weight: { val: 78.5, unit: 'kg', max: 100, label: "GEWICHT" },
        kfa: { val: 11.2, unit: '%', max: 25, label: "KÖRPERFETT" }
    },
    newspaper: JSON.parse(localStorage.getItem('toni_news')) || {
        title: "STADION-KURIER", issue: "AUSGABE #01", greeting: "Willkommen Coach!",
        sponsor1: "SPONSOR A", sponsor2: "SPONSOR B", mainMatch: "HEIMSIEG"
    },

    save() {
        localStorage.setItem('toni_players', JSON.stringify(this.players));
        localStorage.setItem('toni_juniors', JSON.stringify(this.juniors));
        localStorage.setItem('toni_sponsors', JSON.stringify(this.sponsors));
        localStorage.setItem('toni_bio', JSON.stringify(this.biometrics));
        localStorage.setItem('toni_news', JSON.stringify(this.newspaper));
    },

    updatePhoto(type, id, base64) {
        let target = (type === 'player') ? this.players : this.juniors;
        if(type === 'sponsor') target = this.sponsors;
        const item = target.find(x => x.id == id);
        if(item) {
            item.photo ? item.photo = base64 : item.logo = base64;
            this.save();
        }
    }
};
