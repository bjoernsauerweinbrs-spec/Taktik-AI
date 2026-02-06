/**
 * TONI 2.0 - ARENA ENGINE (FULL UPDATE)
 * Drag & Drop, Trainingsequipment & Datenbank-Sync
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
        
        // Erster Sync mit der Spieler-Datenbank
        if(window.Database) this.syncFromDatabase();
        
        this.renderLoop();
    },

    // Zentraler Sync: Nur anwesende Spieler laden
    syncFromDatabase() {
        if(!window.Database) return;
        const presentPlayers = window.Database.getPresentPlayers();
        
        // Bestehende Spieler entfernen, um Dubletten zu vermeiden
        this.elements = this.elements.filter(el => el.type !== 'player');
        
        presentPlayers.forEach(p => {
            this.elements.push({
                id: p.id,
                type: 'player',
                x: p.x || this.canvas.width / 2,
                y: p.y || this.canvas.height / 2,
                color: '#39FF14',
                radius: 18,
                name: p.name
            });
        });
    },

    // Material hinzufügen (wird von der Palette aufgerufen)
    addEquipment(type, color = '#fff') {
        const x = this.canvas.width / 2 + (Math.random() * 40 - 20);
        const y = this.canvas.height / 2 + (Math.random() * 40 - 20);
        
        this.elements.push({
            type: type,
            x: x,
            y: y,
            color: color,
            radius: type === 'ball' ? 10 : 15,
            id: Date.now()
        });
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.selectedElement = null);
        window.addEventListener('resize', () => this.resize());
    },

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Das oberste Element unter der Maus finden
        this.selectedElement = [...this.elements].reverse().find(el => {
            const dist = Math.sqrt((mouseX - el.x)**2 + (mouseY - el.y)**2);
            return dist < (el.radius + 10);
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
    },

    renderLoop() {
        this.render();
        requestAnimationFrame(() => this.renderLoop());
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Hintergrund & Spielfeld
        ctx.fillStyle = "#0A1A0A";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, w - 40, h - 40);
        
        // Mittellinie & Kreis
        ctx.beginPath();
        ctx.moveTo(w/2, 20); ctx.lineTo(w/2, h-20);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, 50, 0, Math.PI*2);
        ctx.stroke();

        // 5m-Raum (Vision)
        ctx.strokeStyle = "rgba(57, 255, 20, 0.8)";
        ctx.strokeRect(w * 0.40, h - 60, w * 0.2, 40);

        // 2. Elemente zeichnen
        this.elements.forEach(el => {
            ctx.beginPath();
            ctx.shadowBlur = this.selectedElement === el ? 15 : 0;
            ctx.shadowColor = el.color;

            if(el.type === 'cone') {
                ctx.moveTo(el.x, el.y - 15);
                ctx.lineTo(el.x + 12, el.y + 12);
                ctx.lineTo(el.x - 12, el.y + 12);
                ctx.closePath();
                ctx.fillStyle = el.color;
                ctx.fill();
            } else if(el.type === 'goal') {
                ctx.fillStyle = "#fff";
                ctx.fillRect(el.x - 20, el.y - 10, 40, 20);
                ctx.strokeRect(el.x - 20, el.y - 10, 40, 20);
            } else {
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
                ctx.fillStyle = el.type === 'ball' ? '#fff' : el.color;
                ctx.fill();
                
                if(el.type === 'player' && el.name) {
                    ctx.shadowBlur = 0;
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 10px Inter";
                    ctx.textAlign = "center";
                    ctx.fillText(el.name, el.x, el.y + el.radius + 15);
                }
            }
            
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });
    }
};
