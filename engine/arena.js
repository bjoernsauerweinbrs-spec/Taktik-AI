/**
 * TONI 2.0 - ARENA ENGINE (ELITE TACTICAL BOARD)
 * Maßstabsgetreues Spielfeld, FIFA-Shields & Zusatztore.
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
        // Visuelles Feedback in der Konsole
        console.log("Aktion: " + tool.toUpperCase() + " aktiv.");
    },

    syncFromDatabase() {
        if(!window.Database) return;
        const presentPlayers = window.Database.getPresentPlayers();
        this.elements = this.elements.filter(el => el.type !== 'player');
        
        presentPlayers.forEach((p, index) => {
            this.elements.push({
                id: p.id, type: 'player',
                x: p.x || (100 + index * 60),
                y: p.y || (this.canvas.height - 80),
                color: window.Database.activeMode === 'match' ? 'var(--accent-gold)' : 'var(--neon-green)',
                width: 45, height: 55,
                name: p.name, pos: p.pos, rat: p.rat
            });
        });
    },

    addEquipment(type, color = '#FF6A00', x, y) {
        this.elements.push({
            type: type,
            x: x || this.canvas.width / 2,
            y: y || this.canvas.height / 2,
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

        if (this.currentTool === 'arrow') {
            this.tempArrow = { startX: mx, startY: my, endX: mx, endY: my };
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
    },

    renderLoop() {
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 50;

        // 1. SPIELFELD-GRAFIK (PITCH)
        ctx.fillStyle = "#051205"; // Dunkles Gras
        ctx.fillRect(0, 0, w, h);
        
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;

        // Außenlinie
        ctx.strokeRect(margin, margin, w - margin*2, h - margin*2);
        
        // Mittellinie & Kreis
        ctx.beginPath(); ctx.moveTo(w/2, margin); ctx.lineTo(w/2, h-margin); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
        
        // Strafräume (16m)
        ctx.strokeRect(w/2 - 160, margin, 320, 100); // Nord
        ctx.strokeRect(w/2 - 160, h-margin-100, 320, 100); // Süd
        
        // Torräume (5m)
        ctx.strokeRect(w/2 - 70, margin, 140, 40); // Nord
        ctx.strokeRect(w/2 - 70, h-margin-40, 140, 40); // Süd

        // Elfmeterpunkte
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath(); ctx.arc(w/2, margin + 80, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(w/2, h - margin - 80, 3, 0, Math.PI*2); ctx.fill();

        // Haupt-Tore (Weiß)
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.strokeRect(w/2 - 45, margin - 15, 90, 15);
        ctx.strokeRect(w/2 - 45, h - margin, 90, 15);

        // --- EBENE 1: LAUFWEGE (PFEILE) ---
        this.arrows.forEach(a => this.drawArrow(ctx, a.startX, a.startY, a.endX, a.endY, "var(--neon-green)"));
        if(this.tempArrow) this.drawArrow(ctx, this.tempArrow.startX, this.tempArrow.startY, this.tempArrow.endX, this.tempArrow.endY, "rgba(57, 255, 20, 0.5)");

        // --- EBENE 2: PLAYER & EQUIPMENT ---
        this.elements.forEach(el => {
            if (el.type === 'player') this.drawMiniCard(ctx, el);
            else if (el.type === 'cone') this.drawCone(ctx, el.x, el.y, el.color);
            else if (el.type === 'ball') this.drawBall(ctx, el.x, el.y);
            else if (el.type === 'goal') this.drawMiniGoal(ctx, el.x, el.y);
        });
    },

    drawArrow(ctx, x1, y1, x2, y2, color) {
        const headlen = 12;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.restore();
    },

    drawMiniCard(ctx, el) {
        const w = el.width; const h = el.height;
        const x = el.x - w/2; const y = el.y - h/2;
        ctx.save();
        // Shield Shape
        ctx.beginPath();
        ctx.moveTo(x + w*0.1, y); ctx.lineTo(x + w*0.9, y); ctx.lineTo(x + w, y + h*0.2);
        ctx.lineTo(x + w, y + h*0.8); ctx.lineTo(x + w*0.5, y + h); ctx.lineTo(x, y + h*0.8);
        ctx.lineTo(x, y + h*0.2); ctx.closePath();
        ctx.fillStyle = "#000"; ctx.fill();
        ctx.strokeStyle = el.color; ctx.lineWidth = 2; ctx.stroke();
        // Rating & Name
        ctx.fillStyle = el.color; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
        ctx.fillText(el.rat, el.x, y + 18);
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
