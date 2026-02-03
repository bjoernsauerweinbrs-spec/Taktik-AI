window.arena = {
    canvas: null,
    ctx: null,
    players: [],      // Dein Team (Rot)
    opponents: [],    // Gegner (Blau - Fix 11)

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.loadPlayersFromStorage(); // Deine Spieler laden
        this.initOpponents();          // 11 Gegner erstellen
        this.render();
        
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    },

    // DEIN TEAM: Lädt alle Spieler aus der Sporttasche (Sporttasche = Deine Jungs)
    loadPlayersFromStorage() {
        const savedPlayers = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            x: 100 + (index * 40) % 150, // Startposition links
            y: 80 + (index * 45) % (this.canvas.height - 150),
            radius: 18,
            color: '#FF3B30' // ROT
        }));
    },

    // GEGNER: Erstellt exakt 11 blaue Spieler
    initOpponents() {
        this.opponents = [];
        for (let i = 1; i <= 11; i++) {
            this.opponents.push({
                id: 'opp_' + i,
                number: i,
                // Startpositionen auf der rechten Seite (Gegner-Hälfte)
                x: this.canvas.width - 150 - (i * 10) % 100,
                y: 80 + (i * 45) % (this.canvas.height - 150),
                radius: 18,
                color: '#007AFF' // BLAU
            });
        }
    },

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = 40;

        // Rasen
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        // Außenlinien & Mitte
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
        ctx.beginPath();
        ctx.moveTo(w / 2, pad);
        ctx.lineTo(w / 2, h - pad);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();

        // TORE (Links & Rechts)
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        // Tor links
        ctx.strokeRect(pad - 15, h / 2 - 40, 15, 80);
        // Tor rechts
        ctx.strokeRect(w - pad, h / 2 - 40, 15, 80);

        // STRAFRÄUME
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pad, h / 2 - 100, 100, 200); // Links
        ctx.strokeRect(w - pad - 100, h / 2 - 100, 100, 200); // Rechts
    },

    drawTeam(teamList) {
        const ctx = this.ctx;
        teamList.forEach(p => {
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 4);

            if (p.name) {
                ctx.font = "9px Inter";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 28);
            }
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawTeam(this.players);   // Deine Roten
        this.drawTeam(this.opponents); // Die Blauen 11er
        requestAnimationFrame(() => this.render());
    },

    // Toni's Taktik-Move (Nur Beispiel)
    animateFormation(type) {
        this.loadPlayersFromStorage();
        // Hier folgen später die Gleit-Formationen
    }
};
