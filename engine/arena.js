/**
 * TONI 2.0 - INTERNATIONAL MULTI-ARENA ENGINE (PRO MATCHDAY EDITION)
 * Pitch: Pro (5m Area), F-Youth & Funino | Tools: Cones, Ladders, Hurdles
 * Features: Tactical Formation Memory, 11+5 Squad Seeding, Auto-Ball Kickoff.
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],
    trainingObjects: [],
    pitchMode: 'pro',
    draggedItem: null,

    // NEU: Taktische Koordinaten-Muster (relativ 0.0 - 1.0)
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

    /**
     * NEU: Wendet eine vordefinierte taktische Formation an
     */
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
                { id: 'p1', name: 'Manuel Neuer', number: 1, pos: 'TW', rating: 89, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p2', name: 'Virgil van Dijk', number: 4, pos: 'IV', rating: 88, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p3', name: 'Ruben Dias', number: 3, pos: 'IV', rating: 87, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p4', name: 'Alphonso Davies', number: 19, pos: 'LV', rating: 85, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p5', name: 'Trent Alexander-Arnold', number: 66, pos: 'RV', rating: 86, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p6', name: 'Joshua Kimmich', number: 6, pos: 'ZM', rating: 86, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p7', name: 'Kevin De Bruyne', number: 17, pos: 'ZM', rating: 91, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p8', name: 'Jude Bellingham', number: 5, pos: 'ZM', rating: 88, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p9', name: 'Mohamed Salah', number: 11, pos: 'RM', rating: 89, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p10', name: 'Kylian Mbappé', number: 7, pos: 'ST', rating: 92, isStarter: true, isNominated: true, isPresent: true },
                { id: 'p11', name: 'Erling Haaland', number: 9, pos: 'ST', rating: 91, isStarter: true, isNominated: true, isPresent: true }
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
        const starters = squad.filter(p => p.isStarter && p.isPresent !== false).slice(0, 11);
        starters.forEach((p, i) => {
            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'home',
                x: this.getInitialX(i, 'home', w), y: this.getInitialY(i, h), radius: 18
            });
        });

        // Gegner (Away)
        for(let i=0; i < 11; i++) {
            this.players.push({ id: 'opp_'+i, nr: i+1, team: 'away', x: this.getInitialX(i, 'away', w), y: this.getInitialY(i, h), radius: 18 });
        }
        this.render();
    },

    addTrainingObject: function(type, x, y) {
        this.trainingObjects.push({
            id: 'obj_' + Date.now(),
            type: type,
            x: x || this.canvas.width / 2,
            y: y || this.canvas.height / 2,
            radius: type === 'ball' ? 7 : 20
        });
        this.render();
    },

    drawPitchLayout: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.6)"; ctx.lineWidth = 3;
        const pad = 60;
        if (this.pitchMode === 'pro') {
            ctx.strokeRect(pad, pad, w-(pad*2), h-(pad*2));
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
            this.drawBox(ctx, pad, h/2, 120, 260, 40);
            this.drawBox(ctx, w-pad, h/2, -120, 260, -40);
        }
    },

    drawBox: function(ctx, x, y, boxW, boxH, goalW) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH);
        ctx.strokeRect(x, y - 70, goalW, 140);
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
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        const step = 45;
        for(let x=60; x<w-60; x+=step) { ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, h-60); ctx.stroke(); }
        for(let y=60; y<h-60; y+=step) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w-60, y); ctx.stroke(); }
    },

    drawPlayer: function(ctx, p) {
        const color = p.team === 'home' ? '#FF3030' : '#3080FF';
        ctx.save();
        ctx.shadowBlur = 10; ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff"; ctx.font = `bold ${p.radius}px Inter`; ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + (p.radius/3));
        if(p.team !== 'away') {
            ctx.font = "bold 11px Inter"; 
            ctx.fillText(p.name || 'PRO', p.x, p.y + p.radius + 14);
        }
        ctx.restore();
    },

    drawTool: function(ctx, obj) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        if (obj.type === 'ball') {
            ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0,0,7,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
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

    getInitialX: function(i, team, w) {
        if (i === 0) return team === 'home' ? 100 : w - 100;
        if (i < 5) return team === 'home' ? w * 0.25 : w * 0.75;
        if (i < 9) return team === 'home' ? w * 0.42 : w * 0.58;
        return team === 'home' ? w * 0.48 : w * 0.52;
    },

    getInitialY: function(i, h) {
        const pos = [0.5, 0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.4, 0.6];
        return h * pos[i];
    },

    getSnapshot: function() {
        return this.canvas.toDataURL("image/png");
    }
};
