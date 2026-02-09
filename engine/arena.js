/**
 * TONI 2.0 - ARENA ENGINE (ELITE PRO PITCH UPDATE)
 * Status: FINALISIERT
 * Fokus: Profi-Markierungen & Transformation & Layering-Fix
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    selectedElement: null,
    benchHeight: 140, 
    isAnimating: false,

    formations: {
        '3-4-3': [ 
            {p: 'TW', x: 0.1, y: 0.5},
            {p: 'IV', x: 0.25, y: 0.5}, {p: 'LIV', x: 0.22, y: 0.3}, {p: 'RIV', x: 0.22, y: 0.7},
            {p: 'ZM', x: 0.4, y: 0.4}, {p: 'ZM', x: 0.4, y: 0.6},
            {p: 'LAV', x: 0.35, y: 0.15}, {p: 'RAV', x: 0.35, y: 0.85},
            {p: 'ST', x: 0.55, y: 0.5}, {p: 'LS', x: 0.52, y: 0.3}, {p: 'RS', x: 0.52, y: 0.7}
        ],
        '4-4-2': [ 
            {p: 'TW', x: 0.9, y: 0.5},
            {p: 'IV', x: 0.75, y: 0.4}, {p: 'IV', x: 0.75, y: 0.6},
            {p: 'LV', x: 0.78, y: 0.2}, {p: 'RV', x: 0.78, y: 0.8},
            {p: 'ZM', x: 0.6, y: 0.4}, {p: 'ZM', x: 0.6, y: 0.6},
            {p: 'LM', x: 0.62, y: 0.2}, {p: 'RM', x: 0.62, y: 0.8},
            {p: 'ST', x: 0.48, y: 0.45}, {p: 'ST', x: 0.48, y: 0.55}
        ]
    },

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.setupEventListeners();
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    syncFromDatabase() {
        if(!this.canvas || !window.Database) return;
        const players = window.Database.players || [];
        const mode = window.Database.activeMode || 'training';
        const h = this.canvas.height;

        this.elements = players
            .filter(p => p.assignment !== 'none')
            .map((p, i) => {
                let color = 'var(--neon-green)';
                if (mode === 'training' && p.assignment === 'training') color = '#ccff00';
                else if (p.team === 'B') color = 'var(--accent-gold)';

                return {
                    ...p,
                    type: 'player',
                    x: p.x || (80 + (i % 8) * 90),
                    y: p.y || (h - 70),
                    targetX: p.x || (80 + (i % 8) * 90),
                    targetY: p.y || (h - 70),
                    color: color
                };
            });
        
        if(mode === 'match') this.createOpponentTeam();
    },

    createOpponentTeam() {
        const form = this.formations['4-4-2'];
        form.forEach((opp, i) => {
            this.elements.push({
                id: 'opp-' + i, type: 'opponent', number: i+1,
                x: this.canvas.width + 50, y: opp.y * this.canvas.height,
                targetX: opp.x * this.canvas.width, targetY: opp.y * (this.canvas.height - this.benchHeight),
                color: '#ff3b30', name: 'GEGNER', pos: opp.p
            });
        });
        this.isAnimating = true;
    },

    update() {
        if (!this.isAnimating) return;
        let moving = false;
        this.elements.forEach(el => {
            const dx = el.targetX - el.x;
            const dy = el.targetY - el.y;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                el.x += dx * 0.1; el.y += dy * 0.1;
                moving = true;
            } else { el.x = el.targetX; el.y = el.targetY; }
        });
        if (!moving) this.isAnimating = false;
    },

    render() {
        if(!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const mode = window.Database.activeMode;

        // 1. Hintergrund & Rasen
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        const m = 50; 
        const fieldH = h - this.benchHeight;
        const fieldW = w - (m * 2);
        const actualFieldHeight = fieldH - (m * 2);
        
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 2;

        // --- PROFIMARKIERUNGEN ---
        ctx.strokeRect(m, m, fieldW, actualFieldHeight); // Außenlinie
        ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke(); // Mitte
        ctx.beginPath(); ctx.arc(w/2, fieldH/2, 60, 0, Math.PI*2); ctx.stroke(); // Kreis
        ctx.beginPath(); ctx.arc(w/2, fieldH/2, 2, 0, Math.PI*2); ctx.fill(); // Punkt Mitte

        // Strafräume
        const box16W = 120, box16H = 240, box5W = 40, box5H = 100, penDist = 80;
        // Links
        ctx.strokeRect(m, (fieldH/2)-(box16H/2), box16W, box16H);
        ctx.strokeRect(m, (fieldH/2)-(box5H/2), box5W, box5H);
        ctx.beginPath(); ctx.arc(m+penDist, fieldH/2, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(m+penDist, fieldH/2, 60, -Math.PI/2.5, Math.PI/2.5); ctx.stroke();
        // Rechts
        ctx.strokeRect(w-m-box16W, (fieldH/2)-(box16H/2), box16W, box16H);
        ctx.strokeRect(w-m-box5W, (fieldH/2)-(box5H/2), box5W, box5H);
        ctx.beginPath(); ctx.arc(w-m-penDist, fieldH/2, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(w-m-penDist, fieldH/2, 60, Math.PI/1.6, -Math.PI/1.6); ctx.stroke();

        // Tore
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(m-15, (fieldH/2)-45, 15, 90);
        ctx.strokeRect(w-m, (fieldH/2)-45, 15, 90);

        // 2. Bank-Bereich
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, fieldH, w, this.benchHeight);
        ctx.strokeStyle = "var(--data-cyan)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, fieldH); ctx.lineTo(w, fieldH); ctx.stroke();

        // 3. Spieler (Layering-Fix)
        this.elements.forEach(el => {
            if (el === this.selectedElement) return;
            this.drawEntity(ctx, el, fieldH, mode);
        });
        if (this.selectedElement) this.drawEntity(ctx, this.selectedElement, fieldH, mode);
    },

    drawEntity(ctx, el, fieldH, mode) {
        const isOnBench = el.y > fieldH - 20;
        if (mode === 'match' && isOnBench && el.type !== 'opponent') {
            this.drawFIFACard(ctx, el);
        } else {
            this.drawTacticalDot(ctx, el);
        }
    },

    drawFIFACard(ctx, el) {
        ctx.save();
        const cw = 75, ch = 100, x = el.x-cw/2, y = el.y-ch/2;
        ctx.shadowBlur = 10; ctx.shadowColor = el.color;
        ctx.fillStyle = "#111"; ctx.fillRect(x, y, cw, ch);
        ctx.strokeStyle = el.color; ctx.lineWidth = 2; ctx.strokeRect(x, y, cw, ch);
        ctx.shadowBlur = 0; ctx.fillStyle = "#fff"; ctx.textAlign = "center";
        ctx.font = "bold 14px Inter"; ctx.fillText(el.rat || 80, x+15, y+20);
        ctx.font = "bold 10px Inter"; ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, y+ch-12);
        if(el.img) {
            try { const img = new Image(); img.src = el.img; ctx.drawImage(img, x+5, y+25, cw-10, ch-50); } catch(e){}
        } else {
            ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.font = "20px 'Font Awesome 6 Free'"; ctx.fillText("\uf2f6", el.x, y+ch/2);
        }
        ctx.restore();
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        ctx.beginPath(); ctx.arc(el.x, el.y, 18, 0, Math.PI*2);
        ctx.fillStyle = el.color; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#000"; ctx.font = "bold 14px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(el.number, el.x, el.y);
        ctx.fillStyle = "#fff"; ctx.font = "bold 10px Inter"; ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, el.y+30);
        ctx.restore();
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            this.selectedElement = this.elements.find(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) < 45);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.selectedElement) return;
            const rect = this.canvas.getBoundingClientRect();
            this.selectedElement.x = e.clientX - rect.left;
            this.selectedElement.y = e.clientY - rect.top;
            this.selectedElement.targetX = this.selectedElement.x;
            this.selectedElement.targetY = this.selectedElement.y;
        });
        this.canvas.addEventListener('mouseup', () => {
            if (this.selectedElement && window.Database) {
                window.Database.updatePlayer(this.selectedElement.id, 'x', this.selectedElement.x);
                window.Database.updatePlayer(this.selectedElement.id, 'y', this.selectedElement.y);
            }
            this.selectedElement = null;
        });
    },

    resize() {
        const c = document.getElementById('stage-container');
        if(!c) return;
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
    },

    renderLoop() { this.update(); this.render(); requestAnimationFrame(() => this.renderLoop()); }
};
