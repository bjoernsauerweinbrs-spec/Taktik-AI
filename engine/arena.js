/**
 * TONI 2.0 - NEON ARENA ENGINE
 */
window.arena = {
    canvas: null, ctx: null,
    
    init: function(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    },

    resize: function() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // RASEN-HINTERGRUND
        ctx.fillStyle = "#050B05"; ctx.fillRect(0,0,w,h);
        
        // NEON LINIEN SETUP
        ctx.strokeStyle = "#39FF14"; ctx.lineWidth = 4;
        ctx.shadowBlur = 15; ctx.shadowColor = "#39FF14";

        // SPIELFELD-RAHMEN
        ctx.strokeRect(50, 50, w-100, h-100);

        // MITTE
        ctx.beginPath(); ctx.moveTo(w/2, 50); ctx.lineTo(w/2, h-50); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, h/6, 0, Math.PI*2); ctx.stroke();

        // TORE & ZONEN
        this.drawProGoal(ctx, 50, h/2, 80, h/2.5, 30); // Links
        this.drawProGoal(ctx, w-50, h/2, -80, h/2.5, -30); // Rechts

        // AUSWECHSELBANK
        ctx.shadowBlur = 0; ctx.fillStyle = "rgba(57, 255, 20, 0.1)";
        ctx.fillRect(w*0.25, h-45, w*0.5, 35);
        ctx.fillStyle = "#39FF14"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
        ctx.fillText("TECHNICAL AREA - SUBSTITUTION BENCH", w/2, h-22);

        // BALL
        this.drawBall(ctx, w/2 + 50, h/2 - 40);
    },

    drawProGoal: function(ctx, x, y, boxW, boxH, goalW) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH); // 16er
        ctx.strokeRect(x, y - 50, goalW, 100); // Tornetz
    },

    drawBall: function(ctx, x, y) {
        ctx.shadowBlur = 20; ctx.shadowColor = "#fff"; ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
    }
};
