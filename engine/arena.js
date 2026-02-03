window.arena = {
    canvas: null,
    ctx: null,
    players: [],

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.loadPlayersFromStorage();
        this.render();
        
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    },

    loadPlayersFromStorage() {
        const savedPlayers = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            x: 100 + (index * 45) % (this.canvas.width / 3),
            y: 100 + (index * 60) % (this.canvas.height - 150),
            radius: 18,
            color: '#FF3B30'
        }));
    },

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = 30; // Spielfeldrand

        // Hintergrund & Rasenstruktur
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        // Außenlinien
        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

        // Mittellinie & Kreis
        ctx.beginPath();
        ctx.moveTo(w / 2, pad);
        ctx.lineTo(w / 2, h - pad);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, h * 0.15, 0, Math.PI * 2);
        ctx.stroke();

        // --- TORE & STRAFRÄUME (NEU OPTIMIERT) ---
        const areaH = h * 0.5;
        const areaW = w * 0.15;

        // Links (Heim)
        ctx.strokeRect(pad, (h - areaH) / 2, areaW, areaH); // Strafraum
        ctx.strokeRect(pad - 10, (h - 80) / 2, 10, 80); // Tor-Box außen

        // Rechts (Gast)
        ctx.strokeRect(w - pad - areaW, (h - areaH) / 2, areaW, areaH); // Strafraum
        ctx.strokeRect(w - pad, (h - 80) / 2, 10, 80); // Tor-Box außen

        // Elfmeterpunkte
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(pad + areaW * 0.7, h / 2, 3, 0, Math.PI * 2);
        ctx.arc(w - pad - areaW * 0.7, h / 2, 3, 0, Math.PI * 2);
        ctx.fill();
    },

    drawPlayers() {
        this.players.forEach(p => {
            const ctx = this.ctx;
            
            // Spieler-Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            ctx.shadowBlur = 0;

            // Nummer & Name (Professionell)
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 5);
            
            ctx.font = "9px Inter";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.fillText(p.name.toUpperCase(), p.x, p.y + 32);
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawPlayers();
        requestAnimationFrame(() => this.render());
    },

    animateFormation(type) {
        this.loadPlayersFromStorage(); // Re-Sync vor Animation
        // Taktik-Logik folgt in der Besprechung...
    }
};
