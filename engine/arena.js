/**
 * TONI 2.0 - NEON GINGA ARENA
 */
window.arena = {
    canvas: null, ctx: null,

    init: function(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('resize', () => this.resize());
        this.resize();
        this.render();
    },

    resize: function() {
        const c = this.canvas.parentElement;
        this.canvas.width = c.clientWidth;
        this.canvas.height = c.clientHeight;
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // RASEN
        ctx.fillStyle = "#050B05"; ctx.fillRect(0,0,w,h);
        
        // NEON LINIEN
        ctx.strokeStyle = "rgba(57, 255, 20, 0.7)";
        ctx.lineWidth = 3; ctx.shadowBlur = 12; ctx.shadowColor = "#39FF14";

        // Spielfeld Rand
        ctx.strokeRect(60, 60, w-120, h-120);

        // Mittellinie & Kreis
        ctx.beginPath(); ctx.moveTo(w/2, 60); ctx.lineTo(w/2, h-60); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, h/7, 0, Math.PI*2); ctx.stroke();

        // 16er & TORE
        this.drawComplexGoal(ctx, 60, h/2, -25, h/3, h/6); // Links
        this.drawComplexGoal(ctx, w-60, h/2, 25, h/3, h/6); // Rechts

        // AUSWECHSELBANK
        ctx.shadowBlur = 0; ctx.fillStyle = "rgba(57, 255, 20, 0.1)";
        ctx.fillRect(w*0.2, h-45, w*0.6, 35);
        ctx.fillStyle = "#39FF14"; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
        ctx.fillText("TECHNICAL AREA / BENCH - DEEP ANALYSIS READY", w/2, h-23);

        // BALL
        this.drawBall(ctx, w/2 + 40, h/2 - 30);
    },

    drawComplexGoal: function(ctx, x, y, off, boxH, fiveH) {
        ctx.strokeRect(x, y - boxH/2, off*3, boxH); // 16er
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(x, y - fiveH/2, off, fiveH); // 5m Zone
        ctx.setLineDash([]);
        ctx.strokeRect(x, y - 45, off/2, 90); // Physisches Tor
    },

    drawBall: function(ctx, x, y) {
        ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x,y,7,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
    }
};
