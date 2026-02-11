/**
 * TONI 2.0 - ARENA ENGINE CORE (PRO NEON SYNC)
 * Fokus: Neon-Glow Pitch, Drag-and-Drop Support & Branding
 * Status: ETAPPE 1.1 - FUNDAMENT & INTERAKTION VERSIEGELT
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    draggedPlayer: null,

    init() {
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.applyDefaultFormations();
        this.setupEventListeners();
        
        this.startAnimationLoop();
        this.renderBench();
    },

    startAnimationLoop() {
        const loop = () => {
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld (Deep Black)
        ctx.fillStyle = "#05080F";
        ctx.fillRect(0, 0, w, h);

        // 2. Markierungen mit NEON-GLOW
        this.drawPitchGeometry(ctx, w, h);
        
        // 3. Bandenwerbung (TONI 2.0 Branding)
        this.drawBanners(ctx, w, h);

        // 4. Spieler-Rendering
        const team = window.currentTeamContext || "Senioren";
        const players = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        players.forEach(p => this.renderPlayer(ctx, p));
    },

    drawPitchGeometry(ctx, w, h) {
        const neonGreen = "#39FF14";
        const neonBlue = "#00D1FF";

        ctx.strokeStyle = neonGreen;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = neonGreen;

        const pad = 60;
        const fieldW = w - (pad * 2);
        const fieldH = h - (pad * 2);

        // Außenlinien & Mitte
        ctx.strokeRect(pad, pad, fieldW, fieldH);
        ctx.beginPath();
        ctx.moveTo(w / 2, pad); ctx.lineTo(w / 2, h - pad);
        ctx.stroke();

        // Mittelkreis
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 80, 0, Math.PI * 2);
        ctx.stroke();

        // Strafräume
        ctx.strokeRect(pad, h / 2 - 160, 130, 320); // Links
        ctx.strokeRect(w - pad - 130, h / 2 - 160, 130, 320); // Rechts

        // TORE (FEST VERANKERT & MASSIVER GLOW)
        ctx.strokeStyle = neonBlue;
        ctx.shadowColor = neonBlue;
        ctx.lineWidth = 5;
        ctx.strokeRect(pad - 20, h / 2 - 50, 20, 100); // Tor L
        ctx.strokeRect(w - pad, h / 2 - 50, 20, 100);    // Tor R
        
        ctx.shadowBlur = 0; // Reset für Performance
    },

    drawBanners(ctx, w, h) {
        ctx.fillStyle = "#020408";
        ctx.fillRect(0, 0, w, 45);
        ctx.fillRect(0, h - 45, w, 45);

        ctx.fillStyle = "#39FF14";
        ctx.font = "bold 12px Orbitron";
        ctx.textAlign = "center";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#39FF14";

        for (let i = 0; i < 5; i++) {
            ctx.fillText("TONI 2.0 ELITE SYSTEMS", 150 + (i * 250), 28);
            ctx.fillText("BIOMETRIC ANALYSIS ACTIVE", 150 + (i * 250), h - 18);
        }
        ctx.shadowBlur = 0;
    },

    renderPlayer(ctx, p) {
        const isToni = p.assignment === 'Toni';
        const color = isToni ? '#39FF14' : '#FF3B30';

        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 6);

        if (!isToni && this.showNames && p.name) {
            ctx.font = "bold 10px Orbitron";
            const name = p.name.split(' ').pop().toUpperCase();
            ctx.fillText(name, p.x, p.y + 42);
        }
    },

    setupEventListeners() {
        // DRAG & DROP LOGIK
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleEnd());
        
        // Touch Support
        this.canvas.addEventListener('touchstart', (e) => this.handleStart(e.touches[0]));
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e.touches[0]));
        this.canvas.addEventListener('touchend', () => this.handleEnd());
    },

    handleStart(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

        // Finde den geklickten Spieler (Nur Trainer-Team erlaubt zu verschieben)
        this.draggedPlayer = window.Database.players.find(p => 
            p.onField && p.assignment === 'Trainer' && 
            Math.hypot(p.x - mouseX, p.y - mouseY) < 30
        );
    },

    handleMove(e) {
        if (!this.draggedPlayer) return;
        const rect = this.canvas.getBoundingClientRect();
        this.draggedPlayer.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        this.draggedPlayer.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    },

    handleEnd() {
        if (this.draggedPlayer) window.Database.save();
        this.draggedPlayer = null;
    },

    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;
        const activeSquad = players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));

        this.calculatePositions(activeSquad.filter(p => p.assignment === 'Trainer').slice(0, 11), [1, 4, 4, 2], 'left', w, h);
        this.calculatePositions(activeSquad.filter(p => p.assignment === 'Toni').slice(0, 11), [1, 3, 4, 3], 'right', w, h);
    },

    calculatePositions(players, lines, side, canvasW, canvasH) {
        let pIdx = 0;
        const sectionW = canvasW / 2;
        const xOffset = side === 'left' ? 0 : sectionW;
        lines.forEach((count, lineIdx) => {
            for (let i = 0; i < count; i++) {
                if (!players[pIdx]) break;
                players[pIdx].onField = true;
                let relX = (lineIdx / (lines.length - 0.5)) * sectionW;
                if (side === 'right') relX = sectionW - relX;
                players[pIdx].x = xOffset + relX + (side === 'left' ? 60 : -60);
                players[pIdx].y = (canvasH / (count + 1)) * (i + 1);
                pIdx++;
            }
        });
    },

    renderBench() {
        const bench = document.getElementById('arena-bench-list');
        if (!bench) return;
        const team = window.currentTeamContext || "Senioren";
        const substitutes = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && !p.onField && p.assignment === 'Trainer'
        );
        
        bench.innerHTML = substitutes.map(p => `
            <div class="fifa-card-mini">
                <div class="mini-rat">${p.rat}</div>
                <div class="mini-pos">${p.pos}</div>
                <div style="font-size: 8px; font-weight: bold; margin-top: 2px;">${p.name.split(' ').pop().toUpperCase()}</div>
            </div>
        `).join('');
    }
};
