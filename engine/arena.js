// =========================================
// Toni 2.0 – Arena Engine (Vollständig)
// =========================================

window.arena = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    players: [],
    lines: [],
    zones: [],
    sequences: [],
    ready: false,

    // Initialisierung
    init(canvasElement) {
        if (!canvasElement) return;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext("2d");
        this.resize();
        window.addEventListener("resize", () => this.resize());
        this.ready = true;
        this.render();
        console.log("🏟️ Arena bereit.");
    },

    // Größe anpassen
    resize() {
        if (!this.canvas) return;
        const container = this.canvas.parentElement;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.render();
    },

    // Haupt-Render-Schleife
    render() {
        if (!this.ready || !this.ctx) return;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Hintergrund
        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, this.width, this.height);

        this.drawPitchLines(ctx);

        // Objekte zeichnen
        this.zones.forEach(z => this.drawZone(ctx, z));
        this.lines.forEach(l => this.drawLine(ctx, l));
        this.players.forEach(p => this.drawPlayer(ctx, p));
        this.sequences.forEach(s => this.drawSequenceStep(ctx, s));
    },

    drawPitchLines(ctx) {
        ctx.strokeStyle = "rgba(0, 255, 150, 0.15)";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, this.width - 100, this.height - 100);
        ctx.beginPath();
        ctx.moveTo(this.width / 2, 50);
        ctx.lineTo(this.width / 2, this.height - 50);
        ctx.stroke();
    },

    // Diese Funktion muss für tools.js sichtbar sein
    drawLine(ctx, line) {
        ctx.strokeStyle = line.color || "rgba(0,150,255,0.9)";
        ctx.lineWidth = line.width || 3;
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
    },

    drawPlayer(ctx, player) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = player.color || "#ff6a00";
        ctx.fillStyle = player.color || "rgba(255, 106, 0, 0.9)";
        ctx.beginPath();
        ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.number || "0", player.x, player.y);
        ctx.font = "10px Inter";
        ctx.fillText(player.name || "", player.x, player.y + 30);
    },

    drawZone(ctx, zone) {
        ctx.fillStyle = zone.color || "rgba(255,106,0,0.2)";
        ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    },

    drawSequenceStep(ctx, step) {
        ctx.fillStyle = step.color || "rgba(255,106,0,0.6)";
        ctx.beginPath();
        ctx.arc(step.x, step.y, step.size || 12, 0, Math.PI * 2);
        ctx.fill();
    }
};

// Alias für Abwärtskompatibilität
window.initArena = (el) => window.arena.init(el);
window.renderArena = () => window.arena.render();
