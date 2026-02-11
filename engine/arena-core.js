/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE BOARD SYSTEM)
 * Fokus: Unzerstörbare Markierungen, Tore & Formations-Sync
 * Status: ETAPPE 1.2 - FUNDAMENT VERSIEGELT
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
        
        // Initialer Kader-Positionierungs-Sync
        this.applyDefaultFormations();
        
        // Listener & Chat-Logic
        this.setupEventListeners();
        this.initChatListener(); 
        
        // Start des permanenten Render-Loops
        this.startAnimationLoop();
        this.renderBench();
        this.triggerWelcome();
    },

    /**
     * Setzt die Basis-Formationen: Trainer (4-4-2, Links) vs. Toni (3-4-3, Rechts)
     */
    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const w = this.canvas.width;
        const h = this.canvas.height;

        const activeSquad = players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));

        // Trainer Team (Rot) - Links
        const trainerPlayers = activeSquad.filter(p => p.assignment === 'Trainer').slice(0, 11);
        this.calculatePositions(trainerPlayers, [1, 4, 4, 2], 'left', w, h);

        // Toni Team (Grün) - Rechts
        const toniPlayers = activeSquad.filter(p => p.assignment === 'Toni').slice(0, 11);
        this.calculatePositions(toniPlayers, [1, 3, 4, 3], 'right', w, h);
    },

    calculatePositions(players, lines, side, canvasW, canvasH) {
        let pIdx = 0;
        const sectionW = canvasW / 2;
        const xOffset = side === 'left' ? 0 : sectionW;

        lines.forEach((count, lineIdx) => {
            for (let i = 0; i < count; i++) {
                if (!players[pIdx]) break;
                players[pIdx].onField = true;
                
                let relativeX = (lineIdx / (lines.length - 0.5)) * sectionW;
                if (side === 'right') relativeX = sectionW - relativeX;
                
                players[pIdx].x = xOffset + relativeX + (side === 'left' ? 60 : -60);
                players[pIdx].y = (canvasH / (count + 1)) * (i + 1);
                pIdx++;
            }
        });
    },

    startAnimationLoop() {
        const loop = (time) => {
            this.update(time);
            this.draw();
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    },

    update(time) {
        if (time - this.lastRotation > this.rotationSpeed) {
            const sponsors = window.Database?.sponsors || [];
            this.activeSponsorIndex = sponsors.length > 0 ? (this.activeSponsorIndex + 1) % sponsors.length : 0;
            this.lastRotation = time;
        }
    },

    /**
     * HAUPT-ZEICHENFUNKTION (Jeder Frame baut das Feld neu auf)
     */
    draw() {
        if (!this.ctx) return;
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Spielfeld Hintergrund (Deep Black)
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, w, h);

        // 2. Markierungen & Tore (Hard-Coded Basis)
        this.drawPitchGeometry(ctx, w, h);

        // 3. Spieler-Rendering (Ebene über dem Feld)
        const team = window.currentTeamContext || "Senioren";
        const playersOnField = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        playersOnField.forEach(p => this.renderPlayer(ctx, p));
    },

    drawPitchGeometry(ctx, w, h) {
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;

        const pad = 50; // Padding vom Rand
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

        // Strafräume (16m)
        ctx.strokeRect(pad, h / 2 - 160, 130, 320); // Links
        ctx.strokeRect(w - pad - 130, h / 2 - 160, 130, 320); // Rechts

        // TORE (FEST VERANKERT IN BLAU)
        ctx.strokeStyle = "#00d1ff";
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00d1ff";
        
        // Tor Links
        ctx.strokeRect(pad - 15, h / 2 - 50, 15, 100);
        // Tor Rechts
        ctx.strokeRect(w - pad, h / 2 - 50, 15, 100);
        
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
    },

    renderPlayer(ctx, p) {
        const isToni = p.assignment === 'Toni';
        const color = isToni ? '#39ff14' : '#ff3b30';

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
        ctx.font = "bold 15px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "0", p.x, p.y + 6);

        if (!isToni && this.showNames && p.name) {
            ctx.font = "bold 10px Orbitron";
            const name = p.name.split(' ').pop().toUpperCase();
            ctx.fillText(name, p.x, p.y + 40);
        }
    },

    renderBench() {
        const bench = document.getElementById('arena-bench-list');
        if (!bench) return;
        const team = window.currentTeamContext || "Senioren";
        const substitutes = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && !p.onField && p.assignment === 'Trainer'
        );
        
        bench.innerHTML = substitutes.map(p => `
            <div class="fifa-card-mini" style="border: 1px solid #333; background: #111; padding: 10px; border-radius: 5px; text-align: center; min-width: 80px;">
                <div style="font-size: 10px; color: #666;">${p.pos}</div>
                <div style="font-weight: bold; font-size: 12px; color: #fff;">${p.name.split(' ').pop()}</div>
                <div style="font-size: 14px; color: #39ff14;">${p.rat}</div>
            </div>
        `).join('');
    },

    setupEventListeners() { /* Tap/Drag Logic Link */ },
    initChatListener() { /* Input Handler */ },
    handleCommand(cmd) { /* Voice/Text Command Handler */ },
    triggerWelcome() { /* Intro Speech */ },
    drawBanners() { /* Sponsor Render */ }
};
