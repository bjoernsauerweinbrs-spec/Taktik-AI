window.PitchEngine = {
    canvas: null, ctx: null, currentMode: 'grossfeld',
    modes: {
        'funino': { grass: '#071A07', goals: 'four' },
        'grossfeld': { grass: '#05080F', goals: 'two' }
    },
    init() {
        this.canvas = document.getElementById('tactic-board');
        this.ctx = this.canvas.getContext('2d');
        this.draw();
    },
    setMode(m) { this.currentMode = m; this.draw(); },
    draw() {
        if(!this.canvas) return;
        const w = this.canvas.width, h = this.canvas.height, ctx = this.ctx;
        const conf = this.modes[this.currentMode];
        
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle = conf.grass; ctx.fillRect(0,0,w,h);
        
        const p = 60; // Padding für MacBook Ränder
        ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w-2*p, h-2*p);
        
        // Mittellinie & Kreis
        ctx.beginPath(); ctx.moveTo(w/2, p); ctx.lineTo(w/2, h-p); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();

        if(this.currentMode === 'funino') {
            const gW = 50;
            ctx.strokeStyle = "#39FF14";
            ctx.strokeRect(p, p+80, 5, gW); ctx.strokeRect(p, h-p-80-gW, 5, gW);
            ctx.strokeRect(w-p-5, p+80, 5, gW); ctx.strokeRect(w-p-5, h-p-80-gW, 5, gW);
        } else {
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(p-10, h/2-60, 10, 120); ctx.strokeRect(w-p, h/2-60, 10, 120);
            ctx.strokeRect(p, h/2-150, 100, 300); ctx.strokeRect(w-p-100, h/2-150, 100, 300);
        }
    }
};
