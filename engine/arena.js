/**
 * TONI 2.0 - ARENA ENGINE (HORIZONTAL ELITE)
 * Taktische Transformation: FIFA-Karte (Bank) -> Punkt (Feld).
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    arrows: [], 
    selectedElement: null,
    currentTool: 'drag', 
    tempArrow: null,

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
        console.log("Aktion: " + tool.toUpperCase() + " aktiv.");
    },

    syncFromDatabase() {
        if(!window.Database) return;
        const presentPlayers = window.Database.getPresentPlayers();
        this.elements = this.elements.filter(el => el.type !== 'player');
        
        const cardWidth = 45;
        const spacing = 15;
        const benchY = this.canvas.height - 50;
        const totalBenchWidth = presentPlayers.length * (cardWidth + spacing);
        let startX = (this.canvas.width - totalBenchWidth) / 2;

        presentPlayers.forEach((p, index) => {
            this.elements.push({
                id: p.id, type: 'player',
                number: p.number || p.id, // Rückennummer aus DB
                x: p.x || (startX + index * (cardWidth + spacing)),
                y: p.y || benchY,
                color: window.Database.activeMode === 'match' ? 'var(--accent-gold)' : 'var(--neon-green)',
                width: cardWidth, height: 55,
                name: p.name, pos: p.pos, rat: p.rat
            });
        });
    },

    addEquipment(type, color = '#FF6A00', x, y) {
        this.elements.push({
            type: type,
            x: x, y: y,
            color: color,
            radius: type === 'ball' ? 8 : 15,
            id: Date.now()
        });
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
        } else if (this.currentTool === 'cone') {
            this.addEquipment('cone', '#FF6A00', mx, my);
        } else if (this.currentTool === 'ball') {
            this.addEquipment('ball', '#fff', mx, my);
        } else if (this.currentTool === 'goal') {
            this.addEquipment('goal', '#fff', mx, my);
        } else if (this.currentTool === 'delete') {
            this.elements = this.elements.filter(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) > 25);
            this.arrows = this.arrows.filter(a => Math.sqrt((mx-a.endX)**2 + (my-a.endY)**2) > 25);
        } else {
            this.selectedElement = [...this.elements].reverse().find(el => {
                const range = el.type === 'player' ? 30 : 20;
                return Math.sqrt((mx - el.x)**2 + (my - el.y)**2) < range;
            });
        }
    },

    handleMouseMove(e) {
        if (!this.selectedElement && !this.tempArrow) return;
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (this.selectedElement) {
            this.selectedElement.x = mx;
            this.selectedElement.y = my;
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
        if (this.selectedElement && this.selectedElement.type === 'player') {
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
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 70;
        const benchThreshold = h - 100; // Grenze zur Ersatzbank

        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;

        const fieldW = w - margin * 2;
        const fieldH = h - margin * 2;
        ctx.strokeRect(margin, margin, fieldW, fieldH);
        
        ctx.beginPath(); ctx.moveTo(w/2, margin); ctx.lineTo(w/2, h-margin); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
        
        const penaltyW = 120;
        const penaltyH = 280;
        ctx.strokeRect(margin, h/2 - penaltyH/2, penaltyW, penaltyH);
        ctx.strokeRect(w - margin - penaltyW, h/2 - penaltyH/2, penaltyW, penaltyH);
        
        const goalBoxW = 45;
        const goalBoxH = 120;
        ctx.strokeRect(margin, h/2 - goalBoxH/2, goalBoxW, goalBoxH);
        ctx.strokeRect(w - margin - goalBoxW, h/2 - goalBoxH/2, goalBoxW, goalBoxH);

        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(margin - 15, h/2 - 45, 15, 90);
        ctx.strokeRect(w - margin, h/2 - 45, 15, 90);

        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "center";
        ctx.fillText("ERSATZBANK / KADER-POOL", w/2, h - 15);

        this.arrows.forEach(a => this.drawTacticLine(ctx, a));
        if(this.tempArrow) this.drawTacticLine(ctx, this.tempArrow, true);

        this.elements.forEach(el => {
            if (el.type === 'player') {
                // TRANSFORMATION: Auf dem Feld -> Punkt | Auf der Bank -> Karte
                if (el.y < benchThreshold) {
                    this.drawTacticalDot(ctx, el);
                } else {
                    this.drawMiniCard(ctx, el);
                }
            } else if (el.type === 'cone') {
                this.drawCone(ctx, el.x, el.y, el.color);
            } else if (el.type === 'ball') {
                this.drawBall(ctx, el.x, el.y);
            } else if (el.type === 'goal') {
                this.drawMiniGoal(ctx, el.x, el.y);
            }
        });
    },

    // NEU: Der professionelle Taktik-Punkt
    drawTacticalDot(ctx, el) {
        ctx.save();
        const radius = 18;
        
        // Kreis (Schatten für Tiefe)
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.beginPath();
        ctx.arc(el.x, el.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rückennummer
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#000";
        ctx.font = "bold 14px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(el.number || el.id, el.x, el.y);

        // Name & Position unter dem Punkt
        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px Inter";
        const lastName = el.name.split(' ').pop().toUpperCase();
        ctx.fillText(lastName, el.x, el.y + radius + 15);
        
        ctx.fillStyle = el.color;
        ctx.font = "8px Inter";
        ctx.fillText(el.pos, el.x, el.y + radius + 25);
        ctx.restore();
    },

    drawTacticLine(ctx, a, isTemp = false) {
        ctx.save();
        const headlen = 12;
        const angle = Math.atan2(a.endY - a.startY, a.endX - a.startX);
        if (isTemp) ctx.globalAlpha = 0.5;
        if (a.type === 'pass') {
            ctx.setLineDash([10, 5]);
            ctx.strokeStyle = "var(--data-cyan)";
        } else if (a.type === 'shot') {
            ctx.strokeStyle = "#ff3b30";
            ctx.lineWidth = 5;
        } else {
            ctx.strokeStyle = "var(--neon-green)";
            ctx.lineWidth = 3;
        }
        ctx.beginPath(); ctx.moveTo(a.startX, a.startY); ctx.lineTo(a.endX, a.endY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(a.endX, a.endY);
        ctx.lineTo(a.endX - headlen * Math.cos(angle - Math.PI / 6), a.endY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(a.endX, a.endY);
        ctx.lineTo(a.endX - headlen * Math.cos(angle + Math.PI / 6), a.endY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.restore();
    },

    drawMiniCard(ctx, el) {
        const w = el.width; const h = el.height;
        const x = el.x - w/2; const y = el.y - h/2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + w*0.1, y); ctx.lineTo(x + w*0.9, y); ctx.lineTo(x + w, y + h*0.2);
        ctx.lineTo(x + w, y + h*0.8); ctx.lineTo(x + w*0.5, y + h); ctx.lineTo(x, y + h*0.8);
        ctx.lineTo(x, y + h*0.2); ctx.closePath();
        ctx.fillStyle = "#000"; ctx.fill();
        ctx.strokeStyle = el.color; ctx.lineWidth = 2; ctx.stroke();
        
        // Rating
        ctx.fillStyle = el.color; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
        ctx.fillText(el.rat, el.x, y + 18);
        
        // Name (Karten-Style)
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px Inter";
        ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, y + h + 12);
        ctx.restore();
    },

    drawCone(ctx, x, y, color) {
        ctx.fillStyle = color; ctx.beginPath();
        ctx.moveTo(x, y-12); ctx.lineTo(x+10, y+10); ctx.lineTo(x-10, y+10);
        ctx.closePath(); ctx.fill();
    },

    drawBall(ctx, x, y) {
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
    },

    drawMiniGoal(ctx, x, y) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
        ctx.strokeRect(x - 20, y - 10, 40, 20);
        ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillRect(x - 20, y - 10, 40, 20);
    },

    getSnapshot() { return this.canvas.toDataURL("image/png"); }
};
