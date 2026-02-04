/**
 * TONI 2.0 - INTERNATIONAL ARENA ENGINE PRO
 * Pitch visuals: Goals, 5m Areas, 5m-Grid & 11+5 Squad Logic
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [],
    draggedPlayer: null,
    
    init: function(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Stellt sicher, dass eine Mannschaft existiert
        this.checkAndSeedSquad();
        this.resetBoard();
    },

    resize: function() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.render();
    },

    /**
     * Erstellt eine Mustermannschaft (11+5), falls der Kader leer ist.
     */
    checkAndSeedSquad: function() {
        let squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        if(squad.length < 5) {
            console.log("System-Initialisierung: Erstelle Mustermannschaft...");
            const muster = [];
            const positions = ["TW", "LV", "IV", "IV", "RV", "LM", "ZM", "ZM", "RM", "ST", "ST"];
            
            // 11 Starter generieren
            for(let i=0; i<11; i++) {
                muster.push({
                    id: 'p_m_'+(i+1),
                    name: 'Profi ' + (i+1),
                    number: i+1,
                    pos: positions[i],
                    rating: 82,
                    isStarter: true,
                    status: 'FIT',
                    skills: { spr: 75, aus: 75, tec: 75, pas: 75, phy: 75 },
                    vitals: { pulse: 68, spo2: 98 }
                });
            }
            // 5 Bankspieler generieren
            for(let i=12; i<=16; i++) {
                muster.push({
                    id: 'p_m_'+i,
                    name: 'Ersatz ' + i,
                    number: i,
                    pos: 'SUB',
                    rating: 78,
                    isStarter: false,
                    status: 'FIT',
                    skills: { spr: 70, aus: 70, tec: 70, pas: 70, phy: 70 },
                    vitals: { pulse: 70, spo2: 97 }
                });
            }
            localStorage.setItem('toni_players', JSON.stringify(muster));
        }
    },

    resetBoard: function() {
        const squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        const starters = squad.filter(p => p.isStarter).slice(0, 11);
        const bench = squad.filter(p => !p.isStarter).slice(0, 5);

        // Rote Mannschaft (Home) auf das Feld
        starters.forEach((p, i) => {
            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'home',
                x: this.getInitialX(i, 'home', w), y: this.getInitialY(i, h), radius: 18
            });
        });

        // Ersatzbank (Unten positioniert)
        bench.forEach((p, i) => {
            this.players.push({
                id: p.id, name: p.name, nr: p.number, team: 'bench',
                x: (w * 0.25) + (i * (w * 0.1)), y: h - 35, radius: 14
            });
        });

        // Blaue Mannschaft (Away / Toni Team)
        for(let i=0; i < 11; i++) {
            this.players.push({
                id: 'opp_'+i, nr: i+1, team: 'away',
                x: this.getInitialX(i, 'away', w), y: this.getInitialY(i, h), radius: 18
            });
        }
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Pitch & 5m Raster
        ctx.fillStyle = "#051205"; 
        ctx.fillRect(0,0,w,h);
        this.drawGrid(ctx, w, h);
        
        ctx.strokeStyle = "rgba(57, 255, 20, 0.6)"; 
        ctx.lineWidth = 3;
        const pad = 60;

        // Außenlinien & Mitte
        ctx.strokeRect(pad, pad, w-(pad*2), h-(pad*2));
        ctx.beginPath(); ctx.moveTo(w/2, pad); ctx.lineTo(w/2, h-pad); ctx.stroke();
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke();

        // Strafräume (16m) & Torräume (5m)
        this.drawBox(ctx, pad, h/2, 120, 260, 40); // Links
        this.drawBox(ctx, w-pad, h/2, -120, 260, -40); // Rechts

        // Tore (Physische weiße Pfosten)
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(pad, h/2 - 45); ctx.lineTo(pad, h/2 + 45); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w-pad, h/2 - 45); ctx.lineTo(w-pad, h/2 + 45); ctx.stroke();

        // Spieler & Ball
        this.players.forEach(p => this.drawPlayer(ctx, p));
        this.drawBall(ctx, w/2 + 20, h/2);
    },

    drawGrid: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        const step = 45; // Simuliert ca. 5 Meter Abstände
        for(let x=60; x<w-60; x+=step) {
            ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, h-60); ctx.stroke();
        }
        for(let y=60; y<h-60; y+=step) {
            ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w-60, y); ctx.stroke();
        }
    },

    drawBox: function(ctx, x, y, boxW, boxH, goalW) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.6)"; ctx.lineWidth = 2;
        ctx.strokeRect(x, y - boxH/2, boxW, boxH); // 16m Raum
        ctx.strokeRect(x, y - 70, goalW, 140); // 5m Raum (Torraum)
    },

    drawPlayer: function(ctx, p) {
        const color = p.team === 'home' ? '#FF3030' : (p.team === 'bench' ? '#FF8C00' : '#3080FF');
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
        
        ctx.fillStyle = "#fff"; ctx.font = `bold ${p.radius}px Inter`; ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + (p.radius/3));
        
        if(p.team !== 'away') {
            ctx.font = "10px Inter"; 
            ctx.fillText(p.name ? p.name.split(' ')[0] : 'PRO', p.x, p.y + p.radius + 12);
        }
    },

    drawBall: function(ctx, x, y) {
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
    },

    handleMouseDown: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left; const my = e.clientY - rect.top;
        this.draggedPlayer = this.players.find(p => Math.sqrt((p.x-mx)**2 + (p.y-my)**2) < p.radius);
    },
    handleMouseMove: function(e) {
        if (this.draggedPlayer) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedPlayer.x = e.clientX - rect.left;
            this.draggedPlayer.y = e.clientY - rect.top;
            this.render();
        }
    },
    handleMouseUp: function() { this.draggedPlayer = null; },

    getInitialX: function(i, team, w) {
        if (i === 0) return team === 'home' ? 100 : w - 100; // Torwart
        if (i < 5) return team === 'home' ? w * 0.25 : w * 0.75; // Abwehr
        if (i < 9) return team === 'home' ? w * 0.42 : w * 0.58; // Mittelfeld
        return team === 'home' ? w * 0.48 : w * 0.52; // Sturm
    },
    getInitialY: function(i, h) {
        const pos = [0.5, 0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.4, 0.6];
        return h * pos[i];
    }
};
