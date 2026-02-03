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
        // Nur neue Spieler hinzufügen, bestehende Positionen behalten
        const currentPos = this.players.reduce((acc, p) => { acc[p.id] = {x: p.x, y: p.y}; return acc; }, {});
        
        this.players = savedPlayers.map((p, index) => ({
            id: p.id,
            name: p.name,
            number: p.number || "??",
            x: currentPos[p.id] ? currentPos[p.id].x : 100 + (index * 40) % 150,
            y: currentPos[p.id] ? currentPos[p.id].y : 80 + (index * 45) % (this.canvas.height - 150),
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
                x: this.canvas.width - 200 - (i * 10) % 100,
                y: 100 + (i * 50) % (this.canvas.height - 200),
                radius: 18,
                color: '#007AFF'
            });
        }
    },

    setupEventListeners() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX || e.touches[0].clientX) - rect.left,
                y: (e.clientY || e.touches[0].clientY) - rect.top
            };
        };

        const startDrag = (e) => {
            const pos = getPos(e);
            // Suche in beiden Teams (Rot zuerst, dann Blau)
            const allPlayers = [...this.players, ...this.opponents];
            this.draggedPlayer = allPlayers.find(p => {
                const dist = Math.hypot(p.x - pos.x, p.y - pos.y);
                return dist < p.radius;
            });
        };

        const doDrag = (e) => {
            if (this.draggedPlayer) {
                const pos = getPos(e);
                this.draggedPlayer.x = pos.x;
                this.draggedPlayer.y = pos.y;
            }
        };

        const stopDrag = () => { this.draggedPlayer = null; };

        this.canvas.addEventListener('mousedown', startDrag);
        this.canvas.addEventListener('mousemove', doDrag);
        window.addEventListener('mouseup', stopDrag);
        
        this.canvas.addEventListener('touchstart', startDrag);
        this.canvas.addEventListener('touchmove', doDrag);
        window.addEventListener('touchend', stopDrag);
    },

    drawPitch() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const pad = 40;

        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;

        ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
        ctx.beginPath();
        ctx.moveTo(w / 2, pad);
        ctx.lineTo(w / 2, h - pad);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
        ctx.stroke();

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.strokeRect(pad - 15, h / 2 - 40, 15, 80); // Tor L
        ctx.strokeRect(w - pad, h / 2 - 40, 15, 80);    // Tor R
        
        ctx.lineWidth = 1.5;
        ctx.strokeRect(pad, h / 2 - 100, 100, 200); // Strafraum L
        ctx.strokeRect(w - pad - 100, h / 2 - 100, 100, 200); // Strafraum R
    },

    drawTeam(teamList) {
        const ctx = this.ctx;
        teamList.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowBlur = this.draggedPlayer === p ? 25 : 10;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px Inter";
            ctx.textAlign = "center";
            ctx.fillText(p.number, p.x, p.y + 4);

            if (p.name) {
                ctx.font = "9px Inter";
                ctx.fillStyle = "rgba(255,255,255,0.7)";
                ctx.fillText(p.name.toUpperCase(), p.x, p.y + 28);
            }
        });
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawPitch();
        this.drawTeam(this.opponents); // Erst Gegner (unten)
        this.drawTeam(this.players);   // Dann dein Team (oben)
        requestAnimationFrame(() => this.render());
    },

    animateFormation(type) {
        // Hier folgen die automatischen Formationen (Gingastyle)
    }
};
