/**
 * TONI 2.0 - ARENA ENGINE (ELITE RECOVERY + FIFA CARDS)
 * Status: REPARIERT (Canvas Null-Check & Bench-Sync)
 * Fokus: Trainer-Bank, FIFA-Cards & Automatischer Formations-Sync.
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    arrows: [], 
    selectedElement: null,
    benchHeight: 130, // Bereich für die FIFA-Karten unten
    isAnimating: false,

    // Taktik-Schablonen (Werte 0-1)
    formations: {
        '3-4-3': [ // Trainer Team (Neon-Green)
            {p: 'TW', x: 0.1, y: 0.5},
            {p: 'IV', x: 0.25, y: 0.5}, {p: 'LIV', x: 0.22, y: 0.3}, {p: 'RIV', x: 0.22, y: 0.7},
            {p: 'ZM', x: 0.4, y: 0.4}, {p: 'ZM', x: 0.4, y: 0.6},
            {p: 'LAV', x: 0.35, y: 0.15}, {p: 'RAV', x: 0.35, y: 0.85},
            {p: 'ST', x: 0.55, y: 0.5}, {p: 'LS', x: 0.52, y: 0.3}, {p: 'RS', x: 0.52, y: 0.7}
        ],
        '4-4-2': [ // Toni Team (Rot)
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
        if(!this.canvas) return console.error("Arena: Canvas-Element nicht gefunden!");
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.setupEventListeners();
        
        if(window.Database) {
            this.syncFromDatabase();
            // Start-Formation nach 500ms erzwingen
            setTimeout(() => this.applyStartTactics(), 500);
        }
        
        this.renderLoop();
    },

    applyStartTactics() {
        console.log("TONI: Formations-Sync (3-4-3 vs 4-4-2)");
        this.setFormation('player', '3-4-3');
        this.setFormation('opponent', '4-4-2');
    },

    syncFromDatabase() {
        // FIX: Sicherheitscheck verhindert den Absturz in Zeile 59
        if(!this.canvas || !window.Database || !window.Database.players) {
            console.warn("Arena Sync: Canvas oder Database noch nicht bereit.");
            return;
        }
        
        const players = window.Database.players;
        const h = this.canvas.height;
        const w = this.canvas.width;

        this.elements = players.map((p, i) => ({
            id: p.id,
            type: 'player',
            number: p.number || (i+1),
            // Start-Position: Entweder gespeichert oder auf der Bank
            x: p.x || (60 + (i % 8) * 85), 
            y: p.y || (h - 65),
            targetX: p.x || (60 + (i % 8) * 85),
            targetY: p.y || (h - 65),
            color: p.team === 'B' ? 'var(--accent-gold)' : 'var(--neon-green)',
            name: p.name || 'Spieler',
            pos: p.pos || '?'
        }));
        
        if(window.Database.activeMode === 'match') this.createOpponentTeam();
    },

    createOpponentTeam() {
        if(!this.canvas) return;
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

    setFormation(type, formationKey) {
        if(!this.canvas) return;
        const form = this.formations[formationKey];
        if(!form) return;

        const team = this.elements.filter(el => el.type === type);
        team.forEach((el, i) => {
            if(form[i]) {
                el.targetX = form[i].x * this.canvas.width;
                el.targetY = form[i].y * (this.canvas.height - this.benchHeight);
            }
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
                el.x += dx * 0.1;
                el.y += dy * 0.1;
                moving = true;
            } else {
                el.x = el.targetX;
                el.y = el.targetY;
            }
        });
        if (!moving) this.isAnimating = false;
    },

    render() {
        if(!this.ctx || !this.canvas) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld (Pitch)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        // Markierungen
        ctx.strokeStyle = "rgba(57, 255, 20, 0.3)";
        ctx.lineWidth = 2;
        const m = 50;
        const fieldH = h - this.benchHeight;
        ctx.strokeRect(m, m, w - m*2, fieldH - m*2);
        ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, (fieldH)/2, 60, 0, Math.PI*2); ctx.stroke();

        // 2. Trainer-Bank (Bereich für Karten)
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, h - this.benchHeight, w, this.benchHeight);
        ctx.strokeStyle = "var(--data-cyan)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, h - this.benchHeight); ctx.lineTo(w, h - this.benchHeight); ctx.stroke();

        // 3. Tore
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(m-15, (fieldH)/2 - 50, 15, 100);
        ctx.strokeRect(w-m, (fieldH)/2 - 50, 15, 100);

        // 4. Spieler & FIFA Cards
        this.elements.forEach(el => {
            if (el.y > h - this.benchHeight - 20) {
                this.drawFIFACard(ctx, el);
            } else {
                this.drawTacticalDot(ctx, el);
            }
        });
    },

    drawFIFACard(ctx, el) {
        ctx.save();
        const cw = 70; const ch = 90;
        const x = el.x - cw/2; const y = el.y - ch/2;

        ctx.shadowBlur = 10; ctx.shadowColor = el.color;
        ctx.fillStyle = "#111";
        ctx.fillRect(x, y, cw, ch);
        
        ctx.strokeStyle = el.color; ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cw, ch);

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
        ctx.fillText(el.number, el.x, y + 25);
        ctx.font = "8px Inter";
        ctx.fillText(el.pos, el.x, y + 40);
        ctx.font = "bold 9px Inter";
        ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, y + 75);
        ctx.restore();
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        ctx.beginPath(); ctx.arc(el.x, el.y, 18, 0, Math.PI*2);
        ctx.fillStyle = el.color; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#000"; ctx.font = "bold 14px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(el.number, el.x, el.y);
        ctx.fillStyle = "#fff"; ctx.font = "bold 10px Inter"; ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, el.y + 30);
        ctx.restore();
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            this.selectedElement = this.elements.find(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) < 35);
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
            if (this.selectedElement && window.Database && window.Database.updatePlayer) {
                window.Database.updatePlayer(this.selectedElement.id, 'x', this.selectedElement.x);
                window.Database.updatePlayer(this.selectedElement.id, 'y', this.selectedElement.y);
            }
            this.selectedElement = null;
        });
    },

    resize() {
        const container = document.getElementById('stage-container');
        if(!container || !this.canvas) return;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    },

    renderLoop() { 
        this.update(); 
        this.render(); 
        requestAnimationFrame(() => this.renderLoop()); 
    }
};
