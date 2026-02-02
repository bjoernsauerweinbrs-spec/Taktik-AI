(function() {
    window.arena = {
        canvas: null, ctx: null, players: [], mode: 'standard',

        init(id) {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.canvas.addEventListener('mousedown', (e) => this.handleInteraction(e));
            this.animate();
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        handleInteraction(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.players.forEach(p => {
                if(Math.hypot(p.x - x, p.y - y) < 20) window.showFullSetcard(p);
            });
        },

        animate() {
            this.render();
            requestAnimationFrame(() => this.animate());
        },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);

            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                
                // Spieler-Icon
                ctx.shadowBlur = 15; ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
                
                // Name & Nummer
                ctx.shadowBlur = 0; ctx.fillStyle = "white"; ctx.textAlign = "center";
                ctx.font = "bold 12px Inter";
                ctx.fillText(p.number, p.x, p.y + 5);
                ctx.font = "10px Inter";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);
                
                // Status-Punkt (Bio-Check)
                ctx.fillStyle = p.status === "Bereit" ? "#28C76F" : "#FF6A00";
                ctx.beginPath(); ctx.arc(p.x + 12, p.y - 12, 5, 0, Math.PI * 2); ctx.fill();
            });
        },

        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height; const pad = 60;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.25)"; ctx.lineWidth = 2;
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            if(this.mode === 'standard') {
                ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
                ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI * 2); ctx.stroke();
                this.drawGoal(ctx, pad, h/2, -15, 75); // Tor Links
                this.drawGoal(ctx, w - pad, h/2, 15, 75); // Tor Rechts
            } else {
                const off = h * 0.22;
                this.drawGoal(ctx, pad, h/2 - off, -10, 35);
                this.drawGoal(ctx, pad, h/2 + off, -10, 35);
                this.drawGoal(ctx, w - pad, h/2 - off, 10, 35);
                this.drawGoal(ctx, w - pad, h/2 + off, 10, 35);
            }
        },

        drawGoal(ctx, x, y, depth, size) {
            ctx.save(); ctx.strokeStyle = "white"; ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y - size / 2); ctx.lineTo(x + depth, y - size / 2);
            ctx.lineTo(x + depth, y + size / 2); ctx.lineTo(x, y + size / 2);
            ctx.stroke(); ctx.restore();
        },

        setMode(m) { this.mode = m; }
    };
})();
