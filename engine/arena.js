(function() {
    window.arena = {
        canvas: null, ctx: null, players: [], mode: 'standard',
        init(id) {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.canvas.addEventListener('mousedown', (e) => this.handleClick(e));
            this.animate();
        },
        resize() { 
            const c = this.canvas.parentElement; 
            this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight; 
        },
        handleClick(e) {
            const r = this.canvas.getBoundingClientRect();
            const x = e.clientX - r.left; const y = e.clientY - r.top;
            this.players.forEach(p => { if(Math.hypot(p.x - x, p.y - y) < 20) window.showSetcard(p); });
        },
        animate() { this.render(); requestAnimationFrame(() => this.animate()); },
        render() {
            const ctx = this.ctx; ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);
            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                ctx.shadowBlur = 15; ctx.shadowColor = color;
                ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
                ctx.shadowBlur = 0; ctx.fillStyle = "white"; ctx.textAlign = "center";
                ctx.font = "bold 12px sans-serif"; ctx.fillText(p.number, p.x, p.y + 5);
                ctx.font = "10px sans-serif"; ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);
            });
        },
        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height; const pad = 80;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.3)"; ctx.lineWidth = 2;
            
            // Feld & Bänke
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));
            ctx.fillStyle = "rgba(255,106,0,0.1)"; ctx.fillRect(w/2 - 120, pad - 35, 100, 25); // Bank
            
            if(this.mode === 'standard') {
                ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
                ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
                // 16m & 5m
                ctx.strokeRect(pad, h/2 - 110, 90, 220); // 16m Links
                ctx.strokeRect(w-pad-90, h/2 - 110, 90, 220); // 16m Rechts
                ctx.strokeRect(pad, h/2 - 50, 35, 100); // 5m Links
                this.drawGoal(ctx, pad, h/2, -20, 75); this.drawGoal(ctx, w-pad, h/2, 20, 75);
            } else {
                const off = h * 0.22;
                this.drawGoal(ctx, pad, h/2-off, -12, 35); this.drawGoal(ctx, pad, h/2+off, -12, 35);
                this.drawGoal(ctx, w-pad, h/2-off, 12, 35); this.drawGoal(ctx, w-pad, h/2+off, 12, 35);
            }
        },
        drawGoal(ctx, x, y, d, s) {
            ctx.save(); ctx.strokeStyle = "white"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(x, y-s/2); ctx.lineTo(x+d, y-s/2); ctx.lineTo(x+d, y+s/2); ctx.lineTo(x, y+s/2); ctx.stroke(); ctx.restore();
        },
        setMode(m) { this.mode = m; }
    };
})();
