(function() {
    window.arena = {
        canvas: null, ctx: null, 
        players: [], 
        ball: { x: 400, y: 300, owner: 'none' }, // Der Spielball
        mode: 'standard',

        init(id) {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        },

        resize() { 
            const c = this.canvas.parentElement; 
            this.canvas.width = c.clientWidth; 
            this.canvas.height = c.clientHeight; 
        },

        // Ball auf Kommando verschieben
        moveBall(side) {
            const w = this.canvas.width;
            const h = this.canvas.height;
            if(side === 'links') this.ball.x = 150;
            if(side === 'rechts') this.ball.x = w - 150;
            if(side === 'mitte') this.ball.x = w / 2;
            this.ball.y = h / 2;
            
            // Sofortige Reaktion der blauen Abwehr
            this.shiftDefense();
        },

        // Toni's Abwehr (Blau) verschiebt ballorientiert
        shiftDefense() {
            const bluePlayers = this.players.filter(p => p.team === 'away');
            bluePlayers.forEach(p => {
                // Ballorientiertes Einrücken (Nagelsmann-Prinzip)
                const targetX = this.ball.x + (p.initialPos === 'links' ? -50 : 50);
                p.x += (targetX - p.x) * 0.1; // Weiche Bewegung
            });
        },

        animate() { this.render(); requestAnimationFrame(() => this.animate()); },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);
            
            // Spieler zeichnen
            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "white"; ctx.font = "bold 12px sans-serif";
                ctx.fillText(p.number, p.x, p.y + 5);
            });

            // Ball zeichnen
            ctx.fillStyle = "white";
            ctx.shadowBlur = 10; ctx.shadowColor = "white";
            ctx.beginPath(); ctx.arc(this.ball.x, this.ball.y, 8, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;
        },

        drawPitch(ctx) {
            const w = this.canvas.width; const h = this.canvas.height; const pad = 80;
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)"; ctx.lineWidth = 2;
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
            ctx.strokeRect(pad, h/2 - 110, 90, 220); // 16m
            ctx.strokeRect(w-pad-90, h/2 - 110, 90, 220);
        }
    };
})();
