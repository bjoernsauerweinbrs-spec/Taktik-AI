window.arena = {
    canvas: null, ctx: null,
    items: [], // Speicher für Spieler und Ball
    selectedItem: null,
    isDragging: false,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.setupEvents();
        
        // Initial-Setup: Ball in die Mitte
        this.items.push({ id: 'ball', x: this.canvas.width / 2, y: this.canvas.height / 2, radius: 8, color: '#fff', type: 'ball' });
        
        this.render();
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.render();
    },

    // Spielfeld-Grafik [cite: 2026-01-25]
    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = 40; // Padding

        // Rasen
        ctx.fillStyle = '#162033';
        ctx.fillRect(0, 0, w, h);

        // Außenlinien
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w - 2 * p, h - 2 * p);

        // Mittellinie & Kreis [NEU]
        ctx.beginPath();
        ctx.moveTo(w / 2, p);
        ctx.lineTo(w / 2, h - p);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
        ctx.stroke();

        // Tore [NEU - außerhalb der Grundlinie]
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        // Links
        ctx.strokeRect(p - 20, h / 2 - 50, 20, 100);
        // Rechts
        ctx.strokeRect(w - p, h / 2 - 50, 20, 100);
        
        // Auswechselbänke [NEU]
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(w / 4, h - 30, w / 2, 20);
    },

    addPlayer(name, team, pos = "ST") {
        const x = team === 'red' ? 150 : this.canvas.width - 150;
        const y = 100 + (this.items.length * 40) % (this.canvas.height - 200);
        this.items.push({
            id: Date.now(),
            name: name,
            team: team,
            pos: pos,
            x: x,
            y: y,
            radius: 15,
            type: 'player'
        });
        this.render();
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();

        this.items.forEach(item => {
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = item.type === 'ball' ? '#fff' : (item.team === 'red' ? '#FF3B30' : '#007AFF');
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (item.type === 'player') {
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '10px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(item.pos, item.x, item.y + 4);
                this.ctx.font = 'bold 12px Inter';
                this.ctx.fillText(item.name, item.x, item.y - 20);
            }
        });
    },

    setupEvents() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };

        this.canvas.onmousedown = (e) => {
            const pos = getPos(e);
            this.selectedItem = this.items.find(item => 
                Math.hypot(item.x - pos.x, item.y - pos.y) < item.radius + 10
            );
            if (this.selectedItem) this.isDragging = true;
        };

        window.onmousemove = (e) => {
            if (!this.isDragging || !this.selectedItem) return;
            const pos = getPos(e);
            this.selectedItem.x = pos.x;
            this.selectedItem.y = pos.y;
            requestAnimationFrame(() => this.render());
        };

        window.onmouseup = () => {
            this.isDragging = false;
            this.selectedItem = null;
        };
    }
};
