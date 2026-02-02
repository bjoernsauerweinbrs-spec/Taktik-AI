// engine/arena.js - VOLLSTÄNDIG
window.arena = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    players: [],
    lines: [],
    zones: [],
    ready: false,

    init(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.ready = true;
        this.render();
    },

    resize() {
        if (!this.canvas) return;
        const container = this.canvas.parentElement;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.render();
    },

    render() {
        if (!this.ready || !this.ctx) return;
        const ctx = this.ctx;
        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, this.width, this.height);
        this.drawPitchLines(ctx);
        this.zones.forEach(z => {
            ctx.fillStyle = z.color;
            ctx.fillRect(z.x, z.y, z.w, z.h);
        });
        this.lines.forEach(l => {
            ctx.setLineDash(l.dashed ? [10, 10] : []);
            ctx.strokeStyle = l.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
            ctx.stroke();
        });
        this.players.forEach(p => this.drawPlayer(ctx, p));
    },

    drawPitchLines(ctx) {
        ctx.strokeStyle = "rgba(0, 255, 150, 0.2)";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, this.width - 100, this.height - 100);
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 50);
        ctx.lineTo(this.width / 2, this.height - 50);
        ctx.stroke();
    },

    drawPlayer(ctx, p) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(p.number, p.x, p.y + 5);
        ctx.font = "10px Arial";
        ctx.fillText(p.name, p.x, p.y + 35);
    }
};
