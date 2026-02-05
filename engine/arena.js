/**
 * TONI 2.0 - TACTICAL BOARD ENGINE
 * Zeichnet 11 vs 11 plus Auswechselbank. 
 * Reagiert sofort auf ToniDB-Updates via Event-Bus.
 */
window.Arena = {
    canvas: null,
    ctx: null,
    players: [],

    init: function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Auf Daten-Updates hören
        window.ToniEvents.on('players:updated', (data) => {
            this.syncAndRender(data);
        });

        // Initialer Load
        this.syncAndRender(window.ToniDB.getPlayers());
    },

    syncAndRender: function(allPlayers) {
        // Wir filtern: Wer muss aufs Feld?
        this.players = allPlayers.filter(p => p.isPresent);
        this.draw();
    },

    draw: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld zeichnen (Grün)
        ctx.fillStyle = '#1a3a1a';
        ctx.fillRect(0, 0, w, h);
        
        // 2. Linien (Weiß)
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, w - 100, h - 100); // Außenlinie
        ctx.beginPath();
        ctx.moveTo(w/2, 50); ctx.lineTo(w/2, h-50); ctx.stroke(); // Mittellinie

        // 3. Spieler zeichnen
        this.players.forEach(p => {
            const isHome = p.team === 'home';
            // Start-Positionen grob nach Rolle berechnen, wenn keine Koordinaten da sind
            const x = isHome ? 150 : w - 150;
            const y = 100 + (p.nr * 40 % (h - 200));

            // Spieler-Punkt
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fillStyle = isHome ? '#ff3b3b' : '#3b82f6'; // Rot vs Blau
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            // Nummer & Name
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(p.nr, x, y + 5);
            ctx.font = '10px Inter';
            ctx.fillText(p.name, x, y + 30);
        });
    },

    getSnapshot: function() {
        return this.canvas.toDataURL("image/png");
    }
};
