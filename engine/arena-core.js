/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE STATS SYNC)
 * Fokus: Dynamische Pitch-Geometrie (Funino, Kleinfeld, Grossfeld)
 * Status: SMART PITCH UPDATE 2026
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    draggedObject: null,
    equipment: [],
    pitchMode: 'grossfeld', // 'funino', 'kleinfeld', 'grossfeld'

    init() {
        this.canvas = document.getElementById('tactic-board');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        this.applyDefaultFormations();
        this.setupEventListeners();
        this.startAnimationLoop();
    },

    setPitchMode(mode) {
        console.log("🏟️ Arena-Transformation:", mode);
        this.pitchMode = mode;
        // Bei Funino-Wechsel positionieren wir die Spieler oft neu, falls nötig
        if(mode === 'funino') this.equipment = []; 
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

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#05080F";
        ctx.fillRect(0, 0, w, h);

        this.drawPitchGeometry(ctx, w, h);
        this.drawBanners(ctx, w, h);

        this.equipment.forEach(item => this.renderEquipment(ctx, item));

        const team = window.currentTeamContext || "Senioren";
        const players = (window.Database?.players || []).filter(p => 
            (team === "Senioren" ? p.team === "Senioren" : p.jugend === team) && p.onField
        );

        players.forEach(p => this.renderPlayer(ctx, p));
    },

    drawPitchGeometry(ctx, w, h) {
        const neonGreen = "rgba(57, 255, 20, 0.8)";
        ctx.strokeStyle = neonGreen;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = neonGreen;

        const pad = 60;
        const fW = w - (pad * 2);
        const fH = h - (pad * 2);
        const midX = w / 2;
        const midY = h / 2;

        // 1. Außen- und Mittellinie (Basis für alle)
        ctx.strokeRect(pad, pad, fW, fH);
        ctx.beginPath(); ctx.moveTo(midX, pad); ctx.lineTo(midX, h - pad); ctx.stroke();

        if (this.pitchMode === 'funino') {
            this.drawFuninoLayout(ctx, pad, fW, fH, midX, midY);
        } else if (this.pitchMode === 'kleinfeld') {
            this.drawSmallPitchLayout(ctx, pad, fW, fH, midX, midY);
        } else {
            this.drawFullPitchLayout(ctx, pad, fW, fH, midX, midY);
        }

        ctx.shadowBlur = 0;
    },

    drawFullPitchLayout(ctx, pad, fW, fH, midX, midY) {
        // Mittelkreis
        ctx.beginPath(); ctx.arc(midX, midY, 80, 0, Math.PI * 2); ctx.stroke();
        
        // Klassische Strafräume
        this.drawPenaltyArea(ctx, pad, midY, 1, false);
        this.drawPenaltyArea(ctx, this.canvas.width - pad, midY, -1, false);
    },

    drawSmallPitchLayout(ctx, pad, fW, fH, midX, midY) {
        // Vereinfachter Mittelkreis
        ctx.beginPath(); ctx.arc(midX, midY, 60, 0, Math.PI * 2); ctx.stroke();
        
        // Jugend-Strafräume (etwas kleiner)
        this.drawPenaltyArea(ctx, pad, midY, 1, true);
        this.drawPenaltyArea(ctx, this.canvas.width - pad, midY, -1, true);
    },

    drawFuninoLayout(ctx, pad, fW, fH, midX, midY) {
        // Schusszonen (6m Linien) statt Strafräume
        const zoneWidth = 120;
        ctx.setLineDash([10, 10]); // Gestrichelte Linie für Schusszone
        ctx.beginPath(); ctx.moveTo(pad + zoneWidth, pad); ctx.lineTo(pad + zoneWidth, pad + fH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad + fW - zoneWidth, pad); ctx.lineTo(pad + fW - zoneWidth, pad + fH); ctx.stroke();
        ctx.setLineDash([]);

        // 4 Minitore in den Ecken zeichnen
        const tSize = 40;
        ctx.lineWidth = 4;
        // Links
        ctx.strokeRect(pad - 5, pad + 20, 10, tSize); 
        ctx.strokeRect(pad - 5, pad + fH - 60, 10, tSize);
        // Rechts
        ctx.strokeRect(pad + fW - 5, pad + 20, 10, tSize);
        ctx.strokeRect(pad + fW - 5, pad + fH - 60, 10, tSize);
        ctx.lineWidth = 2;
    },

    drawPenaltyArea(ctx, x, y, side, isSmall) {
        const width = isSmall ? 100 : 150;
        const height = isSmall ? 250 : 360;
        
        ctx.strokeRect(x, y - (height/2), width * side, height);
        // Torraum
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.strokeRect(x, y - 60, (width/3) * side, 120);
        ctx.strokeStyle = "rgba(57, 255, 20, 0.8)";
    },

    renderPlayer(ctx, p) {
        let color = p.assignment === 'Toni' ? '#39FF14' : '#FF3131';
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText(p.number || "10", p.x, p.y + 6);

        if (this.showNames) {
            ctx.font = "bold 10px Inter";
            ctx.fillText(p.name.toUpperCase(), p.x, p.y + 45);
        }
    },

    renderEquipment(ctx, item) {
        if (item.type === 'cone') {
            ctx.fillStyle = "#FF6A00";
            ctx.beginPath();
            ctx.moveTo(item.x, item.y - 12);
            ctx.lineTo(item.x + 12, item.y + 12);
            ctx.lineTo(item.x - 12, item.y + 12);
            ctx.closePath();
            ctx.fill();
        }
    },

    setupEventListeners() {
        const getMouse = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
                y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
            };
        };

        this.canvas.addEventListener('mousedown', (e) => {
            const m = getMouse(e);
            this.draggedObject = window.Database.players.find(p => 
                p.onField && p.assignment === 'Trainer' && Math.hypot(p.x - m.x, p.y - m.y) < 25
            );
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.draggedObject) return;
            const m = getMouse(e);
            this.draggedObject.x = m.x;
            this.draggedObject.y = m.y;
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.draggedObject) window.Database.save();
            this.draggedObject = null;
        });
    },

    applyDefaultFormations() {
        // Standard-Setup beim Start
    },

    drawBanners(ctx, w, h) {
        ctx.fillStyle = "rgba(2, 4, 8, 0.8)";
        ctx.fillRect(0, 0, w, 40);
        ctx.fillStyle = "#39FF14";
        ctx.font = "900 12px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText("ARENA MODE: " + this.pitchMode.toUpperCase(), w/2, 25);
    }
};
