window.ToniDatabase = {
    // ... (Bisherige Daten bleiben erhalten)
    players: JSON.parse(localStorage.getItem('toni_players')) || [
        { id: 1, name: "PROFI", pos: "ST", rating: 94, pace: 99, sho: 92, pas: 88, dri: 91, photo: 'https://via.placeholder.com/200x300/111/39FF14?text=PRO' }
    ],
    
    videoAnalysis: {
        youtubeLinked: false,
        referenceMoves: [
            { id: 'm1', title: 'Toni Kroos - Passspiel', url: 'https://www.youtube.com/watch?v=example1' },
            { id: 'm2', title: 'Abschluss-Technik', url: 'https://www.youtube.com/watch?v=example2' }
        ],
        history: []
    },

    save() {
        localStorage.setItem('toni_players', JSON.stringify(this.players));
        localStorage.setItem('toni_video', JSON.stringify(this.videoAnalysis));
    }
};
