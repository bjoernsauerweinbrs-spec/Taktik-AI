window.arena = {
    canvas: null,
    ctx: null,
    players: [],      // Dein Team (Rot)
    opponents: [],    // Gegner (Blau - Fix 11)
    draggedPlayer: null,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.loadPlayersFromStorage();
        this.initOpponents();
        this.setupEventListeners();
        this.render();
        
        window.addEventListener('resize', () => this.resize());
    },

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    },

    loadPlayersFromStorage() {
        const savedPlayers = JSON.parse(localStorage.getItem('toni_players')) || [];
        // Positionen behalten, wenn Spieler bereits existieren
        const currentPos = this.players.reduce((acc, p) => { acc[p.id] = {x: p.x, y: p.y}; return acc; }, {});
        
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            x: currentPos[p.id] ? currentPos[p.id].x : 80 + (index * 45) % 180,
            y: currentPos[p.id] ? currentPos[p.id].y : 100 + (index * 60) % (this.canvas.height - 200),
            radius: 18,
            color: '#FF3B30' // Dein Team (Rot)
        }));
    },

    initOpponents() {
        this.opponents = [];
        for (let i = 1; i <= 11; i++) {
            this.opponents.push({
                id: 'opp_' + i,
                number: i,
                x: this.canvas.width - 150 - (i * 10) % 80,
                y: 100 + (i * 50) % (this.canvas.height - 200),
                radius: 18,
                color: '#007AFF' // Gegner (Blau)
            });
        }
    },

    setupEventListeners() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const startDrag = (e) => {
            const pos = getPos(e);
            const all = [...this.players, ...this.opponents];
            this.draggedPlayer = all.find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < p.radius);
        };

        const doDrag = (e) => {
            if (this.draggedPlayer) {
                const pos = getPos(e);
                this.draggedPlayer.x = pos.x;
                this.draggedPlayer.y = pos.y;
            }
        };

        this.canvas.addEventListener('mousedown', startDrag);
        this.canvas.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', () => this.draggedPlayer = null);
        this.canvas.addEventListener('touchstart', startDrag);
        this.canvas.addEventListener('touchmove', doDrag);
    },

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const p = 40; // Padding

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 2;

        // Außenlinien & Mitte
        ctx.strokeRect(p, p, w - p*2, h - p*2);
        ctx.beginPath();
        ctx.moveTo(w/2, p); ctx.lineTo(w/2, h-p);
        ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 70, 0, Math.PI*2); ctx.stroke();

        // Tore & Strafräume
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.strokeRect(p - 15, h/2 - 40, 15, 80); // Tor L
        ctx.strokeRect(w - p, h/2 - 40, 15, 80);    // Tor R
        ctx.strokeRect(p, h/2 - 100, 100, 200);   // Strafraum L
        ctx.strokeRect(w - p - 100, h/2 - 100, 100, 200); // Strafraum R
    },

    drawTeam(list) {
        list.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10; this.ctx.shadowColor = p.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "bold 11px Inter";
            this.ctx.textAlign = "center";
            this.ctx.fillText(p.number, p.x, p.y + 4);
            if(p.name) {
                this.ctx.font = "9px Inter";
                this.ctx.fillStyle = "rgba(255,255,255,0.7)";
                this.ctx.fillText(p.name.toUpperCase(), p.x, p.y + 30);
            }
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawTeam(this.opponents);
        this.drawTeam(this.players);
        requestAnimationFrame(() => this.render());
    },

    // Tonis Schiebe-Funktion (Gleit-Animation)
    glideTo(playerId, tx, ty) {
        const p = this.players.find(x => x.id === playerId);
        if (!p) return;
        const startX = p.x, startY = p.y, startTime = performance.now();
        const anim = (now) => {
            const progress = Math.min((now - startTime) / 800, 1);
            p.x = startX + (tx - startX) * progress;
            p.y = startY + (ty - startY) * progress;
            if(progress < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
    }
};
