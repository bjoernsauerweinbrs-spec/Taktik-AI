/**
 * TONI 2.0 – ARENA ENGINE
 * Sicherstellung der Spielfeld-Darstellung & Spieler-Interaktion
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
            
            // Klick-Erkennung für Setcard-Öffnung
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
                const dist = Math.hypot(p.x - mx, p.y - my);
                if (dist < 20) window.showSetcard(p);
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
                
                // Spieler-Glow
                ctx.shadowBlur = 10 + (this.pulse * 10); ctx.shadowColor = color;
                ctx.fillStyle = color;
                ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();

                // NAME & NUMMER (Wiederhergestellt)
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
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2)); // Außenlinie
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke(); // Mitte
        },

        setMode(m) { this.mode = m; }
    };
})();
