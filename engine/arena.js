window.arena = {
    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Neon-Spielfeld Markierungen
        ctx.strokeStyle = "rgba(57, 255, 20, 0.8)"; // Neon Grün
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = var(--neon-green);

        // Hauptlinien & Tore
        ctx.strokeRect(50, 50, w-100, h-100); 
        this.drawGoal(ctx, 50, h/2, -20); // Tor links
        this.drawGoal(ctx, w-50, h/2, 20); // Tor rechts

        // 5m-Zone & 16er
        this.drawBox(ctx, 50, h/2, 60, h/3); // 16er
        
        // 2. Auswechselbank (Unten am Rand)
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(w*0.2, h-40, w*0.6, 30);
        ctx.fillStyle = "#fff"; ctx.font = "10px Inter";
        ctx.fillText("AUSWECHSELBANK / TECHNICAL AREA", w/2, h-20);

        // 3. Der Ball (Zentral)
        this.drawBall(ctx, w/2 + 30, h/2 - 20);
    },

    drawGoal: function(ctx, x, y, offset) {
        ctx.strokeRect(x, y - 40, offset, 80);
    },

    drawBall: function(ctx, x, y) {
        ctx.shadowBlur = 15; ctx.shadowColor = "#fff";
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
    }
};
