window.ToniDatabase = {
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "MUSTERPROFI", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, inTraining: true, inMatch: true, photo: 'https://via.placeholder.com/200x300/111/39FF14?text=PROFI' }
    ],
    biometrics: {
        hrv: { val: 72, max: 100, unit: 'ms', label: 'HRV (Regeneration)' },
        vo2: { val: 62, max: 80, unit: 'ml/kg', label: 'VO2 MAX' },
        readiness: { val: 88, max: 100, unit: '%', label: 'READINESS' },
        weight: { val: 78.5, max: 100, unit: 'kg', label: 'GEWICHT' }
    },
    save() { localStorage.setItem('toni_players', JSON.stringify(this.players)); },
    toggleStatus(id, type) {
        const p = this.players.find(x => x.id == id);
        if(p) { p[type] = !p[type]; this.save(); }
    }
};
