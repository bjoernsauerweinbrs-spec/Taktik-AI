(function() {
    window.arena = {
        canvas: null, ctx: null, players: [], mode: 'standard',
        
        init(id) {
            this.canvas = document.getElementById(id);
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            this.canvas.addEventListener('mousedown', (e) => this.handlePointer(e));
            this.animate();
            return true;
        },

        resize() {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
        },

        handlePointer(e) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.players.forEach(p => {
                const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
                if(dist < 20) {
                    if(window.showSetcard) window.showSetcard(p);
                }
            });
        },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);
            
            this.players.forEach(p => {
                const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                
                // Spieler-Punkt
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
                ctx.fill();

                // FIX: NAME & NUMMER ANZEIGEN
                ctx.fillStyle = "white";
                ctx.font = "bold 12px Inter";
                ctx.textAlign = "center";
                ctx.fillText(p.number, p.x, p.y + 5);
                
                ctx.font = "10px Inter";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 30);
                
                // Form-Indikator (kleiner Glow wenn Bewertung hoch)
                if(p.rating > 7) {
                    ctx.strokeStyle = "#28C76F";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        },

        drawPitch(ctx) {
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)";
            ctx.strokeRect(50, 50, this.canvas.width - 100, this.canvas.height - 100);
            // ... (Hier kommen die Tore aus dem letzten stabilen Update rein)
        },

        animate() {
            this.render();
            requestAnimationFrame(() => this.animate());
        }
    };
})();
