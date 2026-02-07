/**
 * TONI 2.0 - DATABASE (DEMO DATA)
 * 20 Muster-Spieler für die Kabine
 */
window.Database = {
    players: [
        { id: 1, name: "Max Master", rat: 88, pos: "ST", present: true, pac: 92, sho: 89, pas: 78, dri: 85, def: 35, phy: 80, status: "Top-Form", img: "assets/p1.png", heart: 72, km: 10.5 },
        { id: 2, name: "Lukas Wall", rat: 85, pos: "IV", present: false, pac: 70, sho: 40, pas: 72, dri: 65, def: 88, phy: 90, status: "Bank", img: "assets/p2.png", heart: 65, km: 8.2 },
        { id: 3, name: "Toni Technic", rat: 91, pos: "ZOM", present: true, pac: 82, sho: 85, pas: 94, dri: 92, def: 50, phy: 70, status: "Top-Form", img: "assets/p3.png", heart: 68, km: 11.2 },
        { id: 4, name: "Marc Speed", rat: 82, pos: "RV", present: true, pac: 95, sho: 60, pas: 75, dri: 78, def: 75, phy: 72, status: "Verletzt", img: "assets/p4.png", heart: 75, km: 9.8 },
        { id: 5, name: "Sven Safe", rat: 86, pos: "TW", present: true, pac: 55, sho: 30, pas: 80, dri: 50, def: 20, phy: 82, status: "Top-Form", img: "assets/p5.png", heart: 60, km: 4.5 },
        { id: 6, name: "Finn Flügel", rat: 80, pos: "LF", present: false, pac: 88, sho: 75, pas: 78, dri: 84, def: 40, phy: 65, status: "Bank", img: "assets/p6.png", heart: 70, km: 9.2 },
        { id: 7, name: "Ben Beißer", rat: 84, pos: "CDM", present: true, pac: 72, sho: 65, pas: 78, dri: 70, def: 85, phy: 88, status: "Top-Form", img: "assets/p7.png", heart: 78, km: 12.1 },
        { id: 8, name: "Leo Luft", rat: 79, pos: "IV", present: true, pac: 65, sho: 45, pas: 68, dri: 60, def: 80, phy: 85, status: "Bank", img: "assets/p8.png", heart: 64, km: 7.9 },
        { id: 9, name: "Mika Mitti", rat: 83, pos: "ZM", present: false, pac: 75, sho: 72, pas: 85, dri: 80, def: 70, phy: 75, status: "Bank", img: "assets/p9.png", heart: 69, km: 10.1 },
        { id: 10, name: "Sam Solo", rat: 87, pos: "MS", present: true, pac: 85, sho: 90, pas: 75, dri: 88, def: 32, phy: 78, status: "Top-Form", img: "assets/p10.png", heart: 73, km: 10.8 },
        { id: 11, name: "Jan Jäger", rat: 78, pos: "ST", present: false, pac: 82, sho: 80, pas: 65, dri: 75, def: 30, phy: 72, status: "Verletzt", img: "assets/p11.png", heart: 0, km: 0 },
        { id: 12, name: "Oli Ordnung", rat: 85, pos: "IV", present: true, pac: 68, sho: 42, pas: 75, dri: 68, def: 86, phy: 84, status: "Top-Form", img: "assets/p12.png", heart: 66, km: 8.5 },
        { id: 13, name: "Paul Pass", rat: 81, pos: "ZM", present: true, pac: 74, sho: 68, pas: 88, dri: 78, def: 65, phy: 70, status: "Bank", img: "assets/p13.png", heart: 67, km: 11.5 },
        { id: 14, name: "Kalle Kante", rat: 84, pos: "LV", present: false, pac: 85, sho: 55, pas: 72, dri: 75, def: 82, phy: 85, status: "Bank", img: "assets/p14.png", heart: 71, km: 9.4 },
        { id: 15, name: "Nico Netz", rat: 89, pos: "RF", present: true, pac: 93, sho: 86, pas: 82, dri: 90, def: 38, phy: 72, status: "Top-Form", img: "assets/p15.png", heart: 74, km: 10.2 },
        { id: 16, name: "Dennis Dribbel", rat: 77, pos: "ZOM", present: true, pac: 80, sho: 70, pas: 75, dri: 85, def: 45, phy: 60, status: "Bank", img: "assets/p16.png", heart: 70, km: 8.8 },
        { id: 17, name: "Uli Umkehr", rat: 82, pos: "CDM", present: false, pac: 70, sho: 62, pas: 80, dri: 74, def: 83, phy: 80, status: "Verletzt", img: "assets/p17.png", heart: 0, km: 0 },
        { id: 18, name: "Basti Ball", rat: 86, pos: "ST", present: true, pac: 87, sho: 92, pas: 70, dri: 84, def: 35, phy: 82, status: "Top-Form", img: "assets/p18.png", heart: 76, km: 11.0 },
        { id: 19, name: "Rene Räumer", rat: 83, pos: "IV", present: true, pac: 72, sho: 48, pas: 70, dri: 65, def: 84, phy: 92, status: "Top-Form", img: "assets/p19.png", heart: 68, km: 8.0 },
        { id: 20, name: "Flo Flanke", rat: 81, pos: "LV", present: true, pac: 89, sho: 65, pas: 84, dri: 82, def: 78, phy: 75, status: "Bank", img: "assets/p20.png", heart: 72, km: 10.4 }
    ],

    getPresentPlayers() {
        return this.players.filter(p => p.present);
    },

    togglePresence(id) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.present = !player.present;
            if (window.arena) window.arena.syncFromDatabase();
        }
    },

    updatePlayerImage(id, newImgData) {
        const player = this.players.find(p => p.id === id);
        if (player) player.img = newImgData;
    }
};
