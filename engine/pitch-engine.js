window.PitchEngine = {
    canvas: null, ctx: null,
    init() { this.canvas = document.getElementById('tactic-board'); this.ctx = this.canvas.getContext('2d'); this.draw(); },
    draw() {
        const w = this.canvas.width, h = this.canvas.height, ctx = this.ctx;
        ctx.clearRect(0,0,w,h); ctx.fillStyle = "rgba(10,21,10,0.5)"; ctx.fillRect(0,0,w,h);
        const p = 60; ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w-2*p, h-2*p);
        ctx.beginPath(); ctx.moveTo(w/2, p); ctx.lineTo(w/2, h-p); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
    }
};
