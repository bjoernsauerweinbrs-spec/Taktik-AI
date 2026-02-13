/**
 * TONI 2.0 - ARENA ENGINE CORE (ELITE STATS SYNC)
 * Fokus: Pitch-Geometrie, Training-Equipment & Drag-Logik
 * Status: ETAPPE 1.5 - GEOMETRIE & EQUIPMENT VERSIEGELT
 */
window.Arena = {
    canvas: null,
    ctx: null,
    showNames: true,
    draggedObject: null, // Kann Spieler oder Hütchen sein
    equipment: [], // Speicher für Hütchen, Bälle, Tore

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

        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = "#05080F";
        ctx.fillRect(0, 0, w, h);

        this.drawPitchGeometry(ctx, w, h);
        this.drawBanners(ctx, w, h);

        // 1. Equipment zeichnen (Hütchen, Bälle)
        this.equipment.forEach(item => this.renderEquipment(ctx, item));

        // 2. Aktive Spieler zeichnen
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

        // Außenlinie & Mittellinie
        ctx.strokeRect(pad, pad, fW, fH);
        ctx.beginPath(); ctx.moveTo(midX, pad); ctx.lineTo(midX, h - pad); ctx.stroke();
        
        // Mittelkreis
        ctx.beginPath(); ctx.arc(midX, midY, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = neonGreen;
        ctx.beginPath(); ctx.arc(midX, midY, 3, 0, Math.PI * 2); ctx.fill();

        // Strafräume (Links & Rechts)
        this.drawDetailedArea(ctx, pad, midY, 1);
        this.drawDetailedArea(ctx, w - pad, midY, -1);

        ctx.shadowBlur = 0;
    },

    drawDetailedArea(ctx, x, y, side) {
        // 16m Raum
        ctx.strokeRect(x, y - 180, 150 * side, 360);
        
        // 5m Raum (Torraum)
        ctx.strokeStyle = "rgba(57, 255, 20, 0.4)";
        ctx.strokeRect(x, y - 70, 50 * side, 140);
        ctx.strokeStyle = "rgba(57, 255, 20, 0.8)";

        // Elfmeterpunkt
        ctx.beginPath(); ctx.arc(x + (100 * side), y, 3, 0, Math.PI * 2); ctx.fill();

        // Der Teilkreis (D-Bogen) - Fix für "wirre Kreise"
        ctx.beginPath();
        const startAng = side === 1 ? -0.85 : Math.PI - 0.85;
        const endAng = side === 1 ? 0.85 : Math.PI + 0.85;
        ctx.arc(x + (100 * side), y, 80, startAng, endAng, side === -1);
        ctx.stroke();
    },

    renderPlayer(ctx, p) {
        const rating = parseInt(p.rat) || 0;
        let color = p.assignment === 'Toni' ? '#39FF14' : '#FF3131';
        
        // Elite Glow
        if (rating >= 90) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#00D1FF";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Nummer & Name
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
        ctx.save();
        if (item.type === 'cone') {
            ctx.fillStyle = "#FF6A00"; // Hütchen Orange
            ctx.beginPath();
            ctx.moveTo(item.x, item.y - 15);
            ctx.lineTo(item.x + 15, item.y + 15);
            ctx.lineTo(item.x - 15, item.y + 15);
            ctx.closePath();
            ctx.fill();
        } else if (item.type === 'ball') {
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#000";
            ctx.stroke();
        }
        ctx.restore();
    },

    addEquipment(type) {
        this.equipment.push({
            id: Date.now(),
            type: type,
            x: 200,
            y: 200
        });
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
            // 1. Check Equipment Drag
            this.draggedObject = this.equipment.find(item => Math.hypot(item.x - m.x, item.y - m.y) < 20);
            
            // 2. Check Player Drag (nur Trainer Team)
            if (!this.draggedObject) {
                this.draggedObject = window.Database.players.find(p => 
                    p.onField && p.assignment === 'Trainer' && Math.hypot(p.x - m.x, p.y - m.y) < 25
                );
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (!this.draggedObject) return;
            const m = getMouse(e);
            this.draggedObject.x = m.x;
            this.draggedObject.y = m.y;
        });

        this.canvas.addEventListener('mouseup', () => {
            if (this.draggedObject && this.draggedObject.onField) window.Database.save();
            this.draggedObject = null;
        });
    },

    applyDefaultFormations() {
        const team = window.currentTeamContext || "Senioren";
        const players = window.Database?.players || [];
        const activeSquad = players.filter(p => (team === "Senioren" ? p.team === "Senioren" : p.jugend === team));
        
        // Formationen: Trainer 4-4-2 vs Toni 3-4-3
        this.calculatePositions(activeSquad.filter(p => p.assignment === 'Trainer').slice(0, 11), [1, 4, 4, 2], 'left');
        this.calculatePositions(activeSquad.filter(p => p.assignment === 'Toni').slice(0, 11), [1, 3, 4, 3], 'right');
    },

    calculatePositions(players, lines, side) {
        let pIdx = 0;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const sectionW = w / 2;
        const xOffset = side === 'left' ? 0 : sectionW;

        lines.forEach((count, lineIdx) => {
            for (let i = 0; i < count; i++) {
                if (!players[pIdx]) break;
                players[pIdx].onField = true;
                let relX = (lineIdx / (lines.length - 0.5)) * sectionW;
                if (side === 'right') relX = sectionW - relX;
                players[pIdx].x = xOffset + relX + (side === 'left' ? 60 : -60);
                players[pIdx].y = (h / (count + 1)) * (i + 1);
                pIdx++;
            }
        });
    },

    renderBench() {
        // (Logik bleibt wie gehabt, wird durch renderMainGrid aufgerufen)
    },

    drawBanners(ctx, w, h) {
        ctx.fillStyle = "rgba(2, 4, 8, 0.8)";
        ctx.fillRect(0, 0, w, 40);
        ctx.fillRect(0, h - 40, w, 40);
        ctx.fillStyle = "#39FF14";
        ctx.font = "900 12px Orbitron";
        ctx.textAlign = "center";
        ctx.fillText("TONI 2.0 ELITE TACTICAL SYSTEM - LIVE BIOMETRIC FEED", w/2, 25);
        ctx.fillText("ACTIVE SESSION: " + (window.currentTeamContext || "SENIOREN"), w/2, h - 15);
    }
};
