/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (MODUS UPDATE)
 * Fixed Funinho Goal Placement
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        ready: false,
        pulse: 0,
        mode: 'standard', 

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
            if (window.toniSpeak) toniSpeak("Wechsle in den " + newMode + " Modus.");
        },

        resize() {
            if (!this.canvas) return;
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
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)";
            ctx.lineWidth = 2;
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            if (this.mode === 'standard') {
                this.drawStandardPitch(ctx, w, h, pad);
            } else {
                this.drawFuninhoPitch(ctx, w, h, pad);
            }
            ctx.restore();
        },

        drawStandardPitch(ctx, w, h, pad) {
            ctx.beginPath();
            ctx.moveTo(w / 2, pad);
            ctx.lineTo(w / 2, h - pad);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
            ctx.stroke();
            this.drawGoal(ctx, pad, h / 2, -15, 60);
            this.drawGoal(ctx, w - pad, h / 2, 15, 60);
        },

        drawFuninhoPitch(ctx, w, h, pad) {
            const goalSize = 35;
            // Funinho Tore: Versetzt von den Ecken nach innen (ca. 25% der Torlinie)
            const goalOffset = h * 0.25; 
            
            // Links
            this.drawGoal(ctx, pad, h / 2 - goalOffset, -10, goalSize);
            this.drawGoal(ctx, pad, h / 2 + goalOffset, -10, goalSize);
            // Rechts
            this.drawGoal(ctx, w - pad, h / 2 - goalOffset, 10, goalSize);
            this.drawGoal(ctx, w - pad, h / 2 + goalOffset, 10, goalSize);
            
            // Schusszonen-Markierung (Sechsmeter)
            ctx.setLineDash([5, 10]);
            ctx.beginPath();
            ctx.moveTo(pad + 100, pad); ctx.lineTo(pad + 100, h - pad);
            ctx.moveTo(w - pad - 100, pad); ctx.lineTo(w - pad - 100, h - pad);
            ctx.stroke();
            ctx.setLineDash([]);
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
            ctx.restore();
        }
    };
})();
