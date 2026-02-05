/**
 * TONI 2.0 - ARENA ENGINE (REAKTIV)
 * Behebt das Rendering-Problem durch erzwungenen Initial-Sync.
 */
window.Arena = {
    canvas: null, ctx: null, players: [],

    init: function(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        
        // Event-Bus Anbindung: Wenn DB sich ändert, sofort neu zeichnen
        window.ToniEvents.on('players:updated', (data) => {
            console.log("Arena: Update empfangen.");
            this.players = data;
            this.render();
        });

        // Erster Sync
        this.players = window.ToniDB.getPlayers();
        this.render();
    },

    render: function() {
        if(!this.ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // GRUNDIERUNG (Pitch)
        this.ctx.fillStyle = "#051205"; 
        this.ctx.fillRect(0, 0, w, h);

        // LINIEN ZEICHNEN
        this.ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, 50, w-100, h-100); // Außenlinie
        
        // SPIELER ZEICHNEN
        this.players.forEach(p => {
            if(!p.isPresent && p.team === 'home') return; // Nur anwesende Heimspieler zeigen
            
            const isHome = p.team === 'home';
            // Startpositionen falls keine Koordinaten da sind
            const x = isHome ? 150 : w - 150;
            const y = 100 + (p.nr * 50 % (h - 200));

            this.ctx.beginPath();
            this.ctx.arc(x, y, 15, 0, Math.PI*2);
            this.ctx.fillStyle = isHome ? (p.isStarter ? '#39FF14' : '#FF3030') : '#3080FF';
            this.ctx.fill();
            this.ctx.strokeStyle = "#fff";
            this.ctx.stroke();
            
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 10px Inter";
            this.ctx.fillText(p.name, x - 15, y + 30);
        });
        console.log("Arena: Render abgeschlossen.");
    }
};
