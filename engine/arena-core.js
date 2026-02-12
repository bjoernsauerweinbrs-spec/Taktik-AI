/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE STATS SYNC)
 * Fokus: Pitch-Geometrie, FIFA Card Stats & Dynamisches Ranking
 * Status: ETAPPE 1.5 - KARTEN-LOGIK VERSIEGELT
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

        ctx.fillStyle = "#05080F";
        ctx.fillRect(0, 0, w, h);

        this.drawPitchGeometry(ctx, w, h);
        this.drawBanners(ctx, w, h);

        const team = window.currentTeamContext || "Senioren";
        const players = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        players.forEach(p => this.renderPlayer(ctx, p));
    },

    /**
     * Bestimmt den Rang basierend auf dem Rating (für CSS-Anbindung)
     */
    getPlayerRank(rating) {
        if (rating >= 90) return "elite";
        if (rating >= 80) return "gold";
        if (rating >= 70) return "silver";
        return "bronze";
    },

    drawPitchGeometry(ctx, w, h) {
        const neonGreen = "#39FF14";
        const neonBlue = "#00D1FF";
        ctx.strokeStyle = neonGreen;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = neonGreen;

        const pad = 60;
        const fW = w - (pad * 2);
        const fH = h - (pad * 2);
        const midX = w / 2;
        const midY = h / 2;

        ctx.strokeRect(pad, pad, fW, fH);
        ctx.beginPath(); ctx.moveTo(midX, pad); ctx.lineTo(midX, h - pad); ctx.stroke();
        ctx.beginPath(); ctx.arc(midX, midY, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = neonGreen;
        ctx.beginPath(); ctx.arc(midX, midY, 3, 0, Math.PI * 2); ctx.fill();

        this.drawAreaDetails(ctx, pad, midY, 1);
        this.drawAreaDetails(ctx, w - pad, midY, -1);

        ctx.strokeStyle = neonBlue;
        ctx.shadowColor = neonBlue;
        ctx.lineWidth = 5;
        ctx.strokeRect(pad - 20, midY - 50, 20, 100);
        ctx.strokeRect(w - pad, midY - 50, 20, 100);
        ctx.shadowBlur = 0;
    },

    drawAreaDetails(ctx, x, y, side) {
        ctx.strokeRect(x, y - 160, 135 * side, 320);
        ctx.strokeRect(x, y - 60, 45 * side, 120);
        ctx.beginPath(); ctx.arc(x + (90 * side), y, 3, 0, Math.PI * 2); ctx.fill();
        const startAng = side === 1 ? -0.65 : Math.PI - 0.65;
        const endAng = side === 1 ? 0.65 : Math.PI + 0.65;
        ctx.arc(x + (90 * side), y, 75, startAng, endAng, side === -1);
        ctx.stroke();
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
        const rank = this.getPlayerRank(p.rat);
        let color = '#FF3B30'; // Default Trainer Team
        if (p.assignment === 'Toni') color = '#39FF14';
        
        // Elite-Spieler bekommen einen speziellen Glow auf dem Feld
        if (rank === "elite") {
            ctx.shadowBlur = 25;
            ctx.shadowColor = "#00D1FF";
        } else {
            ctx.shadowBlur = 15;
            ctx.shadowColor = color;
        }

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

        if (this.showNames && p.name) {
            ctx.font = "bold 10px Orbitron";
            const name = p.name.split(' ').pop().toUpperCase();
            ctx.fillText(name, p.x, p.y + 42);
        }
    },

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleEnd());
        this.canvas.addEventListener('touchstart', (e) => this.handleStart(e.touches[0]));
        this.canvas.addEventListener('touchmove', (e) => this.handleMove(e.touches[0]));
        this.canvas.addEventListener('touchend', () => this.handleEnd());
    },

    handleStart(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
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

    /**
     * Erzeugt die Elite FIFA Mini-Cards für die Ersatzbank
     */
    renderBench() {
        const bench = document.getElementById('arena-bench-list');
        if (!bench) return;
        const team = window.currentTeamContext || "Senioren";
        const substitutes = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && !p.onField && p.assignment === 'Trainer'
        );
        
        bench.innerHTML = substitutes.map(p => {
            const rank = this.getPlayerRank(p.rat);
            return `
                <div class="fifa-card-mini" data-rank="${rank}" data-id="${p.id}" onclick="window.MobileTactics.handleBenchClick('${p.id}')">
                    <div class="mini-rat">${p.rat}</div>
                    <div class="mini-pos">${p.pos}</div>
                    <div class="mini-name">${p.name.split(' ').pop().toUpperCase()}</div>
                    
                    <div class="hidden-stats" style="display:none;" 
                         data-pac="${p.pac || 50}" data-sho="${p.sho || 50}" 
                         data-pas="${p.pas || 50}" data-dri="${p.dri || 50}" 
                         data-def="${p.def || 50}" data-phy="${p.phy || 50}">
                    </div>
                </div>
            `;
        }).join('');
    }
};
