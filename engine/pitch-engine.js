window.PitchEngine = {
    canvas: null,
    ctx: null,
    currentMode: 'grossfeld', // Standard
    
    // Konfiguration der Feldtypen
    modes: {
        'funino': { lines: '#fff', grass: '#071A07', goals: 'four', areas: false },
        'kleinfeld': { lines: '#fff', grass: '#091F09', goals: 'two', areas: true },
        'grossfeld': { lines: '#fff', grass: '#05080F', goals: 'two', areas: true }
    },

    init() {
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.draw();
    },

    setMode(mode) {
        if (this.modes[mode]) {
            this.currentMode = mode;
            this.draw();
            console.log(`🏟️ Arena-Modus gewechselt auf: ${mode.toUpperCase()}`);
        }
    },

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const ctx = this.ctx;
        const config = this.modes[this.currentMode];

        // 1. Rasen/Hintergrund
        ctx.fillStyle = config.grass;
        ctx.fillRect(0, 0, w, h);

        // 2. Außenlinien (mit Puffer)
        const p = 40; // Padding
        ctx.strokeStyle = config.lines;
        ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w - 2 * p, h - 2 * p);

        // 3. Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, p);
        ctx.lineTo(w / 2, h - p);
        ctx.stroke();

        // 4. Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();

        // 5. Tore & Strafräume je nach Modus
        if (this.currentMode === 'funino') {
            this.drawFourGoals(p, w, h);
        } else {
            this.drawStandardGoals(p, w, h, config.areas);
        }
    },

    drawStandardGoals(p, w, h, drawAreas) {
        const ctx = this.ctx;
        const goalWidth = 100;
        
        // Tore (Links/Rechts)
        ctx.strokeRect(p - 10, h / 2 - goalWidth / 2, 10, goalWidth);
        ctx.strokeRect(w - p, h / 2 - goalWidth / 2, 10, goalWidth);

        if (drawAreas) {
            // Strafräume
            ctx.strokeRect(p, h / 2 - 150, 100, 300);
            ctx.strokeRect(w - p - 100, h / 2 - 150, 100, 300);
        }
    },

    drawFourGoals(p, w, h) {
        const ctx = this.ctx;
        const gW = 40; // Mini-Tor Breite
        // Funino Tore (Oben/Unten links und rechts)
        ctx.strokeRect(p, p + 50, 5, gW);
        ctx.strokeRect(p, h - p - 50 - gW, 5, gW);
        ctx.strokeRect(w - p - 5, p + 50, 5, gW);
        ctx.strokeRect(w - p - 5, h - p - 50 - gW, 5, gW);
    }
};
