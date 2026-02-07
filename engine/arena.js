/**
 * TONI 2.0 - ARENA ENGINE (ELITE TACTIC BOARD)
 * Maßstabsgetreues Spielfeld & Drag & Drop Logik
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

    addEquipment(type, color = '#fff') {
        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;
        this.elements.push({
            type: type,
            x: x, y: y,
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
        const margin = 60; // Platz für Tore und Auslinien

        // 1. Hintergrund (Sattes Stadion-Grün)
        ctx.fillStyle = "#051205";
        ctx.fillRect(0, 0, w, h);

        // 2. Spielfeldmarkierungen (Profi-Weiß/Neon)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 2;

        // Außenlinien
        ctx.strokeRect(margin, margin, w - (margin * 2), h - (margin * 2));

        // Mittellinie
        ctx.beginPath();
        ctx.moveTo(w / 2, margin);
        ctx.lineTo(w / 2, h - margin);
        ctx.stroke();

        // Anstoßkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();
        // Anstoßpunkt
        ctx.fillCircle = (x, y, r) => { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); };
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.beginPath(); ctx.arc(w/2, h/2, 3, 0, Math.PI*2); ctx.fill();

        // --- STRAFRÄUME (OBEN & UNTEN) ---
        const penaltyW = w * 0.4;
        const penaltyH = h * 0.18;
        const goalBoxW = w * 0.15;
        const goalBoxH = h * 0.06;

        // Oben (Nord)
        ctx.strokeRect(w / 2 - penaltyW / 2, margin, penaltyW, penaltyH); // 16m
        ctx.strokeRect(w / 2 - goalBoxW / 2, margin, goalBoxW, goalBoxH); // 5m
        
        // Unten (Süd)
        ctx.strokeRect(w / 2 - penaltyW / 2, h - margin - penaltyH, penaltyW, penaltyH); // 16m
        ctx.strokeRect(w / 2 - goalBoxW / 2, h - margin - goalBoxH, goalBoxW, goalBoxH); // 5m

        // --- TORE (GRAFISCH) ---
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 4;
        const goalWidth = w * 0.12;
        // Tor Nord
        ctx.strokeRect(w/2 - goalWidth/2, margin - 15, goalWidth, 15);
        // Tor Süd
        ctx.strokeRect(w/2 - goalWidth/2, h - margin, goalWidth, 15);

        // 3. Elemente (Spieler & Material) zeichnen
        this.elements.forEach(el => {
            ctx.beginPath();
            ctx.shadowBlur = this.selectedElement === el ? 20 : 0;
            ctx.shadowColor = el.color;

            if(el.type === 'cone') {
                ctx.moveTo(el.x, el.y - 15);
                ctx.lineTo(el.x + 12, el.y + 12);
                ctx.lineTo(el.x - 12, el.y + 12);
                ctx.closePath();
                ctx.fillStyle = el.color;
                ctx.fill();
            } else if(el.type === 'ball') {
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
                ctx.fillStyle = "#FFF";
                ctx.fill();
                // Ball-Muster (Punkte)
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.stroke();
            } else if(el.type === 'player') {
                // Spieler-Icon
                ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
                ctx.fillStyle = el.color;
                ctx.fill();
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Spieler-Name (Elite-Look)
                ctx.shadowBlur = 0;
                ctx.fillStyle = "#fff";
                ctx.font = "bold 11px Inter";
                ctx.textAlign = "center";
                ctx.fillText(el.name.toUpperCase(), el.x, el.y + el.radius + 15);
            }
            ctx.shadowBlur = 0;
        });
    }
};
