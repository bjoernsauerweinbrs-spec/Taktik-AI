/**
 * =========================================
 * TONI 2.0 – ANIMATED ARENA ENGINE
 * Professionelles Pitch-Rendering & Animationen
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        ready: false,
        pulse: 0, // Für pulsierende Effekte

        init(elementId) {
            const el = document.getElementById(elementId);
            if (!el) return false;

            this.canvas = el;
            this.ctx = el.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.ready = true;
            this.startAnimationLoop(); // Startet die 60FPS Engine
            console.log("🏟️ Live-Arena Engine gestartet.");
            return true;
        },

        resize() {
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        startAnimationLoop() {
            const loop = () => {
                this.update();
                this.render();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        },

        update() {
            // Puls-Variable für Neon-Glow (0 bis 1)
            this.pulse = (Math.sin(Date.now() / 500) + 1) / 2;
        },

        render() {
            if (!this.ready) return;
            const ctx = this.ctx;

            // 1. Hintergrund (Deep Dark)
            ctx.fillStyle = "#0B1220";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // 2. Spielfeld-Markierungen
            this.drawProfessionalPitch(ctx);

            // 3. Spieler zeichnen
            this.players.forEach(p => this.drawAnimatedPlayer(ctx, p));
        },

        drawProfessionalPitch(ctx) {
            const w = this.canvas.width;
            const h = this.canvas.height;
            const pad = 50; // Padding

            ctx.save();
            ctx.strokeStyle = "rgba(0, 209, 255, 0.15)";
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "rgba(0, 209, 255, 0.5)";

            // Außenlinie
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            // Mittellinie & Kreis
            ctx.beginPath();
            ctx.moveTo(w / 2, pad);
            ctx.lineTo(w / 2, h - pad);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Strafräume
            this.drawBox(ctx, pad, h / 2, 80, 160); // Links
            this.drawBox(ctx, w - pad, h / 2, -80, 160); // Rechts

            ctx.restore();
        },

        drawBox(ctx, x, y, width, height) {
            ctx.strokeRect(x, y - height / 2, width, height);
            // Fünfmeterraum
            ctx.strokeRect(x, y - height / 4, width / 2.5, height / 2);
        },

        drawAnimatedPlayer(ctx, p) {
            const teamColor = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            
            ctx.save();
            
            // Neon-Glow (Pulsierend)
            ctx.shadowBlur = 10 + (this.pulse * 10);
            ctx.shadowColor = teamColor;
            
            // Spieler-Körper
            ctx.fillStyle = teamColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();

            // Aktiver Auswahl-Ring (falls vorhanden)
            if (p.selected) {
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Nummer
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 13px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 5);

            // Name
            ctx.font = "10px 'Inter', sans-serif";
            ctx.fillText(p.name.toUpperCase(), p.x, p.y + 35);

            ctx.restore();
        },

        clear() {
            this.players = [];
        }
    };
})();
