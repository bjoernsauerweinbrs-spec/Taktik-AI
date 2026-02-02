/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (HYBRID MODE)
 * Standard & Funinho Layouts
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        lines: [],
        mode: 'standard', // 'standard' oder 'funinho'
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

        setMode(newMode) {
            this.mode = newMode;
            console.log("🏟️ Arena-Modus gewechselt zu: " + newMode);
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
            const w = this.canvas.width;
            const h = this.canvas.height;
            const pad = 60;

            ctx.save();
            ctx.strokeStyle = this.mode === 'funinho' ? "rgba(0, 209, 255, 0.4)" : "rgba(0, 209, 255, 0.15)";
            ctx.lineWidth = 2;

            // Außenlinien
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            if (this.mode === 'standard') {
                this.drawStandardElements(ctx, w, h, pad);
            } else {
                this.drawFuninhoElements(ctx, w, h, pad);
            }
            ctx.restore();
        },

        drawStandardElements(ctx, w, h, pad) {
            // Mittellinie & Kreis
            ctx.beginPath();
            ctx.moveTo(w / 2, pad);
            ctx.lineTo(w / 2, h - pad);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Strafräume & Große Tore
            this.drawBox(ctx, pad, h / 2, 80, 180); 
            this.drawBox(ctx, w - pad, h / 2, -80, 180);
            this.drawGoal(ctx, pad, h / 2, -15, 60); // Links
            this.drawGoal(ctx, w - pad, h / 2, 15, 60); // Rechts
        },

        drawFuninhoElements(ctx, w, h, pad) {
            // Sechsmeter-Linien (Schusszonen)
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(pad + 100, pad); ctx.lineTo(pad + 100, h - pad); // Links
            ctx.moveTo(w - pad - 100, pad); ctx.lineTo(w - pad - 100, h - pad); // Rechts
            ctx.stroke();
            ctx.setLineDash([]);

            // 4 Mini-Tore in den Ecken
            const goalSize = 30;
            const offset = 40;
            this.drawGoal(ctx, pad, pad + offset, -10, goalSize); // Oben Links
            this.drawGoal(ctx, pad, h - pad - offset, -10, goalSize); // Unten Links
            this.drawGoal(ctx, w - pad, pad + offset, 10, goalSize); // Oben Rechts
            this.drawGoal(ctx, w - pad, h - pad - offset, 10, goalSize); // Unten Rechts
        },

        drawBox(ctx, x, y, width, height) {
            ctx.strokeRect(x, y - height / 2, width, height);
            ctx.strokeRect(x, y - height / 4, width / 2.5, height / 2);
        },

        drawGoal(ctx, x, y, depth, size) {
            ctx.save();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + depth, y - size / 2);
            ctx.lineTo(x + depth, y + size / 2);
            ctx.lineTo(x, y + size / 2);
            ctx.stroke();
            ctx.restore();
        },

        drawPlayer(ctx, p) {
            const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            ctx.save();
            ctx.shadowBlur = 12 + (this.pulse * 8);
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number || "", p.x, p.y + 5);
            ctx.font = "10px Inter";
            ctx.fillText((p.name || "").toUpperCase(), p.x, p.y + 35);
            ctx.restore();
        },

        clear() {
            this.lines = [];
            console.log("🧹 Board gelöscht.");
        }
    };
})();
