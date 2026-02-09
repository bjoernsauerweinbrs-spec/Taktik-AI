/**
 * TONI 2.0 - ARENA ENGINE (ELITE PRO PITCH UPDATE)
 * Status: FINALISIERT (FIFA-Cards Bench, Dot-Labels & Equipment-Support)
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    equipment: [], // NEU: Speicher für Hütchen, Tore, Leitern
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

    // --- EQUIPMENT LOGIK (NEU FÜR JUNIOREN) ---
    addEquipment(type, x, y, options = {}) {
        this.equipment.push({ type, x, y, id: Date.now() + Math.random(), ...options });
    },

    clearEquipment(type = null) {
        if (type) {
            this.equipment = this.equipment.filter(e => e.type !== type);
        } else {
            this.equipment = [];
        }
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

        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        const m = 50; 
        const fieldH = h - this.benchHeight;
        const fieldW = w - (m * 2);
        const actualFieldHeight = fieldH - (m * 2);
        
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 2;

        ctx.strokeRect(m, m, fieldW, actualFieldHeight); 
        ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke(); 
        ctx.beginPath(); ctx.arc(w/2, fieldH/2, 60, 0, Math.PI*2); ctx.stroke(); 

        // Standard-Tore
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(m-15, (fieldH/2)-45, 15, 90);
        ctx.strokeRect(w-m, (fieldH/2)-45, 15, 90);

        // --- EQUIPMENT ZEICHNEN ---
        this.equipment.forEach(item => {
            this.drawItem(ctx, item);
        });

        // Bank-Bereich
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, fieldH, w, this.benchHeight);
        ctx.strokeStyle = "var(--data-cyan)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, fieldH); ctx.lineTo(w, fieldH); ctx.stroke();

        this.elements.forEach(el => {
            if (el === this.selectedElement) return;
            this.drawEntity(ctx, el, fieldH);
        });
        if (this.selectedElement) this.drawEntity(ctx, this.selectedElement, fieldH);
    },

    drawItem(ctx, item) {
        ctx.save();
        if (item.type === 'goal') {
            ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
            ctx.strokeRect(item.x - 10, item.y - 25, 10, 50); // Minitore
        } else if (item.type === 'cone') {
            ctx.fillStyle = "var(--accent-orange)";
            ctx.beginPath();
            ctx.moveTo(item.x, item.y - 10);
            ctx.lineTo(item.x - 10, item.y + 10);
            ctx.lineTo(item.x + 10, item.y + 10);
            ctx.fill();
        } else if (item.type === 'ladder') {
            ctx.strokeStyle = "#ccff00"; ctx.lineWidth = 2;
            for(let i=0; i<6; i++) {
                ctx.strokeRect(item.x, item.y + (i*20), 40, 20);
            }
        }
        ctx.restore();
    },

    drawEntity(ctx, el, fieldH) {
        const isOnBench = el.y > fieldH - 20;
        if (isOnBench && el.type !== 'opponent') {
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
        ctx.font = "bold 10px Inter"; ctx.fillText(el.name ? el.name.split(' ').pop().toUpperCase() : 'PRO', el.x, y+ch-12);
        ctx.restore();
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        const radius = 18;
        ctx.beginPath(); ctx.arc(el.x, el.y, radius, 0, Math.PI*2);
        ctx.fillStyle = el.color; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#000"; ctx.font = "bold 14px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(el.number || '?', el.x, el.y);
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
        });
        this.canvas.addEventListener('mouseup', () => { this.selectedElement = null; });
    },

    resize() {
        const c = document.getElementById('stage-container');
        if(!c) return;
        this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight;
    },

    renderLoop() { this.update(); this.render(); requestAnimationFrame(() => this.renderLoop()); }
};
