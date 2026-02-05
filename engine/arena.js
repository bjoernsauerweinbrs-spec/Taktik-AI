/**
 * TONI 2.0 - ARENA ENGINE (REPAIR VERSION)
 * Liegt im Ordner /engine/
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],

    init: function(id) {
        this.canvas = document.getElementById(id);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Event-Bus Anbindung
        if(window.ToniEvents) {
            window.ToniEvents.on('players:updated', (data) => {
                this.players = data;
                this.render();
            });
        }

        this.players = window.ToniDB.getPlayers();
        this.render();
    },

    render: function() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld Hintergrund
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);

        // 2. Grüne Umrandung & Linien (Sichtbarkeits-Check)
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 40, w - 80, h - 80);
        
        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, 40);
        ctx.lineTo(w / 2, h - 40);
        ctx.stroke();

        // 3. Spieler zeichnen
        this.players.forEach(p => {
            if (p.team === 'home' && !p.isPresent) return;
            
            const isHome = p.team === 'home';
            const x = isHome ? 120 : w - 120;
            const y = 80 + (parseInt(p.id.replace(/\D/g,'') || p.nr) * 45 % (h - 160));

            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fillStyle = isHome ? (p.isStarter ? "#39FF14" : "#FF3030") : "#3080FF";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.stroke();

            ctx.fillStyle = "#fff";
            ctx.font = "10px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.name, x, y + 28);
        });
        console.log("Arena rendered with " + this.players.length + " players.");
    }
};
