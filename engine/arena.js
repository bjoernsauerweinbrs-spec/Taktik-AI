/**
 * TONI 2.0 - ARENA ENGINE (HORIZONTAL ELITE + ANIMATION + VIDEO BRIDGE)
 * Fokus: Flüssige Laufwege, 3-4-3 vs 4-4-2 & KI-Pfad-Import.
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

    // Taktik-Schablonen (Prozentual zum Spielfeld)
    formations: {
        '3-4-3': [ // Trainer Team (Gold)
            {p: 'TW', x: 0.05, y: 0.5},
            {p: 'IV', x: 0.2, y: 0.5}, {p: 'LIV', x: 0.18, y: 0.3}, {p: 'RIV', x: 0.18, y: 0.7},
            {p: 'ZM', x: 0.35, y: 0.4}, {p: 'ZM', x: 0.35, y: 0.6},
            {p: 'LAV', x: 0.3, y: 0.15}, {p: 'RAV', x: 0.3, y: 0.85},
            {p: 'ST', x: 0.45, y: 0.5}, {p: 'LS', x: 0.42, y: 0.3}, {p: 'RS', x: 0.42, y: 0.7}
        ],
        '4-4-2': [ // Toni Team (Rot/Gegner)
            {p: 'TW', x: 0.95, y: 0.5},
            {p: 'IV', x: 0.8, y: 0.4}, {p: 'IV', x: 0.8, y: 0.6},
            {p: 'LV', x: 0.82, y: 0.2}, {p: 'RV', x: 0.82, y: 0.8},
            {p: 'ZM', x: 0.65, y: 0.4}, {p: 'ZM', x: 0.65, y: 0.6},
            {p: 'LM', x: 0.68, y: 0.2}, {p: 'RM', x: 0.68, y: 0.8},
            {p: 'ST', x: 0.55, y: 0.45}, {p: 'ST', x: 0.55, y: 0.55}
        ]
    },

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.resize();
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    setTool(tool) {
        this.currentTool = tool;
    },

    /**
     * NEU: Empfängt Pfade von der KI-Videoanalyse (Werte 0-100)
     */
    addPathFromVideo(startX, startY, endX, endY, type = 'arrow') {
        const boardX1 = (startX / 100) * this.canvas.width;
        const boardY1 = (startY / 100) * this.canvas.height;
        const boardX2 = (endX / 100) * this.canvas.width;
        const boardY2 = (endY / 100) * this.canvas.height;

        this.arrows.push({
            startX: boardX1,
            startY: boardY1,
            endX: boardX2,
            endY: boardY2,
            type: type 
        });
        
        if(window.ToniVoice) window.ToniVoice.speak("Laufweg vom Video übernommen.");
    },

    setFormation(team, type) {
        const form = this.formations[type];
        if (!form) return;

        const targetElements = this.elements.filter(el => 
            (team === 'B' && el.type === 'player') || (team === 'A' && el.type === 'opponent')
        );

        form.forEach((pos, i) => {
            if (targetElements[i]) {
                targetElements[i].targetX = pos.x * this.canvas.width;
                targetElements[i].targetY = pos.y * this.canvas.height;
            }
        });
        this.isAnimating = true;
    },

    syncFromDatabase() {
        if(!window.Database) return;
        const mode = window.Database.activeMode;
        const allPresent = window.Database.getPresentPlayers();
        const myPlayers = mode === 'match' ? allPresent.filter(p => p.team === 'A') : allPresent;

        const newElements = this.elements.filter(el => el.type !== 'player' && el.type !== 'opponent');
        
        myPlayers.forEach((p, index) => {
            let playerColor = mode === 'match' ? 'var(--accent-gold)' : (p.team === 'A' ? 'var(--neon-green)' : '#ccff00');
            newElements.push({
                id: p.id, type: 'player', number: p.number || p.id,
                x: p.x || 100, y: p.y || 100, 
                targetX: p.x || 100, targetY: p.y || 100,
                color: playerColor, name: p.name, pos: p.pos
            });
        });

        this.elements = newElements;
        if (mode === 'match') this.createOpponentTeam();
    },

    createOpponentTeam() {
        const form = this.formations['4-4-2'];
        form.forEach((opp, i) => {
            this.elements.push({
                id: 'opp-' + i, type: 'opponent', number: opp.n || (i+1),
                x: this.canvas.width + 50, y: opp.y * this.canvas.height,
                targetX: opp.x * this.canvas.width, targetY: opp.y * this.canvas.height,
                color: '#ff3b30', name: 'GEGNER', pos: opp.p
            });
        });
        this.isAnimating = true;
    },

    update() {
        if (!this.isAnimating) return;
        let moving = false;
        const speed = 0.08;

        this.elements.forEach(el => {
            if (el.targetX !== undefined) {
                const dx = el.targetX - el.x;
                const dy = el.targetY - el.y;
                if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
                    el.x += dx * speed;
                    el.y += dy * speed;
                    moving = true;
                } else {
                    el.x = el.targetX;
                    el.y = el.targetY;
                }
            }
        });
        if (!moving) this.isAnimating = false;
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        window.addEventListener('resize', () => this.resize());
    },

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (['arrow', 'pass', 'shot'].includes(this.currentTool)) {
            this.tempArrow = { startX: mx, startY: my, endX: mx, endY: my, type: this.currentTool };
        } else if (this.currentTool === 'delete') {
            this.elements = this.elements.filter(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) > 25);
            this.arrows = this.arrows.filter(a => Math.sqrt((mx-a.endX)**2 + (my-a.endY)**2) > 25);
        } else {
            this.selectedElement = [...this.elements].reverse().find(el => {
                return Math.sqrt((mx - el.x)**2 + (my - el.y)**2) < 30;
            });
        }
    },

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.selectedElement) {
            this.selectedElement.x = mx;
            this.selectedElement.y = my;
            this.selectedElement.targetX = mx; 
            this.selectedElement.targetY = my;
        } else if (this.tempArrow) {
            this.tempArrow.endX = mx;
            this.tempArrow.endY = my;
        }
    },

    handleMouseUp() {
        if (this.tempArrow) {
            this.arrows.push({...this.tempArrow});
            this.tempArrow = null;
        }
        if (this.selectedElement && this.selectedElement.id) {
            window.Database.updatePlayer(this.selectedElement.id, 'x', this.selectedElement.x);
            window.Database.updatePlayer(this.selectedElement.id, 'y', this.selectedElement.y);
        }
        this.selectedElement = null;
    },

    resize() {
        const container = document.getElementById('stage-container');
        if(!container) return;
        this.canvas.width = container.clientWidth * 0.98;
        this.canvas.height = container.clientHeight * 0.95;
        this.syncFromDatabase();
    },

    renderLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 70;

        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(margin, margin, w - margin*2, h - margin*2);
        ctx.beginPath(); ctx.moveTo(w/2, margin); ctx.lineTo(w/2, h-margin); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();

        this.arrows.forEach(a => this.drawTacticLine(ctx, a));
        if(this.tempArrow) this.drawTacticLine(ctx, this.tempArrow, true);

        this.elements.forEach(el => {
            if (el.type === 'player' || el.type === 'opponent') {
                this.drawTacticalDot(ctx, el);
            } else if (el.type === 'cone') {
                this.drawCone(ctx, el.x, el.y, el.color);
            } else if (el.type === 'ball') {
                this.drawBall(ctx, el.x, el.y);
            } else if (el.type === 'goal') {
                this.drawMiniGoal(ctx, el.x, el.y);
            }
        });
    },

    drawTacticalDot(ctx, el) {
        ctx.save();
        const radius = 18;
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
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
        ctx.font = "bold 11px Inter";
        const label = el.type === 'opponent' ? 'TONI-ELF' : (el.name ? el.name.split(' ').pop().toUpperCase() : 'SPIELER');
        ctx.fillText(label, el.x, el.y + radius + 15);
        ctx.restore();
    },

    drawTacticLine(ctx, a, isTemp = false) {
        ctx.save();
        const headlen = 12;
        const angle = Math.atan2(a.endY - a.startY, a.endX - a.startX);
        ctx.strokeStyle = a.type === 'pass' ? "var(--data-cyan)" : (a.type === 'shot' ? "#ff3b30" : "var(--neon-green)");
        ctx.lineWidth = 3;
        if (a.type === 'pass') ctx.setLineDash([10, 5]);
        ctx.beginPath(); ctx.moveTo(a.startX, a.startY); ctx.lineTo(a.endX, a.endY); ctx.stroke();
        
        // Pfeilspitze
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(a.endX, a.endY);
        ctx.lineTo(a.endX - headlen * Math.cos(angle - Math.PI / 6), a.endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(a.endX, a.endY);
        ctx.lineTo(a.endX - headlen * Math.cos(angle + Math.PI / 6), a.endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.restore();
    },

    drawCone(ctx, x, y, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y-12); ctx.lineTo(x+10, y+10); ctx.lineTo(x-10, y+10); ctx.fill(); },
    drawBall(ctx, x, y) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI*2); ctx.fill(); },
    drawMiniGoal(ctx, x, y) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.strokeRect(x - 20, y - 10, 40, 20); },
    getSnapshot() { return this.canvas.toDataURL("image/png"); }
};
