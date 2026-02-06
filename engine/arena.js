/**
 * TONI 2.0 - ARENA ENGINE (UPDATE: Drag & Drop + Equipment)
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], // Hier speichern wir Spieler, Hütchen, Bälle
    selectedElement: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.setupEventListeners();
        this.resize();
        
        // Initial-Set: Ein paar Hütchen und Bälle zum Testen
        this.addEquipment('cone', 100, 100, '#FFFF00'); // Gelbes Hütchen
        this.addEquipment('ball', 200, 200);           // Ball
        
        this.render();
    },

    addEquipment(type, x, y, color = '#fff') {
        this.elements.push({ type, x, y, color, radius: 15 });
        this.render();
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.selectedElement = null);
    },

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.selectedElement = this.elements.find(el => {
            const dist = Math.sqrt((mouseX - el.x)**2 + (mouseY - el.y)**2);
            return dist < el.radius;
        });
    },

    handleMouseMove(e) {
        if (!this.selectedElement) return;
        const rect = this.canvas.getBoundingClientRect();
        this.selectedElement.x = e.clientX - rect.left;
        this.selectedElement.y = e.clientY - rect.top;
        this.render();
    },

    resize() {
        const container = document.getElementById('stage-container');
        if(!container) return;
        this.canvas.width = container.clientWidth * 0.98;
        this.canvas.height = container.clientHeight * 0.95;
        this.render();
    },

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld zeichnen (wie zuvor)
        ctx.fillStyle = "#0A1A0A";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = "#39FF14";
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, w - 40, h - 40);
        
        // 5m-Raum (Vision)
        ctx.strokeRect(w * 0.40, h - 50, w * 0.2, 30);

        // 2. Elemente zeichnen
        this.elements.forEach(el => {
            ctx.beginPath();
            if(el.type === 'cone') {
                // Hütchen als Dreieck
                ctx.moveTo(el.x, el.y - 15);
                ctx.lineTo(el.x + 12, el.y + 12);
                ctx.lineTo(el.x - 12, el.y + 12);
                ctx.closePath();
                ctx.fillStyle = el.color;
            } else {
                // Ball/Spieler als Kreis
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
                ctx.fillStyle = el.type === 'ball' ? '#fff' : '#39FF14';
            }
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.stroke();
        });
    }
};
