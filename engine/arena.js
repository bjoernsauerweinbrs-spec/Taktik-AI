/**
 * TONI 2.0 - NEON GINGA ARENA ENGINE PRO
 * Interaktives Taktikboard mit Real-Kader Integration & 5m-Raster
 */
window.arena = {
    canvas: null,
    ctx: null,
    players: [], // Aktive Objekte auf dem Feld
    draggedPlayer: null,
    
    init: function(id) {
        this.canvas = document.getElementById(id);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Event Listener für Interaktion
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.resetBoard(); // Initialer Aufbau
    },

    resize: function() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        this.render();
    },

    // Lädt die Spieler aus dem Speicher und positioniert sie
    resetBoard: function() {
        const squad = JSON.parse(localStorage.getItem('toni_players')) || [];
        this.players = [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Rote Spieler (Dein Team)
        const starters = squad.filter(p => p.isStarter).slice(0, 11);
        const bench = squad.filter(p => !p.isStarter).slice(0, 5);

        // Startelf Positionierung (4-4-2 Standard)
        starters.forEach((p, i) => {
            this.players.push({
                id: p.id,
                name: p.name,
                nr: p.number,
                team: 'home',
                x: this.getInitialX(i, 'home', w),
                y: this.getInitialY(i, h),
                radius: 18
            });
        });

        // Ersatzbank (Unten)
        bench.forEach((p, i) => {
            this.players.push({
                id: p.id,
                name: p.name,
                nr: p.number,
                team: 'bench',
                x: (w * 0.3) + (i * (w * 0.1)),
                y: h - 30,
                radius: 14
            });
        });

        // 2. Blaue Spieler (Toni Team - Gegner)
        for(let i=0; i < 11; i++) {
            this.players.push({
                id: 'opp_'+i,
                nr: i+1,
                team: 'away',
                x: this.getInitialX(i, 'away', w),
                y: this.getInitialY(i, h),
                radius: 18
            });
        }

        if(window.ToniTTS) ToniTTS.speak("Spielfeld mit Kaderdaten synchronisiert.", "warm");
        this.render();
    },

    render: function() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Hintergrund & 5m Raster
        ctx.fillStyle = "#050B05"; 
        ctx.fillRect(0,0,w,h);
        this.drawGrid(ctx, w, h);
        
        // Pitch-Linien
        ctx.strokeStyle = "#39FF14"; 
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10; ctx.shadowColor = "#39FF14";
        
        ctx.strokeRect(60, 60, w-120, h-120); // Außenlinie
        ctx.beginPath(); ctx.moveTo(w/2, 60); ctx.lineTo(w/2, h-60); ctx.stroke(); // Mittellinie
        ctx.beginPath(); ctx.arc(w/2, h/2, 60, 0, Math.PI*2); ctx.stroke(); // Mittelkreis

        // Tore & Strafräume
        this.drawGoalArea(ctx, 60, h/2, 80, h/2.5); 
        this.drawGoalArea(ctx, w-60, h/2, -80, h/2.5);

        // Spieler zeichnen
        ctx.shadowBlur = 0;
        this.players.forEach(p => this.drawPlayer(ctx, p));

        // Ball
        this.drawBall(ctx, w/2, h/2);
    },

    drawGrid: function(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.05)";
        ctx.lineWidth = 1;
        const step = 40; // Simuliert ca. 5 Meter
        for(let x=60; x<w-60; x+=step) {
            ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, h-60); ctx.stroke();
        }
        for(let y=60; y<h-60; y+=step) {
            ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w-60, y); ctx.stroke();
        }
    },

    drawPlayer: function(ctx, p) {
        const color = p.team === 'home' ? '#FF3B30' : (p.team === 'bench' ? '#FF6A00' : '#00D1FF');
        
        // Kreis
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();

        // Nummer
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${p.radius}px Inter`;
        ctx.textAlign = "center";
        ctx.fillText(p.nr, p.x, p.y + (p.radius/3));

        // Name (Nur für Heimteam & Ersatzbank)
        if(p.team !== 'away' && p.name) {
            ctx.font = "9px Inter";
            ctx.fillText(p.name.split(' ')[0], p.x, p.y + p.radius + 12);
        }
    },

    drawGoalArea: function(ctx, x, y, boxW, boxH) {
        ctx.strokeRect(x, y - boxH/2, boxW, boxH);
    },

    drawBall: function(ctx, x, y) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = "#000"; ctx.stroke();
    },

    // INTERAKTION LOGIK
    handleMouseDown: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.draggedPlayer = this.players.find(p => {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            return Math.sqrt(dx*dx + dy*dy) < p.radius;
        });
    },

    handleMouseMove: function(e) {
        if (this.draggedPlayer) {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedPlayer.x = e.clientX - rect.left;
            this.draggedPlayer.y = e.clientY - rect.top;
            this.render();
        }
    },

    handleMouseUp: function() {
        this.draggedPlayer = null;
    },

    // HILFSFUNKTIONEN FÜR AUFSTELLUNG
    getInitialX: function(i, team, w) {
        const side = team === 'home' ? 0.15 : 0.85;
        if (i === 0) return team === 'home' ? 80 : w - 80; // TW
        if (i < 5) return team === 'home' ? w * 0.25 : w * 0.75; // Abwehr
        if (i < 9) return team === 'home' ? w * 0.40 : w * 0.60; // Mittelfeld
        return w/2 + (team === 'home' ? -50 : 50); // Sturm
    },

    getInitialY: function(i, h) {
        const positions = [0.5, 0.2, 0.4, 0.6, 0.8, 0.2, 0.4, 0.6, 0.8, 0.4, 0.6];
        return h * positions[i];
    },

    applyTacticalPattern: function(pattern) {
        if(pattern === 'pressing') {
            this.players.filter(p => p.team === 'home').forEach(p => p.x += 40);
            if(window.ToniTTS) ToniTTS.speak("Team rückt zum Pressing vor.", "deep");
        }
        this.render();
    }
};
