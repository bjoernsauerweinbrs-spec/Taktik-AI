window.PitchEngine = {
    canvas: null,
    ctx: null,
    init() {
        this.canvas = document.getElementById('tactic-board');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
    },
    draw() {
        // SCHUTZ-CHECK: Wenn kein Canvas da ist, brich ab
        if (!this.canvas || !this.ctx) return;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;

        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = "rgba(10,21,10,0.5)";
        ctx.fillRect(0,0,w,h);

        const p = 60;
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w-2*p, h-2*p);
        ctx.beginPath();
        ctx.moveTo(w/2, p);
        ctx.lineTo(w/2, h-p);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, 60, 0, Math.PI*2);
        ctx.stroke();
    }
};
