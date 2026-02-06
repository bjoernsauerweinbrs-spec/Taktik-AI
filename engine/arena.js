/**
 * TONI 2.0 - ARENA ENGINE
 * Zeichnet das Spielfeld und verwaltet Objekte
 */
window.arena = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render();
    },

    resize() {
        const container = document.getElementById('stage-container');
        this.canvas.width = container.clientWidth * 0.98;
        this.canvas.height = container.clientHeight * 0.95;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.render();
    },

    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        // 1. Spielfeld Hintergrund (Deep Green)
        ctx.fillStyle = "#0A1A0A";
        ctx.fillRect(0, 0, w, h);

        // 2. Linien-Stil (Neon-Grün)
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#39FF14";

        // Außenlinien
        ctx.strokeRect(20, 20, w - 40, h - 40);

        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, 20);
        ctx.lineTo(w / 2, h - 20);
        ctx.stroke();

        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();

        // Strafräume (unten & oben)
        // Unten
        ctx.strokeRect(w * 0.25, h - 120, w * 0.5, 100); 
        // 5m-Raum (Deine Vision!)
        ctx.strokeRect(w * 0.40, h - 50, w * 0.2, 30);

        // Oben
        ctx.strokeRect(w * 0.25, 20, w * 0.5, 100);
        // 5m-Raum
        ctx.strokeRect(w * 0.40, 20, w * 0.2, 30);

        ctx.shadowBlur = 0; // Reset für andere Objekte
    }
};
