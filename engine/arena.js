/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (FULL ANIMATED)
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        lines: [],
        zones: [],
        ready: false,
        pulse: 0,

        init(elementId) {
            const el = document.getElementById(elementId);
            if (!el) return false;
            this.canvas = el;
            this.ctx = el.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.ready = true;
            this.startAnimationLoop();
            return true;
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        startAnimationLoop() {
            const loop = () => {
                this.update();
                this.render();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        },

        update() {
            this.pulse = (Math.sin(Date.now() / 500) + 1) / 2;
        },

        render() {
            if (!this.ready) return;
            const ctx = this.ctx;
            ctx.fillStyle = "#0B1220";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);
            this.players.forEach(p => this.drawPlayer(ctx, p));
        },

        drawPitch(ctx) {
            ctx.strokeStyle = "rgba(0, 209, 255, 0.1)";
            ctx.lineWidth = 2;
            ctx.strokeRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
            ctx.beginPath();
            ctx.moveTo(this.canvas.width / 2, 50);
            ctx.lineTo(this.canvas.width / 2, this.canvas.height - 50);
            ctx.stroke();
        },

        drawPlayer(ctx, p) {
            const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            ctx.save();
            ctx.shadowBlur = 10 + (this.pulse * 10);
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#fff";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number || "", p.x, p.y + 5);
            ctx.restore();
        },

        clear() {
            this.lines = [];
            this.zones = [];
        }
    };
})();
