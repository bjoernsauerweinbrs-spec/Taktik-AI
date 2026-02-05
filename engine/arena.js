/**
 * TONI 2.0 - INTERNATIONAL MULTI-ARENA ENGINE (PRO MATCHDAY EDITION)
 * Pitch: Pro (5m Area), F-Youth & Funino | Tools: Cones, Ladders, Hurdles
 * Features: Trainerbank-Zonen (Bank), Tactical Formations, Auto-Scaling.
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],
    trainingObjects: [],
    pitchMode: 'pro',
    draggedItem: null,

    formations: {
        "compact": [
            {x: 0.15, y: 0.5}, {x: 0.35, y: 0.35}, {x: 0.35, y: 0.65}, {x: 0.4, y: 0.45}, {x: 0.4, y: 0.55},
            {x: 0.5, y: 0.3}, {x: 0.5, y: 0.7}, {x: 0.6, y: 0.5}, {x: 0.7, y: 0.4}, {x: 0.8, y: 0.5}, {x: 0.7, y: 0.6}
        ],
        "wide": [
            {x: 0.15, y: 0.5}, {x: 0.35, y: 0.15}, {x: 0.35, y: 0.85}, {x: 0.4, y: 0.35}, {x: 0.4, y: 0.65},
            {x: 0.5, y: 0.1}, {x: 0.5, y: 0.9}, {x: 0.6, y: 0.5}, {x: 0.7, y: 0.2}, {x: 0.8, y: 0.5}, {x: 0.7, y: 0.8}
        ],
        "pressing": [
            {x: 0.25, y: 0.5}, {x: 0.45, y: 0.3}, {x: 0.45, y: 0.7}, {x: 0.5, y: 0.5}, {x: 0.6, y: 0.2},
            {x: 0.6, y: 0.8}, {x: 0.7, y: 0.4}, {x: 0.7, y: 0.6}, {x: 0.8, y: 0.3}, {x: 0.8, y: 0.7}, {x: 0.9, y: 0.5}
        ]
    },

    init: function(id) {
        this.canvas = document.getElementById(id);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());

        this.canvas.addEventListener('touchstart', (e) => this.handleMouseDown(e.touches[0]));
        this.canvas.addEventListener('touchmove', (e) => this.handleMouseMove(e.touches[0]));
        this.canvas.addEventListener('touchend', () => this.handleMouseUp());

        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.checkAndSeedEliteSquad();
        this.resetBoard();
        
        setTimeout(() => this.render(), 100);
    },

    setPitchMode: function(mode) {
        this.pitchMode = mode;
        this.render();
    },

    applyTacticalFormation: function(type) {
        const coords = this.formations[type];
        if (!coords) return;
        const homePlayers = this.players.filter(p => p.team === 'home');
        coords.forEach((coord, i) => {
            if (homePlayers[i]) {
                homePlayers[i].x = coord.x * this.canvas.width;
                homePlayers[i].y = coord.y * this.canvas.height;
            }
        });
        this.render();
    },

    checkAndSeedEliteSquad: function() {
        let squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (squad.length === 0) {
            const elite = [
                { id: 'p1', name: 'M. Neuer', number: 1, pos: 'TW', rating: 89, isStarter: true, isPresent: true },
                { id: 'p10', name: 'K. Mbappé', number: 7, pos: 'ST', rating: 92, isStarter: true, isPresent: true }
            ];
            localStorage.setItem('toni_players', JSON.stringify(elite));
        }
    },

    resize: function() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
            this.render();
        }
    },

    resetBoard: function() {
        this.trainingObjects = [];
        this.players = [];
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.addTrainingObject('ball', w / 2, h / 2);

        const squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        const active = squad.filter(p => p.isPresent);

        // TRAINERBANK LOGIK: Spieler am Rand positionieren
        active.forEach((p, i) => {
            const onTopBench = i < 10;
            const benchX = (i % 10) * (w / 11) + 50;
            const benchY = onTopBench ? 30 : h - 30; // Oben oder unten parken

            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'home',
                x: benchX, y: benchY, radius: 18, isStarter: p.isStarter
            });
        });

        // Gegner (Standardmäßig auf Position)
        for(let i=0; i < 11; i++) {
            this.players.push({ id: 'opp_'+i, nr: i+1, team: 'away', x: w - 100, y: (h/12)*(i+1), radius: 18 });
        }
        this.render();
    },

    addTrainingObject: function(type, x, y) {
        this.trainingObjects.push({
            id: 'obj_' + Date.now(), type: type, x: x, y: y, radius: type === 'ball' ? 7 : 20
        });
        this.render();
    },

    drawPitchLayout: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)"; ctx.lineWidth = 2;
        const pad = 60;

        // TRAINERBÄNKE ZEICHNEN
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.fillRect(0, 0, w, 55); // Obere Bank
        ctx.fillRect(0, h-55, w, 55); // Untere Bank
        ctx.strokeRect(5, 5, w-10, 50);
        ctx.strokeRect(5, h-55, w-10, 50);

        if (this.pitchMode === 'pro') {
            ctx.strokeRect(pad, pad, w-(pad*2), h-(pad*2));
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
            this.drawBox(ctx, pad, h/2, 120, 260, 40); // Links
            this.drawBox(ctx, w-pad, h/2, -120, 260, -40); // Rechts
        } else if (this.pitchMode === 'youth') {
            ctx.strokeRect(pad*1.5, pad, w-(pad*3), h-(pad*2));
            this.drawSmallGoal(ctx, pad*1.5, h/2);
            this.drawSmallGoal(ctx, w-(pad*1.5), h/2);
        } else if (this.pitchMode === 'funino') {
            ctx.strokeRect(pad*1.5, pad, w-(pad*3), h-(pad*2));
            this.drawSmallGoal(ctx, pad*1.5, h*0.3); this.drawSmallGoal(ctx, pad*1.5, h*0.7);
            this.drawSmallGoal(ctx, w-(pad*1.5), h*0.3); this.drawSmallGoal(ctx, w-(pad*1.5), h*0.7);
        }
    },

    drawSmallGoal: function(ctx, x, y) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x, y-25); ctx.lineTo(x, y+25); ctx.stroke();
    },

    drawBox: function(ctx, x, y, boxW, boxH, goalW) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH);
        ctx.strokeRect(x, y - 70, goalW, 140); // 5m Area
    },

    render: function() {
        const ctx = this.ctx;
        if (!ctx) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.fillStyle = "#051205"; 
        ctx.fillRect(0,0,w,h);
        this.drawGrid(ctx, w, h);
        this.drawPitchLayout(ctx, w, h);
        this.trainingObjects.forEach(obj => this.drawTool(ctx, obj));
        this.players.forEach(p => this.drawPlayer(ctx, p));
    },

    drawGrid: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        const step = 45;
        for(let x=0; x<w; x+=step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for(let y=0; y<h; y+=step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    },

    drawPlayer: function(ctx, p) {
        const isHome = p.team === 'home';
        const color = isHome ? (p.isStarter ? '#39FF14' : '#FF3030') : '#3080FF';
        
        ctx.save();
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        
        ctx.fillStyle = isHome && p.isStarter ? "#000" : "#fff";
        ctx.font = `bold ${p.radius}px Inter`; ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + (p.radius/3));
        
        if(isHome) {
            ctx.font = "bold 10px Inter"; ctx.fillStyle = "#fff";
            ctx.fillText(p.name, p.x, p.y + p.radius + 12);
        }
        ctx.restore();
    },

    handleMouseDown: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
        this.draggedItem = this.players.find(p => Math.sqrt((p.x-mx)**2 + (p.y-my)**2) < p.radius) ||
                           this.trainingObjects.find(o => Math.sqrt((o.x-mx)**2 + (o.y-my)**2) < o.radius);
    },

    handleMouseMove: function(e) {
        if (this.draggedItem) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedItem.x = e.clientX - rect.left;
            this.draggedItem.y = e.clientY - rect.top;
            this.render();
        }
    },

    handleMouseUp: function() { this.draggedItem = null; },

    getInitialX: function(i, team, w) { return team === 'home' ? 100 : w - 100; },
    getInitialY: function(i, h) { return (h/12)*(i+1); },

    getSnapshot: function() { return this.canvas.toDataURL("image/png"); }
};
