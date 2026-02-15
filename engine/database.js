/**
 * TONI 2.0 - UNIVERSAL DATABASE (ELITE VERSION)
 * Alles ist so voreingestellt, dass du nur noch Bilder in die Ordner ziehen musst.
 */

window.ToniDatabase = {
    // --- SENIOREN KADER (FIFA TOTY LOOK) ---
    // Benenne deine Bilder einfach p1.png, p2.png im Ordner assets/img/players/
    players: [
        { id: 1, name: "DEIN STÜRMER", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, def: 45, phy: 84, type: 'toty', photo: 'assets/img/players/p1.png' },
        { id: 2, name: "DEIN KAPITÄN", pos: "ZM", rating: 91, pace: 82, sho: 85, pas: 94, dri: 88, def: 75, phy: 80, type: 'toty', photo: 'assets/img/players/p2.png' }
    ],

    // --- JUNIOREN AKADEMIE (PANINI LOOK) ---
    // Benenne deine Bilder einfach j1.png, j2.png im Ordner assets/img/juniors/
    juniors: [
        { id: 101, name: "NINO", team: "G-JUGEND", collected: true, photo: 'assets/img/juniors/j1.png' },
        { id: 102, name: "LUKAS", team: "F-JUGEND", collected: false, photo: 'assets/img/juniors/j2.png' },
        { id: 103, name: "TONI JR.", team: "E-JUGEND", collected: true, photo: 'assets/img/juniors/j3.png' }
    ],

    // --- MANAGER BEREICH (SPONSOREN) ---
    // Benenne die Logos s1.png, s2.png im Ordner assets/img/sponsors/
    sponsors: [
        { id: 1, name: "HAUPTSPONSOR", level: "GOLD", logo: "assets/img/sponsors/s1.png" },
        { id: 2, name: "LOKALER PARTNER", level: "SILBER", logo: "assets/img/sponsors/s2.png" }
    ],

    // --- BIOMETRIE ---
    biometrics: {
        weight: { val: 78.5, unit: 'kg', max: 100, label: "GEWICHT" },
        kfa: { val: 11.2, unit: '%', max: 25, label: "KÖRPERFETT" },
        rhr: { val: 48, unit: 'bpm', max: 80, label: "RUHEPULS", reverse: true },
        vo2: { val: 62, unit: 'ml/kg', max: 75, label: "VO2 MAX" }
    },

    // --- STADIONZEITUNG ---
    newspaper: {
        title: "STADION-KURIER",
        issue: "AUSGABE #01",
        greeting: "Willkommen Coach! Das neue High-Level System ist bereit für den Einsatz.",
        sponsor1: "DEIN SPONSOR 1",
        sponsor2: "DEIN SPONSOR 2",
        mainMatch: "NÄCHSTES SPIEL: HEIMSIEG"
    },

    // --- MANAGER FUNKTIONEN ---
    events: [
        { id: 1, title: "SAISONERÖFFNUNG", date: "01.03.2026", type: "EVENT" }
    ],

    updatePlayer(id, key, value) { const p = this.players.find(x => x.id == id); if(p) p[key] = value; },
    updateBiometric(key, value) { if(this.biometrics[key]) this.biometrics[key].val = parseFloat(value); },
    updateNews(key, value) { if(this.newspaper.hasOwnProperty(key)) this.newspaper[key] = value; },
    toggleSticker(id) { const j = this.juniors.find(x => x.id == id); if(j) j.collected = !j.collected; },
    addEvent(title, date) { this.events.push({ id: Date.now(), title, date, type: "NEU" }); }
};
