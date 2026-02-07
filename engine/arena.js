/**
 * TONI 2.0 - ARENA ENGINE (HIGH-PRO TACTICAL UPDATE)
 * AI-Board mit Pfeil-Logik, Equipment-System & Snapshot-Engine.
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    arrows: [], // Separate Ebene für taktische Laufwege
    selectedElement: null,
    currentTool: 'drag', // drag, cone, ball, arrow, delete
    tempArrow: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.resize();
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    // --- TOOL SYSTEM ---
    setTool(tool) {
        this.currentTool = tool;
        console.log("Arena Tool gewechselt zu:", tool);
    },

    // --- AI INTERFACE: Befehle von TONI umsetzen ---
    executeAICommand(action, data) {
        if(action === 'setup_drill') {
            // Beispiel: Toni platziert Hütchen automatisch
            data.cones.forEach(c => this.addEquipment('cone', c.color, c.x, c.y));
        }
        if(action === 'show_run') {
            // Beispiel: Toni zeichnet einen Laufweg ein
            this.arrows.push({ startX: data.x1, startY: data.y1, endX: data.x2, endY: data.y2, type: 'sprint' });
        }
    },

    syncFromDatabase() {
        if(!window.Database) return;
        const presentPlayers = window.Database.getPresentPlayers();
        this.elements = this.elements.filter(el => el.type !== 'player');
        
        presentPlayers.forEach((p, index) => {
            this.elements.push({
                id: p.id, type: 'player',
                x: p.x || (100 + index * 50),
                y: p.y || (this.canvas.height - 100),
                color: '#39FF14',
                width: 40, height: 50,
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
            radius: type === 'ball' ? 10 : 15,
            id: Date.now()
        });
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
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
        } else if (this.currentTool === 'delete') {
            this.elements = this.elements.filter(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) > 20);
            this.arrows = this.arrows.filter(a => Math.sqrt((mx-a.endX)**2 + (my-a.endY)**2) > 20);
        } else {
            this.selectedElement = [...this.elements].reverse().find(el => {
                const dist = Math.sqrt((mx - el.x)**2 + (my - el.y)**2);
                return dist < 25;
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
        } else if (this.tempArrow) {
            this.tempArrow.endX = mx;
            this.tempArrow.endY = my;
        }
    },

    handleMouseUp() {
        if (this.tempArrow) {
            this.arrows.push({...this.tempArrow, type: 'sprint'});
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

    // Professionelle Pfeil-Zeichen-Funktion
    drawArrow(ctx, x1, y1, x2, y2, color, dashed = false) {
        const headlen = 15;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        if(dashed) ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        // Pfeilspitze
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        ctx.restore();
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 60;

        // Spielfeld (Profi-Look)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(margin, margin, w - margin*2, h - margin*2);
        
        // Zeichne Mittellinie, Strafräume etc. (wie zuvor)
        
        // --- Ebene 1: Laufwege (Arrows) ---
        this.arrows.forEach(a => this.drawArrow(ctx, a.startX, a.startY, a.endX, a.endY, "var(--neon-green)"));
        if(this.tempArrow) this.drawArrow(ctx, this.tempArrow.startX, this.tempArrow.startY, this.tempArrow.endX, this.tempArrow.endY, "rgba(57, 255, 20, 0.5)");

        // --- Ebene 2: Spieler & Equipment ---
        this.elements.forEach(el => {
            if (el.type === 'player') {
                this.drawMiniCard(ctx, el);
            } else if (el.type === 'cone') {
                this.drawCone(ctx, el.x, el.y, el.color);
            } else if (el.type === 'ball') {
                this.drawBall(ctx, el.x, el.y);
            }
        });
    },

    drawMiniCard(ctx, el) {
        // (Logik für Mini-FIFA-Karten wie zuvor besprochen)
        const w = 40; const h = 50;
        ctx.fillStyle = "#000";
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(el.x - w/2, el.y - h/2, w, h);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px Inter";
        ctx.textAlign = "center";
        ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, el.y + 35);
    },

    drawCone(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y - 12); ctx.lineTo(x + 10, y + 10); ctx.lineTo(x - 10, y + 10);
        ctx.closePath(); ctx.fill();
    },

    drawBall(ctx, x, y) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#000"; ctx.stroke();
    },

    // --- SNAPSHOT FUNKTION ---
    getSnapshot() {
        return this.canvas.toDataURL("image/png");
    }
};
