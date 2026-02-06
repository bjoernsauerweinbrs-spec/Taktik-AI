window.arena = {
    init: function(id) {
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.render();
    },
    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width = this.canvas.offsetWidth;
        const h = this.canvas.height = this.canvas.offsetHeight;

        // GRAS
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);

        // LINIEN-STIL
        ctx.strokeStyle = "rgba(57, 255, 20, 0.5)";
        ctx.lineWidth = 2;

        // SPIELFELD-RAND
        const pad = 40;
        ctx.strokeRect(pad, pad, w - pad*2, h - pad*2);

        // MITTELLINIE & KREIS
        ctx.moveTo(w/2, pad);
        ctx.lineTo(w/2, h - pad);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, 60, 0, Math.PI*2);
        ctx.stroke();

        // 16m & 5m RAUM (TORRAUM)
        this.drawBox(ctx, pad, h/2, 120, 240); // 16m Links
        this.drawBox(ctx, pad, h/2, 40, 100);  // 5m Links
        this.drawBox(ctx, w - pad, h/2, -120, 240); // 16m Rechts
        this.drawBox(ctx, w - pad, h/2, -40, 100);  // 5m Rechts
    },
    drawBox: function(ctx, x, y, w, h) {
        ctx.strokeRect(x, y - h/2, w, h);
    }
};
