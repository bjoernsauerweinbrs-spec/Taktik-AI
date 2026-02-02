/**
 * =========================================
 * TONI 2.0 – ARENA ENGINE (HIGH PROFESSIONAL)
 * Multi-Layer Rendering, Animation-Loop & Trails
 * =========================================
 */
(function() {
    window.arena = {
        canvas: null,
        ctx: null,
        players: [],
        ready: false,
        pulse: 0, // Puls-Variable für Neon-Effekte

        // Initialisiert die Engine mit Sicherheitsprüfung gegen getContext-Fehler
        init(elementId) {
            const el = document.getElementById(elementId);
            
            if (!el || el.tagName !== 'CANVAS') {
                console.error("❌ Arena-Fehler: Element mit ID '" + elementId + "' ist kein Canvas.");
                return false;
            }

            this.canvas = el;
            this.ctx = el.getContext('2d');
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            this.ready = true;
            this.startAnimationLoop(); // Startet das 60FPS Rendering
            console.log("🏟️ Live-Arena Engine: Sollzustand aktiv.");
            return true;
        },

        // Passt die Canvas-Größe dynamisch an das Grid-System an
        resize() {
            if (!this.canvas) return;
            const container = this.canvas.parentElement;
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
        },

        // Der zentrale Animation-Loop für flüssige Bewegungen (0.12s ease Feeling)
        startAnimationLoop() {
            const loop = () => {
                this.update();
                this.render();
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        },

        update() {
            // Berechnet den Puls-Faktor für den Neon-Glow
            this.pulse = (Math.sin(Date.now() / 500) + 1) / 2;
        },

        render() {
            if (!this.ready || !this.ctx) return;
            const ctx = this.ctx;

            // 1. Hintergrund: Tiefes Anthrazit #0B1220
            ctx.fillStyle = "#0B1220";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // 2. Professionelles Spielfeld-Layout (Cyan-Hologramm Style)
            this.drawProfessionalPitch(ctx);

            // 3. Bewegungs-Trails (Laufweg-Spuren) zeichnen
            this.drawPlayerTrails(ctx);

            // 4. Spieler-Objekte mit pulsierendem Glow rendern
            this.players.forEach(p => this.drawAnimatedPlayer(ctx, p));
        },

        drawProfessionalPitch(ctx) {
            const w = this.canvas.width;
            const h = this.canvas.height;
            const pad = 50; // Sicherheitsabstand zum Rand

            ctx.save();
            ctx.strokeStyle = "rgba(0, 209, 255, 0.15)"; // Helles Cyan für Linien
            ctx.lineWidth = 2;
            ctx.shadowBlur = 5;
            ctx.shadowColor = "rgba(0, 209, 255, 0.5)";

            // Außenlinien
            ctx.strokeRect(pad, pad, w - (pad * 2), h - (pad * 2));

            // Mittellinie & Mittelkreis
            ctx.beginPath();
            ctx.moveTo(w / 2, pad);
            ctx.lineTo(w / 2, h - pad);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
            ctx.stroke();

            // Strafräume (Links & Rechts)
            this.drawPenaltyBox(ctx, pad, h / 2, 80, 160);
            this.drawPenaltyBox(ctx, w - pad, h / 2, -80, 160);

            ctx.restore();
        },

        drawPenaltyBox(ctx, x, y, width, height) {
            ctx.strokeRect(x, y - height / 2, width, height); // Großer Strafraum
            ctx.strokeRect(x, y - height / 4, width / 2.5, height / 2); // Fünfmeterraum
        },

        drawPlayerTrails(ctx) {
            ctx.save();
            ctx.globalAlpha = 0.25; // Transparente Trails für zeitliche Gewichtung
            
            this.players.forEach(p => {
                if (p.lastX && p.lastY && (p.lastX !== p.x || p.lastY !== p.y)) {
                    ctx.strokeStyle = p.team === 'home' ? '#FF6A00' : '#00D1FF';
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(p.lastX, p.lastY);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
                // Aktuelle Position für den nächsten Frame speichern
                p.lastX = p.x;
                p.lastY = p.y;
            });
            
            ctx.restore();
        },

        drawAnimatedPlayer(ctx, p) {
            const teamColor = p.team === 'home' ? '#FF6A00' : '#00D1FF'; // Neon-Orange vs Cyan
            
            ctx.save();
            
            // Neon-Glow Effekt (Pulsierend über die Engine-Variable)
            ctx.shadowBlur = 10 + (this.pulse * 15);
            ctx.shadowColor = teamColor;
            
            // Hauptkörper des Spielers
            ctx.fillStyle = teamColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
            ctx.fill();

            // Aktiver Auswahl-Ring bei Drag & Drop Interaktion
            if (p.selected) {
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 23, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Rückennummer
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 13px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.number || "0", p.x, p.y + 1);

            // Spielername (Immer Großbuchstaben für Profi-Look)
            ctx.font = "10px 'Inter', sans-serif";
            ctx.fillText((p.name || "").toUpperCase(), p.x, p.y + 35);

            ctx.restore();
        },

        // Bereinigt das Spielfeld
        clear() {
            this.players = [];
        }
    };
})();
