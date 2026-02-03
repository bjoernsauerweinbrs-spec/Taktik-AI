window.arena = {
    canvas: null,
    ctx: null,
    items: [], // Speicher für alle Objekte auf dem Feld
    selectedItem: null,
    isDragging: false,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.setupEvents();
        
        // Start-Setup: Der Ball liegt am Anstoßpunkt
        this.resetBoard();
        
        window.addEventListener('resize', () => this.resize());
        console.log("Arena Initialisiert: Tore und Mittelkreis bereit.");
    },

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.render();
    },

    resetBoard() {
        this.items = [];
        // Ball-Objekt initialisieren
        this.items.push({
            id: 'ball',
            type: 'ball',
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 8,
            color: '#ffffff'
        });
        this.render();
    },

    // Zeichnet das Spielfeld nach offiziellen Maßen [cite: 2026-01-25]
    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = 50; // Padding zum Rand

        // Rasenfläche
        ctx.fillStyle = '#162033';
        ctx.fillRect(0, 0, w, h);

        // Außenlinien
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w - 2 * p, h - 2 * p);

        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, p);
        ctx.lineTo(w / 2, h - p);
        ctx.stroke();

        // Mittelkreis [NEU]
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();

        // Anstoßpunkt
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Tore (Physisch außerhalb der Grundlinie) [NEU]
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        const goalWidth = 120;
        // Tor Links
        ctx.strokeRect(p - 25, h / 2 - goalWidth / 2, 25, goalWidth);
        // Tor Rechts
        ctx.strokeRect(w - p, h / 2 - goalWidth / 2, 25, goalWidth);

        // Auswechselbänke [NEU]
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillRect(w / 4, h - 35, w / 2, 25);
        ctx.font = '9px Inter';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.textAlign = 'center';
        ctx.fillText("COACHING ZONE / AUSWECHSELBÄNKE", w / 2, h - 18);
    },

    // Spieler zum Feld hinzufügen (Rot oder Blau)
    addPlayer(name, team, pos = "ST") {
        const x = team === 'red' ? 200 : this.canvas.width - 200;
        const y = 150 + (this.items.length * 50) % (this.canvas.height - 300);
        
        this.items.push({
            id: Date.now() + Math.random(),
            type: 'player',
            name: name,
            team: team,
            pos: pos,
            x: x,
            y: y,
            radius: 18
        });
        this.render();
    },

    render() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();

        this.items.forEach(item => {
            this.ctx.save();
            
            // Schatten für Tiefe
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = 'rgba(0,0,0,0.5)';

            // Kreis zeichnen
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
            
            if (item.type === 'ball') {
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fill();
                // Ball-Muster
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            } else {
                this.ctx.fillStyle = item.team === 'red' ? '#FF3B30' : '#007AFF';
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Spieler-Info Text
                this.ctx.shadowBlur = 0;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 11px Inter';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(item.pos, item.x, item.y + 4);
                
                this.ctx.font = '12px Inter';
                this.ctx.fillText(item.name, item.x, item.y - 25);
            }
            this.ctx.restore();
        });
    },

    setupEvents() {
        const getMousePos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX || e.touches[0].clientX) - rect.left,
                y: (e.clientY || e.touches[0].clientY) - rect.top
            };
        };

        const onStart = (e) => {
            const pos = getMousePos(e);
            this.selectedItem = this.items.find(item => 
                Math.hypot(item.x - pos.x, item.y - pos.y) < item.radius + 10
            );
            if (this.selectedItem) this.isDragging = true;
        };

        const onMove = (e) => {
            if (!this.isDragging || !this.selectedItem) return;
            const pos = getMousePos(e);
            this.selectedItem.x = pos.x;
            this.selectedItem.y = pos.y;
            requestAnimationFrame(() => this.render());
        };

        const onEnd = () => {
            this.isDragging = false;
            this.selectedItem = null;
        };

        // Maus-Events
        this.canvas.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        // Touch-Events für Mac/iPad
        this.canvas.addEventListener('touchstart', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onEnd);
    }
};
