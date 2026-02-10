/**
 * TONI 2.0 - ARENA ENGINE (CHOREOGRAPHY EDITION)
 * Fokus: Automatisierte Übungen, Vektor-Pfade & Ball-Physik
 * Status: MASTER-UPDATE - 10.02.2026
 */
window.arena = {
    canvas: null,
    ctx: null,
    elements: [], 
    equipment: [], 
    paths: [], // Neu: Für Pfeile und Passlinien
    ball: { x: 0, y: 0, targetX: 0, targetY: 0, active: false }, // Neu: Der Ball
    selectedElement: null,
    benchHeight: 180,
    isAnimating: false,
    
    // --- PITCH CONFIG ---
    currentPitchMode: 'grossfeld', 
    isTransitioning: false,
    greenkeeperPos: -300,

    // --- SEQUENZER LOGIK (NEU) ---
    currentSequence: [],
    isSequenceRunning: false,

    init(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if(!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.setupEventListeners();
        if(window.Database) this.syncFromDatabase();
        this.renderLoop();
    },

    // --- MODUL: DRILL-INTERPRETER (DIE KÖNIGSDISZIPLIN) ---
    
    /**
     * Startet eine choreografierte Übung
     * @param {Array} script - Liste von Schritten [{type, data, delay}]
     */
    playDrill(script) {
        this.isSequenceRunning = true;
        this.clearBoard(false); // Feld aufräumen, aber Spieler behalten
        
        let cumulativeDelay = 0;
        script.forEach(step => {
            cumulativeDelay += (step.delay || 1000);
            setTimeout(() => this.executeStep(step), cumulativeDelay);
        });
    },

    executeStep(step) {
        console.log("🎬 TONI führt aus:", step.type);
        
        switch(step.type) {
            case 'speak':
                if(window.ToniVoice) window.ToniVoice.speak(step.text);
                break;
            case 'place':
                this.addEquipment(step.obj, step.x, step.y);
                break;
            case 'deploy':
                this.moveFromBench(step.count, step.positions);
                break;
            case 'move':
                const el = this.elements.find(e => e.id === step.id || e.name === step.id);
                if(el) { el.targetX = step.x; el.targetY = step.y; }
                break;
            case 'pass':
                this.animatePass(step.x1, step.y1, step.x2, step.y2);
                break;
            case 'path':
                this.paths.push({ x1: step.x1, y1: step.y1, x2: step.x2, y2: step.y2, mode: step.mode });
                break;
            case 'clear':
                this.clearBoard(true);
                break;
        }
    },

    // --- HILFSFUNKTIONEN FÜR ANIMATIONEN ---

    moveFromBench(count, positions) {
        const fieldH = this.canvas.height - this.benchHeight;
        // Finde Spieler, die noch auf der Bank sind
        const benchPlayers = this.elements.filter(el => el.y > fieldH);
        
        for(let i = 0; i < count; i++) {
            if(benchPlayers[i] && positions[i]) {
                benchPlayers[i].targetX = positions[i].x;
                benchPlayers[i].targetY = positions[i].y;
            }
        }
    },

    animatePass(x1, y1, x2, y2) {
        this.ball.active = true;
        this.ball.x = x1; this.ball.y = y1;
        this.ball.targetX = x2; this.ball.targetY = y2;
        this.paths.push({ x1, y1, x2, y2, mode: 'pass' });
    },

    clearBoard(full = false) {
        this.equipment = [];
        this.paths = [];
        this.ball.active = false;
        if(full) {
            const h = this.canvas.height;
            this.elements.forEach((el, i) => {
                el.targetX = (85 + (i % 8) * 95);
                el.targetY = h - 90;
            });
        }
    },

    // --- DRAWING CORE (ERWEITERT) ---
    
    render() {
        if(!this.ctx) return;
        const w = this.canvas.width; const h = this.canvas.height;
        const fieldH = h - this.benchHeight;

        this.ctx.fillStyle = "#050a05";
        this.ctx.fillRect(0, 0, w, h);
        
        this.drawPitch(this.ctx, w, fieldH);
        this.drawGreenkeeper(this.ctx, w, fieldH);

        // Zeichne Vektoren (Pfade)
        this.paths.forEach(p => this.drawVector(p));

        // Zeichne Equipment
        this.equipment.forEach(item => this.drawItem(this.ctx, item));

        // Bench Area
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, fieldH, w, this.benchHeight);
        this.ctx.strokeStyle = "var(--data-cyan)";
        this.ctx.beginPath(); this.ctx.moveTo(0, fieldH); this.ctx.lineTo(w, fieldH); this.ctx.stroke();

        // Spieler
        this.elements.forEach(el => {
            const isOnBench = el.y > fieldH - 10;
            if (isOnBench) this.drawEliteCard(this.ctx, el);
            else this.drawTacticalDot(this.ctx, el);
        });

        // Zeichne Ball
        if(this.ball.active) this.drawBall();
    },

    drawVector(p) {
        const ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = p.mode === 'pass' ? 'rgba(255,255,255,0.6)' : 'var(--accent-gold)';
        ctx.lineWidth = 2;
        if(p.mode === 'pass') ctx.setLineDash([8, 8]);
        
        ctx.beginPath();
        ctx.moveTo(p.x1, p.y1);
        ctx.lineTo(p.x2, p.y2);
        ctx.stroke();

        // Pfeilspitze für Laufwege
        if(p.mode === 'run') {
            const angle = Math.atan2(p.y2 - p.y1, p.x2 - p.x1);
            ctx.translate(p.x2, p.y2);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-10, -5);
            ctx.lineTo(-10, 5);
            ctx.fillStyle = 'var(--accent-gold)';
            ctx.fill();
        }
        ctx.restore();
    },

    drawBall() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, 6, 0, Math.PI*2);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();
        this.ctx.restore();
    },

    update() {
        let moving = false;
        // Update Spieler
        this.elements.forEach(el => {
            const dx = el.targetX - el.x; const dy = el.targetY - el.y;
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) { el.x += dx * 0.1; el.y += dy * 0.1; moving = true; }
        });
        // Update Ball
        if(this.ball.active) {
            const bdx = this.ball.targetX - this.ball.x;
            const bdy = this.ball.targetY - this.ball.y;
            if (Math.abs(bdx) > 0.5 || Math.abs(bdy) > 0.5) { 
                this.ball.x += bdx * 0.15; 
                this.ball.y += bdy * 0.15; 
                moving = true; 
            }
        }
        this.isAnimating = moving;
    },

    // --- STANDARDS (Bleiben erhalten) ---
    drawPitch(ctx, w, fieldH) { /* ... Dein bisheriger Code für Pitch ... */ 
        // (Behalte hier deine drawPitch-Logik von oben bei)
        const m = 50; ctx.strokeStyle = "rgba(57, 255, 20, 0.4)"; ctx.setLineDash([]); ctx.lineWidth = 2;
        ctx.strokeRect(m, m, w - (m*2), fieldH - (m*2));
        if (this.currentPitchMode === 'grossfeld') {
            ctx.beginPath(); ctx.moveTo(w/2, m); ctx.lineTo(w/2, fieldH-m); ctx.stroke();
            ctx.beginPath(); ctx.arc(w/2, fieldH/2, 65, 0, Math.PI*2); ctx.stroke();
            const drawBox = (x, dir) => { ctx.strokeRect(x, fieldH/2 - 120, 130 * dir, 240); ctx.strokeRect(x, fieldH/2 - 50, 45 * dir, 100); };
            drawBox(m, 1); drawBox(w-m, -1);
        } else if (this.currentPitchMode === 'funino') {
            ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(m + 120, m); ctx.lineTo(m + 120, fieldH-m); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(w - m - 120, m); ctx.lineTo(w - m - 120, fieldH-m); ctx.stroke(); ctx.setLineDash([]);
            const tW = 8, tH = 40; ctx.strokeStyle = "#fff"; ctx.lineWidth = 3;
            ctx.strokeRect(m-tW, fieldH/2-110-tH/2, tW, tH); ctx.strokeRect(m-tW, fieldH/2+110-tH/2, tW, tH);
            ctx.strokeRect(w-m, fieldH/2-110-tH/2, tW, tH); ctx.strokeRect(w-m, fieldH/2+110-tH/2, tW, tH);
        }
    },

    drawGreenkeeper(ctx, w, h) { /* ... Dein bisheriger Code ... */ 
        if (!this.isTransitioning) return;
        this.greenkeeperPos += 25; ctx.save();
        const gradient = ctx.createLinearGradient(this.greenkeeperPos, 0, this.greenkeeperPos + 200, 0);
        gradient.addColorStop(0, 'transparent'); gradient.addColorStop(0.5, 'rgba(57, 255, 20, 0.1)'); gradient.addColorStop(1, 'rgba(57, 255, 20, 0.5)');
        ctx.fillStyle = gradient; ctx.fillRect(this.greenkeeperPos, 0, 200, h);
        ctx.strokeStyle = "var(--neon-green)"; ctx.lineWidth = 5; ctx.beginPath();
        ctx.moveTo(this.greenkeeperPos + 200, 0); ctx.lineTo(this.greenkeeperPos + 200, h); ctx.stroke(); ctx.restore();
        if (this.greenkeeperPos > w + 200) this.isTransitioning = false;
    },

    drawEliteCard(ctx, el) { /* ... Dein bisheriger Code ... */ 
        ctx.save(); const cw = 80, ch = 110; const x = el.x - cw/2, y = el.y - ch/2;
        ctx.beginPath(); ctx.moveTo(x, y+15); ctx.lineTo(x+cw/2, y); ctx.lineTo(x+cw, y+15); ctx.lineTo(x+cw, y+ch-20); ctx.lineTo(x+cw/2, y+ch); ctx.lineTo(x, y+ch-20); ctx.closePath();
        ctx.fillStyle = "#0a0a0a"; ctx.fill(); ctx.strokeStyle = el.color || 'var(--neon-green)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "bold 16px Orbitron"; ctx.fillText(el.rat || 80, x+12, y+35);
        ctx.font = "900 9px Inter"; ctx.textAlign = "center"; ctx.fillText(el.name ? el.name.split(' ').pop().toUpperCase() : 'PRO', el.x, y+ch-15); ctx.restore();
    },

    drawTacticalDot(ctx, el) { /* ... Dein bisheriger Code ... */ 
        ctx.save(); ctx.beginPath(); ctx.arc(el.x, el.y, 18, 0, Math.PI*2); ctx.fillStyle = el.color || 'var(--neon-green)'; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#000"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(el.number || '?', el.x, el.y); ctx.restore();
    },

    drawItem(ctx, item) {
        ctx.save();
        if (item.type === 'goal') { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.strokeRect(item.x - 10, item.y - 25, 10, 50); }
        else if (item.type === 'cone') { ctx.fillStyle = "var(--accent-orange)"; ctx.beginPath(); ctx.moveTo(item.x, item.y-10); ctx.lineTo(item.x-10, item.y+10); ctx.lineTo(item.x+10, item.y+10); ctx.fill(); }
        ctx.restore();
    },

    addEquipment(type, x, y) { this.equipment.push({ type, x, y, id: Date.now() }); },
    
    setPitchMode(newMode) { /* ... Dein Code ... */ 
        if (this.currentPitchMode === newMode || this.isTransitioning) return;
        this.isTransitioning = true; this.greenkeeperPos = -300;
        const checkPoint = setInterval(() => { if (this.greenkeeperPos > this.canvas.width / 2) { this.currentPitchMode = newMode; clearInterval(checkPoint); } }, 50);
    },

    resize() { const c = document.getElementById('stage-container'); if(!c) return; this.canvas.width = c.clientWidth; this.canvas.height = c.clientHeight; },
    renderLoop() { this.update(); this.render(); requestAnimationFrame(() => this.renderLoop()); },
    
    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left, my = e.clientY - rect.top;
            this.selectedElement = this.elements.find(el => Math.sqrt((mx-el.x)**2 + (my-el.y)**2) < 45);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.selectedElement) return;
            const rect = this.canvas.getBoundingClientRect();
            this.selectedElement.x = e.clientX - rect.left; this.selectedElement.y = e.clientY - rect.top;
            this.selectedElement.targetX = this.selectedElement.x; this.selectedElement.targetY = this.selectedElement.y;
        });
        this.canvas.addEventListener('mouseup', () => { this.selectedElement = null; });
        window.addEventListener('resize', () => this.resize());
    },

    syncFromDatabase() {
        if(!this.canvas || !window.Database) return;
        const players = window.Database.players || [];
        const h = this.canvas.height;
        this.elements = players.map((p, i) => ({
            ...p, type: 'player', 
            x: p.x || (85 + (i % 8) * 95), y: p.y || (h - 90),
            targetX: p.x || (85 + (i % 8) * 95), targetY: p.y || (h - 90),
            color: (p.assignment === 'Trainer') ? 'var(--accent-orange)' : 'var(--neon-green)'
        }));
    }
};
