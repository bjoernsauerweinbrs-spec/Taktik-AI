/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (OFFENSIVE EDITION)
 * Spielfeld mit Toren, Strafräumen & Animationen
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        lines: [],
        zones: [],
        ready: false,
        pulse: 0,

        // Initialisiert die Engine
        init(elementId) {
            const el = document.getElementById(elementId);
            if (!el) return false;
            this.canvas = el;
            this.ctx = el.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.ready = true;
            this.startAnimationLoop();
            console.log("🏟️ Arena bereit: Tore sind aufgebaut!");
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
            this.pulse = (Math.sin(Date.now() / 500) + 1) / 2;
        },

        render() {
            if (!this.ready) return;
            const ctx = this.ctx;

            // Hintergrund: Tiefes Anthrazit
            ctx.fillStyle = "#0B1220";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawPitch(ctx);
            this.drawTacticalLayers(ctx);
            this.players.forEach(p => this.drawPlayer(ctx, p));
        },

        drawPitch(ctx) {
            const w = this.canvas.width;
            const h = this.canvas.height;
            const pad = 60; // Padding für Seitenlinien

            ctx.save();
            ctx.strokeStyle = "rgba(0, 209, 255, 0.2)";
            ctx.lineWidth = 2;

            // 1. Außenlinien
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            // 2. Mittellinie & Kreis
            ctx.beginPath();
            ctx.moveTo(w / 2, pad);
            ctx.lineTo(w / 2, h - pad);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // 3. Strafräume
            this.drawBox(ctx, pad, h / 2, 80, 180); // Links
            this.drawBox(ctx, w - pad, h / 2, -80, 180); // Rechts

            // 4. DIE TORE (Hologramm-Stil)
            this.drawGoal(ctx, pad, h / 2, -15); // Tor Links
            this.drawGoal(ctx, w - pad, h / 2, 15); // Tor Rechts

            ctx.restore();
        },

        drawBox(ctx, x, y, width, height) {
            ctx.strokeRect(x, y - height / 2, width, height); // Großer Kasten
            ctx.strokeRect(x, y - height / 4, width / 2.5, height / 2); // Fünfer
        },

        drawGoal(ctx, x, y, depth) {
            const goalWidth = 60; // Breite des Tores auf dem Canvas
            ctx.save();
            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";

            // Torpfosten und Latte
            ctx.beginPath();
            ctx.moveTo(x, y - goalWidth / 2);
            ctx.lineTo(x + depth, y - goalWidth / 2);
            ctx.lineTo(x + depth, y + goalWidth / 2);
            ctx.lineTo(x, y + goalWidth / 2);
            ctx.stroke();
            
            ctx.restore();
        },

        drawTacticalLayers(ctx) {
            // Zeichnet Pässe und Laufwege aus dem Tools-Modul
            this.lines.forEach(l => {
                ctx.save();
                ctx.setLineDash(l.dashed ? [10, 5] : []);
                ctx.strokeStyle = l.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(l.x1, l.y1);
                ctx.lineTo(l.x2, l.y2);
                ctx.stroke();
                ctx.restore();
            });
        },

        drawPlayer(ctx, p) {
            const color = p.team === 'home' ? '#FF6A00' : '#00D1FF';
            ctx.save();
            
            // Neon Glow
            ctx.shadowBlur = 12 + (this.pulse * 8);
            ctx.shadowColor = color;
            ctx.fillStyle = color;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();

            // Nummer & Name
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 12px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number || "", p.x, p.y + 5);
            
            ctx.font = "10px Inter";
            ctx.fillText((p.name || "").toUpperCase(), p.x, p.y + 35);
            
            ctx.restore();
        },

        clear() {
            this.lines = [];
            this.zones = [];
            console.log("🧹 Spielfeld bereinigt.");
        }
    };
})();
