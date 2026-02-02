/**
 * TONI 2.0 – ARENA ENGINE (FULL VERSION)
 * Goal Rendering & Hybrid Layouts
 */
(function() {
    window.arena = {
        canvas: null, ctx: null, players: [], mode: 'standard', pulse: 0,

        init(id) {
            this.canvas = document.getElementById(id);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.canvas.addEventListener('mousedown', (e) => this.handleClick(e));
            this.animate();
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        handleClick(e) {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            this.players.forEach(p => {
                if (Math.hypot(p.x - mx, p.y - my) < 20) window.showSetcard(p);
            });
        },

        animate() {
            this.pulse = (Math.sin(Date.now() / 500) + 1) / 2;
            this.render();
            requestAnimationFrame(() => this.animate());
        },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);

            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                ctx.shadowBlur = 10 + (this.pulse * 10); ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = "white"; ctx.textAlign = "center";
                ctx.font = "bold 12px Inter";
                ctx.fillText(p.number, p.x, p.y + 5);
                ctx.font = "10px Inter";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);
            });
        },

        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height; const pad = 60;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)"; ctx.lineWidth = 2;
            
            // Außenlinie
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            if (this.mode === 'standard') {
                this.drawStandardElements(ctx, w, h, pad);
            } else {
                this.drawFuninhoElements(ctx, w, h, pad);
            }
        },

        drawStandardElements(ctx, w, h, pad) {
            // Mittellinie & Kreis
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI * 2); ctx.stroke();
            
            // Strafräume
            ctx.strokeRect(pad, h/2 - 90, 80, 180); // Links
            ctx.strokeRect(w - pad - 80, h/2 - 90, 80, 180); // Rechts
            
            // TORE (Standard)
            this.drawGoal(ctx, pad, h/2, -15, 65); // Links
            this.drawGoal(ctx, w - pad, h/2, 15, 65); // Rechts
        },

        drawFuninhoElements(ctx, w, h, pad) {
            const goalSize = 35;
            const offset = h * 0.22; // Optimierter Versatz von den Ecken

            // 4 TORE (Funinho)
            this.drawGoal(ctx, pad, h/2 - offset, -10, goalSize);
            this.drawGoal(ctx, pad, h/2 + offset, -10, goalSize);
            this.drawGoal(ctx, w - pad, h/2 - offset, 10, goalSize);
            this.drawGoal(ctx, w - pad, h/2 + offset, 10, goalSize);
            
            // Schusszonen
            ctx.setLineDash([5, 10]);
            ctx.beginPath();
            ctx.moveTo(pad + 100, pad); ctx.lineTo(pad + 100, h - pad);
            ctx.moveTo(w - pad - 100, pad); ctx.lineTo(w - pad - 100, h - pad);
            ctx.stroke();
            ctx.setLineDash([]);
        },

        drawGoal(ctx, x, y, depth, size) {
            ctx.save();
            ctx.strokeStyle = "white"; ctx.lineWidth = 3;
            ctx.shadowBlur = 10; ctx.shadowColor = "white";
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2);
            ctx.lineTo(x + depth, y - size / 2);
            ctx.lineTo(x + depth, y + size / 2);
            ctx.lineTo(x, y + size / 2);
            ctx.stroke();
            ctx.restore();
        },

        setMode(m) { this.mode = m; }
    };
})();
