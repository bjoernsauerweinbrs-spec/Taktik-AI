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
        const currentPos = this.players.reduce((acc, p) => { acc[p.id] = {x: p.x, y: p.y}; return acc; }, {});
        
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            x: currentPos[p.id] ? currentPos[p.id].x : 80 + (index * 45) % 150,
            y: currentPos[p.id] ? currentPos[p.id].y : 100 + (index * 60) % (this.canvas.height - 200),
            radius: 18,
            color: '#FF3B30'
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
                color: '#007AFF'
            });
        }
    },

    resetBoard() {
        this.players = [];
        this.loadPlayersFromStorage();
        this.initOpponents();
    },

    applyTacticalPattern(pattern) {
        const w = this.canvas.width, h = this.canvas.height;
        this.players.forEach((p, i) => {
            let tx, ty;
            if (pattern === 'pressing') {
                tx = w/2 + 60 + (i * 15);
                ty = (h / (this.players.length + 1)) * (i + 1);
            } else if (pattern === 'overload') {
                tx = w - 180; ty = h/2 - 150 + (i * 35);
            } else if (pattern === 'compact') {
                tx = 180 + (i * 5); ty = h/2 - 120 + (i * 30);
            }
            if (tx && ty) this.glideTo(p.id, tx, ty);
        });
        
        const msgs = { pressing: "Coach, wir pressen jetzt hoch!", overload: "Überzahl auf dem Flügel!", compact: "Wir stehen jetzt kompakt!" };
        if (window.ToniAI) {
            window.ToniAI.addChatMessage("Toni", msgs[pattern], "bot-msg");
            window.ToniAI.speak(msgs[pattern]);
        }
    },

    glideTo(playerId, tx, ty) {
        const p = this.players.find(x => x.id === playerId) || this.opponents.find(x => x.id === playerId);
        if (!p) return;
        const startX = p.x, startY = p.y, startTime = performance.now();
        const anim = (now) => {
            const progress = Math.min((now - startTime) / 1000, 1);
            const ease = progress * (2 - progress);
            p.x = startX + (tx - startX) * ease;
            p.y = startY + (ty - startY) * ease;
            if(progress < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
    },

    setupEventListeners() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const cx = e.clientX || (e.touches && e.touches[0].clientX);
            const cy = e.clientY || (e.touches && e.touches[0].clientY);
            return { x: cx - rect.left, y: cy - rect.top };
        };
        this.canvas.addEventListener('mousedown', (e) => {
            const pos = getPos(e);
            this.draggedPlayer = [...this.players, ...this.opponents].find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < p.radius);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.draggedPlayer) { const pos = getPos(e); this.draggedPlayer.x = pos.x; this.draggedPlayer.y = pos.y; }
        });
        window.addEventListener('mouseup', () => this.draggedPlayer = null);
        this.canvas.addEventListener('touchstart', (e) => {
            const pos = getPos(e);
            this.draggedPlayer = [...this.players, ...this.opponents].find(p => Math.hypot(p.x - pos.x, p.y - pos.y) < p.radius);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            if (this.draggedPlayer) { const pos = getPos(e); this.draggedPlayer.x = pos.x; this.draggedPlayer.y = pos.y; }
        });
    },

    drawPitch() {
        const ctx = this.ctx, w = this.canvas.width, h = this.canvas.height, p = 40;
        ctx.fillStyle = '#111'; ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
        ctx.strokeRect(p, p, w - p*2, h - p*2);
        ctx.beginPath(); ctx.moveTo(w/2, p); ctx.lineTo(w/2, h-p); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 70, 0, Math.PI*2); ctx.stroke();
        // Tore & Strafräume
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.strokeRect(p - 15, h/2 - 40, 15, 80); ctx.strokeRect(w - p, h/2 - 40, 15, 80);
        ctx.strokeRect(p, h/2 - 100, 100, 200); ctx.strokeRect(w - p - 100, h/2 - 100, 100, 200);
    },

    drawTeam(list) {
        list.forEach(p => {
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
            this.ctx.fillStyle = p.color; this.ctx.shadowBlur = 10; this.ctx.shadowColor = p.color;
            this.ctx.fill(); this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = "#fff"; this.ctx.font = "bold 11px Inter"; this.ctx.textAlign = "center";
            this.ctx.fillText(p.number, p.x, p.y + 4);
            if(p.name) {
                this.ctx.font = "9px Inter"; this.ctx.fillStyle = "rgba(255,255,255,0.7)";
                this.ctx.fillText(p.name.toUpperCase(), p.x, p.y + 32);
            }
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawTeam(this.opponents);
        this.drawTeam(this.players);
        requestAnimationFrame(() => this.render());
    }
};
