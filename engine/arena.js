/**
 * TONI 2.0 - INTERNATIONAL MULTI-ARENA ENGINE (PRO SEED EDITION)
 * Pitch: Pro, F-Youth & Funino | Tools: Cones, Ladders, Hurdles
 * Features: AI-Tactics, Elite-Squad Seeding, A4-Snapshot
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],
    trainingObjects: [],
    pitchMode: 'pro', // pro, youth, funino
    draggedItem: null,

    init: function(id) {
        this.canvas = document.getElementById(id);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Initialisierung: Prüfen ob Kader existiert, sonst Elite-Team laden
        this.checkAndSeedEliteSquad();
        this.resetBoard();
    },

    /**
     * Erstellt ein internationales Muster-Team, falls der Speicher leer ist.
     */
    checkAndSeedEliteSquad: function() {
        let squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        if (squad.length === 0) {
            console.log("TONI 2.0: Initialisiere International Elite Squad...");
            const elite = [
                // STARTELF (11)
                { id: 'p1', name: 'M. Neuer', number: 1, pos: 'TW', rating: 89, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 62, spo2: 99 }, proKpis: { vmax: 2, rsa: 80, ballControl: 85, stress: 90 }, formHistory: [88, 89, 89, 90, 89] },
                { id: 'p2', name: 'V. van Dijk', number: 4, pos: 'IV', rating: 88, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 65, spo2: 98 }, proKpis: { vmax: 3, rsa: 85, ballControl: 78, stress: 95 }, formHistory: [85, 86, 88, 88, 88] },
                { id: 'p3', name: 'R. Dias', number: 3, pos: 'IV', rating: 87, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 68, spo2: 98 }, proKpis: { vmax: 2, rsa: 82, ballControl: 75, stress: 92 }, formHistory: [87, 87, 86, 88, 87] },
                { id: 'p4', name: 'A. Davies', number: 19, pos: 'LV', rating: 85, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 58, spo2: 99 }, proKpis: { vmax: 3, rsa: 92, ballControl: 82, stress: 85 }, formHistory: [80, 82, 85, 85, 85] },
                { id: 'p5', name: 'Alexander-Arnold', number: 66, pos: 'RV', rating: 86, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 61, spo2: 98 }, proKpis: { vmax: 2, rsa: 87, ballControl: 91, stress: 86 }, formHistory: [84, 85, 86, 86, 86] },
                { id: 'p6', name: 'J. Kimmich', number: 6, pos: 'ZM', rating: 86, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 55, spo2: 99 }, proKpis: { vmax: 2, rsa: 95, ballControl: 88, stress: 98 }, formHistory: [85, 86, 86, 87, 86] },
                { id: 'p7', name: 'K. De Bruyne', number: 17, pos: 'ZM', rating: 91, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 64, spo2: 98 }, proKpis: { vmax: 2, rsa: 88, ballControl: 94, stress: 94 }, formHistory: [90, 91, 91, 91, 91] },
                { id: 'p8', name: 'J. Bellingham', number: 5, pos: 'ZM', rating: 88, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 60, spo2: 99 }, proKpis: { vmax: 3, rsa: 90, ballControl: 89, stress: 91 }, formHistory: [84, 85, 88, 88, 88] },
                { id: 'p9', name: 'M. Salah', number: 11, pos: 'RM', rating: 89, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 59, spo2: 99 }, proKpis: { vmax: 3, rsa: 88, ballControl: 90, stress: 88 }, formHistory: [88, 89, 89, 89, 89] },
                { id: 'p10', name: 'K. Mbappe', number: 7, pos: 'ST', rating: 92, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 56, spo2: 99 }, proKpis: { vmax: 3, rsa: 85, ballControl: 92, stress: 89 }, formHistory: [91, 92, 92, 92, 92] },
                { id: 'p11', name: 'E. Haaland', number: 9, pos: 'ST', rating: 91, isStarter: true, isNominated: true, isPresent: true, vitals: { pulse: 63, spo2: 98 }, proKpis: { vmax: 3, rsa: 82, ballControl: 80, stress: 92 }, formHistory: [89, 90, 91, 91, 91] },
                // BANK (5)
                { id: 'p12', name: 'Th. Müller', number: 25, pos: 'ST', rating: 84, isStarter: false, isNominated: true, isPresent: true, vitals: { pulse: 60, spo2: 99 }, proKpis: { vmax: 2, rsa: 90, ballControl: 85, stress: 99 }, formHistory: [84, 84, 84, 84, 84] },
                { id: 'p13', name: 'L. Sané', number: 10, pos: 'RM', rating: 85, isStarter: false, isNominated: true, isPresent: true, vitals: { pulse: 62, spo2: 98 }, proKpis: { vmax: 3, rsa: 88, ballControl: 87, stress: 80 }, formHistory: [83, 85, 84, 85, 85] }
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
        const squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Nur nominierte & anwesende Spieler laden
        const starters = squad.filter(p => p.isStarter && p.isPresent).slice(0, 11);
        const bench = squad.filter(p => p.isNominated && !p.isStarter && p.isPresent).slice(0, 5);

        starters.forEach((p, i) => {
            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'home',
                x: this.getInitialX(i, 'home', w), y: this.getInitialY(i, h), radius: 18
            });
        });

        bench.forEach((p, i) => {
            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'bench',
                x: (w * 0.25) + (i * (w * 0.1)), y: h - 35, radius: 14
            });
        });

        // Gegner (Away)
        for(let i=0; i < 11; i++) {
            this.players.push({ id: 'opp_'+i, nr: i+1, team: 'away', x: this.getInitialX(i, 'away', w), y: this.getInitialY(i, h), radius: 18 });
        }
        this.render();
    },

    /**
     * KI-SCHNITTSTELLE: Bewegt Spieler auf Formationen
     */
    applyTacticalPositions: function(coords) {
        const homePlayers = this.players.filter(p => p.team === 'home');
        coords.forEach((coord, i) => {
            if (homePlayers[i]) {
                homePlayers[i].x = this.canvas.width * coord.x;
                homePlayers[i].y = this.canvas.height * coord.y;
            }
        });
        this.render();
    },

    /**
     * KI-SCHNITTSTELLE: Block-Verschiebung
     */
    shiftTeam: function(direction) {
        const shiftVal = this.canvas.width * 0.08;
        this.players.filter(p => p.team === 'home').forEach(p => {
            if (direction === 'forward') p.x += shiftVal;
            if (direction === 'backward') p.x -= shiftVal;
        });
        this.render();
    },

    setPitchMode: function(mode) {
        this.pitchMode = mode;
        this.render();
    },

    addTrainingObject: function(type) {
        this.trainingObjects.push({
            id: 'obj_' + Date.now(),
            type: type,
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: type === 'ball' ? 6 : 20
        });
        this.render();
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

    drawPitchLayout: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.6)"; ctx.lineWidth = 3;
        const pad = 60;

        if (this.pitchMode === 'pro') {
            ctx.strokeRect(pad, pad, w-(pad*2), h-(pad*2));
            ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();
            this.drawBox(ctx, pad, h/2, 120, 260, 40); // 16er & 5m Links
            this.drawBox(ctx, w-pad, h/2, -120, 260, -40); // 16er & 5m Rechts
        } else if (this.pitchMode === 'youth') {
            ctx.strokeRect(pad * 2, pad, w-(pad*4), h-(pad*2));
            this.drawSmallGoal(ctx, pad*2, h/2);
            this.drawSmallGoal(ctx, w-(pad*2), h/2);
        } else if (this.pitchMode === 'funino') {
            ctx.strokeRect(pad * 2, pad, w-(pad*4), h-(pad*2));
            this.drawSmallGoal(ctx, pad*2, h*0.3); this.drawSmallGoal(ctx, pad*2, h*0.7);
            this.drawSmallGoal(ctx, w-(pad*2), h*0.3); this.drawSmallGoal(ctx, w-(pad*2), h*0.7);
        }
    },

    drawBox: function(ctx, x, y, boxW, boxH, goalW) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH); // 16m Raum
        ctx.strokeRect(x, y - 70, goalW, 140);     // 5m Raum (Torraum)
    },

    drawTool: function(ctx, obj) {
        ctx.save();
        ctx.translate(obj.x, obj.y);
        if (obj.type === 'cone') {
            ctx.fillStyle = "orange"; ctx.beginPath();
            ctx.moveTo(0, -12); ctx.lineTo(12, 12); ctx.lineTo(-12, 12); ctx.closePath(); ctx.fill();
        } else if (obj.type === 'ladder') {
            ctx.strokeStyle = "yellow"; ctx.lineWidth = 2;
            for(let i=0; i<5; i++) ctx.strokeRect(-15, -50 + (i*20), 30, 20);
        } else if (obj.type === 'hurdle') {
            ctx.strokeStyle = "red"; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
        } else if (obj.type === 'ball') {
            ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
    },

    drawPlayer: function(ctx, p) {
        const color = p.team === 'home' ? '#FF3030' : (p.team === 'bench' ? '#FF8C00' : '#3080FF');
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = `bold ${p.radius}px Inter`; ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + (p.radius/3));
        if(p.team !== 'away') {
            ctx.font = "10px Inter"; ctx.fillText(p.name ? p.name.split(' ')[0] : 'PRO', p.x, p.y + p.radius + 12);
        }
    },

    drawGrid: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        const step = 45; // Simuliert ca. 5 Meter
        for(let x=60; x<w-60; x+=step) { ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, h-60); ctx.stroke(); }
        for(let y=60; y<h-60; y+=step) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w-60, y); ctx.stroke(); }
    },

    drawSmallGoal: function(ctx, x, y) {
        ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(x, y - 25); ctx.lineTo(x, y + 25); ctx.stroke();
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
