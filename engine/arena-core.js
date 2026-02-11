/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE POSITION SYNC)
 * Fokus: Trainer (Links, 4-4-2) vs. Toni (Rechts, 3-4-3)
 * Status: STEP 2 COMPLETED - FORMATION LOGIC FIXED
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    activeSponsorIndex: 0,
    lastRotation: 0,
    rotationSpeed: 5000, 

    init() {
        console.log("🏟️ Arena Engine: Initialisiere High-Tech Spielfeld...");
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Master-Formation Sync
        this.applyDefaultFormations();
        
        this.setupEventListeners();
        this.initChatListener(); 
        
        this.startAnimationLoop();
        this.renderBench();
        this.triggerWelcome();
    },

    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        // Filter: Nur Spieler des aktuellen Teams, die zum Kader gehören
        const activeSquad = players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));

        // 1. TRAINER TEAM (ROT) - Formation: 4-4-2 (Links)
        const trainerPlayers = activeSquad.filter(p => p.assignment === 'Trainer').slice(0, 11);
        this.positionFormation(trainerPlayers, [1, 4, 4, 2], 'left', w, h);

        // 2. TONI TEAM (GRÜN) - Formation: 3-4-3 (Rechts)
        const toniPlayers = activeSquad.filter(p => p.assignment === 'Toni').slice(0, 11);
        this.positionFormation(toniPlayers, [1, 3, 4, 3], 'right', w, h);

        console.log("⚽ Formationen gesetzt: Trainer (4-4-2) vs. Toni (3-4-3)");
    },

    /**
     * Verteilt Spieler basierend auf Linien-Arrays [TW, AB, MF, ST]
     */
    positionFormation(players, lines, side, canvasW, canvasH) {
        let pIdx = 0;
        const sectionW = canvasW / 2;
        const xOffset = side === 'left' ? 0 : sectionW;

        lines.forEach((count, lineIdx) => {
            for (let i = 0; i < count; i++) {
                if (!players[pIdx]) break;
                
                players[pIdx].onField = true;
                
                // X-Position: Je nach Linie (0 = Torwart, 3 = Sturm)
                let relativeX = (lineIdx / (lines.length - 0.5)) * sectionW;
                if (side === 'right') relativeX = sectionW - relativeX;
                
                players[pIdx].x = xOffset + relativeX + (side === 'left' ? 50 : -50);
                
                // Y-Position: Gleichmäßige Verteilung in der Vertikalen
                players[pIdx].y = (canvasH / (count + 1)) * (i + 1);
                
                pIdx++;
            }
        });
    },

    // --- RENDERING LOGIK ---

    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.fillStyle = "#050505"; 
        ctx.fillRect(0, 0, w, h);
        
        this.drawPitchLines(ctx, w, h);
        this.drawBanners(ctx, w, h);

        const team = window.currentTeamContext || "Senioren";
        const playersOnField = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.drawPlayerOnBoard(p));
    },

    drawPlayerOnBoard(p) {
        const ctx = this.ctx;
        const isToni = p.assignment === 'Toni';
        const color = isToni ? '#39ff14' : '#ff3b30'; // Toni=Grün, Trainer=Rot

        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 5);

        if (!isToni && this.showNames && p.name) {
            ctx.font = "bold 10px Orbitron";
            const lastName = p.name.split(' ').pop().toUpperCase();
            ctx.fillText(lastName, p.x, p.y + 35);
        }
    },

    // ... (drawPitchLines, drawBanners, eventListener etc. bleiben wie im Original)
    
    drawPitchLines(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, w-100, h-100);
        ctx.beginPath();
        ctx.moveTo(w/2, 50); ctx.lineTo(w/2, h-50);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w/2, h/2, 60, 0, Math.PI*2);
        ctx.stroke();
    },

    drawBanners(ctx, w, h) {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, w, 40);
        ctx.fillRect(0, h-40, w, 40);
        ctx.fillStyle = "rgba(57, 255, 20, 0.5)";
        ctx.font = "10px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText("+++ FC TONI 2.0 ELITE ARENA +++", w/2, 25);
    },

    initChatListener() { /* Original Logic */ },
    handleCommand(cmd) { /* Original Logic */ },
    triggerWelcome() { /* Original Logic */ },
    startAnimationLoop() {
        const loop = (time) => {
            this.update(time);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },
    update(time) { /* Sponsor Rotation */ },
    renderBench() { /* Mini Cards */ },
    setupEventListeners() { /* Tap Logic */ }
};
