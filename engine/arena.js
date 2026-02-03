window.arena = {
    canvas: null,
    ctx: null,
    players: [], // Hier landen die aktiven Spieler-Objekte

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.loadPlayersFromStorage();
        this.render();
        
        window.addEventListener('resize', () => this.resize());
        console.log("Arena: Taktik-Board mit Kader-Sync bereit.");
    },

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    },

    // Lädt die Spieler aus der Sporttasche und platziert sie
    loadPlayersFromStorage() {
        const savedPlayers = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            // Startpositionen (leicht versetzt, damit sie nicht übereinander liegen)
            x: 100 + (index * 40) % 200,
            y: 100 + (index * 50) % 300,
            radius: 18,
            color: '#FF3B30', // Toni's Team ist ROT
            isSelected: false
        }));
    },

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Rasen
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, w, h);

        // Linien
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, w - 40, h - 40);
        
        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, 20);
        ctx.lineTo(w / 2, h - 20);
        ctx.stroke();

        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();
    },

    drawPlayers() {
        this.players.forEach(p => {
            const ctx = this.ctx;
            
            // Spieler-Kreis
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Nummer
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 5);

            // Name unter dem Spieler
            ctx.font = "10px Inter";
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            ctx.fillText(p.name.toUpperCase(), p.x, p.y + 30);
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawPlayers();
        requestAnimationFrame(() => this.render());
    },

    // Funktion für Toni, um Formationen zu schieben
    animateFormation(type) {
        console.log("Toni schiebt Formation:", type);
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Beispiel-Logik für 4-3-3 (sehr vereinfacht)
        this.players.forEach((p, i) => {
            if(i === 0) { p.x = 60; p.y = h/2; } // TW
            else if(i < 5) { p.x = 150; p.y = (h/5) * i; } // Abwehr
            else { p.x = 300; p.y = (h/2); } // Rest sammeln
        });
    }
};
