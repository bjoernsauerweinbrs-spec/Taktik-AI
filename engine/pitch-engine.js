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
        const w = this.canvas.width, h = this.canvas.height, ctx = this.ctx;
        const conf = this.modes[this.currentMode];
        ctx.fillStyle = conf.grass; ctx.fillRect(0,0,w,h);
        const p = 40; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w-2*p, h-2*p);
        ctx.beginPath(); ctx.moveTo(w/2, p); ctx.lineTo(w/2, h-p); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI*2); ctx.stroke();
        if(this.currentMode === 'funino') {
            const gW = 40;
            ctx.strokeRect(p, p+50, 5, gW); ctx.strokeRect(p, h-p-50-gW, 5, gW);
            ctx.strokeRect(w-p-5, p+50, 5, gW); ctx.strokeRect(w-p-5, h-p-50-gW, 5, gW);
        } else {
            ctx.strokeRect(p-10, h/2-50, 10, 100); ctx.strokeRect(w-p, h/2-50, 10, 100);
            ctx.strokeRect(p, h/2-120, 80, 240); ctx.strokeRect(w-p-80, h/2-120, 80, 240);
        }
    }
};
