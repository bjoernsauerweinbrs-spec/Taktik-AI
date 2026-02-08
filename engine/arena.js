/**
 * TONI 2.0 - ARENA ENGINE (ELITE RECOVERY)
 * Status: Sichtbarkeit optimiert & Tore fest integriert.
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    arrows: [], 
    selectedElement: null,
    currentTool: 'drag', 
    tempArrow: null,
    isAnimating: false,

    formations: {
        '3-4-3': [
            {p: 'TW', x: 0.1, y: 0.5}, {p: 'IV', x: 0.25, y: 0.5}, {p: 'LIV', x: 0.22, y: 0.3}, {p: 'RIV', x: 0.22, y: 0.7},
            {p: 'ZM', x: 0.4, y: 0.4}, {p: 'ZM', x: 0.4, y: 0.6}, {p: 'LAV', x: 0.35, y: 0.15}, {p: 'RAV', x: 0.35, y: 0.85},
            {p: 'ST', x: 0.55, y: 0.5}, {p: 'LS', x: 0.52, y: 0.3}, {p: 'RS', x: 0.52, y: 0.7}
        ],
        '4-4-2': [
            {p: 'TW', x: 0.9, y: 0.5}, {p: 'IV', x: 0.75, y: 0.4}, {p: 'IV', x: 0.75, y: 0.6}, {p: 'LV', x: 0.78, y: 0.2}, 
            {p: 'RV', x: 0.78, y: 0.8}, {p: 'ZM', x: 0.6, y: 0.4}, {p: 'ZM', x: 0.6, y: 0.6}, {p: 'LM', x: 0.62, y: 0.2}, 
            {p: 'RM', x: 0.62, y: 0.8}, {p: 'ST', x: 0.45, y: 0.45}, {p: 'ST', x: 0.45, y: 0.55}
        ]
    },

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return console.error("Canvas nicht gefunden!");
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.resize();
        
        // Sofort-Check: Falls DB leer, Standard-Kader laden
        if(window.Database) {
            this.syncFromDatabase();
        } else {
            this.createPlaceholderTeam();
        }
        
        this.renderLoop();
    },

    resize() {
        const container = document.getElementById('stage-container');
        if(!container) return;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.render();
    },

    syncFromDatabase() {
        if(!window.Database || !window.Database.players) return this.createPlaceholderTeam();
        
        const mode = window.Database.activeMode || 'training';
        const players = window.Database.players.filter(p => p.assignment === 'both' || p.assignment === mode);

        this.elements = players.map((p, i) => ({
            id: p.id, type: 'player', number: p.number || (i+1),
            x: p.x || (100 + i * 40), y: p.y || (100 + i * 20),
            targetX: p.x || (100 + i * 40), targetY: p.y || (100 + i * 20),
            color: p.team === 'B' ? '#ccff00' : 'var(--neon-green)',
            name: p.name, pos: p.pos
        }));

        if (mode === 'match') this.createOpponentTeam();
    },

    createPlaceholderTeam() {
        this.elements = [];
        for(let i=0; i<5; i++) {
            this.elements.push({
                id: 'pl-'+i, type: 'player', number: i+1,
                x: 150, y: 100 + (i*60), targetX: 150, targetY: 100 + (i*60),
                color: 'var(--neon-green)', name: 'PRO-PLAYER', pos: '?'
            });
        }
    },

    createOpponentTeam() {
        const form = this.formations['4-4-2'];
        form.forEach((opp, i) => {
            this.elements.push({
                id: 'opp-' + i, type: 'opponent', number: i+1,
                x: this.canvas.width * 0.8, y: opp.y * this.canvas.height,
                targetX: opp.x * this.canvas.width, targetY: opp.y * this.canvas.height,
                color: '#ff3b30', name: 'GEGNER', pos: opp.p
            });
        });
        this.isAnimating = true;
    },

    renderLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    update() {
        if (!this.isAnimating) return;
        let moving = false;
        this.elements.forEach(el => {
            if (el.targetX !== undefined) {
                const dx = el.targetX - el.x;
                const dy = el.targetY - el.y;
                if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                    el.x += dx * 0.1;
                    el.y += dy * 0.1;
                    moving = true;
                }
            }
        });
        if (!moving) this.isAnimating = false;
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const m = 60; // Margin

        // 1. Hintergrund
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        // 2. Spielfeld-Markierungen (BRIGHT NEON)
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 3;
        
        // Außenlinie
        ctx.strokeRect(m, m, w - m*2, h - m*2);
        
        // Mittellinie & Kreis
        ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, h-m); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 70, 0, Math.PI*2); ctx.stroke();
        
        // Strafräume
        ctx.strokeRect(m, h/2 - 120, 100, 240); // Links
        ctx.strokeRect(w - m - 100, h/2 - 120, 100, 240); // Rechts
        
        // 3. TORE (FEST GEZEICHNET)
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 5;
        ctx.strokeRect(m - 20, h/2 - 50, 20, 100); // Tor Links
        ctx.strokeRect(w - m, h/2 - 50, 20, 100); // Tor Rechts

        // 4. Elemente & Pfeile
        this.arrows.forEach(a => this.drawTacticLine(ctx, a));
        if(this.tempArrow) this.drawTacticLine(ctx, this.tempArrow, true);
        this.elements.forEach(el => this.drawTacticalDot(ctx, el));
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(el.x, el.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.number, el.x, el.y);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px Inter";
        const label = el.type === 'opponent' ? 'KI-ENEMY' : (el.name || 'PLAYER').toUpperCase();
        ctx.fillText(label, el.x, el.y + 35);
        ctx.restore();
    },

    drawTacticLine(ctx, a) {
        ctx.save();
        ctx.strokeStyle = a.type === 'pass' ? "var(--data-cyan)" : "var(--neon-green)";
        ctx.lineWidth = 3;
        if (a.type === 'pass') ctx.setLineDash([10, 5]);
        ctx.beginPath(); ctx.moveTo(a.startX, a.startY); ctx.lineTo(a.endX, a.endY); ctx.stroke();
        ctx.restore();
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
    },

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        this.selectedElement = this.elements.find(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) < 25);
    },

    handleMouseMove(e) {
        if (!this.selectedElement) return;
        const rect = this.canvas.getBoundingClientRect();
        this.selectedElement.x = e.clientX - rect.left;
        this.selectedElement.y = e.clientY - rect.top;
    },

    handleMouseUp() { this.selectedElement = null; },
    addPathFromVideo(x1, y1, x2, y2) { this.arrows.push({startX: x1, startY: y1, endX: x2, endY: y2, type: 'arrow'}); }
};
