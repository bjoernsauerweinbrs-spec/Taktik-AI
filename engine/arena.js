(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        layers: { heatmap: true, tracking: true, zones: true },
        
        init(canvasId) {
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            console.log("🏟️ Arena Engine: Multi-Layer Ready");
        },

        resize() {
            this.canvas.width = this.canvas.parentElement.clientWidth;
            this.canvas.height = this.canvas.parentElement.clientHeight;
            this.render();
        },

        render() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawPitch(ctx);
            if (this.layers.heatmap) this.drawHeatmap(ctx);
            this.players.forEach(p => this.drawPlayer(ctx, p));
        },

        drawPitch(ctx) {
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)";
            ctx.lineWidth = 2;
            ctx.strokeRect(40, 40, this.canvas.width - 80, this.canvas.height - 80);
            // Mittellinie
            ctx.beginPath();
            ctx.moveTo(this.canvas.width / 2, 40);
            ctx.lineTo(this.canvas.width / 2, this.canvas.height - 40);
            ctx.stroke();
        },

        drawPlayer(ctx, p) {
            // Neon Glow Effekt
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            ctx.fillStyle = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFF";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 5);
        },

        drawHeatmap(ctx) {
            // Simulation einer taktischen Zone
            ctx.fillStyle = "rgba(0, 209, 255, 0.05)";
            ctx.fillRect(this.canvas.width * 0.6, 40, this.canvas.width * 0.3, this.canvas.height - 80);
        }
    };
})();
