/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (CORE)
 * Hochprofessionelles Rendering & Layer-Management
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        ready: false,

        // Initialisiert das Spielfeld
        init(elementId) {
            const el = document.getElementById(elementId);
            
            // Validierung: Ist es ein echtes Canvas?
            if (!el || el.tagName !== 'CANVAS') {
                console.error("❌ Arena-Fehler: Element mit ID '" + elementId + "' ist kein Canvas.");
                return false;
            }

            this.canvas = el;
            this.ctx = el.getContext('2d');
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.ready = true;
            this.render();
            console.log("🏟️ Arena Engine: Sollzustand aktiv.");
            return true;
        },

        // Passt die Größe an das Grid-System an
        resize() {
            if (!this.canvas) return;
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            this.render();
        },

        // Haupt-Render-Schleife
        render() {
            if (!this.ready || !this.ctx) return;
            const ctx = this.ctx;

            // Hintergrund: Tiefes Anthrazit #0B1220
            ctx.fillStyle = "#0B1220";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawPitchLines(ctx);
            this.players.forEach(p => this.drawPlayer(ctx, p));
        },

        drawPitchLines(ctx) {
            ctx.strokeStyle = "rgba(0, 209, 255, 0.15)"; // Helles Cyan
            ctx.lineWidth = 2;
            
            // Außenlinie mit Sicherheitsabstand
            const pad = 40;
            ctx.strokeRect(pad, pad, this.canvas.width - (pad * 2), this.canvas.height - (pad * 2));
            
            // Mittellinie
            ctx.beginPath();
            ctx.moveTo(this.canvas.width / 2, pad);
            ctx.lineTo(this.canvas.width / 2, this.canvas.height - pad);
            ctx.stroke();
        },

        drawPlayer(ctx, p) {
            const teamColor = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            
            // Neon Glow Effekt
            ctx.shadowBlur = 15;
            ctx.shadowColor = teamColor;
            ctx.fillStyle = teamColor;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();
            
            // Text-Details (Nummer)
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 12px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.number || "0", p.x, p.y + 5);

            // Name unter dem Spieler
            ctx.font = "10px 'Inter', sans-serif";
            ctx.fillText((p.name || "").toUpperCase(), p.x, p.y + 35);
        },

        clear() {
            this.players = [];
            this.render();
        }
    };
})();
