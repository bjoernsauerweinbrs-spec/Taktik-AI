/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (INTERACTIVE)
 * Player Rendering & Click Detection
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null, ctx: null, players: [], mode: 'standard', 
        
        init(elementId) {
            const el = document.getElementById(elementId);
            if (!el) return false;
            this.canvas = el;
            this.ctx = el.getContext('2d');
            this.resize();
            
            // Klick-Erkennung für Spieler
            this.canvas.addEventListener('mousedown', (e) => this.handleInteraction(e));
            
            window.addEventListener('resize', () => this.resize());
            this.startLoop();
            return true;
        },

        handleInteraction(e) {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Prüfe, ob ein Spieler berührt wurde
            this.players.forEach(p => {
                const dist = Math.hypot(p.x - x, p.y - y);
                if (dist < 20) {
                    if (window.showSetcard) window.showSetcard(p);
                }
            });
        },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);

            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                
                // Spieler-Punkt (Neon-Style)
                ctx.shadowBlur = 15; ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
                ctx.fill();

                // FIX: NAME & NUMMER (Wiederhergestellt)
                ctx.shadowBlur = 0; ctx.fillStyle = "white";
                ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
                ctx.fillText(p.number, p.x, p.y + 5);
                
                ctx.font = "10px Inter";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);
            });
        },

        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height;
            const pad = 60;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)"; ctx.lineWidth = 2;
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));
            // Mittellinie
            ctx.beginPath(); ctx.moveTo(w / 2, pad); ctx.lineTo(w / 2, h - pad); ctx.stroke();
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        startLoop() {
            const loop = () => { this.render(); requestAnimationFrame(loop); };
            requestAnimationFrame(loop);
        }
    };
})();
