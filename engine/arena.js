/**
 * TONI 2.0 - ARENA ENGINE (ELITE TACTIC BOARD)
 * Mini-FIFA-Cards auf dem Feld & Positions-Speicherung
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    selectedElement: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.resize();
        
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    syncFromDatabase() {
        if(!window.Database) return;
        const presentPlayers = window.Database.getPresentPlayers();
        
        // Bestehende Spieler-Elemente abgleichen
        this.elements = this.elements.filter(el => el.type !== 'player');
        
        const cardWidth = 40;
        const spacing = 15;
        const totalWidth = presentPlayers.length * (cardWidth + spacing);
        const startX = (this.canvas.width - totalWidth) / 2;

        presentPlayers.forEach((p, index) => {
            this.elements.push({
                id: p.id,
                type: 'player',
                // Nutze gespeicherte Position oder Reihe sie unten auf
                x: p.x || (startX + index * (cardWidth + spacing) + cardWidth / 2),
                y: p.y || (this.canvas.height - 40),
                color: window.Database.activeMode === 'match' ? '#D4AF37' : '#39FF14',
                width: cardWidth,
                height: 50,
                name: p.name,
                pos: p.pos,
                rat: p.rat
            });
        });
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => {
            if (this.selectedElement && this.selectedElement.type === 'player') {
                // Position in der Datenbank permanent speichern
                window.Database.updatePlayer(this.selectedElement.id, 'x', this.selectedElement.x);
                window.Database.updatePlayer(this.selectedElement.id, 'y', this.selectedElement.y);
            }
            this.selectedElement = null;
        });
        window.addEventListener('resize', () => this.resize());
    },

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        this.selectedElement = [...this.elements].reverse().find(el => {
            const hitBox = el.type === 'player' ? 25 : el.radius;
            const dist = Math.sqrt((mouseX - el.x)**2 + (mouseY - el.y)**2);
            return dist < hitBox;
        });
    },

    handleMouseMove(e) {
        if (!this.selectedElement) return;
        const rect = this.canvas.getBoundingClientRect();
        this.selectedElement.x = e.clientX - rect.left;
        this.selectedElement.y = e.clientY - rect.top;
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

    // Zeichnet eine kleine FIFA-Karte auf das Canvas
    drawPlayerCard(ctx, el) {
        const w = el.width;
        const h = el.height;
        const x = el.x - w/2;
        const y = el.y - h/2;

        ctx.save();
        
        // Schatten für Tiefe
        ctx.shadowBlur = this.selectedElement === el ? 15 : 5;
        ctx.shadowColor = el.color;

        // Schildform zeichnen
        ctx.beginPath();
        ctx.moveTo(x + w * 0.1, y);
        ctx.lineTo(x + w * 0.9, y);
        ctx.lineTo(x + w, y + h * 0.2);
        ctx.lineTo(x + w, y + h * 0.8);
        ctx.lineTo(x + w * 0.5, y + h);
        ctx.lineTo(x, y + h * 0.8);
        ctx.lineTo(x, y + h * 0.2);
        ctx.closePath();

        // Füllung & Rahmen
        ctx.fillStyle = "#000";
        ctx.fill();
        ctx.strokeStyle = el.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Rating & Position (Mini)
        ctx.fillStyle = el.color;
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "left";
        ctx.fillText(el.rat, x + 6, y + 14);
        ctx.font = "6px Inter";
        ctx.fillText(el.pos, x + 6, y + 22);

        // Name unter der Karte
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px Inter";
        ctx.textAlign = "center";
        ctx.fillText(el.name.split(' ').pop().toUpperCase(), el.x, y + h + 12);

        ctx.restore();
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const margin = 60;

        // 1. Spielfeld (wie gehabt)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(margin, margin, w - margin*2, h - margin*2);
        
        // Mittellinie & Kreis
        ctx.beginPath(); ctx.moveTo(w/2, margin); ctx.lineTo(w/2, h-margin); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();

        // Tore & Räume (stark vereinfacht für Performance)
        ctx.strokeRect(w/2 - w*0.2, margin, w*0.4, h*0.15); // 16m
        ctx.strokeRect(w/2 - w*0.2, h-margin-h*0.15, w*0.4, h*0.15);

        // 2. Elemente zeichnen
        this.elements.forEach(el => {
            if (el.type === 'player') {
                this.drawPlayerCard(ctx, el);
            } else {
                // Hütchen / Bälle
                ctx.beginPath();
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI*2);
                ctx.fillStyle = el.color;
                ctx.fill();
            }
        });
    }
};
