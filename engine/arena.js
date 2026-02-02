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
            this.canvas.width = c.clientWidth; 
            this.canvas.height = c.clientHeight; 
        },
        handleClick(e) {
            const r = this.canvas.getBoundingClientRect(); 
            const x = e.clientX - r.left; 
            const y = e.clientY - r.top;
            this.players.forEach(p => { 
                if(Math.hypot(p.x - x, p.y - y) < 22) window.showFullSetcard(p); 
            });
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
                ctx.font = "bold 12px Inter"; ctx.fillText(p.number, p.x, p.y + 5);
                ctx.font = "10px Inter"; ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);
            });
        },
        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height; const pad = 80;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.3)"; ctx.lineWidth = 2;
            
            // Hauptspielfeld
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));
            
            // AUSWECHSELBÄNKE (Substitutes Benches)
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(w/2 - 150, pad - 40, 120, 30); // Heim Bank
            ctx.fillRect(w/2 + 30, pad - 40, 120, 30);  // Gast Bank
            ctx.strokeStyle = "rgba(255, 106, 0, 0.5)";
            ctx.strokeRect(w/2 - 150, pad - 40, 120, 30);
            
            if(this.mode === 'standard') {
                // Mittellinie & Kreis
                ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
                ctx.beginPath(); ctx.arc(w/2, h/2, 70, 0, Math.PI * 2); ctx.stroke();

                // 16m STRAFRAUM (Penalty Area)
                ctx.strokeRect(pad, h/2 - 120, 100, 240); // Links
                ctx.strokeRect(w - pad - 100, h/2 - 120, 100, 240); // Rechts

                // 5m TORRAUM (Goal Area)
                ctx.strokeRect(pad, h/2 - 60, 40, 120); // Links
                ctx.strokeRect(w - pad - 40, h/2 - 60, 40, 120); // Rechts

                // Elfmeterpunkt
                ctx.fillStyle = "white";
                ctx.beginPath(); ctx.arc(pad + 80, h/2, 3, 0, Math.PI*2); ctx.fill();
                ctx.beginPath(); ctx.arc(w - pad - 80, h/2, 3, 0, Math.PI*2); ctx.fill();

                this.drawGoal(ctx, pad, h/2, -20, 80); 
                this.drawGoal(ctx, w - pad, h/2, 20, 80);
            } else {
                // Funinho Modus
                const off = h * 0.22;
                this.drawGoal(ctx, pad, h/2 - off, -10, 40); this.drawGoal(ctx, pad, h/2 + off, -10, 40);
                this.drawGoal(ctx, w - pad, h/2 - off, 10, 40); this.drawGoal(ctx, w - pad, h/2 + off, 10, 40);
            }
        },
        drawGoal(ctx, x, y, depth, size) {
            ctx.save(); ctx.strokeStyle = "white"; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.moveTo(x, y - size / 2); ctx.lineTo(x + depth, y - size / 2);
            ctx.lineTo(x + depth, y + size / 2); ctx.lineTo(x, y + size / 2); ctx.stroke(); ctx.restore();
        },
        setMode(m) { this.mode = m; }
    };
})();
